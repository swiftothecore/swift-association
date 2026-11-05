// The print on the desk (skill: desk-print). Two things that hold no state of their own, so that
// app.js can keep everything stored: the daily deck, and the crushed sheet's drawing.

import { mulberry32, dailySeed } from "./util.js";
import { SHEET } from "./crumple.js";

/* ---------- The daily deck ----------
   Which print comes out today. The rule the whole thing answers to: two notebooks holding the
   same set of prints always show the same one on the same date, with nothing stored and nothing
   online, so this is a pure function of the date and the SET. The ids are sorted before they are
   used, which is what makes the order they were earned in, and the order of POLAROIDS, irrelevant.

   It deals, rather than rolls. A fresh roll each day is the honest meaning of "random" and it is
   worse in every way a player can see: with five prints the same one comes back the next morning
   one day in five, and a print can go missing for sixty-eight days. So each lap of the set is a
   fresh shuffle dealt out one a day, and every print gets exactly the same number of days.

   A plain reshuffle can hand back the print that closed the last lap, so the first third of a lap
   may not hold anything from the last third of the lap before. The swaps that enforce that only
   touch a lap's front and middle, so a lap's tail is always its raw shuffle, and the rule never
   has to look further back than one lap: there is no chain, and any day can be worked out alone.
   Twenty years of this, over 120 random sets of each size: never back to back, shortest gap 2, 4
   and 9 days for 5, 11 and 24 prints, longest wait 9, 21 and 47. */
const seedOf = (text) => mulberry32(dailySeed(text))() * 4294967296 | 0;
function dealtLap(ids, seed) {
  const lap = ids.slice(), roll = mulberry32(seed);
  for (let i = lap.length - 1; i > 0; i--) {
    const j = Math.floor(roll() * (i + 1));
    [lap[i], lap[j]] = [lap[j], lap[i]];
  }
  return lap;
}
export function dealPrint(owned, dateKey) {
  if (!owned.length) return null;
  const ids = owned.slice().sort(), n = ids.length, set = ids.join(",");
  const day = Math.floor(Date.UTC(+dateKey.slice(0, 4), +dateKey.slice(5, 7) - 1, +dateKey.slice(8, 10)) / 864e5);
  const lap = Math.floor(day / n), hold = Math.floor(n / 3);
  const hand = dealtLap(ids, seedOf(`desk|${set}|${lap}`));
  const tail = new Set(dealtLap(ids, seedOf(`desk|${set}|${lap - 1}`)).slice(n - hold));
  for (let i = 0; i < hold; i++) {
    if (!tail.has(hand[i])) continue;
    for (let j = hold; j < n - hold; j++) if (!tail.has(hand[j])) { [hand[i], hand[j]] = [hand[j], hand[i]]; break; }
  }
  return hand[((day % n) + n) % n];
}

/* ---------- The sheet ----------
   js/crumple.js is a real sheet with a polaroid's proportions, crushed in a simulation, and every
   keyframe of that crush. Run backwards it is the print opening, and every facet is a flat piece of
   the same print, which is what no hand-placed drawing could do. A ball of paper never moves by
   itself, so nothing here wiggles it: the only motion is t, which runs crushed (0) to flat (1). */
const unpack = (text) => {
  const bytes = Uint8Array.from(atob(text), (c) => c.charCodeAt(0));
  return new Int16Array(bytes.buffer);
};
const clamp01 = (v) => Math.max(0, Math.min(1, v));
export const smooth = (v) => v * v * (3 - 2 * v);
const qmat = ([w, x, y, z]) => [
  1 - 2 * (y * y + z * z), 2 * (x * y - w * z), 2 * (x * z + w * y),
  2 * (x * y + w * z), 1 - 2 * (x * x + z * z), 2 * (y * z - w * x),
  2 * (x * z - w * y), 2 * (y * z + w * x), 1 - 2 * (x * x + y * y),
];
function slerp(a, b, t) {
  let d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3], c = b;
  if (d < 0) { d = -d; c = b.map((v) => -v); }
  if (d > 0.9995) { const m = a.map((v, i) => v + (c[i] - v) * t), l = Math.hypot(...m); return m.map((v) => v / l); }
  const th = Math.acos(d), s = Math.sin(th), p = Math.sin((1 - t) * th) / s, q = Math.sin(t * th) / s;
  return a.map((v, i) => v * p + c[i] * q);
}

