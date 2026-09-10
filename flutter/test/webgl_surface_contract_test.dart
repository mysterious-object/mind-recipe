import 'dart:io';

import 'package:flutter_test/flutter_test.dart';

void main() {
  test('mobile WebGL surfaces use opaque Android-safe backing colors', () {
    for (final path in const [
      'lib/three_background.dart',
      'lib/pulse_screen.dart',
    ]) {
      final source = File(path).readAsStringSync();
      expect(
        source,
        isNot(contains('setBackgroundColor(Colors.transparent)')),
        reason:
            '$path must not request an unsupported transparent WebGL target.',
      );
    }
  });

  test('DarkStar-derived engine negotiates Android-safe framebuffers', () {
    final engine = File('assets/familiar/chimera-fx/core/Engine.js')
        .readAsStringSync();
    final composer = File(
      'assets/familiar/three-addons/postprocessing/EffectComposer.js',
    ).readAsStringSync();
    final bloom = File(
      'assets/familiar/three-addons/postprocessing/UnrealBloomPass.js',
    ).readAsStringSync();

    expect(engine, contains('MAX_RENDERBUFFER_SIZE'));
    expect(engine, contains('MAX_TEXTURE_SIZE'));
    expect(engine, contains('this._safePixelRatio()'));
    expect(composer, contains('UnsignedByteType'));
    expect(composer, contains('/Android/i.test( navigator.userAgent )'));
    expect(bloom, contains('UnsignedByteType'));
    expect(
      RegExp(r'type: HalfFloatType').allMatches(bloom),
      isEmpty,
      reason: 'Bloom must not hard-code unsupported half-float attachments.',
    );
  });

  test('WebGL pages load only after their native surfaces are attached', () {
    for (final path in const [
      'lib/three_intro_screen.dart',
      'lib/three_brand_mark.dart',
      'lib/three_background.dart',
    ]) {
      final source = File(path).readAsStringSync();
      final attached = source.indexOf('setState(() =>');
      final frame = source.indexOf('WidgetsBinding.instance.endOfFrame');
      final loaded = source.indexOf('loadFlutterAsset(');
      expect(attached, greaterThanOrEqualTo(0), reason: path);
      expect(frame, greaterThan(attached), reason: path);
      expect(loaded, greaterThan(frame), reason: path);
    }
  });
}
