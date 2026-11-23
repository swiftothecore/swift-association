import test from 'node:test';
import assert from 'node:assert/strict';
import { DECK, byId } from '../js/lineupdeck.js';
import { judge, deathNote, deathPage, goalNote, FLOOR, ALIVE, WON, DEAD } from '../js/lineupgoals.js';

const T = 'Taylor Swift';
const shelf = [T, 'Ariana Grande', 'Wicked', 'Billie Eilish', 'Harry Styles', 'Olivia Rodrigo', 'Hannah Montana', 'Sabrina Carpenter'];
const [, A, W, B, H, O, M, S] = shelf;
const ctx = { pages: 13, shelf, home: T, named: [], admitted: [] };
const page = (a, extra = {}) => ({
  artists: a === null ? [] : Array.isArray(a) ? a : [a], ms: 1000, dropdown: false, sung: false, hinted: false, ...extra,
});
const run = (list) => list.map((a) => page(a));
const verdict = (id, pages, extra = {}) => judge(byId[id], pages, { ...ctx, ...extra });

test('a run that lands nothing holds no card at all', () => {
  const blank = run(Array(13).fill(null));
  for (const card of DECK) {
    assert.equal(judge(card, blank, { ...ctx, named: [A, W, B], admitted: [H] }), DEAD, card.id);
  }
});

test('the floor strikes a card the moment eight landed pages are out of reach', () => {
  assert.equal(FLOOR, 8);
  const five = run([A, A, null, null, null, null, null, null]);   // 2 landed, 5 pages left
  assert.equal(verdict('one-and-done', run([A, null, B, null, A, null])), ALIVE);
  assert.equal(verdict('no-home-team', five), DEAD);
  assert.equal(deathNote(byId['no-home-team'], five, ctx), 'too few pages left to land 8');
  assert.equal(deathPage(byId['no-home-team'], five, ctx), 8);
});

test('a count-up card skips a missed page instead of failing on it', () => {
  assert.equal(verdict('undercard', run([...Array(12).fill(A), null])), WON);
  assert.equal(verdict('headliners', run([T, A, W, B, H, O, null, T, T, T, T, T, T])), WON);
  assert.equal(verdict('sworn-in', run([W, null, W, W, W, W, W, W, T, T, T, T, T]), { named: [W] }), WON);
});

test('a streak breaks on a missed page rather than skipping it', () => {
  assert.equal(verdict('long-story-short', run([A, A, null, A, A, A, ...Array(7).fill(T)])), WON);  // Taylor's seven
  assert.equal(verdict('long-story-short', run([A, A, null, A, A, A, B, W, B, W, B, W, B])), DEAD);
  assert.equal(verdict('ten-in-a-row', run([...Array(5).fill(A), null, ...Array(5).fill(A), A, A])), DEAD);
});

test('Back To December only cares about the first and last pages', () => {
  assert.equal(verdict('back-to-december', run([A, null, T, T, T, T, T, T, T, T, T, T, A])), WON);
  assert.equal(verdict('back-to-december', run([null, A, T, T, T, T, T, T, T, T, T, T, A])), DEAD);
  assert.equal(verdict('back-to-december', run([A, T, T, T, T, T, T, T, T, T, T, T, null])), DEAD);
  assert.equal(deathNote(byId['back-to-december'], run([null]), ctx), 'a missed first page');
});

test('Round The Table fails on a miss only before everybody has answered', () => {
  assert.equal(verdict('round-the-table', run([T, A, null])), DEAD);
  assert.equal(verdict('round-the-table', run([T, A, W, B, H, O, M, S, null, null, T, T, T])), WON);
  assert.equal(deathNote(byId['round-the-table'], run([T, A, T]), ctx), 'a second page before everyone had one');
});

test('Two Of Us holds every page you answer to two guests, and skips the rest', () => {
  assert.equal(verdict('two-of-us', run([W, A, null, W, A, W, A, W, A, W, null, W, A])), WON);
  assert.equal(verdict('two-of-us', run([W, A, B])), DEAD);
  assert.equal(deathNote(byId['two-of-us'], run([W, A, B]), ctx), 'a third artist');
});

test('the devotion cards never count her', () => {
  // She turns up on nearly every page, so a card she could answer was won before page one.
  assert.equal(verdict('two-of-us', run([T, A])), DEAD);
  assert.equal(deathNote(byId['two-of-us'], run([T]), ctx), 'a Taylor page');
  assert.equal(verdict('homecoming', run([...Array(7).fill(T), ...Array(6).fill(A)])), DEAD);
  assert.equal(verdict('homecoming', run([...Array(7).fill(W), ...Array(6).fill(T)])), WON);
  assert.equal(goalNote(byId['homecoming'], run([T, T, T, W]), ctx), 'Wicked 1 of 7');
  for (const id of ['sworn-in', 'homecoming', 'three-chairs', 'two-of-us']) {
    assert.equal(byId[id].guests, true, id);
    assert.deepEqual(byId[id].pools, ['easy', 'normal'], id);
  }
});

test('Off The Cuff reads its own seconds', () => {
  const slow = [...run(Array(12).fill(A)), page(A, { ms: 10001 })];
  assert.equal(verdict('off-the-cuff', slow), DEAD);
  assert.equal(deathNote(byId['off-the-cuff'], slow, ctx), 'a page over ten seconds');
});

test('a struck card says why, in words that follow its name', () => {
  assert.equal(deathNote(byId['headliners'], run([A, A, A, A, A, A, A, A, A, null, null, null]), ctx), 'too few pages left for six');
  assert.equal(deathNote(byId['quiet-half'], run([A, A, null, null, null, null, null, null]), ctx), 'too few pages left to land 8');
  assert.equal(deathNote(byId['closed-shelf'], run([A, W, A]), ctx), 'Ariana again');
  assert.equal(deathNote(byId['no-home-team'], run([A, T]), ctx), 'a Taylor song');
  assert.equal(deathNote(byId['clean-sheet'], run([A, null]), ctx), 'a missed page');
  assert.equal(deathNote(byId['headliners'], run([A]), ctx), '');
});

test('a live card tells the strip what the player would otherwise have to remember', () => {
  assert.equal(goalNote(byId['closed-shelf'], run([T, A]), ctx), 'Taylor shut');
  assert.equal(goalNote(byId['closed-shelf'], run([null]), ctx), '');
  assert.equal(goalNote(byId['back-to-december'], run([A, T]), ctx), 'opened on Ariana');
  assert.equal(goalNote(byId['undercard'], run([A, T, W, null]), ctx), '2 of 8');
  assert.equal(goalNote(byId['quiet-half'], run(Array(6).fill(T)), ctx), 'Taylor shut');
  assert.equal(goalNote(byId['one-and-done'], run([T, A]), ctx), 'not Ariana next');
  assert.equal(goalNote(byId['sworn-in'], run([W, T, W]), { ...ctx, named: [W] }), 'Wicked 2 of 7');
  assert.equal(goalNote(byId['three-chairs'], run([]), { ...ctx, named: [W, H, M] }), 'Wicked, Harry, Hannah');
});
