/// Bounded, private tool routing for the on-device MindRecipe assistant.
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

  /// Saved check-ins are optional evidence, not the conversation's speaker.
  /// Include them when explicitly requested. Personal planning can use the
  /// member's current message/history without attaching an old mood report.
  String relevantMemberContext(String message, String context) {
    final requestsBackground = RegExp(
      r'\b(?:my (?:energy|check.in|mood|progress|history)|based on what i (?:said|told|reported)|how (?:have|was|am) i)\b',
      caseSensitive: false,
    ).hasMatch(message);
    return tool == 'progress reflection' || requestsBackground
        ? context
        : '';
  }

  String augment(String memberMessage, {String context = ''}) {
    // Avoid spending the mobile prompt budget on generic routing prose.
    // Preserve the actual latest request as the final part of the user turn.
    final guidance = tool == 'open conversation' ? '' : instruction;
    return [
      if (guidance.isNotEmpty) guidance,
      if (context.trim().isNotEmpty) 'Member context: ${context.trim()}',
      memberMessage,
    ].join('\n\n');
  }
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
    bool intent(String pattern) => RegExp(pattern, caseSensitive: false).hasMatch(message);
    // General AGI assistance (phone features, tasks) is distinct from
    // therapeutic support — route it practically, not clinically.
    if (intent(r'\b(?:remind me|wake me|set (?:an? |the )?(?:alarm|reminder|timer)|(?:add|put|save|move|reschedule|cancel).{0,35}(?:calendar|appointment)|book (?:me |an? |the )?(?:appointment|meeting)|schedule (?:an? |the )?appointment)\b')) {
      return const NavigatorAgentPlan(
        tool: 'phone assistance',
        instruction: 'This is a practical phone task. Ask only for missing task details. The app handles action drafts and confirmation; do not claim a draft, booking or phone action was created or executed unless an actual tool result confirms it. Avoid unrelated emotional framing.',
      );
    }
    if (intent(r'\b(?:research|find (?:a |some )?(?:studies|papers|sources)|(?:show|give|cite|share).{0,20}(?:evidence|sources|references)|evidence (?:for|that|about)|studies (?:on|about))\b')) {
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
    if (intent(r'\bmy (?:progress|trends?|patterns?|history|activity|check.ins?)\b')) {
      return NavigatorAgentPlan(
        tool: 'progress reflection',
        instruction:
            'Use only these device-owned activity facts: $navigationSessions navigation sessions, $messagesSent member messages, and $aiReflections AI reflections today. Do not infer a clinical trend from them.',
      );
    }
    if (intent(r'\b(?:show|find|open|start|choose|recommend|take|learn).{0,30}\b(?:lesson|course|orientation)\b')) {
      return const NavigatorAgentPlan(
        tool: 'MindRecipe lesson',
        instruction: 'Help the member choose a relevant lesson and direct them to the MindRecipe tab. Do not claim unimported lesson content exists.',
      );
    }
    // Choose a practice only when requested. Mentioning a past/negated
    // feeling ("anxious yesterday, calm now") is not a practice request.
    final rejectsPractice = intent(r"\b(?:do not|don't|no|without|not asking for)\b.{0,50}\b(?:breathing|grounding|calming|practice|exercise)\b");
    if (!rejectsPractice && intent(r'\b(?:(?:give|show|suggest|offer|teach|try|start|guide|lead|want|need).{0,40}(?:breathing (?:practice|exercise)|grounding (?:practice|exercise)|wellness practice|calming exercise)|(?:help me|i need to|i want to) (?:calm down|ground myself|breathe))\b')) {
      return const NavigatorAgentPlan(
        tool: 'wellness recipe',
        instruction: 'Offer one short voluntary practice matching the request. Respect requested format and any no-question instruction. Do not diagnose, prescribe or assume current feelings.',
      );
    }
    if (intent(r"\b(?:(?:help me|let's|please) (?:plan|prepare|organize|prioriti[sz]e|schedule)|(?:make|give|create|draft|suggest|build|write).{0,35}(?:plan|schedule|agenda|priorities)|(?:plan|organize|prioriti[sz]e|schedule) my|prepare (?:me|for)|manage my time|(?:i need|i want|i'd like).{0,20}(?:plan|schedule))\b")) {
      return const NavigatorAgentPlan(
        tool: 'practical planning',
        instruction: 'Make a practical plan from stated time, constraints and priorities. Respect format and no-question requests; state missing details rather than inventing them. Do not claim calendar access or a saved appointment; phone actions require a reviewed draft and explicit confirmation.',
      );
    }
    return const NavigatorAgentPlan(
      tool: 'open conversation',
      instruction: 'Listen for what the member wants before choosing a mode. Answer, plan, reflect, or help practically based on their request. Never start Daily Nav or a wellness exercise unless they explicitly choose it.',
    );
  }

}
