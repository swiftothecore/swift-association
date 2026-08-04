// The randomiser's draw: pure, state-free weighting over a pool someone else assembled.
//
// This module deliberately knows nothing about how a run starts, what is unlocked, or what a
// guest catalogue is. It is handed a flat list of plain entries and a ledger of which tokens
// have been seen, and it returns one entry. Everything that needs live game state — the unlock
// predicates, the rosters, whether today's daily is spent — lives in app.js, which builds the
// pool and dispatches the winner. Keeping the split here is what makes the weighting testable
// from the dev console without starting a game.
//
// Pool entry shape: { cat, token, label, ...payload }
//   cat     — a RANDOM_CATEGORIES id; entries with an unknown cat are ignored
//   token   — the RANDOM_KEY ledger token deciding whether this counts as already played.
//             NOT unique per entry: every difficulty of one album shares "album:midnights",
//             which is exactly the point (see RANDOM_CATEGORIES' note on granularity).
//   label   — how the draw describes itself to the player
//   payload — whatever app.js needs to start it (mode, album, id, variant, dark…)

import { RANDOM_CATEGORIES, RANDOM_UNPLAYED_WEIGHT } from "./config.js";

const CAT_WEIGHT = new Map(RANDOM_CATEGORIES.map((c) => [c.id, c.weight]));

// Weigh every entry in the pool. Returns [{ entry, weight }] plus the running total, so the
// draw and the dev-tools report read the same numbers rather than computing them twice.
//
// An entry's weight is its category's share divided between that category's entries, times the
// unplayed multiplier. Dividing by the category size first is what stops 32 challenges from
// outvoting one Adaptive; multiplying after is what makes a barely-touched shelf swell against
// an exhausted one, because a category's total is the sum of its entries'.
export function weighPool(pool, seen = {}, unplayedWeight = RANDOM_UNPLAYED_WEIGHT) {
  const sized = new Map();
  for (const e of pool) {
    if (!e || !CAT_WEIGHT.has(e.cat)) continue;
    sized.set(e.cat, (sized.get(e.cat) || 0) + 1);
  }
  const weighted = [];
  let total = 0;
  for (const entry of pool) {
    if (!entry || !CAT_WEIGHT.has(entry.cat)) continue;
    const base = CAT_WEIGHT.get(entry.cat) / sized.get(entry.cat);
    const weight = base * (seen[entry.token] ? 1 : unplayedWeight);
    weighted.push({ entry, weight });
    total += weight;
  }
  return { weighted, total };
}

// Draw one entry. `rng` is injectable so the dev tools can roll a reproducible sequence and so
// the distribution can be sampled without touching Math.random's real stream.
// Returns null for an empty pool, which is a real state on a fresh notebook that has somehow
// locked itself out of everything, and must not throw.
export function drawRandom(pool, seen = {}, rng = Math.random, unplayedWeight = RANDOM_UNPLAYED_WEIGHT) {
  const { weighted, total } = weighPool(pool, seen, unplayedWeight);
  if (!weighted.length || total <= 0) return null;
  let roll = rng() * total;
  for (const w of weighted) {
    roll -= w.weight;
    if (roll <= 0) return w.entry;
  }
  // Floating-point shortfall only — the loop above consumes the whole total in exact maths.
  return weighted[weighted.length - 1].entry;
}

// Per-category breakdown for the dev tools: how big each shelf is, how much of it is still
// unplayed, and what share of the draw it actually commands once the lean is applied. The
// share is the number worth reading — the configured weight is only its starting point.
export function poolSummary(pool, seen = {}, unplayedWeight = RANDOM_UNPLAYED_WEIGHT) {
  const { weighted, total } = weighPool(pool, seen, unplayedWeight);
  const rows = new Map();
  for (const w of weighted) {
    const row = rows.get(w.entry.cat) || { cat: w.entry.cat, entries: 0, unplayed: 0, weight: 0 };
    row.entries += 1;
    if (!seen[w.entry.token]) row.unplayed += 1;
    row.weight += w.weight;
    rows.set(w.entry.cat, row);
  }
  const out = [];
  for (const c of RANDOM_CATEGORIES) {
    const row = rows.get(c.id);
    if (!row) { out.push({ cat: c.id, entries: 0, unplayed: 0, share: "0.0%" }); continue; }
    out.push({
      cat: row.cat,
      entries: row.entries,
      unplayed: row.unplayed,
      share: (total > 0 ? (row.weight / total) * 100 : 0).toFixed(1) + "%",
    });
  }
  return { total: weighted.length, categories: out };
}
