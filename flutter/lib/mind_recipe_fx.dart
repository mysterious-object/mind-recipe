import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/material.dart';

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
  const MindRecipeGpuField({super.key, required this.progress});

  final double progress;

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
    ui.FragmentProgram.fromAsset('shaders/mind_recipe_field.frag')
        .then((loaded) {
          if (mounted) setState(() => program = loaded);
        })
        .catchError((Object _) {
          // The CustomPainter fallback remains visible on unsupported targets.
        });
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
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final loaded = program;
    if (loaded == null) return const SizedBox.expand();
    final dark = Theme.of(context).brightness == Brightness.dark;
    return IgnorePointer(
      child: RepaintBoundary(
        child: AnimatedBuilder(
          animation: controller,
          builder: (context, _) => CustomPaint(
            painter: _MindRecipeGpuPainter(
              program: loaded,
              time: controller.value * 18,
              progress: widget.progress,
              dark: dark,
            ),
            size: Size.infinite,
          ),
        ),
      ),
    );
  }
}

class _MindRecipeGpuPainter extends CustomPainter {
  const _MindRecipeGpuPainter({
    required this.program,
    required this.time,
    required this.progress,
    required this.dark,
  });

  final ui.FragmentProgram program;
  final double time;
  final double progress;
  final bool dark;

  @override
  void paint(Canvas canvas, Size size) {
    if (size.isEmpty) return;
    final shader = program.fragmentShader()
      ..setFloat(0, size.width)
      ..setFloat(1, size.height)
      ..setFloat(2, time)
      ..setFloat(3, progress)
      ..setFloat(4, dark ? 1 : 0);
    canvas.drawRect(Offset.zero & size, Paint()..shader = shader);
    shader.dispose();
  }

  @override
  bool shouldRepaint(covariant _MindRecipeGpuPainter oldDelegate) =>
      oldDelegate.time != time ||
      oldDelegate.progress != progress ||
      oldDelegate.dark != dark ||
      oldDelegate.program != program;
}

/// Lightweight, Flutter-native visual effects driven by navigation progress.
///
/// Mind Recipe FX intentionally has no continuous ticker. It morphs while the user
/// swipes or changes pages, which keeps idle battery use at zero and makes the
/// experience compatible with reduced-motion preferences.
class MindRecipeFxBackdrop extends StatelessWidget {
  const MindRecipeFxBackdrop({super.key, required this.progress});

  final double progress;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final dark = Theme.of(context).brightness == Brightness.dark;
    return IgnorePointer(
      child: RepaintBoundary(
        child: CustomPaint(
          painter: _MindRecipeFxPainter(
            progress: progress,
            primary: scheme.primary,
            secondary: scheme.secondary,
            dark: dark,
          ),
          size: Size.infinite,
        ),
      ),
    );
  }
}

class MindRecipePageRail extends StatelessWidget {
  const MindRecipePageRail({
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
  });

  final double progress;
  final Color primary;
  final Color secondary;
  final bool dark;

  @override
  void paint(Canvas canvas, Size size) {
    if (size.isEmpty) return;
    final phase = progress * 0.72;
    final nativePrimary = Color.lerp(MindRecipeFxPalette.primary, primary, 0.18)!;
    final opacityScale = dark ? 1.0 : 0.62;
    final firstCenter = Offset(
      size.width * (0.82 + math.sin(phase) * 0.12),
      size.height * (0.12 + math.cos(phase * 1.3) * 0.05),
    );
    final secondCenter = Offset(
      size.width * (0.08 + math.cos(phase * 0.8) * 0.09),
      size.height * (0.68 + math.sin(phase * 1.1) * 0.08),
    );

    canvas.drawCircle(
      firstCenter,
      size.shortestSide * 0.42,
      Paint()
        ..shader =
            RadialGradient(
              colors: [
                nativePrimary.withValues(alpha: 0.12 * opacityScale),
                nativePrimary.withValues(alpha: 0),
              ],
            ).createShader(
              Rect.fromCircle(
                center: firstCenter,
                radius: size.shortestSide * 0.42,
              ),
            ),
    );
    canvas.drawCircle(
      secondCenter,
      size.shortestSide * 0.34,
      Paint()
        ..shader =
            RadialGradient(
              colors: [
                secondary.withValues(alpha: 0.10 * opacityScale),
                secondary.withValues(alpha: 0),
              ],
            ).createShader(
              Rect.fromCircle(
                center: secondCenter,
                radius: size.shortestSide * 0.34,
              ),
            ),
    );

    _paintParticleNebula(canvas, size, phase, opacityScale);
    _paintEnergyTendrils(canvas, size, phase, opacityScale);

    // Data Rivers: a page-reactive flow line adapted from DataRivers.js.
    final path = Path();
    for (var i = 0; i <= 32; i++) {
      final x = size.width * i / 32;
      final y =
          size.height * 0.26 + math.sin((i / 32 * math.pi * 2.2) + phase) * 16;
      i == 0 ? path.moveTo(x, y) : path.lineTo(x, y);
    }
    canvas.drawPath(
      path,
      Paint()
        ..shader = const LinearGradient(
          colors: [
            MindRecipeFxPalette.primary,
            MindRecipeFxPalette.livingGreen,
            MindRecipeFxPalette.secondary,
          ],
        ).createShader(Rect.fromLTWH(0, 0, size.width, 1))
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1.1 * opacityScale,
    );
  }

  void _paintParticleNebula(
    Canvas canvas,
    Size size,
    double phase,
    double opacityScale,
  ) {
    // A deterministic, low-count mobile interpretation of ShapableMatter's
    // nebula mode. Position changes only during pagination—no idle ticker.
    const palette = [
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
  ) {
    const colors = [
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
      oldDelegate.primary != primary ||
      oldDelegate.secondary != secondary ||
      oldDelegate.dark != dark;
}
