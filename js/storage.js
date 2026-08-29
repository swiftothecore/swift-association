// localStorage persistence: high scores, stats, achievements, difficulty.
// All functions are pure of app state — the active mode and the earned-
// achievements map are passed in explicitly rather than closed over.
import {
  HS_KEY, RECORDS_KEY, HISTORY_KEY, STATS_KEY, ACH_KEY, DIFF_KEY,
  DAILY_KEY, DAILY_PROGRESS_KEY, DAILY_BOARD_KEY, DAILY_STREAK_KEY, TYPES_KEY, TALLY_KEY,
  BREADTH_KEY, WEEKDAYS_KEY, DATES_KEY, EXPLORER_TOKENS, RANDOM_KEY, GOAL_KEY, ACH_FOLD_KEY,
  DAY_TYPES_KEY, DICE_KEY, SHELF_TYPES,
  SETTINGS_KEY, METRICS_KEY, APP_PREFIX, DEFAULT_SETTINGS,
  CHALLENGES_KEY, CHALLENGE_TOKENS_KEY,
  ALBUM_FOCUS_KEY, ALBUM_FOCUS_TARGET, DIFF_RANK,
  ADAPTIVE_LEGACY_KEY,
  GUEST_KEY, GUEST_TARGET,
  BONUS_KEY, RUTHLESS_KEY,
  CUSTOM_KEY, CUSTOM_DEFAULT_MODE,
  KEEPSAKES_KEY,
  STICKERS_KEY,
  MASTERY_KEY, SKILL_IDS, MASTERY_REWARDS, MASTERY_GATE,
  skillLevelFromXp, masteryLevelFromXp,
  MODES, MODE_ORDER, TOTAL_ROUNDS, ACH_ID_MIGRATIONS,
} from "./config.js";

const HISTORY_CAP = 1000;   // keep the most recent N runs; older ones drop off

const STREAK_THRESHOLD = 7; // score >= this counts toward a streak

/* ---------- Stats (separate per mode) ---------- */
// Medium keeps the legacy key for back-compat; other modes get a suffix.
export function statsKey(mode) { return mode === "medium" ? STATS_KEY : STATS_KEY + "." + mode; }

export function loadStats(mode) {
  try {
    const raw = localStorage.getItem(statsKey(mode));
    if (raw) {
      const s = JSON.parse(raw);
      if (s && typeof s.played === "number") return s;
    }
  } catch (e) { /* ignore */ }
  return { played: 0, best: 0, totalScore: 0, scoreCounts: Array(14).fill(0), lastPlayed: null, currentStreak: 0, maxStreak: 0, bestInRow: 0 };
}

export function saveStats(s, mode) {
  try { localStorage.setItem(statsKey(mode), JSON.stringify(s)); } catch (e) { /* ignore */ }
}

// Total games across every mode — for the global "play N games" achievements.
export function totalPlayed() { return MODE_ORDER.reduce((n, m) => n + loadStats(m).played, 0); }

// bestRun = the game's longest correct-in-a-row (gameMaxStreak); we keep the
// lifetime max per mode for the "Best in a row" stat.
// `countBest` (default true) — when false (a hint was used this run), the play still
// counts toward played/average/distribution, but it can't set any "best" (best score,
// best-in-a-row, or the non-zero-game streak). Keeps hinted runs out of the records.
export function updateStats(gameScore, mode, bestRun, countBest = true) {
  const s = loadStats(mode);
  s.played += 1;
  s.totalScore += gameScore;
  s.scoreCounts[gameScore] = (s.scoreCounts[gameScore] || 0) + 1;
  s.lastPlayed = new Date().toISOString().slice(0, 10);
  if (countBest) {
    s.best = Math.max(s.best, gameScore);
    s.bestInRow = Math.max(s.bestInRow || 0, bestRun || 0);
    if (gameScore >= STREAK_THRESHOLD) {
      s.currentStreak += 1;
      s.maxStreak = Math.max(s.maxStreak, s.currentStreak);
    } else {
      s.currentStreak = 0;
    }
  }
  saveStats(s, mode);
  return s;
}

/* ---------- Achievements ---------- */
export function loadAchievements() {
  try {
    const raw = localStorage.getItem(ACH_KEY);
    if (raw) {
      const o = JSON.parse(raw);
      if (o && typeof o === "object") {
        let migrated = false;
        for (const [oldId, newId] of Object.entries(ACH_ID_MIGRATIONS)) {
          if (!Object.prototype.hasOwnProperty.call(o, oldId)) continue;
          if (!Object.prototype.hasOwnProperty.call(o, newId)) o[newId] = o[oldId];
          delete o[oldId];
          migrated = true;
        }
        if (migrated) saveAchievements(o);
        return o;
      }
    }
  } catch (e) { /* ignore */ }
  return {};
}
export function saveAchievements(earned) {
  try { localStorage.setItem(ACH_KEY, JSON.stringify(earned)); } catch (e) { /* ignore */ }
}

/* ---------- Keepsakes (collectible polaroids) ---------- */
// Same shape as achievements: { [polaroidId]: isoDate }. The isoDate is the unlock time,
// which drives the develop clock (unlock+POLAROID_DEVELOP_MS = developed) at render time.
export function loadKeepsakes() {
  try {
    const raw = localStorage.getItem(KEEPSAKES_KEY);
    if (raw) { const o = JSON.parse(raw); if (o && typeof o === "object") return o; }
  } catch (e) { /* ignore */ }
  return {};
}
export function saveKeepsakes(earned) {
  try { localStorage.setItem(KEEPSAKES_KEY, JSON.stringify(earned)); } catch (e) { /* ignore */ }
}
export function resetKeepsakes() {
  try { localStorage.removeItem(KEEPSAKES_KEY); } catch (e) { /* ignore */ }
}

/* ---------- Stickers (the die-cut vinyl set) ---------- */
// Same shape as the keepsakes store: { [stickerId]: isoDate }. Stickers have no develop
// clock, so the date is kept only as the earn record, for ordering and for the drawer.
export function loadStickers() {
  try {
    const raw = localStorage.getItem(STICKERS_KEY);
    if (raw) { const o = JSON.parse(raw); if (o && typeof o === "object") return o; }
  } catch (e) { /* ignore */ }
  return {};
}
export function saveStickers(earned) {
  try { localStorage.setItem(STICKERS_KEY, JSON.stringify(earned)); } catch (e) { /* ignore */ }
}
export function resetStickers() {
  try { localStorage.removeItem(STICKERS_KEY); } catch (e) { /* ignore */ }
}

/* ---------- Challenges mode (progress + tokens) ---------- */
// Per-challenge progress, keyed by challenge id:
//   { unlocked, defeated, attempts, best, darkDefeated, darkAttempts, darkBest,
//     returnRuns, runs, pinned }
// The dark* fields track the challenge's dark side as a separate line of progress against the
// same id, so beating the base and beating the dark side stay independently recorded. Records
// written before dark sides existed simply lack them and default cleanly — no migration.
// `returnRuns` counts base runs played through to the end screen for challenge returns; it is
// deliberately NOT the same tally as `attempts`, which banks at run start. `runs` never
// freezes because it supports the separate At Least I'm Trying achievement.
export function loadChallengeState() {
  try {
    const raw = localStorage.getItem(CHALLENGES_KEY);
    if (raw) { const o = JSON.parse(raw); if (o && typeof o === "object") return o; }
  } catch (e) { /* ignore */ }
  return {};
}
export function saveChallengeState(o) {
  try { localStorage.setItem(CHALLENGES_KEY, JSON.stringify(o)); } catch (e) { /* ignore */ }
}
// One challenge's record, with defaults filled in.
export function challengeRecord(id) {
  const e = loadChallengeState()[id] || {};
  return {
    unlocked: !!e.unlocked, defeated: !!e.defeated, attempts: e.attempts || 0, best: e.best || 0,
    darkDefeated: !!e.darkDefeated, darkAttempts: e.darkAttempts || 0, darkBest: e.darkBest || 0,
    // `earnest` was the completed-run counter under the retired persistence-ticket system.
    // Carry it forward so an already-earned seven-run return is never erased by the rename.
    returnRuns: e.returnRuns || e.earnest || 0, runs: e.runs || 0, pinned: !!e.pinned,
  };
}
// The challenge wallet, seeded with one starting token on first read (persisted on first save).
// Retired persistence tickets convert one-for-one on read. The next wallet write drops the old
// field, preserving the player's earned currency without keeping a second economy alive.
export function loadChallengeTokens() {
  try {
    const raw = localStorage.getItem(CHALLENGE_TOKENS_KEY);
    if (raw) {
      const o = JSON.parse(raw);
      if (o && typeof o.balance === "number") {
        const { tickets = 0, ...wallet } = o;
        return { ...wallet, balance: o.balance + Math.max(0, tickets || 0) };
      }
    }
  } catch (e) { /* ignore */ }
  return { balance: 1 };
}
export function saveChallengeTokens(o) {
  try { localStorage.setItem(CHALLENGE_TOKENS_KEY, JSON.stringify(o)); } catch (e) { /* ignore */ }
}
export function resetChallenges() {
  try { localStorage.removeItem(CHALLENGES_KEY); localStorage.removeItem(CHALLENGE_TOKENS_KEY); } catch (e) { /* ignore */ }
}

