import 'dart:async';
import 'dart:ui';

import 'package:flutter/foundation.dart';
import 'package:sensors_plus/sensors_plus.dart';

/// App-lifetime device-motion source for the VFX field.
///
/// Listens to the user accelerometer (gravity removed) and exposes a smoothed,
/// normalized tilt in -1..1 per axis. The GPU shader parallaxes and brightens
/// with it and the painter layer drifts with it, so the whole background
/// reacts when the phone moves — not only when pages swipe.
class MotionField extends ChangeNotifier {
  MotionField._();

  /// Shared instance; started lazily by the first FX widget.
  static final MotionField instance = MotionField._();

  StreamSubscription<AccelerometerEvent>? _sub;
  Offset _tilt = Offset.zero;

  /// Smoothed lateral tilt, -1..1 (dx = roll, dy = pitch).
  Offset get tilt => _tilt;

  bool get isActive => _sub != null;

  void ensureStarted() {
    if (_sub != null) return;
    try {
      _sub = accelerometerEventStream(
        samplingPeriod: const Duration(milliseconds: 40),
      ).listen(
        _onEvent,
        onError: (Object _) {},
        cancelOnError: false,
      );
    } catch (_) {
      _sub = null;
    }
  }

  void _onEvent(AccelerometerEvent event) {
    const g = 9.81;
    final tx = (event.x / g).clamp(-1.0, 1.0);
    final ty = (event.y / g).clamp(-1.0, 1.0);
    // Low-pass so the field glides rather than jitters.
    _tilt = Offset(
      _tilt.dx + (tx - _tilt.dx) * 0.14,
      _tilt.dy + (ty - _tilt.dy) * 0.14,
    );
    notifyListeners();
  }

  void stop() {
    _sub?.cancel();
    _sub = null;
    _tilt = Offset.zero;
    notifyListeners();
  }
}
