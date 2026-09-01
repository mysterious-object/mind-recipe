import 'dart:async';

import 'package:flutter/material.dart';

import 'app_services.dart';
import 'lesson_generator.dart';
import 'on_device_inference.dart';
import 'recipe_practices.dart';

const _curriculumVersion = '2026.08.24';

class RecipeLesson {
  const RecipeLesson(
    this.id,
    this.module,
    this.number,
    this.title,
    this.summary,
    this.practice,
    this.source,
  );
  final String id;
  final int module;
  final int number;
  final String title;
  final String summary;
  final String practice;
  final String source;

  factory RecipeLesson.fromJson(Map<String, dynamic> json) => RecipeLesson(
    json['id']?.toString() ?? '',
    int.tryParse(json['module']?.toString() ?? '') ?? 4,
    int.tryParse(json['number']?.toString() ?? '') ?? 16,
    json['title']?.toString() ?? 'Untitled lesson',
    json['summary']?.toString() ?? '',
    json['practice']?.toString() ?? '',
    json['source']?.toString() ?? 'Navigator-generated',
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'module': module,
    'number': number,
    'title': title,
    'summary': summary,
    'practice': practice,
    'source': source,
  };
}

const recipeLessons = <RecipeLesson>[
  RecipeLesson(
    'lesson-1',
    1,
    1,
    'Mindfulness',
    'Notice thoughts, feelings, sensations, and surroundings without needing to fix them.',
    'Pause and name one thing you notice in your body, mind, and environment.',
    'L1 Transcript',
  ),
  RecipeLesson(
    'lesson-2',
    1,
    2,
    'Emotional Data',
    'Emotions can be useful information about needs, values, and conditions.',
    'Name the emotion, where you feel it, and one gentle need it may point toward.',
    'L2 Transcript',
  ),
  RecipeLesson(
    'lesson-3',
    1,
    3,
    'Safety & Perception',
    'A sense of safety shapes what the nervous system notices and how it responds.',
    'Orient to the room: slowly notice five neutral or supportive details.',
    'L3 Transcript',
  ),
  RecipeLesson(
    'lesson-4',
    1,
    4,
    'Baselines',
    'Patterns become clearer when you know what is typical for you.',
    'Record a simple baseline: energy, tension, focus, and connection today.',
    'L4 Transcript',
  ),
  RecipeLesson(
    'lesson-5',
    1,
    5,
    'Your Zone',
    'Your workable zone can widen through awareness, support, and pacing.',
    'Choose one small action that helps you return toward a workable zone.',
    'L5 Transcript',
  ),
  RecipeLesson(
    'lesson-6',
    2,
    6,
    'Grounding',
    'Grounding brings attention back to the present when things feel too much or too far away.',
    'Try a sensory grounding practice and keep only what feels useful.',
    'L6 Transcript',
  ),
  RecipeLesson(
    'lesson-7',
    2,
    7,
    'Current Conditions',
    'Current conditions include the body, environment, relationships, and demands around you.',
    'Map one current condition that supports you and one that adds pressure.',
    'L7 Transcript',
  ),
  RecipeLesson(
    'lesson-8',
    2,
    8,
    'Background',
    'Earlier experiences can become background influences without defining the whole person.',
    'Notice a familiar pattern with curiosity; you do not need to analyze it deeply.',
    'L8 Transcript',
  ),
  RecipeLesson(
    'lesson-9',
    2,
    9,
    'Triggers',
    'Triggers are signals that a situation has become activating, not a personal failure.',
    'Identify one early cue and one grounding choice for when it appears.',
    'L9 Transcript',
  ),
  RecipeLesson(
    'lesson-10',
    2,
    10,
    'Survival Strategies',
    'Strategies that once protected you may still show up; appreciation can come before change.',
    'Thank a protective strategy, then consider one safer present-day option.',
    'L10 Transcript',
  ),
  RecipeLesson(
    'lesson-11',
    3,
    11,
    'Vision & Values',
    'Values can offer direction when the next step is uncertain.',
    'Choose one value and one small action that expresses it this week.',
    'L11 Transcript',
  ),
  RecipeLesson(
    'lesson-12',
    3,
    12,
    'Self-Talk & Beliefs',
    'Inner language can be noticed, questioned, and made more supportive.',
    'Rewrite one harsh thought into language that is honest and kind.',
    'L12 Transcript',
  ),
  RecipeLesson(
    'lesson-13',
    3,
    13,
    'Attachment & Communication',
    'Connection patterns can be explored with curiosity, clarity, and consent.',
    'Practice a simple “I notice / I need” statement privately or with support.',
    'L13 Transcript',
  ),
  RecipeLesson(
    'lesson-14',
    3,
    14,
    'Relationships & Boundaries',
    'Boundaries clarify what supports respect, safety, and connection.',
    'Draft one brief boundary that fits your current situation.',
    'L14 Transcript',
  ),
  RecipeLesson(
    'lesson-15',
    3,
    15,
    'SMART Goals',
    'Specific, realistic goals can turn values into a next move.',
    'Make one goal specific, measurable, achievable, relevant, and time-bound.',
    'L15 Transcript',
  ),
];

