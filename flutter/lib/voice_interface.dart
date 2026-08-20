import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:path_provider/path_provider.dart';

import 'app_services.dart';

/// Voice interface for Mind Nav — native recognition and interruptible audio.
class VoiceInterface {
  static final VoiceInterface _instance = VoiceInterface._();
  factory VoiceInterface() => _instance;
  VoiceInterface._();

  static const _channel = MethodChannel('mindnav.dev/voice');

  bool _isListening = false;
  bool _isSpeaking = false;
  int _speechEpoch = 0;

  bool get isListening => _isListening;
  bool get isSpeaking => _isSpeaking;

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
    Duration silenceTimeout = const Duration(seconds: 6),
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

  /// Plays a licensed human recording and resolves when playback ends.
  ///
  /// Dynamic AI text is deliberately not accepted here: Mind Nav must never
  /// substitute synthetic speech when the member selected a human voice.
  Future<bool> playRecordedCueAndWait(String filePath) async {
    if (_isSpeaking) await stopSpeaking();
    final epoch = ++_speechEpoch;
    _isSpeaking = true;
    try {
      return await _channel.invokeMethod<bool>('playAudioAndWait', {
            'path': filePath,
          }) ??
          false;
    } catch (e) {
      debugPrint('Recorded voice playback error: $e');
      return false;
    } finally {
      if (_speechEpoch == epoch) _isSpeaking = false;
    }
  }

  /// Renders the current Mind Nav companion voice, then plays the completed
  /// audio through the same interruption-safe recorded-audio path.
  Future<bool> speakAndWait(String text) async {
    if (_isSpeaking) await stopSpeaking();
    final epoch = ++_speechEpoch;
    _isSpeaking = true;
    try {
      final rendered = await MindNavApiClient().synthesizeVoice(
        text,
        speed: 0.97,
      );
      if (_speechEpoch != epoch) return false;
      final audio = rendered['audio_base64']?.toString();
      if (audio == null || audio.isEmpty) return false;
      final folder = await getTemporaryDirectory();
      final file = File('${folder.path}/mind_nav_companion.mp3');
      await file.writeAsBytes(base64Decode(audio), flush: true);
      if (_speechEpoch != epoch) return false;
      return await _channel.invokeMethod<bool>('playAudioAndWait', {
            'path': file.path,
          }) ??
          false;
    } catch (error) {
      debugPrint('Mind Nav voice rendering error: $error');
      return false;
    } finally {
      if (_speechEpoch == epoch) _isSpeaking = false;
    }
  }

  Future<void> stopSpeaking() async {
    _speechEpoch++;
    try {
      await _channel.invokeMethod('stopSpeaking');
    } catch (e) {
      debugPrint('Stop speaking error: $e');
    } finally {
      _isSpeaking = false;
    }
  }
}
