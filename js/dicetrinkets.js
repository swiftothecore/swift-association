// The drawn extra the dice stamp beside Start writing wears on each studio album's release day
// (and on its Taylor's Version's, which shares the record's ink): one small object per record,
// the way her birthday has its candle and Christmas its holly in index.html. paintChanceDice
// (js/app.js) asks for the day's record and drops the drawing into the stamp; styles.css, THE DICE
// PICK UP THE DAY, has the rules and the reasoning. Designed on scripts/ui/chance-album-trinkets.html,
// which draws from this module, as does the close-up renderer beside it.
//
// The objects are DRAWN AS THINGS, not typed as polygons: the snake, scarf, ivy, quill and plumes
// are bodies laid round a curved spine with a width that changes along it (tube), so they taper,
// bend and hang. Each is placed where the real thing would be: resting on a die, hanging off it
// under gravity, tucked behind it, or growing at its foot. Each is built only when asked for, so
// the 364 days without one pay nothing for it.
//
// Where a drawing goes (`at`), in the stamp's mark (24-unit box, overflow visible):
//   top       over everything, still while the dice are thrown
//   between   behind the front die, in front of the back one; the front die's knock hides it
//   behind    behind both dice; the back die gets a knock of its own to hide it
//   backrock  in the back die's rock, after its face: mark coords, rides the back die
//   frontrock in the front die's rock, after its face: mark coords, rides the front die
//   back      inside the back die's own -13deg tilt, like the candle: its top edge is y 2.4
// The free corners are top right (x 14..26, y -4..9) and bottom left (x -3..8, y 16..26).
// Back die corners: TL (0.8, 4) TR (12.8, 1.2) BR (15.6, 13.2) BL (3.6, 16).
// Front die corners: TL (10.8, 8) TR (23, 10.6) BR (20.4, 22.8) BL (8.3, 20.2).

const f = (n) => +(+n).toFixed(2);
const rng = (seed) => () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const pt = (p) => `${f(p[0])} ${f(p[1])}`;
const rot = ([x, y], a, [cx, cy] = [0, 0]) => { const c = Math.cos(a), s = Math.sin(a);
  return [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c]; };
const D = Math.PI / 180;

