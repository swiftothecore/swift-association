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

test('apostrophe-aware keys preserve word offsets and ordinary recall normalization', () => {
  const samples = ['dancing\'s dream', "'dancing' angels", "angel’s", "angel‘s", "dancin' all night"];
  for (const text of [...samples, ...grouped.flatMap((a) => a.songs.flatMap((s) =>
    s.sections.flatMap((sec) => sec.lines || [])))]) {
    const plain = util.normalizeLyric(text);
    const spelled = util.normalizeLyric(text, { keepApostrophes: true });
    assert.equal(spelled.replace(/'/g, ''), plain, text);
    assert.equal(spelled.split(' ').length, plain.split(' ').length, text);
  }
  assert.deepEqual(["angel's city", "devil's details"].map(util.normalizeLyric), ['angels city', 'devils details']);
});

test('strict verdict and meter accept explicit possessives but reject ambiguous bare plurals', () => {
  const h = harness();
  for (const [word, phrase, title] of [
    ['angel', "In the angel's city, chasin' fortune and fame", 'The Lucky One'],
    ['devil', "The devil's in the details, but you got a friend in me", 'peace'],
  ]) {
    h.setWord(word);
    for (const apostrophe of ["'", '’', '‘']) {
      const typed = phrase.replace("'", apostrophe);
      assert.equal(h.sings(typed), true, typed);
      assert.equal(h.context.matchLyricLine(typed)?.song.title, title, typed);
      assert.equal(h.context.verseProgress(typed), 'perfect', typed);
      assert.equal(h.near(typed), null, typed);
    }
    const plural = phrase.replace("'", '');
    assert.equal(h.sings(plural), false, plural);
    assert.equal(h.context.matchLyricLine(plural), null, plural);
    assert.equal(h.context.verseProgress(plural), 'good', plural);
    assert.equal(h.near(plural)?.why, 'strict', plural);
    assert.equal(h.context.matchLyricLine(`${word} invented filler nonsense`), null);
    h.context.strict = false;
    h.setWord(word);
    assert.equal(h.context.matchLyricLine(plural)?.song.title, title);
    h.context.strict = true;
  }
});

test('every strict catalogue match has a singable word-bearing line, including ambiguous possessives', (t) => {
  const h = harness();
  let recoveredPairs = 0;
  for (const word of words) {
    h.setWord(word);
    for (const song of h.context.currentSongs) {
      assert.equal(h.sings(song.lyrics), true, `${word}: ${song.title}`);
      const rx = match.wordRegex(word, true);
      const flattened = h.context.promptWordRegex(word, true);
      const line = song.lyrics.split('\n').find((l) => rx.test(l) && !flattened.test(util.normalizeLyric(l)));
      if (!line) continue;
      recoveredPairs++;
      h.setWord(word, [song]);
      assert.equal(h.context.matchLyricLine(line)?.song.title, song.title, `${word}: ${line}`);
      assert.notEqual(h.context.verseProgress(line), null, `${word}: ${line}`);
    }
  }
  t.diagnostic(`Recovered ${recoveredPairs} ambiguous word/song pairs`);
  assert.ok(recoveredPairs >= 51, `Recovered ${recoveredPairs} word/song pairs`);
});

test('gauge word positions keep explicit possessives separate from distant plurals', () => {
  const lyrics = "In the angel's city\n" + 'quiet '.repeat(25) + '\nThe angels arrive together';
  const h = harness([{ album: 'test', songs: [{ title: 'Test song', lyrics }] }], ['angel']);
  h.setWord('angel');
  assert.deepEqual(Array.from(h.context.wordSpots(h.context.allSongs[0])), [2]);
  assert.equal(h.context.verseProgress('The angels arrive together'), null);
  assert.equal(h.context.verseProgress("In the angel's city"), 'perfect');
});

test('raw word evidence does not confirm songs and works for multi-word pages and guest swaps', () => {
  const h = harness();
  h.setWord('angel');
  assert.equal(h.sings("angel's invented filler nonsense"), true);
  assert.equal(h.context.matchLyricLine("angel's invented filler nonsense"), null);
  assert.equal(h.context.verseProgress("angel's invented filler nonsense"), null);
  assert.equal(h.sings('The angels arrive together'), false);
  h.context.bothWords = ['devil', 'angel'];
  assert.equal(h.sings("In the angel's city"), true);
  assert.equal(h.sings('The angels arrive together'), false);
  h.context.bothWords = [];
  const taylor = h.context.snapshotCorpus();
  h.context.installCorpus([{ album: 'guest', songs: [
    { title: 'Guest song', lyrics: "In the angel's garden\nThe angels sing softly" },
  ] }], ['angel']);
  h.setWord('angel');
  assert.equal(h.context.matchLyricLine("In the angel's garden")?.song.title, 'Guest song');
  assert.equal(h.sings('The angels sing softly'), false);
  h.context.applyCorpus(taylor);
  h.setWord('angel');
  assert.equal(h.context.matchLyricLine("In the angel's city")?.song.title, 'The Lucky One');
});
