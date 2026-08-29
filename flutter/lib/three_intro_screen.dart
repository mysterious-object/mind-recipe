import 'dart:async';

import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

class ThreeIntroScreen extends StatefulWidget {
  const ThreeIntroScreen({
    super.key,
    required this.variant,
    required this.onComplete,
  });
  final int variant;
  final VoidCallback onComplete;

  @override
  State<ThreeIntroScreen> createState() => _ThreeIntroScreenState();
}

class _ThreeIntroScreenState extends State<ThreeIntroScreen>
    with SingleTickerProviderStateMixin {
  WebViewController? controller;
  Timer? advance;
  bool ready = false;
  late final AnimationController markMotion;

  @override
  void initState() {
    super.initState();
    markMotion = AnimationController(vsync: this, duration: const Duration(seconds: 4))..repeat(reverse: true);
    _open();
    advance = Timer(const Duration(milliseconds: 2800), widget.onComplete);
  }

  Future<void> _open() async {
    try {
      final c = WebViewController()
        ..setJavaScriptMode(JavaScriptMode.unrestricted)
        ..setBackgroundColor(const Color(0xff060912))
        ..setNavigationDelegate(
          NavigationDelegate(
            onNavigationRequest: (r) {
              final u = Uri.tryParse(r.url);
              return u != null &&
                      (u.scheme == 'file' ||
                          u.host == 'appassets.androidplatform.net')
                  ? NavigationDecision.navigate
                  : NavigationDecision.prevent;
            },
          ),
        )
        ..addJavaScriptChannel(
          'IntroBridge',
          onMessageReceived: (_) {
            if (mounted) setState(() => ready = true);
          },
        );
      await c.loadFlutterAsset('assets/familiar/intro.html');
      await Future<void>.delayed(const Duration(milliseconds: 120));
      await c.runJavaScript('window.setIntroVariant(${widget.variant})');
      if (mounted) setState(() => controller = c);
    } catch (_) {
      // The branded native mark remains visible when WebGL is unavailable.
    }
  }

  @override
  void dispose() {
    advance?.cancel();
    markMotion.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: const Color(0xff060912),
    body: GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTap: widget.onComplete,
      child: Stack(
        fit: StackFit.expand,
        children: [
          if (controller != null) WebViewWidget(controller: controller!),
          Center(child: AnimatedBuilder(animation: markMotion, builder: (_, child) => Transform.rotate(angle: (markMotion.value - .5) * .16, child: Transform.scale(scale: .88 + markMotion.value * .2, child: Opacity(opacity: ready ? .92 : 1, child: child))), child: Image.asset('assets/branding/mind-recipe-mark.png', height: 116))),
          const Positioned(
            left: 0,
            right: 0,
            bottom: 64,
            child: Text(
              'MIND RECIPE',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: Colors.white,
                letterSpacing: 5,
                fontWeight: FontWeight.w800,
              ),
            ),
          ),
        ],
      ),
    ),
  );
}
