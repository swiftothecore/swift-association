/* Form 13, the Custom mode Change page: the pieces of the printed form, pure and state-free.
   app.js owns the store, the render and the wiring (renderCustomModalBody); this file only
   draws. Its stock is in styles.css under FORM 13, every class `fm-` prefixed.

   One rule holds the whole sheet together: PRINT is exact and PEN is not. Everything the
   printer put down (boxes, captions, combs, tally cells, the stopwatch face, the bubbles and
   heart outlines) is regular and in Custom's brick rust. Everything the player put down is blue
   ballpoint and seeded uneven, so a mark is drawn the same way on every render but never the
   same way as its neighbour: the digits in a comb, the tally, the watch hand and its hatching,
   a tick, a clerk's Z through a box that doesn't apply, and the fill in a bubble or a heart,
   which comes from the notebook's own hand (js/penfill.js). */
import { escapeHtml } from "./util.js";
import { rng, penFill, LOZENGE, HEART } from "./penfill.js";

const f1 = (n) => n.toFixed(1);
const jit = (seed) => { const r = rng(seed); return (a) => (r() - 0.5) * a; };

// One ballpoint tick, overshooting its box upward the way a quick tick does.
export function penTick(seed) {
  const j = jit(seed);
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path stroke-width="${f1(2.1 + j(0.5))}" d="M${f1(4 + j(1))} ${f1(13.5 + j(1.4))} Q${f1(7 + j(1))} ${f1(16 + j(1))} ${f1(9.2 + j(0.8))} ${f1(20 + j(0.8))} Q${f1(14 + j(1.5))} ${f1(10 + j(2))} ${f1(22.5 + j(1.4))} ${f1(1.5 + j(1.4))}"/></svg>`;
}

// A lemniscate in one stroke, the right loop a touch bigger, never closing exactly where it began.
function penInfinity(seed) {
  const j = jit(seed), pts = [];
  for (let i = 0; i <= 40; i++) {
    const t = (i / 40) * Math.PI * 2 + 0.25, d = 1 + Math.sin(t) ** 2;
    const big = Math.cos(t) > 0 ? 1.12 : 1;
    pts.push([20 + (11 * big * Math.cos(t)) / d + j(0.5), 11 + (9 * big * Math.sin(t) * Math.cos(t)) / d + j(0.5) - i * 0.02]);
  }
  pts.push([pts[1][0] + 1.6, pts[1][1] - 1.2]);
  let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
  for (let i = 1; i < pts.length - 1; i += 2) d += ` Q${f1(pts[i][0])} ${f1(pts[i][1])} ${f1(pts[i + 1][0])} ${f1(pts[i + 1][1])}`;
  return `<svg viewBox="0 0 40 22" width="40" height="22" style="transform:rotate(${f1(j(6))}deg)"><path d="${d}" stroke-width="${f1(2 + j(0.3))}"/></svg>`;
}

/* A comb: the printed baseline with a tooth between every pair of cells, one digit written to a
   cell, right-aligned the way a figure is. A transparent input lies over it, so the comb is
   also where an exact number past the drawn range is typed (app.js redraws the digits live). */
export const COMB_CELL = 21;
export function combDigits(s, cells, seed) {
  const j = jit(seed + ":" + s);
  return String(s).split("").map((ch, i) =>
    `<span class="fm-dg" style="left:${(cells - s.length + i) * COMB_CELL}px;transform:translate(${f1(j(2.4))}px,${f1(j(2.4))}px) rotate(${f1(j(7))}deg)">${escapeHtml(ch)}</span>`).join("");
}
export function comb(key, value, cells, { min, max, label, inf = false, seed }) {
  const W = cells * COMB_CELL;
  let teeth = `M0 29.5 H${W}`;
  for (let i = 0; i <= cells; i++) teeth += ` M${i * COMB_CELL} 29.5 V${i === 0 || i === cells ? 19 : 22}`;
  const s = String(value ?? "");
  const digits = inf ? `<span class="fm-dg fm-dg--inf" aria-hidden="true">${penInfinity(seed)}</span>` : combDigits(s, cells, seed);
  return `<span class="fm-comb" style="--n:${cells}" data-fm-comb="${key}"><svg class="fm-teeth" viewBox="0 0 ${W} 30" preserveAspectRatio="none" aria-hidden="true"><path d="${teeth}"/></svg>${digits}` +
    `<input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="${String(max).length}" data-fm-num="${key}" data-min="${min}" data-max="${max}" data-cells="${cells}" data-seed="${seed}" ` +
    `value="${inf ? "" : escapeHtml(s)}" aria-label="${label}" data-fm-focus="num:${key}" autocomplete="off" data-1p-ignore data-lpignore="true" data-form-type="other"></span>`;
}

/* The tally strip: printed cells of five, numbered at their ends; the strokes are the pen's.
   A hand keeps its lean for a whole gate and loses its rhythm inside one: each gate sits a
   little off its cell, strokes vary in height, and the bar's slope wanders. A count past the
   strip's end is written after it as +N; an empty strip that doesn't apply (endless pages,
   unlimited hints) gets one quick line through it. */
const CELL = 36, SLOT = [7.5, 13.5, 19.5, 25.5], GATE = 30;
const cellsFor = (cap) => Math.ceil(cap / 5);
const cellWidth = (cap, k) => (k < cellsFor(cap) - 1 || cap % 5 === 0 ? CELL : 2 + (cap % 5) * 6 + 5.5);
const slotX = (cap, c) => { const k = Math.floor((c - 1) / 5), s = (c - 1) % 5; return k * CELL + (s < 4 ? SLOT[s] : GATE); };
export function tally(key, n, cap, { min, label, off = false, over = 0, seed, text }) {
  const nCells = cellsFor(cap);
  let width = 0, cells = "", nums = "";
  for (let k = 0; k < nCells; k++) {
    const w = cellWidth(cap, k);
    cells += `<rect class="fm-cell" x="${width + 0.5}" y="0.5" width="${w}" height="31"/>`;
    nums += `<text class="fm-tnum" x="${f1(width + w - 0.5)}" y="41.5">${Math.min((k + 1) * 5, cap)}</text>`;
    width += w;
  }
  const j = jit(seed);
  let pen = "";
  const gate = Array.from({ length: nCells }, () => ({ dx: j(2.2), lean: 1.3 + j(1.2), dy: j(2) }));
  for (let c = 1; c <= n; c++) {
    const k = Math.floor((c - 1) / 5), s = (c - 1) % 5, g = gate[k], x0 = k * CELL + g.dx;
    const sw = f1(1.7 + j(0.6));
    if (s < 4) {
      const x = x0 + SLOT[s] + j(1.1), top = 4.2 + g.dy + j(3), bot = 27.4 + j(2.8), lean = g.lean + j(0.7);
      pen += `<path class="fm-pen" stroke-width="${sw}" d="M${f1(x + lean)} ${f1(top)} Q${f1(x + lean * 0.35 + j(0.8))} ${f1((top + bot) / 2)} ${f1(x - lean * 0.2)} ${f1(bot)}"/>`;
    } else {
      const y0 = 22.5 + j(4), y1 = 8 + j(4);
      pen += `<path class="fm-pen" stroke-width="${sw}" d="M${f1(x0 + 2.5 + j(1.6))} ${f1(y0)} Q${f1(x0 + 17 + j(2))} ${f1((y0 + y1) / 2 + j(2.4))} ${f1(x0 + 33 + j(1.8))} ${f1(y1)}"/>`;
    }
  }
  if (off && n === 0) {
    const y0 = 17 + j(3), y1 = 14 + j(3);
    pen += `<path class="fm-pen fm-void-line" stroke-width="1.6" d="M${f1(-3 + j(2))} ${f1(y0)} Q${f1(width / 2)} ${f1((y0 + y1) / 2 + j(3))} ${f1(width + 3 + j(2))} ${f1(y1)}"/>`;
  }
  const full = width + 2 + (over ? 34 : 0);
  const overTxt = over > 0 ? `<text class="fm-over" x="${width + 6}" y="23">+${over}</text>` : "";
  return `<span class="fm-tally${off ? " off" : ""}" data-fm-tally="${key}" data-cap="${cap}" data-min="${min}" role="slider" tabindex="0" data-fm-focus="tally:${key}" ` +
    `aria-label="${label}" aria-valuemin="${min}" aria-valuemax="${cap}" aria-valuenow="${n}" aria-valuetext="${text}" data-w="${full}" style="width:${full}px">` +
    `<svg viewBox="0 0 ${full} 44" width="${full}" height="44" aria-hidden="true">${cells}${nums}${pen}${overTxt}</svg></span>`;
}
// The count a pointer at clientX means on a tally: the stroke nearest it (or none, before the first).
export function tallyCountAt(el, clientX) {
  const cap = Number(el.dataset.cap), min = Number(el.dataset.min);
  // The strip can be drawn smaller than its own units when its box is narrow (see .fm-tally).
  const r = el.getBoundingClientRect();
  const x = (clientX - r.left) * (r.width ? Number(el.dataset.w) / r.width : 1);
  let best = min, bestD = min === 0 ? Math.abs(x - 1) : Infinity;
  for (let c = Math.max(1, min); c <= cap; c++) { const d = Math.abs(slotX(cap, c) - x); if (d < bestD) { bestD = d; best = c; } }
  return best;
}

/* The stopwatch. The face is printed: bow, crown, pusher, two rings, sixty ticks, a numeral
   every ten. The pen draws the hand to the value and hatches the elapsed wedge, unevenly, with
   a ragged edge, stopping round the numerals the way you'd hatch round a number. The hub is
   printed, so it sits over the hatching and under the hand. */
const WC = { x: 59, y: 71 }, WR = 43, WVB = { w: 118, h: 130 };
export function watch(sec, seed) {
  const pol = (deg, r) => { const a = (deg - 90) * Math.PI / 180; return [WC.x + Math.cos(a) * r, WC.y + Math.sin(a) * r]; };
  let print = "";
  print += `<ellipse class="pr" stroke-width="1.5" cx="${WC.x}" cy="9.5" rx="7.5" ry="5.5"/>`;
  print += `<rect class="pr" stroke-width="1.4" x="${WC.x - 6.5}" y="15" width="13" height="7" rx="1.2"/>`;
  print += `<path class="pr" stroke-width="1" d="M${WC.x - 3.8} 16.5 V20.5 M${WC.x - 1.3} 16.5 V20.5 M${WC.x + 1.3} 16.5 V20.5 M${WC.x + 3.8} 16.5 V20.5"/>`;
  print += `<rect class="pr" stroke-width="1.4" x="${WC.x - 2.6}" y="22" width="5.2" height="4.6"/>`;
  const [px, py] = pol(42, WR + 8);
  print += `<rect class="pr" stroke-width="1.3" x="${f1(px - 3)}" y="${f1(py - 4.5)}" width="6" height="9" rx="1" transform="rotate(42 ${f1(px)} ${f1(py)})"/>`;
  print += `<circle class="pr face" stroke-width="1.8" cx="${WC.x}" cy="${WC.y}" r="${WR + 5}"/>`;
  print += `<circle class="pr" stroke-width=".8" cx="${WC.x}" cy="${WC.y}" r="${WR + 1.6}"/>`;
  for (let i = 0; i < 60; i++) {
    const big = i % 5 === 0, [x1, y1] = pol(i * 6, WR - (big ? 6.5 : 3)), [x2, y2] = pol(i * 6, WR);
    print += `<line class="pr" stroke-width="${big ? 1.4 : 0.7}" x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}"/>`;
  }
  for (let v = 10; v <= 60; v += 10) { const [x, y] = pol(v * 6, WR - 14); print += `<text class="num" x="${f1(x)}" y="${f1(y + 2.9)}">${v}</text>`; }
  print += `<text class="lbl" x="${WC.x}" y="${WC.y + 17}">SEC</text>`;

  const j = jit(seed + ":" + sec);
  const s = Math.min(sec, 60);
  let wedgePen = "", handPen = "";
  if (s > 0) {
    const R0 = WR - 1.2, pts = [[WC.x + j(0.6), WC.y + j(0.6)]];
    for (let i = 1; i <= 6; i++) { const [x, y] = pol(j(1.2), (R0 * i) / 6); pts.push([x + j(0.9), y]); }
    const steps = Math.max(4, Math.round(s / 2));
    for (let i = 1; i <= steps; i++) { const [x, y] = pol((s * 6 * i) / steps, R0 + j(1.6)); pts.push([x, y]); }
    for (let i = 5; i >= 1; i--) { const [x, y] = pol(s * 6 + j(1.2), (R0 * i) / 6); pts.push([x + j(0.8), y + j(0.8)]); }
    const region = s >= 60
      ? `<circle cx="${WC.x}" cy="${WC.y}" r="${f1(R0)}" fill="#fff"/>`
      : `<path fill="#fff" d="M${pts.map((p) => f1(p[0]) + " " + f1(p[1])).join(" L")} Z"/>`;
    let holes = "";
    for (let v = 10; v <= 60; v += 10) {
      if (v > s + 4 && v !== 60) continue;
      const [x, y] = pol(v * 6, WR - 14);
      holes += `<rect x="${f1(x - 6.8)}" y="${f1(y - 4.6)}" width="13.6" height="9.6" rx="3" fill="#000"/>`;
    }
    let hatch = "";
    for (let t = -WR * 1.6; t < WR * 1.6; t += 3.3 + j(1)) {
      const a = 0.66 + j(0.08), len = WR * 1.5;
      const cx = WC.x + t * Math.cos(a + Math.PI / 2), cy = WC.y + t * Math.sin(a + Math.PI / 2);
      hatch += `M${f1(cx - Math.cos(a) * len)} ${f1(cy - Math.sin(a) * len + j(1))} L${f1(cx + Math.cos(a) * len)} ${f1(cy + Math.sin(a) * len + j(1))} `;
    }
    const mid = "fmw" + Math.random().toString(36).slice(2, 7);
    wedgePen = `<mask id="${mid}" maskUnits="userSpaceOnUse" x="0" y="0" width="${WVB.w}" height="${WVB.h}">${region}${holes}</mask>` +
      `<path class="pen hatch" mask="url(#${mid})" stroke-width=".85" d="${hatch}"/>`;
    const [hx, hy] = pol(s * 6 + j(1.2), WR - 4);
    const [mx, my] = pol(s * 6 + 4 + j(2), (WR - 4) / 2);
    handPen = `<path class="pen" stroke-width="${f1(2.3 + j(0.3))}" d="M${f1(WC.x + j(0.6))} ${f1(WC.y + j(0.6))} Q${f1(mx)} ${f1(my)} ${f1(hx)} ${f1(hy)}"/>`;
    const [ax, ay] = pol(s * 6 - 7 + j(2), WR - 10), [bx, by] = pol(s * 6 + 5 + j(2), WR - 9);
    handPen += `<path class="pen" stroke-width="1.6" d="M${f1(ax)} ${f1(ay)} L${f1(hx)} ${f1(hy)} L${f1(bx)} ${f1(by)}"/>`;
  }
  const hub = `<circle class="pr-fill" cx="${WC.x}" cy="${WC.y}" r="2.8"/>`;
  return `<svg viewBox="0 0 ${WVB.w} ${WVB.h}" aria-hidden="true">${print}${wedgePen}${hub}${handPen}</svg>`;
}
/* The seconds a pointer at (x, y) means on the watch. A hand dragged past the top stays at 60
   rather than wrapping round to no clock, and one dragged back past the top stays at 0. */
