"""Generate reproducible metric examples for classification, regression, and clustering."""

from __future__ import annotations

import json
import os
from pathlib import Path

os.environ.setdefault("LOKY_MAX_CPU_COUNT", "1")

import numpy as np
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs
from sklearn.metrics import (
    accuracy_score,
    average_precision_score,
    balanced_accuracy_score,
    brier_score_loss,
    calinski_harabasz_score,
    confusion_matrix,
    davies_bouldin_score,
    f1_score,
    log_loss,
    mean_absolute_error,
    mean_absolute_percentage_error,
    precision_score,
    r2_score,
    recall_score,
    root_mean_squared_error,
    roc_auc_score,
    silhouette_score,
)


RANDOM_STATE = 42
OUTPUT_PATH = Path(__file__).resolve().parents[1] / "outputs" / "metric_results.json"


def round_metrics(metrics: dict[str, float | int]) -> dict[str, float | int]:
    return {
        key: round(float(value), 4) if isinstance(value, (float, np.floating)) else int(value)
        for key, value in metrics.items()
    }


def classification_data() -> tuple[np.ndarray, np.ndarray]:
    """Create 45 positive and 955 negative cases with realistic score overlap."""
    positive_scores = np.concatenate(
        [np.linspace(0.55, 0.95, 36), np.linspace(0.12, 0.48, 9)]
    )
    negative_scores = np.concatenate(
        [np.linspace(0.52, 0.82, 24), np.linspace(0.01, 0.45, 931)]
    )
    target = np.concatenate([np.ones(45), np.zeros(955)]).astype(int)
    scores = np.concatenate([positive_scores, negative_scores])
    return target, scores


def classification_metrics(target: np.ndarray, scores: np.ndarray, threshold: float) -> dict[str, float | int]:
    predictions = (scores >= threshold).astype(int)
    tn, fp, fn, tp = confusion_matrix(target, predictions).ravel()
    specificity = tn / (tn + fp)
    return round_metrics(
        {
            "threshold": threshold,
            "true_positive": tp,
            "false_positive": fp,
            "false_negative": fn,
            "true_negative": tn,
            "accuracy": accuracy_score(target, predictions),
            "balanced_accuracy": balanced_accuracy_score(target, predictions),
            "precision": precision_score(target, predictions, zero_division=0),
            "recall": recall_score(target, predictions, zero_division=0),
            "specificity": specificity,
            "f1": f1_score(target, predictions, zero_division=0),
        }
    )


def classification_report() -> dict[str, object]:
    target, scores = classification_data()
    return {
        "samples": len(target),
        "positive_rate": round(float(target.mean()), 4),
        "thresholds": [classification_metrics(target, scores, value) for value in (0.3, 0.5, 0.7)],
        "ranking_and_probability": round_metrics(
            {
                "roc_auc": roc_auc_score(target, scores),
                "pr_auc": average_precision_score(target, scores),
                "log_loss": log_loss(target, scores),
                "brier_score": brier_score_loss(target, scores),
            }
        ),
    }


def regression_metrics(target: np.ndarray, predictions: np.ndarray) -> dict[str, float]:
    return round_metrics(
        {
            "mae": mean_absolute_error(target, predictions),
            "rmse": root_mean_squared_error(target, predictions),
            "r2": r2_score(target, predictions),
            "mape": mean_absolute_percentage_error(target, predictions),
        }
    )


def regression_report() -> dict[str, object]:
    target = np.array([120, 155, 190, 220, 260, 310, 360, 420, 500, 620], dtype=float)
    regular_predictions = np.array([130, 145, 205, 210, 285, 300, 350, 450, 470, 650], dtype=float)
    outlier_predictions = regular_predictions.copy()
    outlier_predictions[-1] = 980
    return {
        "target": target.astype(int).tolist(),
        "regular_predictions": regular_predictions.astype(int).tolist(),
        "outlier_predictions": outlier_predictions.astype(int).tolist(),
        "regular": regression_metrics(target, regular_predictions),
        "with_outlier": regression_metrics(target, outlier_predictions),
    }


def clustering_report() -> dict[str, object]:
    features, _reference = make_blobs(
        n_samples=360,
        centers=3,
        n_features=4,
        cluster_std=[0.8, 1.0, 1.25],
        random_state=RANDOM_STATE,
    )
    results = []
    for cluster_count in (2, 3, 4, 5):
        labels = KMeans(
            n_clusters=cluster_count,
            n_init=10,
            random_state=RANDOM_STATE,
        ).fit_predict(features)
        results.append(
            round_metrics(
                {
                    "clusters": cluster_count,
                    "silhouette": silhouette_score(features, labels),
                    "davies_bouldin": davies_bouldin_score(features, labels),
                    "calinski_harabasz": calinski_harabasz_score(features, labels),
                }
            )
        )
    return {"samples": len(features), "candidates": results}


def build_report() -> dict[str, object]:
    return {
        "classification": classification_report(),
        "regression": regression_report(),
        "clustering": clustering_report(),
    }


def print_summary(report: dict[str, object]) -> None:
    classification = report["classification"]
    threshold_result = classification["thresholds"][1]
    print("\nCLASSIFICATION · THRESHOLD 0.50")
    print("--------------------------------")
    for key in ("accuracy", "precision", "recall", "specificity", "f1"):
        print(f"{key:>20}: {threshold_result[key]:.3f}")

    print("\nREGRESSION · OUTLIER EFFECT")
    print("---------------------------")
    for variant in ("regular", "with_outlier"):
        values = report["regression"][variant]
        print(f"{variant:>20}: MAE={values['mae']:.1f} RMSE={values['rmse']:.1f} R2={values['r2']:.3f}")

    print("\nCLUSTERING · CANDIDATE K")
    print("------------------------")
    for values in report["clustering"]["candidates"]:
        print(
            f"k={values['clusters']} silhouette={values['silhouette']:.3f} "
            f"davies_bouldin={values['davies_bouldin']:.3f}"
        )


if __name__ == "__main__":
    metrics_report = build_report()
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(metrics_report, indent=2), encoding="utf-8")
    print_summary(metrics_report)
    print(f"\nSaved report to {OUTPUT_PATH}")
