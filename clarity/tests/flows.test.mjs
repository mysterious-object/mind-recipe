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
async function noOverflow(page) {
  const layout = await page.evaluate(() => {
    const width = document.documentElement.scrollWidth;
    if (width <= innerWidth + 1) return null;
    const outside = [...document.querySelectorAll('main *, header *, nav *, footer *')]
      .filter(el => el.getBoundingClientRect().right > innerWidth + 1)
      .map(el => [el.tagName, el.textContent.trim().slice(0, 32), Math.round(el.getBoundingClientRect().right)]);
    return { viewport: innerWidth, width, outside };
  });
  assert.equal(layout, null, JSON.stringify(layout));
}

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
      if (message.type === 'loadLibrary') return;
      const value = message.type === 'load' ? { screen: 'home', onboardingComplete: true, profile: { name: 'Alex' } } : null;
      queueMicrotask(() => window.mindRecipeReply(message.id, true, value));
    } };
  });
  await page.reload();
  await button(page, 'Call 988 Suicide and Crisis Lifeline').click();
  assert.equal(await page.evaluate(() => window.hostCalls.some(call => call.type === 'openUrl' && call.payload === 'tel:988')), true);
  await button(page, 'Mind Recipe').click();
  assert.equal(await page.evaluate(() => window.hostCalls.some(call => call.type === 'loadLibrary')), true);
  await page.evaluate(() => { const request = window.hostCalls.find(call => call.type === 'loadLibrary'); window.mindRecipeReply(request.id, false, 'Could not open lessons.'); });
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

test('narrow navigation reveals the selected tab after each screen mounts and reloads', async t => {
  const page = await open(t);
  await page.setViewportSize({ width: 320, height: 568 });
  await onboard(page);
  for (const name of ['Connect', 'Insights', 'Home']) {
    await button(page, name).click();
    await page.waitForFunction(({ key, screen }) => JSON.parse(localStorage.getItem(key)).screen === screen, { key, screen: name.toLowerCase() });
    await page.reload();
    assert.equal(await page.locator('nav [aria-current="page"]').innerText(), name);
    const visible = await page.getByRole('navigation', { name: 'Main navigation' }).evaluate(nav => {
      const active = nav.querySelector('[aria-current="page"]').getBoundingClientRect();
      const bounds = nav.getBoundingClientRect();
      return active.left >= bounds.left - 1 && active.right <= bounds.right + 1;
    });
    assert.equal(visible, true, name + ' must remain visible');
    await noOverflow(page);
  }
});

test('Help now stays inside the support footer at mobile and desktop sizes', async t => {
  const page = await open(t); await onboard(page);
  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    for (const position of ['top', 'bottom']) {
      await page.evaluate(position => window.scrollTo(0, position === 'top' ? 0 : document.body.scrollHeight), position);
      const help = await button(page, /Help now -/).boundingBox();
      const footer = await page.getByRole('contentinfo', { name: 'Support options' }).boundingBox();
      assert.ok(help.x >= footer.x && help.x + help.width <= footer.x + footer.width + 1);
      assert.ok(help.y >= footer.y && help.y + help.height <= footer.y + footer.height + 1);
      await noOverflow(page);
    }
  }
  await button(page, /Help now -/).click();
  await page.getByRole('dialog').waitFor();
});