/* ---------- Album Focus board (sandboxed, like challenges) ----------
   { [album]: { best, bestDiff, beaten, beatenDiff, perfected, perfectedDiff } }
   beatenDiff / perfectedDiff = the HARDEST difficulty the album was beaten / perfected at,
   so the completed-album keepsake can scale with difficulty. */
export function loadAlbumFocus() {
  try {
    const raw = localStorage.getItem(ALBUM_FOCUS_KEY);
    if (raw) { const o = JSON.parse(raw); if (o && typeof o === "object") return o; }
  } catch (e) { /* ignore */ }
  return {};
}
export function saveAlbumFocus(o) {
  try { localStorage.setItem(ALBUM_FOCUS_KEY, JSON.stringify(o)); } catch (e) { /* ignore */ }
}
// One album's record, with defaults filled in.
export function albumFocusRecord(album) {
  const e = loadAlbumFocus()[album] || {};
  return {
    best: e.best || 0, bestDiff: e.bestDiff || null,
    beaten: !!e.beaten, beatenDiff: e.beatenDiff || null,
    perfected: !!e.perfected, perfectedDiff: e.perfectedDiff || null,
  };
}
// Keep the harder of two difficulty ids (null-safe).
function harderDiff(a, b) {
  if (!a) return b; if (!b) return a;
  return (DIFF_RANK[b] || 0) > (DIFF_RANK[a] || 0) ? b : a;
}
// Fold a finished Album Focus run into the board. `score` is 0..TOTAL_ROUNDS, `diff` a MODES id.
// Returns the updated record. (Caller gates beaten/perfected on a hint-free run.)
export function recordAlbumFocusRun(album, score, diff, countBest = true) {
  const all = loadAlbumFocus();
  const e = all[album] || {};
  // best score ever — ties keep the harder difficulty
  if (score > (e.best || 0)) { e.best = score; e.bestDiff = diff; }
  else if (score === (e.best || 0) && score > 0) { e.bestDiff = harderDiff(e.bestDiff, diff); }
  if (countBest) {
    if (score >= ALBUM_FOCUS_TARGET) { e.beaten = true; e.beatenDiff = harderDiff(e.beatenDiff, diff); }
    if (score >= TOTAL_ROUNDS) { e.perfected = true; e.perfectedDiff = harderDiff(e.perfectedDiff, diff); }
  }
  all[album] = e;
  saveAlbumFocus(all);
  return albumFocusRecord(album);
}
export function resetAlbumFocus() {
  try { localStorage.removeItem(ALBUM_FOCUS_KEY); } catch (e) { /* ignore */ }
}

/* ---------- Guest shelf board (sandboxed, like album focus) ----------
   { [guestId]: { best, bestDiff, admitted, admittedDiff } }
   One mark rather than Album Focus's two: a guest is ADMITTED at a perfect run, so there is
   no beaten/perfected pair to keep apart. admittedDiff = the HARDEST difficulty it was
   admitted at, so the pass's stamp can say how it was earned. */
export function loadGuests() {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    if (raw) { const o = JSON.parse(raw); if (o && typeof o === "object") return o; }
  } catch (e) { /* ignore */ }
  return {};
}
export function saveGuests(o) {
  try { localStorage.setItem(GUEST_KEY, JSON.stringify(o)); } catch (e) { /* ignore */ }
}
// One guest's record, with defaults filled in.
export function guestRecord(id) {
  const e = loadGuests()[id] || {};
  return {
    best: e.best || 0, bestDiff: e.bestDiff || null,
    admitted: !!e.admitted, admittedDiff: e.admittedDiff || null,
  };
}
// Fold a finished guest run into the board. `score` is 0..TOTAL_ROUNDS, `diff` a MODES id.
// Returns the updated record. (Caller gates admission on a hint-free run.)
export function recordGuestRun(id, score, diff, countBest = true) {
  const all = loadGuests();
  const e = all[id] || {};
  if (score > (e.best || 0)) { e.best = score; e.bestDiff = diff; }
  else if (score === (e.best || 0) && score > 0) { e.bestDiff = harderDiff(e.bestDiff, diff); }
  if (countBest && score >= GUEST_TARGET) { e.admitted = true; e.admittedDiff = harderDiff(e.admittedDiff, diff); }
  all[id] = e;
  saveGuests(all);
  return guestRecord(id);
}
export function resetGuests() {
  try { localStorage.removeItem(GUEST_KEY); } catch (e) { /* ignore */ }
}

/* ---------- Purging the retired Adaptive mode ----------
   Adaptive was a third gameType (a fixed 13-round run whose word rarity floated on a visible
   level) and it is gone: the mechanic now lives on as Custom's "Floating" rarity stop, and
   nothing in the game reads or writes an Adaptive anything. This clears what a notebook that
   played it still has lying around, so no surface has to keep understanding a mode that no
   longer exists — its board, its history rows, its two retired charms, and its two ledger
   tokens. Runs once (the key is the flag) and is cheap enough not to matter if it runs again.

   Note that this cannot be a complete erasure and isn't trying to be. Adaptive folded into
   recordGameTally, recordGameMetrics and all five skill tracks, and those are aggregate
   counters with no per-run provenance — the lifetime accuracy, the catalogue coverage and
   the banked XP its runs contributed can't be told apart from every other run's. Unwinding
   them would mean wiping those systems wholesale, which costs the player far more than the
   stale contribution is worth.

   The two charm ids deliberately do NOT go through ACH_ID_MIGRATIONS: that map moves an old
   id onto a CURRENT one, and dev.js's audit fails a row whose target isn't a live charm.
   These have no successor, so they're deleted outright.

   No "already purged" flag on purpose: every step below writes only when it actually finds
   something, so the steady-state cost is a few reads and the pass stays correct if an older
   backup is ever restored over the top. A flag would be one more key naming a dead mode. */
export function purgeAdaptive() {
  try { localStorage.removeItem(ADAPTIVE_LEGACY_KEY); } catch (e) { /* ignore */ }

  // History rows. The renderer no longer knows the "adaptive" token, so these have to go
  // rather than sit there rendering as a blank mode.
  try {
    const hist = loadHistory();
    const kept = hist.filter((h) => h.m !== "adaptive" && h.t !== "adaptive");
    if (kept.length !== hist.length) localStorage.setItem(HISTORY_KEY, JSON.stringify(kept));
  } catch (e) { /* ignore */ }

  // The two retired charms, cleared as if they had never been minted.
  try {
    const earned = loadAchievements();
    let hit = false;
    for (const id of ["reach-rarest-tier-adaptive", "finish-at-rarest-adaptive-without-slipping"]) {
      if (Object.prototype.hasOwnProperty.call(earned, id)) { delete earned[id]; hit = true; }
    }
    if (hit) saveAchievements(earned);
  } catch (e) { /* ignore */ }

  // Ledger tokens: the Explorer breadth token and the randomiser's playedness token. Both
  // are keyed by a token string no live code emits any more, so they'd linger forever.
  for (const [key, token] of [[BREADTH_KEY, "adaptive"], [RANDOM_KEY, "adaptive"]]) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const o = JSON.parse(raw);
      if (o && typeof o === "object" && token in o) {
        delete o[token];
        localStorage.setItem(key, JSON.stringify(o));
      }
    } catch (e) { /* ignore */ }
  }

  // A stored default of "adaptive" would leave the settings picker showing nothing selected.
  try {
    const s = loadSettings();
    if (s.defaultGameType === "adaptive") { s.defaultGameType = "last"; saveSettings(s); }
  } catch (e) { /* ignore */ }

}

