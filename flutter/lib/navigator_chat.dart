import 'dart:async';
import 'dart:io';
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:path_provider/path_provider.dart';

import 'app_services.dart';
import 'chat_actions.dart';
import 'check_in_state.dart';
import 'mind_recipe_fx.dart';
import 'mind_recipe_device_harness.dart';
import 'navigator_agent.dart';
import 'on_device_inference.dart';
import 'voice_interface.dart';
import 'conversation_viz.dart';

const _voiceConversationKey = 'mind_recipe_voice_conversation_enabled';

class NavigatorChatExperience extends StatefulWidget {
  const NavigatorChatExperience({
    super.key,
    required this.state,
    required this.onChanged,
    required this.api,
    required this.appState,
    required this.messages,
    this.localInference,
    required this.onStartDailyNav,
  });

  /// Opens the manual daily-navigation flow; completion syncs back into
  /// this thread and the Pulse tab.
  final VoidCallback onStartDailyNav;

  final CheckInState state;
  final VoidCallback onChanged;
  final MindRecipeApiClient api;
  final SecureAppState appState;
  final List<ChatMessage> messages;
  final LocalInference? localInference;

  @override
  State<NavigatorChatExperience> createState() =>
      _NavigatorChatExperienceState();
}

class _NavigatorChatExperienceState extends State<NavigatorChatExperience>
    with SingleTickerProviderStateMixin {
  final composer = TextEditingController();
  final scrollController = ScrollController();
  late final AnimationController fxController;
  Timer? _activityTimer;
  bool sending = false;
  int turn = 0;
  bool _isListening = false;
  bool _voiceConversationEnabled = false;
  bool _isSpeaking = false;
  double _lastMessageSide = 0.5;
  double _smoothActivity = 0.0;
  late final LocalInference _localInference;
  final NavigatorAgent _agent = const NavigatorAgent();
  LocalInferenceSnapshot _localSnapshot = const LocalInferenceSnapshot(
    OnDeviceStatus.checking,
  );
  List<Map<String, dynamic>> _savedThreads = [];
  PhoneAction? _pendingPhoneAction;
  bool _executingPhoneAction = false;
  final PhoneActionParser _phoneActionParser = const PhoneActionParser();

  Future<void> _log(String msg) async {
    try {
      final dir =
          await getExternalStorageDirectory() ??
          await getApplicationDocumentsDirectory();
      final file = File('${dir.path}/mindrecipe_debug.log');
      final timestamp = DateTime.now().toIso8601String();
      await file.writeAsString('$timestamp $msg\n', mode: FileMode.append);
    } catch (_) {}
  }

  @override
  void initState() {
    super.initState();
    fxController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 10),
    )..repeat();
    _startActivityTimer();
    _localInference = widget.localInference ?? OnDeviceInference();
    // Seed from the broadcast snapshot and follow it live so the header badge
    // flips to PRIVATE/online the instant the model finishes verifying.
    if (widget.localInference == null) {
      _localSnapshot = OnDeviceInference.snapshotNotifier.value;
      OnDeviceInference.snapshotNotifier.addListener(_onSnapshotChanged);
    }
    unawaited(_refreshLocalStatus());
    unawaited(_loadVoiceConversationPreference());
  }

  void _onSnapshotChanged() {
    if (!mounted) return;
    setState(() => _localSnapshot = OnDeviceInference.snapshotNotifier.value);
  }

  /// Executes a consented phone action through the on-device harness
  /// (Calendar / Reminders / AlarmClock) and reports the result in chat.
  Future<void> _executePhoneAction(PhoneAction action) async {
    setState(() => _executingPhoneAction = true);
    try {
      final result = await executePhoneAction(action);
      if (!mounted) return;
      setState(() {
        widget.messages.add(
          ChatMessage(
            role: ChatRole.status,
            text: result.success
                ? '${action.summaryLabel} created on this device — "${action.title}"${action.when != null ? ' for ${formatActionTime(action.when!)}' : ''}. You can change it in your Calendar or Clock app anytime.'
                : 'I could not create that automatically (${result.message}). Nothing was changed on your device.',
            systemGenerated: true,
          ),
        );
        _pendingPhoneAction = null;
      });
      widget.onChanged();
      _scrollToEnd();
    } finally {
      if (mounted) setState(() => _executingPhoneAction = false);
    }
  }

  Future<void> _loadVoiceConversationPreference() async {
    try {
      final value = await const FlutterSecureStorage().read(
        key: _voiceConversationKey,
      );
      if (mounted && value == 'true')
        setState(() => _voiceConversationEnabled = true);
    } catch (_) {}
    try {
      final threads = await widget.appState.loadSavedThreads();
      if (mounted) setState(() => _savedThreads = threads);
    } catch (_) {}
  }

  Future<void> _saveCurrentThread() async {
    if (widget.messages.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('No conversation to save yet.')));
      return;
    }
    final title = widget.messages.firstWhere((m) => m.role == ChatRole.member, orElse: () => widget.messages.first).text;
    final shortTitle = title.length > 48 ? '${title.substring(0, 48)}…' : title;
    final msgs = widget.messages.map((m) => {'role': m.role.name, 'text': m.text}).toList();
    await widget.appState.saveThread(shortTitle, msgs);
    final threads = await widget.appState.loadSavedThreads();
    if (mounted) setState(() => _savedThreads = threads);
    if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Thread saved — find it in Saved threads')));
  }

  Future<void> _showSavedThreads() async {
    final threads = await widget.appState.loadSavedThreads();
    if (!mounted) return;
    setState(() => _savedThreads = threads);
    showModalBottomSheet<void>(
      context: context,
      showDragHandle: true,
      isScrollControlled: true,
      builder: (ctx) => FractionallySizedBox(
        heightFactor: 0.85,
        child: Column(children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
            child: Row(children: [
              const Icon(Icons.bookmark_rounded),
              const SizedBox(width: 8),
              const Text('Saved threads', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
              const Spacer(),
              Text('${threads.length} saved'),
            ]),
          ),
          const Divider(height: 1),
          Expanded(
            child: threads.isEmpty
                ? const Center(child: Text('No saved threads yet — tap Save thread in chat to keep one.'))
                : ListView.separated(
                    padding: const EdgeInsets.all(12),
                    itemCount: threads.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 8),
                    itemBuilder: (ctx, i) {
                      final t = threads[i];
                      final msgs = (t['messages'] as List).length;
                      return Card(
                        child: ListTile(
                          title: Text(t['title']?.toString() ?? 'Untitled', maxLines: 2, overflow: TextOverflow.ellipsis),
                          subtitle: Text('$msgs messages · ${t['saved_at']?.toString().substring(0, 10) ?? ''}'),
                          trailing: const Icon(Icons.chevron_right_rounded),
                          onTap: () {
                            Navigator.pop(ctx);
                            // Restore thread: replace current messages
                            setState(() {
                              widget.messages
                                ..clear()
                                ..addAll((t['messages'] as List).map((m) => ChatMessage(
                                      role: m['role'] == 'assistant' ? ChatRole.assistant : m['role'] == 'member' ? ChatRole.member : ChatRole.status,
                                      text: m['text']?.toString() ?? '',
                                    )));
                            });
                            widget.onChanged();
                          },
                        ),
                      );
                    },
                  ),
          ),
        ]),
      ),
    );
  }

  Future<void> _refreshLocalStatus() async {
    final snapshot = await _localInference.refreshStatus();
    if (mounted) setState(() => _localSnapshot = snapshot);
  }

  void _startActivityTimer() {
    _activityTimer = Timer.periodic(const Duration(milliseconds: 50), (timer) {
      if (!mounted) {
        timer.cancel();
        return;
      }
      final target = _isListening ? 0.8 : (sending ? 0.6 : 0.0);
      final diff = target - _smoothActivity;
      setState(() => _smoothActivity += diff * 0.15);
    });
  }

  @override
  void dispose() {
    if (widget.localInference == null) {
      OnDeviceInference.snapshotNotifier.removeListener(_onSnapshotChanged);
    }
    composer.dispose();
    scrollController.dispose();
    _activityTimer?.cancel();
    fxController.dispose();
    super.dispose();
  }

  /// Edits an earlier member message: drops that message and everything
  /// after it, then resends the edited text so the conversation continues
  /// from that point.
  void _editMessage(int index, String newText) {
    if (sending) return;
    setState(() {
      if (index < widget.messages.length) {
        widget.messages.removeRange(index, widget.messages.length);
      }
    });
    composer.text = newText;
    send();
  }

  Future<void> send([String? suggestion]) async {
    final text = (suggestion ?? composer.text).trim();
    if (text.isEmpty || sending) return;
    final startsSession = turn == 0;
    final priorConversation = widget.messages
        .where((message) => message.role != ChatRole.status)
        .toList()
        .reversed
        .take(8)
        .toList()
        .reversed
        .map(
          (message) => LocalConversationTurn(
            role: message.role == ChatRole.assistant ? 'assistant' : 'user',
            text: message.text,
          ),
        )
        .toList();
    setState(() {
      composer.clear();
      widget.messages.add(ChatMessage(role: ChatRole.member, text: text));
      _lastMessageSide = 0.0; // user sent
      sending = true;
      turn++;
    });
    unawaited(
      widget.appState.recordAssistantMessage(startsSession: startsSession),
    );
    widget.onChanged();
    _scrollToEnd();
    unawaited(MindRecipeDeviceHarness().acknowledgeTurn());

    // Private inference is the primary route. It does not require cloud
    // consent, a provider key, or sending conversation context off device.
    final localStatus = await _localInference.refreshStatus();
    if (mounted) setState(() => _localSnapshot = localStatus);
    final cloudCanClarify =
        widget.appState.cloudAiEnabled && widget.appState.aiAvailable;
    final nuanceNeedsConnectedReasoning =
        cloudCanClarify && _needsNuancedReasoning(text, priorConversation);
    if (localStatus.isReady && !nuanceNeedsConnectedReasoning) {
      final plan = _agent.plan(
        text,
        externalResearchApproved: widget.appState.publicResearchEnabled,
        navigationSessions: widget.appState.navigationSessions,
        messagesSent: widget.appState.messagesSent,
        aiReflections: widget.appState.aiReflections,
      );
      // Live streaming: the reply renders as the model generates, so the
      // member sees words within the first second instead of after the
      // full completion.
      final placeholderIndex = widget.messages.length;
      var lastPaint = DateTime.now();
      void onToken(String token) {
        if (!mounted || token.isEmpty) return;
        final now = DateTime.now();
        if (now.difference(lastPaint).inMilliseconds < 90) return;
        lastPaint = now;
        setState(() {
          if (placeholderIndex < widget.messages.length &&
              widget.messages[placeholderIndex].role == ChatRole.assistant) {
            widget.messages[placeholderIndex] = ChatMessage(
              role: ChatRole.assistant,
              text: widget.messages[placeholderIndex].text + token,
              localGenerated: true,
            );
          }
        });
        _scrollToEnd();
      }

      setState(() {
        widget.messages.add(
          ChatMessage(role: ChatRole.assistant, text: '', localGenerated: true),
        );
        _lastMessageSide = 1.0;
      });
      _scrollToEnd();

      var reply = await _localInference.infer(
        plan.augment(text),
        history: priorConversation,
        onToken: onToken,
      );
      // Anti-loop guard: if the reply mostly repeats the previous Navigator
      // turn ("consider the next step…" circles), retry ONCE with an explicit
      // variation instruction so the model moves somewhere new.
      if (reply != null && _isRepetitiveOfLastAssistant(reply)) {
        await _log('REPETITION detected — retrying with variation nudge');
        if (mounted && placeholderIndex < widget.messages.length) {
          setState(() => widget.messages[placeholderIndex] =
              ChatMessage(role: ChatRole.assistant, text: '', localGenerated: true));
        }
        reply = await _localInference.infer(
          '${plan.augment(text)}\n\nImportant: your previous reply repeated what you already said. Respond with ONE concrete, different suggestion or question you have not used in this conversation. Reference the member\'s latest words specifically.',
          history: priorConversation,
          onToken: onToken,
        );
      }
      // Fallback ladder: a null reply usually means the full prompt
      // (system + routing + history) overflowed the engine context or the
      // model buried the answer in a cut-off think block. Retry with less
      // context before giving up so chat never dead-ends.
      if (reply == null || reply.trim().isEmpty) {
        await _log('FALLBACK: retrying with short history');
        reply = await _localInference.infer(
          text,
          history: priorConversation.length > 2
              ? priorConversation.sublist(priorConversation.length - 2)
              : priorConversation,
          onToken: onToken,
        );
      }
      if (reply == null || reply.trim().isEmpty) {
        await _log('FALLBACK: retrying with bare prompt');
        reply = await _localInference.infer(text, onToken: onToken);
      }
      // If the model streamed words but the final clean text came back
      // empty, the streamed text itself is the reply.
      var replyToUse = reply;
      if (replyToUse == null &&
          placeholderIndex < widget.messages.length &&
          widget.messages[placeholderIndex].role == ChatRole.assistant &&
          widget.messages[placeholderIndex].text.trim().length >= 8) {
        replyToUse = widget.messages[placeholderIndex].text.trim();
      }
      void removePlaceholder() {
        if (mounted &&
            placeholderIndex < widget.messages.length &&
            widget.messages[placeholderIndex].role == ChatRole.assistant &&
            widget.messages[placeholderIndex].text.isEmpty) {
          widget.messages.removeAt(placeholderIndex);
        }
      }
      await _log(
        'REPLY null=${replyToUse == null} len=${replyToUse?.length ?? 0} preview="${replyToUse?.substring(0, replyToUse != null && replyToUse.length > 100 ? 100 : replyToUse?.length ?? 0)}"',
      );
      final localReplyUseful = _isUsefulLocalReply(replyToUse, text);
      await _log('USEFUL=$localReplyUseful');
      // Phone-harness intent detection — offer a consent-gated action card
      // whenever the member's message maps to a reminder/appointment/alarm.
      final phoneAction = _phoneActionParser.parse(text);
      final replyFinal = replyToUse;
      if (replyFinal != null && mounted && localReplyUseful) {
        setState(() {
          if (placeholderIndex < widget.messages.length &&
              widget.messages[placeholderIndex].role == ChatRole.assistant) {
            widget.messages[placeholderIndex] = ChatMessage(
              role: ChatRole.assistant,
              text: replyFinal,
              localGenerated: true,
            );
          } else {
            widget.messages.add(
              ChatMessage(
                role: ChatRole.assistant,
                text: replyFinal,
                localGenerated: true,
              ),
            );
          }
          _lastMessageSide = 1.0;
          sending = false;
          _pendingPhoneAction = phoneAction;
        });
        unawaited(widget.appState.recordAiReflection());
        widget.onChanged();
        _scrollToEnd();
        if (_voiceConversationEnabled) {
          await _speakAndResume(replyFinal);
        }
        return;
      }
      if (mounted && !localReplyUseful) {
        removePlaceholder();
        setState(
          () => widget.messages.add(
            ChatMessage(
              role: ChatRole.status,
              text: cloudCanClarify
                  ? 'Taking a closer look at what you meant…'
                  : 'Private guidance could not form a grounded response. Try again, or connect cloud AI in Profile for deeper conversation.',
            ),
          ),
        );
        if (!cloudCanClarify) {
          setState(() => sending = false);
          _scrollToEnd();
          return;
        }
      }
    }
    if (localStatus.isReady && nuanceNeedsConnectedReasoning && mounted) {
      setState(
        () => widget.messages.add(
          const ChatMessage(
            role: ChatRole.status,
            text: 'Taking a closer look at what you meant…',
          ),
        ),
      );
    }

    if (!widget.appState.aiAvailable) {
      setState(() {
        widget.messages.add(
          const ChatMessage(
            role: ChatRole.status,
            text: 'Private AI is not installed and cloud AI is not connected. Install the private model in Profile or add an OpenRouter key.',
          ),
        );
        sending = false;
      });
      _scrollToEnd();
      return;
    }
    if (!widget.appState.cloudAiEnabled) {
      setState(() {
        widget.messages.add(
          const ChatMessage(
            role: ChatRole.status,
            text: 'Cloud AI is turned off in Settings. Turn it on there to continue.',
          ),
        );
        sending = false;
      });
      _scrollToEnd();
      return;
    }

    try {
      final recent = widget.messages
          .where((message) => message.role != ChatRole.status)
          .toList()
          .reversed
          .take(8)
          .toList()
          .reversed
          .map((message) => {'role': message.role.name, 'text': message.text})
          .toList();
      final reply = await widget.api.reflect(
        token: widget.appState.session?.token ?? '',
        providerKey: widget.appState.openRouterKey,
        text: text,
        externalResearchOptIn: widget.appState.publicResearchEnabled,
        context: {
          'member_id': widget.appState.session?.email ?? '',
          'display_name': widget.appState.session?.displayName ?? '',
          'conversation': recent,
          'emotions': widget.state.emotions.toList(),
          'activation': widget.state.activation,
          'body_areas': widget.state.bodyAreas.toList(),
          'context_tags': widget.state.contextTags.toList(),
          'zone_label': widget.state.greenZone,
        },
      );
      if (!mounted) return;
      setState(
        () => widget.messages.add(
          ChatMessage(
            role: reply.isCloudAi ? ChatRole.assistant : ChatRole.status,
            text: reply.message,
            model: reply.isCloudAi ? reply.model : null,
            cloudGenerated: reply.isCloudAi,
          ),
        ),
      );
      if (reply.isCloudAi) {
        _lastMessageSide = 1.0; // AI sent
        unawaited(widget.appState.recordAiReflection());
        widget.onChanged();
        if (_voiceConversationEnabled) {
          // Release the composer before the response turn opens so the member
          // can stop listening or type immediately if they prefer.
          setState(() => sending = false);
          await _speakAndResume(reply.message);
          return;
        }
      }
    } catch (_) {
      if (!mounted) return;
      setState(
        () => widget.messages.add(
          const ChatMessage(
            role: ChatRole.status,
            text: 'The AI connection was interrupted. Nothing was inferred or saved—try again when you’re ready.',
          ),
        ),
      );
    } finally {
      if (mounted) {
        setState(() => sending = false);
        _scrollToEnd();
      }
    }
  }

  bool _needsNuancedReasoning(
    String text,
    List<LocalConversationTurn> history,
  ) {
    if (history.isEmpty) return false;
    final words = text.toLowerCase().split(RegExp(r'\s+'));
    if (words.length <= 5) return true;
    return RegExp(
      r'\b(it|that|this|they|them|he|she|what do you mean|why do i|help me understand)\b',
    ).hasMatch(text.toLowerCase());
  }

  /// Word-overlap similarity between a candidate reply and the most recent
  /// Navigator turn. Used to break "consider the next step…" circles.
  bool _isRepetitiveOfLastAssistant(String reply) {
    String? lastAssistant;
    for (var i = widget.messages.length - 1; i >= 0; i--) {
      if (widget.messages[i].role == ChatRole.assistant) {
        lastAssistant = widget.messages[i].text;
        break;
      }
    }
    if (lastAssistant == null || lastAssistant.isEmpty) return false;
    Set<String> words(String text) => text
        .toLowerCase()
        .replaceAll(RegExp(r'[^a-z0-9\s]'), ' ')
        .split(RegExp(r'\s+'))
        .where((w) => w.length > 3)
        .toSet();
    final a = words(reply);
    final b = words(lastAssistant);
    if (a.isEmpty || b.isEmpty) return false;
    final overlap = a.intersection(b).length / (a.length < b.length ? a.length : b.length);
    return overlap > 0.6;
  }

  bool _isUsefulLocalReply(String? reply, String memberText) {
    if (reply == null) {
      unawaited(_log('FILTER: reply is null'));
      return false;
    }
    final clean = reply.trim();
    if (clean.isEmpty) {
      unawaited(_log('FILTER: empty after trim'));
      return false;
    }
    if (clean.length < 8) {
      unawaited(_log('FILTER: too short (${clean.length}) "$clean"'));
      return false;
    }
    final lowered = clean.toLowerCase();
    if (lowered.contains('<|im_')) {
      unawaited(_log('FILTER: im_ token'));
      return false;
    }
    final normalizedReply = lowered.replaceAll(RegExp(r'[^a-z0-9]+'), '');
    final normalizedMember = memberText.toLowerCase().replaceAll(
      RegExp(r'[^a-z0-9]+'),
      '',
    );
    if (normalizedReply == normalizedMember) {
      unawaited(_log('FILTER: echo'));
      return false;
    }
    unawaited(_log('FILTER: PASSED len=${clean.length}'));
    return true;
  }

  Future<void> _toggleVoiceInput() async {
    final voice = VoiceInterface();
    if (_isSpeaking || voice.isSpeaking) {
      await voice.stopSpeaking();
      if (mounted) setState(() => _isSpeaking = false);
      await _startVoiceInput();
      return;
    }
    if (_isListening) {
      await voice.stopListening();
      setState(() => _isListening = false);
    } else {
      await _startVoiceInput();
    }
  }

  Future<void> _speakAndResume(String reply) async {
    if (!mounted || !_voiceConversationEnabled) return;
    setState(() => _isSpeaking = true);
    final completed = await VoiceInterface().speakAndWait(reply);
    if (!mounted) return;
    setState(() => _isSpeaking = false);
    // An interrupted reply opens the microphone from the interrupt handler.
    if (!completed) return;
    await Future<void>.delayed(const Duration(milliseconds: 280));
    if (mounted && _voiceConversationEnabled) {
      await _startVoiceInput(autoStarted: true);
    }
  }

  Future<void> _startVoiceInput({bool autoStarted = false}) async {
    if (_isListening || sending) return;
    final voice = VoiceInterface();
    final available = await voice.isAvailable();
    if (!mounted) return;
    if (!available) {
      setState(() {
        widget.messages.add(
          const ChatMessage(
            role: ChatRole.status,
            text: 'Voice input is unavailable on this device. You can keep navigating by text.',
          ),
        );
      });
      _scrollToEnd();
      return;
    }
    setState(() {
      _isListening = true;
      widget.messages.add(
        ChatMessage(
          role: ChatRole.status,
          text: autoStarted
              ? 'Listening for your response…'
              : 'Listening… speak when you’re ready.',
        ),
      );
    });
    _scrollToEnd();
    try {
      final text = await voice.startListening();
      if (!mounted) return;
      if (text != null && text.isNotEmpty) {
        // Recognition is complete before inference begins. Reflect that state
        // immediately so the mic never claims it is still listening while the
        // private model is composing a response.
        setState(() => _isListening = false);
        composer.text = text;
        await send(text);
      } else {
        setState(() {
          widget.messages.add(
            const ChatMessage(
              role: ChatRole.status,
              text: 'I didn’t catch that. Tap the mic when you want to try again, or type your response.',
            ),
          );
        });
        _scrollToEnd();
      }
    } catch (_) {
      if (mounted) {
        setState(() {
          widget.messages.add(
            const ChatMessage(
              role: ChatRole.status,
              text: 'Voice input was interrupted. You can try the mic again or type your response.',
            ),
          );
        });
        _scrollToEnd();
      }
    } finally {
      if (mounted && _isListening) setState(() => _isListening = false);
    }
  }

  Future<void> _toggleVoiceConversation() async {
    final enabled = !_voiceConversationEnabled;
    setState(() => _voiceConversationEnabled = enabled);
    try {
      await const FlutterSecureStorage().write(
        key: _voiceConversationKey,
        value: enabled.toString(),
      );
    } catch (_) {}
    if (!enabled) {
      await VoiceInterface().stopSpeaking();
      if (_isListening) await VoiceInterface().stopListening();
      if (mounted) {
        setState(() {
          _isSpeaking = false;
          _isListening = false;
        });
      }
    }
  }

  void _scrollToEnd() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted || !scrollController.hasClients) return;
      scrollController.animateTo(
        scrollController.position.maxScrollExtent,
        duration: const Duration(milliseconds: 420),
        curve: Curves.easeOutCubic,
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    final cloudAvailable = widget.appState.aiAvailable;
    final canSend = cloudAvailable || _localSnapshot.isReady;
    final activity = _isListening ? 0.8 : (sending ? 0.6 : 0.0);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Stack(
      children: [
        Positioned.fill(
          child: IgnorePointer(
            child: ConversationViz(
              activity: activity,
              messageType: _lastMessageSide,
              isDark: isDark,
            ),
          ),
        ),
        Column(
          children: [
            _PresenceHeader(
              animation: fxController,
              cloudAvailable: cloudAvailable,
              localReady: _localSnapshot.isReady,
              thinking: sending,
              turn: turn,
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(12, 4, 12, 0),
              child: Row(children: [
                OutlinedButton.icon(
                  onPressed: widget.onStartDailyNav,
                  icon: const Icon(Icons.route_rounded, size: 16),
                  label: const Text('Daily nav', style: TextStyle(fontSize: 12)),
                  style: OutlinedButton.styleFrom(visualDensity: VisualDensity.compact),
                ),
                const SizedBox(width: 8),
                OutlinedButton.icon(
                  onPressed: widget.messages.isEmpty ? null : _saveCurrentThread,
                  icon: const Icon(Icons.bookmark_add_outlined, size: 16),
                  label: const Text('Save thread', style: TextStyle(fontSize: 12)),
                  style: OutlinedButton.styleFrom(visualDensity: VisualDensity.compact),
                ),
                const SizedBox(width: 8),
                OutlinedButton.icon(
                  onPressed: _showSavedThreads,
                  icon: const Icon(Icons.bookmarks_outlined, size: 16),
                  label: Text('Saved (${_savedThreads.length})', style: const TextStyle(fontSize: 12)),
                  style: OutlinedButton.styleFrom(visualDensity: VisualDensity.compact),
                ),
                const Spacer(),
                // Cloud consent lives here, on the chat page — no Steps detour.
                SwitchListTile.adaptive(
                  value: widget.appState.cloudAiEnabled,
                  onChanged: (v) async {
                    await widget.appState.setCloudAiEnabled(v);
                    if (mounted) setState(() {});
                  },
                  title: const Text('Cloud AI', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700)),
                  subtitle: const Text('Optional · journal excluded', style: TextStyle(fontSize: 11)),
                  contentPadding: EdgeInsets.zero,
                  dense: true,
                ),
                if (widget.messages.isNotEmpty)
                  IconButton(
                    icon: const Icon(Icons.delete_sweep_outlined, size: 18),
                    tooltip: 'Clear chat',
                    onPressed: () => setState(() => widget.messages.clear()),
                  ),
              ]),
            ),
            Expanded(
              child: ListView.builder(
                controller: scrollController,
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 18),
                itemCount:
                    widget.messages.length +
                    (sending ? 1 : 0) +
                    (turn == 0 ? 1 : 0),
                itemBuilder: (context, index) {
                  if (index < widget.messages.length) {
                    return _ChatBubble(
                      message: widget.messages[index],
                      onEdit: sending
                          ? null
                          : (newText) => _editMessage(index, newText),
                    );
                  }
                  if (sending && index == widget.messages.length) {
                    return const _ThinkingBubble();
                  }
                  return _OpeningSuggestions(onSelected: send);
                },
              ),
            ),
            if (_pendingPhoneAction != null)
              _PhoneActionCard(
                action: _pendingPhoneAction!,
                busy: _executingPhoneAction,
                onAllow: () => _executePhoneAction(_pendingPhoneAction!),
                onDismiss: () => setState(() => _pendingPhoneAction = null),
              ),
            _Composer(
              controller: composer,
              canSend: canSend,
              cloudAvailable: cloudAvailable,
              sending: sending,
              onSend: send,
              onToggleVoice: _toggleVoiceInput,
              isListening: _isListening,
              isSpeaking: _isSpeaking,
              voiceConversationEnabled: _voiceConversationEnabled,
              onToggleVoiceConversation: _toggleVoiceConversation,
            ),
          ],
        ),
      ],
    );
  }
}

