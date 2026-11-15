import 'dart:convert';
import 'dart:io';

import '../../lib/private_prompt.dart';
import '../../lib/navigator_agent.dart';
import '../../lib/navigator_member_state.dart';
import '../../test/fixtures/private_prompt_2155.dart' as baseline;
import '../../test/fixtures/navigator_agent_2155.dart' as baseline_router;

void main(List<String> args) {
  final context = navigatorMemberStateContext([
    {'t': '2026-10-12T10:00:00Z', 'emotions': 'Anxious, frustrated',
      'activation': 2, 'activation_reported': true, 'capacity': 'Low',
      'outcome': 'Try grounding before working'},
  ], now: DateTime.utc(2026, 10, 13, 10));
  final cases = <Map<String, dynamic>>[
    {'id': 'greeting_clean', 'message': 'Hello, how are you doing today?'},
    {'id': 'greeting_old_checkin', 'message': 'Hello, how are you doing today?', 'context': context},
    {'id': 'speaker_attribution', 'message': 'I feel anxious about my presentation. Can you help me prepare in two practical steps?', 'context': context},
    {'id': 'factual_uncertainty', 'message': 'What is the name of my doctor? I have not told you.'},
    {'id': 'correction', 'message': 'Where is my meeting? Answer only the city.', 'history': [
      {'role': 'user', 'text': 'My meeting is in Boston.'},
      {'role': 'assistant', 'text': 'Boston, noted.'},
      {'role': 'user', 'text': 'Correction: Cambridge, not Boston.'},
      {'role': 'assistant', 'text': 'Cambridge.'},
    ]},
    {'id': 'math_followup', 'message': 'Subtract 8 from that. Answer only the number.', 'history': [
      {'role': 'user', 'text': 'What is 19 plus 24?'},
      {'role': 'assistant', 'text': '43'},
    ]},
    {'id': 'support', 'message': 'I feel overwhelmed by work. Give me one manageable next step, without diagnosing me.'},
    {'id': 'personal_plan', 'message': 'Help me plan my next hour. I have 20 minutes of email and a 30 minute report. Include a break.', 'context': context},
    {'id': 'scheduling_truth', 'message': 'Did you actually save my appointment to my calendar? No action has been confirmed.'},
    {'id': 'scheduling_emotional_context', 'message': 'I was anxious earlier. Help me schedule 30 minutes to write my report at 3 pm. Do not claim it is saved.', 'context': context},
    {'id': 'meeting_plan_current_correction', 'message': 'Test scenario: I felt anxious yesterday, but I am calm now. I have 20 minutes before a meeting. Give me a two-step plan. Do not ask questions.'},
    {'id': 'meeting_plan_stale_checkin', 'message': 'Test scenario: I felt anxious yesterday, but I am calm now. I have 20 minutes before a meeting. Give me a two-step plan. Do not ask questions.', 'context': context},
    {'id': 'books_false_positive', 'message': 'What is the difference between fiction and nonfiction books? Answer briefly.'},
    {'id': 'history_false_positive', 'message': 'Explain one reason the history of Rome is studied today. Answer briefly.'},
  ];
  final rows = <Map<String, dynamic>>[];
  for (final item in cases) {
    final message = item['message'] as String;
    final background = item['context'] as String? ?? '';
    final history = (item['history'] as List? ?? []).cast<Map<String, dynamic>>();
    final plan = const NavigatorAgent().plan(message, externalResearchApproved: false,
        navigationSessions: 0, messagesSent: 0, aiReflections: 0);
    final oldPlan = const baseline_router.NavigatorAgent().plan(message,
        externalResearchApproved: false, navigationSessions: 0,
        messagesSent: 0, aiReflections: 0);
    final augmented = oldPlan.augment(message, context: background);
    rows.add({
      'id': item['id'], 'message': message,
      'baseline': baseline.mindRecipeBuildPrivatePrompt(augmented,
          format: baseline.PrivatePromptFormat.qwenChatMl,
          history: [for (final turn in history) baseline.LocalConversationTurn(role: turn['role'], text: turn['text'])]),
      'candidate': mindRecipeBuildPrivatePrompt(message,
          format: PrivatePromptFormat.qwenChatMl,
          memberContext: plan.relevantMemberContext(message, background),
          routingGuidance: plan.tool == 'open conversation' ? '' : plan.instruction,
          history: [for (final turn in history) LocalConversationTurn(role: turn['role'], text: turn['text'])]),
      if (item['id'] == 'personal_plan' || item['id'] == 'meeting_plan_current_correction')
        'baseline_thinking': baseline.mindRecipeBuildPrivatePrompt(augmented,
            format: baseline.PrivatePromptFormat.qwenChatMl, thinking: true,
            history: [for (final turn in history) baseline.LocalConversationTurn(role: turn['role'], text: turn['text'])]),
      if (item['id'] == 'personal_plan' || item['id'] == 'meeting_plan_current_correction')
        'candidate_thinking': mindRecipeBuildPrivatePrompt(message,
            format: PrivatePromptFormat.qwenChatMl, thinking: true,
            memberContext: plan.relevantMemberContext(message, background),
            routingGuidance: plan.tool == 'open conversation' ? '' : plan.instruction,
            history: [for (final turn in history) LocalConversationTurn(role: turn['role'], text: turn['text'])]),
    });
  }
  File(args.single).writeAsStringSync(const JsonEncoder.withIndent('  ').convert(rows));
}
