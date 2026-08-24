# Mind Recipe Kubernetes base

These manifests intentionally cannot be applied as a production service until:

1. `REPLACE_WITH_IMMUTABLE_IMAGE` is replaced with a reviewed, pullable digest.
2. `mind-recipe-runtime` is created by External Secrets with a PostgreSQL URL;
   off-node encrypted backups, restore proof, JWT identity verification, ingress,
   and explicit egress policies are added.
3. The development-only in-memory repository is replaced with a PostgreSQL repository.

The namespace and default-deny policy are safe to review with `kubectl apply --dry-run=server`.
