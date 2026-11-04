import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../js/app.js", import.meta.url), "utf8");
function harness(extra = {}) {
  const context = vm.createContext({
    TOTAL_ROUNDS: 13, MODE_ORDER: ["medium"], currentMode: { id: "medium" }, gameType: "classic", CTA_ARROW: "NEXT",
    settings: { hideDailyScore: false, textSize: "standard" }, STATS_TREND: { up: "UP", down: "DOWN" },
    loadHistory: () => [], statsTape: () => "", statsTicketHTML: () => "TICKET",
    statsBestSetDate: () => null, pad3: String, statsStaffSVG: () => "STAFF",
    statsGraphSVG: (_, score) => score == null ? "GRAPH" : `THIS GAME ${score}`,
    loadSongTally: () => ({ misses: { love: 3 } }), statsClippingHTML: () => "NEMESIS",
    dailyPlayedDates: () => ({}), loadDailyResult: () => null,
    ...extra,
  });
  for (const name of ["recentScores", "statsMostlyRange", "topTallyEntry", "statsGistHTML", "statsLatelyLine",
    "statsGameHTML", "statsSealedDailyDates", "statsLifetimeHTML", "statsDailyPassHTML", "shiftMonthKey", "statsBlotterHTML"]) {
    const match = source.match(new RegExp(`function ${name}\\([\\s\\S]*?\\n}`));
    assert.ok(match, name);
    vm.runInContext(match[0], context);
  }
  return context;
}
const stats = { played: 5, totalScore: 30, best: 13, bestInRow: 13,
  scoreCounts: Array.from({ length: 14 }, (_, n) => n === 0 ? 2 : [7, 10, 13].includes(n) ? 1 : 0) };

test("unfinished-only notebooks have a distribution but no empty recent-score strip", () => {
  const c = harness();
  const html = c.statsGameHTML(stats, "all", true, null, 572);
  assert.match(html, /GRAPH/);
  assert.doesNotMatch(html, /stp-staff|last 0|lately/);
});

test("finishing three games after partial runs does not invent an improving trend", () => {
  const c = harness({ loadHistory: () => [7, 13, 10].map((s) => ({ s, t: "classic", m: "medium" })) });
  const html = c.statsGameHTML(stats, "all", true, null, 572);
  assert.match(html, /Last 3 finished Classic scores, oldest first: 10, 13, 7/);
  assert.doesNotMatch(html, /lately|stp-up/);
});

test("a trend compares completed scores even when abandoned runs lower the lifetime average", () => {
  const c = harness({ loadHistory: () => Array.from({ length: 15 }, () => ({ s: 10, t: "classic", m: "medium" })) });
  const html = c.statsGameHTML({ ...stats, played: 30 }, "all", true, null, 572);
  assert.match(html, /lately <b>10.0/);
  assert.doesNotMatch(html, /stp-up|stp-down/);
});

test("Daily, Infinite and sandbox results never mark a Classic histogram bar", () => {
  const c = harness();
  for (const type of ["daily", "infinite", "challenge", "custom", "album", "guest", "ruthless", "lineup"]) {
    c.gameType = type;
    assert.doesNotMatch(c.statsGameHTML(stats, "all", true, 13, 572), /THIS GAME/, type);
  }
  c.gameType = "classic";
  assert.match(c.statsGameHTML(stats, "all", true, 13, 572), /THIS GAME 13/);
  assert.doesNotMatch(c.statsGameHTML(stats, "hard", false, 13, 572), /THIS GAME/);
});

test("sealed Daily detection covers earlier unrevealed days until each has been opened", () => {
  const saved = { "2026-11-03": { revealed: true }, "2026-11-04": {} };
  const c = harness({ settings: { hideDailyScore: true }, dailyPlayedDates: () => ({ "2026-11-03": 13, "2026-11-04": 7 }),
    loadDailyResult: (key) => saved[key] });
  assert.equal(JSON.stringify(c.statsSealedDailyDates()), '["2026-11-04"]');
  saved["2026-11-04"].revealed = true;
  assert.equal(c.statsSealedDailyDates().length, 0);
});

