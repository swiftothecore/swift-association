// Dev cheats panel — loaded only behind the ?dev flag (see devActive in app.js).
// Deliberately un-notebook (dark, monospace, fixed corner) so it can never be
// confused with the game UI. Receives a curated `api` from app.js's buildDevApi.
// Pure config data (achievement/icon tables for the charm gallery) is imported
// directly rather than routed through the api.

import { ACHIEVEMENTS, ACH_ICONS, ACH_GROUPS, ACH_GROUP_OF, ACH_GROUP_COLORS } from "./config.js";

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
        btn("log state", () => console.log("[dev] state", api.getState()))),
    answerBox));
  function renderReveal() {
    if (!revealOpen) return;
    const st = api.getState();
    if (!st.valid.length) { answerBox.textContent = `"${st.word || "—"}" — no valid songs (or not in a round)`; return; }
    answerBox.textContent = `"${st.word}" → ${st.valid.length} song(s)\n` +
      st.valid.map((v) => `• ${v.title}${v.album ? "  [" + v.album + "]" : ""}\n    “${v.line}”`).join("\n");
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

  // ---- Word / Era / Mode -----------------------------------------------------
  const eraSel = select(api.ERAS, (x) => x, (x) => x);
  const modeSel = select(api.MODE_ORDER, (x) => x, (x) => x);
  body.append(section("era / mode",
    row(eraSel, btn("apply era", () => api.setEra(eraSel.value)),
        modeSel, btn("set mode", () => api.setMode(modeSel.value)))));

  // ---- Onboarding / first-run ------------------------------------------------
  const obAlbumSel = select(["", ...api.STUDIO_ALBUMS], (x) => x, (x) => x || "no favourite");
  body.append(section("onboarding",
    row(btn("replay first-run", () => api.onboarding.replay()),
        btn("ready-for-normal nudge", () => api.onboarding.normalNudge())),
    row(btn("era prompt", () => api.onboarding.eraPrompt()),
        btn("mark done", () => { api.onboarding.markDone(); toast("first-run marked done"); })),
    row(btn("replay guided round", () => { api.onboarding.guideReplay(); toast("guided-round beats re-armed"); }),
        btn("show hint beat", () => { toast(api.onboarding.guideHintPreview() ? "hint beat shown" : "need an open Easy/Relaxed round"); })),
    row(obAlbumSel, btn("set era", () => { api.onboarding.setEra(obAlbumSel.value); toast("era → " + (obAlbumSel.value || "none")); })),
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

  // ---- Daily -----------------------------------------------------------------
  const dateInput = mk("input", { type: "date", class: "dv-text", style: "width:124px" });
  const stCur = num(5), stBest = num(9);
  body.append(section("daily",
    row(btn("reset today (replay)", () => { api.daily.resetToday(); toast("today's daily cleared"); }),
        btn("clear in-progress", () => { api.daily.clearProgress(); toast(api.daily.hasProgress() ? "still in progress" : "in-progress cleared"); })),
    row(dateInput, btn("set date", () => { api.daily.setDate(dateInput.value); toast("date → " + (dateInput.value || "live")); }),
        btn("clear", () => { api.daily.setDate(null); dateInput.value = ""; toast("date → live"); })),
    row("streak cur", stCur, "best", stBest, btn("set", () => { api.daily.setStreak(+stCur.value, +stBest.value); toast("streak set"); }))));

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
    row(nameInput, btn("set name", () => { if (nameInput.value.trim()) { api.seed.setName(nameInput.value.trim()); toast("name set"); } }))));

  // ---- Skills & Mastery ------------------------------------------------------
  const mSkillSel = select(api.SKILL_IDS, (x) => x, (x) => x);
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
        btn("unlock rewards", () => { api.mastery.unlockRewards(); toast("rewards unlocked"); })),
    row(btn("open page", () => api.mastery.open()),
        btn("reset mastery", () => { api.mastery.reset(); toast("mastery reset"); }, "warn"))));

  // ---- Visual eggs -----------------------------------------------------------
  const penSel = select(["", "quill", "fountain", "glitter"], (x) => x, (x) => x || "no pen");
  const doodleSel = select(["cat", "guitar", "scarf", "fence", "thirteen", "snake", "cardigan", "mirrorball", "paperplane", "willow", "seagulls"], (x) => x, (x) => x);
  // Seasonal-layer toggles bypass the calendar/clock gate but still respect
  // reduce-motion, so they exercise the real effect rather than a special case.
  const snowBtn = btn("snow", () => snowBtn.classList.toggle("on", api.eggs.snow()));
  const rainBtn = btn("rain", () => rainBtn.classList.toggle("on", api.eggs.rain()));
  body.append(section("eggs",
    row(btn("snake", () => api.eggs.snake()), doodleSel, btn("doodle", () => api.eggs.doodle(doodleSel.value)),
        btn("sparkle", () => api.eggs.sparkle())),
    row(btn("star shower", () => api.eggs.starShower()), btn("blue wash", () => api.eggs.blueWash()),
        btn("secret 13", () => api.eggs.secret13())),
    row(snowBtn, rainBtn),
    row(penSel, btn("set pen", () => api.eggs.pen(penSel.value)))));

  // ---- Scattered desk beads ----------------------------------------------------
  const scDensN = num(1, 40);
  body.append(section("desk beads",
    row(btn("rebuild", () => { api.scatter.rebuild(); toast(api.scatter.count() + " beads"); }),
        btn("reseed", () => { api.scatter.reseed(); toast("reseeded → " + api.scatter.count() + " beads"); })),
    row("density", scDensN, btn("set", () => { api.scatter.density(+scDensN.value); toast(api.scatter.count() + " beads"); }))));

  // ---- Charm icon gallery ------------------------------------------------------
  // Every achievement charm at real render size on real paper, grouped like the
  // collection page, with duplicate-key flagging. QA tool for the icon set.
  body.append(section("icons",
    row(btn("charm gallery", openGallery))));

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
  .dvg-nm { font: 9px/1.2 ui-monospace, Menlo, monospace; color: var(--ink, #2b2722); }
  .dvg-key { font: 8px ui-monospace, Menlo, monospace; color: var(--ink-soft, #8a7f70); }
  .dvg-cell.dup .dvg-key { color: #b23a3a; font-weight: 700; }
  `;
  const tag = document.createElement("style");
  tag.id = "dev-styles";
  tag.textContent = css;
  document.head.append(tag);
}
