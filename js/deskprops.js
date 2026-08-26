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
          <path d="M163.0 47.4 A83 83 0 1 1 87.8 12.3 L81.9 21.6 A72.5 72.5 0 1 0 161.0 58.5 Z"/>
        </clipPath>
      </defs>
      <g filter="url(#dmRfEdge)">
        <!-- the halo the film reached before the edge pinned, and the weak wash
             the middle dried to -->
        <circle cx="95" cy="95" r="86" fill="#8a6431" opacity="0.04"/>
        <circle cx="97" cy="92.5" r="72" fill="#8a6431" opacity="0.05"/>
        <!-- The band runs 300 degrees, not 360. A ring almost always has a
             thin stretch where the film was too shallow to leave anything, and
             a closed ring of even weight is the tell that it was drawn. Both
             ends taper because outer and inner arc meet at a point. -->
        <path fill="#7d5a2e" opacity="0.2" d="M163.0 47.4 A83 83 0 1 1 87.8 12.3 L81.9 21.6 A72.5 72.5 0 1 0 161.0 58.5 Z"/>
        <path d="M92.3 18.0 A77 77 0 0 1 155.7 47.6" fill="none" stroke="#7d5a2e" stroke-width="2.4"
              opacity="0.09" stroke-linecap="round"/>
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
        <!-- a drip that landed beside it and dried as its own little ring -->
        <ellipse cx="166" cy="150" rx="13" ry="9.5" fill="none" stroke="#7d5a2e" stroke-width="2.6"
                 opacity="0.1" transform="rotate(-18 166 150)"/>
        <ellipse cx="166" cy="150" rx="13" ry="9.5" fill="#8a6431" opacity="0.035" transform="rotate(-18 166 150)"/>
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
          <path d="M17 46 A68 60 0 0 0 153 46 A57 50 0 0 1 30 43 Z"/>
        </clipPath>
      </defs>
      <g filter="url(#dmRhEdge)">
        <path d="M17 46 A68 60 0 0 0 153 46 A57 50 0 0 1 30 43 Z" fill="#7d5a2e" opacity="0.2"/>
        <g clip-path="url(#dmRhBand)">
          <rect x="0" y="0" width="170" height="130" filter="url(#dmRhGrain)" opacity="0.55"/>
        </g>
        <!-- the drag: the ring does not end, it is wiped sideways off its own edge -->
        <path d="M150 47 q13 -5 22 -16" fill="none" stroke="#7d5a2e" stroke-width="10"
              opacity="0.12" stroke-linecap="round"/>
        <path d="M152 40 q12 -4 20 -13" fill="none" stroke="#7d5a2e" stroke-width="3.4"
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
        <path d="M 70.8,65.4 69.3,65.2 68.3,64.1 67.6,62.7 66.6,61.8 65.3,61.1 64.3,59.9 64.4,58.4 64.7,56.9 64.4,55.6 63.9,54.1 64.0,52.6 65.1,51.5 66.3,50.6 66.9,49.3 L 69.8,52.0 69.4,52.7 69.1,53.5 69.0,54.3 69.0,55.0 69.1,55.8 69.3,56.5 69.6,57.1 69.9,57.7 70.4,58.1 70.8,58.5 71.3,58.8 71.9,59.0 72.4,59.1 72.9,59.2 Z" fill="#e9d5ac" stroke="#b6934f" stroke-width="0.55" opacity="0.94"/>
        <path d="M 72.9,59.2 72.4,59.1 71.9,59.0 71.3,58.8 70.8,58.5 70.4,58.1 69.9,57.7 69.6,57.1 69.3,56.5 69.1,55.8 69.0,55.0 69.0,54.3 69.1,53.5 69.4,52.7 69.8,52.0" fill="none" stroke="#c2a165" stroke-width="2.4" opacity="0.26"
              stroke-dasharray="6 4 9 5"/>
        <path d="M 72.9,59.2 72.4,59.1 71.9,59.0 71.3,58.8 70.8,58.5 70.4,58.1 69.9,57.7 69.6,57.1 69.3,56.5 69.1,55.8 69.0,55.0 69.0,54.3 69.1,53.5 69.4,52.7 69.8,52.0" fill="none" stroke="#57534a" stroke-width="1.1" opacity="0.26"
              stroke-dasharray="3 10 5 8"/>
        <path d="M 70.8,65.4 69.3,65.2 68.3,64.1 67.6,62.7 66.6,61.8 65.3,61.1 64.3,59.9 64.4,58.4 64.7,56.9 64.4,55.6 63.9,54.1 64.0,52.6 65.1,51.5 66.3,50.6 66.9,49.3" fill="none" stroke="#d9a83f" stroke-width="1" opacity="0.4"
              stroke-dasharray="7 4 4 3 10 5"/>
        <g fill="none" stroke="#c6a163" stroke-width="0.5" opacity="0.5">
          <path d="M64 50 q5 3 5 9"/><path d="M69 63 q-5 1 -8 -2"/>
        </g>
        <!-- the tail of the big curl, lying back across itself -->
        <path d="M 41.6,23.4 43.4,24.4 44.9,25.7 46.5,26.9 48.2,27.8 49.9,29.0 51.1,30.7 51.6,32.7 51.9,34.7 52.5,36.5 53.3,38.5 53.5,40.5 53.0,42.5 L 48.9,41.6 48.9,40.1 48.7,38.6 48.3,37.2 47.7,35.9 47.0,34.7 46.2,33.6 45.3,32.6 44.2,31.8 43.1,31.1 42.0,30.6 40.8,30.3 39.6,30.1 Z" fill="#3a3128" opacity="0.16" transform="translate(1.4 1.8)"/>
        <path d="M 41.6,23.4 43.4,24.4 44.9,25.7 46.5,26.9 48.2,27.8 49.9,29.0 51.1,30.7 51.6,32.7 51.9,34.7 52.5,36.5 53.3,38.5 53.5,40.5 53.0,42.5 L 48.9,41.6 48.9,40.1 48.7,38.6 48.3,37.2 47.7,35.9 47.0,34.7 46.2,33.6 45.3,32.6 44.2,31.8 43.1,31.1 42.0,30.6 40.8,30.3 39.6,30.1 Z" fill="#e9d5ac" stroke="#b6934f" stroke-width="0.6" opacity="0.96"/>
        <path d="M 39.6,30.1 40.8,30.3 42.0,30.6 43.1,31.1 44.2,31.8 45.3,32.6 46.2,33.6 47.0,34.7 47.7,35.9 48.3,37.2 48.7,38.6 48.9,40.1 48.9,41.6" fill="none" stroke="#57534a" stroke-width="1.2" opacity="0.28"
              stroke-dasharray="4 7 6 5"/>
        <path d="M 41.6,23.4 43.4,24.4 44.9,25.7 46.5,26.9 48.2,27.8 49.9,29.0 51.1,30.7 51.6,32.7 51.9,34.7 52.5,36.5 53.3,38.5 53.5,40.5 53.0,42.5" fill="none" stroke="#d9a83f" stroke-width="1" opacity="0.44"
              stroke-dasharray="6 4 9 5"/>
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
    // shape is the whole point: rubber comes off as tapered worms with a bend
    // in them, never as dots, and each one carries the grey of the graphite it
    // just lifted along its underside. Geometry from make_desk_marks.py.
    id: "crumbs", w: 84, h: 58,
    svg: `
      <defs>
        <filter id="dmCrEdge" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.14 0.11" numOctaves="2" seed="27" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <g fill="none" stroke-linecap="round" opacity="0.8" filter="url(#dmCrEdge)">
        <g stroke="#ab9f85">
          <path d="M8 17 q11 6 23 3" stroke-width="8"/>
          <path d="M30 42 q5 -9 10 -15" stroke-width="5.4"/>
          <path d="M47 11 q3 5 4 10" stroke-width="4"/>
          <path d="M54 32 q11 4 21 -1" stroke-width="7.2"/>
          <path d="M23 49 q4 1 7 -1" stroke-width="3.4"/>
          <path d="M68 47 q3 -2 5 -2" stroke-width="2.4"/>
          <path d="M40 25 q2 1 3 1" stroke-width="1.8"/>
          <path d="M62 20 q2 2 2 3" stroke-width="1.6"/>
        </g>
        <g stroke="#d6ccb5">
          <path d="M8 17 q11 6 23 3" stroke-width="6.8"/>
          <path d="M30 42 q5 -9 10 -15" stroke-width="4.4"/>
          <path d="M47 11 q3 5 4 10" stroke-width="3.1"/>
          <path d="M54 32 q11 4 21 -1" stroke-width="6.1"/>
          <path d="M23 49 q4 1 7 -1" stroke-width="2.6"/>
          <path d="M68 47 q3 -2 5 -2" stroke-width="1.7"/>
          <path d="M40 25 q2 1 3 1" stroke-width="1.2"/>
          <path d="M62 20 q2 2 2 3" stroke-width="1"/>
        </g>
      </g>
      <!-- the graphite each one lifted, smeared along its own upper flank -->
      <g fill="none" stroke="#8d8578" stroke-width="1.7" stroke-linecap="round" opacity="0.24">
        <path d="M10 19 q10 5 20 2"/><path d="M31 43 q4 -8 8 -13"/>
        <path d="M55 34 q10 4 19 -1"/><path d="M23 50 q4 1 6 -1"/>
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
        <path d="M24 25 q3 -7 11 -6 q8 1 9 8 q-1 3 -4 4 q1 3 -2 4 q-3 1 -6 -1
                 q-1 4 -5 4 q-4 1 -6 -2 q-1 -2 2 -4 q2 -1 5 -1 q-4 -1 -4 -3
                 q0 -2 3 -2 q-4 -1 -3 -1 Z" fill="#1e2a41" opacity="0.38"/>
        <!-- the run: ink that found the grain and went with it -->
        <path d="M38 29 q10 0 16 2.4 q4 2 0.6 2.8 q-6 -0.8 -16.6 -1.6 Z" fill="#1e2a41" opacity="0.3"/>
        <path d="M22 31 q-8 0 -13 1.6 q-3 1.4 0.4 2 q5 -0.6 12.6 -1 Z" fill="#1e2a41" opacity="0.2"/>
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
        <path d="M55 40 q5 -3 9 -0.3 l0.25 0.7 q-4.2 -2.3 -8.7 0.5 Z" opacity="0.24"/>
        <path d="M54 45.5 q6 -3.6 11 -0.8 l0.5 1 q-5.4 -2.9 -10.8 0.7 Z" opacity="0.32"/>
        <path d="M53 51 q6.5 -4 12 -1 q3.2 1.9 5.8 0.6 l0.3 1.1 q-3.4 1.6 -6.8 -0.5
                 q-5 -3 -10.6 0.8 Z" opacity="0.42"/>
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
          <path d="M70 69 q9 -8 20 -2"/>
          <path d="M74 34 q15 10 30 1 q7 -4 13 1"/>
        </g>
        <g stroke-width="3.6">
          <path d="M14 26 q16 -12 30 -2 q7 5 13 1" stroke="#c79a3e"/>
          <path d="M24 56 q18 9 34 -1" stroke="#c06880"/>
          <path d="M70 69 q9 -8 20 -2" stroke="#6c8cb4"/>
          <path d="M74 34 q15 10 30 1 q7 -4 13 1" stroke="#5a9e6e"/>
        </g>
        <!-- the twist. The ticks stay INSIDE the cord: a tick that overshoots
             the edge stops reading as a ply and starts reading as a bristle. -->
        <g stroke-width="0.9" opacity="0.3">
          <path d="M13.5 25.0L17.2 25.1M16.3 23.1L20.0 23.6M19.3 21.6L22.9 22.4M22.5 20.3L26.0 21.6M25.9 19.4L29.2 21.0M29.4 18.9L32.6 20.8M33.1 18.6L36.0 20.9M36.9 18.8L39.7 21.2M40.9 19.2L43.5 21.9M45.0 20.0L47.4 22.8M49.3 21.1L51.5 24.1M53.7 22.6L55.8 25.7" stroke="#8a6a24"/>
          <path d="M24.6 55.1L26.2 58.5M27.3 56.6L29.2 59.8M30.0 57.8L32.2 60.7M32.7 58.7L35.1 61.4M35.4 59.3L38.1 61.8M38.1 59.6L41.1 61.9M40.8 59.7L44.0 61.6M43.6 59.5L46.9 61.1M46.3 59.0L49.8 60.2M49.1 58.2L52.7 59.1M51.9 57.1L55.6 57.7M54.7 55.7L58.4 56.0" stroke="#8f4459"/>
          <path d="M69.4 68.0L73.1 67.9M72.1 66.0L75.8 66.5M74.9 64.5L78.4 65.7M77.9 63.6L81.1 65.4M81.0 63.3L83.8 65.7M84.2 63.6L86.5 66.5M87.5 64.6L89.4 67.8" stroke="#46618c"/>
          <path d="M74.5 33.1L76.0 36.5M77.0 34.6L78.9 37.8M79.8 35.9L81.9 38.9M82.7 36.9L85.1 39.7M85.8 37.7L88.4 40.3M89.1 38.2L91.9 40.6M92.6 38.5L95.6 40.6M96.3 38.5L99.4 40.5M100.2 38.2L103.4 40.0M104.2 37.7L107.6 39.4M108.5 37.0L111.9 38.4M113.0 36.0L116.4 37.3" stroke="#3a7350"/>
        </g>
        <g stroke-width="0.8" opacity="0.4" stroke="#fff3d8">
          <path d="M16 24 q14 -10 27 -1"/><path d="M26 54 q16 8 31 -1"/>
          <path d="M71 67 q9 -7 18 -2"/><path d="M76 32 q13 9 27 1"/>
        </g>
      </g>
      <!-- cut ends: the plies spring apart the moment the scissors go through -->
      <g fill="none" stroke-width="0.9" stroke-linecap="round" opacity="0.7">
        <!-- one cut end each. Frayed at both ends and laid in a row, four
             snippets stop being offcuts and start being caterpillars. -->
        <path d="M57 25 l4 -2.5 M57 25 l4.6 0 M57 25 l3.4 2.6" stroke="#c79a3e"/>
        <path d="M117 36 l4 -1.8 M117 36 l4 1.4 M117 36 l2.8 2.6" stroke="#5a9e6e"/>
        <path d="M90 67 l4 -1.4 M90 67 l3.4 2 M90 67 l2.4 3" stroke="#6c8cb4"/>
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
        <path d="M132.6 23.3 C144.2 28.2 153.6 39.1 157.4 48.6 C161.1 58.1 158.8 71.2 155.3 80.5 C151.7 89.7 142.7 97.6 136.1 104.2 C129.5 110.9 122.2 116.3 115.7 120.4 C109.2 124.4 103.7 126.1 97.2 128.6 C90.7 131.1 82.6 134.3 76.7 135.3 C70.8 136.4 67.7 136.2 61.8 134.9 C55.8 133.5 48.7 131.3 41.2 127.1 C33.6 122.9 20.6 118.0 16.6 109.5 C12.5 100.9 12.4 88.0 16.7 75.8 C21.1 63.7 30.8 46.2 42.6 36.7 C54.4 27.2 72.6 21.1 87.6 18.9 C102.6 16.6 121.0 18.3 132.6 23.3 Z" stroke="#b9a982" stroke-width="3.4"/>
        <path d="M132.6 23.3 C144.2 28.2 153.6 39.1 157.4 48.6 C161.1 58.1 158.8 71.2 155.3 80.5 C151.7 89.7 142.7 97.6 136.1 104.2 C129.5 110.9 122.2 116.3 115.7 120.4 C109.2 124.4 103.7 126.1 97.2 128.6 C90.7 131.1 82.6 134.3 76.7 135.3 C70.8 136.4 67.7 136.2 61.8 134.9 C55.8 133.5 48.7 131.3 41.2 127.1 C33.6 122.9 20.6 118.0 16.6 109.5 C12.5 100.9 12.4 88.0 16.7 75.8 C21.1 63.7 30.8 46.2 42.6 36.7 C54.4 27.2 72.6 21.1 87.6 18.9 C102.6 16.6 121.0 18.3 132.6 23.3 Z" stroke="#e0d3b2" stroke-width="2.2"/>
        <path d="M132.6 23.3 C144.2 28.2 153.6 39.1 157.4 48.6 C161.1 58.1 158.8 71.2 155.3 80.5 C151.7 89.7 142.7 97.6 136.1 104.2 C129.5 110.9 122.2 116.3 115.7 120.4 C109.2 124.4 103.7 126.1 97.2 128.6 C90.7 131.1 82.6 134.3 76.7 135.3 C70.8 136.4 67.7 136.2 61.8 134.9 C55.8 133.5 48.7 131.3 41.2 127.1 C33.6 122.9 20.6 118.0 16.6 109.5 C12.5 100.9 12.4 88.0 16.7 75.8 C21.1 63.7 30.8 46.2 42.6 36.7 C54.4 27.2 72.6 21.1 87.6 18.9 C102.6 16.6 121.0 18.3 132.6 23.3 Z" stroke="#f6efd9" stroke-width="0.9" opacity="0.7" transform="translate(-0.5 -0.8)"/>
      </g>
      <g fill="#46320e" opacity="0.18">
        <ellipse cx="134.2" cy="25.9" rx="11.6" ry="10.4"/><ellipse cx="159.0" cy="51.2" rx="11.0" ry="9.8"/><ellipse cx="156.9" cy="83.1" rx="11.0" ry="9.8"/><ellipse cx="137.7" cy="106.8" rx="11.6" ry="10.4"/><ellipse cx="117.3" cy="123.0" rx="11.0" ry="9.8"/><ellipse cx="98.8" cy="131.2" rx="11.0" ry="9.8"/><ellipse cx="78.3" cy="137.9" rx="11.6" ry="10.4"/><ellipse cx="63.4" cy="137.5" rx="11.0" ry="9.8"/><ellipse cx="42.8" cy="129.7" rx="11.0" ry="9.8"/><ellipse cx="18.2" cy="112.1" rx="11.6" ry="10.4"/><ellipse cx="18.3" cy="78.4" rx="11.0" ry="9.8"/><ellipse cx="44.2" cy="39.3" rx="11.0" ry="9.8"/><ellipse cx="89.2" cy="21.5" rx="11.6" ry="10.4"/>
      </g>
      <g>
        <g><circle cx="132.6" cy="23.3" r="12.0" fill="url(#dpBrBone)" stroke="#bdb49e" stroke-width="0.85"/><path d="M121.6 23.7A11.0 11.0 0 0 1 141.8 17.2" fill="none" stroke="#4a3418" stroke-width="1.9" opacity="0.17"/><path d="M143.2 24.9A10.7 10.7 0 0 1 128.1 33.0" fill="none" stroke="#ffffff" stroke-width="1.6" opacity="0.26"/><circle cx="132.6" cy="23.3" r="10.7" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.32"/><circle cx="129.0" cy="18.9" r="1.9" fill="#ffffff" opacity="0.62"/></g><g><circle cx="157.4" cy="48.6" r="11.4" fill="url(#dpBrBone)" stroke="#bdb49e" stroke-width="0.85"/><path d="M147.0 49.0A10.4 10.4 0 0 1 166.0 42.9" fill="none" stroke="#4a3418" stroke-width="1.9" opacity="0.17"/><path d="M167.3 50.1A10.1 10.1 0 0 1 153.2 57.8" fill="none" stroke="#ffffff" stroke-width="1.6" opacity="0.26"/><circle cx="157.4" cy="48.6" r="10.1" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.32"/><circle cx="153.9" cy="44.5" r="1.8" fill="#ffffff" opacity="0.62"/></g><g><circle cx="155.3" cy="80.5" r="11.4" fill="url(#dpBr2)" stroke="#964962" stroke-width="0.85"/><path d="M144.9 80.9A10.4 10.4 0 0 1 164.0 74.7" fill="none" stroke="#4a3418" stroke-width="1.9" opacity="0.17"/><path d="M165.3 82.0A10.1 10.1 0 0 1 151.1 89.7" fill="none" stroke="#ffffff" stroke-width="1.6" opacity="0.26"/><circle cx="155.3" cy="80.5" r="10.1" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.32"/><circle cx="151.9" cy="76.4" r="1.8" fill="#ffffff" opacity="0.62"/></g><g><circle cx="136.1" cy="104.2" r="12.0" fill="url(#dpBrBone)" stroke="#bdb49e" stroke-width="0.85"/><path d="M125.1 104.7A11.0 11.0 0 0 1 145.3 98.2" fill="none" stroke="#4a3418" stroke-width="1.9" opacity="0.17"/><path d="M146.7 105.8A10.7 10.7 0 0 1 131.7 114.0" fill="none" stroke="#ffffff" stroke-width="1.6" opacity="0.26"/><circle cx="136.1" cy="104.2" r="10.7" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.32"/><circle cx="132.5" cy="99.9" r="1.9" fill="#ffffff" opacity="0.62"/></g><g><circle cx="115.7" cy="120.4" r="11.4" fill="url(#dpBrBone)" stroke="#bdb49e" stroke-width="0.85"/><path d="M105.3 120.8A10.4 10.4 0 0 1 124.4 114.7" fill="none" stroke="#4a3418" stroke-width="1.9" opacity="0.17"/><path d="M125.7 121.9A10.1 10.1 0 0 1 111.5 129.6" fill="none" stroke="#ffffff" stroke-width="1.6" opacity="0.26"/><circle cx="115.7" cy="120.4" r="10.1" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.32"/><circle cx="112.3" cy="116.3" r="1.8" fill="#ffffff" opacity="0.62"/></g><g><circle cx="97.2" cy="128.6" r="11.4" fill="url(#dpBrBone)" stroke="#bdb49e" stroke-width="0.85"/><path d="M86.8 129.0A10.4 10.4 0 0 1 105.9 122.9" fill="none" stroke="#4a3418" stroke-width="1.9" opacity="0.17"/><path d="M107.2 130.1A10.1 10.1 0 0 1 93.0 137.8" fill="none" stroke="#ffffff" stroke-width="1.6" opacity="0.26"/><circle cx="97.2" cy="128.6" r="10.1" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.32"/><circle cx="93.8" cy="124.5" r="1.8" fill="#ffffff" opacity="0.62"/></g><g><circle cx="76.7" cy="135.3" r="12.0" fill="url(#dpBrBone)" stroke="#bdb49e" stroke-width="0.85"/><path d="M65.7 135.8A11.0 11.0 0 0 1 85.9 129.3" fill="none" stroke="#4a3418" stroke-width="1.9" opacity="0.17"/><path d="M87.3 136.9A10.7 10.7 0 0 1 72.2 145.1" fill="none" stroke="#ffffff" stroke-width="1.6" opacity="0.26"/><circle cx="76.7" cy="135.3" r="10.7" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.32"/><circle cx="73.1" cy="131.0" r="1.9" fill="#ffffff" opacity="0.62"/></g><g><circle cx="61.8" cy="134.9" r="11.4" fill="url(#dpBr7)" stroke="#4c6b91" stroke-width="0.85"/><path d="M51.4 135.3A10.4 10.4 0 0 1 70.4 129.1" fill="none" stroke="#4a3418" stroke-width="1.9" opacity="0.17"/><path d="M71.8 136.4A10.1 10.1 0 0 1 57.6 144.0" fill="none" stroke="#ffffff" stroke-width="1.6" opacity="0.26"/><circle cx="61.8" cy="134.9" r="10.1" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.32"/><circle cx="58.3" cy="130.8" r="1.8" fill="#ffffff" opacity="0.62"/></g><g><circle cx="41.2" cy="127.1" r="11.4" fill="url(#dpBrBone)" stroke="#bdb49e" stroke-width="0.85"/><path d="M30.8 127.5A10.4 10.4 0 0 1 49.9 121.4" fill="none" stroke="#4a3418" stroke-width="1.9" opacity="0.17"/><path d="M51.2 128.6A10.1 10.1 0 0 1 37.0 136.3" fill="none" stroke="#ffffff" stroke-width="1.6" opacity="0.26"/><circle cx="41.2" cy="127.1" r="10.1" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.32"/><circle cx="37.8" cy="123.0" r="1.8" fill="#ffffff" opacity="0.62"/></g><g><circle cx="16.6" cy="109.5" r="12.0" fill="url(#dpBrBone)" stroke="#bdb49e" stroke-width="0.85"/><path d="M5.6 109.9A11.0 11.0 0 0 1 25.7 103.4" fill="none" stroke="#4a3418" stroke-width="1.9" opacity="0.17"/><path d="M27.1 111.1A10.7 10.7 0 0 1 12.1 119.2" fill="none" stroke="#ffffff" stroke-width="1.6" opacity="0.26"/><circle cx="16.6" cy="109.5" r="10.7" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.32"/><circle cx="13.0" cy="105.2" r="1.9" fill="#ffffff" opacity="0.62"/></g><g><circle cx="16.7" cy="75.8" r="11.4" fill="url(#dpBrBone)" stroke="#bdb49e" stroke-width="0.85"/><path d="M6.3 76.3A10.4 10.4 0 0 1 25.4 70.1" fill="none" stroke="#4a3418" stroke-width="1.9" opacity="0.17"/><path d="M26.7 77.3A10.1 10.1 0 0 1 12.5 85.0" fill="none" stroke="#ffffff" stroke-width="1.6" opacity="0.26"/><circle cx="16.7" cy="75.8" r="10.1" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.32"/><circle cx="13.3" cy="71.7" r="1.8" fill="#ffffff" opacity="0.62"/></g><g><circle cx="42.6" cy="36.7" r="11.4" fill="url(#dpBr11)" stroke="#9c7527" stroke-width="0.85"/><path d="M32.2 37.2A10.4 10.4 0 0 1 51.2 31.0" fill="none" stroke="#4a3418" stroke-width="1.9" opacity="0.17"/><path d="M52.5 38.2A10.1 10.1 0 0 1 38.4 45.9" fill="none" stroke="#ffffff" stroke-width="1.6" opacity="0.26"/><circle cx="42.6" cy="36.7" r="10.1" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.32"/><circle cx="39.1" cy="32.6" r="1.8" fill="#ffffff" opacity="0.62"/></g><g><circle cx="87.6" cy="18.9" r="12.0" fill="url(#dpBrBone)" stroke="#bdb49e" stroke-width="0.85"/><path d="M76.6 19.3A11.0 11.0 0 0 1 96.8 12.8" fill="none" stroke="#4a3418" stroke-width="1.9" opacity="0.17"/><path d="M98.2 20.5A10.7 10.7 0 0 1 83.1 28.6" fill="none" stroke="#ffffff" stroke-width="1.6" opacity="0.26"/><circle cx="87.6" cy="18.9" r="10.7" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.32"/><circle cx="84.0" cy="14.6" r="1.9" fill="#ffffff" opacity="0.62"/></g>
      </g>
      <g class="dp-bead-letter">
        <text x="132.6" y="23.3" transform="rotate(-69 132.6 23.3)">L</text><text x="157.4" y="48.6" transform="rotate(0 157.4 48.6)">U</text><text x="136.1" y="104.2" transform="rotate(57 136.1 104.2)">C</text><text x="115.7" y="120.4" transform="rotate(46 115.7 120.4)">K</text><text x="97.2" y="128.6" transform="rotate(94 97.2 128.6)">Y</text><text x="76.7" y="135.3" transform="rotate(78 76.7 135.3)">O</text><text x="41.2" y="127.1" transform="rotate(110 41.2 127.1)">N</text><text x="16.6" y="109.5" transform="rotate(172 16.6 109.5)">E</text><text x="16.7" y="75.8" transform="rotate(174 16.7 75.8)">S</text><text x="87.6" y="18.9" transform="rotate(252 87.6 18.9)">S</text>
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
        ${bar("dpScSteel", ["#eeece7", "#b9b7b0", "#78766f", "#d3cec5"], 96)}
        ${bar("dpScBrass", ["#f0d79a", "#c9a13f", "#8a6a2f", "#d9bd7c"], 108)}
        ${sheen("dpScSh", "#ffffff", 0.55)}
      </defs>
      <!-- Craft scissors, half open. Two things the old pair got wrong. The
           blades were a mirrored pair, and nothing forged is symmetrical: the
           upper blade lies OVER the lower one at the pivot and throws a shadow
           onto it, which is the only thing that says these are two objects and
           not one flat shape. And the bows are not a matching pair either. The
           thumb goes in the small round one, three fingers in the long one, so
           they differ in size and shape on any scissors you have ever held. -->
      <!-- lower blade, running up to the right -->
      <g>
        <path d="M47 104 L70 26 q2 -8 5.4 -7 q3.4 1 1.6 9 L55.6 107 Z" fill="url(#dpScSteel)"
              stroke="#8e8c85" stroke-width="0.8" stroke-linejoin="round"/>
        <path d="M76 28 L59 106" fill="none" stroke="#6e6c66" stroke-width="1.8" opacity="0.5" stroke-linecap="round"/>
        <path d="M68 33 L56 99" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.45" stroke-linecap="round"/>
      </g>
      <!-- upper blade, over the pivot, with what it throws on the one below -->
      <path d="M44 106 L20 30 q-2 -8 -6 -7 q-4 1 -2 9 L32 110 Z" fill="#2f2a22" opacity="0.18"
            transform="translate(2.4 2.6)"/>
      <g>
        <path d="M43 106 L20 30 q-2 -8 -5.4 -7 q-3.4 1 -1.6 9 L34.4 109 Z" fill="url(#dpScSteel)"
              stroke="#8e8c85" stroke-width="0.8" stroke-linejoin="round"/>
        <path d="M14 31 L28 108" fill="none" stroke="#6e6c66" stroke-width="1.8" opacity="0.45" stroke-linecap="round"/>
        <path d="M22 37 L34 101" fill="none" stroke="#ffffff" stroke-width="1.2" opacity="0.5" stroke-linecap="round"/>
        <!-- the grind: the bright facet the edge was sharpened to -->
        <path d="M27 46 L38 100" fill="none" stroke="#fdfdfb" stroke-width="0.9" opacity="0.55"/>
      </g>
      <!-- the pivot screw, proud of the steel, with a real slot in it -->
      <circle cx="45" cy="107" r="6.4" fill="url(#dpScBrass)" stroke="#6f5322" stroke-width="1"/>
      <circle cx="45" cy="107" r="6.4" fill="url(#dpScSh)" opacity="0.35"/>
      <path d="M41.4 104.6 L48.2 109.4" stroke="#6a5020" stroke-width="1.4" stroke-linecap="round"/>
      <circle cx="43.2" cy="105.2" r="1.5" fill="#f8e9bd" opacity="0.7"/>
      <!-- the bows. Each is a stroked ring rather than a traced outline: traced
           outlines fuse into one brass blob where they meet the shanks. -->
      <g fill="none" stroke-linecap="round">
        <g stroke="#6f5322" stroke-width="9">
          <path d="M42 113 q-8 12 -13 22"/><path d="M49 113 q9 11 15 20"/>
          <ellipse cx="22" cy="162" rx="13" ry="21" transform="rotate(-18 22 162)"/>
          <ellipse cx="70" cy="170" rx="15" ry="29" transform="rotate(15 70 170)"/>
        </g>
        <g stroke="url(#dpScBrass)" stroke-width="6.4">
          <path d="M42 113 q-8 12 -13 22"/><path d="M49 113 q9 11 15 20"/>
          <ellipse cx="22" cy="162" rx="13" ry="21" transform="rotate(-18 22 162)"/>
          <ellipse cx="70" cy="170" rx="15" ry="29" transform="rotate(15 70 170)"/>
        </g>
        <!-- the lamp along the outer edge of each bow, and the rub where a
             thumb has sat on one of them for years -->
        <g stroke="#f8e6b4" stroke-width="1.6" opacity="0.5">
          <path d="M9 154 q-3 12 2 22"/><path d="M84 158 q3 16 -3 28"/>
        </g>
        <path d="M13 172 q-2 -8 1 -15" stroke="#fffbe8" stroke-width="2.6" opacity="0.35"/>
      </g>
`,
  },
  {
    // A corner torn off a notebook page, with a couplet on it that did not
    // survive. The tear is on two edges only: the other two keep the page's
    // clean factory cut, which is what makes a torn scrap read as torn.
    id: "scrap", w: 176, h: 126,
    svg: `
      <defs>
        ${grain("dpScrFib", "0.9 0.35", 5, [0.55, 0.5, 0.36], 0.42)}
        ${rough("dpScrEdge", "0.16 0.12", 1.5, 13)}
      </defs>
      <!-- A corner torn off a page. Two clean factory edges at the top and
           left, and two torn ones: a real tear runs mostly straight and
           wanders by a fibre or two, where the old one zigzagged evenly enough
           to read as a pennant. -->
      <g filter="url(#dpScrEdge)">
        <path d="M4 6 L152 3 L154.7 3.5 L155.3 10.1 L156.1 16.7 L154.4 22.9 L156.6 29.7 L152.2 35.5 L150.4 42.5 L152.6 47.8 L156.3 52.5 L154.5 59.0 L160.5 62.9 L159.7 69.2 L160.1 73.0 L161.6 79.6 L159.1 84.8 L154.8 89.4 L157.1 96.2 L153.5 101.1 L148.6 105.5 L149.9 111.4 L143.4 111.2 L137.1 112.6 L130.4 110.8 L124.5 116.0 L118.0 116.3 L112.7 113.7 L107.2 112.9 L101.7 112.2 L95.7 115.1 L90.3 113.8 L85.3 109.0 L79.4 111.8 L73.0 106.0 L68.2 111.0 L62.9 114.4 L56.2 111.7 L51.3 116.4 L44.9 115.0 L38.8 114.7 L34.9 118.3 L29.4 116.5 L24.5 113.5 L20.7 108.6 L15.2 106.6 L9.0 106.0 Z" fill="#f3ecd6" stroke="#d6cbac" stroke-width="0.8" stroke-linejoin="round"/>
        <path d="M4 6 L152 3 L154.7 3.5 L155.3 10.1 L156.1 16.7 L154.4 22.9 L156.6 29.7 L152.2 35.5 L150.4 42.5 L152.6 47.8 L156.3 52.5 L154.5 59.0 L160.5 62.9 L159.7 69.2 L160.1 73.0 L161.6 79.6 L159.1 84.8 L154.8 89.4 L157.1 96.2 L153.5 101.1 L148.6 105.5 L149.9 111.4 L143.4 111.2 L137.1 112.6 L130.4 110.8 L124.5 116.0 L118.0 116.3 L112.7 113.7 L107.2 112.9 L101.7 112.2 L95.7 115.1 L90.3 113.8 L85.3 109.0 L79.4 111.8 L73.0 106.0 L68.2 111.0 L62.9 114.4 L56.2 111.7 L51.3 116.4 L44.9 115.0 L38.8 114.7 L34.9 118.3 L29.4 116.5 L24.5 113.5 L20.7 108.6 L15.2 106.6 L9.0 106.0 Z" fill="url(#dpScrFib)" opacity="0.35"/>
        <!-- the torn edges only: the lip of fibre pulled through the sizing -->
        <path d="M152 3 L154.7 3.5 L155.3 10.1 L156.1 16.7 L154.4 22.9 L156.6 29.7 L152.2 35.5 L150.4 42.5 L152.6 47.8 L156.3 52.5 L154.5 59.0 L160.5 62.9 L159.7 69.2 L160.1 73.0 L161.6 79.6 L159.1 84.8 L154.8 89.4 L157.1 96.2 L153.5 101.1 L148.6 105.5 L149.9 111.4 L143.4 111.2 L137.1 112.6 L130.4 110.8 L124.5 116.0 L118.0 116.3 L112.7 113.7 L107.2 112.9 L101.7 112.2 L95.7 115.1 L90.3 113.8 L85.3 109.0 L79.4 111.8 L73.0 106.0 L68.2 111.0 L62.9 114.4 L56.2 111.7 L51.3 116.4 L44.9 115.0 L38.8 114.7 L34.9 118.3 L29.4 116.5 L24.5 113.5 L20.7 108.6 L15.2 106.6 L9.0 106.0" fill="none" stroke="#fffaea" stroke-width="1.6" opacity="0.8" stroke-linejoin="round"/>
      </g>
      <!-- the page's own furniture, running slightly off square because the
           corner was torn askew -->
      <g transform="rotate(-1.2 80 60)">
        <path d="M26 1 L23 118" fill="none" stroke="#b23a3f" stroke-width="1.1" opacity="0.45"/>
        <g fill="none" stroke="#93a0bd" stroke-width="0.9" opacity="0.45">
          <path d="M5 30 H144"/><path d="M5 56 H140"/><path d="M5 82 H146"/>
        </g>
      </g>
      <!-- two lines of pencil, one of them struck out hard enough to dent the
           paper, and one word kept -->
      <g fill="none" stroke="#5c5340" stroke-linecap="round">
        <path d="M34 26 q7 -6 13 0 q5 6 11 0 q6 -6 12 1 q5 5 12 -1 q7 -5 13 1" stroke-width="1.5" opacity="0.62"/>
        <path d="M110 26 q6 -5 12 0 q5 5 11 -1" stroke-width="1.3" opacity="0.5"/>
        <path d="M34 52 q8 -6 14 1 q5 6 12 -1 q7 -6 13 1 q6 6 13 -1 q7 -6 14 1" stroke-width="1.6" opacity="0.66"/>
        <path d="M30 50 q40 5 78 -2" stroke-width="2.1" opacity="0.7"/>
        <path d="M32 54.5 q42 4 76 -3" stroke-width="1.2" opacity="0.45"/>
        <path d="M40 88 q6 -5 12 0 q5 5 12 -1" stroke-width="1.5" opacity="0.62"/>
      </g>
      <!-- the dent the struck-out line left, catching the lamp on its far side -->
      <path d="M31 51.6 q40 5 78 -2" fill="none" stroke="#fffaea" stroke-width="1.1" opacity="0.5"/>
      <ellipse cx="52" cy="84" rx="22" ry="12" fill="none" stroke="#b23a3f" stroke-width="1.4"
               opacity="0.7" transform="rotate(-4 52 84)"/>
      <path d="M31 86 q3 10 14 12" fill="none" stroke="#b23a3f" stroke-width="1.1" opacity="0.5" stroke-linecap="round"/>
`,
  },
  {
    // A floss skein spool on its side, mid-unwind. The card bobbin is the giveaway
    // that this is embroidery floss and not thread: flat, notched, wound in a
    // tight flat band rather than a cone.
    id: "spool", w: 130, h: 118,
    svg: `
      <defs>
        ${grain("dpSpCard", "0.7 0.5", 3, [0.42, 0.36, 0.24], 0.4)}
        ${rough("dpSpEdge", "0.09 0.07", 1.6, 21)}
        <!-- the section across the wound band: it is a rounded mass of thread,
             not a flat panel, and one gradient does more for that than any
             number of extra strands -->
        <linearGradient id="dpSpRound" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#5c2434" stop-opacity="0.32"/>
          <stop offset="0.2" stop-color="#ffd8e2" stop-opacity="0.24"/>
          <stop offset="0.55" stop-color="#ffffff" stop-opacity="0"/>
          <stop offset="1" stop-color="#5c2434" stop-opacity="0.36"/>
        </linearGradient>
      </defs>
      <!-- A floss bobbin, wound on a card. The old one was a rounded rectangle
           with stripes on it. What makes it a bobbin is that the floss WRAPS
           the card: every pass comes over the top edge and goes back under the
           bottom one, so the winding is a series of separate strands with the
           card's own edge showing between them, not a printed band. -->
      <!-- the run of floss trailing off, drawn under the card it comes off -->
      <g fill="none" stroke-linecap="round">
        <path d="M63 63 q35 23 53 19 q15 -3 13 -15" stroke="#8f4459" stroke-width="4"/>
        <path d="M63 63 q35 23 53 19 q15 -3 13 -15" stroke="#c06880" stroke-width="2.6"/>
        <path d="M63 63 q35 23 53 19 q15 -3 13 -15" stroke="#f0b6c4" stroke-width="0.8" opacity="0.6" transform="translate(-0.4 -0.7)"/>
      </g>
      <g filter="url(#dpSpEdge)">
        <!-- the card: pressed board, softened corners, and the two thread
             notches actually cut into it rather than drawn beside it -->
        <path d="M18 21 h72 a10 10 0 0 1 10 10 v52 a10 10 0 0 1 -10 10 h-72 a10 10 0 0 1 -10 -10 v-52 a10 10 0 0 1 10 -10 Z"
              fill="#eee6cd" stroke="#c3b797" stroke-width="1"/>
        <path d="M18 21 h72 a10 10 0 0 1 10 10 v52 a10 10 0 0 1 -10 10 h-72 a10 10 0 0 1 -10 -10 v-52 a10 10 0 0 1 10 -10 Z"
              fill="url(#dpSpCard)" opacity="0.4"/>
        <path d="M8 43 q11 7 0 13 Z" fill="#d8caa6" stroke="#b3a687" stroke-width="0.8"/>
        <path d="M100 59 q-11 7 0 13 Z" fill="#d8caa6" stroke="#b3a687" stroke-width="0.8"/>
        <!-- the wind. Individual passes, each with its own light, laid slightly
             unevenly because nobody winds a bobbin by machine. -->
        <g fill="none" stroke="#b2637a" stroke-width="1.9" stroke-linecap="round" opacity="0.95">
          <path d="M13.2 35.0 Q54 35.0 95.2 35.7"/><path d="M12.8 36.8 Q54 37.7 95.3 37.9"/><path d="M13.2 38.7 Q54 39.2 94.6 39.6"/><path d="M12.6 40.8 Q54 40.8 95.3 42.1"/><path d="M12.9 42.3 Q54 42.1 95.3 43.0"/><path d="M13.0 44.5 Q54 45.9 94.6 46.0"/><path d="M12.9 45.8 Q54 46.1 94.6 47.0"/><path d="M13.2 47.7 Q54 47.8 94.6 49.1"/><path d="M12.9 49.7 Q54 50.3 95.1 50.7"/><path d="M13.2 51.3 Q54 52.7 95.5 52.6"/><path d="M12.9 53.4 Q54 54.3 95.2 54.2"/><path d="M12.9 55.2 Q54 56.3 95.0 56.3"/><path d="M13.3 56.9 Q54 57.5 94.9 57.7"/><path d="M12.9 59.0 Q54 59.0 95.3 60.1"/><path d="M13.2 60.7 Q54 60.9 94.5 61.6"/><path d="M12.6 62.8 Q54 63.0 95.0 63.8"/><path d="M13.5 64.6 Q54 65.9 95.0 65.4"/><path d="M12.9 66.7 Q54 67.7 94.7 68.2"/><path d="M12.8 68.0 Q54 68.3 95.3 68.8"/><path d="M12.5 69.8 Q54 71.2 95.1 71.3"/><path d="M12.5 72.0 Q54 73.1 94.8 73.4"/><path d="M12.7 73.9 Q54 74.5 95.0 75.1"/><path d="M13.4 75.5 Q54 75.6 95.4 76.5"/><path d="M12.8 77.8 Q54 78.4 95.4 79.1"/><path d="M12.7 79.5 Q54 79.8 94.8 80.8"/><path d="M12.6 81.4 Q54 81.9 95.4 82.3"/>
        </g>
        <g fill="none" stroke="#e8a0b3" stroke-width="0.7" stroke-linecap="round" opacity="0.55"
           transform="translate(0 -0.7)">
          <path d="M13.2 35.0 Q54 35.0 95.2 35.7"/><path d="M12.8 36.8 Q54 37.7 95.3 37.9"/><path d="M13.2 38.7 Q54 39.2 94.6 39.6"/><path d="M12.6 40.8 Q54 40.8 95.3 42.1"/><path d="M12.9 42.3 Q54 42.1 95.3 43.0"/><path d="M13.0 44.5 Q54 45.9 94.6 46.0"/><path d="M12.9 45.8 Q54 46.1 94.6 47.0"/><path d="M13.2 47.7 Q54 47.8 94.6 49.1"/><path d="M12.9 49.7 Q54 50.3 95.1 50.7"/><path d="M13.2 51.3 Q54 52.7 95.5 52.6"/><path d="M12.9 53.4 Q54 54.3 95.2 54.2"/><path d="M12.9 55.2 Q54 56.3 95.0 56.3"/><path d="M13.3 56.9 Q54 57.5 94.9 57.7"/><path d="M12.9 59.0 Q54 59.0 95.3 60.1"/><path d="M13.2 60.7 Q54 60.9 94.5 61.6"/><path d="M12.6 62.8 Q54 63.0 95.0 63.8"/><path d="M13.5 64.6 Q54 65.9 95.0 65.4"/><path d="M12.9 66.7 Q54 67.7 94.7 68.2"/><path d="M12.8 68.0 Q54 68.3 95.3 68.8"/><path d="M12.5 69.8 Q54 71.2 95.1 71.3"/><path d="M12.5 72.0 Q54 73.1 94.8 73.4"/><path d="M12.7 73.9 Q54 74.5 95.0 75.1"/><path d="M13.4 75.5 Q54 75.6 95.4 76.5"/><path d="M12.8 77.8 Q54 78.4 95.4 79.1"/><path d="M12.7 79.5 Q54 79.8 94.8 80.8"/><path d="M12.6 81.4 Q54 81.9 95.4 82.3"/>
        </g>
        <!-- where each pass turns over the card's edge -->
        <g fill="none" stroke="#a8536b" stroke-width="1.8" stroke-linecap="round" opacity="0.8">
          <path d="M13 35.0 q-3.4 1.9 0 3.7"/><path d="M95 36.9 q3.4 1.9 0 3.7"/><path d="M13 38.7 q-3.4 1.9 0 3.7"/><path d="M95 40.6 q3.4 1.9 0 3.7"/><path d="M13 42.4 q-3.4 1.9 0 3.7"/><path d="M95 44.2 q3.4 1.9 0 3.7"/><path d="M13 46.1 q-3.4 1.9 0 3.7"/><path d="M95 48.0 q3.4 1.9 0 3.7"/><path d="M13 49.8 q-3.4 1.9 0 3.7"/><path d="M95 51.6 q3.4 1.9 0 3.7"/><path d="M13 53.5 q-3.4 1.9 0 3.7"/><path d="M95 55.4 q3.4 1.9 0 3.7"/><path d="M13 57.2 q-3.4 1.9 0 3.7"/><path d="M95 59.1 q3.4 1.9 0 3.7"/><path d="M13 60.9 q-3.4 1.9 0 3.7"/><path d="M95 62.8 q3.4 1.9 0 3.7"/><path d="M13 64.6 q-3.4 1.9 0 3.7"/><path d="M95 66.4 q3.4 1.9 0 3.7"/><path d="M13 68.3 q-3.4 1.9 0 3.7"/><path d="M95 70.2 q3.4 1.9 0 3.7"/><path d="M13 72.0 q-3.4 1.9 0 3.7"/><path d="M95 73.8 q3.4 1.9 0 3.7"/><path d="M13 75.7 q-3.4 1.9 0 3.7"/><path d="M95 77.5 q3.4 1.9 0 3.7"/><path d="M13 79.4 q-3.4 1.9 0 3.7"/><path d="M95 81.2 q3.4 1.9 0 3.7"/>
        </g>
        <!-- the wind is a rounded mass, not a flat panel: one section across
             it does more than any amount of extra strands -->
        <rect x="10" y="32" width="88" height="52" fill="url(#dpSpRound)"/>
      </g>
      <!-- the printed skein number, half under the wind -->
      <text class="dp-spool-no" x="54" y="90">304</text>
`,
  },
  {
    // The bead tin: a shallow round sweet-tin with the lid off, tipped onto its
    // rim. scatter.js also uses this as the SOURCE of a spill, rotated to point
    // down the spill axis, which is the whole reason loose beads have a reason
    // to exist further down the page.
    id: "tin", w: 136, h: 122,
    svg: `
      <defs>
        ${bar("dpTinWall", ["#efe6cf", "#c5b48d", "#8e7d57", "#cdbc95"], 96)}
        ${bar("dpTinLid", ["#f4ecd8", "#cdbc95", "#93825c", "#ddcda7"], 112)}
        ${sheen("dpTinSh", "#fffdf4", 0.5)}
        ${grain("dpTinScuff", "0.9 0.06", 8, [0.35, 0.30, 0.20], 0.5)}
        <clipPath id="dpTinInner"><ellipse cx="88" cy="42" rx="37" ry="22" transform="rotate(8 88 42)"/></clipPath>
      </defs>
      <!-- The bead tin: a shallow round sweet tin, lid off. The old one was a
           grey bowl with confetti in it. A tin is a pressed metal object, so
           what it needs is the wall it stands on, the bright rolled rim on top
           of that wall, the inside falling into shadow away from the lamp, and
           paint that has been rubbed off the high points. -->
      <!-- the lid, dropped face up beside it: rim, pressed centre, worn paint -->
      <g transform="rotate(-6 32 96)">
        <ellipse cx="32" cy="99" rx="29" ry="17" fill="#3a3018" opacity="0.2"/>
        <ellipse cx="32" cy="96" rx="29" ry="17" fill="url(#dpTinLid)" stroke="#87764f" stroke-width="1"/>
        <ellipse cx="32" cy="96" rx="23" ry="12.5" fill="none" stroke="#a08d63" stroke-width="1.4" opacity="0.75"/>
        <ellipse cx="32" cy="95.4" rx="23" ry="12.5" fill="none" stroke="#fdf6e2" stroke-width="0.7" opacity="0.5"/>
        <ellipse cx="32" cy="96" rx="15" ry="8" fill="#c06880" opacity="0.28"/>
        <ellipse cx="26" cy="91" rx="11" ry="5" fill="#fffdf4" opacity="0.28"/>
      </g>
      <!-- the wall of the tin, standing on the desk -->
      <path d="M51 34 a39 23 0 0 1 74 12 l-3 20 a39 23 0 0 1 -74 -12 Z"
            fill="url(#dpTinWall)" stroke="#7b6c4a" stroke-width="1"/>
      <path d="M51 34 a39 23 0 0 1 74 12 l-3 20 a39 23 0 0 1 -74 -12 Z"
            fill="url(#dpTinScuff)" opacity="0.35"/>
      <!-- the band of paint left on the wall, worn through where it is handled -->
      <path d="M53 46 a39 23 0 0 0 70 10" fill="none" stroke="#c06880" stroke-width="6" opacity="0.3"/>
      <path d="M64 60 a39 23 0 0 0 22 4" fill="none" stroke="#efe6cf" stroke-width="5" opacity="0.35"/>
      <!-- the mouth: rolled rim, then the inside wall in shadow, then the floor -->
      <ellipse cx="88" cy="42" rx="40" ry="24" fill="url(#dpTinLid)" stroke="#7b6c4a" stroke-width="1.1" transform="rotate(8 88 42)"/>
      <ellipse cx="88" cy="42" rx="40" ry="24" fill="url(#dpTinSh)" opacity="0.4" transform="rotate(8 88 42)"/>
      <ellipse cx="88" cy="42" rx="37" ry="22" fill="#6b5c3d" transform="rotate(8 88 42)"/>
      <g clip-path="url(#dpTinInner)">
        <ellipse cx="88" cy="46" rx="34" ry="20" fill="#b3a179"/>
        <path d="M54 40 a37 22 0 0 1 40 -18" fill="none" stroke="#4a3f28" stroke-width="13" opacity="0.34"/>
        <path d="M56 44 a37 22 0 0 1 36 -20" fill="none" stroke="#4a3f28" stroke-width="7" opacity="0.2"/>
        <ellipse cx="96" cy="54" rx="26" ry="12" fill="#fdf6e2" opacity="0.12"/>
      </g>
      <!-- the beads still in it, crowded to the low side and each sitting in
           its own small shadow on the tin's floor -->
      <g><g><ellipse cx="96.0" cy="40.0" rx="5.8" ry="4.5" fill="#3a3018" opacity="0.28"/><circle cx="95" cy="38" r="6.4" fill="#a9d6b6" stroke="#5a9e6e" stroke-width="0.7"/><path d="M89.3 38.2A5.7 5.7 0 0 1 99.8 34.9" fill="none" stroke="#3a2a12" stroke-width="1.2" opacity="0.18"/><circle cx="93.1" cy="35.7" r="1.2" fill="#ffffff" opacity="0.6"/></g><g><ellipse cx="103.0" cy="44.0" rx="5.8" ry="4.5" fill="#3a3018" opacity="0.28"/><circle cx="102" cy="42" r="6.4" fill="#cbbceb" stroke="#8b73c9" stroke-width="0.7"/><path d="M96.3 42.2A5.7 5.7 0 0 1 106.8 38.9" fill="none" stroke="#3a2a12" stroke-width="1.2" opacity="0.18"/><circle cx="100.1" cy="39.7" r="1.2" fill="#ffffff" opacity="0.6"/></g><g><ellipse cx="65.0" cy="45.0" rx="5.8" ry="4.5" fill="#3a3018" opacity="0.28"/><circle cx="64" cy="43" r="6.4" fill="#f0ebdd" stroke="#cfc6ae" stroke-width="0.7"/><path d="M58.3 43.2A5.7 5.7 0 0 1 68.8 39.9" fill="none" stroke="#3a2a12" stroke-width="1.2" opacity="0.18"/><circle cx="62.1" cy="40.7" r="1.2" fill="#ffffff" opacity="0.6"/></g><g><ellipse cx="76.0" cy="47.0" rx="5.8" ry="4.5" fill="#3a3018" opacity="0.28"/><circle cx="75" cy="45" r="6.4" fill="#b3cbe4" stroke="#6486ac" stroke-width="0.7"/><path d="M69.3 45.2A5.7 5.7 0 0 1 79.8 41.9" fill="none" stroke="#3a2a12" stroke-width="1.2" opacity="0.18"/><circle cx="73.1" cy="42.7" r="1.2" fill="#ffffff" opacity="0.6"/></g><g><ellipse cx="90.0" cy="49.0" rx="5.8" ry="4.5" fill="#3a3018" opacity="0.28"/><circle cx="89" cy="47" r="6.4" fill="#f0ebdd" stroke="#cfc6ae" stroke-width="0.7"/><path d="M83.3 47.2A5.7 5.7 0 0 1 93.8 43.9" fill="none" stroke="#3a2a12" stroke-width="1.2" opacity="0.18"/><circle cx="87.1" cy="44.7" r="1.2" fill="#ffffff" opacity="0.6"/></g><g><ellipse cx="108.0" cy="52.0" rx="5.8" ry="4.5" fill="#3a3018" opacity="0.28"/><circle cx="107" cy="50" r="6.4" fill="#f2d78f" stroke="#b6912f" stroke-width="0.7"/><path d="M101.3 50.2A5.7 5.7 0 0 1 111.8 46.9" fill="none" stroke="#3a2a12" stroke-width="1.2" opacity="0.18"/><circle cx="105.1" cy="47.7" r="1.2" fill="#ffffff" opacity="0.6"/></g><g><ellipse cx="70.0" cy="55.0" rx="5.8" ry="4.5" fill="#3a3018" opacity="0.28"/><circle cx="69" cy="53" r="6.4" fill="#f0ebdd" stroke="#cfc6ae" stroke-width="0.7"/><path d="M63.3 53.2A5.7 5.7 0 0 1 73.8 49.9" fill="none" stroke="#3a2a12" stroke-width="1.2" opacity="0.18"/><circle cx="67.1" cy="50.7" r="1.2" fill="#ffffff" opacity="0.6"/></g><g><ellipse cx="96.0" cy="57.0" rx="5.8" ry="4.5" fill="#3a3018" opacity="0.28"/><circle cx="95" cy="55" r="6.4" fill="#f0ebdd" stroke="#cfc6ae" stroke-width="0.7"/><path d="M89.3 55.2A5.7 5.7 0 0 1 99.8 51.9" fill="none" stroke="#3a2a12" stroke-width="1.2" opacity="0.18"/><circle cx="93.1" cy="52.7" r="1.2" fill="#ffffff" opacity="0.6"/></g><g><ellipse cx="83.0" cy="59.0" rx="5.8" ry="4.5" fill="#3a3018" opacity="0.28"/><circle cx="82" cy="57" r="6.4" fill="#ecaebd" stroke="#b7677f" stroke-width="0.7"/><path d="M76.3 57.2A5.7 5.7 0 0 1 86.8 53.9" fill="none" stroke="#3a2a12" stroke-width="1.2" opacity="0.18"/><circle cx="80.1" cy="54.7" r="1.2" fill="#ffffff" opacity="0.6"/></g></g>
      <!-- the rim's own highlight, last, so nothing paints over it -->
      <path d="M53 34 a39 23 0 0 1 46 -14" fill="none" stroke="#fffdf4" stroke-width="1.6" opacity="0.6" stroke-linecap="round"/>
      <path d="M124 50 a39 23 0 0 1 -18 15" fill="none" stroke="#6f6144" stroke-width="1.2" opacity="0.4" stroke-linecap="round"/>
`,
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
        <path d="M130.8 56.1 C130.1 60.9 127.8 65.5 125.9 69.8 C124.0 74.1 121.8 77.9 119.3 81.8 C116.8 85.6 114.2 89.3 111.1 93.0 C107.9 96.8 104.7 101.0 100.2 104.3 C95.8 107.6 90.2 110.8 84.5 112.8 C78.8 114.8 71.9 116.2 65.9 116.3 C59.9 116.4 53.7 115.0 48.2 113.4 C42.7 111.9 37.3 109.9 32.8 107.1 C28.4 104.4 24.6 100.8 21.5 97.1 C18.5 93.3 15.4 89.1 14.4 84.6 C13.5 80.1 14.0 74.8 15.8 70.2 C17.6 65.7 21.6 61.2 25.0 57.3 C28.4 53.4 32.2 49.8 36.4 46.7 C40.6 43.6 45.3 41.2 50.0 38.6 C54.7 36.1 59.3 33.7 64.6 31.5 C69.9 29.2 75.7 26.4 81.9 25.1 C88.0 23.8 95.3 22.9 101.5 23.6 C107.8 24.2 114.5 26.3 119.2 29.2 C124.0 32.1 128.1 36.6 130.0 41.1 C131.9 45.6 131.5 51.3 130.8 56.1 Z" fill="none" stroke="#8a7140" stroke-width="5.6" stroke-linecap="round"/><path d="M130.8 56.1 C130.1 60.9 127.8 65.5 125.9 69.8 C124.0 74.1 121.8 77.9 119.3 81.8 C116.8 85.6 114.2 89.3 111.1 93.0 C107.9 96.8 104.7 101.0 100.2 104.3 C95.8 107.6 90.2 110.8 84.5 112.8 C78.8 114.8 71.9 116.2 65.9 116.3 C59.9 116.4 53.7 115.0 48.2 113.4 C42.7 111.9 37.3 109.9 32.8 107.1 C28.4 104.4 24.6 100.8 21.5 97.1 C18.5 93.3 15.4 89.1 14.4 84.6 C13.5 80.1 14.0 74.8 15.8 70.2 C17.6 65.7 21.6 61.2 25.0 57.3 C28.4 53.4 32.2 49.8 36.4 46.7 C40.6 43.6 45.3 41.2 50.0 38.6 C54.7 36.1 59.3 33.7 64.6 31.5 C69.9 29.2 75.7 26.4 81.9 25.1 C88.0 23.8 95.3 22.9 101.5 23.6 C107.8 24.2 114.5 26.3 119.2 29.2 C124.0 32.1 128.1 36.6 130.0 41.1 C131.9 45.6 131.5 51.3 130.8 56.1 Z" fill="none" stroke="#d2ba8a" stroke-width="3.9" stroke-linecap="round"/><path d="M132.5 54.9L129.1 57.3M113.1 92.6L109.0 93.4M67.4 117.8L64.4 114.9M21.4 99.2L21.7 95.0M22.9 57.6L27.1 57.0M62.5 30.9L66.6 32.0M119.0 27.1L119.5 31.3" fill="none" stroke="#6f5b2e" stroke-width="0.9" opacity="0.3" stroke-linecap="round"/><path d="M130.8 56.1 C130.1 60.9 127.8 65.5 125.9 69.8 C124.0 74.1 121.8 77.9 119.3 81.8 C116.8 85.6 114.2 89.3 111.1 93.0 C107.9 96.8 104.7 101.0 100.2 104.3 C95.8 107.6 90.2 110.8 84.5 112.8 C78.8 114.8 71.9 116.2 65.9 116.3 C59.9 116.4 53.7 115.0 48.2 113.4 C42.7 111.9 37.3 109.9 32.8 107.1 C28.4 104.4 24.6 100.8 21.5 97.1 C18.5 93.3 15.4 89.1 14.4 84.6 C13.5 80.1 14.0 74.8 15.8 70.2 C17.6 65.7 21.6 61.2 25.0 57.3 C28.4 53.4 32.2 49.8 36.4 46.7 C40.6 43.6 45.3 41.2 50.0 38.6 C54.7 36.1 59.3 33.7 64.6 31.5 C69.9 29.2 75.7 26.4 81.9 25.1 C88.0 23.8 95.3 22.9 101.5 23.6 C107.8 24.2 114.5 26.3 119.2 29.2 C124.0 32.1 128.1 36.6 130.0 41.1 C131.9 45.6 131.5 51.3 130.8 56.1 Z" fill="none" stroke="#f4e8c9" stroke-width="1.2" opacity="0.6" stroke-linecap="round" transform="translate(-0.6 -0.9)"/>
        <path d="M125.9 97.1 C125.0 101.5 122.3 106.2 118.6 109.2 C114.9 112.2 109.2 114.3 103.9 115.2 C98.6 116.2 92.2 115.6 86.9 114.8 C81.5 114.0 76.4 111.9 71.7 110.5 C67.0 109.1 63.0 107.9 58.5 106.5 C54.1 105.1 49.7 103.8 45.0 101.9 C40.2 99.9 34.3 98.0 30.0 94.9 C25.6 91.8 21.2 87.5 18.6 83.2 C16.0 78.9 14.5 73.7 14.4 69.2 C14.3 64.8 15.9 60.2 18.0 56.4 C20.1 52.6 23.4 49.4 26.8 46.5 C30.1 43.6 33.7 40.8 38.0 38.9 C42.3 37.1 47.4 36.0 52.4 35.5 C57.4 35.1 63.0 35.4 68.1 36.4 C73.1 37.4 78.5 39.3 82.9 41.6 C87.4 43.9 91.2 47.3 94.9 50.2 C98.7 53.2 102.0 56.0 105.5 59.2 C109.0 62.5 112.8 65.7 115.9 69.6 C119.1 73.5 122.8 78.0 124.5 82.6 C126.1 87.2 126.9 92.6 125.9 97.1 Z" fill="none" stroke="#8a7140" stroke-width="5.8" stroke-linecap="round"/><path d="M125.9 97.1 C125.0 101.5 122.3 106.2 118.6 109.2 C114.9 112.2 109.2 114.3 103.9 115.2 C98.6 116.2 92.2 115.6 86.9 114.8 C81.5 114.0 76.4 111.9 71.7 110.5 C67.0 109.1 63.0 107.9 58.5 106.5 C54.1 105.1 49.7 103.8 45.0 101.9 C40.2 99.9 34.3 98.0 30.0 94.9 C25.6 91.8 21.2 87.5 18.6 83.2 C16.0 78.9 14.5 73.7 14.4 69.2 C14.3 64.8 15.9 60.2 18.0 56.4 C20.1 52.6 23.4 49.4 26.8 46.5 C30.1 43.6 33.7 40.8 38.0 38.9 C42.3 37.1 47.4 36.0 52.4 35.5 C57.4 35.1 63.0 35.4 68.1 36.4 C73.1 37.4 78.5 39.3 82.9 41.6 C87.4 43.9 91.2 47.3 94.9 50.2 C98.7 53.2 102.0 56.0 105.5 59.2 C109.0 62.5 112.8 65.7 115.9 69.6 C119.1 73.5 122.8 78.0 124.5 82.6 C126.1 87.2 126.9 92.6 125.9 97.1 Z" fill="none" stroke="#d2ba8a" stroke-width="4.1" stroke-linecap="round"/><path d="M127.9 96.1L123.9 98.0M88.3 116.5L85.4 113.1M46.1 103.8L43.9 100.0M12.7 70.7L16.1 67.8M36.0 38.2L40.1 39.7M82.2 39.6L83.7 43.7M116.0 67.4L115.9 71.8" fill="none" stroke="#6f5b2e" stroke-width="0.9" opacity="0.3" stroke-linecap="round"/><path d="M125.9 97.1 C125.0 101.5 122.3 106.2 118.6 109.2 C114.9 112.2 109.2 114.3 103.9 115.2 C98.6 116.2 92.2 115.6 86.9 114.8 C81.5 114.0 76.4 111.9 71.7 110.5 C67.0 109.1 63.0 107.9 58.5 106.5 C54.1 105.1 49.7 103.8 45.0 101.9 C40.2 99.9 34.3 98.0 30.0 94.9 C25.6 91.8 21.2 87.5 18.6 83.2 C16.0 78.9 14.5 73.7 14.4 69.2 C14.3 64.8 15.9 60.2 18.0 56.4 C20.1 52.6 23.4 49.4 26.8 46.5 C30.1 43.6 33.7 40.8 38.0 38.9 C42.3 37.1 47.4 36.0 52.4 35.5 C57.4 35.1 63.0 35.4 68.1 36.4 C73.1 37.4 78.5 39.3 82.9 41.6 C87.4 43.9 91.2 47.3 94.9 50.2 C98.7 53.2 102.0 56.0 105.5 59.2 C109.0 62.5 112.8 65.7 115.9 69.6 C119.1 73.5 122.8 78.0 124.5 82.6 C126.1 87.2 126.9 92.6 125.9 97.1 Z" fill="none" stroke="#f4e8c9" stroke-width="1.3" opacity="0.6" stroke-linecap="round" transform="translate(-0.6 -0.9)"/>
        <path d="M129.1 68.1 C127.6 71.8 123.1 75.4 120.1 78.3 C117.1 81.3 113.8 83.4 111.0 85.7 C108.1 88.0 105.8 90.0 103.0 92.2 C100.1 94.3 97.3 96.3 93.9 98.6 C90.4 100.8 86.6 104.1 82.1 105.7 C77.5 107.3 71.6 108.5 66.6 108.2 C61.6 107.9 56.2 106.0 52.0 103.8 C47.9 101.6 44.1 98.4 41.6 95.2 C39.0 92.0 37.4 88.1 36.5 84.5 C35.5 80.9 35.8 77.2 36.1 73.6 C36.4 70.1 36.6 66.6 38.1 63.3 C39.5 60.1 42.0 57.0 44.7 54.3 C47.3 51.6 50.5 49.0 54.0 47.0 C57.5 45.1 61.7 43.9 65.7 42.7 C69.8 41.5 73.8 40.5 78.1 39.8 C82.5 39.0 87.1 38.2 91.9 38.1 C96.6 38.1 101.9 38.5 106.7 39.6 C111.6 40.8 117.4 42.4 121.1 45.1 C124.8 47.8 127.7 52.0 129.1 55.8 C130.4 59.6 130.6 64.3 129.1 68.1 Z" fill="none" stroke="#8a7140" stroke-width="6.0" stroke-linecap="round"/><path d="M129.1 68.1 C127.6 71.8 123.1 75.4 120.1 78.3 C117.1 81.3 113.8 83.4 111.0 85.7 C108.1 88.0 105.8 90.0 103.0 92.2 C100.1 94.3 97.3 96.3 93.9 98.6 C90.4 100.8 86.6 104.1 82.1 105.7 C77.5 107.3 71.6 108.5 66.6 108.2 C61.6 107.9 56.2 106.0 52.0 103.8 C47.9 101.6 44.1 98.4 41.6 95.2 C39.0 92.0 37.4 88.1 36.5 84.5 C35.5 80.9 35.8 77.2 36.1 73.6 C36.4 70.1 36.6 66.6 38.1 63.3 C39.5 60.1 42.0 57.0 44.7 54.3 C47.3 51.6 50.5 49.0 54.0 47.0 C57.5 45.1 61.7 43.9 65.7 42.7 C69.8 41.5 73.8 40.5 78.1 39.8 C82.5 39.0 87.1 38.2 91.9 38.1 C96.6 38.1 101.9 38.5 106.7 39.6 C111.6 40.8 117.4 42.4 121.1 45.1 C124.8 47.8 127.7 52.0 129.1 55.8 C130.4 59.6 130.6 64.3 129.1 68.1 Z" fill="none" stroke="#d2ba8a" stroke-width="4.2" stroke-linecap="round"/><path d="M131.3 67.5L126.9 68.6M105.3 92.2L100.7 92.2M68.0 110.0L65.1 106.4M35.2 86.4L37.7 82.6M42.4 54.4L46.9 54.1M76.1 38.7L80.2 40.8M121.0 42.8L121.2 47.4" fill="none" stroke="#6f5b2e" stroke-width="0.9" opacity="0.3" stroke-linecap="round"/><path d="M129.1 68.1 C127.6 71.8 123.1 75.4 120.1 78.3 C117.1 81.3 113.8 83.4 111.0 85.7 C108.1 88.0 105.8 90.0 103.0 92.2 C100.1 94.3 97.3 96.3 93.9 98.6 C90.4 100.8 86.6 104.1 82.1 105.7 C77.5 107.3 71.6 108.5 66.6 108.2 C61.6 107.9 56.2 106.0 52.0 103.8 C47.9 101.6 44.1 98.4 41.6 95.2 C39.0 92.0 37.4 88.1 36.5 84.5 C35.5 80.9 35.8 77.2 36.1 73.6 C36.4 70.1 36.6 66.6 38.1 63.3 C39.5 60.1 42.0 57.0 44.7 54.3 C47.3 51.6 50.5 49.0 54.0 47.0 C57.5 45.1 61.7 43.9 65.7 42.7 C69.8 41.5 73.8 40.5 78.1 39.8 C82.5 39.0 87.1 38.2 91.9 38.1 C96.6 38.1 101.9 38.5 106.7 39.6 C111.6 40.8 117.4 42.4 121.1 45.1 C124.8 47.8 127.7 52.0 129.1 55.8 C130.4 59.6 130.6 64.3 129.1 68.1 Z" fill="none" stroke="#f4e8c9" stroke-width="1.3" opacity="0.6" stroke-linecap="round" transform="translate(-0.6 -0.9)"/>
        <path d="M25.0 57.3 C26.9 55.5 32.2 49.8 36.4 46.7 C40.6 43.6 45.3 41.2 50.0 38.6 C54.7 36.1 62.1 32.6 64.6 31.5" fill="none" stroke="#6f5c38" stroke-width="9.5" opacity="0.2" stroke-linecap="round" transform="translate(1.2 1.8)"/><path d="M25.0 57.3 C26.9 55.5 32.2 49.8 36.4 46.7 C40.6 43.6 45.3 41.2 50.0 38.6 C54.7 36.1 62.1 32.6 64.6 31.5" fill="none" stroke="#8a7140" stroke-width="5.6" stroke-linecap="round"/><path d="M25.0 57.3 C26.9 55.5 32.2 49.8 36.4 46.7 C40.6 43.6 45.3 41.2 50.0 38.6 C54.7 36.1 62.1 32.6 64.6 31.5" fill="none" stroke="#d2ba8a" stroke-width="3.9" stroke-linecap="round"/><path d="M25.0 57.3 C26.9 55.5 32.2 49.8 36.4 46.7 C40.6 43.6 45.3 41.2 50.0 38.6 C54.7 36.1 62.1 32.6 64.6 31.5" fill="none" stroke="#f4e8c9" stroke-width="1.2" opacity="0.6" stroke-linecap="round" transform="translate(-0.6 -0.9)"/>
        <path d="M120.0 44.0 C121.3 43.2 124.8 40.2 128.0 39.0 C131.2 37.8 135.8 36.2 139.0 37.0 C142.2 37.8 145.3 40.8 147.0 44.0 C148.7 47.2 149.7 52.0 149.0 56.0 C148.3 60.0 145.7 64.8 143.0 68.0 C140.3 71.2 135.5 73.5 133.0 75.0 C130.5 76.5 128.8 76.7 128.0 77.0" fill="none" stroke="#8a7140" stroke-width="5.2" stroke-linecap="round"/><path d="M120.0 44.0 C121.3 43.2 124.8 40.2 128.0 39.0 C131.2 37.8 135.8 36.2 139.0 37.0 C142.2 37.8 145.3 40.8 147.0 44.0 C148.7 47.2 149.7 52.0 149.0 56.0 C148.3 60.0 145.7 64.8 143.0 68.0 C140.3 71.2 135.5 73.5 133.0 75.0 C130.5 76.5 128.8 76.7 128.0 77.0" fill="none" stroke="#d2ba8a" stroke-width="3.6" stroke-linecap="round"/><path d="M118.0 43.9L122.0 44.1M126.2 38.2L129.8 39.8M138.5 35.1L139.5 38.9M147.8 42.2L146.2 45.8M150.7 55.0L147.3 57.0M145.0 68.0L141.0 68.0M135.0 75.4L131.0 74.6M127.3 78.9L128.7 75.1" fill="none" stroke="#6f5b2e" stroke-width="0.9" opacity="0.3" stroke-linecap="round"/><path d="M120.0 44.0 C121.3 43.2 124.8 40.2 128.0 39.0 C131.2 37.8 135.8 36.2 139.0 37.0 C142.2 37.8 145.3 40.8 147.0 44.0 C148.7 47.2 149.7 52.0 149.0 56.0 C148.3 60.0 145.7 64.8 143.0 68.0 C140.3 71.2 135.5 73.5 133.0 75.0 C130.5 76.5 128.8 76.7 128.0 77.0" fill="none" stroke="#f4e8c9" stroke-width="1.1" opacity="0.6" stroke-linecap="round" transform="translate(-0.6 -0.9)"/>
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
        <path d="M66.0 -12.0 C64.7 -7.7 61.0 6.7 58.0 14.0 C55.0 21.3 52.2 27.4 48.0 32.0 C43.8 36.6 32.9 40.3 32.9 41.4 C32.8 42.4 42.8 37.9 47.6 38.1 C52.4 38.4 58.0 40.3 61.8 43.0 C65.6 45.7 69.1 50.1 70.6 54.3 C72.2 58.5 72.4 63.9 71.1 68.2 C69.8 72.5 66.7 77.1 63.1 80.0 C59.4 83.0 54.0 85.2 49.3 85.7 C44.5 86.3 38.6 85.4 34.3 83.4 C30.0 81.4 25.7 77.6 23.4 73.8 C21.0 69.9 19.7 64.6 20.1 60.2 C20.4 55.7 22.6 50.7 25.6 47.2 C28.6 43.7 37.6 30.8 38.0 39.2 C38.4 47.7 30.7 84.9 28.0 98.0 C25.3 111.1 22.3 112.3 22.0 118.0 C21.7 123.7 26.1 127.4 26.5 131.9 C26.8 136.4 23.6 140.8 24.2 145.0 C24.8 149.2 27.1 153.9 30.0 157.1 C33.0 160.3 37.6 163.0 41.9 164.1 C46.2 165.1 51.7 164.9 55.9 163.5 C60.1 162.1 64.5 159.1 67.2 155.7 C69.9 152.3 71.7 147.5 72.0 143.2 C72.2 139.0 70.9 134.0 68.6 130.3 C66.4 126.7 62.3 123.2 58.3 121.4 C54.3 119.6 48.9 118.8 44.5 119.4 C40.1 120.1 35.1 122.3 31.8 125.1 C28.6 128.0 21.0 127.4 24.7 136.5 C28.4 145.7 48.8 169.4 54.0 180.0 C59.2 190.6 55.7 196.7 56.0 200.0" fill="none" stroke="#2b2724" stroke-width="7.6" stroke-linecap="round"/><path d="M66.0 -12.0 C64.7 -7.7 61.0 6.7 58.0 14.0 C55.0 21.3 52.2 27.4 48.0 32.0 C43.8 36.6 32.9 40.3 32.9 41.4 C32.8 42.4 42.8 37.9 47.6 38.1 C52.4 38.4 58.0 40.3 61.8 43.0 C65.6 45.7 69.1 50.1 70.6 54.3 C72.2 58.5 72.4 63.9 71.1 68.2 C69.8 72.5 66.7 77.1 63.1 80.0 C59.4 83.0 54.0 85.2 49.3 85.7 C44.5 86.3 38.6 85.4 34.3 83.4 C30.0 81.4 25.7 77.6 23.4 73.8 C21.0 69.9 19.7 64.6 20.1 60.2 C20.4 55.7 22.6 50.7 25.6 47.2 C28.6 43.7 37.6 30.8 38.0 39.2 C38.4 47.7 30.7 84.9 28.0 98.0 C25.3 111.1 22.3 112.3 22.0 118.0 C21.7 123.7 26.1 127.4 26.5 131.9 C26.8 136.4 23.6 140.8 24.2 145.0 C24.8 149.2 27.1 153.9 30.0 157.1 C33.0 160.3 37.6 163.0 41.9 164.1 C46.2 165.1 51.7 164.9 55.9 163.5 C60.1 162.1 64.5 159.1 67.2 155.7 C69.9 152.3 71.7 147.5 72.0 143.2 C72.2 139.0 70.9 134.0 68.6 130.3 C66.4 126.7 62.3 123.2 58.3 121.4 C54.3 119.6 48.9 118.8 44.5 119.4 C40.1 120.1 35.1 122.3 31.8 125.1 C28.6 128.0 21.0 127.4 24.7 136.5 C28.4 145.7 48.8 169.4 54.0 180.0 C59.2 190.6 55.7 196.7 56.0 200.0" fill="none" stroke="#43403c" stroke-width="5.3" stroke-linecap="round"/><path d="M66.0 -12.0 C64.7 -7.7 61.0 6.7 58.0 14.0 C55.0 21.3 52.2 27.4 48.0 32.0 C43.8 36.6 32.9 40.3 32.9 41.4 C32.8 42.4 42.8 37.9 47.6 38.1 C52.4 38.4 58.0 40.3 61.8 43.0 C65.6 45.7 69.1 50.1 70.6 54.3 C72.2 58.5 72.4 63.9 71.1 68.2 C69.8 72.5 66.7 77.1 63.1 80.0 C59.4 83.0 54.0 85.2 49.3 85.7 C44.5 86.3 38.6 85.4 34.3 83.4 C30.0 81.4 25.7 77.6 23.4 73.8 C21.0 69.9 19.7 64.6 20.1 60.2 C20.4 55.7 22.6 50.7 25.6 47.2 C28.6 43.7 37.6 30.8 38.0 39.2 C38.4 47.7 30.7 84.9 28.0 98.0 C25.3 111.1 22.3 112.3 22.0 118.0 C21.7 123.7 26.1 127.4 26.5 131.9 C26.8 136.4 23.6 140.8 24.2 145.0 C24.8 149.2 27.1 153.9 30.0 157.1 C33.0 160.3 37.6 163.0 41.9 164.1 C46.2 165.1 51.7 164.9 55.9 163.5 C60.1 162.1 64.5 159.1 67.2 155.7 C69.9 152.3 71.7 147.5 72.0 143.2 C72.2 139.0 70.9 134.0 68.6 130.3 C66.4 126.7 62.3 123.2 58.3 121.4 C54.3 119.6 48.9 118.8 44.5 119.4 C40.1 120.1 35.1 122.3 31.8 125.1 C28.6 128.0 21.0 127.4 24.7 136.5 C28.4 145.7 48.8 169.4 54.0 180.0 C59.2 190.6 55.7 196.7 56.0 200.0" fill="none" stroke="#948e86" stroke-width="1.7" opacity="0.6" stroke-linecap="round" transform="translate(-0.6 -0.9)"/>
        <!-- the two places the cable lies across itself, brought over with the
             contact shadow under them -->
        <path d="M20.1 60.2 C21.0 58.0 22.6 50.7 25.6 47.2 C28.6 43.7 37.6 30.8 38.0 39.2 C38.4 47.7 30.7 84.9 28.0 98.0 C25.3 111.1 23.0 114.7 22.0 118.0" fill="none" stroke="#1c1917" stroke-width="12.9" opacity="0.2" stroke-linecap="round" transform="translate(1.2 1.8)"/><path d="M20.1 60.2 C21.0 58.0 22.6 50.7 25.6 47.2 C28.6 43.7 37.6 30.8 38.0 39.2 C38.4 47.7 30.7 84.9 28.0 98.0 C25.3 111.1 23.0 114.7 22.0 118.0" fill="none" stroke="#2b2724" stroke-width="7.6" stroke-linecap="round"/><path d="M20.1 60.2 C21.0 58.0 22.6 50.7 25.6 47.2 C28.6 43.7 37.6 30.8 38.0 39.2 C38.4 47.7 30.7 84.9 28.0 98.0 C25.3 111.1 23.0 114.7 22.0 118.0" fill="none" stroke="#43403c" stroke-width="5.3" stroke-linecap="round"/><path d="M20.1 60.2 C21.0 58.0 22.6 50.7 25.6 47.2 C28.6 43.7 37.6 30.8 38.0 39.2 C38.4 47.7 30.7 84.9 28.0 98.0 C25.3 111.1 23.0 114.7 22.0 118.0" fill="none" stroke="#948e86" stroke-width="1.7" opacity="0.6" stroke-linecap="round" transform="translate(-0.6 -0.9)"/>
        <path d="M58.3 121.4 C56.0 121.1 48.9 118.8 44.5 119.4 C40.1 120.1 35.1 122.3 31.8 125.1 C28.6 128.0 21.0 127.4 24.7 136.5 C28.4 145.7 48.8 169.4 54.0 180.0 C59.2 190.6 55.7 196.7 56.0 200.0" fill="none" stroke="#1c1917" stroke-width="12.9" opacity="0.2" stroke-linecap="round" transform="translate(1.2 1.8)"/><path d="M58.3 121.4 C56.0 121.1 48.9 118.8 44.5 119.4 C40.1 120.1 35.1 122.3 31.8 125.1 C28.6 128.0 21.0 127.4 24.7 136.5 C28.4 145.7 48.8 169.4 54.0 180.0 C59.2 190.6 55.7 196.7 56.0 200.0" fill="none" stroke="#2b2724" stroke-width="7.6" stroke-linecap="round"/><path d="M58.3 121.4 C56.0 121.1 48.9 118.8 44.5 119.4 C40.1 120.1 35.1 122.3 31.8 125.1 C28.6 128.0 21.0 127.4 24.7 136.5 C28.4 145.7 48.8 169.4 54.0 180.0 C59.2 190.6 55.7 196.7 56.0 200.0" fill="none" stroke="#43403c" stroke-width="5.3" stroke-linecap="round"/><path d="M58.3 121.4 C56.0 121.1 48.9 118.8 44.5 119.4 C40.1 120.1 35.1 122.3 31.8 125.1 C28.6 128.0 21.0 127.4 24.7 136.5 C28.4 145.7 48.8 169.4 54.0 180.0 C59.2 190.6 55.7 196.7 56.0 200.0" fill="none" stroke="#948e86" stroke-width="1.7" opacity="0.6" stroke-linecap="round" transform="translate(-0.6 -0.9)"/>
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
        ${bar("dpRulFace", ["#f2dcab", "#e0c184", "#c19c56", "#e8d09a"])}
        ${bar("dpRulBrass", ["#f2e0ab", "#c9a94f", "#8a6f28", "#dcc47f"])}
        ${grain("dpRulGrain", "0.014 0.9", 6, [0.45, 0.34, 0.16], 0.5)}
        <clipPath id="dpRulBody"><rect x="18" y="6" width="40" height="408" rx="3"/></clipPath>
      </defs>
      <!-- A boxwood ruler with a brass measuring edge. It was a flat yellow
           rectangle: what it needed was the section (bar() across the width,
           so the near edge is lit and the far one picks the desk back up),
           grain running the length under the varnish, and the wear a ruler
           actually collects at the nought end. -->
      <rect x="18" y="6" width="40" height="408" rx="3" fill="url(#dpRulFace)" stroke="#94743a" stroke-width="1"/>
      <g clip-path="url(#dpRulBody)">
        <rect x="18" y="6" width="40" height="408" fill="url(#dpRulGrain)" opacity="0.4"/>
        <!-- two long figures in the wood, and the ray fleck across them -->
        <g fill="none" stroke="#a8863f" stroke-width="0.9" opacity="0.3">
          <path d="M33 4 q5 100 -1 200 q-5 100 1 214"/>
          <path d="M47 4 q-4 90 2 190 q5 96 -3 224"/>
        </g>
        <g fill="none" stroke="#f6e6bd" stroke-width="0.7" opacity="0.35">
          <path d="M26 60 q10 6 24 2"/><path d="M26 230 q12 5 26 1"/>
        </g>
        <!-- the varnish, brightest just in from the near edge -->
        <rect x="25" y="6" width="7" height="408" fill="#fff6d6" opacity="0.16"/>
      </g>
      <!-- the brass edge, its own little section: bright lip, body, dark seat -->
      <rect x="18" y="6" width="5.4" height="408" fill="url(#dpRulBrass)"/>
      <rect x="18.6" y="6" width="1.3" height="408" fill="#fbeec2" opacity="0.55"/>
      <rect x="22.6" y="6" width="0.9" height="408" fill="#6f5820" opacity="0.4"/>
      <!-- graduations, worn away at the end that gets used -->
      <g stroke="#5f4a22" stroke-linecap="butt" fill="none">
        <path d="M23 14.0 h15" stroke-width="1.1" opacity="0.72"/><path d="M23 17.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 20.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 23.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 26.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 29.0 h10" stroke-width="1" opacity="0.61"/><path d="M23 32.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 35.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 38.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 41.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 44.0 h15" stroke-width="1.1" opacity="0.72"/><path d="M23 47.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 50.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 53.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 56.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 59.0 h10" stroke-width="1" opacity="0.61"/><path d="M23 62.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 65.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 68.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 71.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 74.0 h15" stroke-width="1.1" opacity="0.72"/><path d="M23 77.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 80.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 83.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 86.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 89.0 h10" stroke-width="1" opacity="0.61"/><path d="M23 92.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 95.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 98.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 101.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 104.0 h15" stroke-width="1.1" opacity="0.72"/><path d="M23 107.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 110.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 113.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 116.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 119.0 h10" stroke-width="1" opacity="0.61"/><path d="M23 122.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 125.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 128.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 131.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 134.0 h15" stroke-width="1.1" opacity="0.72"/><path d="M23 137.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 140.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 143.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 146.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 149.0 h10" stroke-width="1" opacity="0.61"/><path d="M23 152.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 155.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 158.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 161.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 164.0 h15" stroke-width="1.1" opacity="0.72"/><path d="M23 167.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 170.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 173.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 176.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 179.0 h10" stroke-width="1" opacity="0.61"/><path d="M23 182.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 185.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 188.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 191.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 194.0 h15" stroke-width="1.1" opacity="0.72"/><path d="M23 197.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 200.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 203.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 206.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 209.0 h10" stroke-width="1" opacity="0.61"/><path d="M23 212.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 215.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 218.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 221.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 224.0 h15" stroke-width="1.1" opacity="0.72"/><path d="M23 227.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 230.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 233.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 236.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 239.0 h10" stroke-width="1" opacity="0.61"/><path d="M23 242.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 245.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 248.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 251.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 254.0 h15" stroke-width="1.1" opacity="0.72"/><path d="M23 257.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 260.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 263.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 266.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 269.0 h10" stroke-width="1" opacity="0.61"/><path d="M23 272.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 275.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 278.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 281.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 284.0 h15" stroke-width="1.1" opacity="0.72"/><path d="M23 287.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 290.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 293.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 296.0 h6" stroke-width="0.7" opacity="0.45"/><path d="M23 299.0 h10" stroke-width="1" opacity="0.61"/><path d="M23 302.0 h6" stroke-width="0.7" opacity="0.21"/><path d="M23 305.0 h6" stroke-width="0.7" opacity="0.21"/><path d="M23 308.0 h6" stroke-width="0.7" opacity="0.21"/><path d="M23 311.0 h6" stroke-width="0.7" opacity="0.21"/><path d="M23 314.0 h15" stroke-width="1.1" opacity="0.34"/><path d="M23 317.0 h6" stroke-width="0.7" opacity="0.21"/><path d="M23 320.0 h6" stroke-width="0.7" opacity="0.21"/><path d="M23 323.0 h6" stroke-width="0.7" opacity="0.21"/><path d="M23 326.0 h6" stroke-width="0.7" opacity="0.21"/><path d="M23 329.0 h10" stroke-width="1" opacity="0.29"/><path d="M23 332.0 h6" stroke-width="0.7" opacity="0.21"/><path d="M23 335.0 h6" stroke-width="0.7" opacity="0.21"/><path d="M23 338.0 h6" stroke-width="0.7" opacity="0.21"/><path d="M23 341.0 h6" stroke-width="0.7" opacity="0.21"/><path d="M23 344.0 h15" stroke-width="1.1" opacity="0.34"/><path d="M23 347.0 h6" stroke-width="0.7" opacity="0.21"/><path d="M23 350.0 h6" stroke-width="0.7" opacity="0.21"/><path d="M23 353.0 h6" stroke-width="0.7" opacity="0.21"/><path d="M23 356.0 h6" stroke-width="0.7" opacity="0.21"/><path d="M23 359.0 h10" stroke-width="1" opacity="0.29"/><path d="M23 362.0 h6" stroke-width="0.7" opacity="0.21"/><path d="M23 365.0 h6" stroke-width="0.7" opacity="0.21"/><path d="M23 368.0 h6" stroke-width="0.7" opacity="0.21"/><path d="M23 371.0 h6" stroke-width="0.7" opacity="0.21"/><path d="M23 374.0 h15" stroke-width="1.1" opacity="0.34"/><path d="M23 377.0 h6" stroke-width="0.7" opacity="0.21"/><path d="M23 380.0 h6" stroke-width="0.7" opacity="0.21"/><path d="M23 383.0 h6" stroke-width="0.7" opacity="0.21"/><path d="M23 386.0 h6" stroke-width="0.7" opacity="0.21"/><path d="M23 389.0 h10" stroke-width="1" opacity="0.29"/><path d="M23 392.0 h6" stroke-width="0.7" opacity="0.21"/><path d="M23 395.0 h6" stroke-width="0.7" opacity="0.21"/><path d="M23 398.0 h6" stroke-width="0.7" opacity="0.21"/><path d="M23 401.0 h6" stroke-width="0.7" opacity="0.21"/><path d="M23 404.0 h15" stroke-width="1.1" opacity="0.34"/>
      </g>
      <g class="dp-ruler-no"><text x="48" y="47.4">1</text><text x="48" y="77.4">2</text><text x="48" y="107.4">3</text><text x="48" y="137.4">4</text><text x="48" y="167.4">5</text><text x="48" y="197.4">6</text><text x="48" y="227.4">7</text><text x="48" y="257.4">8</text><text x="48" y="287.4">9</text><text x="48" y="317.4">10</text><text x="48" y="347.4">11</text><text x="48" y="377.4">12</text><text x="48" y="407.4">13</text></g>
      <!-- the nought end, dinged and inked where every ruler gets it -->
      <path d="M18 9 q8 -4 16 1" fill="none" stroke="#94743a" stroke-width="1.1" opacity="0.5"/>
      <path d="M40 14 q6 3 10 -1" fill="none" stroke="#3d5a7a" stroke-width="1.4" opacity="0.3" stroke-linecap="round"/>
      <path d="M44 372 q5 4 9 0" fill="none" stroke="#5c5340" stroke-width="1.1" opacity="0.25" stroke-linecap="round"/>
`,
  },
  {
    // A watch, unclasped and taken off: the case face up, the strap folded back
    // on itself the way a strap falls when it is not holding anything. Leather,
    // worn, on a small cream dial. No branding, no logo.
    id: "watch", w: 118, h: 178,
    svg: `
      <defs>
        <linearGradient id="dpWaHideCol" x1="0" y1="0" x2="1" y2="0.25"><stop offset="0" stop-color="#9a663f"/><stop offset="0.42" stop-color="#7a4c2c"/><stop offset="0.8" stop-color="#573320"/><stop offset="1" stop-color="#6b4327"/></linearGradient>
        ${bar("dpWaCase", ["#f7ecc6", "#d9bb77", "#96762f", "#e6cf95"], 100)}
        ${bar("dpWaSteel", ["#f4f0e4", "#cdc6b0", "#8d8770", "#ded7c1"], 100)}
        ${grain("dpWaHide", "1.4 1.1", 15, [0.28, 0.17, 0.09], 0.55)}
        ${sheen("dpWaGlass", "#ffffff", 0.5)}
        <clipPath id="dpWaStrap">
          <path d="M56.0 104.0 C57.7 107.0 65.0 115.8 66.0 122.0 C67.0 128.2 65.5 135.8 62.0 141.0 C58.5 146.2 51.0 151.5 45.0 153.0 C39.0 154.5 30.3 153.0 26.0 150.0 C21.7 147.0 18.2 139.3 19.0 135.0 C19.8 130.7 25.8 125.2 31.0 124.0 C36.2 122.8 43.8 125.0 50.0 128.0 C56.2 131.0 63.2 137.3 68.0 142.0 C72.8 146.7 77.2 153.7 79.0 156.0" fill="none" stroke="#000" stroke-width="29" stroke-linecap="round"/>
        </clipPath>
      </defs>
      <!-- A watch taken off and dropped face up. The long half of the strap
           curls back under itself, which is what a strap does and what the old
           one did not: the curl crosses its own tail, so it needs the same
           over-and-under any coil needs. Leather gets its grain and its real
           slanted stitches; the dashed line it had before was the giveaway
           that the strap was drawn rather than sewn. -->
      <g fill="none" stroke-linecap="round">
        <path d="M56.0 104.0 C57.7 107.0 65.0 115.8 66.0 122.0 C67.0 128.2 65.5 135.8 62.0 141.0 C58.5 146.2 51.0 151.5 45.0 153.0 C39.0 154.5 30.3 153.0 26.0 150.0 C21.7 147.0 18.2 139.3 19.0 135.0 C19.8 130.7 25.8 125.2 31.0 124.0 C36.2 122.8 43.8 125.0 50.0 128.0 C56.2 131.0 63.2 137.3 68.0 142.0 C72.8 146.7 77.2 153.7 79.0 156.0" stroke="#3f2717" stroke-width="29"/>
        <path d="M56.0 104.0 C57.7 107.0 65.0 115.8 66.0 122.0 C67.0 128.2 65.5 135.8 62.0 141.0 C58.5 146.2 51.0 151.5 45.0 153.0 C39.0 154.5 30.3 153.0 26.0 150.0 C21.7 147.0 18.2 139.3 19.0 135.0 C19.8 130.7 25.8 125.2 31.0 124.0 C36.2 122.8 43.8 125.0 50.0 128.0 C56.2 131.0 63.2 137.3 68.0 142.0 C72.8 146.7 77.2 153.7 79.0 156.0" stroke="url(#dpWaHideCol)" stroke-width="25.4"/>
      </g>
      <g clip-path="url(#dpWaStrap)">
        <rect x="0" y="86" width="118" height="92" fill="url(#dpWaHide)" opacity="0.45"/>
      </g>
      <g fill="none" stroke-linecap="round">
        <path d="M47.9 107.0L48.0 110.0M51.5 113.4L51.6 116.4M55.1 119.9L55.2 122.9M57.7 120.5L55.7 122.8M56.2 127.3L54.3 129.6M54.8 134.2L52.8 136.4M55.5 135.2L52.5 135.6M49.3 139.6L46.4 139.9M43.2 143.9L40.2 144.2M43.1 144.1L40.7 142.3M36.2 143.0L33.8 141.2M29.4 141.9L27.0 140.1M32.0 142.8L32.2 139.8M29.5 137.4L29.7 134.4M24.2 141.7L27.2 141.0M28.6 137.7L31.5 137.0M32.9 133.8L35.8 133.1M30.2 132.5L32.5 134.5M37.1 133.9L39.4 135.9M43.9 135.4L46.2 137.3M47.4 136.7L48.5 139.4M53.8 141.7L55.0 144.5M60.3 146.8L61.5 149.5M63.6 150.1L64.1 153.1M67.6 155.2L68.1 158.1M71.5 160.2L72.0 163.2" stroke="#d8bd8e" stroke-width="1" opacity="0.55"/>
        <path d="M64.0 98.0L64.1 101.0M67.6 104.5L67.7 107.5M71.2 111.0L71.3 114.0M75.7 124.3L73.7 126.6M74.2 131.1L72.3 133.4M72.8 138.0L70.8 140.2M66.1 150.3L63.1 150.6M60.0 154.6L57.0 154.9M53.8 158.9L50.9 159.2M40.2 162.3L37.8 160.5M33.4 161.2L31.0 159.4M26.5 160.1L24.1 158.3M15.3 150.6L15.5 147.6M12.8 145.2L13.0 142.2M11.8 128.1L14.7 127.4M16.1 124.2L19.0 123.5M20.4 120.2L23.4 119.5M34.0 114.5L36.3 116.5M40.9 115.9L43.2 117.9M47.7 117.4L50.0 119.3M58.7 122.2L59.8 124.9M65.1 127.2L66.3 130.0M71.6 132.2L72.8 135.0M78.1 138.8L78.6 141.7M82.0 143.8L82.5 146.8M86.0 148.8L86.5 151.8" stroke="#d8bd8e" stroke-width="1" opacity="0.4"/>
        <!-- the light along the crown of the leather -->
        <path d="M56.0 104.0 C57.7 107.0 65.0 115.8 66.0 122.0 C67.0 128.2 65.5 135.8 62.0 141.0 C58.5 146.2 51.0 151.5 45.0 153.0 C39.0 154.5 30.3 153.0 26.0 150.0 C21.7 147.0 18.2 139.3 19.0 135.0 C19.8 130.7 25.8 125.2 31.0 124.0 C36.2 122.8 43.8 125.0 50.0 128.0 C56.2 131.0 63.2 137.3 68.0 142.0 C72.8 146.7 77.2 153.7 79.0 156.0" stroke="#a8724a" stroke-width="5" opacity="0.3" transform="translate(-1 -1.6)"/>
      </g>
      <!-- the tip end, brought over the curl with its shadow under it -->
      <g fill="none" stroke-linecap="round">
        <path d="M19.0 135.0 C21.0 133.2 25.8 125.2 31.0 124.0 C36.2 122.8 43.8 125.0 50.0 128.0 C56.2 131.0 63.2 137.3 68.0 142.0 C72.8 146.7 77.2 153.7 79.0 156.0" stroke="#2a1a10" stroke-width="30" opacity="0.25"
              transform="translate(1.6 2.2)"/>
        <path d="M19.0 135.0 C21.0 133.2 25.8 125.2 31.0 124.0 C36.2 122.8 43.8 125.0 50.0 128.0 C56.2 131.0 63.2 137.3 68.0 142.0 C72.8 146.7 77.2 153.7 79.0 156.0" stroke="#3f2717" stroke-width="27.5"/>
        <path d="M19.0 135.0 C21.0 133.2 25.8 125.2 31.0 124.0 C36.2 122.8 43.8 125.0 50.0 128.0 C56.2 131.0 63.2 137.3 68.0 142.0 C72.8 146.7 77.2 153.7 79.0 156.0" stroke="url(#dpWaHideCol)" stroke-width="24"/>
        <path d="M33.5 147.9L33.7 145.0M29.1 138.6L29.3 135.6M26.2 138.8L29.1 138.1M33.7 131.9L36.6 131.2M37.6 133.2L39.9 135.2M46.5 135.0L47.7 137.8M57.7 143.8L58.9 146.5M65.3 151.0L65.8 153.9M72.1 159.7L72.6 162.7" stroke="#d8bd8e" stroke-width="1" opacity="0.5"/>
      </g>
      <!-- the short half and its buckle, the frame seen from above with the
           pin lying across it -->
      <g fill="none" stroke-linecap="round">
        <path d="M58 46 q5 -20 -4 -30" stroke="#3f2717" stroke-width="27.5"/>
        <path d="M58 46 q5 -20 -4 -30" stroke="url(#dpWaHideCol)" stroke-width="24"/>
      </g>
      <!-- the buckle: the frame the strap runs through, with the pin lying
           across it and the tongue caught in a hole it has worn oval -->
      <rect x="38" y="2" width="34" height="20" rx="4" fill="none" stroke="url(#dpWaCase)" stroke-width="3"/>
      <rect x="38" y="2" width="34" height="20" rx="4" fill="none" stroke="#7d6127" stroke-width="0.6" opacity="0.5"/>
      <path d="M55 12 h16" stroke="url(#dpWaCase)" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M40 4 v16" stroke="#fff3cd" stroke-width="0.9" opacity="0.5"/>
      <ellipse cx="57" cy="27" rx="2.6" ry="1.8" fill="#2b1a10" opacity="0.55"/>
      <ellipse cx="57" cy="36" rx="2.2" ry="1.6" fill="#2b1a10" opacity="0.4"/>
      <!-- the case: bezel, then the dial sunk inside it -->
      <circle cx="58" cy="76" r="31" fill="url(#dpWaCase)" stroke="#7d6127" stroke-width="1.1"/>
      <circle cx="58" cy="76" r="31" fill="url(#dpWaGlass)" opacity="0.25"/>
      <circle cx="58" cy="76" r="25.5" fill="#8d7743" opacity="0.5"/>
      <circle cx="58" cy="76" r="24.5" fill="#f7f2e1" stroke="#b39a5c" stroke-width="0.8"/>
      <rect x="87" y="70" width="9" height="13" rx="2.6" fill="url(#dpWaSteel)" stroke="#7d6127" stroke-width="0.7"/>
      <path d="M88 71 v11" stroke="#fffaea" stroke-width="0.8" opacity="0.6"/>
      <!-- dial: the minute track, four indices, and ten past ten -->
      <circle cx="58" cy="76" r="20.5" fill="none" stroke="#b9ab86" stroke-width="0.5" opacity="0.7"/>
      <g stroke="#6d6047" stroke-linecap="round">
        <path d="M58 57.5 v5" stroke-width="1.7"/><path d="M76.5 76 h-5" stroke-width="1.7"/>
        <path d="M58 94.5 v-5" stroke-width="1.7"/><path d="M39.5 76 h5" stroke-width="1.7"/>
      </g>
      <g stroke="#a89b7c" stroke-width="0.7" opacity="0.6">
        <path d="M71 63.5 l-2.4 2.4"/><path d="M71 88.5 l-2.4 -2.4"/>
        <path d="M45 88.5 l2.4 -2.4"/><path d="M45 63.5 l2.4 2.4"/>
      </g>
      <!-- the hands, with the shadow they drop on the dial under the crystal -->
      <g stroke="#3f3a2e" stroke-linecap="round" opacity="0.22" transform="translate(1 1.4)">
        <path d="M58 76 L45.5 66.5" stroke-width="2.2"/><path d="M58 76 L70 62" stroke-width="1.8"/>
      </g>
      <g stroke="#3f3a2e" stroke-linecap="round">
        <path d="M58 76 L45.5 66.5" stroke-width="2.2"/>
        <path d="M58 76 L70 62" stroke-width="1.8"/>
        <path d="M58 76 L62 90" stroke-width="0.8" stroke="#8a3f36"/>
      </g>
      <circle cx="58" cy="76" r="2" fill="#3f3a2e"/>
      <!-- the crystal: a soft band of window, and the hard line at its edge -->
      <path d="M38 62 q16 -12 34 -5" fill="none" stroke="#ffffff" stroke-width="7" opacity="0.16" stroke-linecap="round"/>
      <path d="M39 60 q16 -11 33 -4" fill="none" stroke="#ffffff" stroke-width="1.4" opacity="0.35" stroke-linecap="round"/>
`,
  },
];

export const PROP_BY_ID = Object.fromEntries(DESK_PROPS.map((p) => [p.id, p]));
