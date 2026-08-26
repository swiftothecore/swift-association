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
// The material kit.
//
// One lamp, upper left, the same one the fixed props in index.html are lit by.
// Every prop below composes its defs out of these five helpers instead of
// inventing its own gradient, because nine objects each inventing their own
// light is exactly how a desk stops reading as one desk.
//
// Ids are passed in and prefixed per prop (dpStr..., dpLead...) so two props
// on the same page never collide. A helper emits one defs element and nothing
// else; the prop decides what to paint with it.
// ---------------------------------------------------------------------------

// A round section seen across its width: the lit edge, the body, the shade,
// and then the far rim picking the desk's bounce back up. That last stop is
// the whole trick. Without it a cylinder is a flat with stripes on it.
const bar = (id, [lit, body, shade, bounce], deg = 0) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0"
     gradientTransform="rotate(${deg} 0.5 0.5)">
     <stop offset="0" stop-color="${lit}"/><stop offset="0.34" stop-color="${body}"/>
     <stop offset="0.78" stop-color="${shade}"/><stop offset="1" stop-color="${bounce}"/>
   </linearGradient>`;

// Anything spherical or domed: a bead, a jack tip, a drop of glue. The light
// sits at 36/30 to match the loose beads the scatter deals, which are built
// from the same numbers in CSS (.bead-scatter.round in styles.css).
const dome = (id, hi, lo, deep) =>
  `<radialGradient id="${id}" cx="0.36" cy="0.30" r="0.78">
     <stop offset="0" stop-color="${hi}"/><stop offset="0.62" stop-color="${lo}"/>
     <stop offset="1" stop-color="${deep}"/>
   </radialGradient>`;

// A specular that runs the LENGTH of a thing and dies before either end, the
// way a lamp lies along a barrel. Paint it over a bar(), never instead of one.
const sheen = (id, tint = "#fff6d6", peak = 0.42) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0">
     <stop offset="0" stop-color="${tint}" stop-opacity="0"/>
     <stop offset="0.22" stop-color="${tint}" stop-opacity="${peak * 0.62}"/>
     <stop offset="0.5" stop-color="${tint}" stop-opacity="${peak}"/>
     <stop offset="0.82" stop-color="${tint}" stop-opacity="${peak * 0.4}"/>
     <stop offset="1" stop-color="${tint}" stop-opacity="0"/>
   </linearGradient>`;

// The one that does the most work: a small displacement that stops a drawn
// shape looking drawn. Proven on the marks. Keep the scale low on objects,
// where an edge that wanders too far stops reading as manufactured.
const rough = (id, freq, scale, seed) =>
  `<filter id="${id}" x="-14%" y="-14%" width="128%" height="128%">
     <feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="2" seed="${seed}" result="n"/>
     <feDisplacementMap in="SourceGraphic" in2="n" scale="${scale}" xChannelSelector="R" yChannelSelector="G"/>
   </filter>`;

// Surface noise for materials that are not smooth: paper fibre, leather, the
// matte of moulded rubber. Painted as a tinted overlay clipped to the shape.
const grain = (id, freq, seed, [r, g, b], alpha) =>
  `<filter id="${id}" x="0" y="0" width="100%" height="100%">
     <feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="3" seed="${seed}"/>
     <feColorMatrix type="matrix" values="0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${b}  0 0 0 ${alpha} 0"/>
   </filter>`;

// ---------------------------------------------------------------------------
// Tier 1: marks. Stains, dust, offcuts. Flat and stainless-of-shadow, because a
// mark IS the desk surface rather than a thing resting on it.
// ---------------------------------------------------------------------------

