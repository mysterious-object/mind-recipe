/// Private, on-device inference for Mind Nav.
///
/// A model is never treated as installed until its full SHA-256 digest matches
/// the pinned manifest and the local engine has successfully loaded it.
library;

import 'dart:async';
import 'dart:convert';
import 'dart:isolate';
import 'dart:io';

import 'package:crypto/crypto.dart';
import 'package:flutter/foundation.dart';
import 'package:llama_cpp_dart/llama_cpp_dart.dart';
import 'package:path_provider/path_provider.dart';

import 'mind_nav_device_harness.dart';

Future<void> _inferLog(String msg) async {
  try {
    final dir = await getExternalStorageDirectory() ?? await getApplicationDocumentsDirectory();
    final file = File('${dir.path}/mindnav_debug.log');
    final timestamp = DateTime.now().toIso8601String();
    await file.writeAsString('$timestamp [INFER] $msg\n', mode: FileMode.append);
  } catch (_) {}
}

enum OnDeviceStatus {
  checking,
  notInstalled,
  downloading,
  verifying,
  ready,
  error,
}

class LocalInferenceSnapshot {
  const LocalInferenceSnapshot(this.status, {this.detail});

  final OnDeviceStatus status;
  final String? detail;
  bool get isReady => status == OnDeviceStatus.ready;
  bool get canInstall =>
      status == OnDeviceStatus.notInstalled || status == OnDeviceStatus.error;
}

abstract class LocalInference {
  LocalInferenceSnapshot get snapshot;
  Future<LocalInferenceSnapshot> refreshStatus();
  Future<void> installModel({bool allowCellular = false});
  Future<String?> infer(
    String userMessage, {
    List<LocalConversationTurn> history = const [],
  });
  Future<void> removeModel();
}

class LocalConversationTurn {
  const LocalConversationTurn({required this.role, required this.text});

  final String role;
  final String text;
}

class OnDeviceModelManifest {
  const OnDeviceModelManifest({
    required this.id,
    required this.version,
    required this.downloadUri,
    required this.sha256,
    required this.sizeBytes,
    required this.license,
  });

  final String id;
  final String version;
  final Uri downloadUri;
  final String sha256;
  final int sizeBytes;
  final String license;
}

/// Mobile-first reasoning model. It is deliberately downloaded only after an
/// explicit member action; it is never bundled in the app.
final mindNavPrivateModel = OnDeviceModelManifest(
  id: 'mind-nav-private-reasoning-qwen3-4b-q4km',
  version: '2026.08.20-qwen3-4b-q4km',
  downloadUri: Uri.parse(
    'https://huggingface.co/ggml-org/Qwen3-4B-GGUF/resolve/main/Qwen3-4B-Q4_K_M.gguf',
  ),
  sha256: 'ab27b9bfa375a178d6cba48f3ad892b94b7739659dcc7aae8058ce0ffed6b328',
  sizeBytes: 2497280640,
  license: 'Apache-2.0',
);

/// Computes the digest outside Flutter's UI isolate. A complete model check is
/// intentionally required before a model can run, but it must never freeze the
/// member-facing experience while it is happening.
Future<String> _sha256ForFile(String path) async {
  final digest = await sha256.bind(File(path).openRead()).first;
  return digest.toString().toLowerCase();
}

class OnDeviceInference implements LocalInference {
  static final OnDeviceInference _instance = OnDeviceInference._();
  factory OnDeviceInference() => _instance;
  OnDeviceInference._();

  LocalInferenceSnapshot _snapshot = const LocalInferenceSnapshot(
    OnDeviceStatus.checking,
  );
  LlamaParent? _engine;
  bool _refreshing = false;

  @override
  LocalInferenceSnapshot get snapshot => _snapshot;

  double _downloadProgress = 0;
  double get downloadProgress => _downloadProgress;
  static const _minimumMemoryMiB = 8192;

  Future<File> _modelFile() async {
    final base = await getApplicationSupportDirectory();
    final directory = Directory('${base.path}/private-models');
    if (!await directory.exists()) await directory.create(recursive: true);
    return File('${directory.path}/${mindNavPrivateModel.id}.gguf');
  }

  Future<File> _verificationReceipt(File model) async =>
      File('${model.path}.verified');

  String get _receiptContents =>
      '${mindNavPrivateModel.version}:${mindNavPrivateModel.sizeBytes}:${mindNavPrivateModel.sha256}';

