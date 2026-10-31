import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { SITE_URL } from '../js/share.js';

const search = readFileSync(new URL('../search/search.js', import.meta.url), 'utf8');
const source = search.match(/function buildShareURL\([^]*?\n}/)[0];

test('search links from localhost and Pages previews use the public search route', () => {
  for (const location of [
    { origin: 'http://localhost:8985', pathname: '/search/' },
    { origin: 'https://example.github.io', pathname: '/swift-association/search/' },
    { origin: SITE_URL, pathname: '/search' },
  ]) {
    const context = vm.createContext({ SITE_URL, URLSearchParams, location,
      state: { mode: 'fuzzy', grouped: false, section: 'Bridge', pos: 'end' },
      activeTerms: () => ['love story', 'moon'],
    });
    vm.runInContext(source, context);
    const url = new URL(context.buildShareURL());
    assert.equal(url.origin, SITE_URL);
    assert.equal(url.pathname, '/search/');
    const params = new URLSearchParams(url.hash.slice(1));
    assert.deepEqual(params.getAll('term'), ['love story', 'moon']);
    assert.equal(params.get('mode'), 'fuzzy');
    assert.equal(params.get('view'), 'flat');
    assert.equal(params.get('section'), 'Bridge');
    assert.equal(params.get('pos'), 'end');
  }
});
