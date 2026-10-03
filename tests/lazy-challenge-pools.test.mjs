import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { wordRegex } from '../js/match.js';
import { normalizeTitle, normalizeLyric } from '../js/util.js';
import { TITLE_ALIASES, TAYLOR_BUCKETS, RECENT_WINDOW } from '../js/config.js';
const app = readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const grouped = read('../data/songs.json'), words = read('../data/words.json');
const guest = read('../data/guests/olivia-rodrigo.json');
const section = (a, b) => app.slice(app.indexOf(a), app.indexOf(b, app.indexOf(a)));
function harness() {
  const context = vm.createContext({ console, normalizeTitle, normalizeLyric, TITLE_ALIASES,
    wordRegexCore: wordRegex, effectiveStrict: () => { throw Error('Pool used live difficulty'); },
    indexPlayableWords() {}, allSongs: [], titleIndex: new Map(), spacelessIndex: new Map(),
    playableWords: [], challengeWordPools: null, albumWordMap: {}, albumOrder: [], wordBuckets: {},
    lyricVocab: new Set(), lyricApostrophes: new Map(), promptRxCache: new Map(),
  });
  const code = section('function wordRegex(', '// Marginalia warning:') +
    section('function snapshotCorpus()', '// Put Taylor') +
    section('function installCorpus(', '// These builders run synchronously') +
    section('function titleChallengeWords()', '// Bucket words') +
    app.match(/function titleWordCount\(title\) \{[\s\S]*?\n\}/)[0];
  vm.runInContext(code, context);
  return { context, run: (code) => vm.runInContext(code, context),
    install: (albums, terms, options = {}) => context.installCorpus(albums, terms, options) };
}

test('ordinary installation performs no challenge scans and first use matches eager pools exactly', () => {
  const h = harness();
  h.install(grouped, words, { aliases: true });
  assert.equal(h.context.challengeWordPools.titleWordList, null);
  assert.equal(Object.keys(h.context.challengeWordPools.shortTitleWordLists).length, 0);
  const expectedTitle = h.run('playableWords.filter((w) => titleSongsForWord(w, true).length >= 1)');
  const expectedShort = [1, 2].map((max) => h.run(`playableWords.filter((w) => validSongs(w, false, false).some((s) => titleWordCount(s.title) <= ${max}))`));
  const titles = h.context.titleChallengeWords();
  assert.deepEqual(titles, expectedTitle);
  assert.equal(Object.keys(h.context.challengeWordPools.shortTitleWordLists).length, 0);
  for (const [i, max] of [1, 2].entries()) assert.deepEqual(h.context.shortTitleChallengeWords(max), expectedShort[i]);
  assert.ok(titles.length > 13);
  // Warm reads must not scan the corpus again.
  h.context.titleSongsForWord = () => { throw Error('Repeated title scan'); };
  h.context.validSongs = () => { throw Error('Repeated short-title scan'); };
  assert.equal(h.context.titleChallengeWords(), titles);
  for (const max of [1, 2]) assert.ok(h.context.shortTitleChallengeWords(max).length > 13);
});

test('cached word matches retain every song and its order under both matching rules', () => {
  const h = harness();
  h.install(grouped, words, { aliases: true });
  const songs = h.context.allSongs;
  for (const strict of [false, true]) {
    for (const word of [...words, 'not-in-this-catalogue']) {
      const rx = wordRegex(word, strict);
      const lyrics = songs.filter((s) => rx.test(s.lyrics));
      const titles = songs.filter((s) => rx.test(s.title));
      const noTitle = lyrics.filter((s) => !rx.test(s.title));
      assert.deepEqual(Array.from(h.context.songsContainingWord(word, strict)), Array.from(lyrics));
      assert.deepEqual(Array.from(h.context.validSongs(word, strict, false)), Array.from(lyrics));
      assert.deepEqual(Array.from(h.context.validSongs(word, strict, true)), Array.from(noTitle));
      assert.deepEqual(Array.from(h.context.titleSongsForWord(word, strict)), Array.from(titles));
    }
  }
  const expected = h.context.validSongs('love', false, false);
  const changed = h.context.validSongs('love', false, false);
  changed.reverse(); changed.pop();
  h.context.wordRegexCore = () => { throw Error('Repeated corpus scan'); };
  assert.deepEqual(h.context.validSongs('love', false, false), expected);
  h.context.effectiveStrict = () => true;
  assert.deepEqual(h.context.validSongs('love', undefined, true), h.context.validSongs('love', true, true));
});

