import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

class ThreeBrandMark extends StatefulWidget {
  const ThreeBrandMark({super.key, this.variant = 0});
  final int variant;
  @override
  State<ThreeBrandMark> createState() => _ThreeBrandMarkState();
}

class _ThreeBrandMarkState extends State<ThreeBrandMark> {
  WebViewController? controller;
  bool _webReady = false;
  @override
  void initState() {
    super.initState();
    _open();
  }

  @override
  void didUpdateWidget(covariant ThreeBrandMark oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.variant != widget.variant) {
      controller?.runJavaScript(
        'window.setBrandSceneVariant?.(${widget.variant})',
      );
    }
  }

  Future<void> _open() async {
    try {
      final c = WebViewController()
        ..setJavaScriptMode(JavaScriptMode.unrestricted)
        ..setBackgroundColor(Colors.transparent)
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
          'BrandBridge',
          onMessageReceived: (message) {
            if (message.message == 'ready' && mounted) {
              setState(() => _webReady = true);
            }
          },
        )
        ..loadFlutterAsset('assets/familiar/brand.html');
      await Future<void>.delayed(const Duration(milliseconds: 120));
      await c.runJavaScript('window.setBrandSceneVariant?.(${widget.variant})');
      if (mounted) setState(() => controller = c);
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) => Stack(
    fit: StackFit.expand,
    children: [
      if (controller != null)
        IgnorePointer(child: WebViewWidget(controller: controller!)),
      // Keep the actual Mind Recipe mark visible until its WebGL texture has
      // loaded. A WebView allocation must never result in an empty login card.
      AnimatedOpacity(
        opacity: _webReady ? 0 : 1,
        duration: const Duration(milliseconds: 220),
        child: IgnorePointer(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
            child: Image.asset(
              'assets/branding/mind-recipe-mark.png',
              fit: BoxFit.contain,
            ),
          ),
        ),
      ),
    ],
  );
}
