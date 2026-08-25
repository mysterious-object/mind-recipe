import 'dart:math' as math;

import 'package:flutter/material.dart';

import 'app_services.dart';

class PulseScreen extends StatefulWidget {
  const PulseScreen({super.key, required this.api, required this.appState});
  final MindRecipeApiClient api;
  final SecureAppState appState;

  @override
  State<PulseScreen> createState() => _PulseScreenState();
}

class _PulseScreenState extends State<PulseScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _motion;
  Map<String, dynamic>? _pulse;

  @override
  void initState() {
    super.initState();
    _motion = AnimationController(vsync: this, duration: const Duration(seconds: 12))..repeat();
    _load();
  }

  Future<void> _load() async {
    final session = widget.appState.session;
    if (session == null) return;
    try {
      final value = await widget.api.getPulse(session.token);
      if (mounted) setState(() => _pulse = value);
    } catch (_) {
      // Pulse remains useful with on-device activity when offline.
    }
  }

  @override
  void dispose() {
    _motion.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final effectiveness = (_pulse?['recipe_effectiveness'] as num?)?.toDouble();
    final practices = (_pulse?['practice_count'] as num?)?.toInt() ?? 0;
    final sources = (_pulse?['data_sources'] as List? ?? const []).map((e) => e.toString()).toList();
    final reduceMotion = MediaQuery.disableAnimationsOf(context);
    return RefreshIndicator(
      onRefresh: _load,
      child: ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.fromLTRB(16, 18, 16, 32),
        children: [
          Text('Pulse', style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w900)),
          const SizedBox(height: 4),
          Text('Your familiar reflects the patterns you choose to share—not a diagnosis.', style: Theme.of(context).textTheme.bodyMedium),
          const SizedBox(height: 18),
          Card(
            clipBehavior: Clip.antiAlias,
            child: SizedBox(
              height: 275,
              child: AnimatedBuilder(
                animation: _motion,
                builder: (_, _) => CustomPaint(
                  painter: _FamiliarPainter(progress: reduceMotion ? 0.28 : _motion.value, effectiveness: effectiveness, activity: practices),
                  child: const SizedBox.expand(),
                ),
              ),
            ),
          ),
          const SizedBox(height: 12),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('Today’s signal', style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w800)),
                const SizedBox(height: 8),
                Text(practices == 0 ? 'Your familiar is waiting for the first small signal of the day.' : '$practices practice${practices == 1 ? '' : 's'} have shaped today’s familiar.'),
                if (effectiveness != null) Padding(
                  padding: const EdgeInsets.only(top: 8),
                  child: Text('Recent Recipe usefulness: ${effectiveness.toStringAsFixed(1)} / 5 · based on your ratings.'),
                ),
                const SizedBox(height: 8),
                Text(_pulse?['uncertainty']?.toString() ?? 'Connect health data when you want it included.', style: Theme.of(context).textTheme.bodySmall),
              ]),
            ),
          ),
          const SizedBox(height: 12),
          Card(child: ListTile(
            leading: const Icon(Icons.favorite_outline_rounded),
            title: const Text('Health and sleep'),
            subtitle: Text(sources.isEmpty ? 'Not connected. Pulse still works from your navigation and Recipes.' : 'Using: ${sources.join(', ')}'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Health connections will request access only when you choose to connect them.'))),
          )),
        ],
      ),
    );
  }
}

class _FamiliarPainter extends CustomPainter {
  const _FamiliarPainter({required this.progress, required this.effectiveness, required this.activity});
  final double progress;
  final double? effectiveness;
  final int activity;
  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final quality = ((effectiveness ?? 2.8) / 5).clamp(.18, 1.0);
    final radius = math.min(size.width, size.height) * (.19 + quality * .11);
    final dark = const Color(0xff111727);
    canvas.drawRect(Offset.zero & size, Paint()..color = dark);
    for (var ring = 4; ring >= 0; ring--) {
      final wave = math.sin(progress * math.pi * 2 + ring) * 10;
      final color = Color.lerp(const Color(0xff144a67), const Color(0xff4bf2b3), ring / 4)!.withValues(alpha: .05 + ring * .025);
      canvas.drawCircle(center.translate(wave, -wave), radius + ring * 31 + activity * 1.5, Paint()..color = color..maskFilter = const MaskFilter.blur(BlurStyle.normal, 22));
    }
    final body = Paint()
      ..shader = RadialGradient(colors: [const Color(0xffb2ffdf), const Color(0xff00a89a), const Color(0xff31318c)], stops: const [0, .46, 1]).createShader(Rect.fromCircle(center: center, radius: radius))
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 2);
    canvas.drawCircle(center.translate(math.sin(progress * math.pi * 2) * 10, math.cos(progress * math.pi * 2) * 7), radius, body);
    final orbit = Paint()..color = const Color(0xffb7ffe7).withValues(alpha: .58)..style = PaintingStyle.stroke..strokeWidth = 1.5;
    canvas.save(); canvas.translate(center.dx, center.dy); canvas.rotate(progress * math.pi); canvas.drawOval(Rect.fromCenter(center: Offset.zero, width: radius * 3.2, height: radius * .72), orbit); canvas.restore();
  }
  @override
  bool shouldRepaint(covariant _FamiliarPainter old) => old.progress != progress || old.effectiveness != effectiveness || old.activity != activity;
}
