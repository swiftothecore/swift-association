import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
const start = source.indexOf('function handleBrowseArrow(');
const end = source.indexOf('function turnHowTo(', start);

test('browsing shortcuts wait for an inert destination to finish turning', () => {
  for (const name of ['stats', 'bonus', 'challenges']) {
    let actions = 0;
    const screens = Object.fromEntries(['stats', 'bonus', 'challenges'].map(id =>
      [id, { inert: true, classList: { contains: () => id === name } }]));
    const items = [{ matches: () => true }, { click: () => { actions++; } }];
    const body = {};
    const h = vm.createContext({
      screens, browseKeyIsFree: () => true, document: { body, activeElement: body },
      statsView: { viewMode: 'all' }, MODE_ORDER: ['relaxed'],
      renderStats: () => { actions++; }, $: () => ({ querySelectorAll: () => items }),
    });
    vm.runInContext(source.slice(start, end), h);
    const press = () => h.handleBrowseArrow({ key: 'ArrowRight', preventDefault() {} });
    press();
    assert.equal(actions, 0, name + ' during turn');
    screens[name].inert = false;
    press();
    assert.equal(actions, 1, name + ' after turn');
  }
});