/* ---------- Bonus games board (sandboxed, like challenges/album focus/custom) ----------
   { [gameId]: {best, plays, last} }. These are side games with their own scoring shape, so
   they stay entirely out of the difficulty stats, records, history and the song tally — a
   Name That Song run is not a run of the association game and must not be ranked beside one. */
export function loadBonus() {
  try {
    const raw = localStorage.getItem(BONUS_KEY);
    if (raw) { const o = JSON.parse(raw); if (o && typeof o === "object") return o; }
  } catch (e) { /* ignore */ }
  return {};
}
export function saveBonus(o) {
  try { localStorage.setItem(BONUS_KEY, JSON.stringify(o)); } catch (e) { /* ignore */ }
}
// `sweep` is the best CLEAN-SWEEP TIME in seconds, for the games that carry one, and 0 means
// no sweep has ever been recorded. A zero is unambiguous here in a way it is not on the timed
// board: this number is only ever written alongside a ten-out-of-ten, so an unplayed game and
// a swept one can never both read 0.
export function bonusRecord(id) {
  const e = loadBonus()[id] || {};
  return { best: e.best || 0, plays: e.plays || 0, last: e.last || 0, sweep: e.sweep || 0, swept: !!e.swept };
}
// Fold a finished bonus run into the board and return the updated record, plus whether the
// run set a new best (the end card calls that out).
// `max` is what a run of that game is out of TODAY. A game's scale can be retuned after a run
// has been banked (Redacted's page went from ten points to six), and a best from the old
// pressing would then sit above everything the game can still score — quoted as "best 74 / 60"
// and, worse, unbeatable, so no run could ever be a new best again. A stale best is therefore
// retired down to the new maximum here, once, on the next run.
// `lower` flips which way a best runs, for a game scored in seconds. It cannot be inferred
// from the numbers: a stored 0 is an unplayed game on a points board and a perfect run on a
// timed one, which is why the first run is taken as the best outright rather than compared
// against a zero that means nothing. `max` is meaningless for those and simply goes unused.
// `sweepSecs` is how long a CLEAN SWEEP took, and null on any run that wasn't one. It is a
// second, independent best sitting beside the first, and deliberately not the same mechanism as
// `lower`: that flag says the whole game is scored the other way up, whereas a sweep game is
// scored in points and keeps a low-wins time alongside them. A game can want one and not the
// other, and Ruthless and Spot the Slip are one of each.
export function recordBonusRun(id, score, max = Infinity, lower = false, sweepSecs = null, swept = false) {
  const all = loadBonus();
  const e = all[id] || {};
  // Written before either branch, so a sweep is banked on whichever way the game's own score
  // runs. Only ever improved, never overwritten by a slower sweep.
  const isSweepBest = sweepSecs != null && (!e.sweep || sweepSecs < e.sweep);
  if (isSweepBest) e.sweep = sweepSecs;
  // "This game has been swept at least once", which is NOT the same as `sweep` and cannot be
  // derived from it: `sweep` is a TIME, and only the three sweeps:true games keep one. The
  // other three top out below their own maximum by design, so on a points game no stored
  // number can ever say a run cleared ten pages. Only Every Single One reads this.
  if (swept) e.swept = true;
  if (lower) {
    const isBest = !e.plays || score < e.best;
    if (isBest) e.best = score;
    e.plays = (e.plays || 0) + 1;
    e.last = score;
    all[id] = e;
    saveBonus(all);
    return { ...bonusRecord(id), isBest, isSweepBest };
  }
  if (e.best > max) e.best = max;
  const isBest = score > (e.best || 0);
  if (isBest) e.best = score;
  e.plays = (e.plays || 0) + 1;
  e.last = score;
  all[id] = e;
  saveBonus(all);
  return { ...bonusRecord(id), isBest, isSweepBest };
}
// Dev only: put a clean-sweep time on the board without playing ten perfect pages for it.
// Writes the sweep and nothing else, deliberately — going through recordBonusRun would bank a
// play and a score too, and a board seeded that way stops being a board you can read.
// Pass 0 to take a seeded sweep back off.
export function seedBonusSweep(id, secs) {
  const all = loadBonus();
  const e = all[id] || {};
  if (secs > 0) e.sweep = secs; else delete e.sweep;
  all[id] = e;
  saveBonus(all);
  return bonusRecord(id);
}
export function resetBonus() {
  try { localStorage.removeItem(BONUS_KEY); } catch (e) { /* ignore */ }
}

/* ---------- Ruthless mode board: one best per lens ----------
   { [lensId]: { best, bestGaveUp, plays, last, date } }, where a best is a TIME IN SECONDS and
   LOW WINS. Six separate records rather than one, because the lenses are not a difficulty ladder
   through the same puzzle: the chorus resolves at a median of 22 words and the second verse at
   79, so a single combined record would only ever be somebody's chorus time.

   Two things this shares with the shelf's timed game and must keep sharing. There is no `max`
   and no clamp, since a time is not out of anything and there is no retune that could strand a
   stored best above a reachable ceiling. And the FIRST RUN TAKES THE BEST OUTRIGHT rather than
   being compared, because on a low-wins board a stored 0 cannot be told apart from an unplayed
   one — hence `!e.plays` and not `score < e.best`.

   `bestGaveUp` is how many of that run's ten pages were handed back. It is not a second record
   and must not become one: the give-up already charges its seconds into the time, so the time is
   the whole ranking. It is carried so the best LINE can say how the time was got, since "4:12,
   named all ten" and "4:12 with two given up" are the same record and a different run. */
export function loadRuthless() {
  try {
    const raw = localStorage.getItem(RUTHLESS_KEY);
    if (raw) { const o = JSON.parse(raw); if (o && typeof o === "object") return o; }
  } catch (e) { /* ignore */ }
  return {};
}
export function saveRuthless(o) {
  try { localStorage.setItem(RUTHLESS_KEY, JSON.stringify(o)); } catch (e) { /* ignore */ }
}
export function ruthlessRecord(lensId) {
  const e = loadRuthless()[lensId] || {};
  return {
    best: e.best || 0, bestGaveUp: e.bestGaveUp || 0,
    plays: e.plays || 0, last: e.last || 0, date: e.date || null,
  };
}
// Fold a finished run into the board and return the updated record plus whether it set a best.
export function recordRuthlessRun(lensId, seconds, gaveUp = 0, date = null) {
  const all = loadRuthless();
  const e = all[lensId] || {};
  const isBest = !e.plays || seconds < e.best;
  if (isBest) { e.best = seconds; e.bestGaveUp = gaveUp; e.date = date || null; }
  e.plays = (e.plays || 0) + 1;
  e.last = seconds;
  all[lensId] = e;
  saveRuthless(all);
  return { ...ruthlessRecord(lensId), isBest };
}
export function resetRuthless() {
  try { localStorage.removeItem(RUTHLESS_KEY); } catch (e) { /* ignore */ }
}

/* ---------- Custom mode: player-authored preset store ---------- */
// Key: swiftSongAssociation.custom → { presets:[{id,name,mode}], activeId }
// `mode` is a MODES-shaped lever object (see CUSTOM_DEFAULT_MODE). Purely saved
// configurations — nothing here feeds stats/records. A fresh/empty store seeds one preset
// so a first-time player always has something to play.
export function defaultCustomPreset() {
  return {
    id: "cp" + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36),
    // Deliberately not descriptive of the levers: this preset is the player's to edit, and a
    // name that spelled out the clock or the answer type would start lying the moment they
    // dragged a slider.
    name: "My mode",
    mode: { ...CUSTOM_DEFAULT_MODE },
  };
}
export function loadCustom() {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY);
    if (raw) {
      const o = JSON.parse(raw);
      if (o && Array.isArray(o.presets) && o.presets.length) {
        const activeId = o.presets.some((p) => p && p.id === o.activeId) ? o.activeId : o.presets[0].id;
        return { presets: o.presets, activeId };
      }
    }
  } catch (e) { /* ignore */ }
  const seed = defaultCustomPreset();
  return { presets: [seed], activeId: seed.id };
}
export function saveCustom(o) {
  try { localStorage.setItem(CUSTOM_KEY, JSON.stringify(o)); } catch (e) { /* ignore */ }
}
// The preset the player will play / edit next. Never null (loadCustom always seeds one).
export function activeCustomPreset() {
  const o = loadCustom();
  return o.presets.find((p) => p.id === o.activeId) || o.presets[0];
}
export function resetCustom() {
  try { localStorage.removeItem(CUSTOM_KEY); } catch (e) { /* ignore */ }
}

