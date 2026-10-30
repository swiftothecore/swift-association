import test from 'node:test';
import assert from 'node:assert/strict';
import { wordRegex, addedLettersRegex, falseFriendRegex, highlightWord } from '../js/match.js';

test('inherited object names are ordinary words without false-friend families', () => {
  for (const word of ['constructor', '__proto__']) {
    assert.equal(wordRegex(word, false).test(word), true);
    assert.equal(addedLettersRegex(word).test(word), true);
    assert.equal(falseFriendRegex(word), null);
    assert.equal(highlightWord(word + 's', word, false), '<mark>' + word + 's</mark>');
  }
  assert.equal(wordRegex('star', false).test('stared'), false);
  assert.equal(addedLettersRegex('star').test('stared'), false);
  assert.equal(falseFriendRegex('star').test('stared'), true);
});
