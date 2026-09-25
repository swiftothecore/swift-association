import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const app = readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
const section = (from, to) => app.slice(app.indexOf(from), app.indexOf(to, app.indexOf(from)));
function storage() {
  const values = new Map();
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: (key) => values.delete(key) };
}
function checkpointHarness(navigation = 'reload') {
  const stats = [], tally = [];
  const context = vm.createContext({ sessionStorage: storage(), localStorage: storage(),
    performance: { getEntriesByType: () => [{ type: navigation }] },
    runFolded: false, runProgressId: 'tab:run', TAB_ID: 'tab', gameType: 'classic',
    roundResults: [true, false], roundSongs: ['Love Story', null], roundAlbums: ['Fearless', null],
    roundWords: ['love', 'blue'], score: 1, gameMaxStreak: 1, boardMode: () => 'easy',
    updateStats: (...args) => stats.push(args), recordGameTally: (rounds) => tally.push(rounds),
  });
  vm.runInContext(section('const RUN_CHECKPOINT_KEY', '// Fold the rounds completed so far'), context);
  return { context, stats, tally, run: (code) => vm.runInContext(code, context) };
}

test('background checkpoints do not bank a live run; reload recovers its earned pages once', () => {
  const h = checkpointHarness();
  h.run('checkpointRunProgress(); checkpointRunProgress()');
  assert.equal(h.stats.length, 0);
  const saved = h.context.sessionStorage.getItem('swiftSongAssociation.runCheckpoint');
  assert.equal(h.run('recoverRunProgress()'), true);
  assert.deepEqual(h.stats, [[1, 'easy', 1, false]]);
  assert.equal(h.tally[0].length, 2);
  assert.equal(h.tally[0][0].title, 'Love Story');
  assert.equal(h.run('recoverRunProgress()'), false);
  h.context.sessionStorage.setItem('swiftSongAssociation.runCheckpoint', saved);
  assert.equal(h.run('recoverRunProgress()'), false);
  assert.equal(h.stats.length, 1);
});

test('normal finish consumes recovery checkpoint without banking a second partial game', () => {
  const h = checkpointHarness();
  h.run('checkpointRunProgress(); consumeRunCheckpoint(runProgressId)');
  assert.equal(h.run('recoverRunProgress()'), false);
  assert.equal(h.stats.length, 0);
});

test('new and duplicated navigations cannot adopt copied live tab state', () => {
  const h = checkpointHarness('navigate');
  h.run('checkpointRunProgress()');
  assert.equal(h.run('recoverRunProgress()'), false);
  assert.equal(h.stats.length, 0);
});

test('Daily and sandboxed runs never enter ordinary progress recovery', () => {
  for (const type of ['daily', 'challenge', 'album', 'custom', 'guest', 'ruthless', 'lineup']) {
    const h = checkpointHarness();
    h.context.gameType = type;
    h.run('checkpointRunProgress()');
    assert.equal(h.context.sessionStorage.getItem('swiftSongAssociation.runCheckpoint'), null, type);
  }
});

test('Infinite recovery uses pages survived and cannot set a personal best', () => {
  const h = checkpointHarness('back_forward');
  h.context.gameType = 'infinite';
  h.context.score = 200;
  h.run('checkpointRunProgress(); recoverRunProgress()');
  assert.deepEqual(h.stats, [[2, 'easy', 1, false]]);
});

test('damaged checkpoints and inaccessible storage do not break startup', () => {
  const h = checkpointHarness();
  h.context.sessionStorage.setItem('swiftSongAssociation.runCheckpoint', '{broken');
  assert.equal(h.run('recoverRunProgress()'), false);
  h.context.sessionStorage.getItem = () => { throw Error('blocked'); };
  h.context.sessionStorage.setItem = () => { throw Error('blocked'); };
  h.context.sessionStorage.removeItem = () => { throw Error('blocked'); };
  assert.doesNotThrow(() => h.run('checkpointRunProgress(); recoverRunProgress()'));
});

function pauseHarness() {
  let now = 1000;
  const started = [];
  const context = vm.createContext({ performance: { now: () => now },
    screens: { game: { classList: { contains: () => true } } },
    settingsPauseActive: false, roundLocked: false, roundStart: 100,
    pausedClockState: null, pausedStopwatchAt: null, pausedVanishRemaining: null, pausedBonusState: null,
    settingsDeferredRoundClock: false, vanishTimer: null, timerId: 1, revolveId: 1, revolveDeadline: 1600,
    roundClockTotal: 10, clockRemaining: () => 7200, comboRuleActive: () => false,
    clearTimer: () => { context.timerId = null; },
    startTimer: (...args) => { started.push(args); context.timerId = 1; },
    pauseBonusForSettings: () => null, resumeBonusFromSettings: () => {},
    pauseCurtainTimers: () => {}, resumeCurtainTimers: () => {}, beginRoundClock: () => {},
  });
  vm.runInContext(section('const runPauseOwners', '// Cover a hidden run'), context);
  return { context, started, time: (value) => { now = value; }, run: (code) => vm.runInContext(code, context) };
}

test('Settings and hidden-page owners freeze the exact countdown once until both release it', () => {
  const h = pauseHarness();
  h.run('pauseForSettings(); pauseForSettings("background")');
  h.time(4000);
  h.run('resumeFromSettings("background")');
  assert.equal(h.context.settingsPauseActive, true);
  assert.equal(h.started.length, 0);
  h.time(5000);
  h.run('resumeFromSettings()');
  assert.equal(h.context.settingsPauseActive, false);
  assert.equal(h.context.roundStart, 4100);
  assert.deepEqual(h.started, [[7200, 10, 600]]);
  h.run('resumeFromSettings()');
  assert.equal(h.started.length, 1);
});

test('a page that finishes turning behind a pause starts its fresh clock only on resume', () => {
  const h = pauseHarness();
  h.context.timerId = null;
  let freshStarts = 0;
  h.context.beginRoundClock = () => { freshStarts++; };
  h.run('pauseForSettings("background")');
  h.context.settingsDeferredRoundClock = true;
  h.time(5000);
  h.run('resumeFromSettings("background")');
  assert.equal(freshStarts, 1);
  assert.equal(h.started.length, 0);
});
