"""Column contract for the axle test table."""

from __future__ import annotations

import pandas as pd

REQUIRED_COLUMNS = [
    "Row Number",
    "Testing Group",
    "Material",
    "C [%]",
    "Si [%]",
    "Mn [%]",
    "P [%]",
    "S [%]",
    "Cr [%]",
    "Ni [%]",
    "Die-casting",
    "Hardening and Quenching",
    "Samples",
    "Series Tempering",
    "Additional Tempering",
    "Diameter",
    "Mean HV10",
    "Min HV10",
    "Max HV10",
    "Avg Bending Force (N)",
    "Min Bending Force (N)",
    "Max Bending Force (N)",
    "Ductility %",
    "Brittleness %",
]

TARGET = "Ductility %"
COMPLEMENT = "Brittleness %"
GROUP_COLUMN = "Testing Group"

NUMERIC_RANGES = {
    "C [%]": (0.05, 1.5),
    "Si [%]": (0.0, 2.0),
    "Mn [%]": (0.0, 2.0),
    "P [%]": (0.0, 0.2),
    "S [%]": (0.0, 0.2),
    "Cr [%]": (8.0, 20.0),
    "Ni [%]": (0.0, 5.0),
    "Mean HV10": (150.0, 900.0),
    "Min HV10": (150.0, 900.0),
    "Max HV10": (150.0, 900.0),
    "Avg Bending Force (N)": (500.0, 20000.0),
    "Min Bending Force (N)": (500.0, 20000.0),
    "Max Bending Force (N)": (500.0, 20000.0),
    "Ductility %": (0.0, 100.0),
    "Brittleness %": (0.0, 100.0),
}


def validate_frame(frame: pd.DataFrame) -> list[str]:
    """Return a list of schema problems. An empty list means the table is usable."""
    problems: list[str] = []
    missing = [column for column in REQUIRED_COLUMNS if column not in frame.columns]
    if missing:
        problems.append("missing columns: " + ", ".join(missing))
        return problems
    if frame.empty:
        problems.append("table has no rows")
        return problems

    nulls = frame[REQUIRED_COLUMNS].isnull().sum()
    null_columns = [name for name, count in nulls.items() if int(count) > 0]
    if null_columns:
        problems.append("null values in: " + ", ".join(null_columns))

    for column, (low, high) in NUMERIC_RANGES.items():
        values = pd.to_numeric(frame[column], errors="coerce")
        if values.isnull().any():
            problems.append(f"{column} contains non-numeric values")
            continue
        outside = int(((values < low) | (values > high)).sum())
        if outside:
            problems.append(f"{column} has {outside} values outside {low}–{high}")

    hardness = pd.to_numeric(frame["Mean HV10"], errors="coerce")
    low_h = pd.to_numeric(frame["Min HV10"], errors="coerce")
    high_h = pd.to_numeric(frame["Max HV10"], errors="coerce")
    inverted = int(((low_h > hardness) | (hardness > high_h)).sum())
    if inverted:
        problems.append(f"Min/Mean/Max HV10 is out of order on {inverted} rows")
    return problems


def complement_report(frame: pd.DataFrame) -> dict:
    """Brittleness in this table is the remainder of ductility."""
    ductility = pd.to_numeric(frame[TARGET], errors="coerce")
    brittleness = pd.to_numeric(frame[COMPLEMENT], errors="coerce")
    gap = (ductility + brittleness - 100.0).abs()
    max_gap = float(gap.max())
    return {
        "max_abs_gap": round(max_gap, 6),
        "brittleness_is_complement": bool(max_gap < 0.05),
        "decision": (
            "Brittleness is 100 minus ductility. The pipeline trains one target."
        ),
    }
