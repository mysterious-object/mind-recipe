import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mind_recipe/app_services.dart';

const alice = AccountSession(
  token: 'alice-token', displayName: 'Alice', email: 'alice@example.test',
);
const bob = AccountSession(
  token: 'bob-token', displayName: 'Bob', email: 'bob@example.test',
);

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  setUp(() => FlutterSecureStorage.setMockInitialValues({}));

  test('completion belongs to the account, survives relaunch and sign-out', () async {
    final state = SecureAppState();
    await state.load();
    await state.setSession(alice);
    await state.completeOnboarding();
    expect(state.onboardingComplete, isTrue);
    final restored = SecureAppState();
    await restored.load();
    expect(restored.onboardingComplete, isTrue);
    await restored.signOut();
    expect(restored.onboardingComplete, isFalse);
    await restored.setSession(bob);
    expect(restored.onboardingComplete, isFalse);
    await restored.setSession(alice);
    expect(restored.onboardingComplete, isTrue);
  });

  test('switching directly to a newly registered account cannot inherit completion', () async {
    final state = SecureAppState();
    await state.load();
    await state.setSession(alice);
    await state.completeOnboarding();
    await state.setSession(bob);
    expect(state.onboardingComplete, isFalse);
    await state.clearSession();
    expect(state.onboardingComplete, isFalse);
  });

  test('an unattributed legacy device marker cannot complete a new account', () async {
    FlutterSecureStorage.setMockInitialValues({'mind_recipe_onboarding_version': '1'});
    final state = SecureAppState();
    await state.load();
    await state.setSession(bob);
    expect(state.onboardingComplete, isFalse);
    final restored = SecureAppState();
    await restored.load();
    expect(restored.onboardingComplete, isFalse);
  });

  test('leaving without completion restarts the introduction on relaunch', () async {
    final state = SecureAppState();
    await state.load();
    await state.setSession(alice);
    final restored = SecureAppState();
    await restored.load();
    expect(restored.onboardingComplete, isFalse);
  });
}
