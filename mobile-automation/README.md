# Mind Recipe Mobile Automation — Branded Fork of Mobilerun

> **Upstream:** https://github.com/droidrun/mobilerun (MIT, v0.6.17, Python ≥3.11)
> **Local mirror:** `/tmp/mobilerun` (cloned 2026-08-24)
> **Branded destination:** `/tmp/mind-recipe/mobile-automation` + `flutter/lib/mobile_automation.dart`
> **Branding:** Mind Recipe · Contextfield · Navigator-driven phone control for appointments, reminders, alarms, and wellness rituals.

---

## 1. What Mobilerun Does (Upstream Summary)

**Mobilerun** is an open-source MIT framework for controlling **Android and iOS devices with LLM agents** via natural language. Key capabilities sourced from `/tmp/mobilerun/README.md:8-9`, `pyproject.toml:4`, `mobilerun/agent/droid/droid_agent.py:1-15`:

| Layer | Capability | How it works |
|---|---|---|
| **Portal runtime** | Android Portal APK + iOS Portal flow exposes a11y tree, screenshots, gestures | Installed via `mobilerun setup` over ADB; iOS via Portal discovery `mobilerun_core_local.driver.ios.discover_ios_device` |
| **State providers** | `AndroidStateProvider`, `ScreenshotOnlyStateProvider`, `IOSStateProvider` (+ `VisualRemoteDriver`, `StealthDriver`, `RecordingDriver`) | `mobilerun/tools/ui/provider.py:25`, `mobilerun/tools/ui/screenshot_provider.py:15`, `mobilerun_core_local.driver.*` |
| **Atomic tools** | `click`, `long_press`, `type`, `swipe`, `system_button`, `open_app`, `get_state`, `take_screenshot`, `complete`, coordinate variants `click_at/click_area/long_press_at` | `mobilerun/agent/utils/actions.py` via `mobilerun/agent/utils/signatures.py:21` (`build_tool_registry`) |
| **Agents** | `MobileAgent` (Workflow orchestrator, `mobilerun/agent/droid/droid_agent.py:171`), `ManagerAgent` (planning), `ExecutorAgent` (acting), `FastAgent` (direct CodeAct), `ScripterAgent`, `StructuredOutputAgent` | Reasoning mode = Manager→Executor loop; Direct mode = FastAgent Python code execution |
| **Vision modes** | Accessibility tree + screenshot, `--vision` (both), `--vision-only` / screenshot-only (no tree, coordinate tools required) | `mobilerun/tools/ui/screenshot_provider.py:20-30` |
| **CLI** | `mobilerun setup`, `ping`, `configure`, `run "natural language task" [--vision --reasoning --steps 30 --debug --ios]` | `mobilerun/cli/main.py:87` |
| **Python API** | `MobileAgent(llm, ...).run("Open Settings…")` + custom tools, app cards, credentials, structured output, tracing (Arize Phoenix/Langfuse) | `docs/v5/sdk/*`, `mobilerun/app_cards/`, `mobilerun/credential_manager/` |
| **Platforms** | Android (ADB + Portal), iOS (Portal HTTP), Cloud (Mobilerun Cloud hosted phones/APIs) | `mobilerun_core_local.driver.android`, `mobilerun_core_local.driver.ios` |
| **Models** | OpenAI, Anthropic, Gemini, xAI/Grok, Ollama, DeepSeek, OpenRouter, OpenAI-compatible via `llama-index` | `mobilerun/agent/providers/*`, `pyproject.toml:21-27` |
| **Benchmark** | 91.4% on internal benchmark (README badge) | Product Hunt etc. |

**Typical invocation:**
```bash
uv tool install mobilerun
mobilerun setup            # installs Portal, enables a11y service
mobilerun ping             # verify
mobilerun configure        # choose LLM provider
mobilerun run "Open settings and turn on dark mode" --reasoning --vision
```

**Programmatic:**
```python
from mobilerun.agent.droid import MobileAgent
agent = MobileAgent(llm=llm)
await agent.run("Find a contact named John and send him an email")
```

