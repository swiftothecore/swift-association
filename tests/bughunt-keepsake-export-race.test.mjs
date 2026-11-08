import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
const start = source.indexOf('let keepsakeSaveBusy = false;');
const end = source.indexOf('// Wired to the results-screen bracelet actions.', start);

test('a failed clipboard copy downloads the keepsake selected at the original click', async () => {
  const h = vm.createContext({ console: { warn() {} }, notifyNote() {} });
  vm.runInContext(source.slice(start, end), h);
  let run = 'original', reads = 0, rejectCopy, downloaded;
  const pending = h.saveKeepsakePNG(null, {
    meta: () => { reads++; return { run }; },
    copy: () => new Promise((_, reject) => { rejectCopy = reject; }),
    download: async (meta) => { downloaded = meta; }, noun: 'bracelet',
  });
  run = 'next';
  rejectCopy(new Error('clipboard denied'));
  await pending;
  assert.equal(downloaded.run, 'original');
  assert.equal(reads, 1);
});
