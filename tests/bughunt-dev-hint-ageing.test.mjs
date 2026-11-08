import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
const constants = source.slice(source.indexOf('const TYPE_HINT_FULL_PAGES'), source.indexOf('function keycap('));
const tiers = source.slice(source.indexOf('function typeHintSeen('), source.indexOf('// Bank one showing'));
const apiStart = source.indexOf('    typingHint: {');
const apiEnd = source.indexOf('    // Timer', apiStart);

test('dev age-every-segment includes late suggestions and page insurance', () => {
  const h = vm.createContext({ settings: {}, window: {}, saveSettings() {}, applyInputHints() {} });
  vm.runInContext(constants + tiers + '\nthis.api = ({' + source.slice(apiStart, apiEnd) + '}); window.__dev = api;', h);
  const state = h.api.typingHint.age('off');
  for (const id of ['late-match', 'insure-page']) assert.equal(state[id], 30, id);
  assert.equal(h.typeHintTier({ id: 'late-match' }), 'off');
  assert.equal(h.typeHintTier({ id: 'insure-page', sticky: true }), 'short');
});