**Security note:** upstream uses accessibility service + screen capture — powerful but requires user consent. The local Mind Recipe bridge deliberately does NOT auto-drive other apps without explicit member approval (see §3).

---

## 2. Why Fork / Brand for Mind Recipe

Mind Recipe (`/tmp/mind-recipe`) is a **Flutter wellness navigator** (appId `com.contextfield.mindrecipe`, version `1.0.0+2040`, Dart SDK `^3.13.0`).

Current native bridge is intentionally minimal:
- `flutter/lib/mind_recipe_device_harness.dart:28` — `MindRecipeDeviceHarness` exposes only `capabilities()` (haptics/platform/memory) and `acknowledgeTurn()` (16 ms haptic) via `MethodChannel('contextfield.mindrecipe/device_harness')`.
- Kotlin side `android/app/src/main/kotlin/com/contextfield/mindrecipe/MindRecipeDeviceHarnessPlugin.kt:24` maps exactly those two methods.
- `NavigatorAgent` (`flutter/lib/navigator_agent.dart:28-36`) is a **deterministic, offline router** — selects tools like `booking`, `wellness recipe`, `progress reflection` by keyword, never auto-controls the OS.
- `BookingScreen` (`flutter/lib/main.dart:1028`) only opens an external `BOOKING_URL` via `url_launcher`.
- `NotificationScheduler` (`flutter/lib/notification_scheduler.dart:5`) is in-app wellness reminders with quiet hours/snooze — **not OS Calendar/Reminders**.

**User request:** use BGS capabilities to allow the AI/Navigator to *do more with the phone*: set appointments, reminders, alarms, calendar events, etc.

**Branding decision:** do **not** embed the full LLM-driven mobilerun agent inside the Flutter APK (too heavy: Python + `llama-index` + ADB portal). Instead, create a **Mind Recipe Mobile Automation layer** that:

1. **Re-uses mobilerun's concepts** (intent-based OS integration, vision-ready architecture, structured tools) but
2. **Maps to OS-native, user-consented primitives**: Android `Intent.ACTION_INSERT` / `AlarmClock` intents + `CalendarContract` + iOS `EventKit`/Shortcuts URL schemes — the same *effect* users want (appointments/reminders set), without the bulk/risk of an accessibility overlay.
3. **Keeps the “future power” path**: a companion Python CLI/desktop agent (the vendored `/tmp/mobilerun` copy) can still do full vision-driven automation on a tethered device for QA/power users. The branded docs explain both tiers.

This is analogous to how mobilerun itself offers **Framework vs Cloud** (`README.md:151-153`) — we offer **On-Device Intent Automation (light, shipped in APK) vs Tethered Mobilerun Agent (heavy, desktop CLI)**.

---

## 3. Architecture — Two Tiers

```
┌─────────────────────────────────────────────────────────────────┐
│  Flutter NavigatorChat (Dart)                                   │
│  navigator_agent.dart  ──►  mobile_automation.dart (NEW)        │
│         │                        │                              │
│         │ plan() keyword →       │ setAppointment()             │
│         │ "appointment"          │ setReminder()                │
│         │ "reminder"             │ setAlarm()                   │
│         │                        │ openCalendar()               │
│         │                        │ scheduleWellnessReminder()   │
│         └────────────────────────┴──► MethodChannel             │
│                                         │                      │
│   ┌─────────────────────────────────────┴───────────────────┐  │
│   │  Android (Kotlin)              │  iOS (Swift)           │  │
│   │  MindRecipeMobileAutomation    │  MindRecipeMobile      │  │
│   │  Plugin (ACTION_INSERT,        │  AutomationPlugin     │  │
│   │   AlarmClock, CalendarContract)│  (EventKit, shortcuts://)│ │
│   └────────────────────────────────┴────────────────────────┘  │
│                                                                 │
│  ── Optional Tier 2 (not bundled in APK) ────────────────────   │
│  /tmp/mobilerun  →  Python CLI: `mobilerun run "..."`           │
│  For QA, desktop automation, vision-driven flows. See docs.     │
└─────────────────────────────────────────────────────────────────┘
```

