import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import * as util from '../js/util.js';
import * as config from '../js/config.js';
import { challengeRecord, loadChallengeState } from '../js/storage.js';
import { countDots } from '../js/countdots.js';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const app = read('../js/app.js');
const fn = (source, name) => {
  const at = source.indexOf(`function ${name}(`);
  assert.ok(at >= 0, name);
  return source.slice(at, source.indexOf('\n}', at) + 2);
};
const songs = JSON.parse(read('../data/songs.json')).flatMap(({ album, songs }) =>
  songs.map((s) => ({ ...s, album, lyrics: s.sections.flatMap((sec) => sec.lines || []).join('\n') })));

// A full matrix oracle, independent of the production implementation's row reuse.
function fullRatio(pattern, text) {
  if (!pattern.length || !text.length) return 0;
  const matrix = Array.from({ length: pattern.length + 1 }, () => Array(text.length + 1).fill(0));
  for (let i = 1; i <= pattern.length; i++) {
    matrix[i][0] = i;
    for (let j = 1; j <= text.length; j++) matrix[i][j] = Math.min(
      matrix[i - 1][j] + 1, matrix[i][j - 1] + 1,
      matrix[i - 1][j - 1] + Number(pattern[i - 1] !== text[j - 1]));
  }
  return Math.max(0, 1 - Math.min(...matrix.at(-1)) / pattern.length);
}

test('fuzzy early exit preserves acceptance, exact accepted scores and boundary ties', () => {
  const rng = util.mulberry32(13);
  const randomText = (n) => Array.from({ length: n }, () => 'abcde '[Math.floor(rng() * 6)]).join('');
  const cases = [['', 'abc'], ['abc', ''], ['abcde', 'xbcde'], ['abcdefghij', 'xxcdefghij']];
  for (let i = 0; i < 3000; i++) cases.push([randomText(Math.floor(rng() * 45)), randomText(Math.floor(rng() * 80))]);
  for (const [pattern, text] of cases) {
    const exact = fullRatio(pattern, text);
    assert.equal(util.fuzzySubstringRatio(pattern, text), exact);
    for (const minimum of [0, 0.5, 0.75, 0.78, 0.8, 1, exact]) {
      const actual = util.fuzzySubstringRatio(pattern, text, minimum);
      assert.equal(actual >= minimum, exact >= minimum);
      if (exact >= minimum) assert.equal(actual, exact);
    }
  }
});

test('bonus pages build only their required indexes and restore the right corpus cache', () => {
  const calls = [];
  const builders = {
    buildLineIndex: 'line', buildSlipContext: 'context', buildWordIndex: 'word', buildTrackIndex: 'track',
  };
  const games = {
    'spot-the-slip': ['line', 'context'], 'sing-it-back': ['context'], redacted: ['context', 'line'],
    'only-here': ['word'], 'then-what': [], 'running-order': ['track'], 'word-cloud': ['word'],
    'aaron-or-jack': [], 'who-held-the-pen': [], nashville: [], 'the-capitals': [], ruthless: [],
    'name-that-song': ['line'],
  };
  const context = vm.createContext({ ...config, Math, allSongs: songs, playableWords: [],
    bonusRecentSongs: [], bonusRecentAlbums: [], bonusRecentFakes: [], onlyDealt: [],
    bonusRound: 1, producerCredits: {}, writerCredits: {}, nashvillePool: [], secretMessages: [],
    bonusSongs: () => songs, activeLens: () => 'top',
  });
  for (const [name, label] of Object.entries(builders)) context[name] = (corpus) => {
    calls.push(label); return { label, corpus };
  };
  for (const name of ['Slip', 'Blank', 'Redacted', 'OnlyHere', 'Chain', 'Track', 'Cloud', 'Producer', 'Pen', 'Nashville', 'Capitals', 'Ruthless', 'Name']) {
    context[`build${name}Puzzle`] = (...args) => ({ name, args });
  }
  const start = app.indexOf('const bonusCorpusIndexes');
  vm.runInContext(app.slice(start, app.indexOf('// What the whole shelf deals from:', start)) + fn(app, 'buildBonusPuzzle'), context);
  for (const [id, expected] of Object.entries(games)) {
    context.allSongs = [...songs];
    context.bonusGame = { id };
    context.isRuthlessRun = () => id === 'ruthless';
    calls.length = 0;
    context.buildBonusPuzzle();
    assert.deepEqual(calls, expected, id);
    calls.length = 0;
    context.buildBonusPuzzle();
    assert.deepEqual(calls, [], `${id} reuses its indexes`);
  }
  context.allSongs = songs;
  const taylor = context.bonusIndexes();
  assert.equal(taylor.wordIndex.corpus, songs);
  const guest = [{}];
  context.allSongs = guest;
  assert.equal(context.bonusIndexes().wordIndex.corpus, guest);
  assert.equal(taylor.lineIndex.corpus, songs, 'a lazy getter retains the corpus it was created for');
  context.allSongs = songs;
  assert.equal(context.bonusIndexes(), taylor);
});

