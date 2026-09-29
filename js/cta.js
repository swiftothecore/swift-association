// Shared start-button contents and opt-in hover behaviour for the launchpad and Mastery pickers.
// Decorative layers never own the label, take pointer input, or enter the accessible name.
import { CTA_LABELS, CTA_MARKS } from "./config.js";
import { escapeHtml } from "./util.js";

// mulberry32: fixed draws from load to load, so hand-scattered art never re-deals on reload,
// without the lockstep patterns an index formula leaves between one property and the next.
const seededRandom = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
// Rain in two depths, laid out from the seeded generator rather than index arithmetic, so no
// run of drops repeats a spacing, start height or pace.
const rain = (count, seed) => {
  const rand = seededRandom(seed);
  return Array.from({ length: count }, () => `<i class="cta-drop" style="left:${(rand() * 100).toFixed(1)}%;` +
    `--drop-y:${Math.round(rand() * 56)}px;--drop-h:${(6 + rand() * 9).toFixed(1)}px;` +
    `--drop-delay:${(rand() * .5).toFixed(2)}s;--drop-duration:${(.42 + rand() * .24).toFixed(2)}s"></i>`).join("");
};
// Watercolour blotches: an irregular closed outline through noisy points round an ellipse,
// smoothed Catmull-Rom into curves. Drawn as real shapes rather than a blurred box scaled up,
// so the edge stays soft-cornered but has the darker tide line a wash dries with, and
// overlapping blotches deepen where they meet, as pigment does (see the multiply in CSS).
const blotch = (cx, cy, rx, ry, rand) => {
  const n = 9, pts = Array.from({ length: n }, (_, i) => {
    const a = i / n * Math.PI * 2 + rand() * .2, k = .87 + rand() * .24;
    return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k];
  });
  const at = (i) => pts[(i + n) % n], f = (v) => v.toFixed(1);
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return `${d}Z`;
};
// The live wash is a chain of seven blotches spaced so each overlaps only its neighbours:
// nowhere is paint more than two layers deep, which is what keeps the lettering at 4.7:1 or
// better over the darkest overlap. It is drawn across the full 600-unit strip and cropped, so
// a desktop button is painted end to end and a phone sees the middle of the same wash. Each
// blotch opens from its own centre, starting from the middle and spreading outward.
const rosePaint = (() => {
  const rand = seededRandom(1213);
  const live = [20, 118, 212, 305, 398, 494, 588].map((x, i) => {
    const d = blotch(x + rand() * 10 - 5, 28 + rand() * 10, 60 + rand() * 8, 24 + rand() * 12, rand);
    return `<path class="cta-wash-blot" style="--wash-delay:${(Math.abs(x - 300) / 300 * .35).toFixed(2)}s" d="${d}"/>`;
  }).join("");
  // Two faint dried washes and their tide lines stay on the paper at rest, so the finish is a
  // material before it is touched, like every other.
  const dried = [[248, 44, 70, 16], [372, 16, 58, 13], [70, 34, 60, 20], [540, 30, 56, 18]].map(([x, y, rx, ry]) => `<path d="${blotch(x, y, rx, ry, rand)}"/>`).join("");
  return `<svg class="cta-wash" viewBox="0 0 600 60" preserveAspectRatio="xMidYMid slice"><g class="cta-wash-dried">${dried}</g><g class="cta-wash-live">${live}</g></svg>`;
})();
// Ink press: a stamp impression rather than a glossy slab. At rest the ink has not taken
// evenly: pale specks where the paper shows through and a few faint mottled patches, all
// scattered across the full cropped strip so nothing repeats. On hover fresh ink soaks
// outward from an off-centre point (placed by placeInkBleed) and stays while the button is
// held: one main blot, satellites and a little spatter, spaced so no more than two layers
// ever overlap, which keeps the lettering above 4.5:1 over the deepest of it.
const inkStamp = (() => {
  const rand = seededRandom(1311);
  const specks = Array.from({ length: 110 }, () => `<circle cx="${(rand() * 600).toFixed(1)}" cy="${(rand() * 60).toFixed(1)}" r="${(.35 + rand() * rand() * 1.3).toFixed(2)}" opacity="${(.06 + rand() * .18).toFixed(2)}"/>`).join("");
  const mottle = [[90, 20, 80, 16], [330, 44, 110, 14], [520, 18, 70, 12]].map(([x, y, rx, ry]) => `<path opacity=".045" d="${blotch(x, y, rx, ry, rand)}"/>`).join("");
  const blots = [[300, 30, 112, 30, 0], [196, 20, 42, 16, .12], [404, 42, 46, 14, .18], [236, 50, 30, 9, .24], [372, 11, 34, 9, .28]]
    .map(([x, y, rx, ry, delay]) => `<path class="cta-ink-blot" style="--ink-delay:${delay}s" d="${blotch(x, y, rx, ry, rand)}"/>`).join("");
  const spatter = Array.from({ length: 9 }, () => {
    const a = rand() * Math.PI * 2, r = 70 + rand() * 90;
    return `<circle class="cta-ink-blot" style="--ink-delay:${(.3 + rand() * .15).toFixed(2)}s" cx="${(300 + Math.cos(a) * r * 1.4).toFixed(1)}" cy="${(30 + Math.sin(a) * r * .22).toFixed(1)}" r="${(1 + rand() * 2.2).toFixed(1)}"/>`;
  }).join("");
  return `<svg class="cta-ink" viewBox="0 0 600 60" preserveAspectRatio="xMidYMid slice"><g class="cta-ink-grain">${mottle}${specks}</g><g class="cta-ink-bleed">${blots}${spatter}</g></svg>`;
})();
// Fair-weather clouds, each its own shape and none repeated, kept to the top edge (some cut
// off by it, as clouds are by a window frame) and two small ones low at the corners, so the
// label's band stays clear sky. The strip is cropped, never stretched. [x, y, width, opacity]
const cloudPuff = (x, y, w, rand) => {
  // Bumps sit ON a flat base at y and rise from it, the middle one tallest.
  const n = 3 + Math.floor(rand() * 2), step = w / (n + 1), mid = (n - 1) / 2;
  const bumps = Array.from({ length: n }, (_, i) => {
    const r = step * (.62 + rand() * .3) * (Math.abs(i - mid) < 1 ? 1.25 : 1);
    return `<circle cx="${(x + step * (i + 1)).toFixed(1)}" cy="${(y - r * .85).toFixed(1)}" r="${r.toFixed(1)}"/>`;
  }).join("");
  return `${bumps}<rect x="${(x + step * .35).toFixed(1)}" y="${(y - step * .75).toFixed(1)}" width="${(w - step * .7).toFixed(1)}" height="${(step * .75).toFixed(1)}" rx="${(step * .37).toFixed(1)}"/>`;
};
const DAY_CLOUDS = [[8, 15, 46, .85], [118, 12, 30, .55], [206, 16, 58, .8], [318, 12.5, 34, .6], [402, 16, 52, .82], [500, 11, 28, .5], [548, 15, 44, .78], [70, 60, 26, .45], [476, 61, 30, .5]];
const dayClouds = (() => {
  const rand = seededRandom(1989);
  return `<svg class="cta-day-clouds" viewBox="0 0 600 60" preserveAspectRatio="xMidYMid slice">${DAY_CLOUDS.map(([x, y, w, o]) => `<g opacity="${o}">${cloudPuff(x, y, w, rand)}</g>`).join("")}</svg>`;
})();
// The storm front is its own bank, heavier and lower than the fair-weather clouds and never
// the same shapes darkened: a pale back row of billows under a dark front row, drawn along
// the top so it rolls in over the sky rather than being a grey copy of it.
const stormBank = (() => {
  // Each row is ragged in height as well as spacing, so the underside of the storm is torn
  // rather than a scalloped valance.
  const rand = seededRandom(2012), row = (y, spread, rMin, rMax, gapMin, gapMax, cls) => {
    let out = "";
    for (let x = -30 + rand() * 20; x < 640; x += gapMin + rand() * (gapMax - gapMin)) out += `<circle cx="${x.toFixed(1)}" cy="${(y + rand() * spread).toFixed(1)}" r="${(rMin + rand() * (rMax - rMin)).toFixed(1)}"/>`;
    return `<g class="${cls}">${out}</g>`;
  };
  return `<svg class="cta-storm-clouds" viewBox="0 0 600 40" preserveAspectRatio="xMidYMin slice">${row(6, 14, 10, 24, 14, 34, "cta-storm-back")}${row(-4, 12, 8, 20, 12, 30, "cta-storm-front")}</svg>`;
})();
const bolt = `<svg class="cta-lightning" viewBox="0 0 48 60" aria-hidden="true"><path class="cta-bolt-halo" d="M28 -2L24 9L28 15L20 23L24 29L16 39L19 44L10 60M24 29L33 33L35 40L43 44M24 9L15 15L12 22"/><path class="cta-bolt-core" d="M28 -2L24 9L28 15L20 23L24 29L16 39L19 44L10 60"/><path class="cta-bolt-branch" d="M24 29L33 33L35 40L43 44M24 9L15 15L12 22"/></svg>`;
const FLOWER_COLOURS = ["#fff1c7", "#f3a48e", "#e99abd", "#b9a0de", "#95c9e3", "#edc45f", "#d8788d", "#d9c8ef"];
const FLOWER_HEADS = [
  // Daisy, tulip and poppy, sized to stay readable in the little Mastery swatches.
  `<ellipse rx="1.6" ry="4.5"/><ellipse rx="1.6" ry="4.5" transform="rotate(60)"/><ellipse rx="1.6" ry="4.5" transform="rotate(120)"/><circle r="1.6" fill="#d4a63e"/>`,
  `<path d="M-4 -4L-1 -1L0 -5L2 -1L4 -4Q5 4 0 4Q-5 4 -4 -4Z"/><path d="M0 3L0 -1" fill="none"/>`,
  `<path d="M0 -3C-5 -7 -7 0 -3 2C-4 7 3 7 3 3C8 2 5 -5 0 -3Z"/><circle r="1.5" fill="#65504c"/>`,
];
// Each flower is its own little drawing at its real size, placed by percentage, so no button
// width can stretch a head out of shape. The spots are deliberately uneven and reach into the
// middle, but only the outer flowers stand tall: on a phone the label wraps across nearly the
// whole face, so everything inward of the edges stays low in the grass to pass under it.
// [left %, head height, head scale, head kind]. The breeze delay follows the left edge, so the wind crosses the strip.
const MEADOW_FLOWERS = [[3, 17, 1.35, 0], [10.5, 12, 1.2, 2], [24, 8, 1.05, 1], [41, 7, 1, 0], [60, 7.5, 1, 2], [79, 8, 1.05, 1], [93.5, 12.5, 1.3, 0]];
const flower = ([left, h, scale, kind], i) => `<svg class="cta-flower" viewBox="-9 -27 18 27" style="left:calc(${left}% - 9px);--flower-delay:${(i * 0.07).toFixed(2)}s;--wind-delay:${(left / 100 * 0.6).toFixed(2)}s;--flower-colour:${FLOWER_COLOURS[i]}"><g class="cta-flower-sway"><path d="M0 0C${i % 2 ? 1 : -1} ${-h / 2} 0 ${-h * .7} 0 ${-h}M0 ${-h * .35}q${i % 2 ? 4 : -4} -1 ${i % 2 ? 4 : -4} -4" class="cta-flower-stem"/><g class="cta-petals" transform="translate(0 ${-h}) scale(${scale})" stroke="#785e32" stroke-width=".5">${FLOWER_HEADS[kind]}</g></g></svg>`;
// A 600-unit strip drawn at 1:1 and cropped from the middle, never stretched. Blades scatter
// in height, lean, curl, weight and spacing, in two greens for depth, and cluster into tufts;
// each carries a delay from its position so the breeze travels across instead of the whole
// strip shearing at once.
const grassBlades = (() => {
  const rand = seededRandom(1310), blades = [];
  for (let x = 1; x < 600;) {
    const tuft = 1 + Math.floor(rand() * 4);
    for (let t = 0; t < tuft; t++) {
      const bx = x + t * (1.2 + rand() * 2.2), h = 6 + rand() * 12, lean = rand() * 7 - 3, curl = rand() * 6 - 3;
      blades.push(`<path class="cta-blade${rand() < .35 ? " cta-blade--back" : ""}" style="--wind-delay:${(bx / 600 * 0.6).toFixed(2)}s;stroke-width:${(1 + rand() * .8).toFixed(2)}" d="M${bx.toFixed(1)} 31q${curl.toFixed(1)} ${(-h * .55).toFixed(1)} ${lean.toFixed(1)} ${(-h).toFixed(1)}"/>`);
    }
    x += 5 + rand() * 9;
  }
  return blades.join("");
})();
const garden = `<svg class="cta-garden" viewBox="0 0 600 30" preserveAspectRatio="xMidYMax slice">${grassBlades}</svg>${MEADOW_FLOWERS.map(flower).join("")}`;
// ---- The Seasons finish ---------------------------------------------------------------
// One Mastery pick, four finishes: settings.masteryButton holds "seasons", and app.js resolves
// it through js/season.js to whichever of spring/summer/autumn/winter the player is living in,
// so the button changes on the first of March, June, September and December (the other way
// round in a southern timezone), exactly when the desk calendar's marks do. Each season is a
// quiet material at rest and its own weather on hover, which runs a few seconds and holds.
const f = (n, d = 1) => Number(n).toFixed(d);
const bump = (x, c, w) => Math.exp(-(((x - c) / w) ** 2));
// A tapered limb: a Catmull-Rom spine through [x, y, width] points, outlined and filled, so a
// branch thins from trunk to tip the way wood does instead of being one even stroke.
const limb = (pts, steps = 8) => {
  const at = (i) => pts[Math.max(0, Math.min(pts.length - 1, i))], spine = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    for (let s = 0; s < steps; s++) {
      const t = s / steps, t2 = t * t, t3 = t2 * t;
      const cr = (k) => .5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3);
      spine.push([cr(0), cr(1), p1[2] + (p2[2] - p1[2]) * t]);
    }
  }
  spine.push(pts[pts.length - 1]);
  const L = [], R = [];
  spine.forEach((p, i) => {
    const a = spine[Math.max(0, i - 1)], b = spine[Math.min(spine.length - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1]; const len = Math.hypot(dx, dy) || 1; dx /= len; dy /= len;
    const h = p[2] / 2;
    L.push([p[0] - dy * h, p[1] + dx * h]); R.push([p[0] + dy * h, p[1] - dx * h]);
  });
  return "M" + [...L, ...R.reverse()].map(([x, y]) => `${f(x, 2)} ${f(y, 2)}`).join("L") + "Z";
};
const ridge = (fn, w, h, step = 6) => {
  let d = `M0 ${f(fn(0), 2)}`;
  for (let x = step; x <= w; x += step) d += `L${x} ${f(fn(x), 2)}`;
  return `${d}V${h}H0Z`;
};

