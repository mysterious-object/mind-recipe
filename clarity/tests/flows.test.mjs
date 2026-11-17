import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';
let server, browser, url;
const key = 'mindrecipe-clarity-preview-v1';
before(async () => {
  const html = await readFile(new URL('../../flutter/assets/clarity/index.html', import.meta.url));
  server = createServer((req, res) => { res.setHeader('Content-Type', 'text/html'); res.end(html); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  url = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
});
after(async () => { await browser?.close(); await new Promise(resolve => server?.close(resolve)); });
async function open(t) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.setDefaultTimeout(10000);
  t.after(async () => { await page.close(); assert.deepEqual(errors, []); });
  await page.goto(url);
  return page;
}
const button = (page, name) => page.getByRole('button', { name, exact: typeof name === 'string' });
async function onboard(page) {
  await button(page, "Okay, let's start").click();
  await page.getByPlaceholder('Your name').fill('Alex');
  await button(page, 'Continue').click();
  await button(page, 'Continue').click();
  await button(page, /do this later/i).click();
}
async function saved(page) { return page.evaluate(key => JSON.parse(localStorage.getItem(key)), key); }
async function noOverflow(page) { assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)); }

test('emotion check-in, zero activation, journal, and edit return survive reload', async t => {
  const page = await open(t); await onboard(page);
  await noOverflow(page);
  await button(page, 'Check-In').click();
  await button(page, /Emotions Pick/).click();
  await button(page, 'Calm').click();
  await button(page, /^Continue/).click();
  await button(page, '-5').click();
  await button(page, 'Next').click();
  await button(page, 'Chest').click();
  await button(page, 'Next').click();
  await button(page, 'Financial').click();
  await button(page, 'Log Now').click();
  await page.getByPlaceholder('Add anything you want to remember about this moment...').fill('A private reflection');
  await page.reload();
  assert.equal(await page.getByRole('textbox').inputValue(), 'A private reflection');
  await button(page, /Review/).click();
  await button(page, /Activation/).click();
  assert.equal(await button(page, '-5').count(), 1);
  await button(page, 'Next').click();
  await button(page, 'Save & Done').click();
  const state = await saved(page);
  assert.equal(state.history.length, 1);
  assert.equal(state.history[0].activation, 0);
  assert.deepEqual(state.history[0].bodyZones, ['chest']);
  assert.deepEqual(state.history[0].lifeDomains, ['financial']);
  assert.equal(state.history[0].journalEntry, 'A private reflection');
  await page.reload();
  await button(page, 'Insights').click();
  await button(page, 'Journal').click();
  assert.equal(await page.getByText('A private reflection', { exact: true }).count(), 1);
  await noOverflow(page);
});

test('compass path preserves position and saves a guided practice', async t => {
  const page = await open(t); await onboard(page);
  await button(page, 'Check-In').click();
  await button(page, /Compass/).click();
  await page.locator('.cursor-crosshair').click({ position: { x: 80, y: 80 } });
  await page.reload();
  await button(page, 'Next').click();
  await button(page, 'Chest').click();
  await button(page, 'Next').click();
  await button(page, 'Financial').click();
  await button(page, 'Continue').click();
  await button(page, 'View All Options').click();
  await button(page, /Shift Suggested techniques/).click();
  assert.equal(await page.getByText('AI-Powered Recommendation').count(), 0);
  await button(page, 'Start: 5-4-3-2-1 Technique').click();
  for (let i = 0; i < 4; i++) await button(page, 'Next step').click();
  await button(page, 'Finish and save').click();
  const state = await saved(page);
  assert.equal(state.history.length, 1);
  assert.equal(state.history[0].compassQuadrant, 'high-open');
  assert.deepEqual(state.history[0].tags, ['practice:54321']);
  assert.equal(state.history[0].activation, undefined);
});

