import 'package:flutter_test/flutter_test.dart';
import 'package:mind_recipe/private_reply_policy.dart';

void main() {
  for (final reply in ['43', '0', '-8', 'Yes.', 'No.', 'Oui', '你好', '😊']) {
    test('a concise answer is not rejected by length: $reply', () {
      expect(
        mindRecipeAcceptsPrivateReply(
          reply,
          'Answer my question with only the requested number or word.',
        ),
        isTrue,
      );
    });
  }
  test('reject empty output, prompt tokens, echo and prohibited question', () {
    for (final reply in [
      null,
      '',
      '   ',
      '<|im_start|>assistant',
      '<start_of_turn>model',
      '<think>hidden</think>',
    ]) {
      expect(mindRecipeAcceptsPrivateReply(reply, 'Hello'), isFalse);
    }
    expect(mindRecipeAcceptsPrivateReply('  HELLO  ', 'Hello'), isFalse);
    expect(
      mindRecipeAcceptsPrivateReply('Why?', 'Do not ask me questions'),
      isFalse,
    );
    expect(
      mindRecipeAcceptsPrivateReply(
        'Try one small step.',
        'Do not ask me questions',
      ),
      isTrue,
    );
  });
}
