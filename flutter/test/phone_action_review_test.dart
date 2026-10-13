import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mind_recipe/app_services.dart';
import 'package:mind_recipe/chat_actions.dart';
import 'package:mind_recipe/check_in_state.dart';
import 'package:mind_recipe/navigator_chat.dart';
import 'package:mind_recipe/on_device_inference.dart';
import 'package:mind_recipe/phone_action_review.dart';

import 'widget_test.dart' show FakeLocalInference, FakeMindRecipeApi;

class ControlledInference extends FakeLocalInference {
  final reply = Completer<String?>();
  int calls = 0;
  bool fail = false;

  @override
  LocalInferenceSnapshot get snapshot =>
      const LocalInferenceSnapshot(OnDeviceStatus.ready);

  @override
  Future<String?> infer(
    String userMessage, {
    List<LocalConversationTurn> history = const [],
    void Function(String token)? onToken,
    String? rawMemberMessage,
  }) {
    calls++;
    if (fail) throw StateError('native test failure');
    for (final token in ['First ', 'second ', 'third.']) {
      onToken?.call(token);
    }
    return reply.future;
  }
}

class InterruptedCloudApi extends FakeMindRecipeApi {
  @override
  Stream<NavigatorStreamEvent> navigatorTurn({
    required String token,
    required String providerKey,
    required String text,
    required Map<String, dynamic> context,
    required String model,
    bool externalResearchOptIn = false,
  }) async* {
    yield const NavigatorStreamEvent('accepted', {});
    yield const NavigatorStreamEvent('delta', {'text': 'Partial answer'});
    yield const NavigatorStreamEvent('error', {'code': 'rate_limited'});
  }
}

