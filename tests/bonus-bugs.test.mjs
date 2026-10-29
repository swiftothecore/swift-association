import test from 'node:test';
import assert from 'node:assert/strict';
import { buildTrackPuzzle, buildCapitalsPuzzle, buildProducerPuzzle, buildNamePuzzle, buildLineIndex } from '../js/bonus.js';

const songs = [{ title: 'First', album: 'folklore' }, { title: 'Second', album: 'evermore' }];
const avoid = new Set(['First']);
const alwaysFirst = () => 0;

test('authored bonus pages draw remaining songs instead of falsely exhausting the pool', () => {
  const tracks = { ask: new Set(songs.map(s => s.title)), of: new Map(songs.map((s, i) =>
    [s.title, { album: s.album, track: i + 1, total: 2 }])) };
  const messages = new Map(songs.map(s => [s.title, { album: s.album, message: 'A clue' }]));
  const credits = new Map(songs.map(s => [s.title, { by: 'aaron', credit: 'Aaron Dessner' }]));
  for (const build of [
    blocked => buildTrackPuzzle(songs, tracks, alwaysFirst, 120, blocked),
    blocked => buildCapitalsPuzzle(songs, messages, alwaysFirst, 120, blocked),
    blocked => buildProducerPuzzle(songs, credits, alwaysFirst, 120, blocked),
  ]) {
    assert.equal(build(avoid).song.title, 'Second');
    assert.equal(build(new Set(songs.map(s => s.title))), null);
  }
});

test('Running Order prefers a fresh album but still deals when all albums have been seen', () => {
  const tracks = { ask: new Set(songs.map(s => s.title)), of: new Map(songs.map((s, i) =>
    [s.title, { album: s.album, track: i + 1, total: 2 }])) };
  assert.equal(buildTrackPuzzle(songs, tracks, alwaysFirst, 1, null, new Set(['folklore'])).song.title, 'Second');
  assert.equal(buildTrackPuzzle(songs, tracks, alwaysFirst, 1, avoid, new Set(['folklore', 'evermore'])).song.title, 'Second');
});

test('Name That Song cannot print a joined-up title with spaces as its clue', () => {
  const song = { title: 'imgonnagetyouback', sections: [{ label: 'Chorus',
    lines: ["But I'm gonna get you back", "I'm gonna get you back"] }] };
  assert.equal(buildNamePuzzle([song], buildLineIndex([song]), alwaysFirst, 1), null);
  song.sections[0].lines.push('Silent lanterns linger beside silver windows');
  assert.equal(buildNamePuzzle([song], buildLineIndex([song]), alwaysFirst, 1).line,
    'Silent lanterns linger beside silver windows');
});
