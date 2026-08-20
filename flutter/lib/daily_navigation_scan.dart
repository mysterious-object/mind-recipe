import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:sensors_plus/sensors_plus.dart';
import 'package:url_launcher/url_launcher.dart';

import 'app_services.dart';
import 'check_in_state.dart';
import 'cinematic_experience.dart';
import 'mind_nav_fx.dart';

enum DailyScanStage { invitation, sensing, feeling, body, context, synthesis }

class DailyNavigationScan extends StatefulWidget {
  const DailyNavigationScan({
    super.key,
    required this.state,
    required this.onChanged,
    required this.api,
    required this.appState,
  });

  final CheckInState state;
  final VoidCallback onChanged;
  final MindNavApiClient api;
  final SecureAppState appState;

  @override
  State<DailyNavigationScan> createState() => _DailyNavigationScanState();
}

class _DailyNavigationScanState extends State<DailyNavigationScan> {
  final journalController = TextEditingController();
  final chatController = TextEditingController();
  final motionSampler = PhoneMotionSampler();
  DailyScanStage stage = DailyScanStage.invitation;
  MotionSnapshot? motionSnapshot;
  AiReply? aiReply;
  String? lastUserMessage;
  String? aiError;
  bool cloudConsent = false;
  bool aiLoading = false;

  static const emotionOptions = [
    ('On edge', 'Anxious', Icons.bolt_rounded),
    ('Overloaded', 'Overwhelmed', Icons.blur_on_rounded),
    ('Low or heavy', 'Sad', Icons.water_drop_outlined),
    ('Disconnected', 'Numb', Icons.signal_cellular_off_rounded),
    ('Steady', 'Calm', Icons.waves_rounded),
    ('Open / hopeful', 'Hopeful', Icons.wb_twilight_rounded),
  ];

  static const bodyOptions = [
    'Head',
    'Jaw & throat',
    'Chest',
    'Stomach',
    'Shoulders',
    'Hands',
    'Legs',
  ];
  static const contextOptions = [
    'Sleep',
    'Work / school',
    'Relationships',
    'Physical health',
    'Uncertainty',
    'Positive momentum',
  ];

  @override
  void initState() {
    super.initState();
    journalController.text = widget.state.journal;
  }

  @override
  void dispose() {
    journalController.dispose();
    chatController.dispose();
    super.dispose();
  }

  String get assistantMessage => switch (stage) {
    DailyScanStage.invitation => 'I’ll guide today’s check-in as a conversation. You choose what to answer, skip, or let the phone contribute.',
    DailyScanStage.sensing => 'Hold the phone naturally for a few seconds. I’m reading device movement only—no camera, microphone, or background monitoring.',
    DailyScanStage.feeling =>
      widget.state.emotions.isEmpty
          ? 'Now add the signal only you can provide. Which inner weather is closest—not perfect, just closest?'
          : 'You marked ${widget.state.emotions.join(' and ').toLowerCase()}. Choose one more if it belongs, or keep moving.',
    DailyScanStage.body => 'Got it. Let’s add energy and body location so today’s picture has shape instead of becoming a score.',
    DailyScanStage.context => 'One last layer: what context may be influencing today? Choose any that matter, or leave this blank.',
    DailyScanStage.synthesis => 'Your navigation is assembled. The sections stay separate so a phone observation never masquerades as a fact about your mental state.',
  };

  String get assistantCaption => switch (stage) {
    DailyScanStage.invitation =>
      'Structured wellness guide · Not medical or clinical triage',
    DailyScanStage.sensing =>
      'Active scan only · Raw samples are summarized on device',
    DailyScanStage.feeling =>
      motionSnapshot != null && !motionSnapshot!.skipped
          ? 'Phone motion ready: ${motionSnapshot!.label} · Your report remains primary'
          : 'Your report remains the primary signal',
    DailyScanStage.body ||
    DailyScanStage.context => 'Your report remains the primary signal',
    DailyScanStage.synthesis => 'Reported · Observed · Suggested',
  };

