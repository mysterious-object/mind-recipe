import 'dart:async';

import 'package:flutter/material.dart';

import 'mind_recipe_fx.dart';
import 'motion_field.dart';
import 'orbit_news_service.dart';

/// Desktop orb communicator — larger orb that speaks and shows Orbit news.
/// Used on desktop platforms (width > 900) and as a standalone communicator.
class DesktopOrbScreen extends StatefulWidget {
  const DesktopOrbScreen({super.key});

  @override
  State<DesktopOrbScreen> createState() => _DesktopOrbScreenState();
}

class _DesktopOrbScreenState extends State<DesktopOrbScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _breath;
  final _newsService = OrbitNewsService();
  List<OrbitNewsItem> _news = [];
  bool _loadingNews = true;
  String _orbMessage = 'Welcome. I’m your orb — how are you feeling?';

  @override
  void initState() {
    super.initState();
    _breath = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 3200),
    )..repeat(reverse: true);
    MotionField.instance.ensureStarted();
    _loadNews();
  }

  Future<void> _loadNews() async {
    try {
      final items = await _newsService.fetchOrbitNews();
      if (mounted) setState(() {
        _news = items;
        _loadingNews = false;
      });
    } catch (_) {
      if (mounted) setState(() => _loadingNews = false);
    }
  }

  @override
  void dispose() {
    _breath.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          Positioned.fill(
            child: MindRecipeGpuField(progress: 0.5, variant: 'field'),
          ),
          Positioned.fill(
            child: MindRecipeFxBackdrop(progress: 0.5, variant: 'field'),
          ),
          SafeArea(
            child: Row(
              children: [
                // Left: Orb communicator
                Expanded(
                  flex: 3,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      AnimatedBuilder(
                        animation: _breath,
                        builder: (context, _) => CustomPaint(
                          size: const Size(280, 280),
                          painter: _DesktopOrbPainter(
                            t: _breath.value,
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 32),
                        child: Text(
                          _orbMessage,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                            color: Colors.white,
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      Wrap(
                        spacing: 8,
                        children: [
                          FilledButton.icon(
                            onPressed: () => setState(() => _orbMessage = 'I’m listening — tell me what’s on your mind.'),
                            icon: const Icon(Icons.mic_rounded),
                            label: const Text('Talk'),
                          ),
                          OutlinedButton.icon(
                            onPressed: () => setState(() => _orbMessage = 'Let’s take a breath together. In… out…'),
                            icon: const Icon(Icons.air_rounded),
                            label: const Text('Breathe'),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                // Right: Orbit news
                Expanded(
                  flex: 2,
                  child: Container(
                    margin: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.35),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.white.withValues(alpha: 0.12)),
                    ),
                    child: Column(
                      children: [
                        Padding(
                          padding: const EdgeInsets.all(16),
                          child: Row(
                            children: [
                              const Icon(Icons.public_rounded, color: Colors.white70),
                              const SizedBox(width: 8),
                              const Text('Orbit News',
                                  style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w700,
                                      color: Colors.white)),
                              const Spacer(),
                              IconButton(
                                icon: const Icon(Icons.refresh_rounded, color: Colors.white54, size: 20),
                                onPressed: _loadNews,
                              ),
                            ],
                          ),
                        ),
                        const Divider(height: 1, color: Colors.white12),
                        Expanded(
                          child: _loadingNews
                              ? const Center(child: CircularProgressIndicator())
                              : _news.isEmpty
                                  ? const Center(
                                      child: Padding(
                                        padding: EdgeInsets.all(24),
                                        child: Text(
                                          'No Orbit updates yet. Check back soon.',
                                          style: TextStyle(color: Colors.white54),
                                          textAlign: TextAlign.center,
                                        ),
                                      ),
                                    )
                                  : ListView.separated(
                                      padding: const EdgeInsets.all(12),
                                      itemCount: _news.length,
                                      separatorBuilder: (_, __) => const SizedBox(height: 8),
                                      itemBuilder: (context, i) {
                                        final item = _news[i];
                                        return Container(
                                          padding: const EdgeInsets.all(12),
                                          decoration: BoxDecoration(
                                            color: Colors.white.withValues(alpha: 0.06),
                                            borderRadius: BorderRadius.circular(10),
                                          ),
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Text(item.title,
                                                  style: const TextStyle(
                                                      fontWeight: FontWeight.w700,
                                                      color: Colors.white,
                                                      fontSize: 13)),
                                              if (item.summary.isNotEmpty) ...[
                                                const SizedBox(height: 4),
                                                Text(item.summary,
                                                    style: const TextStyle(
                                                        color: Colors.white70, fontSize: 12),
                                                    maxLines: 3,
                                                    overflow: TextOverflow.ellipsis),
                                              ],
                                              const SizedBox(height: 6),
                                              Text(
                                                item.timeAgo,
                                                style: const TextStyle(
                                                    color: Colors.white38, fontSize: 11),
                                              ),
                                            ],
                                          ),
                                        );
                                      },
                                    ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _DesktopOrbPainter extends CustomPainter {
  const _DesktopOrbPainter({required this.t});
  final double t;

  @override
  void paint(Canvas canvas, Size size) {
    if (size.isEmpty) return;
    final center = size.center(Offset.zero);
    final base = size.shortestSide * 0.32;
    final breath = 1 + (t - 0.5) * 0.12;

    // Outer glow
    canvas.drawCircle(
      center,
      base * 1.6 * breath,
      Paint()
        ..shader = const RadialGradient(colors: [
          Color(0x5500e5cc),
          Color(0x0000e5cc),
        ]).createShader(Rect.fromCircle(center: center, radius: base * 1.6 * breath)),
    );
    // Core
    canvas.drawCircle(
      center,
      base * breath,
      Paint()
        ..shader = const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xff00e5cc), Color(0xff7c3aed)],
        ).createShader(Rect.fromCircle(center: center, radius: base * breath)),
    );
    // Highlight
    canvas.drawCircle(
      center - Offset(base * 0.22, base * 0.28),
      base * 0.18 * breath,
      Paint()..color = Colors.white.withValues(alpha: 0.28),
    );
    // Orbit rings
    for (var i = 0; i < 3; i++) {
      final r = base * (1.22 + i * 0.18) * (1 + t * 0.02);
      final angle = t * 6.28 * (i.isEven ? 1 : -0.7) + i * 2.1;
      final p = center + Offset(
        (r * 0.12) * (i == 1 ? -1 : 1) + 0,
        0,
      );
      canvas.drawCircle(
        p + Offset(base * 0.12 * (t - 0.5), 0),
        2.2,
        Paint()..color = Colors.white.withValues(alpha: 0.0),
      );
    }
  }

  @override
  bool shouldRepaint(covariant _DesktopOrbPainter old) => old.t != t;
}
