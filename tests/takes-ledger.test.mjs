import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";
import { appendHistory, loadHistory, loadTakes, resetRecords } from "../js/storage.js";
import { HISTORY_KEY, TAKES_KEY } from "../js/config.js";

class MemoryStorage {
  values = new Map();
  get length() { return this.values.size; }
  key(index) { return [...this.values.keys()][index] ?? null; }
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, String(value)); }
  removeItem(key) { this.values.delete(key); }
}

beforeEach(() => { globalThis.localStorage = new MemoryStorage(); });

const run = (i) => ({ s: 7, c: 7, n: 13, m: "medium", t: "classic", d: new Date(Date.UTC(2026, 0, 1, 0, i)).toISOString(), tm: 50 });

test("every logged run is a take, and the first one sets since", () => {
  for (let i = 0; i < 3; i++) appendHistory(run(i));
  const t = loadTakes();
  assert.equal(t.n, 3);
  assert.equal(t.since, run(0).d);
});

test("the take count keeps climbing after the log reaches its cap", () => {
  for (let i = 0; i < 1003; i++) appendHistory(run(i));
  assert.equal(loadHistory().length, 1000);
  const t = loadTakes();
  assert.equal(t.n, 1003, "numbering from the capped log would have renumbered every take");
  assert.equal(t.since, run(0).d, "the first take is not the oldest row of a capped log");
});

test("a notebook from before the count existed is seeded from its own log", () => {
  const old = [run(2), run(1), run(0)];   // newest first, as the log is kept
  localStorage.setItem(HISTORY_KEY, JSON.stringify(old));
  assert.deepEqual(loadTakes(), { n: 3, since: run(0).d });
  appendHistory(run(3));
  assert.deepEqual(JSON.parse(localStorage.getItem(TAKES_KEY)), { n: 4, since: run(0).d });
});

test("resetting records starts the takes again at one", () => {
  for (let i = 0; i < 5; i++) appendHistory(run(i));
  resetRecords();
  assert.deepEqual(loadTakes(), { n: 0, since: null });
  appendHistory(run(9));
  assert.equal(loadTakes().n, 1);
});
