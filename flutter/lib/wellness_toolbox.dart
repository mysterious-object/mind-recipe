import 'dart:async';

import 'package:flutter/material.dart';

import 'app_services.dart';
import 'design_tokens.dart';

/// Wellness toolbox — record discovery, practice, effectiveness, context,
/// favorites, accessibility needs, and recommendation provenance.

class WellnessToolbox extends StatefulWidget {
  const WellnessToolbox({super.key, required this.appState});
  final SecureAppState appState;

  @override
  State<WellnessToolbox> createState() => _WellnessToolboxState();
}

class _WellnessToolboxState extends State<WellnessToolbox> {
  final _tools = <ToolEntry>[];
  final _nameController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _api = MindNavApiClient();
  String _filterCategory = 'All';
  String _newCategory = 'Breathing';
  String _newSource = 'self-discovered';
  bool _showAddForm = false;
  bool _loading = true;
  bool _saving = false;

  static const _categories = [
    'All',
    'Breathing',
    'Grounding',
    'Movement',
    'Reflection',
    'Social',
    'Creative',
    'Sensory',
    'Boundary',
  ];

  String get _token => widget.appState.session?.token ?? '';

  @override
  void initState() {
    super.initState();
    unawaited(_loadTools());
  }

  @override
  void dispose() {
    _nameController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  Future<void> _loadTools() async {
    try {
      final records = await _api.fetchToolbox(token: _token);
      if (!mounted) return;
      setState(() {
        _tools
          ..clear()
          ..addAll(records.map(ToolEntry.fromJson));
      });
    } catch (error) {
      if (mounted) _showError(error);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  void _showError(Object error) {
    ScaffoldMessenger.of(context)
        .showSnackBar(SnackBar(content: Text(error.toString())));
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _filterCategory == 'All'
        ? _tools
        : _tools.where((t) => t.category == _filterCategory).toList();

    return Column(
      children: [
        _buildAddButton(),
        if (_showAddForm) _buildAddForm(),
        _buildCategoryFilter(),
        Expanded(
          child: _loading
              ? const Center(child: CircularProgressIndicator())
              : RefreshIndicator(
                  onRefresh: _loadTools,
                  child: _buildToolList(filtered),
                ),
        ),
      ],
    );
  }

  Widget _buildAddButton() => Padding(
    padding: const EdgeInsets.fromLTRB(20, 12, 20, 4),
    child: Semantics(
      label: 'Add a new wellness practice to your toolbox',
      child: FilledButton.icon(
        onPressed: () => setState(() => _showAddForm = !_showAddForm),
        icon: Icon(_showAddForm ? Icons.close : Icons.add),
        label: Text(_showAddForm ? 'Cancel' : 'Add practice'),
      ),
    ),
  );

  Widget _buildCategoryFilter() => SizedBox(
    height: 48,
    child: ListView.separated(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      itemCount: _categories.length,
      separatorBuilder: (_, __) => const SizedBox(width: 6),
      itemBuilder: (context, i) => FilterChip(
        label: Text(_categories[i]),
        selected: _filterCategory == _categories[i],
        onSelected: (_) => setState(() => _filterCategory = _categories[i]),
        selectedColor: MindNavTokens.primary.withAlpha(40),
      ),
    ),
  );

  Widget _buildAddForm() {
    return Card(
      margin: const EdgeInsets.fromLTRB(16, 8, 16, 4),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: _nameController,
              decoration: const InputDecoration(
                labelText: 'Practice name',
                hintText: 'e.g., Box breathing, 5-4-3-2-1 grounding',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _descriptionController,
              maxLines: 2,
              decoration: const InputDecoration(
                labelText: 'Description (optional)',
                hintText: 'How do you do it? What does it help with?',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            DropdownButtonFormField<String>(
              initialValue: _newCategory,
              items: _categories
                  .where((c) => c != 'All')
                  .map((c) => DropdownMenuItem(value: c, child: Text(c)))
                  .toList(),
              onChanged: (v) => setState(() => _newCategory = v ?? 'Breathing'),
              decoration: const InputDecoration(
                labelText: 'Category',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            DropdownButtonFormField<String>(
              initialValue: _newSource,
              items: const [
                DropdownMenuItem(
                  value: 'self-discovered',
                  child: Text('Self-discovered'),
                ),
                DropdownMenuItem(
                  value: 'practitioner-recommended',
                  child: Text('Practitioner recommended'),
                ),
                DropdownMenuItem(
                  value: 'peer-shared',
                  child: Text('Peer shared'),
                ),
                DropdownMenuItem(
                  value: 'mind-recipe-lesson',
                  child: Text('Mind Recipe lesson'),
                ),
              ],
              onChanged: (v) =>
                  setState(() => _newSource = v ?? 'self-discovered'),
              decoration: const InputDecoration(
                labelText: 'Source',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: FilledButton(
                    onPressed: _saving ? null : _saveTool,
                    child: Text(_saving ? 'Saving…' : 'Save practice'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: _saving ? null : () => _showAiCreateDialog(),
                    icon: const Icon(Icons.auto_awesome),
                    label: const Text('Create with AI'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _saveTool() async {
    final name = _nameController.text.trim();
    if (name.isEmpty) {
      _showError(const ApiException('Give this practice a name.'));
      return;
    }
    setState(() => _saving = true);
    try {
      final record = await _api.createToolboxItem(
        token: _token,
        name: name,
        description: _descriptionController.text.trim(),
        category: _newCategory,
        source: _newSource,
      );
      if (!mounted) return;
      setState(() {
        _tools.insert(0, ToolEntry.fromJson(record));
        _showAddForm = false;
        _nameController.clear();
        _descriptionController.clear();
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Practice saved to your toolbox.')),
      );
    } catch (error) {
      if (mounted) _showError(error);
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  Future<void> _showAiCreateDialog() async {
    final descCtl = TextEditingController();
    final result = await showDialog<String>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Create with AI'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Describe what kind of wellness tool you need. The AI will research and create a personalized practice based on your history and patterns.',
              style: TextStyle(fontSize: 13, color: Colors.grey),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: descCtl,
              maxLines: 3,
              decoration: const InputDecoration(
                labelText: 'What do you need help with?',
                hintText: 'e.g., "A quick grounding practice for when I feel overwhelmed at work"',
                border: OutlineInputBorder(),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(ctx, descCtl.text.trim()),
            child: const Text('Create with AI'),
          ),
        ],
      ),
    );
    if (result != null && result.isNotEmpty) {
      await _createWithAi(result);
    }
  }

  Future<void> _createWithAi(String description) async {
    // Show loading
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => const Center(child: CircularProgressIndicator()),
    );

    try {
      final api = MindNavApiClient();
      final data = await api.createAiToolboxItem(
        token: _token,
        description: description,
        providerKey: widget.appState.openRouterKey,
      );

      if (!mounted) return;
      Navigator.pop(context); // Close loading

      final item = data['toolbox_item'] as Map<String, dynamic>;
      setState(() {
        _tools.insert(0, ToolEntry.fromJson(item));
        _showAddForm = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('AI-created tool added to your toolbox!')),
      );
    } catch (e) {
      if (!mounted) return;
      Navigator.pop(context); // Close loading
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Failed to create with AI: $e')));
    }
  }

  Widget _buildToolList(List<ToolEntry> tools) {
    if (tools.isEmpty) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.construction, size: 64, color: MindNavTokens.gray400),
            const SizedBox(height: 12),
            Text(
              'Your toolbox is empty',
              style: MindNavTokens.headlineMedium(context),
            ),
            const SizedBox(height: 4),
            Text(
              'Add practices you discover to track what works for you.',
              style: MindNavTokens.bodyMedium(context),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      );
    }
    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 20),
      itemCount: tools.length,
      itemBuilder: (context, i) => _ToolCard(
        tool: tools[i],
        onPractice: (rating, practiceContext) =>
            unawaited(_recordPractice(tools[i], rating, practiceContext)),
        onToggleFavorite: () => unawaited(_toggleFavorite(tools[i])),
        onDelete: () => unawaited(_deleteTool(tools[i])),
      ),
    );
  }

  Future<void> _recordPractice(
    ToolEntry tool,
    int rating,
    String practiceContext,
  ) async {
    try {
      final record = await _api.recordToolboxPractice(
        token: _token,
        itemId: tool.id,
        effectiveness: rating,
        context: practiceContext,
      );
      if (!mounted) return;
      setState(() => tool.updateFromJson(record));
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text('Practice recorded.')));
    } catch (error) {
      if (mounted) _showError(error);
    }
  }

  Future<void> _toggleFavorite(ToolEntry tool) async {
    try {
      final record = await _api.setToolboxFavorite(
        token: _token,
        itemId: tool.id,
        favorite: !tool.isFavorite,
      );
      if (mounted) setState(() => tool.updateFromJson(record));
    } catch (error) {
      if (mounted) _showError(error);
    }
  }

  Future<void> _deleteTool(ToolEntry tool) async {
    try {
      await _api.deleteToolboxItem(token: _token, itemId: tool.id);
      if (mounted)
        setState(() => _tools.removeWhere((item) => item.id == tool.id));
    } catch (error) {
      if (mounted) _showError(error);
    }
  }
}

class ToolEntry {
  ToolEntry({
    required this.id,
    required this.name,
    required this.description,
    required this.category,
    required this.source,
    required this.addedAt,
    this.useCount = 0,
    this.lastUsedAt,
    this.isFavorite = false,
    this.effectivenessRatings = const [],
    this.usageContexts = const [],
    this.accessibilityNotes = '',
  });
  final String id;
  final String name;
  final String description;
  final String category;
  final String source;
  final DateTime addedAt;
  int useCount;
  DateTime? lastUsedAt;
  bool isFavorite;
  final List<int> effectivenessRatings;
  final List<String> usageContexts;
  String accessibilityNotes;

  factory ToolEntry.fromJson(Map<String, dynamic> json) => ToolEntry(
    id: json['id']?.toString() ?? '',
    name: json['name']?.toString() ?? 'Untitled practice',
    description: json['description']?.toString() ?? '',
    category: json['category']?.toString() ?? 'Grounding',
    source: json['source']?.toString() ?? 'self-discovered',
    addedAt:
        DateTime.tryParse(json['discovered_at']?.toString() ?? '') ??
        DateTime.now(),
    useCount: json['practice_count'] as int? ?? 0,
    lastUsedAt: DateTime.tryParse(json['last_practiced_at']?.toString() ?? ''),
    isFavorite: json['is_favorite'] == true,
    effectivenessRatings:
        (json['effectiveness_ratings'] as List<dynamic>? ?? const [])
            .map((value) => value as int)
            .toList(),
    usageContexts: (json['contexts'] as List<dynamic>? ?? const [])
        .map((value) => value.toString())
        .toList(),
    accessibilityNotes:
        (json['accessibility_needs'] as List<dynamic>? ?? const []).join(', '),
  );

  void updateFromJson(Map<String, dynamic> json) {
    useCount = json['practice_count'] as int? ?? useCount;
    lastUsedAt = DateTime.tryParse(json['last_practiced_at']?.toString() ?? '');
    isFavorite = json['is_favorite'] == true;
    effectivenessRatings
      ..clear()
      ..addAll(
        (json['effectiveness_ratings'] as List<dynamic>? ?? const []).map(
          (value) => value as int,
        ),
      );
    usageContexts
      ..clear()
      ..addAll(
        (json['contexts'] as List<dynamic>? ?? const []).map(
          (value) => value.toString(),
        ),
      );
  }

  double get avgEffectiveness => effectivenessRatings.isEmpty
      ? 0
      : effectivenessRatings.reduce((a, b) => a + b) /
            effectivenessRatings.length;
}

class _ToolCard extends StatefulWidget {
  const _ToolCard({
    required this.tool,
    required this.onPractice,
    required this.onToggleFavorite,
    required this.onDelete,
  });
  final ToolEntry tool;
  final void Function(int rating, String context) onPractice;
  final VoidCallback onToggleFavorite;
  final VoidCallback onDelete;

  @override
  State<_ToolCard> createState() => _ToolCardState();
}

class _ToolCardState extends State<_ToolCard> {
  bool _showPractice = false;
  int _rating = 3;
  final _practiceContext = TextEditingController();

  @override
  void dispose() {
    _practiceContext.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final t = widget.tool;
    return Semantics(
      label:
          '${t.name}. Used ${t.useCount} times. Average effectiveness ${t.avgEffectiveness.toStringAsFixed(1)} out of 5.',
      child: Card(
        margin: const EdgeInsets.only(bottom: 10),
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(
                    t.isFavorite ? Icons.star : Icons.star_border,
                    color: t.isFavorite ? MindNavTokens.warning : null,
                    size: 20,
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(t.name, style: MindNavTokens.title(context)),
                  ),
                  IconButton(
                    icon: const Icon(Icons.favorite_border, size: 20),
                    onPressed: widget.onToggleFavorite,
                    tooltip: t.isFavorite
                        ? 'Remove from favorites'
                        : 'Add to favorites',
                  ),
                  IconButton(
                    icon: const Icon(Icons.delete_outline, size: 20),
                    onPressed: () => showDialog(
                      context: context,
                      builder: (ctx) => AlertDialog(
                        title: const Text('Remove practice?'),
                        content: Text(
                          'Remove "${t.name}" from your toolbox? History will be lost.',
                        ),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(ctx),
                            child: const Text('Cancel'),
                          ),
                          TextButton(
                            onPressed: () {
                              Navigator.pop(ctx);
                              widget.onDelete();
                            },
                            child: const Text('Remove'),
                          ),
                        ],
                      ),
                    ),
                    tooltip: 'Delete',
                  ),
                ],
              ),
              if (t.description.isNotEmpty)
                Padding(
                  padding: const EdgeInsets.only(top: 4, bottom: 8),
                  child: Text(
                    t.description,
                    style: MindNavTokens.bodySmall(context),
                  ),
                ),
              Wrap(
                spacing: 8,
                children: [
                  Chip(
                    label: Text(
                      t.category,
                      style: const TextStyle(fontSize: 11),
                    ),
                  ),
                  Chip(
                    label: Text(t.source, style: const TextStyle(fontSize: 11)),
                    avatar: Icon(_sourceIcon(t.source), size: 14),
                  ),
                  if (t.useCount > 0)
                    Chip(
                      label: Text(
                        '${t.useCount}x used',
                        style: const TextStyle(fontSize: 11),
                      ),
                    ),
                  if (t.lastUsedAt != null)
                    Chip(
                      label: Text(
                        'Last: ${_formatDate(t.lastUsedAt!)}',
                        style: const TextStyle(fontSize: 11),
                      ),
                    ),
                ],
              ),
              if (t.useCount > 0) ...[
                const SizedBox(height: 6),
                Row(
                  children: List.generate(
                    5,
                    (i) => Icon(
                      i < t.avgEffectiveness.round()
                          ? Icons.circle
                          : Icons.circle_outlined,
                      size: 12,
                      color: MindNavTokens.primary,
                    ),
                  ),
                ),
                Text(
                  'Avg effectiveness: ${t.avgEffectiveness.toStringAsFixed(1)}/5',
                  style: MindNavTokens.bodySmall(context),
                ),
              ],
              const SizedBox(height: 8),
              Row(
                children: [
                  OutlinedButton.icon(
                    onPressed: () =>
                        setState(() => _showPractice = !_showPractice),
                    icon: const Icon(Icons.check_circle_outline, size: 18),
                    label: const Text('Record practice'),
                  ),
                  const SizedBox(width: 8),
                  if (t.accessibilityNotes.isNotEmpty)
                    Icon(
                      Icons.accessibility_new,
                      size: 16,
                      color: MindNavTokens.primary,
                    ),
                ],
              ),
              if (_showPractice) _buildPracticeForm(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPracticeForm() {
    return Padding(
      padding: const EdgeInsets.only(top: 12),
      child: Column(
        children: [
          Text(
            'How effective was this?',
            style: MindNavTokens.bodySmall(context),
          ),
          Slider(
            value: _rating.toDouble(),
            min: 1,
            max: 5,
            divisions: 4,
            label: '$_rating',
            onChanged: (v) => setState(() => _rating = v.round()),
            activeColor: MindNavTokens.primary,
          ),
          TextField(
            controller: _practiceContext,
            decoration: const InputDecoration(
              labelText: 'Context (optional)',
              hintText: 'What prompted you to use this? Where were you?',
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 8),
          FilledButton(
            onPressed: () {
              widget.onPractice(_rating, _practiceContext.text.trim());
              setState(() {
                _showPractice = false;
                _rating = 3;
                _practiceContext.clear();
              });
            },
            child: const Text('Save practice record'),
          ),
        ],
      ),
    );
  }

  IconData _sourceIcon(String source) => switch (source) {
    'practitioner-recommended' => Icons.medical_services,
    'peer-shared' => Icons.people,
    'mind-recipe-lesson' => Icons.menu_book,
    _ => Icons.lightbulb,
  };

  String _formatDate(DateTime dt) {
    final now = DateTime.now();
    final diff = now.difference(dt);
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    return '${diff.inDays}d ago';
  }
}
