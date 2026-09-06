import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildCardSVG } from "../js/braceletcard.js";

const vars = {
  ink: "#222",
  inkSoft: "#666",
  inkAccent: "#a9791f",
  paper: "#fffaf0",
  paperEdge: "#eee",
  bead: "#c8951f",
  margin: "#b55",
  rule: "#ddd",
};

const meta = (stats) => ({
  vars,
  kicker: "Swift to the Song Association",
  title: "an infinite strand",
  braceletMarkup: '<svg viewBox="0 0 520 132"></svg>',
  stats,
  footer: "September 6, 2026 · 10:16 AM · swiftassociation.com",
});

test("a six-fact bracelet card keeps difficulty and hint use", () => {
  const svg = buildCardSVG(meta([
    { v: "Infinite", l: "mode" },
    { v: "Easy", l: "difficulty" },
    { v: "77", l: "rounds" },
    { v: "74", l: "strung" },
    { v: "12:34", l: "on the clock" },
    { v: "7", l: "hints used" },
  ]), "");

  assert.match(svg, />DIFFICULTY<\/text>/);
  assert.match(svg, />HINTS USED<\/text>/);
  assert.match(svg, /height="550" viewBox="0 0 760 550"/);
  assert.doesNotMatch(svg, /undefined|NaN/);
});

test("longer card summaries split into two balanced rows", () => {
  const svg = buildCardSVG(meta([
    { v: "Infinite", l: "mode" },
    { v: "Easy", l: "difficulty" },
    { v: "77", l: "rounds" },
    { v: "74", l: "strung" },
    { v: "12:34", l: "on the clock" },
    { v: "7", l: "hints used" },
  ]), "");
  const labels = [...svg.matchAll(/<text x="([\d.]+)" y="([\d.]+)"[^>]*font-size="11\.5"[^>]*>([^<]+)<\/text>/g)]
    .map(([, x, y, text]) => ({ x: Number(x), y: Number(y), text }));

  assert.deepEqual(labels.map(({ x, y }) => [x, y]), [
    [180.3, 398], [393, 398], [605.7, 398],
    [180.3, 456], [393, 456], [605.7, 456],
  ]);
});

test("the app supplies difficulty and an explicit hint count to keepsakes", () => {
  const app = readFileSync(new URL("../js/app.js", import.meta.url), "utf8");
  const cardMeta = app.match(/function buildCardMeta\(\)[\s\S]*?\n}\n\n\/\* An exported SVG/);

  assert.ok(cardMeta, "could not locate buildCardMeta");
  assert.match(cardMeta[0], /currentMode\.label, l: "difficulty"/);
  assert.match(cardMeta[0], /String\(hintsUsed\), l: "hints used"/);
  assert.match(cardMeta[0], /stats: stats\.slice\(0, 6\)/);
});
