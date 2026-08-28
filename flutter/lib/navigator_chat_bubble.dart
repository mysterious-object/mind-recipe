import 'package:flutter/material.dart';
import 'mind_recipe_fx.dart';

/// Navigator chat bubble widget that respects hide rules.
/// Hidden when on Navigator tab, dismissed within 90s, or auto-hidden after 12s idle.
class NavigatorChatBubble extends StatelessWidget {
  const NavigatorChatBubble({
    super.key,
    required this.snippet,
    required this.isSpeaking,
    required this.isListening,
    required this.onTap,
    required this.onDismiss,
    required this.onCloseVoice,
  });
  final String? snippet;
  final bool isSpeaking;
  final bool isListening;
  final VoidCallback onTap;
  final VoidCallback onDismiss;
  final Future<void> Function() onCloseVoice;
  @override
  Widget build(BuildContext context) {
    final hasContent = snippet != null || isSpeaking || isListening;
    if (!hasContent) return const SizedBox.shrink();
    final scheme = Theme.of(context).colorScheme;
    final reduceMotion = MediaQuery.disableAnimationsOf(context);
    return AnimatedSwitcher(
      duration: reduceMotion ? Duration.zero : const Duration(milliseconds: 280),
      switchInCurve: Curves.easeOutCubic,
      switchOutCurve: Curves.easeInCubic,
      transitionBuilder: (child, anim) {
        if (reduceMotion) return child;
        return SlideTransition(
          position: Tween(begin: const Offset(0, 0.18), end: Offset.zero).animate(anim),
          child: FadeTransition(opacity: anim, child: child),
        );
      },
      child: Material(
        key: ValueKey(snippet ?? (isSpeaking ? 'speaking' : 'listening')),
        elevation: 8,
        borderRadius: BorderRadius.circular(18),
        color: scheme.primaryContainer.withValues(alpha: 0.96),
        child: InkWell(
          borderRadius: BorderRadius.circular(18),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.fromLTRB(14, 10, 10, 10),
            child: Row(
              children: [
                MindRecipeOrbBadge(size: 26, active: isSpeaking || isListening),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        isSpeaking ? 'Navigator is speaking...' : isListening ? 'Navigator is listening...' : 'Navigator replied - tap to view',
                        style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13),
                      ),
                      Text(
                        snippet != null ? (snippet!.length > 92 ? snippet!.substring(0, 92) + '...' : snippet!) : 'Tap to return to chat',
                        style: const TextStyle(fontSize: 11),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close_rounded, size: 18),
                  tooltip: 'Hide bubble',
                  onPressed: () async {
                    await onCloseVoice();
                    onDismiss();
                  },
                ),
                const Icon(Icons.chevron_right_rounded, size: 18),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

String? decideBubbleSnippet({
  required String? latestSnippet,
  required String? lastSeenSnippet,
  required DateTime? dismissedAt,
  required DateTime? bubbleShownAt,
  required DateTime now,
  required bool isNavigatorTab,
  required bool isSpeaking,
  required bool isListening,
}) {
  if (isNavigatorTab) return null;
  final isNew = latestSnippet != lastSeenSnippet;
  if (dismissedAt != null && now.difference(dismissedAt).inSeconds < 90 && !isNew) return null;
  if (!isSpeaking && !isListening && bubbleShownAt != null && now.difference(bubbleShownAt).inSeconds >= 12 && latestSnippet != null) return null;
  return latestSnippet;
}