let unpacked = null;
function sheet() {
  if (unpacked) return unpacked;
  const { W, H, B, PH, q } = SHEET;
  const raw = unpack(SHEET.pts), pts = [];
  for (let i = 0; i < raw.length; i += 2) pts.push([raw[i] / 50, raw[i + 1] / 50]);
  const rawT = new Uint16Array(unpack(SHEET.tris).buffer), tris = [];
  for (let i = 0; i < rawT.length; i += 3) tris.push([rawT[i], rawT[i + 1], rawT[i + 2]]);
  const keys = SHEET.keys.map((k) => Float64Array.from(unpack(k), (v) => v / 50));
  const last = keys[keys.length - 1];
  const normal = ([a, b, c]) => {
    const ux = last[b * 3] - last[a * 3], uy = last[b * 3 + 1] - last[a * 3 + 1], uz = last[b * 3 + 2] - last[a * 3 + 2];
    const vx = last[c * 3] - last[a * 3], vy = last[c * 3 + 1] - last[a * 3 + 1], vz = last[c * 3 + 2] - last[a * 3 + 2];
    const n = [uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx], l = Math.hypot(...n) || 1;
    return n.map((v) => v / l);
  };
  const film = (t) => {
    const u = (pts[t[0]][0] + pts[t[1]][0] + pts[t[2]][0]) / 3, v = (pts[t[0]][1] + pts[t[1]][1] + pts[t[2]][1]) / 3;
    return u > B && u < B + PH && v > B && v < B + PH;
  };
  // Where a crease crosses the film the emulsion splits and the white shows through, the one mark
  // a crushed PHOTOGRAPH has that crushed paper does not. Kept per facet, so a split paints in
  // depth order with the film it sits on.
  const edges = new Map();
  tris.forEach((t, id) => {
    for (let k = 0; k < 3; k++) {
      const a = t[k], b = t[(k + 1) % 3], key = a < b ? a + "," + b : b + "," + a;
      (edges.get(key) || edges.set(key, []).get(key)).push(id);
    }
  });
  const cracks = tris.map(() => []), lines = [];
  for (const [key, list] of edges) {
    if (list.length !== 2) continue;
    const na = normal(tris[list[0]]), nb = normal(tris[list[1]]);
    const cos = na[0] * nb[0] + na[1] * nb[1] + na[2] * nb[2];
    const [u, v] = key.split(",").map(Number);
    if (cos < 0.55) lines.push({ u, v, s: Math.min(1, (0.55 - cos) / 0.9) });
    if (cos > 0.8 || !film(tris[list[0]]) || !film(tris[list[1]])) continue;
    const crack = { u, v, s: Math.min(1, (0.8 - cos) / 0.6), a: list[0], b: list[1] };
    cracks[list[0]].push(crack); cracks[list[1]].push(crack);
  }
  // How far the crushed lump reaches under its chosen view, which fixes its size on the desk.
  const R = qmat(q), n = last.length / 3;
  let mx = 0, my = 0, mz = 0, ext = 1;
  for (let v = 0; v < n; v++) { mx += last[v * 3]; my += last[v * 3 + 1]; mz += last[v * 3 + 2]; }
  mx /= n; my /= n; mz /= n;
  for (let v = 0; v < n; v++) {
    const a = last[v * 3] - mx, b = last[v * 3 + 1] - my, c = last[v * 3 + 2] - mz;
    ext = Math.max(ext, Math.abs(R[0] * a + R[1] * b + R[2] * c), Math.abs(R[3] * a + R[4] * b + R[5] * c));
  }
  unpacked = { W, H, B, PH, q, pts, tris, keys, cracks, lines, ext, last, normal };
  return unpacked;
}

