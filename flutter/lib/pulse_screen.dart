import 'dart:async';
import 'dart:convert';
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

import 'app_services.dart';
import 'check_in_state.dart';

/// Converts the explicit Daily Nav check-in into the compact Pulse values
/// stored by the app. Pulse itself never asks the member to check in again.
class MoodState {
  const MoodState({required this.valence, required this.activation});

  final double valence;
  final double activation;

  static MoodState fromCheckIn(CheckInState checkIn) {
    final text = <String>[
      ...checkIn.emotions,
      ...checkIn.contextTags,
      checkIn.journal,
    ].join(' ').toLowerCase();
    const activatedNegative = <String>[
      'anxious',
      'angry',
      'frustrated',
      'panicked',
      'tense',
      'overwhelmed',
      'stressed',
      'wired',
    ];
    const depletedNegative = <String>[
      'sad',
      'down',
      'numb',
      'empty',
      'tired',
      'exhausted',
      'lonely',
      'drained',
    ];
    const positive = <String>[
      'calm',
      'steady',
      'grateful',
      'content',
      'hopeful',
      'peaceful',
      'grounded',
      'connected',
      'relaxed',
    ];
    final hasActivatedNegative = activatedNegative.any(text.contains);
    final hasDepletedNegative = depletedNegative.any(text.contains);
    final hasPositive = positive.any(text.contains);
    final reportedActivation = (checkIn.activation / 10).clamp(0.0, 1.0);
    if (hasActivatedNegative && !hasPositive) {
      return MoodState(
        valence: -0.6,
        activation: math.max(0.75, reportedActivation),
      );
    }
    if (hasDepletedNegative && !hasPositive) {
      return MoodState(
        valence: -0.6,
        activation: math.min(
          0.3,
          reportedActivation == 0 ? 0.25 : reportedActivation,
        ),
      );
    }
    if (hasPositive) {
      return MoodState(
        valence: 0.6,
        activation: reportedActivation == 0 ? 0.35 : reportedActivation,
      );
    }
    return MoodState(valence: 0, activation: reportedActivation);
  }
}

/// Pulse is the visual memory of the member's journey. Daily Nav owns mood
/// input and regulation activities; this screen observes and explains change.
class PulseScreen extends StatefulWidget {
  const PulseScreen({
    super.key,
    required this.checkIn,
    required this.appState,
  });

  final CheckInState checkIn;
  final SecureAppState appState;

  @override
  State<PulseScreen> createState() => _PulseScreenState();
}

