from fastapi import APIRouter

router = APIRouter(prefix="/api/v1/analytics", tags=["analytics"])


@router.get("")
def analytics_overview() -> dict:
    return {
        "portfolio_health": "Stable",
        "income_yoy": "+8.2%",
        "occupancy_rate": "94.8%",
        "top_risks": ["North Shore arrears", "Weekend maintenance backlog"],
    }


@router.get("/summary")
def analytics_summary() -> dict:
    return analytics_overview()
