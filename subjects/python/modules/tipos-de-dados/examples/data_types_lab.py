"""Explore Python scalars, collections, docstrings, and list-based matrices."""

from __future__ import annotations

from pprint import pprint
from typing import Any


def transpose(matrix: list[list[float]]) -> list[list[float]]:
    """Return the transpose of a non-empty rectangular matrix."""
    if not matrix or not matrix[0]:
        raise ValueError("matrix must not be empty")
    width = len(matrix[0])
    if any(len(row) != width for row in matrix):
        raise ValueError("all matrix rows must have the same length")
    return [list(column) for column in zip(*matrix)]


def describe(value: Any) -> dict[str, Any]:
    """Build a compact runtime description of any Python value."""
    return {
        "value": value,
        "type": type(value).__name__,
        "is_number": isinstance(value, (int, float)) and not isinstance(value, bool),
        "length": len(value) if hasattr(value, "__len__") else None,
    }


def build_equipment_record() -> dict[str, Any]:
    """Create one equipment record using scalars and collections."""
    return {
        "equipment_id": "PUMP-014",
        "health_status": 2,
        "confidence": 0.91,
        "active": True,
        "tags": ["pump", "line-a"],
        "position": (12.4, 8.7),
        "tests": [
            {"status": 2, "confidence": 0.91},
            {"status": 2, "confidence": 0.88},
            {"status": 3, "confidence": 0.62},
        ],
        "sensor_matrix": [
            [68.2, 4.1, 0.32],
            [69.0, 4.4, 0.35],
        ],
    }


def main() -> None:
    record = build_equipment_record()
    print("EQUIPMENT RECORD")
    pprint(record, sort_dicts=False)

    print("\nRUNTIME TYPES")
    for key in ("equipment_id", "health_status", "confidence", "tags", "position"):
        print(f"{key:>16}: {describe(record[key])}")

    print("\nTRANSPOSED SENSOR MATRIX")
    pprint(transpose(record["sensor_matrix"]))

    assert transpose([[1, 2, 3], [4, 5, 6]]) == [[1, 4], [2, 5], [3, 6]]
    assert describe(True)["is_number"] is False
    print("\nChecks passed.")


if __name__ == "__main__":
    main()
