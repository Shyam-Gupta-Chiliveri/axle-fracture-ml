"""Train the three feature sets and write a versioned model manifest."""

from __future__ import annotations

import json
import os
import subprocess
from datetime import datetime, timezone
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import yaml
from sklearn.linear_model import Lasso, LinearRegression, Ridge
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import GroupKFold

from axle_ml.data import FAMILY_COLUMN, dataset_role, file_sha256, load_table
from axle_ml.features import FEATURE_SETS, LEAKAGE_WATCH, PreparedFeatures
from axle_ml.schema import TARGET, complement_report
from axle_ml.split import split_frame


def load_config(path: Path) -> dict:
    with path.open() as handle:
        return yaml.safe_load(handle)


def make_model(name: str):
    if name == "linear":
        return LinearRegression()
    if name == "ridge":
        return Ridge(alpha=1.0)
    if name == "lasso":
        return Lasso(alpha=0.01, max_iter=10000)
    raise KeyError(f"unknown model {name}")


def regression_metrics(y_true, y_pred) -> dict:
    return {
        "r2": round(float(r2_score(y_true, y_pred)), 6),
        "rmse": round(float(np.sqrt(mean_squared_error(y_true, y_pred))), 6),
        "mae": round(float(mean_absolute_error(y_true, y_pred)), 6),
    }


def leakage_report(train: pd.DataFrame, threshold: float) -> dict:
    suspects = []
    correlations = {}
    target = pd.to_numeric(train[TARGET], errors="coerce")
    for column in LEAKAGE_WATCH:
        feature = pd.to_numeric(train[column], errors="coerce")
        corr = float(feature.corr(target))
        correlations[column] = round(corr, 6)
        if abs(corr) >= threshold:
            suspects.append(column)
    return {
        "threshold": threshold,
        "correlations": correlations,
        "suspects": suspects,
        "note": (
            "A bending-force column above the threshold is measured in the same "
            "mechanical test as ductility. It is an upper bound, not a pre-failure feature."
        ),
    }


def _git_commit() -> str:
    env_sha = os.getenv("GITHUB_SHA")
    if env_sha:
        return env_sha
    try:
        return subprocess.check_output(
            ["git", "rev-parse", "HEAD"],
            text=True,
            stderr=subprocess.DEVNULL,
        ).strip()
    except (subprocess.CalledProcessError, FileNotFoundError):
        return "unknown"


def _cv_scores(frame: pd.DataFrame, columns: list[str], model_name: str, seed: int) -> dict:
    families = frame[FAMILY_COLUMN].astype(str)
    n_groups = families.nunique()
    n_splits = min(5, int(n_groups))
    if n_splits < 2:
        return {"cv_r2_mean": None, "cv_r2_std": None, "cv_folds": 0}
    splitter = GroupKFold(n_splits=n_splits)
    scores = []
    dummy = np.zeros(len(frame))
    for train_idx, test_idx in splitter.split(dummy, dummy, families):
        train_part = frame.iloc[train_idx]
        test_part = frame.iloc[test_idx]
        prepared = PreparedFeatures(columns=columns).fit(train_part)
        x_train, _ = prepared.transform(train_part)
        x_test, _ = prepared.transform(test_part)
        model = make_model(model_name)
        model.fit(x_train, train_part[TARGET].to_numpy(dtype=float))
        pred = model.predict(x_test)
        scores.append(float(r2_score(test_part[TARGET], pred)))
    return {
        "cv_r2_mean": round(float(np.mean(scores)), 6),
        "cv_r2_std": round(float(np.std(scores)), 6),
        "cv_folds": n_splits,
    }


