"""Bounded autonomous planning for Mind Recipe.

This module is deliberately independent from external agent frameworks. It can
select approved, read-only wellness tools, run a short quality loop, research
public evidence only with per-request consent, and draft declarative skills.
It cannot execute shell commands, control a device, mutate source code, or
perform an outward-facing action.
"""
from __future__ import annotations

from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

@dataclass(frozen=True)
class ToolSpec:
    id: str
    purpose: str
    external: bool = False
    approval_required: bool = False


@dataclass
class SkillProposal:
    id: str
    goal: str
    capability: str
    status: str
    created_at: str


class NavigatorAgent:
    """Local-first tool planner with explicit external-action boundaries."""

    max_refinement_passes = 2
    tools = (
        ToolSpec("check_in", "Organize a voluntary daily reflection."),
        ToolSpec("recipe_practice", "Find a relevant Mind Recipe practice."),
        ToolSpec("lesson", "Retrieve a Mind Recipe lesson."),
        ToolSpec("progress", "Explain member-owned wellness trends."),
        ToolSpec("booking", "Open the labelled booking destination."),
        ToolSpec(
            "evidence_research",
            "Search public health literature for source titles and links.",
            external=True,
            approval_required=True,
        ),
    )

    def __init__(self) -> None:
        self._proposals: dict[str, SkillProposal] = {}
        self._audit: list[dict[str, Any]] = []

    def plan(self, text: str, *, external_research_approved: bool = False) -> dict[str, Any]:
        lowered = text.lower()
        selected: list[ToolSpec] = []
        if any(word in lowered for word in ("study", "evidence", "research", "source", "paper")):
            selected.append(self._tool("evidence_research"))
        elif any(word in lowered for word in ("lesson", "orientation", "course")):
            selected.append(self._tool("lesson"))
        elif any(word in lowered for word in ("progress", "trend", "pattern", "history")):
            selected.append(self._tool("progress"))
        elif any(word in lowered for word in ("exercise", "practice", "ground", "breathe", "tool")):
            selected.append(self._tool("recipe_practice"))
        else:
            selected.append(self._tool("check_in"))

        needs_approval = any(tool.approval_required for tool in selected)
        plan = {
            "tools": [tool.id for tool in selected],
            "external_research_approved": external_research_approved,
            "will_run_external_research": needs_approval and external_research_approved,
            "requires_approval": needs_approval and not external_research_approved,
            "max_refinement_passes": self.max_refinement_passes,
        }
        self._audit.append({"at": self._now(), "event": "plan", **plan})
        return plan

    async def research(self, query: str, *, approved: bool) -> dict[str, Any]:
        """Read public PubMed metadata after a member-approved research request."""
        if not approved:
            return {"status": "approval_required", "sources": []}
        clean_query = " ".join(query.split())[:300]
        if not clean_query:
            return {"status": "invalid_query", "sources": []}
        import httpx

        async with httpx.AsyncClient(timeout=httpx.Timeout(10.0)) as client:
            search = await client.get(
                "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi",
                params={"db": "pubmed", "term": clean_query, "retmode": "json", "retmax": 5, "sort": "relevance"},
            )
            search.raise_for_status()
            ids = search.json().get("esearchresult", {}).get("idlist", [])
            if not ids:
                return {"status": "no_results", "sources": []}
            summary = await client.get(
                "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi",
                params={"db": "pubmed", "id": ",".join(ids), "retmode": "json"},
            )
            summary.raise_for_status()
        records = summary.json().get("result", {})
        sources = [
            {
                "title": records[paper_id].get("title", "Untitled"),
                "journal": records[paper_id].get("fulljournalname", ""),
                "year": str(records[paper_id].get("pubdate", ""))[:4],
                "url": f"https://pubmed.ncbi.nlm.nih.gov/{paper_id}/",
            }
            for paper_id in ids
            if paper_id in records
        ]
        self._audit.append({"at": self._now(), "event": "research", "query": clean_query, "count": len(sources)})
        return {"status": "complete", "sources": sources}

    def propose_skill(self, goal: str) -> dict[str, Any]:
        """Draft a declarative capability; activation never grants code execution."""
        normalized = " ".join(goal.split())[:240]
        capability = self._capability_name(normalized)
        proposal = SkillProposal(
            id=str(uuid4()),
            goal=normalized,
            capability=capability,
            status="proposed",
            created_at=self._now(),
        )
        self._proposals[proposal.id] = proposal
        self._audit.append({"at": self._now(), "event": "skill_proposed", "id": proposal.id})
        return {**asdict(proposal), "requires_member_approval": True, "execution": "declarative_only"}

    def activate_skill(self, proposal_id: str, *, approved: bool) -> dict[str, Any]:
        proposal = self._proposals.get(proposal_id)
        if not proposal:
            return {"status": "not_found"}
        if not approved:
            return {**asdict(proposal), "requires_member_approval": True}
        proposal.status = "active"
        self._audit.append({"at": self._now(), "event": "skill_activated", "id": proposal.id})
        return {**asdict(proposal), "execution": "declarative_only"}

    def status(self) -> dict[str, Any]:
        return {
            "tools": [tool.id for tool in self.tools],
            "external_actions_require_approval": True,
            "source_code_writes": "disabled",
            "device_control": "disabled",
            "active_skills": sum(1 for proposal in self._proposals.values() if proposal.status == "active"),
            "proposed_skills": sum(1 for proposal in self._proposals.values() if proposal.status == "proposed"),
        }

    def _tool(self, tool_id: str) -> ToolSpec:
        return next(tool for tool in self.tools if tool.id == tool_id)

    @staticmethod
    def _capability_name(goal: str) -> str:
        words = [word for word in goal.lower().split() if word.isalnum()][:4]
        return "-".join(words) or "member-requested-tool"

    @staticmethod
    def _now() -> str:
        return datetime.now(timezone.utc).isoformat()


agent = NavigatorAgent()
