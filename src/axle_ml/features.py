"""Three feature sets for the leakage study."""

from __future__ import annotations

from dataclasses import dataclass, field

import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler

CHEMISTRY = ["C [%]", "Si [%]", "Mn [%]", "P [%]", "S [%]", "Cr [%]", "Ni [%]"]
HARDNESS = ["Mean HV10", "Min HV10", "Max HV10"]
FORCE = [
    "Avg Bending Force (N)",
    "Min Bending Force (N)",
    "Max Bending Force (N)",
]
CATEGORICAL = ["Die-casting", "Diameter"]

FEATURE_SETS: dict[str, list[str]] = {
    "chemistry": CHEMISTRY + CATEGORICAL,
    "hardness": HARDNESS,
    "full": CHEMISTRY + HARDNESS + FORCE + CATEGORICAL,
}

LEAKAGE_WATCH = FORCE


@dataclass
class PreparedFeatures:
    """Scaler and encoders fitted on the training rows only."""

    columns: list[str]
    numeric: list[str] = field(default_factory=list)
    categorical: list[str] = field(default_factory=list)
    encoders: dict[str, LabelEncoder] = field(default_factory=dict)
    scaler: StandardScaler | None = None

    def fit(self, frame: pd.DataFrame) -> "PreparedFeatures":
        self.numeric = [column for column in self.columns if column not in CATEGORICAL]
        self.categorical = [column for column in self.columns if column in CATEGORICAL]
        encoded = self._encode(frame, unseen="raise")
        self.scaler = StandardScaler()
        self.scaler.fit(encoded[self.columns].to_numpy(dtype=float))
        return self

    def transform(self, frame: pd.DataFrame) -> tuple[np.ndarray, list[str]]:
        encoded, unknown = self._encode(frame, unseen="flag")
        matrix = self.scaler.transform(encoded[self.columns].to_numpy(dtype=float))
        return matrix, unknown

    def _encode(self, frame: pd.DataFrame, unseen: str) -> pd.DataFrame | tuple[pd.DataFrame, list[str]]:
        encoded = pd.DataFrame(index=frame.index)
        unknown: list[str] = []
        for column in self.numeric:
            encoded[column] = pd.to_numeric(frame[column], errors="coerce")
        for column in self.categorical:
            labels = frame[column].astype(str)
            if column not in self.encoders:
                encoder = LabelEncoder()
                encoder.fit(labels)
                self.encoders[column] = encoder
            lookup = {label: index for index, label in enumerate(self.encoders[column].classes_)}
            mapped = []
            for label in labels:
                if label in lookup:
                    mapped.append(lookup[label])
                elif unseen == "raise":
                    raise ValueError(f"unseen category {label!r} in {column} during fit")
                else:
                    mapped.append(-1)
                    unknown.append(column)
            encoded[column] = mapped
        if unseen == "raise":
            return encoded
        return encoded, sorted(set(unknown))
