/// Validate the reply's form, not its truth or usefulness. Short answers and
/// non-Latin languages are valid; length is not a grounding signal.
bool mindRecipeAcceptsPrivateReply(String? reply, String memberText) {
  if (reply == null || reply.trim().isEmpty) return false;
  final clean = reply.trim();
  if (RegExp(
    r'<\|(?:im_|endoftext)|<(?:start_of_turn|end_of_turn|bos|eos)>|</?think>',
    caseSensitive: false,
  ).hasMatch(clean)) {
    return false;
  }
  if (mindRecipeViolatesReplyForm(clean, memberText)) return false;
  String normalize(String text) =>
      text.trim().toLowerCase().replaceAll(RegExp(r'\s+'), ' ');
  return normalize(clean) != normalize(memberText);
}

bool mindRecipeViolatesReplyForm(String reply, String memberText) {
  final request = memberText.toLowerCase().replaceAll('’', "'");
  final rejectsQuestion = RegExp(
    r"\b(?:do not|don't|no)\s+(?:ask\s+(?:me\s+)?(?:any\s+)?|more\s+)?questions?\b",
  ).hasMatch(request);
  return rejectsQuestion && reply.trimRight().endsWith('?');
}
