"use strict";
/* ============================================================
   The lineup's deck: twenty-four goal cards, plus three on the
   bench with the reason they did not make it.

   THIS FILE IS THE SOURCE OF TRUTH for the deck. It used to be a
   literal inside scripts/lineup/goal-cards.html, which is
   gitignored — so the deck existed on one machine and in no
   commit. goal-cards.html is still the board you DESIGN on; it
   now reads from here.

   A card's shape:
     id      lowercase kebab, describes the feat, never the flavour
     suit    what KIND of promise it is, which is what the art says
     rank    the PRICE in pips (A 11, K 10, Q 9, J 8, rest face)
     rule    the one line printed on the face
     miss    the printed ruling for a page you do not answer:
             "fails" kills it, "skipped" passes over it. The six
             clubs have none yet and need one - see PLAN.md.
     pools   which rarity pools it may be dealt into. Absent means
             any. MEASURED (scripts/lineup/deal-lab.html), never
             chosen: a breadth card in a pool that cannot supply it
             is a card decided by the deal instead of the player.
     names   how many artists must be NAMED before page one, for
             the two cards that ask for it. The felt collects them
             and judge() reads them as ctx.named; a card that wants
             names and has none is DEAD, never quietly winnable.
     need / hog / cap / hogCap / bans
             the mechanics conflicts() derives a clash from. Two
             cards can be impossible together without ever naming
             each other, so the arithmetic matters more than bans.
   ============================================================ */
import { SHELF } from "./config.js";
import { PAGES } from "./lineuphand.js";

/* How many catalogues are playable, READ LIVE rather than written down (see config.js,
   which owns it so the game can read it without loading the deck). Full Lineup and Round
   The Table are "every artist on the shelf", so a hardcoded count would quietly change
   what those cards mean the day a guest is added — which is also why neither can ever be
   a charm. Re-exported because the boards import the deck, not the config. */
export { SHELF };

export const SUITS = {
  spades:   { label: "Lockouts",  gloss: "what you may not do",
              note: "A ban you sign before the first page. These are the cards that make a blended pool hard again, because the corpus is only easy while all of it is available." },
  hearts:   { label: "Devotion",  gloss: "staying with one",
              note: "The opposite promise: narrow the run yourself and go deep. A heart is the only family that can be cleared by knowing one catalogue extremely well." },
  diamonds: { label: "Spread",    gloss: "reaching wide",
              note: "Breadth. The bracelet is doing the reporting for this whole suit, since a run that spent eleven artists ends up wearing eleven colours." },
  clubs:    { label: "Form",      gloss: "how you play",
              note: "Nothing to do with who you answer with. These are the levers the game already owns, brought onto a card so a hand can mix a who with a how." },
};

