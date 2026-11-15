// Frozen serializer from 3990f706; synthetic before/after evaluation only.
enum PrivatePromptFormat { qwenChatMl, gemmaTurns }

class LocalConversationTurn {
  const LocalConversationTurn({required this.role, required this.text});

  final String role;
  final String text;
}

/// Model-specific serialization with real alternating turns, not a fabricated
/// acknowledgement. Keep the newest answers intact within a bounded budget.
/// Native tokenization adds BOS, including for Gemma; do not add a second BOS.
String mindRecipeBuildPrivatePrompt(
  String message, {
  List<LocalConversationTurn> history = const [],
  required PrivatePromptFormat format,
  bool thinking = false,
}) {
  const instruction =
      'You are Mind Nav, a private assistant. Answer the latest request directly '
      'in its requested format. Use the conversation: follow-ups refer to the '
      'latest relevant answer, and user corrections override older details. '
      'Ask only when needed. Do not invent memory or completed phone actions. '
      'Actions need approval. Never diagnose or prescribe; immediate danger '
      'needs emergency help.';
  String clean(String value) => value
      .replaceAll(
        RegExp(r'<\|[^>]*\|>|<start_of_turn>|<end_of_turn>|<bos>|<eos>'),
        '',
      )
      .trim();
  final recent = <LocalConversationTurn>[];
  var remaining = 1800;
  for (final turn in history.reversed) {
    if (turn.role != 'user' && turn.role != 'assistant') continue;
    final text = clean(turn.text);
    if (text.isEmpty) continue;
    // Do not truncate a short result/name/correction after an arbitrary 220
    // characters. Drop older whole turns first. A single oversized turn keeps
    // its beginning and end, explicitly marked as incomplete.
    if (text.length > remaining && recent.isNotEmpty) break;
    final bounded = text.length <= remaining
        ? text
        : '${text.substring(0, remaining ~/ 2)}\n[earlier turn shortened]\n${text.substring(text.length - remaining ~/ 2)}';
    recent.insert(0, LocalConversationTurn(role: turn.role, text: bounded));
    remaining -= bounded.length;
    if (remaining < 100 || recent.length == 6) break;
  }
  // Gemma expects user/model alternation; do not start with an orphan answer.
  while (recent.isNotEmpty && recent.first.role != 'user') {
    recent.removeAt(0);
  }
  final turns = <LocalConversationTurn>[];
  for (final turn in [
    ...recent,
    LocalConversationTurn(role: 'user', text: clean(message)),
  ]) {
    if (turns.isNotEmpty && turns.last.role == turn.role) {
      final previous = turns.removeLast();
      turns.add(
        LocalConversationTurn(
          role: turn.role,
          text: '${previous.text}\n\n${turn.text}',
        ),
      );
    } else {
      turns.add(turn);
    }
  }
  final prompt = StringBuffer();
  if (format == PrivatePromptFormat.gemmaTurns) {
    for (var i = 0; i < turns.length; i++) {
      final turn = turns[i];
      prompt.write(
        '<start_of_turn>${turn.role == 'assistant' ? 'model' : 'user'}\n',
      );
      if (i == 0) prompt.write('$instruction\n\n');
      prompt.write('${turn.text}<end_of_turn>\n');
    }
    prompt.write('<start_of_turn>model\n');
  } else {
    prompt.write('<|im_start|>system\n$instruction<|im_end|>\n');
    for (var i = 0; i < turns.length; i++) {
      final turn = turns[i];
      prompt.write('<|im_start|>${turn.role}\n${turn.text}');
      if (i == turns.length - 1)
        prompt.write(thinking ? '\n/think' : '\n/no_think');
      prompt.write('<|im_end|>\n');
    }
    prompt.write(mindRecipeQwenAssistantPrefix(thinking: thinking));
  }
  return prompt.toString();
}

/// Match Qwen's official enable_thinking=false generation prefix. The empty
/// block is prompt text, not generated content to show to the member.
String mindRecipeQwenAssistantPrefix({required bool thinking}) =>
    '<|im_start|>assistant\n${thinking ? '' : '<think>\n\n</think>\n\n'}';
