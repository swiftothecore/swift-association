// Working desk calendar — a wire-bound flip pad lying flat on the writing side
// of the desk, between the glasses and the mug, open to the REAL current month.
//
// index.html carries only the static paper: the card, its grain and lighting,
// the punch slots, the coil, the red divider rule and the lifted tear corner.
// This module draws everything the date decides, so the pad is never wrong:
//   .cal-title   — MONTH + year
//   .cal-season  — the month's own hand-drawn mark, left of the title
//   .cal-week    — S M T W T F S, weekends in the printer's red
//   .cal-marks   — the days that matter, marked in the app's own milestone
//                  language (see renderMilestoneSticky in app.js)
//   .cal-days    — the grid of dates
//   .cal-strikes — a graphite stroke through each day already crossed off
//   .cal-hl      — one gold highlighter swipe on the 13th (of course)
//   .cal-today   — the red pen loop around today, main stroke plus a lighter
//                  echo pass, like a pen that went around twice
//
// The marked days come from the real tables in config.js rather than a list of
// this module's own: TS_MILESTONES (her birthday, the twelve studio albums and
// the re-records) and TS_LORE_DAYS (the days the songs put a date on). Each
// wears its album's colour, honouring the colour-blind palette setting.
//
// The hand marks use seeded jitter — stable within a day so nothing flickers
// on re-render, but each day's slash gets its own angle, length and bow, and
// the pen loop tilts differently every day. Re-renders just after local
// midnight so a page left open overnight crosses off the day and moves the
// loop. Purely decorative and non-interactive, like every desk prop; if the
// markup isn't there it does nothing.

import { TS_MILESTONES, TS_LORE_DAYS, ALBUM_COLORS, CB_ALBUM_COLORS, SALT_SHAKER_D, SALT_CAP_D } from "./config.js";
import { loadSettings } from "./storage.js";

const SVG = "http://www.w3.org/2000/svg";
const svg = document.querySelector(".di-calendar svg");

const el = (name, attrs, text) => {
  const n = document.createElementNS(SVG, name);
  for (const k in attrs) if (attrs[k] != null) n.setAttribute(k, attrs[k]);
  if (text != null) n.textContent = text;
  return n;
};
const clear = (g) => { while (g.firstChild) g.removeChild(g.firstChild); };

