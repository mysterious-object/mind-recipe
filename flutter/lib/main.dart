import 'dart:async';

import 'package:flutter/material.dart';

import 'account_gateway.dart';
import 'app_services.dart';
import 'clarity_experience.dart';

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
      if (!appState.loaded)
        await appState.load(includeLegacyPreferences: false);
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
    final scheme = ColorScheme.fromSeed(seedColor: const Color(0xff7c3aed))
        .copyWith(primary: const Color(0xff7435cc), surface: Colors.white);
    final border = OutlineInputBorder(
      borderRadius: BorderRadius.circular(16),
      borderSide: const BorderSide(color: Color(0xffd7d4e2)),
    );
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'MindRecipe',
      theme: ThemeData(
        colorScheme: scheme,
        useMaterial3: true,
        scaffoldBackgroundColor: const Color(0xfffaf9ff),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: Colors.white,
          border: border,
          enabledBorder: border,
        ),
        filledButtonTheme: FilledButtonThemeData(
          style: FilledButton.styleFrom(
            minimumSize: const Size(0, 52),
            shape: const StadiumBorder(),
          ),
        ),
      ),
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