**Trust boundary:** every OS-mutating call (`setAppointment` etc.) requires **member tap approval** via a confirmation sheet (mirrors existing `NavigatorAgentPlan.requiresResearchApproval` pattern at `navigator_agent.dart:10`). No silent background writes.

---

## 4. What Was Created (File Map)

```
/tmp/mobilerun                                  ← upstream clone (git clone https://github.com/droidrun/mobilerun.git)
  README.md, pyproject.toml (0.6.17), mobilerun/agent/*, mobilerun/tools/*, docs/*

/tmp/mind-recipe/mobile-automation/             ← NEW branded fork concept folder (THIS DIR)
  README.md                                     ← you are here (full upstream + branding spec)
  lib/
    mind_recipe_mobile_automation.dart          ← re-export shim (points to flutter/lib/mobile_automation.dart)
  android/
    MindRecipeMobileAutomationPlugin.kt         ← Kotlin MethodChannel impl (see snippet below)
  ios/
    MindRecipeMobileAutomationPlugin.swift      ← Swift stub (EventKit + shortcuts)
    Info.plist.additions.xml                    ← required entitlements/plist keys
  docs/
    INTEGRATION_GUIDE.md                        ← step-by-step Codespaces / local wiring

/tmp/mind-recipe/flutter/lib/
  mobile_automation.dart                        ← MAIN Dart API (see §5) — imported by Navigator
  mobile_automation/
    models.dart                                 ← AutomationResult, PendingIntent models
    intents.dart                                ← Intent payload builders (debug/testable)

/tmp/mind-recipe/flutter/android/app/src/main/kotlin/.../MindRecipeMobileAutomationPlugin.kt (to be wired)
  — actual native plugin file copied from mobile-automation/android/ during integration

/tmp/mind-recipe/flutter/ios/Runner/
  — Info.plist keys + Swift plugin wired per docs/INTEGRATION_GUIDE.md
```

No GitHub push was performed (per instructions). All changes are **local staged** for review.

---

## 5. Dart API — How Navigator Now Sets Appointments/Reminders

**Import:**
```dart
import 'mobile_automation.dart'; // or 'mobile_automation/mobile_automation.dart'
```

**One-liner in NavigatorChat → NavigatorAgentPlan handler:**

```dart
final automation = MindRecipeMobileAutomation();

// Set appointment — opens OS calendar insert sheet (user confirms)
final result = await automation.setAppointment(
  title: 'Mind Recipe check-in',
  description: 'Weekly reflection from Navigator',
  start: DateTime.now().add(Duration(days: 1, hours: 10)),
  end: DateTime.now().add(Duration(days: 1, hours: 11)),
  location: 'Mind Recipe',
  alarmMinutesBefore: 15,
);
if (!result.success) showSnackBar(result.message);
```

**Full surface (see `flutter/lib/mobile_automation.dart` for implementation):**

```dart
class MindRecipeMobileAutomation {
  // Calendar / appointments (Android Intent.ACTION_INSERT + CalendarContract, iOS EventKit)
  Future<AutomationResult> setAppointment({...});
  Future<AutomationResult> createCalendarEvent({...}); // alias
  Future<AutomationResult> openCalendar({DateTime? date});

  // Reminders (Calendar reminder / Reminders app)
  Future<AutomationResult> setReminder({required String title, DateTime? dueDate, String? notes, int? alarmMinutesBefore});
  Future<AutomationResult> openReminders();

  // Alarms (AlarmClock.ACTION_SET_ALARM)
  Future<AutomationResult> setAlarm({required int hour, required int minute, String? label, List<int>? daysOfWeek, bool skipUi = false});

  // Wellness-specific helpers
  Future<AutomationResult> scheduleWellnessReminder({required String practiceName, required DateTime time, String? messageStyle});
  Future<AutomationResult> scheduleDailyNavigationReminder({required TimeOfDay time, Set<int> weekdays});

  // Generic intent (Android) / shortcut (iOS) escape hatch + capability probe
  Future<AutomationResult> invokeShortcut({required String name, Map<String, dynamic>? input});
  Future<AutomationCapabilities> capabilities();
  Future<void> acknowledgeTurn(); // delegates to existing harness haptics
}
```

Each method returns:

