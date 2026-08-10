// Dev cheats panel — loaded only behind the ?dev flag (see devActive in app.js).
// Deliberately un-notebook (dark, monospace, fixed corner) so it can never be
// confused with the game UI. Receives a curated `api` from app.js's buildDevApi.
// Pure config data (achievement/icon tables for the charm gallery) is imported
// directly rather than routed through the api.

import { ACHIEVEMENTS, ACH_ICONS, ACH_GROUPS, ACH_GROUP_OF, ACH_GROUP_COLORS,
         CHALLENGES, CHALLENGE_SEALS, WAX_SEEDS, WAX_AUTO_IDS, reseedSeal, waxPourFaults } from "./config.js";

export function initDev(api) {
  injectStyles();

  // ---- helpers ---------------------------------------------------------------
  const mk = (tag, attrs = {}, ...kids) => {
    const e = document.createElement(tag);
    for (const k in attrs) {
      if (k === "class") e.className = attrs[k];
      else if (k === "html") e.innerHTML = attrs[k];
      else if (k.startsWith("on")) e.addEventListener(k.slice(2), attrs[k]);
      else e.setAttribute(k, attrs[k]);
    }
    for (const kid of kids) e.append(kid && kid.nodeType ? kid : document.createTextNode(kid));
    return e;
  };
  const btn = (label, fn, cls = "") => mk("button", { class: "dv-btn " + cls, onclick: fn }, label);
  const select = (items, getVal, getLabel) => {
    const s = mk("select", { class: "dv-sel" });
    for (const it of items) s.append(mk("option", { value: getVal(it) }, getLabel(it)));
    return s;
  };
  const num = (val, w = 46) => mk("input", { type: "number", class: "dv-num", value: String(val), style: `width:${w}px` });
  const row = (...kids) => mk("div", { class: "dv-row" }, ...kids);
  const section = (title, ...kids) => mk("div", { class: "dv-sec" }, mk("div", { class: "dv-sec-t" }, title), ...kids);

  // ---- panel shell -----------------------------------------------------------
  const body = mk("div", { class: "dv-body" });
  const readout = mk("div", { class: "dv-readout" }, "—");
  const head = mk("div", { class: "dv-head" },
    mk("span", { class: "dv-title" }, "🔧 dev cheats"),
    readout,
    mk("button", { class: "dv-collapse", onclick: () => panel.classList.toggle("dv-min") }, "▾"));
  const panel = mk("div", { id: "dev-panel" }, head, body);
  // Honour a persisted "hidden" preference: backtick-hiding sticks across reloads
  // (the panel is still armed/loaded, just collapsed away until backtick brings it back).
  const HIDE_KEY = "swiftSongAssociation.devHidden";
  if (localStorage.getItem(HIDE_KEY) === "1") panel.classList.add("dv-hidden");
  document.body.append(panel);

  // ---- Inspect ---------------------------------------------------------------
  const answerBox = mk("pre", { class: "dv-pre", style: "display:none" });
  let revealOpen = false;
  body.append(section("inspect",
    row(btn("reveal answers", () => { revealOpen = !revealOpen; answerBox.style.display = revealOpen ? "" : "none"; renderReveal(); }),
        btn("short lines", () => { revealOpen = true; answerBox.style.display = ""; renderShortLines(); }),
        btn("log state", () => console.log("[dev] state", api.getState()))),
    answerBox));
  function renderReveal() {
    if (!revealOpen) return;
    const st = api.getState();
    if (!st.valid.length) { answerBox.textContent = `"${st.word || "—"}" — no valid songs (or not in a round)`; return; }
    answerBox.textContent = `"${st.word}" → ${st.valid.length} song(s)\n` +
      st.valid.map((v) => `• ${v.title}${v.album ? "  [" + v.album + "]" : ""}\n    “${v.line}”`).join("\n");
  }
  // Sub-floor lines of this round's valid songs: ✓ ones the whole-line exception accepts,
  // ✗ ones a guard rejects (with the reason). Shares the reveal box, so it also spoils
  // the answers — same drawer, same warning.
  function renderShortLines() {
    const rows = api.shortLines();
    const st = api.getState();
    if (!rows.length) { answerBox.textContent = `"${st.word || "—"}" — no sub-floor lines in this round's songs`; return; }
    answerBox.textContent = `"${st.word}" — ${rows.filter((r) => r.accepted).length}/${rows.length} short lines accepted\n` +
      rows.map((r) => `${r.accepted ? "✓" : "✗"} “${r.line}”  — ${r.title}${r.why ? "  (" + r.why + ")" : ""}`).join("\n");
  }

  // ---- Round control ---------------------------------------------------------
  const wordInput = mk("input", { class: "dv-text", list: "dv-words", placeholder: "force word…", style: "width:120px" });
  const wordList = mk("datalist", { id: "dv-words" });
  api.words().forEach((w) => wordList.append(mk("option", { value: w })));
  const jumpN = num(1);
  const scoreN = num(0);
  body.append(section("round",
    row(btn("✓ correct", () => api.answer("correct")),
        btn("✗ wrong", () => api.answer("wrong")),
        btn("⏱ timeout", () => api.answer("timeout")),
        btn("↪ advance", () => api.advance())),
    row(wordInput, wordList, btn("set word", () => { if (wordInput.value.trim()) api.setWord(wordInput.value.trim()); })),
    row("jump→", jumpN, btn("go", () => api.jumpToRound(+jumpN.value)),
        "score=", scoreN, btn("set", () => api.setScore(+scoreN.value)),
        btn("end now", () => api.endNow(), "warn"))));

  // ---- Simulate --------------------------------------------------------------
  const simN = num(13);
  const simType = select(["classic", "infinite", "daily"], (x) => x, (x) => x);
  const simMode = select(api.MODE_ORDER, (x) => x, (x) => x);
  body.append(section("simulate full game",
    row("correct=", simN, "/13"),
    row(simType, simMode, btn("run", () => api.simulate(+simN.value, { type: simType.value, mode: simMode.value }))),
    row(btn("auto-win 13/13", () => api.simulate(13, { type: "classic", mode: simMode.value })),
        btn("auto-lose 0/13", () => api.simulate(0, { type: "classic", mode: simMode.value })))));

  // ---- Start games -----------------------------------------------------------
  const startMode = select(api.MODE_ORDER, (x) => x, (x) => x);
  const infVar = select(["3lives", "sudden"], (x) => x, (x) => x);
  body.append(section("start game",
    row(startMode, btn("start classic", () => api.start(startMode.value))),
    row(infVar, btn("start infinite", () => api.startInfinite(infVar.value)),
        btn("start daily", () => api.startDaily()))));

  // ---- Ruthless board --------------------------------------------------------
  // The lens sheet is drawn from the records, and its two states read quite differently: a lens
  // with a time carries it in the margin and a note saying how it was got, an unplayed one shows
  // a dash. Getting a real time on the board means playing ten pages at a word a second, so seed
  // them instead — `fill` for the whole sheet, the row below for one lens at a chosen time.
  const rlLens = select(api.ruthless.board().map((r) => r.lens), (x) => x, (x) => x);
  const rlSecs = num(180);
  body.append(section("ruthless board",
    row(btn("fill board", () => { readout.textContent = api.ruthless.fill(); }),
        btn("clear board", () => { readout.textContent = api.ruthless.reset(); }, "warn")),
    row(rlLens, "best=", rlSecs, "s",
        btn("seed", () => { api.ruthless.seed(rlLens.value, +rlSecs.value); readout.textContent = `${rlLens.value}: best ${rlSecs.value}s`; }),
        btn("seed + gave up 1", () => { api.ruthless.seed(rlLens.value, +rlSecs.value, 1); readout.textContent = `${rlLens.value}: best ${rlSecs.value}s, 1 given up`; }))));

  // ---- Challenges ------------------------------------------------------------
  // Dark sides open only after the base challenge is beaten. This unlocks every one through
  // the real gate (base marked defeated + unlocked, dark progress left untouched) so they can
  // be played from the Challenges screen — then reports the count in the readout.
  // Persistence tickets need seven finished runs to become claimable, which is not something
  // anyone is going to sit through to check the card — `ready` parks the chosen challenge on
  // the claimable edge, and the wallet setter reaches the buy states from the other side.
  const persistSel = select(api.challenge.list(), (x) => x, (x) => x);
  const ticketN = num(2);
  body.append(section("challenges",
    row(btn("unlock all dark sides", () => { const n = api.challenge.dark.unlockAll(); readout.textContent = `${n} dark sides unlocked — open Challenges`; }),
        btn("relock dark progress", () => { api.challenge.dark.reset(); readout.textContent = "dark progress cleared"; }, "warn")),
    row(persistSel, btn("ready a ticket", () => {
          api.challenge.persist.ready(persistSel.value);
          readout.textContent = `${persistSel.value}: ticket claimable — open its card`;
        }),
        btn("state", () => { readout.textContent = JSON.stringify(api.challenge.persist.state(persistSel.value)); })),
    row("tickets=", ticketN, btn("set wallet", () => {
          readout.textContent = `${api.challenge.persist.tickets(+ticketN.value)} persistence tickets`;
        }),
        btn("clear persistence", () => { api.challenge.persist.reset(); readout.textContent = "persistence cleared"; }, "warn")),
    // Flourish charms hide behind ??? until their challenge is defeated, so checking how one
    // reads as a revealed target otherwise means actually beating the challenge first.
    row(btn("defeat all (reveal flourishes)", () => { const n = api.challenge.defeat();
          readout.textContent = `${n} challenges marked defeated — open Achievements`; }),
        btn("clear defeats", () => { api.challenge.undefeat(); readout.textContent = "defeats cleared — flourishes masked again"; }, "warn"))));

  // ---- Word / Era / Mode -----------------------------------------------------
  const eraSel = select(api.ERAS, (x) => x, (x) => x);
  const modeSel = select(api.MODE_ORDER, (x) => x, (x) => x);
  body.append(section("era / mode",
    row(eraSel, btn("apply era", () => api.setEra(eraSel.value)),
        modeSel, btn("set mode", () => api.setMode(modeSel.value))),
    // "Start writing" is a very slightly different gold on every load, by design. Rolling it on
    // demand is the only way to watch the spread without reloading a hundred times, and pinning
    // it to the nominal fill is how you check a suspect shade really is just the jitter.
    row("start gold:", btn("re-roll", () => { api.ctaGold.roll(); readout.textContent = api.ctaGold.state(); }),
        btn("pin to nominal", () => { api.ctaGold.fix(); readout.textContent = api.ctaGold.state(); }),
        btn("state", () => { readout.textContent = api.ctaGold.state(); }))));

  // ---- Onboarding / first-run ------------------------------------------------
  const obAlbumSel = select(["", ...api.STUDIO_ALBUMS], (x) => x, (x) => x || "no favourite");
  // Each guided beat is placement-sensitive (it must dodge the word and the input), so give
  // every one its own button — checking them across viewport widths is the whole point.
  const beatSel = select(api.GUIDE_BEAT_IDS, (x) => x, (x) => x.replace("guide", "").toLowerCase() + " beat");
  body.append(section("onboarding",
    row(btn("replay first-run", () => api.onboarding.replay()),
        btn("ready-for-normal nudge", () => api.onboarding.normalNudge())),
    row(btn("era prompt", () => api.onboarding.eraPrompt()),
        btn("mark done", () => { api.onboarding.markDone(); toast("first-run marked done"); })),
    row(btn("replay guided round", () => { api.onboarding.guideReplay(); toast("guided-round beats re-armed"); }),
        btn("replay word-forms note", () => { api.onboarding.formsReplay(); toast("word-forms note re-armed"); })),
    row(beatSel, btn("show beat", () => {
      toast(api.onboarding.guideBeat(beatSel.value) ? beatSel.value + " shown" : "can't anchor — need an open round");
    })),
    row(obAlbumSel, btn("set era", () => { api.onboarding.setEra(obAlbumSel.value); toast("era → " + (obAlbumSel.value || "none")); })),
    // The persistent testing flag (same switch as ?intro=0 / ?intro=1 on the URL): stop every
    // one-time greeting getting in the way of a session, or hand them all back.
    row(btn("silence intros (persists)", () => { api.onboarding.quiet(true); toast("first impressions silenced"); }),
        btn("restore intros", () => { api.onboarding.quiet(false); toast("first impressions restored — reload"); })),
    row(btn("reset", () => { api.onboarding.reset(); toast("onboarding reset"); }, "warn"))));

  // ---- Timer -----------------------------------------------------------------
  let frozen = false;
  const freezeBtn = btn("freeze", () => {
    if (!frozen) { if (api.timer.freeze()) { frozen = true; freezeBtn.textContent = "unfreeze"; freezeBtn.classList.add("on"); } }
    else { api.timer.unfreeze(); frozen = false; freezeBtn.textContent = "freeze"; freezeBtn.classList.remove("on"); }
  });
  body.append(section("timer",
    row(freezeBtn, btn("+5s", () => api.timer.add(5)), btn("−5s", () => api.timer.add(-5)),
        btn("set 3s", () => api.timer.set(3)), btn("disable", () => { api.timer.disable(); frozen = false; freezeBtn.textContent = "freeze"; freezeBtn.classList.remove("on"); }, "warn"))));

  // ---- Sound -------------------------------------------------------------------
  // Audition buttons force each effect past the sound setting (api.sound.play).
  // "countdown" plays the last-three-seconds ladder as a sequence, which is the only
  // way to judge it: the "tick" button next to it is one third of the cue. "strike" is the
  // same idea for the pencil scratch — it spends a real life so the sound is heard under the
  // mark it belongs to, which the bare "scratch" button can't show. "flourish" is the third:
  // the closing sound only reads correctly in the gap after a verdict chime, and "+ charm"
  // adds the unlock chime behind it, the way a run that ends holding new charms sounds.
  body.append(section("sound",
    row(...api.sound.names().map((n) => btn("🔊 " + n, () => api.sound.play(n))),
        btn("all", () => api.sound.all()),
        btn("countdown", () => api.sound.countdown()),
        btn("strike", () => toast("strike: " + api.sound.strike())),
        btn("flourish", () => api.sound.flourish()),
        btn("flourish + charm", () => api.sound.flourish(true)),
        btn("state", () => toast("audio: " + api.sound.state())))));

  // ---- Date ------------------------------------------------------------------
  // Pretend it's another day. One override behind every dated surface at once — the
  // daily gate and seed, the anniversary slip, the milestone sticky and the desk
  // calendar — so they can never disagree. Session-only: reload and it's really today
  // again. "jump" lists every day the calendar marks (releases, her birthday, the
  // lyric days), which is the fast way to check a mark landed on the right square.
  const showDate = (d) => { dateInput.value = d; toast("date → " + d); };
  // Applies as soon as the picker commits a date (change, not keystroke), so choosing
  // a date just works; "set" stays for typing straight into the field.
  const dateInput = mk("input", { type: "date", class: "dv-text", style: "width:124px",
    onchange: () => showDate(api.date.set(dateInput.value)) });
  const markSel = select(api.date.marked(), (m) => m.key, (m) => m.label);
  body.append(section("date",
    row(dateInput, btn("set", () => showDate(api.date.set(dateInput.value))),
        btn("-1 day", () => showDate(api.date.shift(-1))),
        btn("+1 day", () => showDate(api.date.shift(1))),
        btn("live", () => { const d = api.date.clear(); dateInput.value = ""; toast("date → live (" + d + ")"); })),
    row(markSel, btn("jump", () => showDate(api.date.set(markSel.value))))));

  // ---- Daily -----------------------------------------------------------------
  // "preview album pool" dumps an anniversary daily to the console without playing it: the
  // pool behind the words and the 13 the seed really draws. It follows the date override,
  // so set a release date above to read that album; "all albums" ignores the day and dumps
  // every studio album's anniversary, which is the view that lets them be compared. "5 years"
  // replays the same anniversary across five of them and counts the words each year hands
  // back from the last, which is the one thing playing today can never show you.
  const stCur = num(5), stBest = num(9);
  body.append(section("daily",
    row(btn("reset today (replay)", () => { api.daily.resetToday(); toast("today's daily cleared"); }),
        btn("clear in-progress", () => { api.daily.clearProgress(); toast(api.daily.hasProgress() ? "still in progress" : "in-progress cleared"); })),
    row("streak cur", stCur, "best", stBest, btn("set", () => { api.daily.setStreak(+stCur.value, +stBest.value); toast("streak set"); })),
    row(btn("preview album pool", () => {
          const r = api.daily.preview();
          api.daily.dump(r.date);
          toast(r.pool ? `${r.album}: pool ${r.size}${r.relaxed ? " (relaxed)" : ""} — see console` : "no album pool that day");
        }),
        btn("all albums", () => toast(api.daily.dump())),
        btn("5 years", () => {
          const y = api.daily.years();
          if (!y.years) { toast("no album pool that day"); return; }
          console.group(`${y.album} — same anniversary, ${y.years.length} years (exp ${y.exp})`);
          for (const r of y.years) console.log(`${r.year}  repeats ${r.repeats === null ? "—" : r.repeats + "/13"}   ${r.words.join(", ")}`);
          console.log(`${y.distinct}/${y.of} distinct words overall`);
          console.groupEnd();
          toast(`${y.album}: ${y.distinct}/${y.of} distinct — see console`);
        }))));

  // ---- Seeding ---------------------------------------------------------------
  const achSel = select(api.ACHIEVEMENTS, (a) => a.id, (a) => a.name + (a.secret ? " (hidden)" : ""));
  const histN = num(25);
  const nameInput = mk("input", { class: "dv-text", placeholder: "name", style: "width:96px" });
  body.append(section("seed data",
    row(btn("fake records", () => { api.seed.records(); toast("records seeded"); }),
        btn("seed history", () => { api.seed.history(+histN.value); toast("history seeded"); }), histN),
    row(btn("seed tally", () => { api.seed.tally(); toast("tally seeded"); }),
        btn("unlock all ach", () => { api.seed.unlockAch(); toast("all achievements unlocked"); }),
        btn("lock all", () => { api.seed.lockAch(); toast("achievements cleared"); }, "warn")),
    row(achSel, btn("fire", () => api.seed.fireAch(achSel.value)),
        btn("remove", () => { api.seed.removeAch(achSel.value); toast("achievement removed"); }, "warn")),
    // Stocks the results band's charm half: fire enough at once to push it past its cap.
    row(btn("fire 8 (recap band)", () => toast(api.seed.fireBatch(8) + " charms fired — now end a game")),
        btn("fire 2", () => toast(api.seed.fireBatch(2) + " charms fired"))),
    row(nameInput, btn("set name", () => { if (nameInput.value.trim()) { api.seed.setName(nameInput.value.trim()); toast("name set"); } }))));

  // ---- Skills & Mastery ------------------------------------------------------
  const mSkillSel = select(api.SKILL_IDS, (x) => x, (x) => x);
  const mLabelSel = select(["", ...api.mastery.labels()], (x) => x, (x) => x || "default");
  const mLvlN = num(10);
  const mFracN = num(0.5);
  const mMastN = num(5);
  const mGrantN = num(500, 56);
  body.append(section("mastery",
    row(btn("grant xp (all)", () => { api.mastery.grant(+mGrantN.value); toast("granted " + mGrantN.value + " xp"); }), mGrantN),
    row(mSkillSel, "lvl", mLvlN, btn("set skill", () => { api.mastery.setSkillLevel(mSkillSel.value, +mLvlN.value); toast("skill set"); }),
        btn("max all", () => { api.mastery.maxSkills(); toast("skills maxed"); })),
    row("frac", mFracN, btn("set skill frac", () => { api.mastery.setSkillFrac(mSkillSel.value, +mLvlN.value, +mFracN.value); toast("skill frac set"); })),
    row("mastery lvl", mMastN, btn("set", () => { api.mastery.setMasteryLevel(+mMastN.value); toast("mastery set"); }),
        btn("unlock rewards", () => { api.mastery.unlockRewards(); toast("rewards unlocked"); }),
        btn("lock rewards", () => { api.mastery.lockRewards(); toast("rewards locked"); })),
    // Random charm strands. The seed moves once a run, so without these the only way to see
    // a second strand is to finish a first one; "reshuffle" deals a new one mid-run and
    // "peek" prints the 13 charms it would hang without needing a bracelet on screen.
    row(btn("charms: random", () => { api.mastery.charm("random"); toast("random strand on"); }),
        btn("charms: star", () => { api.mastery.charm(""); toast("back to the star"); }),
        btn("reshuffle", () => toast("seed " + api.mastery.reshuffle())),
        btn("peek strand", () => toast(api.mastery.strand().join(" · ")))),
    // The start button's words (level 12). The reward board previews them all, but only the
    // real button shows a label at full size in its actual slot, and only these buttons get
    // there without unlocking the tier first. "default" puts the ✎ glyph back.
    row("start words", mLabelSel,
        btn("set", () => { api.mastery.label(mLabelSel.value); toast("button says: " + (mLabelSel.value || "Start writing")); }),
        btn("default", () => { api.mastery.label(""); toast("back to Start writing"); })),
    // The level-13 finale: the gold-foil hero only ever renders at the cap, which is the one
    // state a testing session can't reach honestly. Each button also sets the motion pair
    // that decides how much of it draws, so all three renders are one press apart.
    row("finale", btn("full", () => toast(api.mastery.finale("full"))),
        btn("reduce motion", () => toast(api.mastery.finale("reduce"))),
        btn("reduced flashing", () => toast(api.mastery.finale("flash")))),
    row(btn("open page", () => api.mastery.open()),
        btn("reset mastery", () => { api.mastery.reset(); toast("mastery reset"); }, "warn"))));

  // ---- Visual eggs -----------------------------------------------------------
  const penSel = select(["", "quill", "fountain", "glitter"], (x) => x, (x) => x || "no pen");
  const doodleSel = select(["cat", "guitar", "scarf", "fence", "thirteen", "snake", "cardigan", "mirrorball", "paperplane", "willow", "seagulls"], (x) => x, (x) => x);
  // Seasonal-layer toggles bypass the calendar/clock gate but still respect
  // reduce-motion, so they exercise the real effect rather than a special case.
  const snowBtn = btn("snow", () => snowBtn.classList.toggle("on", api.eggs.snow()));
  const rainBtn = btn("rain", () => rainBtn.classList.toggle("on", api.eggs.rain()));
  const leafBtn = btn("leaves", () => leafBtn.classList.toggle("on", api.eggs.leaves()));
  body.append(section("eggs",
    row(btn("snake", () => api.eggs.snake()), doodleSel, btn("doodle", () => api.eggs.doodle(doodleSel.value)),
        btn("sparkle", () => api.eggs.sparkle())),
    row(btn("star shower", () => api.eggs.starShower()), btn("blue wash", () => api.eggs.blueWash()),
        btn("secret 13", () => api.eggs.secret13())),
    row(btn("yes whale", () => api.eggs.whale())),
    row(snowBtn, rainBtn, leafBtn),
    row(penSel, btn("set pen", () => api.eggs.pen(penSel.value)))));

  // ---- The scrolling desk ------------------------------------------------------
  // Composition tooling, because the whole thing is a judgement call: reseed to
  // see whether the rhythm survives a different draw, "only" to judge one
  // incident type on its own, and showcase to look at the drawings with the
  // composition taken out of the way.
  const scDensN = num(1, 40);
  const scTypeSel = select(["", "spill", "strand", "row", "handful", "stray"], (x) => x, (x) => x || "all types");
  const scStat = () => {
    const s = api.scatter.stats();
    return `${s.incidents} incidents · ${s.beads} beads · ${s.props} props · ${s.marks} marks`;
  };
  const scPropsBtn = btn("props", () => scPropsBtn.classList.toggle("on", api.scatter.props()));
  const scMarksBtn = btn("marks", () => scMarksBtn.classList.toggle("on", api.scatter.marks()));
  const scDbgBtn = btn("bands", () => scDbgBtn.classList.toggle("on", api.scatter.debug()));
  scPropsBtn.classList.add("on");
  scMarksBtn.classList.add("on");
  body.append(section("desk",
    row(btn("rebuild", () => { api.scatter.rebuild(); toast(scStat()); }),
        btn("reseed", () => { api.scatter.reseed(); toast(scStat()); })),
    row("density", scDensN, btn("set", () => { api.scatter.density(+scDensN.value); toast(scStat()); })),
    row(scTypeSel, btn("only", () => { api.scatter.only(scTypeSel.value); toast(scStat()); })),
    row(scPropsBtn, scMarksBtn, scDbgBtn),
    row(btn("showcase", () => { api.scatter.showcase(); toast("one of everything, top to bottom"); }))));

  // ---- Guest stamp ink ---------------------------------------------------------
  // The plate is rolled once per page load, so without this you would be reloading to
  // see the other eight. The select is the whole palette in order.
  const inkSel = select(api.stamp.inks(), (h) => h, (h) => h);
  body.append(section("stamp",
    row(inkSel, btn("ink", () => toast(api.stamp.ink(inkSel.value))),
        btn("reroll", () => { const hex = api.stamp.reroll(); inkSel.value = hex; toast(hex); }))));

  // ---- Charm icon gallery ------------------------------------------------------
  // Every achievement charm at real render size on real paper, grouped like the
  // collection page, with duplicate-key flagging. QA tool for the icon set.
  body.append(section("icons",
    row(btn("charm gallery", openGallery), btn("seal gallery", openSeals))));

  function openGallery() {
    const old = document.getElementById("dv-gallery");
    if (old) { old.remove(); return; }

    const counts = {};
    ACHIEVEMENTS.forEach((a) => { counts[a.icon] = (counts[a.icon] || 0) + 1; });
    const dupes = Object.values(counts).filter((n) => n > 1).length;

    const grid = mk("div", { class: "dvg-body" });
    for (const g of [...ACH_GROUPS, { id: "__all", label: "" }]) {
      if (g.id === "__all") break;
      const members = ACHIEVEMENTS.filter((a) => (ACH_GROUP_OF[a.id] || "core") === g.id);
      if (!members.length) continue;
      const head = mk("div", { class: "dvg-group" },
        mk("span", { class: "dvg-dot", style: `background:${ACH_GROUP_COLORS[g.id]}` }),
        `${g.label} · ${members.length}`);
      const cells = mk("div", { class: "dvg-grid" });
      for (const a of members) {
        // group colour rides in on --bead so each charm's highlighter swipe is tinted
        // like the real earned charm (charmMarkup does the same in-game).
        cells.append(mk("div", { class: "dvg-cell" + (counts[a.icon] > 1 ? " dup" : ""), "data-tip": a.desc, style: `--bead:${ACH_GROUP_COLORS[g.id]}` },
          mk("span", { class: "charm", html: ACH_ICONS[a.icon] || "<b>?</b>" }),
          mk("span", { class: "dvg-nm" }, a.name + (a.secret ? " ✦" : "")),
          mk("span", { class: "dvg-key" }, a.icon + (counts[a.icon] > 1 ? ` ×${counts[a.icon]}` : ""))));
      }
      grid.append(head, cells);
    }

    const sizes = [26, 30, 38, 60].map((px) =>
      btn(px + "px", (e) => {
        overlay.style.setProperty("--dvg-size", px + "px");
        overlay.querySelectorAll(".dvg-size .dv-btn").forEach((b) => b.classList.toggle("on", b === e.target));
      }, px === 30 ? "on" : ""));
    // earned ⇄ locked preview: the penned charms read very differently with the
    // highlighter swipe on (earned) vs off + pencil-grey (locked), so let QA flip.
    const stateBtn = btn("earned", (e) => {
      const locked = overlay.classList.toggle("dvg-locked");
      e.target.textContent = locked ? "locked" : "earned";
    });
    const overlay = mk("div", { id: "dv-gallery", style: "--dvg-size:30px" },
      mk("div", { class: "dvg-bar" },
        mk("span", { class: "dvg-title" }, `charm gallery · ${ACHIEVEMENTS.length} charms · ${dupes ? dupes + " duped keys" : "all unique"}`),
        mk("span", { class: "dvg-size" }, ...sizes),
        stateBtn,
        btn("✕ close", () => overlay.remove())),
      grid);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });
    document.body.append(overlay);
  }

  // ---- Challenge seal gallery --------------------------------------------------
  // The charm gallery's opposite number: every challenge's wax seal at real render size on
  // real paper, grouped by tape tier. Each seal's wax is poured from the `wax` seed on its
  // motif entry, so this is also the audition bench — ← → re-pour one seal live, and "copy
  // seeds" hands back a paste-ready list of whatever you settled on, to lock into config.js.
  const SEAL_TIERS = { 1: "easy", 2: "tricky", 3: "tough", 4: "brutal", 0: "unrated" };
  function openSeals() {
    const old = document.getElementById("dv-seals");
    if (old) { old.remove(); return; }

    const seeds = { ...WAX_SEEDS };
    let state = "red";   // red (unbeaten) → aged (defeated) → dark (dark side beaten)

    const dress = (id) => {
      const svg = seeds[id] === WAX_SEEDS[id] ? CHALLENGE_SEALS[id] : reseedSeal(id, seeds[id]);
      const tinted = state === "aged" ? api.seals.aged(svg) : state === "dark" ? api.seals.dark(svg) : svg;
      return api.seals.markup(tinted);   // re-scope ids, or these fight the play page's stamp
    };
    // A pour is a pure function of its seed, so two seals sharing one would be the same
    // outline twice — the one thing this whole scheme exists to avoid. Flag it like the charm
    // gallery flags a duplicated icon key, and re-check every cell after any change.
    const dupes = () => {
      const seen = {};
      Object.values(seeds).forEach((s) => { seen[s] = (seen[s] || 0) + 1; });
      return seen;
    };
    // An auto seed is derived from the challenge id because the motif entry has no `wax`,
    // which means nobody has ever looked at that pour. Shown as "auto" rather than a number:
    // the number is noise until you decide to keep it, and then it gets written into config.
    const autoIds = new Set(WAX_AUTO_IDS);
    const seedLabel = (id) =>
      (seeds[id] === WAX_SEEDS[id] && autoIds.has(id)) ? "auto" : "wax " + seeds[id];

    const paint = (id) => {
      const cell = grid.querySelector(`[data-seal="${id}"]`);
      if (!cell) return;
      cell.querySelector(".dvs-stamp").innerHTML = dress(id);
      const sd = cell.querySelector(".dvs-seed");
      sd.textContent = seedLabel(id);
      sd.classList.toggle("moved", seeds[id] !== WAX_SEEDS[id]);
      sd.classList.toggle("auto", seeds[id] === WAX_SEEDS[id] && autoIds.has(id));
      // The generator's one known fault, so a new challenge's pour gets vetted without a
      // fresh eyeball pass over all 33. Advisory: a flagged seal still renders.
      const f = waxPourFaults(seeds[id]);
      cell.classList.toggle("fault", f.kinked);
      if (f.kinked) cell.setAttribute("title", `kinked (${f.kink}) — corners with straight edge between, worth re-pouring`);
      else cell.removeAttribute("title");
    };
    const markDupes = () => {
      const seen = dupes();
      grid.querySelectorAll("[data-seal]").forEach((c) => {
        c.classList.toggle("dup", seen[seeds[c.dataset.seal]] > 1);
      });
    };
    const bump = (id, by) => { seeds[id] = Math.max(1, seeds[id] + by); paint(id); markDupes(); };

    const grid = mk("div", { class: "dvg-body" });
    for (const tier of [1, 2, 3, 4, 0]) {
      const inTier = CHALLENGES.filter((c) => (c.tapes || 0) === tier && CHALLENGE_SEALS[c.id]);
      if (!inTier.length) continue;
      grid.append(mk("div", { class: "dvg-group" }, `${SEAL_TIERS[tier]} · ${inTier.length}`));
      const cells = mk("div", { class: "dvs-grid" });
      for (const c of inTier) {
        cells.append(mk("div", { class: "dvg-cell", "data-seal": c.id },
          mk("span", { class: "dvs-stamp", html: dress(c.id) }),
          mk("span", { class: "dvg-nm" }, c.name),
          mk("span", { class: "dvs-row" },
            btn("‹", () => bump(c.id, -1), "dvs-mini"),
            mk("span", { class: "dvs-seed" }, seedLabel(c.id)),
            btn("›", () => bump(c.id, 1), "dvs-mini"))));
      }
      grid.append(cells);
    }

    // 38/46 are the in-run corner stamp, 53 the challenge detail; 88 is for judging shape.
    const sizes = [38, 46, 53, 88].map((px) =>
      btn(px + "px", (e) => {
        overlay.style.setProperty("--dvs-size", px + "px");
        overlay.querySelectorAll(".dvs-size .dv-btn").forEach((b) => b.classList.toggle("on", b === e.target));
      }, px === 53 ? "on" : ""));

    const stateBtn = btn("red · unbeaten", (e) => {
      state = state === "red" ? "aged" : state === "aged" ? "dark" : "red";
      e.target.textContent = state === "red" ? "red · unbeaten" : state === "aged" ? "taupe · defeated" : "black · dark side";
      Object.keys(seeds).forEach(paint);
    });
    // Only the seeds that differ from config are worth pasting back — those are the decisions.
    // Falls back to the whole set when nothing has been re-poured.
    const copyBtn = btn("copy seeds", () => {
      const moved = Object.keys(seeds).filter((id) => seeds[id] !== WAX_SEEDS[id]);
      const list = moved.length ? moved : Object.keys(seeds);
      const txt = list.map((id) => `"${id}": { wax: ${seeds[id]}, ...`).join("\n");
      console.log(`[dev] ${moved.length ? "re-poured" : "all"} seal seeds — lock these into WAX_SEAL_MOTIFS\n` + txt);
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(() => toast(`${list.length} seed(s) copied`), () => toast("seeds in console"));
      else toast("seeds in console");
    });
    const resetBtn = btn("revert", () => { Object.assign(seeds, WAX_SEEDS); Object.keys(seeds).forEach(paint); markDupes(); });

    const nAuto = WAX_AUTO_IDS.length;
    const nFault = Object.keys(seeds).filter((id) => waxPourFaults(seeds[id]).kinked).length;
    const title = `seal gallery · ${Object.keys(WAX_SEEDS).length} seals` +
      (nAuto ? ` · ${nAuto} auto` : " · all locked") + (nFault ? ` · ${nFault} flagged` : "");

    const overlay = mk("div", { id: "dv-seals", style: "--dvs-size:53px" },
      mk("div", { class: "dvg-bar" },
        mk("span", { class: "dvg-title" }, title),
        mk("span", { class: "dvs-size" }, ...sizes),
        stateBtn, copyBtn, resetBtn,
        btn("✕ close", () => overlay.remove())),
      grid);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });
    document.body.append(overlay);
    Object.keys(seeds).forEach(paint);   // applies the fault flags the initial build skipped
    markDupes();
  }

  // ---- Reset (danger) --------------------------------------------------------
  body.append(section("reset",
    row(btn("records", () => { api.reset.records(); toast("records reset"); }, "warn"),
        btn("stats", () => { api.reset.stats(); toast("stats reset"); }, "warn"),
        btn("ach", () => { api.reset.ach(); toast("achievements reset"); }, "warn"),
        btn("tally", () => { api.reset.tally(); toast("tally reset"); }, "warn"),
        btn("daily", () => { api.reset.daily(); toast("daily reset"); }, "warn")),
    row(btn("WIPE ALL + reload", () => { if (confirm("Wipe ALL app data?")) { api.reset.all(); api.reload(); } }, "danger"))));

  // ---- Footer ----------------------------------------------------------------
  const noLog = mk("input", { type: "checkbox", id: "dv-nolog", onchange: (e) => { api.setNoLog(e.target.checked); toast(e.target.checked ? "test runs won't be logged" : "logging on"); } });
  body.append(section("",
    row(mk("label", { class: "dv-check" }, noLog, " don't log runs"),
        btn("→ start", () => api.goStart()), btn("reload", () => api.reload()))));

  // ---- live readout + toast --------------------------------------------------
  function tick() {
    const s = api.getState();
    readout.textContent = `${s.screen} · r${s.round}/${s.total} · ${s.score}pt · ${s.mode}/${s.gameType} · ${s.era || "—"}` +
      (s.word ? ` · “${s.word}”` : "") + (s.devDate ? ` · date:${s.devDate}` : "") + (s.devNoLog ? " · NOLOG" : "");
    renderReveal();
  }
  tick();
  setInterval(tick, 600);

  let toastEl = null, toastT = null;
  function toast(msg) {
    if (!toastEl) { toastEl = mk("div", { class: "dv-toast" }); panel.append(toastEl); }
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove("show"), 1600);
  }

  // Backtick toggles the whole panel and remembers the choice across reloads
  // (still armed — just hidden until the next backtick).
  document.addEventListener("keydown", (e) => {
    if (e.key === "`" && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) {
      const hidden = panel.classList.toggle("dv-hidden");
      try { localStorage.setItem(HIDE_KEY, hidden ? "1" : "0"); } catch (e2) { /* ignore */ }
    }
  });
  window.__dev = api;
  console.log("%c[dev] cheats armed — backtick (`) toggles the panel · window.__dev for the API", "color:#7cd");
}

