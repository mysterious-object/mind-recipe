// ignore_for_file: dangling_library_doc_comments, empty_catches
// Mind Recipe Mobile Automation — branded phone control layer
//
// Branded from https://github.com/droidrun/mobilerun (MIT, 0.6.17) but
// implemented as lightweight OS-intent automation for the shipping APK.
///
/// Tier 1 (shipped): Android Intent.ACTION_INSERT / AlarmClock + iOS
/// EventKit / shortcuts:// via MethodChannel `contextfield.mindrecipe/mobile_automation`.
///   No WRITE_CALENDAR permission required for INSERT; user confirms in system UI.
///   No accessibility service — every mutation requires member tap.
///
/// Tier 2 (not bundled): full mobilerun Python agent at /tmp/mobilerun for
///   tethered desktop automation: `mobilerun run "…"` with vision/reasoning.
///
/// Usage:
/// ```dart
/// import 'mobile_automation.dart';
/// final auto = MindRecipeMobileAutomation();
/// final r = await auto.setAppointment(
///   title: 'Therapy — Mind Recipe follow-up',
///   start: DateTime(2026, 8, 25, 10, 30),
///   end: DateTime(2026, 8, 25, 11, 30),
///   location: 'Clinic / Video',
///   description: 'From Navigator suggestion',
///   alarmMinutesBefore: 30,
/// );
/// if (!r.success) ScaffoldMessenger.showSnackBar(SnackBar(content: Text(r.message)));
/// ```
///
/// See /tmp/mind-recipe/mobile-automation/README.md for full spec + native snippets.
/// See flutter/lib/navigator_agent.dart for routing integration.

import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart' as launcher;

/// Human-readable result — never throws, always returns this.
class AutomationResult {
  const AutomationResult({
    required this.success,
    required this.message,
    this.nativeCode,
    this.debugPayload,
  });

  final bool success;
  final String message;
  final String? nativeCode;
  final Map<String, dynamic>? debugPayload;

  bool get isFallback => nativeCode == 'fallback_url' || nativeCode == 'fallback_clipboard';
  bool get isUnavailable => nativeCode == 'unavailable';

  Map<String, dynamic> toMap() => {
        'success': success,
        'message': message,
        if (nativeCode != null) 'nativeCode': nativeCode,
        if (debugPayload != null) 'debugPayload': debugPayload,
      };

  @override
  String toString() => 'AutomationResult(success:$success, code:$nativeCode, message:$message)';
}

/// What the device can do (probed from native or inferred).
class AutomationCapabilities {
  const AutomationCapabilities({
    required this.platform,
    required this.canInsertCalendarEvent,
    required this.canSetAlarm,
    required this.canAddReminder,
    required this.canOpenCalendar,
    required this.canInvokeShortcuts,
    this.details,
  });

  final String platform; // android | ios | unknown
  final bool canInsertCalendarEvent;
  final bool canSetAlarm;
  final bool canAddReminder;
  final bool canOpenCalendar;
  final bool canInvokeShortcuts;
  final Map<String, dynamic>? details;

  factory AutomationCapabilities.fromMap(Map<Object?, Object?> map) {
    String platform = map['platform']?.toString() ?? _inferPlatform();
    return AutomationCapabilities(
      platform: platform,
      canInsertCalendarEvent: map['canInsertCalendarEvent'] == true || platform == 'android' || platform == 'ios',
      canSetAlarm: map['canSetAlarm'] == true || platform == 'android',
      canAddReminder: map['canAddReminder'] == true || platform == 'ios' || platform == 'android',
      canOpenCalendar: map['canOpenCalendar'] == true || true,
      canInvokeShortcuts: map['canInvokeShortcuts'] == true || platform == 'ios',
      details: map['details'] is Map ? (map['details'] as Map).cast<String, dynamic>() : null,
    );
  }

