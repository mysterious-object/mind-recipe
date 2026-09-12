import 'dart:async';

import 'package:flutter/material.dart';

import 'app_services.dart';
import 'on_device_inference.dart';
import 'mind_recipe_fx.dart';
import 'design_tokens.dart';

/// Structured daily navigation — replaces free-form chat with the plan's
/// prescribed sequence: greeting → consent → emotion → body → activation →
/// journal → recommendation → action → follow-up.

enum NavStep {
  greeting,
  context,
  consent,
  emotion,
  body,
  activation,
  journal,
  recommendation,
  action,
  followUp,
  complete,
}

class DailyNavigation extends StatefulWidget {
  const DailyNavigation({
    super.key,
    required this.appState,
    required this.onComplete,
    required this.onSeePulse,
    this.onCheckInQueued,
    this.syncSummary = '',
  });
  final SecureAppState appState;
  final VoidCallback onComplete;
  final Future<void> Function()? onCheckInQueued;

  /// Live activity summary shown on the greeting step (chat ↔ nav sync).
  final String syncSummary;

  /// Fires after the completion confirmation — lands the member on Pulse.
  final VoidCallback onSeePulse;

  @override
  State<DailyNavigation> createState() => _DailyNavigationState();
}

class _DailyNavigationState extends State<DailyNavigation> {
  NavStep _current = NavStep.greeting;
  List<NavStep> _path = const [NavStep.greeting, NavStep.context];
  int _pathIndex = 0;
  final _journalController = TextEditingController();
  final _selectedEmotions = <String>{};
  int _activationLevel = 0;
  final _selectedBodyAreas = <String>{};
  String _zoneLabel = 'Steady and present';
  String _chosenAction = '';
  bool _consentGiven = false;
  bool _cloudOptIn = true;
  bool _completing = false;
  int _availableMinutes = 3;
  String _desiredMode = 'Guidance';
  String _capacity = 'Steady';

  static const _emotions = [
    'Calm',
    'Anxious',
    'Energetic',
    'Tired',
    'Hopeful',
    'Frustrated',
    'Grateful',
    'Sad',
    'Curious',
    'Overwhelmed',
    'Content',
    'Motivated',
    'Disconnected',
    'Playful',
    'Other',
  ];

  static const _bodyAreas = [
    'Head',
    'Neck',
    'Shoulders',
    'Chest',
    'Back',
    'Stomach',
    'Hips',
    'Legs',
    'Feet',
    'Hands',
  ];

  Future<void> _advance() async {
    if (_current == NavStep.context) {
      _configurePath();
    } else if (_pathIndex < _path.length - 1) {
      setState(() {
        _pathIndex++;
        _current = _path[_pathIndex];
      });
    }
    if (_current == NavStep.complete) {
      if (_completing) return;
      _completing = true;
      // Persist the navigation — Pulse, greeting summaries, and AI grounding
      // all read this history.
      final recordedAt = DateTime.now();
      final entryId = 'daily-nav-${recordedAt.microsecondsSinceEpoch}';
      await widget.appState.saveNavigationEntry({
        'id': entryId,
        't': recordedAt.toIso8601String(),
        'emotions': _selectedEmotions.isEmpty
            ? 'Not recorded'
            : _selectedEmotions.join(', '),
        'activation': _activationLevel,
        'body': _selectedBodyAreas.isEmpty ? '' : _selectedBodyAreas.join(', '),
        'journal': _journalController.text.trim(),
        'mode': _desiredMode,
        'available_minutes': _availableMinutes,
        'capacity': _capacity,
        'outcome': _chosenAction,
      });
      await widget.appState.queueCheckIn({
        'client_id': entryId,
        'emotions': _selectedEmotions.toList()..sort(),
        'activation': _activationLevel,
        'body_areas': _selectedBodyAreas.toList()..sort(),
        'journal': _journalController.text.trim(),
        'zone_label': _zoneLabel,
        'observations': [
          {
            'kind': 'navigation_mode',
            'value': _desiredMode.toLowerCase().replaceAll(' ', '_'),
            'recorded_at': recordedAt.toIso8601String(),
            'timezone': recordedAt.timeZoneName,
            'source': 'member_input',
            'schema_version': 'v1',
          },
          {
            'kind': 'available_minutes',
            'value': _availableMinutes,
            'recorded_at': recordedAt.toIso8601String(),
            'timezone': recordedAt.timeZoneName,
            'source': 'member_input',
            'schema_version': 'v1',
          },
          {
            'kind': 'self_reported_capacity',
            'value': _capacity.toLowerCase(),
            'recorded_at': recordedAt.toIso8601String(),
            'timezone': recordedAt.timeZoneName,
            'source': 'member_input',
            'schema_version': 'v1',
          },
        ],
      });
      final queued = widget.onCheckInQueued;
      if (queued != null) unawaited(queued());
      widget.onComplete();
      // The modal never lingers: brief confirmation, then land on Pulse
      // where the new pulse point is visible.
      Timer(const Duration(milliseconds: 2600), () {
        if (mounted) widget.onSeePulse();
      });
    }
  }

