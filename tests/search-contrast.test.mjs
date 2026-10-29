import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { ALBUM_COLORS } from '../js/config.js';

const source = readFileSync(new URL('../search/search.js', import.meta.url), 'utf8');
const context = vm.createContext({});
vm.runInContext(source.slice(source.indexOf('function albumTabInk('), source.indexOf('let SONGS =')), context);
const luminance = (hex) => {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((n) => n <= 0.04045 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4));
  return channels.reduce((sum, n, i) => sum + n * [0.2126, 0.7152, 0.0722][i], 0);
};
const ratio = (a, b) => {
  const values = [luminance(a), luminance(b)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
};

test('every album divider keeps readable printed text on its own colour', () => {
  for (const [album, color] of Object.entries(ALBUM_COLORS)) {
    const ink = context.albumTabInk(color);
    assert.ok(ratio(ink, color) >= 4.5, `${album}: ${ink} on ${color}`);
  }
});

test('divider ink also covers future midtone stocks and the unknown-album fallback', () => {
  for (let channel = 0; channel <= 255; channel++) {
    const stock = '#' + channel.toString(16).padStart(2, '0').repeat(3);
    assert.ok(ratio(context.albumTabInk(stock), stock) >= 4.5, stock);
  }
  assert.ok(ratio(context.albumTabInk('#999'), '#999999') >= 4.5);
});
