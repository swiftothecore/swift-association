// The tick and the cross a page is marked with.
//
// They used to be the characters ✓ and ✗ typed into the verdict banner, and the hand face
// has neither: the browser borrowed both from a system symbol font, so every verdict opened
// on a printed dingbat beside handwriting. These are drawn instead, in felt tip — a stroke
// that lands with pressure and lifts off thin — and they write themselves on in stroke order.
//
// Each stroke is a quadratic centreline with a three-point width profile (landing, middle,
// lift), and the outline is generated from it, so every irregularity is a number to nudge
// rather than a typed coordinate. The cross is two drawings, not one mirrored: different
// lengths, bows and weights. Box is 32x32 and the tick's tail overshoots it on purpose.
// The board these were picked from is scripts/ui/verdict-marks.html.
const PEN = {
  good: [ { c: [[4.8, 16.6], [8.9, 19.9], [11.9, 25.6]], w: [3.4, 3.9, 4.1], d: 0.09 },
          { c: [[11.9, 25.6], [16.1, 13.4], [28.4, 3.9]], w: [4.1, 3.2, 1.2], d: 0.16 } ],
  bad:  [ { c: [[5.6, 6.2], [14.9, 15.6], [26.4, 26.4]], w: [4.0, 3.5, 1.6], d: 0.13 },
          { c: [[25.3, 5.2], [17.1, 15.1], [7.2, 25.8]], w: [3.8, 3.3, 1.3], d: 0.12, gap: 0.07 } ],
};

const q = (a, b, c, t) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;
const dq = (a, b, c, t) => 2 * (1 - t) * (b - a) + 2 * t * (c - b);
const f = (n) => +n.toFixed(2);

function outline([p0, p1, p2], [wa, wb, wc], n = 30) {
  const wm = 2 * wb - (wa + wc) / 2;   // the control weight that puts wb at the midpoint
  const L = [], R = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = q(p0[0], p1[0], p2[0], t), y = q(p0[1], p1[1], p2[1], t);
    let dx = dq(p0[0], p1[0], p2[0], t), dy = dq(p0[1], p1[1], p2[1], t);
    const m = Math.hypot(dx, dy) || 1; dx /= m; dy /= m;
    const w = q(wa, wm, wc, t) / 2;
    L.push([x - dy * w, y + dx * w]); R.push([x + dy * w, y - dx * w]);
  }
  const r0 = f(wa / 2), rn = f(wc / 2);
  let d = `M${f(L[0][0])} ${f(L[0][1])}`;
  for (let i = 1; i <= n; i++) d += `L${f(L[i][0])} ${f(L[i][1])}`;
  d += `A${rn} ${rn} 0 0 0 ${f(R[n][0])} ${f(R[n][1])}`;
  for (let i = n - 1; i >= 0; i--) d += `L${f(R[i][0])} ${f(R[i][1])}`;
  return d + `A${r0} ${r0} 0 0 0 ${f(L[0][0])} ${f(L[0][1])}Z`;
}

// The reveal mask's path: the centreline run a stroke-width past both ends, so the round caps
// are uncovered with the rest instead of popping in as dots before the stroke arrives.
function spine([p0, p1, p2], ext) {
  const a0 = [dq(p0[0], p1[0], p2[0], 0), dq(p0[1], p1[1], p2[1], 0)];
  const a1 = [dq(p0[0], p1[0], p2[0], 1), dq(p0[1], p1[1], p2[1], 1)];
  const m0 = Math.hypot(...a0), m1 = Math.hypot(...a1);
  const s = [p0[0] - a0[0] / m0 * ext, p0[1] - a0[1] / m0 * ext];
  const e = [p2[0] + a1[0] / m1 * ext, p2[1] + a1[1] / m1 * ext];
  return `M${f(s[0])} ${f(s[1])}L${f(p0[0])} ${f(p0[1])}Q${f(p1[0])} ${f(p1[1])} ${f(p2[0])} ${f(p2[1])}L${f(e[0])} ${f(e[1])}`;
}

// Built once: the outlines never change, only the mask ids do.
const STROKES = {};
for (const kind of Object.keys(PEN)) {
  let t = 0;
  STROKES[kind] = PEN[kind].map((s) => {
    t += s.gap || 0;
    const wmax = Math.max(...s.w);
    const out = { body: outline(s.c, s.w), spine: spine(s.c, wmax), width: f(wmax + 2), d: s.d, delay: f(t) };
    t += s.d;
    return out;
  });
}

// The line through a wrong answer, in the same pen. Drawn in a 100x12 box and stretched to the
// word with preserveAspectRatio="none": the stroke runs nearly level, so the stretch lengthens
// it without thinning it, and one drawing fits a two-letter title or a forty-letter one.
const STRIKE = { c: [[1.6, 7.6], [46, 5.2], [98.2, 4.4]], w: [2.9, 3.2, 1.5], d: 0.2 };
const STRIKE_BODY = outline(STRIKE.c, STRIKE.w);
const STRIKE_SPINE = spine(STRIKE.c, 4);

let uid = 0;
export function verdictStrike(delay = 0.3) {
  const id = `vmk${++uid}`;
  return `<svg class="vmark-strike" viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true" focusable="false">` +
    `<defs><mask id="${id}" maskUnits="userSpaceOnUse" x="-6" y="-6" width="112" height="24">` +
    `<path class="vmark-ink" d="${STRIKE_SPINE}" pathLength="1" fill="none" stroke="#fff" stroke-width="6"` +
    ` style="--vmark-d:${STRIKE.d}s;--vmark-dl:${delay}s"/></mask></defs>` +
    `<path d="${STRIKE_BODY}" fill="currentColor" mask="url(#${id})"/></svg>`;
}

// kind: "good" (tick) or "bad" (cross). Painted in currentColor, as one layer, so a
// translucent colour never darkens where the strokes cross.
export function verdictMark(kind, cls = "") {
  const strokes = STROKES[kind === "good" ? "good" : "bad"];
  let defs = "", body = "";
  for (const s of strokes) {
    const id = `vmk${++uid}`;
    defs += `<mask id="${id}" maskUnits="userSpaceOnUse" x="-8" y="-8" width="48" height="48">` +
      `<path class="vmark-ink" d="${s.spine}" pathLength="1" fill="none" stroke="#fff" stroke-width="${s.width}"` +
      ` style="--vmark-d:${s.d}s;--vmark-dl:${s.delay}s"/></mask>`;
    body += `<path d="${s.body}" fill="currentColor" mask="url(#${id})"/>`;
  }
  return `<svg class="vmark vmark-${kind === "good" ? "good" : "bad"}${cls ? " " + cls : ""}" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><defs>${defs}</defs>${body}</svg>`;
}
