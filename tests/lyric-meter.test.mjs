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

function harness(albums = grouped, terms = words) {
  const context = vm.createContext({ ...util, ...match, ...config, console,
    wordRegexCore: match.wordRegex, strict: true, effectiveStrict: () => context.strict,
    bothRuleActive: () => context.bothWords.length > 0, bothWords: [], currentWord: '',
    indexPlayableWords() {}, allSongs: [], titleIndex: new Map(), spacelessIndex: new Map(),
    playableWords: [], challengeWordPools: null, albumWordMap: {}, albumOrder: [], wordBuckets: {},
    lyricVocab: new Set(), lyricApostrophes: new Map(), currentSongs: [],
  });
  vm.runInContext(section('const MIN_LYRIC_WORDS =', 'let currentMode =') +
    section('function wordRegex(', '// Marginalia warning:') +
    section('function snapshotCorpus()', '// Put Taylor') +
    section('function installCorpus(', '// These builders run synchronously') +
    section('function normLineSet(', 'const VERSE_METER ='), context);
  context.installCorpus(albums, terms);
  const setWord = (word, songs) => {
    context.currentWord = word;
    context.currentSongs = songs || context.allSongs.filter((s) => match.wordRegex(word, context.strict).test(s.lyrics));
    context.resetWordCaches();
  };
  return { context, setWord,
    sings: (text) => context.phraseSingsPromptWord(context.normalizeSungPhrase(text), text),
    near: (text) => context.nearMissPromptWord(context.normalizeSungPhrase(text), text),
  };
}

const line = 'The summer returns to our garden';
function summerHarness(extra = []) {
  const h = harness([{ album: 'test', songs: [{ title: 'A notebook song', lyrics: line }, ...extra] }], ['summer']);
  h.setWord('summer');
  return h;
}

test('the meter preserves full-line rewards for one insertion, deletion, substitution or swap', () => {
  const h = summerHarness();
  for (const typed of [
    'The summer retturns to our garden', 'The summer retuns to our garden',
    'The summer retxrns to our garden', 'The summer retruns to our garden',
    'Teh summer returns to our garden', 'The summer returns to our gardne',
    'The summre returns to our garden',
  ]) {
    assert.equal(h.context.verseProgress(typed), 'perfect', typed);
    assert.equal(h.context.matchLyricLine(typed)?.tier, 'perfect', typed);
  }
});

test('a typo before the word lands retains finding the line and cannot promise a full-line reward', () => {
  const h = harness([{ album: 'test', songs: [{ title: 'Notebook',
    lyrics: 'The lantern flickers softly beside the garden in summer',
  }] }], ['summer']);
  h.setWord('summer');
  assert.equal(h.context.verseProgress('The lantern flikcers softly beside'), 'good');
  const typed = 'The lantern flikcers softly beside the garden in';
  assert.equal(h.context.verseProgress(typed), 'good');
  assert.equal(h.context.matchLyricLine(typed), null);
});

test('a misspelled prompt cannot turn a different real word into the required word', () => {
  const h = harness([{ album: 'test', songs: [
    { title: 'Notebook', lyrics: 'The right answer waits beside the garden' },
    { title: 'Elsewhere', lyrics: 'The night arrives' },
  ] }], ['right']);
  h.setWord('right');
  const typed = 'The night answer waits beside the garden';
  assert.equal(h.context.verseProgress(typed), 'good');
  assert.equal(h.context.matchLyricLine(typed), null);
});

test('correct and misspelled titles and title prefixes remain dark, including invalid songs', () => {
  const h = summerHarness([
    { title: 'The Summer Returns Tonight', lyrics: 'The summer returns tonight in the garden' },
    { title: 'The Winter Returns Tonight', lyrics: 'The snow arrives tonight' },
  ]);
  for (const typed of ['The Summer Returns Tonight', 'The Summer Retunrs Tonight',
    'The Summer Retunrs Ton', 'The Winter Retunrs Tonight']) {
    assert.equal(h.context.verseProgress(typed), null, typed);
  }
  assert.notEqual(h.context.verseProgress('The summer retunrs tonight in the garden'), null);
});

