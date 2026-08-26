import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/material.dart';

import 'app_services.dart';
import 'check_in_state.dart';
import 'on_device_inference.dart';

/// The Pulse tab — a live "mood ring" driven by the member's check-in state.
///
/// The app's VFX language becomes a real-time pulse: color tracks valence,
/// breathing speed tracks activation. The Navigator reads this data to help
/// the member return to baseline, and every pulse is logged so the member can
/// see their mood move in real time.
class PulseScreen extends StatefulWidget {
  const PulseScreen({
    super.key,
    required this.checkIn,
    required this.appState,
    required this.onAskNavigator,
  });

  final CheckInState checkIn;
  final SecureAppState appState;

  /// Sends a pulse summary into the Navigator thread and switches there.
  final void Function(String message) onAskNavigator;

  @override
  State<PulseScreen> createState() => _PulseScreenState();
}

class _PulseScreenState extends State<PulseScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _breath;
  List<Map<String, dynamic>> _pulses = const [];
  bool _logging = false;
  bool _navigatorOnline = false;
  bool _inBreathWork = false;
  int _breathCycle = 0;

  @override
  void initState() {
    super.initState();
    OnDeviceInference.snapshotNotifier.addListener(_updateOnline);
    _updateOnline();
    _breath = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 5),
    )..repeat(reverse: true);
    _loadAndRecord();
  }

  void _updateOnline() {
    if (!mounted) return;
    final local = OnDeviceInference.snapshotNotifier.value.isReady;
    final cloud = widget.appState.cloudAiEnabled && widget.appState.aiAvailable;
    setState(() => _navigatorOnline = local || cloud);
  }

  @override
  void dispose() {
    OnDeviceInference.snapshotNotifier.removeListener(_updateOnline);
    _breath.dispose();
    super.dispose();
  }

  Future<void> _loadAndRecord() async {
    final mood = MoodState.fromCheckIn(widget.checkIn);
    await widget.appState.recordMoodPulse(
      valence: mood.valence,
      activation: mood.activation,
      source: 'auto',
    );
    final pulses = await widget.appState.loadMoodPulses();
    if (mounted) setState(() => _pulses = pulses);
  }

  Future<void> _logQuick(String label, double valence, double activation) async {
    setState(() => _logging = true);
    await widget.appState.recordMoodPulse(
      valence: valence,
      activation: activation,
      source: label,
    );
    final pulses = await widget.appState.loadMoodPulses();
    if (mounted) {
      setState(() {
        _pulses = pulses;
        _logging = false;
      });
    }
  }

  void _askNavigator() {
    final mood = MoodState.fromCheckIn(widget.checkIn);
    final recent = _pulses.length >= 2;
    final trend = recent
        ? 'Last few pulses: ${_pulses.reversed.take(5).map((p) => _pulseWord((p['v'] as num?)?.toDouble() ?? 0)).join(' → ')}.'
        : '';
    widget.onAskNavigator(
      'My pulse right now: ${mood.label} (valence ${mood.valence.toStringAsFixed(1)}, '
      'activation ${(mood.activation * 10).toStringAsFixed(0)}/10). $trend '
      'Help me move toward baseline with one small step.',
    );
  }

  String _pulseWord(double v) =>
      v > 0.3 ? 'bright' : v < -0.3 ? 'heavy' : 'steady';

  @override
  Widget build(BuildContext context) {
    final mood = MoodState.fromCheckIn(widget.checkIn);
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        const Text(
          'Your pulse',
          style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 4),
        Text(
          'A live mood ring — it moves as you move. The Navigator reads it to help you find your way back to baseline.',
          style: Theme.of(context).textTheme.bodyMedium,
        ),
        const SizedBox(height: 20),
        Center(
          child: _PulseRing(
            breath: _breath,
            valence: mood.valence,
            activation: mood.activation,
          ),
        ),
        const SizedBox(height: 12),
        Center(
          child: Column(
            children: [
              Text(
                mood.label,
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w800,
                      color: mood.color,
                    ),
              ),
              const SizedBox(height: 4),
              Text(
                mood.description,
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),
        if (_inBreathWork)
          _BreathPacer(
            activation: mood.activation,
            onCycle: () => setState(() => _breathCycle++),
            onDone: () {
              setState(() => _inBreathWork = false);
              unawaited(_logQuick('after breathing', mood.valence + 0.2, (mood.activation - 0.2).clamp(0, 1)));
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Pulse logged — notice what shifted.')),
              );
            },
          )
        else
          Card(
            color: Theme.of(context).colorScheme.secondaryContainer.withValues(alpha: 0.5),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(children: [
                    Icon(Icons.self_improvement_rounded, color: Theme.of(context).colorScheme.primary),
                    const SizedBox(width: 8),
                    Text('Back to baseline', style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800)),
                  ]),
                  const SizedBox(height: 6),
                  Text(mood.guidance),
                  const SizedBox(height: 12),
                  // Dynamic, aligned buttons — wrap on narrow screens so words never clip
                  LayoutBuilder(builder: (context, c) {
                    final narrow = c.maxWidth < 360;
                    final breathe = FilledButton.icon(
                      onPressed: () => setState(() {
                        _inBreathWork = true;
                        _breathCycle = 0;
                      }),
                      icon: const Icon(Icons.air_rounded, size: 18),
                      label: const Text('Breathe with me', textAlign: TextAlign.center),
                      style: FilledButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                        textStyle: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
                      ),
                    );
                    final ask = OutlinedButton.icon(
                      onPressed: _navigatorOnline ? _askNavigator : null,
                      icon: const Icon(Icons.chat_bubble_outline_rounded, size: 18),
                      label: Text(_navigatorOnline ? 'Ask Navigator' : 'Navigator offline', textAlign: TextAlign.center),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                        textStyle: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
                      ),
                    );
                    if (narrow) {
                      return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [breathe, const SizedBox(height: 8), ask]);
                    }
                    return Row(children: [Expanded(child: breathe), const SizedBox(width: 8), Expanded(child: ask)]);
                  }),
                ],
              ),
            ),
          ),
        const SizedBox(height: 16),
        Text('How does it feel right now?', style: Theme.of(context).textTheme.titleSmall),
        const SizedBox(height: 8),
        // Dynamic, aligned quick-log options — wrap cleanly and surface current check-in
        Builder(builder: (context) {
          // Build dynamic chip set from current check-in + defaults, deduped
          final seen = <String>{};
          final dynamicChips = <(String, double, double)>[];
          for (final e in widget.checkIn.emotions.take(3)) {
            final label = e.trim();
            if (label.isEmpty || seen.contains(label.toLowerCase())) continue;
            seen.add(label.toLowerCase());
            // Map check-in emotion to a gentle pulse estimate
            dynamicChips.add((label[0].toUpperCase() + label.substring(1), 0.5, 0.0));
          }
          for (final chip in const [
            ('Activated', 1.0, -0.4),
            ('Steady', 0.5, 0.2),
            ('Low', -0.5, 0.2),
            ('Heavy', -0.8, -0.3),
            ('Bright', 0.8, 0.6),
            ('Calm', 0.3, 0.5),
            ('Tense', 0.9, -0.5),
          ]) {
            if (seen.contains(chip.$1.toLowerCase())) continue;
            seen.add(chip.$1.toLowerCase());
            dynamicChips.add(chip);
          }
          return Wrap(
            spacing: 8,
            runSpacing: 8,
            alignment: WrapAlignment.start,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              for (final chip in dynamicChips.take(7))
                ActionChip(
                  label: Text(chip.$1, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                  labelPadding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  visualDensity: VisualDensity.compact,
                  materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  onPressed: _logging
                      ? null
                      : () => _logQuick(
                            chip.$1.toLowerCase(),
                            chip.$3,
                            chip.$2,
                          ),
                ),
            ],
          );
        }),
        const SizedBox(height: 20),
        if (_pulses.isNotEmpty) ...[
          Text('Recent pulses', style: Theme.of(context).textTheme.titleSmall),
          const SizedBox(height: 8),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: SizedBox(
                height: 72,
                child: CustomPaint(
                  painter: _PulseSparkline(pulses: _pulses),
                  size: Size.infinite,
                ),
              ),
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Each point is a moment you checked in. Over time this shows what lifts you and what weighs you — your personal recipe.',
            style: Theme.of(context).textTheme.bodySmall,
          ),
          const SizedBox(height: 20),
        ],
        _PathSummary(appState: widget.appState),
      ],
    );
  }
}

