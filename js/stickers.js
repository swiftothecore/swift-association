// Stickers: the die-cut vinyl collectible set (see scripts/stickers/STICKERS.md).
// Each entry: { id, name, sub, how, era, art }.
//   id:   kebab-case handle; the unlock trigger and the STICKERS_KEY store key both use it.
//   name: the object's own name, as the drawer captions it.
//   sub:  the source line under it: the song, or where the object comes from.
//   how:  what you did to earn it, in the achievement descs' voice. It is a HOVER TIP in both
//         places it appears, the unlock toast and an earned cell on the drawer's shelf, and it
//         is never printed: as a caption line it swamped the shelf. A LOCKED cell carries
//         neither this nor the name, because the silhouette is the question.
//   hint: the nudge a LOCKED cell shows in its hover tip once the Mastery 9 sticker vault is
//         open, and the only thing that reward gives. It must never become the `how`: it points
//         at the KIND of thing the sticker wants and leaves the trigger to be worked out, so
//         the silhouette still asks its question. Write it as the notebook talking, not as an
//         instruction, and leave it null where the drawing and `sub` already say it rather than
//         padding one out to fill the space.
//   era:  the section it belongs to, used to group the shelf.
//   bordered: true when the original already includes its die-cut outline.
//   art:  a self-contained viewBox="0 0 100 100" SVG, exactly as drawn. The shared die-cut
//         filters add the paper edge on both game surfaces. The original
//         set uses .ln stroke classes; guest artwork carries its own finer stroke weights.
// Stickers are printed objects with a cream border, NOT margin doodles (DOODLE_SVG in
// js/config.js), which are unfilled line art. Do not let the two families converge, and never
// render a sticker below 64px: the crowded ones stop being their object.
// STICKER_BY_ID is the lookup earnSticker works from.

