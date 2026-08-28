// The desk cassette's label — the one thing on that prop that changes.
//
// index.html draws the tape itself: the shell, the reels, the paper insert and
// its printed rules. What is WRITTEN on those rules is a song, and it is drawn
// here, seeded off the date, so the desk is dubbed a different tape each day:
//   .cs-title  — the song, in the ballpoint the calendar is marked in
//   .cs-sub    — "(Taylor's Version)", which only Clean ever wears (see below)
//   .cs-note   — the album and where the song sits on it
//
// The draw is weighted, not uniform. Clean comes up on roughly a third of days
// and everything else shares the rest, because Clean is the tape this desk
// actually owns and the others are what happens when she reaches for a blank.
// That share is CLEAN_SHARE; the fallback pool is the twelve studio albums, so
// the "track 13" half of the line is a real position on a real record and the
// pseudo-album groups (Holiday Collection, Songs From Movies, the features)
// never claim a tracklisting they don't have.
//
// Nothing else is labelled a re-recording. Which pressing of a song is on a
// dubbed tape is not knowable from the tape, so the card doesn't claim it. Clean
// is the exception because Clean is the tape the desk owns rather than one it
// dubbed, and this desk has both: HOUSE_TV_SHARE of the days it comes up it is
// the 1989 (Taylor's Version) copy, the rest of the time the original.
//
// The markup starts blank and CSS keeps the mutable ink hidden while the pool
// is measured. write() reveals both finished lines together, so the player
// never sees a fallback or measurement title before the seeded one.
//
// A written title has to fit the card. Long ones are dropped from the pool
// outright rather than shrunk to a whisper: a title is only worth writing at a
// size you can read across a desk, so the pool is measured once the hand has
// loaded and keeps only what sits inside the printed rules at full size. What
// survives that cut still goes through fitLine, because how much of the card is
// on screen shrinks with the window and the accessibility text-size offset can
// widen every line. Sizes go out as custom properties rather than inline
// font-size so that offset in styles.css still applies.
//
// Purely decorative, like every desk prop: if the markup isn't there — narrow
// screens, quiet desk density — every entry point here does nothing.

import { STUDIO_ALBUMS } from "./config.js";
import { mulberry32, dailySeed } from "./util.js";

const svg = document.querySelector(".di-cassette svg");
const titleEl = svg && svg.querySelector(".cs-title");
const noteEl = svg && svg.querySelector(".cs-note");

// The tape this desk owns. Roughly one day in three, and when it comes up it is
// the re-recorded copy more often than not.
const HOUSE_TAPE = { album: "1989", title: "Clean" };
const CLEAN_SHARE = 0.34;
const HOUSE_TV_SHARE = 0.6;

const STUDIO = new Set(STUDIO_ALBUMS);

// The writable span between the card's printed rules (x 24 → 168 in the SVG's
// own units), less a little air at each end so nothing runs to the edge.
const RULE_SPAN = 140;
const TITLE_X = 95, TITLE_Y = 32.7;   // where the title is written (see index.html)
const EDGE_MARGIN = 18;               // px of screen kept clear of the viewport edge
const TITLE_BASE = 13, SUB_BASE = 7.4, NOTE_BASE = 7.2;
const MIN_SCALE = 0.55;     // past here a title is illegible; let it run off instead
// Below this a title has never once needed the ruler — the widest short title on
// the catalogue measures 110 of the 140 units — so the measuring pass skips them
// and only weighs the couple of dozen that could plausibly overrun.
const SAFE_CHARS = 22;

let pool = [];              // every song the draw can reach, in songs.json order
let house = null;           // the Clean entry, drawn separately so it can't double up
let cut = [];               // what the card was too small to hold, kept for the dev panel

/* ---------- the draw ---------- */

// Which tape the desk is playing on a given "YYYY-MM-DD", and — for the house
// tape only — which pressing of it. Stable for that date and unrelated to every
// other seeded thing on the page, so the daily challenge and the cassette never
// move together.
function drawFor(dateKey) {
  const rng = mulberry32(dailySeed("cassette:" + dateKey));
  if (!pool.length || (house && rng() < CLEAN_SHARE))
    return { song: house, tv: !!house && rng() < HOUSE_TV_SHARE };
  // Only the house tape is ever labelled a re-recording, so every other draw is
  // written plain and the version coin is never tossed.
  return { song: pool[Math.floor(rng() * pool.length)] || house, tv: false };
}