  void _goBack() {
    if (_pathIndex > 0) {
      setState(() {
        _pathIndex--;
        _current = _path[_pathIndex];
      });
    }
  }

  void _configurePath() {
    final core = <NavStep>[NavStep.greeting, NavStep.context, NavStep.consent];
    final mode = _desiredMode;
    if (mode == 'Quick reset' || _availableMinutes == 1) {
      core.addAll([
        NavStep.emotion,
        NavStep.activation,
        NavStep.action,
        NavStep.followUp,
        NavStep.complete,
      ]);
    } else if (mode == 'Talk and reflect') {
      core.addAll([
        NavStep.journal,
        if (_availableMinutes >= 3) NavStep.emotion,
        NavStep.followUp,
        NavStep.complete,
      ]);
    } else if (mode == 'Go deeper' || _availableMinutes >= 10) {
      core.addAll([
        NavStep.emotion,
        NavStep.body,
        NavStep.activation,
        NavStep.journal,
        NavStep.recommendation,
        NavStep.action,
        NavStep.followUp,
        NavStep.complete,
      ]);
    } else {
      core.addAll([
        NavStep.emotion,
        if (_capacity != 'Low') NavStep.body,
        NavStep.activation,
        NavStep.action,
        NavStep.followUp,
        NavStep.complete,
      ]);
    }
    setState(() {
      _path = core;
      _pathIndex = 2;
      _current = NavStep.consent;
    });
  }

  void _changeDirection() {
    setState(() {
      _path = const [NavStep.greeting, NavStep.context];
      _pathIndex = 1;
      _current = NavStep.context;
    });
  }

  String get _stepTitle {
    return switch (_current) {
      NavStep.greeting => 'Welcome',
      NavStep.context => 'What would help today?',
      NavStep.consent => 'Privacy & Consent',
      NavStep.emotion => 'How do you feel?',
      NavStep.body => 'Body check-in',
      NavStep.activation => 'Your energy',
      NavStep.journal => 'Reflect',
      NavStep.recommendation => 'Your green zone',
      NavStep.action => 'Choose an action',
      NavStep.followUp => 'Before you go',
      NavStep.complete => 'Complete',
    };
  }

  String get _stepSubtitle {
    return switch (_current) {
      NavStep.greeting => 'MindRecipe is here for you — no test, no performance, and you can redirect at any time.',
      NavStep.context => 'Choose the time and style that fit this moment. You can change direction at any point.',
      NavStep.consent => 'Your data is private. Cloud AI requires your explicit consent each session.',
      NavStep.emotion => 'Select the emotions most present for you right now.',
      NavStep.body => 'Where do you notice sensations in your body?',
      NavStep.activation => 'On a scale from -5 (very low) to +5 (very high), where is your energy?',
      NavStep.journal =>
        'Anything you\'d like to reflect on? This is private and never shared.',
      NavStep.recommendation => 'Describe what your green zone means today.',
      NavStep.action => 'What small wellness action can you take today?',
      NavStep.followUp => 'MindRecipe will be here when you return.',
      NavStep.complete =>
        'Your navigation is recorded. None of this is a diagnosis.',
    };
  }

