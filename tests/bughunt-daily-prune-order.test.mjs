import test from 'node:test';
import assert from 'node:assert/strict';
import { saveDailyProgress, loadDailyProgress } from '../js/storage.js';

test('a delayed older Daily save cannot erase a newer run', () => {
  const values = new Map();
  globalThis.localStorage = {
    get length() { return values.size; },
    key: (i) => [...values.keys()][i] ?? null,
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
  const newer = { roundResults: [true, false] };
  saveDailyProgress('2026-11-08', newer);
  saveDailyProgress('2026-11-07', { roundResults: [true] });
  assert.deepEqual(loadDailyProgress('2026-11-08'), newer);
  assert.equal(loadDailyProgress('2026-11-07'), null);
});