/// Mood derivation: keyword valence + check-in activation.
class MoodState {
  const MoodState({
    required this.valence,
    required this.activation,
    required this.label,
    required this.description,
    required this.guidance,
    required this.color,
  });

  final double valence; // -1..1
  final double activation; // 0..1
  final String label;
  final String description;
  final String guidance;
  final Color color;

  static MoodState fromCheckIn(CheckInState checkIn) {
    final text = [
      ...checkIn.emotions,
      ...checkIn.contextTags,
      checkIn.journal,
    ].join(' ').toLowerCase();

    const activatedNegative = [
      'anxious', 'angry', 'frustrated', 'panicked', 'tense', 'irritable',
      'restless', 'overwhelmed', 'stressed', 'wired', 'on edge', 'racing',
    ];
    const depletedNegative = [
      'sad', 'down', 'numb', 'empty', 'tired', 'exhausted', 'hopeless',
      'lonely', 'heavy', 'drained', 'flat', 'low',
    ];
    const positive = [
      'calm', 'steady', 'grateful', 'content', 'hopeful', 'peaceful',
      'grounded', 'connected', 'good', 'okay', 'bright', 'relaxed',
    ];

    final hasActNeg = activatedNegative.any(text.contains);
    final hasDepNeg = depletedNegative.any(text.contains);
    final hasPos = positive.any(text.contains);

    final reportedActivation = (checkIn.activation / 10).clamp(0.0, 1.0);

    double valence;
    double activation;
    String label;
    String description;
    String guidance;
    Color color;

    if (hasActNeg && !hasPos) {
      valence = -0.6;
      activation = math.max(0.75, reportedActivation);
      label = 'Activated';
      description = 'Your system is running hot — energy with nowhere to settle yet.';
      guidance = 'Let\'s burn it off safely: a long exhale is the fastest lever. Breathe with me — longer out than in.';
      color = const Color(0xffe2593c);
    } else if (hasDepNeg && !hasPos) {
      valence = -0.6;
      activation = math.min(0.3, reportedActivation == 0 ? 0.25 : reportedActivation);
      label = 'Depleted';
      description = 'Low fuel, low light. Nothing is wrong with you — you are running on empty.';
      guidance = 'Gentle warmth first: unclench the jaw, feel your feet, one small kind thing. We start tiny.';
      color = const Color(0xff4a5fa8);
    } else if (hasPos) {
      valence = 0.6;
      activation = reportedActivation == 0 ? 0.35 : reportedActivation;
      label = 'Steady-bright';
      description = 'You are near baseline — this is worth noticing and savoring.';
      guidance = 'Savor it for ten seconds. Name one thing that helped you get here — that is your recipe working.';
      color = const Color(0xff00b374);
    } else {
      valence = 0.0;
      activation = reportedActivation;
      label = 'Baseline';
      description = 'Neutral ground. A good place to notice one true thing.';
      guidance = 'Baseline is the anchor. One slow breath and one honest observation keeps it warm.';
      color = const Color(0xff00b399);
    }
    return MoodState(
      valence: valence,
      activation: activation,
      label: label,
      description: description,
      guidance: guidance,
      color: color,
    );
  }
}

