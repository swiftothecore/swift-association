// Desk props for the scrolling gutters (placed by js/scatter.js).
//
// index.html holds the FIXED props, the ones that dress the first screenful and
// scroll away. This file holds the ones that carry the rest of the page: the
// same desk, seen further down.
//
// Two tiers, and the split matters more than the drawings do:
//
//   DESK_MARKS  — stains and debris. Flat, no cast shadow, low opacity, drawn
//                 UNDER everything. These are the desk's history, not objects on
//                 it, so they never compete for attention. Used freely.
//   DESK_PROPS  — real objects. Lit, with a cast shadow, and rationed hard: at
//                 most one per screenful of scroll. An object is an event.
//
// Scale is the same one the fixed props use (see styles.css): 660px of notebook
// = 22cm of paper, so ~3px per mm. Every w/h below is a real object measured at
// that scale. A prop drawn off-scale is the fastest way to break the desk.
//
// Each entry: { id, w, h, svg } where svg is the inner markup of a viewBox
// "0 0 w h". scatter.js wraps it, sizes it, rotates it and hangs the shadow on
// it, so nothing here sets position, transform, or filter.

// ---------------------------------------------------------------------------
// Tier 1: marks. Stains, dust, offcuts. Flat and stainless-of-shadow, because a
// mark IS the desk surface rather than a thing resting on it.
// ---------------------------------------------------------------------------

