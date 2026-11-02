// The dated Start writing button: sixteen finishes, one per studio album and one per Taylor's
// Version, each with its own lyric for the words, and the rule that puts each on the button on its record's release day; one for her
// birthday, Iced for her; one for Christmas Day, Fresh off the baler; one more, Thirteen
// marks, for the 13th of every month; and one for each day the guest shelf keeps in the margin.
//
// THE FINISH IS FORCED, AND THAT IS THE POINT. On each album's anniversary the button wears
// that album's finish over whatever the player has chosen: Seasons, the gold marker, any
// Mastery finish, the random roll. It is there to show support for the album on its release
// day, the notebook dressing up for her record the way a fan does, and support you can switch
// off would only be a theme. It lasts the one day and hands the button straight back, and it
// never touches the stored choice, so nothing is lost by it. Her birthday is forced the same way,
// and so is Christmas Day, for the tree farm she grew up on, and so is the 13th, for her lucky
// number, on the 13th only. So is each guest's day, the notebook being generous about somebody
// else on the one day the margin already marks for them.
//
// Every finish is drawn on a 600 x 60 strip cropped from the middle, never stretched, exactly as
// js/cta.js draws its own (the 13th's count and the birthday's candles are the exceptions, and
// say why). The twelve were
// designed on scripts/cta/chosen-board.html, the four Taylor's Versions on scripts/cta/tv-board.html,
// the birthday on scripts/cta/birthday-board.html, Christmas on scripts/cta/christmas-board.html,
// the 13th on scripts/cta/thirteenth-board.html and the guests' on scripts/cta/guest-days-board.html;
// change a finish there first and carry it across, so the board and the button do not drift apart.
import { TS_MILESTONES, ALBUM_COLORS, GUEST_DAYS } from "./config.js";

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

/* ---------- the Taylor's Versions ----------
   The four re-recordings, each drawn from what its Taylor's Version is known for rather than what
   the original was: the fringe of the Fearless dress, the drive upstate from Red's cover, Speak
   Now's fireworks over water, and 1989's beach. Designed on scripts/cta/tv-board.html. */
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

/* ---- Fearless (Taylor's Version): Gold fringe ---- */
function fearlessTV() {
  const rand = R(2021), id = `tvfF${++serial}`, gap = 3.75;
  // One strand's beads: a long bugle bead, then a small round seed bead, over and over. Each
  // strand takes one of three golds, so the face is never a printed stripe.
  const defs = `<defs>${[1, 2, 3].map((k) => `<linearGradient id="${id}g${k}" x1="0" x2="1" y1="0" y2="0"><stop offset="0" class="tvf-b1 t${k}"/><stop offset=".45" class="tvf-b2 t${k}"/><stop offset="1" class="tvf-b3"/></linearGradient>` +
    `<pattern id="${id}p${k}" width="2.8" height="5.6" patternUnits="userSpaceOnUse"><rect x=".3" y=".2" width="2.2" height="4.1" rx="1" fill="url(#${id}g${k})"/><circle cx="1.4" cy="4.95" r=".62" class="tvf-seed"/></pattern>`).join('')}</defs>`;
  // [top, length, swing in degrees]. Drawn lowest tier first, so every tier hangs over the top
  // of the one beneath it, as on the dress. The drops of each tier land clear of the words, one
  // row above them and one below.
  const tiers = [[38, 25, 12], [15.5, 27, 9], [-5, 24.5, 6.5]];
  let body = '';
  tiers.forEach(([top, len, swing], t) => {
    let x = -3 + t * 1.2;
    while (x < 604) {
      let g = '';
      const x0 = x;
      for (let s = 0; s < 2 && x < 604; s++, x += gap + rand() * .3) {
        const L = len + rand() * 2.4 - 1.2, tone = 1 + Math.floor(rand() * 3);
        // The pattern tiles from the strand's own origin, so shifting the origin up by a random
        // part of a bead starts every strand at its own point in the run. Without it the beads
        // line up across the face into rows, and the fringe reads as woven cane.
        const off = rand() * 5.6;
        g += `<g transform="translate(${f(x)} ${f(top - off)}) rotate(${f(rand() * 3 - 1.5)} 1.4 ${f(off)})"><rect y="${f(off)}" width="2.8" height="${f(L)}" fill="url(#${id}p${tone})"/><circle class="tvf-drop" cx="1.4" cy="${f(off + L + .9)}" r="1.35"/></g>`;
      }
      body += `<g class="tvf-swing" style="--d:${f(x0 / 600 * .6 + (2 - t) * .08)}s;--a:${f(swing * (.8 + rand() * .45))}">${g}</g>`;
    }
  });
  return { fx: strip('tvf-fringe', defs + body) + `<i class="tvf-sheen"></i>` };
}

/* ---- Red (Taylor's Version): Upstate ---- */
// An autumn crown built out of clumps of leaves rather than one round lollipop: a few big clumps
// fill the middle, many small ones make a ragged edge, and a shade and a lit side sit inside it.
// Every crown is thrown fresh, so no two trees come out of the same stamp.
const clumps = (rand, cx, cy, rx, ry, n, [r0, r1], bias = [0, 0], k = 1) => {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = rand() * Math.PI * 2, rr = Math.sqrt(rand()) * k;
    const x = cx + Math.cos(a) * rx * rr + bias[0], y = cy + Math.sin(a) * ry * rr + bias[1], r = r0 + rand() * (r1 - r0);
    d += `M${f(x - r)} ${f(y)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0`;
  }
  return d;
};
const crown = (rand, cx, cy, rx, ry, tone) => {
  const big = Math.min(rx, ry);
  return `<path class="tvr-${tone}" d="${clumps(rand, cx, cy, rx * .55, ry * .5, 5, [big * .4, big * .55])}${clumps(rand, cx, cy, rx * .86, ry * .84, Math.round(rx * 2.2), [1.4, 3.2])}"/>` +
    `<path class="tvr-${tone} s" d="${clumps(rand, cx, cy, rx * .6, ry * .45, Math.round(rx * .9), [1.2, 2.6], [rx * .2, ry * .35])}"/>` +
    `<path class="tvr-${tone} l" d="${clumps(rand, cx, cy, rx * .5, ry * .4, Math.round(rx * .6), [.9, 2], [-rx * .3, -ry * .3])}"/>`;
};
function redTV() {
  const rand = R(1112), id = `tvrU${++serial}`;
  let trees = '';
  const tree = (x, cy, rx, ry, tone, ground = 51) => {
    const w = Math.max(1.6, rx * .14);
    trees += `<path class="tvr-trunk" d="M${f(x - w / 2)} ${ground}L${f(x - w * .3)} ${f(cy)}L${f(x + w * .3)} ${f(cy)}L${f(x + w / 2)} ${ground}Z"/>`;
    // A couple of limbs reaching up into the crown, so it sits on a tree and not a stick.
    trees += `<path class="tvr-limb" d="M${f(x)} ${f(cy + ry * .5)}L${f(x - rx * .35)} ${f(cy - ry * .15)}M${f(x)} ${f(cy + ry * .3)}L${f(x + rx * .3)} ${f(cy - ry * .25)}"/>`;
    trees += crown(rand, x, cy, rx, ry, `t${tone}`);
  };
  const birch = (x, top, cy, rx, ry) => {
    trees += `<path class="tvr-birch" d="M${f(x - .9)} 51L${f(x - .5)} ${top}L${f(x + .5)} ${top}L${f(x + 1)} 51Z"/>`;
    let marks = '';
    for (let y = top + 3; y < 49; y += 2.4 + rand() * 2.6) marks += `M${f(x - .5)} ${f(y)}h${f(.5 + rand() * .8)}`;
    trees += `<path class="tvr-birch-mark" d="${marks}"/><path class="tvr-t4" d="${clumps(rand, x, cy, rx * .8, ry * .85, Math.round(rx * 2.4), [1, 2.4])}"/>`;
  };
  const pine = (x, top, w) => { trees += `<path class="tvr-pine" d="M${f(x)} ${top}L${f(x + w * .28)} ${f(top + 9)}L${f(x + w * .16)} ${f(top + 9)}L${f(x + w * .42)} ${f(top + 19)}L${f(x + w * .22)} ${f(top + 19)}L${f(x + w / 2)} 51L${f(x - w / 2)} 51L${f(x - w * .22)} ${f(top + 19)}L${f(x - w * .42)} ${f(top + 19)}L${f(x - w * .16)} ${f(top + 9)}L${f(x - w * .28)} ${f(top + 9)}Z"/>`; };
  // The left: a big maple cropped by the end, a birch, and a rust tree kept inside a phone's
  // margin over where the car waits.
  tree(40, 16, 30, 22, 1); birch(84, 12, 20, 11, 13); tree(116, 22, 19, 17, 3); pine(146, 14, 16);
  tree(178, 25, 17, 15, 2);
  // The right: a low red bush at the words, a maple and a pine a phone still shows, then gold,
  // a birch, and another big one at the end.
  tree(407, 39, 8, 7, 2); tree(424, 22, 16, 17, 1); pine(450, 10, 17); tree(478, 24, 18, 16, 4); birch(508, 10, 18, 10, 12); tree(546, 15, 28, 21, 2); tree(588, 26, 16, 16, 3);
  let hills = 'M-6 52';
  for (let x = -6; x <= 606; x += 6) hills += `L${x} ${f(44.5 + 3.2 * Math.sin(x / 47) + 2.4 * Math.sin(x / 19 + 1) + 3 * (1 - smooth(60, 150, Math.abs(x - 300))))}`;
  hills += 'L606 52Z';
  // Leaves lying on the road; the car kicks up the ones it passes.
  let leaves = '';
  const tones = ['t1', 't2', 't3', 't4'];
  for (let k = 0; k < 22; k++) {
    const x = 166 + rand() * 276, y = 53 + rand() * 5.5, t = tones[Math.floor(rand() * 4)], kick = x > 206 && x < 436;
    const d = .35 + (x - 170) / 230 * 2.8 * .92;
    // Only a leaf in the car's path takes the kick: the animation replaces the leaf's own
    // rotation while it runs, so a leaf that stays put must not carry it.
    leaves += `<ellipse class="tvr-${t}${kick ? ' tvr-leaf' : ''}" cx="${f(x)}" cy="${f(y)}" rx="1.3" ry=".7" transform="rotate(${f(rand() * 180)} ${f(x)} ${f(y)})"` +
      (kick ? ` style="--d:${f(d)}s;--kx:${f(6 + rand() * 12)}px;--ky:${f(-5 - rand() * 7)}px;--kr:${f(200 + rand() * 300)}deg"` : '') + '/>';
  }
  const wheel = (x) => `<g class="tvr-wheel"><circle class="tvr-tyre" cx="${x}" cy="-2.9" r="2.9"/><circle class="tvr-hub" cx="${x}" cy="-2.9" r="1.35"/><path class="tvr-spoke" d="M${f(x - 1.3)} -2.9H${f(x + 1.3)}"/></g>`;
  // A late-sixties saloon in profile, facing right, its rear wheel's foot at the origin.
  const car = `<g class="tvr-drive"><g transform="translate(163 56.6) scale(1.12)">` +
    `<path class="tvr-beam" d="M38 -4.6L70 -10L70 1.5Z" fill="url(#${id}b)"/>` +
    `<path class="tvr-car" d="M.4 -3.4C.4 -5.2 1 -6.1 2.6 -6.3L9.4 -6.8C11.3 -9.6 13.6 -11.3 17 -11.5L24.4 -11.5C27.2 -11.3 29 -9.8 30.5 -7.3L35.5 -6.7C37 -6.4 37.9 -5.5 37.9 -4.1L37.9 -2.6C37.9 -1.8 37.3 -1.4 36.5 -1.4L1.3 -1.4C.7 -1.4 .4 -1.9 .4 -2.6Z"/>` +
    `<path class="tvr-car-dark" d="M.4 -2.9H37.9V-2.4C37.9 -1.8 37.3 -1.4 36.5 -1.4L1.3 -1.4C.7 -1.4 .4 -1.9 .4 -2.4Z"/>` +
    `<path class="tvr-glass" d="M11.2 -7C12.8 -9.3 14.6 -10.4 17.3 -10.5L20.1 -10.5L20.1 -7ZM21.3 -10.5L24.3 -10.5C26.4 -10.3 27.8 -9.2 29 -7L21.3 -7Z"/>` +
    `<path class="tvr-chrome" d="M1.2 -4.2H37.2M-.5 -2.2H1.4M36.9 -2.2H38.8"/>` +
    `<circle class="tvr-head" cx="37.4" cy="-5" r=".75"/><rect class="tvr-tail" x=".2" y="-5.6" width=".9" height="1.5" rx=".3"/>` +
    wheel(8) + wheel(30.4) + `</g></g>`;
  const defs = `<defs><linearGradient id="${id}b" x1="0" x2="1"><stop offset="0" stop-color="#fff6c4" stop-opacity=".9"/><stop offset="1" stop-color="#fff6c4" stop-opacity="0"/></linearGradient></defs>`;
  return { fx: strip('tvr-upstate', `${defs}<path class="tvr-hill" d="${hills}"/>${trees}<path class="tvr-verge" d="M-6 49.6C120 50.4 300 49.2 606 50V52H-6Z"/>` +
    `<rect class="tvr-road" x="-6" y="51.4" width="612" height="10"/><path class="tvr-dash" d="M-6 56.6H606"/>${leaves}${car}`) };
}

/* ---- Speak Now (Taylor's Version): Fireworks ---- */
function speakNowTV() {
  const rand = R(7723), hid = `tvsH${++serial}`;
  // Two bursts sit in the gaps a phone still shows; the outer two are desktop only.
  const plan = [[76, 24, 17, 'g', .15], [186, 15, 11.5, 'p', 0], [416, 17, 12.5, 'v', .38], [528, 23, 18, 'w', .58]];
  let stars = '', trails = '', bursts = '', reflects = '', haze = '';
  for (let k = 0; k < 64; k++) { let x = rand() * 600; const y = 1.5 + rand() * 40; if (x > 204 && x < 396 && y > 17) continue; stars += `<circle class="tvs-star" cx="${f(x)}" cy="${f(y)}" r="${f(.22 + rand() * .42)}" opacity="${f(.3 + rand() * .55)}"/>`; }
  plan.forEach(([cx, cy, r, c, d], b) => {
    const lean = b % 2 ? 6 : -6;
    trails += `<path class="tvs-trail" style="--d:${d}s" d="M${cx + lean} 50Q${cx + lean * .6} ${f((50 + cy) / 2)} ${cx} ${cy + 4}"/><circle class="tvs-rocket" style="--d:${d}s" cx="${cx}" cy="${cy + 4}" r="1.25"/>`;
    let rays = '';
    for (let i = 0, n = 16; i < n; i++) {
      const a = i / n * Math.PI * 2 + rand() * .2, rr = r * (.78 + rand() * .32);
      const [x1, y1, x2, y2] = [cx + Math.cos(a) * 2.4, cy + Math.sin(a) * 2.4, cx + Math.cos(a) * rr, cy + Math.sin(a) * rr];
      rays += `<path class="tvs-ray" pathLength="1" d="M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}"/><circle class="tvs-spark" cx="${f(x2)}" cy="${f(y2)}" r="${f(.55 + rand() * .45)}"/>`;
    }
    bursts += `<g class="tvs-burst--${c}" style="--d:${d}s">${rays}</g>`;
    // The burst on the water: never a solid shape, which reads as a lamp lighting the ground, but
    // a column of broken glints straight under it, as wide as the burst at the far edge and
    // thinning as it comes nearer, over a faint pool of its colour.
    const rows = ['', ''];
    for (let y = 52.2, row = 0; y < 60.5; y += 1.15, row++) {
      const near = (y - 52.2) / 8.3, span = r * (1 - near * .4);
      for (let n = 0, m = 2 + Math.floor(rand() * 3); n < m; n++) {
        const x = cx + (rand() * 2 - 1) * span, w = .8 + rand() * 3.4 * (1 - near * .5);
        rows[row % 2] += `<rect${rand() < .2 ? ' class="w"' : ''} x="${f(x - w / 2)}" y="${f(y)}" width="${f(w)}" height=".5" rx=".25"/>`;
      }
    }
    reflects += `<g class="tvs-reflect tvs-burst--${c}" style="--d:${d}s"><ellipse class="tvs-pool" cx="${cx}" cy="53" rx="${f(r * 1.05)}" ry="1.8"/>` +
      `<g class="tvs-shim" style="--d:${d}s">${rows[0]}</g><g class="tvs-shim b" style="--d:${d}s">${rows[1]}</g></g>`;
    haze += `<circle cx="${cx}" cy="${cy}" r="${f(r * 1.3)}" fill="url(#${hid})"/>`;
  });
  // Long low ripples, closer together toward the far edge the way water foreshortens.
  let ripples = '';
  for (let k = 0; k < 30; k++) { const t = rand(), x = rand() * 600, y = 52 + t * t * 8, l = 8 + rand() * 26 * (1 - t * .5); ripples += `M${f(x)} ${f(y)}h${f(l)}`; }
  // The far shore: a low line of trees and a boathouse roof, dark against the water's edge.
  let shore = 'M-6 50.8';
  for (let x = -6; x <= 606; x += 3) shore += `L${x} ${f(50.8 - (Math.abs(x - 300) > 110 ? 1.2 + rand() * 2.4 * smooth(110, 200, Math.abs(x - 300)) : rand() * .5))}`;
  shore += 'L606 51.6L-6 51.6Z';
  // The shore again, upside down and fainter, lying on the water under itself.
  const shoreReflect = `<path class="tvs-shore-reflect" d="${shore}" transform="translate(0 102.4) scale(1 -1)"/>`;
  const wid = `tvsW${++serial}`;
  const defs = `<defs><radialGradient id="${hid}"><stop offset="0" stop-color="#ffe9f6" stop-opacity=".22"/><stop offset="1" stop-color="#ffe9f6" stop-opacity="0"/></radialGradient>` +
    `<linearGradient id="${wid}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" class="tvs-w0"/><stop offset=".55" class="tvs-w1"/></linearGradient></defs>`;
  const moon = '<path class="tvs-star" d="M126.6 4.2A4.2 4.2 0 1 0 131 10.6A3.4 3.4 0 0 1 126.6 4.2Z"/>';
  return { fx: strip('tvs-fireworks', `${defs}${stars}${moon}<g class="tvs-haze">${haze}</g>${trails}${bursts}<rect x="-6" y="51" width="612" height="11" fill="url(#${wid})"/>${shoreReflect}<path class="tvs-ripple" d="${ripples}"/>${reflects}<path class="tvs-shore" d="${shore}"/>`) };
}


