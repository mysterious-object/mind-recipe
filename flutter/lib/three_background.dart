import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

/// Locally bundled Three.js background. It performs no network requests and
/// ignores pointer input so the native controls above it remain authoritative.
class ThreeBackground extends StatefulWidget {
  const ThreeBackground({
    super.key,
    required this.variant,
    required this.progress,
    required this.intensity,
    this.fallback,
  });
  final String variant;
  final double progress;
  final double intensity;
  final Widget? fallback;

  @override
  State<ThreeBackground> createState() => _ThreeBackgroundState();
}

class _ThreeBackgroundState extends State<ThreeBackground>
    with WidgetsBindingObserver {
  WebViewController? _controller;
  bool _ready = false;
  bool _failed = false;
  Timer? _deadline;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _open();
    _deadline = Timer(const Duration(seconds: 5), () {
      if (mounted && !_ready) setState(() => _failed = true);
    });
  }

  Future<void> _open() async {
    try {
      final controller = WebViewController()
        ..setJavaScriptMode(JavaScriptMode.unrestricted)
        ..setBackgroundColor(Colors.transparent)
        ..setNavigationDelegate(NavigationDelegate(onNavigationRequest: (r) {
          final uri = Uri.tryParse(r.url);
          final local = uri != null &&
              (uri.scheme == 'file' ||
                  uri.host == 'appassets.androidplatform.net');
          return local
              ? NavigationDecision.navigate
              : NavigationDecision.prevent;
        }, onWebResourceError: (error) {
          if (error.isForMainFrame == true && mounted) {
            setState(() => _failed = true);
          }
        }))
        ..addJavaScriptChannel(
          'BackgroundBridge',
          onMessageReceived: (message) {
            if (message.message == 'context_lost') {
              if (mounted) setState(() => _failed = true);
              return;
            }
            _deadline?.cancel();
            _ready = true;
            _send();
          },
        )
        ..loadFlutterAsset('assets/familiar/background.html');
      if (mounted) setState(() => _controller = controller);
    } catch (_) {
      // Native theme color remains as the accessible fallback.
      if (mounted) setState(() => _failed = true);
    }
  }

  @override
  void didUpdateWidget(covariant ThreeBackground oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.variant != widget.variant ||
        oldWidget.progress != widget.progress ||
        oldWidget.intensity != widget.intensity) _send();
  }

  Future<void> _send() async {
    if (!_ready || _controller == null) return;
    final state = jsonEncode({
      'variant': widget.variant,
      'progress': widget.progress,
      'intensity': widget.intensity,
    });
    await _controller!.runJavaScript('window.setBackgroundState($state)');
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    _controller?.runJavaScript(
      'window.setBackgroundPaused(${state != AppLifecycleState.resumed})',
    );
  }

  @override
  void dispose() {
    _deadline?.cancel();
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_failed || _controller == null) return const SizedBox.expand();
    return IgnorePointer(child: WebViewWidget(controller: _controller!));
  }
}
