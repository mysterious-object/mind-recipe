# MindRecipe Kubernetes base

These manifests intentionally cannot be applied as a production service until:

1. `REPLACE_WITH_IMMUTABLE_IMAGE` is replaced with a reviewed, pullable digest.
2. `mind-recipe-runtime` is created by External Secrets with PostgreSQL and OIDC
   settings; off-node encrypted backups, restore proof, ingress, and explicit
   egress policies are reviewed.
3. A reviewed PostgreSQL instance is reachable through the Vault-backed runtime URL,
   and its encrypted backup/restore drill has passed for this release.

Mobile release builds enable the system-browser PKCE flow with
`MIND_RECIPE_OIDC_ISSUER` and `MIND_RECIPE_OIDC_CLIENT_ID` Dart defines. The
redirect URI registered with the provider is
`com.contextfield.mindrecipe:/oauthredirect` on both mobile platforms. When
those defines are absent, only the development account gateway is available.

The namespace and default-deny policy are safe to review with `kubectl apply --dry-run=server`.