// The song alone, for the dev panel and console poking.
export function pick(dateKey) { return drawFor(dateKey).song; }

/* ---------- writing it on the card ---------- */

// How much of the printed rule is actually on screen. The tape is an edge prop:
// its right-hand third hangs off the viewport on purpose, so on a narrow desk
// what limits a title is the screen edge and not the card. Measured off the live
// screen matrix rather than recomputed from the CSS, so the rotation, the
// overhang and the breakpoint that loosens it are all accounted for by looking.
function visibleSpan() {
  if (!svg || !svg.getScreenCTM) return RULE_SPAN;
  try {
    const m = svg.getScreenCTM();
    if (!m) return RULE_SPAN;
    const pt = svg.createSVGPoint();
    const at = (x) => { pt.x = x; pt.y = TITLE_Y; return pt.matrixTransform(m).x; };
    const mid = at(TITLE_X);
    const perUnit = (at(TITLE_X + 20) - mid) / 20;
    if (!(perUnit > 0)) return RULE_SPAN;
    // The title is centred, so half of it has to clear the edge and the other
    // half follows it back across the card.
    const half = (window.innerWidth - EDGE_MARGIN - mid) / perUnit;
    return Math.max(0, Math.min(RULE_SPAN, half * 2));
  } catch { return RULE_SPAN; }
}

// Shrink one line until it fits the room there is. getComputedTextLength reads
// what is actually on screen, so a couple of passes converge whatever the hand
// and the text-size offset do to the metrics.
function fitLine(el, prop, base, extra, span) {
  if (!el) return;
  let size = base;
  el.style.setProperty(prop, size + "px");
  if (extra) el.style.setProperty(extra[0], extra[1] + "px");
  for (let i = 0; i < 3; i++) {
    let width = 0;
    try { width = el.getComputedTextLength(); } catch { return; }
    if (!width || width <= span) return;
    const scale = Math.max(MIN_SCALE, (span / width) * 0.995);
    size *= scale;
    el.style.setProperty(prop, size.toFixed(2) + "px");
    if (extra) el.style.setProperty(extra[0], (extra[1] * (size / base)).toFixed(2) + "px");
    if (scale === MIN_SCALE) return;
  }
}

// Write one song onto the card: the title on the red rule, the version note
// trailing it on the days the house tape is the re-recorded copy, the album and
// track on the blue rule at the foot.
function write(song, tv) {
  titleEl.textContent = song.title;
  if (tv) {
    const sub = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    sub.setAttribute("class", "cs-sub");
    sub.setAttribute("dx", "3.4");
    sub.setAttribute("dy", "-0.2");
    sub.textContent = "(Taylor\u2019s Version)";
    titleEl.appendChild(sub);
  }
  noteEl.textContent = `${song.album} \u00b7 track ${song.track}`;
  const span = visibleSpan();
  fitLine(titleEl, "--cs-title-size", TITLE_BASE, ["--cs-sub-size", SUB_BASE], span);
  fitLine(noteEl, "--cs-note-size", NOTE_BASE, null, span);
  svg.classList.add("is-dubbed");
}

/* ---------- what the card can hold ---------- */

// How wide this title is written at full size, or 0 when the card isn't being
// laid out at all — a hidden or not-yet-rendered SVG measures every string at
// nothing, and 0 is the one answer that means "don't know" rather than "fits".
function titleWidth(title) {
  titleEl.textContent = title;
  try { return titleEl.getComputedTextLength(); } catch { return 0; }
}

