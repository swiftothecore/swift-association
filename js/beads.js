// The spilled alphabet beads on the desk: what they spell, and where each letter lands.
//
// index.html draws the bead itself (#bdDisc face up, #bdSide on its rim), the heart bead and
// the one bead lying edge on. What is STAMPED on the face-up discs is a song title, scrambled
// the way a tipped-out handful scrambles it, and that is drawn here, seeded off the date, so the
// desk spills a different song each day.
//
// THE POOL. On an ordinary day the spill is eight beads and the song is any studio-album title
// that spells exactly eight: cardigan, Delicate, Long Live, Wi$h Li$t. Eight is what the spill
// was laid out for, so eight is what it holds unless a date asks for something else. The
// pseudo-album groups (Holiday Collection, Songs From Movies, the features) never deal. Every
// title gets its day once before any comes back (dailyFor).
//
// ANNIVERSARY DAYS OVERRIDE THAT. On a studio album's release day, or one of its Taylor's
// Versions', the song comes off that album. Eight beads still comes first, and only an album
// with no eight-bead title flexes the spill to seven or nine, which is what lets her debut
// (Our Song, Tim McGraw, Invisible...) and Red (Starlight, I Almost Do) spill a song of their
// own. A Taylor's Version's day prefers its vault tracks within the same count, so Red
// (Taylor's Version) spills Better Man and Speak Now's spills Timeless. A songday whose song
// spells seven to nine (Last Kiss on July 9th) spills that song. Her birthday and Christmas
// have no song of their own, so they deal like any other day.
//
// WHAT A BEAD CAN CARRY. Capitals A to Z and the dollar sign, because a bead kit is capitals and
// symbol beads are real (Wi$h Li$t is spelled the way she spells it). Spaces, apostrophes and
// punctuation are not beads and are dropped. A parenthetical subtitle is not part of what you'd
// thread ("Mary's Song", not "Mary's Song (Oh My My My)"). A title with a digit in it ("22") has
// no bead for it and never deals.
//
// CENTRING. Courier Prime is monospace, so text-anchor middle centres every letter's advance
// box, but the ink inside that box is not always centred in it: E, F and L lean left, K and J
// lean right, by up to a sixth of a unit, which shows at 2x. INK_DX is the correction for each
// glyph, measured off the shipped fonts/courierprime-700-latin.woff2 with canvas
// actualBoundingBox at 1400px and scaled back to the bead's 14px. Vertically every capital
// shares one 8.11 cap height, so the baseline sits at half of it (CAP_Y) and the round letters'
// overshoot is the same top and bottom. Q is the one exception: its tail drops 1.96 below the
// baseline, and centring the whole ink box would float the bowl, so Q is lifted by half its
// tail. The dollar sign runs past the caps by the same amount at both ends and needs nothing.
// Re-measure if the font file ever changes.
//
// THE SCRAMBLE. Each slot keeps its own place, size and turn, and the letters are dealt to the
// slots. A deal is thrown back if the title, or four letters of it in a row, can be read off the
// spill in its own order (either way) or straight across left to right, because a spill that
// spells its song is not a spill. N and Z only land on a slot turned less than 40 degrees:
// either one turned near 90 reads as the other.
//
// Purely decorative, like every desk prop: if the markup isn't there, every entry point here
// does nothing. The SVG stays hidden until the first spill is written, so the player never sees
// an empty handful.

import { STUDIO_ALBUMS, TS_MILESTONES, ALBUM_COLORS } from "./config.js";
import { mulberry32, dailySeed } from "./util.js";
import { settingsTodayKey } from "./storage.js";

const SVG_NS = "http://www.w3.org/2000/svg";
const svg = document.querySelector(".di-beads-r svg");
const layer = svg && svg.querySelector(".bd-letters");
// The heart bead is inked in the era colour of the album the song came off, so the one bead
// carrying a colour belongs to the song on the desk. The grey in the markup is folklore's, the
// album cardigan is from, and only shows if a spill has no album to name.
const heart = svg && svg.querySelector(".bd-heart");
const HEART_FALLBACK = "#9b9b9b";

const STUDIO = new Set(STUDIO_ALBUMS);
const DAILY_COUNT = 8;
const FLEX = [7, 9];

const CAP_Y = 4.06;      // half the 8.11 cap height: the baseline that centres a capital
const LIP_DY = 0.9;      // the deboss lip, written this far below the inked cut
const Q_LIFT = 0.45;     // half of Q's 1.96 tail below the baseline
const INK_DX = {
  B: 0.065, C: -0.007, D: 0.044, E: 0.164, F: 0.164, G: -0.113, J: -0.167, K: -0.171,
  L: 0.164, N: -0.068, P: 0.106, R: -0.137, S: -0.027, Z: 0.034, $: -0.021,
};
const TURN_SENSITIVE = new Set(["N", "Z"]);
const TURN_LIMIT = 40;

