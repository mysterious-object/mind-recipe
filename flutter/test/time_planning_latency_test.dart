import 'dart:convert';
import 'dart:io';
import 'package:flutter_test/flutter_test.dart';
import 'package:mind_recipe/time_planning.dart';

void main() {
  test('record checked arithmetic cost without claiming device/model latency', () {
    final samples = <int>[];
    for (var i=1;i<=100;i++) {
      final total=i+20+10;
      final timer=Stopwatch()..start();
      final result=resolveTimePlanning(['Plan exactly $total minutes: $i minutes reading, 20 minutes writing, 10 minutes break.'])!;
      timer.stop();
      expect(result.plan!.allocated,total);
      samples.add(timer.elapsedMicroseconds);
    }
    samples.sort();
    final report={'source_commit':Platform.environment['GITHUB_SHA'],
      'kind':'typed arithmetic kernel only; excludes model startup, widget frames, OS input and display',
      'cases':100,'microseconds':{'minimum':samples.first,'median':samples[50],'maximum':samples.last},
      'neural_calls':0,'cloud_calls':0};
    Directory('build/test-evidence').createSync(recursive:true);
    File('build/test-evidence/2158-arithmetic-latency.json').writeAsStringSync(jsonEncode(report));
    print(jsonEncode(report));
  });
}
