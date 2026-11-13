import test from 'node:test';
import assert from 'node:assert/strict';
import {
  readSlipSwaps, buildSlipPuzzle, buildNamePuzzle, buildLineIndex,
  buildBlankPuzzle, buildWordFreq, judgeBlank, blankExact, blankSungOnce,
  buildRedactedPuzzle, buildChainPuzzle, buildWordIndex, buildOnlyHerePuzzle,
  onlyHerePoints, buildCloudPuzzle, buildRuthlessPuzzle, ruthlessLens,
  buildAlbumSheet, trackCandidates, resolveTrackGuess, judgeTrack,
  buildTrackPuzzle, buildCapitalsPuzzle, buildProducerPuzzle, buildPenPuzzle, buildNashvillePuzzle,
} from '../js/bonus.js';

const alwaysFirst = () => 0;
const alwaysLast = () => 0.999;
const makeSong = (title, lines, album = 'folklore') => ({
  title, album, lyrics: lines.join('\n'), sections: [{ label: 'Verse 1', lines }],
});

test('Spot the Slip drops stale authoring and keeps punctuation around the impostor', () => {
  const song = makeSong('Paper Trail', ['We found a Lantern, buried deep']);
  const { map, stale } = readSlipSwaps({
    [song.title]: [[0, 0, 2, 'lantern', 'compass'], [0, 0, 3, 'lantern', 'compass']],
  }, [song]);
  assert.equal(stale.length, 1);
  const page = buildSlipPuzzle([song], map, buildLineIndex([song]), alwaysFirst);
  assert.ok(page);
  assert.equal(page.realLine, song.sections[0].lines[0]);
  assert.equal(page.realWord, 'Lantern');
  assert.equal(page.tokens[page.answer].text, 'compass,');
  assert.equal(page.tokens.map(token => token.text).join(' '), 'We found a compass, buried deep');
});

test('Spot the Slip cannot deal a real lyric as a fake or replay a spent line', () => {
  const song = makeSong('Paper Trail', ['We found a lantern buried deep']);
  const other = makeSong('Night Watch', ['We found a compass buried deep!']);
  const { map } = readSlipSwaps({ [song.title]: [[0, 0, 3, 'lantern', 'compass']] }, [song]);
  assert.equal(buildSlipPuzzle([song], map, buildLineIndex([song, other]), alwaysFirst), null);

  const index = buildLineIndex([song]);
  const page = buildSlipPuzzle([song], map, index, alwaysFirst);
  assert.ok(page);
  assert.equal(buildSlipPuzzle([song], map, index, alwaysFirst, null, null, new Set([page.id])), null);
});

test('Spot the Slip falls back to a familiar fake when the fresh fake would make a real lyric', () => {
  const song = makeSong('Paper Trail', [
    'We found a lantern buried deep', 'She left a ribbon beside the stairs',
  ]);
  const other = makeSong('Night Watch', ['We found a compass buried deep']);
  const { map } = readSlipSwaps({ [song.title]: [
    [0, 0, 3, 'lantern', 'compass'], [0, 1, 3, 'ribbon', 'flower'],
  ] }, [song]);
  const page = buildSlipPuzzle([song], map, buildLineIndex([song, other]),
    alwaysFirst, null, new Set(['flower']));
  assert.equal(page?.fakeWord ?? null, 'flower');
});

test('Name That Song rejects a line shared by unrelated titles, even outside the deal pool', () => {
  const line = 'Silent lanterns linger beside silver windows';
  const song = makeSong('Paper Trail', [line]);
  const other = makeSong('Night Watch', [line.toUpperCase() + '!']);
  assert.equal(buildNamePuzzle([song], buildLineIndex([song, other]), alwaysFirst, 1), null);
});

test('Name That Song credits dealable versions and avoids repeating their family', () => {
  const line = 'Silent lanterns linger beside silver windows';
  const song = makeSong('Paper Trail', [line]);
  const alternate = makeSong('Paper Trail (Extended Version)', [line]);
  const songs = [song, alternate];
  const index = buildLineIndex(songs);
  const page = buildNamePuzzle(songs, index, alwaysFirst, 1);
  assert.ok(page);
  assert.equal(page.line, line);
  assert.deepEqual(page.also, [alternate.title]);
  assert.equal(buildNamePuzzle(songs, index, alwaysLast, 1, new Set([song.title])), null);
});

test('Name That Song can use a line shared only with a hidden cut', () => {
  const line = 'Silent lanterns linger beside silver windows';
  const song = makeSong('State Of Grace', [line], 'Red');
  const hidden = makeSong('State Of Grace (Acoustic Version)', [line], 'Red');
  const page = buildNamePuzzle([song], buildLineIndex([song, hidden]), alwaysFirst, 1);
  assert.ok(page);
  assert.equal(page.line, line);
  assert.deepEqual(page.also, []);
});

