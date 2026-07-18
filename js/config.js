// Pure constants & data tables. No state, no DOM — safe to import anywhere.

export const TOTAL_ROUNDS = 13;
export const ROUND_SECONDS = 10;
export const RECENT_WINDOW = 5;
// On an album's anniversary, the daily challenge draws its prompt words from the words that
// recur across that album's songs. Per round this is the chance of drawing from that album's
// pool, and at 1.0 that is every round: the run already wears the album's colours on all thirteen
// pages, so a partial lean was the odd one out. Only the prompt side is constrained — every song
// in the catalogue stays a legal answer, which is what keeps this from being an Album Focus clone.
// The draw is weighted by distinctiveness. Consumed through the seeded dailyRng so it stays
// identical for everyone on the day. See pickWord / startDaily.
export const DAILY_ALBUM_SKEW = 1.0;
// The exponent the anniversary daily's distinctiveness score is raised to when it becomes a draw
// weight (see weightedAlbumWord). Steeper means the album's signature words surface more often at
// the cost of variety between one anniversary and the next. Re-derived against the score's units,
// not carried over from the raw song count this used to weight: across all 12 albums x 5 years,
// exponent 1 lands 27% of the draw in the album's 25 most distinctive words and repeats 1.6 of 13
// words year-to-year; 2 gives 38% / 1.9; 3 gives 49% / 2.5. 3 buys the strongest album character
// for about one extra repeated word a year, which is invisible on a prompt a player meets once
// every 365 days. Word difficulty is flat across all three, so this trades character for variety
// and nothing else. Re-measure with __dev.daily.years if the score changes again.
export const DAILY_ALBUM_WEIGHT_EXP = 3;

/* ---------- localStorage keys ---------- */
export const HS_KEY = "swiftSongAssociation.highscores";        // legacy fake-celebrity board (dormant; kept for old backups)
export const RECORDS_KEY = "swiftSongAssociation.records";      // personal best runs per mode — { score, date }[]
export const HISTORY_KEY = "swiftSongAssociation.history";      // chronological log of every finished run (capped)
export const STATS_KEY = "swiftSongAssociation.stats";
export const ACH_KEY = "swiftSongAssociation.achievements";
export const DIFF_KEY = "swiftSongAssociation.difficulty";
export const DAILY_KEY = "swiftSongAssociation.daily";
export const DAILY_PROGRESS_KEY = "swiftSongAssociation.dailyProgress";  // in-progress daily run, so a refresh/exit resumes instead of restarting
export const DAILY_BOARD_KEY = "swiftSongAssociation.dailyBoard";
export const DAILY_STREAK_KEY = "swiftSongAssociation.dailyStreak";
export const TYPES_KEY = "swiftSongAssociation.typesPlayed";   // {classic,infinite,daily} — for "Hits Different"
export const TALLY_KEY = "swiftSongAssociation.songTally";     // lifetime per-song/per-word tally — Favourite Song, Songs Discovered, Nemesis Word, I Hate It Here
export const SETTINGS_KEY = "swiftSongAssociation.settings";   // user preferences (see DEFAULT_SETTINGS)
export const METRICS_KEY = "swiftSongAssociation.metrics";    // lifetime cross-game counters — fastest/avg answer, accuracy, lyric lines, daily totals
export const CHALLENGES_KEY = "swiftSongAssociation.challenges";        // per-challenge progress — { [id]: {unlocked, defeated, attempts, best} }
export const CHALLENGE_TOKENS_KEY = "swiftSongAssociation.challengeTokens"; // { balance } — tokens spent to unlock challenges
export const ALBUM_FOCUS_KEY = "swiftSongAssociation.albumFocus";       // per-album best/beaten board — { [album]: {best, bestDiff, beaten, beatenDiff, perfected, perfectedDiff} }
export const ADAPTIVE_KEY = "swiftSongAssociation.adaptive";            // Adaptive mode board — { bestPeak, bestScore, date, played }
export const SEARCH_KEY = "swiftSongAssociation.search";                // Swift To The Lyric searcher — { mode, view, recent:[] }
export const MASTERY_KEY = "swiftSongAssociation.mastery";              // skills + mastery progression — { skills:{...xp}, masteryXp, unlocked:{[rewardId]:isoDate} }
export const STUDY_KEY = "swiftSongAssociation.studySet";              // Study mode Leitner deck — { words:{[word]:{box,seen,due}}, sessions }
export const CUSTOM_KEY = "swiftSongAssociation.custom";               // player-authored modes — { presets:[{id,name,mode}], activeId }
export const KEEPSAKES_KEY = "swiftSongAssociation.keepsakes";         // earned collectibles — { [polaroidId]: isoDate } (unlock time, mirrors achievements)

// Keepsakes — the collectible polaroid set (subjects + SVGs live in js/polaroids.js).
// A polaroid develops like real instant film: solid black on unlock, the photo fading
// in POLAROID_DEVELOP_MS later. "developed" is derived from unlock+this at render time,
// never a running timer, so it survives reloads and self-heals. POLAROID_TOTAL is the
// counter denominator (a Taylor number); the set grows toward it.
export const POLAROID_DEVELOP_MS = 13 * 60 * 1000;   // 13 real minutes
export const POLAROID_TOTAL = 22;

// Every persisted key shares this namespace; export/import and "clear everything"
// sweep all keys under it.
export const APP_PREFIX = "swiftSongAssociation.";

/* ---------- User settings (the settings panel) ---------- */
// One flat record. loadSettings merges this over whatever's stored, so adding a
// new key here gives existing players a sensible default with no migration.
export const DEFAULT_SETTINGS = {
  // motion & animation
  reduceMotion: "auto",     // "auto" (follow OS) | "on" | "off"
  animSpeed: "normal",      // "normal" | "fast" | "instant"
  pageTurn: true,           // page-flip between rounds
  penCircle: true,          // pen-circle confirm before the verdict
  sparkles: true,           // sparkle burst on a correct answer
  timerTension: true,       // vignette / word tremor / red margin tally in the final seconds
  reducedFlashing: false,   // also suppress the perfect-game star shower
  snake: true,              // the reputation-era slithering snake
  // gameplay pacing
  autoAdvance: true,        // auto-advance countdown after a correct answer
  countdownSecs: 5,         // 3..8 — length of that countdown
  enterOnMiss: true,        // Enter advances past the miss screen
  showExamples: true,       // show example songs after a wrong answer
  stemMatching: true,       // match word variants (love→loving, gold→golden); off = exact word only

  enableHints: true,        // show progressive hints in Easy/Normal/Relaxed (a hinted run can't set a personal best)
  censorExplicit: false,    // mask general profanity (fuck→f**k) in shown lyrics/titles; the racial slur is always masked regardless

  defaultGameType: "last",  // "last" | "classic" | "infinite" | "adaptive"
  defaultDifficulty: "last",// "last" | a MODES id
  defaultStatsTab: "all",   // which Stats tab opens first: "all" | "last" | a MODES id
  // display & accessibility
  highContrast: false,
  colorBlindAlbums: false,  // swap ALBUM_COLORS for a colour-blind-friendly palette
  hideDailyScore: false,    // hide the daily score until "reveal & copy"
  timezone: "auto",         // daily-reset zone: "auto" (detect) | an IANA id e.g. "America/New_York"
  weekStart: "mon",         // first row/column of week-based views (the records calendar): "mon" | "sun"
  clock: "12",              // time-of-day format wherever a clock time is shown: "12" (4:31 PM) | "24" (16:31)
  // onboarding / first-run — the shared state every "first impressions" feature hangs off
  firstRunDone: false,      // has the player finished the first-run welcome flow (gates the intro + the ready-for-normal nudge)
  favouriteAlbum: "",       // era chosen in the first-run question ("" = never asked or skipped); surfaced on the profile
  firstMatchDone: false,    // has the player ever landed a correct answer (guards the one-time first-match celebration)
  seenCoachmarks: {},       // { [coachmarkId]: true } — just-in-time tips already shown, so each fires once
  // meta
  sound: false,             // opt-in; the synthesized palette lives in js/sound.js
  lastGameType: "classic",  // runtime memory backing defaultGameType: "last" — the last type clicked (not shown in UI)
  playerName: "",           // notebook signature — set once, reused on every personal record
  avatar: "",               // profile polaroid — a center-cropped data-URL, stays on this device
  masteryPen: "",           // chosen writing pen, unlocked via Mastery ("" = the default random egg)
  masteryPaper: "",         // chosen paper stock, unlocked via Mastery ("" = the default cream page)
  masteryCharm: "",         // chosen bracelet charm, unlocked via Mastery ("" = the default star)
  masteryTitle: "",         // chosen prestige title, unlocked via Mastery ("" = follows your mastery: the highest tier's default)
  masteryButton: "",        // chosen "start writing" button finish, unlocked via Mastery ("" = the default gold marker)
  masterySignature: "",     // chosen records-signature flourish, unlocked via Mastery ("" = no flourish, just your name)
};

/* Difficulty modes — each just re-tunes existing levers (timer, dropdown,
   word-rarity pool, matching strictness, wrong-answer help). Gameplay code is
   shared; the mode object sets the parameters. */
export const MODES = {
  easy:   { id: "easy",   label: "Easy",   seconds: 15, dropdown: true,  pool: "easy",  strict: false, noTitle: false, examples: 3, hint: true,  blurb: "15s · suggestions & hints · common words" },
  medium: { id: "medium", label: "Normal", seconds: 10, dropdown: true,  pool: "all",   strict: false, noTitle: true,  examples: 3, hint: false, blurb: "10s · suggestions · all words · not in the title" },
  hard:   { id: "hard",   label: "Hard",   seconds: 7,  dropdown: false, pool: "hard",  strict: false, noTitle: true,  examples: 3, hint: false, blurb: "7s · type the full title · rarer words · not in the title" },
  ultra:  { id: "ultra",  label: "Ultra",  seconds: 5,  dropdown: false, pool: "ultra", strict: false, noTitle: true,  examples: 0, hint: false, blurb: "5s · type the full title · rarest · not in the title" },
  // Lyric-only: no title input (lyricOnly), longer clock. You answer by typing a lyric
  // line (a few words around the prompt word are enough — the matcher is fuzzy).
  lyricist: { id: "lyricist", label: "Lyricist", seconds: 20, dropdown: false, pool: "all", strict: false, noTitle: false, examples: 3, hint: false, lyricOnly: true, blurb: "20s · type a lyric line, not the title" },
  // No-timer practice mode (seconds: 0 → startTimer takes the no-timer path). Same
  // forgiving levers as Normal; the only difference is the clock never runs.
  relaxed: { id: "relaxed", label: "Relaxed", seconds: 0, dropdown: true, pool: "all", strict: false, noTitle: false, examples: 3, hint: true,  blurb: "no timer · suggestions & hints · all words" },
};
export const MODE_ORDER = ["relaxed", "easy", "medium", "hard", "ultra", "lyricist"];
// The start-screen picker presents two groups. The ladder (relaxed→ultra) is one axis —
// naming the song, tuned harder or softer. Lyricist is a different MODALITY (answer by a
// lyric line, not a title), so the main picker sets it apart rather than implying it's a
// sixth, "harder than Ultra" rung. MODE_ORDER keeps all six for stats, records, and Album
// Focus, where lyricist legitimately ranks as the top "by heart" tier.
export const DIFFICULTY_LADDER = ["relaxed", "easy", "medium", "hard", "ultra"];
export const MODALITY_MODES = ["lyricist"];
// Per-mode accent for the index-card record tiles (label + tape tint). Keyed by mode id;
// infinite tokens borrow the colour of their underlying difficulty.
export const MODE_COLORS = {
  relaxed:  "#5f87a8",   // denim
  easy:     "#7a9e5e",   // green
  medium:   "#c6912b",   // gold
  hard:     "#bb5640",   // coral-red
  ultra:    "#5a5a66",   // graphite
  lyricist: "#8a78b0",   // lavender
};

/* ---------- Album Focus mode ----------
   "Quiz me on one album": every prompt word and valid answer come from a single studio
   album, played at a chosen difficulty. Sandboxed in its own board (ALBUM_FOCUS_KEY).
   The album list is STUDIO_ALBUMS (the 12 — pseudo-groups are never offered). */
// Every playable mode is offered (in MODE_ORDER). Ultra's rarity bucket can be thin within a
// single album, but pickAlbumWord falls back to the album's full word list, so a 13-round run
// always fills; lyricist answers by lyric line and is album-gated by the soft-reject path.
export const ALBUM_FOCUS_DIFFS = ["relaxed", "easy", "medium", "hard", "ultra", "lyricist"]; // MODES ids the sub-picker offers
export const ALBUM_FOCUS_TARGET = 9;                           // score ≥ this beats an album; === TOTAL_ROUNDS perfects it
// Hardness ranking — the completed-album look scales with the toughest difficulty it was
// beaten/perfected at, so re-beating on a harder mode upgrades the keepsake (see
// recordAlbumFocusRun). Lyricist (recall by lyric line) ranks top as the "by heart" flex.
export const DIFF_RANK = { relaxed: 0, easy: 1, medium: 2, hard: 3, ultra: 4, lyricist: 5 };

/* ---------- Adaptive mode ----------
   A third gameType beside Classic and Infinite. A fixed 13-round run where word RARITY
   alone floats with live performance, on a visible level. The level maps straight onto the
   four rarity buckets; every other lever stays fixed at Normal's baseline. Sandboxed in its
   own board (ADAPTIVE_KEY), ranked on the peak level reached (a floating 0-13 score is not
   comparable, so it is never ranked against the difficulty boards). See PLAN.md section 5. */
export const ADAPTIVE_BUCKETS = [null, "easy", "all", "hard", "ultra"];   // level 1..4 -> wordBuckets key (index 0 unused)
export const ADAPTIVE_LEVELS = [null, "Common", "Deeper", "Rare", "Rarest"]; // level 1..4 -> readable tier name
export const ADAPT_MAX_LEVEL = 4;       // top level (ultra bucket)
export const ADAPT_START_LEVEL = 2;     // start in the middle (the "all" bucket)
export const ADAPT_PROMO_STREAK = 2;    // correct answers at a level needed to climb one (a single miss demotes)
// Anti-too-soft knob: at this level and above, the title dropdown switches off, so the
// rarest tiers test RECALL (type the full title) not just recognition. Set above
// ADAPT_MAX_LEVEL to keep suggestions on for the whole run.
export const ADAPT_NODROP_LEVEL = 3;    // suggestions off from Rare (L3) upward

/* ---------- Study mode (personal review deck, Leitner SRS) ---------- */
// Boxes 1..5. A word is "due" for review when the session counter reaches its `due`.
// Getting a word right in ANY finished game promotes it a box and pushes its next review
// further out; missing it drops it to box 1 (and re-enters it into the deck). Box 5 = graduated.
// The interval is in "sessions" (finished games), a simple monotonic SRS clock — index by box-1.
export const STUDY_MAX_BOX = 5;
export const STUDY_INTERVALS = [1, 2, 4, 8, 16];   // sessions until due again, per box (box1..box5)
export const STUDY_SESSION_ROUNDS = TOTAL_ROUNDS;  // a review session is up to this many rounds (ends early if the deck runs dry)
// Deck weighting — how strongly each learning signal pulls a word into a session. All additive;
// a floor keeps it from being strictly worst-first (weighted sample, not a sort).
export const STUDY_MISS_WEIGHT = 3;      // per recorded miss (tally.misses[w])
export const STUDY_GAP_WEIGHT = 4;       // a word that can unlock an undiscovered song (catalogue completion)
export const STUDY_BOX_WEIGHT = 5;       // multiplied by (STUDY_MAX_BOX - box): lower box = more urgent
export const STUDY_BASE_WEIGHT = 1;      // floor of randomness so it never feels grindy

/* ---------- Custom mode (player-authored "workshop" modes) ----------
   A sandboxed gameType. The player builds a MODES-shaped lever object in the Change modal,
   saves it as a named preset (CUSTOM_KEY), and plays a fixed 13-round run. It folds skill XP
   + achievements ONLY — never ranked stats/records/history/tally/play-counts (like Challenges).
   The one lever the base MODES lack is `hintBudget`: the total number of hint reveals allowed
   across the whole run (each tier-tap spends one; app.js enforces it). `hint` is derived
   (hintBudget > 0), so a budget of 0 turns hints off entirely. */
// Each lever has a SLIDER range (the comfortable drag range shown in the modal) and a wider
// TYPED max: clicking the value number lets you type an exact amount past the slider's end,
// clamped only to the typed max. hintBudget also carries an "unlimited" state, stored as the
// sentinel -1 (the hint slider's top stop, one past its finite max).
export const CUSTOM_SECONDS_MIN = 0;     // 0 = no clock (like Relaxed)
export const CUSTOM_SECONDS_MAX = 60;    // slider's top; typing can go higher
export const CUSTOM_SECONDS_TYPED_MAX = 600;
export const CUSTOM_HINT_MAX = 13;       // slider's finite top (0 = no hints); one stop past = unlimited (-1)
export const CUSTOM_HINT_TYPED_MAX = 99; // typed finite hint budgets can climb this high
export const CUSTOM_HINT_UNLIMITED = -1; // sentinel: hints never run out this run
export const CUSTOM_POOLS = ["easy", "all", "hard", "ultra"];   // word-rarity buckets the picker offers
export const CUSTOM_EXAMPLES_MAX = 3;    // example songs shown after a miss (0..3)
export const CUSTOM_MAX_PRESETS = 12;    // keep the saved list manageable
export const CUSTOM_NAME_MAX = 24;       // preset name length cap
export const CUSTOM_ROUNDS_MIN = 1;      // shortest finite run
export const CUSTOM_ROUNDS_MAX = 30;     // slider's finite top (one tick past this = infinite, stored as rounds:0)
export const CUSTOM_ROUNDS_TYPED_MAX = 500; // typed finite run lengths can climb this high
export const CUSTOM_LIVES_MIN = 1;       // fewest lives in an infinite run (1 = sudden death)
export const CUSTOM_LIVES_MAX = 5;       // slider's top; typing can go higher
export const CUSTOM_LIVES_TYPED_MAX = 99;
export const CUSTOM_ANSWER_MODES = ["title", "lyric", "either"];   // how a page may be answered
// The lever object a first-time player's seed preset starts from, and the per-lever fallback
// normalizeCustomMode drops back to when a stored preset holds nonsense. Both jobs want the
// same thing: a starting point to edit, not a curated mode. So every lever sits somewhere a
// player can move in either direction, and the two levers that show off why Custom exists at
// all are the ones set away from the ladder's defaults — `answer: "either"` (no difficulty
// mode lets you answer with a title OR a sung line) and a scarce hint budget of 3, which is
// exactly one full ladder for a whole run, so "budget" explains itself the first time you
// spend it. 12s sits between Easy (15) and Normal (10). Cloned on use. `answer` is the
// canonical answering lever; `lyricOnly`/`dropdown`/`hint` are derived.
export const CUSTOM_DEFAULT_MODE = {
  id: "custom", label: "Custom", seconds: 12, dropdown: true, pool: "all",
  strict: false, noTitle: true, examples: 3, hint: true, hintBudget: 3, lyricOnly: false,
  answer: "either", rounds: 13, lives: 3,
};

/* Challenges mode — discrete rule-bending puzzles, unlocked with tokens and "defeated".
   Pure data: each entry declares a `rule` token; app.js dispatches on it (round modifier,
   per-answer judge, win check). Sandboxed like daily — a challenge run never folds into the
   difficulty boards/stats/history/tally/achievements. `mode` fixes the MODES levers it runs
   under (without persisting DIFF_KEY). `free` challenges start unlocked; the rest cost a token. */
export const CHALLENGES = [
  { id: "vanishing-word", name: "Vanishing Word", rule: "vanishing", mode: "medium",
    free: true,  cost: 1, target: 10, revealMs: 1500, tapes: 1,
    desc: "The word vanishes quickly, so pay attention.",
    win: "Score 10 / 13 with disappearing words." },
  { id: "deep-cut", name: "Deep Cut", rule: "album5", mode: "easy",
    free: false, cost: 1, album: null /* any single album */, tapes: 1,
    desc: "Guess five correct songs from the same album.",
    win: "Answer 5 correct songs from one album." },
  { id: "alphabetical", name: "From A to Z", rule: "alphabetical", mode: "medium",
    free: false, cost: 1, target: 9, pool: "easy", tapes: 3,
    desc: "Each song's title must start with a later letter in the alphabet than a previous one.",
    win: "Land 9 correct answers in non-decreasing A→Z order." },
  { id: "word-modifiers", name: "Word Games", rule: "wordfx", mode: "medium",
    free: false, cost: 1, target: 9, noTitle: false, tapes: 2,
    desc: "The word becomes more warped every round, can you still beat it when it becomes nonsense?",
    win: "Score 9 / 13 through the distortion." },
  { id: "one-of-a-kind", name: "One Of A Kind", rule: "newsong", mode: "easy",
    free: false, cost: 1, tapes: 1,
    desc: "You're given one specific song you've never answered before. Answer it on a round where it fits the word. You have three guesses, and getting it wrong costs you a guess.",
    win: "Answer the named song before your 3 guesses run out." },
  { id: "choose-your-path", name: "Choose Your Path", rule: "path", mode: "medium",
    free: false, cost: 1, target: 9, forks: [4, 8], tapes: 1,
    desc: "Pick perks at forks in the run that help you get ahead.",
    win: "Score 9 / 13 — your way." },
  { id: "wildcard", name: "Wildcard", rule: "wildcard", mode: "medium",
    free: false, cost: 1, target: 9, noTitle: false, tapes: 2,
    desc: "The rule changes every round, so keep up.",
    win: "Score 9 / 13 across shifting rules." },
  { id: "revolving-door", name: "Revolving Door", rule: "revolving", mode: "medium",
    free: false, cost: 1, target: 9, seconds: 20, rotateMs: 5000, noTitle: true, tapes: 1,
    blurb: "20s a page · suggestions · not in the title · the word swaps every 5s",
    desc: "You get 20 seconds to answer, but the word swaps every 5 seconds, can you answer for the first word every time?",
    win: "Score 9 / 13 while the word keeps revolving." },
  { id: "shrinking-timer", name: "Shrinking Timer", rule: "accelerate", mode: "medium",
    free: false, cost: 1, target: 9, noTitle: true, pool: "easy", tapes: 2,
    blurb: "suggestions · not in the title · the clock shrinks every page (16s → 5s)",
    desc: "The timer shrinks each round, from 16 down to 5.",
    win: "Score 9 / 13 as the clock keeps shrinking." },
  { id: "title-in", name: "Title...?", rule: "titleHas", mode: "medium",
    free: false, cost: 1, target: 9, noTitle: false, dropdown: false, tapes: 2,
    blurb: "10s · no suggestions · the word must be in the title",
    desc: "Flip the script, name a song where the TITLE contains the word.",
    win: "Score 9 / 13, each answer's title holding the word." },
  { id: "short-title", name: "Short n' Sweet", rule: "shorttitle", mode: "medium",
    free: false, cost: 1, target: 9, pool: "easy", noTitle: false, tapes: 1,
    blurb: "10s · suggestions · only one- or two-word titles count",
    desc: "Only songs with one-word or two-word titles are allowed. Keep it short and sweet.",
    win: "Score 9 / 13 using only short titles." },
  { id: "lyric-lover", name: "Lyric Lover", rule: "verse", mode: "lyricist",
    free: false, cost: 1, target: 6, tapes: 3,
    desc: "Answer by typing the lyric line, and do it word-for-word six times.",
    win: "Recall 6 lines word-for-word (or better) — type the line exactly." },
  { id: "wrapped-chain", name: "Wrapped Like A Chain", rule: "chain", mode: "medium",
    free: false, cost: 1, target: 6, noTitle: false, pool: "easy", tapes: 3,
    blurb: "10s · suggestions · each title starts with the last letter of the one before",
    desc: "Link your song answers like a chain, each song title must begin with the last letter of your previous answer.",
    win: "Build a chain of 6 linked songs." },
  { id: "on-tour", name: "On Tour!", rule: "setlist", mode: "medium",
    free: false, cost: 1, target: 9, noTitle: false, tapes: 2,
    blurb: "10s · suggestions · each page wants a song from that night's album",
    desc: "You're going on tour! A setlist of albums, one per page, and your answer must come from that night's album.",
    win: "Score 9 / 13 playing each album on cue." },
  { id: "its-a-clock", name: "It's A Clock!", rule: "combo", mode: "medium",
    free: false, cost: 1, target: 9, noTitle: false, pool: "easy", tapes: 2,
    blurb: "one shared clock · every right answer winds it back up · run it dry and it's over",
    desc: "Per-page timers. Who needs them? How about one shared clock that drains across the whole run. Every correct answer increases the timer, and the run ends when it hits zero.",
    win: "Score 9 / 13 before the shared clock runs out." },
  { id: "switch-up", name: "Switch-Up", rule: "switchup", mode: "medium",
    free: false, cost: 1, target: 9, seconds: 12, noTitle: false, tapes: 1,
    blurb: "12s · each page wants EITHER a title OR a sung lyric line — it keeps switching",
    desc: "Sometimes answer with a lyric line, sometimes answer with the song's title. It switches up randomly, so read the switch before you answer.",
    win: "Score 9 / 13 as the answer type keeps switching." },
  { id: "double-trouble", name: "Double Trouble", rule: "multi", mode: "medium",
    free: false, cost: 1, target: 8, need: 2, pool: "easy", seconds: 18, tapes: 2,
    blurb: "18s · suggestions · name TWO different songs each page · not in the title",
    desc: "One song isn't enough! Answer two songs per word or fail the round.",
    win: "Clear 8 pages, naming two different songs each." },
  { id: "devils-path", name: "Devil's Path", rule: "devil", mode: "medium",
    free: false, cost: 1, target: 9, forks: [4, 8], tapes: 2,
    blurb: "10s · suggestions · at pages 4 & 8 you must take the lesser of two curses",
    desc: "Choose Your Path's alter-ego. Pick curses at forks in the run, try taking the lesser of two evils. You will be haunted by your choices for the rest of the run.",
    win: "Score 9 / 13 despite the curses you take." },
  { id: "ready-for-it", name: "Are You Sure You're …Ready For It???", rule: "flashwarp", mode: "medium",
    mastery: 6, target: 9, revealMs: 1200, noTitle: true, tapes: 4,
    blurb: "the word flashes warped, then it's gone",
    desc: "The word is scrambled and vanishes QUICKLY. Good luck reading it warped and answering from memory!",
    win: "Score 9 / 13 on warped, vanishing words." },
  { id: "home-invasion", name: "I Have No Experience With Home Invasion", rule: "spite", mode: "medium",
    mastery: 6, target: 9, seconds: 10, penalty: 3, tapes: 4,
    blurb: "10s a page · every wrong answer cuts 3s off the clock, permanently",
    desc: "You start with a 10 second timer, but every wrong answer is a home invasion that steals 3 seconds from the timer. Four wrong answers ends the run.",
    win: "Score 9 / 13 before the clock runs dry." },
  { id: "thirty-one", name: "Thirty-One", rule: "survive", mode: "infinite",
    mastery: 6, target: 31, tapes: 4,
    blurb: "Infinite sudden-death rules · reach round 31",
    desc: "Picture infinite mode's rules with sudden death enabled, and you have to get to round 31. That's what this is.",
    win: "Reach round 31 in a single unbroken run." },
  { id: "smallest-song", name: "The Smallest Song Who Ever Lived", rule: "tiny", mode: "medium",
    mastery: 6, target: 9, tapes: 4,
    blurb: "the word is tiny, tilted, and never quite where you look",
    desc: "The word shrinks to almost nothing, good luck finding it when it's slanted off-axis and drifting somewhere on the page.",
    win: "Score 9 / 13 hunting the tiny word." },
  // ---- Tier C minigames (own input / lose-state). free:true so they're playable now;
  //      full gating slots in later. ----
  { id: "impostor", name: "Impostor", rule: "impostor", mode: "medium",
    free: true, cost: 1, target: 7, seconds: 15, tapes: 2,
    blurb: "some words are fakes — flag the impostors, answer the real ones",
    desc: "Most pages will show a real word that appears in lyrics, but some are IMPOSTORS that don't appear in any real Taylor songs. Flag the impostors and answer the real ones, but don't flag a real word or fail to flag an impostor because you'll instantly lose.",
    win: "Survive the run: flag every impostor and answer 7 real words." },
  { id: "sea-of-songs", name: "Sea of Songs", rule: "sea", mode: "medium",
    free: true, cost: 1, target: 9, seconds: 10, noTitle: false, tapes: 3,
    blurb: "10s · no typing · a sea of titles — tap one whose lyrics hold the word",
    desc: "No typing this time. Instead, each page shows a sea of song titles, click one whose lyrics contain the word. There are multiple correct answers, but most are decoys.",
    win: "Score 9 / 13 fishing the right song out of the sea." },
  { id: "common-thread", name: "Common Thread", rule: "common", mode: "medium",
    free: true, cost: 1, target: 9, seconds: 3.5, noTitle: false, dropdown: false, tapes: 2,
    blurb: "3.5s · the game flips: three lines, one word runs through all of them",
    desc: "Throw everything you know about this game out the window. This time you are shown three lyrics from three different songs and you need to type the word they all share. Can you do it in 3.5 seconds?",
    win: "Score 9 / 13 finding the thread." },
];
/* Common Thread — the "type the shared word" inversion. Each page shows COMMON_LINES lyric
   lines from different songs; the answer is the word running through all of them. Puzzles are
   generated at runtime from allSongs + playableWords: an intended word is chosen from a mid-
   frequency band (its song count in COMMON_MIN_SONGS..COMMON_MAX_SONGS keeps the thread from
   being a trivial ubiquitous word), lines are sampled from distinct songs, and buildCommonPuzzle
   keeps the attempt whose accept set (playable words shared by every shown line) is smallest, so
   the thread is as unambiguous as the corpus allows. Any playable word in that accept set counts,
   never just the intended one. Re-tunes itself if songs.json grows — no precomputed data. */
