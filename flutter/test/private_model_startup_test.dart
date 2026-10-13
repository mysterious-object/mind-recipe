import 'dart:async';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:mind_recipe/on_device_inference.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  late Directory directory;
  setUp(() async {
    directory = await Directory.systemTemp.createTemp('mindrecipe-startup-');
    await Directory('${directory.path}/private-models').create();
  });
  tearDown(() async => directory.delete(recursive: true));

  test(
    'concurrent startup checks await the same saved model selection',
    () async {
      final gemma = mindRecipePrivateModelChoices
          .firstWhere((choice) => choice.manifest.id.contains('gemma'))
          .manifest;
      await File('${directory.path}/private-models/active-model.txt')
          .writeAsString(gemma.id);
      final restoreGate = Completer<Directory>();
      var directoryCalls = 0;
      final inference = OnDeviceInference.forTesting(
        supportDirectory: () {
          directoryCalls++;
          return directoryCalls == 1
              ? restoreGate.future
              : Future.value(directory);
        },
      );
      var firstCompleted = false;
      var secondCompleted = false;
      final first = inference.refreshStatus().then((value) {
        firstCompleted = true;
        return value;
      });
      final second = inference.refreshStatus().then((value) {
        secondCompleted = true;
        return value;
      });
      await Future<void>.delayed(Duration.zero);
      expect(firstCompleted, isFalse);
      expect(secondCompleted, isFalse);
      expect(directoryCalls, 1);
      restoreGate.complete(directory);
      final results = await Future.wait([first, second]);
      expect(inference.activeModel.id, gemma.id);
      expect(
        results.every((result) => result.status == OnDeviceStatus.notInstalled),
        isTrue,
      );
    },
  );

  test(
    'selection read failure can be retried without caching a wrong model',
    () async {
      var calls = 0;
      final inference = OnDeviceInference.forTesting(
        supportDirectory: () async {
          if (++calls == 1) {
            throw const FileSystemException('test read failure');
          }
          return directory;
        },
      );
      await expectLater(
        inference.refreshStatus(),
        throwsA(isA<FileSystemException>()),
      );
      expect(
        (await inference.refreshStatus()).status,
        OnDeviceStatus.notInstalled,
      );
    },
  );
}
