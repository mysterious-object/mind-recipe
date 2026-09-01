import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:package_info_plus/package_info_plus.dart';

import 'visual_theme.dart';

const mindRecipeApiBase = String.fromEnvironment(
  'MIND_RECIPE_API_BASE',
  defaultValue: 'https://staging-api.mindrecipe.142.93.201.156.sslip.io',
);

class AccountSession {
  const AccountSession({
    required this.token,
    required this.displayName,
    required this.email,
  });
  final String token;
  final String displayName;
  final String email;
}

class MindRecipeApiClient {
  MindRecipeApiClient({http.Client? client})
    : _client = client ?? http.Client();
  final http.Client _client;

  Future<AccountSession> register({
    required String name,
    required String email,
    required String password,
  }) => _authenticate('/v1/auth/register', {
    'display_name': name,
    'email': email,
    'password': password,
  });

  Future<AccountSession> login({
    required String email,
    required String password,
  }) => _authenticate('/v1/auth/login', {'email': email, 'password': password});

  /// Requests a password reset. Returns the reset token in staging so the
  /// member can finish the flow in-app; production delivers it by email.
  Future<String?> requestPasswordReset({required String email}) async {
    final response = await _client
        .post(
          Uri.parse('$mindRecipeApiBase/v1/auth/reset/request'),
          headers: const {'content-type': 'application/json'},
          body: jsonEncode({'email': email}),
        )
        .timeout(const Duration(seconds: 12));
    if (response.statusCode != 200) return null;
    final decoded = jsonDecode(response.body) as Map<String, dynamic>;
    return decoded['reset_token']?.toString();
  }

  /// Confirms a password reset and returns the fresh session.
  Future<AccountSession> confirmPasswordReset({
    required String email,
    required String token,
    required String newPassword,
  }) => _authenticate('/v1/auth/reset/confirm', {
    'email': email,
    'token': token,
    'new_password': newPassword,
  });

  /// Confirms that a restored credential still represents a real account.
  /// Mobile secure storage can survive an app reinstall (iOS Keychain) or be
  /// restored from backup (Android), so merely finding a token is not enough
  /// to bypass the account gateway.
  Future<AccountSession?> restoreSession(AccountSession stored) async {
    if (stored.token.trim().isEmpty) return null;
    try {
      final response = await _client
          .get(
            Uri.parse('$mindRecipeApiBase/v1/auth/me'),
            headers: {'authorization': 'Bearer ${stored.token}'},
          )
          .timeout(const Duration(seconds: 8));
      if (response.statusCode != 200) return null;
      final user = jsonDecode(response.body) as Map<String, dynamic>;
      return AccountSession(
        token: stored.token,
        displayName: user['display_name']?.toString() ?? stored.displayName,
        email: user['email']?.toString() ?? stored.email,
      );
    } catch (_) {
      // Fail closed: an unverifiable saved credential must not silently open
      // the member area. The person can sign in again from the gateway.
      return null;
    }
  }

  Future<AccountSession> _authenticate(
    String path,
    Map<String, String> body,
  ) async {
    final response = await _client
        .post(
          Uri.parse('$mindRecipeApiBase$path'),
          headers: const {'content-type': 'application/json'},
          body: jsonEncode(body),
        )
        .timeout(const Duration(seconds: 12));
    Map<String, dynamic> decoded;
    try {
      decoded = jsonDecode(response.body) as Map<String, dynamic>;
    } on FormatException {
      throw const ApiException(
        'The account service returned an invalid response.',
      );
    }
    if (response.statusCode < 200 || response.statusCode >= 300) {
      final detail = decoded['detail'];
      final message = detail is String
          ? detail
          : response.statusCode == 422
          ? 'Check the highlighted account fields and try again.'
          : 'Unable to continue.';
      throw ApiException(message);
    }
    final user = decoded['user'] as Map<String, dynamic>;
    return AccountSession(
      token: decoded['access_token'] as String,
      displayName: user['display_name'] as String,
      email: user['email'] as String,
    );
  }

  Map<String, String> _memberHeaders(String token, {bool json = false}) => {
    if (json) 'content-type': 'application/json',
    if (token.isNotEmpty) 'authorization': 'Bearer $token',
    if (token.isEmpty) 'x-mind-recipe-user': 'local-device-member',
    'x-mind-recipe-role': 'member',
  };

  Future<bool> aiAvailable() async {
    try {
      final response = await _client
          .get(Uri.parse('$mindRecipeApiBase/v1/assistant/status'))
          .timeout(const Duration(seconds: 4));
      if (response.statusCode != 200) return false;
      return (jsonDecode(response.body) as Map<String, dynamic>)['available'] ==
          true;
    } catch (_) {
      return false;
    }
  }

  Future<List<Map<String, dynamic>>> openRouterModels({
    required String providerKey,
  }) async {
    final response = await _client
        .get(
          Uri.parse('$mindRecipeApiBase/v1/providers/openrouter/models'),
          headers: {
            if (providerKey.isNotEmpty)
              'x-mind-recipe-provider-key': providerKey,
          },
        )
        .timeout(const Duration(seconds: 10));
    if (response.statusCode != 200) return const [];
    final decoded = jsonDecode(response.body) as Map<String, dynamic>;
    if (decoded['available'] != true || decoded['models'] is! List) {
      return const [];
    }
    return (decoded['models'] as List)
        .whereType<Map>()
        .map((value) => value.cast<String, dynamic>())
        .toList();
  }

