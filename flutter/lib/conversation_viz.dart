import 'dart:ui' as ui;
import 'package:flutter/material.dart';

/// Conversation visualization shader — responds to AI activity, voice input,
/// and message types with organic neural network effects.
class ConversationViz extends StatefulWidget {
  const ConversationViz({
    super.key,
    required this.activity,
    this.messageType = 0.5,
    this.isDark = false,
  });

  /// 0.0 = idle, 1.0 = active (typing/voice/AI thinking)
  final double activity;

  /// 0.0 = user message, 0.5 = system, 1.0 = AI message
  final double messageType;

  final bool isDark;

  @override
  State<ConversationViz> createState() => _ConversationVizState();
}

class _ConversationVizState extends State<ConversationViz>
    with SingleTickerProviderStateMixin {
  late final AnimationController controller;
  ui.FragmentProgram? program;

  @override
  void initState() {
    super.initState();
    controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 12),
    )..repeat();

    ui.FragmentProgram.fromAsset('shaders/conversation_viz.frag')
        .then((loaded) {
      if (mounted) setState(() => program = loaded);
    }).catchError((Object _) {});
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (MediaQuery.disableAnimationsOf(context)) {
      controller.stop();
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
    if (program == null) {
      return _FallbackViz(
        activity: widget.activity,
        messageType: widget.messageType,
      );
    }

    return AnimatedBuilder(
      animation: controller,
      builder: (context, _) {
        return CustomPaint(
          painter: _ConversationVizPainter(
            program: program!,
            time: controller.value * 3.14159 * 2,
            activity: widget.activity,
            messageType: widget.messageType,
            isDark: widget.isDark,
          ),
          size: Size.infinite,
        );
      },
    );
  }
}

class _ConversationVizPainter extends CustomPainter {
  _ConversationVizPainter({
    required this.program,
    required this.time,
    required this.activity,
    required this.messageType,
    required this.isDark,
  });

  final ui.FragmentProgram program;
  final double time;
  final double activity;
  final double messageType;
  final bool isDark;

  @override
  void paint(Canvas canvas, Size size) {
    final shader = program.fragmentShader();
    shader.setFloat(0, size.width);
    shader.setFloat(1, size.height);
    shader.setFloat(2, time);
    shader.setFloat(3, activity);
    shader.setFloat(4, messageType);
    shader.setFloat(5, isDark ? 1.0 : 0.0);

    canvas.drawRect(
      Rect.fromLTWH(0, 0, size.width, size.height),
      Paint()..shader = shader,
    );
  }

  @override
  bool shouldRepaint(covariant _ConversationVizPainter oldDelegate) {
    return oldDelegate.time != time ||
        oldDelegate.activity != activity ||
        oldDelegate.messageType != messageType;
  }
}

/// Fallback visualization when shader isn't available.
class _FallbackViz extends StatelessWidget {
  const _FallbackViz({required this.activity, required this.messageType});

  final double activity;
  final double messageType;

  @override
  Widget build(BuildContext context) {
    final color = messageType > 0.7
        ? const Color(0xff7c3aed) // AI purple
        : messageType < 0.3
            ? const Color(0xff00e5cc) // User teal
            : const Color(0xff00e68a); // System green

    return Container(
      decoration: BoxDecoration(
        gradient: RadialGradient(
          center: Alignment.center,
          radius: 1.5,
          colors: [
            color.withAlpha((30 * activity + 10).round()),
            Colors.transparent,
          ],
        ),
      ),
    );
  }
}
