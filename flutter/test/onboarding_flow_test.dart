import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mind_recipe/app_services.dart';
import 'package:mind_recipe/cinematic_experience.dart';
import 'package:mind_recipe/main.dart';
import 'package:mind_recipe/onboarding_flow.dart';
import 'onboarding_storage_test.dart' show ControlledStorage;

const account = AccountSession(token: 'synthetic-token', displayName: 'Member', email: 'member@example.test');

class SlowAiApi extends MindRecipeApiClient {
  final pending = Completer<bool>();
  @override
  Future<bool> aiAvailable() => pending.future;
}

class SlowRestoreApi extends SlowAiApi {
  @override
  Future<AccountRestoreResult> restoreSession(AccountSession stored) => Completer<AccountRestoreResult>().future;
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  setUp(() => FlutterSecureStorage.setMockInitialValues({}));

  Future<SecureAppState> state() async {
    final value = SecureAppState();
    await value.load();
    await value.setSession(account);
    return value;
  }

  Future<void> frames(WidgetTester tester) async {
    for (var i = 0; i < 6; i++) { await tester.pump(const Duration(milliseconds: 100)); }
  }

  testWidgets('AI discovery cannot delay the signed-out gateway', (tester) async {
    final api = SlowAiApi();
    await tester.pumpWidget(MindRecipeApp(initialAppState: SecureAppState()..loaded = true, initialApi: api));
    await frames(tester);
    expect(find.text('Sign in'), findsOneWidget);
    await tester.pump(const Duration(seconds: 5));
    expect(find.text('Sign in'), findsOneWidget);
    api.pending.complete(false);
    await tester.pumpWidget(const SizedBox());
  });

  testWidgets('slow session restoration is bounded and preserves the account', (tester) async {
    final value = await state();
    final api = SlowRestoreApi();
    await tester.pumpWidget(MindRecipeApp(initialAppState: value, initialApi: api));
    await tester.pump(const Duration(seconds: 9));
    await frames(tester);
    expect(value.session, isNotNull);
    expect(value.sessionTemporarilyUnverified, isTrue);
    expect(find.byType(CinematicOnboarding), findsOneWidget);
    api.pending.complete(false);
    await tester.pumpWidget(const SizedBox());
  });

  testWidgets('skip intro, required nickname, back, preferences skip, and relaunch', (tester) async {
    final value = await state();
    await tester.pumpWidget(MaterialApp(home: OnboardingFlow(appState: value)));
    await tester.tap(find.text('Skip'));
    await frames(tester);
    expect(value.onboardingComplete, isFalse);
    await tester.enterText(find.byType(TextField), '');
    await tester.tap(find.text('Continue'));
    await frames(tester);
    expect(find.text('Please enter a name or nickname.'), findsOneWidget);
    await tester.enterText(find.byType(TextField), 'River');
    await tester.tap(find.text('Continue'));
    await frames(tester);
    expect(value.memberDisplayName, 'River');
    await tester.tap(find.byTooltip('Back'));
    await frames(tester);
    expect(find.text('What should we call you?'), findsOneWidget);
    await tester.tap(find.text('Continue'));
    await frames(tester);
    await tester.ensureVisible(find.text('Skip for now'));
    await tester.tap(find.text('Skip for now'));
    await frames(tester);
    expect(value.onboardingComplete, isTrue);
    expect(value.appearanceMode, 'system');
    final restored = SecureAppState();
    await restored.load();
    expect(restored.onboardingComplete, isTrue);
    expect(restored.memberDisplayName, 'River');
    await tester.pumpWidget(const SizedBox());
  });

  testWidgets('interrupted setup resumes, saves actual appearance and permits replay', (tester) async {
    final value = await state();
    await value.saveOnboardingDraft({'step': 2, 'name': 'River', 'appearance': 'dark', 'visual': 'mindrecipe-core'});
    final restored = SecureAppState();
    await restored.load();
    await tester.pumpWidget(MaterialApp(home: OnboardingFlow(appState: restored)));
    expect(find.text('Make MindRecipe feel like you.'), findsOneWidget);
    await tester.ensureVisible(find.text('Save and continue'));
    await tester.tap(find.text('Save and continue'));
    await frames(tester);
    expect(restored.appearanceMode, 'dark');
    expect(restored.onboardingComplete, isTrue);
    await restored.replayOnboarding();
    expect(restored.onboardingComplete, isFalse);
    expect(restored.onboardingDraft['step'], 0);
    expect(restored.memberDisplayName, 'River');
    await tester.pumpWidget(const SizedBox());
  });

  testWidgets('compact reduced-motion intro remains usable and retries save failures', (tester) async {
    tester.view.physicalSize = const Size(320, 568);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
    var attempts = 0;
    await tester.pumpWidget(MaterialApp(home: MediaQuery(
      data: const MediaQueryData(size: Size(320, 568), disableAnimations: true, textScaler: TextScaler.linear(1.3)),
      child: CinematicOnboarding(onComplete: () async {
        attempts++;
        if (attempts == 1) throw StateError('storage unavailable');
      }),
    )));
    await frames(tester);
    expect(find.text('The weather of your mind.'), findsOneWidget);
    await tester.tap(find.text('Skip'));
    await frames(tester);
    expect(find.text('Could not save your progress. Please try again.'), findsOneWidget);
    await tester.tap(find.text('Enter MindRecipe'));
    await frames(tester);
    expect(attempts, 2);
    expect(tester.takeException(), isNull);
    await tester.pumpWidget(const SizedBox());
  });

  testWidgets('stale mounted setup cannot save to the newly active account', (tester) async {
    final value = await state();
    await value.saveOnboardingDraft({'step': 1, 'name': 'Member'});
    await tester.pumpWidget(MaterialApp(home: OnboardingFlow(appState: value)));
    await value.setSession(const AccountSession(token: 'other', displayName: 'Other', email: 'other@example.test'));
    await tester.tap(find.text('Continue'));
    await frames(tester);
    expect(value.onboardingDraft, isEmpty);
    expect(value.onboardingComplete, isFalse);
    await tester.pumpWidget(const SizedBox());
  });

  testWidgets('switching accounts during setup save cannot apply or complete the next account', (tester) async {
    final storage = ControlledStorage();
    final value = SecureAppState(storage: storage);
    await value.setSession(account);
    await value.saveOnboardingDraft({'step': 2, 'name': 'Member', 'appearance': 'dark'});
    await tester.pumpWidget(MaterialApp(home: OnboardingFlow(appState: value)));
    storage.gate = Completer<void>();
    await tester.tap(find.text('Save and continue'));
    await tester.pump();
    await value.setSession(const AccountSession(token: 'other', displayName: 'Other', email: 'other@example.test'));
    storage.gate!.complete();
    await frames(tester);
    expect(value.onboardingComplete, isFalse);
    expect(value.onboardingDraft, isEmpty);
    expect(value.appearanceMode, 'system');
    await tester.pumpWidget(const SizedBox());
  });

  testWidgets('setup provides an opaque surface under the transparent app theme', (tester) async {
    final value = await state();
    await value.saveOnboardingDraft({'step': 1, 'name': 'Member'});
    await tester.pumpWidget(MaterialApp(theme: ThemeData(scaffoldBackgroundColor: Colors.transparent),
        home: OnboardingFlow(appState: value)));
    final scaffold = tester.widget<Scaffold>(find.byType(Scaffold));
    expect(scaffold.backgroundColor?.a, 1);
    await tester.pumpWidget(const SizedBox());
  });
}
