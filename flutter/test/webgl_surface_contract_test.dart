import 'dart:io';

import 'package:flutter_test/flutter_test.dart';

void main() {
  test('mobile WebGL surfaces use opaque Android-safe backing colors', () {
    for (final path in const [
      'lib/three_background.dart',
      'lib/three_brand_mark.dart',
      'lib/pulse_screen.dart',
    ]) {
      final source = File(path).readAsStringSync();
      expect(
        source,
        isNot(contains('setBackgroundColor(Colors.transparent)')),
        reason: '$path must not request an unsupported transparent WebGL target.',
      );
    }
  });
}
