/// Mind Nav's native device bridge.
///
/// This is a custom mobile implementation inspired by the development-only
/// phone harness reference. It never drives other apps, reads a device ID, or
/// performs a network request. It exposes only deliberate local feedback and
/// a coarse device-capability snapshot to approved Mind Nav tools.
import 'package:flutter/services.dart';

class DeviceHarnessSnapshot {
  const DeviceHarnessSnapshot({
    required this.hapticsAvailable,
    required this.platform,
    this.totalMemoryMiB,
  });

  final bool hapticsAvailable;
  final String platform;
  final int? totalMemoryMiB;

  factory DeviceHarnessSnapshot.fromMap(Map<Object?, Object?> map) =>
      DeviceHarnessSnapshot(
        hapticsAvailable: map['hapticsAvailable'] == true,
        platform: map['platform']?.toString() ?? 'unknown',
        totalMemoryMiB: map['totalMemoryMiB'] as int?,
      );
}

class MindNavDeviceHarness {
  static const _channel = MethodChannel('mindnav.dev/device_harness');

  Future<DeviceHarnessSnapshot> capabilities() async {
    try {
      final result = await _channel.invokeMapMethod<Object?, Object?>(
        'capabilities',
      );
      return DeviceHarnessSnapshot.fromMap(result ?? const {});
    } on PlatformException {
      return const DeviceHarnessSnapshot(
        hapticsAvailable: false,
        platform: 'unknown',
      );
    } on MissingPluginException {
      return const DeviceHarnessSnapshot(
        hapticsAvailable: false,
        platform: 'unknown',
      );
    }
  }

  /// A gentle local acknowledgment after a member starts or completes a turn.
  /// It has no data payload and never leaves the device.
  Future<void> acknowledgeTurn() async {
    try {
      await _channel.invokeMethod<void>('acknowledgeTurn');
    } on PlatformException {
      // Haptics are optional and should never interrupt a conversation.
    } on MissingPluginException {
      // Desktop and widget tests intentionally have no native bridge.
    }
  }
}
