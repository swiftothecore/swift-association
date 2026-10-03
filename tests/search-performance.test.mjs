import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import * as util from '../js/util.js';
import * as match from '../js/match.js';
import { referenceSearch } from './helpers/search-reference.mjs';

const source = readFileSync(new URL('../search/search.js', import.meta.url), 'utf8');
const grouped = JSON.parse(readFileSync(new URL('../data/songs.json', import.meta.url), 'utf8'));
const songs = grouped.flatMap(({ album, songs }) => songs.map((song) => ({ ...song, album })));
const slice = (a, b) => source.slice(source.indexOf(a), source.indexOf(b, source.indexOf(a)));
function harness(corpus = songs) {
  const state = { q: 'love', terms: [], mode: 'stem', grouped: true, section: 'any', pos: 'any' };
  const rendered = [];
  const context = vm.createContext({ ...util, ...match, state, SONGS: corpus,
    FUZZY_MIN: 0.78, FUZZY_FOUR_MIN: 0.75, FUZZY_SWAP_MIN_LENGTH: 4,
    ALBUM_INDEX: new Map(grouped.map((g, i) => [g.album, i])),
    renderChips() {}, renderExplain() {}, renderInitial() {},
    render: (terms, groups) => rendered.push(groups),
  });
  vm.runInContext(slice('function sectionName(', '// Narrate the live match/layout') +
    slice('let lastSearch =', '/* ---------- multi-term chips'), context);
  return { context, state, rendered };
}

test('prepared search preserves complete hits, highlighting, section labels and positions', () => {
  const h = harness();
  const probes = [
    ['love'], ['star'], ['babe'], ["could've"], ['lvoe'], ['New York'], ['love', 'you'],
  ].map((terms) => ({ terms, section: 'any', pos: 'any' }));
  for (const pos of ['start', 'end']) for (const section of ['any', 'Chorus', 'Verse']) {
    probes.push({ terms: ['love', 'you'], section, pos });
  }
  const edgeSong = { title: 'edge cases', album: 'test', sections: [
    { label: 'Chorus', lines: ["LOVE, love, loving & <love>!", "babe baby babes", "star stared starry", "could've could’ve could‘ve", 'café cafe İSTANBUL', 'New York, New York', 'love is love'] },
    { label: 'Chorus', lines: ['you love love you', '', 'lvoe love'] },
  ] };
  const corpus = [...songs, edgeSong];
  probes.push({ terms: ['café'], section: 'any', pos: 'any' }, { terms: ['İS'], section: 'any', pos: 'any' });
  for (const mode of ['stem', 'exact', 'fuzzy', 'contains']) for (const probe of probes) {
    Object.assign(h.state, probe, { mode });
    const query = h.context.prepareSearch(probe.terms, mode);
    for (const song of corpus) {
      const expected = referenceSearch(song, probe.terms, mode, probe);
      const actual = h.context.searchSong(song, probe.terms, mode, query);
      assert.equal(JSON.stringify(actual), JSON.stringify(expected), `${mode} ${probe.terms} ${probe.section}/${probe.pos} ${song.title}`);
    }
  }
});

test('fuzzy token scores are reused within one query and discarded for a new query', () => {
  const h = harness();
  let scores = 0;
  h.context.fuzzySubstringRatio = (...args) => { scores++; return util.fuzzySubstringRatio(...args); };
  const song = { sections: [{ label: '', lines: ['dream dream dream dreams', 'dream dreams'] }] };
  const first = h.context.prepareSearch(['dream'], 'fuzzy');
  h.context.searchSong(song, ['dream'], 'fuzzy', first);
  assert.equal(scores, 2);
  h.context.searchSong(song, ['dream'], 'fuzzy', first);
  assert.equal(scores, 2);
  h.context.searchSong(song, ['dream'], 'fuzzy');
  assert.equal(scores, 4);
});

test('layout changes reuse results while matching filters and new catalogues invalidate them', () => {
  const h = harness(songs.slice(0, 8));
  let searches = 0;
  const search = h.context.searchSong;
  h.context.searchSong = (...args) => { searches++; return search(...args); };
  h.context.runSearch();
  assert.equal(searches, 8);
  h.state.grouped = false;
  h.context.runSearch();
  assert.equal(searches, 8);
  assert.equal(h.rendered[0], h.rendered[1]);
  for (const change of [{ mode: 'exact' }, { section: 'Chorus' }, { pos: 'end' }, { q: 'dream' }, { terms: ['you'] }]) {
    Object.assign(h.state, change);
    const before = searches;
    h.context.runSearch();
    assert.equal(searches, before + 8);
  }
  h.context.SONGS = [...songs.slice(0, 8), { title: 'Added song', album: grouped[0].album, sections: [{ label: 'Chorus', lines: ['dream you'] }] }];
  const before = searches;
  h.context.runSearch();
  assert.equal(searches, before + 9);
  assert.ok(h.rendered.at(-1).some((g) => g.song.title === 'Added song'));
  h.state.q = ''; h.state.terms = [];
  h.context.runSearch();
  h.state.q = 'dream';
  h.context.runSearch();
  assert.equal(searches, before + 18);
});