  double get progress => switch (stage) {
    DailyScanStage.invitation => 0.08,
    DailyScanStage.sensing => 0.22,
    DailyScanStage.feeling => 0.42,
    DailyScanStage.body => 0.62,
    DailyScanStage.context => 0.80,
    DailyScanStage.synthesis => 1,
  };

  Future<void> includePhoneMotion() async {
    setState(() => stage = DailyScanStage.sensing);
    final snapshot = await motionSampler.sample(const Duration(seconds: 3));
    if (!mounted) return;
    setState(() {
      motionSnapshot = snapshot;
      stage = DailyScanStage.feeling;
    });
  }

  void selfReportOnly() {
    setState(() {
      motionSnapshot = const MotionSnapshot.skipped();
      stage = DailyScanStage.feeling;
    });
  }

  void selectEmotion(String emotion) {
    setState(() {
      if (widget.state.emotions.contains(emotion)) {
        widget.state.emotions.remove(emotion);
      } else {
        if (widget.state.emotions.length == 2) {
          widget.state.emotions.remove(widget.state.emotions.first);
        }
        widget.state.emotions.add(emotion);
      }
    });
    widget.onChanged();
  }

  void completeScan() {
    setState(() => widget.state.completedAt = DateTime.now());
    widget.onChanged();
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text(
          'Today’s navigation was saved. You can revise it any time.',
        ),
      ),
    );
  }

  Future<void> sendToAi() async {
    final text = chatController.text.trim();
    if (text.isEmpty || !widget.appState.hasProviderKey || !cloudConsent || aiLoading) return;
    setState(() {
      aiLoading = true;
      aiError = null;
      lastUserMessage = text;
      chatController.clear();
    });
    try {
      final reply = await widget.api.reflect(
        token: widget.appState.session?.token ?? '',
        providerKey: widget.appState.openRouterKey,
        text: text,
        context: {
          'emotions': widget.state.emotions.toList(),
          'activation': widget.state.activation,
          'body_areas': widget.state.bodyAreas.toList(),
          'context_tags': widget.state.contextTags.toList(),
          'zone_label': widget.state.greenZone,
        },
      );
      if (mounted) setState(() => aiReply = reply);
    } catch (_) {
      if (mounted) setState(() => aiError = 'The AI provider could not be reached. Your structured check-in still works.');
    } finally {
      if (mounted) setState(() => aiLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(20, 18, 20, 12),
          sliver: SliverList.list(
            children: [
              _ScanStatus(progress: progress, stage: stage),
              const SizedBox(height: 16),
              LivingAssistantCard(
                message: assistantMessage,
                caption: assistantCaption,
              ),
              const SizedBox(height: 22),
              AnimatedSwitcher(
                duration: MediaQuery.disableAnimationsOf(context)
                    ? Duration.zero
                    : const Duration(milliseconds: 420),
                switchInCurve: Curves.easeOutCubic,
                transitionBuilder: (child, animation) => FadeTransition(
                  opacity: animation,
                  child: SlideTransition(
                    position: Tween(
                      begin: const Offset(0.05, 0.03),
                      end: Offset.zero,
                    ).animate(animation),
                    child: child,
                  ),
                ),
                child: KeyedSubtree(key: ValueKey(stage), child: stagePanel()),
              ),
              const SizedBox(height: 14),
              _aiConversationPanel(),
              const SizedBox(height: 10),
              const _EvidenceDisclosure(),
              const SizedBox(height: 28),
            ],
          ),
        ),
      ],
    );
  }

  Widget _aiConversationPanel() {
    final connected = widget.appState.hasProviderKey;
    return _ScanSurface(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              Icon(connected ? Icons.auto_awesome_rounded : Icons.hub_outlined,
                  color: connected ? MindNavFxPalette.livingGreen : Theme.of(context).colorScheme.outline),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(connected ? 'Mind Nav AI ready' : 'Structured guide active', style: const TextStyle(fontWeight: FontWeight.w800)),
                    Text(connected ? 'OpenRouter · your key · consent required below' : 'No AI provider is connected. Connect one in Profile.', style: Theme.of(context).textTheme.bodySmall),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 5),
                decoration: BoxDecoration(color: (connected ? MindNavFxPalette.livingGreen : Colors.grey).withValues(alpha: 0.13), borderRadius: BorderRadius.circular(99)),
                child: Text(connected ? 'AI READY' : 'NO AI', style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1)),
              ),
            ],
          ),
          if (lastUserMessage != null) ...[
            const SizedBox(height: 16),
            Align(
              alignment: Alignment.centerRight,
              child: Container(
                constraints: const BoxConstraints(maxWidth: 320),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(color: Theme.of(context).colorScheme.primaryContainer, borderRadius: BorderRadius.circular(18)),
                child: Text(lastUserMessage!),
              ),
            ),
          ],
          if (aiReply != null) ...[
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                border: Border.all(color: aiReply!.isCloudAi ? MindNavFxPalette.livingGreen.withValues(alpha: 0.5) : Theme.of(context).colorScheme.outlineVariant),
                borderRadius: BorderRadius.circular(18),
              ),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(aiReply!.isCloudAi ? 'AI-GENERATED REFLECTION' : 'SYSTEM STATUS', style: Theme.of(context).textTheme.labelSmall?.copyWith(fontWeight: FontWeight.w900, letterSpacing: 1.1)),
                const SizedBox(height: 7),
                Text(aiReply!.message),
                if (aiReply!.isCloudAi) const Padding(padding: EdgeInsets.only(top: 7), child: Text('A suggestion—not a fact, diagnosis, or treatment direction.', style: TextStyle(fontSize: 11))),
              ]),
            ),
          ],
          if (aiError != null) Padding(padding: const EdgeInsets.only(top: 10), child: Text(aiError!, style: TextStyle(color: Theme.of(context).colorScheme.error))),
          const SizedBox(height: 14),
          TextField(
            controller: chatController,
            minLines: 1,
            maxLines: 4,
            enabled: connected && !aiLoading,
            onSubmitted: (_) => sendToAi(),
            decoration: InputDecoration(
              labelText: connected ? 'Talk with Mind Nav' : 'Connect AI in Profile to chat',
              hintText: 'What should I pay attention to today?',
              border: const OutlineInputBorder(),
              suffixIcon: aiLoading
                  ? const Padding(padding: EdgeInsets.all(14), child: SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2)))
                  : IconButton(onPressed: connected && cloudConsent ? sendToAi : null, icon: const Icon(Icons.arrow_upward_rounded), tooltip: 'Send to Mind Nav AI'),
            ),
          ),
          if (connected)
            CheckboxListTile(
              contentPadding: EdgeInsets.zero,
              dense: true,
              value: cloudConsent,
              onChanged: (value) => setState(() => cloudConsent = value ?? false),
              title: const Text('Use cloud AI for this check-in'),
              subtitle: const Text('Only the message and selected check-in fields are sent. Your journal is excluded.'),
            ),
        ],
      ),
    );
  }

  Widget stagePanel() => switch (stage) {
    DailyScanStage.invitation => _invitationPanel(),
    DailyScanStage.sensing => _sensingPanel(),
    DailyScanStage.feeling => _feelingPanel(),
    DailyScanStage.body => _bodyPanel(),
    DailyScanStage.context => _contextPanel(),
    DailyScanStage.synthesis => _synthesisPanel(),
  };

  Widget _invitationPanel() => _ScanSurface(
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const _StageEyebrow('DAILY NAVIGATION // ABOUT 90 SECONDS'),
        const SizedBox(height: 12),
        Text(
          'Begin today’s signal scan',
          style: Theme.of(context).textTheme.headlineMedium
              ?.copyWith(fontWeight: FontWeight.w800),
        ),
        const SizedBox(height: 10),
        const Text(
          'Your phone can summarize how steadily it is moving during this active check. It cannot measure heart rate, oxygen, blood pressure, or your mental state.',
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Icon(widget.appState.hasProviderKey ? Icons.auto_awesome_rounded : Icons.hub_outlined, size: 19),
            const SizedBox(width: 8),
            Text(widget.appState.hasProviderKey ? 'Mind Nav AI ready' : 'Structured guide active', style: const TextStyle(fontWeight: FontWeight.w800)),
            const Spacer(),
            Text(widget.appState.hasProviderKey ? 'AI READY' : 'NO AI', style: Theme.of(context).textTheme.labelSmall?.copyWith(fontWeight: FontWeight.w900)),
          ],
        ),
        const SizedBox(height: 16),
        SizedBox(
          width: double.infinity,
          child: FilledButton.icon(
            onPressed: includePhoneMotion,
            icon: const Icon(Icons.sensors_rounded),
            label: const Text('Include phone motion'),
          ),
        ),
        Center(
          child: TextButton(
            onPressed: selfReportOnly,
            child: const Text('Continue with self-report only'),
          ),
        ),
        const Divider(height: 28),
        const _CapabilityLine(
          icon: Icons.motion_photos_on_outlined,
          title: 'Optional motion signal',
          detail: 'Accelerometer + gyroscope for 3 seconds',
        ),
        const _CapabilityLine(
          icon: Icons.visibility_off_outlined,
          title: 'No hidden capture',
          detail: 'No camera, microphone, location, or background sensing',
        ),
        const _CapabilityLine(
          icon: Icons.psychology_alt_outlined,
          title: 'You remain the source',
          detail: 'Phone signals never override what you report',
        ),
      ],
    ),
  );

  Widget _sensingPanel() => _ScanSurface(
    child: Column(
      children: [
        const CinematicPresence(size: 150, icon: Icons.sensors_rounded),
        const SizedBox(height: 18),
        Text(
          'Reading device motion…',
          style: Theme.of(context).textTheme.titleLarge
              ?.copyWith(fontWeight: FontWeight.w700),
        ),
        const SizedBox(height: 8),
        const Text('Hold it however feels natural. There is no ideal result.'),
        const SizedBox(height: 20),
        const LinearProgressIndicator(),
        const SizedBox(height: 10),
        Text(
          'Raw samples are discarded after the movement summary is calculated.',
          style: Theme.of(context).textTheme.bodySmall,
        ),
      ],
    ),
  );

  Widget _feelingPanel() => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      const _StageEyebrow('SIGNAL 01 // INNER WEATHER'),
      const SizedBox(height: 8),
      Text(
        'What feels closest?',
        style: Theme.of(context).textTheme.headlineSmall
            ?.copyWith(fontWeight: FontWeight.w800),
      ),
      const SizedBox(height: 6),
      const Text('Choose up to two. You can change this later.'),
      const SizedBox(height: 14),
      ...emotionOptions.map(
        (option) => Padding(
          padding: const EdgeInsets.only(bottom: 9),
          child: _SignalChoice(
            label: option.$1,
            valueLabel: option.$2,
            icon: option.$3,
            selected: widget.state.emotions.contains(option.$2),
            onTap: () => selectEmotion(option.$2),
          ),
        ),
      ),
      const SizedBox(height: 10),
      Align(
        alignment: Alignment.centerRight,
        child: FilledButton(
          onPressed: widget.state.emotions.isEmpty
              ? null
              : () => setState(() => stage = DailyScanStage.body),
          child: const Text('Add body signal'),
        ),
      ),
    ],
  );

  Widget _bodyPanel() => _ScanSurface(
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const _StageEyebrow('SIGNAL 02 // BODY + ENERGY'),
        const SizedBox(height: 10),
        Text(
          'Energy right now',
          style: Theme.of(context).textTheme.titleLarge
              ?.copyWith(fontWeight: FontWeight.w700),
        ),
        Semantics(
          label: 'Energy level from minus five to plus five',
          child: Slider(
            value: widget.state.activation.toDouble(),
            min: -5,
            max: 5,
            divisions: 10,
            label: '${widget.state.activation}',
            onChanged: (value) {
              setState(() => widget.state.activation = value.round());
              widget.onChanged();
            },
          ),
        ),
        Center(child: Text(_energyLabel(widget.state.activation))),
        const SizedBox(height: 20),
        Text(
          'Where do you notice it?',
          style: Theme.of(context).textTheme.titleMedium
              ?.copyWith(fontWeight: FontWeight.w700),
        ),
        const SizedBox(height: 10),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: bodyOptions
              .map(
                (area) => FilterChip(
                  label: Text(area),
                  selected: widget.state.bodyAreas.contains(area),
                  onSelected: (_) {
                    setState(
                      () => widget.state.bodyAreas.contains(area)
                          ? widget.state.bodyAreas.remove(area)
                          : widget.state.bodyAreas.add(area),
                    );
                    widget.onChanged();
                  },
                ),
              )
              .toList(),
        ),
        const SizedBox(height: 22),
        Row(
          children: [
            TextButton(
              onPressed: () => setState(() => stage = DailyScanStage.feeling),
              child: const Text('Back'),
            ),
            const Spacer(),
            FilledButton(
              onPressed: () => setState(() => stage = DailyScanStage.context),
              child: const Text('Add context'),
            ),
          ],
        ),
      ],
    ),
  );

  Widget _contextPanel() => _ScanSurface(
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const _StageEyebrow('SIGNAL 03 // CONTEXT'),
        const SizedBox(height: 12),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: contextOptions
              .map(
                (tag) => FilterChip(
                  label: Text(tag),
                  selected: widget.state.contextTags.contains(tag),
                  onSelected: (_) {
                    setState(
                      () => widget.state.contextTags.contains(tag)
                          ? widget.state.contextTags.remove(tag)
                          : widget.state.contextTags.add(tag),
                    );
                    widget.onChanged();
                  },
                ),
              )
              .toList(),
        ),
        const SizedBox(height: 18),
        TextField(
          controller: journalController,
          minLines: 2,
          maxLines: 4,
          maxLength: 1000,
          onChanged: (value) {
            setState(() => widget.state.journal = value);
            widget.onChanged();
          },
          decoration: const InputDecoration(
            border: OutlineInputBorder(),
            labelText: 'Anything else worth naming? (optional)',
          ),
        ),
        if (widget.state.crisisLanguage && !widget.state.dismissedSafetyPrompt)
          _DailySafetyCard(
            onDismiss: () =>
                setState(() => widget.state.dismissedSafetyPrompt = true),
          ),
        const SizedBox(height: 12),
        Row(
          children: [
            TextButton(
              onPressed: () => setState(() => stage = DailyScanStage.body),
              child: const Text('Back'),
            ),
            const Spacer(),
            FilledButton.icon(
              onPressed: () => setState(() => stage = DailyScanStage.synthesis),
              icon: const Icon(Icons.auto_awesome_rounded),
              label: const Text('Assemble navigation'),
            ),
          ],
        ),
      ],
    ),
  );

  Widget _synthesisPanel() {
    final motion = motionSnapshot ?? const MotionSnapshot.skipped();
    final reported =
        '${widget.state.emotions.join(', ')} · ${_energyLabel(widget.state.activation)}'
        '${widget.state.bodyAreas.isEmpty ? '' : ' · ${widget.state.bodyAreas.join(', ')}'}';
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const _StageEyebrow('TODAY’S NAVIGATION // TRANSPARENT SYNTHESIS'),
        const SizedBox(height: 10),
        _SynthesisCard(
          label: 'YOU REPORTED',
          icon: Icons.person_outline_rounded,
          color: MindNavFxPalette.primary,
          title: reported,
          detail: widget.state.contextTags.isEmpty
              ? 'No context selected.'
              : 'Context: ${widget.state.contextTags.join(', ')}',
        ),
        const SizedBox(height: 10),
        _SynthesisCard(
          label: 'PHONE OBSERVED',
          icon: Icons.phone_iphone_rounded,
          color: MindNavFxPalette.secondary,
          title: motion.label,
          detail: motion.detail,
        ),
        const SizedBox(height: 10),
        _SynthesisCard(
          label: 'GUIDE SUGGESTS',
          icon: Icons.navigation_rounded,
          color: MindNavFxPalette.livingGreen,
          title: _suggestedTool(),
          detail: 'A wellness option based on today’s selected inputs. It is not treatment direction.',
        ),
        const SizedBox(height: 16),
        const Text(
          'This is an early-pattern wellness view—not a prediction, diagnosis, safety determination, or clinical triage result.',
          style: TextStyle(fontSize: 12),
        ),
        const SizedBox(height: 18),
        SizedBox(
          width: double.infinity,
          child: FilledButton.icon(
            onPressed: completeScan,
            icon: Icon(
              widget.state.completedAt == null
                  ? Icons.check_rounded
                  : Icons.refresh_rounded,
            ),
            label: Text(
              widget.state.completedAt == null
                  ? 'Save today’s navigation'
                  : 'Update today’s navigation',
            ),
          ),
        ),
        TextButton(
          onPressed: () => setState(() => stage = DailyScanStage.feeling),
          child: const Text('Revise my answers'),
        ),
      ],
    );
  }

  String _suggestedTool() {
    if (widget.state.activation >= 3 ||
        widget.state.emotions.any({'Anxious', 'Overwhelmed'}.contains)) {
      return 'Try a 60-second grounding reset';
    }
    if (widget.state.activation <= -3 ||
        widget.state.emotions.any({'Sad', 'Numb'}.contains)) {
      return 'Try light movement or sensory activation';
    }
    return 'Protect the steadiness you already have';
  }
}

