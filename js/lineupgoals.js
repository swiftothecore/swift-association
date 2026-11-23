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

/* THE FLOOR. No card is held on a run that lands fewer than this many pages. Without it every
   ban in the deck was won by a run that answered nothing at all, since "not one Taylor song"
   and "no artist twice in a row" are both perfectly true of thirteen blank pages: No Home
   Team, Quiet Half and One And Done made a 24-pip hand a player could hold by letting the
   clock run out thirteen times. A ban is a promise about the pages you DO answer, and a run
   has to answer enough of them for the promise to have cost anything. Eight is the line the
   deck's own floors already draw (Undercard's eight away pages, Ten In A Row's ten), and it
   leaves room for five misses, so a lockout still has its real tension: a page you would
   rather miss than break the ban for. */
export const FLOOR = 8;

const answeredPages = (pages) => pages.filter((p) => p.artists && p.artists.length);
const isMiss = (p) => !p.artists || !p.artists.length;
// The name a strip has room for: "Taylor", "Olivia", "Wicked".
const short = (name) => String(name || "").split(" ")[0];

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

// The shelf without her, for the guests-only cards.
const guestsOf = (c) => c.shelf.filter((a) => a !== c.home);

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
/* The longest run of answered pages a single artist holds at the END of the run so far: the
   streak that can still grow. A card chasing a streak is only doomed when even this one, given
   every page left, falls short. */
