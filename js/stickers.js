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
//   art:  a self-contained viewBox="0 0 100 100" SVG, exactly as drawn, held to the seven
//         principles in scripts/stickers/STICKERS.md. It never draws its own border: the
//         shared die-cut filters add the paper edge on every surface. The original set
//         uses .ln stroke classes; guest artwork writes the same weights as attributes.
// Stickers are printed objects with a cream border. Keep their filled shapes distinct
// from the notebook's pen drawings, and never render a sticker below 64px:
// the crowded ones stop being their object.
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
  <path class="ln" fill="#f6efe2" d="M40.95 13.79 C43.68 18 46.84 20.11 50 20.11 C53.16 20.11 56.32 18 59.05 13.79 C65.37 14.84 71.26 17.58 75.26 21.79 L87.89 34.84 C89.58 36.95 88.95 39.68 86.84 41.16 L78.84 47.05 C77.79 47.89 76.74 47.47 76.32 46.42 L74.21 42.63 L74.42 82.21 C74.42 84.95 72.74 86.42 70 86.42 L30 86.21 C27.26 86.21 25.58 84.74 25.58 82 L25.79 42.63 L23.68 46.42 C23.26 47.47 22.21 47.89 21.16 47.05 L13.16 41.16 C11.05 39.68 10.42 36.95 12.11 34.84 L24.74 21.79 C28.74 17.58 34.63 14.84 40.95 13.79Z" />
  <path class="ln t" fill="none" opacity="0.55" d="M43.26 16.11 C45.58 19.89 47.68 22.21 50 22.21 C52.32 22.21 54.63 19.89 56.95 16.11" />
  <path class="ln t" fill="none" opacity="0.3" d="M30 48.53 C29.58 60.53 29.79 73.16 30.42 82.63" />
  <path class="ln t" fill="none" opacity="0.3" d="M70.42 48.95 C70.84 60.95 70.63 73.16 70 82.63" />
  <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7">
    <path stroke="#3b5b9a" d="M33.79 37.79 C35.89 31.68 38.42 38.63 40.53 33.58 C42 30 44.32 36.74 46.84 32.74" />
    <path stroke="#b8382f" d="M54.84 40.11 C57.37 34.21 60.11 41.16 62.63 35.68 C64.11 32.53 66.21 38.42 68.32 35.05" />
    <path stroke="#2b2722" d="M31.68 55.89 C34.84 49.37 37.37 56.95 40.95 51.68 C42.84 48.95 44.74 54.84 47.47 51.47" />
    <path stroke="#4a8c87" d="M52.53 61.16 C55.68 54.84 58.84 62 62.21 56.74 C63.89 54 66.21 59.47 68.32 56.53" />
    <path stroke="#3b5b9a" d="M33.58 72.74 C36.95 66.42 40.11 73.79 43.68 68.74 C45.16 66.63 46.84 70.42 49.37 68.32" />
    <path stroke="#b8382f" d="M54.63 75.89 C56.95 70.42 59.89 76.74 62.63 72.11 C63.89 70 65.79 73.58 67.89 71.47" />
    <path stroke="#2b2722" d="M39.89 65.37 C43.26 59.89 46.21 66.42 49.58 62" />
    <path stroke="#4a8c87" d="M58 47.47 C60.95 43.05 63.68 48.53 66.42 45.16" />
    <path stroke="#3b5b9a" d="M35.89 46.21 C37.79 43.26 40.11 47.26 42.21 45.16" />
    <path stroke="#2b2722" d="M52.53 68.32 C54.84 65.16 56.74 69.37 58.84 67.26" />
    <path stroke="#4a8c87" d="M43.05 78.84 C46.21 74.63 49.37 79.89 52.53 76.74" />
    <path stroke="#b8382f" d="M47.47 43.26 C45.79 40.53 49.37 39.05 50.42 42 C51.68 38.84 55.26 40.74 53.37 43.47 C52.11 45.37 50.63 46.63 50.42 47.47 C50 46.63 48.74 45.16 47.47 43.26Z" />
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
  <path class="ln" fill="#3d382f" d="M22.59 57.52 C20.55 41.4 24.63 27.86 35.17 24.63 C40.97 27 46.34 30 50 31.94 C54.08 29.36 60.1 26.35 66.34 24.2 C76.44 28.07 79.46 41.4 77.41 57.52Z" />
  <path class="ln t" fill="none" stroke="#8b8378" opacity="0.5" d="M35.17 24.63 C38.17 29.57 39.68 34.52 39.47 39.9" />
  <path class="ln t" fill="none" stroke="#8b8378" opacity="0.45" d="M66.34 24.2 C63.33 29.15 61.83 33.88 61.83 39.47" />
  <path class="ln" fill="#b8382f" d="M22.7 44.09 C33.88 49.14 66.12 49.14 77.31 44.09 L77.95 53.23 C66.12 58.17 33.88 58.17 22.7 53.23Z" />
  <text x="50" y="54.62" text-anchor="middle" font-family="'Courier Prime',monospace" font-weight="700" font-size="9.24" letter-spacing="0.64" fill="#f6efe2">22</text>
  <path class="ln" fill="#2f2b25" d="M8.51 59.67 C7.43 52.58 18.4 58.17 22.48 57.52 C32.8 61.61 67.2 61.61 77.52 57.52 C81.82 58.17 92.78 52.58 91.49 59.67 C91.49 69.35 73.22 76.23 50 76.23 C26.78 76.23 8.51 69.35 8.51 59.67Z" />
  <path class="ln t" fill="none" stroke="#6f675a" opacity="0.55" d="M14.1 64.19 C22.05 69.56 34.95 72.58 50 72.58 C64.83 72.58 78.38 68.92 85.91 63.54" />
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
  <path class="ln" fill="none" style="stroke-width:3.4" d="M34.66 27.21 C33.6 14.43 66.61 14.22 65.55 27.21" />
  <path class="ln" fill="#57514a" d="M10.17 28.06 C10.17 25.51 12.09 24.02 14.86 24.02 L85.57 24.44 C88.34 24.44 90.04 26.15 90.04 28.7 L89.83 73.85 C89.83 76.41 87.91 78.11 85.14 78.11 L14.86 77.69 C12.09 77.69 10.17 75.98 10.17 73.43Z" />
  <path class="ln t" fill="#3d382f" d="M15.5 32.54 L44.25 32.75 L44.04 69.59 L15.28 69.38Z" />
  <path class="ln t" fill="#3d382f" d="M55.96 32.96 L84.5 33.17 L84.29 69.81 L55.75 69.59Z" />
  <circle class="ln t" cx="29.77" cy="51.06" r="13.42" fill="#2b2722" />
  <circle class="ln t" cx="29.77" cy="51.06" r="8.09" fill="#4a443b" />
  <circle cx="29.77" cy="51.06" r="3.41" fill="#8a8175" />
  <circle class="ln t" cx="70.02" cy="51.28" r="13.21" fill="#2b2722" />
  <circle class="ln t" cx="70.02" cy="51.28" r="7.88" fill="#4a443b" />
  <circle cx="70.02" cy="51.28" r="3.3" fill="#8a8175" />
  <path class="ln t" fill="#d9cfba" d="M46.38 41.91 L53.83 41.91 L53.62 56.82 L46.17 56.82Z" />
  <circle cx="50" cy="46.38" r="1.7" fill="#57514a" />
  <circle cx="50" cy="52.13" r="1.7" fill="#57514a" />
  <path class="ln t" fill="#4a8c87" d="M46.17 34.45 L53.83 34.45 L53.83 38.71 L46.17 38.71Z" />
  <g fill="#c7951f"><circle cx="47.44" cy="62.14" r="2.24" /><circle cx="52.77" cy="62.35" r="2.13" /></g>
  <path class="ln t" fill="#3d382f" d="M20.82 78.11 L29.13 78.11 L29.13 83.44 L20.82 83.44Z" />
  <path class="ln t" fill="#3d382f" d="M70.66 78.33 L79.18 78.33 L79.18 83.65 L70.66 83.65Z" />
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
    <path class="ln" fill="#e3c39c" d="M8.26 42.66 C8.26 38.53 11.7 36.24 16.29 36.47 L83.25 36.93 C88.07 37.04 91.74 39.34 91.62 43.35 L91.39 56.88 C91.28 61.01 87.73 63.3 83.25 63.07 L16.75 62.61 C11.93 62.5 8.49 60.21 8.61 56.19Z" />
    <path class="ln t" fill="#f6efe2" d="M35.78 40.02 L64.45 40.25 L64.22 59.63 L35.44 59.4Z" />
    <g fill="#2b2722" opacity="0.32">
      <circle cx="15.37" cy="44.04" r="1.38" /><circle cx="22.25" cy="44.38" r="1.26" /><circle cx="28.9" cy="43.81" r="1.38" />
      <circle cx="15.14" cy="50.23" r="1.26" /><circle cx="22.37" cy="49.89" r="1.38" /><circle cx="29.13" cy="50.34" r="1.26" />
      <circle cx="15.6" cy="56.19" r="1.38" /><circle cx="22.14" cy="56.54" r="1.26" /><circle cx="28.9" cy="55.96" r="1.38" />
      <circle cx="71.1" cy="44.15" r="1.26" /><circle cx="77.98" cy="43.81" r="1.38" /><circle cx="84.63" cy="44.38" r="1.26" />
      <circle cx="71.33" cy="50.11" r="1.38" /><circle cx="77.75" cy="50.46" r="1.26" /><circle cx="84.86" cy="49.77" r="1.38" />
      <circle cx="70.98" cy="56.42" r="1.26" /><circle cx="78.09" cy="55.96" r="1.38" /><circle cx="84.51" cy="56.31" r="1.26" />
    </g>
    <path fill="#a8322c" opacity="0.8" d="M44.95 46.56 C48.39 43.81 53.9 44.95 55.27 48.85 C56.42 52.52 52.98 56.19 48.85 55.27 C44.95 54.36 41.97 49.54 44.95 46.56Z" />
    <circle cx="58.49" cy="45.18" r="1.72" fill="#a8322c" opacity="0.55" />
    <circle cx="42.43" cy="54.13" r="1.26" fill="#a8322c" opacity="0.45" />
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
  <path class="ln" fill="#e8dfcc" d="M24.65 69.74 C20.08 73.48 18.21 80.75 21.53 85.95 C25.48 90.52 32.96 88.23 34 82 C34.83 77.01 32.75 72.03 28.39 69.74Z" />
  <path class="ln" fill="#e8dfcc" d="M72.23 70.78 C77.64 73.9 80.13 80.55 77.43 85.32 C74.31 90.52 66.42 88.86 64.75 83.25 C63.3 78.47 66.21 72.44 70.57 70.16Z" />
  <path class="ln" fill="#f6efe2" d="M17.38 41.69 L82.62 41.69 C82.62 61.84 79.51 74.94 71.19 77.64 L28.81 77.64 C20.49 74.94 17.38 61.84 17.38 41.69Z" />
  <g class="ln t">
    <path fill="#c7951f" d="M50 10.1 L58.94 19.45 L50.62 32.34 L41.06 19.66Z" />
    <path fill="#b0587c" d="M31.92 18.42 L39.82 23.82 L36.7 33.17 L27.97 28.81Z" />
    <path fill="#4a8c87" d="M61.84 20.29 L70.57 24.03 L67.87 33.79 L59.14 30.05Z" />
    <path fill="#8b73c9" d="M22.36 27.35 L29.84 31.09 L27.56 39.19 L20.08 35.25Z" />
    <path fill="#d0a63a" d="M72.03 28.39 L79.51 32.13 L77.43 39.82 L69.95 36.08Z" />
  </g>
  <g stroke="#fbf6e9" stroke-width="0.9" fill="none" opacity="0.5">
    <path d="M41.06 19.66 L58.94 19.45 M50 10.1 L50.62 32.34" />
    <path d="M27.97 28.81 L39.82 23.82 M31.92 18.42 L36.7 33.17" />
    <path d="M59.14 30.05 L70.57 24.03" />
  </g>
  <path class="ln" fill="#fbf6e9" d="M13.64 37.74 C13.64 34.21 17.17 32.44 21.32 32.44 L79.09 32.65 C83.25 32.65 86.57 34.42 86.57 37.95 C86.57 41.48 83.14 43.04 79.09 42.94 L20.91 42.73 C16.75 42.73 13.64 41.27 13.64 37.74Z" />
  <path class="ln t" fill="none" opacity="0.3" d="M23.4 48.75 C35.45 52.29 66.62 52.29 77.01 47.92" />
  <path class="ln t" fill="#b0587c" d="M79.71 31.71 L86.78 35.25 L84.91 42.1 L77.84 38.36Z" />
  <path stroke="#fbf6e9" stroke-width="0.9" fill="none" opacity="0.45" d="M77.84 38.36 L86.78 35.25" />
  <g fill="#c7951f" opacity="0.85">
    <path d="M63.09 9.48 L64.23 12.6 L67.35 13.74 L64.23 14.88 L63.09 18 L61.95 14.88 L58.83 13.74 L61.95 12.6Z" />
    <path d="M32.34 10.94 L33.17 13.22 L35.45 14.05 L33.17 14.88 L32.34 17.17 L31.51 14.88 L29.22 14.05 L31.51 13.22Z" />
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
  <path class="ln" fill="#e2eae7" d="M25.97 30.44 C25.97 47.17 36.33 56.36 50 56.36 C63.67 56.36 74.03 47.17 74.03 30.44Z" />
  <path fill="#e2b94e" d="M29.27 35.16 C31.62 46.94 39.87 54.01 50 54.01 C60.13 54.01 68.38 46.94 70.73 35.16Z" />
  <path class="ln t" fill="none" stroke="#a8862c" d="M29.27 35.16 C36.33 37.75 63.67 37.75 70.73 35.16" />
  <ellipse class="ln" cx="50" cy="30.44" rx="24.03" ry="5.89" fill="#eef4f2" />
  <path class="ln" fill="#e2eae7" d="M46.94 56.36 L53.06 56.36 L54.01 83.46 L45.99 83.46Z" />
  <ellipse class="ln" cx="50" cy="86.99" rx="16.96" ry="5.18" fill="#e2eae7" />
  <path class="ln t" fill="none" stroke="#a9b8b4" opacity="0.8" d="M33.04 34.21 C34.21 44.82 38.69 50.47 44.11 53.06" />
  <circle class="ln" cx="61.31" cy="13.95" r="4.95" fill="#f4f8f6" />
  <path class="ln t" fill="none" stroke="#a9b8b4" d="M58.95 11.83 C59.42 10.42 60.6 9.47 62.25 9.47" />
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
  <path class="ln" fill="#8fc6e0" d="M27.79 23.64 L72.21 23.64 L89.44 41.28 L50 84.67 L10.56 41.28Z" />
  <path class="ln t" fill="#c4e4f2" d="M27.79 23.64 L72.21 23.64 L61 41.28 L39 41.28Z" />
  <path class="ln t" fill="#6fb0d0" d="M10.56 41.28 L27.79 23.64 L39 41.28Z" />
  <path class="ln t" fill="#a8d6ea" d="M72.21 23.64 L89.44 41.28 L61 41.28Z" />
  <path class="ln t" fill="#6aa8c8" d="M10.56 41.28 L39 41.28 L50 84.67Z" />
  <path class="ln t" fill="none" stroke="#fbf6e9" opacity="0.55" d="M39 41.28 L61 41.28 M61 41.28 L50 84.67" />
  <g fill="#e8f4fa">
    <path d="M80.72 14.09 L82.59 18.45 L86.95 20.31 L82.59 22.18 L80.72 26.54 L78.86 22.18 L74.5 20.31 L78.86 18.45Z" />
    <path d="M18.24 63.91 L19.48 67.02 L22.6 68.27 L19.48 69.51 L18.24 72.63 L16.99 69.51 L13.88 68.27 L16.99 67.02Z" transform="translate(11.94 0)" />
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
  <path class="ln" fill="#38332c" d="M31.86 30.68 L35.16 16.54 L42.22 28.09 L45.99 13.01 L50.24 27.15 L54.48 12.77 L58.25 28.32 L65.55 16.31 L68.38 30.68Z" />
  <g class="ln t" fill="#38332c">
    <circle cx="35.16" cy="15.13" r="3.3" /><circle cx="45.99" cy="11.59" r="3.42" />
    <circle cx="54.48" cy="11.36" r="3.3" /><circle cx="65.55" cy="14.89" r="3.42" />
  </g>
  <path class="ln" fill="#453f37" d="M30.44 30.44 L69.56 30.68 L67.67 38.93 L32.33 38.69Z" />
  <path class="ln" fill="#38332c" d="M36.33 38.93 C33.04 53.06 41.05 60.13 40.58 68.14 L59.42 68.38 C58.95 60.13 67.2 53.06 63.67 38.93Z" />
  <path class="ln" fill="#453f37" d="M37.51 68.14 L62.49 68.38 L67.2 82.28 L32.8 82.04Z" />
  <path class="ln" fill="#38332c" d="M26.91 82.28 L73.09 82.52 C76.15 82.52 77.8 84.16 77.8 86.99 C77.8 89.82 75.92 91.7 72.85 91.7 L27.15 91.47 C24.08 91.47 22.2 89.58 22.2 86.76 C22.2 83.93 23.85 82.28 26.91 82.28Z" />
  <path class="ln t" fill="none" stroke="#8a8175" opacity="0.55" d="M41.05 42.46 C38.69 53.06 44.58 60.13 44.58 66.96" />
  <path class="ln t" fill="none" stroke="#8a8175" opacity="0.4" d="M28.32 85.34 C39.87 88.17 60.13 88.41 71.68 85.81" />
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
  <path class="ln" fill="none" stroke="#7a8c5a" style="stroke-width:3.1" d="M53.65 92.93 C51.72 76.83 48.07 61.8 46.35 47.21" />
  <path class="ln" fill="none" stroke="#7a8c5a" style="stroke-width:2.3" d="M46.35 47.21 C45.28 36.05 44.63 25.32 43.99 14.16" />
  <path class="ln t" fill="#8aa06a" d="M49.57 71.03 C42.06 66.53 35.62 67.6 31.54 72.32 C37.34 75.97 45.06 76.19 49.57 71.03Z" />
  <path class="ln t" fill="#8aa06a" d="M50.43 62.02 C57.73 56.65 64.38 57.3 67.81 61.38 C62.45 65.45 54.94 66.53 50.43 62.02Z" />
  <path class="ln t" fill="none" stroke="#6d7d4e" opacity="0.6" d="M49.57 71.03 C44.2 70.39 38.2 71.03 31.54 72.32 M50.43 62.02 C55.8 61.16 62.23 60.95 67.81 61.38" />
  <g class="ln t" stroke="#5d4a94">
    <ellipse cx="49.57" cy="42.7" rx="4.61" ry="5.8" transform="rotate(24 49.57 42.7)" fill="#8b73c9" />
    <ellipse cx="40.34" cy="41.41" rx="4.4" ry="5.58" transform="rotate(-21 40.34 41.41)" fill="#7c62be" />
    <ellipse cx="50.43" cy="36.69" rx="4.51" ry="5.69" transform="rotate(19 50.43 36.69)" fill="#9b85d2" />
    <ellipse cx="39.91" cy="35.62" rx="4.19" ry="5.37" transform="rotate(-25 39.91 35.62)" fill="#8b73c9" />
    <ellipse cx="49.79" cy="31.11" rx="4.29" ry="5.37" transform="rotate(22 49.79 31.11)" fill="#7c62be" />
    <ellipse cx="39.48" cy="30.04" rx="3.97" ry="5.04" transform="rotate(-18 39.48 30.04)" fill="#9b85d2" />
    <ellipse cx="48.93" cy="25.75" rx="3.97" ry="4.94" transform="rotate(26 48.93 25.75)" fill="#8b73c9" />
    <ellipse cx="39.27" cy="24.67" rx="3.76" ry="4.72" transform="rotate(-22 39.27 24.67)" fill="#7c62be" />
    <ellipse cx="48.07" cy="20.81" rx="3.65" ry="4.51" transform="rotate(20 48.07 20.81)" fill="#9b85d2" />
    <ellipse cx="39.7" cy="19.74" rx="3.43" ry="4.29" transform="rotate(-26 39.7 19.74)" fill="#8b73c9" />
    <ellipse cx="46.78" cy="16.09" rx="3.22" ry="3.97" transform="rotate(18 46.78 16.09)" fill="#7c62be" />
    <ellipse cx="40.56" cy="15.23" rx="3" ry="3.76" transform="rotate(-20 40.56 15.23)" fill="#9b85d2" />
    <ellipse cx="43.78" cy="10.72" rx="3.11" ry="3.86" transform="rotate(6 43.78 10.72)" fill="#8b73c9" />
  </g>
  <g class="ln t" stroke="#a68f63" fill="none" style="stroke-width:1.5">
    <path fill="#d3bd91" d="M43.35 77.26 L56.01 74.9 L57.08 80.91 L44.42 83.27Z" />
    <path fill="#d3bd91" d="M56.22 76.19 C62.02 74.04 65.24 71.25 64.6 68.03 C61.8 70.39 59.01 72.75 55.58 74.25Z" />
    <path fill="#d3bd91" d="M56.65 80.05 C62.45 81.34 65.88 84.13 65.45 87.35 C62.45 85.2 59.44 83.27 56.01 82.2Z" />
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
  <g transform="rotate(-5 46.89 55.19)">
    <g class="ln t" stroke="#4a3f36">
      <path fill="#efe6d4" d="M18.45 59.34 L19.28 34.85 Q22.18 31.94 25.09 34.64 L25.5 59.34Z" />
      <ellipse cx="22.18" cy="32.77" rx="3.84" ry="4.46" transform="rotate(-6 22.18 32.77)" fill="#b8382f" />
      <path fill="#efe6d4" d="M27.58 59.34 L28.2 31.52 Q31.11 28.62 34.02 31.32 L34.64 59.34Z" />
      <ellipse cx="31.11" cy="29.45" rx="3.94" ry="4.57" transform="rotate(3 31.11 29.45)" fill="#c0392f" />
      <path fill="#efe6d4" d="M36.71 59.34 L37.13 33.39 Q40.04 30.49 42.94 33.18 L43.15 59.34Z" />
      <ellipse cx="40.04" cy="31.32" rx="3.84" ry="4.46" transform="rotate(-4 40.04 31.32)" fill="#b8382f" />
      <path fill="#efe6d4" d="M54.77 59.34 L55.4 30.9 Q58.3 27.99 61.21 30.69 L61.42 59.34Z" />
      <ellipse cx="58.3" cy="28.83" rx="4.05" ry="4.67" transform="rotate(5 58.3 28.83)" fill="#c0392f" />
      <path fill="#efe6d4" d="M63.91 59.34 L64.53 34.43 Q67.44 31.52 70.34 34.22 L70.55 59.34Z" />
      <ellipse cx="67.44" cy="32.35" rx="3.84" ry="4.46" transform="rotate(-3 67.44 32.35)" fill="#b8382f" />
    </g>
    <g transform="rotate(18 71.8 53.11)">
      <path class="ln t" stroke="#4a3f36" fill="#efe6d4" d="M69.1 55.19 L69.72 26.96 Q72.42 24.05 75.12 26.75 L75.33 55.19Z" />
      <path fill="#3a3530" d="M69.72 30.07 L69.77 26.96 Q72.42 24.05 75.12 26.75 L75.17 29.86Z" />
      <path fill="#e08a2e" stroke="#c8752a" stroke-width="1.1" stroke-linejoin="round" d="M72.42 25.92 C77.61 22.6 78.65 15.75 75.95 9.93 C75.22 15.33 72.21 16.78 70.34 19.79 C68.48 22.81 69.1 25.19 72.42 25.92Z" />
      <path fill="#f2c552" d="M72.63 23.64 C75.43 20.73 75.85 16.16 74.6 12.84 C73.87 16.58 72.01 17.62 71.28 19.69 C70.55 21.77 70.97 23.01 72.63 23.64Z" />
    </g>
    <path class="ln" fill="#3a3530" d="M15.33 57.47 C15.02 55.92 15.95 54.98 17.41 54.77 L75.95 50.42 C77.4 50.31 78.54 51.14 78.75 52.59 L81.66 81.04 C81.87 82.49 80.93 83.53 79.48 83.73 L20.52 88.09 C19.07 88.2 18.03 87.37 17.82 85.91Z" />
    <path fill="#7d7367" d="M19.59 68.48 L77.71 64.12 L78.96 75.12 L20.83 79.27Z" />
    <g fill="#3a3530" opacity="0.45">
      <circle cx="26.13" cy="71.38" r="0.83" /><circle cx="35.05" cy="73.25" r="0.73" /><circle cx="43.77" cy="70.14" r="0.83" />
      <circle cx="52.49" cy="72.63" r="0.73" /><circle cx="61.21" cy="69.51" r="0.83" /><circle cx="69.72" cy="72.01" r="0.73" />
      <circle cx="30.69" cy="76.36" r="0.73" /><circle cx="56.23" cy="75.95" r="0.73" /><circle cx="66.19" cy="75.33" r="0.62" />
    </g>
    <g stroke="#efe6d4" stroke-width="1" opacity="0.4" fill="none" stroke-linecap="round">
      <path d="M29.24 74.5 L40.66 69.1" /><path d="M48.96 74.91 L59.34 69.93" />
    </g>
    <g stroke="#efe6d4" stroke-width="1.5" opacity="0.32" fill="none" stroke-linecap="round">
      <path d="M23.64 59.76 L50 57.89" /><path d="M23.84 63.29 L41.7 62.04" />
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
  <path class="ln" fill="#d3ccbc" d="M45.12 46.39 L54.88 46.39 L55.31 59.98 L44.69 59.98Z" />
  <path class="ln" fill="#ddd6c8" d="M34.07 57.01 C29.4 63.8 26.64 70.17 26 76.97 L74 77.18 C73.36 70.17 70.6 63.8 65.93 57.01 C61.25 61.25 55.73 63.38 50 63.38 C44.27 63.38 38.75 61.25 34.07 57.01Z" />
  <path class="ln t" fill="none" stroke="#a89f8c" opacity="0.7" d="M33.65 63.38 C44.05 70.17 58.07 72.3 70.6 70.81" />
  <path class="ln" fill="#e6e0d2" d="M50 10.29 C61.68 10.29 68.69 19.85 68.69 32.38 C68.69 44.69 61.68 54.67 50 54.67 C38.32 54.67 31.31 44.69 31.31 32.38 C31.31 19.85 38.32 10.29 50 10.29Z" />
  <path class="ln" fill="#cfc8b8" d="M31.53 34.5 C29.19 18.15 38.32 7.96 50 7.96 C61.68 7.96 70.81 18.15 68.47 34.5 C66.99 27.28 64.23 24.09 59.98 25.16 C57.86 19.85 53.61 17.72 50 19.85 C46.39 17.72 42.14 19.85 40.02 25.16 C35.77 24.09 33.01 27.28 31.53 34.5Z" />
  <g class="ln t" fill="none" stroke="#a89f8c" opacity="0.75">
    <path d="M37.9 19.85 C40.02 16.66 43.2 15.39 46.18 16.66" />
    <path d="M53.82 16.66 C56.8 15.39 59.98 16.66 62.1 19.85" />
    <path d="M35.56 28.13 C36.62 25.16 38.75 23.46 41.08 23.88" />
    <path d="M39.81 24.94 C41.93 21.97 45.12 21.33 47.45 23.03" />
    <path d="M52.55 22.82 C54.88 21.12 58.07 21.97 59.98 24.94" />
    <path d="M64.23 28.34 C63.38 25.37 61.25 23.67 58.92 24.09" />
  </g>
  <g class="ln t" fill="#dcd5c6" stroke="#a89f8c" style="stroke-width:1.2">
    <path d="M38.96 33.65 C41.08 30.89 45.54 30.89 47.66 33.65 C45.54 36.2 41.08 36.2 38.96 33.65Z" />
    <path d="M52.34 33.65 C54.46 30.89 58.92 30.89 61.04 33.65 C58.92 36.2 54.46 36.2 52.34 33.65Z" />
  </g>
  <g class="ln t" fill="none" stroke="#a89f8c" style="stroke-width:1.3">
    <path d="M49.79 35.77 L48.73 43.2 C48.73 44.27 51.06 44.69 52.55 43.63" />
    <path style="stroke-width:1.6" stroke="#8e8677" d="M45.12 48.73 C47.66 50 52.34 50 54.88 48.73" />
  </g>
  <g class="ln t" fill="#a8b48c" stroke="#6f7a58">
    <path d="M30.89 26 C26 23.03 21.33 25.16 20.91 30.25 C26 31.95 29.83 30.25 31.53 27.07Z" />
    <path d="M33.65 18.79 C29.83 14.96 25.16 16.45 24.09 21.33 C28.34 23.88 32.38 22.82 34.71 19.85Z" />
    <path d="M39.38 13.26 C36.83 8.59 32.38 7.96 29.4 11.35 C32.38 15.39 35.77 16.45 38.96 14.96Z" />
    <path d="M68.69 27.07 C73.36 23.88 78.03 26 78.24 31.31 C73.36 32.59 69.75 30.89 68.47 28.13Z" />
    <path d="M66.35 19.63 C70.17 16.45 74.84 18.15 75.91 23.03 C71.66 25.16 67.62 23.88 65.5 20.91Z" />
  </g>
  <path class="ln" fill="#cfc8ba" d="M32.59 76.97 L67.41 77.18 L67.41 83.55 L32.59 83.34Z" />
  <path class="ln" fill="#c4bcac" d="M34.71 83.55 L65.29 83.76 L67.41 91.83 L32.59 91.62Z" />
  <path class="ln t" fill="none" stroke="#a89f8c" opacity="0.55" d="M56.8 83.76 L58.92 91.62" />
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
  <path fill="#e2c96a" opacity="0.5" d="M35.7 51.82 L64.3 51.82 L77.92 92.45 L22.08 92.23Z" />
  <path fill="#f0dc94" opacity="0.5" d="M40.24 51.82 L59.76 51.82 L67.48 92.45 L32.52 92.23Z" />
  <path fill="#faf0c4" opacity="0.55" d="M45.91 51.82 L54.09 51.82 L56.36 92.45 L43.64 92.23Z" />
  <path class="ln" fill="#a8d0e0" d="M33.65 29.11 C33.65 17.54 40.24 9.82 50 9.82 C59.76 9.82 66.35 17.54 66.35 29.11 C59.54 25.48 40.46 25.48 33.65 29.11Z" />
  <path class="ln t" fill="#d6ecf4" d="M39.1 24.57 C40.24 18.67 43.64 14.36 48.41 13.22 C45.91 16.4 43.87 20.03 43.19 24.35Z" />
  <path class="ln" fill="#8a939c" d="M13.22 41.37 C13.22 32.52 29.57 25.71 50 25.71 C70.43 25.71 86.78 32.52 86.78 41.37 C86.78 48.41 70.43 54.09 50 54.09 C29.57 54.09 13.22 48.41 13.22 41.37Z" />
  <path class="ln t" fill="#b4bcc4" d="M18.9 36.83 C25.71 32.29 36.83 29.57 50 29.57 C63.17 29.57 74.29 32.29 81.1 36.83 C74.29 40.24 63.17 42.51 50 42.51 C36.83 42.51 25.71 40.24 18.9 36.83Z" />
  <g class="ln t" stroke="#4a443b">
    <circle cx="27.75" cy="48.41" r="3.52" fill="#e2b94e" />
    <circle cx="42.51" cy="51.59" r="3.63" fill="#b8382f" />
    <circle cx="57.95" cy="51.82" r="3.52" fill="#e2b94e" />
    <circle cx="72.25" cy="48.18" r="3.63" fill="#b8382f" />
  </g>
  <g class="ln t" fill="none" stroke="#c9b46a" opacity="0.8">
    <path d="M42.51 76.79 L47.28 74.29" /><path d="M54.09 67.48 L58.4 65.44" /><path d="M45.01 60.9 L48.18 59.54" />
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
  <path class="ln" fill="#dcc39a" d="M26 37.87 L19.81 14.39 L44.06 27.55Z" />
  <path class="ln" fill="#dcc39a" d="M75.03 36.32 L83.03 13.35 L58.26 26Z" />
  <path class="ln t" fill="#d99aa8" d="M28.84 33.23 L26 20.32 L38.9 27.55Z" />
  <path class="ln t" fill="#d99aa8" d="M72.45 31.94 L76.84 19.81 L64.19 26Z" />
  <path class="ln" fill="#dcc39a" d="M50 23.68 C68.58 23.68 81.74 37.1 81.74 55.68 C81.74 74 68.84 86.9 50 86.9 C31.16 86.9 18.26 74 18.26 55.68 C18.26 37.1 31.42 23.68 50 23.68Z" />
  <g class="ln t" fill="none" opacity="0.5">
    <path d="M27.55 62.13 L10.77 59.55" /><path d="M28.58 68.84 L13.35 72.45" />
    <path d="M72.45 62.39 L89.23 60.32" /><path d="M71.42 69.1 L86.65 73.23" />
  </g>
  <path class="ln t" fill="#2b2722" d="M31.42 55.68 C34 48.19 42.26 47.94 45.1 55.68 C42.26 62.13 34 62.13 31.42 55.68Z" />
  <path class="ln t" fill="#2b2722" d="M54.9 55.94 C57.74 48.19 66 48.45 68.58 55.94 C66 62.39 57.74 62.13 54.9 55.94Z" />
  <circle cx="40.45" cy="53.1" r="2.19" fill="#f6efe2" />
  <circle cx="64.71" cy="53.35" r="2.06" fill="#f6efe2" />
  <path class="ln t" fill="#d99aa8" d="M45.61 66.26 L54.39 66.26 L50 71.42Z" />
  <path class="ln t" fill="none" d="M50 71.42 L50 74 C50 76.58 47.16 77.35 45.35 75.29 M50 74 C50 76.58 53.1 77.61 54.9 75.55" />
  <g transform="rotate(-7 50 29.35)">
    <path class="ln t" stroke="#8a6a1c" fill="#c7951f" d="M33.74 37.1 L36.58 24.97 L43.55 33.23 L50 21.1 L56.45 33.23 L63.42 24.71 L66.26 37.35 C59.03 34 40.97 34 33.74 37.1Z" />
    <circle cx="36.58" cy="23.42" r="2.45" fill="#d98aa8" stroke="#8a6a1c" stroke-width="1" />
    <circle cx="50" cy="19.55" r="2.71" fill="#8ea8d8" stroke="#8a6a1c" stroke-width="1" />
    <circle cx="63.42" cy="23.16" r="2.32" fill="#d98aa8" stroke="#8a6a1c" stroke-width="1" />
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
  // Only the PLAYABLE guests are here. All ten editable originals live in
  // stickers/guests/; sync_guests.py embeds the live set below without runtime fetches.
  // The parked originals can be viewed on scripts/stickers/guest-stickers.html.
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
<path d="M13.27 22.93 Q10.37 22.93 10.37 26.8 L10.85 75.13 Q10.85 78.03 14.23 78.03 L86.73 77.55 Q89.63 77.55 89.63 74.17 L89.25 25.83 Q89.25 22.45 85.77 22.45Z" fill="#c9bfd0" stroke="#2b2722" stroke-width="2.3" />
<path d="M12.3 72.72 Q45.17 75.13 88.18 72.43 L88.18 74.65 Q88.18 76.1 85.77 76.1 L14.23 76.58 Q12.3 76.58 12.3 74.17Z" fill="#b8acbf" stroke="#302d27" stroke-width="0" />
<path d="M16.94 28.83 L46.33 28.06 L46.62 31.34 L17.23 32.12Z" fill="#564b60" stroke="#302d27" stroke-width="0" />
<path d="M49.71 27.96 L73.59 27.38 L73.88 30.67 L50 31.25Z" fill="#564b60" stroke="#302d27" stroke-width="0" />
<path d="M16.75 36.18 L83.25 35.21" fill="none" stroke="#807688" stroke-width="1.05" />
<path d="M16.65 40.33 L37.92 39.85 L38.59 69.82 L17.04 70.3Z" fill="#ece7e5" stroke="#2b2722" stroke-width="1.39" />
<path d="M27.77 50.39 C24.38 44.59 19.55 44.3 19.36 49.81 C19.26 53.96 22.74 55.51 26.9 55.99 C22.45 56.77 20.13 60.34 21.87 62.86 C23.42 64.98 26.51 63.15 27.48 58.99Z" fill="#8a719b" stroke="#2b2722" stroke-width="1.12" />
<path d="M28.64 50.39 C32.31 44.1 37.24 45.07 36.76 50.48 C36.47 54.35 32.79 55.7 29.22 55.99 C33.86 56.67 36.18 59.96 34.34 62.28 C32.7 64.4 29.8 62.57 28.83 58.8Z" fill="#8a719b" stroke="#2b2722" stroke-width="1.12" />
<path d="M26.41 50.19 C24.19 47.2 21.58 47 21.39 49.9 C21.29 52.32 23.8 53.58 26.32 53.96Z" fill="#a992bb" stroke="#302d27" stroke-width="0" />
<path d="M30.09 50 C32.31 46.71 34.92 46.81 34.92 49.81 C34.92 52.22 32.41 53.48 29.89 53.87Z" fill="#a992bb" stroke="#302d27" stroke-width="0" />
<path d="M28.15 48.74 C29.22 52.32 29.22 57.25 28.06 61.21 C27.09 57.25 27.09 52.32 28.15 48.74Z" fill="#3d3348" stroke="#302d27" stroke-width="0" />
<path d="M27.96 49.23 Q26.32 46.13 24.96 45.55" fill="none" stroke="#2b2722" stroke-width="0.767" />
<path d="M28.64 49.23 Q29.99 46.42 31.54 46.04" fill="none" stroke="#2b2722" stroke-width="0.767" />
<path d="M45.17 43.23 L81.9 42.65" fill="none" stroke="#49434b" stroke-width="1.4" />
<path d="M45.17 50.48 L77.26 50" fill="none" stroke="#49434b" stroke-width="1.4" />
<path d="M45.17 57.73 L70.78 57.35" fill="none" stroke="#49434b" stroke-width="1.4" />
<path d="M45.17 68.37 L53.38 68.17" fill="none" stroke="#49434b" stroke-width="1.4" />
<ellipse cx="65.47" cy="68.37" rx="0.58" ry="0.58" fill="#49434b" stroke="#302d27" stroke-width="0" />
<ellipse cx="71.27" cy="68.37" rx="0.58" ry="0.58" fill="#49434b" stroke="#302d27" stroke-width="0" />
<ellipse cx="77.07" cy="68.37" rx="0.58" ry="0.58" fill="#49434b" stroke="#302d27" stroke-width="0" />
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
<path d="M11.38 77.03 C18.14 70.28 26.83 65.45 38.41 62.55 C56.76 57.72 78 53.86 87.66 59.66 C101.17 68.34 78.97 82.83 55.79 86.69 C37.45 90.55 13.31 87.66 9.45 82.83 Q7.52 79.93 11.38 77.03Z" fill="#403d35" stroke="#2b2722" stroke-width="2.3" />
<path d="M10.41 80.9 C31.66 86.69 59.66 82.83 78 73.17 C83.79 70.28 88.62 67.38 90.55 62.55 C95.38 70.28 78 80.9 56.76 85.72 C34.55 89.59 16.21 85.72 10.41 82.83Z" fill="#32312b" stroke="#302d27" stroke-width="0" />
<path d="M31.66 67.38 C29.72 61.59 33.59 53.86 34.55 46.14 C35.52 41.31 34.55 34.55 39.38 30.69 C44.21 26.83 46.14 19.1 50 14.28 C54.83 7.52 59.66 9.45 63.52 13.31 L75.1 19.1 Q78 20.07 82.83 17.17 C86.69 15.24 84.76 21.03 79.93 24.9 Q76.07 27.79 73.17 25.86 L68.34 22.97 C68.34 27.79 64.48 30.69 64.48 33.59 C64.48 36.48 68.34 40.34 66.41 44.21 C65.45 47.1 64.48 48.07 65.45 51.93 L69.31 64.48 C58.69 72.21 42.28 73.17 31.66 67.38Z" fill="#403e35" stroke="#2b2722" stroke-width="2.3" />
<path d="M54.83 12.34 C49.03 22 50 25.86 44.21 31.66 C38.41 37.45 40.34 42.28 37.45 50 C35.52 55.79 35.52 61.59 33.59 65.45 C30.69 57.72 35.52 46.14 35.52 40.34 C34.55 33.59 43.24 29.72 46.14 22 Q50.97 11.38 54.83 12.34Z" fill="#4e4a40" stroke="#302d27" stroke-width="0" />
<path d="M60.62 18.14 C61.59 25.86 65.45 26.83 62.55 32.62 C59.66 37.45 64.48 41.31 62.55 46.14 Q59.66 56.76 64.48 65.45 L68.34 64.48 C64.48 53.86 64.48 50 66.41 44.21 C68.34 39.38 61.59 37.45 64.48 32.62 Q68.34 25.86 66.41 23.93Z" fill="#34322c" stroke="#302d27" stroke-width="0" />
<path d="M58.69 19.1 Q61.59 22 61.59 26.83" fill="none" stroke="#5d5649" stroke-width="1.14" />
<path d="M63.52 29.72 Q58.69 33.59 61.59 37.45" fill="none" stroke="#5d5649" stroke-width="1.14" />
<path d="M39.38 55.79 Q44.21 53.86 47.1 55.79" fill="none" stroke="#5d5649" stroke-width="1.14" />
<path d="M35.52 60.62 Q41.31 64.48 47.1 63.52" fill="none" stroke="#5d5649" stroke-width="1.14" />
<path d="M17.17 79.93 Q26.83 82.83 36.48 81.86" fill="none" stroke="#5d5649" stroke-width="1.14" />
<path d="M72.21 77.03 Q81.86 73.17 85.72 68.34" fill="none" stroke="#5d5649" stroke-width="1.14" />
<path d="M32.04 62.55 C41.31 66.41 53.86 65.45 64.48 60.62 L66.9 67.38 C55.79 73.17 42.28 74.14 30.69 70.28 Q29.24 67.38 32.04 62.55Z" fill="#c99486" stroke="#2b2722" stroke-width="1.4" />
<path d="M30.69 68.34 C42.28 72.21 54.83 69.31 65.45 65.45 L66.41 68.34 C53.86 74.14 40.34 74.14 30.69 71.24Z" fill="#b67f74" stroke="#302d27" stroke-width="0" />
<path d="M59.66 69.31 C61.59 77.03 67.38 82.83 69.31 91.52 L73.17 88.62 L78.97 90.55 C73.17 78.97 69.31 73.17 63.52 67.38Z" fill="#ce9687" stroke="#2b2722" stroke-width="1.4" />
<path d="M62.55 70.28 C69.31 71.24 76.07 77.03 82.83 83.79 L77.03 84.76 L78.97 88.62 C72.21 86.69 67.38 79.93 61.59 73.17Z" fill="#c38c80" stroke="#2b2722" stroke-width="1.4" />
<path d="M61.59 68.34 C55.79 63.52 50.97 63.52 50 69.31 C48.07 74.14 50.97 78 54.83 77.03 Q60.62 75.1 63.52 70.28Z" fill="#d7a295" stroke="#2b2722" stroke-width="1.4" />
<path d="M62.55 67.38 C67.38 57.72 72.21 61.59 72.21 66.41 C72.21 70.28 68.34 71.24 63.52 71.24Z" fill="#cd9487" stroke="#2b2722" stroke-width="1.4" />
<path d="M60.62 65.45 C64.48 63.52 67.38 68.34 65.45 72.21 Q61.59 74.14 59.66 71.24Z" fill="#dba89a" stroke="#2b2722" stroke-width="1.4" />
<path d="M60.62 69.31 Q55.79 68.34 53.86 73.17" fill="none" stroke="#835f54" stroke-width="1" />
<path d="M66.41 67.38 Q68.34 64.48 69.31 64.48" fill="none" stroke="#835f54" stroke-width="1" />
<path d="M65.45 75.1 Q69.31 81.86 71.24 86.69" fill="none" stroke="#835f54" stroke-width="1" />
<path d="M33.59 66.41 Q43.24 69.31 52.9 66.41" fill="none" stroke="#835f54" stroke-width="1" />
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
<path d="M48 10 C34 6 23 17 21 30 C18 41 17 56 15 70 C13 82 16 89 25 90 L29 90 L26 87 Q32 91 37 89 Q28 82 29 72 L31 41 L67 41 L69 73 Q69 83 62 89 Q68 91 73 87 L71 91 C83 92 87 83 84 71 C82 56 81 40 78 29 C75 15 64 6 52 10 Q50 11 48 10Z" fill="#e4c17e" stroke="#2b2722" stroke-width="2.3" />
<path d="M28 20 C19 38 23 60 20 74 Q18 86 25 89 C14 87 16 77 18 65 L21 35 Q22 26 28 20Z" fill="#c9a367" stroke="#302d27" stroke-width="0" />
<path d="M66 16 C76 28 74 44 76 61 C76 74 80 83 73 89 Q86 87 82 70 L78 33 Q75 20 66 16Z" fill="#c7a167" stroke="#302d27" stroke-width="0" />
<path d="M31 32 C30 46 28 57 27 70 C26 78 27 82 30 86 C25 82 24 75 25 67 Q28 41 31 32Z" fill="#efcf8e" stroke="#302d27" stroke-width="0" />
<path d="M69 38 Q72 58 72 72 Q73 80 69 85 C76 83 75 71 74 61Z" fill="#efd093" stroke="#302d27" stroke-width="0" />
<path d="M29 41 C29 29 33 19 42 16 Q48 13 51 16 C60 14 68 26 69 41 L64.8 41 L64.5 38.5 L64 41 L59.3 41 L58.9 37 L58.5 41 L53.5 41 L53 38 L52.5 41 L48 41 L47.5 38 L47 41 L42.8 40.8 L42.3 37.5 L41.7 41 L37.3 40.8 L36.8 38 L36.2 41Z" fill="#e8c885" stroke="#302d27" stroke-width="0" />
<path d="M29 41 L36.2 41 L36.8 38 L37.3 40.8 L41.7 41 L42.3 37.5 L42.8 40.8 L47 41 L47.5 38 L48 41 L52.5 41 L53 38 L53.5 41 L58.5 41 L58.9 37 L59.3 41 L64 41 L64.5 38.5 L64.8 41 L69 41" fill="none" stroke="#4b422e" stroke-width="1.01" />
<path d="M29 40 C29 32 31 26 34 23" fill="none" stroke="#4b422e" stroke-width="1.01" />
<path d="M35 40 Q33 32 37 25" fill="none" stroke="#4b422e" stroke-width="1.01" />
<path d="M41 39 Q39 29 42 23" fill="none" stroke="#4b422e" stroke-width="1.01" />
<path d="M47 40 Q45 30 46 25" fill="none" stroke="#4b422e" stroke-width="1.01" />
<path d="M53 40 Q53 30 51 25" fill="none" stroke="#4b422e" stroke-width="1.01" />
<path d="M59 40 Q60 31 56 24" fill="none" stroke="#4b422e" stroke-width="1.01" />
<path d="M65 39 Q66 29 60 22" fill="none" stroke="#4b422e" stroke-width="1.01" />
<path d="M34 19 Q40 14 47 15" fill="none" stroke="#4b422e" stroke-width="1.01" />
<path d="M52 14 Q60 13 66 20" fill="none" stroke="#4b422e" stroke-width="1.01" />
<path d="M25 33 C22 45 24 53 22 67 Q19 81 25 86" fill="none" stroke="#4b422e" stroke-width="1.01" />
<path d="M27 47 C28 58 22 76 28 84" fill="none" stroke="#4b422e" stroke-width="1.01" />
<path d="M30 77 Q31 83 35 86" fill="none" stroke="#4b422e" stroke-width="1.01" />
<path d="M20 43 C18.5 55 20 65 18 77" fill="none" stroke="#4b422e" stroke-width="1.01" />
<path d="M29 45 C28.5 59 26.5 71 29.5 81" fill="none" stroke="#4b422e" stroke-width="1.01" />
<path d="M78 43 C80 55 78.5 65 80.5 77" fill="none" stroke="#4b422e" stroke-width="1.01" />
<path d="M69.5 46 C70 59 72 71 69 81" fill="none" stroke="#4b422e" stroke-width="1.01" />
<path d="M73 34 C76 47 73 57 77 71 Q80 83 74 87" fill="none" stroke="#4b422e" stroke-width="1.01" />
<path d="M71 49 C70 62 78 78 71 85" fill="none" stroke="#4b422e" stroke-width="1.01" />
<path d="M68 78 Q68 83 65 86" fill="none" stroke="#4b422e" stroke-width="1.01" />
<path d="M30 26 Q28 34 28 37" fill="none" stroke="#f4dba2" stroke-width="1.34" />
<path d="M39 19 Q43 17 46 17" fill="none" stroke="#f4dba2" stroke-width="1.34" />
<path d="M19 74 Q18 81 21 84" fill="none" stroke="#f4dba2" stroke-width="1.34" />
<path d="M79 76 Q81 81 78 85" fill="none" stroke="#f4dba2" stroke-width="1.34" />
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
<path d="M49.05 12.81 C36.65 6.14 26.16 14.72 22.35 25.21 C16.63 38.56 19.49 44.28 15.67 54.77 C10.91 66.21 17.58 73.84 12.81 82.42 L9.95 85.28 Q15.67 87.19 21.4 83.37 L18.53 89.09 Q25.21 90.05 29.98 85.28 L28.07 90.05 C39.51 88.14 42.37 79.56 38.56 70.98 C35.7 61.44 30.93 57.63 34.74 47.14 C38.56 38.56 36.65 30.93 43.33 28.07 Q47.14 27.12 49.05 29.02 Q53.81 26.16 57.63 29.02 C63.35 32.84 61.44 39.51 66.21 48.09 C70.02 57.63 62.4 64.3 63.35 73.84 Q61.44 85.28 72.88 89.09 L71.93 85.28 Q77.65 90.05 84.33 87.19 L79.56 83.37 Q86.23 86.23 90.05 83.37 C79.56 78.6 86.23 71.93 82.42 61.44 C78.6 51.91 77.65 47.14 78.6 39.51 C78.6 23.3 67.16 6.14 52.86 11.86 Q50.95 12.81 49.05 12.81Z" fill="#34352f" stroke="#2b2722" stroke-width="2.3" />
<path d="M29.02 20.44 C23.3 35.7 26.16 43.33 21.4 54.77 C15.67 67.16 25.21 76.7 17.58 83.37 C29.98 75.74 19.49 67.16 25.21 54.77 C30.93 42.37 27.12 33.79 32.84 23.3Z" fill="#49483d" stroke="#302d27" stroke-width="0" />
<path d="M35.7 46.19 C28.07 58.58 36.65 67.16 35.7 75.74 Q35.7 84.33 29.02 87.19 C43.33 83.37 37.6 73.84 35.7 67.16 Q30.93 56.67 35.7 46.19Z" fill="#262a26" stroke="#302d27" stroke-width="0" />
<path d="M65.26 22.35 C73.84 34.74 67.16 41.42 74.79 55.72 C82.42 69.07 74.79 75.74 82.42 82.42 C70.02 78.6 76.7 68.12 70.02 56.67 C63.35 45.23 69.07 36.65 61.44 26.16Z" fill="#47473c" stroke="#302d27" stroke-width="0" />
<path d="M68.12 50 C73.84 62.4 62.4 70.02 67.16 79.56 Q69.07 85.28 73.84 87.19 C60.49 83.37 66.21 70.98 66.21 65.26 Q70.02 56.67 68.12 50Z" fill="#262a26" stroke="#302d27" stroke-width="0" />
<path d="M23.3 28.07 C28.07 14.72 38.56 9.95 49.05 15.67 C58.58 9 70.98 17.58 75.74 29.98 L69.07 24.26 L71.93 30.93 L64.3 24.26 L67.16 31.88 L60.49 26.16 L63.35 33.79 L57.63 28.07 Q54.77 25.21 50.95 28.07 L49.05 29.02 L46.19 27.12 L40.47 28.07 L35.7 33.79 L38.56 26.16 L31.88 30.93 L33.79 25.21 L27.12 30.93 L29.98 24.26Z" fill="#b5c653" stroke="#302d27" stroke-width="0" />
<path d="M26.16 24.26 C31.88 16.63 41.42 13.77 47.14 17.58 Q38.56 14.72 29.98 23.3 L32.84 20.44Z" fill="#d1d775" stroke="#302d27" stroke-width="0" />
<path d="M52.86 16.63 Q63.35 11.86 71.93 23.3 Q61.44 16.63 53.81 18.53Z" fill="#d1d775" stroke="#302d27" stroke-width="0" />
<path d="M27.12 26.16 C31.88 18.53 39.51 14.34 48.09 15.1" fill="none" stroke="#6f8d2c" stroke-width="1.03" />
<path d="M30.93 29.02 C35.7 21.97 41.99 18.34 49.43 18.73" fill="none" stroke="#6f8d2c" stroke-width="1.03" />
<path d="M50.57 15.29 C58.58 14.72 65.26 18.92 69.45 25.78" fill="none" stroke="#6f8d2c" stroke-width="1.03" />
<path d="M49.62 18.92 C56.67 18.92 62.4 22.35 66.21 29.02" fill="none" stroke="#6f8d2c" stroke-width="1.03" />
<path d="M36.65 31.88 Q37.22 26.16 39.51 22.73" fill="none" stroke="#6f8d2c" stroke-width="1.03" />
<path d="M60.49 30.93 Q60.11 25.59 57.63 22.16" fill="none" stroke="#6f8d2c" stroke-width="1.03" />
<path d="M24.26 32.84 C22.35 43.33 24.26 45.23 19.49 56.67 C16.63 67.16 23.3 74.79 18.53 81.47" fill="none" stroke="#202620" stroke-width="1.12" />
<path d="M29.02 34.74 C28.07 46.19 26.16 48.09 24.26 56.67 C21.4 68.12 30.93 76.7 25.21 84.33" fill="none" stroke="#202620" stroke-width="1.12" />
<path d="M32.84 48.09 C27.12 61.44 37.6 72.88 31.88 82.42" fill="none" stroke="#202620" stroke-width="1.12" />
<path d="M17.58 67.16 Q16.63 73.84 18.53 76.7" fill="none" stroke="#202620" stroke-width="1.12" />
<path d="M74.79 32.84 C75.74 45.23 70.98 45.23 76.7 57.63 C80.51 66.21 75.74 74.79 80.51 80.51" fill="none" stroke="#202620" stroke-width="1.12" />
<path d="M68.12 41.42 C68.12 50.95 77.65 57.63 72.88 67.16 Q70.02 76.7 75.74 83.37" fill="none" stroke="#202620" stroke-width="1.12" />
<path d="M69.07 67.16 Q64.3 78.6 70.98 84.33" fill="none" stroke="#202620" stroke-width="1.12" />
<path d="M28.07 78.6 Q28.07 83.37 24.26 86.23" fill="none" stroke="#202620" stroke-width="1.12" />
<path d="M26.16 37.6 Q25.21 46.19 22.35 50.95" fill="none" stroke="#7d7a69" stroke-width="1.03" />
<path d="M26.16 63.35 Q26.16 70.98 29.02 74.79" fill="none" stroke="#7d7a69" stroke-width="1.03" />
<path d="M73.84 49.05 Q76.7 54.77 77.65 59.53" fill="none" stroke="#7d7a69" stroke-width="1.03" />
<path d="M73.84 73.84 Q73.84 77.65 76.7 79.56" fill="none" stroke="#7d7a69" stroke-width="1.03" />
</g>
</svg>`,
  },
  {
    id: "boots",
    name: "Cowboy boots",
    sub: "a little country",
    how: "Answer the page for dance with cowboy like me",
    hint: "A dance can be a dangerous thing.",
    era: "Taylor Swift",
    art: `<svg class="stick" viewBox="0 0 100 100">
  <path class="ln" fill="#a87e42" d="M29.7 73.3 L42 73.3 L39.8 83.8 L31.3 83.8 Z"/>
  <path class="ln t" fill="none" stroke="#7a5228" d="M31.1 81.3 L40.2 81.3"/>
  <path class="ln" fill="#c99a5c" d="M27.6 11 C34.6 9.1 45.7 7.8 54.4 9.1 L40.8 21 Z"/>
  <path class="ln" fill="#5e928d" d="M27.6 11 C32.2 12.6 36.9 16 40.8 21 C43.9 15.8 48.9 11.5 54.4 9.1 C53.1 22.8 51.8 35.8 51.5 49.3 C55.5 55.5 62.9 59.2 70.7 62.2 C77.7 64.8 85.1 67 91.2 70.3 Q89.6 73.9 84.2 73.9 L30.2 73.9 C28.4 67.8 29.3 59.8 31.3 53 C30.4 39.5 28.9 25.6 27.6 11 Z"/>
  <path fill="#7fb3ad" d="M31.9 16.9 C32.8 27.4 33.5 38.5 34.1 48.2 C35 48.3 36.1 48.3 37.1 48.2 C36.1 38.5 35.6 27.4 35.2 17.8 Z"/>
  <path fill="#7fb3ad" d="M73.1 63.9 C78.5 65.5 83.5 67.2 87.9 69.2 C84 68.9 78.5 67.4 73.1 63.9 Z"/>
  <path class="ln t" fill="none" d="M31.3 53.9 C38.3 50.9 45.2 53 51.7 49.6"/>
  <path class="ln t" fill="none" d="M68.5 61.5 C71.8 65 72.9 69.4 72 73.9"/>
  <path class="ln h" fill="#c99a5c" d="M40.8 73.3 L84.2 73.3 Q89.6 73.3 91.2 70.3 L92.7 72.4 Q90.7 76.8 84.2 76.8 L40.8 76.8 Z"/>
  <path class="ln t" fill="#c0392f" d="M79.8 71.5 C72 72.9 62.8 72.7 54.1 71.3 C59.1 70.5 63.1 69.8 65.9 68.7 C61.3 68.1 57.2 66.5 54.3 64.2 C60 65 64.6 65.4 68.3 65.5 C65.2 64.1 61.5 62.2 59.1 60.2 C64.6 60.7 71.1 62.9 76.3 65.5 C79.4 67.2 81.1 69.6 79.8 71.5 Z"/>
  <path fill="#dd6a4c" d="M77.2 70.3 C71.8 71.3 66.1 71.1 61.1 70.3 C64.6 69.6 67.4 68.9 69.2 67.9 C66.1 67.2 63.9 66.3 62.4 65.4 C66.5 65.7 70.7 66.5 74 67.8 C76.3 68.5 77.7 69.4 77.2 70.3 Z"/>
  <path class="ln" fill="#c0392f" d="M43.7 47.4 C32.6 40.8 31.9 30.8 37.1 29.1 C40.4 28.2 42.8 30 43.9 33.4 C45.2 29.8 47.6 28.2 50.7 29.1 C55.7 30.8 54.8 40.9 43.7 47.4 Z"/>
  <path fill="none" stroke="#dd6a4c" stroke-width="1.6" stroke-linecap="round" d="M37.8 31.5 C39.1 30.6 40.6 30.8 41.3 32.1"/>
  <path class="ln t" fill="#e3d6bd" d="M32.6 39.1 L28.2 42.2 L30.8 43.3 L29.3 45.9 L35.6 43.7 Z"/>
  <path class="ln t" fill="#e3d6bd" d="M55 36.7 L59.6 39.1 L57 40.4 L58.7 42.8 L52.2 41.1 Z"/>
  <path class="ln t" fill="#f6efe2" d="M31 35.9 C38.7 34.3 47.4 33.4 56.7 33.4 L56.8 38.7 C47.6 38.7 39.1 39.6 31.7 41.5 Z"/>
  <path class="ln t" fill="none" d="M35.4 38.2 C36.3 36.9 37.1 36.7 37.4 37.8 C37.8 38.5 38.7 37.1 39.6 36.3 C39.8 37.6 40.6 38.3 41.5 37.2 C42 36.5 42.8 36.9 43.2 37.6"/>
  <path class="ln" fill="#a87e42" d="M13 81.3 L25.4 81.3 L23.2 91.8 L14.7 91.8 Z"/>
  <path class="ln t" fill="none" stroke="#7a5228" d="M14.5 89.2 L23.6 89.2"/>
  <path class="ln" fill="#c99a5c" d="M11 18.9 C18 17.1 29.1 15.8 37.8 17.1 L24.1 28.9 Z"/>
  <path class="ln" fill="#7fb3ad" d="M11 18.9 C15.6 20.6 20.2 23.9 24.1 28.9 C27.3 23.7 32.2 19.5 37.8 17.1 C36.5 30.8 35.2 43.7 34.8 57.2 C38.9 63.5 46.3 67.2 54.1 70.2 C61.1 72.7 68.5 75 74.6 78.3 Q72.9 81.8 67.6 81.8 L13.6 81.8 C11.7 75.7 12.6 67.8 14.7 60.9 C13.8 47.4 12.3 33.5 11 18.9 Z"/>
  <path fill="#a9cdc6" d="M15.2 24.8 C16.2 35.4 16.9 46.5 17.4 56.1 C18.4 56.3 19.5 56.3 20.4 56.1 C19.5 46.5 18.9 35.4 18.6 25.8 Z"/>
  <path fill="#a9cdc6" d="M56.5 71.8 C61.8 73.5 66.8 75.2 71.3 77.2 C67.4 76.8 61.8 75.3 56.5 71.8 Z"/>
  <path class="ln t" fill="none" d="M14.7 61.8 C21.7 58.9 28.5 60.9 35 57.6"/>
  <path class="ln t" fill="none" d="M51.8 69.4 C55.2 72.9 56.3 77.4 55.4 81.8"/>
  <path class="ln h" fill="#c99a5c" d="M24.1 81.3 L67.6 81.3 Q72.9 81.3 74.6 78.3 L76.1 80.3 Q74 84.8 67.6 84.8 L24.1 84.8 Z"/>
  <path class="ln t" fill="#c0392f" d="M63.1 79.4 C55.4 80.9 46.1 80.7 37.4 79.2 C42.4 78.5 46.5 77.7 49.3 76.6 C44.6 76.1 40.6 74.4 37.6 72.2 C43.3 72.9 48 73.3 51.7 73.5 C48.5 72 44.8 70.2 42.4 68.1 C48 68.7 54.4 70.9 59.6 73.5 C62.8 75.2 64.4 77.6 63.1 79.4 Z"/>
  <path fill="#dd6a4c" d="M60.5 78.3 C55.2 79.2 49.4 79 44.5 78.3 C48 77.6 50.7 76.8 52.6 75.9 C49.4 75.2 47.2 74.2 45.7 73.3 C49.8 73.7 54.1 74.4 57.4 75.7 C59.6 76.4 61.1 77.4 60.5 78.3 Z"/>
  <path class="ln" fill="#c0392f" d="M23.9 55.4 C12.8 48.7 12.1 38.7 17.3 37.1 C20.6 36.1 23 38 24.1 41.3 C25.4 37.8 27.8 36.1 31 37.1 C35.9 38.7 35 48.9 23.9 55.4 Z"/>
  <path fill="none" stroke="#dd6a4c" stroke-width="1.6" stroke-linecap="round" d="M18 39.5 C19.3 38.5 20.8 38.7 21.5 40"/>
  <path class="ln t" fill="#e3d6bd" d="M12.8 47 L8.4 50.2 L11 51.3 L9.5 53.9 L15.8 51.7 Z"/>
  <path class="ln t" fill="#e3d6bd" d="M35.2 44.6 L39.8 47 L37.2 48.3 L38.9 50.7 L32.4 49.1 Z"/>
  <path class="ln t" fill="#f6efe2" d="M11.2 43.9 C18.9 42.2 27.6 41.3 36.9 41.3 L37.1 46.7 C27.8 46.7 19.3 47.6 11.9 49.4 Z"/>
  <path class="ln t" fill="none" d="M15.4 46.3 C16.2 44.6 16.9 44.3 17.3 45.7 C17.6 46.9 18.6 44.8 19.3 44.1 C19.5 45.6 20.2 46.7 21.1 45.2 C21.7 44.3 22.3 44.6 22.6 45.6 C23.2 46.5 24.1 45 24.8 43.9 C25 45.4 25.8 46.1 26.7 45 C27.4 44.1 28 44.5 28.4 45.2 C28.9 46.1 30 45.4 31.5 44.5"/>