// Weigh the pool and drop what the card can't hold, measuring on the real text
// element in the real hand: a character count can't tell "Would've, Could've,
// Should've" (29 narrow characters, and it fits) from "The Tortured Poets
// Department" (29 wide ones, and it doesn't).
//
// Done once, before the first draw, so a too-long title is never written and
// then swapped out from under the player. If the tape isn't being laid out yet
// the pass measures nothing and leaves the pool alone rather than trusting a
// zero, and the next render tries again — a backgrounded tab and a desk still
// coming up both land here. The house tape is exempt: "Clean" fits five times
// over, and a desk with no pool at all still has its own tape on it.
let pruned = false;
function prune() {
  if (pruned || !titleEl || !pool.length) return;
  titleEl.style.setProperty("--cs-title-size", TITLE_BASE + "px");
  const keep = [], dropped = [];
  for (const song of pool) {
    if (song.title.length <= SAFE_CHARS) { keep.push(song); continue; }
    const width = titleWidth(song.title);
    if (!width) { titleEl.style.removeProperty("--cs-title-size"); return; }
    (width <= RULE_SPAN ? keep : dropped).push(song);
  }
  titleEl.style.removeProperty("--cs-title-size");
  pool = keep;
  cut = dropped;
  pruned = true;
}

export function render(dateKey) {
  prune();
  const { song, tv } = drawFor(dateKey);
  if (song && titleEl && noteEl) write(song, tv);
}

/* ---------- wiring ---------- */

// What day the tape is dubbed for. Same dev date override the desk calendar
// honours (window.__devDate, "YYYY-MM-DD", session-only), so scrubbing the date
// in the dev panel re-dubs the tape with everything else.
function currentKey() {
  const dev = typeof window !== "undefined" && window.__devDate;
  if (dev && /^\d{4}-\d{2}-\d{2}$/.test(dev)) return dev;
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
export const refresh = () => render(currentKey());

function scheduleMidnight() {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 5);
  setTimeout(() => { refresh(); scheduleMidnight(); }, next - now);
}

// Hand the module the catalogue and let it dub the tape. Called once, from
// loadData, with TAYLOR'S songs — the desk keeps her tape on it through a guest
// run, so this is deliberately not re-pointed when the corpus swaps.
export function install(songs) {
  if (!svg || !Array.isArray(songs)) return;
  pool = songs.filter((s) => STUDIO.has(s.album) &&
    !(s.album === HOUSE_TAPE.album && s.title === HOUSE_TAPE.title));
  house = songs.find((s) => s.album === HOUSE_TAPE.album && s.title === HOUSE_TAPE.title) || null;
  // The hand decides how wide a title is, so measure only once it has arrived.
  const draw = () => { refresh(); scheduleMidnight(); };
  // How much of the card is on screen changes with the window, and so does how
  // small the hand has to be written; re-fit once the drag has stopped.
  let resizeT = 0;
  window.addEventListener("resize", () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(refresh, 180);
  });
  // A tape with no box on it — a tab that loaded in the background, a desk that
  // hasn't been laid out yet — measures every title at nothing, so the pass
  // above defers rather than trusting a zero. Getting a size is the signal that
  // it can finally be done, and render does it before it writes. One-shot: the
  // observer lets itself go the moment the pool has been weighed.
  const card = svg.closest(".desk-item") || svg;
  if (pool.length && typeof ResizeObserver === "function") {
    const ro = new ResizeObserver(() => {
      if (!card.getBoundingClientRect().width) return;
      refresh();
      if (pruned) ro.disconnect();
    });
    ro.observe(card);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw).catch(draw);
  else draw();
  // Dev hook in the spirit of deskCalendar: `refresh` is what the date override
  // calls, `render` takes a date key for console poking, and `play` forces a
  // song onto the card without moving the date.
  window.deskCassette = {
    render, refresh, pick,
    // The full draw — song plus which pressing of it — for the weighting readout.
    draw: drawFor,
    songs: () => (house ? [house, ...pool] : pool.slice()),
    // What the measuring pass threw out, so the dev panel can show which titles
    // the card is too small to hold.
    cut: () => cut.slice(),
    // Force a song onto the card without moving the date. The next refresh
    // (a date scrub, or midnight) puts the real draw back. `tv` writes the
    // version note; it defaults to how the house tape is usually labelled.
    play(title, tv) {
      const all = house ? [house, ...pool, ...cut] : [...pool, ...cut];
      const s = all.find((x) => x.title === title);
      if (s) write(s, tv === undefined ? s === house : !!tv);
      return s || null;
    },
  };
}
