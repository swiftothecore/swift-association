import test from 'node:test';
import assert from 'node:assert/strict';
import { judge, ALIVE, DEAD, WON } from '../js/lineupgoals.js';
import { byId } from '../js/lineupdeck.js';

test('Closed Shelf kills the card on any later page carrying the banned artist', () => {
  const card = byId['closed-shelf'];
  const first = { artists: ['A'] }, other = { artists: ['B'] }, shared = { artists: ['A', 'B'] };
  assert.equal(judge(card, [first, other], {}), ALIVE);
  assert.equal(judge(card, [first, ...Array(12).fill(other)], {}), WON);
  assert.equal(judge(card, [first, shared], {}), DEAD);
  assert.equal(judge(card, [first, other, first], {}), DEAD);
  // A shared page one bans nobody, so anything can follow it.
  assert.equal(judge(card, [shared, first], {}), ALIVE);
});
