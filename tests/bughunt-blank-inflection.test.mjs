import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildBlankPuzzle, buildWordFreq, judgeBlank } from '../js/bonus.js';
import { mulberry32 } from '../js/util.js';

const songs = JSON.parse(readFileSync(new URL('../data/songs.json', import.meta.url), 'utf8'))
  .flatMap(album => album.songs);
const context = buildWordFreq(songs);

test('Sing It Back accepts doubled-consonant present participles as shared inflections', () => {
  const red = songs.find(song => song.title === 'Red');
  const puzzle = buildBlankPuzzle([red], context, mulberry32(4), 1);
  assert.equal(puzzle.answer, 'Forgetting');
  assert.equal(judgeBlank('forget', puzzle, context.freq), true);
  assert.equal(judgeBlank('forgetting', { answer: 'forget' }, context.freq), true);
  for (const [typed, answer] of [['stop', 'stopping'], ['stopping', 'stop']]) {
    assert.equal(judgeBlank(typed, { answer }, new Set(['stop', 'stopping'])), true);
  }
  for (const [typed, answer] of [['with', 'without'], ['hear', 'heart'], ['forget', 'forgetxxxx']]) {
    assert.equal(judgeBlank(typed, { answer }, new Set([typed, answer])), false);
  }
});