export const COMMON_LINES = 3;
export const COMMON_MIN_SONGS = 3;
export const COMMON_MAX_SONGS = 28;
export const COMMON_GEN_ATTEMPTS = 14;
export const COMMON_MAX_ACCEPT = 3;   // reject attempts with more shared words than this (until the last)
/* Sea of Songs — the tap-a-title grid. SEA_GRID_SIZE tiles per page, of which a random
   SEA_MIN_VALID..SEA_MAX_VALID are genuine answers (lyrics hold the word) and the rest are
   decoys (neither lyrics nor title hold the word). Clamped to how many valids actually exist. */
export const SEA_GRID_SIZE = 16;
export const SEA_MIN_VALID = 2;
export const SEA_MAX_VALID = 4;

export const CHALLENGE_BY_ID = Object.fromEntries(CHALLENGES.map((c) => [c.id, c]));
export const CHALLENGE_ORDER = CHALLENGES.map((c) => c.id);

/* ---------- Impostor challenge — decoy word pool ----------
   Plausibly-Swiftian words (romantic / aesthetic / literary vocabulary) that appear in
   ZERO songs. Verified against the whole corpus with the game's own matching core
   (scripts/mine_impostors.py imports js/match.js's logic) so none can stem-match a real
   lyric or title — a decoy is always a fair "flag me". Re-run the miner if songs.json grows.
   IMPOSTOR_COUNT of a run's 13 pages are impostors (round 1 is always real — a gentle open). */
export const IMPOSTOR_COUNT = 4;
export const IMPOSTOR_WORDS = [
  "velvet", "satin", "chiffon", "cashmere", "corduroy", "porcelain",
  "marble", "granite", "ivory", "emerald", "turquoise", "cathedral",
  "chapel", "steeple", "promenade", "veranda", "cellar", "corridor",
  "alcove", "wharf", "lagoon", "moor", "monsoon", "tempest",
  "solstice", "equinox", "glacier", "prairie", "canyon", "ravine",
  "cavern", "sycamore", "cypress", "juniper", "hazel", "myrtle",
  "heather", "wistful", "forlorn", "morose", "reverie", "rapture",
  "elation", "euphoria", "solitude", "serenity", "penance", "requiem",
  "epitaph", "lament", "devotion", "adoration", "infatuation", "tenderness",
  "carriage", "brooch", "cameo", "parasol", "corset", "quill",
  "inkwell", "pirouette", "curtsy", "swoon", "saunter", "meander",
  "beckon", "smolder", "paramour", "suitor", "confidant", "wanderer",
  "vagabond", "nomad", "sovereign", "monarch", "opulent", "decadent",
  "gilded", "ornate", "baroque", "ephemeral", "fleeting", "transient",
  "boundless", "furtive", "veiled", "luminous", "translucent",
];

/* ---------- Skills & Mastery progression ----------
   Five skills, each gaining XP from a distinct way of playing. Once total skill levels
   clear MASTERY_GATE, the Mastery track unlocks and climbs (its XP = the sum of all skill
   XP earned), and every Mastery level grants a reward. Behaves like the catalogue tally
   (an inclusive record of engagement), not the competitive boards — see foldSkillXp in
   app.js for the per-mode contribution mask. Internal ids stay neutral; the visible names
   are notebook-flavoured and tunable here. No RPG "XP bar / Lvl" chrome in the UI. */
// `tint` is the skill's own ink (an "r, g, b" triplet, drawn from the era palette) — the
// mastery skills bars, emblem, and level label all take it; a maxed skill overrides to gold.
export const SKILLS = [
  { id: "resolve",   name: "Instinct",      icon: "comet",     tint: "61, 79, 134",   blurb: "Grows with every word you match to the right song." },
  { id: "tempo",     name: "Quick Pen",     icon: "metronome", tint: "178, 58, 63",   blurb: "Grows when you beat the clock to your answer." },
  { id: "lyricist",  name: "By Heart",      icon: "heartline", tint: "200, 95, 151",  blurb: "Grows when you recall the full lyric line, word for word." },
  { id: "endurance", name: "The Long Game", icon: "trail",     tint: "78, 143, 99",   blurb: "Grows the further a single Infinite run carries you." },
  { id: "range",     name: "Discography",   icon: "records",   tint: "125, 104, 184", blurb: "Grows as your answers reach across more albums." },
];
export const SKILL_IDS = SKILLS.map((s) => s.id);
export const SKILL_BY_ID = Object.fromEntries(SKILLS.map((s) => [s.id, s]));

// XP-formula constants (consumed by foldSkillXp in app.js). All tunable.
export const TEMPO_BASE = 10, TEMPO_SPEED = 40;            // per fast correct answer: BASE + SPEED*speedFactor
export const LYRIC_TIER_XP = { base: 5, good: 15, perfect: 35, verse: 80 }; // keyed by gradeLyricRecall tier
export const LYRIC_LEN_REF = 8;                            // typed words for the 2x length-factor cap
export const ENDURANCE_GROWTH = 1.12, ENDURANCE_RUN_CAP = 1500; // exponential feel, capped per run
export const RANGE_RATIO_XP = 60, RANGE_PER_ALBUM = 8;     // breadth ratio bonus + flat per distinct album
export const RESOLVE_BASE = 10, RESOLVE_STREAK_CAP = 10;   // streakMult = 1 + 0.1*min(streak, CAP)

// Skills start at level 0 and cap at 10. Cumulative XP to REACH a level (level 0 is free at
// 0 xp): threshold(n) = round(BASE * n^EXP).
export const SKILL_MAX_LEVEL = 10;
export const SKILL_LEVEL_BASE = 120;
export const SKILL_LEVEL_EXP = 1.6;
export function skillXpForLevel(level) {
  if (level <= 0) return 0;
  return Math.round(SKILL_LEVEL_BASE * Math.pow(level, SKILL_LEVEL_EXP));
}
export function skillLevelFromXp(xp) {
  let lv = 0;
  while (lv < SKILL_MAX_LEVEL && (xp || 0) >= skillXpForLevel(lv + 1)) lv++;
  return lv;
}

// Mastery unlocks when the five skills' levels SUM to this (of a possible 50) — broad
// progress without forcing any single skill to be maxed. Mastery itself starts at level 0
// and caps at MASTERY_MAX_LEVEL (the top of the reward ladder — Ultimate Showgirl);
// cumulative XP to reach a level: round(BASE * level^EXP).
export const MASTERY_GATE = 40;
export const MASTERY_MAX_LEVEL = 13;
export const MASTERY_LEVEL_BASE = 800;
export const MASTERY_LEVEL_EXP = 1.5;
export function masteryXpForLevel(level) {
  if (level <= 0) return 0;
  return Math.round(MASTERY_LEVEL_BASE * Math.pow(level, MASTERY_LEVEL_EXP));
}
export function masteryLevelFromXp(xp) {
  let lv = 0;
  while (lv < MASTERY_MAX_LEVEL && (xp || 0) >= masteryXpForLevel(lv + 1)) lv++;
  return lv;
}

// Mastery rewards — one granted per Mastery level. `kind` drives how the Mastery screen
// renders/applies it; `payload` is kind-specific. The ladder runs 1–13 (pens, papers,
// charms, the super-hard unlock, then prestige titles) and 13 is the Mastery cap.
export const MASTERY_REWARDS = [
  { level: 1, id: "pen-fountain", kind: "pen",  name: "Fountain pen",     icon: "nib",     desc: "Always write with a fountain pen.", payload: { pen: "fountain" } },
  { level: 2, id: "pen-quill",    kind: "pen",  name: "Feather quill",    icon: "feather", desc: "Trade your pen for a feather quill.", payload: { pen: "quill" } },
  { level: 3, id: "pen-glitter",  kind: "pen",  name: "Glitter gel pen",  icon: "sparkle", desc: "A glitter gel pen, for the sparkle.", payload: { pen: "glitter" } },
  // Paper stocks — a set unlocked together at level 4. Each retints the page surface
  // (CSS body[data-paper="…"]); the swatch chip + apply path live in app.js.
  { level: 4,  id: "paper-manila",    kind: "paper", name: "Manila pad",      icon: "book", desc: "Warm kraft tan, like a legal pad.",   payload: { paper: "manila" } },
  { level: 4,  id: "paper-parchment", kind: "paper", name: "Aged parchment",  icon: "book", desc: "Antique ivory, softly foxed.",        payload: { paper: "parchment" } },
  { level: 4,  id: "paper-blush",     kind: "paper", name: "Blush leaf",      icon: "book", desc: "A soft rose stationery.",            payload: { paper: "blush" } },
  { level: 4,  id: "paper-slate",     kind: "paper", name: "Slate pad",       icon: "book", desc: "Cool blue-grey engineer's stock.",   payload: { paper: "slate" } },
  // Bracelet charms — a set unlocked together at level 5. Each swaps the charm that
  // dangles from every correct-answer bead (the CHARMS renderer in bracelet.js); the
  // verse pen-nib stays reserved. Selection persists in settings.masteryCharm.
  { level: 5,  id: "charm-heart",     kind: "charm", name: "Heart charm",     icon: "heart",  desc: "Hang a friendship heart.",       payload: { charm: "heart" } },
  { level: 5,  id: "charm-moon",      kind: "charm", name: "Moon charm",      icon: "moon",   desc: "A waxing crescent moon.",        payload: { charm: "moon" } },
  { level: 5,  id: "charm-daisy",     kind: "charm", name: "Daisy charm",     icon: "branch", desc: "A little pressed daisy.",        payload: { charm: "daisy" } },
  { level: 5,  id: "charm-bow",       kind: "charm", name: "Bow charm",       icon: "scarf",  desc: "A tied ribbon bow.",             payload: { charm: "bow" } },
  { level: 5,  id: "charm-pick",      kind: "charm", name: "Pick charm",      icon: "note",   desc: "A guitar pick, for the stage.",  payload: { charm: "pick" } },
  { level: 5,  id: "charm-note",      kind: "charm", name: "Note charm",      icon: "note",   desc: "A single eighth note.",          payload: { charm: "note" } },
  { level: 5,  id: "charm-lightning", kind: "charm", name: "Lightning charm", icon: "bolt",   desc: "A bolt of lightning.",           payload: { charm: "lightning" } },
  { level: 5,  id: "charm-snake",     kind: "charm", name: "Snake charm",     icon: "snake",  desc: "A reputation serpent.",          payload: { charm: "snake" } },
  { level: 6,  id: "hardmode-unlock", kind: "unlock", name: "Super-hard challenges", icon: "swords",  desc: "Unlocks a tier of brutal new challenges in Challenges mode." },
  // Start-writing button finishes — a set unlocked together at level 8. Each restyles the
  // home-screen hero CTA (CSS body[data-startbtn="…"] over #playBtn). Selection persists in
  // settings.masteryButton; applied globally via applySettings.
  { level: 8,  id: "btn-ink",   kind: "button", name: "Ink press", icon: "drop", desc: "A solid ink-stamped start button.", payload: { button: "ink" } },
  { level: 8,  id: "btn-blush", kind: "button", name: "Blush",     icon: "sun",  desc: "A soft rose marker start button.",  payload: { button: "rose" } },
  { level: 8,  id: "btn-sky",   kind: "button", name: "Sky",       icon: "moon", desc: "A cool blue marker start button.",  payload: { button: "sky" } },
  // Secret hints — a level-10 milestone (grants no toggle). Once earned, the achievements
  // page reveals how to earn each still-locked secret charm (its desc, name kept masked).
  { level: 10, id: "reveal-hints", kind: "unlock", name: "Secret hints", icon: "key", desc: "Reveals how to earn every secret charm." },
  // Signature flourishes — a set unlocked together at level 12. Each draws a hand-inked mark
  // beneath your records-page notebook signature (flourishSVG in app.js; the crest is a wax
  // seal). Selection persists in settings.masterySignature; rendered on the records page.
  { level: 12, id: "sig-swash",    kind: "signature", name: "Underline",    icon: "feather", desc: "A confident stroke under your name.",         payload: { signature: "swash" } },
  { level: 12, id: "sig-loop",     kind: "signature", name: "Flourish",     icon: "feather", desc: "A looping swash with a tail.",                payload: { signature: "loop" } },
  { level: 12, id: "sig-rule",     kind: "signature", name: "Double rule",  icon: "book",    desc: "Two clean rules — signed and official.",      payload: { signature: "rule" } },
  { level: 12, id: "sig-splatter", kind: "signature", name: "Ink splatter", icon: "drop",    desc: "A charming spray of dropped ink.",            payload: { signature: "splatter" } },
  { level: 12, id: "sig-thirteen", kind: "signature", name: "The 13",       icon: "star",    desc: "The sacred number, drawn by hand.",           payload: { signature: "thirteen" } },
  { level: 12, id: "sig-crest",    kind: "signature", name: "Poet’s crest", icon: "feather", desc: "A wax seal — quill and laurel.",         payload: { signature: "crest" } },
  // Prestige titles — worn on your records-page notebook signature. Unlocked in tiers as
  // Mastery climbs; each tier has one `isDefault` title that a player on the "follows your
  // mastery" auto setting wears automatically, plus alternates they can switch to via the
  // stepper picker on the Mastery page. Selection persists in settings.masteryTitle
  // ("" = follow mastery). Kept out of the reward-ladder list; rendered by their own stepper.
  { level: 7,  id: "title-certified-poet",    kind: "title", isDefault: true, name: "Certified Poet",             icon: "feather", desc: "The everyday byline.",            payload: { title: "certified-poet" } },
  { level: 7,  id: "title-ink-stained",       kind: "title", name: "Ink-Stained",                                 icon: "drop",    desc: "Married to the page.",           payload: { title: "ink-stained" } },
  { level: 7,  id: "title-notebook-keeper",   kind: "title", name: "Notebook Keeper",                             icon: "book",    desc: "Guardian of the songbook.",      payload: { title: "notebook-keeper" } },
  { level: 7,  id: "title-wordsmith",         kind: "title", name: "Wordsmith",                                   icon: "nib",     desc: "Forger of phrases.",             payload: { title: "wordsmith" } },
  { level: 9,  id: "title-bridge-builder",    kind: "title", isDefault: true, name: "Bridge Builder",             icon: "tower",   desc: "Master of the eight-line bridge.", payload: { title: "bridge-builder" } },
  { level: 9,  id: "title-lyricist",          kind: "title", name: "The Lyricist",                                icon: "note",    desc: "Words and melody as one.",       payload: { title: "lyricist" } },
  { level: 9,  id: "title-archivist",         kind: "title", name: "The Archivist",                               icon: "book",    desc: "Keeper of every verse.",         payload: { title: "archivist" } },
  { level: 9,  id: "title-curator",           kind: "title", name: "The Curator",                                 icon: "gem",     desc: "Curator of the catalogue.",      payload: { title: "curator" } },
  { level: 11, id: "title-chairman",          kind: "title", isDefault: true, name: "Chairman of the Department", icon: "quote",   desc: "Tenured in the songbook.",       payload: { title: "chairman" } },
  { level: 11, id: "title-verse-architect",   kind: "title", name: "Verse Architect",                             icon: "tower",   desc: "Builder of the structure.",      payload: { title: "verse-architect" } },
  { level: 11, id: "title-mastermind",        kind: "title", name: "Mastermind",                                  icon: "brain",   desc: "You saw it all coming.",         payload: { title: "mastermind" } },
  { level: 11, id: "title-poet-laureate",     kind: "title", name: "Poet Laureate",                               icon: "feather", desc: "Laurelled for the words.",       payload: { title: "poet-laureate" } },
  { level: 13, id: "title-ultimate-showgirl", kind: "title", isDefault: true, name: "Ultimate Showgirl",          icon: "crown",   desc: "The capstone. Take a bow.",      payload: { title: "ultimate-showgirl" } },
  { level: 13, id: "title-ultimate-swiftie",  kind: "title", name: "Ultimate Swiftie",                            icon: "star",    desc: "You know all the words.",        payload: { title: "ultimate-swiftie" } },
];
export const MASTERY_REWARD_BY_ID = Object.fromEntries(MASTERY_REWARDS.map((r) => [r.id, r]));

// Prestige titles, in tier order. `masteryDefaultTitle` resolves the title a "follows your
// mastery" player wears: the default of the highest tier they've reached ("" before level 7).
export const MASTERY_TITLES = MASTERY_REWARDS.filter((r) => r.kind === "title");
export const MASTERY_TITLE_BY_VALUE = Object.fromEntries(MASTERY_TITLES.map((r) => [r.payload.title, r]));
export function masteryDefaultTitle(masteryLevel) {
  let val = "";
  for (const r of MASTERY_TITLES) if (r.isDefault && r.level <= masteryLevel) val = r.payload.title;
  return val;
}

/* Era engine */
export const ERAS = ["gold", "lavender", "red", "denim", "graphite", "midnight", "debut", "reputation", "lover", "evermore"];
// Album Focus locks the whole run to one era wash — the era that best fits each studio
// album's mood (a couple reuse the closest era; only one album plays per run, so that's fine).
export const ALBUM_ERA = {
  "Taylor Swift": "debut", "Fearless": "gold", "Speak Now": "lavender", "Red": "red",
  "1989": "denim", "reputation": "reputation", "Lover": "lover", "folklore": "graphite",
  "evermore": "evermore", "Midnights": "midnight",
  "The Tortured Poets Department": "graphite", "The Life of a Showgirl": "gold",
};
export const TENDER_ERAS = ["lavender", "denim", "lover", "evermore"];   // round 5 (Track 5) leans tender
export const FINALE_ERAS = ["gold", "midnight", "reputation"];           // round 13 leans grand

/* ---------- Taylor milestones (the start-screen anniversary marginalia) ----------
   Real release dates + her birthday. Matched on month-day (ignore year) so a note
   recurs annually; the "Nth anniversary" is computed from the year. `album` keys into
   ALBUM_ERA / ALBUM_COLORS so a milestone note can wear that era's colour (re-records
   borrow their original album's era). Dec 13 doubles as the game's sacred 13.
   `songday` entries are the fan-loved dates Taylor sings outright (High Infidelity's
   April 29th, Last Kiss's July 9th): no release year, they carry their own blurb/caption
   and wear the song's era colour, but they never tint the anniversary daily (guarded in
   anniversaryAlbumFor). `blurb`/`caption` must paraphrase, never quote the lyric.
   ⚠ Verify every date before editing — fans catch a wrong one instantly. */
export const TS_MILESTONES = [
  { md: "12-13", year: 1989, kind: "birthday", title: "Taylor Swift",                  album: null },
  { md: "10-24", year: 2006, kind: "album",    title: "Taylor Swift", aka: "the debut", album: "Taylor Swift" },
  { md: "11-11", year: 2008, kind: "album",    title: "Fearless",                      album: "Fearless" },
  { md: "10-25", year: 2010, kind: "album",    title: "Speak Now",                     album: "Speak Now" },
  { md: "10-22", year: 2012, kind: "album",    title: "Red",                           album: "Red" },
  { md: "10-27", year: 2014, kind: "album",    title: "1989",                          album: "1989" },
  { md: "11-10", year: 2017, kind: "album",    title: "reputation",                    album: "reputation" },
  { md: "08-23", year: 2019, kind: "album",    title: "Lover",                         album: "Lover" },
  { md: "07-24", year: 2020, kind: "album",    title: "folklore",                      album: "folklore" },
  { md: "12-11", year: 2020, kind: "album",    title: "evermore",                      album: "evermore" },
  { md: "04-09", year: 2021, kind: "tv",       title: "Fearless (Taylor's Version)",   album: "Fearless" },
  { md: "11-12", year: 2021, kind: "tv",       title: "Red (Taylor's Version)",        album: "Red" },
  { md: "10-21", year: 2022, kind: "album",    title: "Midnights",                     album: "Midnights" },
  { md: "07-07", year: 2023, kind: "tv",       title: "Speak Now (Taylor's Version)",  album: "Speak Now" },
  { md: "10-27", year: 2023, kind: "tv",       title: "1989 (Taylor's Version)",       album: "1989" },
  { md: "04-19", year: 2024, kind: "album",    title: "The Tortured Poets Department", album: "The Tortured Poets Department" },
  { md: "10-03", year: 2025, kind: "album",    title: "The Life of a Showgirl",        album: "The Life of a Showgirl" },
  { md: "04-29", kind: "songday", title: "High Infidelity", album: "Midnights",  eyebrow: "High Infidelity Day",
    blurb: "April 29th, the one date Taylor names outright on Midnights. Where were you?", caption: "April 29th" },
  { md: "07-09", kind: "songday", title: "Last Kiss",       album: "Speak Now",  eyebrow: "Last Kiss Day",
    blurb: "July 9th, the date Speak Now can never quite stop remembering.", caption: "July 9th" },
];

/* ---------- Lyric days (desk-calendar marginalia only) ----------
   Days the songs themselves put a date on. Deliberately kept OUT of
   TS_MILESTONES: that table is real release history, and it drives the
   start-screen slip, the milestone sticky and the daily's album skew — none of
   which should fire just because a lyric names a date. These only ever mark up
   the desk calendar (js/calendar.js). `album` keys into ALBUM_COLORS the same
   way, so each mark wears its song's era.
   ⚠ Verify every date before editing — fans catch a wrong one instantly. */
export const TS_LORE_DAYS = [
  { md: "07-09", kind: "lore", title: "Last Kiss",       album: "Speak Now" },
  { md: "04-29", kind: "lore", title: "High Infidelity", album: "Midnights" },
];

/* ---------- Album colours (left-rule tint + tag on lyric cards) ---------- */
// The 12 studio albums (explicit so future pseudo-album groups — singles, holiday,
// features — don't dilute album-scoped achievements like The Eras Tour / Branch Out).
export const STUDIO_ALBUMS = [
  "Taylor Swift", "Fearless", "Speak Now", "Red", "1989", "reputation",
  "Lover", "folklore", "evermore", "Midnights",
  "The Tortured Poets Department", "The Life of a Showgirl",
];
export const ALBUM_COLORS = {
  "Taylor Swift":                     "#5a9ea6",
  "Fearless":                         "#b8943a",
  "Speak Now":                        "#8b5fa0",
  "Red":                              "#a32a2a",
  "1989":                             "#4a8fb5",
  "reputation":                       "#555555",
  "Lover":                            "#c4649a",
  "folklore":                         "#9b9b9b",
  "evermore":                         "#7a5a38",
  "Midnights":                        "#3d4f8a",
  "The Tortured Poets Department":    "#b39a7c",
  "The Life of a Showgirl":          "#e07830",
  "Holiday Collection":               "#bcdcec",  // snow blue
  "Songs From Movies":                "#2f6b4f",  // pine green
  "Written for Others":               "#7e7634",  // olive
  "Collaborations":                   "#7a2f4a",  // wine
};
// A colour-blind-friendly alternative (Okabe-Ito / Paul-Tol hues + spread lightness)
// so the 12 albums stay distinguishable for deutan/protan/tritan vision. Same keys
// as ALBUM_COLORS; swapped in when the "colour-blind album colours" setting is on.
export const CB_ALBUM_COLORS = {
  "Taylor Swift":                     "#0072b2",  // blue
  "Fearless":                         "#e69f00",  // orange
  "Speak Now":                        "#cc79a7",  // reddish purple
  "Red":                              "#d55e00",  // vermillion
  "1989":                             "#56b4e9",  // sky blue
  "reputation":                       "#333333",  // near-black
  "Lover":                            "#e78ac3",  // pink
  "folklore":                         "#999999",  // grey
  "evermore":                         "#8c5a2b",  // brown
  "Midnights":                        "#332288",  // indigo
  "The Tortured Poets Department":    "#44aa99",  // teal
  "The Life of a Showgirl":           "#ddcc77",  // sand
  "Holiday Collection":               "#aad4e6",  // pale cyan
  "Songs From Movies":                "#117733",  // green
  "Written for Others":               "#999933",  // olive
  "Collaborations":                   "#882255",  // maroon
};

// Extra accepted spellings for titles whose forgiving forms normalizeTitle can't
// derive (irregular abbreviations). Keyed by the canonical title; each alias is run
// through normalizeTitle at index-build time, so list them readably. The "ten"
// variants fold to their "10" forms automatically, and the full "...10/ten minute
// version" already matches via normalizeTitle — these cover the abbreviations.
export const TITLE_ALIASES = {
  "All Too Well (10 Minute Version)": [
    "all ten well", "all 10 well",
    "all too well 10", "all too well ten",
  ],
  // Remix features people know by the bare title (the "(remix)" form still
  // matches via normalizeTitle); the alias makes the plain name work too.
  "Gasoline (Remix)": ["gasoline"],
  "The Joker And The Queen (Remix)": ["the joker and the queen"],
  // "I Heart ?" reads aloud as "I Heart Question Mark".
  "I Heart ?": ["i heart question mark"],
};

