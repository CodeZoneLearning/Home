"""Compare model families and decision-tree complexity on the same dataset."""

from __future__ import annotations

import json
import os
from pathlib import Path

os.environ.setdefault("LOKY_MAX_CPU_COUNT", "1")

from sklearn.datasets import make_moons
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, f1_score
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier


RANDOM_STATE = 42
OUTPUT_PATH = Path(__file__).resolve().parents[1] / "outputs" / "model_results.json"


def dataset() -> tuple:
    features, target = make_moons(
        n_samples=700,
        noise=0.27,
        random_state=RANDOM_STATE,
    )
    return train_test_split(
        features,
        target,
        test_size=0.30,
        stratify=target,
        random_state=RANDOM_STATE,
    )


def model_catalog() -> list[dict[str, object]]:
    return [
        {
            "name": "Logistic Regression",
            "family": "linear",
            "scaling": True,
            "nonlinear": False,
            "interpretability": "high",
            "estimator": make_pipeline(
                StandardScaler(),
                LogisticRegression(max_iter=1_000, random_state=RANDOM_STATE),
            ),
        },
        {
            "name": "K-Nearest Neighbors",
            "family": "distance",
            "scaling": True,
            "nonlinear": True,
            "interpretability": "medium",
            "estimator": make_pipeline(
                StandardScaler(),
                KNeighborsClassifier(n_neighbors=15),
            ),
        },
        {
            "name": "Decision Tree",
            "family": "tree",
            "scaling": False,
            "nonlinear": True,
            "interpretability": "high",
            "estimator": DecisionTreeClassifier(
                max_depth=4,
                min_samples_leaf=8,
                random_state=RANDOM_STATE,
            ),
        },
        {
            "name": "Random Forest",
            "family": "ensemble",
            "scaling": False,
            "nonlinear": True,
            "interpretability": "medium",
            "estimator": RandomForestClassifier(
                n_estimators=180,
                max_depth=7,
                min_samples_leaf=4,
                n_jobs=1,
                random_state=RANDOM_STATE,
            ),
        },
        {
            "name": "RBF Support Vector Machine",
            "family": "kernel",
            "scaling": True,
            "nonlinear": True,
            "interpretability": "low",
            "estimator": make_pipeline(
                StandardScaler(),
                SVC(kernel="rbf", C=1.5, gamma="scale"),
            ),
        },
    ]


def compare_families(x_train, x_validation, y_train, y_validation) -> list[dict[str, object]]:
    results = []
    for specification in model_catalog():
        estimator = specification.pop("estimator")
        estimator.fit(x_train, y_train)
        train_predictions = estimator.predict(x_train)
        validation_predictions = estimator.predict(x_validation)
        results.append(
            {
                **specification,
                "train_accuracy": round(accuracy_score(y_train, train_predictions), 4),
                "validation_accuracy": round(accuracy_score(y_validation, validation_predictions), 4),
                "validation_f1": round(f1_score(y_validation, validation_predictions), 4),
                "generalization_gap": round(
                    accuracy_score(y_train, train_predictions)
                    - accuracy_score(y_validation, validation_predictions),
                    4,
                ),
            }
        )
    return results


def compare_tree_complexity(x_train, x_validation, y_train, y_validation) -> list[dict[str, object]]:
    results = []
    for depth in (1, 2, 4, 8, None):
        model = DecisionTreeClassifier(
            max_depth=depth,
            min_samples_leaf=1,
            random_state=RANDOM_STATE,
        )
        model.fit(x_train, y_train)
        results.append(
            {
                "max_depth": depth if depth is not None else "unlimited",
                "leaves": int(model.get_n_leaves()),
                "train_accuracy": round(accuracy_score(y_train, model.predict(x_train)), 4),
                "validation_accuracy": round(
                    accuracy_score(y_validation, model.predict(x_validation)), 4
                ),
            }
        )
    return results


def build_report() -> dict[str, object]:
    x_train, x_validation, y_train, y_validation = dataset()
    return {
        "dataset": {
            "train_rows": len(x_train),
            "validation_rows": len(x_validation),
            "features": x_train.shape[1],
            "shape": "nonlinear_moons",
        },
        "families": compare_families(x_train, x_validation, y_train, y_validation),
        "tree_complexity": compare_tree_complexity(
            x_train,
            x_validation,
            y_train,
            y_validation,
        ),
    }


def print_summary(report: dict[str, object]) -> None:
    print("\nMODEL FAMILY COMPARISON")
    print("-----------------------")
    for result in report["families"]:
        print(
            f"{result['name']:<30} "
            f"train={result['train_accuracy']:.3f} "
            f"validation={result['validation_accuracy']:.3f} "
            f"gap={result['generalization_gap']:.3f}"
        )

    print("\nDECISION TREE COMPLEXITY")
    print("------------------------")
    for result in report["tree_complexity"]:
        print(
            f"depth={str(result['max_depth']):<9} leaves={result['leaves']:<3} "
            f"train={result['train_accuracy']:.3f} "
            f"validation={result['validation_accuracy']:.3f}"
        )


if __name__ == "__main__":
    model_report = build_report()
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(model_report, indent=2), encoding="utf-8")
    print_summary(model_report)
    print(f"\nSaved report to {OUTPUT_PATH}")