  @override
  void dispose() {
    _journalController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final progress = _path.length <= 1 ? 0.0 : _pathIndex / (_path.length - 1);

    return Semantics(
      label:
          'Daily navigation step ${_pathIndex + 1} of ${_path.length}: $_stepTitle',
      child: Column(
        children: [
          LinearProgressIndicator(
            value: progress,
            semanticsLabel: 'Navigation progress',
          ),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _stepTitle,
                    style: MindRecipeTokens.displayMedium(context),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    _stepSubtitle,
                    style: MindRecipeTokens.bodyMedium(
                      context,
                    ).copyWith(color: isDark ? Colors.white70 : Colors.black54),
                  ),
                  const SizedBox(height: 24),
                  _buildCurrentStep(),
                ],
              ),
            ),
          ),
          _buildNavigationBar(),
        ],
      ),
    );
  }

  Widget _buildCurrentStep() {
    return switch (_current) {
      NavStep.greeting => _GreetingStep(
        onContinue: _advance,
        syncSummary: widget.syncSummary,
      ),
      NavStep.context => _ContextStep(
        availableMinutes: _availableMinutes,
        desiredMode: _desiredMode,
        capacity: _capacity,
        onChanged: (minutes, mode, capacity) => setState(() {
          _availableMinutes = minutes;
          _desiredMode = mode;
          _capacity = capacity;
        }),
      ),
      NavStep.consent => _ConsentStep(
        consentGiven: _consentGiven,
        cloudOptIn: _cloudOptIn,
        onChanged: (consent, cloud) => setState(() {
          _consentGiven = consent;
          _cloudOptIn = cloud;
        }),
      ),
      NavStep.emotion => _ChipSelector(
        options: _emotions,
        selected: _selectedEmotions,
        multiSelect: true,
        label: 'Select emotions',
        onChanged: (vals) => setState(() {
          _selectedEmotions.clear();
          _selectedEmotions.addAll(vals);
        }),
      ),
      NavStep.body => _ChipSelector(
        options: _bodyAreas,
        selected: _selectedBodyAreas,
        multiSelect: true,
        label: 'Select body areas',
        onChanged: (vals) => setState(() {
          _selectedBodyAreas
            ..clear()
            ..addAll(vals);
        }),
      ),
      NavStep.activation => _ActivationSlider(
        value: _activationLevel,
        onChanged: (v) => setState(() => _activationLevel = v),
      ),
      NavStep.journal => _JournalField(controller: _journalController),
      NavStep.recommendation => _ZoneEditor(
        value: _zoneLabel,
        onChanged: (v) => setState(() => _zoneLabel = v),
      ),
      NavStep.action => _ActionSelector(
        value: _chosenAction,
        onChanged: (v) => setState(() => _chosenAction = v),
      ),
      NavStep.followUp => _FollowUpStep(
        emotion: _selectedEmotions.isEmpty
            ? 'Not recorded'
            : _selectedEmotions.join(', '),
        activation: _activationLevel,
        action: _chosenAction,
        zone: _zoneLabel,
      ),
      NavStep.complete => _CompleteStep(
        appState: widget.appState,
        emotions: _selectedEmotions.isEmpty
            ? 'Not recorded'
            : _selectedEmotions.join(', '),
        activation: _activationLevel,
        journal: _journalController.text.trim(),
      ),
    };
  }

  Widget _buildNavigationBar() {
    final canAdvance = switch (_current) {
      NavStep.greeting => true,
      NavStep.context => true,
      NavStep.consent => _consentGiven,
      NavStep.emotion => _selectedEmotions.isNotEmpty,
      NavStep.body => true,
      NavStep.activation => true,
      NavStep.journal => true,
      NavStep.recommendation => _zoneLabel.isNotEmpty,
      NavStep.action => _chosenAction.isNotEmpty,
      NavStep.followUp => true,
      NavStep.complete => false,
    };

    return Container(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          if (_current != NavStep.greeting && _current != NavStep.complete)
            OutlinedButton(onPressed: _goBack, child: const Text('Back')),
          if (_current != NavStep.greeting &&
              _current != NavStep.context &&
              _current != NavStep.consent &&
              _current != NavStep.complete) ...[
            const SizedBox(width: 8),
            TextButton(onPressed: _advance, child: const Text('Skip')),
          ],
          const Spacer(),
          if (_current != NavStep.greeting &&
              _current != NavStep.context &&
              _current != NavStep.complete)
            IconButton(
              tooltip: 'Change navigation length or direction',
              onPressed: _changeDirection,
              icon: const Icon(Icons.tune_rounded),
            ),
          if (_current == NavStep.complete)
            FilledButton.icon(
              onPressed: widget.onSeePulse,
              icon: const Icon(Icons.monitor_heart_rounded),
              label: const Text('View pulse'),
            )
          else
            Semantics(
              label: _current == NavStep.followUp
                  ? 'Complete navigation'
                  : 'Continue to next step',
              child: FilledButton(
                onPressed: canAdvance ? _advance : null,
                child: Text(
                  _current == NavStep.followUp ? 'Complete' : 'Continue',
                ),
              ),
            ),
        ],
      ),
    );
  }
}