class RecipesScreen extends StatefulWidget {
  const RecipesScreen({super.key, required this.api, required this.appState, this.onAskNavigator});
  final MindRecipeApiClient api;
  final SecureAppState appState;
  final void Function(String prompt, String response)? onAskNavigator;
  @override
  State<RecipesScreen> createState() => _RecipesScreenState();
}

class _RecipesScreenState extends State<RecipesScreen> {
  final _completed = <String>{};
  String _current = 'lesson-1';
  bool _loading = true;
  bool _savedPractices = false;
  List<RecipeLesson> _generated = [];
  bool _generating = false;
  String? _generateError;
  String _journeyMode = 'guided_foundations';
  List<Map<String, dynamic>> _proposals = const [];
  String? _recommendedLessonId;
  String _recommendationReason = '';
  late final LessonGenerator _generator = LessonGenerator(widget.appState);

  @override
  void initState() {
    super.initState();
    unawaited(_load());
  }

  Future<void> _load() async {
    final generated = await _generator.loadGenerated();
    if (mounted) setState(() => _generated = generated);
    final local = await widget.appState.loadCurriculumProgress();
    if (local != null) _apply(local);
    if (widget.appState.session != null) {
      try {
        final token = widget.appState.session!.token;
        final journey = await widget.api.getJourney(token);
        final proposals = await widget.api.getRecipeProposals(token);
        if (mounted) setState(() {
          _journeyMode = journey['mode']?.toString() ?? 'guided_foundations';
          _proposals = proposals;
          _recommendedLessonId = journey['recommended_module_id']?.toString();
          _recommendationReason = journey['recommendation_reason']?.toString() ?? '';
        });
        final remote = await widget.api.getCurriculumProgress(
          token: token,
        );
        _apply(_merge(local ?? _payload(), remote));
        await _persist(sync: true);
      } catch (_) {
        /* Offline is a supported state. */
      }
    }
    if (mounted) setState(() => _loading = false);
  }

  bool get _coreComplete => _completed.length >= recipeLessons.length;

