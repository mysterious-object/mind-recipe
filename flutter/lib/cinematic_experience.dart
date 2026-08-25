import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/material.dart';

import 'mind_recipe_fx.dart';

class CinematicOnboarding extends StatefulWidget {
  const CinematicOnboarding({super.key, required this.onComplete});

  final VoidCallback onComplete;

  @override
  State<CinematicOnboarding> createState() => _CinematicOnboardingState();
}

class _CinematicOnboardingState extends State<CinematicOnboarding>
    with SingleTickerProviderStateMixin {
  /// Brand timeline: 0-0.34 ContextField orb draws in · 0.34-0.67 Nav
  /// Compass arrows arrive · 0.67-1 the orb settles into the breathing
  /// Pulse greeter. After the timeline, the scene text cycles with
  /// animated fading — no slides.
  late final AnimationController _timeline;
  Timer? _sceneTimer;
  int _scene = 0;
  bool _brandDone = false;

  static const scenes = [
    (
      'NOTICE',
      'The weather of your mind.',
      'Find your bearing through emotion, energy, body signals, and one clear next step—guided in your own words.',
      'A guided path—not a test.',
    ),
    (
      'NAVIGATE',
      'Build your route back to steady.',
      'Your green zone is personal. Together, you build a recipe from the practices that genuinely help you return.',
      'No universal score. You define what steady means.',
    ),
    (
      'STAY IN CONTROL',
      'A guide that respects your boundaries.',
      'Skip anything. Correct a reflection. Pause at any time. Your private journal is not shared unless you explicitly choose it.',
      'Wellness support—not diagnosis or emergency care.',
    ),
  ];

  @override
  void initState() {
    super.initState();
    _timeline = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 6600),
    );
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (MediaQuery.disableAnimationsOf(context)) {
      _timeline.stop();
      _timeline.value = 1;
      _brandDone = true;
      _startScenes();
    } else if (!_timeline.isAnimating && !_brandDone) {
      _timeline.forward().whenCompleteOrCancel(() {
        if (mounted) {
          setState(() => _brandDone = true);
          _startScenes();
        }
      });
    }
  }

  void _startScenes() {
    _sceneTimer ??= Timer.periodic(const Duration(milliseconds: 4600), (_) {
      if (mounted) setState(() => _scene = (_scene + 1) % scenes.length);
    });
  }

  @override
  void dispose() {
    _sceneTimer?.cancel();
    _timeline.dispose();
    super.dispose();
  }

  void next() => widget.onComplete();

  @override
  Widget build(BuildContext context) {
    final darkTheme = ThemeData(
      brightness: Brightness.dark,
      colorScheme:
          ColorScheme.fromSeed(
            seedColor: MindRecipeFxPalette.primary,
            brightness: Brightness.dark,
          ).copyWith(
            primary: MindRecipeFxPalette.primary,
            secondary: MindRecipeFxPalette.secondary,
            tertiary: MindRecipeFxPalette.livingGreen,
            surface: MindRecipeFxPalette.surfaceBlack,
          ),
      useMaterial3: true,
    );
    final scene = scenes[_scene];

    return Theme(
      data: darkTheme,
      child: Scaffold(
        backgroundColor: MindRecipeFxPalette.voidBlack,
        body: SafeArea(
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 10, 12, 0),
                child: Row(
                  children: [
                    const _MindRecipeWordmark(),
                    const Spacer(),
                    TextButton(
                      onPressed: widget.onComplete,
                      child: const Text('Skip'),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // The orb greeter — ContextField waves, then Nav Compass,
                    // settling into the breathing Pulse orb.
                    AnimatedBuilder(
                      animation: _timeline,
                      builder: (context, _) => SizedBox.square(
                        dimension: 264,
                        child: CustomPaint(
                          painter: _BrandOrbPainter(
                            t: _timeline.value,
                            breathing: _brandDone,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 30),
                    // Animated fading brand + scene text — no slides.
                    AnimatedSwitcher(
                      duration: const Duration(milliseconds: 900),
                      child: !_brandDone
                          ? _BrandText(key: ValueKey(_timeline.value < 0.34 ? 'cf' : 'nc'))
                          : Padding(
                              key: ValueKey('scene-$_scene'),
                              padding: const EdgeInsets.symmetric(horizontal: 28),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    scene.$1,
                                    style: Theme.of(context)
                                        .textTheme
                                        .labelLarge
                                        ?.copyWith(
                                          color: MindRecipeFxPalette.primary,
                                          letterSpacing: 2.4,
                                          fontWeight: FontWeight.w800,
                                        ),
                                  ),
                                  const SizedBox(height: 12),
                                  Text(
                                    scene.$2,
                                    style: Theme.of(context)
                                        .textTheme
                                        .displaySmall
                                        ?.copyWith(
                                            fontWeight: FontWeight.w800,
                                            height: 0.98),
                                  ),
                                  const SizedBox(height: 18),
                                  Text(
                                    scene.$3,
                                    style: Theme.of(context)
                                        .textTheme
                                        .titleMedium
                                        ?.copyWith(
                                            color: Colors.white70,
                                            height: 1.45),
                                  ),
                                  const SizedBox(height: 20),
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 14, vertical: 11),
                                    decoration: BoxDecoration(
                                      color: Colors.white
                                          .withValues(alpha: 0.055),
                                      border: Border.all(
                                        color: MindRecipeFxPalette.primary
                                            .withValues(alpha: 0.22),
                                      ),
                                      borderRadius:
                                          BorderRadius.circular(16),
                                    ),
                                    child: Row(
                                      children: [
                                        const Icon(
                                          Icons.auto_awesome_rounded,
                                          color:
                                              MindRecipeFxPalette.livingGreen,
                                          size: 18,
                                        ),
                                        const SizedBox(width: 9),
                                        Expanded(
                                          child: Text(
                                            scene.$4,
                                            style: Theme.of(context)
                                                .textTheme
                                                .bodyMedium
                                                ?.copyWith(
                                                    color: Colors.white70),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                    ),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(24, 8, 24, 24),
                child: Row(
                  children: [
                    ...List.generate(
                      scenes.length,
                      (index) => AnimatedContainer(
                        duration: const Duration(milliseconds: 320),
                        margin: const EdgeInsets.only(right: 7),
                        width: _brandDone && index == _scene ? 30 : 7,
                        height: 7,
                        decoration: BoxDecoration(
                          gradient: _brandDone && index == _scene
                              ? const LinearGradient(
                                  colors: [
                                    MindRecipeFxPalette.primary,
                                    MindRecipeFxPalette.livingGreen,
                                  ],
                                )
                              : null,
                          color: _brandDone && index == _scene
                              ? null
                              : Colors.white24,
                          borderRadius: BorderRadius.circular(99),
                        ),
                      ),
                    ),
                    const Spacer(),
                    FilledButton.icon(
                      onPressed: next,
                      icon: const Icon(Icons.navigation_rounded),
                      label: const Text('Enter Mind Recipe'),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// The brand orb: ContextField wave-orb → Nav Compass arrows → breathing
/// Pulse greeter. Drawn programmatically so it stays crisp at any size.
class _BrandOrbPainter extends CustomPainter {
  const _BrandOrbPainter({required this.t, required this.breathing});

  final double t;
  final bool breathing;

  static const _sage = Color(0xff8ba07a);
  static const _teal = Color(0xff1d8a8a);
  static const _deepTeal = Color(0xff0f6b6b);

  @override
  void paint(Canvas canvas, Size size) {
    if (size.isEmpty) return;
    final center = size.center(Offset.zero);
    final radius = size.shortestSide * 0.30;
    final breathe = breathing
        ? 1 + math.sin(t * math.pi * 2) * 0.05
        : 1.0;

    // ContextField wave-orb reveal: waves sweep in during t 0..0.3.
    final waveReveal = (t / 0.30).clamp(0.0, 1.0);
    _paintWaves(canvas, center, radius * breathe, waveReveal);

    // Circle outline fades in with the waves.
    canvas.drawCircle(
      center,
      radius * breathe,
      Paint()
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2.2
        ..color = _sage.withValues(alpha: 0.85 * waveReveal),
    );

    // Left dot + right dot/line (ContextField mark).
    final cfFade = waveReveal;
    canvas.drawCircle(
      center - Offset(radius * 1.28, 0),
      5.5,
      Paint()..color = _sage.withValues(alpha: 0.9 * cfFade),
    );
    canvas.drawCircle(
      center + Offset(radius * 1.18, 0),
      7.5,
      Paint()..color = _sage.withValues(alpha: 0.9 * cfFade),
    );
    canvas.drawLine(
      center + Offset(radius * 0.72, 0),
      center + Offset(radius * 1.02, 0),
      Paint()
        ..strokeWidth = 2
        ..color = _sage.withValues(alpha: 0.9 * cfFade),
    );

    // Nav Compass arrows + diagonal dots: rotate/fade in during t 0.34..0.62.
    final compassT = ((t - 0.34) / 0.28).clamp(0.0, 1.0);
    if (compassT > 0) {
      final fade = Curves.easeOut.transform(compassT);
      final spin = (1 - compassT) * 0.6;
      canvas.save();
      canvas.translate(center.dx, center.dy);
      canvas.rotate(spin);
      for (final angleDeg in const [0.0, 90.0, 180.0, 270.0]) {
        canvas.save();
        canvas.rotate(angleDeg * math.pi / 180);
        _paintCompassArrow(canvas, radius);
        canvas.restore();
      }
      canvas.restore();
      for (final diag in const [45.0, 135.0, 225.0, 315.0]) {
        final a = diag * math.pi / 180;
        final p = center + Offset(math.cos(a), math.sin(a)) * radius * 1.12;
        canvas.drawCircle(
          p,
          4.5,
          Paint()..color = _teal.withValues(alpha: 0.9 * fade),
        );
      }
    }

    // Breathing Pulse greeter glow once the brand sequence settles.
    if (breathing) {
      final pulse = 0.96 + math.sin(t * math.pi * 2) * 0.05;
      canvas.drawCircle(
        center,
        radius * 1.55 * pulse,
        Paint()
          ..shader = RadialGradient(colors: [
            const Color(0x3300e5cc),
            const Color(0x0000e5cc),
          ]).createShader(Rect.fromCircle(center: center, radius: radius * 1.55 * pulse)),
      );
    }
  }

  void _paintWaves(Canvas canvas, Offset center, double radius, double reveal) {
    final steps = 40;
    final waves = [
      (-1.0, _sage, 2.0),
      (-0.72, _sage, 1.7),
      (-0.45, _sage, 1.5),
      (-0.2, _sage, 1.3),
      (0.22, _deepTeal, 1.6),
      (0.5, _teal, 1.9),
      (0.8, _teal, 2.2),
    ];
    for (final (offsetFrac, color, width) in waves) {
      final paint = Paint()
        ..color = color.withValues(alpha: 0.92)
        ..style = PaintingStyle.stroke
        ..strokeWidth = width;
      final path = Path();
      var added = 0;
      for (var i = 0; i <= steps; i++) {
        final f = i / steps;
        if (f > reveal) break;
        final x = center.dx - radius * 0.92 + f * radius * 1.84;
        final arc = math.sin(f * math.pi) *
            radius *
            (0.55 + offsetFrac.abs() * 0.5) *
            (offsetFrac < 0 ? -1 : 1) *
            (0.9 + offsetFrac.abs() * 0.2);
        final y = center.dy + arc * (offsetFrac < 0 ? 0.55 : 0.75);
        added == 0 ? path.moveTo(x, y) : path.lineTo(x, y);
        added++;
      }
      canvas.drawPath(path, paint);
    }
  }

  void _paintCompassArrow(Canvas canvas, double radius) {
    // Slim arrow with notch, pointing up, tip just outside the circle.
    final tip = Offset(0, -radius * 1.42);
    final baseL = Offset(-radius * 0.16, -radius * 1.02);
    final baseR = Offset(radius * 0.16, -radius * 1.02);
    final notch = Offset(0, -radius * 1.14);
    final path = Path()
      ..moveTo(tip.dx, tip.dy)
      ..lineTo(baseL.dx, baseL.dy)
      ..lineTo(notch.dx, notch.dy)
      ..lineTo(baseR.dx, baseR.dy)
      ..close();
    canvas.drawPath(path, Paint()..color = _sage.withValues(alpha: 0.95));
    canvas.drawPath(
      path,
      Paint()
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1
        ..color = Colors.white.withValues(alpha: 0.35),
    );
  }

  @override
  bool shouldRepaint(covariant _BrandOrbPainter old) =>
      old.t != t || old.breathing != breathing;
}

class _BrandText extends StatelessWidget {
  const _BrandText({super.key});

  @override
  Widget build(BuildContext context) => Column(
        children: [
          Text(
            'ContextField',
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.5,
                  color: Colors.white,
                ),
          ),
          const SizedBox(height: 6),
          Text(
            'A S S U M E   C O M P L E X I T Y .',
            style: Theme.of(context).textTheme.labelMedium?.copyWith(
                  color: MindRecipeFxPalette.livingGreen,
                  letterSpacing: 2.2,
                ),
          ),
          const SizedBox(height: 22),
          Text(
            'Nav Compass',
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.5,
                  color: Colors.white,
                ),
          ),
          const SizedBox(height: 6),
          Text(
            'O R I E N T .   C H O O S E .   M O V E   F O R W A R D .',
            style: Theme.of(context).textTheme.labelMedium?.copyWith(
                  color: MindRecipeFxPalette.primary,
                  letterSpacing: 2.2,
                ),
          ),
        ],
      );
}

class _SceneView extends StatelessWidget {
  const _SceneView({required this.scene, required this.index});

  final _OnboardingScene scene;
  final int index;

  @override
  Widget build(BuildContext context) => LayoutBuilder(
    builder: (context, constraints) {
      final compact = constraints.maxHeight < 620;
      return SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 28),
        child: ConstrainedBox(
          constraints: BoxConstraints(minHeight: constraints.maxHeight),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: CinematicPresence(
                  size: compact ? 150 : 210,
                  icon: scene.icon,
                  phaseOffset: index * 0.8,
                ),
              ),
              SizedBox(height: compact ? 24 : 42),
              Text(
                scene.eyebrow,
                style: Theme.of(context).textTheme.labelLarge?.copyWith(
                  color: MindRecipeFxPalette.primary,
                  letterSpacing: 2.4,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                scene.title,
                style: Theme.of(context).textTheme.displaySmall
                    ?.copyWith(fontWeight: FontWeight.w800, height: 0.98),
              ),
              const SizedBox(height: 18),
              Text(
                scene.body,
                style: Theme.of(context).textTheme.titleMedium
                    ?.copyWith(color: Colors.white70, height: 1.45),
              ),
              const SizedBox(height: 20),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 14,
                  vertical: 11,
                ),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.055),
                  border: Border.all(
                    color: MindRecipeFxPalette.primary.withValues(alpha: 0.22),
                  ),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  children: [
                    const Icon(
                      Icons.auto_awesome_rounded,
                      color: MindRecipeFxPalette.livingGreen,
                      size: 18,
                    ),
                    const SizedBox(width: 9),
                    Expanded(
                      child: Text(
                        scene.detail,
                        style: Theme.of(context).textTheme.bodyMedium
                            ?.copyWith(color: Colors.white70),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      );
    },
  );
}

class CinematicPresence extends StatefulWidget {
  const CinematicPresence({
    super.key,
    this.size = 68,
    this.icon,
    this.phaseOffset = 0,
  });

  final double size;
  final IconData? icon;
  final double phaseOffset;

  @override
  State<CinematicPresence> createState() => _CinematicPresenceState();
}

class _CinematicPresenceState extends State<CinematicPresence>
    with SingleTickerProviderStateMixin {
  late final AnimationController controller;
  bool reducedMotion = false;

  @override
  void initState() {
    super.initState();
    controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 5200),
    );
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final reduced = MediaQuery.disableAnimationsOf(context);
    if (reduced == reducedMotion && controller.isAnimating) return;
    reducedMotion = reduced;
    if (reduced) {
      controller.stop();
      controller.value = 0.42;
    } else if (!controller.isAnimating) {
      controller.repeat();
    }
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => RepaintBoundary(
    child: SizedBox.square(
      dimension: widget.size,
      child: AnimatedBuilder(
        animation: controller,
        builder: (context, child) => CustomPaint(
          painter: _PresencePainter(
            progress: controller.value + widget.phaseOffset,
          ),
          child: child,
        ),
        child: widget.icon == null
            ? null
            : Center(
                child: Icon(
                  widget.icon,
                  size: widget.size * 0.24,
                  color: Colors.white.withValues(alpha: 0.9),
                ),
              ),
      ),
    ),
  );
}

class LivingAssistantCard extends StatefulWidget {
  const LivingAssistantCard({
    super.key,
    required this.message,
    required this.caption,
  });

  final String message;
  final String caption;

  @override
  State<LivingAssistantCard> createState() => _LivingAssistantCardState();
}

class _LivingAssistantCardState extends State<LivingAssistantCard> {
  Timer? timer;
  bool thinking = false;

  @override
  void didUpdateWidget(covariant LivingAssistantCard oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.message == widget.message) return;
    timer?.cancel();
    if (MediaQuery.disableAnimationsOf(context)) return;
    setState(() => thinking = true);
    timer = Timer(const Duration(milliseconds: 420), () {
      if (mounted) setState(() => thinking = false);
    });
  }

  @override
  void dispose() {
    timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Semantics(
      liveRegion: true,
      label: thinking ? 'Mind Recipe is preparing a reflection' : widget.message,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Color.alphaBlend(
                MindRecipeFxPalette.primary.withValues(alpha: 0.11),
                scheme.surfaceContainer,
              ),
              Color.alphaBlend(
                MindRecipeFxPalette.secondary.withValues(alpha: 0.08),
                scheme.surfaceContainer,
              ),
            ],
          ),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: MindRecipeFxPalette.primary.withValues(alpha: 0.24),
          ),
          boxShadow: [
            BoxShadow(
              color: MindRecipeFxPalette.primary.withValues(alpha: 0.09),
              blurRadius: 28,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const CinematicPresence(size: 66),
            const SizedBox(width: 13),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        'NAVIGATOR',
                        style: Theme.of(context).textTheme.labelMedium
                            ?.copyWith(
                              fontWeight: FontWeight.w800,
                              letterSpacing: 1.3,
                            ),
                      ),
                      const SizedBox(width: 7),
                      Container(
                        width: 6,
                        height: 6,
                        decoration: const BoxDecoration(
                          color: MindRecipeFxPalette.livingGreen,
                          shape: BoxShape.circle,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  AnimatedSwitcher(
                    duration: const Duration(milliseconds: 320),
                    child: thinking
                        ? const _ThinkingIndicator(key: ValueKey('thinking'))
                        : Text(
                            widget.message,
                            key: ValueKey(widget.message),
                            style: Theme.of(context).textTheme.bodyLarge
                                ?.copyWith(height: 1.35),
                          ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    widget.caption,
                    style: Theme.of(context).textTheme.bodySmall
                        ?.copyWith(color: scheme.onSurfaceVariant),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ThinkingIndicator extends StatelessWidget {
  const _ThinkingIndicator({super.key});

  @override
  Widget build(BuildContext context) => const Row(
    children: [
      _ThinkingDot(opacity: 0.45),
      SizedBox(width: 5),
      _ThinkingDot(opacity: 0.7),
      SizedBox(width: 5),
      _ThinkingDot(opacity: 1),
    ],
  );
}

class _ThinkingDot extends StatelessWidget {
  const _ThinkingDot({required this.opacity});
  final double opacity;

  @override
  Widget build(BuildContext context) => Container(
    width: 7,
    height: 7,
    decoration: BoxDecoration(
      color: MindRecipeFxPalette.primary.withValues(alpha: opacity),
      shape: BoxShape.circle,
    ),
  );
}

class _MindRecipeWordmark extends StatelessWidget {
  const _MindRecipeWordmark();

  @override
  Widget build(BuildContext context) => const Row(
    children: [
      Icon(Icons.navigation_rounded, color: MindRecipeFxPalette.primary),
      SizedBox(width: 8),
      Text(
        'NAVIGATOR',
        style: TextStyle(fontWeight: FontWeight.w900, letterSpacing: 1.7),
      ),
    ],
  );
}

class _OnboardingScene {
  const _OnboardingScene({
    required this.eyebrow,
    required this.title,
    required this.body,
    required this.detail,
    required this.icon,
  });

  final String eyebrow;
  final String title;
  final String body;
  final String detail;
  final IconData icon;
}

class _PresencePainter extends CustomPainter {
  const _PresencePainter({required this.progress});
  final double progress;

  @override
  void paint(Canvas canvas, Size size) {
    final center = size.center(Offset.zero);
    final radius = size.shortestSide * 0.31;
    final pulse = 0.96 + math.sin(progress * math.pi * 2) * 0.045;
    final glowRadius = radius * 1.62 * pulse;
    canvas.drawCircle(
      center,
      glowRadius,
      Paint()
        ..shader = const RadialGradient(
          colors: [Color(0x6600e5cc), Color(0x227c3aed), Color(0x0000e5cc)],
          stops: [0, 0.48, 1],
        ).createShader(Rect.fromCircle(center: center, radius: glowRadius)),
    );
    canvas.drawCircle(
      center,
      radius * pulse,
      Paint()
        ..shader = LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: const [
            MindRecipeFxPalette.primary,
            MindRecipeFxPalette.livingGreen,
            MindRecipeFxPalette.secondary,
          ],
          transform: GradientRotation(progress * math.pi * 2),
        ).createShader(Rect.fromCircle(center: center, radius: radius)),
    );
    for (var i = 0; i < 3; i++) {
      final orbit = radius * (1.22 + i * 0.17);
      final angle = progress * math.pi * 2 * (i.isEven ? 1 : -0.72) + i * 2.1;
      final point = center + Offset(math.cos(angle), math.sin(angle)) * orbit;
      canvas.drawCircle(
        point,
        1.8 + i * 0.6,
        Paint()
          ..color = [
            MindRecipeFxPalette.primary,
            MindRecipeFxPalette.livingGreen,
            MindRecipeFxPalette.secondary,
          ][i].withValues(alpha: 0.8),
      );
    }
  }

  @override
  bool shouldRepaint(covariant _PresencePainter oldDelegate) =>
      oldDelegate.progress != progress;
}
