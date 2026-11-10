"""Confirm the latest manifest has the three feature sets and a champion file."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    manifest_path = ROOT / "models" / "manifest.json"
    champion = ROOT / "models" / "champion.joblib"
    if not manifest_path.exists() or not champion.exists():
        print("models/manifest.json or champion.joblib is missing", file=sys.stderr)
        sys.exit(1)
    manifest = json.loads(manifest_path.read_text())
    required = {"chemistry", "hardness", "full"}
    present = set(manifest["feature_sets"])
    if not required <= present:
        print(f"missing feature sets: {required - present}", file=sys.stderr)
        sys.exit(1)
    if manifest["serving"]["feature_set"] != "hardness":
        print("the served model must be the hardness-only model", file=sys.stderr)
        sys.exit(1)
    if "dataset_role" not in manifest or "data_sha256" not in manifest:
        print("manifest is missing dataset identity", file=sys.stderr)
        sys.exit(1)
    print(
        f"gate ok · {manifest['dataset_role']} · run {manifest['run_id']} · "
        f"hardness test R² {manifest['feature_sets']['hardness']['test']['r2']}"
    )


if __name__ == "__main__":
    main()