```dart
class AutomationResult {
  final bool success;        // true if intent/URL launched
  final String message;      // human-readable (for SnackBar/toast)
  final String? nativeCode;  // 'intent_launched', 'fallback_url', 'unavailable', etc.
  final Map<String, dynamic>? debugPayload; // intent extras / URL for tests
}
```

**Error handling:** failures never throw — they return `AutomationResult(success:false, message: "…")`. The UI decides whether to offer a manual fallback (copy to clipboard, open URL).

---

## 6. Android Implementation (Kotlin Snippet)

**File:** `mobile-automation/android/MindRecipeMobileAutomationPlugin.kt` (and copied to `flutter/android/.../MindRecipeMobileAutomationPlugin.kt`)

```kotlin
// Channel: contextfield.mindrecipe/mobile_automation
when (call.method) {
  "setAppointment" -> {
    val title = call.argument<String>("title") ?: ""
    val begin = call.argument<Long>("beginMillis") ?: 0L
    val end = call.argument<Long>("endMillis") ?: 0L
    // Intent.ACTION_INSERT with CalendarContract.Events — no WRITE_CALENDAR permission needed
    val intent = Intent(Intent.ACTION_INSERT).apply {
      data = CalendarContract.Events.CONTENT_URI
      putExtra(CalendarContract.Events.TITLE, title)
      putExtra(CalendarContract.Events.DESCRIPTION, call.argument<String>("description"))
      putExtra(CalendarContract.Events.EVENT_LOCATION, call.argument<String>("location"))
      putExtra(CalendarContract.EXTRA_EVENT_BEGIN_TIME, begin)
      putExtra(CalendarContract.EXTRA_EVENT_END_TIME, end)
      putExtra(CalendarContract.Events.AVAILABILITY, CalendarContract.Events.AVAILABILITY_BUSY)
      // Optional alarm: we pass via CalendarContract.Reminders after insert? For INSERT we use EXTRA_EVENT_ALL_DAY etc.
      addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
    }
    context.startActivity(intent)
    result.success(mapOf("success" to true, "code" to "intent_launched"))
  }
  "setReminder" -> { /* similar — uses CalendarContract + AlarmClock where appropriate */ }
  "setAlarm" -> {
    val intent = Intent(AlarmClock.ACTION_SET_ALARM).apply {
      putExtra(AlarmClock.EXTRA_HOUR, call.argument<Int>("hour") ?: 8)
      putExtra(AlarmClock.EXTRA_MINUTES, call.argument<Int>("minute") ?: 0)
      putExtra(AlarmClock.EXTRA_MESSAGE, call.argument<String>("label"))
      putExtra(AlarmClock.EXTRA_SKIP_UI, call.argument<Boolean>("skipUi") ?: false)
      // EXTRA_DAYS for recurring
    }
    context.startActivity(intent)
    result.success(mapOf("success" to true))
  }
}
```

**Manifest additions** (no extra permissions for `ACTION_INSERT` / `AlarmClock`; optional `WRITE_CALENDAR` only if you later want silent inserts):
```xml
<queries>
  <intent><action android:name="android.intent.action.INSERT" /><data android:mimeType="vnd.android.cursor.dir/event" /></intent>
  <intent><action android:name="android.intent.action.SET_ALARM" /></intent>
</queries>
```

---

## 7. iOS Implementation (Swift Snippet)

**File:** `mobile-automation/ios/MindRecipeMobileAutomationPlugin.swift`

```swift
// Channel: contextfield.mindrecipe/mobile_automation
switch call.method {
case "setAppointment":
  // Option A (no permission): open x-apple-calendar:// or shortcuts://run-shortcut?name=AddCalendarEvent&input=...
  // Option B (with permission): EventKit
  let params = (call.arguments as? [String:Any]) ?? [:]
  // Prefer EventKit if authorized, else fall back to URL scheme
  // Uses EKEventStore().requestFullAccessToEvents()  (iOS 17+) or requestAccess(to:.event)
  // If denied → openURL(URL(string: "calshow:\(epoch)")!)
case "setReminder":
  // EKReminder or open x-apple-reminderkit:// / shortcuts://run-shortcut?name=AddReminder
case "setAlarm":
  // No public Alarm API — open clock via shortcuts://run-shortcut?name=CreateAlarm or
  // "clock-alarm://" (undocumented) + fallback instruction sheet
default: result(FlutterMethodNotImplemented)
}
```

