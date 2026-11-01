import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { MODES, MODE_ORDER, MODALITY_MODES } from '../js/config.js';

const source = readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
const start = source.indexOf('function renderStats(');
const end = source.indexOf('// Highest-count entry', start);

test('Stats uses the saved difficulty after a Custom run on either entry path', () => {
  for (const requested of ['custom', 'classic']) {
    let rendered;
    const el = { innerHTML: '', querySelectorAll: () => [], querySelector: () => null };
    const context = vm.createContext({
      MODES, MODE_ORDER, MODALITY_MODES, INF_GLYPH: '',
      currentMode: { id: 'custom' }, lastStatsDifficulty: null,
      loadMode: () => MODES.hard, defaultStatsView: () => 'custom',
      $: () => el, loadStats: () => ({}),
      statsBoardHTML: (stats, view) => { rendered = view; return ''; },
      alignStatsTicket() {}, bleedStatsBlotter() {},
    });
    vm.runInContext(source.slice(start, end), context);
    context.renderStats(null, requested);
    assert.equal(rendered, 'hard', requested);
    assert.equal(context.lastStatsDifficulty, 'hard', requested);
  }
});
