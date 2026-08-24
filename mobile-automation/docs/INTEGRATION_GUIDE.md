# Integration Guide — Mind Recipe Mobile Automation

> Upstream: https://github.com/droidrun/mobilerun · Local mirror: `/tmp/mobilerun` · Branded folder: `/tmp/mind-recipe/mobile-automation`

---

## 0. Preflight

```bash
ls /tmp/mobilerun/pyproject.toml && grep version /tmp/mobilerun/pyproject.toml
ls /tmp/mind-recipe/flutter/lib/mobile_automation.dart
cat /tmp/mind-recipe/flutter/android/app/src/main/kotlin/com/contextfield/mindrecipe/MainActivity.kt
```

Expected: mobilerun 0.6.17 present, `mobile_automation.dart` present, `MainActivity` currently only registers `VoicePlugin` + `MindRecipeDeviceHarnessPlugin`.

---

## 1. Wire Android Native Plugin

### 1a. Copy plugin file
```bash
cp /tmp/mind-recipe/mobile-automation/android/MindRecipeMobileAutomationPlugin.kt \
   /tmp/mind-recipe/flutter/android/app/src/main/kotlin/com/contextfield/mindrecipe/MindRecipeMobileAutomationPlugin.kt
# Actually keep both: the copy in flutter/android/... is the compiled one.
# Safer: cp to that path (overwrite if integrating):
cp /tmp/mind-recipe/mobile-automation/android/MindRecipeMobileAutomationPlugin.kt \
   /tmp/mind-recipe/flutter/android/app/src/main/kotlin/com/contextfield/mindrecipe/MindRecipeMobileAutomationPlugin.kt
# But we already have MindRecipeDeviceHarnessPlugin.kt there — this is a second file, so just add it:
ls flutter/android/app/src/main/kotlin/com/contextfield/mindrecipe/
```

If the destination already has a `MindRecipeMobileAutomationPlugin.kt` with older content, replace it with the branded one (they differ — device harness is haptics-only, automation is intents).

### 1b. Register in MainActivity.kt
Edit `flutter/android/app/src/main/kotlin/com/contextfield/mindrecipe/MainActivity.kt`:

```kotlin
package com.contextfield.mindrecipe

import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine

class MainActivity : FlutterActivity() {
    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)
        flutterEngine.plugins.add(VoicePlugin())
        flutterEngine.plugins.add(MindRecipeDeviceHarnessPlugin())
        flutterEngine.plugins.add(MindRecipeMobileAutomationPlugin()) // <-- add this
    }
}
```

### 1c. Update AndroidManifest.xml queries
Edit `flutter/android/app/src/main/AndroidManifest.xml` inside `<manifest><queries>` (create `<queries>` if missing):

```xml
<queries>
  <intent><action android:name="android.intent.action.PROCESS_TEXT"/><data android:mimeType="text/plain"/></intent>
  <!-- Mobile automation -->
  <intent><action android:name="android.intent.action.INSERT"/><data android:mimeType="vnd.android.cursor.dir/event"/></intent>
  <intent><action android:name="android.intent.action.VIEW"/><data android:mimeType="vnd.android.cursor.dir/event"/></intent>
  <intent><action android:name="android.intent.action.SET_ALARM"/></intent>
</queries>
```

No `<uses-permission>` needed for `ACTION_INSERT`/`SET_ALARM` (confirm UI handles it). Only add `WRITE_CALENDAR` later if you want silent inserts.

### 1d. Build check
```bash
cd /tmp/mind-recipe/flutter
flutter analyze
flutter build apk --debug --target-platform android-arm64
adb install -r build/app/outputs/flutter-apk/app-debug.apk
```

---

## 2. Wire iOS Native Plugin

### 2a. Copy Swift file
```bash
cp /tmp/mind-recipe/mobile-automation/ios/MindRecipeMobileAutomationPlugin.swift \
   /tmp/mind-recipe/flutter/ios/Runner/MindRecipeMobileAutomationPlugin.swift
```

### 2b. Register in AppDelegate.swift
Open `flutter/ios/Runner/AppDelegate.swift`:

```swift
import Flutter
import UIKit

@main
@objc class AppDelegate: FlutterAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    GeneratedPluginRegistrant.register(with: self)
    // Register Mind Recipe automation after GeneratedPluginRegistrant
    if let registrar = self.registrar(forPlugin: "mind_recipe_mobile_automation") {
        MindRecipeMobileAutomationPlugin.register(with: registrar)
    }
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
}
```

