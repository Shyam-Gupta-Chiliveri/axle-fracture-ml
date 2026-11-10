"""Load the champion artifact and score one axle."""

from __future__ import annotations

import json
from pathlib import Path

import joblib
import pandas as pd

from axle_ml.features import FEATURE_SETS
from axle_ml.schema import TARGET


def load_champion(models_dir: Path) -> tuple[dict, dict]:
    manifest_path = models_dir / "manifest.json"
    model_path = models_dir / "champion.joblib"
    if not manifest_path.exists() or not model_path.exists():
        raise FileNotFoundError("champion model is not trained yet")
    manifest = json.loads(manifest_path.read_text())
    artifact = joblib.load(model_path)
    return manifest, artifact


def predict_row(artifact: dict, row: dict) -> dict:
    prepared = artifact["preprocessor"]
    model = artifact["model"]
    frame = pd.DataFrame([row])
    matrix, unknown = prepared.transform(frame)
    raw = float(model.predict(matrix)[0])
    clipped = float(min(100.0, max(0.0, raw)))
    return {
        "ductility_pct": round(clipped, 2),
        "raw_prediction": round(raw, 4),
        "target": TARGET,
        "unknown_categories": unknown,
    }


def _field(payload: dict, key: str, default=None):
    value = payload.get(key)
    return default if value is None else value


def row_from_request(payload: dict, columns: list[str]) -> dict:
    """Map the API field names onto the training columns."""
    mean_hv = _field(payload, "mean_hv10")
    mapping = {
        "C [%]": _field(payload, "c_pct"),
        "Si [%]": _field(payload, "si_pct"),
        "Mn [%]": _field(payload, "mn_pct"),
        "P [%]": _field(payload, "p_pct"),
        "S [%]": _field(payload, "s_pct"),
        "Cr [%]": _field(payload, "cr_pct"),
        "Ni [%]": _field(payload, "ni_pct"),
        "Mean HV10": mean_hv,
        "Min HV10": _field(payload, "min_hv10", mean_hv),
        "Max HV10": _field(payload, "max_hv10", mean_hv),
        "Avg Bending Force (N)": _field(payload, "avg_bending_force_n"),
        "Min Bending Force (N)": _field(payload, "min_bending_force_n"),
        "Max Bending Force (N)": _field(payload, "max_bending_force_n"),
        "Die-casting": _field(payload, "die_casting", "No"),
        "Diameter": _field(payload, "diameter", "8mm"),
    }
    missing = [column for column in columns if mapping.get(column) is None]
    if missing:
        raise ValueError("missing fields for this model: " + ", ".join(missing))
    return {column: mapping[column] for column in columns}


def serving_columns(manifest: dict) -> list[str]:
    return FEATURE_SETS[manifest["serving"]["feature_set"]]