// Spring: cherry boughs in bud; on hover they open, sway, and shed petals on the wind.
const PETAL_TINTS = ["#fbe0e8", "#f7cad7", "#f3b8ca", "#fff4f7", "#efa6bc"];
const PETAL = "M0 0C-3.6 -1.4 -4.3 -6.6 -1.5 -8.5L0 -7.4L1.4 -8.6C4.3 -6.8 3.8 -1.5 0 0Z";
const blossom = (rand, tint) => {
  const turn = rand() * 72;
  let petals = "", veins = "";
  for (let i = 0; i < 5; i++) {
    const a = turn + i * 72 + (rand() * 16 - 8), k = .86 + rand() * .26;
    petals += `<path fill="${tint}" transform="rotate(${f(a)}) scale(${f(k, 2)})" d="${PETAL}"/>`;
    veins += `<path transform="rotate(${f(a)})" d="M0 -1.2L0 -4.2"/>`;
  }
  let stamens = "", tips = "";
  for (let i = 0; i < 8; i++) {
    const a = rand() * Math.PI * 2, r = 2.4 + rand() * 1.5, x = Math.cos(a) * r, y = Math.sin(a) * r;
    stamens += `M0 0L${f(x)} ${f(y)}`; tips += `<circle cx="${f(x)}" cy="${f(y)}" r=".45"/>`;
  }
  return `<g class="cta-bloom">${petals}<g class="cta-petal-vein">${veins}</g><path class="cta-stamen" d="${stamens}"/><g class="cta-anther">${tips}</g><circle class="cta-bloom-eye" r="1.4"/></g>`;
};
const bud = (rand) => `<g class="cta-bud" transform="rotate(${f(rand() * 70 - 35)})"><path class="cta-calyx" d="M-1.5 2C-.9 .5 .9 .5 1.5 2L0 3.4Z"/><path class="cta-bud-shape" d="M0 1.6C-2.4 0 -2 -3.6 0 -5.2C2 -3.6 2.4 0 0 1.6Z"/></g>`;
// Each bough is its own drawing, never one flipped. Flowers are [x, y, scale, state], where
// state is "open" at rest or the delay at which that bud opens on hover.
const BOUGHS = {
  left: { w: 150, h: 56,
    limbs: [[[-8, 1, 6.4], [14, 9, 5.6], [37, 20, 4.4], [60, 20.5, 3.4], [86, 15, 2.4], [110, 11, 1.6], [132, 12.5, .7]],
            [[36, 19, 2.6], [33, 30, 1.9], [29, 41, 1.1], [27, 47, .5]],
            [[73, 17.5, 1.9], [81, 10, 1.3], [89, 4, .8], [94, 1, .4]],
            [[103, 12, 1.2], [111, 19, .8], [116, 23, .4]]],
    flowers: [[44, 27, 1.25, "open"], [31, 17, .95, .25], [55, 32, .9, .55], [28, 45, 1.05, "open"], [20, 36, .8, .75],
              [80, 19, 1.02, "open"], [69, 11, .82, .4], [91, 3.5, .86, .9], [114, 11, .86, .62], [120, 24, .72, "open"]],
    buds: [[40, 10], [62, 14], [100, 8], [129, 10], [108, 21]] },
  right: { w: 104, h: 50,
    limbs: [[[110, -3, 5.4], [92, 6, 4.3], [72, 14, 3.2], [50, 17, 2.2], [30, 17, 1.3], [15, 15, .5]],
            [[70, 14, 2.1], [67, 25, 1.4], [63, 35, .8], [61, 39, .4]],
            [[45, 17, 1.1], [39, 9, .7], [35, 5, .3]]],
    flowers: [[62, 39, 1.12, "open"], [71, 30, .86, .45], [52, 21, 1.02, "open"], [29, 20, .86, .8], [86, 10, .95, .3], [36, 5, .62, 1]],
    buds: [[17, 15], [79, 21], [42, 25]] },
};
const bough = (side, seed) => {
  const rand = seededRandom(seed), { w, h, limbs, flowers, buds } = BOUGHS[side];
  const wood = limbs.map((pts) => `<path class="cta-wood" d="${limb(pts)}"/>`).join("");
  const budMarks = buds.map(([x, y]) => `<g transform="translate(${x} ${y})">${bud(rand)}</g>`).join("");
  const blooms = flowers.map(([x, y, s, state]) => {
    const flower = blossom(rand, PETAL_TINTS[Math.floor(rand() * PETAL_TINTS.length)]);
    if (state === "open") return `<g transform="translate(${x} ${y}) scale(${s})">${flower}</g>`;
    return `<g transform="translate(${x} ${y}) scale(${s})"><g style="--open-at:${state}s">${bud(rand)}<g class="cta-opens">${flower}</g></g></g>`;
  }).join("");
  return `<svg class="cta-bough cta-bough--${side}" viewBox="0 0 ${w} ${h}" style="aspect-ratio:${w}/${h}"><g class="cta-bough-sway">${wood}${budMarks}${blooms}</g></svg>`;
};
const petalShower = (() => {
  const rand = seededRandom(415);
  return Array.from({ length: 30 }, () => {
    // Most petals leave from under the two boughs; the rest arrive on the wind from further up.
    const zone = rand();
    const left = zone < .45 ? 2 + rand() * 24 : zone < .72 ? 76 + rand() * 20 : 24 + rand() * 50;
    return `<i class="cta-petal" style="left:${f(left)}%;top:${f(-4 + rand() * 20)}px;--ps:${f(5 + rand() * 3)}px;` +
      `--pc:${PETAL_TINTS[Math.floor(rand() * PETAL_TINTS.length)]};--px:${f(46 + rand() * 70)}px;--pw:${f(rand() * 10 - 5)}px;` +
      `--pt:${f(2.4 + rand() * 1.5, 2)}s;--pd:${f(.5 + rand() * 2, 2)}s;--pf:${f(.9 + rand() * .8, 2)}s;--pr:${Math.round(rand() * 360)}deg"><b></b></i>`;
  }).join("");
})();
const petalSill = (() => {
  const rand = seededRandom(1204);
  const lay = (x, cls = "", land = 0) => `<ellipse class="${cls}" ${land ? `style="--land:${f(land, 2)}s"` : ""} cx="${f(x)}" cy="${f(5.5 + rand() * 3)}" rx="${f(2.2 + rand() * 1.2)}" ry="${f(1.2 + rand() * .5)}" fill="${PETAL_TINTS[Math.floor(rand() * 5)]}" stroke="#d98ea6" stroke-width=".4" transform="rotate(${Math.round(rand() * 60 - 30)} ${f(x)} 6)"/>`;
  let out = "";
  for (let i = 0; i < 12; i++) out += lay(rand() < .6 ? 30 + rand() * 130 : 450 + rand() * 120);
  for (let i = 0; i < 36; i++) out += lay(40 + rand() * 520, "cta-sill-late", 1.6 + rand() * 3.4);
  return `<svg class="cta-sill" viewBox="0 0 600 10" preserveAspectRatio="xMidYMax slice">${out}</svg>`;
})();
const spring = `<span class="cta-petalfall">${petalShower}</span>${petalSill}${bough("left", 31)}${bough("right", 77)}`;

