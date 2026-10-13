/// Private, on-device inference for MindRecipe.
///
/// A model is never treated as installed until its full SHA-256 digest matches
/// the pinned manifest and the local engine has successfully loaded it.
library;

import 'dart:async';
import 'dart:isolate';
import 'dart:io';

import 'package:crypto/crypto.dart';
import 'package:flutter/foundation.dart';
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
  initializing,
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
    String? rawMemberMessage,
  });
  Future<void> removeModel();
}

class LocalConversationTurn {
  const LocalConversationTurn({required this.role, required this.text});

  final String role;
  final String text;
}

/// Model-specific serialization with real alternating turns, not a fabricated
/// acknowledgement. Keep the newest answers intact within a bounded budget.
/// Native tokenization adds BOS, including for Gemma; do not add a second BOS.
@visibleForTesting
String mindRecipeBuildPrivatePrompt(
  String message, {
  List<LocalConversationTurn> history = const [],
  required PrivatePromptFormat format,
  bool thinking = false,
}) {
  const instruction =
      'You are Mind Nav, a private assistant. Answer the latest request directly '
      'in its requested format. Use the conversation: follow-ups refer to the '
      'latest relevant answer, and user corrections override older details. '
      'Ask only when needed. Do not invent memory or completed phone actions. '
      'Actions need approval. Never diagnose or prescribe; immediate danger '
      'needs emergency help.';
  String clean(String value) => value
      .replaceAll(
        RegExp(r'<\|[^>]*\|>|<start_of_turn>|<end_of_turn>|<bos>|<eos>'),
        '',
      )
      .trim();
  final recent = <LocalConversationTurn>[];
  var remaining = 1800;
  for (final turn in history.reversed) {
    if (turn.role != 'user' && turn.role != 'assistant') continue;
    final text = clean(turn.text);
    if (text.isEmpty) continue;
    // Do not truncate a short result/name/correction after an arbitrary 220
    // characters. Drop older whole turns first. A single oversized turn keeps
    // its beginning and end, explicitly marked as incomplete.
    if (text.length > remaining && recent.isNotEmpty) break;
    final bounded = text.length <= remaining
        ? text
        : '${text.substring(0, remaining ~/ 2)}\n[earlier turn shortened]\n${text.substring(text.length - remaining ~/ 2)}';
    recent.insert(0, LocalConversationTurn(role: turn.role, text: bounded));
    remaining -= bounded.length;
    if (remaining < 100 || recent.length == 6) break;
  }
  // Gemma expects user/model alternation; do not start with an orphan answer.
  while (recent.isNotEmpty && recent.first.role != 'user') {
    recent.removeAt(0);
  }
  final turns = <LocalConversationTurn>[];
  for (final turn in [
    ...recent,
    LocalConversationTurn(role: 'user', text: clean(message)),
  ]) {
    if (turns.isNotEmpty && turns.last.role == turn.role) {
      final previous = turns.removeLast();
      turns.add(
        LocalConversationTurn(
          role: turn.role,
          text: '${previous.text}\n\n${turn.text}',
        ),
      );
    } else {
      turns.add(turn);
    }
  }
  final prompt = StringBuffer();
  if (format == PrivatePromptFormat.gemmaTurns) {
    for (var i = 0; i < turns.length; i++) {
      final turn = turns[i];
      prompt.write(
        '<start_of_turn>${turn.role == 'assistant' ? 'model' : 'user'}\n',
      );
      if (i == 0) prompt.write('$instruction\n\n');
      prompt.write('${turn.text}<end_of_turn>\n');
    }
    prompt.write('<start_of_turn>model\n');
  } else {
    prompt.write('<|im_start|>system\n$instruction<|im_end|>\n');
    for (var i = 0; i < turns.length; i++) {
      final turn = turns[i];
      prompt.write('<|im_start|>${turn.role}\n${turn.text}');
      if (i == turns.length - 1)
        prompt.write(thinking ? '\n/think' : '\n/no_think');
      prompt.write('<|im_end|>\n');
    }
    prompt.write(mindRecipeQwenAssistantPrefix(thinking: thinking));
  }
  return prompt.toString();
}

