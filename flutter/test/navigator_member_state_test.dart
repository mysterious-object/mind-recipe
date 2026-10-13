import 'dart:convert';
import 'dart:io';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mind_recipe/app_services.dart';
import 'package:mind_recipe/navigator_member_state.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  final now = DateTime.utc(2026, 10, 13, 19);
  const member = AccountSession(
    token: 'test',
    displayName: 'Test',
    email: 'member@example.test',
  );
  Map<String, dynamic> entry(String id, DateTime time) => {
    'id': id,
    't': time.toIso8601String(),
    'emotions': 'Tired',
    'activation': -2,
    'activation_reported': true,
    'capacity': 'Low',
    'outcome': 'Pack my bag',
    'journal': 'PRIVATE JOURNAL',
    'ai_reflection': 'MODEL INFERENCE',
  };
  setUp(() => FlutterSecureStorage.setMockInitialValues({}));

  test('state survives restart without Pulse and excludes journals', () async {
    final state = SecureAppState()..session = member;
    await state.saveNavigationEntry(entry('check-in', now));
    final restored = SecureAppState()..session = member;
    final context = await restored.navigatorStateContext(now: now);
    expect(context, contains('Tired'));
    expect(context, contains('Pack my bag'));
    expect(context, contains('2026-10-13T19:00:00.000Z'));
    expect(context, contains('member daily check-in'));
    expect(context, isNot(contains('PRIVATE JOURNAL')));
    expect(context, isNot(contains('MODEL INFERENCE')));
    expect(await restored.loadMoodPulses(), isEmpty);
  });

  test('freshness is explicit and current corrections take precedence', () {
    final context = navigatorMemberStateContext([
      entry('old', now.subtract(const Duration(days: 3))),
    ], now: now);
    expect(context, contains('historical only; current state unknown'));
    expect(context, contains('latest user statement overrides older reports'));
  });

  test('skipped activation is not a fabricated neutral observation', () {
    final skipped = entry('skipped', now)..['activation_reported'] = false;
    final context = navigatorMemberStateContext([skipped], now: now);
    expect(context, isNot(contains('activation_minus5_to_plus5')));
  });

  test('newest valid timestamp wins, not insertion order', () {
    final context = navigatorMemberStateContext([
      entry('old', now.subtract(const Duration(days: 2)))..['emotions'] = 'Sad',
      entry('recent', now)..['emotions'] = 'Calm',
      entry('future', now.add(const Duration(days: 1)))
        ..['emotions'] = 'Future',
    ], now: now);
    expect(context, contains('Calm'));
    expect(context, isNot(contains('Sad')));
    expect(context, isNot(contains('Future')));
    expect(navigatorMemberStateContext([], now: now), isEmpty);
  });

  test(
    'other accounts and unowned legacy data never enter AI context',
    () async {
      FlutterSecureStorage.setMockInitialValues({
        'mind_recipe_navigation_history': jsonEncode([entry('legacy', now)]),
      });
      final state = SecureAppState()..session = member;
      expect(await state.navigatorStateContext(now: now), isEmpty);
      await state.saveNavigationEntry(entry('owned', now));
      state.session = const AccountSession(
        token: 'other',
        displayName: 'Other',
        email: 'other@example.test',
      );
      expect(await state.navigatorStateContext(now: now), isEmpty);
      expect(await state.loadNavigationHistory(), hasLength(2));
    },
  );

  test('Pulse entry points are removed; shared WebGL remains bundled', () {
    final main = File('lib/main.dart').readAsStringSync();
    final daily = File('lib/daily_navigation.dart').readAsStringSync();
    expect(main, isNot(contains('PulseScreen')));
    expect(main, isNot(contains("'Pulse'")));
    expect(daily, isNot(contains('onSeePulse')));
    expect(daily, contains('onReturnToNavigator'));
    expect(File('lib/pulse_screen.dart').existsSync(), isFalse);
    expect(File('assets/familiar/index.html').existsSync(), isFalse);
    expect(File('assets/familiar/background.html').existsSync(), isTrue);
    expect(
      File('assets/familiar/chimera-fx/mobile-scene.bundle.js').existsSync(),
      isTrue,
    );
  });
}
