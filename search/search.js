"use strict";
// Swift To The Lyric — the lyrics searcher. Reuses the game's matching core
// (../js/match.js), helpers (../js/util.js), and album data (../js/config.js) so a
// search returns exactly the lines the game would count as a match. Loads songs.json
// itself and works off the structured `sections` (label + lines) so every hit knows
// its section and per-section line number without re-parsing strings.
import { escapeHtml, escapeRegExp, fuzzySubstringRatio } from "../js/util.js";
import { wordRegex, wordVariants } from "../js/match.js";
import { ALBUM_COLORS, SEARCH_KEY } from "../js/config.js";

const $ = (id) => document.getElementById(id);
const FUZZY_MIN = 0.78;   // token similarity needed for a fuzzy hit (0..1)
const RECENT_MAX = 8;     // how many recent searches to keep

let SONGS = [];                  // flat: { title, album, sections:[{label, lines}] }
const ALBUM_INDEX = new Map();   // album name -> release order (from songs.json order)
const PROMPT_WORDS = new Set();  // words.json (lowercased) — only these can "play in the game"

// Section TYPES present in the data (for the structural filter), in a sensible order.
const SECTION_ORDER = ["(intro)", "Intro", "Verse", "Pre-Chorus", "Chorus", "Post-Chorus",
  "Refrain", "Hook", "Bridge", "Outro", "Interlude", "Spoken", "Breakdown", "Coda"];
let SECTION_TYPES = [];

// `terms` are committed search chips (AND-ed together); `q` is the live, not-yet-committed
// word in the input. A line must hold every active term to count as a hit.
const state = { q: "", terms: [], mode: "stem", grouped: true, section: "any", pos: "any" };

/* ---------- persistence (shared-origin localStorage) ----------
   We remember the two "how to search" preferences (match mode + layout) across visits —
   the one thing the popular competitor explicitly doesn't. The content filters
   (section/position) are deliberately NOT persisted: a sticky filter silently hiding
   results on the next visit is a trap. Both still travel in the deep-link hash. */
function loadStore() {
  try { return JSON.parse(localStorage.getItem(SEARCH_KEY)) || {}; } catch (e) { return {}; }
}
function saveStore(o) {
  try { localStorage.setItem(SEARCH_KEY, JSON.stringify(o)); } catch (e) { /* private mode / full disk */ }
}
function applyPrefs() {
  const s = loadStore();
  if (["stem", "exact", "fuzzy", "contains"].includes(s.mode)) state.mode = s.mode;
  if (s.view === "flat") state.grouped = false;
  else if (s.view === "grouped") state.grouped = true;
}
function savePrefs() {
  const s = loadStore();
  s.mode = state.mode;
  s.view = state.grouped ? "grouped" : "flat";
  saveStore(s);
}

function getRecent() {
  const r = loadStore().recent;
  return Array.isArray(r) ? r : [];
}
// Record a settled query. Collapsing entries that are a prefix of the new one folds the
// keystroke trail ("lov" → "love") into a single entry without a debounce timer.
function pushRecent(raw) {
  const q = raw.trim();
  if (q.length < 2) return;
  const ql = q.toLowerCase();
  const s = loadStore();
  const recent = (Array.isArray(s.recent) ? s.recent : [])
    .filter((e) => { const el = e.toLowerCase(); return el !== ql && !ql.startsWith(el); });
  recent.unshift(q);
  s.recent = recent.slice(0, RECENT_MAX);
  saveStore(s);
}
function clearRecent() {
  const s = loadStore();
  delete s.recent;
  saveStore(s);
}

/* ---------- data ---------- */
async function loadData() {
  const res = await fetch("../songs.json");
  if (!res.ok) throw new Error("Failed to load songs.json");
  const grouped = await res.json();
  grouped.forEach((g, i) => ALBUM_INDEX.set(g.album, i));
  // The prompt-word list the game plays from — gates the "play this word" link so it
  // only appears for words a round can actually start on. A miss is non-fatal: the game
  // re-validates and silently ignores an unknown ?word=, so a stale list never breaks play.
  try {
    const wr = await fetch("../words.json");
    if (wr.ok) for (const w of await wr.json()) PROMPT_WORDS.add(String(w).toLowerCase());
  } catch (e) { /* searcher still works without the play-in-game link */ }
  SONGS = grouped.flatMap(({ album, songs }) =>
    songs.map((s) => ({ title: s.title, album, sections: Array.isArray(s.sections) ? s.sections : [] }))
  );
  const set = new Set();
  for (const s of SONGS) for (const sec of s.sections) set.add(sectionType(sec.label));
  SECTION_TYPES = SECTION_ORDER.filter((t) => set.has(t))
    .concat([...set].filter((t) => !SECTION_ORDER.includes(t)).sort());
}