test('Help Now opens once, logs a real moment, and does not erase a draft', async t => {
  const page = await open(t); await onboard(page);
  await button(page, /Help now -/).click();
  await button(page, 'Log this moment quietly').click();
  assert.equal((await saved(page)).history[0].tags[0], 'distress-moment');
  const help = button(page, /Help now -/);
  const box = await help.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down(); await page.waitForTimeout(650); await page.mouse.up();
  assert.equal(await page.getByText('I’ve got you.', { exact: true }).count(), 0);
  assert.equal(await page.getByText("I'm right here.", { exact: true }).count(), 1);
});

test('native lesson and support actions use the bridge, and failures remain visible', async t => {
  const page = await open(t);
  await page.addInitScript(() => {
    window.hostCalls = [];
    window.MindRecipeHost = { postMessage(raw) {
      const message = JSON.parse(raw); window.hostCalls.push(message);
      if (message.type === 'openLessons') return;
      const value = message.type === 'load' ? { screen: 'home', onboardingComplete: true, profile: { name: 'Alex' } } : null;
      queueMicrotask(() => window.mindRecipeReply(message.id, true, value));
    } };
  });
  await page.reload();
  await button(page, 'Call 988 Suicide and Crisis Lifeline').click();
  assert.equal(await page.evaluate(() => window.hostCalls.some(call => call.type === 'openUrl' && call.payload === 'tel:988')), true);
  await button(page, 'Mind Recipe').click();
  assert.equal(await page.evaluate(() => window.hostCalls.some(call => call.type === 'openLessons')), true);
  await page.evaluate(() => { const request = window.hostCalls.find(call => call.type === 'openLessons'); window.mindRecipeReply(request.id, false, 'Could not open lessons.'); });
  assert.match(await page.getByRole('alert').innerText(), /Could not open lessons/);
});

test('compact screens and support preferences remain usable after editing', async t => {
  const page = await open(t);
  await page.setViewportSize({ width: 320, height: 568 });
  await onboard(page);
  await button(page, 'Settings').click();
  await button(page, 'Edit').nth(2).click();
  await page.getByPlaceholder('Name', { exact: true }).fill('Sam');
  await page.getByPlaceholder('Phone number').fill('+15555550100');
  await page.getByPlaceholder('Your code word').fill('anchor');
  await page.getByText('Log it silently', { exact: true }).click();
  await button(page, /Save/).click();
  await page.reload();
  assert.equal((await saved(page)).profile.trustedContacts[0].name, 'Sam');
  await noOverflow(page);
  await button(page, 'Back').click();
  await button(page, 'Connect').click();
  assert.equal(await page.getByText('Sam', { exact: true }).count(), 1);
  await noOverflow(page);
});

test('failed writes show an actionable retry and save the latest snapshot', async t => {
  const page = await open(t); await onboard(page);
  await page.evaluate(() => {
    window.originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = () => { throw new Error('Storage full'); };
  });
  await button(page, 'Settings').click();
  assert.match(await page.getByRole('alert').innerText(), /could not be saved/);
  await page.evaluate(() => { Storage.prototype.setItem = window.originalSetItem; });
  await button(page, 'Retry').click();
  await page.waitForFunction(key => JSON.parse(localStorage.getItem(key)).screen === 'settings', key);
  await page.reload();
  assert.equal(await page.getByText('Safety & Privacy', { exact: true }).count(), 1);
});

test('a configured code word opens support without sending anything', async t => {
  const page = await open(t); await onboard(page);
  await page.evaluate(key => {
    const value = JSON.parse(localStorage.getItem(key));
    value.profile.safeWord = { word: 'anchor', action: 'show-crisis' };
    value.screen = 'understand';
    localStorage.setItem(key, JSON.stringify(value));
  }, key);
  await page.reload();
  await page.getByRole('textbox').fill('anchor');
  await page.getByRole('dialog', { name: 'Get Support' }).waitFor();
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('dialog').count(), 0);
  assert.equal(await page.getByRole('textbox').inputValue(), 'anchor');
});
