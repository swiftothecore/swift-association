import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import * as util from '../js/util.js';
import * as match from '../js/match.js';
import * as config from '../js/config.js';

const app = readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const grouped = read('../data/songs.json'), words = read('../data/words.json');
const section = (a, b) => {
  const start = app.indexOf(a), end = app.indexOf(b, start);
  assert.ok(start >= 0 && end > start, `Missing app section: ${a}`);
  return app.slice(start, end);
};

// The same slices the meter tests load, plus the levers offLimitsLyricSong reads: the page's
// title rule, the Impostor and Title...? guards, and isOffLimitsPick (lives outside the slices).
function harness() {
  const context = vm.createContext({ ...util, ...match, ...config, console,
    wordRegexCore: match.wordRegex, strict: false, effectiveStrict: () => context.strict,
    bothRuleActive: () => false, bothWords: [], currentWord: '',
    indexPlayableWords() {}, allSongs: [], titleIndex: new Map(), spacelessIndex: new Map(),
    playableWords: [], challengeWordPools: null, albumWordMap: {}, albumOrder: [], wordBuckets: {},
    lyricVocab: new Set(), lyricApostrophes: new Map(), currentSongs: [],
    noTitle: true, effectiveNoTitle: () => context.noTitle,
    impostor: false, impostorRuleActive: () => context.impostor,
    gameType: 'normal', currentChallenge: null,
    isOffLimitsPick: (s) => context.noTitle
      && match.wordRegex(context.currentWord, context.strict).test(s.title),
  });
  vm.runInContext(section('const MIN_LYRIC_WORDS =', 'let currentMode =') +
    section('function wordRegex(', '// Marginalia warning:') +
    section('function snapshotCorpus()', '// Put Taylor') +
    section('function installCorpus(', '// These builders run synchronously') +
    section('function normLineSet(', 'const VERSE_METER ='), context);
  context.installCorpus(grouped, words);
  const setWord = (word) => {
    context.currentWord = word;
    context.currentSongs = context.validSongs(word, context.strict, context.noTitle);
    context.resetWordCaches();
  };
  return { context, setWord };
}

const LINE = "I remember it all too well";

test('a line of a title-barred song is refused by the verdict but named as barred', () => {
  const h = harness();
  h.setWord('well');
  assert.ok(!h.context.currentSongs.some((s) => s.title === 'All Too Well'));
  assert.equal(h.context.matchLyricLine(LINE), null);
  assert.match(h.context.offLimitsLyricSong(LINE)?.title || '', /^All Too Well/);
});

test('nothing is named for an invented line, a line without the word, or a valid song', () => {
  const h = harness();
  h.setWord('well');
  assert.equal(h.context.offLimitsLyricSong('the kettle sings well on a tuesday afternoon'), null);
  assert.equal(h.context.offLimitsLyricSong('and I left my scarf there at your sister\'s house'), null);
  const valid = h.context.currentSongs[0];
  const sung = valid.lyrics.split('\n').find((l) => /\bwell\b/i.test(l) && l.split(' ').length >= 5);
  if (sung) assert.equal(h.context.offLimitsLyricSong(sung), null, sung);
});

test('stays shut when titles are allowed, on Impostor runs, and on Title...?', () => {
  const h = harness();
  h.context.noTitle = false;
  h.setWord('well');
  assert.equal(h.context.offLimitsLyricSong(LINE), null);
  h.context.noTitle = true;
  h.setWord('well');
  h.context.impostor = true;
  assert.equal(h.context.offLimitsLyricSong(LINE), null);
  h.context.impostor = false;
  h.context.gameType = 'challenge';
  h.context.currentChallenge = { rule: 'titleHas' };
  assert.equal(h.context.offLimitsLyricSong(LINE), null);
});

test('the live note waits for the length floor and gives way to valid songs', () => {
  const h = harness();
  h.setWord('well');
  assert.match(h.context.barredLyricProgress(LINE)?.title || '', /^All Too Well/);
  assert.match(h.context.barredLyricProgress('I remember it all too')?.title || '', /^All Too Well/);
  assert.equal(h.context.barredLyricProgress('I remember'), null);
  assert.equal(h.context.barredLyricProgress('all too well'), null);
  const valid = h.context.currentSongs.find((s) => /\bwell\b/i.test(s.lyrics));
  const shared = valid._normLyrics.split(' ').slice(0, 5).join(' ');
  assert.equal(h.context.barredLyricProgress(shared), null, shared);
  h.context.noTitle = false;
  h.setWord('well');
  assert.equal(h.context.barredLyricProgress(LINE), null);
});
