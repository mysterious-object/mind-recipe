import 'dart:async';

import 'package:flutter/material.dart';
import 'package:package_info_plus/package_info_plus.dart';

import 'dart:io';

import 'mobile_automation.dart';

import 'package:url_launcher/url_launcher.dart';

import 'account_gateway.dart';
import 'app_services.dart';
import 'check_in_state.dart';
import 'cinematic_experience.dart';
import 'daily_navigation.dart';
import 'design_tokens.dart';
import 'navigator_chat.dart';
import 'mind_recipe_fx.dart';
import 'on_device_inference.dart';
import 'notification_scheduler.dart';
import 'practitioner_sharing.dart';
import 'pulse_screen.dart';
import 'recipes_screen.dart';
import 'voice_interface.dart';
import 'three_intro_screen.dart';
import 'three_background.dart';

void main() => runApp(const MindRecipeApp());

class MindRecipeApp extends StatefulWidget {
  const MindRecipeApp({super.key, this.initialAppState, this.initialApi});
  final SecureAppState? initialAppState;
  final MindRecipeApiClient? initialApi;
  @override
  State<MindRecipeApp> createState() => _MindRecipeAppState();
}

class _MindRecipeAppState extends State<MindRecipeApp> {
  bool practitionerMode = false;
  bool onboardingComplete = false;
  bool _initializing = true;
  bool _introComplete = false;
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
        final verified = await api.restoreSession(restored);
        if (verified == null) {
          await appState.clearSession();
        } else {
          await appState.setSession(verified);
        }
      }
      await appState.flushPendingCheckIns(api);
      appState.setManagedAiAvailable(await api.aiAvailable());
    } finally {
      if (mounted) setState(() => _initializing = false);
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
    final (seed, secondary, tertiary) = switch (appState.chimeraTheme) {
      'cyberpunk-neon' => (
        const Color(0xffff0066),
        const Color(0xff00ffff),
        const Color(0xff39ff14),
      ),
      'organic-bioluminescent' => (
        const Color(0xff00e5ff),
        const Color(0xff76ff03),
        const Color(0xffffab00),
      ),
      'quantum-void' => (
        const Color(0xff7c4dff),
        const Color(0xff448aff),
        const Color(0xffff6e40),
      ),
      'holographic-matrix' => (
        const Color(0xff00ff41),
        const Color(0xff00bcd4),
        const Color(0xffff4081),
      ),
      'oceanic-cyan' => (
        const Color(0xff00f5ff),
        const Color(0xff00a8ff),
        const Color(0xffb7f2ff),
      ),
      'solar-ember' => (
        const Color(0xffff4f0d),
        const Color(0xffffc214),
        const Color(0xff7a0503),
      ),
      'deep-ocean' => (
        const Color(0xff00b3d9),
        const Color(0xff034080),
        const Color(0xff0df2b3),
      ),
      'aurora-spectrum' => (
        const Color(0xff26ffa6),
        const Color(0xff9940ff),
        const Color(0xffff2699),
      ),
      'crimson-pulse' => (
        const Color(0xffff0d1f),
        const Color(0xffbf0061),
        const Color(0xffff990d),
      ),
      'monochrome-glass' => (
        const Color(0xffe6f5ff),
        const Color(0xff7a8c9e),
        const Color(0xffffffff),
      ),
      'ultraviolet-bloom' => (
        const Color(0xff9e1aff),
        const Color(0xff33ccff),
        const Color(0xffff1abf),
      ),
      _ => (
        const Color(0xff00e5cc),
        const Color(0xff7c3aed),
        const Color(0xff00e68a),
      ),
    };
    final scheme = ColorScheme.fromSeed(
      seedColor: seed,
      brightness: Brightness.light,
    ).copyWith(primary: seed, secondary: secondary, tertiary: tertiary);
    return MaterialApp(
      title: 'Mind Recipe',
      theme: ThemeData(
        colorScheme: scheme,
        useMaterial3: true,
        scaffoldBackgroundColor: MindRecipeTokens.surfaceWhite,
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
        scaffoldBackgroundColor: MindRecipeTokens.voidBlack,
      ),
      themeMode: themeMode,
      home: !_introComplete
          ? ThreeIntroScreen(
              variant:
                  (DateTime.now().millisecondsSinceEpoch ~/ 86400000 ~/ 2) % 12,
              onComplete: () => setState(() => _introComplete = true),
            )
          : !appState.loaded || _initializing
          ? const Scaffold(body: Center(child: CircularProgressIndicator()))
          : appState.session == null
          ? AccountGateway(api: api, appState: appState)
          : !onboardingComplete
          ? CinematicOnboarding(
              onComplete: () => setState(() => onboardingComplete = true),
            )
          : practitionerMode
          ? PractitionerHome(
              onExit: () => setState(() => practitionerMode = false),
            )
          : MemberHome(
              onPractitioner: () => setState(() => practitionerMode = true),
              api: api,
              appState: appState,
              onSignOut: () async {
                await appState.signOut();
                if (mounted) setState(() => onboardingComplete = false);
              },
            ),
    );
  }
}

class MemberHome extends StatefulWidget {
  const MemberHome({
    super.key,
    required this.onPractitioner,
    required this.api,
    required this.appState,
    required this.onSignOut,
  });
  final VoidCallback onPractitioner;
  final MindRecipeApiClient api;
  final SecureAppState appState;
  final VoidCallback onSignOut;
  @override
  State<MemberHome> createState() => _MemberHomeState();
}

class _MemberHomeState extends State<MemberHome> {
  int index = 0;
  int previousIndex = 0;
  final checkIn = CheckInState();
  final tools = <String>{};
  final chatMessages = <ChatMessage>[];
  final labels = const [
    'Daily Nav',
    'Navigator',
    'Recipes',
    'Pulse',
    'Booking',
    'Settings',
  ];
  final icons = const [
    Icons.route_rounded,
    Icons.explore_rounded,
    Icons.menu_book,
    Icons.monitor_heart,
    Icons.calendar_month,
    Icons.settings,
  ];
  late final PageController pageController;
  late final ScrollController railController;
  Timer? navigatorReadinessTimer;
  Timer? _voiceBubbleTimer;
  bool _voiceIsSpeaking = false;
  bool _voiceIsListening = false;
  String? _lastAssistantSnippet;
  DateTime? _bubbleDismissedAt;
  String? _lastSeenAssistantText;
  Offset _navigatorBubbleOffset = Offset.zero;

  @override
  void initState() {
    super.initState();
    pageController = PageController();
    railController = ScrollController();
    // Readiness belongs to the signed-in app lifecycle, not to whether the
    // Navigator page happened to be laid out by PageView yet.
    unawaited(_primeNavigator());
    navigatorReadinessTimer = Timer.periodic(
      const Duration(seconds: 8),
      (_) => unawaited(_primeNavigator()),
    );
    _voiceBubbleTimer = Timer.periodic(const Duration(milliseconds: 350), (_) {
      final speaking = VoiceInterface().isSpeaking;
      final listening = VoiceInterface().isListening;
      String? snippet;
      for (var i = chatMessages.length - 1; i >= 0; i--) {
        if (chatMessages[i].role == ChatRole.assistant) {
          snippet = chatMessages[i].text;
          break;
        }
      }
      final isNewSnippet = snippet != _lastSeenAssistantText;
      if (isNewSnippet && snippet != null) {
        _lastSeenAssistantText = snippet;
        // New assistant message clears dismissal so bubble can reappear
        _bubbleDismissedAt = null;
      }
      // If dismissed, keep hidden for 90s or until a new assistant message arrives
      final dismissedRecently =
          _bubbleDismissedAt != null &&
          DateTime.now().difference(_bubbleDismissedAt!).inSeconds < 90 &&
          !isNewSnippet;
      String? visibleSnippet = dismissedRecently ? null : snippet;
      // Also keep bubble visible for 12s after last assistant message even when not speaking
      // The snippet is already the visible one - no extra logic needed beyond dismissal
      if (visibleSnippet != _lastAssistantSnippet ||
          speaking != _voiceIsSpeaking ||
          listening != _voiceIsListening) {
        if (mounted)
          setState(() {
            _voiceIsSpeaking = speaking;
            _voiceIsListening = listening;
            _lastAssistantSnippet = visibleSnippet;
          });
      }
    });
  }

  Future<void> _primeNavigator() async {
    await OnDeviceInference().refreshStatus();
    if (!widget.appState.aiAvailable) {
      widget.appState.setManagedAiAvailable(await widget.api.aiAvailable());
    }
    if (widget.appState.aiAvailable) navigatorReadinessTimer?.cancel();
  }