</svg>`,
  },
  {
    id: "pegacorn",
    name: "Pegacorn",
    sub: "a little magic",
    how: "Name Enchanted and Starlight in one sitting",
    hint: "Two kinds of magic in one sitting.",
    era: "Whimsy",
    art: `<svg class="stick" viewBox="0 0 100 100">
  <path class="ln" fill="#c48292" d="M37.6 63.2 C37.6 64.5 37.7 68.4 37.8 70.9 C37.9 73.3 38.1 75.6 38.2 77.7 C38.4 79.8 38.9 81.8 38.9 83.4 C38.9 85.2 38.4 87.2 38.3 87.9 L42.9 88.1 C42.9 87.4 42.7 85.2 42.7 83.4 C42.6 81.6 42.5 79.7 42.6 77.7 C42.7 75.6 43.2 73.5 43.5 71.1 C43.8 68.8 44.3 64.8 44.5 63.6 Z"/>
  <path class="ln t" fill="#b0587c" d="M38.2 87.8 L43.1 87.8 L43.8 91.9 L37.7 91.9 Z"/>
  <path class="ln" fill="#c48292" d="M62.8 64.5 C63.3 65.6 65 68.8 65.8 70.7 C66.4 72.6 67.2 73.9 67.2 75.6 C67.2 77.4 66.3 79.1 66 81.2 C65.7 83.3 65.3 86.7 65.1 87.8 L69.7 88.2 C69.7 87.2 69.6 83.9 70 81.9 C70.3 79.8 71.5 78 71.8 76 C72.1 73.9 71.9 71.7 71.7 69.4 C71.6 67.1 71 63.4 70.8 62.2 Z"/>
  <path class="ln t" fill="#b0587c" d="M65 87.8 L69.9 87.8 L70.5 91.9 L64.4 91.9 Z"/>
  <path class="ln" fill="#c0392f" d="M74 54.8 C74.7 55.1 77.2 55.8 78.4 56.8 C79.5 57.8 80.3 59.1 80.9 60.7 C81.3 62.4 81.7 64.4 81.5 66.8 C81.4 69.1 80 72.2 80 74.8 C80 77.5 80.6 80.9 81.7 83 C82.8 85.1 85.9 86.8 86.7 87.6 C87.5 88.5 89.3 87.1 88.6 86.2 C88.2 85.4 86.6 83.1 86.3 81.2 C86 79.5 86.3 77.9 86.9 75.6 C87.5 73.3 89.6 70.6 89.9 67.6 C90.3 64.6 90.3 60.5 89.1 57.6 C87.9 54.7 85.2 51.3 82.8 50.1 C80.4 48.8 76.2 49.9 74.9 49.8 Z"/>
  <path fill="#d0a63a" d="M74.3 53.3 C75.1 53.5 78.2 53.7 79.6 54.9 C81.2 55.9 82.5 57.7 83.3 59.8 C83.9 61.8 84.2 64.5 84 67 C83.7 69.6 82.2 72.6 82 75 C81.8 77.6 82.2 80.5 83.1 82.5 C83.9 84.5 86.6 86.4 87.3 87.2 C87.5 87.5 88 87 87.8 86.7 C87.3 85.9 85.1 83.8 84.5 81.9 C83.8 80 83.8 77.7 84.1 75.3 C84.5 72.8 86.3 70 86.6 67.3 C86.9 64.5 86.7 61.3 85.8 58.9 C84.9 56.5 82.9 53.9 81.1 52.8 C79.1 51.6 75.6 52 74.6 51.8 Z"/>
  <path fill="#7fb3ad" d="M74 54.4 C74.7 54.7 77.4 55.3 78.7 56.3 C79.9 57.3 80.9 58.7 81.4 60.5 C82 62.2 82.3 64.4 82.1 66.9 C82 69.3 80.5 72.3 80.5 74.9 C80.5 77.6 81 80.8 82 82.9 C83.1 85 86.1 86.7 86.9 87.5 C87.1 87.6 87.5 87.4 87.3 87.2 C86.5 86.4 83.9 84.4 83.1 82.4 C82.1 80.4 81.8 77.5 82 75 C82.2 72.5 83.7 69.5 84 67 C84.2 64.5 83.9 61.8 83.3 59.8 C82.6 57.8 81.2 56 79.7 54.9 C78.2 53.8 75.2 53.6 74.4 53.3 Z"/>
  <path class="ln" fill="#7fb3ad" d="M62.4 34.4 C63.5 33.9 66.4 32.9 68.9 31.4 C71.4 29.9 74.5 27.6 77.4 25.5 C80.3 23.4 83.7 20.5 86.1 18.6 C88.6 16.7 91 14.6 91.9 13.9 C93.7 13 91.9 9.6 90.2 10.4 C89 10.8 85.6 11.4 82.7 12.6 C79.7 13.9 75.5 16 72.3 17.9 C69.1 19.8 65.9 22 63.6 23.9 C61.3 25.8 59.5 28.3 58.6 29.3 Z"/>
  <path class="ln" fill="#7fb3ad" d="M62.2 37.3 C63.4 37 66.6 36.6 69.2 35.6 C71.7 34.6 75.1 32.7 77.7 31.3 C80.3 29.7 82.8 28 84.6 26.9 C86.5 25.6 88.2 24.6 89 24.1 C90.8 23.5 89.7 19.9 87.8 20.5 C86.9 20.5 84.6 20.3 82.3 20.8 C79.9 21.2 76.8 22.2 73.9 23.2 C71.1 24.4 67.7 26 65.2 27.4 C62.8 28.7 60.5 30.7 59.6 31.4 Z"/>
  <path class="ln" fill="#7fb3ad" d="M61.3 39.8 C62.3 39.8 65.6 40 68 39.5 C70.4 39 73.3 37.7 75.5 36.9 C77.6 36 79.4 35.3 81.1 34.7 C82.6 34 84.2 33.5 84.9 33.2 C86.6 33.1 86.4 29.6 84.7 29.7 C83.9 29.6 82 28.7 80.1 28.6 C78.3 28.5 75.9 28.7 73.4 29.1 C71 29.6 68 30.2 65.7 31.1 C63.4 31.8 60.8 33.4 59.7 33.9 Z"/>
  <path class="ln" fill="#7fb3ad" d="M59.4 42.2 C60.3 42.3 63.2 42.9 65.3 42.9 C67.3 42.8 69.8 42.2 71.7 41.8 C73.6 41.4 75.3 40.9 76.7 40.6 C78.1 40.3 79.4 40 80 39.9 C81.5 40.1 81.9 37 80.4 36.8 C79.8 36.5 78.4 35.7 76.9 35.3 C75.2 34.9 73.1 34.6 71.1 34.5 C69.1 34.4 66.5 34.6 64.5 34.9 C62.5 35.3 59.9 36.1 59 36.4 Z"/>
  <path class="ln" fill="#5e928d" d="M52.9 54.8 C53.9 54.1 57.3 52.1 59.5 50.9 C61.7 49.6 64 48.4 66 47.3 C67.9 46.3 70.2 45 71 44.6 C72.7 44.2 71.9 40.8 70.3 41.2 C69.2 41.2 66.2 40.7 63.9 41.2 C61.4 41.7 58.3 42.8 55.8 44.2 C53.3 45.5 50.2 48.2 49 49 Z"/>
  <path class="ln" fill="#5e928d" d="M57.3 55.4 C58.4 54.8 61.8 53.2 63.9 52.2 C65.9 51.1 67.8 50.1 69.4 49.3 C71.1 48.6 73.3 47.8 74.1 47.5 C75.6 47.3 75.2 44.3 73.7 44.5 C72.7 44.4 70.2 43.6 68.1 43.8 C65.9 44 63.3 44.6 61 45.5 C58.6 46.5 55.3 48.7 54.2 49.2 Z"/>
  <path class="ln" fill="#a9cdc6" d="M49.6 53.8 C49.4 42.4 55.2 32.4 63.8 27.6 C70.6 23.8 78.3 20 85.4 14.3 C80.6 19.8 74.7 24.2 69.1 27.6 Q70.3 30.9 66.2 32.2 Q66.8 35.3 62.6 36.4 Q62.8 39.5 58.6 40.3 Q58.8 43.3 54.8 44.1 Q55.4 47.7 52.5 49.6 L52.9 53.8 Z"/>
  <path class="ln t" fill="none" stroke="#5e928d" d="M53.2 42.7 C55.4 36 59.6 31.3 65.3 28.4"/>
  <path class="ln" fill="#c0392f" d="M35.6 38.6 C36.2 38.8 38.6 39.5 39.7 40.1 C40.7 40.6 41.3 41.2 42.1 41.9 C42.7 42.5 43.5 43.6 43.8 43.9 C44.1 44.7 45.7 44.3 45.5 43.5 C45.5 42.8 46.1 41.1 45.7 39.8 C45.3 38.4 44.4 36.6 43.1 35.5 C41.9 34.3 39.2 33.2 38.4 32.7 Z"/>
  <path fill="#d0a63a" d="M36.4 36.9 C37.1 37.2 39.6 38.1 40.7 38.7 C41.8 39.5 42.5 40.4 43.1 41.3 C43.7 42.1 44.1 43.4 44.3 43.8 C44.4 44.1 44.9 43.9 44.8 43.6 C44.7 43.1 44.7 41.7 44.3 40.6 C43.7 39.6 42.9 38.2 41.7 37.3 C40.5 36.3 38.1 35.5 37.3 35.1 Z"/>
  <path fill="#7fb3ad" d="M35.9 38.2 C36.5 38.4 38.9 39.2 40 39.8 C41 40.3 41.7 41.1 42.4 41.8 C43 42.5 43.7 43.6 44 44 C44.1 44.1 44.4 43.9 44.3 43.7 C44.1 43.3 43.7 42 43 41.2 C42.5 40.3 41.8 39.4 40.6 38.7 C39.5 38 37.1 37.2 36.3 36.9 Z"/>
  <path class="ln" fill="#c0392f" d="M32.5 31.7 C33.4 31.9 36.1 32 37.6 32.5 C38.9 33 39.9 33.8 41 34.5 C42.1 35.4 43.5 36.9 44 37.4 C44.4 38.2 46.1 37.5 45.7 36.6 C45.6 35.8 45.8 33.1 44.8 31.5 C44 29.7 42.2 27.6 40.3 26.6 C38.4 25.5 34.9 25.3 33.9 25.1 Z"/>
  <path fill="#d0a63a" d="M32.9 29.8 C33.9 30 36.8 30.1 38.3 30.8 C39.9 31.5 41.1 32.6 42.2 33.7 C43.1 34.7 44.1 36.6 44.5 37.2 C44.6 37.5 45.1 37.2 45 36.9 C44.7 36.2 44.3 33.9 43.3 32.7 C42.4 31.4 40.8 29.7 39.2 29 C37.5 28.1 34.3 27.9 33.3 27.7 Z"/>
  <path fill="#7fb3ad" d="M32.6 31.3 C33.5 31.5 36.3 31.6 37.8 32.1 C39.2 32.6 40.3 33.5 41.3 34.4 C42.4 35.3 43.7 36.9 44.1 37.4 C44.3 37.6 44.6 37.3 44.5 37.1 C44.1 36.5 43.1 34.6 42.1 33.6 C41 32.5 39.8 31.4 38.2 30.8 C36.7 30.1 33.8 29.9 32.9 29.8 Z"/>
  <path class="ln" fill="#c0392f" d="M29 26.1 C29.8 25.9 32.4 25.3 33.9 25.3 C35.3 25.3 36.3 25.8 37.6 26.4 C38.8 26.9 40.6 28.2 41.2 28.6 C41.8 29.4 43.3 28.2 42.7 27.4 C42.4 26.6 42 23.8 40.6 22.4 C39.3 21 36.9 19.3 34.8 18.8 C32.7 18.4 29.3 19.5 28.2 19.6 Z"/>
  <path fill="#d0a63a" d="M28.8 24.2 C29.6 24.1 32.5 23.2 34.1 23.4 C35.8 23.6 37.2 24.4 38.4 25.3 C39.8 26 41.1 27.7 41.7 28.3 C41.9 28.5 42.4 28.1 42.2 27.9 C41.7 27.3 40.6 25.1 39.4 24 C38.2 23 36.2 21.7 34.4 21.4 C32.6 21.1 29.5 22.1 28.5 22.2 Z"/>
  <path fill="#7fb3ad" d="M29 25.6 C29.8 25.5 32.5 24.8 33.9 24.9 C35.5 25 36.6 25.5 37.9 26.1 C39.1 26.8 40.7 28.1 41.4 28.6 C41.5 28.7 41.8 28.4 41.6 28.2 C41.1 27.7 39.7 26 38.4 25.2 C37.1 24.4 35.7 23.6 34 23.4 C32.5 23.2 29.6 24.1 28.8 24.2 Z"/>
  <path class="ln" fill="#d99aa8" d="M65.7 63.4 C66.4 64.5 69 68.2 70.3 70.2 C71.4 72.2 72.6 73.6 72.8 75.4 C73 77.2 71.8 79 71.5 81.2 C71.2 83.4 71.1 87.5 71 88.7 L75.6 88.9 C75.6 87.6 75.1 84 75.5 81.8 C75.8 79.6 77.4 77.7 77.6 75.4 C77.8 73.1 77.1 70.6 76.8 68.1 C76.5 65.4 75.8 61 75.6 59.6 Z"/>
  <path class="ln t" fill="#b0587c" d="M70.9 88.6 L75.8 88.6 L76.5 92.6 L70.4 92.6 Z"/>
  <path class="ln" fill="#d99aa8" d="M36.7 56.8 C36 58.3 33.8 63.3 32.4 65.7 C31.2 68.1 29.6 69.1 28.9 71 C28.2 72.9 28.3 75.3 28.3 77.1 C28.3 79 28.8 81.2 28.9 82.1 L33.3 81.3 C33.1 80.7 32.3 78.5 32.3 77.1 C32.3 75.8 32.4 74.6 33.3 73.3 C34.2 72 36 71.4 37.8 69.5 C39.6 67.5 43.1 62.9 44.2 61.6 Z"/>
  <path class="ln t" fill="#b0587c" d="M28.8 82.1 L33.6 81 L35.2 84.7 L29.3 86.1 Z"/>
  <path class="ln" fill="#d99aa8" d="M24.8 22.1 C28.6 21.3 31.5 23.8 34.1 28.6 C37 34.1 38.9 41 42.7 46.6 C48.1 49.4 54.2 49.8 59.9 48.7 C65.7 47.5 71.6 47.3 75.2 50.4 C78.7 53.4 79 59.2 76.6 63.8 C73.5 67.6 68.2 68 63 67.6 C56.7 68.7 49.4 68.9 43.7 67.8 C38.9 66.8 35.3 64.3 33.8 60.1 C32.4 55.4 30.9 50.6 27.8 46.6 C25.7 43.9 22.9 42.2 20 42 C16.9 42.9 13.5 43.3 11.4 41.8 C9.3 40.1 9.5 37.2 11.2 35.1 C13.9 31.5 17.1 27.6 19.8 24.8 C21.3 23.1 22.9 22.3 24.8 22.1 Z"/>
  <path fill="#ecc4c8" d="M44.1 49.4 C50 51.5 56.7 51.7 63 50.6 C67.8 49.6 72.4 49.8 75.2 52.1 C71 51.9 66.6 52.5 62 53.2 C55.7 54.2 49.4 53.4 44.1 49.4 Z"/>
  <path fill="#c48292" d="M43.9 64.7 C50 66.4 57.1 66.4 63 65.1 C67.2 64.3 70.6 64.7 73.3 65.9 C69.7 67.8 65.7 67.8 63 67.6 C56.7 68.7 49.4 68.9 43.7 67.8 Z"/>
  <path fill="none" stroke="#ecc4c8" stroke-width="1.8" stroke-linecap="round" d="M14.1 33 C16.6 29.9 19 27.3 21.3 25.3"/>
  <path class="ln t" fill="none" stroke="#b0587c" d="M27.6 46.2 C24.6 44.1 22.7 39.7 23.6 35.9"/>
  <path class="ln t" fill="none" stroke="#b0587c" d="M43.7 52.9 C39.7 55.7 38.9 61.1 41.2 65.3"/>
  <path class="ln" fill="#c0392f" d="M23.8 23.8 C24.6 23.9 26.9 23.5 28.2 24.3 C29.6 25.1 30.7 26.8 31.7 28.5 C32.9 30.2 33.9 32.6 34.9 34.6 C36 36.7 36.8 39.2 38 40.9 C39 42.6 40.9 44.3 41.5 45 C41.8 45.7 43.2 45 42.8 44.3 C42.6 43.5 42.3 41.2 41.8 39.2 C41.3 37.3 40.7 34.8 39.9 32.5 C38.9 30.1 38.1 27.4 36.5 25.3 C34.9 23.1 32.6 20.4 30.5 19.5 C28.4 18.7 25 19.9 23.8 20 Z"/>
  <path fill="#d0a63a" d="M23.8 22.7 C24.7 22.8 27.4 22.1 28.9 23 C30.4 23.7 31.9 25.7 33.2 27.5 C34.4 29.4 35.4 31.8 36.3 34 C37.4 36.1 38.2 38.6 39.1 40.4 C40 42.3 41.4 44.1 41.9 44.8 C42 45 42.5 44.7 42.3 44.6 C42 43.8 41 41.8 40.3 39.9 C39.5 38.1 38.8 35.6 37.9 33.4 C36.9 31.1 36 28.5 34.6 26.6 C33.3 24.6 31.4 22.3 29.6 21.4 C27.8 20.6 24.8 21.5 23.8 21.5 Z"/>
  <path fill="#7fb3ad" d="M23.8 23.5 C24.6 23.6 27 23.1 28.3 24 C29.7 24.8 31 26.5 32.1 28.3 C33.3 30 34.2 32.4 35.3 34.5 C36.3 36.6 37.2 39.1 38.2 40.8 C39.3 42.5 41 44.3 41.6 44.9 C41.7 45.1 42 44.9 41.9 44.7 C41.4 44.1 40 42.2 39 40.3 C38.2 38.5 37.3 36.1 36.3 34 C35.4 31.8 34.4 29.5 33.2 27.5 C31.9 25.7 30.4 23.7 28.9 23 C27.4 22.1 24.7 22.8 23.8 22.7 Z"/>
  <path class="ln t" fill="#c0392f" d="M23.5 20.8 C23 21 21.1 21.7 20 22.5 C18.8 23.1 17.4 24.1 16.7 25.2 C15.9 26.3 15.5 28.2 15.3 28.9 C15 29.4 16 29.9 16.3 29.5 C16.7 29.2 17.8 28 18.8 27.4 C19.7 26.8 20.9 26.4 21.9 25.9 C23 25.5 24.7 24.8 25.3 24.6 Z"/>
  <path class="ln t" fill="#d99aa8" d="M27.8 23.8 C27.4 19.8 28.6 16.2 30.5 14.3 C32.2 17.1 32.6 21 31.5 24.6 Z"/>
  <path fill="#b0587c" d="M29.6 21.7 C29.6 19.4 30.1 17.7 30.7 16.9 C31.3 18.5 31.3 20.2 30.9 21.9 Z"/>
  <path class="ln" fill="#d0a63a" d="M18.7 25.9 L13.5 8.3 L26.3 21.9 Z"/>
  <path fill="none" stroke="#e8cf8a" stroke-width="1.3" stroke-linecap="round" d="M15 11.4 L17.9 19.2"/>
  <path class="ln t" fill="none" stroke="#a87e42" d="M17.6 20.5 L21.3 16.7 M16.2 16.1 L18.3 13.1 M14.8 12.1 L15.5 10"/>
  <circle cx="21" cy="32" r="1.7" fill="#2b2722"/>
  <circle cx="21.5" cy="31.5" r="0.5" fill="#f6efe2"/>
  <path class="ln t" fill="none" stroke="#b0587c" d="M12.4 38 C13.1 37.2 14.1 37.2 14.5 38"/>
