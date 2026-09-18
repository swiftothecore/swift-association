"use strict";
/* ============================================================
   The lineup deck's line art. Pairs with the card-stock rules in
   styles.css (search: LINEUP CARD STOCK).

   GENERATED, not stored as symbols: the faceted marks are built
   from polygons and the frame and ornaments are computed, so they
   live here rather than in index.html the way rulemarks do.

   Everything here draws as ONE stroke weight at every scale.
   Nothing is filled except with the paper itself (.ln-o), which
   is how a shape knocks a hole in whatever is behind it.
   ============================================================ */

export const RED = { hearts: 1, diamonds: 1 };

/* Suit marks, drawn rather than typed: a font glyph would put a
   typeface's idea of a spade on a page that draws everything else
   by hand. */
export const MARK = {
  spades: `<path class="ink-fill" d="M12 3.4 C9.1 6.9 5.5 8.9 5.5 12.2 C5.5 14.4 7.2 15.8 9 15.7 C10.1 15.6 11 15.1 11.6 14.3 C11.4 16.5 10.8 18.4 9.6 19.9 C11.9 20 12.2 20 14.5 19.9 C13.2 18.4 12.6 16.5 12.4 14.3 C13 15.1 13.9 15.6 15 15.7 C16.9 15.8 18.5 14.4 18.5 12.2 C18.5 8.9 14.9 6.9 12 3.4 Z"/>`,
  hearts: `<path class="ink-fill" d="M12 20.2 C8.4 17.1 4.5 14.1 4.5 10.2 C4.5 7.5 6.6 5.7 8.9 5.8 C10.4 5.9 11.5 6.8 12 7.9 C12.6 6.7 13.7 5.9 15.2 5.8 C17.5 5.7 19.5 7.6 19.4 10.3 C19.3 14.2 15.4 17.2 12 20.2 Z"/>`,
  diamonds: `<path class="ink-fill" d="M12 3.3 C14.1 7.1 16.5 10.1 18.4 12.1 C16.4 14.1 14.1 17 12 20.7 C9.7 17 7.5 14 5.6 11.9 C7.6 9.9 9.9 7 12 3.3 Z"/>`,
  clubs: `<circle class="ink-fill" cx="12" cy="7.9" r="3.5"/><circle class="ink-fill" cx="7.4" cy="13.3" r="3.5"/><circle class="ink-fill" cx="16.6" cy="13.3" r="3.5"/><path class="ink-fill" d="M12 12.4 C12.3 15.4 11.5 17.9 10 19.9 C12.1 20 11.9 20 14 19.9 C12.5 17.9 11.7 15.4 12 12.4 Z"/>`,
};
export const mark = s => `<svg class="lu-pip" viewBox="0 0 24 24" aria-hidden="true">${MARK[s]}</svg>`;
/* the same marks as part of a drawing rather than as a corner pip */
export const lnMark = (s, x, y, k) =>
  `<g transform="translate(${x} ${y}) scale(${k}) translate(-12 -12)">${MARK[s].replace(/class="ink-fill"/g, 'class="lu-ln"')}</g>`;

/* ============================================================
   THE FACETED MARK. Each suit is a BODY of one or more polygons
   plus, where it has one, a STEM drawn plainly. Faceting is a
   band of triangles between the outline and a ring at 52%, then a
   star of chords inside it, and NEVER a fan to the centroid --
   fanning knotted the middle of the spade and the club, and
   faceting their stems made it worse.
   ============================================================ */
export const ngon = (cx, cy, r, n, rot = -Math.PI / 2) =>
  Array.from({ length: n }, (_, i) => {
    const a = rot + i * (Math.PI * 2 / n);
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });

