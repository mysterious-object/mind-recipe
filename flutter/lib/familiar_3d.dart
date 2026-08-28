import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'motion_field.dart';
import 'mind_recipe_fx.dart';

/// 3D Familiar — new in 2085. An iridescent orb companion with depth,
/// tendril physics, and voice-reactive glow. It can be placed anywhere;
/// by default it floats with subtle parallax from [MotionField].
class FamiliarOrb3D extends StatefulWidget {
  const FamiliarOrb3D({
    super.key,
    this.size = 140,
    this.mood = FamiliarMood.calm,
    this.isSpeaking = false,
    this.isListening = false,
    this.onTap,
    this.interactive = true,
  });
  final double size;
  final FamiliarMood mood;
  final bool isSpeaking;
  final bool isListening;
  final VoidCallback? onTap;
  final bool interactive;

  @override
  State<FamiliarOrb3D> createState() => _FamiliarOrb3DState();
}

enum FamiliarMood { calm, curious, energized, resting }

class _FamiliarOrb3DState extends State<FamiliarOrb3D> with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;
  double _dragX = 0;
  double _dragY = 0;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 4200))..repeat();
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
      _ctrl.stop();
    } else if (!_ctrl.isAnimating) {
      _ctrl.repeat();
    }
  }

  @override
  void dispose() {
    MotionField.instance.removeListener(_onMotion);
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final tilt = MotionField.instance.tilt;
    final reduceMotion = MediaQuery.disableAnimationsOf(context);
    return GestureDetector(
      onTap: widget.onTap,
      onPanUpdate: widget.interactive && !reduceMotion
          ? (d) => setState(() {
                _dragX = (_dragX + d.delta.dx * 0.01).clamp(-0.6, 0.6);
                _dragY = (_dragY + d.delta.dy * 0.01).clamp(-0.6, 0.6);
              })
          : null,
      onPanEnd: (_) => setState(() {
        _dragX *= 0.5;
        _dragY *= 0.5;
      }),
      child: AnimatedBuilder(
        animation: _ctrl,
        builder: (context, _) => CustomPaint(
          size: Size.square(widget.size),
          painter: _FamiliarPainter(
            t: _ctrl.value,
            mood: widget.mood,
            isSpeaking: widget.isSpeaking,
            isListening: widget.isListening,
            tiltX: tilt.dx + _dragX,
            tiltY: tilt.dy + _dragY,
          ),
        ),
      ),
    );
  }
}

class _FamiliarPainter extends CustomPainter {
  _FamiliarPainter({
    required this.t,
    required this.mood,
    required this.isSpeaking,
    required this.isListening,
    required this.tiltX,
    required this.tiltY,
  });
  final double t;
  final FamiliarMood mood;
  final bool isSpeaking;
  final bool isListening;
  final double tiltX;
  final double tiltY;

