import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mind_recipe/chat_actions.dart';
import 'package:mind_recipe/mobile_automation.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  final now = DateTime(2026, 10, 12, 10);
  final parser = PhoneActionParser(now: () => now);

  for (final text in [
    'Don’t remind me to call',
    'Do not create a meeting',
    'Yesterday I scheduled a meeting',
    'If I schedule a meeting tomorrow at 3pm',
    'Explain "remind me to call"',
    'Can you explain how to set an alarm?',
  ]) {
    test(
      'non-command does not produce action: $text',
      () => expect(parser.parse(text), isNull),
    );
  }
  test('missing or ambiguous time stays missing', () {
    expect(parser.parse('Create a meeting with Sarah')!.when, isNull);
    expect(parser.parse('Create a meeting with Sarah at 3')!.when, isNull);
    expect(
      parser.parse('Create a meeting with Sarah next Friday at 3pm')!.when,
      isNull,
    );
    expect(parser.parse('Create a meeting with Sarah at 13pm')!.when, isNull);
    expect(parser.parse('Create a meeting with Sarah at 3:99pm')!.when, isNull);
  });
  test('explicit weekday, time, and duration are preserved', () {
    final action = parser.parse(
      'Please schedule a meeting with Sarah on Tuesday at 3pm for 30 minutes',
    )!;
    expect(action.title, 'Sarah');
    expect(action.when, DateTime(2026, 10, 13, 15));
    expect(action.end, DateTime(2026, 10, 13, 15, 30));
    expect(action.validationError(now), isNull);
  });
  test('relative reminders preserve the task title', () {
    final action = parser.parse('Remind me to stretch in 20 minutes')!;
    expect(action.title, 'stretch');
    expect(action.when, now.add(const Duration(minutes: 20)));
  });
  test('calendar appointment wording preserves named title and duration', () {
    final action = parser.parse(
      'Schedule a calendar appointment titled MindRecipe test tomorrow at 3pm for 30 minutes.',
    )!;
    expect(action.type, PhoneActionType.appointment);
    expect(action.title, 'MindRecipe test');
    expect(action.when, DateTime(2026, 10, 13, 15));
    expect(action.end, DateTime(2026, 10, 13, 15, 30));
  });
  test('time-only event asks for a title instead of accepting punctuation', () {
    final action = parser.parse(
      'Schedule a meeting tomorrow at 3pm for 30 minutes.',
    )!;
    expect(action.title, isEmpty);
    expect(action.validationError(now), 'Add a title.');
    for (final title in ['.', '...', '!?', '   ']) {
      expect(
        PhoneAction(
          type: PhoneActionType.reminder,
          title: title,
        ).validationError(now),
        'Add a title.',
      );
    }
    expect(
      PhoneAction(
        type: PhoneActionType.reminder,
        title: '散歩',
      ).validationError(now),
      'Choose a date and time.',
    );
  });
  test('past times and impossible alarm dates require correction', () {
    expect(parser.parseWhen('at 9am'), isNull);
    final futureAlarm = PhoneAction(
      type: PhoneActionType.alarm,
      title: 'Wake up',
      when: DateTime(2026, 10, 20, 8),
    );
    expect(futureAlarm.validationError(now), isNotNull);
  });
  test('validation prevents any native dispatch', () async {
    const channel = MethodChannel('test_actions');
    var calls = 0;
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
        .setMockMethodCallHandler(channel, (call) async {
          calls++;
          return {'success': true};
        });
    final result = await executePhoneAction(
      const PhoneAction(type: PhoneActionType.appointment, title: 'Review'),
      automation: MindRecipeMobileAutomation(channel: channel),
      now: now,
    );
    expect(result.success, isFalse);
    expect(calls, 0);
  });
  test('launching an editor is not a verified completion', () {
    const launched = AutomationResult(
      success: true,
      message: 'Editor opened',
      nativeCode: 'intent_launched',
    );
    expect(launched.isHandedOff, isTrue);
    expect(launched.isCompleted, isFalse);
    const saved = AutomationResult(
      success: true,
      message: 'Saved',
      nativeCode: 'eventkit_saved',
    );
    expect(saved.isCompleted, isTrue);
    expect(saved.isHandedOff, isFalse);
  });
  test('missing native capabilities never invent support', () {
    final caps = AutomationCapabilities.fromMap({'platform': 'android'});
    expect(caps.canOpenCalendar, isFalse);
    expect(caps.canAddReminder, isFalse);
    expect(caps.canSetAlarm, isFalse);
  });
}
