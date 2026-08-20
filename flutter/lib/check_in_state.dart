class CheckInState {
  final Set<String> emotions = {};
  final Set<String> bodyAreas = {};
  final Set<String> contextTags = {};
  int activation = 0;
  String journal = '';
  String greenZone = 'Steady and present';
  bool dismissedSafetyPrompt = false;
  DateTime? completedAt;

  bool get crisisLanguage => RegExp(
    r'(kill myself|suicide|want to die|hurt myself)',
    caseSensitive: false,
  ).hasMatch(journal);
}
