import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { normalizeLyric, stripLyricBrackets } from '../js/util.js';
import { wordRegex } from '../js/match.js';

const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const source = readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
const start = source.indexOf('let wordSpotCache =');
const end = source.indexOf('// Is a hit at character', start);
const song = (albums) => {
  const found = albums.flatMap((a) => a.songs).find((s) => s.title === 'Daylight');
  const lyrics = found.sections.flatMap((s) => s.lines || []).join('\n');
  return { title: found.title, lyrics, _normLyrics: normalizeLyric(lyrics),
    _normLyricsBare: normalizeLyric(stripLyricBrackets(lyrics)) };
};

test('same-title songs retain independent word positions in both lyric readings', () => {
  const home = song(read('../data/songs.json'));
  const guest = song(read('../data/guests/harry-styles.json').albums);
  const context = vm.createContext({ normalizeLyric, stripLyricBrackets,
    lyricRequiredWords: () => ['would'], promptWordRegex: (w) => wordRegex(w, false),
  });
  vm.runInContext(source.slice(start, end), context);
  for (const bare of [false, true]) {
    const expected = [...context.wordSpots(guest, bare)];
    vm.runInContext('wordSpotCache.clear()', context);
    const first = [...context.wordSpots(home, bare)];
    assert.notDeepEqual(first, expected);
    assert.deepEqual([...context.wordSpots(guest, bare)], expected);
    vm.runInContext('wordSpotCache.clear()', context);
  }
});
