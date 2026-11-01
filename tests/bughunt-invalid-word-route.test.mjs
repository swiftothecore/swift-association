import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
const start = source.indexOf('function maybeStartFromWordParam()');
const end = source.indexOf('// Infinite mode:', start);

test('word deep links report whether a game actually started so panel routing can continue', () => {
  for (const [word, started] of [['not-a-real-prompt', false], ['love', true]]) {
    let cleanedURL;
    let attemptedWord;
    const context = vm.createContext({ URLSearchParams,
      location: { search: `?word=${word}&intro=0`, pathname: '/records', hash: '' },
      history: { replaceState: (_state, _title, url) => { cleanedURL = url; } },
      startFromWord: (value) => { attemptedWord = value; return started; },
    });
    vm.runInContext(source.slice(start, end), context);
    assert.equal(context.maybeStartFromWordParam(), started, word);
    assert.equal(attemptedWord, word);
    assert.equal(cleanedURL, '/records?intro=0');
  }
});
