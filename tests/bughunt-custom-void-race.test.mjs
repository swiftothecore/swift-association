import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
const start = source.indexOf('  act("void", () => {');
const end = source.indexOf('  const ok = $("customModalOkBtn");', start);

test('a pending VOID removes its original copy and preserves a newly selected copy', () => {
  let state = { saved: [{ id: 'a' }, { id: 'b' }], from: 'a', draft: { seconds: 12 } };
  let voidCopy, finishStamp;
  const h = vm.createContext({
    fmVoiding: false,
    act: (_, fn) => { voidCopy = fn; },
    loadCustom: () => structuredClone(state), saveCustom: (next) => { state = next; },
    body: { querySelector: () => null }, motionReduced: () => false,
    setTimeout: (fn) => { finishStamp = fn; }, syncCustomUI() {},
    $: () => ({ classList: { contains: () => false } }),
  });
  vm.runInContext(source.slice(start, end), h);
  voidCopy();
  state.from = 'b'; state.draft = { seconds: 5 };
  finishStamp();
  assert.deepEqual(state.saved.map(p => p.id), ['b']);
  assert.equal(state.from, 'b');
  assert.equal(state.draft.seconds, 5);
});
