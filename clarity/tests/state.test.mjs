import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { webcrypto } from 'node:crypto';
import ts from 'typescript';
globalThis.crypto ??= webcrypto;
globalThis.window = { matchMedia: () => ({ matches: false }) };
const code = ts.transpileModule(await readFile(new URL('../app/state.ts', import.meta.url), 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
const { streaks, initialSnapshot, withSavedCheckIn, withCompletedSession, hasData } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
test('several check-ins on one day do not break a consecutive-day streak', () => {
  const history = ['2026-11-16T12:00:00', '2026-11-16T08:00:00', '2026-11-15T08:00:00', '2026-11-14T08:00:00'].map(timestamp => ({ timestamp }));
  assert.deepEqual(streaks(history, new Date('2026-11-16T18:00:00')), { current: 3, longest: 3 });
});
test('zero activation and journal text survive saving, without duplicating the same entry', () => {
  const snapshot = initialSnapshot();
  snapshot.draft.activation = 0;
  snapshot.draft.journalEntry = 'What I want to remember';
  assert.equal(hasData(snapshot.draft), true);
  const saved = withSavedCheckIn(snapshot);
  assert.equal(saved.history[0].activation, 0);
  assert.equal(saved.history[0].journalEntry, 'What I want to remember');
  assert.equal(hasData(saved.draft), false);
  const again = withSavedCheckIn({ ...saved, draft: snapshot.draft });
  assert.equal(again.history.length, 1);
});

test('repeated Complete Session preserves the original check-in and never logs an empty draft', () => {
  const snapshot = initialSnapshot();
  Object.assign(snapshot.draft, { compassQuadrant: 'high-open', bodyZones: ['head'], lifeDomains: ['physical'] });
  snapshot.navigationStack = ['check-in-review'];
  const once = withCompletedSession(snapshot);
  const again = withCompletedSession(once);
  assert.equal(once.screen, 'home');
  assert.deepEqual(once.navigationStack, []);
  assert.equal(once.history.length, 1);
  assert.equal(once.history[0].id, snapshot.draft.id);
  assert.deepEqual(again, once);
  assert.equal(withCompletedSession(initialSnapshot()).history.length, 0);
});