// The slots, in the order the spill runs: from the top right, where the tub tipped, down to the
// bottom left. `tint` is a bead gone a little yellow in the tub and `scuff` the mark one picked
// up there; both belong to the bead, so they stay with the slot whatever letter it carries.
// The eight are the spill as it was first laid out. Seven drops the straggler on the right,
// which leaves the run from the tub to the heart unbroken; nine adds one in the open ground
// between D, A and C, where a bigger handful would have landed.
const SCUFF_A = "M3.4 6.6 q3 -1.4 5.4 -3.6";
const SCUFF_R = "M-7.2 -3.4 q2.6 -2.4 5.6 -3.4";
const S = {
  g: { x: 208, y: 26, s: 1, r: -18 },
  i: { x: 172, y: 44, s: 1.04, r: 12, tint: ["#d3bf90", 0.16] },
  a1: { x: 190, y: 78, s: 0.97, r: 40, scuff: [SCUFF_A, "#ffffff", 0.6, 0.4] },
  d: { x: 148, y: 70, s: 1.02, r: -30 },
  extra: { x: 168, y: 101, s: 0.98, r: -6, tint: ["#d3bf90", 0.08] },
  a2: { x: 114, y: 94, s: 1.01, r: 64 },
  c: { x: 134, y: 110, s: 0.99, r: 8 },
  n: { x: 98, y: 130, s: 1, r: -52, tint: ["#cbb98e", 0.13] },
  r: { x: 74, y: 126, s: 1.03, r: 22, scuff: [SCUFF_R, "#8b8168", 0.5, 0.35] },
};
const LAYOUTS = {
  7: [S.g, S.i, S.d, S.a2, S.c, S.n, S.r],
  8: [S.g, S.i, S.a1, S.d, S.a2, S.c, S.n, S.r],
  9: [S.g, S.i, S.a1, S.d, S.extra, S.a2, S.c, S.n, S.r],
};

let daily = [];             // every eight-bead studio title, one entry per spelling
let byAlbum = new Map();    // album -> [{ title, beads, vault }], every 7-9 bead title on it
let shown = null;           // what the spill is showing, for the dev panel

/* ---------- the draw ---------- */

// The beads a title is threaded on, or "" when it can't be.
export function beadsFor(title) {
  const bare = String(title || "").replace(/\s*\(.*?\)/g, "").toUpperCase();
  if (/\d/.test(bare)) return "";
  return bare.replace(/[^A-Z$]/g, "");
}

// The release a date belongs to, or null: the newest record that has the day, the same rule
// the start button follows, so 1989 (Taylor's Version) has 27 October from 2023 on.
function releaseFor(dateKey) {
  const md = dateKey.slice(5), year = +dateKey.slice(0, 4);
  return TS_MILESTONES
    .filter((m) => m.md === md && (m.kind === "album" || m.kind === "tv") && STUDIO.has(m.album) && year >= m.year)
    .sort((a, b) => b.year - a.year)[0] || null;
}

const pickFrom = (list, rng) => list[Math.floor(rng() * list.length)] || null;

// The song for a date: { title, beads, album, why }.
function songFor(dateKey) {
  const rng = mulberry32(dailySeed("beads:" + dateKey));
  const hit = dateKey && dateKey.length >= 10 ? releaseFor(dateKey) : null;
  if (hit) {
    const list = byAlbum.get(hit.album) || [];
    const tv = hit.kind === "tv";
    // Eight first, then seven or nine; on a Taylor's Version's day, its vault first within each.
    const tiers = [(e) => e.beads.length === DAILY_COUNT, (e) => FLEX.includes(e.beads.length)];
    for (const fits of tiers) {
      const here = list.filter(fits);
      const vault = tv ? here.filter((e) => e.vault) : [];
      const song = pickFrom(vault.length ? vault : here, rng);
      if (song) return { ...song, album: hit.album, why: hit.title };
    }
  }
  const md = dateKey ? dateKey.slice(5) : "";
  const sung = TS_MILESTONES.find((m) => m.kind === "songday" && m.md === md);
  const sungBeads = sung && beadsFor(sung.title);
  if (sungBeads && sungBeads.length >= FLEX[0] && sungBeads.length <= FLEX[1])
    return { title: sung.title, beads: sungBeads, album: sung.album, why: sung.day || sung.title };
  const song = dailyFor(dateKey);
  return song ? { ...song, why: "" } : null;
}

// An ordinary day's song. Not a fresh roll each day, which with a pool of a couple of dozen put
// marjorie on the desk three days in four, and not a fresh shuffle per lap either, which let the
// end of one lap and the start of the next hand the same title back within the week. The pool
// is shuffled once, in an order of its own, and the days walk round it, so every title comes
// back exactly a pool's length of days after it last spilled.
let order = null;
function dailyFor(dateKey) {
  if (!daily.length) return null;
  const day = Math.floor(Date.UTC(+dateKey.slice(0, 4), +dateKey.slice(5, 7) - 1, +dateKey.slice(8, 10)) / 864e5);
  if (!Number.isFinite(day)) return daily[0];
  if (!order) {
    const rng = mulberry32(dailySeed("beads-order"));
    order = daily.slice();
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
  }
  return order[((day % order.length) + order.length) % order.length];
}

