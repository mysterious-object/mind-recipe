import 'dart:async';

import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import 'account_gateway.dart';
import 'app_services.dart';
import 'check_in_state.dart';
import 'cinematic_experience.dart';
import 'daily_navigation.dart';
import 'design_tokens.dart';
import 'mind_nav_chat.dart';
import 'mind_nav_fx.dart';
import 'on_device_inference.dart';
import 'notification_scheduler.dart';
import 'practitioner_sharing.dart';
import 'wellness_toolbox.dart';

void main() => runApp(const MindNavApp());

class MindNavApp extends StatefulWidget {
  const MindNavApp({super.key, this.initialAppState, this.initialApi});
  final SecureAppState? initialAppState;
  final MindNavApiClient? initialApi;
  @override
  State<MindNavApp> createState() => _MindNavAppState();
}

class _MindNavAppState extends State<MindNavApp> {
  bool practitionerMode = false;
  bool onboardingComplete = false;
  ThemeMode _themeMode = ThemeMode.system;
  late final MindNavApiClient api;
  late final SecureAppState appState;

  @override
  void initState() {
    super.initState();
    api = widget.initialApi ?? MindNavApiClient();
    appState = widget.initialAppState ?? SecureAppState();
    appState.addListener(_refresh);
    _initialize();
  }

  Future<void> _initialize() async {
    if (!appState.loaded) await appState.load();
    appState.setManagedAiAvailable(await api.aiAvailable());
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
    final scheme =
        ColorScheme.fromSeed(
          seedColor: const Color(0xff007d71),
          brightness: Brightness.light,
        ).copyWith(
          primary: const Color(0xff006b60),
          secondary: MindNavFxPalette.secondary,
          tertiary: const Color(0xff007a4d),
        );
    return MaterialApp(
      title: 'Mind Nav',
      theme: ThemeData(
        colorScheme: scheme,
        useMaterial3: true,
        scaffoldBackgroundColor: MindNavTokens.surfaceWhite,
      ),
      darkTheme: ThemeData(
        colorScheme:
            ColorScheme.fromSeed(
              seedColor: MindNavTokens.primary,
              brightness: Brightness.dark,
            ).copyWith(
              primary: MindNavTokens.primary,
              secondary: MindNavTokens.secondary,
              tertiary: MindNavTokens.tertiary,
              surface: MindNavTokens.surfaceBlack,
            ),
        useMaterial3: true,
        scaffoldBackgroundColor: MindNavTokens.voidBlack,
      ),
      themeMode: _themeMode,
      home: !appState.loaded
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
  final MindNavApiClient api;
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
    'Mind Nav AI',
    'Today',
    'Toolbox',
    'Mind Recipe',
    'Progress',
    'Booking',
    'Profile',
  ];
  final icons = const [
    Icons.navigation,
    Icons.today,
    Icons.handyman,
    Icons.menu_book,
    Icons.insights,
    Icons.calendar_month,
    Icons.person,
  ];
  late final PageController pageController;
  late final ScrollController railController;

  @override
  void initState() {
    super.initState();
    pageController = PageController();
    railController = ScrollController();
  }

  @override
  void dispose() {
    pageController.dispose();
    railController.dispose();
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

  @override
  Widget build(BuildContext context) {
    final screens = [
      useStructuredNav
          ? DailyNavigation(
              onComplete: () {
                widget.appState.recordAssistantMessage(startsSession: true);
                widget.appState.recordAiReflection();
                setState(() {});
              },
            )
          : MindNavChatExperience(
              state: checkIn,
              onChanged: () => setState(() {}),
              api: widget.api,
              appState: widget.appState,
              messages: chatMessages,
            ),
      TodayScreen(appState: widget.appState),
      WellnessToolbox(appState: widget.appState),
      const MindRecipeScreen(),
      ProgressScreen(checkIn: checkIn, tools: tools),
      const BookingScreen(),
      ProfileScreen(
        onPractitioner: widget.onPractitioner,
        appState: widget.appState,
        onSignOut: widget.onSignOut,
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
            title: MindNavPageTitle(
              title: labels[index],
              forward: index >= previousIndex,
            ),
            actions: [
              Semantics(
                label: useStructuredNav
                    ? 'Switch to free-form chat'
                    : 'Switch to structured navigation',
                child: IconButton(
                  icon: Icon(
                    useStructuredNav ? Icons.format_list_numbered : Icons.chat,
                  ),
                  tooltip: useStructuredNav
                      ? 'Switch to chat'
                      : 'Structured navigation',
                  onPressed: () =>
                      setState(() => useStructuredNav = !useStructuredNav),
                ),
              ),
              IconButton(
                icon: Icon(
                  Theme.of(context).brightness == Brightness.dark
                      ? Icons.light_mode
                      : Icons.dark_mode,
                ),
                tooltip: 'Toggle dark mode',
                onPressed: () => setState(() {}),
              ),
            ],
          ),
          body: SafeArea(
            child: Stack(
              children: [
                Positioned.fill(child: MindNavGpuField(progress: progress)),
                Positioned.fill(child: MindNavFxBackdrop(progress: progress)),
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
              ],
            ),
          ),
          bottomNavigationBar: MindNavPageRail(
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
    final api = MindNavApiClient();
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
        'Your day, shaped by the navigation you have done with Mind Nav AI.',
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
          color: MindNavTokens.primary.withAlpha(15),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.insights, color: MindNavTokens.primary),
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
                              ? MindNavTokens.success
                              : MindNavTokens.warning,
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

class ToolboxScreen extends StatelessWidget {
  const ToolboxScreen({
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
        'Build your wellness toolbox',
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
            subtitle: const Text('Mind Recipe wellness tool'),
          ),
        ),
      ),
    ],
  );
}

class MindRecipeScreen extends StatelessWidget {
  const MindRecipeScreen({super.key});
  @override
  Widget build(BuildContext context) => ListView(
    padding: const EdgeInsets.all(20),
    children: const [
      Text(
        'Mind Recipe',
        style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold),
      ),
      Text(
        'A self-development program for brain-body awareness and conscious living.',
      ),
      SizedBox(height: 16),
      Card(
        child: ListTile(
          leading: CircleAvatar(child: Text('11')),
          title: Text('Orientation'),
          subtitle: Text('11 of 50 lessons complete'),
          trailing: Icon(Icons.chevron_right),
        ),
      ),
      Card(
        child: ListTile(
          leading: Icon(Icons.track_changes),
          title: Text('Mindful Check-In'),
          subtitle: Text('Emotion, body sensations, thoughts, surroundings'),
        ),
      ),
      Card(
        child: ListTile(
          leading: Icon(Icons.favorite_outline),
          title: Text('Regulation Tool Used'),
          subtitle: Text(
            'Breath, grounding, movement, cold water, music, and more',
          ),
        ),
      ),
      Card(
        child: ListTile(
          leading: Icon(Icons.groups_outlined),
          title: Text('MindChefs & MindMentor'),
          subtitle: Text(
            'Community content will be imported after verified Passion.io inventory.',
          ),
        ),
      ),
    ],
  );
}

class ProgressScreen extends StatelessWidget {
  const ProgressScreen({super.key, required this.checkIn, required this.tools});
  final CheckInState checkIn;
  final Set<String> tools;
  @override
  Widget build(BuildContext context) => ListView(
    padding: const EdgeInsets.all(20),
    children: [
      const Text(
        'Your progress',
        style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold),
      ),
      Card(
        child: ListTile(
          title: const Text('Today’s user-reported facts'),
          subtitle: Text(
            '${checkIn.emotions.isEmpty ? 'No emotions selected' : checkIn.emotions.join(', ')} · Activation ${checkIn.activation}',
          ),
        ),
      ),
      Card(
        child: ListTile(
          title: const Text('Wellness toolbox'),
          subtitle: Text(
            '${tools.length} saved practice${tools.length == 1 ? '' : 's'}',
          ),
        ),
      ),
      const Card(
        child: ListTile(
          title: Text('AI reflections'),
          subtitle: Text(
            'AI-generated suggestions are shown separately from your responses and are not diagnoses.',
          ),
        ),
      ),
    ],
  );
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
  Timer? _progressTimer;

