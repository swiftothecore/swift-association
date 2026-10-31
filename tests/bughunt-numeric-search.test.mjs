import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import * as util from '../js/util.js';
import * as match from '../js/match.js';

const source = readFileSync(new URL('../search/search.js', import.meta.url), 'utf8');
const start = source.indexOf('function sectionName(');
const end = source.indexOf('// The terms to search:', start);
function harness() {
  const context = vm.createContext({ ...util, ...match, displayText: text => text,
    state: { section: 'any', pos: 'any' },
    FUZZY_MIN: 0.78, FUZZY_FOUR_MIN: 0.75, FUZZY_SWAP_MIN_LENGTH: 4,
  });
  vm.runInContext(source.slice(start, end), context);
  return context;
}

test('numeric and alphanumeric lyric tokens survive fuzzy and contains searches', () => {
  const h = harness();
  const song = { sections: [{ label: 'Verse', lines: [
    'On a crowded street in 1944', 'I am standin in a 1950s gymnasium',
    'He is up at 3AM',
  ] }] };
  for (const mode of ['fuzzy', 'contains']) {
    const hits = h.searchSong(song, ['1944'], mode);
    assert.ok(hits.some(hit => hit.html.includes('<mark>1944</mark>')), mode);
    assert.equal(h.searchSong(song, ['3AM'], mode).length, 1, mode);
    assert.equal(h.searchSong(song, ['G5'], mode).length, 0, mode);
  }
  const hits = h.searchSong(song, ['1950'], 'contains');
  assert.equal(hits.length, 1);
  assert.match(hits[0].html, /<mark>1950<\/mark>s/);
});
