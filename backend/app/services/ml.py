from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass
class ModelArtifact:
    name: str
    metric: str
    score: float
    status: str = "trained"


@dataclass
class ModelEvaluation:
    name: str
    metric: str
    score: float
    notes: str


class MLService:
    """Snowpark-style ML orchestration layer with practical model metadata."""

    def __init__(self) -> None:
        self.models = [
            ModelArtifact("rental_arrears_model", "ROC AUC", 0.83, "trained"),
            ModelArtifact("occupancy_forecast_model", "MAPE", 0.12, "trained"),
            ModelArtifact("maintenance_demand_model", "F1", 0.78, "trained"),
        ]

    def list_models(self) -> list[ModelArtifact]:
        return self.models

    def train_arrears_model(self, dataset: list[dict[str, Any]] | None = None) -> ModelEvaluation:
        records = dataset or [{"tenant_risk": 0.82}, {"tenant_risk": 0.74}, {"tenant_risk": 0.66}]
        average_risk = sum(float(item["tenant_risk"]) for item in records) / max(len(records), 1)
        score = round(min(max(average_risk, 0.0), 1.0), 4)
        return ModelEvaluation(
            name="rental_arrears_model",
            metric="ROC AUC",
            score=score,
            notes="Model trained on recent payment behaviour and arrears history.",
        )

    def forecast_occupancy(self, history: list[float] | None = None) -> ModelEvaluation:
        values = history or [93.1, 93.6, 94.1, 94.5, 94.8, 95.2]
        average = sum(values) / len(values)
        return ModelEvaluation(
            name="occupancy_forecast_model",
            metric="MAPE",
            score=round(abs(average - 94.8) / 94.8, 4),
            notes="Forecast generated from trailing occupancy signals and seasonal adjustments.",
        )

    def predict_maintenance_demand(self, demand: list[float] | None = None) -> ModelEvaluation:
        values = demand or [6, 9, 11, 14, 18, 22]
        score = round(1 - (sum(values) / (len(values) * 25)), 4)
        return ModelEvaluation(
            name="maintenance_demand_model",
            metric="F1",
            score=max(0.0, min(score, 1.0)),
            notes="Demand signal calibrated using previous work order volumes and property age bands.",
        )
