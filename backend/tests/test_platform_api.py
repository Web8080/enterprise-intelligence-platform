from fastapi.testclient import TestClient

from app.data.sample_data import build_enterprise_data_model
from app.main import app

client = TestClient(app)


def test_health_endpoint() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "ok"


def test_dashboard_metrics_endpoint() -> None:
    response = client.get("/api/v1/dashboard/overview")
    assert response.status_code == 200
    payload = response.json()
    assert payload["organisation"]
    assert payload["total_properties"] > 0
    assert "metrics" in payload


def test_ai_query_endpoint() -> None:
    response = client.post(
        "/api/v1/ai/query",
        json={"question": "Which properties have the highest rental arrears?"},
    )
    assert response.status_code == 200
    payload = response.json()
    assert "answer" in payload
    assert "sql" in payload
    assert payload["confidence"] in {"High", "Medium", "Low"}


def test_sales_endpoint_returns_pipeline_and_targets() -> None:
    response = client.get("/api/v1/sales")
    assert response.status_code == 200
    payload = response.json()
    assert payload["pipeline_value"]
    assert len(payload["pipeline"]) > 0
    assert len(payload["targets"]) > 0


def test_ai_assistant_endpoint_exposes_capabilities() -> None:
    response = client.get("/api/v1/ai/assistant")
    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "online"
    assert payload["suggested_questions"]
    assert any("pipeline" in question.lower() for question in payload["suggested_questions"])


def test_enterprise_module_endpoints() -> None:
    for path in [
        "/api/v1/organisations",
        "/api/v1/users",
        "/api/v1/properties",
        "/api/v1/tenants",
        "/api/v1/finance",
        "/api/v1/sales",
        "/api/v1/ai/assistant",
        "/api/v1/maintenance",
        "/api/v1/pipelines",
        "/api/v1/ml",
        "/api/v1/governance",
        "/api/v1/audit",
        "/api/v1/monitoring",
    ]:
        response = client.get(path)
        assert response.status_code == 200, f"Endpoint failed: {path}"
        assert isinstance(response.json(), dict)


def test_enterprise_data_model_has_daily_monthly_and_annual_updates() -> None:
    dataset = build_enterprise_data_model()

    assert dataset["total_records"] >= 1_000_000
    assert len(dataset["daily_updates"]) >= 30
    assert len(dataset["monthly_updates"]) >= 12
    assert len(dataset["annual_updates"]) >= 3
