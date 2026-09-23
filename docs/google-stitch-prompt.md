# Discover Nepal — Design System (Google Stitch Prompt)

Visual language for the **Discover Nepal** brand. Modeled on a warm, editorial travel aesthetic
rooted in Nepal's flag colors and Himalayan landscapes.

---

## 1. Brand essence

> "Namaste Nepal" — an invitation written across mountains, temples, tea gardens and trails.
> Calm, airy, editorial. Forest-green and gold accents on a warm stone canvas.

- **Feel** — editorial travel magazine meets modern studio. Generous whitespace, large imagery,
  quiet navigation.
- **Mood words** — warm, grounded, serene, adventurous, authentic.

---

## 2. Color tokens (Tailwind `@theme`)

| Token             | Hex       | Use |
|-------------------|-----------|-----|
| `--color-forest`  | `#1a5c3a` | primary accent / brand (forest green); dark heroes, footer |
| `--color-mid`     | `#2d7a52` | secondary green (nature category, tints) |
| `--color-mint`    | `#e8f5ee` | soft panels / card tints, backgrounds, hover states |
| `--color-gold`    | `#c9963a` | accent / CTAs, hero eyebrows, highlights on dark greens |
| `--color-cream`   | `#fdf3e3` | gold-tinted chips / edge tags |
| `--color-sky`     | `#2c6fa8` | sky blue — map & culture elements |
| `--color-sky-tint`| `#e8f2fb` | sky-tinted panels (e.g. map legend) |
| `--color-stone`   | `#f7f5f0` | page background |
| `--color-stone-2` | `#eeebe3` | borders / dividers |
| `--color-ink`     | `#1a1a18` | headings / text (near-black warm) |
| `--color-muted`   | `#6b6b60` | muted text |
| `--color-rose`    | `#d05c7e` | hidden-gem accent (soft pink/rose) |
| `--color-error`   | `#b3403d` | form-error banners |
| `white`           | `#FFFFFF` | card / white surfaces |

**Category pill / map pin colors — fixed spec:**

| Category   | Color token | Hex       |
|------------|-------------|-----------|
| `nature`   | mid green   | `#2d7a52` |
| `culture`  | sky blue    | `#2c6fa8` |
| `trek`     | gold        | `#c9963a` |
| `hidden-gem` | soft rose  | `#d05c7e` |

The same mapping drives the map pins (`client/src/lib/geo.ts` → `CATEGORY_COLORS`), the map
legend, and the category pills (`TagPill`).

**Rule of use** — backgrounds stay stone/mint; forest green is the accent (nav active states,
links, eyebrows, hairline rules), never a page flood. Gold is reserved for primary CTAs. Dark
forest/pine photo sections may invert the palette (white text).

---

## 3. Typography (Google Fonts)

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

| Role      | Font            | Weight | Notes |
|-----------|-----------------|--------|-------|
| Display/headings | Georgia (serif) | 400–700 | editorial serif; italics on key accent words (e.g. *Nepal*) |
| Body/UI   | Inter           | 400–700 | buttons, cards, nav, paragraphs |

Type scale (fluid, roughly): hero `clamp(2.5rem, 6vw, 4.5rem)`, h2 `2rem`, h3 `1.25rem`,
eyebrow `0.75rem` uppercase letter-spaced, body `1rem/1.7`.

**Eyebrow pattern** — small uppercase forest-green label above every section heading, e.g.
`— 7 provinces` / `— Trek · Nature · Culture · Hidden gems`.

**Small labels** — category tags and province numbers are uppercase, wide letter-spacing,
10–11px.

---

## 4. Component style

### Cards (province / destination)
- `rounded-2xl`, subtle border `border-stone-2`, bg `white`, page bg `stone`.
- Image `aspect-[4/3]`, `object-cover`, `overflow-hidden`, **hover: scale 1.06** with
  `transition-transform`.
- Whole card lift on hover: `-translate-y-1`, soft shadow.
- Category **pill**: uppercase 11px, colored chip (see token table).
- Hidden-gem marker: small "✦" rose glyph.

### Buttons
- Primary CTA: gold bg, ink text, `rounded-full`, px-6 py-3.
- Ghost/outline: forest border or 1px ink outline, transparent, hover → forest fill / mint.
- Nav active / filter pills: forest bg, white text.

### Navbar
- Sticky top, white/80 backdrop-blur, hairline stone-2 border.
- Left: wordmark `Discover Nepal` (serif, italic "Nepal").
- Right: `Provinces · Destinations · Map · Plan a Trip` + EN/नेपाली switch.

### Footer
- Forest background, white text.
- Columns: brand blurb · provinces (7) · explore (Trek/Nature/Culture/Hidden gems) · colophon.

### Hero (homepage)
- Full-width photo band with forest/dark gradient overlay + white text overlay.
- Gold eyebrow, huge serif headline (italic accent words), sub copy, gold + ghost CTAs.
- Optional: floating "7 provinces · 140 destinations · 8 WHS" stat strip.

### Section headers
- `SectionHeader` component: eyebrow (`— {label}`) + serif title + optional right-side link.

---

## 5. Layout & rhythm

- Max content width `max-w-6xl mx-auto px-4 sm:px-6`.
- Section vertical padding `py-16` / `py-24`.
- Page titles: eyebrow + `text-4xl` serif + muted lede paragraph.
- Image grids: `grid md:grid-cols-2 lg:grid-cols-3 gap-6`.
- Province blocks sort **by `number` ascending** — the homepage "7 Provinces" strip is
  `1 Koshi … 7 Sudurpashchim`, always.
- `hidden-gem` destinations get a dashed-underline rose tag and a short "off the beaten path"
  tone in their description.

---

## 6. Motion & misc

- Respect `prefers-reduced-motion`; fades/lifts are short (`150–300ms`).
- `loading="lazy"` on all below-the-fold images.
- Favicon: minimal "∿" mountain mark (SVG).