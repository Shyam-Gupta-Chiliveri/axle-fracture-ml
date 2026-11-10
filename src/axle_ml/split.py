"""Hold out whole testing families so repeated samples do not leak into the test set."""

from __future__ import annotations

import numpy as np
import pandas as pd

from axle_ml.data import FAMILY_COLUMN


def split_frame(
    frame: pd.DataFrame,
    *,
    seed: int,
    test_size: float,
    val_size: float,
) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, dict]:
    families = frame[FAMILY_COLUMN].astype(str)
    unique = np.array(sorted(families.unique()))
    report = {"n_families": int(len(unique))}

    if len(unique) < 5:
        train, val, test = _row_split(frame, seed, test_size, val_size)
        report["split_unit"] = "row"
        report["reason"] = "Fewer than 5 testing families, so the split is by row."
    else:
        train, val, test = _family_split(frame, unique, seed, test_size, val_size)
        report["split_unit"] = "testing_family"

    report["n_train"] = int(len(train))
    report["n_val"] = int(len(val))
    report["n_test"] = int(len(test))
    report["train_families"] = sorted(train[FAMILY_COLUMN].astype(str).unique())
    report["val_families"] = sorted(val[FAMILY_COLUMN].astype(str).unique())
    report["test_families"] = sorted(test[FAMILY_COLUMN].astype(str).unique())
    _assert_disjoint(report)
    return train, val, test, report


def _family_split(frame, unique, seed, test_size, val_size):
    rng = np.random.default_rng(seed)
    order = rng.permutation(unique)
    n_test = max(1, int(round(len(order) * test_size)))
    n_val = max(1, int(round(len(order) * val_size)))
    if n_test + n_val >= len(order):
        n_val = 1
        n_test = 1
    test_ids = set(order[:n_test])
    val_ids = set(order[n_test : n_test + n_val])
    family = frame[FAMILY_COLUMN].astype(str)
    test = frame[family.isin(test_ids)].copy()
    val = frame[family.isin(val_ids)].copy()
    train = frame[~family.isin(test_ids | val_ids)].copy()
    return train, val, test


def _row_split(frame, seed, test_size, val_size):
    rng = np.random.default_rng(seed)
    order = rng.permutation(len(frame))
    n_test = max(1, int(round(len(frame) * test_size)))
    n_val = max(1, int(round(len(frame) * val_size)))
    test_idx = order[:n_test]
    val_idx = order[n_test : n_test + n_val]
    train_idx = order[n_test + n_val :]
    return frame.iloc[train_idx].copy(), frame.iloc[val_idx].copy(), frame.iloc[test_idx].copy()


def _assert_disjoint(report: dict) -> None:
    if report["split_unit"] != "testing_family":
        return
    train = set(report["train_families"])
    val = set(report["val_families"])
    test = set(report["test_families"])
    if train & val or train & test or val & test:
        raise RuntimeError("a testing family landed in more than one split")