test("sealed lifetime figures and nemesis cannot reveal a Daily by their changes", () => {
  const c = harness({ loadMetrics: () => ({}), effectiveDailyStreak: () => ({}), todayKey: () => "2026-11-04" });
  c.statsDailyPassHTML = (_, dates) => `PASS ${dates.length}`;
  const html = c.statsLifetimeHTML(572, ["2026-11-04"]);
  assert.match(html, /Lifetime totals are covered/);
  assert.match(html, /data-daily-date="2026-11-04"/);
  assert.match(html, /PASS 1/);
  assert.doesNotMatch(c.statsGameHTML(stats, "all", true, null, 572, true), /NEMESIS/);
});

test("a sealed perfect Daily keeps both its punch and its lifetime star total covered", () => {
  const c = harness({ todayKey: () => "2026-11-04", statsCalendarMonth: null,
    MONTH_NAMES: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    settings: { hideDailyScore: true }, dailyPlayedDates: () => ({ "2026-11-04": 13 }),
    dailyTotals: () => ({ played: 1, perfect: 1 }), earliestPlayedMonth: () => "2026-11",
    dailyPunchSVG: (star) => star ? "STAR" : "ROUND", CTA_ARROW: "NEXT", BACK_ARROW: "PREV" });
  const streak = { current: 1, best: 1, lastPlayed: "2026-11-04" };
  const hidden = c.statsDailyPassHTML(streak, ["2026-11-04"]);
  assert.match(hidden, /November 4, sealed, reopen/);
  assert.match(hidden, /star punch<\/dt><dd[^>]*>\?/);
  assert.doesNotMatch(hidden, /STAR/);
  c.loadDailyResult = () => ({ revealed: true });
  const opened = c.statsDailyPassHTML(streak, []);
  assert.match(opened, /STAR/);
  assert.match(opened, /star punch<\/dt><dd>1/);
});

test("album discoveries expose named keyboard controls and give Large text room", () => {
  const c = harness({ statsBlotUid: 0, fnv1a: () => 1, mulberry32: () => () => 0.5,
    blotF: (n) => n.toFixed(1), blotPencilRing: () => "", albumColor: () => "#abc",
    escapeHtml: (s) => s, STATS_ALBUM_SHORT: {} });
  const order = ["Taylor Swift", "Fearless", "Speak Now", "Red"];
  const total = Object.fromEntries(order.map((a) => [a, 17]));
  const standard = c.statsBlotterHTML(order, {}, total, 326, true);
  assert.equal((standard.match(/role="button" tabindex="0"/g) || []).length, 4);
  assert.match(standard, /aria-label="Taylor Swift: 0 of 17 songs found. Open album in songbook"/);
  assert.match(standard, /data-columns="4"/);
  c.settings.textSize = "large";
  assert.match(c.statsBlotterHTML(order, {}, total, 256, true), /data-columns="2"/);
});

test("resizing redraws the current view once and restores the focused album", () => {
  const focused = { dataset: { songbookAlbum: "Fearless" } };
  let focusRestored = false;
  const replacement = { dataset: { songbookAlbum: "Fearless" }, focus: () => { focusRestored = true; } };
  const el = { clientWidth: 326, contains: (e) => e === focused, querySelectorAll: () => [replacement] };
  const calls = [];
  const c = vm.createContext({ $: () => el, screens: { stats: { classList: { contains: () => true } } },
    statsView: { lastScore: 7, viewMode: "all" }, statsLayoutWidth: 572,
    document: { activeElement: focused }, renderStats: (...args) => { calls.push(args); c.statsLayoutWidth = el.clientWidth; } });
  vm.runInContext(source.match(/function refreshStatsLayout\([\s\S]*?\n}/)[0], c);
  c.refreshStatsLayout();
  c.refreshStatsLayout();
  assert.deepEqual(calls, [[7, "all"]]);
  assert.equal(focusRestored, true);
  c.refreshStatsLayout(true);
  assert.equal(calls.length, 2, "settings changes can redraw even at the same width");
});