/* ---------- Game types ever played (for "Hits Different") ---------- */
// Value: { classic?: true, infinite?: true, daily?: true }
export function loadTypesPlayed() {
  try {
    const raw = localStorage.getItem(TYPES_KEY);
    if (raw) { const o = JSON.parse(raw); if (o && typeof o === "object") return o; }
  } catch (e) { /* ignore */ }
  return {};
}
// Mark a game type as played; returns the updated record.
export function markTypePlayed(type) {
  const o = loadTypesPlayed();
  if (o[type]) return o;
  o[type] = true;
  try { localStorage.setItem(TYPES_KEY, JSON.stringify(o)); } catch (e) { /* ignore */ }
  return o;
}

// How many of the seven shelf types have ever been finished. Reads the same record as
// loadTypesPlayed but counts only SHELF_TYPES, so a stray key (an old build's type, a
// bonus run if one ever slipped in) can never inflate the breadth rungs.
export function shelfTypesPlayed(o = loadTypesPlayed()) {
  return SHELF_TYPES.filter((t) => o[t]).length;
}

/* ---------- Game types played TODAY (for "Every Single Day") ----------
   Value: { d: "YYYY-MM-DD", types: { [type]: true } }. Kept one day deep — a record whose
   date isn't today is thrown away and started again rather than merged, which is what makes
   this a sitting rather than a lifetime. The date is passed in (never read off `new Date`
   here) so the dev date override moves it like every other dated surface. */
export function loadDayTypes(dateKey) {
  try {
    const raw = localStorage.getItem(DAY_TYPES_KEY);
    if (raw) {
      const o = JSON.parse(raw);
      if (o && typeof o === "object" && o.d === dateKey && o.types && typeof o.types === "object") return o.types;
    }
  } catch (e) { /* ignore */ }
  return {};
}
// Record one type against today; returns how many DISTINCT shelf types today now holds.
export function markDayTypePlayed(dateKey, type) {
  const types = loadDayTypes(dateKey);
  if (type && !types[type]) {
    types[type] = true;
    try { localStorage.setItem(DAY_TYPES_KEY, JSON.stringify({ d: dateKey, types })); } catch (e) { /* ignore */ }
  }
  return SHELF_TYPES.filter((t) => types[t]).length;
}

/* ---------- Runs the randomiser has dealt (for the two dice charms) ----------
   Value: { n }. A plain count, deliberately NOT derived from RANDOM_KEY: that ledger stores
   which tokens the dice has already shown you, so re-dealing something it has dealt before
   would not move it, and "13 runs the dice picked" would then be uncompletable for a player
   whose pool is small. */
export function loadDicePicks() {
  try {
    const raw = localStorage.getItem(DICE_KEY);
    if (raw) { const o = JSON.parse(raw); if (o && typeof o === "object" && Number.isFinite(o.n)) return o.n; }
  } catch (e) { /* ignore */ }
  return 0;
}
// Count one dealt run; returns the new total.
export function markDicePick() {
  const n = loadDicePicks() + 1;
  try { localStorage.setItem(DICE_KEY, JSON.stringify({ n })); } catch (e) { /* ignore */ }
  return n;
}

/* ---------- Modes ever played (for "Explorer") ---------- */
// Finer-grained than TYPES_KEY, which only knows classic/infinite/daily. A token is one
// way the game can be played: "classic:hard", "inf-sudden:ultra", "custom".
// EXPLORER_TOKENS lists the set Explorer wants; anything else recorded here (lyricist,
// daily) is harmless breadth we simply don't ask for.
// Value: { [token]: true }
export function loadModesSeen() {
  try {
    const raw = localStorage.getItem(BREADTH_KEY);
    if (raw) { const o = JSON.parse(raw); if (o && typeof o === "object") return o; }
  } catch (e) { /* ignore */ }
  return {};
}
// Record one mode token as played; returns the updated record.
export function markModeSeen(token) {
  const o = loadModesSeen();
  if (!token || o[token]) return o;
  o[token] = true;
  try { localStorage.setItem(BREADTH_KEY, JSON.stringify(o)); } catch (e) { /* ignore */ }
  return o;
}
// Has every Explorer token been seen?
export function hasExploredEverything(seen = loadModesSeen()) {
  return EXPLORER_TOKENS.every((t) => seen[t]);
}

/* ---------- Weekdays ever played on (for "Seven") ---------- */
// Value: { [0-6]: true }, Sunday = 0, matching Date#getDay.
export function loadWeekdaysPlayed() {
  try {
    const raw = localStorage.getItem(WEEKDAYS_KEY);
    if (raw) { const o = JSON.parse(raw); if (o && typeof o === "object") return o; }
  } catch (e) { /* ignore */ }
  return {};
}
// Record today's weekday as played; returns the updated record.
export function markWeekdayPlayed(day = new Date().getDay()) {
  const o = loadWeekdaysPlayed();
  if (o[day]) return o;
  o[day] = true;
  try { localStorage.setItem(WEEKDAYS_KEY, JSON.stringify(o)); } catch (e) { /* ignore */ }
  return o;
}
// All seven days ticked off?
export function hasPlayedEveryWeekday(seen = loadWeekdaysPlayed()) {
  for (let d = 0; d < 7; d++) if (!seen[d]) return false;
  return true;
}
/* ---------- The calendar ledger (days and months ever played on) ----------
   Value: { days: { [YYYY-MM-DD]: true }, months: { [1-12]: true } }. Months are keyed by
   month NUMBER, not year-month: "played in all twelve months" is a lifetime collection, so a
   player who starts in July can finish it the following June rather than being told to wait for
   a calendar year they can no longer complete. See DATES_KEY for why this isn't derived from
   the history log. */
