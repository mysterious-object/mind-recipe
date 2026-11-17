import 'package:flutter/material.dart';

import 'app_services.dart';
import 'cinematic_experience.dart';
import 'live_visual_theme_picker.dart';

/// Account-scoped setup. Optional choices map to existing app settings.
class OnboardingFlow extends StatefulWidget {
  const OnboardingFlow({super.key, required this.appState});
  final SecureAppState appState;

  @override
  State<OnboardingFlow> createState() => _OnboardingFlowState();
}

class _OnboardingFlowState extends State<OnboardingFlow> {
  late final TextEditingController _name;
  late int _step;
  late String _appearance;
  late String _visual;
  late final String? _owner;
  late final AccountSession? _session;
  bool _busy = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    final draft = widget.appState.onboardingDraft;
    _owner = widget.appState.session?.email.trim().toLowerCase();
    _session = widget.appState.session;
    _step = (draft['step'] as int? ?? 0).clamp(0, 2);
    _name = TextEditingController(text: widget.appState.memberDisplayName);
    _appearance = draft['appearance'] as String? ?? widget.appState.appearanceMode;
    _visual = draft['visual'] as String? ?? widget.appState.visualThemeId;
  }

  @override
  void dispose() {
    _name.dispose();
    super.dispose();
  }

  Future<void> _save({int? step, bool finish = false, bool skip = false}) async {
    if (_busy || !_activeAccount) return;
    if ((_step == 1 && step == 2 || finish) && _name.text.trim().isEmpty) {
      setState(() => _error = 'Please enter a name or nickname.');
      return;
    }
    setState(() { _busy = true; _error = null; });
    try {
      await widget.appState.saveOnboardingDraft({
        'step': step ?? _step,
        'name': _name.text.trim(),
        'appearance': _appearance,
        'visual': _visual,
      });
      if (!_activeAccount) return;
      if (finish) {
        if (!skip) {
          await widget.appState.setAppearanceMode(_appearance);
          if (!_activeAccount) return;
          await widget.appState.setVisualTheme(_visual);
          if (!_activeAccount) return;
        }
        await widget.appState.completeOnboarding();
      } else {
        setState(() => _step = step ?? _step);
      }
    } catch (_) {
      if (mounted) setState(() => _error = 'Could not save your progress. Please try again.');
      if (_step == 0) rethrow;
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  bool get _activeAccount => mounted &&
      identical(widget.appState.session, _session) &&
      widget.appState.session?.email.trim().toLowerCase() == _owner;

  @override
  Widget build(BuildContext context) {
    if (_step == 0) {
      return CinematicOnboarding(onComplete: () => _save(step: 1));
    }
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (!didPop && !_busy) _save(step: _step - 1);
      },
      child: Scaffold(
        backgroundColor: Theme.of(context).colorScheme.surface,
        appBar: AppBar(
          title: const Text('MindRecipe'),
          leading: IconButton(
            tooltip: 'Back',
            onPressed: _busy ? null : () => _save(step: _step - 1),
            icon: const Icon(Icons.arrow_back),
          ),
        ),
        bottomNavigationBar: SafeArea(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(24, 8, 24, 16),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                if (_error != null)
                  Semantics(liveRegion: true, child: Text(_error!)),
                FilledButton(
                  onPressed: _busy ? null : () => _step == 1 ? _save(step: 2) : _save(finish: true),
                  child: Text(_busy ? 'Saving…' : _step == 1 ? 'Continue' : 'Save and continue'),
                ),
                if (_step == 2)
                  TextButton(
                    onPressed: _busy ? null : () => _save(finish: true, skip: true),
                    child: const Text('Skip for now'),
                  ),
              ],
            ),
          ),
        ),
        body: SafeArea(
          child: ListView(
            padding: const EdgeInsets.all(24),
            children: [
              Text('Setup $_step of 2', style: Theme.of(context).textTheme.labelLarge),
              const SizedBox(height: 16),
              Text(_step == 1 ? 'What should we call you?' : 'Make MindRecipe feel like you.',
                  style: Theme.of(context).textTheme.headlineMedium),
              const SizedBox(height: 16),
              if (_step == 1) ...[
                const Text('Your name or nickname is used on this device. Your account name stays unchanged.'),
                const SizedBox(height: 16),
                TextField(
                  controller: _name,
                  enabled: !_busy,
                  maxLength: 80,
                  textCapitalization: TextCapitalization.words,
                  decoration: const InputDecoration(labelText: 'Name or nickname'),
                ),
              ] else ...[
                const Text('These optional preferences apply on this device. You can change them in Settings.'),
                const SizedBox(height: 16),
                const Text('Appearance'),
                Wrap(spacing: 8, children: [
                  for (final mode in const {'system': 'System', 'light': 'Light', 'dark': 'Dark'}.entries)
                    ChoiceChip(
                      label: Text(mode.value),
                      selected: _appearance == mode.key,
                      onSelected: _busy ? null : (_) => setState(() => _appearance = mode.key),
                    ),
                ]),
                const SizedBox(height: 16),
                IgnorePointer(
                  ignoring: _busy,
                  child: LiveVisualThemePicker(
                    description: 'Choose a MindRecipe visual theme. Save and continue applies your choices; Skip for now keeps your current settings.',
                    selectedThemeId: _visual,
                    onSelected: (theme) => setState(() => _visual = theme.id),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
