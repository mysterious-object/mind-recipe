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
        ..addJavaScriptChannel('BrandBridge', onMessageReceived: (_) {})
        ..loadFlutterAsset('assets/familiar/brand.html');
      await Future<void>.delayed(const Duration(milliseconds: 120));
      await c.runJavaScript('window.setBrandSceneVariant?.(${widget.variant})');
      if (mounted) setState(() => controller = c);
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) => controller == null
      ? Image.asset('assets/branding/mind-recipe-mark.png')
      : IgnorePointer(child: WebViewWidget(controller: controller!));
}