// Summer: sea to the horizon over a sandy shore; on hover a wave washes up the sand.
// Sea to the horizon, a shore of sand along the sill. The shoreline is one function so the
// dry sand, the wet band and the wave's reach all follow the same curve.
const shore = (x) => 7.6 + 1.4 * Math.sin(x / 41) + 1.1 * Math.sin(x / 97 + 1.3) - 2.2 * bump(x, 90, 70) - 1.8 * bump(x, 520, 80);
const shoreLine = (fn) => { let d = `M0 ${f(fn(0), 2)}`; for (let x = 6; x <= 600; x += 6) d += `L${x} ${f(fn(x), 2)}`; return d; };
// The sand, the band of damp sand at the water's edge, and a soak mark that shows where the
// last wave reached: it appears as the water pulls back and dries out before the next.
const REACH = 5.2;
const soakEdge = (x) => shore(x) + REACH + .7 * Math.sin(x / 11) + .5 * Math.sin(x / 4.7);
const soakPath = `M0 ${f(shore(0), 2)}${shoreLine(shore).slice(shoreLine(shore).indexOf("L"))}` +
  Array.from({ length: 101 }, (_, i) => 600 - i * 6).map((x) => `L${x} ${f(soakEdge(x), 2)}`).join("") + "Z";
const sandLace = (() => {
  const rand = seededRandom(909);
  let dots = "";
  for (let x = 2; x < 600; x += 2.5 + rand() * 4.5) dots += `<circle cx="${f(x)}" cy="${f(soakEdge(x) - .4 - rand() * 1.4)}" r="${f(.35 + rand() * .55, 2)}"/>`;
  return `<g class="cta-lace-left">${dots}<path d="${shoreLine((x) => soakEdge(x) - .3)}"/></g>`;
})();
const sand = `<svg class="cta-sand" viewBox="0 0 600 20" preserveAspectRatio="xMidYMax slice"><path class="cta-sand-dry" d="${ridge(shore, 600, 20)}"/><path class="cta-sand-damp" d="${ridge(shore, 600, 20).replace(/V20H0Z$/, "")}${Array.from({ length: 101 }, (_, i) => 600 - i * 6).map((x) => `L${x} ${f(shore(x) + 2.4 + .5 * Math.sin(x / 9), 2)}`).join("")}Z"/><path class="cta-sand-soak" d="${soakPath}"/>${sandLace}</svg>`;
// The water itself comes up the beach. It is solid and joined to the sea, painted in the sea's
// own colour going pale in the shallows, and it ends in a foam lip with a second, broken line
// of foam riding just behind it. Only its front is ever seen: the element runs up well into
// the sea, so pushing it down the sand leaves nothing but more sea behind it.
const wash = (() => {
  const rand = seededRandom(707), top = 9, lip = (x) => top + shore(x) - .2 + .6 * Math.sin(x / 17 + 1) + .4 * Math.sin(x / 6.1);
  const trail = (x) => lip(x) - 2.6 - .8 * Math.sin(x / 9 + 2);
  let bubbles = "";
  for (let x = 1; x < 600; x += 2 + rand() * 5) bubbles += `<circle cx="${f(x)}" cy="${f(lip(x) - 1.2 - rand() * 3.4)}" r="${f(.3 + rand() * .7, 2)}"/>`;
  // the trailing foam is broken into runs, never one even line
  let runs = "";
  for (let x = 0; x < 600;) {
    const len = 14 + rand() * 40, gap = 5 + rand() * 18;
    let d = `M${f(x)} ${f(trail(x), 2)}`;
    for (let xx = x + 3; xx < Math.min(600, x + len); xx += 3) d += `L${f(xx)} ${f(trail(xx), 2)}`;
    runs += `<path d="${d}" stroke-width="${f(.7 + rand() * .8, 2)}"/>`;
    x += len + gap;
  }
  return `<svg class="cta-surf" viewBox="0 0 600 ${top + 20}" preserveAspectRatio="xMidYMax slice">` +
    `<defs><linearGradient id="__SURF__" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${top + 12}"><stop class="cta-surf-deep" offset="0" stop-opacity="0"/><stop class="cta-surf-deep" offset=".32"/><stop class="cta-surf-shallow" offset="1"/></linearGradient></defs>` +
    `<path class="cta-surf-water" fill="url(#__SURF__)" d="M0 0L0 ${f(lip(0), 2)}${shoreLine(lip).slice(shoreLine(lip).indexOf("L"))}L600 0Z"/>` +
    `<g class="cta-surf-trail">${runs}</g><g class="cta-surf-bubbles">${bubbles}</g><path class="cta-surf-lip" d="${shoreLine(lip)}"/></svg>`;
})();
const glints = (() => {
  const rand = seededRandom(1116);
  return Array.from({ length: 18 }, () => `<i class="cta-glint" style="left:${f(2 + rand() * 94)}%;top:${f(30 + rand() * 36)}%;width:${f(3 + rand() * 7)}px;--g0:${f(.08 + rand() * .3, 2)};--gd:${f(rand() * 1.4, 2)}s"></i>`).join("");
})();
const sailboat = `<svg class="cta-boat" viewBox="0 0 20 15"><path d="M9.6 1L9.6 11.4" stroke="#274a50" stroke-width=".8"/><path d="M9 1.6L9 10.2L2.6 10.2Z" fill="#fbf7ee" stroke="#274a50" stroke-width=".5"/><path d="M10.3 3.2L10.3 10.2L15.4 10.2Z" fill="#ef8a6c" stroke="#274a50" stroke-width=".5"/><path d="M2.4 11.2L17.6 11.2L15.6 13.6L4.6 13.6Z" fill="#274a50"/></svg>`;
const gull = (cls) => `<svg class="cta-gull ${cls}" viewBox="0 0 14 6"><path d="M.6 4.8C2.2 1.6 4.8 1.2 7 4C9.2 1 11.8 1.4 13.4 4.4" fill="none" stroke="var(--gull)" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const starfish = `<svg class="cta-starfish" viewBox="-7 -7 14 14"><path d="M0 -6.4L1.6 -2.1L6.2 -2L2.5 .9L3.9 5.4L0 2.8L-3.9 5.2L-2.6 .8L-6.1 -2.1L-1.6 -2.2Z" fill="#e98763" stroke="#a9502f" stroke-width=".6" stroke-linejoin="round"/><g fill="#fbd2b8"><circle cx="0" cy="-3.4" r=".5"/><circle cx="2.6" cy=".2" r=".5"/><circle cx="-2.5" cy=".3" r=".5"/><circle cx="1.6" cy="3" r=".45"/><circle cx="-1.6" cy="3" r=".45"/></g></svg>`;
const shell = `<svg class="cta-shell" viewBox="-7 -7 14 12"><path d="M0 4C-3.8 3.4 -6.4 .4 -6 -2.6C-4.6 -5.4 4.6 -5.4 6 -2.6C6.4 .4 3.8 3.4 0 4Z" fill="#f7e4d2" stroke="#b58867" stroke-width=".6"/><path d="M0 3.6L0 -4.2M0 3.6L-2.6 -4M0 3.6L2.6 -4M0 3.6L-4.6 -2.8M0 3.6L4.6 -2.8" stroke="#c99b78" stroke-width=".5" fill="none"/><path d="M-1.6 4.6L1.6 4.6L1 3.6L-1 3.6Z" fill="#e8c8ab" stroke="#b58867" stroke-width=".5"/></svg>`;
const tideArt = `${glints}${sailboat}${gull("cta-gull--a")}${gull("cta-gull--b")}${sand}${starfish}${shell}${wash}`;

// Autumn: leaf litter on woodland green; on hover a gust, and two leaves let go of the twig.
const LEAF = {
  maple: { d: "M0 -10.5L1.8 -5.6L5.6 -7.9L5 -2.6L10.2 -2.3L7.4 .8L9.3 4.2L3.6 3.3L1.3 7.8L.5 4.4L-.6 4.5L-1.7 7.5L-3.4 3.4L-8.8 4.7L-7.1 1L-10 -2.5L-5 -2.8L-5.8 -8.1L-1.9 -5.3Z",
           v: "M0 10.6V-8.6M0 3.4L7.6 -1.3M0 3.4L-7.4 -1.5M0 -2L3.8 -5.8M0 -2L-3.9 -6" },
  oak:   { d: "M0 -10.4C2.6 -10.4 2.4 -7.6 3.8 -7C6.4 -6.4 4.6 -3.8 6.2 -2.8C8.8 -1.6 6.2 1.6 5.6 2.4C7.4 4.6 3.6 6.6 1.2 7.4L.4 8.2L-.6 8.2C-3 6.8 -7 5.2 -5.4 2.6C-6.4 1.8 -8.6 -1.2 -6.2 -2.4C-4.8 -3.6 -6.8 -6.2 -3.8 -6.8C-2.2 -7.4 -2.8 -10.4 0 -10.4Z",
           v: "M0 11V-9M0 -3L4.8 -4.6M0 -3L-4.6 -4.2M0 2L4.6 1M0 2L-4.4 1.2" },
  beech: { d: "M0 -10.4C4.8 -7.6 6.4 -.6 3.4 4.6C2.2 6.6 .9 7.8 0 8.6C-1 7.6 -2.6 6.4 -3.6 4.4C-6.2 -.8 -4.6 -7.6 0 -10.4Z",
           v: "M0 11V-9.4M0 -5L3 -6.8M0 -1.6L4 -3.6M0 1.8L3.6 .2M0 -3.4L-3 -5M0 0L-3.8 -1.8M0 3.4L-3.2 2" },
  ginkgo:{ d: "M0 8.8C-.3 4.6 -.4 1.8 -.9 -.2C-5.4 -1.6 -9 -4.4 -9.4 -7.6C-5.6 -10.2 -1.8 -9.8 -.2 -7.8L.3 -9.4C2 -10.4 6.4 -10.2 9.6 -7.2C8.6 -4 5.2 -1.4 .9 -.2C.4 1.8 .3 4.6 0 8.8Z",
           v: "M0 8.6V-.4M-.4 -.6L-6 -6.6M.4 -.6L6 -6.8M0 -.6L-2.4 -8M0 -.6L2.8 -8.4" },
};
const LEAF_TONES = [["#c65a2e", "#7a2f14"], ["#e0922f", "#8a5012"], ["#e8bb44", "#8e6c16"], ["#a9352b", "#5c1912"], ["#8f5d2f", "#4c3016"], ["#b9a43c", "#675717"], ["#d4702c", "#7d3a11"]];
const leafShape = (kind, [fill, vein]) => `<path d="${LEAF[kind].d}" fill="${fill}" stroke="${vein}" stroke-width=".55" stroke-opacity=".7"/><path class="cta-leaf-v" d="${LEAF[kind].v}" stroke="${vein}" stroke-width=".75" stroke-opacity=".75"/>`;
const pickLeaf = (rand) => {
  const kinds = ["maple", "maple", "oak", "beech", "beech", "ginkgo"];
  const kind = kinds[Math.floor(rand() * kinds.length)];
  const tone = kind === "ginkgo" ? LEAF_TONES[2] : LEAF_TONES[Math.floor(rand() * LEAF_TONES.length)];
  return leafShape(kind, tone);
};
// Leaf litter banked along the sill like the snow drift: one solid mound, deep at the ends and
// low under the label, with whole leaves lying along its crest and a few half-buried in it.
// Each leaf rustles when the gust reaches it, left to right.
const litterCrest = (x) => 16 - 8 * bump(x, 95, 72) - 8.8 * bump(x, 505, 78) - 2.4 * bump(x, 300, 120) - 3 * bump(x, 0, 36) - 3 * bump(x, 600, 36);
const litter = (() => {
  const rand = seededRandom(64), leaves = [];
  const density = (x) => Math.max(bump(x, 95, 90), bump(x, 505, 95));
  for (let x = -4; x < 604; x += 3.5 + rand() * 5 + 13 * (1 - density(x))) {
    leaves.push({ x, y: litterCrest(x) + rand() * 3.4 - .6, s: .5 + rand() * .28, leaf: pickLeaf(rand), buried: false });
  }
  for (let i = 0; i < 26; i++) {
    const x = rand() < .5 ? 30 + rand() * 140 : 430 + rand() * 150, top = litterCrest(x) + 4;
    if (top < 20) leaves.push({ x, y: top + rand() * (22 - top), s: .42 + rand() * .2, leaf: pickLeaf(rand), buried: true });
  }
  leaves.sort((a, b) => (a.buried - b.buried) || a.y - b.y);
  const body = leaves.map(({ x, y, s, leaf, buried }) =>
    `<g transform="translate(${f(x)} ${f(y)}) rotate(${Math.round(rand() * 360)}) scale(${f(s, 2)})"${buried ? ' opacity=".55"' : ""}><g class="cta-heap-leaf" style="--rd:${f(.3 + x / 600 * 1.1, 2)}s;--rt:${f((rand() < .5 ? -1 : 1) * (8 + rand() * 12))}deg">${leaf}</g></g>`).join("");
  return `<svg class="cta-litter" viewBox="0 0 600 22" preserveAspectRatio="xMidYMax slice"><path class="cta-litter-bed" d="${ridge(litterCrest, 600, 22)}"/>${body}</svg>`;
})();
// Curls of wind, the way a picture book draws a gust: a long stroke that turns over on itself
// at the end. Drawn on and then off from the tail, so each one passes rather than lingers.
const WINDS = [
  ["M-10 15C40 9 96 19 150 13C176 10 190 2 178 -1.6C166 -3.6 162 8 178 10", 1.4, .05],
  ["M250 49C300 45 356 52 410 46C438 42 446 33 434 31C422 30 420 42 434 44", 1.3, .4],
  ["M360 12C400 8 460 15 540 7C566 4 580 9 612 5", 1.2, .7],
  ["M-12 38C30 34 70 40 110 36", 1.5, 1.05],
];
const winds = `<svg class="cta-winds" viewBox="0 0 600 60" preserveAspectRatio="xMidYMid slice">${WINDS.map(([d, t, delay]) => `<path class="cta-wind" pathLength="100" d="${d}" style="--wt:${t}s;--wd:${delay}s"/>`).join("")}</svg>`;
const gust = (() => {
  const rand = seededRandom(1031);
  return Array.from({ length: 18 }, (_, i) => {
    const y0 = 2 + rand() * 30;
    return `<i class="cta-gust" style="--gs:${f(11 + rand() * 7)}px;--gy0:${f(y0)}px;--gy1:${f(rand() * 14 - 4)}px;--gy2:${f(rand() * 18 - 2)}px;--gy3:${f(4 + rand() * 18)}px;` +
      `--gt:${f(1.5 + rand() * 1.1, 2)}s;--gd:${f(.1 + i * .075 + rand() * .25, 2)}s;--gf:${f(.55 + rand() * .5, 2)}s;--gr:${Math.round(rand() * 360)}deg">` +
      `<span><svg viewBox="-11 -11 22 22">${pickLeaf(rand)}</svg></span></i>`;
  }).join("");
})();
// The twig holds three leaves. Two let go and land on the litter, the third only swings.
const twigLeaves = [
  // [kind, tone, x, y, size, rest angle, landed angle, land dx, land lift, delay, dur, holds]
  ["maple", LEAF_TONES[0], 20, 24, 16, 172, 404, -34, 10, .45, 1.9, false],
  ["beech", LEAF_TONES[2], 40, 27, 13, 196, 470, -62, 9, 1.05, 2.2, false],
  ["oak",   LEAF_TONES[3], 57, 10, 12, 128, 128, 0, 0, 0, 0, true],
];
const twig = `<span class="cta-twig"><svg viewBox="0 0 76 40"><g class="cta-twig-sway"><path class="cta-twig-wood" d="${limb([[80, -3, 3.2], [64, 5, 2.4], [48, 9.5, 1.8], [34, 13, 1.3], [21, 17, .7]])}"/><path class="cta-twig-wood" d="${limb([[50, 9, 1.3], [46, 15, 1], [41, 21, .5]])}"/><path class="cta-twig-wood" d="${limb([[64, 5, 1], [59, 6, .7], [57, 7, .4]])}"/></g></svg>` +
  twigLeaves.map(([kind, tone, x, y, s, r0, r1, lx, ly, d, t, holds]) =>
    `<i class="cta-fall${holds ? " cta-fall--holds" : ""}" style="--fx:${x}px;--fy:${y}px;--fs:${s}px;--fr0:${r0}deg;--fr1:${r1}deg;--lx:${lx}px;--ly:${ly}px;--fd:${d}s;--ft:${t}s"><span><svg viewBox="-11 -11 22 22">${leafShape(kind, tone)}</svg></span></i>`).join("") + `</span>`;