// The sheet's own face on a canvas: the real print, its caption and however much of the grey-green
// film is still over it. Every facet on the desk is a clipped piece of this, which is how the ball
// can be the actual photo and open into the real print with nothing swapped. The drain of colour
// is a composite rather than canvas `filter`, which Safari does not have.
const PX = 6;   // canvas pixels per millimetre of print
const images = new Map();
function printImage(art) {
  if (!images.has(art)) images.set(art, new Promise((done, fail) => {
    const img = new Image();
    img.onload = () => done(img);
    img.onerror = fail;
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(art.replace("<svg ", '<svg width="520" height="520" '));
  }));
  return images.get(art);
}
async function faceTexture({ art, name, sub, level }) {
  const m = sheet(), c = document.createElement("canvas");
  c.width = m.W * PX; c.height = m.H * PX;
  const x = c.getContext("2d"), B = m.B * PX, P = m.PH * PX;
  x.fillStyle = "#f7f2e5"; x.fillRect(0, 0, c.width, c.height);
  x.fillStyle = "#0c0a07"; x.fillRect(B, B, P, P);
  if (art && level > 0) {
    x.drawImage(await printImage(art), B, B, P, P);
    if (level < 1) {
      x.globalCompositeOperation = "saturation";
      x.globalAlpha = 1 - level * level;
      x.fillStyle = "#808080"; x.fillRect(B, B, P, P);
      x.globalCompositeOperation = "source-over";
    }
  }
  x.globalAlpha = Math.pow(1 - level, 1.3);
  x.fillStyle = "#56625b"; x.fillRect(B, B, P, P);
  x.globalAlpha = 1;
  x.strokeStyle = "#cfc6b0"; x.lineWidth = 1.5; x.strokeRect(B, B, P, P);
  if (art && level > 0) {
    const mid = c.width / 2, lip = (m.B + m.PH) * PX;
    try { await document.fonts.load(`600 ${5.4 * PX}px Caveat`); } catch (e) { /* the fallback hand will do */ }
    x.textAlign = "center"; x.globalAlpha = Math.min(1, level * 1.6);
    x.fillStyle = "#403a2e"; x.font = `600 ${5.4 * PX}px Caveat, cursive`;
    x.fillText(name, mid, lip + 10.5 * PX, c.width - 8 * PX);
    if (sub) { x.fillStyle = "#8b8272"; x.font = `500 ${3.9 * PX}px Caveat, cursive`; x.fillText(sub, mid, lip + 16 * PX, c.width - 8 * PX); }
    x.globalAlpha = 1;
  }
  return c;
}

