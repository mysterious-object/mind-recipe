import 'package:flutter/material.dart';

import 'app_services.dart';
import 'design_tokens.dart';
import 'mobile_automation.dart';

/// A durable, member-controlled record of promises made in Mind Nav.
class CommitmentsScreen extends StatefulWidget {
  const CommitmentsScreen({super.key, required this.appState});
  final SecureAppState appState;

  @override
  State<CommitmentsScreen> createState() => _CommitmentsScreenState();
}

class _CommitmentsScreenState extends State<CommitmentsScreen> {
  final _api = MindRecipeApiClient();
  List<Map<String, dynamic>> _items = const [];
  bool _loading = true;

  String get _token => widget.appState.session?.token ?? '';

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final items = await _api.getCommitments(_token);
      if (mounted) setState(() => _items = items);
    } catch (error) {
      if (mounted) _message(error.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _add() async {
    final controller = TextEditingController();
    final title = await showDialog<String>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Add a commitment'),
        content: TextField(
          controller: controller,
          autofocus: true,
          maxLength: 240,
          decoration: const InputDecoration(
            labelText: 'What would you like to follow through on?',
          ),
          onSubmitted: (value) => Navigator.pop(context, value.trim()),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
          FilledButton(
            onPressed: () => Navigator.pop(context, controller.text.trim()),
            child: const Text('Add'),
          ),
        ],
      ),
    );
    if (title == null || title.isEmpty) return;
    try {
      await _api.createCommitment(_token, {
        'client_id': 'commitment-${DateTime.now().microsecondsSinceEpoch}',
        'title': title,
        'action_type': 'reflection',
        'source': 'member',
      });
      await _load();
    } catch (error) {
      if (mounted) _message(error.toString());
    }
  }

  Future<void> _change(Map<String, dynamic> item, String status) async {
    try {
      await _api.updateCommitment(_token, item['id'].toString(), status);
      await _load();
    } catch (error) {
      if (mounted) _message(error.toString());
    }
  }

  Future<void> _scheduleReminder(Map<String, dynamic> item) async {
    final date = await showDatePicker(
      context: context,
      initialDate: DateTime.now().add(const Duration(days: 1)),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (date == null || !mounted) return;
    final time = await showTimePicker(
      context: context,
      initialTime: TimeOfDay.fromDateTime(DateTime.now().add(const Duration(hours: 1))),
    );
    if (time == null) return;
    final scheduledFor = DateTime(date.year, date.month, date.day, time.hour, time.minute);
    if (!scheduledFor.isAfter(DateTime.now())) {
      _message('Choose a future time for the reminder.');
      return;
    }
    final result = await MindRecipeMobileAutomation().setReminder(
      title: item['title']?.toString() ?? 'Mind Recipe commitment',
      dueDate: scheduledFor,
      notes: 'Requested from Mind Recipe. Confirm any system sheet before leaving it.',
    );
    try {
      await _api.recordCommitmentExecution(
        _token,
        item['id'].toString(),
        action: 'reminder',
        status: result.success ? 'requested' : (result.isUnavailable ? 'unavailable' : 'failed'),
        receipt: result.nativeCode,
        scheduledFor: result.success ? scheduledFor : null,
      );
      if (mounted) _message(result.message);
      await _load();
    } catch (error) {
      if (mounted) _message(error.toString());
    }
  }

  void _message(String message) => ScaffoldMessenger.of(context)
      .showSnackBar(SnackBar(content: Text(message)));

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('Commitments')),
    floatingActionButton: FloatingActionButton.extended(
      onPressed: _add,
      icon: const Icon(Icons.add),
      label: const Text('Add'),
    ),
    body: _loading
        ? const Center(child: CircularProgressIndicator())
        : _items.isEmpty
        ? const Center(child: Text('No active commitments yet.'))
        : RefreshIndicator(
            onRefresh: _load,
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _items.length,
              itemBuilder: (context, index) {
                final item = _items[index];
                final status = item['status']?.toString() ?? 'proposed';
                return Card(
                  child: Padding(
                    padding: const EdgeInsets.all(14),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(item['title']?.toString() ?? '', style: MindRecipeTokens.title(context)),
                        const SizedBox(height: 4),
                        Text('Status: $status', style: MindRecipeTokens.bodySmall(context)),
                        if (item['execution_status']?.toString() == 'requested')
                          Text(
                            'Device reminder requested${item['scheduled_for'] == null ? '' : ' for ${item['scheduled_for']}'}',
                            style: MindRecipeTokens.bodySmall(context),
                          ),
                        const SizedBox(height: 8),
                        Wrap(spacing: 8, children: [
                          if (status == 'proposed') OutlinedButton(
                            onPressed: () => _change(item, 'confirmed'), child: const Text('Confirm'),
                          ),
                          if (status == 'confirmed' || status == 'scheduled') FilledButton(
                            onPressed: () => _change(item, 'completed'), child: const Text('Complete'),
                          ),
                          if (status == 'confirmed' || status == 'scheduled') OutlinedButton.icon(
                            onPressed: () => _scheduleReminder(item),
                            icon: const Icon(Icons.notifications_active_outlined),
                            label: const Text('Set device reminder'),
                          ),
                          if (status == 'confirmed' || status == 'scheduled') TextButton(
                            onPressed: () => _change(item, 'skipped'), child: const Text('Skip'),
                          ),
                          TextButton(
                            onPressed: () => _change(item, 'cancelled'), child: const Text('Cancel'),
                          ),
                        ]),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
  );
}
