import test from 'node:test';
import assert from 'node:assert/strict';
import { BENCH, DECK, SUITS, SHELF, byId } from '../js/lineupdeck.js';
import { GUESTS } from '../js/config.js';
import { PAGES, validateHand } from '../js/lineuphand.js';

test('each goal has a stable unique lookup and benched goals stay out of the playable deck', () => {
  const cards = [...DECK, ...BENCH];
  assert.equal(new Set(cards.map(card => card.id)).size, cards.length);
  for (const card of cards) {
    assert.match(card.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.equal(byId[card.id], card, card.id);
    assert.ok(Object.hasOwn(SUITS, card.suit), card.id);
  }
  for (const card of BENCH) {
    assert.ok(card.why?.trim(), card.id);
    assert.ok(DECK.every(playable => playable.id !== card.id), card.id);
  }
});

test('the two every-artist goals scale with the playable shelf and fit only the easy pool', () => {
  assert.equal(SHELF, GUESTS.length + 1);
  for (const id of ['full-lineup', 'round-the-table']) {
    assert.equal(byId[id].need, SHELF, id);
    assert.deepEqual(byId[id].pools, ['easy'], id);
  }
  assert.equal(byId['round-the-table'].hogCap, PAGES - SHELF + 1);
});

test('the two goals that ask players to name artists carry their respective pick counts', () => {
  const namedGoals = DECK.filter(card => card.names);
  assert.deepEqual(new Map(namedGoals.map(card => [card.id, card.names])), new Map([
    ['three-chairs', 3], ['sworn-in', 1],
  ]));
  assert.equal(byId['three-chairs'].cap, 3);
  assert.equal(byId['sworn-in'].need, 1);
});

test('Cold Open shuts suggestions while lockouts and No Hints stay promises', () => {
  assert.deepEqual(byId['cold-open'].lever, { dropdown: false });
  for (const card of DECK.filter(card => card.suit === 'spades' || card.id === 'no-hints')) {
    assert.equal(card.lever, undefined, card.id);
  }
});

test('the playable lockouts declare how a missed page is treated', () => {
  for (const card of DECK.filter(card => card.suit === 'spades')) {
    assert.ok(['fails', 'skipped'].includes(card.miss), card.id);
  }
  assert.equal(byId['three-chairs'].miss, 'fails');
  assert.equal(byId['closed-shelf'].miss, 'skipped');
});

test('the deck prevents contradictory goals, whether by a ban or by available pages', () => {
  for (const hand of [
    ['no-home-team', 'full-lineup'],
    ['one-and-done', 'long-story-short'],
    ['three-chairs', 'headliners'],
    ['no-repeats-yet', 'homecoming'],
  ]) {
    assert.equal(validateHand(hand, byId, { budgetOn: false }).ok, false, hand.join(', '));
  }
  const compatible = validateHand(['three-chairs', 'sworn-in'], byId, { budgetOn: false });
  assert.equal(compatible.ok, true);
});