  @override
  Future<LocalInferenceSnapshot> refreshStatus() async {
    if (_refreshing) return _snapshot;
    _refreshing = true;
    try {
      final file = await _modelFile();
      final partial = File('${file.path}.partial');
      final stalePartialReceipt = await _verificationReceipt(partial);
      if (!await partial.exists() && await stalePartialReceipt.exists()) {
        await stalePartialReceipt.delete();
      }
      if (!await file.exists() || await file.length() == 0) {
        _disposeEngine();
        return _set(
          const LocalInferenceSnapshot(
            OnDeviceStatus.notInstalled,
            detail: 'Private model is not installed on this device.',
          ),
        );
      }
      final device = await MindNavDeviceHarness().capabilities();
      if (device.totalMemoryMiB != null &&
          device.totalMemoryMiB! < _minimumMemoryMiB) {
        _disposeEngine();
        return _set(
          LocalInferenceSnapshot(
            OnDeviceStatus.error,
            detail:
                'This device has ${device.totalMemoryMiB} MB of memory. Private reasoning needs at least $_minimumMemoryMiB MB; cloud guidance remains available if you choose it.',
          ),
        );
      }
      _set(const LocalInferenceSnapshot(OnDeviceStatus.verifying));
      if (!await _matchesManifest(file)) {
        _disposeEngine();
        return _set(
          const LocalInferenceSnapshot(
            OnDeviceStatus.error,
            detail: 'The private model did not pass its integrity check.',
          ),
        );
      }
      if (_engine == null) await _loadEngine(file);
      return _set(const LocalInferenceSnapshot(OnDeviceStatus.ready));
    } catch (error) {
      _disposeEngine();
      return _set(
        LocalInferenceSnapshot(
          OnDeviceStatus.error,
          detail: 'Private model is unavailable on this device: $error',
        ),
      );
    } finally {
      _refreshing = false;
    }
  }

  @override
  Future<void> installModel({bool allowCellular = false}) async {
    if (_snapshot.status == OnDeviceStatus.downloading) return;
    // Connectivity policy is owned by the caller; this method remains explicit
    // about the requested cellular permission for the future scheduler.
    _set(const LocalInferenceSnapshot(OnDeviceStatus.downloading));
    _downloadProgress = 0;
    final destination = await _modelFile();
    final temporary = File('${destination.path}.partial');
    try {
      if (await temporary.exists()) await temporary.delete();
      final client = HttpClient()..autoUncompress = true;
      final request = await client.getUrl(mindNavPrivateModel.downloadUri);
      request.followRedirects = true;
      request.maxRedirects = 5;
      final response = await request.close().timeout(
        const Duration(minutes: 12),
      );
      if (response.statusCode != HttpStatus.ok) {
        client.close(force: true);
        throw HttpException('Model download returned ${response.statusCode}.');
      }
      final expected = response.contentLength > 0
          ? response.contentLength
          : mindNavPrivateModel.sizeBytes;
      var received = 0;
      final sink = temporary.openWrite();
      await for (final bytes in response) {
        received += bytes.length;
        sink.add(bytes);
        _downloadProgress = received / expected;
      }
      await sink.close();
      client.close(force: true);
      _set(const LocalInferenceSnapshot(OnDeviceStatus.verifying));
      if (!await _matchesManifest(temporary)) {
        throw const FileSystemException(
          'Downloaded model did not match the signed manifest.',
        );
      }
      if (await destination.exists()) await destination.delete();
      await temporary.rename(destination.path);
      final temporaryReceipt = await _verificationReceipt(temporary);
      if (await temporaryReceipt.exists()) await temporaryReceipt.delete();
      await _writeVerificationReceipt(destination);
      await refreshStatus();
    } catch (error) {
      if (await temporary.exists()) await temporary.delete();
      _set(LocalInferenceSnapshot(OnDeviceStatus.error, detail: '$error'));
      rethrow;
    }
  }

  @override
  Future<String?> infer(
    String userMessage, {
    List<LocalConversationTurn> history = const [],
  }) async {
    final status = await refreshStatus();
    await _inferLog('infer called status=${status.status} engine=${_engine != null}');
    if (!status.isReady || _engine == null) {
      await _inferLog('infer ABORT: not ready');
      return null;
    }
    try {
      await _engine!.clear();
      final response = StringBuffer();
      final subscription = _engine!.stream.listen(response.write);
      final prompt = _buildPrompt(userMessage, history: history);
      await _inferLog('infer prompt length=${prompt.length}');
      final promptId = await _engine!.sendPrompt(prompt);
      await _engine!
          .waitForCompletion(promptId)
          .timeout(const Duration(seconds: 150));
      await subscription.cancel();
      final raw = response.toString();
      await _inferLog('infer raw length=${raw.length} preview="${raw.substring(0, raw.length > 150 ? 150 : raw.length)}"');
      final stripped = _stripPrivateReasoning(raw);
      await _inferLog('infer stripped length=${stripped.length}');
      final clean = _enforceWellnessBoundaries(stripped).trim();
      await _inferLog('infer clean length=${clean.length} preview="${clean.substring(0, clean.length > 150 ? 150 : clean.length)}"');
      return clean.isEmpty ? null : clean;
    } catch (error) {
      await _inferLog('infer ERROR: $error');
      return null;
    }
  }

  @override
  Future<void> removeModel() async {
    _disposeEngine();
    final file = await _modelFile();
    if (await file.exists()) await file.delete();
    final partial = File('${file.path}.partial');
    if (await partial.exists()) await partial.delete();
    final receipt = await _verificationReceipt(file);
    if (await receipt.exists()) await receipt.delete();
    _downloadProgress = 0;
    _set(const LocalInferenceSnapshot(OnDeviceStatus.notInstalled));
  }

