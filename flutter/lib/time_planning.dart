/// Typed, device-only arithmetic. This never schedules or executes an action.
class PlanTask {
  const PlanTask(this.label, this.minutes);
  final String label;
  final int minutes;
}

class TimePlan {
  const TimePlan(this.tasks, this.budget, {this.startMinute});
  final List<PlanTask> tasks;
  final int budget;
  final int? startMinute;
  int get allocated => tasks.fold(0, (sum, task) => sum + task.minutes);

  String render() {
    var offset = 0;
    String point(int minute) {
      if (startMinute == null) return '$minute';
      final absolute = startMinute! + minute;
      final clock = '${((absolute ~/ 60) % 24).toString().padLeft(2, '0')}:${(absolute % 60).toString().padLeft(2, '0')}';
      return absolute >= 1440 ? '$clock (+${absolute ~/ 1440} day)' : clock;
    }
    final lines = <String>['Device plan · checked arithmetic',
      'Total: $budget minutes${startMinute == null ? ' · relative minute ranges' : ''}.'];
    for (final task in tasks) {
      final end = offset + task.minutes;
      lines.add('${point(offset)}–${point(end)}${startMinute == null ? ' min' : ''}: ${task.label} (${task.minutes} minutes)');
      offset = end;
    }
    if (offset < budget) {
      lines.add('${point(offset)}–${point(budget)}${startMinute == null ? ' min' : ''}: Unallocated buffer (${budget - offset} minutes)');
    }
    lines.add('Planning only. Nothing has been added to a calendar.');
    return lines.join('\n');
  }
}

class PlanningReply {
  const PlanningReply(this.text, {this.plan, this.clarification = false});
  final String text;
  final TimePlan? plan;
  final bool clarification;
}

