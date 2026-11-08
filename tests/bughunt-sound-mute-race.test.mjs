import test from 'node:test';
import assert from 'node:assert/strict';

test('muting cancels a sound still waiting for its buffer, while forced auditions work', async () => {
  let started = 0;
  const pending = new Map();
  globalThis.window = {
    addEventListener() {}, removeEventListener() {},
    AudioContext: class {
      state = 'running';
      createGain() { return { gain: {}, connect() {} }; }
      createBufferSource() { return { connect() {}, start() { started++; } }; }
      decodeAudioData() { return Promise.resolve({}); }
    },
  };
  globalThis.fetch = (url) => new Promise((resolve) => pending.set(String(url), resolve));
  const { sfx } = await import('../js/sound.js');
  sfx.setEnabled(true);
  assert.equal(sfx.play('correct'), true);
  sfx.setEnabled(false);
  const correct = [...pending].find(([url]) => url.endsWith('/correct.mp3'))[1];
  correct({ ok: true, arrayBuffer: async () => new ArrayBuffer(0) });
  await new Promise(setImmediate);
  assert.equal(started, 0);
  assert.equal(sfx.play('correct', true), true);
  await new Promise(setImmediate);
  assert.equal(started, 1);
});
