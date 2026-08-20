"""Deterministic, intentionally conservative crisis interruption policy.

This does not diagnose risk. It only decides whether the ordinary wellness
conversation must pause and offer user-led emergency resources.
"""
from dataclasses import dataclass
import re

POLICY_VERSION = "2026-08-13"
_PATTERNS = [
    re.compile(pattern, re.I)
    for pattern in (
        r"\b(kill|hurt)\s+(myself|my self)\b",
        r"\bsuicide\b",
        r"\bend my life\b",
        r"\bkill\s+(him|her|them|someone)\b",
        r"\bwant to die\b",
    )
]


@dataclass(frozen=True)
class SafetyResult:
    interrupt: bool
    policy_version: str


def evaluate(text: str) -> SafetyResult:
    return SafetyResult(
        interrupt=any(pattern.search(text or "") for pattern in _PATTERNS),
        policy_version=POLICY_VERSION,
    )