class MotionSnapshot {
  const MotionSnapshot({
    required this.available,
    required this.skipped,
    required this.sampleCount,
    required this.accelerationRms,
    required this.rotationRms,
  });
  const MotionSnapshot.skipped()
    : available = false,
      skipped = true,
      sampleCount = 0,
      accelerationRms = 0,
      rotationRms = 0;

  final bool available;
  final bool skipped;
  final int sampleCount;
  final double accelerationRms;
  final double rotationRms;

  factory MotionSnapshot.fromSamples(
    List<double> acceleration,
    List<double> rotation,
  ) {
    if (acceleration.isEmpty && rotation.isEmpty) {
      return const MotionSnapshot(
        available: false,
        skipped: false,
        sampleCount: 0,
        accelerationRms: 0,
        rotationRms: 0,
      );
    }
    double rms(List<double> values) => values.isEmpty
        ? 0
        : math.sqrt(
            values.map((value) => value * value).reduce((a, b) => a + b) /
                values.length,
          );
    return MotionSnapshot(
      available: true,
      skipped: false,
      sampleCount: math.max(acceleration.length, rotation.length),
      accelerationRms: rms(acceleration),
      rotationRms: rms(rotation),
    );
  }

  String get label {
    if (skipped) return 'Motion scan skipped';
    if (!available) return 'Motion sensors unavailable';
    if (accelerationRms < 0.12 && rotationRms < 0.10) {
      return 'Device held mostly steady';
    }
    if (accelerationRms < 0.65 && rotationRms < 0.45) {
      return 'Light device movement';
    }
    return 'Active device movement';
  }