  Future<void> _generateLessons() async {
    if (_generating) return;
    setState(() {
      _generating = true;
      _generateError = null;
    });
    try {
      final added = await _generator.generateBatch(count: 3);
      if (!mounted) return;
      if (added.isEmpty) {
        setState(() => _generateError =
            'Navigator needs the private model installed (or cloud AI on) to write your next lessons. Install it in Profile, then try again — your progress and reflections are already saved.');
      } else {
        final refreshed = await _generator.loadGenerated();
        setState(() {
          _generated = refreshed;
          final firstNew = added.first;
          _current = firstNew.id;
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() => _generateError = 'Could not write the next lesson right now. Try again in a moment.');
      }
    } finally {
      if (mounted) setState(() => _generating = false);
    }
  }

  Map<String, dynamic> _payload() => {
    'curriculum_version': _curriculumVersion,
    'completed_lesson_ids': _completed.toList()..sort(),
    'completed_practice_ids': <String>[],
    'current_lesson_id': _current,
    'updated_at': DateTime.now().toUtc().toIso8601String(),
  };

  Map<String, dynamic> _merge(Map<String, dynamic> a, Map<String, dynamic> b) {
    final lessons = {
      ...(a['completed_lesson_ids'] as List? ?? const []),
      ...(b['completed_lesson_ids'] as List? ?? const []),
    };
    final practices = {
      ...(a['completed_practice_ids'] as List? ?? const []),
      ...(b['completed_practice_ids'] as List? ?? const []),
    };
    final aDate =
        DateTime.tryParse(a['updated_at']?.toString() ?? '') ??
        DateTime.fromMillisecondsSinceEpoch(0);
    final bDate =
        DateTime.tryParse(b['updated_at']?.toString() ?? '') ??
        DateTime.fromMillisecondsSinceEpoch(0);
    return {
      ...(aDate.isAfter(bDate) ? a : b),
      'curriculum_version': _curriculumVersion,
      'completed_lesson_ids': lessons.toList(),
      'completed_practice_ids': practices.toList(),
    };
  }

  void _apply(Map<String, dynamic> payload) {
    _completed
      ..clear()
      ..addAll(
        (payload['completed_lesson_ids'] as List? ?? const []).map(
          (e) => e.toString(),
        ),
      );
    _current = payload['current_lesson_id']?.toString() ?? 'lesson-1';
  }

  Future<void> _persist({bool sync = false}) async {
    final payload = _payload();
    await widget.appState.saveCurriculumProgress(payload);
    if (!sync || widget.appState.session == null) return;
    try {
      final acknowledged = await widget.api.putCurriculumProgress(
        token: widget.appState.session!.token,
        progress: payload,
      );
      _apply(acknowledged);
      await widget.appState.saveCurriculumProgress(acknowledged);
    } catch (_) {
      /* Retained locally and retried next time Recipes opens. */
    }
  }

  Future<void> _complete(RecipeLesson lesson) async {
    setState(() {
      _completed.add(lesson.id);
      final allLessons = [...recipeLessons, ..._generated];
      final next = allLessons.where((item) => !_completed.contains(item.id));
      _current = next.isEmpty ? lesson.id : next.first.id;
    });
    await _persist(sync: true);
    final token = widget.appState.session?.token;
    if (token == null) return;
    try {
      final journey = await widget.api.getJourney(token);
      final recommended = journey['recommended_module_id']?.toString();
      if (!mounted) return;
      setState(() {
        _recommendedLessonId = recommended;
        _recommendationReason = journey['recommendation_reason']?.toString() ?? '';
        if (recommended != null && !_completed.contains(recommended)) {
          _current = recommended;
        }
      });
    } catch (_) {
      // Completion remains useful offline; the recommendation refreshes later.
    }
  }

  Future<void> _reviewProposal(Map<String, dynamic> proposal) async {
    final approved = await showDialog<bool>(context: context, builder: (context) => AlertDialog(
      title: Text(proposal['name']?.toString() ?? 'Custom Recipe'),
      content: Text('${proposal['purpose'] ?? 'Suggested from your journey.'}\n\nNothing is added until you approve it.'),
      actions: [
        TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Defer')),
        FilledButton(onPressed: () => Navigator.pop(context, true), child: const Text('Approve')),
      ],
    ));
    if (approved == null || widget.appState.session == null) return;
    await widget.api.decideRecipeProposal(widget.appState.session!.token, proposal['id'].toString(), approved: approved);
    if (mounted) setState(() => _proposals = _proposals.where((item) => item['id'] != proposal['id']).toList());
  }

  @override
  Widget build(BuildContext context) {
    if (_savedPractices)
      return Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(12),
            child: Align(
              alignment: Alignment.centerLeft,
              child: TextButton.icon(
                onPressed: () => setState(() => _savedPractices = false),
                icon: const Icon(Icons.menu_book),
                label: const Text('Back to journey'),
              ),
            ),
          ),
          Expanded(child: WellnessRecipePractice(appState: widget.appState)),
        ],
      );
    if (_loading) return const Center(child: CircularProgressIndicator());
    final allLessons = [...recipeLessons, ..._generated];
    final next = allLessons.firstWhere(
      (lesson) => lesson.id == _current,
      orElse: () => recipeLessons.first,
    );
    final scheme = Theme.of(context).colorScheme;
    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 18, 16, 32),
      children: [
        Row(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(14),
              child: Image.asset(
                'assets/branding/mind-recipe-mark.png',
                width: 54,
                height: 54,
                fit: BoxFit.cover,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Recipes',
                    style: Theme.of(context).textTheme.headlineMedium
                        ?.copyWith(fontWeight: FontWeight.w800),
                  ),
                  Text(
                    'Learn, practice, and move at your pace',
                    style: Theme.of(context).textTheme.bodyMedium
                        ?.copyWith(color: scheme.onSurfaceVariant),
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 18),
        Card(child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const Text('Journey mode', style: TextStyle(fontWeight: FontWeight.w800)),
            const SizedBox(height: 8),
            SegmentedButton<String>(
              segments: const [
                ButtonSegment(value: 'guided_foundations', label: Text('Guided')),
                ButtonSegment(value: 'co_created', label: Text('Co-created')),
              ],
              selected: {_journeyMode},
              onSelectionChanged: (value) async {
                final mode = value.first;
                setState(() => _journeyMode = mode);
                final token = widget.appState.session?.token;
                if (token != null) await widget.api.saveJourney(token, {'mode': mode});
              },
            ),
            const SizedBox(height: 8),
            Text(_journeyMode == 'co_created'
                ? 'Navigator may draft custom modules and Recipes. You approve every change.'
                : 'Reviewed foundations stay canonical while Navigator adapts the path.'),
          ]),
        )),
        if (_proposals.any((item) => item['status'] == 'proposed')) ...[
          const SizedBox(height: 12),
          Text('Navigator proposals', style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w800)),
          ..._proposals.where((item) => item['status'] == 'proposed').map((proposal) => Card(child: ListTile(
            title: Text(proposal['name']?.toString() ?? 'Custom Recipe'),
            subtitle: Text(proposal['purpose']?.toString() ?? 'Suggested from your journey.'),
            trailing: FilledButton(onPressed: () => _reviewProposal(proposal), child: const Text('Review')),
          ))),
        ],
        if (_recommendedLessonId != null && _recommendationReason.isNotEmpty) ...[
          const SizedBox(height: 12),
          Card(
            color: Theme.of(context).colorScheme.primaryContainer.withValues(alpha: .55),
            child: ListTile(
              leading: const Icon(Icons.route_outlined),
              title: Text(
                'Suggested next: ${allLessons.firstWhere(
                  (lesson) => lesson.id == _recommendedLessonId,
                  orElse: () => next,
                ).title}',
              ),
              subtitle: Text(_recommendationReason),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => _open(allLessons.firstWhere(
                (lesson) => lesson.id == _recommendedLessonId,
                orElse: () => next,
              )),
            ),
          ),
        ],
        _JourneyCard(
          completed: _completed.length,
          next: next,
          onContinue: () => _open(next),
        ),
        const SizedBox(height: 12),
        Card(
          color: Theme.of(context).colorScheme.secondaryContainer.withValues(alpha: 0.5),
          child: Padding(
            padding: const EdgeInsets.all(14),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(children: [
                Icon(Icons.calendar_today_rounded, size: 18, color: Theme.of(context).colorScheme.primary),
                const SizedBox(width: 8),
                const Text('Why daily?', style: TextStyle(fontWeight: FontWeight.w800)),
                const Spacer(),
                Text('${_completed.length}/15', style: Theme.of(context).textTheme.labelLarge),
              ]),
              const SizedBox(height: 6),
              const Text('One lesson a day builds the “workable zone” — small, steady practice is more effective than bingeing. Your Progress tab shows the streak and which practices you actually return to. Nothing is locked; daily is a gentle rhythm, not a rule.'),
            ]),
          ),
        ),
        const SizedBox(height: 12),
        OutlinedButton.icon(
          onPressed: () => setState(() => _savedPractices = true),
          icon: const Icon(Icons.bookmark_outline_rounded),
          label: const Text('Open saved practices'),
        ),
        const SizedBox(height: 20),
        Text(
          'Your journey',
          style: Theme.of(context).textTheme.titleLarge
              ?.copyWith(fontWeight: FontWeight.w800),
        ),
        const SizedBox(height: 4),
        Text(
          'Every lesson stays open. The recommendation simply shows a useful next step.',
          style: Theme.of(context).textTheme.bodyMedium
              ?.copyWith(color: scheme.onSurfaceVariant),
        ),
        const SizedBox(height: 12),
        for (var module = 1; module <= 3; module++)
          _ModuleCard(
            module: module,
            title: _moduleTitle(module),
            lessons: recipeLessons
                .where((item) => item.module == module)
                .toList(),
            completed: _completed,
            currentLessonId: _current,
            onLessonTap: _open,
          ),
        if (_coreComplete || _generated.isNotEmpty)
          _ModuleCard(
            module: 4,
            title: _moduleTitle(4),
            lessons: _generated,
            completed: _completed,
            currentLessonId: _current,
            onLessonTap: _open,
          ),
        if (_coreComplete) ...[
          const SizedBox(height: 8),
          Card(
            color: Theme.of(context).colorScheme.tertiaryContainer.withValues(alpha: 0.5),
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Row(children: [
                  Icon(Icons.auto_awesome_rounded, size: 18, color: Theme.of(context).colorScheme.primary),
                  const SizedBox(width: 8),
                  const Expanded(child: Text('Your path continues', style: TextStyle(fontWeight: FontWeight.w800))),
                ]),
                const SizedBox(height: 6),
                const Text('You finished all 15 core lessons. Navigator can now write new lessons shaped by your daily navigation, reflections, and completed modules — generated privately on your device.'),
                const SizedBox(height: 10),
                if (_generateError != null) ...[
                  Text(_generateError!, style: Theme.of(context).textTheme.bodySmall),
                  const SizedBox(height: 8),
                ],
                SizedBox(
                  width: double.infinity,
                  child: FilledButton.icon(
                    onPressed: _generating ? null : _generateLessons,
                    icon: _generating
                        ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2))
                        : const Icon(Icons.auto_fix_high_rounded, size: 18),
                    label: Text(_generating ? 'Writing your next lessons…' : 'Generate next lessons'),
                  ),
                ),
              ]),
            ),
          ),
        ] else if (_completed.length >= recipeLessons.length - 2) ...[
          const SizedBox(height: 8),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Text(
                'Almost there — finish the last core lessons and Navigator will start writing personalized lessons for you.',
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ),
          ),
        ],
      ],
    );
  }

  String _moduleTitle(int module) => switch (module) {
    1 => 'Foundations — Notice What Is Present',
    2 => 'Patterns — Work With the Conditions',
    3 => 'Direction — Choose and Move Forward',
    _ => 'Your Path — Navigator-Written',
  };

  Future<void> _open(RecipeLesson lesson) async {
    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      showDragHandle: true,
      backgroundColor: Theme.of(context).colorScheme.surface,
      builder: (_) => FractionallySizedBox(
        heightFactor: .92,
        child: _LessonDetail(
          lesson: lesson,
          completed: _completed.contains(lesson.id),
          onComplete: () => _complete(lesson),
          appState: widget.appState,
          onAskNavigator: widget.onAskNavigator,
        ),
      ),
    );
    if (mounted) setState(() {});
  }
}

