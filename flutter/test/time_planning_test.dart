import 'package:flutter_test/flutter_test.dart';
import 'package:mind_recipe/time_planning.dart';

void main() {
  test('arbitrary named tasks derive adjacent consistent ranges and exact totals', () {
    for (final values in [[20, 30, 10], [7, 23, 5], [15, 40, 12]]) {
      final total = values.reduce((a, b) => a + b);
      final reply = resolveTimePlanning(['Plan exactly $total minutes: ${values[0]} minutes inbox, ${values[1]} minutes drafting, ${values[2]} minutes break.'])!;
      expect(reply.clarification, isFalse);
      expect(reply.plan!.allocated, total);
      expect(reply.text, contains('0–${values[0]} min: inbox (${values[0]} minutes)'));
      expect(reply.text, contains('${values[0]}–${values[0] + values[1]} min: drafting (${values[1]} minutes)'));
      expect(reply.text, contains('Nothing has been added'));
    }
  });
  test('multi-turn new plan replaces preparation; edits retain explicit budget', () {
    final turns = ['Hello, how are you doing today?',
      'I felt anxious yesterday but I am calm now. I have 20 minutes before a meeting. Give me a two-step plan. Do not ask questions.',
      'New test: Plan exactly 60 minutes: 20 minutes email, 30 minutes report, 10 minutes break. Give start end minute ranges. No breathing exercises.'];
    final meeting = resolveTimePlanning(turns.sublist(0, 2))!;
    expect(meeting.plan!.allocated, 20);
    expect(meeting.text.toLowerCase(), isNot(contains('breath')));
    expect(meeting.text, isNot(contains('?')));
    final reply = resolveTimePlanning(turns)!;
    expect(reply.plan!.allocated, 60);
    expect(reply.text, contains('20–50 min: report (30 minutes)'));
    expect(reply.text, contains('50–60 min: break (10 minutes)'));
    final over = resolveTimePlanning([...turns, 'Change report to 45 minutes'])!;
    expect(over.clarification, isTrue);
    expect(over.text, contains('exceeding the 60-minute budget by 15'));
    final fixed = resolveTimePlanning([...turns, 'Change report to 45 minutes', 'Change report to 25 minutes'])!;
    expect(fixed.plan!.allocated, 55);
    expect(fixed.text, contains('55–60 min: Unallocated buffer (5 minutes)'));
  });
  test('hours, an explicit clock anchor and edits do not invent a current time', () {
    final turns = ['Plan 2 hours: 0.5 hours reading, 1 hour coding, 30 minutes break. Starting at 23:30.'];
    final reply = resolveTimePlanning(turns)!;
    expect(reply.plan!.allocated, 120);
    expect(reply.text, contains('23:30–00:00 (+1 day): reading (30 minutes)'));
    final moved = resolveTimePlanning([...turns, 'Start at 3 pm'])!;
    expect(moved.text, contains('15:00–15:30'));
    expect(resolveTimePlanning([...turns, 'Start at 3'])!.clarification, isTrue);
  });
  test('missing task facts clarify, excess time stays a buffer or requested break', () {
    expect(resolveTimePlanning(['Plan exactly 45 minutes.'])!.clarification, isTrue);
    expect(resolveTimePlanning(['Plan exactly 30 minutes: 20 minutes reading, 20 minutes coding.'])!.clarification, isTrue);
    final reply = resolveTimePlanning(['Help me plan my next hour. I have 20 minutes of email and 30 minutes report. Include a break.'])!;
    expect(reply.plan!.allocated, 60);
    expect(reply.plan!.tasks.last.label, 'Break');
  });
  test('current distress without a planning request remains conversation', () {
    expect(resolveTimePlanning(['I feel anxious right now. Help me.']), isNull);
    expect(resolveTimePlanning(['I tried a breathing exercise yesterday.']), isNull);
  });
  test('natural task/budget boundaries, compound edits and labels before durations', () {
    final anchored = resolveTimePlanning(['Starting at 9:40 am, plan 15 minutes email, 25 minutes report, and 5 minutes break.'])!;
    expect(anchored.plan!.budget,45);
    expect(anchored.text,contains('09:40–09:55: email (15 minutes)'));
    expect(anchored.text,contains('09:55–10:20: report (25 minutes)'));
    expect(anchored.text,contains('10:20–10:25: break (5 minutes)'));
    final edited = resolveTimePlanning(['Plan exactly 60 minutes: 20 minutes email, 30 minutes report, 10 minutes break.',
      'Change the report to 25 minutes and the break to 15 minutes. Keep email at 20 minutes.'])!;
    expect(edited.plan!.allocated,60);
    expect(edited.text,contains('20–45 min: report (25 minutes)'));
    expect(edited.text,contains('45–60 min: break (15 minutes)'));
    final over = resolveTimePlanning(['I have only 30 minutes. Plan 20 minutes email and 25 minutes report.'])!;
    expect(over.clarification,isTrue);
    expect(over.text,contains('total 45 minutes, exceeding the 30-minute budget by 15'));
    final reversed = resolveTimePlanning(['Plan for 45 minutes: email 15 minutes, report 20 minutes, break 10 minutes.'])!;
    expect(reversed.plan!.allocated,45);
    expect(reversed.text,contains('15–35 min: report (20 minutes)'));
  });
  test('invalid plan rendering cannot leak inconsistent ranges', () {
    expect(() => const TimePlan([PlanTask('work',40)],30).render(),throwsStateError);
    expect(() => const TimePlan([PlanTask('work',-5)],30).render(),throwsStateError);
  });
}
