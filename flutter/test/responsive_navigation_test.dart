import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mind_recipe/mind_recipe_fx.dart';

void main() {
  for (final platform in [TargetPlatform.android, TargetPlatform.iOS]) {
    for (final scale in [1.0, 1.5, 2.0]) {
      testWidgets('all four tabs fit 320dp at text $scale on $platform', (tester) async {
        tester.view.physicalSize = const Size(320, 886);
        tester.view.devicePixelRatio = 1;
        addTearDown(tester.view.resetPhysicalSize);
        addTearDown(tester.view.resetDevicePixelRatio);
        final scroll = ScrollController();
        var selected = 0;
        await tester.pumpWidget(MaterialApp(theme: ThemeData(platform: platform), home: MediaQuery(
          data: MediaQueryData(size: const Size(320,886), textScaler: TextScaler.linear(scale),
              padding: EdgeInsets.only(bottom: platform == TargetPlatform.iOS ? 34 : 0)),
          child: StatefulBuilder(builder: (context,setState) => Scaffold(bottomNavigationBar: MindRecipePageRail(
            labels: const ['Navigator','MindRecipe','Actions','Settings'],
            icons: const [Icons.chat,Icons.book,Icons.check,Icons.settings],iconAssets: const [null,null,null,null],
            selectedIndex: selected, progress: selected.toDouble(),scrollController: scroll,
            onSelected: (value) => setState(() => selected=value)))))));
        for (var i=0;i<4;i++) {
          final tab = find.bySemanticsLabel('${['Navigator','MindRecipe','Actions','Settings'][i]}, tab ${i+1} of 4');
          final rect = tester.getRect(tab);
          expect(rect.left, greaterThanOrEqualTo(0));
          expect(rect.right, lessThanOrEqualTo(320));
          expect(rect.width, greaterThanOrEqualTo(48));
          await tester.tap(tab);
          await tester.pump();
          expect(selected,i);
          expect(tester.takeException(),isNull);
        }
        await tester.pumpWidget(const SizedBox());
        scroll.dispose();
      });
    }
  }
}
