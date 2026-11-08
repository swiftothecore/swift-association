import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
const start = source.indexOf('function nextBonusRound(');
const end = source.indexOf('function bonusPageEra(', start);

test('endless deal retries stay bounded when reshuffling retains slip IDs', () => {
  let attempts = 0, ended = 0;
  const h = vm.createContext({
    bonusDead: false, bonusEndless: true, bonusRound: 1, BONUS_ROUNDS: 10,
    bonusRecentSongs: [], onlyDealt: new Set(), slipDealt: new Set(['dealt-line']),
    bonusDealCount: () => 100,
    buildBonusPuzzle: () => { attempts++; return null; },
    endlessReshuffle: () => { h.bonusRecentSongs = []; h.onlyDealt = new Set(); },
    endBonusRun: () => { ended++; },
  });
  vm.runInContext(source.slice(start, end), h);
  assert.doesNotThrow(() => h.nextBonusRound());
  assert.equal(ended, 1);
  assert.equal(attempts, 13);
});
