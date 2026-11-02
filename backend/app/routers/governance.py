from fastapi import APIRouter

router = APIRouter(prefix="/api/v1/governance", tags=["governance"])


@router.get("")
def governance_overview() -> dict:
    return {
        "status": "Compliant",
        "roles": 14,
        "masked_fields": 18,
        "suspicious_events": 2,
    }


@router.get("/summary")
def governance_summary() -> dict:
    return governance_overview()
