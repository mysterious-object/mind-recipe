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
    'low-memory profiles preserve answer tokens instead of emitting thought',
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
        isTrue,
      );
    },
  );

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
