import 'package:flutter/material.dart';

import 'visual_theme.dart';

/// The single picker for the native palette and its locally bundled WebGL
/// environment. It deliberately has no separate effect, intensity, or
/// composition controls: choosing a card always changes the whole theme.
class LiveVisualThemePicker extends StatelessWidget {
  const LiveVisualThemePicker({
    super.key,
    required this.selectedThemeId,
    required this.onSelected,
  });

  final String selectedThemeId;
  final ValueChanged<VisualThemeDefinition> onSelected;

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    return Container(
      key: const Key('live-visual-theme-picker'),
      padding: const EdgeInsets.fromLTRB(14, 16, 14, 14),
      decoration: BoxDecoration(
        color: colors.surface.withValues(alpha: .88),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: colors.primary.withValues(alpha: .28)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: .24),
            blurRadius: 24,
            offset: const Offset(0, 12),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            'LIVE VISUAL THEMES',
            style: Theme.of(context).textTheme.labelLarge?.copyWith(
              color: colors.primary,
              fontWeight: FontWeight.w900,
              letterSpacing: 1.5,
            ),
          ),
          const SizedBox(height: 7),
          Text(
            'Choose a live MindRecipe visual theme. Changes apply immediately to the local WebGL renderer and stay on this device.',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: colors.onSurface.withValues(alpha: .74),
              height: 1.35,
            ),
          ),
          const SizedBox(height: 16),
          LayoutBuilder(
            builder: (context, constraints) {
              final columns = constraints.maxWidth >= 410 ? 2 : 1;
              return GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: visualThemes.length,
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: columns,
                  mainAxisExtent: 104,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                ),
                itemBuilder: (context, index) {
                  final theme = visualThemes[index];
                  return _VisualThemeCard(
                    theme: theme,
                    selected: selectedThemeId == theme.id,
                    onTap: () => onSelected(theme),
                  );
                },
              );
            },
          ),
        ],
      ),
    );
  }
}

class _VisualThemeCard extends StatelessWidget {
  const _VisualThemeCard({
    required this.theme,
    required this.selected,
    required this.onTap,
  });

  final VisualThemeDefinition theme;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final themeColors = Theme.of(context).colorScheme;
    final foreground = themeColors.onSurface;
    return Semantics(
      button: true,
      selected: selected,
      label: '${theme.name} visual theme',
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(20),
        child: InkWell(
          key: Key('visual-theme-${theme.id}'),
          onTap: onTap,
          borderRadius: BorderRadius.circular(20),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 180),
            curve: Curves.easeOutCubic,
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              color: theme.background.withValues(alpha: .78),
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  theme.primary.withValues(alpha: selected ? .30 : .18),
                  theme.secondary.withValues(alpha: selected ? .26 : .12),
                  theme.background.withValues(alpha: .92),
                ],
              ),
              border: Border.all(
                color: selected
                    ? theme.primary
                    : foreground.withValues(alpha: .18),
                width: selected ? 2.5 : 1,
              ),
              boxShadow: selected
                  ? [
                      BoxShadow(
                        color: theme.primary.withValues(alpha: .28),
                        blurRadius: 18,
                        spreadRadius: 1,
                      ),
                    ]
                  : null,
            ),
            child: Row(
              children: [
                Container(
                  width: 13,
                  height: 58,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(99),
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [theme.primary, theme.secondary, theme.tertiary],
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: theme.primary.withValues(alpha: .45),
                        blurRadius: 12,
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    theme.name,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      color: foreground,
                      fontWeight: FontWeight.w800,
                      height: 1.05,
                    ),
                  ),
                ),
                if (selected)
                  Container(
                    width: 28,
                    height: 28,
                    decoration: BoxDecoration(
                      color: theme.primary,
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      Icons.check_rounded,
                      size: 20,
                      color: theme.background,
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
