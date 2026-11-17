import type { CheckInEntry } from './types';
import { streaks } from './state';

export function insightSummary(history: CheckInEntry[]): string {
  const levels = history.flatMap(entry => entry.activation === undefined ? [] : [entry.activation]);
  const emotions = new Map<string, number>();
  for (const entry of history) for (const emotion of entry.emotions ?? []) emotions.set(emotion, (emotions.get(emotion) ?? 0) + 1);
  const top = [...emotions.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => `${name} (${count})`).join(', ');
  return [
    'Mind Recipe — Insight Summary',
    `Generated ${new Date().toLocaleDateString()}`,
    `Check-ins and marked moments: ${history.length}`,
    `Longest check-in streak: ${streaks(history).longest} days`,
    `Average reported activation (0–10): ${levels.length ? (levels.reduce((a, b) => a + b, 0) / levels.length).toFixed(1) : 'Not reported'}`,
    `Most recorded feelings: ${top || 'None recorded'}`,
    '', 'Journal text and trusted contact details are not included.',
  ].join('\n');
}
