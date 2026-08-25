import 'dart:async';

import 'package:flutter/material.dart';

import 'app_services.dart';

class AdaptiveDailyNavigation extends StatefulWidget {
  const AdaptiveDailyNavigation({super.key, required this.api, required this.appState, required this.onComplete});
  final MindRecipeApiClient api;
  final SecureAppState appState;
  final VoidCallback onComplete;
  @override
  State<AdaptiveDailyNavigation> createState() => _AdaptiveDailyNavigationState();
}

class _AdaptiveDailyNavigationState extends State<AdaptiveDailyNavigation> {
  int _minutes = 3;
  String _mode = 'Guidance';
  String _prompt = 'What would make the next few minutes feel a little more workable?';
  bool _started = false;
  bool _done = false;
  final _response = TextEditingController();

  @override
  void initState() { super.initState(); unawaited(_loadJourney()); }
  @override
  void dispose() { _response.dispose(); super.dispose(); }

  Future<void> _loadJourney() async {
    final session = widget.appState.session;
    if (session == null) return;
    try {
      final journey = await widget.api.getJourney(session.token);
      final goal = journey['active_goal']?.toString();
      final duration = journey['preferred_duration_minutes'] as num?;
      if (!mounted) return;
      setState(() {
        if (duration != null) _minutes = duration.clamp(1, 15).toInt();
        if (goal != null && goal.isNotEmpty) _prompt = 'You named “$goal” as important. What feels most useful to notice right now?';
      });
    } catch (_) {}
  }

  Future<void> _complete() async {
    if (_done) return;
    setState(() => _done = true);
    final session = widget.appState.session;
    if (session != null) {
      final now = DateTime.now().toUtc();
      try {
        await widget.api.ingestMemberEvents(session.token, [{
          'id': 'navigation-${now.microsecondsSinceEpoch}', 'kind': 'daily_navigation_completed',
          'occurred_at': now.toIso8601String(), 'source': 'mobile', 'provenance': 'member',
          'payload': {'mode': _mode, 'minutes': _minutes, 'reflection': _response.text.trim().isEmpty ? null : 'recorded'},
          'consent_scope': 'device', 'schema_version': 'v1',
        }]);
      } catch (_) {}
    }
    widget.onComplete();
  }

  @override
  Widget build(BuildContext context) {
    if (_done) return Center(child: Padding(padding: const EdgeInsets.all(24), child: Column(mainAxisSize: MainAxisSize.min, children: [
      const Icon(Icons.auto_awesome_rounded, size: 64), const SizedBox(height: 16),
      Text('Navigation saved', style: Theme.of(context).textTheme.headlineSmall), const SizedBox(height: 8),
      const Text('Navigator will use this as one small signal for what to offer next. You can change or skip the next step anytime.'),
      const SizedBox(height: 18), FilledButton(onPressed: () => setState(() { _done = false; _started = false; _response.clear(); }), child: const Text('Begin another')),
    ])));
    return ListView(padding: const EdgeInsets.all(18), children: [
      Text(_started ? 'Your navigation' : 'Choose your pace', style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w900)),
      const SizedBox(height: 8),
      Text(_started ? 'You can redirect, shorten, or leave at any time.' : 'Navigator adapts from your active goal, recent Recipes, and the signals you choose to share.'),
      const SizedBox(height: 18),
      if (!_started) ...[
        Wrap(spacing: 8, runSpacing: 8, children: [1, 3, 7, 12].map((minutes) => ChoiceChip(label: Text(minutes == 1 ? '60 sec' : '$minutes min'), selected: _minutes == minutes, onSelected: (_) => setState(() => _minutes = minutes))).toList()),
        const SizedBox(height: 14),
        SegmentedButton<String>(segments: const [ButtonSegment(value: 'Guidance', label: Text('Guidance')), ButtonSegment(value: 'Talk', label: Text('Talk')), ButtonSegment(value: 'Reset', label: Text('Quick reset'))], selected: {_mode}, onSelectionChanged: (values) => setState(() => _mode = values.first)),
        const SizedBox(height: 22),
        FilledButton.icon(onPressed: () => setState(() { _started = true; if (_mode == 'Reset') _prompt = 'Name one thing you can soften for sixty seconds—your breath, shoulders, pace, or attention.'; }), icon: const Icon(Icons.play_arrow_rounded), label: Text('Begin $_minutes-minute navigation')),
      ] else ...[
        Card(child: Padding(padding: const EdgeInsets.all(18), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(_prompt, style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w700)), const SizedBox(height: 12),
          TextField(controller: _response, maxLines: 5, decoration: const InputDecoration(hintText: 'Write, speak, or skip this part.', border: OutlineInputBorder())),
          const SizedBox(height: 12), Wrap(spacing: 8, children: [TextButton(onPressed: () => setState(() => _prompt = 'What is one thing that has helped even a little before?'), child: const Text('Try another question')), TextButton(onPressed: () => _complete(), child: const Text('Skip to finish'))]),
        ]))),
        const SizedBox(height: 16),
        FilledButton(onPressed: _complete, child: const Text('Save this signal and continue')),
      ],
    ]);
  }
}