export const DESK_MARKS = [
  {
    // A full coffee ring: a mug set down, lifted, and never wiped. The ring is
    // uneven on purpose (four arcs at different weights and opacities) and
    // heaviest along the lower-right, where the film ran last before it dried.
    id: "ring-full", w: 190, h: 190,
    svg: `
      <g fill="none" stroke="#7d5a2e" stroke-linecap="round">
        <path d="M95 12 a83 83 0 0 1 74 46" stroke-width="5" opacity="0.16"/>
        <path d="M169 58 a83 83 0 0 1 -30 106" stroke-width="7" opacity="0.24"/>
        <path d="M139 164 a83 83 0 0 1 -96 -12" stroke-width="6.4" opacity="0.21"/>
        <path d="M43 152 a83 83 0 0 1 52 -140" stroke-width="4.2" opacity="0.13"/>
      </g>
      <!-- the dried film inside the ring: barely there, but it stops the ring
           reading as a drawn circle -->
      <circle cx="95" cy="95" r="79" fill="#8a6431" opacity="0.045"/>
      <!-- two dribbles down the outside, from the lift -->
      <path d="M150 150 q6 9 3 17" fill="none" stroke="#7d5a2e" stroke-width="2.6" opacity="0.13" stroke-linecap="round"/>
      <path d="M60 26 q-5 -6 -11 -7" fill="none" stroke="#7d5a2e" stroke-width="2" opacity="0.1" stroke-linecap="round"/>`,
  },
  {
    // A half ring: the mug was moved before the film closed, so only the arc it
    // sat longest on printed. Reads as an older, fainter visit than the full one.
    id: "ring-half", w: 170, h: 130,
    svg: `
      <g fill="none" stroke="#7d5a2e" stroke-linecap="round">
        <path d="M18 46 a72 66 0 0 0 62 70" stroke-width="5.6" opacity="0.19"/>
        <path d="M80 116 a72 66 0 0 0 60 -34" stroke-width="4" opacity="0.13"/>
        <path d="M148 62 a72 66 0 0 0 -6 -20" stroke-width="3" opacity="0.08"/>
      </g>
      <path d="M26 40 q-8 3 -13 10" fill="none" stroke="#7d5a2e" stroke-width="2.2" opacity="0.1" stroke-linecap="round"/>`,
  },
  {
    // Sharpener curls. A pencil shaving is a helix cut flat: a lobed skirt with
    // the graphite core's dark bite on the inner edge. Two curls and the dust
    // that came off with them.
    id: "shavings", w: 96, h: 76,
    svg: `
      <g stroke="#a58a52" stroke-width="0.8" stroke-linejoin="round">
        <path d="M16 40 q-4 -16 10 -22 q16 -7 26 2 q9 8 2 17 q-8 10 -20 9 q-14 -1 -18 -6 Z" fill="#e8c98d"/>
        <path d="M22 36 q-2 -11 8 -15 q12 -5 19 1" fill="none" stroke="#c9a565" stroke-width="1.1"/>
        <path d="M52 22 q7 -4 12 1 q4 5 -1 8" fill="#d9b678"/>
      </g>
      <!-- the graphite bite: the core the blade took with the wood -->
      <path d="M16 40 q10 6 22 5 q11 -1 18 -8" fill="none" stroke="#57534a" stroke-width="2.2" opacity="0.55" stroke-linecap="round"/>
      <g stroke="#a58a52" stroke-width="0.8" stroke-linejoin="round">
        <path d="M52 62 q-3 -12 8 -16 q12 -5 20 2 q6 7 -1 12 q-9 6 -18 5 q-8 -1 -9 -3 Z" fill="#eccf96"/>
        <path d="M58 58 q-1 -8 7 -11" fill="none" stroke="#c9a565" stroke-width="1"/>
      </g>
      <path d="M52 62 q9 4 18 3" fill="none" stroke="#57534a" stroke-width="1.8" opacity="0.45" stroke-linecap="round"/>
      <!-- graphite dust -->
      <g fill="#5d5850" opacity="0.4">
        <circle cx="44" cy="55" r="1.3"/><circle cx="86" cy="40" r="1"/>
        <circle cx="34" cy="66" r="0.9"/><circle cx="76" cy="70" r="1.2"/>
      </g>`,
  },
  {
    // Eraser crumbs, swept off the page and forgotten. Pale, matte, irregular:
    // the one bit of debris on the desk that is lighter than the wood.
    id: "crumbs", w: 84, h: 58,
    svg: `
      <g fill="#e6dfd0" stroke="#c6bda9" stroke-width="0.5" opacity="0.85">
        <path d="M10 22 q5 -6 11 -2 q4 4 -1 8 q-7 4 -10 -6 Z"/>
        <path d="M30 12 q7 -4 9 2 q1 6 -6 6 q-6 0 -3 -8 Z"/>
        <path d="M44 34 q8 -5 11 1 q2 6 -6 7 q-8 0 -5 -8 Z"/>
        <path d="M62 18 q6 -3 7 2 q0 5 -5 4 q-5 -1 -2 -6 Z"/>
        <path d="M22 42 q5 -3 6 1 q0 4 -4 3 q-4 -1 -2 -4 Z"/>
        <path d="M70 40 q4 -2 5 1 q0 4 -4 3 q-3 -1 -1 -4 Z"/>
      </g>
      <g fill="#ded6c4" opacity="0.7">
        <circle cx="52" cy="14" r="1.4"/><circle cx="16" cy="36" r="1.1"/>
        <circle cx="38" cy="46" r="1.2"/><circle cx="78" cy="26" r="1"/>
      </g>`,
  },
  {
    // An ink blot and the squiggles that tested the nib after it. Real desks
    // have this exact pair: the accident, then the proof it was fixed.
    // The blot is deliberately lopsided with one running tail. A symmetrical
    // blob reads as a printed dot; ink that fell off a nib always has a heavy
    // side where it landed and a thin side where it ran. Under multiply the
    // navy loses most of its blue to the wood, so it is mixed darker and more
    // opaque than it looks here.
    id: "blot", w: 78, h: 62,
    svg: `
      <path d="M20 22 q6 -12 17 -8 q13 4 12 15 q-1 8 -9 11 q-6 2 -12 -1
               q-4 6 -10 5 q-5 -1 -4 -6 q1 -5 7 -6 q-3 -6 -1 -10 Z"
            fill="#1e2a41" opacity="0.6"/>
      <!-- the splash: satellites thrown clear when it landed -->
      <g fill="#1e2a41" opacity="0.5">
        <circle cx="12" cy="12" r="2.4"/><circle cx="45" cy="10" r="1.6"/>
        <circle cx="16" cy="44" r="1.8"/><circle cx="38" cy="46" r="1.2"/>
      </g>
      <!-- nib tests: two scratchy passes and one that finally flowed -->
      <g fill="none" stroke="#1e2a41" stroke-linecap="round">
        <path d="M54 32 q7 -5 13 0" stroke-width="0.8" opacity="0.4"/>
        <path d="M52 41 q8 -6 15 -1" stroke-width="1.2" opacity="0.5"/>
        <path d="M50 50 q9 -7 17 -1 q5 4 9 1" stroke-width="1.9" opacity="0.62"/>
      </g>`,
  },
  {
    // Floss offcuts: the tag ends snipped off a finished bracelet. Four, not
    // six, and short and fat rather than long and thin: at desk scale a 2px
    // thread over 140px reads as a coloured pencil line, and four stubby curls
    // read as what they are. Each gets a dark under-pass so it has a round
    // cord's shading instead of a flat stroke's.
    id: "offcuts", w: 128, h: 82,
    svg: `
      <g fill="none" stroke-linecap="round">
        <g stroke-width="4.6" opacity="0.32">
          <path d="M14 26 q16 -12 30 -2 q7 5 13 1" stroke="#4a3a22"/>
          <path d="M24 56 q18 9 34 -1" stroke="#4a3a22"/>
          <path d="M64 68 q16 -11 32 -2" stroke="#4a3a22"/>
          <path d="M74 34 q15 10 30 1 q7 -4 13 1" stroke="#4a3a22"/>
        </g>
        <g stroke-width="3.4">
          <path d="M14 26 q16 -12 30 -2 q7 5 13 1" stroke="#c79a3e"/>
          <path d="M24 56 q18 9 34 -1" stroke="#c06880"/>
          <path d="M64 68 q16 -11 32 -2" stroke="#6c8cb4"/>
          <path d="M74 34 q15 10 30 1 q7 -4 13 1" stroke="#5a9e6e"/>
        </g>
        <!-- the lit top of each cord -->
        <g stroke-width="1.1" opacity="0.5" stroke="#ffffff">
          <path d="M15 24 q15 -11 28 -2"/><path d="M25 54 q17 8 32 -1"/>
          <path d="M65 66 q15 -10 30 -2"/><path d="M75 32 q14 9 28 1"/>
        </g>
      </g>
      <!-- frayed ends: each snippet splits into two or three fibres -->
      <g fill="none" stroke-width="0.9" stroke-linecap="round" opacity="0.7">
        <path d="M57 25 l7 -3 M57 25 l7 2" stroke="#c79a3e"/>
        <path d="M117 36 l7 -2 M117 36 l6 3" stroke="#5a9e6e"/>
        <path d="M14 26 l-7 -3 M14 26 l-6 3" stroke="#c79a3e"/>
        <path d="M96 66 l7 -1 M96 66 l6 3" stroke="#6c8cb4"/>
      </g>`,
  },
];