export function loadDatesPlayed() {
  const d = { days: {}, months: {} };
  try {
    const raw = localStorage.getItem(DATES_KEY);
    if (raw) {
      const o = JSON.parse(raw);
      if (o && typeof o === "object") {
        return {
          days: (o.days && typeof o.days === "object") ? o.days : {},
          months: (o.months && typeof o.months === "object") ? o.months : {},
        };
      }
    }
  } catch (e) { /* ignore */ }
  return d;
}
// Record one ISO date (YYYY-MM-DD) as played; returns the updated ledger. Takes the date as a
// string rather than a Date so the caller's todayKey() — and with it the dev date override —
// is the single source of what "today" means.
export function markDatePlayed(iso) {
  const o = loadDatesPlayed();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso || "")) return o;
  const month = String(+iso.slice(5, 7));
  if (o.days[iso] && o.months[month]) return o;
  o.days[iso] = true;
  o.months[month] = true;
  try { localStorage.setItem(DATES_KEY, JSON.stringify(o)); } catch (e) { /* ignore */ }
  return o;
}
// How many distinct calendar days have ever been played on.
export function distinctDaysPlayed(led = loadDatesPlayed()) { return Object.keys(led.days).length; }
// Have all twelve month numbers been ticked off?
export function hasPlayedEveryMonth(led = loadDatesPlayed()) {
  for (let m = 1; m <= 12; m++) if (!led.months[String(m)]) return false;
  return true;
}
// Length of the run of consecutive days ending on `iso` (0 if that day wasn't played).
// Walks the date at local noon, so neither a DST shift nor a timezone past UTC+12 can roll a
// step onto its neighbour — hence the local field read rather than toISOString, which would
// hand back the previous day for anyone east of UTC+12.
export function dayStreakEnding(iso, led = loadDatesPlayed()) {
  if (!led.days[iso]) return 0;
  const key = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  let n = 0;
  const d = new Date(iso + "T12:00:00");
  while (led.days[key(d)]) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
// Clear the breadth stores (dev tool; resetAchievements sweeps them too).
export function resetBreadth() {
  try {
    localStorage.removeItem(BREADTH_KEY);
    localStorage.removeItem(WEEKDAYS_KEY);
    localStorage.removeItem(DATES_KEY);
    // The shelf ladder and the dice are breadth too, and a reset that left them standing would
    // have breadth.reset() report a clean slate its own shelf readout disagreed with.
    localStorage.removeItem(TYPES_KEY);
    localStorage.removeItem(DAY_TYPES_KEY);
    localStorage.removeItem(DICE_KEY);
  } catch (e) { /* ignore */ }
}

/* ---------- The randomiser's "already shown you" ledger ----------
   Deliberately NOT derived from the boards at draw time. Three of them cannot answer the
   question at all — Album Focus and the guest shelf record a best and a mark but no play count,
   so a run that scored nothing is indistinguishable from one never played — and the ones that
   can answer it disagree about when a run counts, since a board is written at the END of a run.
   The randomiser's question is "have you been shown this", and a run you opened and walked out
   of has been shown to you, so this is marked at run START from every start path instead.

   Marked by every start path, not just the randomiser's own: a notebook where playing Midnights
   from the album shelf didn't count would keep dealing you Midnights. Value: { [token]: true }.
   Tokens are minted by app.js (randomToken) and never parsed back apart here. */
export function loadRandomSeen() {
  try {
    const raw = localStorage.getItem(RANDOM_KEY);
    if (raw) { const o = JSON.parse(raw); if (o && typeof o === "object") return o; }
  } catch (e) { /* ignore */ }
  return {};
}
// Record one token as shown; returns the updated record.
export function markRandomSeen(token) {
  const o = loadRandomSeen();
  if (!token || o[token]) return o;
  o[token] = true;
  try { localStorage.setItem(RANDOM_KEY, JSON.stringify(o)); } catch (e) { /* ignore */ }
  return o;
}
// Has the ledger ever been written? Distinguishes a notebook that has genuinely seen nothing
// from one that simply predates this ledger — see seedRandomSeen.
export function randomSeeded() {
  try { return localStorage.getItem(RANDOM_KEY) !== null; } catch (e) { return false; }
}
// One-time backfill, run once at startup. The ledger arrives empty on a notebook that has been
// played for months, and an empty ledger reads as "nothing has been played", which would tell
// the randomiser to lean toward things this player has done a hundred times. So the play history
// the boards CAN attest to is folded in once, and from then on the ledger keeps itself.
// Writes even when `tokens` is empty, so the seeded flag is set and this never runs twice.
export function seedRandomSeen(tokens) {
  if (randomSeeded()) return loadRandomSeen();
  const o = {};
  for (const t of tokens || []) if (t) o[t] = true;
  try { localStorage.setItem(RANDOM_KEY, JSON.stringify(o)); } catch (e) { /* ignore */ }
  return o;
}
export function resetRandomSeen() {
  try { localStorage.removeItem(RANDOM_KEY); } catch (e) { /* ignore */ }
}

/* ---------- The pinned goal (one charm, on the Charm Collection page) ---------- */
// { id, pinned: isoDate }. Only ever ONE, deliberately: a wall of goals is the charm grid
// again. The id is not validated here — a charm that has since been retagged or renamed is
// caught at render time, where the pool is known.
export function loadGoal() {
  try {
    const raw = localStorage.getItem(GOAL_KEY);
    if (raw) { const o = JSON.parse(raw); if (o && typeof o === "object" && o.id) return o; }
  } catch (e) { /* ignore */ }
  return null;
}
export function saveGoal(id) {
  const o = { id, pinned: new Date().toISOString() };
  try { localStorage.setItem(GOAL_KEY, JSON.stringify(o)); } catch (e) { /* ignore */ }
  return o;
}
export function clearGoal() {
  try { localStorage.removeItem(GOAL_KEY); } catch (e) { /* ignore */ }
}

/* ---------- Folded sections on the Charm Collection ---------- */
// Only the folded ids are kept. Storing the closed set rather than the open one means a
// theme added to ACH_GROUPS later arrives open, and a cleared notebook reads as all open.
export function loadCharmFolds() {
  try {
    const raw = localStorage.getItem(ACH_FOLD_KEY);
    if (raw) { const a = JSON.parse(raw); if (Array.isArray(a)) return a.filter((id) => typeof id === "string"); }
  } catch (e) { /* ignore */ }
  return [];
}
export function setCharmFold(id, folded) {
  const next = loadCharmFolds().filter((x) => x !== id);
  if (folded) next.push(id);
  try { localStorage.setItem(ACH_FOLD_KEY, JSON.stringify(next)); } catch (e) { /* ignore */ }
  return next;
}
export function saveCharmFolds(ids) {
  const next = (ids || []).filter((id) => typeof id === "string");
  try { localStorage.setItem(ACH_FOLD_KEY, JSON.stringify(next)); } catch (e) { /* ignore */ }
  return next;
}

/* ---------- Lifetime per-song / per-word tally ---------- */
// One record across every game type & difficulty. Powers Favourite Song,
// Songs Discovered, Favourite Album, Nemesis Word — and later "I Knew Everything".
// Key: swiftSongAssociation.songTally
//   songs:  { [title]:  correctCount }  — times this song was a correct answer
//   albums: { [album]:  correctCount }  — times a correct answer came from this album
//   words:  { [word]:   correctCount }  — times this prompt word was answered correctly
//   misses: { [word]:   missCount }     — times this prompt word was missed (wrong/timeout)
export function loadSongTally() {
  try {
    const raw = localStorage.getItem(TALLY_KEY);
    if (raw) {
      const o = JSON.parse(raw);
      if (o && typeof o === "object") {
        return { songs: o.songs || {}, albums: o.albums || {}, words: o.words || {}, misses: o.misses || {} };
      }
    }
  } catch (e) { /* ignore */ }
  return { songs: {}, albums: {}, words: {}, misses: {} };
}
export function saveSongTally(t) {
  try { localStorage.setItem(TALLY_KEY, JSON.stringify(t)); } catch (e) { /* ignore */ }
}
// Fold one finished game into the lifetime tally. `rounds` is an array of
// { correct, title, album, word } — one entry per played round. A correct round
// credits its song + album + prompt word; a missed round blames its prompt word.
// Returns the updated tally.
export function recordGameTally(rounds) {
  const t = loadSongTally();
  for (const r of rounds) {
    if (!r) continue;
    if (r.correct) {
      if (r.title) t.songs[r.title] = (t.songs[r.title] || 0) + 1;
      if (r.album) t.albums[r.album] = (t.albums[r.album] || 0) + 1;
      if (r.word) t.words[r.word] = (t.words[r.word] || 0) + 1;
    } else if (r.word) {
      t.misses[r.word] = (t.misses[r.word] || 0) + 1;
    }
  }
  saveSongTally(t);
  return t;
}

/* ---------- Lifetime metrics (cross-game, cross-mode counters) ---------- */
// One record across every game type & difficulty, folded once per finished game.
// Backs the Stats "by the numbers" block: fastest/avg answer, accuracy, lyric lines,
// daily totals. Kept separate from per-mode stats so it spans classic/infinite/daily.
//   fastestMs   — fastest single correct answer in a timed mode (null = none yet)
//   answerSumMs — total time spent on timed rounds (for the average)
//   answerN     — count of timed rounds counted (for the average)
//   lyricLines  — lifetime lyric lines recalled
//   versePerfect — lifetime word-perfect-or-better lines (the verse-bonus prestige metric)
//   wholeVerses  — lifetime whole-verse (WHOLE_VERSE_LINES-line) recalls
//   bestVerseBonus — most verse-bonus points earned in a single game
//   roundsTotal / roundsCorrect — lifetime rounds played / answered right (accuracy)
//   dailyPlayed / dailyPerfect  — lifetime daily challenges finished / perfected
//   noTimeoutStreak — consecutive non-infinite games finished with zero timeouts
//   correctRunStreak — correct answers in a row ACROSS game boundaries (see bumpCorrectRunStreak)
//   scarfClicks — lifetime taps on the scarf margin doodle
//   mugSips — lifetime taps on the desk mug (the coffee-pour egg)
//   marksTapped — { [markKind]: true } for each page-header mark poked, lifetime
export function loadMetrics() {
  const d = { fastestMs: null, answerSumMs: 0, answerN: 0, lyricLines: 0, versePerfect: 0, wholeVerses: 0, bestVerseBonus: 0, roundsTotal: 0, roundsCorrect: 0, dailyPlayed: 0, dailyPerfect: 0, noTimeoutStreak: 0, correctRunStreak: 0, scarfClicks: 0, mugSips: 0, marksTapped: {}, selfTitled: {} };
  try {
    const raw = localStorage.getItem(METRICS_KEY);
    if (raw) { const o = JSON.parse(raw); if (o && typeof o === "object") return { ...d, ...o }; }
  } catch (e) { /* ignore */ }
  return d;
}
export function saveMetrics(m) {
  try { localStorage.setItem(METRICS_KEY, JSON.stringify(m)); } catch (e) { /* ignore */ }
}
// Fold one finished game into the lifetime metrics. `g` carries the per-game totals
// gathered during play (see app.js submitAnswer / endGame). Returns the updated record.
export function recordGameMetrics(g) {
  const m = loadMetrics();
  m.roundsTotal += g.rounds || 0;
  m.roundsCorrect += g.correct || 0;
  m.lyricLines += g.lyricLines || 0;
  m.versePerfect += g.versePerfect || 0;
  m.wholeVerses += g.wholeVerses || 0;
  if ((g.verseBonus || 0) > (m.bestVerseBonus || 0)) m.bestVerseBonus = g.verseBonus;
  m.answerSumMs += g.timeSumMs || 0;
  m.answerN += g.timedRounds || 0;
  if (g.fastestMs != null && (m.fastestMs == null || g.fastestMs < m.fastestMs)) m.fastestMs = g.fastestMs;
  if (g.isDaily) { m.dailyPlayed += 1; if (g.dailyPerfect) m.dailyPerfect += 1; }
  // Consecutive non-infinite games finished with zero timeouts (backs "Fearless (Taylor's
  // Version)"). Infinite games are ignored entirely — they neither extend nor break it.
  if (!g.isInfinite) m.noTimeoutStreak = (g.timeouts === 0) ? (m.noTimeoutStreak || 0) + 1 : 0;
  saveMetrics(m);
  return m;
}

// The correct-in-a-row streak that survives the end of a game. Written per ANSWER rather than
// per run, so it lives here instead of in recordGameMetrics. The same rule noTimeoutStreak
// follows applies: some game types are INVISIBLE to it — they neither extend it nor break it —
// and the caller decides which by simply not calling (see app.js's streakVisible). Returns the
// updated streak.
export function bumpCorrectRunStreak(correct) {
  const m = loadMetrics();
  m.correctRunStreak = correct ? (m.correctRunStreak || 0) + 1 : 0;
  saveMetrics(m);
  return m.correctRunStreak;
}

// One tap on the scarf doodle. In METRICS rather than a key of its own: it is a lifetime
// counter of a thing the player did, which is exactly what this record is for.
export function bumpScarfClicks() {
  const m = loadMetrics();
  m.scarfClicks = (m.scarfClicks || 0) + 1;
  saveMetrics(m);
  return m.scarfClicks;
}
// One tap on the desk mug. Lifetime, and kept here for the same reason the scarf's tally is:
// it is a count of a thing the player did, spread over as many sittings as they like. What it
// buys is the pour that forms in the crema (see app.js MUG_POUR_SIPS), so it is read on every
// load, not only when it is written.
export function bumpMugSips() {
  const m = loadMetrics();
  m.mugSips = (m.mugSips || 0) + 1;
  saveMetrics(m);
  return m.mugSips;
}
// The margin mark at the top of each inside page. Lifetime and set-shaped rather than a
// count, because the feat is having touched all ten of them, in any order and across any
// number of sittings — a tally would let ten pokes at one mark stand in for the collection.
export function tapPageMark(kind) {
  const m = loadMetrics();
  m.marksTapped = { ...(m.marksTapped || {}) };
  if (m.marksTapped[kind]) return m.marksTapped;
  m.marksTapped[kind] = true;
  saveMetrics(m);
  return m.marksTapped;
}
export function pageMarksTapped() {
  return loadMetrics().marksTapped || {};
}

// Say The Quiet Part: the WORDS you have taken with the song of the same name, one slot each.
// Set-shaped for the same reason marksTapped is — answering "red" with "Red" on fifty separate
// evenings is one piece of knowledge, not fifty. Returns how many distinct words are held.
export function noteSelfTitledWord(word) {
  const m = loadMetrics();
  const key = String(word || "").toLowerCase();
  if (!key) return Object.keys(m.selfTitled || {}).length;
  m.selfTitled = { ...(m.selfTitled || {}) };
  if (!m.selfTitled[key]) { m.selfTitled[key] = true; saveMetrics(m); }
  return Object.keys(m.selfTitled).length;
}

/* ---------- Skills & Mastery progression ---------- */
// One record across every game type. `skills` holds cumulative XP per skill; levels are
// always DERIVED from XP (never stored), so the curve can be retuned without migration.
// `masteryXp` only accrues once the unlock gate is cleared. `unlocked` mirrors the
// achievements shape — { [rewardId]: isoDate }. Spread-merge defaults like loadMetrics, so
// players with no key (or a future new skill) get sensible values with no migration step.
/* The level-5 bracelet set shipped as "charm-heart", "charm-moon" and so on, and was renamed
   to "trinket-*" when the dangle stopped answering to the same word as an achievement charm.
   The ledger is keyed by reward id, so an un-migrated notebook would show all eight re-locked
   with the level already paid for. Rewrites in place on load and leaves everything else. */
function migrateTrinketRewards(unlocked) {
  const out = {};
  for (const [id, v] of Object.entries(unlocked)) out[id.startsWith("charm-") ? "trinket-" + id.slice(6) : id] = v;
  return out;
}

export function loadMastery() {
  const d = { skills: { resolve: 0, tempo: 0, lyricist: 0, endurance: 0, range: 0 }, masteryXp: 0, unlocked: {} };
  try {
    const raw = localStorage.getItem(MASTERY_KEY);
    if (raw) {
      const o = JSON.parse(raw);
      if (o && typeof o === "object") {
        return {
          skills: { ...d.skills, ...(o.skills || {}) },
          masteryXp: o.masteryXp || 0,
          unlocked: migrateTrinketRewards((o.unlocked && typeof o.unlocked === "object") ? o.unlocked : {}),
        };
      }
    }
  } catch (e) { /* ignore */ }
  return d;
}
export function saveMastery(m) {
  try { localStorage.setItem(MASTERY_KEY, JSON.stringify(m)); } catch (e) { /* ignore */ }
}
// Total of the five skills' levels (0..50). The Mastery unlock gate compares against this.
export function totalSkillLevels(m = loadMastery()) {
  return SKILL_IDS.reduce((n, id) => n + skillLevelFromXp(m.skills[id] || 0), 0);
}
export function isMasteryUnlocked(m = loadMastery()) {
  return totalSkillLevels(m) >= MASTERY_GATE;
}
// Fold a game's per-skill XP into the record. `delta` is { [skillId]: xp }. Adds to each
// skill; once the gate is cleared, Mastery XP accrues by the same total; any reward whose
// level is newly reached is granted (dated, like a charm). Returns what changed so the
// caller can surface level-up / mastery / unlock toasts.
export function recordSkillXp(delta) {
  const m = loadMastery();
  const before = {};
  for (const id of SKILL_IDS) before[id] = skillLevelFromXp(m.skills[id] || 0);
  const wasUnlocked = isMasteryUnlocked(m);
  const beforeMastery = masteryLevelFromXp(m.masteryXp);

  let sum = 0;
  for (const id of SKILL_IDS) {
    const add = Math.max(0, Math.round((delta && delta[id]) || 0));
    m.skills[id] = (m.skills[id] || 0) + add;
    sum += add;
  }

  const nowUnlocked = isMasteryUnlocked(m);
  if (nowUnlocked) m.masteryXp = (m.masteryXp || 0) + sum;   // only counts once you're past the gate

  const levelUps = [];
  for (const id of SKILL_IDS) {
    const to = skillLevelFromXp(m.skills[id]);
    if (to > before[id]) levelUps.push({ id, from: before[id], to });
  }
  const afterMastery = masteryLevelFromXp(m.masteryXp);
  const masteryUp = afterMastery > beforeMastery ? { from: beforeMastery, to: afterMastery } : null;

  const newUnlocks = [];
  for (const r of MASTERY_REWARDS) {
    if (r.level <= afterMastery && !m.unlocked[r.id]) {
      m.unlocked[r.id] = new Date().toISOString();
      newUnlocks.push(r.id);
    }
  }

  saveMastery(m);
  return { levelUps, masteryUp, masteryJustUnlocked: nowUnlocked && !wasUnlocked, newUnlocks, mastery: m };
}
export function resetMastery() {
  try { localStorage.removeItem(MASTERY_KEY); } catch (e) { /* ignore */ }
}

// The old fake-celebrity "Hall of Fame" (HS_KEY) is fully retired — no reader or
// writer remains. Any stale highscores.* keys from older versions are swept by
// resetRecords() and still round-trip through export/import (they're under APP_PREFIX).

/* ---------- Personal records (your own best runs, per mode) ---------- */
// Same mode-token scheme as stats/high-scores: medium = unsuffixed legacy-style key,
// every other mode (incl. infinite "inf-<variant>-<mode>" tokens) gets a suffix.
// Entry shape: { score, date } where date is a "YYYY-MM-DD" string (or null for the
// migrated "best so far" seed). For infinite, score holds rounds survived.
export function recordsKey(mode) { return mode === "medium" ? RECORDS_KEY : RECORDS_KEY + "." + mode; }
export function loadRecords(mode) {
  try {
    const raw = localStorage.getItem(recordsKey(mode));
    if (raw) { const a = JSON.parse(raw); if (Array.isArray(a)) return a; }
  } catch (e) { /* ignore */ }
  return [];
}
// One-time migration: seed each mode's records from the player's *pre-existing* best
// (their stats), so returning players keep their real achievement as a dateless "best
// so far" entry — no fake celebrity names. Run once at startup, BEFORE any game folds a
// new score into stats, so the seed reflects history rather than the run in progress.
// Idempotent: only seeds a mode that has a best but no records yet.
export function migrateRecordsFromStats() {
  const tokens = MODE_ORDER.slice();
  for (const v of ["3lives", "sudden"]) for (const m of MODE_ORDER) tokens.push("inf-" + v + "-" + m);
  for (const mode of tokens) {
    if (loadRecords(mode).length) continue;   // already has records
    const best = loadStats(mode).best;
    if (best > 0) saveRecords([{ score: best, date: null }], mode);
  }
}
export function saveRecords(list, mode) {
  try { localStorage.setItem(recordsKey(mode), JSON.stringify(list)); } catch (e) { /* ignore */ }
}
// Ranking for a mode's records: higher score first, then — at an equal score — the
// FASTER completion time (a run with a recorded time outranks one without, so a real
// timed run supersedes the dateless migration seed), then — when score AND time are
// identical — the bigger verse bonus (a second-order prestige tie-break), then earliest
// date first. `verse` is optional/back-compat (a missing value counts as 0).
function cmpRecords(a, b) {
  if (b.score !== a.score) return b.score - a.score;
  const at = a.time, bt = b.time;
  if (at != null && bt != null && at !== bt) return at - bt;   // faster wins
  if (at != null && bt == null) return -1;
  if (at == null && bt != null) return 1;
  const av = a.verse || 0, bv = b.verse || 0;
  if (av !== bv) return bv - av;                                // more verse bonus wins
  const ad = a.date || "", bd = b.date || "";
  return ad < bd ? -1 : ad > bd ? 1 : 0;
}
// Insert a finished run; keep the top 5 per cmpRecords. `time` (completion seconds) is
// optional — only timed classic modes pass it; relaxed/infinite omit it (no speed tie-break).
// `verse` (verse-bonus points) is the second-order tie-break, only used at equal score+time.
// Returns { list, rank, isBest }; rank is the just-played run's 0-based index (-1 if off-board).
export function insertRecord(mode, score, date, time = null, verse = 0) {
  const entry = { score, date, __this: true };
  if (time != null) entry.time = time;
  if (verse) entry.verse = verse;
  const top = loadRecords(mode).concat([entry]).sort(cmpRecords).slice(0, 5);
  const rank = top.indexOf(entry);
  saveRecords(top.map((e) => {                                  // strip the transient __this
    const o = { score: e.score, date: e.date };
    if (e.time != null) o.time = e.time;
    if (e.verse) o.verse = e.verse;
    return o;
  }), mode);
  return { list: top, rank, isBest: rank === 0 };
}

/* ---------- Run history (chronological log of every finished run) ---------- */
// One flat, newest-first array across all modes/game types. Entry:
//   { s, c, n, m, t, d }  → score (headline number), correct, rounds played,
//   mode token, game type, ISO datetime. Capped to the most recent HISTORY_CAP.
export function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) { const a = JSON.parse(raw); if (Array.isArray(a)) return a; }
  } catch (e) { /* ignore */ }
  return [];
}
export function appendHistory(entry) {
  const list = loadHistory();
  list.unshift(entry);                       // newest first
  if (list.length > HISTORY_CAP) list.length = HISTORY_CAP;
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(list)); } catch (e) { /* ignore */ }
  return list;
}