/// Reconstructs only member-provided facts, including edits, from the thread.
/// A fresh quantified plan replaces the previous one; unrelated turns do not.
PlanningReply? resolveTimePlanning(List<String> memberTurns) {
  TimePlan? state;
  PlanningReply? latest;
  final duration = RegExp(r'(\d+(?:\.\d+)?)\s*(minutes?|mins?|hours?|hrs?)\b', caseSensitive: false);
  int? minutes(RegExpMatch match, [int number = 1, int unit = 2]) {
    final value = double.parse(match.group(number)!) *
        (match.group(unit)!.toLowerCase().startsWith('h') ? 60 : 1);
    return value == value.roundToDouble() && value > 0 && value <= 1440 ? value.toInt() : null;
  }
  for (final message in memberTurns) {
    latest = null;
    final lower = message.toLowerCase().replaceAll('’', "'");
    if (RegExp(r'-\s*\d+(?:\.\d+)?\s*(?:minutes?|mins?|hours?|hrs?)\b').hasMatch(lower)) {
      latest = const PlanningReply('Durations must be positive. Which task duration should change?', clarification: true);
      continue;
    }
    final requestsPlan = RegExp(r'\b(?:plan|time budget|time allocation|minute ranges|organize my|prepare for|prepare me)\b').hasMatch(lower);
    final edits = state != null && RegExp(r'\b(?:change|make|reduce|increase|instead|actually|only have|start|begin|move|replace|correction)\b').hasMatch(lower);
    if (!requestsPlan && !edits) continue;
    final all = duration.allMatches(message).toList();
    var budgetMatch = RegExp(r'(?:plan\s+(?:exactly\s+|for\s+)?|(?:i\s+)?(?:only\s+)?have\s+|within\s+|budget\s*(?:to\s+|of\s+|is\s+)?|total\s*(?:to\s+|of\s+|is\s+)?|exactly\s+|next\s+)(\d+(?:\.\d+)?)\s*(minutes?|mins?|hours?|hrs?)\b', caseSensitive: false).firstMatch(message);
    if (budgetMatch != null && RegExp(r'^(?:i\s+)?(?:only\s+)?have', caseSensitive: false).hasMatch(budgetMatch[0]!) &&
        RegExp(r'^\s+of\s+', caseSensitive: false).hasMatch(message.substring(budgetMatch.end))) budgetMatch = null;
    int? budget = budgetMatch == null ? null : minutes(budgetMatch);
    if (RegExp(r'\bnext hour\b').hasMatch(lower)) budget = 60;
    if (budget == null && edits && all.length == 1 && RegExp(r'\b(?:make it|change (?:the )?(?:total|budget))\b').hasMatch(lower)) budget = minutes(all.single);
    var anchor = state?.startMinute;
    final anchorMatch = RegExp(r'\b(?:start(?:ing)?(?: at)?|begin(?:ning)?(?: at)?|from|at)\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b', caseSensitive: false).firstMatch(message);
    if (anchorMatch != null) {
      var hour = int.parse(anchorMatch[1]!);
      final minute = int.tryParse(anchorMatch[2] ?? '0')!;
      final meridiem = anchorMatch[3]?.toLowerCase();
      if (minute > 59 || hour > 23 || (meridiem != null && (hour < 1 || hour > 12)) ||
          (meridiem == null && anchorMatch[2] == null)) {
        latest = const PlanningReply('Please specify an unambiguous start time, such as 15:00 or 3 pm.', clarification: true);
        continue;
      }
      if (meridiem != null) hour = hour % 12 + (meridiem == 'pm' ? 12 : 0);
      anchor = hour * 60 + minute;
    }
    final tasks = <PlanTask>[];
    var invalid = false;
    for (var i = 0; i < all.length; i++) {
      final match = all[i];
      if (budgetMatch != null && match.start >= budgetMatch.start && match.end <= budgetMatch.end) continue;
      if (edits && budget != null && all.length == 1 && RegExp(r'\bmake it\b').hasMatch(lower)) continue;
      final value = minutes(match);
      if (value == null) { invalid = true; break; }
      final stop = i + 1 < all.length ? all[i + 1].start : message.length;
      var label = message.substring(match.end, stop).split(RegExp(r'[,.;:\n]')).first.trim();
      label = label.replaceFirst(RegExp(r'^(?:of|for)\s+', caseSensitive: false), '').replaceFirst(RegExp(r'\s+and$', caseSensitive: false), '').trim();
      if (label.isEmpty) {
        final before = message.substring(i == 0 ? 0 : all[i - 1].end, match.start).split(RegExp(r'[,.;:\n]')).last.trim();
        label = before.replaceFirst(RegExp(r'^(?:and\s+)?(?:(?:make|change|reduce|increase|set)\s+)?(?:the\s+)?', caseSensitive: false), '')
            .replaceFirst(RegExp(r'\s+(?:to|for|is|=)$', caseSensitive: false), '').trim();
      }
      if (RegExp(r'^(?:before|until|available|total|budget|plan|i have|exactly|at|starting|of email and)', caseSensitive: false).hasMatch(label)) continue;
      if (label.isEmpty || label.length > 70 || label.contains(RegExp(r'\d')) || label.contains('?')) { invalid = true; break; }
      // A time anchor is not part of the task's name.
      label = label.replaceFirst(RegExp(r'\s+(?:starting|start|beginning|at)\b.*$', caseSensitive: false), '').trim();
      tasks.add(PlanTask(label, value));
    }
    if (invalid || (budgetMatch != null && budget == null)) {
      latest = const PlanningReply('Please give a positive whole-minute duration and a clear name for each task (for example, 15 minutes reading). I will calculate matching ranges.', clarification: true);
      continue;
    }
    if (all.isEmpty && RegExp(r'\d{1,2}:\d{2}\s*[-–]').hasMatch(message)) {
      latest = const PlanningReply('Please give each task duration in minutes or hours and a single start time. I will calculate consistent start/end ranges.', clarification: true);
      continue;
    }
    final explicitEdit = RegExp(r'\b(?:change|make|reduce|increase|instead|actually|correction)\b').hasMatch(lower);
    final fresh = requestsPlan && !explicitEdit && (tasks.isNotEmpty || budget != null);
    var nextTasks = fresh ? tasks : [...?state?.tasks];
    if (fresh && anchorMatch == null) anchor = null;
    if (!fresh && tasks.isNotEmpty) {
      if (state == null) nextTasks = tasks;
      else {
        for (final task in tasks) {
          final indices = [for (var i = 0; i < nextTasks.length; i++) if (nextTasks[i].label.toLowerCase() == task.label.toLowerCase()) i];
          if (indices.length != 1) { invalid = true; break; }
          nextTasks[indices.single] = task;
        }
      }
    }
    // A preparation plan is a requested task, not a mood inference. It uses
    // the stated deadline and two practical work steps, never a breathing cue.
    if (nextTasks.isEmpty && budget != null && budget >= 2 &&
        RegExp(r'\bmeeting\b').hasMatch(lower) && requestsPlan) {
      final first = (budget * .6).floor();
      nextTasks = [PlanTask('Review the agenda/materials and note your key points', first),
        PlanTask('Rehearse a concise update and check meeting logistics', budget - first)];
    }
    if (nextTasks.isEmpty || invalid) {
      latest = const PlanningReply('Which tasks and durations should this plan include? Name the task to edit if you are correcting a previous plan.', clarification: true);
      continue;
    }
    budget ??= (fresh ? null : state?.budget) ?? nextTasks.fold<int>(0, (sum, task) => sum + task.minutes);
    var sum = nextTasks.fold<int>(0, (sum, task) => sum + task.minutes);
    if (sum < budget && RegExp(r'\binclude (?:a |an? )?break\b').hasMatch(lower) &&
        !nextTasks.any((task) => RegExp(r'\bbreak\b', caseSensitive: false).hasMatch(task.label))) {
      nextTasks = [...nextTasks, PlanTask('Break', budget - sum)];
      sum = budget;
    }
    if (nextTasks.map((t) => t.label.toLowerCase()).toSet().length != nextTasks.length) {
      latest = const PlanningReply('Please give duplicate tasks distinct names so edits cannot change the wrong task.', clarification: true);
      continue;
    }
    state = TimePlan(List.unmodifiable(nextTasks), budget, startMinute: anchor);
    if (sum > budget) {
      latest = PlanningReply('These tasks total $sum minutes, exceeding the $budget-minute budget by ${sum - budget} minutes. Which duration should change, or should the total budget increase? Nothing has been scheduled.', clarification: true);
      continue;
    }
    latest = PlanningReply(state.render(), plan: state);
  }
  return latest;
}