enum ChatRole { assistant, member, status }

/// Consent-gated phone action card — Mind Recipe's on-device phone-harness
/// surface inside free chat. Nothing executes until the member taps Allow.
class _PhoneActionCard extends StatelessWidget {
  const _PhoneActionCard({
    required this.action,
    required this.busy,
    required this.onAllow,
    required this.onDismiss,
  });

  final PhoneAction action;
  final bool busy;
  final VoidCallback onAllow;
  final VoidCallback onDismiss;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Card(
      margin: const EdgeInsets.fromLTRB(12, 4, 12, 4),
      color: scheme.secondaryContainer.withValues(alpha: 0.55),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(14, 10, 10, 10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  switch (action.type) {
                    PhoneActionType.reminder => Icons.notifications_active_outlined,
                    PhoneActionType.appointment => Icons.event_outlined,
                    PhoneActionType.alarm => Icons.alarm_outlined,
                  },
                  size: 18,
                  color: scheme.primary,
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    action.summary,
                    style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13.5),
                  ),
                ),
                IconButton(
                  visualDensity: VisualDensity.compact,
                  onPressed: busy ? null : onDismiss,
                  icon: const Icon(Icons.close_rounded, size: 18),
                  tooltip: 'Not now',
                ),
              ],
            ),
            const SizedBox(height: 2),
            Text(
              'Mind Recipe can add this on your phone — it stays in your own Calendar, Reminders, or Clock app.',
              style: Theme.of(context).textTheme.bodySmall,
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton(
                  onPressed: busy ? null : onDismiss,
                  child: const Text('Not now'),
                ),
                const SizedBox(width: 4),
                FilledButton.icon(
                  onPressed: busy ? null : onAllow,
                  icon: busy
                      ? const SizedBox(
                          width: 14,
                          height: 14,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Icon(Icons.bolt_rounded, size: 16),
                  label: Text(busy ? 'Adding…' : 'Allow'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class ChatMessage {
  const ChatMessage({
    required this.role,
    required this.text,
    this.model,
    this.systemGenerated = false,
    this.localGenerated = false,
    this.cloudGenerated = false,
  });
  final ChatRole role;
  final String text;
  final String? model;
  final bool systemGenerated;
  final bool localGenerated;
  final bool cloudGenerated;
}

class _PresenceHeader extends StatelessWidget {
  const _PresenceHeader({
    required this.animation,
    required this.cloudAvailable,
    required this.localReady,
    required this.thinking,
    required this.turn,
  });
  final Animation<double> animation;
  final bool cloudAvailable;
  final bool localReady;
  final bool thinking;
  final int turn;

  @override
  Widget build(BuildContext context) => Container(
    margin: const EdgeInsets.fromLTRB(16, 12, 16, 4),
    padding: const EdgeInsets.all(14),
    decoration: BoxDecoration(
      color: Theme.of(context).colorScheme.surface.withValues(alpha: 0.82),
      borderRadius: BorderRadius.circular(28),
      border: Border.all(
        color: MindRecipeFxPalette.primary.withValues(alpha: 0.34),
      ),
      boxShadow: [
        BoxShadow(
          color: MindRecipeFxPalette.primary.withValues(alpha: 0.12),
          blurRadius: 26,
        ),
      ],
    ),
    child: Row(
      children: [
        AnimatedBuilder(
          animation: animation,
          builder: (context, child) => Transform.scale(
            scale: 0.94 + math.sin(animation.value * math.pi * 2) * 0.04,
            child: child,
          ),
          child: ClipOval(
            child: Image.asset(
              'assets/branding/navigator-compass.png',
              width: 58,
              height: 58,
              fit: BoxFit.cover,
            ),
          ),
        ),
        const SizedBox(width: 13),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'NAVIGATOR',
                style: TextStyle(
                  fontWeight: FontWeight.w900,
                  letterSpacing: 2.2,
                ),
              ),
              Text(
                thinking
                    ? 'Reading the shape of your words…'
                    : localReady
                    ? 'Private guidance ready · stays on this device'
                    : cloudAvailable
                    ? 'Cloud guidance ready · consent required per conversation'
                    : 'Private model not installed · cloud unavailable',
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ],
          ),
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
          decoration: BoxDecoration(
            color:
                ((localReady || cloudAvailable)
                        ? MindRecipeFxPalette.livingGreen
                        : Colors.orange)
                    .withValues(alpha: 0.14),
            borderRadius: BorderRadius.circular(99),
          ),
          child: Text(
            localReady
                ? 'PRIVATE'
                : cloudAvailable
                ? 'CLOUD'
                : 'OFFLINE',
            style: const TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.w900,
              letterSpacing: 1.2,
            ),
          ),
        ),
      ],
    ),
  );
}