/* ---------- Achievements ---------- */
export const ACH_ICONS = {
  // hung charms: filled bead bodies (ink-fill) with inked detail (ink)
  star:    `<svg viewBox="0 0 24 24"><path class="ink-fill" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round" d="M12 2.3 L14.94 7.96 L21.22 9 L16.76 13.55 L17.7 19.85 L12 17 L6.3 19.85 L7.24 13.55 L2.78 9 L9.06 7.96 Z"/><path class="ink" stroke-width="0.9" opacity="0.7" d="M12 6.4 L13.1 9.2 L16 9.5"/></svg>`,
  // PLACEHOLDER (keepsakes meta) — a plain polaroid with a little landscape; real icon comes later.
  polaroid: `<svg viewBox="0 0 24 24"><rect class="ink-fill" x="4" y="3" width="16" height="18" rx="1.5"/><rect x="6" y="5" width="12" height="10" fill="var(--paper)"/><circle class="ink-fill" cx="9" cy="8.5" r="1.3"/><path class="ink" stroke-width="1.1" fill="none" d="M6 13 L10 9.8 L12.6 12 L18 7.6"/></svg>`,
  sparkle: `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M10.6 1.6 C11.6 7.4 14 9.8 19.8 10.8 C14 11.8 11.6 14.2 10.6 20 C9.6 14.2 7.2 11.8 1.4 10.8 C7.2 9.8 9.6 7.4 10.6 1.6 Z"/><path class="ink-fill" d="M18.8 14.6 C19.2 16.6 19.8 17.2 21.8 17.6 C19.8 18 19.2 18.6 18.8 20.6 C18.4 18.6 17.8 18 15.8 17.6 C17.8 17.2 18.4 16.6 18.8 14.6 Z"/></svg>`,
  bolt:    `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M13.6 1.8 L4.4 13.6 H10 L9 22.2 L19.6 9.5 H13.3 Z"/><path class="ink" stroke-width="0.9" opacity="0.6" d="M12 6 L9 13"/></svg>`,
  key:     `<svg viewBox="0 0 24 24"><circle class="ink-fill" cx="8" cy="8" r="5.4"/><circle cx="8" cy="8" r="1.9" fill="var(--paper)"/><path class="ink" d="M11.8 11.8 L20 20 M16.8 16.8 l2.4 -2.4 M14.2 14.2 l2.2 -2.2"/></svg>`,
  gem:     `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M6.6 3 H17.4 L21.6 9 L12 21.6 L2.4 9 Z"/><path class="ink" d="M2.4 9 H21.6 M8.8 3 L6.9 9 L12 21.6 M15.2 3 L17.1 9 L12 21.6"/></svg>`,
  rise:    `<svg viewBox="0 0 24 24"><path class="ink" stroke-width="2.1" stroke-linecap="round" d="M3 19 L9.5 12.5 L13 16 L20.5 6.5"/><path class="ink-fill" d="M14.6 5 L21.5 4 L21 10.8 Z"/></svg>`,
  crown:   `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M2.5 18 L4.5 7.5 L9 12.5 L12 5 L15 12.5 L19.5 7.5 L21.5 18 Z"/><path class="ink" d="M3 18 H21"/><circle class="ink-fill" cx="4.5" cy="7.5" r="1.5"/><circle class="ink-fill" cx="12" cy="5" r="1.5"/><circle class="ink-fill" cx="19.5" cy="7.5" r="1.5"/></svg>`,
  scarf:   `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M4.6 4.6 C10 8.2 14 8.2 19.4 4.6 L21 8.4 C14.8 12.4 9.2 12.4 3 8.4 Z"/><path class="ink-fill" d="M10.2 10.8 L8.6 19.6 L11.8 17.2 L13.2 10.9 Z"/><g class="ink" stroke-width="1.2"><path d="M8.6 19.6 L8 21.6"/><path d="M10.2 18.4 L10 20.4"/><path d="M11.8 17.2 L12.2 19.2"/></g><g class="ink" stroke-width="0.9" opacity="0.6"><path d="M7 6.6 L8 9.2"/><path d="M10.4 7.8 L11 10.4"/><path d="M13.8 7.8 L13.4 10.4"/><path d="M17 6.4 L16.2 9"/><path d="M10.7 13.2 L12.5 12.8"/><path d="M10.1 15.6 L11.9 15.2"/></g></svg>`,
  // a slender flute filled one sip shy of the rim — 12/13, the toast that never happened
  flute:   `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M8.8 2.5 H15.2 L14.4 9.8 C14.2 11.9 13.2 13.2 12 13.2 C10.8 13.2 9.8 11.9 9.6 9.8 Z"/><path d="M9.3 3.1 H14.7 L14.5 5.6 H9.5 Z" fill="var(--paper)" stroke="none"/><path class="ink" d="M12 13.2 V19 M8.7 19.6 H15.3"/><circle class="ink-fill" cx="17.2" cy="4" r="1"/><circle class="ink-fill" cx="18.8" cy="7" r="0.7"/><circle class="ink-fill" cx="17.6" cy="9.6" r="0.5"/></svg>`,
  note:    `<svg viewBox="0 0 24 24"><ellipse class="ink-fill" cx="7.7" cy="17.7" rx="2.5" ry="1.9" transform="rotate(-18 7.7 17.7)"/><ellipse class="ink-fill" cx="16.5" cy="15.9" rx="2.5" ry="1.9" transform="rotate(-18 16.5 15.9)"/><g class="ink" stroke-width="1.5" fill="none"><path d="M10 17.4 V6.2"/><path d="M18.8 15.6 V4.4"/></g><path class="ink-fill" d="M10 6.4 L18.8 4.4 L18.8 7.2 L10 9.2 Z"/></svg>`,
  swords:  `<svg viewBox="0 0 24 24"><g class="ink" stroke-width="2" stroke-linecap="round" fill="none"><path d="M4 4 L15 15"/><path d="M20 4 L9 15"/><path d="M7 17 L4 20"/><path d="M17 17 L20 20"/><path d="M6 14 L10 18"/><path d="M18 14 L14 18"/></g><circle class="ink-fill" cx="4" cy="4" r="1.6"/><circle class="ink-fill" cx="20" cy="4" r="1.6"/></svg>`,
  castle:  `<svg viewBox="0 0 24 24"><rect class="ink-fill" x="5" y="9.5" width="14" height="10.5"/><g class="ink-fill"><rect x="5" y="6.4" width="3" height="3.1"/><rect x="10.5" y="6.4" width="3" height="3.1"/></g><path class="ink-fill" d="M16 9.5 V7.6 L17.4 6.4 L19 7.4 V9.5 Z"/><path d="M10 20 V15.6 a2 2 0 0 1 4 0 V20 Z" fill="var(--paper)" stroke="none"/><path d="M14.8 9.5 L13.6 12.4 L15.4 14.2 L14.2 17.2" stroke="currentColor" stroke-width="1.15" fill="none"/><rect class="ink-fill" x="19.9" y="7.6" width="2.1" height="2.1" transform="rotate(18 20.9 8.6)"/><rect class="ink-fill" x="20.9" y="12.6" width="1.7" height="1.7" transform="rotate(-14 21.8 13.4)"/></svg>`,
  sun:     `<svg viewBox="0 0 24 24"><circle class="ink-fill" cx="12" cy="12" r="5"/><g class="ink" stroke-width="1.8" stroke-linecap="round"><path d="M12 1.5 V4"/><path d="M12 20 V22.5"/><path d="M1.5 12 H4"/><path d="M20 12 H22.5"/><path d="M4.2 4.2 L6 6"/><path d="M18 18 L19.8 19.8"/><path d="M19.8 4.2 L18 6"/><path d="M6 18 L4.2 19.8"/></g></svg>`,
  book:    `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M12 5 C9 3.2 5.5 3.2 3 4.2 V19 C5.5 18 9 18 12 19.8 C15 18 18.5 18 21 19 V4.2 C18.5 3.2 15 3.2 12 5 Z"/><path d="M12 5 V19.8" stroke="currentColor" stroke-width="1.2"/><g stroke="currentColor" stroke-width="0.9" fill="none"><path d="M5 7.5 H10"/><path d="M5 10 H10"/><path d="M14 7.5 H19"/><path d="M14 10 H19"/></g></svg>`,
  feather: `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M19 2.6 C10 3.6 5 9.6 4.5 16.6 L8 13.1 C10 15.6 14 14.6 16 10.6 C13 11.6 11.5 10.6 11 9.1 C13 10.6 16 9.6 17 6.1 C14.5 7.1 13 6.4 12.5 5.1 C15 6.6 18 5.1 19 2.6 Z"/><path class="ink" stroke-width="1.4" d="M3.9 19.6 L8 13.1"/><path class="ink" stroke-width="1" opacity="0.55" d="M5 22.2 C7.2 21.8 9 20.8 10.4 19.2"/></svg>`,
  // a rocket mid-launch, banked toward the corner — round 1, no hesitation
  rocket:  `<svg viewBox="0 0 24 24"><g transform="rotate(38 12 12)"><path class="ink-fill" d="M12 1.6 C14.7 3.9 15.9 7.4 15.9 10.9 L14.4 14.4 H9.6 L8.1 10.9 C8.1 7.4 9.3 3.9 12 1.6 Z"/><circle cx="12" cy="8.2" r="1.7" fill="var(--paper)" stroke="currentColor" stroke-width="0.9"/><path class="ink-fill" d="M9.6 12.9 L6.4 16.1 L8.8 15.7 L9.4 17.9 Z"/><path class="ink-fill" d="M14.4 12.9 L17.6 16.1 L15.2 15.7 L14.6 17.9 Z"/><path class="ink" stroke-width="1.4" d="M10.6 18.4 L10.2 20.4 M12 18.8 V21.6 M13.4 18.4 L13.8 20.4"/></g></svg>`,
  branch:  `<svg viewBox="0 0 24 24"><path class="ink" stroke-width="1.7" fill="none" d="M4.4 21 C7.2 14.6 11.4 9.2 18.6 4.6"/><g class="ink-fill"><ellipse cx="7.6" cy="15.7" rx="2.4" ry="0.9" transform="rotate(72 7.6 15.7)"/><ellipse cx="10.2" cy="12.5" rx="2.4" ry="0.9" transform="rotate(64 10.2 12.5)"/><ellipse cx="13.2" cy="9.6" rx="2.4" ry="0.9" transform="rotate(56 13.2 9.6)"/><ellipse cx="16.4" cy="7" rx="2.3" ry="0.85" transform="rotate(48 16.4 7)"/><ellipse cx="19.2" cy="5" rx="2.1" ry="0.8" transform="rotate(40 19.2 5)"/></g></svg>`,
  ticket:  `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M3 7.2 H21 V10 a2 2 0 0 0 0 4 V16.8 H3 V14 a2 2 0 0 0 0 -4 Z"/><path d="M15.4 7.2 V16.8" stroke="currentColor" stroke-width="1.1" stroke-dasharray="1.5 1.5" fill="none"/><path d="M9 9.9 L9.7 11.4 L11.3 11.6 L10.1 12.7 L10.4 14.3 L9 13.5 L7.6 14.3 L7.9 12.7 L6.7 11.6 L8.3 11.4 Z" fill="currentColor" stroke="none"/><g stroke="currentColor" stroke-width="1" fill="none"><path d="M17.4 9.8 H19"/><path d="M17.4 12 H19"/><path d="M17.4 14.2 H19"/></g></svg>`,
  moon:    `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M20 14.5 A9 9 0 1 1 11 3 A7 7 0 0 0 20 14.5 Z"/></svg>`,
  storm:   `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M7 13.6 a4.2 4.2 0 0 1 0.5 -8.4 a5.2 5.2 0 0 1 9.8 1 a3.7 3.7 0 0 1 -0.9 7.3 Z"/><path class="ink-fill" d="M12.4 12.6 L9 18.6 H11.8 L10.6 22.4 L15.6 15.6 H12.8 Z"/><g class="ink" stroke-width="1.2"><path d="M6.4 15.6 L5.6 17.6"/><path d="M16.8 15.2 L16 17.2"/></g></svg>`,
  brain:   `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M9 3 a3 3 0 0 0 -3 3 a3 3 0 0 0 -2 4 a3 3 0 0 0 1 4 a3 3 0 0 0 3 3 a2.5 2.5 0 0 0 3 0 V4 a2 2 0 0 0 -2 -1 Z"/><path class="ink-fill" d="M15 3 a3 3 0 0 1 3 3 a3 3 0 0 1 2 4 a3 3 0 0 1 -1 4 a3 3 0 0 1 -3 3 a2.5 2.5 0 0 1 -3 0 V4 a2 2 0 0 1 2 -1 Z"/><path d="M12 4 V20" stroke="currentColor" stroke-width="1"/></svg>`,
  scissors:`<svg viewBox="0 0 24 24"><g class="ink" stroke-width="1.6" fill="none"><circle cx="5.9" cy="5.9" r="2.5"/><circle cx="5.9" cy="18.1" r="2.5"/></g><path class="ink-fill" d="M7.9 7.3 L20.8 16.2 C21.4 16.7 21 17.6 20.2 17.4 L7.1 9.4 Z"/><path class="ink-fill" d="M7.9 16.7 L20.8 7.8 C21.4 7.3 21 6.4 20.2 6.6 L7.1 14.6 Z"/><circle class="ink-fill" cx="12.8" cy="12" r="1.1"/></svg>`,
  clapper: `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M3 8.2 L20.3 4.6 L20.9 7.4 L3.6 11 Z"/><g stroke="currentColor" stroke-width="1.3" fill="none"><path d="M6.3 7.6 L7.7 5.2"/><path d="M10.3 6.8 L11.7 4.4"/><path d="M14.3 6 L15.7 3.7"/><path d="M18.3 5.2 L19.5 3.1"/></g><rect class="ink-fill" x="3.4" y="10.6" width="17.4" height="9.2" rx="1.1"/><path d="M5.6 13.2 H12.4" stroke="currentColor" stroke-width="1.1" fill="none"/></svg>`,
  window:  `<svg viewBox="0 0 24 24"><rect class="ink-fill" x="4.6" y="3.2" width="14.8" height="16.4" rx="1"/><rect x="6.4" y="5" width="11.2" height="12.8" fill="var(--paper)" stroke="none"/><g class="ink" stroke-width="1.1"><path d="M12 5 V17.8"/><path d="M6.4 11.4 H17.6"/></g><path class="ink-fill" d="M6.4 5 C9 7 9.4 12 7.6 17.8 L6.4 17.8 Z"/><rect class="ink-fill" x="3.4" y="19.6" width="17.2" height="1.8" rx="0.7"/></svg>`,
  snake:   `<svg viewBox="0 0 24 24"><path class="ink" fill="none" stroke-width="2.2" stroke-linecap="round" d="M4.6 19.4 C9.4 20.6 11.8 17.6 9.8 15 C7.8 12.4 4.4 12.8 4.2 9.8 C4 6.8 7.4 5.4 10.8 6.2 C14.2 7 15.4 9.8 18.4 9.6 C20 9.5 20.6 8.2 20.2 7"/><circle class="ink-fill" cx="20.2" cy="5.9" r="1.6"/><circle cx="20.7" cy="5.5" r="0.4" fill="var(--paper)" stroke="none"/><path class="ink" stroke-width="1" d="M21.3 4.7 L22.5 3.5 M22.5 3.5 L23.2 4.1 M22.5 3.5 L21.9 2.8"/></svg>`,
  mirrorball: `<svg viewBox="0 0 24 24"><path class="ink" stroke-width="1.4" d="M12 1.2 V5.2"/><circle class="ink-fill" cx="12" cy="12.6" r="7.4"/><g stroke="currentColor" stroke-width="0.9" fill="none" opacity="0.9"><path d="M4.8 10 H19.2"/><path d="M4.7 12.6 H19.3"/><path d="M4.8 15.2 H19.2"/><path d="M12 5.2 V20"/><path d="M8.6 5.9 V19.4"/><path d="M15.4 5.9 V19.4"/><path d="M6.2 7.6 V17.7"/><path d="M17.8 7.6 V17.7"/></g><path class="ink-fill" d="M20.8 3.4 L21.4 4.7 L22.7 5.3 L21.4 5.9 L20.8 7.2 L20.2 5.9 L18.9 5.3 L20.2 4.7 Z"/><circle class="ink-fill" cx="3.4" cy="6.4" r="0.6"/></svg>`,
  diamond: `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M7 3.6 H17 L20.4 8.8 H3.6 Z"/><path class="ink-fill" d="M3.6 8.8 H20.4 L12 21 Z"/><g stroke="currentColor" stroke-width="0.9" fill="none"><path d="M3.6 8.8 H20.4"/><path d="M9.4 3.6 L7.6 8.8 L12 21"/><path d="M14.6 3.6 L16.4 8.8 L12 21"/><path d="M12 3.6 V8.8"/></g><circle cx="9.6" cy="6.1" r="0.6" fill="var(--paper)" stroke="none"/></svg>`,
  nib:     `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M12 2 L17 13 L12 22 L7 13 Z"/><circle cx="12" cy="10.5" r="1.7" fill="var(--paper)"/><path class="ink" stroke-width="1.2" d="M12 12.5 V21"/></svg>`,
  eyeclosed: `<svg viewBox="0 0 24 24"><path class="ink" fill="none" stroke-width="2" d="M3.2 9.4 C7.2 15.2 16.8 15.2 20.8 9.4"/><g class="ink" stroke-width="1.5"><path d="M5.2 12.8 L4 15.6"/><path d="M8.8 14.4 L8.2 17.2"/><path d="M12 15 V17.9"/><path d="M15.2 14.4 L15.8 17.2"/><path d="M18.8 12.8 L20 15.6"/></g><path class="ink-fill" d="M12 4.2 L12.5 5.4 L13.7 5.9 L12.5 6.4 L12 7.6 L11.5 6.4 L10.3 5.9 L11.5 5.4 Z"/></svg>`,
  tower:   `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M12 1.6 L12.7 4.2 H11.3 Z"/><g class="ink" stroke-width="1.4" fill="none"><path d="M11.2 4.5 C11 9 9.6 14.2 5.6 20.6"/><path d="M12.8 4.5 C13 9 14.4 14.2 18.4 20.6"/></g><g class="ink" stroke-width="1.1" fill="none"><path d="M10.2 8.6 H13.8"/><path d="M8.9 12.8 H15.1"/><path d="M7.6 16.9 C10.2 14.7 13.8 14.7 16.4 16.9"/><path d="M10.7 9.6 L13.4 11.9 M13.3 9.6 L10.6 11.9"/></g><path class="ink" stroke-width="1.4" d="M4.4 20.9 H19.6"/></svg>`,
  // a single water droplet — "Clean" (the rain washed it all away)
  drop:    `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M12 2.2 C12 2.2 5.2 10.2 5.2 15 a6.8 6.8 0 0 0 13.6 0 C18.8 10.2 12 2.2 12 2.2 Z"/><path d="M8.9 14.4 a3.2 3.2 0 0 0 2.3 3.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="10" cy="11.8" r="0.75" fill="var(--paper)" stroke="none"/></svg>`,
  // yin-yang — everything & nothing, all at once (the gold half is the bead fill,
  // the other half solid ink; two eyes complete the taijitu)
  yinyang: `<svg viewBox="0 0 24 24"><circle class="ink-fill" cx="12" cy="12" r="10" stroke-width="1.2"/><path d="M12 2 a10 10 0 0 1 0 20 a5 5 0 0 1 0 -10 a5 5 0 0 0 0 -10 z" fill="currentColor"/><circle cx="12" cy="7" r="1.7" fill="currentColor"/><circle cx="12" cy="17" r="1.7" fill="var(--paper)"/></svg>`,
  // a vinyl record — Taylor's Version (re-recording)
  vinyl:   `<svg viewBox="0 0 24 24"><circle class="ink-fill" cx="11.4" cy="12.6" r="9"/><circle cx="11.4" cy="12.6" r="4" fill="var(--paper)" stroke="none"/><circle class="ink-fill" cx="11.4" cy="12.6" r="1.2"/><g stroke="currentColor" stroke-width="0.8" fill="none" opacity="0.6"><circle cx="11.4" cy="12.6" r="6.2"/><circle cx="11.4" cy="12.6" r="7.6"/></g><path class="ink-fill" d="M20.6 2.6 L21.3 4 L22.7 4.7 L21.3 5.4 L20.6 6.8 L19.9 5.4 L18.5 4.7 L19.9 4 Z"/></svg>`,
  // Mastery skill emblems: a comet (Instinct), metronome (Quick Pen), heart holding lyric
  // lines (By Heart), a winding trail to a flag (The Long Game), and fanned records (Discography).
  comet:     `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M19.4 8.4 C13.5 12 7.5 15.5 2.6 21.6 C8.5 17 13.2 12.6 15 8.6 Z"/><path d="M12.4 12.3 L8.4 16.2 M13.9 13.9 L10 17.5" stroke="currentColor" stroke-width="0.9" stroke-linecap="round" opacity="0.55"/><circle class="ink-fill" cx="17.6" cy="6.9" r="3.3"/><circle cx="18.5" cy="6" r="1" fill="var(--paper)"/></svg>`,
  metronome: `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M9.2 5 H14.8 L18 21 H6 Z"/><path d="M7 16.6 H17" stroke="currentColor" stroke-width="1.1"/><rect x="11.7" y="7.8" width="5.2" height="3.2" rx="1" fill="var(--paper)" transform="rotate(14 14.3 9.4)"/><rect class="ink-fill" x="12.3" y="8.3" width="4" height="2.2" rx="0.6" transform="rotate(14 14.3 9.4)"/><path class="ink" d="M12 18 L16 3"/><circle cx="12" cy="18" r="0.9" fill="var(--paper)"/></svg>`,
  heartline: `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M12 21 C12 21 3.5 14.6 3.5 8.9 C3.5 6.1 5.7 4.3 8 4.3 C9.9 4.3 11.3 5.6 12 7 C12.7 5.6 14.1 4.3 16 4.3 C18.3 4.3 20.5 6.1 20.5 8.9 C20.5 14.6 12 21 12 21 Z"/><path d="M7.7 11 q2.15 -1.5 4.3 0 t4.3 0" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><path d="M9 13.7 q1.5 -1.1 3 0 t3 0" fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round" opacity="0.85"/></svg>`,
  trail:     `<svg viewBox="0 0 24 24"><path class="ink" stroke-width="2" d="M4.2 21 C10.4 20 6.6 14.6 11 13.2 C15.2 11.9 12 7.9 16.5 7"/><circle class="ink-fill" cx="4.2" cy="21" r="1.7"/><path class="ink" stroke-width="1.6" d="M16.5 7 V2.5"/><path class="ink-fill" d="M16.5 2.7 L21 4 L16.5 5.6 Z"/></svg>`,
  records:   `<svg viewBox="0 0 24 24"><circle class="ink-fill" cx="6.3" cy="15.3" r="4.8"/><circle cx="6.3" cy="15.3" r="4.8" fill="none" stroke="currentColor" stroke-width="0.9"/><circle class="ink-fill" cx="17.7" cy="15.3" r="4.8"/><circle cx="17.7" cy="15.3" r="4.8" fill="none" stroke="currentColor" stroke-width="0.9"/><circle class="ink-fill" cx="12" cy="11.3" r="5.7"/><circle cx="12" cy="11.3" r="3.5" fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.55"/><circle cx="12" cy="11.3" r="1.4" fill="var(--paper)"/></svg>`,
  // a few piano keys — the piano was hissing
  piano:   `<svg viewBox="0 0 24 24"><path class="ink" stroke-width="1.1" d="M10.1 6.8 C10.1 5 10.1 4 9.3 2.8 M9.3 2.8 L8.5 2.1 M9.3 2.8 L10 2"/><rect class="ink-fill" x="3" y="7" width="18" height="12" rx="1.4"/><rect x="4.4" y="8.4" width="15.2" height="9.2" fill="var(--paper)" stroke="none"/><g class="ink" stroke-width="1"><path d="M8.2 8.4 V17.6"/><path d="M12 8.4 V17.6"/><path d="M15.8 8.4 V17.6"/></g><g class="ink-fill"><rect x="6.9" y="8.4" width="1.5" height="5"/><rect x="10.7" y="8.4" width="1.5" height="5"/><rect x="14.5" y="8.4" width="1.5" height="5"/></g></svg>`,
  // an hourglass — is it over now?
  hourglass:`<svg viewBox="0 0 24 24"><g class="ink" stroke-width="2"><path d="M6 2.8 H18"/><path d="M6 21.2 H18"/></g><g class="ink" stroke-width="1.3" fill="none"><path d="M7 3.6 C7 8 10 9.6 11 12 C10 14.4 7 16 7 20.4"/><path d="M17 3.6 C17 8 14 9.6 13 12 C14 14.4 17 16 17 20.4"/></g><path class="ink-fill" d="M10.9 10.2 H13.1 L12 11.7 Z"/><g fill="currentColor"><circle cx="12" cy="13.6" r="0.4"/><circle cx="12" cy="15.2" r="0.4"/><circle cx="12" cy="16.8" r="0.4"/></g><path class="ink-fill" d="M8.2 20.4 C9.4 17.8 14.6 17.8 15.8 20.4 Z"/></svg>`,
  // a four-leaf clover — the lucky one
  clover:  `<svg viewBox="0 0 24 24"><g class="ink-fill"><circle cx="8.9" cy="7.9" r="3.2"/><circle cx="15.1" cy="7.9" r="3.2"/><circle cx="8.9" cy="14.1" r="3.2"/><circle cx="15.1" cy="14.1" r="3.2"/></g><g class="ink" stroke-width="1"><path d="M12 11 L8.1 7.1"/><path d="M12 11 L15.9 7.1"/><path d="M12 11 L8.1 14.9"/><path d="M12 11 L15.9 14.9"/></g><path class="ink" stroke-width="1.6" d="M12.4 12.8 C13.4 16 13 18.4 14.6 21.2"/></svg>`,
  // an ajar door — the bolter (someone who runs)
  door:    `<svg viewBox="0 0 24 24"><g class="ink" stroke-width="1.3"><path d="M6.4 3.4 V20.6"/><path d="M17.6 3.4 V20.6"/><path d="M6.4 3.4 H17.6"/></g><path class="ink-fill" d="M8 4 L15.2 2.6 V20.4 L8 21.8 Z"/><circle cx="13.7" cy="12" r="0.85" fill="currentColor" stroke="none"/><path class="ink" stroke-width="1.5" d="M4 21.6 H20"/><g class="ink" stroke-width="1.2"><path d="M3.6 8 H1.6"/><path d="M4 11.4 H1"/><path d="M3.6 14.8 H1.6"/></g></svg>`,
  // a padlock, shut — no closure
  lock:    `<svg viewBox="0 0 24 24"><path class="ink" fill="none" stroke-width="1.8" d="M8 10 V7.5 a4 4 0 0 1 8 0 V10"/><rect class="ink-fill" x="5" y="10" width="14" height="10" rx="1.6"/><circle cx="12" cy="14" r="1.3" fill="currentColor"/><rect x="11.3" y="14.5" width="1.4" height="3.2" rx="0.6" fill="currentColor"/></svg>`,
  // a pair of quotation marks — word for word, quoted exactly
  quote:   `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M3.2 4.6 H10.4 V11.2 C10.4 15.4 8.2 17.8 4.2 19 L3 16.1 C5.4 15.4 6.7 14.2 7.1 12.4 H3.2 Z"/><path d="M13.6 4.6 H20.8 V11.2 C20.8 15.4 18.6 17.8 14.6 19 L13.4 16.1 C15.8 15.4 17.1 14.2 17.5 12.4 H13.6 Z" fill="currentColor" stroke="none"/></svg>`,
  // an umbrella — it's raining and it's Monday
  umbrella:`<svg viewBox="0 0 24 24"><path class="ink" stroke-width="1.3" d="M12 1 V2.6"/><path class="ink-fill" d="M12 2.4 C6.2 2.4 2.4 6.8 2.4 11.6 L21.6 11.6 C21.6 6.8 17.8 2.4 12 2.4 Z"/><g stroke="currentColor" stroke-width="1" fill="none"><path d="M7.2 11.6 C7.2 7.4 8.8 3.8 12 2.8"/><path d="M16.8 11.6 C16.8 7.4 15.2 3.8 12 2.8"/><path d="M12 2.8 V11.6"/></g><path class="ink" stroke-width="1.6" fill="none" d="M12 11.6 V18.6 a2.4 2.4 0 0 1 -4.8 0"/><path class="ink-fill" d="M19.6 13.6 C20.3 14.6 20.6 15.3 20.6 15.9 A1.05 1.05 0 0 1 18.6 15.9 C18.6 15.3 18.9 14.5 19.6 13.6 Z"/><path class="ink-fill" d="M16.2 17.4 C16.7 18.1 16.9 18.6 16.9 19 A0.78 0.78 0 0 1 15.5 19 C15.5 18.6 15.7 18.1 16.2 17.4 Z"/></svg>`,
  // a ticked checklist page — every song in the catalogue, named (I Hate It Here)
  checklist:`<svg viewBox="0 0 24 24"><rect class="ink-fill" x="4.2" y="2.8" width="15.6" height="18.4" rx="1.8"/><rect class="ink-fill" x="9.6" y="1.4" width="4.8" height="2.8" rx="1.2"/><g stroke="currentColor" stroke-width="1.35" fill="none"><path d="M6.7 7.8 l1.2 1.2 L10.3 6.6"/><path d="M6.7 12.6 l1.2 1.2 L10.3 11.4"/><path d="M6.7 17.4 l1.2 1.2 L10.3 16.2"/><path d="M12.6 8.2 H17.2"/><path d="M12.6 13 H17.2"/><path d="M12.6 17.8 H16"/></g></svg>`,
  /* ---- Challenge flourish charms (won the hard way) ---- */
  // the ruled line stays put; the word lifts off it in pieces and winks out, and you wrote into the blank
  vanish:  `<svg viewBox="0 0 24 24"><path class="ink" stroke-width="2" stroke-linecap="round" d="M3.6 20 H16.4"/><path class="ink" stroke-width="1.6" stroke-linecap="round" fill="none" opacity="0.85" d="M4.4 15.8 C5.6 14.1 6.5 16 7.7 14.5 C8.3 13.8 8.9 14.4 9.4 14.9"/><path class="ink" stroke-width="1.4" stroke-linecap="round" fill="none" opacity="0.55" d="M10.6 12 C11.6 10.5 12.4 12.1 13.4 10.9"/><circle class="ink-fill" cx="15.3" cy="9.4" r="0.95" opacity="0.6"/><circle class="ink-fill" cx="17.1" cy="7.2" r="0.7" opacity="0.45"/><path class="ink-fill" d="M19.7 2.3 L20.45 3.95 L22.1 4.7 L20.45 5.45 L19.7 7.1 L18.95 5.45 L17.3 4.7 L18.95 3.95 Z"/></svg>`,
  // one record, played all night; it wears its heart on the label
  heartlabel: `<svg viewBox="0 0 24 24"><circle class="ink-fill" cx="12" cy="12" r="9.4"/><circle cx="12" cy="12" r="4.6" fill="var(--paper)" stroke="none"/><g stroke="currentColor" stroke-width="0.8" fill="none" opacity="0.6"><circle cx="12" cy="12" r="6.4"/><circle cx="12" cy="12" r="7.9"/></g><path class="ink-fill" d="M12 14.9 C12 14.9 9.1 12.9 9.1 11.1 C9.1 10.1 9.9 9.4 10.75 9.4 C11.3 9.4 11.75 9.7 12 10.2 C12.25 9.7 12.7 9.4 13.25 9.4 C14.1 9.4 14.9 10.1 14.9 11.1 C14.9 12.9 12 14.9 12 14.9 Z"/></svg>`,
  // a thread climbing bead over bead, no rung repeated, tied off in a ribbon at the top
  // (NB: "bow" is taken by the archery charm further down)
  ribbon:  `<svg viewBox="0 0 24 24"><path class="ink" stroke-width="1.5" fill="none" d="M2.8 21.4 C8 20.4 12.4 15.6 15.4 8.6"/><g class="ink-fill"><circle cx="6" cy="20.5" r="1.1"/><circle cx="9.3" cy="18.1" r="1.2"/><circle cx="12" cy="14.6" r="1.3"/><circle cx="14" cy="11" r="1.4"/></g><path class="ink-fill" d="M16.2 7.4 C13.6 4.6 10.9 5 11.5 7.3 C12 9.3 14.3 9.2 16.2 7.4 Z"/><path class="ink-fill" d="M16.2 7.4 C18.8 4.6 21.5 5 20.9 7.3 C20.4 9.3 18.1 9.2 16.2 7.4 Z"/><circle class="ink-fill" cx="16.2" cy="7.4" r="1.2"/><path class="ink" stroke-width="1.3" fill="none" d="M17.4 8.5 C18 9.6 17.9 10.7 17.3 11.8"/></svg>`,

  // TEMPORARY placeholder charm — a dashed frame around a question mark. Any icon set to
  // "placeholder" is art-pending (new challenges / achievements before their real icon is
  // drawn). Search "placeholder" to find everything still awaiting a bespoke charm.
  placeholder: `<svg viewBox="0 0 24 24"><rect class="ink" fill="none" stroke-width="1.5" stroke-dasharray="2.6 2.2" x="4" y="4" width="16" height="16" rx="3"/><path class="ink" fill="none" stroke-width="1.8" stroke-linecap="round" d="M9.3 9.5 a2.7 2.7 0 1 1 3.5 2.6 c-0.95 0.32 -1.05 0.95 -1.05 1.9"/><circle class="ink-fill" cx="11.75" cy="16.6" r="1.05"/></svg>`,

  /* ---- Achievement charm overhaul (every charm bespoke) ---- */
  // a wand mid-flick, star at the tip, dust still settling — your first spell
  wand:    `<svg viewBox="0 0 24 24"><path class="ink" stroke-width="2" d="M3.6 20.4 L13.2 10.8"/><path class="ink-fill" d="M17.2 2.6 L18.6 5.6 L21.6 7 L18.6 8.4 L17.2 11.4 L15.8 8.4 L12.8 7 L15.8 5.6 Z"/><circle class="ink-fill" cx="7.6" cy="13.4" r="0.9"/><circle class="ink-fill" cx="11.6" cy="17.2" r="0.6"/></svg>`,
  // a chess queen — it was all by design
  queen:   `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M9.2 18.6 C9.9 15.2 9.8 12.4 8.6 9.2 L10.9 10.6 L12 7.8 L13.1 10.6 L15.4 9.2 C14.2 12.4 14.1 15.2 14.8 18.6 Z"/><circle class="ink-fill" cx="8.3" cy="7.7" r="0.95"/><circle class="ink-fill" cx="12" cy="6.1" r="1.1"/><circle class="ink-fill" cx="15.7" cy="7.7" r="0.95"/><rect class="ink-fill" x="6.9" y="19.4" width="10.2" height="2" rx="0.9"/></svg>`,
  // a dress twirling in the rain, in your best dress, fearless
  dress:   `<svg viewBox="0 0 24 24"><g class="ink" stroke-width="1.3"><path d="M9.6 2.6 L10.4 5"/><path d="M14.4 2.6 L13.6 5"/></g><path class="ink-fill" d="M10 10.2 C10.6 10.9 13.4 10.9 14 10.2 L17.8 19.6 C15.7 20.8 13.7 19.9 12 20.9 C10.3 19.9 8.3 20.8 6.2 19.6 Z"/><path class="ink-fill" d="M9.4 4.8 C10.4 6 13.6 6 14.6 4.8 L14 10.2 C13.4 10.8 10.6 10.8 10 10.2 Z"/><g class="ink" stroke-width="1.1"><path d="M4.4 3 L3.6 5.2"/><path d="M20.4 3.4 L19.6 5.6"/><path d="M22.2 7.4 L21.6 9.2"/><path d="M2.4 8 L1.9 9.5"/></g></svg>`,
  // a speech bubble with a bolt inside — said it, fast
  speech:  `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M6.2 3.6 H17.8 A3.6 3.6 0 0 1 21.4 7.2 V12.6 A3.6 3.6 0 0 1 17.8 16.2 H11.4 L6.2 20.8 L7.2 16.2 H6.2 A3.6 3.6 0 0 1 2.6 12.6 V7.2 A3.6 3.6 0 0 1 6.2 3.6 Z"/><path d="M13.1 5.2 L9.4 10.7 H11.9 L10.9 14.6 L14.8 9.1 H12.2 Z" fill="currentColor" stroke="none"/></svg>`,
  // four ink strokes and a gold fifth — kept coming back
  tally:   `<svg viewBox="0 0 24 24"><g class="ink" stroke-width="1.9"><path d="M5.6 5.8 L5.3 18.4"/><path d="M9.5 5.6 L9.2 18.2"/><path d="M13.4 5.9 L13.1 18.5"/><path d="M17.3 5.6 L17 18.2"/></g><path class="ink-fill" d="M2.6 16.2 L19.6 7 L20.6 8.8 L3.6 18 Z"/></svg>`,
  // a coupe already moving — nothing good starts in it
  car:     `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M3 15.6 C3 13.9 4.3 13.2 5.9 12.9 L8.3 12.5 C9.8 10.7 11.8 9.7 14.1 9.7 C16.5 9.7 18.4 10.8 19.5 12.7 L20.9 13.1 C21.7 13.4 22.2 14.1 22.2 15 V16.2 A0.9 0.9 0 0 1 21.3 17.1 H3.9 A0.9 0.9 0 0 1 3 16.2 Z"/><path d="M9.9 12.4 C10.9 11.1 12.3 10.4 13.8 10.4 L14.2 12.4 Z" fill="var(--paper)" stroke="none"/><path d="M15.4 10.5 C16.7 10.7 17.7 11.4 18.4 12.5 L15.4 12.5 Z" fill="var(--paper)" stroke="none"/><circle class="ink-fill" cx="7.6" cy="17" r="2"/><circle cx="7.6" cy="17" r="0.7" fill="var(--paper)" stroke="none"/><circle class="ink-fill" cx="17.6" cy="17" r="2"/><circle cx="17.6" cy="17" r="0.7" fill="var(--paper)" stroke="none"/><path class="ink" stroke-width="1.4" d="M0.8 11.4 H3.4 M0.6 14 H2.2"/></svg>`,
  // five gems strung on one thread — the streak worn as a bracelet
  strand:  `<svg viewBox="0 0 24 24"><path class="ink" stroke-width="1.4" d="M2.4 8 C7 15 17 15 21.6 8"/><circle class="ink-fill" cx="2.4" cy="7.4" r="0.8"/><circle class="ink-fill" cx="21.6" cy="7.4" r="0.8"/><path class="ink-fill" d="M4.8 8.9 L5.9 10.2 L4.8 11.5 L3.7 10.2 Z"/><path class="ink-fill" d="M8.2 10.7 L9.6 12.4 L8.2 14.1 L6.8 12.4 Z"/><path class="ink-fill" d="M12 11 L13.8 13.2 L12 15.4 L10.2 13.2 Z"/><path class="ink-fill" d="M15.8 10.7 L17.2 12.4 L15.8 14.1 L14.4 12.4 Z"/><path class="ink-fill" d="M19.2 8.9 L20.3 10.2 L19.2 11.5 L18.1 10.2 Z"/></svg>`,
  // a hand mirror, cracked — it's me, hi
  mirror:  `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M10.8 15.2 H13.2 L13.8 20 A1.9 1.9 0 0 1 10.2 20 Z"/><circle class="ink-fill" cx="12" cy="9" r="6.6"/><circle cx="12" cy="9" r="4.7" fill="var(--paper)" stroke="none"/><path class="ink" stroke-width="0.9" d="M9.1 5.3 L10.6 7.9 L9.9 9.9 M10.6 7.9 L12.4 9 L12.9 10.8"/></svg>`,
  // circle, square, triangle — three ways to play, all played
  shapes:  `<svg viewBox="0 0 24 24"><circle class="ink-fill" cx="5.4" cy="12" r="3.1"/><rect class="ink-fill" x="10" y="9" width="6" height="6" rx="0.8"/><path class="ink-fill" d="M19.9 8.6 L23 15 H16.8 Z"/></svg>`,
  // a school locker with a 15 on the plate — freshman year
  locker:  `<svg viewBox="0 0 24 24"><rect class="ink-fill" x="6.6" y="2.6" width="10.8" height="18.8" rx="1.1"/><g fill="currentColor"><rect x="8.6" y="5" width="6.8" height="1.3" rx="0.65"/><rect x="8.6" y="7.4" width="6.8" height="1.3" rx="0.65"/><rect x="8.6" y="11.2" width="6.8" height="4.4" rx="0.7"/><rect x="14.9" y="17" width="1.4" height="2.6" rx="0.5"/></g><text x="12" y="14.7" text-anchor="middle" font-size="4" font-weight="700" font-family="ui-monospace, Menlo, monospace" fill="currentColor">15</text></svg>`,
  // a sparkler burning at the middle of its arc — ten in a row
  sparkler:`<svg viewBox="0 0 24 24"><path class="ink" stroke-width="1.8" d="M12 21.6 V13.4"/><g class="ink" stroke-width="1.3"><path d="M12 3.4 V6.6"/><path d="M16.6 4.9 L14.8 7.5"/><path d="M19.6 9.1 L16.6 9.6"/><path d="M16.6 14.1 L14.8 11.5"/><path d="M7.4 4.9 L9.2 7.5"/><path d="M4.4 9.1 L7.4 9.6"/><path d="M7.4 14.1 L9.2 11.5"/></g><circle class="ink-fill" cx="12" cy="9.5" r="1.9"/><circle class="ink-fill" cx="18.9" cy="4.4" r="0.7"/><circle class="ink-fill" cx="4.9" cy="4.6" r="0.6"/><circle class="ink-fill" cx="20.6" cy="13.4" r="0.6"/></svg>`,
  // a poppy — the flower the great war is remembered by
  poppy:   `<svg viewBox="0 0 24 24"><path class="ink" stroke-width="1.7" d="M11.9 13.6 C11.5 16.4 12.2 18.6 11.4 21.6"/><path class="ink-fill" d="M8.9 17.6 C7.2 16.6 6.7 14.7 8.4 13.6 C9.5 15.1 9.9 16.5 8.9 17.6 Z"/><g class="ink-fill"><circle cx="12" cy="7.8" r="3.4"/><circle cx="9.5" cy="10.4" r="3.4"/><circle cx="14.5" cy="10.4" r="3.4"/></g><circle cx="12" cy="9.8" r="2" fill="currentColor" stroke="none"/></svg>`,
  // a crown held above crossed laurels — long live all the magic we made
  coronet: `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M5.2 13.2 L6.4 6.6 L9.7 9.7 L12 5.4 L14.3 9.7 L17.6 6.6 L18.8 13.2 Z"/><path class="ink" stroke-width="1.4" d="M5.6 13.2 H18.4"/><circle class="ink-fill" cx="6.4" cy="5.8" r="1"/><circle class="ink-fill" cx="12" cy="4.5" r="1.1"/><circle class="ink-fill" cx="17.6" cy="5.8" r="1"/><g class="ink" stroke-width="1.4"><path d="M4.2 20.9 C7.2 20.3 9.8 18.7 11.2 16.2"/><path d="M19.8 20.9 C16.8 20.3 14.2 18.7 12.8 16.2"/></g><g class="ink-fill"><ellipse cx="6.2" cy="19.9" rx="1.1" ry="0.65"/><ellipse cx="8.6" cy="18.6" rx="1.1" ry="0.65"/><ellipse cx="10.5" cy="16.9" rx="1" ry="0.6"/><ellipse cx="17.8" cy="19.9" rx="1.1" ry="0.65"/><ellipse cx="15.4" cy="18.6" rx="1.1" ry="0.65"/><ellipse cx="13.5" cy="16.9" rx="1" ry="0.6"/></g></svg>`,
  // a struck match — light me up
  match:   `<svg viewBox="0 0 24 24"><path d="M11.1 10.6 H12.9 L12.75 21.6 H11.25 Z" fill="currentColor" stroke="none"/><ellipse class="ink-fill" cx="12" cy="10.6" rx="1.7" ry="1.3"/><path class="ink-fill" d="M12 2 C13.9 4.3 15.1 6.1 15.1 7.9 A3.1 3.1 0 0 1 8.9 7.9 C8.9 6.1 10.1 4.3 12 2 Z"/><path d="M12 5.6 C12.8 6.6 13.25 7.3 13.25 8 A1.25 1.25 0 0 1 10.75 8 C10.75 7.3 11.2 6.6 12 5.6 Z" fill="var(--paper)" stroke="none"/></svg>`,
  // a cat, sitting, unbothered — karma's whole deal
  cat:     `<svg viewBox="0 0 24 24"><path class="ink" stroke-width="1.7" d="M18.3 20.9 C21 20.9 22.2 19 21.3 17.1"/><path class="ink-fill" d="M7.5 8.6 C7.5 7.1 7.9 5.9 8.8 5 L8.5 2.4 L10.7 4 C11.6 3.7 12.4 3.7 13.3 4 L15.5 2.4 L15.2 5 C16.1 5.9 16.5 7.1 16.5 8.6 C16.5 10.2 15.7 11.6 14.4 12.4 C16.9 13.9 18.3 16.6 18.3 21 H5.7 C5.7 16.6 7.1 13.9 9.6 12.4 C8.3 11.6 7.5 10.2 7.5 8.6 Z"/><g fill="currentColor"><circle cx="10.4" cy="8.2" r="0.75"/><circle cx="13.6" cy="8.2" r="0.75"/></g></svg>`,
  // both hands straight up, one star out — meet me at midnight
  clock:   `<svg viewBox="0 0 24 24"><circle class="ink-fill" cx="11" cy="13" r="7.6"/><circle cx="11" cy="13" r="5.9" fill="var(--paper)" stroke="none"/><g class="ink" stroke-width="1"><path d="M11 7.7 V8.9"/><path d="M16.3 13 H15.1"/><path d="M11 18.3 V17.1"/><path d="M5.7 13 H6.9"/></g><path class="ink" stroke-width="1.9" d="M11 13 V10.1"/><path class="ink" stroke-width="1.2" d="M11 13 V8.3"/><circle cx="11" cy="13" r="0.85" fill="currentColor" stroke="none"/><path class="ink-fill" d="M20.1 2.6 L20.9 4.4 L22.7 5.2 L20.9 6 L20.1 7.8 L19.3 6 L17.5 5.2 L19.3 4.4 Z"/></svg>`,
  // three bounces and back up — players gonna play, you kept going
  bounce:  `<svg viewBox="0 0 24 24"><path class="ink" stroke-width="1.4" d="M2 21 H22"/><g class="ink" stroke-width="1.5"><path d="M2.6 19 C4.8 12.4 8.2 12.4 10.4 19"/><path d="M10.4 19 C12 14.2 14.4 14.2 16 19"/><path d="M16 19 C17.2 16.6 18.3 14.9 19.8 13.6"/></g><circle class="ink-fill" cx="20.9" cy="12.6" r="2.1"/></svg>`,
  // a dove carrying a sprig — the timer never saw red
  dove:    `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M9.8 4.4 C13 4.4 15.2 6.2 15.6 9 C13.4 10.2 10.8 10 9 8.4 C8.6 7 8.9 5.6 9.8 4.4 Z"/><path class="ink-fill" d="M4 10.4 C6.8 8.6 10.4 8.4 13.2 10 C15.6 11.4 18.4 11.4 20.8 10.2 L22.6 9.3 L21.4 11.6 C19.4 15.2 14.6 16.6 10.6 15.2 C7.6 14.2 5.2 12.6 4 10.4 Z"/><circle class="ink-fill" cx="4.9" cy="9.3" r="1.6"/><path class="ink-fill" d="M3.5 8.7 L1.9 9.3 L3.5 9.9 Z"/><path class="ink" stroke-width="1.1" d="M2 9.1 C1.4 7.8 1.6 6.4 2.6 5.4"/><ellipse class="ink-fill" cx="2" cy="6.5" rx="0.85" ry="0.5"/><ellipse class="ink-fill" cx="3" cy="5.2" rx="0.85" ry="0.5"/></svg>`,
  // a ribbon tied over the eyes — never answered once
  blindfold:`<svg viewBox="0 0 24 24"><path class="ink-fill" d="M1.8 11.6 C6.6 8.6 12.8 7.8 18.6 9.4 L18 14.4 C12.6 12.6 7 13.2 2.4 16 Z"/><circle class="ink-fill" cx="19.6" cy="11.6" r="1.7"/><path class="ink-fill" d="M20.8 10.6 C22.4 9.2 23.6 9.6 23.6 11.2 C22.5 11.1 21.6 11.5 20.9 12.4 Z"/><path class="ink-fill" d="M20.9 12.8 C22.6 13.4 23.2 15 22.4 16.8 C21.7 15.4 20.8 14.4 19.6 13.8 Z"/><g class="ink" stroke-width="1"><path d="M6.6 10 C7.1 11.2 7.1 12.7 6.6 13.9"/><path d="M11.6 9.2 C12.1 10.5 12.1 12.1 11.6 13.4"/></g></svg>`,
  // a lantern lit for the night — just close your eyes
  lantern: `<svg viewBox="0 0 24 24"><path class="ink" stroke-width="1.4" d="M9.4 4.4 C9.4 2.5 14.6 2.5 14.6 4.4"/><path class="ink-fill" d="M8.2 7.6 L9.2 4.8 H14.8 L15.8 7.6 Z"/><rect class="ink-fill" x="8" y="7.6" width="8" height="9.8" rx="1"/><rect x="9.9" y="9.3" width="4.2" height="6.2" rx="0.8" fill="var(--paper)" stroke="none"/><path class="ink-fill" d="M12 10.4 C12.9 11.5 13.3 12.4 13.3 13.2 A1.3 1.3 0 0 1 10.7 13.2 C10.7 12.4 11.1 11.5 12 10.4 Z"/><rect class="ink-fill" x="7.4" y="17.4" width="9.2" height="1.8" rx="0.8"/><g class="ink" stroke-width="1.1"><path d="M5.6 10.4 L4.2 9.8"/><path d="M5.6 14 L4.2 14.6"/><path d="M18.4 10.4 L19.8 9.8"/><path d="M18.4 14 L19.8 14.6"/></g></svg>`,
  // a cheer megaphone — R-E-V-E-N-G-E, chanted at your own record
  megaphone:`<svg viewBox="0 0 24 24"><path class="ink-fill" d="M3 10.5 L19 5.5 V18.5 L3 13.5 Z"/><path class="ink" stroke-width="1.2" d="M3 10.5 C2 11 2 13 3 13.5"/><path class="ink" stroke-width="1.5" d="M9.4 14.2 L10.4 17.8 H13.6"/><g class="ink" stroke-width="1.3"><path d="M21 8 L22.8 7.2"/><path d="M21.2 12 H23"/><path d="M21 16 L22.8 16.8"/></g></svg>`,
  // a palm over snow — weird but it was beautiful
  palm:    `<svg viewBox="0 0 24 24"><path class="ink" stroke-width="1.7" d="M11 21.4 C11.6 17 11.4 13 10.2 9.6"/><path class="ink-fill" d="M10 9.2 C7 7.6 4.4 8 2.8 10 C5.6 10.6 8.2 10.4 10 9.2 Z"/><path class="ink-fill" d="M10 9 C8.4 6 5.8 4.6 3.2 5 C5.2 7.4 7.6 8.8 10 9 Z"/><path class="ink-fill" d="M10.2 8.8 C10 5.6 11.6 3 14.2 2.2 C14 5 12.4 7.6 10.2 8.8 Z"/><path class="ink-fill" d="M10.4 9 C13.2 7.4 16 7.6 17.8 9.4 C15.2 10.4 12.6 10.2 10.4 9 Z"/><path class="ink" stroke-width="1.4" d="M6.6 21.6 H15.4"/><g class="ink" stroke-width="1"><path d="M19.6 13.2 V16.8"/><path d="M17.8 15 H21.4"/><path d="M18.3 13.7 L20.9 16.3"/><path d="M20.9 13.7 L18.3 16.3"/><path d="M17 3.6 V6"/><path d="M15.8 4.8 H18.2"/><path d="M16.2 4 L17.8 5.6"/><path d="M17.8 4 L16.2 5.6"/></g></svg>`,
  // a crescent over thin falling streaks, the page kept company past midnight
  // (depth faked like the canvas effect: nearer drops longer and brighter)
  nightrain:`<svg viewBox="0 0 24 24"><path class="ink-fill" d="M17.6 8.9 A4.95 4.95 0 1 1 12.65 2.55 A3.85 3.85 0 0 0 17.6 8.9 Z"/><path class="ink-fill" d="M4.7 2.2 L5.3 3.1 L6.2 3.7 L5.3 4.3 L4.7 5.2 L4.1 4.3 L3.2 3.7 L4.1 3.1 Z"/><g class="ink" stroke-width="1.5"><path d="M7.4 11.6 L6.9 16.8"/><path d="M12.7 14.4 L12.2 19.6"/></g><g class="ink" stroke-width="1.2" opacity="0.75"><path d="M17.6 12.8 L17.2 16.8"/><path d="M4.2 14.2 L3.9 17.6"/></g><g class="ink" stroke-width="1" opacity="0.5"><path d="M20.9 8.6 L20.6 11.4"/><path d="M9.9 19.4 L9.7 21.6"/></g></svg>`,
  // twelve beads strung, the clasp open, one bead never tied on — no closure
  unclasped:`<svg viewBox="0 0 24 24"><path class="ink" stroke-width="1.3" d="M17.2 5.2 A8.6 8.6 0 1 0 19.8 14.6"/><g class="ink-fill"><circle cx="19.45" cy="16.3" r="1.15"/><circle cx="17.1" cy="18.9" r="1.15"/><circle cx="13.9" cy="20.4" r="1.15"/><circle cx="10.4" cy="20.45" r="1.15"/><circle cx="7.15" cy="19.1" r="1.15"/><circle cx="4.7" cy="16.55" r="1.15"/><circle cx="3.5" cy="13.25" r="1.15"/><circle cx="3.7" cy="9.75" r="1.15"/><circle cx="5.3" cy="6.6" r="1.15"/><circle cx="8" cy="4.4" r="1.15"/><circle cx="11.4" cy="3.4" r="1.15"/><circle cx="14.9" cy="4.1" r="1.15"/></g><path class="ink" stroke-width="1.1" d="M17.2 5.2 C18 4.4 19 4.3 19.7 4.9"/><circle cx="20.2" cy="9.5" r="1.15" fill="none" stroke="currentColor" stroke-width="0.9" stroke-dasharray="1.4 1.3" opacity="0.55"/></svg>`,
  // a glass slipper, still sparkling — your first daily, a fairytale
  slipper: `<svg viewBox="0 0 24 24"><path d="M4.2 19.4 L5 15.4 C5.4 13.2 5 10.8 4.2 8.6 L6 9.2 C7 12 9 14.2 12.2 15.2 C15.4 16.2 18.6 16.6 20.8 18 C21.6 18.5 21.6 19.4 20.6 19.4 Z" fill="var(--paper)" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path class="ink-fill" d="M4.2 19.4 L5 15.4 L6.4 15.7 L5.6 19.4 Z"/><path class="ink-fill" d="M15.4 5.4 L16.1 7 L17.7 7.7 L16.1 8.4 L15.4 10 L14.7 8.4 L13.1 7.7 L14.7 7 Z"/><circle class="ink-fill" cx="10.6" cy="4.4" r="0.7"/><circle class="ink-fill" cx="19" cy="10.4" r="0.6"/></svg>`,
  // the sun coming up over the line — step into the daylight
  sunrise: `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M6.6 17.4 A5.4 5.4 0 0 1 17.4 17.4 Z"/><path class="ink" stroke-width="1.7" d="M2.6 17.4 H21.4"/><g class="ink" stroke-width="1.5"><path d="M12 6 V8.6"/><path d="M5.4 9 L7.2 10.8"/><path d="M18.6 9 L16.8 10.8"/><path d="M2.8 13.2 L5.2 14"/><path d="M21.2 13.2 L18.8 14"/></g><path class="ink" stroke-width="1.3" d="M4 20.6 H8.4 M15.6 20.6 H20"/></svg>`,
  // an open book with a heart on the page — a story kept up daily
  openbook:`<svg viewBox="0 0 24 24"><path class="ink-fill" d="M12 6.2 C9.4 4.6 6 4.4 3.2 5.4 V17.4 C6 16.4 9.4 16.6 12 18.2 C14.6 16.6 18 16.4 20.8 17.4 V5.4 C18 4.4 14.6 4.6 12 6.2 Z"/><path d="M12 6.2 V18.2" stroke="currentColor" stroke-width="1.2" fill="none"/><g stroke="currentColor" stroke-width="0.95" fill="none"><path d="M5.2 8.4 H10"/><path d="M5.2 10.6 H10"/><path d="M5.2 12.8 H8.6"/></g><path d="M16.6 12.8 C13.8 10.6 15.4 8.4 16.6 9.8 C17.8 8.4 19.4 10.6 16.6 12.8 Z" fill="currentColor" stroke="none"/></svg>`,
  // an evergreen sprig with winter berries — lasts through every season
  sprig:   `<svg viewBox="0 0 24 24"><path class="ink" stroke-width="1.5" d="M6 20 C10 16 13 11.6 15.4 6.4"/><g class="ink-fill"><ellipse cx="14.2" cy="6.6" rx="2.5" ry="1" transform="rotate(-58 14.2 6.6)"/><ellipse cx="15.8" cy="8.4" rx="2.3" ry="0.95" transform="rotate(-30 15.8 8.4)"/><ellipse cx="11.5" cy="10.9" rx="2.6" ry="1" transform="rotate(-52 11.5 10.9)"/><ellipse cx="13.4" cy="12.9" rx="2.4" ry="0.95" transform="rotate(-24 13.4 12.9)"/><ellipse cx="8.8" cy="14.9" rx="2.6" ry="1" transform="rotate(-46 8.8 14.9)"/><ellipse cx="10.8" cy="16.9" rx="2.4" ry="0.95" transform="rotate(-18 10.8 16.9)"/></g><circle class="ink-fill" cx="5.4" cy="17.6" r="1.25"/><circle class="ink-fill" cx="7.5" cy="19.3" r="1.25"/></svg>`,
  // two pines and the path out between them — are we out of the woods yet
  pines:   `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M6 3.6 L9.4 8.8 H7.7 L10.2 12.8 H1.8 L4.3 8.8 H2.6 Z"/><rect class="ink-fill" x="5.2" y="12.8" width="1.6" height="3"/><path class="ink-fill" d="M18 3.6 L21.4 8.8 H19.7 L22.2 12.8 H13.8 L16.3 8.8 H14.6 Z"/><rect class="ink-fill" x="17.2" y="12.8" width="1.6" height="3"/><g class="ink" stroke-width="1.3"><path d="M10.2 21.4 C10.7 18.8 11.2 17 11.7 15.2"/><path d="M14.2 21.4 C13.7 18.8 13.3 17 12.8 15.2"/><path d="M12.3 19.9 V19"/><path d="M12.3 17.2 V16.5"/></g></svg>`,
  // two balloons, strings crossed — feeling twenty-two
  balloons:`<svg viewBox="0 0 24 24"><ellipse class="ink-fill" cx="8.4" cy="7.2" rx="3.5" ry="4.3"/><path class="ink-fill" d="M7.4 11.4 H9.4 L8.4 13 Z"/><ellipse class="ink-fill" cx="16" cy="6.2" rx="3.1" ry="3.9"/><path class="ink-fill" d="M15.1 10 H16.9 L16 11.5 Z"/><g class="ink" stroke-width="1.2"><path d="M8.6 13 C9.6 15.8 11.2 17.6 12.4 20.8"/><path d="M15.8 11.5 C14.4 14.6 13 16.6 11.8 20.4"/></g><circle cx="7" cy="5.6" r="0.8" fill="var(--paper)" stroke="none"/><circle cx="14.9" cy="4.9" r="0.7" fill="var(--paper)" stroke="none"/></svg>`,
  // a tangle that settles into one clean line — long story short, you survived
  scribbleline:`<svg viewBox="0 0 24 24"><path class="ink" stroke-width="1.5" d="M2.2 13.4 C2.8 9.8 6.4 8.6 7 11 C7.6 13.4 3.4 14.6 4.4 16.8 C5.4 19 8.8 17.2 9.2 14.2 C9.5 12 8.4 10.8 7 12 C8 12.8 9.6 13.2 11 13.2"/><rect class="ink-fill" x="11" y="12.4" width="8.2" height="1.6" rx="0.8"/><path class="ink-fill" d="M18.8 10.9 L22.4 13.2 L18.8 15.5 Z"/></svg>`,
  // an ice lolly losing to july — cruel summer
  lolly:   `<svg viewBox="0 0 24 24"><path class="ink" stroke-width="1.6" d="M12.4 15.6 L13.3 21.2"/><g transform="rotate(-9 11.6 9)"><path class="ink-fill" d="M7.7 4.4 A4 4 0 0 1 15.7 4.4 L15 13.4 A2.3 2.3 0 0 1 10.4 13.3 Z"/><path d="M9.8 4.8 L9.6 11" stroke="currentColor" stroke-width="1.1" fill="none" stroke-linecap="round"/><path d="M12.2 4.6 L12.1 11.2" stroke="currentColor" stroke-width="1.1" fill="none" stroke-linecap="round" opacity="0.7"/></g><path class="ink-fill" d="M8 15.4 C8.5 16.1 8.7 16.6 8.7 17 A0.72 0.72 0 0 1 7.3 17 C7.3 16.6 7.5 16.1 8 15.4 Z"/><circle class="ink-fill" cx="9.8" cy="19.4" r="0.55"/><circle class="ink-fill" cx="15.4" cy="16.2" r="0.5"/></svg>`,
  // light breaking off the ground you dance on — holy ground
  rays:    `<svg viewBox="0 0 24 24"><path class="ink" stroke-width="1.7" d="M3 19.6 H21"/><path class="ink-fill" d="M7.4 19.6 A4.6 2 0 0 1 16.6 19.6 Z"/><g class="ink" stroke-width="1.4"><path d="M12 15.6 V10.8"/><path d="M8.7 16.3 L6.8 12.9"/><path d="M15.3 16.3 L17.2 12.9"/><path d="M6.5 18 L3.8 16"/><path d="M17.5 18 L20.2 16"/></g><circle class="ink-fill" cx="12" cy="8.6" r="0.85"/><circle class="ink-fill" cx="5.4" cy="10.9" r="0.65"/><circle class="ink-fill" cx="18.6" cy="10.9" r="0.65"/></svg>`,
  // an anvil and one spark — where the words get forged
  anvil:   `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M2.8 7.4 H21.2 C21.2 10 18.4 11.4 15.6 11.6 L15.2 14.4 H17.6 L18.4 18 H5.6 L6.4 14.4 H8.8 L8.4 11.6 C5.2 11.4 2.8 9.8 2.8 7.4 Z"/><rect class="ink-fill" x="4.6" y="18" width="14.8" height="1.9" rx="0.8"/><path class="ink-fill" d="M12 1.4 L12.6 2.9 L14.1 3.5 L12.6 4.1 L12 5.6 L11.4 4.1 L9.9 3.5 L11.4 2.9 Z"/></svg>`,
  // a pencil finishing the line — got you down, word for word
  pencil:  `<svg viewBox="0 0 24 24"><g transform="rotate(45 12 12)"><rect class="ink-fill" x="10.2" y="1.6" width="3.6" height="2.6" rx="0.7"/><rect class="ink-fill" x="10.2" y="4.6" width="3.6" height="10.4"/><path d="M10.2 15 H13.8 L12 19 Z" fill="var(--paper)" stroke="currentColor" stroke-width="0.9" stroke-linejoin="round"/><path d="M11.4 17.3 L12 19 L12.6 17.3 Z" fill="currentColor" stroke="none"/></g><path class="ink" stroke-width="1.4" d="M2.4 21 C3.6 19.6 4.8 20.6 6 19.4 C6.5 18.9 6.9 18.2 7.2 17.4"/></svg>`,
  // a heart locket on its chain — kept close, known by heart
  locket:  `<svg viewBox="0 0 24 24"><g class="ink" stroke-width="1.2"><path d="M4.6 2.2 C7.4 4.4 9.6 5.6 12 6.2"/><path d="M19.4 2.2 C16.6 4.4 14.4 5.6 12 6.2"/></g><circle class="ink-fill" cx="12" cy="7" r="1.05"/><path class="ink-fill" d="M12 21 C4.8 15.6 4.4 11 6.9 8.7 C9 6.8 11.3 7.8 12 9.7 C12.7 7.8 15 6.8 17.1 8.7 C19.6 11 19.2 15.6 12 21 Z"/><circle cx="12" cy="12.4" r="1.1" fill="var(--paper)" stroke="none"/><rect x="11.4" y="12.9" width="1.2" height="2.7" rx="0.55" fill="var(--paper)" stroke="none"/></svg>`,
  // a spiral with no visible beginning — you don't even know where it starts
  spiral:  `<svg viewBox="0 0 24 24"><circle class="ink-fill" cx="12.2" cy="12" r="1"/><path class="ink" stroke-width="1.6" d="M12 12.6 C12.8 11.8 12.6 10.6 11.6 10.2 C10 9.6 8.6 11 8.8 12.8 C9 15.2 11.2 16.6 13.6 16.2 C16.6 15.7 18.4 13 17.9 10 C17.3 6.4 13.8 4.2 10.2 4.9 C6 5.7 3.4 9.8 4.3 14 C5.3 18.8 10 21.8 14.9 20.7 C17.4 20.2 19.5 18.7 20.8 16.6"/></svg>`,
  // a trophy with the quote marks engraved — a thousand lines, clearly ready
  trophy:  `<svg viewBox="0 0 24 24"><g class="ink" stroke-width="1.4"><path d="M7 5.4 C4.4 5.4 4.4 9 7.2 9.4"/><path d="M17 5.4 C19.6 5.4 19.6 9 16.8 9.4"/></g><path class="ink-fill" d="M7 3.8 H17 V8.4 A5 5 0 0 1 7 8.4 Z"/><g fill="currentColor" stroke="none"><path d="M9.9 6 H11.1 V7.1 C11.1 7.9 10.7 8.4 9.9 8.7 L9.6 8 C10 7.8 10.2 7.6 10.3 7.2 H9.9 Z"/><path d="M12.9 6 H14.1 V7.1 C14.1 7.9 13.7 8.4 12.9 8.7 L12.6 8 C13 7.8 13.2 7.6 13.3 7.2 H12.9 Z"/></g><path class="ink-fill" d="M11.2 13.4 H12.8 L13.4 16.6 H10.6 Z"/><rect class="ink-fill" x="8.2" y="16.6" width="7.6" height="1.9" rx="0.8"/></svg>`,
  // homework back with an A+ and a gold star — overachiever
  aplus:   `<svg viewBox="0 0 24 24"><rect class="ink-fill" x="5" y="2.6" width="14" height="18.8" rx="1.6"/><text x="10.4" y="11" text-anchor="middle" font-size="6.2" font-weight="700" font-family="ui-monospace, Menlo, monospace" fill="currentColor">A+</text><g stroke="currentColor" stroke-width="1" fill="none"><path d="M7.4 14.2 H16.6"/><path d="M7.4 16.6 H16.6"/><path d="M7.4 19 H13"/></g><path class="ink-fill" d="M16.2 3.9 L16.9 5.3 L18.4 5.5 L17.3 6.6 L17.6 8.1 L16.2 7.4 L14.8 8.1 L15.1 6.6 L14 5.5 L15.5 5.3 Z"/></svg>`,
  // a repeat sign — someone has a favourite song
  repeat:  `<svg viewBox="0 0 24 24"><rect class="ink-fill" x="14.9" y="4.6" width="2.6" height="14.8" rx="0.7"/><path class="ink" stroke-width="1.6" d="M19.9 4.6 V19.4"/><circle class="ink-fill" cx="11.2" cy="9.6" r="1.35"/><circle class="ink-fill" cx="11.2" cy="14.4" r="1.35"/><ellipse class="ink-fill" cx="4.6" cy="16.4" rx="1.5" ry="1.1"/><path class="ink" stroke-width="1.2" d="M6 16.2 V8.4 C6.9 8.9 7.4 9.6 7.4 10.6"/></svg>`,
  // three hearts holding a shape together — cardigan, betty, august
  trihearts:`<svg viewBox="0 0 24 24"><g class="ink" stroke-width="1.2"><path d="M12 5.6 L5.4 16.8"/><path d="M12 5.6 L18.6 16.8"/><path d="M5.4 16.8 H18.6"/></g><path class="ink-fill" d="M12 7.2 C9.4 5.4 10.2 2.8 12 4.1 C13.8 2.8 14.6 5.4 12 7.2 Z"/><path class="ink-fill" d="M5.4 18.9 C2.8 17.1 3.6 14.5 5.4 15.8 C7.2 14.5 8 17.1 5.4 18.9 Z"/><path class="ink-fill" d="M18.6 18.9 C16 17.1 16.8 14.5 18.6 15.8 C20.4 14.5 21.2 17.1 18.6 18.9 Z"/></svg>`,
  // a bee looping the page — three in a row, all Bs
  bee:     `<svg viewBox="0 0 24 24"><path class="ink" stroke-width="1" stroke-dasharray="1.6 1.8" d="M6 7.2 C2.8 5.6 3.6 2.6 6.2 3 C8.6 3.4 8.4 6.2 6.4 7.2 C8.2 8.6 9.8 10 11 11.4"/><g transform="rotate(-18 12.5 13.5)"><ellipse cx="11.2" cy="9.7" rx="2" ry="1.2" fill="var(--paper)" stroke="currentColor" stroke-width="1" transform="rotate(-28 11.2 9.7)"/><ellipse cx="14.2" cy="9.9" rx="1.8" ry="1.1" fill="var(--paper)" stroke="currentColor" stroke-width="1" transform="rotate(18 14.2 9.9)"/><ellipse class="ink-fill" cx="12.5" cy="13.5" rx="3.7" ry="2.6"/><g class="ink" stroke-width="1.2"><path d="M11.5 11.2 V15.9"/><path d="M13.7 11.2 V15.9"/></g><circle class="ink-fill" cx="8.4" cy="13.5" r="1.6"/><path class="ink-fill" d="M16.1 12.9 L18 13.5 L16.1 14.1 Z"/></g></svg>`,
  // a bow at full draw — the first challenge, defeated
  bow:     `<svg viewBox="0 0 24 24"><path class="ink" stroke-width="1.7" d="M6.4 3.4 C13.4 7.4 13.4 16.6 6.4 20.6"/><path class="ink" stroke-width="1" d="M6.4 3.4 L10.2 12 L6.4 20.6"/><path class="ink" stroke-width="1.4" d="M10.2 12 H19.4"/><path class="ink-fill" d="M19 10.7 L22.4 12 L19 13.3 Z"/><g class="ink" stroke-width="1.1"><path d="M10.3 11.9 L8.8 10.5"/><path d="M10.3 12.1 L8.8 13.5"/></g></svg>`,
  // an alchemist's flask, mid-transmutation — turned every trial to gold
  flask:   `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M9.6 3 H14.4 V8.2 L19 17.8 A1.9 1.9 0 0 1 17.2 20.4 H6.8 A1.9 1.9 0 0 1 5 17.8 L9.6 8.2 Z"/><path class="ink" stroke-width="1.6" d="M8.8 3 H15.2"/><g fill="var(--paper)" stroke="none"><circle cx="10.4" cy="16.6" r="0.95"/><circle cx="13.4" cy="17.8" r="0.7"/><circle cx="12.2" cy="14.6" r="0.55"/></g><path class="ink-fill" d="M18.9 3.4 L19.5 4.8 L20.9 5.4 L19.5 6 L18.9 7.4 L18.3 6 L16.9 5.4 L18.3 4.8 Z"/></svg>`,
  // two rings, linked — I'd marry you with paper rings
  rings:   `<svg viewBox="0 0 24 24"><circle cx="9.2" cy="12" r="4.9" fill="none" stroke="currentColor" stroke-width="4.4"/><circle cx="9.2" cy="12" r="4.9" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="15.6" cy="12" r="4.9" fill="none" stroke="currentColor" stroke-width="4.4"/><circle cx="15.6" cy="12" r="4.9" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M11.3 7.7 A4.9 4.9 0 0 1 14 11.4" fill="none" stroke="currentColor" stroke-width="4.4"/><path d="M11.3 7.7 A4.9 4.9 0 0 1 14 11.4" fill="none" stroke="currentColor" stroke-width="2.2"/></svg>`,
  // every draft it took — this is me trying
  crumple: `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M7 4.6 L12.4 3 L17.2 5.2 L20.2 9.8 L19 14.8 L14.8 18.2 L9.2 17.8 L5 14.2 L4.2 9 Z"/><g class="ink" stroke-width="0.95" opacity="0.8"><path d="M7 4.6 L11 9.4 L9.2 13.6"/><path d="M12.4 3 L11 9.4"/><path d="M17.2 5.2 L13.8 8.8 L15.6 13.2"/><path d="M20.2 9.8 L15.6 13.2 L14.8 18.2"/><path d="M4.2 9 L9.2 13.6 L9.2 17.8"/></g><path class="ink-fill" d="M16.8 18.4 L21.4 16.8 L20.6 21.2 Z"/></svg>`,
  // a map with the pin finally placed — a place in this world
  map:     `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M3 6.4 L9 4.6 L15 6.4 L21 4.6 V17.6 L15 19.4 L9 17.6 L3 19.4 Z"/><g class="ink" stroke-width="1"><path d="M9 4.6 V17.6"/><path d="M15 6.4 V19.4"/></g><path d="M5.2 15.4 C7.2 12.4 10.4 14.6 12.4 10.6" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="1.8 1.6" stroke-linecap="round"/><path class="ink-fill" d="M17.4 4.3 C19.3 4.3 20.7 5.7 20.7 7.4 C20.7 9.5 17.4 12.4 17.4 12.4 C17.4 12.4 14.1 9.5 14.1 7.4 C14.1 5.7 15.5 4.3 17.4 4.3 Z"/><circle cx="17.4" cy="7.3" r="1.05" fill="var(--paper)" stroke="none"/></svg>`,
  // a butterfly — these walls fell, and everything changed
  butterfly:`<svg viewBox="0 0 24 24"><g class="ink" stroke-width="1.1"><path d="M11.4 9.4 C10.6 7.8 9.6 6.8 8.4 6.4"/><path d="M12.6 9.4 C13.4 7.8 14.4 6.8 15.6 6.4"/></g><path class="ink-fill" d="M10.9 11 C8.6 7.6 4.6 6.6 2.9 8.9 C1.6 10.7 3.2 13.2 6.4 13.6 C4 14.3 3.4 16.6 5 18.2 C6.8 20 9.8 18.8 10.9 15.4 Z"/><path class="ink-fill" d="M13.1 11 C15.4 7.6 19.4 6.6 21.1 8.9 C22.4 10.7 20.8 13.2 17.6 13.6 C20 14.3 20.6 16.6 19 18.2 C17.2 20 14.2 18.8 13.1 15.4 Z"/><ellipse cx="12" cy="13" rx="1.15" ry="3.5" fill="currentColor" stroke="none"/><g fill="var(--paper)" stroke="none"><circle cx="6.2" cy="10.6" r="0.9"/><circle cx="17.8" cy="10.6" r="0.9"/></g></svg>`,
  // a stack of gold worth panning for — gold rush
  coins:   `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M4.8 15.2 V17.2 A5.6 2 0 0 0 16 17.2 V15.2 Z"/><ellipse class="ink-fill" cx="10.4" cy="15.2" rx="5.6" ry="2"/><path class="ink-fill" d="M4.8 11.8 V13.8 A5.6 2 0 0 0 16 13.8 V11.8 Z"/><ellipse class="ink-fill" cx="10.4" cy="11.8" rx="5.6" ry="2"/><path class="ink-fill" d="M4.8 8.4 V10.4 A5.6 2 0 0 0 16 10.4 V8.4 Z"/><ellipse class="ink-fill" cx="10.4" cy="8.4" rx="5.6" ry="2"/><path d="M10.4 7.3 L10.9 8.1 L11.8 8.4 L10.9 8.7 L10.4 9.5 L9.9 8.7 L9 8.4 L9.9 8.1 Z" fill="currentColor" stroke="none"/><path class="ink-fill" d="M19.8 3.6 L20.4 5 L21.8 5.6 L20.4 6.2 L19.8 7.6 L19.2 6.2 L17.8 5.6 L19.2 5 Z"/><circle class="ink-fill" cx="18.2" cy="10.2" r="0.6"/></svg>`,
  // five stars strung into a shape — like we're made of starlight
  constellation:`<svg viewBox="0 0 24 24"><g class="ink" stroke-width="1" opacity="0.6"><path d="M4.4 17.2 L9.6 9.6 L13.6 13.8 L18 5.6"/><path d="M13.6 13.8 L20.6 15.4"/></g><path class="ink-fill" d="M4.4 15 L5.2 16.4 L6.6 17.2 L5.2 18 L4.4 19.4 L3.6 18 L2.2 17.2 L3.6 16.4 Z"/><path class="ink-fill" d="M9.6 7.9 L10.2 9 L11.3 9.6 L10.2 10.2 L9.6 11.3 L9 10.2 L7.9 9.6 L9 9 Z"/><path class="ink-fill" d="M13.6 12.3 L14.1 13.3 L15.1 13.8 L14.1 14.3 L13.6 15.3 L13.1 14.3 L12.1 13.8 L13.1 13.3 Z"/><path class="ink-fill" d="M18 3.2 L18.9 4.7 L20.4 5.6 L18.9 6.5 L18 8 L17.1 6.5 L15.6 5.6 L17.1 4.7 Z"/><path class="ink-fill" d="M20.6 13.6 L21.2 14.8 L22.4 15.4 L21.2 16 L20.6 17.2 L20 16 L18.8 15.4 L20 14.8 Z"/></svg>`,
  // a peak mirrored in still water — the lakes
  lake:    `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M4.6 11.8 L9.6 4.2 L12.8 9 L15 5.8 L19.4 11.8 Z"/><path d="M8.5 5.9 L9.6 4.2 L10.7 5.9 Z" fill="var(--paper)" stroke="none"/><path class="ink" stroke-width="1.5" d="M2.6 12.9 H21.4"/><path class="ink-fill" opacity="0.45" d="M5.4 14 L9.6 19.8 L12.6 15.6 L14.6 18.2 L18.6 14 Z"/><g class="ink" stroke-width="1" opacity="0.5"><path d="M4.6 15.6 H7.8"/><path d="M16 17 H19.4"/></g></svg>`,
  // an anchor set — stayed, stayed, stayed
  anchor:  `<svg viewBox="0 0 24 24"><circle cx="12" cy="4.1" r="1.5" fill="none" stroke="currentColor" stroke-width="1.5"/><rect class="ink-fill" x="8" y="6.9" width="8" height="1.8" rx="0.9"/><path class="ink" stroke-width="1.7" d="M12 5.6 V18"/><path class="ink" stroke-width="1.7" fill="none" d="M4.6 13.2 C4.6 17.6 7.8 20.4 12 20.4 C16.2 20.4 19.4 17.6 19.4 13.2"/><path class="ink-fill" d="M4.9 12.2 L2.8 14.6 L6.2 15 Z"/><path class="ink-fill" d="M19.1 12.2 L21.2 14.6 L17.8 15 Z"/></svg>`,

  /* ---- Challenge flourish charms (win the hard way) ---- */
  // the impostor's horned bead behind a bold no sign, refused every single time
  nosign:  `<svg viewBox="0 0 24 24"><circle class="ink-fill" cx="12" cy="12.6" r="4.4"/><path class="ink-fill" d="M8.9 10.2 L7.4 6.6 L10.7 8.5 Z"/><path class="ink-fill" d="M15.1 10.2 L16.6 6.6 L13.3 8.5 Z"/><g fill="currentColor" stroke="none"><circle cx="10.4" cy="12.2" r="0.75"/><circle cx="13.6" cy="12.2" r="0.75"/></g><circle class="ink" fill="none" stroke-width="1.8" cx="12" cy="12" r="9.4"/><path class="ink" stroke-width="1.8" d="M5.4 5.4 L18.6 18.6"/></svg>`,
  // hook, line and sinker, the very first bait swallowed whole
  hooked:  `<svg viewBox="0 0 24 24"><circle cx="15.8" cy="3" r="1.2" fill="none" stroke="currentColor" stroke-width="1.2"/><path class="ink" stroke-width="1.7" fill="none" d="M15.8 4.2 V13.4 a4.9 4.9 0 0 1 -9.8 0 V11"/><path class="ink-fill" d="M6 11.6 L4.7 8.7 L7.7 9.9 Z"/><circle class="ink-fill" cx="6.6" cy="5.8" r="2.4"/><path class="ink-fill" d="M5 4.6 L4.3 2.6 L6.2 3.6 Z"/><path class="ink-fill" d="M8.2 4.6 L8.9 2.6 L7 3.6 Z"/><g fill="currentColor" stroke="none"><circle cx="5.8" cy="5.6" r="0.55"/><circle cx="7.4" cy="5.6" r="0.55"/></g></svg>`,
  // one golden thread pulled through every line on the page
  thread:  `<svg viewBox="0 0 24 24"><g class="ink" stroke-width="1.2" opacity="0.5"><path d="M3.6 7.4 H20.4"/><path d="M3.6 12.2 H20.4"/><path d="M3.6 17 H20.4"/></g><path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" d="M4.6 21.4 C9.8 19.8 5.6 15.4 9.6 13 C13.2 10.8 10.6 8.6 14 6.4"/><path class="ink-fill" stroke-width="0.9" d="M13.5 7.7 L19.3 1.9 C20.3 2.5 20.7 3.5 20.2 4.6 L14.6 8.8 Z"/><circle cx="19.2" cy="3.3" r="0.7" fill="var(--paper)" stroke="none"/></svg>`,
  // two steps already past the door before it ever turned
  twosteps:`<svg viewBox="0 0 24 24"><circle class="ink" fill="none" stroke-width="1.5" cx="7.6" cy="15.6" r="5.4"/><g class="ink" stroke-width="1.1"><path d="M7.6 10.2 V21"/><path d="M2.2 15.6 H13"/></g><path class="ink" stroke-width="1.5" fill="none" d="M3.6 7 C8.2 2.2 14.6 2.4 18.4 5.8"/><path class="ink-fill" d="M17.9 3.9 L21 7.6 L16.7 7.7 Z"/><circle class="ink-fill" cx="8.6" cy="3.9" r="1.15"/><circle class="ink-fill" cx="13.4" cy="4" r="1.15"/></svg>`,
  // every brick where it was left, the heart kept safe behind
  wall:    `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M3.4 21 V10.2 H6.6 V7.6 H9.8 V10.2 H14.2 V7.6 H17.4 V10.2 H20.6 V21 Z"/><g stroke="currentColor" stroke-width="1" fill="none"><path d="M3.4 13.8 H20.6"/><path d="M3.4 17.4 H20.6"/><path d="M8.6 10.4 V13.8"/><path d="M15.4 10.4 V13.8"/><path d="M6 13.8 V17.4"/><path d="M12 13.8 V17.4"/><path d="M18 13.8 V17.4"/><path d="M9 17.4 V21"/><path d="M15 17.4 V21"/></g><path class="ink-fill" d="M12 5.9 C9.7 4.2 10.4 1.9 12 3 C13.6 1.9 14.3 4.2 12 5.9 Z"/></svg>`,
  // a single-digit sliver left on the watch, and still every page fell
  stopwatch:`<svg viewBox="0 0 24 24"><rect class="ink-fill" x="10.6" y="1.6" width="2.8" height="2.6" rx="0.6"/><path class="ink" stroke-width="1.4" d="M17.8 6.2 L19.4 4.6"/><circle class="ink-fill" cx="12" cy="13.4" r="8.2"/><circle cx="12" cy="13.4" r="6.4" fill="var(--paper)" stroke="none"/><path class="ink-fill" stroke-width="0.9" d="M12 13.4 V7 A6.4 6.4 0 0 1 15.2 7.9 Z"/><g class="ink" stroke-width="1"><path d="M12 18.6 V19.8"/><path d="M7.2 13.4 H6"/><path d="M16.8 13.4 H18"/></g><path class="ink" stroke-width="1.5" d="M12 13.4 L14.7 8.4"/><circle cx="12" cy="13.4" r="0.8" fill="currentColor" stroke="none"/></svg>`,
  // the sea held open, a dry path straight through the middle
  partedsea:`<svg viewBox="0 0 24 24"><path class="ink-fill" d="M2.4 4.4 H8.4 C10 6.9 10 9.5 8.6 12 C7.4 14.2 7.4 16.8 8.8 19.6 H2.4 Z"/><path class="ink-fill" d="M21.6 4.4 H15.6 C14 6.9 14 9.5 15.4 12 C16.6 14.2 16.6 16.8 15.2 19.6 H21.6 Z"/><g stroke="currentColor" stroke-width="1" fill="none" opacity="0.8"><path d="M4.4 7.2 C5.4 7.8 6.1 8.7 6.4 9.8"/><path d="M4.4 13.4 C5.4 14 6.1 14.9 6.4 16"/><path d="M19.6 7.2 C18.6 7.8 17.9 8.7 17.6 9.8"/><path d="M19.6 13.4 C18.6 14 17.9 14.9 17.6 16"/></g><path class="ink" stroke-width="1.3" stroke-dasharray="2 2.2" d="M12 4.8 V19.2"/></svg>`,
  // the tape worn soft from singing every word along
  cassette:`<svg viewBox="0 0 24 24"><rect class="ink-fill" x="2.6" y="4.8" width="18.8" height="14.4" rx="1.6"/><rect x="5.8" y="7.6" width="12.4" height="5.6" rx="2.8" fill="var(--paper)" stroke="none"/><g class="ink" stroke-width="1.2" fill="none"><circle cx="8.9" cy="10.4" r="1.7"/><circle cx="15.1" cy="10.4" r="1.7"/><path d="M10.6 10.4 H13.4"/></g><path d="M8.4 16.3 L9.3 19.2 H14.7 L15.6 16.3 Z" fill="var(--paper)" stroke="none"/><g fill="var(--paper)" stroke="none"><circle cx="4.5" cy="6.6" r="0.55"/><circle cx="19.5" cy="6.6" r="0.55"/></g></svg>`,
  // two cherries off one stem, both songs on every page
  cherries:`<svg viewBox="0 0 24 24"><g class="ink" stroke-width="1.4" fill="none"><path d="M12.6 3 C10.2 6.2 8.6 9.6 8.1 13.2"/><path d="M12.6 3 C14.2 6.6 15.1 10 15.3 13.6"/></g><ellipse class="ink-fill" cx="15.5" cy="4.3" rx="2.6" ry="1.1" transform="rotate(26 15.5 4.3)"/><circle class="ink-fill" cx="7.8" cy="16.2" r="3.2"/><circle class="ink-fill" cx="15.6" cy="16.6" r="3.2"/><g fill="var(--paper)" stroke="none"><circle cx="6.7" cy="15.1" r="0.8"/><circle cx="14.5" cy="15.5" r="0.8"/></g></svg>`,

  /* ---- Study charms ---- */
  // the calendar turned back to a winter page
  december:`<svg viewBox="0 0 24 24"><rect class="ink-fill" x="4.4" y="4.2" width="15.2" height="16.6" rx="1.5"/><g class="ink" stroke-width="1.5"><path d="M8.6 2 V6.2"/><path d="M15.4 2 V6.2"/></g><path d="M4.4 8.6 H19.6" stroke="currentColor" stroke-width="1.1" fill="none"/><g stroke="currentColor" stroke-width="1.05" fill="none" stroke-linecap="round"><path d="M12 10.6 V18.2"/><path d="M8.7 12.5 L15.3 16.3"/><path d="M15.3 12.5 L8.7 16.3"/><path d="M10.9 11.7 L12 12.7 L13.1 11.7"/><path d="M10.9 17.1 L12 16.1 L13.1 17.1"/></g></svg>`,
  // the keepsake box open for one more word that stayed
  keepsake:`<svg viewBox="0 0 24 24"><path class="ink-fill" d="M4.4 13.2 L17.6 7 L18.8 9.6 L5.6 15.8 Z"/><rect class="ink-fill" x="4.6" y="13.6" width="14.8" height="7.4" rx="1.2"/><path d="M12.2 19.4 C10.2 17.9 10.8 16.1 12.2 17 C13.6 16.1 14.2 17.9 12.2 19.4 Z" fill="currentColor" stroke="none"/><path class="ink-fill" d="M17.4 1.8 L18.1 3.3 L19.6 4 L18.1 4.7 L17.4 6.2 L16.7 4.7 L15.2 4 L16.7 3.3 Z"/><g class="ink" stroke-width="1.1"><path d="M16.2 7.4 L15.2 9.4"/><path d="M19 7.8 L18.4 9.6"/></g></svg>`,
  // cap and tassel, a whole class graduated in one day
  mortarboard:`<svg viewBox="0 0 24 24"><path class="ink-fill" d="M7.2 10.4 V14.6 C7.2 16.6 16.8 16.6 16.8 14.6 V10.4 L12 12.6 Z"/><path class="ink-fill" d="M12 3.4 L21.8 7.9 L12 12.4 L2.2 7.9 Z"/><circle class="ink-fill" cx="12" cy="7.4" r="0.9"/><path class="ink" stroke-width="1.3" fill="none" d="M12 7.6 C16.6 7.9 19.6 9.8 19.9 14"/><circle class="ink-fill" cx="19.9" cy="15.4" r="1.25"/><g class="ink" stroke-width="1"><path d="M19.3 16.5 L19 17.9"/><path d="M20.5 16.5 L20.8 17.9"/></g></svg>`,
};