</svg>`,
  },
  {
    id: "guest-ariana-grande",
    name: "Ponytail",
    sub: "Ariana Grande",
    how: "Clear a whole guest shelf: Ariana Grande",
    hint: "Thirteen pages of a catalogue that is not hers.",
    era: "The guest shelf",
    art: `<svg xmlns="http://www.w3.org/2000/svg" class="stick" viewBox="0 0 100 100">
<g stroke-linecap="round" stroke-linejoin="round">
<path d="M45.06 23.31 C45.06 10.47 58.9 4.53 68.78 11.45 C84.59 23.31 84.59 47.03 77.67 62.85 C73.72 73.72 71.74 81.63 78.66 82.62 Q82.62 83.6 83.6 77.67 C89.53 86.57 73.72 95.47 64.83 89.53 C50 81.63 55.93 67.79 59.88 55.93 C62.85 46.05 60.87 34.19 53.95 28.26Z" fill="#8e6b46" stroke="#2b2722" stroke-width="2.3" />
<path d="M62.85 11.45 C80.64 19.36 79.65 44.07 72.73 58.9 C67.79 72.73 65.81 83.6 76.69 87.56 C59.88 87.56 59.88 72.73 65.81 57.91 C71.74 43.08 73.72 24.3 62.85 11.45Z" fill="#a58257" stroke="#302d27" stroke-width="0" />
<path d="M74.71 25.29 C82.62 42.09 73.72 57.91 71.74 68.78 C67.79 80.64 76.69 88.55 82.62 83.6 C77.67 92.5 64.83 87.56 65.81 75.7 C66.8 59.88 77.67 45.06 74.71 25.29Z" fill="#6b5238" stroke="#302d27" stroke-width="0" />
<path d="M58.9 28.26 C64.83 41.1 65.81 49.01 60.87 62.85 C55.93 77.67 56.92 81.63 62.85 85.58 C51.98 78.66 56.92 63.84 59.88 53.95 C61.86 43.08 56.92 31.22 54.94 28.26Z" fill="#72573b" stroke="#302d27" stroke-width="0" />
<path d="M50.99 21.34 C51.98 11.45 63.84 10.47 67.79 17.38" fill="none" stroke="#483e2d" stroke-width="1.01" />
<path d="M54.94 22.33 C60.87 15.41 68.78 20.35 72.73 29.24 C77.67 42.09 69.77 55.93 65.81 67.79 C61.86 77.67 64.83 85.58 72.73 87.56" fill="none" stroke="#483e2d" stroke-width="1.01" />
<path d="M60.87 27.27 C68.78 41.1 66.8 50 62.85 58.9" fill="none" stroke="#483e2d" stroke-width="1.01" />
<path d="M71.74 17.38 C80.64 29.24 81.63 43.08 76.69 54.94" fill="none" stroke="#483e2d" stroke-width="1.01" />
<path d="M73.72 61.86 C66.8 76.69 72.73 85.58 79.65 83.6" fill="none" stroke="#483e2d" stroke-width="1.01" />
<path d="M59.88 68.78 C56.92 77.67 62.85 84.59 66.8 85.58" fill="none" stroke="#483e2d" stroke-width="1.01" />
<path d="M60.87 85.58 Q66.8 92.5 74.71 90.52" fill="none" stroke="#483e2d" stroke-width="1.01" />
<path d="M49.01 22.33 C37.15 17.38 22.33 25.29 17.38 37.15 C12.44 47.03 14.42 54.55 18.97 58.1 Q21.53 59.69 21.73 56.52 C22.52 50.4 29.24 49.01 35.57 44.47 Q41.9 40.51 44.66 36.76 C43.08 42.49 49.6 45.65 48.81 54.35 Q49.21 57.31 51.19 55.34 Q55.93 50.99 55.93 42.09 C56.92 33.2 53.95 26.28 49.01 22.33Z" fill="#92714e" stroke="#2b2722" stroke-width="2.3" />
<path d="M19.36 44.07 Q26.28 28.26 43.08 24.3 C28.26 24.3 18.37 34.19 17.38 47.03Z" fill="#ad885b" stroke="#302d27" stroke-width="0" />
<path d="M19.36 56.92 C19.36 47.03 37.15 46.05 44.07 35.17 Q44.07 43.08 38.14 45.06 C29.24 50 23.31 48.02 19.36 56.92Z" fill="#75583a" stroke="#302d27" stroke-width="0" />
<path d="M48.02 26.28 Q56.92 35.17 50.99 47.03 C50.99 42.09 45.06 41.1 45.06 35.17Z" fill="#a48258" stroke="#302d27" stroke-width="0" />
<path d="M20.35 44.07 C26.28 37.15 39.13 33.2 44.07 26.28" fill="none" stroke="#4e422f" stroke-width="1.01" />
<path d="M20.35 50 C26.28 44.07 38.14 43.08 42.09 34.19" fill="none" stroke="#4e422f" stroke-width="1.01" />
<path d="M27.27 31.22 Q35.17 25.29 41.1 26.28" fill="none" stroke="#4e422f" stroke-width="1.01" />
<path d="M47.03 27.27 Q50 33.2 48.02 38.14" fill="none" stroke="#4e422f" stroke-width="1.01" />
<path d="M51.98 33.2 Q54.94 41.1 50.99 46.05" fill="none" stroke="#4e422f" stroke-width="1.01" />
<path d="M26.28 36.16 Q32.21 31.22 38.14 29.24" fill="none" stroke="#bc9968" stroke-width="1.01" />
<path d="M66.8 29.24 Q70.76 37.15 69.77 44.07" fill="none" stroke="#bc9968" stroke-width="1.01" />
<path d="M61.86 72.73 Q59.88 78.66 63.84 82.62" fill="none" stroke="#bc9968" stroke-width="1.01" />
<path d="M42.09 23.31 Q49.01 21.34 55.93 27.27" fill="none" stroke="#423d2e" stroke-width="3" />
<ellipse cx="42.59" cy="22.82" rx="1.83" ry="1.88" fill="#eee9d5" stroke="#2b2722" stroke-width="1.01" />
<ellipse cx="46.44" cy="22.62" rx="1.83" ry="1.88" fill="#eee9d5" stroke="#2b2722" stroke-width="1.01" />
<ellipse cx="50.1" cy="23.31" rx="1.83" ry="1.88" fill="#eee9d5" stroke="#2b2722" stroke-width="1.01" />
<ellipse cx="53.66" cy="24.9" rx="1.83" ry="1.88" fill="#eee9d5" stroke="#2b2722" stroke-width="1.01" />
<ellipse cx="56.52" cy="27.27" rx="1.83" ry="1.88" fill="#eee9d5" stroke="#2b2722" stroke-width="1.01" />
</g>
</svg>`,
  },
  {
    id: "guest-harry-styles",
    name: "Watermelon slice",
    sub: "Harry Styles",
    how: "Clear a whole guest shelf: Harry Styles",
    hint: "Thirteen pages of a catalogue that is not hers.",
    era: "The guest shelf",
    art: `<svg xmlns="http://www.w3.org/2000/svg" class="stick" viewBox="0 0 100 100">
