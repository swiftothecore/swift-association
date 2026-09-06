import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync(new URL("../js/app.js", import.meta.url), "utf8");
const css = readFileSync(new URL("../styles.css", import.meta.url), "utf8");

test("settings captures vertical arrows regardless of the focused control", () => {
  assert.match(app, /function handleSettingsPageArrow\(e\)[\s\S]*?classList\.contains\("open"\)/);
  assert.match(app, /const step = \{ ArrowDown: 1, ArrowUp: -1 \}\[e\.key\]/);
  assert.match(app, /e\.preventDefault\(\);\s*e\.stopPropagation\(\);\s*stepSettingsPanel\(step\);/);
  assert.match(app, /document\.addEventListener\("keydown", handleSettingsPageArrow, true\);/);
});

test("settings divider focus does not draw a yellow outline", () => {
  assert.match(css, /\.set-tab:focus-visible\s*\{\s*outline:\s*none;\s*\}/);
});