/* ---- 1989 (Taylor's Version): a gull ---- */
// A gull in flight seen from below and a little behind: two wings, each crooked at the wrist and
// swept back to a black tip, and a short body between. The two wings are drawn separately.
const GULL = {
  l: 'M-.9 .2C-2.4 -1.8 -3.9 -2.9 -5 -2.8C-6.2 -2.1 -7.4 -.4 -8.6 1.3C-7 .5 -5.8 -.3 -4.8 -.5C-3.6 -.2 -2.3 .6 -1 1.3Z',
  r: 'M.9 .2C2.3 -1.6 3.8 -2.7 5 -2.7C6.3 -2 7.5 -.1 8.4 1.5C7 .6 5.8 -.2 4.7 -.4C3.5 -.1 2.2 .7 1 1.3Z',
  lt: 'M-7.3 -.2C-7.8 .3 -8.2 .8 -8.6 1.3C-7.8 .9 -7 .5 -6.4 .2Z', rt: 'M7.2 -.1C7.7 .4 8.1 1 8.4 1.5C7.6 1 6.9 .6 6.3 .3Z',
  body: 'M0 -.5C.8 -.5 1.2 .4 1 1.4C.8 2.2 .4 2.6 0 2.6C-.4 2.6 -.8 2.2 -1 1.4C-1.2 .4 -.8 -.5 0 -.5Z',
};
const gull = (x, y, s, d, cls = '', style = '') => `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})"><g class="${cls}" style="--d:${f(d)}s;${style}">` +
  `<g class="tv9-flap" style="--d:${f(d)}s"><path class="tv9-wing" d="${GULL.l}"/><path class="tv9-wing" d="${GULL.r}"/><path class="tv9-tip" d="${GULL.lt}"/><path class="tv9-tip" d="${GULL.rt}"/></g>` +
  `<path class="tv9-gbody" d="${GULL.body}"/></g></g>`;

/* ---- 1989 (Taylor's Version): Across the water ---- */
function n1989TV() {
  const rand = R(2023);
  // The far shore: the original 1989's city, small and pale. Low under the words, taller in the
  // gaps, with its stepped tower and its water tower where a phone still shows them.
  const shore = 47.2;
  let city = '', legs = '', wins = '';
  const bld = (x, w, h) => {
    city += `<rect x="${f(x)}" y="${f(shore - h)}" width="${f(w)}" height="${f(h + .4)}"/>`;
    for (let wy = shore - h + 1.4; wy < shore - .8; wy += 1.9) for (let wx = x + .9; wx < x + w - .9; wx += 1.7)
      if (rand() < .5) wins += `<rect class="tv9-win" x="${f(wx)}" y="${f(wy)}" width=".7" height=".9" style="--d:${f(.3 + rand() * 1.4)}s"/>`;
  };
  for (let x = 120; x < 480;) {
    const w = 4 + rand() * 7, mid = x + w / 2, low = Math.abs(mid - 300) < 92;
    bld(x, w, low ? 1.6 + rand() * 2.8 : 4 + rand() * 7 * smooth(92, 140, Math.abs(mid - 300)) + rand() * 2);
    x += w + (rand() < .3 ? .8 : 0);
  }
  // The stepped tower with its mast, and a water tower on a roof.
  city += `<rect x="424" y="${f(shore - 15)}" width="6.4" height="15.4"/><rect x="425.4" y="${f(shore - 18)}" width="3.6" height="3.4"/><rect x="426.9" y="${f(shore - 23)}" width=".5" height="5.4"/>`;
  wins += `<rect class="tv9-win" x="425.4" y="${f(shore - 13)}" width=".7" height=".9" style="--d:.5s"/><rect class="tv9-win" x="427.8" y="${f(shore - 9)}" width=".7" height=".9" style="--d:.9s"/>`;
  const wt = 186, wtop = shore - 7.6;
  city += `<rect x="${wt - 2}" y="${f(wtop - 4.2)}" width="4" height="3.4" rx=".4"/><path d="M${wt - 2.3} ${f(wtop - 4.2)}L${wt} ${f(wtop - 6.2)}L${wt + 2.3} ${f(wtop - 4.2)}Z"/>`;
  legs += `M${wt - 1.6} ${f(wtop)}L${wt - 1.3} ${f(wtop - 1)}M${wt + 1.6} ${f(wtop)}L${wt + 1.3} ${f(wtop - 1)}`;
  // The sea: glints by day, the lit windows laid on it by night.
  let glints = '', reflect = '';
  for (let k = 0; k < 22; k++) { const x = rand() * 600, y = 48.4 + rand() * 4.4; glints += `M${f(x)} ${f(y)}h${f(1.4 + rand() * 3.5)}`; }
  for (let k = 0; k < 26; k++) { const x = 130 + rand() * 340; if (Math.abs(x - 300) < 80 && rand() < .6) continue; reflect += `<rect class="tv9-reflect" x="${f(x)}" y="${f(48.2 + rand() * 4)}" width="${f(.8 + rand() * 1.6)}" height=".45" style="--d:${f(.5 + rand() * 1.2)}s"/>`; }
  // Dunes at the ends, marram grass along their crests, and a strip of sand between.
  const dune = (x) => 54.5 - 11 * smooth(0, 1, (150 - x) / 150) - 12 * smooth(0, 1, (x - 450) / 150) - 1.4 * Math.sin(x / 13);
  let d = 'M-6 62';
  for (let x = -6; x <= 606; x += 3) d += `L${x} ${f(Math.min(54.5, dune(x)))}`;
  d += 'L606 62Z';
  let grass = '';
  for (let x = -4; x < 604; x += 1.2 + rand() * 2.4) {
    const g = dune(x);
    if (g > 52.2) continue;
    const n = 2 + Math.floor(rand() * 3);
    for (let k = 0; k < n; k++) { const h = 3 + rand() * 5 * (g < 50 ? 1.2 : .6), lean = (rand() - .4) * 3; grass += `M${f(x)} ${f(g + .6)}Q${f(x + lean * .3)} ${f(g - h * .6)} ${f(x + lean)} ${f(g - h)}`; }
  }
  // Two gulls standing on the sand, and a third on the dune; on hover they lift off over the water.
  const standing = (x, y, s) => `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s)})"><g class="tv9-sgull"><path d="M-2.6 -2.4C-2.2 -3.6 -.8 -4 .6 -3.6L2.4 -4.2C3.2 -4.8 4 -4.4 3.9 -3.7L3.4 -3.3C3 -2 1.6 -.9 -.2 -.9L-3.4 -1.2Z"/><path class="tv9-tip" d="M-3.4 -1.2L-5 -1.5L-2.6 -2.4Z"/><path d="M-.2 -.9V0M.8 -1V0" stroke="#d48a5a" stroke-width=".35" fill="none"/></g></g>`;
  const perched = [[176, 56.6, 1, .2, -40, -30], [196, 57.4, .9, .45, 60, -34], [430, 56, 1, .1, -70, -28]];
  // And a pair already up over the water, gliding where a phone still shows them. On hover they
  // drift off along the shore, away from the words, as the light goes.
  const pair = [[176, 12.5, 1.05, .15, -22, -4], [193, 19, .8, .3, -18, -1.5]].map(([x, y, sc, dl, mx, my]) =>
    gull(x, y, sc, dl, 'tv9-glide', `--mx:${f(mx / sc)}px;--my:${f(my / sc)}px`)).join('');
  const birds = pair + perched.map(([x, y, sc, dl, lx, ly]) => `<g class="tv9-perch" style="--d:${dl}s">${standing(x, y, sc)}</g>` +
    gull(x, y - 3.4, sc * .82, dl, 'tv9-lift', `--lx:${f(lx / sc / .82)}px;--ly:${f(ly / sc / .82)}px`)).join('');
  return { fx: `<i class="tv9-dusk"></i>` + strip('tv9-across', `<g class="tv9-city">${city}</g><path class="tv9-city-legs" d="${legs}"/>${wins}` +
    `<rect class="tv9-asea" x="-6" y="${shore}" width="612" height="10"/><path class="tv9-aglint" d="${glints}"/>${reflect}` +
    `<path class="tv9-sand" d="M-6 53.2C150 52.6 300 54 606 53.2V62H-6Z"/><path class="tv9-dune" d="${d}"/><path class="tv9-grass" d="${grass}"/>${birds}`) };
}

/* ---------- the 13th of every month: Thirteen marks ----------
   A slate with a count chalked on it: two gates of five before the words and two strokes after
   them, twelve, and on hover the thirteenth is struck. The slate (last month's count rubbed out
   at each end, the eraser's smears, the ledge and its chalk) is a strip cropped from the middle
   like every other finish. The count is NOT: it is two small drawings that layoutAnniversaryArt
   lays either side of the words, measured off the label, splits more evenly on a phone, and
   shrinks together when a gutter is too narrow for them. A count with a mark cropped off is a
   different number, so every one of the thirteen shows at every width, for every choice of
   words. Designed on
   scripts/cta/thirteenth-board.html. */
const chalkMarks = (rand) => {
  const stroke = (x1, y1, x2, y2, w, cls = '') => {
    const mx = (x1 + x2) / 2 + (rand() - .5) * .9, my = (y1 + y2) / 2 + (rand() - .5) * .6;
    return `<path class="ch-mark${cls ? ` ${cls}` : ''}" d="M${f(x1)} ${f(y1)}Q${f(mx)} ${f(my)} ${f(x2)} ${f(y2)}" stroke-width="${f(w)}"${cls ? ' pathLength="1"' : ''}/>`;
  };
  // Each stroke its own length, lean and weight, and each gate's bar at its own angle.
  const vert = (x, cls) => { const top = 16.2 + rand() * 2.8, bot = 41.4 + rand() * 2.6, lean = (rand() - .4) * 2.4; return stroke(x + lean * .5, top, x - lean * .5, bot, 3.1 + rand() * .9, cls); };
  const gate = (x0, xs) => xs.map((dx) => vert(x0 + dx)).join('') + stroke(x0 - 6 + rand(), 37.6 + rand() * 2.6, x0 + xs[3] + 5 + rand(), 20.4 + rand() * 2, 3.3 + rand() * .5);
  return { vert, gate };
};
// The grit a stick of chalk leaves: the stroke eaten into by the slate's grain, its edge roughed.
const chalkGrit = (id) => `<filter id="${id}" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="13" result="n"/>` +
  `<feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2.6 0 0 0 1.75" result="grit"/><feComposite in="SourceGraphic" in2="grit" operator="in" result="g"/>` +
  `<feDisplacementMap in="g" in2="n" scale="1.2" xChannelSelector="G" yChannelSelector="B"/></filter>`;
// The halves of the count, in the strip's own units so that at full size they match the slate's
// scale: [viewBox x, y, width, height]. Two ways of splitting the thirteen. l and r are the one
// drawn for the button, two gates before the words and three strokes after, and it is used
// wherever it fits nearly full size. That lopsided split needs a wide left gutter, and a phone's
// has about half of it, so there l2 and r2 even it out, a gate and two strokes each side of the
// words, then a gate and the thirteenth, which lets the marks stay large enough to read as chalk.
const COUNT_BOX = { l: [123, 13.5, 70, 33], r: [411, 13.5, 24, 33], l2: [123, 13.5, 50, 33], r2: [407, 13.5, 43, 33] };
function thirteenMarks() {
  const rand = R(3939), id = `anvCh${++serial}`;
  const { vert, gate } = chalkMarks(rand);
  const halves = {
    l: gate(131.4, [0, 6.9, 13.6, 20.2]) + gate(164.6, [0, 6.6, 13.4, 19.8]),
    r: vert(415.4) + vert(423) + vert(430.8, 'ch-13'),
    l2: gate(131.4, [0, 6.8, 13.7, 20.3]) + vert(161.8) + vert(169.2),
    r2: gate(415.2, [0, 6.7, 13.3, 19.9]) + vert(446.2, 'ch-13'),
  };
  // Last month's count, rubbed out but not quite gone, out at each end of a wide button.
  const ghosts = gate(18, [0, 7, 14, 21.4]) + gate(58, [0, 7.6, 14.6, 22]) + vert(96) + vert(103.4) + vert(110.6) +
    gate(470, [0, 7.2, 14.4, 21.6]) + gate(510, [0, 7.4, 14.8, 22.2]) + vert(548) + vert(555.6) + vert(562.8);
  const smears = [[96, 14, 150, 8, -2], [300, 50, 250, 9, 1], [486, 22, 170, 10, -1.5], [220, 7, 130, 6, 1], [560, 44, 110, 8, 2], [40, 44, 90, 9, -1]]
    .map(([cx, cy, w, h, r]) => `<rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${h / 2}" transform="rotate(${r} ${cx} ${cy})" opacity="${f(.035 + rand() * .035)}"/>`).join('');
  // The dust knocked off as the thirteenth lands, falling toward the ledge.
  const dust = (x) => { let d = ''; for (let k = 0; k < 12; k++) d += `<circle class="ch-dust" cx="${f(x + (rand() - .5) * 3.4)}" cy="${f(40 + rand() * 3)}" r="${f(.4 + rand() * .5)}" style="--d:${f(rand() * .2)}s;--dx:${f((rand() - .5) * 8)}px;--dy:${f(8 + rand() * 5)}px"/>`; return d; };
  const falls = { r: dust(431), r2: dust(446.6) };
  let crumbs = '';
  for (let k = 0; k < 60; k++) crumbs += `<circle class="ch-crumb" cx="${f(rand() * 600)}" cy="${f(55.2 + rand() * .9)}" r="${f(.2 + rand() * .35)}"/>`;
  const stick = `<g transform="translate(452 54.7) rotate(-3)"><rect class="ch-stick" x="-12" y="-3.6" width="24" height="3.6" rx="1.7"/><rect class="ch-stick-shade" x="-11.6" y="-1.2" width="23.2" height="1.2" rx=".6"/><ellipse class="ch-stick-end" cx="11.6" cy="-1.8" rx=".9" ry="1.75"/></g>`;
  const defs = chalkGrit(`${id}c`) + `<filter id="${id}s" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="2.4"/></filter>` +
    `<linearGradient id="${id}w" x1="0" x2="0" y1="0" y2="1"><stop offset="0" class="ch-w0"/><stop offset="1" class="ch-w1"/></linearGradient>`;
  const half = (side) => { const [x, y, w, h] = COUNT_BOX[side];
    return `<svg class="ch-count ch-count--${side}" viewBox="${x} ${y} ${w} ${h}"><defs>${chalkGrit(`${id}${side}`)}</defs><g filter="url(#${id}${side})">${halves[side]}</g>${falls[side] || ''}</svg>`; };
  return { fx: strip('ch-slate', `<defs>${defs}</defs><g class="ch-smear" filter="url(#${id}s)">${smears}</g><g class="ch-ghost" filter="url(#${id}c)">${ghosts}</g>` +
    `<rect x="-6" y="54.6" width="612" height="8" fill="url(#${id}w)"/><path class="ch-ledge-hi" d="M-6 55H606"/>${crumbs}${stick}`) + Object.keys(COUNT_BOX).map(half).join('') };
}
// Lays the count beside the words: the left half ends a gap short of the label, the right half
// starts a gap past it, and both share one scale, the largest that lets each fit its gutter. The
// drawn split is kept while it fits at nine tenths of full size or better; below that the even
// split takes over, with a tighter gap, since it keeps the marks larger.
function layCount(btn) {
  const fx = btn.querySelector('.cta-fx'), label = btn.querySelector('.cta-label');
  const counts = btn.querySelectorAll('.ch-count');
  if (!fx || !label || counts.length !== 4 || !btn.offsetWidth) return;
  const box = btn.getBoundingClientRect(), text = label.getBoundingClientRect();
  if (!box.width) return;
  const k0 = btn.offsetWidth / box.width; // undo a preview's scale: work in the button's own pixels
  const W = fx.clientWidth, H = fx.clientHeight, u = H / 60;
  const from = (x) => (x - box.left) * k0 - btn.clientLeft;
  const labelL = from(text.left), labelR = from(text.right);
  const fit = (a, b, gap, edge) => Math.min(1, (labelL - gap - edge) / (COUNT_BOX[a][2] * u), (W - labelR - gap - edge) / (COUNT_BOX[b][2] * u));
  const drawn = fit('l', 'r', 7, 5);
  const [a, b, gap, k] = drawn >= .9 ? ['l', 'r', 7, drawn] : ['l2', 'r2', 5, Math.max(.2, fit('l2', 'r2', 5, 3))];
  const top = H / 2 - (30 - COUNT_BOX[a][1]) * u * k, h = COUNT_BOX[a][3] * u * k;
  const put = (side, left) => Object.assign(btn.querySelector(`.ch-count--${side}`).style,
    { display: '', left: `${f(left)}px`, top: `${f(top)}px`, width: `${f(COUNT_BOX[side][2] * u * k)}px`, height: `${f(h)}px` });
  counts.forEach((el) => { el.style.display = 'none'; });
  put(a, labelL - gap - COUNT_BOX[a][2] * u * k);
  put(b, labelR + gap);
}

