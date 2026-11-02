from fastapi import APIRouter

router = APIRouter(prefix="/api/v1/ingestion", tags=["ingestion"])


@router.get("")
def ingestion_overview() -> dict:
    return {
        "sources": [
            {"name": "Yardi", "status": "healthy"},
            {"name": "Lease feed", "status": "degraded"},
            {"name": "Maintenance CSV", "status": "healthy"},
        ],
        "status": "operational",
    }


@router.get("/sources")
def sources() -> dict:
    return ingestion_overview()
