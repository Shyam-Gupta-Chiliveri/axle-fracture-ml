"""Score one new CSV against the training reference in the manifest."""

from __future__ import annotations

import json
import sys
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from axle_ml.drift import check_batch


def main() -> None:
    if len(sys.argv) != 2:
        print("usage: python scripts/check_batch.py path/to/batch.csv", file=sys.stderr)
        sys.exit(2)
    manifest = json.loads((ROOT / "models" / "manifest.json").read_text())
    frame = pd.read_csv(sys.argv[1])
    report = check_batch(frame, manifest["reference_stats"])
    print(json.dumps(report, indent=2))
    sys.exit(0 if report["accepted"] else 1)


if __name__ == "__main__":
    main()
