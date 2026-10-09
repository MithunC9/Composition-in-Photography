# Composition in Photography

An interactive presentation on the ten elements of photographic composition, built as a website.

**Group:** Wynn Morgan, Ryan Barbra, Mithun Chigurupati

## Viewing it

- **On GitHub Pages:** in the repository settings, open *Pages*, choose *Deploy from a branch*, select the branch and the `/ (root)` folder, then save. The site appears at `https://<user>.github.io/Composition-in-Photography/`.
- **Locally:** open `index.html` in a browser. Everything except the famous photographs works offline. Those load live from Wikipedia and Wikimedia Commons, so connect to the internet before presenting.

## Presenting

| Key | Action |
| --- | --- |
| `→` `Space` `PageDown` | Next frame |
| `←` `PageUp` | Previous frame |
| `1` – `9`, `0` | Jump to element 1–10 |
| `G` | Contact sheet (every frame at once) |
| `T` | Darkroom / light table theme |
| `F` | Full screen |
| `S` | Shutter sound on / off |

On phones and tablets, swipe left and right. Every frame also has its own link, for example `#thirds`, `#shape-photos` or `#quiz`.

## What is inside

1. **Title** with a live 3:2 viewfinder over Arnold Newman's *Igor Stravinsky*.
2. **Definition of composition**: one subject, four compositions.
3. **The ten elements**: clickable contents.
4. For each element, a definition slide with an experiment, then **three famous photographs** with the photographer, date, place, story and how it uses the element:

| # | Element | Experiment | Photographs |
| --- | --- | --- | --- |
| 01 | Rule of Thirds | Drag a walker, the moon and the horizon onto thirds or golden-mean lines | Earthrise · Afghan Girl · Moonrise, Hernandez |
| — | Video | COOPH, *9 Photo Composition Tips (feat. Steve McCurry)*, mapped to our elements | |
| 02 | Framing: Depth/Perspective, Viewpoint | Raise and lower the camera around a child, shoot through a doorway | Clearing Winter Storm · Migrant Mother · Lunch atop a Skyscraper |
| 03 | Light and Shadows | Move the sun over a colonnade; hard and soft light | The Roaring Lion · Wall Street · The Flatiron |
| 04 | Lines | Horizontal, vertical, diagonal, converging and curved lines; trace the eye | The Tetons and the Snake River · The Steerage · Raising the Flag on Iwo Jima |
| 05 | Shape | Stravinsky reduced to silhouette, traced shapes and the musical flat sign | Igor Stravinsky · Behind the Gare Saint-Lazare · Milk Drop Coronet |
| 06 | Form | WebGL sculpture under front, side, top and back light | Pepper No. 30 · Nautilus · Power House Mechanic |
| 07 | Positive & Negative Space | Rubin's vase; subject size and the rule of space | Pale Blue Dot · Tank Man · McCandless's untethered spacewalk |
| 08 | Texture | WebGL surfaces under raking and overhead light | Apollo 11 Bootprint · Floyd Burroughs · Skull, Badlands |
| 09 | Pattern | Click to break a pattern of umbrellas or windows | 99 Cent · The Horse in Motion · Abbey Road |
| 10 | Simplicity | Remove clutter, then open the aperture | Rhein II · Bliss · Equivalent |

5. **Breaking the rules**, a **quiz** (name the element) and **credits and sources**.

Click any photograph to open it large with its story and thirds, golden-mean and diagonal overlays.

## Saving the photographs for offline use

Add files to `photos/` and list them in `photos/manifest.js`, for example:

```js
window.CIP_LOCAL_PHOTOS = { 'earthrise': 'photos/earthrise.jpg' };
```

Ids are in `js/content.js`. Listed photos load from the repository instead of Wikipedia.

## Files

- `index.html`: page shell
- `css/style.css`: design (Darkroom and Light table themes)
- `js/content.js`: all text, definitions and photo facts
- `js/images.js`: finds each photograph on Wikimedia Commons or Wikipedia
- `js/deck.js`: slides, navigation, contact sheet
- `js/demos/`: one interactive per element
- `js/quiz.js`, `js/lightbox.js`

## Sources

Class handouts "Composition" and "Elements of Photographic Composition and Design"; Contemporary Art Issue, *Top 25 Fine Art Photography Artists in the World*; AAP Magazine #47 *Shadows* and #50 *Shapes*; Wardynski Photo, *The Best Photographers of All Time*; Wikipedia and Wikimedia Commons. Photographs are shown for non-commercial, educational classroom use; rights remain with the photographers and their estates.