test('Sing It Back blanks a single answer that the line and title do not give away', () => {
  const song = makeSong('Getting Silver', ['Getting to Silver windows, with a lantern']);
  const page = buildBlankPuzzle([song], buildWordFreq([song]), alwaysFirst, 1);
  assert.ok(page);
  assert.equal(page.answer, 'windows');
  assert.equal(page.tokens.filter(token => token.blank).length, 1);
  assert.equal(page.tokens[page.at].core, 'windows');
  assert.equal(page.tokens[page.at].post, ',');
});

test('Sing It Back leaves no blank when two versions of the line would answer it', () => {
  const song = makeSong('Silver Windows Linger', [
    'Silver windows linger by the lantern',
    'SILVER windows linger by the compass!',
  ]);
  assert.equal(buildBlankPuzzle([song], buildWordFreq([song]), alwaysFirst, 1), null);
});

test('the blank judge forgives a swapped pair only when it is not another sung word', () => {
  const puzzle = { answer: 'form' };
  assert.equal(judgeBlank('from', puzzle, new Set(['form'])), true);
  assert.equal(judgeBlank('from', puzzle, new Set(['form', 'from'])), false);
  assert.equal(judgeBlank('foam', puzzle, new Set(['form', 'foam'])), false);
  assert.equal(judgeBlank('frames', puzzle, new Set(['form'])), false);
  assert.equal(judgeBlank('FORM!', puzzle), true);
  assert.equal(blankExact('FORM!', puzzle), true);
  assert.equal(blankExact('from', puzzle), false);
});

test('a once-sung blank uses catalogue occurrences regardless of capitalization', () => {
  const songs = [makeSong('Paper Trail', ['A lantern, a Lantern and a compass'])];
  const { freq } = buildWordFreq(songs);
  assert.equal(blankSungOnce({ answer: 'COMPASS' }, freq), true);
  assert.equal(blankSungOnce({ answer: 'lantern' }, freq), false);
});

const redactedLines = ['I saw a lantern near the window', 'You left a ribbon by the doorway'];

test('Redacted leaves part of each line visible and has one key per purchasable word', () => {
  const song = makeSong('Paper Trail', redactedLines);
  const page = buildRedactedPuzzle([song], buildWordFreq([song]), buildLineIndex([song]), alwaysFirst, 1);
  assert.ok(page);
  assert.equal(page.rows.length, 2);
  assert.ok(page.rows.every(row => row.some(token => !token.hide) && row.some(token => token.hide)));
  assert.deepEqual(new Set(page.rows.flat().filter(token => token.hide).map(token => token.key)),
    new Set(['saw', 'lantern', 'near', 'window', 'left', 'ribbon', 'doorway']));
  assert.equal(page.blocks, 7);
});

test('Redacted declines a verse that would still have two answers after every peel', () => {
  const song = makeSong('Paper Trail', redactedLines);
  const other = makeSong('Night Watch', redactedLines);
  const songs = [song, other];
  assert.equal(buildRedactedPuzzle([song], buildWordFreq(songs), buildLineIndex(songs), alwaysFirst, 1), null);
});

const chainLines = [
  'Silver lanterns light the harbor', 'Heavy curtains hide the moon', 'Quiet footsteps cross the platform',
  'Broken branches scrape the window', 'Wild horses scatter through the valley',
  'Velvet ribbons flutter above the stalls', 'Morning swimmers brave the chilly water',
  'Distant bells ring across the hills', 'Yellow taxis crowd the station',
  'Paper boats drift around the bend', 'Patient gardeners gather the roses',
  'Fallen apples carpet the orchard', 'Scarlet kites pull against their strings',
];

test('Then What deals consecutive answers and never reuses a decoy or borrows from another song', () => {
  const song = makeSong('Paper Trail', chainLines);
  const other = makeSong('Night Watch', ['Streetlights shimmer on the pavement']);
  const page = buildChainPuzzle([song, other], alwaysFirst, 1);
  assert.ok(page);
  assert.equal(page.anchor.text, chainLines[0]);
  assert.deepEqual(page.picks.map(pick => pick.answer.text), chainLines.slice(1, 5));
  const wrongCards = [];
  for (const pick of page.picks) {
    assert.equal(pick.cards.length, 3);
    assert.deepEqual(pick.cards.filter(card => card.right).map(card => card.text), [pick.answer.text]);
    wrongCards.push(...pick.cards.filter(card => !card.right).map(card => card.text));
  }
  assert.equal(new Set(wrongCards).size, 8);
  assert.ok(wrongCards.every(line => chainLines.slice(5).includes(line)));
});