/* ---------- Notebook signature (set once, reused on every record) ---------- */
export function getPlayerName() { return (loadSettings().playerName || "").trim(); }
export function setPlayerName(name) {
  const s = loadSettings();
  s.playerName = (name || "").trim().slice(0, 20);
  saveSettings(s);
  return s.playerName;
}

/* ---------- Profile polaroid (a center-cropped photo data-URL) ---------- */
// Lives in settings, so it's wiped by a settings-reset and untouched by a
// records-reset — and rides along in an export backup. "" means no photo.
export function getAvatar() { return loadSettings().avatar || ""; }
export function setAvatar(dataUrl) {
  const s = loadSettings();
  s.avatar = dataUrl || "";
  saveSettings(s);
  return s.avatar;
}

/* ---------- Difficulty ---------- */
export function loadMode() {
  try {
    const id = localStorage.getItem(DIFF_KEY);
    if (id && MODES[id]) return MODES[id];
  } catch (e) { /* ignore */ }
  return MODES.medium;
}

/* ---------- Daily challenge ---------- */
// Per-day played result. Key: swiftSongAssociation.daily.YYYY-MM-DD
// Value keeps the compact legacy fields plus an optional versioned `bracelet` snapshot and
// `revealed` flag. The richer payload lets the finished Daily redraw faithfully after reload.
export function loadDailyResult(dateStr) {
  try {
    const raw = localStorage.getItem(DAILY_KEY + "." + dateStr);
    if (raw) { const o = JSON.parse(raw); if (o && typeof o.score === "number") return o; }
  } catch (e) { /* ignore */ }
  return null;
}
export function saveDailyResult(dateStr, data) {
  try { localStorage.setItem(DAILY_KEY + "." + dateStr, JSON.stringify(data)); } catch (e) { /* ignore */ }
}
// Drop just one day's saved daily result (dev helper) — lets a single day be
// replayed without nuking the streak the way resetDaily() does.
export function clearDailyResult(dateStr) {
  try { localStorage.removeItem(DAILY_KEY + "." + dateStr); } catch (e) { /* ignore */ }
}

