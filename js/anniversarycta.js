// The album-anniversary Start writing button: twelve finishes, one per studio album, and the
// rule that puts each on the button on its album's release day.
//
// THE FINISH IS FORCED, AND THAT IS THE POINT. On each album's anniversary the button wears
// that album's finish over whatever the player has chosen: Seasons, the gold marker, any
// Mastery finish, the random roll. It is there to show support for the album on its release
// day, the notebook dressing up for her record the way a fan does, and support you can switch
// off would only be a theme. It lasts the one day and hands the button straight back, and it
// never touches the stored choice, so nothing is lost by it.
//
// Every finish is drawn on a 600 x 60 strip cropped from the middle, never stretched, exactly as
// js/cta.js draws its own. The art was designed on scripts/cta/chosen-board.html; change a
// finish there first and carry it across, so the board and the button do not drift apart.
import { TS_MILESTONES } from "./config.js";

const R = (seed) => () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const f = (n) => String(Math.round(n * 100) / 100);
// Every strip is drawn 600 x 60 and cropped from the middle, never stretched, the way js/cta.js
// draws its finishes. At the desktop width about 18..582 shows; at a phone width about 127..473.
// The label sits in roughly 205..395, so anything that must not cross the words stays outside it.
const strip = (cls, inner, extra = '') => `<svg class="anv-fill ${cls}" viewBox="0 0 600 60" preserveAspectRatio="xMidYMid slice" ${extra}>${inner}</svg>`;
// Single quotes survive encodeURIComponent, and the style attributes these land in are single-quoted.
const svgUrl = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg).replace(/'/g, '%27')}")`;
let serial = 0;
/* ---- Taylor Swift: Screen door ---- */
function debutPorch() {
  const rand = R(1024);
  // A summer dusk seen through a screen door: a low line of trees across the field, fireflies
  // coming out in front of it, and the fine mesh of the screen over all of it.
  let trees = `<rect x="-10" y="55" width="620" height="8"/>`;
  for (let x = -10; x < 615; x += 6 + rand() * 6) {
    const mid = x > 205 && x < 395, r = mid ? 2.2 + rand() * 2 : 4 + rand() * 5.5;
    trees += `<circle cx="${f(x)}" cy="${f((mid ? 57 : 54) - rand() * 2)}" r="${f(r)}"/>`;
  }
  const spots = [[4, 30], [9, 14], [13, 40], [18, 24], [24, 10], [29, 38], [33, 18], [68, 20], [72, 38], [77, 12], [82, 30], [87, 16], [92, 40], [96, 24]];
  const flies = spots.map(([l, t], i) => `<i class="anv-firefly${i % 5 === 1 ? ' rest' : ''}" style="left:${l}%;top:${t}px;--d:${f(rand() * 1.2)}s;--t:${f(1.1 + rand() * .8)}s;--fx:${f(rand() * 16 - 8)}px;--fy:${f(-4 - rand() * 10)}px"></i>`).join('');
  return { fx: strip('anv-field', `<g class="anv-treeline">${trees}</g>`) + flies + `<i class="anv-mesh"></i>` };
}

/* ---- Fearless ---- */
function fearless() {
  const id = `anvSq${++serial}`, dx = 7.4, dy = 5.6, r = 4.3, rand = R(1111);
  const ONE = ['.X.', 'XX.', '.X.', '.X.', 'XXX'], THREE = ['XXX', '..X', '.XX', '..X', 'XXX'];
  const c0 = 65, r0 = 3, mark = new Set();
  for (let row = 0; row < 5; row++) [...(ONE[row] + '.' + THREE[row])].forEach((ch, k) => { if (ch === 'X') mark.add(`${c0 + k},${r0 + row}`); });
  const pos = (c, row) => [c * dx + (row % 2 ? dx / 2 : 0) - 6, row * dy + 1];
  // Every sequin sits at its own slight angle to the light, so each gets one of three
  // highlights (the same one on both faces): a regular grid of identical discs is honeycomb.
  let cols = '', fixed = '';
  for (let c = 0; c <= 83; c++) {
    let a = '', b = '';
    for (let row = 0; row < 12; row++) {
      const [x, y] = pos(c, row), roll = rand(), v = roll < .11 ? 'l' : roll < .26 ? 'd' : '';
      const circ = (side, tone = v) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="url(#${id}${side}${tone})"/>`;
      if (mark.has(`${c},${row}`)) fixed += circ('b', ''); else { a += circ('a'); b += circ('b'); }
    }
    cols += `<g style="--d:${c * 11}ms"><g class="anv-sq-a">${a}</g><g class="anv-sq-b">${b}</g></g>`;
  }
  const grad = (k, s1, s2, cx, cy) => `<radialGradient id="${id}${k}" cx="${cx}" cy="${cy}" r=".9"><stop offset="0" class="${s1}"/><stop offset="1" class="${s2}"/></radialGradient>`;
  const defs = ['a', 'b'].map((side) => grad(side, `anv-sq-${side}1`, `anv-sq-${side}2`, .34, .3) +
    grad(`${side}l`, 'anv-sq-lit', `anv-sq-${side}1`, .4, .36) + grad(`${side}d`, `anv-sq-${side}1`, `anv-sq-${side}2`, .8, .85)).join('');
  return { fx: strip('anv-sequins', `<defs>${defs}</defs>${cols}<g>${fixed}</g>`) };
}

/* ---- Speak Now: Castle ---- */
// A dragon facing right, in its own units: the shoulder at the origin, about 30 across from the
// spade of the tail to the snout. Two wings, the far one smaller and behind the body.
const DRAGON = {
  body: 'M-16 1.2C-12 -.2 -9 -.6 -5.5 -.6C-3 -1.6 0 -2.2 2.5 -1.8C4.2 -2.6 5.2 -4.2 6.6 -5.2L8.4 -5.6L9.2 -6.9L9.4 -5.4L11.2 -4.9L11.5 -4.1L9 -3.8C7.6 -3.3 6.6 -2.2 5.6 -.9C4.8 .6 3 1.3 1 1.4L.7 2.9L0 3L.1 1.5C-2 1.6 -3.6 1.5 -5 1.2L-5.4 2.7L-6.1 2.7L-6.1 1.1C-9 1.2 -12.5 1.9 -16 1.9Z',
  spade: 'M-15.4 1.5L-18.6 .1L-17.7 1.6L-18.8 3.1Z',
  near: 'M1 0C.5 -4 -1.5 -8 -3.5 -10.5Q-4.6 -7.2 -7.5 -7Q-6.6 -4.2 -9 -2.5Q-6.4 -1.8 -5.5 0Z',
  far: 'M1.8 0C1.8 -3 1 -6 -.2 -8.2Q-1 -5.8 -3.4 -5.6Q-2.6 -3 -4 -1.4Z',
  flame: 'M11.2 -4.7C14.6 -7.6 19.8 -7.2 25.5 -3.6C19.8 -1.2 14.6 -1 11.2 -3.7Z',
  core: 'M11.4 -4.4C14.2 -5.8 17.8 -5.5 21 -3.8C17.8 -2.4 14.2 -2.4 11.4 -3.9Z',
};
// layer is 'front' or 'back' for the two copies of a near dragon, or 'far' for the one that only
// ever flies beyond the castle. dir 1 rests facing right and laps leftward; -1 is the reverse.
function dragon({ x, y, s, dir, rx, ry, d, t, fire = false }, layer) {
  const inner = `<g transform="translate(1 -1.9)"><g class="sn-wing sn-wing--far"><path d="${DRAGON.far}"/></g></g>` +
    `<path d="${DRAGON.body}"/><path d="${DRAGON.spade}"/>` +
    (fire ? `<g class="sn-flame"><path class="sn-fire" d="${DRAGON.flame}"/><path class="sn-fire-core" d="${DRAGON.core}"/></g>` : '') +
    `<g transform="translate(-.2 -1.6)"><g class="sn-wing"><path d="${DRAGON.near}"/></g></g>`;
  return `<g class="sn-dragon${layer === 'far' ? ' sn-dragon--far' : ''}" transform="translate(${x} ${y}) scale(${s})">` +
    `<g class="sn-fly sn-fly--${layer}" style="--dir:${dir};--rx:${f(rx / s)}px;--ry:${f(ry / s)}px;--d:${d}s;--t:${t}s"><g class="sn-face">${inner}</g></g></g>`;
}
function speakCastle() {
  const rand = R(2510);
  // A tower: a body down to the ground, then a fairy-tale spire (its sides drawn in a little),
  // or battlements, and lit windows as small arches.
  let back = '', front = '', lit = '', flags = '', flagN = 0;
  const merlons = (x0, x1, top) => { let d = ''; for (let x = x0 + .6; x < x1 - 1.6; x += 3.6) d += `M${f(x)} ${f(top)}v-1.9h2v1.9Z`; return d; };
  const spire = (x, w, top, h) => `M${f(x - w / 2 - 1.3)} ${f(top + .2)}Q${f(x - w * .16)} ${f(top - h * .38)} ${f(x)} ${f(top - h)}Q${f(x + w * .16)} ${f(top - h * .38)} ${f(x + w / 2 + 1.3)} ${f(top + .2)}Z`;
  const win = (x, y) => { lit += `M${f(x)} ${f(y + 2.6)}V${f(y + .7)}A.65 .65 0 0 1 ${f(x + 1.3)} ${f(y + .7)}V${f(y + 2.6)}Z`; };
  const tower = (x, w, top, { roof = 0, crenel = false, flag = false, wins = [], far = false } = {}) => {
    let d = `M${f(x - w / 2)} 61V${f(top)}H${f(x + w / 2)}V61Z`;
    if (roof) d += spire(x, w, top, roof);
    if (crenel) d += merlons(x - w / 2, x + w / 2, top);
    if (far) back += d; else front += d;
    wins.forEach(([wx, wy]) => win(x + wx - .65, wy));
    if (flag) {
      const tip = top - roof;
      flags += `<path class="sn-pole" d="M${f(x)} ${f(tip + .4)}V${f(tip - 4.2)}"/><path class="sn-pennant" style="--p:${f(flagN++ * .07)}s" d="M${f(x + .2)} ${f(tip - 4.2)}L${f(x + 4.6 + rand())} ${f(tip - 3.1)}L${f(x + .2)} ${f(tip - 2)}Z"/>`;
    }
  };
  const wall = (x0, x1, top) => { front += `M${f(x0)} 61V${f(top)}H${f(x1)}V61Z` + merlons(x0, x1, top); };
  // Beyond: a far keep and a few thin spires, paler, so the castle has depth to fly through.
  back += `M66 61V35H122V61ZM478 61V27H566V61Z` + merlons(66, 122, 35) + merlons(478, 566, 27);
  tower(86, 6, 19, { roof: 10, far: true }); tower(141, 6, 31, { roof: 8, far: true });
  tower(466, 6, 25, { roof: 8, far: true }); tower(506, 8, 14, { roof: 11, far: true }); tower(548, 7, 20, { roof: 10, far: true });
  // The left: a gatehouse tower and its wall, with a small tower kept inside a phone's margin.
  wall(-4, 186, 46);
  tower(22, 11, 33, { crenel: true, wins: [[0, 39]] });
  tower(62, 16, 24, { roof: 16, flag: true, wins: [[0, 29], [-3, 39], [3, 39]] });
  tower(110, 9, 35, { roof: 10, wins: [[0, 40]] });
  tower(172, 10, 34, { roof: 12, flag: true, wins: [[0, 39]] });
  // The middle: only the low curtain wall under the words, with the gate lit.
  wall(184, 426, 53);
  lit += 'M296 61V57.6A4 4.2 0 0 1 304 57.6V61Z';
  // The right: the keep, stepping up to the tallest spire, with its first tower kept inside a
  // phone's margin too.
  tower(431, 11, 30, { roof: 14, flag: true, wins: [[0, 36]] });
  wall(436, 604, 44);
  front += `M468 61V31H566V61Z` + merlons(468, 566, 31);
  tower(488, 12, 22, { roof: 15, flag: true, wins: [[0, 27], [0, 37]] });
  tower(526, 17, 19, { roof: 15, wins: [[0, 24], [-4, 34], [4, 34]] });
  tower(562, 10, 26, { roof: 12, flag: true, wins: [[0, 31]] });
  tower(592, 14, 35, { crenel: true, wins: [[-2, 40]] });
  [[478, 39], [503, 39], [548, 39], [512, 48], [454, 49]].forEach(([x, y]) => win(x, y));
  // A few stars out already, and a thin moon, all clear of the words.
  let stars = '';
  for (let k = 0; k < 14; k++) { let x = rand() * 600; if (x > 196 && x < 410) x = x < 300 ? 196 - rand() * 40 : 410 + rand() * 40; stars += `<circle cx="${f(x)}" cy="${f(1.5 + rand() * 11)}" r="${f(.25 + rand() * .35)}" opacity="${f(.35 + rand() * .45)}"/>`; }
  const moon = '<path class="sn-moon" d="M140.6 6.4A4.6 4.6 0 1 0 145.3 13.4A3.7 3.7 0 0 1 140.6 6.4Z"/>';
  // The dragons: one lapping the gatehouse tower, one lapping the keep's first spire (resting where
  // a phone still shows it) and breathing fire as it passes, and a small far one beyond them.
  const A = { x: 98, y: 20, s: .95, dir: 1, rx: 36, ry: 8.5, d: .05, t: 3.2 };
  const B = { x: 441, y: 14.5, s: .9, dir: -1, rx: 32, ry: 7, d: .3, t: 3.2, fire: true };
  const C = { x: 160, y: 8, s: .42, dir: 1, rx: 12, ry: 2.5, d: .6, t: 3.6 };
  return { fx: strip('sn-castle', `<g class="sn-stars">${stars}</g>${moon}<path class="sn-back" d="${back}"/>` +
    dragon(C, 'far') + dragon(A, 'back') + dragon(B, 'back') +
    `<path class="sn-front" d="${front}"/><path class="sn-lit" d="${lit}"/>${flags}` +
    dragon(A, 'front') + dragon(B, 'front')) };
}

/* ---- Red ---- */
const KNIT = `<svg xmlns='http://www.w3.org/2000/svg' width='10' height='9'><path d='M1 .5C3 2 4.4 4.6 5 8.7C3.2 7.5 1.2 4.9 1 .5Z' fill='white' fill-opacity='.2'/><path d='M9 .5C7 2 5.6 4.6 5 8.7C6.8 7.5 8.8 4.9 9 .5Z' fill='white' fill-opacity='.11'/><path d='M0 0V9M10 0V9' stroke='black' stroke-opacity='.22' stroke-width='.9'/><path d='M5 8.7L5 9' stroke='black' stroke-opacity='.2'/></svg>`;
function red() {
  return { fx: `<i class="anv-knit" style='background-image:${svgUrl(KNIT)}'></i><i class="anv-rib"></i>`, out: `<span class="anv-fringe"></span>` };
}
// The fringe keeps one spacing at every width, a tassel every 12.5px, laid out once the button
// has a size. A fixed count spread across the width crowded into a brush on a phone.
const TASSEL_GAP = 12.5;
function hangFringe(el) {
  const rand = R(1022), w = el.offsetWidth, n = Math.max(2, Math.round(w / TASSEL_GAP) + 1);
  el.innerHTML = Array.from({ length: n }, (_, i) => {
    const strands = [1.4, 3.1, 4.9, 6.6].map((x, k) => {
      const end = 9.5 + rand() * 3, bow = rand() * 1.2 - .6;
      return `<path d="M${x} 0C${f(x + bow)} ${f(end * .45)} ${f(x - bow)} ${f(end * .75)} ${f(x + (k - 1.5) * .35)} ${f(end)}"/>`;
    }).join('');
    return `<i class="anv-tassel" style="left:${f(i * (w - 8) / (n - 1) + 4)}px;--rot:${f(rand() * 5 - 2.5)}deg;--i:${i}"><svg viewBox="0 0 8 16">${strands}</svg></i>`;
  }).join('');
}

/* ---- 1989 ---- */
function n1989() {
  const rand = R(1989);
  let back = '', front = '', wins = '';
  const centre = (mid) => mid > 200 && mid < 400;
  for (let x = -12; x < 620;) {
    const w = 12 + rand() * 16, h = centre(x + w / 2) ? 6 + rand() * 5 : 15 + rand() * 17;
    back += `<rect x="${f(x)}" y="${f(60 - h)}" width="${f(w)}" height="${f(h)}"/>`;
    x += w + (rand() < .3 ? 2 : 0);
  }
  const building = (x, w, h) => {
    front += `<rect x="${f(x)}" y="${f(60 - h)}" width="${f(w)}" height="${f(h)}"/>`;
    for (let wy = 60 - h + 3; wy < 57.5; wy += 4.2) for (let wx = x + 2; wx < x + w - 2.4; wx += 3.6)
      if (rand() < .55) wins += `<rect x="${f(wx)}" y="${f(wy)}" width="1.5" height="2.1"${rand() < .2 ? ' class="r"' : ''} style="--d:${f(.2 + rand() * 1.3)}s"/>`;
  };
  for (let x = -6; x < 620;) {
    const w = 10 + rand() * 14, mid = x + w / 2;
    if (Math.abs(mid - 100) < 12) { // a stepped tower with a mast, in the left gutter
      building(x, 17, 33); front += `<rect x="${f(x + 3.5)}" y="23" width="10" height="4.5"/><rect x="${f(x + 6)}" y="19.5" width="5" height="4"/><rect x="${f(x + 8.1)}" y="12" width=".8" height="8"/>`;
      x += 18; continue;
    }
    const h = centre(mid) ? 4 + rand() * 5 : 9 + rand() * 14;
    building(x, w, h);
    if (Math.abs(mid - 458) < 12) { // a water tower on the roof, in the right gutter
      const top = 60 - h, cx = x + w / 2;
      front += `<path class="anv-legs" d="M${f(cx - 3)} ${f(top)}L${f(cx - 2.4)} ${f(top - 4)}M${f(cx + 3)} ${f(top)}L${f(cx + 2.4)} ${f(top - 4)}M${f(cx - 2.7)} ${f(top - 2)}H${f(cx + 2.7)}"/>` +
        `<rect x="${f(cx - 3.4)}" y="${f(top - 10)}" width="6.8" height="6.2" rx=".6"/><path d="M${f(cx - 3.9)} ${f(top - 10)}L${f(cx)} ${f(top - 13.4)}L${f(cx + 3.9)} ${f(top - 10)}Z"/>`;
    }
    x += w + (rand() < .25 ? 1.5 : 0);
  }
  const gull = (x, y, d, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path class="anv-gull" style="--gd:${d}s" d="M-3.6 .4Q-1.9 -2 0 .2Q1.9 -2 3.6 .4"/></g>`;
  return { fx: `<i class="anv-dusk"></i>` + strip('anv-city', `<g class="anv-city-back">${back}</g><g class="anv-city-front">${front}</g><g class="anv-windows">${wins}</g>${gull(416, 11, 0)}${gull(430, 16, .12, .8)}`) };
}

/* ---- reputation: Emerald scales ---- */
function rep() {
  const id = `anvRs${++serial}`, rand = R(1110), dx = 8, dy = 4.4, hw = 4.15;
  // Each scale is a tile with a rounded lower edge. Rows are drawn bottom row first, so every
  // row lies over the top of the one beneath and only the rounded edges show, as on a snake.
  const rows = [];
  for (let row = 0; row < 16; row++) {
    const cy = row * dy - 1.5;
    let g = '';
    for (let c = -1; c <= 76; c++) {
      const cx = c * dx + (row % 2 ? dx / 2 : 0) - 2, roll = rand(), v = roll < .12 ? 'l' : roll < .3 ? 'd' : '';
      const d = Math.max(0, (cx + 26 * Math.sin(cy / 60 * Math.PI * 2 + cx / 80)) / 600 * 1.3 + rand() * .06);
      const arc = `A${hw} ${f(hw * .92)} 0 0 0 ${f(cx + hw)} ${f(cy)}`;
      const tile = `M${f(cx - hw)} ${f(cy - 6.5)}V${f(cy)}${arc}V${f(cy - 6.5)}Z`;
      g += `<g style="--d:${f(d)}s"><path d="${tile}" fill="url(#${id}${v})"/><path class="anv-rs-em" d="${tile}" fill="url(#${id}e${v})"/>` +
        `<path class="anv-rs-edge" d="M${f(cx - hw)} ${f(cy)}${arc}"/></g>`;
    }
    rows.push(g);
  }
  // Three lights per skin, as on the sequins: the usual one, a scale turned toward the light,
  // and one turned away.
  const grad = (k, a, b, cx, cy) => `<radialGradient id="${id}${k}" cx="${cx}" cy="${cy}" r=".95"><stop offset="0" class="${a}"/><stop offset="1" class="${b}"/></radialGradient>`;
  const defs = grad('', 'anv-rs1', 'anv-rs2', .4, .72) + grad('l', 'anv-rs-lit', 'anv-rs2', .42, .7) + grad('d', 'anv-rs2', 'anv-rs-dark', .6, .85) +
    grad('e', 'anv-em1', 'anv-em2', .4, .72) + grad('el', 'anv-em-lit', 'anv-em2', .42, .7) + grad('ed', 'anv-em2', 'anv-em-dark', .6, .85);
  return { fx: strip('anv-skin', `<defs>${defs}</defs>${rows.reverse().join('')}`) };
}

/* ---- Lover ---- */
function lover() {
  const flies = [
    { pos: 'left:4px;top:6px', fx: -26, fy: -52, rot: -14, c: '#a8cdf0', d: 0 },
    { pos: 'left:clamp(16px, 14% - 20px, 64px);top:28px', fx: 20, fy: -66, rot: 10, c: '#f4d77f', d: .14 },
    { pos: 'right:7%;top:-8px', fx: 30, fy: -46, rot: -6, c: '#cdb2ee', d: .06 },
  ];
  const fly = ({ pos, fx, fy, rot, c, d }) => `<span class="anv-bfly" style="${pos};--fx:${fx}px;--fy:${fy}px;--rot:${rot}deg;--c:${c};--d:${d}s"><svg viewBox="-9 -8 18 16">` +
    `<g class="anv-wing anv-wing--l"><path d="M-.5 -1C-2.6 -7 -8.2 -8.4 -8.4 -4.6C-8.5 -1.6 -4.4 -.2 -.5 -.3Z"/><path d="M-.5 .3C-4.2 .2 -7.2 2.6 -6.1 5.4C-5 7.4 -1.7 5.4 -.5 1.5Z"/><circle class="anv-spot" cx="-5.4" cy="-4.2" r=".9"/></g>` +
    `<g class="anv-wing anv-wing--r"><path d="M.5 -1C2.9 -6.6 8 -8 8.3 -4.2C8.4 -1.4 4.6 -.3 .5 -.3Z"/><path d="M.5 .3C4 .4 6.8 2.4 6 5.1C5.1 7.3 1.9 5.6 .5 1.5Z"/><circle class="anv-spot" cx="5.2" cy="-3.9" r=".75"/></g>` +
    `<path class="anv-body" d="M0 -3.4C.7 -3.4 .8 -1 .6 2.5C.5 4.6 -.5 4.6 -.6 2.5C-.8 -1 -.7 -3.4 0 -3.4Z"/>` +
    `<path class="anv-feeler" d="M-.2 -3.3C-.8 -5.5 -1.8 -6.6 -2.8 -7M.2 -3.3C.9 -5.4 2 -6.4 3 -6.8"/></svg></span>`;
  return { fx: '', out: flies.map(fly).join('') };
}

/* ---------- trunks ----------
   A trunk stands at x with width w at its foot and rises out of the top of the frame. It leans a
   touch, narrows toward the top, and each edge bows on its own, so no trunk is a ruled bar and
   no two are the same. at(y) gives the left and right edge at any height. */
function trunkShape(rand, x, w, base, lean = (rand() - .5) * 2.6) {
  const top = -4, taper = .68 + rand() * .16, bowL = (rand() - .5) * w * .24, bowR = (rand() - .5) * w * .24;
  const at = (y) => {
    const t = (base - y) / (base - top), cx = x + lean * t, hw = w / 2 * (1 - (1 - taper) * t), b = 4 * t * (1 - t);
    return [cx - hw + bowL * b, cx + hw + bowR * b];
  };
  return { at, base, top, x, w };
}
function trunkPath(s) {
  const ys = Array.from({ length: 9 }, (_, i) => s.base + (s.top - s.base) * i / 8);
  const pts = [...ys.map((y) => [s.at(y)[0], y]), ...[...ys].reverse().map((y) => [s.at(y)[1], y])];
  return `M${pts.map(([a, b]) => `${f(a)} ${f(b)}`).join('L')}Z`;
}
// A broken-off branch: a thin wedge out of one side, pointing up and away.
function stub(rand, s, y, side, len, th) {
  const [l, r] = s.at(y), ex = side < 0 ? l + .3 : r - .3, a = (32 + rand() * 30) * Math.PI / 180;
  return `M${f(ex)} ${f(y + th / 2)}L${f(ex + side * Math.sin(a) * len)} ${f(y - Math.cos(a) * len)}L${f(ex)} ${f(y - th / 2)}Z`;
}
// Bark: a few long, faintly paler furrows running up the near trunks.
function bark(rand, s) {
  let d = '';
  for (let k = 0, n = s.w > 8 ? 3 : 2; k < n; k++) {
    const p = .22 + k / n * .6 + rand() * .1, y0 = 8 + rand() * 30, y1 = y0 - 10 - rand() * 22;
    const pt = (y) => { const [l, r] = s.at(y); return `${f(l + (r - l) * p + (rand() - .5) * .4)} ${f(y)}`; };
    d += `M${pt(y0)}L${pt((y0 * 2 + y1) / 3)}L${pt((y0 + y1 * 2) / 3)}L${pt(y1)}`;
  }
  return d;
}
// Bracken: an arching stem with leaflets along it, shorter toward the tip, leaning one way.
function fern(rand, x, y, len, dir) {
  const c = [x + dir * len * .3, y - len * .85], e = [x + dir * len, y - len * (.25 + rand() * .2)];
  const at = (t) => [(1 - t) ** 2 * x + 2 * (1 - t) * t * c[0] + t * t * e[0], (1 - t) ** 2 * y + 2 * (1 - t) * t * c[1] + t * t * e[1]];
  let d = `M${f(x)} ${f(y)}Q${f(c[0])} ${f(c[1])} ${f(e[0])} ${f(e[1])}`;
  for (let t = .18; t < .96; t += .085 + rand() * .03) {
    const [px, py] = at(t), [qx, qy] = at(t + .02), a = Math.atan2(qy - py, qx - px), l = len * .26 * (1 - t) ** .7;
    for (const s of [-1, 1]) { const b = a + s * 1.05; d += `M${f(px)} ${f(py)}L${f(px + Math.cos(b) * l)} ${f(py + Math.sin(b) * l)}`; }
  }
  return d;
}

// The near trunks are placed by hand, [x, width]: few and wide, so the depth comes from scale
// rather than from count. A giant cropped by each end, a pair almost touching on the left,
// and one in each phone gutter.
const FRONT = [[8, 27], [61, 9], [71, 5], [121, 6.5], [171, 12.5], [430, 11], [487, 5.5], [528, 16.5], [590, 23]];
function timber() {
  const rand = R(724);
  let back = '', mid = '', front = '', furrows = '', ferns = '', midFerns = '';
  for (let x = -8; x < 612; x += 5 + rand() * 14) {
    const core = x > 205 && x < 395;
    if (core && rand() < .6) continue;
    back += trunkPath(trunkShape(rand, x, 1.1 + rand() * 2, 48 + rand() * 4));
  }
  for (let x = -6; x < 612; x += 13 + rand() * 22) {
    if (x > 200 && x < 405) continue;
    const lean = Math.abs(x - 470) < 12 ? 6.5 : undefined; // one mid trunk that has given up standing straight
    const s = trunkShape(rand, x, 3.4 + rand() * 3, 55 + rand() * 3, lean);
    mid += trunkPath(s);
    if (rand() < .55) mid += stub(rand, s, 8 + rand() * 30, rand() < .5 ? -1 : 1, 4 + rand() * 5, 1.4);
    if (rand() < .5) midFerns += fern(rand, x + (rand() - .5) * 6, s.base + 1, 5 + rand() * 3, rand() < .5 ? -1 : 1);
  }
  FRONT.forEach(([x, w]) => {
    const s = trunkShape(rand, x, w, 64);
    front += trunkPath(s);
    for (let k = 0, n = 1 + Math.floor(rand() * 2); k < n; k++) front += stub(rand, s, 5 + rand() * 32, rand() < .5 ? -1 : 1, 6 + rand() * 8, 1.6 + w * .1);
    furrows += bark(rand, s);
    for (let k = 0, n = 2 + Math.floor(rand() * 2); k < n; k++) {
      const dir = k % 2 ? 1 : -1;
      ferns += fern(rand, x + dir * (w / 2 + rand() * 3), 61 + rand() * 2, 8 + rand() * 6, dir);
    }
  });
  return { back, mid, front, furrows, ferns, midFerns };
}
const layer = (depth, d, extra = '') => strip(`fk-svg--${depth}`, `<g class="fk-layer fk-layer--${depth}"><path class="fk-${depth}" d="${d}"/>${extra}</g>`);

/* ---- folklore: Tall timber ---- */
function fkStep() {
  const t = timber();
  const wisps = `<span class="fk-wisps"><i class="fk-wisp" style="left:-6%;top:34%;width:36%;height:34%"></i>` +
    `<i class="fk-wisp" style="left:66%;top:20%;width:40%;height:30%"></i><i class="fk-wisp" style="left:30%;top:60%;width:40%;height:44%"></i></span>`;
  return { fx: layer('back', t.back) + `<i class="fk-fog-far"></i>` + layer('mid', t.mid, `<path class="fk-fern fk-fern--mid" d="${t.midFerns}"/>`) + wisps +
    `<i class="fk-fog-near"></i>` + layer('front', t.front, `<path class="fk-bark" d="${t.furrows}"/><path class="fk-fern" d="${t.ferns}"/>`) };
}

/* ---- evermore: Flannel ---- */
const FLAKE = (() => {
  let d = '';
  for (let k = 0; k < 6; k++) {
    const a = k * Math.PI / 3, c = Math.cos(a), s = Math.sin(a), p = (x, y) => `${f(x * c - y * s)} ${f(x * s + y * c)}`;
    d += `M${p(0, 0)}L${p(0, -5)}M${p(0, -3.1)}L${p(-1.4, -4.3)}M${p(0, -3.1)}L${p(1.4, -4.3)}`;
  }
  return `<path d="${d}"/>`;
})();
function evermoreFlannel() {
  const rand = R(1212);
  // Flakes land clear of the words: in the gaps, or above and below the lettering in the middle.
  const spots = [[5, 34], [11, 12], [16, 42], [22, 22], [29, 8], [37, 45], [63, 7], [70, 41], [76, 18], [83, 36], [89, 10], [95, 30]];
  const flakes = spots.map(([l, t]) => `<i class="anv-flake" style="left:${l}%;top:${t}px;--d:${f(rand() * 1.4)}s;--rot:${f(rand() * 90 - 45)}deg;--s:${f(7 + rand() * 4)}px;--sx:${f(rand() * 16 - 8)}px"><svg viewBox="-6 -6 12 12">${FLAKE}</svg></i>`).join('');
  return { fx: `<i class="anv-plaid"></i>` + flakes };
}

/* ---- Midnights ---- */
function midnights() {
  const rand = R(1021);
  let dots = '', placed = 0, tries = 0;
  while (placed < 78 && tries++ < 2000) {
    const x = rand() * 600, y = rand() * 60;
    if (x > 196 && x < 404 && y > 10 && y < 50) continue;
    dots += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(.3 + rand() * rand() * 1)}" opacity="${f(.3 + rand() * .55)}"/>`;
    placed++;
  }
  const figures = [[[40, 16], [74, 28], [106, 14], [140, 25], [170, 12], [190, 36]], [[410, 43], [427, 20], [458, 31], [490, 12], [526, 27], [561, 16], [579, 41]]];
  let lines = '', stars = '';
  for (const pts of figures) pts.forEach(([x, y], k) => {
    if (k) lines += `<path class="anv-link" pathLength="1" style="--k:${k - 1}" d="M${pts[k - 1][0]} ${pts[k - 1][1]}L${x} ${y}"/>`;
    const s = .75 + ((k * 37) % 5) / 10;
    stars += `<g transform="translate(${x} ${y}) scale(${s})"><path class="anv-star" style="--k:${Math.max(0, k - 1)}" d="M0 -3.2L.7 -.7L3.2 0L.7 .7L0 3.2L-.7 .7L-3.2 0L-.7 -.7Z"/></g>`;
  });
  return { fx: strip('anv-sky', dots + lines + stars) };
}

/* ---- The Tortured Poets Department ---- */
function ttpd() {
  const rand = R(419);
  let t = '';
  const block = (x0, x1) => {
    for (let y = 11; y <= 51; y += 6.6) {
      const end = x1 - rand() * 34, words = [];
      for (let x = x0; x < end;) { const w = 4 + rand() * 13; if (x + w > x1) break; words.push([x, w]); x += w + 3.3; }
      words.forEach(([x, w]) => { t += `<rect x="${f(x)}" y="${f(y - 1.1)}" width="${f(w)}" height="2.2" rx=".4"/>`; });
      if (words.length > 3 && rand() < .32) {
        const a = words[1], b = words[Math.min(words.length - 1, 2 + Math.floor(rand() * 2))];
        t += `<path d="M${f(a[0] - 1)} ${f(y + .2)}L${f(b[0] + b[1] + 1)} ${f(y - .3)}"/>`;
      }
    }
  };
  block(24, 188); block(410, 578);
  return { fx: `<i class="anv-rule"></i>` + strip('anv-typed', t), label: 'typed' };
}

/* ---- The Life of a Showgirl ---- */
function showgirl() {
  const rand = R(1003), N = 20;
  let specks = '';
  for (let k = 0; k < 120; k++) specks += `<circle${rand() < .4 ? ' class="w"' : ''} cx="${f(rand() * 600)}" cy="${f(rand() * 60)}" r="${f(.25 + rand() * rand() * .8)}" opacity="${f(.25 + rand() * .55)}"/>`;
  const bulb = (style, k) => `<i class="anv-bulb${k % 2 ? ' dim' : ''}" style="${style};--cd:${f((k % 3) * .1667 - .5)}s"></i>`;
  let bulbs = '', k = 0;
  for (let i = 0; i < N; i++) bulbs += bulb(`left:calc(10px + (100% - 20px) * ${f(i / (N - 1))});top:7px`, k++);
  bulbs += bulb('left:calc(100% - 7px);top:50%', k++);
  for (let i = N - 1; i >= 0; i--) bulbs += bulb(`left:calc(10px + (100% - 20px) * ${f(i / (N - 1))});top:calc(100% - 7px)`, k++);
  bulbs += bulb('left:7px;top:50%', k++);
  return { fx: strip('anv-glitter', specks) + bulbs };
}

/* ---------- which finish, on which day ---------- */
// Keyed by the TS_MILESTONES album name, so the release dates live in one table and a date fix
// there moves the button with the margin note.
const ANNIVERSARY_FINISHES = {
  "Taylor Swift": ["anv-debut", debutPorch],
  "Fearless": ["anv-fearless", fearless],
  "Speak Now": ["anv-speaknow", speakCastle],
  "Red": ["anv-red", red],
  "1989": ["anv-1989", n1989],
  "reputation": ["anv-rep", rep],
  "Lover": ["anv-lover", lover],
  "folklore": ["anv-folklore", fkStep],
  "evermore": ["anv-evermore", evermoreFlannel],
  "Midnights": ["anv-midnights", midnights],
  "The Tortured Poets Department": ["anv-ttpd", ttpd],
  "The Life of a Showgirl": ["anv-showgirl", showgirl],
};
const ART = Object.fromEntries(Object.values(ANNIVERSARY_FINISHES));

// The finish the button is forced into on `dateKey` (YYYY-MM-DD, the player's own day), or "" on
// every other day. Original studio releases only: a Taylor's Version day keeps the player's own
// finish, because these twelve were drawn for the day each record first came out. A year before
// the album existed (only reachable with the dev date) is not its anniversary.
export function anniversaryFinishFor(dateKey) {
  if (!dateKey || dateKey.length < 10) return "";
  const md = dateKey.slice(5), year = +dateKey.slice(0, 4);
  const release = TS_MILESTONES.find((m) => m.kind === "album" && m.md === md && year >= m.year);
  return (release && ANNIVERSARY_FINISHES[release.album]?.[0]) || "";
}

// Every album and its finish and release day, for the dev tools.
export const anniversaryFinishList = () => TS_MILESTONES.filter((m) => m.kind === "album" && ANNIVERSARY_FINISHES[m.album])
  .map((m) => ({ album: m.album, finish: ANNIVERSARY_FINISHES[m.album][0], md: m.md, year: m.year }));

// The drawing for an anniversary finish: { fx, out?, label? }, or null for any other finish. `fx`
// goes in the clipped art layer, `out` in a layer allowed past the button's edge (Red's fringe,
// Lover's butterflies), and label "typed" asks for the words one letter to a span.
export function anniversaryArt(finish) {
  const draw = ART[finish];
  return draw ? draw() : null;
}

// Anything that has to measure the button once it is on the page. Only Red needs it: the fringe
// keeps one spacing at every width, so it is hung by the button's width and re-hung when that
// changes. Safe to call on every paint; the watcher is attached once per button.
const watched = new WeakSet();
export function layoutAnniversaryArt(btn) {
  const hang = () => btn.querySelectorAll(".anv-fringe").forEach((el) => { if (el.offsetWidth) hangFringe(el); });
  hang();
  if (watched.has(btn) || typeof ResizeObserver === "undefined") return;
  watched.add(btn);
  let width = btn.offsetWidth;
  new ResizeObserver(() => { if (btn.offsetWidth !== width) { width = btn.offsetWidth; hang(); } }).observe(btn);
}