/* ---------- Challenge wax seals ----------
   Every challenge's icon is a red sealing-wax stamp with its motif pressed in relief,
   echoing the notebook's red margin rule. Realistic matte wax (sheen, never gloss):
   turbulence-displaced blob, diffuse-lit grain, a crisp circular die with beaded border
   and engraved ring, rim relief following the blob's own outline, pinhole bubbles and a
   two-layer contact shadow. The die motif is the only thing that changes per seal.
   Motifs are bold filled silhouettes (roughly 30 units across, centred on 32,32) designed
   from each challenge's name + rule description. fr is the motif's fill-rule: "evenodd"
   for plain cutouts, "nonzero" where overlapping subpaths must union (holes are then cut
   by reversing a subpath's winding). */
const WAX_SEAL_MOTIFS = {
  // a circle dissolving into scattering dots: the word vanishing before your eyes
  "vanishing-word": { fr: "nonzero", d: "M32 19 A13 13 0 0 0 32 45 Z M37.5 22.5 m-2.7 0 a2.7 2.7 0 1 1 5.4 0 a2.7 2.7 0 1 1 -5.4 0 M40 32 m-3.1 0 a3.1 3.1 0 1 1 6.2 0 a3.1 3.1 0 1 1 -6.2 0 M37.5 41.5 m-2.7 0 a2.7 2.7 0 1 1 5.4 0 a2.7 2.7 0 1 1 -5.4 0 M43.5 25.5 m-1.7 0 a1.7 1.7 0 1 1 3.4 0 a1.7 1.7 0 1 1 -3.4 0 M44.8 36.5 m-1.6 0 a1.6 1.6 0 1 1 3.2 0 a1.6 1.6 0 1 1 -3.2 0 M46.7 31 m-1.1 0 a1.1 1.1 0 1 1 2.2 0 a1.1 1.1 0 1 1 -2.2 0" },
  // a vinyl record, label and spindle hole pressed in: one single album
  "deep-cut": { fr: "nonzero", d: "M18.5 32 a13.5 13.5 0 1 1 27 0 a13.5 13.5 0 1 1 -27 0 M23.7 32 a8.3 8.3 0 1 0 16.6 0 a8.3 8.3 0 1 0 -16.6 0 M25.7 32 a6.3 6.3 0 1 1 12.6 0 a6.3 6.3 0 1 1 -12.6 0 M30.2 32 a1.8 1.8 0 1 0 3.6 0 a1.8 1.8 0 1 0 -3.6 0" },
  // an A-to-Z monogram, the classic wax-seal treatment for an alphabetical rule
  "alphabetical": { fr: "nonzero", d: "M25.5 21.5 L31 31.5 H27.9 L25.5 26.6 L23.1 31.5 H20 Z M22.1 28.4 H28.9 L29.6 30.3 H21.4 Z M34 30.5 H43 V33 L37.6 39.9 H43.2 V42.4 H33.8 V39.9 L39.2 33 H34 Z" },
  // a word as three bars, warping more with every line until it breaks apart
  "word-modifiers": { fr: "nonzero", d: "M22 22.5 H42 V26 H22 Z M22 30.5 C26 28.5 28 32.5 32 30.5 C36 28.5 38 32.5 42 30.5 L42 34 C38 36 36 32 32 34 C28 36 26 32 22 34 Z M21.5 39 C25 36.5 28 41.5 31 39 L31 42.5 C28 45 25 40 21.5 42.5 Z M34 38.5 C37 36 40 41 43.5 38.5 L43.5 42 C40 44.5 37 39.5 34 41.5 Z" },
  // one lone song: a single bold eighth note
  "one-of-a-kind": { fr: "nonzero", d: "M24.2 40.4 a4.2 4.2 0 1 1 8.4 0 a4.2 4.2 0 1 1 -8.4 0 M31.4 22.6 H34 V40.4 H31.4 Z M34 22.6 C39 24.6 40.6 28.5 39.4 33.1 C38.5 30.3 36.7 28.7 34 28.1 Z" },
  // a forking road: one path in, two ways out
  "choose-your-path": { fr: "nonzero", d: "M30 46 V37.2 L22 24.6 A2.7 2.7 0 0 1 26.4 21.9 L32 31.2 L37.6 21.9 A2.7 2.7 0 0 1 42 24.6 L34 37.2 V46 Z" },
  // a tilted playing card with a question mark: the rule you can't predict
  "wildcard": { fr: "evenodd", d: "M22.6 23.8 L37.3 20.7 L41.4 40.2 L26.7 43.3 Z M28.3 29.5 A4.2 4.2 0 1 1 34.5 32.4 L33.4 30.5 A1.9 1.9 0 1 0 30.6 29.1 Z M31.8 32.8 L33.9 32.6 L34.1 35.4 L32 35.6 Z M31.4 38.7 a1.6 1.6 0 1 0 3.2 0 a1.6 1.6 0 1 0 -3.2 0" },
  // a revolving door from above: the ring and its spinning vanes
  "revolving-door": { fr: "evenodd", d: "M19 32 a13 13 0 1 1 26 0 a13 13 0 1 1 -26 0 M21 32 a11 11 0 1 1 22 0 a11 11 0 1 1 -22 0 M30.7 21.5 H33.3 V42.5 H30.7 Z M21.5 30.7 H42.5 V33.3 H21.5 Z M29 32 a3 3 0 1 1 6 0 a3 3 0 1 1 -6 0" },
  // a stopwatch nearly empty, only a thin wedge of time left
  "shrinking-timer": { fr: "nonzero", d: "M21.7 34.2 a10.3 10.3 0 1 1 20.6 0 a10.3 10.3 0 1 1 -20.6 0 M24.3 34.2 a7.7 7.7 0 1 0 15.4 0 a7.7 7.7 0 1 0 -15.4 0 M32 34.2 L32 27.3 A6.9 6.9 0 0 1 37.6 30.9 Z M29.7 20.5 H34.3 V24.2 H29.7 Z" },
  // a title ribbon with the word slotted inside it
  "title-in": { fr: "evenodd", d: "M18.8 27 H45.2 L41.8 32 L45.2 37 H18.8 L22.2 32 Z M24.8 30.7 H39.2 V33.3 H24.8 Z" },
  // a little name tag with a heart: short and sweet
  "short-title": { fr: "evenodd", d: "M22 32 L28 25.5 H40.9 Q42.5 25.5 42.5 27.1 V36.9 Q42.5 38.5 40.9 38.5 H28 Z M25.3 32 a1.5 1.5 0 1 0 3 0 a1.5 1.5 0 1 0 -3 0 M35 35.6 C33 33.8 31.5 32.4 31.5 30.5 C31.5 28.5 33.9 27.9 35 29.7 C36.1 27.9 38.5 28.5 38.5 30.5 C38.5 32.4 37 33.8 35 35.6 Z" },
  // a heart holding a quotation: the lyric line, loved word for word
  "lyric-lover": { fr: "evenodd", d: "M32 45 C25.5 39.5 20.5 35 20.5 28.8 C20.5 22.4 28.4 20.6 32 26 C35.6 20.6 43.5 22.4 43.5 28.8 C43.5 35 38.5 39.5 32 45 Z M29.4 27.6 C31.2 28.3 31.5 30.7 30 33.6 L28.6 33 C29.7 30.8 29.6 29.2 28.8 28.3 Z M35 27.6 C36.8 28.3 37.1 30.7 35.6 33.6 L34.2 33 C35.3 30.8 35.2 29.2 34.4 28.3 Z" },
  // three chain links running corner to corner: each song wrapped onto the last
  "wrapped-chain": { fr: "evenodd", d: "M20.9 26.6 a4.5 4.5 0 1 1 9 0 a4.5 4.5 0 1 1 -9 0 M23.4 26.6 a2 2 0 1 1 4 0 a2 2 0 1 1 -4 0 M27.5 32 a4.5 4.5 0 1 1 9 0 a4.5 4.5 0 1 1 -9 0 M30 32 a2 2 0 1 1 4 0 a2 2 0 1 1 -4 0 M34.1 37.4 a4.5 4.5 0 1 1 9 0 a4.5 4.5 0 1 1 -9 0 M36.6 37.4 a2 2 0 1 1 4 0 a2 2 0 1 1 -4 0" },
  // a stage microphone: every night a different album on cue
  "on-tour": { fr: "nonzero", d: "M31.3 25.5 a5.2 5.2 0 1 1 10.4 0 a5.2 5.2 0 1 1 -10.4 0 M33.85 29.12 L35.95 30.28 L28.05 44.58 L25.95 43.42 Z M22 45.4 a6.5 1.9 0 1 1 13 0 a6.5 1.9 0 1 1 -13 0" },
  // an alarm clock, hands frozen mid-run: the one shared clock
  "its-a-clock": { fr: "nonzero", d: "M22 33.5 a10 10 0 1 1 20 0 a10 10 0 1 1 -20 0 M24.4 33.5 a7.6 7.6 0 1 0 15.2 0 a7.6 7.6 0 1 0 -15.2 0 M31 34.5 V27.8 H33 V32.5 H36.8 V34.5 Z M20.8 24.4 a3.2 3.2 0 1 1 6.4 0 a3.2 3.2 0 1 1 -6.4 0 M36.8 24.4 a3.2 3.2 0 1 1 6.4 0 a3.2 3.2 0 1 1 -6.4 0 M24.4 41.9 L26 42.9 L24.4 45.5 L22.8 44.5 Z M39.6 41.9 L38 42.9 L39.6 45.5 L41.2 44.5 Z" },
  // two arrows trading places: title one page, lyric the next
  "switch-up": { fr: "nonzero", d: "M22 26.2 H36 V23.4 L42.5 28 L36 32.6 V29.8 H22 Z M42 37.8 H28 V35 L21.5 39.6 L28 44.2 V41.4 H42 Z" },
  // two beamed notes: every page wants a pair of songs
  "double-trouble": { fr: "nonzero", d: "M22.4 40.3 a3.5 3.5 0 1 1 7 0 a3.5 3.5 0 1 1 -7 0 M28.2 25.2 H30.2 V40.3 H28.2 Z M34.4 38.3 a3.5 3.5 0 1 1 7 0 a3.5 3.5 0 1 1 -7 0 M40.2 23.5 H42.2 V38.3 H40.2 Z M28.2 25.2 L42.2 23.2 V27.2 L28.2 29.2 Z" },
  // the devil's own fork: a trident with a wavering path for a shaft
  "devils-path": { fr: "nonzero", d: "M24.2 29 H39.8 V31.6 H24.2 Z M24.2 22.3 L25.4 19.7 L26.6 22.3 V29.3 H24.2 Z M30.8 21.4 L32 18.8 L33.2 21.4 V29.3 H30.8 Z M37.4 22.3 L38.6 19.7 L39.8 22.3 V29.3 H37.4 Z M30.7 31.4 H33.3 C32.2 34.4 34.6 36.2 33.5 39.2 C32.7 41.4 34.2 42.8 33.2 45.4 H30.6 C31.6 42.8 30.1 41.4 30.9 39.2 C32 36.2 29.6 34.4 30.7 31.4 Z" },
  // an eye with a lightning-bolt iris: read the flash before it's gone
  "ready-for-it": { fr: "evenodd", d: "M18.5 32 C23 24.5 41 24.5 45.5 32 C41 39.5 23 39.5 18.5 32 Z M34 26.8 L28.4 33.4 H31.6 L30.6 37.2 L35.6 30.7 H32.8 Z" },
  // a house split by a jagged crack: every miss steals from the home clock
  "home-invasion": { fr: "evenodd", d: "M32 19.8 L38.4 25 V21.9 H42 V27.9 L44.6 30 H42.2 V43.4 H21.8 V30 H19.4 Z M31.3 23.2 L33.7 23.2 L31.9 30.4 L34.6 30.4 L29.9 41 L31.1 33.4 L28.5 33.4 Z" },
  // the number itself, stamped like a year on a document seal
  "thirty-one": { fr: "nonzero", d: "M24.5 23 H34.9 V25.7 H24.5 Z M26.3 30.7 H34.9 V33.3 H26.3 Z M24.5 38.3 H34.9 V41 H24.5 Z M32.3 23 H34.9 V41 H32.3 Z M38.7 23 H41.3 V41 H38.7 Z M36.3 26.6 L38.7 23 L38.7 26.6 Z M36.5 38.3 H43.5 V41 H36.5 Z" },
  // a magnifying glass over a tiny tilted scrap of a word
  "smallest-song": { fr: "nonzero", d: "M20.6 28.3 a7.7 7.7 0 1 1 15.4 0 a7.7 7.7 0 1 1 -15.4 0 M22.6 28.3 a5.7 5.7 0 1 0 11.4 0 a5.7 5.7 0 1 0 -11.4 0 M33.1 34.5 L34.5 33.1 L42.9 41.5 L41.5 42.9 Z M25.7 29.9 L30.7 28 L31.2 29.3 L26.2 31.2 Z" },
  // the flag you raise on a fake: a pennant on its pole
  "impostor": { fr: "nonzero", d: "M26.2 20 H28.8 V45.4 H26.2 Z M28.6 20.8 C33.8 22.6 37.9 21.4 42.8 24.6 C38 27.8 33.8 26.6 28.6 28.4 Z" },
  // a song bobbing on open water: fish the right title out of the sea
  "sea-of-songs": { fr: "nonzero", d: "M24.6 30.6 a2.9 2.9 0 1 1 5.8 0 a2.9 2.9 0 1 1 -5.8 0 M30.1 21 H31.9 V30.6 H30.1 Z M31.9 21 C35.4 22.6 36.6 25.4 35.8 28.7 C35.1 26.5 33.8 25.3 31.9 24.9 Z M21.5 34.8 C24.5 32.4 27.5 32.4 30.5 34.8 C33.5 37.2 36.5 37.2 39.5 34.8 C40.6 33.9 41.6 33.3 42.5 33.1 L42.5 35.9 C41.6 36.1 40.6 36.7 39.5 37.6 C36.5 40 33.5 40 30.5 37.6 C27.5 35.2 24.5 35.2 21.5 37.6 Z M21.5 39.8 C24.5 37.4 27.5 37.4 30.5 39.8 C33.5 42.2 36.5 42.2 39.5 39.8 C40.6 38.9 41.6 38.3 42.5 38.1 L42.5 40.9 C41.6 41.1 40.6 41.7 39.5 42.6 C36.5 45 33.5 45 30.5 42.6 C27.5 40.2 24.5 40.2 21.5 42.6 Z" },
  // a needle drawing one thread through everything: the word all three lines share
  "common-thread": { fr: "nonzero", d: "M21.3 43.2 L39 24.4 Q40.5 23 42 24.5 Q43.5 26 42.1 27.5 L23.3 45.2 Z M39.3 25.9 a1.2 1.2 0 1 0 2.4 0 a1.2 1.2 0 1 0 -2.4 0 M41.2 26.3 C45.6 29.7 43.6 35.2 38.3 36 C33.6 36.7 30.9 40 32 44.4 L30.4 44.8 C29 39.4 32.5 35.2 37.7 34.4 C41.9 33.6 43.4 30 40.1 27.4 Z" },
};

