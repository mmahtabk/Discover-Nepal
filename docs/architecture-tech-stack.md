# Discover Nepal — Architecture & Tech Stack

A travel-discovery web app for exploring Nepal's **7 provinces**, **140 destinations**, and trip planning.

> This document is the source of truth for the project structure, data models, and API.
> Follow it exactly when adding code.

---

## 1. Overview

- **Client** — React 18 + TypeScript + Vite + Tailwind CSS (v4)
- **Server** — Node.js + Express (TypeScript) + MongoDB via Mongoose
- **Auth** — JWT (Bearer) with bcrypt password hashing
- **Monorepo** — two independent apps (`client/`, `server/`) + a root convenience `package.json`

```
Project1College/
├── README.md
├── docs/                        # this documentation
├── client/                      # React + Vite + TS + Tailwind
└── server/                      # Express + TS + MongoDB (Mongoose)
```

---

## 2. Folder structure

### server/

```
server/
├── package.json
├── tsconfig.json
├── .env.example                 # MONGODB_URI, PORT, JWT_SECRET, ...
├── src/
│   ├── index.ts                 # bootstrap: connect DB, start HTTP server
│   ├── app.ts                   # express app (middleware + routes)
│   ├── config/
│   │   ├── env.ts               # typed env loader (dotenv)
│   │   └── db.ts                # mongoose connection helper
│   ├── models/
│   │   ├── province.model.ts
│   │   ├── destination.model.ts
│   │   ├── user.model.ts
│   │   └── trip.model.ts
│   ├── controllers/
│   │   ├── province.controller.ts
│   │   ├── destination.controller.ts
│   │   ├── auth.controller.ts
│   │   └── trip.controller.ts
│   ├── routes/
│   │   ├── index.ts             # mounts all routers under /api
│   │   ├── province.routes.ts
│   │   ├── destination.routes.ts
│   │   ├── auth.routes.ts
│   │   └── trip.routes.ts
│   ├── middleware/
│   │   ├── asyncHandler.ts
│   │   ├── auth.middleware.ts   # JWT verification (protected routes)
│   │   ├── error.middleware.ts  # central error handler
│   │   └── notFound.middleware.ts
│   ├── utils/
│   │   ├── ApiError.ts
│   │   └── ApiResponse.ts
│   ├── types/
│   │   └── express.d.ts         # Request.user augmentation
│   ├── seed/
│   │   ├── seeds and data live under seed/data and seed/images
│   │   ├── seed.ts              # runnable: npm run seed
│   │   └── data/
│   │       ├── provinces.ts
│   │       ├── verifiedImages.ts # verified-image map for major landmarks
│   │       ├── destinations.ts   # 140 destinations (source of truth)
│   │       └── imageHelpers.ts   # static image resolver (no live API)
│   │   └── images/              # per-province slug -> static image URL map
│   │       ├── index.ts          # DESTINATION_IMAGES aggregate
│   │       ├── placeholder.ts    # self-contained data-URL placeholder card
│   │       └── {province}.ts     # koshi … sudurpashchim
│   └── scripts/
│       ├── validate.ts          # npm run validate
│       └── audit.ts             # npm run audit
└── dist/                        # compiled output (npm run build)
```

### client/

```
client/
├── package.json
├── tsconfig.json
├── vite.config.ts               # + /api proxy -> http://localhost:5000
├── eslint.config.mjs
├── .prettierrc
├── index.html
├── .env.example                 # VITE_API_BASE_URL
├── src/
    ├── main.tsx
    ├── App.tsx                  # router + AuthProvider + SavedProvider
    ├── index.css                # tailwind + @theme tokens
    ├── lib/
    │   ├── api.ts               # fetch wrapper (base URL from env; attaches JWT)
    │   ├── geo.ts               # haversine distance + category→map colour map
    ├── i18n/                    # en.ts / ne.ts / index.ts (react-i18next)
    ├── types/index.ts           # shared TS types matching server DTOs
    ├── auth/AuthContext.tsx     # login/register/logout, JWT in localStorage
    ├── saved/SavedContext.tsx   # saved-destinations (DB-backed, per user)
    ├── data/
    │   └── site.ts              # site metadata (name, nav links)
    ├── hooks/
    │   ├── useProvinces.ts
    │   └── useDestinations.ts
    ├── components/
    │   ├── layout/Navbar.tsx    # includes EN/नेपाली toggle
    │   ├── layout/Footer.tsx
    │   ├── ui/ProvinceCard.tsx
    │   ├── ui/DestinationCard.tsx   # + save/bookmark toggle (JWT user)
    │   ├── ui/TagPill.tsx
    │   ├── ui/SectionHeader.tsx
    │   └── ui/Loader.tsx
    └── pages/
        ├── HomePage.tsx
        ├── ProvincesPage.tsx
        ├── ProvinceDetailPage.tsx
        ├── DestinationsPage.tsx
        ├── DestinationDetailPage.tsx
        ├── MapPage.tsx          # Leaflet + OSM interactive map (/map)
        └── TripPlannerPage.tsx
```