  @override
  void initState() {
    super.initState();
    _refreshPrivateModel();
    _progressTimer = Timer.periodic(const Duration(milliseconds: 500), (_) {
      if (!mounted) return;
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
    if (mounted) setState(() => _privateModel = snapshot);
  }

  Future<void> _installPrivateModel() async {
    setState(() => _modelActionInProgress = true);
    var installed = false;
    try {
      await OnDeviceInference().installModel();
      installed = true;
    } catch (_) {
      // Preserve the safe failure detail from OnDeviceInference below.
      if (mounted) setState(() => _privateModel = OnDeviceInference().snapshot);
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
        title: const Text('Connect Mind Nav AI'),
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
        'Privacy & profile',
        style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold),
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
                ? 'Mind Nav AI connected'
                : 'Mind Nav AI not connected',
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
                    : _privateModel.detail ?? 'Install the 1.2 GB private reasoning model. Keep at least 2.5 GB free so it can run reliably.',
              ),
            ),
            if (_modelActionInProgress ||
                _privateModel.status == OnDeviceStatus.downloading ||
                _privateModel.status == OnDeviceStatus.verifying)
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
                child: LinearProgressIndicator(
                  value: _privateModel.status == OnDeviceStatus.downloading
                      ? OnDeviceInference().downloadProgress
                      : null,
                ),
              ),
            const Divider(height: 1),
            ButtonBar(
              children: [
                if (_privateModel.isReady)
                  TextButton.icon(
                    onPressed: _modelActionInProgress
                        ? null
                        : () async {
                            setState(() => _modelActionInProgress = true);
                            await OnDeviceInference().removeModel();
                            await _refreshPrivateModel();
                            if (mounted) {
                              setState(() => _modelActionInProgress = false);
                            }
                          },
                    icon: const Icon(Icons.delete_outline_rounded),
                    label: const Text('Remove model'),
                  )
                else
                  FilledButton.icon(
                    onPressed:
                        _modelActionInProgress ||
                            _privateModel.status == OnDeviceStatus.downloading
                        ? null
                        : _installPrivateModel,
                    icon: const Icon(Icons.download_rounded),
                    label: const Text('Install private model'),
                  ),
              ],
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
      Card(
        child: ListTile(
          leading: const Icon(Icons.construction),
          title: const Text('Wellness toolbox'),
          subtitle: const Text(
            'Manage your wellness practices, track effectiveness, and discover new tools.',
          ),
          trailing: const Icon(Icons.chevron_right),
          onTap: () => Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) =>
                  Scaffold(body: WellnessToolbox(appState: widget.appState)),
            ),
          ),
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
    'Mind Nav supports wellness and self-reflection. It is not therapy, medical care, diagnosis, or emergency response.',
    style: TextStyle(fontSize: 12, color: Colors.black54),
  );
}
