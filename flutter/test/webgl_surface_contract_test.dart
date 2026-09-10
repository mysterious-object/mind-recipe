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

  test(
    'reference renderer and its pinned post-processing stack are bundled',
    () {
      final engine = File('assets/familiar/chimera-fx/core/Engine.js')
          .readAsStringSync();
      final composer = File(
        'assets/familiar/three-addons/postprocessing/EffectComposer.js',
      ).readAsStringSync();
      final bloom = File(
        'assets/familiar/three-addons/postprocessing/UnrealBloomPass.js',
      ).readAsStringSync();

      expect(engine, contains('new EffectComposer(this.renderer)'));
      expect(engine, contains('new UnrealBloomPass('));
      expect(composer, contains('class EffectComposer'));
      expect(bloom, contains('class UnrealBloomPass'));
      for (final source in [composer, bloom]) {
        expect(source, contains("/Android/i.test( navigator.userAgent )"));
        expect(source, contains('UnsignedByteType : HalfFloatType'));
      }
      expect(
        File('assets/familiar/three.module.min.js').readAsStringSync(),
        contains('const t="160"'),
        reason:
            'The renderer must use the source project\'s pinned Three.js r160.',
      );
    },
  );

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