const BODY = {
  spades: [[[50,8],[64,22],[77,35],[86,48],[84,60],[74,68],[62,66],[50,57],[38,66],[26,68],[16,60],[14,48],[23,35],[36,22]]],
  hearts: [[[50,88],[32,73],[18,58],[13,42],[18,26],[32,18],[44,23],[50,32],[56,23],[68,18],[82,26],[87,42],[82,58],[68,73]]],
  diamonds: [[[50,6],[68,28],[87,50],[68,72],[50,94],[32,72],[13,50],[32,28]]],
  /* The lower lobes sit IN far enough to overlap the top one and to bridge each
     other across the stem. At the first spacing the stem's edge cleared every
     lobe at every height and the club came apart into four floating pieces. */
  clubs: [ngon(50, 28, 19, 8), ngon(30, 50, 18, 8), ngon(70, 50, 18, 8)],
};
const STEM = {
  spades: `<path class="lu-ln" d="M44 56 L36 90 L64 90 L56 56"/><path class="lu-ln" d="M50 58 L50 90"/>
           <path class="lu-ln" d="M44 56 L64 90"/><path class="lu-ln" d="M56 56 L36 90"/>`,
  /* starts at y=46, under the lobes, so the join is hidden the way a real
     club's is; it only becomes its own shape below y=63 */
  clubs:  `<path class="lu-ln" d="M44 46 L36 92 L64 92 L56 46"/><path class="lu-ln" d="M50 58 L50 92"/>
           <path class="lu-ln" d="M41.9 58 L64 92"/><path class="lu-ln" d="M58.1 58 L36 92"/>`,
};