---

## 3. Ports & env

| App    | Port | Env file        |
|--------|------|-----------------|
| client | 5173 | `client/.env.example` → `VITE_API_BASE_URL` |
| server | 5000 | `server/.env.example` → `MONGODB_URI`, `PORT`, `JWT_SECRET`, `JWT_EXPIRES_IN` |

Server dev uses `tsx watch` on `src/index.ts`. Client dev proxies `/api` to the server.

---

## 4. Data models (Mongoose)

### Province
```ts
{
  name,            // "Koshi"
  nameNepali,      // "कोशी"
  slug,            // "koshi"  (unique, used for links + seed lookups)
  number,          // 1..7 — THE OFFICIAL NEPAL PROVINCE NUMBER. Never derive from index/order.
  capital,         // "Biratnagar"
  areaKm2,
  population,
  districts,
  description,
  highlights: string[],
  imageUrl
}
```

**Official province numbering (must never change):**

| number | slug            | name         | capital       |
|--------|-----------------|--------------|---------------|
| 1      | koshi           | Koshi        | Biratnagar    |
| 2      | madhesh         | Madhesh      | Janakpur      |
| 3      | bagmati         | Bagmati      | Hetauda       |
| 4      | gandaki         | Gandaki      | Pokhara       |
| 5      | lumbini         | Lumbini      | Deukhuri*     |
| 6      | karnali         | Karnali      | Birendranagar |
| 7      | sudurpashchim   | Sudurpashchim| Godawari      |

\* Lumbini's capital is officially Deukhuri (Dang).

### Destination
```ts
{
  name,
  slug,             // unique
  provinceId,       // ObjectId -> Province (REAL reference, resolved from province-slug during seed)
  provinceSlug,     // denormalized slug of the linked province (for validation + convenience)
  district,
  category,         // "trek" | "nature" | "culture" | "hidden-gem"
  subtitle,         // one-line hook
  description,
  bestSeason,
  elevationM?,      // optional
  lat,              // WGS84 latitude (map pins)
  lng,              // WGS84 longitude (map pins)
  imageUrl
}
```

### User
```ts
{ name, email (unique), passwordHash, savedDestinations: ObjectId[], createdAt }
```

### Trip
```ts
{
  user: ObjectId,         // -> User
  title,
  startDate?, endDate?,
  destinationIds: ObjectId[],   // -> Destination
  notes?,
  createdAt
}
```

---

## 5. API endpoints (all JSON, `/api` prefix)

| Method | Path                       | Auth | Description |
|--------|----------------------------|------|-------------|
| GET    | `/api/health`              | —    | liveness check |
| GET    | `/api/provinces`           | —    | all provinces **sorted by `number` asc** |
| GET    | `/api/provinces/:slug`     | —    | one province by slug |
| GET    | `/api/provinces/:slug/destinations` | — | destinations of a province |
| GET    | `/api/destinations`        | —    | filters: `?tag=&province=&q=&sort=` |
| GET    | `/api/destinations/:slug`  | —    | one destination (with populated province) |
| POST   | `/api/auth/register`       | —    | `{ name, email, password }` → `{ token, user }` |
| POST   | `/api/auth/login`          | —    | `{ email, password }` → `{ token, user }` |
| GET    | `/api/auth/me`             | JWT  | current user |
| GET    | `/api/trips`               | JWT  | user's trips |
| POST   | `/api/trips`               | JWT  | create trip |
| GET    | `/api/trips/:id`           | JWT  | one trip |
| PUT    | `/api/trips/:id`           | JWT  | update trip |
| DELETE | `/api/trips/:id`           | JWT  | delete trip |
| GET    | `/api/users/me/saved`      | JWT  | saved destinations (populated) |
| POST   | `/api/users/me/saved/:destId` | JWT | save a destination (idempotent) |
| DELETE | `/api/users/me/saved/:destId` | JWT | un-save a destination |

