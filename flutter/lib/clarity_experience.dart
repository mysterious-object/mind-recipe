import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:local_auth/local_auth.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:webview_flutter/webview_flutter.dart';

import 'app_services.dart';
import 'clarity_store.dart';
import 'recipes_screen.dart';
import 'voice_interface.dart';

class ClarityExperience extends StatefulWidget {
  const ClarityExperience({
    super.key,
    required this.api,
    required this.appState,
  });
  final MindRecipeApiClient api;
  final SecureAppState appState;
  @override
  State<ClarityExperience> createState() => _ClarityExperienceState();
}

class _ClarityExperienceState extends State<ClarityExperience>
    with WidgetsBindingObserver {
  late final AccountSession _account;
  late final ClarityStore _store;
  WebViewController? _web;
  Map<String, dynamic>? _snapshot;
  String? _error;
  String _screen = 'welcome';
  bool _locked = false;
  bool _authenticating = false;
  bool _lessonsOpen = false;
  OverlayEntry? _privacyCover;
  bool get _currentAccount =>
      mounted &&
      widget.appState.session?.email.trim().toLowerCase() ==
          _account.email.trim().toLowerCase();
  bool get _appLock => (_snapshot?['profile'] as Map?)?['appLock'] == true;

  @override
  void initState() {
    super.initState();
    _account = widget.appState.session!;
    _store = ClarityStore(_account.email);
    WidgetsBinding.instance.addObserver(this);
    unawaited(_initialize());
  }

  Future<void> _initialize() async {
    try {
      _snapshot = await _store.load();
      if (!_currentAccount) return;
      if (_snapshot == null) {
        final legacy = await _store.loadLegacyHistory();
        if (!_currentAccount) return;
        _snapshot = {
          'profile': {'name': _account.displayName},
          'history': migrateClarityHistory(legacy),
        };
      }
      if (_appLock) {
        setState(() => _locked = true);
        if (!await _authenticate()) return;
      }
      if (!_currentAccount) return;
      setState(() => _locked = false);
      await _createAfterUnlock();
      if (mounted) setState(() => _error = null);
    } catch (_) {
      if (mounted) {
        setState(
          () => _error =
              'Your saved Mind Recipe data could not be opened. Please retry.',
        );
      }
    }
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (_authenticating) return;
    if (state == AppLifecycleState.inactive ||
        state == AppLifecycleState.paused) {
      // Re-lock the journal tab even when the full-app lock is disabled.
      unawaited(
        _web?.runJavaScript(
          "window.dispatchEvent(new Event('mindrecipe-lock'));",
        ),
      );
      if (_appLock && mounted) _showPrivacyCover();
    } else if (state == AppLifecycleState.resumed && _locked) {
      unawaited(_unlock());
    }
  }

  void _showPrivacyCover() {
    setState(() => _locked = true);
    if (_privacyCover != null) return;
    _privacyCover = OverlayEntry(
      builder: (context) => Material(
        color: const Color(0xfff8fafc),
        child: SafeArea(
          child: Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text(
                  'Mind Recipe is locked.',
                  style: TextStyle(color: Color(0xff111827)),
                ),
                const SizedBox(height: 16),
                FilledButton(onPressed: _unlock, child: const Text('Unlock')),
              ],
            ),
          ),
        ),
      ),
    );
    Overlay.of(context, rootOverlay: true).insert(_privacyCover!);
  }

  Future<bool> _authenticate() async {
    if (_authenticating) return false;
    _authenticating = true;
    try {
      return await LocalAuthentication().authenticate(
        localizedReason: 'Unlock your Mind Recipe journal',
        persistAcrossBackgrounding: true,
      );
    } finally {
      _authenticating = false;
    }
  }

  Future<void> _unlock() async {
    try {
      if (!await _authenticate() || !_currentAccount) return;
      if (mounted) {
        setState(() {
          _locked = false;
          _error = null;
        });
      }
      _privacyCover?.remove();
      _privacyCover?.dispose();
      _privacyCover = null;
      if (_web == null) {
        await _createAfterUnlock();
      }
      if (mounted) setState(() {});
    } catch (_) {
      if (mounted) {
        setState(
          () => _error =
              'Could not unlock. Use your device passcode or try again.',
        );
      }
    }
  }

  Future<void> _createAfterUnlock() async {
    final controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color(0xfff8fafc))
      ..addJavaScriptChannel(
        'MindRecipeHost',
        onMessageReceived: (message) => unawaited(_message(message.message)),
      )
      ..setNavigationDelegate(
        NavigationDelegate(
          onWebResourceError: (error) {
            if (error.isForMainFrame == true && mounted) {
              setState(
                () => _error = 'The interface could not open. Please retry.',
              );
            }
          },
          onNavigationRequest: (request) {
            if (request.url.startsWith('file:') &&
                Uri.parse(request.url).path
                    .endsWith('/assets/clarity/index.html')) {
              return NavigationDecision.navigate;
            }
            unawaited(_openExternal(request.url).catchError((Object _) {}));
            return NavigationDecision.prevent;
          },
        ),
      );
    _web = controller;
    await controller.loadFlutterAsset('assets/clarity/index.html');
  }

  Future<void> _message(String raw) async {
    int? id;
    try {
      final message = jsonDecode(raw) as Map<String, dynamic>;
      id = message['id'] as int;
      if (!_currentAccount || (_locked && message['type'] != 'save')) {
        throw StateError('Please unlock your account.');
      }
      final payload = message['payload'];
      Object? result;
      switch (message['type']) {
        case 'load':
          result =
              _snapshot ??
              {
                'profile': {'name': _account.displayName},
              };
        case 'save':
          final next = Map<String, dynamic>.from(payload as Map);
          await _store.save(next);
          _snapshot = next;
        case 'screen':
          if (mounted) setState(() => _screen = payload as String);
        case 'authenticate':
          result = await _authenticate();
        case 'openLessons':
          if (_lessonsOpen) throw StateError('Lessons are already open.');
          _lessonsOpen = true;
          try {
            if (!mounted) return;
            await Navigator.of(context).push(
              MaterialPageRoute<void>(
                builder: (context) => Scaffold(
                  backgroundColor: Theme.of(context).colorScheme.surface,
                  appBar: AppBar(title: const Text('Mind Recipe')),
                  body: SafeArea(
                    top: false,
                    child: RecipesScreen(
                      api: widget.api,
                      appState: widget.appState,
                    ),
                  ),
                ),
              ),
            );
          } finally {
            _lessonsOpen = false;
          }
        case 'openUrl':
          await _openExternal(payload as String);
        case 'share':
          if (!mounted) return;
          final size = MediaQuery.sizeOf(context);
          await SharePlus.instance.share(
            ShareParams(
              text: payload as String,
              sharePositionOrigin: Rect.fromLTWH(
                size.width / 2,
                size.height / 2,
                1,
                1,
              ),
            ),
          );
        case 'haptic':
          await HapticFeedback.lightImpact();
        case 'dictate':
          if (!await VoiceInterface().isAvailable()) {
            throw StateError(
              'Speech recognition is unavailable on this device.',
            );
          }
          result = await VoiceInterface().startListening();
          if (result == null) {
            throw StateError(
              'No speech was captured. Please try again or type your note.',
            );
          }
        case 'signOut':
          await _store.flush();
          await widget.appState.signOut();
        default:
          throw StateError('Unknown app action.');
      }
      if (_currentAccount) await _reply(id, true, result);
    } catch (error) {
      if (id != null && _currentAccount) {
        await _reply(id, false, error.toString());
      }
    }
  }

  Future<void> _reply(int id, bool ok, Object? result) async {
    await _web?.runJavaScript(
      'window.mindRecipeReply($id, $ok, ${jsonEncode(result)});',
    );
  }

  Future<void> _openExternal(String address) async {
    final uri = Uri.tryParse(address);
    if (uri == null || !{'https', 'tel', 'sms'}.contains(uri.scheme)) {
      throw StateError('This link cannot be opened.');
    }
    if (!mounted) return;
    if (uri.scheme != 'https') {
      final confirmed = await showDialog<bool>(
        context: context,
        builder: (context) => AlertDialog(
          title: Text(
            uri.scheme == 'tel' ? 'Open phone dialer?' : 'Open Messages?',
          ),
          content: Text(uri.path),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: const Text('Cancel'),
            ),
            FilledButton(
              onPressed: () => Navigator.pop(context, true),
              child: const Text('Continue'),
            ),
          ],
        ),
      );
      if (confirmed != true) return;
    }
    if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
      throw StateError('No app is available to open this link.');
    }
  }

  @override
  void dispose() {
    _privacyCover?.remove();
    _privacyCover?.dispose();
    WidgetsBinding.instance.removeObserver(this);
    unawaited(VoiceInterface().stopListening());
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => PopScope(
    canPop: _screen == 'home' || _screen == 'welcome',
    onPopInvokedWithResult: (didPop, _) {
      if (!didPop) unawaited(_web?.runJavaScript('window.mindRecipeBack?.();'));
    },
    child: Scaffold(
      backgroundColor: const Color(0xfff8fafc),
      body: SafeArea(
        child: _locked || _error != null
            ? Center(
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        _error ?? 'Mind Recipe is locked.',
                        style: const TextStyle(color: Color(0xff111827)),
                      ),
                      const SizedBox(height: 16),
                      FilledButton(
                        onPressed: _locked ? _unlock : _initialize,
                        child: Text(_locked ? 'Unlock' : 'Retry'),
                      ),
                    ],
                  ),
                ),
              )
            : _web == null
            ? const Center(child: CircularProgressIndicator())
            : WebViewWidget(controller: _web!),
      ),
    ),
  );
}
