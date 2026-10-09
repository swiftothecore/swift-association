/* The bracelet's trinkets: what dangles from every bead a run earns. Each is drawn the way a
   shrink-plastic charm is made: a pen drawing, coloured in by hand a hair off the line, baked
   hard so the oven leaves a gloss, and strung on the bracelet's own cord through a hole punched
   where you would really punch it. Nothing here is mirrored: every left/right pair is two
   drawings and every star point is its own length.

   A trinket is a SHAPE, a set of silhouettes in a unit box (about -1..1, y down) plus its detail
   lines, features, gloss and hole, and shrink() makes the object out of it under a scale(r), so
   the one drawing ships at every size. Anything that has to hold a minimum PIXEL width (the pen,
   the clear edge) is converted back with u(px) so it never thins to nothing on the in-run strip.

   Roles: "colour" parts take the album colour (var(--bead)); "accent" parts are coloured in the
   same but a shade darker; "metal" parts are the bare plastic left uncoloured. Colours are fixed
   rather than page tokens, because a trinket is an OBJECT and its pen does not turn cream at
   night; the clear cut edge catches the lamp instead, which is what keeps a dark album legible
   on the night page. Drawn on scripts/mastery/trinket-earned.html and trinket-worn.html. */

const f = (v) => (+v).toFixed(3);
const P = ([x, y]) => `${f(x)},${f(y)}`;

// A polygon with every corner rounded by a quadratic: t is how far along each neighbouring edge
// the rounding starts, as a fraction of that edge, per vertex.
function roundPoly(pts, ts) {
  const n = pts.length;
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  let d = "";
  const corners = pts.map((v, i) => {
    const prev = pts[(i - 1 + n) % n], next = pts[(i + 1) % n], t = ts[i % ts.length];
    return { a: lerp(v, prev, t), v, b: lerp(v, next, t) };
  });
  corners.forEach((c, i) => { d += (i ? "L" : "M") + P(c.a) + "Q" + P(c.v) + " " + P(c.b); });
  return { d: d + "Z", corners };
}
const apex = (c) => [0.25 * c.a[0] + 0.5 * c.v[0] + 0.25 * c.b[0], 0.25 * c.a[1] + 0.5 * c.v[1] + 0.25 * c.b[1]];

// Sample a chain of cubic beziers (each [p0, c1, c2, p3]) into points.
function sampleChain(segs, per = 26) {
  const out = [];
  segs.forEach((s, si) => {
    for (let k = si ? 1 : 0; k <= per; k++) {
      const t = k / per, m = 1 - t;
      out.push([0, 1].map((j) => m * m * m * s[0][j] + 3 * m * m * t * s[1][j] + 3 * m * t * t * s[2][j] + t * t * t * s[3][j]));
    }
  });
  return out;
}
// A tapered body round a centreline: half-width w(s) where s runs 0 (head end) to 1 (tail).
function taper(pts, w) {
  const L = [], R = [];
  let len = 0; const acc = [0];
  for (let i = 1; i < pts.length; i++) { len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); acc.push(len); }
  pts.forEach((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    let tx = b[0] - a[0], ty = b[1] - a[1]; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
    const hw = w(acc[i] / len);
    L.push([p[0] - ty * hw, p[1] + tx * hw]); R.push([p[0] + ty * hw, p[1] - tx * hw]);
  });
  const tip = pts[pts.length - 1];
  return "M" + L.map(P).join("L") + "L" + P(tip) + "L" + R.reverse().map(P).join("L") + "Z";
}

/* ---------------- the default and the worn set ---------------- */

function star() {
  // five points, each its own length and a degree or two off true, the whole star a touch rotated
  const RO = [1.03, 0.95, 1.0, 0.93, 0.98], AO = [0, 2.6, -1.8, 1.4, -2.4];
  const RI = [0.47, 0.44, 0.48, 0.45, 0.46], AI = [1.2, -1.0, 0.6, -0.4, 1.6];
  const pts = [];
  for (let k = 0; k < 5; k++) {
    const ao = ((-93 + 72 * k + AO[k]) * Math.PI) / 180, ai = ((-93 + 36 + 72 * k + AI[k]) * Math.PI) / 180;
    pts.push([RO[k] * Math.cos(ao), RO[k] * Math.sin(ao) + 0.1], [RI[k] * Math.cos(ai), RI[k] * Math.sin(ai) + 0.1]);
  }
  const body = roundPoly(pts, [0.2, 0.11]);
  const top = apex(body.corners[0]);
  return {
    parts: [{ d: body.d, role: "colour", hl: [-0.27, -0.2, 0.19, 0.1, -32] }],
    hang: [top[0], top[1] + 0.03],
    hole: [top[0] * 0.7, top[1] + 0.3], holeEdge: top[1],
    gloss: `M${P([-0.47, -0.04])} Q${P([-0.4, -0.2])} ${P([-0.22, -0.26])}`,
  };
}

