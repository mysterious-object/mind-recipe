import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import 'chat_actions.dart';

/// Device-only, account-scoped draft. Restoring is never approval to execute.
class PhoneActionDraftStore {
  static const _storage = FlutterSecureStorage();
  static Future<void> _writes = Future.value();
  String? _key(String? owner) {
    final account = owner?.trim().toLowerCase() ?? '';
    return account.isEmpty
        ? null
        : 'mind_recipe_phone_draft_${base64Url.encode(utf8.encode(account))}';
  }

  Future<void> save(String? owner, PhoneAction? draft) {
    final key = _key(owner);
    if (key == null) return Future.value();
    final value = draft == null
        ? null
        : jsonEncode({
            'version': 1,
            'type': draft.type.name,
            'title': draft.title,
            'when': draft.when?.toIso8601String(),
            'end': draft.end?.toIso8601String(),
            'notes': draft.notes,
          });
    // A dismissed draft must not be resurrected by a slower earlier write.
    _writes = _writes
        .catchError((Object _) {})
        .then(
          (_) => value == null
              ? _storage.delete(key: key)
              : _storage.write(key: key, value: value),
        );
    return _writes;
  }

  Future<PhoneAction?> load(String? owner) async {
    final key = _key(owner);
    if (key == null) return null;
    await _writes.catchError((Object _) {});
    try {
      final raw = await _storage.read(key: key);
      if (raw == null) return null;
      final value = jsonDecode(raw) as Map<String, dynamic>;
      if (value['version'] != 1) return null;
      return PhoneAction(
        type: PhoneActionType.values.byName(value['type'] as String),
        title: value['title'] as String,
        when: DateTime.tryParse(value['when']?.toString() ?? ''),
        end: DateTime.tryParse(value['end']?.toString() ?? ''),
        notes: value['notes'] as String?,
      );
    } catch (_) {
      return null;
    }
  }
}
