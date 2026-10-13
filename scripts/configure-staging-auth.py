#!/usr/bin/env python3
"""Provision only MindRecipe staging's durable Vault auth credential.

Requires explicit --apply. No credential is printed, exported, passed in a
process argument, or written to disk. Existing Vault data is preserved using
KV-v2 compare-and-set. Workload synchronization is handled by External Secrets.
"""
import argparse
import json
import secrets
import urllib.error
import urllib.request
from pathlib import Path

BASE = "http://10.43.90.246:8200/v1/"
PROJECT = "projects/mind-recipe-staging/mind-recipe-runtime"
KEY = "MIND_RECIPE_AUTH_SECRET"


def configure(apply=False):
    credential = Path("/root/.vault/token").read_text().strip()

    def request(path, body=None, method=None, missing_ok=False):
        req = urllib.request.Request(
            BASE + path,
            data=None if body is None else json.dumps(body).encode(),
            headers={"X-Vault-Token": credential, "Content-Type": "application/json"},
            method=method,
        )
        try:
            with urllib.request.urlopen(req, timeout=15) as response:
                raw = response.read()
                return json.loads(raw) if raw else {}
        except urllib.error.HTTPError as error:
            if missing_ok and error.code == 404:
                return None
            # Never include a response body or request headers in diagnostics.
            raise RuntimeError(f"Vault operation failed: HTTP {error.code}") from None

    existing = request("kv/data/" + PROJECT, missing_ok=True)
    payload = existing["data"]["data"] if existing else {}
    version = existing["data"]["metadata"]["version"] if existing else 0
    current = payload.get(KEY)
    if current is not None and (not isinstance(current, str) or len(current) < 32):
        raise RuntimeError("Existing auth credential is invalid; refusing implicit rotation")
    if not apply:
        print("Staging credential present:" if current else "Staging credential missing:", bool(current))
        print("No changes. Use --apply only after staging authorization.")
        return
    if not current:
        payload[KEY] = secrets.token_urlsafe(48)
        request("kv/data/" + PROJECT, {"options": {"cas": version}, "data": payload})
    # Restrict this role to one project secret, not all project namespaces.
    policy = f'path "kv/data/{PROJECT}" {{ capabilities = ["read"] }}\n'
    request("sys/policies/acl/mind-recipe-staging-read", {"policy": policy}, "PUT")
    request("auth/kubernetes/role/mind-recipe-staging-reader", {
        "bound_service_account_names": ["vault-reader"],
        "bound_service_account_namespaces": ["mind-recipe-staging"],
        "audience": "vault",
        "policies": ["mind-recipe-staging-read"],
        "ttl": "1h",
    })
    verified = request("kv/data/" + PROJECT)["data"]["data"].get(KEY)
    if not secrets.compare_digest(verified, payload[KEY]):
        raise RuntimeError("Vault readback did not match")
    print("Staging credential and namespace-scoped read policy verified; values withheld.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    try:
        configure(args.apply)
    except (OSError, ValueError, KeyError, RuntimeError) as error:
        # Avoid exception chaining of any transport request containing headers.
        raise SystemExit(f"Staging auth configuration failed ({type(error).__name__}).") from None