export function watchSecondsAt(el, clientX, clientY, cur) {
  const r = el.getBoundingClientRect();
  const cx = r.left + r.width * (WC.x / WVB.w), cy = r.top + r.height * (WC.y / WVB.h);
  let a = Math.atan2(clientY - cy, clientX - cx) + Math.PI / 2;
  if (a < 0) a += Math.PI * 2;
  const v = Math.round((a / (Math.PI * 2)) * 60) % 60, c = Math.min(cur, 60);
  if (v === 0) return c > 30 ? 60 : 0;
  if (c >= 55 && v < 10) return 60;
  if (c > 0 && c <= 5 && v > 50) return 0;
  return v;
}

// A printed bubble or heart; a chosen bubble, or a heart for a life, is filled in by the hand.
export function bubble(on, hand, seed) {
  return `<svg viewBox="${LOZENGE.viewBox}" aria-hidden="true"><path class="fm-lz" d="${LOZENGE.shape}"/>${on ? penFill(LOZENGE.shape, LOZENGE.box, hand, seed) : ""}</svg>`;
}
export function heart(on, hand, seed) {
  return `<svg viewBox="${HEART.viewBox}" aria-hidden="true"><path class="fm-hz" d="${HEART.shape}"/>${on ? penFill(HEART.shape, HEART.box, hand, seed) : ""}</svg>`;
}

