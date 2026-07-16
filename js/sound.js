"use strict";

/* Swift To The Song Association - sound design (phase 2: real recordings).
 *
 * The palette is three short recordings, auditioned and picked by ear from
 * ~50 candidates, trimmed and level-matched offline. They live in sounds/:
 *   correct.mp3 - a small rising confirm (Material sound kit, CC-BY 4.0)
 *   wrong.mp3   - its sibling, a soft descending no (same kit, CC-BY 4.0)
 *   page.mp3    - a real paper page turn (freesound #630019, CC0)
 * correct and wrong come from the same Material family on purpose: their
 * relative balance (bright yes / softer no) is the kit's own, preserved when
 * the files were level-matched. Keep the palette stationery, never arcade.
 *
 * The module holds no game state. app.js flips sfx.setEnabled() whenever the
 * sound setting changes and calls sfx.play(name) at the moments that should
 * sound; everything here stays inert while the setting is off.
 *
 * Buffers are fetched + decoded lazily and cached (as promises, so concurrent
 * plays never double-fetch); enabling the setting pre-warms the whole palette
 * so the first real verdict doesn't wait on a fetch.
 *
 * Browsers gate audio behind a user gesture. The AudioContext is created
 * lazily; if it comes up suspended (setting already on at page load, before
 * any tap), a one-time pointer/key listener resumes it on the first gesture.
 * A sound scheduled while suspended is not lost: the context clock is paused,
 * so it plays the instant the primer wakes it.
 */

let ctx = null;        // lazy AudioContext
let master = null;     // one master gain over the whole palette
let enabled = false;
let primeBound = false;

const MASTER_LEVEL = 0.55;

// The files peak around -6 dBFS already; per-sound gain is for palette
// balance tweaks only, not level-matching (that is baked into the files).
const SOUNDS = {
  correct: { url: new URL("../sounds/correct.mp3", import.meta.url), gain: 1 },
  wrong:   { url: new URL("../sounds/wrong.mp3", import.meta.url), gain: 1 },
  page:    { url: new URL("../sounds/page.mp3", import.meta.url), gain: 1 },
};

const buffers = {}; // name -> Promise<AudioBuffer>

function ensureCtx() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = MASTER_LEVEL;
  master.connect(ctx.destination);
  return ctx;
}

// Resume a suspended context on the player's next gesture (autoplay policy).
function bindPrime() {
  if (primeBound) return;
  primeBound = true;
  const prime = () => {
    const c = ensureCtx();
    if (c && c.state === "suspended") c.resume().catch(() => {});
    window.removeEventListener("pointerdown", prime);
    window.removeEventListener("keydown", prime);
  };
  window.addEventListener("pointerdown", prime, { passive: true });
  window.addEventListener("keydown", prime);
}

function loadBuffer(name) {
  if (buffers[name]) return buffers[name];
  const c = ensureCtx();
  if (!c) return Promise.reject(new Error("no AudioContext"));
  buffers[name] = fetch(SOUNDS[name].url)
    .then((res) => {
      if (!res.ok) throw new Error(`sound fetch ${res.status}`);
      return res.arrayBuffer();
    })
    .then((data) => c.decodeAudioData(data))
    .catch((err) => {
      delete buffers[name]; // a failed fetch/decode retries on the next play
      throw err;
    });
  return buffers[name];
}

export const sfx = {
  names: Object.keys(SOUNDS),
  // Gate follows settings.sound (applySettings). Arming also binds the gesture
  // primer and pre-warms the decoded palette so the first play is instant.
  setEnabled(on) {
    enabled = !!on;
    if (!enabled) return;
    bindPrime();
    if (ensureCtx()) for (const n of Object.keys(SOUNDS)) loadBuffer(n).catch(() => {});
  },
  // force=true bypasses the setting (the dev panel's audition buttons).
  // Returns whether the sound was scheduled (it plays as soon as its buffer
  // is decoded, which after the pre-warm means immediately).
  play(name, force = false) {
    if (!enabled && !force) return false;
    const spec = SOUNDS[name];
    if (!spec) return false;
    const c = ensureCtx();
    if (!c) return false;
    if (c.state === "suspended") c.resume().catch(() => {});
    loadBuffer(name)
      .then((buf) => {
        const src = c.createBufferSource();
        src.buffer = buf;
        if (spec.gain !== 1) {
          const g = c.createGain();
          g.gain.value = spec.gain;
          src.connect(g); g.connect(master);
        } else {
          src.connect(master);
        }
        src.start();
      })
      .catch(() => {});
    return true;
  },
  // Introspection for the dev panel: "uncreated" until the first play/prime.
  state: () => (ctx ? ctx.state : "uncreated"),
};
