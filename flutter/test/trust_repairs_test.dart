import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:mind_recipe/app_services.dart';
import 'package:mind_recipe/daily_navigation_result.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  const stored = AccountSession(
    token: 'test-token',
    displayName: 'Member',
    email: 'member@example.test',
  );
  setUp(() => FlutterSecureStorage.setMockInitialValues({}));

  for (final status in [429, 500, 502, 503, 403]) {
    test('HTTP $status during restore preserves local session', () async {
      final api = MindRecipeApiClient(
        client: MockClient((_) async => http.Response('', status)),
      );
      final result = await api.restoreSession(stored);
      expect(result.status, AccountRestoreStatus.temporarilyUnavailable);
      expect(result.session, same(stored));
    });
  }
  test('network error preserves local session, 401 invalidates it', () async {
    final offline = MindRecipeApiClient(
      client: MockClient((_) async => throw http.ClientException('offline')),
    );
    expect(
      (await offline.restoreSession(stored)).status,
      AccountRestoreStatus.temporarilyUnavailable,
    );
    final invalid = MindRecipeApiClient(
      client: MockClient((_) async => http.Response('', 401)),
    );
    expect(
      (await invalid.restoreSession(stored)).status,
      AccountRestoreStatus.invalid,
    );
  });
  test('verified session refreshes account metadata', () async {
    final api = MindRecipeApiClient(
      client: MockClient(
        (_) async => http.Response(
          jsonEncode({'display_name': 'Updated', 'email': stored.email}),
          200,
        ),
      ),
    );
    final result = await api.restoreSession(stored);
    expect(result.status, AccountRestoreStatus.verified);
    expect(result.session!.displayName, 'Updated');
  });
  test(
    'old queued journals and direct calls cannot upload journal text',
    () async {
      FlutterSecureStorage.setMockInitialValues({
        'mind_recipe_pending_checkins': jsonEncode([
          {
            'client_id': 'legacy-nav-1',
            'emotions': ['Calm'],
            'activation': -1,
            'journal': 'SENSITIVE TEST JOURNAL',
          },
        ]),
      });
      var requests = 0;
      final api = MindRecipeApiClient(
        client: MockClient((request) async {
          requests++;
          final payload = jsonDecode(request.body) as Map;
          expect(payload.containsKey('journal'), isFalse);
          expect(request.body, isNot(contains('SENSITIVE')));
          return http.Response('{}', 201);
        }),
      );
      final state = SecureAppState()..session = stored;
      await state.flushPendingCheckIns(api);
      await api.createCheckIn(
        token: stored.token,
        clientId: 'direct-nav',
        emotions: [],
        activation: 0,
        bodyAreas: [],
        journal: 'SENSITIVE TEST JOURNAL',
      );
      expect(requests, 2);
    },
  );
  test(
    'day rollover preserves lifetime counts and chat is not navigation',
    () async {
      FlutterSecureStorage.setMockInitialValues({
        'mind_recipe_assistant_activity': jsonEncode({
          'date': '2020-01-01',
          'navigation_sessions': 2,
          'messages_sent': 3,
          'ai_reflections': 4,
          'lifetime_navigation_sessions': 20,
          'lifetime_navigator_turns': 30,
          'lifetime_ai_reflections': 40,
        }),
      });
      final state = SecureAppState();
      await state.load();
      await state.recordAssistantMessage(startsSession: true);
      expect(state.navigationSessions, 0);
      expect(state.lifetimeNavigationSessions, 20);
      expect(state.lifetimeNavigatorTurns, 31);
      expect(state.lifetimeAiReflections, 40);
      await state.recordNavigationCompletion();
      expect(state.navigationSessions, 1);
      expect(state.lifetimeNavigationSessions, 21);
      expect(state.messagesSent, 1);
    },
  );
  test('onboarding completion survives a fresh state instance', () async {
    final state = SecureAppState();
    await state.completeOnboarding();
    final restored = SecureAppState();
    await restored.load();
    expect(restored.onboardingComplete, isTrue);
  });
  for (final level in [-5, 0, 5]) {
    test(
      'Check-in preserves self-report $level without mood overriding energy',
      () {
        final result = DailyNavigationResult(
          id: 'nav-test',
          recordedAt: DateTime(2026),
          emotions: ['Anxious'],
          bodyAreas: [],
          activation: level,
          activationReported: true,
          journal: 'calm connected happy',
          zoneLabel: '',
          mode: 'Guidance',
          availableMinutes: 3,
          capacity: 'Steady',
          outcome: '',
        );
        expect(result.normalizedActivation, (level + 5) / 10);
        expect(result.toSyncPayload().containsKey('journal'), isFalse);
        expect(result.toLocalHistory()['journal'], 'calm connected happy');
      },
    );
  }
  test('duplicate navigation source cannot add a second Pulse point', () async {
    final state = SecureAppState();
    for (var i = 0; i < 2; i++) {
      await state.recordMoodPulse(
        valence: .6,
        activation: .5,
        sourceId: 'nav-one',
      );
    }
    expect(await state.loadMoodPulses(), hasLength(1));
  });
}