function trailingStreak(pages, shelf) {
  let best = 0;
  for (const a of shelf) {
    let run = 0;
    for (let i = pages.length - 1; i >= 0 && pages[i].artists.includes(a); i--) run++;
    best = Math.max(best, run);
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
   THE RULES. One per card id, each (pages, ctx, done, card) -> state,
   where ctx is { pages: 13, shelf: [names], home, named: [], admitted: [] }.
   `pages` here has already had the card's missed-page ruling applied
   by judge() below: a "skipped" card never sees an unanswered page, a
   "fails" card is already dead before it gets here, and a "breaks" or
   "window" card sees every page, misses as pages with nobody on them.
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
    if (!ps.length) return keep(done, true);
    // Banned is whoever answers page one — the artist you ANSWER with, never the artist of a
    // page you missed, so tanking page one cannot dodge the ban.
    const first = ps[0].artists;
    if (first.length > 1) return keep(done, true);            // a shared song bans nobody outright
    /* Strict on purpose, unlike the "either credit can satisfy a card" reading most cards take:
       a lockout locks. A later song shared with the banned artist still sits on their shelf, and
       the shelf is closed, so their name anywhere on the page kills the card, as a shared Taylor
       song does on No Home Team. Only page one is generous, because there the game cannot tell
       which artist you meant and banning one at random would punish a guess it made for you. */
    return keep(done, ps.slice(1).every((p) => !p.artists.includes(first[0])));
  },
  "nobody-admitted": (ps, c, done) => {
    const shut = new Set(c.admitted || []);
    return keep(done, ps.every((p) => p.artists.some((a) => !shut.has(a))));
  },
  "one-and-done": (ps, c, done) => {
    let previous = null;
    for (const p of ps) {
      // Keep only credits reachable without repeating the previous page. Checking pairs in
      // isolation would let A / [A,B] / B give the shared page two incompatible credits.
      const next = new Set(p.artists.filter((a) =>
        !previous || previous.size > 1 || !previous.has(a)));
      if (!next.size) return DEAD;
      previous = next;
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
    const share = biggestShare(ps, guestsOf(c));
    if (share >= 7) return WON;
    return doomed(c, share, 7) ? DEAD : settle(done, false);
  },
  "long-story-short": (ps, c, done) =>
    longestStreak(ps, c.shelf) >= 5 ? WON : doomed(c, trailingStreak(ps, c.shelf), 5) ? DEAD : settle(done, false),
  "two-of-us": (ps, c, done) => {
    // Every page on one of two guests. Try each pair the run could support.
    for (const a of guestsOf(c)) for (const b of guestsOf(c)) {
      if (a === b) continue;
      if (ps.every((p) => p.artists.includes(a) || p.artists.includes(b))) return keep(done, true);
    }
    return DEAD;
  },
  "back-to-december": (ps, c, done) => {
    // A window card: it sees every page. Opening on nobody or finishing on nobody is not
    // finishing on the artist you opened with, and a miss anywhere between is no business of it.
    if (!ps.length) return ALIVE;
    if (isMiss(ps[0])) return DEAD;
    if (!done) return ALIVE;                                  // only the last page can settle it
    const open = ps[0].artists, close = ps[ps.length - 1].artists;
    return open.some((a) => close.includes(a)) ? WON : DEAD;
  },
  "the-last-great": (ps, c, done) => {
    // Never answer with a NEW artist until the one before has been used twice.
    // Shared songs still answer a page. Try each credit, retaining a single consistent
    // history rather than skipping the song or counting it once for every artist.
    const artists = [...new Set(ps.flatMap((p) => p.artists))];
    const choices = ps.map((p) => p.artists.map((a) => artists.indexOf(a)));
    const counts = artists.map(() => 0), failed = new Set();
    const visit = (i, prev) => {
      if (i === choices.length) return true;
      const key = [i, prev, ...counts].join(",");
      if (failed.has(key)) return false;
      for (const a of choices[i]) {
        const used = counts[a];
        if (!used && prev !== -1 && counts[prev] < 2) continue;
        counts[a] = Math.min(2, used + 1); // only zero, once and twice affect the rule
        const ok = visit(i + 1, a);
        counts[a] = used;
        if (ok) return true;
      }
      failed.add(key);
      return false;
    };
    return keep(done, visit(0, -1));
  },

  /* ---- DIAMONDS: spread ---- */
  "full-lineup": (ps, c, done) => {
    const got = distinctArtists(ps, c.shelf);
    if (got >= c.shelf.length) return WON;
    return doomed(c, got, c.shelf.length) ? DEAD : settle(done, false);
  },
  "round-the-table": (ps, c, done) => {
    // Nobody twice until everybody once. A window card: until the round is complete every page
    // counts, so a miss inside it kills the card rather than being skipped over, which would let
    // a player duck a page that offered nothing but repeats. Once everyone has answered, nothing
    // that follows can break it.
    const head = [];
    for (const p of ps) {
      if (distinctArtists(head, c.shelf) >= c.shelf.length) break;
      if (isMiss(p)) return DEAD;
      head.push(p);
      if (distinctArtists(head, c.shelf) < head.length) return DEAD;
    }
    const got = distinctArtists(head, c.shelf);
    if (got >= c.shelf.length) return WON;
    return doomed(c, got, c.shelf.length) ? DEAD : settle(done, false);
  },
  "undercard": (ps, c, done) => {
    const away = ps.filter((p) => p.artists.some((a) => a !== c.home)).length;
    if (away >= 8) return WON;
    return doomed(c, away, 8) ? DEAD : settle(done, false);
  },
  "no-repeats-yet": (ps, c, done) => {
    const head = ps.slice(0, 8);
    if (distinctArtists(head, c.shelf) < head.length) return DEAD;
    return settle(done, head.length === 8);
  },
  "headliners": (ps, c, done) => {
    const got = distinctArtists(ps, c.shelf);
    return got >= 6 ? WON : doomed(c, got, 6) ? DEAD : settle(done, false);
  },
  "opening-act": (ps, c, done) => {
    const head = ps.slice(0, 5);
    // Dead once the pages left in the opening five cannot bring it up to four.
    if (distinctArtists(head, c.shelf) + (5 - head.length) < 4) return DEAD;
    return head.length === 5 && distinctArtists(head, c.shelf) >= 4 ? WON : settle(done, false);
  },

  /* ---- CLUBS: form. These read HOW a page was answered, not who by. ---- */
  // thirteen from thirteen: not "thirteen pages happened", which is what this used to check
  "clean-sheet": (ps, c, done) => keep(done, !ps.some(isMiss)),
  "off-the-cuff": (ps, c, done, card) =>
    keep(done, ps.every((p) => !isMiss(p) && p.ms <= (card.inside || 10) * 1000)),
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
   decision every time and every card prints one: a card that FAILS on a miss is dead the
   moment a page goes unanswered, a card that SKIPS one never sees it, and a card whose miss
   BREAKS a streak or falls inside a WINDOW reads every page, misses as pages nobody answered.
   Then the FLOOR, which no card's own rule knows about: a card is never held on a run that
   lands fewer than FLOOR pages, and is struck the moment the pages left cannot get it there. */
function ruleState(card, pages, c) {
  const rule = RULES[card.id];
  if (!rule) throw new Error("no lineup rule for card " + card.id);
  const done = pages.length >= c.pages;
  if (card.miss === "fails" && pages.some(isMiss)) return DEAD;
  const seen = card.miss === "skipped" ? answeredPages(pages) : pages;
  return rule(seen, c, done, card);
}
const context = (ctx, pages) =>
  ({ pages: 13, floor: FLOOR, shelf: [], home: "", named: [], admitted: [], ...ctx, played: pages.length });
const landedOf = (pages) => pages.length - pages.filter(isMiss).length;
// True once the pages left cannot carry the run to the floor.
const belowFloor = (pages, c) => landedOf(pages) + (c.pages - pages.length) < c.floor;

export function judge(card, pages, ctx) {
  const c = context(ctx, pages);
  const state = ruleState(card, pages, c);
  if (state === DEAD) return DEAD;
  if (belowFloor(pages, c)) return DEAD;
  if (state === WON && landedOf(pages) < c.floor) return pages.length >= c.pages ? DEAD : ALIVE;
  return state;
}

/* The page a card died on, 1-based, or 0 if it has not died. Replayed page by page rather
   than remembered, because the judge is pure and the run is short. */
export function deathPage(card, pages, ctx) {
  for (let i = 1; i <= pages.length; i++) if (judge(card, pages.slice(0, i), ctx) === DEAD) return i;
  return 0;
}

/* Why a card died, in the words a struck card says it on the page and on the results: a short
   phrase, never a sentence, so it can follow the card's name ("Headliners: a missed page").
   Asked of the run as it stood on the page it died, so the reason is the one that killed it
   rather than one that arrived later. */
export function deathNote(card, pages, ctx) {
  const at = deathPage(card, pages, ctx);
  if (!at) return "";
  const run = pages.slice(0, at), c = context(ctx, run), last = run[run.length - 1];
  if (card.miss === "fails" && isMiss(last)) return "a missed page";
  if (ruleState(card, run, c) !== DEAD) return `too few pages left to land ${c.floor}`;
  const ps = card.miss === "skipped" ? answeredPages(run) : run;
  const why = WHY[card.id];
  return (why && why(ps, c, last)) || "";
}

const WHY = {
  "no-home-team": (ps, c) => `a ${short(c.home)} song`,
  "three-chairs": (ps, c) => ((c.named || []).length === 3 ? "an artist outside your three" : "three never named"),
  "quiet-half": (ps, c) => `a seventh ${short(c.home)} page`,
  "closed-shelf": (ps) => `${short(ps[0].artists[0])} again`,
  "nobody-admitted": () => "a catalogue you have been admitted to",
  "one-and-done": () => "one artist twice running",
  "sworn-in": (ps, c) => ((c.named || [])[0] ? `too few pages left for ${short(c.named[0])}` : "nobody named"),
  "homecoming": () => "too few pages left for seven on one",
  "long-story-short": () => "too few pages left for five in a row",
  "two-of-us": (ps, c) => (ps.length && ps[ps.length - 1].artists.every((a) => a === c.home) ? `a ${short(c.home)} page` : "a third artist"),
  "back-to-december": (ps) => (isMiss(ps[0]) ? "a missed first page" : isMiss(ps[ps.length - 1]) ? "a missed last page" : "finished on somebody else"),
  "the-last-great": () => "a new artist too soon",
  "full-lineup": () => "too few pages left for everyone",
  "round-the-table": (ps, c, last) => (isMiss(last) ? "a miss before everyone had answered" : distinctArtists(answeredPages(ps), c.shelf) < answeredPages(ps).length ? "a second page before everyone had one" : "too few pages left for everyone"),
  "undercard": () => "too few pages left for eight",
  "no-repeats-yet": (ps, c, last) => (isMiss(last) ? "a miss in the first eight" : "a repeat in the first eight"),
  "headliners": () => "too few pages left for six",
  "opening-act": () => "too few artists in the first five",
  "clean-sheet": () => "a missed page",
  "off-the-cuff": (ps, c, last) => (isMiss(last) ? "a missed page" : "a page over ten seconds"),
  "cold-open": () => "the suggestions opened",
  "sing-it-back": () => "too few pages left for five",
  "no-hints": () => "a hint",
  "ten-in-a-row": () => "too few pages left for ten in a row",
};

/* What a LIVE card has to tell you that its name cannot: who is banned, who you opened with,
   how far a count has got. Without it the strip asked the player to remember the run, and the
   one card that most needs remembering, Closed Shelf, said nothing at all after banning
   Taylor on page one. Short enough to sit after a name on one line; "" when there is nothing
   to say yet. Only asked of cards still alive, since a won card is ticked and a dead one has
   deathNote instead. */
export function goalNote(card, pages, ctx) {
  const c = context(ctx, pages);
  const ps = answeredPages(pages);
  const of = (n, want) => `${Math.min(n, want)} of ${want}`;
  const singles = (p) => (p && p.artists.length === 1 ? p.artists[0] : "");
  switch (card.id) {
    case "three-chairs": return (c.named || []).map(short).join(", ");
    case "quiet-half": {
      const used = ps.filter((p) => p.artists.every((a) => a === c.home)).length;
      return used >= 6 ? `${short(c.home)} shut` : `${short(c.home)} ${of(used, 6)}`;
    }
    case "closed-shelf": return ps.length && singles(ps[0]) ? `${short(singles(ps[0]))} shut` : "";
    case "nobody-admitted": {
      const shut = c.admitted || [];
      return !shut.length ? "" : shut.length <= 2 ? `${shut.map(short).join(", ")} shut` : `${shut.length} shut`;
    }
    case "one-and-done": return ps.length && singles(ps[ps.length - 1]) ? `not ${short(singles(ps[ps.length - 1]))} next` : "";
    case "sworn-in": {
      const who = (c.named || [])[0];
      return who ? `${short(who)} ${of(ps.filter((p) => p.artists.includes(who)).length, 7)}` : "";
    }
    case "homecoming": {
      let best = "", n = 0;
      for (const a of guestsOf(c)) { const k = ps.filter((p) => p.artists.includes(a)).length; if (k > n) { n = k; best = a; } }
      return n ? `${short(best)} ${of(n, 7)}` : "";
    }
    case "long-story-short": { const n = trailingStreak(pages, c.shelf); return n ? `${n} in a row` : ""; }
    case "two-of-us": {
      const used = [...new Set(ps.flatMap((p) => p.artists))].filter((a) => a !== c.home);
      return used.length && used.length <= 2 ? used.map(short).join(" + ") : "";
    }
    case "back-to-december": return pages.length && singles(pages[0]) ? `opened on ${short(singles(pages[0]))}` : "";
    case "the-last-great": {
      const last = ps.length ? singles(ps[ps.length - 1]) : "";
      if (!last) return "";
      const n = ps.filter((p) => p.artists.includes(last)).length;
      return n < 2 ? `${short(last)} once more first` : "";
    }
    case "full-lineup": return of(distinctArtists(ps, c.shelf), c.shelf.length);
    case "round-the-table": return of(distinctArtists(ps, c.shelf), c.shelf.length);
    case "undercard": return of(ps.filter((p) => p.artists.some((a) => a !== c.home)).length, 8);
    case "no-repeats-yet": return of(distinctArtists(pages.slice(0, 8), c.shelf), 8);
    case "headliners": return of(distinctArtists(ps, c.shelf), 6);
    case "opening-act": return pages.length < 5 ? of(distinctArtists(pages.slice(0, 5), c.shelf), 4) : "";
    case "sing-it-back": return of(ps.filter((p) => p.sung).length, 5);
    case "ten-in-a-row": {
      let run = 0;
      for (const p of pages) run = isMiss(p) ? 0 : run + 1;
      return run ? `${run} in a row` : "";
    }
    default: return "";
  }
}

// How many pages the run has landed, for the strip's floor counter.
export const landed = landedOf;
