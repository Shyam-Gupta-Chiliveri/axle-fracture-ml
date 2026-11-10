"""Load the axle table and name the testing family used for the split."""

from __future__ import annotations

import hashlib
from pathlib import Path

import pandas as pd

from axle_ml.schema import GROUP_COLUMN, validate_frame

FAMILY_COLUMN = "testing_family"


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def testing_family(value: object) -> str:
    text = str(value)
    marker = " - Sample"
    if marker in text:
        return text.split(marker)[0]
    return text


def dataset_role(path: Path, n_rows: int) -> str:
    if "fixtures" in path.parts:
        return "ci_fixture"
    if n_rows >= 100_000:
        return "thesis_table"
    return "local_table"


def load_table(path: Path) -> pd.DataFrame:
    frame = pd.read_csv(path)
    problems = validate_frame(frame)
    if problems:
        joined = "\n".join(f"- {problem}" for problem in problems)
        raise ValueError(f"schema check failed for {path}:\n{joined}")
    frame = frame.copy()
    frame[FAMILY_COLUMN] = frame[GROUP_COLUMN].map(testing_family)
    return frame
