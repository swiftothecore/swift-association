import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const search = readFileSync(new URL('../search/search.js', import.meta.url), 'utf8');
const from = search.indexOf('  input.addEventListener("keydown",');
const handlerSource = search.slice(from, search.indexOf('  $("chips").addEventListener', from));
function harness() {
  let handler;
  const calls = [];
  vm.runInNewContext(handlerSource, {
    input: { value: '', addEventListener: (_, fn) => { handler = fn; } },
    state: { terms: ['love'] }, commitTerm: () => calls.push('commit'),
    removeTermAt: i => calls.push(i),
  });
  return { handler, calls };
}

test('search composition keys neither commit a chip nor remove one', () => {
  for (const key of ['Enter', ',', 'Backspace']) {
    for (const composing of [{ isComposing: true }, { keyCode: 229 }]) {
      const { handler, calls } = harness();
      handler({ key, ...composing, preventDefault() { calls.push('prevented'); } });
      assert.deepEqual(calls, [], `${key}: ${JSON.stringify(composing)}`);
    }
  }
});

test('ordinary search Enter, comma and empty-field Backspace retain their actions', () => {
  for (const [key, action] of [['Enter', 'commit'], [',', 'commit'], ['Backspace', 0]]) {
    const { handler, calls } = harness();
    handler({ key, preventDefault() { calls.push('prevented'); } });
    assert.deepEqual(calls, ['prevented', action]);
  }
});
