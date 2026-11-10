"""Train the fixture model when the image has none, then serve it."""

from __future__ import annotations

import os
import sys
from pathlib import Path

import uvicorn

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "src"))

from axle_ml.train import load_config, run_experiment


def main() -> None:
    manifest = ROOT / "models" / "manifest.json"
    if not manifest.exists():
        config = load_config(ROOT / "configs" / "ci.yaml")
        run_experiment(config, ROOT)
    uvicorn.run(
        "api.app:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", "8080")),
        reload=False,
    )


if __name__ == "__main__":
    main()