<g stroke-linecap="round" stroke-linejoin="round">
<path d="M48.88 9.68 Q50 7.44 52.24 10.8 L84.72 72.4 C69.04 92.56 33.2 94.8 13.04 78Z" fill="#7e9149" stroke="#2b2722" stroke-width="2.3" />
<path d="M52.24 10.8 L86.96 71.28 L84.72 78 Q61.2 100.4 17.52 85.84 L13.04 78 C36.56 92.56 65.68 86.96 81.36 73.52Z" fill="#647a3c" stroke="#2b2722" stroke-width="1.4" />
<path d="M49.22 10.46 Q50.11 8.9 51.9 11.25 L82.48 70.16 C66.13 87.41 34.77 88.53 15.5 76.21Z" fill="#e0d9a6" stroke="#302d27" stroke-width="0" />
<path d="M49.44 10.91 Q50.22 9.46 51.68 11.7 L80.02 67.36 C65.68 81.36 36.56 84.72 18.08 73.18Z" fill="#d0706a" stroke="#2b2722" stroke-width="1.4" />
<path d="M51.12 14.16 L79.12 66.8 Q75.76 71.28 73.52 71.28 L47.76 16.4Z" fill="#e08c85" stroke="#302d27" stroke-width="0" />
<path d="M19.76 71.28 Q45.52 84.72 74.64 72.4 Q52.24 86.96 18.64 74.64Z" fill="#dd8a80" stroke="#302d27" stroke-width="0" />
<path d="M52.24 15.28 L79.12 65.68" fill="none" stroke="#9c6552" stroke-width="0.816" />
<path d="M18.64 80.24 Q48.88 92.56 79.12 76.88" fill="none" stroke="#9c6552" stroke-width="0.816" />
<g transform="rotate(12 47.76 29.84)">
<path d="M47.76 26.82 C44.4 30.74 45.74 33.2 47.76 33.2 C50.45 33.2 50.34 30.4 47.76 26.82Z" fill="#38382c" stroke="#302d27" stroke-width="0" />
</g>
<g transform="rotate(15 42.16 45.52)">
<path d="M42.16 42.34 C38.63 46.46 40.04 49.05 42.16 49.05 C44.98 49.05 44.86 46.11 42.16 42.34Z" fill="#38382c" stroke="#302d27" stroke-width="0" />
</g>
<g transform="rotate(-7 54.48 43.28)">
<path d="M54.48 40.41 C51.29 44.13 52.56 46.47 54.48 46.47 C57.03 46.47 56.93 43.81 54.48 40.41Z" fill="#38382c" stroke="#302d27" stroke-width="0" />
</g>
<g transform="rotate(16 33.2 60.08)">
<path d="M33.2 57.06 C29.84 60.98 31.18 63.44 33.2 63.44 C35.89 63.44 35.78 60.64 33.2 57.06Z" fill="#38382c" stroke="#302d27" stroke-width="0" />
</g>
<g transform="rotate(3 47.76 62.32)">
<path d="M47.76 58.99 C44.06 63.31 45.54 66.02 47.76 66.02 C50.72 66.02 50.59 62.94 47.76 58.99Z" fill="#38382c" stroke="#302d27" stroke-width="0" />
</g>
<g transform="rotate(-15 60.08 56.72)">
<path d="M60.08 53.54 C56.55 57.66 57.96 60.25 60.08 60.25 C62.9 60.25 62.78 57.31 60.08 53.54Z" fill="#38382c" stroke="#302d27" stroke-width="0" />
</g>
</g>
</svg>`,
  },
  {
    id: "guest-sabrina-carpenter",
    name: "Espresso cup",
    sub: "Sabrina Carpenter",
    how: "Clear a whole guest shelf: Sabrina Carpenter",
    hint: "Thirteen pages of a catalogue that is not hers.",
    era: "The guest shelf",
    art: `<svg xmlns="http://www.w3.org/2000/svg" class="stick" viewBox="0 0 100 100">
