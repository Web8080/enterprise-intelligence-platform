from typing import Literal

from pydantic import BaseModel, Field


class Metric(BaseModel):
    label: str
    value: str
    delta: str
    trend: Literal["up", "down", "steady"]


class DashboardOverview(BaseModel):
    organisation: str
    date_range: str
    total_properties: int
    total_rental_income: str
    outstanding_arrears: str
    occupancy_rate: str
    maintenance_expenditure: str
    portfolio_health: str
    metrics: list[Metric]
    alerts: list[str]
    revenue_trend: list[int]


class AIQueryRequest(BaseModel):
    question: str = Field(..., min_length=3, max_length=500)


class AIResponse(BaseModel):
    question: str
    answer: str
    sql: str
    confidence: str
    references: list[str]
    limitations: list[str]
