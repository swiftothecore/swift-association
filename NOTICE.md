# Third-party notices

Swift To The Song Association ships a handful of things that other people made. This
file records what they are and what their terms require. My own source code is not
covered here: see the licence section of [README.md](README.md) for that.

## Lyrics and liner-note messages

`data/songs.json`, `data/guests/*.json` and `data/secret-messages.json` contain song lyrics, titles and
album liner-note messages written by Taylor Swift and her co-writers, and by the artists
on the guest shelf and theirs. Copyright in that material belongs to those writers and
their publishers. It is quoted here for a non-commercial word-association game and is not
licensed for redistribution by me, because it is not mine to license. If you are a rights
holder and want something removed, contact me and I will remove it.

## Fonts

Both families are used under the SIL Open Font License, Version 1.1. The full licence
text, and the copyright notices the OFL requires be distributed with the fonts, are in
[fonts/OFL.txt](fonts/OFL.txt).

| File | Family | Copyright |
| --- | --- | --- |
| `fonts/caveat-latin.woff2` | Caveat | Copyright 2014 The Caveat Project Authors |
| `fonts/courierprime-400-latin.woff2`, `fonts/courierprime-700-latin.woff2`, `fonts/courierprime-italic-latin.woff2` | Courier Prime | Copyright 2015 The Courier Prime Project Authors |

Both have been subsetted to Latin and converted to WOFF2. Neither has been renamed, which
the OFL requires of any Modified Version distributed under the Reserved Font Name.

## Icons

Every mark in the game is drawn by hand in this repository, with one exception: the
drawing pin that pins a challenge to the shortlist (`CHALL_PIN` in `js/app.js`) is the
`pin-angle` glyph from [Bootstrap Icons](https://icons.getbootstrap.com), used under the
MIT licence.

> Copyright (c) 2019-2024 The Bootstrap Authors
>
> Permission is hereby granted, free of charge, to any person obtaining a copy of this
> software and associated documentation files (the "Software"), to deal in the Software
> without restriction, including without limitation the rights to use, copy, modify,
> merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
> permit persons to whom the Software is furnished to do so, subject to the following
> conditions:
>
> The above copyright notice and this permission notice shall be included in all copies
> or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
> INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
> PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
> HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
> CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
> OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

The path is used as published, recoloured to `currentColor` so the pin follows the
button's state. That notice stays as long as the glyph ships.

## Sound effects

| File | Source | Licence |
| --- | --- | --- |
| `sounds/correct.mp3`, `sounds/wrong.mp3` | [Google Material Design sound resources](https://archive.org/details/material-design-sound-resources) | CC-BY 4.0 |
| `sounds/page.mp3` | freesound | CC0 1.0 |
| `sounds/unlock.mp3`, `sounds/hint.mp3` | freesound | CC0 1.0 |
| `sounds/tick.mp3` | freesound | CC0 1.0 |
| `sounds/scratch.mp3` | freesound | CC0 1.0 |
| `sounds/close.mp3` | freesound | CC0 1.0 |

The CC-BY 4.0 material requires attribution, which is given in the credit line at the
foot of [README.md](README.md). That line stays as long as those files ship.