test('learning search, favorites, completion and private reflection survive reload at cover width', async t => {
  const page = await open(t);
  await page.evaluate(() => localStorage.setItem('mindrecipe-clarity-preview-v1',
    JSON.stringify({ screen: 'learn', onboardingComplete: true, profile: {name: 'Alex'} })));
  await page.reload();
  await page.getByRole('textbox', { name: 'Search resources' }).fill('mindfulness');
  await button(page, 'Favorite Mindfulness').click();
  await page.setViewportSize({ width: 320, height: 720 });
  await page.addStyleTag({ content: 'html { font-size: 125% !important; }' });
  await page.waitForFunction(() => {
    const nav = document.querySelector('nav[aria-label="Main navigation"]');
    const viewport = nav.getBoundingClientRect();
    const tab = nav.querySelector('[aria-current="page"]').getBoundingClientRect();
    return tab.left >= viewport.left - 1 && tab.right <= viewport.right + 1;
  });
  await noOverflow(page);
  await button(page, 'Favorites').click();
  await button(page, 'View Mindfulness').click();
  await page.getByLabel('Private reflection').fill('An example reflection');
  await button(page, 'Save reflection').click();
  await page.getByText('Reflection saved on this device.').waitFor();
  await button(page, 'Mark complete').click();
  await button(page, 'Completed').waitFor();
  await page.reload();
  await button(page, 'Favorites').click();
  await button(page, 'View Mindfulness').click();
  assert.equal(await page.getByLabel('Private reflection').inputValue(), 'An example reflection');
  assert.equal(await button(page, 'Completed').isDisabled(), true);
  await noOverflow(page);
});

test('cover navigation keeps destination names legible and fits Connect and support controls', async t => {
  const page = await open(t);
  await onboard(page);
  for (const width of [320, 360, 390, 640]) {
    await page.setViewportSize({ width, height: 886 });
    for (const scale of [100, 125]) {
      await page.evaluate(scale => document.documentElement.style.fontSize = scale + '%', scale);
      const nav = page.getByRole('navigation', { name: 'Main navigation' });
      if (width < 640) {
        assert.equal(await nav.getByRole('button').count(), 6);
        assert.ok(await nav.evaluate(el => el.scrollWidth <= el.clientWidth + 1));
        const brokenWords = await nav.locator('button span').evaluateAll(labels => labels.flatMap(label => {
          const node = label.firstChild;
          return Array.from(node.textContent.matchAll(/\w+/g)).filter(match => {
            const range = document.createRange();
            range.setStart(node, match.index);
            range.setEnd(node, match.index + match[0].length);
            return range.getClientRects().length > 1;
          }).map(match => match[0]);
        }));
        assert.deepEqual(brokenWords, []);
      }
      await button(page, 'Connect').click();
      const personal = button(page, 'Personal');
      const support = button(page, 'Support');
      const boxes = await Promise.all([personal, button(page, 'MindRecipe'), support].map(el => el.boundingBox()));
      assert.ok(boxes.every(box => box && Math.abs(box.y - boxes[0].y) <= 1 && box.height >= 44 && box.x >= 0 && box.x + box.width <= width + 1));
      await support.click();
      assert.equal(await support.getAttribute('aria-pressed'), 'true');
      if (width < 640) {
        const footer = page.getByRole('contentinfo', { name: 'Support options' });
        const buttons = await footer.getByRole('button').evaluateAll(els => els.map(el => ({ y: el.offsetTop, h: el.offsetHeight })));
        assert.ok(buttons.every(b => b.h >= 44 && b.y === buttons[0].y));
        const height = (await footer.boundingBox()).height;
        // Allow the legal copy to wrap when the member enlarges text.
        assert.ok(height <= (scale === 100 ? 120 : 170), width + 'px at ' + scale + '%: footer height ' + height);
      }
      await noOverflow(page);
      await button(page, 'Home').click();
    }
  }
});

test('assessment actions and Insights tabs fit the cover screen', async t => {
  const page = await open(t);
  await page.setViewportSize({ width: 320, height: 886 });
  for (const [screen, names] of [
    ['check-in-review', ['Show Recommendations', 'View All Options']],
    ['insights', ['Overview', 'Calendar', 'Timeline', 'Journal']],
  ]) {
    await page.evaluate(({ key, screen }) => localStorage.setItem(key, JSON.stringify({
      screen, onboardingComplete: true, profile: { name: 'Alex' },
    })), { key, screen });
    await page.reload();
    await page.addStyleTag({ content: 'html { font-size: 125% !important; }' });
    for (const name of names) {
      const rect = await button(page, name).boundingBox();
      assert.ok(rect && rect.x >= 0 && rect.x + rect.width <= 321 && rect.height >= 44, name);
    }
  }
});
