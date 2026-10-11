/// The member's answers from one navigation. Journals are device-only.
class DailyNavigationResult {
  DailyNavigationResult({
    required this.id,
    required this.recordedAt,
    required List<String> emotions,
    required List<String> bodyAreas,
    required this.activation,
    required this.activationReported,
    required this.journal,
    required this.zoneLabel,
    required this.mode,
    required this.availableMinutes,
    required this.capacity,
    required this.outcome,
  }) : emotions = List.unmodifiable(emotions),
       bodyAreas = List.unmodifiable(bodyAreas);

  final String id;
  final DateTime recordedAt;
  final List<String> emotions;
  final List<String> bodyAreas;

  /// Canonical self-report scale: -5 (low energy) through +5 (high energy).
  final int activation;
  final bool activationReported;
  final String journal;
  final String zoneLabel;
  final String mode;
  final int availableMinutes;
  final String capacity;
  final String outcome;

  double? get normalizedActivation =>
      activationReported ? ((activation + 5) / 10).clamp(0.0, 1.0) : null;

  Map<String, dynamic> toLocalHistory() => {
    'id': id,
    't': recordedAt.toIso8601String(),
    'emotions': emotions.isEmpty ? 'Not recorded' : emotions.join(', '),
    'activation': activation,
    'activation_reported': activationReported,
    'activation_scale': 'signed_five',
    'body': bodyAreas.join(', '),
    'journal': journal,
    'zone_label': zoneLabel,
    'mode': mode,
    'available_minutes': availableMinutes,
    'capacity': capacity,
    'outcome': outcome,
  };

  Map<String, dynamic> toSyncPayload() => {
    'client_id': id,
    'emotions': emotions,
    'activation': activation,
    'body_areas': bodyAreas,
    'zone_label': zoneLabel,
    'observations': [
      for (final entry in {
        'navigation_mode': mode.toLowerCase().replaceAll(' ', '_'),
        'available_minutes': availableMinutes,
        'self_reported_capacity': capacity.toLowerCase(),
        'activation_reported': activationReported,
        'activation_scale': 'signed_five',
      }.entries)
        {
          'kind': entry.key,
          'value': entry.value,
          'recorded_at': recordedAt.toIso8601String(),
          'timezone': recordedAt.timeZoneName,
          'source': 'member_input',
          'schema_version': 'v1',
        },
    ],
  };
}