// ── Step widgets ───────────────────────────────────────────────────

class _GreetingStep extends StatelessWidget {
  const _GreetingStep({required this.onContinue, this.syncSummary = ''});
  final VoidCallback onContinue;
  final String syncSummary;
  @override
  Widget build(BuildContext context) => Semantics(
    label: 'MindRecipe greeting. Tap to begin your daily navigation.',
    child: Card(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            Icon(
              Icons.navigation_rounded,
              size: 64,
              color: MindRecipeTokens.primary,
            ),
            const SizedBox(height: 16),
            Text(
              'Welcome to MindRecipe',
              style: MindRecipeTokens.headlineMedium(context),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 12),
            Text(
              'This is a wellness tool, not therapy or medical care. '
              'You can skip any question, correct anything, and leave at any time.',
              style: MindRecipeTokens.bodyMedium(context),
              textAlign: TextAlign.center,
            ),
            if (syncSummary.isNotEmpty) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 8,
                ),
                decoration: BoxDecoration(
                  color: MindRecipeTokens.primary.withValues(alpha: 0.10),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  syncSummary,
                  textAlign: TextAlign.center,
                  style: MindRecipeTokens.bodySmall(context),
                ),
              ),
            ],
            const SizedBox(height: 24),
            FilledButton.icon(
              onPressed: onContinue,
              icon: const Icon(Icons.arrow_forward),
              label: const Text('Begin today\'s navigation'),
            ),
          ],
        ),
      ),
    ),
  );
}

class _ContextStep extends StatelessWidget {
  const _ContextStep({
    required this.availableMinutes,
    required this.desiredMode,
    required this.capacity,
    required this.onChanged,
  });

  final int availableMinutes;
  final String desiredMode;
  final String capacity;
  final void Function(int minutes, String mode, String capacity) onChanged;

