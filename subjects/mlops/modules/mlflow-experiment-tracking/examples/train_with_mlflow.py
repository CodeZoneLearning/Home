"""Train and register an equipment failure classifier with MLflow."""

import argparse
import os
from pathlib import Path

import mlflow
import mlflow.sklearn
import pandas as pd
from mlflow import MlflowClient
from mlflow.models import infer_signature
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, f1_score, precision_score, recall_score, roc_auc_score
from sklearn.model_selection import train_test_split


EXPERIMENT_NAME = "equipment-health"
REGISTERED_MODEL_NAME = "equipment-health-classifier"
FEATURES = ["temperature", "vibration", "pressure", "operating_hours"]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--max-depth", type=int, default=6)
    parser.add_argument("--n-estimators", type=int, default=200)
    parser.add_argument("--seed", type=int, default=42)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    data_path = Path(__file__).with_name("equipment_health.csv")
    data = pd.read_csv(data_path)
    x, y = data[FEATURES], data["failure"]
    x_train, x_test, y_train, y_test = train_test_split(
        x, y, test_size=0.3, random_state=args.seed, stratify=y
    )

    mlflow.set_tracking_uri(os.getenv("MLFLOW_TRACKING_URI", "sqlite:///mlflow.db"))
    mlflow.set_experiment(EXPERIMENT_NAME)

    with mlflow.start_run(run_name=f"rf_depth_{args.max_depth:02d}"):
        mlflow.log_params({
            "model_family": "RandomForestClassifier",
            "max_depth": args.max_depth,
            "n_estimators": args.n_estimators,
            "random_state": args.seed,
            "test_size": 0.3,
        })
        mlflow.set_tags({
            "purpose": "equipment failure baseline",
            "code_version": os.getenv("GIT_COMMIT", "local"),
        })
        dataset = mlflow.data.from_pandas(data, source=str(data_path), name="equipment-health-v1")
        mlflow.log_input(dataset, context="training")

        model = RandomForestClassifier(
            max_depth=args.max_depth,
            n_estimators=args.n_estimators,
            random_state=args.seed,
            class_weight="balanced",
        )
        model.fit(x_train, y_train)
        predictions = model.predict(x_test)
        probabilities = model.predict_proba(x_test)[:, 1]
        metrics = {
            "accuracy": accuracy_score(y_test, predictions),
            "precision": precision_score(y_test, predictions, zero_division=0),
            "recall": recall_score(y_test, predictions, zero_division=0),
            "f1": f1_score(y_test, predictions, zero_division=0),
            "roc_auc": roc_auc_score(y_test, probabilities),
        }
        mlflow.log_metrics(metrics)
        mlflow.log_dict(classification_report(y_test, predictions, output_dict=True), "reports/classification_report.json")

        signature = infer_signature(x_train, model.predict(x_train))
        mlflow.sklearn.log_model(
            sk_model=model,
            artifact_path="model",
            signature=signature,
            input_example=x_train.head(3),
            registered_model_name=REGISTERED_MODEL_NAME,
        )

    client = MlflowClient()
    versions = client.search_model_versions(f"name='{REGISTERED_MODEL_NAME}'")
    newest = max(versions, key=lambda version: int(version.version))
    client.set_registered_model_alias(REGISTERED_MODEL_NAME, "challenger", newest.version)
    print({"run_metrics": {key: round(value, 4) for key, value in metrics.items()}, "registered_version": newest.version, "alias": "challenger"})


if __name__ == "__main__":
    main()
