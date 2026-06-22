"""Probability calculations for failure predictions."""

import csv
import math
import random
from pathlib import Path


def bayes_posterior(prevalence: float, sensitivity: float, false_positive_rate: float) -> float:
    """Return P(failure | alert)."""
    true_positive = sensitivity * prevalence
    false_positive = false_positive_rate * (1 - prevalence)
    denominator = true_positive + false_positive
    if denominator == 0:
        raise ValueError("the alert event has zero probability")
    return true_positive / denominator


def load_predictions(path: Path) -> list[tuple[float, int]]:
    with path.open(encoding="utf-8", newline="") as source:
        return [(float(row["probability"]), int(row["outcome"])) for row in csv.DictReader(source)]


def confusion(predictions: list[tuple[float, int]], threshold: float) -> dict[str, int]:
    result = {"tp": 0, "fp": 0, "fn": 0, "tn": 0}
    for probability, outcome in predictions:
        predicted = probability >= threshold
        key = "tp" if predicted and outcome else "fp" if predicted else "fn" if outcome else "tn"
        result[key] += 1
    return result


def brier_score(predictions: list[tuple[float, int]]) -> float:
    return sum((probability - outcome) ** 2 for probability, outcome in predictions) / len(predictions)


def log_loss(predictions: list[tuple[float, int]]) -> float:
    epsilon = 1e-15
    losses = []
    for probability, outcome in predictions:
        clipped = min(max(probability, epsilon), 1 - epsilon)
        losses.append(-(outcome * math.log(clipped) + (1 - outcome) * math.log(1 - clipped)))
    return sum(losses) / len(losses)


def simulate_failures(probability: float, trials: int = 10000, seed: int = 2026) -> float:
    generator = random.Random(seed)
    failures = sum(generator.random() < probability for _ in range(trials))
    return failures / trials


if __name__ == "__main__":
    values = load_predictions(Path(__file__).with_name("predicoes_falha.csv"))
    matrix = confusion(values, threshold=0.5)
    print("bayes_posterior", round(bayes_posterior(0.05, 0.85, 0.10), 4))
    print("confusion_at_0.5", matrix)
    print("brier_score", round(brier_score(values), 4))
    print("log_loss", round(log_loss(values), 4))
    print("simulated_failure_rate", round(simulate_failures(0.05), 4))

    assert len(values) == 20
    assert sum(matrix.values()) == len(values)
    assert 0 <= brier_score(values) <= 1
