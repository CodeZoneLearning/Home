"""Summarize repeated health tests for one equipment."""

from collections import Counter
from collections.abc import Iterable
from typing import TypedDict


class EquipmentTest(TypedDict):
    status: int
    confidence: float


def summarize(tests: Iterable[EquipmentTest]) -> dict[str, int | float | bool]:
    """Return count, modal status, mean confidence, and consistency."""
    records = list(tests)
    if not records:
        raise ValueError("at least one test is required")

    statuses = [record["status"] for record in records]
    invalid = [status for status in statuses if status not in range(1, 5)]
    if invalid:
        raise ValueError(f"invalid health status: {invalid[0]}")

    inferred_status, _ = Counter(statuses).most_common(1)[0]
    mean_confidence = sum(record["confidence"] for record in records) / len(records)
    return {
        "tests": len(records),
        "inferred_status": inferred_status,
        "mean_confidence": round(mean_confidence, 3),
        "consistent": len(set(statuses)) == 1,
    }


if __name__ == "__main__":
    sample: list[EquipmentTest] = [
        {"status": 2, "confidence": 0.91},
        {"status": 2, "confidence": 0.88},
        {"status": 3, "confidence": 0.62},
    ]
    print(summarize(sample))
