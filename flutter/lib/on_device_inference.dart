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
import 'package:flutter/services.dart';
import 'package:llama_cpp_dart/llama_cpp_dart.dart';
import 'package:path_provider/path_provider.dart';

import 'mind_nav_device_harness.dart';

Future<void> _inferLog(String msg) async {
  try {
    final dir =
        await getExternalStorageDirectory() ??
        await getApplicationDocumentsDirectory();
    final file = File('${dir.path}/mindnav_debug.log');
    final timestamp = DateTime.now().toIso8601String();
    await file.writeAsString(
      '$timestamp [INFER] $msg\n',
      mode: FileMode.append,
    );
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

/// A member-facing description of the private model. Keeping this separate
/// from the download manifest lets the setup screen explain the trade-offs
/// without implying that a model is installed before its checksum verifies.
class OnDeviceModelChoice {
  const OnDeviceModelChoice({
    required this.manifest,
    required this.name,
    required this.quality,
    required this.bestFor,
    required this.memoryNote,
    this.recommended = false,
  });

  final OnDeviceModelManifest manifest;
  final String name;
  final String quality;
  final String bestFor;
  final String memoryNote;
  final bool recommended;
}

/// Mobile-first reasoning model. It is deliberately downloaded only after an
/// explicit member action; it is never bundled in the app.
final mindNavPrivateModel = OnDeviceModelManifest(
  id: 'mind-nav-private-reasoning-qwen3-1.7b-q4km',
  version: '2026.08.20-qwen3-1.7b-q4km',
  downloadUri: Uri.parse(
    'https://huggingface.co/ggml-org/Qwen3-1.7B-GGUF/resolve/main/Qwen3-1.7B-Q4_K_M.gguf',
  ),
  sha256: 'd2387ca2dbfee2ffabce7120d3770dadca0b293052bc2f0e138fdc940d9bc7b5',
  sizeBytes: 1282439264,
  license: 'Apache-2.0',
);

final mindNavPrivateFastModel = OnDeviceModelManifest(
  id: 'mind-nav-private-fast-qwen3-0.6b-q4-0',
  version: '2026.08.22-qwen3-0.6b-q4-0',
  downloadUri: Uri.parse(
    'https://huggingface.co/ggml-org/Qwen3-0.6B-GGUF/resolve/main/Qwen3-0.6B-Q4_0.gguf',
  ),
  sha256: 'da2572f16c06133561ce56accaa822216f2391ef4d37fba427801cd6736417d4',
  sizeBytes: 428970080,
  license: 'Apache-2.0',
);

final mindNavPrivateCompactModel = OnDeviceModelManifest(
  id: 'mind-nav-private-compact-qwen3-0.6b-q8-0',
  version: '2026.08.22-qwen3-0.6b-q8-0',
  downloadUri: Uri.parse(
    'https://huggingface.co/ggml-org/Qwen3-0.6B-GGUF/resolve/main/Qwen3-0.6B-Q8_0.gguf',
  ),
  sha256: '361cc68159042c36ebff7715dc5a2e4612153e88f3e9c9c234820849d6dc9e1d',
  sizeBytes: 804753632,
  license: 'Apache-2.0',
);

/// Every choice is an explicitly pinned, checksum-verified download.
final mindNavPrivateModelChoices = <OnDeviceModelChoice>[
  OnDeviceModelChoice(
    manifest: mindNavPrivateFastModel,
    name: 'Private Fast',
    quality: 'Quick, lighter-weight guidance',
    bestFor: 'Short check-ins and quick resets on phones with less storage.',
    memoryNote: '409 MB download · needs 4 GB device memory',
  ),
  OnDeviceModelChoice(
    manifest: mindNavPrivateCompactModel,
    name: 'Private Compact',
    quality: 'Better detail in a smaller download',
    bestFor: 'Everyday reflection with more nuance without the largest model.',
    memoryNote: '768 MB download · needs 6 GB device memory',
  ),
  OnDeviceModelChoice(
    manifest: mindNavPrivateModel,
    name: 'Private Balanced',
    quality: 'Strong everyday reflection',
    bestFor: 'Most conversations; a good balance of nuance and speed.',
    memoryNote: '1.2 GB download · needs 8 GB device memory',
    recommended: true,
  ),
];

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
  OnDeviceModelManifest _activeManifest = mindNavPrivateModel;

  @override
  LocalInferenceSnapshot get snapshot => _snapshot;
  OnDeviceModelManifest get activeModel => _activeManifest;

  double _downloadProgress = 0;
  double get downloadProgress => _downloadProgress;
  int _downloadedBytes = 0;
  int get downloadedBytes => _downloadedBytes;
  int _downloadBytesPerSecond = 0;
  int get downloadBytesPerSecond => _downloadBytesPerSecond;
  Duration? get estimatedDownloadRemaining => _downloadBytesPerSecond <= 0
      ? null
      : Duration(
          seconds:
              ((_activeManifest.sizeBytes - _downloadedBytes) /
                      _downloadBytesPerSecond)
                  .ceil(),
        );
  int get _minimumMemoryMiB {
    if (_activeManifest.id == mindNavPrivateFastModel.id) return 4096;
    if (_activeManifest.id == mindNavPrivateCompactModel.id) return 6144;
    return 8192;
  }

  Future<File> _modelFile([OnDeviceModelManifest? manifest]) async {
    final target = manifest ?? _activeManifest;
    final base = await getApplicationSupportDirectory();
    final directory = Directory('${base.path}/private-models');
    if (!await directory.exists()) await directory.create(recursive: true);
    return File('${directory.path}/${target.id}.gguf');
  }

  Future<File> _verificationReceipt(File model) async =>
      File('${model.path}.verified');

  String _receiptContents(OnDeviceModelManifest manifest) =>
      '${manifest.version}:${manifest.sizeBytes}:${manifest.sha256}';

  @override
  Future<LocalInferenceSnapshot> refreshStatus() async {
    if (_refreshing) return _snapshot;
    // Do not clobber an active download/verify — the UI timer polls this
    // every 500ms and would otherwise reset `downloading` → `notInstalled`
    // while the .partial file is still being written (tab switch bug).
    if (_snapshot.status == OnDeviceStatus.downloading ||
        _snapshot.status == OnDeviceStatus.verifying) {
      return _snapshot;
    }
    _refreshing = true;
    try {
      var file = await _modelFile();
      if (!await file.exists()) {
        for (final choice in mindNavPrivateModelChoices) {
          final candidate = await _modelFile(choice.manifest);
          if (await candidate.exists() &&
              await candidate.length() == choice.manifest.sizeBytes) {
            _activeManifest = choice.manifest;
            file = candidate;
            break;
          }
        }
      }
      final partial = File('${file.path}.partial');
      final stalePartialReceipt = await _verificationReceipt(partial);
      if (!await partial.exists() && await stalePartialReceipt.exists()) {
        await stalePartialReceipt.delete();
      }
      // If a .partial exists with bytes, we are mid-download — report downloading
      // so the progress bar survives tab switches / PageView rebuilds.
      if (await partial.exists() && await partial.length() > 0) {
        // Keep the existing snapshot if it already reflects downloading
        if (_snapshot.status == OnDeviceStatus.downloading) return _snapshot;
        return _set(const LocalInferenceSnapshot(OnDeviceStatus.downloading));
      }
      if (!await file.exists() || await file.length() == 0) {
        _disposeEngine();
        final snapshot = const LocalInferenceSnapshot(
          OnDeviceStatus.notInstalled,
          detail: 'Private model is not installed on this device.',
        );
        _set(snapshot);
        return snapshot;
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
      await _inferLog('verifying ${file.path}');
      if (!await _matchesManifest(
        file,
        _activeManifest,
      ).timeout(const Duration(minutes: 4))) {
        await _inferLog('verify failed: hash mismatch');
        _disposeEngine();
        return _set(
          const LocalInferenceSnapshot(
            OnDeviceStatus.error,
            detail: 'The private model did not pass its integrity check.',
          ),
        );
      }
      await _inferLog('verify ok, loading engine');
      if (_engine == null) await _loadEngine(file);
      await _inferLog('engine loaded, ready');
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
  Future<void> installModel({
    bool allowCellular = false,
    OnDeviceModelManifest? model,
  }) async {
    if (_snapshot.status == OnDeviceStatus.downloading) return;
    if (model != null) _activeManifest = model;
    // Connectivity policy is owned by the caller; this method remains explicit
    // about the requested cellular permission for the future scheduler.
    _set(const LocalInferenceSnapshot(OnDeviceStatus.downloading));
    final destination = await _modelFile();
    final temporary = File('${destination.path}.partial');
    // Resume support: keep .partial and use Range header so tab switches
    // or brief backgrounding don't discard 1+ GB already fetched.
    var resumeOffset = 0;
    if (await temporary.exists()) {
      resumeOffset = await temporary.length();
      // If partial is already complete size, don't re-download — go to verify
      if (resumeOffset >= _activeManifest.sizeBytes) {
        _downloadProgress = 1.0;
      } else if (resumeOffset > 0) {
        _downloadProgress = resumeOffset / _activeManifest.sizeBytes;
      } else {
        _downloadProgress = 0;
      }
    } else {
      _downloadProgress = 0;
    }
    _downloadedBytes = resumeOffset;
    _downloadBytesPerSecond = 0;
    // If we are resuming, keep the file; otherwise start fresh
    var isResume = resumeOffset > 0 && resumeOffset < _activeManifest.sizeBytes;
    try {
      final client = HttpClient()..autoUncompress = true;
      client.connectionTimeout = const Duration(seconds: 30);
      final request = await client.getUrl(_activeManifest.downloadUri);
      request.followRedirects = true;
      request.maxRedirects = 8;
      request.headers.set(
        'User-Agent',
        'MindNav/1.0 (Flutter; +https://mindnav.app)',
      );
      request.headers.set('Accept', '*/*');
      if (isResume) {
        request.headers.set('Range', 'bytes=$resumeOffset-');
      }
      final response = await request.close().timeout(
        const Duration(minutes: 30),
      );
      // 206 = Partial Content (resume), 200 = OK (fresh)
      if (response.statusCode != HttpStatus.ok &&
          response.statusCode != HttpStatus.partialContent) {
        client.close(force: true);
        throw HttpException('Model download returned ${response.statusCode}.');
      }
      // If server ignored Range and returned 200, restart from 0
      if (isResume && response.statusCode == HttpStatus.ok) {
        await temporary.delete();
        resumeOffset = 0;
        _downloadProgress = 0;
        isResume = false;
      }
      final contentLen = response.contentLength;
      final expected = contentLen > 0
          ? (isResume ? resumeOffset + contentLen : contentLen)
          : _activeManifest.sizeBytes;
      var received = resumeOffset;
      var lastSampleBytes = received;
      var lastSampleAt = DateTime.now();
      final sink = temporary.openWrite(
        mode: isResume ? FileMode.append : FileMode.write,
      );
      await for (final bytes in response) {
        received += bytes.length;
        sink.add(bytes);
        _downloadProgress = received / expected;
        _downloadedBytes = received;
        final now = DateTime.now();
        final elapsedMs = now.difference(lastSampleAt).inMilliseconds;
        if (elapsedMs >= 750) {
          _downloadBytesPerSecond =
              ((received - lastSampleBytes) * 1000 / elapsedMs).round();
          lastSampleBytes = received;
          lastSampleAt = now;
        }
      }
      await sink.close();
      client.close(force: true);
      _set(const LocalInferenceSnapshot(OnDeviceStatus.verifying));
      await _inferLog(
        'verifying download ${temporary.path} (${await temporary.length()} bytes, expect ${_activeManifest.sizeBytes})',
      );
      if (!await _matchesManifest(
        temporary,
        _activeManifest,
      ).timeout(const Duration(minutes: 4))) {
        throw const FileSystemException(
          'Downloaded model did not match the signed manifest.',
        );
      }
      if (await destination.exists()) await destination.delete();
      await temporary.rename(destination.path);
      final temporaryReceipt = await _verificationReceipt(temporary);
      if (await temporaryReceipt.exists()) await temporaryReceipt.delete();
      await _writeVerificationReceipt(destination, _activeManifest);
      // Do not call refreshStatus while still marked verifying: that guard
      // intentionally protects active checks and previously left success stuck.
      _set(const LocalInferenceSnapshot(OnDeviceStatus.checking));
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
    await _inferLog(
      'infer called status=${status.status} engine=${_engine != null}',
    );
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
      await _inferLog(
        'infer raw length=${raw.length} preview="${raw.substring(0, raw.length > 150 ? 150 : raw.length)}"',
      );
      final stripped = _stripPrivateReasoning(raw);
      await _inferLog('infer stripped length=${stripped.length}');
      final clean = _enforceWellnessBoundaries(stripped).trim();
      await _inferLog(
        'infer clean length=${clean.length} preview="${clean.substring(0, clean.length > 150 ? 150 : clean.length)}"',
      );
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
    _downloadedBytes = 0;
    _downloadBytesPerSecond = 0;
    _set(const LocalInferenceSnapshot(OnDeviceStatus.notInstalled));
  }

  Future<bool> _matchesManifest(
    File file,
    OnDeviceModelManifest manifest,
  ) async {
    if (await file.length() != manifest.sizeBytes) return false;
    final receipt = await _verificationReceipt(file);
    if (await receipt.exists() &&
        await receipt.readAsString() == _receiptContents(manifest)) {
      return true;
    }
    final digest = await Isolate.run(() => _sha256ForFile(file.path));
    final matches = digest == manifest.sha256;
    if (matches) await _writeVerificationReceipt(file, manifest);
    return matches;
  }

  Future<void> _writeVerificationReceipt(
    File model,
    OnDeviceModelManifest manifest,
  ) async {
    await (await _verificationReceipt(model))
        .writeAsString(_receiptContents(manifest), flush: true);
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
      ..nBatch = 512
      ..nUbatch = 512
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
    await _inferLog(
      'loading engine for ${file.path} (${await file.length()} bytes)',
    );
    await parent.init().timeout(const Duration(seconds: 150));
    _engine = parent;
    await _inferLog('engine ready');
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
      if (afterOpen < response.length)
        return response.substring(afterOpen).trim();
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
