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
| `npm run validate`   | data integrity checks (0 issues = pass)       |
| `npm run audit`      | destination → province → image table          |
| `npm run lint`       | lint server + client                          |
| `npm run build`      | build server (tsc) + client (vite)            |

## API (verify with `npm run audit`)

`GET /api/health`, `/api/provinces` (sorted by `number` asc), `/api/provinces/:slug`, `/api/provinces/:slug/destinations`, `/api/destinations` (`?tag=&province=&q=`), `/api/destinations/:slug`, plus JWT-protected `/api/auth/*` and `/api/trips/*`.<!-- Details in `docs/architecture-tech-stack.md`. -->

## Roadmap

- [x] Backend: models, API, seed (140 destinations), validate/audit
- [x] Client scaffold + homepage + browse pages
- [ ] Province & destination detail pages
- [ ] Trip planner (auth + itineraries)# Discover-Nepal
# Discover-Nepal