function facetPoly(pts) {
  const n = pts.length;
  const cx = pts.reduce((a, q) => a + q[0], 0) / n;
  const cy = pts.reduce((a, q) => a + q[1], 0) / n;
  const ring = pts.map(([x, y]) => [cx + (x - cx) * 0.52, cy + (y - cy) * 0.52]);
  const f = q => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`;
  const L = (a, b) => `<path class="lu-ln" d="M${f(a)} L${f(b)}"/>`;
  const poly = p => `<path class="lu-ln" d="M${p.map(f).join(" L")} Z"/>`;
  const skip = Math.max(3, Math.round(n / 2.8));
  return poly(pts) + poly(ring)
    + pts.map((q, i) => L(q, ring[i])).join("")
    + pts.map((q, i) => L(q, ring[(i + 1) % n])).join("")
    + ring.map((q, i) => L(q, ring[(i + skip) % n])).join("");
}
export const facet = suit => BODY[suit].map(facetPoly).join("") + (STEM[suit] || "");

/* ============================================================
   THE DECO FRAME. A drawn frame, not a CSS border: a double rule,
   corners turning inward on a lozenge, and at top and bottom a
   cap lozenge that KNOCKS THE RULE OUT and carries the suit.
   t/b are pulled in far enough that the cap, which hangs 11 off
   the outer rule, still lands inside the keyline -- the first
   setting had it trimmed by the card edge, which is the one thing
   a printed card never does.
   ============================================================ */
export const frame = (suit, plainCaps) => {
  const t = 20, b = 120;
  const corner = ([x, y, sx, sy]) => `
    <path class="lu-ln" d="M${x} ${y + sy * 15} L${x + sx * 8} ${y + sy * 15} L${x + sx * 8} ${y} L${x + sx * 15} ${y}"/>
    <path class="lu-ln" d="M${x + sx * 4.5} ${y + sy * 4.5} l${sx * 3.4} ${sy * -3.4} l${sx * 3.4} ${sy * 3.4} l${sx * -3.4} ${sy * 3.4} Z"/>`;
  const cap = (y, d) => `<path class="lu-ln-o" d="M50 ${y - d * 11} L61 ${y} L50 ${y + d * 11} L39 ${y} Z"/>`
    + (plainCaps ? `<path class="lu-ln" d="M50 ${y - d * 6.5} L56.5 ${y} L50 ${y + d * 6.5} L43.5 ${y} Z"/>`
                 : lnMark(suit, 50, y, 0.42));
  return `
    <path class="lu-ln" d="M9 ${t - 4} L91 ${t - 4} L91 ${b + 4} L9 ${b + 4} Z"/>
    <path class="lu-ln" d="M13 ${t} L87 ${t} L87 ${b} L13 ${b} Z"/>
    ${[[13, t, 1, 1], [87, t, -1, 1], [87, b, -1, -1], [13, b, 1, -1]].map(corner).join("")}
    ${cap(t - 4, 1)}${cap(b + 4, -1)}`;
};

/* ============================================================
   THE VINE. Corner sprigs drawn to sit inside the frame. Top and
   bottom are separate drawings: different flower, different petal
   count, leaves on different sides of their stem.
   ============================================================ */
export const petals = (cx, cy, n, r, rot) =>
  Array.from({ length: n }, (_, i) => {
    const a = rot + i * (Math.PI * 2 / n);
    const ox = Math.cos(a), oy = Math.sin(a);
    return `<path class="lu-ln-o" d="M${cx} ${cy} Q${(cx + ox * r * 0.7 - oy * r * 0.62).toFixed(1)} ${(cy + oy * r * 0.7 + ox * r * 0.62).toFixed(1)} ${(cx + ox * r * 1.75).toFixed(1)} ${(cy + oy * r * 1.75).toFixed(1)} Q${(cx + ox * r * 0.7 + oy * r * 0.62).toFixed(1)} ${(cy + oy * r * 0.7 - ox * r * 0.62).toFixed(1)} ${cx} ${cy} Z"/>`;
  }).join("")
  + `<circle class="lu-ln-o" cx="${cx}" cy="${cy}" r="${(r * 0.4).toFixed(1)}"/>`
  + Array.from({ length: n }, (_, i) => {
      const a = rot + (i + 0.5) * (Math.PI * 2 / n);
      return `<path class="lu-ln" d="M${(cx + Math.cos(a) * r * 0.2).toFixed(1)} ${(cy + Math.sin(a) * r * 0.2).toFixed(1)} L${(cx + Math.cos(a) * r * 0.34).toFixed(1)} ${(cy + Math.sin(a) * r * 0.34).toFixed(1)}"/>`;
    }).join("");

/* a leaf with a midrib, because a leaf without one is a petal */
export const leaf = (x, y, a, l) => {
  const tx = x + Math.cos(a) * l * 1.7, ty = y + Math.sin(a) * l * 1.7;
  const c1x = x + Math.cos(a - 0.85) * l, c1y = y + Math.sin(a - 0.85) * l;
  const c2x = x + Math.cos(a + 0.85) * l, c2y = y + Math.sin(a + 0.85) * l;
  return `<path class="lu-ln-o" d="M${x.toFixed(1)} ${y.toFixed(1)} Q${c1x.toFixed(1)} ${c1y.toFixed(1)} ${tx.toFixed(1)} ${ty.toFixed(1)} Q${c2x.toFixed(1)} ${c2y.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)} Z"/>
          <path class="lu-ln" d="M${x.toFixed(1)} ${y.toFixed(1)} L${tx.toFixed(1)} ${ty.toFixed(1)}"/>`;
};

/* Two independent sprays in the top and bottom bands. The compact groups leave
   the central copy field clear even when Large text wraps a title and rule. */
export const VINE = `
  <g transform="scale(.68)">
  <path class="lu-ln" d="M5 31 C13 19 25 12 40 10"/>
  ${leaf(11, 25, -1.05, 7)}${leaf(21, 16, 0.35, 6)}${leaf(32, 11, -1.15, 6)}
  ${petals(47, 13, 6, 6.5, -0.3)}
  </g>
  <g transform="translate(32 45) scale(.68)">
  <path class="lu-ln" d="M95 109 C87 121 75 128 60 130"/>
  ${leaf(89, 115, 2.09, 7)}${leaf(79, 124, 3.49, 6)}${leaf(68, 129, 1.99, 6)}
  ${petals(53, 127, 5, 7, 0.55)}
  </g>`;

/* ============================================================
   THE SPREAD STRAND. Diamonds is the breadth suit and the
   bracelet is already its reporting surface, so its ornament is
   two draped threads of beads. Beads sit at the height the thread
   actually is, and no two are the same size.
   ============================================================ */
const bez = (p0, p1, p2, t) => [
  (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0],
  (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1],
];
const thread = (p0, p1, p2, n, seed, k = 1) => {
  const sizes = [3.1, 4.2, 3.5, 4.6, 2.9, 3.8, 3.3, 4.4, 3.0].map(v => v * k);
  let out = `<path class="lu-ln" d="M${p0[0]} ${p0[1]} Q${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]}"/>`;
  for (let i = 0; i < n; i++) {
    const [x, y] = bez(p0, p1, p2, (i + 0.5) / n);
    out += `<circle class="lu-ln-o" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${sizes[(seed + i) % sizes.length].toFixed(1)}"/>`;
  }
  return out;
};
/* Inside a frame (kept as an alternate) */
export const STRAND =
    thread([18, 30], [50, 74], [82, 30], 9, 0)
  + thread([30, 28], [50, 58], [70, 28], 6, 4);