  @override
  void dispose() {
    pageController.dispose();
    railController.dispose();
    navigatorReadinessTimer?.cancel();
    _voiceBubbleTimer?.cancel();
    super.dispose();
  }

  void revealTab(int value) {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted || !railController.hasClients) return;
      final target = (value * 66.0 - 24).clamp(
        0.0,
        railController.position.maxScrollExtent,
      );
      if (MediaQuery.disableAnimationsOf(context)) {
        railController.jumpTo(target);
      } else {
        railController.animateTo(
          target,
          duration: const Duration(milliseconds: 360),
          curve: Curves.easeOutCubic,
        );
      }
    });
  }

  void goToPage(int value) {
    if (value == index) return;
    final reduceMotion = MediaQuery.disableAnimationsOf(context);
    setState(() {
      previousIndex = index;
      index = value;
    });
    revealTab(value);
    if (reduceMotion) {
      pageController.jumpToPage(value);
    } else {
      pageController.animateToPage(
        value,
        duration: const Duration(milliseconds: 460),
        curve: Curves.easeOutCubic,
      );
    }
  }

  /// Daily navigation stays manual — launched from the chat header — and
  /// stays in sync: completion records the pulse, posts a status message
  /// into this thread, and lands on the Pulse tab.
  Future<void> _showDailyNav() async {
    final pulses = await widget.appState.loadMoodPulses();
    final lastPulse = pulses.isEmpty
        ? null
        : DateTime.tryParse(pulses.last['t']?.toString() ?? '');
    final lastPulseText = lastPulse == null
        ? 'no pulse yet'
        : 'last pulse ${DateTime.now().difference(lastPulse).inHours}h ago';
    final history = await widget.appState.loadNavigationHistory();
    var lastNavText = '';
    if (history.isNotEmpty) {
      final t = DateTime.tryParse(history.first['t']?.toString() ?? '');
      if (t != null) {
        final h = DateTime.now().difference(t).inHours;
        lastNavText =
            ' \u00b7 last nav: ${history.first['emotions']} ${history.first['activation']}/10, ${h}h ago';
      }
    }
    final summary =
        'Today: ${widget.appState.navigationSessions} navigation(s) · '
        '${widget.appState.messagesSent} chat messages · $lastPulseText'
        '$lastNavText';
    if (!mounted) return;
    await Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => DailyNavigation(
          appState: widget.appState,
          syncSummary: summary,
          onSeePulse: () {
            Navigator.of(context).pop();
            goToPage(2);
          },
          onComplete: () {
            _recordNavigationEvent();
            widget.appState.recordAssistantMessage(startsSession: true);
            widget.appState.recordAiReflection();
            final mood = MoodState.fromCheckIn(checkIn);
            widget.appState.recordMoodPulse(
              valence: mood.valence,
              activation: mood.activation,
              source: 'navigation',
            );
            chatMessages.add(
              const ChatMessage(
                role: ChatRole.status,
                text: 'Daily navigation complete — your pulse was updated.',
              ),
            );
            setState(() {});
          },
        ),
      ),
    );
  }

  void _onRecipeAskNavigator(String prompt, String response) {
    setState(() {
      chatMessages.add(ChatMessage(role: ChatRole.member, text: prompt));
      chatMessages.add(
        ChatMessage(
          role: ChatRole.assistant,
          text: response,
          localGenerated: true,
        ),
      );
    });
    goToPage(1);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Added to Navigator — continue the conversation there'),
      ),
    );
  }

  void _recordNavigationEvent() {
    final now = DateTime.now().toUtc();
    unawaited(
      widget.api
          .ingestMemberEvents(widget.appState.session?.token ?? '', [
            {
              'id': 'daily-nav-${now.microsecondsSinceEpoch}',
              'kind': 'daily_navigation_completed',
              'occurred_at': now.toIso8601String(),
              'source': 'daily_navigation',
              'provenance': 'member',
              'payload': {'route': '2067_daily_navigation'},
              'consent_scope': 'device',
              'schema_version': 'v1',
            },
          ])
          .catchError((_) {}),
    );
  }

  Future<void> _showContextNavigator() async {
    final destination = labels[index];
    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      backgroundColor: Theme.of(context).colorScheme.surface,
      builder: (sheetContext) => FractionallySizedBox(
        heightFactor: .68,
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 10, 8, 4),
              child: Row(
                children: [
                  Image.asset(
                    'assets/branding/navigator-compass.png',
                    width: 30,
                    height: 30,
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'Navigator · $destination',
                      style: Theme.of(context).textTheme.titleMedium
                          ?.copyWith(fontWeight: FontWeight.w800),
                    ),
                  ),
                  IconButton(
                    onPressed: () => Navigator.pop(sheetContext),
                    icon: const Icon(Icons.keyboard_arrow_down_rounded),
                    tooltip: 'Minimize Navigator',
                  ),
                ],
              ),
            ),
            Expanded(
              child: NavigatorChatExperience(
                state: checkIn,
                onChanged: () => setState(() {}),
                api: widget.api,
                appState: widget.appState,
                messages: chatMessages,
              ),
            ),
          ],
        ),
      ),
    );
    if (mounted) setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    final screens = [
      _KeepAlivePage(
        child: DailyNavigation(
          appState: widget.appState,
          syncSummary: '',
          onSeePulse: () => goToPage(3),
          onComplete: () {
            _recordNavigationEvent();
            widget.appState.recordAssistantMessage(startsSession: true);
            widget.appState.recordAiReflection();
            final mood = MoodState.fromCheckIn(checkIn);
            widget.appState.recordMoodPulse(
              valence: mood.valence,
              activation: mood.activation,
              source: 'navigation',
            );
            chatMessages.add(
              const ChatMessage(
                role: ChatRole.status,
                text: 'Daily navigation complete — your pulse was updated.',
              ),
            );
            setState(() {});
          },
        ),
      ),
      _KeepAlivePage(
        child: NavigatorChatExperience(
          state: checkIn,
          onChanged: () => setState(() {}),
          api: widget.api,
          appState: widget.appState,
          messages: chatMessages,
        ),
      ),
      _KeepAlivePage(
        child: RecipesScreen(
          api: widget.api,
          appState: widget.appState,
          onAskNavigator: _onRecipeAskNavigator,
        ),
      ),
      _KeepAlivePage(
        child: PulseScreen(checkIn: checkIn, appState: widget.appState),
      ),
      const _KeepAlivePage(child: BookingScreen()),
      _KeepAlivePage(
        child: ProfileScreen(
          onPractitioner: widget.onPractitioner,
          appState: widget.appState,
          onSignOut: widget.onSignOut,
        ),
      ),
    ];
    return AnimatedBuilder(
      animation: pageController,
      builder: (context, _) {
        final progress = pageController.hasClients
            ? pageController.page ?? index.toDouble()
            : index.toDouble();
        return Scaffold(
          appBar: AppBar(
            title: MindRecipePageTitle(
              title: labels[index],
              forward: index >= previousIndex,
            ),
            actions: [
              IconButton(
                icon: Icon(
                  Theme.of(context).brightness == Brightness.dark
                      ? Icons.light_mode
                      : Icons.dark_mode,
                ),
                tooltip: 'Toggle dark mode',
                onPressed: () => widget.appState.setAppearanceMode(
                  Theme.of(context).brightness == Brightness.dark
                      ? 'light'
                      : 'dark',
                ),
              ),
            ],
          ),
          body: SafeArea(
            child: Column(
              children: [
                const PrivateModelDownloadBanner(),
                Expanded(
                  child: Stack(
                    children: [
                      if (widget.appState.chimeraFxEnabled)
                        Positioned.fill(
                          child: ThreeBackground(
                            progress: progress,
                            variant: widget.appState.chimeraFxVariant,
                            intensity: widget.appState.chimeraFxIntensity,
                            theme: widget.appState.chimeraVfxTheme,
                          ),
                        ),
                      PageView(
                        controller: pageController,
                        physics: MediaQuery.disableAnimationsOf(context)
                            ? const NeverScrollableScrollPhysics()
                            : const BouncingScrollPhysics(),
                        onPageChanged: (value) {
                          setState(() {
                            previousIndex = index;
                            index = value;
                          });
                          revealTab(value);
                        },
                        children: screens,
                      ),
                      if (index != 1)
                        Positioned(
                          right: (12 - _navigatorBubbleOffset.dx)
                              .clamp(8, 220)
                              .toDouble(),
                          bottom: (18 - _navigatorBubbleOffset.dy)
                              .clamp(8, 440)
                              .toDouble(),
                          child: _NavigatorMiniChatBubble(
                            location: labels[index],
                            snippet: _lastAssistantSnippet,
                            active: _voiceIsSpeaking || _voiceIsListening,
                            speaking: _voiceIsSpeaking,
                            listening: _voiceIsListening,
                            onTap: _showContextNavigator,
                            onDrag: (delta) => setState(() {
                              _navigatorBubbleOffset += delta;
                              _navigatorBubbleOffset = Offset(
                                _navigatorBubbleOffset.dx
                                    .clamp(-190, 4)
                                    .toDouble(),
                                _navigatorBubbleOffset.dy
                                    .clamp(-380, 10)
                                    .toDouble(),
                              );
                            }),
                          ),
                        ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          bottomNavigationBar: LayoutBuilder(
            builder: (context, constraints) {
              // Desktop: show orb + Orbit news in a side panel, keep rail
              final isDesktop = MediaQuery.sizeOf(context).width > 900;
              if (isDesktop) {
                return MindRecipePageRail(
                  labels: labels,
                  icons: icons,
                  selectedIndex: index,
                  progress: progress,
                  scrollController: railController,
                  onSelected: goToPage,
                  useCompassIcon: true,
                );
              }
              return MindRecipePageRail(
                labels: labels,
                icons: icons,
                selectedIndex: index,
                progress: progress,
                scrollController: railController,
                onSelected: goToPage,
                useCompassIcon: true,
              );
            },
          ),
        );
      },
    );
  }
}

class _NavigatorMiniChatBubble extends StatelessWidget {
  const _NavigatorMiniChatBubble({
    required this.location,
    required this.snippet,
    required this.active,
    required this.speaking,
    required this.listening,
    required this.onTap,
    required this.onDrag,
  });

  final String location;
  final String? snippet;
  final bool active;
  final bool speaking;
  final bool listening;
  final VoidCallback onTap;
  final ValueChanged<Offset> onDrag;

  @override
  Widget build(BuildContext context) {
    final preview = snippet == null || snippet!.trim().isEmpty
        ? 'Talk freely'
        : snippet!;
    return Semantics(
      button: true,
      label: 'Open Navigator mini chat',
      child: GestureDetector(
        onPanUpdate: (details) => onDrag(details.delta),
        onTap: onTap,
        child: Material(
          elevation: 12,
          color: Theme.of(context).colorScheme.surface.withValues(alpha: .96),
          borderRadius: BorderRadius.circular(28),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 276),
            child: Padding(
              padding: const EdgeInsets.fromLTRB(8, 8, 14, 8),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Stack(
                    clipBehavior: Clip.none,
                    children: [
                      MindRecipeOrbBadge(size: 42, active: active),
                      Positioned(
                        right: -1,
                        bottom: -1,
                        child: DecoratedBox(
                          decoration: BoxDecoration(
                            color: active
                                ? Theme.of(context).colorScheme.tertiary
                                : Theme.of(context).colorScheme.primary,
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: Theme.of(context).colorScheme.surface,
                              width: 2,
                            ),
                          ),
                          child: const SizedBox(width: 10, height: 10),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(width: 9),
                  Flexible(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          speaking
                              ? 'Navigator is speaking'
                              : listening
                              ? 'Navigator is listening'
                              : 'Navigator · $location',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                        Text(
                          preview,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            color: Theme.of(context)
                                .colorScheme
                                .onSurfaceVariant,
                            fontSize: 11,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 3),
                  const Icon(Icons.chat_bubble_rounded, size: 17),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _KeepAlivePage extends StatefulWidget {
  const _KeepAlivePage({required this.child});
  final Widget child;
  @override
  State<_KeepAlivePage> createState() => _KeepAlivePageState();
}

class _KeepAlivePageState extends State<_KeepAlivePage>
    with AutomaticKeepAliveClientMixin {
  @override
  bool get wantKeepAlive => true;
  @override
  Widget build(BuildContext context) {
    super.build(context);
    return widget.child;
  }
}

/// Persistent banner for the selected private model so progress is visible
/// on every tab (Recipes, Progress, Settings, etc.), not just Settings.
/// Fixes the tab-switch bug where the LinearProgressIndicator disappeared.
class PrivateModelDownloadBanner extends StatefulWidget {
  const PrivateModelDownloadBanner({super.key});
  @override
  State<PrivateModelDownloadBanner> createState() =>
      _PrivateModelDownloadBannerState();
}

class _PrivateModelDownloadBannerState
    extends State<PrivateModelDownloadBanner> {
  LocalInferenceSnapshot _snap = const LocalInferenceSnapshot(
    OnDeviceStatus.checking,
  );
  Timer? _timer;
  bool _errorDismissed = false;

  @override
  void initState() {
    super.initState();
    _snap = OnDeviceInference().snapshot;
    _timer = Timer.periodic(const Duration(milliseconds: 400), (_) {
      if (!mounted) return;
      final cur = OnDeviceInference().snapshot;
      // Only repaint when status/progress actually changes to avoid spamming
      if (cur.status != _snap.status ||
          (cur.status == OnDeviceStatus.downloading &&
              OnDeviceInference().downloadProgress !=
                  (_snap.status == OnDeviceStatus.downloading
                      ? OnDeviceInference().downloadProgress
                      : -1))) {
        setState(() {
          _snap = cur;
          if (cur.status != OnDeviceStatus.error) _errorDismissed = false;
        });
      } else if (cur.status == OnDeviceStatus.downloading ||
          cur.status == OnDeviceStatus.verifying) {
        // Still need to tick for progress bar animation
        setState(() => _snap = cur);
      } else if (cur.status == OnDeviceStatus.notInstalled ||
          cur.status == OnDeviceStatus.checking) {
        // Keep polling for auto-start (refreshStatus is safe now — it won't
        // clobber downloading) so banner appears as soon as download begins
        setState(() => _snap = cur);
        // A .partial left by a killed session resumes automatically —
        // the download persists across app restarts.
        OnDeviceInference().resumeIfInterrupted();
      }
    });
    // Also seed once from refreshStatus in case a .partial already exists
    OnDeviceInference().refreshStatus().then((s) {
      if (mounted) setState(() => _snap = s);
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDownloading = _snap.status == OnDeviceStatus.downloading;
    final isVerifying = _snap.status == OnDeviceStatus.verifying;
    final isError = _snap.status == OnDeviceStatus.error;
    if (!isDownloading && !isVerifying && !isError)
      return const SizedBox.shrink();
    if (isError && _errorDismissed) return const SizedBox.shrink();
    if (isError) {
      return Material(
        elevation: 6,
        color: Theme.of(context).colorScheme.errorContainer.withOpacity(0.98),
        child: SafeArea(
          bottom: false,
          child: Padding(
            padding: const EdgeInsets.fromLTRB(14, 8, 14, 10),
            child: Row(
              children: [
                const Icon(Icons.error_outline, size: 18),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    _snap.detail ?? 'Private model setup failed.',
                    style: const TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 12.5,
                    ),
                  ),
                ),
                TextButton(
                  onPressed: () async {
                    // Retry helper – re-trigger from banner without leaving tab
                    try {
                      await OnDeviceInference().installModel();
                    } catch (_) {}
                  },
                  child: const Text('Retry'),
                ),
                IconButton(
                  tooltip: 'Dismiss',
                  onPressed: () => setState(() => _errorDismissed = true),
                  icon: const Icon(Icons.close_rounded, size: 18),
                ),
              ],
            ),
          ),
        ),
      );
    }
    final progress = OnDeviceInference().downloadProgress;
    final percent = isDownloading
        ? (progress * 100).clamp(0, 100).toStringAsFixed(0)
        : null;
    final downloadedMb = OnDeviceInference().downloadedBytes / (1024 * 1024);
    final totalMb = OnDeviceInference().activeModel.sizeBytes / (1024 * 1024);
    final rate = OnDeviceInference().downloadBytesPerSecond;
    final remaining = OnDeviceInference().estimatedDownloadRemaining;
    final transferDetail = rate > 0
        ? '${(rate / (1024 * 1024)).toStringAsFixed(1)} MB/s${remaining == null ? '' : ' · about ${_formatRemaining(remaining)} left'}'
        : 'Calculating download time…';
    return Material(
      elevation: 6,
      color: Theme.of(context).colorScheme.surface.withOpacity(0.98),
      child: SafeArea(
        bottom: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(14, 8, 14, 10),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(
                      strokeWidth: 2.4,
                      value: isVerifying ? null : progress,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      isDownloading
                          ? 'Downloading private model $percent% — stays active when switching tabs'
                          : 'Verifying download and starting private AI…',
                      style: const TextStyle(
                        fontWeight: FontWeight.w700,
                        fontSize: 13.5,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    isDownloading
                        ? '${downloadedMb.toStringAsFixed(0)} / ${totalMb.toStringAsFixed(0)} MB'
                        : '',
                    style: TextStyle(
                      fontSize: 11,
                      color: Theme.of(context).textTheme.bodySmall?.color
                          ?.withOpacity(0.7),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              LinearProgressIndicator(value: isDownloading ? progress : null),
              const SizedBox(height: 4),
              Text(
                isDownloading
                    ? '$transferDetail. Keep the app open on Wi-Fi; you can use any tab while it downloads. Partial is kept for resume.'
                    : 'Verifying 10-min limit · hashing and starting engine (~30 s after download). If this fails, banner shows Retry – try the smaller Fast model on low-storage devices.',
                style: TextStyle(
                  fontSize: 11.5,
                  color: Theme.of(context).textTheme.bodySmall?.color
                      ?.withOpacity(0.68),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _formatRemaining(Duration value) {
    if (value.inHours >= 1)
      return '${value.inHours}h ${(value.inMinutes % 60)}m';
    if (value.inMinutes >= 1) return '${value.inMinutes} min';
    return '${value.inSeconds.clamp(1, 59)} sec';
  }
}

class TodayScreen extends StatefulWidget {
  const TodayScreen({super.key, required this.appState});
  final SecureAppState appState;
  @override
  State<TodayScreen> createState() => _TodayScreenState();
}

class _TodayScreenState extends State<TodayScreen> {
  Map<String, dynamic>? _trends;
  List<dynamic> _patterns = [];
  bool _loaded = false;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final api = MindRecipeApiClient();
    final memberId = widget.appState.session?.email ?? 'dev-member';
    final trends = await api.getTrends(memberId);
    final patterns = await api.detectPatterns(memberId);
    if (mounted)
      setState(() {
        _trends = trends;
        _patterns = patterns;
        _loaded = true;
      });
  }

  @override
  Widget build(BuildContext context) => ListView(
    padding: const EdgeInsets.all(20),
    children: [
      const Text(
        'Your day, shaped by the navigation you have done with Navigator.',
        style: TextStyle(fontSize: 22, fontWeight: FontWeight.w700),
      ),
      const SizedBox(height: 16),
      Card(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Assistant activity',
                style: TextStyle(fontWeight: FontWeight.w700, fontSize: 18),
              ),
              const SizedBox(height: 14),
              Row(
                children: [
                  Expanded(
                    child: _TodayMetric(
                      value: widget.appState.navigationSessions,
                      label: 'Navigations',
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: _TodayMetric(
                      value: widget.appState.messagesSent,
                      label: 'Messages',
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: _TodayMetric(
                      value: widget.appState.aiReflections,
                      label: 'AI reflections',
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              Text(
                widget.appState.hasAssistantActivityToday
                    ? 'Last activity ${_formatActivityTime(widget.appState.lastAssistantActivityAt!)} · stored privately on this device.'
                    : 'No assistant activity yet today. Your metrics will appear here after you begin navigating.',
              ),
            ],
          ),
        ),
      ),
      const SizedBox(height: 16),
      if (_loaded && _patterns.isNotEmpty)
        Card(
          color: MindRecipeTokens.primary.withAlpha(15),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.insights, color: MindRecipeTokens.primary),
                    const SizedBox(width: 8),
                    const Text(
                      'Patterns detected',
                      style: TextStyle(
                        fontWeight: FontWeight.w700,
                        fontSize: 18,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                ...(_patterns.map(
                  (p) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Row(
                      children: [
                        Icon(
                          p['type'] == 'activation_improving'
                              ? Icons.trending_up
                              : Icons.trending_down,
                          size: 18,
                          color: p['type'] == 'activation_improving'
                              ? MindRecipeTokens.success
                              : MindRecipeTokens.warning,
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            p['description']?.toString() ?? '',
                            style: const TextStyle(fontSize: 14),
                          ),
                        ),
                      ],
                    ),
                  ),
                )),
              ],
            ),
          ),
        ),
      const SizedBox(height: 16),
      const _WellnessBoundary(),
    ],
  );

  static String _formatActivityTime(DateTime time) {
    final local = time.toLocal();
    final hour = local.hour % 12 == 0 ? 12 : local.hour % 12;
    final minute = local.minute.toString().padLeft(2, '0');
    return '$hour:$minute ${local.hour >= 12 ? 'PM' : 'AM'}';
  }
}

class _TodayMetric extends StatelessWidget {
  const _TodayMetric({required this.value, required this.label});
  final int value;
  final String label;

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 14),
    decoration: BoxDecoration(
      color: Theme.of(context).colorScheme.primaryContainer
          .withValues(alpha: 0.44),
      borderRadius: BorderRadius.circular(18),
      border: Border.all(
        color: Theme.of(context).colorScheme.primary.withValues(alpha: 0.16),
      ),
    ),
    child: Column(
      children: [
        Text(
          '$value',
          style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w900),
        ),
        const SizedBox(height: 3),
        Text(
          label,
          textAlign: TextAlign.center,
          style: Theme.of(context).textTheme.labelSmall,
        ),
      ],
    ),
  );
}

class RecipePracticeScreen extends StatelessWidget {
  const RecipePracticeScreen({
    super.key,
    required this.selected,
    required this.onToggle,
  });
  final Set<String> selected;
  final ValueChanged<String> onToggle;
  @override
  Widget build(BuildContext context) => ListView(
    padding: const EdgeInsets.all(20),
    children: [
      const Text(
        'Build your wellness recipe',
        style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
      ),
      const Text(
        'Save practices that feel useful. You can later record when and how they helped.',
      ),
      const SizedBox(height: 16),
      ...[
        'Breathing reset',
        'Grounding',
        'Values reflection',
        'Boundary script',
        'Movement break',
        'Creative time',
      ].map(
        (tool) => Card(
          child: CheckboxListTile(
            value: selected.contains(tool),
            onChanged: (_) => onToggle(tool),
            title: Text(tool),
            subtitle: const Text('Mind Recipe practice'),
          ),
        ),
      ),
    ],
  );
}

class ProgressScreen extends StatefulWidget {
  const ProgressScreen({
    super.key,
    required this.checkIn,
    required this.tools,
    required this.appState,
  });
  final CheckInState checkIn;
  final Set<String> tools;
  final SecureAppState appState;
  @override
  State<ProgressScreen> createState() => _ProgressScreenState();
}

class _ProgressScreenState extends State<ProgressScreen> {
  Map<String, dynamic>? _curriculum;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final c = await widget.appState.loadCurriculumProgress();
    if (mounted)
      setState(() {
        _curriculum = c;
        _loading = false;
      });
  }

  @override
  Widget build(BuildContext context) {
    final completed =
        (_curriculum?['completed_lesson_ids'] as List?)?.length ?? 0;
    const total = 15;
    final pct = total == 0 ? 0.0 : completed / total;
    final streak = _streakDays();
    final insight = _insight(completed);
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        const Text(
          'Your progress',
          style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 4),
        Text(
          'Recipes, practices, and daily navigation — woven together',
          style: Theme.of(context).textTheme.bodyMedium,
        ),
        const SizedBox(height: 16),
        Card(
          color: Theme.of(context).colorScheme.primaryContainer
              .withValues(alpha: 0.5),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    SizedBox(
                      width: 56,
                      height: 56,
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          CircularProgressIndicator(value: pct, strokeWidth: 6),
                          Text(
                            '$completed',
                            style: const TextStyle(fontWeight: FontWeight.w800),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '$completed of $total recipes complete',
                            style: Theme.of(context).textTheme.titleMedium
                                ?.copyWith(fontWeight: FontWeight.w800),
                          ),
                          Text(
                            streak == 0
                                ? 'Start a streak — one lesson a day keeps the path warm'
                                : '$streak-day streak · keep it gentle',
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                LinearProgressIndicator(
                  value: pct,
                  minHeight: 6,
                  borderRadius: BorderRadius.circular(99),
                ),
                const SizedBox(height: 8),
                Text(insight, style: Theme.of(context).textTheme.bodySmall),
              ],
            ),
          ),
        ),
        Card(
          child: ListTile(
            leading: const Icon(Icons.insights_rounded),
            title: const Text('Today’s check-in meets your recipes'),
            subtitle: Text(
              widget.checkIn.emotions.isEmpty
                  ? 'No emotions selected yet — your next recipe will adapt once you check in.'
                  : '${widget.checkIn.emotions.join(', ')} · Activation ${widget.checkIn.activation}/10 · ${widget.checkIn.activation >= 7
                        ? 'Try Grounding (Module 2) today'
                        : widget.checkIn.activation <= 3
                        ? 'Try Vision & Values (Module 3) today'
                        : 'Try Mindfulness (Module 1) today'}',
            ),
          ),
        ),
        Card(
          child: ListTile(
            leading: const Icon(Icons.menu_book_rounded),
            title: Text('Recipes · $completed/$total'),
            subtitle: Text(_moduleBreakdown()),
          ),
        ),
        Card(
          child: ListTile(
            leading: const Icon(Icons.spa_rounded),
            title: Text('${widget.tools.length} saved practices'),
            subtitle: Text(
              widget.tools.isEmpty
                  ? 'Save a practice from Recipes or Navigator — then we’ll surface what helps most'
                  : 'We track which practices you rate most effective and surface them here',
            ),
          ),
        ),
        const Card(
          child: ListTile(
            leading: Icon(Icons.auto_awesome_rounded),
            title: Text('How this fits together'),
            subtitle: Text(
              'Daily navigation → Recipes teach the skill → you practice → Progress shows what steadies you. Small steps, noticed over days, build your recipe.',
            ),
          ),
        ),
        if (_loading)
          const Padding(
            padding: EdgeInsets.all(12),
            child: LinearProgressIndicator(),
          ),
      ],
    );
  }

  String _moduleBreakdown() {
    final ids =
        (_curriculum?['completed_lesson_ids'] as List?)
            ?.map((e) => e.toString())
            .toSet() ??
        {};
    int m1 = [1, 2, 3, 4, 5].where((n) => ids.contains('lesson-$n')).length;
    int m2 = [6, 7, 8, 9, 10].where((n) => ids.contains('lesson-$n')).length;
    int m3 = [
      11,
      12,
      13,
      14,
      15,
    ].where((n) => ids.contains('lesson-$n')).length;
    return 'Foundations $m1/5 · Patterns $m2/5 · Direction $m3/5';
  }

  int _streakDays() {
    // Simple: if updated_at is today and at least one lesson, streak 1; otherwise 0.
    // Real streak would need history, but this gives a gentle nudge.
    final raw = _curriculum?['updated_at']?.toString();
    if (raw == null) return 0;
    final d = DateTime.tryParse(raw);
    if (d == null) return 0;
    final now = DateTime.now().toUtc();
    final diff = now.difference(d).inHours;
    return diff < 36 ? 1 : 0;
  }

  String _insight(int completed) {
    if (completed == 0)
      return 'Start with Foundations — Notice What Is Present. One lesson a day is enough; consistency matters more than speed.';
    if (completed < 5)
      return 'Nice start in Foundations. Daily practice helps your nervous system learn what “steady” feels like.';
    if (completed < 10)
      return 'You’re building Patterns. Progress shows which practices you return to — that’s your personal recipe emerging.';
    if (completed < 15)
      return 'Direction ahead. Your Progress insights will suggest the next small, values-aligned step.';
    return 'All 15 complete — revisit any lesson. Progress now highlights your most effective practices.';
  }
}

class BookingScreen extends StatelessWidget {
  const BookingScreen({super.key});
  static const bookingUrl = String.fromEnvironment('BOOKING_URL');

  static const _healthApps = [
    (
      'MyChart',
      'Health records & visits',
      'com.epic.mychart',
      'https://apps.apple.com/us/app/mychart/id1040635943',
      'https://play.google.com/store/apps/details?id=com.epic.mychart',
    ),
    (
      'Down Dog',
      'Yoga & movement',
      'com.downdogapp',
      'https://apps.apple.com/us/app/down-dog-great-yoga-workouts/id1312878494',
      'https://play.google.com/store/apps/details?id=com.downdogapp',
    ),
    (
      'Insight Timer',
      'Meditation & sleep',
      'com.spotlightsix.zentimerlite2',
      'https://apps.apple.com/us/app/insight-timer-meditation/id337502354',
      'https://play.google.com/store/apps/details?id=com.spotlightsix.zentimerlite2',
    ),
    (
      'Calm',
      'Sleep & calm',
      'com.calm.android',
      'https://apps.apple.com/us/app/calm/id571800810',
      'https://play.google.com/store/apps/details?id=com.calm.android',
    ),
  ];

  Future<void> _openApp(BuildContext context, String name) async {
    final auto = MindRecipeMobileAutomation();
    // Try the native calendar/app surface first; the plugin falls back to
    // store links when the app is not installed.
    if (name == 'Calendar') {
      await auto.openCalendar();
      return;
    }
    final match = _healthApps.firstWhere((a) => a.$1 == name);
    final result = await auto.setReminder(
      title: 'Opened from Mind Recipe Booking',
      notes: '$name — continue in the app if installed.',
    );
    if (!result.success && mounted(context)) {
      final url = Platform.isIOS ? match.$4 : match.$5;
      await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
    }
  }

  static bool mounted(BuildContext context) => context.mounted;

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.all(20),
    child: ListView(
      children: [
        const Text(
          'Booking & levels of care',
          style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),
        const Text(
          'Open your device calendar, or continue in a health app you already use. This app does not decide what level of care you need.',
        ),
        const SizedBox(height: 20),
        FilledButton.icon(
          onPressed: () => _openApp(context, 'Calendar'),
          icon: const Icon(Icons.calendar_month_rounded),
          label: const Text('Open device calendar'),
        ),
        if (bookingUrl.isNotEmpty) ...[
          const SizedBox(height: 10),
          OutlinedButton.icon(
            onPressed: () => launchUrl(
              Uri.parse(bookingUrl),
              mode: LaunchMode.externalApplication,
            ),
            icon: const Icon(Icons.open_in_new_rounded),
            label: const Text('Open scheduling provider'),
          ),
        ],
        const SizedBox(height: 24),
        const Text(
          'CONTINUE IN A HEALTH APP',
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w800,
            letterSpacing: 1.1,
          ),
        ),
        const SizedBox(height: 4),
        const Text(
          'Pick up where it suits you — appointments, movement, or mind.',
          style: TextStyle(fontSize: 12.5),
        ),
        const SizedBox(height: 10),
        ..._healthApps.map(
          (app) => Card(
            margin: const EdgeInsets.only(bottom: 8),
            child: ListTile(
              leading: const Icon(Icons.health_and_safety_rounded),
              title: Text(
                app.$1,
                style: const TextStyle(fontWeight: FontWeight.w700),
              ),
              subtitle: Text(app.$2),
              trailing: const Icon(Icons.chevron_right_rounded),
              onTap: () => _openApp(context, app.$1),
            ),
          ),
        ),
        const SizedBox(height: 12),
        const Text(
          'Wellness support — not diagnosis or emergency care.',
          style: TextStyle(fontSize: 12),
        ),
      ],
    ),
  );
}

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({
    super.key,
    required this.onPractitioner,
    required this.appState,
    required this.onSignOut,
  });
  final VoidCallback onPractitioner;
  final SecureAppState appState;
  final VoidCallback onSignOut;

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  LocalInferenceSnapshot _privateModel = const LocalInferenceSnapshot(
    OnDeviceStatus.checking,
  );
  bool _modelActionInProgress = false;
  bool _privateModelSelectionTouched = false;
  Set<String> _downloadedPrivateModelIds = const {};
  OnDeviceModelChoice _selectedPrivateChoice =
      mindRecipePrivateModelChoices.last;
  late double _chimeraFxIntensity;
  Timer? _progressTimer;

  @override
  void initState() {
    super.initState();
    _chimeraFxIntensity = widget.appState.chimeraFxIntensity;
    _refreshPrivateModel();
    _progressTimer = Timer.periodic(const Duration(milliseconds: 500), (_) {
      if (!mounted) return;
      final current = OnDeviceInference().snapshot;
      if (_modelActionInProgress ||
          current.status == OnDeviceStatus.downloading ||
          current.status == OnDeviceStatus.verifying) {
        setState(() => _privateModel = current);
        return;
      }
      // While downloading/verifying, just repaint progress from the
      // singleton — calling refreshStatus would risk resetting `downloading`
      // → `notInstalled` while .partial is still growing (tab-switch bug).
      if (_privateModel.status == OnDeviceStatus.downloading ||
          _privateModel.status == OnDeviceStatus.verifying) {
        if (mounted) setState(() {});
        return;
      }
      if (_privateModel.status == OnDeviceStatus.notInstalled ||
          _privateModel.status == OnDeviceStatus.checking) {
        _refreshPrivateModel();
      }
    });
  }

  @override
  void dispose() {
    _progressTimer?.cancel();
    super.dispose();
  }

  Future<void> _refreshPrivateModel() async {
    final snapshot = await OnDeviceInference().refreshStatus();
    final downloaded = await OnDeviceInference().downloadedModelIds();
    if (mounted) {
      final active = OnDeviceInference().activeModel.id;
      setState(() {
        _privateModel = snapshot;
        _downloadedPrivateModelIds = downloaded;
        if (!_privateModelSelectionTouched || snapshot.isReady) {
          _selectedPrivateChoice = mindRecipePrivateModelChoices.firstWhere(
            (choice) => choice.manifest.id == active,
            orElse: () => _selectedPrivateChoice,
          );
        }
      });
    }
  }

  Future<void> _usePrivateModel(OnDeviceModelChoice choice) async {
    setState(() => _modelActionInProgress = true);
    try {
      await OnDeviceInference().activateModel(choice.manifest);
      _privateModelSelectionTouched = false;
      await _refreshPrivateModel();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('${choice.name} is now active.')),
        );
      }
    } catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Could not activate ${choice.name}: $error')),
        );
      }
    } finally {
      if (mounted) setState(() => _modelActionInProgress = false);
    }
  }

  Future<void> _removePrivateModel(OnDeviceModelChoice choice) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Remove ${choice.name}?'),
        content: const Text(
          'This deletes the downloaded model from this device. You can download it again later.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Remove'),
          ),
        ],
      ),
    );
    if (confirmed != true || !mounted) return;
    setState(() => _modelActionInProgress = true);
    try {
      await OnDeviceInference().removeDownloadedModel(choice.manifest);
      _privateModelSelectionTouched = false;
      await _refreshPrivateModel();
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('${choice.name} was removed.')));
      }
    } catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Could not remove ${choice.name}: $error')),
        );
      }
    } finally {
      if (mounted) setState(() => _modelActionInProgress = false);
    }
  }

  Future<void> _installPrivateModel() async {
    final selectedName = _selectedPrivateChoice.name;
    setState(() => _modelActionInProgress = true);
    var installed = false;
    try {
      await OnDeviceInference().installModel(
        model: _selectedPrivateChoice.manifest,
      );
      installed = true;
      _privateModelSelectionTouched = false;
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('$selectedName is ready for private guidance.'),
          ),
        );
      }
    } catch (_) {
      // Preserve the safe failure detail from OnDeviceInference below.
      if (mounted) {
        setState(() => _privateModel = OnDeviceInference().snapshot);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              _privateModel.detail ?? 'The private model could not be prepared. Try again from Settings.',
            ),
          ),
        );
      }
    } finally {
      if (installed) await _refreshPrivateModel();
      if (mounted) setState(() => _modelActionInProgress = false);
    }
  }

  Future<void> configureAi() async {
    final controller = TextEditingController(
      text: widget.appState.openRouterKey,
    );
    final value = await showDialog<String>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Connect Navigator'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Your OpenRouter key is stored in this device’s secure storage and sent only for the AI request you approve.',
            ),
            const SizedBox(height: 14),
            TextField(
              controller: controller,
              obscureText: true,
              autocorrect: false,
              decoration: const InputDecoration(
                labelText: 'OpenRouter API key',
                border: OutlineInputBorder(),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, ''),
            child: const Text('Remove key'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(context, controller.text),
            child: const Text('Save securely'),
          ),
        ],
      ),
    );
    controller.dispose();
    if (value != null) await widget.appState.saveProviderKey(value);
  }

  @override
  Widget build(BuildContext context) => ListView(
    padding: const EdgeInsets.all(20),
    children: [
      const Text(
        'Settings',
        style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold),
      ),
      Card(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const ListTile(
              leading: Icon(Icons.auto_awesome_rounded),
              title: Text('Visual appearance'),
              subtitle: Text(
                'Choose the app theme and control the animated visual atmosphere.',
              ),
            ),
            const Divider(height: 1),
            RadioListTile<String>(
              title: const Text('Follow device theme'),
              value: 'system',
              groupValue: widget.appState.appearanceMode,
              onChanged: (value) => widget.appState.setAppearanceMode(value!),
            ),
            RadioListTile<String>(
              title: const Text('Light'),
              value: 'light',
              groupValue: widget.appState.appearanceMode,
              onChanged: (value) => widget.appState.setAppearanceMode(value!),
            ),
            RadioListTile<String>(
              title: const Text('Dark'),
              value: 'dark',
              groupValue: widget.appState.appearanceMode,
              onChanged: (value) => widget.appState.setAppearanceMode(value!),
            ),
            const Divider(height: 1),
            const Padding(
              padding: EdgeInsets.fromLTRB(16, 14, 16, 6),
              child: Text(
                'COLOR THEME',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 1.1,
                ),
              ),
            ),
            for (final theme in const [
              (
                id: 'chimera-native',
                name: 'Chimera Native',
                description: 'Teal-green, neon green, and ultraviolet',
                colors: [Color(0xff00e5cc), Color(0xff7c3aed)],
              ),
              (
                id: 'cyberpunk-neon',
                name: 'Cyberpunk Neon',
                description: 'Hot pink, electric cyan, and toxic green',
                colors: [Color(0xffff0066), Color(0xff00ffff)],
              ),
              (
                id: 'organic-bioluminescent',
                name: 'Organic Bioluminescent',
                description: 'Bioluminescent blue, phosphor green, and amber',
                colors: [Color(0xff00e5ff), Color(0xff76ff03)],
              ),
              (
                id: 'quantum-void',
                name: 'Quantum Void',
                description: 'Ultraviolet, quantum blue, and photon orange',
                colors: [Color(0xff7c4dff), Color(0xff448aff)],
              ),
              (
                id: 'holographic-matrix',
                name: 'Holographic Matrix',
                description: 'Matrix green, hologram cyan, and magenta',
                colors: [Color(0xff00ff41), Color(0xff00bcd4)],
              ),
              (
                id: 'oceanic-cyan',
                name: 'Oceanic Cyan',
                description: 'Electric cyan, arctic blue, and glass white',
                colors: [Color(0xff00f5ff), Color(0xff00a8ff)],
              ),
              (
                id: 'solar-ember',
                name: 'Solar Ember',
                description: 'Hot orange, solar gold, and deep carbon red',
                colors: [Color(0xffff4f0d), Color(0xffffc214)],
              ),
              (
                id: 'deep-ocean',
                name: 'Deep Ocean',
                description: 'Abyss blue, tidal cyan, and sea-glass green',
                colors: [Color(0xff00b3d9), Color(0xff034080)],
              ),
              (
                id: 'aurora-spectrum',
                name: 'Aurora Spectrum',
                description: 'Aurora mint, spectral violet, and plasma pink',
                colors: [Color(0xff26ffa6), Color(0xff9940ff)],
              ),
              (
                id: 'crimson-pulse',
                name: 'Crimson Pulse',
                description: 'Signal red, deep magenta, and ignition amber',
                colors: [Color(0xffff0d1f), Color(0xffbf0061)],
              ),
              (
                id: 'monochrome-glass',
                name: 'Monochrome Glass',
                description: 'Frost white, brushed steel, and cold shadow',
                colors: [Color(0xffe6f5ff), Color(0xff7a8c9e)],
              ),
              (
                id: 'ultraviolet-bloom',
                name: 'Ultraviolet Bloom',
                description: 'Ultraviolet, ion blue, and neon orchid',
                colors: [Color(0xff9e1aff), Color(0xff33ccff)],
              ),
            ])
              RadioListTile<String>(
                title: Text(theme.name),
                subtitle: Text(theme.description),
                value: theme.id,
                groupValue: widget.appState.chimeraTheme,
                onChanged: (value) => widget.appState.setChimeraTheme(value!),
                secondary: SizedBox(
                  width: 42,
                  child: Stack(
                    children: [
                      CircleAvatar(
                        radius: 13,
                        backgroundColor: theme.colors.first,
                      ),
                      Positioned(
                        left: 16,
                        top: 8,
                        child: CircleAvatar(
                          radius: 13,
                          backgroundColor: theme.colors.last,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            const Divider(height: 1),
            const Padding(
              padding: EdgeInsets.fromLTRB(16, 14, 16, 6),
              child: Text(
                'LIVING VFX THEME',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 1.1,
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
              child: Text(
                'Choose the live WebGL visual system separately from the app color palette. It changes the background and Pulse familiar immediately.',
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ),
            for (final theme in const [
              (
                id: 'mind-recipe-orbit',
                name: 'Mind Recipe Orbit',
                description:
                    'Compass teal, restorative violet, and warm focus gold',
                colors: [Color(0xff00d9c0), Color(0xff8b5cf6)],
              ),
              (
                id: 'chimera-native',
                name: 'Core',
                description: 'Living teal, green, and ultraviolet matter',
                colors: [Color(0xff00e5cc), Color(0xff7c3aed)],
              ),
              (
                id: 'cyberpunk-neon',
                name: 'Neon Circuit',
                description: 'Hot pink, electric cyan, and toxic green',
                colors: [Color(0xffff0066), Color(0xff00ffff)],
              ),
              (
                id: 'organic-bioluminescent',
                name: 'Bioluminescent',
                description: 'Deep blue, phosphor green, and amber',
                colors: [Color(0xff00e5ff), Color(0xff76ff03)],
              ),
              (
                id: 'quantum-void',
                name: 'Quantum Void',
                description: 'Ultraviolet, quantum blue, and photon orange',
                colors: [Color(0xff7c4dff), Color(0xff448aff)],
              ),
              (
                id: 'holographic-matrix',
                name: 'Holographic Matrix',
                description: 'Matrix green, hologram cyan, and magenta',
                colors: [Color(0xff00ff41), Color(0xff00bcd4)],
              ),
              (
                id: 'midnight-signal',
                name: 'Midnight Signal',
                description: 'Electric blue, signal mint, and midnight glass',
                colors: [Color(0xff147bff), Color(0xff00edac)],
              ),
              (
                id: 'neon-ronin',
                name: 'Neon Ronin',
                description: 'Electric blue, crimson, and violet haze',
                colors: [Color(0xffee2c74), Color(0xff7038ff)],
              ),
              (
                id: 'abyssal-current',
                name: 'Abyssal Current',
                description: 'Abyss blue, cyan current, and sea glass',
                colors: [Color(0xff0077ff), Color(0xff00e3d2)],
              ),
              (
                id: 'solar-flare',
                name: 'Solar Flare',
                description: 'Solar gold, ember orange, and charcoal',
                colors: [Color(0xffff9d00), Color(0xffffcf5c)],
              ),
              (
                id: 'void-walker',
                name: 'Void Walker',
                description: 'Dark indigo, ultraviolet, and soft silver',
                colors: [Color(0xff12072f), Color(0xff8d5bff)],
              ),
              (
                id: 'crystal-matrix',
                name: 'Crystal Matrix',
                description: 'Ice crystal, cyan light, and slate',
                colors: [Color(0xff75f7ff), Color(0xffe9feff)],
              ),
              (
                id: 'aurora',
                name: 'Aurora',
                description: 'Aurora mint, spectral violet, and rose plasma',
                colors: [Color(0xff23edab), Color(0xff9a56ff)],
              ),
              (
                id: 'obsidian-forge',
                name: 'Obsidian Forge',
                description: 'Forged copper, ember, and obsidian',
                colors: [Color(0xffef6736), Color(0xff180e10)],
              ),
              (
                id: 'orchid-vapor',
                name: 'Orchid Vapor',
                description: 'Orchid, vapor blue, and soft lavender',
                colors: [Color(0xffdb54e8), Color(0xff7ee9ff)],
              ),
              (
                id: 'tidal-glass',
                name: 'Tidal Glass',
                description: 'Tidal cyan, seafoam, and glass white',
                colors: [Color(0xff00c6dc), Color(0xffe3ffff)],
              ),
            ])
              RadioListTile<String>(
                title: Text(theme.name),
                subtitle: Text(theme.description),
                value: theme.id,
                groupValue: widget.appState.chimeraVfxTheme,
                onChanged: (value) =>
                    widget.appState.setChimeraVfxTheme(value!),
                secondary: SizedBox(
                  width: 42,
                  child: Stack(
                    children: [
                      CircleAvatar(
                        radius: 13,
                        backgroundColor: theme.colors.first,
                      ),
                      Positioned(
                        left: 16,
                        top: 8,
                        child: CircleAvatar(
                          radius: 13,
                          backgroundColor: theme.colors.last,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            const Divider(height: 1),
            SwitchListTile(
              title: const Text('Living background motion'),
              subtitle: const Text(
                'Show animated fields and reactive background effects.',
              ),
              value: widget.appState.chimeraFxEnabled,
              onChanged: widget.appState.setChimeraFxEnabled,
            ),
            if (widget.appState.chimeraFxEnabled)
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 4, 16, 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'FX intensity · ${(_chimeraFxIntensity * 100).round()}%',
                    ),
                    Slider(
                      value: _chimeraFxIntensity,
                      min: 0.2,
                      max: 1,
                      divisions: 8,
                      label: '${(_chimeraFxIntensity * 100).round()}%',
                      onChanged: (value) =>
                          setState(() => _chimeraFxIntensity = value),
                      onChangeEnd: widget.appState.setChimeraFxIntensity,
                    ),
                    Wrap(
                      spacing: 8,
                      children: [
                        for (final preset in const [
                          ('Calm', 0.3),
                          ('Balanced', 0.7),
                          ('Vivid', 1.0),
                        ])
                          ActionChip(
                            label: Text(preset.$1),
                            onPressed: () {
                              setState(() => _chimeraFxIntensity = preset.$2);
                              widget.appState.setChimeraFxIntensity(preset.$2);
                            },
                          ),
                      ],
                    ),
                  ],
                ),
              ),
            if (widget.appState.chimeraFxEnabled) const Divider(height: 1),
            if (widget.appState.chimeraFxEnabled)
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 14, 16, 6),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'VFX COMPOSITION',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 1.1,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Choose the source component composition for the selected visual theme.',
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                    const SizedBox(height: 10),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: [
                        for (final v in const [
                          ('full', 'Full', Icons.auto_awesome_rounded),
                          ('lite', 'Lite', Icons.blur_on_rounded),
                          ('trading', 'Trading', Icons.show_chart_rounded),
                          (
                            'cinematic',
                            'Cinematic',
                            Icons.movie_filter_rounded,
                          ),
                          ('holographic', 'Holographic', Icons.hub_rounded),
                          ('minimal', 'Minimal', Icons.nights_stay_rounded),
                        ])
                          ChoiceChip(
                            label: Text(v.$2),
                            avatar: Icon(v.$3, size: 18),
                            selected: widget.appState.chimeraFxVariant == v.$1,
                            onSelected: (_) => setState(() {
                              widget.appState.setChimeraFxVariant(v.$1);
                            }),
                          ),
                      ],
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
      Card(
        child: ListTile(
          leading: Icon(
            widget.appState.aiAvailable
                ? Icons.auto_awesome_rounded
                : Icons.cloud_off_outlined,
          ),
          title: Text(
            widget.appState.aiAvailable
                ? 'Navigator connected'
                : 'Navigator not connected',
          ),
          subtitle: Text(
            widget.appState.managedAiAvailable
                ? 'Managed AI service active. Cloud use still requires consent in each check-in.'
                : widget.appState.hasProviderKey
                ? 'OpenRouter key secured on this device. Cloud use still requires consent in each check-in.'
                : 'The structured guide works without AI. Connect your own provider key for generative reflection.',
          ),
          trailing: TextButton(
            onPressed: configureAi,
            child: Text(widget.appState.hasProviderKey ? 'Manage' : 'Connect'),
          ),
        ),
      ),
      Card(
        child: Column(
          children: [
            ListTile(
              leading: Icon(
                _privateModel.isReady
                    ? Icons.verified_user_rounded
                    : Icons.phone_android_rounded,
              ),
              title: const Text('Private on-device AI'),
              subtitle: Text(
                _privateModel.isReady
                    ? 'Ready for private guidance. This route stays on your device.'
                    : _privateModel.detail ?? 'Choose a verified model below. Nothing downloads until you choose Install.',
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Builder(
                    builder: (context) {
                      final choice = mindRecipePrivateModelChoices.first;
                      final isActive =
                          choice.manifest.id ==
                              OnDeviceInference().activeModel.id &&
                          _privateModel.isReady;
                      final isDownloaded = _downloadedPrivateModelIds.contains(
                        choice.manifest.id,
                      );
                      return Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          border: Border.all(
                            color: Theme.of(context).colorScheme.primary,
                            width: 1.2,
                          ),
                          borderRadius: BorderRadius.circular(14),
                          color: Theme.of(context).colorScheme.primaryContainer
                              .withOpacity(0.18),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                const Icon(Icons.shield_rounded, size: 20),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Text(
                                    choice.name,
                                    maxLines: 1,
                                    softWrap: false,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(
                                      fontWeight: FontWeight.w800,
                                      fontSize: 16,
                                    ),
                                  ),
                                ),
                                if (isActive)
                                  const Chip(
                                    avatar: Icon(Icons.check_circle, size: 16),
                                    label: Text('Active'),
                                  ),
                                if (isActive) const SizedBox(width: 8),
                                const Chip(label: Text('On-device')),
                              ],
                            ),
                            const SizedBox(height: 6),
                            Text(
                              choice.quality,
                              style: Theme.of(context).textTheme.bodyMedium,
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '${choice.bestFor}\n${choice.memoryNote}',
                              style: Theme.of(context).textTheme.bodySmall,
                            ),
                            const SizedBox(height: 12),
                            SizedBox(
                              width: double.infinity,
                              child: isActive
                                  ? OutlinedButton.icon(
                                      onPressed: _modelActionInProgress
                                          ? null
                                          : () => _removePrivateModel(choice),
                                      icon: const Icon(
                                        Icons.delete_outline_rounded,
                                        size: 18,
                                      ),
                                      label: const Text('Remove Private model'),
                                    )
                                  : isDownloaded
                                  ? FilledButton.icon(
                                      onPressed: _modelActionInProgress
                                          ? null
                                          : () => _usePrivateModel(choice),
                                      icon: const Icon(
                                        Icons.check_rounded,
                                        size: 18,
                                      ),
                                      label: const Text('Use Private model'),
                                    )
                                  : FilledButton.icon(
                                      onPressed: _modelActionInProgress
                                          ? null
                                          : _installPrivateModel,
                                      icon: const Icon(
                                        Icons.download_rounded,
                                        size: 18,
                                      ),
                                      label: const Text(
                                        'Download Private model',
                                      ),
                                    ),
                            ),
                            if (isDownloaded && !isActive)
                              Padding(
                                padding: const EdgeInsets.only(top: 8),
                                child: TextButton.icon(
                                  onPressed: _modelActionInProgress
                                      ? null
                                      : () => _removePrivateModel(choice),
                                  icon: const Icon(
                                    Icons.delete_outline_rounded,
                                    size: 16,
                                  ),
                                  label: const Text('Remove download'),
                                ),
                              ),
                          ],
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'One private model — 1.2 GB, stays on this device, verified before it can run. Download once, use everywhere.',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
            ),
            if (_modelActionInProgress ||
                _privateModel.status == OnDeviceStatus.downloading ||
                _privateModel.status == OnDeviceStatus.verifying)
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    LinearProgressIndicator(
                      value: _privateModel.status == OnDeviceStatus.downloading
                          ? OnDeviceInference().downloadProgress
                          : null,
                    ),
                    const SizedBox(height: 7),
                    Text(
                      _privateModel.status == OnDeviceStatus.downloading
                          ? '${(OnDeviceInference().downloadProgress * 100).toStringAsFixed(0)}% · ${OnDeviceInference().downloadedBytes ~/ (1024 * 1024)} MB downloaded${OnDeviceInference().estimatedDownloadRemaining == null ? '' : ' · about ${_formatModelTime(OnDeviceInference().estimatedDownloadRemaining!)} left'}'
                          : 'Checking the model’s integrity, then preparing private AI…',
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                  ],
                ),
              ),
            const Divider(height: 1),
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
              child: Text(
                _privateModel.isReady
                    ? 'Private model ready — stays on this device.'
                    : _privateModel.status == OnDeviceStatus.downloading ||
                          _privateModel.status == OnDeviceStatus.verifying
                    ? 'Preparing private model — you can keep using the app.'
                    : 'Tap Download Private model above to enable on-device guidance.',
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ),
          ],
        ),
      ),
      Card(
        child: Column(
          children: [
            SwitchListTile(
              title: const Text('Cloud AI'),
              subtitle: const Text(
                'Allow requests to your selected AI provider. Journal entries are never included.',
              ),
              value: widget.appState.cloudAiEnabled,
              onChanged: widget.appState.aiAvailable
                  ? widget.appState.setCloudAiEnabled
                  : null,
            ),
            const Divider(height: 1),
            SwitchListTile(
              title: const Text('Use public research sources'),
              subtitle: const Text(
                'Allow public-source research only for the request you send.',
              ),
              value: widget.appState.publicResearchEnabled,
              onChanged: widget.appState.aiAvailable
                  ? widget.appState.setPublicResearchEnabled
                  : null,
            ),
          ],
        ),
      ),
      const Card(
        child: ListTile(
          title: Text('Practitioner sharing'),
          subtitle: Text(
            'Future consent controls grant selected data for a purpose and expiry. Journals and AI chats stay private unless separately shared.',
          ),
        ),
      ),
      const Card(
        child: ListTile(
          leading: Icon(Icons.menu_book_outlined),
          title: Text('Recipes and saved practices'),
          subtitle: Text('Manage practices from the Recipes tab.'),
        ),
      ),
      Card(
        child: ListTile(
          leading: const Icon(Icons.notifications_outlined),
          title: const Text('Notification scheduler'),
          subtitle: const Text(
            'Gentle reminders with quiet hours, snooze, and pause controls.',
          ),
          trailing: const Icon(Icons.chevron_right),
          onTap: () => Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => Scaffold(
                appBar: AppBar(title: const Text('Notifications')),
                body: const NotificationScheduler(),
              ),
            ),
          ),
        ),
      ),
      Card(
        child: ListTile(
          leading: const Icon(Icons.medical_services),
          title: const Text('Practitioner sharing'),
          subtitle: const Text(
            'Manage consent grants, audit trail, and data sharing with your practitioner.',
          ),
          trailing: const Icon(Icons.chevron_right),
          onTap: () => Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => Scaffold(
                appBar: AppBar(title: const Text('Practitioner Sharing')),
                body: PractitionerSharing(appState: widget.appState),
              ),
            ),
          ),
        ),
      ),
      const Card(
        child: ListTile(
          title: Text('Teen accounts'),
          subtitle: Text(
            'Availability will be jurisdiction-gated until youth consent policy is approved.',
          ),
        ),
      ),
      OutlinedButton(
        onPressed: widget.onPractitioner,
        child: const Text('View practitioner prototype'),
      ),
      TextButton.icon(
        onPressed: widget.onSignOut,
        icon: const Icon(Icons.logout),
        label: const Text('Sign out'),
      ),
      const SizedBox(height: 8),
      Center(
        child: FutureBuilder<PackageInfo>(
          future: PackageInfo.fromPlatform(),
          builder: (context, snap) => Text(
            'Mind Recipe ${snap.data?.version ?? '1.0.0'} (${snap.data?.buildNumber ?? '—'}) · by Context Field',
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: Theme.of(context).textTheme.bodySmall?.color
                  ?.withValues(alpha: 0.45),
            ),
          ),
        ),
      ),
    ],
  );
}