// One frame of the sheet.
function paintFrame(g, m, tex, { t, spin, cx, cy, scale }) {
  const K = m.keys.length - 1, pos = (1 - t) * K, i = Math.min(K - 1, Math.floor(pos)), f = pos - i;
  const A = m.keys[i], B = m.keys[i + 1], n = A.length / 3;
  const R = qmat(slerp(m.q, [1, 0, 0, 0], smooth(t)));
  const P = new Float64Array(n * 3);
  let mx = 0, my = 0, mz = 0;
  for (let v = 0; v < n * 3; v++) {
    const x = A[v] + (B[v] - A[v]) * f;
    P[v] = x;
    if (v % 3 === 0) mx += x; else if (v % 3 === 1) my += x; else mz += x;
  }
  mx /= n; my /= n; mz /= n;
  for (let v = 0; v < n; v++) {
    const a = P[v * 3] - mx, b = P[v * 3 + 1] - my, c = P[v * 3 + 2] - mz;
    P[v * 3] = R[0] * a + R[1] * b + R[2] * c;
    P[v * 3 + 1] = R[3] * a + R[4] * b + R[5] * c;
    P[v * 3 + 2] = R[6] * a + R[7] * b + R[8] * c;
  }
  let zmin = 1e9, zmax = -1e9;
  for (let v = 0; v < n; v++) { zmin = Math.min(zmin, P[v * 3 + 2]); zmax = Math.max(zmax, P[v * 3 + 2]); }
  const range = zmax - zmin, deep = clamp01((range - 3) / 14);
  const cs = Math.cos(spin), sn = Math.sin(spin);
  const X = new Float64Array(n), Y = new Float64Array(n);
  for (let v = 0; v < n; v++) {
    X[v] = (P[v * 3] * cs - P[v * 3 + 1] * sn) * scale + cx;
    Y[v] = (P[v * 3] * sn + P[v * 3 + 1] * cs) * scale + cy;
  }
  const order = m.tris.map((tr, id) => ({ tr, id, z: (P[tr[0] * 3 + 2] + P[tr[1] * 3 + 2] + P[tr[2] * 3 + 2]) / 3 }));
  order.sort((a, b) => a.z - b.z);
  const painted = new Uint8Array(m.tris.length), fw = scale * 0.32;
  for (const { tr, id, z } of order) {
    const [a, b, c] = tr;
    const ux = P[b * 3] - P[a * 3], uy = P[b * 3 + 1] - P[a * 3 + 1], uz = P[b * 3 + 2] - P[a * 3 + 2];
    const vx = P[c * 3] - P[a * 3], vy = P[c * 3 + 1] - P[a * 3 + 1], vz = P[c * 3 + 2] - P[a * 3 + 2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const l = Math.hypot(nx, ny, nz) || 1; nx /= l; ny /= l; nz /= l;
    const front = nz >= 0;
    if (!front) { nx = -nx; ny = -ny; nz = -nz; }
    const diff = Math.max(0, nx * -0.46 + ny * -0.58 + nz * 0.67);
    const pit = 1 + deep * (0.72 + 0.3 * (z - zmin) / (range || 1) - 1);
    const light = (0.6 + 0.56 * diff) * pit;
    const x0 = X[a], y0 = Y[a], x1 = X[b], y1 = Y[b], x2 = X[c], y2 = Y[c];
    // Each facet is grown a hair so neighbours overlap: two clipped edges that only meet leave a
    // hairline of whatever is underneath.
    const mx3 = (x0 + x1 + x2) / 3, my3 = (y0 + y1 + y2) / 3;
    const path = () => {
      g.beginPath();
      g.moveTo(mx3 + (x0 - mx3) * 1.1, my3 + (y0 - my3) * 1.1);
      g.lineTo(mx3 + (x1 - mx3) * 1.1, my3 + (y1 - my3) * 1.1);
      g.lineTo(mx3 + (x2 - mx3) * 1.1, my3 + (y2 - my3) * 1.1);
      g.closePath();
    };
    if (!front) {
      // The back of a real print is black plastic, and it is half of what says "not paper".
      const s = Math.min(1.03, light);
      g.fillStyle = `rgb(${Math.round(62 * s)},${Math.round(57 * s)},${Math.round(52 * s)})`;
      path(); g.fill();
    } else {
      const u0 = m.pts[a][0] * PX, v0 = m.pts[a][1] * PX, u1 = m.pts[b][0] * PX, v1 = m.pts[b][1] * PX, u2 = m.pts[c][0] * PX, v2 = m.pts[c][1] * PX;
      const det = (u1 - u0) * (v2 - v0) - (u2 - u0) * (v1 - v0);
      if (Math.abs(det) > 1e-6) {
        const aa = ((x1 - x0) * (v2 - v0) - (x2 - x0) * (v1 - v0)) / det, cc = ((x2 - x0) * (u1 - u0) - (x1 - x0) * (u2 - u0)) / det;
        const bb = ((y1 - y0) * (v2 - v0) - (y2 - y0) * (v1 - v0)) / det, dd = ((y2 - y0) * (u1 - u0) - (y1 - y0) * (u2 - u0)) / det;
        g.save();
        path(); g.clip();
        g.transform(aa, bb, cc, dd, x0 - aa * u0 - cc * v0, y0 - bb * u0 - dd * v0);
        g.drawImage(tex, 0, 0);
        g.restore();
      }
      if (light < 0.995) { g.fillStyle = `rgba(34,24,14,${(1 - light).toFixed(3)})`; path(); g.fill(); }
      else if (light > 1.005) { g.fillStyle = `rgba(255,252,240,${Math.min(0.8, light - 1).toFixed(3)})`; path(); g.fill(); }
    }
    painted[id] = 1;
    const u = (m.pts[a][0] + m.pts[b][0] + m.pts[c][0]) / 3, v = (m.pts[a][1] + m.pts[b][1] + m.pts[c][1]) / 3;
    if (!front || u <= m.B || u >= m.B + m.PH || v <= m.B || v >= m.B + m.PH) continue;
    for (const k of m.cracks[id]) {
      if (!painted[k.a === id ? k.b : k.a]) continue;
      g.strokeStyle = `rgba(243,238,226,${(0.42 + 0.5 * k.s).toFixed(2)})`;
      g.lineWidth = Math.max(0.5, fw * (0.3 + 0.5 * k.s));
      g.beginPath(); g.moveTo(X[k.u], Y[k.u]); g.lineTo(X[k.v], Y[k.v]); g.stroke();
    }
  }
}

// What a crush leaves on a print smoothed flat, in the print's own units, laid over the real
// keepsake for the one day it is out with its creases still in it.
export function creaseSvg() {
  const m = sheet(), flat = (v) => `${m.pts[v][0].toFixed(1)} ${m.pts[v][1].toFixed(1)}`, rows = [];
  for (const t of m.tris) {
    const n = m.normal(t), lit = n[0] * -0.46 + n[1] * -0.58 + n[2] * 0.67, a = Math.min(0.13, Math.abs(lit) * 0.1);
    if (a >= 0.02) rows.push(`<path d="M${t.map(flat).join("L")}Z" fill="${lit > 0 ? "#fff" : "#2c241a"}" fill-opacity="${a.toFixed(3)}"/>`);
  }
  for (const { u, v, s } of m.lines) {
    rows.push(`<path d="M${flat(u)}L${flat(v)}" stroke="#fbf7ec" stroke-opacity="${(0.28 + 0.5 * s).toFixed(2)}" stroke-width="${(0.2 + 0.3 * s).toFixed(2)}" fill="none" stroke-linecap="round"/>`);
  }
  return `<svg viewBox="0 0 ${m.W} ${m.H}" preserveAspectRatio="none" aria-hidden="true">${rows.join("")}</svg>`;
}

/* The canvas the sheet lives on. It keeps t and where the ball and the print sit, and app.js only
   ever says what to show. place() is measured off the real elements, so the sheet lands on the
   print's own pixels and the handover at the end of the opening cannot jump. */
export function sheetStage(canvas) {
  const g = canvas.getContext("2d"), m = sheet();
  let tex = null, t = 0, from = null, to = null, run = 0;
  const paint = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h || !tex || !from) return;
    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== Math.round(w * dpr)) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); }
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    const p = smooth(clamp01((t - 0.03) / 0.97));
    paintFrame(g, m, tex, {
      t, spin: (5 * Math.PI / 180) * p,
      cx: from.x + (to.x - from.x) * p, cy: from.y + (to.y - from.y) * p, scale: from.scale + (to.scale - from.scale) * p,
    });
  };
  return {
    get t() { return t; },
    async face(print) { tex = await faceTexture(print); paint(); },
    place(ballRect, printRect, printWidth) {
      const c = canvas.getBoundingClientRect();
      from = { x: ballRect.left + ballRect.width / 2 - c.left, y: ballRect.top + ballRect.height / 2 - c.top, scale: 74 / m.ext };
      to = { x: printRect.left + printRect.width / 2 - c.left, y: printRect.top + printRect.height / 2 - c.top, scale: printWidth / m.W };
      paint();
    },
    pose(v) { run++; t = v; paint(); },
    // Resolves true if it reached the end, false if something took over first.
    glide(target, ms, ease) {
      return new Promise((done) => {
        const id = ++run, start = t, t0 = performance.now();
        const tick = (now) => {
          if (id !== run) return done(false);
          const p = Math.min(1, (now - t0) / ms);
          t = start + (target - start) * ease(p);
          paint();
          if (p < 1) requestAnimationFrame(tick); else done(true);
        };
        requestAnimationFrame(tick);
      });
    },
    clear() { run++; t = 0; g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, canvas.width, canvas.height); },
  };
}

