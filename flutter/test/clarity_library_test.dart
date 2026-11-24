import 'dart:async';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mind_recipe/app_services.dart';
import 'package:mind_recipe/clarity_library.dart';
import 'package:mind_recipe/clarity_store.dart';

class _DelayedApi extends MindRecipeApiClient {
  final pending = Completer<Map<String, dynamic>>();
  @override
  Future<Map<String, dynamic>> getCurriculumProgress({required String token}) =>
      pending.future;
  @override
  Future<Map<String, dynamic>> putCurriculumProgress({
    required String token,
    required Map<String, dynamic> progress,
  }) => pending.future;
  @override
  Future<List<Map<String, dynamic>>> fetchRecipePractice({
    required String token,
  }) async => throw Exception('offline');
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  test('offline completion, imported lessons and private notes stay with their member', () async {
    FlutterSecureStorage.setMockInitialValues({
      'mind_recipe_generated_lessons': '[{"id":"saved-1","title":"Saved"}]',
      'mind_recipe_lesson_reflections': '{"lesson-1":"Previous reflection"}',
      'mind_recipe_curriculum_progress':
          '{"completed_practice_ids":["grounding"]}',
    });
    final api = _DelayedApi();
    ClarityLibrary member(String email) => ClarityLibrary(
      ClarityStore(email),
      api,
      AccountSession(token: email, email: email, displayName: 'Member'),
    );
    final first = member('a@example.invalid');
    final refresh = first.refresh();
    expect((await first.update('loadLibrary', {}))['legacyAvailable'], true);
    await first.update('importLibrary', {});
    await first.update('saveReflection', {'id': 'lesson-2', 'text': 'Private'});
    await first.update('completeLesson', {
      'id': 'lesson-1',
      'next': 'lesson-2',
    });
    first.close();
    await first.flush();
    final second = await member('b@example.invalid').update('loadLibrary', {});
    expect(second['legacyAvailable'], false);
    expect(second['reflections'], isNull);
    expect(second['saved'], isNull);
    expect(second['progress'], isNull);
    api.pending.completeError(Exception('offline'));
    await refresh;
    final restored = await member('a@example.invalid')
        .update('loadLibrary', {});
    expect(restored['saved'][0]['id'], 'saved-1');
    expect(restored['reflections'], {
      'lesson-1': 'Previous reflection',
      'lesson-2': 'Private',
    });
    expect(restored['progress']['completed_practice_ids'], ['grounding']);
    expect(restored['progress']['completed_lesson_ids'], ['lesson-1']);
    expect(restored['needsSync'], true);
  });
}