function snake() {
  // an S coil from the neck down to a tail that curls back up, thick at the neck and fine at the tip
  const chain = sampleChain([
    [[0.02, -0.5], [-0.64, -0.42], [-0.7, 0.04], [-0.08, 0.1]],
    [[-0.08, 0.1], [0.58, 0.15], [0.68, 0.6], [0.06, 0.74]],
    [[0.06, 0.74], [-0.3, 0.81], [-0.54, 0.64], [-0.43, 0.43]],
  ]);
  const body = taper(chain, (s) => 0.205 - 0.15 * Math.pow(s, 1.15));
  // the head in profile, snout to the right, a little wider at the jaw than the crown
  const head = `M${P([-0.2, -0.62])} C${P([-0.2, -0.8])} ${P([0.08, -0.88])} ${P([0.26, -0.8])}` +
    ` C${P([0.38, -0.75])} ${P([0.42, -0.66])} ${P([0.36, -0.58])} C${P([0.26, -0.47])} ${P([-0.02, -0.42])} ${P([-0.12, -0.46])}` +
    ` C${P([-0.18, -0.5])} ${P([-0.21, -0.55])} ${P([-0.2, -0.62])}Z`;
  return {
    parts: [
      { d: body, role: "colour", rim: 0.72, hl: [-0.5, -0.14, 0.12, 0.07, -60] },
      { d: head, role: "colour", hl: [0.0, -0.74, 0.12, 0.06, -12] },
    ],
    dots: [[0.17, -0.7, 0.062]],
    tongue: `M${P([0.38, -0.61])} L${P([0.53, -0.57])} M${P([0.53, -0.57])} L${P([0.61, -0.62])} M${P([0.53, -0.57])} L${P([0.6, -0.5])}`,
    hang: [0.03, -0.84],
    hole: [-0.04, -0.68], holeEdge: -0.85,
    gloss: `M${P([-0.6, -0.14])} Q${P([-0.56, -0.32])} ${P([-0.38, -0.4])}`,
  };
}

function heart() {
  // a friendship heart: the left lobe a little fuller, the point a hair right of centre; it hangs
  // from a hole punched just under the cleft, the cord coming down into the dip
  const d = `M${P([0.03, 0.93])} C${P([-0.38, 0.63])} ${P([-0.98, 0.22])} ${P([-0.94, -0.28])}` +
    ` C${P([-0.91, -0.71])} ${P([-0.46, -0.87])} ${P([-0.18, -0.67])} C${P([-0.08, -0.6])} ${P([-0.02, -0.5])} ${P([0.0, -0.41])}` +
    ` C${P([0.04, -0.53])} ${P([0.12, -0.63])} ${P([0.24, -0.7])} C${P([0.54, -0.86])} ${P([0.93, -0.64])} ${P([0.89, -0.22])}` +
    ` C${P([0.85, 0.24])} ${P([0.36, 0.63])} ${P([0.03, 0.93])}Z`;
  return {
    parts: [{ d, role: "colour" }],
    hang: [0.0, -0.41],
    hole: [0.01, -0.2], holeEdge: -0.41,
    gloss: `M${P([-0.74, -0.3])} C${P([-0.76, -0.52])} ${P([-0.6, -0.66])} ${P([-0.42, -0.66])}`,
  };
}

function moon() {
  // a waxing crescent, opening to the right, the upper horn longer than the lower; two craters of
  // different sizes, and it hangs from the thick of its back
  const R = 0.92, c1 = [-0.06, 0.02], r = 0.76, c2 = [0.36, -0.1];
  // where the two circles cross: the tips of the horns
  const dx = c2[0] - c1[0], dy = c2[1] - c1[1], dd = Math.hypot(dx, dy);
  const a = (R * R - r * r + dd * dd) / (2 * dd), h = Math.sqrt(R * R - a * a);
  const mx = c1[0] + (a * dx) / dd, my = c1[1] + (a * dy) / dd;
  const t1 = [mx + (h * dy) / dd, my - (h * dx) / dd], t2 = [mx - (h * dy) / dd, my + (h * dx) / dd];
  const top = t1[1] < t2[1] ? t1 : t2, bot = t1[1] < t2[1] ? t2 : t1;
  const d = `M${P(top)} A${R} ${R} 0 1 0 ${P(bot)} A${r} ${r} 0 0 1 ${P(top)}Z`;
  return {
    parts: [{ d, role: "colour" }],
    lines: [
      { d: `M${P([-0.58, 0.18])} m-0.1,0 a0.1,0.095 0 1 0 0.2,0 a0.1,0.095 0 1 0 -0.2,0`, w: 0.045 },
      { d: `M${P([-0.44, 0.52])} m-0.06,0 a0.06,0.058 0 1 0 0.12,0 a0.06,0.058 0 1 0 -0.12,0`, w: 0.045 },
    ],
    hang: [-0.36, -0.8],
    hole: [-0.36, -0.6], holeEdge: -0.8,
    gloss: `M${P([-0.8, 0.12])} C${P([-0.82, -0.14])} ${P([-0.74, -0.36])} ${P([-0.6, -0.5])}`,
  };
}

