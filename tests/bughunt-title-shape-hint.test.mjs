import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
const hintStart = source.indexOf('function useHint()');
const hintEnd = source.indexOf('// The hint stamp', hintStart);
const countStart = source.indexOf('function titleWordCount(');
const countEnd = source.indexOf('/* ---------- Resolving a typed title', countStart);

test('title-shape hints count hyphens and slashes without losing ellipsis boundaries', () => {
  for (const [title, words] of [['Anti-Hero', 2], ['Up/Down', 2], ['Come Back...Be Here', 4], ['Come Back…Be Here', 4]]) {
    const box = { innerHTML: '' };
    const h = vm.createContext({
      roundClockPending: false, hintsAllowed: () => true, hintTier: 1,
      roundHintSong: { title }, hintBudgetActive: () => false, albumHintLadder: () => false,
      $: id => id === 'hintBox' ? box : null,
      hintUrgeTimer: null, clearTimeout() {}, dismissCoachmark() {},
      songCount: () => 1, currentSongs: [], albumColor: () => '', escapeHtml: String,
      playSound() {}, applyInputHints() {},
    });
    vm.runInContext(source.slice(countStart, countEnd) + source.slice(hintStart, hintEnd), h);
    h.useHint();
    assert.match(box.innerHTML, new RegExp('· ' + words + ' words'), title);
  }
});
