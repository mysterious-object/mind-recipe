import 'dart:io';
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mind_recipe/app_services.dart';
import 'package:mind_recipe/main.dart';

class _ResetApi extends MindRecipeApiClient {
  @override
  Future<String?> requestPasswordReset({required String email}) async => null;
}

void main() {
  testWidgets(
    'sign-in, registration and both password reset forms fit the cover screen',
    (tester) async {
      tester.view.devicePixelRatio = 1;
      tester.view.physicalSize = const Size(320, 720);
      tester.platformDispatcher.textScaleFactorTestValue = 1.3;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);
      addTearDown(tester.platformDispatcher.clearTextScaleFactorTestValue);
      final boundary = GlobalKey();
      final output = Platform.environment['MIND_RECIPE_SCREENSHOTS'];
      if (output != null)
        await tester.runAsync(() async {
          final fontDir =
              "${Platform.environment['FLUTTER_ROOT']}/bin/cache/artifacts/material_fonts";
          for (final family in ['Roboto', 'Ahem']) {
            final fonts = FontLoader(family);
            for (final weight in ['Regular', 'Bold']) {
              fonts.addFont(
                Future.value(
                  ByteData.sublistView(
                    File('$fontDir/Roboto-$weight.ttf').readAsBytesSync(),
                  ),
                ),
              );
            }
            await fonts.load();
          }
        });
      await tester.pumpWidget(
        RepaintBoundary(
          key: boundary,
          child: MindRecipeApp(
            initialApi: _ResetApi(),
            initialAppState: SecureAppState()..loaded = true,
          ),
        ),
      );
      Future<void> capture(String name, String heading) async {
        await tester.pumpAndSettle();
        expect(find.text(heading), findsOneWidget);
        expect(tester.takeException(), isNull);
        if (output == null) return;
        await tester.runAsync(() async {
          final render =
              boundary.currentContext!.findRenderObject()!
                  as RenderRepaintBoundary;
          final frame = await render.toImage();
          final data = await frame.toByteData(format: ui.ImageByteFormat.png);
          await File('$output/$name.png')
              .writeAsBytes(data!.buffer.asUint8List());
          frame.dispose();
        });
      }

      Future<void> press(String label) async {
        await tester.ensureVisible(find.text(label));
        await tester.tap(find.text(label));
        await tester.pumpAndSettle();
        final scroll = tester.state<ScrollableState>(
          find.byType(Scrollable).first,
        );
        scroll.position.jumpTo(0);
        await tester.pumpAndSettle();
      }

      await capture('sign-in', 'Welcome back');
      await press('Create a new account');
      await capture('registration', 'Create your private space');
      await press('I already have an account');
      await press('Forgot password?');
      await capture('reset', 'Reset your password');
      await tester.enterText(
        find.byType(TextField).first,
        'sample@example.invalid',
      );
      await press('Send reset code');
      await capture('new-password', 'Choose a new password');
    },
  );
}
