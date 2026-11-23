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
     miss    the printed ruling for a page you do not answer, and the
             judge reads the same key (js/lineupgoals.js):
               "fails"    a missed page kills it
               "skipped"  a missed page is skipped over, as if it
                          were never dealt (count-ups and bans)
               "breaks"   a missed page breaks a streak
               "window"   the rule reads every page, misses
                          included, and `missText` says how
             THE PRINCIPLE: A MISSED PAGE NEVER HELPS. A ban skips it,
             because a skipped page cannot separate two pages it sat
             between; a count-up skips it, because a page that does
             not count is already its own cost; a streak breaks on
             it; a fixed window (the first five, the first eight)
             counts it as a page nobody answered. Every card also has
             the judge's FLOOR behind it: nothing is held on a run
             that lands fewer than eight pages, which is what stops a
             blank run winning every ban in the deck.
     pools   which rarity pools it may be dealt into. Absent means
             any. MEASURED (scripts/lineup/deal-lab.html), never
             chosen: a card in a pool that cannot supply it is a card
             decided by the deal instead of the player.
     needs   what the chosen DIFFICULTY must have for the card to be
             a goal at all (lineuphand.js `dealable`). A card a
             difficulty makes true by itself is never dealt there:
             No Hints where there are no hints, Cold Open where the
             suggestions are already shut, Sing It Back where every
             answer is sung, Off The Cuff where the clock is already
             its own ten seconds or less, Nobody Admitted on a
             notebook that has been admitted nowhere.
     lever   levers on the run's own mode, applied when the card
             is kept. Only for a card whose rule describes a state
             of the run rather than a promise you could break: Cold
             Open says the suggestions ARE shut, so keeping it shuts
             them. A promise you can break (No Hints, and every
             spade) must never become a lever, or it stops being
             losable.
     names   how many artists must be NAMED before page one, for
             the two cards that ask for it. The felt collects them
             and judge() reads them as ctx.named; a card that wants
             names and has none is DEAD, never quietly winnable.
     guests  the card is about guests only and never credits Taylor.
             She turns up on 91 to 100% of pages on every pool, so a
             devotion card she could answer was won before page one:
             Sworn In to her, seven of thirteen on her, Three Chairs or
             Two Of Us with her in them. Without her these four only
             clear the 90% bar on easy and normal words, so that is
             where they are dealt.
     covers  cards this one already asks for in full. Holding both
             spends pips twice on one promise, so the felt refuses
             the pair, and a card never costs less than what it
             covers (tests/lineupdeck.test.mjs holds that).
     need / within / hog / cap / hogCap / pace / shuts / away / bans
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
              note: "Breadth. The bracelet is doing the reporting for this whole suit, since a run that reached six artists ends up wearing six colours." },
  clubs:    { label: "Form",      gloss: "how you play",
              note: "Nothing to do with who you answer with. These are the levers the game already owns, brought onto a card so a hand can mix a who with a how." },
};

