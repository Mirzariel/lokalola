# Lokalola website

**Waste is energy in the wrong place.** Landing site for Lokalola (*Locally manage for greater energy*), an integrated, community-based organic waste processing system that turns local organic waste into renewable energy and useful products.

Static site: plain HTML, CSS and vanilla JS. No dependencies. English and Indonesian (toggle in the header).

## Run

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8765
```

## Edit

`index.html` is generated. Edit the parts and rebuild (needs Node 18+):

- `src/index.template.html` — page shell and section order
- `sections/*.html` — one file per section
- `css/base.css` — shared design tokens and the motion rules; `css/<area>.css` — section styles (class prefixes `hp-`, `st-`, `sh-`, `ic-`, `bm-`, `tc-`)
- `js/main.js` — EN/ID switch, replaying reveals, counters, split headlines, scroll scrub, nav; `js/<area>.js` — section behaviour
- `js/story.js` + `css/story.css` — hero details, the pinned scroll story, *What we sell* and *Why it's different*
- `docs/BRIEF.md` — source facts, numbers and conventions

```bash
node build.mjs
```

Every visible text has `data-id="…"` holding its Indonesian version.

## Story order

Hero (*Waste is energy in the wrong place*) → Story (pinned, scroll-scrubbed) → Problem → What we sell → Why it's different → How it works → Impact → Calculator → Business → Market → Vision (*From kitchen waste to rocket fuel*) → Pilot → Team → Contact.

## Motion contract

- `.reveal`, `.split`, `[data-inview]` get `.is-in` on entering the viewport and lose it once fully out, so every animation replays (scrolling up too; `data-from="above"` flips the direction).
- `[data-count-to]` counters re-count on every entry.
- `.section-head h2` headings are split into words automatically.
- `[data-scrub]` gets `--p` (0→1) as it crosses the viewport; `data-scrub="pin"` measures a sticky track. JS: `Lokalola.onScrub(el, fn)`.
- Looping animations pause while their section is off screen. `prefers-reduced-motion` shows everything statically.

## Notes

- All figures come from the Lokalola pitch deck and are design estimates to be validated in the pilot.
- The contact form is static and sends nothing. Connect it to a backend or email service (see the `TODO` in `sections/10-team-contact.html`).
