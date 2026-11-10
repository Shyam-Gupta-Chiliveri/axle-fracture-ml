"""FastAPI service for the champion ductility model."""

from __future__ import annotations

import os
from pathlib import Path

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from axle_ml.predict import load_champion, predict_row, row_from_request, serving_columns

ROOT = Path(os.getenv("AXLE_ML_ROOT", Path(__file__).resolve().parents[1]))
MODELS = ROOT / "models"

app = FastAPI(title="Axle ductility model", version="1.0.0")


class PredictRequest(BaseModel):
    mean_hv10: float = Field(..., description="Mean Vickers hardness HV10")
    min_hv10: float | None = None
    max_hv10: float | None = None
    c_pct: float | None = None
    si_pct: float | None = None
    mn_pct: float | None = None
    p_pct: float | None = None
    s_pct: float | None = None
    cr_pct: float | None = None
    ni_pct: float | None = None
    avg_bending_force_n: float | None = None
    min_bending_force_n: float | None = None
    max_bending_force_n: float | None = None
    die_casting: str | None = None
    diameter: str | None = None


@app.get("/health")
def health():
    ready = (MODELS / "manifest.json").exists() and (MODELS / "champion.joblib").exists()
    return {"status": "ready" if ready else "no_model", "models_dir": str(MODELS)}


@app.get("/model")
def model_card():
    try:
        manifest, _ = load_champion(MODELS)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    return {
        "run_id": manifest["run_id"],
        "dataset_role": manifest["dataset_role"],
        "n_rows": manifest["n_rows"],
        "data_sha256": manifest["data_sha256"],
        "git_commit": manifest["git_commit"],
        "serving": manifest["serving"],
        "test_metrics": manifest["feature_sets"][manifest["serving"]["feature_set"]]["test"],
        "leakage_suspects": manifest["leakage"]["suspects"],
    }


@app.post("/predict")
def predict(body: PredictRequest):
    try:
        manifest, artifact = load_champion(MODELS)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    columns = serving_columns(manifest)
    try:
        row = row_from_request(body.model_dump(), columns)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    prediction = predict_row(artifact, row)
    return {
        **prediction,
        "feature_set": manifest["serving"]["feature_set"],
        "model": manifest["serving"]["model"],
        "dataset_role": manifest["dataset_role"],
        "run_id": manifest["run_id"],
    }
