import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync(new URL("../js/app.js", import.meta.url), "utf8");
const css = readFileSync(new URL("../styles.css", import.meta.url), "utf8");
const dev = readFileSync(new URL("../js/dev.js", import.meta.url), "utf8");

const occurrences = (source, needle) => source.split(needle).length - 1;

test("every visual page clone is collision-free, inert, and palette-stable", () => {
  assert.match(app, /el\.setAttribute\("data-flip-id", old\)/);
  assert.equal(occurrences(app, "renameFlipIds(flip);"), 3);
  assert.equal(occurrences(app, 'flip.setAttribute("inert", "");'), 3);
  assert.equal(occurrences(app, "freezeFlipPalette(card, flip);"), 2);
  assert.equal(occurrences(app, "freezeFlipPalette(src, flip);"), 1);
  assert.equal(occurrences(app, "turn.layer.appendChild(flip);"), 3);
  assert.equal(occurrences(app, "copyFlipRuntimeState("), 3);
  assert.match(app, /copy\.scrollTop = node\.scrollTop;\s*copy\.scrollLeft = node\.scrollLeft;/);
  assert.match(app, /copy\.getContext\("2d"\)\.drawImage\(node, 0, 0\);/);
});

test("the turn runs in a fixed, clipped interaction layer with locked geometry", () => {
  assert.match(css, /\.page-flip-layer\s*\{[\s\S]*?position:\s*fixed;[\s\S]*?overflow:\s*clip;[\s\S]*?pointer-events:\s*auto;/);
  assert.match(app, /app\.style\.height = appRect\.height \+ "px";/);
  assert.match(app, /app\.style\.maxHeight = appRect\.height \+ "px";/);
  assert.match(app, /widthSentinel\.style\.cssText = `position:absolute;[\s\S]*?width:\$\{documentWidth\}px/);
  assert.match(app, /holdAttribute\(app, "aria-busy", "true"\);/);
  assert.match(app, /window\.addEventListener\("resize", finishActivePageTurn\);/);
  assert.match(app, /window\.addEventListener\("scroll", finishActivePageTurn/);
  assert.match(app, /function applySettings\(\) \{[\s\S]*?if \(activePageTurn\) finishActivePageTurn\(\);/);
  assert.match(app, /matchMedia\("\(prefers-reduced-motion: reduce\)"\)\.addEventListener\("change"/);
});

test("renamed clone ids retain every id-based presentation rule", () => {
  const aliasedIds = [
    "screen-bonusplay",
    "bonusShelfBtn",
    "bonusAgainBtn",
    "backToChallenges",
    "replayChallenge",
    "backToAlbumFocus",
    "replayAlbumFocus",
    "backToCustom",
    "replayCustom",
    "againBtn",
    "ruthlessBody",
    "albumDetailBody",
    "guestDetailBody",
    "histMore",
    "screen-results",
    "saveNameBtn",
    "screen-start",
    "screen-stats",
  ];
  for (const id of aliasedIds) {
    assert.ok(css.includes(`[data-flip-id="${id}"]`), `${id} has no clone styling alias`);
  }
  assert.match(css, /\.page-flip-sheet\[data-flip-id="screen-ruthless"\]\s*\{\s*display:\s*flex;/);
});

test("side destinations stay inert and unfocused until the shared completion", () => {
  assert.equal(occurrences(app, "turn.holdInert(dest);"), 2);
  assert.match(app, /function revealNotebook[\s\S]*?const turn = beginPageTurn\(card\);\s*turn\.holdInert\(card\);/);
  assert.match(app, /if \(card\.classList\.contains\("active"\)\) focusScreen\("start"\);\s*done\(\);/);
  assert.equal(occurrences(app, "showScreen(name, { deferFocus: true, deferPresentation: true });"), 2);
  assert.equal(occurrences(app, "commitScreenPresentation(name, false);"), 2);
  assert.equal(occurrences(app, 'if (dest.classList.contains("active")) focusScreen(name);'), 2);
});

test("main-game early input is timed and submitted at the reveal boundary", () => {
  assert.match(app, /advanceRound\(\{ clockPending: true \}\);/);
  assert.match(app, /if \(roundClockPending\) showTimerFull\(\);/);
  assert.match(app, /value: input \? input\.value : "",\s*activeIndex,/);
  assert.match(app, /if \(input\) input\.disabled = true;/);
  assert.match(app, /if \(queued && queued\.value != null\)[\s\S]*?input\.value = queued\.value;[\s\S]*?activeIndex = queued\.activeIndex;/);
  assert.match(app, /!roundClockPending\s*&& input\.value && roundFirstKeyLeft/);
  assert.match(app, /startTimer\(\);[\s\S]*?if \(input\.value && roundFirstKeyLeft\[round - 1\] == null\)/);
});

test("bonus and Ruthless clocks wait for a fully interactive page", () => {
  assert.match(app, /nextBonusRound\(\{ entering: true \}\);/);
  assert.match(app, /bonusRunStart = 0;/);
  assert.match(app, /if \(!\(bonusRunStart > 0\)\) bonusRunStart = performance\.now\(\);/);
  assert.match(app, /turnPageSheet\(\$\("screen-bonusplay"\), lay, begin, \{ inert: true \}\);/);
  assert.match(app, /renderBonusRound\(\);\s*showBonusClockReady\(\);/);
  assert.match(app, /function showBonusClockReady\(\)[\s\S]*?label\.textContent = bonusSeconds\(\)\.toFixed\(1\);/);
  assert.equal(occurrences(app, "bonusPageStart = performance.now();"), 1);
  assert.doesNotMatch(app, /answer given during the flip/);
});

test("the held-turn diagnostic checks the full transaction", () => {
  assert.match(dev, /attr\.value\.matchAll\(\/url/);
  assert.match(dev, /idRefAttrs\.has\(attr\.name\)/);
  assert.match(dev, /duplicate ids:/);
  assert.match(dev, /clone hidden\/inert:/);
  assert.match(dev, /geometry stable:/);
  assert.match(dev, /fixed clipped layer:/);
  assert.match(dev, /destination held:/);
});