// Per-day IN-PROGRESS daily run. Saved after each completed round so a refresh or
// exit mid-daily resumes where the player left off (closing the replay loophole)
// instead of silently restarting. Cleared the moment the run is completed.
// Key: swiftSongAssociation.dailyProgress.YYYY-MM-DD
// Only the current day's snapshot can ever be resumed. Sweep older snapshots whenever a
// daily is opened or saved so abandoned runs do not accumulate forever.
function pruneDailyProgress(keepDateStr) {
  const keepKey = keepDateStr ? DAILY_PROGRESS_KEY + "." + keepDateStr : null;
  for (const k of appKeys()) {
    if ((k === DAILY_PROGRESS_KEY || k.startsWith(DAILY_PROGRESS_KEY + ".")) && k !== keepKey) {
      localStorage.removeItem(k);
    }
  }
}
export function loadDailyProgress(dateStr) {
  try {
    pruneDailyProgress(dateStr);
    const raw = localStorage.getItem(DAILY_PROGRESS_KEY + "." + dateStr);
    if (raw) { const o = JSON.parse(raw); if (o && Array.isArray(o.roundResults)) return o; }
  } catch (e) { /* ignore */ }
  return null;
}
export function saveDailyProgress(dateStr, data) {
  try {
    pruneDailyProgress(dateStr);
    localStorage.setItem(DAILY_PROGRESS_KEY + "." + dateStr, JSON.stringify(data));
  } catch (e) { /* ignore */ }
}
export function clearDailyProgress(dateStr) {
  try { localStorage.removeItem(DAILY_PROGRESS_KEY + "." + dateStr); } catch (e) { /* ignore */ }
}
export function dailyProgressCount() {
  try {
    return appKeys().filter((k) => k === DAILY_PROGRESS_KEY || k.startsWith(DAILY_PROGRESS_KEY + ".")).length;
  } catch (e) { return 0; }
}

// Lifetime daily totals derived from the per-day result keys (the authoritative
// record — saved on every daily completion). The `metrics` counters miss any
// dailies finished before that store existed; these keys don't, so the Stats
// "by the numbers" daily figures count from here instead.
//   played   — distinct days a daily was completed
//   perfect  — of those, days scored 13/13
export function dailyTotals() {
  let played = 0, perfect = 0;
  const prefix = DAILY_KEY + ".";
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith(prefix)) continue;
      try {
        const o = JSON.parse(localStorage.getItem(k));
        if (o && typeof o.score === "number") {
          played += 1;
          if (o.score === TOTAL_ROUNDS) perfect += 1;
        }
      } catch (e) { /* skip malformed entry */ }
    }
  } catch (e) { /* ignore */ }
  return { played, perfect };
}