If your project uses `AppDelegate` as `NSObject` without `@main`, adapt accordingly — the key line is the registrar call.

### 2c. Merge Info.plist additions
Copy keys from `mobile-automation/ios/Info.plist.additions.xml` into `flutter/ios/Runner/Info.plist` inside the top `<dict>`:

- `NSCalendarsUsageDescription`
- `NSCalendarsFullAccessUsageDescription`
- `NSCalendarsWriteOnlyAccessUsageDescription`
- `NSRemindersUsageDescription`
- `LSApplicationQueriesSchemes` = `[shortcuts, x-apple-calevent, calshow, x-apple-reminderkit, clock-alarm]`

If `LSApplicationQueriesSchemes` already exists, merge arrays (don't duplicate).

### 2d. Build check
```bash
cd /tmp/mind-recipe/flutter
flutter analyze
flutter build ios --no-codesign  # or open in Xcode
```

---

## 3. Navigator Wiring (Dart)

### 3a. Add import
In `flutter/lib/navigator_chat.dart` (or wherever Navigator handles `NavigatorAgentPlan`):

```dart
import 'mobile_automation.dart';
```

### 3b. Route new plans from NavigatorAgent
Patch `flutter/lib/navigator_agent.dart` — add after the existing `booking` branch (~line 71):

```dart
if (_contains(text, const ['appointment', 'calendar', 'schedule', 'event'])) {
  return const NavigatorAgentPlan(
    tool: 'mobile_automation.setAppointment',
    instruction: 'Offer to create a calendar event. Ask for title + time, then call setAppointment only after the member taps Confirm. Never invent a time.',
  );
}
if (_contains(text, const ['reminder', 'remind me', 'nudge', 'follow up'])) {
  return const NavigatorAgentPlan(
    tool: 'mobile_automation.setReminder',
    instruction: 'Offer to set a gentle reminder. Ask for title + due time, then call setReminder only after confirmation.',
  );
}
if (_contains(text, const ['alarm', 'wake', 'wake up'])) {
  return const NavigatorAgentPlan(
    tool: 'mobile_automation.setAlarm',
    instruction: 'Offer to set an alarm. Ask for clock time + label, then call setAlarm only after confirmation.',
  );
}
```

Add corresponding entries to `_contains` helpers if needed; keep the deterministic routing style (offline, no LLM needed).

### 3c. Show confirmation sheet before invoking
In `navigator_chat.dart`, where you handle the AI reply / plan:

```dart
Future<void> _handleAutomation(NavigatorAgentPlan plan, String memberMessage) async {
  final automation = MindRecipeMobileAutomation();
  // Example: parse title/time from memberMessage or ask follow-up; simplified:
  final confirmed = await showDialog<bool>(
    context: context,
    builder: (_) => AlertDialog(
      title: Text(plan.tool == 'mobile_automation.setAppointment' ? 'Add to calendar?' : 'Set reminder?'),
      content: Text('Navigator will open your system ${plan.tool.contains('Appointment') ? 'calendar' : 'reminders'} so you can confirm.\n\n${plan.instruction}'),
      actions: [
        TextButton(onPressed: ()=> Navigator.pop(context, false), child: Text('Cancel')),
        FilledButton(onPressed: ()=> Navigator.pop(context, true), child: Text('Open calendar')),
      ],
    ),
  ) ?? false;
  if (!confirmed) return;

  AutomationResult result;
  if (plan.tool == 'mobile_automation.setAppointment') {
    result = await automation.setAppointment(
      title: 'Mind Recipe — check-in',
      start: DateTime.now().add(Duration(days: 1, hours: 9)),
    );
  } else if (plan.tool == 'mobile_automation.setReminder') {
    result = await automation.setReminder(title: 'Mind Recipe — gentle nudge', dueDate: DateTime.now().add(Duration(hours: 2)));
  } else {
    result = await automation.setAlarm(hour: 8, minute: 0, label: 'Mind Recipe');
  }

  if (!mounted) return;
  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(result.message)));
  await automation.acknowledgeTurn(); // gentle haptic
}
```

### 3d. Wellbeing boundary
Keep the existing wellness disclaimers (`_WellnessBoundary` in `main.dart:815`). Automation is *scheduling only* — it does not diagnose, triage, or decide level of care (mirrors `BookingScreen:1042`).

---

## 4. Testing Without Native Plugin (Fallback Paths)

`mobile_automation.dart` is designed to degrade gracefully when the MethodChannel is not yet wired:

- `setAppointment` → falls back to `calshow:` / `content://com.android.calendar` / Google Calendar `https://calendar.google.com/calendar/render?action=TEMPLATE…` via `url_launcher`
- `setReminder` → falls back to `x-apple-reminderkit://` or Google Tasks
- `setAlarm` → Android returns `unavailable` with retry payload; iOS tries `shortcuts://run-shortcut?name=Create Alarm`

You can test the Dart layer in `flutter test` by injecting a fake channel + fake UrlLauncher:

```dart
test('setAppointment validation', () async {
  final fakeChannel = MethodChannel('contextfield.mindrecipe/mobile_automation');
  // use TestDefaultBinaryMessengerBinding to mock handler
  final auto = MindRecipeMobileAutomation(channel: fakeChannel, urlLauncher: FakeUrlLauncher());
  final r = await auto.setAppointment(title: '', start: DateTime.now());
  expect(r.success, isFalse);
  expect(r.nativeCode, 'validation');
});
```

---

## 5. Optional Tier 2 — Tethered Mobilerun Agent (Desktop)

Not bundled in APK; for QA / power automation on a connected device.

```bash
# From /tmp/mobilerun checkout
uv tool install mobilerun
mobilerun setup           # installs Portal APK, enables accessibility
mobilerun ping
mobilerun configure       # pick LLM provider (OpenAI/Gemini/Anthropic/etc.)
mobilerun run "Open Mind Recipe and tell me the Android version" --vision
mobilerun run "In Mind Recipe, go to Progress and report the streak" --reasoning --steps 30 --debug
mobilerun run "Take a screenshot" --ios   # iOS Portal flow

# Macro record/replay for regression
mobilerun macro record --out mind_recipe_flow.json
mobilerun macro replay mind_recipe_flow.json

# Python API
uv pip install mobilerun
python -c "from mobilerun.agent.droid import MobileAgent; ..."
```

Use this only on a **developer device**; do not ship the Portal/a11y overlay to production members.

---

## 6. Troubleshooting

| Symptom | Fix |
|---|---|
| `MissingPluginException` on `setAppointment` | Ensure `MindRecipeMobileAutomationPlugin` is added in `MainActivity.kt` and `AppDelegate.swift`, then `flutter clean && flutter pub get` |
| `PlatformException` or `intent not handled` | Check `<queries>` in `AndroidManifest.xml` (Android 11+ package visibility) |
| `canLaunchUrl` false for `shortcuts://` | Install Shortcuts app; add `LSApplicationQueriesSchemes` with `shortcuts` |
| EventKit `denied` | Member denied permission → fallback opens Calendar; prompt to enable in Settings > Privacy > Calendars |
| `flutter analyze` error `TimeOfDay` duplicate | Ensure `mobile_automation.dart` imports `package:flutter/material.dart` not custom `TimeOfDay` (fixed in v1) |

---

## 7. Commit & Push (Requires Explicit Approval)

This guide intentionally does **not** push to GitHub. When ready:

```bash
cd /tmp/mind-recipe
git status
git add flutter/lib/mobile_automation.dart mobile-automation/ flutter/android/app/src/main/kotlin/.../MindRecipeMobileAutomationPlugin.kt flutter/ios/Runner/MindRecipeMobileAutomationPlugin.swift
git commit -m "feat(mobile-automation): brand mobilerun intents for Mind Recipe — appointments/reminders/alarms via MethodChannel

- Dart API at flutter/lib/mobile_automation.dart (setAppointment/setReminder/setAlarm + wellness helpers)
- Android Kotlin plugin (ACTION_INSERT/AlarmClock) + iOS Swift plugin (EventKit + shortcuts fallback)
- Branded fork docs at mobile-automation/README.md + INTEGRATION_GUIDE.md
- Upstream mirror at /tmp/mobilerun (droidrun/mobilerun 0.6.17 MIT)

No WRITE_CALENDAR permission; member confirms in system sheet. No BGS push without approval."
# git push  ← requires explicit user approval per task §5
```

---

## 8. References

- Upstream: https://github.com/droidrun/mobilerun · `SKILL.md` · `docs/` · `pyproject.toml`
- This fork: `mobile-automation/README.md`
- Mind Recipe app: `flutter/lib/mind_recipe_device_harness.dart`, `flutter/lib/navigator_agent.dart:28`, `flutter/lib/notification_scheduler.dart`, `flutter/lib/main.dart:1028`