export const DESK_MARKS = [
  {
    // A full coffee ring. The thing that makes a real ring is that it is NOT a
    // stroked circle: the liquid pins at its edge and dries there, so the
    // deposit is a band of uneven width, fat on the side the film ran to last.
    // That comes from an annulus whose two boundaries do not share a centre,
    // roughed up by a displacement filter so no part of it is a clean curve.
    id: "ring-full", w: 190, h: 190,
    svg: `
      <defs>
        <filter id="dmRfEdge" x="-14%" y="-14%" width="128%" height="128%">
          <feTurbulence type="fractalNoise" baseFrequency="0.013 0.019" numOctaves="3" seed="9" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="9" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
        <!-- the tideline is blotchy where the grain drank unevenly -->
        <filter id="dmRfGrain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.13" numOctaves="3" seed="23"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.44  0 0 0 0 0.31  0 0 0 0 0.15  0 0 0 0.9 -0.34"/>
        </filter>
        <clipPath id="dmRfBand">
          <path fill-rule="evenodd" d="M95 12 a83 83 0 1 0 0.1 0 Z M97 20 a72.5 72.5 0 1 1 -0.1 0 Z"/>
        </clipPath>
      </defs>
      <g filter="url(#dmRfEdge)">
        <!-- the halo the film reached before the edge pinned, and the weak wash
             the middle dried to -->
        <circle cx="95" cy="95" r="86" fill="#8a6431" opacity="0.04"/>
        <circle cx="97" cy="92.5" r="72" fill="#8a6431" opacity="0.05"/>
        <path fill-rule="evenodd" fill="#7d5a2e" opacity="0.19"
              d="M95 12 a83 83 0 1 0 0.1 0 Z M97 20 a72.5 72.5 0 1 1 -0.1 0 Z"/>
        <g clip-path="url(#dmRfBand)">
          <rect x="0" y="0" width="190" height="190" filter="url(#dmRfGrain)" opacity="0.55"/>
        </g>
        <!-- the last of it, darkest along the low side where it drained -->
        <path d="M32 140 a83 83 0 0 0 104 18" fill="none" stroke="#6b4a24" stroke-width="6"
              opacity="0.13" stroke-linecap="round"/>
        <!-- an inner tideline: the film retreated once before it gave up -->
        <path d="M34 118 a66 66 0 0 0 74 40" fill="none" stroke="#7d5a2e" stroke-width="2.2"
              opacity="0.1" stroke-linecap="round"/>
        <!-- the mug was nudged a few mm before it was lifted, so one quadrant
             printed twice -->
        <path d="M168 74 a83 83 0 0 1 4 32" fill="none" stroke="#7d5a2e" stroke-width="3.4"
              opacity="0.09" stroke-linecap="round"/>
        <!-- two runs down the outside from the lift, and the pits where foam sat -->
        <path d="M150 152 q7 10 3 18" fill="none" stroke="#7d5a2e" stroke-width="2.6" opacity="0.12" stroke-linecap="round"/>
        <path d="M58 25 q-6 -7 -12 -8" fill="none" stroke="#7d5a2e" stroke-width="2" opacity="0.09" stroke-linecap="round"/>
        <g fill="#6b4a24" opacity="0.1">
          <circle cx="46" cy="132" r="2.6"/><circle cx="122" cy="164" r="1.8"/><circle cx="24" cy="88" r="1.4"/>
        </g>
      </g>`,
  },
  {
    // A half ring: the mug was lifted before the film closed, so only the arc it
    // sat longest on printed, and the end it was dragged off smears instead of
    // stopping. Same annulus trick as the full ring, cut to a sector.
    id: "ring-half", w: 170, h: 130,
    svg: `
      <defs>
        <filter id="dmRhEdge" x="-16%" y="-16%" width="132%" height="132%">
          <feTurbulence type="fractalNoise" baseFrequency="0.016 0.022" numOctaves="3" seed="31" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="8" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
        <filter id="dmRhGrain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.06 0.14" numOctaves="3" seed="12"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.44  0 0 0 0 0.31  0 0 0 0 0.15  0 0 0 0.9 -0.36"/>
        </filter>
        <clipPath id="dmRhBand">
          <path d="M17 46 A68 60 0 0 0 153 46 L144 43 A57 50 0 0 1 30 43 Z"/>
        </clipPath>
      </defs>
      <g filter="url(#dmRhEdge)">
        <path d="M17 46 A68 60 0 0 0 153 46 L144 43 A57 50 0 0 1 30 43 Z"
              fill="#7d5a2e" opacity="0.2"/>
        <g clip-path="url(#dmRhBand)">
          <rect x="0" y="0" width="170" height="130" filter="url(#dmRhGrain)" opacity="0.55"/>
        </g>
        <!-- the drag: the ring does not end, it is wiped sideways off its own edge -->
        <path d="M153 46 q10 -4 19 -14" fill="none" stroke="#7d5a2e" stroke-width="7"
              opacity="0.1" stroke-linecap="round"/>
        <path d="M150 38 q12 -3 20 -11" fill="none" stroke="#7d5a2e" stroke-width="3"
              opacity="0.07" stroke-linecap="round"/>
        <!-- and the other end simply thins out, still faintly closing the circle -->
        <path d="M17 46 q-2 -14 4 -24" fill="none" stroke="#7d5a2e" stroke-width="4"
              opacity="0.08" stroke-linecap="round"/>
        <path d="M26 20 q4 -6 9 -9" fill="none" stroke="#7d5a2e" stroke-width="2.4"
              opacity="0.05" stroke-linecap="round"/>
        <path d="M40 104 A68 60 0 0 0 120 100" fill="none" stroke="#6b4a24" stroke-width="4.4"
              opacity="0.1" stroke-linecap="round"/>
      </g>`,
  },
  {
    // Sharpener curls. A shaving is a ribbon cut off a spiral, not a flake: the
    // skirt widens as the blade works out of the wood, the graphite core leaves
    // a dark bite along the INNER edge, and the pencil is the hex yellow one on
    // the desk upstairs, so its lacquer prints as a thin yellow rim on the
    // outside of the curl. That rim is the detail that makes it read instantly.
    // Geometry from scripts/art/make_desk_marks.py.
    id: "shavings", w: 96, h: 76,
    svg: `
      <defs>
        <filter id="dmShEdge" x="-12%" y="-12%" width="124%" height="124%">
          <feTurbulence type="fractalNoise" baseFrequency="0.09 0.07" numOctaves="2" seed="14" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <g stroke-linejoin="round" stroke-linecap="round" filter="url(#dmShEdge)">
        <path d="M 47.5,46.2 46.8,48.7 44.6,49.9 42.2,50.4 40.3,52.1 38.0,53.4 35.5,52.5 33.2,51.6 30.5,51.7 27.9,50.8 26.6,48.4 25.3,46.2 23.0,44.5 21.9,41.9 22.6,39.2 22.8,36.6 22.3,33.6 23.3,31.0 25.8,29.3 27.5,27.2 29.2,24.6 31.9,23.5 34.9,23.8 37.7,23.2 40.8,22.4 43.6,23.7 45.8,25.8 L 42.0,31.4 40.5,30.9 38.9,30.7 37.4,30.7 35.9,31.0 34.6,31.6 33.4,32.4 32.4,33.3 31.7,34.4 31.2,35.6 30.9,36.8 30.8,37.9 31.0,39.1 31.4,40.1 31.9,41.0 32.5,41.7 33.3,42.3 34.1,42.7 35.0,43.0 35.8,43.0 36.6,42.9 37.2,42.7 37.8,42.3 38.3,41.9 38.7,41.4 38.9,40.9 39.0,40.4 Z" fill="#e2cc9e" stroke="#b6934f" stroke-width="0.6" opacity="0.95"/>
        <!-- the graphite the blade took with the wood, and the yellow lacquer off
             the barrel's outer skin. Both come away in bites, so both are broken:
             an unbroken ring of either turns the curl into a letter C. -->
        <path d="M 39.0,40.4 38.9,40.9 38.7,41.4 38.3,41.9 37.8,42.3 37.2,42.7 36.6,42.9 35.8,43.0 35.0,43.0 34.1,42.7 33.3,42.3 32.5,41.7 31.9,41.0 31.4,40.1 31.0,39.1 30.8,37.9 30.9,36.8 31.2,35.6 31.7,34.4 32.4,33.3 33.4,32.4 34.6,31.6 35.9,31.0 37.4,30.7 38.9,30.7 40.5,30.9 42.0,31.4" fill="none" stroke="#c2a165" stroke-width="3.2" opacity="0.28"
              stroke-dasharray="7 5 11 4 5 6"/>
        <path d="M 39.0,40.4 38.9,40.9 38.7,41.4 38.3,41.9 37.8,42.3 37.2,42.7 36.6,42.9 35.8,43.0 35.0,43.0 34.1,42.7 33.3,42.3 32.5,41.7 31.9,41.0 31.4,40.1 31.0,39.1 30.8,37.9 30.9,36.8 31.2,35.6 31.7,34.4 32.4,33.3 33.4,32.4 34.6,31.6 35.9,31.0 37.4,30.7 38.9,30.7 40.5,30.9 42.0,31.4" fill="none" stroke="#57534a" stroke-width="1.4" opacity="0.3"
              stroke-dasharray="4 12 6 9 3 14"/>
        <path d="M 47.5,46.2 46.8,48.7 44.6,49.9 42.2,50.4 40.3,52.1 38.0,53.4 35.5,52.5 33.2,51.6 30.5,51.7 27.9,50.8 26.6,48.4 25.3,46.2 23.0,44.5 21.9,41.9 22.6,39.2 22.8,36.6 22.3,33.6 23.3,31.0 25.8,29.3 27.5,27.2 29.2,24.6 31.9,23.5 34.9,23.8 37.7,23.2 40.8,22.4 43.6,23.7 45.8,25.8" fill="none" stroke="#d9a83f" stroke-width="1.2" opacity="0.46"
              stroke-dasharray="9 5 5 4 13 6"/>
        <!-- the grain of the wood, running across the cut -->
        <g fill="none" stroke="#c6a163" stroke-width="0.6" opacity="0.55">
          <path d="M23 30 q7 4 8 12"/><path d="M31 24 q6 5 6 13"/><path d="M43 51 q-6 3 -13 2"/>
          <path d="M27 47 q7 3 15 2"/>
        </g>
        <path d="M 76.7,64.8 74.9,64.2 73.2,64.1 71.3,64.5 69.5,63.8 68.6,62.1 67.2,60.9 65.4,59.9 64.8,58.0 65.1,56.0 64.6,54.2 64.1,52.1 65.1,50.3 66.6,49.0 67.4,47.1 68.5,45.2 70.6,44.6 72.6,44.5 74.5,43.4 76.7,42.9 78.7,44.0 80.5,45.1 82.8,45.6 L 79.4,49.6 78.3,49.1 77.1,48.8 75.9,48.7 74.8,48.9 73.7,49.3 72.8,49.8 72.0,50.4 71.4,51.2 70.9,52.1 70.6,52.9 70.5,53.8 70.6,54.7 70.8,55.4 71.2,56.1 71.6,56.7 72.2,57.1 72.8,57.5 73.4,57.6 73.9,57.7 74.5,57.6 75.0,57.5 75.4,57.2 Z" fill="#e9d5ac" stroke="#b6934f" stroke-width="0.55" opacity="0.94"/>
        <path d="M 75.4,57.2 75.0,57.5 74.5,57.6 73.9,57.7 73.4,57.6 72.8,57.5 72.2,57.1 71.6,56.7 71.2,56.1 70.8,55.4 70.6,54.7 70.5,53.8 70.6,52.9 70.9,52.1 71.4,51.2 72.0,50.4 72.8,49.8 73.7,49.3 74.8,48.9 75.9,48.7 77.1,48.8 78.3,49.1 79.4,49.6" fill="none" stroke="#c2a165" stroke-width="2.4" opacity="0.26"
              stroke-dasharray="6 4 9 5"/>
        <path d="M 75.4,57.2 75.0,57.5 74.5,57.6 73.9,57.7 73.4,57.6 72.8,57.5 72.2,57.1 71.6,56.7 71.2,56.1 70.8,55.4 70.6,54.7 70.5,53.8 70.6,52.9 70.9,52.1 71.4,51.2 72.0,50.4 72.8,49.8 73.7,49.3 74.8,48.9 75.9,48.7 77.1,48.8 78.3,49.1 79.4,49.6" fill="none" stroke="#57534a" stroke-width="1.1" opacity="0.26"
              stroke-dasharray="3 10 5 8"/>
        <path d="M 76.7,64.8 74.9,64.2 73.2,64.1 71.3,64.5 69.5,63.8 68.6,62.1 67.2,60.9 65.4,59.9 64.8,58.0 65.1,56.0 64.6,54.2 64.1,52.1 65.1,50.3 66.6,49.0 67.4,47.1 68.5,45.2 70.6,44.6 72.6,44.5 74.5,43.4 76.7,42.9 78.7,44.0 80.5,45.1 82.8,45.6" fill="none" stroke="#d9a83f" stroke-width="1" opacity="0.4"
              stroke-dasharray="7 4 4 3 10 5"/>
        <g fill="none" stroke="#c6a163" stroke-width="0.5" opacity="0.5">
          <path d="M64 50 q5 3 5 9"/><path d="M69 63 q-5 1 -8 -2"/>
        </g>
      </g>
      <!-- graphite dust, and one splinter too small to have curled -->
      <path d="M52 20 q6 -3 9 1 q1 3 -3 3 q-5 0 -6 -4 Z" fill="#e6ca94" stroke="#b6934f" stroke-width="0.5"/>
      <g fill="#5d5850">
        <circle cx="47" cy="60" r="1.3" opacity="0.4"/><circle cx="88" cy="34" r="1" opacity="0.34"/>
        <circle cx="31" cy="66" r="0.9" opacity="0.38"/><circle cx="84" cy="70" r="1.2" opacity="0.3"/>
        <circle cx="15" cy="52" r="0.8" opacity="0.32"/><circle cx="59" cy="38" r="0.7" opacity="0.36"/>
      </g>`,
  },
  {
    // Eraser crumbs, rolled off the page under a fingertip and swept aside. The
    // shape is the whole point: rubber comes off as blunt little sausages with
    // a bend in them, never as dots and never as slivers, and each one carries
    // the grey of the graphite it just lifted along one flank. Each is a
    // round-capped stroke rather than an outline, because that is exactly what
    // a rolled crumb is, with a darker stroke under it for the cut edge.
    id: "crumbs", w: 84, h: 58,
    svg: `
      <defs>
        <filter id="dmCrEdge" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.14 0.11" numOctaves="2" seed="27" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <g fill="none" stroke-linecap="round" opacity="0.8" filter="url(#dmCrEdge)">
        <g stroke="#b3a88e">
          <path d="M9 18 q10 5 21 3" stroke-width="7.4"/>
          <path d="M31 41 q6 -8 11 -13" stroke-width="6.2"/>
          <path d="M46 12 q4 6 6 13" stroke-width="5.4"/>
          <path d="M55 33 q10 3 19 -1" stroke-width="6.8"/>
          <path d="M22 48 q6 1 10 -1" stroke-width="4.6"/>
          <path d="M68 46 q4 -3 7 -3" stroke-width="3.4"/>
        </g>
        <g stroke="#ddd3bd">
          <path d="M9 18 q10 5 21 3" stroke-width="6.4"/>
          <path d="M31 41 q6 -8 11 -13" stroke-width="5.2"/>
          <path d="M46 12 q4 6 6 13" stroke-width="4.4"/>
          <path d="M55 33 q10 3 19 -1" stroke-width="5.8"/>
          <path d="M22 48 q6 1 10 -1" stroke-width="3.8"/>
          <path d="M68 46 q4 -3 7 -3" stroke-width="2.6"/>
        </g>
      </g>
      <!-- the graphite each one lifted, smeared along its own upper flank -->
      <g fill="none" stroke="#8d8578" stroke-width="1.7" stroke-linecap="round" opacity="0.24">
        <path d="M11 20 q9 4 18 2"/><path d="M32 42 q5 -7 9 -11"/>
        <path d="M56 35 q9 3 17 -1"/><path d="M23 49 q5 1 8 0"/>
      </g>
      <!-- and the dust that came off with them -->
      <g fill="#ded6c4" opacity="0.7">
        <circle cx="45" cy="47" r="1.3"/><circle cx="19" cy="38" r="1"/>
        <circle cx="72" cy="20" r="1.2"/><circle cx="30" cy="9" r="0.9"/>
        <circle cx="66" cy="50" r="0.8"/>
      </g>`,
  },
  {
    // An ink blot and the nib tests that followed it. Ink on bare oak does not
    // sit in a puddle: it soaks ALONG the grain, so the stain is a hard core
    // with a wide, weak halo stretched sideways and a few capillary whiskers
    // running out of it. The satellites are teardrops pointing away from the
    // core, because a drop that splashes throws its own shape outward.
    // Under multiply the navy loses most of its blue to the wood.
    id: "blot", w: 78, h: 62,
    svg: `
      <defs>
        <filter id="dmBlSoak" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.4 1.6"/>
        </filter>
        <filter id="dmBlEdge" x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence type="fractalNoise" baseFrequency="0.17 0.09" numOctaves="2" seed="6" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <ellipse cx="29" cy="30" rx="24" ry="8" fill="#1e2a41" opacity="0.14" filter="url(#dmBlSoak)"/>
      <g filter="url(#dmBlEdge)">
        <path d="M24 25 q3 -7 11 -6 q8 1 9 8 q0 3 -3 5 q-3 2 -7 1 q-2 3 -6 3
                 q-4 1 -6 -2 q-1 -2 2 -4 q2 -1 5 -1 q-3 -2 -5 -4 Z"
              fill="#1e2a41" opacity="0.38"/>
        <!-- the run: ink that found the grain and went with it -->
        <path d="M43 30 q8 0 12 2 q3 2 0 2.4 q-5 -0.6 -13 -1.4 Z" fill="#1e2a41" opacity="0.26"/>
        <!-- capillaries: the ink ran a few mm along the grain and stopped -->
        <g fill="none" stroke="#1e2a41" stroke-linecap="round">
          <path d="M48 26 q7 -1 11 -3" stroke-width="0.7" opacity="0.3"/>
          <path d="M13 34 q-6 1 -9 3" stroke-width="0.6" opacity="0.26"/>
          <path d="M46 36 q6 2 9 1" stroke-width="0.5" opacity="0.22"/>
        </g>
        <!-- satellites, each pulled out along the line it flew -->
        <g fill="#1e2a41">
          <ellipse cx="12" cy="12" rx="3" ry="1.7" transform="rotate(-34 12 12)" opacity="0.46"/>
          <ellipse cx="46" cy="9" rx="2.2" ry="1.1" transform="rotate(22 46 9)" opacity="0.4"/>
          <ellipse cx="15" cy="45" rx="2.4" ry="1.2" transform="rotate(28 15 45)" opacity="0.42"/>
          <ellipse cx="39" cy="48" rx="1.5" ry="0.9" transform="rotate(-18 39 48)" opacity="0.36"/>
          <circle cx="5" cy="24" r="0.9" opacity="0.3"/>
        </g>
      </g>
      <!-- nib tests: drawn as filled strokes so each pass swells on the pull and
           starves on the push, which a constant-width arc never does -->
      <g fill="#1e2a41">
        <path d="M57 38 q5 -3 9 -0.3 l0.25 0.7 q-4.2 -2.3 -8.7 0.5 Z" opacity="0.26"/>
        <path d="M56 45 q6 -3.6 11 -0.8 l0.5 1 q-5.4 -2.9 -10.8 0.7 Z" opacity="0.34"/>
        <path d="M55 52 q6.5 -4 12 -1 q3.2 1.9 5.8 0.6 l0.3 1.1 q-3.4 1.6 -6.8 -0.5
                 q-5 -3 -10.6 0.8 Z" opacity="0.44"/>
      </g>`,
  },
  {
    // Floss offcuts: the tag ends snipped off a finished bracelet. Six-ply
    // embroidery floss is TWISTED, so each snippet gets ticks laid across it at
    // the twist angle and a cut end where the plies spring apart. Without those
    // two things a coloured stroke on wood is just a pencil line. Short and fat
    // rather than long and thin, and four of them, because at desk scale a long
    // thin thread reads as a drawn line too. Ticks from make_desk_marks.py.
    id: "offcuts", w: 128, h: 82,
    svg: `
      <g fill="none" stroke-linecap="round">
        <g stroke-width="5" opacity="0.28" stroke="#4a3a22">
          <path d="M14 26 q16 -12 30 -2 q7 5 13 1"/>
          <path d="M24 56 q18 9 34 -1"/>
          <path d="M64 68 q16 -11 32 -2"/>
          <path d="M74 34 q15 10 30 1 q7 -4 13 1"/>
        </g>
        <g stroke-width="3.6">
          <path d="M14 26 q16 -12 30 -2 q7 5 13 1" stroke="#c79a3e"/>
          <path d="M24 56 q18 9 34 -1" stroke="#c06880"/>
          <path d="M64 68 q16 -11 32 -2" stroke="#6c8cb4"/>
          <path d="M74 34 q15 10 30 1 q7 -4 13 1" stroke="#5a9e6e"/>
        </g>
        <!-- the twist. The ticks stay INSIDE the cord: a tick that overshoots
             the edge stops reading as a ply and starts reading as a bristle. -->
        <g stroke-width="0.9" opacity="0.38">
          <path d="M13.5 25.0L17.2 25.1M16.3 23.1L20.0 23.6M19.3 21.6L22.9 22.4M22.5 20.3L26.0 21.6M25.9 19.4L29.2 21.0M29.4 18.9L32.6 20.8M33.1 18.6L36.0 20.9M36.9 18.8L39.7 21.2M40.9 19.2L43.5 21.9M45.0 20.0L47.4 22.8M49.3 21.1L51.5 24.1M53.7 22.6L55.8 25.7" stroke="#8a6a24"/>
          <path d="M24.6 55.1L26.2 58.5M27.3 56.6L29.2 59.8M30.0 57.8L32.2 60.7M32.7 58.7L35.1 61.4M35.4 59.3L38.1 61.8M38.1 59.6L41.1 61.9M40.8 59.7L44.0 61.6M43.6 59.5L46.9 61.1M46.3 59.0L49.8 60.2M49.1 58.2L52.7 59.1M51.9 57.1L55.6 57.7M54.7 55.7L58.4 56.0" stroke="#8f4459"/>
          <path d="M63.5 67.0L67.2 67.2M66.2 65.3L69.8 65.8M68.9 63.9L72.5 64.7M71.6 62.7L75.1 63.8M74.3 61.8L77.7 63.3M77.0 61.2L80.3 63.0M79.8 60.9L82.9 63.0M82.6 60.9L85.4 63.3M85.4 61.1L87.9 63.8M88.2 61.7L90.5 64.6M91.0 62.5L93.0 65.6M93.8 63.6L95.5 66.9" stroke="#46618c"/>
          <path d="M74.5 33.1L76.0 36.5M77.0 34.6L78.9 37.8M79.8 35.9L81.9 38.9M82.7 36.9L85.1 39.7M85.8 37.7L88.4 40.3M89.1 38.2L91.9 40.6M92.6 38.5L95.6 40.6M96.3 38.5L99.4 40.5M100.2 38.2L103.4 40.0M104.2 37.7L107.6 39.4M108.5 37.0L111.9 38.4M113.0 36.0L116.4 37.3" stroke="#3a7350"/>
        </g>
        <g stroke-width="0.8" opacity="0.4" stroke="#fff3d8">
          <path d="M16 24 q14 -10 27 -1"/><path d="M26 54 q16 8 31 -1"/>
          <path d="M66 66 q14 -9 28 -2"/><path d="M76 32 q13 9 27 1"/>
        </g>
      </g>
      <!-- cut ends: the plies spring apart the moment the scissors go through -->
      <g fill="none" stroke-width="0.9" stroke-linecap="round" opacity="0.7">
        <path d="M57 25 l4 -2.5 M57 25 l4.6 0 M57 25 l3.4 2.6" stroke="#c79a3e"/>
        <path d="M14 26 l-4 -2.4 M14 26 l-4.6 0.6 M14 26 l-3.4 2.6" stroke="#c79a3e"/>
        <path d="M117 36 l4 -1.8 M117 36 l4 1.4 M117 36 l2.8 2.6" stroke="#5a9e6e"/>
        <path d="M74 34 l-3.4 -2.4 M74 34 l-4 0.8" stroke="#5a9e6e"/>
        <path d="M96 66 l4 -1.4 M96 66 l3.4 2 M96 66 l2.4 3" stroke="#6c8cb4"/>
        <path d="M58 55 l3.4 -2 M58 55 l3.4 2" stroke="#c06880"/>
        <path d="M24 56 l-3.4 -2.4 M24 56 l-3.4 1.4" stroke="#c06880"/>
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
        <!-- bone, and the three colour beads. All lit at 36/30, the same
             numbers the loose beads use in CSS, so a bracelet lying beside a
             spill is lit by the one lamp. -->
        <radialGradient id="dpBrBone" cx="0.36" cy="0.30" r="0.78"><stop offset="0" stop-color="#fdfbf4"/><stop offset="0.62" stop-color="#f0ebdd"/><stop offset="1" stop-color="#d5cdb9"/></radialGradient>
        <radialGradient id="dpBr2" cx="0.36" cy="0.30" r="0.78"><stop offset="0" stop-color="#f4c9d3"/><stop offset="0.62" stop-color="#dc93a6"/><stop offset="1" stop-color="#b7677f"/></radialGradient>
        <radialGradient id="dpBr7" cx="0.36" cy="0.30" r="0.78"><stop offset="0" stop-color="#cadcee"/><stop offset="0.62" stop-color="#93b0cd"/><stop offset="1" stop-color="#6486ac"/></radialGradient>
        <radialGradient id="dpBr11" cx="0.36" cy="0.30" r="0.78"><stop offset="0" stop-color="#f7e5b4"/><stop offset="0.62" stop-color="#dfbc6f"/><stop offset="1" stop-color="#b6912f"/></radialGradient>
      </defs>
      <!-- The elastic first. It only ever shows where the beads have slid away
           from each other, which is why they are laid round the loop unevenly
           (make_desk_props.py) instead of on a clock face. -->
      <g fill="none" stroke-linecap="round">
        <path d="M146.3 43.7 C161.4 62.8 158.4 57.9 158.0 79.3 C157.6 100.7 157.4 95.3 145.0 110.5 C132.7 125.6 135.6 119.0 119.4 126.7 C103.2 134.3 109.1 132.0 94.4 134.4 C79.6 136.7 87.1 135.4 73.3 134.1 C59.4 132.8 62.6 134.4 51.1 130.4 C39.6 126.3 46.1 130.4 37.3 121.5 C28.5 112.5 31.6 118.2 23.7 102.5 C15.8 86.9 10.9 92.5 12.6 72.6 C14.2 52.7 11.4 58.7 28.9 40.5 C46.3 22.3 40.8 22.4 67.0 15.6 C93.2 8.9 85.5 10.5 110.8 19.4 C136.2 28.4 131.2 24.5 146.3 43.7 Z" stroke="#b9a982" stroke-width="3.4"/>
        <path d="M146.3 43.7 C161.4 62.8 158.4 57.9 158.0 79.3 C157.6 100.7 157.4 95.3 145.0 110.5 C132.7 125.6 135.6 119.0 119.4 126.7 C103.2 134.3 109.1 132.0 94.4 134.4 C79.6 136.7 87.1 135.4 73.3 134.1 C59.4 132.8 62.6 134.4 51.1 130.4 C39.6 126.3 46.1 130.4 37.3 121.5 C28.5 112.5 31.6 118.2 23.7 102.5 C15.8 86.9 10.9 92.5 12.6 72.6 C14.2 52.7 11.4 58.7 28.9 40.5 C46.3 22.3 40.8 22.4 67.0 15.6 C93.2 8.9 85.5 10.5 110.8 19.4 C136.2 28.4 131.2 24.5 146.3 43.7 Z" stroke="#e0d3b2" stroke-width="2.2"/>
        <path d="M146.3 43.7 C161.4 62.8 158.4 57.9 158.0 79.3 C157.6 100.7 157.4 95.3 145.0 110.5 C132.7 125.6 135.6 119.0 119.4 126.7 C103.2 134.3 109.1 132.0 94.4 134.4 C79.6 136.7 87.1 135.4 73.3 134.1 C59.4 132.8 62.6 134.4 51.1 130.4 C39.6 126.3 46.1 130.4 37.3 121.5 C28.5 112.5 31.6 118.2 23.7 102.5 C15.8 86.9 10.9 92.5 12.6 72.6 C14.2 52.7 11.4 58.7 28.9 40.5 C46.3 22.3 40.8 22.4 67.0 15.6 C93.2 8.9 85.5 10.5 110.8 19.4 C136.2 28.4 131.2 24.5 146.3 43.7 Z" stroke="#f6efd9" stroke-width="0.9" opacity="0.7" transform="translate(-0.5 -0.8)"/>
      </g>
      <g fill="#46320e" opacity="0.18">
        <ellipse cx="147.9" cy="46.3" rx="11.6" ry="10.4"/><ellipse cx="159.6" cy="81.9" rx="11.0" ry="9.8"/><ellipse cx="146.6" cy="113.1" rx="11.0" ry="9.8"/><ellipse cx="121.0" cy="129.3" rx="11.6" ry="10.4"/><ellipse cx="96.0" cy="137.0" rx="11.0" ry="9.8"/><ellipse cx="74.9" cy="136.7" rx="11.0" ry="9.8"/><ellipse cx="52.7" cy="133.0" rx="11.6" ry="10.4"/><ellipse cx="38.9" cy="124.1" rx="11.0" ry="9.8"/><ellipse cx="25.3" cy="105.1" rx="11.0" ry="9.8"/><ellipse cx="14.2" cy="75.2" rx="11.6" ry="10.4"/><ellipse cx="30.5" cy="43.1" rx="11.0" ry="9.8"/><ellipse cx="68.6" cy="18.2" rx="11.0" ry="9.8"/><ellipse cx="112.4" cy="22.0" rx="11.6" ry="10.4"/>
      </g>
      <g>
        <g><circle cx="146.3" cy="43.7" r="12.0" fill="url(#dpBrBone)" stroke="#bdb49e" stroke-width="0.85"/><path d="M135.3 44.1A11.0 11.0 0 0 1 155.5 37.6" fill="none" stroke="#4a3418" stroke-width="1.9" opacity="0.17"/><path d="M156.9 45.3A10.7 10.7 0 0 1 141.8 53.4" fill="none" stroke="#ffffff" stroke-width="1.6" opacity="0.26"/><circle cx="146.3" cy="43.7" r="10.7" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.32"/><circle cx="142.7" cy="39.4" r="1.9" fill="#ffffff" opacity="0.62"/></g><g><circle cx="158.0" cy="79.3" r="11.4" fill="url(#dpBrBone)" stroke="#bdb49e" stroke-width="0.85"/><path d="M147.6 79.8A10.4 10.4 0 0 1 166.7 73.6" fill="none" stroke="#4a3418" stroke-width="1.9" opacity="0.17"/><path d="M168.0 80.8A10.1 10.1 0 0 1 153.8 88.5" fill="none" stroke="#ffffff" stroke-width="1.6" opacity="0.26"/><circle cx="158.0" cy="79.3" r="10.1" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.32"/><circle cx="154.6" cy="75.2" r="1.8" fill="#ffffff" opacity="0.62"/></g><g><circle cx="145.0" cy="110.5" r="11.4" fill="url(#dpBr2)" stroke="#964962" stroke-width="0.85"/><path d="M134.6 110.9A10.4 10.4 0 0 1 153.7 104.8" fill="none" stroke="#4a3418" stroke-width="1.9" opacity="0.17"/><path d="M155.0 112.0A10.1 10.1 0 0 1 140.8 119.7" fill="none" stroke="#ffffff" stroke-width="1.6" opacity="0.26"/><circle cx="145.0" cy="110.5" r="10.1" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.32"/><circle cx="141.6" cy="106.4" r="1.8" fill="#ffffff" opacity="0.62"/></g><g><circle cx="119.4" cy="126.7" r="12.0" fill="url(#dpBrBone)" stroke="#bdb49e" stroke-width="0.85"/><path d="M108.4 127.1A11.0 11.0 0 0 1 128.6 120.6" fill="none" stroke="#4a3418" stroke-width="1.9" opacity="0.17"/><path d="M130.0 128.3A10.7 10.7 0 0 1 114.9 136.4" fill="none" stroke="#ffffff" stroke-width="1.6" opacity="0.26"/><circle cx="119.4" cy="126.7" r="10.7" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.32"/><circle cx="115.8" cy="122.4" r="1.9" fill="#ffffff" opacity="0.62"/></g><g><circle cx="94.4" cy="134.4" r="11.4" fill="url(#dpBrBone)" stroke="#bdb49e" stroke-width="0.85"/><path d="M84.0 134.8A10.4 10.4 0 0 1 103.1 128.6" fill="none" stroke="#4a3418" stroke-width="1.9" opacity="0.17"/><path d="M104.4 135.9A10.1 10.1 0 0 1 90.2 143.6" fill="none" stroke="#ffffff" stroke-width="1.6" opacity="0.26"/><circle cx="94.4" cy="134.4" r="10.1" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.32"/><circle cx="91.0" cy="130.3" r="1.8" fill="#ffffff" opacity="0.62"/></g><g><circle cx="73.3" cy="134.1" r="11.4" fill="url(#dpBrBone)" stroke="#bdb49e" stroke-width="0.85"/><path d="M62.9 134.5A10.4 10.4 0 0 1 81.9 128.4" fill="none" stroke="#4a3418" stroke-width="1.9" opacity="0.17"/><path d="M83.2 135.6A10.1 10.1 0 0 1 69.1 143.3" fill="none" stroke="#ffffff" stroke-width="1.6" opacity="0.26"/><circle cx="73.3" cy="134.1" r="10.1" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.32"/><circle cx="69.8" cy="130.0" r="1.8" fill="#ffffff" opacity="0.62"/></g><g><circle cx="51.1" cy="130.4" r="12.0" fill="url(#dpBrBone)" stroke="#bdb49e" stroke-width="0.85"/><path d="M40.1 130.8A11.0 11.0 0 0 1 60.3 124.3" fill="none" stroke="#4a3418" stroke-width="1.9" opacity="0.17"/><path d="M61.7 132.0A10.7 10.7 0 0 1 46.7 140.1" fill="none" stroke="#ffffff" stroke-width="1.6" opacity="0.26"/><circle cx="51.1" cy="130.4" r="10.7" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.32"/><circle cx="47.5" cy="126.1" r="1.9" fill="#ffffff" opacity="0.62"/></g><g><circle cx="37.3" cy="121.5" r="11.4" fill="url(#dpBr7)" stroke="#4c6b91" stroke-width="0.85"/><path d="M26.9 121.9A10.4 10.4 0 0 1 46.0 115.7" fill="none" stroke="#4a3418" stroke-width="1.9" opacity="0.17"/><path d="M47.3 123.0A10.1 10.1 0 0 1 33.1 130.6" fill="none" stroke="#ffffff" stroke-width="1.6" opacity="0.26"/><circle cx="37.3" cy="121.5" r="10.1" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.32"/><circle cx="33.9" cy="117.4" r="1.8" fill="#ffffff" opacity="0.62"/></g><g><circle cx="23.7" cy="102.5" r="11.4" fill="url(#dpBrBone)" stroke="#bdb49e" stroke-width="0.85"/><path d="M13.3 103.0A10.4 10.4 0 0 1 32.4 96.8" fill="none" stroke="#4a3418" stroke-width="1.9" opacity="0.17"/><path d="M33.7 104.0A10.1 10.1 0 0 1 19.5 111.7" fill="none" stroke="#ffffff" stroke-width="1.6" opacity="0.26"/><circle cx="23.7" cy="102.5" r="10.1" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.32"/><circle cx="20.3" cy="98.4" r="1.8" fill="#ffffff" opacity="0.62"/></g><g><circle cx="12.6" cy="72.6" r="12.0" fill="url(#dpBrBone)" stroke="#bdb49e" stroke-width="0.85"/><path d="M1.6 73.1A11.0 11.0 0 0 1 21.7 66.5" fill="none" stroke="#4a3418" stroke-width="1.9" opacity="0.17"/><path d="M23.1 74.2A10.7 10.7 0 0 1 8.1 82.3" fill="none" stroke="#ffffff" stroke-width="1.6" opacity="0.26"/><circle cx="12.6" cy="72.6" r="10.7" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.32"/><circle cx="9.0" cy="68.3" r="1.9" fill="#ffffff" opacity="0.62"/></g><g><circle cx="28.9" cy="40.5" r="11.4" fill="url(#dpBrBone)" stroke="#bdb49e" stroke-width="0.85"/><path d="M18.5 40.9A10.4 10.4 0 0 1 37.5 34.8" fill="none" stroke="#4a3418" stroke-width="1.9" opacity="0.17"/><path d="M38.8 42.0A10.1 10.1 0 0 1 24.7 49.7" fill="none" stroke="#ffffff" stroke-width="1.6" opacity="0.26"/><circle cx="28.9" cy="40.5" r="10.1" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.32"/><circle cx="25.4" cy="36.4" r="1.8" fill="#ffffff" opacity="0.62"/></g><g><circle cx="67.0" cy="15.6" r="11.4" fill="url(#dpBr11)" stroke="#9c7527" stroke-width="0.85"/><path d="M56.6 16.1A10.4 10.4 0 0 1 75.7 9.9" fill="none" stroke="#4a3418" stroke-width="1.9" opacity="0.17"/><path d="M77.0 17.1A10.1 10.1 0 0 1 62.8 24.8" fill="none" stroke="#ffffff" stroke-width="1.6" opacity="0.26"/><circle cx="67.0" cy="15.6" r="10.1" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.32"/><circle cx="63.6" cy="11.5" r="1.8" fill="#ffffff" opacity="0.62"/></g><g><circle cx="110.8" cy="19.4" r="12.0" fill="url(#dpBrBone)" stroke="#bdb49e" stroke-width="0.85"/><path d="M99.9 19.9A11.0 11.0 0 0 1 120.0 13.4" fill="none" stroke="#4a3418" stroke-width="1.9" opacity="0.17"/><path d="M121.4 21.0A10.7 10.7 0 0 1 106.4 29.2" fill="none" stroke="#ffffff" stroke-width="1.6" opacity="0.26"/><circle cx="110.8" cy="19.4" r="10.7" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.32"/><circle cx="107.2" cy="15.1" r="1.9" fill="#ffffff" opacity="0.62"/></g>
      </g>
      <g class="dp-bead-letter">
        <text x="146.3" y="43.7" transform="rotate(-45 146.3 43.7)">L</text><text x="158.0" y="79.3" transform="rotate(23 158.0 79.3)">U</text><text x="119.4" y="126.7" transform="rotate(80 119.4 126.7)">C</text><text x="94.4" y="134.4" transform="rotate(70 94.4 134.4)">K</text><text x="73.3" y="134.1" transform="rotate(119 73.3 134.1)">Y</text><text x="51.1" y="130.4" transform="rotate(105 51.1 130.4)">O</text><text x="23.7" y="102.5" transform="rotate(139 23.7 102.5)">N</text><text x="12.6" y="72.6" transform="rotate(201 12.6 72.6)">E</text><text x="28.9" y="40.5" transform="rotate(202 28.9 40.5)">S</text><text x="110.8" y="19.4" transform="rotate(278 110.8 19.4)">S</text>
      </g>
`,
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
      <!-- Three turns of waxed cotton cord, dropped as one loose hank. The
           turns run back to front and then the back one is brought over the
           front one at the crossing: without that this is three concentric
           ellipses, which is exactly what it used to be. The cord is twisted,
           so its ridges catch the light in short dashes down its length. -->
      <g>
        <path d="M130.8 56.1 C129.5 65.3 129.6 61.6 125.9 69.8 C122.2 78.0 124.0 74.3 119.3 81.8 C114.5 89.2 117.2 85.8 111.1 93.0 C105.0 100.2 108.7 97.9 100.2 104.3 C91.7 110.6 95.5 108.9 84.5 112.8 C73.5 116.7 77.5 116.1 65.9 116.3 C54.3 116.5 58.8 116.4 48.2 113.4 C37.7 110.5 41.4 112.4 32.8 107.1 C24.3 101.9 27.4 104.3 21.5 97.1 C15.6 89.9 16.3 93.2 14.4 84.6 C12.6 76.0 12.4 78.9 15.8 70.2 C19.2 61.5 18.4 64.8 25.0 57.3 C31.6 49.7 28.4 52.6 36.4 46.7 C44.4 40.7 41.0 43.5 50.0 38.6 C59.0 33.8 54.4 35.8 64.6 31.5 C74.8 27.1 70.0 27.6 81.9 25.1 C93.7 22.6 89.6 22.3 101.5 23.6 C113.5 24.9 110.1 23.6 119.2 29.2 C128.3 34.8 126.3 32.5 130.0 41.1 C133.7 49.7 132.1 46.9 130.8 56.1 Z" fill="none" stroke="#8a7140" stroke-width="5.6" stroke-linecap="round"/><path d="M130.8 56.1 C129.5 65.3 129.6 61.6 125.9 69.8 C122.2 78.0 124.0 74.3 119.3 81.8 C114.5 89.2 117.2 85.8 111.1 93.0 C105.0 100.2 108.7 97.9 100.2 104.3 C91.7 110.6 95.5 108.9 84.5 112.8 C73.5 116.7 77.5 116.1 65.9 116.3 C54.3 116.5 58.8 116.4 48.2 113.4 C37.7 110.5 41.4 112.4 32.8 107.1 C24.3 101.9 27.4 104.3 21.5 97.1 C15.6 89.9 16.3 93.2 14.4 84.6 C12.6 76.0 12.4 78.9 15.8 70.2 C19.2 61.5 18.4 64.8 25.0 57.3 C31.6 49.7 28.4 52.6 36.4 46.7 C44.4 40.7 41.0 43.5 50.0 38.6 C59.0 33.8 54.4 35.8 64.6 31.5 C74.8 27.1 70.0 27.6 81.9 25.1 C93.7 22.6 89.6 22.3 101.5 23.6 C113.5 24.9 110.1 23.6 119.2 29.2 C128.3 34.8 126.3 32.5 130.0 41.1 C133.7 49.7 132.1 46.9 130.8 56.1 Z" fill="none" stroke="#d2ba8a" stroke-width="3.9" stroke-linecap="round"/><path d="M132.5 54.9L129.1 57.3M113.1 92.6L109.0 93.4M67.4 117.8L64.4 114.9M21.4 99.2L21.7 95.0M22.9 57.6L27.1 57.0M62.5 30.9L66.6 32.0M119.0 27.1L119.5 31.3" fill="none" stroke="#6f5b2e" stroke-width="0.9" opacity="0.3" stroke-linecap="round"/><path d="M130.8 56.1 C129.5 65.3 129.6 61.6 125.9 69.8 C122.2 78.0 124.0 74.3 119.3 81.8 C114.5 89.2 117.2 85.8 111.1 93.0 C105.0 100.2 108.7 97.9 100.2 104.3 C91.7 110.6 95.5 108.9 84.5 112.8 C73.5 116.7 77.5 116.1 65.9 116.3 C54.3 116.5 58.8 116.4 48.2 113.4 C37.7 110.5 41.4 112.4 32.8 107.1 C24.3 101.9 27.4 104.3 21.5 97.1 C15.6 89.9 16.3 93.2 14.4 84.6 C12.6 76.0 12.4 78.9 15.8 70.2 C19.2 61.5 18.4 64.8 25.0 57.3 C31.6 49.7 28.4 52.6 36.4 46.7 C44.4 40.7 41.0 43.5 50.0 38.6 C59.0 33.8 54.4 35.8 64.6 31.5 C74.8 27.1 70.0 27.6 81.9 25.1 C93.7 22.6 89.6 22.3 101.5 23.6 C113.5 24.9 110.1 23.6 119.2 29.2 C128.3 34.8 126.3 32.5 130.0 41.1 C133.7 49.7 132.1 46.9 130.8 56.1 Z" fill="none" stroke="#f4e8c9" stroke-width="1.2" opacity="0.6" stroke-linecap="round" transform="translate(-0.6 -0.9)"/>
        <path d="M125.9 97.1 C124.1 105.6 125.7 103.4 118.6 109.2 C111.6 115.0 114.0 113.4 103.9 115.2 C93.7 117.0 97.1 116.3 86.9 114.8 C76.6 113.3 80.8 113.2 71.7 110.5 C62.6 107.9 67.1 109.3 58.5 106.5 C50.0 103.7 54.1 105.6 45.0 101.9 C35.8 98.2 38.4 100.9 30.0 94.9 C21.5 88.9 23.6 91.4 18.6 83.2 C13.6 75.0 14.6 77.8 14.4 69.2 C14.2 60.7 14.1 63.7 18.0 56.4 C22.0 49.1 20.3 52.1 26.8 46.5 C33.2 40.9 29.8 42.4 38.0 38.9 C46.2 35.4 42.8 36.4 52.4 35.5 C62.0 34.7 58.3 34.4 68.1 36.4 C77.8 38.3 74.3 37.2 82.9 41.6 C91.5 46.1 87.7 44.6 94.9 50.2 C102.1 55.9 98.8 53.0 105.5 59.2 C112.2 65.4 109.9 62.1 115.9 69.6 C122.0 77.1 121.3 73.8 124.5 82.6 C127.7 91.4 127.8 88.6 125.9 97.1 Z" fill="none" stroke="#8a7140" stroke-width="5.8" stroke-linecap="round"/><path d="M125.9 97.1 C124.1 105.6 125.7 103.4 118.6 109.2 C111.6 115.0 114.0 113.4 103.9 115.2 C93.7 117.0 97.1 116.3 86.9 114.8 C76.6 113.3 80.8 113.2 71.7 110.5 C62.6 107.9 67.1 109.3 58.5 106.5 C50.0 103.7 54.1 105.6 45.0 101.9 C35.8 98.2 38.4 100.9 30.0 94.9 C21.5 88.9 23.6 91.4 18.6 83.2 C13.6 75.0 14.6 77.8 14.4 69.2 C14.2 60.7 14.1 63.7 18.0 56.4 C22.0 49.1 20.3 52.1 26.8 46.5 C33.2 40.9 29.8 42.4 38.0 38.9 C46.2 35.4 42.8 36.4 52.4 35.5 C62.0 34.7 58.3 34.4 68.1 36.4 C77.8 38.3 74.3 37.2 82.9 41.6 C91.5 46.1 87.7 44.6 94.9 50.2 C102.1 55.9 98.8 53.0 105.5 59.2 C112.2 65.4 109.9 62.1 115.9 69.6 C122.0 77.1 121.3 73.8 124.5 82.6 C127.7 91.4 127.8 88.6 125.9 97.1 Z" fill="none" stroke="#d2ba8a" stroke-width="4.1" stroke-linecap="round"/><path d="M127.9 96.1L123.9 98.0M88.3 116.5L85.4 113.1M46.1 103.8L43.9 100.0M12.7 70.7L16.1 67.8M36.0 38.2L40.1 39.7M82.2 39.6L83.7 43.7M116.0 67.4L115.9 71.8" fill="none" stroke="#6f5b2e" stroke-width="0.9" opacity="0.3" stroke-linecap="round"/><path d="M125.9 97.1 C124.1 105.6 125.7 103.4 118.6 109.2 C111.6 115.0 114.0 113.4 103.9 115.2 C93.7 117.0 97.1 116.3 86.9 114.8 C76.6 113.3 80.8 113.2 71.7 110.5 C62.6 107.9 67.1 109.3 58.5 106.5 C50.0 103.7 54.1 105.6 45.0 101.9 C35.8 98.2 38.4 100.9 30.0 94.9 C21.5 88.9 23.6 91.4 18.6 83.2 C13.6 75.0 14.6 77.8 14.4 69.2 C14.2 60.7 14.1 63.7 18.0 56.4 C22.0 49.1 20.3 52.1 26.8 46.5 C33.2 40.9 29.8 42.4 38.0 38.9 C46.2 35.4 42.8 36.4 52.4 35.5 C62.0 34.7 58.3 34.4 68.1 36.4 C77.8 38.3 74.3 37.2 82.9 41.6 C91.5 46.1 87.7 44.6 94.9 50.2 C102.1 55.9 98.8 53.0 105.5 59.2 C112.2 65.4 109.9 62.1 115.9 69.6 C122.0 77.1 121.3 73.8 124.5 82.6 C127.7 91.4 127.8 88.6 125.9 97.1 Z" fill="none" stroke="#f4e8c9" stroke-width="1.3" opacity="0.6" stroke-linecap="round" transform="translate(-0.6 -0.9)"/>
        <path d="M129.1 68.1 C126.2 75.3 125.9 72.7 120.1 78.3 C114.3 84.0 116.5 81.2 111.0 85.7 C105.5 90.1 108.5 88.1 103.0 92.2 C97.5 96.3 100.5 94.2 93.9 98.6 C87.2 102.9 90.8 102.6 82.1 105.7 C73.4 108.8 76.2 108.8 66.6 108.2 C57.0 107.6 60.0 108.0 52.0 103.8 C44.0 99.6 46.5 101.4 41.6 95.2 C36.6 89.0 38.2 91.4 36.5 84.5 C34.7 77.6 35.6 80.4 36.1 73.6 C36.6 66.9 35.3 69.5 38.1 63.3 C40.8 57.1 39.5 59.5 44.7 54.3 C49.8 49.1 47.3 50.7 54.0 47.0 C60.8 43.3 58.0 45.0 65.7 42.7 C73.5 40.3 69.8 41.2 78.1 39.8 C86.5 38.3 82.7 38.2 91.9 38.1 C101.0 38.1 97.4 37.4 106.7 39.6 C116.1 41.8 114.0 39.9 121.1 45.1 C128.3 50.3 126.5 48.4 129.1 55.8 C131.6 63.1 132.0 60.8 129.1 68.1 Z" fill="none" stroke="#8a7140" stroke-width="6.0" stroke-linecap="round"/><path d="M129.1 68.1 C126.2 75.3 125.9 72.7 120.1 78.3 C114.3 84.0 116.5 81.2 111.0 85.7 C105.5 90.1 108.5 88.1 103.0 92.2 C97.5 96.3 100.5 94.2 93.9 98.6 C87.2 102.9 90.8 102.6 82.1 105.7 C73.4 108.8 76.2 108.8 66.6 108.2 C57.0 107.6 60.0 108.0 52.0 103.8 C44.0 99.6 46.5 101.4 41.6 95.2 C36.6 89.0 38.2 91.4 36.5 84.5 C34.7 77.6 35.6 80.4 36.1 73.6 C36.6 66.9 35.3 69.5 38.1 63.3 C40.8 57.1 39.5 59.5 44.7 54.3 C49.8 49.1 47.3 50.7 54.0 47.0 C60.8 43.3 58.0 45.0 65.7 42.7 C73.5 40.3 69.8 41.2 78.1 39.8 C86.5 38.3 82.7 38.2 91.9 38.1 C101.0 38.1 97.4 37.4 106.7 39.6 C116.1 41.8 114.0 39.9 121.1 45.1 C128.3 50.3 126.5 48.4 129.1 55.8 C131.6 63.1 132.0 60.8 129.1 68.1 Z" fill="none" stroke="#d2ba8a" stroke-width="4.2" stroke-linecap="round"/><path d="M131.3 67.5L126.9 68.6M105.3 92.2L100.7 92.2M68.0 110.0L65.1 106.4M35.2 86.4L37.7 82.6M42.4 54.4L46.9 54.1M76.1 38.7L80.2 40.8M121.0 42.8L121.2 47.4" fill="none" stroke="#6f5b2e" stroke-width="0.9" opacity="0.3" stroke-linecap="round"/><path d="M129.1 68.1 C126.2 75.3 125.9 72.7 120.1 78.3 C114.3 84.0 116.5 81.2 111.0 85.7 C105.5 90.1 108.5 88.1 103.0 92.2 C97.5 96.3 100.5 94.2 93.9 98.6 C87.2 102.9 90.8 102.6 82.1 105.7 C73.4 108.8 76.2 108.8 66.6 108.2 C57.0 107.6 60.0 108.0 52.0 103.8 C44.0 99.6 46.5 101.4 41.6 95.2 C36.6 89.0 38.2 91.4 36.5 84.5 C34.7 77.6 35.6 80.4 36.1 73.6 C36.6 66.9 35.3 69.5 38.1 63.3 C40.8 57.1 39.5 59.5 44.7 54.3 C49.8 49.1 47.3 50.7 54.0 47.0 C60.8 43.3 58.0 45.0 65.7 42.7 C73.5 40.3 69.8 41.2 78.1 39.8 C86.5 38.3 82.7 38.2 91.9 38.1 C101.0 38.1 97.4 37.4 106.7 39.6 C116.1 41.8 114.0 39.9 121.1 45.1 C128.3 50.3 126.5 48.4 129.1 55.8 C131.6 63.1 132.0 60.8 129.1 68.1 Z" fill="none" stroke="#f4e8c9" stroke-width="1.3" opacity="0.6" stroke-linecap="round" transform="translate(-0.6 -0.9)"/>
        <path d="M25.0 57.3 C28.7 53.9 28.4 52.6 36.4 46.7 C44.4 40.7 41.0 43.5 50.0 38.6 C59.0 33.8 59.9 33.7 64.6 31.5" fill="none" stroke="#6f5c38" stroke-width="9.5" opacity="0.2" stroke-linecap="round" transform="translate(1.2 1.8)"/><path d="M25.0 57.3 C28.7 53.9 28.4 52.6 36.4 46.7 C44.4 40.7 41.0 43.5 50.0 38.6 C59.0 33.8 59.9 33.7 64.6 31.5" fill="none" stroke="#8a7140" stroke-width="5.6" stroke-linecap="round"/><path d="M25.0 57.3 C28.7 53.9 28.4 52.6 36.4 46.7 C44.4 40.7 41.0 43.5 50.0 38.6 C59.0 33.8 59.9 33.7 64.6 31.5" fill="none" stroke="#d2ba8a" stroke-width="3.9" stroke-linecap="round"/><path d="M25.0 57.3 C28.7 53.9 28.4 52.6 36.4 46.7 C44.4 40.7 41.0 43.5 50.0 38.6 C59.0 33.8 59.9 33.7 64.6 31.5" fill="none" stroke="#f4e8c9" stroke-width="1.2" opacity="0.6" stroke-linecap="round" transform="translate(-0.6 -0.9)"/>
        <path d="M120.0 44.0 C122.6 42.4 121.9 41.2 128.0 39.0 C134.1 36.8 132.9 35.4 139.0 37.0 C145.1 38.6 143.8 37.9 147.0 44.0 C150.2 50.1 150.3 48.3 149.0 56.0 C147.7 63.7 148.1 61.9 143.0 68.0 C137.9 74.1 137.8 72.1 133.0 75.0 C128.2 77.9 129.6 76.4 128.0 77.0" fill="none" stroke="#8a7140" stroke-width="5.2" stroke-linecap="round"/><path d="M120.0 44.0 C122.6 42.4 121.9 41.2 128.0 39.0 C134.1 36.8 132.9 35.4 139.0 37.0 C145.1 38.6 143.8 37.9 147.0 44.0 C150.2 50.1 150.3 48.3 149.0 56.0 C147.7 63.7 148.1 61.9 143.0 68.0 C137.9 74.1 137.8 72.1 133.0 75.0 C128.2 77.9 129.6 76.4 128.0 77.0" fill="none" stroke="#d2ba8a" stroke-width="3.6" stroke-linecap="round"/><path d="M118.0 43.9L122.0 44.1M126.2 38.2L129.8 39.8M138.5 35.1L139.5 38.9M147.8 42.2L146.2 45.8M150.7 55.0L147.3 57.0M145.0 68.0L141.0 68.0M135.0 75.4L131.0 74.6M127.3 78.9L128.7 75.1" fill="none" stroke="#6f5b2e" stroke-width="0.9" opacity="0.3" stroke-linecap="round"/><path d="M120.0 44.0 C122.6 42.4 121.9 41.2 128.0 39.0 C134.1 36.8 132.9 35.4 139.0 37.0 C145.1 38.6 143.8 37.9 147.0 44.0 C150.2 50.1 150.3 48.3 149.0 56.0 C147.7 63.7 148.1 61.9 143.0 68.0 C137.9 74.1 137.8 72.1 133.0 75.0 C128.2 77.9 129.6 76.4 128.0 77.0" fill="none" stroke="#f4e8c9" stroke-width="1.1" opacity="0.6" stroke-linecap="round" transform="translate(-0.6 -0.9)"/>
        <!-- where it was cut: the plies let go of each other -->
        <g stroke="#b39a63" stroke-width="1" stroke-linecap="round" opacity="0.85">
          <path d="M128 77 l-5 3.4 M128 77 l-3.6 4.6 M128 77 l-1.6 5.2"/>
        </g>
      </g>
`,
  },
  {
    // A quarter-inch instrument lead, coiled loosely the way one lands when it
    // is dropped rather than wound. It replaces a pair of white earbuds, which
    // were drawn no better and belonged on somebody else's desk: everything
    // else on this one is stationery or a bracelet, and the lead at least
    // shares a room with the songs. Long and thin, so the narrow gutters can
    // still use it.
    id: "lead", w: 96, h: 300, narrow: true, maxRot: 8,
    svg: `
      <defs>
        ${bar("dpLeadNi", ["#f6f4ef", "#cfccc5", "#8d8a83", "#e2ddd3"])}
        ${sheen("dpLeadSh", "#ffffff", 0.5)}
        ${grain("dpLeadRub", 0.6, 19, [0.14, 0.12, 0.11], 0.55)}
      </defs>
      <!-- A quarter-inch instrument lead, coiled the way one lands when it is
           dropped rather than wound. Rubber has no twist and no sheen of its
           own: it gets one soft line of light along its upper side and nothing
           else, or it turns into liquorice. -->
      <g fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M64.0 -10.0 C62.1 -0.4 64.4 4.0 58.0 20.0 C51.6 36.0 55.5 28.5 44.0 40.0 C32.5 51.5 31.6 42.6 22.0 56.0 C12.4 69.4 12.1 67.3 14.0 82.0 C15.9 96.7 14.6 95.0 28.0 102.0 C41.4 109.0 41.3 109.1 56.0 104.0 C70.7 98.9 70.2 99.4 74.0 86.0 C77.8 72.6 77.6 71.6 68.0 62.0 C58.4 52.4 58.7 53.4 44.0 56.0 C29.3 58.6 31.6 55.9 22.0 70.0 C12.4 84.1 14.0 80.8 14.0 100.0 C14.0 119.2 12.4 114.0 22.0 130.0 C31.6 146.0 29.3 139.8 44.0 150.0 C58.7 160.2 58.4 150.5 68.0 162.0 C77.6 173.5 77.2 171.9 74.0 186.0 C70.8 200.1 63.1 199.6 58.0 206.0" fill="none" stroke="#2b2724" stroke-width="7.6" stroke-linecap="round"/><path d="M64.0 -10.0 C62.1 -0.4 64.4 4.0 58.0 20.0 C51.6 36.0 55.5 28.5 44.0 40.0 C32.5 51.5 31.6 42.6 22.0 56.0 C12.4 69.4 12.1 67.3 14.0 82.0 C15.9 96.7 14.6 95.0 28.0 102.0 C41.4 109.0 41.3 109.1 56.0 104.0 C70.7 98.9 70.2 99.4 74.0 86.0 C77.8 72.6 77.6 71.6 68.0 62.0 C58.4 52.4 58.7 53.4 44.0 56.0 C29.3 58.6 31.6 55.9 22.0 70.0 C12.4 84.1 14.0 80.8 14.0 100.0 C14.0 119.2 12.4 114.0 22.0 130.0 C31.6 146.0 29.3 139.8 44.0 150.0 C58.7 160.2 58.4 150.5 68.0 162.0 C77.6 173.5 77.2 171.9 74.0 186.0 C70.8 200.1 63.1 199.6 58.0 206.0" fill="none" stroke="#43403c" stroke-width="5.3" stroke-linecap="round"/><path d="M64.0 -10.0 C62.1 -0.4 64.4 4.0 58.0 20.0 C51.6 36.0 55.5 28.5 44.0 40.0 C32.5 51.5 31.6 42.6 22.0 56.0 C12.4 69.4 12.1 67.3 14.0 82.0 C15.9 96.7 14.6 95.0 28.0 102.0 C41.4 109.0 41.3 109.1 56.0 104.0 C70.7 98.9 70.2 99.4 74.0 86.0 C77.8 72.6 77.6 71.6 68.0 62.0 C58.4 52.4 58.7 53.4 44.0 56.0 C29.3 58.6 31.6 55.9 22.0 70.0 C12.4 84.1 14.0 80.8 14.0 100.0 C14.0 119.2 12.4 114.0 22.0 130.0 C31.6 146.0 29.3 139.8 44.0 150.0 C58.7 160.2 58.4 150.5 68.0 162.0 C77.6 173.5 77.2 171.9 74.0 186.0 C70.8 200.1 63.1 199.6 58.0 206.0" fill="none" stroke="#948e86" stroke-width="1.7" opacity="0.6" stroke-linecap="round" transform="translate(-0.6 -0.9)"/>
        <!-- the two places the cable lies across itself, brought over with the
             contact shadow under them -->
        <path d="M28.0 102.0 C37.0 102.6 41.3 109.1 56.0 104.0 C70.7 98.9 70.2 99.4 74.0 86.0 C77.8 72.6 77.6 71.6 68.0 62.0 C58.4 52.4 51.7 57.9 44.0 56.0" fill="none" stroke="#1c1917" stroke-width="12.9" opacity="0.2" stroke-linecap="round" transform="translate(1.2 1.8)"/><path d="M28.0 102.0 C37.0 102.6 41.3 109.1 56.0 104.0 C70.7 98.9 70.2 99.4 74.0 86.0 C77.8 72.6 77.6 71.6 68.0 62.0 C58.4 52.4 51.7 57.9 44.0 56.0" fill="none" stroke="#2b2724" stroke-width="7.6" stroke-linecap="round"/><path d="M28.0 102.0 C37.0 102.6 41.3 109.1 56.0 104.0 C70.7 98.9 70.2 99.4 74.0 86.0 C77.8 72.6 77.6 71.6 68.0 62.0 C58.4 52.4 51.7 57.9 44.0 56.0" fill="none" stroke="#43403c" stroke-width="5.3" stroke-linecap="round"/><path d="M28.0 102.0 C37.0 102.6 41.3 109.1 56.0 104.0 C70.7 98.9 70.2 99.4 74.0 86.0 C77.8 72.6 77.6 71.6 68.0 62.0 C58.4 52.4 51.7 57.9 44.0 56.0" fill="none" stroke="#948e86" stroke-width="1.7" opacity="0.6" stroke-linecap="round" transform="translate(-0.6 -0.9)"/>
        <path d="M22.0 130.0 C29.0 136.4 29.3 139.8 44.0 150.0 C58.7 160.2 58.4 150.5 68.0 162.0 C77.6 173.5 72.1 178.3 74.0 186.0" fill="none" stroke="#1c1917" stroke-width="12.9" opacity="0.2" stroke-linecap="round" transform="translate(1.2 1.8)"/><path d="M22.0 130.0 C29.0 136.4 29.3 139.8 44.0 150.0 C58.7 160.2 58.4 150.5 68.0 162.0 C77.6 173.5 72.1 178.3 74.0 186.0" fill="none" stroke="#2b2724" stroke-width="7.6" stroke-linecap="round"/><path d="M22.0 130.0 C29.0 136.4 29.3 139.8 44.0 150.0 C58.7 160.2 58.4 150.5 68.0 162.0 C77.6 173.5 72.1 178.3 74.0 186.0" fill="none" stroke="#43403c" stroke-width="5.3" stroke-linecap="round"/><path d="M22.0 130.0 C29.0 136.4 29.3 139.8 44.0 150.0 C58.7 160.2 58.4 150.5 68.0 162.0 C77.6 173.5 72.1 178.3 74.0 186.0" fill="none" stroke="#948e86" stroke-width="1.7" opacity="0.6" stroke-linecap="round" transform="translate(-0.6 -0.9)"/>
      </g>
      <!-- the strain relief: a ribbed rubber cone, where every lead on earth
           eventually fails -->
      <path d="M50 202 q-13 5 -15 20 q-2 13 0 24 h30 q2 -11 0 -24 q-2 -15 -15 -20 Z"
            fill="#33302c" stroke="#211e1c" stroke-width="0.9"/>
      <g fill="none" stroke="#5b5650" stroke-width="1.1" opacity="0.7">
        <path d="M36 222 q14 4 28 0"/><path d="M35 232 q15 4 30 0"/><path d="M35 242 q15 4 30 0"/>
      </g>
      <!-- the plug: barrel, insulator, sleeve, tip. It reads as metal because
           the far rim picks the desk's bounce back up (bar(), upstairs). -->
      <rect x="35" y="244" width="30" height="5" rx="1.8" fill="#4a453f"/>
      <rect x="36" y="248" width="28" height="30" rx="1.5" fill="url(#dpLeadNi)"/>
      <rect x="36" y="248" width="28" height="30" fill="url(#dpLeadSh)" opacity="0.45"/>
      <!-- the insulating ring that separates sleeve from tip -->
      <rect x="41" y="276" width="18" height="3.4" fill="#17150f" opacity="0.9"/>
      <rect x="41" y="278" width="18" height="12" fill="url(#dpLeadNi)"/>
      <path d="M41 288 q9 9 18 0 v-4 h-18 Z" fill="url(#dpLeadNi)"/>
      <path d="M38 250 v27" stroke="#fffdf8" stroke-width="1.6" opacity="0.5"/>
      <path d="M61.4 250 v27" stroke="#5f5b54" stroke-width="1.4" opacity="0.4"/>
      <!-- a nick in the plating, because nothing on this desk is new -->
      <path d="M56 256 q2 4 0 8" stroke="#6f6a62" stroke-width="0.9" fill="none" opacity="0.5"/>
`,
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
