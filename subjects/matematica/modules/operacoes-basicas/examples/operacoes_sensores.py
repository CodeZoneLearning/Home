"""Apply arithmetic, vector, and matrix operations to sensor tests."""

import csv
from pathlib import Path
from typing import Sequence


Vector = list[float]
Matrix = list[Vector]


def availability(planned_minutes: float, downtime_minutes: float) -> float:
    """Return operating time as a percentage of planned time."""
    if planned_minutes <= 0:
        raise ValueError("planned minutes must be positive")
    if not 0 <= downtime_minutes <= planned_minutes:
        raise ValueError("downtime must be between zero and planned time")
    return (planned_minutes - downtime_minutes) / planned_minutes * 100


def add(left: Sequence[float], right: Sequence[float]) -> Vector:
    """Add vectors component by component."""
    _require_same_size(left, right)
    return [a + b for a, b in zip(left, right)]


def dot(left: Sequence[float], right: Sequence[float]) -> float:
    """Return the dot product of two equally sized vectors."""
    _require_same_size(left, right)
    return sum(a * b for a, b in zip(left, right))


def transpose(matrix: Matrix) -> Matrix:
    """Swap rows and columns in a rectangular matrix."""
    if not matrix or not matrix[0]:
        raise ValueError("matrix cannot be empty")
    width = len(matrix[0])
    if any(len(row) != width for row in matrix):
        raise ValueError("matrix must be rectangular")
    return [list(column) for column in zip(*matrix)]


def matrix_vector(matrix: Matrix, vector: Sequence[float]) -> Vector:
    """Calculate one dot product for each matrix row."""
    return [dot(row, vector) for row in matrix]


def load_sensor_matrix(path: Path) -> Matrix:
    """Load normalized temperature, vibration, and pressure columns."""
    with path.open(encoding="utf-8", newline="") as source:
        rows = csv.DictReader(source)
        return [
            [float(row["temperature"]), float(row["vibration"]), float(row["pressure"])]
            for row in rows
        ]


def _require_same_size(left: Sequence[float], right: Sequence[float]) -> None:
    if len(left) != len(right):
        raise ValueError("vector dimensions must match")


if __name__ == "__main__":
    sensor_matrix = load_sensor_matrix(Path(__file__).with_name("testes_sensores.csv"))
    weights = [0.25, 0.45, 0.30]

    print(f"availability={availability(480, 36):.1f}%")
    print(f"corrected_test={add(sensor_matrix[0], [0.02, -0.01, 0.0])}")
    print(f"transposed={transpose(sensor_matrix)}")
    print(f"risk_scores={[round(score, 4) for score in matrix_vector(sensor_matrix, weights)]}")

    assert round(availability(480, 36), 1) == 92.5
    assert len(transpose(sensor_matrix)) == 3
    assert len(matrix_vector(sensor_matrix, weights)) == len(sensor_matrix)
