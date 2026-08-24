/// Private, on-device inference for Mind Recipe.
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

import 'mind_recipe_device_harness.dart';

Future<void> _inferLog(String msg) async {
  try {
    final dir =
        await getExternalStorageDirectory() ??
        await getApplicationDocumentsDirectory();
    final file = File('${dir.path}/mindrecipe_debug.log');
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
final mindRecipePrivateModel = OnDeviceModelManifest(
  id: 'mind-recipe-private-reasoning-qwen3-1.7b-q4km',
  version: '2026.08.20-qwen3-1.7b-q4km',
  downloadUri: Uri.parse(
    'https://huggingface.co/ggml-org/Qwen3-1.7B-GGUF/resolve/main/Qwen3-1.7B-Q4_K_M.gguf',
  ),
  sha256: 'd2387ca2dbfee2ffabce7120d3770dadca0b293052bc2f0e138fdc940d9bc7b5',
  sizeBytes: 1282439264,
  license: 'Apache-2.0',
);

/// Every choice is an explicitly pinned, checksum-verified download.
/// Single private model – renamed from Balanced per feedback (compact/fast removed).
final mindRecipePrivateModelChoices = <OnDeviceModelChoice>[
  OnDeviceModelChoice(
    manifest: mindRecipePrivateModel,
    name: 'Private',
    quality: 'Private on-device guidance',
    bestFor: 'All conversations; stays on this device.',
    memoryNote: '1.2 GB download · needs 8 GB device memory · keep 2.5 GB free',
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
  OnDeviceModelManifest _activeManifest = mindRecipePrivateModel;

  @override
  LocalInferenceSnapshot get snapshot => _snapshot;
  OnDeviceModelManifest get activeModel => _activeManifest;

  Future<bool> isModelDownloaded(OnDeviceModelManifest manifest) async {
    final file = await _modelFile(manifest);
    if (!await file.exists() || await file.length() != manifest.sizeBytes) {
      return false;
    }
    final receipt = await _verificationReceipt(file);
    return await receipt.exists() &&
        await receipt.readAsString() == _receiptContents(manifest);
  }

  Future<Set<String>> downloadedModelIds() async {
    final ids = <String>{};
    for (final choice in mindRecipePrivateModelChoices) {
      if (await isModelDownloaded(choice.manifest)) {
        ids.add(choice.manifest.id);
      }
    }
    return ids;
  }

  Future<LocalInferenceSnapshot> activateModel(
    OnDeviceModelManifest manifest,
  ) async {
    if (!await isModelDownloaded(manifest)) {
      throw StateError('Download this model before selecting it.');
    }
    if (_activeManifest.id != manifest.id) {
      _disposeEngine();
      _activeManifest = manifest;
    }
    _set(const LocalInferenceSnapshot(OnDeviceStatus.checking));
    final result = await refreshStatus();
    if (!result.isReady) {
      throw StateError(result.detail ?? 'The private model could not start.');
    }
    return result;
  }

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
  int get _minimumMemoryMiB => 8192;

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
        for (final choice in mindRecipePrivateModelChoices) {
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
      final device = await MindRecipeDeviceHarness().capabilities();
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
    if (_snapshot.status == OnDeviceStatus.downloading ||
        _snapshot.status == OnDeviceStatus.verifying) {
      throw StateError('Wait for the current private model setup to finish.');
    }
    if (model != null && model.id != _activeManifest.id) {
      _disposeEngine();
      _activeManifest = model;
    }
    if (await isModelDownloaded(_activeManifest)) {
      await activateModel(_activeManifest);
      return;
    }
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
      final client = HttpClient()..autoUncompress = false;
      client.connectionTimeout = const Duration(seconds: 30);
      client.idleTimeout = const Duration(seconds: 60);
      final request = await client.getUrl(_activeManifest.downloadUri);
      request.followRedirects = true;
      request.maxRedirects = 8;
      request.headers.set(
        'User-Agent',
        'MindRecipe/1.0 (Flutter; +https://mindrecipe.app)',
      );
      request.headers.set('Accept', '*/*');
      // Hugging Face / CloudFront returns 304/206 only when Range is valid;
      // keep the partial if the server later stalls – do not delete on retry.
      if (isResume) {
        request.headers.set('Range', 'bytes=$resumeOffset-');
      }
      final response = await request.close().timeout(
        const Duration(minutes: 2),
      );
      // 206 = Partial Content (resume), 200 = OK (fresh), 416 = already complete
      if (response.statusCode == HttpStatus.requestedRangeNotSatisfiable) {
        client.close(force: true);
        await _inferLog(
          'range not satisfiable resumeOffset=$resumeOffset size=${_activeManifest.sizeBytes} – treating as complete',
        );
      } else if (response.statusCode != HttpStatus.ok &&
          response.statusCode != HttpStatus.partialContent) {
        client.close(force: true);
        throw HttpException('Model download returned ${response.statusCode}.');
      }
      // If server ignored Range and returned 200, restart from 0
      if (isResume && response.statusCode == HttpStatus.ok) {
        await _inferLog('server ignored Range – restarting from 0');
        if (await temporary.exists()) await temporary.delete();
        resumeOffset = 0;
        _downloadProgress = 0;
        _downloadedBytes = 0;
        isResume = false;
      }
      final contentLen = response.contentLength;
      final expected = contentLen > 0
          ? (isResume ? resumeOffset + contentLen : contentLen)
          : _activeManifest.sizeBytes;
      // Guard against truncated manifest (e.g. x-linked-size mismatch).
      if (expected > _activeManifest.sizeBytes + 1024) {
        await _inferLog(
          'warn: server expected $expected > manifest ${_activeManifest.sizeBytes} – clamping',
        );
      }
      var received = resumeOffset;
      var lastSampleBytes = received;
      var lastSampleAt = DateTime.now();
      final sink = temporary.openWrite(
        mode: isResume ? FileMode.append : FileMode.write,
      );
      try {
        await for (final bytes in response.timeout(
          const Duration(minutes: 2),
          onTimeout: (sink) => sink.close(),
        )) {
          received += bytes.length;
          sink.add(bytes);
          _downloadProgress = (received / expected).clamp(0.0, 1.0);
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
      } on TimeoutException {
        await _inferLog(
          'download stall timeout after 2 min – received $received/$expected',
        );
        throw TimeoutException(
          'Download stalled for 2 minutes at $received/$expected bytes – check Wi-Fi and try again. Partial kept for resume.',
        );
      }
      await sink.flush();
      await sink.close();
      client.close(force: true);
      final downloadedLen = await temporary.length();
      await _inferLog(
        'download finished $downloadedLen bytes (expected ${_activeManifest.sizeBytes}) – entering verify',
      );
      // If we still have a short file, keep it for resume instead of deleting.
      if (downloadedLen < _activeManifest.sizeBytes) {
        throw HttpException(
          'Download incomplete $downloadedLen/${_activeManifest.sizeBytes} bytes – will resume next time. Keep Wi-Fi on.',
        );
      }
      _set(const LocalInferenceSnapshot(OnDeviceStatus.verifying));
      await _inferLog(
        'verifying download ${temporary.path} ($downloadedLen bytes, expect ${_activeManifest.sizeBytes})',
      );
      // SHA-256 of 1.2 GB on mid-range Android can take 3-6 min with pure Dart crypto.
      // Give 10 min to avoid deleting a good download on slow devices.
      if (!await _matchesManifest(
        temporary,
        _activeManifest,
      ).timeout(const Duration(minutes: 10))) {
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
      final ready = await refreshStatus();
      if (!ready.isReady) {
        throw StateError(
          ready.detail ?? 'The private model could not be started.',
        );
      }
    } catch (error) {
      final isIntegrityError =
          error is FileSystemException &&
          error.message.contains('signed manifest');
      if (isIntegrityError && await temporary.exists()) {
        await _inferLog('integrity failure – deleting corrupted $temporary: $error');
        try {
          await temporary.delete();
        } catch (_) {}
      } else if (await temporary.exists()) {
        final len = await temporary.length();
        await _inferLog('install failed kept partial $len bytes for resume: $error');
        // Keep partial so tab switch / retry can resume via Range.
      }
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
    await removeDownloadedModel(_activeManifest);
  }

  Future<void> removeDownloadedModel(OnDeviceModelManifest manifest) async {
    final removingActive = manifest.id == _activeManifest.id;
    if (removingActive) _disposeEngine();
    final file = await _modelFile(manifest);
    if (await file.exists()) await file.delete();
    final partial = File('${file.path}.partial');
    if (await partial.exists()) await partial.delete();
    final receipt = await _verificationReceipt(file);
    if (await receipt.exists()) await receipt.delete();
    _downloadProgress = 0;
    _downloadedBytes = 0;
    _downloadBytesPerSecond = 0;
    if (!removingActive) return;
    final remaining = await downloadedModelIds();
    if (remaining.isEmpty) {
      _set(const LocalInferenceSnapshot(OnDeviceStatus.notInstalled));
      return;
    }
    final fallback = mindRecipePrivateModelChoices
        .firstWhere((choice) => remaining.contains(choice.manifest.id))
        .manifest;
    _activeManifest = fallback;
    _set(const LocalInferenceSnapshot(OnDeviceStatus.checking));
    await refreshStatus();
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
    // iOS native symbols are linked into the app process. Explicitly reset a
    // path left by another platform/test isolate so DynamicLibrary.process()
    // is used on iPhone and iPad.
    if (Platform.isIOS) Llama.libraryPath = null;
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
        verbose: const bool.fromEnvironment('MIND_RECIPE_LOCAL_VERBOSE'),
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
You are Mind Recipe, a private on-device wellness companion. Understand what the member means in light of the conversation, including short follow-ups such as "yes", "that", or "it". First identify the concrete concern, feeling, event, or request they actually expressed. Then respond directly to that meaning. Ground every reply in a detail the member actually said, without inventing an emotion. Follow the thread forward: when a member answers a question or names a tool such as Google Calendar, explain the next concrete step with that tool instead of repeating the prior suggestion. Do not restart the check-in, repeat a generic greeting, paraphrase every sentence, or force an exercise. Never begin with "You seem to be feeling" or "Thank you for sharing". Never say "It's important to process" or "What would you like to focus on next?" Be warm, specific, and conversational (usually 35 to 100 words). Use at most one genuine question, and make it specific to their words. Never diagnose, prescribe, assess safety, or claim clinical certainty. Treat interpretations as possibilities. If urgent danger is mentioned, encourage contacting local emergency help or 988 in the United States. Never reveal private reasoning or mention internal tools.

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