  static const _minutes = <int>[1, 3, 10, 20];
  static const _modes = <String>[
    'Talk and reflect',
    'Guidance',
    'Quick reset',
    'Go deeper',
  ];
  static const _capacities = <String>['Low', 'Steady', 'Open'];

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text('Time available', style: MindRecipeTokens.title(context)),
      const SizedBox(height: 8),
      Wrap(
        spacing: 8,
        children: _minutes
            .map(
              (minutes) => ChoiceChip(
                label: Text(minutes == 1 ? '60 seconds' : '$minutes minutes'),
                selected: availableMinutes == minutes,
                onSelected: (_) => onChanged(minutes, desiredMode, capacity),
              ),
            )
            .toList(),
      ),
      const SizedBox(height: 20),
      Text(
        'How should Navigator meet you?',
        style: MindRecipeTokens.title(context),
      ),
      const SizedBox(height: 8),
      Wrap(
        spacing: 8,
        runSpacing: 8,
        children: _modes
            .map(
              (mode) => ChoiceChip(
                label: Text(mode),
                selected: desiredMode == mode,
                onSelected: (_) => onChanged(availableMinutes, mode, capacity),
              ),
            )
            .toList(),
      ),
      const SizedBox(height: 20),
      Text('Capacity right now', style: MindRecipeTokens.title(context)),
      const SizedBox(height: 8),
      SegmentedButton<String>(
        segments: _capacities
            .map((value) => ButtonSegment(value: value, label: Text(value)))
            .toList(),
        selected: {capacity},
        onSelectionChanged: (selection) =>
            onChanged(availableMinutes, desiredMode, selection.first),
      ),
      const SizedBox(height: 16),
      Text(
        'MindRecipe uses these choices only to shape this navigation. They are saved with source and time so you can understand later recommendations.',
        style: MindRecipeTokens.bodySmall(context),
      ),
    ],
  );
}

class _ConsentStep extends StatelessWidget {
  const _ConsentStep({
    required this.consentGiven,
    required this.cloudOptIn,
    required this.onChanged,
  });
  final bool consentGiven;
  final bool cloudOptIn;
  final void Function(bool consent, bool cloud) onChanged;

  @override
  Widget build(BuildContext context) => Column(
    children: [
      Card(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              SwitchListTile.adaptive(
                value: consentGiven,
                onChanged: (v) => onChanged(v, cloudOptIn),
                title: const Text('I understand this is a wellness tool'),
                subtitle: const Text(
                  'MindRecipe does not diagnose, prescribe, or provide emergency care.',
                ),
              ),
              Divider(height: 1, color: Theme.of(context).dividerColor),
              SwitchListTile.adaptive(
                value: cloudOptIn && consentGiven,
                onChanged: consentGiven
                    ? (v) => onChanged(consentGiven, v)
                    : null,
                title: const Text('Allow cloud AI for this session'),
                subtitle: const Text(
                  'Your conversation is private. Cloud processing is optional.',
                ),
              ),
            ],
          ),
        ),
      ),
    ],
  );
}

class _ChipSelector extends StatelessWidget {
  const _ChipSelector({
    required this.options,
    required this.selected,
    required this.label,
    this.multiSelect = false,
    required this.onChanged,
  });
  final List<String> options;
  final dynamic selected;
  final String label;
  final bool multiSelect;
  final void Function(Set<String> values) onChanged;

  @override
  Widget build(BuildContext context) {
    final selectedSet = multiSelect
        ? (selected as Set<String>)
        : (selected is String && selected.isNotEmpty
              ? {selected as String}
              : <String>{});

    return Semantics(
      label: label,
      child: Wrap(
        spacing: 8,
        runSpacing: 8,
        children: options.map((option) {
          final isSelected = selectedSet.contains(option);
          return FilterChip(
            label: Text(option),
            selected: isSelected,
            onSelected: (v) {
              final updated = Set<String>.from(selectedSet);
              if (v) {
                updated.add(option);
              } else {
                updated.remove(option);
              }
              onChanged(updated);
            },
            selectedColor: MindRecipeTokens.primary.withAlpha(40),
            checkmarkColor: MindRecipeTokens.primary,
          );
        }).toList(),
      ),
    );
  }
}

class _ActivationSlider extends StatelessWidget {
  const _ActivationSlider({required this.value, required this.onChanged});
  final int value;
  final ValueChanged<int> onChanged;

  @override
  Widget build(BuildContext context) => Semantics(
    label: 'Activation level: $value. Swipe left for lower, right for higher.',
    child: Column(
      children: [
        Text(
          '$value',
          style: MindRecipeTokens.displayMedium(context).copyWith(
            color: value < -2
                ? MindRecipeTokens.warning
                : value > 2
                ? MindRecipeTokens.success
                : MindRecipeTokens.primary,
          ),
        ),
        Slider(
          value: value.toDouble(),
          min: -5,
          max: 5,
          divisions: 10,
          label: value.toString(),
          onChanged: (v) => onChanged(v.round()),
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: const [
            Text('Very low (-5)', style: TextStyle(fontSize: 12)),
            Text('Very high (+5)', style: TextStyle(fontSize: 12)),
          ],
        ),
      ],
    ),
  );
}