function injectStyles() {
  if (document.getElementById("dev-styles")) return;
  const css = `
  #dev-panel { position: fixed; right: 10px; bottom: 10px; width: 312px; max-height: 86vh;
    display: flex; flex-direction: column; background: #14161b; color: #cdd3dc;
    font: 11px/1.4 ui-monospace, "SF Mono", Menlo, Consolas, monospace;
    border: 1px solid #2c313c; border-radius: 8px; box-shadow: 0 8px 30px rgba(0,0,0,.5);
    z-index: 2147483000; overflow: hidden; }
  #dev-panel.dv-hidden { display: none; }
  .dv-head { display: flex; align-items: center; gap: 8px; padding: 7px 9px; background: #1b1e26;
    border-bottom: 1px solid #2c313c; cursor: default; }
  .dv-title { color: #7cd; font-weight: 700; white-space: nowrap; }
  .dv-readout { flex: 1; color: #8a93a3; font-size: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .dv-collapse { background: none; border: none; color: #8a93a3; cursor: pointer; font-size: 13px; padding: 0 2px; }
  #dev-panel.dv-min .dv-body { display: none; }
  #dev-panel.dv-min .dv-collapse { transform: rotate(-90deg); }
  .dv-body { overflow-y: auto; padding: 4px 9px 9px; }
  .dv-sec { padding: 7px 0 2px; border-top: 1px solid #232833; margin-top: 5px; }
  .dv-sec:first-child { border-top: none; margin-top: 0; }
  .dv-sec-t { color: #5f6b7d; text-transform: uppercase; letter-spacing: .06em; font-size: 9px; margin-bottom: 5px; }
  .dv-sec-t:empty { display: none; }
  .dv-row { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; margin-bottom: 4px; }
  .dv-btn { background: #262c38; color: #d6dce6; border: 1px solid #38404f; border-radius: 5px;
    padding: 3px 7px; cursor: pointer; font: inherit; }
  .dv-btn:hover { background: #2f3747; border-color: #4a5468; }
  .dv-btn.on { background: #1d4e54; border-color: #2f7d86; color: #9fe9f0; }
  .dv-btn.warn { border-color: #5a4324; color: #e6c189; }
  .dv-btn.warn:hover { background: #3a2c16; }
  .dv-btn.danger { background: #4a1f24; border-color: #7d3138; color: #f0a9af; width: 100%; }
  .dv-btn.danger:hover { background: #5e272d; }
  .dv-sel, .dv-text, .dv-num { background: #0f1115; color: #cdd3dc; border: 1px solid #38404f;
    border-radius: 5px; padding: 2px 4px; font: inherit; }
  .dv-num { text-align: center; }
  .dv-check { display: inline-flex; align-items: center; gap: 3px; color: #9aa3b3; }
  .dv-pre { background: #0f1115; border: 1px solid #2c313c; border-radius: 5px; padding: 6px;
    margin: 2px 0 0; max-height: 160px; overflow: auto; white-space: pre-wrap; color: #aeb6c4; font-size: 10px; }
  .dv-toast { position: absolute; left: 9px; bottom: 9px; right: 9px; background: #1d4e54; color: #d6f6fa;
    padding: 5px 8px; border-radius: 5px; opacity: 0; transition: opacity .15s; pointer-events: none; text-align: center; }
  .dv-toast.show { opacity: 1; }
  #dv-gallery { position: fixed; inset: 0; z-index: 2147482999; background: rgba(12,10,8,.55);
    display: flex; flex-direction: column; align-items: center; padding: 24px; overflow-y: auto; }
  .dvg-bar { display: flex; align-items: center; gap: 10px; width: min(920px, 100%);
    background: #14161b; color: #cdd3dc; border: 1px solid #2c313c; border-radius: 8px 8px 0 0;
    padding: 8px 12px; font: 11px ui-monospace, Menlo, monospace; position: sticky; top: 0; }
  .dvg-title { color: #7cd; font-weight: 700; flex: 1; }
  .dvg-size { display: flex; gap: 4px; }
  .dvg-body { width: min(920px, 100%); background: var(--paper, #f6efdd); border-radius: 0 0 8px 8px;
    padding: 14px 18px 22px; box-shadow: 0 12px 40px rgba(0,0,0,.5); }
  .dvg-group { font: 10px ui-monospace, Menlo, monospace; text-transform: uppercase; letter-spacing: .08em;
    color: var(--ink-soft, #6b6156); margin: 14px 0 6px; display: flex; align-items: center; gap: 6px; }
  .dvg-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
  .dvg-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); gap: 8px; }
  .dvg-cell { display: flex; flex-direction: column; align-items: center; gap: 3px; text-align: center;
    padding: 8px 4px 6px; border-radius: 6px; border: 1px dashed transparent; }
  .dvg-cell.dup { border-color: #b23a3a; background: rgba(178,58,58,.07); }
  /* pen is ink; the group colour (--bead, set on each cell) only tints the swipe.
     Paint rules come from the shared .charm block in styles.css — nothing to
     duplicate here. The svg needs display:block so cells size cleanly. */
  .dvg-cell .charm { width: var(--dvg-size); height: var(--dvg-size); }
  .dvg-cell .charm svg { display: block; }
  /* locked-state preview: pencil-grey pen, swipe dropped */
  #dv-gallery.dvg-locked .charm { color: var(--ink-soft, #8a7f70); }
  #dv-gallery.dvg-locked .charm::before { display: none; }
  #dv-seals { position: fixed; inset: 0; z-index: 2147482999; background: rgba(12,10,8,.55);
    display: flex; flex-direction: column; align-items: center; padding: 24px; overflow-y: auto; }
  .dvs-size { display: flex; gap: 4px; }
  .dvs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(112px, 1fr)); gap: 10px; }
  .dvs-stamp { width: var(--dvs-size); height: var(--dvs-size); }
  .dvs-stamp svg { display: block; width: 100%; height: 100%; }
  .dvs-row { display: flex; align-items: center; gap: 2px; }
  .dvs-seed { font: 8px ui-monospace, Menlo, monospace; color: var(--ink-soft, #8a7f70); min-width: 44px; }
  .dvs-seed.moved { color: #1d7d8a; font-weight: 700; }   /* re-poured, not yet locked in config */
  .dvs-seed.auto { color: #7a6f60; font-style: italic; }   /* derived from the id, never reviewed */
  .dvg-cell.dup .dvs-seed { color: #b23a3a; font-weight: 700; }   /* seed shared — identical outline */
  /* the known generator fault (curvature kinked into corners) — advisory, hover for the score */
  .dvg-cell.fault { border-color: #c08a2e; background: rgba(192,138,46,.09); }
  .dv-btn.dvs-mini { padding: 0 4px; line-height: 14px; min-width: 0; }
  .dvg-nm { font: 9px/1.2 ui-monospace, Menlo, monospace; color: var(--ink, #2b2722); }
  .dvg-key { font: 8px ui-monospace, Menlo, monospace; color: var(--ink-soft, #8a7f70); }
  .dvg-cell.dup .dvg-key { color: #b23a3a; font-weight: 700; }
  `;
  const tag = document.createElement("style");
  tag.id = "dev-styles";
  tag.textContent = css;
  document.head.append(tag);
}