  String get detail {
    if (skipped) return 'Self-report-only mode was selected.';
    if (!available) return 'No usable samples were returned by this device.';
    return '$sampleCount motion samples summarized during the active 3-second scan. This does not describe your mental or physical state.';
  }
}

class PhoneMotionSampler {
  Future<MotionSnapshot> sample(Duration duration) async {
    final acceleration = <double>[];
    final rotation = <double>[];
    Object? streamError;
    StreamSubscription<UserAccelerometerEvent>? accelerationSubscription;
    StreamSubscription<GyroscopeEvent>? rotationSubscription;
    try {
      accelerationSubscription =
          userAccelerometerEventStream(
            samplingPeriod: SensorInterval.normalInterval,
          ).listen(
            (event) => acceleration.add(
              math.sqrt(
                event.x * event.x + event.y * event.y + event.z * event.z,
              ),
            ),
            onError: (Object error) => streamError = error,
          );
      rotationSubscription =
          gyroscopeEventStream(samplingPeriod: SensorInterval.normalInterval)
              .listen(
                (event) => rotation.add(
                  math.sqrt(
                    event.x * event.x + event.y * event.y + event.z * event.z,
                  ),
                ),
                onError: (Object error) => streamError = error,
              );
      await Future<void>.delayed(duration);
      if (streamError != null && acceleration.isEmpty && rotation.isEmpty) {
        return const MotionSnapshot(
          available: false,
          skipped: false,
          sampleCount: 0,
          accelerationRms: 0,
          rotationRms: 0,
        );
      }
      return MotionSnapshot.fromSamples(acceleration, rotation);
    } catch (_) {
      return const MotionSnapshot(
        available: false,
        skipped: false,
        sampleCount: 0,
        accelerationRms: 0,
        rotationRms: 0,
      );
    } finally {
      await accelerationSubscription?.cancel();
      await rotationSubscription?.cancel();
    }
  }
}

