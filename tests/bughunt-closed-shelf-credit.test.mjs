import test from 'node:test';
import assert from 'node:assert/strict';
import { judge, ALIVE, DEAD, WON } from '../js/lineupgoals.js';
import { byId } from '../js/lineupdeck.js';

test('Closed Shelf can credit a later shared song to an unbanned artist', () => {
  const card = byId['closed-shelf'];
  const first = { artists: ['A'] }, shared = { artists: ['A', 'B'] };
  assert.equal(judge(card, [first, shared], {}), ALIVE);
  assert.equal(judge(card, [first, ...Array(12).fill(shared)], {}), WON);
  assert.equal(judge(card, [first, shared, first], {}), DEAD);
  assert.equal(judge(card, [{ artists: ['A', 'B'] }, first], {}), ALIVE);
});
