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
//   art:  a self-contained viewBox="0 0 100 100" SVG, exactly as drawn. No die-cut border and
//         no stroke rules live in here: the shared #diecut filter and the .ln stroke classes
//         are injected ONCE (stickerDefs in app.js, styles.css) and every sticker inherits them.
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
];

export const STICKER_BY_ID = Object.fromEntries(STICKERS.map((s) => [s.id, s]));