// The finish the button is forced into on the 13th of every month, or "". A release day outranks
// it, the way a record's day outranks the 13th in the margin note: paintStartButton asks
// anniversaryFinishFor first. Only the 13th itself counts; the days that add up to 13 keep their
// margin note and the player's own button, since forcing the finish on those too would take the
// button away from the player on some forty days a year.
export const thirteenthFinishFor = (dateKey) => dateKey?.slice(8, 10) === "13" ? "anv-13th" : "";

/* ---- Her birthday: Iced for her ---- */
// Number candles drawn as fat strokes: each numeral's spine, the top of its wick, and two places
// on its face where the glitter catches the light once it is lit. All ten, since the age moves.
const DIGITS = {
  0: ['M0 -8.6C4.8 -8.6 4.8 8.6 0 8.6C-4.8 8.6 -4.8 -8.6 0 -8.6Z', [0, -10.9], [[-3.4, -5], [3.5, 4.2]]],
  1: ['M-3.2 -5.2L.6 -8.6V8.6', [.6, -10.9], [[.6, -5], [.6, 5.5]]],
  2: ['M-4.2 -5.4C-3.2 -9.6 4.4 -9.8 4.2 -4.6C4 -1.2 -1.6 2.6 -4.4 8.4H4.6', [0, -11], [[3.4, -6.6], [-1.5, 8.4]]],
  3: ['M-4.4 -6.6C-3 -9.8 3.6 -9.8 3.8 -5.4C3.9 -2.6 1 -1.1 -1 -.8C1.6 -.6 4.6 .8 4.4 4.4C4.2 9 -2.8 9.6 -4.8 6.6', [-.2, -11.4], [[2.8, -7.6], [3.6, 4]]],
  4: ['M2.4 8.6V-8.6L-4.8 3.4H5', [2.4, -10.9], [[2.4, -3], [-2.6, 3.4]]],
  5: ['M4 -8.4H-3.2L-3.8 -1.2C-1.8 -2.6 4.2 -2.8 4.4 2.6C4.6 8.8 -2.4 9.8 -4.6 6.4', [.4, -10.6], [[.4, -8.4], [3.7, 3.8]]],
  6: ['M3.6 -7.6C1 -9.8 -4.4 -8.6 -4.4 .8C-4.4 7 -2 8.8 .2 8.8C3 8.8 4.4 6.6 4.4 3.8C4.4 .8 2.4 -1 -.2 -1C-2.6 -1 -4.2 .8 -4.4 2.4', [-.6, -11], [[-3.9, -3], [3.6, 5.8]]],
  7: ['M-4.6 -8H4.4C1.6 -3.6 -.2 1.6 -1.2 8.2', [0, -10.2], [[2, -8], [-.4, 4.2]]],
  8: ['M0 -.6C-3.6 -.8 -4 -8.6 0 -8.6C4 -8.6 3.6 -.8 0 -.6C-4.4 -.4 -4.6 8.6 0 8.6C4.6 8.6 4.4 -.4 0 -.6Z', [0, -10.8], [[-2.6, -6.4], [2.9, 5.4]]],
  9: ['M4.4 -2.4C4.2 -.8 2.6 1 .2 1C-2.4 1 -4.4 -.8 -4.4 -3.8C-4.4 -6.6 -3 -8.8 -.2 -8.8C2 -8.8 4.4 -7 4.4 -.8C4.4 8.6 -1 9.8 -3.6 7.6', [0, -11], [[-3.2, -6.2], [3.5, -1.4]]],
};
// A candle flame with its base at the wick: a soft teardrop, a white core, a little blue at the root.
const FLAME = 'M0 .7C-1.7 -.5 -2 -3 -1 -5.2C-.6 -6.3 -.1 -7.4 0 -8.8C.6 -7.2 1.9 -5.4 1.9 -3.2C1.9 -1.2 1.1 .2 0 .7Z';
const CORE = 'M0 .3C-.8 -.4 -.9 -1.9 -.3 -3.6C.1 -2.4 .9 -1.5 .8 -.3C.6 .1 .3 .3 0 .3Z';
const flame = (id) => `<path d="${FLAME}" fill="url(#${id}f)"/><path d="${CORE}" fill="#fffef6" opacity=".85"/><ellipse cx="0" cy="-.4" rx=".7" ry=".95" fill="#86a2ff" opacity=".45"/>`;
const scallop = (r, n) => { let d = ''; for (let i = 0; i <= n; i++) { const a = i / n * Math.PI * 2, m = (i - .5) / n * Math.PI * 2;
  const p = [Math.cos(a) * r * .86, Math.sin(a) * r * .86], c = [Math.cos(m) * r * 1.14, Math.sin(m) * r * 1.14];
  d += i ? `Q${f(c[0])} ${f(c[1])} ${f(p[0])} ${f(p[1])}` : `M${f(p[0])} ${f(p[1])}`; } return d + 'Z'; };
const tint = (hex, t) => '#' + [1, 3, 5].map((i) => Math.round(parseInt(hex.slice(i, i + 2), 16) * (1 - t) + 255 * t).toString(16).padStart(2, '0')).join('');
// The sprinkles take the bright eras; reputation's and folklore's greys would read as dust.
const SPRINKLES = ['Taylor Swift', 'Fearless', 'Speak Now', 'Red', '1989', 'Lover', 'Midnights', 'The Life of a Showgirl'].map((n) => tint(ALBUM_COLORS[n], .22));
const BIRTHDAY = TS_MILESTONES.find((m) => m.kind === "birthday");
// Her age on the birthday `dateKey` falls on, which is the one day this finish is worn. With no
// date (a design board) it is her next birthday's.
function birthdayAge(dateKey) {
  if (dateKey) return +dateKey.slice(0, 4) - BIRTHDAY.year;
  const d = new Date();
  return d.getFullYear() + (d.getMonth() === 11 && d.getDate() > 13 ? 1 : 0) - BIRTHDAY.year;
}
// The button is the cake, seen from above: buttercream with a piped shell border along both
// edges, rosettes and sprinkles out at the ends, Happy birthday piped in raspberry, and the words
// piped in the same icing, where a cake's message goes. Beside them stand gold number candles in
// her age that day. On hover a struck match comes in from the right and lights them, the last
// digit first; each flame flares as it catches and settles, the glitter on the gold starts to
// catch the light, and the match is shaken out and taken away, leaving a curl of smoke.
function birthdayCake(dateKey) {
  const id = `anvBd${++serial}`, rand = R(1312);
  // The sprinkles keep out of the middle band, where the words are and where the inscription and
  // the candles are laid beside them at whatever width the button is.
  const clear = (x, y) => !(x > 118 && x < 482 && y > 12 && y < 48);
  // Palette knife marks in the buttercream.
  let knife = '', knifeHi = '';
  for (let k = 0; k < 7; k++) { const x = rand() * 600, y = 12 + rand() * 36, w = 34 + rand() * 60, b = (rand() - .5) * 12;
    knife += `M${f(x - w / 2)} ${f(y)}q${f(w / 2)} ${f(b)} ${f(w)} ${f(-b * .3)}`; knifeHi += `M${f(x - w / 2 + 4)} ${f(y - 1.2)}q${f(w / 2 - 4)} ${f(b)} ${f(w - 8)} ${f(-b * .3)}`; }
  // The shell border, piped along the top edge and back along the bottom.
  const SHELL = 'M-3.4 .4C-3.8 -2 -1.6 -3.4 .6 -3C2.4 -2.6 3.6 -1.2 5.8 -.2C3.8 .5 2.6 2.4 .2 2.8C-1.8 3.1 -3.2 2 -3.4 .4Z';
  const RIDGE = 'M-2.4 -1.4Q.6 -1.2 4 -.5M-2.6 1Q.4 .8 3.8 .1';
  let shells = '';
  for (const [y, dir, x0] of [[3.4, 1, -8], [56.6, -1, -5]]) for (let x = x0; x < 612; x += 6.4)
    shells += `<g transform="translate(${f(x)} ${f(y + (rand() - .5) * .5)}) scale(${dir} 1) rotate(${f((rand() - .5) * 8)})"><path class="bd-shell" d="${SHELL}"/><path class="bd-ridge" d="${RIDGE}"/><path class="bd-hi" d="M-2.6 -.6Q-2.4 -2 -.6 -2.4"/></g>`;
  // Rosettes out at each end, each with a silver dragee in the middle.
  const rosette = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s}) rotate(${f(rand() * 360)})"><path class="bd-shell" d="${scallop(5.4, 9)}"/>` +
    `<path class="bd-ridge" d="M-.9 .2a.9 .9 0 1 1 1.8 -.1a2 2 0 1 1 -3.9 .3a3.1 3.1 0 1 1 6.2 -.2a4.2 4.2 0 1 1 -8.3 .6"/><path class="bd-hi" d="M-3.6 -2.2Q-2.4 -3.8 -.4 -4.1"/>` +
    `<circle class="bd-pearl" r="1.15"/><circle class="bd-pearl-hi" cx="-.35" cy="-.4" r=".38"/></g>`;
  const roses = rosette(40, 31, 1.45) + rosette(88, 19, 1.1) + rosette(110, 41, 1) + rosette(510, 21, 1.05) + rosette(548, 39, 1.45) + rosette(584, 18, .95);
  let sprinkles = '';
  for (let k = 0; k < 120; k++) { const x = 8 + rand() * 584, y = 10 + rand() * 40; if (!clear(x, y)) continue;
    sprinkles += rand() < .82 ? `<rect x="${f(x - 1.3)}" y="${f(y - .45)}" width="2.6" height=".9" rx=".45" fill="${SPRINKLES[k % SPRINKLES.length]}" transform="rotate(${f(rand() * 180)} ${f(x)} ${f(y)})"/>`
      : `<circle class="bd-pearl" cx="${f(x)}" cy="${f(y)}" r=".75"/><circle class="bd-pearl-hi" cx="${f(x - .25)}" cy="${f(y - .28)}" r=".25"/>`; }
  const script = (t, x, y) => `<text class="bd-script-shadow" x="${f(x + .45)}" y="${f(y + .6)}">${t}</text><text class="bd-script" x="${x}" y="${y}">${t}</text>`;
  const words = `<g transform="rotate(-5 166 34)">${script('Happy', 164, 28.5)}${script('birthday', 167, 41)}</g>`;
  // Her age in gold number candles, a digit or two (or three, one day) standing just past the words.
  const digits = String(birthdayAge(dateKey)).split(''), S = 1.14;
  const n = digits.length, place = digits.map((_, i) => n === 1 ? [438, 31.6, 0] : [427 + i * (n === 2 ? 23 : 19), 31.6 + (i % 2) * .6, i % 2 ? 4 : -5]);
  const wick = ([x, y, r], [wx, wy]) => { const a = r * Math.PI / 180; return [x + S * (wx * Math.cos(a) - wy * Math.sin(a)), y + S * (wx * Math.sin(a) + wy * Math.cos(a))]; };
  const wicks = digits.map((dg, i) => wick(place[i], [DIGITS[dg][1][0], DIGITS[dg][1][1] - 1.1]));
  // The match comes in from the right, so the last digit is lit first. It dips to each wick in
  // turn, at 30% and 58% of its run, and each candle catches as it touches.
  const MATCH_T = 1.6, first = wicks[wicks.length - 1], last = wicks[0];
  const catchAt = (i) => n === 1 ? .48 : .48 + (n - 1 - i) / (n - 1) * .45;
  let glows = '', nums = '';
  digits.forEach((dg, i) => { const [d, [wx, wy], glints] = DIGITS[dg], [x, y, r] = place[i], at = f(catchAt(i));
    glows += `<ellipse class="bd-glow" style="--d:${at}s" cx="${f(x)}" cy="${f(y - 9)}" rx="22" ry="17" fill="url(#${id}w)"/>`;
    nums += `<g transform="translate(${f(x)} ${f(y)}) rotate(${r}) scale(${S})"><ellipse class="bd-cast" cx="1.8" cy="10.6" rx="7.2" ry="1.7"/><path class="bd-num-edge" d="${d}" transform="translate(.9 1.3)"/>` +
      `<path class="bd-num" d="${d}" stroke="url(#${id}g)"/><path class="bd-num-hi" d="${d}" transform="translate(-.9 -.8)"/>` +
      glints.map(([gx, gy], k) => `<g transform="translate(${gx} ${gy})"><path class="bd-glint" style="--d:${at}s;--gd:${f(.25 + k * .55 + rand() * .3)}s" d="M0 -1.9C.15 -.5 .5 -.15 1.9 0C.5 .15 .15 .5 0 1.9C-.15 .5 -.5 .15 -1.9 0C-.5 -.15 -.15 -.5 0 -1.9Z"/></g>`).join('') +
      `<path class="bd-wick" d="M${wx} ${wy + 1.8}V${f(wy - 1.1)}"/>` +
      `<g transform="translate(${wx} ${f(wy - .5)}) rotate(${-r})"><g class="bd-flame" style="--d:${at}s"><g class="bd-catch" style="--d:${at}s"><g class="bd-flick" style="--ft:${f(.55 + rand() * .3)}s;--fd:${f(-rand())}s" transform="scale(1.45)">${flame(id)}</g></g></g></g></g>`; });
  // The match: held from the upper right, its head charred where it was struck, and a flame of its
  // own. It is drawn resting on the first wick; the animation carries it in, across and away.
  const mx = first[0] + 2, my = first[1] + 2.4;
  const match = `<g transform="translate(${f(mx)} ${f(my)})"><g class="bd-match" style="--ax:44px;--ay:-26px;--bx:${f(last[0] - first[0])}px;--by:${f(last[1] - first[1])}px;--t:${MATCH_T}s">` +
    `<g transform="rotate(-36)"><rect class="bd-match-cast" x="2.6" y="1.3" width="27" height="2" rx=".4"/><rect class="bd-stick" x="1.2" y="-1" width="27" height="2" rx=".4"/>` +
    `<rect class="bd-stick-shade" x="1.2" y=".35" width="27" height=".65"/><ellipse class="bd-head" cx=".6" cy="0" rx="2.5" ry="1.75"/><ellipse class="bd-head-hi" cx="0" cy="-.45" rx="1.05" ry=".6"/></g>` +
    `<g class="bd-mflame"><g transform="translate(-.3 -.6) scale(2)">${flame(id)}</g></g>` +
    `<path class="bd-msmoke" pathLength="1" d="M-.2 -1C1 -3.4 -1.2 -5.6 .2 -8.2S1.8 -12 .4 -14.6"/></g></g>`;
  const defs = `<pattern id="${id}g" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#e2b85a"/><circle cx="1" cy="1.4" r=".45" fill="#fff6d6"/><circle cx="4.1" cy="3.2" r=".35" fill="#fff"/><circle cx="2.6" cy="4.9" r=".42" fill="#b98a2e"/><circle cx="5.2" cy=".6" r=".3" fill="#fff3c4"/><circle cx="4.6" cy="5.3" r=".3" fill="#f6dc93"/></pattern>` +
    `<radialGradient id="${id}f" cx=".5" cy=".78" r=".75"><stop offset="0" stop-color="#fffdf0"/><stop offset=".38" stop-color="#ffe89a"/><stop offset=".8" stop-color="#ffa53e"/><stop offset="1" stop-color="#f07a2a"/></radialGradient>` +
    `<radialGradient id="${id}w"><stop offset="0" stop-color="#ffc467" stop-opacity=".5"/><stop offset=".5" stop-color="#ffc467" stop-opacity=".16"/><stop offset="1" stop-color="#ffc467" stop-opacity="0"/></radialGradient>`;
  // The inscription and the candles are each their own drawing, laid either side of the words by
  // layCake rather than cropped from the middle of the strip: a phone's gutters are too narrow to
  // crop from, and would cut the age in half.
  const half = (side, inner) => { const [x, y, w, h] = CAKE_BOX[side]; return `<svg class="bd-half bd-half--${side}" viewBox="${x} ${y} ${w} ${h}">${inner}</svg>`; };
  return { fx: strip('bd-cake', `<defs>${defs}</defs><path class="bd-knife" d="${knife}"/><path class="bd-knife-hi" d="${knifeHi}"/>${sprinkles}${roses}${shells}`) +
    half('l', words) + half('r', glows + nums + match) };
}
// The ink of the inscription and of the candles in the strip's own units, [x, y, width, height],
// which is what has to fit beside the words. The glow and the match reach past them, and are
// allowed to: only the button's edge clips them.
const CAKE_BOX = { l: [144, 13, 47, 35], r: [417, 6, 43, 42] };
// Lays the inscription and the candles either side of the words at one shared scale, the way the
// 13th's count is laid. Where both fit at full size with a generous gap, which is everywhere wider
// than a phone, that is how they sit; on a phone the gap closes and both come down together, to
// about four fifths of full size at 375px.
function layCake(btn) {
  const fx = btn.querySelector('.cta-fx'), label = btn.querySelector('.cta-label');
  if (!fx || !label || btn.querySelectorAll('.bd-half').length !== 2 || !btn.offsetWidth) return;
  const box = btn.getBoundingClientRect(), text = label.getBoundingClientRect();
  if (!box.width) return;
  const k0 = btn.offsetWidth / box.width; // undo a preview's scale: work in the button's own pixels
  const W = fx.clientWidth, H = fx.clientHeight, u = H / 60;
  const from = (x) => (x - box.left) * k0 - btn.clientLeft;
  const labelL = from(text.left), labelR = from(text.right);
  const fit = (gap) => Math.min(1, (labelL - gap - 3) / (CAKE_BOX.l[2] * u), (W - labelR - gap - 3) / (CAKE_BOX.r[2] * u));
  const gap = fit(14) >= 1 ? 14 : 6, k = Math.max(.2, fit(gap));
  const put = (side, left) => { const [, y, w, h] = CAKE_BOX[side];
    Object.assign(btn.querySelector(`.bd-half--${side}`).style, { left: `${f(left)}px`, top: `${f(H / 2 + (y - 30) * u * k)}px`, width: `${f(w * u * k)}px`, height: `${f(h * u * k)}px` }); };
  put('l', labelL - gap - CAKE_BOX.l[2] * u * k);
  put('r', labelR + gap);
}

