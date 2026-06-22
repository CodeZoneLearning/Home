"""Object-oriented equipment health example using composition and validation."""

from __future__ import annotations

from collections import Counter
from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class TestResult:
    """Immutable result produced by one equipment test."""

    health_status: int
    confidence: float

    def __post_init__(self) -> None:
        if self.health_status not in range(1, 5):
            raise ValueError("health_status must be between 1 and 4")
        if not 0.0 <= self.confidence <= 1.0:
            raise ValueError("confidence must be between 0 and 1")


class Equipment:
    """Aggregate test results and expose equipment health behavior."""

    supported_statuses = (1, 2, 3, 4)

    def __init__(self, equipment_id: str, category: str) -> None:
        if not equipment_id.strip():
            raise ValueError("equipment_id must not be empty")
        self.equipment_id = equipment_id.strip().upper()
        self.category = category.strip().lower()
        self._tests: list[TestResult] = []

    def add_test(self, health_status: int, confidence: float) -> TestResult:
        """Validate, create, and attach a test result."""
        result = TestResult(health_status, confidence)
        self._tests.append(result)
        return result

    @property
    def tests(self) -> tuple[TestResult, ...]:
        """Expose an immutable view of the internal collection."""
        return tuple(self._tests)

    @property
    def inferred_status(self) -> int | None:
        """Return the most frequent class, breaking ties with the latest test."""
        if not self._tests:
            return None
        counts = Counter(test.health_status for test in self._tests)
        highest_count = max(counts.values())
        candidates = {status for status, count in counts.items() if count == highest_count}
        return next(test.health_status for test in reversed(self._tests) if test.health_status in candidates)

    @property
    def mean_confidence(self) -> float | None:
        if not self._tests:
            return None
        return sum(test.confidence for test in self._tests) / len(self._tests)

    @property
    def is_consistent(self) -> bool:
        return bool(self._tests) and len({test.health_status for test in self._tests}) == 1

    def __len__(self) -> int:
        return len(self._tests)

    def __repr__(self) -> str:
        return f"Equipment(equipment_id={self.equipment_id!r}, tests={len(self)})"


def main() -> None:
    pump = Equipment("pump-014", "pump")
    pump.add_test(2, 0.91)
    pump.add_test(2, 0.88)
    pump.add_test(3, 0.62)

    print(pump)
    print(f"inferred_status={pump.inferred_status}")
    print(f"mean_confidence={pump.mean_confidence:.3f}")
    print(f"is_consistent={pump.is_consistent}")


if __name__ == "__main__":
    main()