function mirrorball() {
  // a real sphere of mirror tiles, tipped toward you so the rows curve, turned a few degrees so
  // the columns do not line up on the centre
  const cy = 0.12, R = 0.86, D = Math.PI / 180, tip = -22 * D, turn = 7;
  const at = (lat, lon) => {
    const la = lat * D, lo = (lon + turn) * D;
    const X = Math.cos(la) * Math.sin(lo), Y = Math.sin(la), Z = Math.cos(la) * Math.cos(lo);
    return { x: R * X, y: cy - R * (Y * Math.cos(tip) + Z * Math.sin(tip)), z: -Y * Math.sin(tip) + Z * Math.cos(tip) };
  };
  const ball = `M${P([0, cy - R])} A${R} ${R} 0 1 1 ${P([0, cy + R])} A${R} ${R} 0 1 1 ${P([0, cy - R])}Z`;
  // grout: every visible run of each parallel and meridian, as one path
  const runs = (pts) => { let d = "", on = false; pts.forEach((q) => { if (q.z > 0.02) { d += (on ? "L" : "M") + P([q.x, q.y]); on = true; } else on = false; }); return d; };
  const LATS = [-62, -38, -13, 12, 37, 62], LONS = [];
  for (let lon = -180; lon < 180; lon += 24) LONS.push(lon);
  let grout = "";
  LATS.forEach((lat) => { const pts = []; for (let lon = -180; lon <= 180; lon += 6) pts.push(at(lat, lon)); grout += runs(pts); });
  LONS.forEach((lon) => { const pts = []; for (let lat = -88; lat <= 88; lat += 6) pts.push(at(lat, lon)); grout += runs(pts); });
  // the tiles that catch the light: brighter toward the top left, and a few that flash
  const facets = [];
  const edges = [-90, ...LATS, 90];
  let k = 0;
  for (let i = 0; i < edges.length - 1; i++) for (const lon of LONS) {
    const c = [at(edges[i], lon), at(edges[i], lon + 24), at(edges[i + 1], lon + 24), at(edges[i + 1], lon)];
    k++;
    if (c.some((q) => q.z < 0.08)) continue;
    const mx = (c[0].x + c[2].x) / 2, my = (c[0].y + c[2].y) / 2;
    const h = Math.abs(Math.sin(k * 12.9898 + 78.233) * 43758.5453) % 1;
    const o = Math.min(0.85, 0.06 + 0.16 * Math.max(0, (-mx - (my - cy)) / R + 0.4) + (h > 0.86 ? 0.55 : h * 0.1));
    facets.push({ d: "M" + c.map((q) => P([q.x, q.y])).join("L") + "Z", o: +o.toFixed(2) });
  }
  return {
    parts: [
      { d: ball, role: "colour", hl: [-0.4, -0.3, 0.14, 0.09, -30] },
      { d: `M${P([-0.17, -0.71])} L${P([-0.15, -0.89])} L${P([0.16, -0.9])} L${P([0.18, -0.72])}Z`, role: "metal" },
    ],
    facets,
    lines: [{ d: grout, w: 0.045, clip: 0, fine: true }],
    glint: [-0.44, -0.34, 0.26],
    hang: [0.0, -0.88],
    hole: [0.0, -0.56], holeEdge: -0.89,
    gloss: `M${P([-0.66, 0.0])} Q${P([-0.6, -0.3])} ${P([-0.38, -0.5])}`,
  };
}

function coupe() {
  const glass = `M${P([-0.84, -0.5])} C${P([-0.78, -0.08])} ${P([-0.4, 0.09])} ${P([-0.06, 0.11])} L${P([-0.05, 0.71])}` +
    ` C${P([-0.3, 0.75])} ${P([-0.47, 0.82])} ${P([-0.47, 0.92])} L${P([0.49, 0.91])} C${P([0.48, 0.81])} ${P([0.3, 0.74])} ${P([0.07, 0.71])}` +
    ` L${P([0.08, 0.1])} C${P([0.43, 0.07])} ${P([0.8, -0.13])} ${P([0.85, -0.54])}Z`;
  const fizz = `M${P([-0.74, -0.38])} C${P([-0.66, -0.1])} ${P([-0.36, 0.03])} ${P([0.0, 0.04])} C${P([0.37, 0.03])} ${P([0.7, -0.13])} ${P([0.76, -0.42])}Z`;
  return {
    parts: [
      { d: glass, role: "metal" },
      { d: fizz, role: "colour", hl: [-0.42, -0.24, 0.16, 0.06, -12] },
    ],
    bubbles: [[0.2, -0.22, 0.05], [0.36, -0.12, 0.035], [0.07, -0.3, 0.032]],
    hang: [0.0, -0.53],
    hole: [0.0, -0.3], holeEdge: -0.52,
    gloss: `M${P([-0.62, -0.42])} Q${P([-0.56, -0.2])} ${P([-0.4, -0.12])}`,
  };
}

