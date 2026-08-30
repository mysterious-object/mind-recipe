import 'package:flutter/services.dart';

/// System overlay bridge for Navigator bubble — stays visible on home screen
/// and other apps when the user grants "Display over other apps" permission.
/// Build 2090: fixes bubble that disappeared outside the app.
class BubbleOverlay {
  static const _channel = MethodChannel('contextfield.mindrecipe/bubble_overlay');

  static Future<bool> hasPermission() async {
    try {
      return await _channel.invokeMethod<bool>('hasOverlayPermission') ?? false;
    } catch (_) {
      return false;
    }
  }

  static Future<bool> requestPermission() async {
    try {
      return await _channel.invokeMethod<bool>('requestOverlayPermission') ?? false;
    } catch (_) {
      return false;
    }
  }

  static Future<bool> show({
    required String? snippet,
    required bool isSpeaking,
    required bool isListening,
    String textFallback = '',
  }) async {
    try {
      final ok = await _channel.invokeMethod<bool>('showBubble', {
        'snippet': snippet,
        'text': snippet ?? textFallback,
        'isSpeaking': isSpeaking,
        'isListening': isListening,
      });
      return ok ?? false;
    } catch (_) {
      return false;
    }
  }

  static Future<void> hide() async {
    try {
      await _channel.invokeMethod('hideBubble');
    } catch (_) {}
  }

  static Future<bool> isShowing() async {
    try {
      return await _channel.invokeMethod<bool>('isShowing') ?? false;
    } catch (_) {
      return false;
    }
  }
}
