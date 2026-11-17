import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mind_recipe/clarity_store.dart';

class FailingStorage extends FlutterSecureStorage {
  @override
  Future<void> write({
    required String key,
    required String? value,
    IOSOptions? iOptions,
    AndroidOptions? aOptions,
    LinuxOptions? lOptions,
    WebOptions? webOptions,
    MacOsOptions? mOptions,
    WindowsOptions? wOptions,
  }) async => throw StateError('Disk unavailable');
}

Map<String, dynamic> snapshot(String note) => {
  'version': 1,
  'profile': {'name': 'Test'},
  'history': [
    {'journalEntry': note},
  ],
  'draft': {},
};

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  setUp(() => FlutterSecureStorage.setMockInitialValues({}));
  test(
    'account isolation, canonical email, and ordered writes survive reload',
    () async {
      final first = ClarityStore(' First@Example.com ');
      final second = ClarityStore('second@example.com');
      final writes = [
        first.save(snapshot('early')),
        first.save(snapshot('latest')),
        second.save(snapshot('other')),
      ];
      await Future.wait(writes);
      expect(
        (await ClarityStore('first@example.com')
            .load())!['history'][0]['journalEntry'],
        'latest',
      );
      expect((await second.load())!['history'][0]['journalEntry'], 'other');
      expect(await ClarityStore('third@example.com').load(), isNull);
    },
  );
  test(
    'write failures reach the UI instead of reporting a successful save',
    () async {
      await expectLater(
        ClarityStore(
          'test@example.com',
          storage: FailingStorage(),
        ).save(snapshot('private')),
        throwsStateError,
      );
    },
  );
  test('migration reads only records owned by the captured account', () async {
    FlutterSecureStorage.setMockInitialValues({
      'mind_recipe_navigation_history': jsonEncode([
        {'id': 'mine', 'member_owner': 'test@example.com'},
        {'id': 'other', 'member_owner': 'other@example.com'},
        {'id': 'unowned'},
      ]),
    });
    final entries = await ClarityStore('Test@example.com').loadLegacyHistory();
    expect(entries.map((entry) => entry['id']), ['mine']);
  });
  test('migration preserves journals and distinguishes zero activation from missing', () {
    final history = migrateClarityHistory([
      {
        'id': 'one',
        't': '2026-11-16T00:00:00Z',
        'emotions': 'Calm, Hopeful',
        'activation_reported': true,
        'activation': -5,
        'journal': 'My words',
        'body': 'Shoulders',
      },
      {
        'id': 'two',
        't': '2026-11-15T00:00:00Z',
        'activation_reported': false,
        'activation': 0,
      },
    ]);
    expect(history.first['activation'], 0);
    expect(history.first['emotions'], ['Calm', 'Hopeful']);
    expect(history.first['journalEntry'], 'My words\n\nBody: Shoulders');
    expect(history.last.containsKey('activation'), false);
  });
}
