import 'mobile_automation.dart';

enum PhoneActionType { reminder, appointment, alarm }

/// A draft, never an instruction to execute. Missing fields need review.
class PhoneAction {
  const PhoneAction({
    required this.type,
    required this.title,
    this.when,
    this.end,
    this.notes,
  });
  final PhoneActionType type;
  final String title;
  final DateTime? when;
  final DateTime? end;
  final String? notes;

  String get summaryLabel => switch (type) {
    PhoneActionType.reminder => 'Reminder',
    PhoneActionType.appointment => 'Calendar event',
    PhoneActionType.alarm => 'Alarm',
  };
  String get summary =>
      '$summaryLabel: $title'
      '${when == null ? ' · choose a date and time' : ' · ${formatActionTime(when!)}'}';

  String? validationError(DateTime now) {
    if (!RegExp(r'[\p{L}\p{N}\p{S}]', unicode: true).hasMatch(title)) {
      return 'Add a title.';
    }
    if (when == null) return 'Choose a date and time.';
    if (!when!.isAfter(now)) return 'Choose a future date and time.';
    if (type == PhoneActionType.appointment) {
      if (end == null) return 'Choose when the event ends.';
      if (!end!.isAfter(when!)) return 'The end must be after the start.';
    }
    // Clock intents do not carry an arbitrary future date. Never silently
    // turn next week's alarm into tomorrow morning's alarm.
    if (type == PhoneActionType.alarm) {
      var next = DateTime(
        now.year,
        now.month,
        now.day,
        when!.hour,
        when!.minute,
      );
      if (!next.isAfter(now))
        next = DateTime(
          now.year,
          now.month,
          now.day + 1,
          when!.hour,
          when!.minute,
        );
      if (!when!.isAtSameMomentAs(next))
        return 'Clock supports the next occurrence of this time. Choose today or tomorrow.';
    }
    return null;
  }
}

String formatActionTime(DateTime dt) {
  final hour = dt.hour % 12 == 0 ? 12 : dt.hour % 12;
  return '${dt.year}-${dt.month.toString().padLeft(2, '0')}-'
      '${dt.day.toString().padLeft(2, '0')} '
      '$hour:${dt.minute.toString().padLeft(2, '0')} '
      '${dt.hour < 12 ? 'AM' : 'PM'} ${dt.timeZoneName}';
}

class PhoneActionParser {
  const PhoneActionParser({this.now});
  final DateTime Function()? now;

  /// Update a draft only for an explicit, narrow correction. This never
  /// confirms or executes it, and unrelated conversation remains conversation.
  PhoneAction? revise(PhoneAction draft, String message) {
    final text = message.trim();
    final title = RegExp(
      r'^(?:call it|title it|rename it to)\s+(.+)$',
      caseSensitive: false,
    ).firstMatch(text);
    final timeOnly = RegExp(
      r'^(?:(?:make (?:it|that)|change (?:it|that) to)\s+)?(?:(?:today|tomorrow|on (?:monday|tuesday|wednesday|thursday|friday|saturday|sunday))\s+)?(?:at \d{1,2}(?::\d{2})?\s*(?:am|pm)?|in \d+ (?:minutes?|mins?|hours?|hrs?))(?:\s+for \d+ (?:minutes?|hours?))?[.!]?$|^for \d+ (?:minutes?|hours?)[.!]?$',
      caseSensitive: false,
    ).hasMatch(text);
    if (title == null && !timeOnly) return null;
    final nextTime = title == null ? parseWhen(text) : null;
    final duration = RegExp(
      r'\bfor (\d+) (minutes?|hours?)\b',
      caseSensitive: false,
    ).firstMatch(text);
    final start = nextTime ?? draft.when;
    final oldDuration = draft.end != null && draft.when != null
        ? draft.end!.difference(draft.when!)
        : null;
    final minutes = duration == null
        ? null
        : int.parse(duration.group(1)!) *
              (duration.group(2)!.toLowerCase().startsWith('hour') ? 60 : 1);
    final length = minutes == null
        ? oldDuration
        : minutes > 0 && minutes <= 1440
        ? Duration(minutes: minutes)
        : null;
    // Invalid time corrections must not silently keep the previously valid
    // time. The review will require a new selection.
    final invalidTime =
        timeOnly && nextTime == null && !text.toLowerCase().startsWith('for ');
    return PhoneAction(
      type: draft.type,
      title: title?.group(1)?.trim() ?? draft.title,
      when: invalidTime ? null : start,
      end: invalidTime || start == null || length == null
          ? null
          : start.add(length),
      notes: draft.notes,
    );
  }