// The shared wax recipe. `id` scopes the SVG's internal ids so several seals can
// coexist in one document; the motif is stamped three times (shadow, highlight, face)
// to sit in raised relief on the die.
function waxSealSvg(id, motif) {
  const p = `wax-${id}`;
  return `<svg viewBox="-2 -2 68 68" aria-hidden="true">
    <defs>
      <path id="${p}-blob" d="M32.0 5.5 C36.3 5.6 40.3 8.2 44.6 10.2 C48.9 12.1 55.6 13.5 57.8 17.1 C60.0 20.7 58.7 27.4 58.0 32.0 C57.3 36.6 55.8 40.6 53.7 44.5 C51.6 48.4 49.0 53.1 45.4 55.2 C41.8 57.4 36.4 57.5 32.0 57.4 C27.6 57.3 23.1 56.5 18.9 54.7 C14.7 52.9 9.0 50.4 6.7 46.6 C4.5 42.8 4.8 36.5 5.4 32.0 C6.0 27.5 7.9 23.2 10.2 19.4 C12.4 15.6 15.4 11.8 19.0 9.5 C22.6 7.2 27.7 5.4 32.0 5.5 Z"/>
      <path id="${p}-m" d="${motif.d}" fill-rule="${motif.fr || "nonzero"}"/>
      <path id="${p}-beads" d="M32.0 14.6 m-0.85 0 a0.85 0.85 0 1 0 1.7 0 a0.85 0.85 0 1 0 -1.7 0 M36.2 15.1 m-0.85 0 a0.85 0.85 0 1 0 1.7 0 a0.85 0.85 0 1 0 -1.7 0 M40.1 16.6 m-0.85 0 a0.85 0.85 0 1 0 1.7 0 a0.85 0.85 0 1 0 -1.7 0 M43.5 19.0 m-0.85 0 a0.85 0.85 0 1 0 1.7 0 a0.85 0.85 0 1 0 -1.7 0 M46.3 22.1 m-0.85 0 a0.85 0.85 0 1 0 1.7 0 a0.85 0.85 0 1 0 -1.7 0 M48.3 25.8 m-0.85 0 a0.85 0.85 0 1 0 1.7 0 a0.85 0.85 0 1 0 -1.7 0 M49.3 29.9 m-0.85 0 a0.85 0.85 0 1 0 1.7 0 a0.85 0.85 0 1 0 -1.7 0 M49.3 34.1 m-0.85 0 a0.85 0.85 0 1 0 1.7 0 a0.85 0.85 0 1 0 -1.7 0 M48.3 38.2 m-0.85 0 a0.85 0.85 0 1 0 1.7 0 a0.85 0.85 0 1 0 -1.7 0 M46.3 41.9 m-0.85 0 a0.85 0.85 0 1 0 1.7 0 a0.85 0.85 0 1 0 -1.7 0 M43.5 45.0 m-0.85 0 a0.85 0.85 0 1 0 1.7 0 a0.85 0.85 0 1 0 -1.7 0 M40.1 47.4 m-0.85 0 a0.85 0.85 0 1 0 1.7 0 a0.85 0.85 0 1 0 -1.7 0 M36.2 48.9 m-0.85 0 a0.85 0.85 0 1 0 1.7 0 a0.85 0.85 0 1 0 -1.7 0 M32.0 49.4 m-0.85 0 a0.85 0.85 0 1 0 1.7 0 a0.85 0.85 0 1 0 -1.7 0 M27.8 48.9 m-0.85 0 a0.85 0.85 0 1 0 1.7 0 a0.85 0.85 0 1 0 -1.7 0 M23.9 47.4 m-0.85 0 a0.85 0.85 0 1 0 1.7 0 a0.85 0.85 0 1 0 -1.7 0 M20.5 45.0 m-0.85 0 a0.85 0.85 0 1 0 1.7 0 a0.85 0.85 0 1 0 -1.7 0 M17.7 41.9 m-0.85 0 a0.85 0.85 0 1 0 1.7 0 a0.85 0.85 0 1 0 -1.7 0 M15.7 38.2 m-0.85 0 a0.85 0.85 0 1 0 1.7 0 a0.85 0.85 0 1 0 -1.7 0 M14.7 34.1 m-0.85 0 a0.85 0.85 0 1 0 1.7 0 a0.85 0.85 0 1 0 -1.7 0 M14.7 29.9 m-0.85 0 a0.85 0.85 0 1 0 1.7 0 a0.85 0.85 0 1 0 -1.7 0 M15.7 25.8 m-0.85 0 a0.85 0.85 0 1 0 1.7 0 a0.85 0.85 0 1 0 -1.7 0 M17.7 22.1 m-0.85 0 a0.85 0.85 0 1 0 1.7 0 a0.85 0.85 0 1 0 -1.7 0 M20.5 19.0 m-0.85 0 a0.85 0.85 0 1 0 1.7 0 a0.85 0.85 0 1 0 -1.7 0 M23.9 16.6 m-0.85 0 a0.85 0.85 0 1 0 1.7 0 a0.85 0.85 0 1 0 -1.7 0 M27.8 15.1 m-0.85 0 a0.85 0.85 0 1 0 1.7 0 a0.85 0.85 0 1 0 -1.7 0"/>
      <clipPath id="${p}-cb"><use href="#${p}-blob"/></clipPath>
      <radialGradient id="${p}-g" cx="40%" cy="35%" r="75%">
        <stop offset="0" stop-color="#b8413f"/>
        <stop offset="0.4" stop-color="#a72e33"/>
        <stop offset="0.75" stop-color="#93232a"/>
        <stop offset="1" stop-color="#781a20"/>
      </radialGradient>
      <radialGradient id="${p}-fg" cx="42%" cy="38%" r="70%">
        <stop offset="0" stop-color="#ae363b"/>
        <stop offset="0.6" stop-color="#9c282e"/>
        <stop offset="1" stop-color="#8a2028"/>
      </radialGradient>
      <linearGradient id="${p}-fct" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#cd5c55"/>
        <stop offset="0.45" stop-color="#ad353a"/>
        <stop offset="1" stop-color="#96262d"/>
      </linearGradient>
      <filter id="${p}-b04" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="0.4"/></filter>
      <filter id="${p}-b08" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation="0.8"/></filter>
      <filter id="${p}-b18" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="1.8"/></filter>
      <filter id="${p}-b26" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="2.6"/></filter>
      <filter id="${p}-fx" x="-8%" y="-8%" width="116%" height="116%">
        <feTurbulence type="fractalNoise" baseFrequency="0.11" numOctaves="3" seed="11" result="warp"/>
        <feDisplacementMap in="SourceGraphic" in2="warp" scale="2.2" xChannelSelector="R" yChannelSelector="G" result="disp"/>
        <feTurbulence type="fractalNoise" baseFrequency="0.45" numOctaves="3" seed="5" result="grain"/>
        <feDiffuseLighting in="grain" lighting-color="#ffffff" surfaceScale="1.4" diffuseConstant="1" result="lit">
          <feDistantLight azimuth="235" elevation="55"/>
        </feDiffuseLighting>
        <feComponentTransfer in="lit" result="litsoft">
          <feFuncR type="linear" slope="0.3" intercept="0.76"/>
          <feFuncG type="linear" slope="0.3" intercept="0.76"/>
          <feFuncB type="linear" slope="0.3" intercept="0.76"/>
        </feComponentTransfer>
        <feComposite in="litsoft" in2="disp" operator="in" result="litclip"/>
        <feBlend in="disp" in2="litclip" mode="multiply"/>
      </filter>
    </defs>
    <use href="#${p}-blob" transform="translate(1.7,2.5)" fill="rgba(46,33,25,0.2)" filter="url(#${p}-b26)"/>
    <use href="#${p}-blob" transform="translate(0.6,1.0)" fill="rgba(46,33,25,0.3)" filter="url(#${p}-b08)"/>
    <g filter="url(#${p}-fx)">
      <use href="#${p}-blob" fill="url(#${p}-g)" stroke="rgba(74,13,17,0.6)" stroke-width="0.8"/>
      <use href="#${p}-blob" fill="none" stroke="rgba(60,8,12,0.42)" stroke-width="2.4" filter="url(#${p}-b08)" clip-path="url(#${p}-cb)"/>
      <use href="#${p}-blob" transform="translate(0.8,0.9) translate(32,32) scale(0.9) translate(-32,-32)" fill="none" stroke="rgba(70,10,14,0.42)" stroke-width="1.7" filter="url(#${p}-b08)"/>
      <use href="#${p}-blob" transform="translate(-0.6,-0.7) translate(32,32) scale(0.9) translate(-32,-32)" fill="none" stroke="rgba(250,188,168,0.4)" stroke-width="1.6" filter="url(#${p}-b08)"/>
      <g clip-path="url(#${p}-cb)">
        <ellipse cx="21" cy="17.5" rx="13" ry="8" transform="rotate(-30 21 17.5)" fill="rgba(255,216,198,0.17)" filter="url(#${p}-b18)"/>
        <ellipse cx="44" cy="48" rx="10" ry="5.5" transform="rotate(-25 44 48)" fill="rgba(255,190,170,0.06)" filter="url(#${p}-b18)"/>
      </g>
      <circle cx="32" cy="32" r="20" fill="url(#${p}-fg)"/>
      <path d="M14.7 42.0 A20 20 0 0 0 42.0 14.7" fill="none" stroke="rgba(56,7,10,0.55)" stroke-width="1.2" stroke-linecap="round" filter="url(#${p}-b04)"/>
      <path d="M49.9 21.7 A20.7 20.7 0 0 1 21.7 49.9" fill="none" stroke="rgba(246,182,162,0.38)" stroke-width="1.1" stroke-linecap="round" filter="url(#${p}-b04)"/>
      <circle cx="32" cy="32" r="19.1" fill="none" stroke="rgba(60,8,11,0.42)" stroke-width="0.6"/>
      <circle cx="32" cy="32" r="19.1" transform="translate(0.5,0.55)" fill="none" stroke="rgba(246,184,164,0.28)" stroke-width="0.5"/>
      <use href="#${p}-beads" transform="translate(0.55,0.65)" fill="rgba(56,7,10,0.5)" filter="url(#${p}-b04)"/>
      <use href="#${p}-beads" transform="translate(-0.4,-0.5)" fill="rgba(250,192,172,0.5)"/>
      <use href="#${p}-beads" fill="#b04046"/>
      <use href="#${p}-m" transform="translate(1.05,1.2)" fill="rgba(50,6,9,0.6)" filter="url(#${p}-b04)"/>
      <use href="#${p}-m" transform="translate(-0.6,-0.7)" fill="rgba(252,198,180,0.45)" filter="url(#${p}-b04)"/>
      <use href="#${p}-m" fill="url(#${p}-fct)" stroke="rgba(88,14,18,0.4)" stroke-width="0.4"/>
      <g fill="rgba(56,7,10,0.45)"><circle cx="47.6" cy="46.8" r="0.6"/><circle cx="12.3" cy="24.2" r="0.5"/><circle cx="26.3" cy="52.6" r="0.55"/></g>
      <g fill="rgba(252,198,182,0.5)"><circle cx="47.4" cy="46.5" r="0.22"/><circle cx="12.1" cy="24.0" r="0.18"/><circle cx="26.1" cy="52.35" r="0.2"/></g>
      <path d="M51.8 39.8 q1.3 1.1 0.9 2.7" fill="none" stroke="rgba(70,10,14,0.35)" stroke-width="0.9" stroke-linecap="round"/>
      <path d="M14.6 14.8 q-1.2 1.1 -0.8 2.6" fill="none" stroke="rgba(70,10,14,0.35)" stroke-width="0.9" stroke-linecap="round"/>
    </g>
  </svg>`;
}

