import { escapeRegExp } from '../../js/util.js';

// The unprepared search retained as an oracle for hit order, offsets and overlapping
// phrases. Each sheet starts from the typed text and builds its own patterns.
export function* referenceTypoFragments(np, lyrics, tokenTypoApart) {
  const words = np.split(' ');
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (i && !lyrics.includes(words.slice(0, i).join(' ') + ' ')) continue;
    if (i < words.length - 1 && !lyrics.includes(' ' + words.slice(i + 1).join(' '))) continue;
    const before = i ? escapeRegExp(words.slice(0, i).join(' ') + ' ') : '';
    const after = i < words.length - 1 ? escapeRegExp(' ' + words.slice(i + 1).join(' ')) : '';
    for (const length of [word.length, word.length - 1, word.length + 1, word.length - 2]) {
      if (length < 1) continue;
      const rx = new RegExp(`(?:^| )${before}(\\S{${length}})${after}`, 'g');
      let hit;
      while ((hit = rx.exec(lyrics))) {
        const at = hit.index + (hit[0].startsWith(' ') ? 1 : 0);
        rx.lastIndex = at + 1;
        if (!tokenTypoApart(word, hit[1])) continue;
        yield { at, phrase: hit[0].trim() };
      }
    }
  }
}