/* ---------- search ---------- */
function sectionName(label) { return label && label.trim() ? label : "(intro)"; }
// The bare section TYPE (drop the trailing number): "Verse 1" -> "Verse", "" -> "(intro)".
function sectionType(label) {
  const t = (label || "").replace(/\s*\d+\s*$/, "").trim();
  return t || "(intro)";
}

// Per-section display labels, disambiguating repeats ("Chorus (2)") so a hit's
// location is unambiguous when a section type recurs in a song.
function sectionDisplays(song) {
  const totals = {};
  for (const sec of song.sections) { const n = sectionName(sec.label); totals[n] = (totals[n] || 0) + 1; }
  const seen = {};
  return song.sections.map((sec) => {
    const n = sectionName(sec.label);
    seen[n] = (seen[n] || 0) + 1;
    return totals[n] > 1 ? `${n} ${seen[n]}` : n;
  });
}

function makeHit(sec, si, li, label, html) {
  const lines = sec.lines || [];
  return {
    sectionLabel: label,
    sectionIndex: si,
    lineNo: li + 1,                                  // per-section, 1-based
    html,
    prev: li > 0 ? lines[li - 1] : null,
    next: li < lines.length - 1 ? lines[li + 1] : null,
  };
}

// Wrap a set of match ranges in <mark> (used by fuzzy, which locates its tokens by
// similarity rather than regex). Ranges may arrive unsorted or overlapping.
function markRanges(line, ranges) {
  const sorted = ranges.filter((r) => r.start >= 0).sort((a, b) => a.start - b.start);
  let html = "", pos = 0;
  for (const r of sorted) {
    if (r.start < pos) continue;   // overlaps an earlier mark — skip
    html += escapeHtml(line.slice(pos, r.start)) + "<mark>" +
      escapeHtml(line.slice(r.start, r.start + r.len)) + "</mark>";
    pos = r.start + r.len;
  }
  return html + escapeHtml(line.slice(pos));
}

// Highlight every occurrence of every term in one pass (stem/exact). Mirrors the game's
// highlightWord: prefer the exact word when the line holds it, else the stem variants, so
// "babe" never circles "baby". One combined global regex marks all the terms at once.
function termBody(line, term, strict) {
  if (strict) return escapeRegExp(term);
  const exactRx = new RegExp("\\b" + escapeRegExp(term) + "\\b", "i");
  return exactRx.test(line) ? escapeRegExp(term) : wordVariants(term).join("|");
}
function highlightTerms(line, terms, strict) {
  const body = terms.map((t) => termBody(line, t, strict)).join("|");
  return escapeHtml(line).replace(new RegExp("\\b(" + body + ")\\b", "ig"), "<mark>$1</mark>");
}