class _ChatBubble extends StatelessWidget {
  const _ChatBubble({required this.message, this.onEdit});
  final ChatMessage message;

  /// Member bubbles only — long-press to edit and resend from this point.
  final void Function(String newText)? onEdit;

  @override
  Widget build(BuildContext context) {
    final member = message.role == ChatRole.member;
    final status = message.role == ChatRole.status;
    return GestureDetector(
      onLongPress:
          member && onEdit != null ? () => _showEditDialog(context) : null,
      child: Align(
      alignment: member ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        constraints: BoxConstraints(
          maxWidth: MediaQuery.sizeOf(context).width * 0.82,
        ),
        margin: const EdgeInsets.only(top: 10),
        padding: const EdgeInsets.all(15),
        decoration: BoxDecoration(
          gradient: member
              ? const LinearGradient(
                  colors: [Color(0xff006b60), Color(0xff2f6cfa)],
                )
              : status
              ? null
              : LinearGradient(
                  colors: [
                    Theme.of(context).colorScheme.surface
                        .withValues(alpha: 0.96),
                    MindRecipeFxPalette.secondary.withValues(alpha: 0.10),
                  ],
                ),
          color: status
              ? Theme.of(context).colorScheme.surfaceContainerHighest
                    .withValues(alpha: 0.9)
              : null,
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(22),
            topRight: const Radius.circular(22),
            bottomLeft: Radius.circular(member ? 22 : 5),
            bottomRight: Radius.circular(member ? 5 : 22),
          ),
          border: Border.all(
            color: status
                ? Theme.of(context).colorScheme.outlineVariant
                : MindRecipeFxPalette.primary.withValues(alpha: 0.20),
          ),
          boxShadow: [
            BoxShadow(
              color:
                  (member
                          ? MindRecipeFxPalette.secondary
                          : MindRecipeFxPalette.primary)
                      .withValues(alpha: 0.11),
              blurRadius: 20,
              offset: const Offset(0, 7),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              status
                  ? 'SYSTEM'
                  : member
                  ? 'YOU'
                  : 'NAVIGATOR',
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w900,
                letterSpacing: 1.3,
                color: member
                    ? Colors.white70
                    : Theme.of(context).colorScheme.primary,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              message.text,
              style: TextStyle(
                fontSize: 16,
                height: 1.35,
                color: member ? Colors.white : null,
              ),
            ),
            if (message.localGenerated || message.cloudGenerated)
              Padding(
                padding: const EdgeInsets.only(top: 8),
                child: Text(
                  message.localGenerated
                      ? 'On-device AI · private · suggestion, not fact'
                      : 'Cloud AI · journal excluded · suggestion, not fact',
                  style: Theme.of(context).textTheme.labelSmall,
                ),
              ),
          ],
        ),
      ),
      ),
    );
  }

  void _showEditDialog(BuildContext context) {
    final controller = TextEditingController(text: message.text);
    showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Edit message'),
        content: TextField(
          controller: controller,
          maxLines: null,
          autofocus: true,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () {
              final text = controller.text.trim();
              Navigator.pop(ctx);
              if (text.isNotEmpty && text != message.text) {
                onEdit?.call(text);
              }
            },
            child: const Text('Resend'),
          ),
        ],
      ),
    );
  }
}

