import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mind_recipe/app_services.dart';
import 'package:mind_recipe/main.dart';
import 'planning_public_route_test.dart' show ReadyPrivate;
import 'widget_test.dart' show FakeMindRecipeApi;

class RestoredApi extends FakeMindRecipeApi {
  @override
  Future<AccountRestoreResult> restoreSession(AccountSession stored) async => AccountRestoreResult(AccountRestoreStatus.verified, stored);
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  setUp(() => FlutterSecureStorage.setMockInitialValues({}));
  for (final scale in [1.0, 2.0]) {
  testWidgets('actual Light app is readable at 320dp, text $scale', (tester) async {
    tester.platformDispatcher.textScaleFactorTestValue=scale;
    addTearDown(tester.platformDispatcher.clearTextScaleFactorTestValue);
    final originalErrorHandler = FlutterError.onError;
    FlutterError.onError = (details) {
      FlutterError.dumpErrorToConsole(details, forceReport:true);
      originalErrorHandler?.call(details);
    };
    addTearDown(() => FlutterError.onError = originalErrorHandler);
    tester.view.physicalSize = const Size(320, 886);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
    final state = SecureAppState()..loaded=true..appearanceMode='light'..cloudAiEnabled=false..onboardingComplete=true;
    await state.setSession(const AccountSession(token:'test', displayName:'Member', email:'member@example.test'));
    await state.completeOnboarding();
    await tester.pumpWidget(MindRecipeApp(initialAppState: state,initialApi: RestoredApi(),initialLocalInference: ReadyPrivate()));
    Future<void> frames() async { for(var i=0;i<12;i++){await tester.pump(const Duration(milliseconds:100));} }
    await frames();
    expect(tester.takeException(),isNull,reason:'Initial Navigator layout at text scale $scale');
    await tester.ensureVisible(find.byType(DropdownButtonFormField<bool>));
    await frames();
    final field = tester.widget<DropdownButtonFormField<bool>>(find.byType(DropdownButtonFormField<bool>));
    final fill = field.decoration.fillColor!;
    final dropdown = tester.widget<DropdownButton<bool>>(find.descendant(
      of: find.byType(DropdownButtonFormField<bool>), matching: find.byType(DropdownButton<bool>)));
    final foreground = dropdown.style!.color!;
    final contrast = (fill.computeLuminance()+.05)/(foreground.computeLuminance()+.05);
    expect(fill.a,1);
    expect(fill.computeLuminance(),greaterThan(.7));
    expect(contrast,greaterThanOrEqualTo(4.5));
    await tester.enterText(find.byType(TextField).first,'Plan 35 minutes: 7 minutes inbox, 23 minutes drafting, 5 minutes break.');
    tester.view.viewInsets = const FakeViewPadding(bottom: 300);
    await frames();
    final send = find.byTooltip('Send to Navigator');
    await tester.ensureVisible(send);
    expect(tester.getRect(send).bottom, lessThanOrEqualTo(586));
    await tester.tap(send);
    await frames();
    expect(find.textContaining('0–7'), findsWidgets);
    tester.view.resetViewInsets();
    await frames();
    final settings = find.bySemanticsLabel('Settings, tab 4 of 4');
    expect(tester.getRect(settings).right,lessThanOrEqualTo(320));
    await tester.tap(settings);
    await frames();
    expect(find.byType(ProfileScreen),findsOneWidget);
    expect(tester.takeException(),isNull);
    await tester.pumpWidget(const SizedBox());
  });
  }
}
