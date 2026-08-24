import 'package:flutter/material.dart';
import 'design_tokens.dart';

/// Notification scheduler — discreet wellness reminders with quiet hours,
/// snooze, pause controls, and user-selected times.

class NotificationScheduler extends StatefulWidget {
  const NotificationScheduler({super.key});

  @override
  State<NotificationScheduler> createState() => _NotificationSchedulerState();
}

class _NotificationSchedulerState extends State<NotificationScheduler> {
  // Schedule
  bool _enabled = false;
  TimeOfDay _morningTime = const TimeOfDay(hour: 9, minute: 0);
  TimeOfDay _middayTime = const TimeOfDay(hour: 13, minute: 0);
  TimeOfDay _eveningTime = const TimeOfDay(hour: 19, minute: 0);

  // Quiet hours
  bool _quietHoursEnabled = true;
  TimeOfDay _quietStart = const TimeOfDay(hour: 22, minute: 0);
  TimeOfDay _quietEnd = const TimeOfDay(hour: 7, minute: 0);

  // Snooze / pause
  bool _snoozed = false;
  DateTime? _snoozeUntil;
  bool _paused = false;
  DateTime? _pauseUntil;

  // Slots
  final _slots = <bool>[true, true, false, true, false, false, true]; // Mon-Sun

  // Message style
  String _messageStyle = 'discreet';

  static const _styles = {
    'discreet': 'Just checking in 🌿',
    'gentle': 'A moment for yourself 💭',
    'encouraging': 'You\'ve got this ✨',
    'minimal': 'Mind Recipe',
  };

  static const _days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Notification Scheduler', style: MindRecipeTokens.displayMedium(context)),
          const SizedBox(height: 8),
          Text('Gentle, discreet reminders. Nothing intrusive. You control when and how often.',
            style: MindRecipeTokens.bodyMedium(context)!.copyWith(color: MindRecipeTokens.gray600),
          ),
          const SizedBox(height: 20),

          // Master toggle
          Semantics(
            label: _enabled ? 'Notifications enabled' : 'Notifications disabled',
            child: SwitchListTile.adaptive(
              value: _enabled,
              onChanged: (v) => setState(() => _enabled = v),
              title: const Text('Enable wellness reminders', style: TextStyle(fontWeight: FontWeight.w600)),
              subtitle: Text(_enabled ? 'Active — ${_activeSlotsCount} reminders per week' : 'All reminders paused'),
              activeColor: MindRecipeTokens.primary,
            ),
          ),
          const SizedBox(height: 16),