class _PulseScreenState extends State<PulseScreen> with WidgetsBindingObserver {
  WebViewController? _controller;
  List<Map<String, dynamic>> _pulses = const [];
  Map<String, dynamic>? _curriculum;
  Map<String, dynamic> _pulseSummary = const {};
  bool _webReady = false;
  bool _useFallback = false;
  bool _loading = true;
  Timer? _rendererDeadline;
  late _FamiliarState _familiar;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _familiar = _FamiliarState.initial(
      widget.appState.session?.email ?? 'local-member',
    );
    unawaited(_load());
    _initRenderer();
  }

  @override
  void dispose() {
    _rendererDeadline?.cancel();
    WidgetsBinding.instance.removeObserver(this);
    _controller?.runJavaScript('window.setFamiliarPaused(true)');
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    final paused = state != AppLifecycleState.resumed;
    _controller?.runJavaScript('window.setFamiliarPaused($paused)');
  }

  Future<void> _load() async {
    try {
      final results = await Future.wait<dynamic>([
        widget.appState.loadMoodPulses(),
        widget.appState.loadCurriculumProgress(),
        MindRecipeApiClient()
            .getPulse(widget.appState.session?.token ?? '')
            .catchError((_) => <String, dynamic>{}),
      ]);
      _pulses = (results[0] as List).cast<Map<String, dynamic>>();
      _curriculum = results[1] as Map<String, dynamic>?;
      _pulseSummary = results[2] as Map<String, dynamic>;
      _familiar = _deriveFamiliar();
    } finally {
      if (mounted) setState(() => _loading = false);
    }
    await _sendState();
  }

  void _initRenderer() {
    try {
      final controller = WebViewController()
        ..setJavaScriptMode(JavaScriptMode.unrestricted)
        ..setBackgroundColor(Colors.transparent)
        ..setNavigationDelegate(
          NavigationDelegate(
            // The renderer is bundled with the app. Allow only Flutter's
            // local asset origins and reject all outbound navigation.
            onNavigationRequest: (request) {
              final uri = Uri.tryParse(request.url);
              final local =
                  uri != null &&
                  (uri.scheme == 'file' ||
                      uri.scheme == 'data' ||
                      uri.host == 'appassets.androidplatform.net');
              return local
                  ? NavigationDecision.navigate
                  : NavigationDecision.prevent;
            },
            onWebResourceError: (error) {
              if (error.isForMainFrame == true && mounted) {
                setState(() => _useFallback = true);
              }
            },
          ),
        )
        ..addJavaScriptChannel(
          'FamiliarBridge',
          onMessageReceived: (message) {
            if (!mounted) return;
            if (message.message == 'ready') {
              _rendererDeadline?.cancel();
              setState(() => _webReady = true);
              unawaited(_sendState());
            } else if (message.message == 'webgl_error' ||
                message.message == 'shader_error' ||
                message.message == 'context_lost') {
              setState(() => _useFallback = true);
            }
          },
        )
        ..loadFlutterAsset('assets/familiar/index.html');
      _controller = controller;
      _rendererDeadline = Timer(const Duration(seconds: 6), () {
        if (mounted && !_webReady) setState(() => _useFallback = true);
      });
    } catch (_) {
      _useFallback = true;
    }
  }

  _FamiliarState _deriveFamiliar() {
    final completed =
        (_curriculum?['completed_lesson_ids'] as List?)?.length ?? 0;
    final recent = _pulses.reversed.take(14).toList();
    final valence = recent.isEmpty
        ? 0.0
        : recent.fold<double>(
                0,
                (sum, pulse) => sum + ((pulse['v'] as num?)?.toDouble() ?? 0),
              ) /
              recent.length;
    final activation = recent.isEmpty
        ? 0.35
        : recent.fold<double>(
                0,
                (sum, pulse) => sum + ((pulse['a'] as num?)?.toDouble() ?? .35),
              ) /
              recent.length;
    final sustainedProgress = (completed / 15).clamp(0.0, 1.0);
    final continuity =
        ((widget.appState.lifetimeAiReflections * 2 +
                    widget.appState.lifetimeNavigatorTurns +
                    widget.appState.lifetimeNavigationSessions * 3) /
                80)
            .clamp(0.0, 1.0);
    return _FamiliarState(
      seed: _stableSeed(widget.appState.session?.email ?? 'local-member'),
      hue:
          168 +
          (_stableSeed(widget.appState.session?.email ?? 'local-member') % 92),
      valence: valence.clamp(-1.0, 1.0),
      activation: activation.clamp(0.0, 1.0),
      growth: sustainedProgress,
      complexity: (sustainedProgress * .68 + continuity * .32).clamp(0.0, 1.0),
      form: (completed / 5).floor().clamp(0, 3) / 3,
      completed: completed,
      continuity: continuity,
    );
  }

  int _stableSeed(String value) {
    var hash = 2166136261;
    for (final unit in value.codeUnits) {
      hash ^= unit;
      hash = (hash * 16777619) & 0x7fffffff;
    }
    return hash;
  }

  Future<void> _sendState() async {
    if (!_webReady || _controller == null) return;
    final reduceMotion = mounted && MediaQuery.disableAnimationsOf(context);
    final payload = _familiar.toJson()..['reduceMotion'] = reduceMotion;
    await _controller!.runJavaScript(
      'window.setFamiliarState(${jsonEncode(payload)})',
    );
  }

  String get _stageName {
    if (_familiar.growth >= .8) return 'Integrated';
    if (_familiar.growth >= .5) return 'Branching';
    if (_familiar.growth >= .2) return 'Awakening';
    return 'Emerging';
  }

  String get _whyChanged {
    if (_familiar.completed == 0 && _familiar.continuity == 0) {
      return 'Your familiar is learning your visual signature. Daily Nav gives Navigator context; modules and approved Recipes shape lasting evolution.';
    }
    final parts = <String>[];
    if (_familiar.completed > 0) {
      parts.add(
        '${_familiar.completed} module${_familiar.completed == 1 ? '' : 's'} completed',
      );
    }
    if (_familiar.continuity > .08) parts.add('recent Navigator continuity');
    if (_pulses.length > 1) parts.add('your recent Pulse trend');
    return 'This form reflects ${parts.join(', ')}. Mood changes its temporary energy; only sustained progress changes its lasting form.';
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
      children: [
        Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Pulse',
                    style: Theme.of(context).textTheme.headlineMedium
                        ?.copyWith(fontWeight: FontWeight.w800),
                  ),
                  const SizedBox(height: 3),
                  Text(
                    'A living portrait of your inner progress',
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                ],
              ),
            ),
            Chip(
              label: Text(_stageName),
              avatar: const Icon(Icons.auto_awesome_rounded, size: 17),
            ),
          ],
        ),
        const SizedBox(height: 14),
        Semantics(
          label: 'Pulse familiar, $_stageName stage',
          child: Container(
            height: 390,
            clipBehavior: Clip.antiAlias,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(28),
              gradient: const RadialGradient(
                center: Alignment(0, -.18),
                radius: .9,
                colors: [
                  Color(0x3327e6c1),
                  Color(0x22183d75),
                  Color(0x00000000),
                ],
              ),
              border: Border.all(
                color: Theme.of(context).colorScheme.primary
                    .withValues(alpha: .34),
              ),
            ),
            child: _loading
                ? const Center(child: CircularProgressIndicator())
                : _useFallback
                ? const Center(
                    child: Icon(Icons.auto_awesome, size: 72),
                  )
                : Stack(
                    fit: StackFit.expand,
                    children: [
                      if (_controller != null)
                        WebViewWidget(controller: _controller!),
                      if (!_webReady)
                        const Center(child: CircularProgressIndicator()),
                    ],
                  ),
          ),
        ),
        const SizedBox(height: 12),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Why your familiar looks this way',
                  style: TextStyle(fontWeight: FontWeight.w800),
                ),
                const SizedBox(height: 6),
                Text(_whyChanged),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),
        _ProgressSignals(
          familiar: _familiar,
          pulses: _pulses,
          summary: _pulseSummary,
        ),
      ],
    );
  }
}

