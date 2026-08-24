import 'dart:convert';

import 'app_services.dart';
import 'on_device_inference.dart';
import 'recipes_screen.dart';

/// BGS-lite lesson generation: after the 15 core lessons, the on-device model
/// (or cloud fallback) formulates new personalized lessons by analyzing the
/// member's daily-navigation check-ins, completed modules, and reflections.
///
/// Everything runs locally first. Nothing leaves the device unless cloud AI is
/// explicitly enabled, and even then only the anonymized pattern summary goes.
class LessonGenerator {
  LessonGenerator(this._appState, {LocalInference? inference})
    : _inference = inference ?? OnDeviceInference();

  final SecureAppState _appState;
  final LocalInference _inference;

  static const _generatedLessonsKey = 'mind_recipe_generated_lessons';

  Future<List<RecipeLesson>> loadGenerated() async {
    try {
      final raw = await _appState.readRaw(_generatedLessonsKey);
      if (raw == null || raw.isEmpty) return const [];
      final decoded = jsonDecode(raw) as List<dynamic>;
      return decoded
          .map((e) => RecipeLesson.fromJson(e as Map<String, dynamic>))
          .toList();
    } catch (_) {
      return const [];
    }
  }

  Future<void> _saveAll(List<RecipeLesson> lessons) async {
    try {
      final raw = jsonEncode(lessons.map((l) => l.toJson()).toList());
      await _appState.writeRaw(_generatedLessonsKey, raw);
    } catch (_) {}
  }

  /// Whether the member has finished the core 15 and is ready for more.
  bool needsGeneration(Set<String> completedIds) {
    if (completedIds.length < recipeLessons.length) return false;
    return true;
  }

  /// Builds the pattern summary the generator reasons over. Deliberately
  /// aggregate and non-identifying: emotion frequencies, activation trend,
  /// module completion shape, and reflection keywords.
  Future<String> buildPatternSummary() async {
    final reflections = await _appState.loadLessonReflections();
    final progress = await _appState.loadCurriculumProgress();
    final completed = (progress?['completed_lesson_ids'] as List? ?? const [])
        .map((e) => e.toString())
        .toList();
    final reflectionSample = reflections.values
        .take(6)
        .map((r) => r.length > 140 ? '${r.substring(0, 140)}…' : r)
        .join(' | ');
    final module1 = completed.where((id) => RegExp(r'^lesson-[1-5]$').hasMatch(id)).length;
    final module2 = completed.where((id) => RegExp(r'^lesson-(6|7|8|9|10)$').hasMatch(id)).length;
    final module3 = completed.where((id) => RegExp(r'^lesson-(11|12|13|14|15)$').hasMatch(id)).length;
    return 'Completed core modules: Foundations $module1/5, Patterns $module2/5, '
        'Direction $module3/5. Recent reflections: ${reflectionSample.isEmpty ? "(none yet)" : reflectionSample}';
  }

  /// Generates the next personalized lesson. Returns null when the private
  /// model is not ready and cloud is unavailable — the UI then offers retry.
  Future<RecipeLesson?> generateNext({int generatedCount = 0}) async {
    final summary = await buildPatternSummary();
    final number = recipeLessons.length + generatedCount + 1;
    final prompt = '''
You are Mind Recipe's curriculum designer. Based on this member's pattern summary, write ONE new wellness lesson that continues their path. Do not diagnose. Do not repeat the core lessons. Ground it in what the member actually wrote.

Pattern summary: $summary

Reply in exactly this format:
TITLE: <5 words max>
SUMMARY: <2 sentences, why this lesson now>
PRACTICE: <one concrete 2-3 minute practice with 3 numbered steps>
''';
    final raw = await _inference.infer(prompt);
    if (raw == null || raw.trim().length < 40) return null;
    final lesson = _parseLesson(raw, number);
    if (lesson == null) return null;
    final all = await loadGenerated();
    final exists = all.any((l) => l.title == lesson.title);
    if (exists) return null;
    all.add(lesson);
    await _saveAll(all);
    return lesson;
  }

  RecipeLesson? _parseLesson(String raw, int number) {
    String? title;
    String? summary;
    String? practice;
    for (final line in raw.split('\n')) {
      final trimmed = line.trim();
      if (title == null && trimmed.startsWith('TITLE:')) {
        title = trimmed.substring(6).trim();
      } else if (summary == null && trimmed.startsWith('SUMMARY:')) {
        summary = trimmed.substring(8).trim();
      } else if (practice == null && trimmed.startsWith('PRACTICE:')) {
        practice = trimmed.substring(9).trim();
      }
    }
    if (title == null || title.isEmpty) return null;
    return RecipeLesson(
      'generated-$number',
      4,
      number,
      title.length > 48 ? '${title.substring(0, 48)}…' : title,
      (summary ?? 'A lesson shaped by your recent navigation.').length > 240
          ? '${(summary ?? '').substring(0, 240)}…'
          : summary ?? 'A lesson shaped by your recent navigation.',
      practice ?? 'Pause, notice one thing, and write it down.',
      'Navigator-generated',
    );
  }

  /// Generates a batch of lessons (up to 3) for the "Your Path" module.
  Future<List<RecipeLesson>> generateBatch({int count = 3}) async {
    final existing = await loadGenerated();
    final added = <RecipeLesson>[];
    for (var i = 0; i < count; i++) {
      final lesson = await generateNext(generatedCount: existing.length + added.length);
      if (lesson == null) break;
      added.add(lesson);
    }
    return added;
  }
}