class _ScanStatus extends StatelessWidget {
  const _ScanStatus({required this.progress, required this.stage});
  final double progress;
  final DailyScanStage stage;

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Row(
        children: [
          const Icon(Icons.radar_rounded, color: MindNavFxPalette.primary),
          const SizedBox(width: 8),
          Text(
            'DAILY NAVIGATION',
            style: Theme.of(context).textTheme.labelLarge
                ?.copyWith(fontWeight: FontWeight.w900, letterSpacing: 1.5),
          ),
          const Spacer(),
          Text(
            '${(progress * 100).round()}%',
            style: Theme.of(context).textTheme.labelMedium,
          ),
        ],
      ),
      const SizedBox(height: 9),
      ClipRRect(
        borderRadius: BorderRadius.circular(99),
        child: LinearProgressIndicator(value: progress, minHeight: 5),
      ),
    ],
  );
}

class _ScanSurface extends StatelessWidget {
  const _ScanSurface({required this.child});
  final Widget child;

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(18),
    decoration: BoxDecoration(
      color: Theme.of(context).colorScheme.surfaceContainer
          .withValues(alpha: 0.88),
      borderRadius: BorderRadius.circular(24),
      border: Border.all(
        color: MindNavFxPalette.primary.withValues(alpha: 0.18),
      ),
    ),
    child: child,
  );
}

