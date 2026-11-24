import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

class VoiceInterface {
  static final VoiceInterface _instance = VoiceInterface._();
  factory VoiceInterface() => _instance;
  VoiceInterface._();

  static const _channel = MethodChannel('contextfield.mindrecipe/voice');

  bool _isListening = false;
  Future<bool> isAvailable() async {
    try {
      return await _channel.invokeMethod<bool>('isAvailable') ?? false;
    } catch (e) {
      debugPrint('Voice availability check failed: $e');
      return false;
    }
  }

  Future<String?> startListening({
    String language = 'en-US',
    Duration silenceTimeout = const Duration(seconds: 3),
  }) async {
    if (_isListening) return null;
    _isListening = true;

    try {
      final result = await _channel.invokeMethod<String>('startListening', {
        'language': language,
        'silenceTimeoutMs': silenceTimeout.inMilliseconds,
      });
      return result;
    } catch (e) {
      debugPrint('Voice listening error: $e');
      return null;
    } finally {
      _isListening = false;
    }
  }

  Future<void> stopListening() async {
    if (!_isListening) return;
    try {
      await _channel.invokeMethod('stopListening');
    } catch (e) {
      debugPrint('Stop listening error: $e');
    } finally {
      _isListening = false;
    }
  }
}
