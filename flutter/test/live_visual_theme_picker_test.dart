import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mind_recipe/live_visual_theme_picker.dart';
import 'package:mind_recipe/visual_theme.dart';

void main() {
  testWidgets('Light theme cards never put dark text over dark preview backgrounds', (tester) async {
    final theme = ThemeData(colorScheme: ColorScheme.fromSeed(seedColor: Colors.teal));
    await tester.pumpWidget(MaterialApp(theme:theme,home:Scaffold(body:SingleChildScrollView(
      child:LiveVisualThemePicker(selectedThemeId:visualThemes.first.id,onSelected:(_){})))));
    final cards = tester.widgetList<AnimatedContainer>(find.byType(AnimatedContainer));
    for (final card in cards) {
      final decoration = card.decoration as BoxDecoration;
      final gradient = decoration.gradient as LinearGradient;
      for (final color in gradient.colors) {
        expect(color.a,1);
        final contrast = (color.computeLuminance()+.05)/(theme.colorScheme.onSurface.computeLuminance()+.05);
        expect(contrast,greaterThanOrEqualTo(4.5));
      }
    }
  });
  testWidgets('renders a selectable two-column card for every live theme', (
    tester,
  ) async {
    String selected = visualThemes.first.id;
    await tester.pumpWidget(
      MaterialApp(
        theme: ThemeData.dark(useMaterial3: true),
        home: StatefulBuilder(
          builder: (context, setState) => Scaffold(
            body: SingleChildScrollView(
              child: LiveVisualThemePicker(
                selectedThemeId: selected,
                onSelected: (theme) => setState(() => selected = theme.id),
              ),
            ),
          ),
        ),
      ),
    );

    expect(find.byKey(const Key('live-visual-theme-picker')), findsOneWidget);
    for (final theme in visualThemes) {
      expect(find.byKey(Key('visual-theme-${theme.id}')), findsOneWidget);
    }
    expect(find.byType(GridView), findsOneWidget);

    final orchid = find.byKey(const Key('visual-theme-orchid-vapor'));
    await tester.ensureVisible(orchid);
    await tester.tap(orchid);
    await tester.pumpAndSettle();
    expect(selected, 'orchid-vapor');
  });
}