function pick() {
  // a guitar pick, point down, a touch wider on the left shoulder, a hole through the top the
  // way a pick on a chain is drilled
  // nearly flat across the top and nearly straight down the sides, so at strand size it reads as
  // a triangle and never as the heart (whose cleft is the one round notch on the strand)
  const d = `M${P([-0.84, -0.56])} C${P([-0.86, -0.9])} ${P([-0.6, -0.94])} ${P([0.02, -0.94])} C${P([0.62, -0.94])} ${P([0.88, -0.9])} ${P([0.86, -0.56])}` +
    ` C${P([0.82, -0.2])} ${P([0.4, 0.56])} ${P([0.1, 0.92])} C${P([0.04, 0.99])} ${P([-0.04, 0.99])} ${P([-0.1, 0.92])}` +
    ` C${P([-0.4, 0.56])} ${P([-0.82, -0.2])} ${P([-0.84, -0.56])}Z`;
  return {
    parts: [{ d, role: "colour" }],
    hang: [0.01, -0.94],
    hole: [0.01, -0.7], holeEdge: -0.94,
    gloss: `M${P([-0.62, -0.42])} C${P([-0.64, -0.6])} ${P([-0.5, -0.72])} ${P([-0.28, -0.74])}`,
  };
}

function note() {
  // a single eighth note: a tilted head, the stem rising from its right, and a broad flag that
  // curls down off the top, which is where the hole is punched
  const stem = `M${P([0.02, 0.56])} L${P([0.04, -0.94])} L${P([0.18, -0.95])} L${P([0.16, 0.52])}Z`;
  const flag = `M${P([0.03, -0.94])} L${P([0.17, -0.97])} C${P([0.42, -0.84])} ${P([0.64, -0.6])} ${P([0.6, -0.28])}` +
    ` C${P([0.58, -0.12])} ${P([0.5, -0.02])} ${P([0.42, 0.04])} C${P([0.5, -0.18])} ${P([0.44, -0.42])} ${P([0.12, -0.52])} L${P([0.035, -0.6])}Z`;
  const hx = -0.26, hy = 0.6, rx = 0.39, ry = 0.27, a = (-22 * Math.PI) / 180;
  const ep = (t) => [hx + rx * Math.cos(t) * Math.cos(a) - ry * Math.sin(t) * Math.sin(a), hy + rx * Math.cos(t) * Math.sin(a) + ry * Math.sin(t) * Math.cos(a)];
  const head = `M${P(ep(0))} A${rx} ${ry} -22 1 1 ${P(ep(Math.PI))} A${rx} ${ry} -22 1 1 ${P(ep(0))}Z`;
  return {
    parts: [{ d: stem, role: "colour" }, { d: flag, role: "colour" }, { d: head, role: "colour" }],
    hang: [0.28, -0.86],
    hole: [0.28, -0.72], holeEdge: -0.88,
    gloss: `M${P([-0.52, 0.5])} Q${P([-0.46, 0.38])} ${P([-0.3, 0.36])}`,
  };
}

function lightning() {
  // a bolt with a broad top to punch through, three strokes of uneven length, a sharp tip
  const pts = [[0.12, -0.98], [0.62, -0.97], [0.22, -0.3], [0.57, -0.29], [-0.31, 0.98], [-0.02, 0.09], [-0.43, 0.08]];
  const d = roundPoly(pts, [0.07, 0.07, 0.05, 0.06, 0.02, 0.05, 0.06]).d;
  return {
    parts: [{ d, role: "colour" }],
    hang: [0.36, -0.96],
    hole: [0.36, -0.8], holeEdge: -0.97,
    gloss: `M${P([-0.27, 0.0])} L${P([0.04, -0.52])}`,
  };
}

/* ---------------- the earned marks ---------------- */