test('word caches survive corpus restores and rebuild for added songs and revised lyrics', () => {
  const h = harness();
  const first = [{ album: 'test', songs: [{ title: 'First', lyrics: 'golden sky' }] }];
  const original = h.install(first, ['gold', 'sky']);
  const untouched = original.allSongs[0];
  const rawLyrics = untouched.lyrics;
  Object.defineProperty(untouched, 'lyrics', { configurable: true, get() { throw Error('Title-only query scanned lyrics'); } });
  assert.equal(h.context.titleSongsForWord('First', true)[0], untouched);
  Object.defineProperty(untouched, 'lyrics', { configurable: true, writable: true, value: rawLyrics });
  assert.equal(h.context.validSongs('gold', false, false).length, 1);
  const visiting = h.install([{ album: 'guest', songs: [{ title: 'Guest', lyrics: 'blue sky' }] }], ['sky']);
  assert.equal(h.context.validSongs('gold', false, false).length, 0);
  h.context.applyCorpus(original);
  assert.equal(h.context.validSongs('gold', false, false)[0].title, 'First');
  h.context.applyCorpus(visiting);
  assert.equal(h.context.validSongs('sky', false, false)[0].title, 'Guest');
  first[0].songs[0].lyrics = 'blue sky';
  first[0].songs.push({ title: 'New', lyrics: 'gold sky' });
  const updated = h.install(first, ['gold', 'sky']);
  assert.notEqual(updated.wordSongCache, original.wordSongCache);
  assert.equal(h.context.validSongs('gold', false, false)[0].title, 'New');
  assert.equal(h.context.validSongs('sky', false, false).length, 2);
});

test('reusing lyric membership keeps rarity buckets and album word order identical', () => {
  const h = harness();
  h.install(grouped, words, { aliases: true });
  const expected = { easy: [], all: h.context.playableWords, hard: [], ultra: [] }, albums = {};
  for (const w of h.context.playableWords) {
    const lenient = wordRegex(w, false), strict = wordRegex(w, true), held = new Set();
    let easy = 0, hard = 0, ultra = 0;
    for (const s of h.context.allSongs) {
      if (!lenient.test(s.lyrics)) continue;
      easy++; held.add(s.album);
      if (!lenient.test(s.title)) hard++;
      if (strict.test(s.lyrics) && !strict.test(s.title)) ultra++;
    }
    for (const album of held) (albums[album] ??= []).push(w);
    if (easy >= TAYLOR_BUCKETS.easy) expected.easy.push(w);
    if (hard >= TAYLOR_BUCKETS.hard[0] && hard <= TAYLOR_BUCKETS.hard[1]) expected.hard.push(w);
    if (ultra >= TAYLOR_BUCKETS.ultra[0] && ultra <= TAYLOR_BUCKETS.ultra[1]) expected.ultra.push(w);
  }
  for (const key of ['easy', 'hard', 'ultra']) if (expected[key].length < RECENT_WINDOW + 8) expected[key] = expected.all;
  Object.assign(h.context, { TAYLOR_BUCKETS, RECENT_WINDOW });
  vm.runInContext(section('function indexPlayableWords(', '/* ---------- Difficulty'), h.context);
  h.context.indexPlayableWords();
  assert.equal(JSON.stringify(h.context.wordBuckets), JSON.stringify(expected));
  assert.equal(JSON.stringify(h.context.albumWordMap), JSON.stringify(albums));
});

test('guest and blend snapshots disable pools while Taylor restores preserve both warm and unbuilt pools', () => {
  const h = harness();
  const taylor = h.install(grouped, words, { aliases: true });
  const titles = h.context.titleChallengeWords();
  const visiting = h.install(guest.albums, guest.words, { challengePools: false });
  assert.equal(visiting.challengeWordPools, null);
  assert.equal(h.context.titleChallengeWords().length, 0);
  assert.equal(h.context.shortTitleChallengeWords(1).length, 0);
  h.context.applyCorpus(taylor);
  assert.equal(h.context.titleChallengeWords(), titles);
  assert.equal(Object.keys(h.context.challengeWordPools.shortTitleWordLists).length, 0);
  const short = h.context.shortTitleChallengeWords(2);
  const blend = h.install([...grouped, ...guest.albums], [...new Set([...words, ...guest.words])], { challengePools: false });
  assert.equal(blend.challengeWordPools, null);
  h.context.applyCorpus(taylor);
  assert.equal(h.context.shortTitleChallengeWords(2), short);
  assert.equal(h.context.titleChallengeWords(), titles);
});