class _FamiliarState {
  const _FamiliarState({
    required this.seed,
    required this.hue,
    required this.valence,
    required this.activation,
    required this.growth,
    required this.complexity,
    required this.form,
    required this.completed,
    required this.continuity,
  });

  factory _FamiliarState.initial(String identity) {
    var seed = 0;
    for (final unit in identity.codeUnits)
      seed = (seed * 31 + unit) & 0x7fffffff;
    return _FamiliarState(
      seed: seed,
      hue: 168 + seed % 92,
      valence: 0,
      activation: .35,
      growth: 0,
      complexity: 0,
      form: 0,
      completed: 0,
      continuity: 0,
    );
  }

  final int seed;
  final int hue;
  final double valence;
  final double activation;
  final double growth;
  final double complexity;
  final double form;
  final int completed;
  final double continuity;

  Map<String, dynamic> toJson() => {
    'seed': seed,
    'hue': hue + (valence * 18).round(),
    'activation': activation,
    'growth': growth,
    'complexity': complexity,
    'form': form,
  };
}

class _ProgressSignals extends StatelessWidget {
  const _ProgressSignals({
    required this.familiar,
    required this.pulses,
    required this.summary,
  });
  final _FamiliarState familiar;
  final List<Map<String, dynamic>> pulses;
  final Map<String, dynamic> summary;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Signals shaping Pulse',
              style: TextStyle(fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 12),
            _Signal(label: 'Module integration', value: familiar.growth),
            _Signal(label: 'Navigator continuity', value: familiar.continuity),
            const Divider(height: 24),
            _SignalSources(summary: summary),
            if (pulses.length > 1) ...[
              const SizedBox(height: 12),
              SizedBox(
                height: 66,
                child: CustomPaint(
                  painter: _PulseTrend(pulses),
                  size: Size.infinite,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                'Recent self-reported trend · context, not a diagnosis',
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _SignalSources extends StatelessWidget {
  const _SignalSources({required this.summary});
  final Map<String, dynamic> summary;

  @override
  Widget build(BuildContext context) {
    final events = (summary['recent_events'] as List?)
            ?.whereType<Map>()
            .map((event) => event.cast<String, dynamic>())
            .toList() ??
        const <Map<String, dynamic>>[];
    final sources = (summary['data_sources'] as List?)
            ?.map((source) => source.toString())
            .toList() ??
        const <String>[];
    final healthEvents = events.where((event) {
      final kind = event['kind']?.toString().toLowerCase() ?? '';
      return kind.contains('sleep') ||
          kind.contains('step') ||
          kind.contains('workout') ||
          kind.contains('heart') ||
          kind.contains('hrv');
    }).toList();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Context and provenance',
          style: TextStyle(fontWeight: FontWeight.w700),
        ),
        const SizedBox(height: 7),
        Text(
          healthEvents.isEmpty
              ? 'No consented sleep, activity, or vital summaries are available yet. Pulse will not guess from missing wearable data.'
              : '${healthEvents.length} recent health or activity summaries are contributing. Raw wearable samples remain on your device.',
        ),
        const SizedBox(height: 8),
        Text(
          sources.isEmpty
              ? 'Current source: your on-device Mind Recipe activity'
              : 'Sources: ${sources.join(', ')}',
          style: Theme.of(context).textTheme.bodySmall,
        ),
        const SizedBox(height: 5),
        Text(
          summary['uncertainty']?.toString() ??
              'Pulse is context, not a diagnosis or a judgment about a good or bad day.',
          style: Theme.of(context).textTheme.bodySmall,
        ),
      ],
    );
  }
}

class _Signal extends StatelessWidget {
  const _Signal({required this.label, required this.value});
  final String label;
  final double value;
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(bottom: 10),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label),
        const SizedBox(height: 4),
        LinearProgressIndicator(
          value: value,
          minHeight: 6,
          borderRadius: BorderRadius.circular(8),
        ),
      ],
    ),
  );
}

