import 'dart:async';

import 'package:flutter/material.dart';

import 'account_gateway.dart';
import 'app_services.dart';
import 'clarity_experience.dart';
import 'design_tokens.dart';
import 'visual_theme.dart';

const _themeLiveCheck = bool.fromEnvironment('MIND_RECIPE_THEME_LIVE_CHECK');

void main() => runApp(const MindRecipeApp());

class MindRecipeApp extends StatefulWidget {
  const MindRecipeApp({super.key, this.initialAppState, this.initialApi});
  final SecureAppState? initialAppState;
  final MindRecipeApiClient? initialApi;
  @override
  State<MindRecipeApp> createState() => _MindRecipeAppState();
}

class _MindRecipeAppState extends State<MindRecipeApp> {
  bool _initializing = true;
  late final MindRecipeApiClient api;
  late final SecureAppState appState;

  @override
  void initState() {
    super.initState();
    api = widget.initialApi ?? MindRecipeApiClient();
    appState = widget.initialAppState ?? SecureAppState();
    appState.addListener(_refresh);
    _initialize();
  }

  Future<void> _initialize() async {
    try {
      if (!appState.loaded) await appState.load();
      final restored = appState.session;
      if (restored != null) {
        final restoredAccount = await api
            .restoreSession(restored)
            .timeout(
              const Duration(seconds: 8),
              onTimeout: () => AccountRestoreResult(
                AccountRestoreStatus.temporarilyUnavailable,
                restored,
              ),
            );
        appState.sessionTemporarilyUnverified =
            restoredAccount.status ==
            AccountRestoreStatus.temporarilyUnavailable;
        if (restoredAccount.status == AccountRestoreStatus.invalid) {
          await appState.clearSession();
        } else if (restoredAccount.status == AccountRestoreStatus.verified) {
          await appState.setSession(restoredAccount.session!);
        }
      }
      // The separately identified live-check package must remain testable
      // when the staging identity service is unavailable. This flag is set
      // only by its dedicated workflow; release APKs and IPAs never receive
      // the local session.
      if (_themeLiveCheck && appState.session == null) {
        appState.useLocalDemo();
      }
    } finally {
      if (mounted) setState(() => _initializing = false);
    }
    if (!appState.sessionTemporarilyUnverified) {
      unawaited(appState.flushPendingCheckIns(api));
    }
  }

  void _refresh() {
    if (mounted) setState(() {});
  }

  @override
  void dispose() {
    appState.removeListener(_refresh);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final themeMode = switch (appState.appearanceMode) {
      'light' => ThemeMode.light,
      'dark' => ThemeMode.dark,
      _ => ThemeMode.system,
    };
    final visual = visualThemeFor(appState.visualThemeId);
    final seed = visual.primary;
    final secondary = visual.secondary;
    final tertiary = visual.tertiary;
    final scheme = ColorScheme.fromSeed(
      seedColor: seed,
      brightness: Brightness.light,
    ).copyWith(primary: seed, secondary: secondary, tertiary: tertiary);
    return MaterialApp(
      title: 'MindRecipe',
      theme: ThemeData(
        colorScheme: scheme,
        useMaterial3: true,
        scaffoldBackgroundColor: Colors.transparent,
      ),
      darkTheme: ThemeData(
        colorScheme:
            ColorScheme.fromSeed(
              seedColor: seed,
              brightness: Brightness.dark,
            ).copyWith(
              primary: seed,
              secondary: secondary,
              tertiary: tertiary,
              surface: MindRecipeTokens.surfaceBlack,
            ),
        useMaterial3: true,
        scaffoldBackgroundColor: Colors.transparent,
      ),
      themeMode: themeMode,
      home: !appState.loaded || _initializing
          ? const Scaffold(body: Center(child: CircularProgressIndicator()))
          : appState.session == null
          ? AccountGateway(api: api, appState: appState)
          : ClarityExperience(
              key: ObjectKey(appState.session),
              api: api,
              appState: appState,
            ),
    );
  }
}