/// The living mood ring: breathing core + expanding ripples, colored by
/// valence, paced by activation.
class _PulseRing extends StatelessWidget {
  const _PulseRing({
    required this.breath,
    required this.valence,
    required this.activation,
  });

  final Animation<double> breath;
  final double valence;
  final double activation;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 264,
      height: 264,
      child: AnimatedBuilder(
        animation: breath,
        builder: (context, _) => CustomPaint(
          painter: _PulseRingPainter(
            t: breath.value,
            valence: valence,
            activation: activation,
          ),
          size: Size.infinite,
        ),
      ),
    );
  }
}

class _PulseRingPainter extends CustomPainter {
  const _PulseRingPainter({
    required this.t,
    required this.valence,
    required this.activation,
  });

  final double t; // 0..1 breathing phase
  final double valence;
  final double activation;

  @override
  void paint(Canvas canvas, Size size) {
    final center = size.center(Offset.zero);
    final base = size.shortestSide * 0.30;
    // Activation drives breath depth and ripple count.
    final depth = 0.10 + activation * 0.16;
    final breathe = 1 + math.sin(t * math.pi * 2) * depth;

    final core = Color.lerp(
      const Color(0xff00b399),
      valence >= 0 ? const Color(0xff00e68a) : const Color(0xff7c3aed),
      valence.abs().clamp(0.0, 1.0),
    )!;

    // Expanding ripples — one per activation quarter.
    final ripples = 2 + (activation * 3).round();
    for (var i = 0; i < ripples; i++) {
      final phase = (t + i / ripples) % 1.0;
      final radius = base * (1.05 + phase * 0.85);
      final opacity = (1 - phase) * 0.22 * (0.5 + activation * 0.5);
      canvas.drawCircle(
        center,
        radius,
        Paint()
          ..style = PaintingStyle.stroke
          ..strokeWidth = 2
          ..color = core.withValues(alpha: opacity),
      );
    }

    // Glow.
    canvas.drawCircle(
      center,
      base * 1.5 * breathe,
      Paint()
        ..shader = RadialGradient(colors: [
          core.withValues(alpha: 0.20),
          core.withValues(alpha: 0),
        ]).createShader(Rect.fromCircle(center: center, radius: base * 1.5 * breathe)),
    );

    // Core orb.
    canvas.drawCircle(
      center,
      base * breathe,
      Paint()
        ..shader = RadialGradient(colors: [
          core.withValues(alpha: 0.95),
          core.withValues(alpha: 0.55),
          core.withValues(alpha: 0.12),
        ]).createShader(Rect.fromCircle(center: center, radius: base * breathe)),
    );
    // Specular highlight.
    canvas.drawCircle(
      center - Offset(base * 0.25, base * 0.3),
      base * 0.22 * breathe,
      Paint()..color = Colors.white.withValues(alpha: 0.18),
    );
  }

