import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
const start = source.indexOf('window.addEventListener("popstate",');
const end = source.indexOf('// Boot: open the panel', start);

test('restored panel history cannot leave a panel URL on a live run', () => {
  for (const screen of ['game', 'bonusplay']) {
    let popstate, slug = 'stats', opened = 0;
    const h = vm.createContext({
      screens: Object.fromEntries(['game', 'bonusplay', 'start', 'stats'].map((name) =>
        [name, { classList: { contains: () => name === screen } }])),
      window: { addEventListener: (_, fn) => { popstate = fn; } },
      clearRoute: () => { slug = null; }, currentRouteSlug: () => slug,
      routeOpeners: { stats: () => { opened++; } }, PANEL_ROUTES: { stats: 'stats' },
      backToScreen: () => { opened++; }, routing: false,
    });
    vm.runInContext(source.slice(start, end), h);
    popstate();
    assert.equal(slug, null, screen);
    assert.equal(opened, 0, screen);
  }
});
