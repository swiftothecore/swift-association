import test from 'node:test';
import assert from 'node:assert/strict';
import { wordRegex, addedLettersRegex, highlightWord } from '../js/match.js';

test('lenient matching recognizes ie-to-y participles and their sung g-drop', () => {
  for (const [word, forms] of [
    ['die', ['dying', "dyin'"]],
    ['lie', ['lying', 'lyin’']],
    ['tie', ['tying', "tyin'"]],
  ]) {
    for (const form of forms) {
      assert.equal(wordRegex(word, false).test(form), true, `${word}: ${form}`);
      assert.equal(wordRegex(word, true).test(form), false, `${word}: ${form}`);
      assert.equal(addedLettersRegex(word).test(form), false, `${word}: ${form}`);
    }
  }
  assert.equal(highlightWord('I was dying to know', 'die', false), 'I was <mark>dying</mark> to know');
  assert.equal(wordRegex('tie', false).test('trying'), false);
});
