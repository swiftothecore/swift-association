import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildRedactedPuzzle, buildWordFreq, buildLineIndex } from '../js/bonus.js';
import { mulberry32, normalizeLyric } from '../js/util.js';

const songs = JSON.parse(readFileSync(new URL('../data/songs.json', import.meta.url), 'utf8'))
  .flatMap(album => album.songs.map(song => ({ ...song, album: album.album })));
const frequency = buildWordFreq(songs), lines = buildLineIndex(songs);

test('Redacted bars a version line that sings its base title', () => {
  for (const title of ['Bad Blood (Remix)', 'All Too Well (10 Minute Version)']) {
    const song = songs.find(song => song.title === title);
    assert.ok(song);
    const bare = normalizeLyric(title.replace(/\s*\([^()]*\)\s*$/, ''));
    let dealt = 0;
    for (let seed = 0; seed < 20; seed++) {
      const puzzle = buildRedactedPuzzle([song], frequency, lines, mulberry32(seed));
      if (!puzzle) continue;
      dealt++;
      for (const row of puzzle.rows) {
        const text = row.map(token => token.pre + token.core + token.post).join(' ');
        assert.equal(normalizeLyric(text).includes(bare), false, `${title}, seed ${seed}`);
      }
    }
    assert.ok(dealt > 0, `${title} still has fair pages`);
  }
});