// The finish the button is forced into on her birthday, or "". It outranks the 13th, which her
// birthday always is, or it would never be seen; paintStartButton asks it before
// thirteenthFinishFor. No record has come out on 13 December, so nothing outranks it in turn,
// though a release day would, being asked first. The day comes off her row in TS_MILESTONES, so
// the button and the margin note cannot disagree about it.
export const birthdayFinishFor = (dateKey) => dateKey?.slice(5) === BIRTHDAY.md ? "anv-birthday" : "";

/* ---- Christmas Day: Fresh off the baler ---- */
// The tree you took home from the farm she grew up on, the way it comes off the baler: Fraser fir
// boughs swept flat toward the tip and held in a red twine net, every cell of it pillowed out
// between the twines, and the farm's manila tag tied on in baker's twine, which is where the words
// are written. On hover a pair of scissors runs the length of it, the net springs apart behind
// them, the boughs relax open, a few needles come down and the tag swings once.
//
// One spray of Fraser fir, pointing +x from its base at the origin: a midrib with short flat
// needles in two ranks, and side shoots off it, each needled the same way and shorter toward the
// tip. A few needles in thirty are turned over to show the silver underside.
const DEG = Math.PI / 180;
function firSpray(rand, L) {
  const bow = (rand() - .5) * 3.4, end = bow * .3 + (rand() - .5) * 1.2;
  const at = (t) => [2 * (1 - t) * t * (L / 2) + t * t * L, 2 * (1 - t) * t * bow + t * t * end];
  // Needles near the end of a shoot are this year's growth and a shade brighter, so every spray
  // carries its own light toward the tip; that is most of what makes it read as a bough rather
  // than as a green texture.
  let green = '', tip = '', silver = '', twig = `M0 0Q${f(L / 2)} ${f(bow)} ${f(L)} ${f(end)}`;
  const needles = (x, y, ux, uy, n0, k, young) => {
    for (const side of [-1, 1]) {
      const a = side * (48 + rand() * 18) * DEG, l = n0 * k * (.82 + rand() * .36);
      const nx = ux * Math.cos(a) - uy * Math.sin(a), ny = ux * Math.sin(a) + uy * Math.cos(a);
      const seg = `M${f(x)} ${f(y)}l${f(nx * l)} ${f(ny * l)}`;
      if (rand() < .03) silver += seg; else if (young) tip += seg; else green += seg;
    }
  };
  for (let t = .03; t < .99; t += (.03 + rand() * .01)) {
    const [x, y] = at(t), [x2, y2] = at(t + .01), m = Math.hypot(x2 - x, y2 - y);
    needles(x, y, (x2 - x) / m, (y2 - y) / m, 3.3, 1 - t * .4, t > .7);
  }
  let side = rand() < .5 ? -1 : 1;
  for (const t0 of [.14, .27, .4, .52, .63, .74]) {
    const t = t0 + (rand() - .5) * .04, [x, y] = at(t), [x2, y2] = at(t + .01), m = Math.hypot(x2 - x, y2 - y);
    const ux = (x2 - x) / m, uy = (y2 - y) / m, a = side * (34 + rand() * 12) * DEG;
    const bx = ux * Math.cos(a) - uy * Math.sin(a), by = ux * Math.sin(a) + uy * Math.cos(a);
    const len = L * (.34 - t * .28) * (.85 + rand() * .3);
    twig += `M${f(x)} ${f(y)}l${f(bx * len)} ${f(by * len)}`;
    for (let s = .8; s < len; s += .9 + rand() * .25) needles(x + bx * s, y + by * s, bx, by, 2.7, 1 - s / len * .35, s > len * .6);
    side = -side;
  }
  return { green, tip, silver, twig };
}
function balerTree() {
  const id = `anvNt${++serial}`, rand = R(1225);
  // Five sprays, used over and over at their own angles and sizes.
  const KINDS = 5, defs = Array.from({ length: KINDS }, (_, k) => {
    const s = firSpray(rand, 36);
    return `<g id="${id}s${k}"><path d="${s.twig}" fill="none" style="stroke:var(--nt-twig)" stroke-width=".8" stroke-linecap="round"/>` +
      `<path d="${s.green}" fill="none" stroke="currentColor" stroke-width=".8" stroke-linecap="round"/>` +
      `<path d="${s.tip}" fill="none" style="stroke:var(--tc)" stroke-width=".78" stroke-linecap="round"/>` +
      `<path d="${s.silver}" fill="none" style="stroke:var(--nt-silver)" stroke-width=".7" stroke-linecap="round" opacity=".7"/></g>`;
  }).join('');
  // The cut runs from the left, 0..1 of the way along by x, and everything on hover keys its
  // delay to where it is, so the net parts and the boughs open just behind the scissors.
  const RUN = .8, cutAt = (x) => .05 + RUN * Math.min(1, Math.max(0, (x + 20) / 650));
  // Lit from above: the top of the bundle catches the light and the underside is in its shadow.
  const tone = (y) => y < 16 ? ['var(--nt-hi)', 'var(--nt-hi-tip)'] : y < 40 ? ['var(--nt-lo)', 'var(--nt-lo-tip)'] : ['var(--nt-dim)', 'var(--nt-dim-tip)'];
  // Back: a dark mat of sprays every which way, so no gap ever opens onto nothing. It does not move.
  let back = '';
  for (let x = -24; x < 616; x += 9 + rand() * 7) for (let y = -4; y < 66; y += 8 + rand() * 5)
    back += `<use href="#${id}s${Math.floor(rand() * KINDS)}" transform="translate(${f(x)} ${f(y)}) rotate(${f(-40 + rand() * 80)}) scale(${f(.8 + rand() * .4)})"/>`;
  // Front: the boughs as the baler left them, swept flat toward the tip, and as they open.
  let front = '';
  const rows = [-1, 8, 17, 26, 34, 43, 52, 61];
  for (let x = -44; x < 612; x += 15 + rand() * 8) rows.forEach((r) => {
    const y = r + (rand() - .5) * 8, up = y < 30, mid = 1 - Math.min(1, Math.abs(y - 30) / 32);
    const a0 = (up ? 1 : -1) * (5 + rand() * 9) * (1 - mid * .5) + (rand() - .5) * 3;
    // Open, each bough finds its own angle, leaning out from the trunk on the whole but not in
    // step with its row, or the rows part along a dark seam.
    const a1 = (up ? -1 : 1) * (2 + rand() * 24) + (rand() - .5) * 20;
    const s0 = .82 + rand() * .3, s1 = s0 * (1.12 + rand() * .14);
    const [c, tc] = tone(y + (rand() - .5) * 12);
    front += `<g transform="translate(${f(x)} ${f(y)})"><g class="nt-sp" style="--a0:${f(a0)}deg;--a1:${f(a1)}deg;--s0:${f(s0)};--s1:${f(s1)};--d:${f(cutAt(x) + .04 + rand() * .06)}s;color:${c};--tc:${tc}">` +
      `<use href="#${id}s${Math.floor(rand() * KINDS)}"/></g></g>`;
  });
  // The net: a diamond mesh round a cylinder, so the diamonds are tallest across the middle and
  // squeezed toward the top and bottom edges, where it turns away. A twisted twine, a dark line
  // under it where it presses into the boughs, and a knot at every crossing.
  const DX = 27, PHI = [-98, -72, -47, -23, 0, 23, 47, 72, 98].map((p) => p * DEG);
  const knot = (i, j) => { const r = R(i * 97 + j * 13 + 7); return [i * DX + (j % 2 ? DX / 2 : 0) + (r() - .5) * 2.2, 30 + 31.5 * Math.sin(PHI[j]) + (r() - .5) * 1.4]; };
  const groups = {};
  for (let j = 0; j < PHI.length - 1; j++) for (let i = -2; i < 26; i++) {
    const [ax, ay] = knot(i, j);
    for (const di of j % 2 ? [0, 1] : [-1, 0]) {
      const [bx, by] = knot(i + di, j + 1), mx = (ax + bx) / 2, my = (ay + by) / 2;
      const seg = `M${f(ax)} ${f(ay)}Q${f(mx + (rand() - .5) * 1.4)} ${f(my + .5)} ${f(bx)} ${f(by)}`;
      const key = `${j < 4 ? 'up' : 'dn'}${Math.round(mx / DX)}`;
      (groups[key] ||= { up: j < 4, x: mx, d: '' }).d += seg;
    }
  }
  const knots = [];
  for (let j = 1; j < PHI.length - 1; j++) for (let i = -2; i < 26; i++) knots.push([...knot(i, j), j]);
  // Every cell of the net bulges out between its twines, lit on the crown and pressed dark into
  // the groove along each twine. That pillowing is what says "netted" at a glance, and it goes
  // the moment the net is cut, cell by cell behind the scissors.
  let pillows = '';
  for (let j = 1; j < PHI.length - 1; j++) for (let i = -2; i < 26; i++) {
    const [ax, ay] = knot(i, j), [bx] = knot(i + 1, j), [, ty] = knot(i, j - 1), [, by] = knot(i, j + 1);
    const cx = (ax + bx) / 2, cy = ay, rx = (bx - ax) * .36, ry = Math.max(1.2, (by - ty) * .3);
    pillows += `<ellipse class="nt-pillow" cx="${f(cx)}" cy="${f(cy - ry * .15)}" rx="${f(rx)}" ry="${f(ry)}" fill="url(#${id}p)" style="--d:${f(cutAt(cx))}s"/>`;
  }
  const net = Object.values(groups).map((g) => {
    const ks = knots.filter(([x, y, j]) => Math.abs(x - g.x) <= DX / 2 && (g.up ? j <= 3 || (j === 4 && rand() < .5) : j >= 5));
    return `<g class="nt-net nt-${g.up ? 'up' : 'dn'}" style="--d:${f(cutAt(g.x))}s;--nx:${f(8 + rand() * 10)}px;--nr:${f((g.up ? -1 : 1) * (2 + rand() * 4))}deg">` +
      `<path d="${g.d}" fill="none" stroke="#050f08" stroke-width="5.2" stroke-linecap="round" opacity=".16"/>` +
      `<path d="${g.d}" fill="none" stroke="#050f08" stroke-width="3.2" stroke-linecap="round" opacity=".28"/>` +
      `<path d="${g.d}" fill="none" stroke="var(--nt-twine-lo)" stroke-width="2.4" opacity=".45" transform="translate(.5 .9)"/>` +
      `<path d="${g.d}" fill="none" stroke="var(--nt-twine)" stroke-width="1.7" stroke-linecap="round"/>` +
      `<path d="${g.d}" fill="none" stroke="var(--nt-twine-hi)" stroke-width=".6" stroke-dasharray="1.1 1.5" opacity=".75" transform="translate(-.25 -.3)"/>` +
      ks.map(([x, y]) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="1.5" ry="1.25" fill="var(--nt-twine)" stroke="var(--nt-twine-lo)" stroke-width=".4"/>`).join('') + `</g>`;
  }).join('');
  // The scissors: drawn with the points to the right, run along the middle, snipping.
  const scissors = `<g transform="translate(-34 30.5)"><g class="nt-scissors">` +
    `<g class="nt-blade--a"><path d="M-1.4 -.6L21 -2.4Q23 -2.1 23.4 -.9L-.4 1.2Z" fill="#e9edee" stroke="#3e4549" stroke-width=".5" stroke-linejoin="round"/>` +
    `<path d="M-.6 -.2C-3.6 -1.2 -5.6 -3.4 -6.8 -5.6" fill="none" stroke="#b5332a" stroke-width="2.6" stroke-linecap="round"/>` +
    `<ellipse cx="-9.6" cy="-7.2" rx="4.4" ry="3.3" transform="rotate(-18 -9.6 -7.2)" fill="none" stroke="#b5332a" stroke-width="2.4"/></g>` +
    `<g class="nt-blade--b"><path d="M-1.4 .6L21 2.4Q23 2.1 23.4 .9L-.4 -1.2Z" fill="#cfd6d8" stroke="#3e4549" stroke-width=".5" stroke-linejoin="round"/>` +
    `<path d="M-.6 .2C-3.6 1.2 -5.6 3.4 -6.8 5.6" fill="none" stroke="#962820" stroke-width="2.6" stroke-linecap="round"/>` +
    `<ellipse cx="-9.6" cy="7.2" rx="4.4" ry="3.3" transform="rotate(18 -9.6 7.2)" fill="none" stroke="#962820" stroke-width="2.4"/></g>` +
    `<circle r="1.25" fill="#6b7377" stroke="#2e3336" stroke-width=".4"/></g></g>`;
  // A few needles let go as the boughs open, from either side of the words.
  let falls = '';
  for (let k = 0; k < 16; k++) {
    let x = 20 + rand() * 560; if (x > 200 && x < 400) x = x < 300 ? 200 - rand() * 60 : 400 + rand() * 60;
    const y = 4 + rand() * 30;
    falls += `<path class="nt-fall" d="M${f(x)} ${f(y)}l${f(2.4 + rand())} ${f(-1.2 + rand() * 2.4)}" stroke="var(--nt-lo-tip)" stroke-width=".95" stroke-linecap="round" style="--d:${f(cutAt(x) + .35 + rand() * .5)}s;--t:${f(.9 + rand() * .6)}s;--fx:${f(-4 + rand() * 10)}px;--fy:${f(64 - y + rand() * 6)}px;--fr:${f(200 + rand() * 300)}deg;transform-box:fill-box;transform-origin:center"/>`;
  }
  const glow = `<linearGradient id="${id}l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--nt-glow)" stop-opacity=".2"/><stop offset=".6" style="stop-color:var(--nt-glow)" stop-opacity=".06"/><stop offset="1" style="stop-color:var(--nt-glow)" stop-opacity="0"/></linearGradient>` +
    `<radialGradient id="${id}p"><stop offset="0" style="stop-color:var(--nt-glow)" stop-opacity=".3"/><stop offset=".55" style="stop-color:var(--nt-glow)" stop-opacity=".12"/><stop offset="1" style="stop-color:var(--nt-glow)" stop-opacity="0"/></radialGradient>`;
  // The tag is empty until layTag has measured the words it goes round.
  return { fx: strip('nt-tree', `<defs>${defs}${glow}</defs><g style="color:var(--nt-mat);--tc:var(--nt-mat)">${back}</g>${front}<rect class="nt-light" x="-10" y="-10" width="620" height="80" fill="url(#${id}l)"/>${falls}${pillows}${net}${scissors}`) +
    `<svg class="nt-tag" aria-hidden="true"></svg>` };
}
// The tag is the label's own box, measured where it sits: the eyelet end on the left, the string
// out of it up to a bough off the top of the button. Redrawn whenever the button changes size.
function layTag(btn) {
  const tag = btn.querySelector('.nt-tag'), label = btn.querySelector('.cta-label');
  if (!tag || !label || !label.offsetWidth) return;
  label.classList.remove('nt-tight');
  // Where the words would wrap on the tag but not without it, the tag tightens. Only where that
  // actually saves the line: the longest words wrap on a phone with or without a tag (the plain
  // button wraps them too), and then the roomier tag is the better one.
  const wraps = () => label.offsetHeight > parseFloat(getComputedStyle(label).fontSize) * 2 + 8;
  if (wraps()) { label.classList.add('nt-tight'); if (wraps()) label.classList.remove('nt-tight'); }
  const tight = label.classList.contains('nt-tight'), ex = tight ? 10 : 12;
  const w = label.offsetWidth, h = label.offsetHeight, c = tight ? 8 : 9.5, ey = h / 2;
  Object.assign(tag.style, { left: `${label.offsetLeft}px`, top: `${label.offsetTop}px`, width: `${w}px`, height: `${h}px`, transformOrigin: `${ex}px ${f(ey)}px` });
  tag.setAttribute('viewBox', `0 0 ${w} ${h}`);
  const body = `M${c} 0H${w - 1.4}Q${w} 0 ${w} 1.4V${h - 1.4}Q${w} ${h} ${w - 1.4} ${h}H${c}L0 ${h - c}V${c}Z`;
  const fibres = Array.from({ length: Math.floor(h / 3.4) }, (_, k) => `M${c + 2} ${f(2 + k * 3.4)}H${w - 3}`).join('');
  const id = `anvTg${++serial}`;
  tag.innerHTML = `<defs><linearGradient id="${id}g" x1="0" y1="0" x2=".15" y2="1"><stop offset="0" stop-color="#f4e9cd"/><stop offset="1" stop-color="#e3d2aa"/></linearGradient>` +
    `<filter id="${id}b" x="-10%" y="-30%" width="120%" height="170%"><feGaussianBlur stdDeviation="1.6"/></filter></defs>` +
    `<path d="${body}" fill="#000" opacity=".5" transform="translate(1.4 2.6)" filter="url(#${id}b)"/>` +
    `<g class="nt-card"><path d="${body}" fill="url(#${id}g)" stroke="#a88f62" stroke-width=".6"/><path d="${fibres}" stroke="#7a6034" stroke-width=".5" opacity=".05"/>` +
    `<circle cx="${ex}" cy="${f(ey)}" r="6" fill="#cdb98c"/><circle cx="${ex}" cy="${f(ey)}" r="3.4" fill="#6d5a3a"/></g>` +
    // Baker's twine, red and white, through the eyelet and up out of the top of the button.
    `<path d="M${ex} ${f(ey)}C${ex - 3} ${f(ey - 7)} ${ex - 6} ${f(-6)} -7 ${f(-30)}" fill="none" stroke="#f3ece0" stroke-width="1.5" stroke-linecap="round"/>` +
    `<path d="M${ex} ${f(ey)}C${ex - 3} ${f(ey - 7)} ${ex - 6} ${f(-6)} -7 ${f(-30)}" fill="none" stroke="#b8322a" stroke-width="1.5" stroke-dasharray="1.7 1.5"/>` +
    `<path d="M${ex} ${f(ey - 3.1)}q-2.2 1.1 -1.2 3.6" fill="none" stroke="#b8322a" stroke-width="1.3" stroke-linecap="round"/>`;
}

// The finish the button is forced into on Christmas Day, or "". The day comes off the Merry
// Swiftmas row in TS_MILESTONES, so the button and the margin note cannot disagree about it.
// 25 December is never a 13th and no record has come out on it, so nothing outranks it, though a
// release day would, being asked first.
const CHRISTMAS = TS_MILESTONES.find((m) => m.kind === "songday" && m.md === "12-25");
export const christmasFinishFor = (dateKey) => dateKey?.slice(5) === CHRISTMAS.md ? "anv-christmas" : "";

/* ---------- the guest shelf's days ----------
   One finish for each day GUEST_DAYS keeps: the seven guests' birthdays, Wicked's opening night
   and Hannah Montana's premiere standing in for the two that are not people, and the two names
   announced on the shelf. Each starts from the guest's souvenir sticker or a record, and each
   guest keeps to its own class prefix in styles.css. Designed on scripts/cta/guest-days-board.html,
   with the rejected candidates beside them. */
// A four-point glint, for anything that catches the light.
const GLINT = 'M0 -1.9C.15 -.5 .5 -.15 1.9 0C.5 .15 .15 .5 0 1.9C-.15 .5 -.5 .15 -1.9 0C-.5 -.15 -.15 -.5 0 -1.9Z';

// Two notes in their own units, the head at the origin: a quaver, and a beamed pair.
const QUAVER = `<ellipse rx="2.1" ry="1.45" transform="rotate(-22)"/><rect x="1.4" y="-9.6" width=".75" height="9.5"/><path d="M2.15 -9.6C2.5 -7.6 5.1 -6.9 4.5 -3.7C4.3 -5.7 3.3 -6.3 2.15 -6.7Z"/>`;
const PAIR = `<ellipse rx="2.1" ry="1.45" transform="rotate(-22)"/><ellipse cx="6" cy="-1.3" rx="2.1" ry="1.45" transform="rotate(-22 6 -1.3)"/><rect x="1.4" y="-9.6" width=".75" height="9.5"/><rect x="7.4" y="-10.9" width=".75" height="9.6"/><path d="M1.4 -9.6L8.15 -10.9V-9.1L1.4 -7.8Z"/>`;

/* ---- Harry Styles: Watermelon sugar ---- */
function melon() {
  const id = `hsM${++serial}`, rand = R(201);
  // The flesh's grain: short juicy flecks, lighter and darker, all running roughly upright.
  let grain = '', grainDk = '';
  for (let k = 0; k < 420; k++) {
    const x = rand() * 600, y = 1 + rand() * 48, a = 70 + rand() * 40, s = `cx="${f(x)}" cy="${f(y)}" rx="${f(.5 + rand() * 1)}" ry="${f(.28 + rand() * .3)}" transform="rotate(${f(a)} ${f(x)} ${f(y)})" opacity="${f(.05 + rand() * .13)}"`;
    if (rand() < .72) grain += `<ellipse ${s}/>`; else grainDk += `<ellipse ${s}/>`;
  }
  // The rind: the white, then a pale green, then the dark skin with its stripes, each edge wavering.
  const edge = (y0, amp, k) => { let d = `M-6 62L-6 ${f(y0)}`; for (let x = -6; x <= 606; x += 6) d += `L${x} ${f(y0 + amp * Math.sin(x / 23 + k) + amp * .6 * Math.sin(x / 9.3 + k * 2))}`; return d + 'L606 62Z'; };
  let stripes = '';
  for (let x = -4; x < 606; x += 6 + rand() * 7) { const w = 1.4 + rand() * 2.6, j = (rand() - .5) * 1.6; stripes += `M${f(x)} 62L${f(x + j)} ${f(56.4 + rand())}C${f(x + w * .3)} ${f(55.6)} ${f(x + w * .7)} ${f(55.8)} ${f(x + w + j)} ${f(56.6 + rand())}L${f(x + w)} 62Z`; }
  const rind = `<path class="hs-r0" d="${edge(50.2, .5, 1)}"/><path class="hs-r1" d="${edge(53.2, .45, 2)}"/><path class="hs-r2" d="${edge(55.4, .4, 3)}"/><path class="hs-r3" d="${stripes}"/>`;
  // The seeds lie in a ring: a row across either side of the words and a sparser one above it.
  // Under the words there are only a few of the pale, soft ones that never ripened.
  const SEED = 'M0 -3.4C1.4 -1.6 2 .3 1.75 1.5C1.45 2.8 -1.45 2.8 -1.75 1.5C-2 .3 -1.4 -1.6 0 -3.4Z';
  const spots = [];
  for (let x = 9; x < 594; x += 13 + rand() * 9) { if (x > 190 && x < 410) continue; spots.push([x, 32 + Math.sin(x / 41) * 4.5 + (rand() - .5) * 5]); }
  for (let x = 22; x < 590; x += 28 + rand() * 16) { if (x > 178 && x < 422) continue; spots.push([x, 13 + rand() * 7]); }
  let pits = '', seeds = '', notes = '', pale = '';
  spots.forEach(([x, y]) => {
    // The ones nearest the words go first, and the song spreads out to the ends.
    const rot = (rand() - .5) * 56, s = .9 + rand() * .32, d = (Math.abs(x - 300) - 100) / 200 * .55 + rand() * .06;
    pits += `<path transform="translate(${f(x)} ${f(y + .3)}) rotate(${f(rot)}) scale(${f(s * 1.12)})" d="${SEED}"/>`;
    seeds += `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)}) scale(${f(s)})"><g class="hs-seed" style="--d:${f(d)}s"><path d="${SEED}" fill="url(#${id}s)"/><ellipse class="hs-seed-hi" cx="-.6" cy="-.2" rx=".42" ry="1.15"/></g></g>`;
    const ty = 9 + rand() * 9 - y, tx = (rand() - .5) * 12;
    notes += `<g transform="translate(${f(x)} ${f(y + 3)})"><g class="hs-note" style="--d:${f(d)}s;--nx:${f(tx)}px;--ny:${f(ty)}px;--nr:${f((rand() - .5) * 26)}deg"><g class="hs-bob" style="--b:${f(-rand() * 2.6)}s"><g transform="scale(${f(.82 + rand() * .22)})">${rand() < .3 ? PAIR : QUAVER}</g></g></g></g>`;
  });
  for (let k = 0; k < 16; k++) { const x = 206 + rand() * 188, y = 25 + rand() * 13; pale += `<path transform="translate(${f(x)} ${f(y)}) rotate(${f((rand() - .5) * 50)}) scale(${f(.5 + rand() * .2)})" d="${SEED}"/>`; }
  const defs = `<linearGradient id="${id}f" x1="0" x2="0" y1="0" y2="1"><stop offset="0" class="hs-f0"/><stop offset=".5" class="hs-f1"/><stop offset=".78" class="hs-f2"/><stop offset=".86" class="hs-f3"/></linearGradient>` +
    `<radialGradient id="${id}s" cx=".38" cy=".32" r=".85"><stop offset="0" stop-color="#55301e"/><stop offset=".55" stop-color="#221009"/><stop offset="1" stop-color="#0b0402"/></radialGradient>`;
  return { fx: strip('hs-melon', `<defs>${defs}</defs><rect x="-6" y="-6" width="612" height="72" fill="url(#${id}f)"/><g class="hs-grain">${grain}</g><g class="hs-grain-dk">${grainDk}</g>` +
    `<g class="hs-pale">${pale}</g><g class="hs-pits">${pits}</g>${rind}${seeds}${notes}`) + `<i class="hs-sheen"></i>` };
}