class _OpeningSuggestions extends StatelessWidget {
  const _OpeningSuggestions({required this.onSelected});
  final ValueChanged<String> onSelected;
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(top: 14),
    child: Wrap(
      spacing: 8,
      runSpacing: 8,
      children: [
        ActionChip(
          label: const Text('Begin daily navigation'),
          avatar: const Icon(Icons.radar_rounded, size: 18),
          onPressed: () => onSelected(
            'Begin my daily navigation. Guide me one step at a time.',
          ),
        ),
        ActionChip(
          label: const Text('I need a quick reset'),
          avatar: const Icon(Icons.bolt_rounded, size: 18),
          onPressed: () => onSelected('I need a quick reset right now.'),
        ),
        ActionChip(
          label: const Text('Talk freely'),
          avatar: const Icon(Icons.chat_bubble_outline, size: 18),
          onPressed: () =>
              onSelected('I want to talk freely before the check-in.'),
        ),
      ],
    ),
  );
}

class _ThinkingBubble extends StatelessWidget {
  const _ThinkingBubble();
  @override
  Widget build(BuildContext context) => const Align(
    alignment: Alignment.centerLeft,
    child: Padding(
      padding: EdgeInsets.all(16),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          SizedBox(
            width: 20,
            height: 20,
            child: CircularProgressIndicator(strokeWidth: 2),
          ),
          SizedBox(width: 10),
          Text('Navigator is responding…'),
        ],
      ),
    ),
  );
}

