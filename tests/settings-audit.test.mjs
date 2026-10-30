import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { DEFAULT_SETTINGS, MODES } from "../js/config.js";
import { censorText, escapeHtml } from "../js/util.js";

const app = readFileSync(new URL("../js/app.js", import.meta.url), "utf8");
const search = readFileSync(new URL("../search/search.js", import.meta.url), "utf8");
function source(text, name) {
  const found = text.match(new RegExp(`function ${name}\\([^]*?\\n}`));
  assert.ok(found, `missing ${name}`);
  return found[0];
}

test("resetting preferences preserves identity and learned onboarding while restoring defaults", () => {
  const identity = {
    playerName: "Corey", avatar: "photo", favouriteAlbum: "Red", lastGameType: "infinite",
    firstRunDone: true, firstMatchDone: true, seenCoachmarks: { hint: true }, typingHintsSeen: { title: 7 },
  };
  const context = vm.createContext({
    DEFAULT_SETTINGS, settings: { ...DEFAULT_SETTINGS, ...identity, theme: "dark", countdownSecs: 8 },
    settingsOverRun: () => false, saveSettings() {}, applySettings() {}, refreshStartBoard() {}, renderSettingsBody() {},
  });
  vm.runInContext(source(app, "performDanger") + '\nperformDanger("settings");', context);
  for (const [key, value] of Object.entries(identity)) assert.deepEqual(context.settings[key], value, key);
  assert.equal(context.settings.theme, "light");
  assert.equal(context.settings.countdownSecs, 5);
});

test("reset cannot change a live run's matching rule", () => {
  const settings = { ...DEFAULT_SETTINGS, stemMatching: false, theme: "dark" };
  const context = vm.createContext({ settings, settingsOverRun: () => true });
  vm.runInContext(source(app, "performDanger") + '\nperformDanger("settings");', context);
  assert.equal(context.settings, settings);
});

test("the stats default accepts Infinite and every classic difficulty", () => {
  const context = vm.createContext({ settings: {}, currentMode: MODES.hard, MODES });
  vm.runInContext(source(app, "defaultStatsView"), context);
  for (const value of ["all", "infinite", ...Object.keys(MODES)]) {
    context.settings.defaultStatsTab = value;
    assert.equal(context.defaultStatsView(), value);
  }
  context.settings.defaultStatsTab = "last";
  assert.equal(context.defaultStatsView(), "hard");
});

test("search masks entire words before a partial highlight splits them", () => {
  const context = vm.createContext({
    censorText, escapeHtml, notebookSettings: { censorExplicit: true },
  });
  vm.runInContext(source(search, "displayText") + '\n' + source(search, "markRanges"), context);
  const actual = context.markRanges('fucking <love>', [{ start: 1, len: 3 }, { start: 9, len: 4 }]);
  assert.equal(actual, 'f<mark>***</mark>**g &lt;<mark>love</mark>&gt;');
  context.notebookSettings.censorExplicit = false;
  assert.equal(context.markRanges('fuck', [{ start: 0, len: 4 }]), '<mark>fuck</mark>');
  assert.equal(context.markRanges('nigga', [{ start: 0, len: 5 }]), '<mark>n***a</mark>');
});

for (const [name, now, hours] of [
  ["spring clock change", "2026-03-08T05:00:00Z", 23],
  ["autumn clock change", "2026-11-01T04:00:00Z", 25],
  ["ordinary day", "2026-10-30T04:00:00Z", 24],
]) {
  test(`daily reset countdown follows ${name} in the chosen zone`, () => {
    let clock = Date.parse(now);
    const context = vm.createContext({ Date: { now: () => clock }, Intl,
      dailyResetBoundary: null, activeTimeZone: () => "America/New_York" });
    vm.runInContext(source(app, "msUntilDailyReset"), context);
    assert.equal(context.msUntilDailyReset(), hours * 3600000);
    clock += 1000;
    assert.equal(context.msUntilDailyReset(), hours * 3600000 - 1000);
    clock += hours * 3600000 - 1000;
    assert.equal(context.msUntilDailyReset(), 24 * 3600000);
  });
}
