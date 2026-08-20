import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:mind_nav/app_services.dart';
import 'package:mind_nav/daily_navigation_scan.dart';
import 'package:mind_nav/main.dart';
import 'package:mind_nav/mind_nav_agent.dart';

class FakeMindNavApi extends MindNavApiClient {
  @override
  Future<bool> aiAvailable() async => true;

  @override
  Future<AiReply> reflect({
    required String token,
    required String providerKey,
    required String text,
    required Map<String, dynamic> context,
    bool externalResearchOptIn = false,
  }) async {
    return const AiReply(
      mode: 'cloud_ai',
      message: 'Let’s begin gently. What emotion feels closest right now?',
      provider: 'openrouter',
      model: 'openrouter/free',
    );
  }
}

void main() {
  Future<void> pumpFrames(WidgetTester tester, [int count = 9]) async {
    for (var frame = 0; frame < count; frame++) {
      await tester.pump(const Duration(milliseconds: 100));
    }
  }

  MindNavApp testApp({MindNavApiClient? api}) {
    final state = SecureAppState()..loaded = true;
    return MindNavApp(
      initialAppState: state,
      initialApi: api ?? FakeMindNavApi(),
    );
  }

  Future<void> enterMemberApp(WidgetTester tester) async {
    await tester.pumpWidget(testApp());
    await tester.pump();
    final localDemo = find.text('Explore local demo');
    await tester.ensureVisible(localDemo);
    await tester.tap(localDemo);
    await tester.pump();
    await tester.tap(find.text('Skip'));
    await pumpFrames(tester);
  }

  Future<void> enterCheckIn(WidgetTester tester) async {
    await enterMemberApp(tester);
    expect(find.bySemanticsLabel('Mind Nav AI, tab 1 of 7'), findsOneWidget);
  }

  testWidgets('login and registration gateway is the first app surface', (
    tester,
  ) async {
    await tester.pumpWidget(testApp());
    await tester.pump();
    expect(find.text('Welcome back, navigator'), findsOneWidget);
    expect(find.text('Sign in'), findsOneWidget);
    await tester.tap(find.text('Create a new account'));
    await tester.pump();
    expect(find.text('Create your private space'), findsOneWidget);
    expect(find.text('Create account'), findsOneWidget);
    expect(find.text('10 characters minimum'), findsOneWidget);
  });

  test('API client handles register and login token contracts', () async {
    final client = MockClient((request) async {
      expect(request.url.path, anyOf('/v1/auth/register', '/v1/auth/login'));
      final body = jsonDecode(request.body) as Map<String, dynamic>;
      expect(body['email'], 'navigator@example.com');
      return http.Response(
        jsonEncode({
          'access_token': 'signed-token',
          'user': {
            'display_name': 'Navigator',
            'email': 'navigator@example.com',
          },
        }),
        200,
      );
    });
    final api = MindNavApiClient(client: client);
    final registered = await api.register(
      name: 'Navigator',
      email: 'navigator@example.com',
      password: 'long-passphrase',
    );
    final loggedIn = await api.login(
      email: 'navigator@example.com',
      password: 'long-passphrase',
    );
    expect(registered.token, 'signed-token');
    expect(loggedIn.displayName, 'Navigator');
  });

  testWidgets('cinematic onboarding follows the account gateway', (
    tester,
  ) async {
    await tester.pumpWidget(testApp());
    await tester.pump();
    final localDemo = find.text('Explore local demo');
    await tester.ensureVisible(localDemo);
    await tester.tap(localDemo);
    await tester.pump();
    expect(find.text('The weather of your mind.'), findsOneWidget);
    expect(find.text('A guided path—not a test.'), findsOneWidget);
  });

  testWidgets('Check-in is a full Mind Nav AI conversation', (tester) async {
    await enterCheckIn(tester);
    expect(
      find.text('Cloud guidance ready · consent required per conversation'),
      findsOneWidget,
    );
    expect(find.text('CLOUD'), findsOneWidget);
    expect(find.text('Begin daily navigation'), findsOneWidget);
    expect(find.text('Tell Mind Nav what is present…'), findsOneWidget);
    expect(find.text('Begin today’s signal scan'), findsNothing);
  });

  testWidgets('AI chat dynamically responds to an opening choice', (
    tester,
  ) async {
    await enterCheckIn(tester);
    await tester.tap(find.text('Begin daily navigation'));
    await tester.pump();
    await pumpFrames(tester);
    expect(
      find.text('Begin my daily navigation. Guide me one step at a time.'),
      findsOneWidget,
    );
    expect(
      find.text('Let’s begin gently. What emotion feels closest right now?'),
      findsOneWidget,
    );
    expect(
      find.text('Cloud AI · journal excluded · suggestion, not fact'),
      findsOneWidget,
    );
  });

  testWidgets('Today no longer contains a redundant forwarding button', (
    tester,
  ) async {
    await enterMemberApp(tester);
    await tester.tap(find.bySemanticsLabel('Today, tab 2 of 7'));
    await pumpFrames(tester);
    expect(find.text('Assistant activity'), findsOneWidget);
    expect(find.text('Start check-in'), findsNothing);
    expect(
      find.textContaining('No assistant activity yet today'),
      findsOneWidget,
    );
  });

  testWidgets('Today reports activity completed with Mind Nav AI', (
    tester,
  ) async {
    await enterMemberApp(tester);
    await tester.tap(find.text('Begin daily navigation'));
    await tester.pump();
    await pumpFrames(tester);
    await tester.tap(find.bySemanticsLabel('Today, tab 2 of 7'));
    await pumpFrames(tester);
    expect(find.text('Assistant activity'), findsOneWidget);
    expect(find.text('Navigations'), findsOneWidget);
    expect(find.text('Messages'), findsOneWidget);
    expect(find.text('AI reflections'), findsOneWidget);
    expect(
      find.textContaining('stored privately on this device'),
      findsOneWidget,
    );
  });

  testWidgets('Mind Nav AI is the first and default tab', (tester) async {
    await enterMemberApp(tester);
    expect(find.text('Begin daily navigation'), findsOneWidget);
    expect(find.bySemanticsLabel('Mind Nav AI, tab 1 of 7'), findsOneWidget);
  });

  test('motion summary describes only device movement', () {
    final snapshot = MotionSnapshot.fromSamples(
      const [0.02, 0.03, 0.01],
      const [0.01, 0.02],
    );
    expect(snapshot.label, 'Device held mostly steady');
    expect(
      snapshot.detail,
      contains('does not describe your mental or physical state'),
    );
  });

  test('private agent routes tools and keeps research fail closed', () {
    const agent = MindNavAgent();
    final research = agent.plan(
      'Research evidence for breathing exercises',
      externalResearchApproved: false,
      navigationSessions: 1,
      messagesSent: 2,
      aiReflections: 2,
    );
    expect(research.tool, 'evidence research');
    expect(research.requiresResearchApproval, isTrue);
    expect(research.augment('research this'), contains('No external research'));

    final progress = agent.plan(
      'What patterns do you see in my progress?',
      externalResearchApproved: false,
      navigationSessions: 1,
      messagesSent: 2,
      aiReflections: 2,
    );
    expect(progress.tool, 'progress reflection');
    expect(progress.instruction, contains('1 navigation sessions'));
  });
}
