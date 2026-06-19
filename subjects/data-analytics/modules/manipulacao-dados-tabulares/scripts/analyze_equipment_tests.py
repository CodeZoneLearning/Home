"""Audit repeated equipment health classifications with pandas."""

from __future__ import annotations

import argparse
from pathlib import Path

import pandas as pd


MODULE_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_INPUT = MODULE_ROOT / "data" / "equipment_health_tests.csv"
DEFAULT_OUTPUT = MODULE_ROOT / "outputs"
REQUIRED_COLUMNS = {
    "test_id",
    "equipment_id",
    "test_timestamp",
    "site",
    "equipment_type",
    "operating_hours",
    "temperature_c",
    "vibration_mm_s",
    "health_status",
    "confidence_score",
}
STATUS_LABELS = {1: "Healthy", 2: "Attention", 3: "Degraded", 4: "Critical"}


def load_and_validate(path: Path) -> pd.DataFrame:
    """Load the raw CSV and fail fast when its contract is broken."""
    dataframe = pd.read_csv(path, parse_dates=["test_timestamp"])
    missing_columns = REQUIRED_COLUMNS.difference(dataframe.columns)

    if missing_columns:
        raise ValueError(f"Missing required columns: {sorted(missing_columns)}")
    if dataframe.empty:
        raise ValueError("The dataset is empty.")
    if dataframe["test_id"].duplicated().any():
        raise ValueError("test_id must be unique.")
    if not dataframe["health_status"].between(1, 4).all():
        raise ValueError("health_status must contain only classes 1 through 4.")
    if not dataframe["confidence_score"].between(0, 1).all():
        raise ValueError("confidence_score must be between 0 and 1.")
    if dataframe[list(REQUIRED_COLUMNS)].isna().any().any():
        raise ValueError("Required columns cannot contain null values.")
    if dataframe.groupby("equipment_id").size().min() < 2:
        raise ValueError("Every equipment must have at least two tests.")

    return dataframe.sort_values(["equipment_id", "test_timestamp"]).reset_index(drop=True)


def classify_consistency(unique_statuses: int, agreement_rate: float) -> str:
    if unique_statuses == 1:
        return "CONSISTENT"
    if agreement_rate >= 0.75:
        return "MOSTLY_CONSISTENT"
    return "INCONSISTENT"


def dominant_status(series: pd.Series) -> int:
    """Return the most frequent class; ties resolve to the lowest class."""
    return int(series.mode().min())


def equipment_summary(dataframe: pd.DataFrame) -> pd.DataFrame:
    grouped = dataframe.groupby("equipment_id", as_index=False).agg(
        site=("site", "first"),
        equipment_type=("equipment_type", "first"),
        tests_count=("test_id", "count"),
        unique_statuses=("health_status", "nunique"),
        dominant_status=("health_status", dominant_status),
        dominant_status_count=("health_status", lambda values: int(values.value_counts().max())),
        mean_confidence=("confidence_score", "mean"),
        std_confidence=("confidence_score", "std"),
        min_confidence=("confidence_score", "min"),
        max_confidence=("confidence_score", "max"),
    )

    grouped["agreement_rate"] = grouped["dominant_status_count"] / grouped["tests_count"]
    grouped["consistency_result"] = grouped.apply(
        lambda row: classify_consistency(int(row["unique_statuses"]), float(row["agreement_rate"])),
        axis=1,
    )
    grouped["dominant_status_label"] = grouped["dominant_status"].map(STATUS_LABELS)

    ordered_columns = [
        "equipment_id",
        "site",
        "equipment_type",
        "tests_count",
        "unique_statuses",
        "dominant_status",
        "dominant_status_label",
        "dominant_status_count",
        "agreement_rate",
        "mean_confidence",
        "std_confidence",
        "min_confidence",
        "max_confidence",
        "consistency_result",
    ]
    return grouped[ordered_columns].round(4).sort_values(["consistency_result", "equipment_id"])


def confidence_inference(dataframe: pd.DataFrame, summary: pd.DataFrame) -> pd.DataFrame:
    """Estimate mean confidence and a 95% normal-approximation interval by result."""
    consistency_lookup = summary.set_index("equipment_id")["consistency_result"]
    tests = dataframe.assign(
        consistency_result=dataframe["equipment_id"].map(consistency_lookup)
    )
    inference = tests.groupby("consistency_result", as_index=False).agg(
        test_count=("test_id", "count"),
        equipment_count=("equipment_id", "nunique"),
        mean_confidence=("confidence_score", "mean"),
        std_confidence=("confidence_score", "std"),
        standard_error=("confidence_score", "sem"),
    )
    inference["ci95_lower"] = inference["mean_confidence"] - 1.96 * inference["standard_error"]
    inference["ci95_upper"] = inference["mean_confidence"] + 1.96 * inference["standard_error"]
    return inference.round(4).sort_values("mean_confidence", ascending=False)


def unique_value_report(dataframe: pd.DataFrame) -> pd.DataFrame:
    return pd.DataFrame(
        {
            "column": dataframe.columns,
            "unique_values": [dataframe[column].nunique(dropna=False) for column in dataframe.columns],
            "missing_values": [dataframe[column].isna().sum() for column in dataframe.columns],
        }
    )


def run_analysis(input_path: Path, output_dir: Path) -> dict[str, pd.DataFrame]:
    dataframe = load_and_validate(input_path)
    summary = equipment_summary(dataframe)

    reports = {
        "equipment_consistency_summary.csv": summary,
        "descriptive_statistics.csv": dataframe.describe(include="all").transpose(),
        "unique_values_report.csv": unique_value_report(dataframe),
        "health_status_counts.csv": (
            dataframe["health_status"]
            .value_counts()
            .sort_index()
            .rename_axis("health_status")
            .reset_index(name="test_count")
            .assign(status_label=lambda frame: frame["health_status"].map(STATUS_LABELS))
        ),
        "confidence_inference.csv": confidence_inference(dataframe, summary),
    }

    output_dir.mkdir(parents=True, exist_ok=True)
    for filename, report in reports.items():
        report.to_csv(output_dir / filename, index=True if filename == "descriptive_statistics.csv" else False)

    print(f"Validated {len(dataframe)} tests from {dataframe['equipment_id'].nunique()} equipment units.")
    print("\nConsistency by equipment:")
    print(summary["consistency_result"].value_counts().to_string())
    print("\nMean confidence and 95% confidence interval:")
    print(reports["confidence_inference.csv"].round(3).to_string(index=False))
    print(f"\nSaved {len(reports)} reports to {output_dir}")
    return reports


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT, help="Path to the raw CSV.")
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT, help="Directory for generated reports.")
    return parser.parse_args()


if __name__ == "__main__":
    arguments = parse_args()
    run_analysis(arguments.input, arguments.output_dir)
