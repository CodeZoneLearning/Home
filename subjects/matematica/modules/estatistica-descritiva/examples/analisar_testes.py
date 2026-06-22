"""Descriptive statistics for repeated equipment tests."""

import csv
import random
import statistics
from collections import defaultdict
from pathlib import Path
from typing import Iterable


def load_tests(path: Path) -> list[dict[str, str | float | int]]:
    with path.open(encoding="utf-8", newline="") as source:
        rows = []
        for row in csv.DictReader(source):
            rows.append({
                **row,
                "temperature": float(row["temperature"]),
                "vibration": float(row["vibration"]),
                "confidence": float(row["confidence"]),
                "health_status": int(row["health_status"]),
            })
        return rows


def describe(values: Iterable[float]) -> dict[str, float]:
    sample = list(values)
    quartiles = statistics.quantiles(sample, n=4)
    return {
        "count": float(len(sample)),
        "mean": statistics.mean(sample),
        "median": statistics.median(sample),
        "stdev": statistics.stdev(sample),
        "q1": quartiles[0],
        "q3": quartiles[2],
        "iqr": quartiles[2] - quartiles[0],
    }


def pearson(left: Iterable[float], right: Iterable[float]) -> float:
    x, y = list(left), list(right)
    if len(x) != len(y) or len(x) < 2:
        raise ValueError("paired samples must have the same size and at least two values")
    mean_x, mean_y = statistics.mean(x), statistics.mean(y)
    numerator = sum((a - mean_x) * (b - mean_y) for a, b in zip(x, y))
    denominator = (sum((a - mean_x) ** 2 for a in x) * sum((b - mean_y) ** 2 for b in y)) ** 0.5
    return numerator / denominator


def bootstrap_mean_ci(values: Iterable[float], resamples: int = 2000, seed: int = 2026) -> tuple[float, float]:
    sample = list(values)
    generator = random.Random(seed)
    estimates = sorted(statistics.mean(generator.choices(sample, k=len(sample))) for _ in range(resamples))
    return estimates[int(0.025 * resamples)], estimates[int(0.975 * resamples)]


if __name__ == "__main__":
    tests = load_tests(Path(__file__).with_name("testes_equipamentos.csv"))
    temperatures = [float(row["temperature"]) for row in tests]
    vibrations = [float(row["vibration"]) for row in tests]
    by_category: dict[str, list[float]] = defaultdict(list)
    for test in tests:
        by_category[str(test["category"])].append(float(test["temperature"]))

    print("temperature", {key: round(value, 3) for key, value in describe(temperatures).items()})
    print("temperature_by_category", {category: round(statistics.mean(values), 3) for category, values in by_category.items()})
    print("temperature_vibration_r", round(pearson(temperatures, vibrations), 3))
    print("bootstrap_mean_95_ci", tuple(round(value, 3) for value in bootstrap_mean_ci(temperatures)))

    assert len(tests) == 12
    assert describe(temperatures)["q1"] < describe(temperatures)["q3"]
