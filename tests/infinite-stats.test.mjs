import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync(new URL("../js/app.js", import.meta.url), "utf8");
const strandSource = app.match(/function infStrandHTML[\s\S]*?\n}\nfunction infiniteTabHTML/);

assert.ok(strandSource, "could not locate the Infinite strand renderer");
const infStrandHTML = Function(
  "INF_TRACK",
  `return (${strandSource[0].replace(/\nfunction infiniteTabHTML$/, "")})`,
)(320);

test("a zero-round Infinite run renders an empty strand", () => {
  const html = infStrandHTML(0, "#c08a2e", 13);

  assert.match(html, /class="inf-strand"/);
  assert.match(html, /<path /);
  assert.doesNotMatch(html, /undefined|NaN/);
  assert.doesNotMatch(html, /<circle /);
});

test("a survived Infinite round still renders a bead", () => {
  const html = infStrandHTML(1, "#c08a2e", 13);

  assert.match(html, /<circle /);
  assert.doesNotMatch(html, /undefined|NaN/);
});