/* ---------- The door hanger ----------
   What hangs on the peg of the print that is out on the desk, both sides of it. The clock is the
   wide mantel clock from the user's own sketch, a hundred units wide and fifty-four tall, its two
   shoulders drawn separately because a mirrored pair reads as a stamp. It stands at seven minutes
   to midnight: that is the moment the desk's print changes, so this side is telling the truth. */
const INK = "#2b2722";
const CX = 50, CY = 24.7;

const polar = (deg, r) => {
  const a = (deg * Math.PI) / 180;
  return [CX + Math.sin(a) * r, CY - Math.cos(a) * r];
};
const f1 = (v) => v.toFixed(2);

// A hand as a leaf: widest a third of the way out, a short tail behind the pin.
function hand(deg, len, wide, tail) {
  const at = (r, side) => {
    const [x, y] = polar(deg, r), n = ((deg + 90) * Math.PI) / 180;
    return [x + Math.sin(n) * side, y - Math.cos(n) * side];
  };
  const [tx, ty] = at(len, 0), [lx, ly] = at(len * 0.34, wide), [rx, ry] = at(len * 0.34, -wide), [bx, by] = at(-tail, 0);
  return `<path d="M${f1(bx)} ${f1(by)} L${f1(lx)} ${f1(ly)} L${f1(tx)} ${f1(ty)} L${f1(rx)} ${f1(ry)} Z" fill="${INK}" stroke="${INK}" stroke-width=".25" stroke-linejoin="round"/>`;
}