// Deal the letters to the slots. Returns the letters in slot order.
function scramble(beads, slots, rng) {
  const runs = new Set();
  for (let i = 0; i + 4 <= beads.length; i++) runs.add(beads.slice(i, i + 4));
  const readable = (s) => s === beads || [...runs].some((run) => s.includes(run));
  const across = slots.map((slot, i) => [slot.x, i]).sort((a, b) => a[0] - b[0]).map(([, i]) => i);
  let deal = beads.split("");
  for (let tries = 0; tries < 200; tries++) {
    deal = beads.split("");
    for (let i = deal.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [deal[i], deal[j]] = [deal[j], deal[i]];
    }
    if (deal.some((ch, i) => TURN_SENSITIVE.has(ch) && Math.abs(slots[i].r) >= TURN_LIMIT)) continue;
    const along = deal.join("");
    const back = [...deal].reverse().join("");
    const lr = across.map((i) => deal[i]).join("");
    if (!readable(along) && !readable(back) && !readable(lr)) break;
  }
  return deal;
}

/* ---------- stamping it ---------- */

const el = (name, attrs) => {
  const node = document.createElementNS(SVG_NS, name);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  return node;
};
const n = (v) => String(Math.round(v * 100) / 100);

function stampBead(slot, ch) {
  const g = el("g", { transform: `translate(${slot.x} ${slot.y})${slot.s === 1 ? "" : ` scale(${slot.s})`}` });
  g.append(el("use", { href: "#bdDisc" }));
  if (slot.tint) g.append(el("circle", { r: "10.5", fill: slot.tint[0], opacity: slot.tint[1] }));
  const turn = el("g", { transform: `rotate(${slot.r})` });
  const x = -(INK_DX[ch] || 0);
  const y = CAP_Y - (ch === "Q" ? Q_LIFT : 0);
  for (const [cls, dy] of [["bead-letter bead-letter-lip", LIP_DY], ["bead-letter", 0]]) {
    const t = el("text", { class: cls, y: n(y + dy) });
    if (x) t.setAttribute("x", n(x));
    t.textContent = ch;
    turn.append(t);
  }
  g.append(turn);
  if (slot.scuff) {
    const [d, stroke, width, opacity] = slot.scuff;
    g.append(el("path", { d, fill: "none", stroke, "stroke-width": width, opacity }));
  }
  return g;
}

function spill(song, rng) {
  const slots = LAYOUTS[song.beads.length];
  if (!slots || !layer) return;
  const deal = scramble(song.beads, slots, rng);
  layer.replaceChildren(...slots.map((slot, i) => stampBead(slot, deal[i])));
  if (heart) heart.setAttribute("fill", ALBUM_COLORS[song.album] || HEART_FALLBACK);
  shown = { ...song, deal: deal.join("") };
  svg.classList.add("is-spilled");
}

export function render(dateKey) {
  const song = songFor(dateKey);
  if (song) spill(song, mulberry32(dailySeed("beads-deal:" + dateKey)));
}

/* ---------- wiring ---------- */

// The same dev date override every dated desk prop honours, and otherwise the daily's own zone.
function currentKey() {
  const dev = typeof window !== "undefined" && window.__devDate;
  if (dev && /^\d{4}-\d{2}-\d{2}$/.test(dev)) return dev;
  return settingsTodayKey();
}
export const refresh = () => render(currentKey());

// Hand the module the catalogue and let it spill. Called once, from loadData, with TAYLOR'S
// songs, like the cassette: a guest run leaves her beads on the desk.
export function install(songs) {
  if (!layer || !Array.isArray(songs)) return;
  byAlbum = new Map();
  const seen = new Set();
  daily = [];
  order = null;
  for (const s of songs) {
    if (!STUDIO.has(s.album)) continue;
    const beads = beadsFor(s.title);
    if (beads.length < FLEX[0] || beads.length > FLEX[1]) continue;
    const entry = { title: s.title.replace(/\s*\(.*?\)/g, ""), beads, album: s.album, vault: !!s.vault };
    if (!byAlbum.has(s.album)) byAlbum.set(s.album, []);
    const list = byAlbum.get(s.album);
    if (!list.some((e) => e.beads === beads)) list.push(entry);
    if (beads.length === DAILY_COUNT && !seen.has(beads)) { seen.add(beads); daily.push(entry); }
  }
  refresh();
  // Dev hook in the spirit of deskCassette: `refresh` is what the date override calls, `render`
  // takes a date key, and `spell` forces a title onto the desk without moving the date.
  window.deskBeads = {
    render, refresh,
    shown: () => shown,
    titles: () => [...byAlbum.values()].flat(),
    spell(title) {
      const beads = beadsFor(title);
      if (!LAYOUTS[beads.length]) return null;
      const known = [...byAlbum.values()].flat().find((e) => e.title === title || e.beads === beads);
      spill({ title, beads, album: known ? known.album : "", why: "dev" }, mulberry32(dailySeed("beads-dev:" + title)));
      return shown;
    },
  };
}
