import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:path_provider/path_provider.dart';

import 'app_services.dart';
import 'check_in_state.dart';
import 'cinematic_experience.dart';
import 'mind_nav_fx.dart';
import 'mind_nav_device_harness.dart';
import 'mind_nav_agent.dart';
import 'on_device_inference.dart';
import 'voice_interface.dart';
import 'conversation_viz.dart';

class MindNavChatExperience extends StatefulWidget {
  const MindNavChatExperience({
    super.key,
    required this.state,
    required this.onChanged,
    required this.api,
    required this.appState,
    required this.messages,
    this.localInference,
  });

  final CheckInState state;
  final VoidCallback onChanged;
  final MindNavApiClient api;
  final SecureAppState appState;
  final List<ChatMessage> messages;
  final LocalInference? localInference;

  @override
  State<MindNavChatExperience> createState() => _MindNavChatExperienceState();
}

class _MindNavChatExperienceState extends State<MindNavChatExperience>
    with SingleTickerProviderStateMixin {
  final composer = TextEditingController();
  final scrollController = ScrollController();
  late final AnimationController fxController;
  Timer? _activityTimer;
  bool cloudConsent = true;
  bool externalResearchConsent = false;
  bool sending = false;
  int turn = 0;
  bool _isListening = false;
  bool _voiceConversationEnabled = false;
  bool _isSpeaking = false;
  double _lastMessageSide = 0.5;
  double _smoothActivity = 0.0;
  late final LocalInference _localInference;
  final MindNavAgent _agent = const MindNavAgent();
  LocalInferenceSnapshot _localSnapshot = const LocalInferenceSnapshot(
    OnDeviceStatus.checking,
  );

  Future<void> _log(String msg) async {
    try {
      final dir = await getExternalStorageDirectory() ?? await getApplicationDocumentsDirectory();
      final file = File('${dir.path}/mindnav_debug.log');
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
    unawaited(_refreshLocalStatus());
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
    composer.dispose();
    scrollController.dispose();
    _activityTimer?.cancel();
    fxController.dispose();
    super.dispose();
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
    unawaited(MindNavDeviceHarness().acknowledgeTurn());

    // Private inference is the primary route. It does not require cloud
    // consent, a provider key, or sending conversation context off device.
    final localStatus = await _localInference.refreshStatus();
    if (mounted) setState(() => _localSnapshot = localStatus);
    final cloudCanClarify = cloudConsent && widget.appState.aiAvailable;
    final nuanceNeedsConnectedReasoning =
        cloudCanClarify && _needsNuancedReasoning(text, priorConversation);
    if (localStatus.isReady && !nuanceNeedsConnectedReasoning) {
      final plan = _agent.plan(
        text,
        externalResearchApproved: externalResearchConsent,
        navigationSessions: widget.appState.navigationSessions,
        messagesSent: widget.appState.messagesSent,
        aiReflections: widget.appState.aiReflections,
      );
      final reply = await _localInference.infer(
        plan.augment(text),
        history: priorConversation,
      );
      await _log('REPLY null=${reply == null} len=${reply?.length ?? 0} preview="${reply?.substring(0, reply != null && reply.length > 100 ? 100 : reply?.length ?? 0)}"');
      final localReplyUseful = _isUsefulLocalReply(reply, text);
      await _log('USEFUL=$localReplyUseful');
      if (reply != null && mounted && localReplyUseful) {
        setState(() {
          widget.messages.add(
            ChatMessage(
              role: ChatRole.assistant,
              text: reply,
              localGenerated: true,
            ),
          );
          _lastMessageSide = 1.0;
          sending = false;
        });
        unawaited(widget.appState.recordAiReflection());
        widget.onChanged();
        _scrollToEnd();
        if (_voiceConversationEnabled) {
          await _speakAndResume(reply);
        }
        return;
      }
      if (mounted && !localReplyUseful) {
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
    if (!cloudConsent) {
      setState(() {
        widget.messages.add(
          const ChatMessage(
            role: ChatRole.status,
            text: 'Cloud AI is paused for this conversation. Turn on the privacy control below to continue.',
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
        externalResearchOptIn: externalResearchConsent,
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
                    return _ChatBubble(message: widget.messages[index]);
                  }
                  if (sending && index == widget.messages.length) {
                    return const _ThinkingBubble();
                  }
                  return _OpeningSuggestions(onSelected: send);
                },
              ),
            ),
            _Composer(
              controller: composer,
              canSend: canSend,
              cloudAvailable: cloudAvailable,
              sending: sending,
              consent: cloudConsent,
              onConsentChanged: (value) => setState(() => cloudConsent = value),
              researchConsent: externalResearchConsent,
              onResearchConsentChanged: (value) =>
                  setState(() => externalResearchConsent = value),
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
        color: MindNavFxPalette.primary.withValues(alpha: 0.34),
      ),
      boxShadow: [
        BoxShadow(
          color: MindNavFxPalette.primary.withValues(alpha: 0.12),
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
          child: const CinematicPresence(
            size: 58,
            icon: Icons.navigation_rounded,
          ),
        ),
        const SizedBox(width: 13),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'MIND NAV',
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
                        ? MindNavFxPalette.livingGreen
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
  const _ChatBubble({required this.message});
  final ChatMessage message;

  @override
  Widget build(BuildContext context) {
    final member = message.role == ChatRole.member;
    final status = message.role == ChatRole.status;
    return Align(
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
                    MindNavFxPalette.secondary.withValues(alpha: 0.10),
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
                : MindNavFxPalette.primary.withValues(alpha: 0.20),
          ),
          boxShadow: [
            BoxShadow(
              color:
                  (member
                          ? MindNavFxPalette.secondary
                          : MindNavFxPalette.primary)
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
                  : 'MIND NAV',
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
          Text('Mind Nav is responding…'),
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
    required this.consent,
    required this.onConsentChanged,
    required this.researchConsent,
    required this.onResearchConsentChanged,
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
  final bool consent;
  final ValueChanged<bool> onConsentChanged;
  final bool researchConsent;
  final ValueChanged<bool> onResearchConsentChanged;
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
          color: MindNavFxPalette.primary.withValues(alpha: 0.22),
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
                      ? 'Tell Mind Nav what is present…'
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
              tooltip: 'Send to Mind Nav',
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
                  : (isListening ? 'Stop listening' : 'Speak to Mind Nav'),
              color: (isListening || isSpeaking) ? Colors.red : null,
            ),
          ],
        ),
        Row(
          children: [
            Switch.adaptive(
              value: consent,
              onChanged: cloudAvailable ? onConsentChanged : null,
            ),
            const SizedBox(width: 6),
            const Expanded(
              child: Text(
                'Cloud AI for this conversation · journal excluded',
                style: TextStyle(fontSize: 11),
              ),
            ),
            const Icon(Icons.lock_outline_rounded, size: 16),
            const SizedBox(width: 8),
            Switch.adaptive(
              value: voiceConversationEnabled ?? false,
              onChanged: canSend
                  ? (_) => onToggleVoiceConversation?.call()
                  : null,
            ),
            const SizedBox(width: 6),
            const Text('Voice conversation', style: TextStyle(fontSize: 11)),
          ],
        ),
        Row(
          children: [
            Switch.adaptive(
              value: researchConsent,
              onChanged: cloudAvailable ? onResearchConsentChanged : null,
            ),
            const SizedBox(width: 6),
            const Expanded(
              child: Text(
                'Use public research sources when I ask · sends only that request',
                style: TextStyle(fontSize: 11),
              ),
            ),
            const Icon(Icons.travel_explore_rounded, size: 16),
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
      ..color = MindNavFxPalette.secondary.withValues(alpha: 0.14 * intensity)
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