export const DECK = [
  // ---- SPADES: lockouts ----
  { id:"no-home-team", miss:"skipped", suit:"spades", rank:"A", name:"No Home Team",
    rule:"Thirteen pages and not one Taylor song.", cap:null, bans:["full-lineup"] },
  { id:"three-chairs", miss:"fails", suit:"spades", rank:"K", name:"Three Chairs",
    rule:"Name three artists before page one. Only their catalogues count.", cap:3, names:3, flag:"pick three first" },
  { id:"quiet-half", miss:"skipped", suit:"spades", rank:"Q", name:"Quiet Half",
    rule:"Taylor is allowed for six pages. After that she is shut." },
  { id:"closed-shelf", suit:"spades", rank:"J", name:"Closed Shelf",
    rule:"The first artist you answer with is banned for the rest of the run.", miss:"skipped",
    bans:["back-to-december","long-story-short","homecoming"] },
  { id:"nobody-admitted", miss:"skipped", suit:"spades", rank:"7", name:"Nobody Admitted",
    rule:"No catalogue you have already been admitted to on the guest shelf." },
  { id:"one-and-done", miss:"skipped", suit:"spades", rank:"4", name:"One And Done",
    rule:"No artist answers two pages in a row.",
    bans:["long-story-short","all-too-well"] },

  // ---- HEARTS: devotion ----
  { id:"sworn-in", miss:"fails", suit:"hearts", rank:"A", name:"Sworn In",
    rule:"Name one artist before page one. They must answer seven pages.",
    need:1, hog:7, names:1, flag:"pick one first" },
  { id:"homecoming", hog:7, miss:"fails", suit:"hearts", rank:"K", name:"Homecoming",
    rule:"Seven of the thirteen on one artist, and nothing wrong all run.",
    bans:["closed-shelf"] },
  { id:"long-story-short", miss:"fails", hog:5, suit:"hearts", rank:"J", name:"Long Story Short",
    rule:"Five pages in a row answered by the same artist.",
    bans:["one-and-done","closed-shelf"] },
  { id:"two-of-us", miss:"fails", suit:"hearts", rank:"6", name:"Two Of Us",
    rule:"Every page answered by one of two artists.", cap:2 },
  { id:"back-to-december", miss:"fails", suit:"hearts", rank:"3", name:"Back To December",
    rule:"Finish on the artist you opened with.", bans:["closed-shelf"] },
  { id:"the-last-great", miss:"fails", suit:"hearts", rank:"9", name:"The Last Great",
    rule:"Never answer with an artist until the one before has been used twice." },

  // ---- DIAMONDS: spread ----
  // POOLS come from scripts/lineup/deal-lab.html, which deals 1,500 real hands per pool and
  // asks by bipartite matching whether the card is satisfiable AT ALL. A breadth card left in a
  // pool that cannot supply it is a card decided by the deal rather than by the player, which is
  // the same fault that got B-Sides rejected. The bar is 90%.
  { id:"full-lineup", miss:"fails", suit:"diamonds", rank:"A", name:"Full Lineup",
    rule:"Every artist on the shelf, at least one page each.", need:SHELF,
    // easy 100% / hard 69.8% / ultra 8.7%. Cannot be retuned: "every artist" IS the card, and
    // dropping to seven would also break the promise that it reads the shelf live.
    pools:["easy"], flag:"reads the shelf live", bans:["no-home-team"] },
  { id:"round-the-table", miss:"fails", suit:"diamonds", rank:"K", name:"Round The Table",
    rule:"Nobody answers a second page until everybody has answered one.",
    // easy 100% / hard 20.5% / ultra 0.3%. On the no-repeats diagonal nothing above K=3 clears
    // the bar on hard, and K=3 is not a goal, so this one is gated rather than retuned.
    pools:["easy"], need:SHELF, hogCap: PAGES - SHELF + 1 },
  { id:"undercard", miss:"fails", suit:"diamonds", rank:"5", name:"Undercard",
    rule:"Eight of the thirteen answered by somebody who is not Taylor." },
  { id:"no-repeats-yet", miss:"fails", suit:"diamonds", rank:"10", name:"No Repeats Yet",
    // easy 100% / hard 21.1% / ultra 0.3%, and the diagonal says no K rescues it either.
    rule:"The first eight pages, eight different artists.", pools:["easy"], need:8 },
  { id:"headliners", miss:"fails", suit:"diamonds", rank:"8", name:"Headliners",
    // easy 100% / hard 99.7% / ultra 76.4%. The only breadth card hard can carry unchanged.
    rule:"Six different artists somewhere across the run.", pools:["easy","hard"], need:6 },
  { id:"opening-act", miss:"fails", suit:"diamonds", rank:"6", name:"Opening Act",
    // Was five-in-five: easy 100% / hard 78.3%, which fails the bar. Four-in-five is 96.4% on
    // hard and keeps what the card says — a spread opening — so this one retunes rather than
    // gating. Ultra is 58.1% even at four, so it still stays out.
    rule:"Four different artists in the first five pages.", pools:["easy","hard"], need:4 },

  // ---- CLUBS: form ----
  { id:"clean-sheet", suit:"clubs", rank:"A", name:"Clean Sheet",
    rule:"Thirteen from thirteen." },
  { id:"off-the-cuff", suit:"clubs", rank:"K", name:"Off The Cuff",
    rule:"Every page answered inside ten seconds." },
  { id:"cold-open", suit:"clubs", rank:"Q", name:"Cold Open",
    rule:"The dropdown stays shut for the whole run." },
  { id:"sing-it-back", suit:"clubs", rank:"J", name:"Sing It Back",
    rule:"Five pages answered with a sung line, not a title." },
  { id:"no-hints", suit:"clubs", rank:"7", name:"No Hints",
    rule:"Not one hint pulled off the ladder." },
  { id:"ten-in-a-row", suit:"clubs", rank:"4", name:"Ten In A Row",
    rule:"Ten right on the trot at some point in the run." },
];

/* Cards that did NOT make the deck, kept with their reasons so the same idea does not
   get re-proposed. The board shows these on a bench; nothing deals them. */
export const BENCH = [
  { id:"all-too-well", suit:"hearts", rank:"A", name:"All Too Well", miss:"fails",
    rule:"Thirteen pages, and every one of them off the same album.", cap:1,
    bans:["one-and-done","closed-shelf"], why:"NOT TAKEN. The idea survives the cut: it was the word \u201crecord\u201d that made it unreadable, not the feat. Worth revisiting if the deck ever wants a second heavy heart." },
  { id:"mine", suit:"hearts", rank:"9", name:"Mine", miss:"fails",
    rule:"Over half the run on one artist, and she is not Taylor.",
    hog:7, why:"NOT TAKEN. Homecoming without the clean-sheet clause, which turned out to be most of what Homecoming is." },

  { id:"split-the-bill", suit:"diamonds", rank:"Q", name:"Split The Bill", miss:"helps", need:5,
    rule:"No artist answers more than three pages.",
    why:"NOT TAKEN, and kept here on purpose: it reads well and plays badly. A ceiling, so every page you miss makes it EASIER to hold." },
];

export const byId = Object.fromEntries(DECK.concat(BENCH).map((c) => [c.id, c]));
