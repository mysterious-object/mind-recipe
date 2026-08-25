import 'dart:async';

import 'package:flutter/material.dart';

import 'app_services.dart';
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
  const RecipesScreen({super.key, required this.api, required this.appState});
  final MindRecipeApiClient api;
  final SecureAppState appState;
  @override
  State<RecipesScreen> createState() => _RecipesScreenState();
}

class _RecipesScreenState extends State<RecipesScreen> {
  final _completed = <String>{};
  String _current = 'lesson-1';
  bool _loading = true;
  bool _savedPractices = false;
  Map<String, dynamic>? _journey;
  List<Map<String, dynamic>> _proposals = [];

  @override
  void initState() {
    super.initState();
    unawaited(_load());
  }

  Future<void> _load() async {
    final local = await widget.appState.loadCurriculumProgress();
    if (local != null) _apply(local);
    if (widget.appState.session != null) {
      try {
        final remote = await widget.api.getCurriculumProgress(
          token: widget.appState.session!.token,
        );
        _apply(_merge(local ?? _payload(), remote));
        await _persist(sync: true);
        _journey = await widget.api.getJourney(widget.appState.session!.token);
        _proposals = await widget.api.getRecipeProposals(widget.appState.session!.token);
      } catch (_) {
        /* Offline is a supported state. */
      }
    }
    if (mounted) setState(() => _loading = false);
  }

  Future<void> _setJourneyMode(String mode) async {
    final session = widget.appState.session;
    if (session == null) return;
    setState(() => _journey = {...?_journey, 'mode': mode});
    try {
      final saved = await widget.api.saveJourney(session.token, {
        'mode': mode,
        'active_goal': _journey?['active_goal'],
        'preferred_duration_minutes': _journey?['preferred_duration_minutes'],
      });
      if (mounted) setState(() => _journey = saved);
    } catch (_) {}
  }

  Future<void> _decideProposal(String id, bool approved) async {
    final session = widget.appState.session;
    if (session == null) return;
    try {
      await widget.api.decideRecipeProposal(session.token, id, approved: approved);
      if (mounted) setState(() => _proposals = _proposals.where((item) => item['id'] != id).toList());
    } catch (_) {}
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
      final next = recipeLessons.where((item) => !_completed.contains(item.id));
      _current = next.isEmpty ? lesson.id : next.first.id;
    });
    await _persist(sync: true);
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
                onPressed: () {
                  setState(() => _savedPractices = false);
                  unawaited(_load());
                },
                icon: const Icon(Icons.menu_book),
                label: const Text('Back to journey'),
              ),
            ),
          ),
          Expanded(child: WellnessRecipePractice(appState: widget.appState)),
        ],
      );
    if (_loading) return const Center(child: CircularProgressIndicator());
    final next = recipeLessons.firstWhere(
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
        _JourneyCard(
          completed: _completed.length,
          next: next,
          onContinue: () => _open(next),
        ),
        const SizedBox(height: 12),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Journey style', style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800)),
              const SizedBox(height: 4),
              const Text('Foundations keeps reviewed lessons at the center. Co-created Journey lets Navigator draft new modules for your approval.'),
              const SizedBox(height: 12),
              SegmentedButton<String>(
                segments: const [
                  ButtonSegment(value: 'guided_foundations', label: Text('Foundations')),
                  ButtonSegment(value: 'co_created', label: Text('Co-created')),
                ],
                selected: {_journey?['mode']?.toString() ?? 'guided_foundations'},
                onSelectionChanged: (value) => _setJourneyMode(value.first),
              ),
              if ((_journey?['recommendation_reason']?.toString() ?? '').isNotEmpty) Padding(
                padding: const EdgeInsets.only(top: 12),
                child: Text(_journey!['recommendation_reason'].toString(), style: Theme.of(context).textTheme.bodySmall),
              ),
            ]),
          ),
        ),
        if (_proposals.isNotEmpty) ...[
          const SizedBox(height: 12),
          Text('Navigator proposals', style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w800)),
          const SizedBox(height: 6),
          for (final proposal in _proposals) Card(child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(proposal['name']?.toString() ?? 'Personalized Recipe', style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800)),
              const SizedBox(height: 4), Text(proposal['rationale']?.toString() ?? ''),
              const SizedBox(height: 8), Text('Why: ${proposal['evidence_basis'] ?? 'Personalized wellness support'}', style: Theme.of(context).textTheme.bodySmall),
              const SizedBox(height: 8), Wrap(spacing: 8, children: [
                FilledButton(onPressed: () => _decideProposal(proposal['id'].toString(), true), child: const Text('Add to my Recipes')),
                TextButton(onPressed: () => _decideProposal(proposal['id'].toString(), false), child: const Text('Not now')),
              ]),
            ]),
          )),
        ],
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
      ],
    );
  }

  String _moduleTitle(int module) => switch (module) {
    1 => 'Foundations — Notice What Is Present',
    2 => 'Patterns — Work With the Conditions',
    _ => 'Direction — Choose and Move Forward',
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
  });
  final RecipeLesson lesson;
  final bool completed;
  final Future<void> Function() onComplete;
  @override
  State<_LessonDetail> createState() => _LessonDetailState();
}

class _LessonDetailState extends State<_LessonDetail> {
  bool reflection = false;
  late bool completed;
  @override
  void initState() {
    super.initState();
    completed = widget.completed;
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
                child: Text(widget.lesson.practice),
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
                child: ExpansionTile(
                  leading: const Icon(Icons.article_outlined),
                  title: const Text('Full transcript'),
                  subtitle: Text('Source: ${widget.lesson.source}'),
                  children: [
                    Padding(
                      padding: const EdgeInsets.fromLTRB(16, 0, 16, 18),
                      child: Text(
                        'This lesson is grounded in the bundled ${widget.lesson.source}. Move at your own pace; grounding and support come before deeper reflection.',
                      ),
                    ),
                  ],
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
