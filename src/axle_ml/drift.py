"""Compare a new batch with the training reference stored in the manifest."""

from __future__ import annotations

import pandas as pd

from axle_ml.schema import validate_frame


def check_batch(frame: pd.DataFrame, reference: dict, z_limit: float = 3.0) -> dict:
    problems = validate_frame(frame)
    flags = []
    for column, stats in reference.items():
        if column not in frame.columns:
            continue
        values = pd.to_numeric(frame[column], errors="coerce")
        if stats["std"] == 0:
            continue
        z_score = abs(float(values.mean()) - stats["mean"]) / stats["std"]
        if z_score >= z_limit:
            flags.append(
                {
                    "column": column,
                    "z_score": round(z_score, 3),
                    "batch_mean": round(float(values.mean()), 3),
                    "train_mean": stats["mean"],
                }
            )
    return {
        "schema_problems": problems,
        "drift_flags": flags,
        "accepted": not problems and not flags,
    }
