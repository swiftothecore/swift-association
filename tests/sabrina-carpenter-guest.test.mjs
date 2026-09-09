import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { GUESTS, GUESTS_COMING_SOON } from '../js/config.js';
import { STICKERS } from '../js/stickers.js';

const catalogue = JSON.parse(fs.readFileSync(
  new URL('../data/guests/sabrina-carpenter.json', import.meta.url),
  'utf8',
));

test('Sabrina Carpenter is a playable guest with her souvenir registered last', () => {
  const guest = GUESTS.find(({ id }) => id === 'sabrina-carpenter');
  assert.equal(guest?.file, 'data/guests/sabrina-carpenter.json');
  assert.equal(GUESTS_COMING_SOON.some(({ id }) => id === 'sabrina-carpenter'), false);
  assert.equal(STICKERS.at(-1).id, 'guest-sabrina-carpenter');
});

test('Sabrina Carpenter catalogue has the requested release splits', () => {
  assert.equal(catalogue.id, 'sabrina-carpenter');
  assert.deepEqual(
    catalogue.albums.map(({ album, songs }) => [album, songs.length]),
    [
      ['Eyes Wide Open', 12],
      ['EVOLution', 10],
      ['Singular: Act I', 8],
      ['Singular: Act II', 9],
      ['emails i can’t send fwd:', 17],
      ['Short n’ Sweet', 16],
      ['Man’s Best Friend', 13],
      ['fruitcake', 6],
      ['Singles & Collaborations', 14],
    ],
  );

  const songs = catalogue.albums.flatMap(({ songs }) => songs);
  assert.equal(songs.length, 105);
  assert.equal(new Set(songs.map(({ title }) => title.toLocaleLowerCase())).size, 105);
  assert.ok(songs.every(({ sections }) =>
    Array.isArray(sections) && sections.length > 0 &&
    sections.every(({ label, lines }) =>
      typeof label === 'string' && Array.isArray(lines) && lines.length > 0 &&
      lines.every((line) => typeof line === 'string' && line.length > 0))));

  assert.ok(catalogue.words.length >= 13);
  assert.equal(new Set(catalogue.words).size, catalogue.words.length);
});

test('Sabrina deluxe and bonus tracks are represented once', () => {
  const records = Object.fromEntries(catalogue.albums.map(({ album, songs }) => [album, songs]));
  const shortTitles = records['Short n’ Sweet'].map(({ title }) => title);
  assert.ok(shortTitles.includes('Please Please Please'));
  assert.equal(shortTitles.some((title) => title.includes('Dolly Parton')), false);
  assert.deepEqual(shortTitles.slice(-4), [
    '15 Minutes',
    "Couldn't Make It Any Harder",
    'Busy Woman',
    'Bad Reviews',
  ]);
  assert.equal(records['Man’s Best Friend'].at(-1).title, 'Such a Funny Way');
});
