import 'dart:math' as math;
import 'package:flutter/material.dart';

/// Particle burst effect — shows particles when voice is transcribed
/// or when AI response arrives. Animated from center outward.
class ParticleBurst extends StatefulWidget {
  const ParticleBurst({
    super.key,
    required this.active,
    this.color = const Color(0xff00e5cc),
    this.particleCount = 12,
    this.duration = const Duration(milliseconds: 800),
  });

  final bool active;
  final Color color;
  final int particleCount;
  final Duration duration;

  @override
  State<ParticleBurst> createState() => _ParticleBurstState();
}

class _ParticleBurstState extends State<ParticleBurst>
    with SingleTickerProviderStateMixin {
  late final AnimationController controller;
  late final Animation<double> _scaleAnim;
  late final Animation<double> _opacityAnim;
  bool _wasActive = false;

  @override
  void initState() {
    super.initState();
    controller = AnimationController(vsync: this, duration: widget.duration);
    _scaleAnim = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: controller, curve: Curves.easeOutCubic),
    );
    _opacityAnim = Tween<double>(begin: 1.0, end: 0.0).animate(
      CurvedAnimation(parent: controller, curve: Curves.easeIn),
    );
  }

  @override
  void didUpdateWidget(ParticleBurst oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.active && !_wasActive) {
      controller.forward(from: 0.0);
    }
    _wasActive = widget.active;
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: controller,
      builder: (context, _) {
        if (controller.value == 0.0 && !widget.active) {
          return const SizedBox.shrink();
        }
        return CustomPaint(
          painter: _ParticlePainter(
            progress: _scaleAnim.value,
            opacity: _opacityAnim.value,
            color: widget.color,
            particleCount: widget.particleCount,
          ),
          size: Size.infinite,
        );
      },
    );
  }
}

class _ParticlePainter extends CustomPainter {
  _ParticlePainter({
    required this.progress,
    required this.opacity,
    required this.color,
    required this.particleCount,
  });

  final double progress;
  final double opacity;
  final Color color;
  final int particleCount;

  @override
  void paint(Canvas canvas, Size size) {
    if (progress == 0.0) return;

    final center = Offset(size.width / 2, size.height / 2);
    final maxRadius = math.min(size.width, size.height) * 0.4;

    for (var i = 0; i < particleCount; i++) {
      final angle = (i / particleCount) * math.pi * 2;
      final radius = maxRadius * progress;
      final particleSize = (3.0 + (i % 3) * 2.0) * (1.0 - progress * 0.5);

      final offset = Offset(
        center.dx + math.cos(angle) * radius,
        center.dy + math.sin(angle) * radius,
      );

      final paint = Paint()
        ..color = color.withAlpha((opacity * 255 * (1.0 - progress * 0.7)).round())
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 2.0);

      canvas.drawCircle(offset, particleSize, paint);
    }

    // Central glow
    final glowPaint = Paint()
      ..shader = RadialGradient(
        colors: [
          color.withAlpha((opacity * 80).round()),
          Colors.transparent,
        ],
      ).createShader(Rect.fromCircle(center: center, radius: maxRadius * progress * 0.3));

    canvas.drawCircle(center, maxRadius * progress * 0.3, glowPaint);
  }

  @override
  bool shouldRepaint(covariant _ParticlePainter oldDelegate) {
    return oldDelegate.progress != progress || oldDelegate.opacity != opacity;
  }
}