function batons() {
  let out = "";
  for (let i = 0; i < 12; i++) {
    const deg = i * 30, quarter = i % 3 === 0;
    const [x0, y0] = polar(deg, quarter ? 13.2 : 14.6), [x1, y1] = polar(deg, 17.3);
    out += `<path d="M${f1(x0)} ${f1(y0)} L${f1(x1)} ${f1(y1)}" stroke="${INK}" stroke-width="${quarter ? 1.9 : 0.95}" stroke-linecap="butt"/>`;
  }
  return out;
}

function mantel() {
  const c = { body: "#7d4029", lit: "#a9633f", deep: "#572a1a", foot: "#4a2315", line: "#e4c48f" };
  return `
  <path d="M1.2 47.4 C1 46.5 1.6 45.9 2.6 45.9 L97.6 45.6 C98.6 45.6 99.1 46.2 99 47.1 L98.8 51.4 C98.7 52.5 98.1 53 97 53.1 C70 53.7 30 53.8 3 53.3 C1.9 53.2 1.3 52.7 1.2 51.7 Z" fill="${c.foot}" stroke="${INK}" stroke-width="1"/>
  <path d="M2.4 48.1 C30 47.7 70 47.6 97.8 47.8" fill="none" stroke="${c.lit}" stroke-width=".7" stroke-linecap="round"/>
  <path d="M4.2 46.4 L4.3 40.6 C4.6 32.4 12 26.2 22.4 24 C26.8 23.1 30.6 22.8 34 22.8 L66 21.6 C72.2 21.8 79.4 23.2 85.8 26.2 C92.4 29.4 96.2 34.6 96.4 41 L96.4 46.2 Z" fill="${c.body}" stroke="${INK}" stroke-width="1.1" stroke-linejoin="round"/>
  <path d="M5 46 L5.1 42.6 C14 43.8 26 44.2 38 44.2 L64 44 C74 43.9 86 43.4 95.6 42.2 L95.6 45.8 Z" fill="${c.deep}"/>
  <path d="M6.6 38.2 C8.4 32 14.4 27.6 23 25.8 C26.8 25 29.6 24.8 31.6 24.8" fill="none" stroke="${c.lit}" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M70 24 C75.4 24.6 80.6 26 85 28.2" fill="none" stroke="${c.lit}" stroke-width="1.1" stroke-linecap="round"/>
  <path d="M8.6 43 C8.4 35.2 15 30 24 28.2 C26.4 27.7 28 27.5 29.4 27.4" fill="none" stroke="${c.line}" stroke-width=".65" stroke-linecap="round"/>
  <path d="M71.8 26.8 C78 27.6 84 30 88.2 34 C91 36.8 92.2 39.8 92.2 42.8" fill="none" stroke="${c.line}" stroke-width=".65" stroke-linecap="round"/>
  <path d="M12 41.4 C13.6 37.6 17.4 34.8 22.6 33.4 M14.6 42.2 C16.4 39.8 19.2 38.2 23 37.2 M77.8 34 C81.6 35.6 84.4 38.2 85.8 41.8 M78.8 38.4 C80.6 39.4 81.8 40.8 82.6 42.4" fill="none" stroke="${c.deep}" stroke-width=".55" stroke-linecap="round"/>
  <path d="M50.4 0.5 C64.2 0.3 75 11.2 75 24.6 C75 38.4 64 49.4 50.2 49.5 C36.2 49.6 25.2 38.6 25.2 24.8 C25.2 11.2 36.4 0.7 50.4 0.5 Z" fill="#d9b563" stroke="${INK}" stroke-width="1.1"/>
  <path d="M33.2 7 C37.6 3.6 44 1.9 50.2 2 M27 21 C27.4 18.2 28.2 15.6 29.4 13.2" fill="none" stroke="#f4e3ad" stroke-width="1" stroke-linecap="round"/>
  <path d="M66.8 42.6 C62.4 46 56.6 47.9 50.2 47.9 C47.8 47.9 45.6 47.6 43.4 47" fill="none" stroke="#a9863f" stroke-width="1.1" stroke-linecap="round"/>
  <circle cx="${CX}" cy="${CY}" r="21.2" fill="#fbf4e2" stroke="#8c6c30" stroke-width=".9"/>
  <path d="M31.4 17.6 C33.8 11 39.4 6.6 46.4 5.4 C39.6 7.6 34.8 11.6 32.6 18.4 Z" fill="#8c6c30" fill-opacity=".28"/>
  ${batons()}
  <circle cx="42.4" cy="33.4" r="1.1" fill="#fbf4e2" stroke="#8c6c30" stroke-width=".6"/>
  <circle cx="57.8" cy="33.4" r="1.1" fill="#fbf4e2" stroke="#8c6c30" stroke-width=".6"/>
  ${hand(357, 10.6, 1.45, 2.4)}
  ${hand(318, 16.6, 1.05, 3.2)}
  <circle cx="${CX}" cy="${CY}" r="1.55" fill="#d9b563" stroke="${INK}" stroke-width=".7"/>`;
}