class _JourneyCard extends StatelessWidget {
  const _JourneyCard({
    required this.completed,
    required this.next,
    required this.onContinue,
  });
  final int completed;
  final RecipeLesson next;
  final VoidCallback onContinue;
  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Card(
      color: scheme.primaryContainer.withValues(alpha: .55),
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                SizedBox(
                  width: 64,
                  height: 64,
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      CircularProgressIndicator(
                        value: completed / 15,
                        strokeWidth: 7,
                        backgroundColor: scheme.surface.withValues(alpha: .7),
                      ),
                      Text(
                        '$completed',
                        style: const TextStyle(
                          fontWeight: FontWeight.w800,
                          fontSize: 18,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '$completed of 15 complete',
                        style: Theme.of(context).textTheme.titleMedium
                            ?.copyWith(fontWeight: FontWeight.w800),
                      ),
                      const SizedBox(height: 3),
                      Text(
                        'No streaks, ranks, or locked lessons.',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Text(
              'RECOMMENDED NEXT',
              style: Theme.of(context).textTheme.labelSmall
                  ?.copyWith(letterSpacing: 1.2, fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 4),
            Text(
              'Lesson ${next.number} · ${next.title}',
              style: Theme.of(context).textTheme.titleMedium
                  ?.copyWith(fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: FilledButton.icon(
                onPressed: onContinue,
                icon: const Icon(Icons.arrow_forward_rounded),
                label: const Text('Continue journey'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ModuleCard extends StatelessWidget {
  const _ModuleCard({
    required this.module,
    required this.title,
    required this.lessons,
    required this.completed,
    required this.currentLessonId,
    required this.onLessonTap,
  });
  final int module;
  final String title;
  final List<RecipeLesson> lessons;
  final Set<String> completed;
  final String currentLessonId;
  final ValueChanged<RecipeLesson> onLessonTap;
  @override
  Widget build(BuildContext context) {
    final done = lessons
        .where((lesson) => completed.contains(lesson.id))
        .length;
    final scheme = Theme.of(context).colorScheme;
    return Card(
      margin: const EdgeInsets.only(bottom: 14),
      clipBehavior: Clip.antiAlias,
      child: ExpansionTile(
        initiallyExpanded:
            module == 1 ||
            lessons.any((lesson) => lesson.id == currentLessonId),
        tilePadding: const EdgeInsets.fromLTRB(16, 10, 12, 10),
        childrenPadding: const EdgeInsets.fromLTRB(10, 0, 10, 12),
        leading: CircleAvatar(
          backgroundColor: scheme.secondaryContainer,
          child: Text(
            '$module',
            style: TextStyle(
              color: scheme.onSecondaryContainer,
              fontWeight: FontWeight.w800,
            ),
          ),
        ),
        title: Text(
          title.split(' — ').first,
          style: const TextStyle(fontWeight: FontWeight.w800),
        ),
        subtitle: Text(
          '${title.split(' — ').last}\n$done of 5 lessons complete',
        ),
        children: [
          LinearProgressIndicator(
            value: done / 5,
            minHeight: 4,
            borderRadius: BorderRadius.circular(8),
          ),
          const SizedBox(height: 8),
          for (final lesson in lessons)
            _LessonTile(
              lesson: lesson,
              completed: completed.contains(lesson.id),
              recommended: lesson.id == currentLessonId,
              onTap: () => onLessonTap(lesson),
            ),
          if (done == 5)
            Padding(
              padding: const EdgeInsets.fromLTRB(8, 8, 8, 0),
              child: Row(
                children: [
                  Icon(Icons.auto_awesome_rounded, color: scheme.primary),
                  const SizedBox(width: 8),
                  const Expanded(
                    child: Text(
                      'Milestone reached — pause and acknowledge what you noticed.',
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}

class _LessonTile extends StatelessWidget {
  const _LessonTile({
    required this.lesson,
    required this.completed,
    required this.recommended,
    required this.onTap,
  });
  final RecipeLesson lesson;
  final bool completed;
  final bool recommended;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.only(top: 6),
      child: Material(
        color: recommended
            ? scheme.primaryContainer.withValues(alpha: .45)
            : scheme.surfaceContainerLow,
        borderRadius: BorderRadius.circular(14),
        child: ListTile(
          onTap: onTap,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
          leading: CircleAvatar(
            backgroundColor: completed
                ? scheme.primary
                : scheme.surfaceContainerHighest,
            foregroundColor: completed
                ? scheme.onPrimary
                : scheme.onSurfaceVariant,
            child: completed
                ? const Icon(Icons.check_rounded)
                : Text('${lesson.number}'),
          ),
          title: Text(
            lesson.title,
            style: const TextStyle(fontWeight: FontWeight.w700),
          ),
          subtitle: recommended
              ? const Text('Recommended next')
              : Text(
                  lesson.practice,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
          trailing: const Icon(Icons.chevron_right_rounded),
        ),
      ),
    );
  }
}

class _LessonDetail extends StatefulWidget {
  const _LessonDetail({
    required this.lesson,
    required this.completed,
    required this.onComplete,
    required this.appState,
    this.onAskNavigator,
  });
  final RecipeLesson lesson;
  final bool completed;
  final Future<void> Function() onComplete;
  final SecureAppState appState;
  final void Function(String prompt, String response)? onAskNavigator;
  @override
  State<_LessonDetail> createState() => _LessonDetailState();
}

class _LessonDetailState extends State<_LessonDetail> {
  bool reflection = false;
  late bool completed;
  bool _useAi = false;
  bool _aiLoading = false;
  String? _aiResponse;
  bool _navigatorOnline = false;
  final _practiceController = TextEditingController();
  @override
  void initState() {
    super.initState();
    completed = widget.completed;
    OnDeviceInference.snapshotNotifier.addListener(_updateOnline);
    _updateOnline();
    // Load persisted reflection for this lesson (stays on device)
    widget.appState.loadLessonReflections().then((all) {
      final saved = all[widget.lesson.id];
      if (saved != null && saved.isNotEmpty && mounted) {
        setState(() => _practiceController.text = saved);
      }
    });
  }

  void _updateOnline() {
    if (!mounted) return;
    final local = OnDeviceInference.snapshotNotifier.value.isReady;
    final cloud = widget.appState.cloudAiEnabled && widget.appState.aiAvailable;
    setState(() => _navigatorOnline = local || cloud);
  }

  @override
  void dispose() {
    OnDeviceInference.snapshotNotifier.removeListener(_updateOnline);
    // Persist reflection on dispose
    unawaited(widget.appState.saveLessonReflection(widget.lesson.id, _practiceController.text));
    _practiceController.dispose();
    super.dispose();
  }

  Future<void> _askNavigator() async {
    final prompt = _practiceController.text.trim().isEmpty
        ? 'How can I work with "${widget.lesson.title}" – ${widget.lesson.practice}'
        : 'For lesson "${widget.lesson.title}": ${widget.lesson.summary}. My reflection: ${_practiceController.text.trim()}. What is one gentle next step?';
    // Persist the reflection immediately (daily persistence)
    unawaited(widget.appState.saveLessonReflection(widget.lesson.id, _practiceController.text));
    setState(() {
      _aiLoading = true;
      _aiResponse = null;
    });
    try {
      final local = await OnDeviceInference().infer(prompt);
      final response = local ??
          'Navigator is not ready yet. Try the private model in Settings or connect cloud AI – your reflection was saved privately on device.';
      if (mounted) {
        setState(() => _aiResponse = response);
      }
      // Connect to main Navigator chat (persisted across tabs)
      if (widget.onAskNavigator != null) {
        widget.onAskNavigator!(prompt, response);
      }
    } catch (_) {
      if (mounted) {
        setState(() {
          _aiResponse = 'Could not reach Navigator right now. Your reflection stays on this device; try again later.';
        });
      }
    } finally {
      if (mounted) setState(() => _aiLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 0, 12, 10),
          child: Row(
            children: [
              Expanded(
                child: Text(
                  'Lesson ${widget.lesson.number}',
                  style: Theme.of(context).textTheme.labelLarge?.copyWith(
                    color: scheme.primary,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ),
              IconButton(
                onPressed: () => Navigator.pop(context),
                icon: const Icon(Icons.close_rounded),
                tooltip: 'Close lesson',
              ),
            ],
          ),
        ),
        Expanded(
          child: ListView(
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 28),
            children: [
              Text(
                widget.lesson.title,
                style: Theme.of(context).textTheme.headlineMedium
                    ?.copyWith(fontWeight: FontWeight.w800),
              ),
              const SizedBox(height: 18),
              _LessonSection(
                icon: Icons.explore_outlined,
                title: 'Objective',
                child: Text(widget.lesson.summary),
              ),
              const SizedBox(height: 12),
              _LessonSection(
                icon: Icons.spa_outlined,
                title: 'Practice',
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(widget.lesson.practice),
                    const SizedBox(height: 12),
                    TextField(
                      controller: _practiceController,
                      minLines: 2,
                      maxLines: 4,
                      onChanged: (v) => unawaited(widget.appState.saveLessonReflection(widget.lesson.id, v)),
                      decoration: const InputDecoration(
                        labelText: 'Your reflection (optional, stays on device)',
                        hintText: 'What came up as you tried this?',
                        border: OutlineInputBorder(),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              Card(
                child: CheckboxListTile(
                  value: reflection,
                  onChanged: (value) =>
                      setState(() => reflection = value ?? false),
                  secondary: const Icon(Icons.edit_note_rounded),
                  title: const Text('Reflection pause'),
                  subtitle: const Text(
                    'Check this when you have taken a moment to notice what came up.',
                  ),
                ),
              ),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(14),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SwitchListTile(
                        contentPadding: EdgeInsets.zero,
                        title: const Text('AI assistance (optional)'),
                        subtitle: const Text(
                          'Ask Navigator for a brief, private reflection on this lesson. On-device if installed, otherwise cloud if enabled.',
                        ),
                        secondary: const Icon(Icons.auto_awesome_outlined),
                        value: _useAi && _navigatorOnline,
                        onChanged: _navigatorOnline
                            ? (v) => setState(() => _useAi = v)
                            : null,
                      ),
                      if (!_navigatorOnline)
                        Padding(
                          padding: const EdgeInsets.only(top: 4),
                          child: Text(
                            'Navigator is offline — install the private model (Profile) or enable cloud AI to use Ask Navigator.',
                            style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Theme.of(context).colorScheme.error),
                          ),
                        ),
                      if (_useAi) ...[
                        const SizedBox(height: 8),
                        SizedBox(
                          width: double.infinity,
                          child: FilledButton.tonalIcon(
                            onPressed: _navigatorOnline && !_aiLoading ? _askNavigator : null,
                            icon: _aiLoading
                                ? const SizedBox(
                                    width: 16,
                                    height: 16,
                                    child: CircularProgressIndicator(strokeWidth: 2),
                                  )
                                : const Icon(Icons.chat_bubble_outline_rounded),
                            label: Text(_aiLoading ? 'Thinking…' : 'Ask Navigator'),
                          ),
                        ),
                        if (_aiResponse != null) ...[
                          const SizedBox(height: 12),
                          Container(
                            width: double.infinity,
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Theme.of(context).colorScheme.surfaceContainerHighest.withValues(alpha: 0.6),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(_aiResponse!),
                          ),
                        ],
                        const SizedBox(height: 4),
                        Text(
                          'AI is optional and stays on this device when the private model is ready. No journal is sent.',
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                      ],
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: FilledButton.icon(
                  onPressed: completed
                      ? null
                      : () async {
                          await widget.onComplete();
                          if (mounted) setState(() => completed = true);
                        },
                  icon: Icon(
                    completed ? Icons.check_circle_rounded : Icons.done_rounded,
                  ),
                  label: Text(
                    completed ? 'Lesson completed' : 'Mark lesson complete',
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _LessonSection extends StatelessWidget {
  const _LessonSection({
    required this.icon,
    required this.title,
    required this.child,
  });
  final IconData icon;
  final String title;
  final Widget child;
  @override
  Widget build(BuildContext context) => Card(
    child: Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon),
              const SizedBox(width: 9),
              Text(
                title,
                style: Theme.of(context).textTheme.titleMedium
                    ?.copyWith(fontWeight: FontWeight.w800),
              ),
            ],
          ),
          const SizedBox(height: 10),
          child,
        ],
      ),
    ),
  );
}