  @override
  bool shouldRepaint(covariant _PulseRingPainter old) =>
      old.t != t || old.valence != valence || old.activation != activation;
}

/// Valence-over-time polyline with a baseline midline.
class _PulseSparkline extends CustomPainter {
  const _PulseSparkline({required this.pulses});

  final List<Map<String, dynamic>> pulses;

  @override
  void paint(Canvas canvas, Size size) {
    if (pulses.isEmpty) return;
    final mid = size.height / 2;
    // Midline.
    canvas.drawLine(
      Offset(0, mid),
      Offset(size.width, mid),
      Paint()
        ..color = Colors.white.withValues(alpha: 0.15)
        ..strokeWidth = 1,
    );
    final n = pulses.length.clamp(2, 40);
    final slice = pulses.sublist(pulses.length - n);
    final path = Path();
    for (var i = 0; i < slice.length; i++) {
      final v = ((slice[i]['v'] as num?)?.toDouble() ?? 0).clamp(-1.0, 1.0);
      final x = size.width * i / (slice.length - 1);
      final y = mid - v * (size.height * 0.4);
      i == 0 ? path.moveTo(x, y) : path.lineTo(x, y);
    }
    canvas.drawPath(
      path,
      Paint()
        ..color = const Color(0xff00e5cc)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2.2,
    );
    for (var i = 0; i < slice.length; i++) {
      final v = ((slice[i]['v'] as num?)?.toDouble() ?? 0).clamp(-1.0, 1.0);
      final x = size.width * i / (slice.length - 1);
      final y = mid - v * (size.height * 0.4);
      canvas.drawCircle(Offset(x, y), 2.5, Paint()..color = Colors.white.withValues(alpha: 0.7));
    }
  }

