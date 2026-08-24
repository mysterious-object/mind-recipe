"""FHIR R4 interoperability mappings for Mind Recipe.

Maps internal models to HL7 FHIR R4 resources:
Patient, Practitioner, Consent, Questionnaire, QuestionnaireResponse,
Observation, CarePlan, Provenance, AuditEvent.
"""
from __future__ import annotations
from datetime import datetime, timezone
from typing import Any, Dict, List
from uuid import UUID
import json, csv, io


class FhirMapper:
    """Map Mind Recipe entities to FHIR R4 resources."""

    FHIR_VERSION = "4.0.1"

    @staticmethod
    def patient(user_id: str, display_name: str, email: str) -> Dict[str, Any]:
        return {
            "resourceType": "Patient", "id": user_id, "active": True,
            "name": [{"text": display_name}],
            "telecom": [{"system": "email", "value": email}],
        }

    @staticmethod
    def practitioner(pid: str, name: str) -> Dict[str, Any]:
        return {"resourceType": "Practitioner", "id": pid, "active": True, "name": [{"text": name}]}

    @staticmethod
    def consent(grant_id: UUID, member_id: str, practitioner_id: str,
                categories: List[str], purpose: str,
                starts_at: datetime, expires_at: datetime, revoked: bool = False) -> Dict[str, Any]:
        return {
            "resourceType": "Consent", "id": str(grant_id),
            "status": "active" if not revoked else "revoked",
            "patient": {"reference": f"Patient/{member_id}"},
            "performer": [{"reference": f"Practitioner/{practitioner_id}"}],
            "category": [{"coding": [{"code": c}]} for c in categories],
            "provision": {"type": "permit", "period": {"start": starts_at.isoformat(), "end": expires_at.isoformat()}},
        }

    @staticmethod
    def observation(member_id: str, code: str, value, unit: str = "") -> Dict[str, Any]:
        obs = {"resourceType": "Observation", "status": "final",
               "subject": {"reference": f"Patient/{member_id}"},
               "code": {"coding": [{"code": code}]},
               "effectiveDateTime": datetime.now(timezone.utc).isoformat()}
        if isinstance(value, (int, float)):
            obs["valueQuantity"] = {"value": value, "unit": unit}
        else:
            obs["valueString"] = str(value)
        return obs

    @staticmethod
    def provenance(target_type: str, target_id: str, agent_id: str) -> Dict[str, Any]:
        return {"resourceType": "Provenance",
                "target": [{"reference": f"{target_type}/{target_id}"}],
                "recorded": datetime.now(timezone.utc).isoformat(),
                "agent": [{"who": {"reference": f"Practitioner/{agent_id}"}}]}

    @staticmethod
    def audit_event(actor_id: str, action: str, resource_type: str, resource_id: str) -> Dict[str, Any]:
        return {"resourceType": "AuditEvent",
                "recorded": datetime.now(timezone.utc).isoformat(),
                "agent": [{"who": {"reference": f"Patient/{actor_id}"}}],
                "entity": [{"what": {"reference": f"{resource_type}/{resource_id}"}}]}

    @classmethod
    def export_json(cls, resources: List[Dict]) -> str:
        return json.dumps({"resourceType": "Bundle", "type": "collection",
                           "entry": [{"resource": r} for r in resources]}, indent=2)

    @classmethod
    def export_csv(cls, checkins: List[Dict]) -> str:
        output = io.StringIO()
        w = csv.writer(output)
        w.writerow(["id", "member_id", "emotions", "activation", "created_at"])
        for c in checkins:
            w.writerow([c.get("id"), c.get("member_id"), str(c.get("emotions")), c.get("activation"), c.get("created_at")])
        return output.getvalue()


fhir = FhirMapper()
