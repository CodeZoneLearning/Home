"""Unit tests for the equipment object model."""

import unittest

from equipment_model import Equipment, TestResult


class TestEquipment(unittest.TestCase):
    def test_aggregates_results(self) -> None:
        equipment = Equipment("pump-014", "pump")
        equipment.add_test(2, 0.91)
        equipment.add_test(2, 0.88)
        equipment.add_test(3, 0.62)

        self.assertEqual(equipment.inferred_status, 2)
        self.assertAlmostEqual(equipment.mean_confidence, 0.803333, places=5)
        self.assertFalse(equipment.is_consistent)

    def test_consistent_equipment(self) -> None:
        equipment = Equipment("motor-008", "motor")
        equipment.add_test(1, 0.97)
        equipment.add_test(1, 0.94)
        self.assertTrue(equipment.is_consistent)

    def test_rejects_invalid_result(self) -> None:
        with self.assertRaises(ValueError):
            TestResult(5, 0.8)
        with self.assertRaises(ValueError):
            TestResult(2, 1.4)


if __name__ == "__main__":
    unittest.main()
