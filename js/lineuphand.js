"use strict";
/* ============================================================
   The lineup's HAND rules, in one copy.

   js/lineupdeck.js holds what each card SAYS. This file holds what
   a hand of them MEANS: what a card costs, what cannot sit beside
   what, and which rarity pool a finished hand can be played at.
   Every board and, when it exists, the mode itself import it, so
   the rule cannot drift between the place you design a card and
   the place you play one.

   Pure and state-free: a hand is always passed in.

   Everything here is pure. No module state: a hand is passed in.
   ============================================================ */

export const PAGES = 13;
export const BUDGET = 24;

/* Rank IS the price, and the unit is the card's own pips — the six diamonds printed on a
   six of diamonds are its six pips, so a number card costs its face value and the court
   cards are priced above by hand. A hand gets BUDGET of them. The surfaces say "spent"
   rather than "pips laid down", because the second needs explaining and the first does not. */
export const PIPS = { A: 11, K: 10, Q: 9, J: 8 };
export const pips = r => PIPS[r] || Number(r);
export const handCost = (hand, byId) => hand.reduce((n, id) => n + pips(byId[id].rank), 0);
/* Court or number. A printed deck dresses these differently; this one does not — the suit
   carries the art — but the split is still the half the pip prices hinge on. */
export const isCourt = (rank) => "AKQJ".includes(rank);

/* The pools a card may be dealt into, in difficulty order. Absent on a card means
   "any" — only the breadth cards carry a restriction, and theirs are measured by
   scripts/lineup/deal-lab.html rather than chosen. */
export const POOL_ORDER = ["easy", "hard", "ultra"];
export const cardPools = c => c.pools || POOL_ORDER;

/* The pool a finished hand can be played at: the hardest one EVERY card allows.
   Returns null when the hand's cards cannot agree on any pool at all, which is a
   conflict in its own right and is checked as one below. */
export function poolForHand(cards) {
  const allowed = POOL_ORDER.filter(p => cards.every(c => cardPools(c).includes(p)));
  return allowed.length ? allowed[allowed.length - 1] : null;
}

/* The arithmetic, once. A hand's artist floors and ceilings either can all be true at
   the same time or they cannot, and saying so is the same job whether you are testing
   one more card onto a table or judging a finished trio. */
export function arithmetic(cards) {
  const cap = Math.min(...cards.map(c => c.cap || 99));
  const need = Math.max(...cards.map(c => c.need || 0));
  const hog = Math.max(...cards.map(c => c.hog || 0));
  const hogCap = Math.min(...cards.map(c => c.hogCap || 99));
  if (need > cap) return "needs more artists than the hand allows";
  if (need + hog - 1 > PAGES) return "more pages than the run has";
  if (hog > hogCap) return "one artist cannot take that many pages here";
  if (!poolForHand(cards)) return "no pool allows both";
  return "";
}

/* Judge a finished hand rather than one more card onto a table. Used to ask the
   question a dealt hand has to survive: does a legal trio exist in these five at all? */
export function validateHand(ids, byId, opts = {}) {
  /* BUDGET_OVERRIDE exists for the calibration sweep on hand-lab.html, which has to ask
     what a different budget would do without editing the constant everything else reads. */
  const { budgetOn = true, BUDGET_OVERRIDE = BUDGET } = opts;
  const cards = ids.map(id => byId[id]);
  for (const a of cards) for (const b of cards) {
    if (a === b) continue;
    if ((a.bans || []).includes(b.id)) return { ok: false, why: a.name + " bans " + b.name };
  }
  const why = arithmetic(cards);
  if (why) return { ok: false, why };
  const cost = handCost(ids, byId);
  if (budgetOn && cost > BUDGET_OVERRIDE) return { ok: false, why: "over budget", cost };
  return { ok: true, cost, pool: poolForHand(cards) };
}

/* A card is out if something on the table bans it, if the artist ceilings and floors
   cannot all be true at once, if it would blow the budget, or if there is no pool left
   that every card permits. The arithmetic checks are the ones a ban list alone would
   miss: Three Chairs and Headliners never name each other, they simply cannot both be
   satisfied, and deriving that keeps it true the day an eleventh catalogue lands. */
export function conflicts(card, hand, byId, opts = {}) {
  const { budgetOn = true, maxHand = 3 } = opts;
  if (hand.includes(card.id)) return "";
  for (const id of hand) {
    const laid = byId[id];
    if ((laid.bans || []).includes(card.id)) return "against " + laid.name;
    if ((card.bans || []).includes(id)) return "against " + laid.name;
  }
  const why = arithmetic(hand.map(id => byId[id]).concat(card));
  if (why) return why;
  if (budgetOn && hand.length < maxHand) {
    if (handCost(hand, byId) + pips(card.rank) > BUDGET) return "over budget";
  }
  if (hand.length >= maxHand) return "table is full";
  return "";
}