// Every date a daily was completed, as a { "YYYY-MM-DD": score } map. Drawn from
// the same per-day result keys as dailyTotals — the authoritative log. Backs the
// Stats daily calendar (which days get crossed off).
export function dailyPlayedDates() {
  const out = {};
  const prefix = DAILY_KEY + ".";
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith(prefix)) continue;
      const dateStr = k.slice(prefix.length);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) continue;
      try {
        const o = JSON.parse(localStorage.getItem(k));
        if (o && typeof o.score === "number") out[dateStr] = o.score;
      } catch (e) { /* skip malformed entry */ }
    }
  } catch (e) { /* ignore */ }
  return out;
}

// The per-day daily fake board (DAILY_BOARD_KEY) is retired — daily now shows a
// personal result + streak + share. Stale dailyBoard.* keys are swept by resetDaily().

/* ---------- Daily streak (consecutive calendar days played) ---------- */
// Key: swiftSongAssociation.dailyStreak  Value: { current, best, lastPlayed }
export const yesterdayOf = (dateStr) => {
  const d = new Date(dateStr + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
};
export function loadDailyStreak() {
  try {
    const raw = localStorage.getItem(DAILY_STREAK_KEY);
    if (raw) { const o = JSON.parse(raw); if (o && typeof o.current === "number") return o; }
  } catch (e) { /* ignore */ }
  return { current: 0, best: 0, lastPlayed: null };
}
export function saveDailyStreak(d) {
  try { localStorage.setItem(DAILY_STREAK_KEY, JSON.stringify(d)); } catch (e) { /* ignore */ }
}
// Record a completed daily play on `dateStr`. Consecutive days extend the streak;
// a gap resets it to 1. Idempotent for the same day (the one-play gate already
// guarantees one call/day, but guard anyway). Returns the updated record.
export function bumpDailyStreak(dateStr) {
  const d = loadDailyStreak();
  if (d.lastPlayed === dateStr) return d;
  d.current = d.lastPlayed === yesterdayOf(dateStr) ? d.current + 1 : 1;
  d.best = Math.max(d.best, d.current);
  d.lastPlayed = dateStr;
  saveDailyStreak(d);
  return d;
}
// The streak as it stands *today*: alive only if the last play was today or
// yesterday, otherwise the run is broken (current shown as 0, best preserved).
export function effectiveDailyStreak(today) {
  const d = loadDailyStreak();
  if (!d.lastPlayed) return { current: 0, best: d.best, lastPlayed: null, playedToday: false };
  const alive = d.lastPlayed === today || d.lastPlayed === yesterdayOf(today);
  return { current: alive ? d.current : 0, best: d.best, lastPlayed: d.lastPlayed, playedToday: d.lastPlayed === today };
}

// A day's bead (see recentDailyAlbums) takes the album the player got the most songs
// right from that day. Ties go to whichever album got there first in the run, so the
// answer is order-independent rather than depending on object key order. A day with
// nothing right has no album at all — a streak counts days PLAYED, not days scored,
// so that is a real state, not something to colour in with a lie.
function dominantDailyAlbum(roundResults, roundAlbums) {
  const count = new Map(), firstAt = new Map();
  for (let i = 0; i < roundResults.length; i++) {
    const a = roundAlbums[i];
    if (!roundResults[i] || !a) continue;
    count.set(a, (count.get(a) || 0) + 1);
    if (!firstAt.has(a)) firstAt.set(a, i);
  }
  let best = null;
  for (const [a, n] of count) {
    if (!best || n > best.n || (n === best.n && firstAt.get(a) < best.at)) best = { a, n, at: firstAt.get(a) };
  }
  return best ? best.a : null;
}
// The day block's streak strand: up to `n` consecutive played days ending at `endDate`
// (inclusive), oldest to newest, each entry the day's dominant album (or null). Stops
// at the first missing day — a streak is consecutive by definition, so a gap ends the
// walk rather than being skipped over. No storage schema change: every input here is
// already on disk in the per-day result saveDailyResult writes.
export function recentDailyAlbums(endDate, n) {
  const out = [];
  let d = endDate;
  for (let i = 0; i < n; i++) {
    const r = loadDailyResult(d);
    if (!r) break;
    out.push(dominantDailyAlbum(r.roundResults || [], r.roundAlbums || []));
    d = yesterdayOf(d);
  }
  return out.reverse();
}

/* ---------- Settings ---------- */
// DEFAULT_SETTINGS is merged under the stored object, so a newly-added default
// key fills in for existing players without a migration step.
export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const o = JSON.parse(raw);
      if (o && typeof o === "object") {
        // The single Pride button became a set of flags, and the rainbow is the one that was
        // being worn under the old id. Migrating here rather than tolerating "pride" at every
        // point of use keeps one spelling of a flag finish in the codebase.
        if (o.masteryButton === "pride") o.masteryButton = "pride-rainbow";
        // The bracelet dangle used to be called a charm, which collided with the achievement
        // charms on the same results screen. It is a trinket now; the ids it holds (heart,
        // moon, "random") never changed, only the setting it lives in.
        if (o.masteryCharm !== undefined) {
          if (o.masteryTrinket === undefined) o.masteryTrinket = o.masteryCharm;
          delete o.masteryCharm;
        }
        return { ...DEFAULT_SETTINGS, ...o };
      }
    }
  } catch (e) { /* ignore */ }
  return { ...DEFAULT_SETTINGS };
}
export function saveSettings(s) {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); } catch (e) { /* ignore */ }
}

/* ---------- Data management (export / import / reset) ---------- */
// Every key this app writes lives under APP_PREFIX; these helpers operate on that
// namespace only, so a backup never drags in unrelated localStorage.
function appKeys() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(APP_PREFIX)) keys.push(k);
  }
  return keys;
}
// Remove a key family: the exact key plus any "<base>.<suffix>" variants
// (e.g. highscores + highscores.hard + highscores.inf-3lives-easy).
function removeByPrefix(base) {
  for (const k of appKeys()) if (k === base || k.startsWith(base + ".")) localStorage.removeItem(k);
}

// A plain { key: rawString } snapshot of every app key, for a JSON backup.
export function exportData() {
  const out = {};
  for (const k of appKeys()) out[k] = localStorage.getItem(k);
  return out;
}
// Restore from such a snapshot. Only keys in the app namespace are written.
// Returns the number of keys restored.
export function importData(obj) {
  if (!obj || typeof obj !== "object") return 0;
  let n = 0;
  for (const k in obj) {
    if (!k.startsWith(APP_PREFIX) || typeof obj[k] !== "string") continue;
    try { localStorage.setItem(k, obj[k]); n++; } catch (e) { /* ignore */ }
  }
  return n;
}

// Per-category resets (the danger zone). Each clears one family of keys.
// Sweeps the records, the run history, and the dormant legacy fake-celebrity board.
export function resetRecords() {
  removeByPrefix(RECORDS_KEY);
  try { localStorage.removeItem(HISTORY_KEY); } catch (e) { /* ignore */ }
  removeByPrefix(HS_KEY);
}
export function resetStatsAll()   { removeByPrefix(STATS_KEY); try { localStorage.removeItem(METRICS_KEY); } catch (e) { /* ignore */ } }
// Clears the charms AND every ledger that only exists to feed one — otherwise a reset leaves
// the breadth charms instantly re-earnable off records the player is being told were wiped.
export function resetAchievements() {
  try {
    localStorage.removeItem(ACH_KEY);
    localStorage.removeItem(TYPES_KEY);
    localStorage.removeItem(BREADTH_KEY);
    localStorage.removeItem(WEEKDAYS_KEY);
    localStorage.removeItem(DATES_KEY);
    localStorage.removeItem(DAY_TYPES_KEY);
    localStorage.removeItem(DICE_KEY);
  } catch (e) { /* ignore */ }
}
export function resetTally()      { try { localStorage.removeItem(TALLY_KEY); } catch (e) { /* ignore */ } }
export function resetDaily() {
  try { localStorage.removeItem(DAILY_STREAK_KEY); } catch (e) { /* ignore */ }
  removeByPrefix(DAILY_KEY);
  removeByPrefix(DAILY_PROGRESS_KEY);
  removeByPrefix(DAILY_BOARD_KEY);
}
// Wipe everything (settings included). Caller should reload afterward.
export function clearAllData() { for (const k of appKeys()) localStorage.removeItem(k); }