// Cheap seeded jitter in [0,1): stable for a given seed, so the pen work
// looks human without changing between renders on the same day.
const jit = (seed) => {
  const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

// --- grid geometry (matches the card drawn in index.html) ---
const COL0 = 46, CW = 26.3;             // centre of first column + pitch
const colX = (c) => COL0 + c * CW;
const WEEK_Y = 133;                     // weekday-initial baseline
const ROW0 = 152, RH = 22;              // first date row baseline + pitch
const rowY = (r) => ROW0 + r * RH;
const NUM_DY = 4.1;                     // optical centring of the numerals
const MARK_DX = 7.8, MARK_DY = 5.6;     // the mark sits off the number's lower right

const MONTHS = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
const DOW = ["S", "M", "T", "W", "T", "F", "S"];

// The heart is app.js's milestone-sticky heart, same path, drawn small; the star
// is the desk's own folded paper star (the #flStarG geometry in index.html).
const HEART_D = "M16 27.5C15.4 27.1 4.5 19.6 4.5 11.7c0-3.6 2.7-6.4 6-6.4 2.3 0 4.2 1.3 5.5 3.4 1.3-2.1 3.2-3.4 5.5-3.4 3.3 0 6 2.8 6 6.4 0 7.9-10.9 15.4-11.5 15.8z";
const STAR_D = "M0 -12 L2.94 -4.05 L11.41 -3.71 L4.76 1.55 L7.05 9.71 L0 5 L-7.05 9.71 L-4.76 1.55 L-11.41 -3.71 L-2.94 -4.05 Z";

// One mark per calendar square. Oct 27 is both 1989 and 1989 (Taylor's Version),
// and two hearts will not fit in a 26px cell — so the earlier, original release
// wins the square (they share an album colour anyway, so the day still reads as
// 1989's). Her birthday outranks everything; a lyric day yields to a release.
const RANK = { birthday: 0, album: 1, tv: 2, lore: 3 };
const DAY_MARK = new Map();
for (const m of [...TS_MILESTONES, ...TS_LORE_DAYS]) {
  const held = DAY_MARK.get(m.md);
  if (!held || RANK[m.kind] < RANK[held.kind]) DAY_MARK.set(m.md, m);
}
const mdKey = (m, d) => `${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

// A graphite slash through a spent day: its own angle, length, bow and
// offset per date, like strokes made on different mornings.
const strike = (cx, cy, s) => {
  const a = (-22 - jit(s) * 16).toFixed(1);
  const L = 11.5 + jit(s + 7) * 3.5;
  const bow = 0.8 + jit(s + 13) * 1.4;
  const dx = (jit(s + 3) - 0.5) * 2.4, dy = (jit(s + 5) - 0.5) * 2;
  return el("path", {
    d: `M${(-L / 2).toFixed(1)} ${bow.toFixed(1)} Q0 ${(-bow).toFixed(1)} ${(L / 2).toFixed(1)} ${(-bow * 1.6).toFixed(1)}`,
    transform: `translate(${(cx + dx).toFixed(1)} ${(cy + dy).toFixed(1)}) rotate(${a})`
  });
};

// --- the month's own mark, in the title line ---
//
// One drawing per month rather than one per season, so tearing a sheet off
// always changes something. Each is drawn in a 0 0 24 24 box centred on 12,12,
// as open pen line: no fills and no shading, the same ink-on-paper rule the
// rest of the page keeps. Nothing is symmetrical on purpose — rays, arms,
// leaves and needles all differ, like marks made by a hand rather than a font.
//
// Two months are drawn around what the GRID already stamps on them, because the
// same object twice on one sheet reads as a mistake: August is not a salt
// shaker (the 1st wears one for "august") and December is not a folded star
// (the 13th wears one for her birthday).
//
// Northern hemisphere, matching the seasonal eggs the game already runs on the
// calendar year (December snowfall, the Halloween-week leaves).
const MONTH_MARKS = [
  { name: "snowflake", ink: [
    "M12 3.6 V20.3", "M5.1 7.6 L19.1 16.2", "M19.3 7.9 L4.9 16.4",
    "M12 6.6 L9.6 4.5", "M12 6.9 L14.6 4.9", "M12 17.2 L14.3 19.4",
    "M7.9 9.4 L7.3 6.6", "M16.6 14.6 L17.4 17.4", "M16.4 9.6 L17.2 6.9"] },
  { name: "mitten", ink: [
    "M8.6 20.4 C7.2 16.2 7.4 11.4 8.9 8.2 C9.9 6 12.4 5.3 14.2 6.5 C16 7.7 16.4 10.2 15.7 12.6 C15.1 14.8 15.5 17.6 16.4 20.2 Z",
    "M8.5 13.4 C6.5 12.2 4.9 12.8 4.7 14.4 C4.5 16 5.9 17.1 8.2 17.2",
    "M8.2 17.9 C10.9 18.9 13.9 18.9 16.1 17.7",
    "M10.6 9.6 L11.6 11.4", "M13.2 9.2 L14 11"] },
  { name: "sprig", ink: [
    "M12.4 21.2 C11.6 16.4 11.5 11.6 12.9 6.2",
    "M12.1 15.6 C8.4 15.7 6.1 13.4 6.4 10.3 C9.7 10.2 11.9 12.4 12.1 15.6 Z",
    "M12.6 11.4 C12.9 8.2 15.3 6 18.3 6.5 C18.2 9.5 15.8 11.6 12.6 11.4 Z",
    "M12.9 6.2 C12.9 4.4 14 3.2 15.4 3.4"] },
  { name: "rain cloud", ink: [
    "M7.2 14.6 C4.8 14.6 3.2 13.2 3.5 11.4 C3.8 9.8 5.4 9 7.1 9.5 C7.1 6.4 9.7 4.4 12.7 5 C15.2 5.5 16.9 7.6 16.8 10 C18.9 9.6 20.6 10.9 20.4 12.6 C20.2 14 19 14.7 17.3 14.6 Z",
    "M8.4 17.2 L7.2 20.6", "M12.6 17.4 L11.2 21.4", "M16.2 17.4 L15.4 19.8"] },
  { name: "blossom", ink: [
    "M12 5 C14.3 5 15.7 6.9 15 8.9 C17 8 19 9.2 19 11.3 C19 13.2 17.3 14.4 15.3 13.8 C16.3 15.7 15.4 17.8 13.4 18.2 C11.6 18.6 10.1 17.4 9.9 15.5 C8.4 16.9 6.2 16.4 5.4 14.5 C4.7 12.8 5.7 11.1 7.6 10.9 C6.2 9.5 6.7 7.3 8.6 6.6 C9.9 6.1 11.2 6.6 11.8 7.8",
    "M9.8 11.6 A2.1 2.1 0 1 0 14 11.6 A2.1 2.1 0 1 0 9.8 11.6 Z",
    "M13.8 18.4 C14.6 20 16.2 20.8 18.3 20.5"] },
  { name: "sun", ink: [
    "M16.4 8.1 C18.4 10.3 18.1 13.6 15.7 15.4 C13.2 17.2 9.9 16.6 8.3 14.2 C6.7 11.7 7.6 8.5 10.2 7.2 C12 6.3 14.4 6.6 16.1 8.3",
    "M12.2 4.9 V2.2", "M17.9 6.4 L19.9 4.2", "M19.4 11.6 H22.4", "M18 17.2 L19.6 19",
    "M12.1 19 V21.7", "M6.4 17.4 L4.3 19.8", "M5.2 11.7 H2.1", "M6.2 6.3 L4.5 4.6"] },
  { name: "sun over water", ink: [
    "M6.6 13.4 C6.6 10.2 9 7.7 12.1 7.7 C15.1 7.7 17.6 10.1 17.6 13.2",
    "M12.1 4.6 V2.4", "M18.6 7.2 L20.2 5.4", "M5.8 7.4 L4.1 5.7",
    "M3.2 15.4 C5.6 14.2 7.2 16.4 9.6 15.3 C11.9 14.2 13.4 16.3 15.8 15.3 C18 14.4 19.2 15.6 21 15.2",
    "M3.6 19.4 C6 18.2 7.6 20.3 10 19.3 C12.3 18.3 13.8 20.2 16.2 19.3"] },
  { name: "iced tea", ink: [
    "M7.8 8.6 L9.5 20.6 C9.7 21.5 14.3 21.5 14.5 20.6 L16.2 8.6",
    "M7.8 8.6 C7.8 7.7 16.2 7.7 16.2 8.6",
    "M13.9 8.2 L17.6 3.4",
    "M8.4 12.4 C10.8 13.1 13.4 13.1 15.6 12.3",
    "M10.4 15.2 L12.9 14.4 L13.6 16.6 L11.1 17.4 Z"] },
  { name: "acorn", ink: [
    "M7.4 11.4 C7.4 16.2 9.6 20.4 12.4 20.4 C15.2 20.4 17.2 16.2 17 11.4",
    "M6.6 11.6 C6.6 9.6 9.2 8.2 12.3 8.2 C15.4 8.2 17.8 9.7 17.7 11.6 C17.7 12.3 14.9 12.6 12.3 12.6 C9.5 12.6 6.6 12.3 6.6 11.6 Z",
    "M9.4 8.6 L9 12.2", "M13.2 8.3 L13.6 12.4",
    "M12.4 8.2 C12.2 6.2 12.8 5 14.4 4.2"] },
  { name: "falling leaf", ink: [
    "M13.6 3.6 C17.3 6.7 19.3 10.4 18.4 13.6 C17.5 16.7 14.2 18.8 10.3 19.7 C8 15.8 6.5 11.3 8 8.3 C9.1 6.1 11.1 4.5 13.6 3.6 Z",
    "M10.3 19.7 C11.4 15.3 12.4 9.5 13.6 3.6",
    "M11 17 L14.2 16.2", "M11.8 13.4 L16 12.4", "M12.7 9.4 L15.7 9.2", "M11.4 15.2 L8.5 13.9",
    "M10.3 19.7 C9.6 21 8.3 21.6 6.8 21.3"] },
  { name: "bare twig", ink: [
    "M15.6 21.4 C13.4 16.8 11.6 11 11.2 3.4",
    "M12.6 15.4 C10.2 14.6 8.4 12.6 7.2 9.6",
    "M11.8 10.6 C13.4 9.2 15.6 8.4 18.2 8.2",
    "M11.3 6.4 C10.2 5.2 9.4 3.8 9 2.2",
    "M9.8 12.9 C8.6 12.6 7.6 11.9 6.9 10.8"] },
  { name: "fir sprig", ink: [
    "M12.7 21.4 C12 15.4 11.7 9.2 12.1 3.2",
    "M12.1 3.2 C11.2 4.4 10.6 5.8 10.4 7.4",
    "M12 7.2 L8.8 9.8", "M12 7.5 L15.2 9.4",
    "M11.9 11.6 L7.9 14.2", "M12 11.9 L16.1 13.9",
    "M12.3 16.2 L7.4 18.6", "M12.4 16.4 L16.8 18.2"] }
];

// The smudge under the mark: the same gesture as the gold swipe on the 13th,
// shrunk to the mark and given its own lopsided edges. Its colour is the
// season's, which is decoration and not information — the drawing is what says
// which month it is — so it does not need a colour-blind alternative the way
// the album-coloured hearts below do.
const MARK_WASH_D = "M3.4 8.6 C5.4 5.6 9 4.6 13.4 4.9 C18 5.2 20.6 7.4 20.4 11.6 C20.2 15.8 18.4 19 14.2 19.6 C9.4 20.3 5.2 19.2 3.6 16.2 C2.4 14 2.2 10.4 3.4 8.6 Z";
const MONTH_SEASON = ["winter", "winter", "spring", "spring", "spring", "summer",
                      "summer", "summer", "autumn", "autumn", "autumn", "winter"];
const SEASON_WASH = { spring: "#6f8f4a", summer: "#c8912a", autumn: "#b0603a", winter: "#5a7c94" };
const MARK_SCALE = 0.62;                // the 24-box drawn at ~15px, a shade under the cap height
const MARK_GAP = 8;                     // paper between the mark and the M of the month

// The mark goes to the LEFT of the month, and the two are centred TOGETHER: the
// title alone is anchored middle at x=125, which on SEPTEMBER — the longest
// month — would hang the mark three points off the left edge of a sheet that
// starts at 21. Nudging the title right by half the mark's block is also what
// the eye reads as centred, so it costs nothing to be correct here.
//
// The offset is measured from the title's real bounding box rather than a fixed
// x, because the month names are wildly different lengths and the serif face is
// whatever the machine has. That measurement is the one catch: the pad is a
// desktop-only prop inside a `display: none` layer on a narrow window (and off
// entirely on the bare desk density), and getBBox on unlaid-out text answers
// zero. So an unmeasurable pad gets no mark and waits — see watchForLayout.
function drawMonthMark(svg, title, m, seed) {
  title.removeAttribute("transform");
  const b = title.getBBox();
  if (!b.width) return false;
  const mark = MONTH_MARKS[m];
  const size = 24 * MARK_SCALE;
  const shift = (size + MARK_GAP) / 2;
  title.setAttribute("transform", `translate(${shift.toFixed(1)} 0)`);
  const g = el("g", { class: "cal-season", transform:
    `translate(${(b.x - MARK_GAP - size + shift).toFixed(1)} ${(b.y + b.height / 2 - size / 2).toFixed(1)}) scale(${MARK_SCALE})` });
  const inner = el("g", { transform: `rotate(${(-9 + jit(seed) * 18).toFixed(1)} 12 12)` });
  inner.appendChild(el("path", { d: MARK_WASH_D, class: "cal-wash",
    fill: SEASON_WASH[MONTH_SEASON[m]], opacity: 0.34 }));
  for (const d of mark.ink) {
    inner.appendChild(el("path", { d, fill: "none", stroke: "#55412a", "stroke-width": 1.3,
      "stroke-linecap": "round", "stroke-linejoin": "round" }));
  }
  g.appendChild(inner);
  title.parentNode.insertBefore(g, title);
  return true;
}

// A pad that could not be measured is one that is not on screen yet: too narrow
// a window, or the desk props switched off and switched back on. Rather than
// couple this module to the breakpoint or to the density setting, watch the pad
// itself and re-render the first time it really appears. Two ways in, because
// neither covers both routes on its own: the observer catches the props being
// switched back on, and the resize listener catches a widened window even on a
// tab that is not painting frames. Capped, so a pad that somehow stays
// unmeasurable cannot spin.
let layoutWatch = null, layoutTries = 0;
function stopLayoutWatch() {
  if (!layoutWatch) return;
  layoutWatch.io?.disconnect();
  window.removeEventListener("resize", layoutWatch.onResize);
  layoutWatch = null;
}
function watchForLayout(svg) {
  if (layoutWatch || layoutTries >= 3) return;
  layoutTries++;
  const retry = () => { stopLayoutWatch(); refresh(); };
  const io = typeof IntersectionObserver === "undefined" ? null
    : new IntersectionObserver((entries) => { if (entries.some((e) => e.isIntersecting)) retry(); });
  layoutWatch = { io, onResize: retry };
  window.addEventListener("resize", retry);
  io?.observe(svg);
}

// The days that matter, in the app's own milestone language: an album-coloured
// heart for a release (exactly what the milestone sticky shows on the day), and
// the game's gold star for her birthday, which no album colour should stand in
// for. A lyric day gets the same heart hollowed out — a quieter cousin of a
// real release, since the song only named the date, nothing shipped on it. A day carrying its
// own `mark` gets that object instead (August 1st gets a salt shaker).
function drawMark(g, mark, cx, cy, colors, s) {
  const x = (cx + MARK_DX).toFixed(1), y = (cy + MARK_DY).toFixed(1);
  const tilt = (-16 + jit(s) * 32).toFixed(1);
  if (mark.kind === "birthday") {
    g.appendChild(el("path", { d: STAR_D, class: "cal-star",
      transform: `translate(${x} ${y}) rotate(${tilt}) scale(0.4)` }));
    return;
  }
  const hollow = mark.kind === "lore";
  const color = (mark.album && colors[mark.album]) || "#8a7c62";
  // A day can ask for its own object instead of the heart (August 1st stamps a salt shaker).
  // Same 32x32 box and centring as the heart, so it takes the identical transform.
  if (mark.mark === "salt") {
    // Grouped so the cap seam shares the shaker's transform. The seam is drawn heavy (it
    // scales down to well under a pixel otherwise) — without it the silhouette reads as a jar.
    const shaker = el("g", {
      transform: `translate(${x} ${y}) rotate(${tilt}) scale(0.3) translate(-16 -16)`
    });
    shaker.appendChild(el("path", {
      d: SALT_SHAKER_D, fill: color, stroke: "rgba(0,0,0,0.28)", "stroke-width": 0.9,
      "stroke-linejoin": "round"
    }));
    shaker.appendChild(el("path", {
      d: SALT_CAP_D, fill: "none", stroke: "rgba(0,0,0,0.3)", "stroke-width": 2.4,
      "stroke-linecap": "round"
    }));
    g.appendChild(shaker);
    return;
  }
  g.appendChild(el("path", {
    d: HEART_D,
    fill: hollow ? "none" : color,
    stroke: hollow ? color : "rgba(0,0,0,0.28)",
    "stroke-width": hollow ? 3.2 : 0.9,
    "stroke-linejoin": "round",
    transform: `translate(${x} ${y}) rotate(${tilt}) scale(0.3) translate(-16 -16.4)`
  }));
}

// The red pen loop around today: a fast ellipse that overshoots past a full
// turn, plus a lighter echo pass slightly rotated — a pen going around twice.
function drawToday(g, cx, cy, s) {
  const rot = -8 + jit(s) * 15;
  const rx = 10.8 + jit(s + 2) * 1.2, ry = 8.3 + jit(s + 4) * 0.9;
  const d =
    `M${(cx + rx).toFixed(1)} ${(cy - 1.2).toFixed(1)}` +
    ` C${(cx + rx * 1.02).toFixed(1)} ${(cy - ry).toFixed(1)} ${(cx - rx * 1.04).toFixed(1)} ${(cy - ry * 1.06).toFixed(1)} ${(cx - rx).toFixed(1)} ${(cy - 0.6).toFixed(1)}` +
    ` C${(cx - rx * 0.97).toFixed(1)} ${(cy + ry).toFixed(1)} ${(cx + rx * 0.98).toFixed(1)} ${(cy + ry * 1.04).toFixed(1)} ${(cx + rx * 1.01).toFixed(1)} ${(cy - 0.4).toFixed(1)}` +
    ` C${(cx + rx * 1.02).toFixed(1)} ${(cy - ry * 0.55).toFixed(1)} ${(cx + rx * 0.5).toFixed(1)} ${(cy - ry * 0.98).toFixed(1)} ${(cx - rx * 0.35).toFixed(1)} ${(cy - ry * 0.92).toFixed(1)}`;
  g.appendChild(el("path", { d, transform: `rotate(${rot.toFixed(1)} ${cx} ${cy})` }));
  g.appendChild(el("path", { d, class: "echo", transform: `rotate(${(rot + 2.5).toFixed(1)} ${cx} ${cy}) translate(0.5 0.6)` }));
}

export function render(now) {
  if (!svg) return;
  const title   = svg.querySelector(".cal-title");
  const week    = svg.querySelector(".cal-week");
  const marks   = svg.querySelector(".cal-marks");
  const days    = svg.querySelector(".cal-days");
  const strikes = svg.querySelector(".cal-strikes");
  const hl      = svg.querySelector(".cal-hl");
  const today   = svg.querySelector(".cal-today");
  [week, marks, days, strikes, hl, today].forEach(clear);

  const y = now.getFullYear(), m = now.getMonth(), D = now.getDate();
  const seed = y * 384 + m * 31;
  const colors = loadSettings().colorBlindAlbums ? CB_ALBUM_COLORS : ALBUM_COLORS;

  title.textContent = MONTHS[m].toUpperCase();
  title.appendChild(el("tspan", { class: "cal-year", dx: "6" }, String(y)));
  // the month's own mark, left of the title. Not one of the cleared groups
  // above: it lives beside the title rather than in a layer of its own.
  svg.querySelectorAll(".cal-season").forEach((n) => n.remove());
  if (drawMonthMark(svg, title, m, seed + 41)) stopLayoutWatch();
  else watchForLayout(svg);

  for (let c = 0; c < 7; c++) {
    week.appendChild(el("text", {
      x: colX(c), y: WEEK_Y, "text-anchor": "middle",
      class: (c === 0 || c === 6) ? "wknd" : null
    }, DOW[c]));
  }

  const firstDay = new Date(y, m, 1).getDay();     // 0 = Sunday
  const daysIn = new Date(y, m + 1, 0).getDate();
  for (let d = 1; d <= daysIn; d++) {
    const idx = firstDay + d - 1;
    const c = idx % 7, cx = colX(c), cy = rowY(Math.floor(idx / 7));

    if (d === 13) {
      const tilt = (-3.5 + (jit(seed + 99) - 0.5) * 3).toFixed(1);
      hl.appendChild(el("line", {
        x1: (cx - 8.4).toFixed(1), y1: (cy + 1).toFixed(1),
        x2: (cx + 8.4).toFixed(1), y2: (cy - 1.4).toFixed(1),
        transform: `rotate(${tilt} ${cx} ${cy})`
      }));
    }
    const mark = DAY_MARK.get(mdKey(m, d));
    if (mark) drawMark(marks, mark, cx, cy, colors, seed + d * 7);
    days.appendChild(el("text", {
      x: cx, y: (cy + NUM_DY).toFixed(1), "text-anchor": "middle",
      class: (c === 0 || c === 6) ? "wknd" : null
    }, String(d)));
    if (d < D) strikes.appendChild(strike(cx, cy, seed + d));
    if (d === D) drawToday(today, cx, cy, seed + 200 + d);
  }
}

// What day the pad is open to. The app's dev date override (window.__devDate,
// "YYYY-MM-DD", session-only — a reload goes live again) wins, so scrubbing the
// date in the dev panel scrubs the calendar with it.
function currentDate() {
  const dev = typeof window !== "undefined" && window.__devDate;
  if (dev && /^\d{4}-\d{2}-\d{2}$/.test(dev)) {
    const [y, m, d] = dev.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date();
}
export const refresh = () => render(currentDate());

// Re-render just after the next local midnight, then every following
// midnight, so a page left open overnight advances the marks.
function scheduleMidnight() {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 5);
  setTimeout(() => { refresh(); scheduleMidnight(); }, next - now);
}

if (svg) {
  refresh();
  scheduleMidnight();
  // Dev hook in the spirit of the snowfall toggle. `refresh` is what app.js's
  // date override calls; `render` still takes a Date for console poking, e.g.
  // deskCalendar.render(new Date(2026, 11, 13)) for her birthday.
  window.deskCalendar = { render, refresh };
}
