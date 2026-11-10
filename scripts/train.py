"""Train from a YAML config and write models/manifest.json."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from axle_ml.train import load_config, run_experiment


def main() -> None:
    parser = argparse.ArgumentParser(description="Train the axle ductility models")
    parser.add_argument("--config", default="configs/experiment.yaml")
    args = parser.parse_args()
    config_path = Path(args.config)
    if not config_path.is_absolute():
        config_path = ROOT / config_path
    manifest = run_experiment(load_config(config_path), ROOT)
    summary = {
        "run_id": manifest["run_id"],
        "dataset_role": manifest["dataset_role"],
        "n_rows": manifest["n_rows"],
        "serving": manifest["serving"],
        "test_r2": {
            name: result["test"]["r2"] for name, result in manifest["feature_sets"].items()
        },
        "leakage_suspects": manifest["leakage"]["suspects"],
    }
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