export const CHALLENGE_SEALS = Object.fromEntries(
  Object.keys(WAX_SEAL_MOTIFS).map((id) => [id, waxSealSvg(id, WAX_SEAL_MOTIFS[id])])
);
export const ACHIEVEMENTS = [
  { id: "enchanted",        name: "Enchanted",        desc: "Finish your first game",              secret: false, icon: "wand" },
  { id: "mastermind",       name: "Mastermind",       desc: "Score a perfect 13/13",               secret: false, icon: "queen" },
  { id: "fearless",         name: "Fearless",         desc: "Finish with no timeouts",             secret: false, icon: "dress" },
  { id: "speak-now",        name: "Speak Now",        desc: "Answer correctly in under 2s",        secret: false, icon: "speech" },
  { id: "begin-again",      name: "Begin Again",      desc: "Play 5 games",                        secret: false, icon: "tally" },
  { id: "getaway-car",      name: "Getaway Car",      desc: "Answer correctly with under 1s left", secret: true,  icon: "car" },
  { id: "bejeweled",        name: "Bejeweled",        desc: "Hit a 5-in-a-row streak",             secret: true,  icon: "strand" },
  { id: "long-story-short", name: "Long Story Short", desc: "Come back to finish on a 5+ streak",  secret: true,  icon: "scribbleline" },
  { id: "today-was-a-fairytale", name: "Today Was A Fairytale", desc: "Finish your first Daily Challenge", secret: false, icon: "slipper" },
  { id: "all-too-well",     name: "All Too Well",     desc: "Finish a full Lyricist game",          secret: false, icon: "scarf" },
  { id: "champagne-problems", name: "Champagne Problems", desc: "Finish one shy — 12/13",            secret: true,  icon: "flute" },
  { id: "anti-hero",        name: "Anti-Hero",        desc: "Score 0/13",                          secret: true,  icon: "mirror" },
  { id: "hits-different",   name: "Hits Different",   desc: "Play all three game types",           secret: false, icon: "shapes" },
  { id: "fifteen",          name: "Fifteen",          desc: "Play 15 games",                       secret: false, icon: "locker" },
  { id: "you-knew-the-line", name: "You Knew The Line", desc: "Recall 5 lyric lines in one game",  secret: true,  icon: "note" },
  { id: "out-of-the-woods", name: "Out Of The Woods", desc: "Survive 20+ rounds in Infinite",      secret: false, icon: "pines" },
  { id: "twenty-two",       name: "22",               desc: "Reach exactly round 22 in Infinite",  secret: false, icon: "balloons" },
  { id: "sparks-fly",       name: "Sparks Fly",       desc: "Hit a 10-in-a-row streak",            secret: true,  icon: "sparkler" },
  { id: "great-war",        name: "The Great War",    desc: "Win an Ultra game — 10+ correct",     secret: false, icon: "poppy" },
  { id: "long-live",        name: "Long Live",        desc: "Perfect 13/13 on Hard or Ultra",      secret: true,  icon: "coronet" },
  { id: "ready-for-it",     name: "…Ready For It?",   desc: "Nail round 1 in under 2s",            secret: false, icon: "rocket" },
  { id: "i-did-something-bad", name: "I Did Something Bad", desc: "Answer right with under 0.5s left", secret: true, icon: "match" },
  { id: "branch-out",       name: "Time To Branch Out?", desc: "3 correct in a row from one album", secret: true, icon: "branch" },
  { id: "eras-tour",        name: "The Eras Tour",    desc: "Score from nearly every studio album in one game", secret: true, icon: "ticket" },
  { id: "daylight",         name: "Daylight",         desc: "Score a perfect Daily",               secret: true,  icon: "sunrise" },
  { id: "story-of-us",      name: "The Story Of Us",  desc: "Keep a 7-day Daily streak",           secret: false, icon: "openbook" },
  { id: "evermore",         name: "Evermore",         desc: "Reach a 30-day Daily streak",         secret: true,  icon: "sprig" },
  { id: "karma",            name: "Karma",            desc: "Earn 13 achievements",                secret: false, icon: "cat" },
  { id: "midnights",        name: "Midnights",        desc: "Play between 12 and 1am",             secret: true,  icon: "clock" },
  { id: "shake-it-off",     name: "Shake It Off",     desc: "Bounce back from a miss 3× in one game", secret: false, icon: "bounce" },
  { id: "peace",            name: "Peace",            desc: "Finish a game without the timer hitting the red",  secret: true, icon: "dove" },
  { id: "perfect-storm",    name: "Perfect Storm",    desc: "Average under 3s per answer in a game", secret: true, icon: "storm" },
  { id: "the-triangle",     name: "The Triangle",     desc: "Answer cardigan, betty and august in one game", secret: true, icon: "trihearts" },
  { id: "my-mind-is-alive", name: "My Mind Is Alive", desc: "3 correct in a row — titles starting with B", secret: true, icon: "bee" },
  { id: "cruel-summer",     name: "Cruel Summer",     desc: "Lose all 3 lives in the first 4 rounds", secret: true, icon: "lolly" },
  { id: "i-cant-see-you",   name: "I Can't See You",  desc: "Finish a game without answering once", secret: true, icon: "blindfold" },
  { id: "thousand-cuts",    name: "Death By A Thousand Cuts", desc: "1,000 lifetime missed rounds", secret: true, icon: "scissors" },
  { id: "holy-ground",      name: "Holy Ground",      desc: "Reach round 13 from scratch in Infinite", secret: true, icon: "rays" },
  { id: "spicy-drama",      name: "Spicy Drama",      desc: "Answer with \"If This Was A Movie\" — Fearless or Speak Now? Fans still argue", secret: true, icon: "clapper" },
  { id: "word-for-word",    name: "Word For Word",    desc: "Recall a lyric line word-perfect",     secret: true,  icon: "quote" },
  { id: "i-look-in-windows", name: "I Look In People's Windows", desc: "Open the settings menu",      secret: true,  icon: "window" },
  { id: "look-what-you-made-me-do", name: "Look What You Made Me Do", desc: "Make the snake appear",  secret: true,  icon: "snake" },
  { id: "snow-on-the-beach",   name: "Snow On The Beach",   desc: "Watch the snow fall on the page",        secret: true,  icon: "palm" },
  { id: "midnight-rain",       name: "Midnight Rain",       desc: "Keep the page company past midnight",    secret: true,  icon: "nightrain" },
  { id: "autumn-leaves-falling", name: "Autumn Leaves Falling", desc: "Watch the autumn leaves fall on the page", secret: true, icon: "placeholder" },
  { id: "safe-and-sound",   name: "Safe & Sound",     desc: "Play Easy three times in a row",       secret: false, icon: "lantern" },
  { id: "revenge",          name: "R-E-V-E-N-G-E",    desc: "Beat your own best score on any board", secret: false, icon: "megaphone" },
  { id: "mirrorball",       name: "Mirrorball",       desc: "Score a perfect 13/13 in every difficulty", secret: true, icon: "mirrorball" },
  { id: "diamonds",         name: "Diamonds Are Forever", desc: "3 rare words right in a row (no Ultra)", secret: true, icon: "diamond" },
  { id: "wordsmith",        name: "Wordsmith",        desc: "Win a round on a fuzzy lyric match",    secret: true,  icon: "anvil" },
  { id: "got-you-down",     name: "I've Got You Down", desc: "Recall 10 lyric lines word-perfect",   secret: false, icon: "pencil" },
  { id: "by-heart",         name: "I Know You By Heart", desc: "Recall 50 lyric lines word-perfect", secret: false, icon: "locket" },
  { id: "where-i-start",    name: "You Don't Even Know Where I Start", desc: "Recall 100 lyric lines word-perfect", secret: false, icon: "spiral" },
  { id: "clearly-ready",    name: "…Clearly You Were Ready For It?", desc: "Recall 1,000 lyric lines word-perfect", secret: true, icon: "trophy" },
  { id: "overachiever",     name: "Overachiever",     desc: "Recall a whole verse — four lines word-perfect", secret: true, icon: "aplus" },
  { id: "fav-song",         name: "Someone Has A Favourite Song", desc: "Answer three rounds with lyrics from the same song", secret: true, icon: "repeat" },
  { id: "eyes-closed",      name: "Eyes Closed",      desc: "10 fuzzy lyric matches in one Lyricist game", secret: true, icon: "eyeclosed" },
  { id: "paris",            name: "Paris",            desc: "Answer “Paris” when the word is “somewhere”", secret: true, icon: "tower" },
  { id: "i-hate-it-here",   name: "I Hate It Here",   desc: "Answer every song in the catalogue at least once", secret: false, icon: "checklist" },
  { id: "raining-monday",   name: "It's Raining And It's Monday", desc: "Answer “rain” correctly on a Monday", secret: true, icon: "umbrella" },
  { id: "clean",            name: "Clean",            desc: "Win without hints or a single timeout",  secret: false, icon: "drop" },
  { id: "everything-nothing", name: "Everything & Nothing All At Once", desc: "Win a game in every difficulty", secret: false, icon: "yinyang" },
  { id: "fearless-tv",      name: "Fearless (Taylor's Version)", desc: "Two games in a row with no timeouts", secret: false, icon: "vinyl" },
  { id: "piano-was-hissing", name: "The Piano Was Hissing", desc: "Type “reputation tv” somewhere",    secret: true,  icon: "piano" },
  { id: "the-bolter",       name: "The Bolter",       desc: "Quit before typing anything in round 1", secret: true,  icon: "door" },
  { id: "no-closure",       name: "No Closure",       desc: "Give up after 12 — never answer the 13th", secret: true, icon: "unclasped" },
  { id: "the-archer",       name: "The Archer",       desc: "Defeat your first challenge",           secret: false, icon: "bow" },
  { id: "the-alchemy",      name: "The Alchemy",      desc: "Defeat every challenge",                secret: false, icon: "flask" },
  { id: "paper-rings",      name: "Paper Rings",      desc: "Unlock every challenge",                secret: false, icon: "rings" },
  { id: "state-of-grace",   name: "State Of Grace",   desc: "Defeat a challenge on the first try",   secret: true,  icon: "feather" },
  { id: "this-is-me-trying", name: "This Is Me Trying", desc: "Defeat a challenge after 5+ attempts", secret: true, icon: "crumple" },
  { id: "shouldve-said-no",  name: "Should've Said No",  desc: "Defeat Impostor flawlessly — every impostor flagged, every real word named", secret: false, icon: "nosign" },
  { id: "smallest-man",      name: "The Smallest Man Who Ever Lived", desc: "Fall for the very first impostor you meet", secret: true, icon: "hooked" },
  { id: "invisible-string",  name: "Invisible String",  desc: "Defeat Common Thread: pull the word through every line", secret: false, icon: "thread" },
  { id: "two-steps-ahead",   name: "Two Steps Ahead",   desc: "Beat Revolving Door before a single swap — every answer on the first word", secret: true, icon: "twosteps" },
  { id: "walls-stood-tall",  name: "My Walls Stood Tall", desc: "Win Home Invasion untouched — the clock never once shrinks", secret: true, icon: "wall" },
  { id: "tick-tock",         name: "Tick-Tock",         desc: "Win Shrinking Timer, clearing every page once the clock hits single digits", secret: true, icon: "stopwatch" },
  { id: "part-the-sea",      name: "Part The Sea",      desc: "Win Sea of Songs without ever tapping a decoy", secret: true, icon: "partedsea" },
  { id: "knowing-all-the-words", name: "Knowing All The Words", desc: "Win Lyric Lover with every line word-perfect — no fuzzy recalls", secret: true, icon: "cassette" },
  { id: "two-is-better",     name: "Two Is Better Than One", desc: "Clear all thirteen pages of Double Trouble — two songs each, none dropped", secret: true, icon: "cherries" },
  { id: "blank-space",       name: "Blank Space",       desc: "Win Vanishing Word writing blind — every answer landed after the word had gone", secret: true, icon: "vanish" },
  { id: "you-belong-with-me", name: "You Belong With Me", desc: "Win Deep Cut loyal to one album — every correct answer of the run off the same record", secret: true, icon: "heartlabel" },
  { id: "tied-together",     name: "Tied Together With A Smile", desc: "Win From A to Z on a chain that climbs every link — never twice on the same letter", secret: true, icon: "ribbon" },
  { id: "the-lakes",        name: "The Lakes",        desc: "Climb to the Rarest tier in Adaptive",  secret: false, icon: "lake" },
  { id: "stay-stay-stay",   name: "Stay Stay Stay",   desc: "Reach Rarest and finish there without slipping", secret: true, icon: "anchor" },
  { id: "a-place-in-this-world", name: "A Place In This World", desc: "Beat your first album in Album Focus", secret: false, icon: "map" },
  { id: "change",           name: "Change",           desc: "Beat all 12 albums in Album Focus",     secret: false, icon: "butterfly" },
  { id: "gold-rush",        name: "Gold Rush",        desc: "Perfect an album in Album Focus — 13/13", secret: true,  icon: "coins" },
  { id: "starlight",        name: "Starlight",        desc: "Perfect all 12 albums in Album Focus",  secret: true,  icon: "constellation" },
  { id: "back-to-december", name: "Back To December", desc: "Finish your first Study session",       secret: false, icon: "december" },
  { id: "stay-beautiful",   name: "Stay Beautiful",   desc: "Settle 25 words into the top review box", secret: false, icon: "keepsake" },
  { id: "the-best-day",     name: "The Best Day",     desc: "Graduate 5 words in a single Study session", secret: true, icon: "mortarboard" },
  { id: "you-took-a-polaroid-of-us", name: "You Took A Polaroid Of Us", desc: "Find every polaroid keepsake", secret: true, icon: "polaroid" },
  { id: "is-it-over-now",   name: "Is It Over Now?",  desc: "Earn every hidden achievement",         secret: true,  icon: "hourglass" },
  { id: "the-lucky-one",    name: "The Lucky One",    desc: "Earn every other achievement",          secret: true,  icon: "clover" },
];
export const ACH_BY_ID = Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a]));