// The butterfly from her sticker, about eighteen across, the body at the origin.
const WING_HI = 'M-.6 -.4C-2.6 -5.2 -7.6 -8.1 -9 -5.2C-10 -2.6 -6.2 -.8 -.6 -.4ZM-.6 .4C-3.8 .6 -7.2 2.8 -6.3 5.5C-5.5 7.4 -2.1 5.9 -.6 1.8Z';
const WING_LO = 'M-1.6 -1.3C-3.2 -4.4 -6.5 -6.2 -7.4 -4.6C-8 -3.1 -5.6 -1.8 -1.6 -1.3ZM-1.6 1.2C-3.9 1.6 -5.8 3.2 -5.2 4.6C-4.6 5.6 -2.6 4.4 -1.6 2.2Z';
const butterfly = (flap = true) => {
  const wing = (sx) => `<g transform="scale(${sx} 1)"><g class="${flap ? 'or-flap' : ''}"><path class="or-wing" d="${WING_HI}"/><path class="or-wing2" d="${WING_LO}"/></g></g>`;
  return wing(1) + wing(-1) + `<path class="or-body" stroke-width="1.1" d="M0 -3.4V4.2"/><path class="or-body" stroke-width=".35" d="M-.2 -3.4C-.8 -5.4 -1.6 -6.4 -2.6 -6.8M.2 -3.4C.8 -5.4 1.6 -6.4 2.6 -6.8"/>`;
};

/* ---- Olivia Rodrigo: Licence ---- */
function licence() {
  const id = `orL${++serial}`, rand = R(220);
  // Guilloche: long interlaced waves across the whole card, each with its own swell.
  let gu1 = '', gu2 = '';
  for (let k = 0; k < 9; k++) {
    const A = 5 + k * 2.4, L = 16 + k * 2.7, ph = rand() * 6, cy = 30 + (rand() - .5) * 5;
    let d = '';
    for (let x = -6; x <= 606; x += 2) d += `${x === -6 ? 'M' : 'L'}${x} ${f(cy + A * Math.sin(x / L + ph) * (.72 + .28 * Math.sin(x / 97 + k)))}`;
    if (k % 2) gu2 += d; else gu1 += d;
  }
  // A security rosette at the far left, and a ghost of the photo beside it.
  const rosette = (x0, y0, R0, a, n) => { let d = ''; for (let t = 0; t <= 2 * Math.PI + .01; t += .02) { const rr = R0 + a * Math.cos(n * t); d += `${t ? 'L' : 'M'}${f(x0 + rr * Math.cos(t))} ${f(y0 + rr * Math.sin(t) * .92)}`; } return d; };
  const rose = rosette(70, 30, 15, 4.2, 11) + rosette(70, 30, 10, 3, 9) + rosette(70, 30, 19, 2, 17);
  // The fields: printed bars, the licence number in red, and the signature over the bottom.
  const bars = [[422, 10.4, 20, 1], [446, 10.4, 44, 1, 1], [422, 15.6, 13, 0], [439, 15.6, 60, 1], [422, 20.8, 26, 0], [452, 20.8, 34, 1], [422, 26, 17, 0], [443, 26, 22, 1], [470, 26, 30, 1],
    [500, 31.2, 40, 1], [500, 36.4, 26, 0], [530, 36.4, 32, 1], [520, 10.4, 24, 0], [548, 15.6, 22, 0]]
    .map(([x, y, w, dark, red]) => `<rect class="${red ? 'or-red' : 'or-ink'}" x="${x}" y="${y}" width="${w}" height="${dark ? 1.7 : 1.2}" rx=".5" opacity="${dark ? .62 : .38}"/>`).join('');
  const sig = 'M447 47.6C449.4 41.2 452 39.6 451.6 44.2C451.2 48.4 449.4 49.6 450.6 46.4C452 43 454.4 44.8 455.4 46.6C456.2 48 457.8 45.2 458.8 43.6C459.4 46.4 460.6 48 462.6 45.6C464.6 43.4 466 44 466.4 46.2C466.8 48.4 468.8 47.4 470.4 45.2C471.6 43.6 472.4 39.4 471.6 38.6C470.8 39.4 471 44.6 472.6 47C474.4 49 477 46 478.6 44.2C480 46 481.6 47.6 484 45.6C486.4 43.6 492 44.4 506 43.2';
  const photo = (x, y, w, h, ghost) => `<g${ghost ? ' opacity=".26"' : ''}><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.2" fill="url(#${id}p)"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.2" fill="none" class="or-ink" style="fill:none;stroke:var(--or-ink);stroke-width:.4;opacity:.6"/>` +
    `<g transform="translate(${f(x + w / 2)} ${f(y + h * .46)}) scale(${f(w / 22)})">${butterfly(!ghost)}</g></g>`;
  const seal = `<g class="or-seal"><g class="or-seal-in"><circle cx="436" cy="41" r="7" fill="url(#${id}h)"/><circle cx="436" cy="41" r="7" fill="none" stroke="#fff" stroke-width=".4" opacity=".7"/>` +
    `<path transform="translate(436 41) scale(1.9)" d="${GLINT}" fill="#fff" opacity=".8"/></g></g>`;
  let micro = '';
  for (let x = 2; x < 600; x += 2.4) micro += `M${f(x)} 2.6h1.2M${f(x + 1.2)} 57.4h1.2`;
  const defs = `<linearGradient id="${id}p" x1="0" x2="0" y1="0" y2="1"><stop offset="0" class="or-p0"/><stop offset="1" class="or-p1"/></linearGradient>` +
    `<linearGradient id="${id}h" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff9ad8"/><stop offset=".35" stop-color="#9ff3ff"/><stop offset=".65" stop-color="#fff6a8"/><stop offset="1" stop-color="#c3a0ff"/></linearGradient>`;
  return { fx: strip('or-licence', `<defs>${defs}</defs><path class="or-gu1" d="${gu1}"/><path class="or-gu2" d="${gu2}"/><path class="or-rose" d="${rose}"/>` +
    `<rect class="or-band" x="-6" y="-6" width="612" height="10.4"/><rect class="or-band" x="-6" y="55.6" width="612" height="10"/><path d="${micro}" stroke="#fff" stroke-width=".5" opacity=".45"/>` +
    photo(112, 15, 18, 28, true) + photo(151, 10.5, 26, 38, false) + bars + `<path class="or-sig" d="${sig}"/>${seal}`) + `<i class="or-lam"></i><i class="or-holo"></i>` };
}

