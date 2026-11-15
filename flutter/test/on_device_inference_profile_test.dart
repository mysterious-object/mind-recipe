import 'dart:convert';
import 'dart:io';

import 'package:crypto/crypto.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mind_recipe/on_device_inference.dart';

void main() {
  test('Qwen non-thinking uses the official empty thinking prefix', () {
    expect(
      mindRecipeQwenAssistantPrefix(thinking: false),
      '<|im_start|>assistant\n<think>\n\n</think>\n\n',
    );
    expect(
      mindRecipeQwenAssistantPrefix(thinking: true),
      '<|im_start|>assistant\n',
    );
  });
  test('CPU model profiles explicitly disable the GPU index', () {
    expect(mindRecipeMainGpuForLayers(0), -1);
  });

  test('GPU model profiles retain the primary device index', () {
    expect(mindRecipeMainGpuForLayers(1), 0);
    expect(mindRecipeMainGpuForLayers(99), 0);
  });

  test('logical prompt batch spans the configured context', () {
    expect(mindRecipeLogicalPromptBatch(1024), 1024);
    expect(mindRecipeLogicalPromptBatch(4096), 4096);
  });

  test('deliberation is based on the member message, not router guidance', () {
    const member =
        'I feel tense about a meeting. Help me prepare in one sentence.';
    const augmented =
        '$member\nTool guidance: Answer, plan, reflect, and remember context.';

    expect(mindRecipeShouldDeliberate(member), isFalse);
    expect(mindRecipeShouldDeliberate(augmented), isTrue);
  });

  test(
    'bounded interactive profiles preserve answer tokens at every memory size',
    () {
      expect(
        mindRecipeShouldEmitThinking(
          deliberationRequested: true,
          totalMemoryMiB: 3662,
        ),
        isFalse,
      );
      expect(
        mindRecipeShouldEmitThinking(
          deliberationRequested: true,
          totalMemoryMiB: 8192,
        ),
        isFalse,
      );
    },
  );

  test('capable-device planning uses the measured non-thinking final-answer path', () {
    for (final request in [
      'Help me plan my next hour. I have 20 minutes of email and a 30 minute report. Include a break.',
      'Test scenario: I felt anxious yesterday, but I am calm now. I have 20 minutes before a meeting. Give me a two-step plan. Do not ask questions.',
      'Help me schedule my calendar appointment.',
    ]) {
      expect(mindRecipeShouldDeliberate(request), isTrue);
      for (final memory in [6144, 8192, 12288]) {
        final thinking = mindRecipeShouldEmitThinking(
          deliberationRequested: mindRecipeShouldDeliberate(request),
          totalMemoryMiB: memory,
        );
        final prompt = mindRecipeBuildPrivatePrompt(request,
            format: PrivatePromptFormat.qwenChatMl, thinking: thinking);
        expect(thinking, isFalse, reason: 'RAM $memory is not an answer-token budget');
        expect(prompt, contains('/no_think'));
        expect(prompt, endsWith(mindRecipeQwenAssistantPrefix(thinking: false)));
      }
    }
  });

  test('complete model without a receipt is verified in place', () async {
    final directory = await Directory.systemTemp.createTemp(
      'mindrecipe-model-verify-',
    );
    addTearDown(() => directory.delete(recursive: true));
    final bytes = utf8.encode('small deterministic model fixture');
    final model = File('${directory.path}/fixture.gguf');
    await model.writeAsBytes(bytes, flush: true);
    final manifest = OnDeviceModelManifest(
      id: 'fixture',
      version: 'fixture-v1',
      downloadUri: Uri.parse('https://example.invalid/fixture.gguf'),
      sha256: sha256.convert(bytes).toString(),
      sizeBytes: bytes.length,
      license: 'test-only',
      promptFormat: PrivatePromptFormat.qwenChatMl,
    );

    expect(await mindRecipeVerifyExistingModelFile(model, manifest), isTrue);
    expect(await File('${model.path}.verified').exists(), isTrue);
    expect(await mindRecipeVerifyExistingModelFile(model, manifest), isTrue);
  });
}
