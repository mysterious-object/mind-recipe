import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:mind_recipe/app_services.dart';

void main() {
  test('iOS and Android account requests recover from a transient 503', () async {
    var calls = 0;
    final client = MockClient((request) async {
      calls++;
      expect(request.url.path, '/v1/auth/login');
      if (calls == 1) {
        return http.Response('no available server', 503);
      }
      return http.Response(
        jsonEncode({
          'access_token': 'test-token',
          'user': {
            'display_name': 'Victoria',
            'email': 'victoria@example.test',
          },
        }),
        200,
        headers: const {'content-type': 'application/json'},
      );
    });
    final api = MindRecipeApiClient(
      client: client,
      accountRetryDelay: Duration.zero,
    );

    final session = await api.login(
      email: 'victoria@example.test',
      password: 'a-valid-password',
    );

    expect(calls, 2);
    expect(session.displayName, 'Victoria');
    expect(session.token, 'test-token');
  });

  test('account validation errors are never retried', () async {
    var calls = 0;
    final api = MindRecipeApiClient(
      client: MockClient((request) async {
        calls++;
        return http.Response(
          jsonEncode({'detail': 'email or password is incorrect'}),
          401,
          headers: const {'content-type': 'application/json'},
        );
      }),
      accountRetryDelay: Duration.zero,
    );

    await expectLater(
      api.login(
        email: 'victoria@example.test',
        password: 'not-the-password',
      ),
      throwsA(
        isA<ApiException>().having(
          (error) => error.message,
          'message',
          'email or password is incorrect',
        ),
      ),
    );
    expect(calls, 1);
  });
}
