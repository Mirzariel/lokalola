# Lokalola website

**Locally manage for greater energy.** Landing site for Lokalola, an integrated, community-based organic waste processing system that turns local organic waste into renewable energy and useful products.

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
- `css/base.css` — shared design tokens; `css/<area>.css` — section styles (class prefixes `hp-`, `sh-`, `ic-`, `bm-`, `tc-`)
- `js/main.js` — EN/ID switch, reveal, counters, nav; `js/<area>.js` — section behaviour
- `docs/BRIEF.md` — source facts, numbers and conventions

```bash
node build.mjs
```

Every visible text has `data-id="…"` holding its Indonesian version.

## Notes

- All figures come from the Lokalola pitch deck and are design estimates to be validated in the pilot.
- The contact form is static and sends nothing. Connect it to a backend or email service (see the `TODO` in `sections/10-team-contact.html`).
- Team members have no photos yet; avatars are initials.
