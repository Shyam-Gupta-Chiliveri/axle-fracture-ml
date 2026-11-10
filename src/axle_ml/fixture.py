"""Small stand-in table for CI. It is not the 385,000-row thesis extract."""

from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd

LETTERS = list("ABCDEFGHIJKL")


def build_fixture(n_groups: int = 12, rows_per_group: int = 40, seed: int = 42) -> pd.DataFrame:
    rng = np.random.default_rng(seed)
    rows = []
    row_number = 1
    for group_index in range(n_groups):
        letter = LETTERS[group_index]
        version = 6 if group_index % 2 == 0 else 11
        family = f"Testing Group {letter} (Version-{version})"
        for sample in range(1, rows_per_group + 1):
            carbon = float(rng.uniform(0.35, 0.45))
            silicon = float(rng.uniform(0.15, 0.70))
            manganese = float(rng.uniform(0.15, 0.60))
            mean_hv = float(rng.uniform(480, 680))
            spread = float(rng.uniform(8, 25))
            ductility = 48.0 - 0.08 * (mean_hv - 500.0) + 4.0 * (carbon - 0.40)
            ductility = float(np.clip(ductility + rng.normal(0, 0.6), 15, 47))
            force = 2200.0 + 85.0 * ductility + float(rng.normal(0, 25))
            rows.append(
                {
                    "Row Number": row_number,
                    "Testing Group": f"{family} - Sample {sample}",
                    "Material": "4Cr13",
                    "C [%]": round(carbon, 3),
                    "Si [%]": round(silicon, 3),
                    "Mn [%]": round(manganese, 3),
                    "P [%]": round(float(rng.uniform(0.01, 0.035)), 3),
                    "S [%]": round(float(rng.uniform(0.005, 0.025)), 3),
                    "Cr [%]": round(float(rng.uniform(12.4, 13.4)), 3),
                    "Ni [%]": round(float(rng.uniform(0.05, 0.50)), 3),
                    "Die-casting": "Yes" if sample % 2 == 0 else "No",
                    "Hardening and Quenching": "980°C / oil",
                    "Samples": 1,
                    "Series Tempering": "350°C / 1h",
                    "Additional Tempering": "No" if sample % 3 else "200°C / 1h",
                    "Diameter": "8mm" if sample % 5 else "7.8mm",
                    "Mean HV10": int(round(mean_hv)),
                    "Min HV10": int(round(mean_hv - spread)),
                    "Max HV10": int(round(mean_hv + spread)),
                    "Avg Bending Force (N)": int(round(force)),
                    "Min Bending Force (N)": int(round(force - 180)),
                    "Max Bending Force (N)": int(round(force + 220)),
                    "Ductility %": round(ductility, 2),
                    "Brittleness %": round(100.0 - ductility, 2),
                }
            )
            row_number += 1
    return pd.DataFrame(rows)


def write_fixture(path: Path, **kwargs) -> pd.DataFrame:
    frame = build_fixture(**kwargs)
    path.parent.mkdir(parents=True, exist_ok=True)
    frame.to_csv(path, index=False)
    return frame