function devil() {
  // a horned head narrowing to a pointed chin; one horn longer and further out than the other
  const face = `M${P([0.02, 0.9])} C${P([0.26, 0.8])} ${P([0.69, 0.5])} ${P([0.68, 0.04])}` +
    ` C${P([0.68, -0.4])} ${P([0.38, -0.64])} ${P([0.0, -0.64])} C${P([-0.4, -0.64])} ${P([-0.71, -0.38])} ${P([-0.69, 0.06])}` +
    ` C${P([-0.67, 0.52])} ${P([-0.23, 0.8])} ${P([0.02, 0.9])}Z`;
  const hornL = `M${P([-0.54, -0.33])} C${P([-0.74, -0.52])} ${P([-0.86, -0.8])} ${P([-0.8, -1.05])}` +
    ` C${P([-0.64, -0.87])} ${P([-0.42, -0.74])} ${P([-0.17, -0.62])}Z`;
  const hornR = `M${P([0.52, -0.37])} C${P([0.74, -0.54])} ${P([0.88, -0.76])} ${P([0.85, -0.99])}` +
    ` C${P([0.67, -0.83])} ${P([0.44, -0.72])} ${P([0.2, -0.62])}Z`;
  return {
    parts: [
      { d: hornL, role: "accent" }, { d: hornR, role: "accent" },
      { d: face, role: "colour", hl: [-0.31, -0.32, 0.15, 0.08, -28] },
    ],
    // slanted eyes, each its own angle, and a smirk that lifts on one side only
    eyes: [[-0.25, -0.03, 0.145, 0.078, 26], [0.24, -0.05, 0.135, 0.072, -21]],
    lines: [{ d: `M${P([-0.2, 0.38])} Q${P([0.06, 0.5])} ${P([0.27, 0.32])} Q${P([0.32, 0.28])} ${P([0.32, 0.21])}`, w: 0.095, feature: true }],
    hang: [0.0, -0.63],
    hole: [0.01, -0.45], holeEdge: -0.64,
    gloss: `M${P([-0.5, -0.06])} Q${P([-0.47, -0.3])} ${P([-0.28, -0.44])}`,
  };
}

const D = Math.PI / 180;
// a point on a circle, by the clock-face angle convention SVG does not use: degrees counter-
// clockwise from three o'clock, with y down
const onCircle = (cx, cy, R, deg) => [cx + R * Math.cos(deg * D), cy - R * Math.sin(deg * D)];

function nib() {
  // a fountain-pen nib, tip down the way it hangs: shoulders a touch uneven, the breather hole a
  // heart (vintage nibs really were cut that way), the slit running from it to the tip
  // square across the top, straight down to the shoulders, then a long taper to the point that
  // only goes concave near the tip; the left shoulder sits a hair lower than the right
  const body = `M${P([-0.5, -0.8])} Q${P([0.0, -0.93])} ${P([0.53, -0.83])} L${P([0.565, -0.26])}` +
    ` C${P([0.55, 0.1])} ${P([0.3, 0.42])} ${P([0.16, 0.66])} C${P([0.09, 0.78])} ${P([0.05, 0.88])} ${P([0.035, 0.97])}` +
    ` C${P([0.0, 0.88])} ${P([-0.05, 0.78])} ${P([-0.13, 0.66])} C${P([-0.3, 0.42])} ${P([-0.555, 0.1])} ${P([-0.54, -0.24])}Z`;
  const hx = 0.012, hy = -0.2, k = 0.17;
  const heart = `M${P([hx, hy + 0.75 * k])} C${P([hx - 1.25 * k, hy - 0.1 * k])} ${P([hx - 0.55 * k, hy - 1.02 * k])} ${P([hx, hy - 0.4 * k])}` +
    ` C${P([hx + 0.6 * k, hy - 1.05 * k])} ${P([hx + 1.3 * k, hy - 0.08 * k])} ${P([hx, hy + 0.75 * k])}Z`;
  return {
    parts: [{ d: body, role: "colour", hl: [-0.28, -0.36, 0.1, 0.2, 8] }],
    lines: [{ d: `M${P([0.016, -0.06])} L${P([0.035, 0.88])}`, w: 0.06 }],   // the slit
    drawnHoles: [heart],
    hang: [0.01, -0.88],
    hole: [0.01, -0.67], holeEdge: -0.88,
    gloss: `M${P([-0.42, -0.5])} Q${P([-0.42, -0.12])} ${P([-0.28, 0.16])}`,
  };
}