const autumn = `${winds}${gust}${litter}${twig}`;

// Winter: drifts and hoarfrost; on hover a snowstorm in three depths, and the drifts build.
// Hoarfrost feathered in from both top corners: spines with barbs at sixty degrees, each its
// own length, and every stroke drawn with pathLength=1 so the frost can creep further in while
// the storm blows and draw back when it passes.
const frost = (side, seed) => {
  const rand = seededRandom(seed), w = 110, h = 56, paths = [], ox = side === "left" ? -2 : w + 2, oy = -2;
  // At rest only the crystals nearest the corner are there, drawn solid; the rest grow in on
  // hover, in order of their distance from the corner, so the frost creeps rather than fades.
  const reach = 30 + rand() * 6;
  const grow = (x, y, ang, len, depth) => {
    const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
    const near = Math.hypot(x - ox, y - oy), far = Math.hypot(x2 - ox, y2 - oy);
    const rest = far < reach ? 0 : 1;
    paths.push(`<path pathLength="1" d="M${f(x)} ${f(y)}L${f(x2)} ${f(y2)}" stroke-width="${f([1.7, 1.15, .75, .5][depth], 2)}" style="--rest:${rest};--fz:${f(.1 + near / 80 * 1.6, 2)}s"/>`);
    if (depth > 2) return;
    const barbs = 3 + Math.floor(rand() * 3);
    for (let i = 1; i <= barbs; i++) {
      const t = i / (barbs + 1) + rand() * .08, bx = x + Math.cos(ang) * len * t, by = y + Math.sin(ang) * len * t;
      const bl = len * (.3 + rand() * .22) * (1 - t * .5);
      grow(bx, by, ang + Math.PI / 3 + rand() * .15, bl, depth + 1);
      grow(bx, by, ang - Math.PI / 3 - rand() * .15, bl * (.7 + rand() * .5), depth + 1);
    }
  };
  const spines = side === "left" ? [[.16, 58], [.52, 46], [.92, 32], [1.3, 22]] : [[Math.PI - .2, 50], [Math.PI - .6, 38], [Math.PI - 1.02, 26]];
  spines.forEach(([a, len]) => grow(ox, oy, a + rand() * .1, len * (.85 + rand() * .3), 0));
  return `<svg class="cta-frost cta-frost--${side}" viewBox="0 0 ${w} ${h}" style="aspect-ratio:${w}/${h}">${paths.join("")}</svg>`;
};
// Snow in three depths, blown on a slant: small soft far flakes drifting slow, a middle layer,
// and a few big near flakes that are drawn as real six-armed crystals and turn as they pass.
// Every flake spawns upwind of the face and leaves downwind, measured in the button's own
// width (cqw), so a phone and a desktop both get the whole slant.
const CRYSTAL = `<svg viewBox="-6 -6 12 12"><g stroke="#fff" stroke-width="1" stroke-linecap="round" fill="none"><path d="M0 -5.4V5.4M-4.7 -2.7L4.7 2.7M-4.7 2.7L4.7 -2.7"/><path d="M0 -3.4L-1.3 -4.6M0 -3.4L1.3 -4.6M0 3.4L-1.3 4.6M0 3.4L1.3 4.6M-2.9 -1.7L-4.7 -1.2M2.9 1.7L4.7 1.2M-2.9 1.7L-4.7 1.2M2.9 -1.7L4.7 -1.2" stroke-width=".8"/></g></svg>`;
const flurry = (layer, count, seed, [s0, s1], [t0, t1], crystals = 0) => {
  const rand = seededRandom(seed);
  return `<span class="cta-flurry cta-flurry--${layer}">${Array.from({ length: count }, (_, i) => {
    const t = t0 + rand() * (t1 - t0), reps = Math.ceil(4.6 / t), size = s0 + rand() * (s1 - s0);
    return `<i class="cta-flake${i < crystals ? " cta-flake--crystal" : ""}" style="--x0:${f(-40 + rand() * 120)}cqw;--fsz:${f(size)}px;--ft:${f(t, 2)}s;--fd:${f(rand() * t + .1, 2)}s;--fn:${reps};` +
      `--fw:${f(26 + rand() * 30)}cqw;--fsway:${f(rand() * 10 - 5)}px;--fspin:${Math.round(180 + rand() * 360)}deg">${i < crystals ? CRYSTAL : ""}</i>`;
  }).join("")}</span>`;
};
const DRIFT_BACK = (x) => 12.5 - 4.5 * bump(x, 130, 90) - 3.5 * bump(x, 400, 70) - 5 * bump(x, 580, 60) + 2 * bump(x, 290, 70);
const DRIFT_FRONT = (x) => 17 - 7 * bump(x, 40, 70) - 5.5 * bump(x, 230, 85) - 6.5 * bump(x, 490, 90) + 1.2 * bump(x, 360, 50);
const drifts = `<svg class="cta-drifts cta-drifts--back" viewBox="0 0 600 24" preserveAspectRatio="xMidYMax slice"><path d="${ridge(DRIFT_BACK, 600, 24)}"/></svg>` +
  `<svg class="cta-drifts cta-drifts--front" viewBox="0 0 600 24" preserveAspectRatio="xMidYMax slice"><path d="${ridge(DRIFT_FRONT, 600, 24)}"/><path class="cta-drift-line" d="M0 21.6C60 20.8 120 22 190 21.2S320 20.6 380 21.6S520 22 600 21"/></svg>`;
const storm = `<i class="cta-storm-sky"></i>${frost("left", 26)}${frost("right", 1213)}` +
  flurry("far", 46, 11, [1.2, 2], [2.2, 3.2]) + `<i class="cta-whiteout"></i><i class="cta-whiteout cta-whiteout--2"></i>` +
  flurry("mid", 30, 22, [2.2, 3.2], [1.3, 1.9]) + drifts + flurry("near", 12, 33, [7, 10], [.95, 1.35], 6);


// Every copy of the summer finish gets its own gradient id: the home button and the Mastery
// swatches are all on the page together, and a url(#id) that resolves to a copy inside a
// hidden screen paints nothing.
let surfSerial = 0;
const tide = () => tideArt.replaceAll("__SURF__", `ctaSurf${++surfSerial}`);

// Two separately drawn vines, never one vine flipped: each is rooted in its own bottom corner
// (the stem's first point, which is also its hover pivot) and the right one is shorter and
// sparser, so the pair reads as grown rather than printed. Leaves are [x, y, rotate, scale].
const IVY_VINES = {
  left: { w: 110, h: 64, root: [4, 59],
    stem: "M4 59C30 47 9 27 31 13S75 17 104 2.5M26 21Q52 23.5 66 38M34 12Q48 2.5 72 3.5",
    leaves: [[10,49.5,-37,.98],[20,37.5,32,.98],[19,24.5,-52,.98],[32,14,27,.98],[45,11.5,-25,.98],[62,14,37,.98],[80,9.5,-35,.98],[97,4.5,42,.98],[46,25,-20,.98],[61,35,22,.98],[60,3.5,-30,.98]] },
  right: { w: 96, h: 70, root: [92, 64],
    stem: "M92 64C68 59 87 40 67 27S38 23 13 10M71 33Q55 37 49 50M57 24Q50 12 33 12",
    leaves: [[86,55,40,1.05],[77,44,-20,.9],[81,31,55,1],[66,24,-15,1.1],[51,20,30,.95],[36,17,-30,.9],[21,12,20,.85],[53,41,-25,1],[47,49,15,.8],[35,11,-45,.9]] },
};
const IVY_GREENS = ["#45643d", "#63834c", "#78905a"];
const ivyVine = (side) => {
  const { w, h, root, stem, leaves } = IVY_VINES[side];
  const shade = side === "left" ? 0 : 1;
  return `<svg class="cta-ivy cta-ivy--${side}" viewBox="0 0 ${w} ${h}" style="aspect-ratio:${w}/${h}"><g class="cta-ivy-stem" style="transform-origin:${root[0]}px ${root[1]}px"><path d="${stem}" fill="none" stroke="#425332" stroke-width="2"/>${leaves.map(([x, y, r, s], i) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><g class="cta-ivy-leaf" style="--ivy-delay:${(i * .037).toFixed(3)}s;--ivy-turn:${-7 - (i + shade) % 3 * 4}deg"><path d="M0 10C-3 5 -10 4 -9 -2L-5 -1L-3 -9L1 -6L6 -10L7 -3L12 -1C10 6 4 5 0 10Z" fill="${IVY_GREENS[(i + shade) % 3]}" stroke="#344d31" stroke-width=".65"/><path d="M0 9L1 -5M0 4L-5 0M0 3L7 -1" fill="none" stroke="#b5c38a" stroke-width=".6" opacity=".7"/></g></g>`).join("")}</g></svg>`;
};
const ivy = ivyVine("left") + ivyVine("right");
const FINISH_ART = {
  ink: inkStamp,
  rose: rosePaint,
  sky: `${dayClouds}${stormBank}<span class="cta-rain cta-rain--far">${rain(18, 1311)}</span><span class="cta-rain">${rain(24, 1989)}</span>${bolt}`,
  meadow: garden,
  ivy,
  spring,
  summer: tide,
  autumn,
  winter: storm,
  pride: `<i class="cta-ribbon"></i>`,
};

// Gold's hover is a marker stroke dragged across the button, and it carries its own copy of
// the words, in cream. The fx layer sits ABOVE the real label for this finish, so wherever the
// stroke has reached it covers the dark lettering and shows the cream copy riding inside it,
// held still by an equal and opposite slide. Each letter therefore turns at the moment the ink
// reaches it. Changing the label's colour on its own clock could not do that: it turned the
// whole label cream while half of it still sat on gold, which is about 1.6:1.
const goldStroke = (words) => `<i class="cta-stroke"><span class="cta-stroke-copy"><span class="cta-copy-label">${words}</span><i class="cta-stroke-line"></i></span></i>`;

export function ctaContentHTML(labelId = "", finish = "") {
  const opt = labelId ? CTA_LABELS[labelId] : null;
  // No chosen words means the default, which wears the drawn pencil (the one mark that wiggles).
  const markId = opt ? opt.mark : "pencil";
  const mark = markId ? `<span class="cta-mark${opt ? "" : " cta-mark--pencil"}" aria-hidden="true">${CTA_MARKS[markId] || ""}</span>` : "";
  const words = `${mark}${opt ? escapeHtml(opt.text) : "Start writing"}`;
  const key = finish.startsWith("pride-") ? "pride" : finish;
  const drawn = FINISH_ART[key];
  const art = typeof drawn === "function" ? drawn() : drawn ?? goldStroke(words);
  return `<span class="cta-fx" aria-hidden="true">${art}</span><span class="cta-label">${words}</span>`;
}


// Lightning strikes only in the clear sky either side of the lettering, never through it: a
// white bolt behind cream text blinds the label at the one moment the player is looking. The
// label is measured as it sits (its mark included, since every mark is a child of it), and the
// bolt narrows to fit a thin gutter. When neither side has room for
// even a narrow bolt, as with a long label on a phone, the storm simply comes without one.
// Each strike also lands well away from the last.
const BOLT_W = 43, BOLT_MIN_W = 22, BOLT_PAD = 8;
function placeStrike(cta) {
  const box = cta.getBoundingClientRect(), label = cta.querySelector(".cta-label")?.getBoundingClientRect();
  if (!label || !box.width || !cta.offsetWidth) return;
  const k = cta.offsetWidth / box.width; // undo a preview's scale: work in the button's own pixels
  const width = cta.offsetWidth;
  const left = (label.left - box.left) * k - BOLT_PAD;
  const right = (label.right - box.left) * k + BOLT_PAD;
  const bolt = Math.min(BOLT_W, Math.max(left, width - right));
  if (bolt < BOLT_MIN_W) { cta.classList.add("cta-no-bolt"); return; }
  cta.classList.remove("cta-no-bolt");
  const spots = [];
  if (left >= bolt) spots.push([0, left - bolt]);
  if (width - right >= bolt) spots.push([right, width - bolt]);
  const span = spots.reduce((sum, [a, b]) => sum + b - a, 0);
  const before = parseFloat(cta.style.getPropertyValue("--cta-bolt-left"));
  let x = 0;
  for (let tries = 0; tries < 12; tries++) {
    let pick = Math.random() * span;
    for (const [a, b] of spots) { if (pick <= b - a) { x = a + pick; break; } pick -= b - a; }
    if (Number.isNaN(before) || Math.abs(x - before) >= width / 5) break;
  }
  cta.style.setProperty("--cta-bolt-left", `${x.toFixed(1)}px`);
  cta.style.setProperty("--cta-bolt-w", `${bolt.toFixed(1)}px`);
}

// Delegate to the actual clickable control, including a preview's enclosing picker row.
// Crossing a label, icon or empty patch inside it must not deal a second set of colours.
// Nothing persists: a hover changes only this rendered button's decorative CSS properties.
const boundRoots = new WeakSet();
export function initCtaInteractions(root = document) {
  if (boundRoots.has(root)) return;
  boundRoots.add(root);
  const controlFor = (target) => target instanceof Element
    ? target.closest("button.play-cta, .rb-sw-col, .rb-row") : null;
  const refresh = (control) => {
    const cta = control.matches(".play-cta") ? control : control.querySelector(".play-cta");
    if (!cta) return;
    if (cta.dataset.startbtn === "sky") placeStrike(cta);
    // A fresh brushstroke each time: the same wash, laid a little along and at a new angle.
    // Fresh ink lands somewhere new each press, to one side or the other of the middle.
    else if (cta.dataset.startbtn === "ink") {
      const side = Math.random() < .5 ? -1 : 1;
      cta.style.setProperty("--ink-x", `${(side * (40 + Math.random() * 120)).toFixed(1)}px`);
      cta.style.setProperty("--ink-turn", `${(Math.random() * 8 - 4).toFixed(2)}deg`);
    }
    else if (cta.dataset.startbtn === "rose") {
      cta.style.setProperty("--wash-x", `${(Math.random() * 60 - 30).toFixed(1)}px`);
      cta.style.setProperty("--wash-turn", `${(Math.random() * 5 - 2.5).toFixed(2)}deg`);
    } else if (cta.dataset.startbtn === "meadow") {
      // One hand of colours per hover: no two flowers share one, and none keeps its last.
      const flowers = [...cta.querySelectorAll(".cta-flower")];
      const before = flowers.map((flower) => flower.style.getPropertyValue("--flower-colour").trim());
      let deal = [];
      for (let tries = 0; tries < 30; tries++) {
        deal = [...FLOWER_COLOURS].sort(() => Math.random() - .5).slice(0, flowers.length);
        if (deal.every((colour, i) => colour !== before[i])) break;
      }
      if (deal.some((colour, i) => colour === before[i])) {
        const at = (colour) => FLOWER_COLOURS.indexOf(colour);
        deal = before.map((colour) => FLOWER_COLOURS[(at(colour) + 1) % FLOWER_COLOURS.length]);
      }
      flowers.forEach((flower, i) => flower.style.setProperty("--flower-colour", deal[i]));
    }
  };
  root.addEventListener("pointerover", (event) => {
    if (event.pointerType === "touch") return;
    const control = controlFor(event.target);
    if (control && control !== controlFor(event.relatedTarget)) refresh(control);
  });
  root.addEventListener("focusin", (event) => {
    const control = controlFor(event.target);
    // Pointer focus follows pointerover; only keyboard focus should make a second deal.
    if (control?.matches(":focus-visible")) refresh(control);
  });
}
