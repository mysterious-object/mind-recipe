import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:mind_recipe/chat_actions.dart';
import 'package:mind_recipe/phone_action_draft_store.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  setUp(() => FlutterSecureStorage.setMockInitialValues({}));
  final parser = PhoneActionParser(now: () => DateTime(2026, 10, 13, 10));
  test('follow-up completes a draft without inventing a new action', () {
    final draft = parser.parse('Create a meeting with Sarah')!;
    final revised = parser.revise(draft, 'Tomorrow at 3pm for 30 minutes')!;
    expect(revised.title, 'Sarah');
    expect(revised.when, DateTime(2026, 10, 14, 15));
    expect(revised.end, DateTime(2026, 10, 14, 15, 30));
    expect(
      parser.revise(revised, 'Call it design review')!.title,
      'design review',
    );
    expect(parser.revise(revised, 'I feel better at 3pm'), isNull);
    expect(parser.revise(revised, 'No, do not change it'), isNull);
    expect(parser.revise(revised, 'at 13pm')!.when, isNull);
    expect(parser.revise(revised, 'for 0 minutes')!.end, isNull);
    final task = parser.parse('Create a task to stretch in 20 minutes')!;
    expect(task.type, PhoneActionType.reminder);
    expect(task.title, 'stretch');
  });
  test('draft persists after store recreation and is account-scoped', () async {
    final draft = parser.parse('Remind me to stretch in 20 minutes')!;
    await PhoneActionDraftStore().save('member@example.invalid', draft);
    final restored = await PhoneActionDraftStore().load(
      'MEMBER@example.invalid',
    );
    expect(restored?.title, draft.title);
    expect(restored?.when, draft.when);
    expect(await PhoneActionDraftStore().load('other@example.invalid'), isNull);
    expect(await PhoneActionDraftStore().load(null), isNull);
    await PhoneActionDraftStore().save('member@example.invalid', null);
    expect(
      await PhoneActionDraftStore().load('member@example.invalid'),
      isNull,
    );
  });
  test('rapid cancellation cannot resurrect an earlier write', () async {
    final store = PhoneActionDraftStore();
    final draft = parser.parse('Remind me to stretch in 20 minutes')!;
    final pending = store.save('member@example.invalid', draft);
    final cleared = store.save('member@example.invalid', null);
    await Future.wait([pending, cleared]);
    expect(await store.load('member@example.invalid'), isNull);
  });
}
