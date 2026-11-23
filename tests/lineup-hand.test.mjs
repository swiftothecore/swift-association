import test from 'node:test';
import assert from 'node:assert/strict';
import { DECK, byId } from '../js/lineupdeck.js';
import { validateHand, conflicts, dealable, pips } from '../js/lineuphand.js';
import { MODES, GUESTS, HOME_ARTIST } from '../js/config.js';

const shelf = [HOME_ARTIST, ...GUESTS.map(g => g.name)];
const guests = shelf.slice(1);
const notebook = (admitted = []) => ({ shelf, home: HOME_ARTIST, admitted });
const ok = (ids, ctx = notebook()) => validateHand(ids, byId, { budgetOn: false, ctx }).ok;

test('The Last Great refuses every breadth card its pace cannot reach', () => {
  for (const id of ['one-and-done', 'opening-act', 'no-repeats-yet', 'round-the-table', 'full-lineup']) {
    assert.equal(ok(['the-last-great', id]), false, id);
  }
  // Six artists across thirteen pages is inside ceil(13 / 2).
  assert.equal(ok(['the-last-great', 'headliners']), true);
});

test('a hand that shuts every catalogue it needs is refused on the notebook that shuts them', () => {
  assert.equal(ok(['nobody-admitted', 'no-home-team']), true);
  assert.equal(ok(['nobody-admitted', 'no-home-team'], notebook(guests)), false);
  assert.equal(ok(['nobody-admitted', 'undercard'], notebook(guests)), false);
  assert.equal(ok(['nobody-admitted', 'full-lineup'], notebook([guests[0]])), false);
  // Three Chairs names three GUESTS, so Taylor being open does not rescue it.
  assert.equal(ok(['nobody-admitted', 'three-chairs'], notebook(guests.slice(0, 5))), false);
  assert.equal(ok(['nobody-admitted', 'three-chairs'], notebook(guests.slice(0, 4))), true);
  assert.equal(ok(['nobody-admitted', 'sworn-in'], notebook(guests)), false);
  // Without a notebook the hand is judged in the abstract, as the boards do.
  assert.equal(validateHand(['nobody-admitted', 'no-home-team'], byId, { budgetOn: false }).ok, true);
});

test('a card that already asks everything another does is never held beside it', () => {
  for (const [a, b] of [['off-the-cuff', 'clean-sheet'], ['homecoming', 'ten-in-a-row'],
    ['round-the-table', 'full-lineup'], ['no-home-team', 'undercard'], ['no-repeats-yet', 'opening-act']]) {
    assert.equal(ok([a, b]), false, `${a} + ${b}`);
    assert.match(conflicts(byId[b], [a], byId, { budgetOn: false }), /^covered by /);
    assert.match(conflicts(byId[a], [b], byId, { budgetOn: false }), /^already asks /);
  }
});

test('a card never costs less than a card it covers', () => {
  for (const card of DECK) {
    for (const id of card.covers || []) {
      assert.ok(byId[id], `${card.id} covers unknown ${id}`);
      assert.ok(pips(card.rank) >= pips(byId[id].rank), `${card.id} (${card.rank}) covers ${id} (${byId[id].rank})`);
    }
  }
});

test('a card a difficulty makes true by itself is never dealt there', () => {
  const dealtOn = (id, ctx) => Object.values(MODES).filter(m => dealable(byId[id], m, ctx)).map(m => m.id).sort();
  assert.deepEqual(dealtOn('no-hints'), ['relaxed']);
  assert.ok(!dealtOn('cold-open').includes('ultra') && !dealtOn('cold-open').includes('lyricist'));
  assert.ok(dealtOn('cold-open').includes('hard'));
  assert.ok(!dealtOn('sing-it-back').includes('lyricist'));
  for (const id of dealtOn('off-the-cuff')) {
    assert.ok(!MODES[id].seconds || MODES[id].seconds > 10, id);
  }
  assert.ok(!dealtOn('off-the-cuff').includes('medium'));
  assert.deepEqual(dealtOn('nobody-admitted', notebook()), []);
  assert.ok(dealtOn('nobody-admitted', notebook([guests[0]])).includes('medium'));
  assert.ok(dealable(byId['headliners'], MODES.ultra), 'a card with no needs is dealt anywhere');
});
