import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import * as util from '../js/util.js';
import * as match from '../js/match.js';

const source = readFileSync(new URL('../search/search.js', import.meta.url), 'utf8');
const start = source.indexOf('function sectionName(');
const end = source.indexOf('// The terms to search:', start);

test('exact and stem phrase searches normalize repeated whitespace for matches and highlights', () => {
  const context = vm.createContext({ ...util, ...match, displayText: (s) => s,
    state: { section: 'any', pos: 'any' },
    FUZZY_MIN: 0.78, FUZZY_FOUR_MIN: 0.75, FUZZY_SWAP_MIN_LENGTH: 4,
  });
  vm.runInContext(source.slice(start, end), context);
  const song = { sections: [{ label: 'Chorus', lines: ['A love story on the page'] }] };
  for (const mode of ['exact', 'stem']) {
    for (const term of ['love  story', 'love\tstory', ' LOVE   STORY ']) {
      const hits = context.searchSong(song, [term], mode);
      assert.equal(hits.length, 1, `${mode}: ${term}`);
      assert.equal(hits[0].html, 'A <mark>love story</mark> on the page');
    }
  }
});
