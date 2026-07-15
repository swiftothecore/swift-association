"use strict";

/* Swift To The Song Association - sound design (phase 1).
 *
 * Every effect is synthesized with the Web Audio API the moment it plays:
 * no audio files, nothing extra for the service worker to cache, nothing to
 * license. The palette is stationery, not arcade: paper, felt, one small
 * metal charm.
 *
 * The module holds no game state. app.js flips sfx.setEnabled() whenever the
 * sound setting changes and calls sfx.play(name) at the moments that should
 * sound; everything here stays inert while the setting is off.
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
let noiseBuf = null;   // shared 1s white-noise buffer (paper + thud textures)
let primeBound = false;

const MASTER_LEVEL = 0.55;

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

function noise(c) {
  if (noiseBuf) return noiseBuf;
  noiseBuf = c.createBuffer(1, c.sampleRate, c.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return noiseBuf;
}

// Percussive gain envelope: quick ramp to peak, exponential tail to silence.
function env(c, t0, peak, attack, decay) {
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.002), t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + attack + decay);
  return g;
}

// One decaying sine partial (the chime is a tiny chord of these).
function strike(c, t0, out, freq, peak, decay, delay = 0, detune = 0) {
  const o = c.createOscillator();
  o.type = "sine";
  o.frequency.value = freq;
  o.detune.value = detune;
  const g = env(c, t0 + delay, peak, 0.006, decay);
  o.connect(g); g.connect(out);
  o.start(t0 + delay);
  o.stop(t0 + delay + decay + 0.1);
}

/* ---------- the palette ---------- */

const RECIPES = {
  // A small metal charm, struck once: warm fundamental, a faint high shimmer
  // arriving a beat behind the strike, and a low body so it does not read thin.
  correct(c, t0, out) {
    strike(c, t0, out, 1174.7, 0.20, 0.50, 0, 3);     // D6, the charm itself
    strike(c, t0, out, 1760.0, 0.06, 0.32, 0.015);    // A6 shimmer
    strike(c, t0, out, 587.3, 0.05, 0.22);            // D5 body
  },

  // A fingertip on the desk: a soft pitch drop under a felt-muffled tap.
  // Gentle on purpose; a miss should never sting.
  wrong(c, t0, out) {
    const o = c.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(165, t0);
    o.frequency.exponentialRampToValueAtTime(88, t0 + 0.16);
    const g = env(c, t0, 0.35, 0.004, 0.22);
    o.connect(g); g.connect(out);
    o.start(t0); o.stop(t0 + 0.35);
    const tap = c.createBufferSource(); tap.buffer = noise(c);
    const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 420;
    const tg = env(c, t0, 0.12, 0.002, 0.07);
    tap.connect(lp); lp.connect(tg); tg.connect(out);
    tap.start(t0); tap.stop(t0 + 0.12);
  },

  // A page turning: white noise squeezed through a bandpass that sweeps up
  // and settles back down, like air moving over paper.
  page(c, t0, out) {
    const src = c.createBufferSource(); src.buffer = noise(c);
    const bp = c.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 0.85;
    bp.frequency.setValueAtTime(350, t0);
    bp.frequency.exponentialRampToValueAtTime(1900, t0 + 0.11);
    bp.frequency.exponentialRampToValueAtTime(600, t0 + 0.30);
    const g = env(c, t0, 0.40, 0.10, 0.21);
    src.connect(bp); bp.connect(g); g.connect(out);
    src.start(t0); src.stop(t0 + 0.4);
  },
};

export const sfx = {
  names: Object.keys(RECIPES),
  // Gate follows settings.sound (applySettings). Arming also binds the gesture
  // primer so a context created before any tap wakes on the first one.
  setEnabled(on) {
    enabled = !!on;
    if (enabled) bindPrime();
  },
  // force=true bypasses the setting (the dev panel's audition buttons).
  // Returns whether the sound was scheduled.
  play(name, force = false) {
    if (!enabled && !force) return false;
    const recipe = RECIPES[name];
    if (!recipe) return false;
    const c = ensureCtx();
    if (!c) return false;
    if (c.state === "suspended") c.resume().catch(() => {});
    recipe(c, c.currentTime, master);
    return true;
  },
  // Introspection for the dev panel: "uncreated" until the first play/prime.
  state: () => (ctx ? ctx.state : "uncreated"),
};
