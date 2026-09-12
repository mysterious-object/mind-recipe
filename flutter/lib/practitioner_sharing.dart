import 'package:flutter/material.dart';

import 'app_services.dart';
import 'design_tokens.dart';

/// Practitioner sharing — manage consent grants for sharing wellness data
/// with practitioners. Granular categories, expiration, revocation, audit.

class PractitionerSharing extends StatefulWidget {
  const PractitionerSharing({super.key, required this.appState});
  final SecureAppState appState;
  @override
  State<PractitionerSharing> createState() => _PractitionerSharingState();
}

class _PractitionerSharingState extends State<PractitionerSharing> {
  List<dynamic> _consents = [];
  List<dynamic> _auditLog = [];
  bool _loaded = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final api = MindRecipeApiClient();
    final token = widget.appState.session?.token ?? '';
    try {
      final consents = await api.fetchConsents(token);
      final audit = await api.fetchAudit(token);
      if (mounted)
        setState(() {
          _consents = consents;
          _auditLog = audit;
          _loaded = true;
        });
    } catch (_) {
      if (mounted) setState(() => _loaded = true);
    }
  }

  Future<void> _grantConsent() async {
    final practitionerCtl = TextEditingController();
    final selectedCategories = <String>{'checkins', 'trends'};
    var durationDays = 30;
    final result = await showDialog<Map<String, dynamic>>(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDialogState) => AlertDialog(
          title: const Text('Share with practitioner'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                TextField(
                  controller: practitionerCtl,
                  onChanged: (_) => setDialogState(() {}),
                  decoration: const InputDecoration(
                    labelText: 'Practitioner ID',
                    hintText: 'Enter their practitioner ID',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 14),
                const Text(
                  'Choose exactly what to share',
                  style: TextStyle(fontWeight: FontWeight.w700),
                ),
                for (final category in const {
                  'checkins': 'Daily Navigation check-ins',
                  'trends': 'Calculated trends',
                  'tracker_events': 'Practice and activity events',
                }.entries)
                  CheckboxListTile(
                    dense: true,
                    contentPadding: EdgeInsets.zero,
                    value: selectedCategories.contains(category.key),
                    title: Text(category.value),
                    onChanged: (value) => setDialogState(() {
                      if (value == true) {
                        selectedCategories.add(category.key);
                      } else {
                        selectedCategories.remove(category.key);
                      }
                    }),
                  ),
                DropdownButtonFormField<int>(
                  initialValue: durationDays,
                  decoration: const InputDecoration(
                    labelText: 'Access expires',
                  ),
                  items: const [
                    DropdownMenuItem(value: 7, child: Text('In 7 days')),
                    DropdownMenuItem(value: 30, child: Text('In 30 days')),
                    DropdownMenuItem(value: 90, child: Text('In 90 days')),
                  ],
                  onChanged: (value) =>
                      setDialogState(() => durationDays = value ?? 30),
                ),
                const SizedBox(height: 8),
                const Text('Journal entries and AI chats remain private.'),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Cancel'),
            ),
            FilledButton(
              onPressed:
                  practitionerCtl.text.trim().isEmpty ||
                      selectedCategories.isEmpty
                  ? null
                  : () => Navigator.pop(ctx, {
                      'practitioner': practitionerCtl.text.trim(),
                      'categories': selectedCategories.toList(),
                      'duration_days': durationDays,
                    }),
              child: const Text('Grant access'),
            ),
          ],
        ),
      ),
    );
    practitionerCtl.dispose();
    if (result != null) {
      final api = MindRecipeApiClient();
      try {
        await api.grantConsent(
          token: widget.appState.session?.token ?? '',
          practitionerId: result['practitioner'].toString(),
          categories: (result['categories'] as List).cast<String>(),
          durationDays: result['duration_days'] as int,
        );
        _load();
      } catch (_) {}
    }
  }

  @override
  Widget build(BuildContext context) => ListView(
    padding: const EdgeInsets.all(20),
    children: [
      Text(
        'Practitioner sharing',
        style: MindRecipeTokens.displayMedium(context),
      ),
      const SizedBox(height: 4),
      Text(
        'Share selected wellness data with your practitioner. You control what is shared, for how long, and can revoke access at any time.',
        style: MindRecipeTokens.bodyMedium(context)!
            .copyWith(color: MindRecipeTokens.gray600),
      ),
      const SizedBox(height: 8),
      _buildWellnessCaveat(),
      const SizedBox(height: 16),
      FilledButton.icon(
        onPressed: _grantConsent,
        icon: const Icon(Icons.person_add),
        label: const Text('Grant new consent'),
      ),
      const SizedBox(height: 20),
      Text('Active consents', style: MindRecipeTokens.headlineMedium(context)),
      if (!_loaded)
        const Padding(
          padding: EdgeInsets.all(20),
          child: CircularProgressIndicator(),
        )
      else if (_consents.isEmpty)
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Text(
              'No active consent grants. Share data when you are ready.',
            ),
          ),
        )
      else
        ...(_consents.map(
          (c) => Card(
            child: ListTile(
              leading: const Icon(
                Icons.medical_services,
                color: MindRecipeTokens.primary,
              ),
              title: Text(
                'Practitioner: ${c['recipient_practitioner_id'] ?? 'Unknown'}',
              ),
              subtitle: Text(
                'Categories: ${c['categories'] ?? 'none'} · Expires: ${_formatDate(c['expires_at']?.toString())}',
              ),
              trailing: TextButton(
                onPressed: () async {
                  try {
                    await MindRecipeApiClient().revokeConsent(
                      token: widget.appState.session?.token ?? '',
                      grantId: c['id'].toString(),
                    );
                    await _load();
                  } catch (_) {
                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Could not revoke access.'),
                        ),
                      );
                    }
                  }
                },
                child: const Text('Revoke'),
              ),
            ),
          ),
        )),
      const SizedBox(height: 20),
      Text('Audit trail', style: MindRecipeTokens.headlineMedium(context)),
      if (_auditLog.isEmpty)
        const Card(
          child: Padding(
            padding: EdgeInsets.all(16),
            child: Text('No audit events yet. Every access is logged.'),
          ),
        )
      else
        ...(_auditLog
            .take(5)
            .map(
              (a) => ListTile(
                dense: true,
                title: Text(
                  a['action']?.toString() ?? '',
                  style: const TextStyle(fontSize: 13),
                ),
                subtitle: Text(
                  a['occurred_at']?.toString() ?? '',
                  style: const TextStyle(fontSize: 11),
                ),
              ),
            )),
      const SizedBox(height: 24),
    ],
  );

  Widget _buildWellnessCaveat() => Container(
    padding: const EdgeInsets.all(12),
    decoration: BoxDecoration(
      color: MindRecipeTokens.primary.withAlpha(15),
      borderRadius: BorderRadius.circular(12),
    ),
    child: Row(
      children: [
        const Icon(
          Icons.info_outline,
          size: 16,
          color: MindRecipeTokens.primary,
        ),
        const SizedBox(width: 8),
        const Expanded(
          child: Text(
            'MindRecipe is a wellness tool, not medical care. Shared data does not constitute a clinical record.',
            style: TextStyle(fontSize: 12),
          ),
        ),
      ],
    ),
  );

  String _formatDate(String? iso) {
    if (iso == null) return 'Unknown';
    try {
      return DateTime.parse(iso).toLocal().toString().split('.')[0];
    } catch (_) {
      return iso;
    }
  }
}
