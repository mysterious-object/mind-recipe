#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
KUBE_CONTEXT="${KUBE_CONTEXT:-do-k3s}"

kubectl --context "$KUBE_CONTEXT" create namespace mind-nav-staging --dry-run=client -o yaml \
  | kubectl --context "$KUBE_CONTEXT" apply -f -
kubectl --context "$KUBE_CONTEXT" -n mind-nav-staging create configmap mind-nav-api-source \
  --from-file="$ROOT_DIR/backend/app" \
  --dry-run=client -o yaml \
  | kubectl --context "$KUBE_CONTEXT" apply -f -
kubectl --context "$KUBE_CONTEXT" apply -f "$ROOT_DIR/deploy/staging/api.yaml"
kubectl --context "$KUBE_CONTEXT" -n mind-nav-staging rollout status deployment/mind-nav-api --timeout=180s
curl --fail --silent --show-error --max-time 20 \
  https://staging-api.mindnav.142.93.201.156.sslip.io/healthz
printf '\nStaging API verified.\n'