class _Composer extends StatelessWidget {
  const _Composer({
    required this.controller,
    required this.canSend,
    required this.cloudAvailable,
    required this.sending,
    required this.onSend,
    required this.onToggleVoice,
    required this.isListening,
    required this.isSpeaking,
    this.voiceConversationEnabled = false,
    this.onToggleVoiceConversation,
  });
  final TextEditingController controller;
  final bool canSend;
  final bool cloudAvailable;
  final bool sending;
  final VoidCallback onSend;
  final VoidCallback onToggleVoice;
  final bool isListening;
  final bool isSpeaking;
  final bool? voiceConversationEnabled;
  final VoidCallback? onToggleVoiceConversation;
  @override
  Widget build(BuildContext context) => Container(
    padding: EdgeInsets.fromLTRB(
      14,
      10,
      14,
      MediaQuery.paddingOf(context).bottom + 10,
    ),
    decoration: BoxDecoration(
      color: Theme.of(context).colorScheme.surface.withValues(alpha: 0.94),
      border: Border(
        top: BorderSide(
          color: MindRecipeFxPalette.primary.withValues(alpha: 0.22),
        ),
      ),
    ),
    child: Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: controller,
                enabled: canSend && !sending,
                minLines: 1,
                maxLines: 4,
                textCapitalization: TextCapitalization.sentences,
                onSubmitted: (_) => onSend(),
                decoration: InputDecoration(
                  hintText: canSend
                      ? 'Tell Navigator what is present…'
                      : 'Install private AI or connect cloud AI',
                  filled: true,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(22),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 8),
            IconButton.filled(
              onPressed: canSend && !sending ? onSend : null,
              icon: const Icon(Icons.arrow_upward_rounded),
              tooltip: 'Send to Navigator',
            ),
            const SizedBox(width: 4),
            IconButton(
              onPressed: (!sending || isSpeaking) ? onToggleVoice : null,
              icon: Icon(
                isSpeaking
                    ? Icons.record_voice_over_rounded
                    : (isListening ? Icons.mic : Icons.mic_none),
              ),
              tooltip: isSpeaking
                  ? 'Interrupt and speak'
                  : (isListening ? 'Stop listening' : 'Speak to Navigator'),
              color: (isListening || isSpeaking) ? Colors.red : null,
            ),
          ],
        ),
        Row(
          children: [
            Switch.adaptive(
              value: voiceConversationEnabled ?? false,
              onChanged: canSend
                  ? (_) => onToggleVoiceConversation?.call()
                  : null,
            ),
            const SizedBox(width: 6),
            const Expanded(
              child: Text('Voice conversation', style: TextStyle(fontSize: 11)),
            ),
            const Icon(Icons.record_voice_over_rounded, size: 16),
          ],
        ),
      ],
    ),
  );
}