  static String _inferPlatform() {
    if (defaultTargetPlatform == TargetPlatform.android) return 'android';
    if (defaultTargetPlatform == TargetPlatform.iOS) return 'ios';
    return 'unknown';
  }
}

/// Optional alarm/reminder recurrence helper
class AutomationRecurrence {
  const AutomationRecurrence({this.daysOfWeek, this.intervalDays});
  // 1=Mon..7=Sun (Android AlarmClock.EXTRA_DAYS uses Calendar.MONDAY=2..SUNDAY=1; we normalize in native)
  final List<int>? daysOfWeek;
  final int? intervalDays;
}

/// Mind Recipe Mobile Automation — the Navigator-callable surface.
///
/// Every `set*` method is **member-confirmed**: native side launches the
/// system insert sheet; the member taps Save. No silent background writes
/// unless you later add WRITE_CALENDAR / EventKit full-access behind a toggle.
class MindRecipeMobileAutomation {
  MindRecipeMobileAutomation({MethodChannel? channel, UrlLauncher? urlLauncher})
      : _channel = channel ?? const MethodChannel(_channelName),
        _urlLauncher = urlLauncher ?? const _DefaultUrlLauncher();

  static const _channelName = 'contextfield.mindrecipe/mobile_automation';
  final MethodChannel _channel;
  final UrlLauncher _urlLauncher;

  // ---------------------------------------------------------------------------
  // Calendar / appointments — primary request: "set appointments"
  // ---------------------------------------------------------------------------

  /// Create a calendar appointment/event.
  ///
  /// On Android: `Intent.ACTION_INSERT` with `CalendarContract.Events.CONTENT_URI`
  /// + `EXTRA_EVENT_BEGIN_TIME/END_TIME` (no permission, user confirms).
  /// On iOS: `EventKit` if authorized else `calshow:` / `shortcuts://` fallback.
  Future<AutomationResult> setAppointment({
    required String title,
    required DateTime start,
    DateTime? end,
    String? description,
    String? location,
    String? timezone, // IANA e.g. "America/Los_Angeles" — passed to native when available
    int? alarmMinutesBefore, // 0 = at time, 15/30/60 etc.
    List<String>? attendees, // email addresses — for INSERT uses EXTRA_EMAIL
    bool allDay = false,
    String? calendarId, // optional; native may ignore for INSERT
  }) async {
    final safeTitle = title.trim();
    if (safeTitle.isEmpty) {
      return const AutomationResult(success: false, message: 'Add a title for the appointment.', nativeCode: 'validation');
    }
    if (end != null && !end.isAfter(start)) {
      return const AutomationResult(success: false, message: 'End time must be after start time.', nativeCode: 'validation');
    }
    final resolvedEnd = end ?? start.add(const Duration(hours: 1));
    final payload = <String, dynamic>{
      'title': safeTitle,
      'description': description?.trim(),
      'location': location?.trim(),
      'beginMillis': start.millisecondsSinceEpoch,
      'endMillis': resolvedEnd.millisecondsSinceEpoch,
      'allDay': allDay,
      if (timezone != null) 'timezone': timezone,
      if (alarmMinutesBefore != null) 'alarmMinutesBefore': alarmMinutesBefore,
      if (attendees != null && attendees.isNotEmpty) 'attendees': attendees,
      if (calendarId != null) 'calendarId': calendarId,
    };

    try {
      final result = await _channel.invokeMapMethod<Object?, Object?>('setAppointment', payload);
      if (result != null) return _fromNativeMap(result, debugFallback: payload);
    } on MissingPluginException {
      // Plugin not yet wired — fall back to URL scheme so developer still sees behavior
    } on PlatformException catch (e) {
      debugPrint('[MobileAutomation] setAppointment PlatformException: $e');
      return AutomationResult(success: false, message: 'Could not open calendar: ${e.message ?? e.code}', nativeCode: 'platform_error', debugPayload: payload);
    }

    // Fallback: try a URL scheme that at least opens the calendar app
    return _fallbackOpenCalendar(start: start, payload: payload, reason: 'native unavailable — opened calendar instead');
  }

