import test from 'node:test';
import assert from 'node:assert/strict';
import { appendHistory, loadHistory, loadTakes } from '../js/storage.js';
import { HISTORY_KEY } from '../js/config.js';

test('a failed history write does not number an unsaved take', () => {
  const values = new Map();
  let rejectHistory = false;
  globalThis.localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem(key, value) {
      if (rejectHistory && key === HISTORY_KEY) throw new DOMException('full', 'QuotaExceededError');
      values.set(key, value);
    },
  };
  appendHistory({ s: 1, d: '2026-11-07T00:00:00Z' });
  rejectHistory = true;
  appendHistory({ s: 2, d: '2026-11-08T00:00:00Z' });
  assert.equal(loadHistory().length, 1);
  assert.equal(loadTakes().n, 1);
  rejectHistory = false;
  appendHistory({ s: 3, d: '2026-11-09T00:00:00Z' });
  assert.equal(loadTakes().n, 2);
});
