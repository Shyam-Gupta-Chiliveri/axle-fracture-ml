from pathlib import Path

import pandas as pd
import pytest

from axle_ml.data import load_table
from axle_ml.fixture import build_fixture
from axle_ml.schema import validate_frame
from axle_ml.split import split_frame


def test_fixture_matches_the_axle_schema():
    problems = validate_frame(build_fixture())
    assert problems == []


def test_schema_rejects_a_missing_column():
    frame = build_fixture(n_groups=2, rows_per_group=5)
    broken = frame.drop(columns=["Mean HV10"])
    problems = validate_frame(broken)
    assert any("Mean HV10" in problem for problem in problems)


def test_families_do_not_cross_the_split():
    frame = build_fixture()
    frame["testing_family"] = frame["Testing Group"].str.split(" - Sample").str[0]
    train, val, test, report = split_frame(frame, seed=42, test_size=0.2, val_size=0.2)
    assert report["split_unit"] == "testing_family"
    assert set(train["testing_family"]).isdisjoint(test["testing_family"])
    assert set(train["testing_family"]).isdisjoint(val["testing_family"])
    assert len(train) + len(val) + len(test) == len(frame)


def test_load_table_reads_the_committed_fixture():
    path = Path("data/fixtures/ci_axle.csv")
    if not path.exists():
        pytest.skip("fixture csv not written yet")
    frame = load_table(path)
    assert "testing_family" in frame.columns
    assert len(frame) == 480
