import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Account-scoped local storage. Failures are surfaced to the interface so a
/// journal is never reported as saved when the platform rejected the write.
class ClarityStore {
  ClarityStore(String email, {FlutterSecureStorage? storage})
    : storage = storage ?? const FlutterSecureStorage(),
      owner = email.trim().toLowerCase(),
      key =
          'mind_recipe_clarity_v1_${base64Url.encode(utf8.encode(email.trim().toLowerCase()))}';
  final FlutterSecureStorage storage;
  final String key;
  final String owner;
  Future<void> _writes = Future.value();

  Future<Map<String, dynamic>?> load() async {
    final raw = await storage.read(key: key);
    if (raw == null) return null;
    final value = jsonDecode(raw);
    if (value is! Map<String, dynamic> || value['version'] != 1) {
      throw const FormatException(
        'This saved journal needs a newer app version.',
      );
    }
    return value;
  }

  Future<void> save(Map<String, dynamic> value) {
    if (value['version'] != 1 ||
        value['profile'] is! Map ||
        value['history'] is! List ||
        value['draft'] is! Map) {
      return Future.error(const FormatException('Invalid journal data.'));
    }
    final raw = jsonEncode(value);
    final write = _writes
        .catchError((Object _) {})
        .then((_) => storage.write(key: key, value: raw));
    _writes = write;
    return write;
  }

  Future<void> flush() => _writes;

  Future<List<Map<String, dynamic>>> loadLegacyHistory() async {
    final raw = await storage.read(key: 'mind_recipe_navigation_history');
    if (raw == null || raw.isEmpty) return [];
    return (jsonDecode(raw) as List)
        .map((entry) => Map<String, dynamic>.from(entry as Map))
        .where((entry) => entry['member_owner'] == owner)
        .toList();
  }
}

/// Preserve the account's earlier check-ins without fabricating unreported
/// activation. Original body descriptions remain readable in the journal.
List<Map<String, dynamic>> migrateClarityHistory(
  List<Map<String, dynamic>> entries,
) => [
  for (final entry in entries)
    if (DateTime.tryParse(entry['t']?.toString() ?? '') != null)
      {
        'id': entry['id']?.toString() ?? 'legacy-${entry['t']}',
        'timestamp': entry['t'],
        'emotions':
            entry['emotions'] is String && entry['emotions'] != 'Not recorded'
            ? (entry['emotions'] as String)
                  .split(', ')
                  .where((value) => value.isNotEmpty)
                  .toList()
            : <String>[],
        if (entry['activation_reported'] == true && entry['activation'] is num)
          'activation': ((entry['activation'] as num) + 5).clamp(0, 10),
        'bodyZones': <String>[],
        'lifeDomains': <String>[],
        'journalEntry': [
          if ((entry['journal']?.toString() ?? '').isNotEmpty) entry['journal'],
          if ((entry['body']?.toString() ?? '').isNotEmpty)
            'Body: ${entry['body']}',
        ].join('\n\n'),
      },
];