function horseshoe() {
  // forged, so not a perfect ring: widest across the quarters and tucked in at the heels the way a
  // real shoe is (a magnet runs straight), heavier over the crown, the right arm a touch shorter,
  // and the nails sitting unevenly in the groove
  const band = `M${P([-0.8, 0.74])} C${P([-0.93, 0.5])} ${P([-0.97, 0.2])} ${P([-0.95, -0.04])}` +
    ` C${P([-0.92, -0.56])} ${P([-0.5, -0.88])} ${P([0.0, -0.88])} C${P([0.54, -0.88])} ${P([0.95, -0.54])} ${P([0.95, -0.02])}` +
    ` C${P([0.95, 0.22])} ${P([0.9, 0.47])} ${P([0.79, 0.69])} L${P([0.42, 0.65])}` +
    ` C${P([0.52, 0.42])} ${P([0.55, 0.2])} ${P([0.54, 0.0])} C${P([0.52, -0.28])} ${P([0.3, -0.46])} ${P([0.0, -0.46])}` +
    ` C${P([-0.3, -0.46])} ${P([-0.53, -0.28])} ${P([-0.54, 0.02])} C${P([-0.55, 0.24])} ${P([-0.51, 0.46])} ${P([-0.4, 0.7])}Z`;
  // the fuller, the groove the nails sit in, running down the middle of the band and broken over
  // the crown where the hole is punched
  const fuller = `M${P([-0.6, 0.68])} C${P([-0.72, 0.44])} ${P([-0.76, 0.2])} ${P([-0.745, -0.02])} C${P([-0.73, -0.3])} ${P([-0.6, -0.5])} ${P([-0.34, -0.62])}` +
    ` M${P([0.33, -0.62])} C${P([0.6, -0.5])} ${P([0.75, -0.3])} ${P([0.745, -0.01])} C${P([0.745, 0.2])} ${P([0.7, 0.44])} ${P([0.6, 0.66])}`;
  const nails = [[-0.67, 0.5], [-0.75, 0.13], [-0.66, -0.36], [0.64, -0.38], [0.75, 0.08], [0.69, 0.43]].map(([x, y]) => [x, y, 0.062]);
  return {
    parts: [{ d: band, role: "colour" }],
    lines: [{ d: fuller, w: 0.045 }],
    dots: nails,
    hang: [0.0, -0.88],
    hole: [0.0, -0.67], holeEdge: -0.88,
    gloss: `M${P([-0.86, 0.28])} C${P([-0.88, 0.0])} ${P([-0.84, -0.3])} ${P([-0.66, -0.56])}`,
  };
}

function stopwatch() {
  // a pocket stopwatch: the bow it hangs from, the winding crown, a pusher at half past one, and
  // a bare dial with one stubby sweep hand a few seconds past twelve
  const cx = 0.0, cy = 0.22;
  const circle = (x, y, R) => `M${P([x, y - R])} A${R} ${R} 0 1 1 ${P([x, y + R])} A${R} ${R} 0 1 1 ${P([x, y - R])}Z`;
  const cap = roundPoly([[-0.17, -0.72], [0.18, -0.73], [0.18, -0.58], [-0.17, -0.58]], [0.3]).d;
  const stem = `M${P([-0.1, -0.46])} L${P([-0.1, -0.6])} L${P([0.11, -0.6])} L${P([0.11, -0.46])}Z`;
  const d = [Math.sin(45 * D), -Math.cos(45 * D)], q = [-d[1], d[0]];
  const pc = [cx + 0.8 * d[0], cy + 0.8 * d[1]];
  const corner = (a, b) => [pc[0] + d[0] * a + q[0] * b, pc[1] + d[1] * a + q[1] * b];
  const pusher = roundPoly([corner(-0.1, -0.065), corner(0.1, -0.06), corner(0.1, 0.06), corner(-0.1, 0.065)], [0.25]).d;
  const dc = [0.01, 0.23];
  const tick = (deg, len) => { const v = [Math.sin(deg * D), -Math.cos(deg * D)];
    return `M${P([dc[0] + v[0] * 0.505, dc[1] + v[1] * 0.505])} L${P([dc[0] + v[0] * (0.505 - len), dc[1] + v[1] * (0.505 - len)])}`; };
  const hv = [Math.sin(58 * D), -Math.cos(58 * D)];
  const hand = `M${P([dc[0] - hv[0] * 0.1, dc[1] - hv[1] * 0.1])} L${P([dc[0] + hv[0] * 0.38, dc[1] + hv[1] * 0.38])}`;
  const o = (deg) => onCircle(cx, cy, 0.66, deg);
  return {
    parts: [
      { d: circle(0, -0.87, 0.2), role: "accent" },
      { d: cap, role: "accent" },
      { d: stem, role: "accent" },
      { d: pusher, role: "accent" },
      { d: circle(cx, cy, 0.74), role: "colour" },
      { d: circle(dc[0], dc[1], 0.52), role: "metal" },
    ],
    lines: [
      { d: tick(0, 0.12) + tick(90, 0.09) + tick(180, 0.1) + tick(270, 0.09), w: 0.06 },
      { d: hand, w: 0.09, feature: true },
    ],
    dots: [[dc[0], dc[1], 0.075]],
    hang: [0.0, -1.07],
    hole: [0.0, -0.87], holeEdge: -1.07,
    gloss: `M${P(o(204))} A0.66 0.66 0 0 1 ${P(o(150))}`,
  };
}