  Future<bool> _matchesManifest(File file) async {
    if (await file.length() != mindNavPrivateModel.sizeBytes) return false;
    final receipt = await _verificationReceipt(file);
    if (await receipt.exists() &&
        await receipt.readAsString() == _receiptContents) {
      return true;
    }
    final digest = await Isolate.run(() => _sha256ForFile(file.path));
    final matches = digest == mindNavPrivateModel.sha256;
    if (matches) await _writeVerificationReceipt(file);
    return matches;
  }

  Future<void> _writeVerificationReceipt(File model) async {
    await (await _verificationReceipt(model))
        .writeAsString(_receiptContents, flush: true);
  }

  Future<void> _loadEngine(File file) async {
    _disposeEngine();
    // The bundled Android runtime exposes libllama.so. The package defaults to
    // an optional multimodal library which is not part of this text-only app.
    if (Platform.isAndroid) Llama.libraryPath = 'libllama.so';
    final model = ModelParams()
      ..nGpuLayers = 0
      ..mainGpu = -1;
    final context = ContextParams()
      ..nCtx = 2048
      ..nBatch = 384
      ..nUbatch = 384
      ..nThreads = 6
      ..nThreadsBatch = 6
      ..nPredict = 220
      ..typeK = LlamaKvCacheType.f16
      ..typeV = LlamaKvCacheType.f16;
    final sampler = SamplerParams()
      ..temp = 0.6
      ..topK = 20
      ..topP = 0.95
      ..minP = 0.0
      ..penaltyPresent = 1.5;
    final parent = LlamaParent(
      LlamaLoad(
        path: file.path,
        modelParams: model,
        contextParams: context,
        samplingParams: sampler,
        verbose: const bool.fromEnvironment('MIND_NAV_LOCAL_VERBOSE'),
      ),
    );
    await parent.init().timeout(const Duration(seconds: 90));
    _engine = parent;
  }

  void _disposeEngine() {
    final engine = _engine;
    _engine = null;
    if (engine != null) unawaited(engine.dispose());
  }

  LocalInferenceSnapshot _set(LocalInferenceSnapshot next) {
    _snapshot = next;
    return next;
  }

  String _stripPrivateReasoning(String response) {
    final close = response.lastIndexOf('</think>');
    if (close >= 0) return response.substring(close + '</think>'.length);
    if (response.contains('<think>')) {
      final open = response.indexOf('<think>');
      final afterOpen = open + '<think>'.length;
      if (afterOpen < response.length) return response.substring(afterOpen).trim();
      return '';
    }
    return response;
  }

  String _enforceWellnessBoundaries(String response) => response
      .replaceAll(
        RegExp(r"\byou(?: are|'re) safe\b", caseSensitive: false),
        'you can stay with this moment',
      )
      .replaceAll(
        RegExp(r'\byou are not in danger\b', caseSensitive: false),
        'notice what feels steady around you',
      );

  String _cleanPromptText(String value) =>
      value.replaceAll('<|', '').replaceAll('|>', '').trim();

  String _buildPrompt(
    String userMessage, {
    List<LocalConversationTurn> history = const [],
  }) {
    final prompt = StringBuffer('''<|im_start|>system
You are Mind Nav, a private on-device wellness companion. Understand what the member means in light of the conversation, including short follow-ups such as "yes", "that", or "it". First identify the concrete concern, feeling, event, or request they actually expressed. Then respond directly to that meaning. Ground every reply in a detail the member actually said, without inventing an emotion. Do not restart the check-in, repeat a generic greeting, paraphrase every sentence, or force an exercise. Never begin with "You seem to be feeling" or "Thank you for sharing". Never say "It's important to process" or "What would you like to focus on next?" Be warm, specific, and conversational (usually 35 to 100 words). Use at most one genuine question, and make it specific to their words. Never diagnose, prescribe, assess safety, or claim clinical certainty. Treat interpretations as possibilities. If urgent danger is mentioned, encourage contacting local emergency help or 988 in the United States. Never reveal private reasoning or mention internal tools.

Example: If the member says their manager dismissed their work in front of the team and they froze, stay with the dismissal and the unfinished moment. A useful question might ask what they wish they had been able to say. Do not reduce it to a generic emotion check.<|im_end|>
''');
    final recent = history.length > 8
        ? history.sublist(history.length - 8)
        : history;
    for (final turn in recent) {
      final role = turn.role == 'assistant' ? 'assistant' : 'user';
      final clean = _cleanPromptText(turn.text);
      if (clean.isEmpty) continue;
      prompt
        ..writeln('<|im_start|>$role')
        ..writeln(clean)
        ..writeln('<|im_end|>');
    }
    prompt
      ..writeln('<|im_start|>user')
      ..writeln(_cleanPromptText(userMessage))
      ..writeln('/no_think<|im_end|>')
      ..writeln('<|im_start|>assistant');
    return prompt.toString();
  }
}
