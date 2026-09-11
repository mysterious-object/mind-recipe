import 'package:flutter_test/flutter_test.dart';
import 'package:mind_recipe/on_device_inference.dart';

void main() {
  test('CPU model profiles explicitly disable the GPU index', () {
    expect(mindRecipeMainGpuForLayers(0), -1);
  });

  test('GPU model profiles retain the primary device index', () {
    expect(mindRecipeMainGpuForLayers(1), 0);
    expect(mindRecipeMainGpuForLayers(99), 0);
  });
}