test('Then What declines an anchor with two real continuations', () => {
  const song = makeSong('Paper Trail', [...chainLines, chainLines[0], 'Snowflakes gather on the roof']);
  assert.equal(buildChainPuzzle([song], alwaysFirst, 1), null);
});

const cloudWords = 'lantern compass window ribbon orchard harbor curtain platform branch valley ' +
  'garden pavement doorway rooftop meadow overcoat chimney hillside orchard clockwork ' +
  'mountain bookstore snowfall';

test('Word Cloud removes the title and its inflections, and counts repeats in the song', () => {
  const song = makeSong('Lantern', ['Lanterns lantern ' + cloudWords]);
  const index = buildWordIndex([song]);
  const page = buildCloudPuzzle([song], index, alwaysFirst, 1, null, { words: 12 });
  assert.ok(page);
  assert.equal(page.words.length, 12);
  assert.equal(page.words[0].word, 'orchard');
  assert.equal(page.words[0].count, 2);
  assert.ok(page.words.every(({ key }) => !['lantern', 'lanterns'].includes(key)));
});

test('Word Cloud declines a song with too few eligible words', () => {
  const song = makeSong('Lantern', ['Lanterns lantern and a ribbon']);
  assert.equal(buildCloudPuzzle([song], buildWordIndex([song]), alwaysFirst, 1), null);
});

test('Only Here counts an alternate pressing once and deals a uniquely rare word on a wide page', () => {
  const song = makeSong('Lantern', [cloudWords]);
  const alternate = makeSong('Lantern (Acoustic Version)', ['compass window']);
  const commonWords = cloudWords.split(' ').filter(word => word !== 'compass').join(' ');
  const otherSongs = Array.from({ length: 10 }, (_, i) => makeSong('Other ' + i, [commonWords]));
  const index = buildWordIndex([song, alternate, ...otherSongs]);

  const page = buildOnlyHerePuzzle([song], index, alwaysFirst, 1);
  assert.ok(page);
  assert.equal(page.hand.length, 6);
  assert.equal(new Set(page.hand.map(card => card.key)).size, 6);
  assert.ok(page.hand.every(card => card.key !== 'lantern'));
  assert.deepEqual(page.optimal.map(i => page.hand[i].key), ['compass']);
  assert.equal(page.hand[page.optimal[0]].count, 1);
  assert.equal(page.hand[page.optimal[0]].points, 5);
});

test('Only Here pays the advertised rarity tiers', () => {
  for (const [count, points] of [[1, 5], [2, 4], [3, 3], [4, 3], [5, 2], [9, 2], [10, 1]]) {
    assert.equal(onlyHerePoints(count), points, `${count} songs`);
  }
});

test('Ruthless starts on the chosen section and keeps writing past it', () => {
  const song = makeSong('Paper Trail', ['This opening verse stays hidden']);
  song.sections.push(
    { label: 'Chorus', lines: ['Silver lanterns shine through every window tonight'] },
    { label: 'Bridge', lines: [chainLines.slice(0, 5).join(' '), 'Here is the paper trail'] },
  );
  const page = buildRuthlessPuzzle([song], alwaysFirst, 1, null, ruthlessLens('chorus'));
  assert.ok(page);
  assert.equal(page.stream[0].text, 'Silver');
  assert.equal(page.stream.find(word => word.br)?.text, 'Silver');
  assert.equal(page.stream.at(-1).text, 'trail');
  assert.equal(buildRuthlessPuzzle([song], alwaysFirst, 1, null, ruthlessLens('verse-2')), null);
});

test('Ruthless declines short streams and songs off the studio albums', () => {
  const short = makeSong('Paper Trail', ['The paper trail runs cold']);
  const soundtrack = makeSong('Night Watch', chainLines, 'Songs From Movies');
  assert.equal(buildRuthlessPuzzle([short], alwaysFirst, 1), null);
  assert.equal(buildRuthlessPuzzle([soundtrack], alwaysFirst, 1), null);
});

test('Running Order preserves pressing numbers and Track by Track pre-fills alternate takes', () => {
  const original = makeSong('Paper Trail', [], 'Red');
  const alternate = makeSong('Paper Trail (Piano Version)', [], 'Red');
  const last = makeSong('Night Watch', [], 'Red');
  const index = { ask: new Set([last.title]), of: new Map([
    [last.title, { album: 'Red', track: 3, total: 3, alt: false }],
    [original.title, { album: 'Red', track: 1, total: 3, alt: false }],
    [alternate.title, { album: 'Red', track: 2, total: 3, alt: true }],
  ]) };
  const page = buildTrackPuzzle([alternate, last], index, alwaysFirst, 1);
  assert.ok(page);
  assert.equal(page.song, last);
  assert.equal(page.track, 3);
  const sheet = buildAlbumSheet('Red', index);
  assert.ok(sheet);
  assert.deepEqual(sheet.slots.map(slot => slot.title), [original.title, alternate.title, last.title]);
  assert.equal(sheet.asked, 2);
  assert.equal(resolveTrackGuess(alternate.title, trackCandidates(sheet)).hit, null);
});

