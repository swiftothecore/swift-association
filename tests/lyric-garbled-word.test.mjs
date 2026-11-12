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
    wordRegexCore: match.wordRegex, strict: false, effectiveStrict: () => context.strict,
    bothRuleActive: () => context.bothWords.length > 0, bothWords: [], currentWord: '',
    indexPlayableWords() {}, allSongs: [], titleIndex: new Map(), spacelessIndex: new Map(),
    playableWords: [], challengeWordPools: null, albumWordMap: {}, albumOrder: [], wordBuckets: {},
    lyricVocab: new Set(), lyricApostrophes: new Map(), currentSongs: [],
  });
  vm.runInContext(section('const MIN_LYRIC_WORDS =', 'let currentMode =') +
    section('function wordRegex(', '// Marginalia warning:') +
    section('function snapshotCorpus()', '// Put Taylor') +
    section('function baseTitleOf(', '// The song a variant is') +
    section('function installCorpus(', '// These builders run synchronously') +
    section('function normLineSet(', 'const VERSE_METER ='), context);
  context.installCorpus(albums, terms);
  const setWord = (word) => {
    context.currentWord = word;
    context.currentSongs = context.allSongs.filter((s) => match.wordRegex(word, context.strict).test(s.lyrics));
    context.resetWordCaches();
  };
  return { context, setWord };
}

test('typoDistance counts an adjacent swap as one slip', () => {
  assert.equal(util.typoDistance('brunnign', 'burning'), 3);
  assert.equal(util.typoDistance('tuoch', 'touch'), 1);
  assert.equal(util.typoDistance('love', 'love'), 0);
  assert.equal(util.typoDistance('', 'red'), 3);
});

test('a badly typed prompt word counts once the line around it is found', () => {
  const h = harness();
  h.setWord('burning');
  for (const typed of [
    'i once believed love would be brunnign red but its golden',
    'i once believed love would be brunign red',
    'i once believed love would be bruinng red but its golden',
  ]) {
    const m = h.context.matchLyricLine(typed);
    assert.ok(m, typed);
    assert.equal(m.song.title, 'Daylight', typed);
    assert.equal(m.garbled, true, typed);
    assert.notEqual(h.context.verseProgress(typed), null, typed);
  }
});

test('the word left out, a different real word, or noise in its place still fails', () => {
  const h = harness();
  h.setWord('burning');
  for (const typed of [
    'i once believed love would be red but its golden',
    'i once believed love would be turning red but its golden',
    'i once believed love would be xqzv red but its golden',
    'i once believed love would be bu red but its golden',
    'i once believed love would be black and white',
  ]) {
    assert.equal(h.context.matchLyricLine(typed), null, typed);
    // The meter may still say "finding the line" (it lights near the word), never more.
    assert.ok(!['perfect', 'verse'].includes(h.context.verseProgress(typed)), typed);
  }
});

test('a garble only counts where the matched lyric really sings the word', () => {
  const albums = [{ album: 'test', songs: [
    { title: 'Lantern', lyrics: 'The summer returns to our garden\nThe lantern flickers softly beside the window' },
  ] }];
  const h = harness(albums, ['summer']);
  h.setWord('summer');
  assert.ok(h.context.matchLyricLine('The smumre returns to our garden'));
  // "smumre" stuffed into a line that never sings the word is not the word.
  assert.equal(h.context.matchLyricLine('The lantern smumre flickers softly beside the window'), null);
});

test('short phrases stay exact', () => {
  const h = harness();
  h.setWord('burning');
  assert.equal(h.context.matchLyricLine('brunnign red'), null);
});

test('the gauge never promises more than the garbled verdict pays', () => {
  const h = harness();
  h.setWord('burning');
  const typed = 'i once believed love would be brunnign red';
  const m = h.context.matchLyricLine(typed);
  const meter = h.context.verseProgress(typed);
  assert.equal(meter, m.tier === 'base' ? 'fragment' : m.tier);
});
