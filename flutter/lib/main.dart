import 'dart:async';

import 'package:flutter/material.dart';
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
import 'recipes_screen.dart';
import 'voice_interface.dart';

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
      'ocean' => (
        const Color(0xff006d91),
        const Color(0xff0088a8),
        const Color(0xff315da8),
      ),
      'aurora' => (
        const Color(0xff6750a4),
        const Color(0xff008f83),
        const Color(0xffa13b86),
      ),
      'ember' => (
        const Color(0xffa34213),
        const Color(0xffc26a00),
        const Color(0xff8b3a62),
      ),
      'twilight' => (
        const Color(0xff4648a3),
        const Color(0xff7651a8),
        const Color(0xff007c91),
      ),
      _ => (
        const Color(0xff007d71),
        MindRecipeFxPalette.secondary,
        const Color(0xff007a4d),
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
      home: !appState.loaded || _initializing
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
  bool useStructuredNav = false;
  final checkIn = CheckInState();
  final tools = <String>{};
  final chatMessages = <ChatMessage>[];
  final labels = const [
    'Navigator',
    'Recipes',
    'Progress',
    'Booking',
    'Settings',
  ];
  final icons = const [
    Icons.navigation,
    Icons.menu_book,
    Icons.insights,
    Icons.calendar_month,
    Icons.settings,
  ];
  late final PageController pageController;
  late final ScrollController railController;
  Timer? navigatorReadinessTimer;
  Timer? _voiceBubbleTimer;
  bool _voiceIsSpeaking = false;
  bool _voiceIsListening = false;

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
      if (speaking != _voiceIsSpeaking || listening != _voiceIsListening) {
        if (mounted) setState(() {
          _voiceIsSpeaking = speaking;
          _voiceIsListening = listening;
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

  void _onRecipeAskNavigator(String prompt, String response) {
    setState(() {
      chatMessages.add(ChatMessage(role: ChatRole.member, text: prompt));
      chatMessages.add(ChatMessage(role: ChatRole.assistant, text: response, localGenerated: true));
    });
    goToPage(0);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Added to Navigator — continue the conversation there')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final screens = [
      _KeepAlivePage(
        child: useStructuredNav
            ? DailyNavigation(
                onComplete: () {
                  widget.appState.recordAssistantMessage(startsSession: true);
                  widget.appState.recordAiReflection();
                  setState(() {});
                },
              )
            : NavigatorChatExperience(
                state: checkIn,
                onChanged: () => setState(() {}),
                api: widget.api,
                appState: widget.appState,
                messages: chatMessages,
              ),
      ),
      _KeepAlivePage(child: RecipesScreen(api: widget.api, appState: widget.appState, onAskNavigator: _onRecipeAskNavigator)),
      _KeepAlivePage(child: ProgressScreen(checkIn: checkIn, tools: tools, appState: widget.appState)),
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
              Tooltip(
                message: useStructuredNav ? 'Navigator: structured steps' : 'Navigator: free chat',
                child: SegmentedButton<bool>(
                  segments: const [
                    ButtonSegment(value: false, label: Text('Chat'), icon: Icon(Icons.chat_bubble_rounded, size: 18)),
                    ButtonSegment(value: true, label: Text('Steps'), icon: Icon(Icons.view_list_rounded, size: 18)),
                  ],
                  selected: {useStructuredNav},
                  onSelectionChanged: (v) => setState(() => useStructuredNav = v.first),
                  style: ButtonStyle(visualDensity: VisualDensity.compact),
                  showSelectedIcon: false,
                ),
              ),
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
                          child: Opacity(
                            opacity: widget.appState.chimeraFxIntensity,
                            child: MindRecipeGpuField(
                              progress: progress,
                              variant: widget.appState.chimeraFxVariant,
                            ),
                          ),
                        ),
                      if (widget.appState.chimeraFxEnabled)
                        Positioned.fill(
                          child: Opacity(
                            opacity: widget.appState.chimeraFxIntensity,
                            child: MindRecipeFxBackdrop(
                              progress: progress,
                              variant: widget.appState.chimeraFxVariant,
                            ),
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
                      if ((_voiceIsSpeaking || _voiceIsListening) && index != 0)
                        Positioned(
                          left: 12,
                          right: 12,
                          bottom: 12,
                          child: Material(
                            elevation: 8,
                            borderRadius: BorderRadius.circular(18),
                            color: Theme.of(context).colorScheme.primaryContainer.withValues(alpha: 0.96),
                            child: InkWell(
                              borderRadius: BorderRadius.circular(18),
                              onTap: () => goToPage(0),
                              child: Padding(
                                padding: const EdgeInsets.fromLTRB(14, 10, 10, 10),
                                child: Row(
                                  children: [
                                    SizedBox(
                                      width: 22,
                                      height: 22,
                                      child: _voiceIsSpeaking
                                          ? const CircularProgressIndicator(strokeWidth: 2)
                                          : const Icon(Icons.mic_rounded, size: 18),
                                    ),
                                    const SizedBox(width: 10),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          Text(
                                            _voiceIsSpeaking ? 'Navigator is speaking…' : 'Navigator is listening…',
                                            style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13),
                                          ),
                                          const Text(
                                            'Tap to return to chat — audio continues in background',
                                            style: TextStyle(fontSize: 11),
                                          ),
                                        ],
                                      ),
                                    ),
                                    IconButton(
                                      icon: const Icon(Icons.close_rounded, size: 18),
                                      tooltip: 'Stop',
                                      onPressed: () async {
                                        await VoiceInterface().stopSpeaking();
                                        await VoiceInterface().stopListening();
                                      },
                                    ),
                                    const Icon(Icons.chevron_right_rounded, size: 18),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          bottomNavigationBar: MindRecipePageRail(
            labels: labels,
            icons: icons,
            selectedIndex: index,
            progress: progress,
            scrollController: railController,
            onSelected: goToPage,
          ),
        );
      },
    );
  }
}

class _KeepAlivePage extends StatefulWidget {
  const _KeepAlivePage({required this.child});
  final Widget child;
  @override
  State<_KeepAlivePage> createState() => _KeepAlivePageState();
}

class _KeepAlivePageState extends State<_KeepAlivePage> with AutomaticKeepAliveClientMixin {
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
        setState(() => _snap = cur);
      } else if (cur.status == OnDeviceStatus.downloading ||
          cur.status == OnDeviceStatus.verifying) {
        // Still need to tick for progress bar animation
        setState(() => _snap = cur);
      } else if (cur.status == OnDeviceStatus.notInstalled ||
          cur.status == OnDeviceStatus.checking) {
        // Keep polling for auto-start (refreshStatus is safe now — it won't
        // clobber downloading) so banner appears as soon as download begins
        setState(() => _snap = cur);
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
    if (!isDownloading && !isVerifying && !isError) return const SizedBox.shrink();
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
                    style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 12.5),
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
  const ProgressScreen({super.key, required this.checkIn, required this.tools, required this.appState});
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
    if (mounted) setState(() { _curriculum = c; _loading = false; });
  }

  @override
  Widget build(BuildContext context) {
    final completed = (_curriculum?['completed_lesson_ids'] as List?)?.length ?? 0;
    const total = 15;
    final pct = total == 0 ? 0.0 : completed / total;
    final streak = _streakDays();
    final insight = _insight(completed);
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        const Text('Your progress', style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold)),
        const SizedBox(height: 4),
        Text('Recipes, practices, and daily navigation — woven together', style: Theme.of(context).textTheme.bodyMedium),
        const SizedBox(height: 16),
        Card(
          color: Theme.of(context).colorScheme.primaryContainer.withValues(alpha: 0.5),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(children: [
                SizedBox(width: 56, height: 56, child: Stack(alignment: Alignment.center, children: [
                  CircularProgressIndicator(value: pct, strokeWidth: 6),
                  Text('$completed', style: const TextStyle(fontWeight: FontWeight.w800)),
                ])),
                const SizedBox(width: 12),
                Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text('$completed of $total recipes complete', style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800)),
                  Text(streak == 0 ? 'Start a streak — one lesson a day keeps the path warm' : '$streak-day streak · keep it gentle', style: Theme.of(context).textTheme.bodySmall),
                ])),
              ]),
              const SizedBox(height: 12),
              LinearProgressIndicator(value: pct, minHeight: 6, borderRadius: BorderRadius.circular(99)),
              const SizedBox(height: 8),
              Text(insight, style: Theme.of(context).textTheme.bodySmall),
            ]),
          ),
        ),
        Card(
          child: ListTile(
            leading: const Icon(Icons.insights_rounded),
            title: const Text('Today’s check-in meets your recipes'),
            subtitle: Text(
              widget.checkIn.emotions.isEmpty
                  ? 'No emotions selected yet — your next recipe will adapt once you check in.'
                  : '${widget.checkIn.emotions.join(', ')} · Activation ${widget.checkIn.activation}/10 · ${widget.checkIn.activation >= 7 ? 'Try Grounding (Module 2) today' : widget.checkIn.activation <= 3 ? 'Try Vision & Values (Module 3) today' : 'Try Mindfulness (Module 1) today'}',
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
            subtitle: Text(widget.tools.isEmpty ? 'Save a practice from Recipes or Navigator — then we’ll surface what helps most' : 'We track which practices you rate most effective and surface them here'),
          ),
        ),
        const Card(
          child: ListTile(
            leading: Icon(Icons.auto_awesome_rounded),
            title: Text('How this fits together'),
            subtitle: Text('Daily navigation → Recipes teach the skill → you practice → Progress shows what steadies you. Small steps, noticed over days, build your recipe.'),
          ),
        ),
        if (_loading) const Padding(padding: EdgeInsets.all(12), child: LinearProgressIndicator()),
      ],
    );
  }

  String _moduleBreakdown() {
    final ids = (_curriculum?['completed_lesson_ids'] as List?)?.map((e) => e.toString()).toSet() ?? {};
    int m1 = [1,2,3,4,5].where((n) => ids.contains('lesson-$n')).length;
    int m2 = [6,7,8,9,10].where((n) => ids.contains('lesson-$n')).length;
    int m3 = [11,12,13,14,15].where((n) => ids.contains('lesson-$n')).length;
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
    if (completed == 0) return 'Start with Foundations — Notice What Is Present. One lesson a day is enough; consistency matters more than speed.';
    if (completed < 5) return 'Nice start in Foundations. Daily practice helps your nervous system learn what “steady” feels like.';
    if (completed < 10) return 'You’re building Patterns. Progress shows which practices you return to — that’s your personal recipe emerging.';
    if (completed < 15) return 'Direction ahead. Your Progress insights will suggest the next small, values-aligned step.';
    return 'All 15 complete — revisit any lesson. Progress now highlights your most effective practices.';
  }
}