def _residual_by_hardness(test: pd.DataFrame, pred: np.ndarray) -> list[dict]:
    residual = test[TARGET].to_numpy(dtype=float) - pred
    hardness = test["Mean HV10"].to_numpy(dtype=float)
    bins = [(0, 500), (500, 600), (600, 700), (700, 1000)]
    rows = []
    for low, high in bins:
        mask = (hardness >= low) & (hardness < high)
        if int(mask.sum()) < 5:
            continue
        rows.append(
            {
                "hv10_bin": f"{low}–{high}",
                "n": int(mask.sum()),
                "mae": round(float(np.mean(np.abs(residual[mask]))), 4),
                "mean_residual": round(float(np.mean(residual[mask])), 4),
            }
        )
    return rows


def run_experiment(config: dict, project_root: Path) -> dict:
    data_path = project_root / config["data_path"]
    if not data_path.exists():
        raise FileNotFoundError(
            f"Missing {data_path}. Place the axle CSV there, or use configs/ci.yaml."
        )
    frame = load_table(data_path)
    train, val, test, split_report = split_frame(
        frame,
        seed=int(config["seed"]),
        test_size=float(config["test_size"]),
        val_size=float(config["val_size"]),
    )
    leakage = leakage_report(train, float(config["leakage_correlation"]))
    complement = complement_report(frame)
    role = dataset_role(data_path, len(frame))
    run_id = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    feature_results = {}
    artifacts = {}

    for feature_name in config["feature_sets"]:
        columns = FEATURE_SETS[feature_name]
        candidates = []
        for model_name in config["models"]:
            prepared = PreparedFeatures(columns=columns).fit(train)
            x_train, _ = prepared.transform(train)
            x_val, _ = prepared.transform(val)
            x_test, _ = prepared.transform(test)
            model = make_model(model_name)
            y_train = train[TARGET].to_numpy(dtype=float)
            model.fit(x_train, y_train)
            val_pred = model.predict(x_val)
            test_pred = model.predict(x_test)
            train_pred = model.predict(x_train)
            record = {
                "model": model_name,
                "train": regression_metrics(y_train, train_pred),
                "val": regression_metrics(val[TARGET], val_pred),
                "test": regression_metrics(test[TARGET], test_pred),
                **_cv_scores(train, columns, model_name, int(config["seed"])),
            }
            candidates.append((record, prepared, model, test_pred))
        best = max(candidates, key=lambda item: (item[0]["val"]["r2"], -item[0]["val"]["rmse"]))
        record, prepared, model, test_pred = best
        record["residual_by_hardness"] = _residual_by_hardness(test, test_pred)
        feature_results[feature_name] = record
        artifacts[feature_name] = {"preprocessor": prepared, "model": model}

    serve_set = config["serve_feature_set"]
    if serve_set not in artifacts:
        raise KeyError(f"serve_feature_set {serve_set} was not trained")
    champion = artifacts[serve_set]
    models_dir = project_root / "models"
    runs_dir = project_root / "runs" / run_id
    models_dir.mkdir(parents=True, exist_ok=True)
    runs_dir.mkdir(parents=True, exist_ok=True)

    for name, artifact in artifacts.items():
        joblib.dump(artifact, models_dir / f"{name}.joblib")
        joblib.dump(artifact, runs_dir / f"{name}.joblib")
    joblib.dump(champion, models_dir / "champion.joblib")

    manifest = {
        "run_id": run_id,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "git_commit": _git_commit(),
        "data_path": str(data_path),
        "data_sha256": file_sha256(data_path),
        "n_rows": int(len(frame)),
        "dataset_role": role,
        "seed": int(config["seed"]),
        "target": TARGET,
        "complement": complement,
        "split": {key: value for key, value in split_report.items() if not key.endswith("families")},
        "split_families": {
            "train": split_report["train_families"],
            "val": split_report["val_families"],
            "test": split_report["test_families"],
        },
        "leakage": leakage,
        "feature_sets": feature_results,
        "serving": {
            "feature_set": serve_set,
            "model": feature_results[serve_set]["model"],
            "path": "models/champion.joblib",
        },
        "reference_stats": _reference_stats(train),
    }
    for destination in (models_dir / "manifest.json", runs_dir / "manifest.json"):
        destination.write_text(json.dumps(manifest, indent=2))
    (project_root / "runs" / "latest.json").write_text(json.dumps({"run_id": run_id}, indent=2))
    _write_report(project_root / "reports" / "latest.md", manifest)
    _log_mlflow(project_root, manifest)
    _enforce_gate(config, manifest)
    return manifest


