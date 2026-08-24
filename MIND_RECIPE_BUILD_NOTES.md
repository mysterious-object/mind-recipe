# Mind Recipe Android build notes

Build: `1.0.0+1` Android ARM64 profile APK, emulator-tested on August 20, 2026.

## Included in this build

- Working sign-in, account registration, signed sessions, and local demo entry.
- Cinematic onboarding headed “The weather of your mind.”
- Navigator as the first and default tab.
- Live OpenRouter orchestration pinned to `qwen/qwen3.6-flash`.
- Interactive Navigator conversation with explicit cloud privacy control and AI-generated-content labeling.
- Original Navigator voice plus grounded, bright, and saved-earlier voice presets; no character or performer cloning.
- Repaired native Android listening: runtime microphone permission, active listening state, stop control, silence handling, and text fallback.
- Server voice mastering pipeline with fades, loudness normalization, and peak limiting when deployed with ffmpeg.
- Today metrics derived from assistant activity: daily navigations, member messages, AI reflections, and the last activity time. These counters are stored locally and cleared at sign-out.
- Mind Recipe, Toolbox, Progress, Booking, and Profile foundations.
- Mind Recipe by Context Field branding throughout the product.

## Verification completed

- `flutter analyze`: passed with no issues.
- Flutter tests: 9 passed.
- FastAPI tests: 4 passed.
- Android APK installed and launched on `emulator-5554`.
- Microphone permission prompt, listening state, stop action, and empty-capture recovery message observed on the emulator.
- Real OpenRouter/Qwen response observed through the Android application.
- Today activity metrics observed updating after assistant interaction.
- APK SHA-256: `29f765be769d5f5fa399a9fea0f46af7dec2c43b1d33dbcd9f5cc764ab686cc7`.

## Important run requirement

This historical profile build used the Android emulator route `http://10.0.2.2:8000` and must not be distributed. Remote builds now compile against the HTTPS staging endpoint documented in `docs/remote-development.md`; no localhost or ADB reverse path is required. Provider credentials are not embedded in the APK or included with the upload. The remote staging artifact is test-signed and is not a production release.

Before distributing to physical phones or production users, configure a deployed HTTPS API endpoint, production identity/database services, and the privacy, backup, legal, youth-safety, and security release gates described in the platform plan.
