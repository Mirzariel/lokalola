# Lokalola website — shared brief (read fully before writing anything)

**Tagline:** *Locally manage for greater energy.*
**One-liner:** Integrated organic waste processing for community independence.
**Mission sentence:** Lokalola is an integrated, community-based organic waste processing system that converts local organic waste into renewable energy and useful products, helping communities process their waste independently.
**Long form:** Our facilities combine multiple waste-conversion processes within a single system designed to be simple to operate by local communities and waste managers. Lokalola provides the processing technology, operational support, monitoring, maintenance and future upgrades needed to keep each facility running. By processing waste closer to where it is generated, Lokalola helps communities reduce organic waste accumulation, create local sources of sustainable energy, and become more independent in managing their own waste.

Origin: student venture (Universitas Gadjah Mada) in the **Pertamuda "seed and scale"** programme (energy-future track). Team: **Ghiyats Zhafir** (Industrial Engineering), **Mirzariel Akmal** (Electrical Engineering), **M. Haikal PL** (Biomedical Engineering). Not yet commercial: an early-stage venture heading into a pilot. Tone: confident, warm, engineer-honest. Never overclaim — figures are "design estimates to be validated in the pilot".

Audience: Pertamuda/Pertamina judges & mentors, district/village (kecamatan/kelurahan) governments, community waste managers, farmers, hotels/restaurants, investors.