class BookingScreen extends StatelessWidget {
  const BookingScreen({super.key});
  static const bookingUrl = String.fromEnvironment('BOOKING_URL');
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.all(20),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Booking & levels of care',
          style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),
        const Text(
          'Booking opens your scheduling provider in a secure external browser. This app does not decide what level of care you need.',
        ),
        const SizedBox(height: 20),
        FilledButton.icon(
          onPressed: () async {
            if (bookingUrl.isEmpty) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Booking is not configured yet.')),
              );
              return;
            }
            final launched = await launchUrl(
              Uri.parse(bookingUrl),
              mode: LaunchMode.externalApplication,
            );
            if (!launched && context.mounted) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Unable to open the booking link.'),
                ),
              );
            }
          },
          icon: const Icon(Icons.open_in_new),
          label: const Text('Open booking calendar'),
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
              title: Text('Chimera FX appearance'),
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
                id: 'verdant',
                name: 'Verdant Signal',
                description: 'Signature teal, green, and violet',
                colors: [Color(0xff007d71), Color(0xff7c3aed)],
              ),
              (
                id: 'ocean',
                name: 'Deep Ocean',
                description: 'Cool blue, cyan, and indigo',
                colors: [Color(0xff006d91), Color(0xff315da8)],
              ),
              (
                id: 'aurora',
                name: 'Aurora',
                description: 'Violet, turquoise, and orchid',
                colors: [Color(0xff6750a4), Color(0xff008f83)],
              ),
              (
                id: 'ember',
                name: 'Warm Ember',
                description: 'Grounded copper, amber, and berry',
                colors: [Color(0xffa34213), Color(0xffc26a00)],
              ),
              (
                id: 'twilight',
                name: 'Twilight',
                description: 'Indigo, purple, and dusk blue',
                colors: [Color(0xff4648a3), Color(0xff7651a8)],
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
            SwitchListTile(
              title: const Text('Chimera FX motion'),
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
                      'BACKGROUND VFX',
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, letterSpacing: 1.1),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Choose from 12 chimera-fx backgrounds. They stay subtle and react to swipes.',
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                    const SizedBox(height: 10),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: [
                        for (final v in const [
                          ('field', 'Field Flux', Icons.gradient_rounded),
                          ('nebula', 'Nebula Drift', Icons.blur_on_rounded),
                          ('rivers', 'Data Rivers', Icons.water_rounded),
                          ('tendrils', 'Energy Tendrils', Icons.bolt_rounded),
                          ('orbs', 'Orb Glow', Icons.circle_outlined),
                          ('lattice', 'Lattice Mesh', Icons.grid_on_rounded),
                          ('void', 'Void Minimal', Icons.nights_stay_rounded),
                          ('prism', 'Prism Burst', Icons.auto_awesome_rounded),
                          ('aurora', 'Aurora Bloom', Icons.wb_twilight_rounded),
                          ('ember', 'Ember Warm', Icons.local_fire_department_rounded),
                          ('ocean', 'Ocean Depth', Icons.waves_rounded),
                          ('twilight', 'Twilight Veil', Icons.nightlight_rounded),
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
                  const Text(
                    'Available private models',
                    style: TextStyle(fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 8),
                  ...mindRecipePrivateModelChoices.map(
                    (choice) => InkWell(
                      borderRadius: BorderRadius.circular(12),
                      onTap: _modelActionInProgress
                          ? null
                          : () => setState(() {
                              _privateModelSelectionTouched = true;
                              _selectedPrivateChoice = choice;
                            }),
                      child: Container(
                        width: double.infinity,
                        margin: const EdgeInsets.only(bottom: 8),
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          border: Border.all(
                            color: Theme.of(context).colorScheme.primary,
                          ),
                          borderRadius: BorderRadius.circular(12),
                          color:
                              choice.manifest.id ==
                                  _selectedPrivateChoice.manifest.id
                              ? Theme.of(context).colorScheme.primaryContainer
                                    .withOpacity(0.34)
                              : null,
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Expanded(
                                  child: Text(
                                    choice.name,
                                    style: const TextStyle(
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                ),
                                if (choice.recommended)
                                  const Chip(label: Text('Recommended')),
                                Radio<OnDeviceModelChoice>(
                                  value: choice,
                                  groupValue: _selectedPrivateChoice,
                                  onChanged: _modelActionInProgress
                                      ? null
                                      : (value) => setState(() {
                                          _privateModelSelectionTouched = true;
                                          _selectedPrivateChoice = value!;
                                        }),
                                ),
                              ],
                            ),
                            Text(choice.quality),
                            const SizedBox(height: 3),
                            Text(
                              '${choice.bestFor}\n${choice.memoryNote}',
                              style: Theme.of(context).textTheme.bodySmall,
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                if (choice.manifest.id ==
                                        OnDeviceInference().activeModel.id &&
                                    _privateModel.isReady)
                                  const Chip(
                                    avatar: Icon(Icons.check_circle, size: 16),
                                    label: Text('Active'),
                                  )
                                else if (_downloadedPrivateModelIds.contains(
                                  choice.manifest.id,
                                ))
                                  OutlinedButton.icon(
                                    onPressed: _modelActionInProgress
                                        ? null
                                        : () => _usePrivateModel(choice),
                                    icon: const Icon(
                                      Icons.swap_horiz_rounded,
                                      size: 18,
                                    ),
                                    label: const Text('Use model'),
                                  )
                                else
                                  FilledButton.tonalIcon(
                                    onPressed: _modelActionInProgress
                                        ? null
                                        : () {
                                            setState(() {
                                              _privateModelSelectionTouched =
                                                  true;
                                              _selectedPrivateChoice = choice;
                                            });
                                            _installPrivateModel();
                                          },
                                    icon: const Icon(
                                      Icons.download_rounded,
                                      size: 18,
                                    ),
                                    label: const Text('Download'),
                                  ),
                                const Spacer(),
                                if (_downloadedPrivateModelIds.contains(
                                  choice.manifest.id,
                                ))
                                  IconButton(
                                    onPressed: _modelActionInProgress
                                        ? null
                                        : () => _removePrivateModel(choice),
                                    tooltip: 'Remove ${choice.name}',
                                    icon: const Icon(
                                      Icons.delete_outline_rounded,
                                    ),
                                  ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  Text(
                    'Download only the models you want. Every download is verified before it can run, and you can switch or remove it here at any time.',
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
            ButtonBar(
              children: [
                if (_downloadedPrivateModelIds.contains(
                      _selectedPrivateChoice.manifest.id,
                    ) &&
                    _selectedPrivateChoice.manifest.id !=
                        OnDeviceInference().activeModel.id)
                  FilledButton.icon(
                    onPressed: _modelActionInProgress
                        ? null
                        : () => _usePrivateModel(_selectedPrivateChoice),
                    icon: const Icon(Icons.swap_horiz_rounded),
                    label: Text('Use ${_selectedPrivateChoice.name}'),
                  )
                else if (_downloadedPrivateModelIds.contains(
                  _selectedPrivateChoice.manifest.id,
                ))
                  TextButton.icon(
                    onPressed: _modelActionInProgress
                        ? null
                        : () => _removePrivateModel(_selectedPrivateChoice),
                    icon: const Icon(Icons.delete_outline_rounded),
                    label: Text('Remove ${_selectedPrivateChoice.name}'),
                  )
                else
                  FilledButton.icon(
                    onPressed:
                        _modelActionInProgress ||
                            _privateModel.status == OnDeviceStatus.downloading
                        ? null
                        : _installPrivateModel,
                    icon: const Icon(Icons.download_rounded),
                    label: Text('Install ${_selectedPrivateChoice.name}'),
                  ),
              ],
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
