from pathlib import Path

from fastapi.testclient import TestClient

from axle_ml.fixture import write_fixture
from axle_ml.train import run_experiment
from api.app import app


def test_health_and_predict(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)
    write_fixture(tmp_path / "fixture.csv", n_groups=12, rows_per_group=30)
    config = {
        "seed": 42,
        "data_path": "fixture.csv",
        "test_size": 0.2,
        "val_size": 0.2,
        "models": ["ridge"],
        "feature_sets": ["hardness"],
        "serve_feature_set": "hardness",
        "leakage_correlation": 0.9,
        "metric_gate": {"feature_set": "hardness", "min_holdout_r2": 0.7},
    }
    run_experiment(config, tmp_path)
    monkeypatch.setenv("AXLE_ML_ROOT", str(tmp_path))
    # The app captured MODELS at import, so point that global at the temp run.
    import api.app as api_module

    api_module.MODELS = Path(tmp_path) / "models"
    client = TestClient(app)
    health = client.get("/health")
    assert health.status_code == 200
    assert health.json()["status"] == "ready"
    response = client.post("/predict", json={"mean_hv10": 520})
    assert response.status_code == 200
    body = response.json()
    assert body["feature_set"] == "hardness"
    assert 0 <= body["ductility_pct"] <= 100
    card = client.get("/model")
    assert card.status_code == 200
    assert card.json()["dataset_role"] == "local_table"
