# Discover Nepal — Design System (Google Stitch Prompt)

Visual language for the **Discover Nepal** brand. Modeled on a warm, editorial travel aesthetic
rooted in Nepal's flag colors and Himalayan landscapes.

---

## 1. Brand essence

> "Namaste Nepal" — an invitation written across mountains, temples, tea gardens and trails.
> Calm, airy, editorial. Forest-green accents on a white canvas.

- **Feel** — editorial travel magazine meets modern studio. Generous whitespace, large imagery,
  quiet navigation.
- **Mood words** — warm, grounded, serene, adventurous, authentic.

---

## 2. Color tokens (Tailwind `@theme`)

| Token               | Hex       | Use |
|---------------------|-----------|-----|
| `--color-evergreen` | `#2F6B4F` | primary accent / brand (forest green) |
| `--color-pine`      | `#24563E` | hovers, dark heroes, footer |
| `--color-mint`      | `#E9F1EC` | soft panels / card tints (white-green) |
| `--color-mist`      | `#69786F` | muted text (green-tinged gray) |
| `--color-sage`      | `#A8C6B0` | highlights / stars on dark greens |
| `--color-ink`       | `#1F2A24` | body text (near-black green) |
| `--color-error`     | `#B3403D` | form-error banners |
| `white`             | `#FFFFFF` | page background (default) |

Color meaning per **category pill** (shades of the forest-green family):

- `trek` → evergreen
- `nature` → evergreen / pine
- `culture` → pine
- `hidden-gem` → mint chip, evergreen text, evergreen ring

**Rule of use** — backgrounds stay white / mint; evergreen is the accent (CTAs, badges, hairline
rules), never a page flood. Dark pine/photo sections may invert the palette (white text).

---

## 3. Typography (Google Fonts)

```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

| Role      | Font             | Weight | Notes |
|-----------|------------------|--------|-------|
| Display/headings | Playfair Display | 600/700 | editorial serif; hero ~5-7ch words |
| Body/UI   | Inter            | 400–700 | buttons, cards, nav, paragraphs |

Type scale (fluid, roughly): hero `clamp(2.5rem, 6vw, 4.5rem)`, h2 `2rem`, h3 `1.25rem`,
eyebrow `0.75rem` uppercase letter-spaced, body `1rem/1.7`.

**Eyebrow pattern** — small uppercase evergreen label above every section heading, e.g.
`— 7 provinces` / `— Trek · Nature · Culture · Hidden gems`.

---

## 4. Component style

### Cards (province / destination)
- `rounded-2xl`, subtle border `border-mint`, bg `white`.
- Image `aspect-[4/3]`, `object-cover`, `overflow-hidden`, **hover: scale 1.06** with
  `transition-transform`.
- Whole card lift on hover: `-translate-y-1`, soft shadow.
- Category **pill**: uppercase 11px, colored chip (see token table).
- Hidden-gem marker: small "✦" sage/evergreen glyph.

### Buttons
- Primary: evergreen bg, white text, `rounded-full`, px-6 py-3, hover → pine.
- Secondary/ghost: 1px ink outline, transparent, hover → mint fill.
- Skewed start? no — keep it calm.

### Navbar
- Sticky top, white/80 backdrop-blur, hairline mint border.
- Left: wordmark `Discover Nepal` (Playfair, evergreen "Nepal").
- Right: `Provinces · Destinations · Trip Planner` + EN/नेपाली switch.

### Footer
- Pine background, white text.
- Columns: brand blurb · provinces (7) · explore (Trek/Nature/Culture/Hidden gems) · colophon.

### Hero (homepage)
- Full-width photo band with pine/dark gradient overlay + white text overlay.
- Eyebrow, huge Playfair headline, sub copy, two CTAs.
- Optional: floating "7 provinces · 140 destinations · 8 WHS" stat strip.

### Section headers
- `SectionHeader` component: eyebrow (`— {label}`) + Playfair title + optional right-side link.

---

## 5. Layout & rhythm

- Max content width `max-w-6xl mx-auto px-4 sm:px-6`.
- Section vertical padding `py-16` / `py-24`.
- Page titles: eyebrow + `text-4xl` Playfair + muted lede paragraph.
- Image grids: `grid md:grid-cols-2 lg:grid-cols-3 gap-6`.
- Province blocks sort **by `number` ascending** — the homepage "7 Provinces" strip is
  `1 Koshi … 7 Sudurpashchim`, always.
- `hidden-gem` destinations get a dashed-underline evergreen tag and a short "off the beaten path"
  tone in their description.

---

## 6. Motion & misc

- Respect `prefers-reduced-motion`; fades/lifts are short (`150–300ms`).
- `loading="lazy"` on all below-the-fold images.
- Favicon: evergreen `प्र` on white? Use a minimal "∿" mountain mark (SVG).