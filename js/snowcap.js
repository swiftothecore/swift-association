"use strict";

/* Swift to the Song Association - the snow that settles on the desk in December.
 *
 * Every edge that faces up holds snow, a little more each day of the month: a few grains on the
 * flattest edges on the 1st, caps that have joined up by the middle of the month, deep lumpy
 * drifts by the 31st. It all comes off on the 1st of January. The lumps are seeded by item and
 * position, never by day, so each day's pile grows out of the one before instead of re-dealing.
 *
 * WHAT HOLDS IT. The desk props, the bead discs, the wordmark's letters, the front page's top
 * edge, the corner buttons, and the print once the ball has been opened. Never the crushed
 * ball (anything that landed on it went when it was crushed), the wordmark's underline, or the
 * page you play on.
 *
 * COST. This is the whole of what runs: one box read per item, a few hundred path segments
 * painted into small detached canvases, and one batch of inserts. A few milliseconds, and only
 * when something changes (the date, the setting, the theme, a resize, the front page coming
 * back, the ball opening). Nothing runs on any frame, there are no timers and no listeners.
 * The three passes (read every box, paint off the page, write in one go) are deliberate: one
 * write between two reads makes the browser lay this whole page out again, and that is what
 * once made it cost a second.
 *
 * OUTLINES. The props' outlines are traced offline from their painted pixels and live in
 * js/snowlines.js, relative to each prop's box; the props are fixed drawings at fixed turns
 * that only ever scale, so the points hold at any size. Retrace them when a prop's drawing
 * changes: scripts/art/snow/ (board.html?bake, then write-lines.py). The beads are not
 * traced, because their letters and on some days their count change, so each disc is placed
 * from its own box. The print and the buttons are plain shapes worked out from their boxes.
 *
 * STACKING. Each item's snow is its own canvas, inserted straight after the item so it stacks
 * with it: a prop half under the notebook keeps its snow under the notebook too.
 */

import { SNOW_LINES } from "./snowlines.js";

const BAKED = [".di-glasses", ".di-calendar", ".di-mug", ".di-floss", ".di-cassette"];
// how deep the snow is on each kind of thing by the 31st, in page pixels
const DEPTH = { ".di-glasses": 12, ".di-calendar": 13, ".di-mug": 13, ".di-floss": 13, ".di-cassette": 13,
  wordmark: 6.5, print: 11, card: 15, bead: 4.5, button: 6 };

