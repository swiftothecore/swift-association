import test from 'node:test';
import assert from 'node:assert/strict';
import { byId } from '../js/lineupdeck.js';
import { judge, ALIVE, WON, DEAD } from '../js/lineupgoals.js';

const shelf = ['Taylor Swift', 'A', 'B', 'C', 'D', 'E', 'F'];
const ctx = { pages: 13, shelf, home: shelf[0] };
const page = (artists, extra = {}) => ({
  artists: artists === null ? [] : Array.isArray(artists) ? artists : [artists],
  ms: 1000, dropdown: false, sung: false, hinted: false, ...extra,
});
const run = (artists) => artists.map((a) => page(a));
const verdict = (id, pages) => judge(byId[id], pages, ctx);

test('Off The Cuff fails immediately on an unanswered page even when it was skipped quickly', () => {
  assert.equal(verdict('off-the-cuff', [page(null)]), DEAD);
  assert.equal(verdict('off-the-cuff', run([...Array(12).fill('A'), null])), DEAD);
  assert.equal(verdict('off-the-cuff', run(Array(13).fill('A'))), WON);
});

test('One And Done needs a consistent attribution across shared answers', () => {
  assert.equal(verdict('one-and-done', run(['A', ['A', 'B'], 'B'])), DEAD);
  assert.equal(verdict('one-and-done', run(['A', ['A', 'B'], 'A'])), ALIVE);
  assert.equal(verdict('one-and-done', run(['A', ['A', 'B'], ['A', 'B'], 'A'])), DEAD);
});

test('One And Done still skips missed pages without resetting the last artist', () => {
  assert.equal(verdict('one-and-done', run(['A', null, 'A'])), DEAD);
  assert.equal(verdict('one-and-done', run(['A', null, 'B'])), ALIVE);
});

test('The Last Great counts a shared song toward the previous artist before admitting a new one', () => {
  const pages = run(['A', ['A', 'B'], 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'A', 'A', 'B']);
  assert.equal(verdict('the-last-great', pages), WON);
});

test('The Last Great cannot ignore a shared opening page to admit someone new too early', () => {
  assert.equal(verdict('the-last-great', run([['A', 'B'], 'C'])), DEAD);
  assert.equal(verdict('the-last-great', run([['A', 'B'], 'B', 'C'])), ALIVE);
});

test('The Last Great keeps every viable attribution when later pages resolve a shared song', () => {
  assert.equal(verdict('the-last-great', run([['A', 'B'], 'B', 'C', 'C', 'A'])), ALIVE);
  assert.equal(verdict('the-last-great', run(['A', 'A', 'B', ['A', 'B'], 'C'])), ALIVE);
});

test('Closed Shelf settles a completed run even when every page was missed', () => {
  assert.equal(verdict('closed-shelf', run(Array(12).fill(null))), ALIVE);
  assert.equal(verdict('closed-shelf', run(Array(13).fill(null))), WON);
});
