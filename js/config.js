// Pure constants & data tables. No state, no DOM — safe to import anywhere.

export const TOTAL_ROUNDS = 13;
// The day block's serial: how many days the game has been public. Derived, never
// stored, so the same date carries the same serial for everybody. null until launch,
// which keeps a fake serial off the card during development.
export const LAUNCH_DATE = null;    // set to "YYYY-MM-DD" on the day it goes public
export const SERIAL_DIGITS = 4;     // "No. 0001"
export const ROUND_SECONDS = 10;

/* ---------- The streak mark and its glitter ----------
   A run's correct-in-a-row count, penciled small in the notebook's outer margin below the
   page register, and thrown across the page as that many copies of itself each time an
   answer is locked in. Purely a flourish: nothing here is scored, stored or ranked, and
   `correctStreak` was already being kept for the charms long before this drew anything.

   Two readings carry the number at once. Under about eight you count the scraps; past that
   you cannot, but every scrap is legibly the numeral itself, so the burst gets MORE readable
   as it gets denser rather than less. That handover is the whole idea, which is why the cap
   below throttles the scrap count and never the numeral.

   The ladder is the pencil case, not a rarity table: pencil, graphite, the notebook's own
   era pen, then gold. Two rungs were tried and cut. RED, because red is the miss and a
   reward drawn in the colour that means wrong is a contradiction. HIGHLIGHTER, because a
   wash behind a 20px numeral has no line of text to travel along and comes out a blob, and
   a dozen blobs at a dozen angles read as stickers stuck to the page. */
export const STREAK_FLOOR = 2;    // streaks below this land quietly; a lone "1" is a weak burst
export const STREAK_CAP = 31;     // ceiling on scraps thrown. The numeral keeps climbing past it
export const STREAK_SALT = 0.30;  // share of scraps borrowed from the rung above, so a new tier
                                  // arrives by winning the burst rather than by switching it
export const STREAK_TIERS = [
  { at: 0,  ink: "var(--ink-soft)" },     // pencil
  { at: 6,  ink: "var(--ink)" },          // graphite
  { at: 12, ink: "var(--ink-accent)" },   // the era's own pen — no two notebooks climb alike
  { at: 25, ink: "var(--brand-gold)" },   // gold
];
// Flight. The scrap is two nested elements: the outer carries the outward throw on an ease-out,
// the inner the fall on an ease-in, and the two easings compose into an arc for no per-frame JS.
export const STREAK_THROW = 210;  // px, before the per-scrap jitter
export const STREAK_DROP = 120;   // px of gravity over the flight
export const STREAK_SPIN = 160;   // max degrees of tumble, either way
export const STREAK_MS = 1150;    // flight time, before the per-scrap jitter
export const STREAK_SIZE = 21;    // px, before the per-scrap jitter
export const STREAK_CONE = 200;   // degrees, aimed rightward ACROSS the page. A full 360 throws
                                  // a third of the burst off the left edge onto the desk.
export const RECENT_WINDOW = 5;
// Normal-mode coverage bias: in a Normal (classic · medium) run each draw favours prompt
// words the player hasn't been shown yet, so playing Normal trends toward meeting the whole
// catalogue instead of re-rolling the same familiar words forever. This is how many times
// likelier an un-encountered word is than an already-seen one, per word. A soft nudge, not a
// forced march: early on nearly everything is unseen so it plays like uniform random, and once
// every word has been encountered all weights equalise and it reverts to plain random. Only the
// Normal pool ("all") reads this; the rarity-tiered modes draw uniformly. See pickWord / pickNovel.
export const NOVELTY_BOOST = 6;
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

/* ---------- Address-bar routes ---------- */
// The notebook is a single page, but its standing panels each get a URL of their own, so
// /records is a link you can send someone and a place the browser's back button understands.
// Slug -> the `screens` key in app.js that the slug opens. The test for belonging here is that
// the slug never starts a run and never restores run state — landing on one shows a board, and
// the player still has to press play. That takes in the mode boards (Album Focus, Ruthless)
// alongside the shelves, since a board with a play button on it is still a board: /bonus and
// /challenges have one too. What stays out is anything that IS a run: the game screen, a bonus
// board mid-play, a results page.
//
// GitHub Pages has no server-side rewrite, so this list is duplicated, on purpose, in two
// places that cannot import a module: the bounce script in 404.html and the navigation
// branch in sw.js. Add a slug here and it must be added to both, or the deep link 404s.
export const PANEL_ROUTES = {
  records: "records",
  charms: "achievements",
  stats: "stats",
  mastery: "mastery",
  challenges: "challenges",
  bonus: "bonus",
  guests: "guests",
  songbook: "songbook",
  "album-focus": "albumfocus",
  ruthless: "ruthless",
  "how-to-play": "howto",
};

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
export const TYPES_KEY = "swiftSongAssociation.typesPlayed";   // { [type]: true } — every game type ever finished, for Hits Different and the breadth rungs above it (see SHELF_TYPES)
export const DAY_TYPES_KEY = "swiftSongAssociation.dayTypes";  // { d: "YYYY-MM-DD", types: {…} } — TODAY's game types only, for Every Single Day. One day deep on purpose: the charm asks about a sitting, so yesterday's is dead weight.
export const DICE_KEY = "swiftSongAssociation.dicePicks";      // { n } — how many runs the randomiser has dealt you, for the two dice charms
export const TALLY_KEY = "swiftSongAssociation.songTally";     // lifetime per-song/per-word tally — Favourite Song, Songs Discovered, Nemesis Word, I Hate It Here
export const SETTINGS_KEY = "swiftSongAssociation.settings";   // user preferences (see DEFAULT_SETTINGS)
export const METRICS_KEY = "swiftSongAssociation.metrics";    // lifetime cross-game counters — fastest/avg answer, accuracy, lyric lines, daily totals
export const CHALLENGES_KEY = "swiftSongAssociation.challenges";        // per-challenge progress — { [id]: {unlocked, defeated, attempts, best} }
export const CHALLENGE_TOKENS_KEY = "swiftSongAssociation.challengeTokens"; // { balance } — tokens spent to unlock challenges
export const ALBUM_FOCUS_KEY = "swiftSongAssociation.albumFocus";       // per-album best/beaten board — { [album]: {best, bestDiff, beaten, beatenDiff, perfected, perfectedDiff} }
// Retired: the Adaptive mode board. Named here only so purgeAdaptive (storage.js) has one
// place to read the dead key from; nothing writes it any more.
export const ADAPTIVE_LEGACY_KEY = "swiftSongAssociation.adaptive";
export const GUEST_KEY = "swiftSongAssociation.guests";                 // guest shelf board — { [guestId]: {best, bestDiff, admitted, admittedDiff} }
export const BONUS_KEY = "swiftSongAssociation.bonus";                  // bonus games shelf — { [gameId]: {best, plays, last} }
export const RUTHLESS_KEY = "swiftSongAssociation.ruthless";            // Ruthless mode board, one best per lens — { [lensId]: {best, bestGaveUp, plays, last, date} }
export const SEARCH_KEY = "swiftSongAssociation.search";                // Swift To The Lyric searcher — { mode, view, recent:[] }
export const MASTERY_KEY = "swiftSongAssociation.mastery";              // skills + mastery progression — { skills:{...xp}, masteryXp, unlocked:{[rewardId]:isoDate} }
export const CUSTOM_KEY = "swiftSongAssociation.custom";               // player-authored modes — { presets:[{id,name,mode}], activeId }
export const KEEPSAKES_KEY = "swiftSongAssociation.keepsakes";         // earned collectibles — { [polaroidId]: isoDate } (unlock time, mirrors achievements)
export const STICKERS_KEY = "swiftSongAssociation.stickers";           // earned stickers: { [stickerId]: isoDate }, same shape as the keepsakes store
export const BREADTH_KEY = "swiftSongAssociation.modesSeen";           // { [token]: true } — every mode/difficulty combination ever finished, for "Explorer"
export const WEEKDAYS_KEY = "swiftSongAssociation.weekdaysPlayed";     // { [0-6]: true } — which weekdays you have finished a game on, for "Seven"
// The calendar ledger — { days: { [YYYY-MM-DD]: true }, months: { [1-12]: true } }. Deliberately
// its own key rather than derived from HISTORY_KEY, which is capped at HISTORY_CAP runs: a heavy
// year can push January off the end before December arrives, so a derived answer would be wrong
// exactly for the player who earned it. Uncapped on purpose — a year of daily play is ~5KB.
export const DATES_KEY = "swiftSongAssociation.datesPlayed";
export const RANDOM_KEY = "swiftSongAssociation.randomSeen";           // { [token]: true } — everything the randomiser has already shown you (see RANDOM_CATEGORIES)
export const GOAL_KEY = "swiftSongAssociation.pinnedGoal";             // { id, pinned } — the one charm pinned as a goal on the Charm Collection page
// Which themed sections of the Charm Collection are folded shut. Only the FOLDED ids are
// stored, so a section added later opens by default and an empty record means "all open".
export const ACH_FOLD_KEY = "swiftSongAssociation.charmFolds";         // [sectionId] — theme ids plus "fam:<family>", e.g. ["core", "secret", "fam:craft"]

// Keepsakes — the collectible polaroid set (subjects + SVGs live in js/polaroids.js).
// A polaroid develops like real instant film: solid black on unlock, the photo fading
// in POLAROID_DEVELOP_MS later. "developed" is derived from unlock+this at render time,
// never a running timer, so it survives reloads and self-heals. POLAROID_TOTAL is the
// counter denominator. It was a Taylor number (22) that the set grew toward, and it MUST go
// back to 22 the day the retired "i'm not asleep" polaroid is rebuilt (PLAN.md holds its art
// and its trigger). It sits at the true count meanwhile because You Took A Polaroid Of Us
// fires off POLAROIDS.length: a denominator running ahead of the set would hand the player
// "every polaroid found" over a counter reading 21 / 22.
export const POLAROID_DEVELOP_MS = 13 * 60 * 1000;   // 13 real minutes
export const POLAROID_TOTAL = 21;

// Stickers, the die-cut vinyl set (objects + SVGs live in js/stickers.js). A second
// collectible beside the polaroids, never mixed into their grid: polaroids develop, stickers
// are printed and arrive finished. STICKER_TOTAL is the drawer's counter denominator and sits
// at the true count of the drawn set, for the same reason POLAROID_TOTAL does: a denominator
// running ahead of what exists would report "every sticker found" over a short count.
export const STICKER_TOTAL = 15;

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
  timerTension: true,       // vignette / word tremor / red margin tally / countdown tick in the final seconds
  reducedFlashing: false,   // also suppress the perfect-game star shower
  // gameplay pacing
  autoAdvance: true,        // auto-advance countdown after a correct answer
  countdownSecs: 5,         // 3..8 — length of that countdown
  enterOnMiss: true,        // Enter advances past the miss screen
  showExamples: true,       // show example songs after a wrong answer
  stemMatching: true,       // match word variants (love→loving, gold→golden); off = exact word only
  openKeyboard: true,       // phones only: focus the answer line when each new round opens
  confirmLeave: true,       // require a second tap before abandoning an in-progress run

  enableHints: true,        // show progressive hints in Easy/Relaxed (a hinted run can't set a personal best)
  censorExplicit: false,    // mask general profanity (fuck→f**k) in shown lyrics/titles; the racial slur is always masked regardless

  defaultGameType: "last",  // "last" | "classic" | "infinite" | "custom"
  defaultDifficulty: "last",// "last" | a MODES id
  defaultStatsTab: "all",   // which Stats tab opens first: "all" | "last" | a MODES id
  // display & accessibility
  theme: "light",           // page theme: "light" | "system" (follow OS) | "dark" (a dark notebook for low light)
  textSize: "standard",     // "small" | "standard" | "large"
  highContrast: false,
  colorBlindAlbums: false,  // swap ALBUM_COLORS for a colour-blind-friendly palette
  deskDensity: "full",      // "full" | "quiet" | "bare" decorative desk dressing
  seasonalEffects: true,    // calendar-driven snow, midnight rain and autumn leaves
  hideDailyScore: false,    // hide the daily score until "reveal & copy"
  timezone: "auto",         // daily-reset zone: "auto" (detect) | an IANA id e.g. "America/New_York"
  weekStart: "mon",         // first row/column of week-based views (the records calendar): "mon" | "sun"
  clock: "12",              // time-of-day format wherever a clock time is shown: "12" (4:31 PM) | "24" (16:31)
  // onboarding / first-run — the shared state every "first impressions" feature hangs off
  firstRunDone: false,      // has the player finished the first-run welcome flow (gates the intro + the ready-for-normal nudge)
  favouriteAlbum: "",       // era chosen in the first-run question ("" = never asked or skipped); surfaced on the profile
  firstMatchDone: false,    // has the player ever landed a correct answer (guards the one-time first-match celebration)
  seenCoachmarks: {},       // { [coachmarkId]: true } — just-in-time tips already shown, so each fires once
  typingHintsSeen: {},      // { [segmentId]: pages shown } — the typing hint under the answer line fades per segment (see applyInputHints)
  // meta
  sound: false,             // opt-in; the synthesized palette lives in js/sound.js
  soundFeedback: true,      // correct, wrong and hint sounds
  soundPaper: true,         // page turns, pencil strikes and the closing book
  soundTimer: true,         // final-seconds clock ticks
  soundUnlocks: true,       // achievement and mastery unlock flourish
  lastGameType: "classic",  // runtime memory backing defaultGameType: "last" — the last type clicked (not shown in UI)
  playerName: "",           // notebook signature — set once, reused on every personal record
  avatar: "",               // profile polaroid — a center-cropped data-URL, stays on this device
  masteryPen: "",           // chosen writing pen, unlocked via Mastery ("" = the default random egg)
  masteryPaper: "",         // chosen paper stock, unlocked via Mastery ("" = the default cream page)
  masteryTrinket: "",         // chosen bracelet trinket, unlocked via Mastery ("" = the default star)
  masteryTitle: "",         // chosen prestige title, unlocked via Mastery ("" = follows your mastery: the highest tier's default)
  masteryButton: "",        // chosen "start writing" button finish, unlocked via Mastery ("" = the default gold marker)
  masteryLabel: "",         // chosen start-button words (a CTA_LABELS key), unlocked via Mastery ("" = the default "Start writing")
};

/* Difficulty modes — each just re-tunes existing levers (timer, dropdown,
   word-rarity pool, matching strictness, wrong-answer help). Gameplay code is
   shared; the mode object sets the parameters. */
export const MODES = {
  easy:   { id: "easy",   label: "Easy",   seconds: 15, dropdown: true,  pool: "easy",  strict: false, noTitle: false, examples: 3, hint: true,  blurb: "15s · suggestions & hints · common words" },
  medium: { id: "medium", label: "Normal", seconds: 10, dropdown: true,  pool: "all",   strict: false, noTitle: true,  examples: 3, hint: false, blurb: "10s · suggestions · all words · not in the title" },
  hard:   { id: "hard",   label: "Hard",   seconds: 7,  dropdown: false, pool: "hard",  strict: false, noTitle: true,  examples: 3, hint: false, blurb: "7s · type the full title · rarer words · not in the title" },
  // `moreExamples: false` is Ultra's alone: every other mode lets a missed page open out into
  // the rest of the field (see MORE_EXAMPLES_BATCH). Ultra shows its one card and closes. The
  // reveal is post-mortem either way, so this isn't about difficulty — it's that Ultra's whole
  // manner is one glance and gone, and a page you can sit and study contradicts it.
  ultra:  { id: "ultra",  label: "Ultra",  seconds: 5,  dropdown: false, pool: "ultra", strict: false, noTitle: true,  examples: 1, hint: false, moreExamples: false, blurb: "5s · type the full title · rarest · not in the title" },
  // Lyric-only: no title input (lyricOnly), longer clock. You answer by typing a lyric
  // line (a few words around the prompt word are enough — the matcher is fuzzy).
  lyricist: { id: "lyricist", label: "Lyricist", seconds: 20, dropdown: false, pool: "all", strict: false, noTitle: false, examples: 3, hint: false, lyricOnly: true, blurb: "20s · type a lyric line, not the title" },
  // No-timer practice mode (seconds: 0 → startTimer takes the no-timer path). Same
  // forgiving levers as Normal; the only difference is the clock never runs.
  relaxed: { id: "relaxed", label: "Relaxed", seconds: 0, dropdown: true, pool: "all", strict: false, noTitle: false, examples: 3, hint: true,  blurb: "no timer · suggestions & hints · all words" },
};
/* How many additional proof rows each press on a result page reveals. The player can keep
   pressing until the already-scoped answer pool is exhausted. */
export const MORE_EXAMPLES_BATCH = 12;
export const MODE_ORDER = ["relaxed", "easy", "medium", "hard", "ultra", "lyricist"];
// The start-screen picker presents two groups. The ladder (relaxed→ultra) is one axis —
// naming the song, tuned harder or softer. Lyricist is a different MODALITY (answer by a
// lyric line, not a title), so the main picker sets it apart rather than implying it's a
// sixth, "harder than Ultra" rung. MODE_ORDER keeps all six for stats, records, and Album
// Focus, where lyricist legitimately ranks as the top "by heart" tier.
export const DIFFICULTY_LADDER = ["relaxed", "easy", "medium", "hard", "ultra"];
export const MODALITY_MODES = ["lyricist"];
// "Explorer" — every way the main game can be played, written as the breadth tokens
// markModeSeen stores. The whole ladder in classic and in BOTH infinite variants (sudden
// death is a different game from three lives, not a setting), plus the two game types that
// have no ladder of their own. Lyricist is deliberately absent: MODALITY_MODES keeps it
// apart from the ladder, and it already carries its own charms. Daily is absent too — it
// forces Normal and is one play a day, so it would gate Explorer behind the calendar.
export const EXPLORER_TOKENS = [
  ...DIFFICULTY_LADDER.map((m) => "classic:" + m),
  ...DIFFICULTY_LADDER.map((m) => "inf-3lives:" + m),
  ...DIFFICULTY_LADDER.map((m) => "inf-sudden:" + m),
  "custom",
];
/* The seven game types the notebook itself can be played as — the breadth ladder in the Core
   theme (five of them, then all seven) counts these and nothing else. Different axis from
   EXPLORER_TOKENS, which walks the DIFFICULTY ladder inside two of them; this walks the shelf.
   Two deliberate absences:
   - bonus, because the shelf's sandbox is explicit that nothing a bonus run does may satisfy a
     main-game charm. It has play-every-bonus-game of its own and that is where its breadth lives.
   - ruthless, for the same reason as the shelf and not because it is hard to reach: it is
     sandboxed the same way, folding no run progress at all (see foldRunProgress). It IS a
     first-class gameType and a door on the front page — that is not what this ladder is
     counting. */
export const SHELF_TYPES = ["classic", "infinite", "daily", "album", "challenge", "custom", "guest"];
/* The inked marks drawn beside each inside page's title (the `.page-mark.mark-*` spans in
   index.html). Eleven kinds across twelve spans: the guest shelf and a guest's catalogue page
   share one mark, so the set is by KIND, not by element. Tapping all eleven is a secret charm
   (tap-every-page-mark), so a new inside page with a new mark makes that charm cost one more
   tap — add the kind here only when the page is a permanent fixture everyone can reach. */
export const PAGE_MARK_KINDS = [
  "stats", "records", "charms", "mastery", "challenges",
  "bonus", "album", "ruthless", "guests", "songbook", "howto",
];
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

/* ---------- Guest shelf ----------
   Other artists as opt-in catalogues, NEVER blended into Taylor's pool: a blended second
   catalogue makes every prompt easier (more valid answers), invalidates the rarity tunings
   words.json derives from a 287-song corpus, and turns "not in the catalogue" from a reliable
   "not a Taylor song" into an ambiguous shrug. So a guest is its own catalogue, played on its
   own, the way Album Focus already points the same machinery at a 12-song pool.

   A guest's SONGS AND WORDS ARE NOT HERE. They live in one file per guest under data/guests/,
   fetched on demand by loadGuest (app.js) the first time the shelf needs their counts —
   songs.json is already ~1MB, and a player who never opens the shelf should never pay for it.
   This list carries only what the shelf itself must draw before the file arrives: the name,
   where to fetch it, and the ink. Colour and mood only — no album art, ever.

   GUEST_SHELF_SLOTS is how many hangers the rail holds. Planned catalogues can occupy a hanger
   without entering GUESTS, which keeps unavailable artists out of every playable guest path. */
export const GUEST_SHELF_SLOTS = 10;
export const GUESTS = [
  {
    id: "olivia-rodrigo",
    name: "Olivia Rodrigo",
    file: "data/guests/olivia-rodrigo.json",
    // pass ink: band gradient (deep → accent), the strap, the name, and the three
    // record ticks. Violet, which is SOUR/GUTS as a mood and nothing more.
    ink: { deep: "#2f1c47", accent: "#7a55b0", strap: "#5b3c88", pen: "#4a2f6b",
           ticks: ["#8e7bbf", "#6b4a95", "#3d2a5c"] },
    // The era wash a guest run wears for all thirteen pages. ALBUM_ERA can't answer this —
    // it keys on Taylor's albums — and a guest run shuffling through Taylor's eras would
    // dress someone else's catalogue in her colours. One era per guest, chosen for mood.
    era: "lavender",
  },
  {
    id: "wicked-soundtrack",
    name: "Wicked",
    file: "data/guests/wicked.json",
    // Two shades each of emerald and rose keep the pass rooted in Elphaba and Glinda.
    ink: { deep: "#234b3f", accent: "#c5799b", strap: "#527a50", pen: "#315746",
           ticks: ["#4f8b63", "#c5799b", "#315746", "#a85e82"] },
    era: "evermore",
  },
  {
    id: "hannah-montana",
    name: "Hannah Montana",
    file: "data/guests/hannah-montana.json",
    // The show's violet wordmark and warm yellow star translated into the pass hardware.
    ink: { deep: "#56346f", accent: "#e2b63d", strap: "#76528e", pen: "#5a3971",
           ticks: ["#8a63a2", "#e2b63d", "#c78b35", "#6a4c88"] },
    era: "speak-now",
  },
  {
    id: "billie-eilish",
    name: "Billie Eilish",
    file: "data/guests/billie-eilish.json",
    // Near-black, acid green, and cold grey-green: a nocturnal palette translated into pass ink.
    ink: { deep: "#101512", accent: "#b6d62b", strap: "#26332b", pen: "#17211c",
           ticks: ["#b6d62b", "#6f8d37", "#26332b", "#899788"] },
    era: "folklore",
  },
];
// Names announced on the shelf before their catalogue data is ready. These deliberately have no
// file, ink, or era, so nothing can mistake them for playable guests.
export const GUESTS_COMING_SOON = [
  { id: "beyonce", name: "Beyoncé" },
  { id: "sabrina-carpenter", name: "Sabrina Carpenter" },
  { id: "ariana-grande", name: "Ariana Grande" },
  { id: "gracie-abrams", name: "Gracie Abrams" },
  { id: "miley-cyrus", name: "Miley Cyrus" },
  { id: "harry-styles", name: "Harry Styles" },
];
// A guest is played at a chosen difficulty, from the same ladder Album Focus offers:
// deliberately the same list, since a guest round IS Album Focus pointed at another corpus.
export const GUEST_DIFFS = ALBUM_FOCUS_DIFFS;
// What admits a guest to the shelf. Album Focus beats at 9/13 and perfects at 13/13; a guest
// has only the one mark, set at a perfect run. A 42-song catalogue is small enough that 9/13
// arrives quickly once you know it, and ADMITTED should mean you know the whole shelf.
export const GUEST_TARGET = TOTAL_ROUNDS;
// The bucket thresholds Taylor's 287-song corpus is tuned to. A guest carries its own in its
// file (see loadGuest / indexPlayableWords) because these numbers do not survive the trip: at
// 42 songs `easy >= 18` matches nine words and `ultra` swallows most of the vocabulary.
export const TAYLOR_BUCKETS = { easy: 18, hard: [3, 9], ultra: [1, 3] };

/* ---------- Floating rarity (Custom's "Floating" pool) ----------
   Not a mode: a stop on Custom's rarity picker. Instead of pinning one bucket for the whole
   run, the pool rides a visible 1..4 level that climbs on a correct streak and drops a rung
   on any miss. The level maps straight onto the four rarity buckets; every other lever is
   whatever the player authored, untouched. Deliberately affects RARITY ONLY — it never
   overrides the suggestions or hints levers, because a preset that quietly disabled the
   controls you set would be lying about what it does. */
export const ADAPT_BUCKETS = [null, "easy", "all", "hard", "ultra"];   // level 1..4 -> wordBuckets key (index 0 unused)
export const ADAPT_LEVELS = [null, "Common", "Deeper", "Rare", "Rarest"]; // level 1..4 -> readable tier name
export const ADAPT_MAX_LEVEL = 4;       // top level (ultra bucket)
export const ADAPT_START_LEVEL = 2;     // start in the middle (the "all" bucket)
export const ADAPT_PROMO_STREAK = 2;    // correct answers at a level needed to climb one (a single miss demotes)

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
// Word-rarity stops the picker offers. The first four pin one bucket for the whole run;
// "float" rides the level ladder above instead (see ADAPT_BUCKETS). "float" is never
// "at least Ultra" for customAtLeastUltra — it opens at Common, and the lever comparison
// there (m.pool === MODES.ultra.pool) rules it out on its own.
export const CUSTOM_POOLS = ["easy", "all", "hard", "ultra", "float"];
export const CUSTOM_EXAMPLES_MAX = 3;    // example songs shown after a miss (0..3)
export const CUSTOM_MAX_PRESETS = 12;    // keep the saved list manageable
export const MEAN_GRUDGE = 5;            // times a word must have beaten you before answering it right earns "Mean"
export const CUSTOM_PRESET_SHELF = 5;    // presets kept at once to earn "Mine" (well short of the cap, so it rewards tuning rather than hoarding)
export const CUSTOM_ENDLESS_MILESTONE = 50;  // rounds into an endless custom run for "Forever & Always"
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
/* ---------- Dark sides ----------
   A challenge's `hard` block is a set of parameter overrides for its "dark side": the same
   challenge, same seal, same rule — tightened. It is NOT a separate CHALLENGES entry, so the
   roster stays 27 cards and a dark side is something a challenge grows into rather than
   another row on the wall.

   Resolution happens once, in app.js's `resolveChallenge(c, dark)`, which returns
   `{...c, ...c.hard, dark:true}` and hands THAT to `currentChallenge`. Every existing read
   site (`currentChallenge.target`, `c.revealMs`, `c.forks`, …) therefore picks up the dark
   value with no per-site changes. `id` is preserved, so id-keyed achievements and labels are
   unaffected — the same trick startChallenge already uses when cloning a mode.

   Only levers that already flow through existing code live here. Dark behaviours that need
   NEW rule logic are deliberately absent rather than added as inert data that silently does
   nothing; they are listed in DARK_SIDE_TODO below. */
// BONUS GAMES — a shelf of quick, self-contained mini-games that sit apart from the
// main association loop. This is the roster the shelf draws from. Each game is authored
// one at a time; until then it's a "shell": `ready:false` renders a coming-soon card that
// launches nothing. Flip `ready` true and wire the launcher in `selectBonusGame` when the
// game is built. Keep `name` short and `blurb` to a single sentence so the cards stay even.
//
// `tint` and `mark` dress the game's pressing on the shelf: the label colour of the disc,
// and which drawn cartouche mark sits on it (the marks live in the #bd-* sprite in
// index.html). The vinyl, rays and deco furniture are shared and identical on every disc,
// so a new game means one new colour and one new mark, nothing else. A `ready:false` game
// gets neither: an unreleased record wears a bare white-label test pressing instead, which
// is what makes "coming soon" legible without a word of UI.
// Two descriptions, deliberately, and they are not the same sentence at two lengths.
// `blurb` is written for the platter, where there is room to say how a game FEELS. `line` is
// written for the shelf, where every game has to say what it IS in one row: one sentence, kept
// near 45 characters so it holds on a phone, and clipped by CSS rather than wrapped if a new
// one ever runs long — a shelf row that reflows is what made the old described list so tall.
// The kicker below is the platter's, not the shelf's; on the shelf `line` stands in its place,
// because a three-word tag and a real sentence are the same job done twice.
/* `sweep: true` is the SECOND AXIS for a game whose ceiling is reachable. The three games
   scored right/wrong over ten pages top out at 10/10 and then have nothing left to chase, so
   clearing all ten additionally stamps a TIME and best clean-sweep time becomes the chase.
   The clock scores the SWEEP and not the run: below the ceiling nothing changes at all, which
   is what keeps it off a player still learning the game.

   It is deliberately NOT on the three points games, and the reason is not that they don't need
   it (they don't — 60/50/60 are unreachable by design and Then What already grew a second axis
   in its longest chain) but that a clock would DELETE them. Only Here's 20s exists to force
   judgement over recall, and Redacted is a game about deliberating over which strip to buy.
   Nor is it on Ruthless, which is scored in seconds already. */
export const BONUS_GAMES = [
  { id: "spot-the-slip", name: "Spot the Slip", ready: true, sweep: true,
    kicker: "find the wrong word", tint: "#cf6752", mark: "skip",
    line: "One word in the lyric is an impostor. Catch it.",
    blurb: "One word in the lyric has been swapped for an impostor. Catch it before the ink dries." },
  { id: "name-that-song", name: "Name That Song", ready: true, sweep: true,
    kicker: "lyric in, title out", tint: "#33486e", mark: "question",
    line: "Read the line, name the song, beat the clock.",
    blurb: "Read the line, name the song, and beat the clock. No prompt word to lean on but the lyric itself." },
  { id: "sing-it-back", name: "Sing It Back", ready: true, sweep: true,
    kicker: "fill the gap", tint: "#77485e", mark: "caret",
    line: "A word is missing from the line. Write it back.",
    blurb: "A word has been lifted out of one of the song's own lines. Write it back in." },
  // The one game on the shelf scored in POINTS rather than pages cleared: `points` is what a
  // page opens worth, and every other surface reads its maximum off it (see bonusMaxScore).
  // Any future game that scores a page on a scale rather than right/wrong sets the same field.
  // Six rather than ten: a page cleared blind is the best thing that happens in this game, and
  // at ten it paid so far above a normally-peeled page that the sensible play was to sit and
  // stare rather than spend. Six keeps the same shape (a strip a point, floored at one) with a
  // shorter drop, so peeling the two or three you actually need is not a ruined page.
  { id: "redacted", name: "Redacted", ready: true, points: 6,
    kicker: "how little do you need?", tint: "#4e5f3a", mark: "redact",
    line: "Peel the tape off a verse, and name it cheap.",
    blurb: "A verse with the telling words taped over. Peel them off one at a time, and name the song before you have spent the page." },
  // The one game on the shelf with no fail state: every card in the hand is really in the song,
  // so every pick pays, and the rarity is what the five points are for. See buildOnlyHerePuzzle.
  { id: "only-here", name: "Only Here", ready: true, points: 5,
    kicker: "the game backwards", tint: "#2b6b6a", mark: "pin",
    line: "Six words from the song. Pick the rarest.",
    blurb: "The game backwards: here is the song, and here are six words out of it. Pick the one you think the fewest other songs sing, and the hand turns over to show you what they were all worth." },
  // Four picks down one song, worth 1, 1, 2 and 2 — the payout escalates because the decoys
  // move closer to home as the page goes on (see buildChainPuzzle), and a ramp the player is
  // asked to survive but never paid for reads as the game turning mean rather than exciting.
  // The six is CHAIN_PAGE written out; the two must stay in step.
  { id: "then-what", name: "Then What", ready: true, points: 6,
    kicker: "what comes next?", tint: "#5e4a86", mark: "chain",
    line: "Three lines. Pick the one that comes next.",
    blurb: "One line of the song, and three that might follow it. Pick the right one and it locks into the page in pen; four picks and the verse is yours." },
];
/* ---------- The Ruthless run descriptor ----------
   NOT a bonus game and no longer in the roster above (2026-08-18). It is the object the Ruthless
   MODE hands to `startBonusGame`, because the mode still plays on the shelf's machinery: the same
   loop, drip, clock, verdict, countdown and give-up. Only the lens and the ending differ.

   It sat in BONUS_GAMES behind a `shelf: false` flag while the mode was being built, which cost
   every player-facing surface and the randomiser a filter (`shelfGames()`) to keep a card off the
   deck that was not a card any more. The mode owns its end path now, so the flag and the filter
   are both gone and the roster is the shelf again.

   `timed` is the flag that matters and it stays: this run is scored in SECONDS and a LOW number
   is the good one. Everything that reads a score reads that flag rather than assuming a run
   counts upward — see bonusScoreText / bonusPageScore / bonusTimed.

   Why it left the shelf at all: the mode's From the Top lens opens on the song's own first word,
   which was this card's stream exactly. Two identical puzzles under two scoring rules is the
   worst of both, so the whole-song version lives in the mode now, where a time is kept per lens.
   That is also why nothing was lost when the card went: From the Top IS the shelf game. */
export const RUTHLESS_GAME = {
  id: "ruthless-game", name: "Ruthless Game", ready: true, timed: true,
  kicker: "a word a second", tint: "#7d2b34", mark: "metro",
  line: "A word a second until you name it.",
  blurb: "The song writes itself out from its very first word, one word every second, and the clock never stops. Guess as often as you like, because a wrong answer costs nothing but the seconds it took.",
};
// A bonus run is short by design — these sit beside the main game, they don't replace it.
export const BONUS_ROUNDS = 10;
export const BONUS_SLIP_SECONDS = 20;   // reading a whole line takes longer than naming a title
export const BONUS_NAME_SECONDS = 15;
export const BONUS_BLANK_SECONDS = 20;  // read the line, find the gap, then type — slip's budget
// Redacted's clock is a backstop rather than a pressure: the cost of thinking here is already
// the strips you peel while you think, so a tight clock would charge you twice for the same
// hesitation. Long enough to read two or three lines, weigh the blocks and write a title;
// short enough that sitting on a page you can't place is a decision rather than a free wait.
export const BONUS_REDACT_SECONDS = 30;
// A correct answer never scores nothing, however much of the verse was uncovered — otherwise a
// page you have over-peeled becomes pointless to finish, which is the one thing the scoring
// must not do. Peels past the floor are simply free.
export const REDACT_MIN_POINTS = 1;
// Only Here's clock is not decoration. Without one the optimal play is to sit and mentally scan
// the song's whole lyric sheet, which is the free-recall failure the hand of six was built to
// cure coming back in through the side door. Long enough to read six words and commit, short
// enough that agonising is expensive. Down from the 30 the typed version needed.
export const BONUS_ONLY_SECONDS = 20;
// Pages 1 to ONLY_WIDE_PAGES deal a WIDE hand with an obvious outlier; after that the hand is
// COMPRESSED, with several words in the same one-to-three band and a false exotic among them.
// Hand composition is the only ramp this game has, since there is nothing else left to move.
export const ONLY_WIDE_PAGES = 3;
// Then What's clock is PER PICK, not per page, and it is load-bearing rather than decoration:
// without it the optimal play is to sit and reason about three lines, which drains the
// sing-it-forward instinct the whole game exists to test. Long enough to read three lines and
// commit, short enough that deliberating costs you the pick.
export const BONUS_CHAIN_SECONDS = 11;
// Pages 1 to CHAIN_EASY_PAGES keep the chain inside one section; after that it is allowed to
// cross a section boundary, which asks a harder question — does the verse hand off to the
// chorus, the pre-chorus, the bridge? — and tests the song's architecture rather than its lines.
export const CHAIN_EASY_PAGES = 3;
// What counts as spotting the impostor on sight (the Saw It Coming charm). Read against the
// page's own baseline, not the clock's remaining seconds, so it stays honest if a game's clock
// is ever retuned under it.
export const BONUS_SNAP_MS = 2000;

/* ---------- Ruthless Game ----------
   The one game here with no clock to beat, because the clock IS the score: a page runs until
   it is named, and the run is the seconds it took, lowest wins. So there is no per-page budget
   in this block, only the pace the song comes out at and the price of walking away.

   A word a second, from the song's own first word. Deliberately NOT player-paced: a "pull the
   next word now" key was specified and cut, because pulling a word early either costs nothing
   (and then mashing it is the correct play, which turns the game into a reading-speed test) or
   costs exactly the second it saves (and then it is a comfort feature that hands the player the
   metronome). The whole character of the thing is that the metronome does not care about you.

   The give-up is an anti-deadlock valve rather than a fail state, and the price is set high on
   purpose: above what a bad honest page costs, so it is never a shortcut, only a mercy for a
   player who can already tell they are going to sit through another forty words to get there.
   It unlocks only after a real attempt so it can never be a reflex. */
export const RUTHLESS_WORD_MS = 1000;
export const RUTHLESS_OPEN_WORDS = 1;    // on the page before the first tick, so it never opens blank
// The give-up's two numbers are NOT constants any more and must not come back as a pair: six
// lenses whose medians run from 22 to 79 words cannot share one price. They are derived per lens
// from its own median by `ruthlessGiveUp` in js/bonus.js, holding the two ratios instead.
// What the gauge fills over. Nothing happens when it fills — there is no deadline here — it is
// purely a read on how expensive this page is getting, which a bar can say faster than a number.
export const RUTHLESS_PACE_SECONDS = 45;
/* The board ladder: a run total, in seconds, that every one of the six lenses has to come in
   under. Deliberately FLAT rather than scaled off each lens's median, which is the one place
   this mode breaks its own house rule and does so knowingly — the give-up and the snap are
   priced per lens because they are offers the mode makes to the player, and an offer has to be
   fair on the lens it is made on. A standard is not an offer. Verse 2 at a 79-word median is
   genuinely harder to bring under 45 seconds than Chorus at 22, and that gap IS the ladder:
   the top rung is meant to be a lens you dread, and knowing your second verses is what the
   mode is for. Absolute numbers also survive a lens being retuned, which per-lens rungs
   would not. */
export const RUTHLESS_RUN_RUNGS = [90, 60, 45];

/* ---------- The randomiser: one draw across everything the notebook can play ----------
   A launcher, not a game type. It picks a configuration and calls the same start function the
   player would have reached by hand, so a random run reports into its own mode's stats exactly
   as if it had been chosen from the shelf. Nothing here is sandboxed, because nothing here is
   new: the draw only decides WHICH existing run happens.

   Two rules shape the draw, and they pull in opposite directions.

   CATEGORY BALANCE. The leaves are wildly uneven — 32 challenges and 26 dark sides against one
   Custom preset — so a flat roll over every playable configuration would be a challenge machine
   that mentions Custom twice a year. Each category therefore carries its own share of the draw and
   splits it between its own entries, which is why `weight` below is a share of the whole and not
   a per-entry multiplier. The shares are an editorial hand, not a formula: they say roughly how
   much of the notebook each shelf is, damped so the big shelves can't drown the small ones.

   THE UNPLAYED LEAN. An entry you have never played counts RANDOM_UNPLAYED_WEIGHT times over
   inside its category. Because a category's total weight is the sum of its entries', a shelf you
   have barely touched also swells against one you have exhausted, so the lean works between
   categories as well as within them without a second rule to say so. It is a lean and never a
   filter: a played entry keeps a real share of the draw throughout. Once everything playable has
   been seen once, every multiplier is 1 and the draw settles into the category shares alone,
   which is the "completely random" end state.

   Playedness is tracked per token by the RANDOM_KEY ledger (storage.js), NOT per configuration.
   Album Focus is the reason: playing Midnights once is knowing Midnights, so it marks
   `album:midnights` and every difficulty of it counts as seen. Guests and Infinite variants
   follow the same reading. A plain difficulty run is the exception where the difficulty IS the
   thing drawn, so it tokenises per mode. */
export const RANDOM_UNPLAYED_WEIGHT = 4;
// `weight` is a share of the draw; the numbers are relative and don't need to total anything.
// `empty` categories (no unlocked entries yet, no guest fetched, today's daily already played)
// simply contribute nothing and the rest re-normalise around them.
export const RANDOM_CATEGORIES = [
  { id: "difficulty", weight: 12, label: "a difficulty" },
  { id: "infinite",   weight: 8,  label: "Infinite" },
  { id: "album",      weight: 14, label: "Album Focus" },
  { id: "guest",      weight: 5,  label: "a guest" },
  { id: "challenge",  weight: 22, label: "a challenge" },
  { id: "dark",       weight: 14, label: "a dark side" },
  { id: "bonus",      weight: 12, label: "a bonus game" },
  { id: "ruthless",   weight: 8,  label: "Ruthless Game" },
  { id: "daily",      weight: 8,  label: "the daily" },
];

/* ---------- Challenge returns ----------
   Tokens only mint on a first-ever defeat, so a player who cannot beat what is in front of
   them needs a route back out. After seven completed base runs, an undefeated token-bought
   challenge can be returned to the locked shelf for its token. The challenge keeps its
   history and can be unlocked again later; quitting and dark-side runs never count. */
export const CHALLENGE_RETURN_RUNS = 7;

export const CHALLENGES = [
  { id: "vanishing-word", name: "Vanishing Word", rule: "vanishing", mode: "medium",
    free: true,  cost: 1, target: 10, revealMs: 1500, tapes: 1,
    // Dark: less time AND less to read. `wordScale` is the fraction of normal size the prompt
    // renders at. It stays a DIFFERENT thing to Smallest Song, though: small and centred, and
    // it keeps its highlighter swipe. This one isn't asking you to hunt for the word, only to
    // read it before it's gone.
    // Playtested 2026-09-03 and retuned: at 600ms and 0.3 the word was still perfectly
    // legible at a glance, and once it has been READ the vanish costs nothing — you already
    // have the word. So the lever that matters here is not the timer, it is how expensive the
    // first read is. `wordFlip` turns the prompt 180 degrees (a familiar word inverted has to
    // be worked out rather than recognised), the scale drops again, and the blink shortens on
    // top of both. Small + upside down + gone is three obstacles to one act of reading, which
    // is the challenge the card has always claimed to be. The flip is deliberately carrying
    // most of the new weight: the scale and the timer move one notch each rather than two,
    // because 10/13 is still the bar and three hard nerfs at once would move the target as
    // well as the difficulty. Retune the three numbers together, never one alone.
    // Playtested again 2026-09-04: the flip was doing its job, but 0.26 still read as merely
    // small, so the scale alone moved on to 0.18 — around 9-14px against the base clamp, which
    // is a word you have to lean into rather than one you take in at a glance. The timer and
    // the flip stayed where they were, since the finding was about the size and nothing else.
    hard: { revealMs: 500, wordScale: 0.18, wordFlip: true,
      desc: "The word is tiny, upside down, and gone in a blink.",
      win: "Score 10 / 13 off a word you barely got to read." },
    desc: "The word vanishes quickly, so pay attention.",
    win: "Score 10 / 13 with disappearing words." },
  { id: "deep-cut", name: "Deep Cut", rule: "album5", mode: "easy",
    free: false, cost: 1, album: null /* any single album */, need: 5, tapes: 1,
    hint: false, blurb: "15s · suggestions · common words",
    // Dark: the album is DEALT, not chosen. `randomAlbum` makes startChallenge pick a studio
    // album at run start and pin it to `album`, so the run can't be steered onto whichever
    // album happens to be going well — and it wants six, not five.
    // The copy is overridden too, unlike most dark sides: this card's wording states the
    // number out loud ("five"), so reusing it on a dark run would misstate the win condition.
    hard: { need: 6, randomAlbum: true,
      desc: "Guess six correct songs from one album, and the album is dealt to you.",
      win: "Answer 6 correct songs from the album you were dealt." },
    desc: "Guess five correct songs from the same album.",
    win: "Answer 5 correct songs from one album." },
  { id: "word-modifiers", name: "Word Games", rule: "wordfx", mode: "medium",
    free: false, cost: 1, target: 9, noTitle: false, tapes: 2,
    // `fxFrom` starts the ladder partway up (page 1 is already warped, no gentle opening) and
    // `fxRamp` climbs it twice as fast, so the run tops out at full nonsense by the halfway mark.
    hard: { dropdown: false, fxFrom: 2, fxRamp: 2,
      blurb: "10s · no suggestions · all words · title words allowed",
      desc: "The word is already warped on page one, and it falls apart twice as fast from there.",
      win: "Score 9 / 13 through the worst of the distortion." },
    blurb: "10s · suggestions · all words · title words allowed",
    desc: "The word becomes more warped every round, can you still beat it when it becomes nonsense?",
    win: "Score 9 / 13 through the distortion." },
  { id: "one-of-a-kind", name: "One Of A Kind", rule: "newsong", mode: "easy",
    free: false, cost: 1, guesses: 3, tapes: 1,
    // The run ENDS on the named song, and the page it landed on is the score — low wins, and
    // it is the one card on the shelf scored that way (see markChallengeDefeated's `lower`).
    // Playtested 2026-09-04: the old run played all thirteen pages whether or not the song had
    // already been found, so the last nine pages could not change the outcome and the number
    // the card kept was a page tally that had nothing to do with the win. Ending on the answer
    // makes the record "found it on page four" — a thing to beat rather than a thing to sit out.
    // One guess, not three. The copy states the number out loud, so it has to move with it.
    hard: { guesses: 1,
      desc: "You're given one specific song you've never answered before. Answer it on a round where it fits the word, and the run ends the moment you do. You get ONE guess, so be sure before you commit.",
      win: "Answer the named song first time, with a single guess — the earlier the page, the better." },
    desc: "You're given one specific song you've never answered before. Answer it on a round where it fits the word, and the run ends the moment you do. You have three guesses, and getting it wrong costs you a guess.",
    win: "Answer the named song before your 3 guesses run out — the earlier the page, the better." },
  { id: "choose-your-path", name: "Choose Your Path", rule: "path", mode: "medium",
    free: false, cost: 1, target: 9, forks: [4, 8], tapes: 1,
    desc: "Pick perks at forks in the run that help you get ahead.",
    win: "Score 9 / 13 — your way." },
  { id: "wildcard", name: "Wildcard", rule: "wildcard", mode: "medium",
    free: false, cost: 1, target: 9, noTitle: false, tapes: 2,
    // Dark: two sub-rules at once. `stack` is read by applyWildcardRound, which only offers
    // PAIRS whose intersection still has a valid answer, and never pairs two visual gimmicks
    // (one is instant, one is timed — stacking them would start the vanish behind the curtain).
    hard: { stack: 2,
      blurb: "10s · suggestions · all words · two rules change every page",
      desc: "Two rules are stacked on every page, and both change before the next one.",
      win: "Score 9 / 13 with two rules stacked on every page." },
    blurb: "10s · suggestions · all words · the rule changes every page",
    desc: "The rule changes every round, so keep up.",
    win: "Score 9 / 13 across shifting rules." },
  { id: "revolving-door", name: "Revolving Door", rule: "revolving", mode: "medium",
    free: false, cost: 1, target: 9, seconds: 20, rotateMs: 5000, noTitle: true, tapes: 1,
    hard: { seconds: 16, rotateMs: 2000,
      blurb: "16s a page · suggestions · not in the title · the word swaps every 2s",
      desc: "You get 16 seconds to answer, but the word swaps every 2 seconds. Answer whichever word is showing when you submit." },
    blurb: "20s a page · suggestions · not in the title · the word swaps every 5s",
    desc: "You get 20 seconds to answer, but the word swaps every 5 seconds. Answer whichever word is showing when you submit.",
    win: "Score 9 / 13 while the word keeps revolving." },
  { id: "shrinking-timer", name: "Shrinking Timer", rule: "accelerate", mode: "medium",
    free: false, cost: 1, target: 9, noTitle: true, pool: "easy", tapes: 2,
    accelFrom: 16, accelTo: 5,
    hard: { accelFrom: 12, accelTo: 3, pool: null,
      blurb: "suggestions · not in the title · all words · the clock shrinks every page (12s → 3s)",
      desc: "The timer shrinks each round, from 12 down to 3, and no word is off the table." },
    blurb: "suggestions · not in the title · the clock shrinks every page (16s → 5s)",
    desc: "The timer shrinks each round, from 16 down to 5.",
    win: "Score 9 / 13 as the clock keeps shrinking." },
  { id: "title-in", name: "Title...?", rule: "titleHas", mode: "medium",
    free: false, cost: 1, target: 9, noTitle: false, dropdown: false, tapes: 2,
    blurb: "10s · no suggestions · the word itself must be in the title",
    // Titles are judged strictly here whatever the notebook's stem setting says (see the
    // titleHas branch in refreshRound): "crazy" wants a title with "crazy" in it, not
    // "Crazier". The pool is built strictly to match, so every page still has an answer.
    desc: "Flip the script, name a song where the TITLE contains the word itself.",
    win: "Score 9 / 13, each answer's title holding the word." },
  { id: "short-title", name: "Short n' Sweet", rule: "shorttitle", mode: "medium",
    free: false, cost: 1, target: 9, pool: "easy", noTitle: false, tapes: 1,
    // `maxTitleWords: 1` drops the two-word allowance. The word pool tightens with it, so a
    // page always has a one-word title available to win with.
    hard: { pool: null, dropdown: false, maxTitleWords: 1,
      blurb: "10s · no suggestions · only one-word titles count",
      desc: "One-word titles only now. Two words is one too many.",
      win: "Score 9 / 13 using only one-word titles." },
    blurb: "10s · suggestions · only one- or two-word titles count",
    desc: "Only songs with one-word or two-word titles are allowed. Keep it short and sweet.",
    win: "Score 9 / 13 using only short titles." },
  { id: "lyric-lover", name: "Lyric Lover", rule: "verse", mode: "lyricist",
    free: false, cost: 1, target: 6, tapes: 3,
    hard: { target: 8,
      desc: "Answer by typing the lyric line, and do it word-for-word eight times.",
      win: "Recall 8 lines word-for-word (or better). Type the line exactly." },
    desc: "Answer by typing the lyric line, and do it word-for-word six times.",
    win: "Recall 6 lines word-for-word (or better). Type the line exactly." },
  { id: "lyric-ink", name: "Long Story Long", rule: "ink", mode: "medium",
    free: false, cost: 1, ink: 1100, seconds: 18, noTitle: false, dropdown: true, tapes: 3,
    // The only challenge scored in CHARACTERS rather than pages. Clearing a page and scoring
    // it are deliberately different things here: the lyric path already accepts any contiguous
    // run of four words that sings the prompt word, so the cheapest legal answer is about 18
    // characters and a page can always be passed for almost nothing. What the run asks is how
    // much of the passage around the word you dare write out before the clock takes the page
    // off you. Thirteen cheap answers is a spotless 13/13 and a lost run.
    //
    // NOT `mode: "lyricist"`, though it is a lyric challenge. Lyricist is lyricOnly, and that
    // shuts the title path — which is the whole reason the suggestions are on. Naming the song
    // banks its title's length (~14), a fast page you barely have to think about. Medium keeps
    // both paths open, and a typed line long enough to matter can't collide with the dropdown
    // anyway (titleMatchScore wants the query INSIDE a title, so a phrase past title length
    // ranks nothing). `noTitle: false` because a banned title would fight the rule: widening
    // validSongs is what puts more lyric on the page to write from.
    //
    // THE NUMBER WAS 400/600 AND IT WAS WRONG BY A FACTOR OF THREE. It was calibrated on ~2.5
    // characters a second, assuming recall and typing interleave — remember a bit, type it,
    // remember the next bit — which reads 400 as "about a median line (34 chars) every page".
    // Playtested 2026-09-02: 450 banked in THREE pages, ~150 a page, ~8 characters a second.
    // Somebody who holds the passage whole is not remembering while they type, they are
    // reciting, and they go at their ordinary touch-typing speed. So recall stops being the
    // constraint and the clock becomes the only one, which is the typing test the original
    // 23s dark side was written to avoid.
    //
    // WHICH IS WHY DARK NO LONGER BUYS MORE CLOCK. At 8 chars/sec five seconds is worth ~40
    // characters of headroom a page, more than the jump from one target to a higher one takes
    // away — so the old `seconds: 23` made the dark side EASIER per page than the base in
    // relative terms. Dark is the number alone now, on the same 18s.
    //
    // 1100 is ~85 a page: reachable at a recital pace, unreachable at a remembering one, and
    // it still pays for two or three pages where the word lands somewhere you don't hold a
    // long passage of. Both figures are a first re-tune off three pages of evidence, so they
    // are expected to move again once a full thirteen-page run has been measured.
    hard: { ink: 1500,
      desc: "The same page, a third as much again to fill, and not a second more to do it in. A title banked here is a page thrown away: on this side only the lines will do, and the long ones at that.",
      win: "Write 1500 characters across 13 pages." },
    blurb: "18s · suggestions · all words · title words allowed",
    desc: "Every page is scored by how much you WRITE. Sing the line around the word and keep going as far as you can: every character of it counts. Naming the song banks its title instead, quick and small. Submit before the clock dies, or the page banks nothing.",
    win: "Write 1100 characters across 13 pages." },
  { id: "wrapped-chain", name: "Wrapped Like A Chain", rule: "chain", mode: "medium",
    free: false, cost: 1, target: 6, noTitle: false, pool: "easy", tapes: 3,
    // Dark, REWORKED 2026-09-01 after playtest (fun 1/5, fairness 2/5). The first version took
    // the suggestions away, and that turned out to be the wrong thing to take. rankMatches
    // filters the dropdown through roundAcceptsSong, so on the base run the suggestions ARE
    // the list of legal links — pulling them leaves you spelling a full title blind against a
    // letter you are holding in your head, on a 10s clock, with no way of clawing back a page
    // once one goes wrong. It read as unwinnable rather than hard, and a player reaching for a
    // dropdown that is not there is not making a decision, they are just stuck.
    // So the suggestions come back and the dark side takes TIME and the easy bucket instead:
    // 8 seconds to find a link, every word in play, and eight links to make rather than six.
    // The dropdown still has to be READ and chosen from inside 8s, which is a real squeeze
    // without ever being a blank page. `pool: null` compounds with the letter — a rarer word
    // holds fewer songs, so fewer of them start with the letter you need — and pickChainWord
    // still guarantees an extendable word every page, a guard a WIDER bucket makes more
    // reliable, not less. `noTitle` stays off for the reason it always was.
    hard: { target: 8, pool: null, seconds: 8,
      blurb: "8s · suggestions · all words · each title starts with the last letter of the one before",
      desc: "The same chain on a shorter fuse. Eight seconds a link, no easy words, and two more links to make.",
      win: "Build a chain of 8 linked songs." },
    blurb: "10s · suggestions · each title starts with the last letter of the one before",
    desc: "Link your song answers like a chain, each song title must begin with the last letter of your previous answer.",
    win: "Build a chain of 6 linked songs." },
  { id: "on-tour", name: "On Tour!", rule: "setlist", mode: "medium",
    free: false, cost: 1, target: 9, noTitle: false, tapes: 2,
    // Dark: roundAcceptsSong filters the dropdown to tonight's album, so the base run's
    // suggestions ARE a live tracklist of the album you were dealt — take them away and you
    // have to recall the album unaided, which is the thing this challenge claims to test.
    //   The clock went 10s -> 12s on 2026-09-01 after playtest. The old note here said 10s was
    // deliberate because seconds would make a typed full title a typing race (the call Name
    // Three made) — but that reasoning was written for a page WITH suggestions, where the
    // dropdown does most of the typing. With them gone the player is recalling the tracklist
    // AND spelling the title out inside the same ten seconds, and the long titles this
    // catalogue is full of ran out of clock on recall the player already had. The extra two
    // seconds are paid to the typing, not to the remembering.
    //   `studioOnly` restricts the setlist to the twelve studio albums (STUDIO_ALBUMS). The
    // full album list runs to sixteen groups, and the extra ones are the deluxe and Taylor's
    // Version tails — the nights that deal the one-of-one words and the songs nobody has the
    // running order of. It was a dark-side lever first, on the reasoning that the base run's
    // dropdown covers for a night you don't know; playtesting says it doesn't. Being handed a
    // deluxe tail is a night you scroll a tracklist you have never heard rather than a night
    // you play, whether or not the list is in your hand, so it is a BASE lever now and the
    // dark side simply inherits it. Twelve albums over thirteen stops means exactly one album
    // comes round twice, which buildTourSetlist already handles by cycling.
    //   `noTitle: true` was considered and dropped. albumWordMap is built with
    //   validSongs(w, false, false), so a word can be in an album's pool ONLY because of a
    //   title-match song; with noTitle on, that page would have no legal answer. Fixing it means
    //   one map per noTitle setting (the shortTitleWordLists shape), and albumWordMap is both
    //   Deep Cut's pool and part of the guest-shelf corpus snapshot — two halves to keep in
    //   step for a modest gain on top of a lever that already carries the dark side.
    studioOnly: true,
    hard: { dropdown: false, target: 10, seconds: 12,
      blurb: "12s · no suggestions · you have to know the tracklists yourself",
      desc: "Same tour, no setlist in your hand. You have to know each album's songs yourself.",
      win: "Score 10 / 13 playing each album on cue." },
    blurb: "10s · suggestions · each page wants a song from that night's album",
    desc: "You're going on tour! A setlist of the twelve studio albums, one per page, and your answer must come from that night's album.",
    win: "Score 9 / 13 playing each album on cue." },
  { id: "its-a-clock", name: "It's A Clock!", rule: "combo", mode: "medium",
    free: false, cost: 1, target: 9, noTitle: false, pool: "easy", tapes: 2,
    // The shared-clock economy. comboBonus IS the break-even pace: a correct answer refunds
    // it, so answering faster than it nets time and slower bleeds it. The dark side drops
    // that pace 5s -> 3s, thins the opening cushion and lowers the ceiling so good play can
    // never bank a buffer to coast on. Suggestions deliberately stay ON: typing a title blind
    // costs 3-5s on its own, so removing them here would put break-even out of reach outright.
    comboStart: 20, comboBonus: 5, comboCap: 30,
    hard: { comboStart: 14, comboBonus: 3, comboCap: 20, pool: null,
      blurb: "one shared clock, and less of it · every right answer winds it back up by less · all words" },
    blurb: "one shared clock · every right answer winds it back up · run it dry and it's over",
    desc: "Per-page timers. Who needs them? How about one shared clock that drains across the whole run. Every correct answer increases the timer, and the run ends when it hits zero.",
    win: "Score 9 / 13 before the shared clock runs out." },
  { id: "switch-up", name: "Switch-Up", rule: "switchup", mode: "medium",
    free: false, cost: 1, target: 9, seconds: 12, noTitle: false, tapes: 1,
    blurb: "12s · each page wants EITHER a title OR a sung lyric line · it keeps switching",
    desc: "Sometimes answer with a lyric line, sometimes answer with the song's title. It switches up randomly, so read the switch before you answer.",
    win: "Score 9 / 13 as the answer type keeps switching." },
  { id: "double-trouble", name: "Double Trouble", rule: "multi", mode: "medium",
    free: false, cost: 1, target: 8, need: 2, pool: "easy", seconds: 18, tapes: 2,
    // Dark: still TWO songs a page, on a tighter clock, but every song named is spent for
    // the rest of the run. Deliberately not `need: 3`, which lands on Name Three's headline.
    // `multi` is the only rule the roster runs twice, so the two cards have to differ by axis
    // and not just by number. Here the wall is the catalogue draining under you: the early
    // pages are ordinary Double Trouble and the late ones are played on what is left.
    // `pool: null` is load-bearing, not flavour. On the base entry's common words a page has
    // twenty to thirty-five holders, so spending two of them a page is a rule the player would
    // never once feel; off the whole word list the holder lists are short enough that a title
    // burned on page three is a title genuinely missing on page nine.
    hard: { seconds: 15, noRepeats: true, pool: null,
      blurb: "15s · suggestions · rarer words · two songs a page · no repeats all run · not in the title",
      desc: "Rarer words, two songs a page, and each song you name is spent for the rest of the run.",
      win: "Clear 8 pages, naming two songs each and never repeating one." },
    blurb: "18s · suggestions · name TWO different songs each page · not in the title",
    desc: "One song isn't enough! Answer two songs per word or fail the round.",
    win: "Clear 8 pages, naming two different songs each." },
  { id: "devils-path", name: "Devil's Path", rule: "devil", mode: "medium",
    free: false, cost: 1, target: 9, forks: [4, 8], tapes: 2,
    // Four forks instead of two. Curses are permanent and stack, so this relies on the
    // one-`time`-curse-per-run cap in the offer pool: two time curses already bottom the
    // page clock at its 3s floor, and In The Dark landing on top of that (typing full
    // titles blind in 3s) makes the run unwinnable by draw rather than by play. The cap
    // is live for BASE Devil's Path too, which is why base can no longer draw crunch+drain.
    hard: { forks: [3, 6, 9, 12],
      blurb: "10s · suggestions · at pages 3, 6, 9 & 12 you must take the lesser of two curses" },
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
  // ---- Tier C minigames (own input / lose-state). ----
  { id: "impostor", name: "Impostor", rule: "impostor", mode: "medium",
    free: false, cost: 1, target: 7, seconds: 15, tapes: 2,
    // Dark: more fakes, and cannier ones. `impostorCount` lifts the fakes from 4 to 5 (read
    // through impostorCountNow — one more chance to mis-flag, still one real page of slack
    // against the target of 7), `impostorHardWords` swaps the decoy pool for DARK_IMPOSTOR_WORDS
    // (the hardest-to-dismiss tier), and the clock drops 15s->10s. The target stays 7 real
    // answers, so the win copy is unchanged; only the difficulty of each call moves.
    hard: { seconds: 10, impostorCount: 5, impostorHardWords: true,
      blurb: "more fakes, harder to spot · flag the impostors, answer the real ones",
      desc: "Same game, tightened: MORE of the pages are impostors now, and the fakes are the kind of word you could swear you've heard her sing. Flag every impostor and answer the real ones — one wrong call still ends the run." },
    blurb: "some words are fakes · flag the impostors, answer the real ones",
    desc: "Most pages will show a real word that appears in lyrics, but some are IMPOSTORS that don't appear in any real Taylor songs. Flag the impostors and answer the real ones, but don't flag a real word or fail to flag an impostor because you'll instantly lose.",
    win: "Survive the run: flag every impostor and answer 7 real words." },
  { id: "sea-of-songs", name: "Sea of Songs", rule: "sea", mode: "medium",
    free: false, cost: 1, target: 9, seconds: 10, noTitle: false, tapes: 3,
    // Dark: fewer needles AND less time. `seaMinValid`/`seaMaxValid` (read through
    // seaMinValidNow/seaMaxValidNow) cut the genuine answers per grid from 2-4 down to 1-2, so
    // the same 16-tile sea hides as little as a SINGLE right song, and the clock drops 10s->7s.
    //   NOTE ON TRAPS: the original plan seeded "trap" tiles — titles that hold the word but
    //   whose lyrics don't. A full-corpus scan found only 2 such (word, song) pairs across 733
    //   words (all "Mary's Song"), so a per-word trap can essentially never be drawn — it would
    //   be inert. The looser alternative (a title that merely LOOKS like the word, e.g. "star"
    //   vs "Starlight") is a word-perception gotcha, a design lane we deliberately avoid. So the
    //   dark side leans on the honest, plentiful squeeze instead of a trap that can't fire.
    hard: { seconds: 7, seaMinValid: 1, seaMaxValid: 2,
      blurb: "7s · no typing · a wide sea, as little as ONE right song · tap its title",
      desc: "The same sea of titles, but far fewer of them are right — sometimes only one — and you have less time to find it. Tap a title whose lyrics hold the word.",
      win: "Score 9 / 13 fishing the one right song from the sea." },
    blurb: "10s · no typing · a sea of titles · tap one whose lyrics hold the word",
    desc: "No typing this time. Instead, each page shows a sea of song titles, click one whose lyrics contain the word. There are multiple correct answers, but most are decoys.",
    win: "Score 9 / 13 fishing the right song out of the sea." },
  { id: "common-thread", name: "Common Thread", rule: "common", mode: "medium",
    free: false, cost: 1, target: 9, seconds: 3.5, noTitle: false, dropdown: false, tapes: 2,
    // Dark: a fourth line AND a tighter thread. `commonLines` (read through commonLinesNow) shows
    // four lyrics instead of three, so there's more to scan and a fourth constraint on the shared
    // word; `commonMaxAccept: 1` (commonMaxAcceptNow) makes the generator hunt for a page where
    // only the intended word threads every line, so lucky near-answers dry up. The clock drops to
    // 2.5s. Both are fair: the intended word is always accepted, and any genuine thread still
    // counts, so a rare page that can't reach a unique thread doesn't reject a legitimate answer.
    hard: { seconds: 2.5, commonLines: 4, commonMaxAccept: 1,
      blurb: "2.5s · four lines now, and only one word threads them all",
      desc: "Throw everything you know about this game out the window. Four lyrics from four different songs, and one word runs through every one of them — nothing else will do. Can you find it in 2.5 seconds?",
      win: "Score 9 / 13 finding the one thread through four lines." },
    blurb: "3.5s · the game flips: three lines, one word runs through all of them",
    desc: "Throw everything you know about this game out the window. This time you are shown three lyrics from three different songs and you need to type the word they all share. Can you do it in 3.5 seconds?",
    win: "Score 9 / 13 finding the thread." },
  // ---- Knowledge-flex batch. tapes:0 (unrated) until they've been played enough to
  //      rate honestly; seals are placeholders pending real motifs. ----
  { id: "odd-one-out", name: "Odd One Out", rule: "oddone", mode: "medium",
    free: false, cost: 1, target: 9, seconds: 12, noTitle: false, dropdown: false, tapes: 2,
    // Dark: a wider grid AND a shorter clock. `tiles` (read everywhere through oddTilesNow)
    // widens the board to 6, so the odd one hides among five genuine holders rather than
    // three — nearly twice the songs to rule out, in two thirds of the time. The word picker
    // filters to words with enough holders to fill the wider grid, so it can't quietly
    // collapse back to a four-tile page. All three copy sites state the count, so all three
    // move with it.
    hard: { seconds: 8, tiles: 6,
      blurb: "8s · no typing · six songs, five hold the word · tap the one that doesn't",
      desc: "Six songs now, and the word hides in the lyrics of five of them. Only one never sings it, and you have less time to find it.",
      win: "Score 9 / 13 spotting the odd one out of six." },
    blurb: "12s · no typing · four songs, three hold the word · tap the one that doesn't",
    desc: "Four songs, and the word hides in the lyrics of three of them. Tap the odd one out, the only song that never sings it.",
    win: "Score 9 / 13 spotting the odd one out." },
  { id: "whose-line", name: "Whose Line?", rule: "whoseline", mode: "medium",
    free: false, cost: 1, target: 10, seconds: 5, noTitle: false, dropdown: false, tapes: 1,
    // Dark: a thinner line AND a shorter clock. `hardLines` drops the song's hook (any line it
    // repeats — the chorus names the track on sight) and draws from the WHOSE_HARD_POOL
    // shortest distinct lines rather than any of them, and `minWords` lowers the floor so
    // those shorter lines are in the draw at all. buildWhosePuzzle falls back to the base draw
    // if the corpus can't produce a hook-free line, so this never costs a playable page. The
    // clock was long held at the base eight on the theory that four songs couldn't be read any
    // faster; playtesting said otherwise on both sides, so the base moved to five and the dark
    // side to three, where reading speed is deliberately part of what's being tested.
    hard: { hardLines: true, minWords: 4, seconds: 3, target: 11,
      blurb: "3s · no typing · one thin line, never the chorus · name the song",
      desc: "No prompt word, and no chorus to lean on. You get one short line from deep in the lyric, four songs, and three seconds to know whose line it is.",
      win: "Score 11 / 13 placing lines with nothing to lean on." },
    blurb: "5s · no typing · one lyric line · name the song it came from",
    desc: "No prompt word at all. You get a single line of lyric and four songs, five seconds to place it, and no second guesses.",
    win: "Score 10 / 13 placing the line." },
  { id: "both-of-us", name: "Both Of Us", rule: "bothwords", mode: "medium",
    free: false, cost: 1, target: 9, seconds: 20, noTitle: false, pool: "easy", tapes: 2,
    // `bothMinSongs` is the winnability floor: a pair is only served if at least this many
    // songs hold every word on the page, so no page can be drawn unanswerable. Base asks for
    // two, which keeps a page from resting on one obscure song nobody could be expected to
    // find; the dark side drops to one, where the page really is that single song.
    bothMinSongs: 2,
    // Dark: a THIRD word, the last of the slack gone, and less time. `words` (read everywhere
    // through bothWordCountNow) is what the partner draw builds to, so the guard, the prompt
    // display, the soft reject and the reveal all widen together. All three copy sites state
    // the count, so all three move with it.
    // Playtested 2026-09-04 and the target came down with it. Three rare words sharing a single
    // song is a far narrower page than two, and nine of them was a ceiling you could play well
    // for a whole run and still not reach — the run stopped being about reading the pages and
    // started being about the arithmetic. Six of thirteen leaves room to lose the pages that
    // genuinely are unfindable and still win on the ones you can read. The bar moves; the page
    // itself is untouched, because the page was never the problem.
    hard: { seconds: 15, words: 3, bothMinSongs: 1, pool: null, target: 6,
      blurb: "15s · suggestions · THREE words · one song has to hold every one",
      desc: "A third word joins the page and the words get rarer. One song still has to hold all of them, and there may only be one that does.",
      win: "Score 6 / 13 naming songs that hold all three words." },
    blurb: "20s · suggestions · two words · name one song whose lyrics hold both",
    desc: "Two words on the page instead of one. Name a single song whose lyrics hold both of them, because half doesn't count.",
    win: "Score 9 / 13 naming songs that hold both words." },
  { id: "name-three", name: "Name Three", rule: "multi", mode: "medium",
    free: false, cost: 1, target: 8, need: 3, seconds: 30, noTitle: false, tapes: 3,
    // Double Trouble's rule, taken deeper: three songs a page instead of two, and drawn from
    // the whole word pool rather than the common one. `need` already drives the banner, the
    // soft reject and the winnability filter, so this is a registry entry, not new machinery.
    // `noTitle: false` overrides Normal's usual ban: finding three songs for one word is hard
    // enough without also ruling out the ones that wear it on the cover, and the titles are
    // the rung that gets a player from two songs to three.
    // Dark: a fourth song on the same thirty-second clock, the titles taken back off the
    // table, and a target lowered to keep the run survivable — four different songs for one
    // word is the wall, not the page count. The clock deliberately does NOT tighten: naming a
    // fourth song is already the whole difficulty, and taking seconds away on top would make
    // it a typing race instead.
    hard: { need: 4, target: 7, noTitle: true,
      blurb: "30s · suggestions · FOUR different songs a page · never in the title",
      desc: "Three wasn't enough. Four different songs for the one word, every page, in the same half minute — and the titles no longer count, so every one of them has to sing it.",
      win: "Clear 7 pages, naming four different songs each." },
    blurb: "30s · suggestions · name THREE different songs a page",
    desc: "One word, and three different songs that sing it. Anyone can name one. Three means you really know the catalogue. Songs with the word in the title count here.",
    win: "Clear 8 pages, naming three different songs each." },
  // ---- Risk batch. Four challenges over one shared bead economy: answering is ordinary,
  //      the difficulty is the DECISION you make around each answer. The currency is beads
  //      (`score`, the correct-answer count), so `challengeWinCheck`'s score >= target keeps
  //      working untouched — a wager just moves the number up or down. Two consequences the
  //      rest of the code has to respect: a run can END on more beads than it has pages (so
  //      nothing may render "20 / 13", see riskProgressText), and the bracelet still strings
  //      exactly one bead per page (a bead won at stake wears a horseshoe trinket instead).
  //      ONE RULE FOR EVERY DARK SIDE HERE: never tighten the answer. These rules multiply
  //      risk (a Press pot at depth n survives with p^n, an Insurance run needs p^13), so a
  //      dropped answer probability doesn't make the decision harder, it deletes the decision.
  //      Each dark side below moves the ECONOMY or the INFORMATION instead. Their targets are
  //      also the one place a dark number is pinned to a base that is still a first guess, so
  //      if a base target moves, move its dark one by the same delta rather than leaving it. ----
  { id: "press-your-luck", name: "Press Your Luck", rule: "press", mode: "medium",
    free: false, cost: 1, target: 20, seconds: 12, noTitle: false, tapes: 1,
    // Dark: no shallow banking. The base's dominant line is "ride to three, bank, repeat" —
    // four cycles of three pages at a pot of 6 is 24, past the target, and never more than
    // three answers of exposure at a time. `pressMinRide` (read through pressMinRide(), which
    // gates the between-pages offer) locks the pot until it is that deep, so pages one to three
    // of every ride are committed before you see them and the pot at risk is 6, not 1. The
    // run-end settle still banks whatever is riding, which is the honest escape valve on the
    // closing pages and stays exactly as it is.
    //   Target went 26 -> 30 on 2026-09-01 after playtest (fun 4/5, fairness 4/5 — the shape is
    // right, the bar was low: a clean run banked 34). Re-derived against pages, not EV. The
    // shallowest legal line is cycles of exactly three, worth 6 each: four of them fills twelve
    // pages for 24, and the thirteenth rides alone into the settle for 25. 26 therefore asked
    // for one ride of four (3+3+3+4 = 28) and nothing more. At 30 that line falls short too, so
    // the run has to carry either three rides of four (4+4+4+1 = 31) or one ride of five
    // (4+4+5 = 35) — a pot of 10 or 15 exposed to a single miss, which is the decision the
    // challenge is actually for. Base + 10.
    hard: { target: 30, pressMinRide: 3,
      blurb: "12s · suggestions · you cannot bank until three deep",
      desc: "Every correct answer drops beads into a pot, and each one you ride is worth more than the last. But the pot is locked until it is three pages deep, so there is no cashing out early and one miss inside that window wipes the lot.",
      win: "Bank 30 beads across the run." },
    blurb: "12s · suggestions · bank the pot or ride on, a miss wipes it",
    desc: "Every correct answer drops beads into a pot, and each one you ride is worth more than the last. Bank the pot whenever you like, but one miss wipes everything you haven't banked. Whatever is still riding when the 13 pages run out is yours.",
    win: "Bank 20 beads across the run." },
  { id: "confidence-wager", name: "Confidence Wager", rule: "wager", mode: "medium",
    free: false, cost: 1, target: 20, seconds: 12, noTitle: false, maxStake: 3, startBeads: 3, tapes: 1,
    // Dark: the axis here is INFORMATION, so that is what it takes. wagerTease sells two
    // readings of a face-down word — the rarity band worded, and your own lifetime record with
    // it. `wagerTeaseSelf` drops the objective half and leaves you betting on self-knowledge
    // alone, which is the thing the challenge is named after; a word you have never had says
    // exactly that, and with nothing beside it that reads as the warning it always was. Note it
    // REMOVES a fact rather than adding one, so the standing rule (never hand over anything the
    // word itself could be deduced from) is respected by construction.
    // `startBeads: 1` is a throttle, not flavour: the stake cap is min(maxStake, score), so
    // page one you can stake a single bead and the ceiling `maxStake: 4` opens only once you
    // have built a bankroll. adjustBeads floors at zero with no debt, so a big early miss
    // leaves you grinding +1 a page, which cannot reach the target — the run is decided in its
    // first four pages, which is the point.
    //   Target went 24 -> 30 on 2026-09-01 after playtest (fun 4/5 — the bet is right, the bar
    // was low: a run that cleared only ten of thirteen pages still finished on 39). Opening on
    // one bead the bankroll doubles at best each page it is fully staked, so 1 -> 2 -> 4 -> 8
    // reaches the old 24 inside six pages of confident play with the back half spare. 30 wants
    // the ceiling of four staked and landed deep into the run rather than banked away from once
    // the arithmetic is safe, which is the page this challenge is named after. Base + 10.
    hard: { startBeads: 1, maxStake: 4, target: 30, wagerTeaseSelf: true,
      blurb: "12s · suggestions · one bead to start · stake up to four, on nothing but your own record",
      desc: "The word is face down and this time the card tells you nothing about it. All you have is your own history with it, and one bead to build from. Stake up to four, answer it and the stake pays back double, miss it and it is gone.",
      win: "Finish the run on 30 beads." },
    blurb: "12s · suggestions · stake beads on a word you haven't seen yet",
    desc: "The word is face down. All you get is how widely it is sung and your own record with it, and on that you stake up to three beads. Turn it over and the clock runs: answer it and the stake pays back double, miss it and the stake is gone. A correct answer is always worth its own bead on top.",
    win: "Finish the run on 20 beads." },
  /* SHELVED (2026-07-28, second time) — Double Or Nothing is off the roster because it and Press
     Your Luck have converged into one challenge. They share the pot, the bank-or-ride offer, the
     wipe on a miss, 13 pages and a target of 20, and differ only in whether the pot escalates by
     adding or by doubling. That is a tuning difference wearing two seals, and it is not what the
     player experiences as a separate rule. This is NOT the scale-invariance problem that shelved
     the first version: the target fixed that, and the doubling rule below is sound in isolation.
     To bring it back, give it an axis Press Your Luck does not have rather than a steeper curve
     on the same one. The likeliest is escalating DIFFICULTY instead of stake, so the odds fall as
     the payout climbs: each step of a chain drawing a rarer word on a shorter clock, suggestions
     gone by depth three. Press Your Luck would then be how many pages you let ride, and this how
     deep you dare run one chain. Retarget from scratch if so, since p is no longer flat.
     The pot machinery in app.js is SHARED with Press Your Luck and stays live; only
     `doubleRuleActive()` goes permanently false. See PLAN.md.
  { id: "double-or-nothing", name: "Double Or Nothing", rule: "doubleup", mode: "medium",
    free: false, cost: 1, target: 20, seconds: 12, noTitle: false, tapes: 1,
    blurb: "12s · suggestions · let a page ride and the next one is worth double",
    desc: "Clear a page and it's worth one bead. Take it, or let it ride: the next page you clear is worth double, and the one after that double again. Miss while a chain is riding and every bead in it goes, and banking a page at a time can never reach 20.",
    win: "Finish the run on 20 beads." },
  */
  { id: "insurance", name: "Insurance", rule: "insurance", mode: "easy",
    free: false, cost: 1, target: 13, seconds: 15, tokens: 3, tapes: 2,
    // REWORKED 2026-09-01 after playtest (fairness 1/5, both sides). The bead economy is GONE
    // from this challenge — no tokenValue, no end-of-run cash-in for shields you never spent,
    // and `target: 13` now means the thirteen PAGES, read off roundResults rather than off a
    // bead total. Insurance is the one risk rule with no bet in it: every page is answer-or-die
    // and the only decision is whether to spend a shield, so a second currency laid over the
    // top was fluff at best. At worst it was a lie. The old sums made a shielded rescue cost
    // more beads than it saved, so the winning line was "answer all thirteen and cash the
    // shields in", which is a rule telling you not to use the mechanic it is named after; and
    // a page-one death still paid out three unspent shields, so the results screen congratulated
    // a run that lasted one page with six beads.
    // What is left is the rule as stated: survive all thirteen pages. A shield takes a miss for
    // you and nothing else does, so shields are pure survival and spending one is a straight
    // trade of a future rescue for this page. Untouchable (win with every shield unspent) is
    // what still rewards not needing them — a charm, where it belongs, rather than a tax on
    // the win condition.
    // Dark: sharpen the trade, never the answer. This is sudden death over 13 pages, so p
    // compounds savagely — taking the suggestions away would turn it into a lottery rather than
    // a harder challenge. So the dark side carries two shields where the base carries three,
    // and pays three seconds for them. 15s -> 12s is the only pressure on the answer itself, small
    // enough to leave the survival curve intact.
    hard: { tokens: 2, seconds: 12,
      blurb: "12s · sudden death · two shields · survive all thirteen pages",
      desc: "One miss ends the run. Two shields this time, three seconds less on the clock, and nothing else between you and the end of it.",
      win: "Survive all 13 pages." },
    blurb: "15s · sudden death · three shields · survive all thirteen pages",
    desc: "One miss ends the run. You start with three shields and may spend one before you answer: a shield takes that page's miss for you, and nothing else will. Spend them and they are gone.",
    win: "Survive all 13 pages." },
];
/* Both Of Us — the multi-word page. BOTH_WORDS prompt words are drawn per page (the dark side
   carries a wider `words`), and a set is only served once at least BOTH_MIN_SONGS songs hold
   every one of them (the entry's `bothMinSongs` raises that floor), so a page can never be
   drawn without an answer. BOTH_PARTNER_TRIES caps the partner scan so a hopeless anchor word
   can't stall the page turn. */
export const BOTH_WORDS = 2;
export const BOTH_MIN_SONGS = 1;
export const BOTH_PARTNER_TRIES = 400;
/* How many songs a missed page reveals. Each one is shown holding every word on the page, so
   two songs is already four or six lines of proof — the ceiling is the reveal staying readable,
   not the supply (a page is only served once bothMinSongs songs hold every word). Falls back to
   one song on a page that only had one. */
export const BOTH_REVEAL_SONGS = 2;
/* The risk batch's shared economy. Beads are `score`; these are the only numbers the four
   rules add on top of the per-challenge entries above.
   PRESS_RIDE_STEP: Press Your Luck's pot escalates — the first answer you ride is worth 1
   bead, the second 2, the third 3, and so on. Riding four deep is therefore a pot of 10 and
   banking every single page caps you at 13, which is what forces the gamble at a target of 20.
   RISK_MAX_STAKE / RISK_TOKENS are the fallbacks for the per-entry `maxStake` / `tokens`
   levers. (`startBeads` has no shared default: a run opens on nothing unless its own entry
   says otherwise.) There is no shield VALUE any more — Insurance's shields buy survival and
   nothing else since the 2026-09-01 rework; see its entry above. */
export const PRESS_RIDE_STEP = 1;
/* How deep a ride has to be before the bead that banks it earns the horseshoe trinket. Riding
   three pages is a pot of 6 against a target of 20, so it's a real commitment, not a shrug. */
export const PRESS_TRINKET_RIDE = 3;
/* And how deep before it earns the CHARM (Bonnie And Clyde). Kept separate from
   PRESS_TRINKET_RIDE on purpose: the horseshoe marks a bead worth marking and wants to be
   reachable most runs, while the charm is a flourish and should ask for a ride that is
   genuinely reckless. Five deep is a pot of 15 against a base target of 26, so banking it
   is most of a win riding on one page. Move the two independently. */
export const PRESS_FLOURISH_RIDE = 5;
export const RISK_MAX_STAKE = 3;
export const RISK_TOKENS = 3;
/* Long Story Long: how few pages the target may be filled in before The Ink Bleeds fires.
   The run is always thirteen pages, so this is a PACE, not an early finish: the remaining
   pages still play, and anything written on them is spare.

   THE NUMBER IS BOUNDED ABOVE BY THE CLOCK, not by taste, so it can be worked out rather
   than guessed. A page pays what you TYPE (lyricInk caps the credit at the span you actually
   matched), the page is 18 seconds, and the playtest that forced the 400 -> 1200 retune put a
   reciting player at ~8 characters a second. That is a hard ceiling of ~144 characters a
   page, and only if the typing starts the instant the word lands. Measured 2026-09-02: the
   median lyric line holding a prompt word is ~37 characters, so the base target's 85 a page
   is a little over two lines, and each page of this flourish is three or more.
     8 pages  -> 138 a page. 17.2s of unbroken typing out of 18. Effectively impossible.
     9 pages  -> 122 a page. 15.3s of typing, 2.7s to read the word and find the passage.
    10 pages  -> 110 a page. Real, but only 18% over the pace the base win already asks for.
    11 pages  -> 100 a page. Comfortably real.
   NOTE: this table was re-derived off the 1200 -> 1100 retune below by the same arithmetic,
   not by a fresh playtest, so INK_FLOURISH_PAGES staying at 10 (rather than moving to 9, now
   the closer analogue of the old "edge of the clock" row) has not been re-validated. Move it
   here and the charm's desc follows; the charm id carries no number, because this one is
   expected to move again once a real run has been measured.
   It reads the same on the dark side, where 1500 in ten pages asks 150 a page, over the
   ceiling. The dark flourish is currently out of reach, and that is the honest reading of
   an 18-second page, not a number to soften. */
export const INK_FLOURISH_PAGES = 10;
/* Odd One Out — the reject grid. Each page shows ODD_TILES songs, of which exactly one is the
   odd one: the word appears in NEITHER its lyrics nor its title (so the tile isn't an unfair
   "title matched but it's wrong" trap). Tapping the odd one scores; tapping any of the genuine
   ones loses the page. Built at runtime from currentSongs + allSongs, like the Sea grid. */
export const ODD_TILES = 4;
/* Whose Line? — the line-placement grid. One line is drawn from a source song and shown alone;
   WHOSE_TILES songs are offered, one of them the source. Lines are vetted: at least
   WHOSE_MIN_WORDS long (a three-word line is a coin flip), and never a line that contains its
   own song's title (which would hand the answer over). WHOSE_GEN_ATTEMPTS tries before we
   settle for the best line we saw. */
export const WHOSE_TILES = 4;
export const WHOSE_MIN_WORDS = 5;
export const WHOSE_GEN_ATTEMPTS = 24;
/* Dark side only: how many of a song's shortest distinct legal lines the draw picks from. Five
   because a corpus scan showed 99% of songs can fill a pool that size, and widening it from
   three costs only about a third of a word of average line length — nearly free variety. */
export const WHOSE_HARD_POOL = 5;
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
/* Challenges that currently have a dark side at all (i.e. carry a `hard` block). */
export const DARK_SIDE_IDS = CHALLENGES.filter((c) => c.hard).map((c) => c.id);
/* The mid-way dark-side charm's threshold. The "beat every dark side" charm deliberately has
   no constant: it counts DARK_SIDE_IDS, so it re-targets itself as dark sides are authored. */
export const DARK_SIDE_MILESTONE = 5;
/* Dark sides whose FULL design needs new rule code, so they are not yet expressed (or only
   partly expressed) in the `hard` blocks above. Listed here rather than added as inert
   parameters that would silently do nothing. This array is now EMPTY — every agreed dark side
   has shipped. The log below records what each one's levers do (and, for a couple, why an
   originally-specced idea was dropped). Keep the log if you extend the roster; a new dark side
   that needs rule code goes back into DARK_SIDE_TODO until it's real.

   Shipped since:
   - common-thread `commonLines` (4 on dark) shows a fourth lyric via commonLinesNow, routed
                  through the generator's candidate band, line draw and the panel lead; the
                  candidate band lifts its song-count floor to the line count so a 4-line page
                  always has enough songs. `commonMaxAccept: 1` (commonMaxAcceptNow) makes the
                  generator hunt for a unique thread. Both stay fair — the intended word is
                  always accepted and any genuine thread still counts, so a page that can't reach
                  a singleton never rejects a legitimate answer. Clock drops to 2.5s.
   - impostor     `impostorCount` (5 on dark, up from 4) seeds one more fake per run via
                  impostorCountNow — margin stays at one real page against the target of 7 —
                  and `impostorHardWords` swaps the decoy pool for DARK_IMPOSTOR_WORDS (a
                  zero-match-verified subset of the plausible-tier words) via impostorWordPool.
                  Clock drops to 10s. Count 6 was rejected as zero-margin (must clear every real
                  page) — the difficulty lives in the harder pool, not an unfair page count.
   - sea-of-songs `seaMinValid`/`seaMaxValid` (1/2 on dark) cut the genuine answers per grid
                  from 2-4 to 1-2 via seaMinValidNow/seaMaxValidNow, so the 16-tile sea can hide
                  a single needle; the clock drops to 7s. The originally-specced TRAP decoys
                  (title holds the word, lyrics don't) were DROPPED: a full-corpus scan found
                  only 2 such pairs across 733 words, so they'd be inert, and the looser lookalike
                  version is a word-perception gotcha we avoid. The squeeze is the honest lever.
   - odd-one-out  `tiles` (6 on dark) widens the board, read through `oddTilesNow` by the grid
                  builder, the layout (a data-cols="3" two-row board) and the word picker,
                  which now draws only words with enough holders to FILL the wider grid —
                  otherwise buildOddGrid's graceful shrink would hand the easy board back.
   - whose-line   `hardLines` drops the song's hook lines (any line it repeats) and draws from
                  the WHOSE_HARD_POOL shortest distinct lines instead of any legal one;
                  `minWords` lowers the floor so short lines are in the draw. buildWhosePuzzle
                  tries the hard draw first and falls back to the base one, because a failed
                  build renders a dead page. `seconds` and `target` squeeze on top.
   - vanishing-word `wordScale` (0.22 on dark) renders the prompt at that fraction of its
                  normal size and `wordFlip` turns it upside down. Both are read once in
                  applyChallengeRound ahead of the rule dispatch and cleared with the other
                  per-round word styling; CSS is [data-small] + --word-scale (scaling the base
                  clamp so it stays responsive) and [data-flip] on the WRAP, so the highlighter
                  swipe turns with the word. Deliberately NOT data-tiny: no drift, swipe kept —
                  reading, not hunting. The pair exists because a merely BRIEF word is free
                  once it has been read; the cost has to sit on the read itself.
   - devils-path  the category cap is live (one `time` curse per run, enforced in the offer
                  pool). It caps `time` ONLY — `restrict` and `wordfx` stack safely, since the
                  word picker guards restrict and the wordfx curses share one variable.
   - deep-cut     `randomAlbum` deals the album at run start, `need` lifts the tally to 6, and
                  the dealt run draws its words against that album (pickAlbumWord) so a page
                  with no in-album answer can't burn a page the player couldn't have avoided.
   - wildcard     `stack: 2` fuses two sub-rules per page (fuseWildcard / wildcardPairs), pairs
                  vetted for a surviving answer and capped at one visual gimmick.
   - short-title  `maxTitleWords` (1 on dark) is read by the pool, the suggestion filter, the
                  soft reject, the in-run banner and the win check via `maxTitleWordsNow`, so
                  they can never disagree about the rule. `shortTitleWordLists` keeps one pool
                  per limit, so a one-word run still gets winnable pages.
   - word-modifiers `fxFrom` starts the distortion ladder partway up and `fxRamp` climbs it
                  faster; both default to the base ramp and the level is still clamped to 4.
   - one-of-a-kind `guesses` sets the wrong-guess budget (1 on dark). `newSongLivesMax` holds
                  the run's budget so the pips and the intro cue match what you actually get.
                  Both sides end the run on the named song and bank the PAGE it landed on as
                  the record (newSongFoundPage), the shelf's only low-wins score.
   - on-tour      `dropdown: false` plus a target. rankMatches filters suggestions through
                  roundAcceptsSong, which for `setlist` means "from tonight's album", so the
                  base run's dropdown is a live tracklist and solves the rule for you. Removing
                  it IS the dark side. `studioOnly` then narrows the setlist to STUDIO_ALBUMS,
                  because the four non-studio groups are the deluxe and Taylor's Version tails
                  and nobody holds their running order; `seconds: 12` pays for spelling a full
                  title out unaided (both 2026-09-01).
   - wrapped-chain SAME lever, and it FAILED here — see the entry's own note. Chain's dropdown
                  is filtered to titles starting with the chain letter, so pulling it leaves a
                  blank page rather than a hard choice, and the playtest rated it 1/5 for fun.
                  The dark side now keeps the suggestions and takes `seconds: 8` and
                  `pool: null` instead. The lesson generalises: removing the dropdown is a real
                  dark-side lever only where the player can still get somewhere without it.
   - press-your-luck `pressMinRide` (3 on dark, read through pressMinRide()) locks the pot until
                  the ride is that deep, so showRiskDecision simply doesn't stop between pages
                  below the floor and renderRiskBanner says "locked" instead. Target base + 10:
                  the shallowest legal line (cycles of exactly three, 6 each) caps at 25 over
                  thirteen pages and 3+3+3+4 at 28, so 30 needs a ride five deep or three of four.
   - confidence-wager `wagerTeaseSelf` drops the rarity half of the card back, leaving only your
                  own record with the word — the objective read goes, the self-knowledge one
                  stays. It removes a fact rather than adding one, so the "never let the word be
                  deduced" rule holds by construction. `startBeads: 1` throttles the opening
                  because the stake cap is min(maxStake, score); `maxStake: 4` opens a ceiling
                  you have to earn. Target base + 10: staked to the ceiling the bankroll
                  doubles a page, so the old 24 landed inside six confident pages.
   - insurance    `tokens` 2 (against the base's 3) and `seconds` 12. There is no bead economy
                  here any more — the challenge was reworked on 2026-09-01 to be survival and
                  nothing else, on both sides, so the dark side is one fewer shield and three
                  fewer seconds. See the entry for why the beads went.
   THE STANDING RULE FOR THE RISK THREE: never tighten the answer. Those rules multiply risk
   (p^n on a Press pot, p^13 on an Insurance run), so a lower answer probability deletes the
   decision rather than hardening it. Move the economy or the information instead.
   Deliberately excluded: choose-your-path (its dark twin shipped as Devil's Path) and
   switch-up (a mid-round type flip rewards hesitating, which fights a speed challenge). The
   four Mastery-6 challenges are excluded too, and the reason is structural as well as tonal:
   the "beat every dark side" charm counts DARK_SIDE_IDS, so putting dark sides behind the
   Mastery ladder would drag that charm behind it and leave a player who has beaten every dark
   side they can reach unable to finish it. Title...? is excluded because it has nothing left to
   move: suggestions are already off, pickWord force-overrides its bucket to titleWordList
   regardless of `pool`, and 108 of that list's 157 words have exactly one correct title. */
export const DARK_SIDE_TODO = [];

/* ---------- Impostor challenge — decoy word pool ----------
   Plausibly-Swiftian words (romantic / aesthetic / literary vocabulary) that appear in
   ZERO songs. Verified against the whole corpus with the game's own matching core
   (scripts/words/mine_impostors.py imports js/match.js's logic) so none can stem-match a real
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
/* Impostor's dark side draws its fakes from THIS subset instead of the whole pool: the words
   most easily mistaken for a real Taylor lyric. Every entry is also in IMPOSTOR_WORDS (so it
   inherits the zero-match verification — a dark decoy is still always a fair "flag me"); this
   is a taste-curated "hardest tier", the emotional abstractions, luxury textures, romance-
   archaic and poetic-time words that sit closest to her actual register. The concrete
   geological / architectural nouns (granite, wharf, monsoon, steeple, …) are left OUT because
   a player can usually be sure she never sang them — they give the game away. Tune freely; the
   only hard rule is that each word must remain a member of IMPOSTOR_WORDS.
   (The dark fake COUNT lives on the challenge's `hard` block as `impostorCount: 5` — margin is
   6 - count against the target of 7, so 5 keeps one real page of slack; base is IMPOSTOR_COUNT
   = 4. It can't live here as a constant because CHALLENGES is evaluated before this export.) */
export const DARK_IMPOSTOR_WORDS = [
  "velvet", "satin", "chiffon", "cashmere", "ivory", "emerald",
  "gilded", "ornate", "opulent", "luminous", "translucent", "veiled",
  "wistful", "forlorn", "reverie", "rapture", "euphoria", "solitude",
  "serenity", "lament", "devotion", "adoration", "infatuation", "tenderness",
  "paramour", "suitor", "swoon", "smolder", "beckon",
  "ephemeral", "fleeting", "transient", "furtive",
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
  { id: "endurance", name: "The Long Game", icon: "trail",     tint: "78, 143, 99",   blurb: "Grows with the longest unbroken streak you hold in a run." },
  { id: "range",     name: "Discography",   icon: "records",   tint: "125, 104, 184", blurb: "Grows as your answers reach across more albums." },
];
export const SKILL_IDS = SKILLS.map((s) => s.id);
export const SKILL_BY_ID = Object.fromEntries(SKILLS.map((s) => [s.id, s]));

// XP-formula constants (consumed by foldSkillXp in app.js). All tunable.
export const TEMPO_BASE = 10, TEMPO_SPEED = 40;            // per fast correct answer: BASE + SPEED*speedFactor
export const LYRIC_TIER_XP = { base: 5, good: 15, perfect: 35, verse: 80 }; // keyed by gradeLyricRecall tier
export const LYRIC_LEN_REF = 8;                            // typed words for the 2x length-factor cap
// Endurance reads the run's longest unbroken correct streak (gameMaxStreak), not its length:
// a fixed-13 mode would otherwise pay the same constant every time, which is attendance
// rather than skill. BASE is set for PARITY with range, the other skill derived at the fold,
// so a clean 13-round run pays each of them about 115-120. GROWTH is gentle because the curve
// now has to mean something from round one instead of spending thirty rounds on runway. A deep
// Infinite streak still pays roughly 7x a clean classic, and the cap binds at a streak of 48.
export const ENDURANCE_BASE = 115, ENDURANCE_GROWTH = 1.055, ENDURANCE_RUN_CAP = 1500;
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
// and caps at MASTERY_MAX_LEVEL (the top of the reward ladder — Ultimate Showgirl).
// Each level costs STEP more ink than the one before it, so the cost of the level itself
// is BASE + STEP*(level-1) and the cumulative XP to REACH a level is the arithmetic
// series: BASE*level + STEP*level*(level-1)/2. Deliberately not a power curve like the
// skills above: this one has to stay sayable ("350 more each time"), it has to reach the
// dense early reward tiers quickly, and level 13 has to be the most expensive level in
// the game, which a flattening exponent could never do.
export const MASTERY_GATE = 40;
// The per-skill level MASTERY_GATE asks for if you spread it evenly across the five. The gate
// itself only counts the SUM, so it can be cleared badly lopsided — four skills coasting on one
// that is maxed. This is the number "Nothing Out Of Place" holds you to instead, and it derives
// from the gate rather than restating it so the charm can never drift from the shape of the
// thing it commemorates.
export const SKILL_EVEN_LEVEL = Math.round(MASTERY_GATE / SKILLS.length);
export const MASTERY_MAX_LEVEL = 13;
export const MASTERY_LEVEL_BASE = 800;   // ink for level 1
export const MASTERY_LEVEL_STEP = 350;   // extra ink each level asks over the last
export function masteryXpForLevel(level) {
  if (level <= 0) return 0;
  return MASTERY_LEVEL_BASE * level + MASTERY_LEVEL_STEP * level * (level - 1) / 2;
}
export function masteryLevelFromXp(xp) {
  let lv = 0;
  while (lv < MASTERY_MAX_LEVEL && (xp || 0) >= masteryXpForLevel(lv + 1)) lv++;
  return lv;
}

// The words the home-screen start button can wear (the level-12 reward), and the mark each
// one brings with it. Keyed by the reward's `payload.label`; "" is not in here, because the
// default is the button's own markup — the ✎ glyph and "Start writing" — and applySettings
// restores that rather than looking a default up.
//
// `mark` names a CTA_MARKS drawing, or "" for the deliberately unmarked one. Blank page is
// not a missing icon: the CTA centres its contents, so with the glyph suppressed and no mark
// child it reads as a clean bare button, which is the whole joke.
export const CTA_LABELS = {
  pen:     { text: "Grab a pen",           mark: "nib" },
  notepad: { text: "Write this down",      mark: "notepad" },
  nametag: { text: "I’ll write your name", mark: "nametag" },
  eye:     { text: "Draw the cat eye",     mark: "wingedeye" },
  paint:   { text: "Paint me golden",      mark: "paintbrush" },
  page:    { text: "Turn the page",        mark: "pagecurl" },
  blank:   { text: "Blank page",           mark: "" },
  begin:   { text: "Begin",                mark: "inkwell" },
};

// The marks those labels wear, in a namespace of their own — NOT ACH_ICONS or MASTERY_ICONS.
// Those two sets have to survive rendering as outlines AND filled; a CTA mark only ever
// renders one way, at 19px, on the gold button, so it is drawn for that single job.
//
// Every one of them is measured against the ✎ glyph the default still uses: 10.00px of ink
// height and ~33.98 ink area at 19px. That matching is the whole reason they read as a family
// beside it — a mark drawn at ordinary icon weight came out 138% of its height and 236% of
// its ink, and bullied the pencil badly. If you redraw one, measure it; do not eyeball it.
//
// Two rules hold them up. `currentColor` only, so the button's gold→ink hover inversion is
// inherited for free. And holes are `fill-rule="evenodd"` cuts, NEVER a var(--paper) knockout:
// on a dark page in the inverted state the knockout colour equals the mark colour, and the
// hole vanishes (this killed an earlier nib, which became a solid diamond). Rotation and
// scale are baked into the coordinates rather than carried on a transform wrapper.
//
// Stroke weights are INLINE STYLES, not stroke-width attributes, and have to stay that way.
// Each mark carries its own measured weight, but a presentation attribute loses to any CSS
// declaration — and the reward bento sets `.reward-bento .ink { stroke-width: 1.6 }` for the
// achievement glyphs it shows. On the attribute, all seven marks would silently thicken to
// 1.6 inside the Mastery picker and nowhere else; an inline style outranks the selector.
export const CTA_MARKS = {
  nib: `<svg viewBox="0 0 24 24"><path class="ink-fill" fill-rule="evenodd" d="M8.56 6.35L11.92 5.38A0.66 0.66 -16 0 1 12.74 5.84L12.97 6.65C14.4 7.93 15.37 9.78 15.32 11.8C15.28 13.82 14.44 15.93 13.71 17.96C12.01 16.63 10.18 15.28 9.07 13.59C7.96 11.9 7.81 9.82 8.34 7.98L8.11 7.17A0.66 0.66 -16 0 1 8.56 6.35Z M10.34 10.91A1.29 1.29 -16 1 0 12.83 10.2A1.29 1.29 -16 1 0 10.34 10.91Z M11.61 12.05L12.36 11.83L13.6 16.17L13.51 17.27L12.85 16.39Z"/></svg>`,
  notepad: `<svg viewBox="0 0 24 24"><path class="ink" style="stroke-width:1.05" d="M8.71 8.45L14.77 8.03A0.83 0.83 -4 0 1 15.65 8.79L16.19 16.5A0.83 0.83 -4 0 1 15.42 17.39L9.36 17.81A0.83 0.83 -4 0 1 8.48 17.04L7.94 9.33A0.83 0.83 -4 0 1 8.71 8.45Z"/><path class="ink" style="stroke-width:1.05" d="M9.51 6.73L9.71 9.58"/><path class="ink" style="stroke-width:1.05" d="M11.62 6.59L11.82 9.43"/><path class="ink" style="stroke-width:1.05" d="M13.73 6.44L13.93 9.28"/><path class="ink" style="stroke-width:1.05" d="M9.55 12.54L14.5 12.19"/><path class="ink" style="stroke-width:1.05" d="M9.73 15.11L13.4 14.85"/></svg>`,
  nametag: `<svg viewBox="0 0 24 24"><path class="ink" style="stroke-width:0.74" d="M6.42 7.32L16.68 6.42A1.23 1.23 -5 0 1 18.02 7.54L18.7 15.35A1.23 1.23 -5 0 1 17.58 16.68L7.32 17.58A1.23 1.23 -5 0 1 5.98 16.46L5.3 8.65A1.23 1.23 -5 0 1 6.42 7.32Z"/><path class="ink-fill" fill-rule="evenodd" d="M5.7 8.39L17.57 7.35L17.67 8.41L5.8 9.45Z"/><path class="ink" style="stroke-width:0.74" d="M8.14 14.14C9.27 11.68 10.9 14.79 12.16 13.79C13.2 12.91 13.52 11.42 14.77 12.77C15.5 13.49 16.2 13.77 16.85 13.49"/></svg>`,
  wingedeye: `<svg viewBox="0 0 24 24"><path class="ink-fill" fill-rule="evenodd" d="M2.77 13.56C6.28 7.71 13.56 6.41 17.98 9.79L22.14 6.28C20.97 9.66 19.41 12 17.33 13.69C16.68 10.83 14.86 8.88 12.39 8.1C8.75 6.93 5.24 9.92 2.77 13.56Z"/><path class="ink" style="stroke-width:1.2" d="M2.77 13.56C5.5 17.98 12.91 19.28 17.59 15.77"/><path class="ink-fill" fill-rule="evenodd" d="M7.38 12.52A2.02 2.02 0 1 0 11.42 12.52A2.02 2.02 0 1 0 7.38 12.52Z"/></svg>`,
  paintbrush: `<svg viewBox="0 0 24 24"><path class="ink-fill" fill-rule="evenodd" d="M6.35 16.43L11.16 10.55L13.45 12.84L7.57 17.65Z M10.09 10.09L12.27 7.38L16.62 11.73L13.91 13.91Z M11.31 9.25L11.79 8.66L15.34 12.21L14.75 12.69Z M12.15 7.27L15.89 4.9L19.48 7.72L16.73 11.85Z M14.1 8.14L16.81 6.27L17.35 6.81L14.71 8.75Z M15.63 9.67L17.77 7.15L18.3 7.69L16.24 10.28Z"/></svg>`,
  pagecurl: `<svg viewBox="0 0 24 24"><path class="ink" style="stroke-width:1.16" d="M8.05 6.65L15.12 6.28A0.73 0.73 -3 0 1 15.89 6.97L16.1 11.05L11.32 17.72L8.64 17.86A0.73 0.73 -3 0 1 7.87 17.16L7.36 7.42A0.73 0.73 -3 0 1 8.05 6.65Z"/><path class="ink-fill" fill-rule="evenodd" d="M16.1 11.05L11.32 17.72C10.5 15.99 9.99 14.37 9.96 12.78C12.02 12.37 14.06 11.77 16.1 11.05Z"/></svg>`,
  inkwell: `<svg viewBox="0 0 24 24"><path class="ink" style="stroke-width:1" d="M10.04 7.53L10.04 10.47L6.88 12.98L6.55 16.69A1.31 1.31 0 0 0 7.86 18.1L16.14 18.1A1.31 1.31 0 0 0 17.45 16.69L17.12 12.98L13.96 10.47L13.96 7.53Z"/><path class="ink-fill" fill-rule="evenodd" d="M8.95 6.01L15.05 6.01L15.05 7.53L8.95 7.53Z"/><path class="ink" style="stroke-width:1" d="M7.64 15.27L16.36 15.27"/></svg>`,
};

// The Pride finish is one Mastery-8 reward with a small collection inside it, rather than
// eight near-identical full-size CTA swatches on the reward board. These ids persist in
// settings.masteryButton just like every other button finish.
//
// Each flag carries its own colour ramp as data rather than as a CSS rule, and prideStripes
// below turns it into the gradient that the button wears in an inline --cta-stripes. That is
// what lets ONE ramp serve both the real start button and every preview of it: a per-flag CSS
// rule would have to be written again for the picker's chips, and eight ramps kept in two
// places is eight chances for a flag to be drawn wrong in one of them.
//
// The stops are deliberately left short of each other (a band ends at 15%, the next starts at
// 19%) so the colours bleed together the way felt-tips do on paper, matching the rest of the
// notebook. Widen a gap and you get a wash; close it and you get vinyl.
export const PRIDE_BUTTONS = [
  { id: "pride-rainbow",   name: "Rainbow Pride", stops: ["#d4574d 0 15%", "#dd8b3e 19% 32%", "#e4bf4c 36% 48%", "#6da668 53% 65%", "#5b8fc7 69% 82%", "#8b6cb2 86% 100%"] },
  { id: "pride-trans",     name: "Transgender",   stops: ["#5bcefa 0 20%", "#f5a9b8 24% 38%", "#fff 42% 58%", "#f5a9b8 62% 76%", "#5bcefa 80% 100%"] },
  { id: "pride-lesbian",   name: "Lesbian",       stops: ["#d52d00 0 17%", "#ef7627 21% 36%", "#ff9a56 40% 48%", "#fff 52% 57%", "#d162a4 61% 77%", "#a30262 81% 100%"] },
  { id: "pride-gay-men",   name: "Gay men's",     stops: ["#078d70 0 15%", "#26ceaa 19% 31%", "#98e8c1 35% 47%", "#fff 51% 58%", "#7bade2 62% 74%", "#5049cc 78% 89%", "#3d1a78 93% 100%"] },
  { id: "pride-bi",        name: "Bisexual",      stops: ["#d60270 0 40%", "#9b4f96 45% 57%", "#0038a8 62% 100%"] },
  { id: "pride-pan",       name: "Pansexual",     stops: ["#ff218c 0 30%", "#ffd800 35% 65%", "#21b1ff 70% 100%"] },
  { id: "pride-nonbinary", name: "Nonbinary",     stops: ["#fff430 0 23%", "#fff 28% 47%", "#9c59d1 52% 72%", "#222 77% 100%"] },
  { id: "pride-asexual",   name: "Asexual",       stops: ["#222 0 22%", "#a3a3a3 27% 47%", "#fff 52% 72%", "#800080 77% 100%"] },
];
export const PRIDE_BUTTON_BY_ID = Object.fromEntries(PRIDE_BUTTONS.map((f) => [f.id, f]));
// The gradient for a button finish, or "" if that finish is not a flag (every other finish
// paints itself from CSS and wants no inline stripes at all).
export function prideStripes(finish) {
  const flag = PRIDE_BUTTON_BY_ID[finish];
  return flag ? `linear-gradient(to bottom, ${flag.stops.join(", ")})` : "";
}

// Mastery rewards — one granted per Mastery level. `kind` drives how the Mastery screen
// renders/applies it; `payload` is kind-specific. The ladder runs 1–13 (pens, papers,
// trinkets, the super-hard unlock, then prestige titles) and 13 is the Mastery cap.
// `icon` (a MASTERY_ICONS key) is only carried by the kinds that actually draw a mark:
// pens, the two `unlock` milestones, and titles. The set kinds draw the thing itself
// instead — paper draws its stock as a swatch, trinkets the trinket, buttons a real start
// button in miniature, label words a real button wearing them — so they carry no icon at all.
export const MASTERY_REWARDS = [
  { level: 1, id: "pen-fountain", kind: "pen",  name: "Fountain pen",     icon: "fountainpen", desc: "Always write with a fountain pen.", payload: { pen: "fountain" } },
  { level: 2, id: "pen-quill",    kind: "pen",  name: "Feather quill",    icon: "feather", desc: "Trade your pen for a feather quill.", payload: { pen: "quill" } },
  { level: 3, id: "pen-glitter",  kind: "pen",  name: "Glitter gel pen",  icon: "gelpen",  desc: "A glitter gel pen, for the sparkle.", payload: { pen: "glitter" } },
  // Paper stocks — a set unlocked together at level 4. Each retints the page surface
  // (CSS body[data-paper="…"]); the swatch chip + apply path live in app.js.
  { level: 4,  id: "paper-manila",    kind: "paper", name: "Manila pad",     desc: "Warm kraft tan, like a legal pad.",   payload: { paper: "manila" } },
  { level: 4,  id: "paper-parchment", kind: "paper", name: "Aged parchment", desc: "Antique ivory, softly foxed.",        payload: { paper: "parchment" } },
  { level: 4,  id: "paper-blush",     kind: "paper", name: "Blush leaf",     desc: "A soft rose stationery.",            payload: { paper: "blush" } },
  { level: 4,  id: "paper-slate",     kind: "paper", name: "Slate pad",      desc: "Cool blue-grey engineer's stock.",   payload: { paper: "slate" } },
  { level: 4,  id: "paper-sage",      kind: "paper", name: "Sage ledger",     desc: "A cool green bookkeeper's stock.", payload: { paper: "sage" } },
  // Bracelet trinkets — a set unlocked together at level 5. Each swaps the trinket that
  // dangles from every correct-answer bead (the TRINKETS renderer in bracelet.js); the
  // verse pen-nib stays reserved. Selection persists in settings.masteryTrinket.
  { level: 5,  id: "trinket-heart",     kind: "trinket", name: "Heart trinket",     desc: "Hang a friendship heart.",       payload: { trinket: "heart" } },
  { level: 5,  id: "trinket-moon",      kind: "trinket", name: "Moon trinket",      desc: "A waxing crescent moon.",        payload: { trinket: "moon" } },
  { level: 5,  id: "trinket-daisy",     kind: "trinket", name: "Daisy trinket",     desc: "A little pressed daisy.",        payload: { trinket: "daisy" } },
  { level: 5,  id: "trinket-bow",       kind: "trinket", name: "Bow trinket",       desc: "A tied ribbon bow.",             payload: { trinket: "bow" } },
  { level: 5,  id: "trinket-pick",      kind: "trinket", name: "Pick trinket",      desc: "A guitar pick, for the stage.",  payload: { trinket: "pick" } },
  { level: 5,  id: "trinket-note",      kind: "trinket", name: "Note trinket",      desc: "A single eighth note.",          payload: { trinket: "note" } },
  { level: 5,  id: "trinket-lightning", kind: "trinket", name: "Lightning trinket", desc: "A bolt of lightning.",           payload: { trinket: "lightning" } },
  { level: 5,  id: "trinket-snake",     kind: "trinket", name: "Snake trinket",     desc: "A reputation serpent.",          payload: { trinket: "snake" } },
  { level: 6,  id: "hardmode-unlock", kind: "unlock", name: "Super-hard challenges", icon: "swords",  desc: "Unlocks a tier of brutal new challenges in Challenges mode." },
  // Start-writing button finishes — a set unlocked together at level 8. Each restyles the
  // home-screen hero CTA (CSS .play-cta[data-startbtn="…"], set on the button itself so the
  // reward board can preview them all side by side). Persists in settings.masteryButton,
  // applied by applySettings.
  { level: 8,  id: "btn-ink",    kind: "button", name: "Ink press", desc: "A solid ink-stamped start button.",   payload: { button: "ink" } },
  { level: 8,  id: "btn-blush",  kind: "button", name: "Blush",     desc: "A soft rose marker start button.",    payload: { button: "rose" } },
  { level: 8,  id: "btn-sky",    kind: "button", name: "Sky",       desc: "Cool blue, with little white clouds.", payload: { button: "sky" } },
  { level: 8,  id: "btn-meadow", kind: "button", name: "Meadow",    desc: "Spring green, with grass at the hem.", payload: { button: "meadow" } },
  // The only reward with a set inside it. `variants` is what chooseMasteryCosmetic will
  // accept in place of the payload's default, so a flag pick runs through the same unlock
  // guard as every other cosmetic instead of a picker of its own.
  { level: 8,  id: "btn-pride",  kind: "button", name: "Pride flags", desc: "Choose a flag for your start button.", payload: { button: "pride-rainbow" }, variants: PRIDE_BUTTONS },
  // Sticker hints — a level-9 milestone (grants no toggle), and the quieter half of a pair
  // with the level-10 vault below. This one only NUDGES: a locked sticker still shows as its
  // silhouette and still keeps its name and its `how` to itself, and gains a line pointing at
  // the kind of thing it wants. Level 10 then stops nudging and tells you outright, about the
  // other family. Deliberately weaker than its neighbour, because the silhouette IS the
  // question the sticker shelf asks and handing over the trigger would answer it.
  { level: 9, id: "sticker-hints", kind: "unlock", name: "Sticker hints", icon: "sticker", desc: "Nudges you toward every sticker you have not stuck down." },
  // Secret hints — a level-10 milestone (grants no toggle). Once earned, the achievements
  // page reveals how to earn each still-locked secret charm (its desc, name kept masked).
  { level: 10, id: "reveal-hints", kind: "unlock", name: "Secret hints", icon: "key", desc: "Reveals how to earn every secret charm." },
  // Start-button words — a set unlocked together at level 12. Each rewrites the label on the
  // home-screen hero CTA, and brings its own mark with it (CTA_LABELS below). Selection
  // persists in settings.masteryLabel; applied by applySettings, which owns the button's
  // contents. The pair with level 8 is deliberate: that tier owns how the button LOOKS, this
  // one owns what it SAYS, and a chosen label wears whichever finish is already selected.
  { level: 12, id: "cta-pen",     kind: "label", name: "Grab a pen",           desc: "Ask for a pen instead of a page.",     payload: { label: "pen" } },
  { level: 12, id: "cta-notepad", kind: "label", name: "Write this down",      desc: "An instruction, not an invitation.",   payload: { label: "notepad" } },
  { level: 12, id: "cta-nametag", kind: "label", name: "I’ll write your name", desc: "The notebook makes you a promise.",    payload: { label: "nametag" } },
  { level: 12, id: "cta-eye",     kind: "label", name: "Draw the cat eye",     desc: "A liner flick, drawn by hand.",        payload: { label: "eye" } },
  { level: 12, id: "cta-paint",   kind: "label", name: "Paint me golden",      desc: "For the button that already is.",      payload: { label: "paint" } },
  { level: 12, id: "cta-page",    kind: "label", name: "Turn the page",        desc: "The notebook, said plainly.",          payload: { label: "page" } },
  { level: 12, id: "cta-blank",   kind: "label", name: "Blank page",           desc: "The quiet one. No mark at all.",       payload: { label: "blank" } },
  { level: 12, id: "cta-begin",   kind: "label", name: "Begin",                desc: "One word, all momentum.",              payload: { label: "begin" } },
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
  { level: 13, id: "title-ultimate-showgirl", kind: "title", isDefault: true, name: "Ultimate Showgirl",          icon: "mic",     desc: "The capstone. Take a bow.",      payload: { title: "ultimate-showgirl" } },
  { level: 13, id: "title-ultimate-swiftie",  kind: "title", name: "Ultimate Swiftie",                            icon: "braceletring", desc: "You know all the words.",   payload: { title: "ultimate-swiftie" } },
];
export const MASTERY_REWARD_BY_ID = Object.fromEntries(MASTERY_REWARDS.map((r) => [r.id, r]));

// The mark each prestige TIER wears, in tier order (I–IV), and the single source of truth
// for it: the medallion rail reads it, and so do the two levels on the ascent track that
// open a tier. A tier's mark used to be derived from its default title's mark, which was
// fine until tier IV and Ultimate Showgirl were decided to be two distinct icons — a tier is
// a rank, a title is one of the several names you may wear inside it, and the capstone title
// had earned a mark of its own. Rather than special-case tier IV, all four tiers now take
// their mark from here. The anti-drift property is unchanged, just re-pointed: the track node
// and the medallion still read one source, this one.
export const MASTERY_TIER_ICONS = ["laurel", "bridge", "chair", "plumes"];

/* The reward board's eight tiles, each with a drawn mark beside its name. The hue is all that
   lives here; the drawings are the `#reward-*` symbols in index.html and the pair is assembled
   by rewardTileMarkHTML in app.js.

   One hue per TILE, not per reward. There are around forty rewards on that board and only
   eight things they can be — a pen, a paper, a trinket, a tier, a finish, some words, a hint, a
   title — so colouring the members would have painted forty arbitrary hues onto a page whose
   whole job is to show you five sets. The hue is a label for the set, and the members below it
   already show you exactly what they are.

   Keyed by the tile's grid-area name, which is also the reward `kind` everywhere a kind
   exists: the two vaults are the exception, since "unlock" covers both and they are two very
   different promises. Notebook hues only, in the register ACH_GROUP_COLORS uses — nothing
   here is allowed to be brighter than the ink it sits next to. */
export const MASTERY_TILE_MARKS = {
  pens:   "#3f5d8a",   // ink blue: the writing hand
  trinket: "#a8577a",  // friendship-bracelet rose
  paper:  "#8a6d3f",   // kraft tan, the colour of the stock itself
  hard:   "#8a3b2f",   // brick, for the brutal tier
  button: "#c8951f",   // the gold the start button already is
  cta:    "#2f6f6a",   // teal, so the words never read as the finish
  stick:  "#584a8c",   // ink violet: the shelf's own, held clear of the charm vault's plum
  hint:   "#6d3f5c",   // plum, matching the vault it opens
  title:  "#4a6b3f",   // laurel green, for the rank
};

// The mark each Mastery level wears on the hero's ascent track, and the single source of
// truth for it. Where a reward already defines the level's identity — the first pen, the three
// milestones — the level takes its mark FROM that reward rather than naming a second one, so
// the track node and the tile it points at can never drift apart; the two title levels here
// take the TIER's mark on the same principle, because a track node marks what the level
// opens (a whole tier) rather than one title inside it. The set levels (paper, trinkets, button
// finishes, flourishes) draw their rewards rather than a mark, so they name one here.
// Levels 2, 3, 9 and 11 are deliberately unmarked.
export const MASTERY_LEVEL_ICONS = {
  1:  MASTERY_REWARD_BY_ID["pen-fountain"].icon,
  4:  "book",
  5:  "gem",
  6:  MASTERY_REWARD_BY_ID["hardmode-unlock"].icon,
  7:  MASTERY_TIER_ICONS[0],
  8:  "rise",
  9:  MASTERY_REWARD_BY_ID["sticker-hints"].icon,
  10: MASTERY_REWARD_BY_ID["reveal-hints"].icon,
  12: "sparkle",
  13: MASTERY_TIER_ICONS[3],
};

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
   anniversaryAlbumFor). `blurb`/`caption` must paraphrase, never quote the lyric. A songday
   may also carry `headline` (a line to show instead of the song title) and `icon`/`mark`
   (a sticky/calendar mark other than the era heart).
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
  // The one songday whose note is the whole joke: no blurb, just the line fans say to each
  // other the moment the month turns. `headline` overrides the song title in the slip so the
  // dev milestone list still reads "August"; `icon`/`mark` swap the era heart for a salt
  // shaker, on the sticky and in the desk calendar's square.
  { md: "08-01", kind: "songday", title: "August",          album: "folklore",   eyebrow: "August 1st",
    headline: "get in the car it's august", icon: "salt", mark: "salt", caption: "it's august" },
];

// The salt shaker silhouette for the August 1st mark, in the same 32x32 box as the milestone
// sticky's heart and centred on (16, 16) so it drops into either transform unchanged. Shared
// rather than copied because two surfaces stamp it: the sticky (js/app.js) and the desk
// calendar's square (js/calendar.js).
//
// The whole job of this outline is to survive the calendar, where it is stamped about 10px
// wide with no room for the perforation dots the sticky can afford. Two shapes have failed
// there already and both failures are instructive. A flat lid sitting flush with the body
// is a JAR, which is what the first attempt read as. A semicircular dome over a squat body
// is a PADLOCK, which is what the second one read as — the crown and the seam together make
// a handle, and the heavier the ink the more certain the handle becomes.
//
// What is left is the diner-shaker profile, four steps that no jar and no padlock have:
// a barely-crowned cap NARROWER than the body, a lip that overhangs the cap on both sides,
// a neck pinched narrower than either, and shoulders flaring out to a body taller than it
// is wide — 14.4 by 16.8, because a body as wide as it is tall stops being a shaker and
// starts being an ink bottle. Those two pinches are the whole read, so if you redraw this keep
// neck < cap < lip < body, and keep the ink off them — 0.6px of outline already eats half
// the neck's 1.4px of concavity at calendar size.
// SALT_CAP_D is the lip line under the cap, drawn separately so each surface can weight it:
// it is an interior feature, so it wants LESS ink than the silhouette, not more.
export const SALT_SHAKER_D =
  "M12.3 5.2C12.3 4.1 14 3.4 16 3.4C18 3.4 19.7 4.1 19.7 5.2V9.2" +
  "H20.4C20.4 10.3 19.8 11.1 19 11.6C21.6 12.6 23.2 14.6 23.2 17.4V26" +
  "a2.4 2.4 0 0 1-2.4 2.4H11.2a2.4 2.4 0 0 1-2.4-2.4V17.4" +
  "C8.8 14.6 10.4 12.6 13 11.6C12.2 11.1 11.6 10.3 11.6 9.2H12.3Z";
export const SALT_CAP_D = "M11.6 9.2H20.4";

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

/* ---------- Guest-shelf stamp inks ---------- */
// The corner guest stamp is franked in a different colour every page load, the way a
// post office works through whatever plate is on the press that morning. Every one of
// these is dark enough to carry the cream silhouette printed over it, which is the
// only real constraint: a pale yellow would swallow the figure whole, so the yellow
// here is a deep ochre. Keep them printing inks, not screen colours.
export const STAMP_INKS = [
  "#b8392f",  // pillar-box red
  "#c9536f",  // rose
  "#96345f",  // plum
  "#6a4d92",  // violet
  "#35618f",  // royal blue
  "#2f7f80",  // teal
  "#4f7f4a",  // leaf green
  "#a8862a",  // ochre
  "#cc6a24",  // orange
];

/* ---------- Album colours (left-rule tint + tag on lyric cards) ---------- */
// The 12 studio albums (explicit so future pseudo-album groups — singles, holiday,
// features — don't dilute album-scoped achievements like The Eras Tour / Branch Out).
export const STUDIO_ALBUMS = [
  "Taylor Swift", "Fearless", "Speak Now", "Red", "1989", "reputation",
  "Lover", "folklore", "evermore", "Midnights",
  "The Tortured Poets Department", "The Life of a Showgirl",
];
/* Three named slices of the catalogue, for the Catalogue-knowledge charms that ask you to
   know where a song SITS rather than what it says. Held here as literals because none of
   them is derivable from songs.json: the vault list is a fact about the re-recordings, and
   the Album of the Year list is a fact about the Grammys.
   VAULT_TRACKS is the 26 From The Vault songs. They sit in a contiguous block at the tail of
   each Taylor's Version album in songs.json but carry no flag of their own, and deriving them
   from position would quietly break the first time a track is inserted. Deliberately excludes
   the two Red-era strays that share that tail without being vault tracks: "Ronan" (a charity
   single) and "State Of Grace (Acoustic Version)" (an alternate take of a standard track). */
export const VAULT_TRACKS = new Set([
  "You All Over Me", "Mr. Perfectly Fine", "We Were Happy", "That's When", "Don't You", "Bye Bye Baby",
  "Electric Touch", "When Emma Falls In Love", "I Can See You", "Castles Crumbling", "Foolish One", "Timeless",
  "Better Man", "Nothing New", "Babe", "Message In A Bottle", "I Bet You Think About Me", "Forever Winter",
  "Run", "The Very First Night", "All Too Well (10 Minute Version)",
  '"Slut!"', "Say Don't Go", "Now That We Don't Talk", "Suburban Legends", "Is It Over Now?",
]);
// The four albums that have won Album of the Year, and the four re-recordings that carry a
// vault. Both are ALBUM keys, so they read straight off a song's `album`.
export const AOTY_ALBUMS = ["Fearless", "1989", "folklore", "Midnights"];
export const VAULT_ALBUMS = ["Fearless", "Speak Now", "Red", "1989"];

/* Bead colours for the two rules where an album says nothing about the page, so the strand
   would otherwise string the notebook's era tint and look like it was picked at random.

   IMPOSTOR_BEAD is the fake: a page that was never a song at all, flagged rather than answered.
   A bruised violet-black, deliberately outside both album palettes and darker than every one of
   them, so a run reads at a glance as real pages in their album colours with the fakes struck
   through in ink. It pairs with the devil already dangling off those beads.

   COMMON_THREAD_BEADS is the ramp Common Thread's beads are strung along: how long the page took
   against its own clock, dark green for an instant read through to dark red for a thread pulled
   out with a tenth of a second to spare. The page is 3.5 seconds (2.5 on the dark side) and the
   only thing that distinguishes one cleared page from another is how fast you saw it, so that is
   what the strand should be a picture of. Three stops rather than two: green straight to red
   passes through a muddy brown around the midpoint, and the amber keeps the middle of the run
   legible as a middle rather than as a smear. */
export const IMPOSTOR_BEAD = "#3b2a4d";
export const COMMON_THREAD_BEADS = ["#1f6b3a", "#9a7b16", "#8f1d1d"];

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
  // hung trinkets: filled bead bodies (ink-fill) with inked detail (ink)
  star:    `<svg viewBox="0 0 24 24"><path class="ink-fill" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round" d="M12 2.3 L14.94 7.96 L21.22 9 L16.76 13.55 L17.7 19.85 L12 17 L6.3 19.85 L7.24 13.55 L2.78 9 L9.06 7.96 Z"/><path class="ink" stroke-width="0.9" opacity="0.7" d="M12 6.4 L13.1 9.2 L16 9.5"/></svg>`,
  // the whole set found: three polaroids fanned out of the shoebox, the top one face up.
  // Each card is paper-filled rather than class="ink-fill" so the front of the fan masks
  // the ones behind it instead of the outlines piling into a blot.
  polaroid: `<svg viewBox="0 0 24 24"><g transform="rotate(-4 12 12)"><path class="ink" fill="none" stroke-width="1.3" opacity="0.65" stroke-linejoin="round" d="M8 4.2 V2.2 H21.2 V17.6 H18.6"/><path class="ink" fill="none" stroke-width="1.5" opacity="0.85" stroke-linejoin="round" d="M5.4 6.2 V4.2 H18.6 V19.6 H16"/><rect class="ink-fill" x="2.8" y="6.2" width="13.2" height="15.4" rx="0.8"/><rect class="ink" fill="none" stroke-width="1.15" x="4.2" y="7.6" width="10.4" height="9.4"/><path class="ink" fill="none" stroke-width="1.15" d="M4.8 15.4 L7.6 11.6 L9.6 13.8 L13.2 9.4"/><circle cx="6.6" cy="9.8" r="1" fill="currentColor" stroke="none"/></g></svg>`,
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
  castle:  `<svg viewBox="0 0 24 24"><rect class="ink-fill" x="5" y="9.5" width="14" height="10.5"/><g class="ink-fill"><rect x="5" y="6.4" width="3" height="3.1"/><rect x="10.5" y="6.4" width="3" height="3.1"/></g><path class="ink-fill" d="M16 9.5 V7.6 L17.4 6.4 L19 7.4 V9.5 Z"/><path d="M10 20 V15.6 a2 2 0 0 1 4 0 V20 Z" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M14.8 9.5 L13.6 12.4 L15.4 14.2 L14.2 17.2" stroke="currentColor" stroke-width="1.15" fill="none"/><rect class="ink-fill" x="19.9" y="7.6" width="2.1" height="2.1" transform="rotate(18 20.9 8.6)"/><rect class="ink-fill" x="20.9" y="12.6" width="1.7" height="1.7" transform="rotate(-14 21.8 13.4)"/></svg>`,
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
  window:  `<svg viewBox="0 0 24 24"><rect class="ink-fill" x="4.6" y="3.2" width="14.8" height="16.4" rx="1"/><g class="ink" stroke-width="1.1"><path d="M12 5 V17.8"/><path d="M6.4 11.4 H17.6"/></g><path class="ink-fill" d="M6.4 5 C9 7 9.4 12 7.6 17.8 L6.4 17.8 Z"/><rect class="ink-fill" x="3.4" y="19.6" width="17.2" height="1.8" rx="0.7"/></svg>`,
  mirrorball: `<svg viewBox="0 0 24 24"><path class="ink" stroke-width="1.4" d="M12 1.2 V5.2"/><circle class="ink-fill" cx="12" cy="12.6" r="7.4"/><g stroke="currentColor" stroke-width="0.9" fill="none" opacity="0.9"><path d="M4.8 10 H19.2"/><path d="M4.7 12.6 H19.3"/><path d="M4.8 15.2 H19.2"/><path d="M12 5.2 V20"/><path d="M8.6 5.9 V19.4"/><path d="M15.4 5.9 V19.4"/><path d="M6.2 7.6 V17.7"/><path d="M17.8 7.6 V17.7"/></g><path class="ink-fill" d="M20.8 3.4 L21.4 4.7 L22.7 5.3 L21.4 5.9 L20.8 7.2 L20.2 5.9 L18.9 5.3 L20.2 4.7 Z"/><circle class="ink-fill" cx="3.4" cy="6.4" r="0.6"/></svg>`,
  diamond: `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M7 3.6 H17 L20.4 8.8 H3.6 Z"/><path class="ink-fill" d="M3.6 8.8 H20.4 L12 21 Z"/><g stroke="currentColor" stroke-width="0.9" fill="none"><path d="M3.6 8.8 H20.4"/><path d="M9.4 3.6 L7.6 8.8 L12 21"/><path d="M14.6 3.6 L16.4 8.8 L12 21"/><path d="M12 3.6 V8.8"/></g><circle cx="9.6" cy="6.1" r="0.6" fill="var(--paper)" stroke="none"/></svg>`,
  nib:     `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M12 2 L17 13 L12 22 L7 13 Z"/><circle cx="12" cy="10.5" r="1.7" fill="var(--paper)"/><path class="ink" stroke-width="1.2" d="M12 12.5 V21"/></svg>`,
  eyeclosed: `<svg viewBox="0 0 24 24"><path class="ink" fill="none" stroke-width="2" d="M3.2 9.4 C7.2 15.2 16.8 15.2 20.8 9.4"/><g class="ink" stroke-width="1.5"><path d="M5.2 12.8 L4 15.6"/><path d="M8.8 14.4 L8.2 17.2"/><path d="M12 15 V17.9"/><path d="M15.2 14.4 L15.8 17.2"/><path d="M18.8 12.8 L20 15.6"/></g><path class="ink-fill" d="M12 4.2 L12.5 5.4 L13.7 5.9 L12.5 6.4 L12 7.6 L11.5 6.4 L10.3 5.9 L11.5 5.4 Z"/></svg>`,
  tower:   `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M12 1.6 L12.7 4.2 H11.3 Z"/><g class="ink" stroke-width="1.4" fill="none"><path d="M11.2 4.5 C11 9 9.6 14.2 5.6 20.6"/><path d="M12.8 4.5 C13 9 14.4 14.2 18.4 20.6"/></g><g class="ink" stroke-width="1.1" fill="none"><path d="M10.2 8.6 H13.8"/><path d="M8.9 12.8 H15.1"/><path d="M7.6 16.9 C10.2 14.7 13.8 14.7 16.4 16.9"/><path d="M10.7 9.6 L13.4 11.9 M13.3 9.6 L10.6 11.9"/></g><path class="ink" stroke-width="1.4" d="M4.4 20.9 H19.6"/></svg>`,
  // a single water droplet — "Finally Clean" (the rain washed it all away)
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
  piano:   `<svg viewBox="0 0 24 24"><path class="ink" stroke-width="1.1" d="M10.1 6.8 C10.1 5 10.1 4 9.3 2.8 M9.3 2.8 L8.5 2.1 M9.3 2.8 L10 2"/><rect class="ink-fill" x="3" y="7" width="18" height="12" rx="1.4"/><g class="ink" stroke-width="1"><path d="M8.2 8.4 V17.6"/><path d="M12 8.4 V17.6"/><path d="M15.8 8.4 V17.6"/></g><g fill="currentColor" stroke="none"><rect x="6.9" y="8.4" width="1.5" height="5"/><rect x="10.7" y="8.4" width="1.5" height="5"/><rect x="14.5" y="8.4" width="1.5" height="5"/></g></svg>`,
  // an hourglass — is it over now?
  hourglass:`<svg viewBox="0 0 24 24"><g class="ink" stroke-width="2"><path d="M6 2.8 H18"/><path d="M6 21.2 H18"/></g><g class="ink" stroke-width="1.3" fill="none"><path d="M7 3.6 C7 8 10 9.6 11 12 C10 14.4 7 16 7 20.4"/><path d="M17 3.6 C17 8 14 9.6 13 12 C14 14.4 17 16 17 20.4"/></g><path class="ink-fill" d="M10.9 10.2 H13.1 L12 11.7 Z"/><g fill="currentColor"><circle cx="12" cy="13.6" r="0.4"/><circle cx="12" cy="15.2" r="0.4"/><circle cx="12" cy="16.8" r="0.4"/></g><path class="ink-fill" d="M8.2 20.4 C9.4 17.8 14.6 17.8 15.8 20.4 Z"/></svg>`,
  // a single leaf drifting as it falls — midrib, side veins, a bare stem (autumn leaves falling)
  leaf:    `<svg viewBox="0 0 24 24"><g transform="rotate(24 12 12)"><path class="ink-fill" d="M12 2 C16.5 5 18 9 16 13.5 C15 15.8 13.6 17 12 18 C10.4 17 9 15.8 8 13.5 C6 9 7.5 5 12 2 Z"/><path class="ink" d="M12 5 V21 M12 8.4 L15 10 M12 8.4 L9 10 M12 11.4 L14.6 12.8 M12 11.4 L9.4 12.8"/></g></svg>`,
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
  // a ticked checklist page — every song in the catalogue, named (I Knew Everything)
  checklist:`<svg viewBox="0 0 24 24"><rect class="ink-fill" x="4.2" y="2.8" width="15.6" height="18.4" rx="1.8"/><rect class="ink-fill" x="9.6" y="1.4" width="4.8" height="2.8" rx="1.2"/><g stroke="currentColor" stroke-width="1.35" fill="none"><path d="M6.7 7.8 l1.2 1.2 L10.3 6.6"/><path d="M6.7 12.6 l1.2 1.2 L10.3 11.4"/><path d="M6.7 17.4 l1.2 1.2 L10.3 16.2"/><path d="M12.6 8.2 H17.2"/><path d="M12.6 13 H17.2"/><path d="M12.6 17.8 H16"/></g></svg>`,
  /* ---- Challenge flourish charms (won the hard way) ---- */
  // the ruled line stays put; the word lifts off it in pieces and winks out, and you wrote into the blank
  vanish:  `<svg viewBox="0 0 24 24"><path class="ink" stroke-width="2" stroke-linecap="round" d="M3.6 20 H16.4"/><path class="ink" stroke-width="1.6" stroke-linecap="round" fill="none" opacity="0.85" d="M4.4 15.8 C5.6 14.1 6.5 16 7.7 14.5 C8.3 13.8 8.9 14.4 9.4 14.9"/><path class="ink" stroke-width="1.4" stroke-linecap="round" fill="none" opacity="0.55" d="M10.6 12 C11.6 10.5 12.4 12.1 13.4 10.9"/><circle class="ink-fill" cx="15.3" cy="9.4" r="0.95" opacity="0.6"/><circle class="ink-fill" cx="17.1" cy="7.2" r="0.7" opacity="0.45"/><path class="ink-fill" d="M19.7 2.3 L20.45 3.95 L22.1 4.7 L20.45 5.45 L19.7 7.1 L18.95 5.45 L17.3 4.7 L18.95 3.95 Z"/></svg>`,
  // one record, played all night; it wears its heart on the label
  heartlabel: `<svg viewBox="0 0 24 24"><circle class="ink-fill" cx="12" cy="12" r="9.4"/><circle cx="12" cy="12" r="4.6" fill="none" stroke="currentColor" stroke-width="1.1"/><g stroke="currentColor" stroke-width="0.8" fill="none" opacity="0.6"><circle cx="12" cy="12" r="6.4"/><circle cx="12" cy="12" r="7.9"/></g><path class="ink-fill" d="M12 14.9 C12 14.9 9.1 12.9 9.1 11.1 C9.1 10.1 9.9 9.4 10.75 9.4 C11.3 9.4 11.75 9.7 12 10.2 C12.25 9.7 12.7 9.4 13.25 9.4 C14.1 9.4 14.9 10.1 14.9 11.1 C14.9 12.9 12 14.9 12 14.9 Z"/></svg>`,
  // a thread climbing bead over bead, no rung repeated, tied off in a ribbon at the top
  // (NB: "bow" is taken by the archery charm further down)
  ribbon:  `<svg viewBox="0 0 24 24"><path class="ink" stroke-width="1.5" fill="none" d="M2.8 21.4 C8 20.4 12.4 15.6 15.4 8.6"/><g class="ink-fill"><circle cx="6" cy="20.5" r="1.1"/><circle cx="9.3" cy="18.1" r="1.2"/><circle cx="12" cy="14.6" r="1.3"/><circle cx="14" cy="11" r="1.4"/></g><path class="ink-fill" d="M16.2 7.4 C13.6 4.6 10.9 5 11.5 7.3 C12 9.3 14.3 9.2 16.2 7.4 Z"/><path class="ink-fill" d="M16.2 7.4 C18.8 4.6 21.5 5 20.9 7.3 C20.4 9.3 18.1 9.2 16.2 7.4 Z"/><circle class="ink-fill" cx="16.2" cy="7.4" r="1.2"/><path class="ink" stroke-width="1.3" fill="none" d="M17.4 8.5 C18 9.6 17.9 10.7 17.3 11.8"/></svg>`,
  // The risk three, drawn as one family: beads are the score on those boards, so all three
  // marks are about where the beads ended up rather than about the rule that moved them.
  // the pot driven off with: the beads you rode five deep piled on the roof of a getaway
  // car, wheels already turning. Still a mark about where the beads ended up, so it holds
  // the family; the loot being ON the car is the part you chose to do.
  getaway: `<svg viewBox="0 0 24 24"><g class="ink" stroke-width="1.15" opacity="0.5"><path d="M0.9 10.2 H3.1"/><path d="M0.6 13 H2.8"/><path d="M1.2 15.8 H3.4"/></g><g class="ink-fill"><circle cx="12.5" cy="6.6" r="1.35"/><circle cx="15.4" cy="6.6" r="1.35"/><circle cx="13.95" cy="4.1" r="1.35"/></g><path class="ink-fill" d="M4.8 17.6 V14.9 C4.8 14.1 5.3 13.6 6.1 13.5 L8.6 13.2 L10.8 10.2 C11.2 9.6 11.8 9.3 12.5 9.3 H16.3 C17.1 9.3 17.8 9.7 18.1 10.4 L19.2 13.1 L21 13.9 C21.7 14.2 22 14.7 22 15.4 V17.6 Z"/><g fill="currentColor" stroke="none"><path d="M12.4 10.7 H13.8 V13 H10.4 Z"/><path d="M14.7 10.7 H16.2 C16.5 10.7 16.7 10.9 16.8 11.1 L17.6 13 H14.7 Z"/></g><g class="ink-fill"><circle cx="8.7" cy="17.6" r="2.5"/><circle cx="18.4" cy="17.6" r="2.5"/></g><g fill="currentColor" stroke="none"><circle cx="8.7" cy="17.6" r="0.9"/><circle cx="18.4" cy="17.6" r="0.9"/></g><path class="ink" stroke-width="1.7" d="M2.4 20.6 H21.8"/></svg>`,
  // the shields never spent: three beads sitting under a bell jar, the glass unlifted
  belljar: `<svg viewBox="0 0 24 24"><circle class="ink-fill" cx="12" cy="3.1" r="1.25"/><path class="ink" stroke-width="1" d="M12 4.35 V5.3"/><path class="ink-fill" d="M5.6 19 V11.6 C5.6 7.9 8.5 5.1 12 5.1 C15.5 5.1 18.4 7.9 18.4 11.6 V19 Z"/><path class="ink" stroke-width="0.95" opacity="0.45" fill="none" d="M8.3 13.8 C7.6 11.3 8.4 8.9 10.4 7.4"/><g class="ink-fill"><circle cx="9.1" cy="17.3" r="1.5"/><circle cx="12" cy="17.3" r="1.5"/><circle cx="14.9" cy="17.3" r="1.5"/></g><rect class="ink-fill" x="3.4" y="19" width="17.2" height="2.3" rx="0.9"/></svg>`,
  // the lot shoved over the line, page after page — a heap of beads pushed to the edge of
  // the rule, with the shove still hanging in the air behind it
  allin:   `<svg viewBox="0 0 24 24"><g class="ink" stroke-width="1.1" opacity="0.5"><path d="M1.4 11.6 H3.9"/><path d="M1 14.4 H3.5"/><path d="M1.6 17.2 H4.1"/></g><g class="ink-fill" transform="rotate(5 12.6 15)"><circle cx="8.2" cy="17.5" r="1.9"/><circle cx="12.1" cy="17.5" r="1.9"/><circle cx="16" cy="17.5" r="1.9"/><circle cx="10.15" cy="14.1" r="1.9"/><circle cx="14.05" cy="14.1" r="1.9"/><circle cx="12.1" cy="10.7" r="1.9"/></g><path class="ink" stroke-width="1.7" d="M2.6 20.4 H21.4"/></svg>`,

  // the good glass, struck out: bubbles still climbing, one hard pen line straight through it.
  // The only one of the four Insurance marks that leaves the bead vocabulary, because this
  // charm is not a flourish — nothing was ridden or spent, the nice thing was simply lost.
  struckglass: `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M4.6 6.6 L19 6.2 C19.1 11.3 15.9 14 11.9 14.1 C7.9 14 4.5 11.4 4.6 6.6 Z"/><path class="ink" stroke-width="1.5" d="M11.9 14.1 L12.2 19.4"/><path class="ink" stroke-width="1.7" d="M8.2 20 Q12.2 21.2 16.1 19.7"/><path class="ink" stroke-width="2.3" d="M3.1 3.2 C8.5 8.5 15.1 14.7 20.9 20.6"/></svg>`,

  /* ---- Dark side milestone charms (the black seal's keepsakes) ---- */
  // the pub-sign dog, sat and waiting — your first walk into the dark
  blackdog: `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M3.3 7.2 C3.2 7.6 3.15 8.05 3.2 8.4 C4.2 9.0 5.2 9.15 6.0 9.1 C6.5 11.0 6.55 15.5 6.5 20.4 L8.8 20.4 C8.9 17.8 8.85 15.6 8.7 13.6 C9.9 14.9 11.5 15.4 12.7 15.9 C13.0 17.4 13.1 18.9 13.1 20.4 L17.5 20.4 C17.7 18.0 17.4 15.5 16.4 13.5 C15.2 11.1 13.0 9.3 10.9 8.2 C10.7 6.6 10.2 5.3 8.9 4.6 C7.3 3.9 5.4 4.4 4.4 5.7 C3.9 6.3 3.5 6.8 3.3 7.2 Z"/><path class="ink-fill" d="M8.8 4.7 C10.1 4.5 10.9 5.6 10.9 7.1 C10.9 8.4 10.3 9.3 9.4 9.2 C8.7 8.2 8.5 6.2 8.8 4.7 Z"/><path class="ink" stroke-width="1.7" fill="none" d="M17.5 19.4 C19.2 19.7 20.5 19.0 20.8 17.3"/><circle class="ink-fill" cx="5.9" cy="6.9" r="0.5"/></svg>`,
  // a heart with its halo slipping off — love made me do it, blame withheld
  halo: `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M12 20.8 C12 20.8 4.4 15.5 4.4 10.4 C4.4 7.7 6.4 6.1 8.5 6.1 C10 6.1 11.3 7 12 8.3 C12.7 7 14 6.1 15.5 6.1 C17.6 6.1 19.6 7.7 19.6 10.4 C19.6 15.5 12 20.8 12 20.8 Z"/><ellipse class="ink" cx="15.8" cy="3.6" rx="4.2" ry="1.45" transform="rotate(-17 15.8 3.6)" fill="none"/><path class="ink" stroke-width="1.1" opacity="0.6" d="M8.8 2.2 L10.4 2.7 M8.4 4.3 L10.0 4.5"/></svg>`,
  // the serpent wound around the apple — every dark side beaten, Eden yours
  eden: `<svg viewBox="0 0 24 24"><path class="ink" stroke-width="1.4" fill="none" d="M12 7.4 C11.9 6.0 12.5 4.9 13.7 4.1"/><path class="ink-fill" d="M12 7.9 C10 5.9 6.3 6.6 5.3 10.1 C4.3 13.8 6.9 18.5 9.5 19.6 C10.5 20 11.4 19.7 12 19.2 C12.6 19.7 13.5 20 14.5 19.6 C17.1 18.5 19.7 13.8 18.7 10.1 C17.7 6.6 14 5.9 12 7.9 Z"/><path class="ink" fill="none" stroke-width="1.8" d="M4.5 14.0 C8.4 16.8 11.6 12.4 14.6 13.6 C16.6 14.4 17.8 13.2 17.9 11.5 C18.0 10.2 17.6 9.2 16.8 8.5"/><circle class="ink-fill" cx="16.5" cy="7.3" r="1.3"/><path class="ink" stroke-width="1" d="M17.4 6.3 L18.4 5.2 M18.4 5.2 L19.1 5.8 M18.4 5.2 L17.8 4.5"/></svg>`,

  // the desk after the temper: the inkwell over on its side, its mouth still running. Drawn
  // as an outline puddle rather than a solid blot so it stays a charm and not a hole.
  flame: `<svg viewBox="0 0 24 24"><path class="ink" fill="none" stroke-width="2" stroke-linejoin="round" d="M12 1.4 C12 5.4 11.2 7.8 10 9.6 C9.4 8.8 8.9 7.8 8.7 6.6 C6.5 9 4.9 11.6 4.9 14.4 C4.9 18.7 8.1 22.2 12 22.2 C15.9 22.2 19.1 18.7 19.1 14.4 C19.1 9.7 15.5 5.4 12 1.4 Z"/><path d="M12 11.4 C13.5 13 14.3 14.3 14.3 15.9 C14.3 17.7 13.2 19 12 19 C10.8 19 9.7 17.7 9.7 15.9 C9.7 14.3 10.5 13 12 11.4 Z" fill="currentColor" stroke="none"/></svg>`,

  // TEMPORARY placeholder charm — a dashed frame around a question mark. Any icon set to
  // "placeholder" is art-pending (new challenges / achievements before their real icon is
  // drawn). Search "placeholder" to find everything still awaiting a bespoke charm; The Thousandth
  // Cup is the only one wearing it, and its mark is being drawn separately.
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
  mirror:  `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M10.8 15.2 H13.2 L13.8 20 A1.9 1.9 0 0 1 10.2 20 Z"/><circle class="ink-fill" cx="12" cy="9" r="6.6"/><path class="ink" stroke-width="0.9" d="M9.1 5.3 L10.6 7.9 L9.9 9.9 M10.6 7.9 L12.4 9 L12.9 10.8"/></svg>`,
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
  match:   `<svg viewBox="0 0 24 24"><path d="M11.1 10.6 H12.9 L12.75 21.6 H11.25 Z" fill="currentColor" stroke="none"/><ellipse class="ink-fill" cx="12" cy="10.6" rx="1.7" ry="1.3"/><path class="ink-fill" d="M12 2 C13.9 4.3 15.1 6.1 15.1 7.9 A3.1 3.1 0 0 1 8.9 7.9 C8.9 6.1 10.1 4.3 12 2 Z"/><path d="M12 5.6 C12.8 6.6 13.25 7.3 13.25 8 A1.25 1.25 0 0 1 10.75 8 C10.75 7.3 11.2 6.6 12 5.6 Z" fill="none" stroke="currentColor" stroke-width="1"/></svg>`,
  // a cat, sitting, unbothered — karma's whole deal
  cat:     `<svg viewBox="0 0 24 24"><path class="ink" stroke-width="1.7" d="M18.3 20.9 C21 20.9 22.2 19 21.3 17.1"/><path class="ink-fill" d="M7.5 8.6 C7.5 7.1 7.9 5.9 8.8 5 L8.5 2.4 L10.7 4 C11.6 3.7 12.4 3.7 13.3 4 L15.5 2.4 L15.2 5 C16.1 5.9 16.5 7.1 16.5 8.6 C16.5 10.2 15.7 11.6 14.4 12.4 C16.9 13.9 18.3 16.6 18.3 21 H5.7 C5.7 16.6 7.1 13.9 9.6 12.4 C8.3 11.6 7.5 10.2 7.5 8.6 Z"/><g fill="currentColor"><circle cx="10.4" cy="8.2" r="0.75"/><circle cx="13.6" cy="8.2" r="0.75"/></g></svg>`,
  // both hands straight up, one star out — meet me at midnight
  clock:   `<svg viewBox="0 0 24 24"><circle class="ink-fill" cx="11" cy="13" r="7.6"/><g class="ink" stroke-width="1"><path d="M11 7.7 V8.9"/><path d="M16.3 13 H15.1"/><path d="M11 18.3 V17.1"/><path d="M5.7 13 H6.9"/></g><path class="ink" stroke-width="1.9" d="M11 13 V10.1"/><path class="ink" stroke-width="1.2" d="M11 13 V8.3"/><circle cx="11" cy="13" r="0.85" fill="currentColor" stroke="none"/><path class="ink-fill" d="M20.1 2.6 L20.9 4.4 L22.7 5.2 L20.9 6 L20.1 7.8 L19.3 6 L17.5 5.2 L19.3 4.4 Z"/></svg>`,
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
  // a pumpkin coach waiting with its wheels, one sparkle off the roof — your first daily, a fairytale
  coach:   `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M5.9 10.4 C6.1 7 8.5 5 12.1 5.1 C15.7 5.2 18 7.4 17.9 10.6 C17.8 13.3 15.4 15 11.9 14.9 C8.3 14.8 5.8 13.2 5.9 10.4 Z"/><path class="ink" stroke-width="1.3" d="M12.1 5.1 C12 3.8 12.7 3 13.9 2.8"/><path class="ink" stroke-width="1.2" d="M10.4 14.7 V11.1 A1.7 1.7 0 0 1 13.7 11.2 V14.6"/><g class="ink" stroke-width="1.5"><circle cx="7.3" cy="18.4" r="2.6"/><circle cx="16.9" cy="18.1" r="2.3"/></g><path class="ink-fill" d="M20.6 3.4 L21.2 4.8 L22.6 5.4 L21.2 6 L20.6 7.4 L20 6 L18.6 5.4 L20 4.8 Z"/></svg>`,
  // the sun coming up over the line — step into the daylight
  sunrise: `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M6.6 17.4 A5.4 5.4 0 0 1 17.4 17.4 Z"/><path class="ink" stroke-width="1.7" d="M2.6 17.4 H21.4"/><g class="ink" stroke-width="1.5"><path d="M12 6 V8.6"/><path d="M5.4 9 L7.2 10.8"/><path d="M18.6 9 L16.8 10.8"/><path d="M2.8 13.2 L5.2 14"/><path d="M21.2 13.2 L18.8 14"/></g><path class="ink" stroke-width="1.3" d="M4 20.6 H8.4 M15.6 20.6 H20"/></svg>`,
  // an open book with a heart on the page — a story kept up daily
  openbook:`<svg viewBox="0 0 24 24"><path class="ink-fill" d="M12 6.2 C9.4 4.6 6 4.4 3.2 5.4 V17.4 C6 16.4 9.4 16.6 12 18.2 C14.6 16.6 18 16.4 20.8 17.4 V5.4 C18 4.4 14.6 4.6 12 6.2 Z"/><path d="M12 6.2 V18.2" stroke="currentColor" stroke-width="1.2" fill="none"/><g stroke="currentColor" stroke-width="0.95" fill="none"><path d="M5.2 8.4 H10"/><path d="M5.2 10.6 H10"/><path d="M5.2 12.8 H8.6"/></g><path d="M16.6 12.8 C13.8 10.6 15.4 8.4 16.6 9.8 C17.8 8.4 19.4 10.6 16.6 12.8 Z" fill="currentColor" stroke="none"/></svg>`,
  // an evergreen sprig with winter berries — lasts through every season
  oak: `<svg viewBox="0 0 24 24"><path class="ink" fill="none" stroke-width="1.8" d="M19 9.6 A3.2 3.2 0 0 1 16.95 14.55 A3.2 3.2 0 0 1 12 16.6 A3.2 3.2 0 0 1 7.05 14.55 A3.2 3.2 0 0 1 5 9.6 A3.2 3.2 0 0 1 7.05 4.65 A3.2 3.2 0 0 1 12 2.6 A3.2 3.2 0 0 1 16.95 4.65 A3.2 3.2 0 0 1 19 9.6 Z"/><path class="ink" stroke-width="2.4" stroke-linecap="round" d="M12 18 V21.4"/><path class="ink" stroke-width="2" stroke-linecap="round" d="M8.6 21.8 H15.4"/></svg>`,
  // two pines and the path out between them — are we out of the woods yet
  pines:   `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M6 3.6 L9.4 8.8 H7.7 L10.2 12.8 H1.8 L4.3 8.8 H2.6 Z"/><rect class="ink-fill" x="5.2" y="12.8" width="1.6" height="3"/><path class="ink-fill" d="M18 3.6 L21.4 8.8 H19.7 L22.2 12.8 H13.8 L16.3 8.8 H14.6 Z"/><rect class="ink-fill" x="17.2" y="12.8" width="1.6" height="3"/><g class="ink" stroke-width="1.3"><path d="M10.2 21.4 C10.7 18.8 11.2 17 11.7 15.2"/><path d="M14.2 21.4 C13.7 18.8 13.3 17 12.8 15.2"/><path d="M12.3 19.9 V19"/><path d="M12.3 17.2 V16.5"/></g></svg>`,
  // two balloons, strings crossed — feeling twenty-two
  balloons:`<svg viewBox="0 0 24 24"><ellipse class="ink-fill" cx="8.4" cy="7.2" rx="3.5" ry="4.3"/><path class="ink-fill" d="M7.4 11.4 H9.4 L8.4 13 Z"/><ellipse class="ink-fill" cx="16" cy="6.2" rx="3.1" ry="3.9"/><path class="ink-fill" d="M15.1 10 H16.9 L16 11.5 Z"/><g class="ink" stroke-width="1.2"><path d="M8.6 13 C9.6 15.8 11.2 17.6 12.4 20.8"/><path d="M15.8 11.5 C14.4 14.6 13 16.6 11.8 20.4"/></g><circle cx="7" cy="5.6" r="0.8" fill="var(--paper)" stroke="none"/><circle cx="14.9" cy="4.9" r="0.7" fill="var(--paper)" stroke="none"/></svg>`,
  // a tangle that settles into one clean line — long story short, you survived
  scribbleline:`<svg viewBox="0 0 24 24"><path class="ink" stroke-width="1.5" d="M2.2 13.4 C2.8 9.8 6.4 8.6 7 11 C7.6 13.4 3.4 14.6 4.4 16.8 C5.4 19 8.8 17.2 9.2 14.2 C9.5 12 8.4 10.8 7 12 C8 12.8 9.6 13.2 11 13.2"/><rect class="ink-fill" x="11" y="12.4" width="8.2" height="1.6" rx="0.8"/><path class="ink-fill" d="M18.8 10.9 L22.4 13.2 L18.8 15.5 Z"/></svg>`,
  // an ice lolly losing to july — cruel summer
  lolly:   `<svg viewBox="0 0 24 24"><path class="ink" stroke-width="1.6" d="M12.4 15.6 L13.3 21.2"/><g transform="rotate(-9 11.6 9)"><path class="ink-fill" d="M7.7 4.4 A4 4 0 0 1 15.7 4.4 L15 13.4 A2.3 2.3 0 0 1 10.4 13.3 Z"/><path d="M9.8 4.8 L9.6 11" stroke="currentColor" stroke-width="1.1" fill="none" stroke-linecap="round"/><path d="M12.2 4.6 L12.1 11.2" stroke="currentColor" stroke-width="1.1" fill="none" stroke-linecap="round" opacity="0.7"/></g><path class="ink-fill" d="M8 15.4 C8.5 16.1 8.7 16.6 8.7 17 A0.72 0.72 0 0 1 7.3 17 C7.3 16.6 7.5 16.1 8 15.4 Z"/><circle class="ink-fill" cx="9.8" cy="19.4" r="0.55"/><circle class="ink-fill" cx="15.4" cy="16.2" r="0.5"/></svg>`,
  // light breaking off the ground you dance on — holy ground
  summit: `<svg viewBox="0 0 24 24"><path class="ink" fill="none" stroke-width="1.9" stroke-linejoin="round" d="M1.8 20.6 L9.6 5.4 L17.4 20.6 Z"/><path d="M9.6 5.4 L12.9 11.9 L11.4 10.9 L9.9 12.3 L8.5 11.1 L6.9 12 Z" fill="currentColor" stroke="none"/><path class="ink" stroke-width="1.8" stroke-linecap="round" d="M9.6 5.6 V1.2"/><path d="M9.9 1.4 L15.4 3 L9.9 4.9 Z" fill="currentColor" stroke="none"/><path class="ink" stroke-width="1.8" stroke-linecap="round" d="M1.2 20.7 H22.8"/><path class="ink" fill="none" stroke-width="1.5" opacity="0.6" d="M15.6 20.6 L19.4 13.2 L22.4 20.6"/></svg>`,
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
  bee: `<svg viewBox="0 0 24 24"><g class="ink" fill="none" stroke-width="1.5"><ellipse cx="6.2" cy="9.2" rx="4" ry="2.4" transform="rotate(-38 6.2 9.2)"/><ellipse cx="17.8" cy="9.2" rx="4" ry="2.4" transform="rotate(38 17.8 9.2)"/></g><g class="ink" stroke-width="1.4"><path d="M10.4 3.6 L8.8 1.6"/><path d="M13.6 3.6 L15.2 1.6"/></g><g fill="currentColor" stroke="none"><circle cx="8.6" cy="1.4" r="0.95"/><circle cx="15.4" cy="1.4" r="0.95"/></g><circle class="ink-fill" cx="12" cy="5.6" r="2.8"/><ellipse class="ink-fill" cx="12" cy="14.8" rx="4.7" ry="6.2"/><g class="ink" stroke-width="2.3" stroke-linecap="round"><path d="M8 13.2 H16"/><path d="M8.4 17.2 H15.6"/></g></svg>`,
  // a bow at full draw — the first challenge, defeated
  bow:     `<svg viewBox="0 0 24 24"><path class="ink" stroke-width="1.7" d="M6.4 3.4 C13.4 7.4 13.4 16.6 6.4 20.6"/><path class="ink" stroke-width="1" d="M6.4 3.4 L10.2 12 L6.4 20.6"/><path class="ink" stroke-width="1.4" d="M10.2 12 H19.4"/><path class="ink-fill" d="M19 10.7 L22.4 12 L19 13.3 Z"/><g class="ink" stroke-width="1.1"><path d="M10.3 11.9 L8.8 10.5"/><path d="M10.3 12.1 L8.8 13.5"/></g></svg>`,
  // an alchemist's flask, mid-transmutation — turned every trial to gold
  bigcrown: `<svg viewBox="0 0 24 24"><path class="ink" fill="none" stroke-width="1.9" stroke-linejoin="round" d="M2.2 17 L2.8 8.4 L5.1 12.4 L7.4 5.6 L9.7 11.2 L12 2.8 L14.3 11.2 L16.6 5.6 L18.9 12.4 L21.2 8.4 L21.8 17 Z"/><rect class="ink-fill" x="2.4" y="17" width="19.2" height="4.4" rx="1"/><path d="M12 17.6 L14 19.2 L12 20.8 L10 19.2 Z" fill="currentColor" stroke="none"/></svg>`,
  // two rings, linked — I'd marry you with paper rings
  rings:   `<svg viewBox="0 0 24 24"><circle cx="9.2" cy="12" r="4.9" fill="none" stroke="currentColor" stroke-width="4.4"/><circle cx="9.2" cy="12" r="4.9" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="15.6" cy="12" r="4.9" fill="none" stroke="currentColor" stroke-width="4.4"/><circle cx="15.6" cy="12" r="4.9" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M11.3 7.7 A4.9 4.9 0 0 1 14 11.4" fill="none" stroke="currentColor" stroke-width="4.4"/><path d="M11.3 7.7 A4.9 4.9 0 0 1 14 11.4" fill="none" stroke="currentColor" stroke-width="2.2"/></svg>`,
  // every draft it took — this is me trying
  crumple: `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M7 4.6 L12.4 3 L17.2 5.2 L20.2 9.8 L19 14.8 L14.8 18.2 L9.2 17.8 L5 14.2 L4.2 9 Z"/><g class="ink" stroke-width="0.95" opacity="0.8"><path d="M7 4.6 L11 9.4 L9.2 13.6"/><path d="M12.4 3 L11 9.4"/><path d="M17.2 5.2 L13.8 8.8 L15.6 13.2"/><path d="M20.2 9.8 L15.6 13.2 L14.8 18.2"/><path d="M4.2 9 L9.2 13.6 L9.2 17.8"/></g><path class="ink-fill" d="M16.8 18.4 L21.4 16.8 L20.6 21.2 Z"/></svg>`,
  // a map with the pin finally placed — a place in this world
  map:     `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M3 6.4 L9 4.6 L15 6.4 L21 4.6 V17.6 L15 19.4 L9 17.6 L3 19.4 Z"/><g class="ink" stroke-width="1"><path d="M9 4.6 V17.6"/><path d="M15 6.4 V19.4"/></g><path d="M5.2 15.4 C7.2 12.4 10.4 14.6 12.4 10.6" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="1.8 1.6" stroke-linecap="round"/><path class="ink-fill" d="M17.4 4.3 C19.3 4.3 20.7 5.7 20.7 7.4 C20.7 9.5 17.4 12.4 17.4 12.4 C17.4 12.4 14.1 9.5 14.1 7.4 C14.1 5.7 15.5 4.3 17.4 4.3 Z"/><circle cx="17.4" cy="7.3" r="1.05" fill="var(--paper)" stroke="none"/></svg>`,
  // a butterfly — these walls fell, and everything changed
  butterfly:`<svg viewBox="0 0 24 24"><g class="ink" stroke-width="1.1"><path d="M11.4 9.4 C10.6 7.8 9.6 6.8 8.4 6.4"/><path d="M12.6 9.4 C13.4 7.8 14.4 6.8 15.6 6.4"/></g><path class="ink-fill" d="M10.9 11 C8.6 7.6 4.6 6.6 2.9 8.9 C1.6 10.7 3.2 13.2 6.4 13.6 C4 14.3 3.4 16.6 5 18.2 C6.8 20 9.8 18.8 10.9 15.4 Z"/><path class="ink-fill" d="M13.1 11 C15.4 7.6 19.4 6.6 21.1 8.9 C22.4 10.7 20.8 13.2 17.6 13.6 C20 14.3 20.6 16.6 19 18.2 C17.2 20 14.2 18.8 13.1 15.4 Z"/><ellipse cx="12" cy="13" rx="1.15" ry="3.5" fill="currentColor" stroke="none"/><g fill="var(--paper)" stroke="none"><circle cx="6.2" cy="10.6" r="0.9"/><circle cx="17.8" cy="10.6" r="0.9"/></g></svg>`,
  // a stack of gold worth panning for — gold rush
  coins: `<svg viewBox="0 0 24 24"><g class="ink" fill="none" stroke-width="1.7"><path d="M8.816 17.828 A5 5 0 1 1 7.66 9.444"/><path d="M14.559 17.458 A5.3 5.3 0 1 1 13.333 8.264"/><circle cx="17.4" cy="12.4" r="5.8" stroke-width="1.9"/></g><path d="M17.4 8.6 L18.4 11.03 L21.01 11.23 L19.02 12.93 L19.63 15.47 L17.4 14.1 L15.17 15.47 L15.78 12.93 L13.79 11.23 L16.4 11.03 Z" fill="currentColor" stroke="none"/><path d="M20.8 1.8 L21.5 3.6 L23.3 4.3 L21.5 5 L20.8 6.8 L20.1 5 L18.3 4.3 L20.1 3.6 Z" fill="currentColor" stroke="none"/></svg>`,
  // five stars strung into a shape — like we're made of starlight
  constellation: `<svg viewBox="0 0 24 24"><path class="ink" fill="none" stroke-width="1.6" d="M4.6 18.4 L10.2 8.4 L16.6 15.4 L20 4.8"/><g fill="currentColor" stroke="none"><path d="M4.6 15.2 L5.69 17.31 L7.8 18.4 L5.69 19.49 L4.6 21.6 L3.51 19.49 L1.4 18.4 L3.51 17.31 Z"/><path d="M10.2 4.9 L11.39 7.21 L13.7 8.4 L11.39 9.59 L10.2 11.9 L9.01 9.59 L6.7 8.4 L9.01 7.21 Z"/><path d="M16.6 12.5 L17.59 14.41 L19.5 15.4 L17.59 16.39 L16.6 18.3 L15.61 16.39 L13.7 15.4 L15.61 14.41 Z"/><path d="M20 1.9 L20.99 3.81 L22.9 4.8 L20.99 5.79 L20 7.7 L19.01 5.79 L17.1 4.8 L19.01 3.81 Z"/></g></svg>`,
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
  stopwatch:`<svg viewBox="0 0 24 24"><rect class="ink-fill" x="10.6" y="1.6" width="2.8" height="2.6" rx="0.6"/><path class="ink" stroke-width="1.4" d="M17.8 6.2 L19.4 4.6"/><circle class="ink-fill" cx="12" cy="13.4" r="8.2"/><path class="ink-fill" stroke-width="0.9" d="M12 13.4 V7 A6.4 6.4 0 0 1 15.2 7.9 Z"/><g class="ink" stroke-width="1"><path d="M12 18.6 V19.8"/><path d="M7.2 13.4 H6"/><path d="M16.8 13.4 H18"/></g><path class="ink" stroke-width="1.5" d="M12 13.4 L14.7 8.4"/><circle cx="12" cy="13.4" r="0.8" fill="currentColor" stroke="none"/></svg>`,
  // the sea held open, a dry path straight through the middle
  partedsea:`<svg viewBox="0 0 24 24"><path class="ink-fill" d="M2.4 4.4 H8.4 C10 6.9 10 9.5 8.6 12 C7.4 14.2 7.4 16.8 8.8 19.6 H2.4 Z"/><path class="ink-fill" d="M21.6 4.4 H15.6 C14 6.9 14 9.5 15.4 12 C16.6 14.2 16.6 16.8 15.2 19.6 H21.6 Z"/><g stroke="currentColor" stroke-width="1" fill="none" opacity="0.8"><path d="M4.4 7.2 C5.4 7.8 6.1 8.7 6.4 9.8"/><path d="M4.4 13.4 C5.4 14 6.1 14.9 6.4 16"/><path d="M19.6 7.2 C18.6 7.8 17.9 8.7 17.6 9.8"/><path d="M19.6 13.4 C18.6 14 17.9 14.9 17.6 16"/></g><path class="ink" stroke-width="1.3" stroke-dasharray="2 2.2" d="M12 4.8 V19.2"/></svg>`,
  // the tape worn soft from singing every word along
  cassette:`<svg viewBox="0 0 24 24"><rect class="ink-fill" x="2.6" y="4.8" width="18.8" height="14.4" rx="1.6"/><rect x="5.8" y="7.6" width="12.4" height="5.6" rx="2.8" fill="none" stroke="currentColor" stroke-width="1.2"/><g class="ink" stroke-width="1.2" fill="none"><circle cx="8.9" cy="10.4" r="1.7"/><circle cx="15.1" cy="10.4" r="1.7"/><path d="M10.6 10.4 H13.4"/></g><path d="M8.4 16.3 L9.3 19.2 H14.7 L15.6 16.3 Z" fill="none" stroke="currentColor" stroke-width="1.2"/><g fill="currentColor" stroke="none"><circle cx="4.5" cy="6.6" r="0.7"/><circle cx="19.5" cy="6.6" r="0.7"/></g></svg>`,
  // two cherries off one stem, both songs on every page
  cherries:`<svg viewBox="0 0 24 24"><g class="ink" stroke-width="1.4" fill="none"><path d="M12.6 3 C10.2 6.2 8.6 9.6 8.1 13.2"/><path d="M12.6 3 C14.2 6.6 15.1 10 15.3 13.6"/></g><ellipse class="ink-fill" cx="15.5" cy="4.3" rx="2.6" ry="1.1" transform="rotate(26 15.5 4.3)"/><circle class="ink-fill" cx="7.8" cy="16.2" r="3.2"/><circle class="ink-fill" cx="15.6" cy="16.6" r="3.2"/><g fill="var(--paper)" stroke="none"><circle cx="6.7" cy="15.1" r="0.8"/><circle cx="14.5" cy="15.5" r="0.8"/></g></svg>`,

  /* ---- The last of the stand-ins, drawn properly ---- */
  // a skyline still lit at round 89 — welcome to New York
  skyline: `<svg viewBox="0 0 24 24"><path class="ink-fill" d="M2.6 20.2 V13.2 H6.2 V9 H9.4 V15 H12 V6.6 H15.4 V11.4 H18.2 V14.6 H21.4 V20.2 Z"/><path class="ink" stroke-width="1.2" d="M13.7 6.6 V3.2"/><g fill="currentColor" stroke="none"><rect x="3.7" y="15" width="1.2" height="1.2"/><rect x="7.3" y="11" width="1.2" height="1.2"/><rect x="13.1" y="8.6" width="1.2" height="1.2"/><rect x="13.1" y="11.6" width="1.2" height="1.2"/><rect x="16.3" y="13.4" width="1.2" height="1.2"/><rect x="19.3" y="16.6" width="1.2" height="1.2"/></g><path class="ink-fill" d="M19.8 3.2 L20.35 4.55 L21.7 5.1 L20.35 5.65 L19.8 7 L19.25 5.65 L17.9 5.1 L19.25 4.55 Z"/></svg>`,
  // the banjo that carries "Mean". The neck is laid in first so the drum's paper head covers
  // where it runs under the pot.
  banjo:   `<svg viewBox="0 0 24 24"><g transform="rotate(32 9.2 16.2)"><path class="ink-fill" d="M6.6 2.6 V0.9 a1 1 0 0 1 1 -1 H10.8 a1 1 0 0 1 1 1 V2.6 Z"/><g class="ink" stroke-width="1"><path d="M6.6 0.5 H5.9"/><path d="M11.8 0.5 H12.5"/></g><g fill="currentColor" stroke="none"><circle cx="5.5" cy="0.5" r="0.75"/><circle cx="12.9" cy="0.5" r="0.75"/></g><rect class="ink-fill" x="7.5" y="2.6" width="3.4" height="10.4"/><g class="ink" stroke-width="0.95" opacity="0.6"><path d="M7.5 5.2 H10.9"/><path d="M7.5 7.6 H10.9"/><path d="M7.5 10 H10.9"/></g></g><circle class="ink-fill" cx="9.2" cy="16.2" r="6"/><circle cx="9.2" cy="16.2" r="4.1" fill="var(--paper)" stroke="currentColor" stroke-width="1.1"/><rect class="ink-fill" x="8.1" y="18.5" width="2.2" height="1.6" rx="0.5"/></svg>`,
  // a pocket compass, needle steady — every board on the map, walked
  compass: `<svg viewBox="0 0 24 24"><circle class="ink-fill" cx="12" cy="12.4" r="8.6"/><circle cx="12" cy="12.4" r="6.6" fill="none" stroke="currentColor" stroke-width="0.9" opacity="0.6"/><path d="M12 6.2 L13.7 12.4 L10.3 12.4 Z" fill="currentColor" stroke="none"/><path class="ink" stroke-width="1.1" d="M12 18.6 L13.7 12.4 L10.3 12.4 Z"/><circle cx="12" cy="12.4" r="0.95" fill="var(--paper)" stroke="currentColor" stroke-width="0.9"/><path class="ink" stroke-width="1.3" fill="none" d="M10.5 3.9 A1.55 1.55 0 1 1 13.5 3.9"/></svg>`,
  // feet in the swing over the creek. The water underneath is doing real work: without it
  // two ropes and a plank read as a table.
  swing:   `<svg viewBox="0 0 24 24"><path class="ink" stroke-width="2.2" fill="none" d="M1.4 5.6 C6.2 3.2 14.6 4 22.6 2.2"/><path class="ink" stroke-width="1.2" fill="none" d="M17.8 3.5 C18.8 2.3 19.8 1.9 21 1.9"/><g class="ink-fill"><ellipse cx="5" cy="7.6" rx="2.1" ry="0.9" transform="rotate(66 5 7.6)"/><ellipse cx="19.8" cy="5" rx="1.9" ry="0.8" transform="rotate(52 19.8 5)"/></g><g transform="rotate(-8 12 4.6)"><g class="ink" stroke-width="1.15" fill="none"><path d="M9 5 L9.7 14.4"/><path d="M15 4.6 L14.3 14.4"/></g><rect class="ink-fill" x="8.1" y="14.4" width="7.8" height="2.4" rx="0.8"/></g><g class="ink" stroke-width="1.3" fill="none" opacity="0.75"><path d="M2.4 20 C4.6 18.6 6.6 21 8.8 19.6 C11 18.2 13 20.6 15.2 19.2 C17.4 17.8 19.4 20.2 21.6 18.8"/><path d="M3.6 22.6 C5.8 21.2 7.8 23.6 10 22.2 C12.2 20.8 14.2 23.2 16.4 21.8"/></g></svg>`,
  // the first bracelet card, pinned up: the strand laid across it in a slack S rather than a
  // symmetric arc, which reads as a mouth at charm size
  keepsake:`<svg viewBox="0 0 24 24"><g transform="rotate(-4 12 13)"><rect class="ink-fill" x="3.2" y="6.6" width="17.6" height="12.6" rx="1.4"/><path class="ink" stroke-width="0.85" opacity="0.65" fill="none" d="M5.4 15.6 C8 16.2 8.6 11.2 12 10.6 C15.4 10 16 14.4 18.6 13"/><g class="ink-fill"><circle cx="5.9" cy="15.7" r="0.9"/><circle cx="8.3" cy="14.8" r="0.95"/><circle cx="10.5" cy="11.7" r="1"/><circle cx="13.4" cy="10.9" r="1"/><circle cx="15.9" cy="13" r="0.95"/><circle cx="18.4" cy="12.9" r="0.9"/></g></g><path class="ink" stroke-width="1.2" fill="none" d="M12 6.4 V4.4"/><circle class="ink-fill" cx="12" cy="3.2" r="1.5"/></svg>`,
  // your own levers, each slid somewhere different. The knobs are beads, not handles, so the
  // panel stays notebook rather than mixing desk.
  levers:  `<svg viewBox="0 0 24 24"><g class="ink" stroke-width="1.3" fill="none"><path d="M3.2 6.6 H20.8"/><path d="M3.2 12 H20.8"/><path d="M3.2 17.4 H20.8"/></g><g class="ink-fill"><circle cx="15.4" cy="6.6" r="2.1"/><circle cx="7.6" cy="12" r="2.1"/><circle cx="16.8" cy="17.4" r="2.1"/></g></svg>`,
  // room made on the shelf and the guest's sleeve going into it — the act in the desc,
  // drawn as the shelf rather than as a pass, because nothing about a guest run is
  // backstage: their catalogue stands in the row like everyone else's
  guestpass:`<svg viewBox="0 0 24 24"><path class="ink" stroke-width="1.6" d="M2 20.8 H22"/><g class="ink-fill"><rect x="3.2" y="8.4" width="2.6" height="11.9" rx="0.4"/><rect x="6.4" y="7.8" width="2.6" height="12.5" rx="0.4"/><rect x="9.6" y="8.6" width="2.6" height="11.7" rx="0.4"/></g><g transform="rotate(15 15.6 20.2)"><rect class="ink-fill" x="14.3" y="7.4" width="2.8" height="12.8" rx="0.4"/><circle cx="15.7" cy="10.4" r="0.55" fill="currentColor" stroke="none"/></g><g class="ink" stroke-width="1.1" opacity="0.45"><path d="M20.4 10 L22.2 9"/><path d="M20.8 13 L22.6 12.2"/></g></svg>`,
  // the shelf itself: written-up preset cards stood in an open holder
  presetbox:`<svg viewBox="0 0 24 24"><g class="ink-fill"><rect x="4.4" y="3" width="10.4" height="11.4" rx="0.8" transform="rotate(-9 9.6 8.7)"/><rect x="9.6" y="2.4" width="10.4" height="12" rx="0.8" transform="rotate(7 14.8 8.4)"/></g><g class="ink" stroke-width="1" opacity="0.55" transform="rotate(7 14.8 8.4)"><path d="M11.6 6 H18"/><path d="M11.6 8.4 H16.4"/><path d="M11.6 10.8 H17.4"/></g><path class="ink-fill" d="M2.8 13.4 L4.1 20.4 a1 1 0 0 0 1 0.8 H18.9 a1 1 0 0 0 1 -0.8 L21.2 13.4"/></svg>`,
  // one pen stroke looped twice and carried past itself — a run with no last page
  infinity:`<svg viewBox="0 0 24 24"><path class="ink" stroke-width="2.2" fill="none" d="M13.6 10.9 C11.8 7.8 8.6 7.2 6.3 8.8 C3.7 10.6 3.9 14.2 6.8 15.4 C9.6 16.6 12 14.6 13.4 11.6 C14.9 8.5 17.6 7.2 19.6 8.8 C22 10.7 21.4 14.6 18.4 15.5 C15.8 16.3 13.2 14.6 11.6 12.2"/><path class="ink-fill" d="M20.6 3.4 L21.15 4.65 L22.4 5.2 L21.15 5.75 L20.6 7 L20.05 5.75 L18.8 5.2 L20.05 4.65 Z"/></svg>`,
  // the wax pressed at last, the nib's own shape sunk into it
  waxpress:`<svg viewBox="0 0 24 24"><path class="ink-fill" d="M19.3 12 Q21.02 14.65 18.14 15.95 Q18.16 19.1 15.03 18.64 Q13.34 21.3 10.96 19.23 Q8.09 20.55 7.22 17.52 Q4.09 17.08 4.99 14.06 Q2.6 12 4.99 9.94 Q4.09 6.92 7.22 6.48 Q8.09 3.45 10.96 4.77 Q13.34 2.7 15.03 5.36 Q18.16 4.9 18.14 8.05 Q21.02 9.35 19.3 12 Z"/><path class="ink-fill" d="M12 7 L15 12.6 L12 17.4 L9 12.6 Z"/><circle cx="12" cy="11.5" r="1" fill="var(--paper)" stroke="none"/><path class="ink" stroke-width="1.1" d="M12 12.7 V16.6"/><g fill="currentColor" stroke="none" opacity="0.45"><circle cx="6.9" cy="9.6" r="0.5"/><circle cx="17.2" cy="15.2" r="0.45"/></g></svg>`,
  // a pleated prize rosette, one skill taken all the way
  rosette: `<svg viewBox="0 0 24 24"><g class="ink-fill"><path d="M10.4 16 L8.4 21.6 L10.4 21 L11.6 16.4 Z"/><path d="M13.6 16 L15.6 21.6 L13.6 21 L12.4 16.4 Z"/></g><circle class="ink-fill" cx="12" cy="10" r="6.6"/><g class="ink" stroke-width="0.85" opacity="0.55"><path d="M12 3.6 V6.4"/><path d="M16.4 5.6 L14.5 7.5"/><path d="M18.4 10 H15.6"/><path d="M16.4 14.4 L14.5 12.5"/><path d="M12 16.4 V13.6"/><path d="M7.6 14.4 L9.5 12.5"/><path d="M5.6 10 H8.4"/><path d="M7.6 5.6 L9.5 7.5"/></g><circle cx="12" cy="10" r="3.5" fill="var(--paper)" stroke="currentColor" stroke-width="0.9" opacity="0.6"/><path d="M12 7.5 L12.68 9.07 L14.38 9.23 L13.09 10.36 L13.47 12.02 L12 11.15 L10.53 12.02 L10.91 10.36 L9.62 9.23 L11.32 9.07 Z" fill="currentColor" stroke="none"/></svg>`,
  // a tag on a string, written up in your own hand — call it what you want
  nametag: `<svg viewBox="0 0 24 24"><g transform="rotate(-9 12 13)"><path class="ink-fill" d="M8.4 7.4 H19.4 a1.4 1.4 0 0 1 1.4 1.4 V17.4 a1.4 1.4 0 0 1 -1.4 1.4 H8.4 L3.6 13.1 Z"/><circle cx="7" cy="13.1" r="1.15" fill="var(--paper)" stroke="currentColor" stroke-width="1.1"/><g class="ink" stroke-width="1.1" opacity="0.6"><path d="M10.6 11.4 H18"/><path d="M10.6 14.6 H15.6"/></g></g><path class="ink" stroke-width="1.2" fill="none" d="M7.1 13.4 C4.4 10.4 5.4 5.4 9.6 3.6"/><circle cx="10.9" cy="3.2" r="1.4" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>`,

  /* ---- The top rungs of the difficulty, album, Custom and guest ladders ---- */
  // the cage with its middle bars sprung — tame and gentle until the circus life made her
  // mean. The gap is the whole mark, so nothing is drawn inside it.
  cage:    `<svg viewBox="0 0 24 24"><circle cx="12" cy="2.3" r="1.3" fill="none" stroke="currentColor" stroke-width="1.1"/><path class="ink" stroke-width="1.1" d="M12 3.6 V5.2"/><path class="ink-fill" fill="none" d="M7 19.5 V12.4 C7 8.5 9.2 5.2 12 5.2 C14.8 5.2 17 8.5 17 12.4 V19.5"/><g class="ink" stroke-width="1.1" fill="none"><path d="M9.4 6.6 V12.6"/><path d="M11.8 5.3 V12.6"/><path d="M14.2 6 V19.5"/><path d="M16.2 8.6 V19.5"/><path d="M7 12.6 H12.2"/><path d="M12.2 12.6 V19.5"/></g><path class="ink" stroke-width="2" d="M5.4 20 H18.6"/><circle cx="7" cy="12.8" r="0.65" fill="currentColor" stroke="none"/><g transform="rotate(-26 6.6 13.4)"><rect x="1.9" y="12.2" width="4.7" height="6.6" rx="0.5" fill="var(--paper)" stroke="currentColor" stroke-width="1.4"/><path class="ink" stroke-width="0.95" d="M3.5 12.9 V18.1 M5 12.9 V18.1"/></g><path class="ink-fill" d="M21.2 3.4 L21.7 4.6 L22.9 5.1 L21.7 5.6 L21.2 6.8 L20.7 5.6 L19.5 5.1 L20.7 4.6 Z"/></svg>`,
  // the grandmother's cameo brooch, her profile cut into it — the singer in the family, kept
  // on a pin. The beaded rim is a round-capped dashed ellipse, not thirteen little circles.
  cameo:   `<svg viewBox="0 0 24 24"><ellipse class="ink-fill" cx="12" cy="12.2" rx="6.9" ry="8.5"/><ellipse cx="12" cy="12.2" rx="6" ry="7.6" fill="none" stroke="currentColor" stroke-width="0.9" stroke-dasharray="0.1 1.7" stroke-linecap="round" stroke-opacity="0.6"/><ellipse cx="12" cy="12.2" rx="5.1" ry="6.7" fill="none" stroke="currentColor" stroke-width="0.85" stroke-opacity="0.45"/><path d="M10.2 8.2 C11.2 6.5 13.6 6.2 15.1 7.5 C16.6 8.8 16.8 10.8 16.2 12.6 C15.9 13.7 15.4 14.4 14.8 15.1 L15.1 16.4 C16.6 17 17.6 17.9 18 19 H6.6 C7 17.9 8.2 17 9.7 16.4 L10 15.2 C9.5 14.7 9.2 14.1 9.15 13.5 C8.75 13.7 8.35 13.5 8.5 13.05 C8.6 12.75 8.9 12.6 9 12.3 C8.6 12.2 8.2 11.9 8.45 11.5 L9.35 10.2 C9.4 9.5 9.7 8.8 10.2 8.2 Z" fill="currentColor" stroke="none"/></svg>`,
  // the King of Hearts, dealt face up — the album named, on the hardest clock
  kingcard:`<svg viewBox="0 0 24 24"><g transform="rotate(-7 12 12)"><rect class="ink-fill" x="4.4" y="2.6" width="15.2" height="18.8" rx="1.6"/><path class="ink" stroke-width="1.15" fill="none" d="M8.9 8.9 L9.6 5.1 L11.1 7.2 L12 4.4 L12.9 7.2 L14.4 5.1 L15.1 8.9 Z"/><path class="ink-fill" d="M12 18 C12 18 8 14.9 8 12.3 C8 11 9 10.2 10.05 10.2 C10.85 10.2 11.6 10.7 12 11.4 C12.4 10.7 13.15 10.2 13.95 10.2 C15 10.2 16 11 16 12.3 C16 14.9 12 18 12 18 Z"/><g fill="currentColor" stroke="none"><path d="M6.7 6.6 C6.7 6.6 5.3 5.5 5.3 4.7 C5.3 4.3 5.65 4.05 6 4.05 C6.3 4.05 6.55 4.25 6.7 4.5 C6.85 4.25 7.1 4.05 7.4 4.05 C7.75 4.05 8.1 4.3 8.1 4.7 C8.1 5.5 6.7 6.6 6.7 6.6 Z"/><path d="M17.3 17.4 C17.3 17.4 18.7 18.5 18.7 19.3 C18.7 19.7 18.35 19.95 18 19.95 C17.7 19.95 17.45 19.75 17.3 19.5 C17.15 19.75 16.9 19.95 16.6 19.95 C16.25 19.95 15.9 19.7 15.9 19.3 C15.9 18.5 17.3 17.4 17.3 17.4 Z"/></g></g></svg>`,
  // the typed pages, clipped — an album's worth of words, given back word for word
  manuscript:`<svg viewBox="0 0 24 24"><g transform="rotate(-3 12 12)"><path class="ink" fill="none" stroke-width="1.4" opacity="0.8" stroke-linejoin="round" d="M6.2 4 V1.8 H18.6 V18.8 H15.4"/><rect class="ink-fill" x="3" y="4" width="12.4" height="17" rx="0.9"/><path class="ink" fill="none" stroke-width="1.3" d="M5.2 7.6 C6.2 6.2 7.2 8.2 8.2 7 C9.1 6 10.2 7.8 11.4 6.8"/><rect x="5" y="10" width="8.4" height="1.8" rx="0.5" fill="currentColor" stroke="none"/><g class="ink" stroke-width="1.05" opacity="0.5"><path d="M5 14.2 H13.4"/><path d="M5 16.6 H13.4"/><path d="M5 19 H11.6"/></g></g></svg>`,
  // a letter out of its envelope, the salutation still in your own hand — you wrote the rules
  // this run was played by, so the note on the card is handwriting, not type
  pitchfork: `<svg viewBox="0 0 24 24"><g class="ink" fill="none" stroke-width="2" stroke-linecap="round"><path d="M5.4 3.4 V8.2 C5.4 10.4 8.3 11.6 12 11.6 C15.7 11.6 18.6 10.4 18.6 8.2 V3.4"/><path d="M12 3.2 V21.6"/></g><g fill="currentColor" stroke="none"><path d="M4.4 3.8 L5.4 1 L6.4 3.8 Z"/><path d="M11 3.6 L12 0.8 L13 3.6 Z"/><path d="M17.6 3.8 L18.6 1 L19.6 3.8 Z"/></g><path class="ink" stroke-width="2.2" stroke-linecap="round" d="M8.8 21.6 H15.2"/></svg>`,
  // the stamp that admits them, and the mark it left on the page
  handstamp:`<svg viewBox="0 0 24 24"><g transform="rotate(-8 12 10)"><path class="ink-fill" d="M8.4 4.6 C8.4 2.7 10 1.6 12 1.6 C14 1.6 15.6 2.7 15.6 4.6 C15.6 5.9 14.7 6.5 13.7 6.8 H10.3 C9.3 6.5 8.4 5.9 8.4 4.6 Z"/><rect class="ink-fill" x="10.4" y="6.6" width="3.2" height="2.9" rx="0.6"/><rect class="ink-fill" x="5.6" y="9.4" width="12.8" height="4.3" rx="1"/><path class="ink" stroke-width="1.2" d="M6.6 13.9 H17.4"/></g><path class="ink" stroke-width="1.6" d="M2.8 20.6 H21.2"/><path class="ink-fill" stroke-width="1.1" opacity="0.55" d="M17.6 14.4 L18.5 16.2 L20.5 16.5 L19.05 17.9 L19.4 19.8 L17.6 18.9 L15.8 19.8 L16.15 17.9 L14.7 16.5 L16.7 16.2 Z"/></svg>`,
  // their record, sung back off their own words — a ribbon mic with a voice either side of it
  duetmic: `<svg viewBox="0 0 24 24"><g opacity="0.85"><g class="ink-fill" stroke-width="1.3"><ellipse cx="2.5" cy="7.5" rx="1.25" ry="0.95" transform="rotate(-20 2.5 7.5)"/><ellipse cx="19.7" cy="7" rx="1.25" ry="0.95" transform="rotate(-20 19.7 7)"/></g><g class="ink" stroke-width="0.95" fill="none"><path d="M3.7 7.1 V3.2 C4.5 3.7 5.1 4.1 5.2 5"/><path d="M20.9 6.6 V2.7 C21.7 3.2 22.3 3.6 22.4 4.5"/></g></g><rect class="ink-fill" x="8.4" y="3" width="7.2" height="9.4" rx="3.2"/><g class="ink" stroke-width="0.85" opacity="0.5"><path d="M8.7 6 H15.3"/><path d="M8.5 8 H15.5"/><path d="M8.7 10 H15.3"/></g><path class="ink" stroke-width="1.2" fill="none" d="M6.7 6.6 V10.2 a5.3 5.3 0 0 0 10.6 0 V6.6"/><path class="ink" stroke-width="1.5" d="M12 15.5 V19.2"/><path class="ink-fill" d="M8.3 21.2 C8.7 19.8 9.9 19.3 12 19.3 C14.1 19.3 15.3 19.8 15.7 21.2 Z"/></svg>`,

  /* ---- Bonus games shelf ----
     Drawn off the SHELF's own furniture — the disc, the crate, the sleeve, the tape, the
     hand of cards — rather than off Taylor's. A bonus run is never ranked beside a main one,
     and its keepsakes should not look like they were.
     Three deliberate pairs sit in here, and they are pairs on purpose:
       · `taped` / `peeled` are one object in two states — Redacted with every strip still
         down, and Redacted with every strip bought.
       · `ringedword` / `mask` split Spot the Slip between the catch and the speed of it.
       · `highcard` / `receipt` are the same hand played well and played badly.
     Note these render on charm surfaces as PURE OUTLINE (.charm strokes both ink and
     ink-fill and fills neither), so nothing here relies on one shape hiding another: the
     disc leaving its sleeve is a half-disc flush to the sleeve's mouth rather than a whole
     circle tucked behind it, and the fanned hand is the one place overlap is drawn on
     purpose, because a fan of cards in line art shows every card's outline anyway. Secondary
     detail is classless `stroke="currentColor"`, which is the only way to keep a hairline
     hairline once the charm rules have set every ink stroke to 1.5. ---- */
  // the needle down in the grooves — your first run played through. Drawn as the arm and
  // the record it is sitting on rather than as a deck seen whole, because a disc with a
  // stick across it is `dart` at 30px, and these two live in the same section.
  tonearm: `<svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.5" stroke-linecap="round"><path d="M1.8 13.8 C6.4 12 14.6 11.6 21.4 12.8"/><path d="M1.8 16.5 C6.4 14.7 14.6 14.3 21.4 15.5"/><path d="M1.8 19.2 C6.4 17.4 14.6 17 21.4 18.2"/><path d="M1.8 21.9 C6.4 20.1 14.6 19.7 21.4 20.9"/></g><path class="ink" fill="none" stroke-width="1.6" d="M22.4 2.6 C20.8 3.8 20.4 5.6 18.8 6.9"/><circle class="ink-fill" cx="22.8" cy="2.1" r="1.2"/><g transform="rotate(28 16.4 8.2)"><rect class="ink-fill" x="14.4" y="6.2" width="4" height="4" rx="0.8"/></g><path class="ink" stroke-width="1.4" d="M15 9.9 L13.9 11.5"/><circle class="ink-fill" cx="13.6" cy="12.1" r="0.8"/></svg>`,
  // the crate flipped through to the back: five sleeves still filed, the sixth stood up out
  // of it. Five and one is the shelf's own count, not a decorative number.
  crate:   `<svg viewBox="0 0 24 24"><rect class="ink-fill" x="15.2" y="2.4" width="6.2" height="7.4" rx="0.6"/><circle cx="18.3" cy="6.1" r="2" fill="var(--paper)" stroke="currentColor" stroke-width="0.9"/><circle cx="18.3" cy="6.1" r="0.5" fill="currentColor" stroke="none"/><rect class="ink-fill" x="2.4" y="9.8" width="19.2" height="11.6" rx="1.3"/><g fill="none" stroke="currentColor" stroke-width="1.3" opacity="0.55"><path d="M5.2 11.1 V15.8"/><path d="M7.8 11.1 V15.8"/><path d="M10.4 11.1 V15.8"/><path d="M13 11.1 V15.8"/><path d="M15.6 11.1 V15.8"/></g><rect x="8.6" y="17.8" width="6.8" height="1.9" rx="0.95" fill="var(--paper)" stroke="currentColor" stroke-width="0.95"/></svg>`,
  // the whisk brush mid-stroke with the last crumbs going ahead of it — a game swept clean
  broom:   `<svg viewBox="0 0 24 24"><g transform="rotate(-22 12 11)"><rect class="ink-fill" x="10.9" y="3.2" width="2.2" height="7.4" rx="1.1"/><path class="ink-fill" d="M9.3 10.6 H14.7 L16.2 18.8 H7.8 Z"/><path class="ink" stroke-width="1.1" d="M8.95 13.6 H15.05"/><g fill="none" stroke="currentColor" stroke-width="0.85" opacity="0.55"><path d="M10.5 14.2 L9.9 18.5"/><path d="M12 14.2 V18.7"/><path d="M13.5 14.2 L14.1 18.5"/></g></g><g fill="currentColor" stroke="none"><circle cx="20.4" cy="20.3" r="0.65"/><circle cx="22.3" cy="18.5" r="0.5"/><circle cx="21.5" cy="21.9" r="0.45"/></g></svg>`,
  // the whole shelf swept, so the disc comes off the crate and goes on the wall: framed,
  // matted, with its little plate under it
  goldrecord:`<svg viewBox="0 0 24 24"><rect class="ink-fill" x="3.4" y="2.4" width="17.2" height="19.2" rx="1.2"/><circle cx="12" cy="10.4" r="6" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="12" cy="10.4" r="4.4" fill="none" stroke="currentColor" stroke-width="0.7" opacity="0.45"/><circle cx="12" cy="10.4" r="2.2" fill="none" stroke="currentColor" stroke-width="0.9"/><circle cx="12" cy="10.4" r="0.6" fill="currentColor" stroke="none"/><rect x="7" y="17.8" width="10" height="2.6" rx="0.5" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>`,
  // the sleeve taken off the page and its record stood against it, the writing still on the
  // face and the left edge torn where it came away from the notebook. The disc sits BESIDE
  // the sleeve rather than rising out of its mouth: a dome on a flat top edge is a
  // carrier-bag handle at charm size, however many grooves get drawn into it.
  sleeve:  `<svg viewBox="0 0 24 24"><circle class="ink-fill" cx="17" cy="13.8" r="5.9"/><circle cx="17" cy="13.8" r="4.2" fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.45"/><circle cx="17" cy="13.8" r="2.1" fill="var(--paper)" stroke="currentColor" stroke-width="1"/><circle cx="17" cy="13.8" r="0.5" fill="currentColor" stroke="none"/><g transform="rotate(-4 9 13.4)"><path class="ink-fill" d="M15.4 6.6 V20.4 H4.6 L3.3 18.1 L4.6 15.8 L3.3 13.5 L4.6 11.2 L3.3 8.9 L4.6 6.6 Z"/><g fill="none" stroke="currentColor" stroke-width="0.95" opacity="0.45" stroke-linecap="round"><path d="M6.6 10.4 H11.4"/><path d="M6.6 13 H9.8"/></g></g></svg>`,
  // one word out of the line ringed in a loop that runs well past where it started, the way
  // you ring a word you have already spotted. The tilt and the overshoot are load-bearing:
  // a closed symmetric oval with a bar through it is an eye, not a ring.
  ringedword: `<svg viewBox="0 0 24 24"><g class="ink" stroke-width="1.1" opacity="0.35" stroke-linecap="round"><path d="M2.8 3.2 H21.2"/><path d="M2.8 20.8 H21.2"/></g><path class="ink" fill="none" stroke-width="1.9" d="M18.2 8 C20.4 10.4 18.8 15.6 13.4 17.2 C8.2 18.7 3.4 16.6 3.6 12.6 C3.8 8.4 9.2 5.6 14.4 6.2 C16.6 6.5 18.4 7.4 19.4 8.9"/><g class="ink" stroke-width="2.6" stroke-linecap="round"><path d="M8.8 9.4 L14.4 14.6"/><path d="M14.4 9.4 L8.8 14.6"/></g></svg>`,
  // the fork struck and still ringing — you had the song off one line, which is as close to
  // knowing it from the pitch alone as this game gets. Narrow tines and a stub of a foot:
  // widen the bowl or sit it on a saucer and the whole thing turns into a trophy.
  tuningfork:`<svg viewBox="0 0 24 24"><path class="ink" fill="none" stroke-width="1.7" d="M9.2 2.4 V11.4 a2.8 2.8 0 0 0 5.6 0 V2.4"/><path class="ink" stroke-width="1.7" d="M12 14.2 V19.6"/><rect class="ink-fill" x="10.4" y="19.4" width="3.2" height="2.2" rx="0.9"/><g fill="none" stroke="currentColor" stroke-width="1.05" opacity="0.6" stroke-linecap="round"><path d="M6.6 4 C5.3 5.3 5.3 7.5 6.6 8.8"/><path d="M17.4 4 C18.7 5.3 18.7 7.5 17.4 8.8"/></g><g fill="none" stroke="currentColor" stroke-width="0.95" opacity="0.32" stroke-linecap="round"><path d="M4 2.6 C2 4.8 2 8 4 10.2"/><path d="M20 2.6 C22 4.8 22 8 20 10.2"/></g></svg>`,
  // the lifted word dropped back into its own gap and sitting square in it — the ruled line
  // runs into one side of the slot and out of the other, and the block carries a scrap of
  // handwriting so it reads as a WORD put back rather than a part clicked into a fitting.
  // Square is the rest of the charm: this is earned by spelling every word exactly.
  jigsaw: `<svg viewBox="0 0 24 24"><g transform="rotate(-5 12 12)"><path class="ink" fill="none" stroke-width="2" stroke-linejoin="round" d="M4.4 4.4 H9 a3 3 0 1 0 6 0 H19.6 V9 a3 3 0 1 1 0 6 V19.6 H4.4 Z"/></g></svg>`,
  // Redacted with the tape never touched: the verse taped shut end to end, and the title
  // signed underneath it anyway. Laid slightly askew, the way tape goes on by hand.
  taped:   `<svg viewBox="0 0 24 24"><g class="ink-fill"><rect x="3.4" y="3.6" width="7.6" height="3" rx="0.4" transform="rotate(-1.6 7.2 5.1)"/><rect x="12.4" y="3.6" width="8.2" height="3" rx="0.4" transform="rotate(1.1 16.5 5.1)"/><rect x="3.4" y="8.8" width="5.4" height="3" rx="0.4" transform="rotate(1.3 6.1 10.3)"/><rect x="10.2" y="8.8" width="10.4" height="3" rx="0.4" transform="rotate(-1 15.4 10.3)"/><rect x="3.4" y="14" width="9.4" height="3" rx="0.4" transform="rotate(-1.2 8.1 15.5)"/><rect x="14.2" y="14" width="6.4" height="3" rx="0.4" transform="rotate(1.4 17.4 15.5)"/></g><path class="ink" fill="none" stroke-width="1.6" d="M4.2 21 C5.8 17.8 6.8 21.6 8.5 19.8 C9.9 18.4 10.7 21.4 12.4 20.1 C14.1 18.8 15.4 21 17.2 19.5 C18.3 18.6 19.4 19.4 20.4 20.4"/></svg>`,
  // the rarest card taken out of the fan and held up clear of it. The gap under it is doing
  // the work — the pip alone would only say "a card", not "the thin air above the hand".
  highcard: `<svg viewBox="0 0 24 24"><rect class="ink-fill" x="3.6" y="18.6" width="16.8" height="3.6" rx="1.3" transform="rotate(-3 12 20.4)"/><g transform="rotate(-9 12.2 9.2)"><rect class="ink-fill" x="7.3" y="2.4" width="9.8" height="13.6" rx="1.2"/><path d="M12.2 5.4 L15.2 9.2 L12.2 13 L9.2 9.2 Z" fill="currentColor" stroke="none"/></g><path d="M21.2 1.7 L22 3.8 L24.1 4.6 L22 5.4 L21.2 7.5 L20.4 5.4 L18.3 4.6 L20.4 3.8 Z" fill="currentColor" stroke="none"/></svg>`,
  // four links running up the page and not one of them open, with the sparks off the last
  // one still in the air. The links alternate face-on and edge-on, which is the only thing
  // separating a chain from a row of beads once everything is drawn in outline.
  chain:   `<svg viewBox="0 0 24 24"><g class="ink" fill="none"><ellipse cx="5.6" cy="18.4" rx="3.4" ry="2.1" transform="rotate(-45 5.6 18.4)"/><ellipse cx="9.7" cy="14.3" rx="3.4" ry="1.15" transform="rotate(-45 9.7 14.3)"/><ellipse cx="13.8" cy="10.2" rx="3.4" ry="2.1" transform="rotate(-45 13.8 10.2)"/><ellipse cx="17.9" cy="6.1" rx="3.4" ry="1.15" transform="rotate(-45 17.9 6.1)"/></g><g fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.8" stroke-linecap="round"><path d="M21 3.4 L22.4 2"/><path d="M21.6 6.2 L23.2 5.7"/><path d="M18.6 1.8 L19.1 0.5"/></g><g fill="currentColor" stroke="none"><circle cx="8.4" cy="9.2" r="0.55"/><circle cx="5.6" cy="11.6" r="0.45"/></g></svg>`,
  // the till roll for a card everybody already had: torn top and bottom, three lines of
  // nothing much, and a total ruled under it
  receipt: `<svg viewBox="0 0 24 24"><g transform="rotate(-5 12 12)"><path class="ink-fill" d="M6.6 3.4 L8.2 4.3 L9.8 3.4 L11.4 4.3 L13 3.4 L14.6 4.3 L16.2 3.4 L17.4 4.2 V19.5 L16.2 20.6 L14.6 19.7 L13 20.6 L11.4 19.7 L9.8 20.6 L8.2 19.7 L6.6 20.6 Z"/><g fill="none" stroke="currentColor" stroke-width="0.9" opacity="0.45" stroke-linecap="round"><path d="M8.4 7.9 H15.6"/><path d="M8.4 10.1 H13.9"/><path d="M8.4 12.3 H15.2"/></g><path fill="none" stroke="currentColor" stroke-width="0.9" opacity="0.7" d="M8.4 14.4 H15.6"/><path fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.9" stroke-linecap="round" d="M8.4 17 H12.2"/></g></svg>`,
  // the same page after you bought the lot: every strip off and heaped up any old how, the
  // verse above finally readable. The twin of `taped`, and meant to be read against it —
  // that one is a block laid straight, this one is a mess, and that is the whole difference.
  peeled: `<svg viewBox="0 0 24 24"><rect class="ink-fill" x="8.4" y="2.2" width="13.4" height="4.4" rx="0.9" transform="rotate(-15 15.1 4.4)"/><rect x="2.6" y="9" width="18.8" height="5.4" rx="0.9" fill="currentColor" stroke="none"/><path class="ink" stroke-width="1.2" opacity="0.4" d="M2.6 17.6 H11.2"/><circle class="ink-fill" cx="17.8" cy="19" r="3.9"/><circle cx="17.8" cy="19" r="1.3" fill="currentColor" stroke="none"/></svg>`,
  // ten hands dealt and not one card played: the web got there first
  spider: `<svg viewBox="0 0 24 24"><path class="ink" stroke-width="1.3" fill="none" d="M12 0.4 V5.1"/><g class="ink" fill="none" stroke-width="1.6" stroke-linecap="round"><path d="M8.95 11.4 C5.6 10.6 3.8 8.8 2.9 6.4"/><path d="M7.69 14 C4.8 14.2 2.9 15.2 1.7 17"/><path d="M7.78 16.4 C6.2 18.2 5.5 20 5.3 22.2"/><path d="M15.05 11.4 C18.4 10.6 20.2 8.8 21.1 6.4"/><path d="M16.31 14 C19.2 14.2 21.1 15.2 22.3 17"/><path d="M16.22 16.4 C17.8 18.2 18.5 20 18.7 22.2"/></g><circle class="ink-fill" cx="12" cy="7.8" r="2.7"/><ellipse class="ink-fill" cx="12" cy="15" rx="4.4" ry="5"/><g fill="currentColor" stroke="none"><circle cx="10.85" cy="7.4" r="0.8"/><circle cx="13.15" cy="7.4" r="0.8"/></g></svg>`,
  // one ring out. The whole charm is the couple of millimetres between the tip and the
  // middle, so nothing else on the board is allowed to be interesting.
  dart:    `<svg viewBox="0 0 24 24"><circle class="ink-fill" cx="10.6" cy="13.4" r="7.6"/><circle cx="10.6" cy="13.4" r="4.9" fill="none" stroke="currentColor" stroke-width="1"/><circle cx="10.6" cy="13.4" r="2.1" fill="none" stroke="currentColor" stroke-width="1"/><circle cx="10.6" cy="13.4" r="0.75" fill="currentColor" stroke="none"/><path class="ink" stroke-width="2.4" d="M14.1 10.2 L16.7 8"/><path class="ink" stroke-width="1.2" d="M12.5 11.6 L14.1 10.2"/><path class="ink" stroke-width="1.2" d="M16.7 8 L19.1 5.9"/><path class="ink-fill" d="M18.6 6.9 L21.1 2.6 L22.9 4.1 L20.4 8.4 Z"/></svg>`,
  // the mask off before it was ever properly on. The ties streaming and the air behind them
  // are the two seconds — a mask sitting still would only say "impostor", not "caught".
  mask:    `<svg viewBox="0 0 24 24"><g transform="rotate(-10 13 12)"><path class="ink-fill" d="M4.6 11.2 C4.6 8.7 6.5 7.4 9.2 7.4 C10.9 7.4 12.2 7.9 13 8.6 C13.8 7.9 15.1 7.4 16.8 7.4 C19.5 7.4 21.4 8.7 21.4 11.2 C21.4 14.5 19.2 17 16.4 17 C14.3 17 13.4 15.2 13 13.7 C12.6 15.2 11.7 17 9.6 17 C6.8 17 4.6 14.5 4.6 11.2 Z"/><ellipse cx="8.9" cy="11.6" rx="2" ry="1.45" fill="var(--paper)" stroke="currentColor" stroke-width="0.9" transform="rotate(-7 8.9 11.6)"/><ellipse cx="17.1" cy="11.6" rx="2" ry="1.45" fill="var(--paper)" stroke="currentColor" stroke-width="0.9" transform="rotate(7 17.1 11.6)"/></g><g fill="none" stroke="currentColor" stroke-width="1.1" opacity="0.7" stroke-linecap="round"><path d="M4.8 13 C3.4 14.6 2.2 15.8 1 16.2"/><path d="M5.6 15.2 C4.6 17.2 3.6 18.8 2.4 20"/></g><g fill="none" stroke="currentColor" stroke-width="1" opacity="0.4" stroke-linecap="round"><path d="M0.8 6.2 H4.6"/><path d="M0.4 9 H3.2"/></g></svg>`,

  /* ---- The Core batch: the clock charms ----
     Five marks that all say "time" and must not say it the same way, so each one owns a
     different piece of the dial: the wedge, the half, the crease. Anything that wants a
     clock and can do without one takes the lamp or the wind instead. */
  // thirteen pages gone before the third second — the sheet lifted on a gust with its corner
  // still curling, and the air it came through ruled in behind it
  gustpage:`<svg viewBox="0 0 24 24"><g transform="rotate(11 14 12)"><path class="ink-fill" d="M8.6 3.2 H19.4 V20.8 H8.6 Z"/><path d="M19.4 14.8 L14.8 20.8 H19.4 Z" fill="var(--paper)" stroke="none"/><path class="ink" stroke-width="1.2" fill="none" d="M19.4 14.8 C17 15.2 15.4 17.4 14.8 20.8"/><g fill="none" stroke="currentColor" stroke-width="1" opacity="0.5"><path d="M10.8 7.4 H17"/><path d="M10.8 10.4 H16"/></g></g><g class="ink" stroke-width="1.3" opacity="0.7" fill="none" stroke-linecap="round"><path d="M1.4 6.6 H6.4"/><path d="M0.9 11 H5.2"/><path d="M2 15.4 H6"/></g></svg>`,
  // the answer written into the last grain, thirteen times over: the dial's final wedge
  // inked and the hand stood at the top. The wedge is the whole charm, so the rest of the
  // face is kept as plain as a face can be
  lasttick:`<svg viewBox="0 0 24 24"><circle class="ink-fill" cx="12" cy="12.4" r="8.8"/><path d="M12 12.4 V3.6 A8.8 8.8 0 0 0 6.3 5.7 Z" fill="currentColor" stroke="none"/><g class="ink" stroke-width="1" opacity="0.5"><path d="M20.8 12.4 H19.3"/><path d="M12 21.2 V19.7"/><path d="M3.2 12.4 H4.7"/></g><path class="ink" stroke-width="1.7" d="M12 12.4 V4.8"/><circle cx="12" cy="12.4" r="0.95" fill="currentColor" stroke="none"/></svg>`,
  // three pages inside a second each — three strokes leaning the same way off the line, one
  // spark struck over each
  snapthree:`<svg viewBox="0 0 24 24"><g class="ink" fill="none" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.4 L7 14.6 L9.8 8.4"/><path d="M11.4 12.4 L13.4 14.6 L16.2 8.4"/><path d="M17.8 12.4 L19.8 14.6 L22.6 8.4"/></g><g class="ink" stroke-width="1.3" opacity="0.5" stroke-linecap="round"><path d="M0.8 9.4 H3.4"/><path d="M0.4 12.4 H2.8"/><path d="M1.2 15.4 H3.2"/></g><path class="ink" stroke-width="1.2" opacity="0.35" d="M3.4 19.6 H21.6"/></svg>`,
  // perfect and gone before the ink dried: the star with the air it went through drawn in
  // behind it. The streaks stop short of the point — touching it turns the whole thing into
  // a shooting star, which is `comet`'s job
  blurstar:`<svg viewBox="0 0 24 24"><path class="ink-fill" stroke-width="1.1" d="M14 3 L16.5 8.1 L22.1 8.9 L18.05 12.85 L19 18.4 L14 15.8 L9 18.4 L9.95 12.85 L5.9 8.9 L11.5 8.1 Z"/><g class="ink" stroke-width="1.3" opacity="0.6" stroke-linecap="round"><path d="M0.8 7.6 H4.2"/><path d="M0.4 11.6 H3.4"/><path d="M1.4 15.6 H4.2"/></g></svg>`,
  // the clock never let past halfway: the top half of the dial inked and the hand parked
  // flat on the line it never crossed
  halfdial:`<svg viewBox="0 0 24 24"><circle class="ink-fill" cx="12" cy="12" r="8.8"/><path d="M3.2 12 A8.8 8.8 0 0 1 20.8 12 Z" fill="currentColor" stroke="none" opacity="0.75"/><path class="ink" stroke-width="1.4" d="M3.2 12 H20.8"/><path class="ink" stroke-width="1.8" d="M12 12 H19.6"/><circle cx="12" cy="12" r="1.05" fill="var(--paper)" stroke="currentColor" stroke-width="0.9"/><g class="ink" stroke-width="1" opacity="0.5"><path d="M12 20.8 V19.3"/><path d="M6.1 19.1 L6.85 17.8"/><path d="M17.9 19.1 L17.15 17.8"/></g></svg>`,
  // a clean sheet: thirteen ticks down the page and not one crossing-out beside them. The
  // margin rule is load-bearing — this is the notebook's own page, where `checklist` is a
  // clipboard of songs
  cleanpage:`<svg viewBox="0 0 24 24"><rect class="ink-fill" x="4" y="2.6" width="16" height="18.8" rx="1.4"/><path class="ink" stroke-width="1.05" opacity="0.45" d="M7.4 3.2 V20.8"/><g fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"><path d="M9 6.2 l1.1 1.1 L12.2 5"/><path d="M13.4 6.2 l1.1 1.1 L16.6 5"/><path d="M9 10.2 l1.1 1.1 L12.2 9"/><path d="M13.4 10.2 l1.1 1.1 L16.6 9"/><path d="M9 14.2 l1.1 1.1 L12.2 13"/><path d="M13.4 14.2 l1.1 1.1 L16.6 13"/><path d="M9 18.2 l1.1 1.1 L12.2 17"/><path d="M13.4 18.2 l1.1 1.1 L16.6 17"/></g></svg>`,
  // sitting on a page you have already solved: the nib parked on the line with the ink
  // pooling under it and the rings of a long wait spreading out. Not `inkspill` — the pen
  // is still in the picture, which is the difference between a mess and a wait
  dwell:`<svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.05" opacity="0.4" stroke-linecap="round"><path d="M2.4 17.4 H21.6"/><path d="M2.4 21 H15.6"/></g><g transform="rotate(30 12.6 8.4)"><path class="ink-fill" d="M10.6 1.4 H14.6 L14.2 10.2 L12.6 13.6 L11 10.2 Z"/><path class="ink" stroke-width="1" d="M12.6 8 V12.2"/><circle cx="12.6" cy="7.2" r="1.1" fill="var(--paper)" stroke="none"/></g><path class="ink-fill" d="M16.4 14.8 C19.2 15.4 20.8 16.6 20.8 18.2 C20.8 19.9 19 21 17.2 20.4 C15.6 19.9 15.2 18.6 14.2 17.9 C13.2 17.2 13.8 15.2 16.4 14.8 Z"/><g fill="currentColor" stroke="none" opacity="0.45"><circle cx="21.6" cy="21.4" r="0.6"/><circle cx="12.6" cy="20.4" r="0.45"/></g></svg>`,
  /* ---- The Core batch: the wrong-answer charms ----
     Four marks that are all a word struck through, so each carries something else to be
     read by: ivy, a second sleeve, a full page, a fade. */
  // the same wrong answer five times over — the ivy up the word, a leaf for every go
  ivyword:`<svg viewBox="0 0 24 24"><rect class="ink-fill" x="2.8" y="14.8" width="18.4" height="3.6" rx="0.8"/><path class="ink" stroke-width="1.6" stroke-linecap="round" d="M2 19 L22 14"/><path class="ink" fill="none" stroke-width="1.2" d="M4.6 21.4 C7.4 19.4 8.8 15.6 11 11.4 C12.6 8.2 15 5 18.8 2.4"/><g class="ink-fill" stroke-width="1.2"><path d="M9.4 18.8 C10.8 18.4 12 19.4 11.8 20.8 C10.2 21.2 9 20.4 9.4 18.8 Z"/><path d="M8 13.6 C6.6 13.2 5.4 14 5.6 15.6 C7.2 16 8.4 15.2 8 13.6 Z"/><path d="M13.6 11.6 C15 11.2 16.2 12.2 16 13.6 C14.4 14 13.2 13.2 13.6 11.6 Z"/><path d="M12.6 6.8 C11.2 6.4 10 7.2 10.2 8.8 C11.8 9.2 13 8.4 12.6 6.8 Z"/><path d="M18.4 5 C19.8 4.6 21 5.6 20.8 7 C19.2 7.4 18 6.6 18.4 5 Z"/></g></svg>`,
  // a song you handed over wrongly once and got right later — the sleeve struck out above,
  // the same sleeve ticked below
  rightsong:`<svg viewBox="0 0 24 24"><rect class="ink-fill" x="2.2" y="2.2" width="9.2" height="9.2" rx="0.9"/><circle cx="6.8" cy="6.8" r="2.5" fill="var(--paper)" stroke="currentColor" stroke-width="0.95"/><circle cx="6.8" cy="6.8" r="0.5" fill="currentColor" stroke="none"/><path class="ink" stroke-width="1.7" stroke-linecap="round" d="M2.6 11 L11 2.6"/><rect class="ink-fill" x="12.6" y="12.6" width="9.2" height="9.2" rx="0.9"/><circle cx="17.2" cy="17.2" r="2.5" fill="var(--paper)" stroke="currentColor" stroke-width="0.95"/><circle cx="17.2" cy="17.2" r="0.5" fill="currentColor" stroke="none"/><path class="ink" stroke-width="1.9" fill="none" stroke-linecap="round" d="M2.8 17.6 L5.6 20.4 L10.4 13.8"/></svg>`,
  // thirteen wrong with something written every single time — the page full of tries and
  // every one of them ruled out. The handwriting is the point: nothing here was skipped
  everycrossed:`<svg viewBox="0 0 24 24"><rect class="ink-fill" x="3.6" y="2.4" width="16.8" height="19.2" rx="1.3"/><g fill="none" stroke="currentColor" stroke-width="1.05" opacity="0.85" stroke-linecap="round"><path d="M6 5.4 C7 4.4 7.6 6 8.6 5.2 C9.4 4.6 10 5.8 11 5.2 C12 4.6 12.8 5.8 13.8 5.2"/><path d="M6 9 C7 8 7.6 9.6 8.6 8.8 C9.4 8.2 10 9.4 11 8.8 C12 8.2 13.4 9.4 14.6 8.8"/><path d="M6 12.6 C7 11.6 7.6 13.2 8.6 12.4 C9.4 11.8 10.6 13 11.8 12.4"/><path d="M6 16.2 C7 15.2 7.6 16.8 8.6 16 C9.4 15.4 10.4 16.6 11.6 16"/><path d="M6 19.8 C7 18.8 7.6 20.4 8.6 19.6 C9.4 19 10.8 20.2 12.2 19.6"/></g><g class="ink" stroke-width="1.4" stroke-linecap="round"><path d="M5.2 5.9 L14.8 4.7"/><path d="M5.2 9.5 L15.6 8.3"/><path d="M5.2 13.1 L12.8 11.9"/><path d="M5.2 16.7 L12.6 15.5"/><path d="M5.2 20.3 L13.2 19.1"/></g></svg>`,
  // the word that has beaten you three times: the same block written out again and again,
  // struck out again and again, the older two fading behind the one in front
  ghost: `<svg viewBox="0 0 24 24"><path class="ink" fill="none" stroke-width="1.9" stroke-linejoin="round" d="M5.6 21.2 V10.6 A6.4 6.4 0 0 1 18.4 10.6 V21.2 L15.6 18.8 L12 21.2 L8.4 18.8 Z"/><g fill="currentColor" stroke="none"><ellipse cx="9.7" cy="10.4" rx="1.15" ry="1.5"/><ellipse cx="14.3" cy="10.4" rx="1.15" ry="1.5"/></g><path class="ink" fill="none" stroke-width="1.5" d="M10.7 14.8 C11.6 15.9 12.4 15.9 13.3 14.8"/></svg>`,
  /* ---- The Core batch: the word charms ---- */
  // right, having lost it to that same word before: the old attempt struck and faded on the
  // line above, the word ringed on the line below
  wordreturned: `<svg viewBox="0 0 24 24"><path class="ink" fill="none" stroke-width="2" d="M20.4 11.3 A8.4 8.4 0 1 1 16.8 5.1"/><path d="M19.6 7.05 L14.55 6.58 L17.42 2.48 Z" fill="currentColor" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round"/><path class="ink" fill="none" stroke-width="2.6" stroke-linecap="round" d="M7.8 12.3 L10.6 15.2 L16 9"/></svg>`,
  // the word you have missed most, finally gone: the block broken clean through the middle,
  // with the give of it drawn out either side
  crackedword:`<svg viewBox="0 0 24 24"><path class="ink-fill" d="M3.2 8.6 H10.6 L9 12 L10.6 15.4 H3.2 Z"/><path class="ink-fill" d="M20.8 8.6 H13.4 L15 12 L13.4 15.4 H20.8 Z"/><g class="ink" stroke-width="1.2" opacity="0.55" stroke-linecap="round"><path d="M12 5.4 V2.6"/><path d="M8.6 6.2 L7 4"/><path d="M15.4 6.2 L17 4"/><path d="M12 18.6 V21.4"/><path d="M8.6 17.8 L7 20"/><path d="M15.4 17.8 L17 20"/></g></svg>`,
  // every word in the pool dealt at least once: the page gone through with all of it ringed,
  // nothing on it left unturned
  wordscroll: `<svg viewBox="0 0 24 24"><g class="ink" stroke-width="1.6"><path d="M5.6 5.4 V18.6"/><path d="M18.4 5.4 V18.6"/></g><path class="ink" fill="none" stroke-width="2.6" stroke-linecap="round" d="M8.6 12.4 L11 14.9 L15.6 8.8"/><rect class="ink-fill" x="3.2" y="1.9" width="17.6" height="3.8" rx="1.9"/><rect class="ink-fill" x="3.2" y="18.3" width="17.6" height="3.8" rx="1.9"/></svg>`,
  /* ---- The Core batch: the run-against-run charms ---- */
  // nothing, and then everything: the candle snuffed and still smoking beside the one lit
  // straight back off it
  relit:`<svg viewBox="0 0 24 24"><rect class="ink-fill" x="3.2" y="10.6" width="5.6" height="10.4" rx="0.9"/><path class="ink" stroke-width="1.2" d="M6 10.6 V8.8"/><g class="ink" fill="none" stroke-width="1.05" opacity="0.45" stroke-linecap="round"><path d="M6 8.4 C7.6 6.8 4.6 5.6 6 3.6 C6.7 2.6 6.4 1.9 5.8 1.4"/></g><rect class="ink-fill" x="14.4" y="10.6" width="6.2" height="10.4" rx="0.9"/><path class="ink" stroke-width="1.2" d="M17.5 10.6 V8.6"/><path class="ink-fill" d="M17.5 2.6 C19.5 5 20.4 6.4 20.4 7.7 A2.9 2.9 0 0 1 14.6 7.7 C14.6 6.4 15.5 5 17.5 2.6 Z"/><path d="M17.5 5.8 C18.4 7.1 18.7 7.7 18.7 8.2 A1.2 1.2 0 0 1 16.3 8.2 C16.3 7.7 16.6 7.1 17.5 5.8 Z" fill="none" stroke="currentColor" stroke-width="0.95"/></svg>`,
  // two perfect games back to back — the second star out of the first one's shadow, not a
  // pair sat side by side, because side by side reads as a rating
  twostars:`<svg viewBox="0 0 24 24"><path class="ink-fill" stroke-width="1.1" d="M8.2 2.4 L10.1 6.3 L14.4 6.9 L11.3 9.9 L12 14.2 L8.2 12.2 L4.4 14.2 L5.1 9.9 L2 6.9 L6.3 6.3 Z"/><path class="ink-fill" stroke-width="1.1" d="M15.8 9.6 L17.7 13.5 L22 14.1 L18.9 17.1 L19.6 21.4 L15.8 19.4 L12 21.4 L12.7 17.1 L9.6 14.1 L13.9 13.5 Z"/></svg>`,
  // three games finished on the very same score: three cards, three identical tallies, and
  // the equals sign put in between them so it cannot read as "three games played"
  samescore: `<svg viewBox="0 0 24 24"><path class="ink" stroke-width="2" stroke-linecap="round" d="M3.4 7.2 H20.6"/><path class="ink" stroke-width="2" d="M12 5.4 V19.4"/><path class="ink" stroke-width="2.2" stroke-linecap="round" d="M7.6 19.8 H16.4"/><circle class="ink-fill" cx="12" cy="3.9" r="1.5"/><g class="ink" stroke-width="1.4"><path d="M5.4 7.4 V10.3"/><path d="M18.6 7.4 V10.3"/></g><g class="ink" fill="none" stroke-width="2"><path d="M1.8 10.4 A3.6 3.6 0 0 1 9 10.4 Z"/><path d="M15 10.4 A3.6 3.6 0 0 1 22.2 10.4 Z"/></g></svg>`,
  // the same song handed in twice running — two sleeves off the same press, and the loop
  // that took you back round to it
  twinsleeve:`<svg viewBox="0 0 24 24"><g transform="rotate(-7 7.4 8.4)"><rect class="ink-fill" x="2.6" y="3.6" width="9.6" height="9.6" rx="0.9"/><circle cx="7.4" cy="8.4" r="2.7" fill="var(--paper)" stroke="currentColor" stroke-width="1"/><circle cx="7.4" cy="8.4" r="0.55" fill="currentColor" stroke="none"/></g><g transform="rotate(7 16.4 15.4)"><rect class="ink-fill" x="11.6" y="10.6" width="9.6" height="9.6" rx="0.9"/><circle cx="16.4" cy="15.4" r="2.7" fill="var(--paper)" stroke="currentColor" stroke-width="1"/><circle cx="16.4" cy="15.4" r="0.55" fill="currentColor" stroke="none"/></g><path class="ink" fill="none" stroke-width="1.3" d="M3.2 16.6 C3.4 19.8 6.4 21.6 9.6 20.8"/><path class="ink-fill" d="M1.9 18.2 L4.6 17.6 L3.2 15.2 Z"/></svg>`,
  // and then a third time in the one game — the twin of `twinsleeve`, and meant to be read
  // against it: one more sleeve and the loop closed right over the top of the lot
  triplesleeve:`<svg viewBox="0 0 24 24"><g transform="rotate(-8 5.6 6.4)"><rect class="ink-fill" x="1.6" y="2.4" width="8" height="8" rx="0.8"/><circle cx="5.6" cy="6.4" r="2.1" fill="var(--paper)" stroke="currentColor" stroke-width="0.95"/><circle cx="5.6" cy="6.4" r="0.45" fill="currentColor" stroke="none"/></g><rect class="ink-fill" x="8" y="8" width="8" height="8" rx="0.8"/><circle cx="12" cy="12" r="2.1" fill="var(--paper)" stroke="currentColor" stroke-width="0.95"/><circle cx="12" cy="12" r="0.45" fill="currentColor" stroke="none"/><g transform="rotate(8 18.4 17.6)"><rect class="ink-fill" x="14.4" y="13.6" width="8" height="8" rx="0.8"/><circle cx="18.4" cy="17.6" r="2.1" fill="var(--paper)" stroke="currentColor" stroke-width="0.95"/><circle cx="18.4" cy="17.6" r="0.45" fill="currentColor" stroke="none"/></g></svg>`,
  /* ---- The Core batch: the long-haul charms ----
     Three counters that are all "a lot of it", so none of them is allowed to be a stack:
     ticked pages, a bound ledger, a line of finished cards. */
  // five hundred pages answered: the stack of them with the top sheet still ticked
  pagestack:`<svg viewBox="0 0 24 24"><g class="ink-fill"><rect x="4.4" y="16.4" width="15.2" height="4.6" rx="0.9" transform="rotate(2 12 18.7)"/><rect x="3.8" y="12" width="15.2" height="4.6" rx="0.9" transform="rotate(-2.5 11.4 14.3)"/><rect x="4.8" y="7.6" width="15.2" height="4.6" rx="0.9" transform="rotate(1.6 12.4 9.9)"/></g><g transform="rotate(-3 12 5)"><rect class="ink-fill" x="4.4" y="2.4" width="15.2" height="5.2" rx="0.9"/><g fill="none" stroke="currentColor" stroke-width="1.05" stroke-linecap="round"><path d="M6.6 5 l0.8 0.9 L9 3.8"/><path d="M10.4 5 l0.8 0.9 L13 3.8"/><path d="M14.2 5 l0.8 0.9 L16.8 3.8"/></g></g></svg>`,
  // one thousand nine hundred and eighty-nine rounds, which is a book rather than a pile:
  // the ledger shut with its ribbon in, and the edge of every page it took
  ledger:`<svg viewBox="0 0 24 24"><path class="ink-fill" d="M4.2 3 a1.8 1.8 0 0 1 1.8 -1.8 H19.4 V20.4 H6 a1.8 1.8 0 0 0 -1.8 1.8 Z"/><path class="ink" stroke-width="1.05" d="M6.4 1.6 V19.6"/><g fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.5"><path d="M19.4 3.4 H21"/><path d="M19.4 5.4 H21"/><path d="M19.4 7.4 H21"/><path d="M19.4 9.4 H21"/><path d="M19.4 11.4 H21"/><path d="M19.4 13.4 H21"/><path d="M19.4 15.4 H21"/><path d="M19.4 17.4 H21"/></g><g fill="none" stroke="currentColor" stroke-width="0.9" opacity="0.45"><path d="M8.8 6 H17"/><path d="M8.8 8.6 H17"/><path d="M8.8 11.2 H14.6"/></g><path class="ink-fill" d="M11.4 1.4 H14.2 V9.4 L12.8 8 L11.4 9.4 Z"/></svg>`,
  // eighty-nine games seen through: the scorecards pegged out along the line, the way you
  // keep the ones that are finished with
  pegged:`<svg viewBox="0 0 24 24"><path class="ink" stroke-width="1.3" fill="none" d="M0.8 5.2 C6.6 7.8 17.4 7.8 23.2 5.2"/><g transform="rotate(-6 4.6 13.4)"><rect class="ink-fill" x="1.6" y="9" width="6" height="8.4" rx="0.8"/><g fill="none" stroke="currentColor" stroke-width="0.9" opacity="0.5"><path d="M3.1 12 H6.1"/><path d="M3.1 14.2 H5.3"/></g></g><g transform="rotate(3 12 14.6)"><rect class="ink-fill" x="9" y="10.2" width="6" height="8.4" rx="0.8"/><g fill="none" stroke="currentColor" stroke-width="0.9" opacity="0.5"><path d="M10.5 13.2 H13.5"/><path d="M10.5 15.4 H12.7"/></g></g><g transform="rotate(-3 19.4 13.6)"><rect class="ink-fill" x="16.4" y="9.2" width="6" height="8.4" rx="0.8"/><g fill="none" stroke="currentColor" stroke-width="0.9" opacity="0.5"><path d="M17.9 12.2 H20.9"/><path d="M17.9 14.4 H20.1"/></g></g><g class="ink-fill"><rect x="3.6" y="5.8" width="1.9" height="3.6" rx="0.75"/><rect x="11.1" y="7.2" width="1.9" height="3.6" rx="0.75"/><rect x="18.5" y="6.2" width="1.9" height="3.6" rx="0.75"/></g></svg>`,
  // fifty right on the trot, however many games that takes — the thread of them running
  // clean through the break between one game and the next
  brokenwall: `<svg viewBox="0 0 24 24"><path class="ink" fill="none" stroke-width="1.8" stroke-linejoin="round" d="M2.8 20.6 V6 H8.2 L9.8 10.6 L7.8 12.8 L11.6 14.6 L14.2 11 L15.8 6 H21.2 V20.6 Z"/><g class="ink" stroke-width="1.3" fill="none"><path d="M2.8 10.4 H9.2"/><path d="M15.4 10.4 H21.2"/><path d="M2.8 17.4 H21.2"/><path d="M5.8 6 V10.4"/><path d="M18.4 6 V10.4"/><path d="M6.6 17.4 V20.6"/><path d="M16.4 17.4 V20.6"/></g><g fill="currentColor" stroke="none"><circle cx="11.2" cy="3.2" r="1.1"/><circle cx="16.6" cy="2.2" r="0.85"/><circle cx="6.4" cy="2.6" r="0.7"/></g></svg>`,

  /* ---- The Core batch: the habit and calendar charms ----
     Five dated marks that would all default to "a calendar", so each takes a different piece
     of one: the week strip, the month grid, the year's wheel, a torn leaf, a single square. */
  // seven days without missing one: the week hung up with every day of it ticked off
  sevendays:`<svg viewBox="0 0 24 24"><rect class="ink-fill" x="1.4" y="5.2" width="21.2" height="14" rx="1.3"/><g fill="none" stroke="currentColor" stroke-width="0.85" opacity="0.3"><path d="M4.4 5.6 V18.8"/><path d="M7.4 5.6 V18.8"/><path d="M10.4 5.6 V18.8"/><path d="M13.4 5.6 V18.8"/><path d="M16.4 5.6 V18.8"/><path d="M19.4 5.6 V18.8"/></g><g fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2 13.4 l1.1 1.4 L4.6 9.6"/><path d="M5 13.4 l1.1 1.4 L7.6 9.6"/><path d="M8 13.4 l1.1 1.4 L10.6 9.6"/><path d="M11 13.4 l1.1 1.4 L13.6 9.6"/><path d="M14 13.4 l1.1 1.4 L16.6 9.6"/><path d="M17 13.4 l1.1 1.4 L19.6 9.6"/><path d="M20 13.4 l1.1 1.4 L22.6 9.6"/></g><g class="ink" stroke-width="1.3"><path d="M5.6 2.4 V5.2"/><path d="M18.4 2.4 V5.2"/></g></svg>`,
  // thirteen days on the calendar, scattered where they fell — thirteen squares filled and
  // no attempt made to line them up, because the run is not the charm here
  thirteendays:`<svg viewBox="0 0 24 24"><rect class="ink-fill" x="2.4" y="4" width="19.2" height="17.6" rx="1.3"/><path class="ink" stroke-width="1.05" d="M2.6 8.4 H21.4"/><g class="ink" stroke-width="1.2"><path d="M7.4 1.8 V5"/><path d="M16.6 1.8 V5"/></g><g fill="currentColor" stroke="none"><rect x="4.4" y="10" width="2.4" height="2.4" rx="0.5"/><rect x="11" y="10" width="2.4" height="2.4" rx="0.5"/><rect x="14.3" y="10" width="2.4" height="2.4" rx="0.5"/><rect x="17.6" y="10" width="2.4" height="2.4" rx="0.5"/><rect x="4.4" y="13.6" width="2.4" height="2.4" rx="0.5"/><rect x="7.7" y="13.6" width="2.4" height="2.4" rx="0.5"/><rect x="14.3" y="13.6" width="2.4" height="2.4" rx="0.5"/><rect x="17.6" y="13.6" width="2.4" height="2.4" rx="0.5"/><rect x="4.4" y="17.2" width="2.4" height="2.4" rx="0.5"/><rect x="7.7" y="17.2" width="2.4" height="2.4" rx="0.5"/><rect x="11" y="17.2" width="2.4" height="2.4" rx="0.5"/><rect x="14.3" y="17.2" width="2.4" height="2.4" rx="0.5"/><rect x="17.6" y="17.2" width="2.4" height="2.4" rx="0.5"/></g></svg>`,
  // all twelve months of it: the year drawn as its own dial, one tick a month the whole way
  // round, with the season sat in the middle of it
  twelvemonths:`<svg viewBox="0 0 24 24"><circle class="ink" fill="none" cx="12" cy="12" r="8.4" stroke-width="1" opacity="0.3"/><g class="ink-fill"><rect x="10.75" y="2.35" width="2.5" height="2.5" rx="0.6"/><rect x="14.95" y="3.47" width="2.5" height="2.5" rx="0.6"/><rect x="18.02" y="6.55" width="2.5" height="2.5" rx="0.6"/><rect x="19.15" y="10.75" width="2.5" height="2.5" rx="0.6"/><rect x="18.02" y="14.95" width="2.5" height="2.5" rx="0.6"/><rect x="14.95" y="18.02" width="2.5" height="2.5" rx="0.6"/><rect x="10.75" y="19.15" width="2.5" height="2.5" rx="0.6"/><rect x="6.55" y="18.02" width="2.5" height="2.5" rx="0.6"/><rect x="3.48" y="14.95" width="2.5" height="2.5" rx="0.6"/><rect x="2.35" y="10.75" width="2.5" height="2.5" rx="0.6"/><rect x="3.48" y="6.55" width="2.5" height="2.5" rx="0.6"/><rect x="6.55" y="3.47" width="2.5" height="2.5" rx="0.6"/></g><circle class="ink-fill" cx="12" cy="12" r="1.9"/></svg>`,
  // "august" answered in August: the month torn off the pad and going, the sheet under it
  // already the next one
  tornmonth:`<svg viewBox="0 0 24 24"><path class="ink-fill" d="M3.6 4.2 H16.4 V13.4 L13.6 11.4 L10 13.8 L6.8 11.6 L3.6 13.6 Z"/><g class="ink" stroke-width="1.2"><path d="M6.6 1.8 V4.6"/><path d="M13.4 1.8 V4.6"/></g><path class="ink" stroke-width="1" opacity="0.5" d="M4 7.6 H16"/><g transform="rotate(24 16 18)"><path class="ink-fill" d="M11.6 14.4 H20.4 V21.6 L18.2 20.2 L16 21.8 L13.8 20.2 L11.6 21.6 Z"/><path fill="none" stroke="currentColor" stroke-width="0.9" opacity="0.5" d="M13.2 17.6 H18.8"/></g><g class="ink" fill="none" stroke-width="1" opacity="0.4" stroke-linecap="round"><path d="M2.4 16.6 C4.2 17.6 5.4 18.8 6.2 20.4"/></g></svg>`,
  // seven, on the seventh: the one square off the calendar with the seven marks it took
  sevenseven:`<svg viewBox="0 0 24 24"><rect class="ink-fill" x="3" y="4.6" width="18" height="16.8" rx="1.4"/><g class="ink" stroke-width="1.2"><path d="M7.6 2 V5.6"/><path d="M16.4 2 V5.6"/></g><path class="ink" stroke-width="1.05" d="M3.2 9 H20.8"/><g class="ink" stroke-width="1.3" stroke-linecap="round"><path d="M6.2 11.8 V16.2"/><path d="M8.2 11.8 V16.2"/><path d="M10.2 11.8 V16.2"/><path d="M12.2 11.8 V16.2"/><path d="M5.4 16.6 L13 11.4"/><path d="M15.4 11.8 V16.2"/><path d="M17.4 11.8 V16.2"/></g><path class="ink" stroke-width="1" opacity="0.45" d="M6.4 18.8 H17.6"/></svg>`,
  // a whole game between three and four in the morning: the lamp still on over the page and
  // the sky it is on against
  nightlamp:`<svg viewBox="0 0 24 24"><path class="ink-fill" d="M3.4 8.6 L9.4 2.8 L13.4 7.4 L6.6 11.8 Z"/><path class="ink" stroke-width="1.5" fill="none" d="M8.2 10.6 C9.4 14.4 8.6 17.6 6.6 20.4"/><path class="ink" stroke-width="1.4" d="M2.8 20.8 H10.4"/><g class="ink" fill="none" stroke-width="0.95" opacity="0.32" stroke-linecap="round"><path d="M6.2 12.6 L3.2 19.4"/><path d="M12.2 11.6 L15.2 18.4"/></g><path class="ink-fill" d="M21.6 8.6 A4.6 4.6 0 1 1 17.4 3.6 A3.6 3.6 0 0 0 21.6 8.6 Z"/><g fill="currentColor" stroke="none" opacity="0.65"><circle cx="15" cy="2.6" r="0.55"/><circle cx="21.6" cy="12.8" r="0.45"/></g><path class="ink" stroke-width="1" opacity="0.45" d="M12.6 20.8 H21.8"/></svg>`,
  // thirteen minutes past one on the thirteenth, which is the day folding over on itself:
  // the dial with the crease straight through it
  wrinkletime:`<svg viewBox="0 0 24 24"><circle class="ink-fill" cx="12" cy="12" r="8.8"/><path class="ink" stroke-width="1.6" d="M12 12 V6.2"/><path class="ink" stroke-width="1.4" d="M12 12 L16.4 14.4"/><circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none"/><path class="ink" stroke-width="1.15" opacity="0.7" fill="none" d="M4.6 6.8 C8.6 9.2 10.4 13.4 9.6 19.8"/><path class="ink" stroke-width="1" opacity="0.4" fill="none" d="M6.6 5.2 C10.4 8.6 12 13 11.4 20.6"/><g class="ink" stroke-width="1" opacity="0.5"><path d="M12 3.2 V4.8"/><path d="M20.8 12 H19.2"/></g></svg>`,
  // played on the thirteenth of December, and the one candle is the point: the day is hers,
  // so the charm keeps to a slice rather than turning into a party
  cakeslice:`<svg viewBox="0 0 24 24"><path class="ink-fill" d="M12 1.6 C13 3 13.4 3.7 13.4 4.3 A1.4 1.4 0 0 1 10.6 4.3 C10.6 3.7 11 3 12 1.6 Z"/><path class="ink" stroke-width="1.4" d="M12 5.6 V8.8"/><path class="ink-fill" d="M3.4 9.2 H20.6 V12.8 H3.4 Z"/><path class="ink-fill" d="M3.4 12.8 H20.6 V19.4 a1.2 1.2 0 0 1 -1.2 1.2 H4.6 a1.2 1.2 0 0 1 -1.2 -1.2 Z"/><path class="ink" fill="none" stroke-width="1.05" opacity="0.5" d="M3.6 16 C6 14.4 8.4 17.4 10.8 15.8 C13.2 14.2 15.6 17.4 18 15.8 C19.2 15 20 15.4 20.4 16"/><g fill="currentColor" stroke="none" opacity="0.65"><circle cx="7" cy="11" r="0.5"/><circle cx="12" cy="11" r="0.5"/><circle cx="17" cy="11" r="0.5"/></g></svg>`,

  /* ---- The Core batch: the odds and ends ---- */
  // thirteen taps on the one drawing you are allowed to touch: the scarf hung up, with the
  // touch still going out of it in rings
  scarftap:`<svg viewBox="0 0 24 24"><g opacity="0.9"><path class="ink" fill="none" stroke-width="1.35" d="M2.6 3.4 C5.6 6.2 9.2 6.2 12.2 3.4"/><path class="ink-fill" d="M6.4 5.4 L5.4 11.6 H8 L9 5.7 Z"/><g class="ink" stroke-width="0.95"><path d="M5.6 11.6 V13.6"/><path d="M6.6 11.6 V14"/><path d="M7.6 11.6 V13.5"/></g></g><path class="ink-fill" d="M13.4 21.6 C11.4 20.2 10.6 18.4 11 16.8 C11.3 15.6 12.4 15.4 13 16.2 L13.8 17.4 V11 A1.15 1.15 0 0 1 16.1 11 V14.8 A1.05 1.05 0 0 1 18.2 14.8 V15.4 A1.05 1.05 0 0 1 20.3 15.4 V16.2 A1.05 1.05 0 0 1 22.4 16.2 V18.2 C22.4 20.2 21.2 21.6 19.6 21.6 Z"/><g class="ink" stroke-width="1.05" opacity="0.5" fill="none"><path d="M11.6 8.6 C10.4 9.6 10.2 11 10.6 12.2"/><path d="M14.4 7.6 C12.8 8.8 12.4 10.6 12.8 12.2"/></g></svg>`,
  // the right answer typed out and never sent: the words sat in the bubble, and what was
  // left of the round going out from under it
  unsentword:`<svg viewBox="0 0 24 24"><path class="ink-fill" d="M3.2 4.4 H20.6 a1.4 1.4 0 0 1 1.4 1.4 V13.6 a1.4 1.4 0 0 1 -1.4 1.4 H10.4 L6.2 18.6 V15 H3.2 A1.4 1.4 0 0 1 1.8 13.6 V5.8 A1.4 1.4 0 0 1 3.2 4.4 Z"/><g fill="none" stroke="currentColor" stroke-width="1.15" opacity="0.85" stroke-linecap="round"><path d="M5 8.2 C6.2 7 7 8.9 8.2 7.9 C9.2 7.1 10 8.6 11.2 7.9 C12.4 7.2 13.6 8.7 14.8 8"/><path d="M5 11.6 C6.2 10.4 7 12.3 8.2 11.3 C9.2 10.5 10.4 12 11.6 11.3"/></g><g fill="currentColor" stroke="none" opacity="0.45"><circle cx="8.4" cy="20.4" r="0.75"/><circle cx="11.4" cy="21.4" r="0.6"/><circle cx="14.2" cy="20.8" r="0.5"/></g></svg>`,
  // nothing written until the clock was nearly out, and then all of it at once: the line
  // flat the whole way across and the hand let go right at the end of it
  heldbreath:`<svg viewBox="0 0 24 24"><path class="ink" stroke-width="2" fill="none" stroke-linecap="round" d="M1.4 14.6 H12.4"/><path class="ink" stroke-width="2" fill="none" stroke-linecap="round" d="M12.4 14.6 C13.4 8.4 14.6 15.2 15.8 11 C16.8 7.6 18 15.6 19.2 12.2 C20 9.8 21.2 13.8 22.6 11.2"/><path class="ink" stroke-width="1" opacity="0.35" fill="none" stroke-linecap="round" d="M1.4 20.6 H22.6"/><path class="ink" stroke-width="1.05" opacity="0.45" stroke-dasharray="1.4 1.8" d="M12.4 5.4 V13.4"/></svg>`,
  // the top of the list taken every time it was offered: the suggestions down, the first row
  // inked, and the pointer already on it
  topofthelist:`<svg viewBox="0 0 24 24"><rect class="ink" fill="none" x="2.6" y="2.4" width="18.8" height="4.4" rx="1"/><path class="ink" stroke-width="1.2" opacity="0.6" d="M5 4.6 H10"/><rect class="ink" fill="none" x="2.6" y="8" width="18.8" height="13.4" rx="1"/><rect class="ink-fill" x="3.6" y="9" width="16.8" height="3.6" rx="0.6"/><g fill="none" stroke="currentColor" stroke-width="1.05" opacity="0.45"><path d="M5 15.2 H16"/><path d="M5 18.4 H13.4"/></g><path class="ink-fill" d="M14.8 10.2 L20 14 L17.4 14.4 L18.4 16.9 L16.9 17.5 L15.9 15 L14.2 16.5 Z"/></svg>`,
  // thirteen out of thirteen and every one of them off the same record: the sleeve with the
  // whole game tallied onto it
  onesleeve:`<svg viewBox="0 0 24 24"><rect class="ink-fill" x="2.6" y="2.6" width="18.8" height="18.8" rx="1.2"/><circle cx="12" cy="8" r="3.2" fill="var(--paper)" stroke="currentColor" stroke-width="1.05"/><circle cx="12" cy="8" r="0.6" fill="currentColor" stroke="none"/><g class="ink" stroke-width="1.2" stroke-linecap="round"><path d="M5.4 13.6 V16.2"/><path d="M7.1 13.6 V16.2"/><path d="M8.8 13.6 V16.2"/><path d="M10.5 13.6 V16.2"/><path d="M4.8 16.4 L11.1 13.4"/><path d="M13.8 13.6 V16.2"/><path d="M15.5 13.6 V16.2"/><path d="M17.2 13.6 V16.2"/><path d="M5.4 17.8 V20.4"/><path d="M7.1 17.8 V20.4"/><path d="M8.8 17.8 V20.4"/><path d="M10.5 17.8 V20.4"/><path d="M4.8 20.6 L11.1 17.6"/></g></svg>`,
  // every hint in the round burnt and the page missed anyway: three matches spent to the
  // head, and the word struck out under them all the same
  hintsburnt:`<svg viewBox="0 0 24 24"><g transform="rotate(-10 5 9.4)"><rect class="ink-fill" x="3.9" y="6" width="2.2" height="8.2" rx="0.9"/><path d="M5 3.2 C6.9 4.4 7.2 5.5 6.7 6.4 C6.1 7.5 3.9 7.5 3.3 6.4 C2.8 5.5 3.1 4.4 5 3.2 Z" fill="currentColor" stroke="none"/></g><g transform="rotate(2 12 9.4)"><rect class="ink-fill" x="10.9" y="6" width="2.2" height="8.2" rx="0.9"/><path d="M12 3.2 C13.9 4.4 14.2 5.5 13.7 6.4 C13.1 7.5 10.9 7.5 10.3 6.4 C9.8 5.5 10.1 4.4 12 3.2 Z" fill="currentColor" stroke="none"/></g><g transform="rotate(12 19 9.4)"><rect class="ink-fill" x="17.9" y="6" width="2.2" height="8.2" rx="0.9"/><path d="M19 3.2 C20.9 4.4 21.2 5.5 20.7 6.4 C20.1 7.5 17.9 7.5 17.3 6.4 C16.8 5.5 17.1 4.4 19 3.2 Z" fill="currentColor" stroke="none"/></g><path class="ink" fill="none" stroke-width="0.95" opacity="0.3" stroke-linecap="round" d="M14.4 3.4 C16 2.8 14.8 1.8 16 1"/><path class="ink" stroke-width="1.5" opacity="0.75" fill="none" stroke-linecap="round" d="M5.6 18.8 C7 17.4 7.8 19.4 9.2 18.2 C10.4 17.2 11.6 19 13 17.8 C14.2 16.8 15.6 18.4 17 17.4"/><path class="ink" stroke-width="1.7" stroke-linecap="round" d="M4 20.4 L20 16.4"/></svg>`,
  // an answer sent in capitals: the letters all stood to the same height between the rules,
  // which is the only thing on a written line that shouting looks like
  shoutcaps:`<svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.05" opacity="0.4" stroke-linecap="round"><path d="M2.6 17.6 H21.4"/><path d="M2.6 6.4 H21.4"/></g><g class="ink-fill"><path d="M4 17.4 L6.2 6.6 L8.4 17.4 Z"/><rect x="10.2" y="6.6" width="4.8" height="10.8" rx="1.6"/><path d="M17 6.6 H20.8 V17.4 H17 Z"/></g><rect x="11.5" y="9.4" width="2.2" height="5.2" rx="1.1" fill="var(--paper)" stroke="none"/><g class="ink" stroke-width="1.2" opacity="0.7" stroke-linecap="round"><path d="M12.6 3.8 V1.8"/><path d="M8.8 4.4 L7.8 2.6"/><path d="M16.4 4.4 L17.4 2.6"/></g></svg>`,
  // the prompt word handed straight back as the answer: the word off the top of the page
  // walked down into the box it came out of
  caughtout:`<svg viewBox="0 0 24 24"><rect class="ink" fill="none" x="5.4" y="1.8" width="15.2" height="5" rx="1"/><path class="ink" fill="none" stroke-width="1.45" stroke-linecap="round" d="M8.2 4.6 C9.2 3.4 10 5.2 11 4.2 C11.8 3.4 12.8 5 13.8 4.2 C14.8 3.4 16 4.8 17.2 4.2"/><path class="ink" fill="none" stroke-width="1.3" d="M4.8 7.6 C1.8 10.2 2 14 4.4 15.8"/><path class="ink-fill" d="M6 14.2 L5.2 17.4 L2.6 15.2 Z"/><rect class="ink" fill="none" x="5.4" y="17" width="15.2" height="5" rx="1"/><path class="ink" fill="none" stroke-width="1.45" stroke-linecap="round" d="M8.2 19.8 C9.2 18.6 10 20.4 11 19.4 C11.8 18.6 12.8 20.2 13.8 19.4 C14.8 18.6 16 20 17.2 19.4"/></svg>`,
  // a charm from every theme on the board: the bracelet with one of each hung off it, which
  // is the only charm here whose subject is the collection itself
  fullbracelet:`<svg viewBox="0 0 24 24"><path class="ink" stroke-width="1.4" fill="none" d="M1.4 6.8 C6.4 3.8 17.6 3.8 22.6 6.8"/><g class="ink-fill"><circle cx="4.4" cy="5.8" r="1.15"/><circle cx="8.8" cy="4.6" r="1.15"/><circle cx="12" cy="4.3" r="1.15"/><circle cx="15.2" cy="4.6" r="1.15"/><circle cx="19.6" cy="5.8" r="1.15"/></g><g class="ink" stroke-width="1" opacity="0.6"><path d="M6.4 7 V9.2"/><path d="M12 6.9 V9.6"/><path d="M17.6 7 V9.4"/></g><path class="ink-fill" stroke-width="1.1" d="M6.4 9.2 L7.5 11.6 L10.1 11.9 L8.2 13.7 L8.7 16.3 L6.4 15 L4.1 16.3 L4.6 13.7 L2.7 11.9 L5.3 11.6 Z"/><path class="ink-fill" d="M12 9.6 C13.6 11 14.4 12.3 14.4 13.5 A2.4 2.4 0 0 1 9.6 13.5 C9.6 12.3 10.4 11 12 9.6 Z"/><path class="ink-fill" d="M17.6 9.4 L20 12.8 L17.6 16.2 L15.2 12.8 Z"/></svg>`,
  // a word carried over from the searcher and played: the word lifted out of the glass and
  // set down on the line, with the way it came still faintly there
  lenstoline:`<svg viewBox="0 0 24 24"><circle class="ink-fill" cx="10.4" cy="7.4" r="6.2"/><path class="ink" fill="none" stroke-width="1.45" stroke-linecap="round" d="M7.4 7 C8.4 5.8 9.2 7.6 10.2 6.6 C11 5.8 12 7.4 13.2 6.6"/><path class="ink" stroke-width="2.2" stroke-linecap="round" d="M6 11.8 L2.8 15"/><path class="ink" fill="none" stroke-width="1.05" opacity="0.45" stroke-dasharray="0.1 1.9" stroke-linecap="round" d="M15.6 11 C17.8 13.2 18.6 15.4 18.6 17.6"/><path class="ink" stroke-width="1.05" opacity="0.4" stroke-linecap="round" d="M8.6 21.2 H22.4"/><path class="ink" fill="none" stroke-width="1.55" stroke-linecap="round" d="M13.4 20 C14.4 18.8 15.2 20.6 16.2 19.6 C17 18.8 18 20.4 19 19.6 C19.8 19 20.6 19.8 21.2 20.2"/></svg>`,
  // every margin mark found and poked: a manicule, the pointing hand a reader has inked into
  // the margin beside a line worth noting since long before this notebook. It is the one
  // drawing that is BOTH a margin mark and the act of touching one, which is why the hand is
  // the whole charm and the mark it pokes is nowhere in frame: a second doodle out at the
  // fingertip only shrank the hand until it read as a stick.
  // The two ticks off the tip are the poke landing; without them the hand merely points.
  manicule:`<svg viewBox="0 0 24 24"><path class="ink-fill" d="M5 8.9 L13.2 8.7 C12.8 7 13.8 5.8 15.3 6.1 C16.8 6.4 17.3 7.8 16.4 9.1 L19 8.7 L21.3 8.3 L21.7 17.6 L19.1 17.4 C15.6 18.9 12.4 17.8 12.2 15.2 C12.1 13.9 12.7 13.2 13.5 13 C12.4 12.7 11.9 11.9 12.2 10.9 L5 11.9 A1.5 1.5 0 0 1 5 8.9 Z"/><g class="ink"><path d="M19 8.9 L18.9 17.4"/><path d="M13.2 13.1 C14.6 12.9 15.7 13.1 16.5 13.6"/><path d="M13.1 15.8 C14.3 15.6 15.4 15.7 16.2 16.1"/></g><g class="ink"><path d="M2.6 5.9 L3.5 7.3"/><path d="M6.4 4.8 L6.2 6.4"/></g></svg>`,

  /* ---- The Core batch's own marks (2026-08-15) ----
     Ten charms shipped on the dashed-question-mark placeholder while their art was pending.
     Core is about breadth across the shelf and about the collection talking about itself, so
     the marks split the same way: four objects that mean "everywhere" (the signpost, the case,
     the day sheet, the dice), and six that are the bracelet looking at itself.
     Detail inside a solid shape is drawn in currentColor rather than knocked out in --paper,
     because .charm renders `ink-fill` as outline only and a paper knockout would vanish. */

  // a five-armed fingerpost, one arm per game type — five ways off the same corner
  signpost:`<svg viewBox="0 0 24 24"><path class="ink" stroke-width="1.4" d="M5 21.4 H19"/><rect class="ink-fill" x="11.2" y="1.8" width="1.6" height="19.6" rx="0.6"/><g class="ink" fill="none" stroke-width="1.2"><path d="M11.4 2.6 H6.1 L4.1 4.1 L6.1 5.6 H11.4"/><path d="M12.6 6.5 H18.6 L20.6 8 L18.6 9.5 H12.6"/><path d="M11.4 10.4 H5 L3 11.9 L5 13.4 H11.4"/><path d="M12.6 14.3 H19.2 L21.2 15.8 L19.2 17.3 H12.6"/><path d="M11.4 18.2 H6.7 L4.7 19.7 L6.7 21.2 H11.4"/></g></svg>`,
  // the case, packed and stickered — every corner of the shelf, visited
  suitcase:`<svg viewBox="0 0 24 24"><path class="ink" fill="none" stroke-width="1.4" d="M9.4 7.4 V6 A2.6 2.6 0 0 1 14.6 6 V7.4"/><rect class="ink-fill" x="2.6" y="7.4" width="18.8" height="13.2" rx="1.8"/><g class="ink" stroke-width="1.15"><path d="M6.6 7.6 V20.4"/><path d="M8.3 7.6 V20.4"/></g><g fill="currentColor" stroke="none"><rect x="6.2" y="12.6" width="2.5" height="1.6" rx="0.6"/><path d="M13.4 10.6 L14.2 12.25 L16 12.5 L14.7 13.8 L15 15.6 L13.4 14.75 L11.8 15.6 L12.1 13.8 L10.8 12.5 L12.6 12.25 Z"/><circle cx="18.6" cy="11.4" r="1.35"/><rect x="16.8" y="16.2" width="3.6" height="2.4" rx="0.5"/></g></svg>`,
  // one day torn off the block, three different marks stamped on it before it came off
  daysheet:`<svg viewBox="0 0 24 24"><g class="ink-fill"><rect x="7.5" y="1.4" width="1.8" height="4" rx="0.9"/><rect x="14.7" y="1.4" width="1.8" height="4" rx="0.9"/></g><path class="ink-fill" d="M3.8 5.2 H20.2 V18.8 L17.4 21.6 L14.6 19.2 L12 21.6 L9.4 19.2 L6.6 21.6 L3.8 18.8 Z"/><path class="ink" stroke-width="1.1" d="M4 8.6 H20"/><g fill="currentColor" stroke="none"><path d="M7.5 11.4 L8.2 12.9 L9.85 13.15 L8.65 14.3 L8.95 15.9 L7.5 15.15 L6.05 15.9 L6.35 14.3 L5.15 13.15 L6.8 12.9 Z"/><path d="M12 16.1 C12 16.1 10.1 14.7 10.1 13.4 C10.1 12.7 10.65 12.25 11.2 12.25 C11.55 12.25 11.83 12.43 12 12.75 C12.17 12.43 12.45 12.25 12.8 12.25 C13.35 12.25 13.9 12.7 13.9 13.4 C13.9 14.7 12 16.1 12 16.1 Z"/><path d="M16.5 11.7 L18.4 14.2 L16.5 16.7 L14.6 14.2 Z"/></g></svg>`,
  // one die still in the air, the throw drawn in behind it — the first pick you did not make
  diecast:`<svg viewBox="0 0 24 24"><path class="ink" fill="none" stroke-width="1.1" opacity="0.4" stroke-linecap="round" stroke-dasharray="0.1 2" d="M2.4 13.2 C1.8 6.8 6.2 2.4 12.6 2.8"/><g transform="rotate(-13 13.4 13.6)"><g class="ink-fill"><path d="M9.9 8.2 C9 6.4 8.6 5 8.5 3.5 C9.6 4.8 10.7 6.3 11.5 7.9 Z"/><path d="M17 8.2 C17.9 6.4 18.3 5 18.4 3.5 C17.3 4.8 16.2 6.3 15.4 7.9 Z"/></g><rect class="ink-fill" x="7.4" y="7.6" width="12" height="12" rx="2.4"/><g fill="currentColor" stroke="none"><circle cx="10.4" cy="10.6" r="1.15"/><circle cx="16.4" cy="10.6" r="1.15"/><circle cx="13.4" cy="13.6" r="1.15"/><circle cx="10.4" cy="16.6" r="1.15"/><circle cx="16.4" cy="16.6" r="1.15"/></g></g><g class="ink" stroke-width="1.15" opacity="0.5"><path d="M1.4 16.8 H3.4"/><path d="M2.4 19.6 H4.6"/></g></svg>`,
  // two dice landed on double six and a halo tilting over them — twelve, one short of thirteen,
  // which is exactly the number the angels are rolling their eyes at
  dicehalo:`<svg viewBox="0 0 24 24"><ellipse class="ink" fill="none" cx="12" cy="3.5" rx="3.4" ry="1.15" transform="rotate(-12 12 3.5)"/><g class="ink-fill"><path d="M7.5 10.2 C6.2 7.2 4.4 5.2 1.6 4 C2.2 5.6 2.8 6.4 3.6 6.9 C3 7.6 3.4 8.2 4.4 8.6 C4 9.3 4.6 9.8 5.8 10 Z"/><path d="M16.5 10.2 C17.8 7.2 19.6 5.2 22.4 4 C21.8 5.6 21.2 6.4 20.4 6.9 C21 7.6 20.6 8.2 19.6 8.6 C20 9.3 19.4 9.8 18.2 10 Z"/></g><g transform="rotate(-8 7.1 15.7)"><rect class="ink-fill" x="2.7" y="11.2" width="8.8" height="9" rx="1.9"/><g fill="currentColor" stroke="none"><circle cx="5.05" cy="13.45" r="0.78"/><circle cx="5.05" cy="15.7" r="0.78"/><circle cx="5.05" cy="17.95" r="0.78"/><circle cx="9.15" cy="13.45" r="0.78"/><circle cx="9.15" cy="15.7" r="0.78"/><circle cx="9.15" cy="17.95" r="0.78"/></g></g><g transform="rotate(8 16.9 14.9)"><rect class="ink-fill" x="12.5" y="10.4" width="8.8" height="9" rx="1.9"/><g fill="currentColor" stroke="none"><circle cx="14.85" cy="12.65" r="0.78"/><circle cx="14.85" cy="14.9" r="0.78"/><circle cx="14.85" cy="17.15" r="0.78"/><circle cx="18.95" cy="12.65" r="0.78"/><circle cx="18.95" cy="14.9" r="0.78"/><circle cx="18.95" cy="17.15" r="0.78"/></g></g></svg>`,
  // a ring with the stones set right round the band — forty of them and still shining
  jewelring:`<svg viewBox="0 0 24 24"><circle class="ink" fill="none" stroke-width="1.5" cx="12" cy="15.8" r="5.4"/><g class="ink" stroke-width="1.1"><path d="M9.4 11.2 L10.6 9.6"/><path d="M14.6 11.2 L13.4 9.6"/></g><path class="ink-fill" d="M10.1 4.4 H13.9 L15.6 7.6 L12 10.6 L8.4 7.6 Z"/><g class="ink" stroke-width="0.8" opacity="0.65"><path d="M8.4 7.6 H15.6"/><path d="M10.1 4.4 L9.35 7.6 L12 10.6"/><path d="M13.9 4.4 L14.65 7.6 L12 10.6"/></g><path class="ink-fill" d="M19.6 3.2 L20.25 4.65 L21.7 5.3 L20.25 5.95 L19.6 7.4 L18.95 5.95 L17.5 5.3 L18.95 4.65 Z"/></svg>`,
  // the wire strung across the desk with the bulbs hung off it — eighty lit, and counting
  fairylights:`<svg viewBox="0 0 24 24"><path class="ink" fill="none" stroke-width="1.25" d="M0.8 4.4 C5.4 10.6 18.6 10.6 23.2 4.4"/><path class="ink" stroke-width="1" d="M3.39 6.77 V8.27"/><rect class="ink-fill" x="2.54" y="8.27" width="1.7" height="1.3" rx="0.35"/><path class="ink-fill" d="M2.64 9.47 C0.49 10.47, 0.69 14.47, 3.39 14.47 C6.09 14.47, 6.29 10.47, 4.14 9.47 Z"/><path class="ink" stroke-width="1" d="M8.83 8.78 V11.18"/><rect class="ink-fill" x="7.98" y="11.18" width="1.7" height="1.3" rx="0.35"/><path class="ink-fill" d="M8.08 12.38 C5.93 13.38, 6.13 17.38, 8.83 17.38 C11.53 17.38, 11.73 13.38, 9.58 12.38 Z"/><path class="ink" stroke-width="1" d="M15.17 8.78 V9.68"/><rect class="ink-fill" x="14.32" y="9.68" width="1.7" height="1.3" rx="0.35"/><path class="ink-fill" d="M14.42 10.88 C12.27 11.88, 12.47 15.88, 15.17 15.88 C17.87 15.88, 18.07 11.88, 15.92 10.88 Z"/><path class="ink" stroke-width="1" d="M20.61 6.77 V8.57"/><rect class="ink-fill" x="19.76" y="8.57" width="1.7" height="1.3" rx="0.35"/><path class="ink-fill" d="M19.86 9.77 C17.71 10.77, 17.91 14.77, 20.61 14.77 C23.31 14.77, 23.51 10.77, 21.36 9.77 Z"/><g class="ink" stroke-width="0.9" opacity="0.4"><path d="M1.2 12.6 L2.3 12.9"/><path d="M6.4 17.2 L7.4 16.4"/><path d="M17.6 17.6 L16.6 16.8"/><path d="M22.6 12.6 L21.5 12.9"/></g></svg>`,
  // the spool the thread came off, with the tail knotted where it ran out — one length of
  // gold that did a whole theme, which an arc of beads cannot say without reading as the
  // bracelet marks it sits beside
  goldspool:`<svg viewBox="0 0 24 24"><g class="ink-fill"><rect x="5.8" y="4.4" width="12.4" height="2.3" rx="0.8"/><rect x="5.8" y="17.3" width="12.4" height="2.3" rx="0.8"/><rect x="7.6" y="6.7" width="8.8" height="10.6" rx="0.5"/></g><g class="ink" fill="none" stroke-width="0.85" opacity="0.55"><path d="M7.8 9.0 C10 8.4 14 9.6 16.2 9.0"/><path d="M7.8 11.2 C10 10.6 14 11.8 16.2 11.2"/><path d="M7.8 13.4 C10 12.8 14 14.0 16.2 13.4"/><path d="M7.8 15.6 C10 15.0 14 16.2 16.2 15.6"/></g><path class="ink" fill="none" stroke-width="1.25" d="M16.4 12 C19.6 12.2 21.4 14.4 20.6 16.8 C20.1 18.3 19.4 18.8 19.4 19.6"/><circle class="ink-fill" cx="19.4" cy="20.6" r="1.15"/></svg>`,
  // three stones stacked and left standing — one per theme, gathered
  cairn:`<svg viewBox="0 0 24 24"><path class="ink-fill" d="M4 20.6 L5 18.2 L10.2 17.4 L18.6 18.1 L20 20 L18.2 21.5 L5.6 21.4 Z"/><path class="ink-fill" d="M6.2 15.6 L6.8 12.9 L11 12.1 L16.4 12.8 L17.4 14.8 L15.8 16.1 Z"/><path class="ink-fill" d="M8.8 10.6 L9.4 8 L12.2 7.1 L15 7.9 L15.6 9.7 L14.3 10.9 Z"/><circle class="ink-fill" cx="21" cy="20.4" r="1.05"/></svg>`,
  // three charms coming down onto the same page at once, the drop still showing above them
  threecharms:`<svg viewBox="0 0 24 24"><path class="ink" stroke-width="1.5" d="M2.6 21 H21.4"/><g class="ink" stroke-width="1" opacity="0.42"><path d="M3.4 6.2 L4.7 8"/><path d="M9.2 7.6 L10.5 9.4"/><path d="M15 6.6 L16.3 8.4"/></g><path class="ink-fill" d="M6.2 9.9 L7.3 12.2 L9.8 12.55 L8 14.3 L8.42 16.75 L6.2 15.6 L3.98 16.75 L4.4 14.3 L2.6 12.55 L5.1 12.2 Z"/><path class="ink-fill" d="M12 18.6 C12 18.6 9 16.4 9 14.5 C9 13.4 9.85 12.7 10.75 12.7 C11.3 12.7 11.75 13 12 13.45 C12.25 13 12.7 12.7 13.25 12.7 C14.15 12.7 15 13.4 15 14.5 C15 16.4 12 18.6 12 18.6 Z"/><path class="ink-fill" d="M17.8 10.4 L20.4 13.6 L17.8 16.8 L15.2 13.6 Z"/></svg>`,

  /* ---- The Catalogue batch's own marks (2026-08-18) ----
     Twenty-three charms shipped on the dashed question mark: the twenty-two catalogue-knowledge
     ones plus It's Me, Hi. They are priced in facts about the records rather than in play, so
     the marks are drawn the same way, in three families that match the three shapes of the feat:

       - the page itself, where the mark is the notebook line the answer came off (the circled
         opening and closing words, the word written out over and over, the two measured titles);
       - the object that proves the fact (the tracklist with a heart on the fifth row, the vault
         door, the wreath, the parenthesis holding a note);
       - the joke, drawn straight, for the eggs and the named pairs, since a charm that winked
         at its own answer would print it on the box.

     Same rule as the Core batch: detail inside a shape is drawn in currentColor, because .charm
     renders `ink-fill` as outline only and a --paper knockout has nothing to knock out. Paper
     fills appear only where one shape has to sit in front of another. */

  // the badge written on where names were never wanted, and struck through for it
  hellotag:`<svg viewBox="0 0 24 24"><rect class="ink-fill" x="2.6" y="4.6" width="18.8" height="14.8" rx="1.6"/><path class="ink" stroke-width="1.05" d="M2.8 9.6 H21.2"/><path class="ink" stroke-width="0.95" opacity="0.7" fill="none" d="M5.6 7.6 C6.5 6.5 7.2 8.1 8.1 7 C9 5.9 9.7 7.5 10.6 6.6"/><path class="ink" stroke-width="1.05" d="M5.6 16.8 H18.4"/><path class="ink" stroke-width="1.25" fill="none" d="M7 15.2 C8.2 12.9 9.4 16.1 10.6 13.8 C11.8 11.5 13 14.7 14.2 12.9"/><path class="ink" stroke-width="2.2" d="M4.4 19.8 L19.6 4.2"/></svg>`,
  // Written out as what it is: the word on the page, an equals sign, and the record. Drawing it
  // inside a record label only ever produced another disc with a smudge on it, and this charm
  // is not about the record, it is about the two being the same thing.
  equals:`<svg viewBox="0 0 24 24"><rect class="ink-fill" x="5.6" y="1.6" width="12.8" height="7.2" rx="1.1"/><path class="ink" stroke-width="1.25" fill="none" d="M8 5.6 C9 4.2 10 6 11 4.7 C12 3.4 13 5.2 14.1 4.3"/><path class="ink" stroke-width="0.95" opacity="0.4" d="M8 7.2 H16"/><g class="ink" stroke-width="2.2" stroke-linecap="round"><path d="M9.4 11.2 H14.6"/><path d="M9.4 14.2 H14.6"/></g><circle class="ink-fill" cx="12" cy="18.6" r="4.2"/><circle class="ink" fill="none" stroke-width="1" cx="12" cy="18.6" r="1.75"/><circle cx="12" cy="18.6" r="0.55" fill="currentColor" stroke="none"/></svg>`,
  // five words on the page, five records that answered them by name
  fivewords:`<svg viewBox="0 0 24 24"><g class="ink" stroke-width="1.25"><path d="M2.6 4.6 H13.4"/><path d="M2.6 8.3 H12.2"/><path d="M2.6 12 H13.8"/><path d="M2.6 15.7 H12.6"/><path d="M2.6 19.4 H13"/></g><g class="ink-fill"><circle cx="18.4" cy="4.6" r="2.1"/><circle cx="18.4" cy="8.3" r="2.1"/><circle cx="18.4" cy="12" r="2.1"/><circle cx="18.4" cy="15.7" r="2.1"/><circle cx="18.4" cy="19.4" r="2.1"/></g><g fill="currentColor" stroke="none"><circle cx="18.4" cy="4.6" r="0.5"/><circle cx="18.4" cy="8.3" r="0.5"/><circle cx="18.4" cy="12" r="0.5"/><circle cx="18.4" cy="15.7" r="0.5"/><circle cx="18.4" cy="19.4" r="0.5"/></g></svg>`,
  // the bracket the other take always arrives in, with the song still inside it
  parens:`<svg viewBox="0 0 24 24"><g class="ink" stroke-width="1.9" fill="none"><path d="M6.6 3.4 C3.4 6.6 3.4 17.4 6.6 20.6"/><path d="M17.4 3.4 C20.6 6.6 20.6 17.4 17.4 20.6"/></g><ellipse class="ink-fill" cx="10.2" cy="16.2" rx="2.4" ry="1.85" transform="rotate(-18 10.2 16.2)"/><path class="ink" stroke-width="1.5" fill="none" d="M12.4 15.8 V6.6"/><path class="ink" stroke-width="1.4" fill="none" d="M12.4 6.8 C14.5 7.3 15.7 8.8 15.5 10.8"/></svg>`,
  // the back of the sleeve, the fifth row wearing the heart it always gets
  trackfive:`<svg viewBox="0 0 24 24"><rect class="ink-fill" x="3.2" y="2.6" width="17.6" height="18.8" rx="1.5"/><g fill="currentColor" stroke="none"><circle cx="6.4" cy="6.2" r="0.6"/><circle cx="6.4" cy="9.2" r="0.6"/><circle cx="6.4" cy="12.2" r="0.6"/><circle cx="6.4" cy="15.2" r="0.6"/></g><g class="ink" stroke-width="1" opacity="0.65"><path d="M8.8 6.2 H17.8"/><path d="M8.8 9.2 H17"/><path d="M8.8 12.2 H17.6"/><path d="M8.8 15.2 H16.6"/></g><path d="M6.4 19.9 C6.4 19.9 4.5 18.5 4.5 17.3 C4.5 16.6 5.05 16.15 5.65 16.15 C6 16.15 6.25 16.32 6.4 16.6 C6.55 16.32 6.8 16.15 7.15 16.15 C7.75 16.15 8.3 16.6 8.3 17.3 C8.3 18.5 6.4 19.9 6.4 19.9 Z" fill="currentColor" stroke="none"/><path class="ink" stroke-width="1.6" d="M9.8 18.2 H18"/></svg>`,
  // The ribbon left in at the page you landed on, with the number written down it. A numeral in
  // a ring is a badge rather than a charm, and thirteen is the one number in this notebook
  // that wants to be an object you could pick up.
  bookmark:`<svg viewBox="0 0 24 24"><path class="ink-fill" d="M6.4 1.8 H17.6 V22 L12 17.4 L6.4 22 Z"/><path class="ink" stroke-width="0.85" opacity="0.4" fill="none" d="M8.2 2.4 V18.6"/><path class="ink" stroke-width="0.85" opacity="0.4" fill="none" d="M15.8 2.4 V18.6"/><path class="ink" stroke-width="1.9" fill="none" stroke-linecap="round" d="M9.1 7.4 L10.7 5.9 V14.6"/><path class="ink" stroke-width="1.8" fill="none" stroke-linecap="round" d="M12.9 6.7 C14.8 5.5 16.7 6.6 16.2 8.3 C15.9 9.4 15 9.9 14 10 C15.5 10 16.6 10.8 16.5 12.2 C16.4 14.1 14.3 14.9 12.8 13.8"/></svg>`,
  // the record in the wreath, under the star. Two discs in there was the truer sentence and the
  // worse drawing: side by side or offset, they read as a face in a pair of glasses at every size
  laurel:`<svg viewBox="0 0 24 24"><path class="ink-fill" d="M12 1.4 L12.8 3.35 L14.75 4.15 L12.8 4.95 L12 6.9 L11.2 4.95 L9.25 4.15 L11.2 3.35 Z"/><circle class="ink-fill" cx="12" cy="14" r="5.4"/><circle class="ink" fill="none" stroke-width="0.8" opacity="0.5" cx="12" cy="14" r="3.6"/><circle class="ink" fill="none" stroke-width="1.1" cx="12" cy="14" r="1.9"/><circle cx="12" cy="14" r="0.55" fill="currentColor" stroke="none"/><g class="ink" stroke-width="1.25" fill="none"><path d="M8.8 21.2 C4 19.4 2 14.6 3.4 9.4"/><path d="M15.2 21.2 C20 19.4 22 14.6 20.6 9.4"/></g><g class="ink-fill"><ellipse cx="3.6" cy="12.6" rx="1.9" ry="0.8" transform="rotate(-68 3.6 12.6)"/><ellipse cx="4.4" cy="17" rx="1.9" ry="0.8" transform="rotate(-42 4.4 17)"/><ellipse cx="7" cy="20.2" rx="1.9" ry="0.8" transform="rotate(-16 7 20.2)"/><ellipse cx="20.4" cy="12.6" rx="1.9" ry="0.8" transform="rotate(68 20.4 12.6)"/><ellipse cx="19.6" cy="17" rx="1.9" ry="0.8" transform="rotate(42 19.6 17)"/><ellipse cx="17" cy="20.2" rx="1.9" ry="0.8" transform="rotate(16 17 20.2)"/></g></svg>`,
  // the door with the wheel on it, shut, with everything that is in there still in there
  vault:`<svg viewBox="0 0 24 24"><rect class="ink-fill" x="3.2" y="3" width="17.6" height="18" rx="2"/><rect class="ink" fill="none" stroke-width="1" x="5.8" y="5.6" width="12.4" height="12.8" rx="1.3"/><circle class="ink" fill="none" stroke-width="1.35" cx="12" cy="12" r="3.4"/><g class="ink" stroke-width="1.15"><path d="M12 7.2 V16.8"/><path d="M7.2 12 H16.8"/></g><circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none"/><g class="ink" stroke-width="1.1" opacity="0.6"><path d="M3.4 6.6 H1.4"/><path d="M3.4 17.4 H1.4"/></g></svg>`,
  // the same word written out down the page, the way a song that will not let it go writes it
  sameagain: `<svg viewBox="0 0 24 24"><g class="ink" fill="none" stroke-width="1.8"><path d="M14.28 10.38 A8.4 8.4 0 0 1 14.67 19.4"/><path d="M16.9 8.55 A11.6 11.6 0 0 1 17.45 21"/></g><ellipse cx="7.4" cy="15.2" rx="2.8" ry="2.1" transform="rotate(-20 7.4 15.2)" fill="currentColor" stroke="none"/><path class="ink" stroke-width="2" stroke-linecap="round" d="M10.2 14.8 V6.4"/><path d="M10.2 6.4 C11.9 5.8 13 5 13.4 4 C14 6 12.5 7.7 10.2 8.5 Z" fill="currentColor" stroke="none"/></svg>`,
  // the word ringed on the top line, nothing written above it. Its pair is `lastline`
  firstline:`<svg viewBox="0 0 24 24"><rect class="ink-fill" x="3" y="2.8" width="18" height="18.4" rx="1.5"/><path class="ink" stroke-width="1.15" fill="none" d="M6.8 7.2 C7.7 5.9 8.5 7.5 9.4 6.3 C10.2 5.2 11 6.8 11.9 6.1"/><path class="ink" stroke-width="1.1" fill="none" d="M12.7 4.9 C10.2 3.8 6.3 4.2 5.5 6.2 C4.8 8 7.1 9.5 9.7 9.5 C12.3 9.5 14.3 8.4 13.9 6.5"/><g class="ink" stroke-width="1" opacity="0.32"><path d="M5.4 12.4 H18.6"/><path d="M5.4 15.6 H18.6"/><path d="M5.4 18.8 H15.4"/></g></svg>`,
  // the word ringed on the bottom line, with the full stop that closed the song after it
  lastline:`<svg viewBox="0 0 24 24"><rect class="ink-fill" x="3" y="2.8" width="18" height="18.4" rx="1.5"/><g class="ink" stroke-width="1" opacity="0.32"><path d="M5.4 6.2 H18.6"/><path d="M5.4 9.4 H18.6"/><path d="M5.4 12.6 H16.6"/></g><path class="ink" stroke-width="1.15" fill="none" d="M6.8 17.8 C7.7 16.5 8.5 18.1 9.4 16.9 C10.2 15.8 11 17.4 11.9 16.7"/><path class="ink" stroke-width="1.1" fill="none" d="M12.7 15.5 C10.2 14.4 6.3 14.8 5.5 16.8 C4.8 18.6 7.1 20.1 9.7 20.1 C12.3 20.1 14.3 19 13.9 17.1"/><circle cx="16.4" cy="19" r="0.85" fill="currentColor" stroke="none"/></svg>`,
  // two titles measured off against each other, the shortest in the catalogue and the longest
  shortlong: `<svg viewBox="0 0 24 24"><g class="ink" stroke-width="1.1" opacity="0.32" stroke-linecap="round"><path d="M3 11.6 H21"/><path d="M3 20.2 H21"/></g><rect x="4.2" y="5" width="6.6" height="4.8" rx="2.4" transform="rotate(-3 7.5 7.4)" fill="currentColor" stroke="none"/><rect x="4.2" y="13.6" width="16.6" height="4.8" rx="2.4" transform="rotate(2 12.5 16)" fill="currentColor" stroke="none"/></svg>`,
  // the marks the matcher throws away, written out anyway and given the whole charm
  punctuation:`<svg viewBox="0 0 24 24"><path class="ink" stroke-width="2.6" stroke-linecap="round" d="M12 4.6 V13.8"/><circle cx="12" cy="17.6" r="1.35" fill="currentColor" stroke="none"/><g class="ink" stroke-width="1.5" fill="none"><path d="M4.8 5 C6.2 5.6 6.4 7.2 5.2 8.4"/><path d="M7.8 5 C9.2 5.6 9.4 7.2 8.2 8.4"/></g><path class="ink" stroke-width="1.5" fill="none" d="M17.2 14.6 C18.6 15.2 18.8 17 17.4 18.2"/></svg>`,
  // the word that ended one answer, carried down to open the next
  wordchain: `<svg viewBox="0 0 24 24"><rect class="ink-fill" x="2.2" y="3" width="13.2" height="5.6" rx="1.4"/><rect x="10.8" y="3.85" width="3.7" height="3.9" rx="1.2" fill="currentColor" stroke="none"/><rect class="ink-fill" x="8.6" y="15.4" width="13.2" height="5.6" rx="1.4"/><rect x="9.5" y="16.25" width="3.7" height="3.9" rx="1.2" fill="currentColor" stroke="none"/><path class="ink" stroke-width="2.4" stroke-linecap="round" fill="none" d="M12.6 9.4 V11.6"/><path d="M12.6 15 L10.1 11.2 L15.1 11.2 Z" fill="currentColor" stroke="none"/></svg>`,
  // The set already sits a cat up (`cat`, worn by Coming Back Around), so a second cat was
  // always going to be the same animal twice. This is what the cat leaves instead: a print
  // pressed on the page, with a smaller one trailing off behind it and the walk curving back
  // round, which is the other half of what that answer is called.
  pawprint:`<svg viewBox="0 0 24 24"><path class="ink" stroke-width="0.95" opacity="0.35" fill="none" stroke-linecap="round" stroke-dasharray="0.1 2.1" d="M5.4 8.4 C3.4 12.4 4.6 16.4 7.6 18.4"/><g class="ink-fill"><ellipse cx="8" cy="10.4" rx="1.7" ry="2.1" transform="rotate(-20 8 10.4)"/><ellipse cx="11.3" cy="8.7" rx="1.75" ry="2.2"/><ellipse cx="15" cy="9.1" rx="1.75" ry="2.2" transform="rotate(12 15 9.1)"/><ellipse cx="18" cy="11.4" rx="1.65" ry="2.05" transform="rotate(28 18 11.4)"/><path d="M13 20.6 C9.8 20.6 7.4 18.8 7.4 16.4 C7.4 14 9.6 12.6 13 12.6 C16.4 12.6 18.6 14 18.6 16.4 C18.6 18.8 16.2 20.6 13 20.6 Z"/></g><g class="ink-fill"><circle cx="2.9" cy="4.1" r="0.72"/><circle cx="4.6" cy="3.2" r="0.72"/><circle cx="6.3" cy="3.8" r="0.72"/><ellipse cx="4.6" cy="6.1" rx="2.1" ry="1.6"/></g></svg>`,
  // the pan, the nuggets and the glint off them: gold rush, taken at face value
  goldpan:`<svg viewBox="0 0 24 24"><path class="ink-fill" d="M3 12 C3 16.8 6.8 20 12 20 C17.2 20 21 16.8 21 12"/><ellipse class="ink" fill="none" stroke-width="1.5" cx="12" cy="11.8" rx="9" ry="4"/><g class="ink-fill"><path d="M8.6 14.2 L10.7 13.9 L11.5 15.4 L10.1 16.7 L8.3 16 Z"/><path d="M12.8 15.6 L14.6 15.3 L15.2 16.6 L13.7 17.4 Z"/></g><path class="ink-fill" d="M18.4 2.4 L19.15 4.25 L21 5 L19.15 5.75 L18.4 7.6 L17.65 5.75 L15.8 5 L17.65 4.25 Z"/></svg>`,
  // the house at the end of the lane, lit, which is the one thing that song is about
  homepath:`<svg viewBox="0 0 24 24"><path class="ink-fill" d="M12.8 2.6 L21 8.8 V16.2 H4.6 V8.8 Z"/><rect class="ink-fill" x="17.2" y="4.6" width="2.1" height="2.6"/><rect class="ink" fill="none" stroke-width="1.2" x="11.6" y="11.4" width="3" height="4.8"/><rect class="ink" fill="none" stroke-width="1" x="7" y="10.6" width="2.6" height="2.6"/><path class="ink-fill" d="M11.6 16.2 H14.6 L8.8 21.8 H1.4 Z"/><g class="ink" stroke-width="1" opacity="0.5"><path d="M12.4 17.6 L11.6 18.4"/><path d="M9.8 20 L8.8 20.9"/></g></svg>`,
  // the cup on the saucer, still steaming, which is where it all begins again
  coffeecup:`<svg viewBox="0 0 24 24"><g class="ink" stroke-width="1.05" opacity="0.65" fill="none"><path d="M9 5.4 C8 4.2 9.2 3.2 8.4 2"/><path d="M12 5.2 C11 3.8 12.4 3 11.6 1.6"/><path d="M15 5.4 C14 4.2 15.2 3.2 14.4 2"/></g><path class="ink-fill" d="M4.6 7.8 H17.4 L16.5 16.2 C16.35 17.6 15.3 18.4 13.9 18.4 H8.1 C6.7 18.4 5.65 17.6 5.5 16.2 Z"/><path class="ink" fill="none" stroke-width="1.35" d="M17.3 9.6 C19.9 9.2 21.4 10.4 21.2 12.2 C21 14 19.4 15 17 14.6"/><ellipse class="ink" fill="none" stroke-width="1.4" cx="11" cy="20.2" rx="7.6" ry="1.5"/></svg>`,
  // the hammock still slung out under the sky, which is the whole of that Friday night
  hammock:`<svg viewBox="0 0 24 24"><g class="ink-fill"><path d="M4.6 1.8 L5.25 3.4 L6.85 4.05 L5.25 4.7 L4.6 6.3 L3.95 4.7 L2.35 4.05 L3.95 3.4 Z"/><path d="M12 1 L12.8 2.95 L14.75 3.75 L12.8 4.55 L12 6.5 L11.2 4.55 L9.25 3.75 L11.2 2.95 Z"/><path d="M19.3 3.6 L19.85 4.95 L21.2 5.5 L19.85 6.05 L19.3 7.4 L18.75 6.05 L17.4 5.5 L18.75 4.95 Z"/></g><g class="ink" stroke-width="1.5"><path d="M2.8 10.2 V21.2"/><path d="M21.2 10.2 V21.2"/></g><path class="ink-fill" d="M3.4 11.4 C5.6 19.6 18.4 19.6 20.6 11.4 C18.8 15.6 16 17.2 12 17.2 C8 17.2 5.2 15.6 3.4 11.4 Z"/><g class="ink" stroke-width="0.9" opacity="0.6"><path d="M3 10.6 L4.6 12.4"/><path d="M3.4 12.6 L5.2 13.8"/><path d="M21 10.6 L19.4 12.4"/><path d="M20.6 12.6 L18.8 13.8"/></g></svg>`,
  // the tiled wall, the station plate, and something scrawled on it, as the video has it
  stationsign:`<svg viewBox="0 0 24 24"><g class="ink" stroke-width="0.95" opacity="0.4" fill="none"><path d="M1.6 3 H22.4"/><path d="M1.6 6.4 H22.4"/><path d="M6.2 3 V6.4"/><path d="M13.2 3 V6.4"/><path d="M20.2 3 V6.4"/><path d="M2.8 0.6 V3"/><path d="M9.8 0.6 V3"/><path d="M16.8 0.6 V3"/><path d="M1.6 15.4 H22.4"/><path d="M1.6 18.8 H22.4"/><path d="M6.2 15.4 V18.8"/><path d="M13.2 15.4 V18.8"/><path d="M20.2 15.4 V18.8"/><path d="M2.8 18.8 V21.6"/><path d="M9.8 18.8 V21.6"/><path d="M16.8 18.8 V21.6"/></g><rect class="ink-fill" x="2.6" y="7.6" width="18.8" height="6.2" rx="0.9" stroke-width="1.8"/><path class="ink" stroke-width="1.4" fill="none" d="M5.2 11.2 C6.4 9.7 7.6 12 8.9 10.4 C10.2 8.8 11.4 11.1 12.7 9.8 C14 8.5 15.2 11 16.4 10 C17.3 9.2 18.2 10.4 18.9 10.3"/></svg>`,
  // two bells and the ribbon that tied them, rung whether or not anyone asked for it
  weddingbells:`<svg viewBox="0 0 24 24"><path class="ink-fill" d="M4.4 16.6 C5.9 14.9 5.9 9.8 8 8.8 C10.1 9.8 10.1 14.9 11.6 16.6 Z"/><circle class="ink-fill" cx="8" cy="18.1" r="1"/><path class="ink-fill" d="M12.4 16.6 C13.9 14.9 13.9 9.8 16 8.8 C18.1 9.8 18.1 14.9 19.6 16.6 Z"/><circle class="ink-fill" cx="16" cy="18.1" r="1"/><g class="ink" stroke-width="1.1" fill="none"><path d="M8 8.6 C8.8 7.2 10 6.4 11.4 6.1"/><path d="M16 8.6 C15.2 7.2 14 6.4 12.6 6.1"/></g><path class="ink-fill" d="M12 5.8 C9.9 3.3 7.7 3.9 8.3 5.9 C8.8 7.5 10.7 7.4 12 5.8 Z"/><path class="ink-fill" d="M12 5.8 C14.1 3.3 16.3 3.9 15.7 5.9 C15.2 7.5 13.3 7.4 12 5.8 Z"/><circle class="ink-fill" cx="12" cy="5.9" r="1"/></svg>`,
  // the stone, the grass and three lines of inscription, for the streak that is under it
  headstone:`<svg viewBox="0 0 24 24"><path class="ink-fill" d="M6 20.4 V11.6 A6 6 0 0 1 18 11.6 V20.4 Z"/><g class="ink" stroke-width="1.1" opacity="0.8"><path d="M8.8 11.6 H15.2"/><path d="M8.8 14.4 H15.2"/><path d="M9.6 17.2 H14.4"/></g><path class="ink" stroke-width="1.5" d="M2.6 20.8 H21.4"/><g class="ink" stroke-width="1" opacity="0.6" fill="none"><path d="M4.4 20.6 C4.1 19.2 4.6 18.2 5.6 17.6"/><path d="M19.6 20.6 C19.9 19.2 19.4 18.2 18.4 17.6"/></g></svg>`,
  // the sleeve going up, with the record still in it. Burning red, and it was the right album
  burningsleeve:`<svg viewBox="0 0 24 24"><path class="ink" fill="none" stroke-width="1.3" d="M18.4 11.6 A4.4 4.4 0 0 1 18.4 18.4"/><rect class="ink-fill" x="4" y="8.8" width="14.4" height="12.2" rx="0.6"/><path class="ink" stroke-width="0.9" opacity="0.5" d="M6.4 8.9 V21"/><g class="ink-fill"><path d="M6.2 8.6 C5.4 6.6 7.1 5.6 6.6 3.6 C8.5 5 8.9 7.1 8 8.6 Z"/><path d="M10.4 8.6 C9.4 6 11.6 4.6 10.9 2 C13.4 3.8 13.9 6.6 12.6 8.6 Z"/><path d="M14.8 8.6 C14 6.8 15.6 5.8 15.1 4 C17 5.3 17.4 7.2 16.5 8.6 Z"/></g></svg>`,
  /* The Ruthless batch: eight marks for the mode where the clock is the score. Judged at 30px
     first (scripts/ruthless/ruthless-batch-icons.html) rather than large, which is what caught five of
     them — footprints that read as a string of beads, a knot that read as a squiggle, an
     eraser that read as a book. Every one is drawn against its nearest existing neighbour. */
  // one word in longhand on its rule, and the spark of placing it. No page around it
  // deliberately: a sheet with a margin down the left is already three other marks in this table
  oneword: `<svg viewBox="0 0 24 24"><g class="ink" stroke-width="2" stroke-linecap="round"><path d="M8 7.2 L6.8 4.2"/><path d="M12 6.4 V3.2"/><path d="M16 7.2 L17.2 4.2"/><path d="M8 16.8 L6.8 19.8"/><path d="M12 17.6 V20.8"/><path d="M16 16.8 L17.2 19.8"/></g><rect x="3.8" y="9.6" width="16.4" height="4.8" rx="2.4" fill="currentColor" stroke="none"/></svg>`,
  // a cord tied off, two loops and two tails. A bracelet is a thing you knot on
  heldknot:   `<svg viewBox="0 0 24 24"><g class="ink-fill" fill="none"><path d="M1.6 18.2 C4.8 18.2 6.8 15.4 9.4 13.6"/><path d="M22.4 18.2 C19.2 18.2 17.2 15.4 14.6 13.6"/><path d="M10.6 11.6 C7 6.6 3.2 10.4 6.4 12.6 C8.2 13.85 10.1 12.9 10.6 11.6 Z"/><path d="M13.4 11.6 C17 6.6 20.8 10.4 17.6 12.6 C15.8 13.85 13.9 12.9 13.4 11.6 Z"/></g><ellipse class="ink-fill" cx="12" cy="12.4" rx="1.6" ry="1.9"/></svg>`,
  // the eraser never picked up — bevelled tip, paper sleeve. An untouched tool is how you
  // draw an absence
  eraser:     `<svg viewBox="0 0 24 24"><g transform="rotate(-9 12 12)"><path class="ink-fill" d="M2.6 10.4 L6.4 7 H20.2 a1.2 1.2 0 0 1 1.2 1.2 V15.8 a1.2 1.2 0 0 1 -1.2 1.2 H6.4 Z"/><path class="ink" stroke-width="1.35" d="M13.2 7 V17"/><path class="ink" stroke-width="1.05" opacity="0.45" d="M6.4 7 V17"/><path class="ink" stroke-width="1.05" opacity="0.45" d="M16.4 8.9 V15.1 M18.9 8.9 V15.1"/></g></svg>`,
  // bottom lamp lit and the other two left faint, so the mark says GO rather than "traffic light"
  greenlight: `<svg viewBox="0 0 24 24"><rect class="ink-fill" x="5.6" y="2.2" width="10" height="17.2" rx="2.4"/><g class="ink" stroke-width="1.15" opacity="0.4" fill="none"><circle cx="10.6" cy="6.4" r="1.7"/><circle cx="10.6" cy="10.8" r="1.7"/></g><circle class="ink-fill" cx="10.6" cy="15.3" r="2.5"/><path class="ink" stroke-width="1.4" d="M10.6 19.4 V22"/><g class="ink" stroke-width="1.3" stroke-linecap="round" opacity="0.7"><path d="M18 13.4 H21.4"/><path d="M18.4 16.4 H22.4"/></g></svg>`,
  // a clock knocked off true with its hands already swept round. Tilted because the upright
  // clock is taken, and one that is not level reads as being dragged
  clockrush:  `<svg viewBox="0 0 24 24"><g transform="rotate(-14 10.4 12.2)"><circle class="ink-fill" cx="10.4" cy="12.2" r="7.4"/><path class="ink" stroke-width="1.5" stroke-linecap="round" d="M10.4 12.2 V7.4 M10.4 12.2 L14 14.4"/><circle cx="10.4" cy="12.2" r="0.85" fill="currentColor" stroke="none"/><path class="ink" stroke-width="1.4" d="M8.8 4.1 H12"/></g><g class="ink" stroke-width="1.25" stroke-linecap="round" opacity="0.6" fill="none"><path d="M19.8 8.8 C21.4 10.8 21.4 13.6 19.9 15.6"/><path d="M22.2 7.2 C24.3 9.9 24.3 14.5 22.4 17.2"/></g></svg>`,
  // caught mid-blink rather than shut: a sliver of iris still showing, flicks above. The closed
  // eye with lashes below is eyeclosed
  blink:      `<svg viewBox="0 0 24 24"><path class="ink-fill" fill="none" d="M2.6 13.6 C6.8 18.4 17.2 18.4 21.4 13.6"/><path class="ink-fill" fill="none" d="M2.6 13.6 C6.8 11.2 17.2 11.2 21.4 13.6"/><path class="ink" stroke-width="1.4" fill="none" d="M9.4 13.6 A2.6 2.6 0 0 0 14.6 13.6 Z"/><g class="ink" stroke-width="1.25" stroke-linecap="round" opacity="0.7"><path d="M5.8 8.6 L4.4 6"/><path d="M12 7.8 V4.8"/><path d="M18.2 8.6 L19.6 6"/></g></svg>`,
  // two prints heading off, the far one smaller. The toe pads are what stop a footprint
  // reading as a bead
  walkedaway: `<svg viewBox="0 0 24 24"><g transform="translate(7.2 15.6) rotate(-19)"><path class="ink-fill" fill="none" d="M0 -5.6 c2.6 0 3.7 2 3.3 3.9 c-0.36 1.85 -1.75 2.55 -1.95 4.5 c-0.2 2.05 0.62 3.5 -1.35 3.5 c-1.97 0 -1.15 -1.45 -1.35 -3.5 c-0.2 -1.95 -1.59 -2.65 -1.95 -4.5 C-3.7 -3.6 -2.6 -5.6 0 -5.6 Z"/><g class="ink-fill"><ellipse cx="-2.3" cy="-7.3" rx="0.85" ry="0.7"/><ellipse cx="-0.1" cy="-7.9" rx="0.78" ry="0.65"/><ellipse cx="1.9" cy="-7.4" rx="0.68" ry="0.58"/></g></g><g transform="translate(16.8 7.8) rotate(-19) scale(0.78)"><path class="ink-fill" fill="none" d="M0 -5.6 c2.6 0 3.7 2 3.3 3.9 c-0.36 1.85 -1.75 2.55 -1.95 4.5 c-0.2 2.05 0.62 3.5 -1.35 3.5 c-1.97 0 -1.15 -1.45 -1.35 -3.5 c-0.2 -1.95 -1.59 -2.65 -1.95 -4.5 C-3.7 -3.6 -2.6 -5.6 0 -5.6 Z"/><g class="ink-fill"><ellipse cx="-2.3" cy="-7.3" rx="0.85" ry="0.7"/><ellipse cx="-0.1" cy="-7.9" rx="0.78" ry="0.65"/><ellipse cx="1.9" cy="-7.4" rx="0.68" ry="0.58"/></g></g></svg>`,
  // an ear with two notes drifting in. You did not know it, you heard it
  heardit:    `<svg viewBox="0 0 24 24"><path class="ink-fill" fill="none" d="M7.4 21.4 C7.4 18.4 5.4 17.2 4.6 14.4 C3.3 10 5.7 4.8 10.4 4.8 C14.4 4.8 16.6 8 16 11.4 C15.4 14.6 12 14.4 11.6 16.6 C11.3 18.3 12.7 19 13.9 18.3"/><path class="ink" stroke-width="1.35" fill="none" d="M10.2 8.8 C12.5 8.8 13.1 11.1 12 12.5"/><g class="ink-fill"><ellipse cx="17.9" cy="11.5" rx="1.25" ry="1" transform="rotate(-22 17.9 11.5)"/><ellipse cx="21.6" cy="10.3" rx="1.25" ry="1" transform="rotate(-22 21.6 10.3)"/></g><g class="ink" stroke-width="1.3" fill="none"><path d="M19 11.1 V5 L22.7 3.8 V9.9"/><path d="M19 6.6 L22.7 5.4"/></g></svg>`,

  /* ---- The Mastery batch's own marks (2026-08-19) ----
     The last seven charms wearing the dashed question mark, all of them off the Skills &
     Mastery shelf. That shelf is the only one whose feats are about the PLAYER rather than
     about the songs, so none of these marks is allowed to be a bracelet, a page or a record:
     they are the objects on the desk that measure a person and the things a person puts on.

     Three of them are measurements (the level, the candelabra, the ladder), one is the mark
     a pair of hands leaves, and three are things worn or held (the dressed notebook, the
     empty bar, the folded fortune teller). Same rule as the Core and Catalogue batches:
     detail inside a shape is drawn in currentColor, never knocked out in --paper, because
     `.charm` renders both ink classes as outline and a paper knockout would vanish. Note
     also that `.charm` FORCES the two stroke widths, so anything that needs a weight of its
     own is a classless stroke rather than an `ink` path with an attribute. */

  // five skills standing at the same level, drawn as the tool that says so: a spirit level
  // with the bubble dead centre and one graduation per skill. The pun is the whole charm —
  // the feat is five things at one LEVEL — which is why the bar is drawn true rather than
  // tilted like the rest of the desk
  spiritlevel:`<svg viewBox="0 0 24 24"><rect class="ink-fill" x="7.2" y="6.6" width="9.6" height="5.2" rx="2.4"/><g stroke="currentColor" stroke-width="0.95" opacity="0.5" fill="none"><path d="M9.9 7.4 V11"/><path d="M14.1 7.4 V11"/></g><circle cx="12" cy="9.2" r="1.25" fill="currentColor" stroke="none"/><rect class="ink-fill" x="1.4" y="11.8" width="21.2" height="6.2" rx="1.5"/><g stroke="currentColor" stroke-width="1.1" opacity="0.5" fill="none" stroke-linecap="round"><path d="M3.6 17.8 V15.9"/><path d="M7.8 17.8 V15.9"/><path d="M12 17.8 V15.9"/><path d="M16.2 17.8 V15.9"/><path d="M20.4 17.8 V15.9"/></g></svg>`,
  // every skill at the cap: a five-branch candelabra with all five lit. The flames and the
  // candles are solid so the lit five survive down at 12px, where five outlined stubs would
  // close up into one shape; the mirrorball and the strung bulbs were both already taken, and
  // a candelabra is the one thing on this desk that can make the whole place shimmer at once
  candelabra:`<svg viewBox="0 0 24 24"><g class="ink" fill="none"><path d="M12 6.9 V19"/><path d="M12 12.2 C9.4 12.2 7.9 11 7.9 8.5"/><path d="M12 12.2 C14.6 12.2 16.1 11 16.1 8.5"/><path d="M12 15.4 C6.2 15.4 3.5 13.4 3.5 10.7"/><path d="M12 15.4 C17.8 15.4 20.5 13.4 20.5 10.7"/></g><path class="ink-fill" d="M8.6 19 H15.4 L17.4 21.9 H6.6 Z"/><g fill="currentColor" stroke="none"><rect x="10.7" y="4.2" width="2.6" height="2.9" rx="0.7"/><rect x="6.6" y="5.8" width="2.6" height="2.9" rx="0.7"/><rect x="14.8" y="5.8" width="2.6" height="2.9" rx="0.7"/><rect x="2.2" y="8" width="2.6" height="2.9" rx="0.7"/><rect x="19.2" y="8" width="2.6" height="2.9" rx="0.7"/><path d="M12 1.2 C13.2 2.6 13.1 4.1 12 4.1 C10.9 4.1 10.8 2.6 12 1.2 Z"/><path d="M7.9 2.8 C9.1 4.2 9 5.7 7.9 5.7 C6.8 5.7 6.7 4.2 7.9 2.8 Z"/><path d="M16.1 2.8 C17.3 4.2 17.2 5.7 16.1 5.7 C15 5.7 14.9 4.2 16.1 2.8 Z"/><path d="M3.5 5 C4.7 6.4 4.6 7.9 3.5 7.9 C2.4 7.9 2.3 6.4 3.5 5 Z"/><path d="M20.5 5 C21.7 6.4 21.6 7.9 20.5 7.9 C19.4 7.9 19.3 6.4 20.5 5 Z"/></g></svg>`,
  // the top of the climb: a ladder with the pennant already tied to the rail above the last
  // rung. The mastery board's own capstones are a microphone and a closed strand, so this one
  // is deliberately the CLIMB rather than the crown — thirteen levels, and someone up there
  topladder:`<svg viewBox="0 0 24 24"><g transform="rotate(-5 12 12)"><path class="ink-fill" d="M7.7 1.9 L2.2 3.8 L7.7 5.7 Z"/><g class="ink" fill="none"><path d="M7.8 2.1 V22"/><path d="M16.2 5.8 V22"/><path d="M7.8 8 H16.2"/><path d="M7.8 11.2 H16.2"/><path d="M7.8 14.4 H16.2"/><path d="M7.8 17.6 H16.2"/><path d="M7.8 20.8 H16.2"/></g></g></svg>`,
  // ink in all five in one run, drawn as the hand that put it there: five fingers, five inked
  // tips, pressed on purpose. The pads are solid so the five read as ink rather than as
  // fingernails, and the hand is open and square on, which is what keeps it clear of the
  // manicule's pointing finger
  inkedhand:`<svg viewBox="0 0 24 24"><g transform="rotate(-7 12 14)"><path class="ink-fill" d="M8.6 14.2 C8.6 12.4 10.2 11.8 12.6 11.8 C15 11.8 16.6 12.4 16.6 14.2 L16.6 16.8 C16.6 19.9 14.9 21.6 12.6 21.6 C10.3 21.6 8.6 19.9 8.6 16.8 Z"/><g class="ink" fill="none" stroke-linecap="round"><path d="M9.9 12.3 L8.3 5.9"/><path d="M12 11.9 L11.3 4.4"/><path d="M14.2 11.9 L14.8 4.7"/><path d="M16.3 12.4 L17.7 6.7"/><path d="M9.2 15.6 L5.3 13"/></g><g fill="currentColor" stroke="none"><circle cx="8.1" cy="5.2" r="1.35"/><circle cx="11.2" cy="3.7" r="1.35"/><circle cx="14.9" cy="4" r="1.35"/><circle cx="18" cy="6.1" r="1.35"/><circle cx="4.6" cy="12.5" r="1.35"/></g></g></svg>`,
  // the whole wardrobe worn at once, on the thing that wears it: the notebook dressed — its
  // paper patterned, a pen clipped on, a label lettered on the cover and the trinket hanging
  // off the ribbon. The five cosmetics are five details on one object rather than five
  // objects, because a flat lay of five things is unreadable at 30px
  dressednotebook:`<svg viewBox="0 0 24 24"><g transform="rotate(-6 12 12)"><rect class="ink-fill" x="5.6" y="2.6" width="12.8" height="16.6" rx="1.5"/><path stroke="currentColor" stroke-width="1" opacity="0.45" fill="none" d="M8.4 3.1 V18.7"/><path stroke="currentColor" stroke-width="1.35" fill="none" stroke-linecap="round" d="M10 8.8 C11 7.1 12 9.2 13.2 7.7 C14.1 6.5 15.2 8.4 16.4 7.4"/><g stroke="currentColor" stroke-width="1" opacity="0.35" fill="none"><path d="M10 12.4 H16.4"/><path d="M10 15 H15.2"/></g><rect class="ink-fill" x="16.2" y="1.3" width="2.9" height="8.4" rx="1.35"/><path class="ink" fill="none" d="M13.2 19.2 V21.4"/><circle class="ink-fill" cx="13.2" cy="22.5" r="1.1"/></g></svg>`,
  // the blank start button, drawn in the notebook's other language: one bar of music with a
  // rest sitting in it and nothing else written. A rest is the only mark on a desk that means
  // silence on purpose, which is exactly what wearing a wordless button is
  restbar:`<svg viewBox="0 0 24 24"><g class="ink" fill="none"><path d="M4.6 3.6 V20.4"/><path d="M18.2 3.6 V20.4"/></g><path stroke="currentColor" stroke-width="2.6" fill="none" d="M21 3.6 V20.4"/><path stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round" d="M9.4 6 L14 10.6 L10.2 13.6 L14.6 18.4"/><path stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" d="M14.6 18.4 C13 17 10.4 17.4 9.8 19"/></svg>`,
  // three cosmetics handed to chance: the folded paper fortune teller, the one thing on any
  // desk that is worked by the hands and answers by luck. Dice were unavailable three times
  // over — the randomiser already wears a pair, and two charms are drawn from them
  fortuneteller:`<svg viewBox="0 0 24 24"><g transform="rotate(-8 12 12)"><path class="ink-fill" d="M12 2.2 L21.8 12 L12 21.8 L2.2 12 Z"/><g class="ink" fill="none"><path d="M7.1 7.1 L16.9 16.9"/><path d="M16.9 7.1 L7.1 16.9"/></g><path stroke="currentColor" stroke-width="1" opacity="0.45" fill="none" d="M7.1 7.1 H16.9 V16.9 H7.1 Z"/><g fill="currentColor" stroke="none"><circle cx="12" cy="8.8" r="0.85"/><circle cx="15.2" cy="12" r="0.85"/><circle cx="12" cy="15.2" r="0.85"/><circle cx="8.8" cy="12" r="0.85"/></g></g></svg>`,
};

/* ---------- Mastery marks ----------
   Mastery iconography lives in its own namespace, apart from the achievement charm set.
   The two sets answer different questions (a charm says what you did; a mastery mark says
   how far you have climbed) and the charm set is crowded — `feather` alone is worn by seven
   achievements — so a prestige mark can never be redrawn without collateral damage while
   the two share a table. The entries below either ALIAS an ACH_ICONS glyph (where the
   achievement drawing genuinely means the same thing) or are drawn here for Mastery alone.
   Read through masteryMarkup() in app.js; keys are named by MASTERY_LEVEL_ICONS,
   MASTERY_TIER_ICONS, the `icon` field on a mastery reward, and SKILLS[].icon.

   DRAWING NOTES for anything added to MASTERY_OWN_ICONS. A mark renders in two different
   ways depending on the surface, and has to work in both: on the reward tiles and the tier
   medallions it is a `.charm`, where `.ink-fill` is fill:none + a 1.7 stroke, so the mark is
   a pure outline; on the ascent track and the header seals `.ink-fill` really is filled. So
   a shape must read as both a line drawing and a silhouette, thin features must stay wider
   than about 2.5 units or the outline closes up, and a `var(--paper)` knockout is expendable
   detail only (it disappears entirely in outline mode). Detail that must always show is an
   `ink` stroke. And the size that decides everything is the small one: 15px on the ascent
   track, 12px in the mobile query. */
// Marks the mastery board draws itself, because nothing in ACH_ICONS means what they mean.
// Objects dropped or pressed on a desk, tilted off square, not symbols set straight.
const MASTERY_OWN_ICONS = {
  // the random bracelet trinket: a tumbled five-face, mid-roll
  die: `<svg viewBox="0 0 24 24"><g transform="rotate(-13 12 12)"><rect class="ink-fill" x="4.4" y="4.4" width="15.2" height="15.2" rx="3.2" stroke-width="1.1"/><g fill="var(--paper)"><circle cx="8.5" cy="8.5" r="1.3"/><circle cx="15.5" cy="8.5" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="8.5" cy="15.5" r="1.3"/><circle cx="15.5" cy="15.5" r="1.3"/></g></g></svg>`,

  /* The three pens (levels 1–3) are one family: the same 45° lay across the page, the same
     barrel depth, the same cap band and clip, nib end at the bottom left. `feather` (the
     quill, level 2) sets the diagonal they both follow. Only the writing end differs — a
     slit nib, a plume, a gel cone — which is the whole point of the ladder. */
  fountainpen: `<svg viewBox="0 0 24 24"><g transform="rotate(-45 12 12)"><path class="ink-fill" d="M1.2 12 L8.6 9.5 L8.6 14.5 Z"/><circle cx="7" cy="12" r="0.8" fill="var(--paper)"/><path class="ink" stroke-width="0.9" d="M2 12 H5.8"/><rect class="ink-fill" x="8.4" y="9.9" width="2.2" height="4.2" rx="0.6"/><rect class="ink-fill" x="10.4" y="9.2" width="12" height="5.6" rx="1.7"/><path class="ink" stroke-width="1" d="M13.8 9.6 V14.4"/><path class="ink" stroke-width="1.1" d="M20.9 10.6 H17.6 V12.4"/></g></svg>`,
  // the glitter gel pen: same pen, a fine plastic cone instead of a nib, throwing sparkle
  gelpen: `<svg viewBox="0 0 24 24"><g transform="rotate(-45 12 12)"><path class="ink-fill" d="M1.6 12 L7 10.1 L7 13.9 Z"/><rect class="ink-fill" x="6.6" y="9.9" width="2.2" height="4.2" rx="0.6"/><rect class="ink-fill" x="8.6" y="9.2" width="13.8" height="5.6" rx="1.7"/><path class="ink" stroke-width="1" d="M11.8 9.6 V14.4"/><path class="ink" stroke-width="1.1" d="M20.9 10.6 H17.6 V12.4"/></g><g class="ink-fill"><path d="M6 3.4 C6.4 6 7.2 6.8 9.8 7.2 C7.2 7.6 6.4 8.4 6 11 C5.6 8.4 4.8 7.6 2.2 7.2 C4.8 6.8 5.6 6 6 3.4 Z"/><path d="M11.4 1.6 C11.6 3.2 12 3.6 13.6 3.8 C12 4 11.6 4.4 11.4 6 C11.2 4.4 10.8 4 9.2 3.8 C10.8 3.6 11.2 3.2 11.4 1.6 Z"/></g></svg>`,
  /* The super-hard seal (level 6): two hilted blades crossed off square, the under one
     passing behind. The depth is a HOLE IN THE GEOMETRY, not a knockout: the under
     sword's blade is two closed paths with a real 6.4-unit gap between them, so the
     crossing reads identically whether ink-fill is a silhouette or an outline. The
     drawing this replaced expressed the same depth with a var(--paper) knockout stroke,
     which the reward tiles and tier medallions never render (there ink-fill is
     fill:none plus a 1.7 stroke), so on exactly the two surfaces that show this mark
     the two blades collapsed into each other. Grip and guard are also kept over 2.5
     units thick, or their own two edges' strokes meet at 12px and the hilt goes solid. */
  swords: `<svg viewBox="0 0 24 24"><g transform="rotate(-9 12 12) translate(0 -0.7)"><g transform="rotate(-135 12 12.5) translate(-2.2 0.5)"><circle class="ink-fill" cx="2.9" cy="12" r="1.35"/><rect class="ink-fill" x="3.9" y="10.85" width="3" height="2.3" rx="1.1"/><rect class="ink-fill" x="6.8" y="8.7" width="2.4" height="6.6" rx="1.15"/><path class="ink-fill" d="M9.2 10.05 L11 10.17 L11 13.83 L9.2 13.95 Z"/><path class="ink-fill" d="M17.4 10.58 L20 10.75 L23 12 L20 13.25 L17.4 13.42 Z"/></g><g transform="rotate(-45 12 12.5) translate(-1 0.5)"><circle class="ink-fill" cx="2.9" cy="12" r="1.35"/><rect class="ink-fill" x="3.9" y="10.85" width="3" height="2.3" rx="1.1"/><rect class="ink-fill" x="6.8" y="8.7" width="2.4" height="6.6" rx="1.15"/><path class="ink-fill" d="M9.2 10.05 L20 10.75 L23 12 L20 13.25 L9.2 13.95 Z"/></g></g></svg>`,

  /* The sticker vault's seal (level 9): a die-cut sticker, said with ONE closed path and the
     corner sliced clean off. Everything else was tried and taken back out, so save the trip:
     this mark's main surface is `.rb-ms-seal`, which paints ink-fill AND ink in the same flat
     foil (see styles.css), so the peel cannot be a second shape laid against the body — a
     filled wedge in the removed corner adds back up to the rounded square it started as, and a
     stroked flap outside it merges into the silhouette it is supposed to lift away from. Both
     read at 18px as a plain blob. Negative space is the only thing that separates two shapes
     here, the way `swords` above uses a real gap, and a gap wide enough to read at this size
     would eat a third of the sticker.
     So the slice IS the drawing, and it is enough: a die cut with one corner gone reads as a
     sticker with the corner lifted, and it survives being a silhouette, an outline and a 12px
     mark on the mobile ascent track. Nothing inside the body for the same reason, and because
     a blank die cut is what an unearned sticker looks like anyway. */
  sticker: `<svg viewBox="0 0 24 24"><g transform="rotate(-8 12 12)"><path class="ink-fill" d="M7.3 3.6 H16.4 C18.61 3.6 20.4 5.39 20.4 7.6 V12.9 L12.9 20.4 H7.3 C5.09 20.4 3.6 18.61 3.6 16.4 V7.6 C3.6 5.39 5.09 3.6 7.3 3.6 Z"/></g></svg>`,

  /* The four prestige tier marks (MASTERY_TIER_ICONS). Four objects off one desk rather than
     four ranks of the same badge, each drawn from its tier's name: a pressed laurel sprig,
     an arched bridge, the department chair, a showgirl's plume fan. Deliberately four
     different silhouettes, because on the rail they are read side by side. */
  laurel: `<svg viewBox="0 0 24 24"><g transform="rotate(-5 12 12)"><path class="ink" stroke-width="1.4" fill="none" d="M5.4 21.4 C9 18 13.6 12.2 17 3.4"/><g class="ink-fill"><ellipse cx="5.2" cy="15.4" rx="3.2" ry="1.6" transform="rotate(-26 5.2 15.4)"/><ellipse cx="8.8" cy="9.9" rx="3.2" ry="1.6" transform="rotate(-34 8.8 9.9)"/><ellipse cx="12.2" cy="17.9" rx="3.2" ry="1.6" transform="rotate(34 12.2 17.9)"/><ellipse cx="15.2" cy="11.9" rx="3.2" ry="1.6" transform="rotate(26 15.2 11.9)"/><ellipse cx="17" cy="5.6" rx="2.9" ry="1.45" transform="rotate(16 17 5.6)"/></g></g></svg>`,
  bridge: `<svg viewBox="0 0 24 24"><g transform="rotate(-3 12 12)"><path class="ink" stroke-width="1.7" fill="none" d="M1.4 17.6 C4.2 7.4 19.8 7.4 22.6 17.6"/><path class="ink" stroke-width="1.2" fill="none" d="M1.4 14 C4.6 4.6 19.4 4.6 22.6 14"/><g class="ink" stroke-width="1" opacity="0.8"><path d="M5.4 12.6 V9"/><path d="M12 10.9 V7.2"/><path d="M18.6 12.6 V9"/></g><path class="ink" stroke-width="1.3" fill="none" d="M7.2 17.7 C8.2 13 15.8 13 16.8 17.7"/><g class="ink" stroke-width="1.1" opacity="0.7"><path d="M2 20.4 C4.2 19.2 6 21.2 8.2 20 C10.4 18.8 12.2 20.8 14.4 19.6 C16.6 18.4 18.4 20.4 20.6 19.2"/><path d="M3.6 22.8 C5.8 21.6 7.6 23.6 9.8 22.4 C12 21.2 13.8 23.2 16 22"/></g></g></svg>`,
  chair: `<svg viewBox="0 0 24 24"><g transform="rotate(-5 12 12)"><rect class="ink-fill" x="6.8" y="2.4" width="10.4" height="10" rx="2.6"/><g class="ink" stroke-width="0.9" opacity="0.75"><path d="M10 5.2 V9.8"/><path d="M14 5.2 V9.8"/></g><rect class="ink-fill" x="4.4" y="12.6" width="15.2" height="2.8" rx="1"/><g class="ink" stroke-width="1.6"><path d="M6.6 15.6 V21.2"/><path d="M17.4 15.6 V21.2"/></g></g></svg>`,
  plumes: `<svg viewBox="0 0 24 24"><g transform="rotate(-4 12 12)"><g transform="rotate(-38 12 19.6)"><path class="ink-fill" d="M12 15.9 C9.3 13.7 8.9 8.8 10.7 5.6 C11.6 4 13.5 3.7 14.3 5.3 C15.9 8.4 15.1 13.5 12 15.9 Z"/><path class="ink" stroke-width="1" fill="none" d="M12 19.6 C11.9 18.2 11.9 17 12 15.9 C11.6 13.2 11.8 9.4 12.6 6.4"/></g><g transform="rotate(36 12 19.6)"><path class="ink-fill" d="M12 15.9 C9.3 13.7 8.9 8.8 10.7 5.6 C11.6 4 13.5 3.7 14.3 5.3 C15.9 8.4 15.1 13.5 12 15.9 Z"/><path class="ink" stroke-width="1" fill="none" d="M12 19.6 C11.9 18.2 11.9 17 12 15.9 C11.6 13.2 11.8 9.4 12.6 6.4"/></g><g transform="rotate(-1 12 19.6) translate(12 19.6) scale(1.12) translate(-12 -19.6)"><path class="ink-fill" d="M12 15.9 C9.3 13.7 8.9 8.8 10.7 5.6 C11.6 4 13.5 3.7 14.3 5.3 C15.9 8.4 15.1 13.5 12 15.9 Z"/><path class="ink" stroke-width="1" fill="none" d="M12 19.6 C11.9 18.2 11.9 17 12 15.9 C11.6 13.2 11.8 9.4 12.6 6.4"/></g><rect class="ink-fill" x="9.2" y="18.6" width="5.6" height="3.2" rx="1.1"/><path class="ink" stroke-width="0.8" opacity="0.55" d="M9.4 20.2 H14.6"/></g></svg>`,

  /* The two capstones (level 13), the last marks in the game. The Showgirl takes the stage:
     a stand mic, tipped back the way one is left after a bow. The Swiftie takes the bracelet:
     a finished strand tied into a closed ring, knot and tails still hanging. */
  mic: `<svg viewBox="0 0 24 24"><g transform="rotate(-11 12 12)"><circle class="ink-fill" cx="12" cy="7.6" r="5"/><g class="ink" stroke-width="0.9" opacity="0.75"><path d="M8.4 5.4 H15.6"/><path d="M7.4 7.6 H16.6"/><path d="M8.4 9.8 H15.6"/></g><rect class="ink-fill" x="10.6" y="12.2" width="2.8" height="4.8" rx="1"/><path class="ink-fill" d="M6.6 21.2 C7.2 18 16.8 18 17.4 21.2 Z"/></g></svg>`,
  braceletring: `<svg viewBox="0 0 24 24"><g transform="rotate(-14 12 12)"><ellipse class="ink" cx="12" cy="11.6" rx="7.5" ry="6.6" fill="none" stroke-width="1.2"/><g class="ink-fill"><circle cx="19.5" cy="11.6" r="1.55"/><circle cx="17.3" cy="16.3" r="1.15"/><circle cx="12" cy="18.2" r="1.55"/><circle cx="6.7" cy="16.3" r="1.15"/><circle cx="4.5" cy="11.6" r="1.55"/><circle cx="6.7" cy="6.9" r="1.15"/><circle cx="12" cy="5" r="1.55"/><circle cx="17.3" cy="6.9" r="1.15"/></g><path class="ink" stroke-width="1.2" fill="none" d="M10.4 19.2 C9.6 21 8.8 21.8 7.4 22.4 M13.2 19 C13.4 20.8 14 21.8 15.2 22.6"/></g></svg>`,
};

export const MASTERY_ICONS = Object.assign(Object.fromEntries([
  // the quill (level 2) — the one pen of the three that ACH_ICONS already draws right
  "feather", "sparkle", "key",
  // level marks with no reward of their own: paper, charms, button finishes, flourishes
  "nib", "book", "gem", "rise",
  // the marks worn by prestige titles in the stepper (the TIERS have their own, drawn above)
  "drop", "tower", "note", "quote", "brain", "crown", "star",
  // skill emblems and the shared padlock
  "comet", "metronome", "heartline", "trail", "records", "lock",
].map((k) => [k, ACH_ICONS[k]])), MASTERY_OWN_ICONS);

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
/* The stand-in motif for a freshly built challenge: a plain upright question mark, deliberately
   generic so an unfinished seal reads as unfinished at a glance. Swap each one for a real motif
   drawn from its challenge's name + rule (see the notes above) as they're designed. */
const PLACEHOLDER_MOTIF_D = "M32 19 A7 7 0 0 1 39 26 C39 30 34.5 31 33.5 34 L30.5 34 C31.5 29.5 36 28.5 36 26 A4 4 0 0 0 28 26 L25 26 A7 7 0 0 1 32 19 Z M29.8 37.4 a2.2 2.2 0 1 1 4.4 0 a2.2 2.2 0 1 1 -4.4 0";
const WAX_SEAL_MOTIFS = {
  // a circle dissolving into scattering dots: the word vanishing before your eyes
  "vanishing-word": { wax: 1, fr: "nonzero", d: "M32 19 A13 13 0 0 0 32 45 Z M37.5 22.5 m-2.7 0 a2.7 2.7 0 1 1 5.4 0 a2.7 2.7 0 1 1 -5.4 0 M40 32 m-3.1 0 a3.1 3.1 0 1 1 6.2 0 a3.1 3.1 0 1 1 -6.2 0 M37.5 41.5 m-2.7 0 a2.7 2.7 0 1 1 5.4 0 a2.7 2.7 0 1 1 -5.4 0 M43.5 25.5 m-1.7 0 a1.7 1.7 0 1 1 3.4 0 a1.7 1.7 0 1 1 -3.4 0 M44.8 36.5 m-1.6 0 a1.6 1.6 0 1 1 3.2 0 a1.6 1.6 0 1 1 -3.2 0 M46.7 31 m-1.1 0 a1.1 1.1 0 1 1 2.2 0 a1.1 1.1 0 1 1 -2.2 0" },
  // a vinyl record, label and spindle hole pressed in: one single album
  "deep-cut": { wax: 2, fr: "nonzero", d: "M18.5 32 a13.5 13.5 0 1 1 27 0 a13.5 13.5 0 1 1 -27 0 M23.7 32 a8.3 8.3 0 1 0 16.6 0 a8.3 8.3 0 1 0 -16.6 0 M25.7 32 a6.3 6.3 0 1 1 12.6 0 a6.3 6.3 0 1 1 -12.6 0 M30.2 32 a1.8 1.8 0 1 0 3.6 0 a1.8 1.8 0 1 0 -3.6 0" },
  // a word as three bars, warping more with every line until it breaks apart
  "word-modifiers": { wax: 4, fr: "nonzero", d: "M22 22.5 H42 V26 H22 Z M22 30.5 C26 28.5 28 32.5 32 30.5 C36 28.5 38 32.5 42 30.5 L42 34 C38 36 36 32 32 34 C28 36 26 32 22 34 Z M21.5 39 C25 36.5 28 41.5 31 39 L31 42.5 C28 45 25 40 21.5 42.5 Z M34 38.5 C37 36 40 41 43.5 38.5 L43.5 42 C40 44.5 37 39.5 34 41.5 Z" },
  // one lone song: a single bold eighth note
  "one-of-a-kind": { wax: 5, fr: "nonzero", d: "M24.2 40.4 a4.2 4.2 0 1 1 8.4 0 a4.2 4.2 0 1 1 -8.4 0 M31.4 22.6 H34 V40.4 H31.4 Z M34 22.6 C39 24.6 40.6 28.5 39.4 33.1 C38.5 30.3 36.7 28.7 34 28.1 Z" },
  // a forking road: one path in, two ways out
  "choose-your-path": { wax: 6, fr: "nonzero", d: "M30 46 V37.2 L22 24.6 A2.7 2.7 0 0 1 26.4 21.9 L32 31.2 L37.6 21.9 A2.7 2.7 0 0 1 42 24.6 L34 37.2 V46 Z" },
  // a tilted playing card with a question mark: the rule you can't predict
  "wildcard": { wax: 7, fr: "evenodd", d: "M22.6 23.8 L37.3 20.7 L41.4 40.2 L26.7 43.3 Z M28.3 29.5 A4.2 4.2 0 1 1 34.5 32.4 L33.4 30.5 A1.9 1.9 0 1 0 30.6 29.1 Z M31.8 32.8 L33.9 32.6 L34.1 35.4 L32 35.6 Z M31.4 38.7 a1.6 1.6 0 1 0 3.2 0 a1.6 1.6 0 1 0 -3.2 0" },
  // a revolving door from above: the ring and its spinning vanes
  "revolving-door": { wax: 8, fr: "evenodd", d: "M19 32 a13 13 0 1 1 26 0 a13 13 0 1 1 -26 0 M21 32 a11 11 0 1 1 22 0 a11 11 0 1 1 -22 0 M30.7 21.5 H33.3 V42.5 H30.7 Z M21.5 30.7 H42.5 V33.3 H21.5 Z M29 32 a3 3 0 1 1 6 0 a3 3 0 1 1 -6 0" },
  // a stopwatch nearly empty, only a thin wedge of time left
  "shrinking-timer": { wax: 9, fr: "nonzero", d: "M21.7 34.2 a10.3 10.3 0 1 1 20.6 0 a10.3 10.3 0 1 1 -20.6 0 M24.3 34.2 a7.7 7.7 0 1 0 15.4 0 a7.7 7.7 0 1 0 -15.4 0 M32 34.2 L32 27.3 A6.9 6.9 0 0 1 37.6 30.9 Z M29.7 20.5 H34.3 V24.2 H29.7 Z" },
  // a title ribbon with the word slotted inside it
  "title-in": { wax: 43, fr: "evenodd", d: "M18.8 27 H45.2 L41.8 32 L45.2 37 H18.8 L22.2 32 Z M24.8 30.7 H39.2 V33.3 H24.8 Z" },
  // a little name tag with a heart: short and sweet
  "short-title": { wax: 11, fr: "evenodd", d: "M22 32 L28 25.5 H40.9 Q42.5 25.5 42.5 27.1 V36.9 Q42.5 38.5 40.9 38.5 H28 Z M25.3 32 a1.5 1.5 0 1 0 3 0 a1.5 1.5 0 1 0 -3 0 M35 35.6 C33 33.8 31.5 32.4 31.5 30.5 C31.5 28.5 33.9 27.9 35 29.7 C36.1 27.9 38.5 28.5 38.5 30.5 C38.5 32.4 37 33.8 35 35.6 Z" },
  // a heart holding a quotation: the lyric line, loved word for word
  "lyric-lover": { wax: 12, fr: "evenodd", d: "M32 45 C25.5 39.5 20.5 35 20.5 28.8 C20.5 22.4 28.4 20.6 32 26 C35.6 20.6 43.5 22.4 43.5 28.8 C43.5 35 38.5 39.5 32 45 Z M29.4 27.6 C31.2 28.3 31.5 30.7 30 33.6 L28.6 33 C29.7 30.8 29.6 29.2 28.8 28.3 Z M35 27.6 C36.8 28.3 37.1 30.7 35.6 33.6 L34.2 33 C35.3 30.8 35.2 29.2 34.4 28.3 Z" },
  // a fountain-pen nib, breather hole and slit pressed in: the only challenge whose currency
  // is ink. It replaced a scroll of written lines, which said "a page of writing" but sat in
  // the same family as half the set; the nib is one object, and it is the one this rule is
  // about: how much of it you get onto the paper.
  "lyric-ink": { fr: "evenodd", d: "M32 20 L39.2 31 L32 44.2 L24.8 31 Z M29.9 28.3 a2.1 2.1 0 1 1 4.2 0 a2.1 2.1 0 1 1 -4.2 0 M31.05 31.6 H32.95 V41.6 H31.05 Z" },
  // three chain links running corner to corner: each song wrapped onto the last
  "wrapped-chain": { wax: 13, fr: "evenodd", d: "M20.9 26.6 a4.5 4.5 0 1 1 9 0 a4.5 4.5 0 1 1 -9 0 M23.4 26.6 a2 2 0 1 1 4 0 a2 2 0 1 1 -4 0 M27.5 32 a4.5 4.5 0 1 1 9 0 a4.5 4.5 0 1 1 -9 0 M30 32 a2 2 0 1 1 4 0 a2 2 0 1 1 -4 0 M34.1 37.4 a4.5 4.5 0 1 1 9 0 a4.5 4.5 0 1 1 -9 0 M36.6 37.4 a2 2 0 1 1 4 0 a2 2 0 1 1 -4 0" },
  // a stage microphone: every night a different album on cue
  "on-tour": { wax: 14, fr: "nonzero", d: "M31.3 25.5 a5.2 5.2 0 1 1 10.4 0 a5.2 5.2 0 1 1 -10.4 0 M33.85 29.12 L35.95 30.28 L28.05 44.58 L25.95 43.42 Z M22 45.4 a6.5 1.9 0 1 1 13 0 a6.5 1.9 0 1 1 -13 0" },
  // an alarm clock, hands frozen mid-run: the one shared clock
  "its-a-clock": { wax: 15, fr: "nonzero", d: "M22 33.5 a10 10 0 1 1 20 0 a10 10 0 1 1 -20 0 M24.4 33.5 a7.6 7.6 0 1 0 15.2 0 a7.6 7.6 0 1 0 -15.2 0 M31 34.5 V27.8 H33 V32.5 H36.8 V34.5 Z M20.8 24.4 a3.2 3.2 0 1 1 6.4 0 a3.2 3.2 0 1 1 -6.4 0 M36.8 24.4 a3.2 3.2 0 1 1 6.4 0 a3.2 3.2 0 1 1 -6.4 0 M24.4 41.9 L26 42.9 L24.4 45.5 L22.8 44.5 Z M39.6 41.9 L38 42.9 L39.6 45.5 L41.2 44.5 Z" },
  // two arrows trading places: title one page, lyric the next
  "switch-up": { wax: 16, fr: "nonzero", d: "M22 26.2 H36 V23.4 L42.5 28 L36 32.6 V29.8 H22 Z M42 37.8 H28 V35 L21.5 39.6 L28 44.2 V41.4 H42 Z" },
  // two beamed notes: every page wants a pair of songs
  "double-trouble": { wax: 17, fr: "nonzero", d: "M22.4 40.3 a3.5 3.5 0 1 1 7 0 a3.5 3.5 0 1 1 -7 0 M28.2 25.2 H30.2 V40.3 H28.2 Z M34.4 38.3 a3.5 3.5 0 1 1 7 0 a3.5 3.5 0 1 1 -7 0 M40.2 23.5 H42.2 V38.3 H40.2 Z M28.2 25.2 L42.2 23.2 V27.2 L28.2 29.2 Z" },
  // the devil's own fork: a trident with a wavering path for a shaft
  "devils-path": { wax: 18, fr: "nonzero", d: "M24.2 29 H39.8 V31.6 H24.2 Z M24.2 22.3 L25.4 19.7 L26.6 22.3 V29.3 H24.2 Z M30.8 21.4 L32 18.8 L33.2 21.4 V29.3 H30.8 Z M37.4 22.3 L38.6 19.7 L39.8 22.3 V29.3 H37.4 Z M30.7 31.4 H33.3 C32.2 34.4 34.6 36.2 33.5 39.2 C32.7 41.4 34.2 42.8 33.2 45.4 H30.6 C31.6 42.8 30.1 41.4 30.9 39.2 C32 36.2 29.6 34.4 30.7 31.4 Z" },
  // an eye with a lightning-bolt iris: read the flash before it's gone
  "ready-for-it": { wax: 19, fr: "evenodd", d: "M18.5 32 C23 24.5 41 24.5 45.5 32 C41 39.5 23 39.5 18.5 32 Z M34 26.8 L28.4 33.4 H31.6 L30.6 37.2 L35.6 30.7 H32.8 Z" },
  // a house split by a jagged crack: every miss steals from the home clock
  "home-invasion": { wax: 20, fr: "evenodd", d: "M32 19.8 L38.4 25 V21.9 H42 V27.9 L44.6 30 H42.2 V43.4 H21.8 V30 H19.4 Z M31.3 23.2 L33.7 23.2 L31.9 30.4 L34.6 30.4 L29.9 41 L31.1 33.4 L28.5 33.4 Z" },
  // the number itself, stamped like a year on a document seal
  "thirty-one": { wax: 21, fr: "nonzero", d: "M24.5 23 H34.9 V25.7 H24.5 Z M26.3 30.7 H34.9 V33.3 H26.3 Z M24.5 38.3 H34.9 V41 H24.5 Z M32.3 23 H34.9 V41 H32.3 Z M38.7 23 H41.3 V41 H38.7 Z M36.3 26.6 L38.7 23 L38.7 26.6 Z M36.5 38.3 H43.5 V41 H36.5 Z" },
  // a magnifying glass over a tiny tilted scrap of a word
  "smallest-song": { wax: 22, fr: "nonzero", d: "M20.6 28.3 a7.7 7.7 0 1 1 15.4 0 a7.7 7.7 0 1 1 -15.4 0 M22.6 28.3 a5.7 5.7 0 1 0 11.4 0 a5.7 5.7 0 1 0 -11.4 0 M33.1 34.5 L34.5 33.1 L42.9 41.5 L41.5 42.9 Z M25.7 29.9 L30.7 28 L31.2 29.3 L26.2 31.2 Z" },
  // the flag you raise on a fake: a pennant on its pole
  "impostor": { wax: 23, fr: "nonzero", d: "M26.2 20 H28.8 V45.4 H26.2 Z M28.6 20.8 C33.8 22.6 37.9 21.4 42.8 24.6 C38 27.8 33.8 26.6 28.6 28.4 Z" },
  // a song bobbing on open water: fish the right title out of the sea
  "sea-of-songs": { wax: 24, fr: "nonzero", d: "M24.6 30.6 a2.9 2.9 0 1 1 5.8 0 a2.9 2.9 0 1 1 -5.8 0 M30.1 21 H31.9 V30.6 H30.1 Z M31.9 21 C35.4 22.6 36.6 25.4 35.8 28.7 C35.1 26.5 33.8 25.3 31.9 24.9 Z M21.5 34.8 C24.5 32.4 27.5 32.4 30.5 34.8 C33.5 37.2 36.5 37.2 39.5 34.8 C40.6 33.9 41.6 33.3 42.5 33.1 L42.5 35.9 C41.6 36.1 40.6 36.7 39.5 37.6 C36.5 40 33.5 40 30.5 37.6 C27.5 35.2 24.5 35.2 21.5 37.6 Z M21.5 39.8 C24.5 37.4 27.5 37.4 30.5 39.8 C33.5 42.2 36.5 42.2 39.5 39.8 C40.6 38.9 41.6 38.3 42.5 38.1 L42.5 40.9 C41.6 41.1 40.6 41.7 39.5 42.6 C36.5 45 33.5 45 30.5 42.6 C27.5 40.2 24.5 40.2 21.5 42.6 Z" },
  // a needle drawing one thread through everything: the word all three lines share
  "common-thread": { wax: 25, fr: "nonzero", d: "M21.3 43.2 L39 24.4 Q40.5 23 42 24.5 Q43.5 26 42.1 27.5 L23.3 45.2 Z M39.3 25.9 a1.2 1.2 0 1 0 2.4 0 a1.2 1.2 0 1 0 -2.4 0 M41.2 26.3 C45.6 29.7 43.6 35.2 38.3 36 C33.6 36.7 30.9 40 32 44.4 L30.4 44.8 C29 39.4 32.5 35.2 37.7 34.4 C41.9 33.6 43.4 30 40.1 27.4 Z" },
  // a two-by-two grid of pressed dots, three solid and one hollow: tap the one that doesn't belong
  "odd-one-out": { wax: 26, fr: "evenodd", d: "M20.3 25.5 a5.2 5.2 0 1 1 10.4 0 a5.2 5.2 0 1 1 -10.4 0 M33.3 25.5 a5.2 5.2 0 1 1 10.4 0 a5.2 5.2 0 1 1 -10.4 0 M20.3 38.5 a5.2 5.2 0 1 1 10.4 0 a5.2 5.2 0 1 1 -10.4 0 M33.3 38.5 a5.2 5.2 0 1 1 10.4 0 a5.2 5.2 0 1 1 -10.4 0 M35.8 38.5 a2.7 2.7 0 1 1 5.4 0 a2.7 2.7 0 1 1 -5.4 0" },
  // a speech bubble holding one blank line: no prompt word, just whose line it is
  "whose-line": { wax: 27, fr: "evenodd", d: "M23.5 21.5 H40.5 Q43.5 21.5 43.5 24.5 V32.5 Q43.5 35.5 40.5 35.5 H30.5 L23.8 41.8 L26 35.5 H23.5 Q20.5 35.5 20.5 32.5 V24.5 Q20.5 21.5 23.5 21.5 Z M25.5 26.8 H38.5 V29.9 H25.5 Z" },
  // two words as overlapping discs, the shared lens pressed in with one bead: the song holding both
  "both-of-us": { wax: 37, fr: "evenodd", d: "M17 32 a9 9 0 1 1 18 0 a9 9 0 1 1 -18 0 M29 32 a9 9 0 1 1 18 0 a9 9 0 1 1 -18 0 M30.2 32 a1.8 1.8 0 1 1 3.6 0 a1.8 1.8 0 1 1 -3.6 0" },
  // three eighth notes on one beam: Double Trouble's pair, plus the one that proves it
  "name-three": { wax: 29, fr: "nonzero", d: "M20.6 39.6 a3 3 0 1 1 6 0 a3 3 0 1 1 -6 0 M28.4 38.5 a3 3 0 1 1 6 0 a3 3 0 1 1 -6 0 M36.2 37.4 a3 3 0 1 1 6 0 a3 3 0 1 1 -6 0 M25.6 25.1 H27.5 V39.6 H25.6 Z M33.4 24.1 H35.3 V38.5 H33.4 Z M41.1 22.9 H43 V37.4 H41.1 Z M25.6 24.9 L43 22.6 L43 26.1 L25.6 28.4 Z" },
  // a lucky horseshoe: the same luck a stake-won bead's trinket wears on the bracelet
  "press-your-luck": { wax: 30, fr: "evenodd", d: "M26.9 41.4 A12 12 0 1 1 37.1 41.4 L35.2 37.3 A7.5 7.5 0 1 0 28.8 37.3 Z M21.1 30.5 a1.15 1.15 0 1 0 2.3 0 a1.15 1.15 0 1 0 -2.3 0 M23.95 23.6 a1.15 1.15 0 1 0 2.3 0 a1.15 1.15 0 1 0 -2.3 0 M30.85 20.75 a1.15 1.15 0 1 0 2.3 0 a1.15 1.15 0 1 0 -2.3 0 M37.75 23.6 a1.15 1.15 0 1 0 2.3 0 a1.15 1.15 0 1 0 -2.3 0 M40.6 30.5 a1.15 1.15 0 1 0 2.3 0 a1.15 1.15 0 1 0 -2.3 0" },
  // a stack of chips with one more tossed on top: the stake laid before the clock runs
  "confidence-wager": { wax: 31, fr: "nonzero", d: "M23.5 25.9 L39 22.3 A2.4 2.4 0 0 0 38 17.7 L22.5 21.3 A2.4 2.4 0 0 0 23.5 25.9 Z M24.9 27.1 a2.4 2.4 0 0 0 0 4.8 H38.1 a2.4 2.4 0 0 0 0 -4.8 Z M27.4 32.7 a2.4 2.4 0 0 0 0 4.8 H40.6 a2.4 2.4 0 0 0 0 -4.8 Z M25.4 38.3 a2.4 2.4 0 0 0 0 4.8 H38.6 a2.4 2.4 0 0 0 0 -4.8 Z" },
  // a tilted die landed on two: the pot that doubles, or goes. Shelved with its challenge
  // (see CHALLENGES above); seed 32 stays reserved so the seal returns with the same pour.
  // "double-or-nothing": { wax: 32, fr: "evenodd", d: "M24.8 21 L43 24.8 L39.2 43 L21 39.2 Z M26.9 27.6 a2.3 2.3 0 1 1 4.6 0 a2.3 2.3 0 1 1 -4.6 0 M32.5 36.4 a2.3 2.3 0 1 1 4.6 0 a2.3 2.3 0 1 1 -4.6 0" },
  // a shield holding one bead safe inside it: every shield you keep is worth beads
  "insurance": { wax: 33, fr: "evenodd", d: "M32 18.5 C36 21 40 21.8 44 22.2 V31 C44 38.5 39 43.5 32 46.5 C25 43.5 20 38.5 20 31 V22.2 C24 21.8 28 21 32 18.5 Z M27 31 a5 5 0 1 1 10 0 a5 5 0 1 1 -10 0 M29.6 31 a2.4 2.4 0 1 1 4.8 0 a2.4 2.4 0 1 1 -4.8 0" },
};

/* ---------- The wax, poured once per seal ----------
   The die is ONE physical stamp: same 20-unit circle, same engraved ring, same relief
   lighting on every challenge, with only the motif swapped in the middle. The wax it gets
   pressed into is what differs, because a puddle of wax never pools the same way twice.
   So the blob outline, the bead ring, the pinhole bubbles, the sheen and the squeeze marks
   at the rim are all generated from one small integer (`wax` on the motif entry) instead of
   being shared literals.

   THE CONSTRAINT that caps how wild a shape can get: the die is drawn ON TOP of the wax and
   is NOT clipped to it (the clip group closes before the die circle below). If the puddle's
   edge ever came inside r≈22, the die's hard circular rim would hang out over bare paper and
   the whole illusion dies. Hence WAX_R_MIN, and hence every seal still being a roughly round
   pour. Anything more dramatic (a drip, a squarish press, wax run to one side) needs the die
   clipped to the blob first, which is a different job.

   SEEDS. A pour is a pure function of its seed, so two seals holding the same number are the
   same outline twice. There are two classes of seed, kept in disjoint ranges so they can
   never collide with each other:
     - LOCKED (below WAX_AUTO_BASE): a small integer written into the motif entry by hand,
       chosen by eye in the dev panel's seal gallery. A seal is an identity object and must
       never change once a player has seen it, so a reviewed shape gets pinned here.
     - AUTO (WAX_AUTO_BASE and up): derived from the challenge id when the entry omits `wax`.
       A new challenge therefore gets a unique, stable shape for free, and the gallery marks
       it as never-reviewed so it can be auditioned and locked whenever you get to it.
   The gallery flags a duplicate seed in red, so a hash collision between two auto ids (or a
   locked number typed twice) shows up the moment you look rather than shipping two twins. */
const WAX_R_MIN = 23.0;   // the die is r=20; this keeps a lip of wax proud of it at every angle
const WAX_R_MAX = 28.6;   // viewBox is -2..66 and the contact shadow is offset (1.7,2.5) + blurred

// mulberry32: small, fast, and good enough that neighbouring seeds give unrelated shapes
// (a plain LCG gave visibly similar pours for 7 and 8, which defeats the point of auditioning).
function waxRng(seed) {
  let a = (seed >>> 0) + 0x6d2b79f5;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const w1 = (v) => Math.round(v * 10) / 10;

// Auto seeds live above every hand-locked one, so the two classes can never collide.
const WAX_AUTO_BASE = 1000;
// FNV-1a over the challenge id. Only needs to scatter well enough that two ids rarely land
// on the same pour; the gallery's duplicate flag is the backstop if they ever do.
function waxAutoSeed(id) {
  let h = 0x811c9dc5;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return WAX_AUTO_BASE + (h % 900000);
}
const waxSeedOf = (id, motif) => motif.wax || waxAutoSeed(id);

// Everything about one pour. Anchors come back out with it because the squeeze marks are
// placed against real anchor radii rather than a guessed constant, which is the only way to
// be sure they land in wax on a lopsided blob.
function waxPour(seed) {
  const rnd = waxRng(seed);
  const lobes = 10 + Math.floor(rnd() * 4);          // 10-13, so lobe COUNT differs, not just size
  const amp = 1.1 + rnd() * 1.7;                     // how lumpy this particular pour is
  const base = 25.5 + rnd() * 0.9;
  const ox = (rnd() - 0.5) * 1.2;                    // a hand press is never dead centre
  const oy = (rnd() - 0.5) * 1.2;
  const spin = rnd() * Math.PI * 2;
  const floor = WAX_R_MIN + Math.hypot(ox, oy);      // keep the offset pour clear of the die too
  const pts = [];
  for (let i = 0; i < lobes; i++) {
    const a = spin + (i / lobes) * Math.PI * 2 + (rnd() - 0.5) * (Math.PI / lobes) * 0.8;
    const r = Math.min(WAX_R_MAX, Math.max(floor, base + (rnd() * 2 - 1) * amp));
    pts.push([32 + ox + Math.cos(a) * r, 32 + oy + Math.sin(a) * r, a, r]);
  }

  // Closed Catmull-Rom through the anchors, expressed as cubics so the result is the same
  // shape of path the hand-drawn original was.
  const at = (i) => pts[(i + lobes) % lobes];
  const segs = [];
  let blob = `M${w1(pts[0][0])} ${w1(pts[0][1])}`;
  for (let i = 0; i < lobes; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    segs.push([[p1[0], p1[1]], c1, c2, [p2[0], p2[1]]]);
    blob += ` C${w1(c1[0])} ${w1(c1[1])} ${w1(c2[0])} ${w1(c2[1])} ${w1(p2[0])} ${w1(p2[1])}`;
  }
  blob += " Z";

  // The beaded rim: count and phase vary, and the dot shrinks as the count climbs so a
  // 28-bead rim reads as finer rather than crowded.
  const nb = 24 + 2 * Math.floor(rnd() * 3);
  const dot = nb >= 28 ? 0.78 : nb >= 26 ? 0.85 : 0.92;
  const phase = rnd() * Math.PI * 2;
  let beads = "";
  for (let i = 0; i < nb; i++) {
    const a = phase + (i / nb) * Math.PI * 2;
    beads += `M${w1(32 + Math.cos(a) * 17.4)} ${w1(32 + Math.sin(a) * 17.4)} ` +
      `m-${dot} 0 a${dot} ${dot} 0 1 0 ${dot * 2} 0 a${dot} ${dot} 0 1 0 ${-dot * 2} 0 `;
  }

  // Pinhole bubbles, in the lip band between die and outline (r=20 to the blob edge, so
  // ~21 is always safely inside wax and always outside the die).
  const holes = [];
  for (let i = 0, n = 2 + Math.floor(rnd() * 3); i < n; i++) {
    const a = rnd() * Math.PI * 2, r = 20.9 + rnd() * 0.9;
    holes.push([w1(32 + Math.cos(a) * r), w1(32 + Math.sin(a) * r), w1(0.45 + rnd() * 0.25)]);
  }

  // Squeeze marks: the little creases where wax was pressed out past the die. Hung off real
  // anchors at 0.87 of their radius, so they can never drift outside a shallow lobe.
  const nicks = [];
  for (let i = 0, n = 1 + Math.floor(rnd() * 3); i < n; i++) {
    const [, , a, r] = pts[Math.floor(rnd() * lobes)];
    const rr = r * 0.87;
    const dir = rnd() < 0.5 ? -1 : 1;
    nicks.push(`M${w1(32 + Math.cos(a) * rr)} ${w1(32 + Math.sin(a) * rr)} ` +
      `q${w1(dir * (1.0 + rnd() * 0.6))} ${w1(0.9 + rnd() * 0.5)} ${w1(dir * (0.6 + rnd() * 0.5))} ${w1(2.2 + rnd() * 0.8)}`);
  }

  // Sheen stays in the upper-left because the relief lighting does (azimuth 235), with the
  // faint bounce opposite it. Only the shape and placing wander; moving a highlight to
  // another quadrant would just read as a lighting bug across the set.
  const sheen = {
    x: w1(20 + rnd() * 3), y: w1(16.4 + rnd() * 2.4), rx: w1(11.5 + rnd() * 2.6),
    ry: w1(7 + rnd() * 1.8), rot: w1(-38 + rnd() * 16),
    x2: w1(42.5 + rnd() * 3), y2: w1(46.5 + rnd() * 3), rx2: w1(9 + rnd() * 2.4),
    ry2: w1(4.8 + rnd() * 1.6), rot2: w1(-33 + rnd() * 16),
  };

  return {
    blob, segs, beads: beads.trim(), holes, nicks, sheen,
    warp: 1 + Math.floor(rnd() * 90), grain: 1 + Math.floor(rnd() * 90),
    freq: w1(0.095 + rnd() * 0.035) , scale: w1(1.8 + rnd() * 0.8),
  };
}

/* The generator has one characteristic fault worth flagging, and it is worth being precise
   about what it is, because the first guess was wrong.

   Both pours rejected in the first 33-seal review (Title...? on seed 10, Both Of Us on 28)
   looked like stamped metal tokens rather than poured wax: straight runs of edge meeting at
   corners. The obvious explanations did not survive measurement. Neither had a thin lip of
   wax past the die — at 3.9 and 3.5 units both were roomier than the thinnest KEPT seal at
   3.1 — and per-segment chord deflection ranked one of them mid-pack among the seals that
   passed. Whatever the eye was objecting to, it was not either of those.

   What does separate them is where the curvature SITS. On a convincing pour it is spread
   fairly evenly around the outline; on a token it is concentrated into a few corners with
   near-straight edge between. Sampling the outline and taking peak turn-per-unit-length over
   mean turn-per-unit-length scores the two rejects at 5.18 and 4.67, against a ceiling of
   4.19 across the 31 that were kept — a clean split with room either side.

   WAX_KINK_MAX sits in that gap. Over 2000 random pours it flags 4.3%, close to the 2-in-33
   rejected by eye, so it should stay a rare nudge rather than constant noise. Re-measure
   before touching it: the score is sensitive to the sampling rate below, and an earlier
   threshold picked against a finer sampler let one of the two known-bad pours through.
   Advisory only: nothing refuses to render, because a rejection loop inside waxPour would
   silently re-pour seals that are already locked and approved. */
const WAX_KINK_MAX = 4.4;

function waxPourFaults(seed) {
  const { segs } = waxPour(seed);
  // Walk the outline as one polyline, ~24 samples per cubic.
  const pts = [];
  for (const [p0, c1, c2, p3] of segs) {
    for (let i = 0; i < 24; i++) {
      const t = i / 24, u = 1 - t;
      pts.push([
        u * u * u * p0[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * p3[0],
        u * u * u * p0[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * p3[1],
      ]);
    }
  }
  const n = pts.length;
  let sum = 0, peak = 0, lip = Infinity;
  for (let i = 0; i < n; i++) {
    const a = pts[(i - 1 + n) % n], b = pts[i], c = pts[(i + 1) % n];
    const v1x = b[0] - a[0], v1y = b[1] - a[1], v2x = c[0] - b[0], v2y = c[1] - b[1];
    const l1 = Math.hypot(v1x, v1y) || 1e-9, l2 = Math.hypot(v2x, v2y) || 1e-9;
    // turn angle per unit length — discrete curvature
    const k = Math.abs(Math.atan2(v1x * v2y - v1y * v2x, v1x * v2x + v1y * v2y)) / ((l1 + l2) / 2);
    sum += k;
    if (k > peak) peak = k;
    lip = Math.min(lip, Math.hypot(b[0] - 32, b[1] - 32) - 20);
  }
  const kink = peak / (sum / n);
  return {
    kink: Math.round(kink * 100) / 100,
    lip: Math.round(lip * 100) / 100,   // reported for context; WAX_R_MIN already guards it
    kinked: kink > WAX_KINK_MAX,
  };
}

// The shared wax recipe. `id` scopes the SVG's internal ids so several seals can
// coexist in one document; the motif is stamped three times (shadow, highlight, face)
// to sit in raised relief on the die. `seed` overrides the motif's locked pour, which is
// what lets the dev gallery audition alternates without editing this file.
function waxSealSvg(id, motif, seed) {
  const p = `wax-${id}`;
  const w = waxPour(seed == null ? waxSeedOf(id, motif) : seed);
  return `<svg viewBox="-2 -2 68 68" aria-hidden="true">
    <defs>
      <path id="${p}-blob" d="${w.blob}"/>
      <path id="${p}-m" d="${motif.d}" fill-rule="${motif.fr || "nonzero"}"/>
      <path id="${p}-beads" d="${w.beads}"/>
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
        <feTurbulence type="fractalNoise" baseFrequency="${w.freq}" numOctaves="3" seed="${w.warp}" result="warp"/>
        <feDisplacementMap in="SourceGraphic" in2="warp" scale="${w.scale}" xChannelSelector="R" yChannelSelector="G" result="disp"/>
        <feTurbulence type="fractalNoise" baseFrequency="0.45" numOctaves="3" seed="${w.grain}" result="grain"/>
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
        <ellipse cx="${w.sheen.x}" cy="${w.sheen.y}" rx="${w.sheen.rx}" ry="${w.sheen.ry}" transform="rotate(${w.sheen.rot} ${w.sheen.x} ${w.sheen.y})" fill="rgba(255,216,198,0.17)" filter="url(#${p}-b18)"/>
        <ellipse cx="${w.sheen.x2}" cy="${w.sheen.y2}" rx="${w.sheen.rx2}" ry="${w.sheen.ry2}" transform="rotate(${w.sheen.rot2} ${w.sheen.x2} ${w.sheen.y2})" fill="rgba(255,190,170,0.06)" filter="url(#${p}-b18)"/>
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
      <g fill="rgba(56,7,10,0.45)">${w.holes.map((h) => `<circle cx="${h[0]}" cy="${h[1]}" r="${h[2]}"/>`).join("")}</g>
      <g fill="rgba(252,198,182,0.5)">${w.holes.map((h) => `<circle cx="${w1(h[0] - 0.2)}" cy="${w1(h[1] - 0.3)}" r="${w1(h[2] * 0.37)}"/>`).join("")}</g>
      ${w.nicks.map((d) => `<path d="${d}" fill="none" stroke="rgba(70,10,14,0.35)" stroke-width="0.9" stroke-linecap="round"/>`).join("")}
    </g>
  </svg>`;
}

export const CHALLENGE_SEALS = Object.fromEntries(
  Object.keys(WAX_SEAL_MOTIFS).map((id) => [id, waxSealSvg(id, WAX_SEAL_MOTIFS[id])])
);
// For the dev panel's seal gallery: the seed each seal is currently pouring from, which of
// them are auto (never reviewed, still free to change) and a re-pour at an arbitrary seed, so
// alternates can be auditioned in the browser before a `wax` value is locked into the table.
export const WAX_SEEDS = Object.fromEntries(
  Object.entries(WAX_SEAL_MOTIFS).map(([id, m]) => [id, waxSeedOf(id, m)])
);
export const WAX_AUTO_IDS = Object.keys(WAX_SEAL_MOTIFS).filter((id) => !WAX_SEAL_MOTIFS[id].wax);
export { waxPourFaults };
export function reseedSeal(id, seed) {
  const m = WAX_SEAL_MOTIFS[id];
  return m ? waxSealSvg(id, m, seed) : "";
}
/* Charm names are LYRIC FRAGMENTS, not song titles: every name below is a real contiguous
   phrase in songs.json, so reading the collection rewards knowing the words rather than the
   tracklist. A handful of titles survive because the title IS the joke and no fragment beats
   it: Fearless and its (Taylor's Version) pair, Who's Afraid Of Little Old Me?, Two Is Better
   Than One, Is It Over Now?, The Lucky One. Several of those are sung lines anyway. New charms
   follow the fragment rule; keep the phrase to two or three words where you can, and check it
   against the catalogue before you use it. Names describe flavour and are free to change. Ids
   describe the feat in lowercase kebab-case, are derived from desc, and are permanent storage
   keys. Change an existing id only through an appended ACH_ID_MIGRATIONS row.

   `tier` is how hard the feat is, and it is AUTHORED, not measured: one player and no
   telemetry means a "rarest 2%" figure would be a number we made up. Three bands, and the
   tile draws each as a material rather than as motion or as a fourth colour (--bead is the
   theme group's and stays the theme group's):
     absent — pencil. The floor: one-sitting feats, counters, and the odd secret you trip
              over. It gets no decoration at all, because a tier system that dresses up its
              floor has no floor.
     2      — punched. Needs more than one sitting, OR is a peak single-run performance that
              is not the top of its own ladder.
     3      — struck. The top of a ladder (no strictly harder version of the same feat exists
              in the roster) or a commitment measured in weeks. Keep this band small; every
              entry added to it makes the ones already there worth less.
   `tier` is NOT `sitting`. `sitting` asks "could this be closed right now, in one go" for the
   one-sitting plate and excludes secrets; tier asks how heavy the feat is and rates secrets
   alongside everything else. A charm is often absent from both, and that is not a mistake.
   When two charms are the same feat at different depths (recall 10 / 50 / 100 / 1,000 lines),
   only the last one is struck. */
export const ACHIEVEMENTS = [
  { id: "first-game-finished",        name: "The Very First Page", desc: "Finish your first game",              secret: false, icon: "wand", sitting: true, earn: { cat: "difficulty" } },
  { id: "perfect-13",       name: "All By Design",    desc: "Score a perfect 13/13",               secret: false, icon: "queen", sitting: true, earn: { cat: "difficulty" } },
  { id: "finish-with-no-timeouts",         name: "Fearless",         desc: "Finish with no timeouts",             secret: false, icon: "dress", sitting: true, earn: { cat: "difficulty" } },
  { id: "answer-under-2s",        name: "Don't Wait",       desc: "Answer correctly in under 2s",        secret: false, icon: "speech", sitting: true, earn: { cat: "difficulty" } },
  { id: "play-5-games",      name: "Watched It Begin Again", desc: "Play 5 games",                        secret: false, icon: "tally" },
  { id: "answer-under-1s-left",      name: "The Great Escape", desc: "Answer correctly with under 1s left", secret: true,  icon: "car" },
  { id: "streak-5",        name: "I Polish Up Nice", desc: "Hit a 5-in-a-row streak",             secret: false, icon: "strand", sitting: true, earn: { cat: "difficulty" } },
  { id: "finish-on-5-streak-after-miss", name: "Climbed Right Back Up", desc: "Come back to finish on a 5+ streak",  secret: true,  icon: "scribbleline" },
  { id: "first-daily-finished", name: "Today Was A Fairytale", desc: "Finish your first Daily Challenge", secret: false, icon: "coach", sitting: true, earn: { cat: "daily" } },
  { id: "finish-lyricist-game",     name: "I Remember It All", desc: "Finish a full Lyricist game",          secret: false, icon: "scarf", sitting: true, earn: { cat: "difficulty", diff: "lyricist" } },
  { id: "score-12", name: "Crestfallen On The Landing", desc: "Finish one shy (12/13)",            secret: true,  icon: "flute" },
  { id: "score-zero",        name: "I'm The Problem",  desc: "Score 0/13",                          secret: true,  icon: "mirror" },
  { id: "play-all-three-game-types",   name: "Hits Different",   desc: "Play all three game types",           secret: false, icon: "shapes", sitting: true },
  { id: "play-15-games",          name: "When You're Fifteen", desc: "Play 15 games",                       tier: 2, secret: false, icon: "locker" },
  { id: "recall-5-lyric-lines-one-game", name: "You Knew The Line", desc: "Recall 5 lyric lines in one game",  secret: false, icon: "note", sitting: true, earn: { cat: "difficulty", diff: "lyricist" } },
  { id: "survive-20-rounds-infinite", name: "In The Clear Yet?", desc: "Survive 20+ rounds in Infinite",      secret: false, icon: "pines", sitting: true, earn: { cat: "infinite" } },
  { id: "reach-round-22-infinite",       name: "Feelin' Twenty-Two", desc: "Reach exactly round 22 in Infinite",  secret: false, icon: "balloons", sitting: true, earn: { cat: "infinite" } },
  { id: "reach-round-89-infinite", name: "1989",         desc: "Reach round 89 in Infinite",          tier: 2, secret: false, icon: "skyline", sitting: true, earn: { cat: "infinite" } },
  { id: "streak-10",       name: "The Lights Go Wild", desc: "Hit a 10-in-a-row streak",            tier: 2, secret: false, icon: "sparkler", sitting: true, earn: { cat: "difficulty" } },
  { id: "win-ultra-10-correct",        name: "We Survived",      desc: "Win an Ultra game (10+ correct)",     tier: 2, secret: false, icon: "poppy", sitting: true, earn: { cat: "difficulty", diff: "ultra" } },
  { id: "perfect-13-hard",        name: "Mountains We Moved", desc: "Perfect 13/13 on Hard or Ultra",      tier: 2, secret: false, icon: "coronet", sitting: true, earn: { cat: "difficulty", diff: "hard" } },
  // The two hardest single runs the game can ask for, and the top of their own ladders: Mountains We
  // Moved takes either of the top two difficulties, I Remember It All only asks you to FINISH a
  // Lyricist game. These stay unearned long after the rest of the collection is closed.
  { id: "perfect-13-ultra",      name: "Who’s Afraid Of Little Old Me?", desc: "Perfect 13/13 on Ultra", tier: 3, secret: false, icon: "cage", sitting: true, earn: { cat: "difficulty", diff: "ultra" } },
  { id: "perfect-13-lyricist",         name: "Alive In My Head", desc: "Perfect 13/13 in Lyricist",           tier: 3, secret: false, icon: "cameo", sitting: true, earn: { cat: "difficulty", diff: "lyricist" } },
  { id: "round-1-under-2s",     name: "Let The Games Begin", desc: "Nail round 1 in under 2s",            secret: false, icon: "rocket", sitting: true, earn: { cat: "difficulty" } },
  { id: "answer-under-half-second-left", name: "It Just Felt So Good", desc: "Answer right with under 0.5s left", secret: true, icon: "match" },
  { id: "streak-3-same-album",       name: "Time To Branch Out?", desc: "3 correct in a row from one album", secret: true, icon: "branch" },
  { id: "score-nearly-every-studio-album-one-game",        name: "The Eras Tour",    desc: "Score from nearly every studio album in one game", tier: 2, secret: false, icon: "ticket", sitting: true, earn: { cat: "difficulty" } },
  { id: "perfect-daily",         name: "Golden Like Daylight", desc: "Score a perfect Daily",               tier: 2, secret: false, icon: "sunrise", sitting: true, earn: { cat: "daily" } },
  { id: "daily-streak-7",      name: "Next Chapter",     desc: "Keep a 7-day Daily streak",           tier: 2, secret: false, icon: "openbook" },
  { id: "daily-streak-30",         name: "Ever And Evermore", desc: "Reach a 30-day Daily streak",         tier: 3, secret: false, icon: "oak" },
  { id: "earn-13-achievements",            name: "Coming Back Around", desc: "Earn 13 achievements",                tier: 2, secret: false, icon: "cat" },
  { id: "play-between-midnight-and-1am",        name: "Midnights Become My Afternoons", desc: "Play between 12 and 1am",             secret: true,  icon: "clock" },
  { id: "recover-after-miss-3-times-one-game",     name: "I Keep Cruisin'",  desc: "Bounce back from a miss 3× in one game", secret: false, icon: "bounce", sitting: true, earn: { cat: "difficulty" } },
  { id: "finish-without-timer-red-zone",            name: "I Kept Calm",      desc: "Finish a game without the timer hitting the red",  secret: false, icon: "dove", sitting: true, earn: { cat: "difficulty" } },
  { id: "average-under-3s-per-answer",    name: "Perfect Storm",    desc: "Average under 3s per answer in a game", secret: false, icon: "storm", sitting: true, earn: { cat: "difficulty" } },
  { id: "answer-cardigan-betty-august-one-game",     name: "The Triangle",     desc: "Answer cardigan, betty and august in one game", secret: true, icon: "trihearts" },
  { id: "streak-3-b-titles", name: "My Mind Is Alive", desc: "3 correct in a row (titles starting with B)", secret: true, icon: "bee" },
  { id: "lose-3-lives-first-4-rounds",     name: "Summer's A Knife", desc: "Lose all 3 lives in the first 4 rounds", secret: true, icon: "lolly" },
  { id: "finish-with-no-answers",   name: "I Can't See You",  desc: "Finish a game without answering once", secret: true, icon: "blindfold" },
  { id: "miss-1000-rounds-lifetime",    name: "A Thousand Cuts",          desc: "1,000 lifetime missed rounds", tier: 2, secret: true, icon: "scissors" },
  { id: "reach-round-13-infinite-from-scratch",      name: "Where We Stood",   desc: "Reach round 13 from scratch in Infinite", secret: false, icon: "summit", sitting: true, earn: { cat: "infinite" } },
  { id: "answer-if-this-was-a-movie",      name: "Spicy Drama",      desc: "Answer with \"If This Was A Movie\" — Fearless or Speak Now? Fans still argue", secret: true, icon: "clapper" },
  { id: "recall-lyric-line-word-perfect",    name: "Word For Word",    desc: "Recall a lyric line word-perfect",     secret: false, icon: "quote", sitting: true, earn: { cat: "difficulty", diff: "lyricist" } },
  { id: "open-settings-menu", name: "I Look In People's Windows", desc: "Open the settings menu",      secret: true,  icon: "window" },
  { id: "watch-snow-fall",   name: "Snow On The Page",    desc: "Watch the snow fall",                   secret: true,  icon: "palm" },
  { id: "keep-page-company-past-midnight",       name: "Midnights Like This", desc: "Keep the page company past midnight",    secret: true,  icon: "nightrain" },
  { id: "watch-autumn-leaves-fall", name: "Autumn Leaves Falling", desc: "Watch the autumn leaves fall on the page", secret: true, icon: "leaf" },
  /* The scarf doodle is the one drawing you can touch, and its tally is lifetime rather than
     per-run: it only turns up on a roll in one branch of the margin-doodle chain, so thirteen
     taps in a single game would be luck rather than a feat. Counted in METRICS_KEY. */
  { id: "tap-scarf-doodle-13-times", name: "You Keep My Old Scarf", desc: "Tap the scarf doodle 13 times", secret: true, icon: "scarftap" },
  /* The other drawings you can touch: the little inked mark beside every inside page's title
     (see PAGE_MARK_KINDS). Lifetime and set-shaped — ten distinct marks, in any order, across
     any number of sittings. Nothing invites the tap and the cursor never changes, so this one
     is found by fidgeting; the mark jumps when you press it so at least the fidgeting answers. */
  { id: "tap-every-page-mark", name: "Marked Every Page", desc: "Poke the little mark beside every page's title", secret: true, icon: "manicule" },
  /* The third touchable thing, and the only one that isn't on the page at all: the mug that has
     been sitting on this desk since the first screen. A thousand taps is deliberately absurd,
     and what makes it findable is that the crema answers from the very first one, resolving a
     little further toward a poured treble clef with every tap, so the reward is visible long
     before it is finished. Counted in METRICS_KEY; the pour is redrawn from that count on
     every load, so it survives a reload and stays on the desk forever after. */
  { id: "tap-desk-mug-1000-times", name: "The Thousandth Cup", desc: "Tap the coffee on the desk 1,000 times", tier: 2, secret: true, icon: "placeholder" },
  { id: "play-easy-3-times-in-row",   name: "Safe & Sound",     desc: "Play Easy three times in a row",       secret: false, icon: "lantern", sitting: true, earn: { cat: "difficulty", diff: "easy" } },
  { id: "beat-personal-best-score",          name: "R-E-V-E-N-G-E",    desc: "Beat your own best score on any board", secret: false, icon: "megaphone", sitting: true, earn: { cat: "difficulty" } },
  { id: "perfect-13-every-mode",       name: "Every Version Of Yourself", desc: "Score a perfect 13/13 in every difficulty", tier: 3, secret: false, icon: "mirrorball" },
  { id: "streak-3-rare-words-no-ultra",         name: "Diamonds Are Forever", desc: "3 rare words right in a row (no Ultra)", secret: false, icon: "diamond", sitting: true, earn: { cat: "difficulty" } },
  { id: "win-fuzzy-lyric-match",        name: "Wordsmith",        desc: "Win a round on a fuzzy lyric match",    secret: false, icon: "anvil", sitting: true, earn: { cat: "difficulty", diff: "lyricist" } },
  { id: "recall-10-lyric-lines-word-perfect",     name: "I've Got You Down", desc: "Recall 10 lyric lines word-perfect",   tier: 2, secret: false, icon: "pencil" },
  { id: "recall-50-lyric-lines-word-perfect",         name: "I Know You By Heart", desc: "Recall 50 lyric lines word-perfect", tier: 2, secret: false, icon: "locket" },
  { id: "recall-100-lyric-lines-word-perfect",    name: "You Don't Even Know Where I Start", desc: "Recall 100 lyric lines word-perfect", tier: 2, secret: false, icon: "spiral" },
  { id: "recall-1000-lyric-lines-word-perfect",    name: "…Clearly You Were Ready For It?", desc: "Recall 1,000 lyric lines word-perfect", tier: 3, secret: false, icon: "trophy" },
  { id: "recall-whole-verse-word-perfect",     name: "Overachiever",     desc: "Recall a whole verse (four lines word-perfect)", tier: 2, secret: false, icon: "aplus", sitting: true, earn: { cat: "difficulty", diff: "lyricist" } },
  { id: "answer-3-rounds-same-song",         name: "Someone Has A Favourite Song", desc: "Answer three rounds with lyrics from the same song", secret: true, icon: "repeat" },
  { id: "make-10-fuzzy-matches-one-lyricist-game",      name: "Eyes Closed",      desc: "10 fuzzy lyric matches in one Lyricist game", secret: false, icon: "eyeclosed", sitting: true, earn: { cat: "difficulty", diff: "lyricist" } },
  { id: "answer-paris-for-somewhere",            name: "We Were Somewhere Else", desc: "Answer “Paris” when the word is “somewhere”", secret: true, icon: "tower" },
  { id: "answer-every-catalogue-song",   name: "I Knew Everything", desc: "Answer every song in the catalogue at least once", tier: 3, secret: false, icon: "checklist" },
  { id: "answer-nemesis-word",             name: "The Cycle Ends",   desc: "Finally answer your nemesis word right", tier: 2, secret: true, icon: "banjo" },
  { id: "answer-rain-on-monday",   name: "It's Raining And It's Monday", desc: "Answer “rain” correctly on a Monday", secret: true, icon: "umbrella" },
  { id: "win-with-no-hints-or-timeouts",            name: "Finally Clean",    desc: "Win without hints or a single timeout",  secret: false, icon: "drop", sitting: true, earn: { cat: "difficulty" } },
  { id: "win-every-difficulty", name: "Everything & Nothing All At Once", desc: "Win a game in every difficulty", tier: 2, secret: false, icon: "yinyang" },
  { id: "finish-no-timeouts-2-games-in-row",      name: "Fearless (Taylor's Version)", desc: "Two games in a row with no timeouts", tier: 2, secret: false, icon: "vinyl", sitting: true, earn: { cat: "difficulty" } },
  { id: "play-every-required-mode",         name: "Explorer",         desc: "Play every difficulty in Classic and in both Infinite variants, plus Custom", tier: 2, secret: false, icon: "compass" },
  { id: "play-all-seven-weekdays",            name: "Seven",            desc: "Play on all seven days of the week", tier: 2, secret: true,  icon: "swing" },
  { id: "save-first-bracelet-keepsake", name: "Make The Friendship Bracelets", desc: "Save your first bracelet keepsake", secret: false, icon: "keepsake", sitting: true },
  { id: "type-reputation-tv", name: "The Piano Was Hissing", desc: "Type “reputation tv” somewhere",    secret: true,  icon: "piano" },
  { id: "quit-round-1-before-typing",       name: "She Must Bolt",    desc: "Quit before typing anything in round 1", secret: true,  icon: "door" },
  { id: "give-up-after-12-before-13",       name: "No Closure",       desc: "Give up after 12, never answer the 13th", secret: true, icon: "unclasped" },
  /* ---- Run-scoped charms: how the thirteen pages were played ----
     None of these read a stored counter. They are judged off the run's own arrays — the
     per-page stopwatch (roundTimes) and the log of submissions that never resolved a page
     (roundRejects) — so every one of them is winnable again on the very next game and none
     can be missed by having already passed some milestone. The end-of-run half all demand a
     FULL thirteen pages, and the mid-run half unlock the moment they happen. */
  { id: "answer-all-13-rounds-under-3s", name: "Faster Than The Wind", desc: "Answer all 13 rounds in under 3s each", tier: 2, secret: false, icon: "gustpage", sitting: true, earn: { cat: "difficulty" } },
  // Easy and Relaxed only, and that is the charm rather than a limitation of it: Normal's
  // clock is 10s, so "every answer over 10 seconds" cannot happen there, and Hard and Ultra
  // are shorter still. Sitting on a page you have already solved is the whole feat.
  { id: "win-with-every-answer-over-10s", name: "Slow Motion", desc: "Win with every answer over 10s (Easy or Relaxed)", secret: true, icon: "dwell" },
  { id: "answer-in-final-second-all-13-rounds", name: "I Take My Time", desc: "Answer in the final second on all 13 rounds", tier: 2, secret: true, icon: "lasttick" },
  { id: "answer-under-1s-three-rounds-running", name: "Just Like That", desc: "Answer in under a second three rounds running", secret: false, icon: "snapthree", sitting: true, earn: { cat: "difficulty" } },
  { id: "perfect-13-every-answer-under-2s", name: "You Are The Best Thing", desc: "Perfect 13/13 with every answer under 2s", tier: 2, secret: false, icon: "blurstar", sitting: true, earn: { cat: "difficulty" } },
  { id: "win-without-clock-dropping-below-half", name: "The Whole Way Home", desc: "Win without the clock dropping below half", tier: 2, secret: false, icon: "halfdial", sitting: true, earn: { cat: "difficulty" } },
  { id: "perfect-13-no-wrong-submissions", name: "One For The Money", desc: "Perfect 13/13 with no wrong submissions", tier: 2, secret: false, icon: "cleanpage", sitting: true, earn: { cat: "difficulty" } },
  { id: "submit-same-wrong-answer-5-times-one-round", name: "I Once Was Poison Ivy", desc: "Submit the same wrong answer 5 times in one round", secret: true, icon: "ivyword" },
  { id: "answer-right-with-song-given-wrongly-earlier", name: "Lost In Translation", desc: "Answer right with a song you gave wrongly earlier", secret: true, icon: "rightsong" },
  { id: "answer-13-wrong-having-typed-every-round", name: "I Was Wrong", desc: "Answer 13 wrong, having typed something every round", secret: true, icon: "everycrossed" },
  { id: "time-out-with-right-answer-typed", name: "The Words I Held Back", desc: "Run out of time with the right answer typed", secret: true, icon: "unsentword" },
  { id: "type-nothing-until-2s-left-then-answer-right", name: "Holding My Breath", desc: "Type nothing until under 2s left, then answer right", secret: true, icon: "heldbreath" },
  { id: "take-first-suggestion-all-13-rounds", name: "Took The Money", desc: "Take the first suggestion on all 13 rounds", secret: true, icon: "topofthelist" },
  /* ---- The free charms of the Core batch: readings, not new state ----
     Every one of these is a read against something the notebook already keeps — the lifetime
     per-word tally, the run history, the metrics record, the calendar ledger, or the run's own
     arrays. Nothing here adds a stored field, and nothing here can be locked out: each is a
     standing condition that comes round again rather than a window that closes. The secret
     ones join HIDDEN_ACH_IDS in the batch's secrecy phase, which is a deliberate edit of its
     own. */
  { id: "perfect-13-all-one-album", name: "This Is Our Place", desc: "Score 13/13 all from one album", tier: 2, secret: false, icon: "onesleeve", sitting: true, earn: { cat: "difficulty" } },
  /* The nemesis thread. The tally is folded once per finished game, so a word missed three
     times in one run counts once — which is exactly what "three separate games" wants. */
  { id: "answer-word-missed-in-earlier-game", name: "The Moment I Knew", desc: "Answer a word you missed in an earlier game", secret: false, icon: "wordreturned", sitting: true, earn: { cat: "difficulty" } },
  { id: "miss-same-word-in-3-games", name: "Haunted", desc: "Miss the same word in 3 separate games", tier: 2, secret: true, icon: "ghost" },
  // The lower rung of a two-step ladder with The Cycle Ends: this one asks only that the word
  // you have missed MOST has finally fallen, where The Cycle Ends holds out for a word that
  // has beaten you MEAN_GRUDGE times first.
  { id: "answer-most-missed-word", name: "I Just Know", desc: "Finally crack your most-missed word", tier: 2, secret: false, icon: "crackedword" },
  { id: "be-dealt-every-prompt-word", name: "You Learn My Secrets", desc: "Be dealt every prompt word in the game", tier: 3, secret: false, icon: "wordscroll" },
  /* Charms judged against the runs BEFORE this one. "In a row" means among runs of the same
     game type: the sandboxed types are invisible to them, neither extending nor breaking a
     chain, which is the rule noTimeoutStreak already set for a cross-run counter. */
  { id: "score-zero-then-perfect-13-next-game", name: "What Died Didn't Stay Dead", desc: "Score 0/13, then 13/13 the next game", secret: true, icon: "relit" },
  { id: "perfect-13-two-games-in-row", name: "Two For The Show", desc: "Score two perfect 13/13 games in a row", tier: 2, secret: false, icon: "twostars", sitting: true, earn: { cat: "difficulty" } },
  { id: "same-final-score-3-games-in-row", name: "It's All The Same", desc: "Finish on the same score three games running", tier: 2, secret: true, icon: "samescore" },
  /* The long haul. The three dated ones read the calendar ledger rather than the run history,
     which is capped — see DATES_KEY. None of these carry `sitting`, and neither does I Just
     Know or You Learn My Secrets: the goal card only ever pins what an evening could actually
     close, and a charm measured in months or in a word you cannot ask to be dealt would sit
     there as a reproach rather than a destination. */
  { id: "play-7-days-in-row", name: "Running Like Water", desc: "Play seven days in a row", tier: 2, secret: false, icon: "sevendays" },
  { id: "play-on-13-different-days", name: "I'm Thirteen Now", desc: "Play on 13 different days", tier: 2, secret: false, icon: "thirteendays" },
  { id: "play-in-every-month", name: "Brave The Seasons", desc: "Play in all twelve months of the year", tier: 3, secret: false, icon: "twelvemonths" },
  { id: "answer-500-rounds-correct-lifetime", name: "The Rest Is History", desc: "Answer 500 rounds correctly, lifetime", tier: 2, secret: false, icon: "pagestack" },
  { id: "play-1989-rounds-lifetime", name: "A Thousand Memories", desc: "Play 1,989 rounds in total", tier: 3, secret: false, icon: "ledger" },
  { id: "play-89-games", name: "I Was Born In 19—", desc: "Play 89 games", tier: 2, secret: false, icon: "pegged" },
  /* The streak that outlives the run it started in — fifty correct answers with the game
     boundaries counting for nothing. Only the game types the cross-game counter can see
     extend it (see crossGameStreakCounts), and the sandboxed ones can neither feed it nor
     snap it. Counted in METRICS_KEY, per answer rather than per run. */
  { id: "answer-50-correct-in-a-row-across-games", name: "The Walls We Crashed Through", desc: "Answer 50 in a row correctly, across as many games as it takes", tier: 3, secret: false, icon: "brokenwall" },
  /* Answered with the same song more than once. Distinct from Someone Has A Favourite Song,
     which counts sung LINES from one song; these count the credited answer however it arrived. */
  { id: "answer-same-song-twice-in-row", name: "Over And Over", desc: "Answer with the same song twice in a row", secret: true, icon: "twinsleeve" },
  { id: "answer-same-song-3-times-one-game", name: "Here We Go Again", desc: "Answer with the same song 3 times in one game", secret: true, icon: "triplesleeve" },
  { id: "miss-round-after-every-hint", name: "Bullet Holes", desc: "Burn every hint in a round and still miss it", secret: true, icon: "hintsburnt" },
  // Read off the RAW line, before the matcher lowercases it — which it does very early.
  { id: "submit-answer-in-all-caps", name: "JE SUIS CALME", desc: "Submit an answer in full caps", secret: true, icon: "shoutcaps" },
  { id: "submit-prompt-word-as-answer", name: "A Crook Who Was Caught", desc: "Submit the prompt word itself as your answer", secret: true, icon: "caughtout" },
  // Fires on the soft-reject itself (rejectOffLimits), so it catches every path a title pick
  // can arrive by — dropdown, Enter, exact-title — not just a clean typed submission.
  { id: "submit-title-answer-off-limits", name: "It's Me, Hi", desc: "Try an answer with the word right there in the title, on a mode that won't allow it", secret: true, icon: "hellotag" },
  /* The dated ones. "august" is the folklore song, not a prompt word — there is no "august"
     in words.json, so the song title is the only reading of this that can ever fire. */
  { id: "answer-august-in-august", name: "August Slipped Away", desc: "Answer with “august” in the month of August", secret: true, icon: "tornmonth" },
  { id: "score-7-on-the-7th", name: "I Hit My Peak At Seven", desc: "Score exactly 7/13 on the 7th of a month", secret: true, icon: "sevenseven" },
  { id: "play-whole-game-in-3am-hour", name: "3 AM And I'm Still Awake", desc: "Play a whole game between 3am and 4am", secret: true, icon: "nightlamp" },
  { id: "play-at-1313-on-the-13th", name: "A Wrinkle In Time", desc: "Play at 13:13 on the 13th", secret: true, icon: "wrinkletime" },
  // The date comes off TS_MILESTONES, which already knows her birthday — see the dated
  // marginalia. Hardcoding 13 December a second time is how the two drift apart.
  { id: "play-on-taylors-birthday", name: "Happy Birthday To You", desc: "Play on Taylor's birthday", secret: true, icon: "cakeslice" },
  // Self-referential, so it is evaluated after every unlock alongside the other meta charms,
  // and its price moves whenever a theme is added to ACH_GROUPS.
  { id: "earn-charm-in-every-theme", name: "The Things That I Love", desc: "Earn a charm in every theme", tier: 3, secret: false, icon: "fullbracelet" },
  { id: "play-word-from-searcher", name: "You Drew Stars", desc: "Play a word straight from the lyric searcher", secret: true, icon: "lenstoline" },
  /* ---- The whole notebook: the Core theme's own batch (2026-08-13) ----
     Core stopped meaning anything when the four-way split carved Perfect, Clock, Misfires and
     The long haul out of it and left eleven charms behind as residue. This batch is what Core
     is FOR, written down: breadth across the shelf, and the collection talking about itself.
     Nothing here is about how one mode plays — that is what every other theme is for — and
     nothing here is mode-flavoured enough to be repatriated later.

     None can be locked out. The two ledgers they read (SHELF_TYPES and the dice counter) only
     ever grow, the day-scoped one comes round again every day, and the meta rungs are
     re-evaluated after every unlock. */
  { id: "finish-run-in-5-game-types", name: "On Every Corner", desc: "Finish a run in five different game types", tier: 2, secret: false, icon: "signpost" },
  { id: "finish-run-in-every-game-type", name: "I Can Go Anywhere", desc: "Finish a run in every game type", tier: 3, secret: false, icon: "suitcase" },
  // The only one of the three scoped to a sitting rather than a lifetime, which is why it is
  // the only one of the three worth pinning as a goal.
  { id: "finish-3-game-types-one-day", name: "Every Single Day", desc: "Finish runs in three different game types in one day", secret: false, icon: "daysheet", sitting: true },
  /* The dice. The randomiser has never earned a single charm despite being the one launcher
     that can open every door in the notebook, which is exactly the breadth Core is about. Two
     halves of one line, for the two rungs. */
  { id: "play-first-dice-pick", name: "Devils Roll The Dice", desc: "Play a run the dice picked for you", secret: false, icon: "diecast", sitting: true },
  { id: "play-13-dice-picks", name: "Angels Roll Their Eyes", desc: "Play 13 runs the dice picked for you", tier: 2, secret: false, icon: "dicehalo" },
  /* The collection talking about itself. Self-referential like the four meta charms already
     here, so they are evaluated after every unlock and their price moves on its own as the
     roster grows — which is the honest behaviour for a charm whose subject IS the roster. */
  { id: "earn-40-achievements", name: "Still Bejeweled", desc: "Earn 40 achievements", tier: 2, secret: false, icon: "jewelring" },
  { id: "earn-80-achievements", name: "A String Of Lights", desc: "Earn 80 achievements", tier: 3, secret: false, icon: "fairylights" },
  // A whole theme, not a charm from each — the rung above The Things That I Love rather than a
  // second reading of it. The smallest themes run to three charms, so this is real but not a wall.
  { id: "complete-one-charm-theme", name: "One Single Thread Of Gold", desc: "Earn every charm in one theme", tier: 2, secret: false, icon: "goldspool" },
  { id: "complete-three-charm-themes", name: "We Gather Stones", desc: "Earn every charm in three themes", tier: 3, secret: false, icon: "cairn" },
  // Not "All At Once", which is the obvious name and sits one row from Everything & Nothing All
  // At Once on this very page. Three Times is the same line's other half of the idea and reads
  // as its own charm.
  { id: "earn-3-achievements-one-run", name: "Three Times", desc: "Earn three charms in a single run", secret: false, icon: "threecharms", sitting: true, earn: { cat: "difficulty" } },
  { id: "defeat-first-challenge",       name: "Ready For Combat", desc: "Defeat your first challenge",           secret: false, icon: "bow", sitting: true, earn: { cat: "challenge" } },
  { id: "defeat-every-challenge",      name: "Get The Crown",    desc: "Defeat every challenge",                tier: 3, secret: false, icon: "bigcrown" },
  { id: "unlock-every-challenge",      name: "I Like Shiny Things", desc: "Unlock every challenge",                tier: 3, secret: false, icon: "rings" },
  // Dark sides. Milestones only — a challenge's own dark reward is its black wax seal and
  // violet tick, so there is deliberately no per-challenge charm here.
  { id: "beat-first-dark-side",    name: "Old Habits Die Screaming", desc: "Beat your first dark side",             secret: false, icon: "blackdog", sitting: true, earn: { cat: "dark" } },
  { id: "beat-5-dark-sides",    name: "Cross The Line",   desc: `Beat ${DARK_SIDE_MILESTONE} dark sides`, tier: 2, secret: false, icon: "halo" },
  { id: "beat-every-dark-side", name: "Darkest Little Paradise", desc: "Beat every dark side",           tier: 3, secret: false, icon: "eden" },
  { id: "defeat-challenge-no-misses",   name: "Our Slates Are Clean", desc: "Defeat a challenge without missing a single page", tier: 2, secret: false, icon: "feather", sitting: true, earn: { cat: "challenge" } },
  { id: "defeat-challenge-after-7-runs", name: "At Least I'm Trying", desc: "Defeat a challenge after seeing it through 7 times", tier: 2, secret: true, icon: "crumple" },
  { id: "fall-for-first-impostor",      name: "In Plain Sight",                  desc: "Fall for the very first impostor you meet", secret: true, icon: "hooked" },
  /* ---- Flourish charms: win one named challenge the hard way ----
     Masked until that challenge has been DEFEATED (`reveal` names it), then they show as
     ordinary locked targets in this theme. Every condition here demands deliberate play —
     never tap a decoy, never a fuzzy recall, never twice on the same letter — so a
     permanently secret flourish is one nobody would ever trip over by accident, and its
     charm would go undrawn-on. Revealing on defeat makes each win hand you the next goal:
     now do it properly. They stay deliberately selective, NOT one per challenge: only the
     challenges with a flourish worth naming carry one. A revealed flourish is not counted
     as hidden by Is It Over Now? (see HIDDEN_ACH_IDS in app.js). */
  { id: "defeat-impostor-flawlessly",  name: "Should've Known That Word", desc: "Defeat Impostor flawlessly: every impostor flagged, every real word named", tier: 2, secret: true, reveal: "impostor", icon: "nosign" },
  { id: "defeat-common-thread-every-line",  name: "One Single Thread", desc: "Defeat Common Thread: pull the word through every line", tier: 2, secret: true, reveal: "common-thread", icon: "thread" },
  { id: "beat-revolving-door-before-swap",   name: "Two Steps Ahead",   desc: "Beat Revolving Door before a single swap: every answer on the first word", tier: 2, secret: true, reveal: "revolving-door", icon: "twosteps" },
  { id: "win-home-invasion-clock-untouched",  name: "My Walls Stood Tall", desc: "Win Home Invasion untouched: the clock never once shrinks", tier: 2, secret: true, reveal: "home-invasion", icon: "wall" },
  { id: "win-shrinking-timer-all-pages-under-10s",         name: "Tick-Tock",         desc: "Win Shrinking Timer, clearing every page once the clock hits single digits", tier: 2, secret: true, reveal: "shrinking-timer", icon: "stopwatch" },
  { id: "win-sea-of-songs-no-decoys",      name: "Part The Sea",      desc: "Win Sea of Songs without ever tapping a decoy", tier: 2, secret: true, reveal: "sea-of-songs", icon: "partedsea" },
  { id: "win-lyric-lover-all-lines-word-perfect", name: "Knowing All The Words", desc: "Win Lyric Lover with every line word-perfect, no fuzzy recalls", tier: 2, secret: true, reveal: "lyric-lover", icon: "cassette" },
  // Long Story Long's two, and they pull in opposite directions on purpose: one asks you to
  // refuse the cheap page every single time, the other asks you to write faster than the
  // target needs. A run that does both has played the challenge at its limit.
  { id: "win-long-story-long-no-titles-banked", name: "Every Word I Said", desc: "Win Long Story Long on the lines alone: not one page banked by naming the song", tier: 2, secret: true, reveal: "lyric-ink", icon: "placeholder" },
  { id: "win-long-story-long-filling-target-early",   name: "The Ink Bleeds",    desc: `Win Long Story Long with the target filled inside ${INK_FLOURISH_PAGES} pages`, tier: 2, secret: true, reveal: "lyric-ink", icon: "placeholder" },
  { id: "clear-double-trouble-all-13-two-songs-each",     name: "Two Is Better Than One", desc: "Clear all thirteen pages of Double Trouble: two songs each, none dropped", tier: 2, secret: true, reveal: "double-trouble", icon: "cherries" },
  { id: "win-vanishing-word-all-answers-blind",       name: "Blank Space",       desc: "Win Vanishing Word writing blind: every answer landed after the word had gone", tier: 2, secret: true, reveal: "vanishing-word", icon: "vanish" },
  { id: "win-deep-cut-all-correct-same-album", name: "Been Here All Along", desc: "Win Deep Cut loyal to one album: every correct answer of the run off the same record", tier: 2, secret: true, reveal: "deep-cut", icon: "heartlabel" },
  // The risk three. Flourishes like the rest, so they carry `reveal` and stay masked until
  // their challenge is beaten — nobody rides a pot five deep by accident. Each one asks for
  // the thing its rule is really about: depth on Press, restraint on Insurance, nerve on
  // Wager. Deliberately NOT a rule that every challenge gets one; three of thirty-two.
  { id: "bank-press-your-luck-pot-5-pages-deep", name: "Bonnie And Clyde",       desc: `Bank a pot on Press Your Luck ridden ${PRESS_FLOURISH_RIDE} pages deep`, tier: 2, secret: true, reveal: "press-your-luck", icon: "getaway" },
  { id: "win-insurance-no-shields-spent",       name: "Untouchable",       desc: "Win Insurance with every shield still unspent", tier: 2, secret: true, reveal: "insurance", icon: "belljar" },
  { id: "win-confidence-wager-max-every-page",           name: "Let The Players Play", desc: "Win Confidence Wager having staked the most you could hold on every page", tier: 2, secret: true, reveal: "confidence-wager", icon: "allin" },
  /* The pratfall on the other end of Untouchable, and NOT a flourish: same fact (not one
     shield spent) read at the wrong end of the run. Page one is the whole joke, because an
     uninsured miss is simply how every Insurance run ends and a charm for that would fire on
     the first defeat like a participation trophy. Deliberately no `reveal`: the flourishes
     mask until their challenge is DEFEATED, and the player who just died on page one has
     obviously not done that, so gating it there would hide it from the only person earning it. */
  { id: "lose-insurance-page-1-shields-unspent", name: "Can't Have Nice Things", desc: "Lose Insurance on page one with every shield still unspent", secret: true, icon: "struckglass" },
  // Dark sides. A milestone rather than a flourish (no challenge named), so it stays visible.
  { id: "beat-dark-side-no-misses",        name: "Now I Breathe Flames", desc: "Beat a dark side without missing a single page", tier: 2, secret: false, icon: "flame", sitting: true, earn: { cat: "dark" } },
  { id: "beat-first-album-focus", name: "Girl On A Mission",     desc: "Beat your first album in Album Focus", secret: false, icon: "map", sitting: true, earn: { cat: "album" } },
  { id: "beat-all-12-album-focus",           name: "Stand Up Champions", desc: "Beat all 12 albums in Album Focus",     tier: 2, secret: false, icon: "butterfly" },
  { id: "perfect-album-focus",        name: "Gleaming, Twinkling", desc: "Perfect an album in Album Focus (13/13)", secret: false, icon: "coins", sitting: true, earn: { cat: "album" } },
  { id: "perfect-all-12-album-focus",        name: "Made Of Starlight", desc: "Perfect all 12 albums in Album Focus",  tier: 3, secret: false, icon: "constellation" },
  // Gleaming, Twinkling perfects at any difficulty; these are the two top rungs, and they ask for
  // different things — naming a record cold on a 5s clock, or having its words by heart.
  { id: "perfect-album-focus-ultra", name: "Salute To Me",     desc: "Perfect an album on Ultra",            tier: 2, secret: false, icon: "kingcard", sitting: true, earn: { cat: "album", diff: "ultra" } },
  { id: "perfect-album-focus-lyricist",   name: "Write What You Know", desc: "Perfect an album in Lyricist",         tier: 2, secret: false, icon: "manuscript", sitting: true, earn: { cat: "album", diff: "lyricist" } },
  /* ---- Custom mode (your own levers, your own rules) ---- */
  { id: "finish-first-custom-run",             name: "My Choice Is You", desc: "Finish your first Custom run",         secret: false, icon: "levers", sitting: true },
  { id: "keep-5-custom-presets",             name: "A Drawer Of My Things", desc: `Keep ${CUSTOM_PRESET_SHELF} custom presets on the shelf at once`, secret: false, icon: "presetbox", sitting: true },
  { id: "reach-round-50-endless-custom", name: "Forever & Always", desc: `Reach round ${CUSTOM_ENDLESS_MILESTONE} of an endless Custom run`, tier: 2, secret: false, icon: "infinity", sitting: true },
  // The one Custom charm that rewards authoring something punishing rather than comfortable.
  // "No easier than Ultra" is checked lever by lever against MODES.ultra (see customAtLeastUltra),
  // so retuning Ultra retunes this with it rather than leaving a stale set of numbers here.
  { id: "perfect-custom-at-least-ultra",      name: "Aim At The Devil", desc: "Perfect a full Custom run tuned no easier than Ultra", tier: 2, secret: false, icon: "pitchfork", sitting: true },
  /* ---- Guest shelf (other artists' catalogues) ---- */
  { id: "admit-guest", name: "Been Waitin' For You", desc: "Admit a guest to the shelf", secret: false, icon: "guestpass", sitting: true, earn: { cat: "guest" } },
  // Admission already means a perfect, hint-free run, so these are the rungs above it.
  { id: "admit-guest-hard",       name: "The Bravest Thing", desc: "Admit a guest on Hard or Ultra",       tier: 2, secret: false, icon: "handstamp", sitting: true, earn: { cat: "guest", diff: "hard" } },
  { id: "admit-guest-lyricist", name: "Know You Better",        desc: "Admit a guest in Lyricist", tier: 2, secret: false, icon: "duetmic", sitting: true, earn: { cat: "guest", diff: "lyricist" } },
  /* ---- Bonus games shelf ----
     A bonus run is otherwise sandboxed to its own best score — these charms are the ONE thing
     it writes outside BONUS_KEY, and that is deliberate: a charm is a collection entry, never
     a ranking, so it doesn't breach the rule that a bonus run is never ranked beside the main
     game. Nothing here may fold stats, history, records or skill XP. */
  { id: "finish-first-bonus-run",    name: "Play It Again",    desc: "Finish your first bonus run",          secret: false, icon: "tonearm", sitting: true, earn: { cat: "bonus" } },
  { id: "play-every-bonus-game",      name: "Vinyl Shelf",      desc: "Play every game on the shelf",         tier: 2, secret: false, icon: "crate" },
  { id: "clean-sweep-bonus-game",     name: "A Clean Kill",     desc: "Clean-sweep a bonus game: ten pages cleared", tier: 2, secret: false, icon: "broom", sitting: true, earn: { cat: "bonus" } },
  { id: "clean-sweep-every-bonus-game", name: "Every Single One", desc: "Clean-sweep every game on the shelf",  tier: 3, secret: false, icon: "goldrecord" },
  { id: "keep-bonus-sleeve", name: "One Last Souvenir", desc: "Take a sleeve off the page and keep it", secret: false, icon: "sleeve", sitting: true, earn: { cat: "bonus" } },
  // One per game, and four of the six are that game's clean sweep said in its own voice. The
  // two that aren't ask for something a sweep doesn't: exactness on Sing It Back, nerve on
  // Redacted. They are NOT masked like the challenge flourishes — a bonus game has no defeat
  // to reveal them on, so they stand as ordinary named targets from the start.
  { id: "sweep-spot-the-slip", name: "Something’s Changed", desc: "Sweep Spot the Slip",             tier: 2, secret: false, icon: "ringedword", sitting: true, earn: { cat: "bonus" } },
  { id: "sweep-name-that-song-one-line-each",   name: "The First Note",   desc: "Sweep Name That Song: all ten off one line each", tier: 2, secret: false, icon: "tuningfork", sitting: true, earn: { cat: "bonus" } },
  { id: "sweep-sing-it-back-all-words-exact", name: "Right Where You Left Me", desc: "Sweep Sing It Back with every word exact, not one typo forgiven", tier: 2, secret: false, icon: "jigsaw", sitting: true, earn: { cat: "bonus" } },
  { id: "name-redacted-song-no-strips-removed",      name: "Blind Faith",      desc: "Name a Redacted song with every strip still down", tier: 2, secret: false, icon: "taped", sitting: true, earn: { cat: "bonus" } },
  { id: "take-rarest-only-here-card-all-10-pages",       name: "Rarest Air",       desc: "Take the rarest card on all ten pages of Only Here", tier: 2, secret: false, icon: "highcard", sitting: true, earn: { cat: "bonus" } },
  { id: "finish-then-what-unbroken-chain", name: "Follow The Sparks", desc: "Sing a whole Then What run on one unbroken chain", tier: 2, secret: false, icon: "chain", sitting: true, earn: { cat: "bonus" } },
  // The secrets. Three of them are failures worn well (the register of I'm The Problem), which is the
  // shelf's own tone: these games have soft edges and losing on them is funny rather than sore.
  { id: "take-commonest-only-here-card",      name: "I Bought It",      desc: "Take the commonest card in an Only Here hand", secret: true, icon: "receipt" },
  { id: "name-redacted-song-after-buying-all-strips",   name: "Knew The Price",   desc: "Buy every strip on a Redacted page and still name the song", secret: true, icon: "peeled" },
  { id: "time-out-all-10-only-here-pages", name: "Never Heard Silence", desc: "Let all ten Only Here clocks run out without a card played", secret: true, icon: "spider" },
  { id: "finish-bonus-run-one-page-short-of-sweep",    name: "Almost Had It",    desc: "Finish one page shy of a clean sweep", secret: true, icon: "dart" },
  { id: "flag-spot-the-slip-impostor-under-2s",    name: "Saw It Coming",    desc: "Flag a Spot the Slip impostor inside two seconds", secret: true, icon: "mask" },
  /* ---- Ruthless: the mode where the clock is the score (2026-08-18) ----
     Eight charms. The first roster went in unvetted and came back out the same day, and the
     lesson it left is the rule this one is built on: NOTHING HERE MAY BE PRICED IN A NUMBER THE
     MODE NEVER SHOWS YOU. The old batch charged for naming a page inside a snap window the
     player could only learn afterwards from a bead. Every threshold below is either on screen
     while you play (the word count, the title arriving) or on the board you just came off.

     Three registers, which is what stops eight charms in one mode reading as one charm eight
     times. The FLEX is what you knew — one word, and the clean ten. The LADDER is what you can
     do to the board, three rungs of it, the only place this mode keeps a standard. And the two
     SHEEPISH ones are what the mode costs you: the page the song had to name for you, and the
     page you walked away from.

     NOTHING HERE CAN BE LOCKED OUT. The board is the reason: a lens is always open, always
     dealt fresh, and a best is a thing you go and beat rather than a window that shuts. The one
     that had to be re-cut for this is the give-up charm — it was going to ask you to hand a page
     back and still post a new lens best, which a notebook with six near-perfect bests on it can
     never do again, so it asks you to beat your LAST run down that lens instead. That is the
     same decision (cut the loss, come out ahead) against a mark that moves every time you
     play. */
  { id: "name-ruthless-page-off-one-word",                 name: "One Look",           desc: "Name a Ruthless Game page off a single word", secret: false, icon: "oneword", sitting: true, earn: { cat: "ruthless" } },
  { id: "finish-ruthless-run-naming-all-ten",              name: "Never Gave In",      desc: "Finish a Ruthless Game run with all ten pages named, none handed back", tier: 2, secret: false, icon: "heldknot", sitting: true, earn: { cat: "ruthless" } },
  { id: "finish-ruthless-run-with-no-wrong-guess",         name: "Sure Of Everything", desc: "Finish a Ruthless Game run without typing a single wrong song", tier: 2, secret: false, icon: "eraser", sitting: true, earn: { cat: "ruthless" } },
  // The ladder, read off the BOARD and not off the run that happened to close it. Three rungs of
  // the same shape so the descriptions can be read side by side and the only thing that changes
  // is the number, which is the whole point of a ladder.
  { id: "every-ruthless-lens-best-under-90s",              name: "Green Light, Go",    desc: "Hold a best under 90 seconds on all six Ruthless Game lenses", tier: 2, secret: false, icon: "greenlight", earn: { cat: "ruthless" } },
  { id: "every-ruthless-lens-best-under-60s",              name: "Time Moves Faster",  desc: "Hold a best under 60 seconds on all six Ruthless Game lenses", tier: 2, secret: false, icon: "clockrush", earn: { cat: "ruthless" } },
  { id: "every-ruthless-lens-best-under-45s",              name: "Blink Of An Eye",    desc: "Hold a best under 45 seconds on all six Ruthless Game lenses", tier: 3, secret: false, icon: "blink", earn: { cat: "ruthless" } },
  // Walking away, priced as the decision it is rather than the surrender it looks like.
  { id: "give-up-a-page-and-still-beat-last-ruthless-run", name: "Smart To Walk Away", desc: "Hand a page back and still finish faster than your last run down that lens", secret: false, icon: "walkedaway", sitting: true, earn: { cat: "ruthless" } },
  /* The secret, and the only charm in the notebook for being told the answer. The stream runs
     on past your lens into the rest of the song, so a page you cannot place will eventually
     sing its own name at you — and taking it within a few words is a visible, specific, faintly
     embarrassing moment rather than a slow page. Secret because a card that described it would
     be teaching a tactic, and because the shelf writes its failures this way. */
  { id: "name-ruthless-page-just-after-its-title-appears", name: "Say My Name",        desc: "Take the answer within moments of the song singing its own name outside your lens", secret: true, icon: "heardit" },
  /* ---- Catalogue knowledge: what you know about the records (2026-08-18 batch) ----
     Twenty-two charms, all in the Catalogue theme, and every one of them is priced in a fact
     about the catalogue rather than in how well the run was played. Three shapes:

       - the named pair, where one specific word wants one specific song;
       - the structural read, where the answer's PLACE in the catalogue is the feat (a fifth
         track, a thirteenth, a vault track, an alternate take, the first or last line);
       - the egg, four charms earned by getting the page WRONG on purpose, because the thing
         being tested is not in the lyrics at all (see the block at the end).

     Every condition is gated on the guest shelf being off: "the thirteenth track" and "a
     vault track" are facts about Taylor's records and mean nothing on a guest's, so they are
     judged against her catalogue or not at all.

     Nothing here can be locked out. Each is a standing condition on a page that comes round
     again, the two dated ones come round weekly, and the single lifetime set (Say The Quiet
     Part) only ever grows. `sitting` is deliberately sparse: it is only on the ones an evening
     can actually chase, never on the ones that need a particular word to be dealt first. */
  { id: "answer-song-titled-the-prompt-word", name: "Well, Yes!", desc: "Answer with the song whose title is the prompt word", secret: false, icon: "equals" },
  { id: "answer-5-songs-titled-the-prompt-word", name: "Say The Quiet Part", desc: "Answer the song-titled-the-word for five different words", tier: 2, secret: false, icon: "fivewords" },
  { id: "answer-alternate-version-when-base-would-do", name: "Acoustic Version Is Better", desc: "Name an alternate version when the original would have counted", secret: false, icon: "parens", sitting: true, earn: { cat: "difficulty" } },
  { id: "answer-3-fifth-tracks-one-game", name: "Track 5 Lover", desc: "Answer three fifth tracks in one game", secret: false, icon: "trackfive", sitting: true, earn: { cat: "difficulty" } },
  { id: "answer-thirteenth-track-on-page-13", name: "Right On Thirteen", desc: "Answer page 13 with an album's thirteenth track", secret: false, icon: "bookmark", sitting: true, earn: { cat: "difficulty" } },
  { id: "answer-aoty-word-from-another-aoty-album", name: "Albums Of The Year", desc: "Take a word that titles an Album of the Year track with a song off a different Album of the Year", tier: 2, secret: false, icon: "laurel" },
  { id: "answer-vault-track-for-tv-track-title", name: "Exploring The Vault", desc: "Take a word that titles a Taylor's Version track with a song From The Vault", tier: 2, secret: false, icon: "vault" },
  { id: "answer-song-saying-word-20-times", name: "A Hundred Times", desc: "Answer with a song that sings the word 20 times or more", secret: false, icon: "sameagain", sitting: true, earn: { cat: "difficulty" } },
  { id: "answer-song-with-word-in-first-line", name: "Opening Line", desc: "Answer with a song that holds the word in its very first line", secret: false, icon: "firstline", sitting: true, earn: { cat: "difficulty" } },
  { id: "answer-song-with-word-in-last-line", name: "Closing Line", desc: "Answer with a song that holds the word in its very last line", secret: false, icon: "lastline", sitting: true, earn: { cat: "difficulty" } },
  { id: "answer-shortest-and-longest-titles-one-game", name: "Long Story Short", desc: "Answer with the shortest and the longest title in the catalogue, in one game", tier: 2, secret: false, icon: "shortlong" },
  // Read off the RAW line, before the matcher drops the punctuation — the same trick JE SUIS
  // CALME plays with capitals. A dropdown CLICK never fills the box, so demanding that the
  // line itself spell the title out is what keeps this something the player typed.
  { id: "type-title-punctuation-exactly", name: "Once Again With Feeling", desc: "Write a title's punctuation out in full, exactly as it's printed", tier: 2, secret: false, icon: "punctuation" },
  { id: "answer-title-starting-with-last-word-of-previous", name: "I Always Get The Last Word", desc: "Follow an answer with a title that starts on its last word", tier: 2, secret: false, icon: "wordchain" },
  /* The named pairs. Secret to a charm: each one is a joke that only lands if you find it,
     and a visible card naming the song would be the answer printed on the box. */
  { id: "answer-karma-for-cat", name: "Karma Is A Cat", desc: "Answer “Karma” when the word is “cat”", secret: true, icon: "pawprint" },
  { id: "answer-gold-rush-for-folklore", name: "Don't Be Fooled", desc: "Answer “gold rush” when the word is “folklore”", secret: true, icon: "goldpan" },
  { id: "answer-way-back-home", name: "Taylor Wrote That?! Talent.", desc: "Answer with “You'll Always Find Your Way Back Home”", secret: true, icon: "homepath" },
  // The two dated pairs, both written into the line itself: Begin Again watches it begin again
  // on a Wednesday, and I'm Only Me is a Friday night beneath the stars. Weekly, so neither
  // can be missed — see also It's Raining And It's Monday, which set this shape.
  { id: "answer-begin-again-for-wednesday-on-a-wednesday", name: "Wednesday In A Cafe", desc: "Answer “Begin Again” for “Wednesday”, on a Wednesday", secret: true, icon: "coffeecup" },
  { id: "answer-only-me-for-friday-on-a-friday-night", name: "Friday Night Beneath The Stars", desc: "Answer “I'm Only Me When I'm With You” for “Friday”, on a Friday night", secret: true, icon: "hammock" },
  /* The eggs. Four charms for knowing something the lyrics don't say, which means all four are
     WRONG answers that spend the page: a graffitied wall in a music video, a song about a
     wedding that never says the word, and the album a same-named track sits on. Deliberately
     capped at four — the joke is only funny while it is rare, and every one of them costs a
     page. They fire on the attempt rather than the verdict, exactly as the Paris egg does. */
  { id: "submit-the-man-for-karma", name: "13th Street Station", desc: "Answer “The Man” when the word is “karma”", secret: true, icon: "stationsign" },
  { id: "submit-speak-now-for-wedding", name: "Crash The Wedding", desc: "Answer “Speak Now” when the word is “wedding”", secret: true, icon: "weddingbells" },
  { id: "submit-lwymmd-for-grave", name: "Here Lies Your Answer Streak", desc: "Answer “Look What You Made Me Do” when the word is “grave”", secret: true, icon: "headstone" },
  { id: "submit-wrong-song-from-same-titled-albums-record", name: "Burning Red (With Anger)", desc: "Miss a word that titles a song with another song off that song's album", secret: true, icon: "burningsleeve" },
  /* ---- Skills & Mastery ---- */
  { id: "unlock-mastery", name: "Bigger Than The Whole Sky", desc: "Press the wax and unlock Mastery", tier: 2, secret: false, icon: "waxpress" },
  { id: "reach-level-10-one-skill",        name: "Superstar",        desc: `Take a single skill all the way to level ${SKILL_MAX_LEVEL}`, tier: 2, secret: false, icon: "rosette" },
  { id: "wear-prestige-title", name: "Call It What You Want", desc: "Wear a prestige title on your signature", tier: 2, secret: false, icon: "nametag" },
  /* The two rungs above Superstar. MASTERY_GATE lets you through on a SUM, so it can be cleared
     with one maxed skill carrying four idle ones; Nothing Out Of Place asks for that same total
     spread evenly, and The Whole Place Shimmer asks for the lot. Neither can be locked out:
     skill ink only ever accrues, and a plain classic run pays into all five. */
  { id: "all-five-skills-level-8", name: "Nothing Out Of Place", desc: `Have all five skills at level ${SKILL_EVEN_LEVEL} or higher`, tier: 3, secret: false, icon: "spiritlevel" },
  { id: "cap-every-skill", name: "The Whole Place Shimmer", desc: `Take all five skills to level ${SKILL_MAX_LEVEL}`, tier: 3, secret: false, icon: "candelabra" },
  { id: "reach-mastery-max-level", name: "Long Live", desc: `Reach Mastery level ${MASTERY_MAX_LEVEL}`, tier: 3, secret: false, icon: "topladder" },
  /* Ink in all five in ONE run, which is really a charm about the contribution mask: a Challenge
     pays resolve alone, relaxed never pays tempo, Ruthless never runs the round loop. It takes a
     timed classic run with a sung line, a streak held and answers reaching across albums. */
  { id: "earn-ink-in-all-five-skills-one-run", name: "None Of It Accidental", desc: "Earn ink in all five skills in a single run", tier: 2, secret: false, icon: "inkedhand" },
  /* The wardrobe. Around forty cosmetics come off that ladder and nothing rewarded wearing them. */
  { id: "wear-every-mastery-cosmetic-at-once", name: "Style", desc: "Wear a chosen pen, paper, trinket, button finish and button words all at once", tier: 3, secret: false, icon: "dressednotebook" },
  { id: "wear-blank-start-button", name: "The Quiet One", desc: "Wear the blank start button", secret: true, icon: "restbar" },
  { id: "set-every-cosmetic-to-random", name: "Hands Of Fate", desc: "Hand your trinket, button finish and button words all to chance at once", secret: true, icon: "fortuneteller" },
  { id: "find-every-polaroid-keepsake", name: "You Took A Polaroid Of Us", desc: "Find every polaroid keepsake", tier: 3, secret: true, icon: "polaroid" },
  { id: "earn-every-hidden-achievement",   name: "Is It Over Now?",  desc: "Earn every hidden achievement",         tier: 3, secret: true,  icon: "hourglass" },
  { id: "earn-every-other-achievement",    name: "The Lucky One",    desc: "Earn every other achievement",          tier: 3, secret: true,  icon: "clover" },
];
export const ACH_BY_ID = Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a]));

// Append-only. Never delete a row: it is the only record of what an old
// storage key meant.
export const ACH_ID_MIGRATIONS = {
  "enchanted": "first-game-finished",
  "mastermind": "perfect-13",
  "fearless": "finish-with-no-timeouts",
  "speak-now": "answer-under-2s",
  "begin-again": "play-5-games",
  "getaway-car": "answer-under-1s-left",
  "bejeweled": "streak-5",
  "long-story-short": "finish-on-5-streak-after-miss",
  "today-was-a-fairytale": "first-daily-finished",
  "all-too-well": "finish-lyricist-game",
  "champagne-problems": "score-12",
  "anti-hero": "score-zero",
  "hits-different": "play-all-three-game-types",
  "fifteen": "play-15-games",
  "you-knew-the-line": "recall-5-lyric-lines-one-game",
  "out-of-the-woods": "survive-20-rounds-infinite",
  "twenty-two": "reach-round-22-infinite",
  "nineteen-eighty-nine": "reach-round-89-infinite",
  "sparks-fly": "streak-10",
  "great-war": "win-ultra-10-correct",
  "long-live": "perfect-13-hard",
  "whos-afraid": "perfect-13-ultra",
  "marjorie": "perfect-13-lyricist",
  "ready-for-it": "round-1-under-2s",
  "i-did-something-bad": "answer-under-half-second-left",
  "branch-out": "streak-3-same-album",
  "eras-tour": "score-nearly-every-studio-album-one-game",
  "daylight": "perfect-daily",
  "story-of-us": "daily-streak-7",
  "evermore": "daily-streak-30",
  "karma": "earn-13-achievements",
  "midnights": "play-between-midnight-and-1am",
  "shake-it-off": "recover-after-miss-3-times-one-game",
  "peace": "finish-without-timer-red-zone",
  "perfect-storm": "average-under-3s-per-answer",
  "the-triangle": "answer-cardigan-betty-august-one-game",
  "my-mind-is-alive": "streak-3-b-titles",
  "cruel-summer": "lose-3-lives-first-4-rounds",
  "i-cant-see-you": "finish-with-no-answers",
  "thousand-cuts": "miss-1000-rounds-lifetime",
  "holy-ground": "reach-round-13-infinite-from-scratch",
  "spicy-drama": "answer-if-this-was-a-movie",
  "word-for-word": "recall-lyric-line-word-perfect",
  "i-look-in-windows": "open-settings-menu",
  "snow-on-the-beach": "watch-snow-fall",
  "midnight-rain": "keep-page-company-past-midnight",
  "autumn-leaves-falling": "watch-autumn-leaves-fall",
  "safe-and-sound": "play-easy-3-times-in-row",
  "revenge": "beat-personal-best-score",
  "mirrorball": "perfect-13-every-mode",
  "diamonds": "streak-3-rare-words-no-ultra",
  "wordsmith": "win-fuzzy-lyric-match",
  "got-you-down": "recall-10-lyric-lines-word-perfect",
  "by-heart": "recall-50-lyric-lines-word-perfect",
  "where-i-start": "recall-100-lyric-lines-word-perfect",
  "clearly-ready": "recall-1000-lyric-lines-word-perfect",
  "overachiever": "recall-whole-verse-word-perfect",
  "fav-song": "answer-3-rounds-same-song",
  "eyes-closed": "make-10-fuzzy-matches-one-lyricist-game",
  "paris": "answer-paris-for-somewhere",
  "i-hate-it-here": "answer-every-catalogue-song",
  "mean": "answer-nemesis-word",
  "raining-monday": "answer-rain-on-monday",
  "clean": "win-with-no-hints-or-timeouts",
  "everything-nothing": "win-every-difficulty",
  "fearless-tv": "finish-no-timeouts-2-games-in-row",
  "explorer": "play-every-required-mode",
  "seven": "play-all-seven-weekdays",
  "youre-on-your-own-kid": "save-first-bracelet-keepsake",
  "piano-was-hissing": "type-reputation-tv",
  "the-bolter": "quit-round-1-before-typing",
  "no-closure": "give-up-after-12-before-13",
  "the-archer": "defeat-first-challenge",
  "the-alchemy": "defeat-every-challenge",
  "paper-rings": "unlock-every-challenge",
  "the-black-dog": "beat-first-dark-side",
  "dont-blame-me": "beat-5-dark-sides",
  "darkest-paradise": "beat-every-dark-side",
  "state-of-grace": "defeat-challenge-no-misses",
  "this-is-me-trying": "defeat-challenge-after-7-runs",
  "smallest-man": "fall-for-first-impostor",
  "shouldve-said-no": "defeat-impostor-flawlessly",
  "invisible-string": "defeat-common-thread-every-line",
  "two-steps-ahead": "beat-revolving-door-before-swap",
  "walls-stood-tall": "win-home-invasion-clock-untouched",
  "tick-tock": "win-shrinking-timer-all-pages-under-10s",
  "part-the-sea": "win-sea-of-songs-no-decoys",
  "knowing-all-the-words": "win-lyric-lover-all-lines-word-perfect",
  "two-is-better": "clear-double-trouble-all-13-two-songs-each",
  "blank-space": "win-vanishing-word-all-answers-blind",
  "you-belong-with-me": "win-deep-cut-all-correct-same-album",
  "i-knew-you-were-trouble": "bank-press-your-luck-pot-5-pages-deep",
  "untouchable": "win-insurance-no-shields-spent",
  "the-man": "win-confidence-wager-max-every-page",
  "mad-woman": "beat-dark-side-no-misses",
  "a-place-in-this-world": "beat-first-album-focus",
  "change": "beat-all-12-album-focus",
  "gold-rush": "perfect-album-focus",
  "starlight": "perfect-all-12-album-focus",
  "king-of-my-heart": "perfect-album-focus-ultra",
  "the-manuscript": "perfect-album-focus-lyricist",
  "ours": "finish-first-custom-run",
  "mine": "keep-5-custom-presets",
  "forever-and-always": "reach-round-50-endless-custom",
  "dear-reader": "perfect-custom-at-least-ultra",
  "welcome-to-new-york": "admit-guest",
  "better-man": "admit-guest-hard",
  "everything-has-changed": "admit-guest-lyricist",
  "play-it-again": "finish-first-bonus-run",
  "vinyl-shelf": "play-every-bonus-game",
  "a-clean-kill": "clean-sweep-bonus-game",
  "every-single-one": "clean-sweep-every-bonus-game",
  "one-last-souvenir": "keep-bonus-sleeve",
  "somethings-changed": "sweep-spot-the-slip",
  "the-first-note": "sweep-name-that-song-one-line-each",
  "right-where-you-left-me": "sweep-sing-it-back-all-words-exact",
  "blind-faith": "name-redacted-song-no-strips-removed",
  "rarest-air": "take-rarest-only-here-card-all-10-pages",
  "follow-the-sparks": "finish-then-what-unbroken-chain",
  "i-bought-it": "take-commonest-only-here-card",
  "knew-the-price": "name-redacted-song-after-buying-all-strips",
  "never-heard-silence": "time-out-all-10-only-here-pages",
  "almost-had-it": "finish-bonus-run-one-page-short-of-sweep",
  "saw-it-coming": "flag-spot-the-slip-impostor-under-2s",
  "bigger-than-the-whole-sky": "unlock-mastery",
  "superstar": "reach-level-10-one-skill",
  "call-it-what-you-want": "wear-prestige-title",
  "you-took-a-polaroid-of-us": "find-every-polaroid-keepsake",
  "is-it-over-now": "earn-every-hidden-achievement",
  "the-lucky-one": "earn-every-other-achievement",
};

// Achievements are shown grouped by theme on the Charm Collection page. Order here is
// the section order. The final "Secret charms" section is render-only (not a group).
export const ACH_GROUPS = [
  { id: "core",      label: "Core",                   short: "Core" },
  { id: "perfect",   label: "Perfect pages",          short: "Perfect" },
  { id: "clock",     label: "Against the clock",      short: "Clock" },
  { id: "misfires",  label: "The crossed-out lines",  short: "Misfires" },
  { id: "daily",     label: "Daily challenge",        short: "Daily" },
  { id: "infinite",  label: "Infinite mode",          short: "Infinite" },
  { id: "lyricist",  label: "Lyricist & lyric lines", short: "Lyricist" },
  { id: "catalogue", label: "Catalogue knowledge",    short: "Catalogue" },
  { id: "nemesis",   label: "Nemesis words",          short: "Nemesis" },
  { id: "challenges", label: "Challenges",             short: "Challenge" },
  { id: "albumFocus", label: "Album Focus",            short: "Album" },
  { id: "custom",    label: "Custom mode",            short: "Custom" },
  { id: "guests",    label: "Guest shelf",            short: "Guests" },
  { id: "bonus",     label: "Bonus games",            short: "Bonus" },
  { id: "ruthless",  label: "Ruthless Game",          short: "Ruthless" },
  { id: "longhaul",  label: "The long haul",          short: "Long haul" },
  { id: "margins",   label: "In the margins",         short: "Margins" },
  { id: "mastery",   label: "Skills & Mastery",       short: "Mastery" },
];
// One muted notebook hue per theme — the section marks and the by-theme breakdown bars.
export const ACH_GROUP_COLORS = {
  core:      "#c8951f",
  perfect:   "#c2622a",
  clock:     "#55707f",
  misfires:  "#8a3b2f",
  daily:     "#3f7d6e",
  infinite:  "#2f4d7a",
  lyricist:  "#9b6b9e",
  catalogue: "#b23a3a",
  nemesis:   "#6d3f5c",
  challenges: "#2b2722",
  albumFocus: "#a8577a",
  custom:    "#4a6b8a",
  guests:    "#6b5a92",
  bonus:     "#2f6f6a",
  ruthless:  "#8c4a34",   // the Ruthless stamp's own rust, so the section mark matches the door in
  longhaul:  "#4a6b3f",
  margins:   "#7d5a3f",
  mastery:   "#8a6d1f",
};

/* Families: one layer ABOVE the themes, so seventeen equal rows read as four groups of
   related ones. Nothing merges. A family is only a bag of theme ids, which means
   ACH_GROUPS stays the unit a charm belongs to and the unit the theme-completion charms
   (The Things That I Love, One Single Thread Of Gold, We Gather Stones) count — adding a
   family can never change what any of them cost.
   The split is by what the charm is priced in, not by which screen you were on: craft is
   how well you played, shelf is what you played, catalogue is what you know, and off the
   page is where you were sitting. A theme left out of every family here is not lost — see
   achFamilies() in app.js, which sweeps orphans into the last family rather than dropping
   them off the page. */
export const ACH_FAMILIES = [
  { id: "craft",     label: "The craft",     blurb: "how well you played",
    themes: ["core", "perfect", "clock", "misfires", "longhaul"] },
  { id: "shelf",     label: "The shelf",     blurb: "what you played",
    themes: ["daily", "infinite", "lyricist", "albumFocus", "custom", "guests", "bonus", "ruthless", "challenges"] },
  { id: "knowledge", label: "The catalogue", blurb: "what you know",
    themes: ["catalogue", "nemesis"] },
  { id: "offpage",   label: "Off the page",  blurb: "where you were sitting",
    themes: ["margins", "mastery"] },
];
// One hue per family, for the index tabs down the collection. Deliberately drawn from the
// middle of each family's own themes so a tab and the dots beneath it read as one run.
export const ACH_FAMILY_COLORS = {
  craft:     "#b07d2a",
  shelf:     "#3f6b7d",
  knowledge: "#a33a3a",
  offpage:   "#6b5a3f",
  // Not a family in ACH_FAMILIES: the trailing Secret section gets a tab of its own, and it
  // takes the plain ink of the masked charms rather than a hue that would hint at a theme.
  sealed:    "#6f6a60",
};

// Membership: only the non-core ids are listed; everything else defaults to "core"
// (groupOf in app.js). Keeps this in sync without re-listing every achievement.
export const ACH_GROUP_OF = {
  "first-daily-finished": "daily", "perfect-daily": "daily", "daily-streak-7": "daily", "daily-streak-30": "daily",
  "survive-20-rounds-infinite": "infinite", "reach-round-22-infinite": "infinite", "finish-on-5-streak-after-miss": "infinite",
  "lose-3-lives-first-4-rounds": "infinite", "reach-round-13-infinite-from-scratch": "infinite",
  "finish-lyricist-game": "lyricist", "recall-5-lyric-lines-one-game": "lyricist", "recall-lyric-line-word-perfect": "lyricist",
  "win-fuzzy-lyric-match": "lyricist", "make-10-fuzzy-matches-one-lyricist-game": "lyricist",
  "recall-10-lyric-lines-word-perfect": "lyricist", "recall-50-lyric-lines-word-perfect": "lyricist", "recall-100-lyric-lines-word-perfect": "lyricist",
  "recall-1000-lyric-lines-word-perfect": "lyricist", "recall-whole-verse-word-perfect": "lyricist", "answer-3-rounds-same-song": "lyricist",
  "streak-3-same-album": "catalogue", "score-nearly-every-studio-album-one-game": "catalogue", "answer-cardigan-betty-august-one-game": "catalogue",
  "streak-3-b-titles": "catalogue", "miss-1000-rounds-lifetime": "catalogue", "answer-if-this-was-a-movie": "catalogue",
  "streak-3-rare-words-no-ultra": "catalogue", "answer-paris-for-somewhere": "catalogue", "answer-every-catalogue-song": "catalogue",
  /* The 2026-08-18 batch, all one theme: every charm in it is a fact about the records. */
  "answer-song-titled-the-prompt-word": "catalogue", "answer-5-songs-titled-the-prompt-word": "catalogue",
  "answer-alternate-version-when-base-would-do": "catalogue", "answer-3-fifth-tracks-one-game": "catalogue",
  "answer-thirteenth-track-on-page-13": "catalogue", "answer-aoty-word-from-another-aoty-album": "catalogue",
  "answer-vault-track-for-tv-track-title": "catalogue", "answer-song-saying-word-20-times": "catalogue",
  "answer-song-with-word-in-first-line": "catalogue", "answer-song-with-word-in-last-line": "catalogue",
  "answer-shortest-and-longest-titles-one-game": "catalogue", "type-title-punctuation-exactly": "catalogue",
  "answer-title-starting-with-last-word-of-previous": "catalogue", "answer-karma-for-cat": "catalogue",
  "answer-gold-rush-for-folklore": "catalogue", "answer-way-back-home": "catalogue",
  "answer-begin-again-for-wednesday-on-a-wednesday": "catalogue", "answer-only-me-for-friday-on-a-friday-night": "catalogue",
  "submit-the-man-for-karma": "catalogue", "submit-speak-now-for-wedding": "catalogue",
  "submit-lwymmd-for-grave": "catalogue", "submit-wrong-song-from-same-titled-albums-record": "catalogue",
  "defeat-first-challenge": "challenges", "defeat-every-challenge": "challenges", "unlock-every-challenge": "challenges",
  "defeat-challenge-no-misses": "challenges", "defeat-challenge-after-7-runs": "challenges",
  "defeat-impostor-flawlessly": "challenges", "fall-for-first-impostor": "challenges", "defeat-common-thread-every-line": "challenges",
  "beat-revolving-door-before-swap": "challenges", "win-home-invasion-clock-untouched": "challenges", "win-shrinking-timer-all-pages-under-10s": "challenges",
  "win-sea-of-songs-no-decoys": "challenges", "win-lyric-lover-all-lines-word-perfect": "challenges", "clear-double-trouble-all-13-two-songs-each": "challenges",
  "win-vanishing-word-all-answers-blind": "challenges", "win-deep-cut-all-correct-same-album": "challenges",
  "bank-press-your-luck-pot-5-pages-deep": "challenges", "win-insurance-no-shields-spent": "challenges", "win-confidence-wager-max-every-page": "challenges",
  "lose-insurance-page-1-shields-unspent": "challenges",
  "win-long-story-long-no-titles-banked": "challenges", "win-long-story-long-filling-target-early": "challenges",
  "beat-dark-side-no-misses": "challenges",
  /* Dark sides are a challenge's hard mode, so the three rungs of the dark ladder sit in
     Challenges beside the base ones rather than off in a section of their own. */
  "beat-first-dark-side": "challenges", "beat-5-dark-sides": "challenges", "beat-every-dark-side": "challenges",
  "beat-first-album-focus": "albumFocus", "beat-all-12-album-focus": "albumFocus", "perfect-album-focus": "albumFocus", "perfect-all-12-album-focus": "albumFocus",
  "perfect-album-focus-ultra": "albumFocus", "perfect-album-focus-lyricist": "albumFocus",
  "finish-first-custom-run": "custom", "keep-5-custom-presets": "custom", "reach-round-50-endless-custom": "custom", "perfect-custom-at-least-ultra": "custom",
  "admit-guest": "guests", "admit-guest-hard": "guests", "admit-guest-lyricist": "guests",
  "finish-first-bonus-run": "bonus", "play-every-bonus-game": "bonus", "clean-sweep-bonus-game": "bonus",
  "clean-sweep-every-bonus-game": "bonus", "keep-bonus-sleeve": "bonus", "sweep-spot-the-slip": "bonus",
  "sweep-name-that-song-one-line-each": "bonus", "sweep-sing-it-back-all-words-exact": "bonus", "name-redacted-song-no-strips-removed": "bonus",
  "take-rarest-only-here-card-all-10-pages": "bonus", "finish-then-what-unbroken-chain": "bonus", "take-commonest-only-here-card": "bonus",
  "name-redacted-song-after-buying-all-strips": "bonus", "time-out-all-10-only-here-pages": "bonus", "finish-bonus-run-one-page-short-of-sweep": "bonus",
  "name-ruthless-page-off-one-word": "ruthless", "finish-ruthless-run-naming-all-ten": "ruthless",
  "finish-ruthless-run-with-no-wrong-guess": "ruthless", "every-ruthless-lens-best-under-90s": "ruthless",
  "every-ruthless-lens-best-under-60s": "ruthless", "every-ruthless-lens-best-under-45s": "ruthless",
  "give-up-a-page-and-still-beat-last-ruthless-run": "ruthless",
  "name-ruthless-page-just-after-its-title-appears": "ruthless",
  "flag-spot-the-slip-impostor-under-2s": "bonus",
  "unlock-mastery": "mastery", "reach-level-10-one-skill": "mastery", "wear-prestige-title": "mastery",
  "all-five-skills-level-8": "mastery", "cap-every-skill": "mastery", "reach-mastery-max-level": "mastery",
  "earn-ink-in-all-five-skills-one-run": "mastery", "wear-every-mastery-cosmetic-at-once": "mastery",
  "wear-blank-start-button": "mastery", "set-every-cosmetic-to-random": "mastery",
  "reach-round-89-infinite": "infinite",
  /* Nemesis: the charms that read your own per-word history back to you. The Cycle Ends sits
     here rather than under Catalogue because it is the lower rung of a ladder whose upper rung
     is answer-most-missed-word, and a ladder split across two themes reads as two unrelated
     charms. */
  "answer-nemesis-word": "nemesis", "answer-word-missed-in-earlier-game": "nemesis",
  "miss-same-word-in-3-games": "nemesis", "answer-most-missed-word": "nemesis",
  "be-dealt-every-prompt-word": "nemesis",
  /* The long haul: everything priced in days on the calendar or rounds on the clock rather than
     in one good run. Pulled out of Core, which used to hold nearly half the roster on its own. */
  "play-7-days-in-row": "longhaul", "play-on-13-different-days": "longhaul",
  "play-in-every-month": "longhaul", "answer-500-rounds-correct-lifetime": "longhaul",
  "play-1989-rounds-lifetime": "longhaul", "play-89-games": "longhaul",
  /* The games-played ladder, whole. 5 and 15 sat in Core while 89 sat here, which read as two
     unrelated charms rather than three rungs of one — the same split the Nemesis note above
     argues against. A game count is priced in runs on the clock, so all three belong here. */
  "play-5-games": "longhaul", "play-15-games": "longhaul",
  "answer-50-correct-in-a-row-across-games": "longhaul",
  /* Perfect pages: the 13/13 board and the streaks that lead to it. A charm belongs here when
     the feat is "nothing dropped", whatever mode it was dropped in — so the mode-flavoured
     perfects (Ultra, Lyricist, one album) sit with their siblings rather than in their modes,
     where each would be the odd perfectionist out. */
  "perfect-13": "perfect", "perfect-13-hard": "perfect", "perfect-13-ultra": "perfect",
  "perfect-13-lyricist": "perfect", "perfect-13-every-mode": "perfect", "perfect-13-all-one-album": "perfect",
  "perfect-13-no-wrong-submissions": "perfect", "perfect-13-two-games-in-row": "perfect",
  "win-ultra-10-correct": "perfect", "beat-personal-best-score": "perfect",
  "win-with-no-hints-or-timeouts": "perfect", "streak-5": "perfect", "streak-10": "perfect",
  /* Against the clock: everything priced in seconds. Both directions count — the sub-second
     answers and the deliberate crawls — because what they share is that the timer, not the
     song, is the thing being played. */
  "answer-under-2s": "clock", "round-1-under-2s": "clock", "answer-under-1s-left": "clock",
  "answer-under-half-second-left": "clock", "average-under-3s-per-answer": "clock",
  "answer-all-13-rounds-under-3s": "clock", "answer-under-1s-three-rounds-running": "clock",
  "perfect-13-every-answer-under-2s": "clock", "win-without-clock-dropping-below-half": "clock",
  "finish-without-timer-red-zone": "clock", "answer-in-final-second-all-13-rounds": "clock",
  "win-with-every-answer-over-10s": "clock", "time-out-with-right-answer-typed": "clock",
  "type-nothing-until-2s-left-then-answer-right": "clock", "finish-with-no-timeouts": "clock",
  "finish-no-timeouts-2-games-in-row": "clock",
  /* The crossed-out lines: the charms you earn by getting it wrong, giving up, or repeating
     yourself. Nearly all of them are secret, so the section stays empty until the first one
     lands — recover-after-miss keeps it from being a theme with no visible way in. */
  "recover-after-miss-3-times-one-game": "misfires", "score-zero": "misfires", "score-12": "misfires",
  "finish-with-no-answers": "misfires", "submit-same-wrong-answer-5-times-one-round": "misfires",
  "answer-13-wrong-having-typed-every-round": "misfires", "miss-round-after-every-hint": "misfires",
  "submit-answer-in-all-caps": "misfires", "submit-prompt-word-as-answer": "misfires",
  "submit-title-answer-off-limits": "misfires",
  "quit-round-1-before-typing": "misfires", "give-up-after-12-before-13": "misfires",
  "take-first-suggestion-all-13-rounds": "misfires", "answer-same-song-twice-in-row": "misfires",
  "answer-same-song-3-times-one-game": "misfires", "same-final-score-3-games-in-row": "misfires",
  "answer-right-with-song-given-wrongly-earlier": "misfires", "score-zero-then-perfect-13-next-game": "misfires",
  /* In the margins: everything earned off the answer line. The eggs and props you have to go
     looking for, the keepsakes, and the coincidences of clock and calendar — a charm here is
     about when or where you were sitting, never how well you played. */
  "watch-snow-fall": "margins", "watch-autumn-leaves-fall": "margins",
  "tap-scarf-doodle-13-times": "margins", "tap-every-page-mark": "margins",
  "tap-desk-mug-1000-times": "margins",
  "type-reputation-tv": "margins", "open-settings-menu": "margins",
  "save-first-bracelet-keepsake": "margins", "find-every-polaroid-keepsake": "margins",
  "play-word-from-searcher": "margins", "play-between-midnight-and-1am": "margins",
  "keep-page-company-past-midnight": "margins", "play-whole-game-in-3am-hour": "margins",
  "answer-rain-on-monday": "margins", "answer-august-in-august": "margins",
  "score-7-on-the-7th": "margins", "play-at-1313-on-the-13th": "margins",
  "play-on-taylors-birthday": "margins", "play-all-seven-weekdays": "margins",
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
  fence: [76, 64], scarf: [50, 58], cat: [64, 52],
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

// Message in a bottle — a corked sea-glass bottle with a rolled note inside,
// drifting out from behind the SIDE edge of the notebook (see surfaceBottle in
// app.js) and bobbing on a little wake for BOTTLE_SURFACE_MS before floating back.
// Catch it with a click and the cork pops, the note unrolls, and a real Taylor
// liner-note secret message (from secret-messages.json, lazy-loaded on first
// surface) is revealed with its song + album. Sea-glass + kraft-cork palette so it
// sits on the desk like the whale does, no album art. Lies horizontal, cork pointing
// outward (right); the wrapper flips it with scaleX when it surfaces on the left edge.
export const BOTTLE_SURFACE_MS = 13000;
export const BOTTLE_SVG = `<svg viewBox="0 0 132 64" role="img"><title>A corked glass bottle with a rolled note inside, bobbing beside the page</title>
  <!-- rolled note, seen through the glass -->
  <g>
    <rect x="20" y="21" width="58" height="22" rx="6" fill="#efe3c4"/>
    <ellipse cx="20" cy="32" rx="4" ry="11" fill="#e2d3a9"/>
    <ellipse cx="78" cy="32" rx="4" ry="11" fill="#f4ebd2"/>
    <g stroke="#a8966b" stroke-width="1.3" stroke-linecap="round" opacity=".65">
      <path d="M30 27 H66"/><path d="M28 32 H68"/><path d="M31 37 H63"/>
    </g>
  </g>
  <!-- glass body: rounded base at left, shoulder tapering to a neck on the right -->
  <path d="M14 12 H84 Q93 12 95 23 L107 23 L107 41 L95 41 Q93 52 84 52 H14 Q5 52 5 43 V21 Q5 12 14 12 Z"
        fill="#9cc0b0" fill-opacity=".42" stroke="#6f9a88" stroke-width="2.3" stroke-linejoin="round"/>
  <!-- neck lip -->
  <rect x="103" y="22" width="5" height="20" rx="2" fill="#9cc0b0" fill-opacity=".5" stroke="#6f9a88" stroke-width="1.8"/>
  <!-- cork -->
  <rect x="106" y="24" width="15" height="16" rx="3.2" fill="#c08a4d" stroke="#8f6231" stroke-width="1.6"/>
  <rect x="106" y="24" width="5.5" height="16" rx="2.6" fill="#a9743c" opacity=".6"/>
  <!-- glass highlights -->
  <path d="M15 18 Q10 22 11 34" stroke="#ffffff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".45"/>
  <path d="M22 47 H80" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity=".22"/>
</svg>`;
// A gentle wake the bottle rides on — two nested waves, drawn beneath it, sea tint.
export const BOTTLE_WAVE_SVG = `<svg viewBox="0 0 140 24" aria-hidden="true">
  <path d="M2 10 q10 -7 20 0 t20 0 t20 0 t20 0 t20 0 t20 0" fill="none" stroke="#7fa8b6" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>
  <path d="M8 18 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0" fill="none" stroke="#a6c3cd" stroke-width="2" stroke-linecap="round" opacity=".55"/>
</svg>`;
