import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:path_provider/path_provider.dart';

import 'app_services.dart';

Future<void> _voiceLog(String msg) async {
  try {
    final dir = await getExternalStorageDirectory() ?? await getApplicationDocumentsDirectory();
    final file = File('${dir.path}/mindnav_debug.log');
    final timestamp = DateTime.now().toIso8601String();
    await file.writeAsString('$timestamp [VOICE] $msg\n', mode: FileMode.append);
  } catch (_) {}
}

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
  /// If the cloud voice is unavailable (offline, 1.2 GB model verifying, or
  /// API error), falls back to the offline system TTS so read-aloud still
  /// works without the staging API.
  Future<bool> speakAndWait(String text) async {
    if (_isSpeaking) await stopSpeaking();
    final epoch = ++_speechEpoch;
    _isSpeaking = true;
    try {
      await _voiceLog('speakAndWait called len=${text.length}');
      // 1. Try cloud companion voice first
      try {
        // Read-aloud must feel immediate.  The network voice is a nice-to-have;
        // do not make a member wait through its much longer API timeout before
        // falling back to the operating system voice.
        final rendered = await MindNavApiClient()
            .synthesizeVoice(text, speed: 0.97)
            .timeout(const Duration(seconds: 4));
        if (_speechEpoch != epoch) {
          await _voiceLog('epoch mismatch after synthesize');
          return false;
        }
        final audio = rendered['audio_base64']?.toString();
        if (audio != null && audio.isNotEmpty) {
          await _voiceLog('audio received base64_len=${audio.length}');
          final folder = await getTemporaryDirectory();
          final file = File('${folder.path}/mind_nav_companion.mp3');
          await file.writeAsBytes(base64Decode(audio), flush: true);
          if (_speechEpoch != epoch) {
            await _voiceLog('epoch mismatch after write');
            return false;
          }
          final played = await _channel.invokeMethod<bool>('playAudioAndWait', {
                'path': file.path,
              }) ??
              false;
          await _voiceLog('playAudioAndWait result=$played');
          if (played) return true;
          await _voiceLog('cloud play failed, falling back to system TTS');
        } else {
          await _voiceLog('no audio_base64 in response, falling back to system TTS');
        }
      } catch (error) {
        await _voiceLog('cloud voice failed: $error, falling back to system TTS');
      }
      // 2. Offline fallback — Android TextToSpeech (no network, works after
      // verifying or when staging API is unreachable)
      if (_speechEpoch != epoch) return false;
      await _voiceLog('trying system TTS offline len=${text.length}');
      final ok = await _channel.invokeMethod<bool>('speakWithSystemTtsAndWait', {
        'text': text,
        'rate': 0.95,
      });
      await _voiceLog('system TTS result=$ok');
      return ok ?? false;
    } catch (error) {
      await _voiceLog('ERROR: $error');
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
