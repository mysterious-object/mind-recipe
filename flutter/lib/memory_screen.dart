import 'package:flutter/material.dart';

import 'app_services.dart';
import 'design_tokens.dart';

/// A visible, member-controlled ledger of what Mind Nav may remember.
class MemoryScreen extends StatefulWidget {
  const MemoryScreen({super.key, required this.appState});
  final SecureAppState appState;

  @override
  State<MemoryScreen> createState() => _MemoryScreenState();
}

class _MemoryScreenState extends State<MemoryScreen> {
  final _api = MindRecipeApiClient();
  List<Map<String, dynamic>> _cards = const [];
  List<Map<String, dynamic>> _proposals = const [];
  bool _loading = true;

  String get _token => widget.appState.session?.token ?? '';

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final results = await Future.wait<dynamic>([
        _api.getMemory(_token),
        _api.getMemoryProposals(_token).catchError((_) => <Map<String, dynamic>>[]),
      ]);
      if (mounted) setState(() {
        _cards = results[0] as List<Map<String, dynamic>>;
        _proposals = (results[1] as List).cast<Map<String, dynamic>>();
      });
    } catch (error) {
      if (mounted) _message(error.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _add() async {
    final controller = TextEditingController();
    final text = await showDialog<String>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Add memory'),
        content: TextField(
          controller: controller,
          autofocus: true,
          maxLength: 1000,
          decoration: const InputDecoration(
            labelText: 'A preference or fact you want Mind Nav to remember',
          ),
          onSubmitted: (value) => Navigator.pop(context, value.trim()),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
          FilledButton(
            onPressed: () => Navigator.pop(context, controller.text.trim()),
            child: const Text('Save'),
          ),
        ],
      ),
    );
    if (text == null || text.isEmpty) return;
    try {
      await _api.createMemory(_token, {'kind': 'member_note', 'content': text});
      await _load();
    } catch (error) {
      if (mounted) _message(error.toString());
    }
  }

  Future<void> _delete(Map<String, dynamic> card) async {
    try {
      await _api.deleteMemory(_token, card['id'].toString());
      await _load();
    } catch (error) {
      if (mounted) _message(error.toString());
    }
  }

  Future<void> _decideProposal(Map<String, dynamic> proposal, bool approved) async {
    try {
      await _api.decideMemoryProposal(_token, proposal['id'].toString(), approved);
      await _load();
    } catch (error) {
      if (mounted) _message(error.toString());
    }
  }

  void _message(String message) => ScaffoldMessenger.of(context)
      .showSnackBar(SnackBar(content: Text(message)));

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('Memory controls')),
    floatingActionButton: FloatingActionButton.extended(
      onPressed: _add,
      icon: const Icon(Icons.add),
      label: const Text('Add'),
    ),
    body: _loading
        ? const Center(child: CircularProgressIndicator())
        : ListView(
            padding: const EdgeInsets.all(16),
            children: [
              const Text(
                'Only the items shown here are saved as durable memory. You can remove any item at any time.',
              ),
              const SizedBox(height: 12),
              if (_proposals.isNotEmpty) ...[
                const Text('Proposed memories', style: TextStyle(fontWeight: FontWeight.w800)),
                const SizedBox(height: 8),
                ..._proposals.map((proposal) => Card(
                  child: Padding(
                    padding: const EdgeInsets.all(14),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(proposal['content']?.toString() ?? '', style: MindRecipeTokens.title(context)),
                        const SizedBox(height: 4),
                        Text('Why: ${proposal['reason']?.toString() ?? ''}'),
                        const SizedBox(height: 8),
                        Wrap(spacing: 8, children: [
                          FilledButton(
                            onPressed: () => _decideProposal(proposal, true),
                            child: const Text('Approve'),
                          ),
                          TextButton(
                            onPressed: () => _decideProposal(proposal, false),
                            child: const Text('Dismiss'),
                          ),
                        ]),
                      ],
                    ),
                  ),
                )),
                const SizedBox(height: 16),
              ],
              const Text('Saved memory', style: TextStyle(fontWeight: FontWeight.w800)),
              const SizedBox(height: 8),
              if (_cards.isEmpty) const Card(
                child: Padding(
                  padding: EdgeInsets.all(16),
                  child: Text('No saved memories yet.'),
                ),
              ),
              ..._cards.map((card) => Card(
                child: ListTile(
                  leading: const Icon(Icons.bookmark_outline),
                  title: Text(card['content']?.toString() ?? ''),
                  subtitle: Text(
                    '${card['kind']?.toString() ?? 'memory'} · ${card['source']?.toString() ?? 'member'}'
                    '${card['expires_at'] == null ? '' : ' · expires ${card['expires_at']}'}',
                  ),
                  trailing: IconButton(
                    tooltip: 'Remove memory',
                    onPressed: () => _delete(card),
                    icon: const Icon(Icons.delete_outline),
                  ),
                ),
              )),
              const SizedBox(height: 96),
            ],
          ),
  );
}