// The clerk's Z through a box that doesn't apply: along the top, back down, along the bottom.
// The value stays readable under it, because it is still stored.
export function zOut(note, seed) {
  const j = jit(seed);
  const d = `M${f1(2 + j(2))} ${f1(4 + j(3))} L${f1(96 + j(2))} ${f1(3 + j(3))} L${f1(5 + j(3))} ${f1(93 + j(3))} L${f1(70 + j(4))} ${f1(95 + j(2))}`;
  return `<div class="fm-z" aria-hidden="true"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${d}" stroke-width="1.7" vector-effect="non-scaling-stroke"/></svg><span>${note}</span></div>`;
}

// A box's caption: its number reversed out of a block, its name, and how to fill it in.
export const cap = (n, name, how) => `<div class="fm-cap">${n !== "" ? `<i>${n}</i>` : ""}${name}${how ? `<em>${how}</em>` : ""}</div>`;
export const tickBox = (k, label, on) =>
  `<button type="button" class="fm-tick" data-fm-tick="${k}" data-fm-focus="tick:${k}" aria-pressed="${on}"><span class="bx">${on ? penTick(k) : ""}</span>${label}</button>`;
// A printed strip of options sharing their rules, one bubble each.
export const strip = (k, opts, cur, hand, cls = "") => `<div class="fm-strip ${cls}" role="group">` + opts.map(([v, label, fine]) => {
  const on = String(v) === String(cur), val = escapeHtml(String(v));
  return `<button type="button" class="fm-o" data-fm-circle="${k}" data-val="${val}" data-fm-focus="o:${k}:${val}" aria-pressed="${on}">` +
    `<span class="fm-ol"><span class="fm-mk">${bubble(on, hand, k + ":" + v)}</span><b>${label}</b></span>${fine ? `<small>${fine}</small>` : ""}</button>`;
}).join("") + `</div>`;