function rng(seed) {
  let h = 2166136261;
  for (const c of String(seed)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h = (h + 0x6D2B79F5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const LATTICES = new Map();   // the lumps never change, so a re-lay keeps them
function noise1(seed) {
  let lat = LATTICES.get(seed);
  if (!lat) { const r = rng(seed); lat = Float32Array.from({ length: 2048 }, r); LATTICES.set(seed, lat); }
  return (x) => {
    const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
    const a = lat[((i % 2048) + 2048) % 2048], b = lat[(((i + 1) % 2048) + 2048) % 2048];
    return a + (b - a) * u;
  };
}
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

// How much snow the month has laid down: a dusting on the 1st, all of it by the 31st. A little
// front-loaded so the first week visibly changes day to day.
export function snowSeason(day) {
  if (day < 1) return 0;
  return clamp(0.07 + 0.93 * Math.pow((day - 1) / 30, 0.85), 0, 1);
}

/* ---------- outlines, in page pixels ---------- */

// The upper edge of a rounded box: the front page's top, a round or pill button.
function roundedTop(r, rad, step) {
  rad = Math.min(rad, r.width / 2, r.height / 2);
  const pts = [];
  for (let x = r.left; x <= r.right; x += step) {
    const e = Math.min(x - r.left, r.right - x);
    pts.push([x, r.top + (e < rad ? rad - Math.sqrt(Math.max(0, rad * rad - (rad - e) ** 2)) : 0)]);
  }
  return pts;
}
// The upper edge of an element's own box under its own CSS turn (the opened print).
function turnedTop(el, cs, step) {
  const BR = el.getBoundingClientRect();
  const M = cs.transform === "none" ? new DOMMatrix() : new DOMMatrix(cs.transform);
  const [ox, oy] = cs.transformOrigin.split(" ").map(parseFloat);
  const T = new DOMMatrix().translate(ox, oy).multiply(M).translate(-ox, -oy);
  const w = el.offsetWidth, h = el.offsetHeight;
  const c = [[0, 0], [w, 0], [w, h], [0, h]].map(([x, y]) => T.transformPoint({ x, y }));
  const mx = Math.min(...c.map((p) => p.x)), my = Math.min(...c.map((p) => p.y));
  const P = c.map((p) => [BR.left + p.x - mx, BR.top + p.y - my]);
  const pts = [];
  for (let x = BR.left; x <= BR.right; x += step) {
    let top = null;
    for (let i = 0; i < 4; i++) {
      const a = P[i], b = P[(i + 1) % 4];
      if (x < Math.min(a[0], b[0]) || x > Math.max(a[0], b[0]) || a[0] === b[0]) continue;
      const y = a[1] + ((x - a[0]) / (b[0] - a[0])) * (b[1] - a[1]);
      if (top == null || y < top) top = y;
    }
    pts.push([x, top]);
  }
  return pts;
}

function outlines(doc, lines) {
  const out = [];
  const fromLines = (name, el, pts, depth, extra) => {
    const r = el.getBoundingClientRect();
    if (!r.width || !pts) return;
    const step = Math.max(0.5, (pts[1][0] - pts[0][0]) * r.width);
    out.push({ name, el, depth, step, ...extra, pts: pts.map(([fx, fy]) => [r.left + fx * r.width, fy == null ? null : r.top + fy * r.height]) });
  };
  for (const sel of BAKED) { const el = doc.querySelector(sel); if (el) fromLines(sel, el, lines[sel], DEPTH[sel]); }
  // The lettering was traced on one line, about 7.4 times as wide as it is tall. If the
  // wordmark ever wraps or reflows its letters no longer sit where the outline says, so it
  // goes bare rather than wearing snow in the wrong places.
  const h1 = doc.querySelector("header.title h1"), hr = h1?.getBoundingClientRect();
  if (hr?.height && Math.abs(hr.width / hr.height / 7.4 - 1) < 0.12) fromLines("wordmark", h1, lines.wordmark, DEPTH.wordmark, { text: true });
  // the bead discs, each the top half of its own box
  doc.querySelectorAll('.di-beads-r use[href="#bdDisc"]').forEach((u, i) => {
    const r = u.getBoundingClientRect();
    if (!r.width) return;
    const rx = r.width / 2, ry = r.height / 2, cx = r.left + rx, cy = r.top + ry, pts = [];
    for (let x = r.left; x <= r.right; x += 1) { const k = (x - cx) / rx; pts.push([x, cy - ry * Math.sqrt(Math.max(0, 1 - k * k))]); }
    out.push({ name: "bead" + i, el: u, depth: DEPTH.bead, step: 1, pts });
  });
  // the print, once the ball has opened
  const print = doc.getElementById("deskPrint");
  if (doc.body.dataset.deskPrint === "out" && print?.firstElementChild && print.offsetWidth) {
    out.push({ name: "print", el: print, depth: DEPTH.print, step: 2, pts: turnedTop(print, getComputedStyle(print), 2) });
  }
  // the front page's top edge (its canvas is hidden by CSS whenever another page is up)
  const start = doc.getElementById("screen-start");
  if (start?.classList.contains("active")) {
    const r = start.getBoundingClientRect();
    if (r.width) out.push({ name: "card", el: start, depth: DEPTH.card, step: 2, pts: roundedTop(r, parseFloat(getComputedStyle(start).borderTopLeftRadius) || 0, 2) });
  }
  for (const el of doc.querySelectorAll("#settingsGear, #soundGear, #keepsakesGear, #weatherGear, .corner-link")) {
    const r = el.getBoundingClientRect();
    if (r.width) out.push({ name: "btn-" + (el.id || out.length), el, depth: DEPTH.button, step: 1, pts: roundedTop(r, parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0, 1) });
  }
  return out;
}

/* ---------- the caps ---------- */

// One outline -> the patches of snow that sit on it today.
function caps(outline, g) {
  const { pts, depth, name, text } = outline, step = outline.step || 2;
  const N1 = noise1(name + ":lump"), N2 = noise1(name + ":fine"), NC = noise1(name + ":cover");
  const D = depth * (0.15 + 0.85 * g);
  // runs of connected edge: a sheer drop ends a run, since snow does not cling to a cliff
  const runs = [];
  let run = [];
  for (const p of pts) {
    const q = run[run.length - 1];
    if (p[1] == null || (q && Math.abs(p[1] - q[1]) > step * 2.2)) { if (run.length > 2) runs.push(run); run = p[1] == null ? [] : [p]; continue; }
    run.push(p);
  }
  if (run.length > 2) runs.push(run);

  const out = [];
  // On the 1st only the luckiest flat spots hold grains; by mid-month it has joined up.
  const cover = clamp((g - 0.04) / 0.5, 0, 1), thr = 1 - cover;
  for (let r of runs) {
    // a median of three takes the antialias stair out of the edge
    r = r.map((p, i) => [p[0], [r[Math.max(0, i - 1)][1], p[1], r[Math.min(r.length - 1, i + 1)][1]].sort((a, b) => a - b)[1]]);
    const n = r.length;
    // steep edges shed it
    const hold = r.map((p, i) => {
      const a = r[Math.max(0, i - 2)], b = r[Math.min(n - 1, i + 2)];
      return clamp(1 - (Math.abs((b[1] - a[1]) / Math.max(1, b[0] - a[0])) - 0.3) / 0.9, 0, 1);
    });
    // and it bridges small bumps
    const H2 = hold.map((_, i) => { let s = 0, w = 0; for (let k = -3; k <= 3; k++) { const j = i + k; if (j < 0 || j >= n) continue; const ww = 4 - Math.abs(k); s += hold[j] * ww; w += ww; } return s / w; });
    const runLen = r[n - 1][0] - r[0][0];
    let d = r.map(([x], i) => {
      const c = NC(x / 22) * 0.75 + N2(x / 6 + 40) * 0.25;
      const m = cover >= 1 ? 1 : smooth(thr - 0.09, thr + 0.09, c * (0.55 + 0.45 * H2[i]) + (cover > 0.85 ? 0.3 : 0));
      const lump = 0.62 + 0.55 * N1(x / (text ? 7 : 16)) + 0.18 * N2(x / 3.5);
      const e = Math.min(x - r[0][0], r[n - 1][0] - x);   // ends round off rather than stop dead
      return D * H2[i] * m * lump * smooth(-D * 0.35, Math.min(D * (text ? 0.7 : 1.5), runLen / 2), e);
    });
    d = d.map((_, i) => { let s = 0, w = 0; for (let k = -2; k <= 2; k++) { const j = i + k; if (j < 0 || j >= n) continue; const ww = 3 - Math.abs(k); s += d[j] * ww; w += ww; } return s / w; });
    // Snow levels itself: the crown of a pile is rounder and flatter than what it sits on, so
    // the top line is smoothed wider than the outline and the depth read back from it. Without
    // this every rounded letter wears a pointed hat.
    const top = r.map((p, i) => p[1] - d[i]);
    const R = Math.max(2, Math.round((D * (text ? 0.9 : 1.2)) / step));
    const topS = top.map((_, i) => {
      let s = 0, w = 0;
      for (let k = -R; k <= R; k++) { const j = i + k; if (j < 0 || j >= n || d[j] < 0.2) continue; const ww = R + 1 - Math.abs(k); s += top[j] * ww; w += ww; }
      return w ? s / w : top[i];
    });
    d = d.map((v, i) => (v < 0.2 ? v : clamp(r[i][1] - topS[i], v * 0.55, v * 1.5)));
    let seg = [];
    for (let i = 0; i < n; i++) {
      if (d[i] > 0.35) seg.push({ x: r[i][0], y: r[i][1], d: d[i] });
      else if (seg.length) { if (seg.length > 1 || seg[0].d > 0.8) out.push(seg); seg = []; }
    }
    if (seg.length) out.push(seg);
  }
  return out;
}

function capPath(ctx, seg) {
  const a = seg[0], b = seg[seg.length - 1];
  ctx.beginPath();
  ctx.moveTo(a.x - Math.min(a.d * 0.5, 2), a.y + 0.9);
  for (const s of seg) ctx.lineTo(s.x, s.y + 0.9);
  ctx.quadraticCurveTo(b.x + Math.min(b.d * 0.7, 3), b.y, b.x, b.y - b.d);   // a rounded lip past each end
  for (let i = seg.length - 1; i > 0; i--) {
    const p = seg[i], q = seg[i - 1];
    ctx.quadraticCurveTo(p.x, p.y - p.d, (p.x + q.x) / 2, (p.y - p.d + q.y - q.d) / 2);
  }
  ctx.lineTo(a.x, a.y - a.d);
  ctx.quadraticCurveTo(a.x - Math.min(a.d * 0.7, 3), a.y, a.x - Math.min(a.d * 0.5, 2), a.y + 0.9);
  ctx.closePath();
}

/* ---------- laying it ---------- */

// Where one item's canvas goes. READ ONLY: nothing is written to the page here.
function slotFor(o) {
  // a bead lives inside an SVG, so its snow goes beside the whole strand
  const anchor = o.el instanceof SVGElement ? o.el.closest(".desk-item") : o.el;
  if (!anchor) return null;
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const seg of o.segs) for (const p of seg) {
    if (p.x < minX) minX = p.x; if (p.x > maxX) maxX = p.x;
    if (p.y - p.d < minY) minY = p.y - p.d; if (p.y > maxY) maxY = p.y;
  }
  if (minX === Infinity) return null;
  const box = { left: Math.floor(minX - 4), top: Math.floor(minY - 4), right: Math.ceil(maxX + 4), bottom: Math.ceil(maxY + 4) };
  const acs = getComputedStyle(anchor), fixed = acs.position === "fixed";
  // the canvas is a positioned sibling, so it is placed against the anchor's containing block
  let off = { x: 0, y: 0 };
  if (!fixed) {
    const op = anchor.offsetParent;
    if (!op || (op === document.body && getComputedStyle(op).position === "static")) off = { x: -scrollX, y: -scrollY };
    else { const r = op.getBoundingClientRect(); off = { x: r.left + op.clientLeft - op.scrollLeft, y: r.top + op.clientTop - op.scrollTop }; }
  }
  return { anchor, box, css: `position:${fixed ? "fixed" : "absolute"};pointer-events:none;left:${box.left - off.x}px;top:${box.top - off.y}px;width:${box.right - box.left}px;height:${box.bottom - box.top}px;${acs.zIndex !== "auto" ? `z-index:${acs.zIndex};` : ""}` };
}

export function clearSnowCaps(doc = document) {
  doc.querySelectorAll("canvas.snowcap").forEach((c) => c.remove());
}

// Lay the snow for `day` of December (0 clears it). `settle` names items whose snow drifts in
// rather than already being there: the print, the moment the ball opens. Returns what each
// pass cost, which the dev panel and the board print.
export function laySnowCaps(day, { settle = [], lines = SNOW_LINES, doc = document } = {}) {
  const now = () => performance.now(), t0 = now();
  const g = snowSeason(day);
  const night = doc.documentElement.getAttribute("data-theme") === "dark";
  // at night it is moonlit snow, not paper-white: a step down and a shade cooler
  const SNOW = night ? "#d6dde6" : "#f8fafc", SHADE = night ? "rgba(110,124,145," : "rgba(150,168,192,";
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  // 1. read
  const jobs = [];
  if (g) {
    const all = outlines(doc, lines);
    const beads = all.filter((o) => o.name.startsWith("bead"));
    const groups = all.filter((o) => !o.name.startsWith("bead")).map((o) => [o]);
    if (beads.length) groups.push(beads);   // the beads share one canvas beside their strand
    for (const group of groups) {
      const merged = { ...group[0], name: group.length > 1 ? "beads" : group[0].name, segs: group.flatMap((o) => caps(o, g)) };
      const slot = slotFor(merged);
      if (slot) jobs.push({ name: merged.name, segs: merged.segs, ...slot });
    }
  }
  const t1 = now();

  // 2. paint, off the page
  for (const j of jobs) {
    const cv = doc.createElement("canvas");
    cv.className = "snowcap";
    cv.dataset.snowFor = j.name;
    cv.setAttribute("aria-hidden", "true");
    cv.style.cssText = j.css;
    cv.width = Math.ceil((j.box.right - j.box.left) * dpr); cv.height = Math.ceil((j.box.bottom - j.box.top) * dpr);
    const ctx = cv.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, -j.box.left * dpr, -j.box.top * dpr);
    for (const seg of j.segs) {
      // lifted a hair off what it sits on: its own shape a pixel lower in shadow (a plain
      // offset fill, because a canvas shadowBlur is the slow part of a canvas)
      ctx.save(); ctx.translate(0.3, 1.1); capPath(ctx, seg);
      ctx.fillStyle = "rgba(40,52,70,0.22)"; ctx.fill(); ctx.restore();
      capPath(ctx, seg);
      ctx.fillStyle = SNOW; ctx.fill();
      // the underside in cool shade, the crown edged
      ctx.save(); capPath(ctx, seg); ctx.clip();
      const deep = seg.reduce((m, s) => Math.max(m, s.d), 0);
      for (const [wd, a] of [[Math.min(6, deep * 0.8), 0.22], [Math.min(3, deep * 0.4), 0.3]]) {
        ctx.strokeStyle = SHADE + a + ")"; ctx.lineWidth = Math.max(1, wd);
        ctx.beginPath(); seg.forEach((s, i) => (i ? ctx.lineTo(s.x, s.y + 1) : ctx.moveTo(s.x, s.y + 1))); ctx.stroke();
      }
      ctx.restore();
      ctx.strokeStyle = "rgba(112,128,150,0.32)"; ctx.lineWidth = 0.6;
      ctx.beginPath(); seg.forEach((s, i) => (i ? ctx.lineTo(s.x, s.y - s.d) : ctx.moveTo(s.x, s.y - s.d))); ctx.stroke();
    }
    j.cv = cv;
  }
  const t2 = now();

  // 3. write, all at once
  clearSnowCaps(doc);
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  for (const j of jobs) {
    j.anchor.after(j.cv);
    // A timed animation rather than a style flip on the next frame, so it finishes on the clock
    // even in a tab nobody is looking at and can never be left stuck invisible.
    if (settle.includes(j.name) && !still) j.cv.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 2600, delay: 500, easing: "ease-in", fill: "backwards" });
  }
  return { read: t1 - t0, paint: t2 - t1, write: now() - t2, canvases: jobs.length };
}