class _EvidenceDisclosure extends StatelessWidget {
  const _EvidenceDisclosure();

  @override
  Widget build(BuildContext context) => Card(
    child: ExpansionTile(
      leading: const Icon(Icons.science_outlined),
      title: const Text('Method & evidence'),
      subtitle: const Text('What this daily check-in can—and cannot—support'),
      childrenPadding: const EdgeInsets.fromLTRB(18, 0, 18, 16),
      expandedCrossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'This is a custom ecological momentary reflection: it captures your current emotion, activation, body awareness, and context in your own words. Those dimensions are useful for noticing patterns, but this exact daily sequence is not a validated clinical test and produces no clinical score.',
        ),
        const SizedBox(height: 10),
        const Text(
          'Validated measures belong in a separate, less-frequent assessment with exact wording, scoring, licensing, age, and clinical-review controls. Mind Nav will not silently blend one into an AI conversation.',
        ),
        const SizedBox(height: 8),
        TextButton.icon(
          onPressed: () => launchUrl(
            Uri.parse('https://www.who.int/publications/m/item/WHO-UCN-MSD-MHE-2024.01'),
            mode: LaunchMode.externalApplication,
          ),
          icon: const Icon(Icons.open_in_new, size: 18),
          label: const Text('View WHO-5 reference candidate'),
        ),
        const Text(
          'WHO-5 is not embedded in this commercial build pending licensing and professional review.',
          style: TextStyle(fontSize: 11),
        ),
      ],
    ),
  );
}