  @override
  bool shouldRepaint(covariant _PulseSparkline old) => old.pulses != pulses;
}

/// Guided 4-in / 6-out breathing pacer — the fastest lever back to baseline.
class _BreathPacer extends StatefulWidget {
  const _BreathPacer({
    required this.activation,
    required this.onCycle,
    required this.onDone,
  });

  final double activation;
  final VoidCallback onCycle;
  final VoidCallback onDone;

  @override
  State<_BreathPacer> createState() => _BreathPacerState();
}

class _BreathPacerState extends State<_BreathPacer>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  static const _cycles = 6;

  @override
  void initState() {
    super.initState();
    final seconds = (6 - widget.activation * 2.5).clamp(3.5, 6.0);
    _controller = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: (seconds * 1000).round()),
    );
    _runCycle();
  }

  Future<void> _runCycle() async {
    while (mounted && _cycleCount < _cycles) {
      _cycleCount++;
      widget.onCycle();
      await _controller.forward();
      await _controller.reverse();
    }
    if (mounted) widget.onDone();
  }

  int _cycleCount = 0;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      color: Theme.of(context).colorScheme.primaryContainer.withValues(alpha: 0.4),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Text(
              'Breathe with me — $_cycleCount of $_cycles',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 8),
            SizedBox(
              width: 140,
              height: 140,
              child: AnimatedBuilder(
                animation: _controller,
                builder: (context, _) {
                  final v = _controller.value;
                  final phase = v < 0.4 ? 'Breathe in…' : v < 0.55 ? 'Hold…' : 'Breathe out… slowly';
                  return Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      SizedBox(
                        width: 90,
                        height: 90,
                        child: CustomPaint(
                          painter: _BreathOrb(t: v),
                          size: Size.infinite,
                        ),
                      ),
                      const SizedBox(height: 10),
                      Text(phase, style: Theme.of(context).textTheme.bodyMedium),
                    ],
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _BreathOrb extends CustomPainter {
  const _BreathOrb({required this.t});
  final double t;

  @override
  void paint(Canvas canvas, Size size) {
    final center = size.center(Offset.zero);
    final radius = size.shortestSide * (0.35 + t * 0.45);
    canvas.drawCircle(
      center,
      radius,
      Paint()
        ..shader = RadialGradient(colors: [
          const Color(0xff00e5cc).withValues(alpha: 0.9),
          const Color(0xff00b399).withValues(alpha: 0.25),
        ]).createShader(Rect.fromCircle(center: center, radius: radius)),
    );
  }

  @override
  bool shouldRepaint(covariant _BreathOrb old) => old.t != t;
}

/// Compact "your path" summary so curriculum progress stays visible.
class _PathSummary extends StatefulWidget {
  const _PathSummary({required this.appState});
  final SecureAppState appState;

  @override
  State<_PathSummary> createState() => _PathSummaryState();
}

class _PathSummaryState extends State<_PathSummary> {
  int _completed = 0;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    widget.appState.loadCurriculumProgress().then((p) {
      if (!mounted) return;
      setState(() {
        _completed = ((p?['completed_lesson_ids'] as List?) ?? const []).length;
        _loading = false;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    const total = 15;
    return Card(
      child: ListTile(
        leading: const Icon(Icons.menu_book_rounded),
        title: Text('Your path · $_completed of $total lessons'),
        subtitle: _loading
            ? null
            : Text(
                _completed == 0
                    ? 'Start in Recipes — Foundations, lesson one.'
                    : _completed >= total
                        ? 'Core path complete — generated lessons are waiting in Recipes.'
                        : 'One lesson a day keeps the path warm.',
              ),
      ),
    );
  }
}

// ignore_for_file: unused_element
