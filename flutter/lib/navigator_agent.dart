/// Bounded, private tool routing for the on-device Mind Recipe assistant.
///
/// The router is deterministic so tool selection remains available without a
/// network connection or provider key. It supplies context to the local model;
/// it never controls the phone, opens another app, or performs an external
/// action without the member choosing that action.
class NavigatorAgentPlan {
  const NavigatorAgentPlan({
    required this.tool,
    required this.instruction,
    this.requiresResearchApproval = false,
  });

  final String tool;
  final String instruction;
  final bool requiresResearchApproval;

  String augment(String memberMessage) =>
      '''
Member message: $memberMessage

Selected Mind Recipe support: $tool
Tool guidance: $instruction
Respond to the member directly. Do not mention tool routing or internal systems.
''';
}

class NavigatorAgent {
  const NavigatorAgent();

  NavigatorAgentPlan plan(
    String message, {
    required bool externalResearchApproved,
    required int navigationSessions,
    required int messagesSent,
    required int aiReflections,
  }) {
    final text = message.toLowerCase();
    if (_contains(text, const [
      'research',
      'evidence',
      'study',
      'paper',
      'source',
    ])) {
      if (!externalResearchApproved) {
        return const NavigatorAgentPlan(
          tool: 'evidence research',
          instruction: 'No external research was performed. Briefly explain that public-source research needs the member to enable it for that request, then continue with clearly labeled general guidance.',
          requiresResearchApproval: true,
        );
      }
      return const NavigatorAgentPlan(
        tool: 'evidence research',
        instruction: 'External research was approved but is unavailable in private offline mode. State that no sources were retrieved; never invent a citation.',
      );
    }
    if (_contains(text, const ['progress', 'trend', 'pattern', 'history'])) {
      return NavigatorAgentPlan(
        tool: 'progress reflection',
        instruction:
            'Use only these device-owned activity facts: $navigationSessions navigation sessions, $messagesSent member messages, and $aiReflections AI reflections today. Do not infer a clinical trend from them.',
      );
    }
    if (_contains(text, const ['lesson', 'orientation', 'course'])) {
      return const NavigatorAgentPlan(
        tool: 'Mind Recipe lesson',
        instruction: 'Help the member choose a relevant lesson and direct them to the Mind Recipe tab. Do not claim unimported lesson content exists.',
      );
    }
    if (_contains(text, const ['book', 'booking', 'appointment', 'schedule'])) {
      return const NavigatorAgentPlan(
        tool: 'booking',
        instruction: 'Explain that the member can open the clearly labeled Booking tab. Do not choose a level of care or claim an appointment was made.',
      );
    }
    if (_contains(text, const [
      'exercise',
      'practice',
      'ground',
      'breathe',
      'tool',
      'calm',
    ])) {
      return const NavigatorAgentPlan(
        tool: 'wellness recipe',
        instruction: 'Offer one short, voluntary Mind Recipe-style practice and ask whether it feels useful. Avoid diagnosis or treatment claims.',
      );
    }
    return const NavigatorAgentPlan(
      tool: 'daily check-in',
      instruction: 'Continue a voluntary reflection with one grounded observation, one useful next step, or one genuine question.',
    );
  }

  bool _contains(String text, List<String> terms) =>
      terms.any((term) => text.contains(term));
}
