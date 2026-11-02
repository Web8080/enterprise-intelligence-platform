from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.data.sample_data import (
    build_enterprise_data_model,
    generate_ai_answer,
    get_ai_assistant_status,
    get_analytics,
    get_dashboard_overview,
    get_ingestion_status,
    get_monitoring,
    get_sales_overview,
    get_security_overview,
)
from app.routers.analytics import router as analytics_router
from app.routers.governance import router as governance_router
from app.routers.ingestion import router as ingestion_router
from app.schemas import AIQueryRequest, AIResponse, DashboardOverview

app = FastAPI(
    title="Enterprise Intelligence Platform API",
    description="Enterprise data engineering, AI, governance and monitoring platform for property operations.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analytics_router)
app.include_router(ingestion_router)
app.include_router(governance_router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "environment": settings.environment}


@app.get("/api/v1/dashboard/overview", response_model=DashboardOverview)
def dashboard_overview() -> DashboardOverview:
    data = get_dashboard_overview()
    return DashboardOverview(**data)


@app.get("/api/v1/auth")
def auth_status() -> dict:
    return {
        "provider": "internal",
        "status": "authenticated",
        "tenant": "Northgate Property Group",
        "roles": ["Portfolio Admin", "Data Steward", "Finance Manager"],
        "session": "active",
    }


@app.get("/api/v1/organisations")
def organisations() -> dict:
    return {
        "organisations": [
            {
                "id": "ORG-104",
                "name": "Northgate Property Group",
                "sector": "Property management",
                "status": "active",
                "portfolio_count": 12,
            },
            {
                "id": "ORG-211",
                "name": "Harbor Capital Assets",
                "sector": "Real estate investment",
                "status": "active",
                "portfolio_count": 6,
            },
        ],
        "count": 2,
        "selected": "ORG-104",
    }


@app.get("/api/v1/users")
def users() -> dict:
    return {
        "users": [
            {"id": "USR-1001", "name": "Aisha Chen", "role": "Portfolio Admin", "status": "active"},
            {"id": "USR-1002", "name": "Marco Silva", "role": "Finance Manager", "status": "active"},
            {"id": "USR-1003", "name": "Nadia Patel", "role": "Data Steward", "status": "active"},
        ],
        "total_users": 184,
        "active_sessions": 42,
    }


@app.get("/api/v1/properties")
def properties() -> dict:
    return {
        "properties": [
            {"id": "PROP-1101", "name": "Bayside Residences", "portfolio": "North Shore", "occupancy": 96.4, "status": "healthy"},
            {"id": "PROP-2202", "name": "Westfield Townhomes", "portfolio": "West", "occupancy": 91.8, "status": "watch"},
            {"id": "PROP-3301", "name": "Parkview Suites", "portfolio": "Central", "occupancy": 95.7, "status": "healthy"},
        ],
        "count": 248,
    }


@app.get("/api/v1/tenants")
def tenants() -> dict:
    return {
        "tenants": [
            {"id": "TEN-8001", "name": "K. Morgan", "unit": "A-14", "rent_status": "current", "arrears": 0},
            {"id": "TEN-8014", "name": "L. Singh", "unit": "B-02", "rent_status": "overdue", "arrears": 1245},
            {"id": "TEN-8022", "name": "P. Okafor", "unit": "C-11", "rent_status": "current", "arrears": 0},
        ],
        "total_tenants": 812,
        "rent_collection_rate": 96.2,
        "at_risk_count": 14,
    }


@app.get("/api/v1/finance")
def finance() -> dict:
    return {
        "gross_rent": "$4.82M",
        "expected_receipts": "$4.97M",
        "outstanding_arrears": "$248.6K",
        "maintenance_costs": "$612K",
        "forecast": [
            {"month": "Jan", "value": 1.12},
            {"month": "Feb", "value": 1.15},
            {"month": "Mar", "value": 1.21},
            {"month": "Apr", "value": 1.27},
        ],
    }


@app.get("/api/v1/sales")
def sales() -> dict:
    return get_sales_overview()


@app.get("/api/v1/maintenance")
def maintenance() -> dict:
    return {
        "open_work_orders": 37,
        "avg_resolution_hours": 41,
        "categories": [
            {"name": "Plumbing", "cost": "$167K"},
            {"name": "Electrical", "cost": "$116K"},
            {"name": "HVAC", "cost": "$92K"},
        ],
        "work_orders": [
            {"id": "WO-4401", "property": "Bayside Residences", "priority": "high", "status": "in_progress"},
            {"id": "WO-4412", "property": "Parkview Suites", "priority": "medium", "status": "queued"},
        ],
    }


@app.get("/api/v1/pipelines")
def pipelines() -> dict:
    return {
        "pipelines": [
            {"name": "property_daily_sync", "status": "completed", "duration": "03:14", "records": 38250},
            {"name": "tenant_billing_rollup", "status": "completed", "duration": "02:08", "records": 19310},
            {"name": "maintenance_ingest", "status": "failed", "duration": "00:51", "records": 0},
        ],
        "failed_jobs": 1,
    }


@app.get("/api/v1/ml")
def ml() -> dict:
    return {
        "models": [
            {"name": "rental_arrears_model", "metric": "ROC AUC", "score": 0.83, "status": "trained"},
            {"name": "occupancy_forecast_model", "metric": "MAPE", "score": 0.12, "status": "trained"},
            {"name": "maintenance_demand_model", "metric": "F1", "score": 0.78, "status": "trained"},
            {"name": "sales_pipeline_forecast_model", "metric": "MAPE", "score": 0.15, "status": "trained"},
        ],
        "predictions": [
            {"property": "Bayside Residences", "risk": "medium", "confidence": 0.71},
            {"property": "Westfield Townhomes", "risk": "high", "confidence": 0.81},
        ],
    }


@app.get("/api/v1/audit")
def audit() -> dict:
    return {
        "events": [
            {"timestamp": "2026-11-02T08:14:00Z", "actor": "Aisha Chen", "action": "exported_finance_snapshot", "status": "approved"},
            {"timestamp": "2026-11-02T09:02:00Z", "actor": "System", "action": "dataset_refresh", "status": "success"},
        ],
        "total_events": 14920,
    }


@app.get("/api/v1/analytics")
def analytics() -> dict:
    return get_analytics()


@app.get("/api/v1/ingestion")
def ingestion() -> dict:
    return get_ingestion_status()


@app.get("/api/v1/security")
def security() -> dict:
    return get_security_overview()


@app.get("/api/v1/monitoring")
def monitoring() -> dict:
    return get_monitoring()


@app.get("/api/v1/data-workflow")
def data_workflow() -> dict:
    return build_enterprise_data_model()


@app.get("/api/v1/ai/assistant")
def ai_assistant() -> dict:
    return get_ai_assistant_status()


@app.post("/api/v1/ai/query", response_model=AIResponse)
def ai_query(payload: AIQueryRequest) -> AIResponse:
    result = generate_ai_answer(payload.question)
    return AIResponse(**result)
