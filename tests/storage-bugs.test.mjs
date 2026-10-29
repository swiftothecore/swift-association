import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  exportData, importData, loadRecords, migrateRecordsFromStats,
  resetRecords, saveStats, clearAllData,
} from "../js/storage.js";
import { ACH_KEY, DAILY_OWNER_KEY, RECORDS_KEY, SETTINGS_KEY, STATS_KEY } from "../js/config.js";

class MemoryStorage {
  values = new Map();
  quota = Infinity;
  get length() { return this.values.size; }
  key(index) { return [...this.values.keys()][index] ?? null; }
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) {
    value = String(value);
    const size = [...this.values.values()].reduce((n, item) => n + item.length, 0)
      - (this.values.get(key)?.length || 0) + value.length;
    if (size > this.quota) throw new DOMException("Storage quota exceeded", "QuotaExceededError");
    this.values.set(key, value);
  }
  removeItem(key) { this.values.delete(key); }
}

beforeEach(() => { globalThis.localStorage = new MemoryStorage(); });

test("a records reset stays empty after startup migration while stats survive", () => {
  saveStats({ played: 3, best: 12 }, "medium");
  saveStats({ played: 2, best: 28 }, "inf-3lives-hard");
  migrateRecordsFromStats();
  assert.deepEqual(loadRecords("medium"), [{ score: 12, date: null }]);
  assert.deepEqual(loadRecords("inf-3lives-hard"), [{ score: 28, date: null }]);

  resetRecords();
  migrateRecordsFromStats();
  assert.deepEqual(loadRecords("medium"), []);
  assert.deepEqual(loadRecords("inf-3lives-hard"), []);
  assert.equal(JSON.parse(localStorage.getItem(STATS_KEY)).best, 12);
});

test("a reset before the first migration also keeps historical stats out of records", () => {
  saveStats({ played: 3, best: 12 }, "medium");
  resetRecords();
  migrateRecordsFromStats();
  assert.deepEqual(loadRecords("medium"), []);
});

test("a failed legacy records migration retries when storage space becomes available", () => {
  saveStats({ played: 3, best: 12 }, "medium");
  localStorage.quota = 1;
  migrateRecordsFromStats();
  assert.deepEqual(loadRecords("medium"), []);
  localStorage.quota = Infinity;
  migrateRecordsFromStats();
  assert.deepEqual(loadRecords("medium"), [{ score: 12, date: null }]);
});

test("a full reset permits a subsequently restored legacy notebook to migrate", () => {
  migrateRecordsFromStats();
  clearAllData();
  importData({ [STATS_KEY]: JSON.stringify({ played: 3, best: 12 }) });
  migrateRecordsFromStats();
  assert.deepEqual(loadRecords("medium"), [{ score: 12, date: null }]);
});

test("backup quota failure restores overwritten values and removes new imported keys", () => {
  localStorage.setItem(STATS_KEY, "original stats");
  localStorage.setItem(SETTINGS_KEY, "original settings");
  localStorage.setItem("other-app", "untouched");
  const before = new Map(localStorage.values);
  localStorage.quota = 70;

  assert.throws(() => importData({
    [STATS_KEY]: "imported stats that use more space",
    [ACH_KEY]: "new charm",
    [SETTINGS_KEY]: "photo".repeat(100),
  }), { name: "QuotaExceededError" });
  assert.deepEqual(localStorage.values, before);
});

test("backup round trips preserve record resets and omit another tab's daily claim", () => {
  saveStats({ played: 3, best: 12 }, "medium");
  resetRecords();
  localStorage.setItem(DAILY_OWNER_KEY, JSON.stringify({ owner: "first-tab", date: "2026-10-30", at: 1 }));
  const backup = exportData();
  assert.equal(Object.hasOwn(backup, DAILY_OWNER_KEY), false);
  clearAllData();
  assert.equal(importData(backup), Object.keys(backup).length);
  migrateRecordsFromStats();
  assert.deepEqual(loadRecords("medium"), []);
  assert.equal(localStorage.getItem(DAILY_OWNER_KEY), null);
});

test("import ignores inherited keys, non-strings, and data outside the app namespace", () => {
  const backup = Object.assign(Object.create({ [STATS_KEY]: "inherited" }), {
    [RECORDS_KEY]: "[]", [SETTINGS_KEY]: {}, [DAILY_OWNER_KEY]: "claim", unrelated: "value",
  });
  assert.equal(importData(backup), 1);
  assert.equal(localStorage.getItem(RECORDS_KEY), "[]");
  assert.equal(localStorage.getItem(STATS_KEY), null);
  assert.equal(localStorage.getItem(DAILY_OWNER_KEY), null);
  assert.equal(localStorage.getItem("unrelated"), null);
});
