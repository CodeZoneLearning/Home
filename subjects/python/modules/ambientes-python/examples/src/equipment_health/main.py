"""Render a small equipment health report with Rich."""

from rich.console import Console
from rich.table import Table


def main() -> None:
    table = Table(title="Equipment health")
    table.add_column("Equipment")
    table.add_column("Status")
    table.add_column("Confidence", justify="right")
    table.add_row("PUMP-014", "2", "0.91")
    Console().print(table)


if __name__ == "__main__":
    main()
