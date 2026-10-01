// A song drawn as its lyric sheet seen from across the room: one pencil bar per line, as long
// as the line is, standing on a centre line like a waveform, with a breath between sections.
// The lines that sing the page's word are the bars that light up.
//
// Pure and state-free: callers hand over the structured song and the regex they already match
// with, so the picture can never disagree with the verdict. Bars are nudged off true from a
// seed taken from the title, so a song always draws the same and no two draw alike.
const STEP = 3.1;          // one line
const BREATH = 4.2;        // extra room between sections
const H = 18, MID = 9;

function seeded(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 1000) / 1000; };
}
const f = (n) => +n.toFixed(2);

// song: { title, sections: [{ lines: [...] }] }, rx: the page's word regex (or null for none).
// Returns { svg, lines, hits }.
export function songWave(song, rx, cls = "") {
  const rnd = seeded(song.title || "");
  let x = 1.5, lines = 0, hits = 0, pencil = "", ink = "", wash = "";
  (song.sections || []).forEach((sec, si) => {
    if (si) x += BREATH;
    for (const line of sec.lines || []) {
      const len = Math.min(1, String(line).length / 46);
      const hit = !!(rx && rx.test(line));
      const half = hit ? 10.2 : 1.6 + len * 5.4 + (rnd() - 0.5) * 0.9;
      const lean = (rnd() - 0.5) * 0.7, dx = (rnd() - 0.5) * 0.35;
      const up = MID - half + (rnd() - 0.5) * 0.6, down = MID + half * (0.86 + rnd() * 0.2);
      const seg = `M${f(x + dx + lean)} ${f(up)}L${f(x + dx - lean * 0.4)} ${f(hit ? down : Math.min(H - 0.6, down))}`;
      if (hit) { ink += seg; wash += `<rect x="${f(x - 2.9)}" y="-1.2" width="5.8" height="${H + 2.4}" rx="1.6"/>`; hits++; }
      else pencil += seg;
      x += STEP; lines++;
    }
  });
  const w = f(x + 1.5);
  const svg = `<svg class="songwave${cls ? " " + cls : ""}" viewBox="0 0 ${w} ${H}" style="--sw-w:${w}" preserveAspectRatio="none" aria-hidden="true" focusable="false">` +
    `<g class="sw-wash">${wash}</g><path class="sw-pencil" d="${pencil}"/>${ink ? `<path class="sw-ink" d="${ink}"/>` : ""}</svg>`;
  return { svg, lines, hits };
}