def _reference_stats(train: pd.DataFrame) -> dict:
    stats = {}
    for column in ["Mean HV10", "Ductility %", "Avg Bending Force (N)"]:
        values = pd.to_numeric(train[column], errors="coerce")
        stats[column] = {
            "mean": round(float(values.mean()), 6),
            "std": round(float(values.std(ddof=0)), 6),
        }
    return stats


def _enforce_gate(config: dict, manifest: dict) -> None:
    gate = config.get("metric_gate") or {}
    feature_set = gate.get("feature_set")
    minimum = gate.get("min_holdout_r2")
    if feature_set and minimum is not None:
        score = manifest["feature_sets"][feature_set]["test"]["r2"]
        if score < float(minimum):
            raise RuntimeError(
                f"metric gate failed: {feature_set} test R² {score} < {minimum}"
            )
    required = config.get("require_leakage_feature")
    if required and required not in manifest["leakage"]["suspects"]:
        raise RuntimeError(f"expected leakage suspect {required!r} was not flagged")
    if config.get("require_complement") and not manifest["complement"]["brittleness_is_complement"]:
        raise RuntimeError("brittleness is not the complement of ductility")


def _write_report(path: Path, manifest: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    lines = [
        f"# Run {manifest['run_id']}",
        "",
        f"Dataset role: `{manifest['dataset_role']}` · rows: {manifest['n_rows']}",
        f"Split: {manifest['split']['split_unit']} · seed {manifest['seed']}",
        "",
        "| Feature set | Model | Val R² | Test R² | Test RMSE | Test MAE | CV R² |",
        "|---|---|---:|---:|---:|---:|---:|",
    ]
    for name, result in manifest["feature_sets"].items():
        cv = result.get("cv_r2_mean")
        cv_text = "—" if cv is None else f"{cv:.4f}"
        lines.append(
            f"| {name} | {result['model']} | {result['val']['r2']:.4f} | "
            f"{result['test']['r2']:.4f} | {result['test']['rmse']:.4f} | "
            f"{result['test']['mae']:.4f} | {cv_text} |"
        )
    lines.append("")
    suspects = manifest["leakage"]["suspects"] or ["none"]
    lines.append("Leakage suspects: " + ", ".join(suspects))
    path.write_text("\n".join(lines) + "\n")


def _log_mlflow(project_root: Path, manifest: dict) -> None:
    """Record the run in MLflow when the package is installed. The JSON manifest remains the source of truth."""
    os.environ.setdefault("MLFLOW_DISABLE_AGENT_HINT", "1")
    try:
        import mlflow
    except ImportError:
        return
    try:
        tracking = project_root / "mlruns"
        tracking.mkdir(parents=True, exist_ok=True)
        mlflow.set_tracking_uri(tracking.resolve().as_uri())
        mlflow.set_experiment("axle-ductility")
        with mlflow.start_run(run_name=manifest["run_id"]):
            mlflow.log_param("dataset_role", manifest["dataset_role"])
            mlflow.log_param("n_rows", manifest["n_rows"])
            mlflow.log_param("seed", manifest["seed"])
            mlflow.log_param("serving_model", manifest["serving"]["model"])
            mlflow.log_param("serving_features", manifest["serving"]["feature_set"])
            for name, result in manifest["feature_sets"].items():
                mlflow.log_metric(f"{name}_test_r2", result["test"]["r2"])
                mlflow.log_metric(f"{name}_test_rmse", result["test"]["rmse"])
                mlflow.log_metric(f"{name}_test_mae", result["test"]["mae"])
    except Exception:
        return
