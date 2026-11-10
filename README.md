# Axle fracture ML

Reproducible machine-learning pipeline for ductility of hardened **4Cr13** axle steel. This repository is the model, the evaluation, and the release path. The agent desk, the standards search, and the Frankfurt monitoring board live in other repositories.

The served prediction uses **hardness only** (mean, min, and max HV10). Chemistry-only and the full table, including bending force, are trained in the same run so the thesis can show what each measurement is worth. Brittleness is checked as `100 − ductility` and is not a second model.

## Place the thesis table

The 385,000-row extract is not stored in git. Copy it to:

```text
data/raw/axle_test.csv
```

The header has to match the original axle export: chemistry (`C [%]` … `Ni [%]`), `Die-casting`, `Diameter`, HV10, bending force, `Ductility %`, `Brittleness %`, and `Testing Group`. Training refuses the file when a column is missing, a value is outside the metallurgical range, or min / mean / max HV10 are out of order.

`Testing Group` is split on ` - Sample`. Every sample from one family stays in train, validation, or test. Encoders and the scaler are fit on the training families only.

## Train

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt -r requirements-dev.txt
pytest -q
python scripts/train.py --config configs/experiment.yaml
```

That writes:

| Path | What it is |
|---|---|
| `models/champion.joblib` | Hardness model used by the API |
| `models/chemistry.joblib`, `hardness.joblib`, `full.joblib` | One selected model per feature set |
| `models/manifest.json` | Data hash, git commit, split, metrics, leakage list |
| `runs/<timestamp>/` | Immutable copy of that run |
| `reports/latest.md` | Table you can paste into the thesis |
| `mlruns/` | The same metrics in MLflow |

The manifest field `dataset_role` is `thesis_table` when the file has at least 100,000 rows. A smaller local file is `local_table`. The committed CI file is `ci_fixture`.

## What the run decides

For each feature set the pipeline fits linear regression, Ridge, and Lasso. Validation R² selects the model. Test R², RMSE, and MAE are reported once and are not used for selection. Grouped cross-validation on the training families supplies the mean and spread of R².

Bending-force columns with absolute correlation at least 0.90 on the training rows are recorded as leakage suspects. They stay in the **full** feature set so the upper bound is visible. They are excluded from the model the API serves.

The thesis config fails the run when bending force is not flagged, or when brittleness is not the complement of ductility. The CI config also fails when the fixture hardness model falls below test R² 0.70.

## CI/CD

- **CI** (`.github/workflows/ci.yml`) on every push: tests, a full training run on `data/fixtures/ci_axle.csv`, then `scripts/check_gate.py`.
- **CD** (`.github/workflows/cd.yml`) on a version tag or a manual run: trains that fixture, builds the Docker image, and calls `/health` and `/predict`.

The image published by CD serves the **fixture** champion unless you copy a thesis `models/` directory in before `docker build`. The JSON response includes `dataset_role` and `run_id`, so a fixture model cannot be mistaken for the thesis model.

```bash
docker build -t axle-fracture-ml .
docker run --rm -p 8080:8080 axle-fracture-ml
curl -s http://127.0.0.1:8080/model
curl -s -X POST http://127.0.0.1:8080/predict \
  -H 'content-type: application/json' \
  -d '{"mean_hv10": 520}'
```

If `models/manifest.json` is absent, the container trains the CI fixture on startup and then serves it.

## A new batch

After a thesis run:

```bash
python scripts/check_batch.py path/to/new_rows.csv
```

The batch must pass the same schema check. A column whose mean is at least three training standard deviations from the training mean is flagged and the command exits 1.

## Fixture

`data/fixtures/ci_axle.csv` is a 480-row stand-in with the real header. Ductility is generated from HV10, and bending force is generated from ductility, so CI can prove the leakage flag and the metric gate without the thesis extract. Regenerate it with `python scripts/write_fixture.py` only when the generator changes, and keep the file in git.

## Layout

```text
src/axle_ml/     schema, split, training, registry, drift
api/app.py       /health  /model  /predict
configs/         experiment.yaml for the thesis table, ci.yaml for the fixture
scripts/         train, check_gate, check_batch, serve
tests/           schema, split, training, API
```