const SHAPES = {
  star: star(), heart: heart(), moon: moon(), mirrorball: mirrorball(), coupe: coupe(),
  pick: pick(), note: note(), lightning: lightning(), snake: snake(),
  devil: devil(), horseshoe: horseshoe(), stopwatch: stopwatch(), nib: nib(),
};
export const TRINKET_IDS = Object.keys(SHAPES);

/* ---------------- the maker ---------------- */

const PEN = "#2b2722";
const TONGUE = "#b23a32";
let UID = 0;
const ellipse = ([x, y, rx, ry, rot], attrs) =>
  `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" transform="rotate(${rot} ${f(x)} ${f(y)})" ${attrs}/>`;
const glintPath = ([x, y, s]) => {
  const p = (a, b) => `${f(x + a * s)},${f(y + b * s)}`;
  return `M${p(0, -1)} L${p(0.17, -0.17)} L${p(0.78, 0)} L${p(0.17, 0.17)} L${p(0, 1)} L${p(-0.17, 0.17)} L${p(-0.72, 0)} L${p(-0.17, -0.17)}Z`;
};
const lineT = (l) => (l.tilt ? ` transform="rotate(${l.tilt} ${l.around[0]} ${l.around[1]})"` : "");

/* Drawn the way it would be made: each part coloured in and then inked in turn, so a part laid
   over another hides the line beneath it, the way a pen drawing does. { bare: true } is the same
   drawing as plain ink on the page (the reward board's not-yet-earned trace), with no edge, gloss
   or hole; { trace: true } is only its pencil outline, for one still owed; { noCord: true }
   leaves the hole empty, for a trinket shown off the strand. */