  /// Alias for setAppointment — matches common LLM phrasing.
  Future<AutomationResult> createCalendarEvent({
    required String title,
    required DateTime start,
    DateTime? end,
    String? description,
    String? location,
    int? alarmMinutesBefore,
    List<String>? attendees,
    bool allDay = false,
  }) =>
      setAppointment(
        title: title,
        start: start,
        end: end,
        description: description,
        location: location,
        alarmMinutesBefore: alarmMinutesBefore,
        attendees: attendees,
        allDay: allDay,
      );

  Future<AutomationResult> openCalendar({DateTime? date}) async {
    try {
      final r = await _channel.invokeMapMethod<Object?, Object?>('openCalendar', {
        if (date != null) 'epochMillis': date.millisecondsSinceEpoch,
      });
      if (r != null) return _fromNativeMap(r);
    } on MissingPluginException {
    } on PlatformException catch (e) {
      return AutomationResult(success: false, message: 'Could not open calendar: ${e.message}', nativeCode: 'platform_error');
    }
    return _fallbackOpenCalendar(start: date ?? DateTime.now(), payload: {}, reason: 'opened calendar via fallback');
  }

  // ---------------------------------------------------------------------------
  // Reminders — "set reminders"
  // ---------------------------------------------------------------------------

  /// Create a reminder / task.
  ///
  /// Android: calendar reminder or AlarmClock fallback; iOS: EKReminder or
  /// `shortcuts://run-shortcut?name=AddReminder` fallback.
  Future<AutomationResult> setReminder({
    required String title,
    DateTime? dueDate,
    String? notes,
    int? alarmMinutesBefore,
    String? listName, // iOS reminder list
    bool? isFlagged,
  }) async {
    final safeTitle = title.trim();
    if (safeTitle.isEmpty) {
      return const AutomationResult(success: false, message: 'Add a title for the reminder.', nativeCode: 'validation');
    }
    final payload = <String, dynamic>{
      'title': safeTitle,
      if (dueDate != null) 'dueMillis': dueDate.millisecondsSinceEpoch,
      if (notes != null) 'notes': notes.trim(),
      if (alarmMinutesBefore != null) 'alarmMinutesBefore': alarmMinutesBefore,
      if (listName != null) 'listName': listName,
      if (isFlagged != null) 'isFlagged': isFlagged,
    };
    try {
      final r = await _channel.invokeMapMethod<Object?, Object?>('setReminder', payload);
      if (r != null) return _fromNativeMap(r, debugFallback: payload);
    } on MissingPluginException {
    } on PlatformException catch (e) {
      return AutomationResult(success: false, message: 'Could not create reminder: ${e.message}', nativeCode: 'platform_error', debugPayload: payload);
    }
    // Fallback: open reminders app via URL scheme if possible
    return _fallbackOpenReminders(payload: payload);
  }

  Future<AutomationResult> openReminders() async {
    try {
      final r = await _channel.invokeMapMethod<Object?, Object?>('openReminders', {});
      if (r != null) return _fromNativeMap(r);
    } on MissingPluginException {
    } on PlatformException catch (e) {
      return AutomationResult(success: false, message: 'Could not open reminders: ${e.message}', nativeCode: 'platform_error');
    }
    return _fallbackOpenReminders(payload: {});
  }

  // ---------------------------------------------------------------------------
  // Alarms — "set alarm / wake-up nudge"
  // ---------------------------------------------------------------------------