const STAR5 = (r, k = .42) => Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * k : r; return `${i ? 'L' : 'M'}${f(Math.cos(a) * rr)} ${f(Math.sin(a) * rr)}`; }).join('') + 'Z';

/* ---- Hannah Montana: The secret closet ---- */
function closet() {
  const id = `hmC${++serial}`, rand = R(324);
  // Behind the doors: the other closet. A brass rail of sequinned stage clothes, the wig on its
  // stand in the left gutter and the star on the back wall in the right one.
  const TONES = ['#e889b8', '#c9ccd8', '#9a6cc0', '#f0c443', '#6cc4d8', '#f2a3c6', '#b8bcc8'];
  let clothes = '';
  [12, 38, 64, 92, 120, 146, 210, 238, 268, 300, 332, 362, 392, 466, 494, 522, 550, 578].forEach((x, i) => {
    const w = 18 + rand() * 7, len = 38 + rand() * 12, c = TONES[(i * 3 + 1) % TONES.length], jacket = i % 5 === 2;
    const hang = `<path class="hm-hook" d="M${f(x)} 7.6q1.6 -.2 1.4 -1.6q-.2 -1.3 -1.6 -1M${f(x - w * .34)} 12.2L${f(x)} 8.6L${f(x + w * .34)} 12.2"/>`;
    const body = jacket
      ? `M${f(x - w * .36)} 12L${f(x + w * .36)} 12L${f(x + w * .5)} 22L${f(x + w * .44)} ${f(len * .78)}L${f(x - w * .44)} ${f(len * .78)}L${f(x - w * .5)} 22Z`
      : `M${f(x - w * .3)} 12L${f(x + w * .3)} 12L${f(x + w * .2)} 25C${f(x + w * .28)} 31 ${f(x + w * .5)} ${f(len - 6)} ${f(x + w * .52)} ${f(len)}Q${f(x)} ${f(len + 2)} ${f(x - w * .52)} ${f(len)}C${f(x - w * .5)} ${f(len - 6)} ${f(x - w * .28)} 31 ${f(x - w * .2)} 25Z`;
    clothes += `${hang}<path d="${body}" fill="${c}" opacity="${x > 190 && x < 410 ? .55 : .95}"/><path d="${body}" fill="url(#${id}q)" opacity=".75"/>` +
      `<path d="M${f(x - w * .12)} 13V${f(len - 2)}" stroke="#0003" stroke-width="1.6"/>`;
  });
  // The wig on a stand, as on the sticker.
  const wig = `<g transform="translate(166 0)"><rect x="-.8" y="40" width="1.6" height="16" fill="#9a8f84"/><ellipse cx="0" cy="57" rx="6" ry="1.6" fill="#7a6f66"/>` +
    `<ellipse cx="0" cy="30" rx="5.6" ry="7.4" fill="#ece5da"/>` +
    `<path d="M-7.6 47C-8.2 38 -8.4 28 -7 22.6C-5.6 17.6 5.6 17.6 7 22.6C8.4 28 8.2 38 7.6 47L4.4 47L4.6 27.8H-4.6L-4.4 47Z" fill="#e7c473"/>` +
    `<path d="M-6.2 27.6H6.2" stroke="#c99a45" stroke-width=".6"/><path d="M-6 24C-3 20.6 3 20.6 6 24M-6.4 32V45M6.4 32V45M-5.4 33V45M5.4 33V45" stroke="#fff1c0" stroke-width=".45" fill="none" opacity=".8"/></g>`;
  const star = `<g transform="translate(434 29)"><g class="hm-starp"><path class="hm-star2" transform="translate(.8 .9)" d="${STAR5(10.5)}"/><path class="hm-star" d="${STAR5(10.5)}"/>` +
    `<path d="${STAR5(5)}" fill="#fff6c4" opacity=".55"/></g></g>`;
  let tw = '';
  for (let k = 0; k < 22; k++) { let x = 6 + rand() * 588; if (x > 200 && x < 400) x = rand() < .5 ? 150 + rand() * 50 : 400 + rand() * 50; const y = 12 + rand() * 40;
    tw += `<g transform="translate(${f(x)} ${f(y)}) scale(${f(.7 + rand() * .7)})"><path class="hm-tw" d="${GLINT}" fill="${rand() < .5 ? '#fff' : '#fff2b8'}" style="--d:${f(rand() * 1.4)}s;--t:${f(1 + rand() * .8)}s"/></g>`; }
  const room = `<rect x="-6" y="-6" width="612" height="72" fill="url(#${id}r)"/><ellipse class="hm-glow" cx="300" cy="30" rx="300" ry="50" fill="url(#${id}g)"/>` +
    `<path class="hm-rail" d="M-6 7.4H606"/><path d="M-6 6.9H606" stroke="#fff4c4" stroke-width=".35" opacity=".7"/>${clothes}${wig}${star}${tw}`;
  // The doors: two bifold pairs, louvred, meeting under the words, with a brass knob each side of
  // the meeting stiles, low, below the lettering.
  const leaf = (x0, x1) => {
    let slats = '', hi = '';
    for (let y = 7.2; y < 53; y += 2.5) { slats += `M${f(x0 + 6)} ${f(y)}H${f(x1 - 6)}`; hi += `M${f(x0 + 6)} ${f(y + .7)}H${f(x1 - 6)}`; }
    return `<rect class="hm-door" x="${f(x0)}" y="-6" width="${f(x1 - x0)}" height="72"/><rect class="hm-door2" x="${f(x0 + 5)}" y="5.4" width="${f(x1 - x0 - 10)}" height="49.2"/>` +
      `<path class="hm-slat" d="${slats}"/><path class="hm-slat-hi" d="${hi}"/><rect class="hm-frame" x="${f(x0 + 5)}" y="5.4" width="${f(x1 - x0 - 10)}" height="49.2"/>` +
      `<path d="M${f(x1 - .3)} -6V66" stroke="#0000002a" stroke-width=".6"/>`;
  };
  const doorL = `<g class="hm-door-l">${leaf(-6, 147)}${leaf(147, 300)}<rect class="hm-shut" x="-6" y="-6" width="306" height="72"/><circle class="hm-knob" cx="292" cy="47.6" r="1.6"/><circle cx="291.6" cy="47.1" r=".55" fill="#fff6d0"/></g>`;
  const doorR = `<g class="hm-door-r">${leaf(300, 453)}${leaf(453, 606)}<rect class="hm-shut" x="300" y="-6" width="306" height="72"/><circle class="hm-knob" cx="308" cy="47.6" r="1.6"/><circle cx="307.6" cy="47.1" r=".55" fill="#fff6d0"/></g>`;
  const defs = `<linearGradient id="${id}r" x1="0" x2="0" y1="0" y2="1"><stop offset="0" class="hm-r0"/><stop offset="1" class="hm-r1"/></linearGradient>` +
    `<radialGradient id="${id}g"><stop offset="0" stop-color="#ff9ad0" stop-opacity=".45"/><stop offset="1" stop-color="#ff9ad0" stop-opacity="0"/></radialGradient>` +
    `<pattern id="${id}q" width="2.4" height="2.2" patternUnits="userSpaceOnUse"><circle cx=".6" cy=".6" r=".55" fill="#fff" opacity=".45"/><circle cx="1.8" cy="1.7" r=".55" fill="#000" opacity=".12"/></pattern>`;
  return { fx: strip('hm-closet', `<defs>${defs}</defs>${room}${doorL}${doorR}<path d="M300 -6V66" stroke="#0004" stroke-width=".5"/>`) };
}

/* ---- Ariana Grande: petal ---- */
function petal() {
  const id = `agF${++serial}`, rand = R(817);
  const PETAL = 'M0 4.4C-1.1 3.6 -2.8 .8 -2.8 -1.5C-2.8 -3.4 -1.6 -4.5 -.5 -4.1L0 -3.2L.5 -4.1C1.6 -4.5 2.8 -3.4 2.8 -1.5C2.8 .8 1.1 3.6 0 4.4Z';
  const RAY = 'M0 -4.2C2.3 -3.4 2.9 .8 1.5 3.4C.9 4.3 -.9 4.3 -1.5 3.4C-2.9 .8 -2.3 -3.4 0 -4.2Z';
  // One petal, wrapped so the breeze can carry it: a move, a turn and a flutter, each on its own
  // element so none of them fights the drawing's own transform.
  const one = (x, y, s, r, tone, cls, d, dx, dy, rr) => `<g transform="translate(${f(x)} ${f(y)})"><g class="${cls}" style="--dx:${f(dx)}px;--dy:${f(dy)}px;--rr:${f(rr)}deg;--d:${f(d)}s">` +
    `<g transform="rotate(${f(r)}) scale(${f(s)})"><g class="ag-flut" style="--d:${f(d)}s"><path d="${PETAL}" fill="url(#${id}p${tone})"/><path d="M0 -3.3V3" stroke="#000" stroke-width=".2" opacity=".22"/></g></g></g></g>`;
  let ps = '';
  for (let k = 0; k < 36; k++) {
    let x = rand() * 600, y = 4 + rand() * 52;
    if (x > 192 && x < 408 && y > 13 && y < 47) y = rand() < .5 ? 3 + rand() * 9 : 49 + rand() * 9;
    ps += one(x, y, .8 + rand() * .7, rand() * 360, Math.floor(rand() * 3), 'ag-pf', x / 600 * .7 + rand() * .2, 40 + rand() * 120, (rand() - .5) * 26, (rand() < .5 ? -1 : 1) * (180 + rand() * 360));
  }
  // More come in on the breeze from off the left.
  for (let k = 0; k < 12; k++) ps += one(-10 - rand() * 60, 5 + rand() * 50, .8 + rand() * .6, rand() * 360, Math.floor(rand() * 3), 'ag-in', rand() * .4, 120 + rand() * 230, (rand() - .5) * 20, 300 + rand() * 300);
  // Daisies: one in the right gutter, small ones at the far ends. A few of the gutter one's
  // petals go with the breeze.
  const daisy = (cx, cy, R0, n, loose) => {
    let g = '';
    for (let i = 0; i < n; i++) {
      const a = i / n * 360 + rand() * 6, flies = loose && i % 3 === 1;
      const pet = `<g transform="rotate(${f(a)}) translate(0 ${f(-R0 * .62)}) scale(${f(R0 / 7)} ${f(R0 / 5.4)})"><path d="${RAY}" fill="url(#${id}p${i % 3})"/></g>`;
      g += flies ? `<g class="ag-pf" style="--dx:${f(30 + rand() * 60)}px;--dy:${f(-8 - rand() * 14)}px;--rr:${f(200 + rand() * 200)}deg;--d:${f(.5 + rand() * .3)}s">${pet}</g>` : pet;
    }
    return `<g transform="translate(${cx} ${cy})">${g}<circle r="${f(R0 * .3)}" fill="#6a6a6c"/><circle r="${f(R0 * .3)}" fill="url(#${id}d)"/></g>`;
  };
  const defs = ['#fbfbfa|#cfd2d6', '#e9ebee|#a9aeb4', '#ffffff|#dcdee1'].map((p, k) => { const [a, b] = p.split('|');
      return `<linearGradient id="${id}p${k}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`; }).join('') +
    `<radialGradient id="${id}d"><stop offset="0" stop-color="#8b8b8d"/><stop offset="1" stop-color="#3c3c3e"/></radialGradient>` +
    `<radialGradient id="${id}v" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>` +
    `<radialGradient id="${id}k" cx=".08" cy="0" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>` +
    `<filter id="${id}g" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="1" seed="3"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 -2.2 0 1.25"/></filter>`;
  return { fx: strip('ag-film', `<defs>${defs}</defs><rect x="-6" y="-6" width="612" height="72" fill="url(#${id}k)"/>${daisy(434, 45, 9, 13, true)}${daisy(28, 12, 6, 11, false)}${daisy(574, 50, 7, 12, false)}${daisy(162, 54, 4.6, 10, false)}${ps}` +
    `<rect x="-6" y="-6" width="612" height="72" fill="url(#${id}v)"/><path class="ag-scr" d="M233 -6V66" stroke="#fff" stroke-width=".35" style="--d:.2s"/><path class="ag-scr" d="M371 -6L372 66" stroke="#fff" stroke-width=".25" style="--d:.55s"/>` +
    `<g class="ag-grain"><rect x="-6" y="-6" width="620" height="76" filter="url(#${id}g)"/></g>`) + `<i class="ag-flick"></i>` };
}

// A bee from above, facing up the page: wings over the thorax, a striped abdomen. The queen is
// longer, and wears the sticker's crown.
const bee = (queen) => {
  const wing = (s) => `<g transform="rotate(${s * 28} ${s * 2.3} -1.2)"><ellipse class="by-wing" cx="${s * 2.3}" cy="-1.2" rx="2.7" ry="1.3"/></g>`;
  return `<ellipse cx="0" cy="${queen ? 2.7 : 2}" rx="2.1" ry="${queen ? 3.9 : 3}" fill="#f2c230"/>` +
    `<path d="M-2 1.2Q0 1.9 2 1.2L2.1 2.2Q0 2.9 -2.1 2.2ZM-1.9 3.4Q0 4.1 1.9 3.4L1.6 4.4Q0 5 -1.6 4.4Z${queen ? 'M-1.4 5.4Q0 6 1.4 5.4L1 6.2Q0 6.6 -1 6.2Z' : ''}" fill="#1b1209"/>` +
    `<circle cy="-.9" r="1.6" fill="#3a2a12"/>${wing(-1)}${wing(1)}<circle cy="-2.85" r="1.05" fill="#1b1209"/>` +
    `<path d="M-.4 -3.6Q-1 -4.8 -1.9 -5.2M.4 -3.6Q1 -4.8 1.9 -5.2" fill="none" stroke="#1b1209" stroke-width=".3"/>` +
    (queen ? `<path d="M-1.5 -3.4L-1.8 -5.8L-.8 -4.6L0 -6.3L.8 -4.6L1.8 -5.8L1.5 -3.4Z" fill="#f4c542" stroke="#9a6a10" stroke-width=".22"/><circle cy="-6.4" r=".35" fill="#fff6c4"/>` : '');
};