String _formatModelTime(Duration value) {
  if (value.inHours > 0) return '${value.inHours}h ${(value.inMinutes % 60)}m';
  if (value.inMinutes > 0) return '${value.inMinutes} min';
  return '${value.inSeconds.clamp(1, 59)} sec';
}

class PractitionerHome extends StatelessWidget {
  const PractitionerHome({super.key, required this.onExit});
  final VoidCallback onExit;
  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(
      title: const Text('Practitioner workspace'),
      leading: BackButton(onPressed: onExit),
    ),
    body: ListView(
      padding: const EdgeInsets.all(20),
      children: const [
        Text(
          'Caseload',
          style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold),
        ),
        Text(
          'This view only presents categories that a member has explicitly shared. It does not include raw journals or AI conversations by default.',
        ),
        SizedBox(height: 16),
        Card(
          child: ListTile(
            title: Text('Demo member'),
            subtitle: Text('Consent: check-ins and trends · expires in 7 days'),
            trailing: Icon(Icons.chevron_right),
          ),
        ),
        Card(
          child: ListTile(
            title: Text('Adherence & trends'),
            subtitle: Text(
              'No clinical scores or alerts are generated in this prototype.',
            ),
          ),
        ),
        Card(
          child: ListTile(
            title: Text('Audit trail'),
            subtitle: Text(
              'Sensitive reads, exports, consent, and AI processing are auditable in the backend.',
            ),
          ),
        ),
      ],
    ),
  );
}

class _WellnessBoundary extends StatelessWidget {
  const _WellnessBoundary();
  @override
  Widget build(BuildContext context) => const Text(
    'Mind Recipe supports wellness and self-reflection. It is not therapy, medical care, diagnosis, or emergency response.',
    style: TextStyle(fontSize: 12, color: Colors.black54),
  );
}
