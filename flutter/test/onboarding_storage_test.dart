import 'dart:async';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mind_recipe/app_services.dart';

class ControlledStorage extends FlutterSecureStorage {
  Completer<void>? gate;
  bool fail = false;
  @override
  Future<void> write({required String key, required String? value,
    Object? iOptions, Object? aOptions, Object? lOptions, Object? webOptions,
    Object? mOptions, Object? wOptions}) async {
    if (key.startsWith('mind_recipe_onboarding_version_')) {
      if (fail) throw StateError('secure storage unavailable');
      await gate?.future;
    }
    await super.write(key: key, value: value);
  }
}

const a = AccountSession(token: 'a', displayName: 'A', email: 'a@example.test');
const b = AccountSession(token: 'b', displayName: 'B', email: 'b@example.test');

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  setUp(() => FlutterSecureStorage.setMockInitialValues({}));

  test('failed durable completion stays incomplete and can be retried', () async {
    final storage = ControlledStorage();
    final state = SecureAppState(storage: storage);
    await state.setSession(a);
    storage.fail = true;
    await expectLater(state.completeOnboarding(), throwsStateError);
    expect(state.onboardingComplete, isFalse);
    storage.fail = false;
    await state.completeOnboarding();
    expect(state.onboardingComplete, isTrue);
    final restored = SecureAppState();
    await restored.load();
    expect(restored.onboardingComplete, isTrue);
  });

  test('delayed completion for A cannot complete B', () async {
    final storage = ControlledStorage();
    final state = SecureAppState(storage: storage);
    await state.setSession(a);
    storage.gate = Completer<void>();
    final completion = state.completeOnboarding();
    await state.setSession(b);
    storage.gate!.complete();
    await completion;
    expect(state.onboardingComplete, isFalse);
    await state.setSession(a);
    expect(state.onboardingComplete, isTrue);
  });

  test('listeners only see the new account with its own completion and draft', () async {
    final state = SecureAppState();
    await state.setSession(a);
    await state.saveOnboardingDraft({'name': 'River', 'step': 2});
    await state.completeOnboarding();
    var notifications = 0;
    state.addListener(() {
      notifications++;
      if (state.session?.email == b.email) {
        expect(state.onboardingComplete, isFalse);
        expect(state.onboardingDraft, isEmpty);
      }
    });
    await state.setSession(b);
    expect(notifications, greaterThan(0));
  });
}
