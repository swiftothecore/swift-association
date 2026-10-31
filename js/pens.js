/* Which pen wrote each song, for the pen that sometimes rests at the start of the writing line
   (setPen / pagePen in app.js). Taylor sorted her lyrics into three pens in her 2022 Nashville
   Songwriter Awards speech: quill for antiquated, period phrasing; fountain for modern stories
   told with a poetic twist (most of hers); glitter gel for the frivolous, bouncy ones.

   Her own three Apple Music playlists cover 55 of these and are followed exactly, along with the
   remixes and second cuts of those songs. Everything else was assigned by hand on a review board
   (scripts/pens/, local). A song Taylor holds no writing credit on (the covers, the features she
   only sings on) and every song she wrote for someone else to sing is left OUT on purpose: it is
   not hers to file, and a page made only of those keeps the pencil.

   Keyed by album and then by title, because titles alone are not unique across the corpus and a
   guest catalogue may reuse one. Never shown to the player as a label: the pen is the clue. */
export const SONG_PENS = {
  "Taylor Swift": {
    fountain: ["Tim McGraw", "Teardrops On My Guitar", "A Place In This World", "Cold As You", "The Outside", "Tied Together with a Smile", "Should've Said No", "Mary's Song (Oh My My My)", "Invisible", "A Perfectly Good Heart", "I'd Lie"],
    glitter: ["Picture To Burn", "Stay Beautiful", "Our Song", "I'm Only Me When I'm With You", "Beautiful Eyes", "I Heart ?"],
  },
  "Fearless": {
    quill: ["Love Story"],
    fountain: ["Fearless", "Fifteen", "White Horse", "Breathe", "Tell Me Why", "You're Not Sorry", "The Way I Loved You", "Forever & Always", "The Best Day", "Change", "Untouchable", "Forever & Always (Piano Version)", "Come In With The Rain", "Superstar", "The Other Side Of The Door", "You All Over Me", "We Were Happy", "That's When", "Don't You", "Bye Bye Baby", "If This Was A Movie"],
    glitter: ["Hey Stephen", "You Belong With Me", "Jump Then Fall", "Today Was A Fairytale", "Mr. Perfectly Fine"],
  },
  "Speak Now": {
    quill: ["Enchanted", "Haunted", "Long Live", "Castles Crumbling", "Timeless"],
    fountain: ["Mine", "Back To December", "Dear John", "The Story Of Us", "Never Grow Up", "Innocent", "Last Kiss", "Ours", "Superman", "Electric Touch", "When Emma Falls In Love", "Foolish One"],
    glitter: ["Sparks Fly", "Speak Now", "Mean", "Better Than Revenge", "I Can See You"],
  },
  "Red": {
    quill: ["Red", "Sad Beautiful Tragic"],
    fountain: ["State Of Grace", "Treacherous", "I Knew You Were Trouble", "All Too Well", "I Almost Do", "The Last Time", "Holy Ground", "The Lucky One", "Everything Has Changed", "Begin Again", "The Moment I Knew", "Come Back...Be Here", "State Of Grace (Acoustic Version)", "Ronan", "Better Man", "Nothing New", "Babe", "Forever Winter", "Run", "All Too Well (10 Minute Version)"],
    glitter: ["22", "We Are Never Ever Getting Back Together", "Stay Stay Stay", "Starlight", "Girl At Home", "Message In A Bottle", "I Bet You Think About Me", "The Very First Night"],
  },
  "1989": {
    quill: ["This Love"],
    fountain: ["Style", "Out Of The Woods", "All You Had To Do Was Stay", "I Wish You Would", "Bad Blood", "Wildest Dreams", "I Know Places", "Clean", "You Are In Love", "\"Slut!\"", "Say Don't Go", "Suburban Legends", "Is It Over Now?", "Bad Blood (Remix)"],
    glitter: ["Welcome To New York", "Blank Space", "Shake It Off", "How You Get The Girl", "Wonderland", "New Romantics", "Now That We Don't Talk", "Sweeter Than Fiction"],
  },
  "reputation": {
    fountain: ["Don't Blame Me", "Delicate", "So It Goes...", "Getaway Car", "King Of My Heart", "Dancing With Our Hands Tied", "Dress", "Call It What You Want", "New Year's Day"],
    glitter: ["...Ready For It?", "End Game", "I Did Something Bad", "Look What You Made Me Do", "Gorgeous", "This Is Why We Can't Have Nice Things"],
  },
  "Lover": {
    fountain: ["Cruel Summer", "Lover", "The Archer", "Miss Americana & The Heartbreak Prince", "Cornelia Street", "Death By A Thousand Cuts", "Soon You'll Get Better", "False God", "It's Nice To Have A Friend", "Daylight", "All Of The Girls You Loved Before", "Need"],
    glitter: ["I Forgot That You Existed", "The Man", "I Think He Knows", "Paper Rings", "London Boy", "You Need To Calm Down", "Afterglow", "ME!"],
  },
  "folklore": {
    quill: ["the last great american dynasty", "my tears ricochet", "seven", "mad woman", "epiphany", "peace", "hoax", "the lakes"],
    fountain: ["the 1", "cardigan", "exile", "mirrorball", "august", "this is me trying", "illicit affairs", "invisible string", "betty"],
  },
  "evermore": {
    quill: ["willow", "gold rush", "tolerate it", "happiness", "ivy", "cowboy like me", "evermore"],
    fountain: ["champagne problems", "'tis the damn season", "no body, no crime", "dorothea", "coney island", "long story short", "marjorie", "closure", "right where you left me", "it's time to go"],
  },
  "Midnights": {
    quill: ["Anti-Hero", "Snow On The Beach", "Mastermind", "The Great War", "Snow On The Beach (Remix)"],
    fountain: ["Lavender Haze", "Maroon", "You're On Your Own, Kid", "Midnight Rain", "Question...?", "Labyrinth", "Sweet Nothing", "Bigger Than The Whole Sky", "High Infidelity", "Glitch", "Would've, Could've, Should've", "Dear Reader", "You're Losing Me"],
    glitter: ["Vigilante Shit", "Bejeweled", "Karma", "Paris", "Hits Different", "Karma (Remix)"],
  },
  "The Tortured Poets Department": {
    quill: ["So Long, London", "Guilty as Sin?", "Who's Afraid of Little Old Me?", "loml", "The Albatross", "How Did It End?", "I Hate It Here", "I Look in People's Windows", "The Prophecy", "Cassandra", "Peter", "The Bolter"],
    fountain: ["Fortnight", "The Tortured Poets Department", "My Boy Only Breaks His Favorite Toys", "Down Bad", "Fresh Out The Slammer", "The Smallest Man Who Ever Lived", "Clara Bow", "The Black Dog", "Chloe or Sam or Sophia or Marcus", "thanK you aIMee", "Robin", "The Manuscript"],
    glitter: ["But Daddy I Love Him", "Florida!!!", "I Can Fix Him (No Really I Can)", "I Can Do It With a Broken Heart", "The Alchemy", "imgonnagetyouback", "So High School"],
  },
  "The Life of a Showgirl": {
    quill: ["The Fate of Ophelia"],
    fountain: ["Elizabeth Taylor", "Father Figure", "Eldest Daughter", "Ruin The Friendship", "Honey", "The Life of a Showgirl", "Patient Zero", "Pink Clouding", "Babylon"],
    glitter: ["Opalite", "Actually Romantic", "Wi$h Li$t", "Wood", "CANCELLED!", "Cleveland!"],
  },
  "Holiday Collection": {
    fountain: ["Christmases When You Were Mine", "Christmas Must Be Something More"],
    glitter: ["Christmas Tree Farm"],
  },
  "Songs From Movies": {
    quill: ["Beautiful Ghosts", "Carolina"],
    fountain: ["Safe & Sound", "Eyes Open", "Crazier", "I Don't Wanna Live Forever", "Only The Young", "I Knew It, I Knew You"],
  },
  "Collaborations": {
    fountain: ["Both of Us", "Two Is Better Than One", "Renegade", "Birch", "The Joker And The Queen (Remix)", "The Alcott", "us."],
  },
};
