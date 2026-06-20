"""Compare supervised and unsupervised training with reproducible examples."""

from __future__ import annotations

import os

os.environ.setdefault("LOKY_MAX_CPU_COUNT", "1")

from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs, make_classification, make_regression
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, mean_absolute_error, silhouette_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler


RANDOM_STATE = 42


def classification_example() -> dict[str, float | int]:
    """Predict one of three equipment health classes from sensor features."""
    features, target = make_classification(
        n_samples=420,
        n_features=6,
        n_informative=4,
        n_redundant=1,
        n_classes=3,
        class_sep=1.35,
        random_state=RANDOM_STATE,
    )
    x_train, x_test, y_train, y_test = train_test_split(
        features,
        target,
        test_size=0.25,
        stratify=target,
        random_state=RANDOM_STATE,
    )
    model = make_pipeline(
        StandardScaler(),
        LogisticRegression(max_iter=1_000, random_state=RANDOM_STATE),
    )
    model.fit(x_train, y_train)
    predictions = model.predict(x_test)
    return {
        "train_rows": len(x_train),
        "test_rows": len(x_test),
        "accuracy": accuracy_score(y_test, predictions),
    }


def regression_example() -> dict[str, float | int]:
    """Estimate a continuous remaining-useful-life target."""
    features, target = make_regression(
        n_samples=420,
        n_features=6,
        n_informative=5,
        noise=18,
        random_state=RANDOM_STATE,
    )
    x_train, x_test, y_train, y_test = train_test_split(
        features,
        target,
        test_size=0.25,
        random_state=RANDOM_STATE,
    )
    model = RandomForestRegressor(
        n_estimators=180,
        min_samples_leaf=3,
        random_state=RANDOM_STATE,
        n_jobs=1,
    )
    model.fit(x_train, y_train)
    predictions = model.predict(x_test)
    return {
        "train_rows": len(x_train),
        "test_rows": len(x_test),
        "mae": mean_absolute_error(y_test, predictions),
    }


def clustering_example() -> dict[str, float | int]:
    """Discover equipment profiles without giving the algorithm a target."""
    features, _hidden_reference = make_blobs(
        n_samples=420,
        centers=3,
        n_features=4,
        cluster_std=[0.85, 1.1, 1.3],
        random_state=RANDOM_STATE,
    )
    scaled_features = StandardScaler().fit_transform(features)
    model = KMeans(n_clusters=3, n_init=10, random_state=RANDOM_STATE)
    clusters = model.fit_predict(scaled_features)
    return {
        "rows": len(features),
        "clusters": len(set(clusters)),
        "silhouette": silhouette_score(scaled_features, clusters),
    }


def print_report(title: str, values: dict[str, float | int]) -> None:
    print(f"\n{title}")
    print("-" * len(title))
    for key, value in values.items():
        formatted = f"{value:.3f}" if isinstance(value, float) else str(value)
        print(f"{key:>12}: {formatted}")


if __name__ == "__main__":
    print_report("SUPERVISED · CLASSIFICATION", classification_example())
    print_report("SUPERVISED · REGRESSION", regression_example())
    print_report("UNSUPERVISED · CLUSTERING", clustering_example())