test('short guesses, invented phrases and multiple mistakes get no new confirmation', () => {
  const h = summerHarness();
  for (const typed of ['Teh summer', 'The summer invents a spaceship',
    'Teh summer retunrs to our garden', 'The summer reckons to our garden']) {
    assert.equal(h.context.verseProgress(typed), null, typed);
  }
  const tiny = harness([{ album: 'test', songs: [{ title: 'Notebook', lyrics: 'summer returns' }] }], ['summer']);
  tiny.setWord('summer');
  assert.equal(tiny.context.verseProgress('summer returns'), 'good');
  assert.equal(tiny.context.verseProgress('summer retunrs'), null);
});

test('typo matching stays near the prompt and is rebuilt safely across corpus swaps', () => {
  const h = summerHarness([{ title: 'Far away',
    lyrics: 'summer\n' + 'quiet '.repeat(25) + '\nThe lantern flickers beside the garden',
  }]);
  assert.equal(h.context.verseProgress('The lantern flikcers beside the garden'), null);
  const saved = h.context.snapshotCorpus();
  h.context.installCorpus([{ album: 'guest', songs: [{ title: 'Guest notebook',
    lyrics: 'The summer settles beside the window',
  }] }], ['summer']);
  h.setWord('summer');
  assert.equal(h.context.verseProgress('The summer setltes beside the window'), 'perfect');
  assert.equal(h.context.verseProgress('The summer retruns to our garden'), null);
  h.context.applyCorpus(saved);
  h.setWord('summer');
  assert.equal(h.context.verseProgress('The summer retruns to our garden'), 'perfect');
});

test('a typo in a recalled verse preserves its earned reward', () => {
  const lyrics = ['The summer returns to our garden', 'A lantern flickers softly nearby',
    'We watch the distant mountains shimmer', 'And carry all our stories home'].join('\n');
  const h = harness([{ album: 'test', songs: [{ title: 'Notebook', lyrics }] }], ['summer']);
  h.setWord('summer');
  const typed = lyrics.replace('distant', 'distnat');
  assert.equal(h.context.verseProgress(typed), 'verse');
  assert.equal(h.context.matchLyricLine(typed)?.tier, 'verse');
});

test('real catalogue typo feedback cannot promise more than the submitted answer earns', (t) => {
  const h = harness();
  let checked = 0;
  const rank = { fragment: 0, good: 1, perfect: 2, verse: 3, base: 0 };
  for (const word of ['garden', 'summer', 'touch', 'street', 'sand', 'love']) {
    h.setWord(word);
    for (const song of h.context.currentSongs.slice(0, 8)) {
      const raw = song.lyrics.split('\n').find((l) => match.wordRegex(word, true).test(l) &&
        util.normalizeLyric(l).split(' ').length >= 4);
      if (!raw) continue;
      const normalized = util.normalizeLyric(raw);
      if (h.context.isTitleFragment(normalized)) continue;
      const tokens = normalized.split(' ');
      const index = tokens.findIndex((w) => w.length >= 4 && w !== word);
      if (index < 0) continue;
      tokens[index] = tokens[index].slice(0, 2) + 'x' + tokens[index].slice(2);
      const typed = tokens.join(' ');
      const tier = h.context.verseProgress(typed);
      const verdict = h.context.matchLyricLine(typed);
      assert.ok(tier, `${word}: ${typed}`);
      assert.ok(verdict, `${word}: ${typed}`);
      assert.ok(rank[tier] <= rank[verdict.tier], `${word}: ${typed}`);
      checked++;
    }
  }
  t.diagnostic(`Checked ${checked} real lyric/song pairs`);
  assert.ok(checked >= 30);
});

test('a slip in an ing ending is still one slip after lyric normalization', () => {
  const h = harness([{ album: 'test', songs: [{ title: 'Notebook',
    lyrics: 'The summer is dancing in our garden',
  }] }], ['summer']);
  h.setWord('summer');
  for (const word of ['dancimg', 'dancign', 'dancingg', 'dancng']) {
    const typed = `The summer is ${word} in our garden`;
    assert.equal(h.context.verseProgress(typed), 'perfect', typed);
    assert.equal(h.context.matchLyricLine(typed)?.tier, 'perfect', typed);
  }
  assert.equal(h.context.lyricTokenTypoApart('sing', 'sin'), true); // the ordinary one-edit rule
  assert.equal(h.context.lyricTokenTypoApart('sign', 'sin'), true); // likewise a one-letter insertion
  assert.equal(h.context.lyricTokenTypoApart('simg', 'sin'), false); // no invented g-drop bridge
});
