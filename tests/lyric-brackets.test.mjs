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
    section('function baseTitleOf(', '// The song a variant is') +
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


const song = (title, lyrics) => ({ title, lyrics });
function bracketHarness(word, songs) {
  const h = harness([{ album: 'test', songs }], [word]);
  h.setWord(word);
  return h;
}

test('a line sung without its bracketed ad-libs grades as the whole line', () => {
  const h = bracketHarness('sorry', [song('Apology', "I'm sorry, I'm sorry (Mmm), I'm sorry (Yeah, yeah), I'm sorry\nAnother line entirely here")]);
  const m = h.context.matchLyricLine("I'm sorry, I'm sorry, I'm sorry, I'm sorry");
  assert.equal(m?.tier, 'perfect');
  assert.equal(m.fuzzy, false);
  assert.match(m.line, /\(Mmm\)/, 'the card still shows the full line');
  assert.equal(h.context.verseProgress("I'm sorry, I'm sorry, I'm sorry, I'm sorry"), 'perfect');
  // Singing the ad-libs as well is still the whole line.
  assert.equal(h.context.matchLyricLine("I'm sorry, I'm sorry, mmm, I'm sorry, yeah, yeah, I'm sorry")?.tier, 'perfect');
});

test('a leading or trailing aside no longer holds a line below perfect', () => {
  const h = bracketHarness('break', [song('Glass', "(Why) Would you wanna break it?\nSomething else follows on")]);
  assert.equal(h.context.matchLyricLine('Would you wanna break it')?.tier, 'perfect');
  const p = bracketHarness('pocket', [song('Note', 'Hoping it will end up in his pocket (Pocket)\nThen a line after')]);
  assert.equal(p.context.matchLyricLine('Hoping it will end up in his pocket')?.tier, 'perfect');
});

test('a slip in a bracket-free line still lands on the fuzzy path and the meter', () => {
  const h = bracketHarness('sorry', [song('Apology', "I'm sorry, I'm sorry (Mmm), I'm sorry (Yeah, yeah), I'm sorry\nAnother line entirely here")]);
  assert.equal(h.context.matchLyricLine("I'm sorry, I'm sorry, I'm sorry, I'm sorr")?.tier, 'perfect');
  assert.equal(h.context.verseProgress("I'm sorry, I'm sorrry, I'm sorry, I'm sorry"), 'perfect');
});

test('a whole verse with an ad-lib line between still counts its real lines only', () => {
  const lyrics = 'First we sang about the rain\n(Ooh)\nSecond line goes on again\nThird line in the rain once more\nFinal line walks out the door';
  const h = bracketHarness('rain', [song('Verse', lyrics)]);
  const typed = 'First we sang about the rain Second line goes on again Third line in the rain once more Final line walks out the door';
  assert.equal(h.context.matchLyricLine(typed)?.tier, 'verse');
  const three = 'First we sang about the rain Second line goes on again Third line in the rain once more';
  assert.equal(h.context.matchLyricLine(three)?.tier, 'perfect', 'an aside line is not a verse line');
});

test('the word still has to be sung: dropping it with the brackets earns nothing', () => {
  const h = bracketHarness('pocket', [song('Note', 'Hoping it will end up in his (pocket) today\nThen a line after')]);
  assert.equal(h.context.matchLyricLine('Hoping it will end up in his today'), null);
});
