# Mind Nav

Mind Nav is the Mind Recipe wellness navigation app: a Flutter Android client, a bounded FastAPI service, and a small web entry point for the Mind Recipe experience.

The repository is designed for private GitHub use. User records, local databases, model files, API credentials, tokens, keystores, and generated APKs stay outside source control.

## Local development

For the web entry point:

```bash
npm ci
npm run build
```

For the API:

```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -e '.[dev]'
.venv/bin/pytest
```

For Flutter and Android:

```bash
cd flutter
flutter pub get
flutter analyze
flutter test
flutter build apk --release --target-platform android-arm64 \
  --dart-define=MIND_NAV_API_BASE=https://staging-api.mindnav.142.93.201.156.sslip.io
```

The Android client defaults to the HTTPS Mind Nav staging API. Override it only with an explicit `--dart-define`; no localhost or ADB reverse path is required.

## Remote workflow

Open the private repository in GitHub Codespaces. The checked-in devcontainer installs Flutter, Android tooling, Java, Node, and Python. GitHub Actions runs the Flutter analyzer/tests, backend tests, and release APK workflow. The APK workflow uploads a downloadable artifact named `mind-nav-android-apk`.

See [docs/remote-development.md](docs/remote-development.md) for Codespaces setup, staging API deployment, remote builds, Android installation, secrets, and recovery.

## Safety boundary

The staging API is for development verification only. It uses an isolated staging database path and must not receive real user records. Production requires an approved secret manager, managed PostgreSQL, HTTPS ingress, immutable images, backup/restore proof, identity verification, and an independently reviewed release.
