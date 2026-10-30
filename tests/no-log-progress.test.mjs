import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const app = readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
const progress = app.slice(app.indexOf('const RUN_CHECKPOINT_KEY'), app.indexOf('/* ---------- The typing hint'));
function harness(noLog) {
  const values = new Map(), writes = [];
  const h = vm.createContext({ devNoLog: noLog, runFolded: false, gameType: 'classic',
    runProgressId: 'test-run', TAB_ID: 'tab', score: 1, gameMaxStreak: 1,
    roundResults: [true], roundSongs: ['Example'], roundAlbums: ['Red'], roundWords: ['gold'],
    boardMode: () => 'easy',
    sessionStorage: { getItem: k => values.get(k) ?? null, setItem: (k, v) => values.set(k, v), removeItem: k => values.delete(k) },
    consumeRunCheckpoint: () => true, updateStats: (...args) => writes.push(args), foldCatalogue: rows => writes.push(rows),
  });
  vm.runInContext(progress, h);
  return { h, values, writes };
}

test('no-log ordinary runs never create a recovery checkpoint or fold abandoned pages', () => {
  const { h, values, writes } = harness(true);
  for (const kind of ['classic', 'infinite']) {
    h.gameType = kind;
    h.checkpointRunProgress(true);
    assert.equal(values.size, 0);
    h.foldRunProgress();
    assert.equal(values.size, 0);
    assert.equal(writes.length, 0);
  }
});

test('ordinary logged pages still create recovery checkpoints', () => {
  const { h, values } = harness(false);
  h.checkpointRunProgress(false);
  assert.equal(JSON.parse(values.get('swiftSongAssociation.runCheckpoint')).rounds.length, 1);
});

test('enabling no-log clears a checkpoint already created by the live run', () => {
  const { h, values } = harness(false);
  h.checkpointRunProgress(false);
  const setter = app.match(/setNoLog: (\(on\) => \{[^\n]+\})/)[1];
  vm.runInContext(`(${setter})(true)`, h);
  assert.equal(h.devNoLog, true);
  assert.equal(values.size, 0);
});
