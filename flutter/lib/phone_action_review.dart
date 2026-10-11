import 'package:flutter/material.dart';

import 'chat_actions.dart';

Future<PhoneAction?> reviewPhoneAction(
  BuildContext context,
  PhoneAction draft,
) => showDialog<PhoneAction>(
  context: context,
  builder: (_) => _ActionReview(draft: draft),
);

class _ActionReview extends StatefulWidget {
  const _ActionReview({required this.draft});
  final PhoneAction draft;
  @override
  State<_ActionReview> createState() => _ActionReviewState();
}

class _ActionReviewState extends State<_ActionReview> {
  late final TextEditingController title = TextEditingController(
    text: widget.draft.title,
  );
  late final TextEditingController notes = TextEditingController(
    text: widget.draft.notes,
  );
  late DateTime? start = widget.draft.when;
  late DateTime? end = widget.draft.end;
  String? error;

  @override
  void dispose() {
    title.dispose();
    notes.dispose();
    super.dispose();
  }

  Future<void> chooseTime(bool ending) async {
    final today = DateTime.now();
    final selected = (ending ? end : start) ?? today;
    final date = await showDatePicker(
      context: context,
      initialDate: selected.isBefore(today) ? today : selected,
      firstDate: DateTime(today.year, today.month, today.day),
      lastDate: DateTime(today.year + 5),
    );
    if (date == null || !mounted) return;
    final time = await showTimePicker(
      context: context,
      initialTime: TimeOfDay.fromDateTime(selected),
    );
    if (time == null || !mounted) return;
    setState(() {
      final value = DateTime(
        date.year,
        date.month,
        date.day,
        time.hour,
        time.minute,
      );
      if (ending) {
        end = value;
      } else {
        start = value;
      }
      error = null;
    });
  }

  @override
  Widget build(BuildContext context) => AlertDialog(
    title: Text('Review ${widget.draft.summaryLabel.toLowerCase()}'),
    content: SingleChildScrollView(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          TextField(
            controller: title,
            decoration: const InputDecoration(labelText: 'Title'),
            maxLength: 240,
          ),
          ListTile(
            title: Text(
              start == null ? 'Choose date and time' : formatActionTime(start!),
            ),
            trailing: const Icon(Icons.edit_calendar),
            onTap: () => chooseTime(false),
          ),
          if (widget.draft.type == PhoneActionType.appointment)
            ListTile(
              title: Text(
                end == null
                    ? 'Choose end date and time'
                    : 'Ends ${formatActionTime(end!)}',
              ),
              trailing: const Icon(Icons.edit_calendar),
              onTap: () => chooseTime(true),
            ),
          if (widget.draft.type != PhoneActionType.alarm)
            TextField(
              controller: notes,
              decoration: const InputDecoration(labelText: 'Notes (optional)'),
              maxLength: 1000,
            ),
          Text(
            widget.draft.type == PhoneActionType.alarm
                ? Theme.of(context).platform == TargetPlatform.iOS
                      ? 'This build does not support creating iPhone alarms. Set this alarm in Clock; confirming here will not create it.'
                      : 'Destination: Clock. The clock app may set the next alarm immediately after you confirm.'
                : widget.draft.type == PhoneActionType.reminder
                ? Theme.of(context).platform == TargetPlatform.iOS
                      ? 'Destination: Reminders. Confirming requests a reminder on this device.'
                      : 'Destination: Calendar editor. This Android adapter proposes a one-hour calendar event, not a task or scheduled notification. Review and save it there.'
                : 'Destination: Calendar. Review the device result before considering this saved. Calendar events do not book an appointment with a provider.',
          ),
          if (error != null)
            Text(
              error!,
              style: TextStyle(color: Theme.of(context).colorScheme.error),
            ),
        ],
      ),
    ),
    actions: [
      TextButton(
        onPressed: () => Navigator.pop(context),
        child: const Text('Cancel'),
      ),
      FilledButton(
        onPressed: () {
          final action = PhoneAction(
            type: widget.draft.type,
            title: title.text.trim(),
            when: start,
            end: end,
            notes: notes.text.trim(),
          );
          final invalid = action.validationError(DateTime.now());
          if (invalid != null) {
            setState(() => error = invalid);
            return;
          }
          Navigator.pop(context, action);
        },
        child: const Text('Confirm'),
      ),
    ],
  );
}