// Achievements are shown grouped by theme on the Charm Collection page. Order here is
// the section order. The final "Secret charms" section is render-only (not a group).
export const ACH_GROUPS = [
  { id: "core",      label: "Core",                   short: "Core" },
  { id: "daily",     label: "Daily challenge",        short: "Daily" },
  { id: "infinite",  label: "Infinite mode",          short: "Infinite" },
  { id: "lyricist",  label: "Lyricist & lyric lines", short: "Lyricist" },
  { id: "catalogue", label: "Catalogue knowledge",    short: "Catalogue" },
  { id: "challenges", label: "Challenges",             short: "Challenge" },
  { id: "albumFocus", label: "Album Focus",            short: "Album" },
  { id: "adaptive",  label: "Adaptive mode",          short: "Adaptive" },
  { id: "study",     label: "Study mode",             short: "Study" },
];
// One muted notebook hue per theme — the section dots and the by-theme breakdown bars.
export const ACH_GROUP_COLORS = {
  core:      "#c8951f",
  daily:     "#3f7d6e",
  infinite:  "#2f4d7a",
  lyricist:  "#9b6b9e",
  catalogue: "#b23a3a",
  challenges: "#2b2722",
  albumFocus: "#a8577a",
  adaptive:  "#7d5a3f",
  study:     "#7a9e5e",
};
// Membership: only the non-core ids are listed; everything else defaults to "core"
// (groupOf in app.js). Keeps this in sync without re-listing every achievement.
export const ACH_GROUP_OF = {
  "today-was-a-fairytale": "daily", "daylight": "daily", "story-of-us": "daily", "evermore": "daily",
  "out-of-the-woods": "infinite", "twenty-two": "infinite", "long-story-short": "infinite",
  "cruel-summer": "infinite", "holy-ground": "infinite",
  "all-too-well": "lyricist", "you-knew-the-line": "lyricist", "word-for-word": "lyricist",
  "wordsmith": "lyricist", "eyes-closed": "lyricist",
  "got-you-down": "lyricist", "by-heart": "lyricist", "where-i-start": "lyricist",
  "clearly-ready": "lyricist", "overachiever": "lyricist", "fav-song": "lyricist",
  "branch-out": "catalogue", "eras-tour": "catalogue", "the-triangle": "catalogue",
  "my-mind-is-alive": "catalogue", "thousand-cuts": "catalogue", "spicy-drama": "catalogue",
  "diamonds": "catalogue", "paris": "catalogue", "i-hate-it-here": "catalogue",
  "the-archer": "challenges", "the-alchemy": "challenges", "paper-rings": "challenges",
  "state-of-grace": "challenges", "this-is-me-trying": "challenges",
  "shouldve-said-no": "challenges", "smallest-man": "challenges", "invisible-string": "challenges",
  "two-steps-ahead": "challenges", "walls-stood-tall": "challenges", "tick-tock": "challenges",
  "part-the-sea": "challenges", "knowing-all-the-words": "challenges", "two-is-better": "challenges",
  "blank-space": "challenges", "you-belong-with-me": "challenges", "tied-together": "challenges",
  "a-place-in-this-world": "albumFocus", "change": "albumFocus", "gold-rush": "albumFocus", "starlight": "albumFocus",
  "the-lakes": "adaptive", "stay-stay-stay": "adaptive",
  "back-to-december": "study", "stay-beautiful": "study", "the-best-day": "study",
};