class OnDeviceModelManifest {
  const OnDeviceModelManifest({
    required this.id,
    required this.version,
    required this.downloadUri,
    required this.sha256,
    required this.sizeBytes,
    required this.license,
    required this.promptFormat,
    this.licenseUrl,
  });

  final String id;
  final String version;
  final Uri downloadUri;
  final String sha256;
  final int sizeBytes;
  final String license;
  final PrivatePromptFormat promptFormat;
  final Uri? licenseUrl;
}

enum PrivatePromptFormat { qwenChatMl, gemmaTurns }

/// llama.cpp requires a negative GPU index when a model is intentionally
/// CPU-only. Passing its default index (0) with no GPU backend makes model
/// loading fail before the GGUF is opened.
@visibleForTesting
int mindRecipeMainGpuForLayers(int gpuLayers) => gpuLayers > 0 ? 0 : -1;

@visibleForTesting
int mindRecipeLogicalPromptBatch(int contextTokens) => contextTokens;

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
  promptFormat: PrivatePromptFormat.qwenChatMl,
);

final mindRecipeGemmaModel = OnDeviceModelManifest(
  id: 'mindrecipe-private-gemma-2-2b-it-q4km',
  version: '376e68d-gemma-2-2b-it-q4km',
  downloadUri: Uri.parse(
    'https://huggingface.co/unsloth/gemma-2-it-GGUF/resolve/376e68d898472a1d44856c7d7de68c7fa65b1e65/unsloth/gemma-2-2b-it.q4_k_m.gguf',
  ),
  sha256: '57bf98ab6b26e40f1d69f36cb1202af8b0c1b4e6b50ec2631d576f76cdaac9d6',
  sizeBytes: 1708582464,
  license: 'Gemma terms',
  licenseUrl: Uri.parse('https://ai.google.dev/gemma/terms'),
  promptFormat: PrivatePromptFormat.gemmaTurns,
);

/// Every choice is an explicitly pinned, checksum-verified download.
final mindRecipePrivateModelChoices = <OnDeviceModelChoice>[
  OnDeviceModelChoice(
    manifest: mindRecipePrivateModel,
    name: 'Qwen 3 1.7B',
    quality: 'Private on-device guidance',
    bestFor: 'All conversations; stays on this device.',
    memoryNote: '1.2 GB download · keep ~2.5 GB free (runs on 3 GB+ devices)',
    recommended: true,
  ),
  OnDeviceModelChoice(
    manifest: mindRecipeGemmaModel,
    name: 'Gemma 2 2B',
    quality: 'Private on-device guidance',
    bestFor: 'A deeper private conversation when your device has room.',
    memoryNote: '1.71 GB download · device capability check required',
  ),
];

/// Computes the digest outside Flutter's UI isolate. A complete model check is
/// intentionally required before a model can run, but it must never freeze the
/// member-facing experience while it is happening.
Future<String> _sha256ForFile(String path) async {
  final digest = await sha256.bind(File(path).openRead()).first;
  return digest.toString().toLowerCase();
}

