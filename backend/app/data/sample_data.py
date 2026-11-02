from __future__ import annotations

from typing import Any


def get_dashboard_overview() -> dict[str, Any]:
    return {
        "organisation": "Northgate Property Group",
        "date_range": "Q3 2026",
        "total_properties": 248,
        "total_rental_income": "$4.82M",
        "outstanding_arrears": "$248.6K",
        "occupancy_rate": "94.8%",
        "maintenance_expenditure": "$612K",
        "portfolio_health": "Stable",
        "metrics": [
            {"label": "Monthly rent collected", "value": "$1.33M", "delta": "+8.2%", "trend": "up"},
            {"label": "Occupancy uplift", "value": "2.1%", "delta": "+0.6pp", "trend": "up"},
            {"label": "Arrears ratio", "value": "5.9%", "delta": "-0.8pp", "trend": "down"},
            {"label": "Maintenance backlog", "value": "31 tickets", "delta": "-12%", "trend": "down"},
        ],
        "alerts": [
            "Three high-value units require arrears review within 7 days.",
            "One portfolio is trending below occupancy target in the North Shore cluster.",
            "Two maintenance suppliers exceeded budget thresholds last month.",
        ],
        "revenue_trend": [78, 82, 88, 94, 96, 101, 109, 118],
    }


def get_analytics() -> dict[str, Any]:
    return {
        "portfolio_breakdown": [
            {"name": "Residential", "value": 62},
            {"name": "Commercial", "value": 18},
            {"name": "Mixed-use", "value": 14},
            {"name": "Student accommodation", "value": 6},
        ],
        "income_trend": [
            {"month": "Jan", "income": 1100000},
            {"month": "Feb", "income": 1180000},
            {"month": "Mar", "income": 1230000},
            {"month": "Apr", "income": 1265000},
            {"month": "May", "income": 1330000},
            {"month": "Jun", "income": 1410000},
        ],
        "arrears_by_region": [
            {"region": "West", "arrears": 41},
            {"region": "North", "arrears": 58},
            {"region": "Central", "arrears": 49},
            {"region": "South", "arrears": 37},
        ],
    }


def get_ingestion_status() -> dict[str, Any]:
    return {
        "sources": [
            {"name": "Yardi integration", "status": "healthy", "records": 182400, "latency": "2m 18s"},
            {"name": "Lease JSON feed", "status": "warning", "records": 89400, "latency": "7m 10s"},
            {"name": "Maintenance CSV upload", "status": "healthy", "records": 24590, "latency": "1m 55s"},
        ],
        "recent_jobs": [
            {"job": "property_daily_sync", "status": "completed", "duration": "03:14", "records": 38250},
            {"job": "tenant_billing_rollup", "status": "completed", "duration": "02:08", "records": 19310},
            {"job": "maintenance_ingest", "status": "failed", "duration": "00:51", "records": 0},
        ],
    }


def get_security_overview() -> dict[str, Any]:
    return {
        "users": 184,
        "roles": ["Portfolio Admin", "Finance Manager", "Data Steward", "Regional Ops Lead"],
        "access_policies": 42,
        "masking_rules": 16,
        "audit_events": 14920,
        "suspicious_activity": ["Unusual export from finance data set", "Repeated failed admin authentications"],
        "governance_status": "Compliant",
    }


def get_monitoring() -> dict[str, Any]:
    return {
        "api_health": 99.8,
        "service_availability": 99.7,
        "pipeline_health": 97.2,
        "warehouse_utilisation": 68,
        "error_rate": 0.8,
        "latency_ms": 412,
        "alerts": [
            {"service": "ingestion-api", "state": "warning", "message": "Queue lag increased by 11%"},
            {"service": "analytics-view", "state": "healthy", "message": "No critical issues"},
        ],
    }


def generate_ai_answer(question: str) -> dict[str, Any]:
    normalized = question.lower()

    if "arrears" in normalized:
        answer = "The highest rental arrears are concentrated in the North Shore and West portfolios, with a current exposure of approximately $248.6K. The underlying trend has improved by 0.8 percentage points quarter-over-quarter, but attention is still needed on the top 12 overdue accounts."
        sql = "SELECT portfolio_name, SUM(arrears_amount) AS total_arrears FROM curated.payment_watch WHERE balance > 0 GROUP BY portfolio_name ORDER BY total_arrears DESC LIMIT 10;"
        references = ["curated.payment_watch", "curated.portfolio_dim", "curated.tenant_dim"]
        confidence = "High"
    elif "income" in normalized or "rental income" in normalized:
        answer = "Total rental income for Q3 was $4.82M, which is 8.2% higher than the prior quarter and consistent with stronger occupancy across residential portfolios."
        sql = "SELECT SUM(rental_amount) AS total_rental_income FROM curated.rent_roll WHERE invoice_period BETWEEN '2026-07-01' AND '2026-09-30';"
        references = ["curated.rent_roll", "curated.property_dim"]
        confidence = "High"
    elif "occupancy" in normalized:
        answer = "Overall occupancy is 94.8%, with mixed-use and student accommodation clusters showing the strongest gains. The North Shore cluster remains below target and requires leasing intervention."
        sql = "SELECT property_id, occupancy_rate FROM curated.property_occupancy WHERE snapshot_date = CURRENT_DATE() ORDER BY occupancy_rate ASC;"
        references = ["curated.property_occupancy", "curated.property_dim"]
        confidence = "Medium"
    elif "maintenance" in normalized:
        answer = "Maintenance expenditure is $612K for the current period, with plumbing, electrical, and HVAC work representing the highest cost categories. The backlog has fallen by 12% after recent contractor scheduling improvements."
        sql = "SELECT maintenance_category, SUM(cost_amount) AS total_cost FROM curated.maintenance_fact GROUP BY maintenance_category ORDER BY total_cost DESC LIMIT 5;"
        references = ["curated.maintenance_fact", "curated.property_dim"]
        confidence = "High"
    elif "tenant" in normalized and "behavior" in normalized:
        answer = "Payment behaviour analysis suggests a core group of tenants with irregular payment timing and a higher probability of delinquency. Early intervention remains the best lever for reducing arrears risk."
        sql = "SELECT tenant_id, payment_stability_score, arrears_probability FROM curated.tenant_behaviour_model ORDER BY arrears_probability DESC LIMIT 20;"
        references = ["curated.tenant_behaviour_model", "curated.payment_fact"]
        confidence = "Medium"
    else:
        answer = "The platform can help answer portfolio, arrears, occupancy, maintenance, and tenant behaviour questions with data-backed insights. Please ask a question covering one of those categories."
        sql = "SELECT * FROM curated.property_kpis LIMIT 10;"
        references = ["curated.property_kpis"]
        confidence = "Low"

    return {
        "question": question,
        "answer": answer,
        "sql": sql,
        "references": references,
        "confidence": confidence,
        "limitations": [
            "Answers are grounded in the current demonstration dataset and should not be interpreted as formal financial reporting.",
            "Operational decisions should be validated by the relevant portfolio administrator before action.",
        ],
    }
