import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ruleShapeFor, ruleTermsFrom, ruleMarkMarkup, ruleTermsSentence, ruleTermsMarkup,
} from '../js/rulemarks.js';

test('a late list, no hints and a title-only answer keep their separate rules', () => {
  assert.deepEqual(ruleTermsFrom({
    dropdown: 'late', hint: false, noTitle: true, seconds: 15, titleOnly: true,
  }), { suggest: 'late', hint: false, title: false, clock: true, sung: false });
});

test('a lyric-only page withholds suggestions and omits the hint and title marks', () => {
  assert.deepEqual(ruleTermsFrom({
    dropdown: 'late', hint: true, noTitle: true, lyricOnly: true, seconds: 0,
  }), { suggest: false, hint: null, title: null, clock: false, sung: 'only' });
});

test('tap grids and word answers only show terms that apply to their page', () => {
  const levers = { dropdown: true, hint: true, noTitle: true, seconds: 20 };
  for (const rule of ['sea', 'oddone', 'whoseline', 'common']) {
    assert.deepEqual(ruleTermsFrom({ ...levers, ...ruleShapeFor(rule) }), {
      suggest: null, hint: null, title: rule === 'sea' || rule === 'oddone' ? false : null,
      clock: true, sung: null,
    }, rule);
  }
  assert.deepEqual(ruleTermsFrom({ ...levers, ...ruleShapeFor('standard') }), {
    suggest: true, hint: true, title: false, clock: true, sung: true,
  });
});

test('late suggestions and lyric-only answers have their own drawings', () => {
  assert.match(ruleMarkMarkup('suggest', 'late'), /href="#rule-suggest-late"/);
  assert.doesNotMatch(ruleMarkMarkup('suggest', 'late'), /href="#rule-strike/);
  assert.match(ruleMarkMarkup('sung', 'only'), /href="#rule-sung-only"/);
  assert.doesNotMatch(ruleMarkMarkup('sung', 'only'), /href="#rule-strike/);
  assert.match(ruleMarkMarkup('sung', false), /href="#rule-sung".*href="#rule-strike-note"/);
});

test('the rule strip closes up absent marks and announces the remaining rules in order', () => {
  const terms = { sung: 'only', clock: false, title: null, hint: null, suggest: false };
  const sentence = ruleTermsSentence(terms);
  assert.match(sentence, /^no suggestions[^;]+; no clock[^;]+; sing the line.*a title won't do$/);

  const markup = ruleTermsMarkup(terms, { tips: false });
  assert.equal([...markup.matchAll(/class="rule-slot"/g)].length, 3);
  assert.match(markup, /href="#rule-suggest".*href="#rule-clock".*href="#rule-sung-only"/);
  assert.match(markup, /role="img" aria-label="This page: no suggestions/);
  assert.equal([...markup.matchAll(/aria-label=/g)].length, 1);
  assert.doesNotMatch(markup, /data-tip=/);
  assert.match(ruleTermsMarkup(terms, { labelled: false }), /^<span [^>]+aria-hidden="true"/);
});
