from pathlib import Path

import pandas as pd

from axle_ml.drift import check_batch
from axle_ml.features import PreparedFeatures
from axle_ml.fixture import build_fixture, write_fixture
from axle_ml.predict import predict_row, row_from_request
from axle_ml.train import run_experiment


def _config(path: Path) -> dict:
    return {
        "seed": 42,
        "data_path": str(path),
        "test_size": 0.2,
        "val_size": 0.2,
        "models": ["linear", "ridge"],
        "feature_sets": ["chemistry", "hardness", "full"],
        "serve_feature_set": "hardness",
        "leakage_correlation": 0.9,
        "require_complement": True,
        "require_leakage_feature": "Avg Bending Force (N)",
        "metric_gate": {"feature_set": "hardness", "min_holdout_r2": 0.7},
    }


def test_training_writes_a_champion_and_flags_bending_force(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)
    csv_path = tmp_path / "fixture.csv"
    write_fixture(csv_path, n_groups=12, rows_per_group=40, seed=42)
    manifest = run_experiment(_config(Path("fixture.csv")), tmp_path)
    assert manifest["dataset_role"] == "local_table"
    assert "Avg Bending Force (N)" in manifest["leakage"]["suspects"]
    assert manifest["complement"]["brittleness_is_complement"] is True
    assert manifest["serving"]["feature_set"] == "hardness"
    assert manifest["feature_sets"]["full"]["test"]["rmse"] < manifest["feature_sets"]["chemistry"]["test"]["rmse"]
    assert (tmp_path / "models" / "champion.joblib").exists()
    assert manifest["feature_sets"]["hardness"]["test"]["r2"] >= 0.7


def test_encoder_is_fit_on_train_rows_only():
    frame = build_fixture(n_groups=4, rows_per_group=10)
    train = frame.iloc[:20].copy()
    train["Die-casting"] = "No"
    prepared = PreparedFeatures(columns=["Die-casting", "Mean HV10"]).fit(train)
    held = frame.iloc[:1].copy()
    held["Die-casting"] = "Rare"
    _, unknown = prepared.transform(held)
    assert unknown == ["Die-casting"]


def test_prediction_uses_only_hardness_fields(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)
    write_fixture(tmp_path / "fixture.csv")
    run_experiment(_config(Path("fixture.csv")), tmp_path)
    import joblib

    artifact = joblib.load(tmp_path / "models" / "champion.joblib")
    row = row_from_request({"mean_hv10": 520}, ["Mean HV10", "Min HV10", "Max HV10"])
    result = predict_row(artifact, row)
    assert 0 <= result["ductility_pct"] <= 100


def test_drift_flags_a_shifted_hardness_batch():
    reference = {"Mean HV10": {"mean": 580.0, "std": 20.0}}
    batch = build_fixture(n_groups=2, rows_per_group=10).copy()
    batch["Mean HV10"] = 800
    batch["Min HV10"] = 780
    batch["Max HV10"] = 820
    report = check_batch(batch, reference)
    assert report["accepted"] is False
    assert report["drift_flags"][0]["column"] == "Mean HV10"


def test_fixture_role_is_named_when_the_path_is_under_fixtures(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)
    fixture_dir = tmp_path / "data" / "fixtures"
    write_fixture(fixture_dir / "ci_axle.csv")
    manifest = run_experiment(_config(Path("data/fixtures/ci_axle.csv")), tmp_path)
    assert manifest["dataset_role"] == "ci_fixture"
    assert len(pd.read_csv(fixture_dir / "ci_axle.csv")) == 480