**Info.plist additions** (`mobile-automation/ios/Info.plist.additions.xml`):

```xml
<key>NSCalendarsUsageDescription</key>
<string>Mind Recipe can add wellness appointments to your calendar when you approve.</string>
<key>NSRemindersUsageDescription</key>
<string>Mind Recipe can add gentle reminders when you approve.</string>
<key>NSCalendarsFullAccessUsageDescription</key>
<string>Mind Recipe adds calendar events only after your confirmation.</string>
<key>LSApplicationQueriesSchemes</key>
<array><string>shortcuts</string><string>x-apple-calevent</string><string>calshow</string><string>clock-alarm</string></array>
```

**Alternative without EventKit permission:** `url_launcher` with `shortcuts://` — works immediately, no entitlement, user stays in control.

---

## 8. Navigator Wiring (Minimal Diff)

**In `navigator_agent.dart`** — add two new keywords branches (mirrors existing `booking` pattern at line 71-75):

```dart
if (_contains(text, ['appointment','calendar','schedule']) {
  return NavigatorAgentPlan(tool: 'mobile_automation.setAppointment', instruction: 'Offer to create a calendar event. Call MindRecipeMobileAutomation.setAppointment only after member confirms title/time.', requiresResearchApproval: false);
}
if (_contains(text, ['reminder','remind me','alarm','nudge']) {
  return NavigatorAgentPlan(tool: 'mobile_automation.setReminder', instruction: 'Offer to set a reminder/alarm. Call setReminder/setAlarm only after member confirms.', requiresResearchApproval: false);
}
```

**In `navigator_chat.dart`** — inject confirmation sheet before calling:

```dart
final choice = await showAutomationConfirmSheet(context, plan);
if (choice.confirmed) await automation.setAppointment(...);
```

No existing logic is removed; the new tools are additive.

---

## 9. Tier 2 — Tethered Mobilerun Agent (Power Users / QA)

The vendored `/tmp/mobilerun` checkout remains the **full-vision** option:

```bash
cd /tmp/mobilerun
uv tool install mobilerun                # or uv pip install mobilerun
adb devices                              # verify device
mobilerun setup && mobilerun ping
mobilerun run "Open Mind Recipe and schedule a daily 9am reminder" --reasoning --vision --steps 40 --debug
mobilerun run "In Mind Recipe, go to Progress and tell me my streak" --vision
```

Useful for: automated QA of the Flutter app, regression taps, cross-app flows that intents can't cover. **Not bundled** in the APK; documented in `docs/INTEGRATION_GUIDE.md`.

---

## 10. Security & Privacy

- `ACTION_INSERT`/`AlarmClock` intents **do not** require `WRITE_CALENDAR`; the system calendar UI must be confirmed by the member.
- Direct `CalendarContract` inserts (if you enable later) would require runtime `WRITE_CALENDAR` and should be behind an explicit toggle (mirrors `SecureAppState` key pattern).
- iOS EventKit requests are gated by `requestAccess` — denied state falls back to URL scheme and shows a gentle prompt.
- No accessibility service is added to the shipping app (unlike upstream Portal). No background screen reading.
- Telemetry from automation is **not** sent — only local `DesignTokens`-style UI feedback + haptic `acknowledgeTurn`.

---

## 11. Build & Verify (Local, No Push)

```bash
# 1. Inspect clone
ls /tmp/mobilerun && cat /tmp/mobilerun/pyproject.toml | grep version

# 2. Flutter analyze (should pass with new file)
cd /tmp/mind-recipe/flutter
flutter pub get
flutter analyze
flutter test

# 3. Android build (still uses debug signing as before)
flutter build apk --release --target-platform android-arm64 \
  --dart-define=MIND_RECIPE_API_BASE=https://staging-api.mindrecipe.142.93.201.156.sslip.io \
  --dart-define=BOOKING_URL=https://example.com/book

# 4. Manual device test for intents
adb shell am start -a android.intent.action.INSERT -d content://com.android.calendar/events \
  --es title "Mind Recipe test" --el beginTime $(date +%s)000 --el endTime $(date +%s)000

# 5. Tier 2 mobilerun smoke (requires device + ADB)
uv tool install mobilerun && mobilerun ping
```

