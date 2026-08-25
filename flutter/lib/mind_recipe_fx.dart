import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/material.dart';

import 'motion_field.dart';

/// Mind Recipe visual tokens adapted from an internal effects system.

abstract final class MindRecipeFxPalette {
  static const primary = Color(0xff00e5cc);
  static const secondary = Color(0xff7c3aed);
  static const livingGreen = Color(0xff00e68a);
  static const amber = Color(0xfff5a623);
  static const danger = Color(0xffff3b5c);
  static const voidBlack = Color(0xff020203);
  static const surfaceBlack = Color(0xff0a0a0c);
}

/// GPU field used on native mobile instead of embedding a browser WebGL view.
/// It preserves the fluid shader language while staying inside Flutter's
/// renderer and gracefully disappears if shader compilation is unavailable.
class MindRecipeGpuField extends StatefulWidget {
  const MindRecipeGpuField({super.key, required this.progress, this.variant = 'field'});

  final double progress;
  final String variant;

  @override
  State<MindRecipeGpuField> createState() => _MindRecipeGpuFieldState();
}

class _MindRecipeGpuFieldState extends State<MindRecipeGpuField>
    with SingleTickerProviderStateMixin {
  late final AnimationController controller;
  ui.FragmentProgram? program;

  @override
  void initState() {
    super.initState();
    controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 18),
    );
    MotionField.instance.ensureStarted();
    MotionField.instance.addListener(_onMotion);
    ui.FragmentProgram.fromAsset('shaders/mind_recipe_field.frag')
        .then((loaded) {
          if (mounted) setState(() => program = loaded);
        })
        .catchError((Object _) {
          // The CustomPainter fallback remains visible on unsupported targets.
        });
  }

  void _onMotion() {
    if (mounted) setState(() {});
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (MediaQuery.disableAnimationsOf(context)) {
      controller.stop();
      controller.value = 0.35;
    } else if (!controller.isAnimating) {
      controller.repeat();
    }
  }

  @override
  void dispose() {
    MotionField.instance.removeListener(_onMotion);
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final loaded = program;
    if (loaded == null) return const SizedBox.expand();
    final dark = Theme.of(context).brightness == Brightness.dark;
    final wash = _washForVariant(widget.variant, dark);
    final tilt = MotionField.instance.tilt;
    // Variant-specific progress offset makes the shader animate differently per variant
    final variantProgress = widget.progress + _variantProgressOffset(widget.variant);
    return IgnorePointer(
      child: RepaintBoundary(
        child: AnimatedBuilder(
          animation: controller,
          builder: (context, _) => Stack(
            children: [
              CustomPaint(
                painter: _MindRecipeGpuPainter(
                  program: loaded,
                  time: controller.value * 18,
                  progress: variantProgress,
                  dark: dark,
                  variantIndex: _variantIndex(widget.variant),
                  tiltX: tilt.dx,
                  tiltY: tilt.dy,
                ),
                size: Size.infinite,
              ),
              // Strong variant tint – whole moving background changes
              Positioned.fill(
                child: IgnorePointer(
                  child: Container(
                    color: wash.withValues(alpha: dark ? 0.22 : 0.14),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  double _variantProgressOffset(String v) => switch (v) {
    'field' => 0.0,
    'nebula' => 0.18,
    'rivers' => 0.31,
    'tendrils' => 0.44,
    'orbs' => 0.59,
    'lattice' => 0.72,
    'void' => 0.80,
    'prism' => 0.93,
    'aurora' => 1.06,
    'ember' => 1.21,
    'ocean' => 1.34,
    'twilight' => 1.48,
    _ => 0.0,
  };

  /// Index passed to the shader's uVariant uniform — must match the GLSL
  /// branch order in shaders/mind_recipe_field.frag.
  double _variantIndex(String v) => switch (v) {
    'field' => 0,
    'nebula' => 1,
    'rivers' => 2,
    'tendrils' => 3,
    'orbs' => 4,
    'lattice' => 5,
    'void' => 6,
    'prism' => 7,
    'aurora' => 8,
    'ember' => 9,
    'ocean' => 10,
    'twilight' => 11,
    _ => 0,
  }.toDouble();

  Color _washForVariant(String v, bool dark) => switch (v) {
    'field' => const Color(0xff001a1a),
    'nebula' => const Color(0xff1a1033),
    'rivers' => const Color(0xff002a3a),
    'tendrils' => const Color(0xff1a2a1a),
    'orbs' => const Color(0xff2a1a2a),
    'lattice' => const Color(0xff1a1a2a),
    'void' => const Color(0xff0a0a0a),
    'prism' => const Color(0xff1a0033),
    'aurora' => const Color(0xff1a0a2a),
    'ember' => const Color(0xff2a0f00),
    'ocean' => const Color(0xff001a2a),
    'twilight' => const Color(0xff0f0a2a),
    _ => const Color(0xff001a1a),
  };
}

class _MindRecipeGpuPainter extends CustomPainter {
  const _MindRecipeGpuPainter({
    required this.program,
    required this.time,
    required this.progress,
    required this.dark,
    this.variantIndex = 0,
    this.tiltX = 0,
    this.tiltY = 0,
  });

  final ui.FragmentProgram program;
  final double time;
  final double progress;
  final bool dark;
  final double variantIndex;
  final double tiltX;
  final double tiltY;

  @override
  void paint(Canvas canvas, Size size) {
    if (size.isEmpty) return;
    final shader = program.fragmentShader()
      ..setFloat(0, size.width)
      ..setFloat(1, size.height)
      ..setFloat(2, time)
      ..setFloat(3, progress)
      ..setFloat(4, dark ? 1 : 0)
      ..setFloat(5, variantIndex)
      ..setFloat(6, tiltX)
      ..setFloat(7, tiltY);
    canvas.drawRect(Offset.zero & size, Paint()..shader = shader);
    shader.dispose();
  }

  @override
  bool shouldRepaint(covariant _MindRecipeGpuPainter oldDelegate) =>
      oldDelegate.time != time ||
      oldDelegate.progress != progress ||
      oldDelegate.dark != dark ||
      oldDelegate.tiltX != tiltX ||
      oldDelegate.tiltY != tiltY ||
      oldDelegate.program != program;
}

/// Lightweight, Flutter-native visual effects driven by navigation progress.
///
/// Mind Recipe FX intentionally has no continuous ticker. It morphs while the user
/// swipes or changes pages, which keeps idle battery use at zero and makes the
/// experience compatible with reduced-motion preferences.
class MindRecipeFxBackdrop extends StatefulWidget {
  const MindRecipeFxBackdrop({super.key, required this.progress, this.variant = 'field'});

  final double progress;
  final String variant;

  @override
  State<MindRecipeFxBackdrop> createState() => _MindRecipeFxBackdropState();
}

class _MindRecipeFxBackdropState extends State<MindRecipeFxBackdrop>
    with SingleTickerProviderStateMixin {
  late final AnimationController ticker;

  @override
  void initState() {
    super.initState();
    ticker = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 16),
    );
    MotionField.instance.ensureStarted();
    MotionField.instance.addListener(_onMotion);
  }

  void _onMotion() {
    if (mounted) setState(() {});
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (MediaQuery.disableAnimationsOf(context)) {
      ticker.stop();
      ticker.value = 0.4;
    } else if (!ticker.isAnimating) {
      ticker.repeat();
    }
  }

  @override
  void dispose() {
    MotionField.instance.removeListener(_onMotion);
    ticker.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final dark = Theme.of(context).brightness == Brightness.dark;
    final tilt = MotionField.instance.tilt;
    return IgnorePointer(
      child: RepaintBoundary(
        child: CustomPaint(
          painter: _MindRecipeFxPainter(
            progress: widget.progress,
            time: ticker.value * 16,
            tilt: tilt,
            primary: scheme.primary,
            secondary: scheme.secondary,
            dark: dark,
            variant: widget.variant,
          ),
          size: Size.infinite,
        ),
      ),
    );
  }
}

/// Compact animated orb — the Navigator's signature mark. Used as the
/// bubble icon and anywhere a small living presence is needed.
class MindRecipeOrbBadge extends StatefulWidget {
  const MindRecipeOrbBadge({
    super.key,
    this.size = 24,
    this.active = false,
  });

  final double size;

  /// When active (speaking/listening) the orb breathes faster and brighter.
  final bool active;

  @override
  State<MindRecipeOrbBadge> createState() => _MindRecipeOrbBadgeState();
}

class _MindRecipeOrbBadgeState extends State<MindRecipeOrbBadge>
    with SingleTickerProviderStateMixin {
  late final AnimationController controller;

  @override
  void initState() {
    super.initState();
    controller = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: widget.active ? 1800 : 4200),
    );
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (MediaQuery.disableAnimationsOf(context)) {
      controller.stop();
      controller.value = 0.4;
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
  Widget build(BuildContext context) => SizedBox.square(
        dimension: widget.size,
        child: AnimatedBuilder(
          animation: controller,
          builder: (context, _) => CustomPaint(
            painter: _OrbBadgePainter(
              t: controller.value,
              active: widget.active,
            ),
          ),
        ),
      );
}

class _OrbBadgePainter extends CustomPainter {
  const _OrbBadgePainter({required this.t, required this.active});

  final double t;
  final bool active;

  @override
  void paint(Canvas canvas, Size size) {
    if (size.isEmpty) return;
    final center = size.center(Offset.zero);
    final base = size.shortestSide * 0.34;
    final breathe = 1 + math.sin(t * math.pi * 2) * (active ? 0.14 : 0.07);
    final core = active ? const Color(0xff00e5cc) : const Color(0xff00b399);

    canvas.drawCircle(
      center,
      base * 1.7 * breathe,
      Paint()
        ..shader = RadialGradient(colors: [
          core.withValues(alpha: active ? 0.35 : 0.18),
          core.withValues(alpha: 0),
        ]).createShader(Rect.fromCircle(center: center, radius: base * 1.7 * breathe)),
    );
    canvas.drawCircle(
      center,
      base * breathe,
      Paint()
        ..shader = RadialGradient(colors: [
          core.withValues(alpha: 0.95),
          const Color(0xff7c3aed).withValues(alpha: 0.55),
          core.withValues(alpha: 0.1),
        ]).createShader(Rect.fromCircle(center: center, radius: base * breathe)),
    );
    canvas.drawCircle(
      center - Offset(base * 0.22, base * 0.28),
      base * 0.2 * breathe,
      Paint()..color = Colors.white.withValues(alpha: 0.35),
    );
  }

  @override
  bool shouldRepaint(covariant _OrbBadgePainter old) =>
      old.t != t || old.active != active;
}

class MindRecipePageRail extends StatelessWidget {  const MindRecipePageRail({
    super.key,
    required this.labels,
    required this.icons,
    required this.selectedIndex,
    required this.progress,
    required this.scrollController,
    required this.onSelected,
  });

  final List<String> labels;
  final List<IconData> icons;
  final int selectedIndex;
  final double progress;
  final ScrollController scrollController;
  final ValueChanged<int> onSelected;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final scheme = theme.colorScheme;
    final reduceMotion = MediaQuery.disableAnimationsOf(context);
    final duration = reduceMotion
        ? Duration.zero
        : const Duration(milliseconds: 360);
    final pageFraction = labels.isEmpty
        ? 0.0
        : ((progress + 1) / labels.length).clamp(0.0, 1.0);

    return Material(
      color: Color.alphaBlend(
        scheme.primary.withValues(alpha: 0.04),
        scheme.surface,
      ),
      elevation: 4,
      child: SafeArea(
        top: false,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Align(
              alignment: Alignment.centerLeft,
              child: FractionallySizedBox(
                widthFactor: math.max(0.06, pageFraction),
                child: Container(
                  height: 3,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [
                        MindRecipeFxPalette.primary,
                        MindRecipeFxPalette.livingGreen,
                        MindRecipeFxPalette.secondary,
                      ],
                    ),
                    borderRadius: BorderRadius.circular(999),
                  ),
                ),
              ),
            ),
            SizedBox(
              height: 74,
              child: ListView.separated(
                controller: scrollController,
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
                scrollDirection: Axis.horizontal,
                itemCount: labels.length,
                separatorBuilder: (_, _) => const SizedBox(width: 4),
                itemBuilder: (context, itemIndex) {
                  final selected = itemIndex == selectedIndex;
                  return Semantics(
                    container: true,
                    excludeSemantics: true,
                    selected: selected,
                    button: true,
                    label:
                        '${labels[itemIndex]}, tab ${itemIndex + 1} of ${labels.length}',
                    child: AnimatedContainer(
                      duration: duration,
                      curve: Curves.easeOutCubic,
                      width: selected ? 156 : 62,
                      decoration: BoxDecoration(
                        color: selected
                            ? scheme.primaryContainer
                            : Colors.transparent,
                        borderRadius: BorderRadius.circular(22),
                        boxShadow: selected
                            ? [
                                BoxShadow(
                                  color: scheme.primary.withValues(alpha: 0.16),
                                  blurRadius: 14,
                                  offset: const Offset(0, 5),
                                ),
                              ]
                            : null,
                      ),
                      child: InkWell(
                        borderRadius: BorderRadius.circular(22),
                        onTap: () => onSelected(itemIndex),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            AnimatedScale(
                              duration: duration,
                              scale: selected ? 1.08 : 1,
                              child: Icon(
                                icons[itemIndex],
                                color: selected
                                    ? scheme.onPrimaryContainer
                                    : scheme.onSurfaceVariant,
                              ),
                            ),
                            Flexible(
                              child: AnimatedSize(
                                duration: duration,
                                curve: Curves.easeOutCubic,
                                child: selected
                                    ? Padding(
                                        padding: const EdgeInsets.only(left: 7),
                                        child: Text(
                                          labels[itemIndex],
                                          maxLines: 1,
                                          softWrap: false,
                                          overflow: TextOverflow.fade,
                                          style: theme.textTheme.labelLarge
                                              ?.copyWith(
                                                color:
                                                    scheme.onPrimaryContainer,
                                              ),
                                        ),
                                      )
                                    : const SizedBox.shrink(),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
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

class MindRecipePageTitle extends StatelessWidget {
  const MindRecipePageTitle({
    super.key,
    required this.title,
    required this.forward,
  });

  final String title;
  final bool forward;

  @override
  Widget build(BuildContext context) {
    final reduceMotion = MediaQuery.disableAnimationsOf(context);
    return AnimatedSwitcher(
      duration: reduceMotion
          ? Duration.zero
          : const Duration(milliseconds: 320),
      switchInCurve: Curves.easeOutCubic,
      switchOutCurve: Curves.easeInCubic,
      transitionBuilder: (child, animation) {
        if (reduceMotion) return child;
        final begin = Offset(forward ? 0.18 : -0.18, 0);
        return FadeTransition(
          opacity: animation,
          child: SlideTransition(
            position: Tween(begin: begin, end: Offset.zero).animate(animation),
            child: child,
          ),
        );
      },
      child: Text(title, key: ValueKey(title)),
    );
  }
}

class _MindRecipeFxPainter extends CustomPainter {
  const _MindRecipeFxPainter({
    required this.progress,
    required this.primary,
    required this.secondary,
    required this.dark,
    this.variant = 'field',
    this.time = 0,
    this.tilt = Offset.zero,
  });

  final double progress;
  final Color primary;
  final Color secondary;
  final bool dark;
  final String variant;
  final double time;
  final Offset tilt;

  @override
  void paint(Canvas canvas, Size size) {
    if (size.isEmpty) return;
    // Continuous drift (ticker) + page-reactive phase + per-variant offset.
    final phase = time * 0.45 + progress * 0.72 + _variantPhaseOffset(variant);
    final tiltEnergy = (tilt.dx.abs() + tilt.dy.abs()).clamp(0.0, 1.0);
    final palette = _paletteForVariant(variant, primary, secondary);
    final wash = _washForVariant(variant, dark);
    // Whole moving background – 12 washes at 0.52/0.36 fill entire screen, not just tint
    canvas.drawRect(Offset.zero & size, Paint()..color = wash.withValues(alpha: dark ? 0.52 : 0.36));
    // Add a second wash layer for depth – makes each variant's *motion* distinct
    canvas.drawRect(Offset.zero & size, Paint()..color = palette[0].withValues(alpha: dark ? 0.07 : 0.04));

    // Distinct graphics per variant – not just color, but *shape* (like hummingbot chimera).
    // Shapes parallax against device tilt; motion energy lifts their presence.
    canvas.save();
    canvas.translate(tilt.dx * size.width * 0.045, tilt.dy * size.height * 0.045);
    switch (variant) {
      case 'field':
        _paintField(canvas, size, phase, palette, dark);
        break;
      case 'nebula':
        _paintNebulaVariant(canvas, size, phase, palette, dark);
        break;
      case 'rivers':
        _paintRiversVariant(canvas, size, phase, palette, dark);
        break;
      case 'tendrils':
        _paintTendrilsVariant(canvas, size, phase, palette, dark);
        break;
      case 'orbs':
        _paintOrbsVariant(canvas, size, phase, palette, dark);
        break;
      case 'lattice':
        _paintLatticeVariant(canvas, size, phase, palette, dark);
        break;
      case 'void':
        _paintVoidVariant(canvas, size, phase, palette, dark);
        break;
      case 'prism':
        _paintPrismVariant(canvas, size, phase, palette, dark);
        break;
      case 'aurora':
        _paintAuroraVariant(canvas, size, phase, palette, dark);
        break;
      case 'ember':
        _paintEmberVariant(canvas, size, phase, palette, dark);
        break;
      case 'ocean':
        _paintOceanVariant(canvas, size, phase, palette, dark);
        break;
      case 'twilight':
        _paintTwilightVariant(canvas, size, phase, palette, dark);
        break;
      default:
        _paintField(canvas, size, phase, palette, dark);
    }
    canvas.restore();
    // Moving the phone lifts the whole field — it answers your hand.
    if (tiltEnergy > 0.02) {
      canvas.drawRect(
        Offset.zero & size,
        Paint()
          ..shader = RadialGradient(
            colors: [
              palette[0].withValues(alpha: 0.10 * tiltEnergy),
              palette[1].withValues(alpha: 0),
            ],
          ).createShader(Rect.fromCircle(center: size.center(Offset.zero), radius: size.shortestSide)),
      );
    }
  }

  void _paintField(Canvas canvas, Size size, double phase, List<Color> palette, bool dark) {
    final opacity = dark ? 1.0 : 0.62;
    // Orbs
    final firstCenter = Offset(size.width * (0.82 + math.sin(phase) * 0.12), size.height * (0.12 + math.cos(phase * 1.3) * 0.05));
    final secondCenter = Offset(size.width * (0.08 + math.cos(phase * 0.8) * 0.09), size.height * (0.68 + math.sin(phase * 1.1) * 0.08));
    canvas.drawCircle(firstCenter, size.shortestSide * 0.42, Paint()..shader = RadialGradient(colors: [palette[0].withValues(alpha: 0.12 * opacity), palette[0].withValues(alpha: 0)]).createShader(Rect.fromCircle(center: firstCenter, radius: size.shortestSide * 0.42)));
    canvas.drawCircle(secondCenter, size.shortestSide * 0.34, Paint()..shader = RadialGradient(colors: [palette[1].withValues(alpha: 0.10 * opacity), palette[1].withValues(alpha: 0)]).createShader(Rect.fromCircle(center: secondCenter, radius: size.shortestSide * 0.34)));
    _paintParticleNebula(canvas, size, phase, opacity, palette);
    _paintEnergyTendrils(canvas, size, phase, opacity, palette);
    final path = Path();
    for (var i = 0; i <= 32; i++) {
      final x = size.width * i / 32;
      final y = size.height * 0.26 + math.sin((i / 32 * math.pi * 2.2) + phase) * 16;
      i == 0 ? path.moveTo(x, y) : path.lineTo(x, y);
    }
    canvas.drawPath(path, Paint()..shader = LinearGradient(colors: palette).createShader(Rect.fromLTWH(0, 0, size.width, 1))..style = PaintingStyle.stroke..strokeWidth = 1.1 * opacity);
  }

  void _paintNebulaVariant(Canvas canvas, Size size, double phase, List<Color> palette, bool dark) {
    final opacity = dark ? 1.0 : 0.7;
    // Dense nebula: 60 particles, larger, slower drift
    for (var i = 0; i < 60; i++) {
      final seed = i * 1.7;
      final x = size.width * (0.5 + math.cos(seed + phase * 0.12) * (0.42 + math.sin(seed) * 0.1));
      final y = size.height * (0.5 + math.sin(seed * 1.3 + phase * 0.08) * 0.38);
      final r = 1.2 + (i % 5) * 0.9;
      canvas.drawCircle(Offset(x, y), r, Paint()..color = palette[i % palette.length].withValues(alpha: (0.07 + (i % 4) * 0.03) * opacity));
    }
  }

  void _paintRiversVariant(Canvas canvas, Size size, double phase, List<Color> palette, bool dark) {
    final opacity = dark ? 1.0 : 0.65;
    for (var r = 0; r < 4; r++) {
      final path = Path();
      final yBase = 0.18 + r * 0.17;
      for (var i = 0; i <= 40; i++) {
        final x = size.width * i / 40;
        final y = size.height * yBase + math.sin((i / 40 * math.pi * 3.0) + phase + r) * (14 + r * 4);
        i == 0 ? path.moveTo(x, y) : path.lineTo(x, y);
      }
      canvas.drawPath(path, Paint()..color = palette[r % palette.length].withValues(alpha: 0.22 * opacity)..style = PaintingStyle.stroke..strokeWidth = 1.4 + r * 0.3);
    }
  }

  void _paintTendrilsVariant(Canvas canvas, Size size, double phase, List<Color> palette, bool dark) {
    final opacity = dark ? 1.0 : 0.65;
    for (var i = 0; i < 5; i++) {
      final path = Path()..moveTo(-20, size.height * (0.12 + i * 0.15) + math.sin(phase + i) * 20);
      path.cubicTo(size.width * 0.3, size.height * (0.08 + i * 0.14), size.width * 0.7, size.height * (0.32 + i * 0.09), size.width + 20, size.height * (0.15 + i * 0.13) - math.sin(phase + i) * 20);
      canvas.drawPath(path, Paint()..color = palette[i % palette.length].withValues(alpha: 0.14 * opacity)..style = PaintingStyle.stroke..strokeWidth = 1.6);
    }
  }

  void _paintOrbsVariant(Canvas canvas, Size size, double phase, List<Color> palette, bool dark) {
    final opacity = dark ? 1.0 : 0.7;
    for (var i = 0; i < 3; i++) {
      final center = Offset(size.width * (0.5 + math.cos(phase + i * 2.1) * 0.22), size.height * (0.5 + math.sin(phase * 0.9 + i) * 0.18));
      final radius = size.shortestSide * (0.22 + i * 0.09);
      canvas.drawCircle(center, radius, Paint()..shader = RadialGradient(colors: [palette[i % palette.length].withValues(alpha: 0.16 * opacity), palette[i % palette.length].withValues(alpha: 0)]).createShader(Rect.fromCircle(center: center, radius: radius)));
    }
  }

  void _paintLatticeVariant(Canvas canvas, Size size, double phase, List<Color> palette, bool dark) {
    final opacity = dark ? 1.0 : 0.6;
    final paint = Paint()..color = palette[0].withValues(alpha: 0.09 * opacity)..style = PaintingStyle.stroke..strokeWidth = 0.9;
    const step = 42.0;
    for (double x = 0; x < size.width; x += step) {
      canvas.drawLine(Offset(x, 0), Offset(x + math.sin(phase + x * 0.01) * 18, size.height), paint);
    }
    for (double y = 0; y < size.height; y += step) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y + math.cos(phase + y * 0.01) * 18), paint);
    }
  }

  void _paintVoidVariant(Canvas canvas, Size size, double phase, List<Color> palette, bool dark) {
    // Almost empty – faint vignette only, like hummingbot void
    final center = size.center(Offset.zero);
    canvas.drawCircle(center, size.shortestSide * 0.55, Paint()..shader = RadialGradient(colors: [palette[0].withValues(alpha: 0.04), Colors.transparent]).createShader(Rect.fromCircle(center: center, radius: size.shortestSide * 0.55)));
  }

  void _paintPrismVariant(Canvas canvas, Size size, double phase, List<Color> palette, bool dark) {
    final opacity = dark ? 1.0 : 0.75;
    // Prism: all layers bright + central prism triangle
    _paintParticleNebula(canvas, size, phase, opacity, palette);
    _paintEnergyTendrils(canvas, size, phase, opacity, palette);
    final path = Path()..moveTo(size.width * 0.5, size.height * 0.22)..lineTo(size.width * 0.32, size.height * 0.68)..lineTo(size.width * 0.68, size.height * 0.68)..close();
    canvas.drawPath(path, Paint()..shader = LinearGradient(colors: palette).createShader(path.getBounds())..style = PaintingStyle.stroke..strokeWidth = 2.2 * opacity);
  }

  void _paintAuroraVariant(Canvas canvas, Size size, double phase, List<Color> palette, bool dark) {
    final opacity = dark ? 1.0 : 0.68;
    // Vertical aurora curtains
    for (var i = 0; i < 3; i++) {
      final path = Path();
      final xBase = size.width * (0.28 + i * 0.22);
      for (var y = 0; y <= size.height; y += 8) {
        final x = xBase + math.sin((y / size.height * math.pi * 2) + phase + i) * 36;
        y == 0 ? path.moveTo(x, y.toDouble()) : path.lineTo(x, y.toDouble());
      }
      canvas.drawPath(path, Paint()..shader = LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [palette[i % palette.length].withValues(alpha: 0.22 * opacity), palette[i % palette.length].withValues(alpha: 0)]).createShader(Rect.fromLTWH(xBase - 40, 0, 80, size.height))..style = PaintingStyle.stroke..strokeWidth = 42 * opacity);
    }
  }

  void _paintEmberVariant(Canvas canvas, Size size, double phase, List<Color> palette, bool dark) {
    final opacity = dark ? 1.0 : 0.68;
    // Ember: small warm particles rising
    for (var i = 0; i < 40; i++) {
      final seed = i * 2.1;
      final x = size.width * (0.2 + (i % 7) * 0.11 + math.sin(phase + seed) * 0.04);
      final y = size.height * (0.85 - ((phase * 0.12 + seed * 0.13) % 0.75));
      final r = 1.0 + (i % 3) * 0.8;
      canvas.drawCircle(Offset(x, y), r, Paint()..color = palette[i % palette.length].withValues(alpha: (0.09 + (i % 3) * 0.04) * opacity));
    }
  }

  void _paintOceanVariant(Canvas canvas, Size size, double phase, List<Color> palette, bool dark) {
    final opacity = dark ? 1.0 : 0.68;
    // Ocean: horizontal sine waves
    for (var i = 0; i < 5; i++) {
      final path = Path();
      final yBase = 0.22 + i * 0.13;
      for (var x = 0; x <= size.width; x += 6) {
        final y = size.height * yBase + math.sin((x / size.width * math.pi * 4) + phase + i * 0.9) * 10;
        x == 0 ? path.moveTo(x.toDouble(), y) : path.lineTo(x.toDouble(), y);
      }
      canvas.drawPath(path, Paint()..color = palette[i % palette.length].withValues(alpha: 0.18 * opacity)..style = PaintingStyle.stroke..strokeWidth = 1.3);
    }
  }

  void _paintTwilightVariant(Canvas canvas, Size size, double phase, List<Color> palette, bool dark) {
    final opacity = dark ? 1.0 : 0.68;
    // Twilight: stars + faint orbs
    for (var i = 0; i < 50; i++) {
      final seed = i * 3.7;
      final x = (seed * 91.3) % size.width;
      final y = (seed * 47.1) % (size.height * 0.55);
      final r = (i % 3 == 0) ? 1.4 : 0.7;
      final twinkle = 0.4 + math.sin(phase * 2 + seed) * 0.3;
      canvas.drawCircle(Offset(x, y), r, Paint()..color = Colors.white.withValues(alpha: twinkle * 0.12 * opacity));
    }
    final center = Offset(size.width * 0.5, size.height * 0.35);
    canvas.drawCircle(center, size.shortestSide * 0.18, Paint()..shader = RadialGradient(colors: [palette[1].withValues(alpha: 0.14 * opacity), Colors.transparent]).createShader(Rect.fromCircle(center: center, radius: size.shortestSide * 0.18)));
  }

  double _variantOpacityScale(String v) => switch (v) {
    'void' => 0.35,
    'prism' => 1.15,
    'nebula' => 1.0,
    'lattice' => 1.05,
    'aurora' => 1.1,
    _ => 1.0,
  };

  bool _showOrbs(String v) => v != 'rivers' && v != 'tendrils';
  bool _showNebula(String v) =>
      v == 'field' || v == 'nebula' || v == 'prism' || v == 'lattice' || v == 'aurora' || v == 'twilight' || v == 'ocean';
  bool _showTendrils(String v) =>
      v == 'field' || v == 'tendrils' || v == 'prism' || v == 'ocean' || v == 'twilight' || v == 'ember';
  bool _showRivers(String v) =>
      v == 'field' || v == 'rivers' || v == 'prism' || v == 'ember' || v == 'ocean' || v == 'aurora';

  List<Color> _paletteForVariant(String v, Color primary, Color secondary) => switch (v) {
    'aurora' => const [Color(0xff6750a4), Color(0xff00e5cc), Color(0xff008f83)],
    'ember' => const [Color(0xffa34213), Color(0xfff5a623), Color(0xffc26a00)],
    'ocean' => const [Color(0xff006d91), Color(0xff00e5cc), Color(0xff315da8)],
    'twilight' => const [Color(0xff4648a3), Color(0xff7c3aed), Color(0xff7651a8)],
    'prism' => const [Color(0xff00e5cc), Color(0xff00e68a), Color(0xff7c3aed)],
    'void' => [primary.withValues(alpha: 0.45), secondary.withValues(alpha: 0.25), primary.withValues(alpha: 0.35)],
    'nebula' => const [Color(0xff00e5cc), Color(0xff7c3aed), Color(0xff00b399)],
    'lattice' => const [Color(0xff315da8), Color(0xff00e5cc), Color(0xff7c3aed)],
    _ => [MindRecipeFxPalette.primary, MindRecipeFxPalette.livingGreen, MindRecipeFxPalette.secondary],
  };

  Color _washForVariant(String v, bool dark) => switch (v) {
    'field' => const Color(0xff001a1a),
    'nebula' => const Color(0xff1a1033),
    'rivers' => const Color(0xff002a3a),
    'tendrils' => const Color(0xff1a2a1a),
    'orbs' => const Color(0xff2a1a2a),
    'lattice' => const Color(0xff1a1a2a),
    'void' => const Color(0xff0a0a0a),
    'prism' => const Color(0xff1a0033),
    'aurora' => const Color(0xff1a0a2a),
    'ember' => const Color(0xff2a0f00),
    'ocean' => const Color(0xff001a2a),
    'twilight' => const Color(0xff0f0a2a),
    _ => const Color(0xff001a1a),
  };

  double _variantPhaseOffset(String v) => switch (v) {
    'field' => 0.0,
    'nebula' => 1.7,
    'rivers' => 3.1,
    'tendrils' => 4.4,
    'orbs' => 5.9,
    'lattice' => 7.2,
    'void' => 8.0,
    'prism' => 9.3,
    'aurora' => 10.6,
    'ember' => 12.1,
    'ocean' => 13.4,
    'twilight' => 14.8,
    _ => 0.0,
  };

  void _paintParticleNebula(
    Canvas canvas,
    Size size,
    double phase,
    double opacityScale,
    List<Color> overridePalette,
  ) {
    // A deterministic, low-count mobile interpretation of ShapableMatter's
    // nebula mode. Position changes only during pagination—no idle ticker.
    final palette = overridePalette.length >= 4
        ? overridePalette
        : const [
            MindRecipeFxPalette.primary,
            MindRecipeFxPalette.livingGreen,
            MindRecipeFxPalette.secondary,
            Color(0xff00b399),
          ];
    for (var i = 0; i < 28; i++) {
      final seed = i * 2.399963229728653;
      final orbit = 0.15 + (i % 7) * 0.017;
      final x =
          size.width *
          (0.5 +
              math.cos(seed + phase * (0.18 + i % 3 * 0.04)) *
                  (0.36 + orbit * math.sin(seed)));
      final y =
          size.height *
          (0.46 + math.sin(seed * 1.27 + phase * 0.22) * (0.32 + orbit * 0.28));
      final radius = 0.8 + (i % 4) * 0.55;
      canvas.drawCircle(
        Offset(x, y),
        radius,
        Paint()
          ..color = palette[i % palette.length].withValues(
            alpha: (0.05 + (i % 3) * 0.025) * opacityScale,
          ),
      );
    }
  }

  void _paintEnergyTendrils(
    Canvas canvas,
    Size size,
    double phase,
    double opacityScale,
    List<Color> overridePalette,
  ) {
    final colors = overridePalette.length >= 3
        ? overridePalette.take(3).toList()
        : const [
            MindRecipeFxPalette.primary,
            MindRecipeFxPalette.livingGreen,
            MindRecipeFxPalette.secondary,
          ];
    for (var i = 0; i < colors.length; i++) {
      final verticalShift = math.sin(phase + i * 1.7) * 34;
      final path = Path()
        ..moveTo(-20, size.height * (0.18 + i * 0.19) + verticalShift)
        ..cubicTo(
          size.width * 0.28,
          size.height * (0.10 + i * 0.18),
          size.width * 0.68,
          size.height * (0.36 + i * 0.11),
          size.width + 20,
          size.height * (0.20 + i * 0.17) - verticalShift,
        );
      canvas.drawPath(
        path,
        Paint()
          ..color = colors[i].withValues(alpha: 0.045 * opacityScale)
          ..style = PaintingStyle.stroke
          ..strokeWidth = 0.8 + i * 0.22,
      );
    }
  }

  @override
  bool shouldRepaint(covariant _MindRecipeFxPainter oldDelegate) =>
      oldDelegate.progress != progress ||
      oldDelegate.time != time ||
      oldDelegate.tilt != tilt ||
      oldDelegate.primary != primary ||
      oldDelegate.secondary != secondary ||
      oldDelegate.dark != dark ||
      oldDelegate.variant != variant;
}