@visibleForTesting
bool mindRecipeShouldDeliberate(String message) {
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

/// Qwen's visible thinking tokens consume most of the small generation budget
/// on low-memory phones. Keep deliberate generation for capable devices while
/// preserving the answer budget on the 3–4 GB class.
@visibleForTesting
bool mindRecipeShouldEmitThinking({
  required bool deliberationRequested,
  required int totalMemoryMiB,
}) => deliberationRequested && totalMemoryMiB >= 6144;

/// Match Qwen's official enable_thinking=false generation prefix. The empty
/// block is prompt text, not generated content to show to the member.
@visibleForTesting
String mindRecipeQwenAssistantPrefix({required bool thinking}) =>
    '<|im_start|>assistant\n${thinking ? '' : '<think>\n\n</think>\n\n'}';

/// Returns only member-visible model output while a private response is still
/// arriving. Qwen may emit an empty or populated `<think>` block even when the
/// prompt requests `/no_think`; forwarding raw engine tokens would briefly
/// expose that private scratchpad in Navigator. Incomplete tag prefixes are
/// held back so a chunk boundary such as `<thi` cannot flash in the UI.
@visibleForTesting
String mindRecipeVisiblePrivateStreamText(String response) {
  var clean = response;
  while (clean.contains('<think>') && clean.contains('</think>')) {
    final start = clean.indexOf('<think>');
    final end = clean.indexOf('</think>') + '</think>'.length;
    clean = clean.substring(0, start) + clean.substring(end);
  }
  if (clean.contains('<think>')) {
    clean = clean.substring(0, clean.indexOf('<think>'));
  }
  if (clean.contains('</think>')) {
    clean = clean.substring(clean.lastIndexOf('</think>') + '</think>'.length);
  }

  // Do not publish a suffix that could become a control tag when the next
  // native token arrives.
  const markers = <String>['<think>', '</think>', '<|im_start|>', '<|im_end|>'];
  for (final marker in markers) {
    for (
      var prefixLength = marker.length - 1;
      prefixLength > 0;
      prefixLength--
    ) {
      final prefix = marker.substring(0, prefixLength);
      if (clean.endsWith(prefix)) {
        clean = clean.substring(0, clean.length - prefixLength);
        break;
      }
    }
  }

  return clean
      .replaceAll('<|im_start|>', '')
      .replaceAll('<|im_end|>', '')
      .replaceAll('/no_think', '')
      .replaceAll('/think', '')
      .replaceFirst(
        RegExp(r'^(assistant|member|user)\s*:\s*', caseSensitive: false),
        '',
      )
      .trim();
}

/// Accept a complete model file even when the app was killed before it wrote
/// its receipt. This is also what makes a locally staged live-test artifact
/// follow the same full checksum path as a network download.
@visibleForTesting
Future<bool> mindRecipeVerifyExistingModelFile(
  File file,
  OnDeviceModelManifest manifest,
) async {
  if (!await file.exists() || await file.length() != manifest.sizeBytes) {
    return false;
  }
  final receipt = File('${file.path}.verified');
  final expectedReceipt =
      '${manifest.version}:${manifest.sizeBytes}:${manifest.sha256}';
  if (await receipt.exists() &&
      await receipt.readAsString() == expectedReceipt) {
    return true;
  }
  final digest = await Isolate.run(() => _sha256ForFile(file.path));
  if (digest != manifest.sha256) return false;
  await receipt.writeAsString(expectedReceipt, flush: true);
  return true;
}

class OnDeviceInference implements LocalInference {
  static final OnDeviceInference _instance = OnDeviceInference._();
  factory OnDeviceInference() => _instance;
  OnDeviceInference._() : _supportDirectoryOverride = null;

  @visibleForTesting
  OnDeviceInference.forTesting({
    required Future<Directory> Function() supportDirectory,
  }) : _supportDirectoryOverride = supportDirectory;

  final Future<Directory> Function()? _supportDirectoryOverride;
  Future<Directory> _supportDirectory() =>
      _supportDirectoryOverride?.call() ?? getApplicationSupportDirectory();
  bool _modelMutationActive = false;

  // A model's file, manifest and engine must move together. Pollers may read
  // the current snapshot during installation, but may not select another file.
  Future<T> _withModelMutation<T>(Future<T> Function() operation) async {
    if (_modelMutationActive) {
      throw StateError('Wait for the current private model setup to finish.');
    }
    _modelMutationActive = true;
    try {
      await _restoreActiveSelection();
      if (_refreshing) await _refreshCompleter?.future;
      return await operation();
    } finally {
      _modelMutationActive = false;
    }
  }

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
  Completer<LocalInferenceSnapshot>? _refreshCompleter;

  /// True only while a download loop is actually running in this process.
  /// A `.partial` on disk from a previous session must not block a new
  /// installModel — that was the restart-from-zero deadlock.
  bool _downloadActive = false;
  OnDeviceModelManifest _activeManifest = mindRecipePrivateModel;
  bool _thinkingAllowed = false;

  @override
  LocalInferenceSnapshot get snapshot => _snapshot;
  OnDeviceModelManifest get activeModel => _activeManifest;
  String get activeModelDisplayName =>
      _activeManifest.id.contains('gemma') ? 'Gemma 2 2B' : 'Qwen3 1.7B';

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
  ) => _withModelMutation(() => _activateModel(manifest));

  Future<LocalInferenceSnapshot> _activateModel(
    OnDeviceModelManifest manifest,
  ) async {
    if (!await isModelDownloaded(manifest)) {
      throw StateError('Download this model before selecting it.');
    }
    if (_activeManifest.id != manifest.id) {
      _disposeEngine();
      _activeManifest = manifest;
      await _persistActiveSelection();
    }
    _set(const LocalInferenceSnapshot(OnDeviceStatus.checking));
    final result = await _refreshStatus(fromMutation: true);
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
  Future<File> _modelFile([OnDeviceModelManifest? manifest]) async {
    final target = manifest ?? _activeManifest;
    // The disposable live-check package can exercise the native runtime with
    // a model staged by ADB. Production builds never enable this compile-time
    // flag and always use private application storage below.
    if (Platform.isAndroid &&
        const bool.fromEnvironment('MIND_RECIPE_EXTERNAL_MODEL_TEST')) {
      final external = await getExternalStorageDirectory();
      if (external != null) {
        final staged = File('${external.path}/${target.id}.gguf');
        if (await staged.exists()) return staged;
      }
    }
    final base = await _supportDirectory();
    final directory = Directory('${base.path}/private-models');
    if (!await directory.exists()) await directory.create(recursive: true);
    return File('${directory.path}/${target.id}.gguf');
  }

  Future<void>? _activeSelectionLoad;

  Future<File> _activeModelMarker() async {
    final base = await _supportDirectory();
    return File('${base.path}/private-models/active-model.txt');
  }

  Future<void> _restoreActiveSelection() => _activeSelectionLoad ??=
      _readActiveSelection().catchError((Object error, StackTrace stack) {
        _activeSelectionLoad = null;
        Error.throwWithStackTrace(error, stack);
      });

  Future<void> _readActiveSelection() async {
    final marker = await _activeModelMarker();
    if (!await marker.exists()) return;
    final id = (await marker.readAsString()).trim();
    for (final choice in mindRecipePrivateModelChoices) {
      if (choice.manifest.id == id) {
        _activeManifest = choice.manifest;
        return;
      }
    }
  }

  Future<void> _persistActiveSelection() async {
    await (await _activeModelMarker()).writeAsString(
      _activeManifest.id,
      flush: true,
    );
  }

  Future<File> _verificationReceipt(File model) async =>
      File('${model.path}.verified');

  String _receiptContents(OnDeviceModelManifest manifest) =>
      '${manifest.version}:${manifest.sizeBytes}:${manifest.sha256}';

  @override
  Future<LocalInferenceSnapshot> refreshStatus() => _refreshStatus();

  Future<LocalInferenceSnapshot> _refreshStatus({
    bool fromMutation = false,
  }) async {
    await _restoreActiveSelection();
    if (_modelMutationActive && !fromMutation) return _snapshot;
    // A loaded engine is already the authoritative capability check. Re-running
    // the file verifier for every app-wide readiness poll briefly published
    // `verifying` and `initializing`, which made Navigator visibly oscillate
    // between online and offline even though the native engine never stopped.
    if (_snapshot.isReady && _engine != null) return _snapshot;
    if (_refreshing) {
      // Activation and the Settings poller can request status at the same
      // time. Returning the transient `verifying`/`initializing` snapshot made
      // activateModel report failure even though the first refresh completed
      // moments later. Join that exact refresh without polling timers.
      return _refreshCompleter?.future ?? _snapshot;
    }
    // Do not clobber an active download/verify — the UI timer polls this
    // every 500ms and would otherwise reset `downloading` → `notInstalled`
    // while the .partial file is still being written (tab switch bug).
    // Also guard when a download loop is active in this process — concurrent
    // refreshes during installModel's 10-min hash would otherwise clobber
    // `verifying` back to `downloading` and lose the verify state.
    if (_snapshot.status == OnDeviceStatus.downloading ||
        _downloadActive ||
        ((_snapshot.status == OnDeviceStatus.verifying ||
                _snapshot.status == OnDeviceStatus.initializing) &&
            _refreshing)) {
      return _snapshot;
    }
    _refreshing = true;
    final completer = Completer<LocalInferenceSnapshot>();
    _refreshCompleter = completer;
    try {
      final manifest = _activeManifest;
      final file = await _modelFile(manifest);
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
      _set(const LocalInferenceSnapshot(OnDeviceStatus.verifying));
      await _inferLog('verifying ${file.path}');
      // SHA-256 of 1.2 GB on mid-range Android can take 3-6 min with pure Dart
      // crypto — 4 min is too tight and flakes as "never passes verification".
      if (!await _matchesManifest(
        file,
        manifest,
      ).timeout(const Duration(minutes: 10))) {
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
      _set(
        LocalInferenceSnapshot(
          OnDeviceStatus.initializing,
          detail:
              'Preparing ${_activeManifest.id.contains('gemma') ? 'Gemma' : 'Qwen'} for this device…',
        ),
      );
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
      if (!completer.isCompleted) completer.complete(_snapshot);
      if (identical(_refreshCompleter, completer)) _refreshCompleter = null;
    }
  }

  @override
  Future<void> installModel({
    bool allowCellular = false,
    OnDeviceModelManifest? model,
  }) => _withModelMutation(
    () => _installModel(allowCellular: allowCellular, model: model),
  );

  Future<void> _installModel({
    bool allowCellular = false,
    OnDeviceModelManifest? model,
  }) async {
    if (_downloadActive) {
      throw StateError('Wait for the current private model setup to finish.');
    }
    if (model != null && model.id != _activeManifest.id) {
      _disposeEngine();
      _activeManifest = model;
      await _persistActiveSelection();
    }
    if (await isModelDownloaded(_activeManifest)) {
      await _activateModel(_activeManifest);
      return;
    }
    final destination = await _modelFile();
    // A complete destination without a receipt means download promotion
    // finished but the process died before receipt persistence. Verify it in
    // place instead of silently starting another 1–2 GB download.
    if (await destination.exists() &&
        await destination.length() == _activeManifest.sizeBytes) {
      _downloadActive = true;
      try {
        _set(const LocalInferenceSnapshot(OnDeviceStatus.verifying));
        await _inferLog(
          'verifying complete existing model ${destination.path}',
        );
        final valid = await _matchesManifest(
          destination,
          _activeManifest,
        ).timeout(const Duration(minutes: 10));
        if (valid) {
          await _persistActiveSelection();
          _downloadActive = false;
          _set(const LocalInferenceSnapshot(OnDeviceStatus.checking));
          final ready = await _refreshStatus(fromMutation: true);
          if (!ready.isReady) {
            throw StateError(
              ready.detail ?? 'The private model could not be started.',
            );
          }
          return;
        }
        await _inferLog('existing model hash mismatch – replacing download');
        final staleReceipt = await _verificationReceipt(destination);
        if (await staleReceipt.exists()) await staleReceipt.delete();
        await destination.delete();
      } finally {
        _downloadActive = false;
      }
    }
    // Connectivity policy is owned by the caller; this method remains explicit
    // about the requested cellular permission for the future scheduler.
    _set(const LocalInferenceSnapshot(OnDeviceStatus.downloading));
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
      // A complete .partial left by an interrupted verify (app killed after
      // the 1.2 GB stream finished but before rename) must not be re-GET in
      // append mode — that doubles the file and fails verification forever.
      if (resumeOffset < _activeManifest.sizeBytes) {
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
            final resuming =
                received > 0 && received < _activeManifest.sizeBytes;
            if (resuming) {
              request.headers.set('Range', 'bytes=$received-');
            }
            final response = await request.close().timeout(
              const Duration(minutes: 2),
            );
            if (response.statusCode ==
                HttpStatus.requestedRangeNotSatisfiable) {
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
                        ((received - lastSampleBytes) * 1000 / elapsedMs)
                            .round();
                    lastSampleBytes = received;
                    lastSampleAt = now;
                  }
                }
              } on TimeoutException {
                throw TimeoutException(
                  'stream stalled 2 min at $received bytes',
                );
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
      } else {
        await _inferLog(
          'complete partial already on disk (${resumeOffset} bytes) — verifying',
        );
      }
      // Defensive: a prior append-corruption could have left a >size file;
      // truncate to the manifest size so verification can pass.
      final preVerifyLen = await temporary.length();
      if (preVerifyLen > _activeManifest.sizeBytes) {
        await _inferLog(
          'truncating over-size partial $preVerifyLen → ${_activeManifest.sizeBytes}',
        );
        final raf = await temporary.open(mode: FileMode.write);
        await raf.truncate(_activeManifest.sizeBytes);
        await raf.close();
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
      // The download itself is complete once the verified file and receipt
      // have been promoted. Clear this guard before asking refreshStatus to
      // initialize the engine; otherwise refreshStatus returns the transient
      // `checking` snapshot immediately and every fresh install is reported as
      // failed even though the model on disk is valid.
      _downloadActive = false;
      _set(const LocalInferenceSnapshot(OnDeviceStatus.checking));
      final ready = await _refreshStatus(fromMutation: true);
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
    String? rawMemberMessage,
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
      await _inferLog('infer ABORT: engine unavailable despite ready status');
      _set(
        const LocalInferenceSnapshot(
          OnDeviceStatus.error,
          detail: 'The private model could not start on this device.',
        ),
      );
      return null;
    }
    StreamSubscription<String>? subscription;
    final timer = Stopwatch()..start();
    var firstVisibleLogged = false;
    try {
      await _engine!.clear();
      final response = StringBuffer();
      var emittedVisible = '';
      subscription = _engine!.stream.listen((token) {
        response.write(token);
        // Stream only the monotonic member-visible suffix. The native engine's
        // Qwen scratchpad must never appear in the conversation bubble.
        final visible = mindRecipeVisiblePrivateStreamText(response.toString());
        if (onToken != null && visible.startsWith(emittedVisible)) {
          final delta = visible.substring(emittedVisible.length);
          if (delta.isNotEmpty) {
            if (!firstVisibleLogged) {
              firstVisibleLogged = true;
              unawaited(
                _inferLog(
                  'first visible token ms=${timer.elapsedMilliseconds}',
                ),
              );
            }
            onToken(delta);
          }
        }
        emittedVisible = visible;
      });
      final prompt = _buildPrompt(
        userMessage,
        history: history,
        format: _activeManifest.promptFormat,
        deliberationMessage: rawMemberMessage ?? userMessage,
      );
      await _inferLog('infer prompt length=${prompt.length}');
      final promptId = await _engine!.sendPrompt(prompt);
      await _engine!
          .waitForCompletion(promptId)
          .timeout(const Duration(seconds: 150));
      final raw = response.toString();
      await _inferLog('completion ms=${timer.elapsedMilliseconds}');
      await _inferLog('infer raw length=${raw.length}');
      final stripped = _stripPrivateReasoning(raw);
      await _inferLog('infer stripped length=${stripped.length}');
      final clean = _enforceWellnessBoundaries(stripped).trim();
      await _inferLog('infer clean length=${clean.length}');
      return clean.isEmpty ? null : clean;
    } catch (error) {
      await _inferLog('infer ERROR: $error');
      _disposeEngine();
      _set(
        const LocalInferenceSnapshot(
          OnDeviceStatus.error,
          detail: 'The private model stopped responding. Reopen it before using private AI again.',
        ),
      );
      return null;
    } finally {
      await subscription?.cancel();
    }
  }

  @override
  Future<void> removeModel() =>
      _withModelMutation(() => _removeDownloadedModel(_activeManifest));

  /// Auto-resumes a download interrupted by an app kill: if a `.partial`
  /// with bytes exists and nothing is active in this process, restart the
  /// install — it continues from the on-disk bytes via a Range request.
  Future<void> resumeIfInterrupted() async {
    await _restoreActiveSelection();
    if (_modelMutationActive) return;
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

  Future<void> removeDownloadedModel(OnDeviceModelManifest manifest) =>
      _withModelMutation(() => _removeDownloadedModel(manifest));

  Future<void> _removeDownloadedModel(OnDeviceModelManifest manifest) async {
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
    await _persistActiveSelection();
    _set(const LocalInferenceSnapshot(OnDeviceStatus.checking));
    await _refreshStatus(fromMutation: true);
  }

  Future<bool> _matchesManifest(File file, OnDeviceModelManifest manifest) =>
      mindRecipeVerifyExistingModelFile(file, manifest);

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
    // The unsigned IPA embeds the exact pinned llama.cpp ABI as a framework.
    // Resolve it from Runner.app so the isolate opens the packaged library
    // directly instead of assuming symbols were linked into the app process.
    if (Platform.isIOS) {
      final appBundle = File(Platform.resolvedExecutable).parent.path;
      Llama.libraryPath = '$appBundle/Frameworks/llama.framework/llama';
    }
    // Determine base context size and thinking budget from device memory.
    var nCtx = 4096;
    var totalMem = 8192;
    try {
      final device = await MindRecipeDeviceHarness().capabilities();
      totalMem = device.totalMemoryMiB ?? 8192;
      if (totalMem < 4096) {
        nCtx = 1024; // Very low memory device
      } else if (totalMem < 6144) {
        nCtx = 2048;
      } else if (totalMem < 8192) {
        nCtx = 3072;
      }
    } catch (_) {
      nCtx = 2048; // Safe default
      totalMem = 4096;
    }
    _thinkingAllowed = totalMem >= 6144;

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
      if (totalMem >= 8192) {
        // This Android package currently bundles the llama.cpp CPU backend.
        // Keep the larger context on capable phones without pretending a GPU
        // backend is available; a GPU index with zero registered devices is a
        // hard model-load error in the pinned runtime.
        attempts = [
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
          ..mainGpu = mindRecipeMainGpuForLayers(gpuLayers)
          ..useMemorymap = true
          ..useMemoryLock = false;
        final context = ContextParams()
          ..nCtx = ctx
          // nBatch is the logical prompt capacity. Keep it aligned with the
          // context so the Navigator's system prompt can be evaluated in
          // chunks instead of being rejected before generation starts.
          ..nBatch = mindRecipeLogicalPromptBatch(ctx)
          // nUbatch is the physical CPU work unit and remains deliberately
          // small for mobile memory/thermal safety.
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
          ..temp = 0.7
          ..topK = 20
          ..topP = 0.8
          ..minP = 0.0
          // Neutral penalties do not suppress numbers/names that need to be
          // reused from context. Conversation-loop checks remain in the UI.
          ..penaltyPresent = 0.0
          ..penaltyRepeat = 1.0;
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
        await parent.init().timeout(const Duration(seconds: 55));
        _engine = parent;
        await _inferLog('engine ready [$label]');
        return;
      } catch (error) {
        lastError = error;
        await _inferLog('engine load failed [$label]: $error');
        _disposeEngine();
      }
    }
    await _inferLog('all native attempts failed lastError=$lastError');
    throw StateError(
      'The downloaded private model could not start on this device. '
      'Try reinstalling it or use cloud guidance if you choose it.',
    );
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
    var clean = mindRecipeVisiblePrivateStreamText(response);
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

  String _buildPrompt(
    String userMessage, {
    List<LocalConversationTurn> history = const [],
    required PrivatePromptFormat format,
    required String deliberationMessage,
  }) => mindRecipeBuildPrivatePrompt(
    userMessage,
    history: history,
    format: format,
    thinking: mindRecipeShouldEmitThinking(
      deliberationRequested: mindRecipeShouldDeliberate(deliberationMessage),
      totalMemoryMiB: _thinkingAllowed ? 6144 : 4096,
    ),
  );
}