/* ---- curves ---- */
// Catmull-Rom through the points, as cubic commands with no leading M.
function cr(pts, closed = false) {
  const n = pts.length, at = (i) => closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))];
  let d = '';
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    d += `C${pt([p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6])} ${pt([p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6])} ${pt(p2)}`;
  }
  return d;
}
const smooth = (pts, closed = true) => `M${pt(pts[0])}${cr(pts, closed)}${closed ? 'Z' : ''}`;
const poly = (pts) => `M${pts.map(pt).join('L')}Z`;
// Points along a Catmull-Rom spine, evenly spaced by length, with their unit normals
// (the normal of a rightward stroke points down the page).
function walk(spine, n) {
  const fine = [];
  const m = spine.length, at = (i) => spine[Math.max(0, Math.min(m - 1, i))];
  for (let i = 0; i < m - 1; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    for (let k = i ? 1 : 0; k <= 40; k++) { const t = k / 40, u = 1 - t;
      fine.push([0, 1].map((j) => u * u * u * p1[j] + 3 * u * u * t * c1[j] + 3 * u * t * t * c2[j] + t * t * t * p2[j])); }
  }
  const L = [0];
  for (let i = 1; i < fine.length; i++) L.push(L[i - 1] + Math.hypot(fine[i][0] - fine[i - 1][0], fine[i][1] - fine[i - 1][1]));
  const out = []; let j = 0;
  for (let i = 0; i <= n; i++) {
    const target = L.at(-1) * i / n;
    while (j < L.length - 2 && L[j + 1] < target) j++;
    const t = (target - L[j]) / ((L[j + 1] - L[j]) || 1);
    out.push([fine[j][0] + (fine[j + 1][0] - fine[j][0]) * t, fine[j][1] + (fine[j + 1][1] - fine[j][1]) * t]);
  }
  const nm = out.map((p, i) => { const a = out[Math.max(0, i - 1)], b = out[Math.min(n, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [-dy / l, dx / l]; });
  return { p: out, nm, len: L.at(-1) };
}
// A filled body round a spine, `left(s)` wide on the normal side and `right(s)` on the other,
// s running 0..1 from the first spine point. Ends are cut straight across.
function tube(spine, left, right = left, n = 40) {
  const { p, nm } = walk(spine, n);
  const A = p.map((q, i) => [q[0] + nm[i][0] * left(i / n), q[1] + nm[i][1] * left(i / n)]);
  const B = p.map((q, i) => [q[0] - nm[i][0] * right(i / n), q[1] - nm[i][1] * right(i / n)]).reverse();
  return `M${pt(A[0])}${cr(A)}L${pt(B[0])}${cr(B)}Z`;
}
// A line running beside a spine at `off(s)`, between s0 and s1.
function beside(spine, off, s0 = 0, s1 = 1, n = 40) {
  const { p, nm } = walk(spine, n), o = typeof off === 'function' ? off : () => off;
  const pts = p.map((q, i) => [q[0] + nm[i][0] * o(i / n), q[1] + nm[i][1] * o(i / n)]).filter((_, i) => i / n >= s0 - 1e-9 && i / n <= s1 + 1e-9);
  return smooth(pts, false);
}
const at = (spine, s, n = 80) => { const w = walk(spine, n), i = Math.round(s * n); return { p: w.p[i], nm: w.nm[i] }; };

/* ---- marks ---- */
// tk: a filled shape outlined in the stamp's ink (or in `sc`). w is the outline weight, 0 for none.
// ln: an open stroke.
const tk = (d, fill, w = .5, extra = '', sc = '') =>
  `<path class="day-fill" style="--tf:${fill};--tw:${w}${sc ? `;--tc:${sc}` : ''}" d="${d}"${extra}/>`;
const ln = (d, stroke = 'currentColor', w = .4, extra = '') =>
  `<path class="day-line" style="--lc:${stroke};--lw:${w}" d="${d}"${extra}/>`;
const dot = (x, y, r, fill, w = 0) => `<circle class="day-fill" style="--tf:${fill};--tw:${w}" cx="${f(x)}" cy="${f(y)}" r="${f(r)}"/>`;
const g = (t, inner) => `<g transform="${t}">${inner}</g>`;
// A twinkle: four arms of their own lengths, pinched by concave sides, turned a little.
const twinkle = (x, y, up, side, turn = 0, fill = '#e2bd52', w = .3, pinch = .2) => {
  const arms = [[0, -up], [side, 0], [0, up * 1.12], [-side * .88, 0]];
  const k = Math.min(up, side) * pinch;
  const d = arms.map((a, i) => { const b = arms[(i + 1) % 4], mid = [Math.sign(a[0] + b[0]) * k, Math.sign(a[1] + b[1]) * k];
    return `${i ? '' : `M${pt(rot(a, turn * D))}`}Q${pt(rot(mid, turn * D))} ${pt(rot(b, turn * D))}`; }).join('') + 'Z';
  return tk(d, fill, w, ` transform="translate(${f(x)} ${f(y)})"`);
};

/* ===================== Taylor Swift: the guitar ===================== */
// A dreadnought leaning in behind the front die, its lower bout hidden by it. Local frame:
// the body runs y 3.6 (tail) to -3.8 (neck joint); the neck to -10.4; the headstock to -13.3.
const guitar = () => {
  const body = smooth([[0, 3.62], [1.85, 3.32], [2.95, 2.2], [3.06, .72], [2.52, -.55], [2.04, -1.38], [2.28, -2.32],
    [2.12, -3.18], [1.38, -3.66], [.48, -3.82], [-.55, -3.8], [-1.46, -3.62], [-2.2, -3.12], [-2.33, -2.26], [-2.02, -1.36],
    [-2.56, -.5], [-3.07, .78], [-2.92, 2.26], [-1.8, 3.34]]);
  const guard = smooth([[.74, -1.3], [1.32, -.98], [1.74, -.32], [1.72, .3], [1.27, .58], [.84, .36], [.68, -.32]]);
  const frets = [-4.35, -5.2, -5.98, -6.7, -7.36, -7.98, -8.55, -9.08].map((y) => `M${-.47 + (y + 3.6) * .012} ${y}L${.47 - (y + 3.6) * .012} ${y}`).join('');
  return g('translate(20.5 7.3) rotate(26) scale(.84)',
    tk(body, '#dcb06e', .6)
    + tk(guard, '#6e3b22', 0)
    + ln('M0 -.7A1.2 1.2 0 1 1 0 -3.1A1.2 1.2 0 1 1 0 -.7', '#9a764c', .22)
    + dot(0, -1.9, .86, '#33200f')
    + tk('M-1.3 1.62Q-1.36 2.12 -.82 2.1L.82 2.1Q1.36 2.12 1.3 1.62Q1.24 1.46 .92 1.5L-.92 1.5Q-1.24 1.46 -1.3 1.62Z', '#4a2c18', 0)
    + tk('M-.56 -3.15L-.45 -10.4L.45 -10.4L.56 -3.15Z', '#4b3020', .5)
    + ln(frets, '#b8a07c', .17)
    + tk('M-.45 -10.36C-.78 -11.2 -.92 -12.4 -.72 -13.02Q0 -13.48 .74 -12.96C.92 -12.3 .8 -11.2 .45 -10.36Z', '#3e2618', .5)
    + [-11.25, -11.95, -12.62].map((y) => dot(-1.02, y, .22, '#d8cdb5', .15) + dot(1.04, y + .04, .22, '#d8cdb5', .15)).join('')
    + ln('M-.29 1.72L-.21 -10.38M.01 1.72L0 -10.38M.3 1.72L.21 -10.38', '#efe3c8', .12)
    + ln('M-.45 -10.4L.45 -10.4', '#efe3c8', .26));
};

/* ===================== Fearless: glitter coming off ===================== */
// Thrown off the dice into both empty corners: two twinkles and a spray of flakes, densest
// against the dice and thinning outwards, every flake its own size, tone and turn.
const glitter = () => {
  const r = rng(1108), golds = ['#c9a038', '#e6c463', '#ad8524', '#f0d98c', '#d8b04a'];
  // Each spray leaves a dice edge on a heading and thins out along it.
  const sprays = [[[14.4, 3.2], -40, 9], [[16.6, 7.6], -10, 8], [[13.2, .8], -75, 5], [[3.0, 17.2], 120, 8], [[6.6, 20.8], 150, 7], [[1.2, 15.4], 175, 4]];
  let flakes = '';
  for (const [[x0, y0], head, count] of sprays) for (let k = 0; k < count; k++) {
    const t = Math.pow((k + r() * .8) / count, 1.25), dist = .6 + t * 9.5, a = (head + (r() - .5) * 34) * D;
    const x = x0 + Math.cos(a) * dist, y = y0 + Math.sin(a) * dist, s = (.5 - t * .28) * (.75 + r() * .5);
    const sides = r() < .35 ? 3 : 4, turn = r() * 6.28;
    const pts = Array.from({ length: sides }, (_, j) => { const q = rot([s * (.75 + r() * .4), 0], turn + j * 2 * Math.PI / sides + (r() - .5) * .45); return [q[0] + x, q[1] + y]; });
    flakes += tk(poly(pts), golds[Math.floor(r() * 5)], 0);
    if (s > .38 && r() < .5) flakes += dot(x - s * .2, y - s * .2, .09, '#fbf1cf');
  }
  return flakes + twinkle(19.7, 3.4, 2.5, 1.65, -9, '#e9cb6e', .3, .27) + twinkle(1.6, 20.3, 1.75, 1.15, 8, '#e9cb6e', .28, .27)
    + twinkle(24.2, 1.1, .95, .68, 4, '#f0d98c', .22, .28) + twinkle(-1.6, 17.0, .7, .5, -6, '#f0d98c', .2, .3);
};

/* ===================== Speak Now: the crown ===================== */
// In the back die's frame, set on its top edge a touch askew. A ring of gold seen from the
// front: the back of the band shows between the points, and the front of the base dips over
// the edge because it is nearer.
const crown = () => {
  const xs = [5.2, 6.7, 8.3, 9.9, 11.4], hs = [-.95, -1.65, -2.55, -1.7, -.9];
  const vx = [5.95, 7.5, 9.1, 10.65], vy = [.65, .75, .75, .65];
  const band = (x) => 1.25 + .55 * Math.sin(Math.PI * (x - 5.05) / 6.5);  // top of the band
  let d = `M5.05 2.45L${pt([5.05, band(5.05)])}L${pt([xs[0], hs[0]])}`;
  for (let i = 0; i < 4; i++) d += `Q${pt([(xs[i] + vx[i]) / 2 + .05, (hs[i] + vy[i]) / 2 + .3])} ${pt([vx[i], vy[i]])}Q${pt([(vx[i] + xs[i + 1]) / 2 - .05, (vy[i] + hs[i + 1]) / 2 + .3])} ${pt([xs[i + 1], hs[i + 1]])}`;
  d += `L${pt([11.55, band(11.55)])}L11.55 2.45Q8.3 3.25 5.05 2.45Z`;
  const back = tk('M5.4 1.0Q8.3 .1 11.2 1.0L11.2 1.5Q8.3 .7 5.4 1.5Z', '#b48a2c', 0);
  const rim = ln(`M5.05 ${f(band(5.05) + .02)}Q8.3 ${f(band(8.3) + .62)} 11.55 ${f(band(11.55) + .02)}`, '#9b7624', .3);
  return g('rotate(5 8.3 2.4)',
    back + tk(d, '#e2bb52', .36) + rim
    + xs.map((x, i) => dot(x + (i - 2) * .05, hs[i] - .32, i === 2 ? .46 : .37, '#efd27a', .25)).join('')
    + `<ellipse class="day-fill" style="--tf:#7d5bb5;--tw:.3" cx="8.3" cy="2.28" rx=".62" ry=".5"/>`
    + dot(8.12, 2.14, .11, '#e6dcf5') + dot(6.45, 2.05, .27, '#9a82d0', .2) + dot(10.15, 2.05, .27, '#9a82d0', .2)
    + dot(5.55, 1.9, .16, '#f4efe4') + dot(7.3, 2.15, .16, '#f4efe4') + dot(9.3, 2.15, .16, '#f4efe4') + dot(11.05, 1.9, .16, '#f4efe4'));
};

/* ===================== Red: the scarf ===================== */
// Thrown over the back die's shoulder in the mark's own frame, so it hangs straight down under
// gravity while the die is tilted, and peels away from the die's side as it falls. Ribbed
// along its length; the fringe is the end of the knitting, every strand its own length.
const scarf = () => {
  const spine = [[11.9, .15], [8.6, .85], [5.2, 1.5], [2.7, 2.05], [.75, 3.0], [-.45, 5.3], [-.95, 8.3], [-.95, 11.3], [-.7, 14.0], [-.8, 16.3]];
  // Lying on the die it is seen nearly edge on; where it turns down it bunches, then hangs flat
  // and a little wider toward the end.
  const w = (s) => s < .28 ? .9 + s * .6 : s < .4 ? 1.07 + .32 * Math.sin(Math.PI * (s - .28) / .12) : 1.2 + (s - .4) * .45 + .05 * Math.sin(s * 17);
  const body = tube(spine, w, w, 56);
  const { p, nm, len } = walk(spine, 120);
  // Stockinette: columns of small Vs pointing down the scarf, the way knitting looks.
  let knit = '';
  const step = .72, cols = [-.52, .1, .7];
  for (let d = .7; d < len - .5; d += step) {
    const i = Math.round(d / len * 120), q = p[i], n = nm[i], t = [n[1], -n[0]], s = i / 120;
    if (s > .27 && s < .42) continue;  // the bunched fold shows no clean rows
    for (const c of cols) { const o = c * w(s) / 1.1, half = .26, drop = .3;
      const a = [q[0] + n[0] * (o - half) - t[0] * 0, q[1] + n[1] * (o - half)], m = [q[0] + n[0] * o + t[0] * drop, q[1] + n[1] * o + t[1] * drop], b = [q[0] + n[0] * (o + half), q[1] + n[1] * (o + half)];
      knit += `M${pt(a)}L${pt(m)}L${pt(b)}`; }
  }
  const folds = ln(beside(spine, (s) => -w(s) * .55, .29, .41) + beside(spine, (s) => w(s) * .35, .31, .4), '#7d1d25', .24);
  const end = at(spine, 1), tang = [end.nm[1], -end.nm[0]];
  const fr = [-1.05, -.65, -.25, .15, .55, .95].map((o, i) => {
    const base = [end.p[0] + end.nm[0] * o * w(1), end.p[1] + end.nm[1] * o * w(1)], L = [1.7, 2.3, 1.5, 2.1, 1.6, 1.9][i], sway = [.2, -.15, .25, -.1, .3, .05][i];
    const tip = [base[0] + tang[0] * L + sway, base[1] + tang[1] * L];
    return `M${pt(base)}Q${pt([base[0] + tang[0] * L * .55 - sway * .6, base[1] + tang[1] * L * .55])} ${pt(tip)}`;
  }).join('');
  return ln(fr, '#7d1d25', .4) + tk(body, '#b3323b', .45) + ln(knit, '#86222b', .17) + folds;
};

/* ===================== 1989: the polaroid ===================== */
// Poked in behind both dice. The print is only weather: sky, sea, a strip of sand and the sun,
// with a caption scrawled in the thick bottom margin the way people write on them.
const polaroid = () => g('translate(18.9 2.3) rotate(13)',
  tk('M-4.3 -4.95L4.32 -4.9L4.36 5.35L-4.33 5.32Z', '#fbf8f1', .5)
  + `<rect x="-3.6" y="-4.2" width="7.2" height="6.95" fill="#bfd3e5"/>`
  + tk('M-3.6 .15Q-1.8 -.05 0 .12T3.6 .1L3.6 2.75L-3.6 2.75Z', '#6f96bd', 0)
  + tk('M-3.6 1.85Q-1.2 1.5 1.1 1.75T3.6 1.6L3.6 2.75L-3.6 2.75Z', '#e6d6b3', 0)
  + ln('M-2.7 .8Q-2.3 .66 -1.9 .8M.6 .66Q1.0 .52 1.4 .66M-.9 1.3Q-.6 1.2 -.3 1.3', '#e6eef5', .13)
  + dot(1.75, -2.25, .78, '#f7ecc8')
  + ln('M-3.6 -4.2L3.6 -4.2L3.6 2.75L-3.6 2.75Z', '#93a8ba', .12)
  + ln('M-2.7 4.15C-2.5 3.55 -2.15 3.6 -2.2 4.05C-2.25 4.4 -1.85 4.3 -1.6 3.85C-1.45 3.6 -1.2 3.7 -1.25 4C-1.3 4.35 -.9 4.35 -.7 3.95Q-.45 3.55 -.3 3.95C-.2 4.25 .2 4.2 .35 3.85M.8 3.8C1.0 3.55 1.35 3.6 1.3 3.9C1.25 4.2 .95 4.3 1.25 4.45', '#3f6fa3', .22));

/* ===================== reputation: the snake ===================== */
// Lying along the back die's top edge, in the mark's frame inside the back die's rock. The tail
// hangs straight down off the corner; the body tapers to it and narrows again behind the head,
// which is lifted clear with the tongue out.
const SNAKE = '#33373c';
const snake = () => {
  const spine = [[-.35, 9.4], [-.15, 7.2], [.2, 5.1], [1.2, 3.25], [3.0, 2.82], [5.0, 2.36], [7.0, 1.82], [9.0, 1.5], [10.5, .95],
    [11.5, -.35], [12.1, -1.75], [13.0, -2.75], [14.05, -3.05]];
  const w = (s) => .66 * Math.min(1, .12 + s * 3.2) * (s > .78 ? 1 - (s - .78) * 1.2 : 1) + .06 * Math.sin(s * 23) * (s > .2 && s < .75);
  const body = tube(spine, w, w);
  const belly = ln(beside(spine, (s) => w(s) - .22, .72, .99), '#8d929a', .3);
  const scales = [.3, .36, .42, .48, .54, .6, .66].map((s0) => ln(beside(spine, (s) => -w(s) * .15, s0, s0 + .03), '#4c5158', .2)).join('');
  const head = g('translate(13.75 -3.0) rotate(-12)',
    tk(smooth([[-.4, -.58], [.55, -.8], [1.5, -.66], [2.18, -.26], [2.3, .12], [1.86, .46], [.95, .64], [-.3, .56]]), SNAKE, .45)
    + dot(1.2, -.22, .2, '#e7d9a2') + dot(1.24, -.22, .07, '#1e2023')
    + ln('M2.25 .1L3.15 .2M3.15 .2L3.6 -.12M3.15 .2L3.55 .5', '#b3262b', .3));
  return tk(body, SNAKE, .45) + scales + belly + head;
};

/* ===================== Lover: the butterfly ===================== */
// Come down on the front die's top edge near its corner, in the front die's rock. Seen at an
// angle, so the far wings are foreshortened and every wing is its own drawing; each wears a
// rose border round a pale middle, and the antennae end in clubs.
const butterfly = () => {
  const wing = (outer, inner, fillO, fillI) => tk(smooth(outer), fillO, .4) + tk(smooth(inner), fillI, 0);
  const shrink = (pts, k, c) => pts.map(([x, y]) => [c[0] + (x - c[0]) * k, c[1] + (y - c[1]) * k]);
  const nearF = [[-.25, -.5], [-1.4, -2.5], [-3.1, -3.7], [-4.55, -3.55], [-4.85, -2.45], [-4.3, -1.1], [-3.2, -.25], [-1.6, .1]];
  const nearH = [[-.3, .2], [-1.7, .3], [-3.15, .75], [-3.35, 1.8], [-2.75, 2.85], [-1.7, 3.05], [-.95, 2.3], [-.45, 1.2]];
  const farF = [[.25, -.5], [.9, -2.1], [1.95, -3.05], [2.85, -3.0], [3.05, -2.1], [2.7, -1.0], [1.85, -.25], [.9, .05]];
  const farH = [[.3, .25], [1.25, .35], [2.15, .8], [2.2, 1.6], [1.75, 2.3], [1.15, 2.35], [.7, 1.7], [.4, .95]];
  return g('translate(20.0 8.0) rotate(16)',
    wing(farF, shrink(farF, .62, [.5, -.6]), '#c24a80', '#f2b0cb') + wing(farH, shrink(farH, .58, [.5, .5]), '#9f6fc2', '#d3bdf0')
    + wing(nearF, shrink(nearF, .64, [-.6, -.7]), '#c24a80', '#f4a6c6') + wing(nearH, shrink(nearH, .6, [-.6, .6]), '#9f6fc2', '#ccb4ee')
    + [[-4.2, -3.05], [-4.55, -2.3], [-3.6, -3.5], [2.55, -2.65], [-2.9, 2.55]].map(([x, y]) => dot(x, y, .17, '#fbf2f6')).join('')
    + tk(smooth([[0, -1.25], [.38, -.7], [.32, .6], [.14, 2.35], [0, 2.6], [-.14, 2.35], [-.32, .6], [-.38, -.7]]), '#4a3442', .3)
    + dot(0, -1.45, .34, '#4a3442', .3)
    + ln('M-.12 -1.7C-.4 -2.6 -.9 -3.15 -1.45 -3.45M.12 -1.7C.3 -2.5 .7 -3 1.05 -3.25', 'currentColor', .25)
    + dot(-1.5, -3.48, .2, 'currentColor') + dot(1.1, -3.28, .18, 'currentColor')
    + ln('M-.2 .4L-.75 1.55M.15 .5L.45 1.75', 'currentColor', .2));
};

/* ===================== folklore: the mushrooms ===================== */
// Come up in the bottom corner at the foot of the dice, between them so the front die stands in
// front. A big one, a small one leaning off it and a button just through the moss.
const mushrooms = () => {
  const shroom = (stemPts, sw, cap, gills, capFill, spots) =>
    tk(tube(stemPts, (s) => sw * (1.25 - s * .4), (s) => sw * (1.15 - s * .35)), '#ece4d4', .4)
    + tk(smooth(gills), '#cdbfa8', .35)
    + tk(smooth(cap), capFill, .45)
    + spots.map(([x, y, r]) => tk(smooth([[x - r, y], [x - r * .2, y - r * .8], [x + r, y - r * .2], [x + r * .3, y + r * .7]]), '#f1eadb', 0)).join('');
  const big = shroom([[3.25, 24.1], [3.35, 22.2], [3.7, 20.1]], .62,
    [[.45, 20.1], [.75, 18.55], [1.95, 17.35], [3.75, 16.95], [5.55, 17.35], [6.7, 18.6], [6.95, 19.9], [5.5, 20.15], [3.7, 20.25], [1.9, 20.25]],
    [[.9, 20.0], [3.7, 20.15], [6.5, 19.85], [5.2, 20.75], [3.7, 20.95], [2.1, 20.8]], '#8e8174',
    [[2.4, 18.6, .42], [4.7, 18.05, .36], [5.75, 19.15, .28], [3.5, 17.75, .22]]);
  const small = shroom([[6.9, 24.25], [7.15, 23.1], [7.55, 22.05]], .38,
    [[6.05, 22.35], [6.4, 21.35], [7.55, 20.95], [8.7, 21.35], [9.05, 22.15], [7.6, 22.45]],
    [[6.25, 22.3], [7.6, 22.4], [8.95, 22.1], [8.2, 22.75], [7.0, 22.75]], '#a39789', [[7.2, 21.6, .25], [8.2, 21.7, .2]]);
  const button = tk(smooth([[-.2, 24.1], [-.05, 23.25], [.6, 22.9], [1.3, 23.25], [1.45, 24.1]]), '#9a8e80', .38);
  const tuft = (x, y, wd, ht, seed) => { const r = rng(seed), n = 7, top = [];
    for (let i = 0; i <= n; i++) top.push([x - wd / 2 + wd * i / n, y - ht * Math.sin(Math.PI * i / n) * (.75 + r() * .5)]);
    return tk(smooth([...top, [x + wd / 2 - .2, y + .25], [x, y + .4], [x - wd / 2 + .2, y + .25]]), '#7f8d6b', .32); };
  const moss = tuft(1.7, 24.15, 3.6, .75, 3) + tuft(5.6, 24.25, 3.0, .6, 5) + tuft(8.3, 24.45, 1.7, .45, 9);
  const blade = (x, y, len, lean) => tk(tube([[x, y], [x + lean * .3, y - len * .55], [x + lean, y - len]], (s) => .2 * (1 - s), (s) => .2 * (1 - s), 16), '#66744f', .2);
  return blade(-.2, 24.3, 2.3, -.7) + blade(.5, 24.2, 1.5, .25) + big + small + button + moss + blade(4.6, 24.3, 1.8, .55) + blade(9.0, 24.5, 1.4, .6) + blade(2.9, 24.3, 1.1, -.3);
};

/* ===================== evermore: the ivy ===================== */
// Up from the ground beside the back die, over its shoulder and along the top, in the back die's
// rock. The leaves shrink toward the growing tip, alternate sides, turn to face the light at
// their own angles, and each is drawn from the same ivy leaf pulled a little out of true.
const ivy = () => {
  const r = rng(1211);
  const spine = [[2.9, 24.1], [1.9, 22.0], [1.6, 19.9], [.75, 17.6], [.55, 15.2], [-.2, 12.9], [-.05, 10.4], [-.45, 8.0], [.1, 5.6], [.6, 4.0], [1.6, 2.85],
    [2.9, 2.2], [4.3, 2.15], [5.4, 1.45], [5.75, .55], [5.35, -.05], [4.9, .15]];
  const vine = tk(tube(spine, (s) => .3 - s * .2, (s) => .3 - s * .2), '#5b6b3e', .3);
  const LEAF = [[0, .12], [-.62, .26], [-1.42, .1], [-2.02, -.36], [-1.72, -.86], [-1.95, -1.55], [-1.22, -1.86], [-.72, -2.58],
    [0, -3.2], [.7, -2.55], [1.2, -1.84], [1.95, -1.6], [1.74, -.85], [2.0, -.33], [1.4, .1], [.6, .26]];
  const leaf = (x, y, angle, size, fill) => {
    const pts = LEAF.map(([a, b]) => [a + (r() - .5) * .22, b + (r() - .5) * .22]);
    const veins = ln('M0 -.05L0 -2.6M0 -.1L-1.45 -1.45M0 -.1L1.45 -1.5M0 -.05L-1.5 -.4M0 -.05L1.45 -.4', '#9fb886', .13 / size);
    return g(`translate(${f(x)} ${f(y)}) rotate(${f(angle)}) scale(${f(size)})`, tk(smooth(pts), fill, .3 / size) + veins);
  };
  const plan = [[.06, -1, .95, '#3f6339'], [.17, 1, .88, '#4a6f3d'], [.3, -1, .8, '#3f6339'], [.43, 1, .72, '#557d45'], [.55, -1, .64, '#4a6f3d'],
    [.68, -1, .54, '#557d45'], [.8, -1, .44, '#6a9150'], [.9, 1, .34, '#7fa35c']];
  const { p, nm } = walk(spine, 100);
  const leaves = plan.map(([s, side, size, fill]) => {
    const i = Math.round(s * 100), q = p[i], n = nm[i]; size *= 1.15;
    const stalk = [q[0] + n[0] * side * .75, q[1] + n[1] * side * .75 - .25];
    let out = Math.atan2(n[1] * side, n[0] * side) / D + 90;   // pointing away from the vine
    if (out > 180) out -= 360;
    const angle = out * .6 + (r() - .5) * 24;   // and turned up toward the light
    return ln(`M${pt(q)}Q${pt([(q[0] + stalk[0]) / 2, Math.min(q[1], stalk[1]) - .1])} ${pt(stalk)}`, '#5b6b3e', .2) + leaf(stalk[0], stalk[1], angle, size, fill);
  });
  return vine + leaves.join('');
};

/* ===================== Midnights: the moon ===================== */
// A crescent cut from two circles, three twinkles of different sizes and a few pinprick stars.
const moon = () => {
  const C1 = [20.3, 3.0], R1 = 3.3, C2 = [21.6, 2.05], R2 = 3.0;
  const d = Math.hypot(C2[0] - C1[0], C2[1] - C1[1]), a = (R1 * R1 - R2 * R2 + d * d) / (2 * d), h = Math.sqrt(R1 * R1 - a * a);
  const ux = (C2[0] - C1[0]) / d, uy = (C2[1] - C1[1]) / d, P = [C1[0] + a * ux, C1[1] + a * uy];
  const I1 = [P[0] - h * uy, P[1] + h * ux], I2 = [P[0] + h * uy, P[1] - h * ux];
  const away = Math.atan2(-uy, -ux), ang = (c, p) => Math.atan2(p[1] - c[1], p[0] - c[0]);
  const arc = (c, rr, from, to) => { let a0 = ang(c, from), a1 = ang(c, to);
    // go round through `away`
    const span = (x) => ((x % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    let sweep = span(a1 - a0); if (span(away - a0) > sweep) sweep -= 2 * Math.PI;
    return Array.from({ length: 29 }, (_, k) => [c[0] + rr * Math.cos(a0 + sweep * k / 28), c[1] + rr * Math.sin(a0 + sweep * k / 28)]); };
  const outer = arc(C1, R1, I1, I2), inner = arc(C2, R2, I2, I1);
  const crescent = `M${outer.map(pt).join('L')}L${inner.slice(1).map(pt).join('L')}Z`;
  return tk(crescent, '#efd385', .38)
    + twinkle(24.5, -1.1, 1.35, .88, 6, '#efd385', .28, .27) + twinkle(16.0, -1.4, .9, .62, -8, '#efd385', .24, .28)
    + twinkle(24.9, 6.6, .7, .5, -3, '#efd385', .2, .3)
    + dot(22.6, 6.9, .17, '#efd385') + dot(17.4, 1.6, .13, '#efd385') + dot(25.8, 2.6, .15, '#efd385');
};

/* ===================== TTPD: the quill ===================== */
// A flight feather, so the vane is lopsided: wide on one side, narrow on the other, with the bare
// quill below it, a couple of splits where the barbs have parted, and down at the foot of the
// vane. It is set down on the front die nib first, in the front die's rock, with the blot it made.
const quill = () => {
  const spine = [[0, 0], [.05, -3.4], [.25, -7.4], [.62, -10.9], [1.2, -13.9]];
  const notch = (s, s0) => 1 - .5 * Math.exp(-(((s - s0) / .012) ** 2));
  const arch = (s, span, k) => s < .24 ? 0 : Math.pow(Math.max(0, Math.sin(Math.PI * Math.min(1, (s - .24) / span))), k);
  const wl = (s) => 2.1 * arch(s, .79, .7) * notch(s, .62) + .12;
  const wr = (s) => 1.15 * arch(s, .78, .65) * notch(s, .69) + .12;
  const featherD = (() => { const { p, nm } = walk(spine, 80);
    const A = [], B = [];
    p.forEach((q, i) => { const s = i / 80; if (s < .235) return;
      A.push([q[0] + nm[i][0] * wl(s), q[1] + nm[i][1] * wl(s)]); B.push([q[0] - nm[i][0] * wr(s), q[1] - nm[i][1] * wr(s)]); });
    return `M${pt(A[0])}${cr(A)}L${pt(B.at(-1))}${cr(B.reverse())}Z`; })();
  const { p, nm } = walk(spine, 80);
  // Barbs: fine, many, raked toward the tip and stopping short of the edge, spaced unevenly.
  const rb = rng(1904);
  let barbs = '';
  for (const side of [1, -1]) for (let s = .29; s < .95; s += .038 + rb() * .02) {
    const i = Math.round(s * 80), q = p[i], n = nm[i], t = [-n[1], n[0]], L = (side > 0 ? wl(s) : wr(s)) * (.55 + rb() * .15);
    barbs += `M${pt(q)}L${pt([q[0] + n[0] * side * L - t[0] * L * .45, q[1] + n[1] * side * L - t[1] * L * .45])}`;
  }
  const down = [[.24, 1, 1.0], [.26, 1, .75], [.25, -1, .65], [.27, -1, .8]].map(([s, side, L]) => { const i = Math.round(s * 80), q = p[i], n = nm[i];
    return `M${pt(q)}Q${pt([q[0] + n[0] * side * L * .6, q[1] + n[1] * side * L * .6 + .3])} ${pt([q[0] + n[0] * side * L, q[1] + n[1] * side * L + .1])}`; }).join('');
  const shaft = tk(tube([[0, 0], [.03, -1.8], [.08, -3.6]], (s) => .07 + s * .2, (s) => .07 + s * .2, 20), '#eadfc8', .32, '', '#4d4335');
  const nib = tk('M0 0L-.2 -1.1L.2 -1.1Z', '#2b2722', 0);
  return g('translate(16.5 9.45) rotate(37) scale(.86)',
    ln(down, '#b9ab93', .22) + tk(featherD, '#f3ecdf', .4, '', '#4d4335') + ln(barbs, '#cdbfa6', .13)
    + ln(beside(spine, 0, .27, .985), '#c8b89a', .24) + shaft + nib + ln('M0 -.15L0 -.85', '#f3ecdf', .1))
    + tk(smooth([[15.95, 10.05], [16.45, 9.85], [16.95, 10.05], [17.05, 10.45], [16.8, 10.7], [16.6, 11.25], [16.4, 10.75], [16.0, 10.55]]), '#2b2722', 0)
    + dot(15.45, 10.35, .14, '#2b2722') + dot(17.55, 10.85, .11, '#2b2722') + dot(15.85, 11.05, .09, '#2b2722');
};

/* ===================== Showgirl: the plume ===================== */
// Three ostrich feathers out of a jewelled clasp on the back die, in its frame. Each is soft:
// the edges are frilled rather than cut, the tips droop and curl, and they are three different
// lengths, bends and colours. The clasp is gold round a turquoise stone.
const plume = () => {
  const feather = (spine, maxW, fill, edge, barb, seed) => {
    const r = rng(seed), ph = r() * 6, ph2 = r() * 6;
    const frill = (s) => 1 + .09 * Math.sin(s * 63 + ph) + .06 * Math.sin(s * 101 + ph2);
    const w = (s) => maxW * (.15 + .85 * Math.pow(Math.sin(Math.PI * Math.min(1, s * 1.05) * .9 + .12), .6)) * frill(s);
    const wl = (s) => w(s) * (.95 + .12 * Math.sin(s * 7 + ph)), wr = (s) => w(s) * (1.05 - .12 * Math.sin(s * 7 + ph));
    const { p, nm } = walk(spine, 70);
    const barbs = [.2, .3, .4, .5, .6, .7, .8].flatMap((s) => [1, -1].map((side) => { const i = Math.round(s * 70), q = p[i], n = nm[i],
      t = [p[Math.min(70, i + 1)][0] - p[Math.max(0, i - 1)][0], p[Math.min(70, i + 1)][1] - p[Math.max(0, i - 1)][1]], tl = Math.hypot(...t) || 1,
      L = (side > 0 ? wl(s) : wr(s)) * (.6 + r() * .25);
      return `M${pt(q)}Q${pt([q[0] + n[0] * side * L * .5 + t[0] / tl * L * .15, q[1] + n[1] * side * L * .5 + t[1] / tl * L * .15])} ${pt([q[0] + n[0] * side * L + t[0] / tl * L * .5, q[1] + n[1] * side * L + t[1] / tl * L * .5])}`; })).join('');
    return tk(tube(spine, wl, wr, 70), fill, .38, '', edge) + ln(barbs, barb, .16) + ln(beside(spine, 0, .02, .92), '#fbe8cf', .2);
  };
  return feather([[7.75, 2.05], [6.45, .15], [4.85, -1.5], [3.2, -2.35], [2.0, -2.05], [1.45, -1.05]], 1.15, '#f2a65a', '#b8692a', '#d68840', 3)
    + feather([[8.85, 2.0], [10.15, .25], [11.75, -1.0], [13.15, -1.2], [13.95, -.35], [13.9, .45]], 1.0, '#ec95a4', '#a8505f', '#cd7484', 7)
    + feather([[8.3, 2.0], [8.1, -1.0], [8.0, -3.7], [8.5, -5.6], [9.55, -6.2], [10.25, -5.55]], 1.3, '#ea7d33', '#a24a17', '#c9622a', 11)
    + `<ellipse class="day-fill" style="--tf:#e2bb52;--tw:.38" cx="8.3" cy="2.15" rx="1.3" ry="1.02"/>`
    + `<ellipse class="day-fill" style="--tf:#3fa69a;--tw:.22" cx="8.3" cy="2.15" rx=".72" ry=".56"/>`
    + dot(8.08, 1.96, .17, '#d9f2ee')
    + [0, 55, 118, 180, 236, 298].map((a) => dot(8.3 + 1.02 * Math.cos(a * D), 2.15 + .8 * Math.sin(a * D), .13, '#f4e3a8')).join('');
};

/* ---- the records, by masthead ink slug ---- */
const DRAW = {
  debut: ['between', guitar], fearless: ['top', glitter], speaknow: ['back', crown], red: ['backrock', scarf],
  nineteen89: ['behind', polaroid], reputation: ['backrock', snake], lover: ['frontrock', butterfly], folklore: ['between', mushrooms],
  evermore: ['backrock', ivy], midnights: ['top', moon], poets: ['frontrock', quill], showgirl: ['back', plume],
};
const made = {};
// { at, svg } for a record's ink slug, or null for any other day.
export function dayTrinket(slug) {
  const d = DRAW[slug];
  if (!d) return null;
  return made[slug] ||= { at: d[0], svg: d[1]() };
}
export const DAY_TRINKET_SLUGS = Object.keys(DRAW);