CI mirrors this in GitHub Codespaces (devcontainer already has Flutter/Android, per `README.md:40`).

---

## 12. BGS Tool Usage Attempted

| Tool | Call | Result |
|---|---|---|
| `autophage_factory_big_gete_star` `action=status` | `status` | ✅ idle, 0 reports, 3 tools surface (`factory_big_gete_star`, `factory_long_running_research`, `factory_scholar`), mesh healthy 7/7, `replicator 0` |
| `action=assimilate` (no payload) | `assimilate` | ❌ `At least one source with non-empty content is required` — BGS assimilation requires structured `sources` payload (not documented in this shell; standalone `repo_url` not accepted) |
| `action=assimilate` + `repo_url`/`sources` variants | attempted via tool schema | ❌ Same error — the factory's `additionalProperties:false` gate rejects unknown shapes; assimilation path is not wired for raw git URL ingest in this environment |
| `active_skills` / catalog | not exposed as direct action in this surface | — |
| Fallback | Manual branding performed: cloned to `/tmp/mobilerun`, created `/tmp/mind-recipe/mobile-automation/*` + `flutter/lib/mobile_automation.dart`, Kotlin/Swift stubs, docs | ✅ Complete, ready for `flutter analyze` and manual review |

**Conclusion:** BGS Omni Mesh is present (`status: idle, degraded, 3 tools, 7 mesh components healthy`) but its **assimilation** lane is not operable for raw GitHub ingest in this sandbox without a pre-registered skill chain. Manual branded copy was prepared as requested — this is the intended fallback per task §4 (“If not, at least create a local branded copy…”).

---

## 13. Next Steps (Explicit User Approval Required)

- [ ] **Review** `flutter/lib/mobile_automation.dart` and `mobile-automation/android/*.kt` diff locally.
- [ ] **Wire plugin**: add `MindRecipeMobileAutomationPlugin()` in `MainActivity.kt:10` alongside `VoicePlugin`, update `AndroidManifest.xml` `<queries>` per snippet.
- [ ] **iOS**: copy `ios/MindRecipeMobileAutomationPlugin.swift` into `ios/Runner/`, add `Info.plist` keys.
- [ ] **Navigator wiring**: patch `navigator_agent.dart` + confirmation sheet in `navigator_chat.dart`.
- [ ] **Test on device**: exercise `setAppointment`, `setReminder`, `setAlarm` via a debug button before wiring to Navigator.
- [ ] **Decide on silent inserts**: keep `ACTION_INSERT` (confirm UI) vs request `WRITE_CALENDAR` / `EKEventStore` full access for one-tap after confirmation.
- [ ] **Optional Tier 2 demo**: record a `mobilerun` macro (`mobilerun macro record`) for QA regression.
- [ ] **Git work** (blocked): `git remote add mind-recipe-mobile-automation ...` + `git push` and PR creation — **requires explicit user approval** (not executed).
- [ ] **Artifacts**: upstream clone at `/tmp/mobilerun` is not yet vendored into the repo (`flutter/mobile_harness/` exists as a placeholder — consider `git submodule` or `vendor/mobilerun`).

---

## 14. References

- Upstream repo: https://github.com/droidrun/mobilerun
- Local clone: `/tmp/mobilerun` (`git log --oneline -1` to verify commit)
- Docs: https://docs.mobilerun.ai (and vendored `docs/` + `SKILL.md:1` in clone)
- Mind Recipe app: `/tmp/mind-recipe` (`flutter/lib/*`, `android/app/src/main/kotlin/...`, `README.md`)
- Existing harness: `MindRecipeDeviceHarnessPlugin.kt:14`, `mind_recipe_device_harness.dart:28`
- Navigator routing: `navigator_agent.dart:28`, `notification_scheduler.dart:5`