class _StageEyebrow extends StatelessWidget {
  const _StageEyebrow(this.text);
  final String text;

  @override
  Widget build(BuildContext context) => Text(
    text,
    style: Theme.of(context).textTheme.labelMedium?.copyWith(
      color: Theme.of(context).colorScheme.primary,
      fontWeight: FontWeight.w900,
      letterSpacing: 1.3,
    ),
  );
}

class _CapabilityLine extends StatelessWidget {
  const _CapabilityLine({
    required this.icon,
    required this.title,
    required this.detail,
  });
  final IconData icon;
  final String title;
  final String detail;

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(bottom: 12),
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 21, color: Theme.of(context).colorScheme.primary),
        const SizedBox(width: 11),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontWeight: FontWeight.w700)),
              Text(detail, style: Theme.of(context).textTheme.bodySmall),
            ],
          ),
        ),
      ],
    ),
  );
}

class _SignalChoice extends StatelessWidget {
  const _SignalChoice({
    required this.label,
    required this.valueLabel,
    required this.icon,
    required this.selected,
    required this.onTap,
  });
  final String label;
  final String valueLabel;
  final IconData icon;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Semantics(
      selected: selected,
      button: true,
      label: '$label, $valueLabel',
      child: Material(
        color: selected
            ? scheme.primaryContainer
            : scheme.surfaceContainer.withValues(alpha: 0.82),
        borderRadius: BorderRadius.circular(20),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(20),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 15),
            child: Row(
              children: [
                Icon(
                  icon,
                  color: selected ? scheme.onPrimaryContainer : scheme.primary,
                ),
                const SizedBox(width: 13),
                Expanded(
                  child: Text(
                    label,
                    style: Theme.of(context).textTheme.titleMedium
                        ?.copyWith(fontWeight: FontWeight.w700),
                  ),
                ),
                Text(valueLabel, style: Theme.of(context).textTheme.bodySmall),
                const SizedBox(width: 8),
                Icon(
                  selected ? Icons.check_circle_rounded : Icons.circle_outlined,
                  size: 20,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _SynthesisCard extends StatelessWidget {
  const _SynthesisCard({
    required this.label,
    required this.icon,
    required this.color,
    required this.title,
    required this.detail,
  });
  final String label;
  final IconData icon;
  final Color color;
  final String title;
  final String detail;

  @override
  Widget build(BuildContext context) => _ScanSurface(
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CircleAvatar(
          backgroundColor: color.withValues(alpha: 0.14),
          foregroundColor: color,
          child: Icon(icon),
        ),
        const SizedBox(width: 13),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: Theme.of(context).textTheme.labelSmall?.copyWith(
                  color: color,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 1.2,
                ),
              ),
              const SizedBox(height: 5),
              Text(
                title,
                style: Theme.of(context).textTheme.titleMedium
                    ?.copyWith(fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 5),
              Text(detail, style: Theme.of(context).textTheme.bodySmall),
            ],
          ),
        ),
      ],
    ),
  );
}

class _DailySafetyCard extends StatelessWidget {
  const _DailySafetyCard({required this.onDismiss});
  final VoidCallback onDismiss;

  @override
  Widget build(BuildContext context) => Card(
    color: Theme.of(context).colorScheme.errorContainer,
    child: Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Pause and get immediate support',
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          const Text(
            'If you may act on thoughts of harming yourself or someone else, call or text 988 in the U.S. For immediate danger, call 911. You can also reach out to a trusted person who can be with you.',
          ),
          TextButton(
            onPressed: onDismiss,
            child: const Text('This does not reflect how I feel'),
          ),
        ],
      ),
    ),
  );
}

String _energyLabel(int activation) {
  if (activation <= -3) return 'Low energy';
  if (activation < 0) return 'Quiet energy';
  if (activation == 0) return 'Balanced energy';
  if (activation < 3) return 'Elevated energy';
  return 'Highly activated energy';
}