class _JournalField extends StatelessWidget {
  const _JournalField({required this.controller});
  final TextEditingController controller;

  @override
  Widget build(BuildContext context) => Semantics(
    label: 'Journal entry. Your reflections are private and never shared.',
    child: TextField(
      controller: controller,
      maxLines: 6,
      maxLength: 4000,
      decoration: const InputDecoration(
        hintText: 'What\'s on your mind? This is private — nothing is inferred from your journal.',
        border: OutlineInputBorder(),
      ),
    ),
  );
}

class _ZoneEditor extends StatelessWidget {
  const _ZoneEditor({required this.value, required this.onChanged});
  final String value;
  final ValueChanged<String> onChanged;

  static const _suggestions = [
    'Steady and present',
    'Learning and curious',
    'Rest and recovery',
    'Gentle movement',
    'Creative flow',
    'Deep focus',
    'Social connection',
    'Quiet reflection',
    'Energy building',
  ];

  @override
  Widget build(BuildContext context) => Semantics(
    label: 'Define your green zone. How would you describe your ideal state today?',
    child: Column(
      children: [
        TextField(
          controller: TextEditingController(text: value),
          onChanged: onChanged,
          decoration: const InputDecoration(
            labelText: 'Your green zone',
            hintText: 'Describe what your ideal state feels like today',
            border: OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 12),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: _suggestions
              .map(
                (s) =>
                    ActionChip(label: Text(s), onPressed: () => onChanged(s)),
              )
              .toList(),
        ),
      ],
    ),
  );
}

class _ActionSelector extends StatelessWidget {
  const _ActionSelector({required this.value, required this.onChanged});
  final String value;
  final ValueChanged<String> onChanged;

  static const _actions = [
    'Breathing reset',
    'Grounding exercise',
    'Values reflection',
    'Boundary script',
    'Movement break',
    'Creative time',
    'Call a friend',
    'Step outside',
    'Journal entry',
  ];

  @override
  Widget build(BuildContext context) => Semantics(
    label: 'Choose a wellness action for today.',
    child: Column(
      children: [
        ...(_actions.map(
          (a) => RadioListTile<String>(
            title: Text(a),
            value: a,
            groupValue: value,
            onChanged: (v) => onChanged(v ?? ''),
            activeColor: MindRecipeTokens.primary,
          ),
        )),
      ],
    ),
  );
}

class _FollowUpStep extends StatelessWidget {
  const _FollowUpStep({
    required this.emotion,
    required this.activation,
    required this.action,
    required this.zone,
  });
  final String emotion;
  final int activation;
  final String action;
  final String zone;

  @override
  Widget build(BuildContext context) => Semantics(
    label: 'Navigation summary. Your responses are recorded.',
    child: Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Text(
              'Today\'s Navigation',
              style: MindRecipeTokens.headlineLarge(context),
            ),
            const SizedBox(height: 16),
            _RowItem('Emotion', emotion.isNotEmpty ? emotion : 'Not recorded'),
            _RowItem('Activation', '$activation'),
            _RowItem('Green zone', zone),
            _RowItem('Action', action.isNotEmpty ? action : 'Not selected'),
            _RowItem('Journal', 'Private — stored locally only'),
            const SizedBox(height: 12),
            Text(
              'You can return to MindRecipe anytime. Your responses are stored on this device only.',
              style: MindRecipeTokens.bodySmall(context),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    ),
  );
}

class _RowItem extends StatelessWidget {
  const _RowItem(this.label, this.value);
  final String label;
  final String value;
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 4),
    child: Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: MindRecipeTokens.bodyMedium(context)
              .copyWith(fontWeight: FontWeight.w600),
        ),
        Text(value, style: MindRecipeTokens.bodyMedium(context)),
      ],
    ),
  );
}

