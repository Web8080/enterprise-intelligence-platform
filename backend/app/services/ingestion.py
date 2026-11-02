from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass
class IngestionRecord:
    source_name: str
    payload_type: str
    record_count: int
    status: str = "accepted"


class IngestionService:
    """Simplified ingestion service for a modular enterprise platform."""

    def __init__(self) -> None:
        self.records: list[IngestionRecord] = []

    def ingest_csv(self, source_name: str, rows: list[dict[str, Any]]) -> IngestionRecord:
        record = IngestionRecord(source_name=source_name, payload_type="csv", record_count=len(rows))
        self.records.append(record)
        return record

    def ingest_json(self, source_name: str, rows: list[dict[str, Any]]) -> IngestionRecord:
        record = IngestionRecord(source_name=source_name, payload_type="json", record_count=len(rows))
        self.records.append(record)
        return record

    def get_history(self) -> list[IngestionRecord]:
        return self.records
