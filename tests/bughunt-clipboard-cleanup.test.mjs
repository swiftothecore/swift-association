import test from 'node:test';
import assert from 'node:assert/strict';
import { copyToClipboard } from '../js/share.js';

test('a denied legacy copy removes its temporary field', async () => {
  const children = new Set();
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: {} });
  globalThis.window = { isSecureContext: false };
  globalThis.document = {
    body: { appendChild: (el) => children.add(el) },
    createElement: () => ({ style: {}, setAttribute() {}, select() {}, remove() { children.delete(this); } }),
    execCommand() { throw new DOMException('denied', 'SecurityError'); },
  };
  assert.equal(await copyToClipboard('test'), false);
  assert.equal(children.size, 0);
});