/* Bare, filling the field the way the faceted mark does: three nested strands
   hung from the top corners. This is diamonds' whole card, not a motif. */
export const STRAND_BIG =
    thread([5, 17], [50, 109], [95, 17], 11, 0, 1.15)
  + thread([20, 12], [50, 76],  [80, 12], 8,  5, 1.00)
  + thread([35, 8],  [50, 48],  [65, 8],  5,  2, 0.85);

/* ============================================================
   THE RULED SCRAP. Clubs is the form suit -- how you play -- so
   its ornament is a torn piece of the notebook's own page, margin
   rule and all. The tear is uneven and is not repeated anywhere
   else on the card.
   ============================================================ */
export const RULED = `
  <path class="lu-ln-o" d="M28 22 L70 22 L72 28 L69 34.5 L73 41 L70 47.5 L73 54 L70 60 L28 60 Z"/>
  <path class="lu-ln" d="M35 22 L35 60"/>
  <path class="lu-ln" d="M30 30 L70 30"/>
  <path class="lu-ln" d="M30 37 L67 37"/>
  <path class="lu-ln" d="M30 44 L70 44"/>
  <path class="lu-ln" d="M30 51 L64 51"/>`;

/* ============================================================
   THE POSY. Hearts is the devotion suit, so its ornament is
   something growing that you stay with. Corner sprigs were tried
   first and had to go: with a frame and centred words already on
   the card there is no corner left, and the lower sprig ran
   straight through its own text. A posy sits in the SAME upper
   field as the other three ornaments, which is also what gives
   four different suits one typographic rhythm.
   ============================================================ */
export const POSY = `
  <path class="lu-ln" d="M50 70 C50 60 50 50 50 42"/>
  <path class="lu-ln" d="M50 64 C46 58 42 54 38 50"/>
  <path class="lu-ln" d="M50 60 C54 55 59 51 63 48"/>
  ${leaf(47, 61, -2.1, 5)}${leaf(54, 57, -1.05, 4.6)}
  ${petals(50, 33, 6, 7.2, -0.3)}
  ${petals(35, 46, 5, 5.6, 0.45)}
  ${petals(66, 44, 5, 5.9, -0.95)}`;

/* ============================================================
   FACES. `look` is one of facet | frame | crest | vine, and the
   class goes on the CARD so a mixed deck can stand two looks side
   by side.
   ============================================================ */
export function artFor(look, suit) {
  if (look === "facet") return `<svg viewBox="0 0 100 100">${facet(suit)}</svg>`;
  if (look === "frame") return `<svg viewBox="0 0 100 140">${frame(suit)}</svg>`;
  if (look === "crest") return `<svg viewBox="0 0 100 140">${frame(suit, true)}
      <g transform="translate(50 46) scale(0.38) translate(-50 -50)">${facet(suit)}</g></svg>`;
  if (look === "vine")  return `<svg viewBox="0 0 100 140">${VINE}</svg>`;
  /* the three per-suit looks: the SAME frame every time, a different ornament
     inside it. Caps go plain on all of them, because the ornament and the two
     corner indices already say the suit twice. */
  if (look === "posy")   return `<svg viewBox="0 0 100 140">${frame(suit, true)}${POSY}</svg>`;
  if (look === "strand") return `<svg viewBox="0 0 100 140">${frame(suit, true)}${STRAND}</svg>`;
  if (look === "ruled")  return `<svg viewBox="0 0 100 140">${frame(suit, true)}${RULED}</svg>`;
  if (look === "strandbare") return `<svg viewBox="0 0 100 72">${STRAND_BIG}</svg>`;
  return "";
}

