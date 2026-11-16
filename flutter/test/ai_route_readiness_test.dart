import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mind_recipe/app_services.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  setUp(() => FlutterSecureStorage.setMockInitialValues({}));
  test('late readiness chooses private after API unavailability; no automatic cloud return', () async {
    final state = SecureAppState();
    await state.load();
    state.setManagedAiAvailable(false);
    state.reconcilePrivateReadiness(false);
    expect(state.cloudAiEnabled, isTrue);
    state.reconcilePrivateReadiness(true);
    expect(state.cloudAiEnabled, isFalse);
    state.setManagedAiAvailable(true);
    expect(state.cloudAiEnabled, isFalse);
  });
  test('readiness before API discovery waits for known availability', () {
    final state = SecureAppState();
    state.reconcilePrivateReadiness(true);
    expect(state.cloudAiEnabled, isTrue);
    state.setManagedAiAvailable(false);
    expect(state.cloudAiEnabled, isFalse);
  });
  test('explicit connected API and persisted private choices remain usable', () async {
    final state = SecureAppState();
    state.setManagedAiAvailable(true);
    await state.setCloudAiEnabled(true);
    state.reconcilePrivateReadiness(true);
    expect(state.cloudAiEnabled, isTrue);
    await state.setCloudAiEnabled(false);
    final restored = SecureAppState();
    await restored.load();
    restored.setManagedAiAvailable(true);
    restored.reconcilePrivateReadiness(true);
    expect(restored.cloudAiEnabled, isFalse);
  });
}