function shrink(S, r, id, o = {}) {
  const trace = !!o.trace, bare = trace || !!o.bare;
  const u = (px) => px / r;
  const pen = trace ? "var(--ink-soft)" : bare ? "var(--ink)" : PEN;
  const sw = u(Math.max(0.62, 0.092 * r));
  const off = `translate(-0.034 0.03)`;                    // coloured in a hair off the line
  const hp = u(Math.max(0.9, 0.11 * r));                    // the pencil's grain
  let defs = `<pattern id="${id}h" patternUnits="userSpaceOnUse" width="${f(hp)}" height="${f(hp)}" patternTransform="rotate(38)">` +
      `<rect width="${f(hp * 0.36)}" height="${f(hp)}" fill="#fff" opacity="0.2"/></pattern>` +
    `<linearGradient id="${id}e" gradientUnits="userSpaceOnUse" x1="-0.9" y1="-1" x2="0.8" y2="1">` +
      `<stop offset="0" stop-color="#fff" stop-opacity="0.85"/><stop offset="0.5" stop-color="#fff" stop-opacity="0.5"/>` +
      `<stop offset="1" stop-color="#fff" stop-opacity="0.3"/></linearGradient>`;
  const clip = (k) => { if (!defs.includes(`id="${id}c${k}"`)) defs += `<clipPath id="${id}c${k}"><path d="${S.parts[k].d}"/></clipPath>`; return `url(#${id}c${k})`; };
  let out = "";
  // the clear cut edge, under everything
  const rim = u(Math.max(0.85, 0.13 * r));
  if (!bare) S.parts.forEach((p) => { out += `<path d="${p.d}" fill="none" stroke="url(#${id}e)" stroke-width="${f(sw + rim)}" stroke-linejoin="round"/>`; });
  S.parts.forEach((p, k) => {
    if (trace) {
      // a pencil outline only, each part blanking the lines it is laid over
      out += `<path d="${p.d}" fill="var(--paper)" stroke="${pen}" stroke-width="${f(sw)}" stroke-linejoin="round"/>`;
      return;
    }
    if (p.role === "metal") {
      out += bare ? `<path d="${p.d}" fill="var(--bead)" opacity="0.22" transform="${off}"/>`
        : `<path d="${p.d}" fill="#fbf7ec"/>`;
    } else {
      out += `<path d="${p.d}" fill="var(--bead)" transform="${off}"${bare ? ` opacity="0.6"` : ""}/>` +
        (p.role === "accent" ? `<path d="${p.d}" fill="${PEN}" opacity="0.2" transform="${off}"/>` : "") +
        `<path d="${p.d}" fill="url(#${id}h)" transform="${off}"/>`;
    }
    if (k === 0 && S.facets) out += `<g clip-path="${clip(0)}">${S.facets.map((t) => `<path d="${t.d}" fill="#fff" opacity="${t.o}"/>`).join("")}</g>`;
    out += `<path d="${p.d}" fill="none" stroke="${pen}" stroke-width="${f(sw)}" stroke-linejoin="round" stroke-linecap="round"/>`;
  });
  (S.lines || []).forEach((l) => {
    const w = l.fine ? u(Math.max(0.4, 0.044 * r)) : u(Math.max(0.5, l.w * r * 0.85));
    const g = `<path d="${l.d}" fill="none" stroke="${pen}" stroke-width="${f(w)}" stroke-linecap="round" stroke-linejoin="round"${lineT(l)}/>`;
    out += "clip" in l ? `<g clip-path="${clip(l.clip)}">${g}</g>` : g;
  });
  // holes drawn into the picture (a nib's breather), left as bare plastic
  (S.drawnHoles || []).forEach((d) => { out += `<path d="${d}" fill="${bare ? "var(--paper)" : "#fbf7ec"}" stroke="${pen}" stroke-width="${f(u(Math.max(0.45, 0.05 * r)))}" stroke-linejoin="round"/>`; });
  (S.eyes || []).forEach((e) => { out += ellipse(e, `fill="${pen}"`); });
  (S.dots || []).forEach(([x, y, rr]) => { out += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(Math.max(rr, u(0.45)))}" fill="${pen}"/>`; });
  (S.bubbles || []).forEach(([x, y, rr]) => { out += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(Math.max(rr, u(0.5)))}" fill="none" stroke="${pen}" stroke-width="${f(u(0.45))}"/>`; });
  if (S.glint) out += `<path d="${glintPath(S.glint)}" fill="#fff" stroke="${pen}" stroke-width="${f(u(0.4))}" stroke-linejoin="round"/>`;
  if (S.tongue) out += `<path d="${S.tongue}" fill="none" stroke="${TONGUE}" stroke-width="${f(u(Math.max(0.5, 0.06 * r)))}" stroke-linecap="round"/>`;
  if (bare) return { svg: `<defs>${defs}</defs>${out}`, top: S.hang[1] };
  // the gloss the oven leaves, then the punched hole
  out += `<path d="${S.gloss}" fill="none" stroke="#fff" stroke-opacity="0.78" stroke-width="${f(u(Math.max(0.7, 0.09 * r)))}" stroke-linecap="round"/>`;
  const [hx, hy] = S.hole, hr = u(Math.max(0.55, 0.068 * r));
  out += `<circle cx="${f(hx)}" cy="${f(hy)}" r="${f(hr)}" fill="var(--paper)" stroke="${PEN}" stroke-opacity="0.6" stroke-width="${f(u(0.42))}"/>`;
  // the cord comes down over the edge above the hole and through it, the way a tag is strung
  const lift = (hy - (S.holeEdge ?? hy - 0.25)) + u(1.0);
  if (!o.noCord) {
    out += `<circle cx="${f(hx)}" cy="${f(hy)}" r="${f(hr * 1.25)}" fill="${PEN}" opacity="0.18"/>` +
      `<path d="M${f(hx)},${f(hy - lift)} L${f(hx)},${f(hy)}" stroke="#7a6743" stroke-opacity="0.5" stroke-width="${f(u(Math.max(1.1, 0.15 * r)))}" stroke-linecap="round"/>` +
      `<path d="M${f(hx)},${f(hy - lift)} L${f(hx)},${f(hy)}" stroke="#c8b28c" stroke-width="${f(u(Math.max(0.65, 0.085 * r)))}" stroke-linecap="round"/>`;
  }
  return { svg: `<defs>${defs}</defs>${out}`, top: hy - lift, hangAt: [hx, hy] };
}

/* One trinket in a strand's own coordinates: its punched hole directly under the cord at x, the
   charm swung `rot` degrees about it. cy is where the old flat trinkets centred, so a caller only
   swaps the drawing. Returns the markup and the point the cord has to reach. */
export function hangTrinket(id, x, cy, r, rot = 0, o = {}) {
  const S = SHAPES[id] || SHAPES.star;
  const made = shrink(S, r, `tk${++UID}`, o);
  const [px, py] = made.hangAt || S.hole;
  const a = (rot * Math.PI) / 180, Y = cy + py * r;
  const dy = (made.top - py) * r;                 // from the hole up to the cord's end
  const svg = `<g transform="translate(${f(x)} ${f(Y)}) rotate(${f(rot)}) scale(${f(r)}) translate(${f(-px)} ${f(-py)})">${made.svg}</g>`;
  return { svg, end: [x - dy * Math.sin(a), Y + dy * Math.cos(a)], hole: [x, Y] };
}

// Where a trinket's hole sits below its centre, in units of r: lets a caller hang it from a ring.
export const trinketHoleY = (id) => (SHAPES[id] || SHAPES.star).hole[1];

// One trinket on its own, centred on (cx, cy) and drawn without its cord: a glyph in a box.
export function trinketGlyph(id, cx, cy, r, o = {}) {
  const made = shrink(SHAPES[id] || SHAPES.star, r, `tk${++UID}`, { noCord: true, ...o });
  return `<g transform="translate(${f(cx)} ${f(cy)}) scale(${f(r)})">${made.svg}</g>`;
}
