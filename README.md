# Discover Nepal

A travel-discovery web app for exploring Nepal's **7 provinces** and **140 destinations** — mountains, temples, tea gardens and hidden trails — with trip planning.

## Stack

- **client/** — React 18 + TypeScript + Vite + Tailwind CSS v4 (design system in `docs/google-stitch-prompt.md`)
- **server/** — Node.js + Express (TypeScript) + MongoDB via Mongoose, JWT auth
- **docs/** — `architecture-tech-stack.md` (source of truth), `nepal-destinations-by-province.md` (data reference)

## Prerequisites

- Node.js >= 20 (install script used `~/.local/node`, v24)
- MongoDB running on `mongodb://127.0.0.1:27017` (data dir `~/.local/mongodb-data`)
- Ports: client **5173**, server **5001** (5000 is reserved by macOS AirPlay)

## Quick start

```bash
# MongoDB (once)
export PATH="$HOME/.local/mongodb/8.0.9/bin:$PATH"
mongod --dbpath ~/.local/mongodb-data --logpath ~/.local/mongodb-data/mongod.log --fork

# Server — install, seed, validate, run
export PATH="$HOME/.local/node/bin:$PATH"
npm run install:all
npm run seed
npm run validate

# Dev (two terminals)
npm run dev:server   # http://localhost:5001
npm run dev:client   # http://localhost:5173 (proxies /api -> 5001)
```

## Scripts (root)

| Command            | Description                                    |
|--------------------|------------------------------------------------|
| `npm run dev:server` | tsx watch server on 5001                     |
| `npm run dev:client` | Vite dev client on 5173                       |
| `npm run install:all` | install server + client deps                  |
| `npm run seed`       | wipe + reseed provinces & destinations        |
| `npm run promote:admin -- <email>` | make a registered user an admin      |
| `npm run validate`   | data integrity checks (0 issues = pass)       |
| `npm run audit`      | destination → province → image table          |
| `npm run lint`       | lint server + client                          |
| `npm run build`      | build server (tsc) + client (vite)            |

## API (verify with `npm run audit`)

`GET /api/health`, `/api/provinces` (sorted by `number` asc), `/api/provinces/:slug`, `/api/provinces/:slug/destinations`, `/api/destinations` (`?tag=&province=&q=`), `/api/destinations/:slug`, plus JWT-protected `/api/auth/*` and `/api/trips/*`, plus public `POST /api/inquiries` (visitor inquiry capture).<!-- Details in `docs/architecture-tech-stack.md`. -->

## Admin (`/admin`, requires `isAdmin` on the JWT)

Promote your account after registering: `npm run promote:admin -- you@example.com`
(or `mongosh discover-nepal --eval 'db.users.updateOne({email:"you@example.com"},{$set:{isAdmin:true}})'`).

- **CMS** — CRUD for destinations and provinces under `/api/admin/*`; UI at `/admin/destinations`, `/admin/provinces` (province number edits warn if they'd break the 1–7 official mapping).
- **CRM / inquiries** — visitors `POST /api/inquiries` from `/contact`; admin inbox at `/admin/inquiries` (list newest-first, status `new → contacted → closed` via `PATCH /api/admin/inquiries/:id`), and a dashboard at `/admin` with destination/province/user/inquiry counts. All admin routes return 403 for non-admins.

## Roadmap

- [x] Backend: models, API, seed (140 destinations), validate/audit
- [x] Client scaffold + homepage + browse pages
- [x] Province & destination detail pages
- [x] Trip planner (auth + itineraries)
- [x] CMS admin panel (destinations + provinces) with role-guarded routes
- [x] Light CRM: public inquiry form (/contact → POST /api/inquiries) + admin inbox/dashboard
- [ ] Future: gallery, reviews, multilingual destination content# Discover-Nepal
# Discover-Nepal