          if (_enabled) ...[
            // Time slots
            _buildTimePicker('Morning reminder', _morningTime,
              (t) => setState(() => _morningTime = t)),
            _buildTimePicker('Midday check-in', _middayTime,
              (t) => setState(() => _middayTime = t)),
            _buildTimePicker('Evening reflection', _eveningTime,
              (t) => setState(() => _eveningTime = t)),
            const SizedBox(height: 16),

            // Days of week
            Text('Active days', style: MindRecipeTokens.title(context)),
            const SizedBox(height: 8),
            Wrap(spacing: 4, children: List.generate(7, (i) =>
              FilterChip(
                label: Text(_days[i]),
                selected: _slots[i],
                onSelected: (v) => setState(() => _slots[i] = v),
                selectedColor: MindRecipeTokens.primary.withAlpha(40),
              ),
            )),
            const SizedBox(height: 20),

            // Quiet hours
            Semantics(
              label: 'Quiet hours from ${_quietStart.format(context)} to ${_quietEnd.format(context)}',
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      SwitchListTile.adaptive(
                        value: _quietHoursEnabled,
                        onChanged: (v) => setState(() => _quietHoursEnabled = v),
                        title: const Text('Quiet hours', style: TextStyle(fontWeight: FontWeight.w600)),
                        subtitle: const Text('No notifications during your rest window'),
                        activeColor: MindRecipeTokens.primary,
                      ),
                      if (_quietHoursEnabled) Row(
                        children: [
                          Expanded(child: ListTile(
                            title: const Text('From'),
                            subtitle: Text(_quietStart.format(context)),
                            onTap: () async {
                              final t = await showTimePicker(context: context, initialTime: _quietStart);
                              if (t != null) setState(() => _quietStart = t);
                            },
                          )),
                          Expanded(child: ListTile(
                            title: const Text('Until'),
                            subtitle: Text(_quietEnd.format(context)),
                            onTap: () async {
                              final t = await showTimePicker(context: context, initialTime: _quietEnd);
                              if (t != null) setState(() => _quietEnd = t);
                            },
                          )),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Snooze / pause
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    Text('Snooze & pause', style: MindRecipeTokens.title(context)),
                    const SizedBox(height: 12),
                    if (_snoozed && _snoozeUntil != null)
                      _buildStatusChip('Snoozed until ${_formatDateTime(_snoozeUntil!)}', Icons.snooze, true)
                    else if (_paused && _pauseUntil != null)
                      _buildStatusChip('Paused until ${_formatDateTime(_pauseUntil!)}', Icons.pause_circle, true)
                    else
                      _buildStatusChip('Active — reminders will arrive as scheduled', Icons.check_circle, false),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        OutlinedButton.icon(
                          onPressed: _snoozed ? _cancelSnooze : _snoozeOneHour,
                          icon: Icon(_snoozed ? Icons.close : Icons.snooze),
                          label: Text(_snoozed ? 'Cancel snooze' : 'Snooze 1h'),
                        ),
                        const SizedBox(width: 8),
                        OutlinedButton.icon(
                          onPressed: _paused ? _cancelPause : _pauseOneDay,
                          icon: Icon(_paused ? Icons.close : Icons.pause_circle),
                          label: Text(_paused ? 'Cancel pause' : 'Pause 24h'),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Message style
            Text('Message style', style: MindRecipeTokens.title(context)),
            const SizedBox(height: 8),
            ...(_styles.entries.map((e) => RadioListTile<String>(
              title: Text(e.value),
              subtitle: Text(e.key),
              value: e.key,
              groupValue: _messageStyle,
              onChanged: (v) => setState(() => _messageStyle = v ?? 'discreet'),
              activeColor: MindRecipeTokens.primary,
              dense: true,
            ))),
          ],
          const SizedBox(height: 24),
          _buildWellnessBoundary(),
        ],
      ),
    );
  }

  Widget _buildTimePicker(String label, TimeOfDay time, ValueChanged<TimeOfDay> onChanged) => Card(
    child: ListTile(
      title: Text(label),
      subtitle: Text(time.format(context)),
      trailing: const Icon(Icons.schedule),
      onTap: () async {
        final t = await showTimePicker(context: context, initialTime: time);
        if (t != null) onChanged(t);
      },
    ),
  );

  Widget _buildStatusChip(String text, IconData icon, bool isActive) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
    decoration: BoxDecoration(
      color: (isActive ? MindRecipeTokens.warning : MindRecipeTokens.success).withAlpha(20),
      borderRadius: BorderRadius.circular(12),
    ),
    child: Row(mainAxisSize: MainAxisSize.min, children: [
      Icon(icon, size: 16, color: isActive ? MindRecipeTokens.warning : MindRecipeTokens.success),
      const SizedBox(width: 6),
      Text(text, style: TextStyle(color: isActive ? MindRecipeTokens.warning : MindRecipeTokens.success, fontSize: 13)),
    ]),
  );

  int get _activeSlotsCount => _slots.where((s) => s).length * 3;

  void _snoozeOneHour() => setState(() {
    _snoozed = true;
    _snoozeUntil = DateTime.now().add(const Duration(hours: 1));
    _paused = false; _pauseUntil = null;
  });

  void _cancelSnooze() => setState(() { _snoozed = false; _snoozeUntil = null; });

  void _pauseOneDay() => setState(() {
    _paused = true;
    _pauseUntil = DateTime.now().add(const Duration(hours: 24));
    _snoozed = false; _snoozeUntil = null;
  });

  void _cancelPause() => setState(() { _paused = false; _pauseUntil = null; });

  String _formatDateTime(DateTime dt) {
    final h = dt.hour % 12 == 0 ? 12 : dt.hour % 12;
    final m = dt.minute.toString().padLeft(2, '0');
    return '$h:$m ${dt.hour >= 12 ? 'PM' : 'AM'}';
  }

  Widget _buildWellnessBoundary() => const Text(
    'Mind Recipe is a wellness tool, not medical care. Notifications are not clinical alerts.',
    style: TextStyle(fontSize: 12, color: Colors.black54),
  );
}