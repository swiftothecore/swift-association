"use strict";
/* ============================================================
   The lineup's goal cards, judged. Pure and state-free, in the
   manner of js/bonus.js and js/rulemarks.js: nothing here reads
   game state, every answer is a function of the run handed in.

   A RUN is an array of pages, one per page PLAYED so far, so the
   same call answers "is this card still alive" mid-run and "was
   it won" at the end. A page is:

     { artists: string[],   // who answered it. EMPTY means the page
                            // was not answered at all. Two names when
                            // the song sits on two shelves — the blend
                            // credits both, so either can satisfy a card.
       ms, dropdown, sung, hinted }   // how it was answered (clubs read these)

   Every card returns ALIVE, WON or DEAD. DEAD matters as much as
   WON: a card that can no longer be satisfied must be struck on
   the board the moment it dies, because failing silently is the
   worst version of failing.
   ============================================================ */

export const ALIVE = "alive", WON = "won", DEAD = "dead";

const answeredPages = (pages) => pages.filter((p) => p.artists && p.artists.length);
const isMiss = (p) => !p.artists || !p.artists.length;

/* How many DIFFERENT artists a set of pages can be credited to. Not a count of
   names: a page answered with a song that sits on two shelves can be credited to
   either, so the largest set of pages each attributable to a different artist is a
   bipartite matching. Kuhn's algorithm, tiny inputs. */
export function distinctArtists(pages, shelf) {
  const owner = new Map();
  let n = 0;
  const aug = (i, seen) => {
    for (const a of pages[i].artists) {
      if (!shelf.includes(a) || seen.has(a)) continue;
      seen.add(a);
      if (!owner.has(a) || aug(owner.get(a), seen)) { owner.set(a, i); return true; }
    }
    return false;
  };
  for (let i = 0; i < pages.length; i++) if (aug(i, new Set())) n++;
  return n;
}

/* The most pages any ONE artist could have answered. */
function biggestShare(pages, shelf) {
  let best = 0;
  for (const a of shelf) best = Math.max(best, pages.filter((p) => p.artists.includes(a)).length);
  return best;
}
/* The longest run of consecutive answered pages a single artist could hold. */
function longestStreak(pages, shelf) {
  let best = 0;
  for (const a of shelf) {
    let run = 0;
    for (const p of pages) { run = p.artists.includes(a) ? run + 1 : 0; best = Math.max(best, run); }
  }
  return best;
}
/* Two different shapes of failure, and conflating them was the first bug in this file.
   KEEP is for a promise you can BREAK — a ban, or an "every page…" rule. Once broken it is
   broken forever, so it must die the moment it is, not wait politely for page thirteen.
   SETTLE is for a total you are still ACCUMULATING; falling short only becomes failure when
   the pages run out, and its early death is a separate arithmetic check (see `doomed`). */
const keep = (done, ok) => (ok ? (done ? WON : ALIVE) : DEAD);
const settle = (done, ok) => (ok ? (done ? WON : ALIVE) : done ? DEAD : ALIVE);
/* A card chasing a total is dead early if the pages left cannot carry it there. Being able
   to say so is the whole point of DEAD: a card that has died must be struck on the board. */
const doomed = (c, have, want) => have + (c.pages - c.played) < want;

/* ============================================================
   THE RULES. One per card id, each (pages, ctx) -> state, where
   ctx is { pages: 13, shelf: [names], home, named: [], admitted: [] }.
   `pages` here has already had the card's missed-page ruling applied
   by judge() below, so a "skipped" card never sees an unanswered page
   and a "fails" card is already dead before it gets here.
   ============================================================ */
