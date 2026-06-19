"""Generate the fictional equipment health-test dataset used by this lesson."""

from __future__ import annotations

import csv
from datetime import datetime, timedelta
from pathlib import Path


OUTPUT_PATH = Path(__file__).resolve().parents[1] / "data" / "equipment_health_tests.csv"

PROFILES = [
    ("EQ-001", "Compressor", "Plant-A", [1, 1, 1, 1, 1, 1], 0.96),
    ("EQ-002", "Pump", "Plant-A", [1, 1, 1, 1, 1, 1], 0.94),
    ("EQ-003", "Turbine", "Plant-B", [2, 2, 2, 2, 2, 2], 0.89),
    ("EQ-004", "Compressor", "Plant-B", [2, 2, 2, 2, 2, 2], 0.87),
    ("EQ-005", "Pump", "Plant-C", [3, 3, 3, 3, 3, 3], 0.91),
    ("EQ-006", "Turbine", "Plant-C", [4, 4, 4, 4, 4, 4], 0.93),
    ("EQ-007", "Compressor", "Plant-A", [1, 1, 1, 1, 1, 2], 0.91),
    ("EQ-008", "Pump", "Plant-B", [2, 2, 2, 2, 3, 2], 0.88),
    ("EQ-009", "Turbine", "Plant-C", [3, 3, 3, 4, 3, 3], 0.90),
    ("EQ-010", "Compressor", "Plant-C", [4, 4, 3, 4, 4, 4], 0.89),
    ("EQ-011", "Pump", "Plant-A", [1, 1, 2, 1, 1, 1], 0.87),
    ("EQ-012", "Turbine", "Plant-B", [2, 3, 2, 2, 2, 2], 0.86),
    ("EQ-013", "Compressor", "Plant-B", [1, 2, 1, 3, 2, 1], 0.73),
    ("EQ-014", "Pump", "Plant-C", [2, 3, 2, 3, 1, 2], 0.71),
    ("EQ-015", "Turbine", "Plant-A", [3, 4, 2, 3, 4, 3], 0.75),
    ("EQ-016", "Compressor", "Plant-A", [4, 3, 4, 2, 3, 4], 0.72),
    ("EQ-017", "Pump", "Plant-B", [1, 2, 3, 1, 2, 3], 0.68),
    ("EQ-018", "Turbine", "Plant-C", [2, 4, 1, 3, 2, 4], 0.66),
]

FIELDNAMES = [
    "test_id",
    "equipment_id",
    "test_timestamp",
    "site",
    "equipment_type",
    "operating_hours",
    "temperature_c",
    "vibration_mm_s",
    "health_status",
    "confidence_score",
]


def build_rows() -> list[dict[str, object]]:
    rows: list[dict[str, object]] = []
    start = datetime(2026, 1, 5, 8, 0)

    for equipment_index, (equipment_id, equipment_type, site, statuses, base_confidence) in enumerate(PROFILES):
        baseline_hours = 1100 + equipment_index * 235
        dominant_status = min(set(statuses), key=lambda status: (-statuses.count(status), status))

        for test_index, status in enumerate(statuses):
            timestamp = start + timedelta(days=test_index * 7, hours=equipment_index * 2)
            confidence_penalty = 0.12 if status != dominant_status else 0
            confidence_variation = ((test_index % 3) - 1) * 0.012
            confidence = max(0.51, min(0.99, base_confidence + confidence_variation - confidence_penalty))
            temperature = 47.5 + status * 8.2 + equipment_index * 0.16 + (test_index % 3) * 0.7
            vibration = 1.15 + status * 0.92 + equipment_index * 0.025 + (test_index % 2) * 0.18

            rows.append(
                {
                    "test_id": f"T-{equipment_index + 1:03d}-{test_index + 1:02d}",
                    "equipment_id": equipment_id,
                    "test_timestamp": timestamp.isoformat(timespec="minutes"),
                    "site": site,
                    "equipment_type": equipment_type,
                    "operating_hours": baseline_hours + test_index * 84,
                    "temperature_c": f"{temperature:.1f}",
                    "vibration_mm_s": f"{vibration:.2f}",
                    "health_status": status,
                    "confidence_score": f"{confidence:.3f}",
                }
            )

    return rows


def main() -> None:
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    rows = build_rows()
    with OUTPUT_PATH.open("w", encoding="utf-8", newline="") as output_file:
        writer = csv.DictWriter(output_file, fieldnames=FIELDNAMES)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Generated {len(rows)} rows at {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