## The story (problem → missing middle → product)
- Local government now refuses organic waste at transfer stations (TPS); it piles up, smells, spreads disease, and residents burn it → air pollution. Few people know organic waste can be fuel. There is no centralised organic-waste processing.
- Waste chain: **Upstream** (waste piles up) → **Midstream** (the missing piece: district/village-level facility that turns waste into valuable energy) → **Downstream** (regulation pushes renewable energy; demand for biochar / organic fertilizer). The problem is the empty middle.
- Lokalola = an easy-to-use unit installed per district/village. Sold to district governments, processors, communities. Assisted service after sale.
- Energy-chain framing (Pertamuda winners' pattern): **source → storage → measurable use.** Lokalola doesn't sell energy as the main product, but every package has a complete, measurable energy chain: waste = source, biogas = stored energy, heat that replaces LPG = measured use.

## Verified facts (use these numbers; do not invent others)
**Status quo / problem**
- 23–48 million tons/yr food loss & waste in Indonesia, 2000–2019 (Bappenas, Food Loss and Waste Study, 2021).
- 27.74 million tons organic waste generated (SIPSN 2024), ~40% is food waste.
- 35.7% of waste (~11.4 million t) from 290 regencies/cities is not properly managed.
- Yogyakarta case (Policy Brief MAP UGM, 2021): 282 ton/d collected, only 73 ton/d processed, processing capacity 148 ton/d — supply and demand don't meet. 666 waste banks, most focus on inorganic waste. Organic ≈ 40% of total waste. Food waste holds ≈ 13.3 MWh/d energy potential (Yogyakarta).
- Waste sources (structural gap slide): Household/community 50.78%, Markets & commerce 26.96%, Public facilities 13.38%, Offices 6.03%.
- Downstream gap: organic waste 20.8–49 million t/yr potential raw material vs <1 million t/yr processed nationally. Organic fertilizer: 948,000 t/yr subsidy allocation vs 192,000 t/yr compost produced.
- "Every ton of organic waste that fails to enter a processing system is a double loss: methane emissions from open dumping, and lost economic opportunity."

**The 50 kg package (one unit ≈ 150 households, ~8 × 5 m land)**
- Feedstock/day: 35 kg wet (food) waste + 15 kg dry (leaves, twigs).
- Waste protocol: food waste (wet) → biodigester; leaves etc. (dry) → pyrolysis; plastics & others → rejected.
- Biodigester: 3 × 2,000 L HDPE tanks in series, 4 m³ working volume, 52-day retention, anaerobic. Digestate pasteurised at 70 °C.
- Biogas: 3.5–4.7 m³/day, cleaned by H₂S scrubber, stored ~2.5 m³ in a gas bag.
- Pyrolysis: 1 retort (~110 L), 300–400 °C, heated by the biogas. Dry waste → biochar.
- Fertiliser out: ~17 kg solid + ~60 L liquid per day (biochar enriched with pasteurised digestate).
- IoT: ESP32-S3, 4 type-K thermocouples, pH, gas flow meter, MQTT/4G, microSD log. One START button; temperature, timer, safety automatic; data sent to server by itself ("make the thing smart, just to keep the operator simple").
- Energy: biogas 76–101 MJ/day of heat ≈ 200 LPG cylinders (3 kg) per year (≈600 kg LPG/yr).
- Carbon per package per year: **11.5 t CO₂e** = 7.0 t landfill methane avoided (12.8 t food waste × 0.50 t CO₂e/short ton, EPA WARM v16) + 2.7 t stored in biochar (1.8 t biochar × 65% C × 3.67 × 65% stable, IPCC 2019) + 1.8 t LPG replaced (76 MJ/day ÷ 46 MJ/kg × 2.98 kg CO₂/kg).
- Five user steps: 1 Sort at home (food → blue bin; leaves/twigs/shells → brown bin) · 2 Drop off at the site · 3 Press START · 4 The unit works · 5 Fertiliser to farmers.

**Business model**
- Two revenue streams from Year 1: (1) unit sales — IDR 85 million per unit; (2) service subscription — Service Basic IDR 0.5–1 million (remote IoT monitoring, visit every 3 months); spare parts & repairs 20% for Basic subscribers.
- Owner benefit per unit ≈ **+IDR 2.0–2.65 million/month net**: hauling cost avoided +1.95, fertiliser sales +0.93, LPG replaced by biogas +0.38 to +1.02, electricity & full service −1.26 (IDR M/month).
- Strategy insight: biochar/biogas resale is uncertain, so Lokalola sells the *certain* thing: the facility. Unit auto-produces **fertiliser** so users get a clear output (raw biochar is too abstract and could invite competition). "Sell to the end user; only spare parts and repairs afterwards."
- Target fulfilment: SBTi 1.5 °C · Indonesia NDC1 −29% · NDC2 −41% · Paris Agreement 1.5/2 °C · SDGs 7, 8, 9, 11, 13, 17 · reduces Scope 1 & Scope 2 emissions.

**Market**
- TAM: 13.3 million tonnes of food waste per year in Indonesia (13,300,000).
- SAM: 7,285 districts (kecamatan) + 8,496 urban villages (kelurahan) (Ministry of Home Affairs Decree No. 300.2-2430/2025).
- SOM (Year 1 target): 14 districts + 45 urban villages = Kota Yogyakarta.
- 500,000 t of subsidised organic fertiliser allocated per year within a national allocation of 9.5 million t (ANTARA 2024). Additional market: biochar carbon credits ≈ US$150/t CO₂e (S&P Global 2025).
- Unit buyers: district government, processors, communities. Fertiliser buyers: local farmers who need affordable, reliable-quality organic fertiliser from a nearby source.

**Roadmap**
- **Year 1 — Yogyakarta:** sell units to target districts and villages with hands-on support.
- **Year 2 — Service & Data:** servicing and AI data, maintenance for recurring cash flow; keep upgrading the units.
- **Year 5 — Own facility & exports:** nationwide adoption; collect waste from hotels, restaurants, markets, malls who want green-economy branding; process at Lokalola's own large facility; export derived products (biochar, biobriquettes, heat-based products) so as NOT to compete with partner villages' local fertiliser market.
- **Year 10 — Derived products:** end-to-end waste-to-energy supply chain. Upgrade biogas into biomethane (CH₄: replaces natural gas, CNG, Bio-LNG, industrial heat, rocket fuel, bio-CO₂), hydrogen (H₂), carbon (C), electricity (Wh). "Think like an engineer, not like a young businessperson."
- Financial projection, 50 kg package, IDR million (unit sales + service): Revenue 370 / 1,448 / 3,985 / 8,285 / 15,960 (Yr1–Yr5). Net profit −30 / 4 / 146 / 605 / 1,425. Cumulative net profit −30 / −26 / 120 / 724 / 2,150. CO₂e avoided (t/yr) — / 23 / 132 / 448 / 2,460.

**MVP / pilot**
- MVP is not an app: a single unit closing one target district's waste stream end-to-end — waste in, measured heat, fertiliser out.
- Funding ask **IDR 76 million**: bench test 8 · lab tests 3 · one 50 kg pilot package 65 (IDR M).
- Metrics: m³ biogas/day, MJ heat used, pyrolysis temperature & holding time (energy) · kg fertiliser, fertiliser quality, farmer purchase price (product).
- Non-financial needs: one partner district/village, access to a testing lab, energy & carbon mentors from Pertamina.

**Do NOT copy from the pitch slides:** the stray word "Grabpeddler", the garbled "IDR 59-6? Million", typos ("Localola", "Beetween", "pasrts"). Don't invent extra numbers, testimonials, partner logos, emails or phone numbers.

## Design direction
Warm, organic, engineered. Light cream/paper pages + deep forest/night dark sections, lime accent, big confident **Outfit** headings (rounded geometry echoes the wordmark), **Plus Jakarta Sans** body. The colour-coded energy chain from the illustrations is the site's signature: blue (biodigester) → gold (biogas) → orange (pyrolysis/heat) → green (fertiliser) with purple for IoT — use these `--c-*` tokens for anything that maps to the process. Rounded shapes (radius 20–32px), generous whitespace, real product imagery over stock-style decoration, subtle motion (reveal, flowing lines, counters). No emoji as icons — use inline SVG. No purple-gradient / generic-SaaS look. Mobile-first: everything must work at 360 px width with no horizontal scroll. Contrast AA. Respect `prefers-reduced-motion`. Keyboard accessible, semantic HTML, alt text on images.

## Tech conventions (STRICT — files are concatenated into one page)
- Plain static HTML/CSS/vanilla JS. No build tools, no frameworks, no npm. Only external resources allowed: the Google Fonts already linked. Charts = hand-built inline SVG/CSS.
- Project root: `C:\Users\Mirzariel\Downloads\Pertamuda\Lokalola Website`. Shared, already written, **do not edit**: `css/base.css` (tokens, `.container .section .section--dark/--cream/--mist .section-head .eyebrow .btn(--primary/--dark/--ghost) .chip .card .num .note .lead .hl .muted .reveal .sr-only`), `js/main.js`, `src/index.template.html`, `build.mjs`. Read `css/base.css` and `js/main.js` first.
- You own ONLY the files listed in your assignment. Fragments in `sections/*.html` contain just the section markup (no `<html>`, `<head>`, `<body>`). The template wraps sections 01–10 inside `<main id="main">`.
- **CSS class prefix**: every class you invent starts with your prefix (e.g. `hp-`). Never restyle bare elements or base classes globally (scope with your own wrapper class). Use `var(--…)` tokens, no hard-coded brand hex except tints.
- **JS**: wrap in an IIFE, no globals, must not throw if its section is missing. Use `window.Lokalola.fmt(n, decimals)` for number formatting and listen to `document.addEventListener('lokalola:lang', …)` if you render text dynamically. Prefer CSS over JS for animation.
- **Bilingual EN/ID**: write English in the markup. For EVERY visible text element add `data-id="Indonesian text"` (main.js swaps innerHTML; inline `<strong>` etc. allowed inside the attribute value, escape quotes as `&quot;`). Attributes: `data-id-attr="placeholder|Teks"` or `aria-label|Teks`. Use natural, concise Indonesian (not literal). Numbers, brand and product names stay as is. Text generated in JS must read the language via `window.Lokalola.getLang()`.
- **Counters**: `<span class="num" data-count-to="27.74" data-decimals="2" data-suffix=" M">0</span>`.
- Images live in `assets/img/` (paths relative to project root, e.g. `assets/img/unit-3d.png`). Available: `logo-mark.webp` (transparent leaf mark), `logo-wordmark-white.webp` (for dark bg, ~2.9:1), `logo-wordmark-dark.webp` (for light bg, ~3.1:1), `logo-tile-dark.webp` (mark on near-black square), `unit-3d.png` (transparent isometric 3D of the plant, 1519×970), `site-isometric.webp` (16:9 illustrated neighbourhood site with numbered callouts, cream bg), `five-steps.png` (16:9 illustrated 5 steps), `process-flow.png` (16:9 flow diagram + 3D unit with labels; transparent bg, dark text), `brand-guide.webp`, `favicon.png`. Give `width`/`height` attributes and `alt`; `loading="lazy"` except the hero. Don't create raster files; inline SVG is fine.
- Section anchors (exact ids, one `<section id="…">` each; sections have `class="section …"` and a heading with an `aria-labelledby`): `top` hero · `problem` · `solution` · `how` · `impact` · `calculator` · `business` · `roadmap` · `pilot` · `team` · `contact`.
- Alternate backgrounds for rhythm: hero dark → problem cream → solution paper → how mist/paper → impact dark → calculator cream → business paper → roadmap dark → pilot mist → team paper → contact dark → footer night.
- Verify your work: open `index.html` (run `node build.mjs` in the project root first; other agents' files may be missing – that's fine, the build skips them) in the built-in browser via `file:///C:/Users/Mirzariel/Downloads/Pertamuda/Lokalola%20Website/index.html`, screenshot at desktop and at mobile (resize_window preset mobile, reset to desktop after), and check `read_console_messages` for errors. Fix what you see. Do not touch other agents' files even if they look unfinished. Run `node build.mjs` yourself before verifying; concurrent builds are harmless.
- When done, reply with ≤120 words: files written, anything the integrator must know (e.g. dependencies on ids/classes). Don't paste code back.