  /// Set a system alarm.
  ///
  /// Android: `AlarmClock.ACTION_SET_ALARM` with `EXTRA_HOUR/MINUTES/MESSAGE/DAYS/SKIP_UI`.
  /// iOS: no public alarm API — routes to Shortcuts `Create Alarm` or shows instruction.
  Future<AutomationResult> setAlarm({
    required int hour, // 0-23
    required int minute, // 0-59
    String? label,
    List<int>? daysOfWeek, // 1=Mon..7=Sun
    bool skipUi = false, // if true, native tries to set without showing UI (Android only, needs user opt-in)
    bool vibrate = true,
  }) async {
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      return const AutomationResult(success: false, message: 'Hour must be 0-23 and minute 0-59.', nativeCode: 'validation');
    }
    final payload = <String, dynamic>{
      'hour': hour,
      'minute': minute,
      if (label != null) 'label': label.trim(),
      if (daysOfWeek != null && daysOfWeek.isNotEmpty) 'daysOfWeek': daysOfWeek,
      'skipUi': skipUi,
      'vibrate': vibrate,
    };
    try {
      final r = await _channel.invokeMapMethod<Object?, Object?>('setAlarm', payload);
      if (r != null) return _fromNativeMap(r, debugFallback: payload);
    } on MissingPluginException {
    } on PlatformException catch (e) {
      return AutomationResult(success: false, message: 'Could not set alarm: ${e.message}', nativeCode: 'platform_error', debugPayload: payload);
    }
    if (defaultTargetPlatform == TargetPlatform.android) {
      // Last resort fallback for Android without plugin: try to fire intent via url_launcher? No direct URL, so return guidance.
      return AutomationResult(
        success: false,
        message: 'Alarm plugin not yet wired. Wire MindRecipeMobileAutomationPlugin.kt, then retry.',
        nativeCode: 'unavailable',
        debugPayload: payload,
      );
    } else {
      // iOS: try shortcuts:// fallback through url_launcher
      return _fallbackIosAlarm(label: label, payload: payload);
    }
  }

  // ---------------------------------------------------------------------------
  // Wellness-specific helpers — sugar over the primitives, used by Navigator
  // ---------------------------------------------------------------------------

  /// Schedule a gentle wellness reminder derived from a saved practice.
  ///
  /// Wraps `setReminder` with Mind Recipe voice defaults and quiet-hours awareness.
  /// Caller should check `NotificationScheduler` quiet hours if mixing with in-app reminders.
  Future<AutomationResult> scheduleWellnessReminder({
    required String practiceName,
    required DateTime time,
    String? messageStyle, // discreet | gentle | encouraging | minimal (from NotificationScheduler)
    String? notes,
    int alarmMinutesBefore = 10,
  }) {
    final styleSuffix = messageStyle == null ? '' : ' · $messageStyle';
    return setReminder(
      title: practiceName.trim().isEmpty ? 'Mind Recipe — gentle check-in' : practiceName.trim(),
      dueDate: time,
      notes: notes ?? 'From Mind Recipe Navigator$styleSuffix',
      alarmMinutesBefore: alarmMinutesBefore,
    );
  }

  /// Mirror NotificationScheduler's daily navigation reminder as an OS reminder/alarm
  /// so it fires even if the app is killed.
  /// `time` is Flutter's material TimeOfDay (hour 0-23, minute 0-59).
  Future<AutomationResult> scheduleDailyNavigationReminder({
    required TimeOfDay time,
    Set<int>? weekdays, // 1=Mon..7=Sun; null = daily
  }) {
    // Map to alarm: daily navigation at fixed clock time
    final days = weekdays?.toList();
    return setAlarm(
      hour: time.hour,
      minute: time.minute,
      label: 'Mind Recipe — daily navigation',
      daysOfWeek: days,
      skipUi: false,
    );
  }

  /// Generic shortcut / automation invocation (escape hatch).
  ///
  /// Android: fires an implicit intent with action `name` or broadcasts to `com.contextfield.mindrecipe.SHORTCUT`.
  /// iOS: opens `shortcuts://run-shortcut?name=<name>&input=<input>` (requires Shortcuts app).
  Future<AutomationResult> invokeShortcut({required String name, Map<String, dynamic>? input}) async {
    final trimmed = name.trim();
    if (trimmed.isEmpty) return const AutomationResult(success: false, message: 'Shortcut name is required.', nativeCode: 'validation');
    final payload = <String, dynamic>{'name': trimmed, if (input != null) 'input': input};
    try {
      final r = await _channel.invokeMapMethod<Object?, Object?>('invokeShortcut', payload);
      if (r != null) return _fromNativeMap(r, debugFallback: payload);
    } on MissingPluginException {
    } on PlatformException catch (e) {
      return AutomationResult(success: false, message: 'Could not invoke shortcut: ${e.message}', nativeCode: 'platform_error', debugPayload: payload);
    }
    // Fallback: try shortcuts:// URL directly via url_launcher
    if (defaultTargetPlatform == TargetPlatform.iOS) {
      final encoded = Uri.encodeComponent(trimmed);
      final url = Uri.parse('shortcuts://run-shortcut?name=$encoded');
      if (await _urlLauncher.canLaunchUrl(url)) {
        final ok = await _urlLauncher.launchUrl(url);
        return AutomationResult(success: ok, message: ok ? 'Opened Shortcut "$trimmed" in Shortcuts app.' : 'Could not open Shortcuts app.', nativeCode: ok ? 'fallback_url' : 'unavailable', debugPayload: payload);
      }
    }
    return AutomationResult(success: false, message: 'Shortcut "$trimmed" is not available on this device.', nativeCode: 'unavailable', debugPayload: payload);
  }

  Future<AutomationCapabilities> capabilities() async {
    try {
      final r = await _channel.invokeMapMethod<Object?, Object?>('capabilities', {});
      if (r != null) return AutomationCapabilities.fromMap(r);
    } on MissingPluginException {
    } on PlatformException {
    }
    // Fallback: infer from platform
    return AutomationCapabilities.fromMap(const {});
  }

  /// Delegate to existing harness haptics (MindRecipeDeviceHarness.acknowledgeTurn)
  Future<void> acknowledgeTurn() async {
    try {
      await const MethodChannel('contextfield.mindrecipe/device_harness').invokeMethod<void>('acknowledgeTurn');
    } on MissingPluginException {
    } on PlatformException {
    }
  }

  // ---------------------------------------------------------------------------
  // Internals
  // ---------------------------------------------------------------------------

  AutomationResult _fromNativeMap(Map<Object?, Object?> map, {Map<String, dynamic>? debugFallback}) {
    final rawSuccess = map['success'];
    final success = rawSuccess == true || rawSuccess == 1 || rawSuccess?.toString() == 'true';
    final code = map['code']?.toString() ?? map['nativeCode']?.toString();
    final msg = map['message']?.toString() ?? map['msg']?.toString() ?? (success ? 'Done.' : 'Not completed.');
    final details = map['debugPayload'] ?? map['payload'];
    Map<String, dynamic>? debugMap;
    if (details is Map) debugMap = details.cast<String, dynamic>();
    debugMap ??= debugFallback;
    return AutomationResult(success: success, message: msg, nativeCode: code, debugPayload: debugMap);
  }

  Future<AutomationResult> _fallbackOpenCalendar({required DateTime start, required Map<String, dynamic> payload, required String reason}) async {
    // Try platform calendar URL schemes; these open the calendar app without adding an event.
    // For a real event insert without the plugin, there's no reliable cross-platform URL — we guide the user.
    final urls = <Uri>[
      if (defaultTargetPlatform == TargetPlatform.android) Uri.parse('content://com.android.calendar/time/${start.millisecondsSinceEpoch}'),
      if (defaultTargetPlatform == TargetPlatform.iOS) Uri.parse('calshow:${start.millisecondsSinceEpoch ~/ 1000}'),
      Uri.parse('https://calendar.google.com/calendar/render?action=TEMPLATE&text=${Uri.encodeComponent(payload['title']?.toString() ?? 'Mind Recipe')}'),
    ];
    for (final u in urls) {
      try {
        if (await _urlLauncher.canLaunchUrl(u)) {
          final ok = await _urlLauncher.launchUrl(u, mode: launcher.LaunchMode.externalApplication);
          if (ok) {
            return AutomationResult(
              success: true,
              message: '$reason — opened calendar so you can add it manually.',
              nativeCode: 'fallback_url',
              debugPayload: {...payload, 'fallbackUrl': u.toString()},
            );
          }
        }
      } catch (_) {}
    }
    return AutomationResult(
      success: false,
      message: 'Calendar plugin not yet wired. Add MindRecipeMobileAutomationPlugin.kt/.swift, then retry. Payload was kept for retry.',
      nativeCode: 'unavailable',
      debugPayload: payload,
    );
  }

  Future<AutomationResult> _fallbackOpenReminders({required Map<String, dynamic> payload}) async {
    final urls = <Uri>[
      if (defaultTargetPlatform == TargetPlatform.iOS) Uri.parse('x-apple-reminderkit://'),
      Uri.parse('https://calendar.google.com/calendar/r?tab=rc'), // Google Tasks fallback
    ];
    for (final u in urls) {
      try {
        if (await _urlLauncher.canLaunchUrl(u) && await _urlLauncher.launchUrl(u, mode: launcher.LaunchMode.externalApplication)) {
          return AutomationResult(success: true, message: 'Opened reminders so you can add it manually.', nativeCode: 'fallback_url', debugPayload: {...payload, 'fallbackUrl': u.toString()});
        }
      } catch (_) {}
    }
    return AutomationResult(success: false, message: 'Reminders plugin not yet wired. Wire native plugin, then retry.', nativeCode: 'unavailable', debugPayload: payload);
  }

  Future<AutomationResult> _fallbackIosAlarm({String? label, required Map<String, dynamic> payload}) async {
    // iOS has no public alarm intent. Best effort is Shortcuts `Create Alarm`.
    final name = Uri.encodeComponent('Create Alarm');
    final shortcutsUrl = Uri.parse('shortcuts://run-shortcut?name=$name');
    try {
      if (await _urlLauncher.canLaunchUrl(shortcutsUrl) && await _urlLauncher.launchUrl(shortcutsUrl)) {
        return AutomationResult(success: true, message: 'Opened Shortcuts to create an alarm${label == null ? '' : ' for "$label"'} — confirm there.', nativeCode: 'fallback_url', debugPayload: payload);
      }
    } catch (_) {}
    // Fallback to clock URL scheme (undocumented, may not resolve)
    final clockUrl = Uri.parse('clock-alarm://');
    try {
      if (await _urlLauncher.canLaunchUrl(clockUrl) && await _urlLauncher.launchUrl(clockUrl)) {
        return AutomationResult(success: true, message: 'Opened Clock so you can set the alarm manually.', nativeCode: 'fallback_url', debugPayload: payload);
      }
    } catch (_) {}
    return AutomationResult(
      success: false,
      message: 'iOS cannot set alarms silently. Add a Shortcuts automation named "Create Alarm" or set it in Clock.',
      nativeCode: 'unavailable',
      debugPayload: payload,
    );
  }
}

// ---------------------------------------------------------------------------
// Seam for tests: wrap url_launcher so unit tests don't need platform channels
// ---------------------------------------------------------------------------

abstract class UrlLauncher {
  Future<bool> canLaunchUrl(Uri url);
  Future<bool> launchUrl(Uri url, {launcher.LaunchMode mode = launcher.LaunchMode.platformDefault});
}

class _DefaultUrlLauncher implements UrlLauncher {
  const _DefaultUrlLauncher();
  @override
  Future<bool> canLaunchUrl(Uri url) => launcher.canLaunchUrl(url);
  @override
  Future<bool> launchUrl(Uri url, {launcher.LaunchMode mode = launcher.LaunchMode.platformDefault}) =>
      launcher.launchUrl(url, mode: mode);
}
