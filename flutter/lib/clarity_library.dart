import 'dart:async';
import 'dart:convert';

import 'app_services.dart';
import 'clarity_store.dart';

/// One serialized library per member. Only compact completion data is synced.
class ClarityLibrary {
  ClarityLibrary(this.store, this.api, this.account);
  final ClarityStore store;
  final MindRecipeApiClient api;
  final AccountSession account;
  Future<void> _pending = Future.value();
  static const _legacyKeys = {
    'saved': 'mind_recipe_generated_lessons',
    'reflections': 'mind_recipe_lesson_reflections',
    'progress': 'mind_recipe_curriculum_progress',
  };
  static const _importOwnerKey = 'mind_recipe_library_import_owner';
  String get _key => '${store.key}_library';
  Future<void> flush() => _pending;

  Future<void> _network = Future.value();
  bool _active = true;
  void close() {
    _active = false;
  }

  Future<Map<String, dynamic>> update(String action, Map payload) {
    final result = _pending.then((_) => _update(action, payload));
    _pending = result.then<void>((_) {}, onError: (Object _) {});
    return result;
  }

  Future<Map<String, dynamic>> refresh() async {
    final read = _network.then((_) async {
      if (!_active) return;
      final packet = <String, dynamic>{};
      await Future.wait([
        () async {
          try {
            packet['progress'] = await api.getCurriculumProgress(
              token: account.token,
            );
          } on Exception {
            /* Use local progress until the next connection. */
          }
        }(),
        () async {
          try {
            packet['practices'] = await api.fetchRecipePractice(
              token: account.token,
            );
            packet['practicesOffline'] = false;
          } on Exception {
            packet['practicesOffline'] = true;
          }
        }(),
      ]);
      if (!_active) return;
      final merged = await update('mergeRemote', packet);
      if (merged['needsSync'] == true && packet.containsKey('progress')) await _sendProgress();
    });
    _network = read.catchError((Object _) {});
    await read;
    return update('loadLibrary', {});
  }

  Future<void> _sendProgress() async {
    if (!_active) return;
    try {
      final latest = await api.getCurriculumProgress(token: account.token);
      if (!_active) return;
      final saved = await update('mergeRemote', {'progress': latest});
      if (saved['needsSync'] != true) return;
      final sent = saved['progress'] as Map<String, dynamic>;
      final remote = await api.putCurriculumProgress(
        token: account.token,
        progress: sent,
      );
      if (_active)
        await update('acknowledge', {'progress': remote, 'sent': sent});
    } on Exception {
      /* The durable dirty marker retries on next open. */
    }
  }

  Map<String, dynamic> _merge(Map a, Map b) {
    final localTime = DateTime.tryParse(a['updated_at']?.toString() ?? '');
    final remoteTime = DateTime.tryParse(b['updated_at']?.toString() ?? '');
    return {
      ...a.cast<String, dynamic>(),
      ...b.cast<String, dynamic>(),
      if (localTime != null &&
          (remoteTime == null || localTime.isAfter(remoteTime)))
        ...a.cast<String, dynamic>(),
      for (final key in ['completed_lesson_ids', 'completed_practice_ids'])
        key: {...?a[key] as List?, ...?b[key] as List?}.toList(),
    };
  }

  Future<Map<String, dynamic>> _update(String action, Map payload) async {
    final raw = await store.storage.read(key: _key);
    final library = raw == null
        ? <String, dynamic>{}
        : jsonDecode(raw) as Map<String, dynamic>;
    final progress = Map<String, dynamic>.from(library['progress'] ?? {});
    if (action == 'importLibrary' || action == 'loadLibrary') {
      final imported = await store.storage.read(key: _importOwnerKey);
      final available =
          imported == null &&
          !library.containsKey('importedLegacy') &&
          (await Future.wait(
            _legacyKeys.values.map(
              (key) => store.storage.containsKey(key: key),
            ),
          )).contains(true);
      library['legacyAvailable'] = available;
      if (action == 'importLibrary' && available) {
        for (final entry in _legacyKeys.entries) {
          final old = await store.storage.read(key: entry.value);
          if (old == null || old.isEmpty) continue;
          final value = jsonDecode(old);
          if (entry.key == 'progress') {
            library['progress'] = _merge(value as Map, progress);
          } else if (entry.key == 'reflections') {
            library['reflections'] = {
              ...value as Map,
              ...?library['reflections'] as Map?,
            };
          } else {
            library['saved'] = value;
          }
        }
        library['importedLegacy'] = true;
        library['legacyAvailable'] = false;
      }
      if (action == 'importLibrary' && library['progress'] != null)
        library['needsSync'] = true;
    } else if (action == 'mergeRemote' || action == 'acknowledge') {
      if (payload['progress'] is Map)
        library['progress'] = _merge(progress, payload['progress']);
      if (payload.containsKey('practices'))
        library['practices'] = payload['practices'];
      if (payload.containsKey('practicesOffline'))
        library['practicesOffline'] = payload['practicesOffline'];
      if (action == 'acknowledge' &&
          jsonEncode(progress) == jsonEncode(payload['sent'])) {
        library['needsSync'] = false;
      }
    } else if (action == 'saveReflection') {
      final notes = Map<String, dynamic>.from(library['reflections'] ?? {});
      notes[payload['id'] as String] = payload['text'] as String;
      library['reflections'] = notes;
    } else if (action == 'completeLesson') {
      library['progress'] = {
        ...progress,
        'curriculum_version': '2026.08.24',
        'completed_lesson_ids': {
          ...?progress['completed_lesson_ids'] as List?,
          payload['id'] as String,
        }.toList(),
        'completed_practice_ids': progress['completed_practice_ids'] ?? [],
        'current_lesson_id': payload['next'] as String,
        'updated_at': DateTime.now().toUtc().toIso8601String(),
      };
      library['needsSync'] = true;
    }
    if (action == 'loadLibrary') return library;
    await store.storage.write(key: _key, value: jsonEncode(library));
    if (library['importedLegacy'] == true) {
      await store.storage.write(key: _importOwnerKey, value: store.owner);
    }
    if (library['needsSync'] == true &&
        (action == 'completeLesson' || action == 'importLibrary')) {
      _network = _network
          .then((_) => _sendProgress())
          .catchError((Object _) {});
    }
    return library;
  }
}
