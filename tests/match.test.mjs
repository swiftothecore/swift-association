import test from 'node:test';
import assert from 'node:assert/strict';
import {
  wordRegex, addedLettersRegex, buildLyricTokenIndex, indexMatches, siblingForm, compoundForm,
} from '../js/match.js';

test('the lyric index returns the same unique sheet positions as the live matcher', () => {
  const sheets = [
    'Hazed and hazy, but never hazing twice', 'I carried the case to the car',
    'Running and running past the cities', 'A RUN beside a stream',
    'Carpet, card and caring', 'CiTy at night', 'A ſtorm with thunder',
    'A new supercity, city_2 and city9', 'A caré beside the track',
    'Haze, then HAZE again', 'A haze\u0301 hangs in the air',
  ];
  const index = buildLyricTokenIndex(sheets);
  for (const word of ['haze', 'car', 'run', 'city', 'storm', 'window']) {
    for (const strict of [true, false]) {
      const rx = wordRegex(word, strict);
      const positions = sheets.flatMap((line, i) => rx.test(line) ? [i] : []);
      assert.deepEqual(indexMatches(index, word, strict), positions, `${word}, strict=${strict}`);
    }
  }
  assert.deepEqual(indexMatches(index, 'haze', true), [9]);
  assert.deepEqual(indexMatches(index, 'haze', false), [0, 9]);
  assert.deepEqual(indexMatches(index, 'car', false), [1]);
  assert.deepEqual(indexMatches(index, 'city', false), [2, 5]);
});

test('the index defers whole phrases and apostrophe-sensitive vetoes to the live matcher', () => {
  const sheets = ['New York at night', 'You could’ve called', 'Babe beside the window', 'A baby cries'];
  const index = buildLyricTokenIndex(sheets);
  for (const [word, hit, miss] of [['New York', 0, 1], ["could've", 1, 0], ['babe', 2, 3]]) {
    assert.equal(indexMatches(index, word, false), null);
    const rx = wordRegex(word, false);
    assert.equal(rx.test(sheets[hit]), true);
    assert.equal(rx.test(sheets[miss]), false);
  }
});

test('Common Thread accepts added endings but keeps the displayed stem intact', () => {
  const haze = addedLettersRegex('haze');
  for (const form of ['haze', 'hazed', 'hazer', 'hazers']) {
    assert.equal(haze.test(form), true, form);
  }
  for (const form of ['hazy', 'hazing']) {
    assert.equal(wordRegex('haze', false).test(form), true, form);
    assert.equal(haze.test(form), false, form);
  }
  assert.equal(addedLettersRegex('run').test('running'), true);
  assert.equal(addedLettersRegex('car').test('card'), false);
});

test('sibling hints pick the most sung near miss and leave accepted forms out', () => {
  const line = 'She works, she worked, and then she worked again';
  assert.equal(siblingForm('works', line, wordRegex('works', false)), 'worked');
  assert.equal(siblingForm('work', line, wordRegex('work', false)), '');
  assert.equal(siblingForm('work', line, wordRegex('work', true)), 'worked');
});

test('sibling hints show a sung ending and avoid misleading word families', () => {
  assert.equal(siblingForm('screams', 'I was screamin’', wordRegex('screams', false)), "screamin'");
  assert.equal(siblingForm('scar', 'I was scared', wordRegex('scar', false)), '');
  assert.equal(siblingForm('news', 'Something new arrived', wordRegex('news', false)), '');
});

test('compound hints require a real partner word and do not split ordinary endings', () => {
  const miss = (word, line, words) => compoundForm(word, line, wordRegex(word, false), new Set(words));
  assert.equal(miss('damn', 'A goddamn storm', ['god']), 'goddamn');
  assert.equal(miss('damn', 'A goddamn storm', ['storm']), '');
  assert.equal(miss('art', 'A heart on the page', ['he']), '');
  assert.equal(miss('bar', 'A barbed wire fence', ['bed']), '');
});
