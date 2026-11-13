import test from 'node:test';
import assert from 'node:assert/strict';
import { dealPrint, creaseSvg, deskHangerSVG, smooth } from '../js/deskprint.js';

const prints = ['bridge', 'train', 'garden', 'shore', 'letters', 'window'];

test('the same date and owned prints give the same deal in any unlock order', () => {
  const date = '2026-11-14';
  const owned = Object.freeze([...prints]);
  const dealt = dealPrint(owned, date);
  assert.ok(owned.includes(dealt));
  dealPrint(owned.slice(1), '2026-11-15');
  assert.equal(dealPrint(owned, date), dealt);
  assert.equal(dealPrint([...owned].reverse(), date), dealt);
});

test('an empty collection has nothing to show and a lone print always deals', () => {
  for (const date of ['2024-02-29', '2024-03-01']) {
    assert.equal(dealPrint([], date), null);
    assert.equal(dealPrint(['bridge'], date), 'bridge');
  }
});

test('each lap deals every owned print and keeps its opening away from the previous tail', () => {
  // UTC epoch day 21000 starts a lap for both the five- and six-print collections.
  const firstDay = 21000;
  for (const owned of [prints.slice(0, 5), prints]) {
    const third = Math.floor(owned.length / 3);
    let previousTail = [];
    for (let lap = 0; lap < 8; lap++) {
      const hand = Array.from({ length: owned.length }, (_, i) => {
        const day = firstDay + lap * owned.length + i;
        const date = new Date(day * 86400000).toISOString().slice(0, 10);
        return dealPrint(owned, date);
      });
      assert.deepEqual([...hand].sort(), [...owned].sort(), `lap ${lap}`);
      assert.ok(hand.slice(0, third).every(id => !previousTail.includes(id)), `lap ${lap}`);
      previousTail = hand.slice(-third);
    }
  }
});

test('the flat print gets a decorative crease overlay', () => {
  const markup = creaseSvg();
  assert.match(markup, /^<svg [^>]*aria-hidden="true"/);
  assert.match(markup, /<path [^>]*stroke-opacity="[^"]+"/);
});

test('the hanger tells the player whether the print is kept or changes tomorrow', () => {
  const kept = deskHangerSVG(true);
  assert.match(kept, />DO NOT<.*>disturb</s);
  assert.match(kept, />staying on<.*>the desk</s);

  const daily = deskHangerSVG(false);
  assert.match(daily, />back<.*>tomorrow</s);
  assert.doesNotMatch(daily, />disturb</);
});

test('the easing leaves both endpoints in place and slows near each end', () => {
  assert.equal(smooth(0), 0);
  assert.equal(smooth(1), 1);
  assert.ok(smooth(0.25) > 0 && smooth(0.25) < 0.25);
  assert.ok(smooth(0.75) > 0.75 && smooth(0.75) < 1);
});