test('Track by Track takes an exact title before fragments and refuses ambiguous fragments', () => {
  const titles = ['22', 'Evermore', 'Evermore Nights', 'Paper Trail', 'Paper Window', 'imgonnagetyouback'];
  const cands = trackCandidates({ slots: titles.map(title => ({ title })) });
  assert.equal(resolveTrackGuess('22', cands).hit, '22');
  assert.equal(resolveTrackGuess('evermore', cands).hit, 'Evermore');
  assert.equal(resolveTrackGuess('ever', cands).hit, null);
  assert.equal(resolveTrackGuess('paper', cands).hit, null);
  assert.equal(resolveTrackGuess('paper win', cands).hit, 'Paper Window');
  assert.equal(resolveTrackGuess('pap trail', cands).hit, null);
  assert.equal(resolveTrackGuess('im gonna get you back', cands).hit, 'imgonnagetyouback');
});

test('Track by Track forgives one unique typo but only clears the current slot', () => {
  const cands = trackCandidates({ slots: ['Golden Window', 'Paper Trail', 'Night', 'Light'].map(title => ({ title })) });
  assert.equal(judgeTrack('widnow', cands, 'Golden Window').correct, true);
  assert.equal(judgeTrack('paper trail', cands, 'Golden Window').correct, false);
  assert.equal(resolveTrackGuess('might', cands).hit, null);
  assert.equal(resolveTrackGuess('widnox', cands).hit, null);
});

test('The Capitals deals the authored message and its album for the reveal', () => {
  const song = makeSong('Paper Trail', []);
  const other = makeSong('Night Watch', []);
  const messages = new Map([[song.title, { album: song.album, message: 'Meet me at the station' }]]);
  const page = buildCapitalsPuzzle([other, song], messages, alwaysFirst, 1);
  assert.ok(page);
  assert.equal(page.song, song);
  assert.equal(page.album, 'folklore');
  assert.equal(page.message, 'Meet me at the station');
});

test('Aaron or Jack ignores credited songs from outside its records', () => {
  const outside = makeSong('Night Watch', [], 'Red');
  const inside = makeSong('Paper Trail', [], 'evermore');
  const credits = new Map([
    [outside.title, { by: 'jack', credit: 'Jack Antonoff' }],
    [inside.title, { by: 'aaron', credit: 'Aaron Dessner' }],
  ]);
  const page = buildProducerPuzzle([outside, inside], credits, alwaysFirst, 1);
  assert.ok(page);
  assert.equal(page.song, inside);
  assert.equal(page.by, 'aaron');
  assert.equal(page.credit, 'Aaron Dessner');
});

test('Who Held The Pen chooses a live credit bucket even when the larger bucket has more songs', () => {
  const [solo, anotherSolo, cowrite] = ['Paper Trail', 'Night Watch', 'Silver Window']
    .map(title => makeSong(title, [], 'Red'));
  const credits = new Map([
    [solo.title, { bucket: 'solo', writers: ['Taylor Swift'] }],
    [anotherSolo.title, { bucket: 'solo', writers: ['Taylor Swift'] }],
    [cowrite.title, { bucket: 'one', writers: ['Taylor Swift', 'Alex Doe'] }],
  ]);
  const songs = [solo, anotherSolo, cowrite];
  const page = buildPenPuzzle(songs, credits, () => 0.6, 1);
  assert.ok(page);
  assert.equal(page.song, cowrite);
  assert.equal(page.by, 'one');
  assert.equal(page.mates, 1);
  assert.equal(buildPenPuzzle(songs, credits, alwaysLast, 1, new Set([cowrite.title])).by, 'solo');
  assert.equal(buildPenPuzzle(songs, credits, alwaysLast, 1, new Set(credits.keys())), null);
});

test('Nashville chooses a side before a title and still deals when one side is spent', () => {
  const hers = { title: 'Silver Window' };
  const decoys = ['Paper Trail', 'Night Watch', 'City Lights'].map(title => ({ title, artist: 'Alex Doe' }));
  const pool = { hers: [hers], decoys };
  assert.equal(buildNashvillePuzzle(pool, () => 0.4).title, hers.title);
  const page = buildNashvillePuzzle(pool, alwaysFirst, new Set([hers.title]));
  assert.ok(page);
  assert.equal(page.hers, false);
  assert.equal(page.artist, 'Alex Doe');
  assert.equal(buildNashvillePuzzle(pool, alwaysFirst, new Set([hers, ...decoys].map(s => s.title))), null);
});