<g stroke-linecap="round" stroke-linejoin="round">
<path d="M69.03 76.28 l-4.96 0.77 -2.15 0.25 c-2.86 0.33 -5.66 0.54 -8.55 0.58 l-4.51 0.09 h-1.17 c-3.79 -0.02 -7.53 -0.21 -11.31 -0.61 -3.81 -0.41 -7.5 -1.06 -11.18 -2.06 l-4.44 -1.41 c-1.35 -0.43 -2.57 -1.01 -3.85 -1.62 -1.8 -0.87 -3.47 -1.85 -5.05 -3.07 -1.01 -0.78 -1.89 -1.65 -2.62 -2.7 l-0.6 -1.07 c-0.76 -1.63 -0.7 -3.45 0.16 -5.03 s2.66 -3.14 4.4 -4.19 c2.7 -1.65 5.78 -2.76 8.84 -3.62 l0.04 -0.15 c-1.04 -2.58 -1.76 -5.19 -2.24 -7.94 s-0.94 -7.09 -0.76 -10.33 c0.13 -2.25 0.99 -4.1 2.64 -5.61 1.16 -1.04 2.47 -1.8 3.91 -2.41 4.47 -1.89 10.53 -3.18 15.38 -3.53 l1.32 -0.1 1.15 -0.07 1.29 -0.07 1.35 -0.05 1.12 -0.03 h4.53 c3.27 0 6.47 0.32 9.71 0.77 2.48 0.35 4.85 0.84 7.22 1.58 l2.75 1.05 c0.95 0.35 1.77 0.91 2.58 1.5 0.65 0.47 1.21 1.01 1.71 1.64 1.19 1.46 1.61 3.28 1.56 5.19 l0.14 0.03 c4.52 -2.61 10.38 -1.82 13.06 2.89 1.15 2.03 1.49 4.4 1.28 6.72 s-1.47 5.5 -3.36 7.73 l-1.84 1.81 c-0.95 0.81 -1.96 1.48 -3.08 2.15 2.53 1.31 5.11 2.92 6.4 5.44 0.83 1.62 0.87 3.5 0.09 5.15 -0.32 0.65 -0.66 1.28 -1.17 1.79 l-1.32 1.33 c-0.88 0.74 -1.77 1.37 -2.76 1.95 -3.05 1.76 -6.44 2.98 -9.84 3.91 l-5.85 1.32Z M21.08 32.49 l-0.22 1.06 c-0.13 0.64 -0.13 1.25 -0.13 1.94 -0.01 3.97 0.41 7.89 1.36 11.76 s1.65 5.4 2.94 7.93 l0.87 1.58 c1.43 2.59 3.93 5.64 6.31 7.44 0.98 0.73 1.99 1.34 3.1 1.84 l2.57 0.94 c1.71 0.49 3.41 0.77 5.19 0.96 4.83 0.49 10.63 0.24 15.26 -1.21 1.96 -0.61 3.77 -1.49 5.44 -2.7 l1.87 -1.55 c1.19 -0.99 2.13 -2.17 3.02 -3.42 l0.83 -1.16 0.54 -0.81 c0.05 -0.03 0.08 0.16 0.06 0.22 l-0.36 1.43 -0.29 0.96 0.44 -0.09 c0.1 -0.02 0.31 -0.08 0.4 -0.13 l1.43 -0.73 c0.72 -0.36 1.46 -0.61 2.24 -0.87 l3.24 -1.09 4.06 -1.8 1.43 -0.78 c1.55 -0.85 2.94 -1.92 4.14 -3.23 2.66 -2.88 4.06 -6.89 3.28 -10.69 -0.55 -2.7 -2.09 -4.84 -4.77 -5.76 s-6.3 -0.03 -8.6 1.95 l-0.54 0.46 -0.63 0.47 0.09 -1.27 0.03 -0.47 v-1.5 s-0.01 -0.61 -0.01 -0.61 l-0.11 -1.16 -0.1 -0.43 -0.14 -0.5 -0.12 -0.34 c-0.27 -0.77 -1.08 -1.73 -1.76 -2.28 -1.35 -1.09 -2.96 -1.84 -4.61 -2.39 -3.71 -1.26 -7.65 -1.84 -11.56 -2.17 -3.65 -0.32 -7.24 -0.43 -10.9 -0.31 -2.06 0.07 -4.04 0.15 -6.07 0.38 l-2.39 0.28 c-1.73 0.2 -3.38 0.55 -5.07 0.93 -2.67 0.6 -5.52 1.43 -7.9 2.74 s-2.58 1.74 -3.34 3.05 -0.4 0.77 -0.5 1.17Z M80.07 57.11 l-3.9 1.5 -2.03 0.64 -1.19 0.42 -1.01 0.5 -1.08 0.53 -0.14 0.09 -0.25 0.05 c-0.52 0.1 -0.97 0.2 -1.52 0.14 l-1.18 1.35 c-1.16 1.32 -2.53 2.36 -4 3.31 l0.11 0.33 c0.49 1.49 -0.49 2.78 -1.84 3.55 s-1.43 0.77 -2.19 0.99 l-1.05 0.32 -1.96 0.47 c-1.65 0.39 -3.26 0.54 -4.96 0.68 -3.33 0.26 -6.59 0.21 -9.9 -0.13 l-3.63 -0.57 -2.29 -0.6 c-0.72 -0.19 -1.39 -0.5 -2.03 -0.84 -1.23 -0.67 -2.53 -1.82 -2.4 -3.22 l0.03 -0.32 0.22 -0.67 c-2.65 -1.7 -5.15 -4.56 -6.78 -7.21 l-0.77 -1.25 -1.21 -2.29 -0.43 -0.93 c-3.77 1.07 -8.51 2.77 -11.27 5.55 -2.03 2.05 -2.39 4.4 -0.58 6.71 0.45 0.57 0.92 1.1 1.5 1.54 l2.01 1.48 c1.67 1.24 5.72 3.02 7.81 3.66 l2.79 0.87 c4.51 1.4 11.11 2.3 15.92 2.62 l6.69 0.25 h2.97 s6.3 -0.24 6.3 -0.24 c3.5 -0.13 6.89 -0.56 10.34 -1.14 l5.94 -1.21 c3.84 -0.97 7.87 -2.32 11.22 -4.44 1.45 -0.91 2.9 -2.04 3.83 -3.47 1.09 -1.69 1.11 -3.52 0.02 -5.2 -0.89 -1.36 -2.65 -2.79 -4.07 -3.52 l-2.19 -1.13 -1.52 0.72 -0.31 0.13Z M35.58 69.39 l1.61 0.55 c1.68 0.46 3.37 0.71 5.11 0.89 l0.39 0.04 0.5 0.05 c3.79 0.34 8.75 0.18 12.52 -0.45 l3.27 -0.76 c0.92 -0.21 1.74 -0.62 2.54 -1.11 0.84 -0.51 1.58 -1.4 1.17 -2.33 l-1.43 0.71 c-3.21 1.58 -8.86 2.42 -12.48 2.43 h-2.13 c-1.82 0 -3.57 -0.16 -5.37 -0.43 -2.89 -0.42 -5.67 -1.2 -8.26 -2.7 -0.32 0.35 -0.14 1.12 0.2 1.56 s0.66 0.75 1.1 0.95 l1.27 0.61Z" fill="#2b2722" />
<path d="M30.63 78.64 l-0.43 -0.09 -0.59 -0.1 -0.61 -0.07 -0.47 -0.05 -0.43 -0.12 -1.35 -0.32 -0.61 -0.14 -0.81 -0.27 c-0.14 -0.05 -0.24 -0.08 -0.38 -0.11 l-0.83 -0.18 -0.53 -0.11 -0.33 -0.09 -0.65 -0.2 -1.13 -0.39 -1.14 -0.37 -0.79 -0.26 -1.07 -0.47 -0.43 -0.16 -0.17 -0.19 c-0.39 -0.08 -0.76 -0.16 -1.11 -0.34 l-0.47 -0.22 -0.55 -0.32 -0.33 -0.19 -0.83 -0.39 -0.57 -0.28 -0.55 -0.35 c-0.12 -0.09 -0.24 -0.17 -0.37 -0.23 -0.23 -0.1 -0.44 -0.21 -0.63 -0.35 l-0.5 -0.36 -0.61 -0.35 -0.43 -0.35 -0.42 -0.34 -0.39 -0.3 -0.5 -0.41 -0.41 -0.36 -0.76 -0.75 -0.32 -0.37 -0.39 -0.46 c-0.11 -0.12 -0.18 -0.32 -0.28 -0.47 l-0.33 -0.5 -0.33 -0.51 -0.2 -0.54 -0.36 -0.78 c-0.11 -0.22 -0.15 -0.6 -0.17 -0.85 l-0.07 -0.78 v-1.58 s0.06 -0.7 0.06 -0.7 c0.01 -0.11 0.07 -0.38 0.11 -0.5 l0.22 -0.53 0.32 -0.74 0.27 -0.56 0.61 -0.92 0.35 -0.47 0.47 -0.54 0.57 -0.58 c0.11 -0.11 0.32 -0.19 0.5 -0.24 l-1.39 1.5 c-0.91 0.99 -1.73 2.73 -1.87 4.1 l-0.07 0.64 0.03 1.03 0.1 0.69 c0.19 1.39 1.34 3.46 2.34 4.42 l1.48 1.41 2.42 1.76 1.73 1.02 c1.24 0.73 2.53 1.3 3.85 1.84 l1.75 0.69 0.91 0.32 1.84 0.6 1.1 0.34 1.02 0.28 c2.16 0.59 4.3 1.08 6.51 1.42 l2.64 0.4 0.68 0.09 0.54 0.07 0.68 0.09 0.69 0.08 0.75 0.08 0.83 0.08 0.91 0.08 0.99 0.08 1.28 0.09 1.22 0.08 1.15 0.02 0.52 0.06 h1.61 c0.77 0.02 1.49 -0.04 2.28 0.15 -0.63 0.13 -1.21 0.07 -1.81 0.06 l-0.7 -0.02 -1.89 -0.06 -0.76 -0.06 -1.43 -0.02 -0.37 -0.02 h-0.85 c0 0 -0.83 -0.07 -0.83 -0.07 l-0.69 -0.06 -0.61 -0.05 -0.91 -0.05 -0.61 -0.07 -0.69 -0.06 c-0.23 -0.02 -0.43 -0.06 -0.65 -0.1 l-1.09 -0.2 -0.54 -0.07 -0.54 -0.07 -0.53 -0.08 -0.53 -0.09 -1.33 -0.23Z" fill="#f8f4eb" />
<path d="M91.99 66.33 c0.06 0 0.18 -0.14 0.2 -0.2 l0.2 -0.61 c0.02 -0.06 -0.06 -0.28 -0.09 -0.24 l0.06 -0.24 c0.01 0 0.12 0.02 0.12 -0.01 l0.05 -0.21 0.09 -0.15 c0.03 0.09 0.06 0.29 0.02 0.4 l-0.32 1.13 -0.34 0.75 -0.42 0.77 -0.18 0.47 c-0.16 0.43 -0.6 0.52 -0.82 0.89 l-0.21 0.35 c-0.05 0.07 -0.13 0.26 -0.2 0.32 l-0.35 0.26 -0.41 0.34 -0.47 0.54 c-0.1 0.11 -0.4 0.19 -0.54 0.29 l-0.39 0.29 c-0.27 0.2 -0.48 0.45 -0.77 0.6 l-0.4 0.21 -0.61 0.38 -0.19 0.12 -0.65 0.43 c-0.2 0.13 -0.47 0.27 -0.69 0.33 l-0.54 0.17 c-0.46 0.14 -0.96 0.74 -1.61 0.91 l-1.03 0.28 c-0.38 0.1 -0.7 0.35 -1.06 0.51 l-0.57 0.25 -0.62 0.22 -0.59 0.15 c-0.24 0.06 -0.54 0.09 -0.74 0.18 -0.57 0.28 -0.83 0.05 -1.13 0.42 l-0.69 0.18 -0.53 0.16 -1.41 0.34 -0.76 0.16 -0.77 0.2 -0.81 0.16 -1.14 0.22 -1.07 0.24 -0.39 0.1 -0.49 0.06 -0.53 0.08 -0.54 0.08 -0.6 0.1 -0.99 0.17 -0.59 0.1 -0.47 0.06 -0.69 0.09 -0.6 0.08 -0.55 0.07 -0.99 0.19 -0.23 -0.02 -0.61 0.05 -0.75 0.12 -0.99 0.05 -0.77 0.02 -0.37 0.05 -1.08 0.02 -0.82 0.02 -1.07 0.06 -1.13 0.06 -0.77 0.05 -0.77 0.04 -1.44 -0.03 -0.99 0.07 -2.35 0.02 c0 -0.04 0.06 -0.15 0.09 -0.15 l0.97 -0.02 3.13 -0.07 1.44 -0.06 1.06 -0.05 0.99 -0.06 0.99 -0.06 1.06 -0.07 0.68 -0.05 0.91 -0.07 0.99 -0.08 0.75 -0.08 0.77 -0.09 0.69 -0.08 0.6 -0.07 0.69 -0.09 0.55 -0.07 0.61 -0.08 0.6 -0.09 0.47 -0.07 2.99 -0.5 1.35 -0.26 c3.06 -0.59 6.05 -1.36 9 -2.39 l3.75 -1.5 2.32 -1.18 c1.31 -0.66 2.51 -1.49 3.57 -2.51 l0.86 -0.81 0.5 -0.57 c0.69 -0.77 1.2 -1.65 1.58 -2.58Z" fill="#f8f4eb" />
<path d="M34.88 21.33 l0.03 -0.17 c0.13 0 0.4 -0.13 0.56 -0.16 l1.43 -0.24 h0.43 c0 -0.01 0.49 -0.12 0.49 -0.12 l0.54 -0.06 0.36 -0.06 h0.77 c0.39 -0.01 0.7 -0.11 1.1 -0.23 s0.65 0.08 0.87 0.03 l0.48 -0.11 1.65 -0.02 0.47 -0.06 1.6 -0.04 0.58 -0.09 0.46 -0.06 0.93 0.03 0.68 0.05 2.81 -0.02 1.43 -0.05 0.55 0.13 2.26 0.02 0.47 0.08 h1.14 c0.11 0 0.3 0.07 0.39 0.11 0.5 -0.07 1.02 0.06 1.54 0.12 l0.62 0.1 0.55 0.06 0.73 0.04 0.62 0.12 0.54 0.04 0.69 0.1 0.56 0.08 0.49 0.13 0.39 0.1 0.45 0.07 0.38 0.12 0.57 0.06 c0.23 0.1 0.51 0.21 0.76 0.28 l1.9 0.46 0.69 0.22 0.83 0.24 0.63 0.13 c0.09 0.02 0.25 0.15 0.33 0.18 l1.07 0.46 1.2 0.57 0.69 0.36 1.22 0.67 0.52 0.31 0.58 0.5 c0.3 0.33 0.72 0.55 0.87 1.03 -0.95 -0.86 -1.87 -1.61 -2.97 -2.22 -1.33 -0.74 -2.66 -1.36 -4.1 -1.82 l-1.22 -0.38 -1.2 -0.33 -0.68 -0.16 -1.29 -0.31 -0.42 -0.09 -0.69 -0.13 -1.56 -0.28 -1.78 -0.26 -0.61 -0.09 -0.61 -0.08 -0.54 -0.06 -0.83 -0.08 -0.98 -0.1 -0.84 -0.08 -0.81 -0.03 -0.33 -0.06 -1.12 -0.02 -0.33 -0.06 -2.72 -0.03 -0.77 -0.03 -1.98 -0.02 -0.45 0.05 -2.75 0.03 -0.32 0.06 -1.11 0.02 -0.33 0.06 -1.03 0.03 -0.7 0.06 -0.54 0.05 -1.06 0.1 -0.69 0.06 -0.69 0.09 -0.69 0.09 -1.46 0.21 -1.78 0.32Z" fill="#f4ebdc" />
<path d="M12.28 54.31 l0.87 -0.46 0.22 -0.15 1.85 -0.91 0.77 -0.32 0.98 -0.39 1.22 -0.45 0.4 -0.14 0.44 -0.16 c0.07 -0.06 0.18 -0.33 0.15 -0.43 l-0.19 -0.62 -0.33 -1.13 -0.28 -1 -0.15 -0.69 -0.37 -1.63 -0.2 -1.17 -0.2 -1.37 -0.07 -0.48 -0.11 -0.35 -0.03 -0.61 -0.08 -0.75 -0.09 -0.83 -0.07 -0.77 -0.07 -0.99 -0.07 -1.24 c-0.04 -0.73 -0.05 -1.45 0 -2.18 l0.07 -1.45 0.11 -0.76 0.1 -0.77 c0.02 -0.2 0.13 -0.42 0.2 -0.61 l0.48 -1.3 0.33 -0.62 0.24 -0.46 0.27 -0.41 c0.08 -0.11 0.2 -0.22 0.33 -0.28 l-0.93 1.59 -0.32 0.74 -0.22 0.62 c-0.2 0.58 -0.32 1.19 -0.38 1.81 l-0.09 0.81 -0.05 1.22 0.04 2.51 0.09 1.44 0.08 0.98 0.07 0.69 0.08 0.69 0.08 0.61 0.08 0.61 0.06 0.45 0.17 1.13 0.2 1.16 0.74 3.21 0.48 1.65 0.32 0.92 -1.41 0.49 -1.64 0.63 -0.8 0.33 -0.73 0.33 -1.63 0.82 -0.73 0.41 c-0.83 0.47 -1.62 0.99 -2.35 1.59 l-0.39 0.32 -0.09 -0.16 0.64 -0.51 0.57 -0.42 0.94 -0.58 0.39 -0.23Z" fill="#f8f4eb" />
<path d="M92.61 62.3 l-0.08 -0.24 c-0.02 -0.07 -0.11 -0.21 -0.16 -0.22 l-0.6 -1.74 c-0.43 -0.95 -1.05 -1.74 -1.74 -2.51 l-1.17 -1.12 -1.59 -1.21 1.37 -1.21 c1.27 -1.12 2.35 -2.42 3.14 -3.92 l0.6 -1.16 0.86 -2.27 c0.02 -0.04 0.06 -0.11 0.08 -0.13 0.06 -0.07 0.16 -0.22 0.2 -0.31 l0.11 -0.23 c0.02 0.02 0.09 0.16 0.06 0.2 l-0.13 0.35 -0.22 0.61 -0.24 0.69 -0.22 0.52 -0.21 0.48 -0.26 0.57 -0.3 0.64 -0.39 0.55 -0.4 0.68 -0.32 0.43 -0.39 0.46 -0.46 0.54 -0.33 0.41 -0.99 0.99 -0.28 0.27 -0.32 0.3 -0.45 0.42 c0.11 0.31 0.32 0.53 0.57 0.69 l0.41 0.27 0.64 0.57 0.44 0.39 0.39 0.44 0.42 0.48 0.43 0.57 0.43 0.63 0.34 0.63 0.39 0.98 0.28 0.73 c0.1 0.27 0.16 0.61 0.06 0.77Z" fill="#f8f4eb" />
<path d="M93.75 39.66 l-0.05 -0.16 -0.08 -0.28 -0.1 -0.35 -0.13 -0.04 c-0.31 -1.46 -1.27 -3.31 -2.29 -4.51 -1.54 -1.84 -3.97 -3.2 -6.33 -3.55 l-0.52 -0.08 -0.85 -0.08 -1.13 -0.02 -0.98 0.11 c-0.78 0.09 -1.51 0.29 -2.21 0.47 -0.27 -1.28 -0.79 -2.38 -1.47 -3.37 l0.06 -0.11 c0.08 0.06 0.24 0.17 0.29 0.29 l0.59 1.1 0.28 0.55 0.16 0.35 0.27 0.67 c0.08 0.2 0.43 0.16 0.6 0.13 l0.89 -0.17 0.54 -0.08 0.59 -0.08 h2.05 c0 0 0.46 0.07 0.46 0.07 l0.69 0.1 1.13 0.3 0.81 0.24 c0.27 0.09 0.51 0.18 0.77 0.32 l0.77 0.39 c0.13 0.07 0.31 0.16 0.42 0.24 l0.39 0.31 0.37 0.23 0.44 0.39 0.41 0.36 0.59 0.59 0.47 0.62 0.33 0.43 0.39 0.59 0.15 0.31 0.28 0.5 c0.13 0.23 0.24 0.47 0.33 0.73 l0.16 0.54 0.39 1.15 c0.1 0.26 0.3 0.49 0.1 0.79Z" fill="#f8f4eb" />
<path d="M22.61 25.18 l0.72 -0.39 0.73 -0.34 0.66 -0.32 1.14 -0.46 1.05 -0.39 0.76 -0.24 0.69 -0.26 0.8 -0.24 0.38 -0.16 0.38 -0.05 0.41 -0.14 c0.21 -0.08 0.42 -0.11 0.65 -0.16 l0.86 -0.2 0.4 -0.14 c0.12 -0.05 0.32 -0.07 0.47 -0.09 l0.46 -0.06 0.48 -0.04 -0.33 0.11 -0.48 0.12 -1.06 0.25 -0.97 0.24 -0.84 0.23 -1.36 0.4 -0.56 0.19 -0.76 0.25 -0.62 0.2 -1.54 0.6 c-0.83 0.33 -1.61 0.76 -2.41 1.16 l-2.21 1.55 0.7 -0.77 1.4 -0.85Z" fill="#f8f4eb" />
<path d="M93.75 39.66 l0.08 0.31 0.06 0.61 0.06 1.5 v0.92 s-0.03 1.28 -0.03 1.28 c-0.03 0.02 -0.06 0.03 -0.06 0.06 v0.12 s-0.02 0.5 -0.02 0.5 l-0.11 0.23 c-0.06 0.2 -0.13 0.5 -0.13 0.65 l0.02 0.19 -0.11 0.23 c-0.03 0.1 -0.13 0.24 -0.2 0.31 l0.17 -0.89 0.2 -1.02 0.06 -0.53 0.03 -0.6 0.06 -0.32 -0.02 -1.65 -0.06 -0.7 -0.08 -0.68 -0.28 -1.35 0.13 0.04 0.1 0.35 0.08 0.28 0.05 0.16Z" fill="#f4ebdb" />
<path d="M92.61 62.3 v0.24 s0.01 1.95 0.01 1.95 l0.02 0.17 -0.09 0.15 -0.05 0.21 c0 0.03 -0.11 0.02 -0.12 0.01 l0.07 -0.46 0.08 -0.61 v-0.97 s-0.08 -0.7 -0.08 -0.7 l-0.07 -0.46 c0.06 0.01 0.13 0.15 0.16 0.22 l0.08 0.24Z" fill="#e6dac8" />
<path d="M92.62 64.48 L92.62 62.54 L92.78 62.55 L92.78 64.49 L92.62 64.48Z" fill="#f8f4eb" />
<path d="M77.68 27.7 l-0.06 0.11 -0.2 -0.24 -0.54 -0.65 -0.05 -0.06 c-0.02 0.05 0.02 -0.06 0.04 -0.11 l0.1 0.06 c0.17 0.12 0.39 0.31 0.52 0.53 l0.2 0.35Z" fill="#f4ebdc" />
<path d="M34.91 21.15 l-0.03 0.17 -0.66 0.15 -0.12 -0.16 0.38 -0.12 c0.11 -0.04 0.27 -0.05 0.43 -0.04Z" fill="#f8f4eb" />
<path d="M93.61 45.85 c-0.01 -0.16 0.07 -0.47 0.13 -0.65 l0.11 -0.23 c0.01 0.02 0.07 0.13 0.06 0.16 l-0.16 0.76 -0.13 -0.03Z" fill="#f8f4eb" />
<path d="M91.99 66.33 l0.32 -1.06 c0.03 -0.04 0.1 0.18 0.09 0.24 l-0.2 0.61 c-0.02 0.06 -0.14 0.2 -0.2 0.2Z" fill="#e6dac8" />
<path d="M19.45 27.94 L19.31 27.89 L19.65 27.57 L20.32 26.91 L20.39 26.96 L19.45 27.94Z" fill="#f8f4eb" />
<path d="M19.09 28.43 L18.93 28.33 L19.36 27.98 L19.09 28.43Z" fill="#f8f4eb" />
<path d="M93.85 44.47 v-0.12 c0 -0.02 0.02 -0.04 0.06 -0.06 0.02 0.01 0.11 0.11 0.09 0.11 l-0.13 0.06Z" fill="#f8f4eb" />
<path d="M33.96 21.47 c0.09 0.01 0.06 0 -0.03 0 -0.17 -0.02 -0.16 -0.02 0.03 0Z" fill="#f8f4eb" />
<path d="M75.65 33.52 l0.02 0.61 h-0.15 c0 0 0 1.87 0 1.87 0.02 0.02 0.09 0.1 0.12 0.1 l-0.09 1.27 -0.16 1.47 -0.08 0.61 -0.03 0.41 -0.5 3.21 c-0.35 2.29 -0.87 4.45 -1.56 6.66 -0.63 2.02 -1.4 3.92 -2.29 5.82 l-0.14 0.27 -0.59 1.01 -0.14 0.24 -0.54 0.81 -0.83 1.16 c-0.9 1.24 -1.84 2.45 -3.02 3.42 l-1.87 1.55 c-1.66 1.21 -3.47 2.08 -5.44 2.7 -4.64 1.45 -10.43 1.69 -15.26 1.21 -1.78 -0.17 -3.47 -0.47 -5.19 -0.96 l-2.57 -0.94 c-1.11 -0.5 -2.13 -1.11 -3.1 -1.84 -2.38 -1.8 -4.88 -4.85 -6.31 -7.44 l-0.87 -1.58 c-1.29 -2.53 -2.27 -5.15 -2.94 -7.93 s-1.36 -7.78 -1.36 -11.76 c0 -0.69 0 -1.3 0.13 -1.94 0 0.02 0.11 0.02 0.12 0.05 l0.06 0.2 c0.15 0.54 0.35 1.1 0.73 1.54 0.83 0.98 1.65 1.57 2.8 2.13 0.99 0.49 1.99 0.89 3.04 1.21 l0.88 0.27 c3.73 1.13 9.54 1.88 13.49 2.09 l1.68 0.1 0.91 0.04 1.75 0.04 h2.53 s3.79 -0.13 3.79 -0.13 l2.4 -0.16 5.42 -0.59 c1.73 -0.19 3.4 -0.53 5.07 -0.98 l1.68 -0.46 2.54 -0.87 2.24 -1.03 c0.69 -0.32 1.28 -0.76 1.88 -1.24 l0.83 -0.83 c0.57 -0.56 0.6 -1.36 0.94 -1.4Z M25.53 50.65 c0.11 0.09 0.42 -0.07 0.43 -0.2 0.02 -0.33 0 -0.56 -0.06 -0.87 -0.63 -2.97 -0.9 -5.96 -0.86 -9.01 l-0.05 -0.64 c-0.06 -0.78 -0.82 -1.65 -1.7 -1.67 s-1.03 0.8 -1.02 1.51 c0.02 1.49 0.21 2.93 0.53 4.39 0.41 1.91 0.99 3.96 1.99 5.62 0.2 0.33 0.44 0.6 0.76 0.86Z M52.25 48.4 h0.09 c0 -0.01 0.01 0.11 0.01 0.11 l0.03 0.04 0.05 0.11 0.04 0.05 0.13 0.26 0.13 0.33 0.23 0.6 0.19 0.51 c0.12 0.32 0.29 0.61 0.57 0.79 s0.42 0.06 0.56 -0.06 c0.06 0.06 0.22 0.24 0.31 0.26 l0.84 0.17 c0.33 0.07 0.36 -0.32 0.35 -0.5 l-0.02 -0.63 v-0.99 c0.05 0.13 0.11 0.33 0.12 0.46 l0.08 0.72 v0.54 c0 0.1 0.1 0.3 0.17 0.34 s0.32 0.02 0.41 -0.02 l0.47 -0.19 c0.13 -0.06 0.2 -0.29 0.2 -0.45 h0.13 c0 0.01 0.07 0.14 0.07 0.14 0.02 0.04 0.18 0.01 0.22 -0.02 l0.35 -0.2 c0.17 -0.32 0.24 -0.69 0.32 -1.05 l0.19 -1.02 0.2 -1.01 c0.03 -0.14 0.1 -0.3 0.16 -0.45 l-0.03 0.49 -0.08 0.6 -0.11 0.68 -0.24 1.22 c-0.02 0.12 0.1 0.43 0.2 0.5 s0.54 0 0.63 -0.13 c0.18 -0.26 0.31 -0.55 0.39 -0.83 l0.21 -0.65 0.24 -0.5 c-0.01 0.19 -0.04 0.39 -0.09 0.53 l-0.26 0.77 c-0.06 0.18 -0.15 0.5 -0.16 0.7 s0.24 0.31 0.35 0.27 l0.47 -0.14 c0 -0.02 0.06 0.2 0.09 0.29 l0.58 0.11 0.4 0.16 0.37 0.1 0.55 0.13 0.6 0.11 c0.13 0.02 0.39 -0.05 0.51 -0.09 0.04 0.02 0.21 0.13 0.28 0.13 l0.78 -0.04 0.45 -0.04 0.57 -0.08 c0.45 -0.06 0.85 -0.26 1.2 -0.58 s0.21 -0.93 -0.11 -1.09 l-0.51 -0.25 c-0.09 -0.05 -0.21 -0.18 -0.29 -0.25 l-0.54 -0.47 -0.56 -0.5 -0.55 -0.5 -0.42 -0.35 -0.32 -0.23 -0.65 -0.53 -0.37 -0.1 c-0.12 -0.24 -0.29 -0.37 -0.55 -0.37 s-0.14 -0.27 -0.49 -0.41 -0.21 -0.1 -0.27 -0.13 c-0.43 -0.31 -0.65 -0.14 -0.97 -0.48 l-0.43 -0.1 c-0.4 -0.1 -0.77 -0.15 -1.17 -0.14 h-0.41 c0 0 -0.55 0.15 -0.55 0.15 l-0.41 0.18 -0.45 0.26 -0.35 0.24 c-0.5 0.33 -0.79 0.42 -1.34 0.2 l-0.72 -0.28 c-0.44 -0.17 -1.18 -0.34 -1.56 -0.28 -0.39 0.08 -0.93 0.14 -1.21 0.34 l-0.3 0.2 c-0.25 0.05 -0.57 0.26 -0.73 0.45 l-0.32 0.11 c-0.11 0.04 -0.24 0.28 -0.32 0.33 s-0.35 0.21 -0.43 0.31 l-0.33 0.36 c-0.52 0.25 -0.65 0.68 -0.94 0.87 s-0.27 0.18 -0.34 0.28 l-0.38 0.49 -0.47 0.59 -0.5 0.72 -0.22 0.21 -0.4 0.53 -0.32 0.39 c-0.08 0.1 -0.2 0.2 -0.32 0.3 -0.21 0.16 -0.32 0.5 -0.2 0.77 s0.41 0.44 0.7 0.53 l0.29 0.1 0.78 0.02 0.56 -0.02 0.78 -0.13 c0.31 -0.06 0.65 -0.1 0.93 -0.23 0.41 -0.2 0.73 -0.11 1.22 -0.43 0.11 -0.08 0.19 -0.11 0.32 -0.15 0.48 -0.13 0.98 -0.4 0.96 -0.54 l-0.04 -0.31 c0.17 0.08 0.41 0.16 0.57 0.13 s0.18 -0.13 0.19 -0.19 v-0.28 c0.15 0.23 0.56 0.32 0.7 0.03 s0 -0.47 -0.05 -0.64 l-0.16 -0.55 -0.28 -0.85 -0.15 -0.51 -0.03 -0.05 -0.04 -0.11 -0.04 -0.04 -0.05 -0.14Z M55.49 54.62 h-0.13 c-0.02 -0.13 -0.28 -0.24 -0.41 -0.26 l-0.53 -0.09 -0.35 -0.08 -0.42 -0.12 -0.43 -0.13 -0.56 -0.2 -0.76 -0.22 -0.54 -0.11 -0.62 -0.07 -0.44 0.05 -0.7 0.08 -0.64 0.17 -0.67 0.19 -0.54 0.14 -0.79 0.2 c-0.27 0.07 -0.73 0.06 -0.89 0.33 l-0.23 0.35 c-0.06 0.1 0.02 0.33 0.11 0.44 l0.27 0.35 c0.06 0.09 0.28 0.18 0.38 0.24 0.1 0.21 0.24 0.41 0.51 0.47 l0.15 0.29 0.43 0.34 c0.15 0.12 0.28 0.26 0.4 0.43 l0.29 0.16 c0.09 0.25 0.3 0.38 0.53 0.45 0.16 0.19 0.33 0.33 0.54 0.47 l0.5 0.34 0.53 0.3 0.82 0.39 0.76 0.29 0.48 0.13 0.55 0.15 0.77 0.1 c0.59 0.08 1.21 0.11 1.77 -0.08 l0.59 -0.2 c0.13 -0.05 0.39 -0.16 0.52 -0.13 l0.63 0.11 h0.83 c0.55 0.01 0.66 -0.2 0.98 -0.23 s0.37 -0.08 0.54 -0.22 c0.28 -0.25 0.4 0.02 0.79 -0.33 s0.24 -0.09 0.33 -0.14 l0.39 -0.25 0.61 -0.39 0.45 -0.32 0.46 -0.38 0.83 -0.85 0.33 -0.35 0.29 -0.31 c0.2 -0.21 0.38 -0.33 0.47 -0.61 l0.28 -0.17 0.14 -0.32 c0.37 -0.24 0.13 -0.39 0.53 -0.65 s0.29 -0.47 0.39 -0.61 c0.22 -0.24 0.41 -0.39 0.28 -0.79 s-0.43 -0.51 -0.58 -0.54 l-0.65 -0.1 -0.64 -0.05 -0.79 -0.06 -0.55 -0.08 -0.67 -0.03 c-0.32 -0.02 -0.62 0.03 -0.94 0.11 l-0.54 0.13 c-0.24 0.06 -0.45 0.2 -0.65 0.32 l-0.54 0.31 -0.46 0.24 -0.35 0.18 -0.21 0.19 c-0.2 -0.03 -0.51 0.14 -0.58 0.28 s-0.52 0.04 -0.54 0.37 l-0.02 0.35 -0.24 -0.34 -0.38 0.06 c-0.12 0.02 -0.33 0.1 -0.41 0.17 s-0.06 0.33 -0.05 0.48 l0.1 0.99 v0.99 s-0.03 0.66 -0.03 0.66 c0 0.03 -0.09 0.16 -0.09 0.17 l-0.06 -1.06 -0.05 -0.92 -0.04 -0.8 c-0.02 -0.48 -0.48 -0.68 -0.57 -0.61 l-0.25 0.18Z" fill="#f4ebdc" />
<path d="M23.1 54.84 l1.21 2.29 c-0.05 0.06 -0.19 0.13 -0.26 0.16 l-0.91 0.33 c-0.71 0.25 -1.34 0.64 -1.93 1.11 l-0.43 0.48 c-0.84 0.94 -0.33 2.32 0.7 3.24 0.72 0.64 1.47 1.21 2.36 1.58 l2.76 1.2 3.33 0.99 1.44 0.34 0.15 -0.1 c0 -0.12 0 -0.16 0.02 -0.17 l0.1 -0.02 -0.03 0.32 c-0.13 1.41 1.17 2.55 2.4 3.22 0.65 0.35 1.32 0.65 2.03 0.84 l2.29 0.6 3.63 0.57 c3.31 0.35 6.57 0.39 9.9 0.13 s3.33 -0.28 4.96 -0.68 l1.96 -0.47 1.05 -0.32 0.02 0.15 1.1 -0.19 2.04 -0.39 c1.63 -0.32 3.17 -0.79 4.73 -1.35 l4.44 -1.79 c0.76 -0.31 1.42 -0.73 2.08 -1.2 s0.77 -0.65 1.04 -1.09 c0.44 -0.71 0.21 -1.59 -0.44 -2.13 -0.5 -0.41 -1.04 -0.69 -1.63 -0.97 l-2.5 -0.77 0.14 -0.09 1.08 -0.53 1.01 -0.5 1.19 -0.42 2.03 -0.64 3.9 -1.5 0.13 0.1 0.5 -0.25 c0.1 -0.05 0.32 -0.02 0.43 0.04 l1.99 0.99 0.99 0.6 0.8 0.55 0.6 0.47 0.96 0.95 c0.57 0.56 0.95 1.25 1.15 2.05 0.48 1.84 -0.7 3.63 -2.09 4.83 l-0.5 0.43 -1.06 0.77 -1.65 1 -2.99 1.43 -4.26 1.52 -2.61 0.73 -2.97 0.68 -2.36 0.45 -2.31 0.36 -3.22 0.42 c-2.8 0.36 -5.57 0.55 -8.4 0.64 l-1.3 0.04 -1.9 0.04 -3.49 -0.04 -0.77 -0.02 -2.7 -0.13 -1.27 -0.09 -1.9 -0.16 c-3.94 -0.34 -7.8 -0.99 -11.64 -1.89 l-3.14 -0.82 c-1.48 -0.39 -2.9 -0.87 -4.3 -1.47 l-2.23 -0.96 -1.73 -0.87 c-1.28 -0.64 -2.43 -1.41 -3.53 -2.32 l-1.16 -1.13 c-0.31 -0.3 -0.54 -0.69 -0.76 -1.06 -0.74 -1.32 -0.61 -2.92 0.25 -4.1 l0.32 -0.44 1.06 -1.06 0.46 -0.38 0.34 -0.26 0.47 -0.31 c1.58 -1.04 4.07 -2.19 5.88 -2.77 l2.13 -0.69 0.54 -0.13 c0.06 -0.02 0.24 0.06 0.28 0.07Z" fill="#f4ebdb" />
<path d="M90.09 40.25 c0.77 3.82 -0.61 7.81 -3.28 10.69 s-2.58 2.38 -4.14 3.23 l-1.43 0.78 -4.06 1.8 -3.24 1.09 c-0.77 0.26 -1.51 0.51 -2.24 0.87 l-1.43 0.73 c-0.1 0.06 -0.31 0.11 -0.4 0.13 l0.13 -0.34 0.54 -0.84 1.46 -2.32 0.65 -1.1 c0.05 -0.09 0.11 -0.28 0.11 -0.35 l0.23 -0.15 c1.5 -0.35 2.92 -0.79 4.35 -1.34 3.37 -1.34 6.59 -3.3 8.13 -6.7 0.84 -1.87 1.03 -4.25 0.1 -6.07 -0.73 -1.4 -2.17 -2.16 -3.77 -2.06 -1.89 0.13 -3.52 1.36 -4.69 2.8 l-0.68 0.85 -0.17 0.21 c-0.06 0.01 -0.16 -0.18 -0.14 -0.26 l0.18 -1.62 0.25 -2.18 0.13 -1.28 0.34 0.13 0.73 -0.33 1.21 -0.61 c2.62 -1.06 5.53 -1.06 7.75 0.77 l0.92 0.91 0.24 0.3 c0.55 0.7 0.91 1.48 1.24 2.31 s0.23 0.41 0.45 0.57 c0.28 -0.23 0.2 -0.62 0.33 -0.63 h0.16Z" fill="#f4ebdb" />
<path d="M23.1 54.84 c-0.04 -0.02 -0.22 -0.09 -0.28 -0.07 l-0.54 0.13 -2.13 0.69 c-1.8 0.58 -4.29 1.73 -5.88 2.77 l-0.47 0.31 -0.34 0.26 -0.46 0.38 -1.06 1.06 -0.32 0.44 c-0.87 1.19 -0.99 2.79 -0.25 4.1 s0.45 0.77 0.76 1.06 l1.16 1.13 c1.09 0.92 2.25 1.69 3.53 2.32 l1.73 0.87 2.23 0.96 c1.41 0.61 2.82 1.08 4.3 1.47 l3.14 0.82 c3.85 0.91 7.7 1.55 11.64 1.89 l1.9 0.16 1.27 0.09 2.7 0.13 0.77 0.02 3.49 0.04 1.9 -0.04 1.3 -0.04 c2.83 -0.1 5.6 -0.28 8.4 -0.64 l3.22 -0.42 2.31 -0.36 2.36 -0.45 2.97 -0.68 2.61 -0.73 4.26 -1.52 2.99 -1.43 1.65 -1 1.06 -0.77 0.5 -0.43 c1.4 -1.21 2.58 -2.99 2.09 -4.83 -0.2 -0.79 -0.57 -1.48 -1.15 -2.05 l-0.96 -0.95 -0.6 -0.47 -0.8 -0.55 -0.99 -0.6 -1.99 -0.99 c-0.11 -0.06 -0.33 -0.09 -0.43 -0.04 l-0.5 0.25 -0.13 -0.1 0.31 -0.13 1.52 -0.72 2.19 1.13 c1.43 0.73 3.18 2.16 4.07 3.52 1.1 1.69 1.07 3.51 -0.02 5.2 -0.92 1.43 -2.37 2.56 -3.83 3.47 -3.35 2.09 -7.38 3.47 -11.22 4.44 l-5.94 1.21 c-3.44 0.57 -6.84 1 -10.34 1.14 l-6.3 0.24 h-2.97 s-6.69 -0.25 -6.69 -0.25 c-4.8 -0.33 -11.39 -1.21 -15.92 -2.62 l-2.79 -0.87 c-2.09 -0.65 -6.13 -2.43 -7.81 -3.66 l-2.01 -1.48 c-0.58 -0.43 -1.06 -0.97 -1.5 -1.54 -1.81 -2.32 -1.44 -4.68 0.58 -6.71 2.75 -2.77 7.5 -4.48 11.27 -5.55 l0.43 0.93Z" fill="#f8f4eb" />
<path d="M75.31 31.43 l-0.54 0.02 c-0.16 0.37 -0.46 0.1 -0.6 0.43 l-0.15 -0.1 -0.17 -0.37 -0.36 -0.35 c-0.03 -0.14 -0.11 -0.36 -0.22 -0.48 l-0.72 -0.75 c-0.62 -0.5 -1.27 -0.95 -2.01 -1.26 l-1.73 -0.72 -3.06 -0.89 c-1.47 -0.43 -2.96 -0.68 -4.48 -0.84 l-4.04 -0.45 c-6.08 -0.53 -11.69 -0.33 -17.77 0.34 -1.84 0.2 -3.59 0.47 -5.4 0.77 -2.76 0.47 -5.7 1.16 -8.15 2.5 -0.47 0.26 -0.93 0.54 -1.31 0.9 l-0.77 0.76 -0.18 0.4 c-0.13 0.02 -0.43 0.12 -0.51 0.26 l-0.46 0.73 -0.19 0.2 -0.21 -0.43 c-0.06 -0.11 -0.32 -0.23 -0.42 -0.18 l-0.44 0.19 -0.24 0.55 -0.13 -0.18 c0.09 -0.41 0.28 -0.79 0.5 -1.17 0.76 -1.31 2.01 -2.32 3.34 -3.05 2.38 -1.31 5.23 -2.13 7.9 -2.74 1.69 -0.38 3.34 -0.73 5.07 -0.93 l2.39 -0.28 c2.03 -0.23 4.01 -0.32 6.07 -0.38 3.66 -0.11 7.26 -0.02 10.9 0.31 3.92 0.34 7.85 0.91 11.56 2.17 s3.25 1.31 4.61 2.39 c0.67 0.54 1.49 1.51 1.76 2.28 l0.12 0.34Z" fill="#f4ebdb" />
<path d="M75.31 31.43 l0.14 0.5 -0.42 -0.02 0.19 0.3 c0.05 0.08 0.22 0.16 0.32 0.16 l0.11 1.16 c-0.33 0.03 -0.37 0.82 -0.94 1.4 l-0.83 0.83 c-0.59 0.48 -1.2 0.92 -1.88 1.24 l-2.24 1.03 -2.54 0.87 -1.68 0.46 c-1.68 0.45 -3.34 0.78 -5.07 0.98 l-5.42 0.59 -2.4 0.16 -3.79 0.13 h-2.53 s-1.75 -0.05 -1.75 -0.05 l-0.91 -0.04 -1.68 -0.1 c-3.95 -0.2 -9.77 -0.98 -13.49 -2.09 l-0.88 -0.27 c-1.06 -0.32 -2.06 -0.73 -3.04 -1.21 -1.16 -0.57 -1.97 -1.16 -2.8 -2.13 -0.38 -0.43 -0.57 -0.99 -0.73 -1.54 l-0.06 -0.2 c-0.01 -0.03 -0.12 -0.02 -0.12 -0.05 l0.22 -1.06 0.13 0.18 0.24 -0.55 0.44 -0.19 c0.11 -0.05 0.36 0.07 0.42 0.18 l0.21 0.43 0.19 -0.2 -0.06 0.52 c-0.32 2.54 3.79 4.18 6.02 4.85 5.03 1.54 10.79 2.13 16.06 2.3 h5.53 c2.94 -0.1 5.81 -0.31 8.71 -0.69 l3.73 -0.61 3.93 -0.95 c1.62 -0.39 3.1 -1.02 4.55 -1.82 l1.43 -0.94 c0.49 -0.32 0.86 -0.77 1.16 -1.27 s0.45 -1.27 0.25 -1.94 l0.15 0.1 c0.14 -0.33 0.43 -0.07 0.6 -0.43 l0.54 -0.02Z" fill="#f8f4eb" />
<path d="M70.73 60.78 l2.5 0.77 c0.58 0.28 1.13 0.55 1.63 0.97 0.65 0.54 0.88 1.43 0.44 2.13 -0.28 0.43 -0.62 0.79 -1.04 1.09 -0.66 0.47 -1.32 0.89 -2.08 1.2 l-4.44 1.79 c-1.57 0.55 -3.1 1.04 -4.73 1.35 l-2.04 0.39 -1.1 0.19 -0.02 -0.15 c0.76 -0.24 1.47 -0.58 2.19 -0.99 1.35 -0.77 2.32 -2.06 1.84 -3.55 l-0.11 -0.33 c1.47 -0.95 2.84 -1.99 4 -3.31 l1.18 -1.35 c0.55 0.06 1 -0.05 1.52 -0.14 l0.25 -0.05Z" fill="#ded0bc" />
<path d="M31.66 66.26 l-0.1 0.02 c-0.02 0 -0.02 0.06 -0.02 0.17 l-0.15 0.1 -1.44 -0.34 -3.33 -0.99 -2.76 -1.2 c-0.88 -0.38 -1.65 -0.95 -2.36 -1.58 -1.02 -0.91 -1.54 -2.31 -0.7 -3.24 l0.43 -0.48 c0.59 -0.47 1.21 -0.86 1.93 -1.11 l0.91 -0.33 c0.07 -0.02 0.21 -0.1 0.26 -0.16 l0.77 1.25 c1.65 2.65 4.14 5.51 6.78 7.21 l-0.22 0.67Z" fill="#e6dac8" />
<path d="M43.19 70.91 c0.07 -0.3 -0.36 -0.08 -1.06 -0.28 l-0.6 -0.16 c-1.55 -0.43 -2.99 -1.04 -4.44 -1.72 l-1.04 -0.49 -0.58 -0.25 c-0.2 -0.09 -0.65 -0.08 -0.81 0.06 l-0.27 0.32 c-0.07 0.09 0.12 0.32 0.24 0.31 l0.24 -0.04 0.7 0.57 c0.03 0.03 0.11 0.13 0.06 0.17 l-1.27 -0.61 c-0.44 -0.21 -0.79 -0.57 -1.1 -0.95 s-0.52 -1.2 -0.2 -1.56 c2.58 1.5 5.37 2.28 8.26 2.7 1.8 0.26 3.55 0.43 5.37 0.43 h2.13 c3.63 0 9.27 -0.84 12.48 -2.43 l1.43 -0.71 c0.4 0.94 -0.33 1.84 -1.17 2.33 -0.79 0.49 -1.63 0.9 -2.54 1.11 l-3.27 0.76 c-3.77 0.63 -8.73 0.79 -12.52 0.45Z" fill="#ded0bc" />
<path d="M90.09 40.25 h-0.16 c-0.13 0 -0.05 0.39 -0.33 0.63 -0.23 -0.16 -0.36 -0.34 -0.45 -0.57 -0.33 -0.83 -0.69 -1.62 -1.24 -2.31 l-0.24 -0.3 -0.92 -0.91 c-2.22 -1.82 -5.14 -1.82 -7.75 -0.77 l-1.21 0.61 -0.73 0.33 -0.34 -0.13 v-0.4 c2.31 -1.99 5.66 -2.96 8.61 -1.95 s4.22 3.06 4.77 5.76Z" fill="#f8f4eb" />
<path d="M43.19 70.91 l-0.5 -0.05 -0.39 -0.04 c-1.74 -0.18 -3.43 -0.43 -5.11 -0.89 l-1.61 -0.55 c0.06 -0.04 -0.02 -0.14 -0.06 -0.17 l-0.7 -0.57 -0.24 0.04 c-0.11 0.02 -0.31 -0.22 -0.24 -0.31 l0.27 -0.32 c0.16 -0.12 0.62 -0.13 0.81 -0.06 l0.58 0.25 1.04 0.49 c1.45 0.68 2.89 1.28 4.44 1.72 l0.6 0.16 c0.7 0.2 1.13 -0.02 1.06 0.28Z" fill="#f4ebdb" />
<path d="M76.71 36.86 l-0.13 1.28 -0.25 2.18 -0.18 1.62 c-0.01 0.08 0.1 0.27 0.14 0.26 l-0.46 0.56 -0.11 -0.05 -0.28 -3.13 c0 -0.05 0 -0.14 -0.04 -0.14 l-0.1 0.02 0.08 -0.61 0.16 -1.47 0.63 -0.47 0.54 -0.46 v0.4Z" fill="#ded0bc" />
<path d="M69.9 59.58 l-0.44 0.09 0.29 -0.96 0.36 -1.43 c0.02 -0.06 -0.02 -0.25 -0.06 -0.22 l0.14 -0.24 0.59 -1.01 0.14 -0.27 1.04 -0.43 0.8 -0.5 c0 0.09 -0.06 0.28 -0.11 0.35 l-0.65 1.1 -1.46 2.32 -0.54 0.84 -0.13 0.34Z" fill="#ded0bc" />
<path d="M75.67 34.13 v1.5 s-0.04 0.47 -0.04 0.47 c-0.04 -0.01 -0.1 -0.08 -0.12 -0.1 v-1.87 s0.15 0 0.15 0Z" fill="#f8f4eb" />
<path d="M75.46 31.94 l0.1 0.43 c-0.1 0.01 -0.28 -0.09 -0.32 -0.16 l-0.19 -0.3 0.42 0.02Z" fill="#f4ebdb" />
<path d="M57.35 50.85 l-0.02 -1.47 c-0.05 0.11 -0.13 0.35 -0.13 0.47 l0.02 1 c0 0.15 -0.06 0.39 -0.2 0.45 l-0.47 0.19 c-0.1 0.04 -0.33 0.07 -0.41 0.02 s-0.17 -0.24 -0.17 -0.34 v-0.54 s-0.07 -0.72 -0.07 -0.72 c-0.02 -0.12 -0.08 -0.33 -0.12 -0.46 v0.99 s0.02 0.63 0.02 0.63 c0 0.18 -0.03 0.57 -0.35 0.5 l-0.84 -0.17 c-0.09 -0.02 -0.25 -0.2 -0.31 -0.26 -0.14 0.12 -0.38 0.18 -0.56 0.06 -0.29 -0.19 -0.46 -0.48 -0.57 -0.79 l-0.19 -0.51 -0.23 -0.6 -0.13 -0.33 -0.13 -0.26 -0.06 0.05 0.15 0.51 0.28 0.85 0.16 0.55 c0.06 0.16 0.11 0.5 0.05 0.64 -0.13 0.28 -0.55 0.2 -0.69 -0.03 v0.28 c0 0.07 -0.12 0.18 -0.19 0.19 -0.17 0.02 -0.4 -0.06 -0.57 -0.13 l0.04 0.31 c0.02 0.12 -0.48 0.39 -0.96 0.54 s-0.2 0.08 -0.32 0.15 c-0.5 0.32 -0.82 0.24 -1.22 0.43 s-0.62 0.17 -0.93 0.23 l-0.78 0.13 -0.56 0.02 -0.78 -0.02 -0.29 -0.1 c-0.28 -0.1 -0.57 -0.25 -0.7 -0.53 s-0.02 -0.61 0.2 -0.77 0.24 -0.2 0.32 -0.3 l0.32 -0.39 0.4 -0.53 0.22 -0.21 0.5 -0.72 0.47 -0.59 0.38 -0.49 c0.08 -0.1 0.2 -0.18 0.34 -0.28 0.3 -0.2 0.42 -0.62 0.94 -0.87 l0.33 -0.36 c0.1 -0.1 0.32 -0.22 0.43 -0.31 s0.22 -0.3 0.32 -0.33 l0.32 -0.11 c0.15 -0.19 0.48 -0.39 0.73 -0.45 l0.3 -0.2 c0.29 -0.2 0.82 -0.28 1.21 -0.34 0.38 -0.08 1.12 0.1 1.56 0.28 l0.72 0.28 c0.54 0.21 0.84 0.13 1.34 -0.2 l0.35 -0.24 0.45 -0.26 0.41 -0.18 0.55 -0.14 h0.41 c0.4 -0.02 0.77 0.05 1.17 0.13 l0.43 0.1 c0.32 0.33 0.54 0.18 0.97 0.48 s0.16 0.09 0.27 0.13 c0.34 0.13 0.19 0.4 0.49 0.41 s0.43 0.13 0.55 0.37 l0.37 0.1 0.65 0.53 0.32 0.23 0.42 0.35 0.55 0.5 0.56 0.5 0.54 0.47 c0.08 0.07 0.2 0.2 0.29 0.25 l0.51 0.25 c0.32 0.16 0.37 0.83 0.11 1.09 s-0.75 0.53 -1.2 0.58 l-0.57 0.08 -0.45 0.04 -0.78 0.04 c-0.06 0 -0.24 -0.11 -0.28 -0.13 -0.12 0.04 -0.39 0.11 -0.51 0.09 l-0.6 -0.11 -0.55 -0.13 -0.37 -0.1 -0.4 -0.16 -0.58 -0.11 c-0.02 -0.1 -0.1 -0.32 -0.09 -0.29 l-0.47 0.14 c-0.11 0.03 -0.35 -0.15 -0.35 -0.27 0.02 -0.2 0.11 -0.52 0.16 -0.7 l0.26 -0.77 c0.05 -0.13 0.08 -0.33 0.09 -0.53 l-0.24 0.5 -0.21 0.65 c-0.1 0.28 -0.21 0.57 -0.39 0.83 s-0.49 0.21 -0.63 0.13 -0.22 -0.37 -0.2 -0.5 l0.24 -1.22 0.11 -0.68 0.08 -0.6 0.03 -0.49 c-0.07 0.15 -0.13 0.31 -0.16 0.45 l-0.2 1.01 -0.19 1.02 c-0.07 0.36 -0.13 0.73 -0.32 1.05 l-0.35 0.2 c-0.04 0.02 -0.2 0.06 -0.22 0.02 l-0.07 -0.13Z M53.74 49.1 l0.06 -0.14 -0.19 -0.77 -0.49 -1.22 0.18 0.85 0.43 1.29Z M52.02 47.63 l-0.13 0.09 0.24 0.39 0.13 -0.09 -0.24 -0.39Z M60.4 48.03 l-0.04 -0.17 c0 -0.03 -0.14 0.06 -0.15 0.09 l-0.04 0.4 0.23 -0.32Z M52.25 48.4 l0.05 0.14 0.05 -0.04 v-0.11 c-0.02 -0.06 -0.06 -0.13 -0.11 -0.24 -0.02 0.01 -0.09 0.1 -0.07 0.12 l0.08 0.12Z M61.37 48.77 c-0.02 0.04 -0.1 0.15 -0.11 0.19 l-0.13 0.5 c0.07 -0.03 0.2 -0.12 0.22 -0.16 l0.13 -0.46 c0.06 -0.19 0.16 -0.38 0.2 -0.58 l-0.2 0.34 -0.11 0.18Z M52.37 48.55 l-0.04 0.04 0.04 0.11 0.05 -0.05 -0.05 -0.11Z M51.86 50.45 l-0.1 -0.5 c-0.02 -0.1 -0.11 -0.28 -0.16 -0.36 l-0.53 -0.99 0.19 0.81 c0.03 0.14 0.16 0.43 0.25 0.55 l0.34 0.49Z M61.93 50.04 l0.32 -0.46 0.27 -0.69 -0.39 0.55 -0.24 0.42 -0.34 0.6 0.4 -0.43Z M53.82 49.15 l-0.04 0.04 0.04 0.04 0.04 -0.04 -0.04 -0.04Z M60.72 50.31 l0.38 -0.75 c-0.01 -0.1 -0.18 -0.11 -0.18 -0.02 -0.03 0.14 -0.06 0.35 -0.1 0.43 l-0.39 0.69 c0.07 -0.06 0.25 -0.26 0.31 -0.35Z M63.31 50.31 l0.3 -0.72 c-0.04 -0.12 -0.07 -0.13 -0.09 -0.02 l-0.33 0.63 0.12 0.11Z M62.48 50.49 l0.42 -0.43 c0.06 -0.06 -0.01 -0.26 -0.06 -0.24 l-0.45 0.6 0.09 0.07Z M50.33 49.99 l-0.04 0.04 0.04 0.04 0.04 -0.04 -0.04 -0.04Z M50.43 50.11 l-0.05 0.1 0.05 -0.1Z M50.5 50.2 l-0.09 0.07 0.49 0.73 0.05 -0.25 -0.44 -0.54Z M63.96 50.91 c0.28 -0.17 0.42 -0.43 0.43 -0.73 l-0.43 0.73Z M54.39 50.87 l-0.26 -0.57 0.08 0.56 0.18 0.02Z M63.13 50.45 h0 s0 0 0 0Z M48.93 50.62 l-0.16 -0.19 c0.01 0.13 0.02 0.22 0.04 0.27 l0.06 0.13 c0.02 0.03 0.13 -0.01 0.13 -0.04 s-0.04 -0.14 -0.07 -0.17Z M51.93 50.55 l-0.05 0.04 0.05 -0.04Z M52 50.6 v0.08 c0 0 0 -0.08 0 -0.08Z M63.07 50.67 c0 -0.05 -0.04 -0.09 -0.09 -0.09 s-0.09 0.04 -0.09 0.09 0.04 0.09 0.09 0.09 0.09 -0.04 0.09 -0.09Z M50.17 50.92 l-0.3 -0.25 c0.1 0.33 0.23 0.57 0.57 0.7 l-0.28 -0.45Z M49.94 51.93 l-0.69 -0.77 -0.27 -0.3 0.19 0.58 0.73 0.57 c-0.01 0.02 0.03 -0.07 0.04 -0.1Z M50.99 51.05 v-0.08 c0 0 0 0.08 0 0.08Z M51.08 51.05 l-0.04 0.04 0.04 0.04 0.04 -0.04 -0.04 -0.04Z M51.16 51.13 l-0.04 0.04 0.03 0.04 0.05 -0.04 -0.04 -0.04Z M51.23 51.33 v-0.12 c0.01 0 0 0.12 0 0.12Z M51.39 51.36 v0.11 s0 -0.11 0 -0.11Z M48.05 51.61 l-0.11 -0.11 0.02 0.18 0.1 -0.07Z M48.06 51.64 l-0.06 0.08 c0.04 0.08 0.13 0.33 0.24 0.4 l0.67 0.47 c-0.06 -0.11 -0.13 -0.23 -0.22 -0.31 l-0.42 -0.43 -0.22 -0.21Z M47.76 52.55 c-0.11 -0.15 -0.3 -0.28 -0.53 -0.35 0.14 0.21 0.32 0.35 0.48 0.46 l0.05 -0.1Z M47.82 52.64 l-0.06 0.06 0.05 0.04 0.05 -0.05 -0.04 -0.04Z M47.91 52.8 v-0.09 c0 0 0 0.09 0 0.09Z" fill="#c4665c" />
<path d="M55.36 54.61 l0.09 0.66 0.02 0.63 -0.02 0.54 c0 0.07 0.16 0.06 0.16 0 l0.02 -0.84 -0.1 -0.75 -0.02 -0.24 0.25 -0.18 c0.1 -0.08 0.55 0.13 0.57 0.61 l0.04 0.8 0.05 0.92 0.06 1.06 c0 0 0.09 -0.13 0.09 -0.17 l0.04 -0.66 v-0.99 s-0.1 -0.99 -0.1 -0.99 c-0.02 -0.15 -0.03 -0.39 0.05 -0.48 s0.29 -0.16 0.41 -0.17 l0.38 -0.06 0.24 0.34 0.02 -0.35 c0.02 -0.34 0.45 -0.21 0.54 -0.37 s0.39 -0.32 0.58 -0.28 l0.21 -0.19 0.35 -0.18 0.46 -0.24 0.54 -0.31 c0.2 -0.12 0.42 -0.26 0.65 -0.32 l0.54 -0.13 c0.32 -0.08 0.61 -0.13 0.94 -0.11 l0.67 0.03 0.55 0.08 0.79 0.06 0.64 0.05 0.65 0.1 c0.15 0.02 0.48 0.24 0.58 0.54 s-0.06 0.55 -0.28 0.79 c-0.11 0.14 -0.24 0.51 -0.39 0.61 -0.39 0.27 -0.15 0.42 -0.53 0.65 l-0.14 0.32 -0.28 0.17 c-0.08 0.3 -0.25 0.4 -0.47 0.61 l-0.29 0.31 -0.33 0.35 -0.83 0.85 -0.46 0.38 -0.45 0.32 -0.61 0.39 -0.39 0.25 c-0.1 0.06 -0.28 0.1 -0.33 0.14 -0.39 0.34 -0.54 0.09 -0.79 0.33 s-0.32 0.2 -0.54 0.22 -0.42 0.24 -0.98 0.24 h-0.83 c0 0 -0.63 -0.12 -0.63 -0.12 -0.13 -0.02 -0.38 0.1 -0.52 0.13 l-0.59 0.2 c-0.55 0.19 -1.18 0.15 -1.77 0.08 l-0.77 -0.1 -0.55 -0.15 -0.48 -0.13 -0.76 -0.29 -0.82 -0.39 -0.53 -0.3 -0.5 -0.34 c-0.2 -0.13 -0.37 -0.28 -0.54 -0.47 -0.23 -0.07 -0.44 -0.2 -0.53 -0.45 l-0.29 -0.16 c-0.13 -0.17 -0.25 -0.32 -0.4 -0.43 l-0.43 -0.34 -0.15 -0.29 c-0.27 -0.06 -0.42 -0.26 -0.51 -0.47 -0.11 -0.06 -0.32 -0.15 -0.38 -0.24 l-0.27 -0.35 c-0.09 -0.11 -0.16 -0.34 -0.11 -0.44 l0.23 -0.35 c0.16 -0.27 0.63 -0.26 0.89 -0.33 l0.79 -0.2 0.54 -0.14 0.67 -0.19 0.64 -0.17 0.7 -0.08 0.44 -0.05 0.62 0.07 0.54 0.11 0.76 0.22 0.56 0.2 0.43 0.13 0.42 0.12 0.35 0.08 0.53 0.09 c0.13 0.02 0.39 0.13 0.41 0.26Z M63.95 52.97 l-0.04 0.04 0.04 -0.04Z M62.91 53.11 l0.05 -0.08 -0.05 0.08Z M64 53.03 l-0.04 0.04 0.04 0.04 0.04 -0.04 -0.04 -0.04Z M63.01 53.11 l-0.06 0.05 0.06 0.11 0.08 -0.06 -0.08 -0.1Z M64.08 53.11 l-0.04 0.04 0.04 0.11 0.05 -0.04 -0.04 -0.11Z M63.1 53.23 l-0.04 0.08 0.24 0.48 0.27 0.38 c-0.02 -0.21 -0.12 -0.5 -0.27 -0.69 l-0.2 -0.25Z M64.18 53.27 l-0.04 0.05 0.04 -0.05Z M61.98 53.64 c0.02 -0.2 -0.08 -0.28 -0.24 -0.29 l0.24 0.29Z M61.83 55.63 l-0.14 -0.73 c-0.02 -0.1 -0.13 -0.29 -0.19 -0.38 l-0.66 -0.88 -0.1 0.1 c0.2 0.28 0.38 0.53 0.51 0.79 l0.3 0.61 0.29 0.49Z M62.86 55.23 c-0.03 -0.26 -0.06 -0.47 -0.11 -0.59 l-0.22 -0.52 c-0.07 -0.16 -0.35 -0.39 -0.52 -0.53 0.02 0.1 0.06 0.2 0.08 0.24 l0.27 0.52 0.27 0.39 0.24 0.49Z M59.98 54.32 l-0.04 0.04 0.04 0.04 0.04 -0.04 -0.04 -0.04Z M48.91 55.86 l0.26 -0.68 0.19 -0.72 -0.36 0.56 c-0.11 0.17 -0.11 0.57 -0.09 0.83Z M50.1 55.65 l0.16 -0.33 0.3 -0.87 c-0.08 0.06 -0.18 0.18 -0.24 0.28 l-0.35 0.65 -0.04 0.61 0.16 -0.33Z M60.08 54.64 l0.04 0.09 0.07 -0.06 -0.09 -0.13 c-0.02 -0.02 -0.03 -0.06 -0.06 -0.03 s-0.06 0.09 -0.04 0.1 l0.07 0.06Z M48.07 55.08 c0.23 -0.12 0.3 -0.35 0.18 -0.55 -0.09 0.19 -0.14 0.35 -0.18 0.55Z M59.7 56.25 l-0.18 -0.88 -0.17 -0.35 -0.31 -0.47 0.06 0.33 0.15 0.48 c0.11 0.33 0.27 0.6 0.46 0.91Z M60.21 54.69 l-0.1 0.08 0.11 0.35 0.24 0.74 0.33 1.22 c0.03 -0.36 -0.05 -0.65 -0.1 -1.02 l-0.06 -0.41 -0.25 -0.58 -0.18 -0.37Z M51.14 57.28 l0.16 -0.77 0.24 -0.83 c0.05 -0.16 0.07 -0.45 0.08 -0.65 l-0.33 0.7 c-0.06 0.13 -0.15 0.44 -0.15 0.58 v0.99Z M58.14 56.9 l-0.16 -0.79 -0.24 -0.94 -0.13 -0.05 0.28 1.4 0.23 0.54 0.02 -0.14Z M52.69 56.39 l0.12 -0.25 v-0.69 c0 -0.07 -0.02 -0.14 -0.01 -0.11 l-0.32 0.77 -0.04 0.87 c0.02 0.02 0.1 0.1 0.09 0.1 l0.16 -0.65Z M58.77 55.72 l-0.05 -0.28 c0 -0.04 -0.13 -0.04 -0.13 0 l0.02 0.15 0.02 0.13 c0 0.03 0.15 0.02 0.14 -0.02Z M53.63 56.88 l0.1 -0.52 v-0.73 c0 0 -0.11 0.11 -0.11 0.11 l-0.19 0.74 -0.05 0.72 -0.02 0.87 0.27 -1.2Z" fill="#c4665c" />
<path d="M72.78 54.62 l-0.8 0.5 -1.04 0.43 c0.9 -1.88 1.65 -3.79 2.29 -5.82 0.69 -2.21 1.21 -4.37 1.56 -6.66 l0.5 -3.21 0.03 -0.41 0.1 -0.02 c0.03 0 0.03 0.1 0.04 0.14 l0.28 3.13 0.11 0.05 0.46 -0.56 0.17 -0.21 0.68 -0.85 c1.16 -1.45 2.79 -2.68 4.69 -2.8 1.59 -0.11 3.04 0.66 3.77 2.06 0.95 1.83 0.76 4.21 -0.1 6.07 -1.54 3.4 -4.76 5.35 -8.13 6.7 -1.43 0.55 -2.86 0.98 -4.35 1.34 l-0.23 0.15Z M75.54 52.26 l3.17 -1.28 c2.64 -1.36 5.1 -3.36 5.87 -6.29 0.33 -1.28 0.29 -2.88 -0.49 -3.94 -1.24 -1.71 -3.75 -0.9 -5.15 0.59 l-0.91 0.99 -1.03 1.25 c-0.26 0.32 -0.62 0.57 -0.97 0.78 l-0.35 1.91 c-0.36 1.71 -0.81 3.35 -1.4 4.98 l-0.54 1.48 1.79 -0.5Z" fill="#2b2722" />
<path d="M25.53 50.65 c-0.32 -0.26 -0.55 -0.53 -0.76 -0.86 -0.99 -1.66 -1.58 -3.71 -1.99 -5.62 -0.32 -1.46 -0.51 -2.9 -0.53 -4.39 -0.01 -0.71 0.38 -1.53 1.02 -1.51 s1.65 0.89 1.7 1.67 l0.05 0.64 c-0.04 3.04 0.23 6.04 0.86 9.01 s0.09 0.55 0.06 0.87 -0.33 0.29 -0.43 0.2Z" fill="#f8f4eb" />
<path d="M55.49 54.62 l0.02 0.24 0.1 0.75 -0.02 0.84 c0 0.07 -0.16 0.07 -0.16 0 l0.02 -0.54 -0.02 -0.63 -0.09 -0.66 h0.13Z" fill="#ded0bc" />
<path d="M57.35 50.85 h-0.13 c0 -0.01 -0.02 -1.01 -0.02 -1.01 0 -0.11 0.1 -0.35 0.13 -0.47 l0.02 1.47Z" fill="#ded0bc" />
<path d="M73.49 31.06 c-0.08 -0.08 -0.38 -0.06 -0.44 0.04 -0.1 0.13 -0.13 0.39 -0.13 0.57 0.11 0.57 -0.03 1.12 -0.38 1.58 l-0.79 0.79 c-0.39 -0.47 -0.74 -0.86 -1.24 -1.14 l-1.46 -0.81 -1.69 -0.68 c-2.64 -1.06 -8.23 -1.8 -11.28 -2.04 -4.96 -0.39 -9.69 -0.37 -14.65 0.06 -3.77 0.32 -7.92 0.99 -11.5 2.17 -1.07 0.35 -2.07 0.8 -3.05 1.36 -0.69 0.39 -1.27 0.89 -1.77 1.48 l-0.1 0.11 c-0.04 0.05 -0.73 -0.41 -1.02 -1.13 s-0.13 -0.77 -0.1 -1.16 l0.07 -0.65 c0.01 -0.1 -0.18 -0.29 -0.28 -0.28 l0.18 -0.4 0.77 -0.76 c0.38 -0.36 0.83 -0.64 1.31 -0.9 2.43 -1.34 5.38 -2.03 8.15 -2.5 1.82 -0.31 3.56 -0.57 5.4 -0.77 6.07 -0.67 11.68 -0.87 17.77 -0.34 l4.04 0.45 c1.53 0.16 3 0.42 4.48 0.84 l3.06 0.89 1.73 0.72 c0.74 0.31 1.39 0.77 2.01 1.26 l0.72 0.75 c0.11 0.11 0.19 0.33 0.22 0.48Z" fill="#ded0bc" />
<path d="M73.49 31.06 l0.36 0.35 0.17 0.37 c0.2 0.67 0.11 1.33 -0.25 1.94 s-0.67 0.95 -1.16 1.27 l-1.43 0.94 c-1.45 0.79 -2.95 1.43 -4.55 1.82 l-3.93 0.95 -3.73 0.61 c-2.92 0.39 -5.78 0.6 -8.71 0.69 h-5.53 c-5.27 -0.15 -11.04 -0.75 -16.06 -2.29 -2.23 -0.69 -6.33 -2.31 -6.02 -4.85 l0.06 -0.52 0.46 -0.73 c0.09 -0.13 0.36 -0.24 0.51 -0.26 s0.28 0.17 0.28 0.28 l-0.07 0.65 c-0.05 0.39 -0.06 0.79 0.1 1.16 0.3 0.72 0.99 1.17 1.02 1.13 l0.1 -0.11 c0.5 -0.59 1.09 -1.1 1.77 -1.48 0.99 -0.55 1.97 -1 3.05 -1.36 3.59 -1.19 7.73 -1.85 11.5 -2.17 4.95 -0.43 9.69 -0.44 14.65 -0.06 3.06 0.24 8.64 0.99 11.28 2.04 l1.69 0.68 1.46 0.81 c0.51 0.28 0.86 0.69 1.24 1.14 l0.79 -0.79 c0.35 -0.46 0.5 -0.99 0.38 -1.58 0 -0.16 0.05 -0.43 0.13 -0.57 s0.36 -0.11 0.44 -0.04Z M44.16 38.75 l1.5 0.05 h3.47 s5.94 -0.3 5.94 -0.3 l2.96 -0.31 1.4 -0.18 c2.11 -0.28 4.17 -0.69 6.23 -1.23 l2.21 -0.69 c0.73 -0.23 1.38 -0.54 2.04 -0.93 s0.24 -0.31 0.22 -0.42 -0.11 -0.3 -0.18 -0.36 l-0.63 -0.52 -1.42 -0.73 c-0.99 -0.41 -1.95 -0.71 -2.98 -0.98 -4.15 -1.07 -8.74 -1.48 -13.04 -1.63 -1.96 -0.07 -3.86 -0.09 -5.82 0 l-2.23 0.11 -0.92 0.06 -1.06 0.08 -0.79 0.07 c-2.74 0.23 -8.54 1.1 -10.87 2.06 l-1.83 0.76 c-0.49 0.2 -0.98 0.43 -1.35 0.79 l-0.57 0.57 c-0.13 0.13 -0.09 0.44 0.09 0.54 0.47 0.26 0.91 0.47 1.42 0.64 l1.13 0.39 c2.49 0.84 7.34 1.6 10.04 1.8 l3.03 0.23 2.01 0.1Z" fill="#2b2722" />
<path d="M51.86 50.45 l-0.34 -0.49 c-0.09 -0.12 -0.22 -0.4 -0.25 -0.55 l-0.19 -0.81 0.53 0.99 c0.05 0.09 0.14 0.28 0.16 0.36 l0.1 0.5Z" fill="#e6dac8" />
<path d="M53.74 49.1 L53.32 47.81 L53.14 46.95 L53.62 48.18 L53.81 48.96 L53.74 49.1Z" fill="#e6dac8" />
<path d="M49.94 51.93 c-0.01 0.02 -0.06 0.11 -0.04 0.1 l-0.73 -0.57 -0.19 -0.58 0.27 0.3 0.69 0.77Z" fill="#e6dac8" />
<path d="M61.93 50.04 L61.52 50.46 L61.87 49.86 L62.11 49.45 L62.5 48.89 L62.24 49.58 L61.93 50.04Z" fill="#e6dac8" />
<path d="M47.95 51.67 l-0.02 -0.18 0.11 0.11 c0 0 0 0.02 0.01 0.03 l0.22 0.21 0.42 0.43 c0.09 0.09 0.16 0.19 0.22 0.31 l-0.67 -0.47 c-0.1 -0.07 -0.2 -0.32 -0.24 -0.4 -0.04 -0.02 -0.05 -0.02 -0.05 -0.04Z" fill="#e6dac8" />
<path d="M62.48 50.49 l-0.09 -0.07 0.45 -0.6 c0.05 -0.02 0.11 0.19 0.06 0.24 l-0.42 0.43Z" fill="#ded0bc" />
<path d="M50.17 50.92 l0.28 0.45 c-0.35 -0.12 -0.49 -0.37 -0.57 -0.7 l0.3 0.25Z" fill="#e6dac8" />
<path d="M50.38 50.21 L50.43 50.11 L50.5 50.2 L50.94 50.75 L50.89 50.99 L50.41 50.27 L50.38 50.21Z" fill="#f4ebdc" />
<path d="M63.31 50.31 l-0.12 -0.11 0.33 -0.63 c0.02 -0.11 0.06 -0.1 0.09 0.02 l-0.3 0.72Z" fill="#ded0bc" />
<path d="M47.71 52.65 c-0.17 -0.11 -0.33 -0.24 -0.48 -0.46 0.23 0.07 0.42 0.2 0.53 0.35 l0.06 0.1 0.04 0.04 0.04 0.04 v0.09 c0 0 -0.1 -0.08 -0.1 -0.08 l-0.05 -0.04 -0.06 -0.04Z" fill="#ded0bc" />
<path d="M61.49 48.82 l-0.13 0.46 c-0.02 0.05 -0.15 0.13 -0.22 0.16 l0.13 -0.5 c0.01 -0.05 0.1 -0.15 0.11 -0.19 l0.11 0.07Z" fill="#f4ebdc" />
<path d="M54.39 50.87 L54.2 50.86 L54.13 50.31 L54.39 50.87Z" fill="#ded0bc" />
<path d="M63.96 50.91 l0.43 -0.73 c0 0.3 -0.15 0.55 -0.43 0.73Z" fill="#ded0bc" />
<path d="M60.72 50.31 c-0.06 0.11 -0.24 0.31 -0.31 0.35 l0.39 -0.69 c0.04 -0.07 0.07 -0.28 0.1 -0.43 0 -0.1 0.17 -0.09 0.18 0.02 l-0.38 0.75Z" fill="#f4ebdc" />
<path d="M60.4 48.03 l-0.23 0.32 0.04 -0.4 c0 -0.03 0.14 -0.11 0.15 -0.09 l0.04 0.17Z" fill="#ded0bc" />
<path d="M51.88 47.67 L52.02 47.59 L52.26 47.98 L52.11 48.06Z" fill="#ded0bc" />
<path d="M48.93 50.62 c0.02 0.03 0.06 0.13 0.07 0.17 s-0.11 0.07 -0.13 0.04 l-0.06 -0.13 c-0.02 -0.05 -0.02 -0.13 -0.04 -0.27 l0.16 0.19Z" fill="#e6dac8" />
<path d="M61.49 48.82 l-0.11 -0.07 0.11 -0.18 0.2 -0.34 c-0.04 0.2 -0.13 0.39 -0.2 0.58Z" fill="#ded0bc" />
<path d="M52.33 48.39 h-0.09 c0 0.01 -0.08 -0.11 -0.08 -0.11 -0.02 -0.02 0.06 -0.11 0.07 -0.12 0.06 0.11 0.1 0.17 0.1 0.24Z" fill="#ded0bc" />
<path d="M62.89 50.67 a0.09 0.09 0 1 0 0.16 0 a0.09 0.09 0 1 0 -0.16 0Z" fill="#ded0bc" />
<path d="M50.99 51.05 L50.99 50.98 L51.08 51.05 L51.12 51.09 L51.16 51.13 L51.2 51.17 L51.25 51.21 L51.23 51.33 L51.16 51.21 L51.12 51.17 L51.08 51.13 L51.04 51.09 L50.99 51.05Z" fill="#f4ebdc" />
<path d="M51.39 51.47 v-0.11 s0 0.11 0 0.11Z" fill="#f4ebdc" />
<path d="M51.89 50.58 L51.93 50.55 L52 50.6 L52 50.67 L51.89 50.58Z" fill="#e6dac8" />
<path d="M63.13 50.45 h0 s0 0 0 0Z" fill="#ded0bc" />
<path d="M53.79 49.21 L53.83 49.17 L53.86 49.21 L53.83 49.24Z" fill="#e6dac8" />
<path d="M50.29 50.04 L50.32 50 L50.35 50.04 L50.32 50.08Z" fill="#f4ebdc" />
<path d="M53.63 56.88 L53.37 58.06 L53.39 57.2 L53.44 56.48 L53.63 55.74 L53.73 55.62 L53.74 56.36 L53.63 56.88Z" fill="#e6dac8" />
<path d="M60.08 54.64 l0.02 -0.11 0.09 0.13 0.02 0.03 0.18 0.37 0.25 0.58 0.06 0.41 c0.05 0.37 0.12 0.66 0.1 1.02 l-0.33 -1.22 -0.24 -0.74 -0.11 -0.35 v-0.05 c0.01 0 -0.02 -0.09 -0.02 -0.09Z" fill="#f4ebdb" />
<path d="M61.83 55.63 l-0.29 -0.49 -0.3 -0.61 c-0.13 -0.28 -0.31 -0.53 -0.51 -0.79 l0.1 -0.1 0.66 0.88 c0.06 0.09 0.17 0.28 0.19 0.38 l0.14 0.73Z" fill="#e6dac8" />
<path d="M51.14 57.28 v-0.99 c0 -0.14 0.09 -0.46 0.15 -0.58 l0.33 -0.7 c-0.01 0.2 -0.03 0.5 -0.08 0.65 l-0.24 0.83 -0.16 0.77Z" fill="#f4ebdb" />
<path d="M58.14 56.9 L58.12 57.04 L57.9 56.5 L57.61 55.11 L57.75 55.16 L57.98 56.09 L58.14 56.9Z" fill="#e6dac8" />
<path d="M62.86 55.23 l-0.24 -0.49 -0.27 -0.39 -0.27 -0.52 c-0.02 -0.04 -0.06 -0.13 -0.08 -0.24 0.16 0.13 0.45 0.35 0.52 0.53 l0.22 0.52 c0.06 0.13 0.09 0.33 0.11 0.59Z" fill="#e6dac8" />
<path d="M52.69 56.39 l-0.16 0.65 s-0.08 -0.08 -0.09 -0.1 l0.04 -0.87 0.32 -0.77 c0 -0.03 0 0.06 0.02 0.11 v0.69 c0 0 -0.13 0.25 -0.13 0.25Z" fill="#e6dac8" />
<path d="M59.7 56.25 c-0.19 -0.31 -0.35 -0.57 -0.46 -0.91 l-0.15 -0.48 -0.06 -0.33 0.31 0.47 0.17 0.35 0.18 0.88Z" fill="#e6dac8" />
<path d="M50.1 55.65 l-0.16 0.33 0.04 -0.61 0.35 -0.65 c0.06 -0.1 0.16 -0.21 0.24 -0.28 l-0.3 0.87 -0.16 0.33Z" fill="#e6dac8" />
<path d="M48.91 55.86 c-0.04 -0.26 -0.03 -0.66 0.09 -0.83 l0.36 -0.56 -0.19 0.72 -0.26 0.68Z" fill="#f4ebdb" />
<path d="M62.91 53.11 l0.05 -0.08 0.06 0.07 0.08 0.1 0.02 0.02 0.2 0.25 c0.15 0.19 0.26 0.47 0.27 0.69 l-0.27 -0.38 -0.24 -0.48 -0.06 -0.05 -0.06 -0.11 -0.05 -0.05Z" fill="#e6dac8" />
<path d="M48.07 55.08 c0.04 -0.18 0.1 -0.35 0.18 -0.55 0.11 0.2 0.05 0.43 -0.18 0.55Z" fill="#ded0bc" />
<path d="M58.77 55.72 c0 0.03 -0.14 0.05 -0.14 0.02 l-0.02 -0.13 -0.02 -0.15 c0 -0.03 0.12 -0.03 0.13 0 l0.05 0.28Z" fill="#ded0bc" />
<path d="M61.98 53.64 l-0.24 -0.29 c0.16 0 0.25 0.09 0.24 0.29Z" fill="#e6dac8" />
<path d="M63.91 53.01 L63.95 52.97 L64 53.03 L64.04 53.07 L64.08 53.11 L64.12 53.22 L64.18 53.27 L64.14 53.32 L64.07 53.26 L64.03 53.15 L64 53.11 L63.97 53.07 L63.91 53.01Z" fill="#ded0bc" />
<path d="M60.09 54.52 l-0.02 0.11 -0.07 -0.06 c-0.02 -0.02 0.02 -0.09 0.04 -0.1 s0.04 0.01 0.06 0.03Z" fill="#ded0bc" />
<path d="M59.93 54.37 L59.97 54.33 L60.01 54.37 L59.97 54.41Z" fill="#ded0bc" />
<path d="M44.16 38.75 l-2.01 -0.1 -3.03 -0.23 c-2.71 -0.2 -7.56 -0.96 -10.04 -1.8 l-1.13 -0.39 c-0.5 -0.16 -0.95 -0.38 -1.42 -0.64 s-0.22 -0.4 -0.09 -0.54 l0.57 -0.57 c0.36 -0.37 0.86 -0.6 1.35 -0.79 l1.83 -0.76 c2.32 -0.96 8.12 -1.84 10.87 -2.06 l0.79 -0.07 1.06 -0.08 0.92 -0.06 2.23 -0.11 c1.95 -0.1 3.85 -0.08 5.82 0 4.29 0.14 8.89 0.55 13.04 1.63 1.03 0.27 2 0.56 2.98 0.98 l1.42 0.73 0.63 0.52 c0.08 0.06 0.17 0.27 0.18 0.36 s-0.11 0.35 -0.22 0.42 c-0.66 0.39 -1.32 0.7 -2.04 0.93 l-2.21 0.69 c-2.06 0.55 -4.1 0.95 -6.23 1.23 l-1.4 0.18 -2.96 0.31 -5.94 0.3 h-3.47 s-1.5 -0.05 -1.5 -0.05Z M47.92 32.32 c1.82 -0.07 3.56 -0.08 5.37 -0.02 2.6 0.1 5.46 0.29 7.93 1.04 0.69 0.2 1.48 0.56 1.84 1.16 0.11 0.17 -0.08 0.5 -0.16 0.65 l-0.07 0.12 c-0.13 0.25 2.49 -0.11 2.37 -1.21 s-1.43 -1.21 -2.14 -1.35 l-2.36 -0.47 c-1.91 -0.24 -3.77 -0.44 -5.71 -0.5 l-5.33 -0.16 c-3.03 0.01 -8.7 0.24 -11.44 0.8 l-2.89 0.59 c-0.97 0.2 -1.85 0.54 -2.71 1.02 l-0.38 0.32 c-0.09 0.07 -0.23 0.29 -0.28 0.39 -0.14 0.33 0 0.7 0.28 0.92 0.68 0.55 2.42 1.02 3.31 1.1 l0.95 0.07 c0.03 0 0.15 -0.06 0.17 -0.09 s-0.05 -0.15 -0.08 -0.16 l-0.72 -0.31 c-0.75 -0.32 -1.76 -0.77 -1.28 -1.34 s0.53 -0.54 0.86 -0.65 l1.6 -0.6 c3.25 -0.91 7.42 -1.21 10.86 -1.35Z" fill="#432f21" />
<path d="M78.71 44.99 c-0.14 0.19 -0.52 0.49 -0.57 0.69 l-0.32 1.19 -0.25 1.05 -0.13 0.48 c-0.05 0.16 -0.1 0.5 0.01 0.64 s0.47 0.03 0.58 -0.06 l0.61 -0.4 0.66 -0.4 0.5 -0.36 c0.12 -0.1 0.26 -0.16 0.42 -0.16 -0.83 0.69 -1.69 1.28 -2.7 1.71 l-0.61 0.27 0.35 -1.43 0.6 -2.66 0.57 -0.65 1.29 -1.53 1.08 -1.05 c0.35 -0.35 1.1 -0.62 1.56 -0.48 s0.5 0.41 0.57 0.71 c0.28 1.13 -0.39 2.68 -1.21 3.61 -0.02 -0.33 0.15 -0.59 0.35 -0.8 l0.32 -0.54 0.19 -0.39 0.16 -0.5 0.1 -0.54 c0.02 -0.08 -0.07 -0.28 -0.09 -0.35 l-0.17 -0.68 c-0.05 -0.17 -0.46 -0.39 -0.64 -0.33 -0.57 0.2 -1.17 0.5 -1.53 0.91 l-0.35 0.41 -0.67 0.69 -0.32 0.44 -0.39 0.53Z" fill="#f8f4eb" />
<path d="M80.61 47.37 c-0.04 0.05 -0.2 0.1 -0.29 0.1 0 -0.08 0.12 -0.14 0.29 -0.1Z" fill="#f8f4eb" />
<path d="M81.63 46.23 l-0.07 0.19 c-0.02 0.04 -0.11 0.05 -0.14 0.03 l0.12 -0.23 c0.13 0.01 0.14 0.01 0.1 0Z" fill="#f8f4eb" />
<path d="M47.92 32.32 c-3.43 0.12 -7.6 0.43 -10.86 1.35 l-1.6 0.6 c-0.33 0.13 -0.64 0.39 -0.86 0.65 -0.48 0.57 0.54 1.02 1.28 1.34 l0.72 0.31 c0.03 0.02 0.11 0.15 0.08 0.16 s-0.14 0.09 -0.17 0.09 l-0.95 -0.07 c-0.89 -0.07 -2.63 -0.54 -3.31 -1.1 -0.27 -0.22 -0.41 -0.58 -0.28 -0.92 s0.19 -0.33 0.28 -0.39 l0.38 -0.32 c0.86 -0.49 1.74 -0.83 2.71 -1.02 l2.89 -0.59 c2.75 -0.56 8.41 -0.79 11.44 -0.8 l5.33 0.16 c1.94 0.06 3.8 0.26 5.71 0.5 l2.36 0.47 c0.73 0.14 2.08 0.73 2.14 1.35 0.12 1.09 -2.51 1.45 -2.37 1.21 l0.07 -0.12 c0.08 -0.15 0.27 -0.47 0.16 -0.65 -0.35 -0.59 -1.15 -0.95 -1.84 -1.16 -2.47 -0.76 -5.33 -0.95 -7.93 -1.04 -1.81 -0.07 -3.55 -0.06 -5.37 0.02Z" fill="#64432e" />
</g>
</svg>`,
  },
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