  Future<AiReply> reflect({
    required String token,
    required String providerKey,
    required String text,
    required Map<String, dynamic> context,
    bool externalResearchOptIn = false,
    String? model,
  }) async {
    final response = await _client
        .post(
          Uri.parse('$mindRecipeApiBase/v1/assistant/respond'),
          headers: {
            'content-type': 'application/json',
            if (token.isNotEmpty) 'authorization': 'Bearer $token',
            if (providerKey.isNotEmpty)
              'x-mind-recipe-provider-key': providerKey,
          },
          body: jsonEncode({
            'text': text,
            'provider': 'openrouter',
            'privacy_mode': 'cloud_byok',
            'cloud_opt_in': true,
            'external_research_opt_in': externalResearchOptIn,
            if (model != null && model.isNotEmpty) 'model': model,
            'context': context,
          }),
        )
        .timeout(const Duration(seconds: 30));
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw const ApiException('Navigator is temporarily unavailable.');
    }
    final decoded = jsonDecode(response.body) as Map<String, dynamic>;
    return AiReply(
      mode: decoded['mode'] as String,
      message: decoded['message'] as String,
      provider: decoded['provider']?.toString(),
      model: decoded['model']?.toString(),
    );
  }

  Stream<NavigatorStreamEvent> navigatorTurn({
    required String token,
    required String providerKey,
    required String text,
    required Map<String, dynamic> context,
    required String model,
    bool externalResearchOptIn = false,
  }) async* {
    final request =
        http.Request('POST', Uri.parse('$mindRecipeApiBase/v1/navigator/turn'))
          ..headers.addAll({
            'content-type': 'application/json',
            'accept': 'text/event-stream',
            if (token.isNotEmpty) 'authorization': 'Bearer $token',
            if (providerKey.isNotEmpty)
              'x-mind-recipe-provider-key': providerKey,
          })
          ..body = jsonEncode({
            'text': text,
            'provider': 'openrouter',
            'privacy_mode': 'cloud_byok',
            'cloud_opt_in': true,
            'external_research_opt_in': externalResearchOptIn,
            'model': model,
            'context': context,
          });
    final response = await _client
        .send(request)
        .timeout(const Duration(seconds: 20));
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw const ApiException('Navigator is temporarily unavailable.');
    }
    var event = '';
    var data = '';
    await for (final line
        in response.stream
            .transform(utf8.decoder)
            .transform(const LineSplitter())) {
      if (line.startsWith('event:')) {
        event = line.substring(6).trim();
      } else if (line.startsWith('data:')) {
        data = line.substring(5).trim();
      } else if (line.isEmpty && event.isNotEmpty) {
        Map<String, dynamic> payload = const {};
        try {
          final decoded = jsonDecode(data);
          if (decoded is Map<String, dynamic>) payload = decoded;
        } catch (_) {}
        yield NavigatorStreamEvent(event, payload);
        event = '';
        data = '';
      }
    }
  }

  Future<void> createCheckIn({
    required String token,
    required String clientId,
    required List<String> emotions,
    required int activation,
    required List<String> bodyAreas,
    String? journal,
    String? zoneLabel,
  }) async {
    final response = await _client
        .post(
          Uri.parse('$mindRecipeApiBase/v1/checkins'),
          headers: _memberHeaders(token, json: true),
          body: jsonEncode({
            'client_id': clientId,
            'emotions': emotions,
            'activation': activation,
            'body_areas': bodyAreas,
            if (journal != null && journal.trim().isNotEmpty)
              'journal': journal,
            if (zoneLabel != null && zoneLabel.trim().isNotEmpty)
              'zone_label': zoneLabel,
            'observations': const [],
          }),
        )
        .timeout(const Duration(seconds: 12));
    if (response.statusCode != 201) {
      throw const ApiException('Could not sync this navigation yet.');
    }
  }

  Future<Map<String, dynamic>> getTrends({required String token}) async {
    final response = await _client
        .get(
          Uri.parse('$mindRecipeApiBase/v1/trends'),
          headers: _memberHeaders(token),
        )
        .timeout(const Duration(seconds: 5));
    if (response.statusCode != 200) return {};
    return jsonDecode(response.body) as Map<String, dynamic>;
  }

  Future<List<dynamic>> detectPatterns({required String token}) async {
    final response = await _client
        .get(
          Uri.parse('$mindRecipeApiBase/v1/patterns'),
          headers: _memberHeaders(token),
        )
        .timeout(const Duration(seconds: 5));
    if (response.statusCode != 200) return [];
    return jsonDecode(response.body) as List<dynamic>;
  }

  Future<List<dynamic>> fetchConsents(String token) async {
    final r = await _client
        .get(
          Uri.parse('$mindRecipeApiBase/v1/consents'),
          headers: _memberHeaders(token),
        )
        .timeout(const Duration(seconds: 5));
    if (r.statusCode != 200) return [];
    return (jsonDecode(r.body) as List<dynamic>);
  }

  Future<List<dynamic>> fetchAudit(String token) async {
    final r = await _client
        .get(
          Uri.parse('$mindRecipeApiBase/v1/audit?limit=20'),
          headers: _memberHeaders(token),
        )
        .timeout(const Duration(seconds: 5));
    if (r.statusCode != 200) return [];
    return (jsonDecode(r.body) as List<dynamic>);
  }

  Future<void> grantConsent({
    required String token,
    required String practitionerId,
  }) async {
    final now = DateTime.now().toUtc().toIso8601String();
    final exp = DateTime.now()
        .add(const Duration(days: 30))
        .toUtc()
        .toIso8601String();
    await _client
        .post(
          Uri.parse('$mindRecipeApiBase/v1/consents'),
          headers: _memberHeaders(token, json: true),
          body: jsonEncode({
            'recipient_practitioner_id': practitionerId,
            'categories': ['checkins', 'trends'],
            'purpose': 'Wellness coordination',
            'starts_at': now,
            'expires_at': exp,
          }),
        )
        .timeout(const Duration(seconds: 5));
  }

  Future<void> revokeConsent({
    required String token,
    required String grantId,
  }) async {
    final response = await _client
        .delete(
          Uri.parse('$mindRecipeApiBase/v1/consents/$grantId'),
          headers: _memberHeaders(token),
        )
        .timeout(const Duration(seconds: 8));
    if (response.statusCode != 204) {
      throw const ApiException('Could not revoke that sharing permission.');
    }
  }

  Future<List<Map<String, dynamic>>> fetchRecipePractice({
    required String token,
  }) async {
    final response = await _client
        .get(
          Uri.parse('$mindRecipeApiBase/v1/recipes/practices'),
          headers: _memberHeaders(token),
        )
        .timeout(const Duration(seconds: 8));
    if (response.statusCode != 200) {
      throw const ApiException('Could not load your saved practices.');
    }
    return (jsonDecode(response.body) as List<dynamic>)
        .cast<Map<String, dynamic>>();
  }

  Future<Map<String, dynamic>> createRecipePracticeItem({
    required String token,
    required String name,
    required String description,
    required String category,
    required String source,
  }) async {
    final response = await _client
        .post(
          Uri.parse('$mindRecipeApiBase/v1/recipes/practices'),
          headers: _memberHeaders(token, json: true),
          body: jsonEncode({
            'name': name,
            'description': description,
            'category': category,
            'source': source,
          }),
        )
        .timeout(const Duration(seconds: 8));
    if (response.statusCode != 201) {
      throw const ApiException('Could not save that practice.');
    }
    return jsonDecode(response.body) as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> createAiRecipePracticeItem({
    required String token,
    required String description,
    required String providerKey,
  }) async {
    final response = await _client
        .post(
          Uri.parse('$mindRecipeApiBase/v1/recipes/practices/ai-create'),
          headers: {
            ..._memberHeaders(token, json: true),
            if (providerKey.isNotEmpty)
              'x-mind-recipe-provider-key': providerKey,
          },
          body: jsonEncode({'description': description}),
        )
        .timeout(const Duration(seconds: 30));

    if (response.statusCode != 200) {
      throw Exception('Failed to create AI recipe practice: ${response.body}');
    }
    return jsonDecode(response.body) as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> setRecipePracticeFavorite({
    required String token,
    required String itemId,
    required bool favorite,
  }) async {
    final response = await _client
        .patch(
          Uri.parse('$mindRecipeApiBase/v1/recipes/practices/$itemId/favorite'),
          headers: _memberHeaders(token, json: true),
          body: jsonEncode({'favorite': favorite}),
        )
        .timeout(const Duration(seconds: 8));
    if (response.statusCode != 200) {
      throw const ApiException('Could not update that favorite.');
    }
    return jsonDecode(response.body) as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> recordRecipePracticePractice({
    required String token,
    required String itemId,
    required int effectiveness,
    required String context,
    int? beforeActivation,
    int? afterActivation,
    int? outcomeConfidence,
  }) async {
    final response = await _client
        .post(
          Uri.parse('$mindRecipeApiBase/v1/recipes/practices/$itemId/practice'),
          headers: _memberHeaders(token, json: true),
          body: jsonEncode({
            'tool_id': itemId,
            'client_id':
                'practice-${itemId}-${DateTime.now().microsecondsSinceEpoch}',
            'effectiveness': effectiveness,
            if (context.isNotEmpty) 'context': context,
            if (beforeActivation != null) 'before_activation': beforeActivation,
            if (afterActivation != null) 'after_activation': afterActivation,
            if (outcomeConfidence != null)
              'outcome_confidence': outcomeConfidence,
          }),
        )
        .timeout(const Duration(seconds: 8));
    if (response.statusCode != 200) {
      throw const ApiException('Could not save that practice record.');
    }
    return jsonDecode(response.body) as Map<String, dynamic>;
  }

  Future<void> deleteRecipePracticeItem({
    required String token,
    required String itemId,
  }) async {
    final response = await _client
        .delete(
          Uri.parse('$mindRecipeApiBase/v1/recipes/practices/$itemId'),
          headers: _memberHeaders(token),
        )
        .timeout(const Duration(seconds: 8));
    if (response.statusCode != 204) {
      throw const ApiException('Could not remove that practice.');
    }
  }

  Future<Map<String, dynamic>> getCurriculumProgress({
    required String token,
  }) async {
    final response = await _client
        .get(
          Uri.parse('$mindRecipeApiBase/v1/recipes/progress'),
          headers: _memberHeaders(token),
        )
        .timeout(const Duration(seconds: 8));
    if (response.statusCode != 200)
      throw const ApiException('Could not sync recipe progress.');
    return jsonDecode(response.body) as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> putCurriculumProgress({
    required String token,
    required Map<String, dynamic> progress,
  }) async {
    final response = await _client
        .put(
          Uri.parse('$mindRecipeApiBase/v1/recipes/progress'),
          headers: _memberHeaders(token, json: true),
          body: jsonEncode(progress),
        )
        .timeout(const Duration(seconds: 8));
    if (response.statusCode != 200)
      throw const ApiException('Could not sync recipe progress.');
    return jsonDecode(response.body) as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> synthesizeVoice(
    String text, {
    double speed = 1.0,
    String voice = 'navigator_companion',
  }) async {
    final response = await _client
        .post(
          Uri.parse('$mindRecipeApiBase/v1/voice/synthesize'),
          headers: const {'content-type': 'application/json'},
          body: jsonEncode({'text': text, 'speed': speed, 'voice': voice}),
        )
        .timeout(const Duration(seconds: 35));
    if (response.statusCode != 200) {
      throw const ApiException('Navigator voice is temporarily unavailable.');
    }
    final decoded = jsonDecode(response.body) as Map<String, dynamic>;
    if (decoded['success'] != true) {
      throw ApiException(
        decoded['error']?.toString() ??
            'Navigator voice is temporarily unavailable.',
      );
    }
    return decoded;
  }

  Future<Map<String, dynamic>> getJourney(String token) async =>
      _getMember('/v1/journey', token);

  Future<Map<String, dynamic>> saveJourney(
    String token,
    Map<String, dynamic> value,
  ) => _sendMember('PUT', '/v1/journey', token, value);

  Future<List<Map<String, dynamic>>> getRecipeProposals(String token) async {
    final response = await _client
        .get(
          Uri.parse('$mindRecipeApiBase/v1/recipes/proposals'),
          headers: _memberHeaders(token),
        )
        .timeout(const Duration(seconds: 8));
    if (response.statusCode != 200)
      throw const ApiException('Could not load Recipe proposals.');
    return (jsonDecode(response.body) as List).cast<Map<String, dynamic>>();
  }

  Future<Map<String, dynamic>> decideRecipeProposal(
    String token,
    String id, {
    required bool approved,
  }) => _sendMember('POST', '/v1/recipes/proposals/$id/decision', token, {
    'approved': approved,
  });

  Future<List<Map<String, dynamic>>> getMemory(String token) async {
    final response = await _client
        .get(
          Uri.parse('$mindRecipeApiBase/v1/memory'),
          headers: _memberHeaders(token),
        )
        .timeout(const Duration(seconds: 8));
    if (response.statusCode != 200)
      throw const ApiException('Could not load Navigator memory.');
    return (jsonDecode(response.body) as List).cast<Map<String, dynamic>>();
  }

  Future<Map<String, dynamic>> createMemory(
    String token,
    Map<String, dynamic> value,
  ) => _sendMember('POST', '/v1/memory', token, value);

  Future<void> deleteMemory(String token, String id) async {
    final response = await _client
        .delete(
          Uri.parse('$mindRecipeApiBase/v1/memory/$id'),
          headers: _memberHeaders(token),
        )
        .timeout(const Duration(seconds: 8));
    if (response.statusCode != 204) {
      throw const ApiException('Could not remove that memory.');
    }
  }

  Future<List<Map<String, dynamic>>> getMemoryProposals(String token) async {
    final response = await _client
        .get(
          Uri.parse('$mindRecipeApiBase/v1/memory/proposals'),
          headers: _memberHeaders(token),
        )
        .timeout(const Duration(seconds: 8));
    if (response.statusCode != 200) {
      throw const ApiException('Could not load memory proposals.');
    }
    return (jsonDecode(response.body) as List).cast<Map<String, dynamic>>();
  }

  Future<void> decideMemoryProposal(
    String token,
    String id,
    bool approved,
  ) async {
    final response = await _client
        .post(
          Uri.parse('$mindRecipeApiBase/v1/memory/proposals/$id/decision'),
          headers: _memberHeaders(token, json: true),
          body: jsonEncode({'approved': approved}),
        )
        .timeout(const Duration(seconds: 8));
    if (response.statusCode != 200) {
      throw const ApiException('Could not save that memory decision.');
    }
  }

  Future<void> ingestMemberEvents(
    String token,
    List<Map<String, dynamic>> events,
  ) async {
    await _sendMember('POST', '/v1/member-events', token, events);
  }

  Future<Map<String, dynamic>> getPulse(String token) =>
      _getMember('/v1/pulse/today', token);

  Future<List<Map<String, dynamic>>> getEffectiveness(String token) async {
    final response = await _client
        .get(
          Uri.parse('$mindRecipeApiBase/v1/effectiveness'),
          headers: _memberHeaders(token),
        )
        .timeout(const Duration(seconds: 8));
    if (response.statusCode != 200) {
      throw const ApiException('Could not load your practice insights.');
    }
    return (jsonDecode(response.body) as List).cast<Map<String, dynamic>>();
  }

  Future<List<Map<String, dynamic>>> getPracticeRecommendations(
    String token,
  ) async {
    final response = await _client
        .get(
          Uri.parse('$mindRecipeApiBase/v1/recommendations/practices'),
          headers: _memberHeaders(token),
        )
        .timeout(const Duration(seconds: 8));
    if (response.statusCode != 200) {
      throw const ApiException('Could not load your practice suggestions.');
    }
    return (jsonDecode(response.body) as List).cast<Map<String, dynamic>>();
  }

  Future<void> savePracticeRecommendationFeedback(
    String token,
    String id,
    String decision,
  ) async {
    final response = await _client
        .post(
          Uri.parse(
            '$mindRecipeApiBase/v1/recommendations/practices/$id/feedback',
          ),
          headers: _memberHeaders(token, json: true),
          body: jsonEncode({'decision': decision}),
        )
        .timeout(const Duration(seconds: 8));
    if (response.statusCode != 204) {
      throw const ApiException('Could not save that preference.');
    }
  }

  Future<List<Map<String, dynamic>>> getCommitments(
    String token, {
    bool includeClosed = false,
  }) async {
    final response = await _client
        .get(
          Uri.parse(
            '$mindRecipeApiBase/v1/commitments?include_closed=$includeClosed',
          ),
          headers: _memberHeaders(token),
        )
        .timeout(const Duration(seconds: 8));
    if (response.statusCode != 200) {
      throw const ApiException('Could not load your commitments.');
    }
    return (jsonDecode(response.body) as List).cast<Map<String, dynamic>>();
  }

  Future<Map<String, dynamic>> createCommitment(
    String token,
    Map<String, dynamic> value,
  ) => _sendMember('POST', '/v1/commitments', token, value);

  Future<Map<String, dynamic>> updateCommitment(
    String token,
    String id,
    String status, {
    String? notes,
  }) => _sendMember('PATCH', '/v1/commitments/$id', token, {
    'status': status,
    if (notes != null && notes.trim().isNotEmpty) 'notes': notes.trim(),
  });

  Future<Map<String, dynamic>> recordCommitmentExecution(
    String token,
    String id, {
    required String action,
    required String status,
    String? receipt,
    DateTime? scheduledFor,
  }) => _sendMember('POST', '/v1/commitments/$id/execution', token, {
    'action': action,
    'status': status,
    if (receipt != null && receipt.isNotEmpty) 'receipt': receipt,
    if (scheduledFor != null)
      'scheduled_for': scheduledFor.toUtc().toIso8601String(),
  });

  Future<Map<String, dynamic>> getNotificationPreferences(String token) =>
      _getMember('/v1/notification-preferences', token);

  Future<Map<String, dynamic>> saveNotificationPreferences(
    String token,
    Map<String, dynamic> value,
  ) => _sendMember('PUT', '/v1/notification-preferences', token, value);

  Future<Map<String, dynamic>> exportAccount(String token) =>
      _getMember('/v1/account/export', token);

  Future<void> deleteAccount(String token) async {
    final response = await _client
        .delete(
          Uri.parse('$mindRecipeApiBase/v1/account'),
          headers: _memberHeaders(token, json: true),
          body: jsonEncode({'confirmation': 'DELETE'}),
        )
        .timeout(const Duration(seconds: 12));
    if (response.statusCode != 204) {
      throw const ApiException('Could not delete the account.');
    }
  }

  Future<Map<String, dynamic>> _getMember(String path, String token) async {
    final response = await _client
        .get(
          Uri.parse('$mindRecipeApiBase$path'),
          headers: _memberHeaders(token),
        )
        .timeout(const Duration(seconds: 8));
    if (response.statusCode < 200 || response.statusCode >= 300)
      throw const ApiException('Navigator is temporarily unavailable.');
    return jsonDecode(response.body) as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> _sendMember(
    String method,
    String path,
    String token,
    Object body,
  ) async {
    final request = http.Request(method, Uri.parse('$mindRecipeApiBase$path'))
      ..headers.addAll(_memberHeaders(token, json: true))
      ..body = jsonEncode(body);
    final streamed = await _client
        .send(request)
        .timeout(const Duration(seconds: 10));
    final response = await http.Response.fromStream(streamed);
    if (response.statusCode < 200 || response.statusCode >= 300)
      throw const ApiException('Navigator could not save that change.');
    return response.body.isEmpty
        ? <String, dynamic>{}
        : jsonDecode(response.body) as Map<String, dynamic>;
  }
}

class AiReply {
  const AiReply({
    required this.mode,
    required this.message,
    this.provider,
    this.model,
  });
  final String mode;
  final String message;
  final String? provider;
  final String? model;
  bool get isCloudAi => mode == 'cloud_ai';
}

class NavigatorStreamEvent {
  const NavigatorStreamEvent(this.type, this.payload);
  final String type;
  final Map<String, dynamic> payload;
}

class ApiException implements Exception {
  const ApiException(this.message);
  final String message;
  @override
  String toString() => message;
}

class SecureAppState extends ChangeNotifier {
  static const _storage = FlutterSecureStorage();
  static const _tokenKey = 'mind_recipe_session_token';
  static const _nameKey = 'mind_recipe_display_name';
  static const _emailKey = 'mind_recipe_email';
  static const _providerKey = 'mind_recipe_openrouter_key';
  static const _assistantActivityKey = 'mind_recipe_assistant_activity';
  static const _cloudAiEnabledKey = 'mind_recipe_cloud_ai_enabled';
  static const _publicResearchEnabledKey =
      'mind_recipe_public_research_enabled';
  static const _appearanceModeKey = 'mind_recipe_appearance_mode';
  static const _visualThemeKey = 'mind_recipe_visual_theme';
  static const _legacyChimeraThemeKey = 'mind_recipe_chimera_theme';
  static const _legacyChimeraVfxThemeKey = 'mind_recipe_chimera_vfx_theme';
  static const _legacyChimeraFxEnabledKey = 'mind_recipe_chimera_fx_enabled';
  static const _legacyChimeraFxIntensityKey =
      'mind_recipe_chimera_fx_intensity';
  static const _legacyChimeraFxVariantKey = 'mind_recipe_chimera_fx_variant';
  static const _curriculumProgressKey = 'mind_recipe_curriculum_progress';
  static const _cloudModelKey = 'mind_recipe_cloud_model';
  static const _pendingCheckinsKey = 'mind_recipe_pending_checkins';
  static const _sessionBuildKey = 'mind_recipe_session_build';

  AccountSession? session;
  String openRouterKey = '';
  bool loaded = false;
  bool managedAiAvailable = false;
  bool cloudAiEnabled = true;
  bool publicResearchEnabled = false;
  String selectedCloudModel = 'openrouter/auto';
  String appearanceMode = 'system';

  /// The only member-selectable visual setting.
  String visualThemeId = 'mindrecipe-core';
  String _activityDate = '';
  int _navigationSessions = 0;
  int _messagesSent = 0;
  int _aiReflections = 0;
  int _lifetimeNavigationSessions = 0;
  int _lifetimeNavigatorTurns = 0;
  int _lifetimeAiReflections = 0;
  DateTime? _lastAssistantActivityAt;

  bool get hasProviderKey => openRouterKey.trim().isNotEmpty;
  bool get aiAvailable => managedAiAvailable || hasProviderKey;
  bool get hasAssistantActivityToday =>
      navigationSessions > 0 || messagesSent > 0 || aiReflections > 0;
  int get navigationSessions =>
      _activityDate == _todayKey() ? _navigationSessions : 0;
  int get messagesSent => _activityDate == _todayKey() ? _messagesSent : 0;
  int get aiReflections => _activityDate == _todayKey() ? _aiReflections : 0;
  int get lifetimeNavigationSessions => _lifetimeNavigationSessions;
  int get lifetimeNavigatorTurns => _lifetimeNavigatorTurns;
  int get lifetimeAiReflections => _lifetimeAiReflections;
  DateTime? get lastAssistantActivityAt =>
      _activityDate == _todayKey() ? _lastAssistantActivityAt : null;

  void setManagedAiAvailable(bool value) {
    managedAiAvailable = value;
    notifyListeners();
  }

  Future<void> load() async {
    try {
      final values = await Future.wait([
        _storage.read(key: _tokenKey),
        _storage.read(key: _nameKey),
        _storage.read(key: _emailKey),
        _storage.read(key: _providerKey),
        _storage.read(key: _assistantActivityKey),
        _storage.read(key: _cloudAiEnabledKey),
        _storage.read(key: _publicResearchEnabledKey),
        _storage.read(key: _appearanceModeKey),
        _storage.read(key: _visualThemeKey),
        _storage.read(key: _legacyChimeraThemeKey),
        _storage.read(key: _legacyChimeraVfxThemeKey),
        _storage.read(key: _cloudModelKey),
        _storage.read(key: _sessionBuildKey),
      ]);
      if ((values[0] ?? '').isNotEmpty) {
        session = AccountSession(
          token: values[0]!,
          displayName: values[1] ?? 'Navigator',
          email: values[2] ?? '',
        );
      }
      // Build-scoped sessions: each new build (versionCode bump) asks for
      // login. This makes staging builds reliably show the gateway after an
      // update install (same applicationId keeps secure storage). Within the
      // same build, sessions restore normally. Tests remain safe because
      // PackageInfo may be unavailable in widget tests.
      if (session != null) {
        try {
          final info = await PackageInfo.fromPlatform();
          final currentBuild = info.buildNumber.trim();
          final storedBuild = (values[12] ?? '').trim();
          if (currentBuild.isNotEmpty && storedBuild != currentBuild) {
            session = null;
            await Future.wait([
              _storage.delete(key: _tokenKey),
              _storage.delete(key: _nameKey),
              _storage.delete(key: _emailKey),
              _storage.delete(key: _sessionBuildKey),
            ]);
          }
        } catch (_) {
          // PackageInfo unavailable in tests — keep the session.
        }
      }
      openRouterKey = values[3] ?? '';
      if ((values[4] ?? '').isNotEmpty) {
        final activity = jsonDecode(values[4]!) as Map<String, dynamic>;
        _activityDate = activity['date']?.toString() ?? '';
        _navigationSessions = activity['navigation_sessions'] as int? ?? 0;
        _messagesSent = activity['messages_sent'] as int? ?? 0;
        _aiReflections = activity['ai_reflections'] as int? ?? 0;
        _lifetimeNavigationSessions =
            activity['lifetime_navigation_sessions'] as int? ??
            _navigationSessions;
        _lifetimeNavigatorTurns =
            activity['lifetime_navigator_turns'] as int? ?? _messagesSent;
        _lifetimeAiReflections =
            activity['lifetime_ai_reflections'] as int? ?? _aiReflections;
        _lastAssistantActivityAt = DateTime.tryParse(
          activity['last_activity_at']?.toString() ?? '',
        );
      }
      cloudAiEnabled = values[5] != 'false';
      publicResearchEnabled = values[6] == 'true';
      appearanceMode = const {'system', 'light', 'dark'}.contains(values[7])
          ? values[7]!
          : 'system';
      visualThemeId = migrateVisualTheme(values[8] ?? values[10] ?? values[9]);
      selectedCloudModel = (values[11] ?? '').trim().isEmpty
          ? 'openrouter/auto'
          : values[11]!.trim();
      await _storage.write(key: _visualThemeKey, value: visualThemeId);
      for (final key in const [
        _legacyChimeraThemeKey,
        _legacyChimeraVfxThemeKey,
        _legacyChimeraFxEnabledKey,
        _legacyChimeraFxIntensityKey,
        _legacyChimeraFxVariantKey,
      ]) {
        await _storage.delete(key: key);
      }
    } catch (_) {
      // Secure storage can be unavailable in some test harnesses. The app stays fail-closed.
    }
    loaded = true;
    notifyListeners();
  }

  Future<void> recordAssistantMessage({required bool startsSession}) async {
    _rollActivityDayIfNeeded();
    if (startsSession) _navigationSessions++;
    if (startsSession) _lifetimeNavigationSessions++;
    _messagesSent++;
    _lifetimeNavigatorTurns++;
    _lastAssistantActivityAt = DateTime.now();
    notifyListeners();
    await _persistAssistantActivity();
  }

  Future<void> recordAiReflection() async {
    _rollActivityDayIfNeeded();
    _aiReflections++;
    _lifetimeAiReflections++;
    _lastAssistantActivityAt = DateTime.now();
    notifyListeners();
    await _persistAssistantActivity();
  }

  void _rollActivityDayIfNeeded() {
    final today = _todayKey();
    if (_activityDate == today) return;
    _activityDate = today;
    _navigationSessions = 0;
    _messagesSent = 0;
    _aiReflections = 0;
    _lifetimeNavigationSessions = 0;
    _lifetimeNavigatorTurns = 0;
    _lifetimeAiReflections = 0;
    _lastAssistantActivityAt = null;
  }

  Future<void> _persistAssistantActivity() async {
    try {
      await _storage.write(
        key: _assistantActivityKey,
        value: jsonEncode({
          'date': _activityDate,
          'navigation_sessions': _navigationSessions,
          'messages_sent': _messagesSent,
          'ai_reflections': _aiReflections,
          'lifetime_navigation_sessions': _lifetimeNavigationSessions,
          'lifetime_navigator_turns': _lifetimeNavigatorTurns,
          'lifetime_ai_reflections': _lifetimeAiReflections,
          'last_activity_at': _lastAssistantActivityAt?.toIso8601String(),
        }),
      );
    } catch (_) {
      // The in-memory counters remain usable if secure storage is unavailable.
    }
  }

  /// Completion is always written locally first so the curriculum remains fully
  /// usable offline. The Recipes screen sends this compact payload on the next
  /// authenticated connection; reflections deliberately never leave the device.
  Future<Map<String, dynamic>?> loadCurriculumProgress() async {
    try {
      final raw = await _storage.read(key: _curriculumProgressKey);
      if (raw == null || raw.isEmpty) return null;
      return jsonDecode(raw) as Map<String, dynamic>;
    } catch (_) {
      return null;
    }
  }

  Future<void> saveCurriculumProgress(Map<String, dynamic> progress) async {
    try {
      await _storage.write(
        key: _curriculumProgressKey,
        value: jsonEncode(progress),
      );
    } catch (_) {
      // The current session still holds the change when secure storage fails.
    }
  }

  static const _lessonReflectionsKey = 'mind_recipe_lesson_reflections';

  Future<Map<String, String>> loadLessonReflections() async {
    try {
      final raw = await _storage.read(key: _lessonReflectionsKey);
      if (raw == null || raw.isEmpty) return {};
      final decoded = jsonDecode(raw) as Map<String, dynamic>;
      return decoded.map((k, v) => MapEntry(k, v.toString()));
    } catch (_) {
      return {};
    }
  }

  Future<void> saveLessonReflection(String lessonId, String text) async {
    try {
      final all = await loadLessonReflections();
      if (text.trim().isEmpty) {
        all.remove(lessonId);
      } else {
        all[lessonId] = text.trim();
      }
      await _storage.write(key: _lessonReflectionsKey, value: jsonEncode(all));
    } catch (_) {}
  }

  static const _savedThreadsKey = 'mind_recipe_saved_threads';

  static const _moodPulsesKey = 'mind_recipe_mood_pulses';

  static const _navHistoryKey = 'mind_recipe_navigation_history';

  /// Persistent daily-navigation entries (newest first, capped at 100):
  /// {id, t, emotions, activation, body, journal, ai_reflection}.
  Future<List<Map<String, dynamic>>> loadNavigationHistory() async {
    try {
      final raw = await _storage.read(key: _navHistoryKey);
      if (raw == null || raw.isEmpty) return [];
      return (jsonDecode(raw) as List<dynamic>)
          .map((e) => e as Map<String, dynamic>)
          .toList();
    } catch (_) {
      return [];
    }
  }

  /// Inserts or replaces an entry by id, newest first.
  Future<void> saveNavigationEntry(Map<String, dynamic> entry) async {
    try {
      final all = await loadNavigationHistory();
      final id = entry['id']?.toString();
      all.removeWhere((e) => id != null && e['id'] == id);
      all.insert(0, entry);
      while (all.length > 100) {
        all.removeLast();
      }
      await _storage.write(key: _navHistoryKey, value: jsonEncode(all));
    } catch (_) {}
  }

  /// Queues an authenticated Daily Navigation for retry. The device-generated
  /// client id lets the server safely accept a retry after an interrupted
  /// network response without creating a duplicate check-in.
  Future<void> queueCheckIn(Map<String, dynamic> checkIn) async {
    if (session == null || session!.token.isEmpty) return;
    try {
      final raw = await _storage.read(key: _pendingCheckinsKey);
      final queued = raw == null || raw.isEmpty
          ? <Map<String, dynamic>>[]
          : (jsonDecode(raw) as List<dynamic>)
                .map((value) => Map<String, dynamic>.from(value as Map))
                .toList();
      final clientId = checkIn['client_id']?.toString();
      queued.removeWhere(
        (value) => clientId != null && value['client_id'] == clientId,
      );
      queued.add(Map<String, dynamic>.from(checkIn));
      await _storage.write(key: _pendingCheckinsKey, value: jsonEncode(queued));
    } catch (_) {
      // The local navigation remains available even if secure storage is
      // temporarily unavailable; a later navigation can still be synced.
    }
  }

  Future<void> flushPendingCheckIns(MindRecipeApiClient api) async {
    final activeSession = session;
    if (activeSession == null || activeSession.token.isEmpty) return;
    try {
      final raw = await _storage.read(key: _pendingCheckinsKey);
      if (raw == null || raw.isEmpty) return;
      final queued = (jsonDecode(raw) as List<dynamic>)
          .map((value) => Map<String, dynamic>.from(value as Map))
          .toList();
      var synced = 0;
      for (final item in queued) {
        try {
          await api.createCheckIn(
            token: activeSession.token,
            clientId: item['client_id']?.toString() ?? '',
            emotions: (item['emotions'] as List? ?? const [])
                .map((value) => value.toString())
                .toList(),
            activation: item['activation'] as int? ?? 0,
            bodyAreas: (item['body_areas'] as List? ?? const [])
                .map((value) => value.toString())
                .toList(),
            journal: item['journal']?.toString(),
            zoneLabel: item['zone_label']?.toString(),
          );
          synced++;
        } catch (_) {
          break;
        }
      }
      if (synced == 0) return;
      await _storage.write(
        key: _pendingCheckinsKey,
        value: jsonEncode(queued.skip(synced).toList()),
      );
    } catch (_) {
      // Retain the outbox and retry after the next authenticated app launch
      // or Daily Navigation completion.
    }
  }

  /// One-line summary of the most recent navigation, for AI grounding.
  Future<String> lastNavigationSummary() async {
    final all = await loadNavigationHistory();
    if (all.isEmpty) return '';
    final e = all.first;
    final t = DateTime.tryParse(e['t']?.toString() ?? '');
    final ago = t == null
        ? ''
        : ' · ${DateTime.now().difference(t).inHours}h ago';
    return 'Emotions: ${e['emotions']}; activation ${e['activation']}/10'
        '${(e['journal']?.toString().isNotEmpty ?? false) ? '; noted: ${e['journal']}' : ''}'
        '$ago';
  }

  /// Real-time mood ring history: [{v: -1..1 valence, a: 0..1 activation,
  /// t: ISO time, src: origin}] — kept to the most recent 300 points.
  Future<List<Map<String, dynamic>>> loadMoodPulses() async {
    try {
      final raw = await _storage.read(key: _moodPulsesKey);
      if (raw == null || raw.isEmpty) return [];
      final decoded = jsonDecode(raw) as List<dynamic>;
      return decoded.map((e) => e as Map<String, dynamic>).toList();
    } catch (_) {
      return [];
    }
  }

  Future<void> recordMoodPulse({
    required double valence,
    required double activation,
    String? source,
  }) async {
    try {
      final all = await loadMoodPulses();
      all.add({
        'v': valence.clamp(-1.0, 1.0),
        'a': activation.clamp(0.0, 1.0),
        't': DateTime.now().toIso8601String(),
        if (source != null) 'src': source,
      });
      while (all.length > 300) {
        all.removeAt(0);
      }
      await _storage.write(key: _moodPulsesKey, value: jsonEncode(all));
    } catch (_) {}
  }

  Future<List<Map<String, dynamic>>> loadSavedThreads() async {
    try {
      final raw = await _storage.read(key: _savedThreadsKey);
      if (raw == null || raw.isEmpty) return [];
      final decoded = jsonDecode(raw) as List<dynamic>;
      return decoded.map((e) => e as Map<String, dynamic>).toList();
    } catch (_) {
      return [];
    }
  }

  Future<void> saveThread(
    String title,
    List<Map<String, String>> messages,
  ) async {
    try {
      final all = await loadSavedThreads();
      all.insert(0, {
        'id': DateTime.now().millisecondsSinceEpoch.toString(),
        'title': title,
        'messages': messages,
        'saved_at': DateTime.now().toIso8601String(),
      });
      // Keep only last 20 threads
      if (all.length > 20) all.removeRange(20, all.length);
      await _storage.write(key: _savedThreadsKey, value: jsonEncode(all));
    } catch (_) {}
  }

  /// Generic raw key-value helpers used by generated lessons and other
  /// structured payloads that do not need their own accessor.
  Future<String?> readRaw(String key) async {
    try {
      return await _storage.read(key: key);
    } catch (_) {
      return null;
    }
  }

  Future<void> writeRaw(String key, String value) async {
    try {
      await _storage.write(key: key, value: value);
    } catch (_) {}
  }

  static String _todayKey() {
    final now = DateTime.now();
    return '${now.year.toString().padLeft(4, '0')}-'
        '${now.month.toString().padLeft(2, '0')}-'
        '${now.day.toString().padLeft(2, '0')}';
  }

  Future<void> setSession(AccountSession value) async {
    session = value;
    notifyListeners();
    try {
      await _storage.write(key: _tokenKey, value: value.token);
      await _storage.write(key: _nameKey, value: value.displayName);
      await _storage.write(key: _emailKey, value: value.email);
      try {
        final info = await PackageInfo.fromPlatform();
        await _storage.write(key: _sessionBuildKey, value: info.buildNumber);
      } catch (_) {}
    } catch (_) {
      // The authenticated in-memory session remains usable if platform secure
      // storage is temporarily unavailable; the user can sign in next launch.
    }
  }

  void useLocalDemo() {
    session = const AccountSession(
      token: '',
      displayName: 'Local Navigator',
      email: 'Local demo',
    );
    notifyListeners();
  }

  Future<void> saveProviderKey(String value) async {
    openRouterKey = value.trim();
    if (openRouterKey.isEmpty) {
      await _storage.delete(key: _providerKey);
    } else {
      await _storage.write(key: _providerKey, value: openRouterKey);
    }
    notifyListeners();
  }

  Future<void> setCloudAiEnabled(bool value) async {
    cloudAiEnabled = value;
    notifyListeners();
    await _storage.write(key: _cloudAiEnabledKey, value: '$value');
  }

  Future<void> setSelectedCloudModel(String value) async {
    final model = value.trim();
    if (model.isEmpty || model.length > 120) return;
    selectedCloudModel = model;
    notifyListeners();
    await _storage.write(key: _cloudModelKey, value: model);
  }

  Future<void> setPublicResearchEnabled(bool value) async {
    publicResearchEnabled = value;
    notifyListeners();
    await _storage.write(key: _publicResearchEnabledKey, value: '$value');
  }

  Future<void> setAppearanceMode(String value) async {
    if (!const {'system', 'light', 'dark'}.contains(value)) return;
    appearanceMode = value;
    notifyListeners();
    await _storage.write(key: _appearanceModeKey, value: value);
  }

  Future<void> setVisualTheme(String value) async {
    final migrated = migrateVisualTheme(value);
    visualThemeId = migrated;
    notifyListeners();
    await _storage.write(key: _visualThemeKey, value: migrated);
  }

  Future<void> signOut() async {
    session = null;
    _activityDate = '';
    _navigationSessions = 0;
    _messagesSent = 0;
    _aiReflections = 0;
    _lastAssistantActivityAt = null;
    await Future.wait([
      _storage.delete(key: _tokenKey),
      _storage.delete(key: _nameKey),
      _storage.delete(key: _emailKey),
      _storage.delete(key: _assistantActivityKey),
      _storage.delete(key: _sessionBuildKey),
    ]);
    notifyListeners();
  }

  Future<void> clearSession() async {
    session = null;
    await Future.wait([
      _storage.delete(key: _tokenKey),
      _storage.delete(key: _nameKey),
      _storage.delete(key: _emailKey),
      _storage.delete(key: _sessionBuildKey),
    ]);
    notifyListeners();
  }
}