void main() {
  setUp(() => FlutterSecureStorage.setMockInitialValues({}));

  for (final scenario in [
    'private stream',
    'private short answer',
    'private failure',
    'cloud selected',
    'cloud interrupted',
  ]) {
    testWidgets(scenario, (tester) async {
      tester.view.physicalSize = const Size(1000, 1600);
      tester.view.devicePixelRatio = 1;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);
      final local = ControlledInference()..fail = scenario == 'private failure';
      final state = SecureAppState()
        ..loaded = true
        ..cloudAiEnabled = scenario.startsWith('cloud')
        ..managedAiAvailable = true;
      final messages = <ChatMessage>[];
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: NavigatorChatExperience(
              state: CheckInState(),
              onChanged: () {},
              api: scenario == 'cloud interrupted'
                  ? InterruptedCloudApi()
                  : FakeMindRecipeApi(),
              appState: state,
              messages: messages,
              localInference: local,
            ),
          ),
        ),
      );
      await tester.pump(const Duration(milliseconds: 100));
      expect(
        find.text(scenario.startsWith('cloud') ? 'CLOUD' : 'PRIVATE'),
        findsOneWidget,
      );
      expect(
        find.text(scenario.startsWith('cloud') ? 'PRIVATE' : 'CLOUD'),
        findsNothing,
      );
      await tester.enterText(
        find.byType(TextField).first,
        'Help me think about my week',
      );
      await tester.tap(find.byTooltip('Send to Navigator'));
      for (var frame = 0; frame < 8; frame++) {
        await tester.pump(const Duration(milliseconds: 100));
      }
      if (scenario == 'private stream') {
        expect(local.calls, 1);
        expect(messages.last.text, 'First second third.');
        local.reply.complete('First second third.');
        await tester.pump(const Duration(milliseconds: 200));
      } else if (scenario == 'private short answer') {
        local.reply.complete('43');
        await tester.pump(const Duration(milliseconds: 200));
        expect(messages.last.text, '43');
        expect(messages.last.localGenerated, isTrue);
        expect(messages.last.role, ChatRole.assistant);
        expect(local.calls, 1);
      } else if (scenario == 'private failure') {
        expect(local.calls, 1);
        expect(messages.last.text, contains('could not finish'));
      } else if (scenario == 'cloud interrupted') {
        expect(local.calls, 0);
        expect(messages.last.text, contains('rate-limiting'));
        expect(messages.last.role, ChatRole.status);
        expect(messages.last.cloudGenerated, isFalse);
      } else {
        expect(local.calls, 0);
        expect(messages.any((m) => m.cloudGenerated), isTrue);
      }
      final send = tester.widget<IconButton>(
        find.byWidgetPredicate(
          (widget) =>
              widget is IconButton && widget.tooltip == 'Send to Navigator',
        ),
      );
      expect(send.onPressed, isNotNull);
      await tester.pumpWidget(const SizedBox.shrink());
      await tester.pump(const Duration(seconds: 1));
    });
  }

  for (final cloudSelected in [false, true]) {
    testWidgets('action review works without a model, cloud=$cloudSelected', (
      tester,
    ) async {
      tester.view.physicalSize = const Size(1000, 1600);
      tester.view.devicePixelRatio = 1;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);
      var dispatches = 0;
      const channel = MethodChannel(
        'contextfield.mindrecipe/mobile_automation',
      );
      tester.binding.defaultBinaryMessenger.setMockMethodCallHandler(channel, (
        call,
      ) async {
        dispatches++;
        return {'success': true, 'code': 'intent_launched'};
      });
      addTearDown(
        () => tester.binding.defaultBinaryMessenger.setMockMethodCallHandler(
          channel,
          null,
        ),
      );
      final state = SecureAppState()
        ..loaded = true
        ..cloudAiEnabled = cloudSelected;
      final messages = <ChatMessage>[];
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: NavigatorChatExperience(
              state: CheckInState(),
              onChanged: () {},
              api: FakeMindRecipeApi(),
              appState: state,
              messages: messages,
              localInference: FakeLocalInference(),
            ),
          ),
        ),
      );
      await tester.pump(const Duration(milliseconds: 100));
      await tester.enterText(
        find.byType(TextField).first,
        'Create a meeting with Sarah',
      );
      await tester.tap(find.byTooltip('Send to Navigator'));
      await tester.pump(const Duration(milliseconds: 100));
      expect(find.text('Review'), findsOneWidget);
      expect(messages.where((m) => m.role == ChatRole.assistant), isEmpty);
      expect(dispatches, 0);
      await tester.tap(find.text('Review'));
      await tester.pump(const Duration(milliseconds: 300));
      expect(find.text('Choose date and time'), findsOneWidget);
      await tester.tap(find.text('Confirm'));
      await tester.pump();
      expect(find.text('Choose a date and time.'), findsOneWidget);
      expect(dispatches, 0);
      await tester.tap(find.text('Cancel'));
      await tester.pump(const Duration(milliseconds: 300));
      expect(find.text('Review'), findsOneWidget);
      expect(dispatches, 0);
      await tester.enterText(
        find.byType(TextField).first,
        'Tomorrow at 3pm for 30 minutes',
      );
      await tester.tap(find.byTooltip('Send to Navigator'));
      await tester.pump(const Duration(milliseconds: 100));
      expect(messages.where((m) => m.role == ChatRole.assistant), isEmpty);
      expect(dispatches, 0);
      await tester.tap(find.text('Review'));
      await tester.pump(const Duration(milliseconds: 300));
      expect(find.text('Choose date and time'), findsNothing);
      expect(find.text('Choose end date and time'), findsNothing);
      expect(find.widgetWithText(TextField, 'Sarah'), findsOneWidget);
      await tester.tap(find.text('Cancel'));
      await tester.pump(const Duration(milliseconds: 300));
      await tester.enterText(find.byType(TextField).first, 'Cancel that');
      await tester.tap(find.byTooltip('Send to Navigator'));
      await tester.pump(const Duration(milliseconds: 100));
      expect(find.text('Review'), findsNothing);
      expect(dispatches, 0);
      await tester.pumpWidget(const SizedBox.shrink());
      await tester.pump(const Duration(seconds: 1));
    });
  }

  testWidgets(
    'review returns edited content only after explicit confirmation',
    (tester) async {
      PhoneAction? reviewed;
      final start = DateTime.now().add(const Duration(days: 1));
      await tester.pumpWidget(
        MaterialApp(
          home: Builder(
            builder: (context) {
              return Scaffold(
                body: TextButton(
                  onPressed: () async {
                    reviewed = await reviewPhoneAction(
                      context,
                      PhoneAction(
                        type: PhoneActionType.appointment,
                        title: 'Original',
                        when: start,
                        end: start.add(const Duration(minutes: 30)),
                      ),
                    );
                  },
                  child: const Text('Open'),
                ),
              );
            },
          ),
        ),
      );
      await tester.tap(find.text('Open'));
      await tester.pumpAndSettle();
      await tester.enterText(find.byType(TextField).first, 'Corrected title');
      expect(reviewed, isNull);
      await tester.tap(find.text('Confirm'));
      await tester.pumpAndSettle();
      expect(reviewed!.title, 'Corrected title');
      expect(reviewed!.when, start);
      expect(reviewed!.end, start.add(const Duration(minutes: 30)));
    },
  );
}
