import 'package:flutter/material.dart';

import 'mobile_automation.dart';

/// Mind Recipe's on-device version of phone-harness: free chat detects
/// phone-action intents ("remind me to…", "appointment with…", "wake me at…")
/// and offers a consent-gated action card. Nothing runs until the member
/// taps Allow, and everything executes locally through the
/// MindRecipeMobileAutomation MethodChannel (Calendar/Reminders/AlarmClock —
/// no accessibility scraping, no screen capture).
class PhoneAction {
  const PhoneAction({
    required this.type,
    required this.title,
    this.when,
    this.notes,
  });

  final PhoneActionType type;
  final String title;
  final DateTime? when;
  final String? notes;

  String get summaryLabel => switch (type) {
        PhoneActionType.reminder => 'Reminder',
        PhoneActionType.appointment => 'Calendar event',
        PhoneActionType.alarm => 'Alarm',
      };

  String get summary {
    final whenText = when == null ? '' : ' · ${formatActionTime(when!)}${_daySuffix(when!)}';
    return '$summaryLabel: $title$whenText';
  }

  String _daySuffix(DateTime dt) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final day = DateTime(dt.year, dt.month, dt.day);
    final diff = day.difference(today).inDays;
    if (diff == 0) return ' today';
    if (diff == 1) return ' tomorrow';
    return ' ${dt.month}/${dt.day}';
  }
}

enum PhoneActionType { reminder, appointment, alarm }

/// Compact clock format for action summaries ("3:05 PM").
String formatActionTime(DateTime dt) {
  final hour12 = dt.hour % 12 == 0 ? 12 : dt.hour % 12;
  final ampm = dt.hour < 12 ? 'AM' : 'PM';
  final minute = dt.minute.toString().padLeft(2, '0');
  return '$hour12:$minute $ampm';
}

class PhoneActionParser {
  const PhoneActionParser();

  static final _reminder = RegExp(
    r'remind (?:me )?(?:to )?(?<body>[^\.!?]+)',
    caseSensitive: false,
  );
  static final _appointment = RegExp(
    r'(?:(?:schedule|set up?|add|create|book)(?: an?)? |)(?:appointment|meeting|event|calendar event)(?: (?:with|for) )?(?<body>[^\.!?]+)',
    caseSensitive: false,
  );
  static final _alarm = RegExp(
    r'(?:(?:set )?an? )?(?:alarm|wake me(?: up)?)\s*(?:for|at)?\s*(?<body>[^\.!?]*)',
    caseSensitive: false,
  );

  /// Cuts time context ("at 5pm", "tomorrow at 2", "in 20 minutes") out of a
  /// title. If the time phrase starts the body, the words after it become the
  /// title ("in 20 minutes to stretch" → "Stretch").
  static final _whenCut = RegExp(
    r'(?:^|\s)(?:in\s+\d+\s+(?:minutes?|mins?|hours?|hrs?)|at\s+\d|by\s+\d|at\s+(?:noon|midnight)|on\s+(?:mon|tues|weds|thurs|fri|sat|sun)|tomorrow|tonight|today|monday|tuesday|wednesday|thursday|friday|saturday|sunday)',
    caseSensitive: false,
  );

  String _titleFrom(String body) {
    final m = _whenCut.firstMatch(body);
    if (m == null) return _tidy(body);
    final before = body.substring(0, m.start).trim();
    if (before.isNotEmpty) return _tidy(before);
    final after = body
        .substring(m.end)
        .trim()
        .replaceFirst(RegExp(r'^(?:to|that|about)\s+', caseSensitive: false), '');
    return _tidy(after);
  }

  String _tidy(String value) {
    final t = value
        .replaceAll(RegExp(r'\s+'), ' ')
        .trim()
        .replaceAll(RegExp(r'\s+$'), '');
    if (t.isEmpty) return t;
    return t[0].toUpperCase() + t.substring(1);
  }

