import 'dart:async';

import 'package:flutter/material.dart';

import 'mind_recipe_fx.dart';
import 'design_tokens.dart';

/// Structured daily navigation — replaces free-form chat with the plan's
/// prescribed sequence: greeting → consent → emotion → body → activation →
/// journal → recommendation → action → follow-up.

enum NavStep {
  greeting,
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
  const DailyNavigation({super.key, required this.onComplete, required this.onSeePulse, this.syncSummary = ''});
  final VoidCallback onComplete;

  /// Live activity summary shown on the greeting step (chat ↔ nav sync).
  final String syncSummary;

  /// Fires after the completion confirmation — lands the member on Pulse.
  final VoidCallback onSeePulse;

  @override
  State<DailyNavigation> createState() => _DailyNavigationState();
}

class _DailyNavigationState extends State<DailyNavigation> {
  NavStep _current = NavStep.greeting;
  final _journalController = TextEditingController();
  final _selectedEmotions = <String>{};
  int _activationLevel = 0;
  final _selectedBodyAreas = <String>{};
  String _zoneLabel = 'Steady and present';
  String _chosenAction = '';
  bool _consentGiven = false;
  bool _cloudOptIn = true;

  static const _emotions = [
    'Calm', 'Anxious', 'Energetic', 'Tired', 'Hopeful',
    'Frustrated', 'Grateful', 'Sad', 'Curious', 'Overwhelmed',
    'Content', 'Motivated', 'Disconnected', 'Playful', 'Other',
  ];

  static const _bodyAreas = [
    'Head', 'Neck', 'Shoulders', 'Chest', 'Back',
    'Stomach', 'Hips', 'Legs', 'Feet', 'Hands',
  ];

  void _advance() {
    final order = NavStep.values;
    final idx = order.indexOf(_current);
    if (idx < order.length - 1) {
      setState(() => _current = order[idx + 1]);
    }
    if (_current == NavStep.complete) {
      widget.onComplete();
      // The modal never lingers: brief confirmation, then land on Pulse
      // where the new pulse point is visible.
      Timer(const Duration(milliseconds: 2600), () {
        if (mounted) widget.onSeePulse();
      });
    }
  }

  void _goBack() {
    final order = NavStep.values;
    final idx = order.indexOf(_current);
    if (idx > 0) {
      setState(() => _current = order[idx - 1]);
    }
  }