export const STICKERS = [
  {
    id: "vault-door",
    name: "Vault door",
    sub: "From the Vault",
    how: "Name a From The Vault track",
    hint: null,
    era: "Meta and fandom",
    art: `<svg class="stick" viewBox="0 0 100 100">
  <path class="ln" fill="#5c554c" d="M16.4 32.6 L8.2 30.4 L7.8 41 L17 39.4 Z"/>
  <path class="ln" fill="#5c554c" d="M17.2 60.6 L8.4 59.2 L8.6 69.8 L16.2 67.4 Z"/>
  <circle class="ln" cx="50" cy="50" r="35" fill="#7d746a"/>
  <g fill="#5c554c">
    <circle cx="50" cy="18.6" r="2.4"/><circle cx="72.6" cy="27.8" r="2.2"/>
    <circle cx="81.4" cy="50" r="2.4"/><circle cx="72.2" cy="72.4" r="2.3"/>
    <circle cx="50" cy="81.4" r="2.3"/><circle cx="27.6" cy="72.2" r="2.2"/>
    <circle cx="18.6" cy="50" r="2.4"/><circle cx="27.8" cy="27.4" r="2.3"/>
  </g>
  <circle class="ln" cx="50" cy="50" r="26.6" fill="#968c80"/>
  <circle class="ln t" cx="50" cy="50" r="21" fill="none" opacity="0.45"/>
  <g class="ln t" stroke="#6b5a2a">
    <path fill="#c7951f" d="M47.2 29.8 L52.8 29.8 L52.8 70.2 L47.2 70.2 Z"/>
    <path fill="#c7951f" d="M29.8 47.2 L70.2 47.2 L70.2 52.8 L29.8 52.8 Z"/>
    <circle fill="#c7951f" cx="50" cy="29.6" r="4.1"/><circle fill="#c7951f" cx="50.2" cy="70.4" r="3.9"/>
    <circle fill="#c7951f" cx="29.6" cy="50.2" r="4"/><circle fill="#c7951f" cx="70.4" cy="49.8" r="4.1"/>
    <circle fill="#d9ab3a" cx="50" cy="50" r="8.2"/>
  </g>
  <path class="ln t" fill="none" stroke="#c9c1b4" opacity="0.5" d="M32 34.6 C36.6 29.4 42.6 26.2 49 25.6"/>
</svg>`,
  },
  {
    id: "junior-jewels-tee",
    name: "Junior Jewels tee",
    sub: "You Belong With Me",
    how: "Name a song off every studio album in one sitting",
    hint: "Every album gets a name on it.",
    era: "Fearless and Speak Now",
    art: `<svg class="stick" viewBox="0 0 100 100">
  <path class="ln" fill="#f6efe2" d="M41.4 17.6 C44 21.6 47 23.6 50 23.6 C53 23.6 56 21.6 58.6 17.6 C64.6 18.6 70.2 21.2 74 25.2 L86 37.6 C87.6 39.6 87 42.2 85 43.6 L77.4 49.2 C76.4 50 75.4 49.6 75 48.6 L73 45 L73.2 82.6 C73.2 85.2 71.6 86.6 69 86.6 L31 86.4 C28.4 86.4 26.8 85 26.8 82.4 L27 45 L25 48.6 C24.6 49.6 23.6 50 22.6 49.2 L15 43.6 C13 42.2 12.4 39.6 14 37.6 L26 25.2 C29.8 21.2 35.4 18.6 41.4 17.6 Z"/>
  <path class="ln t" fill="none" opacity="0.55" d="M43.6 19.8 C45.8 23.4 47.8 25.6 50 25.6 C52.2 25.6 54.4 23.4 56.6 19.8"/>
  <path class="ln t" fill="none" opacity="0.3" d="M31 50.6 C30.6 62 30.8 74 31.4 83"/>
  <path class="ln t" fill="none" opacity="0.3" d="M69.4 51 C69.8 62.4 69.6 74 69 83"/>
  <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7">
    <path stroke="#3b5b9a" d="M34.6 40.4 C36.6 34.6 39 41.2 41 36.4 C42.4 33 44.6 39.4 47 35.6"/>
    <path stroke="#b8382f" d="M54.6 42.6 C57 37 59.6 43.6 62 38.4 C63.4 35.4 65.4 41 67.4 37.8"/>
    <path stroke="#2b2722" d="M32.6 57.6 C35.6 51.4 38 58.6 41.4 53.6 C43.2 51 45 56.6 47.6 53.4"/>
    <path stroke="#4a8c87" d="M52.4 62.6 C55.4 56.6 58.4 63.4 61.6 58.4 C63.2 55.8 65.4 61 67.4 58.2"/>
    <path stroke="#3b5b9a" d="M34.4 73.6 C37.6 67.6 40.6 74.6 44 69.8 C45.4 67.8 47 71.4 49.4 69.4"/>
    <path stroke="#b8382f" d="M54.4 76.6 C56.6 71.4 59.4 77.4 62 73 C63.2 71 65 74.4 67 72.4"/>
    <path stroke="#2b2722" d="M40.4 66.6 C43.6 61.4 46.4 67.6 49.6 63.4"/>
    <path stroke="#4a8c87" d="M57.6 49.6 C60.4 45.4 63 50.6 65.6 47.4"/>
    <path stroke="#3b5b9a" d="M36.6 48.4 C38.4 45.6 40.6 49.4 42.6 47.4"/>
    <path stroke="#2b2722" d="M52.4 69.4 C54.6 66.4 56.4 70.4 58.4 68.4"/>
    <path stroke="#4a8c87" d="M43.4 79.4 C46.4 75.4 49.4 80.4 52.4 77.4"/>
    <path stroke="#b8382f" d="M47.6 45.6 C46 43 49.4 41.6 50.4 44.4 C51.6 41.4 55 43.2 53.2 45.8 C52 47.6 50.6 48.8 50.4 49.6 C50 48.8 48.8 47.4 47.6 45.6 Z"/>
  </g>
</svg>`,
  },
  {
    id: "rocking-horse",
    name: "Rocking horse",
    sub: "Never Grow Up",
    how: "Name a song off the first album and off the newest one in one sitting",
    hint: "The oldest thing in the room, and the newest.",
    era: "Fearless and Speak Now",
    art: `<svg class="stick" viewBox="0 0 100 100">
  <path class="ln" fill="#f2e6cd" d="M32 40 C25.4 38.4 19.4 41.8 17.4 48.6 C20.6 46 23.8 45.2 26.8 46 C22.6 49.8 20.6 55 21.8 61 C25.2 53.8 29.6 49 34.6 46.8 Z"/>
  <path class="ln" fill="#b98a4e" d="M10.6 68.6 C22 86 78 86 89.4 68.6 C92 74.6 79 91.4 50 91.4 C21 91.4 8 74.6 10.6 68.6 Z"/>
  <g class="ln t" stroke="#7a5228">
    <path fill="#a87e42" d="M55.4 52.8 L62 79.6 L56.8 80.6 L50.6 54.2 Z"/>
    <path fill="#a87e42" d="M44.6 52.8 L38 79.6 L43.2 80.6 L49.4 54.2 Z"/>
  </g>
  <g class="ln t" stroke="#7a5228">
    <path fill="#c99a5c" d="M60.6 51.4 L68.4 79.6 L62.6 80.6 L55.6 53 Z"/>
    <path fill="#c99a5c" d="M39.4 51.4 L31.6 79.6 L37.4 80.6 L44.4 53 Z"/>
  </g>
  <path class="ln" fill="#c99a5c" d="M30.6 44.6 C30 37.6 36 33 45 32.4 C54 31.8 62 33.6 66.6 38.6 L68.6 47 C68.6 53.6 60 57.6 48.6 57.6 C37.6 57.6 31 52.6 30.6 44.6 Z"/>
  <path class="ln t" fill="#c99a5c" stroke="#7a5228" d="M72.8 17.8 L73.4 8 L81.8 14.6 Z"/>
  <path class="ln" fill="#c99a5c" d="M59.6 36.6 C62.4 26.6 67.8 19.2 75.2 16.2 C79.4 14.6 83.4 17 86.6 22.6 C89.4 27.4 92.4 32.2 92.6 35.8 C92.8 38.6 90.4 40.2 86.8 39.6 C82.6 39 78.4 38.4 74.6 38.8 C71.4 39.2 69.2 41 67.4 44 L64.4 49 C61 45.8 59.2 41.4 59.6 36.6 Z"/>
  <path class="ln" fill="#f2e6cd" d="M75.2 16 C68.8 19.8 63.8 27.2 60.8 36.6 C59.8 33.6 58.4 31.6 56.8 30.4 C59.2 29.6 60.8 27.4 61.8 24.2 C59.4 24.8 57.4 26 55.6 27.8 C57.8 21.8 62.4 16.8 68.4 14 C71.2 12.8 73.8 13.6 75.2 16 Z"/>
  <g class="ln t" fill="none" stroke="#c2ae86" opacity="0.85">
    <path d="M70.4 16.6 C66.6 20.4 63.6 26 61.6 33.4"/>
    <path d="M64.6 19.4 C61.6 22.6 59.6 26.4 58.4 30.4"/>
  </g>
  <path fill="none" d="M0 0"/>
  <path class="ln t" fill="#b8382f" stroke="#8a2620" d="M39.6 34.4 C44.4 31.2 53.4 31 58.4 34 L57.6 40.6 C52.6 37.6 44.6 37.8 40.4 40.6 Z"/>
  <circle cx="79.6" cy="24.4" r="1.9" fill="#2b2722"/>
  <circle cx="88.8" cy="34.4" r="1.2" fill="#7a5228"/>
  <path class="ln t" fill="none" stroke="#7a5228" d="M91.6 38.4 C89.6 39.4 87.4 39.2 86 38.2"/>
  <path class="ln t" fill="none" stroke="#a87e42" opacity="0.55" d="M35.4 47.6 C43.4 51.4 57 51.4 64.4 47.4"/>
  <path class="ln t" fill="none" stroke="#7a5228" opacity="0.45" d="M24.6 77.4 C36 84.6 64 84.6 75.4 77.4"/>
</svg>`,
  },
  {
    id: "hat-22",
    name: "The “22” hat",
    sub: "the hat handed to a fan",
    how: "Answer 22 in a row in Infinite",
    hint: "The number is written on it. Somewhere with no last page.",
    era: "Red",
    art: `<svg class="stick" viewBox="0 0 100 100">
  <path class="ln" fill="#3d382f" d="M24.5 60 C22.6 45 26.4 32.4 36.2 29.4 C41.6 31.6 46.6 34.4 50 36.2 C53.8 33.8 59.4 31 65.2 29 C74.6 32.6 77.4 45 75.5 60 Z"/>
  <path class="ln t" fill="none" stroke="#8b8378" opacity="0.5" d="M36.2 29.4 C39 34 40.4 38.6 40.2 43.6"/>
  <path class="ln t" fill="none" stroke="#8b8378" opacity="0.45" d="M65.2 29 C62.4 33.6 61 38 61 43.2"/>
  <path class="ln" fill="#b8382f" d="M24.6 47.5 C35 52.2 65 52.2 75.4 47.5 L76 56 C65 60.6 35 60.6 24.6 56 Z"/>
  <text x="50" y="57.3" text-anchor="middle" font-family="'Courier Prime',monospace" font-weight="700"
        font-size="8.6" letter-spacing="0.6" fill="#f6efe2">22</text>
  <path class="ln" fill="#2f2b25" d="M11.4 62 C10.4 55.4 20.6 60.6 24.4 60 C34 63.8 66 63.8 75.6 60 C79.6 60.6 89.8 55.4 88.6 62 C88.6 71 71.6 77.4 50 77.4 C28.4 77.4 11.4 71 11.4 62 Z"/>
  <path class="ln t" fill="none" stroke="#6f675a" opacity="0.55" d="M16.6 66.2 C24 71.2 36 74 50 74 C63.8 74 76.4 70.6 83.4 65.6"/>
</svg>`,
  },
  {
    id: "boombox",
    name: "Boombox",
    sub: "1989",
    how: "Finish a run with the sound on",
    hint: "Some players never hear the notebook at all.",
    era: "1989",
    art: `<svg class="stick" viewBox="0 0 100 100">
  <path class="ln" fill="none" style="stroke-width:3.4" d="M35.6 27.6 C34.6 15.6 65.6 15.4 64.6 27.6"/>
  <path class="ln" fill="#57514a" d="M12.6 28.4 C12.6 26 14.4 24.6 17 24.6 L83.4 25 C86 25 87.6 26.6 87.6 29 L87.4 71.4 C87.4 73.8 85.6 75.4 83 75.4 L17 75 C14.4 75 12.6 73.4 12.6 71 Z"/>
  <path class="ln t" fill="#3d382f" d="M17.6 32.6 L44.6 32.8 L44.4 67.4 L17.4 67.2 Z"/>
  <path class="ln t" fill="#3d382f" d="M55.6 33 L82.4 33.2 L82.2 67.6 L55.4 67.4 Z"/>
  <circle class="ln t" cx="31" cy="50" r="12.6" fill="#2b2722"/>
  <circle class="ln t" cx="31" cy="50" r="7.6" fill="#4a443b"/>
  <circle cx="31" cy="50" r="3.2" fill="#8a8175"/>
  <circle class="ln t" cx="68.8" cy="50.2" r="12.4" fill="#2b2722"/>
  <circle class="ln t" cx="68.8" cy="50.2" r="7.4" fill="#4a443b"/>
  <circle cx="68.8" cy="50.2" r="3.1" fill="#8a8175"/>
  <path class="ln t" fill="#d9cfba" d="M46.6 41.4 L53.6 41.4 L53.4 55.4 L46.4 55.4 Z"/>
  <circle cx="50" cy="45.6" r="1.6" fill="#57514a"/>
  <circle cx="50" cy="51" r="1.6" fill="#57514a"/>
  <path class="ln t" fill="#4a8c87" d="M46.4 34.4 L53.6 34.4 L53.6 38.4 L46.4 38.4 Z"/>
  <g fill="#c7951f"><circle cx="47.6" cy="60.4" r="2.1"/><circle cx="52.6" cy="60.6" r="2"/></g>
  <path class="ln t" fill="#3d382f" d="M22.6 75.4 L30.4 75.4 L30.4 80.4 L22.6 80.4 Z"/>
  <path class="ln t" fill="#3d382f" d="M69.4 75.6 L77.4 75.6 L77.4 80.6 L69.4 80.6 Z"/>
</svg>`,
  },
  {
    id: "band-aid",
    name: "Band-aid",
    sub: "Bad Blood",
    how: "Win a kind of run that beat you the last time you played it",
    hint: "A rematch, and this time you take it.",
    era: "1989",
    art: `<svg class="stick" viewBox="0 0 100 100">
  <g transform="rotate(-19 50 50)">
    <path class="ln" fill="#e3c39c" d="M13.6 43.6 C13.6 40 16.6 38 20.6 38.2 L79 38.6 C83.2 38.7 86.4 40.7 86.3 44.2 L86.1 56 C86 59.6 82.9 61.6 79 61.4 L21 61 C16.8 60.9 13.8 58.9 13.9 55.4 Z"/>
    <path class="ln t" fill="#f6efe2" d="M37.6 41.3 L62.6 41.5 L62.4 58.4 L37.3 58.2 Z"/>
    <g fill="#2b2722" opacity="0.32">
      <circle cx="19.8" cy="44.8" r="1.2"/><circle cx="25.8" cy="45.1" r="1.1"/><circle cx="31.6" cy="44.6" r="1.2"/>
      <circle cx="19.6" cy="50.2" r="1.1"/><circle cx="25.9" cy="49.9" r="1.2"/><circle cx="31.8" cy="50.3" r="1.1"/>
      <circle cx="20" cy="55.4" r="1.2"/><circle cx="25.7" cy="55.7" r="1.1"/><circle cx="31.6" cy="55.2" r="1.2"/>
      <circle cx="68.4" cy="44.9" r="1.1"/><circle cx="74.4" cy="44.6" r="1.2"/><circle cx="80.2" cy="45.1" r="1.1"/>
      <circle cx="68.6" cy="50.1" r="1.2"/><circle cx="74.2" cy="50.4" r="1.1"/><circle cx="80.4" cy="49.8" r="1.2"/>
      <circle cx="68.3" cy="55.6" r="1.1"/><circle cx="74.5" cy="55.2" r="1.2"/><circle cx="80.1" cy="55.5" r="1.1"/>
    </g>
    <path fill="#a8322c" opacity="0.8" d="M45.6 47 C48.6 44.6 53.4 45.6 54.6 49 C55.6 52.2 52.6 55.4 49 54.6 C45.6 53.8 43 49.6 45.6 47 Z"/>
    <circle cx="57.4" cy="45.8" r="1.5" fill="#a8322c" opacity="0.55"/>
    <circle cx="43.4" cy="53.6" r="1.1" fill="#a8322c" opacity="0.45"/>
  </g>
</svg>`,
  },
  {
    id: "jewel-bathtub",
    name: "Jewel bathtub",
    sub: "Look What You Made Me Do",
    how: "Walk out of a run you had not missed a page on",
    hint: "Not every clean run has to be finished.",
    era: "reputation",
    art: `<svg class="stick" viewBox="0 0 100 100">
  <path class="ln" fill="#e8dfcc" d="M25.6 70 C21.2 73.6 19.4 80.6 22.6 85.6 C26.4 90 33.6 87.8 34.6 81.8 C35.4 77 33.4 72.2 29.2 70 Z"/>
  <path class="ln" fill="#e8dfcc" d="M71.4 71 C76.6 74 79 80.4 76.4 85 C73.4 90 65.8 88.4 64.2 83 C62.8 78.4 65.6 72.6 69.8 70.4 Z"/>
  <path class="ln" fill="#f6efe2" d="M18.6 43 L81.4 43 C81.4 62.4 78.4 75 70.4 77.6 L29.6 77.6 C21.6 75 18.6 62.4 18.6 43 Z"/>
  <g class="ln t">
    <path fill="#c7951f" d="M50 12.6 L58.6 21.6 L50.6 34 L41.4 21.8 Z"/>
    <path fill="#b0587c" d="M32.6 20.6 L40.2 25.8 L37.2 34.8 L28.8 30.6 Z"/>
    <path fill="#4a8c87" d="M61.4 22.4 L69.8 26 L67.2 35.4 L58.8 31.8 Z"/>
    <path fill="#8b73c9" d="M23.4 29.2 L30.6 32.8 L28.4 40.6 L21.2 36.8 Z"/>
    <path fill="#d0a63a" d="M71.2 30.2 L78.4 33.8 L76.4 41.2 L69.2 37.6 Z"/>
  </g>
  <g stroke="#fbf6e9" stroke-width="0.9" fill="none" opacity="0.5">
    <path d="M41.4 21.8 L58.6 21.6 M50 12.6 L50.6 34"/>
    <path d="M28.8 30.6 L40.2 25.8 M32.6 20.6 L37.2 34.8"/>
    <path d="M58.8 31.8 L69.8 26"/>
  </g>
  <path class="ln" fill="#fbf6e9" d="M15 39.2 C15 35.8 18.4 34.1 22.4 34.1 L78 34.3 C82 34.3 85.2 36 85.2 39.4 C85.2 42.8 81.9 44.3 78 44.2 L22 44 C18 44 15 42.6 15 39.2 Z"/>
  <path class="ln t" fill="none" opacity="0.3" d="M24.4 49.8 C36 53.2 66 53.2 76 49"/>
  <path class="ln t" fill="#b0587c" d="M78.6 33.4 L85.4 36.8 L83.6 43.4 L76.8 39.8 Z"/>
  <path stroke="#fbf6e9" stroke-width="0.9" fill="none" opacity="0.45" d="M76.8 39.8 L85.4 36.8"/>
  <g fill="#c7951f" opacity="0.85">
    <path d="M62.6 12 L63.7 15 L66.7 16.1 L63.7 17.2 L62.6 20.2 L61.5 17.2 L58.5 16.1 L61.5 15 Z"/>
    <path d="M33 13.4 L33.8 15.6 L36 16.4 L33.8 17.2 L33 19.4 L32.2 17.2 L30 16.4 L32.2 15.6 Z"/>
  </g>
</svg>`,
  },
  {
    id: "champagne-coupe",
    name: "Champagne coupe",
    sub: "champagne problems",
    how: "Finish exactly one page short of that board's best",
    hint: "The saddest number is the one just under your own best.",
    era: "folklore and evermore",
    art: `<svg class="stick" viewBox="0 0 100 100">
  <path class="ln" fill="#e2eae7" d="M29.6 31.4 C29.6 45.6 38.4 53.4 50 53.4 C61.6 53.4 70.4 45.6 70.4 31.4 Z"/>
  <path fill="#e2b94e" d="M32.4 35.4 C34.4 45.4 41.4 51.4 50 51.4 C58.6 51.4 65.6 45.4 67.6 35.4 Z"/>
  <path class="ln t" fill="none" stroke="#a8862c" d="M32.4 35.4 C38.4 37.6 61.6 37.6 67.6 35.4"/>
  <ellipse class="ln" cx="50" cy="31.4" rx="20.4" ry="5" fill="#eef4f2"/>
  <path class="ln" fill="#e2eae7" d="M47.4 53.4 L52.6 53.4 L53.4 76.4 L46.6 76.4 Z"/>
  <ellipse class="ln" cx="50" cy="79.4" rx="14.4" ry="4.4" fill="#e2eae7"/>
  <path class="ln t" fill="none" stroke="#a9b8b4" opacity="0.8" d="M35.6 34.6 C36.6 43.6 40.4 48.4 45 50.6"/>
  <circle class="ln" cx="59.6" cy="17.4" r="4.2" fill="#f4f8f6"/>
  <path class="ln t" fill="none" stroke="#a9b8b4" d="M57.6 15.6 C58 14.4 59 13.6 60.4 13.6"/>
</svg>`,
  },
  {
    id: "solitaire",
    name: "Solitaire",
    sub: "Bejeweled",
    how: "Answer a word only one song in the whole catalogue sings",
    hint: "A word with nowhere else to go.",
    era: "Midnights",
    art: `<svg class="stick" viewBox="0 0 100 100">
  <path class="ln" fill="#8fc6e0" d="M28.6 21.6 L71.4 21.6 L88 38.6 L50 80.4 L12 38.6 Z"/>
  <path class="ln t" fill="#c4e4f2" d="M28.6 21.6 L71.4 21.6 L60.6 38.6 L39.4 38.6 Z"/>
  <path class="ln t" fill="#6fb0d0" d="M12 38.6 L28.6 21.6 L39.4 38.6 Z"/>
  <path class="ln t" fill="#a8d6ea" d="M71.4 21.6 L88 38.6 L60.6 38.6 Z"/>
  <path class="ln t" fill="#6aa8c8" d="M12 38.6 L39.4 38.6 L50 80.4 Z"/>
  <path class="ln t" fill="none" stroke="#fbf6e9" opacity="0.55" d="M39.4 38.6 L60.6 38.6 M60.6 38.6 L50 80.4"/>
  <g fill="#e8f4fa">
    <path d="M79.6 12.4 L81.4 16.6 L85.6 18.4 L81.4 20.2 L79.6 24.4 L77.8 20.2 L73.6 18.4 L77.8 16.6 Z"/>
    <path d="M19.4 60.4 L20.6 63.4 L23.6 64.6 L20.6 65.8 L19.4 68.8 L18.2 65.8 L15.2 64.6 L18.2 63.4 Z"/>
  </g>
</svg>`,
  },
  {
    id: "chess-queen",
    name: "Chess queen",
    sub: "Mastermind",
    how: "Beat a challenge's dark side",
    hint: "Somewhere past a challenge you have already beaten.",
    era: "Midnights",
    art: `<svg class="stick" viewBox="0 0 100 100">
  <path class="ln" fill="#38332c" d="M34.6 27.6 L37.4 15.6 L43.4 25.4 L46.6 12.6 L50.2 24.6 L53.8 12.4 L57 25.6 L63.2 15.4 L65.6 27.6 Z"/>
  <g class="ln t" fill="#38332c">
    <circle cx="37.4" cy="14.4" r="2.8"/><circle cx="46.6" cy="11.4" r="2.9"/>
    <circle cx="53.8" cy="11.2" r="2.8"/><circle cx="63.2" cy="14.2" r="2.9"/>
  </g>
  <path class="ln" fill="#453f37" d="M33.4 27.4 L66.6 27.6 L65 34.6 L35 34.4 Z"/>
  <path class="ln" fill="#38332c" d="M38.4 34.6 C35.6 46.6 42.4 52.6 42 59.4 L58 59.6 C57.6 52.6 64.6 46.6 61.6 34.6 Z"/>
  <path class="ln" fill="#453f37" d="M39.4 59.4 L60.6 59.6 L64.6 71.4 L35.4 71.2 Z"/>
  <path class="ln" fill="#38332c" d="M30.4 71.4 L69.6 71.6 C72.2 71.6 73.6 73 73.6 75.4 C73.6 77.8 72 79.4 69.4 79.4 L30.6 79.2 C28 79.2 26.4 77.6 26.4 75.2 C26.4 72.8 27.8 71.4 30.4 71.4 Z"/>
  <path class="ln t" fill="none" stroke="#8a8175" opacity="0.55" d="M42.4 37.6 C40.4 46.6 45.4 52.6 45.4 58.4"/>
  <path class="ln t" fill="none" stroke="#8a8175" opacity="0.4" d="M31.6 74 C41.4 76.4 58.6 76.6 68.4 74.4"/>
</svg>`,
  },
  {
    id: "lavender-sprig",
    name: "Lavender sprig",
    sub: "Lavender Haze",
    how: "Sit on one page for 90 seconds before answering it",
    hint: "Something left between the pages, and forgotten there a while.",
    era: "Midnights",
    art: `<svg class="stick" viewBox="0 0 100 100">
  <path class="ln" fill="none" stroke="#7a8c5a" style="stroke-width:3.1" d="M53.4 89 C51.6 74 48.2 60 46.6 46.4"/>
  <path class="ln" fill="none" stroke="#7a8c5a" style="stroke-width:2.3" d="M46.6 46.4 C45.6 36 45 26 44.4 15.6"/>
  <path class="ln t" fill="#8aa06a" d="M49.6 68.6 C42.6 64.4 36.6 65.4 32.8 69.8 C38.2 73.2 45.4 73.4 49.6 68.6 Z"/>
  <path class="ln t" fill="#8aa06a" d="M50.4 60.2 C57.2 55.2 63.4 55.8 66.6 59.6 C61.6 63.4 54.6 64.4 50.4 60.2 Z"/>
  <path class="ln t" fill="none" stroke="#6d7d4e" opacity="0.6" d="M49.6 68.6 C44.6 68 39 68.6 32.8 69.8 M50.4 60.2 C55.4 59.4 61.4 59.2 66.6 59.6"/>
  <g class="ln t" stroke="#5d4a94">
    <ellipse cx="49.6" cy="42.2" rx="4.3" ry="5.4" transform="rotate(24 49.6 42.2)" fill="#8b73c9"/>
    <ellipse cx="41" cy="41" rx="4.1" ry="5.2" transform="rotate(-21 41 41)" fill="#7c62be"/>
    <ellipse cx="50.4" cy="36.6" rx="4.2" ry="5.3" transform="rotate(19 50.4 36.6)" fill="#9b85d2"/>
    <ellipse cx="40.6" cy="35.6" rx="3.9" ry="5" transform="rotate(-25 40.6 35.6)" fill="#8b73c9"/>
    <ellipse cx="49.8" cy="31.4" rx="4" ry="5" transform="rotate(22 49.8 31.4)" fill="#7c62be"/>
    <ellipse cx="40.2" cy="30.4" rx="3.7" ry="4.7" transform="rotate(-18 40.2 30.4)" fill="#9b85d2"/>
    <ellipse cx="49" cy="26.4" rx="3.7" ry="4.6" transform="rotate(26 49 26.4)" fill="#8b73c9"/>
    <ellipse cx="40" cy="25.4" rx="3.5" ry="4.4" transform="rotate(-22 40 25.4)" fill="#7c62be"/>
    <ellipse cx="48.2" cy="21.8" rx="3.4" ry="4.2" transform="rotate(20 48.2 21.8)" fill="#9b85d2"/>
    <ellipse cx="40.4" cy="20.8" rx="3.2" ry="4" transform="rotate(-26 40.4 20.8)" fill="#8b73c9"/>
    <ellipse cx="47" cy="17.4" rx="3" ry="3.7" transform="rotate(18 47 17.4)" fill="#7c62be"/>
    <ellipse cx="41.2" cy="16.6" rx="2.8" ry="3.5" transform="rotate(-20 41.2 16.6)" fill="#9b85d2"/>
    <ellipse cx="44.2" cy="12.4" rx="2.9" ry="3.6" transform="rotate(6 44.2 12.4)" fill="#8b73c9"/>
  </g>
  <g class="ln t" stroke="#a68f63" fill="none" style="stroke-width:1.5">
    <path fill="#d3bd91" d="M43.8 74.4 L55.6 72.2 L56.6 77.8 L44.8 80 Z"/>
    <path fill="#d3bd91" d="M55.8 73.4 C61.2 71.4 64.2 68.8 63.6 65.8 C61 68 58.4 70.2 55.2 71.6 Z"/>
    <path fill="#d3bd91" d="M56.2 77 C61.6 78.2 64.8 80.8 64.4 83.8 C61.6 81.8 58.8 80 55.6 79 Z"/>
  </g>
</svg>`,
  },
  {
    id: "matchbook",
    name: "Half-struck matchbook",
    sub: "Fortnight",
    how: "Keep a Daily Challenge streak going for a fortnight",
    hint: "Come back tomorrow. And the day after. And the twelve after that.",
    era: "The Tortured Poets Department",
    art: `<svg class="stick" viewBox="0 0 100 100">
  <g transform="rotate(-5 50 56)">
    <g class="ln t" stroke="#4a3f36">
      <path fill="#efe6d4" d="M22.6 60 L23.4 36.4 Q26.2 33.6 29 36.2 L29.4 60 Z"/>
      <ellipse cx="26.2" cy="34.4" rx="3.7" ry="4.3" transform="rotate(-6 26.2 34.4)" fill="#b8382f"/>
      <path fill="#efe6d4" d="M31.4 60 L32 33.2 Q34.8 30.4 37.6 33 L38.2 60 Z"/>
      <ellipse cx="34.8" cy="31.2" rx="3.8" ry="4.4" transform="rotate(3 34.8 31.2)" fill="#c0392f"/>
      <path fill="#efe6d4" d="M40.2 60 L40.6 35 Q43.4 32.2 46.2 34.8 L46.4 60 Z"/>
      <ellipse cx="43.4" cy="33" rx="3.7" ry="4.3" transform="rotate(-4 43.4 33)" fill="#b8382f"/>
      <path fill="#efe6d4" d="M57.6 60 L58.2 32.6 Q61 29.8 63.8 32.4 L64 60 Z"/>
      <ellipse cx="61" cy="30.6" rx="3.9" ry="4.5" transform="rotate(5 61 30.6)" fill="#c0392f"/>
      <path fill="#efe6d4" d="M66.4 60 L67 36 Q69.8 33.2 72.6 35.8 L72.8 60 Z"/>
      <ellipse cx="69.8" cy="34" rx="3.7" ry="4.3" transform="rotate(-3 69.8 34)" fill="#b8382f"/>
    </g>
    <g transform="rotate(18 74 54)">
      <path class="ln t" stroke="#4a3f36" fill="#efe6d4" d="M71.4 56 L72 28.8 Q74.6 26 77.2 28.6 L77.4 56 Z"/>
      <path fill="#3a3530" d="M72 31.8 L72.05 28.8 Q74.6 26 77.2 28.6 L77.25 31.6 Z"/>
      <path fill="#e08a2e" stroke="#c8752a" stroke-width="1.1" stroke-linejoin="round"
            d="M74.6 27.8 C79.6 24.6 80.6 18 78 12.4 C77.3 17.6 74.4 19 72.6 21.9 C70.8 24.8 71.4 27.1 74.6 27.8 Z"/>
      <path fill="#f2c552" d="M74.8 25.6 C77.5 22.8 77.9 18.4 76.7 15.2 C76 18.8 74.2 19.8 73.5 21.8 C72.8 23.8 73.2 25 74.8 25.6 Z"/>
    </g>
    <path class="ln" fill="#3a3530" d="M19.6 58.2 C19.3 56.7 20.2 55.8 21.6 55.6 L78 51.4 C79.4 51.3 80.5 52.1 80.7 53.5 L83.5 80.9 C83.7 82.3 82.8 83.3 81.4 83.5 L24.6 87.7 C23.2 87.8 22.2 87 22 85.6 Z"/>
    <path fill="#7d7367" d="M23.7 68.8 L79.7 64.6 L80.9 75.2 L24.9 79.2 Z"/>
    <g fill="#3a3530" opacity="0.45">
      <circle cx="30" cy="71.6" r="0.8"/><circle cx="38.6" cy="73.4" r="0.7"/><circle cx="47" cy="70.4" r="0.8"/>
      <circle cx="55.4" cy="72.8" r="0.7"/><circle cx="63.8" cy="69.8" r="0.8"/><circle cx="72" cy="72.2" r="0.7"/>
      <circle cx="34.4" cy="76.4" r="0.7"/><circle cx="59" cy="76" r="0.7"/><circle cx="68.6" cy="75.4" r="0.6"/>
    </g>
    <g stroke="#efe6d4" stroke-width="1" opacity="0.4" fill="none" stroke-linecap="round">
      <path d="M33 74.6 L44 69.4"/><path d="M52 75 L62 70.2"/>
    </g>
    <g stroke="#efe6d4" stroke-width="1.5" opacity="0.32" fill="none" stroke-linecap="round">
      <path d="M27.6 60.4 L53 58.6"/><path d="M27.8 63.8 L45 62.6"/>
    </g>
  </g>
</svg>`,
  },
  {
    id: "poet-bust",
    name: "Marble poet bust",
    sub: "The Tortured Poets Department",
    how: "Sing four or more lines in a row of one real section",
    hint: "Do not name the song. Keep singing it.",
    era: "The Tortured Poets Department",
    art: `<svg class="stick" viewBox="0 0 100 100">
  <path class="ln" fill="#d3ccbc" d="M45.4 47.6 L54.6 47.6 L55 60.4 L45 60.4 Z"/>
  <path class="ln" fill="#ddd6c8" d="M35 57.6 C30.6 64 28 70 27.4 76.4 L72.6 76.6 C72 70 69.4 64 65 57.6 C60.6 61.6 55.4 63.6 50 63.6 C44.6 63.6 39.4 61.6 35 57.6 Z"/>
  <path class="ln t" fill="none" stroke="#a89f8c" opacity="0.7" d="M34.6 63.6 C44.4 70 57.6 72 69.4 70.6"/>
  <path class="ln" fill="#e6e0d2" d="M50 13.6 C61 13.6 67.6 22.6 67.6 34.4 C67.6 46 61 55.4 50 55.4 C39 55.4 32.4 46 32.4 34.4 C32.4 22.6 39 13.6 50 13.6 Z"/>
  <path class="ln" fill="#cfc8b8" d="M32.6 36.4 C30.4 21 39 11.4 50 11.4 C61 11.4 69.6 21 67.4 36.4 C66 29.6 63.4 26.6 59.4 27.6 C57.4 22.6 53.4 20.6 50 22.6 C46.6 20.6 42.6 22.6 40.6 27.6 C36.6 26.6 34 29.6 32.6 36.4 Z"/>
  <g class="ln t" fill="none" stroke="#a89f8c" opacity="0.75">
    <path d="M38.6 22.6 C40.6 19.6 43.6 18.4 46.4 19.6"/>
    <path d="M53.6 19.6 C56.4 18.4 59.4 19.6 61.4 22.6"/>
    <path d="M36.4 30.4 C37.4 27.6 39.4 26 41.6 26.4"/>
    <path d="M40.4 27.4 C42.4 24.6 45.4 24 47.6 25.6"/>
    <path d="M52.4 25.4 C54.6 23.8 57.6 24.6 59.4 27.4"/>
    <path d="M63.4 30.6 C62.6 27.8 60.6 26.2 58.4 26.6"/>
  </g>
  <g class="ln t" fill="#dcd5c6" stroke="#a89f8c" style="stroke-width:1.2">
    <path d="M39.6 35.6 C41.6 33 45.8 33 47.8 35.6 C45.8 38 41.6 38 39.6 35.6 Z"/>
    <path d="M52.2 35.6 C54.2 33 58.4 33 60.4 35.6 C58.4 38 54.2 38 52.2 35.6 Z"/>
  </g>
  <g class="ln t" fill="none" stroke="#a89f8c" style="stroke-width:1.3">
    <path d="M49.8 37.6 L48.8 44.6 C48.8 45.6 51 46 52.4 45"/>
    <path style="stroke-width:1.6" stroke="#8e8677" d="M45.4 49.8 C47.8 51 52.2 51 54.6 49.8"/>
  </g>
  <g class="ln t" fill="#a8b48c" stroke="#6f7a58">
    <path d="M32 28.4 C27.4 25.6 23 27.6 22.6 32.4 C27.4 34 31 32.4 32.6 29.4 Z"/>
    <path d="M34.6 21.6 C31 18 26.6 19.4 25.6 24 C29.6 26.4 33.4 25.4 35.6 22.6 Z"/>
    <path d="M40 16.4 C37.6 12 33.4 11.4 30.6 14.6 C33.4 18.4 36.6 19.4 39.6 18 Z"/>
    <path d="M67.6 29.4 C72 26.4 76.4 28.4 76.6 33.4 C72 34.6 68.6 33 67.4 30.4 Z"/>
    <path d="M65.4 22.4 C69 19.4 73.4 21 74.4 25.6 C70.4 27.6 66.6 26.4 64.6 23.6 Z"/>
  </g>
  <path class="ln" fill="#cfc8ba" d="M33.6 76.4 L66.4 76.6 L66.4 82.6 L33.6 82.4 Z"/>
  <path class="ln" fill="#c4bcac" d="M35.6 82.6 L64.4 82.8 L66.4 90.4 L33.6 90.2 Z"/>
  <path class="ln t" fill="none" stroke="#a89f8c" opacity="0.55" d="M56.4 82.8 L58.4 90.2"/>
</svg>`,
  },
  {
    id: "ufo",
    name: "UFO",
    sub: "Down Bad",
    how: "Catch the bottle drifting past the page",
    hint: "Now and then something drifts past the page. Do not let it go.",
    era: "The Tortured Poets Department",
    art: `<svg class="stick" viewBox="0 0 100 100">
  <path fill="#e2c96a" opacity="0.5" d="M37.4 54.6 L62.6 54.6 L74.6 90.4 L25.4 90.2 Z"/>
  <path fill="#f0dc94" opacity="0.5" d="M41.4 54.6 L58.6 54.6 L65.4 90.4 L34.6 90.2 Z"/>
  <path fill="#faf0c4" opacity="0.55" d="M46.4 54.6 L53.6 54.6 L55.6 90.4 L44.4 90.2 Z"/>
  <path class="ln" fill="#a8d0e0" d="M35.6 34.6 C35.6 24.4 41.4 17.6 50 17.6 C58.6 17.6 64.4 24.4 64.4 34.6 C58.4 31.4 41.6 31.4 35.6 34.6 Z"/>
  <path class="ln t" fill="#d6ecf4" d="M40.4 30.6 C41.4 25.4 44.4 21.6 48.6 20.6 C46.4 23.4 44.6 26.6 44 30.4 Z"/>
  <path class="ln" fill="#8a939c" d="M17.6 45.4 C17.6 37.6 32 31.6 50 31.6 C68 31.6 82.4 37.6 82.4 45.4 C82.4 51.6 68 56.6 50 56.6 C32 56.6 17.6 51.6 17.6 45.4 Z"/>
  <path class="ln t" fill="#b4bcc4" d="M22.6 41.4 C28.6 37.4 38.4 35 50 35 C61.6 35 71.4 37.4 77.4 41.4 C71.4 44.4 61.6 46.4 50 46.4 C38.4 46.4 28.6 44.4 22.6 41.4 Z"/>
  <g class="ln t" stroke="#4a443b">
    <circle cx="30.4" cy="51.6" r="3.1" fill="#e2b94e"/>
    <circle cx="43.4" cy="54.4" r="3.2" fill="#b8382f"/>
    <circle cx="57" cy="54.6" r="3.1" fill="#e2b94e"/>
    <circle cx="69.6" cy="51.4" r="3.2" fill="#b8382f"/>
  </g>
  <g class="ln t" fill="none" stroke="#c9b46a" opacity="0.8">
    <path d="M43.4 76.6 L47.6 74.4"/><path d="M53.6 68.4 L57.4 66.6"/><path d="M45.6 62.6 L48.4 61.4"/>
  </g>
</svg>`,
  },
  {
    id: "cat-in-a-tiara",
    name: "Cat in a tiara",
    sub: "childless cat lady",
    how: "Answer the page for karma with Karma",
    hint: "Sometimes the word and the song are the same thing.",
    era: "Whimsy",
    art: `<svg class="stick" viewBox="0 0 100 100">
  <path class="ln" fill="#dcc39a" d="M31.4 40.6 L26.6 22.4 L45.4 32.6 Z"/>
  <path class="ln" fill="#dcc39a" d="M69.4 39.4 L75.6 21.6 L56.4 31.4 Z"/>
  <path class="ln t" fill="#d99aa8" d="M33.6 37 L31.4 27 L41.4 32.6 Z"/>
  <path class="ln t" fill="#d99aa8" d="M67.4 36 L70.8 26.6 L61 31.4 Z"/>
  <path class="ln" fill="#dcc39a" d="M50 29.6 C64.4 29.6 74.6 40 74.6 54.4 C74.6 68.6 64.6 78.6 50 78.6 C35.4 78.6 25.4 68.6 25.4 54.4 C25.4 40 35.6 29.6 50 29.6 Z"/>
  <g class="ln t" fill="none" opacity="0.5">
    <path d="M32.6 59.4 L19.6 57.4"/><path d="M33.4 64.6 L21.6 67.4"/>
    <path d="M67.4 59.6 L80.4 58"/><path d="M66.6 64.8 L78.4 68"/>
  </g>
  <path class="ln t" fill="#2b2722" d="M35.6 54.4 C37.6 48.6 44 48.4 46.2 54.4 C44 59.4 37.6 59.4 35.6 54.4 Z"/>
  <path class="ln t" fill="#2b2722" d="M53.8 54.6 C56 48.6 62.4 48.8 64.4 54.6 C62.4 59.6 56 59.4 53.8 54.6 Z"/>
  <circle cx="42.6" cy="52.4" r="1.7" fill="#f6efe2"/>
  <circle cx="61.4" cy="52.6" r="1.6" fill="#f6efe2"/>
  <path class="ln t" fill="#d99aa8" d="M46.6 62.6 L53.4 62.6 L50 66.6 Z"/>
  <path class="ln t" fill="none" d="M50 66.6 L50 68.6 C50 70.6 47.8 71.2 46.4 69.6 M50 68.6 C50 70.6 52.4 71.4 53.8 69.8"/>
  <g transform="rotate(-7 50 34)">
    <path class="ln t" stroke="#8a6a1c" fill="#c7951f" d="M37.4 40 L39.6 30.6 L45 37 L50 27.6 L55 37 L60.4 30.4 L62.6 40.2 C57 37.6 43 37.6 37.4 40 Z"/>
    <circle cx="39.6" cy="29.4" r="1.9" fill="#d98aa8" stroke="#8a6a1c" stroke-width="1"/>
    <circle cx="50" cy="26.4" r="2.1" fill="#8ea8d8" stroke="#8a6a1c" stroke-width="1"/>
    <circle cx="60.4" cy="29.2" r="1.8" fill="#d98aa8" stroke="#8a6a1c" stroke-width="1"/>
  </g>
</svg>`,
  },
  // ---- The guest shelf ---------------------------------------------------
  // One souvenir per guest catalogue, for clearing all thirteen pages of it at ANY
  // difficulty, hints allowed. These are the one family that DOES turn on a score, and
  // the exception is argued in scripts/stickers/STICKERS.md: a band sticker is a place
  // you have been, and the shelf exists to be visited. The stricter mark, a perfect
  // hint-free run, stays the guest board's own ADMITTED stamp and its charms.
  // Ids are `guest-` + the GUESTS id, so endGuest derives one rather than keeping a map.
  // Only the four PLAYABLE guests are here. All ten editable originals live in
  // stickers/guests/; sync_guests.py embeds the live four below without runtime fetches.
  // The six parked originals can be viewed on scripts/stickers/guest-stickers.html.
  // Append one here when its catalogue ships,
  // never insert, or the whole cover re-deals.
  {
    id: "guest-olivia-rodrigo",
    name: "Driver's licence",
    sub: "Olivia Rodrigo",
    how: "Clear a whole guest shelf: Olivia Rodrigo",
    hint: "Somebody else's records, and not one page missed.",
    era: "The guest shelf",
    art: `<svg xmlns="http://www.w3.org/2000/svg" class="stick" viewBox="0 0 100 100">
<g stroke-linecap="round" stroke-linejoin="round">
<g transform="rotate(-8 50 50)">
<path d="M12 22 Q9 22 9 26 L9.5 76 Q9.5 79 13 79 L88 78.5 Q91 78.5 91 75 L90.6 25 Q90.6 21.5 87 21.5 Z" fill="#c9bfd0" stroke="#302d27" stroke-width="1.65" />
<path d="M11 73.5 Q45 76 89.5 73.2 L89.5 75.5 Q89.5 77 87 77 L13 77.5 Q11 77.5 11 75 Z" fill="#b8acbf" stroke="#302d27" stroke-width="0" />
<path d="M15.8 28.1 L46.2 27.3 L46.5 30.7 L16.1 31.5 Z" fill="#564b60" stroke="#302d27" stroke-width="0" />
<path d="M49.7 27.2 L74.4 26.6 L74.7 30 L50 30.6 Z" fill="#564b60" stroke="#302d27" stroke-width="0" />
<path d="M15.6 35.7 L84.4 34.7" fill="none" stroke="#807688" stroke-width="0.75" />
<path d="M15.5 40 L37.5 39.5 L38.2 70.5 L15.9 71 Z" fill="#ece7e5" stroke="#302d27" stroke-width="1" />
<path d="M27 50.4 C23.5 44.4 18.5 44.1 18.3 49.8 C18.2 54.1 21.8 55.7 26.1 56.2 C21.5 57 19.1 60.7 20.9 63.3 C22.5 65.5 25.7 63.6 26.7 59.3 Z" fill="#8a719b" stroke="#302d27" stroke-width="0.8" />
<path d="M27.9 50.4 C31.7 43.9 36.8 44.9 36.3 50.5 C36 54.5 32.2 55.9 28.5 56.2 C33.3 56.9 35.7 60.3 33.8 62.7 C32.1 64.9 29.1 63 28.1 59.1 Z" fill="#8a719b" stroke="#302d27" stroke-width="0.8" />
<path d="M25.6 50.2 C23.3 47.1 20.6 46.9 20.4 49.9 C20.3 52.4 22.9 53.7 25.5 54.1 Z" fill="#a992bb" stroke="#302d27" stroke-width="0" />
<path d="M29.4 50 C31.7 46.6 34.4 46.7 34.4 49.8 C34.4 52.3 31.8 53.6 29.2 54 Z" fill="#a992bb" stroke="#302d27" stroke-width="0" />
<path d="M27.4 48.7 C28.5 52.4 28.5 57.5 27.3 61.6 C26.3 57.5 26.3 52.4 27.4 48.7 Z" fill="#3d3348" stroke="#302d27" stroke-width="0" />
<path d="M27.2 49.2 Q25.5 46 24.1 45.4" fill="none" stroke="#302d27" stroke-width="0.55" />
<path d="M27.9 49.2 Q29.3 46.3 30.9 45.9" fill="none" stroke="#302d27" stroke-width="0.55" />
<path d="M45 43 L83 42.4" fill="none" stroke="#49434b" stroke-width="1.05" />
<path d="M45 50.5 L78.2 50" fill="none" stroke="#49434b" stroke-width="1.05" />
<path d="M45 58 L71.5 57.6" fill="none" stroke="#49434b" stroke-width="1.05" />
<path d="M45 69 L53.5 68.8" fill="none" stroke="#49434b" stroke-width="1.05" />
<ellipse cx="66" cy="69" rx="0.6" ry="0.6" fill="#49434b" stroke="#302d27" stroke-width="0" />
<ellipse cx="72" cy="69" rx="0.6" ry="0.6" fill="#49434b" stroke="#302d27" stroke-width="0" />
<ellipse cx="78" cy="69" rx="0.6" ry="0.6" fill="#49434b" stroke="#302d27" stroke-width="0" />
</g>
</g>
</svg>`,
  },
  {
    id: "guest-wicked-soundtrack",
    name: "Witch's hat",
    sub: "Wicked",
    how: "Clear a whole guest shelf: Wicked",
    hint: "There is a shelf of other people's songs behind the notebook.",
    era: "The guest shelf",
    art: `<svg xmlns="http://www.w3.org/2000/svg" class="stick" viewBox="0 0 100 100">
<g stroke-linecap="round" stroke-linejoin="round">
<path d="M9 77 C16 70 25 65 37 62 C56 57 78 53 88 59 C102 68 79 83 55 87 C36 91 11 88 7 83 Q5 80 9 77 Z" fill="#403d35" stroke="#302d27" stroke-width="1.65" />
<path d="M8 81 C30 87 59 83 78 73 C84 70 89 67 91 62 C96 70 78 81 56 86 C33 90 14 86 8 83 Z" fill="#32312b" stroke="#302d27" stroke-width="0" />
<path d="M30 67 C28 61 32 53 33 45 C34 40 33 33 38 29 C43 25 45 17 49 12 C54 5 59 7 63 11 L75 17 Q78 18 83 15 C87 13 85 19 80 23 Q76 26 73 24 L68 21 C68 26 64 29 64 32 C64 35 68 39 66 43 C65 46 64 47 65 51 L69 64 C58 72 41 73 30 67 Z" fill="#403e35" stroke="#302d27" stroke-width="1.65" />
<path d="M54 10 C48 20 49 24 43 30 C37 36 39 41 36 49 C34 55 34 61 32 65 C29 57 34 45 34 39 C33 32 42 28 45 20 Q50 9 54 10 Z" fill="#4e4a40" stroke="#302d27" stroke-width="0" />
<path d="M60 16 C61 24 65 25 62 31 C59 36 64 40 62 45 Q59 56 64 65 L68 64 C64 53 64 49 66 43 C68 38 61 36 64 31 Q68 24 66 22 Z" fill="#34322c" stroke="#302d27" stroke-width="0" />
<path d="M58 17 Q61 20 61 25" fill="none" stroke="#5d5649" stroke-width="0.82" />
<path d="M63 28 Q58 32 61 36" fill="none" stroke="#5d5649" stroke-width="0.82" />
<path d="M38 55 Q43 53 46 55" fill="none" stroke="#5d5649" stroke-width="0.82" />
<path d="M34 60 Q40 64 46 63" fill="none" stroke="#5d5649" stroke-width="0.82" />
<path d="M15 80 Q25 83 35 82" fill="none" stroke="#5d5649" stroke-width="0.82" />
<path d="M72 77 Q82 73 86 68" fill="none" stroke="#5d5649" stroke-width="0.82" />
<path d="M30.4 62 C40 66 53 65 64 60 L66.5 67 C55 73 41 74 29 70 Q27.5 67 30.4 62 Z" fill="#c99486" stroke="#302d27" stroke-width="1.25" />
<path d="M29 68 C41 72 54 69 65 65 L66 68 C53 74 39 74 29 71 Z" fill="#b67f74" stroke="#302d27" stroke-width="0" />
<path d="M59 69 C61 77 67 83 69 92 L73 89 L79 91 C73 79 69 73 63 67 Z" fill="#ce9687" stroke="#302d27" stroke-width="1.3" />
<path d="M62 70 C69 71 76 77 83 84 L77 85 L79 89 C72 87 67 80 61 73 Z" fill="#c38c80" stroke="#302d27" stroke-width="1.3" />
<path d="M61 68 C55 63 50 63 49 69 C47 74 50 78 54 77 Q60 75 63 70 Z" fill="#d7a295" stroke="#302d27" stroke-width="1.25" />
<path d="M62 67 C67 57 72 61 72 66 C72 70 68 71 63 71 Z" fill="#cd9487" stroke="#302d27" stroke-width="1.25" />
<path d="M60 65 C64 63 67 68 65 72 Q61 74 59 71 Z" fill="#dba89a" stroke="#302d27" stroke-width="1.1" />
<path d="M60 69 Q55 68 53 73" fill="none" stroke="#835f54" stroke-width="0.72" />
<path d="M66 67 Q68 64 69 64" fill="none" stroke="#835f54" stroke-width="0.72" />
<path d="M65 75 Q69 82 71 87" fill="none" stroke="#835f54" stroke-width="0.72" />
<path d="M32 66 Q42 69 52 66" fill="none" stroke="#835f54" stroke-width="0.72" />
</g>
</svg>`,
  },
  {
    id: "guest-hannah-montana",
    name: "Blonde wig",
    sub: "Hannah Montana",
    how: "Clear a whole guest shelf: Hannah Montana",
    hint: "A borrowed catalogue, played until there is nothing left of it.",
    era: "The guest shelf",
    art: `<svg xmlns="http://www.w3.org/2000/svg" class="stick" viewBox="0 0 100 100">
<g stroke-linecap="round" stroke-linejoin="round">
<path d="M49 9 C35 5 24 16 22 29 C19 40 18 55 16 69 C14 81 17 88 26 89 L30 89 L27 86 Q33 90 38 88 Q29 81 30 71 L32 40 L68 40 L70 72 Q70 82 63 88 Q69 90 74 86 L72 90 C84 91 88 82 85 70 C83 55 82 39 79 28 C76 14 65 5 53 9 Q51 10 49 9 Z" fill="#e4c17e" stroke="#302d27" stroke-width="1.55" />
<path d="M29 19 C20 37 24 59 21 73 Q19 85 26 88 C15 86 17 76 19 64 L22 34 Q23 25 29 19 Z" fill="#c9a367" stroke="#302d27" stroke-width="0" />
<path d="M67 15 C77 27 75 43 77 60 C77 73 81 82 74 88 Q87 86 83 69 L79 32 Q76 19 67 15 Z" fill="#c7a167" stroke="#302d27" stroke-width="0" />
<path d="M32 31 C31 45 29 56 28 69 C27 77 28 81 31 85 C26 81 25 74 26 66 Q29 40 32 31 Z" fill="#efcf8e" stroke="#302d27" stroke-width="0" />
<path d="M70 37 Q73 57 73 71 Q74 79 70 84 C77 82 76 70 75 60 Z" fill="#efd093" stroke="#302d27" stroke-width="0" />
<path d="M30 40 C30 28 34 18 43 15 Q49 12 52 15 C61 13 69 25 70 40 L65.8 40 L65.5 37.5 L65 40 L60.3 40 L59.9 36 L59.5 40 L54.5 40 L54 37 L53.5 40 L49 40 L48.5 37 L48 40 L43.8 39.8 L43.3 36.5 L42.7 40 L38.3 39.8 L37.8 37 L37.2 40 Z" fill="#e8c885" stroke="#302d27" stroke-width="0" />
<path d="M30 40 L37.2 40 L37.8 37 L38.3 39.8 L42.7 40 L43.3 36.5 L43.8 39.8 L48 40 L48.5 37 L49 40 L53.5 40 L54 37 L54.5 40 L59.5 40 L59.9 36 L60.3 40 L65 40 L65.5 37.5 L65.8 40 L70 40" fill="none" stroke="#4b422e" stroke-width="0.68" />
<path d="M30 39 C30 31 32 25 35 22" fill="none" stroke="#4b422e" stroke-width="0.68" />
<path d="M36 39 Q34 31 38 24" fill="none" stroke="#4b422e" stroke-width="0.68" />
<path d="M42 38 Q40 28 43 22" fill="none" stroke="#4b422e" stroke-width="0.68" />
<path d="M48 39 Q46 29 47 24" fill="none" stroke="#4b422e" stroke-width="0.68" />
<path d="M54 39 Q54 29 52 24" fill="none" stroke="#4b422e" stroke-width="0.68" />
<path d="M60 39 Q61 30 57 23" fill="none" stroke="#4b422e" stroke-width="0.68" />
<path d="M66 38 Q67 28 61 21" fill="none" stroke="#4b422e" stroke-width="0.68" />
<path d="M35 18 Q41 13 48 14" fill="none" stroke="#4b422e" stroke-width="0.68" />
<path d="M53 13 Q61 12 67 19" fill="none" stroke="#4b422e" stroke-width="0.68" />
<path d="M26 32 C23 44 25 52 23 66 Q20 80 26 85" fill="none" stroke="#4b422e" stroke-width="0.68" />
<path d="M28 46 C29 57 23 75 29 83" fill="none" stroke="#4b422e" stroke-width="0.68" />
<path d="M31 76 Q32 82 36 85" fill="none" stroke="#4b422e" stroke-width="0.68" />
<path d="M21 42 C19.5 54 21 64 19 76" fill="none" stroke="#4b422e" stroke-width="0.68" />
<path d="M30 44 C29.5 58 27.5 70 30.5 80" fill="none" stroke="#4b422e" stroke-width="0.68" />
<path d="M79 42 C81 54 79.5 64 81.5 76" fill="none" stroke="#4b422e" stroke-width="0.68" />
<path d="M70.5 45 C71 58 73 70 70 80" fill="none" stroke="#4b422e" stroke-width="0.68" />
<path d="M74 33 C77 46 74 56 78 70 Q81 82 75 86" fill="none" stroke="#4b422e" stroke-width="0.68" />
<path d="M72 48 C71 61 79 77 72 84" fill="none" stroke="#4b422e" stroke-width="0.68" />
<path d="M69 77 Q69 82 66 85" fill="none" stroke="#4b422e" stroke-width="0.68" />
<path d="M31 25 Q29 33 29 36" fill="none" stroke="#f4dba2" stroke-width="0.9" />
<path d="M40 18 Q44 16 47 16" fill="none" stroke="#f4dba2" stroke-width="0.9" />
<path d="M20 73 Q19 80 22 83" fill="none" stroke="#f4dba2" stroke-width="0.9" />
<path d="M80 75 Q82 80 79 84" fill="none" stroke="#f4dba2" stroke-width="0.9" />
</g>
</svg>`,
  },
  {
    id: "guest-billie-eilish",
    name: "Green roots",
    sub: "Billie Eilish",
    how: "Clear a whole guest shelf: Billie Eilish",
    hint: "Thirteen pages of a catalogue that is not hers.",
    era: "The guest shelf",
    art: `<svg xmlns="http://www.w3.org/2000/svg" class="stick" viewBox="0 0 100 100">
<g stroke-linecap="round" stroke-linejoin="round">
<path d="M50 13 C37 6 26 15 22 26 C16 40 19 46 15 57 C10 69 17 77 12 86 L9 89 Q15 91 21 87 L18 93 Q25 94 30 89 L28 94 C40 92 43 83 39 74 C36 64 31 60 35 49 C39 40 37 32 44 29 Q48 28 50 30 Q55 27 59 30 C65 34 63 41 68 50 C72 60 64 67 65 77 Q63 89 75 93 L74 89 Q80 94 87 91 L82 87 Q89 90 93 87 C82 82 89 75 85 64 C81 54 80 49 81 41 C81 24 69 6 54 12 Q52 13 50 13 Z" fill="#34352f" stroke="#302d27" stroke-width="1.6" />
<path d="M29 21 C23 37 26 45 21 57 C15 70 25 80 17 87 C30 79 19 70 25 57 C31 44 27 35 33 24 Z" fill="#49483d" stroke="#302d27" stroke-width="0" />
<path d="M36 48 C28 61 37 70 36 79 Q36 88 29 91 C44 87 38 77 36 70 Q31 59 36 48 Z" fill="#262a26" stroke="#302d27" stroke-width="0" />
<path d="M67 23 C76 36 69 43 77 58 C85 72 77 79 85 86 C72 82 79 71 72 59 C65 47 71 38 63 27 Z" fill="#47473c" stroke="#302d27" stroke-width="0" />
<path d="M70 52 C76 65 64 73 69 83 Q71 89 76 91 C62 87 68 74 68 68 Q72 59 70 52 Z" fill="#262a26" stroke="#302d27" stroke-width="0" />
<path d="M23 29 C28 15 39 10 50 16 C60 9 73 18 78 31 L71 25 L74 32 L66 25 L69 33 L62 27 L65 35 L59 29 Q56 26 52 29 L50 30 L47 28 L41 29 L36 35 L39 27 L32 32 L34 26 L27 32 L30 25 Z" fill="#b5c653" stroke="#302d27" stroke-width="0" />
<path d="M26 25 C32 17 42 14 48 18 Q39 15 30 24 L33 21 Z" fill="#d1d775" stroke="#302d27" stroke-width="0" />
<path d="M54 17 Q65 12 74 24 Q63 17 55 19 Z" fill="#d1d775" stroke="#302d27" stroke-width="0" />
<path d="M27 27 C32 19 40 14.6 49 15.4" fill="none" stroke="#6f8d2c" stroke-width="0.72" />
<path d="M31 30 C36 22.6 42.6 18.8 50.4 19.2" fill="none" stroke="#6f8d2c" stroke-width="0.72" />
<path d="M51.6 15.6 C60 15 67 19.4 71.4 26.6" fill="none" stroke="#6f8d2c" stroke-width="0.72" />
<path d="M50.6 19.4 C58 19.4 64 23 68 30" fill="none" stroke="#6f8d2c" stroke-width="0.72" />
<path d="M37 33 Q37.6 27 40 23.4" fill="none" stroke="#6f8d2c" stroke-width="0.72" />
<path d="M62 32 Q61.6 26.4 59 22.8" fill="none" stroke="#6f8d2c" stroke-width="0.72" />
<path d="M24 34 C22 45 24 47 19 59 C16 70 23 78 18 85" fill="none" stroke="#202620" stroke-width="0.78" />
<path d="M29 36 C28 48 26 50 24 59 C21 71 31 80 25 88" fill="none" stroke="#202620" stroke-width="0.78" />
<path d="M33 50 C27 64 38 76 32 86" fill="none" stroke="#202620" stroke-width="0.78" />
<path d="M17 70 Q16 77 18 80" fill="none" stroke="#202620" stroke-width="0.78" />
<path d="M77 34 C78 47 73 47 79 60 C83 69 78 78 83 84" fill="none" stroke="#202620" stroke-width="0.78" />
<path d="M70 43 C70 53 80 60 75 70 Q72 80 78 87" fill="none" stroke="#202620" stroke-width="0.78" />
<path d="M71 70 Q66 82 73 88" fill="none" stroke="#202620" stroke-width="0.78" />
<path d="M28 82 Q28 87 24 90" fill="none" stroke="#202620" stroke-width="0.78" />
<path d="M26 39 Q25 48 22 53" fill="none" stroke="#7d7a69" stroke-width="0.72" />
<path d="M26 66 Q26 74 29 78" fill="none" stroke="#7d7a69" stroke-width="0.72" />
<path d="M76 51 Q79 57 80 62" fill="none" stroke="#7d7a69" stroke-width="0.72" />
<path d="M76 77 Q76 81 79 83" fill="none" stroke="#7d7a69" stroke-width="0.72" />
</g>
</svg>`,
  },
  // BEGIN APPROVED REFERENCE STICKERS (scripts/stickers/sync_reference_stickers.py)
  {
    id: "boots",
    name: "Cowboy boots",
    sub: "a little country",
    how: "Answer the page for dance with cowboy like me",
    hint: "A dance can be a dangerous thing.",
    era: "Taylor Swift",
    bordered: true,
    art: `<svg viewBox="0 0 100 100"><g transform="translate(9.09091 7.10543e-15) scale(0.12987)" ><defs>
    </defs>
  <path d="M272,98c6-24,33-28,57-16,66-57,159-21,174,41,4,33-20,64-28,91l-20,164c20,41-2,68,0,109-2,88,44,126,119,163,27,14,35,38,31,60-27,21-127,32-183,3-22-14-26-43-36-64l-63,23-57-22-25-74,9-155-2-164,24-159Z" stroke-linecap="round" stroke-linejoin="round" fill="#fffcf5" stroke="#fffcf5" stroke-width="19px" />
  <path d="M272,98c6-24,33-28,57-16,66-57,159-21,174,41,4,33-20,64-28,91l-20,164c20,41-2,68,0,109-2,88,44,126,119,163,27,14,35,38,31,60-27,21-127,32-183,3-22-14-26-43-36-64l-63,23-57-22-25-74,9-155-2-164,24-159Z" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#c9bdb0" />
  <path d="M272,98c6-24,33-28,57-16,66-57,159-21,174,41,4,33-20,64-28,91l-20,164c20,41-2,68,0,109-2,88,44,126,119,163,27,14,35,38,31,60-27,21-127,32-183,3-22-14-26-43-36-64l-63,23-57-22-25-74,9-155-2-164,24-159Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" stroke-width="3px" fill="#63c8d3" />
  <path d="M272,98c30-26,79-5,116,22,33,19,66,54,87,94,30-48,33-76,20-104-29-56-98-67-166-28l-57,16Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" fill="#c67d28" stroke-width="2.5px" />
  <path d="M340,88c47.3-31.3,92.3-29.7,135,5-24.7-24-56.7-18-96,18l-39-23Z" fill="#e6a347" />
  <path d="M429,71l20,7-18,77-17-15,15-69Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" stroke-width="2px" fill="#f2c784" />
  <path d="M435,74l6,3-16,72-4-4,14-71Z" fill="#fff4dc" />
  <path d="M252,544l72,62,67,38-8,28-57,15-57-28-17-115Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" fill="#9c532c" stroke-width="3px" />
  <path d="M272,635l55,26,55-16v25l-55,17-56-26,1-26Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" stroke-width="2px" fill="#43362e" />
  <path d="M327,661v26" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#282322" stroke-width="2px" />
  <path d="M273,612l50,24" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-width="2px" stroke="#bd7343" />
  <path d="M273,622l50,24" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-width="2px" stroke="#bd7343" />
  <path d="M273,632l50,24" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-width="2px" stroke="#bd7343" />
  <path d="M273,642l50,24" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-width="2px" stroke="#bd7343" />
  <path d="M386,635c23,33,11,55,47,70,55,22,131,14,167-8l4,17c-48,27-138,25-181,2-20-14-25-46-37-66v-15Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" stroke-width="3px" fill="#b56b35" />
  <path d="M405,674c25,49,154,51,191,30" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#edb674" stroke-width="4px" />
  <path d="M409,676c26,46,144,46,186,30" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-width="1.5px" stroke="#fff4dc" stroke-dasharray="3 4" />
  <g>
    <path d="M271.5,235.7c-19-25-8.1-40.2-12.8-55.7,9.8,6,6,24.1,12.3,19.4s-3.7-27.5,5.5-43.8c0,13.9,7.6,16.9,6.8,31.6,10.9-10.5.9-24,15.6-48.9-7.8,24,4.7,42.5-7.2,64.9-7.3,16.6-13.7,17.6-20.2,32.5Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" stroke-width="2px" fill="#f4be38" />
    <path d="M271.9,233c-11.6-20.2-8.9-34.7-10.5-41.4,6.3,17.6,11.6,15.6,13.5,6.5,2.3-7.1-1.1-18.7.4-25,4,7.1,2.8,19.9,7.6,21.5,12.1-5.7,8.2-23,12.9-38.1,2.7,25.5-2.6,40.5-10.6,48.7-5.5,7.6-5.1,14.1-13.3,27.9Z" fill="#f04a3f" />
    <path d="M272,232.1c-6.7-14.9-5.3-20.3-5.4-28.6,2.6,12.4,6.8,9.3,9.3.4,4.1,10.8,1.1,18.7-4,28.2Z" fill="#d82743" />
  </g>
  <g>
    <path d="M371.3,284.7c-30.8-13.2-26.6-32-38.5-43.6,12.7.7,17.1,18.6,21.4,11.4s-16.2-22.8-14.3-41.8c6.3,12.5,15.5,11.4,21.4,25,6.3-14.6-10.1-21.9-6.3-51.2,3,25.1,24.1,35.7,22.2,61.5,0,18.4-6,22.3-5.8,38.7Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" stroke-width="2px" fill="#f4be38" />
    <path d="M370.5,282.1c-21-12.5-24.9-26.7-29.5-32,14.4,12.7,18.9,8.4,16.7-.6-.9-7.4-9.7-16.2-11-22.5,7.3,4.4,12,16.4,17.6,15.6,9.7-10.9-2.1-24.5-4.2-40.2,14.3,21.5,15.8,37.4,11.4,48.5-2.1,9.4,1.2,15.1-.9,31.2Z" fill="#f04a3f" />
    <path d="M370.2,281.2c-13.6-10.1-14.6-15.6-18.5-23,8.4,9.9,11.2,5.1,9.7-4.1,9.1,7.7,9.7,16.2,8.8,27.1Z" fill="#d82743" />
  </g>
  <g>
    <path d="M416.2,299.5c-16.7-27.8-2.3-38.8-4.8-54.2,9.7,8.1,2.6,23.6,10.3,20.9s.5-26,13.3-38.6c-2.4,12.7,5.6,17.4,2.2,30.7,13.6-6.8,4.9-21.7,25.2-40.6-12.5,19.9-1.9,40-18.7,57.4-10.8,13.3-17.9,12.5-27.5,24.4Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" stroke-width="2px" fill="#f4be38" />
    <path d="M417,297.1c-9.3-21.5-4-34-4.6-40.6,4,17.7,10.1,17.2,13.7,9.5,3.6-5.9,1.9-17.4,4.6-22.8,3.2,7.5-.2,18.9,4.8,21.6,14.2-2.1,12.8-18.9,20.4-31.5-1.3,24-9.5,36.3-19.6,41.7-7.2,5.5-7.9,11.6-19.2,22Z" fill="#f04a3f" />
    <path d="M417.3,296.3c-4.8-15.3-2.4-19.9-1.1-27.6.8,12.1,5.9,10.3,10.2,2.8,2.7,10.9-1.9,17.4-9,24.8Z" fill="#d82743" />
  </g>
  <g>
    <path d="M286.7,424.2c-20.6-28.3-11.5-48.7-17.5-67.4,10,6.1,8,29,13.6,22.3s-6-33.6,1.3-55.2c1.2,17.3,8.9,19.9,9.5,38.3,9.5-14.6-1.4-30,10.6-62.9-5.3,30.9,8.4,52.1-1.1,81.7-5.6,21.7-11.6,23.8-16.5,43.1Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" stroke-width="2px" fill="#f4be38" />
    <path d="M286.8,420.8c-13-23.5-11.7-41.8-13.9-50,7.7,21,12.6,17.7,13.6,6.2,1.5-9.2-2.8-23.1-1.9-31.1,4.5,8.2,4.6,24.3,9.3,25.6,11.1-8.8,5.8-29.7,8.9-49.2,4.9,31.2,1.2,50.7-5.8,61.9-4.6,10.2-3.6,18.3-10.3,36.5Z" fill="#f04a3f" />
    <path d="M286.9,419.6c-7.8-17.5-7-24.4-7.8-34.8,3.7,15.1,7.4,10.6,9-.8,5,12.8,2.8,23.1-1.2,35.6Z" fill="#d82743" />
  </g>
  <g>
    <path d="M402.8,440.1c-36.5-9.8-29.6-28.4-43-38.5,15.6-.5,19.2,16.4,25.1,9s-17.8-20.5-13.6-39c6.5,11.5,17.9,9.6,23.8,22.1,9.1-14.7-10.3-20.2-2.9-48.8,1.3,24,26.2,32.2,21.4,57.3-1.6,17.7-9.5,22.1-10.8,37.9Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" stroke-width="2px" fill="#f4be38" />
    <path d="M402,437.6c-24.6-10.1-28-23.5-33.2-28.1,16.5,10.9,22.4,6.3,20.6-2.2-.5-7.1-10.3-14.7-11.4-20.7,8.6,3.5,13.1,14.7,20.1,13.4,12.9-11.4-.2-23.4-1.4-38.4,15.5,19.4,15.9,34.6,9.3,45.8-3.5,9.3,0,14.4-4,30.3Z" fill="#f04a3f" />
    <path d="M401.7,436.8c-15.7-8.5-16.5-13.6-20.5-20.5,9.3,8.7,13.3,3.8,12.3-4.9,10.5,6.5,10.3,14.7,8.2,25.4Z" fill="#d82743" />
  </g>
  <g>
    <path d="M434,494.4c-13.1-23.4-2.4-35.4-4.6-49.3,7.5,6.2,2.4,21.3,8.1,17.9s0-24,9.4-37.2c-1.6,12,4.5,15.3,2.2,27.9,10.2-8,3.4-20.6,18.4-40.6-9.1,19.9-.8,37.1-13.2,55.3-8,13.6-13.4,13.8-20.4,26Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" stroke-width="2px" fill="#f4be38" />
    <path d="M434.6,492c-7.4-18.6-3.6-30.8-4.2-36.7,3.3,15.8,7.9,14.6,10.5,7,2.7-5.9,1.1-16.3,3.1-21.5,2.6,6.5.2,17.4,4,19.3,10.7-3.8,9.4-19,14.9-31.6-.6,22.2-6.6,34.7-14.2,40.9-5.4,6-5.8,11.7-14.2,22.7Z" fill="#f04a3f" />
    <path d="M434.8,491.3c-3.9-13.5-2.2-18-1.3-25.2.8,11,4.7,8.7,7.7,1.2,2.2,9.7-1.1,16.3-6.4,24Z" fill="#d82743" />
  </g>
  <g>
    <path d="M357.7,516.9c-28.4-11.8-24.9-29.2-36-39.7,11.7.5,16,17,19.8,10.3s-15.3-20.8-13.9-38.4c6,11.4,14.4,10.3,20,22.8,5.5-13.6-9.6-20.1-6.7-47.1,3.2,23.2,22.7,32.6,21.5,56.4.4,16.9-5.1,20.6-4.6,35.7Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" stroke-width="2px" fill="#f4be38" />
    <path d="M356.9,514.5c-19.5-11.3-23.3-24.3-27.6-29.1,13.5,11.5,17.5,7.5,15.3-.8-1-6.8-9.2-14.8-10.5-20.7,6.8,4,11.3,15,16.4,14.1,8.7-10.2-2.4-22.6-4.6-37.1,13.5,19.6,15.2,34.3,11.3,44.6-1.7,8.7,1.4,13.9-.2,28.8Z" fill="#f04a3f" />
    <path d="M356.6,513.7c-12.6-9.1-13.7-14.2-17.4-21,7.8,9,10.4,4.5,8.8-3.9,8.5,7,9.2,14.8,8.6,24.9Z" fill="#d82743" />
  </g>
  <g>
    <path d="M390.3,355.4c-12.7-21.6-50.9-65-40.8-91.5,8.7-28.4,47.2-24,55.1,1.1,20.7-23.1,55.9-9,54,18.8-1.1,28.7-44.3,59.3-68.3,71.7Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" fill="#f02c49" stroke-width="2.5px" />
    <path d="M391.2,349.6c28.1-27,57.2-44.5,59.8-66.2,4.5,30.5-33.1,58.5-59.8,66.2Z" fill="#c91435" />
    <path d="M359.8,274c1.8-21.8,26.2-25.6,34.9-10.6-18.7-10.6-27.2,5.1-29,16.7l-5.8-6Z" fill="#ffb9be" />
    <path d="M412.4,269.6c17.4-18.5,35.6.5,31.3,16.9-5.5-18.7-17-21.4-31.3-16.9Z" fill="#fff4e7" />
  </g>
  <path d="M345,269c-17.3-12.7-20-20.7-8-24l24,13-7,22-9-11Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" stroke-width="2px" fill="#fff4dc" />
  <path d="M341,257c20,40,75,53,120,53l-8,40c-42,0-89-22-118-50-6.7-9.3-4.7-23.7,6-43Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" fill="#fff4dc" stroke-width="2.6px" />
  <g>
    <path d="M356.1,311c-1.6-.6-3-1.3-4.3-2.1-1.3-.8-2.3-1.6-3.1-2.4l-1.6.6-1.6-.6,2.5-7.6,1.6.6c0,.8.3,1.8.5,2.8s.6,1.9,1.1,2.8c.5.9,1.2,1.8,1.9,2.5.8.7,1.8,1.4,3,1.8s3.1.8,4.2.4c1.1-.3,1.9-1,2.2-2s.2-1.6-.4-2.5-1.6-1.7-3-2.7c-.9-.6-1.8-1.2-2.6-1.8s-1.5-1.1-2.2-1.6c-1.6-1.2-2.6-2.5-3.1-3.8-.5-1.3-.5-2.7,0-3.9s.8-1.5,1.5-2.1,1.6-1,2.7-1.3c1-.3,2.2-.3,3.6-.2s2.8.4,4.3,1,2.8,1.2,3.9,2,2,1.5,2.6,2.1l1.4-.5,1.6.6-2.4,7.2-1.6-.6c0-.9-.2-1.8-.5-2.8s-.5-1.8-.9-2.6c-.4-.8-.9-1.5-1.6-2.1s-1.5-1.1-2.6-1.5-2.5-.6-3.6-.3c-1.1.3-1.8.9-2.1,1.8s-.2,1.6.4,2.4c.5.8,1.5,1.7,2.9,2.6.8.6,1.7,1.2,2.5,1.7s1.6,1.1,2.3,1.6c1.6,1.2,2.7,2.4,3.2,3.8s.6,2.7,0,4.1-.9,1.7-1.7,2.3c-.8.6-1.8,1.1-2.9,1.3-1.2.3-2.5.3-3.9.2s-3-.5-4.7-1.1Z" fill="#282322" />
    <path d="M406.4,313.4c-.6-.1-1.2-.2-1.7-.1s-1.1.3-1.7.8c-1.5,1.4-2.7,2.5-3.5,3.3s-2.2,2.1-3.8,3.7c-.3.3-.8.8-1.3,1.4s-1,1.1-1.3,1.5l-3.6-1.3-1-11.7-8,8.4-3.6-1.3c-.3-3.1-.5-5.6-.7-7.3-.2-1.7-.4-4-.7-6.9,0-.5-.3-1-.7-1.5s-.9-.8-1.5-1.1l.4-1.1,11.3,4.1-.4,1.1c-.4-.1-1-.2-1.6-.3-.6,0-1,0-1.1.2s0,.2,0,.3,0,.2,0,.5c0,.9.2,2,.3,3.5s.3,3.1.5,5l7.6-8.2,3.7,1.3,1,11.7c1.3-1.2,2.2-2.2,3-3s1.6-1.7,2.7-2.8c.2-.2.3-.3.4-.5s.1-.3.1-.3c0-.2,0-.4-.2-.6s-.4-.4-.7-.6-.5-.4-.8-.5-.5-.3-.7-.4l.4-1.1,7.6,2.8-.4,1.1Z" fill="#282322" />
    <path d="M414,331.5l-11.7-4.3.4-1.1c.3,0,.7.2,1,.3s.6.1.8.1c.4,0,.8,0,1-.2s.4-.4.6-.8l3.1-8.5c.1-.3.1-.7,0-1s-.3-.6-.5-.9c-.2-.2-.5-.4-.9-.7s-.8-.5-1.2-.7l.4-1.1,9.2,2.9.2.3-4.2,11.7c-.1.3-.1.7,0,1,0,.3.3.6.6.8.2.2.5.4.7.5s.6.3.9.5l-.4,1.1ZM418.6,310.5c-.3.7-.9,1.2-1.8,1.5s-1.9.2-2.8-.1-1.8-.9-2.3-1.7-.7-1.6-.4-2.3.9-1.2,1.8-1.5,1.9-.2,2.9.1,1.8.9,2.3,1.7c.5.8.6,1.6.4,2.3Z" fill="#282322" />
    <path d="M440.5,318.2c0,.2-.2.5-.4.8s-.5.4-.8.6c-.3.2-.7.2-1.1.2s-.9-.1-1.5-.3c-1-.4-1.6-.9-2-1.6s-.6-1.9-.8-3.3c-.6,0-1.1.3-1.7.9s-1.3,2-2.1,4.3l-.4,1.2,5.1,1.9-.6,1.6-5.1-1.8-3.7,10.1c-.1.4-.1.7,0,1,.1.3.4.6.7.8.3.2.6.4,1.1.7s.9.5,1.2.6l-.4,1.1-12.5-4.5.4-1.1c.3,0,.6.2,1,.3s.6.1.9.1c.4,0,.8,0,1-.2s.4-.4.5-.8l3.7-10.2-3.8-1.4.6-1.6,3.8,1.4c.4-1,.9-2,1.7-2.8.7-.8,1.7-1.5,2.7-2,1.1-.5,2.3-.7,3.7-.7,1.4,0,3,.3,4.7.9s2.6,1.2,3.3,2,.9,1.5.6,2.3Z" fill="#282322" />
    <path d="M444.6,341.8c-.9,0-1.8,0-2.8-.2s-2.1-.4-3.4-.9c-1.9-.7-3.2-1.6-3.9-2.7-.7-1.1-.7-2.3-.2-3.7l3.3-9-3.3-1.2.6-1.6,3.4,1.2,1.6-4.4,6,2.2-1.6,4.4,5.2,1.9-.6,1.6-5.1-1.9-2.9,8c-.4,1.1-.5,2-.3,2.7s.9,1.1,1.9,1.5.8.3,1.4.4,1,.3,1.3.3l-.4,1.2Z" fill="#282322" />
  </g>
  <path d="M448,351c22,30-18,37-44,40-23,3-29,21-16,31-27-7-20-36,11-43l46-14,3-14Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" stroke-width="2px" fill="#fff4dc" />
  <g>
    <g>
      <path d="M406.1,439.2c-5.9,5-12.9,6-21.1,3.1l3.3-3.2-6.8-3,6-2.1-.9-4.4,6.3,1.5,1.9-4.1,5.3,3.5c3.6,1.9,5.6,4.7,6.1,8.6Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" fill="#287b47" stroke-width="1.2px" />
      <path d="M406.1,439.2l-18.9-3M399.2,437.7l-2.9-5.4M394.9,437.9l-4,3.1" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#15492f" stroke-width=".7px" />
    </g>
    <g>
      <path d="M432.7,433.6c-1-7.6,2-14.1,8.9-19.4l.9,4.5,6.2-4.1-1.5,6.2,4.2,1.7-4.7,4.4,2.4,3.8-5.8,2.5c-3.5,2-7,2.1-10.5.4Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" fill="#287b47" stroke-width="1.2px" />
      <path d="M432.7,433.6l12.9-14.2M437.8,428.6l6.1.5M440,424.9l-.4-5" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#15492f" stroke-width=".7px" />
    </g>
    <g>
      <path d="M425.8,447c7.6,1.3,12.9,6,16,14.2l-4.5-.4,2.1,7.1-5.5-3.2-2.8,3.5-2.9-5.7-4.3,1.1-.7-6.3c-.9-3.9,0-7.4,2.7-10.2Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" fill="#287b47" stroke-width="1.2px" />
      <path d="M425.8,447l9.8,16.5M429.1,453.4l-2.2,5.7M432,456.6l4.9,1" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#15492f" stroke-width=".7px" />
    </g>
    <path d="M400.5,438.1c-8.1-4.1-4.6-14.2,1.7-17.7-.4-8.1,9.1-11.2,16-8.2,8.1-4.9,16.4-.1,17,6.4,9.8,5,4.2,15.1-.1,18-2.3,11.2-12.7,11.6-18.7,9.1-9.5,5.3-19.1,1-15.9-7.5Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" fill="#f8a5b7" stroke-width="1.4px" />
    <path d="M401.5,436.3c-2.4-7.4,4.4-14.1,9.5-14.3-6.5-6.1,5.5-10.7,12.4-5.5,10.1-1,12.3,10.2,7.7,16.9,2.6,5.9-6.1,11-14.7,7.7-8.1,2.6-14.8.3-15-4.8Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" fill="#ffd5da" stroke-width="1.1px" />
    <path d="M407.3,433.6c-6.2-5.4-.6-13.3,7.3-12.1,4.1-5.8,13-1.2,12.3,5.7,4.9,3.6-3.2,13-10.6,10.9l-8.9-4.6Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" stroke-width="1.1px" fill="#eb7896" />
    <path d="M409.6,426.9c1.8-5.8,12.4-5.5,12.8.3l-5.2,9.2c-1.5-7-10.5-2.5-7.6-9.5Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" fill="#fff0e8" stroke-width="1.1px" />
    <path d="M409.6,426.9c2.6-1.3,5.9-.9,10.1,1.2M422.4,427.2c1,3.2-.7,6.2-5.2,9.2M402.8,433.6c2.7,3.6,7.2,6.1,13.6,7.5M425.6,418.7c-2.7,2.4-2.3,5.2,1.3,8.5" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#282322" stroke-width="1px" />
  </g>
  <path d="M263,477c22,32,45,40,63,45,22,7,44-2,56-20,5-30,17-29,28-21l12-9c1,46-17,62-40,69-52,23-98-2-119-27v-37Z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2px" fill="#82dbe0" stroke="#337c86" />
  <path d="M268,493c43.3,46.7,83,59,119,37,20-10,31.7-27.3,35-52" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-dasharray="4 3" stroke="#368f9a" stroke-width="1.3px" />
  <path d="M457,512c7,61,50,103,97,129-55-21-97-55-113-102l16-27Z" fill="#a7e9e7" />
  <g>
    <path d="M540.2,669c4.3,2.5,21.9,4.6,23,9.5-11.6-4.2-14.8,2-29.3,2.6,1.2,3.4,14.1,10.6,10.4,15.1-5.8-7.1-14.3-2.9-27.1-6.8-2.2,3.2,1.8,13.3-5.5,15.9,1.9-7.7-9.3-6.8-16.4-14.1-4.9,2.1-11,11.7-19.7,11.7,8.9-5.9-1.4-8.6-.4-16.9-6.1.2-20.4,6.5-27.6,3.8,13.1-2.2,7-7.7,15.7-14.4-5.3-1.7-23.2-.8-26.8-5.4,13.1,2.2,13.2-4.3,26.8-7.2-2.9-3.1-18.8-7.9-17.4-12.8,9,5.9,15.2.5,29.4,2.2.5-3.5-8.3-12.4-2.6-16.1,2,7.7,12.3,5.1,22.7,10.9,3.7-2.8,4.8-13,13.1-14.4-5.6,7.1,5.6,8.1,8.8,16.2,5.7-1.2,16.4-9.5,24.6-8-11.5,4.3-3,8.5-7.9,16.3,5.9.8,22.7-2.9,28.3.8-13.7,0-10.5,6.3-22.1,11.3Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" fill="#f6c545" stroke-width="1.7px" />
    <path d="M535.1,669c3.7,2.2,19,4,20,8.3-10-3.7-12.9,1.8-25.5,2.3,1.1,3,12.3,9.3,9.1,13.3-5-6.2-12.5-2.5-23.6-6-1.9,2.9,1.6,11.7-4.8,14,1.6-6.8-8.1-6-14.2-12.4-4.3,1.8-9.6,10.3-17.1,10.3,7.7-5.2-1.2-7.6-.4-14.9-5.3.2-17.7,5.7-24,3.3,11.4-2,6.1-6.8,13.6-12.6-4.6-1.5-20.2-.7-23.3-4.7,11.4,1.9,11.5-3.8,23.3-6.4-2.5-2.7-16.3-7-15.2-11.3,7.8,5.2,13.2.4,25.6,1.9.4-3.1-7.2-10.9-2.2-14.2,1.8,6.8,10.7,4.5,19.7,9.6,3.2-2.4,4.2-11.5,11.4-12.7-4.9,6.3,4.9,7.1,7.6,14.2,5-1,14.2-8.3,21.4-7.1-10,3.7-2.6,7.5-6.9,14.4,5.2.7,19.8-2.6,24.6.7-11.9,0-9.2,5.5-19.2,9.9Z" fill="#ed4745" />
    <ellipse cx="501" cy="669" rx="35.3" ry="19.2" fill="#67cbd5" />
  </g>
  <g>
    <g>
      <path d="M487.3,678c-7.3,4.3-15.1,4.1-23.5-.6l4.1-2.8-6.8-4.5,6.9-1.2v-4.9c-.1,0,6.4,2.8,6.4,2.8l2.9-4,5.1,4.8c3.5,2.7,5.2,6.2,5,10.5Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" fill="#287b47" stroke-width="1.3px" />
      <path d="M487.3,678l-19.9-6.9M480.1,675l-2.1-6.4M475.4,674.4l-4.9,2.6" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#15492f" stroke-width=".8px" />
    </g>
    <g>
      <path d="M517.1,677c.4-8.5,4.8-14.9,13.3-19.3v5c.1,0,7.6-3.2,7.6-3.2l-2.8,6.4,4.2,2.6-5.9,3.9,1.8,4.6-6.8,1.6c-4.2,1.5-8,1-11.5-1.6Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" fill="#287b47" stroke-width="1.3px" />
      <path d="M517.1,677l16.6-12.9M523.6,672.6l6.5,1.7M526.6,669l.5-5.5" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#15492f" stroke-width=".8px" />
    </g>
    <g>
      <path d="M507.1,690.2c8,2.8,12.8,9,14.6,18.4l-4.8-1.3.9,8.1-5.3-4.5-3.7,3.3-2-6.8-4.9.4.4-7c-.2-4.4,1.4-7.9,4.9-10.5Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" fill="#287b47" stroke-width="1.3px" />
      <path d="M507.1,690.2l7.5,19.7M509.5,697.7l-3.5,5.7M512,701.7l5.1,2.1" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#15492f" stroke-width=".8px" />
    </g>
    <path d="M481.5,675.7c-7.9-6-2.3-16.2,5.2-18.9,1.1-8.8,11.9-10.3,18.9-5.8,9.7-3.7,17.8,3,17.2,10.2,9.7,7.3,1.6,17.1-3.6,19.4-4.7,11.7-15.9,10.1-22,6.2-11.3,3.9-20.8-2.6-15.7-11.2Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" fill="#f8a5b7" stroke-width="1.6px" />
    <path d="M482.8,673.9c-1.2-8.5,7.4-14.4,13-13.6-5.8-7.8,8-10.6,14.5-3.6,11.1.8,11.3,13.4,5.1,19.8,1.7,6.8-8.7,10.7-17.3,5.6-9.3,1.3-16.1-2.5-15.3-8.1Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" fill="#ffd5da" stroke-width="1.2px" />
    <path d="M489.6,672.2c-5.7-7.1,1.9-14.4,10.2-11.7,5.5-5.5,14.3,1.1,12.2,8.5,4.6,4.9-6,13.4-13.6,9.8l-8.8-6.6Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" stroke-width="1.2px" fill="#eb7896" />
    <path d="M493.4,665.3c3.1-5.9,14.5-3.6,13.8,2.8l-7.4,8.9c-.3-7.8-10.9-4.8-6.4-11.7Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" fill="#fff0e8" stroke-width="1.2px" />
    <path d="M493.4,665.3c3-.9,6.6.1,10.7,3.2M507.2,668.1c.5,3.6-2,6.6-7.4,8.9M484.8,671.3c2.2,4.4,6.6,8,13.3,10.7M512.3,659.5c-3.4,2.1-3.5,5.2-.2,9.5" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#282322" stroke-width="1.1px" />
  </g>
  <circle cx="349" cy="153" r="4" stroke-linecap="round" stroke-linejoin="round" fill="#e8f2ed" stroke="#548b8d" stroke-width="1.1px" />
  <path d="M347,153c0-1.3,1-2,3-2" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#fffef8" stroke-width="1.5px" />
  <circle cx="289" cy="241" r="4" stroke-linecap="round" stroke-linejoin="round" fill="#e8f2ed" stroke="#548b8d" stroke-width="1.1px" />
  <path d="M287,241c0-1.3,1-2,3-2" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#fffef8" stroke-width="1.5px" />
  <circle cx="350" cy="295" r="4" stroke-linecap="round" stroke-linejoin="round" fill="#e8f2ed" stroke="#548b8d" stroke-width="1.1px" />
  <path d="M348,295c0-1.3,1-2,3-2" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#fffef8" stroke-width="1.5px" />
  <circle cx="353" cy="344" r="4" stroke-linecap="round" stroke-linejoin="round" fill="#e8f2ed" stroke="#548b8d" stroke-width="1.1px" />
  <path d="M351,344c0-1.3,1-2,3-2" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#fffef8" stroke-width="1.5px" />
  <circle cx="296" cy="489" r="4" stroke-linecap="round" stroke-linejoin="round" fill="#e8f2ed" stroke="#548b8d" stroke-width="1.1px" />
  <path d="M294,489c0-1.3,1-2,3-2" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#fffef8" stroke-width="1.5px" />
  <circle cx="352" cy="532" r="4" stroke-linecap="round" stroke-linejoin="round" fill="#e8f2ed" stroke="#548b8d" stroke-width="1.1px" />
  <path d="M350,532c0-1.3,1-2,3-2" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#fffef8" stroke-width="1.5px" />
  <circle cx="540" cy="677" r="4" stroke-linecap="round" stroke-linejoin="round" fill="#e8f2ed" stroke="#548b8d" stroke-width="1.1px" />
  <path d="M538,677c0-1.3,1-2,3-2" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#fffef8" stroke-width="1.5px" />
  <circle cx="491" cy="694" r="4" stroke-linecap="round" stroke-linejoin="round" fill="#e8f2ed" stroke="#548b8d" stroke-width="1.1px" />
  <path d="M489,694c0-1.3,1-2,3-2" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#fffef8" stroke-width="1.5px" />
  <path d="M277,101c51-35,163,30,198,111" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#282322" stroke-width="11px" />
  <path d="M277,101c51-35,163,30,198,111" stroke="#ead4ad" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-width="8px" />
  <path d="M276.9,97.4c1.5-2.8,6.5-3.3,10-1,.9,1.9.6,3.1-.9,3.5-3.5-.9-5.7-.2-9.1-2.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M284.2,91.5c2.9-1.3,7.2,1.3,8.5,5.2-.5,2.1-1.4,2.8-2.8,2.3-2.3-2.8-4.4-3.6-5.7-7.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M288.5,91.9c2.1-2.4,7.1-1.7,9.9,1.2.4,2.1-.1,3.1-1.6,3.2-3.2-1.6-5.5-1.5-8.3-4.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M296.1,87.9c3.1-.7,6.8,2.7,7.4,6.7-.9,1.9-1.9,2.5-3.2,1.7-1.7-3.2-3.6-4.4-4.2-8.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M300.5,89.1c2.5-2,7.3-.5,9.6,2.9,0,2.1-.7,3.1-2.1,2.9-2.9-2.1-5.1-2.4-7.4-5.8Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M308.9,86.4c3.2-.2,6.3,3.7,6.2,7.8-1.1,1.8-2.3,2.2-3.4,1.2-1.2-3.4-2.9-4.9-2.8-9Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M313.3,88.4c2.7-1.6,7.3.6,9,4.3-.3,2.1-1.1,2.9-2.5,2.6-2.6-2.5-4.7-3.1-6.5-6.9Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M322.3,87c3.2.2,5.7,4.5,5.1,8.6-1.4,1.6-2.6,1.8-3.5.7-.7-3.5-2.2-5.2-1.6-9.3Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M326.9,89.6c2.9-1.2,7.1,1.5,8.4,5.4-.5,2-1.5,2.8-2.8,2.2-2.2-2.8-4.3-3.7-5.6-7.6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M335.1,89.1c3.1.5,5.2,5.1,4.2,9.1-1.5,1.4-2.7,1.6-3.6.3-.3-3.6-1.6-5.4-.6-9.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M338.5,91.9c3-1,7,2.1,7.9,6.1-.7,2-1.7,2.6-3,2-2-3-3.9-4.1-4.9-8.1Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M347,92.2c3.1.8,4.8,5.5,3.4,9.4-1.6,1.3-2.9,1.3-3.6,0,0-3.6-1.2-5.5.2-9.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M350.4,95.5c3.1-.7,6.8,2.6,7.4,6.7-.8,1.9-1.9,2.5-3.2,1.7-1.7-3.2-3.6-4.3-4.2-8.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M359.1,96.5c3,1,4.4,5.8,2.7,9.6-1.7,1.2-2.9,1.1-3.6-.2.2-3.6-.8-5.6.9-9.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M362.3,100c3.1-.5,6.6,3.1,6.9,7.2-1,1.9-2.1,2.4-3.3,1.5-1.5-3.3-3.3-4.6-3.6-8.7Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M371.1,101.8c2.9,1.2,4,6.1,2.1,9.8-1.8,1.1-3,.9-3.6-.5.5-3.6-.4-5.6,1.5-9.3Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M374.3,105.6c3.1-.3,6.4,3.5,6.4,7.6-1.1,1.8-2.2,2.2-3.4,1.3-1.3-3.4-3-4.8-3.1-8.9Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M383.1,108c2.8,1.4,3.6,6.3,1.5,9.9-1.9,1-3.1.7-3.5-.7.7-3.5,0-5.7,2.1-9.2Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M386.2,112.1c3.2-.1,6.1,3.9,6,8-1.2,1.7-2.4,2.1-3.4,1.1-1.1-3.4-2.7-5-2.5-9.1Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M395,115.1c2.7,1.6,3.2,6.5.9,10-1.9.8-3.1.5-3.5-.9.9-3.5.3-5.6,2.6-9.1Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M398,119.5c3.2,0,5.9,4.3,5.5,8.4-1.3,1.7-2.5,1.9-3.5.9-.9-3.5-2.4-5.1-2-9.2Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M406.6,123.1c2.7,1.7,2.8,6.7.3,10-2,.7-3.1.4-3.4-1.1,1.1-3.4.6-5.6,3.1-8.9Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M409.4,127.7c3.2.3,5.7,4.6,5,8.7-1.4,1.6-2.6,1.8-3.5.7-.7-3.5-2.1-5.2-1.5-9.3Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M417.9,131.8c2.5,1.9,2.4,6.9-.3,10-2,.6-3.1.2-3.4-1.3,1.3-3.4,1-5.6,3.6-8.7Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M419.4,135.6c3.1.4,5.4,4.9,4.6,8.9-1.5,1.5-2.7,1.7-3.6.5-.5-3.6-1.8-5.4-1-9.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M426.6,139.2c2.5,2,2.1,7-.7,10-2,.5-3.1,0-3.3-1.4,1.4-3.3,1.2-5.5,4-8.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M427.9,143.2c3.1.6,5.2,5.1,4.1,9.1-1.5,1.4-2.7,1.5-3.6.3-.3-3.6-1.6-5.4-.5-9.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M435,147.1c2.4,2.1,1.8,7.1-1.2,9.9-2.1.4-3.1-.1-3.2-1.6,1.6-3.2,1.5-5.5,4.4-8.3Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M436.1,151.1c3.1.7,4.9,5.4,3.7,9.3-1.6,1.4-2.8,1.4-3.6.1-.1-3.6-1.3-5.5,0-9.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M443,155.3c2.3,2.2,1.4,7.1-1.7,9.9-2.1.3-3.1-.3-3.2-1.8,1.8-3.2,1.7-5.4,4.8-8.1Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M443.9,159.4c3,.9,4.7,5.6,3.2,9.5-1.7,1.3-2.9,1.3-3.6,0,0-3.6-1.1-5.6.4-9.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M451.5,165c2.1,2.3,1,7.2-2.2,9.7-2.1.2-3.1-.4-3-1.9,1.9-3,2-5.3,5.3-7.8Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M453,170.2c3,1.1,4.3,5.9,2.6,9.6-1.8,1.2-3,1.1-3.6-.3.3-3.6-.7-5.6,1-9.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M460.1,176.3c2,2.5.5,7.3-2.9,9.6-2.1,0-3.1-.6-2.9-2.1,2.1-2.9,2.4-5.1,5.8-7.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M461.3,181.5c2.9,1.3,3.9,6.2,2,9.8-1.8,1-3,.9-3.6-.5.5-3.6-.3-5.6,1.6-9.3Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M467.9,188c1.8,2.6,0,7.3-3.6,9.3-2.1,0-3-.9-2.7-2.3,2.3-2.7,2.7-4.9,6.3-7Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M468.7,193.1c2.8,1.5,3.4,6.4,1.2,9.9-1.9.9-3.1.6-3.5-.8.8-3.5.1-5.7,2.3-9.1Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M474.8,200c1.6,2.7-.6,7.3-4.3,9-2.1-.3-2.9-1.1-2.6-2.5,2.5-2.6,3.1-4.7,6.8-6.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M475.1,205.2c2.7,1.7,2.9,6.7.4,10-2,.7-3.1.4-3.4-1.1,1.1-3.4.6-5.6,3.1-8.9Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M329,82c83-53,187,0,146,130" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#282322" stroke-width="11px" />
  <path d="M329,82c83-53,187,0,146,130" stroke="#ead4ad" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-width="8px" />
  <path d="M328.3,79c1.4-2.8,6.3-3.6,9.9-1.5,1,1.9.7,3.1-.7,3.5-3.5-.7-5.7,0-9.2-2Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M334.2,73.2c2.7-1.7,7.3.4,9.2,4-.2,2.1-1,3-2.5,2.6-2.6-2.5-4.8-3-6.7-6.7Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M338.5,73.2c1.6-2.7,6.6-3.1,10-.7.8,2,.5,3.1-1,3.5-3.5-1-5.6-.4-9-2.8Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M344.7,67.9c2.8-1.4,7.2,1,8.8,4.8-.4,2.1-1.3,2.9-2.7,2.4-2.4-2.7-4.5-3.4-6.1-7.2Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M350.1,67.8c1.9-2.5,6.9-2.4,10,.3.6,2,.2,3.1-1.3,3.4-3.4-1.3-5.6-1-8.7-3.6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M357.9,62.8c3-1.1,7.1,1.7,8.2,5.7-.6,2-1.6,2.7-2.9,2.1-2.1-2.9-4.1-3.8-5.3-7.8Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M363.1,63.3c2.1-2.3,7.1-1.6,9.9,1.4.4,2.1-.2,3.1-1.7,3.2-3.2-1.7-5.4-1.6-8.3-4.6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M371.2,59.2c3.1-.8,6.8,2.5,7.5,6.6-.8,1.9-1.9,2.5-3.1,1.8-1.8-3.1-3.7-4.3-4.4-8.3Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M376,60.4c2.4-2.1,7.2-.8,9.7,2.5.2,2.1-.5,3.1-2,3-3-2-5.2-2.2-7.7-5.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M384.4,57.2c3.1-.4,6.5,3.3,6.7,7.4-1,1.8-2.1,2.3-3.3,1.4-1.4-3.3-3.2-4.7-3.4-8.8Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M388.9,58.9c2.6-1.8,7.3,0,9.3,3.6,0,2.1-.9,3-2.3,2.7-2.7-2.3-4.9-2.8-7-6.3Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M397.4,56.8c3.2,0,6.1,4,5.8,8.1-1.2,1.7-2.4,2-3.5,1-1-3.5-2.6-5-2.4-9.1Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M401.5,58.9c2.8-1.5,7.2.9,8.8,4.7-.3,2.1-1.2,2.9-2.7,2.4-2.4-2.7-4.6-3.3-6.2-7.1Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M410.1,57.8c3.1.3,5.5,4.7,4.8,8.8-1.4,1.5-2.6,1.7-3.6.6-.6-3.6-2-5.3-1.2-9.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M413.8,60.5c3-1.1,7.1,1.8,8.2,5.7-.6,2-1.6,2.7-2.9,2.1-2.1-2.9-4.1-3.9-5.2-7.8Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M422.3,60.4c3.1.7,4.9,5.4,3.6,9.3-1.6,1.3-2.8,1.4-3.6.1-.1-3.6-1.3-5.5,0-9.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M425.6,63.5c3.1-.7,6.8,2.7,7.4,6.8-.9,1.9-1.9,2.5-3.2,1.7-1.7-3.2-3.6-4.4-4.2-8.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M434,64.5c2.9,1.1,4.1,6,2.3,9.7-1.8,1.1-3,1-3.6-.4.4-3.6-.5-5.6,1.2-9.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M436.7,67.9c3.2-.3,6.3,3.6,6.4,7.7-1.1,1.8-2.2,2.2-3.4,1.2-1.2-3.4-3-4.8-3-8.9Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M444.9,70.1c2.8,1.5,3.2,6.5,1,10-1.9.9-3.1.6-3.5-.9.9-3.5.3-5.7,2.5-9.1Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M447.2,73.9c3.2.2,5.8,4.4,5.2,8.5-1.4,1.6-2.5,1.9-3.5.8-.8-3.5-2.2-5.2-1.7-9.3Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M455,77.2c2.5,1.9,2.3,6.9-.5,10-2,.6-3.1.1-3.3-1.4,1.4-3.3,1.1-5.6,3.8-8.6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M456.7,81.3c3.1.6,5.1,5.2,3.9,9.2-1.6,1.4-2.8,1.5-3.6.2-.2-3.6-1.5-5.5-.4-9.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M464.1,85.8c2.2,2.3,1.3,7.2-1.9,9.8-2.1.3-3.1-.3-3.1-1.8,1.8-3.1,1.8-5.3,5-8Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M465.3,90.2c3,1.1,4.3,5.9,2.6,9.7-1.8,1.2-3,1.1-3.6-.3.3-3.6-.7-5.6,1-9.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M472,95.8c1.9,2.6.2,7.3-3.3,9.4-2.1,0-3-.8-2.8-2.3,2.3-2.8,2.6-5,6.1-7.2Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M472.6,100.5c2.8,1.5,3.4,6.5,1.2,9.9-1.9.9-3.1.6-3.5-.8.8-3.5.1-5.7,2.4-9.1Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M478.5,107.2c1.5,2.8-.8,7.2-4.6,8.9-2.1-.3-2.9-1.2-2.5-2.6,2.6-2.5,3.3-4.6,7.1-6.3Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M478.6,112.2c2.6,1.9,2.4,6.9-.2,10-2,.6-3.1.2-3.4-1.3,1.3-3.4.9-5.6,3.6-8.7Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M483.7,120c1.1,3-1.8,7.1-5.8,8.2-2-.6-2.7-1.6-2.1-2.9,2.9-2.1,3.9-4.1,7.9-5.2Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M483.1,125.3c2.3,2.2,1.5,7.1-1.6,9.9-2.1.3-3.1-.2-3.2-1.7,1.7-3.2,1.7-5.4,4.7-8.2Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M486.9,132.6c.7,3.1-2.6,6.8-6.7,7.4-1.9-.8-2.5-1.9-1.7-3.2,3.2-1.7,4.3-3.6,8.4-4.3Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M485.6,136.8c2.1,2.4.8,7.2-2.6,9.7-2.1.1-3.1-.5-3-2,2-3,2.2-5.2,5.5-7.6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M488.6,144.8c.4,3.1-3.3,6.5-7.4,6.7-1.8-1-2.3-2.1-1.4-3.3,3.3-1.4,4.7-3.2,8.8-3.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M486.9,149.1c1.8,2.6,0,7.3-3.5,9.4-2.1,0-3-.8-2.8-2.3,2.3-2.8,2.7-5,6.2-7.1Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M489.1,157.7c.1,3.2-3.9,6.2-8,6-1.7-1.2-2.1-2.3-1.1-3.4,3.4-1.1,4.9-2.7,9.1-2.6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M487,162.2c1.6,2.7-.6,7.3-4.3,9-2.1-.3-2.9-1.1-2.6-2.5,2.5-2.6,3.1-4.7,6.8-6.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M488.5,171.3c-.1,3.2-4.4,5.8-8.5,5.3-1.6-1.3-1.9-2.5-.8-3.5,3.5-.8,5.2-2.3,9.3-1.8Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M485.9,176.1c1.3,2.9-1.2,7.2-5,8.6-2.1-.4-2.8-1.3-2.3-2.7,2.7-2.3,3.5-4.4,7.4-5.9Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M486.5,185.7c-.4,3.1-4.8,5.5-8.9,4.6-1.5-1.5-1.7-2.7-.5-3.6,3.6-.5,5.3-1.9,9.4-1.1Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M483.5,190.8c1.1,3-1.7,7.1-5.7,8.2-2-.6-2.7-1.6-2.1-2.9,2.9-2.1,3.8-4.2,7.8-5.3Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M483.7,199c-.6,3.1-5.2,5.1-9.1,4-1.4-1.6-1.5-2.8-.3-3.6,3.6-.3,5.4-1.5,9.4-.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M480.8,202.3c1,3-2.1,7-6.1,7.9-2-.7-2.6-1.7-2-3,3-2,4.1-3.9,8.1-4.9Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M480.5,210.8c-.8,3.1-5.4,4.9-9.3,3.6-1.3-1.6-1.4-2.8,0-3.6,3.6,0,5.5-1.2,9.4,0Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M321,101c-27,171-17,392,7,501" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#282322" stroke-width="12px" />
  <path d="M321,101c-27,171-17,392,7,501" stroke-width="9px" stroke="#ead4ad" stroke-linecap="round" stroke-linejoin="round" fill="none" />
  <path d="M323.8,103.8c1.5,3.2-1.4,8.1-5.7,9.7-2.3-.5-3.2-1.5-2.6-3.1,3.1-2.6,4-5,8.3-6.6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M324.6,114.2c-.3,3.5-5.2,6.4-9.7,5.6-1.8-1.6-2-2.9-.7-4,4-.7,5.9-2.4,10.5-1.6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M321.5,119.3c1.5,3.2-1.2,8.1-5.6,9.8-2.3-.5-3.2-1.5-2.7-3.1,3.1-2.7,3.9-5,8.2-6.7Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M322.4,129.8c-.2,3.5-5.1,6.4-9.7,5.8-1.8-1.6-2.1-2.9-.8-4,4-.8,5.9-2.4,10.5-1.8Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M319.4,135.2c1.6,3.2-1.1,8.1-5.4,9.9-2.3-.4-3.2-1.4-2.7-3,3-2.7,3.8-5.1,8.1-6.8Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M320.4,145.7c-.2,3.6-5,6.5-9.6,5.9-1.8-1.5-2.1-2.8-.8-4,4-.8,5.8-2.5,10.4-1.9Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M317.5,151.2c1.6,3.2-1,8.1-5.3,9.9-2.3-.4-3.3-1.4-2.7-3,3-2.7,3.8-5.1,8-6.9Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M318.6,161.8c-.2,3.6-4.9,6.6-9.5,6-1.8-1.5-2.1-2.8-.9-4,4-.9,5.8-2.6,10.4-2Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M315.7,167.4c1.7,3.1-.9,8.1-5.2,10-2.3-.4-3.3-1.4-2.8-3,3-2.8,3.7-5.2,8-7Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M317,178.1c-.1,3.6-4.8,6.6-9.4,6.1-1.9-1.5-2.2-2.8-.9-3.9,3.9-.9,5.8-2.7,10.4-2.2Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M314.2,183.8c1.7,3.1-.8,8.1-5.1,10-2.3-.3-3.3-1.3-2.8-2.9,2.9-2.8,3.6-5.2,7.9-7.1Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M315.6,194.5c0,3.6-4.8,6.7-9.4,6.2-1.9-1.5-2.2-2.8-1-3.9,3.9-1,5.7-2.7,10.4-2.3Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M312.8,200.3c1.7,3.1-.7,8.2-4.9,10.1-2.4-.3-3.3-1.3-2.8-2.9,2.9-2.8,3.6-5.3,7.8-7.2Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M314.4,211c0,3.6-4.7,6.7-9.3,6.3-1.9-1.4-2.2-2.7-1-3.9,3.9-1,5.7-2.8,10.3-2.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M311.7,216.9c1.8,3.1-.7,8.2-4.8,10.2-2.4-.3-3.3-1.2-2.9-2.9,2.9-2.9,3.5-5.3,7.7-7.3Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M313.3,227.7c0,3.6-4.6,6.8-9.2,6.4-1.9-1.4-2.3-2.7-1.1-3.9,3.9-1.1,5.7-2.9,10.3-2.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M310.6,233.5c1.8,3.1-.6,8.2-4.7,10.2-2.4-.3-3.3-1.2-2.9-2.8,2.8-2.9,3.5-5.3,7.6-7.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M312.4,244.3c0,3.6-4.5,6.8-9.2,6.5-1.9-1.4-2.3-2.7-1.1-3.9,3.9-1.1,5.7-2.9,10.3-2.6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M309.8,250.3c1.8,3-.5,8.2-4.6,10.3-2.4-.2-3.3-1.2-2.9-2.8,2.8-2.9,3.4-5.4,7.6-7.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M311.7,261.1c0,3.6-4.5,6.9-9.1,6.6-1.9-1.4-2.3-2.7-1.2-3.9,3.9-1.2,5.6-3,10.3-2.7Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M309.1,267c1.9,3-.4,8.2-4.5,10.3-2.4-.2-3.3-1.1-3-2.8,2.8-3,3.4-5.4,7.5-7.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M311.1,277.8c.1,3.6-4.4,6.9-9,6.7-1.9-1.4-2.3-2.7-1.2-3.9,3.9-1.2,5.6-3,10.2-2.8Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M308.6,283.8c1.9,3-.3,8.2-4.4,10.3-2.4-.2-3.4-1.1-3-2.7,2.7-3,3.3-5.4,7.4-7.6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M310.7,294.5c.1,3.6-4.3,6.9-9,6.8-2-1.3-2.4-2.6-1.2-3.9,3.9-1.2,5.6-3.1,10.2-2.9Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M308.3,300.5c1.9,3-.3,8.2-4.3,10.4-2.4-.2-3.4-1.1-3-2.7,2.7-3,3.3-5.5,7.3-7.7Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M310.5,311.2c.2,3.6-4.3,7-8.9,6.9-2-1.3-2.4-2.6-1.3-3.9,3.9-1.3,5.5-3.1,10.2-3Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M308.1,317.1c1.9,3-.2,8.2-4.2,10.4-2.4-.2-3.4-1.1-3-2.7,2.7-3,3.2-5.5,7.3-7.7Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M310.4,327.7c.2,3.6-4.2,7-8.9,6.9-2-1.3-2.4-2.6-1.3-3.8,3.8-1.3,5.5-3.2,10.2-3.1Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M308,333.7c2,3-.1,8.2-4.2,10.5-2.4-.1-3.4-1-3.1-2.7,2.7-3.1,3.2-5.5,7.2-7.8Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M310.4,344.2c.2,3.5-4.2,7.1-8.8,7-2-1.3-2.4-2.6-1.3-3.8,3.8-1.3,5.5-3.2,10.1-3.2Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M308.1,350.1c2,2.9,0,8.2-4.1,10.5-2.4-.1-3.4-1-3.1-2.6,2.6-3.1,3.1-5.6,7.1-7.9Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M310.6,360.6c.3,3.5-4.1,7.1-8.7,7.1-2-1.3-2.5-2.5-1.4-3.8,3.8-1.4,5.5-3.3,10.1-3.3Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M308.4,366.5c2,2.9,0,8.2-4,10.5-2.4,0-3.4-1-3.1-2.6,2.6-3.1,3.1-5.6,7.1-7.9Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M310.9,376.8c.3,3.5-4,7.1-8.7,7.2-2-1.3-2.5-2.5-1.4-3.8,3.8-1.4,5.4-3.3,10.1-3.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M308.8,382.6c2,2.9.1,8.2-3.9,10.6-2.4,0-3.4-.9-3.1-2.6,2.6-3.1,3-5.6,7-8Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M311.4,392.9c.3,3.5-4,7.2-8.6,7.2-2-1.2-2.5-2.5-1.4-3.8,3.8-1.4,5.4-3.4,10-3.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M309.3,398.6c2.1,2.9.2,8.2-3.8,10.6-2.4,0-3.4-.9-3.1-2.6,2.6-3.1,3-5.6,6.9-8Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M312,408.7c.4,3.5-3.9,7.2-8.5,7.3-2-1.2-2.5-2.5-1.5-3.8,3.8-1.5,5.4-3.4,10-3.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M309.9,414.4c2.1,2.9.3,8.2-3.7,10.6-2.4,0-3.4-.9-3.2-2.5,2.5-3.2,2.9-5.7,6.9-8.1Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M312.7,424.3c.4,3.5-3.8,7.2-8.5,7.4-2-1.2-2.5-2.5-1.5-3.8,3.8-1.5,5.3-3.5,10-3.6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M310.7,429.9c2.1,2.9.3,8.2-3.6,10.7-2.4,0-3.4-.8-3.2-2.5,2.5-3.2,2.9-5.7,6.8-8.2Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M313.6,439.7c.4,3.5-3.8,7.3-8.4,7.5-2.1-1.2-2.6-2.4-1.5-3.8,3.8-1.5,5.3-3.5,9.9-3.7Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M311.6,445.1c2.2,2.8.4,8.2-3.5,10.7-2.4,0-3.4-.8-3.2-2.5,2.5-3.2,2.8-5.7,6.7-8.2Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M314.6,454.8c.5,3.5-3.7,7.3-8.3,7.5-2.1-1.2-2.6-2.4-1.6-3.7,3.7-1.6,5.3-3.6,9.9-3.8Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M312.6,460.1c2.2,2.8.5,8.2-3.4,10.7-2.4,0-3.5-.8-3.2-2.4,2.4-3.2,2.8-5.7,6.6-8.3Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M315.6,469.6c.5,3.5-3.6,7.3-8.3,7.6-2.1-1.1-2.6-2.4-1.6-3.7,3.7-1.6,5.2-3.6,9.9-3.9Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M313.7,474.7c2.2,2.8.6,8.2-3.3,10.8-2.4,0-3.5-.7-3.3-2.4,2.4-3.3,2.7-5.8,6.6-8.3Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M316.8,484c.5,3.5-3.6,7.4-8.2,7.7-2.1-1.1-2.6-2.4-1.6-3.7,3.7-1.6,5.2-3.7,9.8-4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M314.9,489c2.2,2.8.6,8.2-3.2,10.8-2.4,0-3.5-.7-3.3-2.4,2.4-3.3,2.6-5.8,6.5-8.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M318.1,498.1c.6,3.5-3.5,7.4-8.1,7.8-2.1-1.1-2.7-2.3-1.7-3.7,3.7-1.7,5.2-3.7,9.8-4.1Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M316.3,502.9c2.3,2.7.7,8.2-3.1,10.8-2.4.1-3.5-.7-3.3-2.3,2.3-3.3,2.6-5.8,6.4-8.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M319.6,511.8c.6,3.5-3.4,7.4-8,7.9-2.1-1.1-2.7-2.3-1.7-3.7,3.7-1.7,5.1-3.8,9.7-4.2Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M317.7,516.4c2.3,2.7.8,8.2-3,10.9-2.4.1-3.5-.6-3.3-2.3,2.3-3.3,2.5-5.8,6.3-8.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M321.1,525c.6,3.5-3.3,7.5-7.9,8-2.1-1.1-2.7-2.3-1.8-3.7,3.7-1.8,5.1-3.8,9.7-4.3Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M319.3,529.5c2.3,2.7.9,8.1-2.8,10.9-2.4.2-3.5-.6-3.4-2.3,2.3-3.4,2.5-5.9,6.2-8.6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M322.7,537.9c.7,3.5-3.2,7.5-7.9,8.1-2.1-1-2.7-2.2-1.8-3.6,3.6-1.8,5-3.9,9.6-4.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M320.9,542.1c2.4,2.7,1,8.1-2.7,10.9-2.4.2-3.5-.6-3.4-2.2,2.2-3.4,2.4-5.9,6.1-8.7Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M324.7,552.2c.7,3.5-3.1,7.6-7.7,8.2-2.1-1-2.8-2.2-1.9-3.6,3.6-1.9,5-4,9.6-4.6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M323.2,558.2c2.4,2.6,1.1,8.1-2.5,11-2.4.2-3.5-.5-3.4-2.2,2.2-3.4,2.3-5.9,5.9-8.8Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M327.1,567.8c.8,3.5-3,7.6-7.6,8.3-2.2-1-2.8-2.2-1.9-3.6,3.6-1.9,4.9-4.1,9.5-4.7Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M325.7,573.4c2.5,2.6,1.3,8.1-2.3,11-2.4.3-3.5-.4-3.5-2.1,2.1-3.5,2.2-6,5.8-8.9Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M329.7,582.5c.9,3.4-2.8,7.7-7.4,8.5-2.2-.9-2.9-2.1-2-3.5,3.5-2,4.8-4.2,9.4-4.9Z" stroke-linecap="round" stroke-linejoin="round" stroke-width=".6px" fill="#fff4dd" stroke="#bda780" />
  <path d="M328.3,587.6c2.5,2.5,1.5,8.1-2,11.1-2.3.3-3.5-.3-3.5-2,2-3.5,2-6,5.6-9Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M332.4,596.1c1,3.4-2.6,7.8-7.2,8.7-2.2-.9-2.9-2-2.1-3.5,3.5-2.1,4.7-4.3,9.3-5.2Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M42,63c-6-53,82-40,122,36C214,26,275-1,280,44c2,27-16,117-16,184l-15,224c9,42,0,75,2,106,2,44,3,73,21,110,17,41-14,67-94,70-90,4-131-14-132-43,0-21,16-39,24-71,18-45,10-76,8-107-8-33,8-68-1-98l-18-165L42,63Z" stroke-linecap="round" stroke-linejoin="round" fill="#fffcf5" stroke="#fffcf5" stroke-width="19px" />
  <path d="M42,63c-6-53,82-40,122,36C214,26,275-1,280,44c2,27-16,117-16,184l-15,224c9,42,0,75,2,106,2,44,3,73,21,110,17,41-14,67-94,70-90,4-131-14-132-43,0-21,16-39,24-71,18-45,10-76,8-107-8-33,8-68-1-98l-18-165L42,63Z" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#c9bdb0" />
  <path d="M42,63c-6-53,82-40,122,36C214,26,275-1,280,44c2,27-16,117-16,184l-15,224c9,42,0,75,2,106,2,44,3,73,21,110,17,41-14,67-94,70-90,4-131-14-132-43,0-21,16-39,24-71,18-45,10-76,8-107-8-33,8-68-1-98l-18-165L42,63Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" stroke-width="3px" fill="#66c9d3" />
  <path d="M49,59c3-36,75-13,115,57,29-50,93-93,109-79-19,42-85,112-108,146-41-44-86-97-116-124Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" stroke-width="3px" fill="#ce832c" />
  <path d="M67,53c37-3,74,40,97,82,34-50,65-85,94-92-40,38-69,85-93,122-41-51-74-91-98-112Z" fill="#e9a042" />
  <path d="M56,77c14,127,24,276,40,352-11,48,0,85,3,120l8-51,7-73-29-232-29-116Z" fill="#3dabb9" />
  <path d="M250,115l-6,304c4,20,2.7,42-4,66l-6-6v-217l16-147Z" fill="#99e4e5" />
  <g>
    <path d="M116.8,221.5c-29-15-25.3-34-36.6-46.4,12,1.3,16.3,19.9,20.2,12.7s-15.5-24.1-14-43.4c6,13.1,14.7,12.4,20.4,26.6,5.7-14.7-9.7-22.9-6.6-52.6,3.1,25.9,23.1,37.7,21.6,63.9.3,18.8-5.4,22.5-5,39.3Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" stroke-width="2px" fill="#f4be38" />
    <path d="M115.9,218.8c-19.9-13.8-23.7-28.5-28.1-34.1,13.7,13.7,17.8,9.4,15.7.2-1-7.6-9.3-17-10.6-23.6,6.9,4.8,11.4,17.4,16.7,16.8,9-10.7-2.2-25.1-4.5-41.3,13.7,22.6,15.3,39,11.3,50.2-1.9,9.5,1.3,15.5-.4,31.9Z" fill="#f04a3f" />
    <path d="M115.7,217.9c-12.9-11-13.9-16.6-17.7-24.4,8,10.5,10.6,5.7,9-3.8,8.6,8.3,9.3,17,8.6,28.2Z" fill="#d82743" />
  </g>
  <g>
    <path d="M158.5,289.3c-29.9-11.7-25.5-29.3-36.9-39.9,12.5.4,16.4,17,20.7,10.2s-15.5-20.9-13.3-38.6c5.9,11.5,15,10.3,20.5,22.8,6.4-13.7-9.5-20.2-5.3-47.4,2.5,23.3,23,32.8,20.6,56.8-.3,17.1-6.3,20.8-6.4,36Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" stroke-width="2px" fill="#f4be38" />
    <path d="M157.8,286.9c-20.3-11.3-23.9-24.4-28.4-29.2,13.9,11.6,18.4,7.4,16.4-.9-.8-6.9-9.2-14.9-10.4-20.8,7.1,4,11.4,15.1,16.9,14.2,9.7-10.3-1.6-22.7-3.4-37.3,13.7,19.7,14.8,34.5,10.2,44.9-2.2,8.8.9,14-1.4,29.1Z" fill="#f04a3f" />
    <path d="M157.5,286.1c-13.1-9.1-14-14.2-17.7-21.1,8,9,10.9,4.5,9.6-4,8.8,7,9.2,14.9,8.1,25.1Z" fill="#d82743" />
  </g>
  <g>
    <path d="M203.3,260.5c-16.4-31.4-3.1-49-6-68,9.3,7.9,3.1,29.4,10.2,24.2s-.2-33.4,11.5-52.5c-1.9,16.8,5.7,20.9,2.9,38.6,12.6-12,4.1-28.9,22.6-58-11.2,28.5-.7,51.6-16,77.9-9.8,19.6-16.5,20.3-25.2,37.9Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" stroke-width="2px" fill="#f4be38" />
    <path d="M204.1,257.2c-9.3-25.1-4.6-42.5-5.4-50.7,4.2,21.7,9.9,19.5,13.1,8.8,3.3-8.4,1.3-22.7,3.7-30.2,3.2,8.8.3,24.2,5.1,26.5,13.2-6.1,11.5-27.2,18.3-45.2-.6,30.9-8,48.7-17.3,58.1-6.6,8.8-7.1,16.7-17.4,32.8Z" fill="#f04a3f" />
    <path d="M204.3,256.1c-5-18.4-2.8-24.8-1.8-34.9,1.1,15.2,5.8,11.7,9.6,1.1,2.8,13.3-1.3,22.7-7.8,33.8Z" fill="#d82743" />
  </g>
  <g>
    <path d="M190,342.3c-21.4-28.5-9.1-45.8-14.4-63.5,11.1,6.9,6.7,27.5,13.9,22.1s-4.1-31.3,6.3-50c-.1,15.9,8.6,19.2,7.7,36.1,12.3-12.1,1-27.4,17.7-55.8-8.8,27.4,5.2,48.4-8.3,74.1-8.3,19-15.5,20.1-22.9,37.1Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" stroke-width="2px" fill="#f4be38" />
    <path d="M190.5,339.1c-13-23-10-39.6-11.7-47.2,7.1,20.1,13.1,17.7,15.2,7.4,2.6-8.1-1.2-21.4.5-28.6,4.5,8.1,3.2,22.7,8.6,24.5,13.6-6.6,9.3-26.3,14.6-43.5,3,29-3,46.2-12.1,55.6-6.2,8.7-5.8,16.1-15.1,31.8Z" fill="#f04a3f" />
    <path d="M190.6,338.1c-7.5-17-5.9-23.1-6-32.7,3,14.2,7.7,10.6,10.5.4,4.6,12.3,1.2,21.4-4.5,32.2Z" fill="#d82743" />
  </g>
  <g>
    <path d="M142.8,393c-32.6-5.3-31.2-23.5-44.7-31.6,12.8-2.2,19.7,13.3,22.9,5.7s-19.5-17.4-20.4-35.3c8.1,10.1,17.1,7.1,24.9,18.2,4.1-14.9-13.2-17.9-13.8-45.8,6.7,22.5,29.2,27.5,31.1,51.7,2.8,16.9-2.7,21.9,0,37Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" stroke-width="2px" fill="#f4be38" />
    <path d="M141.6,390.7c-22.7-6.8-28.7-19.1-34.1-22.9,16.2,8.5,20,3.5,16.5-4.3-2-6.6-12-12.8-14.3-18.3,7.9,2.4,14.3,12.5,19.8,10.4,8-12.2-5.7-22.1-10.2-36.2,17.4,16.6,21.3,31,18.5,42.2-.7,9.1,3.4,13.6,3.7,29Z" fill="#f04a3f" />
    <path d="M141.1,390c-15-6.3-16.8-11.1-21.8-17.1,9.8,7.2,11.9,2.2,9-6,10.2,5,12,12.8,12.8,23Z" fill="#d82743" />
  </g>
  <g>
    <path d="M207.5,443.7c-21.9-25.4-9.9-40.4-15.4-56.1,11.1,6.2,7.2,24.2,14.2,19.6s-4.6-27.6,5.5-43.8c.2,14,8.9,17,8.3,31.8,12.1-10.4.6-24.1,16.7-48.7-8.3,23.9,6,42.7-7,65-8,16.5-15.2,17.4-22.2,32.2Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" stroke-width="2px" fill="#f4be38" />
    <path d="M207.9,441c-13.4-20.5-10.6-34.9-12.5-41.7,7.4,17.8,13.3,15.8,15.3,6.8,2.4-7.1-1.6-18.8,0-25.1,4.6,7.2,3.5,20,9,21.7,13.5-5.5,8.9-22.9,13.8-38,3.5,25.6-2.2,40.6-11.1,48.6-6,7.5-5.5,14.1-14.5,27.7Z" fill="#f04a3f" />
    <path d="M208,440.1c-7.8-15-6.3-20.4-6.6-28.8,3.2,12.5,7.9,9.5,10.5.6,4.8,10.9,1.6,18.8-4,28.2Z" fill="#d82743" />
  </g>
  <g>
    <path d="M125,528.4c-29.1-16.8-24.8-36.4-35.9-49.8,12.1,1.9,16,21.3,20.2,14.1s-15.1-25.7-12.9-45.7c5.8,13.8,14.6,13.5,19.9,28.5,6.2-15-9.2-24.2-5.2-55,2.5,27,22.4,40.1,20.1,67.4-.2,19.5-6.1,23.2-6.2,40.6Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" stroke-width="2px" fill="#f4be38" />
    <path d="M124.2,525.5c-19.8-15.2-23.2-30.7-27.6-36.7,13.5,14.8,17.9,10.6,15.9.9-.8-8-8.9-18.1-10.1-25,6.9,5.3,11.1,18.5,16.5,18.1,9.4-10.7-1.6-26.2-3.4-43.2,13.3,24.1,14.5,41.2,10,52.7-2.2,9.8.9,16.2-1.4,33.2Z" fill="#f04a3f" />
    <path d="M124,524.6c-12.8-12-13.7-17.9-17.2-26.1,7.8,11.2,10.6,6.4,9.3-3.5,8.6,9,8.9,18.1,7.9,29.6Z" fill="#d82743" />
  </g>
  <g>
    <path d="M188.2,536.2c-32.9-23-23.9-44.5-35.1-61.1,14.7,3.8,15.8,26.3,22.4,18.7s-13.8-31-7.4-53.3c4.5,16.4,15.5,17.3,19.3,34.9,10.6-16-6.8-28.5,4-62.6-2.1,30.7,20.1,48.3,12.2,78.6-4,21.9-12,25.2-15.4,44.8Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" stroke-width="2px" fill="#f4be38" />
    <path d="M187.8,532.8c-21.7-19.9-23-37.8-27.3-45.2,14,18.6,20.2,14.4,19.6,3.2.6-9.1-7.7-21.6-7.8-29.5,7.5,7,10.3,22.4,17,22.7,13.7-10.7,3-29.7,4-49,11.9,29,10.1,48.4,2.4,60.6-4.5,10.7-1.9,18.3-8,37.1Z" fill="#f04a3f" />
    <path d="M187.6,531.7c-13.6-15.3-13.6-22-16.5-31.8,7.5,13.7,11.9,8.7,12.2-2.6,8.9,11.3,7.7,21.6,4.2,34.5Z" fill="#d82743" />
  </g>
  <g>
    <path d="M220,535.6c-15.7-24.9-4.6-38.8-7.8-53.8,8.6,6.3,3.8,23.3,9.9,19.2s-1.4-26.4,8.2-41.4c-1.1,13.3,5.8,16.5,4,30.5,10.7-9.4,2.5-22.9,17.9-45.7-8.8,22.4,1.2,40.7-11.3,61.5-7.9,15.4-13.9,15.9-20.9,29.7Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" stroke-width="2px" fill="#f4be38" />
    <path d="M220.5,533c-9.2-19.9-5.7-33.6-6.6-40.1,4.5,17.2,9.5,15.5,11.9,7,2.6-6.6.3-17.9,2.2-23.8,3.2,7,1.2,19.1,5.5,21,11.5-4.8,9.2-21.4,14.6-35.6.6,24.4-5.3,38.5-13.2,45.8-5.5,6.9-5.7,13.2-14.2,25.8Z" fill="#f04a3f" />
    <path d="M220.7,532.1c-5.1-14.6-3.4-19.6-2.9-27.6,1.5,12,5.6,9.3,8.5.9,3,10.5-.3,17.9-5.7,26.7Z" fill="#d82743" />
  </g>
  <g>
    <g>
      <path d="M92.4,222c-7.6,1.7-14.4-.7-20.4-7.3l4.4-1.3-4.7-5.9,6.4.9,1.3-4.4,4.9,4.3,3.7-2.7,3.1,5.7c2.3,3.4,2.8,6.9,1.4,10.6Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" fill="#287b47" stroke-width="1.2px" />
      <path d="M92.4,222l-15.5-11.7M86.9,217.3v-6.2M83,215.4l-5,.9" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#15492f" stroke-width=".7px" />
    </g>
    <g>
      <path d="M118.8,229.6c2.7-7.3,8.5-11.7,17.2-13.2l-1.3,4.4,7.5-.7-4.3,4.8,3,3.5-6.3,1.8.3,4.5-6.4-.5c-4.1.1-7.3-1.4-9.6-4.6Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" fill="#287b47" stroke-width="1.2px" />
      <path d="M118.8,229.6l18.3-6.6M125.8,227.6l5.2,3.3M129.5,225.3l2-4.7" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#15492f" stroke-width=".7px" />
    </g>
    <g>
      <path d="M106.3,238.4c6.2,4.8,8.7,11.5,7.6,20.3l-3.8-2.6-1.5,7.4-3.4-5.5-4.2,1.8.2-6.5-4.4-1.1,2.4-6c1.1-4,3.5-6.6,7.3-7.9Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" fill="#287b47" stroke-width="1.2px" />
      <path d="M106.3,238.4l1,19.4M106.2,245.6l-4.7,4M107.3,249.8l3.9,3.3" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#15492f" stroke-width=".7px" />
    </g>
    <path d="M87.9,218.3c-5.3-7.5,2.6-14.9,10-15.1,3.5-7.4,13.4-5.7,18.2.3,9.6-.5,14.7,7.7,12.2,13.8,6.4,9.2-3.5,15.5-8.7,16-7.4,8.9-16.8,4.3-21.1-.8-11,.3-17.6-8.2-10.6-14.3Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" fill="#f8a5b7" stroke-width="1.4px" />
    <path d="M89.6,217.1c1.4-7.8,10.6-10.6,15.3-8.3-2.9-8.5,10-7,13.7,1,9.6,3.9,6.1,15-1.1,18.8-.4,6.5-10.7,6.9-16.8,0-8.5-1.5-13.4-6.8-11.1-11.5Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" stroke-width="1.2px" fill="#ffd5da" />
    <path d="M96.1,217.5c-3-7.8,5.8-12.1,12.3-7.3,6.4-3.3,12.3,5.1,8.3,11,2.7,5.6-9.1,10.1-14.7,4.7l-5.8-8.3Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" stroke-width="1.1px" fill="#eb7896" />
    <path d="M101.4,212.6c4.4-4.3,13.7,1,11.3,6.4l-9,5.7c2-7-8.2-7.3-2.3-12.1Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" fill="#fff0e8" stroke-width="1.1px" />
    <path d="M101.4,212.6c2.9,0,5.7,2,8.5,5.9M112.7,219c-.6,3.3-3.6,5.2-9,5.7M92.1,215.4c.7,4.5,3.5,8.9,8.6,13.2M119.6,212.9c-3.6.8-4.5,3.6-2.9,8.3" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#282322" stroke-width="1px" />
  </g>
  <g>
    <path d="M148.9,367.3c-13.7-27.5-56.7-83.9-42.1-115.4,13.1-34,59.8-25.3,67.3,6,27.3-26.5,69.1-6.2,64.5,27.6-3.9,35-59.2,68.8-89.7,81.8Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" stroke-width="3.1px" fill="#f02c49" />
    <path d="M150.5,360.2c36.7-30.6,73.8-49.6,78.8-75.9,2.9,37.7-45.5,68.8-78.8,75.9Z" fill="#c91435" />
    <path d="M118.5,265.1c4-26.6,34.2-29.1,43.5-10-22-14.6-33.7,3.9-36.9,17.9l-6.6-7.9Z" fill="#ffb9be" />
    <path d="M183.2,264.2c22.9-21.2,43.5,3.7,36.9,23.3-5.2-23.4-19-27.6-36.9-23.3Z" fill="#fff4e7" />
  </g>
  <path d="M230,237l-12,32-20-5,32-27Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" stroke-width="2px" fill="#fff4dc" />
  <path d="M110,316c33-9,100-20,131-56,9,26,0,51-17,59-32,20-80,22-104,40-5,6,2,16,9,21-22-4-38-23-34-36,2-11,10-18,15-28Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" stroke-width="2.7px" fill="#fff4dc" />
  <path d="M99,340c33-21,96-23,134-54" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#e3cba1" />
  <g>
    <path d="M133.5,326.7l-1.4.5c-.7-.8-1.7-1.6-2.9-2.3s-2.2-1.1-2.9-.9c-.4.1-.9.2-1.4.4-.6.2-1.1.4-1.5.5l-.8.3,6.6,17.3c.1.4.3.7.6.9s.7.3,1.2.3c.3,0,.8,0,1.4-.2.6-.1,1.1-.2,1.5-.4l.5,1.2-14,5.4-.5-1.2c.3-.2.8-.4,1.4-.7s1-.5,1.2-.7c.4-.3.6-.7.7-1,0-.3,0-.7-.2-1.1l-6.7-17.4-.8.3c-.4.2-.9.4-1.4.6s-1,.5-1.4.6c-.7.3-1.2,1.2-1.6,2.6s-.6,2.6-.6,3.7l-1.4.5-2.4-6.3,24.4-9.4,2.4,6.3Z" fill="#282322" />
    <path d="M160.9,333.8c-.4.4-1,.8-1.6,1.3-.6.4-1.4.8-2.2,1.1-1.5.6-2.6.8-3.4.7s-1.5-.5-2-1.1h-.1c-.3.5-.5,1-.8,1.4s-.6.8-1,1.1c-.5.4-.9.8-1.4,1.1s-1.2.6-2.1,1c-1.4.5-2.7.6-3.9.3-1.2-.3-2.1-1.1-2.5-2.3s-.4-1.3-.3-1.8.2-1.1.4-1.6c.2-.5.5-.9.9-1.3s.8-.8,1.3-1.2c.9-.7,2.1-1.6,3.4-2.5s2.3-1.7,2.9-2.2l-.6-1.5c0-.3-.3-.6-.5-1s-.4-.7-.7-1c-.3-.3-.7-.4-1.1-.5s-1,0-1.5.2-.9.4-1.2.7-.5.5-.7.7c.1.2.3.5.7.8s.6.7.7,1.1,0,.4,0,.7,0,.6-.2.8c-.2.3-.4.6-.7.8s-.8.5-1.5.8c-1,.4-1.8.5-2.5.2s-1.1-.7-1.4-1.3-.2-1.2.2-1.9.8-1.3,1.5-1.9c.6-.6,1.4-1.2,2.3-1.7s1.8-1,2.6-1.3,2.2-.8,3.2-1,2-.3,2.9-.3c.9,0,1.7.4,2.4.9s1.3,1.3,1.7,2.4,1,2.6,1.5,4.2c.6,1.6.9,2.7,1.1,3.2s.4.8.7,1c.3.2.6.3,1,.3.2,0,.6,0,1-.2s.8-.3,1.2-.4l.4,1.1ZM149,329.1c-.6.5-1.2.9-1.7,1.4-.6.5-1,1-1.3,1.4-.3.5-.5,1-.6,1.5s0,1.1.2,1.7.7,1.3,1.3,1.5,1.1.2,1.8,0,1.1-.6,1.5-1,.6-.8.8-1.3l-1.9-5.3Z" fill="#282322" />
    <path d="M177,311.6c-.5.3-1,.7-1.3,1.1s-.6,1.1-.8,1.8c-.3,2.3-.6,4.7-.8,7.2s-.6,5.3-.9,8.3c-.2,1.7-.5,3-.9,4.1-.4,1.1-.8,2-1.2,2.6-.4.6-.9,1.1-1.3,1.5s-1,.7-1.6.9c-1.1.4-2.1.5-3,.2s-1.5-.8-1.7-1.4-.2-.6-.2-.9,0-.6.2-1c.1-.3.3-.6.7-.9.3-.3.8-.6,1.2-.8s1.4-.3,2.1-.1,1.6.5,2.5,1c.3-.5.5-1.2.9-2.1.3-.9.5-1.8.5-2.6-2.4-2-4.5-3.8-6.3-5.3-1.8-1.5-3.8-3.1-6.1-4.9-.5-.4-1-.6-1.6-.7s-1.2,0-1.8.1l-.4-1.1,10.9-4.2.4,1.1c-.4.2-.8.4-1.3.8-.5.3-.7.6-.6.9s0,.2.2.3.2.2.4.4c.7.6,1.6,1.4,2.9,2.4s2.7,2.2,4.3,3.5c.2-1.7.3-3.3.4-4.5s.2-2.5.3-3.7c0-.3,0-.5,0-.7s0-.3,0-.3c0-.2-.2-.3-.5-.4s-.6,0-.9,0c-.3,0-.6,0-.9,0s-.5.1-.7.2l-.4-1.1,7.3-2.8.4,1.1Z" fill="#282322" />
    <path d="M193.6,321.6l-11.1,4.3-.4-1.1c.3-.1.6-.3.9-.4s.5-.3.7-.5c.3-.3.5-.5.6-.8s0-.6-.2-1l-6.6-17.2c-.2-.4-.4-.7-.7-1s-.7-.4-1-.5c-.3,0-.7,0-1.2,0s-1,.1-1.4.3l-.4-1.1,8.8-3.8h.4c0,.1,8,20.9,8,20.9.1.4.3.7.6.8.2.2.6.3,1,.3.3,0,.6,0,.8,0s.6,0,1-.2l.4,1.1Z" fill="#282322" />
    <path d="M208.2,300.4c1.1.4,2.1,1,3,1.8s1.5,1.8,1.9,3,.6,2.3.6,3.5c0,1.2-.4,2.3-1,3.4-.6,1.1-1.5,2.2-2.7,3.1-1.1.9-2.5,1.7-4.2,2.3s-2.8.9-4.2,1-2.6,0-3.8-.4c-1.2-.3-2.2-.9-3.1-1.7-.9-.8-1.6-1.9-2.1-3.1s-.7-2.4-.6-3.6c0-1.1.4-2.3,1.1-3.4.6-1.1,1.5-2,2.6-2.9s2.5-1.6,4.1-2.2,3.2-1,4.6-1.1,2.7,0,3.9.4ZM207.8,312.9c0-.7,0-1.5-.2-2.3s-.5-1.9-.9-3-.7-1.5-1.1-2.4-.9-1.6-1.4-2c-.5-.5-1.1-.9-1.8-1.1s-1.4-.1-2.1.2-1.4.8-1.8,1.4c-.3.6-.5,1.3-.6,2,0,.7,0,1.4.3,2.3s.5,1.7.8,2.5.8,2,1.2,2.7.9,1.4,1.5,2c.5.5,1.1.9,1.8,1.1s1.4.1,2.1-.2,1.3-.7,1.6-1.2c.4-.5.6-1.2.6-2Z" fill="#282322" />
    <path d="M231.3,292.8c.3.8.3,1.6,0,2.4-.3.8-.9,1.4-1.9,1.7s-1.7.4-2.4.3-1.3-.6-1.5-1.3-.2-.7-.2-.9,0-.4,0-.6c-.5.2-1,.6-1.5,1.2s-.9,1.2-1.1,1.9l3.3,8.5c.1.4.3.6.5.8.2.2.5.3.9.3.3,0,.8,0,1.4-.2s1.1-.3,1.3-.4l.4,1.1-11.9,4.6-.4-1.1c.3-.1.6-.3.9-.4s.5-.3.7-.4c.3-.3.5-.5.6-.8,0-.3,0-.6-.1-1l-3.5-9c-.1-.4-.4-.7-.7-.9s-.6-.4-1-.4c-.3,0-.6,0-.9,0s-.7.1-1.1.2l-.4-1.1,8.3-3.6h.4c0,.1.9,2.4.9,2.4h0c.5-1.2,1.1-2.1,1.9-3s1.6-1.4,2.6-1.8,2.1-.5,3-.1c.9.3,1.5,1,1.9,1.9Z" fill="#282322" />
  </g>
  <path d="M211,387c37-13,41,16,27,31,6-20-7-19-24-16l-52,13-12-17,61-11Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" stroke-width="2px" fill="#fff4dc" />
  <g>
    <g>
      <path d="M134.5,419.3c-8.3,5.9-17.7,6.5-28.2,1.7l4.7-3.8-8.6-4.7,8.1-2.1-.7-5.9,8.1,2.7,3-5.1,6.6,5.2c4.5,2.9,6.9,6.9,7,12.1Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" fill="#287b47" stroke-width="1.6px" />
      <path d="M134.5,419.3l-24.6-6.2M125.5,416.4l-3.2-7.4M119.8,416.1l-5.6,3.6" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#15492f" stroke-width=".9px" />
    </g>
    <g>
      <path d="M170.2,414.9c-.4-10.2,4.2-18.4,14-24.6l.7,6,8.6-4.7-2.7,8,5.3,2.7-6.6,5.3,2.7,5.3-8,2.7c-4.9,2.2-9.5,2-14-.7Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" fill="#287b47" stroke-width="1.6px" />
      <path d="M170.2,414.9l18.6-17.3M177.5,408.9l8,1.3M180.8,404.3v-6.6" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#15492f" stroke-width=".9px" />
    </g>
    <g>
      <path d="M159.6,431.8c9.9,2.6,16.4,9.4,19.4,20.5l-5.9-1.1,1.9,9.6-6.9-4.9-4.1,4.3-3.1-7.9-5.9,1-.2-8.4c-.7-5.3.9-9.7,4.7-13.2Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" fill="#287b47" stroke-width="1.6px" />
      <path d="M159.6,431.8l11.1,22.9M163.2,440.5l-3.6,7.2M166.6,445.1l6.4,1.9" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#15492f" stroke-width=".9px" />
    </g>
    <path d="M127.2,417.1c-10.1-6.3-4.4-19.2,4.3-23.2.4-10.7,13.2-13.7,22.1-8.9,11.3-5.5,21.6,1.8,21.7,10.4,12.4,7.7,3.7,20.4-2.3,23.7-4.4,14.5-18,13.8-25.7,9.8-13.1,5.9-25.3-.9-20.1-11.8Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" stroke-width="1.9px" fill="#f8a5b7" />
    <path d="M128.7,414.8c-2.3-10.1,7.4-18.1,14.2-17.8-7.8-8.8,8.5-13.5,17-5.8,13.5-.2,15,14.9,8.2,23.2,2.8,8-9.4,13.7-20.2,8.5-11,2.5-19.6-1.3-19.2-8.1Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" fill="#ffd5da" stroke-width="1.5px" />
    <path d="M136.7,412c-7.6-7.9.8-17.5,11-15.1,6.1-7.2,17.3-.1,15.6,8.9,6.1,5.4-5.8,16.8-15.3,13.2l-11.3-7Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" stroke-width="1.4px" fill="#eb7896" />
    <path d="M140.5,403.4c3.1-7.5,17-5.8,16.8,1.9l-8,11.5c-1.2-9.4-13.6-4.6-8.9-13.4Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" fill="#fff0e8" stroke-width="1.4px" />
    <path d="M140.5,403.4c3.5-1.5,7.9-.5,13.2,2.7M157.3,405.3c1,4.3-1.7,8.1-8,11.5M130.8,411.4c3.1,5.1,8.8,8.9,17.1,11.5M162.5,394.5c-3.9,2.8-3.6,6.6.7,11.4" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#282322" stroke-width="1.3px" />
  </g>
  <g>
    <g>
      <path d="M206.4,459.2c-6.5.3-11.7-2.7-15.7-8.9l3.8-.4-3-5.5,5.1,1.7,1.7-3.4,3.4,4.2,3.4-1.7,1.7,5.1c1.4,3.1,1.3,6.1-.4,8.9Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" fill="#287b47" stroke-width="1px" />
      <path d="M206.4,459.2l-11-11.9M202.6,454.5l.8-5.1M199.7,452.4h-4.2" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#15492f" stroke-width=".6px" />
    </g>
    <g>
      <path d="M227,469.2c3.3-5.6,8.6-8.4,16-8.3l-1.7,3.4,6.2.5-4.2,3.3,1.9,3.3-5.4.5-.4,3.8-5.2-1.3c-3.4-.5-5.8-2.2-7.2-5.2Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" fill="#287b47" stroke-width="1px" />
      <path d="M227,469.2l16-2.8M233,468.6l3.8,3.5M236.4,467.2l2.3-3.6" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#15492f" stroke-width=".6px" />
    </g>
    <g>
      <path d="M215.5,474.6c4.4,4.8,5.5,10.7,3.3,17.8l-2.8-2.7-2.3,5.8-2-5-3.7.9,1.1-5.3-3.5-1.5,2.8-4.6c1.5-3.1,3.8-4.9,7.1-5.4Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" fill="#287b47" stroke-width="1px" />
      <path d="M215.5,474.6l-2,16.1M214.4,480.5l-4.4,2.6M214.7,484.2l2.7,3.3" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#15492f" stroke-width=".6px" />
    </g>
    <path d="M203.3,455.5c-3.2-6.9,4.3-11.8,10.4-10.9,3.9-5.6,11.8-2.7,14.9,2.9,7.9,1,11,8.5,8,13.1,3.9,8.5-5.1,12.2-9.4,11.9-7.4,6.3-14.5,1.1-17.2-3.7-9.1-1.4-13.2-9.3-6.7-13.3Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" fill="#f8a5b7" stroke-width="1.2px" />
    <path d="M204.9,454.8c2.3-6.2,10.3-7.1,13.8-4.6-1.1-7.4,9.2-4.3,11.1,2.8,7.3,4.6,2.9,13.2-3.6,15.3-1.3,5.3-9.8,4.1-13.8-2.5-6.8-2.5-10-7.5-7.5-11Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" fill="#ffd5da" stroke-width="1px" />
    <path d="M210.1,456c-1.3-6.9,6.5-9.1,11.1-4.3,5.7-1.7,9.3,5.9,5.2,10.2,1.4,5-8.9,7-12.8,1.7l-3.6-7.7Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" stroke-width=".9px" fill="#eb7896" />
    <path d="M215.2,452.8c4.3-2.9,11.1,2.8,8.4,6.9l-8.3,3.4c2.6-5.4-5.7-7.2,0-10.3Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" fill="#fff0e8" stroke-width=".9px" />
    <path d="M215.2,452.8c2.4.4,4.4,2.5,6.1,6.1M223.5,459.6c-1,2.6-3.7,3.8-8.3,3.4M207.2,453.7c-.1,3.8,1.6,7.8,5.2,12.1M230.1,455.6c-3,.2-4.2,2.3-3.6,6.4" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#282322" stroke-width=".8px" />
  </g>
  <path d="M84,517c23,30,46,8,48-17,21-6,17-30,39-34l13,10c1,21,16,35,32,40-2,27,15,35,35,19v53c3,37,8,57,19,80,7,29-18,44-90,48-72,3-108-12-114-29,0-20,14-39,21-67s-4-70-3-103Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" stroke-width="2.5px" fill="#70d0d9" />
  <path d="M88,529c24,23,48,6,52-23,13.3-6.7,20-15.7,20-27l10-4,8,7c2,21,17,35,30,41,2,23.3,16,30.7,42,22" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#3497a5" stroke-width="1.4px" stroke-dasharray="4 3" />
  <path d="M96.4,553c0,30.7-5.3,62-16,94,32-49,29-65,34-88l-18-6Z" fill="#a3e8e7" />
  <path d="M228,578c18,33,17,54,23,71-3-37-23-56-33-60l10-11Z" fill="#b6eeea" />
  <g>
    <path d="M222.5,657c5.7,3.8,29.3,7,30.8,14.5-15.5-6.4-19.8,3.1-39.2,4.1,1.6,5.2,18.9,16.2,14,23.1-7.7-10.9-19.2-4.4-36.3-10.4-2.9,5,2.4,20.3-7.3,24.3,2.5-11.8-12.5-10.5-21.9-21.6-6.6,3.1-14.8,18-26.3,17.9,11.9-9.1-1.8-13.2-.6-25.9-8.1.3-27.3,9.9-37,5.8,17.5-3.4,9.4-11.8,21-22-7.1-2.6-31.1-1.3-35.9-8.2,17.6,3.3,17.7-6.6,35.9-11.1-3.8-4.7-25.1-12.1-23.4-19.6,12.1,9,20.3.7,39.4,3.3.7-5.3-11.1-19.1-3.5-24.7,2.7,11.8,16.5,7.8,30.4,16.7,5-4.2,6.4-20,17.6-22-7.5,10.9,7.5,12.4,11.7,24.8,7.7-1.8,21.9-14.5,33-12.3-15.4,6.5-4,13-10.6,25,8,1.2,30.4-4.5,37.9,1.3-18.3,0-14.1,9.6-29.6,17.2Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" fill="#f6c545" stroke-width="1.7px" />
    <path d="M215.7,657c5,3.4,25.5,6.2,26.8,12.8-13.5-5.6-17.2,2.7-34.1,3.6,1.4,4.6,16.4,14.3,12.1,20.3-6.7-9.6-16.7-3.9-31.6-9.2-2.6,4.4,2.1,17.9-6.4,21.4,2.2-10.4-10.9-9.2-19.1-19-5.7,2.8-12.8,15.8-22.9,15.7,10.4-8-1.6-11.7-.5-22.8-7.1.3-23.7,8.7-32.2,5.1,15.3-3,8.2-10.4,18.2-19.4-6.2-2.3-27.1-1.2-31.2-7.2,15.3,2.9,15.4-5.8,31.2-9.8-3.3-4.2-21.8-10.6-20.3-17.2,10.5,7.9,17.7.6,34.2,2.9.6-4.7-9.7-16.8-3-21.8,2.4,10.4,14.4,6.8,26.4,14.7,4.3-3.7,5.6-17.6,15.3-19.4-6.5,9.6,6.5,10.9,10.2,21.8,6.7-1.6,19.1-12.8,28.7-10.8-13.4,5.7-3.4,11.5-9.2,22,6.9,1,26.5-3.9,33,1.1-15.9,0-12.3,8.4-25.8,15.2Z" fill="#ed4745" />
    <ellipse cx="170" cy="657" rx="47.2" ry="29.4" fill="#67cbd5" />
  </g>
  <g>
    <g>
      <path d="M148.5,671.2c-11.3,4.7-22.5,2.8-33.5-5.7l6.5-3.2-8.8-7.8,10.1-.3.8-7.1,8.7,5.3,4.9-5.2,6.3,7.9c4.5,4.6,6.2,9.9,5,16Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" fill="#287b47" stroke-width="1.9px" />
      <path d="M148.5,671.2l-27.2-13.9M138.8,665.4l-1.8-9.6M132.1,663.5l-7.5,2.7" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#15492f" stroke-width="1.1px" />
    </g>
    <g>
      <path d="M191.5,675.7c2.2-12.1,9.9-20.4,23-25l-.8,7.2,11.4-3.1-5.3,8.6,5.5,4.6-9.2,4.4,1.7,6.9-10.1,1c-6.3,1.3-11.7-.2-16.2-4.6Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" fill="#287b47" stroke-width="1.9px" />
      <path d="M191.5,675.7l26.5-15.2M201.7,670.7l9,3.7M206.8,666.1l1.8-7.8" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#15492f" stroke-width="1.1px" />
    </g>
    <g>
      <path d="M174.5,692.6c10.9,5.7,16.6,15.4,17.2,29.3l-6.6-2.9-.3,11.8-6.7-7.6-6,3.9-1.5-10.1-7.1-.4,2-9.9c.6-6.4,3.7-11.1,9.1-14.1Z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.9px" stroke="#282322" fill="#287b47" />
      <path d="M174.5,692.6l6.8,29.8M176.4,703.8l-6.2,7.5M179.2,710.1l6.9,4" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-width="1.1px" stroke="#15492f" />
    </g>
    <path d="M140.6,666.6c-10.2-10.2,0-23.7,11.3-26,3.4-12.4,19.2-12.4,28.2-4.5,14.7-3.4,24.9,7.9,22.6,18.1,12.4,12.4-1.1,24.9-9,27.1-9,15.8-24.9,11.3-32.8,4.5-16.9,3.4-29.4-7.9-20.3-19.2Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" fill="#f8a5b7" stroke-width="2.3px" />
    <path d="M142.9,664.4c0-12.4,13.6-19.2,21.5-16.9-6.8-12.4,13.6-13.6,21.5-2.3,15.8,3.4,13.6,21.5,3.4,29.4,1.1,10.2-14.7,13.6-26,4.5-13.6,0-22.6-6.8-20.3-14.7Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" fill="#ffd5da" stroke-width="1.8px" />
    <path d="M153.1,663.3c-6.8-11.3,5.6-20.3,16.9-14.7,9-6.8,20.3,4.5,15.8,14.7,5.6,7.9-11.3,18.1-21.5,11.3l-11.3-11.3Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" stroke-width="1.7px" fill="#eb7896" />
    <path d="M159.8,654.2c5.6-7.9,21.5-2.3,19.2,6.8l-12.4,11.3c1.1-11.3-14.7-9-6.8-18.1Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" fill="#fff0e8" stroke-width="1.7px" />
    <path d="M159.8,654.2c4.5-.8,9.4,1.5,14.7,6.8M179,661c0,5.3-4.1,9-12.4,11.3M146.3,661c2.3,6.8,7.9,12.8,16.9,18.1M188.1,649.7c-5.3,2.3-6,6.8-2.3,13.6" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#282322" stroke-width="1.5px" />
  </g>
  <circle cx="76" cy="119" r="4.6" stroke-linecap="round" stroke-linejoin="round" fill="#e8f2ed" stroke="#548b8d" stroke-width="1.1px" />
  <path d="M73.7,119c0-1.5,1.1-2.3,3.3-2.3" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#fffef8" stroke-width="1.5px" />
  <circle cx="244" cy="113" r="4.6" stroke-linecap="round" stroke-linejoin="round" fill="#e8f2ed" stroke="#548b8d" stroke-width="1.1px" />
  <path d="M241.7,113c0-1.5,1.1-2.3,3.3-2.3" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#fffef8" stroke-width="1.5px" />
  <circle cx="158" cy="221" r="4.6" stroke-linecap="round" stroke-linejoin="round" fill="#e8f2ed" stroke="#548b8d" stroke-width="1.1px" />
  <path d="M155.7,221c0-1.5,1.1-2.3,3.3-2.3" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#fffef8" stroke-width="1.5px" />
  <circle cx="96" cy="614" r="4.6" stroke-linecap="round" stroke-linejoin="round" fill="#e8f2ed" stroke="#548b8d" stroke-width="1.1px" />
  <path d="M93.7,614c0-1.5,1.1-2.3,3.3-2.3" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#fffef8" stroke-width="1.5px" />
  <circle cx="240" cy="619" r="4.6" stroke-linecap="round" stroke-linejoin="round" fill="#e8f2ed" stroke="#548b8d" stroke-width="1.1px" />
  <path d="M237.7,619c0-1.5,1.1-2.3,3.3-2.3" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#fffef8" stroke-width="1.5px" />
  <circle cx="113" cy="693" r="4.6" stroke-linecap="round" stroke-linejoin="round" fill="#e8f2ed" stroke="#548b8d" stroke-width="1.1px" />
  <path d="M110.7,693c0-1.5,1.1-2.3,3.3-2.3" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#fffef8" stroke-width="1.5px" />
  <circle cx="219" cy="692" r="4.6" stroke-linecap="round" stroke-linejoin="round" fill="#e8f2ed" stroke="#548b8d" stroke-width="1.1px" />
  <path d="M216.7,692c0-1.5,1.1-2.3,3.3-2.3" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#fffef8" stroke-width="1.5px" />
  <path d="M49,62c42,39,85,87,116,121" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#282322" stroke-width="11px" />
  <path d="M49,62c42,39,85,87,116,121" stroke="#ead4ad" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-width="8px" />
  <path d="M51.8,60.7c3.1.5,5.2,5.1,4.2,9.1-1.5,1.4-2.7,1.6-3.6.3-.3-3.6-1.6-5.4-.6-9.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M59.2,64.8c2.4,2,1.9,7-1,10-2.1.5-3.1,0-3.3-1.5,1.5-3.3,1.3-5.5,4.2-8.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M60.7,69.1c3.1.6,5.2,5.1,4.1,9.1-1.6,1.4-2.7,1.5-3.6.3-.3-3.6-1.6-5.4-.5-9.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M68.1,73.4c2.4,2.1,1.9,7-1.1,9.9-2.1.4-3.1,0-3.3-1.6,1.6-3.3,1.4-5.5,4.3-8.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M69.6,77.7c3.1.6,5.1,5.2,4,9.2-1.6,1.4-2.8,1.5-3.6.3-.3-3.6-1.5-5.5-.4-9.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M76.9,82.1c2.4,2.1,1.8,7.1-1.2,9.9-2.1.4-3.1-.1-3.2-1.6,1.6-3.2,1.5-5.5,4.4-8.3Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M78.4,86.5c3.1.6,5,5.2,3.9,9.2-1.6,1.4-2.8,1.5-3.6.2-.2-3.6-1.4-5.5-.3-9.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M85.7,90.9c2.3,2.1,1.7,7.1-1.3,9.9-2.1.4-3.1-.1-3.2-1.6,1.6-3.2,1.5-5.5,4.5-8.3Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M87.2,95.3c3.1.7,5,5.3,3.8,9.2-1.6,1.4-2.8,1.4-3.6.2-.2-3.6-1.4-5.5-.2-9.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M94.5,99.8c2.3,2.1,1.7,7.1-1.4,9.9-2.1.4-3.1-.2-3.2-1.7,1.7-3.2,1.6-5.4,4.6-8.3Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M95.9,104.2c3.1.7,5,5.3,3.7,9.3-1.6,1.4-2.8,1.4-3.6.2-.2-3.6-1.4-5.5-.1-9.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M103.1,108.8c2.3,2.2,1.6,7.1-1.4,9.9-2.1.4-3.1-.2-3.2-1.7,1.7-3.2,1.6-5.4,4.6-8.2Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M104.4,113.2c3.1.7,4.9,5.4,3.7,9.3-1.6,1.4-2.8,1.4-3.6.1-.1-3.6-1.3-5.5,0-9.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M111.6,117.7c2.3,2.2,1.6,7.1-1.5,9.9-2.1.4-3.1-.2-3.2-1.7,1.7-3.2,1.6-5.4,4.7-8.2Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M112.8,122c3.1.7,4.9,5.4,3.6,9.3-1.6,1.3-2.8,1.4-3.6.1-.1-3.6-1.3-5.5,0-9.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M119.9,126.5c2.3,2.2,1.5,7.1-1.5,9.9-2.1.4-3.1-.2-3.2-1.7,1.7-3.2,1.7-5.4,4.7-8.2Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M121,130.8c3.1.7,4.9,5.4,3.6,9.3-1.6,1.3-2.8,1.4-3.6,0,0-3.6-1.3-5.5,0-9.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M128,135.3c2.3,2.2,1.5,7.1-1.6,9.9-2.1.3-3.1-.2-3.2-1.7,1.7-3.2,1.7-5.4,4.8-8.2Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M129.1,139.5c3.1.8,4.8,5.4,3.5,9.3-1.6,1.3-2.8,1.4-3.6,0,0-3.6-1.2-5.5,0-9.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M135.9,143.8c2.3,2.2,1.5,7.1-1.6,9.9-2.1.3-3.1-.2-3.2-1.7,1.7-3.2,1.7-5.4,4.8-8.1Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M136.8,147.9c3.1.8,4.8,5.4,3.5,9.4-1.6,1.3-2.8,1.4-3.6,0,0-3.6-1.2-5.5,0-9.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M143.6,152.2c2.3,2.2,1.4,7.1-1.6,9.9-2.1.3-3.1-.3-3.2-1.7,1.7-3.2,1.7-5.4,4.8-8.1Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M144.9,156.7c3.1.8,4.8,5.5,3.5,9.4-1.6,1.3-2.8,1.3-3.6,0,0-3.6-1.2-5.5.1-9.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M152,161.4c2.3,2.2,1.4,7.1-1.7,9.9-2.1.3-3.1-.3-3.2-1.7,1.7-3.2,1.7-5.4,4.8-8.1Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M153.1,165.8c3.1.8,4.8,5.5,3.5,9.4-1.6,1.3-2.8,1.3-3.6,0,0-3.6-1.2-5.5.1-9.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M160,170.3c2.3,2.2,1.4,7.1-1.7,9.9-2.1.3-3.1-.3-3.2-1.7,1.7-3.2,1.7-5.4,4.8-8.1Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M161,174.4c3.1.8,4.8,5.5,3.5,9.4-1.6,1.3-2.8,1.3-3.6,0,0-3.6-1.2-5.5.1-9.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M165,183c39-55,84-98,108-146" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#282322" stroke-width="11px" />
  <path d="M165,183c39-55,84-98,108-146" stroke="#ead4ad" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-width="8px" />
  <path d="M163.4,180.4c.1-3.2,4.4-5.8,8.5-5.3,1.6,1.3,1.9,2.5.8,3.5-3.5.8-5.2,2.3-9.3,1.8Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M166.5,172.6c1.7-2.7,6.7-2.8,10-.3.7,2,.4,3.1-1.1,3.4-3.4-1.1-5.6-.6-8.9-3.1Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M170.5,170.6c.2-3.2,4.5-5.7,8.6-5.2,1.6,1.4,1.9,2.5.7,3.5-3.5.7-5.2,2.2-9.3,1.7Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M173.6,163c1.8-2.6,6.8-2.7,10-.1.7,2,.3,3.1-1.2,3.4-3.4-1.2-5.6-.7-8.8-3.3Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M177.6,161.1c.2-3.2,4.6-5.7,8.6-5.1,1.6,1.4,1.8,2.6.7,3.5-3.5.7-5.2,2.1-9.3,1.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M180.9,153.6c1.8-2.6,6.8-2.6,10,0,.7,2,.3,3.1-1.2,3.4-3.4-1.2-5.6-.8-8.8-3.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M184.8,151.9c.3-3.2,4.6-5.6,8.7-4.9,1.6,1.4,1.8,2.6.6,3.5-3.5.6-5.3,2.1-9.3,1.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M188.1,144.4c1.8-2.6,6.8-2.5,10,.1.6,2,.2,3.1-1.2,3.4-3.4-1.2-5.6-.9-8.8-3.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M192.1,142.8c.3-3.1,4.7-5.6,8.7-4.9,1.6,1.4,1.8,2.6.6,3.6-3.6.6-5.3,2-9.3,1.3Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M195.4,135.4c1.8-2.6,6.8-2.5,10,.2.6,2,.2,3.1-1.3,3.4-3.4-1.3-5.6-.9-8.7-3.6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M199.3,133.9c.3-3.1,4.7-5.6,8.8-4.8,1.5,1.4,1.7,2.6.6,3.6-3.6.6-5.3,2-9.3,1.3Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M202.6,126.6c1.9-2.6,6.9-2.5,10,.2.6,2,.2,3.1-1.3,3.4-3.4-1.3-5.6-.9-8.7-3.6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M206.5,125.1c.3-3.1,4.7-5.6,8.8-4.8,1.5,1.4,1.7,2.6.6,3.6-3.6.6-5.3,2-9.4,1.3Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M210.3,117.2c1.9-2.6,6.9-2.5,10,.2.6,2,.2,3.1-1.3,3.4-3.4-1.3-5.6-.9-8.7-3.6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M214.7,115.1c.3-3.1,4.7-5.6,8.8-4.8,1.6,1.4,1.7,2.6.6,3.6-3.6.6-5.3,2-9.3,1.3Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M218.5,107.2c1.8-2.6,6.8-2.5,10,.2.6,2,.2,3.1-1.3,3.4-3.4-1.3-5.6-.9-8.7-3.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M222.8,105.2c.3-3.1,4.7-5.6,8.7-4.9,1.6,1.4,1.8,2.6.6,3.6-3.6.6-5.3,2-9.3,1.3Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M226.4,97.4c1.8-2.6,6.8-2.6,10,0,.7,2,.2,3.1-1.2,3.4-3.4-1.2-5.6-.8-8.8-3.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M230.6,95.4c.3-3.2,4.6-5.7,8.7-5,1.6,1.4,1.8,2.6.7,3.5-3.5.7-5.2,2.1-9.3,1.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M234,87.7c1.8-2.6,6.8-2.7,10-.1.7,2,.3,3.1-1.2,3.4-3.4-1.2-5.6-.7-8.8-3.3Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M238.1,85.7c.2-3.2,4.5-5.7,8.6-5.2,1.6,1.4,1.9,2.5.7,3.5-3.5.7-5.2,2.2-9.3,1.7Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M241.3,78c1.7-2.7,6.7-2.8,10-.3.7,2,.4,3.1-1.1,3.4-3.4-1.1-5.6-.6-8.9-3.1Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M245.4,76.1c.1-3.2,4.3-5.9,8.4-5.4,1.6,1.3,1.9,2.5.8,3.5-3.5.8-5.1,2.3-9.2,1.9Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M248.3,68.4c1.6-2.7,6.6-3,10-.6.8,2,.5,3.1-1,3.5-3.5-1-5.6-.5-9-2.9Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M252.2,66.5c0-3.2,4.1-6,8.2-5.7,1.7,1.3,2,2.4.9,3.5-3.5.9-5.1,2.5-9.2,2.2Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M254.8,58.8c1.5-2.8,6.5-3.2,10-1,.9,1.9.6,3.1-.9,3.5-3.5-.9-5.7-.3-9.1-2.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M258.5,56.8c-.1-3.2,3.9-6.1,8-6,1.7,1.2,2.1,2.4,1.1,3.4-3.4,1.1-5,2.7-9.1,2.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M260.8,49.1c1.4-2.8,6.4-3.5,9.9-1.4.9,1.9.7,3.1-.7,3.5-3.5-.7-5.7,0-9.2-2.1Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M264.4,47.1c-.3-3.2,3.6-6.3,7.7-6.3,1.8,1.1,2.2,2.3,1.2,3.4-3.4,1.2-4.8,2.9-9,2.9Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M266.3,39.4c1.3-2.9,6.2-3.8,9.8-1.9,1,1.8.8,3-.5,3.6-3.6-.5-5.7.3-9.3-1.7Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M49,62c-6,77,29,288,34,354" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#282322" stroke-width="11px" />
  <path d="M49,62c-6,77,29,288,34,354" stroke="#ead4ad" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-width="8px" />
  <path d="M51.7,63.3c1.6,2.7-.5,7.3-4.2,9.1-2.1-.2-3-1.1-2.6-2.5,2.5-2.6,3.1-4.8,6.8-6.6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M53.4,71.8c.1,3.2-3.9,6.1-8,6-1.7-1.2-2.1-2.4-1.1-3.4,3.4-1.1,5-2.7,9.1-2.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M51.2,76.6c1.7,2.6-.2,7.3-3.8,9.3-2.1-.1-3-.9-2.7-2.4,2.4-2.7,2.9-4.9,6.5-6.9Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M53.2,84.5c.2,3.2-3.7,6.3-7.8,6.3-1.8-1.1-2.2-2.3-1.2-3.4,3.4-1.2,4.9-2.9,9-2.8Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M51.2,88.5c1.8,2.6,0,7.3-3.5,9.4-2.1,0-3-.9-2.8-2.3,2.3-2.8,2.7-5,6.3-7Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M53.4,96.8c.3,3.1-3.5,6.4-7.7,6.4-1.8-1.1-2.2-2.2-1.3-3.4,3.4-1.3,4.8-3,8.9-3.1Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M51.5,101.4c1.9,2.6.2,7.3-3.3,9.4-2.1,0-3-.8-2.8-2.3,2.3-2.8,2.6-5,6.1-7.2Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M54,110.2c.4,3.1-3.4,6.4-7.5,6.6-1.8-1.1-2.3-2.2-1.3-3.4,3.4-1.3,4.7-3.1,8.9-3.2Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M52.2,115.2c1.9,2.5.3,7.3-3.2,9.5-2.1,0-3.1-.7-2.8-2.2,2.2-2.8,2.5-5.1,6-7.3Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M54.8,124.3c.4,3.1-3.3,6.5-7.4,6.7-1.8-1-2.3-2.2-1.4-3.3,3.3-1.4,4.7-3.2,8.8-3.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M53.1,129.8c1.9,2.5.4,7.3-3,9.5-2.1,0-3.1-.7-2.9-2.2,2.2-2.9,2.5-5.1,5.9-7.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M55.7,137.3c.4,3.1-3.2,6.5-7.4,6.8-1.8-1-2.3-2.1-1.4-3.3,3.3-1.4,4.7-3.2,8.8-3.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M54,141.1c2,2.5.5,7.3-2.9,9.6-2.1,0-3.1-.7-2.9-2.1,2.1-2.9,2.4-5.1,5.8-7.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M56.7,148.8c.5,3.1-3.2,6.5-7.3,6.8-1.9-1-2.3-2.1-1.4-3.3,3.3-1.4,4.6-3.2,8.7-3.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M54.9,152.8c2,2.5.5,7.3-2.9,9.6-2.1,0-3.1-.6-2.9-2.1,2.1-2.9,2.4-5.1,5.8-7.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M57.7,160.7c.5,3.1-3.1,6.6-7.3,6.9-1.9-1-2.4-2.1-1.5-3.3,3.3-1.5,4.6-3.3,8.7-3.6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M56,164.8c2,2.5.6,7.3-2.8,9.6-2.1,0-3.1-.6-2.9-2.1,2.1-2.9,2.3-5.1,5.7-7.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M58.9,172.7c.5,3.1-3.1,6.6-7.2,6.9-1.9-1-2.4-2.1-1.5-3.3,3.3-1.5,4.6-3.3,8.7-3.6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M57.2,177c2,2.4.6,7.3-2.8,9.6-2.1,0-3.1-.6-2.9-2.1,2.1-2.9,2.3-5.2,5.7-7.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M60.2,185c.5,3.1-3.1,6.6-7.2,7-1.9-1-2.4-2.1-1.5-3.3,3.3-1.5,4.6-3.3,8.7-3.7Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M58.5,189.4c2,2.4.7,7.2-2.7,9.6-2.1.1-3.1-.6-2.9-2.1,2.1-2.9,2.3-5.2,5.7-7.6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M61.5,197.5c.5,3.1-3,6.6-7.1,7-1.9-1-2.4-2.1-1.5-3.3,3.3-1.5,4.6-3.3,8.7-3.7Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M59.9,202c2,2.4.7,7.2-2.7,9.6-2.1.1-3.1-.6-3-2.1,2.1-3,2.3-5.2,5.6-7.6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M62.9,210.1c.5,3.1-3,6.6-7.1,7-1.9-1-2.4-2-1.5-3.3,3.3-1.5,4.5-3.4,8.6-3.8Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M61.3,214.6c2,2.4.7,7.2-2.6,9.6-2.1.1-3.1-.6-3-2.1,2.1-3,2.2-5.2,5.6-7.6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M64.4,222.8c.6,3.1-3,6.6-7.1,7.1-1.9-.9-2.4-2-1.5-3.3,3.3-1.5,4.5-3.4,8.6-3.8Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M62.8,227.3c2,2.4.7,7.2-2.6,9.7-2.1.1-3.1-.6-3-2,2-3,2.2-5.2,5.6-7.6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M65.9,235.5c.6,3.1-3,6.6-7.1,7.1-1.9-.9-2.4-2-1.6-3.3,3.3-1.6,4.5-3.4,8.6-3.8Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M64.3,240c2,2.4.8,7.2-2.6,9.7-2.1.1-3.1-.5-3-2,2-3,2.2-5.2,5.5-7.6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M67.4,248.2c.6,3.1-3,6.7-7.1,7.1-1.9-.9-2.4-2-1.6-3.2,3.2-1.6,4.5-3.4,8.6-3.8Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M65.9,252.7c2.1,2.4.8,7.2-2.5,9.7-2.1.1-3.1-.5-3-2,2-3,2.2-5.2,5.5-7.6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M69,260.8c.6,3.1-2.9,6.7-7,7.1-1.9-.9-2.4-2-1.6-3.2,3.2-1.6,4.5-3.4,8.6-3.9Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M67.5,265.3c2.1,2.4.8,7.2-2.5,9.7-2.1.1-3.1-.5-3-2,2-3,2.2-5.2,5.5-7.7Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M70.6,273.4c.6,3.1-2.9,6.7-7,7.1-1.9-.9-2.4-2-1.6-3.2,3.2-1.6,4.5-3.4,8.6-3.9Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M69.1,277.8c2.1,2.4.8,7.2-2.5,9.7-2.1.1-3.1-.5-3-2,2-3,2.2-5.2,5.5-7.7Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M72.2,285.7c.6,3.1-2.9,6.7-7,7.1-1.9-.9-2.4-2-1.6-3.2,3.2-1.6,4.5-3.4,8.6-3.9Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M70.6,290.1c2.1,2.4.8,7.2-2.5,9.7-2.1.1-3.1-.5-3-2,2-3,2.2-5.2,5.5-7.7Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M73.7,297.9c.6,3.1-2.9,6.7-7,7.1-1.9-.9-2.4-2-1.6-3.2,3.2-1.6,4.5-3.4,8.6-3.9Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M72.2,302.1c2.1,2.4.8,7.2-2.5,9.7-2.1.1-3.1-.5-3-2,2-3,2.2-5.2,5.5-7.7Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M75.3,309.9c.6,3.1-2.9,6.7-7,7.1-1.9-.9-2.4-2-1.6-3.2,3.2-1.6,4.5-3.4,8.6-3.9Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M73.7,314c2.1,2.4.8,7.2-2.5,9.7-2.1.1-3.1-.5-3-2,2-3,2.2-5.2,5.5-7.7Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M76.8,321.5c.6,3.1-2.9,6.7-7,7.1-1.9-.9-2.4-2-1.6-3.2,3.2-1.6,4.5-3.4,8.6-3.9Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M75.2,325.5c2.1,2.4.8,7.2-2.5,9.7-2.1.1-3.1-.5-3-2,2-3,2.2-5.2,5.5-7.7Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M78.3,332.9c.6,3.1-2.9,6.7-7,7.1-1.9-.9-2.4-2-1.6-3.2,3.2-1.6,4.5-3.4,8.6-3.9Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M76.9,338.5c2.1,2.4.8,7.2-2.5,9.7-2.1.1-3.1-.5-3-2,2-3,2.2-5.2,5.5-7.7Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M80.2,347.4c.6,3.1-2.9,6.7-7,7.1-1.9-.9-2.4-2-1.6-3.2,3.2-1.6,4.5-3.4,8.6-3.9Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M78.7,352.6c2.1,2.4.8,7.2-2.5,9.7-2.1.1-3.1-.5-3-2,2-3,2.2-5.2,5.5-7.7Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M81.9,361.2c.6,3.1-2.9,6.7-7,7.1-1.9-.9-2.4-2-1.6-3.2,3.2-1.6,4.5-3.4,8.6-3.9Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M80.4,365.9c2.1,2.4.8,7.2-2.6,9.7-2.1.1-3.1-.5-3-2,2-3,2.2-5.2,5.5-7.6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M83.5,374.1c.6,3.1-3,6.6-7.1,7.1-1.9-.9-2.4-2-1.6-3.3,3.3-1.6,4.5-3.4,8.6-3.8Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M81.9,378.3c2,2.4.7,7.2-2.6,9.7-2.1.1-3.1-.6-3-2,2-3,2.2-5.2,5.6-7.6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M84.9,386c.5,3.1-3,6.6-7.1,7-1.9-1-2.4-2-1.5-3.3,3.3-1.5,4.5-3.4,8.7-3.8Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M83.4,391c2,2.4.7,7.2-2.7,9.6-2.1.1-3.1-.6-2.9-2.1,2.1-2.9,2.3-5.2,5.6-7.6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M86.4,399.3c.5,3.1-3.1,6.6-7.2,6.9-1.9-1-2.4-2.1-1.5-3.3,3.3-1.5,4.6-3.3,8.7-3.7Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M84.7,403.4c2,2.5.6,7.3-2.8,9.6-2.1,0-3.1-.6-2.9-2.1,2.1-2.9,2.4-5.1,5.8-7.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M87.6,411.8c.4,3.1-3.2,6.5-7.3,6.8-1.8-1-2.3-2.1-1.4-3.3,3.3-1.4,4.7-3.2,8.8-3.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M83,416c-14,42,3,75-1,104" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#282322" stroke-width="11px" />
  <path d="M83,416c-14,42,3,75-1,104" stroke="#ead4ad" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-width="8px" />
  <path d="M85.3,417.7c1,3-2.1,7-6.1,7.9-2-.7-2.7-1.7-2-3,3-2,4-4,8-4.9Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M85.3,425.4c-.5,3.1-5,5.3-9,4.3-1.5-1.5-1.6-2.7-.4-3.6,3.6-.4,5.4-1.7,9.4-.7Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M82.4,428.7c1.3,2.9-1.3,7.2-5.2,8.6-2.1-.5-2.8-1.4-2.3-2.8,2.8-2.3,3.6-4.4,7.5-5.8Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M83.2,436.7c-.2,3.2-4.4,5.8-8.5,5.3-1.6-1.3-1.9-2.5-.8-3.5,3.5-.8,5.2-2.3,9.3-1.8Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M80.7,440c1.6,2.7-.5,7.3-4.3,9-2.1-.2-2.9-1.1-2.6-2.5,2.5-2.6,3.1-4.7,6.8-6.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M82.3,447.6c.1,3.2-3.8,6.2-7.9,6.1-1.7-1.2-2.1-2.3-1.1-3.4,3.4-1.1,4.9-2.8,9.1-2.6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M80.1,451.5c1.8,2.6.1,7.3-3.4,9.4-2.1,0-3-.8-2.8-2.3,2.3-2.8,2.7-5,6.2-7.1Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M82.4,459.2c.4,3.1-3.3,6.5-7.4,6.7-1.8-1-2.3-2.1-1.4-3.3,3.3-1.4,4.7-3.2,8.8-3.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M80.6,463.1c2,2.5.6,7.3-2.8,9.6-2.1,0-3.1-.6-2.9-2.1,2.1-2.9,2.3-5.2,5.7-7.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M83.4,470.5c.6,3.1-3,6.6-7.1,7.1-1.9-.9-2.4-2-1.6-3.3,3.3-1.6,4.5-3.4,8.6-3.8Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M81.7,474.2c2.1,2.4.8,7.2-2.5,9.7-2.1.2-3.1-.5-3-2,2-3,2.2-5.2,5.5-7.7Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M84.9,482c.6,3.1-2.9,6.7-7,7.2-1.9-.9-2.4-2-1.6-3.2,3.2-1.6,4.5-3.5,8.6-3.9Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M83.3,486c2.1,2.4.8,7.2-2.5,9.7-2.1.1-3.1-.5-3-2,2-3,2.2-5.2,5.5-7.7Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M86.4,493.6c.5,3.1-3.1,6.6-7.2,7-1.9-1-2.4-2.1-1.5-3.3,3.3-1.5,4.6-3.3,8.7-3.7Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M84.8,497.4c1.9,2.5.4,7.3-3,9.5-2.1,0-3.1-.7-2.9-2.2,2.2-2.9,2.5-5.1,5.9-7.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M87.4,505.5c.3,3.2-3.6,6.3-7.7,6.3-1.8-1.1-2.2-2.3-1.2-3.4,3.4-1.2,4.8-2.9,9-3Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M85.6,509.5c1.6,2.7-.5,7.3-4.2,9.1-2.1-.2-3-1.1-2.6-2.5,2.5-2.6,3.1-4.8,6.8-6.6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M87.2,517.8c-.2,3.2-4.5,5.7-8.6,5.1-1.6-1.4-1.8-2.6-.7-3.5,3.5-.7,5.2-2.2,9.3-1.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M273,43c3,127-19,316-24,409" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#282322" stroke-width="11px" />
  <path d="M273,43c3,127-19,316-24,409" stroke="#ead4ad" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-width="8px" />
  <path d="M275.9,43.8c1.8,2.6,0,7.3-3.6,9.3-2.1,0-3-.9-2.8-2.3,2.3-2.8,2.7-5,6.3-7Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M278.1,51.7c.2,3.2-3.7,6.3-7.8,6.3-1.8-1.1-2.2-2.3-1.2-3.4,3.4-1.2,4.9-2.9,9-2.9Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M276.1,55.6c1.8,2.6,0,7.3-3.7,9.3-2.1-.1-3-.9-2.7-2.4,2.4-2.7,2.8-4.9,6.4-6.9Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M278.2,63.7c.2,3.2-3.7,6.3-7.9,6.2-1.8-1.2-2.1-2.3-1.2-3.4,3.4-1.2,4.9-2.8,9-2.8Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M276.1,67.7c1.7,2.6-.1,7.3-3.8,9.3-2.1-.1-3-.9-2.7-2.4,2.4-2.7,2.8-4.9,6.5-6.9Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M278.2,75.9c.2,3.2-3.8,6.2-7.9,6.1-1.8-1.2-2.1-2.3-1.1-3.4,3.4-1.1,4.9-2.8,9-2.7Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M276.1,80c1.7,2.7-.2,7.3-3.8,9.2-2.1-.2-3-1-2.7-2.4,2.4-2.7,2.9-4.9,6.5-6.8Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M278,88.4c.1,3.2-3.8,6.2-8,6-1.7-1.2-2.1-2.3-1.1-3.4,3.4-1.1,4.9-2.7,9.1-2.6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M275.9,92.6c1.7,2.7-.3,7.3-3.9,9.2-2.1-.2-3-1-2.7-2.4,2.4-2.7,2.9-4.8,6.6-6.8Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M277.8,101.1c.1,3.2-3.9,6.2-8,6-1.7-1.2-2.1-2.4-1.1-3.4,3.4-1.1,5-2.7,9.1-2.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M275.6,105.4c1.7,2.7-.3,7.3-4,9.2-2.1-.2-3-1-2.6-2.5,2.5-2.6,3-4.8,6.6-6.7Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M277.4,114c0,3.2-3.9,6.1-8.1,5.9-1.7-1.2-2.1-2.4-1-3.5,3.5-1,5-2.7,9.1-2.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M275.2,118.4c1.6,2.7-.4,7.3-4,9.1-2.1-.2-3-1-2.6-2.5,2.5-2.6,3-4.8,6.7-6.7Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M277,127.1c0,3.2-4,6.1-8.1,5.9-1.7-1.2-2.1-2.4-1-3.5,3.5-1,5-2.6,9.1-2.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M274.7,131.6c1.6,2.7-.4,7.3-4.1,9.1-2.1-.2-3-1-2.6-2.5,2.5-2.6,3-4.8,6.7-6.6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M276.4,140.4c0,3.2-4,6.1-8.1,5.8-1.7-1.2-2-2.4-1-3.5,3.5-1,5-2.6,9.1-2.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M274.2,144.9c1.6,2.7-.5,7.3-4.2,9.1-2.1-.2-3-1.1-2.6-2.5,2.5-2.6,3.1-4.8,6.7-6.6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M275.8,153.7c0,3.2-4,6.1-8.2,5.8-1.7-1.2-2-2.4-1-3.5,3.5-1,5-2.6,9.1-2.3Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M273.5,158.3c1.6,2.7-.5,7.3-4.2,9.1-2.1-.2-3-1.1-2.6-2.5,2.5-2.6,3.1-4.7,6.8-6.6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M275.1,167.2c0,3.2-4.1,6-8.2,5.7-1.7-1.3-2-2.4-1-3.5,3.5-1,5-2.6,9.2-2.3Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M272.8,171.8c1.6,2.7-.5,7.3-4.2,9.1-2.1-.2-3-1.1-2.6-2.5,2.5-2.6,3.1-4.7,6.8-6.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M274.4,180.8c0,3.2-4.1,6-8.2,5.7-1.7-1.3-2-2.4-1-3.5,3.5-1,5.1-2.5,9.2-2.2Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M272,185.4c1.6,2.7-.6,7.3-4.3,9-2.1-.3-2.9-1.1-2.6-2.5,2.5-2.6,3.1-4.7,6.8-6.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M273.5,194.4c0,3.2-4.1,6-8.2,5.7-1.7-1.3-2-2.4-.9-3.5,3.5-.9,5.1-2.5,9.2-2.2Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M271.2,199c1.6,2.7-.6,7.3-4.3,9-2.1-.3-2.9-1.1-2.5-2.6,2.6-2.5,3.1-4.7,6.9-6.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M272.7,208c0,3.2-4.2,6-8.3,5.6-1.7-1.3-2-2.4-.9-3.5,3.5-.9,5.1-2.5,9.2-2.2Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M270.3,212.6c1.6,2.8-.6,7.3-4.3,9-2.1-.3-2.9-1.1-2.5-2.6,2.6-2.5,3.2-4.7,6.9-6.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M271.7,221.6c0,3.2-4.2,6-8.3,5.6-1.7-1.3-2-2.4-.9-3.5,3.5-.9,5.1-2.5,9.2-2.1Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M269.3,226.2c1.6,2.8-.6,7.3-4.4,9-2.1-.3-2.9-1.1-2.5-2.6,2.6-2.5,3.2-4.7,6.9-6.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M270.8,235.3c0,3.2-4.2,6-8.3,5.6-1.7-1.3-2-2.4-.9-3.5,3.5-.9,5.1-2.5,9.2-2.1Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M268.4,239.8c1.5,2.8-.7,7.3-4.4,9-2.1-.3-2.9-1.1-2.5-2.6,2.6-2.5,3.2-4.7,6.9-6.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M269.8,248.8c0,3.2-4.2,5.9-8.3,5.6-1.7-1.3-2-2.5-.9-3.5,3.5-.9,5.1-2.5,9.2-2.1Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M267.4,253.3c1.5,2.8-.7,7.2-4.4,9-2.1-.3-2.9-1.1-2.5-2.6,2.6-2.5,3.2-4.7,6.9-6.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M268.8,262.3c0,3.2-4.2,5.9-8.3,5.5-1.7-1.3-2-2.5-.9-3.5,3.5-.9,5.1-2.4,9.2-2.1Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M266.3,266.8c1.5,2.8-.7,7.2-4.4,9-2.1-.3-2.9-1.2-2.5-2.6,2.6-2.5,3.2-4.7,7-6.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M267.7,275.7c0,3.2-4.2,5.9-8.3,5.5-1.7-1.3-2-2.5-.9-3.5,3.5-.9,5.1-2.4,9.2-2Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M265.3,280.1c1.5,2.8-.7,7.2-4.5,9-2.1-.3-2.9-1.2-2.5-2.6,2.6-2.5,3.2-4.7,7-6.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M266.7,288.9c0,3.2-4.2,5.9-8.3,5.5-1.7-1.3-2-2.5-.9-3.5,3.5-.9,5.1-2.4,9.2-2Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M264.2,293.3c1.5,2.8-.7,7.2-4.5,8.9-2.1-.3-2.9-1.2-2.5-2.6,2.6-2.5,3.2-4.7,7-6.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M265.6,302c0,3.2-4.2,5.9-8.3,5.5-1.7-1.3-1.9-2.5-.9-3.5,3.5-.9,5.1-2.4,9.2-2Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M263.2,306.3c1.5,2.8-.7,7.2-4.5,8.9-2.1-.3-2.9-1.2-2.5-2.6,2.6-2.5,3.2-4.6,7-6.3Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M264.5,314.9c0,3.2-4.2,5.9-8.4,5.5-1.7-1.3-1.9-2.5-.9-3.5,3.5-.9,5.1-2.4,9.2-2Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M262.1,319.1c1.5,2.8-.7,7.2-4.5,8.9-2.1-.3-2.9-1.2-2.5-2.6,2.6-2.5,3.2-4.6,7-6.3Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M263.5,327.6c0,3.2-4.3,5.9-8.4,5.5-1.7-1.3-1.9-2.5-.9-3.5,3.5-.9,5.1-2.4,9.2-2Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M261,331.7c1.5,2.8-.7,7.2-4.5,8.9-2.1-.3-2.9-1.2-2.5-2.6,2.6-2.5,3.2-4.6,7-6.3Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M262.4,340.1c0,3.2-4.3,5.9-8.4,5.5-1.7-1.3-1.9-2.5-.9-3.5,3.5-.9,5.1-2.4,9.2-2Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M260,344c1.5,2.8-.7,7.2-4.5,8.9-2.1-.3-2.9-1.2-2.5-2.6,2.6-2.5,3.2-4.6,7-6.3Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M261.4,352.4c0,3.2-4.3,5.9-8.4,5.5-1.7-1.3-1.9-2.5-.9-3.5,3.5-.9,5.1-2.4,9.2-2Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M259,356.1c1.5,2.8-.7,7.2-4.5,8.9-2.1-.3-2.9-1.2-2.5-2.6,2.6-2.5,3.2-4.6,7-6.3Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M260.4,364.3c0,3.2-4.2,5.9-8.3,5.5-1.7-1.3-1.9-2.5-.9-3.5,3.5-.9,5.1-2.4,9.2-2Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M258,367.9c1.5,2.8-.7,7.2-4.5,8.9-2.1-.3-2.9-1.2-2.5-2.6,2.6-2.5,3.2-4.6,7-6.3Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M259.4,375.9c0,3.2-4.2,5.9-8.3,5.5-1.7-1.3-1.9-2.5-.9-3.5,3.5-.9,5.1-2.4,9.2-2Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M257.1,379.4c1.5,2.8-.7,7.2-4.5,8.9-2.1-.3-2.9-1.2-2.5-2.6,2.6-2.5,3.2-4.7,7-6.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M258.5,387.3c0,3.2-4.2,5.9-8.3,5.5-1.7-1.3-2-2.5-.9-3.5,3.5-.9,5.1-2.4,9.2-2Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M256,392.4c1.5,2.8-.7,7.2-4.4,9-2.1-.3-2.9-1.2-2.5-2.6,2.6-2.5,3.2-4.7,7-6.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M257.4,401.8c0,3.2-4.2,5.9-8.3,5.5-1.7-1.3-2-2.5-.9-3.5,3.5-.9,5.1-2.4,9.2-2.1Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M254.9,406.5c1.5,2.8-.7,7.2-4.4,9-2.1-.3-2.9-1.1-2.5-2.6,2.6-2.5,3.2-4.7,6.9-6.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M256.3,415.6c0,3.2-4.2,6-8.3,5.6-1.7-1.3-2-2.5-.9-3.5,3.5-.9,5.1-2.5,9.2-2.1Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M253.9,420c1.6,2.8-.6,7.3-4.4,9-2.1-.3-2.9-1.1-2.5-2.6,2.6-2.5,3.2-4.7,6.9-6.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M255.4,428.6c0,3.2-4.2,6-8.3,5.6-1.7-1.3-2-2.4-.9-3.5,3.5-.9,5.1-2.5,9.2-2.1Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M253,432.6c1.6,2.7-.6,7.3-4.3,9-2.1-.3-2.9-1.1-2.5-2.6,2.6-2.5,3.1-4.7,6.9-6.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M254.6,440.9c0,3.2-4.1,6-8.2,5.7-1.7-1.3-2-2.4-.9-3.5,3.5-.9,5.1-2.5,9.2-2.2Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M252.3,444.4c1.6,2.7-.5,7.3-4.2,9.1-2.1-.2-3-1.1-2.6-2.5,2.5-2.6,3.1-4.7,6.8-6.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M249,452c15,36-3,65,1,106" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="#282322" stroke-width="11px" />
  <path d="M249,452c15,36-3,65,1,106" stroke="#ead4ad" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-width="8px" />
  <path d="M252.1,451.8c2.5,1.9,2.2,6.9-.5,10-2,.6-3.1,0-3.3-1.4,1.4-3.3,1.1-5.5,3.9-8.6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M256.8,459.2c1,3-2.1,7-6.1,7.9-2-.7-2.6-1.7-2-3,3-2,4.1-3.9,8.1-4.9Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M255.8,463.5c2.2,2.3,1.1,7.2-2.1,9.8-2.1.2-3.1-.4-3.1-1.9,1.9-3.1,1.9-5.3,5.2-7.9Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M259.2,471.1c.5,3.1-3.1,6.6-7.2,6.9-1.9-1-2.4-2.1-1.5-3.3,3.3-1.5,4.6-3.3,8.7-3.7Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M257.7,475.5c1.8,2.6.1,7.3-3.4,9.4-2.1,0-3-.8-2.8-2.3,2.3-2.8,2.7-5,6.2-7.1Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M260,483.8c.1,3.2-3.9,6.1-8,6-1.7-1.2-2.1-2.4-1.1-3.4,3.4-1.1,5-2.7,9.1-2.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M257.9,487.9c1.5,2.8-.6,7.3-4.4,9-2.1-.3-2.9-1.1-2.5-2.6,2.6-2.5,3.2-4.7,6.9-6.4Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M259.3,496.3c-.1,3.2-4.4,5.8-8.5,5.3-1.6-1.3-1.9-2.5-.8-3.5,3.5-.8,5.2-2.3,9.3-1.8Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M256.9,500.2c1.4,2.8-1.1,7.2-4.9,8.7-2.1-.4-2.9-1.3-2.4-2.7,2.7-2.4,3.4-4.5,7.3-6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M257.9,508.1c-.2,3.2-4.6,5.7-8.6,5-1.6-1.4-1.8-2.6-.7-3.5,3.5-.7,5.2-2.1,9.3-1.5Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M255.4,511.5c1.4,2.9-1.1,7.2-5,8.7-2.1-.4-2.9-1.3-2.4-2.7,2.7-2.4,3.5-4.5,7.3-6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".5px" />
  <path d="M256.3,519.5c-.2,3.2-4.5,5.7-8.6,5.1-1.6-1.4-1.8-2.6-.7-3.5,3.5-.7,5.2-2.2,9.3-1.6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M253.8,523c1.5,2.8-.9,7.2-4.7,8.8-2.1-.3-2.9-1.2-2.4-2.7,2.7-2.4,3.3-4.6,7.1-6.2Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M255,531.1c0,3.2-4.2,5.9-8.3,5.5-1.7-1.3-2-2.5-.9-3.5,3.5-.9,5.1-2.4,9.2-2Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M252.5,535c1.6,2.7-.4,7.3-4.1,9.1-2.1-.2-3-1-2.6-2.5,2.5-2.6,3-4.8,6.7-6.6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M254.3,542.6c.2,3.2-3.8,6.2-7.9,6.2-1.8-1.2-2.1-2.3-1.1-3.4,3.4-1.1,4.9-2.8,9-2.7Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M252.2,546.3c1.9,2.6.2,7.3-3.3,9.4-2.1,0-3-.8-2.8-2.3,2.3-2.8,2.6-5,6.1-7.2Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M254.6,554.1c.5,3.1-3.2,6.6-7.3,6.9-1.9-1-2.3-2.1-1.5-3.3,3.3-1.5,4.6-3.3,8.7-3.6Z" stroke-linecap="round" stroke-linejoin="round" fill="#fff4dd" stroke="#bda780" stroke-width=".6px" />
  <path d="M51,682c17,32,192,49,224,2l2,22c-24,43-212,40-229-2l3-22Z" stroke-linecap="round" stroke-linejoin="round" stroke="#282322" stroke-width="3px" fill="#ad6332" />
  <path d="M54,685c23,38,191,45,218,5" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-width="4px" stroke="#e8a664" />
  <path d="M56,685c21,34,187,42,216,3" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-width="1.7px" stroke="#fff4dc" stroke-dasharray="3 4" />
</g></svg>`,
  },
  {
    id: "pegacorn",
    name: "Pegacorn",
    sub: "a little magic",
    how: "Name Enchanted and Starlight in one sitting",
    hint: "Two kinds of magic in one sitting.",
    era: "Whimsy",
    bordered: true,
    art: `<svg viewBox="0 0 100 100"><g transform="translate(0 7.19178) scale(0.136986)" stroke-linecap="round" stroke-linejoin="round"><defs><clipPath id="pegacorn-body-clip"><path d="M96 185 L82 148 Q68 176 72 211 L75 248 Q80 260 72 282 Q61 305 73 312 Q90 324 104 311 L126 268 C132 298 121 340 137 365 L153 389 L149 449 L138 477 L148 539 Q140 546 142 557 Q154 566 169 557 L172 541 L164 478 L191 431 L205 471 L204 497 L221 564 Q214 575 223 584 Q241 592 255 581 L248 564 L235 497 L268 438 C317 431 372 407 432 416 Q437 451 469 477 L480 492 L480 538 Q469 541 469 554 Q483 565 498 555 L502 538 L509 482 Q534 505 543 510 L541 575 Q532 582 538 594 Q555 603 572 593 L569 576 L584 521 Q590 507 578 490 Q553 459 553 442 C554 418 579 403 585 367 C595 310 572 278 534 268 C480 253 442 270 406 286 L291 306 C230 316 228 259 211 228 C189 189 165 176 141 177 L128 146 L111 182Z" fill="white" stroke="none" stroke-width="0" /></clipPath><clipPath id="pegacorn-wing-clip"><path d="M242 322 C288 286 318 209 365 159 C414 105 481 91 545 74 L690 33 C699 29 689 43 679 49 L649 69 L692 54 Q700 54 689 67 L650 91 L683 85 Q694 85 681 98 L645 121 L679 115 Q690 115 677 132 Q657 159 616 174 L575 188 Q564 208 538 216 L503 224 Q492 246 466 252 L438 260 Q423 281 392 291 C337 318 288 341 242 322Z" fill="white" stroke="none" stroke-width="0" /></clipPath></defs><path d="M550 281 C589 232 639 250 653 295 C670 345 642 431 691 454" fill="none" stroke="#fffcf5" stroke-width="23" /><path d="M546 286 C586 238 636 255 650 299 C667 348 639 434 685 457" fill="none" stroke="#fffcf5" stroke-width="23" /><path d="M542 291 C583 244 633 260 647 303 C664 351 636 437 679 460" fill="none" stroke="#fffcf5" stroke-width="23" /><path d="M538 296 C580 250 630 265 644 307 C661 354 633 440 673 463" fill="none" stroke="#fffcf5" stroke-width="23" /><path d="M534 301 C577 256 627 270 641 311 C658 357 630 443 667 466" fill="none" stroke="#fffcf5" stroke-width="23" /><path d="M530 306 C574 262 624 275 638 315 C655 360 627 446 661 469" fill="none" stroke="#fffcf5" stroke-width="23" /><path d="M96 185 L82 148 Q68 176 72 211 L75 248 Q80 260 72 282 Q61 305 73 312 Q90 324 104 311 L126 268 C132 298 121 340 137 365 L153 389 L149 449 L138 477 L148 539 Q140 546 142 557 Q154 566 169 557 L172 541 L164 478 L191 431 L205 471 L204 497 L221 564 Q214 575 223 584 Q241 592 255 581 L248 564 L235 497 L268 438 C317 431 372 407 432 416 Q437 451 469 477 L480 492 L480 538 Q469 541 469 554 Q483 565 498 555 L502 538 L509 482 Q534 505 543 510 L541 575 Q532 582 538 594 Q555 603 572 593 L569 576 L584 521 Q590 507 578 490 Q553 459 553 442 C554 418 579 403 585 367 C595 310 572 278 534 268 C480 253 442 270 406 286 L291 306 C230 316 228 259 211 228 C189 189 165 176 141 177 L128 146 L111 182Z" fill="#fffcf5" stroke="#fffcf5" stroke-width="19" /><path d="M96 185 L82 148 Q68 176 72 211 L75 248 Q80 260 72 282 Q61 305 73 312 Q90 324 104 311 L126 268 C132 298 121 340 137 365 L153 389 L149 449 L138 477 L148 539 Q140 546 142 557 Q154 566 169 557 L172 541 L164 478 L191 431 L205 471 L204 497 L221 564 Q214 575 223 584 Q241 592 255 581 L248 564 L235 497 L268 438 C317 431 372 407 432 416 Q437 451 469 477 L480 492 L480 538 Q469 541 469 554 Q483 565 498 555 L502 538 L509 482 Q534 505 543 510 L541 575 Q532 582 538 594 Q555 603 572 593 L569 576 L584 521 Q590 507 578 490 Q553 459 553 442 C554 418 579 403 585 367 C595 310 572 278 534 268 C480 253 442 270 406 286 L291 306 C230 316 228 259 211 228 C189 189 165 176 141 177 L128 146 L111 182Z" fill="none" stroke="#c9bdb0" stroke-width="1" /><path d="M242 322 C288 286 318 209 365 159 C414 105 481 91 545 74 L690 33 C699 29 689 43 679 49 L649 69 L692 54 Q700 54 689 67 L650 91 L683 85 Q694 85 681 98 L645 121 L679 115 Q690 115 677 132 Q657 159 616 174 L575 188 Q564 208 538 216 L503 224 Q492 246 466 252 L438 260 Q423 281 392 291 C337 318 288 341 242 322Z" fill="#fffcf5" stroke="#fffcf5" stroke-width="19" /><path d="M242 322 C288 286 318 209 365 159 C414 105 481 91 545 74 L690 33 C699 29 689 43 679 49 L649 69 L692 54 Q700 54 689 67 L650 91 L683 85 Q694 85 681 98 L645 121 L679 115 Q690 115 677 132 Q657 159 616 174 L575 188 Q564 208 538 216 L503 224 Q492 246 466 252 L438 260 Q423 281 392 291 C337 318 288 341 242 322Z" fill="none" stroke="#c9bdb0" stroke-width="1" /><path d="M107 175 C133 111 184 118 218 146 C246 169 262 185 295 177 L303 215 C286 239 260 244 233 225 L207 207 Q170 180 150 188Z" fill="#fffcf5" stroke="#fffcf5" stroke-width="16" /><path d="M550 281 C589 232 639 250 653 295 C670 345 642 431 691 454" fill="none" stroke="#e93659" stroke-width="12" /><path d="M546 286 C586 238 636 255 650 299 C667 348 639 434 685 457" fill="none" stroke="#f47e3d" stroke-width="12" /><path d="M542 291 C583 244 633 260 647 303 C664 351 636 437 679 460" fill="none" stroke="#f4cc49" stroke-width="12" /><path d="M538 296 C580 250 630 265 644 307 C661 354 633 440 673 463" fill="none" stroke="#78bd7c" stroke-width="12" /><path d="M534 301 C577 256 627 270 641 311 C658 357 630 443 667 466" fill="none" stroke="#4ea5d0" stroke-width="12" /><path d="M530 306 C574 262 624 275 638 315 C655 360 627 446 661 469" fill="none" stroke="#7650a8" stroke-width="12" /><path d="M96 185 L82 148 Q68 176 72 211 L75 248 Q80 260 72 282 Q61 305 73 312 Q90 324 104 311 L126 268 C132 298 121 340 137 365 L153 389 L149 449 L138 477 L148 539 Q140 546 142 557 Q154 566 169 557 L172 541 L164 478 L191 431 L205 471 L204 497 L221 564 Q214 575 223 584 Q241 592 255 581 L248 564 L235 497 L268 438 C317 431 372 407 432 416 Q437 451 469 477 L480 492 L480 538 Q469 541 469 554 Q483 565 498 555 L502 538 L509 482 Q534 505 543 510 L541 575 Q532 582 538 594 Q555 603 572 593 L569 576 L584 521 Q590 507 578 490 Q553 459 553 442 C554 418 579 403 585 367 C595 310 572 278 534 268 C480 253 442 270 406 286 L291 306 C230 316 228 259 211 228 C189 189 165 176 141 177 L128 146 L111 182Z" fill="#f4b4c3" stroke="#583b87" stroke-width="3" /><path d="M154 389 L178 405 L191 431 L164 478 L172 541 L150 545 L140 477 L151 449Z" fill="#df8fa9" stroke="#583b87" stroke-width="2.2" /><path d="M432 416 Q453 449 481 461 L509 482 L502 538 L481 541 L480 492 C450 473 437 448 432 416Z" fill="#df8fa9" stroke="#583b87" stroke-width="2.2" /><path d="M151 218 C185 201 213 255 214 279 C220 316 244 334 274 337 C307 345 365 315 410 302 C467 283 519 281 549 304 C499 293 468 310 430 326 C346 364 284 381 219 360 C167 344 178 280 151 218Z" fill="#fbd0d9" stroke="none" stroke-width="0" /><path d="M148 365 C178 394 236 397 280 393 C352 389 408 361 459 365 C416 385 375 411 268 438 L235 497 L248 564 L231 565 L217 496 L223 459 Q217 422 194 411 Q165 403 148 365Z" fill="#e99eb7" stroke="none" stroke-width="0" /><path d="M552 320 C581 356 552 397 539 422 C527 447 548 482 567 505 L567 520 L553 572 L543 575 L545 508 C517 491 497 464 493 443 C520 420 553 374 552 320Z" fill="#e599b3" stroke="none" stroke-width="0" /><path d="M130 270 Q137 300 130 325 Q128 349 143 367" fill="none" stroke="#ffe3e5" stroke-width="5" /><path d="M235 501 L245 557 M555 526 L549 564" fill="none" stroke="#ffe3e5" stroke-width="4" /><path d="M107 174 C125 110 176 117 212 145 C244 172 261 187 292 179" fill="none" stroke="#e93659" stroke-width="11" /><path d="M110 177 C127 120 178 127 214 155 C245 182 262 197 293 189" fill="none" stroke="#f47e3d" stroke-width="11" /><path d="M113 180 C129 130 180 137 216 165 C246 192 263 207 294 199" fill="none" stroke="#f4cc49" stroke-width="11" /><path d="M116 183 C131 140 182 147 218 175 C247 202 264 217 295 209" fill="none" stroke="#78bd7c" stroke-width="11" /><path d="M119 186 C133 150 184 157 220 185 C248 212 265 227 296 219" fill="none" stroke="#4ea5d0" stroke-width="11" /><path d="M122 189 C135 160 186 167 222 195 C249 222 266 237 297 229" fill="none" stroke="#7650a8" stroke-width="11" /><path d="M210 217 C229 241 240 278 278 273" fill="none" stroke="#e93659" stroke-width="8" /><path d="M212 224 C231 248 242 284 281 279" fill="none" stroke="#f47e3d" stroke-width="8" /><path d="M214 231 C233 255 244 290 284 285" fill="none" stroke="#f4cc49" stroke-width="8" /><path d="M216 238 C235 262 246 296 287 291" fill="none" stroke="#78bd7c" stroke-width="8" /><path d="M218 245 C237 269 248 302 290 297" fill="none" stroke="#4ea5d0" stroke-width="8" /><path d="M220 252 C239 276 250 308 293 303" fill="none" stroke="#7650a8" stroke-width="8" /><path d="M94 190 L80 151 Q71 178 76 206Z" fill="#f4b4c3" stroke="#583b87" stroke-width="3" /><path d="M81 167 L88 189 L79 198Z" fill="#df769a" stroke="none" stroke-width="0" /><path d="M111 189 L130 149 L144 182 L134 191Z" fill="#f4b4c3" stroke="#583b87" stroke-width="3" /><path d="M128 163 L135 180 L119 187Z" fill="#e387a4" stroke="none" stroke-width="0" /><path d="M108 182 L55 29 Q51 17 47 24 L85 192Z" fill="#fffcf5" stroke="#fffcf5" stroke-width="12" /><path d="M108 182 L55 29 Q51 17 47 24 L85 192Z" fill="#efbb3b" stroke="#bd8223" stroke-width="2" /><path d="M52 32 L91 179 L101 177Z" fill="#ffde6c" stroke="none" stroke-width="0" /><path d="M55 59 Q63 60 68 53" fill="none" stroke="#b77927" stroke-width="1.6" /><path d="M61 79 Q69 80 74 73" fill="none" stroke="#b77927" stroke-width="1.6" /><path d="M67 99 Q75 100 80 93" fill="none" stroke="#b77927" stroke-width="1.6" /><path d="M73 120 Q81 121 86 114" fill="none" stroke="#b77927" stroke-width="1.6" /><path d="M80 143 Q88 144 93 137" fill="none" stroke="#b77927" stroke-width="1.6" /><path d="M88 165 Q96 166 101 159" fill="none" stroke="#b77927" stroke-width="1.6" /><path d="M242 322 C288 286 318 209 365 159 C414 105 481 91 545 74 L690 33 C699 29 689 43 679 49 L649 69 L692 54 Q700 54 689 67 L650 91 L683 85 Q694 85 681 98 L645 121 L679 115 Q690 115 677 132 Q657 159 616 174 L575 188 Q564 208 538 216 L503 224 Q492 246 466 252 L438 260 Q423 281 392 291 C337 318 288 341 242 322Z" fill="#4eb9bd" stroke="#583b87" stroke-width="3" /><path d="M296 292 C331 235 365 186 407 161 C469 123 573 105 679 44 C613 105 537 136 469 158 C414 176 371 214 334 265Z" fill="#80d3ce" stroke="#583b87" stroke-width="2.3" /><path d="M337 268 C379 209 416 184 474 168 C544 147 611 117 681 66 C628 125 575 153 516 175 C446 203 394 220 337 268Z" fill="#59c1c1" stroke="#583b87" stroke-width="2.3" /><path d="M368 261 C425 213 467 202 521 184 C577 167 632 137 676 95 C653 139 605 169 550 190 C482 216 428 225 368 261Z" fill="#42adb8" stroke="#583b87" stroke-width="2.3" /><path d="M394 271 C432 241 481 236 525 220 C565 206 621 178 674 126 C659 166 611 191 566 207 C506 228 458 245 394 271Z" fill="#72cdca" stroke="#583b87" stroke-width="2.3" /><path d="M302 306 C353 262 402 242 445 239 C425 263 368 286 302 306Z" fill="#49b7bc" stroke="#583b87" stroke-width="2.3" /><path d="M283 319 C320 301 346 287 388 285 C366 307 316 326 283 319Z" fill="#6fcac8" stroke="#583b87" stroke-width="2.3" /><path d="M332 255 Q418 162 590 106" fill="none" stroke="#c0eee2" stroke-width="1.3" /><path d="M373 255 Q482 187 621 130" fill="none" stroke="#c0eee2" stroke-width="1.3" /><path d="M422 256 Q513 231 596 182" fill="none" stroke="#c0eee2" stroke-width="1.3" /><path d="M325 293 Q380 267 414 259" fill="none" stroke="#c0eee2" stroke-width="1.3" /><path d="M76 218 Q85 212 93 219 M114 217 Q124 209 132 216" fill="none" stroke="#583b87" stroke-width="2" /><ellipse cx="84" cy="221" rx="7" ry="5" fill="#403047" stroke="none" stroke-width="1" /><ellipse cx="122" cy="219" rx="8" ry="5" fill="#403047" stroke="none" stroke-width="1" /><circle cx="86" cy="219" r="2" fill="#fffcf5" stroke="none" stroke-width="1" /><circle cx="125" cy="217" r="2" fill="#fffcf5" stroke="none" stroke-width="1" /><path d="M78 217 L74 211 M83 216 L81 208 M117 214 L114 206 M125 214 L128 206 M131 216 L136 210" fill="none" stroke="#583b87" stroke-width="1.8" /><path d="M122 245 Q112 259 104 279" fill="none" stroke="#583b87" stroke-width="2.5" /><ellipse cx="78" cy="295" rx="2.7" ry="2" fill="#9a4272" stroke="none" stroke-width="1" /><path d="M77 305 Q87 311 96 302" fill="none" stroke="#9a4272" stroke-width="2" /><ellipse cx="99" cy="248" rx="7" ry="4" fill="#ed8fad" stroke="none" stroke-width="1" /><g transform="translate(157 549) rotate(0)"><path d="M-11 -4 Q-10 -12 1 -11 Q11 -12 12 -3 L13 6 Q0 11 -13 6Z" fill="#d72e75" stroke="#583b87" stroke-width="1.8" /><path d="M-7 -3 Q-2 -7 5 -5" fill="none" stroke="#ffb6d5" stroke-width="2.2" /></g><g transform="translate(238 576) rotate(-6)"><path d="M-11 -4 Q-10 -12 1 -11 Q11 -12 12 -3 L13 6 Q0 11 -13 6Z" fill="#d72e75" stroke="#583b87" stroke-width="1.8" /><path d="M-7 -3 Q-2 -7 5 -5" fill="none" stroke="#ffb6d5" stroke-width="2.2" /></g><g transform="translate(485 547) rotate(0)"><path d="M-11 -4 Q-10 -12 1 -11 Q11 -12 12 -3 L13 6 Q0 11 -13 6Z" fill="#d72e75" stroke="#583b87" stroke-width="1.8" /><path d="M-7 -3 Q-2 -7 5 -5" fill="none" stroke="#ffb6d5" stroke-width="2.2" /></g><g transform="translate(554 586) rotate(0)"><path d="M-11 -4 Q-10 -12 1 -11 Q11 -12 12 -3 L13 6 Q0 11 -13 6Z" fill="#d72e75" stroke="#583b87" stroke-width="1.8" /><path d="M-7 -3 Q-2 -7 5 -5" fill="none" stroke="#ffb6d5" stroke-width="2.2" /></g><g transform="" clip-path="url(#pegacorn-body-clip)"><circle cx="358.05" cy="498.5" r="0.95" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="569.51" cy="291.27" r="1.38" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="516.06" cy="492.83" r="1.28" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="473.24" cy="570.82" r="1.45" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="500.36" cy="369.13" r="1.11" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="496.22" cy="362.38" r="1.5" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="555.74" cy="301.2" r="0.71" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="346.72" cy="485.12" r="0.71" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="182.78" cy="473.62" r="1.58" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="295.69" cy="450.74" r="1.01" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="549.54" cy="375.63" r="0.96" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="238.69" cy="400.62" r="0.75" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="182.08" cy="467.16" r="1.5" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="209.65" cy="309.5" r="1.37" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="148.89" cy="344.03" r="0.75" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="204.91" cy="532.64" r="1.49" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="381.2" cy="417.85" r="0.72" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="456.81" cy="306.03" r="1.53" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="357.23" cy="403.98" r="1.04" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="289.37" cy="482.11" r="1.4" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="168.4" cy="495.66" r="1.05" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="336.44" cy="526.61" r="0.67" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="171.38" cy="400.49" r="0.95" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="149.43" cy="327.69" r="0.74" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="469.12" cy="425.07" r="1.42" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="495.19" cy="528.42" r="1.36" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="433.66" cy="348.22" r="1.13" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="573.81" cy="335.35" r="1.33" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="338.63" cy="563.45" r="1.42" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="244.87" cy="441.37" r="0.99" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="184.52" cy="355.4" r="0.77" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="271.85" cy="491.35" r="1.05" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="578.68" cy="452.36" r="1.57" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="142.86" cy="560.7" r="1.52" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="442.37" cy="326.82" r="1.56" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="154.2" cy="524.09" r="1.1" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="193.65" cy="373.81" r="1.02" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="372.88" cy="495.62" r="1.42" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="214.04" cy="560.96" r="0.99" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="342.46" cy="555.43" r="0.82" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="439.68" cy="455.12" r="0.94" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="447.17" cy="385.26" r="1.19" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="432.54" cy="469.82" r="0.7" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="458.13" cy="526.9" r="0.86" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="352.54" cy="425.13" r="0.78" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="562.02" cy="571.74" r="0.66" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="447.33" cy="293.97" r="1.51" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="197.0" cy="372.58" r="1.35" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="557.93" cy="473.09" r="0.85" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="452.7" cy="400.03" r="1.02" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="375.44" cy="433.5" r="1.28" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="566.26" cy="387.77" r="1.47" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="216.56" cy="423.51" r="0.66" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="269.22" cy="382.78" r="0.66" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="234.57" cy="463.95" r="1.49" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="384.55" cy="518.12" r="1.07" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="400.51" cy="574.34" r="1.37" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="459.56" cy="427.92" r="1.45" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="370.61" cy="324.07" r="1.15" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="188.82" cy="502.03" r="0.82" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="426.6" cy="511.33" r="1.17" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="406.28" cy="540.93" r="1.22" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="405.15" cy="425.73" r="0.95" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="257.28" cy="405.56" r="0.78" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="345.12" cy="402.66" r="1.51" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="458.53" cy="488.72" r="0.86" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="575.7" cy="438.24" r="1.09" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="512.18" cy="527.31" r="1.23" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="228.41" cy="324.87" r="1.29" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="554.52" cy="304.72" r="0.95" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="510.12" cy="496.98" r="0.89" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="556.98" cy="515.5" r="1.57" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="310.65" cy="390.4" r="1.49" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="414.52" cy="403.99" r="1.12" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="255.18" cy="311.8" r="1.24" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="153.18" cy="565.89" r="1.01" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="273.05" cy="525.6" r="1.39" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="449.56" cy="570.6" r="1.09" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="271.28" cy="400.95" r="1.19" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="358.19" cy="338.22" r="1.34" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="171.87" cy="331.76" r="0.68" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="365.07" cy="539.15" r="0.95" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="177.48" cy="360.7" r="1.31" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="344.04" cy="321.77" r="1.44" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="436.54" cy="437.61" r="1.6" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="176.2" cy="531.43" r="0.83" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="497.34" cy="427.23" r="0.96" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="533.2" cy="478.14" r="1.16" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="483.55" cy="516.45" r="1.49" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="142.06" cy="385.05" r="1.03" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="437.14" cy="518.49" r="1.54" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="452.07" cy="421.89" r="0.86" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="149.19" cy="412.5" r="1.47" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="578.6" cy="537.29" r="1.17" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="283.77" cy="547.44" r="0.77" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="421.01" cy="566.06" r="1.03" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="301.42" cy="428.92" r="1.55" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="158.19" cy="397.94" r="0.96" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="219.9" cy="382.79" r="1.26" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="430.39" cy="317.6" r="1.14" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="148.86" cy="325.16" r="0.93" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="449.98" cy="379.42" r="1.3" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="480.5" cy="336.33" r="1.06" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="396.42" cy="578.13" r="1.12" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="347.21" cy="514.84" r="1.01" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="541.61" cy="441.49" r="1.12" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="285.09" cy="298.33" r="0.94" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="162.77" cy="323.49" r="1.3" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="208.71" cy="539.75" r="1.09" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="327.91" cy="287.79" r="1.55" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="440.43" cy="520.97" r="1.18" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="148.61" cy="330.11" r="1.51" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="369.3" cy="384.08" r="1.43" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="549.19" cy="443.26" r="0.96" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="148.42" cy="460.9" r="0.77" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="159.03" cy="312.29" r="0.86" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="177.14" cy="494.9" r="1.38" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="390.76" cy="502.23" r="1.17" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="288.15" cy="502.78" r="0.91" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="267.74" cy="533.95" r="1.03" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="491.21" cy="498.91" r="1.07" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="178.44" cy="368.78" r="0.9" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="535.23" cy="524.38" r="1.36" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="346.28" cy="341.29" r="1.42" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="377.96" cy="405.76" r="0.85" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="237.06" cy="311.17" r="1.05" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="189.87" cy="385.69" r="1.46" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="517.59" cy="365.06" r="1.46" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="572.61" cy="484.64" r="1.44" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="356.98" cy="448.82" r="0.84" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="387.33" cy="522.38" r="1.52" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="408.05" cy="501.43" r="0.97" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="250.5" cy="546.06" r="1.04" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="256.64" cy="569.7" r="1.58" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="532.88" cy="389.06" r="1.47" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="325.2" cy="526.71" r="1.57" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="445.73" cy="474.78" r="1.34" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="472.49" cy="315.62" r="1.28" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="164.44" cy="412.26" r="0.96" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="367.31" cy="496.53" r="0.98" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="216.94" cy="393.76" r="1.11" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="556.27" cy="292.12" r="0.99" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="216.79" cy="483.49" r="0.95" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="342.78" cy="355.43" r="1.49" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="296.82" cy="343.57" r="1.21" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="266.99" cy="473.94" r="1.08" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="371.52" cy="497.61" r="0.84" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="510.66" cy="337.42" r="1.59" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="272.78" cy="421.68" r="0.8" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="578.49" cy="289.31" r="1.26" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="403.73" cy="468.23" r="0.98" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="336.27" cy="372.82" r="0.75" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="550.47" cy="440.6" r="1.0" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="346.9" cy="424.2" r="1.04" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="355.6" cy="499.65" r="1.39" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="383.14" cy="459.07" r="1.12" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="309.53" cy="384.68" r="0.85" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="570.24" cy="477.31" r="0.7" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="464.3" cy="557.43" r="0.97" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="560.43" cy="445.01" r="1.2" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="347.27" cy="453.88" r="1.55" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="211.45" cy="554.86" r="1.08" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="282.97" cy="525.33" r="1.41" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="377.84" cy="373.99" r="1.43" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="435.08" cy="430.62" r="0.95" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="218.72" cy="515.48" r="0.97" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="513.79" cy="467.84" r="1.59" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="182.02" cy="284.56" r="1.21" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="219.8" cy="485.9" r="1.52" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="503.93" cy="396.67" r="1.37" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="274.56" cy="569.58" r="1.37" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="382.55" cy="352.84" r="1.59" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="315.79" cy="574.89" r="1.01" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="518.85" cy="436.75" r="0.79" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="476.47" cy="572.77" r="1.07" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="496.92" cy="401.2" r="1.04" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="222.04" cy="407.65" r="1.29" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="160.11" cy="521.58" r="1.12" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="443.86" cy="425.66" r="0.74" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="445.23" cy="339.38" r="1.46" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="367.96" cy="344.94" r="1.29" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="405.28" cy="342.71" r="1.45" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="545.42" cy="403.11" r="0.76" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="284.09" cy="309.88" r="1.3" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="352.07" cy="554.07" r="0.68" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="316.01" cy="552.17" r="1.36" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="559.24" cy="340.95" r="1.52" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="169.92" cy="561.27" r="0.69" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="292.64" cy="296.04" r="0.79" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="203.8" cy="384.62" r="0.84" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="468.48" cy="495.62" r="1.1" fill="#e8aa62" stroke="none" stroke-width="1" /><circle cx="229.56" cy="406.68" r="1.04" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="240.51" cy="402.81" r="1.39" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="187.97" cy="410.5" r="0.97" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="577.85" cy="514.74" r="1.12" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="191.02" cy="316.58" r="1.43" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="418.19" cy="424.57" r="1.56" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="232.15" cy="542.95" r="1.19" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="223.75" cy="321.76" r="1.56" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="349.2" cy="371.15" r="1.5" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="448.83" cy="330.39" r="0.88" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="495.55" cy="483.29" r="0.97" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="247.73" cy="434.09" r="1.09" fill="#d9789e" stroke="none" stroke-width="1" /><circle cx="315.96" cy="489.4" r="0.7" fill="#fff4df" stroke="none" stroke-width="1" /><circle cx="334.24" cy="524.28" r="1.16" fill="#d9789e" stroke="none" stroke-width="1" /></g><g transform="" clip-path="url(#pegacorn-wing-clip)"><circle cx="353.91" cy="237.94" r="1.05" fill="#eff4cb" stroke="none" stroke-width="1" /><circle cx="658.83" cy="248.28" r="0.91" fill="#eff4cb" stroke="none" stroke-width="1" /><circle cx="630.43" cy="134.24" r="1.14" fill="#eff4cb" stroke="none" stroke-width="1" /><circle cx="598.95" cy="257.89" r="0.86" fill="#eff4cb" stroke="none" stroke-width="1" /><circle cx="381.41" cy="115.2" r="1.56" fill="#258d9f" stroke="none" stroke-width="1" /><circle cx="354.17" cy="167.7" r="1.18" fill="#eff4cb" stroke="none" stroke-width="1" /><circle cx="358.94" cy="200.91" r="0.73" fill="#c9f1dc" stroke="none" stroke-width="1" /><circle cx="574.32" cy="153.34" r="0.75" fill="#258d9f" stroke="none" stroke-width="1" /><circle cx="359.3" cy="271.66" r="1.12" fill="#258d9f" stroke="none" stroke-width="1" /><circle cx="329.18" cy="150.81" r="1.26" fill="#c9f1dc" stroke="none" stroke-width="1" /><circle cx="335.51" cy="211.29" r="1.02" fill="#eff4cb" stroke="none" stroke-width="1" /><circle cx="569.53" cy="128.26" r="1.05" fill="#eff4cb" stroke="none" stroke-width="1" /><circle cx="335.94" cy="145.87" r="1.29" fill="#eff4cb" stroke="none" stroke-width="1" /><circle cx="406.79" cy="131.44" r="0.9" fill="#eff4cb" stroke="none" stroke-width="1" /><circle cx="435.36" cy="191.12" r="1.07" fill="#eff4cb" stroke="none" stroke-width="1" /><circle cx="425.86" cy="241.81" r="1.09" fill="#c9f1dc" stroke="none" stroke-width="1" /><circle cx="612.91" cy="288.82" r="1.21" fill="#258d9f" stroke="none" stroke-width="1" /><circle cx="363.32" cy="188.87" r="0.87" fill="#eff4cb" stroke="none" stroke-width="1" /><circle cx="610.45" cy="220.8" r="1.42" fill="#eff4cb" stroke="none" stroke-width="1" /><circle cx="580.38" cy="241.52" r="1.42" fill="#c9f1dc" stroke="none" stroke-width="1" /><circle cx="391.66" cy="177.65" r="0.76" fill="#258d9f" stroke="none" stroke-width="1" /><circle cx="537.77" cy="85.18" r="1.43" fill="#c9f1dc" stroke="none" stroke-width="1" /><circle cx="641.64" cy="219.61" r="0.98" fill="#c9f1dc" stroke="none" stroke-width="1" /><circle cx="590.99" cy="193.13" r="1.07" fill="#258d9f" stroke="none" stroke-width="1" /><circle cx="494.97" cy="98.5" r="1.12" fill="#258d9f" stroke="none" stroke-width="1" /><circle cx="473.13" cy="265.93" r="1.55" fill="#258d9f" stroke="none" stroke-width="1" /><circle cx="488.38" cy="199.43" r="0.94" fill="#c9f1dc" stroke="none" stroke-width="1" /><circle cx="468.66" cy="75.66" r="1.11" fill="#258d9f" stroke="none" stroke-width="1" /><circle cx="393.49" cy="218.31" r="1.11" fill="#eff4cb" stroke="none" stroke-width="1" /><circle cx="492.35" cy="95.89" r="0.86" fill="#c9f1dc" stroke="none" stroke-width="1" /><circle cx="515.29" cy="105.99" r="1.22" fill="#258d9f" stroke="none" stroke-width="1" /><circle cx="438.02" cy="218.64" r="0.72" fill="#eff4cb" stroke="none" stroke-width="1" /><circle cx="440.88" cy="156.72" r="0.78" fill="#258d9f" stroke="none" stroke-width="1" /><circle cx="528.33" cy="257.2" r="1.31" fill="#c9f1dc" stroke="none" stroke-width="1" /><circle cx="500.32" cy="170.2" r="1.12" fill="#c9f1dc" stroke="none" stroke-width="1" /><circle cx="547.48" cy="97.74" r="0.96" fill="#c9f1dc" stroke="none" stroke-width="1" /><circle cx="422.93" cy="108.34" r="0.71" fill="#eff4cb" stroke="none" stroke-width="1" /><circle cx="623.58" cy="141.12" r="1.18" fill="#c9f1dc" stroke="none" stroke-width="1" /><circle cx="286.13" cy="294.24" r="1.54" fill="#258d9f" stroke="none" stroke-width="1" /><circle cx="551.35" cy="195.33" r="0.83" fill="#c9f1dc" stroke="none" stroke-width="1" /><circle cx="303.77" cy="81.0" r="1.11" fill="#eff4cb" stroke="none" stroke-width="1" /><circle cx="462.92" cy="292.15" r="1.37" fill="#258d9f" stroke="none" stroke-width="1" /><circle cx="523.06" cy="174.15" r="0.95" fill="#c9f1dc" stroke="none" stroke-width="1" /><circle cx="398.45" cy="263.69" r="1.38" fill="#258d9f" stroke="none" stroke-width="1" /><circle cx="352.06" cy="178.23" r="1.22" fill="#eff4cb" stroke="none" stroke-width="1" /><circle cx="416.78" cy="126.48" r="1.02" fill="#eff4cb" stroke="none" stroke-width="1" /><circle cx="440.55" cy="192.19" r="1.55" fill="#258d9f" stroke="none" stroke-width="1" /><circle cx="397.31" cy="252.2" r="0.98" fill="#eff4cb" stroke="none" stroke-width="1" /><circle cx="516.22" cy="79.18" r="0.89" fill="#eff4cb" stroke="none" stroke-width="1" /><circle cx="629.39" cy="251.48" r="0.88" fill="#eff4cb" stroke="none" stroke-width="1" /><circle cx="518.43" cy="101.62" r="0.84" fill="#258d9f" stroke="none" stroke-width="1" /><circle cx="451.08" cy="211.29" r="1.46" fill="#258d9f" stroke="none" stroke-width="1" /><circle cx="548.74" cy="259.4" r="1.25" fill="#c9f1dc" stroke="none" stroke-width="1" /><circle cx="653.1" cy="203.05" r="1.19" fill="#258d9f" stroke="none" stroke-width="1" /><circle cx="300.7" cy="278.5" r="1.02" fill="#eff4cb" stroke="none" stroke-width="1" /><circle cx="429.95" cy="142.65" r="0.92" fill="#258d9f" stroke="none" stroke-width="1" /><circle cx="613.58" cy="230.36" r="0.95" fill="#c9f1dc" stroke="none" stroke-width="1" /><circle cx="576.63" cy="157.95" r="1.54" fill="#258d9f" stroke="none" stroke-width="1" /><circle cx="354.91" cy="121.51" r="1.42" fill="#c9f1dc" stroke="none" stroke-width="1" /><circle cx="473.06" cy="275.73" r="1.3" fill="#258d9f" stroke="none" stroke-width="1" /><circle cx="336.88" cy="127.09" r="0.72" fill="#c9f1dc" stroke="none" stroke-width="1" /><circle cx="529.39" cy="282.14" r="0.85" fill="#eff4cb" stroke="none" stroke-width="1" /><circle cx="418.3" cy="256.37" r="0.71" fill="#258d9f" stroke="none" stroke-width="1" /><circle cx="487.08" cy="208.0" r="1.41" fill="#eff4cb" stroke="none" stroke-width="1" /><circle cx="284.88" cy="269.85" r="1.01" fill="#258d9f" stroke="none" stroke-width="1" /><circle cx="632.39" cy="210.08" r="0.93" fill="#c9f1dc" stroke="none" stroke-width="1" /><circle cx="623.04" cy="270.82" r="1.59" fill="#eff4cb" stroke="none" stroke-width="1" /><circle cx="457.71" cy="83.23" r="0.82" fill="#eff4cb" stroke="none" stroke-width="1" /><circle cx="577.12" cy="233.45" r="1.45" fill="#258d9f" stroke="none" stroke-width="1" /><circle cx="330.67" cy="268.91" r="1.08" fill="#258d9f" stroke="none" stroke-width="1" /><circle cx="593.44" cy="123.39" r="0.8" fill="#c9f1dc" stroke="none" stroke-width="1" /><circle cx="511.64" cy="213.96" r="0.77" fill="#258d9f" stroke="none" stroke-width="1" /><circle cx="313.1" cy="221.03" r="0.81" fill="#c9f1dc" stroke="none" stroke-width="1" /><circle cx="551.3" cy="167.56" r="1.0" fill="#c9f1dc" stroke="none" stroke-width="1" /><circle cx="558.99" cy="115.04" r="1.28" fill="#258d9f" stroke="none" stroke-width="1" /><circle cx="431.16" cy="207.94" r="1.46" fill="#c9f1dc" stroke="none" stroke-width="1" /><circle cx="374.31" cy="251.88" r="1.18" fill="#258d9f" stroke="none" stroke-width="1" /><circle cx="608.08" cy="245.75" r="0.84" fill="#eff4cb" stroke="none" stroke-width="1" /><circle cx="295.1" cy="170.6" r="1.3" fill="#eff4cb" stroke="none" stroke-width="1" /><circle cx="345.79" cy="229.13" r="0.81" fill="#c9f1dc" stroke="none" stroke-width="1" /></g><path d="M168 288 Q168.7 291.3 172 292 Q168.7 292.7 168 296 Q167.3 292.7 164 292 Q167.3 291.3 168 288Z" fill="#fffcf5" stroke="none" stroke-width="0" /><path d="M265 369 Q265.7 373.3 270 374 Q265.7 374.7 265 379 Q264.3 374.7 260 374 Q264.3 373.3 265 369Z" fill="#fffcf5" stroke="none" stroke-width="0" /><path d="M372 362 Q372.7 365.3 376 366 Q372.7 366.7 372 370 Q371.3 366.7 368 366 Q371.3 365.3 372 362Z" fill="#fffcf5" stroke="none" stroke-width="0" /><path d="M492 323 Q492.7 327.3 497 328 Q492.7 328.7 492 333 Q491.3 328.7 487 328 Q491.3 327.3 492 323Z" fill="#fffcf5" stroke="none" stroke-width="0" /><path d="M532 386 Q532.7 389.3 536 390 Q532.7 390.7 532 394 Q531.3 390.7 528 390 Q531.3 389.3 532 386Z" fill="#fffcf5" stroke="none" stroke-width="0" /><path d="M225 452 Q225.7 454.3 228 455 Q225.7 455.7 225 458 Q224.3 455.7 222 455 Q224.3 454.3 225 452Z" fill="#fffcf5" stroke="none" stroke-width="0" /><path d="M385 189 Q385.7 192.3 389 193 Q385.7 193.7 385 197 Q384.3 193.7 381 193 Q384.3 192.3 385 189Z" fill="#e7f5cf" stroke="none" stroke-width="0" /><path d="M452 150 Q452.7 154.3 457 155 Q452.7 155.7 452 160 Q451.3 155.7 447 155 Q451.3 154.3 452 150Z" fill="#fffcf5" stroke="none" stroke-width="0" /><path d="M544 129 Q544.7 131.3 547 132 Q544.7 132.7 544 135 Q543.3 132.7 541 132 Q543.3 131.3 544 129Z" fill="#fffcf5" stroke="none" stroke-width="0" /><path d="M442 226 Q442.7 229.3 446 230 Q442.7 230.7 442 234 Q441.3 230.7 438 230 Q441.3 229.3 442 226Z" fill="#f9e6a3" stroke="none" stroke-width="0" /><path d="M335 277 Q335.7 279.3 338 280 Q335.7 280.7 335 283 Q334.3 280.7 332 280 Q334.3 279.3 335 277Z" fill="#fffcf5" stroke="none" stroke-width="0" /><path d="M77 108 Q77.7 110.3 80 111 Q77.7 111.7 77 114 Q76.3 111.7 74 111 Q76.3 110.3 77 108Z" fill="#fffcf5" stroke="none" stroke-width="0" /></g></svg>`,
  },
  // END APPROVED REFERENCE STICKERS
];

export const STICKER_BY_ID = Object.fromEntries(STICKERS.map((s) => [s.id, s]));

// A sticker can appear in the drawer, cover, Settings and toast simultaneously.
// Scope any clip paths to this instance so a hidden copy cannot clip a visible one.
let stickerArtInstance = 0;
export function stickerArt(sticker) {
  const prefix = `sticker-art-${++stickerArtInstance}-`;
  return sticker.art.replace(/\bid="([^"]+)"/g, (_, id) => `id="${prefix}${id}"`)
    .replace(/url\(#([^)]+)\)/g, (_, id) => `url(#${prefix}${id})`);
}
