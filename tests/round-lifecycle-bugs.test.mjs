import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const app = readFileSync(new URL("../js/app.js", import.meta.url), "utf8");
function source(name) {
  const found = app.match(new RegExp(`function ${name}\\([^]*?\\n}`));
  assert.ok(found, `missing ${name}`);
  return found[0];
}
const activeScreen = () => ({ classList: { contains: (name) => name === "active" } });

test("a surrendered Daily removes its background pause sheet before returning to the desk", () => {
  const calls = [];
  const state = vm.createContext({
    gameType: "daily", screens: { game: activeScreen() }, dailySurrendered: false,
    stopDailyOwnerBeat() {}, notifyNote() {},
    dropRunPause() { calls.push("release pause"); },
    quitGame() { calls.push("quit"); },
  });
  vm.runInContext(`${source("surrenderDailyRun")}\nsurrenderDailyRun();`, state);
  assert.deepEqual(calls, ["release pause", "quit"]);
  assert.equal(state.dailySurrendered, false);
});

for (const completed of [0, 4]) {
  test(`Daily page ${completed + 1} keeps rejected answers across quit and resume`, () => {
    const reject = { key: "not a real song", title: null, word: "gold" };
    let saved = completed ? {
      version: 1, startDate: "2026-10-30", round: completed,
      roundResults: Array(completed).fill(true), roundRejects: [],
    } : null;
    const state = vm.createContext({
      gameType: "daily", screens: { game: activeScreen() }, roundLocked: false,
      round: completed + 1, roundResults: Array(completed).fill(true),
      roundRejects: Array.from({ length: completed + 1 }, (_, i) => i === completed ? [reject] : []),
      pausedClockState: null, timerId: 1, roundClockTotal: 10,
      clockRemaining: () => 4, dailyRunDate: "2026-10-30", todayKey: () => "2026-10-30",
      TAB_ID: "this-tab", DAILY_PROGRESS_VERSION: 1, TOTAL_ROUNDS: 13,
      claimDailyRun: () => true, loadDailyProgress: () => saved,
      saveDailyProgress(_date, value) { saved = value; },
      loadDailyResult: () => null, notePlayed() {}, MODES: { medium: {} },
      currentMode: {}, dailyRng: null, braceletSeed: null, dailyAlbumPool: null, dailyAlbum: null,
      resetRunState() {
        state.round = 0; state.roundResults = []; state.roundRejects = [];
      },
      mulberry32: () => ({ seek() {} }), dailySeed: () => 1,
      anniversaryAlbumFor: () => null, anniversaryPool: () => ({ pool: null }),
      restoreDailyProgress(progress) {
        state.round = progress.round;
        state.roundResults = progress.roundResults.slice();
        state.roundRejects = (progress.roundRejects || []).map((list) => list.slice());
      },
      startDailyOwnerBeat() {}, applyInputHints() {}, updateTagline() {}, showScreen() {},
      $: () => ({ style: {}, textContent: "" }),
      advanceRound() { state.round++; }, beginRoundClock() {},
      nextRound() { state.round++; },
    });
    vm.runInContext(`${source("stampDailyLiveClock")}\n${source("startDaily")}`, state);
    vm.runInContext("stampDailyLiveClock(); startDaily();", state);
    assert.equal(state.round, completed + 1);
    assert.deepEqual(JSON.parse(JSON.stringify(state.roundRejects[completed])), [reject]);
    assert.equal(saved.live.remaining, 4);
  });
}
