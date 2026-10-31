import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import * as bonus from '../js/bonus.js';

const app = readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
const source = app.match(/function buildBonusPuzzle\([^]*?\n}/)[0];
const all = JSON.parse(readFileSync(new URL('../data/songs.json', import.meta.url), 'utf8'))
  .flatMap(album => album.songs.map(song => ({ ...song, album: album.album,
    lyrics: song.sections.flatMap(section => section.lines || []).join('\n'),
  })));
const songs = all.filter(song => !bonus.ruthlessBar(song));
const indexes = { ctx: bonus.buildWordFreq(all), lineIndex: bonus.buildLineIndex(all),
  wordIndex: bonus.buildWordIndex(all) };
const cases = [
  ['sing-it-back', pool => bonus.buildBlankPuzzle(pool, indexes.ctx, () => 0, 1)],
  ['redacted', pool => bonus.buildRedactedPuzzle(pool, indexes.ctx, indexes.lineIndex, () => 0, 1)],
  ['only-here', pool => bonus.buildOnlyHerePuzzle(pool, indexes.wordIndex, () => 0, 1)],
  ['then-what', pool => bonus.buildChainPuzzle(pool, () => 0, 1)],
  ['word-cloud', pool => bonus.buildCloudPuzzle(pool, indexes.wordIndex, () => 0, 1)],
];

for (const [id, build] of cases) {
  test(`${id} cannot redeal a used song through its builder's soft fallback`, () => {
    const pool = [];
    for (const song of songs) {
      if (build([song])) pool.push(song);
      if (pool.length === 2) break;
    }
    assert.equal(pool.length, 2, 'fixture has two valid pages');
    const context = vm.createContext({ ...bonus,
      Math: Object.assign(Object.create(Math), { random: () => 0 }),
      bonusGame: { id }, bonusRound: 1, bonusRecentSongs: [pool[0].title],
      bonusSongs: () => pool, bonusIndexes: () => indexes,
      isSlipGame: () => false, ONLY_WIDE_PAGES: 5, CHAIN_EASY_PAGES: 5,
      CLOUD_WIDE_PAGES: 5, CLOUD_WORDS_WIDE: 25, CLOUD_WORDS_SPARE: 15,
      onlyDealt: new Set(),
    });
    vm.runInContext(source, context);
    assert.equal(context.buildBonusPuzzle()?.song.title, pool[1].title);
  });
}

test('Word Cloud returns no puzzle when the repeat filter leaves an empty pool', () => {
  assert.equal(bonus.buildCloudPuzzle([], indexes.wordIndex), null);
});

test('Ruthless still credits an already-dealt version for shared opening lyrics', () => {
  const pool = ['All Too Well', 'All Too Well (10 Minute Version)']
    .map(title => songs.find(song => song.title === title));
  const context = vm.createContext({ ...bonus,
    Math: Object.assign(Object.create(Math), { random: () => 0.75 }),
    bonusGame: { id: 'ruthless-game' }, bonusRecentSongs: [pool[0].title],
    bonusSongs: () => pool, bonusIndexes: () => indexes,
    isSlipGame: () => false, isRuthlessRun: () => true,
    devRuthlessNext: null, activeLens: () => null,
  });
  vm.runInContext(source, context);
  const puzzle = context.buildBonusPuzzle();
  assert.equal(puzzle.song.title, pool[1].title);
  assert.ok(puzzle.twins.some(twin => twin.song.title === pool[0].title));
});