class _ChatFieldPainter extends CustomPainter {
  _ChatFieldPainter({
    required this.phase,
    required this.intensity,
    required this.color,
  });
  final double phase;
  final double intensity;
  final Color color;
  @override
  void paint(Canvas canvas, Size size) {
    final glow = Paint()
      ..shader =
          RadialGradient(
            colors: [
              color.withValues(alpha: 0.16 * intensity),
              Colors.transparent,
            ],
          ).createShader(
            Rect.fromCircle(
              center: Offset(
                size.width * (0.2 + phase * 0.6),
                size.height * 0.28,
              ),
              radius: size.width * 0.65,
            ),
          );
    canvas.drawRect(Offset.zero & size, glow);
    final line = Paint()
      ..color = MindRecipeFxPalette.secondary.withValues(
        alpha: 0.14 * intensity,
      )
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.3;
    for (var i = 0; i < 5; i++) {
      final path = Path()..moveTo(0, size.height * (0.14 + i * 0.16));
      for (double x = 0; x <= size.width; x += 16) {
        final y =
            size.height * (0.14 + i * 0.16) +
            math.sin(x / 58 + phase * math.pi * 2 + i) *
                (10 + i * 3) *
                intensity;
        path.lineTo(x, y);
      }
      canvas.drawPath(path, line);
    }
  }

  @override
  bool shouldRepaint(covariant _ChatFieldPainter oldDelegate) =>
      oldDelegate.phase != phase || oldDelegate.intensity != intensity;
}