class _CompleteStep extends StatefulWidget {
  const _CompleteStep({
    required this.appState,
    required this.emotions,
    required this.activation,
    required this.journal,
  });
  final SecureAppState appState;
  final String emotions;
  final int activation;
  final String journal;

  @override
  State<_CompleteStep> createState() => _CompleteStepState();
}

class _CompleteStepState extends State<_CompleteStep> {
  bool _wantAi = false;
  bool _aiBusy = false;
  bool _navigatorOnline = false;
  String? _reflection;

  @override
  void initState() {
    super.initState();
    OnDeviceInference.snapshotNotifier.addListener(_updateOnline);
    _updateOnline();
  }

  @override
  void dispose() {
    OnDeviceInference.snapshotNotifier.removeListener(_updateOnline);
    super.dispose();
  }

  void _updateOnline() {
    if (!mounted) return;
    final local = OnDeviceInference.snapshotNotifier.value.isReady;
    final cloud = widget.appState.cloudAiEnabled && widget.appState.aiAvailable;
    setState(() => _navigatorOnline = local || cloud);
  }

  Future<void> _reflect() async {
    setState(() => _aiBusy = true);
    final prompt =
        'A member just completed a daily navigation. Emotions: ${widget.emotions}. '
        'Activation: ${widget.activation}/10. '
        '${widget.journal.isNotEmpty ? 'Their words: "${widget.journal}". ' : ''}'
        'Give one grounded observation and one small next step. 35-80 words. '
        'No diagnosis, no clinical claims.';
    String? reply;
    try {
      reply = await OnDeviceInference().infer(prompt);
    } catch (_) {}
    if (mounted) {
      setState(() {
        _reflection =
            reply ??
            'Navigator could not reflect right now — your navigation is saved.';
        _aiBusy = false;
      });
    }
    final all = await widget.appState.loadNavigationHistory();
    if (all.isNotEmpty) {
      final latest = Map<String, dynamic>.from(all.first);
      latest['ai_reflection'] = _reflection;
      await widget.appState.saveNavigationEntry(latest);
    }
  }

  @override
  Widget build(BuildContext context) => Semantics(
    label: 'Navigation complete. Your session has been saved.',
    child: Card(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            const MindRecipeOrbBadge(size: 72, active: true),
            const SizedBox(height: 16),
            Text(
              'Navigation complete',
              style: MindRecipeTokens.headlineMedium(context),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 12),
            Text(
              'Your responses are saved locally. MindRecipe is a wellness tool — nothing here is a diagnosis or clinical record.',
              style: MindRecipeTokens.bodyMedium(context),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              'Your pulse was just updated — taking you there…',
              style: MindRecipeTokens.bodySmall(context),
              textAlign: TextAlign.center,
            ),
            const Divider(height: 28),
            SwitchListTile.adaptive(
              contentPadding: EdgeInsets.zero,
              value: _wantAi && _navigatorOnline,
              onChanged: _navigatorOnline
                  ? (v) => setState(() => _wantAi = v)
                  : null,
              title: const Text('AI reflection (optional)'),
              subtitle: Text(
                _navigatorOnline
                    ? 'A brief private reflection on this navigation — saved with it.'
                    : 'Navigator is offline — install the private model or enable cloud AI.',
              ),
            ),
            if (_wantAi && _navigatorOnline) ...[
              FilledButton.tonalIcon(
                onPressed: _aiBusy ? null : _reflect,
                icon: _aiBusy
                    ? const SizedBox(
                        width: 14,
                        height: 14,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Icon(Icons.auto_awesome_rounded, size: 16),
                label: Text(
                  _aiBusy ? 'Reflecting…' : 'Reflect on this navigation',
                ),
              ),
              if (_reflection != null) ...[
                const SizedBox(height: 12),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Theme.of(context).colorScheme.surfaceContainerHighest
                        .withValues(alpha: 0.6),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(_reflection!),
                ),
              ],
            ],
          ],
        ),
      ),
    ),
  );
}