// The best fuzzy token range for one term in a line, or null if nothing clears the bar.
function fuzzyTermRange(line, term) {
  const ql = term.toLowerCase();
  let best = 0, bestIdx = -1, bestLen = 0;
  for (const m of line.matchAll(/[A-Za-z']+/g)) {
    const tok = m[0];
    if (tok.length < 2 || Math.abs(tok.length - ql.length) > 2) continue;   // cheap length prefilter
    const r = fuzzySubstringRatio(ql, tok.toLowerCase());
    if (r > best) { best = r; bestIdx = m.index; bestLen = tok.length; }
  }
  return best >= FUZZY_MIN ? { start: bestIdx, len: bestLen } : null;
}

// Substring ("letters inside a word") match: the query letters appearing consecutively
// anywhere inside a single word — test in pro⟨test⟩ed. This is deliberately NOT a game-valid
// match (the game only counts whole words and their forms), so it's a wordplay/curiosity
// tool and the UI labels it as such. Scoped to one token so it never runs across a space,
// and it returns just the matched letters' range (not the whole word) so the mark is tight.
function containsTermRange(line, term) {
  const ql = term.toLowerCase();
  for (const m of line.matchAll(/[A-Za-z']+/g)) {
    const idx = m[0].toLowerCase().indexOf(ql);
    if (idx >= 0) return { start: m.index + idx, len: ql.length };
  }
  return null;
}

// Position filter against a single range ("starts the line" / "ends the line" = only
// non-letters before / after it). With several terms it judges the first term's match.
function passesPosition(line, range) {
  if (state.pos === "start") return /^[^A-Za-z]*$/.test(line.slice(0, range.start));
  if (state.pos === "end") return /^[^A-Za-z]*$/.test(line.slice(range.start + range.len));
  return true;
}

// One song's hits for an AND-list of terms: a line counts only if EVERY term matches it
// (each per the active mode). Section filter is applied once per section; the position
// filter against the first term's match.
function searchSong(song, terms, mode) {
  const hits = [];
  const disp = sectionDisplays(song);
  const strict = mode === "exact";
  song.sections.forEach((sec, si) => {
    if (state.section !== "any" && sectionType(sec.label) !== state.section) return;
    (sec.lines || []).forEach((line, li) => {
      let ranges = [];
      // fuzzy and contains both locate their matches as explicit ranges (marked via markRanges);
      // stem/exact use the shared word-boundary regex (marked via highlightTerms).
      const finder = mode === "fuzzy" ? fuzzyTermRange : mode === "contains" ? containsTermRange : null;
      if (finder) {
        for (const term of terms) { const r = finder(line, term); if (!r) { ranges = null; break; } ranges.push(r); }
      } else {
        for (const term of terms) {
          const m = wordRegex(term, strict).exec(line);   // non-global: first match per line
          if (!m) { ranges = null; break; }
          ranges.push({ start: m.index, len: m[0].length });
        }
      }
      if (!ranges || !passesPosition(line, ranges[0])) return;
      const html = finder ? markRanges(line, ranges) : highlightTerms(line, terms, strict);
      hits.push(makeHit(sec, si, li, disp[si], html));
    });
  });
  return hits;
}

// The terms to search: committed chips plus the live input if it's a usable (2+ char) word.
function activeTerms() {
  const live = state.q.trim();
  const terms = state.terms.slice();
  if (live.length >= 2 && !terms.some((t) => t.toLowerCase() === live.toLowerCase())) terms.push(live);
  return terms;
}

// Narrate the live match/layout combination in plain English (empty before there's a word
// to describe, so the pristine start screen stays uncluttered). Deliberately does NOT
// enumerate stem forms — the matcher over-generates non-words, so we describe, not list.
function renderExplain() {
  const el = $("explain");
  if (!el) return;
  const terms = activeTerms();
  if (!terms.length) { el.innerHTML = ""; return; }
  const layout = state.grouped ? "grouped by album" : "as one flat list";
  // "contains" surfaces lines the game would NOT count (letters buried inside other words), so
  // it carries an honest caveat that these aren't game-valid word matches.
  const caveat = state.mode === "contains" ? ` <span class="sx-explain-note">not game word matches</span>` : "";
  if (terms.length > 1) {
    const modeWord = state.mode === "exact" ? "exact words"
      : state.mode === "fuzzy" ? "typos allowed"
      : state.mode === "contains" ? "letters inside words" : "word forms included";
    el.innerHTML = `Lines holding all <b>${terms.length}</b> words (${modeWord}) &middot; ${layout}.${caveat}`;
    return;
  }
  const w = escapeHtml(terms[0]);
  const how = state.mode === "exact" ? `Matching the exact word <b>${w}</b> only`
    : state.mode === "fuzzy" ? `Matching <b>${w}</b> and close misspellings`
    : state.mode === "contains" ? `Finding the letters <b>${w}</b> anywhere inside a word`
    : `Matching <b>${w}</b> plus its word forms`;
  el.innerHTML = `${how} &middot; ${layout}.${caveat}`;
}

function runSearch() {
  renderChips();
  renderExplain();
  const terms = activeTerms();
  if (!terms.length) { renderInitial(state.q.trim()); return; }
  const groups = [];
  for (const song of SONGS) {
    const hits = searchSong(song, terms, state.mode);
    if (hits.length) groups.push({ song, hits });
  }
  groups.sort((a, b) =>
    (ALBUM_INDEX.get(a.song.album) - ALBUM_INDEX.get(b.song.album)) || a.song.title.localeCompare(b.song.title));
  render(terms, groups);
}

/* ---------- multi-term chips ---------- */
function renderChips() {
  $("chips").innerHTML = state.terms.map((t, i) =>
    `<span class="sx-chip">${escapeHtml(t)}<button type="button" class="sx-chip-x" data-i="${i}" aria-label="Remove ${escapeHtml(t)}">&times;</button></span>`).join("");
  $("q").placeholder = state.terms.length ? "and another word…" : "search the lyrics…";
  updateClear();
}
// Show the clear cross only when there's a live word or a committed chip to clear.
function updateClear() {
  const c = $("clear");
  if (c) c.hidden = !($("q").value || state.terms.length);
}
function commitTerm() {
  const t = state.q.trim();
  if (t.length < 2) return;
  if (!state.terms.some((x) => x.toLowerCase() === t.toLowerCase())) state.terms.push(t);
  state.q = ""; $("q").value = "";
  runSearch();
}
function removeTermAt(i) { state.terms.splice(i, 1); runSearch(); $("q").focus(); }
// Load a stored / recent query string: 2+ tokens become chips, a single token stays editable.
function applyQueryString(s) {
  const tokens = String(s || "").trim().split(/\s+/).filter(Boolean);
  if (tokens.length > 1) { state.terms = tokens; state.q = ""; }
  else { state.terms = []; state.q = tokens[0] || ""; }
  $("q").value = state.q;
}

/* ---------- render ---------- */
const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;

function renderInitial(q) {
  $("counter").innerHTML = "";
  $("bar").innerHTML = "";
  $("barlabel").innerHTML = "";
  $("concord").innerHTML = "";
  renderRail([]);
  $("results").classList.remove("sx-iso");
  LAST_COUNTS = null;
  setEraTint(null);
  const msg = q.length === 1
    ? "Keep going, type at least two letters."
    : `Type a word to search every lyric line across ${SONGS.length} songs.`;
  const recent = getRecent();
  const recentHTML = recent.length
    ? `<div class="sx-recent"><div class="sx-recent-head">recent searches` +
      `<button type="button" class="sx-recent-clear" id="recentClear">clear</button></div>` +
      `<div class="sx-recent-list">` +
      recent.map((r) => `<button type="button" class="sx-recent-item" data-q="${escapeHtml(r)}">${escapeHtml(r)}</button>`).join("") +
      `</div></div>`
    : "";
  $("results").innerHTML = `<p class="sx-hint">${escapeHtml(msg)}</p>` + recentHTML;
}

// Lines-per-album for the current result set — drives both the rainbow bar and the
// concordance breakdown, so they always agree.
function albumLineCounts(groups) {
  const counts = new Map();
  for (const g of groups) counts.set(g.song.album, (counts.get(g.song.album) || 0) + g.hits.length);
  return counts;
}
// The album holding the most matching lines (drives the era wash + leads the concordance).
function topAlbum(counts) {
  return [...counts.entries()].sort((a, b) => (b[1] - a[1]) || (ALBUM_INDEX.get(a[0]) - ALBUM_INDEX.get(b[0])))[0];
}
// Tint the notebook's binding edge toward an album's colour for the current search (null clears it).
function setEraTint(color) { document.body.style.setProperty("--era", color || "transparent"); }

// The per-album line counts of the current result set, kept so the bar/legend hover read-out
// can name a count without recomputing. Cleared whenever there are no results.
let LAST_COUNTS = null;

// A clicked colour locks the isolation to one album, so it survives mouse-out (hovering another
// colour still previews it, then reverts to the lock on leave). Cleared by clicking that colour
// again, clicking away from the bar, or running a new search. null = nothing locked.
let pinnedAlbum = null;

// Restore isolation after a hover ends: fall back to the locked album, or clear if nothing is
// locked.
function leaveIsolate() {
  if (pinnedAlbum) isolateAlbum(pinnedAlbum);
  else clearIsolate();
}

// Brushing: isolate one album across the results (grouped blocks or flat rows), fading the
// rest, and name it in the read-out under the bar. Reversed by clearIsolate on mouse-out.
// Name an album in the read-out under the bar, with its line count when known.
function barReadout(al) {
  const label = $("barlabel");
  if (!label) return;
  const c = LAST_COUNTS ? LAST_COUNTS.get(al) : null;
  const color = ALBUM_COLORS[al] || "#999";
  label.innerHTML = `<b style="color:${color}">${escapeHtml(al)}</b>${c != null ? " &middot; " + plural(c, "line") : ""}`;
}

// Hover preview: grey the OTHER bar colours down and name the album, but leave the results
// alone. Actually hiding the other albums is reserved for a click (isolateAlbum). A locked
// album keeps its ring while it (or nothing) is previewed.
function previewAlbum(al) {
  const bar = $("bar");
  if (bar) {
    bar.classList.add("sx-iso");
    bar.classList.toggle("sx-locked", pinnedAlbum === al);
    for (const el of bar.querySelectorAll("[data-album]")) el.classList.toggle("sx-lit", el.dataset.album === al);
  }
  barReadout(al);
}

// Full isolation (on click): the bar preview PLUS hiding every other album from the results,
// leaving only this one. Reversed by clearIsolate.
function isolateAlbum(al) {
  previewAlbum(al);
  const results = $("results");
  if (!results) return;
  results.classList.add("sx-iso");
  for (const el of results.querySelectorAll("[data-album]")) el.classList.toggle("sx-lit", el.dataset.album === al);
}
function clearIsolate() {
  const results = $("results");
  if (!results) return;
  results.classList.remove("sx-iso");
  for (const el of results.querySelectorAll(".sx-lit")) el.classList.remove("sx-lit");
  const bar = $("bar");
  if (bar) {
    bar.classList.remove("sx-iso", "sx-locked");
    for (const el of bar.querySelectorAll(".sx-lit")) el.classList.remove("sx-lit");
  }
  const label = $("barlabel");
  if (label) label.textContent = label.dataset.hint || "";
}

// The index journal on the screen edge is a permanent desk prop; this only fills or empties
// its flags. A flag per album, stuck between the pages, ordered as the (grouped) results
// appear; each scrolls to its block. Flat view or a single album leaves the notebook closed.
function renderRail(albums) {
  const on = state.grouped && albums.length >= 2;
  $("rail").innerHTML = !on ? "" : albums.map((al, i) =>
    `<button type="button" data-al="${i}" style="--al:${ALBUM_COLORS[al] || "#999"}" title="${escapeHtml(al)}">${escapeHtml(al)}</button>`).join("");
}

function albumBar(counts) {
  const albums = [...counts.keys()].sort((a, b) => ALBUM_INDEX.get(a) - ALBUM_INDEX.get(b));
  return albums.map((al) =>
    `<span data-album="${escapeHtml(al)}" style="flex:${counts.get(al)};background:${ALBUM_COLORS[al] || "#999"}" title="${escapeHtml(al)}: ${counts.get(al)}"></span>`).join("");
}

// A plain-language rarity read, echoing the game's difficulty bands (common ≥18 songs,
// rare 3–9) so the searcher and the game describe a word the same way.
function rarityNote(songCount) {
  if (songCount >= 18) return "a common word";
  if (songCount >= 8) return "fairly common";
  if (songCount >= 3) return "a rare word";
  return songCount === 1 ? "a one-song deep cut" : "a deep cut";
}

// The concordance strip: which album holds this word most, a rarity read, and a labeled
// breakdown of the top albums — the readable counterpart to the rainbow bar above it.
const CONCORD_TOP = 4;
function renderConcord(groups, counts) {
  const entries = [...counts.entries()]
    .sort((a, b) => (b[1] - a[1]) || (ALBUM_INDEX.get(a[0]) - ALBUM_INDEX.get(b[0])));
  if (!entries.length) { $("concord").innerHTML = ""; return; }
  const [topAlbum, topCount] = entries[0];
  const topColor = ALBUM_COLORS[topAlbum] || "#999";
  const more = entries.length - CONCORD_TOP;
  // Render EVERY album (so the hover-isolate can reach it and the breakdown can expand), but
  // fold everything past the top few behind a "+N more" toggle to keep the strip compact.
  const legend = entries.map(([al, c], i) =>
    `<span class="sx-leg${i >= CONCORD_TOP ? " sx-leg-extra" : ""}" data-album="${escapeHtml(al)}">` +
    `<span class="sx-leg-dot" style="background:${ALBUM_COLORS[al] || "#999"}"></span>${escapeHtml(al)} <b>${c}</b></span>`).join("");
  const moreBtn = more > 0
    ? `<button type="button" class="sx-leg-more" id="moreAlbums" data-more="${more}">+${more} more album${more === 1 ? "" : "s"}</button>`
    : "";
  $("concord").innerHTML =
    `<div class="sx-concord-line">most in <b style="color:${topColor}">${escapeHtml(topAlbum)}</b> ` +
    `(${plural(topCount, "line")}) &middot; <span class="sx-rarity">${rarityNote(groups.length)}</span></div>` +
    `<div class="sx-concord-legend">${legend}${moreBtn}</div>`;
}

function hitHTML(h, flatMeta, album) {
  const ctx = (l) => l ? `<div class="sx-ctx">${escapeHtml(l)}</div>` : "";
  const ann = flatMeta
    ? `<div class="sx-ann sx-ann-flat">${flatMeta}</div>`
    : `<div class="sx-ann"><span class="sx-sec">${escapeHtml(h.sectionLabel)}</span><span class="sx-ln">l.${h.lineNo}</span></div>`;
  // Flat rows carry data-album so hover-isolate can dim them individually (grouped hits are
  // dimmed by their parent .sx-album block, so they don't need it).
  const dataAl = album ? ` data-album="${escapeHtml(album)}"` : "";
  return `<div class="sx-hit${flatMeta ? " sx-hit-flat" : ""}"${dataAl}>${ann}<div class="sx-lines">${ctx(h.prev)}<div class="sx-main">${h.html}</div>${ctx(h.next)}</div></div>`;
}

function render(terms, groups) {
  const songs = groups.length;
  const lines = groups.reduce((n, g) => n + g.hits.length, 0);
  const termLabels = terms.map((t) => `<b>${escapeHtml(t)}</b>`).join(", ");
  if (!songs) {
    const where = [];
    if (state.section !== "any") where.push(state.section.toLowerCase());
    if (state.pos === "start") where.push("at line start");
    if (state.pos === "end") where.push("at line end");
    const ctx = where.length ? ` (${where.join(", ")})` : "";
    const tip = state.mode !== "fuzzy" && !where.length ? " Try fuzzy for typos." : "";
    const lead = terms.length > 1 ? "No lyric line holds all of " : "No lyrics match ";
    $("counter").innerHTML = `<span class="sx-none">${lead}${termLabels}${ctx}.${tip}</span>`;
    $("bar").innerHTML = "";
    $("barlabel").innerHTML = "";
    $("concord").innerHTML = "";
    $("results").innerHTML = "";
    $("results").classList.remove("sx-iso");
    renderRail([]);
    LAST_COUNTS = null;
    pinnedAlbum = null;
    setEraTint(null);
    return;
  }
  // "Play this word" — only for a SINGLE term that is a real prompt word the game can
  // start a round on (gated by words.json), so the link never dead-ends.
  const play = (terms.length === 1 && PROMPT_WORDS.has(terms[0].toLowerCase()))
    ? ` <a class="sx-play" href="../?word=${encodeURIComponent(terms[0].toLowerCase())}" title="Start a game round on this word">play this word in the game &rarr;</a>`
    : "";
  const share = ` <button type="button" class="sx-copy" id="copyLink" title="Copy a shareable link to this search">` +
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">` +
    `<path d="M9 15l6-6"/><path d="M11 6l1-1a4 4 0 0 1 6 6l-1 1"/><path d="M13 18l-1 1a4 4 0 0 1-6-6l1-1"/></svg>` +
    `<span class="sx-copy-label">copy link</span></button>`;
  $("counter").innerHTML = `found in <b>${plural(songs, "song")}</b> &middot; <b>${plural(lines, "line")}</b>${play}${share}`;
  const counts = albumLineCounts(groups);
  LAST_COUNTS = counts;
  pinnedAlbum = null;                         // a new result set clears any locked album
  $("results").classList.remove("sx-iso");   // drop any stale isolation from the previous search
  $("bar").innerHTML = albumBar(counts);
  const bl = $("barlabel");
  if (bl) { bl.dataset.hint = counts.size > 1 ? "hover a colour to isolate that album, click to lock it" : ""; bl.textContent = bl.dataset.hint; }
  renderConcord(groups, counts);
  const top = topAlbum(counts);
  setEraTint(top ? ALBUM_COLORS[top[0]] : null);
  pushRecent(terms.join(" "));

  if (state.grouped) {
    // Group by album (a binder divider per album), songs within. Albums in release order.
    const byAlbum = new Map();
    for (const g of groups) {
      if (!byAlbum.has(g.song.album)) byAlbum.set(g.song.album, []);
      byAlbum.get(g.song.album).push(g);
    }
    const albums = [...byAlbum.keys()].sort((a, b) => ALBUM_INDEX.get(a) - ALBUM_INDEX.get(b));
    $("results").innerHTML = albums.map((al, i) => {
      const color = ALBUM_COLORS[al] || "#999";
      const songs = byAlbum.get(al).map((g) => {
        const hits = g.hits.map((h) => hitHTML(h, null)).join("");
        return `<div class="sx-song">
          <div class="sx-song-head">
            <span class="sx-song-title">${escapeHtml(g.song.title)}</span>
            <span class="sx-song-count">${plural(g.hits.length, "line")}</span>
          </div>${hits}</div>`;
      }).join("");
      return `<section id="sx-al-${i}" class="sx-album" data-album="${escapeHtml(al)}" style="--album:${color}">
        <span class="sx-album-rule" aria-hidden="true"></span>
        <div class="sx-album-tab"><span class="sx-album-era">${escapeHtml(al)}</span></div>
        <div class="sx-album-body">${songs}</div></section>`;
    }).join("");
    renderRail(albums);
  } else {
    renderRail([]);
    const rows = [];
    for (const g of groups) {
      const color = ALBUM_COLORS[g.song.album] || "#999";
      for (const h of g.hits) {
        const meta = `<span class="sx-dot" style="--album:${color}"></span><span class="sx-flat-title">${escapeHtml(g.song.title)}</span><span class="sx-flat-album">${escapeHtml(g.song.album)}</span><span class="sx-flat-loc">${escapeHtml(h.sectionLabel)} &middot; l.${h.lineNo}</span>`;
        rows.push(hitHTML(h, meta, g.song.album));
      }
    }
    $("results").innerHTML = `<div class="sx-flat" style="--album:#999">${rows.join("")}</div>`;
  }
}

/* ---------- deep links ---------- */
function readHash() {
  const p = new URLSearchParams(location.hash.slice(1));
  const qp = p.get("q");
  if (qp) {
    // Space-separated terms: 2+ load as chips (a shared multi-term link), one stays editable.
    const tokens = qp.trim().split(/\s+/).filter(Boolean);
    if (tokens.length > 1) { state.terms = tokens; state.q = ""; }
    else if (tokens.length === 1) { state.q = tokens[0]; }
  }
  if (["stem", "exact", "fuzzy", "contains"].includes(p.get("mode"))) state.mode = p.get("mode");
  if (p.get("view") === "flat") state.grouped = false;
  else if (p.get("view") === "grouped") state.grouped = true;   // can override a saved "flat"
  if (p.get("section") && SECTION_TYPES.includes(p.get("section"))) state.section = p.get("section");
  if (["start", "end"].includes(p.get("pos"))) state.pos = p.get("pos");
}
// Build a shareable deep-link URL for the current search. We deliberately do NOT write this
// to the address bar as you type — the URL stays clean during normal use, and a link is only
// minted on demand by the "copy link" button. Incoming deep links are still read on load.
function buildShareURL() {
  const p = new URLSearchParams();
  const terms = activeTerms();
  if (terms.length) {
    p.set("q", terms.join(" "));
    // A shared link encodes mode + layout explicitly so it reproduces faithfully regardless
    // of the recipient's saved prefs.
    p.set("mode", state.mode);
    p.set("view", state.grouped ? "grouped" : "flat");
  }
  if (state.section !== "any") p.set("section", state.section);
  if (state.pos !== "any") p.set("pos", state.pos);
  const hash = p.toString();
  return location.origin + location.pathname + (hash ? "#" + hash : "");
}

// Copy text to the clipboard, preferring the async Clipboard API and falling back to a
// hidden-textarea execCommand for older browsers / non-secure contexts. Returns success.
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) { /* fall through to the legacy path */ }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed"; ta.style.top = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch (e) { return false; }
}

/* ---------- wiring ---------- */
function syncToggles() {
  for (const b of document.querySelectorAll("[data-mode]")) b.classList.toggle("on", b.dataset.mode === state.mode);
  for (const b of document.querySelectorAll("[data-view]")) b.classList.toggle("on", (b.dataset.view === "flat") === !state.grouped);
  $("section").classList.toggle("active", state.section !== "any");
  $("pos").classList.toggle("active", state.pos !== "any");
}

function init() {
  applyPrefs();   // remembered mode + layout first; the deep-link hash overrides below
  readHash();
  const input = $("q");
  input.value = state.q;
  renderChips();

  // Populate the section-type filter from the types actually present in the data.
  $("section").innerHTML = `<option value="any">any section</option>` +
    SECTION_TYPES.map((t) => `<option value="${escapeHtml(t)}">${escapeHtml(t.toLowerCase())}</option>`).join("");
  $("section").value = state.section;
  $("pos").value = state.pos;
  syncToggles();

  let t;
  input.addEventListener("input", () => {
    state.q = input.value;
    updateClear();
    clearTimeout(t);
    t = setTimeout(runSearch, state.mode === "fuzzy" ? 220 : 120);
  });
  // Clear cross: wipe the live word and every committed chip, then hand focus back.
  $("clear").addEventListener("click", () => {
    state.q = ""; state.terms = [];
    input.value = "";
    runSearch();
    input.focus();
  });
  // Enter / comma commits the live word into a chip (AND-ed with the rest); Backspace on an
  // empty input peels the last chip back off.
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); commitTerm(); }
    else if (e.key === "Backspace" && input.value === "" && state.terms.length) { e.preventDefault(); removeTermAt(state.terms.length - 1); }
  });
  $("chips").addEventListener("click", (e) => {
    const x = e.target.closest(".sx-chip-x");
    if (x) removeTermAt(Number(x.dataset.i));
  });
  // Album rail: scroll to the chosen album's results block.
  $("rail").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-al]");
    if (b) document.getElementById("sx-al-" + b.dataset.al)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // Deep-reference dictionary: it stays below the fold until you scroll into a long result
  // list, then slides up into the bottom-right corner (a CSS body class does the sliding).
  // rAF-throttled so the scroll stays cheap.
  let scrollQueued = false;
  const syncScrolled = () => {
    scrollQueued = false;
    document.body.classList.toggle("sx-scrolled", window.scrollY > window.innerHeight * 0.5);
  };
  window.addEventListener("scroll", () => {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(syncScrolled);
  }, { passive: true });
  syncScrolled();

  // Rainbow bar + legend brushing. #bar and #concord are stable containers (only their
  // innerHTML changes each search), so we delegate hover once here.
  const bar = $("bar");
  bar.addEventListener("mouseover", (e) => { const s = e.target.closest("[data-album]"); if (s) previewAlbum(s.dataset.album); });
  bar.addEventListener("mouseleave", leaveIsolate);
  // Click a colour to lock the view to that album; click it again to unlock and show every album.
  bar.addEventListener("click", (e) => {
    const s = e.target.closest("[data-album]");
    if (!s) return;
    const al = s.dataset.album;
    pinnedAlbum = pinnedAlbum === al ? null : al;
    if (pinnedAlbum) isolateAlbum(pinnedAlbum);
    else clearIsolate();
  });
  // Clicking anywhere off the bar releases a locked album and brings every album back.
  document.addEventListener("click", (e) => {
    if (!pinnedAlbum || e.target.closest("#bar [data-album]")) return;
    pinnedAlbum = null;
    clearIsolate();
  });
  const concord = $("concord");
  // "+N more albums" unfolds the rest of the breakdown.
  concord.addEventListener("click", (e) => {
    const btn = e.target.closest("#moreAlbums");
    if (!btn) return;
    const expanded = btn.closest(".sx-concord-legend").classList.toggle("expanded");
    const n = btn.dataset.more;
    btn.textContent = expanded ? "show fewer" : `+${n} more album${n === "1" ? "" : "s"}`;
  });
  for (const b of document.querySelectorAll("[data-mode]")) {
    b.addEventListener("click", () => { state.mode = b.dataset.mode; savePrefs(); syncToggles(); runSearch(); });
  }
  for (const b of document.querySelectorAll("[data-view]")) {
    b.addEventListener("click", () => { state.grouped = b.dataset.view !== "flat"; savePrefs(); syncToggles(); runSearch(); });
  }
  $("section").addEventListener("change", (e) => { state.section = e.target.value; syncToggles(); runSearch(); });
  $("pos").addEventListener("change", (e) => { state.pos = e.target.value; syncToggles(); runSearch(); });

  // "Copy link" — mints a shareable deep link on demand (the URL is otherwise kept clean).
  // Delegated since #counter is re-rendered on every search.
  $("counter").addEventListener("click", async (e) => {
    const btn = e.target.closest("#copyLink");
    if (!btn) return;
    const label = btn.querySelector(".sx-copy-label") || btn;
    const ok = await copyToClipboard(buildShareURL());
    label.textContent = ok ? "link copied!" : "copy failed";
    setTimeout(() => { label.textContent = "copy link"; }, 1600);
  });

  // Recent-search list (rendered in the initial state) is wired via delegation since
  // #results is re-rendered on every search.
  $("results").addEventListener("click", (e) => {
    const item = e.target.closest(".sx-recent-item");
    if (item) { applyQueryString(item.dataset.q); runSearch(); input.focus(); return; }
    if (e.target.closest("#recentClear")) { clearRecent(); renderInitial(state.q.trim()); }
  });

  runSearch();
  if (!state.q) input.focus();
}

loadData()
  .then(init)
  .catch((err) => {
    console.error(err);
    $("results").innerHTML = `<p class="sx-hint">Couldn't load the lyrics. ${escapeHtml(err.message)}</p>`;
  });
