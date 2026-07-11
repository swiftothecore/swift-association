// Keepsake polaroids — the collectible photo set (see PLAN "Keepsakes").
// Each entry: { id, name, sub, art }.
//   id   — kebab-case handle, matches the unlock trigger and the KEEPSAKES store key.
//   name — the polaroid's own lowercase caption (main line); also the toast subject.
//   sub  — the second caption line (a lyric/quip), fainter and smaller.
//   art  — a self-contained viewBox="0 0 200 200" SVG. The shared frame (polaroidHTML)
//          adds the cream film border, washi tape, caption block and develop states, so
//          the art here is just the photo. No <?xml>/width/height — it flexes to the frame.
// Ordered as the 2026-07-03 design list. POLAROID_BY_ID is the lookup used by earnPolaroid.

export const POLAROIDS = [
  {
    id: "holiday-house",
    name: "the holiday house",
    sub: "sat quietly on that beach",
    art: `<svg viewBox="0 0 200 200" role="img"><title>Holiday House photo</title>
  <rect width="200" height="70" fill="#ccd6d2"/>
  <circle cx="164" cy="24" r="11" fill="#eae7d6"/>
  <rect x="0" y="32" width="200" height="6" fill="#d9e0da" opacity=".8"/>
  <rect x="20" y="45" width="180" height="4" fill="#d9e0da" opacity=".6"/>
  <g stroke="#8a938c" stroke-width="1.4" fill="none" stroke-linecap="round">
    <path d="M26 38 q4 -4 8 0 M34 38 q4 -4 8 0"/>
  </g>
  <rect y="70" width="200" height="42" fill="#7e9694"/>
  <g stroke="#66807d" stroke-width="1.4" fill="none" stroke-linecap="round">
    <path d="M12 80 q9 -4 18 0 q9 4 18 0"/>
    <path d="M150 78 q9 -4 18 0 q9 4 18 0"/>
    <path d="M20 96 q9 -4 18 0"/>
    <path d="M160 98 q9 -4 18 0"/>
  </g>
  <rect y="108" width="200" height="12" fill="#d9cfb2"/>
  <rect y="118" width="200" height="82" fill="#8da06e"/>
  <path d="M36 200 C 58 164 142 164 164 200" stroke="#cfc6ae" stroke-width="9" fill="none"/>
  <rect x="72" y="42" width="6" height="20" fill="#96594a"/>
  <rect x="122" y="42" width="6" height="20" fill="#96594a"/>
  <rect x="70.5" y="42" width="9" height="2.5" fill="#7c483c"/>
  <rect x="120.5" y="42" width="9" height="2.5" fill="#7c483c"/>
  <polygon points="50,80 70,58 130,58 150,80" fill="#565550"/>
  <rect x="55" y="78" width="90" height="72" fill="#f0ece0"/>
  <rect x="93" y="58" width="18" height="22" fill="#f0ece0"/>
  <polygon points="90,60 102,50 114,60" fill="#565550"/>
  <rect x="96" y="63" width="5" height="8" fill="#4a4f4c"/>
  <rect x="103" y="63" width="5" height="8" fill="#4a4f4c"/>
  <polygon points="14,110 28,96 52,96 60,110" fill="#565550"/>
  <rect x="18" y="108" width="40" height="42" fill="#f0ece0"/>
  <polygon points="140,110 148,96 172,96 186,110" fill="#565550"/>
  <rect x="142" y="108" width="40" height="42" fill="#f0ece0"/>
  <rect x="158" y="84" width="5" height="14" fill="#96594a"/>
  <g fill="#4a4f4c">
    <rect x="61" y="86" width="9" height="12"/>
    <rect x="82" y="86" width="9" height="12"/>
    <rect x="109" y="86" width="9" height="12"/>
    <rect x="130" y="86" width="9" height="12"/>
    <rect x="61" y="108" width="9" height="12"/>
    <rect x="82" y="108" width="9" height="12"/>
    <rect x="109" y="108" width="9" height="12"/>
    <rect x="130" y="108" width="9" height="12"/>
    <rect x="61" y="130" width="9" height="13"/>
    <rect x="130" y="130" width="9" height="13"/>
    <rect x="26" y="118" width="8" height="11"/>
    <rect x="42" y="118" width="8" height="11"/>
    <rect x="150" y="118" width="8" height="11"/>
    <rect x="166" y="118" width="8" height="11"/>
  </g>
  <path d="M93 130 a9 9 0 0 1 18 0 Z" fill="#e4dfd0"/>
  <rect x="95" y="130" width="14" height="20" fill="#4a4f4c"/>
  <g stroke="#f5f2e8" stroke-width="1.3" fill="none">
    <path d="M2 128 H18 M4 128 V136 M9 128 V136 M14 128 V136 M2 136 H18"/>
    <path d="M182 128 H198 M184 128 V136 M189 128 V136 M194 128 V136 M182 136 H198"/>
  </g>
  <g fill="#6c7c53">
    <circle cx="26" cy="152" r="5"/><circle cx="36" cy="153" r="5"/><circle cx="46" cy="152" r="5"/>
    <circle cx="56" cy="153" r="5"/><circle cx="66" cy="152" r="5"/><circle cx="134" cy="152" r="5"/>
    <circle cx="144" cy="153" r="5"/><circle cx="154" cy="152" r="5"/><circle cx="164" cy="153" r="5"/>
    <circle cx="174" cy="152" r="5"/>
  </g>
  <rect width="200" height="200" fill="#a3ab9e" opacity=".08"/>
  <rect width="200" height="200" fill="#d9c7a3" opacity=".07"/>
  <rect x="0.5" y="0.5" width="199" height="199" fill="none" stroke="#3f3a2e" opacity=".12"/>
</svg>`,
  },
  {
    id: "paris",
    name: "paris",
    sub: "romance is not dead",
    art: `<svg viewBox="0 0 200 200" role="img"><title>Paris photo</title>
  <rect width="200" height="200" fill="#2b3053"/>
  <rect y="106" width="200" height="54" fill="#6c6293" opacity=".38"/>
  <rect y="128" width="200" height="32" fill="#9184b5" opacity=".38"/>
  <g fill="#e9e4f4">
    <circle cx="22" cy="26" r="1.3"/><circle cx="52" cy="52" r="1"/><circle cx="172" cy="40" r="1.4"/>
    <circle cx="150" cy="20" r="1"/><circle cx="68" cy="16" r=".9"/><circle cx="184" cy="88" r="1"/>
    <circle cx="30" cy="82" r=".9"/><circle cx="136" cy="66" r=".9"/>
  </g>
  <path d="M162 50 l1.6 5 5 1.6 -5 1.6 -1.6 5 -1.6 -5 -5 -1.6 5 -1.6 z" fill="#efe9f8"/>
  <circle cx="34" cy="40" r="12" fill="#ece6f2"/>
  <circle cx="39" cy="37" r="11" fill="#2b3053"/>
  <path d="M100 22 V10" stroke="#14172c" stroke-width="2"/>
  <circle cx="100" cy="9" r="1.8" fill="#f2d98a"/>
  <path d="M97 22 L103 22 L106 58 C108 82 112 102 124 124 C132 140 142 152 154 162 L128 162 C119 150 110 140 105 128 L95 128 C90 140 81 150 72 162 L46 162 C58 152 68 140 76 124 C88 102 92 82 94 58 Z" fill="#14172c"/>
  <rect x="76" y="118" width="48" height="6" fill="#14172c"/>
  <rect x="86" y="82" width="28" height="5" fill="#14172c"/>
  <rect x="93" y="54" width="14" height="4" fill="#14172c"/>
  <g stroke="#2b3053" stroke-width="1" opacity=".5" fill="none">
    <path d="M96 34 L104 50 M104 34 L96 50 M95 60 L105 78 M105 60 L95 78 M92 90 L108 114 M108 90 L92 114"/>
  </g>
  <path d="M0 200 L0 162 h14 v-8 h10 v8 h20 v-12 h12 v12 h16 v-6 h12 v6 h32 v-10 h14 v10 h18 v-7 h12 v7 h20 v-11 h10 v11 h10 v38 Z" fill="#191d33"/>
  <g fill="#ecc979" opacity=".9">
    <rect x="8" y="170" width="2.4" height="3"/><rect x="30" y="168" width="2.4" height="3"/>
    <rect x="48" y="158" width="2.4" height="3"/><rect x="76" y="166" width="2.4" height="3"/>
    <rect x="122" y="158" width="2.4" height="3"/><rect x="140" y="170" width="2.4" height="3"/>
    <rect x="168" y="164" width="2.4" height="3"/><rect x="186" y="158" width="2.4" height="3"/>
  </g>
  <rect width="200" height="200" fill="#7c6f9e" opacity=".06"/>
  <rect x="0.5" y="0.5" width="199" height="199" fill="none" stroke="#e9e4f4" opacity=".14"/>
</svg>`,
  },
  {
    id: "starbucks-lovers",
    name: "starbucks lovers",
    sub: "got a long list of ex-lovers",
    art: `<svg viewBox="0 0 200 200" role="img"><title>Coffee cup with lovers badge, lipstick on the lid, croissant beside, cafe window behind</title>
  <defs><path id="sb3T" d="M82 102 A18.5 18.5 0 0 1 118 102"/><path id="sb3B" d="M84.5 106 A16 16 0 0 0 115.5 106"/></defs>
  <rect width="200" height="200" fill="#d8dee2"/>
  <rect x="128" y="10" width="62" height="100" fill="#e6edf0"/>
  <g fill="#c4ced4"><rect x="134" y="58" width="14" height="52"/><rect x="152" y="42" width="18" height="68"/><rect x="174" y="66" width="12" height="44"/></g>
  <g stroke="#8a938c" stroke-width="1.2" fill="none" stroke-linecap="round"><path d="M140 26 q3 -3 6 0 M148 28 q3 -3 6 0"/></g>
  <g stroke="#8a7a64" stroke-width="4" fill="none"><rect x="128" y="10" width="62" height="100"/><path d="M159 10 V110 M128 60 H190"/></g>
  <path d="M30 0 V26" stroke="#3f4a52" stroke-width="1.6"/>
  <path d="M20 38 L40 38 L36 26 L24 26 Z" fill="#3f4a52"/>
  <circle cx="30" cy="43" r="8" fill="#e8dba3" opacity=".3"/>
  <circle cx="30" cy="43" r="3.5" fill="#e8dba3"/>
  <rect y="142" width="200" height="6" fill="#a37a4e"/>
  <rect y="148" width="200" height="52" fill="#b98d5f"/>
  <g stroke="#a37a4e" stroke-width="2" opacity=".6" fill="none"><path d="M0 168 q50 5 100 0 t100 3 M0 188 q60 -5 120 0 t80 -2"/></g>
  <ellipse cx="44" cy="164" rx="21" ry="6.5" fill="#f2eee2"/>
  <path d="M28 158 Q30 148 44 148 Q58 148 60 158 Q52 162 44 162 Q36 162 28 158 Z" fill="#d09a4e"/>
  <g stroke="#a8752c" stroke-width="1.2" fill="none"><path d="M35 151 q1 5 1 9 M44 149 q0 6 0 11 M53 151 q-1 5 -1 9"/></g>
  <g fill="#a8752c" opacity=".7"><circle cx="66" cy="166" r="0.9"/><circle cx="24" cy="168" r="0.8"/><circle cx="58" cy="170" r="0.7"/></g>
  <g transform="rotate(-10 152 156)"><rect x="140" y="150" width="24" height="12" rx="2" fill="#f2eee2"/><path d="M141 152 h22 M141 160 h22" stroke="#d8d0bc" stroke-width="1" stroke-dasharray="1.5 1.5"/></g>
  <g stroke="#b9c6cc" stroke-width="2" fill="none" stroke-linecap="round"><path d="M92 40 q-4 -8 2 -14 M108 42 q4 -9 -2 -16"/></g>
  <rect x="76" y="50" width="48" height="9" rx="3" fill="#f6f2e7"/>
  <ellipse cx="90" cy="52" rx="4.5" ry="2.6" fill="#b23a3a" opacity=".85" transform="rotate(-12 90 52)"/>
  <rect x="68" y="58" width="64" height="11" rx="3" fill="#e9e2d0"/>
  <path d="M72 69 L128 69 L121 152 L79 152 Z" fill="#f6f2e7"/>
  <path d="M128 69 L121 152 L113 152 L119 69 Z" fill="#e9e2d0"/>
  <path d="M74 126 L126 126 L124.5 148 L75.5 148 Z" fill="#c9a86b"/>
  <g stroke="#b3915a" stroke-width="1" opacity=".7"><path d="M80 128 V146 M85 128 V146 M90 128 V146 M110 128 V146 M115 128 V146 M120 128 V146"/></g>
  <text x="100" y="141" font-family="Caveat,cursive" font-size="13" font-weight="600" fill="#6f4a2a" text-anchor="middle">taylor?</text>
  <circle cx="100" cy="100" r="24" fill="#1e6b4b"/>
  <circle cx="100" cy="100" r="14.5" fill="#f6f2e7"/>
  <path d="M79.5 96.5 l1.2 2.8 2.8 1.2 -2.8 1.2 -1.2 2.8 -1.2 -2.8 -2.8 -1.2 2.8 -1.2 z" fill="#f6f2e7"/>
  <path d="M120.5 96.5 l1.2 2.8 2.8 1.2 -2.8 1.2 -1.2 2.8 -1.2 -2.8 -2.8 -1.2 2.8 -1.2 z" fill="#f6f2e7"/>
  <text font-family="'Courier New',monospace" font-size="6.8" font-weight="bold" fill="#f6f2e7" letter-spacing="0.5"><textPath href="#sb3T" startOffset="50%" text-anchor="middle">STARBUCKS</textPath></text>
  <text font-family="'Courier New',monospace" font-size="6.2" font-weight="bold" fill="#f6f2e7" letter-spacing="0.8"><textPath href="#sb3B" startOffset="50%" text-anchor="middle">LOVERS</textPath></text>
  <rect x="92" y="95.5" width="7" height="5" rx="2" fill="#2b2722"/>
  <rect x="101" y="95.5" width="7" height="5" rx="2" fill="#2b2722"/>
  <path d="M98.5 97.5 h3" stroke="#2b2722" stroke-width="1.2"/>
  <path d="M96 105.5 q4 3.2 8 0 q-4 1.8 -8 0 z" fill="#b23a3a"/>
  <rect width="200" height="200" fill="#cfd8de" opacity=".07"/>
  <rect width="200" height="200" fill="#d9c7a3" opacity=".06"/>
  <rect x="0.5" y="0.5" width="199" height="199" fill="none" stroke="#3f3a2e" opacity=".12"/>
</svg>`,
  },
  {
    id: "neighbors-dog",
    name: "the neighbor's dog",
    sub: "dyed it key lime green",
    art: `<svg viewBox="0 0 200 200" role="img"><title>A dog freshly dyed key lime green sitting proudly beside the dye bucket in a formal garden with a fountain</title>
  <rect width="200" height="200" fill="#ccd4cd"/>
  <rect y="36" width="200" height="6" fill="#dae0da" opacity=".8"/>
  <rect y="88" width="200" height="24" fill="#8a996b"/>
  <g fill="#8a996b"><circle cx="12" cy="88" r="7"/><circle cx="40" cy="87" r="8"/><circle cx="68" cy="88" r="7"/><circle cx="132" cy="88" r="7"/><circle cx="160" cy="87" r="8"/><circle cx="188" cy="88" r="7"/></g>
  <circle cx="28" cy="72" r="11" fill="#7f8f60"/>
  <rect x="26" y="82" width="4" height="14" fill="#6f5140"/>
  <circle cx="176" cy="74" r="10" fill="#7f8f60"/>
  <rect x="174" y="83" width="4" height="13" fill="#6f5140"/>
  <ellipse cx="100" cy="86" rx="10" ry="3" fill="#d8d2c4"/>
  <rect x="96" y="86" width="8" height="18" fill="#c9c3b4"/>
  <ellipse cx="100" cy="106" rx="24" ry="5.5" fill="#d8d2c4"/>
  <g stroke="#b9c6cc" stroke-width="1.6" fill="none" stroke-linecap="round"><path d="M96 84 q-6 8 -10 18 M104 84 q6 8 10 18 M100 83 q0 10 0 19"/></g>
  <rect y="110" width="200" height="90" fill="#9aa878"/>
  <path d="M148 138 Q146 128 152 126 L168 126 Q174 128 172 138 L169 160 L151 160 Z" fill="#8b98a3"/>
  <ellipse cx="160" cy="128" rx="11" ry="3.5" fill="#6f7a84"/>
  <ellipse cx="160" cy="128" rx="8" ry="2.4" fill="#b7d24b"/>
  <path d="M150 126 q10 -12 20 0" stroke="#6f7a84" stroke-width="2" fill="none"/>
  <g transform="rotate(24 178 142)"><rect x="174" y="118" width="4" height="28" rx="2" fill="#a8814e"/><rect x="171" y="144" width="10" height="10" rx="2" fill="#c9c3b4"/><rect x="171" y="151" width="10" height="4" fill="#b7d24b"/></g>
  <g fill="#8fb03a" opacity=".85">
    <circle cx="140" cy="164" r="1.4"/><circle cx="144" cy="167" r="1.1"/><circle cx="137" cy="168" r="1"/>
    <circle cx="122" cy="158" r="1.4"/><circle cx="126" cy="161" r="1.1"/><circle cx="119" cy="162" r="1"/>
  </g>
  <ellipse cx="84" cy="170" rx="24" ry="4" fill="#8fb03a" opacity=".8"/>
  <g stroke="#8fb03a" stroke-width="1.6" fill="none" stroke-linecap="round"><path d="M76 152 q-1 8 -2 14 M88 154 q0 7 0 12 M96 150 q1 8 2 14"/></g>
  <circle cx="98" cy="146" r="16" fill="#b7d24b"/>
  <ellipse cx="79" cy="142" rx="13" ry="15" fill="#b7d24b"/>
  <path d="M112 152 q8 6 4 14" stroke="#b7d24b" stroke-width="5" fill="none" stroke-linecap="round"/>
  <rect x="68" y="152" width="5" height="16" rx="2" fill="#a3c243"/>
  <rect x="78" y="153" width="5" height="16" rx="2" fill="#b7d24b"/>
  <rect x="96" y="160" width="12" height="6" rx="3" fill="#a3c243"/>
  <path d="M74 128 Q72 116 72 112" stroke="#b7d24b" stroke-width="10" stroke-linecap="round" fill="none"/>
  <circle cx="72" cy="112" r="12" fill="#b7d24b"/>
  <ellipse cx="60" cy="117" rx="7" ry="5" fill="#c8de70"/>
  <circle cx="55" cy="115" r="2" fill="#2b2722"/>
  <path d="M74 102 q4 -8 10 -8 q2 8 -6 13 z" fill="#9dbd3a"/>
  <path d="M68 108 q3 -2 5 0" stroke="#2b2722" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M59 121 q3 2 6 1" stroke="#2b2722" stroke-width="1.1" fill="none" stroke-linecap="round"/>
  <path d="M66 126 q8 5 16 3" stroke="#b23a3a" stroke-width="3.5" fill="none"/>
  <g stroke="#8fb03a" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".85"><path d="M70 134 q-1 5 -1 9 M84 136 q0 5 0 9 M92 138 q1 5 1 8"/></g>
  <g fill="#8fb03a"><circle cx="58" cy="132" r="1.3"/><circle cx="104" cy="132" r="1.3"/><circle cx="112" cy="142" r="1.2"/></g>
  <rect width="200" height="200" fill="#a3ab9e" opacity=".08"/>
  <rect width="200" height="200" fill="#d9c7a3" opacity=".07"/>
  <rect x="0.5" y="0.5" width="199" height="199" fill="none" stroke="#3f3a2e" opacity=".12"/>
</svg>`,
  },
  {
    id: "interview-um",
    name: "i think, for me, um...",
    sub: "every interview, ever",
    art: `<svg viewBox="0 0 200 200" role="img"><title>Interview podium with three microphones, a water glass and an on-air sign against stage curtains</title>
  <rect width="200" height="200" fill="#322f38"/>
  <g stroke="#3c3844" stroke-width="3" fill="none" opacity=".9">
    <path d="M12 0 q4 100 -2 200 M36 0 q-4 100 2 200 M60 0 q4 100 -2 200 M84 0 q-3 100 2 200 M110 0 q4 100 -2 200 M134 0 q-4 100 2 200 M158 0 q4 100 -2 200 M182 0 q-3 100 2 200"/>
  </g>
  <circle cx="100" cy="96" r="62" fill="#413c48" opacity=".8"/>
  <circle cx="100" cy="96" r="38" fill="#4a4452"/>
  <g fill="#d9d0bc" opacity=".3"><circle cx="80" cy="56" r="1"/><circle cx="118" cy="48" r="0.8"/><circle cx="98" cy="66" r="0.7"/></g>
  <rect x="132" y="16" width="54" height="22" rx="4" fill="#1f1c24" stroke="#c25353" stroke-width="1.5"/>
  <text x="159" y="31" font-family="'Courier New',monospace" font-size="10" font-weight="bold" fill="#e06a6a" text-anchor="middle" letter-spacing="1.5">ON AIR</text>
  <circle cx="140" cy="21" r="1.6" fill="#e06a6a"/>
  <path d="M80 128 Q78 106 78 100" stroke="#26232c" stroke-width="2.5" fill="none"/>
  <path d="M100 128 V96" stroke="#26232c" stroke-width="2.5" fill="none"/>
  <path d="M120 128 Q124 108 124 102" stroke="#26232c" stroke-width="2.5" fill="none"/>
  <circle cx="78" cy="96" r="7.5" fill="#6e6a76"/>
  <circle cx="100" cy="90" r="8.5" fill="#8b5a5a"/>
  <circle cx="124" cy="98" r="7.5" fill="#5c6e7e"/>
  <rect x="64" y="106" width="17" height="11" rx="1.5" fill="#d9d0bc"/>
  <text x="72.5" y="114.5" font-family="'Courier New',monospace" font-size="8" font-weight="bold" fill="#2b2722" text-anchor="middle">13</text>
  <rect x="119" y="110" width="17" height="11" rx="1.5" fill="#d9d0bc"/>
  <path d="M127.5 114.5 q-2.6 -3 -4.4 -0.9 q-1.4 1.4 0.4 2.9 l4 3 4 -3 q1.8 -1.5 0.4 -2.9 q-1.8 -2.1 -4.4 0.9 z" fill="#b23a3a"/>
  <rect x="62" y="126" width="76" height="8" rx="2" fill="#8a7050"/>
  <path d="M60 200 L66 134 L134 134 L140 200 Z" fill="#6f5a42"/>
  <path d="M64 152 q36 5 72 0 M62 176 q38 5 76 0" stroke="#5c4a36" stroke-width="1.4" fill="none" opacity=".7"/>
  <circle cx="100" cy="166" r="11" fill="none" stroke="#d4a017" stroke-width="1.6"/>
  <text x="100" y="170.5" font-family="'Courier New',monospace" font-size="11" font-weight="bold" fill="#d4a017" text-anchor="middle">13</text>
  <g stroke="#b9c6cc" stroke-width="1.6" fill="none"><path d="M146 112 L148 126 M158 112 L156 126"/><ellipse cx="152" cy="112" rx="6" ry="2" /><path d="M147.5 119 Q152 121 156.5 119"/></g>
  <ellipse cx="152" cy="126" rx="5" ry="1.6" fill="#b9c6cc" opacity=".7"/>
  <g stroke="#232126" stroke-width="2.5" fill="none"><path d="M66 196 q-10 2 -22 2 M134 196 q10 2 22 2"/></g>
  <rect width="200" height="200" fill="#d9c7a3" opacity=".04"/>
  <rect x="0.5" y="0.5" width="199" height="199" fill="none" stroke="#e9e4f4" opacity=".12"/>
</svg>`,
  },
  {
    id: "debutation",
    name: "debutation",
    sub: "look what you made me do",
    art: `<svg viewBox="0 0 200 200" role="img"><title>Snake in a cowboy hat performing at a vintage microphone under a spotlight</title>
  <rect width="200" height="200" fill="#2e2c31"/>
  <polygon points="70,0 130,0 172,152 28,152" fill="#47424d" opacity=".55"/>
  <polygon points="82,0 118,0 150,152 50,152" fill="#544e5b" opacity=".5"/>
  <g fill="#d4a017"><circle cx="24" cy="36" r="1"/><circle cx="176" cy="28" r="1.2"/><circle cx="40" cy="88" r="0.9"/><circle cx="182" cy="100" r="1"/></g>
  <path d="M160 52 l1.4 4.2 4.2 1.4 -4.2 1.4 -1.4 4.2 -1.4 -4.2 -4.2 -1.4 4.2 -1.4 z" fill="#d4a017"/>
  <path d="M30 60 l1 3 3 1 -3 1 -1 3 -1 -3 -3 -1 3 -1 z" fill="#d4a017" opacity=".7"/>
  <rect y="152" width="200" height="48" fill="#26232a"/>
  <g stroke="#1b1920" stroke-width="1.5"><path d="M0 152 H200 M28 152 L20 200 M84 152 L80 200 M140 152 L144 200 M184 152 L192 200"/></g>
  <g fill="#d4a017" opacity=".7"><circle cx="52" cy="162" r="1"/><circle cx="120" cy="172" r="1.1"/><circle cx="88" cy="188" r="0.9"/><circle cx="160" cy="180" r="1"/></g>
  <ellipse cx="42" cy="172" rx="15" ry="5" fill="none" stroke="#8a6a4a" stroke-width="2.5"/>
  <ellipse cx="42" cy="169" rx="11" ry="3.6" fill="none" stroke="#8a6a4a" stroke-width="2"/>
  <path d="M56 174 q8 2 10 8" stroke="#8a6a4a" stroke-width="2" fill="none" stroke-linecap="round"/>
  <ellipse cx="152" cy="184" rx="11" ry="3.5" fill="#191721"/>
  <rect x="150" y="112" width="4" height="72" fill="#3a3540"/>
  <g transform="rotate(-30 146 106)">
    <rect x="136" y="100" width="22" height="12" rx="6" fill="#8b8272"/>
    <path d="M140 102 v8 M145 101 v10 M150 101 v10 M155 102 v8" stroke="#6f675a" stroke-width="1.2"/>
  </g>
  <circle cx="151" cy="112" r="3" fill="#2b2830"/>
  <ellipse cx="96" cy="146" rx="36" ry="12" fill="#46444d"/>
  <ellipse cx="96" cy="131" rx="28" ry="10" fill="#504e58"/>
  <ellipse cx="96" cy="118" rx="20" ry="8" fill="#5a5863"/>
  <g fill="#d4a017" opacity=".7">
    <path d="M72 143 l3 3 -3 3 -3 -3 z"/><path d="M96 145 l3 3 -3 3 -3 -3 z"/><path d="M120 143 l3 3 -3 3 -3 -3 z"/>
    <path d="M84 128 l2.6 2.6 -2.6 2.6 -2.6 -2.6 z"/><path d="M108 128 l2.6 2.6 -2.6 2.6 -2.6 -2.6 z"/>
    <path d="M96 114 l2.4 2.4 -2.4 2.4 -2.4 -2.4 z"/>
  </g>
  <path d="M108 116 C110 106 106 100 102 96" stroke="#5a5863" stroke-width="9" fill="none" stroke-linecap="round"/>
  <ellipse cx="99" cy="93" rx="9" ry="6.5" fill="#5a5863"/>
  <circle cx="96" cy="91" r="1.6" fill="#f2eee2"/>
  <circle cx="95.6" cy="91" r="0.8" fill="#191722"/>
  <path d="M90 94 q-6 1 -8 -1 M90 94 q-5 3 -8 3" stroke="#c25a5a" stroke-width="1.2" fill="none"/>
  <path d="M91 85 Q91 71 99 71 Q107 71 107 85 Z" fill="#9a6a3d"/>
  <path d="M99 71 q0 5 0 9" stroke="#7c4f2a" stroke-width="1.4"/>
  <rect x="91" y="80" width="16" height="3.5" fill="#5c3a1e"/>
  <ellipse cx="99" cy="85" rx="15" ry="4.5" fill="#8a5a33"/>
  <path d="M86 87.5 q13 3 26 0" stroke="#5c3a1e" stroke-width="1" stroke-dasharray="2 2" fill="none"/>
  <rect width="200" height="200" fill="#d4a017" opacity=".05"/>
  <rect x="0.5" y="0.5" width="199" height="199" fill="none" stroke="#e9e4f4" opacity=".12"/>
</svg>`,
  },
  {
    id: "yes-whale",
    name: "yes, whale!",
    sub: "- taylor alison swift",
    art: `<svg viewBox="0 0 200 200" role="img"><title>Whale tail rising from the sea with a sailboat on the horizon</title>
  <rect width="200" height="108" fill="#cfdae0"/>
  <circle cx="40" cy="30" r="11" fill="#eae7d6"/>
  <ellipse cx="120" cy="26" rx="20" ry="6" fill="#e3eaee"/>
  <ellipse cx="170" cy="46" rx="15" ry="5" fill="#e3eaee"/>
  <g stroke="#8a938c" stroke-width="1.4" fill="none" stroke-linecap="round"><path d="M56 44 q4 -4 8 0 M64 44 q4 -4 8 0 M148 62 q3 -3 6 0 M154 62 q3 -3 6 0"/></g>
  <path d="M170 90 L170 76 L179 88 Z" fill="#f2eee2"/>
  <path d="M170 76 V90" stroke="#3a4652" stroke-width="1.2"/>
  <path d="M162 90 L182 90 L178 95 L165 95 Z" fill="#27384a"/>
  <rect y="108" width="200" height="26" fill="#6d94a8"/>
  <rect y="134" width="200" height="30" fill="#5f8aa0"/>
  <rect y="164" width="200" height="36" fill="#567d92"/>
  <g stroke="#dbe7ec" stroke-width="1.6" stroke-linecap="round" opacity=".7"><path d="M16 114 h10 M34 118 h7 M130 112 h9 M148 118 h6"/></g>
  <path d="M94 128 C93 106 88 90 72 70 C87 74 95 82 98 91 C99 85 103 78 107 74 C114 67 121 64 130 62 C114 86 109 104 108 128 Z" fill="#27384a"/>
  <g fill="#dfe7ec"><circle cx="114" cy="76" r="1"/><circle cx="119" cy="71" r="0.8"/><circle cx="110" cy="86" r="1.1"/><circle cx="80" cy="76" r="0.9"/><circle cx="87" cy="83" r="0.8"/><circle cx="104" cy="98" r="0.9"/></g>
  <ellipse cx="100" cy="128" rx="30" ry="6" fill="none" stroke="#dbe7ec" stroke-width="2.5"/>
  <g stroke="#dbe7ec" stroke-width="2" fill="none" stroke-linecap="round">
    <path d="M74 124 q12 -8 26 -5 M102 120 q14 -4 26 5"/>
    <path d="M64 132 q8 6 18 5 M120 137 q10 1 18 -5"/>
  </g>
  <g stroke="#cfe0e8" stroke-width="1.6" fill="none" stroke-linecap="round"><path d="M70 112 q-3 -8 2 -14 M132 108 q4 -8 0 -14 M96 58 q1 -5 4 -8"/></g>
  <g fill="#d7e4ea"><circle cx="66" cy="102" r="2"/><circle cx="60" cy="116" r="1.5"/><circle cx="138" cy="98" r="2.2"/><circle cx="144" cy="112" r="1.5"/><circle cx="101" cy="52" r="1.4"/><circle cx="122" cy="52" r="1.1"/><circle cx="82" cy="60" r="1"/><circle cx="90" cy="48" r="0.9"/></g>
  <g stroke="#4e7890" stroke-width="1.5" fill="none" stroke-linecap="round">
    <path d="M14 148 q10 -5 20 0 q10 5 20 0"/>
    <path d="M136 152 q10 -5 20 0 q10 5 20 0"/>
    <path d="M36 176 q10 -5 20 0 q10 5 20 0 q10 -5 20 0"/>
    <path d="M20 190 q10 -5 20 0 M148 188 q10 -5 20 0"/>
  </g>
  <ellipse cx="100" cy="140" rx="44" ry="7" fill="none" stroke="#4e7890" stroke-width="1.2" opacity=".6"/>
  <rect width="200" height="200" fill="#9fb8c4" opacity=".07"/>
  <rect x="0.5" y="0.5" width="199" height="199" fill="none" stroke="#3f3a2e" opacity=".12"/>
</svg>`,
  },
  {
    id: "cornelia-street",
    name: "cornelia street",
    sub: "i rent a place there",
    art: `<svg viewBox="0 0 200 200" role="img"><title>Cornelia Street sign on a brick wall with string lights, a fire escape and a leaning bicycle</title>
  <rect width="200" height="200" fill="#a2624d"/>
  <g stroke="#8a4f3d" stroke-width="1.2" opacity=".7" fill="none">
    <path d="M0 24 H200 M0 48 H200 M0 72 H200 M0 96 H200 M0 120 H200 M0 144 H200 M0 168 H200"/>
    <path d="M30 0 V24 M90 0 V24 M150 0 V24 M60 24 V48 M120 24 V48 M180 24 V48 M30 48 V72 M90 48 V72 M150 48 V72 M60 72 V96 M120 72 V96 M180 72 V96 M30 96 V120 M90 96 V120 M150 96 V120 M60 120 V144 M120 120 V144 M180 120 V144 M30 144 V168 M90 144 V168 M150 144 V168 M60 168 V178 M120 168 V178"/>
  </g>
  <g fill="#96543f" opacity=".8"><rect x="30" y="24" width="30" height="24"/><rect x="120" y="96" width="30" height="24"/><rect x="0" y="120" width="30" height="24"/><rect x="90" y="144" width="30" height="24"/></g>
  <path d="M0 10 Q100 26 200 8" stroke="#3a3531" stroke-width="1.4" fill="none"/>
  <g fill="#e8c97a"><circle cx="25" cy="13.5" r="4" opacity=".25"/><circle cx="25" cy="13.5" r="2"/><circle cx="62" cy="17.5" r="4" opacity=".25"/><circle cx="62" cy="17.5" r="2"/><circle cx="100" cy="19" r="4" opacity=".25"/><circle cx="100" cy="19" r="2"/><circle cx="138" cy="17" r="4" opacity=".25"/><circle cx="138" cy="17" r="2"/><circle cx="175" cy="12.5" r="4" opacity=".25"/><circle cx="175" cy="12.5" r="2"/></g>
  <rect x="136" y="28" width="36" height="46" fill="#e8c97a"/>
  <g stroke="#6f4433" stroke-width="3" fill="none"><rect x="136" y="28" width="36" height="46"/><path d="M154 28 V74 M136 50 H172"/></g>
  <rect x="132" y="74" width="44" height="9" rx="1" fill="#6f4433"/>
  <g fill="#c25a5a"><circle cx="139" cy="73" r="2.5"/><circle cx="147" cy="71.5" r="2.5"/><circle cx="155" cy="73" r="2.5"/><circle cx="163" cy="71.5" r="2.5"/><circle cx="170" cy="73" r="2.5"/></g>
  <g stroke="#5f7047" stroke-width="1.4" fill="none"><path d="M142 70 l-2 -4 M151 69 l0 -4 M160 70 l2 -4 M167 69 l1 -4"/></g>
  <g stroke="#3a3531" stroke-width="2" fill="none">
    <path d="M182 96 V178 M196 96 V178 M182 100 H196 M182 124 H196 M182 148 H196 M182 100 L196 124 M196 100 L182 124 M182 124 L196 148 M196 124 L182 148 M186 148 L192 178"/>
  </g>
  <rect y="178" width="200" height="22" fill="#8b8272"/>
  <path d="M0 178 H200" stroke="#6f675a" stroke-width="1.5"/>
  <rect x="40" y="24" width="5" height="154" fill="#2f3d35"/>
  <circle cx="42.5" cy="23" r="3" fill="#2f3d35"/>
  <rect x="45" y="30" width="60" height="18" rx="2" fill="#1e6b4b" stroke="#e9e4d6" stroke-width="1.4"/>
  <text x="75" y="42.5" font-family="'Courier New',monospace" font-size="10" font-weight="bold" fill="#f2eee2" text-anchor="middle" letter-spacing="0.5">W 4 ST</text>
  <rect x="45" y="54" width="104" height="24" rx="2" fill="#1e6b4b" stroke="#e9e4d6" stroke-width="1.5"/>
  <text x="97" y="70.5" font-family="'Courier New',monospace" font-size="12" font-weight="bold" fill="#f2eee2" text-anchor="middle" letter-spacing="1">CORNELIA ST</text>
  <g stroke="#2f3d35" stroke-width="2.5" fill="none">
    <circle cx="66" cy="162" r="12"/><circle cx="104" cy="162" r="12"/>
    <path d="M66 162 L81 140 L104 162 M81 140 L76 162 M104 162 L99 136 M94 136 h9 q3 0 3 3 M76 138 h10"/>
  </g>
  <circle cx="66" cy="162" r="2" fill="#2f3d35"/>
  <circle cx="104" cy="162" r="2" fill="#2f3d35"/>
  <path d="M26 152 q-3 -4 -6 -1 q-2 2 1 5 l5 4 5 -4 q3 -3 1 -5 q-3 -3 -6 1 z" fill="#e9c9d0" opacity=".9"/>
  <rect width="200" height="200" fill="#e8a3b6" opacity=".07"/>
  <rect width="200" height="200" fill="#d9c7a3" opacity=".05"/>
  <rect x="0.5" y="0.5" width="199" height="199" fill="none" stroke="#3f3a2e" opacity=".12"/>
</svg>`,
  },
  {
    id: "getaway-car",
    name: "getaway car",
    sub: "nothing good starts in it",
    art: `<svg viewBox="0 0 200 200" role="img"><title>Sleek vintage luxury car with whitewall tires escaping past a motel at night</title>
  <rect width="200" height="200" fill="#23222b"/>
  <circle cx="32" cy="30" r="10" fill="#e9e4d4"/>
  <circle cx="36" cy="27" r="9" fill="#23222b"/>
  <g fill="#d9d0bc" opacity=".8"><circle cx="70" cy="16" r="0.9"/><circle cx="102" cy="32" r="1.1"/><circle cx="56" cy="52" r="0.8"/><circle cx="86" cy="60" r="0.7"/></g>
  <path d="M0 140 V96 h22 v-8 h14 v8 h26 v-14 h16 v14 h20 v-6 h14 v6 h88 v40 Z" fill="#1b1a22"/>
  <g fill="#e8c97a" opacity=".8"><rect x="28" y="104" width="4" height="6"/><rect x="66" y="94" width="4" height="6"/><rect x="96" y="108" width="4" height="6"/></g>
  <rect x="124" y="18" width="64" height="28" rx="3" fill="#191821" stroke="#3f3c48" stroke-width="1.5"/>
  <text x="156" y="38" font-family="'Courier New',monospace" font-size="13" font-weight="bold" fill="#e06a7e" text-anchor="middle" letter-spacing="2">MOTEL</text>
  <g fill="#d4a017"><circle cx="186" cy="52" r="1.8"/><circle cx="180" cy="62" r="1.8"/><circle cx="174" cy="72" r="1.8"/><circle cx="168" cy="82" r="1.8"/></g>
  <rect x="150" y="46" width="5" height="94" fill="#3f3c48"/>
  <rect y="140" width="200" height="60" fill="#34323c"/>
  <path d="M0 176 H200" stroke="#d9d0bc" stroke-width="3" stroke-dasharray="14 12" opacity=".8"/>
  <ellipse cx="40" cy="192" rx="20" ry="4" fill="#2b2a34"/>
  <path d="M30 192 q5 -2 10 0 q5 2 10 0" stroke="#e06a7e" stroke-width="1.4" fill="none" opacity=".5"/>
  <g stroke="#e06a7e" stroke-width="2" fill="none" opacity=".35"><path d="M148 148 q3 7 -1 13 M153 166 q3 6 -1 11"/></g>
  <polygon points="46,127 4,116 4,140" fill="#e8dba3" opacity=".45"/>
  <ellipse cx="26" cy="146" rx="24" ry="4" fill="#e8dba3" opacity=".22"/>
  <g fill="#3f3c48" opacity=".65"><circle cx="164" cy="134" r="6"/><circle cx="173" cy="138" r="5"/><circle cx="181" cy="132" r="4"/><circle cx="188" cy="136" r="3"/></g>
  <path d="M46 138 Q43 128 52 123 L94 120 L106 106 Q108 104 112 104 L128 104 Q131 104 133 106 L150 122 Q158 125 158 132 Q158 136 155 138 Z" fill="#cbb98e"/>
  <path d="M97 120 L107 107 Q109 105.5 112 105.5 L127 105.5 Q129 105.5 131 107 L145 120 Z" fill="#23222c"/>
  <path d="M116 120 V106" stroke="#cbb98e" stroke-width="2.5"/>
  <circle cx="108" cy="115" r="3.5" fill="#3b3846"/>
  <circle cx="124" cy="115" r="3.5" fill="#3b3846"/>
  <path d="M52 123 L152 123" stroke="#e9edf0" stroke-width="1.5" opacity=".8"/>
  <path d="M112 123 V135" stroke="#b3a37a" stroke-width="1.2"/>
  <path d="M116 126 h6" stroke="#e9edf0" stroke-width="1.6"/>
  <path d="M56 135 H150" stroke="#e9edf0" stroke-width="1" opacity=".6"/>
  <path d="M110 101 Q120 99 128 101" stroke="#f2eee2" stroke-width="1.2" fill="none" opacity=".5"/>
  <rect x="40" y="130" width="9" height="4.5" rx="2" fill="#dfe4e8"/>
  <rect x="152" y="130" width="9" height="4.5" rx="2" fill="#dfe4e8"/>
  <path d="M52 119 v-4" stroke="#e9edf0" stroke-width="1.6"/>
  <circle cx="52" cy="114" r="1.2" fill="#e9edf0"/>
  <circle cx="49" cy="127" r="3" fill="#f2e2a0"/>
  <circle cx="49" cy="127" r="3" fill="none" stroke="#e9edf0" stroke-width="1"/>
  <circle cx="156" cy="127" r="2" fill="#c25a5a"/>
  <path d="M161 127 h20" stroke="#c25a5a" stroke-width="1.6" opacity=".5"/>
  <circle cx="74" cy="138" r="10" fill="#15141c"/>
  <circle cx="74" cy="138" r="6.5" fill="none" stroke="#e9e4d6" stroke-width="2"/>
  <circle cx="74" cy="138" r="3" fill="#cfd4da"/>
  <path d="M71 135 l6 6 M77 135 l-6 6" stroke="#8a8f9a" stroke-width="1"/>
  <circle cx="138" cy="138" r="10" fill="#15141c"/>
  <circle cx="138" cy="138" r="6.5" fill="none" stroke="#e9e4d6" stroke-width="2"/>
  <circle cx="138" cy="138" r="3" fill="#cfd4da"/>
  <path d="M135 135 l6 6 M141 135 l-6 6" stroke="#8a8f9a" stroke-width="1"/>
  <g stroke="#6f6a76" stroke-width="2" stroke-linecap="round" opacity=".8"><path d="M164 108 h26 M170 118 h22 M166 98 h18"/></g>
  <rect width="200" height="200" fill="#d4a017" opacity=".04"/>
  <rect x="0.5" y="0.5" width="199" height="199" fill="none" stroke="#e9e4f4" opacity=".12"/>
</svg>`,
  },
  {
    id: "seven",
    name: "seven",
    sub: "picture me in the trees",
    art: `<svg viewBox="0 0 200 200" role="img"><title>Rope swing in deep misty woods with light shafts and a small bird on the branch</title>
  <rect width="200" height="200" fill="#c9d1c8"/>
  <polygon points="60,0 78,0 40,200 22,200" fill="#e3e7de" opacity=".3"/>
  <polygon points="120,0 132,0 160,200 148,200" fill="#e3e7de" opacity=".22"/>
  <rect x="58" y="26" width="5" height="150" fill="#b3ada0" opacity=".5"/>
  <rect x="142" y="26" width="6" height="150" fill="#b3ada0" opacity=".5"/>
  <rect x="30" y="20" width="8" height="160" fill="#8a857a" opacity=".75"/>
  <rect x="166" y="20" width="9" height="160" fill="#8a857a" opacity=".75"/>
  <rect width="200" height="26" fill="#55604f"/>
  <g fill="#55604f"><circle cx="8" cy="26" r="9"/><circle cx="32" cy="24" r="10"/><circle cx="56" cy="27" r="9"/><circle cx="80" cy="24" r="10"/><circle cx="104" cy="27" r="9"/><circle cx="128" cy="24" r="10"/><circle cx="152" cy="27" r="9"/><circle cx="176" cy="24" r="10"/><circle cx="196" cy="26" r="9"/></g>
  <g stroke="#55604f" stroke-width="1.4" fill="none"><path d="M48 32 q1 8 0 14 M48 40 l-3 3 M48 40 l3 3 M156 34 q1 7 0 12 M156 40 l-3 3 M156 40 l3 3"/></g>
  <rect x="8" width="16" height="200" fill="#6f6a5e"/>
  <rect x="176" width="18" height="200" fill="#6f6a5e"/>
  <g stroke="#5c574c" stroke-width="1" opacity=".6"><path d="M13 20 q2 40 -1 80 M19 60 q1 50 -1 90 M182 30 q2 44 -1 88 M188 80 q1 40 -1 80"/></g>
  <path d="M64 34 Q100 28 140 38" stroke="#5c574c" stroke-width="7" fill="none" stroke-linecap="round"/>
  <circle cx="90" cy="32.5" r="2.2" fill="#4a4639"/>
  <circle cx="112" cy="33.5" r="2.2" fill="#4a4639"/>
  <path d="M134 34 Q133 30.5 136.5 30 Q139.5 29.7 139.8 32 L141.4 32.6 L139.6 33.2 Q138.8 34 137.8 34.1" stroke="#4a4639" stroke-width="1.4" fill="none"/>
  <path d="M134 34 l-3.6 -2" stroke="#4a4639" stroke-width="1.4" fill="none"/>
  <path d="M90 34 L88 122 M112 35 L114 122" stroke="#8b8272" stroke-width="2"/>
  <rect x="80" y="121" width="42" height="7" rx="2.5" fill="#7a5c3e"/>
  <path d="M84 124.5 h34" stroke="#6a4e32" stroke-width="1"/>
  <path d="M86 120 v9 M116 120 v9" stroke="#8b8272" stroke-width="1.2"/>
  <rect y="78" width="200" height="10" fill="#dde2da" opacity=".85"/>
  <rect y="132" width="200" height="7" fill="#dde2da" opacity=".55"/>
  <rect y="186" width="200" height="14" fill="#b3bcae"/>
  <ellipse cx="60" cy="190" rx="8" ry="3" fill="#a8a396"/>
  <ellipse cx="136" cy="193" rx="6" ry="2.5" fill="#a8a396"/>
  <g fill="#8a857a"><circle cx="48" cy="182" r="1.2"/><circle cx="76" cy="192" r="1.1"/><circle cx="106" cy="184" r="1.2"/><circle cx="124" cy="196" r="1"/><circle cx="160" cy="188" r="1.2"/></g>
  <g stroke="#7d8a6c" stroke-width="1.6" fill="none" stroke-linecap="round">
    <path d="M40 192 q2 -16 10 -22 M46 192 q1 -12 7 -17 M52 194 q0 -10 5 -14"/>
    <path d="M156 192 q-2 -16 -10 -22 M150 192 q-1 -12 -7 -17 M144 194 q0 -10 -5 -14"/>
  </g>
  <path d="M68 186 q0 -6 0 -8 M68 178 q-4 0 -5 3 q3 1 5 -3 q4 0 5 3 q-3 1 -5 -3" stroke="#b3a68e" stroke-width="1.6" fill="none"/>
  <rect width="200" height="200" fill="#a3ab9e" opacity=".08"/>
  <rect width="200" height="200" fill="#d9c7a3" opacity=".06"/>
  <rect x="0.5" y="0.5" width="199" height="199" fill="none" stroke="#3f3a2e" opacity=".12"/>
</svg>`,
  },
  {
    id: "christmas-tree-farm",
    name: "christmas tree farm",
    sub: "in my heart",
    art: `<svg viewBox="0 0 200 200" role="img"><title>Snowy Christmas tree farm at dusk with a farmhouse, fence and red sled</title>
  <rect width="200" height="70" fill="#ddc9d2"/>
  <rect y="70" width="200" height="48" fill="#cfd3de"/>
  <circle cx="168" cy="26" r="8" fill="#f2ecdc"/>
  <circle cx="171" cy="24" r="7" fill="#ddc9d2"/>
  <g fill="#f6f2e7" opacity=".9"><circle cx="30" cy="18" r="1"/><circle cx="76" cy="12" r="0.9"/><circle cx="120" cy="22" r="1"/></g>
  <g stroke="#c4c9d6" stroke-width="1.6" fill="none" stroke-linecap="round"><path d="M52 76 q-3 -8 3 -13 M56 66 q-2 -6 2 -10"/></g>
  <rect x="48" y="76" width="5" height="10" fill="#6f4433"/>
  <polygon points="20,92 42,74 64,92" fill="#5c3a30"/>
  <path d="M20 92 L42 74 L64 92" stroke="#eef0ea" stroke-width="3" fill="none"/>
  <rect x="24" y="92" width="36" height="24" fill="#8a4a3f"/>
  <rect x="38" y="102" width="9" height="14" fill="#4a2e26"/>
  <rect x="27" y="98" width="7" height="7" fill="#e8c97a"/>
  <rect x="50" y="98" width="7" height="7" fill="#e8c97a"/>
  <rect y="112" width="200" height="88" fill="#eef0ea"/>
  <g stroke="#ccd4dd" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"><path d="M14 148 q30 6 60 2 M120 186 q30 -6 60 -2 M56 168 q20 4 40 1"/></g>
  <g fill="#8a6a4a"><rect x="6" y="140" width="3" height="17"/><rect x="24" y="134" width="3" height="15"/><rect x="40" y="128" width="3" height="13"/><rect x="54" y="123" width="3" height="11"/></g>
  <g stroke="#8a6a4a" stroke-width="1.6" fill="none"><path d="M6 144 L57 125 M6 152 L57 131"/></g>
  <g fill="#6f8a78"><polygon points="78,114 84,98 90,114"/><polygon points="102,112 108,97 114,112"/><polygon points="128,114 134,99 140,114"/><polygon points="152,112 158,98 164,112"/></g>
  <g fill="#567560"><polygon points="88,150 102,118 116,150"/><polygon points="93,134 102,112 111,134"/><polygon points="126,148 138,120 150,148"/><polygon points="130,134 138,116 146,134"/></g>
  <rect x="99" y="150" width="6" height="8" fill="#5c3a2e"/>
  <rect x="135" y="148" width="5" height="8" fill="#5c3a2e"/>
  <g fill="#43604d"><polygon points="146,192 174,130 200,192"/><polygon points="152,164 174,116 196,164"/><polygon points="158,142 174,108 190,142"/></g>
  <g stroke="#eef0ea" stroke-width="2" fill="none" stroke-linecap="round"><path d="M164 138 q8 4 16 2 M158 164 q12 5 26 2 M96 132 q5 3 11 2"/></g>
  <ellipse cx="62" cy="186" rx="2.6" ry="1.4" fill="#d5dad2"/>
  <ellipse cx="70" cy="192" rx="2.6" ry="1.4" fill="#d5dad2"/>
  <ellipse cx="78" cy="184" rx="2.6" ry="1.4" fill="#d5dad2"/>
  <ellipse cx="86" cy="190" rx="2.6" ry="1.4" fill="#d5dad2"/>
  <rect x="88" y="168" width="30" height="8" rx="3" fill="#b23a3a"/>
  <path d="M86 180 q-4 0 -4 -5 M86 180 h34 q6 0 6 -6" stroke="#8a5a33" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M88 170 q-14 -4 -20 5" stroke="#8b8272" stroke-width="1.4" fill="none"/>
  <g fill="#ffffff"><circle cx="30" cy="40" r="1.4"/><circle cx="70" cy="28" r="1.2"/><circle cx="110" cy="48" r="1.5"/><circle cx="150" cy="34" r="1.2"/><circle cx="56" cy="60" r="1.3"/><circle cx="96" cy="86" r="1.2"/><circle cx="136" cy="70" r="1.4"/><circle cx="20" cy="96" r="1.2"/><circle cx="176" cy="60" r="1.2"/><circle cx="66" cy="128" r="1.3"/><circle cx="120" cy="100" r="1.1"/><circle cx="42" cy="112" r="1.2"/></g>
  <rect width="200" height="200" fill="#cfd3de" opacity=".06"/>
  <rect x="0.5" y="0.5" width="199" height="199" fill="none" stroke="#3f3a2e" opacity=".12"/>
</svg>`,
  },
  {
    id: "typewriter",
    name: "the typewriter",
    sub: "left at my apartment",
    art: `<svg viewBox="0 0 200 200" role="img"><title>Typewriter on a desk with ink bottle, pen and a crumpled draft</title>
  <rect width="200" height="200" fill="#46403a"/>
  <circle cx="10" cy="20" r="70" fill="#d9c7a3" opacity=".08"/>
  <rect y="140" width="200" height="60" fill="#6f5f4a"/>
  <g stroke="#5c4e3c" stroke-width="1.5" opacity=".7" fill="none"><path d="M0 158 q50 5 100 0 t100 3 M0 182 q60 -6 120 0 t80 -3"/></g>
  <rect x="72" y="30" width="56" height="56" fill="#f2ecd9"/>
  <g stroke="#6f675a" stroke-width="1.6"><path d="M80 42 h34 M80 50 h40 M80 58 h26 M80 66 h36 M80 74 h14"/></g>
  <g stroke="#15130f" stroke-width="1"><path d="M100 100 L88 90 M100 100 L94 89 M100 100 L100 88 M100 100 L106 89 M100 100 L112 90"/></g>
  <circle cx="62" cy="88" r="5" fill="#201d1a"/><circle cx="62" cy="88" r="1.5" fill="#b23a3a"/>
  <circle cx="138" cy="88" r="5" fill="#201d1a"/><circle cx="138" cy="88" r="1.5" fill="#b23a3a"/>
  <rect x="46" y="82" width="108" height="8" rx="4" fill="#55504a"/>
  <path d="M42 90 q-10 -4 -12 -12" stroke="#2b2722" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <circle cx="42" cy="94" r="4.5" fill="#201d1a"/>
  <circle cx="158" cy="94" r="4.5" fill="#201d1a"/>
  <rect x="42" y="88" width="116" height="12" rx="3" fill="#2b2722"/>
  <rect x="52" y="98" width="96" height="44" rx="7" fill="#3a3531"/>
  <rect x="88" y="102" width="24" height="5" rx="1" fill="#d4a017" opacity=".8"/>
  <g fill="#d9d0bc">
    <circle cx="66" cy="114" r="3.2"/><circle cx="76" cy="114" r="3.2"/><circle cx="86" cy="114" r="3.2"/><circle cx="96" cy="114" r="3.2"/><circle cx="106" cy="114" r="3.2"/><circle cx="116" cy="114" r="3.2"/><circle cx="126" cy="114" r="3.2"/><circle cx="136" cy="114" r="3.2"/>
    <circle cx="71" cy="122" r="3.2"/><circle cx="81" cy="122" r="3.2"/><circle cx="91" cy="122" r="3.2"/><circle cx="101" cy="122" r="3.2"/><circle cx="111" cy="122" r="3.2"/><circle cx="121" cy="122" r="3.2"/><circle cx="131" cy="122" r="3.2"/>
    <circle cx="76" cy="130" r="3.2"/><circle cx="86" cy="130" r="3.2"/><circle cx="96" cy="130" r="3.2"/><circle cx="106" cy="130" r="3.2"/><circle cx="116" cy="130" r="3.2"/><circle cx="126" cy="130" r="3.2"/>
  </g>
  <rect x="78" y="135" width="44" height="4.5" rx="2" fill="#d9d0bc"/>
  <rect x="165" y="140" width="15" height="14" rx="2" fill="#26221e"/>
  <rect x="169" y="134" width="7" height="6" rx="1" fill="#191613"/>
  <rect x="166.5" y="145" width="12" height="4" fill="#d9d0bc"/>
  <g transform="rotate(-8 40 168)"><rect x="22" y="166" width="34" height="4" rx="2" fill="#3a3531"/><polygon points="56,166 64,168 56,170" fill="#d4a017"/></g>
  <path d="M38 148 q-6 -8 2 -12 q7 -4 12 2 q6 -3 8 3 q2 6 -5 8 q2 5 -5 6 q-8 1 -12 -7 z" fill="#e9e0c8"/>
  <g stroke="#c9bfa4" stroke-width="1" fill="none"><path d="M40 142 q6 2 12 0 M42 148 q5 -4 10 -1"/></g>
  <rect width="200" height="200" fill="#d9c7a3" opacity=".07"/>
  <rect x="0.5" y="0.5" width="199" height="199" fill="none" stroke="#e9e4f4" opacity=".12"/>
</svg>`,
  },
  {
    id: "not-a-lot",
    name: "not a lot going on",
    sub: "at the moment",
    art: `<svg viewBox="0 0 200 200" role="img"><title>An almost empty room: a sun patch, a ghost mark where a picture hung, a clock and one houseplant</title>
  <rect width="200" height="200" fill="#e9e3d3"/>
  <polygon points="26,26 88,26 70,118 8,118" fill="#f2ecd9" opacity=".85"/>
  <path d="M57 26 L39 118 M17 72 L79 72" stroke="#ded7c5" stroke-width="3"/>
  <g fill="#ffffff" opacity=".6"><circle cx="40" cy="52" r="1"/><circle cx="56" cy="88" r="0.9"/><circle cx="30" cy="98" r="0.8"/></g>
  <rect x="106" y="54" width="34" height="26" fill="#efe9d9"/>
  <rect x="106" y="54" width="34" height="26" fill="none" stroke="#ded7c5" stroke-width="1"/>
  <circle cx="123" cy="48" r="1" fill="#b9b09c"/>
  <circle cx="166" cy="44" r="11" fill="#f6f2e7" stroke="#b3a68e" stroke-width="2"/>
  <path d="M166 35.5 v2 M166 50.5 v2 M158.5 44 h-2 M175.5 44 h2" stroke="#b3a68e" stroke-width="1.2"/>
  <path d="M166 44 L171.5 40.5 M166 44 L170.8 49.5" stroke="#6f675a" stroke-width="1.6" stroke-linecap="round"/>
  <circle cx="166" cy="44" r="1.2" fill="#6f675a"/>
  <rect y="166" width="200" height="4" fill="#cfc6b0"/>
  <rect y="170" width="200" height="30" fill="#d8d0bc"/>
  <g stroke="#cfc6b0" stroke-width="1" opacity=".7"><path d="M40 170 L30 200 M100 170 L98 200 M160 170 L170 200"/></g>
  <ellipse cx="170" cy="188" rx="16" ry="3" fill="#cfc6b0"/>
  <g stroke="#7d8a5c" stroke-width="2.5" fill="none" stroke-linecap="round"><path d="M170 168 q0 -14 0 -18 M170 168 q-8 -10 -12 -12 M170 168 q8 -10 12 -13 M170 168 q-4 -14 -7 -17 M170 168 q10 -4 14 2 q-6 4 -14 -2"/></g>
  <path d="M160 168 h20 l-2.5 16 h-15 z" fill="#b06a4a"/>
  <rect x="158" y="165" width="24" height="4.5" rx="1.5" fill="#9d5c40"/>
  <rect width="200" height="200" fill="#d9c7a3" opacity=".05"/>
  <rect x="0.5" y="0.5" width="199" height="199" fill="none" stroke="#3f3a2e" opacity=".12"/>
</svg>`,
  },
  {
    id: "hey-kids",
    name: "hey kids!",
    sub: "spelling is fun",
    art: `<svg viewBox="0 0 200 200" role="img"><title>Alphabet beads spilling from a tipped tin across a desk, three strung on gold thread</title>
  <rect width="200" height="200" fill="#c9a86b"/>
  <g stroke="#b3915a" stroke-width="2" opacity=".6" fill="none"><path d="M0 30 q50 6 100 0 t100 4 M0 92 q60 -8 120 0 t80 -4 M0 158 q50 6 100 0 t100 4"/></g>
  <ellipse cx="100" cy="60" rx="7" ry="4" fill="none" stroke="#b3915a" stroke-width="2" opacity=".6"/>
  <polygon points="0,144 58,152 46,200 0,200" fill="#f4efdf"/>
  <g stroke="#2b2722" stroke-width="1" opacity=".12"><path d="M4 162 L52 168 M2 180 L48 186"/></g>
  <path d="M14 146 L8 200" stroke="#b23a3a" stroke-width="1.2" opacity=".4"/>
  <g transform="rotate(18 160 46)">
    <rect x="138" y="34" width="42" height="24" rx="4" fill="#8b98a3"/>
    <ellipse cx="138" cy="46" rx="5" ry="12" fill="#5c6570"/>
    <circle cx="141" cy="42" r="3.5" fill="#e0c478"/>
    <circle cx="140" cy="50" r="3.5" fill="#f4f0e3"/>
  </g>
  <ellipse cx="112" cy="26" rx="12" ry="4.5" fill="#9aa6b0"/>
  <circle cx="128" cy="64" r="7" fill="#f4f0e3"/>
  <circle cx="118" cy="78" r="7" fill="#cf7a7a"/>
  <circle cx="132" cy="92" r="7" fill="#f4f0e3"/>
  <path d="M18 128 C55 106 88 132 128 116 C140 111 152 108 166 110" stroke="#c8951f" stroke-width="1.8" fill="none"/>
  <path d="M166 110 L184 105" stroke="#b3b8ba" stroke-width="2" stroke-linecap="round"/>
  <circle cx="182" cy="105.5" r="1.4" fill="none" stroke="#b3b8ba" stroke-width="1"/>
  <circle cx="60" cy="120" r="10.5" fill="#f4f0e3"/>
  <circle cx="88" cy="123" r="10.5" fill="#f4f0e3"/>
  <circle cx="116" cy="118" r="10.5" fill="#e0c478"/>
  <g font-family="'Courier New',monospace" font-size="11" font-weight="bold" fill="#2b2722" text-anchor="middle">
    <text x="60" y="124">M</text><text x="88" y="127">E</text><text x="116" y="122">!</text>
  </g>
  <circle cx="36" cy="62" r="9" fill="#f4f0e3"/>
  <circle cx="68" cy="44" r="9" fill="#cf7a7a"/>
  <circle cx="160" cy="140" r="9" fill="#f4f0e3"/>
  <circle cx="128" cy="152" r="9" fill="#e0c478"/>
  <circle cx="70" cy="164" r="9" fill="#f4f0e3"/>
  <circle cx="184" cy="168" r="9" fill="#f4f0e3"/>
  <g font-family="'Courier New',monospace" font-size="10" font-weight="bold" text-anchor="middle" fill="#2b2722">
    <text x="36" y="65.5">T</text><text x="160" y="143.5">L</text><text x="70" y="167.5">Y</text><text x="184" y="171.5">R</text>
  </g>
  <g font-family="'Courier New',monospace" font-size="10" font-weight="bold" text-anchor="middle">
    <text x="68" y="47.5" fill="#f4f0e3">O</text><text x="128" y="155.5" fill="#5c4a28">A</text>
  </g>
  <circle cx="96" cy="168" r="8" fill="#cf7a7a"/>
  <path d="M96 165 q-2.4 -2.8 -4.4 -0.8 q-1.6 1.6 0.4 3.2 l4 3 4 -3 q2 -1.6 0.4 -3.2 q-2 -2 -4.4 0.8 z" fill="#f4f0e3"/>
  <circle cx="152" cy="76" r="8" fill="#e0c478"/>
  <path d="M152 70.5 l1.4 3.6 3.6 1.4 -3.6 1.4 -1.4 3.6 -1.4 -3.6 -3.6 -1.4 3.6 -1.4 z" fill="#f4f0e3"/>
  <g transform="rotate(-24 152 178)">
    <path d="M136 176 L162 180 M136 182 L162 178" stroke="#b3b8ba" stroke-width="2.5" stroke-linecap="round"/>
    <ellipse cx="166" cy="182" rx="5" ry="3.5" fill="none" stroke="#b23a3a" stroke-width="2"/>
    <ellipse cx="167" cy="175" rx="5" ry="3.5" fill="none" stroke="#b23a3a" stroke-width="2"/>
  </g>
  <rect width="200" height="200" fill="#d9c7a3" opacity=".06"/>
  <rect x="0.5" y="0.5" width="199" height="199" fill="none" stroke="#3f3a2e" opacity=".12"/>
</svg>`,
  },
  {
    id: "getting-married",
    name: "getting married!",
    sub: "your english & gym teachers",
    art: `<svg viewBox="0 0 200 200" role="img"><title>Wedding arch wound with vines and flowers, guest chairs, an aisle and a ring cushion</title>
  <rect width="200" height="130" fill="#e9dcc4"/>
  <circle cx="100" cy="40" r="16" fill="#f2e6c8"/>
  <rect y="118" width="200" height="12" fill="#8a996b"/>
  <g fill="#8a996b"><circle cx="16" cy="118" r="5"/><circle cx="44" cy="117" r="6"/><circle cx="72" cy="118" r="5"/><circle cx="128" cy="118" r="5"/><circle cx="156" cy="117" r="6"/><circle cx="184" cy="118" r="5"/></g>
  <g stroke="#f6f2e7" stroke-width="1.4" fill="none" stroke-linecap="round"><path d="M40 44 q4 -4 8 0 M48 44 q4 -4 8 0 M148 58 q3 -3 6 0 M154 58 q3 -3 6 0"/></g>
  <rect y="130" width="200" height="70" fill="#a8b586"/>
  <polygon points="86,200 93,130 107,130 114,200" fill="#f2ecd9"/>
  <g fill="#d98a9e" opacity=".7"><ellipse cx="98" cy="150" rx="1.6" ry="1"/><ellipse cx="104" cy="168" rx="1.5" ry="1"/><ellipse cx="96" cy="186" rx="1.6" ry="1"/><ellipse cx="106" cy="142" rx="1.4" ry="0.9"/></g>
  <path d="M56 178 L56 96 Q56 50 100 50 Q144 50 144 96 L144 178" stroke="#7d8a5c" stroke-width="11" fill="none"/>
  <path d="M52 170 q8 -6 6 -16 q-8 -4 -6 -14 q8 -5 6 -15 q-7 -6 -4 -16 q8 -8 14 -14 q10 -8 20 -9 q12 -1 22 4 q10 6 16 16 q5 10 4 20 q-2 10 2 20 q6 6 4 16" stroke="#5f7047" stroke-width="1.8" fill="none" opacity=".8"/>
  <g stroke="#5f7047" stroke-width="1.8" fill="none" stroke-linecap="round"><path d="M62 140 q6 -2 8 -6 M50 110 q-6 -2 -8 2 M70 66 q2 -6 -2 -9 M132 68 q-2 -6 2 -9 M150 112 q6 -2 8 2 M138 142 q-6 -2 -8 -6"/></g>
  <g fill="#d98a9e"><circle cx="56" cy="158" r="4.5"/><circle cx="55" cy="112" r="5"/><circle cx="66" cy="72" r="4.5"/><circle cx="110" cy="50" r="4"/><circle cx="140" cy="86" r="5"/><circle cx="145" cy="136" r="4.5"/><circle cx="60" cy="152" r="3"/><circle cx="136" cy="80" r="3"/></g>
  <g fill="#f2e6d0"><circle cx="57" cy="134" r="4"/><circle cx="60" cy="88" r="4.5"/><circle cx="88" cy="53" r="4"/><circle cx="128" cy="60" r="4.5"/><circle cx="143" cy="110" r="4"/><circle cx="143" cy="160" r="4.5"/><circle cx="122" cy="54" r="2.8"/></g>
  <g fill="#e0c478"><circle cx="54" cy="146" r="3.2"/><circle cx="76" cy="60" r="3.4"/><circle cx="100" cy="49" r="3.2"/><circle cx="136" cy="74" r="3.2"/><circle cx="146" cy="124" r="3.4"/><circle cx="144" cy="148" r="3"/></g>
  <ellipse cx="100" cy="127" rx="9" ry="3.5" fill="#e8a3b6"/>
  <circle cx="97.5" cy="125" r="2.2" fill="none" stroke="#d4a017" stroke-width="1.3"/>
  <circle cx="102.5" cy="125" r="2.2" fill="none" stroke="#d4a017" stroke-width="1.3"/>
  <g fill="#f2eee2" opacity=".85">
    <rect x="30" y="132" width="3" height="26"/><rect x="30" y="145" width="15" height="3"/><rect x="42" y="148" width="3" height="10"/>
    <rect x="167" y="132" width="3" height="26"/><rect x="155" y="145" width="15" height="3"/><rect x="155" y="148" width="3" height="10"/>
  </g>
  <g fill="#f2eee2">
    <rect x="58" y="140" width="3.5" height="32"/><rect x="58" y="156" width="17" height="3.5"/><rect x="72" y="159" width="3.5" height="13"/>
    <rect x="138.5" y="140" width="3.5" height="32"/><rect x="125" y="156" width="17" height="3.5"/><rect x="124.5" y="159" width="3.5" height="13"/>
  </g>
  <g fill="#d98a9e" opacity=".8"><ellipse cx="90" cy="92" rx="1.8" ry="1.2"/><ellipse cx="112" cy="106" rx="1.6" ry="1.1"/><ellipse cx="84" cy="118" rx="1.5" ry="1"/><ellipse cx="118" cy="90" rx="1.4" ry="1"/><ellipse cx="100" cy="76" rx="1.5" ry="1"/></g>
  <rect width="200" height="200" fill="#e0c478" opacity=".08"/>
  <rect x="0.5" y="0.5" width="199" height="199" fill="none" stroke="#3f3a2e" opacity=".12"/>
</svg>`,
  },
  {
    id: "no-its-becky",
    name: "no its becky",
    sub: "(it was taylor swift)",
    art: `<svg viewBox="0 0 200 200" role="img"><title>Yellow tee reading no its becky hanging large on a wooden hanger</title>
  <rect width="200" height="200" fill="#d8d2c4"/>
  <rect y="12" width="200" height="5" fill="#b3a68e"/>
  <rect x="20" y="8" width="4" height="13" fill="#a3947c"/>
  <rect x="176" y="8" width="4" height="13" fill="#a3947c"/>
  <g stroke="#8b8272" stroke-width="1.8" fill="none" opacity=".7">
    <path d="M36 30 q0 -7 5 -9 q4 -1.5 4 -6 M36 30 L14 48 L58 48 Z"/>
  </g>
  <g stroke="#8a5a33" stroke-width="3" fill="none" stroke-linecap="round">
    <path d="M118 30 q0 -8 6 -9 q6 -1.5 6 -8"/>
    <path d="M118 30 L82 54 M118 30 L154 54"/>
  </g>
  <g transform="rotate(14 162 44)"><rect x="156" y="38" width="13" height="19" rx="2" fill="#d9c7a3"/><circle cx="162.5" cy="43" r="1.6" fill="#b3a68e"/></g>
  <path d="M126 26 q6 8 8 14" stroke="#8b8272" stroke-width="1" fill="none"/>
  <path d="M86 56 Q100 47 104 47 Q118 58 132 47 Q136 47 150 56 L168 76 L152 88 L148 84 L148 156 L88 156 L88 84 L84 88 L68 76 Z" fill="#e8b73a"/>
  <path d="M104 47 Q118 58 132 47 Q126 64 118 64 Q110 64 104 47 Z" fill="#c9992c"/>
  <path d="M109 50 Q118 57 127 50" stroke="#c9992c" stroke-width="1.4" fill="none"/>
  <rect x="112" y="58" width="12" height="7" rx="1" fill="#f6f2e7" opacity=".9"/>
  <g stroke="#c9992c" stroke-width="1.4" fill="none" opacity=".7">
    <path d="M94 92 q4 30 2 60 M142 96 q-3 28 -2 56 M88 84 l10 5 M148 84 l-10 5 M100 124 q10 3 20 0 M112 138 q9 2 18 -1 M106 74 q6 3 12 2"/>
  </g>
  <g stroke="#c9992c" stroke-width="1" stroke-dasharray="2.5 2.5" fill="none"><path d="M90 151 h56 M70 72 l14 9 M166 72 l-14 9 M86 58 l4 4 M150 58 l-4 4"/></g>
  <text x="118" y="110" font-family="'Courier New',monospace" font-size="8" fill="#2b2722" text-anchor="middle" letter-spacing="0.8">no its becky</text>
  <rect width="200" height="200" fill="#cfd8de" opacity=".05"/>
  <rect width="200" height="200" fill="#d9c7a3" opacity=".05"/>
  <rect x="0.5" y="0.5" width="199" height="199" fill="none" stroke="#3f3a2e" opacity=".12"/>
</svg>`,
  },
  {
    id: "traffic-lights",
    name: "will it be alright?",
    sub: "i asked the traffic lights",
    art: `<svg viewBox="0 0 200 200" role="img"><title>Traffic light glowing amber in the rain with a speech bubble saying i don't know</title>
  <rect width="200" height="200" fill="#262936"/>
  <rect y="120" width="200" height="30" fill="#343a4d" opacity=".8"/>
  <path d="M0 150 V132 h16 v-6 h12 v6 h22 v-10 h14 v10 h18 v-5 h12 v5 h26 v-8 h12 v8 h20 v-4 h10 v4 h38 v18 Z" fill="#1c1f2b"/>
  <g fill="#e8c97a" opacity=".7"><rect x="20" y="136" width="3" height="4"/><rect x="52" y="130" width="3" height="4"/><rect x="88" y="134" width="3" height="4"/><rect x="170" y="140" width="3" height="4"/></g>
  <rect y="150" width="200" height="50" fill="#1f2129"/>
  <g fill="#d9d0bc" opacity=".35"><polygon points="10,196 26,196 34,168 20,168"/><polygon points="40,196 56,196 62,168 48,168"/><polygon points="70,196 84,196 88,168 76,168"/></g>
  <circle cx="30" cy="158" r="2" fill="#c25a5a"/>
  <circle cx="40" cy="158" r="2" fill="#c25a5a"/>
  <path d="M14 158 h12" stroke="#c25a5a" stroke-width="1.4" opacity=".5"/>
  <rect x="137" y="134" width="6" height="16" fill="#15161e"/>
  <rect x="120" y="30" width="40" height="104" rx="8" fill="#191b24"/>
  <rect x="122" y="46" width="36" height="4" rx="2" fill="#0f1119"/>
  <rect x="122" y="76" width="36" height="4" rx="2" fill="#0f1119"/>
  <rect x="122" y="106" width="36" height="4" rx="2" fill="#0f1119"/>
  <circle cx="140" cy="62" r="10" fill="#c25353" opacity=".28"/>
  <circle cx="140" cy="92" r="24" fill="#d4a017" opacity=".09"/>
  <circle cx="140" cy="92" r="17" fill="#d4a017" opacity=".18"/>
  <circle cx="140" cy="92" r="10" fill="#d4a017"/>
  <circle cx="140" cy="122" r="10" fill="#5fae7a" opacity=".28"/>
  <g stroke="#d4a017" stroke-width="2.5" opacity=".38" stroke-linecap="round">
    <path d="M137 156 q3 6 -1 12 M141 172 q3 6 -1 12 M136 186 q2 5 0 10"/>
  </g>
  <ellipse cx="120" cy="182" rx="14" ry="3" fill="none" stroke="#3a3e4d" stroke-width="1.4"/>
  <g stroke="#9aa3b8" stroke-width="1.1" opacity=".5" stroke-linecap="round">
    <path d="M22 18 l-6 16 M58 10 l-6 16 M90 24 l-6 16 M160 14 l-6 16 M184 38 l-6 16 M36 78 l-6 16 M70 84 l-6 16 M104 74 l-6 16 M170 76 l-6 16 M28 106 l-6 16 M62 120 l-6 16 M92 100 l-6 16 M186 126 l-6 16 M46 142 l-5 13 M108 140 l-5 13 M168 152 l-5 13"/>
  </g>
  <g stroke="#9aa3b8" stroke-width="1.1" opacity=".3" stroke-linecap="round">
    <path d="M44 30 l-5 14 M78 44 l-5 14 M124 14 l-5 14 M148 46 l-5 14 M16 80 l-5 14 M84 84 l-5 14 M178 100 l-5 14 M56 96 l-5 14 M100 124 l-5 14 M20 132 l-5 14"/>
  </g>
  <g stroke="#9aa3b8" stroke-width="1" opacity=".5" stroke-linecap="round"><path d="M60 164 l3 -3 M66 164 l-3 -3 M96 178 l3 -3 M102 178 l-3 -3 M170 168 l3 -3 M176 168 l-3 -3"/></g>
  <polygon points="102,52 124,74 100,64" fill="#f2eee2" stroke="#191b24" stroke-width="1.5"/>
  <rect x="14" y="34" width="92" height="30" rx="9" fill="#f2eee2" stroke="#191b24" stroke-width="1.5"/>
  <text x="60" y="53.5" font-family="'Courier New',monospace" font-size="10" font-weight="bold" fill="#2b2722" text-anchor="middle" letter-spacing="0.5">i don't know</text>
  <rect width="200" height="200" fill="#e8a3b6" opacity=".04"/>
  <rect x="0.5" y="0.5" width="199" height="199" fill="none" stroke="#e9e4f4" opacity=".12"/>
</svg>`,
  },
  {
    id: "not-asleep",
    name: "i'm not asleep",
    sub: "my mind is alive",
    art: `<svg viewBox="0 0 200 200" role="img"><title>A banana and safety goggles on a bedside table with a tissue box, tissues and a bunch of bananas behind</title>
  <rect width="200" height="200" fill="#ddd3c4"/>
  <circle cx="190" cy="10" r="60" fill="#e8dba3" opacity=".12"/>
  <rect y="104" width="200" height="96" fill="#c9a86b"/>
  <g stroke="#b3915a" stroke-width="2" opacity=".6" fill="none"><path d="M0 130 q50 5 100 0 t100 3 M0 168 q60 -6 120 0 t80 -3 M0 190 q50 4 100 0 t100 2"/></g>
  <rect x="24" y="76" width="48" height="34" rx="3" fill="#b8a8d4"/>
  <ellipse cx="48" cy="82" rx="12" ry="4.5" fill="#6f6386"/>
  <path d="M42 82 q2 -10 6 -10 q5 0 6 10 q-3 -4 -6 -3 q-4 1 -6 3 z" fill="#f6f2e7"/>
  <g stroke="#a394c4" stroke-width="1.2" fill="none" opacity=".8"><path d="M28 92 q20 4 40 0 M28 100 q20 4 40 0"/></g>
  <path d="M26 124 q-6 -8 2 -12 q7 -4 12 2 q6 -3 8 3 q2 6 -5 8 q2 5 -6 6 q-8 0 -11 -7 z" fill="#f2eee2"/>
  <g stroke="#d8d0bc" stroke-width="1" fill="none"><path d="M28 118 q6 2 12 0 M30 124 q5 -4 10 -1"/></g>
  <path d="M40 140 q-5 -7 2 -10 q6 -3 10 2 q5 -2 6 3 q1 5 -4 6 q1 4 -5 5 q-7 0 -9 -6 z" fill="#ede8da"/>
  <g stroke="#b9c6cc" stroke-width="2" fill="none"><path d="M152 70 L154 108 M176 70 L174 108"/></g>
  <ellipse cx="164" cy="70" rx="12" ry="3.5" fill="none" stroke="#b9c6cc" stroke-width="2"/>
  <ellipse cx="164" cy="108" rx="10" ry="3" fill="#b9c6cc" opacity=".7"/>
  <path d="M153.5 92 Q164 96 174.5 92" stroke="#a3c2ce" stroke-width="2" fill="none"/>
  <path d="M118 70 q-2 -8 4 -10" stroke="#8a5a33" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M96 100 C96 78 104 66 118 62 L124 68 C112 74 106 86 106 102 Z" fill="#e0b93a"/>
  <path d="M110 100 C112 80 118 68 128 64 L134 70 C124 78 120 88 120 102 Z" fill="#d9ae2e"/>
  <path d="M124 102 C128 84 134 72 142 68 L146 76 C138 84 134 94 132 104 Z" fill="#e0b93a"/>
  <path d="M46 146 C58 120 96 102 148 108 L146 118 C98 112 66 126 56 150 Z" fill="#e8c23a"/>
  <path d="M46 146 q-4 4 2 6 q5 1 8 -2 z" fill="#6f4a2a"/>
  <path d="M148 108 q6 0 4 6 l-6 5 -2 -10 z" fill="#8a5a33"/>
  <path d="M52 140 C66 118 96 106 138 110" stroke="#c9992c" stroke-width="1.6" fill="none"/>
  <g fill="#a8752c" opacity=".8"><ellipse cx="80" cy="126" rx="1.6" ry="1"/><ellipse cx="100" cy="117" rx="1.5" ry="0.9"/><ellipse cx="120" cy="112" rx="1.4" ry="0.9"/></g>
  <ellipse cx="66" cy="134" rx="5" ry="3.5" fill="#6f8a78" transform="rotate(-18 66 134)"/>
  <circle cx="66" cy="134" r="1" fill="#f2eee2"/>
  <circle cx="118" cy="158" r="11" fill="#cdd8de" stroke="#8b8272" stroke-width="3"/>
  <circle cx="146" cy="156" r="11" fill="#cdd8de" stroke="#8b8272" stroke-width="3"/>
  <path d="M128 155 q4 -3 8 0" stroke="#8b8272" stroke-width="3" fill="none"/>
  <path d="M107 160 q-14 6 -10 16 q3 8 14 6" stroke="#6f675a" stroke-width="2.5" fill="none"/>
  <path d="M157 158 q12 8 6 18" stroke="#6f675a" stroke-width="2.5" fill="none"/>
  <path d="M112 152 q3 -3 6 -2 M140 150 q3 -3 6 -2" stroke="#f2eee2" stroke-width="1.6" fill="none"/>
  <rect width="200" height="200" fill="#d9c7a3" opacity=".06"/>
  <rect x="0.5" y="0.5" width="199" height="199" fill="none" stroke="#3f3a2e" opacity=".12"/>
</svg>`,
  },
  {
    id: "goat-remix",
    name: "the goat remix",
    sub: "i knew you were trouble",
    art: `<svg viewBox="0 0 200 200" role="img"><title>A goat standing in a field screaming skyward, autumn tree and barn behind</title>
  <rect width="200" height="150" fill="#d8cfc0"/>
  <polygon points="8,104 27,88 46,104" fill="#5c3a30"/>
  <rect x="12" y="104" width="32" height="22" fill="#8a5a4a"/>
  <rect x="23" y="110" width="11" height="16" fill="#4a2e26"/>
  <path d="M23 110 L34 126 M34 110 L23 126" stroke="#d8cfc0" stroke-width="1" opacity=".6"/>
  <rect x="174" y="66" width="8" height="86" fill="#6f5140"/>
  <path d="M177 92 q-10 -8 -15 -18 M179 80 q7 -8 11 -17" stroke="#6f5140" stroke-width="4" fill="none" stroke-linecap="round"/>
  <circle cx="160" cy="46" r="16" fill="#b23a3a"/>
  <circle cx="184" cy="38" r="14" fill="#c25a3a"/>
  <circle cx="196" cy="56" r="12" fill="#b23a3a"/>
  <circle cx="176" cy="58" r="11" fill="#d4a017"/>
  <circle cx="148" cy="60" r="9" fill="#c25a3a"/>
  <g fill="#c25a3a"><ellipse cx="132" cy="86" rx="2.4" ry="1.4" transform="rotate(24 132 86)"/><ellipse cx="150" cy="104" rx="2.2" ry="1.3" transform="rotate(-30 150 104)"/><ellipse cx="188" cy="96" rx="2.4" ry="1.4" transform="rotate(50 188 96)"/></g>
  <ellipse cx="120" cy="112" rx="2.2" ry="1.3" fill="#d4a017" transform="rotate(-20 120 112)"/>
  <g fill="#8a6a4a"><rect x="6" y="108" width="5" height="48"/><rect x="58" y="108" width="5" height="48"/><rect x="118" y="108" width="5" height="48"/><rect x="176" y="108" width="5" height="48"/></g>
  <rect y="118" width="200" height="5" fill="#8a6a4a"/>
  <rect y="136" width="200" height="5" fill="#8a6a4a"/>
  <rect y="150" width="200" height="50" fill="#9aa878"/>
  <ellipse cx="32" cy="148" rx="13" ry="8" fill="#d8d0bc"/>
  <path d="M22 146 q-6 4 -8 12" stroke="#d8d0bc" stroke-width="5" fill="none" stroke-linecap="round"/>
  <ellipse cx="13" cy="159" rx="4.5" ry="3" fill="#d8d0bc"/>
  <rect x="26" y="154" width="2.5" height="10" fill="#c9c1ae"/>
  <rect x="32" y="155" width="2.5" height="10" fill="#c9c1ae"/>
  <rect x="38" y="154" width="2.5" height="10" fill="#c9c1ae"/>
  <path d="M44 144 q4 -3 4 -7" stroke="#d8d0bc" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <rect x="66" y="148" width="6" height="18" rx="2" fill="#dcd6c6"/>
  <rect x="118" y="148" width="6" height="18" rx="2" fill="#dcd6c6"/>
  <rect x="78" y="151" width="6" height="16" rx="2" fill="#eae5d6"/>
  <rect x="106" y="151" width="6" height="16" rx="2" fill="#eae5d6"/>
  <g fill="#55504a"><rect x="66" y="164" width="6" height="4" rx="1"/><rect x="78" y="165" width="6" height="4" rx="1"/><rect x="106" y="165" width="6" height="4" rx="1"/><rect x="118" y="164" width="6" height="4" rx="1"/></g>
  <ellipse cx="94" cy="134" rx="33" ry="18" fill="#eae5d6"/>
  <g stroke="#d8d0bc" stroke-width="1.6" fill="none" stroke-linecap="round"><path d="M68 128 q-2 6 0 12 M76 124 q-2 7 0 14 M86 122 q-1 7 0 15"/></g>
  <path d="M62 124 q-8 -4 -8 -12" stroke="#eae5d6" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M110 124 C114 110 120 100 130 92 L146 102 C138 110 130 120 126 132 Z" fill="#eae5d6"/>
  <path d="M132 86 q-4 -12 -14 -14 M138 84 q0 -12 -7 -17" stroke="#b3a68e" stroke-width="3" fill="none" stroke-linecap="round"/>
  <g transform="translate(140 90) rotate(-32)">
    <ellipse rx="12" ry="7" fill="#eae5d6"/>
    <path d="M3 3 q9 6 18 6 q-9 7 -18 1 z" fill="#241f1c"/>
    <path d="M7 6 q6 3 10 3" stroke="#c25a5a" stroke-width="2" fill="none" stroke-linecap="round"/>
    <ellipse cx="5" cy="10.5" rx="8" ry="3" fill="#d8d0bc"/>
    <path d="M-2 12 l-1 5 M2 13 l0 5" stroke="#d8d0bc" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <circle cx="9.5" cy="-2.5" r="0.9" fill="#241f1c"/>
    <path d="M-5 -3 l4 1" stroke="#241f1c" stroke-width="1.7" stroke-linecap="round"/>
  </g>
  <path d="M128 92 q-9 -1 -12 6" stroke="#d8d0bc" stroke-width="4" fill="none" stroke-linecap="round"/>
  <g stroke="#55504a" stroke-width="1.6" fill="none" stroke-linecap="round"><path d="M156 82 q4 4 3 10 M163 78 q5 6 4 14 M170 74 q6 8 5 18"/></g>
  <g stroke="#7f8f60" stroke-width="1.5" fill="none" stroke-linecap="round"><path d="M54 190 q2 -8 6 -10 M62 192 q1 -6 4 -8 M146 190 q-2 -8 -6 -10 M138 192 q-1 -6 -4 -8 M96 194 q1 -6 4 -8"/></g>
  <rect width="200" height="200" fill="#b23a3a" opacity=".05"/>
  <rect width="200" height="200" fill="#d9c7a3" opacity=".05"/>
  <rect x="0.5" y="0.5" width="199" height="199" fill="none" stroke="#3f3a2e" opacity=".12"/>
</svg>`,
  },
  {
    id: "doughphelia",
    name: "doughphelia",
    sub: "a fate worse than bread",
    art: `<svg viewBox="0 0 200 200" role="img"><title>A cat shaped like a bread loaf in a bakery, ears properly attached, flower tucked behind one ear</title>
  <rect width="200" height="200" fill="#bfe0d2"/>
  <g stroke="#a8cdbc" stroke-width="1" opacity=".5"><path d="M0 50 H200 M0 100 H200 M33 0 V150 M66 0 V150 M99 0 V150 M132 0 V150 M165 0 V150"/></g>
  <path d="M8 36 H92" stroke="#9d7c48" stroke-width="4"/>
  <path d="M16 36 v6 M84 36 v6" stroke="#9d7c48" stroke-width="3"/>
  <ellipse cx="34" cy="30" rx="18" ry="5" fill="#d0a25c" transform="rotate(-8 34 30)"/>
  <g stroke="#a8752c" stroke-width="1.2" fill="none"><path d="M24 30 l4 -3 M32 29 l4 -3 M40 28 l4 -3"/></g>
  <circle cx="68" cy="28" r="8" fill="#c9a86b"/>
  <path d="M63 28 h10 M68 23 v10" stroke="#a8752c" stroke-width="1" fill="none"/>
  <path d="M136 42 l1.6 4.8 4.8 1.6 -4.8 1.6 -1.6 4.8 -1.6 -4.8 -4.8 -1.6 4.8 -1.6 z" fill="#e88a3a"/>
  <path d="M32 78 l1.3 3.9 3.9 1.3 -3.9 1.3 -1.3 3.9 -1.3 -3.9 -3.9 -1.3 3.9 -1.3 z" fill="#e88a3a"/>
  <rect y="150" width="200" height="50" fill="#b3915a"/>
  <g stroke="#9d7c48" stroke-width="2" opacity=".6" fill="none"><path d="M0 168 q50 5 100 0 t100 3 M0 188 q60 -5 120 0 t80 -2"/></g>
  <g transform="rotate(-6 168 130)">
    <rect x="140" y="124" width="52" height="10" rx="5" fill="#c9a274"/>
    <rect x="132" y="125.5" width="10" height="7" rx="3.5" fill="#a8814e"/>
    <rect x="190" y="125.5" width="10" height="7" rx="3.5" fill="#a8814e"/>
  </g>
  <ellipse cx="100" cy="164" rx="46" ry="4" fill="#f2ecd9" opacity=".7"/>
  <g fill="#f2ecd9" opacity=".8"><circle cx="52" cy="160" r="1.2"/><circle cx="148" cy="162" r="1.2"/><circle cx="60" cy="168" r="1"/><circle cx="142" cy="170" r="1"/></g>
  <rect x="36" y="146" width="132" height="14" rx="7" fill="#a8814e"/>
  <circle cx="48" cy="153" r="3" fill="#8a6a3e"/>
  <g stroke="#f6f2e7" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"><path d="M86 90 q-4 -8 2 -14 M116 94 q4 -9 -2 -16"/></g>
  <g fill="#e9f4ee"><ellipse cx="56" cy="100" rx="4" ry="2.4" transform="rotate(30 56 100)"/><ellipse cx="61" cy="95" rx="4" ry="2.4" transform="rotate(-20 61 95)"/><ellipse cx="54" cy="93" rx="4" ry="2.4" transform="rotate(80 54 93)"/></g>
  <circle cx="58" cy="97" r="2.6" fill="#e0c478"/>
  <path d="M62 124 Q59 101 70 96 Q79 102 80 124 Z" fill="#d89a4e"/>
  <path d="M86 122 Q86 99 96 95 Q105 101 104 122 Z" fill="#d89a4e"/>
  <path d="M60 150 Q58 114 86 110 L126 110 Q152 114 150 150 Z" fill="#d89a4e"/>
  <path d="M67 110 Q67 102 70.5 100 Q74 103 74.5 110 Z" fill="#e8b06a"/>
  <path d="M91 108 Q91 100 95 98.5 Q98.5 102 98.5 108 Z" fill="#e8b06a"/>
  <path d="M64 128 Q62 116 78 112" stroke="#e2ab60" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <g stroke="#a8672e" stroke-width="1.8" fill="none" stroke-linecap="round"><path d="M106 118 q8 -4 16 0 M116 126 q8 -4 16 0 M124 136 q7 -3 14 1"/></g>
  <ellipse cx="82" cy="134" rx="17" ry="15" fill="#f6ecd2"/>
  <g stroke="#6f4a2a" stroke-width="1.8" fill="none" stroke-linecap="round">
    <path d="M72 130 q3 3 6 0 M88 130 q3 3 6 0"/>
    <path d="M79 138 q3 3 6 0"/>
  </g>
  <g stroke="#6f4a2a" stroke-width="1" fill="none" opacity=".7"><path d="M64 136 l-8 -1 M64 140 l-8 2 M100 136 l8 -1 M100 140 l8 2"/></g>
  <circle cx="70" cy="139" r="2.6" fill="#e88a3a" opacity=".55"/>
  <circle cx="94" cy="139" r="2.6" fill="#e88a3a" opacity=".55"/>
  <path d="M150 142 q9 -2 7 9 q-7 3 -10 -3" fill="#d89a4e"/>
  <g fill="#e9f4ee"><ellipse cx="170" cy="158" rx="4" ry="2.4" transform="rotate(20 170 158)"/><ellipse cx="178" cy="162" rx="4" ry="2.4" transform="rotate(-30 178 162)"/><ellipse cx="170" cy="166" rx="4" ry="2.4" transform="rotate(-80 170 166)"/><ellipse cx="164" cy="164" rx="4" ry="2.4" transform="rotate(60 164 164)"/></g>
  <circle cx="171" cy="162" r="3" fill="#e0c478"/>
  <g fill="#e9f4ee"><ellipse cx="26" cy="160" rx="3.4" ry="2" transform="rotate(25 26 160)"/><ellipse cx="33" cy="163" rx="3.4" ry="2" transform="rotate(-35 33 163)"/><ellipse cx="26" cy="167" rx="3.4" ry="2" transform="rotate(-75 26 167)"/></g>
  <circle cx="28" cy="163" r="2.5" fill="#e0c478"/>
  <rect width="200" height="200" fill="#e88a3a" opacity=".05"/>
  <rect x="0.5" y="0.5" width="199" height="199" fill="none" stroke="#3f3a2e" opacity=".12"/>
</svg>`,
  },
  {
    id: "stars",
    name: "stars",
    sub: "do u like dem",
    art: `<svg viewBox="0 0 200 200" role="img"><title>The scribbled stars artwork on spiral notebook paper</title>
  <defs>
    <g id="tsstars">
      <path fill="#a87fa9" d="M746.6,379.5l3.8,2.4,43.6,31c1.8,2,4.8,2.7,5.1,3,3.6,4,6.9,17,6.7,22.3-.1,3.6-3.8,10.4-2.1,13.3,4.7,2.7,9.4,6,14.3,8.3,38.1,17.4,57.2,6.9,86.3-19,6-5.4,16.8-15.3,22-21.1,6.7-7.4,28-42.8,35.6-44.3,6-1.1,12.1,1.9,12.1,8.5-6.2,21.5-7.1,43-6.3,65.2l70.4,1.1c7.6-.9,5.2-3.4,9.2-6.3,22.8-16.7,55.8-27.1,83.8-19,17.5,5,31.3,29.1,13.7,41.4-13.4,9.3-27.7,5.5-43.1,6.1-4.9.2-12.2,2.6-16.9,2.6-9.9,0-22.7-5-32.4-5.3-12.1-.3-19.9,14.6-26.5,22.6-2.6,3.2-7,6.9-9.5,10-2.6-.1-3.4,1-3.4,3.6-.8.8-.5.4-1.3,2.3-3.8-.2.7-10.5,5.5-6.8-.4.2-12.2,15.7-13,16.3-.8.7-5.2,10.8-6,12.8-4.6,11.8-11.8,31.2-12.4,42.6,0,1.7-.9,3.8-1.1,5.5-3.3,5.2-2.7,6.3-2.8,8.1-1,13.4-.7,32.3,0,45.9.3,5.3.7,12.2,1.3,17.4.6,4.5,3.7,4.3,1.5,10.7-2.8,8.6-11.3,10.7-17.8,4.3.4-4.4-2.7-9-3.2-12.4-2.2-18-3.5-36.8-5.2-54.9-.4-4.2.2-10.7-3.9-12.9-.2-1.3-3.8-8-3.9-9.3-.2-2.5,3-.7,0,.2-1.7-11.8-6.5-35-22-33.6.2-.8-1.5-5.6-1.3-8.3.2-3.5,2.3-7,2.6-9.8,20.4-.8,28.6,16.3,35.4,32.5.5,1.3,1.7,12,4.7,8.9l14.2-45.3c2.8-1.9,4.2-10.4,5.2-11.6,4.5-5.4,5.9-8.1,10.1-13.9,6.4-9,15-16.1,19.7-26.2-11.5-1.8-23.5-1.5-34.9,0-.4-1-10-11-11.2-11.4-4.6-1.3-13.9-.5-19.1-1.6-1.8-.4-4.8-3.4-5.9-2.5.5-9.7,2-19.3,1.3-29.1-.1-1.9,1-3.7-1.9-3.2-3.9,8.9-11.9,13.1-18.2,19.4-4.2,4.2-7.3,9-11.6,13-5.9,5.5-13.3,9.5-18.8,15.5-.5-.3-10.3-2.5-11.1-2.6-11.1-1.3-8.2,9.5-11.3,13.9-3.4,4.9-23.2,6.7-29.4,6.8-11.8.2-26.5-5.1-37.4-9.8-5-2.2-9-5.5-13.6-8.2l-2.6,2.6c-3.7,13.5-15.4,27.3-19.3,40.2-.7,2.4-1.4,3.6-.2,6.1,1.8,4.1,15.2,22.2,18.7,26.3,6.2,7.2,33.1,30.3,41.4,32.7,3.7,1.1,10.7,1.1,14.3,0,2.2-.7,22-14.5,24.1-16.7,2-2.1,3.1-5.5,5.6-8,8.1-8,21-20,32.3-22.5,0,.2,1.7,1.7,1.8,2.7.3,5,3,9.2-.2,14.2-.1,0-7.5,6.1-8.3,6.4-2,.9.1-4,.3-.2-8.9,5-14.5,16.2-22.7,23.2-6.2,5.4-24.8,18.8-32.3,19.5-21.5,2-36.2-8.6-51.8-22.1-17.6-15.2-29.5-34-44-51.7-2.2-4.8,1.1-10.5,3-15.1,4-9.8,24.2-43.6,22-51.2-.7-2.5-9.7-9.7-11.8-12.9-3.7-5.6-5.8-13.1-8.8-18-5.4-9.1-23.7-26.6-25.5-35.6-.5-2.4-.4-4.9-.4-7.3,0-.3,3.3-1.9,4-2.1,2.4-.9,8.5-1.3,10.3,0M1068.7,450.6l.5,3.9c2.6,3.6,25.7,0,31.1-.1,7.4-.2,21.3,1.7,27,.9.6,0,4.3-2,5.1-2.5,8.1-5.5-9-11.3-13.2-12-19-3.2-33.4,3.1-50.4,9.8h0Z"/>
      <path fill="#c4ae99" d="M1308.8,432.9c0,.9,1.9,3.1,1.4,5l15.4,1.5c-2.2,7.2-4.6,16.3-7.1,23.3-1.6,4.5-4.2,8.5-5.8,12.9,11.2-4.3,23.5-2.5,35.2-5.5,4.2-1.1,17.3-5,20.3-6.8,3.1-1.8-.2-2.1-1.2-3.2,9.2-2.4,20.5-6.1,29.8-9.1-.7,3.8,1.7,2.8,4.2,2.3,7.7-1.5,26.9-6.5,33.3-10.1-.2,3.3,3.2,4.3,4.4,6.6,1.4,2.7.4,8.4,4.6,7.7-.2.2.4,2.3-.3,3.5-.5.7-6.2,3.7-8.1,5.6-5.6,5.4-8.5,10.8-13.6,15.5.4-1.9,5.5-9.6.7-9-12.6,1.5-16,7.2-25.3,11.6-18.8,9-53.6,21.4-68.8,34.1-1.8,1.5-3.2,1-2.4,4.7-7.4,1.6-25,11.7-28.5,18.1-11.8,2.9-21.9,16.5-22,28.5,3.2,0,6.5.2,9.8,0,1.7,0,3-1.3,3.1-1.3,8.3-.2,8.2,1.7,18.1-1.3,8-2.4,11.6-5.1,18.9-8.9,4.7-2.5,16-4.2,16-11.8,5.8,1.3,4.7-1.8,7.3-3.7,6.3-4.5,5.1-6,6.9-8,.1-.1,2.4.1,3.7-.7,12.8-8.7,25.5-16.9,37.7-26.4,7.8-6.1,11.9-8,18.1-16.8,2.2,2.7.2,3,3.3,1.3,12.8-7.2,24.5-21,37.8-28.2,16.3.5,16.5,9.8,5.5,19.8-9.8,9-29.3,22.7-40.9,29-2.7,1.5-3.4,1.9-3.1,5.3-5.2-1.2-12.5,5.5-12.9,10.3-3.1-.8-4.3.8-6.5,1.9-4.1,2.1-14.9,8.8-18,11.7-2,1.8-3.1,2.8-2.7,5.8-4.7-.9-10.5,5.3-14.3,8.4-1.1.9-1.1,3.2-1.2,3.2-14.9,8.8-31.9,18.8-48.8,25.6-1.8.7-2.7,2.8-2.9,2.8-.9.3-17.1,1.3-19.4,1.3-3.2,0-14.7-3.7-17.5,0-1.9,6.4-2.3,13-3.8,19.4-2,8.4-7.7,14.7-1.9,23.3-7.8,2.2-17.9,11.9-20.4-2.2-.3-1.9-2-14-1.6-14.6,0-.1,1.9.4,2.5-.9,1.7-3.7,6.2-19.5,5.1-22.8-1.3-4-10.6-.2-14.2-5.3-8.1-11.4,18.1-31.1,23.9-39.6,2.6-3.7,2.2-5.5,3.3-9,2.6-8,4-15.2,9.1-22.5,0-.4-2.5-2-2.6-2.1,4.9-3.1,6-5.7,5.2-11.6-13.5-2.9-44.7,13.7-55.6,5.8-6.7-4.8-3.3-12.9,1.4-17.9,14.9-8.5,28.3-19.3,42.7-28.5,10.2-6.5,30.7-15.6,38.6-22.2,1.9-1.6,1.9-4.3,4-5.7h0ZM1271.3,483.4c14.1,2.7,16.4-5.2,23.3-14.9-1.7-2.2-2.5-2.5-5.1-1.3-.9.4-16,10.9-16.8,11.6-1.6,1.5-1.5,2.4-1.3,4.5h0ZM1338.6,488.5c-.8-.8-12.4,1.2-14.5,1.6-4.4.9-18.3,3.9-21.7,5.5-5.7,2.7-4.2,8.6-5.5,12.6-1.1,3.4-4.5,5.4-3.5,9.2l3,1.9c11.8-5.9,21.6-16.7,32.7-23,4-2.2,10.3-1,9.5-8h0Z"/>
      <path fill="#8ea59d" d="M1272.6,513.1c.2,0,2.7,1.7,2.6,2.1-5.1,7.2-6.5,14.5-9.1,22.5l-119-7.8c-.3,4.7,4.4,6.2,7.2,9,6.4,6.3,15.8,14.4,21.3,21.4,1.9,2.4,2.8,6.7,4.2,8.1,4.2,4.2,19.6,12.2,25.4,16.6,9.9,7.5,21.5,20,30.8,26.4,2.5,1.7,6.4,3.1,9.4,3.9-.4.6,1.3,12.7,1.6,14.6,2.5,14.2,12.6,4.5,20.4,2.2,8.5,2.1,18.4,12.5,25.8,15,6.8,2.3,5.5-5.5,4.9-10.1-.8-6.4-5.2-13.2-6.1-18.5-1.4-9,1.3-19.7-1.4-29,2.3,0,18.5-1,19.4-1.3,1.3,8.7.5,17.7,1.5,26.4.7,6.2,3.7,10.8,4.7,16,3.9,19.4,2.5,45.5-24.3,37.2-8.6-2.7-32.2-18.8-41.3-24.7-22.6-14.6-43.9-31.1-65.4-47.2-12.4-9.2-15.9-11.7-25.4-23.7-6.1-7.7-10.7-9.8-16.7-15.7-12.6-12.3-17.8-25-32.9-35.6-7.6-5.3-25-8.8-18.1-23.3,6.1-12.8,31.4,8.8,39.2,11.3,4,1.3,13.2,2.4,17.8,2.9,36.3,4.4,72.6,2.7,108.7,1.3,4-.2,11.3-.7,14.9,0h0Z"/>
      <path fill="#c4ae99" d="M907,473.1c4.6,1.2,9,4.2,14.1,3.7,6.6-8.1,10.6-15.5,21.2-19,1.9-.6,4.3.2,6-.3,1.4-.4,0-4.4.1-4.5,1.1-.8,5.5,2.3,7.3,2.7,5.2,1.1,13.4.2,18,1.5,1.3.4,11.6,11.7,12,12.8,1.2,3.3,1.3,14.1.6,17.7-1.3,6.2-7.2,8.4-8.8,13.9,5.8,1,9.6,4.6,12.9,9.1-1,1.2-2.4,9.7-5.2,11.6-8.6.7-17.4-5.6-25.2-6.5-8.8-1-19.1,2.9-28.3,1.3-4,2.3-.7,8-.9,9.1-.4,2.8-2.5,6.2-2.6,9.8-.1,2.7,1.5,7.6,1.3,8.3-.3,1-5.8,5.8-7.5,6.2-4.5,1-7-1.1-10.7-1-.8-4.9-1.1-9.8-1.4-14.8,0-1-1.2-1.8-1.2-2.1-.2-4.4,4.2-7.8,1.9-11.7-29,6.3-58.3,10.2-87.6,14.6-7,1-22.1,6.6-26.2-2.9-5.3-12.6,12.8-26.7,22.6-31.7,8.8-4.5,17.2-4.7,25.4-8.2,2.4-1,3-.5,2.2-5.9,6.2-.1,25.4-2.3,28.9-7.1,3.1-4.3.8-15,11.9-13.8.8,0,10.8,2.5,11.3,2.8M950.2,473.2c-5.3.6-15.7,9.5-9.3,13.9.9.6,14.1,4,15.3,3.9,5.2-.3,19.3-9.7,11-14.8-1.4-.9-15-3.3-17.1-3h0ZM905.2,501.5c-1.4-1.2-33.4,1-37.8,1.6-5.9.8-29,7.4-34,9.9-1.9,1-3.7,1.2-3.2,4,6,1.6,11.2-1.8,16.3-2.5,16.4-2.1,38.2-3.7,53.9-8.2,2.2-.6,5.3-1.8,4.8-4.8h0Z"/>
      <path fill="#8ea59d" d="M1330.8,385c.3-2-.4-4.6,0-6.5,1-5.1,3.7-6.6,5.5-6.3,1.7-1.3,4.6-.4,7.4-.1.7,1,2.3,3.5,2.6,3.9.9,2,1.2,5.8,1.3,6.5.3,2-.2,4.4,0,6.5-.2,1.6-.2,1.9-.3,3-.5,6.7-1.2,14.7-1,21.5.1,4.2,3.6,12.8,3.9,15.5,0,1.3.6,2.3.7,3.6,0,0,4.1,10.9,4.2,11.9.4,7.4-10.2-22.6-1.3-3.3.3.6,0,.2.3.6.3.4-6.9-1-4-1.5l2.1-.4,10.9,1.9c2.1,0,4.3.2,6.5,0,2.9-.2,6.6-1.1,9.1-1.6,1.3,0,2.6-.8,3.9-.9,2.8-.4,9.3-4.5,11.6-6.5,1.1-.3,7.9-3.5,8.6-3.6,2-.5-2.1,3.1-.9,1,0-.5.6-1.1.7-1.1l1.9-.7,2.6-.8c1.2-.2,6-3,7.1-3.2,4.6-1,4.2-2.8,9.2-3.2h1.8c.8-.3,1.8,0,2.6-.1,2.6-.7,3.6-2,7-3,1.6-.3,1.7-.7,3.3-.9,2.7-.4,5.7-1.2,9.2-2.1.8-.2,1.6-.5,2.5-.5,3.1,0,5.4-2.5,7.4-2.9,1.7-.2,1.6-.1,3.3-.3.1,0,.4.2,2.2.1,2.4-.2,12.1-6.6,15.4-7.7,1.2-.1,23.1-4.5,24.4-4.5,9.1,0-9.3,1.3-1.2,0,5.3-.8,13.9-2.9,17.2-4.2.8,0,1.6-.5,2.5-.6.2,0,2.8-.6,4.9-.9s3.6-.8,6.1-1c.8-.1,1.2,0,2.1-.1,12.1-1.9,23.4-11,36.2-9.1.1.1,1.5.4,2.6,1.3l1.3,9.1c-2.7,3.3-2.4,2.7-5.2,5.2l-3.4,2.5-5.7,2.7c-17.5,7.1-31.2,14.9-47.9,22.6-21.5,9.9-45.6,15.7-64.8,29.7-1.2.9-3.6.6-3.7.7-4.2.7-3.2-5-4.6-7.7-1.2-2.3-4.6-3.3-4.4-6.6,1.5-.8,11.4-12,11.7-14,5.9.5,1.2,1.9-5.6,3.7-1.4.4,4.2-1.5,4.1-1.5-8.4,4.6-37.3,16.3-47.6,19.6-9.2,3-20.6,6.7-29.8,9.1-16.4,4.2-27.4,1.4-33-15.5-.3-.9-2.2-17.7-5.8-12.2-.4,2.5-1.8,4.7-2.6,7l-15.4-1.5c.5-1.9-1.3-4.2-1.4-5,0-.8,0-1.8,0-2.6"/>
      <path fill="#8ea59d" d="M1417.5,518.3l20.1,25.8c2,17.8,18.7,36.8,22,53,2.7,13.2,6.3,31.7,8.3,44.8,1.4,9.5,4.7,30.7-10.9,27.7-7.9-1.5-7.2-12-9.1-16.8-8.5-22.6-15.9-33.4-32.4-50.4s-35.1-29.2-53.7-42.7c.2,0,.2-2.4,1.2-3.2,3.8-3.1,9.6-9.3,14.3-8.4.6.1,6,3.2,7.1,3.9,12.6,8,34.1,25.2,44,36.2,3.4,3.8,5.4,10.8,11,11.7,1.4-1.5-13.7-31.4-15.6-35.5-1.4-3.1-1.3-7.1-2.8-10.1-3.2-6.3-17.2-18-16.5-25.5.4-4.8,7.8-11.6,12.9-10.3h0Z"/>
      <path fill="#8ea59d" d="M1396.8,484.6c9.3-4.4,12.7-10.1,25.3-11.6,4.8-.6-.3,7.1-.7,9-4.4,4.1-3.8,5.3-6.5,9.1-6.2,8.8-10.3,10.7-18.1,16.8-2.1-8-1.3-15.3,0-23.3h0Z"/>
      <path fill="#a87fa9" d="M1699.6,628.3l10.2-14.1,4.1-5.3,16.8-24.6-33.6,46.6c-.9.6-1.5,1-2.6,1.3l-9.1-3.9c-2.6-6.5,2-15.8,2.6-22.7,1.1-12.8-1.3-26.1-.2-38.5l-2.4-2.9c-22.1,1.4-44.1,4.1-66.3,3.5-18.2,21-52.3,35.5-80.2,29.2-16.5-3.8-27.1-16.7-19.1-33.3l9.2-6.3,2.6-1.4c.4-.2,0,.2,0,0l2.5-1.2c.8,0,1.8-.1,2.6,0,10.3.4,23,.5,32.3-4,2.2,0,4.3,0,6.5,0,8.5,0,16.4.5,24.6,0,2.1-.1,4.5.3,6.5,0,11.6-2.7,11.4-4.8,13.9-5.5,2-.6-3.5,3.7-2.3,2.2.6-.8,1.2-1.7,1.4-1.9,4.5-5.2,7.6-11,11.6-16.8,1.9-1.4,2.3-2.3,2.6-2.6.8-.8.9-1.8,1.3-2.6,3.6-3.7,6.1-6.8,7.8-10.3s3.8-9.1,5.2-12.9l4.7-6.8-2.1,4.2c-1.4.9,1.2-4.2,1.3-5.2,10.5-39.2,7.2-9.3,2.6-5.2-1,.9,0-2.6,0-3.9,2.2-2,2.1-6.6,2.4-9.3.2-1.7,6.6-30.4,6.8-32.1,3.6.9-2.8,24.8-2.7,22,0-1.7,0-3.5,0-5.2,3-1.8,2.3-4.9,2.6-7.8.3-2.5-.2-5.2,0-7.8.4-6.2,0-8.7,0-14.2,0-1.7,0-3.5,0-5.2-.3-11.6,1.3-23.7-2.6-34.9,0-3.4.2-7,0-10.4-.2-3.1-1.5-5.9-1.3-9.1-.5-5.7,10.2-6.9,13.1-4.3,4.6,4.1,6.6,31.4,8.3,39.3,3.2,14.7,9.8,38.2,15.2,52.1,3.3,8.5,9.5,23.9,20.4,20.3-.2,1.7,1.5,5.4,1.4,8.4,0,3.5-1.1,6.4-1.4,9.7-23.1-.9-30-19.3-38.2-37.5-3.1-.6-1.6,1.4-1.9,3.2-1.7,10.1-5.8,19.1-6.5,29.1l-4.2,11.1c-.2.8,1.8-9.3,1.6-8.6-.6,2.7-.6,6.9-1.3,9.1-.2.7-3.6,8.6-3.9,9.1-4.3,6.2-4.9,8.4-8.6,15.3-2.1,3.9-18.1,21.3-14.7,24.8,8.6,1.7,19.2-2.5,27.2-1.3,5.8.9,10.6,6.7,16.8,8.5,6.4,1.8,14.2,2,20.8,1.9.7,8.5-1,18.3,0,26.6.2,2,.1,3.2,2,4.4,11.4-18.1,28.4-31.7,42.1-47.8.5.1,8.2,1.2,9.7,1.4,8.7,1,12.2-3.7,9.8-11.7.5-.1,7.4-4.6,5.2-6.5,7.2-1,16-3.6,23.3-3.9,8.2-.3,24.2,4.2,32.3,7.1,3,1.1,13.1,7.4,14.8,7l18.9-42.1-.7-3.1c-11.4-13.6-22.6-27.4-37-38.1-8.3-6.2-21.2-15.2-31.7-13.8-3.8.5-18.7,12.2-22,15.5-10.6,10.4-18.2,27.5-34.2,32.4,0-1.6-3.3-16.2-3.9-16.8l13.6-11.6c7-12.8,15.1-18.6,26.4-26.6,7.2-5.1,6.4-8.5,17.6-9.6,10.8-1.1,15.7,0,25,4.7,22.6,11.1,47.1,35.4,62.3,55.5,1.4,1.8,2.4,3.8,3.3,5.8.6,2.8-7.8,23.5-9.6,28.1-3.2,8.2-12.3,22.2-10.6,30.8.5,2.4,7.8,7.3,10.3,10.4,4.6,5.5,8.2,13.2,12.4,18.7,5.3,6.9,20.2,22,22.8,28.9,1.9,5.1,1,10.9-4.2,13.2-5.7,2.6-11.1-5-15.7-7.6-13.8-8-45.3-19.9-48.7-36.7-.8-4.1.4-21.2-.4-22.2-4.8,0-7.8-4.2-11.8-5.6-3.9-1.4-24.6-7.7-27.4-7.5-12.4.7-26.3,7.8-36.9,14.3-7.7,4.7-7.9,6.1-12.9,12.9-7.1,4.7-5.6,2-10.3,10.3M1594.8,566.2c-10.8-3.7-20.3.3-30.4,1.3-5.3.5-32.8,0-31.6,7,.3,1.5,6.9,6.5,8.6,7,13.7,3.5,35.6-3.3,48.1-9.5,1.2-.6,7-3.9,5.3-5.7h0ZM1865.2,581.7c2.5-2.8-10.3-18.2-12.9-15.5-2.5,4,11.2,17.5,12.9,15.5Z"/>
      <path fill="#c4ae99" d="M1731.9,470.4c.6.6,3.8,15.3,3.9,16.8,0,2.4-2.2,6.1-1.3,9,1.5,1.5,26.4-6.4,30.8-7.4,12.2-2.8,24.6-4.6,36.8-7.2,9.3-2,38.4-14.9,38.1,3.4-.2,14.5-21.4,26.8-33.2,31.2-3.2,1.2-11.6.8-11.6,5.8-7.3.3-16.1,2.9-23.3,3.9-.2,0-1.2-1.4-3-1.3-10.3.7-8.5,9.4-2.1,7.7,2.4,8-1,12.8-9.8,11.7-1.5-.2-9.2-1.2-9.7-1.4-.2,0-.5-2-3.3-2.5-5.4-1-11.1-1.6-16.6-1.4-4,7.9-8.3,13.6-16.5,17.4-2.7,1.2-6.5,0-7.7,3.3-6.6,0-14.4,0-20.8-1.9-6.2-1.8-11-7.6-16.8-8.5,5.9-3.1,2.4-5.9,2.5-11,.2-8.6,1-11.4,6.5-18l-12.9-9.8c.3-.4,3.7-8.4,3.9-9.1,7.4-3.3,12.3,1.6,18.9,2.5,10.5,1.4,21-1.4,31.3-2.7,2.7-2.4.2-5.9.2-6.2.3-3.3,1.3-6.2,1.4-9.7,0-3-1.6-6.7-1.4-8.4.2-2.1,5.2-7.1,7.5-7.5,1.4-.2,7.8.7,8.1,1h0ZM1804.3,498.9c-6.6.6-13.4,1.6-20,2.7-5.8,1-12.2,1.7-17.9,2.8-7.3,1.4-15.7,5.2-23.5,6l-.8,4c16.6-.1,33.6-2.5,49.2-8.4l12.9-7.1h0ZM1685.8,533c-1.2,1.4-2.6,3.3-2.9,5.2,1.2,7.6,28.2,7.2,29.4-3.9.5-5-15.9-7.6-20.2-5.9-.8.3-5.7,3.9-6.3,4.7h0Z"/>
      <path fill="#c4ae99" d="M505.4,399.3c1.8,5,26.2,7.4,31.8,9,7.2,2.1,11.6,8.2,17.8,10.7,3,1.2,22.1,6.6,22.9,7.5.3.3-.9,2.5.9,3.9,3.8,2.9,13.7,3.5,18.5,5.8,3.8,1.8,5.5,5.4,7.8,6.5,1.8.9,4.9.5,5.1.7.1.1-.2,2.4.7,3.8,2.6,3.6,27.9,13.1,33.6,16.9,7.3,4.9,9.2,13.9,14.8,20.1,7.1,7.8,28.3,16.6,31.7,23.9,4.7,10.1-5.5,15.9-15.2,11.3-3.9-1.8-25.8-17.8-29.3-21.2-2.6-2.5-4.4-6.2-6.6-9l-1.9-.6c-11.5,5.8-21.4,13.9-33,19.4-2.6,1.2-15.9,7.5-16.8,7.8-9.3,2.4-10.5,3.5-19.4,7.1-14.7,5.9-32.3,3.1-44.7,9.7-1.4.7-3.6,1.1-3.2,3.3.7,3.3,28.4,4.2,33.1,7l43.2,1.4c1.3,1.5,10.1,5.8,12.3,7.8,9.5,8.2,5.5,15.4,3.2,25.9-7.8-.6-12,3.1-18.8,3.9-20.7,2.3-42.7-1.5-63.3,3.9l-53.8-3.9c-.4-3.7-3.9-5.1-5.5-8.1-1.9-3.4-2.1-3.8-3.6-6.1-.3-.4,2-7.9-.1-10.2-5.4-4.8-43.3,22.3-50.5,26.3-4.9,2.7-10.6,5.3-15.7,7.6-1.9.9-4.2.2-3.5,3.5-7.6-1.8-21.3,1.3-29.8,0-6.3-1-6.6-5.6-7.8-6.5,1.1-5.8,5-11,5.2-16.8,3.5.7,14.3-2.8,14.2-7.8,8.8-.8,12.1-5.9,19.1-8.7,5.5-2.1,12.4-2.3,17.9-4.1,2.7-.8,21-7.6,15-11.8-1.2.3-2.5-1.2-3-1.3,6.5-12.3-20.2-59.5,9.4-52.8,6.5,1.5,11.6,10.5,15.8,15.2l16.2,12.9c-1.3-4.5-2.4-9.2-3.8-13.6-8.1-24.3-17.7-33.9-15.6-62,1.5-19.2,8.8-28.9,27-35,.9-.3,1.3-1.8,1.4-1.8,1.6-.5,3.8,2.2,5.9,2.5,3.5.5,13.4.6,16.9.2,2.9-.4,1.6-2.4,3.1-4h0ZM483.4,422.5c-.2-.2,1.1-3.8-3-2.4-.6.2-9,7-9.3,7.6-1.1,2-2.9,19.4-2.8,22.4.2,4.7,2.7,11.6,4.3,16.2,1.1,3-.1,3.4,4.2,2.8-.3,7.2,3,19.7,7.7,25.3,2.9,3.4,4.9.8,7.8.6,16-1.3,25.7-8.7,38.3-10.2,9-1.1,19.1.9,28-.5,8.6-1.3,18.8-7.7,26.8-10,5-1.5,12.8-2.9,18.1-3.9,1.9-.4,4.4.3,6.5,0v-3.9h-6.5c-.4-2.2-2.1-7.2-3.9-8.4-.4-.2-6.2-3-7.1-3.4-2.6-1.1-3.1-1.1-5.8,0,0-.8.3-1.6-.2-2.4-1.4-1.8-8.6-1.6-10.2-.2-3.6-2.9-9.7-8-14.2-7.8.4-7.9-11.3-7.2-17.7-10.1-4.8-2.1-9.7-7.4-13.3-8.7-4.6-1.6-15.9-3.1-20.8-1.9-.1-.2-1.6.4-1.8,0-1-1.4-.6-2.5-2.6-2.7-4-.5-11.3-.1-15.6.1-1.8,0-6.4,1.9-7.1,1.3h0ZM572.7,498.9c-6.1.4-11.3,3.3-17.5,3.9-8.3.8-16.9-.9-25.3.6-5.5,1-12.2,4.9-18,6.6-6.1,1.8-13.8,1.8-20,4.3l-.6,7.1c1.4,4.4,14.8.6,18.3-.7,4.8-1.8,8.1-5.3,13.8-6.9,14.7-4.2,30-1.1,43.7-9.4,2.2-1.3,4.6-3,5.6-5.4h0ZM451,533.8c1.8,4.1-1.9,9,8.8,5.6,7.6-2.4,7.4-9.3-1.1-8.2.2-2.9.8-3.6-1.6-5.7-1.3-1.1-8.1-6.4-9.4-6-3.8,1.1.5,10.5,1.4,12.8.4.9,1.7,1.2,1.8,1.4h0ZM506.7,551.9l-19.4-1.3v6.5l9.2-.5,10.2-4.6h0ZM568.8,561l-49.8-7.9-29.5,6.9-2.2,2.9c1.8,1.8,3.1,4,5.8,4.5,6.4,1.2,22.8,1.6,29.8,1.4,11.5-.3,26.6-2.5,37.8-4.9,3.2-.7,9.2,1.4,8.1-2.9h0Z"/>
      <path fill="#8ea59d" d="M429,537.7c.4,0,1.8,1.6,3,1.3,5.9,4.3-12.4,11-15,11.8-5.6,1.7-12.4,1.9-17.9,4.1-7.1,2.7-10.4,7.9-19.1,8.7-4.3.4-14.8.7-18.7,0-3.8-.7-9.7-8.3-11.1,0,5,0,11.5,7,15.5,7.8-.2,5.8-4.1,11-5.2,16.8-5.7-4.1-14.5-6.6-20.6-9.8-16.7-8.9-24.1-14.7-44.7-16.1-8.7-.6-31.3,3.8-31.6-9.6-.2-7.7,8.3-11.1,14.7-11.1,14.8,0,34.2,4.4,47.9,4.1,6.9-.1,14.5-3.9,20.7-4.1,6.7-.2,14.2,3.2,20.9,3.8,9.4.8,25.9-2.4,36.1-3.7,6.6-.9,19.6-4.5,25.2-3.9h0Z"/>
      <path fill="#8ea59d" d="M467.9,567.5c1.5,2.3,1.7,2.7,3.6,6.1,1.6,3,5.1,4.4,5.5,8.1-2,4.2-6.8,5.8-9.4,9.4-9.5,12.9-10.3,22.6-8.7,37.8.8,7.2,5.8,25.6,2.6,31.1-7.4,13-22.1-4.3-28.6-9-4.2-3-9.7-5.5-13.5-8.5-9.3-7.4-14.3-18.7-23.9-26.6-8.3-6.8-22.1-11.7-27.2-21.3,8.4,1.3,22.2-1.8,29.8,0,2.5.6,18.2,14.6,20.7,17.4,3.5,4,6,9.6,9.5,13.2,3,3,12.4,11.2,12.2,2.8-.1-5.3-2.6-11.4-2.4-17.2.2-7.1,11.9-29.1,16.9-34.6,3.1-3.4,8.7-6.8,13-8.7h0Z"/>
      <path fill="#8ea59d" d="M610.2,443.2c-.2-.2-3.3.2-5.1-.7-2.3-1.1-4.1-4.7-7.8-6.5-4.8-2.3-14.8-2.9-18.5-5.8-1.8-1.4-.6-3.6-.9-3.9l18.2-27.8c2.7-6.1,5.5-12.4,9.2-17.9,5.9-8.6,33.6-37.1,42.5-40.3,5.7-2.1,14.1,5.2,12.6,11.3-1,4-17.1,19.2-21,24.4-14.1,18.8-25.8,43.9-29.2,67.2h0Z"/>
      <path fill="#8ea59d" d="M605,507.9c-2.3,14.6,9.9,25.6,17.3,36.4,2,2.9,2.9,7,5.3,10.3,9.1,12.7,39.6,29.1,53.8,42,6.3,5.7,13.4,17,3.3,22.7-12.3,7-24.7-13.8-33.2-20-4.9-3.6-12-6.4-17.4-9.8-7.8-4.8-10.4-10.8-21.3-11.7,2.3-10.4,6.3-17.7-3.2-25.9-2.2-1.9-11-6.3-12.3-7.8-.7-.8-8.5-16.4-8.8-17.8-.7-3.5-.1-7.2-.3-10.7.9-.2,14.2-6.5,16.8-7.8h0Z"/>
      <path fill="#8ea59d" d="M505.4,399.3c-1.6,1.6-.3,3.6-3.1,4-3.4.5-13.4.4-16.9-.2-2-.3-4.3-3.1-5.9-2.5,1-12.5-5-25.5-2.6-38.1,1.3-7,14-8.2,17.1-1.6,1.6,8.1,5.3,15.5,7.9,23.2,1.5,4.6,2.1,11.4,3.5,15.2h0Z"/>
      <path fill="#a87fa9" d="M100,469.5c3.3,3.7,10.1,5,14.7,3.6,1.6-.5,1.8-2.1,2.1-2.3,1.1-.7,8.4-14.3,11.5-19.1.6-.9,1.8-1.1,2.6-.4,1.5,1.4,3.8,3.4,4.7,4.1,1.2,1,6.8,1.8,8,2.8,2.4,2-8.8,13.9-11,20.6-.2.5-.6,1-1.2,1.1-2.2.6-4,2.7-6.8,3.7-4.7,1.7,6.9-3.8-4.3,2.2-.3.1,0,.2-.8.4-1.1.3,1.4-1.4.6-.3-.3.4-5,1.6-5.5,1.6-4.1-.1-8.2.5-12.3-.3-3.2-.6-14.5-6-20.5-8.1-1.5-.5-2.8,1.1-2.1,2.5l19.9,36.4c.2.4,2.9,10.8,2.8,11.2-1.1,4.3-.7-3,.2-.2,4.3,13.2,4.7,21.1,6.5,34.2.4,2.9,2.8,5.8,2.8,9.2,0,1.2,1.1,2.1,2.2,1.7.7-.2,1.3-.6,2.2-1.1,4-2.6,16.9-19,18.7-19.5,4.1-1.1,10,.1,15.4-2,6.5-2.6,10.7-10.4,17.2-12,.5-.1,1.1,0,1.5.3,1.4,1.2,4.3,2.6,5.5,3.8,3.9,4.1,8.6,10,12.8,13.7.7.6,1.2,1,1.7,1.2,1.3.6,2.7-.8,2.2-2.2-.7-1.9-1.8-3.5-2.1-6.1-1.9-16.4,1.3-36.3.2-53.4,0-.9.5-1.6,1.4-1.8,1.9-.4,1-1.9,2.5-3,5.4-4.1,11.5-5,8.7-14.1-.7-2.4-3.9-3.3-4.7-5.7-2.6-8.5,7.6-13.7,10.7-21.2.5-1.3.6-2.8.6-3.8,0-.7.4-1.3,1.1-1.5,3.6-1.4,5.9-4.6,9.5-6.7,10.3-5.7,23.8-11.2,35.4-14.5,1-.3,1.5-1.4,1.1-2.3-4.4-10.1-13-42.2-18.2-44.5s-13.6-1.1-19-1.7c-3.5-.4-7-2.4-10.6-2.5-10.8-.4-38.5,2.5-48.4,5.9-4.1,1.4-9.1,7.4-10.5,11.5-1.6,4.6-3.8,18.6-3.9,23.4-.1,10.4,2.6,22.5,1.4,33.6-.4,3.6-2.1,5.6-2.5,9.4-.1,1-1,1.6-2,1.5-4.5-.7-9.4-4-12.8-6.9-.5-.4-.7-1-.6-1.6.7-3.6,2.2-16,2.2-17.7,0-5.4-3.7-13-3.8-16.9,0-6.1,5.5-33,8.8-37.9,13-19.4,54.4-22.5,76-21,3.9.3,8,2,11.8,2.4,5.4.6,21.3.4,25.1,2.1,8.6,3.9,17.8,50.3,27,59.3.1.1.3.3.5.4,3.5,1.5,6.7-.9,10.5-.7,19.1,1.1,41.9,10,61.7,10.8,8.5,1.1,10.8,13.9,2.8,16.9-.2,0-.3,0-.5.1-18.3,1-38.4,11.4-56.1,12.2-7.9.4-16.2-3.9-22-9-3.8-3.4-5.9-8.3-10.1-10.3-.2,0-.4-.1-.6-.2-5.8-.2-31.5,10.9-35.8,14.3-22.1,17.2-22.4,65.6-20.1,91.2,1.2,13.2,8,30.6,7.9,44,0,4.7-3.2,12-8.5,12.2-6.3.2-21.1-25.2-26.6-31.2-2-2.3-14.4-14-18.5-17.1-.7-.5-1.6-.4-2.2.2l-45.7,45.4c-.3.3-.5.8-.5,1.2.5,30.8-21.5,77.4-54.6,82.5-15.2,2.4-26.5-10.4-23-25.6,2.5-11.2,15.8-20.7,22.9-28.8,4.4-4.9,7.1-11.1,12.3-16.2,7.4-7.3,23.6-13.1,25.1-24,1.3-9-1.1-25.2-2.8-34.5-4.4-23.9-17.3-49.6-29.4-70.8-.2-.4-.9-1.1-1.5-1.7-.3-.3-.5-.5-.7-.6-.2-.2-.4-.4-.5-.7-3-6.9-9.1-13.5-15.4-17.1-.4-.6,5.3,3.7,3.9,2.6-.9-.7-2-.4-2.6-.7-5.5-2.7-10.8-10.6-16-14.8-.5-.4-.8-1.1-.6-1.8.4-1.8.5,1.6-.2,1-8.5-7-16.2-14.7-24.8-21.6-.3-.2-.5-.6-.6-.9-1.6-6.6-1.2-10.1,5.9-11.1,1.1-.1,2.7,0,3.9,0,2.3.1,3.2.6,5.2,1.3-.4,2.5-2.7.5-.2.1,3.4,2.6,9.8,7.7,13.2,10.2,0,2.6-3.5-.5-.9-.6.2.2,5.6,4.6,6,4.8-.5,2.5-2.5.3,0-.1,1.2,1.4,5.2,3.7,7.1,4.7.4.2.7.5.8,1,1.4,4.5,8.7,6.5,12.8,8.5.8.4,1.5.9,2.6,1.3l1.6.8,1.5.7c0,0,.2.1.3.2.4.3,1.2.7,1.8.9M99.2,625.6c.4-1.3-.8-2.6-2.1-2.2-6.5,2.1-19,19.9-21.2,22.4-4.8,5.4-17.4,15.1-18.5,21.7-1.4,8.4,5.2,5.2,9.7,3.2,17.2-7.9,26.7-27.8,32.2-45h0Z"/>
      <path fill="#c4ae99" d="M219.5,453.6c-.3.6.1,3-.7,5-3.1,7.5-13.3,12.7-10.7,21.2.7,2.4,3.9,3.3,4.7,5.7,2.8,9.1-3.3,10-8.7,14.1-1.8,1.3-.1,3.2-4,3.1-.2,0-1.1-1.7-2.9-1.2-1.9.6-3.6,3.6-5.7,4.8-2.3,1.4-8.9,3.1-9.4,4.9,2.8,9.9,5.9,24.6-4,31,.7,1.1.8,3.6,1.4,4.4-7.1,1-11.4,9.5-18.2,12.2-5.4,2.2-11.3.9-15.4,2-.6-4.6-4.5-4.1-7.1-6.5-6.6-6-7.9-10.3-7.1-19.4-6.7.2-11.2,4.1-18.1,1.3-1-3-4.2-5.6-2.6-10.3,3.3.6,3-3,5.2-4.5,7.9-5.8,12.2-5.3,20.7-14.3,3-3.2,13.8-15,11.1-18.8-1.3-1.3-2.9-1.4-4.6-1.2,1.4-6.6-2.6-5.1-5-7.2-1.2-1-1.6-2.7-2.9-3.7s-3.6-.6-3.8-.7c-.4-.4-.2-10,.6-11.6,1-2.1,6.7-4.2,7.1-5.2,3.9,3.4,10.2,7.9,15.5,7.8,0,2.8,1,11.7,5.9,7.8l48.2-72.2c12.2-19.6,25.3-9.8,25,10.7-.3,17.4-7.5,26.1-14.3,40.7h0ZM214.3,426.4c-.1-.1-3.7-.5-4,.8l-36.1,57.4c1.4,1.4,6.6-4.6,7.8-5.8,4.6-4.5,13.7-15,17.3-20.2,2.2-3.2,16.5-30.8,15-32.2h0ZM164.7,518.5c-9.1,3.1-18.2,9-17.6,19.9.2,3.2,4.4,6.6,7.6,5.1,1.2-.6,13.1-11.2,13.6-12.4,1.5-3.6,1.6-12.8-3.6-12.7h0Z"/>
      <path fill="#8ea59d" d="M1341.2,526.1c.6.6,13.6,4.3,14.2,9-1.8,2-.7,3.5-6.9,8-2.6,1.9-1.5,4.9-7.3,3.7-2.2-.5-7.1-4.3-10-4.9-20.2-4.2-19.1,11.2-24.9,25.6-9.9,3-9.8,1.1-18.1,1.3.9-9.7,4.5-18.7,9.1-27.2,3.4-6.4,21.1-16.5,28.5-18.1,1.3-.3,3.4.3,4.9.3,2.1.5,3.1.9,5.4,1.2,1.7.2,3.5.9,5.2,1.1"/>
      <path fill="#8ea59d" d="M483.4,422.5c.8.6,5.4-1.2,7.1-1.3,4.3-.2,11.6-.6,15.6-.1,2.1.3,1.7,1.3,2.6,2.7.2.3,1.7-.2,1.8,0,.2.4-.3,3.8.3,5.5,1.4,4.2,21,20,25.6,21.1,2.2.5,11.7-.7,14.3-1.3,4.3-1,8.4-4.4,11.6-4.6,4.6-.3,10.6,4.9,14.2,7.8-.4.3-1.8,4.2-4.5,6.5-10.8,9-31.3,12.7-44.6,8.3-4.1-1.4-14.6-10.3-18.8-13.6-3.2-2.5-5-7.1-9.7-6.4l-6.5,47.9c-3,.2-4.9,2.8-7.8-.6-4.7-5.6-8-18.1-7.7-25.3.6-15.6,8.6-30.6,6.5-46.6h0Z"/>
      <path fill="#8ea59d" d="M568.8,561c1,4.3-4.9,2.2-8.1,2.9-11.1,2.4-26.2,4.6-37.8,4.9-7,.2-23.4-.2-29.8-1.4-2.8-.5-4.1-2.7-5.8-4.5l2.2-2.9,29.5-6.9,49.8,7.9h0Z"/>
      <path fill="#8ea59d" d="M603.7,466.5c.2,1.2-.1,2.6,0,3.9-5.3,1-13.1,2.4-18.1,3.9-.9-6.6,2-12.9,1.3-19.4,2.7-1.2,3.2-1.1,5.8,0,.9.4,6.7,3.1,7.1,3.4,1.8,1.2,3.5,6.1,3.9,8.4h0Z"/>
      <path fill="#8ea59d" d="M458.8,531.2c8.5-1.1,8.7,5.8,1.1,8.2-10.7,3.3-7-1.5-8.8-5.6,3,.5,5-2.2,7.8-2.6Z"/>
    </g>
  </defs>
  <rect width="200" height="200" fill="#f4efdf"/>
  <g fill="#d8d0bc"><circle cx="11" cy="24" r="2.8"/><circle cx="11" cy="52" r="2.8"/><circle cx="11" cy="80" r="2.8"/><circle cx="11" cy="108" r="2.8"/><circle cx="11" cy="136" r="2.8"/><circle cx="11" cy="164" r="2.8"/></g>
  <g stroke="#8b8272" stroke-width="1.6" fill="none"><path d="M6 24 a5 5 0 0 1 10 0 M6 52 a5 5 0 0 1 10 0 M6 80 a5 5 0 0 1 10 0 M6 108 a5 5 0 0 1 10 0 M6 136 a5 5 0 0 1 10 0 M6 164 a5 5 0 0 1 10 0"/></g>
  <g stroke="#2b2722" stroke-width="1" opacity=".08"><path d="M24 40 H200 M24 64 H200 M24 88 H200 M24 112 H200 M24 136 H200 M24 160 H200 M24 184 H200"/></g>
  <path d="M32 0 V200" stroke="#b23a3a" stroke-width="1.4" opacity=".4"/>
  <svg x="22" y="14" width="172" height="80" viewBox="20 360 1090 340" preserveAspectRatio="xMidYMid meet"><use href="#tsstars"/></svg>
  <svg x="22" y="102" width="172" height="80" viewBox="1130 360 770 340" preserveAspectRatio="xMidYMid meet"><use href="#tsstars"/></svg>
  <rect width="200" height="200" fill="#d9c7a3" opacity=".05"/>
  <rect x="0.5" y="0.5" width="199" height="199" fill="none" stroke="#3f3a2e" opacity=".12"/>
</svg>`,
  },
];

export const POLAROID_BY_ID = Object.fromEntries(POLAROIDS.map((p) => [p.id, p]));