  /// Returns the first actionable phone intent in [message], or null.
  PhoneAction? parse(String message) {
    // Keep honorifics from terminating title capture ("Dr. Lee" → "Dr Lee").
    final text = message.replaceAllMapped(
      RegExp(r'\b(Dr|Mr|Mrs|Ms|St)\.', caseSensitive: false),
      (m) => m.group(1)!,
    );
    final preferMorning = RegExp(r'wake|get up', caseSensitive: false).hasMatch(text);
    final alarm = _alarm.firstMatch(text);
    if (alarm != null) {
      final body = (alarm.namedGroup('body') ?? '').trim();
      final when = parseWhen(body, preferMorning: preferMorning) ??
          parseWhen(text, preferMorning: preferMorning);
      if (when != null) {
        var label = body
            .replaceFirst(RegExp(r'\b(at|for|tomorrow|tonight|today)\b', caseSensitive: false), '')
            .trim();
        final timeMatch = RegExp(
          r'\d{1,2}(:\d{2})?\s*(am|pm)?|\bin\s+\d+\s+(minutes?|mins?|hours?|hrs?)\b',
          caseSensitive: false,
        ).firstMatch(label);
        if (timeMatch != null) label = label.replaceRange(timeMatch.start, timeMatch.end, '');
        label = label.replaceAll(RegExp(r'\s+'), ' ').trim();
        return PhoneAction(
          type: PhoneActionType.alarm,
          title: label.isEmpty ? 'Mind Recipe alarm' : label,
          when: when,
        );
      }
    }

    final reminder = _reminder.firstMatch(text);
    if (reminder != null) {
      final body = (reminder.namedGroup('body') ?? '').trim();
      if (body.isNotEmpty) {
        final when = parseWhen(body, preferMorning: preferMorning) ??
            parseWhen(message, preferMorning: preferMorning);
        final title = _titleFrom(body);
        if (title.isNotEmpty) {
          return PhoneAction(
            type: PhoneActionType.reminder,
            title: title,
            when: when,
          );
        }
      }
    }

    final appointment = _appointment.firstMatch(text);
    if (appointment != null) {
      final body = (appointment.namedGroup('body') ?? '').trim();
      if (body.isNotEmpty) {
        final when = parseWhen(body, preferMorning: preferMorning) ??
            parseWhen(message, preferMorning: preferMorning);
        var title = _titleFrom(
          body.replaceFirst(
            RegExp(r'^(?:with|for)\s+', caseSensitive: false),
            '',
          ),
        );
        title = title.replaceFirst(RegExp(r'^\d+\s*'), '');
        if (title.isEmpty) title = 'Appointment';
        return PhoneAction(
          type: PhoneActionType.appointment,
          title: title,
          when: when ?? DateTime.now().add(const Duration(hours: 1)),
          notes: 'Created from a Mind Recipe conversation.',
        );
      }
    }
    return null;
  }

  /// Parses common relative and clock times: "in 20 minutes", "at 3pm",
  /// "at 15:30", "tomorrow at 9", "tonight". [preferMorning] resolves bare
  /// hours 1–7 to AM (wake-me alarms) instead of the default PM.
  DateTime? parseWhen(String input, {bool preferMorning = false}) {
    final text = input.toLowerCase();
    final now = DateTime.now();

    final relative = RegExp(r'in\s+(\d+)\s+(minutes?|mins?|hours?|hrs?)').firstMatch(text);
    if (relative != null) {
      final n = int.parse(relative.group(1)!);
      final unit = relative.group(2)!;
      return now.add(
        Duration(minutes: unit.startsWith('m') ? n : n * 60),
      );
    }

    var day = DateTime(now.year, now.month, now.day);
    if (text.contains('tomorrow')) {
      day = day.add(const Duration(days: 1));
    }

    final clock = RegExp(r'(?:at\s+)?\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b').firstMatch(text);
    if (clock != null) {
      var hour = int.parse(clock.group(1)!);
      final minute = clock.group(2) != null ? int.parse(clock.group(2)!) : 0;
      final meridiem = clock.group(3)!;
      if (meridiem == 'pm' && hour < 12) hour += 12;
      if (meridiem == 'am' && hour == 12) hour = 0;
      return DateTime(day.year, day.month, day.day, hour, minute);
    }

    final military = RegExp(r'\bat\s+(\d{1,2}):(\d{2})\b').firstMatch(text);
    if (military != null) {
      final hour = int.parse(military.group(1)!);
      final minute = int.parse(military.group(2)!);
      if (hour <= 23 && minute <= 59) {
        return DateTime(day.year, day.month, day.day, hour, minute);
      }
    }

    final bareHour = RegExp(r'\bat\s+(\d{1,2})\b(?!:\d)').firstMatch(text);
    if (bareHour != null) {
      var hour = int.parse(bareHour.group(1)!);
      if (hour >= 0 && hour <= 23) {
        if (!preferMorning && hour >= 1 && hour <= 7) {
          hour += 12; // "at 6" in the evening
        }
        return DateTime(day.year, day.month, day.day, hour, 0);
      }
    }

    if (text.contains('tonight')) {
      return DateTime(day.year, day.month, day.day, 20, 0);
    }
    return null;
  }
}

/// Executes a consented [PhoneAction] on device.
Future<AutomationResult> executePhoneAction(PhoneAction action) async {
  final auto = MindRecipeMobileAutomation();
  return switch (action.type) {
    PhoneActionType.reminder => auto.setReminder(
        title: action.title,
        dueDate: action.when,
        notes: action.notes ?? 'Added from Mind Recipe Navigator.',
      ),
    PhoneActionType.appointment => auto.setAppointment(
        title: action.title,
        start: action.when ?? DateTime.now().add(const Duration(hours: 1)),
        description: action.notes ?? 'Added from Mind Recipe Navigator.',
      ),
    PhoneActionType.alarm => auto.setAlarm(
        hour: (action.when ?? DateTime.now().add(const Duration(hours: 8))).hour,
        minute: (action.when ?? DateTime.now().add(const Duration(hours: 8))).minute,
        label: action.title,
      ),
  };
}