/* ---------- Easter-egg art ---------- */
export const PEN_SVG = {
  // A feather quill: a barbed plume, a bare curved rachis, and a sharpened cut nib.
  quill: `<svg viewBox="0 0 24 24"><g transform="rotate(-45 12 12)"><path class="vane" d="M8.4 12 Q14 4.6 21 6.9 Q15.2 9.9 9.6 12.7 Z"/><g class="barb"><path d="M10.6 11.2 L12.1 8.4"/><path d="M12.8 10.6 L14.4 7.6"/><path d="M15 9.9 L16.6 7.2"/><path d="M17.4 9.2 L18.9 7"/></g><path class="spine" d="M2.7 12.7 Q9 12.2 21 6.9"/><path class="tip" d="M2.1 13 L4.5 12.05 L4.7 13.25 Z"/><path class="slit" d="M2.9 12.85 L4 12.45"/></g></svg>`,
  // A fountain pen: barrel, gold trim band, leaf-shaped nib with slit + breather hole, pocket clip.
  fountain: `<svg viewBox="0 0 24 24"><g transform="rotate(-45 12 12)"><path class="barrel" d="M8 10.2 H20 Q21.6 10.2 21.6 12 Q21.6 13.8 20 13.8 H8 Z"/><path class="barrel" d="M8 10.5 L6.4 11.1 L6.4 12.9 L8 13.5 Z"/><path class="nib" d="M2.3 12 Q4.2 10.7 6.3 10.7 L6.3 13.3 Q4.2 13.3 2.3 12 Z"/><path class="slit" d="M2.9 12 H5.5"/><circle class="hole" cx="5.5" cy="12" r="0.55"/><rect class="band" x="7.5" y="10.2" width="1.1" height="3.6" rx="0.3"/><path class="barrel" d="M16.4 10.3 Q18.4 9.2 19.2 10 Q19.6 10.6 18.6 11.1 L17.4 11.1 Z"/></g></svg>`,
  // A sleek gel pen: barrel, conical metal tip, gold grip + end cap, with glints of glitter.
  glitter: `<svg viewBox="0 0 24 24"><g transform="rotate(-45 12 12)"><path class="barrel" d="M8 10 H20 Q22 10 22 12 Q22 14 20 14 H8 Z"/><rect class="grip" x="6" y="10.2" width="2.4" height="3.6" rx="0.4"/><path class="tip" d="M6 10.4 L3 11.6 Q2.3 12 3 12.4 L6 13.6 Z"/><circle class="glitter-spark" cx="2.7" cy="12" r="0.6"/><rect class="band" x="19" y="10" width="1.6" height="4" rx="0.6"/></g><g class="glitter-spark"><path d="M5 6 l0.5 1.4 1.4 0.5 -1.4 0.5 -0.5 1.4 -0.5 -1.4 -1.4 -0.5 1.4 -0.5 z"/><path d="M18 17 l0.4 1.1 1.1 0.4 -1.1 0.4 -0.4 1.1 -0.4 -1.1 -1.1 -0.4 1.1 -0.4 z"/><circle cx="11" cy="5.5" r="0.7"/><circle cx="16" cy="19" r="0.6"/></g></svg>`,
};

// A plump five-point star (inner/outer radius ~0.52, up from the spiky ~0.35) with a
// same-colour rounded-join/cap stroke that rounds the points right off — friendlier and a
// touch hand-drawn, away from the machined look. The plump geometry is shared by
// ACH_ICONS.star and CHALL_STAR so every star on the site reads as one family (only the
// finish differs).
export const STAR_SVG = `<svg viewBox="0 0 24 24"><path d="M12 2.3 L14.94 7.96 L21.22 9 L16.76 13.55 L17.7 19.85 L12 17 L6.3 19.85 L7.24 13.55 L2.78 9 L9.06 7.96 Z" fill="currentColor" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
export const SPARKLE_SVG = `<svg viewBox="0 0 24 24"><path d="M12 1 C13 8 16 11 23 12 C16 13 13 16 12 23 C11 16 8 13 1 12 C8 11 11 8 12 1 Z" fill="currentColor"/></svg>`;

// Margin doodles: little inked sketches in the page corners, each a quiet nod to
// Swift lore. Drawn as layered strokes (bold outline, thin texture) so they read
// as real notebook marginalia, not clip art.
export const DOODLE_SVG = {
  // the weathered five-board fence with its five diamond holes in a quincunx, plus a
  // sparrow perched on top and grass at the post feet (the famous fence-photo tease)
  fence: `<svg viewBox="0 0 76 64"><g class="ink"><path d="M2.5 11.5 L2.8 57"/><path d="M15.5 10.8 L15.3 57"/><path d="M2.5 11.5 Q9 10.2 15.5 10.8"/><path d="M17.5 10.2 L17.7 57.5"/><path d="M30.5 9.8 L30.4 57.5"/><path d="M17.5 10.2 Q24 8.9 30.5 9.8"/><path d="M32.5 10.6 L32.8 57"/><path d="M45.5 10.2 L45.4 57"/><path d="M32.5 10.6 Q39 9.5 45.5 10.2"/><path d="M47.5 9.4 L47.7 57.5"/><path d="M60.5 9.8 L60.4 57.5"/><path d="M47.5 9.4 Q54 8.5 60.5 9.8"/><path d="M62.5 11 L62.8 57"/><path d="M75.5 10.6 L75.4 57"/><path d="M62.5 11 Q69 9.8 75.5 10.6"/><path d="M24 16 L28.2 21 L24 26 L19.8 21 Z"/><path d="M54 16 L58.2 21 L54 26 L49.8 21 Z"/><path d="M39 29 L43.8 34.5 L39 40 L34.2 34.5 Z"/><path d="M24 43 L28.2 48 L24 53 L19.8 48 Z"/><path d="M54 43 L58.2 48 L54 53 L49.8 48 Z"/></g><g class="ink" stroke-width="1" opacity="0.45"><path d="M6.5 32 q0.8 6 0.3 12 M42 14 q0.6 4 0.2 8 M70.5 30 q0.8 6 0.3 12"/></g><g class="ink" stroke-width="1.2" opacity="0.8"><path d="M4 58.5 q1.2 -4 2.6 -5.2 M7.5 59 q0.6 -3.2 2.2 -4.4 M33 59 q1 -3.6 2.4 -4.8 M37 58.5 q0.5 -3 2 -4.2 M68 59 q1.1 -3.8 2.5 -5 M72 58.5 q0.6 -3.2 2.1 -4.4"/></g><g class="ink" stroke-width="1.4"><path d="M50.8 9.2 Q50.4 5.8 53.5 5.4 Q56.1 5.1 56.5 7.3 L58 7.9 L56.2 8.5 Q55.5 9.2 54.6 9.3"/><path d="M50.8 9.2 L47.4 7"/></g><circle class="ink-fill" cx="55" cy="6.7" r="0.55"/></svg>`,
  // an elegant serpent gliding in from the tail, head raised and tongue flicked;
  // the reduced-motion stand-in for the animated slither (body is two tapering
  // edge strokes so the dash animation draws it nose to tail)
  snake: `<svg viewBox="0 0 84 58"><g class="ink"><path d="M4 47.5 C15 51 24 39.5 36 39.5 C48 39.5 50 50 62 50 C70 50 74.5 44.5 75.5 37"/><path d="M74 32 C71.5 40.5 68 46 62 46 C52 46 49.5 35.5 36 35.5 C25 35.5 17.5 47 4 47.5"/></g><path class="ink-fill" d="M73.4 35.4 Q71.9 32 74.3 29.2 Q76.5 26.8 78.7 28.2 Q80.7 29.6 79.3 32.5 Q77.7 35.7 75.1 36 Z"/><circle cx="76.7" cy="30.8" r="0.7" fill="var(--paper)"/><g class="ink" stroke-width="1.5"><path d="M79.3 29.2 Q81 28.2 82 27 M82 27 L83.6 25.9 M82 27 L82.6 25.1"/></g><g class="ink" stroke-width="1" opacity="0.55"><path d="M12.5 46.3 q1.8 -2.2 3.6 -0.7 M20 43 q1.9 -2.3 3.7 -0.8 M28.5 39.8 q1.9 -2 3.7 -0.6 M38 37.6 q1.8 2 3.6 0.7 M45.5 41.5 q1.8 2.2 3.6 0.9 M54 46.5 q1.9 1.9 3.7 0.7 M64.5 47.2 q2 -1 2.7 -2.9"/></g></svg>`,
  // the scarf, still left hanging on somebody's peg rail: draped over the peg in two
  // tails of different lengths, with knit stripes and fringe
  scarf: `<svg viewBox="10 0 50 58"><g class="ink"><path d="M12 5 L58 4.4"/><path d="M12 9 L58 8.5"/><path d="M33.2 8.8 C33.3 11.4 34.6 13 37.2 13.6"/><circle cx="38.6" cy="13.6" r="1.4"/><path d="M30.5 16.5 C27 22 25.5 29 27.5 36"/><path d="M36 17.5 C32.5 23 31 30 33 36.5"/><path d="M27.5 36 Q30.2 37.9 33 36.5"/><path d="M33.5 15 C38.5 20 41 30 39.5 47"/><path d="M38.7 14 C43.7 19.5 46.2 29.5 44.7 46"/><path d="M39.5 47 Q42.2 48.7 44.7 46"/><path d="M30.5 16.5 Q33.4 12.9 38.7 14"/></g><g class="ink" stroke-width="1.4"><path d="M28.2 37.6 L27.4 42 M30.4 38.4 L30.2 42.8 M32.5 37.7 L33 42"/><path d="M40.2 48.6 L39.5 53.2 M42.2 49.2 L42.2 53.8 M44.2 47.9 L44.9 52.4"/></g><g class="ink" stroke-width="0.9" opacity="0.6"><path d="M35.7 22 q2.5 1 5 0.6 M37.2 28 q2.6 1 5.2 0.5 M38 34.5 q2.7 0.9 5.5 0.4 M38.3 41 q2.7 0.7 5.7 0.2"/><path d="M28.5 23.5 q2.2 0.9 4.6 0.6 M27.2 29.5 q2.3 0.9 4.9 0.5"/></g><circle class="ink-fill" cx="15.5" cy="6.9" r="0.6"/><circle class="ink-fill" cx="54.5" cy="6.4" r="0.6"/></svg>`,
  // a Scottish Fold curled up asleep: folded ears, closed eyes, tail wrapped round
  // to the chin, and a little zZ drifting up
  cat: `<svg viewBox="0 0 64 52"><g class="ink"><path d="M9 33 C8 23 18 16.5 31 16.5 C42 16.5 49 21 51.5 26"/><path d="M9 33 C10 41.5 17 46.5 30 46.5 C36 46.5 41.5 45.3 44.9 42.6"/><path d="M33.5 28.5 C34.5 22.5 40.5 19.6 46.5 22.3 C52.7 25.2 54.2 32.5 50.3 38 C46.5 43.2 38.5 43.8 34.5 39.6"/><path d="M36 22.5 q0.8 -3.2 3.7 -3.4 q1.6 -0.1 2.1 1.3"/><path d="M45.6 21.6 q2.5 -1.7 4.2 -0.3 q1 0.9 0.5 2.3"/><path d="M11.5 38.5 C16 46 28 49.5 38.5 46.8 C42.5 45.7 44.8 43.4 45.2 40.7"/><path d="M14.5 41.5 C20 46.3 29 48 37.5 45.6 C40.8 44.6 42.7 43 43.2 41"/><path d="M45.2 40.7 Q44.3 40.1 43.2 41"/></g><g class="ink" stroke-width="1.5"><path d="M40 30.5 q1.6 1.5 3.2 0.1 M46.5 30.3 q1.6 1.5 3.2 0.1"/></g><path class="ink-fill" d="M43.7 33.4 h2.4 l-1.2 1.8 z"/><g class="ink" stroke-width="0.9" opacity="0.7"><path d="M39 33.5 l-5.2 -0.8 M39.2 35.3 l-5 0.8 M50.5 33.2 l5.2 -0.9 M50.4 35 l5.1 0.6"/><path d="M15.5 36 C15 29.5 19.5 25.8 25.5 26.6"/></g><g class="ink" stroke-width="1.4"><path d="M52 11.5 l4.6 -0.4 -4.4 5.3 4.8 -0.4 M58.5 5.5 l3.2 -0.3 -3 3.6 3.3 -0.2"/></g></svg>`,
  // an acoustic guitar, drawn properly this time: waisted body, rosette, bridge pins,
  // frets, tuning pegs, a pick resting beside it and a pair of notes floating off
  guitar: `<svg viewBox="0 0 46 62"><g class="ink"><path d="M23 26.5 C17.5 26.5 14 30.8 15.6 34.8 C16.6 37.2 15.6 38.8 13.6 40.8 C10.4 44.2 10.6 51.4 15.2 55.2 C19.4 58.6 26.6 58.6 30.8 55.2 C35.4 51.4 35.6 44.2 32.4 40.8 C30.4 38.8 29.4 37.2 30.4 34.8 C32 30.8 28.5 26.5 23 26.5 Z"/><circle cx="23" cy="43.5" r="4.5"/><rect x="17.8" y="50.2" width="10.4" height="2.7" rx="1.2"/><path d="M20.9 26.5 L20.9 10.5 M25.1 26.5 L25.1 10.5"/><path d="M20.5 10.5 L19.7 3.7 Q23 2 26.3 3.7 L25.5 10.5 Z"/></g><g class="ink" stroke-width="0.9" opacity="0.6"><circle cx="23" cy="43.5" r="5.9"/><path d="M20.9 13.8 h4.2 M20.9 17.2 h4.2 M20.9 20.6 h4.2 M20.9 24 h4.2"/><path d="M21.8 10.5 L21.8 50.2 M23 10.5 L23 50.2 M24.2 10.5 L24.2 50.2"/></g><g class="ink" stroke-width="1.2"><path d="M20 5.6 l-2.3 -0.3 M20.2 8.2 l-2.3 0 M26 5.6 l2.3 -0.3 M25.8 8.2 l2.3 0"/></g><circle class="ink-fill" cx="20" cy="51.5" r="0.45"/><circle class="ink-fill" cx="23" cy="51.5" r="0.45"/><circle class="ink-fill" cx="26" cy="51.5" r="0.45"/><g class="ink" stroke-width="1.4"><path d="M36.4 16.2 L36.4 8.8 L42 7.2 L42 14.4"/><path d="M6.6 49.6 Q9.6 48 12.1 49.9 Q11.6 54.1 9.1 55.7 Q6.7 53.7 6.6 49.6 Z"/></g><ellipse class="ink-fill" cx="35" cy="16.5" rx="1.7" ry="1.3"/><ellipse class="ink-fill" cx="40.6" cy="14.7" rx="1.7" ry="1.3"/></svg>`,
  // a raised hand with 13 inked on the back, the way she wore it show after show
  thirteen: `<svg viewBox="0 0 46 56"><g class="ink"><path d="M17.5 53 C16.5 48.5 16 44 15.5 40 C15 36 12.5 33 10 29.8 Q8.2 27.3 9.8 25.8 Q11.5 24.4 13.4 26.8 C15 28.8 16.3 30 17.2 30.6 L16.6 15 Q16.6 12.2 19 12.2 Q21.3 12.2 21.4 15 L21.8 26.5 Q22.1 27.2 22.4 26.5 L22.6 11.5 Q22.7 8.6 25.1 8.6 Q27.5 8.6 27.6 11.5 L27.9 26.5 Q28.2 27.3 28.5 26.6 L28.9 13.8 Q29 11.1 31.3 11.1 Q33.6 11.1 33.7 13.9 L34 27.8 Q34.3 28.6 34.7 27.9 L35.2 19.5 Q35.4 17 37.4 17 Q39.5 17.1 39.6 19.7 L40 33 C40.3 40 39.8 47 39.2 53"/><path d="M23.6 36.5 q1.8 -1 2.6 -2.2 L26.1 44.8"/><path d="M29.4 34.8 q3.8 -0.9 4.1 2 q0.2 2.2 -2.8 2.7 q3.4 0.1 3.4 2.9 q0 3 -4.4 2.6"/></g><g class="ink" stroke-width="0.9" opacity="0.6"><path d="M18.9 15.5 q0.8 1 1.6 0.1 M25 12 q0.8 1 1.6 0.1 M31.2 14.4 q0.8 1 1.6 0.1"/><path d="M16.4 50 Q28 52.6 39.4 50"/></g></svg>`,
  // the folklore cardigan: chunky knit, button placket, ribbed hem, and a little
  // embroidered star on each cuff
  cardigan: `<svg viewBox="0 0 62 54"><g class="ink"><path d="M24 8.8 L15 12 L15.3 48 Q15.3 50 17.3 50 L44.7 50 Q46.7 50 46.7 48 L47 12 L38 8.8"/><path d="M24 8.8 C26.5 14 29.6 19 30.6 23.5 L30.3 50"/><path d="M38 8.8 C35.5 14 33.6 20.5 33.1 25.5 L33.3 50"/><path d="M24 8.8 Q31 6.8 38 8.8"/><path d="M25.4 11 Q31 9.2 36.6 11"/><path d="M15 12 C10 14.2 8.4 18.5 7.6 23.5 L6 39.8"/><path d="M6 39.8 Q9.8 41.4 13.4 40.6"/><path d="M13.4 40.6 L15.2 27"/><path d="M47 12 C52 14.2 53.6 18.5 54.4 23.5 L56 39.8"/><path d="M56 39.8 Q52.2 41.4 48.6 40.6"/><path d="M48.6 40.6 L46.8 27"/></g><circle class="ink-fill" cx="31.8" cy="29" r="0.9"/><circle class="ink-fill" cx="31.8" cy="35.5" r="0.9"/><circle class="ink-fill" cx="31.8" cy="42" r="0.9"/><g class="ink" stroke-width="0.9" opacity="0.6"><path d="M15.3 46.4 Q31 48.2 46.7 46.4"/><path d="M18.5 47 l-0.2 2.6 M22 47.3 l-0.2 2.5 M25.5 47.6 l-0.1 2.3 M28 47.7 l0 2.2 M35.5 47.7 l0 2.2 M38 47.6 l0.1 2.3 M41.5 47.3 l0.2 2.5 M45 47 l0.2 2.6"/><path d="M6.6 36.7 Q10.1 38.1 13.8 37.4 M55.4 36.7 Q51.9 38.1 48.2 37.4"/><path d="M15 12 Q16.8 15.5 17.4 19 M47 12 Q45.2 15.5 44.6 19"/></g><path class="ink-fill" d="M10.4 30.4 l0.7 1.9 1.9 0.7 -1.9 0.7 -0.7 1.9 -0.7 -1.9 -1.9 -0.7 1.9 -0.7 z"/><path class="ink-fill" d="M51.6 30.4 l0.7 1.9 1.9 0.7 -1.9 0.7 -0.7 1.9 -0.7 -1.9 -1.9 -0.7 1.9 -0.7 z"/></svg>`,
  // a mirrorball on its string: meridian and latitude facet lines, a shine arc,
  // and glints thrown off into the margin
  mirrorball: `<svg viewBox="0 0 56 62"><g class="ink"><path d="M28 1.5 L28 8.5"/><path d="M25.8 10.2 Q28 7.6 30.2 10.2"/><circle cx="28" cy="33" r="21.5"/></g><g class="ink" stroke-width="1" opacity="0.55"><path d="M28 11.5 Q18 33 28 54.5 M28 11.5 Q38 33 28 54.5"/><path d="M8.2 25 Q28 21.8 47.8 25 M6.5 33 Q28 31.6 49.5 33 M8.2 41 Q28 44.2 47.8 41"/><path d="M18.5 27.6 h3.4 M31.5 28.2 h3.6 M12 36.4 h3.2 M22.5 37 h3.6 M36.5 36.8 h3.4 M44 36.2 h3 M17 45 h3 M30 45.8 h3.4 M38 44.8 h3"/></g><g class="ink" stroke-width="1.2" opacity="0.5"><path d="M14 22.5 Q17.5 15.8 24.5 13.4"/></g><path class="ink-fill" d="M50 8.4 l1 2.7 2.7 1 -2.7 1 -1 2.7 -1 -2.7 -2.7 -1 2.7 -1 z"/><path class="ink-fill" d="M6 15.9 l0.7 1.9 1.9 0.7 -1.9 0.7 -0.7 1.9 -0.7 -1.9 -1.9 -0.7 1.9 -0.7 z"/><circle class="ink-fill" cx="50.5" cy="47" r="0.8"/><circle class="ink-fill" cx="6.5" cy="49" r="0.7"/></svg>`,
  // a paper airplane climbing out of a loop-the-loop dashed trail
  paperplane: `<svg viewBox="0 0 64 46"><g class="ink"><path d="M59 6 C43 12.5 26.5 18.8 11 25.2 C18 26.4 25 27.5 32 28.7 Z"/><path d="M59 6 C50 13.7 41 21 32 28.7 L34.6 40.2 Z"/><path d="M34.6 40.2 L40.5 31.5"/></g><g class="ink" stroke-width="1.2" opacity="0.65" stroke-dasharray="2.5 3.5"><path d="M3 42.5 C10.5 41 14 34.5 9.2 31.6 C5 29.2 1.8 34 6.2 35.8 C12.5 38.5 19 33.5 25 30.6"/></g></svg>`,
  // a willow branch bent right to the wind: drooping leaf strands and two leaves
  // let go and falling
  willow: `<svg viewBox="0 0 58 60"><g class="ink"><path d="M2 9 C16 5 32 7.5 44 15.5 C48.5 18.5 51.5 21.5 53.8 25"/></g><g class="ink" stroke-width="1.2"><path d="M13.5 6.8 C12.5 16 15 24 13 33"/><path d="M19 6.3 C18.2 13 20 19 18.8 25"/><path d="M24 6.4 C23.5 18 27 27 24.5 39.5"/><path d="M29.5 7.4 C29.5 15 32 21 30.8 28"/><path d="M34.5 9.6 C35 21 39 30 36.5 44"/><path d="M44 15.5 C45.5 25.5 50 33.5 48 49"/><path d="M51.5 22.5 C53 29 55.2 33.5 54.2 40.5"/></g><g class="ink" stroke-width="1.1" opacity="0.8"><path d="M13 12 l-2.7 2.1 M13 12 l2.6 2.2 M13.9 18.5 l-2.7 2.1 M13.9 18.5 l2.6 2.2 M14.4 25 l-2.7 2.1 M14.4 25 l2.5 2.2 M13.7 30.5 l-2.6 2 M13.7 30.5 l2.5 2.1"/><path d="M18.7 12 l-2.6 2.1 M18.7 12 l2.5 2.2 M19.3 18 l-2.6 2 M19.3 18 l2.5 2.1"/><path d="M23.8 12 l-2.7 2.1 M23.8 12 l2.6 2.2 M24.6 19 l-2.7 2.1 M24.6 19 l2.6 2.2 M25.8 26 l-2.7 2.1 M25.8 26 l2.5 2.2 M25.9 33 l-2.6 2 M25.9 33 l2.5 2.1"/><path d="M29.6 13 l-2.6 2.1 M29.6 13 l2.5 2.2 M30.6 19.5 l-2.6 2 M30.6 19.5 l2.5 2.1"/><path d="M34.8 15 l-2.7 2.1 M34.8 15 l2.6 2.2 M35.9 22 l-2.7 2.1 M35.9 22 l2.6 2.2 M37.5 29 l-2.7 2.1 M37.5 29 l2.5 2.2 M38.1 36.5 l-2.6 2 M38.1 36.5 l2.5 2.1"/><path d="M44.8 21 l-2.7 2.1 M44.8 21 l2.6 2.2 M46.3 28 l-2.7 2.1 M46.3 28 l2.6 2.2 M48 35 l-2.7 2.1 M48 35 l2.5 2.2 M48.9 42 l-2.6 2 M48.9 42 l2.5 2.1"/><path d="M52.4 27 l-2.6 2.1 M52.4 27 l2.5 2.2 M53.9 32.5 l-2.6 2 M53.9 32.5 l2.5 2.1 M54.5 37.5 l-2.5 2 M54.5 37.5 l2.4 2"/></g><g class="ink" stroke-width="1.2"><path d="M9.5 46 q2.2 -1.4 2.6 -3.4 M15.5 52.5 q2 -1.2 2.4 -3"/></g><g class="ink" stroke-width="0.9" opacity="0.45"><path d="M3 30 q5.5 1.8 11 0.9 M2 36.5 q4.5 1.5 9 0.8"/></g></svg>`,
  // three seagulls over the waves, straight off the front of that striped sweater
  seagulls: `<svg viewBox="0 0 64 44"><g class="ink"><path d="M7.5 17 C10.5 10.8 16 10.2 19.4 14.9 M20.6 14.9 C24 10.2 29.5 10.8 32.5 17"/><path d="M19.4 14.9 Q20 15.8 20.6 14.9"/></g><g class="ink" stroke-width="1.4"><path d="M20 15.6 L18.6 18.6"/></g><g class="ink" stroke-width="1.7"><path d="M38.5 9.5 C40.8 5.4 44.6 5 47 8.3 M48 8.3 C50.4 5 54.2 5.4 56.5 9.5"/><path d="M43 24.8 C44.7 21.9 47.4 21.6 49.1 24 M49.9 24 C51.6 21.6 54.3 21.9 56 24.8"/></g><g class="ink" stroke-width="1.2" opacity="0.6"><path d="M6 35.5 q4 -3 8 0 q4 3 8 0 q4 -3 8 0"/><path d="M36 40 q4 -3 8 0 q4 3 8 0"/></g></svg>`,
};

// Natural display size (px) for each doodle, matched to its viewBox aspect so
// addDoodle can size them without per-call-site numbers.
export const DOODLE_SIZE = {
  fence: [76, 64], snake: [84, 58], scarf: [50, 58], cat: [64, 52],
  guitar: [46, 62], thirteen: [46, 56], cardigan: [62, 54], mirrorball: [56, 62],
  paperplane: [64, 46], willow: [58, 60], seagulls: [64, 44],
};

// Yes, whale! — the famous whale tail that looks for all the world like a pair of
// legs, surfacing from behind the top edge of the notebook (see surfaceWhale in
// app.js). Same slate-and-spray palette as the "yes, whale!" polaroid so the
// keepsake reads as a photo of this exact visitor. How long it treads water is
// WHALE_SURFACE_MS — 13 seconds, of course.
export const WHALE_SURFACE_MS = 13000;
export const WHALE_TAIL_SVG = `<svg viewBox="0 0 100 100" role="img"><title>A whale tail that looks like a pair of legs, sticking up from behind the page</title>
  <path d="M28 100 C26 76 27 46 32 20 Q32 10 26 4 Q33 8 35 16 C39 36 42 60 46 82 Q48 87 50 83 C55 62 59 38 62 16 Q63 7 72 1 Q69 9 68.5 18 C73 44 74 74 72 100 Z" fill="#27384a"/>
  <path d="M28.5 82 C27.5 62 28 44 30.5 26 M72.5 80 C73.5 60 73 42 70 22" stroke="#3d5166" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".7"/>
  <g fill="#dfe7ec"><circle cx="33" cy="72" r="1"/><circle cx="34" cy="52" r="0.85"/><circle cx="36" cy="32" r="0.8"/><circle cx="67" cy="68" r="1"/><circle cx="66" cy="48" r="0.85"/><circle cx="64" cy="28" r="0.8"/></g>
  <g fill="#6d94a8"><path d="M18 12 q1.7 2.8 0 4.3 q-1.7 -1.5 0 -4.3 z"/><path d="M80 8 q1.6 2.6 0 4 q-1.6 -1.4 0 -4 z"/><path d="M49 50 q1.4 2.3 0 3.6 q-1.4 -1.3 0 -3.6 z"/><circle cx="16" cy="24" r="1.2"/><circle cx="84" cy="18" r="1.1"/></g>
</svg>`;
export const WHALE_SPLASH_SVG = `<svg viewBox="0 0 120 60" aria-hidden="true">
  <g fill="#6d94a8"><circle cx="18" cy="28" r="3"/><circle cx="38" cy="13" r="2.4"/><circle cx="60" cy="7" r="3.2"/><circle cx="82" cy="13" r="2.4"/><circle cx="102" cy="28" r="3"/><circle cx="28" cy="42" r="2"/><circle cx="92" cy="42" r="2"/></g>
  <g fill="#9fb8c4"><circle cx="48" cy="21" r="1.6"/><circle cx="72" cy="21" r="1.6"/><circle cx="60" cy="35" r="1.8"/><circle cx="12" cy="16" r="1.3"/><circle cx="108" cy="16" r="1.3"/></g>
</svg>`;
