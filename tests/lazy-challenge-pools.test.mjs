import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { wordRegex } from '../js/match.js';
import { normalizeTitle, normalizeLyric } from '../js/util.js';
import { TITLE_ALIASES } from '../js/config.js';
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
