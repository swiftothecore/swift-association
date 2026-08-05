"use strict";

/* Swift To The Song Association - sound design (phase 2: real recordings).
 *
 * The palette is short recordings, auditioned and picked by ear from many
 * candidates, trimmed and level-matched offline. They live in sounds/:
 *   correct.mp3 - a small rising confirm (Material sound kit, CC-BY 4.0)
 *   wrong.mp3   - its sibling, a soft descending no (same kit, CC-BY 4.0)
 *   page.mp3    - a real paper page turn (freesound #630019, CC0)
 *   unlock.mp3  - a glockenspiel flourish for the rare achievement/mastery
 *                 unlock (freesound #456965, CC0), peak-matched to correct.
 *   hint.mp3    - that same glockenspiel's first note alone, trimmed dry and
 *                 mixed quietest in the palette (-13 dBFS): a small pip when a
 *                 hint tier reveals, reading as a cousin of the unlock.
 *   tick.mp3    - a real clock escapement, one tick (freesound #534094, CC0),
 *                 trimmed to the strike and mixed to -12 dBFS. Played three
 *                 times on the last three seconds of a round, and only ever
 *                 through a rising gain (see app.js) - the file is the loudest
 *                 of the three, the earlier two are attenuated at the call.
 *   close.mp3   - a notebook being shut: pages settling, then the cover landing
 *                 (freesound #425677, CC0), mixed to -11.9 dBFS peak. It marks
 *                 the end of a run, taking the slot where a page turn would be
 *                 if the run were going on: the last page never turns, the
 *                 book closes. Softer than the verdict chime on purpose: it is
 *                 the furniture moving, not a verdict on the run.
 *   scratch.mp3 - one dry graphite stroke (freesound #181056, CC0), trimmed to
 *                 a single mark and mixed quieter than anything else in the
 *                 palette (-15.8 dBFS peak, -34.5 RMS): it plays under the red
 *                 slash that crosses out a spent infinite-mode life, so it is a
 *                 texture beside the verdict chime, never a second verdict.
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
  unlock:  { url: new URL("../sounds/unlock.mp3", import.meta.url), gain: 1 },
  hint:    { url: new URL("../sounds/hint.mp3", import.meta.url), gain: 1 },
  tick:    { url: new URL("../sounds/tick.mp3", import.meta.url), gain: 1 },
  scratch: { url: new URL("../sounds/scratch.mp3", import.meta.url), gain: 1 },
  close:   { url: new URL("../sounds/close.mp3", import.meta.url), gain: 1 },
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
  // level is a per-play attenuation for a sound that is deliberately played at
  // more than one weight (the countdown tick's rising ladder); it multiplies
  // the sound's own palette gain and is never used to level-match a file.
  // Returns whether the sound was scheduled (it plays as soon as its buffer
  // is decoded, which after the pre-warm means immediately).
  play(name, force = false, level = 1) {
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
        const gain = spec.gain * level;
        if (gain !== 1) {
          const g = c.createGain();
          g.gain.value = gain;
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