  PhoneAction? parse(String message) {
    var text = message.trim();
    if (RegExp(
      r'''["“”]|\b(don['’]t|do not|never|if|pretend|example)\b''',
      caseSensitive: false,
    ).hasMatch(text))
      return null;
    text = text.replaceFirst(
      RegExp(
        r'^(?:(?:can|could|would) you\s+)?(?:please\s+)?',
        caseSensitive: false,
      ),
      '',
    );
    final reminder = RegExp(
      r'^(?:remind me (?:to\s+)?|(?:create|add|set) (?:an? )?(?:task|reminder)(?: to)?\s+)(.+)$',
      caseSensitive: false,
    ).firstMatch(text);
    final appointment = RegExp(
      r'^(?:schedule|set up|add|create) (?:an? |the )?(?:calendar (?:appointment|event)|appointment|meeting|event)\b\s*(.*)$',
      caseSensitive: false,
    ).firstMatch(text);
    final alarm = RegExp(
      r'^(?:set (?:an? )?alarm|wake me(?: up)?)\b\s*(.*)$',
      caseSensitive: false,
    ).firstMatch(text);
    final match = reminder ?? appointment ?? alarm;
    if (match == null) return null;
    final type = reminder != null
        ? PhoneActionType.reminder
        : appointment != null
        ? PhoneActionType.appointment
        : PhoneActionType.alarm;
    final body = match.group(1)!.trim();
    final when = parseWhen(body);
    var title = body.replaceFirst(
      RegExp(r'^(?:with|for|titled|called|named)\s+', caseSensitive: false),
      '',
    );
    title = title
        .replaceAll(
          RegExp(
            r'\b(?:in \d+ (?:minutes?|mins?|hours?|hrs?)|at \d{1,2}(?::\d{2})?\s*(?:am|pm)?|tomorrow|today|on (?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)|for \d+ (?:minutes?|hours?))\b',
            caseSensitive: false,
          ),
          '',
        )
        .replaceAll(RegExp(r'\s+'), ' ')
        .trim();
    // Time-only requests must not leave sentence punctuation as the title.
    title = title.replaceAll(RegExp(r'^[\s.,;:!?]+|[\s.,;:!?]+$'), '');
    if (type == PhoneActionType.alarm &&
        (title.isEmpty || RegExp(r'^\d').hasMatch(title)))
      title = 'MindRecipe alarm';
    DateTime? end;
    final duration = RegExp(
      r'\bfor (\d+) (minutes?|hours?)\b',
      caseSensitive: false,
    ).firstMatch(body);
    if (duration != null && when != null) {
      final minutes =
          int.parse(duration.group(1)!) *
          (duration.group(2)!.toLowerCase().startsWith('hour') ? 60 : 1);
      if (minutes > 0 && minutes <= 1440)
        end = when.add(Duration(minutes: minutes));
    }
    return PhoneAction(type: type, title: title, when: when, end: end);
  }

  DateTime? parseWhen(String input, {bool preferMorning = false}) {
    final text = input.toLowerCase();
    final instant = now?.call() ?? DateTime.now();
    // Unsupported/recurring dates need explicit review; never guess a day.
    if (RegExp(
      r'\b(every|weekly|monthly|next|tonight|january|february|march|april|may|june|july|august|september|october|november|december)\b|\d+[/-]\d+|\b\d+(?:st|nd|rd|th)\b',
    ).hasMatch(text))
      return null;
    final relative = RegExp(r'\bin (\d+) (minutes?|mins?|hours?|hrs?)\b')
        .firstMatch(text);
    if (relative != null) {
      final value = int.parse(relative.group(1)!);
      if (value <= 0 || value > 10080) return null;
      final target = instant.add(
        Duration(
          minutes: value * (relative.group(2)!.startsWith('h') ? 60 : 1),
        ),
      );
      return DateTime(
        target.year,
        target.month,
        target.day,
        target.hour,
        target.minute,
      );
    }
    var day = DateTime(instant.year, instant.month, instant.day);
    if (text.contains('tomorrow'))
      day = DateTime(day.year, day.month, day.day + 1);
    const weekdays = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ];
    for (var i = 0; i < weekdays.length; i++) {
      if (RegExp('\\b${weekdays[i]}\\b').hasMatch(text)) {
        final distance = (i + 1 - day.weekday + 7) % 7;
        if (distance == 0) return null;
        day = DateTime(day.year, day.month, day.day + distance);
        break;
      }
    }
    final clock = RegExp(r'\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b')
        .firstMatch(text);
    int hour;
    int minute;
    if (clock != null) {
      hour = int.parse(clock.group(1)!);
      minute = int.parse(clock.group(2) ?? '0');
      if (hour < 1 || hour > 12 || minute > 59) return null;
      hour = hour % 12 + (clock.group(3) == 'pm' ? 12 : 0);
    } else {
      final military = RegExp(r'\bat (\d{1,2}):(\d{2})\b').firstMatch(text);
      if (military == null) return null;
      hour = int.parse(military.group(1)!);
      minute = int.parse(military.group(2)!);
      if (hour > 23 || minute > 59) return null;
    }
    final result = DateTime(day.year, day.month, day.day, hour, minute);
    return result.isAfter(instant) ? result : null;
  }
}

Future<AutomationResult> executePhoneAction(
  PhoneAction action, {
  MindRecipeMobileAutomation? automation,
  DateTime? now,
}) async {
  final invalid = action.validationError(now ?? DateTime.now());
  if (invalid != null)
    return AutomationResult(
      success: false,
      message: invalid,
      nativeCode: 'validation',
    );
  final auto = automation ?? MindRecipeMobileAutomation();
  return switch (action.type) {
    PhoneActionType.reminder => auto.setReminder(
      title: action.title,
      dueDate: action.when,
      notes: action.notes,
    ),
    PhoneActionType.appointment => auto.setAppointment(
      title: action.title,
      start: action.when!,
      end: action.end!,
      description: action.notes,
    ),
    PhoneActionType.alarm => auto.setAlarm(
      hour: action.when!.hour,
      minute: action.when!.minute,
      label: action.title,
    ),
  };
}