test('challenge rows use one fresh board snapshot and preserve pins and locks', () => {
  const previous = globalThis.localStorage;
  let reads = 0;
  let board = { a: { pinned: true, unlocked: true, earnest: 7 }, b: { pinned: true, defeated: true },
    c: { pinned: true, unlocked: true, darkDefeated: true }, d: { unlocked: true }, locked: { pinned: true } };
  globalThis.localStorage = { getItem: () => { reads++; return JSON.stringify(board); } };
  try {
    const roster = ['a', 'b', 'c', 'd', 'locked', 'mastery'].map((id) => ({ id, name: id, tapes: 1, free: id === 'b', mastery: id === 'mastery' ? 1 : 0 }));
    const el = { innerHTML: '', querySelectorAll: () => [], querySelector: () => null };
    const context = vm.createContext({ CHALLENGES: roster, CHALLENGE_BY_ID: Object.fromEntries(roster.map((c) => [c.id, c])),
      loadChallengeState, challengeRecord, checkChallengeBoardCharms() {},
      loadChallengeTokens: () => ({ balance: 1 }), challengeMasteryReached: () => false,
      CHALLENGE_PIN_LIMIT: 3, challSelectedId: null, byShelf: (items) => items,
      CHALL_TICK_DARK: 'dark', CHALL_TICK: 'tick', CHALL_RING: 'open', CHALL_LOCK: 'locked',
      CHALL_PIN: 'pin', CHALL_UNPIN: 'unpin', TAPE_WORD: { 1: 'easy' },
      tapesMarkup: () => '', walletStubs: () => '', glossaryDefn: () => '', escapeHtml: util.escapeHtml,
      $: () => el, selectChallenge() {},
    });
    vm.runInContext(fn(app, 'challengeUnlocked') + fn(app, 'renderChallengesPage'), context);
    context.renderChallengesPage();
    assert.equal(reads, 1);
    assert.match(el.innerHTML, /3 \/ 3/);
    assert.match(el.innerHTML, /data-pin="d" disabled/);
    assert.doesNotMatch(el.innerHTML, /data-pin="locked"|data-pin="mastery"/);
    assert.equal(challengeRecord('a', board).returnRuns, 7, 'legacy record defaults survive snapshots');
    board = { d: { unlocked: true, pinned: true } };
    context.renderChallengesPage();
    assert.equal(reads, 2);
    assert.match(el.innerHTML, /1 \/ 3/);
    assert.doesNotMatch(el.innerHTML, /data-pin="d" disabled/);
  } finally { globalThis.localStorage = previous; }
});

test('feedback dot cache preserves SVG and refreshes after lyrics or corpus changes', () => {
  const source = read('../js/countdots.js');
  // Keep the renderer itself and substitute an uncached word counter as the oracle.
  const start = source.indexOf('const GAP'), end = source.indexOf('export function tipOutCountDots');
  const oracle = source.slice(start, end).replace(fn(source, 'words'),
    'function words(song) { return (song.lyrics.match(/\\S+/g) || []).length; }').replace('export function countDots', 'function countDots');
  const context = vm.createContext({ mulberry32: util.mulberry32, fnv1a: util.fnv1a });
  vm.runInContext(oracle, context);
  const compare = (corpus, hits, width) => {
    const options = { width, fallbackWidth: 540, colour: () => '#222222', title: (s, n) => `${s.title}:${n}`, seed: 'dots' };
    assert.equal(JSON.stringify(countDots(hits, corpus, options)), JSON.stringify(context.countDots(hits, corpus, options)));
  };
  for (const n of [1, 5, 30, 160, songs.length]) for (const width of [30, 150, 540]) compare(songs, songs.slice(0, n), width);
  const revised = [{ title: 'one', album: 'test', lyrics: 'one two' }, { title: 'two', album: 'test', lyrics: 'one two three' }];
  compare(revised, revised, 150);
  revised[0].lyrics = 'a much longer revised lyric with many more words';
  compare(revised, revised, 150);
  revised.push({ title: 'new song', album: 'new album', lyrics: 'new words' });
  compare(revised, revised, 150);
});

test('cloud dilation produces the same pixels at edges, small dimensions and varied densities', () => {
  const context = vm.createContext({ Uint8Array });
  vm.runInContext(fn(read('../js/cloud.js'), 'dilate'), context);
  const rng = util.mulberry32(13);
  for (let i = 0; i < 250; i++) {
    const w = Math.floor(rng() * 70) + 1, h = Math.floor(rng() * 40) + 1, r = i % 9;
    const density = i % 5 === 0 ? 0 : i % 5 === 1 ? 1 : rng();
    const mask = Uint8Array.from({ length: w * h }, () => Number(rng() < density));
    const expected = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      for (let dy = Math.max(0, y - r); dy <= Math.min(h - 1, y + r); dy++) {
        for (let dx = Math.max(0, x - r); dx <= Math.min(w - 1, x + r); dx++) {
          if (mask[dy * w + dx]) expected[y * w + x] = 1;
        }
      }
    }
    const before = mask.slice();
    assert.deepEqual(context.dilate(mask, w, h, r), expected);
    assert.deepEqual(mask, before, 'input stays unchanged');
  }
});