  @override
  void paint(Canvas canvas, Size size) {
    final center = size.center(Offset.zero);
    final base = size.shortestSide * 0.38;
    final pulse = 1 + math.sin(t * math.pi * 2) * (isSpeaking ? 0.12 : isListening ? 0.09 : 0.04);
    final hueShift = switch (mood) {
      FamiliarMood.calm => 0.0,
      FamiliarMood.curious => 0.12,
      FamiliarMood.energized => 0.22,
      FamiliarMood.resting => -0.08,
    };
    // Shadow
    canvas.drawOval(
      Rect.fromCenter(center: center + Offset(0, base * 0.9), width: base * 1.2, height: base * 0.42),
      Paint()..color = Colors.black.withValues(alpha: 0.18),
    );
    // Outer glow
    final glowColors = [
      MindRecipeFxPalette.primary.withValues(alpha: isSpeaking ? 0.32 : 0.18),
      MindRecipeFxPalette.secondary.withValues(alpha: isSpeaking ? 0.22 : 0.10),
      Colors.transparent,
    ];
    canvas.drawCircle(
      center,
      base * 1.55 * pulse,
      Paint()
        ..shader = RadialGradient(colors: glowColors).createShader(Rect.fromCircle(center: center, radius: base * 1.55)),
    );
    // Core 3D sphere with tilt lighting
    final lightOffset = Offset(tiltX * base * 0.45, tiltY * base * 0.45);
    final coreCenter = center + lightOffset * 0.18;
    final corePaint = Paint()
      ..shader = RadialGradient(
        center: const Alignment(-0.3, -0.4),
        colors: [
          Color.lerp(MindRecipeFxPalette.primary, const Color(0xffe7fffb), 0.35)!,
          MindRecipeFxPalette.primary,
          MindRecipeFxPalette.secondary,
          const Color(0xff020203),
        ],
        stops: const [0.0, 0.32, 0.68, 1.0],
      ).createShader(Rect.fromCircle(center: coreCenter, radius: base * 1.05));
    canvas.drawCircle(coreCenter, base * pulse, corePaint);
    // Highlight
    canvas.drawCircle(
      coreCenter - Offset(base * 0.28, base * 0.34),
      base * 0.16,
      Paint()..color = Colors.white.withValues(alpha: 0.42),
    );
    canvas.drawCircle(
      coreCenter - Offset(base * 0.16, base * 0.20),
      base * 0.07,
      Paint()..color = Colors.white.withValues(alpha: 0.22),
    );
    // Orbit rings — 3D like
    for (var i = 0; i < 3; i++) {
      final angle = t * math.pi * 2 * (i == 1 ? -0.7 : 1) + i * 2.1 + hueShift * math.pi;
      final rx = base * (1.28 + i * 0.18) * (1 + tiltX * 0.12);
      final ry = base * (0.52 + i * 0.09) * (1 + tiltY * 0.08);
      final orbitPaint = Paint()
        ..color = [MindRecipeFxPalette.primary, MindRecipeFxPalette.livingGreen, MindRecipeFxPalette.secondary][i].withValues(alpha: 0.42 - i * 0.08)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1.1 - i * 0.18;
      final rect = Rect.fromCenter(center: center, width: rx * 2, height: ry * 2);
      canvas.drawOval(rect, orbitPaint);
      // orb dot on ring
      final dotAngle = angle;
      final dx = math.cos(dotAngle) * rx * 0.5;
      final dy = math.sin(dotAngle) * ry * 0.5;
      canvas.drawCircle(
        center + Offset(dx, dy),
        2.6 + i * 0.7,
        Paint()..color = [MindRecipeFxPalette.primary, MindRecipeFxPalette.livingGreen, MindRecipeFxPalette.secondary][i],
      );
    }
    // Tendrils
    for (var i = 0; i < 2; i++) {
      final path = Path()..moveTo(center.dx - base * 0.9, center.dy + base * (0.2 + i * 0.32));
      path.quadraticBezierTo(
        center.dx + math.sin(t * math.pi * 2 + i) * base * 0.22,
        center.dy + base * (0.1 + i * 0.18),
        center.dx + base * 0.9,
        center.dy + base * (0.28 + i * 0.22),
      );
      canvas.drawPath(
        path,
        Paint()
          ..color = MindRecipeFxPalette.primary.withValues(alpha: 0.10)
          ..style = PaintingStyle.stroke
          ..strokeWidth = 1.2,
      );
    }
    // Voice reactive pulse ring
    if (isSpeaking || isListening) {
      final r = base * (1.35 + math.sin(t * math.pi * 4) * 0.08);
      canvas.drawCircle(
        center,
        r,
        Paint()
          ..color = (isSpeaking ? MindRecipeFxPalette.primary : MindRecipeFxPalette.secondary).withValues(alpha: 0.18)
          ..style = PaintingStyle.stroke
          ..strokeWidth = 1.4,
      );
    }
  }

  @override
  bool shouldRepaint(covariant _FamiliarPainter old) => old.t != t || old.isSpeaking != isListening || old.tiltX != tiltX || old.tiltY != tiltY || old.mood != mood;
}

/// Compact familiar companion card — shown on Today or as overlay.
class FamiliarCompanionCard extends StatelessWidget {
  const FamiliarCompanionCard({super.key, required this.appState, this.onTapNavigator});
  final dynamic appState;
  final VoidCallback? onTapNavigator;
  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Card(
      elevation: 3,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            FamiliarOrb3D(size: 64, mood: FamiliarMood.calm),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Your Familiar', style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800)),
                  Text('A calm presence that listens, glows with your voice, and follows your Navigator theme. Tap to continue with Navigator.',
                      style: Theme.of(context).textTheme.bodySmall),
                  const SizedBox(height: 6),
                  FilledButton.tonalIcon(
                    onPressed: onTapNavigator,
                    icon: const Icon(Icons.explore_rounded, size: 16),
                    label: const Text('Open Navigator'),
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
