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
  testWidgets('actual Light app has opaque light surface, readable selector/chat and Settings at 320dp', (tester) async {
    tester.view.physicalSize = const Size(320, 886);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
    final state = SecureAppState()..loaded=true..appearanceMode='light'..cloudAiEnabled=false..onboardingComplete=true;
    state.session = const AccountSession(token:'test', displayName:'Member', email:'member@example.test');
    await tester.pumpWidget(MindRecipeApp(initialAppState: state,initialApi: RestoredApi(),initialLocalInference: ReadyPrivate()));
    Future<void> frames() async { for(var i=0;i<12;i++){await tester.pump(const Duration(milliseconds:100));} }
    await frames();
    final field = tester.widget<DropdownButtonFormField<bool>>(find.byType(DropdownButtonFormField<bool>));
    final fill = field.decoration.fillColor!;
    final foreground = field.style!.color!;
    final contrast = (fill.computeLuminance()+.05)/(foreground.computeLuminance()+.05);
    expect(fill.a,1);
    expect(fill.computeLuminance(),greaterThan(.7));
    expect(contrast,greaterThanOrEqualTo(4.5));
    await tester.enterText(find.byType(TextField).first,'Plan 35 minutes: 7 minutes inbox, 23 minutes drafting, 5 minutes break.');
    await tester.tap(find.byTooltip('Send to Navigator'));
    await frames();
    final settings = find.bySemanticsLabel('Settings, tab 4 of 4');
    expect(tester.getRect(settings).right,lessThanOrEqualTo(320));
    await tester.tap(settings);
    await frames();
    expect(find.text('Sign out'),findsOneWidget);
    expect(tester.takeException(),isNull);
    await tester.pumpWidget(const SizedBox());
  });
}
