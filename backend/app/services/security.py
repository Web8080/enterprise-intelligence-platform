from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass
class SecurityPolicy:
    name: str
    kind: str
    enabled: bool = True


class SecurityService:
    """Security and governance control surface definitions."""

    def __init__(self) -> None:
        self.policies = [
            SecurityPolicy("rbac_roles", "rbac", True),
            SecurityPolicy("row_access_policy", "row_level_security", True),
            SecurityPolicy("masking_policy", "data_masking", True),
            SecurityPolicy("audit_events", "audit", True),
            SecurityPolicy("rate_limit", "api_controls", True),
        ]

    def list_policies(self) -> list[SecurityPolicy]:
        return self.policies

    def evaluate_policy(self, resource: str, action: str) -> dict[str, Any]:
        for policy in self.policies:
            if policy.kind in {"rbac", "row_level_security", "data_masking", "audit"} and policy.enabled:
                if resource in {"users", "tenants", "properties", "finance", "ai"}:
                    return {"resource": resource, "effect": "allow", "action": action, "policy": policy.name}
        return {"resource": resource, "effect": "deny", "action": action, "policy": "default_guard"}


class AIAccessGuard:
    """Protect AI tooling from unsafe SQL generation or prompt injection."""

    def __init__(self) -> None:
        self.blocked_sql_keywords = [
            "drop table",
            "alter user",
            "grant role",
            "update ",
            "delete from",
            "truncate",
        ]

    def validate_sql(self, sql: str) -> tuple[bool, str]:
        lowered = sql.lower()
        for keyword in self.blocked_sql_keywords:
            if keyword in lowered:
                return False, f"forbidden SQL pattern detected: {keyword}"
        if "select" not in lowered:
            return False, "only read-only queries are allowed"
        return True, "approved"

    def assess_prompt(self, prompt: str) -> dict[str, Any]:
        lowered = prompt.lower()
        if any(token in lowered for token in ["bypass policy", "ignore access", "exfiltrate data"]):
            return {"risk": "high", "requires_human_approval": True}
        return {"risk": "low", "requires_human_approval": False}
