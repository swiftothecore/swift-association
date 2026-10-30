import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const app = readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
const countdown = app.slice(app.indexOf('let dailyCountdownTimer = null;'), app.indexOf('function setGameType('));

test('the Daily ticket counts its final second without redrawing until the date changes', () => {
  let day = '2026-10-30', renders = 0, notes = [{ textContent: '' }];
  const timers = new Map();
  const h = vm.createContext({
    document: { querySelectorAll: () => notes },
    todayKey: () => day, msUntilDailyReset: () => 500,
    formatResetCountdown: () => '0m 00s',
    setInterval(fn) { timers.set(1, fn); return 1; },
    clearInterval(id) { timers.delete(id); },
    renderDailyButtonState() {
      renders++;
      if (day === '2026-10-30') h.startResetCountdown();
      else { notes = []; h.stopResetCountdown(); }
    },
  });
  vm.runInContext(countdown, h);
  assert.doesNotThrow(() => h.startResetCountdown());
  assert.equal(renders, 0);
  assert.equal(notes[0].textContent, '0m 00s');
  day = '2026-10-31';
  timers.get(1)();
  assert.equal(renders, 1);
  assert.equal(timers.size, 0);
});
