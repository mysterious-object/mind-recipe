import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mind_recipe/app_services.dart';
import 'package:mind_recipe/check_in_state.dart';
import 'package:mind_recipe/navigator_chat.dart';
import 'package:mind_recipe/on_device_inference.dart';
import 'widget_test.dart' show FakeLocalInference, FakeMindRecipeApi;

class ReadyPrivate extends FakeLocalInference {
  int calls = 0;
  @override
  LocalInferenceSnapshot get snapshot => const LocalInferenceSnapshot(OnDeviceStatus.ready);
  @override
  Future<String?> infer(String text, {List<LocalConversationTurn> history = const [],
    void Function(String)? onToken, String? rawMemberMessage, String memberContext = '', String routingGuidance = ''}) async {
    calls++;
    return text.toLowerCase().contains('hello') ? "I'm here and ready to help." : 'I hear you. What support would feel useful right now?';
  }
}
class NoCloud extends FakeMindRecipeApi {
  int calls = 0;
  @override
  Stream<NavigatorStreamEvent> navigatorTurn({required String token, required String providerKey,
    required String text, required Map<String, dynamic> context, required String model,
    bool externalResearchOptIn = false}) async* {
    calls++;
    throw StateError('Private requests must never use cloud');
  }
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  setUp(() => FlutterSecureStorage.setMockInitialValues({}));
  testWidgets('actual send route handles multi-turn plans, edits and distress without cloud', (tester) async {
    tester.view.physicalSize = const Size(320, 886);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
    final state = SecureAppState()..loaded = true;
    state.setManagedAiAvailable(false);
    final local = ReadyPrivate();
    final api = NoCloud();
    final messages = <ChatMessage>[];
    await tester.pumpWidget(MaterialApp(home: Scaffold(body: NavigatorChatExperience(
      state: CheckInState(), onChanged: () {}, api: api, appState: state,
      messages: messages, localInference: local))));
    Future<void> frames() async { for (var i=0;i<12;i++) { await tester.pump(const Duration(milliseconds: 100)); } }
    await frames();
    expect(state.cloudAiEnabled, isFalse);
    final results = <Map<String,dynamic>>[];
    Future<String> send(String text) async {
      await tester.enterText(find.byType(TextField).first, text);
      final timer = Stopwatch()..start();
      await tester.tap(find.byTooltip('Send to Navigator'));
      await frames();
      final result = messages.last.text;
      results.add({'request':text,'response':result,'widget_test_wall_ms':timer.elapsedMilliseconds,
        'private_model_calls':local.calls,'cloud_calls':api.calls});
      return result;
    }
    await send('Hello, how are you doing today?');
    expect(local.calls, 1);
    final meeting = await send('I felt anxious yesterday but I am calm now. I have 20 minutes before a meeting. Give me a two-step plan. Do not ask questions.');
    expect(meeting.toLowerCase(), isNot(contains('breath')));
    expect(meeting, contains('12–20 min'));
    final plan = await send('New test: Plan exactly 60 minutes: 20 minutes email, 30 minutes report, 10 minutes break. Give start end minute ranges. No breathing exercises.');
    expect(plan, contains('20–50 min: report (30 minutes)'));
    expect(plan, contains('50–60 min: break (10 minutes)'));
    expect(local.calls, 1);
    expect(await send('Change report to 45 minutes'), contains('exceeding the 60-minute budget by 15'));
    expect(await send('Change report to 25 minutes'), contains('55–60 min: Unallocated buffer'));
    expect(await send('Start at 3 pm'), contains('15:00–15:20'));
    expect(await send('Plan exactly 35 minutes: 7 minutes inbox, 23 minutes drafting, 5 minutes break.'), contains('7–30 min: drafting (23 minutes)'));
    expect(local.calls, 1);
    final anchored = await send('Starting at 9:40 am, plan 15 minutes email, 25 minutes report, and 5 minutes break.');
    expect(anchored,contains('09:40–09:55: email (15 minutes)'));
    expect(anchored,contains('10:20–10:25: break (5 minutes)'));
    await send('Plan exactly 60 minutes: 20 minutes email, 30 minutes report, 10 minutes break.');
    final compound = await send('Change the report to 25 minutes and the break to 15 minutes. Keep email at 20 minutes.');
    expect(compound,contains('20–45 min: report (25 minutes)'));
    expect(compound,contains('45–60 min: break (15 minutes)'));
    expect(await send('I have only 30 minutes. Plan 20 minutes email and 25 minutes report.'),
        contains('total 45 minutes, exceeding the 30-minute budget by 15'));
    expect(await send('Plan for 45 minutes: email 15 minutes, report 20 minutes, break 10 minutes.'),
        contains('15–35 min: report (20 minutes)'));
    expect(local.calls,1);
    for (final request in [
      'Plan for 45 minutes: email 15 minutes and report 20 minutes and break 10 minutes.',
      'Plan for 45 minutes: 15 minutes email, report 20 minutes, 10 minutes break.',
    ]) {
      final reply = await send(request);
      expect(reply,contains('0–15 min: email (15 minutes)'));
      expect(reply,contains('15–35 min: report (20 minutes)'));
      expect(reply,contains('35–45 min: break (10 minutes)'));
    }
    expect(await send('Change the budget to 50 minutes.'),contains('45–50 min: Unallocated buffer (5 minutes)'));
    expect(local.calls,1);
    await send('I feel anxious right now and need support.');
    expect(local.calls, greaterThan(1));
    expect(api.calls, 0);
    expect(tester.takeException(), isNull);
    Directory('build/test-evidence').createSync(recursive: true);
    File('build/test-evidence/2158-app-route.json').writeAsStringSync(jsonEncode({
      'source':Platform.environment['GITHUB_SHA'], 'kind':'actual Navigator send route; model mocked only for non-planning turns',
      'logical_width':320,'timing_limit':'widget test wall time, not physical phone/model latency', 'turns':results}));
    await tester.pumpWidget(const SizedBox());
  });
}
