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
/* The budget sits just under three average cards, so most deals let you keep three and some make
   you choose. It was 24 against an average card of 8.13 (82% of deals allowed three). Pricing the
   covering cards at least as high as what they cover, and Two Of Us at a Queen once it was guests
   only, lifted the average to about 8.3 and cut that to 70-75%; 25 puts it back at 76-81% on every
   difficulty (measured 2026-11-23, 8,000 deals each). Retune here if a card's price moves. */
export const BUDGET = 25;

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
   "any". Restrictions are measured (scripts/lineup/deal-lab.html and the lab masks),
   never chosen. Normal sits between Easy and Hard: it holds every Hard word and
   commoner ones, so a card that needs guests to turn up can still be dealt there. */
export const POOL_ORDER = ["easy", "normal", "hard", "ultra"];
export const cardPools = c => c.pools || POOL_ORDER;

/* The pool a finished hand can be played at: the hardest one EVERY card allows.
   Returns null when the hand's cards cannot agree on any pool at all, which is a
   conflict in its own right and is checked as one below. */
export function poolForHand(cards) {
  const allowed = POOL_ORDER.filter(p => cards.every(c => cardPools(c).includes(p)));
  return allowed.length ? allowed[allowed.length - 1] : null;
}

/* The arithmetic, once. A hand's artist floors and ceilings either can all be true at the
   same time or they cannot, and saying so is the same job whether you are testing one more
   card onto a table or judging a finished trio.

   `ctx` is the notebook the hand is held on: { shelf, home, admitted }. It is optional (the
   boards and the tests judge hands in the abstract), but the felt always passes it, because
   two of the cards shut catalogues that only the notebook can name: No Home Team shuts hers,
   and Nobody Admitted shuts every guest you have been admitted to, which is a different set on
   every notebook. A hand that needs more artists than it leaves open cannot be won, and that is
   only knowable live. */
export function arithmetic(cards, ctx = {}) {
  const cap = Math.min(...cards.map(c => c.cap || 99));
  const need = Math.max(...cards.map(c => c.need || 0));
  const hog = Math.max(...cards.map(c => c.hog || 0));
  const hogCap = Math.min(...cards.map(c => c.hogCap || 99));
  if (need > cap) return "needs more artists than the hand allows";
  if (need + hog - 1 > PAGES) return "more pages than the run has";
  if (hog > hogCap) return "one artist cannot take that many pages here";
  /* A card with a PACE makes every artist wait for the one before to answer that many pages,
     so any stretch of n pages holds at most ceil(n / pace) of them. A breadth card asking for
     more than that inside its own window (Opening Act's five, No Repeats Yet's eight, the whole
     run for Full Lineup) can never be won beside it. */
  const pace = Math.max(...cards.map(c => c.pace || 1));
  if (pace > 1 && cards.some(c => c.need && Math.ceil((c.within || PAGES) / pace) < c.need)) {
    return "too many artists for that pace";
  }
  if (ctx.shelf) {
    const shut = new Set();
    if (cards.some(c => c.shuts === "home")) shut.add(ctx.home);
    if (cards.some(c => c.shuts === "admitted")) for (const a of ctx.admitted || []) shut.add(a);
    const open = ctx.shelf.filter(a => !shut.has(a));
    const names = Math.max(...cards.map(c => c.names || 0));
    if (!open.length) return "nobody left to answer with";
    if (need > open.length || names > open.length) return "too few artists left open";
    // The guests-only cards draw on the guests the hand leaves open, never on her.
    const guests = open.filter(a => a !== ctx.home).length;
    if (cards.some(c => c.guests && (c.names || 1) > guests)) return "too few guests left open";
    if (cards.some(c => c.away) && !open.some(a => a !== ctx.home)) return "nobody left but Taylor";
  }
  if (!poolForHand(cards)) return "no pool allows both";
  return "";
}

/* One card already asking everything another does, in either direction. Holding both is not
   impossible, it is paying twice for one promise, which a player only finds out by reading two
   card faces side by side; the felt refuses the pair instead. Returns the reason or "". */
function coverage(card, laid) {
  if ((laid.covers || []).includes(card.id)) return "covered by " + laid.name;
  if ((card.covers || []).includes(laid.id)) return "already asks " + laid.name;
  return "";
}

/* Judge a finished hand rather than one more card onto a table. Used to ask the
   question a dealt hand has to survive: does a legal trio exist in these five at all? */
export function validateHand(ids, byId, opts = {}) {
  /* BUDGET_OVERRIDE exists for the calibration sweep on hand-lab.html, which has to ask
     what a different budget would do without editing the constant everything else reads. */
  const { budgetOn = true, BUDGET_OVERRIDE = BUDGET, ctx = {} } = opts;
  const cards = ids.map(id => byId[id]);
  for (const a of cards) for (const b of cards) {
    if (a === b) continue;
    if ((a.bans || []).includes(b.id)) return { ok: false, why: a.name + " bans " + b.name };
    const twice = coverage(a, b);
    if (twice) return { ok: false, why: twice };
  }
  const why = arithmetic(cards, ctx);
  if (why) return { ok: false, why };
  const cost = handCost(ids, byId);
  if (budgetOn && cost > BUDGET_OVERRIDE) return { ok: false, why: "over budget", cost };
  return { ok: true, cost, pool: poolForHand(cards) };
}

/* A card is out if something on the table bans it, if one of the two already asks everything
   the other does, if the artist ceilings and floors cannot all be true at once, if it would
   blow the budget, or if there is no pool left that every card permits. The arithmetic checks
   are the ones a ban list alone would miss: Three Chairs and Headliners never name each other,
   they simply cannot both be satisfied, and deriving that keeps it true the day another
   catalogue lands. */
export function conflicts(card, hand, byId, opts = {}) {
  const { budgetOn = true, maxHand = 3, ctx = {} } = opts;
  if (hand.includes(card.id)) return "";
  for (const id of hand) {
    const laid = byId[id];
    if ((laid.bans || []).includes(card.id)) return "against " + laid.name;
    if ((card.bans || []).includes(id)) return "against " + laid.name;
    const twice = coverage(card, laid);
    if (twice) return twice;
  }
  const why = arithmetic(hand.map(id => byId[id]).concat(card), ctx);
  if (why) return why;
  if (budgetOn && hand.length < maxHand) {
    if (handCost(hand, byId) + pips(card.rank) > BUDGET) return "over budget";
  }
  if (hand.length >= maxHand) return "table is full";
  return "";
}

/* Whether a card is a GOAL at all at this difficulty and on this notebook. A card the run
   makes true by itself is a free board tick dressed as a promise, so it is never dealt there.
   `mode` is a MODES entry; `ctx` the same notebook context as above. Read off the mode's own
   levers rather than a list of difficulty ids, so a mode retuned tomorrow is judged as it is. */
export function dealable(card, mode = {}, ctx = {}) {
  switch (card.needs) {
    case "hints": return !!mode.hint;                                   // No Hints: only where there is a ladder
    case "suggestions": return !!mode.dropdown && !mode.lyricOnly;      // Cold Open: only where the list would open
    case "titles": return !mode.lyricOnly;                              // Sing It Back: not where every answer is sung
    case "clock": return !mode.seconds || mode.seconds > (card.inside || 0);  // Off The Cuff: not on its own clock or less
    case "admissions": return (ctx.admitted || []).length > 0;          // Nobody Admitted: only once it shuts somebody
    default: return true;
  }
}