const RULES = {
  /* ---- SPADES: lockouts ---- */
  "no-home-team": (ps, c, done) => keep(done, ps.every((p) => !p.artists.includes(c.home))),
  "three-chairs": (ps, c, done) => {
    const named = new Set(c.named || []);
    if (named.size !== 3) return DEAD;                       // the three are picked before page one
    return keep(done, ps.every((p) => p.artists.some((a) => named.has(a))));
  },
  "quiet-half": (ps, c, done) => {
    let used = 0;
    for (const p of ps) {
      // A page that COULD be credited to someone else is; only a page that can only be
      // Taylor spends one of her six, which is the reading that never punishes a shared song.
      if (p.artists.every((a) => a === c.home)) used++;
      if (used > 6) return DEAD;
    }
    return keep(done, true);
  },
  "closed-shelf": (ps, c, done) => {
    if (!ps.length) return ALIVE;
    // Banned is whoever answers page one — the artist you ANSWER with, never the artist of a
    // page you missed, so tanking page one cannot dodge the ban.
    const first = ps[0].artists;
    if (first.length > 1) return keep(done, true);            // a shared song bans nobody outright
    return keep(done, ps.slice(1).every((p) => !p.artists.includes(first[0])));
  },
  "nobody-admitted": (ps, c, done) => {
    const shut = new Set(c.admitted || []);
    return keep(done, ps.every((p) => p.artists.some((a) => !shut.has(a))));
  },
  "one-and-done": (ps, c, done) => {
    for (let i = 1; i < ps.length; i++) {
      const prev = ps[i - 1].artists, here = ps[i].artists;
      // Only a forced repeat breaks it: if either page could be credited elsewhere, it was.
      if (prev.length === 1 && here.length === 1 && prev[0] === here[0]) return DEAD;
    }
    return keep(done, true);
  },

  /* ---- HEARTS: devotion ---- */
  "sworn-in": (ps, c, done) => {
    const who = (c.named || [])[0];
    if (!who) return DEAD;
    const got = ps.filter((p) => p.artists.includes(who)).length;
    if (got >= 7) return WON;                                 // reachable early, so say so early
    return doomed(c, got, 7) ? DEAD : settle(done, false);
  },
  "homecoming": (ps, c, done) => {
    const share = biggestShare(ps, c.shelf);
    if (share >= 7) return WON;
    return doomed(c, share, 7) ? DEAD : settle(done, false);
  },
  "long-story-short": (ps, c, done) =>
    longestStreak(ps, c.shelf) >= 5 ? WON : doomed(c, 0, 5) ? DEAD : settle(done, false),
  "two-of-us": (ps, c, done) => {
    // Every page on one of two artists. Try each pair the run could support.
    for (const a of c.shelf) for (const b of c.shelf) {
      if (a === b) continue;
      if (ps.every((p) => p.artists.includes(a) || p.artists.includes(b))) return keep(done, true);
    }
    return DEAD;
  },
  "back-to-december": (ps, c, done) => {
    if (!done) return ALIVE;                                  // only the last page can settle it
    if (ps.length < 2) return DEAD;
    const open = ps[0].artists, close = ps[ps.length - 1].artists;
    return open.some((a) => close.includes(a)) ? WON : DEAD;
  },
  "the-last-great": (ps, c, done) => {
    // Never answer with a NEW artist until the one before has been used twice.
    const seen = new Map();
    let prev = null;
    for (const p of ps) {
      const a = p.artists.length === 1 ? p.artists[0] : null;
      if (!a) { prev = prev; continue; }                      // a shared song is never the new face
      const known = seen.has(a);
      if (!known && prev && (seen.get(prev) || 0) < 2) return DEAD;
      seen.set(a, (seen.get(a) || 0) + 1);
      prev = a;
    }
    return keep(done, true);
  },

  /* ---- DIAMONDS: spread ---- */
  "full-lineup": (ps, c, done) => {
    const got = distinctArtists(ps, c.shelf);
    if (got >= c.shelf.length) return WON;
    return doomed(c, got, c.shelf.length) ? DEAD : settle(done, false);
  },
  "round-the-table": (ps, c, done) => {
    // Nobody twice until everybody once: the first `shelf` pages must all be different.
    const head = ps.slice(0, c.shelf.length);
    if (head.length === c.shelf.length && distinctArtists(head, c.shelf) < c.shelf.length) return DEAD;
    return settle(done, distinctArtists(ps.slice(0, c.shelf.length), c.shelf) >= c.shelf.length);
  },
  "undercard": (ps, c, done) => {
    const away = ps.filter((p) => p.artists.some((a) => a !== c.home)).length;
    if (away >= 8) return WON;
    return doomed(c, away, 8) ? DEAD : settle(done, false);
  },
  "no-repeats-yet": (ps, c, done) => {
    const head = ps.slice(0, 8);
    if (head.length === 8 && distinctArtists(head, c.shelf) < 8) return DEAD;
    return settle(done, head.length === 8 && distinctArtists(head, c.shelf) >= 8);
  },
  "headliners": (ps, c, done) => {
    const got = distinctArtists(ps, c.shelf);
    return got >= 6 ? WON : doomed(c, got, 6) ? DEAD : settle(done, false);
  },
  "opening-act": (ps, c, done) => {
    const head = ps.slice(0, 5);
    if (head.length === 5 && distinctArtists(head, c.shelf) < 4) return DEAD;
    return head.length === 5 && distinctArtists(head, c.shelf) >= 4 ? WON : settle(done, false);
  },

  /* ---- CLUBS: form. These read HOW a page was answered, not who by. ---- */
  // thirteen from thirteen: not "thirteen pages happened", which is what this used to check
  "clean-sheet": (ps, c, done) => keep(done, !ps.some(isMiss)),
  "off-the-cuff": (ps, c, done) => keep(done, ps.every((p) => p.ms <= 10000)),
  "cold-open": (ps, c, done) => keep(done, ps.every((p) => !p.dropdown)),
  "sing-it-back": (ps, c, done) => {
    const got = ps.filter((p) => p.sung).length;
    return got >= 5 ? WON : doomed(c, got, 5) ? DEAD : settle(done, false);
  },
  "no-hints": (ps, c, done) => keep(done, ps.every((p) => !p.hinted)),
  "ten-in-a-row": (ps, c, done) => {
    let run = 0, best = 0;
    for (const p of ps) { run = isMiss(p) ? 0 : run + 1; best = Math.max(best, run); }
    if (best >= 10) return WON;
    return doomed(c, run, 10) ? DEAD : settle(done, false);
  },
};

export const hasRule = (id) => Object.prototype.hasOwnProperty.call(RULES, id);

/* Judge one card against the run so far.

   The missed-page ruling is applied HERE rather than in each rule, because it is the same
   decision every time and PLAN.md requires every card to print one: a card that FAILS on a
   miss is dead the moment a page goes unanswered, and a card that SKIPS one simply never
   sees it. Cards with no ruling at all are the clubs, which judge how a page was answered
   and so read the unanswered ones too. */
export function judge(card, pages, ctx) {
  const rule = RULES[card.id];
  if (!rule) throw new Error("no lineup rule for card " + card.id);
  const c = { pages: 13, shelf: [], home: "", named: [], admitted: [], ...ctx, played: pages.length };
  const done = pages.length >= c.pages;
  if (card.miss === "fails" && pages.some(isMiss)) return DEAD;
  // Clean Sheet and Ten In A Row are ABOUT the misses, so they get the run unfiltered.
  const raw = card.id === "clean-sheet" || card.id === "ten-in-a-row";
  return rule(raw ? pages : answeredPages(pages), c, done);
}