class _PulseTrend extends CustomPainter {
  const _PulseTrend(this.pulses);
  final List<Map<String, dynamic>> pulses;
  @override
  void paint(Canvas canvas, Size size) {
    final recent = pulses.reversed.take(20).toList().reversed.toList();
    if (recent.length < 2) return;
    final path = Path();
    for (var i = 0; i < recent.length; i++) {
      final value = ((recent[i]['v'] as num?)?.toDouble() ?? 0).clamp(
        -1.0,
        1.0,
      );
      final point = Offset(
        size.width * i / (recent.length - 1),
        size.height * (.5 - value * .38),
      );
      i == 0
          ? path.moveTo(point.dx, point.dy)
          : path.lineTo(point.dx, point.dy);
    }
    canvas.drawLine(
      Offset(0, size.height / 2),
      Offset(size.width, size.height / 2),
      Paint()..color = Colors.white.withValues(alpha: .14),
    );
    canvas.drawPath(
      path,
      Paint()
        ..color = const Color(0xff27e6c1)
        ..strokeWidth = 2.2
        ..style = PaintingStyle.stroke,
    );
  }

  @override
  bool shouldRepaint(covariant _PulseTrend oldDelegate) =>
      oldDelegate.pulses != pulses;
}

class _FamiliarFallback extends CustomPainter {
  const _FamiliarFallback(this.state);
  final _FamiliarState state;
  @override
  void paint(Canvas canvas, Size size) {
    final center = size.center(Offset.zero);
    final radius = size.shortestSide * (.22 + state.growth * .035);
    final color = HSVColor.fromAHSV(1, state.hue.toDouble(), .72, .9).toColor();
    for (var i = 4; i >= 0; i--) {
      canvas.drawCircle(
        center,
        radius * (1 + i * .18),
        Paint()..color = color.withValues(alpha: .05 + i * .018),
      );
    }
    final path = Path();
    const points = 96;
    for (var i = 0; i <= points; i++) {
      final angle = i / points * math.pi * 2;
      final wave =
          1 +
          math.sin(angle * (4 + state.form * 5) + state.seed % 17) *
              (.05 + state.complexity * .08);
      final point =
          center + Offset(math.cos(angle), math.sin(angle)) * radius * wave;
      i == 0
          ? path.moveTo(point.dx, point.dy)
          : path.lineTo(point.dx, point.dy);
    }
    path.close();
    canvas.drawPath(
      path,
      Paint()
        ..shader = RadialGradient(
          colors: [
            Colors.white.withValues(alpha: .7),
            color,
            color.withValues(alpha: .18),
          ],
        ).createShader(Rect.fromCircle(center: center, radius: radius)),
    );
  }

  @override
  bool shouldRepaint(covariant _FamiliarFallback oldDelegate) =>
      oldDelegate.state != state;
}
