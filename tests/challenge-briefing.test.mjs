import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { ALBUM_COLORS, CB_ALBUM_COLORS } from "../js/config.js";
import { paperTextInk } from "../js/util.js";

const luminance = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  .map((n) => n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4)
  .reduce((sum, n, i) => sum + n * [0.2126, 0.7152, 0.0722][i], 0);
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

test("album briefing text stays readable on every paper and both palettes", () => {
  const stocks = ["#f5efe1", "#e8d9b8", "#f1e4c9", "#f6e4e4", "#dfe3e8", "#e2e8d8"];
  const themes = stocks.map((paper) => [paper, "#2b2722", 4.5]);
  themes.push(["#2a241b", "#ece5d6", 4.5], ["#ffffff", "#000000", 7], ["#17130d", "#ffffff", 7]);
  for (const palette of [ALBUM_COLORS, CB_ALBUM_COLORS]) {
    for (const [album, color] of Object.entries(palette)) {
      for (const [paper, pen, minimum] of themes) {
        const ink = paperTextInk(color, paper, pen, minimum);
        assert.ok(contrast(ink, paper) >= minimum, `${album}: ${ink} on ${paper}`);
        if (contrast(color, paper) >= minimum) assert.equal(ink, color, "already readable colours stay intact");
      }
    }
  }
});

const app = readFileSync(new URL("../js/app.js", import.meta.url), "utf8");
test("a changed page target keeps its unit once and its old target beside the new one", () => {
  const context = vm.createContext({
    BRIEF_GOAL: /(\d+(?:\.\d+)?)(\s*\/\s*13)?/,
    escapeHtml: (text) => text,
    briefWas: (text) => `<del>${text}</del>`, briefLoopSVG: () => "",
  });
  vm.runInContext(app.match(/function briefWinHTML\([^]*?\n}/)[0], context);
  const result = context.briefWinHTML("Score 10 / 13 playing each album.", "Score 9 / 13 playing each album.");
  assert.match(result, /<span class="brief-change"><del>9<\/del>/);
  assert.equal((result.match(/\/ 13/g) || []).length, 1);
  assert.match(result, /brief-goal-ink">10 \/ 13/);
  assert.match(context.briefWinHTML("Write 1500 characters.", "Write 1100 characters."), /<del>1100<\/del>/);
});

const begin = app.match(/function beginRoundClock\([^]*?\n}/)[0];
function queuedCards() {
  const timers = [], clicks = [];
  const classes = new Set();
  let key;
  const button = { addEventListener: (_name, fn) => { button.click = fn; } };
  const overlay = {
    innerHTML: "brief",
    classList: { add: (name) => classes.add(name), remove: (name) => classes.delete(name) },
    querySelector(selector) {
      if (selector === ".chall-curtain-card") return {};
      return this.innerHTML === "brief" ? button : null;
    },
    addEventListener: (_name, fn) => clicks.push(fn),
  };
  const context = vm.createContext({
    settingsPauseActive: false, settingsDeferredRoundClock: false,
    roundCurtainHTML: () => ["brief", "notice"],
    $: () => ({ parentNode: {}, classList: { contains: () => false } }),
    gameType: "challenge", currentChallenge: { rule: "switchup" },
    showTimerFull() {}, motionReduced: () => true, fitCurtain() {},
    curtainKeyOff: null, curtainReadLength: () => 30,
    CURTAIN_NOTICE_MS: 900, CURTAIN_MS_PER_CHAR: 45, CURTAIN_MIN_MS: 1750, CURTAIN_MAX_MS: 4200,
    scheduleCurtainTimer: (fn, ms) => timers.push({ fn, ms }),
    document: {
      querySelector: () => overlay,
      addEventListener: (_name, fn) => { key = fn; },
      removeEventListener: () => { key = null; },
    },
  });
  vm.runInContext(begin + "\nbeginRoundClock();", context);
  const event = (repeat = false) => ({
    key: "Enter", repeat, stopped: false,
    stopPropagation() { this.stopped = true; }, preventDefault() {},
  });
  return { overlay, timers, classes,
    clickStamp() {
      const e = event();
      button.click(e);
      // Bubble into the overlay's current listeners, including one installed by the swap.
      if (!e.stopped) clicks.slice().forEach((fn) => fn(e));
    },
    clickNotice() { clicks.slice().forEach((fn) => fn(event())); },
    enter(repeat = false) { key?.(event(repeat)); },
  };
}

test("one reduced-motion stamp click leaves the queued notice up to be read", () => {
  const cards = queuedCards();
  cards.clickStamp();
  assert.equal(cards.overlay.innerHTML, "notice");
  assert.equal(cards.classes.has("leaving"), false);
  assert.equal(cards.timers.length, 1);
  assert.ok(cards.timers[0].ms >= 1000, "the next notice gets its reading interval");
  cards.clickNotice();
  assert.equal(cards.classes.has("leaving"), true, "a separate click can still skip the notice");
});

test("Enter acknowledges the briefing without also spending the following notice", () => {
  const cards = queuedCards();
  cards.enter();
  assert.equal(cards.overlay.innerHTML, "notice");
  assert.equal(cards.classes.has("leaving"), false);
  cards.enter(true);
  assert.equal(cards.classes.has("leaving"), false);
});
