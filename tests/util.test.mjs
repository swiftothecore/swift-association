import test from 'node:test';
import assert from 'node:assert/strict';
import {
  wordTaken, normalizeTitle, normalizeLyric, titleAcronym, versionFamilies,
  dailySeed, mulberry32, charmBlob, anniversaryNote, guestDayNote, thirteenNote, balanceLines,
} from '../js/util.js';

test('the prompt ledger treats a singular and its regular plural as one deal', () => {
  for (const [one, many] of [['hand', 'hands'], ['fence', 'fences'], ['lady', 'ladies']]) {
    assert.equal(wordTaken([one], many), true);
    assert.equal(wordTaken([many], one), true);
  }
  assert.equal(wordTaken(['hand'], 'handful'), false);
  assert.equal(wordTaken([], 'hand'), false);
});

test('typed titles fold stylized letters, conjunctions and numerals while lyric recall keeps numerals distinct', () => {
  assert.equal(normalizeTitle('Wi$h Li$t'), normalizeTitle('wish list'));
  assert.equal(normalizeTitle('Forever & Always'), normalizeTitle('Forever and Always'));
  assert.equal(normalizeTitle('Twenty-Two'), '22');
  assert.equal(normalizeTitle('Paper Trail (Ten Minute Version)'), 'paper trail 10 minute version');
  assert.notEqual(normalizeLyric('We waited ten days'), normalizeLyric('We waited 10 days'));
});

test('title initials split on punctuation between words and require at least three words', () => {
  assert.equal(titleAcronym('Come Back...Be Here'), 'cbbh');
  assert.equal(titleAcronym('Paper-Trail / By Night'), 'ptbn');
  assert.equal(titleAcronym('Forever & Always'), '');
});

test('nested pressings resolve all the way to their original song', () => {
  const original = { title: 'Paper Trail', album: 'Red' };
  const alternate = { title: 'Paper Trail (Acoustic)', album: 'Red' };
  const extended = { title: 'Paper Trail (Acoustic) [Extended]', album: 'Red' };
  const heads = versionFamilies([extended, alternate, original]);
  assert.equal(heads.get(extended), original);
  assert.equal(heads.get(alternate), original);
});

test('a saved daily RNG resumes on the next draw, including after the counter wraps', () => {
  const date = '2026-11-14';
  const rng = mulberry32(dailySeed(date));
  const firstPage = Array.from({ length: 8 }, () => rng());
  assert.ok(firstPage.every(value => value >= 0 && value < 1));
  const replay = mulberry32(dailySeed(date));
  assert.deepEqual(Array.from({ length: 8 }, () => replay()), firstPage);
  assert.notEqual(dailySeed(date), dailySeed('2026-11-15'));

  const saved = JSON.parse(JSON.stringify(rng.state()));
  const remaining = Array.from({ length: 8 }, () => rng());
  const resumed = mulberry32(0);
  resumed.seek(saved);
  assert.deepEqual(Array.from({ length: 8 }, () => resumed()), remaining);
});

test('a charm keeps its own highlighter mark between renders', () => {
  const earned = charmBlob('paper-trail');
  const other = charmBlob('night-watch');
  assert.deepEqual(charmBlob('paper-trail'), earned);
  assert.notDeepEqual(other, earned);
});

test('a shared album anniversary keeps both releases in chronological order', () => {
  const milestones = [
    { md: '10-27', year: 2023, kind: 'tv', title: "1989 (Taylor's Version)", album: '1989' },
    { md: '10-27', year: 2014, kind: 'album', title: '1989', album: '1989' },
  ];
  const note = anniversaryNote('2026-10-27', milestones);
  assert.ok(note);
  assert.equal(note.album, '1989');
  assert.equal(note.headline, '1989');
  assert.match(note.line, /turned 12.*Taylor's Version 3/);
  assert.equal(anniversaryNote('2026-10-28', milestones), null);
});

test('a guest arrival can supply its own headline and is read aloud as an opening', () => {
  const row = {
    md: '10-30', year: 2003, guest: 'wicked', name: 'Wicked',
    headline: 'Happy opening night, Wicked', arrived: 'opened on Broadway',
  };
  const note = guestDayNote('2026-10-30', [row]);
  assert.ok(note);
  assert.equal(note.headline, row.headline);
  assert.equal(note.guest, 'wicked');
  assert.match(note.aria, /opened on Broadway.*23 years ago/);
});

test('the lucky thirteen note recognizes both kinds of sums and a double thirteen', () => {
  assert.match(thirteenNote('2026-05-08')?.line ?? '', /8 \+ 5 = 13/);
  assert.match(thirteenNote('2026-07-24')?.line ?? '', /2 \+ 4 \+ 7 = 13/);
  assert.match(thirteenNote('2026-09-13')?.line ?? '', /1 \+ 3 \+ 9 = 13/);
  assert.equal(thirteenNote('2026-09-13')?.album, null);
  assert.equal(thirteenNote('2026-07-25'), null);
});

test('a long challenge label wraps to minimize its longest line without splitting words', () => {
  assert.deepEqual(balanceLines('I Have No Experience With Home Invasion', 2),
    ['I Have No Experience', 'With Home Invasion']);
  assert.deepEqual(balanceLines('  Homecoming  ', 2), ['Homecoming']);
});
