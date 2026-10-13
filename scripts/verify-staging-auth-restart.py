#!/usr/bin/env python3
"""Explicit staging-only restart probe; exports no token or signing secret."""
import argparse
import hmac
import json
import subprocess
import time

KUBE = ["kubectl", "--request-timeout=10s", "-n", "mind-recipe-staging"]


def run(*args):
    result = subprocess.run([*KUBE, *args], capture_output=True, text=True, timeout=25)
    if result.returncode:
        raise RuntimeError("Staging Kubernetes operation failed")
    return result.stdout


def ready_pod():
    pods = json.loads(run("get", "pods", "-l", "app=mind-recipe-api", "-o", "json"))
    for pod in pods["items"]:
        if pod["metadata"].get("deletionTimestamp"):
            continue
        states = pod.get("status", {}).get("containerStatuses", [])
        if states and all(state.get("ready") for state in states):
            return pod["metadata"]["name"]
    return None


def probe(pod):
    # A non-authenticating challenge digest is compared only in memory. The
    # synthetic account is never saved and the test token never leaves the pod.
    code = '''import hashlib,hmac,json,os
from app.auth import UserAccount,issue_token,verify_token_identity
secret=os.environ.get("MIND_RECIPE_AUTH_SECRET", "")
assert len(secret)>=32
account=UserAccount(id="staging-restart-probe-not-an-account",email="probe@example.invalid",display_name="Probe",password_hash="unused")
assert verify_token_identity(issue_token(account))==(account.id,"member")
print(json.dumps({"digest":hmac.new(secret.encode(),b"staging-auth-restart-check-v1",hashlib.sha256).hexdigest(),"roundtrip":True}))'''
    return json.loads(run("exec", pod, "-c", "api", "--", "python", "-c", code))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--restart-staging", action="store_true", required=True)
    parser.parse_args()
    before = ready_pod()
    if before is None:
        raise RuntimeError("Staging is not ready; no restart performed")
    first = probe(before)
    print("Before restart: configured signing key and token verification passed.", flush=True)
    run("rollout", "restart", "deployment/mind-recipe-api")
    started = time.monotonic()
    deadline = started + 240
    reconciled = False
    while time.monotonic() < deadline:
        after = ready_pod()
        if after and after != before:
            second = probe(after)
            if not hmac.compare_digest(first["digest"], second["digest"]):
                raise RuntimeError("Signing key changed across staging restart")
            print("PASS: new staging pod uses the same signing key; token verification passed. No credentials exported.")
            return
        # On this staging controller a Recreate rollout has occasionally stopped
        # after scaling the old ReplicaSet to zero. A metadata-only event asks
        # the controller to reconcile without changing the pod spec or secrets.
        if after is None and not reconciled and time.monotonic() - started >= 60:
            run("annotate", "deployment/mind-recipe-api",
                f"mindrecipe.io/auth-verification={time.time_ns()}", "--overwrite")
            reconciled = True
        time.sleep(5)
    raise RuntimeError("Staging restart did not become ready within 240 seconds")


if __name__ == "__main__":
    try:
        main()
    except (RuntimeError, OSError, ValueError, subprocess.TimeoutExpired) as error:
        raise SystemExit(f"Staging verification failed ({type(error).__name__}).") from None