  String get _stepTitle {
    return switch (_current) {
      NavStep.greeting => 'Welcome',
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
      NavStep.greeting => 'Mind Recipe is here for you — no test, no performance, and you can redirect at any time.',
      NavStep.consent => 'Your data is private. Cloud AI requires your explicit consent each session.',
      NavStep.emotion => 'Select the emotions most present for you right now.',
      NavStep.body => 'Where do you notice sensations in your body?',
      NavStep.activation => 'On a scale from -5 (very low) to +5 (very high), where is your energy?',
      NavStep.journal => 'Anything you\'d like to reflect on? This is private and never shared.',
      NavStep.recommendation => 'Describe what your green zone means today.',
      NavStep.action => 'What small wellness action can you take today?',
      NavStep.followUp => 'Mind Recipe will be here when you return.',
      NavStep.complete => 'Your navigation is recorded. None of this is a diagnosis.',
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
    final progress = NavStep.values.indexOf(_current) / (NavStep.values.length - 1);

    return Semantics(
      label: 'Daily navigation step ${NavStep.values.indexOf(_current) + 1} of ${NavStep.values.length}: $_stepTitle',
      child: Column(
        children: [
          LinearProgressIndicator(value: progress, semanticsLabel: 'Navigation progress'),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(_stepTitle, style: MindRecipeTokens.displayMedium(context)),
                  const SizedBox(height: 8),
                  Text(_stepSubtitle, style: MindRecipeTokens.bodyMedium(context).copyWith(
                    color: isDark ? Colors.white70 : Colors.black54,
                  )),
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
      NavStep.consent => _ConsentStep(
          consentGiven: _consentGiven,
          cloudOptIn: _cloudOptIn,
          onChanged: (consent, cloud) => setState(() { _consentGiven = consent; _cloudOptIn = cloud; }),
        ),
      NavStep.emotion => _ChipSelector(
          options: _emotions,
          selected: _selectedEmotions,
          multiSelect: true,
          label: 'Select emotions',
          onChanged: (vals) => setState(() { _selectedEmotions.clear(); _selectedEmotions.addAll(vals); }),
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
          emotion: _selectedEmotions.isEmpty ? 'Not recorded' : _selectedEmotions.join(', '),
          activation: _activationLevel,
          action: _chosenAction,
          zone: _zoneLabel,
        ),
      NavStep.complete => const _CompleteStep(),
    };
  }

  Widget _buildNavigationBar() {
    final canAdvance = switch (_current) {
      NavStep.greeting => true,
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
            OutlinedButton(
              onPressed: _goBack,
              child: const Text('Back'),
            ),
          const Spacer(),
          if (_current == NavStep.complete)
            FilledButton.icon(
              onPressed: widget.onSeePulse,
              icon: const Icon(Icons.monitor_heart_rounded),
              label: const Text('View pulse'),
            )
          else
            Semantics(
              label: _current == NavStep.followUp ? 'Complete navigation' : 'Continue to next step',
              child: FilledButton(
                onPressed: canAdvance ? _advance : null,
                child: Text(_current == NavStep.followUp ? 'Complete' : 'Continue'),
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
    label: 'Mind Recipe greeting. Tap to begin your daily navigation.',
    child: Card(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            Icon(Icons.navigation_rounded, size: 64, color: MindRecipeTokens.primary),
            const SizedBox(height: 16),
            Text('Welcome to Mind Recipe',
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
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
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
                subtitle: const Text('Mind Recipe does not diagnose, prescribe, or provide emergency care.'),
              ),
              Divider(height: 1, color: Theme.of(context).dividerColor),
              SwitchListTile.adaptive(
                value: cloudOptIn && consentGiven,
                onChanged: consentGiven ? (v) => onChanged(consentGiven, v) : null,
                title: const Text('Allow cloud AI for this session'),
                subtitle: const Text('Your conversation is private. Cloud processing is optional.'),
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
        : (selected is String && selected.isNotEmpty ? {selected as String} : <String>{});

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
              if (v) { updated.add(option); } else { updated.remove(option); }
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
        Text('$value',
          style: MindRecipeTokens.displayMedium(context).copyWith(
            color: value < -2 ? MindRecipeTokens.warning :
                   value > 2 ? MindRecipeTokens.success :
                   MindRecipeTokens.primary,
          ),
        ),
        Slider(
          value: value.toDouble(),
          min: -5, max: 5, divisions: 10,
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
    'Steady and present', 'Learning and curious', 'Rest and recovery',
    'Gentle movement', 'Creative flow', 'Deep focus',
    'Social connection', 'Quiet reflection', 'Energy building',
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
        Wrap(spacing: 8, runSpacing: 8,
          children: _suggestions.map((s) => ActionChip(
            label: Text(s),
            onPressed: () => onChanged(s),
          )).toList(),
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
    'Breathing reset', 'Grounding exercise', 'Values reflection',
    'Boundary script', 'Movement break', 'Creative time',
    'Call a friend', 'Step outside', 'Journal entry',
  ];

  @override
  Widget build(BuildContext context) => Semantics(
    label: 'Choose a wellness action for today.',
    child: Column(
      children: [
        ...(_actions.map((a) => RadioListTile<String>(
          title: Text(a),
          value: a,
          groupValue: value,
          onChanged: (v) => onChanged(v ?? ''),
          activeColor: MindRecipeTokens.primary,
        ))),
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
            Text('Today\'s Navigation', style: MindRecipeTokens.headlineLarge(context)),
            const SizedBox(height: 16),
            _RowItem('Emotion', emotion.isNotEmpty ? emotion : 'Not recorded'),
            _RowItem('Activation', '$activation'),
            _RowItem('Green zone', zone),
            _RowItem('Action', action.isNotEmpty ? action : 'Not selected'),
            _RowItem('Journal', 'Private — stored locally only'),
            const SizedBox(height: 12),
            Text('You can return to Mind Recipe anytime. Your responses are stored on this device only.',
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
        Text(label, style: MindRecipeTokens.bodyMedium(context).copyWith(fontWeight: FontWeight.w600)),
        Text(value, style: MindRecipeTokens.bodyMedium(context)),
      ],
    ),
  );
}

class _CompleteStep extends StatelessWidget {
  const _CompleteStep();
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
            Text('Navigation complete',
              style: MindRecipeTokens.headlineMedium(context),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 12),
            Text('Your responses are saved locally. Mind Recipe is a wellness tool — nothing here is a diagnosis or clinical record.',
              style: MindRecipeTokens.bodyMedium(context),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text('Your pulse was just updated — taking you there…',
              style: MindRecipeTokens.bodySmall(context),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    ),
  );
}