/* ---- Beyoncé: The hive ---- */
function hive() {
  const id = `byH${++serial}`, rand = R(904), r = 5.2, w = Math.sqrt(3) * r;
  const hex = (cx, cy, rr) => Array.from({ length: 6 }, (_, k) => { const a = (60 * k - 90) * DEG; return `${k ? 'L' : 'M'}${f(cx + rr * Math.cos(a))} ${f(cy + rr * Math.sin(a))}`; }).join('') + 'Z';
  // The comb: honey in most cells, a few capped with wax, a few empty and dark. Under the words it
  // is all deep honey, so the lettering sits on one tone.
  let cells = '', walls = '', gloss = '';
  for (let row = 0; row < 10; row++) for (let col = -1; col < 72; col++) {
    const cx = col * w + (row % 2 ? w / 2 : 0), cy = -1.5 + row * 7.8, core = cx > 186 && cx < 414 && cy > 10 && cy < 50, roll = rand();
    walls += hex(cx, cy, r);
    const kind = core ? (roll < .9 ? 'h' : 'd') : roll < .56 ? 'h' : roll < .84 ? 'c' : 'e';
    cells += `<use href="#${id}cell" x="${f(cx)}" y="${f(cy)}" fill="url(#${id}${kind})"/>`;
    if (kind === 'h' && !core && rand() < .75) gloss += `M${f(cx - 2.4)} ${f(cy - .6)}q.6 -2 2.6 -2.4`;
  }
  // Honey letting go of the top edge on hover.
  const DRIP = 'M-1.7 0H1.7V4.6C1.7 6.8 2.5 8.2 2.5 9.6C2.5 11.2 1.3 12.3 0 12.3C-1.3 12.3 -2.5 11.2 -2.5 9.6C-2.5 8.2 -1.7 6.8 -1.7 4.6Z';
  const drips = [[60, .2, 1.1], [157, 0, .9], [189, .5, .7], [411, .3, .8], [452, .1, 1], [534, .6, 1.2]]
    .map(([x, d, s]) => `<g transform="translate(${x} -1) scale(${s})"><g class="by-drip" style="--d:${d}s"><path d="${DRIP}" fill="url(#${id}dr)"/><path d="M-.7 1V7.4" stroke="#fff6cc" stroke-width=".5" opacity=".7"/></g></g>`).join('');
  // The bees at work, and where each flies to on hover: a V across the top with the queen at its
  // point, outer bees to the outer places so no two paths cross the words.
  const rest = [[16, 50, 100], [40, 30, 40], [88, 12, -70], [122, 46, 150], [168, 20, 30], [418, 46, 120], [500, 40, -140], [540, 14, 60], [574, 34, -30], [588, 52, 160]];
  const slots = [[150, 17.6], [180, 15.2], [210, 12.8], [240, 10.4], [270, 8], [330, 8], [360, 10.4], [390, 12.8], [420, 15.2], [450, 17.6]];
  const order = [0, 1, 2, 3, 4, 9, 8, 7, 6, 5];
  let bees = '';
  rest.forEach(([x, y, r0], i) => { const [sx, sy] = slots[order[i]];
    bees += `<g class="by-fly" style="--fx:${f(sx - x)}px;--fy:${f(sy - y)}px;--d:${f(.05 + rand() * .45)}s"><g transform="translate(${x} ${y}) scale(1.45)"><g class="by-turn" style="--r0:${r0}deg;--d:${f(.05 + rand() * .3)}s"><g class="by-bob" style="--b:${f(-rand())}s">${bee(false)}</g></g></g></g>`; });
  bees += `<g class="by-fly" style="--fx:-146px;--fy:-9.6px;--d:.55s"><g transform="translate(446 15.2) scale(1.65)"><g class="by-turn" style="--r0:-20deg;--d:.5s"><g class="by-bob" style="--b:-.3s">${bee(true)}</g></g></g></g>`;
  const defs = `<path id="${id}cell" d="${hex(0, 0, r - .6)}"/>` +
    `<radialGradient id="${id}h" cx=".42" cy=".38" r=".7"><stop offset="0" stop-color="#ffd463"/><stop offset=".55" stop-color="#eaa12a"/><stop offset="1" stop-color="#b8670c"/></radialGradient>` +
    `<radialGradient id="${id}d" cx=".42" cy=".38" r=".7"><stop offset="0" stop-color="#d98e1e"/><stop offset="1" stop-color="#9a530a"/></radialGradient>` +
    `<radialGradient id="${id}c" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#fbeab0"/><stop offset=".7" stop-color="#ecc96f"/><stop offset="1" stop-color="#cf9f45"/></radialGradient>` +
    `<radialGradient id="${id}e" cx=".5" cy=".5" r=".7"><stop offset="0" stop-color="#5a3206"/><stop offset="1" stop-color="#8a5414"/></radialGradient>` +
    `<linearGradient id="${id}dr" x1="0" x2="1"><stop offset="0" stop-color="#c97a10"/><stop offset=".4" stop-color="#ffcf55"/><stop offset="1" stop-color="#b8670c"/></linearGradient>` +
    `<radialGradient id="${id}v" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#3a1c00" stop-opacity=".38"/><stop offset="1" stop-color="#3a1c00" stop-opacity="0"/></radialGradient>`;
  return { fx: strip('by-comb', `<defs>${defs}</defs><rect x="-6" y="-6" width="612" height="72" fill="#7a440a"/>${cells}<path class="by-walls" d="${walls}"/><path class="by-walls2" d="${walls}" transform="translate(.5 .6)"/>` +
    `<path class="by-gloss" d="${gloss}"/><ellipse cx="300" cy="30" rx="150" ry="34" fill="url(#${id}v)"/>${drips}${bees}`) };
}

// Elphaba on her broom, in silhouette, facing right, about eighteen across.
const WITCH = `<path class="wk-witch-s" stroke-width="1" d="M-11.4 3.4L10.4 -1.3"/>` +
  `<path class="wk-witch" d="M-10.6 2.7L-16.8 .4L-17.6 3.6L-17 6.8ZM-3.8 1.6C-5 3.6 -6 5.6 -8.8 6.4C-5.6 6.8 -2.6 5.2 -.4 1.4Z` +
  `M-1.2 -3.6C-4.8 -4.4 -9.4 -2.8 -13.6 -4.6C-11 -1.6 -6.8 .6 -1.2 1ZM-1.9 1.2L-.3 -4.6L1.7 -4.4L1.5 1.4Z"/>` +
  `<circle class="wk-witch" cx=".7" cy="-5.7" r="1.2"/><path class="wk-witch-s" stroke-width=".9" d="M1 -2.6L4.6 -.3M-3 -6.1Q.9 -5.2 4.4 -6.7"/>` +
  `<path class="wk-witch" d="M-1.4 -6.4L2 -6.7Q.4 -9 -.4 -11.2Q-1.4 -12.6 -3 -12.4Q-1.6 -11 -1.4 -6.4Z"/>`;

/* ---- Wicked: Defying gravity ---- */
function gravity() {
  const id = `wkG${++serial}`, rand = R(1030);
  let stars = '';
  for (let k = 0; k < 50; k++) { const x = rand() * 600, y = 1 + rand() * 30; if (x > 196 && x < 404 && y > 8) continue; stars += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(.2 + rand() * .45)}" fill="#e9f7df" opacity="${f(.25 + rand() * .55)}"/>`; }
  // The Emerald City: green glass spires, each lit down its left face, with a few windows lit.
  const spire = (x, w, h, base = 61) => { const top = base - h, tip = top - w * 1.7;
    return [`M${f(x - w / 2)} ${base}L${f(x - w * .4)} ${f(top)}L${f(x)} ${f(tip)}L${f(x + w * .4)} ${f(top)}L${f(x + w / 2)} ${base}Z`,
      `M${f(x - w / 2)} ${base}L${f(x - w * .4)} ${f(top)}L${f(x)} ${f(tip)}L${f(x - w * .05)} ${base}Z`]; };
  let far = '', body = '', facet = '', lit = '';
  for (let x = -4; x < 608; x += 6 + rand() * 6) { const c = Math.abs(x - 300); if (c < 100 && rand() < .7) continue; far += spire(x, 3 + rand() * 4, 8 + 26 * smooth(90, 280, c) + rand() * 8, 62)[0]; }
  [[14, 6, 28], [36, 10, 40], [60, 6, 26], [86, 8, 34], [104, 5, 24], [122, 7, 30], [138, 5, 22], [154, 9, 38], [170, 6, 27], [184, 4.5, 17],
    [416, 4.5, 17], [430, 7, 29], [462, 10, 41], [482, 6, 27], [502, 8, 34], [522, 5, 22], [546, 9, 38], [570, 6, 26], [590, 8, 32]].forEach(([x, w, h]) => {
    const [b, fc] = spire(x, w, h); body += b; facet += fc;
    for (let y = 61 - h + 4; y < 58; y += 3.4 + rand() * 3) if (rand() < .55) lit += `<rect x="${f(x - w * .25 + rand() * w * .4)}" y="${f(y)}" width=".9" height="1.3"/>`;
  });
  // Under the words only the low walls and domes of the city, glowing.
  let low = 'M186 62V56';
  for (let x = 186; x <= 414; x += 12) low += `L${x} 56Q${x + 6} ${f(51.5 - rand() * 2)} ${x + 12} 56`;
  low += 'L414 62Z';
  const moon = `<circle cx="444" cy="13" r="15" fill="url(#${id}m)"/><circle class="wk-moon" cx="444" cy="13" r="7.8"/><circle cx="441.6" cy="11.4" r="1.4" fill="#cfdcbc" opacity=".55"/><circle cx="446.8" cy="15.6" r="1" fill="#cfdcbc" opacity=".45"/>`;
  // Glinda's bubble, low in the left gutter, rising on hover.
  const bubble = `<g transform="translate(170 46)"><g class="wk-bub"><circle r="6.4" fill="url(#${id}b)"/><circle r="6.4" fill="none" stroke="#ffe6f3" stroke-width=".45" opacity=".8"/>` +
    `<path d="M-4.2 -2.6A5 5 0 0 1 -.6 -5.2" stroke="#fff" stroke-width=".9" fill="none" stroke-linecap="round" opacity=".9"/><path d="M3.6 3.8A5.6 5.6 0 0 1 .8 5.6" stroke="#b8f0ff" stroke-width=".6" fill="none" opacity=".7"/>` +
    `<path transform="translate(1.2 1) scale(.7)" d="${GLINT}" fill="#fff"/></g></g>`;
  // The witch, waiting low in the right gutter; on hover she goes up across the moon. A trail of
  // green sparks marks the way she went.
  const trail = [[412, 37, .15], [417, 33, .3], [423, 28, .45], [429, 23, .6], [435, 19, .75], [440, 16, .9]]
    .map(([x, y, d]) => `<g transform="translate(${x} ${y})"><path class="wk-trail" d="${GLINT}" fill="#9dffbf" style="--d:${d}s"/></g>`).join('');
  const witch = `<g transform="translate(414 40) scale(.92)"><g class="wk-fly">${WITCH}</g></g>`;
  const defs = `<linearGradient id="${id}s" x1="0" x2="0" y1="0" y2="1"><stop offset="0" class="wk-s0"/><stop offset="1" class="wk-s1"/></linearGradient>` +
    `<radialGradient id="${id}m"><stop offset="0" stop-color="#f4ffe6" stop-opacity=".5"/><stop offset="1" stop-color="#f4ffe6" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="${id}g" cx=".5" cy="1" r=".7"><stop offset="0" stop-color="#7dffb0" stop-opacity=".45"/><stop offset="1" stop-color="#7dffb0" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="${id}b" cx=".38" cy=".34" r=".7"><stop offset="0" stop-color="#ffd6ec" stop-opacity=".35"/><stop offset=".65" stop-color="#f07ab4" stop-opacity=".6"/><stop offset="1" stop-color="#ffb3da" stop-opacity=".95"/></radialGradient>`;
  return { fx: strip('wk-oz', `<defs>${defs}</defs>${stars}${moon}<rect class="wk-glow" x="-6" y="10" width="612" height="56" fill="url(#${id}g)"/><path class="wk-far" d="${far}" opacity=".7"/>` +
    `<path d="${body}" fill="url(#${id}s)"/><path d="${facet}" fill="#b6ffd2" opacity=".22"/><path class="wk-far" d="${low}"/><g class="wk-lit">${lit}</g>${bubble}${trail}${witch}`) };
}

/* ---- Miley: Wrecking ball ---- */
function wrecking() {
  const id = `mcW${++serial}`, rand = R(1123), bx = 434, by = 30, br = 11.4;
  // Board-formed concrete: the panel joints, the tie holes, the grain of the boards it was cast in.
  let boards = '';
  for (let y = 3; y < 60; y += 4.6 + rand() * 1.6) boards += `M-6 ${f(y)}H606`;
  let holes = '';
  [30, 96, 156, 444, 504, 570].forEach((x) => [12, 48].forEach((y) => { holes += `<circle cx="${x}" cy="${y}" r="1.7" fill="#fff" opacity=".35"/><circle class="mc-hole" cx="${x}" cy="${y}" r="1.15"/><circle cx="${f(x + .3)}" cy="${f(y + .3)}" r=".6" fill="#000" opacity=".35"/>`; }));
  const seams = `<path class="mc-seam" d="M126 -6V66M474 -6V66"/><path d="M127 -6V66M475 -6V66" stroke="#fff" stroke-width=".5" opacity=".4"/>`;
  // The cracks, out from behind the ball, each jagged and its own length, drawn on at the moment
  // it hits; the ring where the face has spalled off; the chunks and the dust.
  let cracks = '';
  for (let k = 0; k < 11; k++) {
    let a = k / 11 * Math.PI * 2 + rand() * .4, x = bx + Math.cos(a) * 6, y = by + Math.sin(a) * 6, d = `M${f(x)} ${f(y)}`;
    const len = 12 + rand() * 34;
    for (let s = 0; s < len; s += 3 + rand() * 3) { a += (rand() - .5) * .7; x += Math.cos(a) * 3.4; y += Math.sin(a) * 3.4; d += `L${f(x)} ${f(y)}`;
      if (rand() < .18) d += `M${f(x)} ${f(y)}l${f(Math.cos(a + 1) * 4)} ${f(Math.sin(a + 1) * 4)}M${f(x)} ${f(y)}`; }
    cracks += `<path class="mc-crack" pathLength="1" d="${d}" style="--d:${f(rand() * .12)}s"/>`;
  }
  let bits = '', dust = '';
  for (let k = 0; k < 12; k++) { const x = bx + (rand() - .5) * 18, y = by + (rand() - .5) * 14, s = .8 + rand() * 1.6;
    bits += `<path class="mc-chunk mc-bit" d="M${f(x)} ${f(y - s)}L${f(x + s)} ${f(y - s * .2)}L${f(x + s * .5)} ${f(y + s)}L${f(x - s * .8)} ${f(y + s * .6)}Z" style="--d:${f(rand() * .1)}s;--t:${f(.55 + rand() * .3)}s;--fx:${f((rand() - .5) * 26)}px;--fy:${f(58.5 - y - s * .4)}px;--fr:${f((rand() - .5) * 400)}deg"/>`; }
  for (let k = 0; k < 7; k++) { const a = rand() * Math.PI * 2; dust += `<circle class="mc-dust" cx="${f(bx + Math.cos(a) * 9)}" cy="${f(by + Math.sin(a) * 8)}" r="${f(4 + rand() * 4)}" fill="url(#${id}d)" style="--d:${f(rand() * .15)}s"/>`; }
  // The ball, hung on its chain from somewhere above the top of the button.
  let chain = '';
  for (let y = -8, k = 0; y < by - br - 1.6; y += 3.4, k++) chain += k % 2 ? `<rect x="${bx - .55}" y="${f(y)}" width="1.1" height="4.2" rx=".5" fill="#2c2d31"/>` : `<ellipse cx="${bx}" cy="${f(y + 2.1)}" rx="1.6" ry="2.4" fill="none" stroke="#3a3b40" stroke-width="1"/>`;
  const ball = `<g class="mc-swing">${chain}<rect x="${bx - 2.6}" y="${f(by - br - 2.4)}" width="5.2" height="3.4" rx="1" fill="#2a2b2f"/>` +
    `<circle cx="${bx}" cy="${by}" r="${br}" fill="url(#${id}b)"/><ellipse cx="${bx - 3.8}" cy="${by - 4.4}" rx="3.2" ry="2" fill="#fff" opacity=".22" transform="rotate(-30 ${bx - 3.8} ${by - 4.4})"/>` +
    `<path d="M${bx + 2} ${by + 5}l3 -1M${bx - 5} ${by + 2}l1.6 2.2M${bx + 5} ${by - 3}l1 2" stroke="#9a9ca2" stroke-width=".35" opacity=".6"/>` +
    `<circle cx="${bx + 3.6}" cy="${by + 6.4}" r=".7" fill="#7a4a2a" opacity=".6"/><circle cx="${bx - 6}" cy="${by - 1}" r=".5" fill="#7a4a2a" opacity=".5"/></g>`;
  const defs = `<linearGradient id="${id}c" x1="0" x2="0" y1="0" y2="1"><stop offset="0" class="mc-c0"/><stop offset="1" class="mc-c1"/></linearGradient>` +
    `<radialGradient id="${id}b" cx=".36" cy=".32" r=".75"><stop offset="0" stop-color="#8d9096"/><stop offset=".45" stop-color="#45474c"/><stop offset="1" stop-color="#141518"/></radialGradient>` +
    `<radialGradient id="${id}sp"><stop offset="0" stop-color="#5a554d" stop-opacity=".7"/><stop offset=".6" stop-color="#8a847a" stop-opacity=".35"/><stop offset="1" stop-color="#8a847a" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="${id}d"><stop offset="0" stop-color="#e8e3da" stop-opacity=".9"/><stop offset="1" stop-color="#e8e3da" stop-opacity="0"/></radialGradient>` +
    `<filter id="${id}n" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="2" seed="21"/><feColorMatrix values="0 0 0 0 .3  0 0 0 0 .28  0 0 0 0 .25  0 0 -1.8 0 1"/></filter>` +
    `<filter id="${id}m" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".012 .04" numOctaves="3" seed="5"/><feColorMatrix values="0 0 0 0 .35  0 0 0 0 .32  0 0 0 0 .28  0 0 -2 0 1"/></filter>` +
    `<filter id="${id}s" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="2.2"/></filter>`;
  return { fx: strip('mc-wall', `<defs>${defs}</defs><rect x="-6" y="-6" width="612" height="72" fill="url(#${id}c)"/><rect x="0" y="0" width="600" height="60" filter="url(#${id}m)" opacity=".35"/>` +
    `<rect x="0" y="0" width="600" height="60" filter="url(#${id}n)" opacity=".22"/><path d="${boards}" stroke="#fff" stroke-width=".4" opacity=".22"/><path d="${boards}" stroke="#000" stroke-width=".3" opacity=".06" transform="translate(0 .5)"/>${seams}${holes}` +
    `<ellipse class="mc-spall" cx="${bx}" cy="${by}" rx="15" ry="14" fill="url(#${id}sp)"/>${cracks}` +
    `<g class="mc-shadow"><circle cx="${bx}" cy="${by}" r="${br}" fill="#1f1c18" filter="url(#${id}s)" opacity=".9"/></g>${ball}${bits}${dust}`) };
}

