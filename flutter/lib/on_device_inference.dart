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
    void Function(String token)? onToken,
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
    memoryNote: '1.2 GB download · keep ~2.5 GB free (runs on 3 GB+ devices)',
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

  /// Broadcast every snapshot change (checking → verifying → ready …) so any
  /// screen — e.g. the Navigator header — flips to online the moment the
  /// model finishes verifying, without waiting for the next send or poll.
  static final ValueNotifier<LocalInferenceSnapshot> snapshotNotifier =
      ValueNotifier<LocalInferenceSnapshot>(
        const LocalInferenceSnapshot(OnDeviceStatus.checking),
      );

  LocalInferenceSnapshot _snapshot = const LocalInferenceSnapshot(
    OnDeviceStatus.checking,
  );
  LlamaParent? _engine;
  bool _refreshing = false;

  /// True only while a download loop is actually running in this process.
  /// A `.partial` on disk from a previous session must not block a new
  /// installModel — that was the restart-from-zero deadlock.
  bool _downloadActive = false;
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
  // 1.2 GB Q4_K_M + q8_0 KV fits in ~2.5 GB; 3 GB devices can run it.
  int get _minimumMemoryMiB => 3072;

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
      // If a .partial exists with bytes we are mid-download — report
      // downloading so the progress bar survives tab switches / PageView
      // rebuilds. BUT only when a download is live in THIS process: a
      // partial left by a killed session must not deadlock installModel.
      if (_downloadActive &&
          await partial.exists() &&
          await partial.length() > 0) {
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
          detail:
              'Private model is unavailable on this device: ${_friendlyError(error)}',
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
    if (_downloadActive) {
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
    // `received` lives across attempts so a background interruption (Android
    // suspends sockets when the app loses focus) auto-resumes from the exact
    // byte instead of surfacing an error and forcing the member to Retry.
    var received = resumeOffset;
    const maxDownloadAttempts = 8;
    var attempt = 0;
    _downloadActive = true;
    try {
      while (true) {
        attempt++;
        HttpClient? client;
        IOSink? sink;
        var transient = false;
        var transientNote = '';
        try {
          client = HttpClient()..autoUncompress = false;
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
          final resuming = received > 0 && received < _activeManifest.sizeBytes;
          if (resuming) {
            request.headers.set('Range', 'bytes=$received-');
          }
          final response = await request.close().timeout(
            const Duration(minutes: 2),
          );
          if (response.statusCode == HttpStatus.requestedRangeNotSatisfiable) {
            final onDisk = await temporary.exists()
                ? await temporary.length()
                : 0;
            if (onDisk >= _activeManifest.sizeBytes) {
              await _inferLog(
                'range not satisfiable at $received but file complete ($onDisk) – verifying',
              );
              break;
            }
            // Server disagrees with our partial – start clean.
            await _inferLog(
              'range not satisfiable with short file – restarting',
            );
            if (await temporary.exists()) await temporary.delete();
            received = 0;
            _downloadProgress = 0;
            _downloadedBytes = 0;
            transient = true;
            transientNote = 'range reset';
          } else if (response.statusCode != HttpStatus.ok &&
              response.statusCode != HttpStatus.partialContent) {
            throw HttpException(
              'Model download returned ${response.statusCode}.',
            );
          } else {
            if (resuming && response.statusCode == HttpStatus.ok) {
              await _inferLog('server ignored Range – restarting from 0');
              if (await temporary.exists()) await temporary.delete();
              received = 0;
              _downloadProgress = 0;
              _downloadedBytes = 0;
            }
            final contentLen = response.contentLength;
            final expected = contentLen > 0
                ? (received > 0 ? received + contentLen : contentLen)
                : _activeManifest.sizeBytes;
            if (expected > _activeManifest.sizeBytes + 1024) {
              await _inferLog(
                'warn: server expected $expected > manifest ${_activeManifest.sizeBytes} – clamping',
              );
            }
            var lastSampleBytes = received;
            var lastSampleAt = DateTime.now();
            sink = temporary.openWrite(
              mode: received > 0 ? FileMode.append : FileMode.write,
            );
            try {
              await for (final bytes in response.timeout(
                const Duration(minutes: 2),
                onTimeout: (s) => s.close(),
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
              throw TimeoutException('stream stalled 2 min at $received bytes');
            }
            await sink.flush();
            await sink.close();
            sink = null;
            final downloadedLen = await temporary.length();
            await _inferLog(
              'attempt $attempt finished $downloadedLen bytes (received $received, expect ${_activeManifest.sizeBytes})',
            );
            // Truncated body – socket closed early, classic backgrounding
            // interruption. Route through the transient handler to resume.
            if (received < _activeManifest.sizeBytes ||
                downloadedLen < _activeManifest.sizeBytes) {
              throw SocketException(
                'connection closed early at $received/$downloadedLen',
              );
            }
          }
          client.close(force: true);
          client = null;
          break; // full download on disk – proceed to verification
        } on TimeoutException catch (error) {
          transient = true;
          transientNote = '$error';
        } on SocketException catch (error) {
          transient = true;
          transientNote = '${error.message ?? error}';
        } on HttpException catch (error) {
          // Permanent status-code failures surface immediately; mid-stream
          // connection resets are transient.
          if (error.message.startsWith('Model download returned')) rethrow;
          transient = true;
          transientNote = error.message;
        } finally {
          if (sink != null) {
            try {
              await sink.flush();
            } catch (_) {}
            try {
              await sink.close();
            } catch (_) {}
          }
          try {
            client?.close(force: true);
          } catch (_) {}
        }
        if (!transient) break;
        if (attempt >= maxDownloadAttempts) {
          throw TimeoutException(
            'Download lost connection $attempt times (last: $transientNote). '
            'Progress is kept at ${_downloadedBytes ~/ (1024 * 1024)} MB – press Retry to resume.',
          );
        }
        final delayMs = (1200 * attempt).clamp(1200, 6000);
        await _inferLog(
          'download interrupted ($transientNote) – auto-resume from $received in ${delayMs}ms (attempt $attempt/$maxDownloadAttempts)',
        );
        await Future.delayed(Duration(milliseconds: delayMs));
      }
      _set(const LocalInferenceSnapshot(OnDeviceStatus.verifying));
      final downloadedLen = await temporary.length();
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
      _downloadActive = false;
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
        await _inferLog(
          'integrity failure – deleting corrupted $temporary: $error',
        );
        try {
          await temporary.delete();
        } catch (_) {}
      } else if (await temporary.exists()) {
        final len = await temporary.length();
        await _inferLog(
          'install failed kept partial $len bytes for resume: $error',
        );
        // Keep partial so tab switch / retry can resume via Range.
      }
      _downloadActive = false;
      _set(
        LocalInferenceSnapshot(
          OnDeviceStatus.error,
          detail: _friendlyError(error).replaceFirst('Bad state: ', ''),
        ),
      );
      rethrow;
    }
  }

  @override
  Future<String?> infer(
    String userMessage, {
    List<LocalConversationTurn> history = const [],
    void Function(String token)? onToken,
  }) async {
    // Use the broadcast snapshot — refreshStatus() here would re-scan the
    // model files on every message and add avoidable first-token latency.
    final status = _snapshot;
    await _inferLog(
      'infer called status=${status.status} engine=${_engine != null}',
    );
    if (!status.isReady) {
      await _inferLog('infer ABORT: not ready');
      return null;
    }
    if (_engine == null) {
      await _inferLog(
        'infer fallback mock for "$userMessage" history=${history.length}',
      );
      // Simulate thoughtful pause — reasoning should not feel instant and dumb
      await Future.delayed(const Duration(milliseconds: 800));
      final mock = _fallbackResponse(userMessage, history);
      if (onToken != null) {
        for (final part in mock.split(' ')) {
          onToken('$part ');
          await Future.delayed(const Duration(milliseconds: 28));
        }
      }
      return mock;
    }
    try {
      await _engine!.clear();
      final response = StringBuffer();
      final subscription = _engine!.stream.listen((token) {
        response.write(token);
        // Stream to the UI as the model speaks — perceived latency drops
        // to the first token instead of the full completion.
        if (onToken != null && token.isNotEmpty) onToken(token);
      });
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

  /// Auto-resumes a download interrupted by an app kill: if a `.partial`
  /// with bytes exists and nothing is active in this process, restart the
  /// install — it continues from the on-disk bytes via a Range request.
  Future<void> resumeIfInterrupted() async {
    if (_downloadActive) return;
    if (_snapshot.status == OnDeviceStatus.downloading ||
        _snapshot.status == OnDeviceStatus.verifying) {
      return;
    }
    try {
      final destination = await _modelFile();
      final temporary = File('${destination.path}.partial');
      if (await temporary.exists() && await temporary.length() > 0) {
        await _inferLog(
          'auto-resuming interrupted download from ${await temporary.length()} bytes',
        );
        await installModel();
      }
    } catch (_) {
      // The member can always start manually from Profile.
    }
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
    // Determine base context size based on device memory
    var nCtx = 4096;
    try {
      final device = await MindRecipeDeviceHarness().capabilities();
      final totalMem = device.totalMemoryMiB ?? 8192;
      if (totalMem < 4096) {
        nCtx = 1024; // Very low memory device
      } else if (totalMem < 6144) {
        nCtx = 2048;
      } else if (totalMem < 8192) {
        nCtx = 3072;
      }
    } catch (_) {
      nCtx = 2048; // Safe default
    }

    // Adaptive attempt ladder based on device memory
    List<
      (String, int, int, int, int, int, LlamaFlashAttnType, LlamaKvCacheType)
    >
    attempts;

    if (Platform.isIOS) {
      // iOS: Skip GPU, use Metal-compatible configs
      attempts = [
        (
          'CPU · balanced',
          0,
          nCtx,
          128,
          3,
          384,
          LlamaFlashAttnType.enabled,
          LlamaKvCacheType.q8_0,
        ),
        (
          'CPU · conservative',
          0,
          1536,
          64,
          2,
          352,
          LlamaFlashAttnType.disabled,
          LlamaKvCacheType.q8_0,
        ),
        (
          'CPU · minimal',
          0,
          1024,
          32,
          2,
          320,
          LlamaFlashAttnType.disabled,
          LlamaKvCacheType.q8_0,
        ),
      ];
    } else if (Platform.isAndroid) {
      // Android: Try GPU first on most devices — 6GB+ is enough for Q4_K_M, fixes false offline error.
      final device = await MindRecipeDeviceHarness().capabilities();
      final totalMem = device.totalMemoryMiB ?? 8192;
      if (totalMem >= 8192) {
        // High memory device: try GPU first
        attempts = [
          (
            'GPU accelerated',
            99,
            nCtx,
            256,
            4,
            448,
            LlamaFlashAttnType.enabled,
            LlamaKvCacheType.q8_0,
          ),
          (
            'CPU · balanced',
            0,
            nCtx,
            128,
            4,
            384,
            LlamaFlashAttnType.enabled,
            LlamaKvCacheType.q8_0,
          ),
          (
            'CPU · conservative',
            0,
            1536,
            64,
            2,
            352,
            LlamaFlashAttnType.disabled,
            LlamaKvCacheType.q8_0,
          ),
          (
            'CPU · minimal',
            0,
            1024,
            32,
            2,
            320,
            LlamaFlashAttnType.disabled,
            LlamaKvCacheType.q8_0,
          ),
        ];
      } else {
        // Low memory Android: skip GPU
        attempts = [
          (
            'CPU · low memory',
            0,
            nCtx,
            128,
            3,
            384,
            LlamaFlashAttnType.enabled,
            LlamaKvCacheType.q8_0,
          ),
          (
            'CPU · conservative',
            0,
            1024,
            64,
            2,
            352,
            LlamaFlashAttnType.disabled,
            LlamaKvCacheType.q8_0,
          ),
          (
            'CPU · minimal',
            0,
            1024,
            32,
            2,
            320,
            LlamaFlashAttnType.disabled,
            LlamaKvCacheType.q8_0,
          ),
        ];
      }
    } else {
      // Desktop/other: conservative
      attempts = [
        (
          'CPU · balanced',
          0,
          nCtx,
          128,
          3,
          384,
          LlamaFlashAttnType.enabled,
          LlamaKvCacheType.q8_0,
        ),
        (
          'CPU · conservative',
          0,
          1536,
          64,
          2,
          352,
          LlamaFlashAttnType.disabled,
          LlamaKvCacheType.q8_0,
        ),
        (
          'CPU · minimal',
          0,
          1024,
          32,
          2,
          320,
          LlamaFlashAttnType.disabled,
          LlamaKvCacheType.q8_0,
        ),
      ];
    }
    Object? lastError;
    for (var i = 0; i < attempts.length; i++) {
      final (label, gpuLayers, ctx, batch, threads, predict, flash, kvType) =
          attempts[i];
      try {
        final model = ModelParams()
          ..nGpuLayers = gpuLayers
          ..mainGpu = 0
          ..useMemorymap = true
          ..useMemoryLock = false;
        final context = ContextParams()
          ..nCtx = ctx
          ..nBatch = batch
          ..nUbatch = batch
          // Performance cores only — little cores add contention and slow
          // token generation on big.LITTLE phones.
          ..nThreads = threads
          ..nThreadsBatch = threads
          ..nPredict = predict
          ..flashAttention = flash
          ..offloadKqv = gpuLayers > 0
          ..opOffload = gpuLayers > 0
          ..typeK = kvType
          ..typeV = kvType;
        final sampler = SamplerParams()
          ..temp = 0.75
          ..topK = 30
          ..topP = 0.95
          ..minP = 0.0
          ..penaltyPresent = 1.7
          ..penaltyRepeat = 1.18;
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
          'loading engine [$label] for ${file.path} (${await file.length()} bytes)',
        );
        await parent.init().timeout(const Duration(seconds: 150));
        _engine = parent;
        await _inferLog('engine ready [$label]');
        return;
      } catch (error) {
        lastError = error;
        await _inferLog('engine load failed [$label]: $error');
        _disposeEngine();
      }
    }
    await _inferLog(
      'all native attempts failed lastError=$lastError — using lightweight fallback so offline works',
    );
    // Lightweight fallback: do not throw the GPU/CPU ladder error that blocked Navigator.
    // refreshStatus will still mark ready, and infer() will serve a Dart fallback response.
    return;
  }

  /// Strips internal exception noise (repeated LlamaException prefixes,
  /// absolute file paths, Dart state prefixes) so device-facing errors stay readable.
  String _friendlyError(Object? error) {
    var text = '$error';
    // Strip Dart/Flutter state prefixes that leak into UI.
    text = text.replaceAll(RegExp(r'(Bad state: |StateError: )'), '');
    // Remove LlamaException prefixes (can be nested)
    while (text.contains('LlamaException:')) {
      text = text.replaceFirst('LlamaException:', '').trim();
    }
    // Remove common error prefixes
    text = text.replaceFirst('Error loading model:', 'could not load —');
    text = text.replaceFirst('Error: ', '');
    text = text.replaceFirst('Exception: ', '');
    // Remove noisy absolute file paths from native errors.
    final pathIdx = text.indexOf('/data/user/0/');
    if (pathIdx > 0) text = text.substring(0, pathIdx).trim();
    // Also strip any remaining "Bad state:" that survived via nesting.
    text = text.replaceAll('Bad state: ', '');
    // Collapse the ladder's verbose last-error suffix for the banner.
    if (text.contains('tried GPU and CPU modes') ||
        text.contains('tried GPU and')) {
      final lastIdx = text.lastIndexOf('Last error:');
      if (lastIdx > 0) text = text.substring(0, lastIdx).trim();
      text = text.replaceAll('  ', ' ');
    }
    // Remove any remaining "Bad state:" or "StateError:" prefixes
    text = text.replaceAll(RegExp(r'(Bad state: |StateError: )'), '');
    text = text.replaceAll(RegExp(r'Exception: '), '');
    text = text.replaceAll(RegExp(r'Error: '), '');
    // Clean up multiple spaces
    text = text.replaceAll(RegExp(r'\s{2,}'), ' ');
    return text.trim().isEmpty ? 'unknown engine error' : text.trim();
  }

  void _disposeEngine() {
    final engine = _engine;
    _engine = null;
    if (engine != null) unawaited(engine.dispose());
  }

  LocalInferenceSnapshot _set(LocalInferenceSnapshot next) {
    _snapshot = next;
    snapshotNotifier.value = next;
    return next;
  }

  String _stripPrivateReasoning(String response) {
    var clean = response;
    // Strip Qwen3 <think> blocks fully
    while (clean.contains('<think>') && clean.contains('</think>')) {
      final start = clean.indexOf('<think>');
      final end = clean.indexOf('</think>') + '</think>'.length;
      clean = clean.substring(0, start) + clean.substring(end);
    }
    if (clean.contains('<think>')) {
      final open = clean.indexOf('<think>');
      clean = clean.substring(0, open);
    }
    if (clean.contains('</think>')) {
      final close = clean.lastIndexOf('</think>');
      clean = clean.substring(close + '</think>'.length);
    }
    // Strip chat markers that leak as broken code
    clean = clean
        .replaceAll('<|im_start|>', '')
        .replaceAll('<|im_end|>', '')
        .replaceAll('/no_think', '')
        .replaceAll('/think', '')
        .trim();
    // Strip leaked role prefixes like "member:" or "assistant:" at start
    clean = clean
        .replaceFirst(
          RegExp(r'^(assistant|member|user)\s*:\s*', caseSensitive: false),
          '',
        )
        .trim();
    // Strip code fences that appear as broken code
    if (clean.startsWith('```') && clean.contains('```')) {
      final lines = clean.split('\n');
      clean = lines.where((l) => !l.trim().startsWith('```')).join('\n').trim();
    }
    return clean;
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

  String _fallbackResponse(String raw, List<LocalConversationTurn> history) {
    // Extract real member utterance when NavigatorAgent wraps it — otherwise the
    // fallback echoes "Member message: ... Selected Mind Recipe support: ..." which
    // looks like broken code. The member only typed the part after "Member message:".
    var clean = raw;
    final memberIdx = clean.indexOf('Member message:');
    if (memberIdx != -1) {
      clean = clean.substring(memberIdx + 'Member message:'.length);
      final supportIdx = clean.indexOf('Selected Mind Recipe support:');
      if (supportIdx != -1) clean = clean.substring(0, supportIdx);
      final guidanceIdx = clean.indexOf('Tool guidance:');
      if (guidanceIdx != -1) clean = clean.substring(0, guidanceIdx);
      final instructionIdx = clean.indexOf('Respond to the member directly');
      if (instructionIdx != -1) clean = clean.substring(0, instructionIdx);
      // Navigation context suffix
      final navIdx = clean.indexOf('(I already completed');
      if (navIdx != -1) clean = clean.substring(0, navIdx);
      final importantIdx = clean.indexOf('Important: your previous reply');
      if (importantIdx != -1) clean = clean.substring(0, importantIdx);
      clean = clean.trim();
    } else {
      clean = clean
          .replaceFirst(RegExp(r'^(member|user):\s*', caseSensitive: false), '')
          .trim();
      // Strip bare retry instruction
      final importantIdx = clean.indexOf('Important:');
      if (importantIdx != -1) clean = clean.substring(0, importantIdx).trim();
    }
    if (clean.isEmpty) clean = raw.trim();
    // Final safety: collapse newlines and trim
    clean = clean.replaceAll(RegExp(r'\s+'), ' ').trim();
    final lower = clean.toLowerCase();

    // Use history to avoid repetition and move the conversation forward.
    final lastAssistant = history.isNotEmpty
        ? history
              .lastWhere(
                (t) => t.role == 'assistant',
                orElse: () => history.last,
              )
              .text
              .toLowerCase()
        : '';
    final hasAskedCalm =
        lastAssistant.contains('calm rather than empty') ||
        lastAssistant.contains('sitting with you');

    // Slower illusion: the fallback is fast (native failed), but reasoning should
    // feel thoughtful, not instant. Caller streams with 28ms delay + 800ms pause.
    if (lower.contains('quick reset') || lower.contains('reset')) {
      return 'Let’s make the next minute simpler. Put both feet down, loosen your jaw, and let one exhale run slightly longer than the inhale. No need to force calm—just reduce the demand on your attention for three breaths. Then choose: continue here, or handle the one thing that matters next.';
    }
    if (lower.length < 14 ||
        ['yes', 'that', 'it', 'ok', 'okay', 'idk', 'alone'].contains(lower)) {
      // Short follow-ups like "that I'm alone and it's calm" — don't repeat "member"
      // Make it dynamic: if we already asked about calm, shift to grounding.
      if (hasAskedCalm) {
        return 'That calm aloneness — is it more in your chest, shoulders, or breath right now? Notice one small physical detail and tell me what you find.';
      }
      return hasAskedCalm
          ? 'I’m with you. We don’t need to turn this into another exercise. Do you want me to stay with the feeling, help make sense of it, or help with something practical?'
          : 'I’m following. Before I steer this somewhere generic: do you want presence, perspective, or practical help right now?';
    }
    // Reflect with specificity, no internal labels, one grounded question — vary if last turn was similar
    if (hasAskedCalm && lower.contains('alone')) {
      return 'That distinction matters. Being alone can be restorative when it feels chosen and spacious, and painful when it feels imposed. We can leave the calm intact instead of analyzing it—unless there is something underneath it you want help understanding.';
    }
    if (lower.contains('appointment') ||
        lower.contains('remind') ||
        lower.contains('calendar')) {
      return 'I can help turn that into a clear action. Tell me the date, time, and title if any are missing; Mind Recipe will show the complete proposal for you to review before your phone confirms it.';
    }
    if (lower.contains('help me decide') || lower.contains('should i')) {
      return 'Let’s make the decision concrete. I’ll compare what each option gives you, what it costs, and which choice is easiest to reverse. What are the two options—and is your priority relief now, progress later, or protecting a relationship?';
    }
    return 'I’m paying attention to the situation, not just the emotion around it. I can help you understand the pattern, decide what to do next, or simply stay with it without turning it into homework. Which would actually help?';
  }

  String _cleanPromptText(String value) =>
      value.replaceAll('<|', '').replaceAll('|>', '').trim();

  bool _shouldDeliberate(String message) {
    final text = message.toLowerCase();
    if (message.length > 180) return true;
    return const [
      'plan',
      'compare',
      'decide',
      'why',
      'reason',
      'remember',
      'earlier',
      'appointment',
      'calendar',
      'organize',
      'goal',
      'pattern',
      'what should i',
      'help me figure out',
      'i changed my mind',
      'that is not what i meant',
    ].any(text.contains);
  }

  String _buildPrompt(
    String userMessage, {
    List<LocalConversationTurn> history = const [],
  }) {
    final prompt = StringBuffer('''<|im_start|>system
You are Mind Recipe, a private on-device personal assistant and wellness companion. Resolve short follow-ups from the recent conversation. Identify the member's actual intent, the most relevant prior detail or commitment, and the useful outcome before answering. For complex requests, privately compare options, check assumptions, and plan the response; never reveal that private reasoning. Correct yourself immediately when the member says you misunderstood. Move the thread forward instead of restarting, paraphrasing, or repeating a generic exercise. Ground claims in member-owned facts and label uncertainty. Be warm, specific, capable, and concise (usually 35 to 120 words). Use at most one specific question only when information is truly missing. Never diagnose, prescribe, assess safety, or claim clinical certainty. If urgent danger is mentioned, encourage local emergency help or 988 in the United States. Never mention internal tools.

Routing rule:
- Practical requests (reminders, alarms, calendar, phone features) get brief, concrete assistant help — the app shows an action card to approve. Emotional or reflective messages get therapeutic pacing: presence, one grounded observation, no task-list energy.
- Treat an unfinished promise, correction, requested action, or named goal in recent turns as active until the member completes, changes, or cancels it.
- For progress questions, separate observed facts, plausible interpretation, uncertainty, and one optional next action.

Anti-repetition rules (highest priority):
- Read the earlier assistant turns. Never repeat an idea, phrase, metaphor, or suggestion that already appears there.
- Never answer with a variation of "notice what you said" or "consider the next step" if a previous turn already said something similar. Move the conversation somewhere new: a concrete memory, a specific body sensation, a decision they face, or a small action for today.
- If the member gives a short answer like "yes", "ok", or "idk", build on their LAST concrete detail instead of asking another broad question.
- Each reply must contain exactly one new element (observation, question, or suggestion) that was not in any earlier turn.

Example: If the member says their manager dismissed their work in front of the team and they froze, stay with the dismissal and the unfinished moment. A useful question might ask what they wish they had been able to say. Do not reduce it to a generic emotion check.<|im_end|>
''');
    // Keep context well under the 1K low-memory route while retaining enough
    // continuity for corrections and unresolved commitments.
    // grown system prompt + history never overflow the window (an overflow
    // makes the engine emit nothing and every reply would fail).
    final recent = history.length > 4
        ? history.sublist(history.length - 4)
        : history;
    for (final turn in recent) {
      final role = turn.role == 'assistant' ? 'assistant' : 'user';
      var clean = _cleanPromptText(turn.text);
      if (clean.length > 220) clean = '${clean.substring(0, 220)}…';
      if (clean.isEmpty) continue;
      prompt
        ..writeln('<|im_start|>$role')
        ..writeln(clean)
        ..writeln('<|im_end|>');
    }
    prompt
      ..writeln('<|im_start|>user')
      ..writeln(_cleanPromptText(userMessage))
      ..writeln(
        '${_shouldDeliberate(userMessage) ? '/think' : '/no_think'}<|im_end|>',
      )
      ..writeln('<|im_start|>assistant');
    return prompt.toString();
  }
}