/* ============================================================
   THE PER-SUIT SCHEME.

   The suit in this deck is not decoration: it says what KIND of
   promise the card is. So each suit gets its own CONSTRUCTION,
   not merely its own ornament dropped into a shared frame --
   that version was tried and it flattened the four back into one
   card with a changing picture, which is the whole thing the
   scheme was picked for.

     spades   lockouts  one hard crystalline mark, no border
     hearts   devotion  sprigs growing up the margins, no border
     diamonds spread    strands hung across the card, no border
     clubs    form      the drawn frame itself, field left to the
                        words -- form is the only suit ABOUT the
                        rules of play, so it is the only one that
                        gets a border

   What holds twenty-four cards together is not a repeated frame.
   It is the stock, the keyline, the lifted corner, the two ink
   colours, the corner indices, and one stroke weight across every
   drawing on every card.
   ============================================================ */
export const SUIT_LOOK = { spades: "facet", hearts: "vine", diamonds: "strandbare", clubs: "frame" };

const MISS = { fails: "a missed page fails it", skipped: "a missed page is skipped" };

/* A pool restriction has to be PRINTED. It is measured (deal-lab.html) rather than chosen,
   but a card that is quietly unavailable in a run is worse than one that says so: the player
   is spending pips on it. Only the breadth cards carry one. */
const POOL_LINE = pools =>
  !pools || pools.length >= 3 ? ""
  : pools.length === 1 ? `${pools[0]} pool only`
  : `${pools.slice(0, -1).join(", ")} and ${pools[pools.length - 1]} only`;

export function cardFace(card, look) {
  const red = RED[card.suit] ? " lu-red" : "";
  const und = (card.rank === "6" || card.rank === "9") ? "lu-und" : "";
  const missText = MISS[card.miss] || "";
  const ix = pos => `<div class="lu-ix lu-ix-${pos}"><b class="${und}">${card.rank}</b>${mark(card.suit)}</div>`;
  return `<div class="lu-card lu-look-${look}${red}">
    <div class="lu-art">${artFor(look, card.suit)}</div>
    <div class="lu-keyline"></div>
    ${ix("tl")}${ix("br")}
    <div class="lu-mid">
      <p class="lu-miss${card.miss === "fails" ? " bad" : ""}">${missText || "&nbsp;"}</p>
      <p class="lu-name">${card.name}</p>
      <p class="lu-rule">${card.rule}</p>
      ${POOL_LINE(card.pools) ? `<p class="lu-pool">${POOL_LINE(card.pools)}</p>` : ""}
    </div>
  </div>`;
}

/* ============================================================
   BACKS
   ============================================================ */
