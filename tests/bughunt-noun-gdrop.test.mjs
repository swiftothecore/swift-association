import test from 'node:test';
import assert from 'node:assert/strict';
import { wordRegex, highlightWord } from '../js/match.js';

test('nouns ending in ing never lose their final g as a verb ending', () => {
  for (const word of ['thing', 'bring', 'spring', 'string', 'swing']) {
    assert.equal(wordRegex(word, false).test(word.slice(0, -1)), false, word);
    assert.equal(wordRegex(word, false).test(word), true, word);
    assert.equal(wordRegex(word, false).test(word + 's'), true, word);
  }
  const line = 'We always walked a very thin line';
  assert.equal(highlightWord(line, 'thing', false), line);
});

test('verb endings still accept g-dropped spellings', () => {
  for (const word of ['dancing', 'waiting', 'crying']) {
    for (const ending of ['', "'", '’']) {
      assert.equal(wordRegex(word, false).test(word.slice(0, -1) + ending), true);
    }
  }
});
