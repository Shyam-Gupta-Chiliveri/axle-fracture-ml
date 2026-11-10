"""Write the committed CI fixture. Run this only when the generator changes."""

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from axle_ml.fixture import write_fixture


if __name__ == "__main__":
    path = ROOT / "data" / "fixtures" / "ci_axle.csv"
    frame = write_fixture(path)
    print(f"wrote {len(frame)} rows to {path}")
