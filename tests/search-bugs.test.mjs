import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import * as util from '../js/util.js';
import * as match from '../js/match.js';

const source = readFileSync(new URL('../search/search.js', import.meta.url), 'utf8');
const slice = (start, end) => source.slice(source.indexOf(start), source.indexOf(end, source.indexOf(start)));

function searchHarness() {
  const context = vm.createContext({ ...util, ...match,
    state: { section: 'any', pos: 'any' },
    FUZZY_MIN: 0.78, FUZZY_FOUR_MIN: 0.75, FUZZY_SWAP_MIN_LENGTH: 4,
  });
  vm.runInContext(slice('function sectionName(', '// The terms to search:'), context);
  return context;
}

test('search highlighting matches original text and preserves escaped content', () => {
  const h = searchHarness();
  for (const [line, terms, expected] of [
    ['amp & amp', ['amp'], '<mark>amp</mark> &amp; <mark>amp</mark>'],
    ['She said "quot"', ['quot'], 'She said &quot;<mark>quot</mark>&quot;'],
    ['You & me <forever> "always"', ['"always"'], 'You &amp; me &lt;forever&gt; <mark>&quot;always&quot;</mark>'],
    ['You & me <forever>', ['&', 'me'], 'You <mark>&amp;</mark> <mark>me</mark> &lt;forever&gt;'],
  ]) {
    for (const mode of ['stem', 'exact']) {
      const song = { sections: [{ label: 'Chorus', lines: [line] }] };
      const hits = h.searchSong(song, terms, mode);
      assert.equal(hits.length, 1);
      assert.equal(hits[0].html, expected, `${mode}: ${terms}`);
    }
  }
  assert.equal(h.highlightTerms('<golden> & "gold"', h.prepareSearch(['gold'], 'stem')),
    '&lt;golden&gt; &amp; &quot;<mark>gold</mark>&quot;');
});

test('malformed search storage recovers when saving preferences and recent searches', () => {
  for (const value of ['"bad"', 'true', '42', '[]', 'null', '{']) {
    let stored = value;
    const context = vm.createContext({ ...match, SEARCH_KEY: 'search', RECENT_MAX: 8,
      state: { mode: 'exact', grouped: false },
      localStorage: { getItem: () => stored, setItem: (key, value) => { stored = value; } },
    });
    vm.runInContext('"use strict";\n' + slice('function loadStore(', '/* ---------- data'), context);
    assert.doesNotThrow(() => context.savePrefs(), value);
    assert.doesNotThrow(() => context.pushRecent(['love']), value);
    const saved = JSON.parse(stored);
    assert.equal(saved.mode, 'exact', value);
    assert.equal(saved.view, 'flat', value);
    assert.deepEqual(saved.recent, [['love']], value);
  }
});

function renderHarness() {
  const elements = new Map();
  const get = (id) => {
    if (!elements.has(id)) {
      const classes = new Set();
      elements.set(id, {
        innerHTML: '', textContent: '', dataset: {}, style: { setProperty() {} },
        classList: {
          add: (...names) => names.forEach((name) => classes.add(name)),
          remove: (...names) => names.forEach((name) => classes.delete(name)),
          contains: (name) => classes.has(name),
          toggle: (name, force) => {
            const on = force ?? !classes.has(name);
            if (on) classes.add(name); else classes.delete(name);
            return on;
          },
        },
        querySelectorAll: () => [],
      });
    }
    return elements.get(id);
  };
  const context = vm.createContext({ ...util, $: get, getRecent: () => [], pushRecent() {},
    state: { grouped: true, section: 'any', pos: 'any', mode: 'stem' },
    SONGS: [], ALBUM_COLORS: { Red: '#a00' }, ALBUM_INDEX: new Map([['Red', 0]]),
    FAMILY: new Map(), PROMPT_WORDS: new Set(), SHARE_TITLE: '', SHARE_LABEL: '', albumTabInk: () => '#000',
    document: { body: get('body'), querySelectorAll: () => [] },
  });
  vm.runInContext(slice('const plural =', '/* ---------- deep links'), context);
  return { context, get };
}

test('every new result state clears both the album lock and the dimmed bar', () => {
  const { context: h, get } = renderHarness();
  const song = { title: 'Example', album: 'Red' };
  const groups = [{ song, hits: [{ sectionLabel: 'Verse', lineNo: 1, html: 'love' }] }];
  for (const render of [() => h.render(['love'], groups), () => h.render(['none'], []), () => h.renderInitial('')]) {
    h.togglePinnedAlbum('Red');
    assert.equal(get('bar').classList.contains('sx-iso'), true);
    assert.equal(get('bar').classList.contains('sx-locked'), true);
    render();
    assert.equal(get('bar').classList.contains('sx-iso'), false);
    assert.equal(get('bar').classList.contains('sx-locked'), false);
    assert.equal(get('results').classList.contains('sx-iso'), false);
    assert.equal(vm.runInContext('pinnedAlbum', h), null);
  }
});