const HANGER_D = "M15 7 C33 4.4 88 4.6 105 6.6 C108.6 7 110.4 9 110.4 12.6 L112 202 C112 206.4 109.6 208.8 105.2 209 C80 210.4 38 210.6 15.4 209.6 C11 209.4 8.6 207 8.6 202.6 L9.4 12.8 C9.4 9.4 11.4 7.4 15 7 Z M60 26 C47 26 37 36 37 49 C37 62 47 72 60 72 C73 72 83.4 62 83.4 49 C83.4 36 73 26 60 26 Z";
export function deskHangerSVG(kept) {
  const edge = `stroke="#2b2722" stroke-width="1.3" stroke-linejoin="round"`;
  if (kept) {
    return `<svg viewBox="0 0 120 214" aria-hidden="true"><path fill-rule="evenodd" fill="#a8322e" ${edge} d="${HANGER_D}"/>` +
      `<path d="M20 88 L100 87.4 M20 196 L100 195.4" fill="none" stroke="#f3dcc0" stroke-opacity=".65" stroke-linecap="round"/>` +
      `<text class="kh-type" x="60" y="110" font-size="12.5" letter-spacing="3" fill="#fbf1dc">DO NOT</text>` +
      `<text class="kh-hand" x="60" y="144" font-size="34" fill="#fbf1dc">disturb</text>` +
      `<text class="kh-type" x="60" y="170" font-size="9.5" fill="#f3dcc0">staying on</text>` +
      `<text class="kh-type" x="60" y="183" font-size="9.5" fill="#f3dcc0">the desk</text></svg>`;
  }
  return `<svg viewBox="0 0 120 214" aria-hidden="true"><path fill-rule="evenodd" fill="#f2e6cc" ${edge} d="${HANGER_D}"/>` +
    `<path d="M20 88 L100 87.4 M20 196 L100 195.4" fill="none" stroke="#a8322e" stroke-opacity=".5" stroke-linecap="round"/>` +
    `<text class="kh-hand" x="60" y="106" font-size="23" fill="#a8322e">back</text>` +
    `<text class="kh-hand" x="60" y="125.5" font-size="23" fill="#a8322e">tomorrow</text>` +
    `<g transform="translate(13.6 139.6) scale(.93)">${mantel()}</g></svg>`;
}