export const DECK = [
  // ---- SPADES: lockouts ----
  // No Home Team and Undercard are both "answer away from home" and both easy and hard only: on
  // the ultra pool 44% of pages have any answer that is not hers, so eight of thirteen is a 15%
  // deal (lab: the blend's own masks, perfect play). Hard is 99%.
  { id:"no-home-team", miss:"skipped", suit:"spades", rank:"A", name:"No Home Team",
    rule:"Thirteen pages and not one Taylor song.", shuts:"home", pools:["easy","normal","hard"],
    covers:["undercard","quiet-half"], bans:["full-lineup"] },
  // Guests only, so every page it lets you answer is away from home: it covers Undercard and
  // Quiet Half. The best guest trio named in advance covers eight pages on 99.7% of normal
  // deals, 81.8% of hard and 0.8% of ultra.
  { id:"three-chairs", miss:"skipped", suit:"spades", rank:"K", name:"Three Chairs",
    rule:"Name three guests before page one. Only their catalogues count.", cap:3, names:3, guests:true,
    pools:["easy","normal"], covers:["quiet-half","undercard"], flag:"pick three first" },
  { id:"quiet-half", miss:"skipped", suit:"spades", rank:"Q", name:"Quiet Half",
    rule:"Taylor is allowed for six pages. After that she is shut." },
  { id:"closed-shelf", suit:"spades", rank:"J", name:"Closed Shelf",
    rule:"The first artist you answer with is banned for the rest of the run.", miss:"skipped",
    bans:["back-to-december","long-story-short","homecoming"] },
  { id:"nobody-admitted", miss:"skipped", suit:"spades", rank:"7", name:"Nobody Admitted",
    rule:"No guest you have been admitted to.",
    shuts:"admitted", needs:"admissions" },
  // A missed page is skipped over, so it cannot sit between two pages by one artist and part
  // them: that would make a miss the way to keep this card, and a miss never helps.
  { id:"one-and-done", miss:"skipped", suit:"spades", rank:"4", name:"One And Done",
    rule:"No artist answers two pages in a row.",
    bans:["long-story-short","all-too-well","the-last-great"] },

  // ---- HEARTS: devotion ----
  // Sworn to the best guest named in advance: 94.5% of normal deals reach seven, 22.6% of hard.
  { id:"sworn-in", miss:"skipped", suit:"hearts", rank:"K", name:"Sworn In",
    rule:"Name one guest before page one. They must answer seven pages.",
    need:1, hog:7, names:1, guests:true, pools:["easy","normal"], flag:"pick one first" },
  // "Nothing wrong all run" is the card, so this is the one heart that still fails on a miss.
  // It asks all of Clean Sheet and seven pages from one guest besides, so it is the Ace.
  { id:"homecoming", hog:7, miss:"fails", suit:"hearts", rank:"A", name:"Homecoming",
    rule:"Seven of the thirteen on one guest, and nothing wrong all run.", guests:true, pools:["easy","normal"],
    covers:["clean-sheet","ten-in-a-row"], bans:["closed-shelf"] },
  { id:"long-story-short", miss:"breaks", hog:5, suit:"hearts", rank:"J", name:"Long Story Short",
    rule:"Five pages in a row answered by the same artist.",
    bans:["one-and-done","closed-shelf"] },
  // Two guests and nobody else covers Quiet Half and Undercard, so it costs at least a Queen.
  { id:"two-of-us", miss:"skipped", suit:"hearts", rank:"Q", name:"Two Of Us",
    rule:"Every page you answer goes to one of two guests.", cap:2, guests:true, pools:["easy","normal"],
    covers:["quiet-half","undercard"] },
  { id:"back-to-december", miss:"window", suit:"hearts", rank:"3", name:"Back To December",
    missText:"a miss on page 1 or 13 kills it",
    rule:"Finish on the artist you opened with.", bans:["closed-shelf"] },
  // Each new artist waits for the one before to answer twice, so n answered pages hold at most
  // ceil(n / 2) artists: `pace` is what lets conflicts() refuse a breadth card beside it.
  { id:"the-last-great", miss:"skipped", suit:"hearts", rank:"9", name:"The Last Great",
    rule:"Never bring in a new artist until the one before has answered twice.", pace:2 },

  // ---- DIAMONDS: spread ----
  // POOLS come from scripts/lineup/deal-lab.html, which deals 1,500 real hands per pool and
  // asks by bipartite matching whether the card is satisfiable AT ALL. A breadth card left in a
  // pool that cannot supply it is a card decided by the deal rather than by the player, which is
  // the same fault that got B-Sides rejected. The bar is 90%.
  { id:"full-lineup", miss:"skipped", suit:"diamonds", rank:"K", name:"Full Lineup",
    rule:"Every artist on the shelf, at least one page each.", need:SHELF,
    // easy 100% / hard 69.8% / ultra 8.7%. Cannot be retuned: "every artist" IS the card, and
    // dropping to seven would also break the promise that it reads the shelf live.
    pools:["easy"], flag:"reads the shelf live", covers:["headliners"], bans:["no-home-team"] },
  // Everyone once before anyone twice puts every artist on the run, so this covers Full Lineup
  // and is priced above it.
  { id:"round-the-table", miss:"window", suit:"diamonds", rank:"A", name:"Round The Table",
    missText:"a miss before the round ends kills it",
    rule:"Nobody answers a second page until everybody has answered one.",
    // easy 100% / hard 20.5% / ultra 0.3%. On the no-repeats diagonal nothing above K=3 clears
    // the bar on hard, and K=3 is not a goal, so this one is gated rather than retuned.
    pools:["easy"], need:SHELF, within:SHELF, hogCap: PAGES - SHELF + 1, covers:["full-lineup","headliners"] },
  { id:"undercard", miss:"skipped", suit:"diamonds", rank:"5", name:"Undercard",
    rule:"Eight of the thirteen answered by somebody who is not Taylor.", away:8, pools:["easy","normal","hard"] },
  { id:"no-repeats-yet", miss:"window", suit:"diamonds", rank:"10", name:"No Repeats Yet",
    missText:"a miss in the first eight kills it",
    // easy 100% / hard 21.1% / ultra 0.3%, and the diagonal says no K rescues it either.
    rule:"The first eight pages, eight different artists.", pools:["easy"], need:8, within:8,
    covers:["opening-act","headliners"] },
  { id:"headliners", miss:"skipped", suit:"diamonds", rank:"8", name:"Headliners",
    // easy 100% / hard 99.7% / ultra 76.4%. The only breadth card hard can carry unchanged.
    rule:"Six different artists somewhere across the run.", pools:["easy","normal","hard"], need:6 },
  { id:"opening-act", miss:"window", suit:"diamonds", rank:"6", name:"Opening Act",
    missText:"a miss still spends one of the five",
    // Was five-in-five: easy 100% / hard 78.3%, which fails the bar. Four-in-five is 96.4% on
    // hard and keeps what the card says — a spread opening — so this one retunes rather than
    // gating. Ultra is 58.1% even at four, so it still stays out.
    rule:"Four different artists in the first five pages.", pools:["easy","normal","hard"], need:4, within:5 },

  // ---- CLUBS: form ----
  // Off The Cuff asks everything Clean Sheet does and the clock as well, so it is the Ace and
  // Clean Sheet the King. Before they swapped, the harder card was the cheaper one.
  { id:"clean-sheet", miss:"fails", suit:"clubs", rank:"K", name:"Clean Sheet",
    rule:"Thirteen from thirteen.", covers:["ten-in-a-row"] },
  { id:"off-the-cuff", miss:"fails", suit:"clubs", rank:"A", name:"Off The Cuff",
    rule:"Every page answered inside ten seconds.", inside:10, needs:"clock",
    covers:["clean-sheet","ten-in-a-row"] },
  // The one card that CHANGES the run rather than judging it. The words were always a
  // statement of fact rather than a promise, and read as a promise the card is unplayable:
  // the list renders on the keystrokes that type a title, so it would die on page one of
  // every mode that has one and be free in the ones that do not. Shutting the list is what
  // it says, and the price is real, because thirteen titles typed in full makes every other
  // card in the hand harder to hold. The lever is also what keeps this card indifferent to
  // which difficulty the lineup was dealt on, now that Hard's list is a LATE one rather than
  // no list: `dropdown: false` overwrites the string the same way it overwrites a true. It is
  // never dealt where the suggestions are already shut (Ultra, Lyricist): there it would be a
  // Queen that asks for nothing.
  { id:"cold-open", miss:"skipped", suit:"clubs", rank:"Q", name:"Cold Open",
    rule:"The suggestions stay shut for the whole run.", lever:{ dropdown:false }, needs:"suggestions" },
  { id:"sing-it-back", miss:"skipped", suit:"clubs", rank:"J", name:"Sing It Back",
    rule:"Five pages answered with a sung line, not a title.", needs:"titles" },
  { id:"no-hints", miss:"window", suit:"clubs", rank:"7", name:"No Hints",
    missText:"a hint on a missed page counts",
    rule:"Not one hint pulled off the ladder.", needs:"hints" },
  { id:"ten-in-a-row", miss:"breaks", suit:"clubs", rank:"4", name:"Ten In A Row",
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
    hog:7, why:"NOT TAKEN. Homecoming without the clean-sheet clause, which turned out to be most of what Homecoming is. Homecoming has since taken Mine's other half: it is guests only." },

  { id:"split-the-bill", suit:"diamonds", rank:"Q", name:"Split The Bill", miss:"helps", need:5,
    rule:"No artist answers more than three pages.",
    why:"NOT TAKEN, and kept here on purpose: it reads well and plays badly. A ceiling, so every page you miss makes it EASIER to hold." },
];

export const byId = Object.fromEntries(DECK.concat(BENCH).map((c) => [c.id, c]));