export const BACKS = [
  { key: "swirl", label: "the swirl ring", red: true,
    art: (() => {
      /* Rows of curls lying ALONG the ring. Radial strokes read as a gear;
         the curl has to follow the circumference. */
      let out = `<path class="lu-ln" d="M10 14 L90 14 L90 126 L10 126 Z"/><path class="lu-ln" d="M14 18 L86 18 L86 122 L14 122 Z"/>`
              + `<circle class="lu-ln" cx="50" cy="70" r="33"/><circle class="lu-ln" cx="50" cy="70" r="30"/><circle class="lu-ln" cx="50" cy="70" r="15"/>`;
      for (let row = 0; row < 4; row++) {
        const n = 52 - row * 5;
        for (let i = 0; i < n; i++) {
          const a = (i / n) * Math.PI * 2 + row * 0.55;
          const pull = 0.38 + Math.abs(Math.sin(a)) * 0.62;   // thin at the poles
          const r = 17.5 + row * 3.4;
          const x = 50 + Math.cos(a) * r, y = 70 + Math.sin(a) * r;
          const len = 4.6 * pull;
          const c = (ang, m) => `${(Math.cos(a + ang) * len * m).toFixed(1)} ${(Math.sin(a + ang) * len * m).toFixed(1)}`;
          out += `<path class="lu-ln" d="M${x.toFixed(1)} ${y.toFixed(1)} q${c(2.25, 0.85)} ${c(1.42, 1.85)}"/>`;
        }
      }
      return out;
    })() },

  { key: "lattice", label: "a ruled lattice, red pen", red: true,
    art: (() => {
      let inner = "";
      for (let i = -16; i < 24; i++) {
        inner += `<path class="lu-ln" d="M${14 + i * 7.4} 18 L${14 + i * 7.4 + 106} 122"/>`;
        inner += `<path class="lu-ln" d="M${14 + i * 7.4} 122 L${14 + i * 7.4 + 106} 18"/>`;
      }
      return `<clipPath id="bkclip"><rect x="14" y="18" width="72" height="104"/></clipPath>
              <g clip-path="url(#bkclip)">${inner}</g>
              <path class="lu-ln" d="M10 14 L90 14 L90 126 L10 126 Z"/>
              <path class="lu-ln" d="M14 18 L86 18 L86 122 L14 122 Z"/>
              <path class="lu-ln-o" d="M50 56 L64 70 L50 84 L36 70 Z"/>
              <path class="lu-ln" d="M50 60 L60 70 L50 80 L40 70 Z"/>`;
    })() },

  { key: "strand", label: "the bead strand", red: false,
    art: (() => {
      /* Draped threads: each sags, the beads sit at the height the thread
         actually is, and no two rows carry the same beads. */
      let out = `<path class="lu-ln" d="M10 14 L90 14 L90 126 L10 126 Z"/><path class="lu-ln" d="M14 18 L86 18 L86 122 L14 122 Z"/>`;
      const sizes = [2.6, 3.3, 2.9, 3.6, 2.4, 3.1, 2.8, 3.4, 2.5, 3.0];
      for (let row = 0; row < 7; row++) {
        const y0 = 27 + row * 14.5, sag = 8 + (row % 3) * 2.4;
        out += `<path class="lu-ln" d="M17 ${y0} Q50 ${(y0 + sag * 2).toFixed(1)} 83 ${y0}"/>`;
        const n = 8 + (row % 3);
        for (let i = 0; i < n; i++) {
          const t = (i + 0.5) / n;
          out += `<circle class="lu-ln-o" cx="${(17 + t * 66).toFixed(1)}" cy="${(y0 + sag * 2 * t * (1 - t) * 2).toFixed(1)}" r="${sizes[(row * 4 + i) % sizes.length]}"/>`;
        }
      }
      return out;
    })() },

  { key: "crest", label: "four suits, one frame", red: true,
    art: `<path class="lu-ln" d="M10 14 L90 14 L90 126 L10 126 Z"/>
          <path class="lu-ln" d="M14 18 L86 18 L86 122 L14 122 Z"/>
          <g transform="translate(33 46) scale(0.26) translate(-50 -50)">${facet("hearts")}</g>
          <g transform="translate(67 46) scale(0.26) translate(-50 -50)">${facet("diamonds")}</g>
          <g transform="translate(33 96) scale(0.26) translate(-50 -50)">${facet("clubs")}</g>
          <g transform="translate(67 96) scale(0.26) translate(-50 -50)">${facet("spades")}</g>
          <path class="lu-ln-o" d="M50 62 L58 70 L50 78 L42 70 Z"/>
          <path class="lu-ln" d="M50 65.5 L54.5 70 L50 74.5 L45.5 70 Z"/>` },
];

export const backCard = b => `<div class="lu-back${b.red ? " lu-red" : ""}">
    <div class="lu-art"><svg viewBox="0 0 100 140">${b.art}</svg></div>
    <div class="lu-keyline"></div>
  </div>`;
