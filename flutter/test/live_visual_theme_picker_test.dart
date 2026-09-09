import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mind_recipe/live_visual_theme_picker.dart';
import 'package:mind_recipe/visual_theme.dart';

void main() {
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