Province `GET /api/provinces` response order is guaranteed: sort by `number` ascending **on the server** (never by array order or alphabet).

---

## 6. Interactive map view

- Route `/map` renders `MapPage` with **Leaflet + OpenStreetMap** tiles (installed: `leaflet`,
  `@types/leaflet`). Every destination carries `lat`/`lng` (from `seed/data/coordinates.ts`, all 140
  slugs covered; seeded + validated so it can't miss).
- Pins are `L.circleMarker`s color-coded by category (`lib/geo.ts` → `CATEGORY_COLORS`), with a
  popup showing name, province · district, category and a link to the detail page.
- **Find nearest destinations:** the "Find nearest" button asks the browser for geolocation
  (`navigator.geolocation`, permission prompt), then the 10 nearest destinations are shown in a side
  list sorted by haversine distance (computed client-side in `lib/geo.ts`). Clicking a list entry
  flies the map to that pin.
- Destination detail pages link `View on map` → `/map?d=<slug>`, which centers + opens the popup for
  that destination.

---

## 7. Image strategy

Images are **fully static** — no live image API exists anywhere in the render or seed path.

1. **Curated static map** — every destination slug maps to a fixed, hand-picked Wikimedia Commons
   thumbnail in `seed/images/{province}.ts`, aggregated by `seed/images/index.ts` (`DESTINATION_IMAGES`).
   113 of 140 destinations have a real photo sourced from Commons.
2. **Honest placeholder** — the 27 destinations without a confident Commons photo resolve to
   `placeholderImageUrl(name)` (`seed/images/placeholder.ts`): a self-contained `data:image/svg+xml`
   card showing the destination name + "PHOTO COMING SOON". No third-party network call.
3. **No keywords-based URLs** — the old LoremFlickr fallback
   (`https://loremflickr.com/1024/768/<keywords>?lock=<hash>`) was removed because the live service
   silently served the same generic photo (e.g. a cat statue) for many destinations. The deprecated
   `keywords` field remains on `DestinationSeed` only for source-data compatibility.
4. Resolution happens in `seed/data/imageHelpers.ts::resolveDestinationImage`, which loudly logs the
   exact reason whenever a destination falls back to a placeholder. `seed.ts` prints an image summary
   (real vs placeholder) at seed time.
5. Rules enforced by `npm run validate`:
   - fail on any missing (empty) image URL;
   - fail on any placeholder-**service** URL (`loremflickr.com`, `picsum.photos`, `placehold.co`,
     `via.placeholder.com`, `dummyimage.com`, `fakeimg.pl`, `placeholder.imgix.net`); our own
     `data:` SVG placeholders are expected and allowed;
   - fail on image URLs duplicated across destinations in different provinces/categories (the
     "one cat photo everywhere" failure mode).

---

## 8. Scripts

| Command                      | Where    | Description |
|------------------------------|----------|-------------|
| `npm run dev`                | server   | tsx watch |
| `npm run build`              | server   | tsc → dist |
| `npm run seed`               | server   | wipe + reseed provinces & destinations |
| `npm run validate`           | server   | data integrity checks (0 issues = pass) |
| `npm run audit`              | server   | human-readable destination → province → image table |
| `npm run lint` / `format`    | server   | eslint / prettier |
| `npm run dev`                | client   | vite dev server (5173, proxies /api) |
| `npm run build`              | client   | vite build |

`npm run validate` checks:
1. Every `Destination.provinceId` resolves to the **intended** province (via `provinceSlug`).
2. Every `Province.number` matches the official mapping (table above).
3. No two destinations share an identical `imageUrl`.

---

## 9. Design conventions (summary)

The full design system lives in `docs/google-stitch-prompt.md`. Key rules for rendering:

- Provinces must always be rendered **sorted by `number` ascending**.
- Destination cards show `category` as a colored pill.
- `hidden-gem` destinations are visually flagged.
- All images use the server-provided `imageUrl` directly (`<img loading="lazy">`).