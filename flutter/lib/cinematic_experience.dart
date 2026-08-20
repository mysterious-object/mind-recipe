import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/material.dart';

import 'mind_nav_fx.dart';

class CinematicOnboarding extends StatefulWidget {
  const CinematicOnboarding({super.key, required this.onComplete});

  final VoidCallback onComplete;

  @override
  State<CinematicOnboarding> createState() => _CinematicOnboardingState();
}

class _CinematicOnboardingState extends State<CinematicOnboarding> {
  final pageController = PageController();
  int page = 0;

  static const scenes = [
    _OnboardingScene(
      eyebrow: 'NOTICE',
      title: 'The weather of your mind.',
      body: 'Find your bearing through emotion, energy, body signals, and one clear next step—guided in your own words.',
      detail: 'A guided path—not a test.',
      icon: Icons.air_rounded,
    ),
    _OnboardingScene(
      eyebrow: 'NAVIGATE',
      title: 'Build your route back to steady.',
      body: 'Your green zone is personal. Together, you build a toolbox from the practices that genuinely help you return.',
      detail: 'No universal score. You define what steady means.',
      icon: Icons.explore_rounded,
    ),
    _OnboardingScene(
      eyebrow: 'STAY IN CONTROL',
      title: 'A guide that respects your boundaries.',
      body: 'Skip anything. Correct a reflection. Pause at any time. Your private journal is not shared unless you explicitly choose it.',
      detail: 'Wellness support—not diagnosis or emergency care.',
      icon: Icons.shield_outlined,
    ),
  ];

  @override
  void dispose() {
    pageController.dispose();
    super.dispose();
  }

  void next() {
    if (page == scenes.length - 1) {
      widget.onComplete();
      return;
    }
    final reduceMotion = MediaQuery.disableAnimationsOf(context);
    pageController.animateToPage(
      page + 1,
      duration: reduceMotion
          ? Duration.zero
          : const Duration(milliseconds: 650),
      curve: Curves.easeOutQuint,
    );
  }

  @override
  Widget build(BuildContext context) {
    final darkTheme = ThemeData(
      brightness: Brightness.dark,
      colorScheme:
          ColorScheme.fromSeed(
            seedColor: MindNavFxPalette.primary,
            brightness: Brightness.dark,
          ).copyWith(
            primary: MindNavFxPalette.primary,
            secondary: MindNavFxPalette.secondary,
            tertiary: MindNavFxPalette.livingGreen,
            surface: MindNavFxPalette.surfaceBlack,
          ),
      useMaterial3: true,
    );

    return Theme(
      data: darkTheme,
      child: Scaffold(
        backgroundColor: MindNavFxPalette.voidBlack,
        body: AnimatedBuilder(
          animation: pageController,
          builder: (context, _) {
            final progress = pageController.hasClients
                ? pageController.page ?? page.toDouble()
                : page.toDouble();
            return Stack(
              children: [
                Positioned.fill(child: MindNavGpuField(progress: progress)),
                Positioned.fill(child: MindNavFxBackdrop(progress: progress)),
                SafeArea(
                  child: Column(
                    children: [
                      Padding(
                        padding: const EdgeInsets.fromLTRB(20, 10, 12, 0),
                        child: Row(
                          children: [
                            const _MindNavWordmark(),
                            const Spacer(),
                            TextButton(
                              onPressed: widget.onComplete,
                              child: const Text('Skip'),
                            ),
                          ],
                        ),
                      ),
                      Expanded(
                        child: PageView.builder(
                          controller: pageController,
                          itemCount: scenes.length,
                          onPageChanged: (value) =>
                              setState(() => page = value),
                          itemBuilder: (context, index) =>
                              _SceneView(scene: scenes[index], index: index),
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
                                width: index == page ? 30 : 7,
                                height: 7,
                                decoration: BoxDecoration(
                                  gradient: index == page
                                      ? const LinearGradient(
                                          colors: [
                                            MindNavFxPalette.primary,
                                            MindNavFxPalette.livingGreen,
                                          ],
                                        )
                                      : null,
                                  color: index == page ? null : Colors.white24,
                                  borderRadius: BorderRadius.circular(99),
                                ),
                              ),
                            ),
                            const Spacer(),
                            FilledButton.icon(
                              onPressed: next,
                              icon: Icon(
                                page == scenes.length - 1
                                    ? Icons.navigation_rounded
                                    : Icons.arrow_forward_rounded,
                              ),
                              label: Text(
                                page == scenes.length - 1
                                    ? 'Enter Mind Nav'
                                    : 'Continue',
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
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
                  color: MindNavFxPalette.primary,
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
                    color: MindNavFxPalette.primary.withValues(alpha: 0.22),
                  ),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  children: [
                    const Icon(
                      Icons.auto_awesome_rounded,
                      color: MindNavFxPalette.livingGreen,
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
    this.size = 58,
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
      label: thinking ? 'Mind Nav is preparing a reflection' : widget.message,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Color.alphaBlend(
                MindNavFxPalette.primary.withValues(alpha: 0.11),
                scheme.surfaceContainer,
              ),
              Color.alphaBlend(
                MindNavFxPalette.secondary.withValues(alpha: 0.08),
                scheme.surfaceContainer,
              ),
            ],
          ),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: MindNavFxPalette.primary.withValues(alpha: 0.24),
          ),
          boxShadow: [
            BoxShadow(
              color: MindNavFxPalette.primary.withValues(alpha: 0.09),
              blurRadius: 28,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const CinematicPresence(size: 54),
            const SizedBox(width: 13),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        'MIND NAV',
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
                          color: MindNavFxPalette.livingGreen,
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
      color: MindNavFxPalette.primary.withValues(alpha: opacity),
      shape: BoxShape.circle,
    ),
  );
}

class _MindNavWordmark extends StatelessWidget {
  const _MindNavWordmark();

  @override
  Widget build(BuildContext context) => const Row(
    children: [
      Icon(Icons.navigation_rounded, color: MindNavFxPalette.primary),
      SizedBox(width: 8),
      Text(
        'MIND NAV',
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
            MindNavFxPalette.primary,
            MindNavFxPalette.livingGreen,
            MindNavFxPalette.secondary,
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
            MindNavFxPalette.primary,
            MindNavFxPalette.livingGreen,
            MindNavFxPalette.secondary,
          ][i].withValues(alpha: 0.8),
      );
    }
  }

  @override
  bool shouldRepaint(covariant _PresencePainter oldDelegate) =>
      oldDelegate.progress != progress;
}