/* ---- Billie Eilish: Green roots ---- */
function roots() {
  const id = `beR${++serial}`, rand = R(1218);
  // Her hair, in locks: each lock a bundle of strands following one sway, so it falls like hair
  // rather than standing like grass. Every strand is dyed green at the root and black below, and
  // each lock catches the light in a band partway down.
  let side = '', mid = '', bleed = '';
  for (let X = -8; X < 610; X += 4 + rand() * 5) {
    const A = 1.2 + rand() * 3, ph = rand() * 6, drift = (rand() - .5) * 5, n = 5 + Math.floor(rand() * 5), core = X > 196 && X < 404;
    const at = (y, o) => X + o + A * Math.sin(y / 60 * Math.PI * 1.3 + ph) + drift * y / 60;
    // Some locks took the dye further down than others.
    const bled = rand() < .45 ? 16 + rand() * 16 : 0;
    for (let k = 0; k < n; k++) {
      const o = (k - n / 2) * (.55 + rand() * .2);
      let d = '', b = '';
      for (let y = -4; y <= 64; y += 4) { const pt = `${y === -4 ? 'M' : 'L'}${f(at(y, o))} ${y}`; d += pt; if (y <= bled) b += pt; }
      if (core) mid += d; else side += d;
      bleed += b;
    }
  }
  // The spider, let down from above in the right gutter on hover, its thread running off the top.
  const legs = [[-1, -1.8, -4.2, -4.4, -5.6, -1.2], [-1.1, -1.2, -5, -2.2, -6, 1.2], [-1.1, -.7, -4.6, .6, -5.4, 3.6], [-1, -.3, -3.4, 2, -3.8, 5.2]];
  const leg = legs.map(([x0, y0, cx, cy, x1, y1]) => `M${x0} ${y0}Q${cx} ${cy} ${x1} ${y1}M${-x0} ${y0}Q${-cx} ${cy} ${-x1} ${y1}`).join('');
  const spider = `<g transform="translate(438 0) scale(1.7)"><g class="be-spider"><path d="M0 -90V-2" stroke="#e8f0e8" stroke-width=".22" opacity=".8"/>` +
    `<g class="be-legs"><path d="${leg}" stroke="#b6d62b" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".35"/><path d="${leg}" stroke="#050605" stroke-width=".65" fill="none" stroke-linecap="round"/></g>` +
    `<ellipse cy="1.6" rx="2.8" ry="3.3" fill="#b6d62b" opacity=".3"/><circle cy="-1.5" r="1.9" fill="#b6d62b" opacity=".3"/>` +
    `<ellipse cy="1.6" rx="2.3" ry="2.8" fill="#070908"/><circle cy="-1.5" r="1.45" fill="#0b0d0c"/><ellipse cx="-.7" cy=".6" rx=".6" ry="1.1" fill="#fff" opacity=".22"/>` +
    `<circle cx="-.5" cy="-2.2" r=".28" fill="#b6d62b"/><circle cx=".5" cy="-2.2" r=".28" fill="#b6d62b"/></g></g>`;
  const defs = `<linearGradient id="${id}h" x1="0" x2="0" y1="0" y2="60" gradientUnits="userSpaceOnUse"><stop offset="0" class="be-g0"/><stop offset=".18" class="be-g1"/><stop offset=".33" class="be-g2"/><stop offset=".44" class="be-k0"/><stop offset="1" class="be-k1"/></linearGradient>` +
    `<linearGradient id="${id}b" x1="0" x2="0" y1="0" y2="34" gradientUnits="userSpaceOnUse"><stop offset="0" class="be-g0"/><stop offset=".5" class="be-g1"/><stop offset="1" class="be-g1" stop-opacity="0"/></linearGradient>` +
    `<linearGradient id="${id}l" x1="0" x2="0" y1="27" y2="47" gradientUnits="userSpaceOnUse"><stop offset="0" class="be-sh" stop-opacity="0"/><stop offset=".5" class="be-sh" stop-opacity=".55"/><stop offset="1" class="be-sh" stop-opacity="0"/></linearGradient>` +
    `<linearGradient id="${id}n" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#d4f53a" stop-opacity=".9"/><stop offset="1" stop-color="#d4f53a" stop-opacity="0"/></linearGradient>`;
  return { fx: strip('be-hair', `<defs>${defs}</defs><rect x="-6" y="-6" width="612" height="72" fill="url(#${id}h)"/><path d="${side}" stroke="url(#${id}h)" stroke-width=".55" fill="none" opacity=".95"/>` +
    `<path d="${side}" stroke="#000" stroke-width=".3" fill="none" opacity=".35" transform="translate(.35 0)"/><path d="${mid}" stroke="url(#${id}h)" stroke-width=".5" fill="none" opacity=".5"/>` +
    `<path d="${bleed}" stroke="url(#${id}b)" stroke-width=".6" fill="none"/><path d="${side}${mid}" stroke="url(#${id}l)" stroke-width=".6" fill="none"/><rect class="be-neon" x="-6" y="-6" width="612" height="22" fill="url(#${id}n)"/>${spider}`) };
}


/* ---------- which finish, on which day ---------- */
// Keyed by the TS_MILESTONES album name, so the release dates live in one table and a date fix
// there moves the button with the margin note.
//
// Each row is [finish, drawing, words]. The words are a lyric from that record standing in for
// "Start writing", and like the finish they are forced: on the day they replace whatever words
// the player has chosen through Mastery, and the button goes back to its default pencil, since a
// Mastery mark beside her lyric would be speaking for the wrong words. The four Taylor's Versions
// take their line from the vault tracks, so their day says something the original's does not.
// None may share a name with a charm or a CTA_LABELS entry, or the day reads as a repeat: that
// ruled out Next Chapter, Let The Games Begin, Write What You Know, Write this down and more.
const ANNIVERSARY_FINISHES = {
  "Taylor Swift": ["anv-debut", debutPorch, "I grabbed a pen"],               // Our Song
  "Fearless": ["anv-fearless", fearless, "Once upon a time"],                  // Forever & Always
  "Speak Now": ["anv-speaknow", speakCastle, "The start of an age"],          // Long Live
  "Red": ["anv-red", red, "Tonight’s the night"],                             // 22
  "1989": ["anv-1989", n1989, "Put it into words"],                          // You Are In Love
  "reputation": ["anv-rep", rep, "I’ve got a list of names"],              // Look What You Made Me Do
  "Lover": ["anv-lover", lover, "A fresh page on the desk"],                 // Cornelia Street
  "folklore": ["anv-folklore", fkStep, "This is me trying"],                 // this is me trying
  "evermore": ["anv-evermore", evermoreFlannel, "Write it down for me"],     // marjorie
  "Midnights": ["anv-midnights", midnights, "I wrote a poem"],               // Sweet Nothing
  "The Tortured Poets Department": ["anv-ttpd", ttpd, "At the starting line"], // Fresh Out The Slammer
  "The Life of a Showgirl": ["anv-showgirl", showgirl, "So let’s get into it"], // Patient Zero
};
// The four Taylor's Versions, keyed the same way off their own TS_MILESTONES rows (kind "tv").
const TV_FINISHES = {
  "Fearless": ["anv-fearless-tv", fearlessTV, "I see your writing"],         // Bye Bye Baby
  "Red": ["anv-red-tv", redTV, "I’d write this in the sky"],              // The Very First Night
  "Speak Now": ["anv-speaknow-tv", speakNowTV, "The story started"],        // Timeless
  "1989": ["anv-1989-tv", n1989TV, "More than a chapter"],                // Suburban Legends
};
const BY_KIND = { album: ANNIVERSARY_FINISHES, tv: TV_FINISHES };
// The guest shelf's days, keyed by the GUEST_DAYS guest id, so a day lives in one table and the
// button and the margin note cannot disagree about it. The rows have the records' shape, and the
// words are a line of the guest's own: from the catalogue the shelf deals, or for an announced
// name, from the record the line is famous from. A guest with no row keeps the player's own
// button on its day.
const GUEST_FINISHES = {
  "harry-styles": ["anv-guest-harry-styles", melon, "Sounds just like a song"],     // Watermelon Sugar
  "olivia-rodrigo": ["anv-guest-olivia-rodrigo", licence, "Start a new life"],       // brutal
  "hannah-montana": ["anv-guest-hannah-montana", closet, "Let’s do this"],           // Let's Do This
  "ariana-grande": ["anv-guest-ariana-grande", petal, "To write again"],             // petal
  "beyonce": ["anv-guest-beyonce", hive, "Let’s get in formation"],                  // Formation
  "wicked-soundtrack": ["anv-guest-wicked-soundtrack", gravity, "Defying gravity"],  // Defying Gravity
  "miley-cyrus": ["anv-guest-miley-cyrus", wrecking, "We can’t stop"],               // We Can't Stop
  "billie-eilish": ["anv-guest-billie-eilish", roots, "Come out and play"],          // come out and play
};
const finishOf = (m) => BY_KIND[m.kind]?.[m.album]?.[0] || "";
const ART = Object.fromEntries([...Object.values(ANNIVERSARY_FINISHES), ...Object.values(TV_FINISHES), ...Object.values(GUEST_FINISHES), ["anv-13th", thirteenMarks], ["anv-birthday", birthdayCake], ["anv-christmas", balerTree]]
  .map(([id, draw]) => [id, draw]));
const WORDS = Object.fromEntries([...Object.values(ANNIVERSARY_FINISHES), ...Object.values(TV_FINISHES), ...Object.values(GUEST_FINISHES)].map(([id, , words]) => [id, words]));

// The finish the button is forced into on `dateKey` (YYYY-MM-DD, the player's own day), or "" on
// every other day. Every studio album's release day counts, and so does every Taylor's Version's.
// A year before a record existed (only reachable with the dev date) is not its anniversary.
//
// One day belongs to two records: 1989 (Taylor's Version) came out on 1989's ninth birthday. The
// later release has the day from its own release on, and that is deliberate rather than a tie
// broken by list order: its finish, Across the water, is drawn to carry both, the beach in front
// and the original's skyline over the bay, going through the original's own dusk on hover. So the
// original's Skyline shows on 27 October only in the years before 2023.
export function anniversaryFinishFor(dateKey) {
  if (!dateKey || dateKey.length < 10) return "";
  const md = dateKey.slice(5), year = +dateKey.slice(0, 4);
  const release = TS_MILESTONES.filter((m) => m.md === md && year >= m.year && finishOf(m)).sort((a, b) => b.year - a.year)[0];
  return release ? finishOf(release) : "";
}

// The finish the button is forced into on a guest's day, or "". The day comes off the guest's row
// in GUEST_DAYS, the row the margin note reads, and a year before the day existed (Wicked before
// 2003, only reachable with the dev date) is not its day. paintStartButton asks it after a release
// day, her birthday and Christmas and before the 13th, the order dayNote resolves the margin in;
// none of the nine shares a day with any of those yet.
export function guestDayFinishFor(dateKey) {
  if (!dateKey || dateKey.length < 10) return "";
  const md = dateKey.slice(5), year = +dateKey.slice(0, 4);
  const day = GUEST_DAYS.find((g) => g.md === md && year >= g.year);
  return day ? GUEST_FINISHES[day.guest]?.[0] || "" : "";
}

// Every record with a finish, with its release day, for the dev tools.
export const anniversaryFinishList = () => TS_MILESTONES.filter(finishOf)
  .map((m) => ({ album: m.album, title: m.title, finish: finishOf(m), md: m.md, year: m.year }));

// The drawing for an anniversary finish: { fx, out?, label? }, or null for any other finish. `fx`
// goes in the clipped art layer, `out` in a layer allowed past the button's edge (Red's fringe,
// Lover's butterflies), and label "typed" asks for the words one letter to a span. `dateKey` is
// the day the button is being worn on, which only the birthday reads: its candles are her age.
export function anniversaryArt(finish, dateKey = "") {
  const draw = ART[finish];
  return draw ? draw(dateKey) : null;
}

// The lyric a record's or a guest's finish puts on the button in place of the player's words, or ""
// for every other finish (her birthday, Christmas and the 13th leave the words alone).
export const anniversaryWords = (finish) => WORDS[finish] || "";

// A record's lyric runs longer than "Start writing", and on a phone the button shares its row
// with the dice, so the longest ("I’d write this in the sky") want about 295px of a 235px label.
// Wrapped, they strand their last word on a second line and the button grows a third taller.
// So the words, and only the words, are set down to fit on one line: the pencil keeps its drawn
// size, since it is measured against the marks rather than the type. 0.75 is the floor: at 375px
// the sky line needs 0.78 and the list of names 0.81, both still clean in the typewriter face. A
// line that would need less wraps instead of shrinking past legibility.
const LYRIC_MIN_SCALE = 0.75;
function fitLyric(btn) {
  const label = btn.querySelector(".cta-label");
  if (!label || !anniversaryWords(btn.dataset.startbtn) || !btn.clientWidth) return;
  label.style.fontSize = "";
  label.style.whiteSpace = "nowrap";
  const cs = getComputedStyle(btn);
  const room = btn.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const mark = label.querySelector(".cta-mark");
  const markW = mark ? mark.offsetWidth + parseFloat(getComputedStyle(mark).marginRight) : 0;
  const need = label.offsetWidth;
  if (need <= room) return;
  const scale = (room - markW) / (need - markW);
  if (scale < LYRIC_MIN_SCALE) { label.style.whiteSpace = ""; return; }
  // A hair under the exact fit, so subpixel rounding in the face cannot tip it back onto two lines.
  label.style.fontSize = `${(scale * 0.99).toFixed(3)}em`;
}

// Anything that has to measure the button once it is on the page. Red's fringe keeps one spacing
// at every width, so it is hung by the button's width; the 13th's count and the birthday's
// inscription and candles are laid beside the words, and Christmas's tag round them, so they are laid by where the label sits,
// which moves with the button's size and with the face once it has loaded. Safe to call on every paint; the watcher is attached once per button.
const watched = new WeakSet();
export function layoutAnniversaryArt(btn) {
  const lay = () => {
    btn.querySelectorAll(".anv-fringe").forEach((el) => { if (el.offsetWidth) hangFringe(el); });
    if (btn.querySelector(".ch-count")) layCount(btn);
    if (btn.querySelector(".bd-half")) layCake(btn);
    if (btn.querySelector(".nt-tag")) layTag(btn);
    fitLyric(btn);
  };
  lay();
  if (watched.has(btn) || typeof ResizeObserver === "undefined") return;
  watched.add(btn);
  document.fonts?.ready.then(lay);
  let width = btn.offsetWidth, height = btn.offsetHeight;
  new ResizeObserver(() => {
    if (btn.offsetWidth === width && btn.offsetHeight === height) return;
    width = btn.offsetWidth; height = btn.offsetHeight; lay();
  }).observe(btn);
}
