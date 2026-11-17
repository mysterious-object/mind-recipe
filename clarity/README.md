# Mind Recipe interface from Figma Make

The `app/` screens and `styles/globals.css` originate from the supplied `src.zip`
for Figma Make file `WXJwnsq6HlyG62Fs7Bvg7c` (Clarity onboarding). The native app
loads a self-contained, offline build of these screens. Branding uses MindRecipe;
the Learn destination is named **Mind Recipe** and opens the existing Flutter
lesson library and progress. Navigator chat and new AI generation are not exposed.

```sh
npm ci
npm run build
npx playwright install chromium
npm test
```

The generated `flutter/assets/clarity/index.html` is checked in for Flutter-only
builds. Mobile CI also rebuilds it. `npm run dev` starts a browser preview, whose
storage is independent of the native app.

`host.ts` communicates with `flutter/lib/clarity_experience.dart`. Native snapshots
are stored with Flutter Secure Storage under an account-specific key. Earlier
account-owned check-ins are migrated on first use. New check-ins and journal notes
are local to this device; the existing lesson progress integration remains in the
native library. Failed writes are shown with a retry action. Phone and SMS actions
open the system dialer or composer after confirmation; they never send messages.

Prototype fixes include consistent numeric activation, actual journal saving,
unique-day streaks, editable support preferences, real native sharing and device
authentication, working grounding practices, and native speech transcription.
Recommendations and reflection prompts are deterministic. The community section
remains the prototype's explicitly labeled future feature.

Device validation is still required for WKWebView, biometric lifecycle behavior,
sharing, speech permissions, and accessibility before an iOS release.
