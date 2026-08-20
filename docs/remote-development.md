# Mind Nav remote development

## Codespaces

1. Open the private Mind Nav repository and choose **Code → Codespaces → Create codespace on main**.
2. Wait for the checked-in `.devcontainer/devcontainer.json` to finish installing Flutter, Android SDK/NDK, Java 17, Python, and Node.
3. Run `flutter doctor`, `flutter analyze`, `flutter test`, and `cd backend && pytest`.
4. Do not copy `.env` files, user databases, model downloads, signing keys, or API credentials into the repository or a Codespaces image.

## Staging API

The development staging endpoint is:

`https://staging-api.mindnav.142.93.201.156.sslip.io`

It is an isolated, non-production service. The deployment script publishes only the backend source into a temporary staging ConfigMap, uses an ephemeral SQLite data volume, and verifies `/healthz` over HTTPS. Never put real user records into this environment. Production must use an approved secret manager and managed PostgreSQL.

From a checkout with authorized cluster access:

```bash
./scripts/deploy-staging.sh
curl --fail https://staging-api.mindnav.142.93.201.156.sslip.io/healthz
```

The cluster credential is local-only. It must not be copied into GitHub, Codespaces, workflow logs, or source files.

## GitHub Actions and APKs

`Mind Nav checks` runs the web build, backend tests, Flutter analyzer, and Flutter tests. `Mind Nav Android APK` builds an ARM64 release-mode staging APK on a tag or manual dispatch and publishes `mind-nav-android-apk` as a downloadable Actions artifact.

The API URL is a non-secret workflow variable. Provider keys, auth secrets, database credentials, Android keystores, and signing passwords are secrets and must be configured through GitHub Secrets or an approved secret manager. The checked-in workflow intentionally uses a test signing fallback when no production keystore is configured; that artifact is not a production release.

## Android installation and phone test

1. Download `app-release.apk` from the successful `mind-nav-android-apk` artifact.
2. On an authorized test phone, allow installation from the source used to download the APK, then install it.
3. Launch Mind Nav, register a test-only account, and confirm that sign-in reaches the staging API without localhost or `adb reverse`.
4. Confirm the app can load the Today/Mind Nav surfaces and record the staging response timestamp. Do not use a real person’s account or wellness data.

The endpoint is compile-time configurable:

```bash
flutter build apk --release --target-platform android-arm64 \
  --dart-define=MIND_NAV_API_BASE=https://staging-api.mindnav.142.93.201.156.sslip.io
```

## Recovery

- If the API is unhealthy, inspect `kubectl --context do-k3s -n mind-nav-staging get pods,events` and rollout status before changing source.
- Re-run `./scripts/deploy-staging.sh` to replace the source ConfigMap and restart the deployment.
- If a workflow fails, inspect the failed job logs and rerun only after identifying the failure. Downloaded APKs and build caches are regenerable and must not be treated as source backups.
- If a signing or provider secret is missing, stop. Do not paste it into a workflow, commit it, or print it in a log.
