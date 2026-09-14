import 'package:flutter_test/flutter_test.dart';
import 'package:mind_recipe/on_device_inference.dart';

void main() {
  group('private response streaming', () {
    test('never exposes a complete Qwen reasoning block', () {
      expect(
        mindRecipeVisiblePrivateStreamText(
          '<think>private chain of thought</think>\n\nHere is the answer.',
        ),
        'Here is the answer.',
      );
    });

    test('holds incomplete reasoning tags across native token boundaries', () {
      expect(mindRecipeVisiblePrivateStreamText('<thi'), isEmpty);
      expect(
        mindRecipeVisiblePrivateStreamText('<think>private reasoning</thi'),
        isEmpty,
      );
      expect(
        mindRecipeVisiblePrivateStreamText(
          '<think>private reasoning</think>\n\nVisible',
        ),
        'Visible',
      );
    });

    test('streams ordinary Gemma output unchanged', () {
      expect(
        mindRecipeVisiblePrivateStreamText('A direct, useful answer.'),
        'A direct, useful answer.',
      );
    });

    test('removes leaked chat control markers and role prefixes', () {
      expect(
        mindRecipeVisiblePrivateStreamText(
          '<|im_start|>assistant: Take one slow breath.<|im_end|>',
        ),
        'Take one slow breath.',
      );
    });
  });
}