// ---------------------------------------------------------------------------
// Tier 2: objects. Lit, shadowed, rationed. Each one has to earn a whole
// screenful of scroll, so each is a thing a person put down mid-task, not
// scenery.
//
// `narrow: true` marks the props that read fine in a thin gutter (long, thin
// silhouettes). scatter.js prefers these when the band is tight.
// ---------------------------------------------------------------------------

export const DESK_PROPS = [
  {
    // The finished bracelet, coiled the way one falls when you drop it: a loose
    // oval of elastic with the beads crowding the outer curve. This is the prop
    // the whole scatter exists to pay off, so it gets the most care: the strung
    // beads carry a real word, and the coil crosses over itself once.
    id: "bracelet", w: 172, h: 150,
    svg: `
      <defs>
        <radialGradient id="dpBone" cx="0.34" cy="0.28" r="0.9">
          <stop offset="0" stop-color="#fdfbf4"/><stop offset="0.7" stop-color="#efe9da"/><stop offset="1" stop-color="#d3cbb6"/>
        </radialGradient>
      </defs>
      <!-- the elastic, under the beads, showing only in the gaps -->
      <path d="M86 16 q62 8 68 56 q6 46 -44 66 q-52 21 -84 -10 q-30 -30 -8 -72 q16 -30 52 -34 q14 -2 22 4"
            fill="none" stroke="#d8cdb2" stroke-width="3.2" stroke-linecap="round"/>
      <g stroke="#bdb49e" stroke-width="0.85">
        <g fill="url(#dpBone)">
          <circle cx="86" cy="16" r="10"/><circle cx="118" cy="24" r="10"/><circle cx="141" cy="47" r="10"/>
          <circle cx="152" cy="76" r="10"/><circle cx="146" cy="106" r="10"/><circle cx="122" cy="127" r="10"/>
          <circle cx="92" cy="136" r="10"/><circle cx="61" cy="137" r="10"/><circle cx="34" cy="124" r="10"/>
          <circle cx="16" cy="99" r="10"/><circle cx="15" cy="69" r="10"/><circle cx="30" cy="43" r="10"/>
          <circle cx="56" cy="27" r="10"/>
        </g>
        <!-- three colour beads broke up the lettering, as they always do -->
        <circle cx="118" cy="24" r="10" fill="#ecaebd"/>
        <circle cx="61" cy="137" r="10" fill="#b3cbe4"/>
        <circle cx="15" cy="69" r="10" fill="#f2d78f"/>
      </g>
      <!-- the lit rim and speck each bead catches from the upper-left lamp -->
      <g fill="#ffffff" opacity="0.5">
        <circle cx="82" cy="12" r="1.9"/><circle cx="137" cy="43" r="1.9"/><circle cx="142" cy="102" r="1.9"/>
        <circle cx="88" cy="132" r="1.9"/><circle cx="30" cy="120" r="1.9"/><circle cx="26" cy="39" r="1.9"/>
      </g>
      <g class="dp-bead-letter">
        <text x="86" y="20">L</text><text x="141" y="51">U</text><text x="152" y="80">C</text>
        <text x="146" y="110">K</text><text x="122" y="131">Y</text><text x="92" y="140">O</text>
        <text x="34" y="128">N</text><text x="16" y="103">E</text><text x="30" y="47">S</text>
        <text x="56" y="31">S</text>
      </g>`,
  },
  {
    // Embroidery scissors, open, lying on the desk. Stork-handled ones are the
    // cliché; these are the plain steel pair every craft drawer actually has.
    // Blades caught the lamp, handles are a dulled gold.
    id: "scissors", w: 88, h: 210, narrow: true, maxRot: 26,
    svg: `
      <defs>
        <linearGradient id="dpSteel" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#f2f1ee"/><stop offset="0.45" stop-color="#c9c8c3"/>
          <stop offset="0.7" stop-color="#a6a49d"/><stop offset="1" stop-color="#d5d4cf"/>
        </linearGradient>
        <linearGradient id="dpBrass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#d9b871"/><stop offset="0.55" stop-color="#b1893f"/><stop offset="1" stop-color="#8a6a2f"/>
        </linearGradient>
      </defs>
      <!-- blades, crossed just above the pivot -->
      <g stroke="#8e8d87" stroke-width="0.9" stroke-linejoin="round">
        <path d="M44 96 L58 20 q2 -9 6 -8 q4 1 3 10 L54 100 Z" fill="url(#dpSteel)"/>
        <path d="M44 96 L28 22 q-2 -9 -6 -8 q-4 1 -3 10 L34 100 Z" fill="url(#dpSteel)"/>
      </g>
      <!-- the cutting edges, a shade brighter than the blade faces -->
      <g fill="none" stroke="#ffffff" stroke-width="1.1" opacity="0.55" stroke-linecap="round">
        <path d="M56 26 L48 92"/><path d="M26 28 L34 92"/>
      </g>
      <circle cx="44" cy="100" r="5.6" fill="url(#dpBrass)" stroke="#6f5322" stroke-width="1"/>
      <circle cx="42.4" cy="98.4" r="1.7" fill="#f6e4b6" opacity="0.75"/>
      <!-- Handles: two open bows splayed below the pivot. Drawn as separate
           stroked ellipses rather than as one traced outline, because a traced
           pair overlaps so heavily near the pivot that the two loops fuse into a
           single brass blob and the thing stops reading as scissors. Each bow
           gets a dark under-stroke and a brass over-stroke, so it has the round
           section of a cast handle rather than a flat line's. -->
      <g fill="none" stroke-linecap="round">
        <g stroke="#6f5322" stroke-width="8">
          <path d="M41 106 L31 130"/>
          <path d="M47 106 L58 130"/>
          <ellipse cx="27" cy="160" rx="15" ry="27" transform="rotate(-13 27 160)"/>
          <ellipse cx="62" cy="160" rx="15" ry="27" transform="rotate(13 62 160)"/>
        </g>
        <g stroke="url(#dpBrass)" stroke-width="5.6">
          <path d="M41 106 L31 130"/>
          <path d="M47 106 L58 130"/>
          <ellipse cx="27" cy="160" rx="15" ry="27" transform="rotate(-13 27 160)"/>
          <ellipse cx="62" cy="160" rx="15" ry="27" transform="rotate(13 62 160)"/>
        </g>
        <!-- the lamp catching the outer edge of each bow -->
        <g stroke="#f6e4b6" stroke-width="1.5" opacity="0.55">
          <path d="M14 150 q-2 14 4 24"/>
          <path d="M75 150 q2 14 -4 24"/>
        </g>
      </g>`,
  },
  {
    // A corner torn off a notebook page, with a couplet on it that did not
    // survive. The tear is on two edges only: the other two keep the page's
    // clean factory cut, which is what makes a torn scrap read as torn.
    id: "scrap", w: 176, h: 126,
    svg: `
      <path d="M4 6 L150 4 L146 22 L162 40 L150 58 L166 76 L152 96 L160 114
               L118 112 L96 120 L62 110 L38 120 L10 108 Z"
            fill="#f3ecd6" stroke="#d6cbac" stroke-width="0.9" stroke-linejoin="round"/>
      <!-- the torn edges get a paler lip: the fibre pulled through the sizing -->
      <path d="M150 4 L146 22 L162 40 L150 58 L166 76 L152 96 L160 114 L118 112 L96 120 L62 110 L38 120 L10 108"
            fill="none" stroke="#fffaea" stroke-width="1.8" opacity="0.75" stroke-linejoin="round"/>
      <!-- the page's own furniture, cut off mid-scrap -->
      <path d="M26 2 L24 116" fill="none" stroke="#b23a3f" stroke-width="1.1" opacity="0.5"/>
      <g fill="none" stroke="#93a0bd" stroke-width="0.9" opacity="0.5">
        <path d="M6 30 H155"/><path d="M6 56 H152"/><path d="M6 82 H157"/>
      </g>
      <!-- two lines of pencil, the second struck out hard enough to dent -->
      <g fill="none" stroke="#5c5340" stroke-width="1.5" stroke-linecap="round" opacity="0.65">
        <path d="M34 26 q7 -6 13 0 q5 6 11 0 q6 -6 12 1 q5 5 12 -1 q7 -5 13 1"/>
        <path d="M110 26 q6 -5 12 0 q5 5 11 -1"/>
        <path d="M34 52 q8 -6 14 1 q5 6 12 -1 q7 -6 13 1 q6 6 13 -1 q7 -6 14 1"/>
      </g>
      <path d="M30 50 q40 5 78 -2" fill="none" stroke="#5c5340" stroke-width="2" opacity="0.7" stroke-linecap="round"/>
      <path d="M32 54 q42 4 76 -3" fill="none" stroke="#5c5340" stroke-width="1.3" opacity="0.5" stroke-linecap="round"/>
      <!-- and one word circled in red, kept -->
      <path d="M40 88 q6 -5 12 0 q5 5 12 -1" fill="none" stroke="#5c5340" stroke-width="1.5" opacity="0.65" stroke-linecap="round"/>
      <ellipse cx="52" cy="84" rx="22" ry="12" fill="none" stroke="#b23a3f" stroke-width="1.4" opacity="0.7" transform="rotate(-4 52 84)"/>`,
  },
  {
    // A floss skein spool on its side, mid-unwind. The card bobbin is the giveaway
    // that this is embroidery floss and not thread: flat, notched, wound in a
    // tight flat band rather than a cone.
    id: "spool", w: 130, h: 118,
    svg: `
      <defs>
        <linearGradient id="dpCard" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stop-color="#f6f0dd"/><stop offset="1" stop-color="#ddd3b8"/>
        </linearGradient>
      </defs>
      <!-- the run of floss trailing off, drawn first so the spool sits on it -->
      <path d="M62 62 q34 22 52 18 q14 -3 12 -14" fill="none" stroke="#7a4f66" stroke-width="3" stroke-linecap="round" opacity="0.9"/>
      <path d="M62 62 q34 22 52 18 q14 -3 12 -14" fill="none" stroke="#c06880" stroke-width="1.8" stroke-linecap="round"/>
      <!-- bobbin card: a rounded rectangle with the two thread notches -->
      <path d="M18 22 h72 a10 10 0 0 1 10 10 v52 a10 10 0 0 1 -10 10 h-72 a10 10 0 0 1 -10 -10 v-52 a10 10 0 0 1 10 -10 Z"
            fill="url(#dpCard)" stroke="#c3b797" stroke-width="1"/>
      <path d="M8 44 q10 6 0 12" fill="#cdbf9e" stroke="#b3a687" stroke-width="0.8"/>
      <path d="M100 60 q-10 6 0 12" fill="#cdbf9e" stroke="#b3a687" stroke-width="0.8"/>
      <!-- the wound band: rose floss, each pass of the wind picked out -->
      <rect x="12" y="34" width="84" height="46" rx="5" fill="#c06880"/>
      <g stroke="#a8536b" stroke-width="0.9" opacity="0.55">
        <path d="M12 40 H96"/><path d="M12 48 H96"/><path d="M12 56 H96"/><path d="M12 64 H96"/><path d="M12 72 H96"/>
      </g>
      <g stroke="#e59aad" stroke-width="0.7" opacity="0.5">
        <path d="M12 37 H96"/><path d="M12 45 H96"/><path d="M12 53 H96"/><path d="M12 61 H96"/><path d="M12 69 H96"/>
      </g>
      <rect x="12" y="34" width="84" height="10" rx="4" fill="#ffffff" opacity="0.16"/>
      <!-- the printed skein number, half hidden by the wind -->
      <text class="dp-spool-no" x="54" y="94">304</text>`,
  },
  {
    // The bead tin: a shallow round sweet-tin with the lid off, tipped onto its
    // rim. scatter.js also uses this as the SOURCE of a spill, rotated to point
    // down the spill axis, which is the whole reason loose beads have a reason
    // to exist further down the page.
    id: "tin", w: 136, h: 122,
    svg: `
      <defs>
        <linearGradient id="dpTin" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stop-color="#e8dcc0"/><stop offset="0.5" stop-color="#c9b892"/><stop offset="1" stop-color="#9d8a63"/>
        </linearGradient>
        <linearGradient id="dpTinWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#8a7a56"/><stop offset="1" stop-color="#b6a47c"/>
        </linearGradient>
      </defs>
      <!-- the lid, dropped flat beside the tin -->
      <ellipse cx="30" cy="96" rx="28" ry="16" fill="url(#dpTin)" stroke="#8a7a56" stroke-width="1"/>
      <ellipse cx="30" cy="94" rx="22" ry="12" fill="none" stroke="#a89670" stroke-width="1" opacity="0.7"/>
      <!-- the tin body, tipped so the mouth faces down-right -->
      <path d="M54 28 a40 24 0 0 1 74 12 l-4 26 a40 24 0 0 1 -74 -12 Z" fill="url(#dpTinWall)" stroke="#7b6c4a" stroke-width="1"/>
      <ellipse cx="91" cy="40" rx="40" ry="24" fill="url(#dpTin)" stroke="#7b6c4a" stroke-width="1.1" transform="rotate(9 91 40)"/>
      <ellipse cx="91" cy="40" rx="33" ry="18" fill="#5f5238" opacity="0.55" transform="rotate(9 91 40)"/>
      <!-- the beads still in it, crowded to the low side of the tilt -->
      <g stroke="#7d7460" stroke-width="0.6">
        <circle cx="84" cy="48" r="6" fill="#f0ebdd"/><circle cx="97" cy="50" r="6" fill="#ecaebd"/>
        <circle cx="72" cy="44" r="6" fill="#f2d78f"/><circle cx="108" cy="45" r="6" fill="#f0ebdd"/>
        <circle cx="90" cy="38" r="6" fill="#b3cbe4"/><circle cx="103" cy="36" r="5.6" fill="#f0ebdd"/>
        <circle cx="77" cy="34" r="5.6" fill="#cbbceb"/>
      </g>
      <g fill="#ffffff" opacity="0.45">
        <circle cx="82" cy="46" r="1.4"/><circle cx="70" cy="42" r="1.4"/><circle cx="88" cy="36" r="1.3"/>
      </g>
      <ellipse cx="72" cy="30" rx="16" ry="6" fill="#ffffff" opacity="0.2" transform="rotate(9 72 30)"/>`,
  },
  {
    // A spent guitar string, coiled the way one springs back the moment it comes
    // off the peg: three loose turns that never quite close, with both ends free
    // and the ball end weighing one down.
    // A single wire drawn as three separate turns, painted back to front, so
    // that where one turn passes over another you SEE the crossing. That is the
    // only thing that makes a coil read as a coil: one continuous outline with
    // tick marks around it reads as a bangle, or worse, as a clock face.
    id: "string", w: 150, h: 138, narrow: true,
    svg: `
      <g fill="none" stroke-linecap="round">
        <!-- back turn, sitting lowest and slightly flattened by the ones on it -->
        <g stroke="#7e7a70" stroke-width="3">
          <path d="M30 88 q-14 -34 22 -50 q40 -18 72 6 q26 18 14 44"/>
        </g>
        <g stroke="#ddd9ce" stroke-width="0.9" opacity="0.7">
          <path d="M30 88 q-14 -34 22 -50 q40 -18 72 6 q26 18 14 44"/>
        </g>
        <!-- middle turn -->
        <g stroke="#8e8a80" stroke-width="3.2">
          <path d="M22 74 q-6 40 40 50 q48 10 72 -18 q18 -22 -2 -44"/>
        </g>
        <g stroke="#e6e2d7" stroke-width="1" opacity="0.8">
          <path d="M22 74 q-6 40 40 50 q48 10 72 -18 q18 -22 -2 -44"/>
        </g>
        <!-- front turn, the one the light finds, ending in a sprung free tail -->
        <g stroke="#8e8a80" stroke-width="3.4">
          <path d="M118 44 q-24 -22 -60 -12 q-40 12 -36 48 q4 34 46 38 q30 3 46 -14"/>
          <path d="M114 104 q16 -6 20 -20 q3 -12 -6 -20"/>
        </g>
        <g stroke="#f0ece1" stroke-width="1.1" opacity="0.85">
          <path d="M118 44 q-24 -22 -60 -12 q-40 12 -36 48 q4 34 46 38 q30 3 46 -14"/>
          <path d="M114 104 q16 -6 20 -20 q3 -12 -6 -20"/>
        </g>
        <!-- the winding, only on the front turn where it can actually be seen -->
        <g stroke="#6b6760" stroke-width="0.75" opacity="0.5">
          <path d="M104 36 l1 4 M88 31 l0 4 M72 30 l-1 4 M56 34 l-2 4 M42 42 l-3 3
                   M31 54 l-4 2 M26 70 l-4 1 M27 86 l-4 -1 M34 99 l-3 3 M47 108 l-2 4
                   M63 113 l-1 4 M79 114 l0 4 M95 111 l1 4"/>
        </g>
      </g>
      <!-- the ball end the wire was anchored by, and the cut tail at the far end -->
      <circle cx="128" cy="60" r="5.4" fill="#b1893f" stroke="#7c5d25" stroke-width="1"/>
      <circle cx="128" cy="60" r="1.9" fill="#5b451c"/>
      <circle cx="126.4" cy="58.4" r="1.5" fill="#f0dcaa" opacity="0.6"/>`,
  },
  {
    // Earbud cable, dropped and left. A long thin silhouette, which is exactly
    // what a narrow gutter wants: it fills 300px of wood without needing 300px
    // of width. The buds sit at the top, the jack runs off the bottom.
    id: "cable", w: 96, h: 300, narrow: true, maxRot: 8,
    svg: `
      <defs>
        <linearGradient id="dpCord" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#e7e1d1"/><stop offset="0.5" stop-color="#cec7b3"/><stop offset="1" stop-color="#a79f8a"/>
        </linearGradient>
      </defs>
      <!-- one continuous run: the two bud leads join at a splitter, then the
           single cord loops back on itself twice before leaving the frame -->
      <g fill="none" stroke="#8d8674" stroke-width="4.4" stroke-linecap="round">
        <path d="M28 28 q-8 22 6 36 q10 10 14 22"/>
        <path d="M66 24 q10 24 -4 40 q-10 10 -14 22"/>
        <path d="M48 96 q-26 22 -14 48 q12 26 44 20 q30 -6 22 -34 q-8 -26 -40 -18 q-30 8 -22 40 q8 30 34 44 q18 10 14 30"/>
      </g>
      <g fill="none" stroke="url(#dpCord)" stroke-width="3" stroke-linecap="round">
        <path d="M28 28 q-8 22 6 36 q10 10 14 22"/>
        <path d="M66 24 q10 24 -4 40 q-10 10 -14 22"/>
        <path d="M48 96 q-26 22 -14 48 q12 26 44 20 q30 -6 22 -34 q-8 -26 -40 -18 q-30 8 -22 40 q8 30 34 44 q18 10 14 30"/>
      </g>
      <!-- the splitter barrel where the two leads meet -->
      <rect x="42" y="88" width="12" height="18" rx="5" fill="#ddd6c4" stroke="#8d8674" stroke-width="0.9"/>
      <!-- the buds: a stem and the tip that goes in the ear -->
      <g stroke="#8d8674" stroke-width="0.9">
        <path d="M28 28 q-10 -8 -4 -16 q7 -9 16 -2 q8 7 0 15 q-6 6 -12 3 Z" fill="#e4dece"/>
        <path d="M66 24 q10 -9 4 -17 q-7 -8 -16 -1 q-8 7 0 15 q6 6 12 3 Z" fill="#e4dece"/>
      </g>
      <g fill="#ffffff" opacity="0.4">
        <ellipse cx="28" cy="12" rx="4" ry="2.6" transform="rotate(-20 28 12)"/>
        <ellipse cx="66" cy="10" rx="4" ry="2.6" transform="rotate(20 66 10)"/>
      </g>`,
  },
  {
    // A wooden ruler alongside the page. The most vertical object on the desk, so
    // it wants the tightest gutters. Boxwood with a brass edge, the graduations
    // worn away at the end that gets held.
    id: "ruler", w: 74, h: 420, narrow: true, maxRot: 5,
    svg: `
      <defs>
        <linearGradient id="dpBox" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#e9cf99"/><stop offset="0.35" stop-color="#dcbd7f"/>
          <stop offset="0.8" stop-color="#c9a463"/><stop offset="1" stop-color="#a8863f"/>
        </linearGradient>
      </defs>
      <rect x="18" y="6" width="40" height="408" rx="3" fill="url(#dpBox)" stroke="#94743a" stroke-width="1"/>
      <!-- the brass measuring edge down the left -->
      <rect x="18" y="6" width="5" height="408" fill="#c2a05c" stroke="#8f7233" stroke-width="0.7"/>
      <rect x="19" y="6" width="1.6" height="408" fill="#f0dda9" opacity="0.6"/>
      <!-- grain: two long figures running the length -->
      <g fill="none" stroke="#a8863f" stroke-width="0.8" opacity="0.35">
        <path d="M33 10 q4 100 -1 200 q-4 100 1 200"/>
        <path d="M46 12 q-3 90 2 190 q4 96 -2 208"/>
      </g>
      <!-- graduations: a long mark every centimetre, short between, fading out at
           the worn end -->
      <g stroke="#5f4a22" stroke-linecap="butt">
        <g stroke-width="1.1" opacity="0.7">
          <path d="M23 34 h16"/><path d="M23 60 h16"/><path d="M23 86 h16"/><path d="M23 112 h16"/>
          <path d="M23 138 h16"/><path d="M23 164 h16"/><path d="M23 190 h16"/><path d="M23 216 h16"/>
          <path d="M23 242 h16"/><path d="M23 268 h16"/><path d="M23 294 h16"/>
        </g>
        <g stroke-width="1.1" opacity="0.3">
          <path d="M23 320 h16"/><path d="M23 346 h16"/><path d="M23 372 h16"/>
        </g>
        <g stroke-width="0.8" opacity="0.45">
          <path d="M23 47 h9"/><path d="M23 73 h9"/><path d="M23 99 h9"/><path d="M23 125 h9"/>
          <path d="M23 151 h9"/><path d="M23 177 h9"/><path d="M23 203 h9"/><path d="M23 229 h9"/>
          <path d="M23 255 h9"/><path d="M23 281 h9"/>
        </g>
        <g stroke-width="0.8" opacity="0.2">
          <path d="M23 307 h9"/><path d="M23 333 h9"/><path d="M23 359 h9"/>
        </g>
      </g>
      <g class="dp-ruler-no" opacity="0.65">
        <text x="50" y="64">2</text><text x="50" y="116">4</text><text x="50" y="168">6</text>
        <text x="50" y="220">8</text><text x="50" y="272">10</text>
      </g>
      <rect x="18" y="6" width="40" height="408" rx="3" fill="none" stroke="#fff4d8" stroke-width="1" opacity="0.3"/>`,
  },
  {
    // A watch, unclasped and taken off: the case face up, the strap folded back
    // on itself the way a strap falls when it is not holding anything. Leather,
    // worn, on a small cream dial. No branding, no logo.
    id: "watch", w: 118, h: 178,
    svg: `
      <defs>
        <linearGradient id="dpLeather" x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0" stop-color="#8a5c39"/><stop offset="0.5" stop-color="#6e4529"/><stop offset="1" stop-color="#4e2f1b"/>
        </linearGradient>
        <linearGradient id="dpCase" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stop-color="#f0e2b8"/><stop offset="0.5" stop-color="#cfae68"/><stop offset="1" stop-color="#9c7c37"/>
        </linearGradient>
      </defs>
      <!-- the long half of the strap, curling away below -->
      <path d="M52 108 q6 34 -8 48 q-16 16 -30 4 q-12 -11 2 -22 q10 -8 22 -4"
            fill="none" stroke="url(#dpLeather)" stroke-width="17" stroke-linecap="round"/>
      <!-- stitching down the strap -->
      <path d="M52 110 q5 32 -8 45 q-14 14 -26 4" fill="none" stroke="#d8bd8e" stroke-width="0.9"
            stroke-dasharray="3 4" opacity="0.5" stroke-linecap="round"/>
      <!-- the short half, above, with the buckle -->
      <path d="M58 44 q4 -22 -6 -30" fill="none" stroke="url(#dpLeather)" stroke-width="16" stroke-linecap="round"/>
      <rect x="38" y="6" width="30" height="20" rx="4" fill="none" stroke="#b8963f" stroke-width="3.4"/>
      <path d="M53 16 h16" stroke="#b8963f" stroke-width="2.6" stroke-linecap="round"/>
      <!-- the case -->
      <circle cx="58" cy="76" r="30" fill="url(#dpCase)" stroke="#7d6127" stroke-width="1.2"/>
      <circle cx="58" cy="76" r="24" fill="#f6f0dd" stroke="#b39a5c" stroke-width="1"/>
      <!-- the crown -->
      <rect x="86" y="70" width="8" height="12" rx="2.4" fill="#c2a05c" stroke="#7d6127" stroke-width="0.8"/>
      <!-- dial: four index marks and the hands stopped at ten past ten, the angle
           every watch is photographed at because it is the one that reads calm -->
      <g stroke="#6d6047" stroke-width="1.6" stroke-linecap="round">
        <path d="M58 56 v5"/><path d="M78 76 h-5"/><path d="M58 96 v-5"/><path d="M38 76 h5"/>
      </g>
      <g stroke="#3f3a2e" stroke-linecap="round">
        <path d="M58 76 L45 66" stroke-width="2.2"/>
        <path d="M58 76 L70 62" stroke-width="1.8"/>
      </g>
      <circle cx="58" cy="76" r="2" fill="#3f3a2e"/>
      <!-- the glass: one straight highlight across the crystal -->
      <path d="M40 62 q14 -10 30 -4" fill="none" stroke="#ffffff" stroke-width="4" opacity="0.3" stroke-linecap="round"/>`,
  },
];

export const PROP_BY_ID = Object.fromEntries(DESK_PROPS.map((p) => [p.id, p]));
