# MarketLink

Farm Fresh, Just a Click Away — a full-stack platform connecting local
farmers-market Farmers with Customers through pre-orders and pickup, with
map-based discovery.

See [`PRD.md`](./PRD.md) for the problem/solution overview and
[`TRD.md`](./TRD.md) for schema, API routes, and technical decisions.
Daily progress is tracked in [`progress.md`](./progress.md).

## Module Map
| Module | Routes prefix |
|---|---|
| Auth + shared schema/middleware | `/api/auth` |
| Farmer | `/api/farmer` |
| Customer | `/api/customer` |
| Admin + Maps | `/api/admin` |

Before writing any code, read `TRD.md` fully — it locks the schema and route
contracts, including Section 8 (Cross-Cutting Requirements), which applies
to every page/form regardless of module.

## Tech Stack
- Frontend: React (Vite) + Tailwind + shadcn/ui
- Backend: Node.js + Express.js
- Database: MongoDB (Mongoose)
- Auth: JWT
- Maps: OpenStreetMap + Leaflet.js
- HTTP: Axios · State: Redux Toolkit

## Project Structure
```
marketlink/
├── client/          # React app
├── server/          # Express API
├── PRD.md
├── TRD.md
├── progress.md
└── .env.example
```

## Setup Instructions

### 1. Clone and branch
```bash
git clone <repo-url>
cd marketlink
git checkout -b devX/your-feature   # e.g. dev2/farmer-stock
```
Never commit directly to `main`. Always work on your own branch and open a
PR.

### 2. Backend setup
```bash
cd server
npm install
cp .env.example .env   # fill in your local MongoDB URI and JWT secret
npm run dev
```

### 3. Frontend setup
```bash
cd client
npm install
npm run dev
```

### 4. Environment variables (`server/.env`)
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```
Never commit `.env` — it's in `.gitignore`. Only `.env.example` (no real
values) is tracked.

## Git Workflow
1. Pull `main` before starting work each day: `git pull origin main`
2. Work only inside your assigned module's files (see table above and
   `TRD.md` §5 for exact route ownership)
3. Commit in small, meaningful chunks — no giant end-of-day dumps, no
   commits that just say "update" or "fix"
4. Open a PR into `main`, tag the lead for review
5. Lead reviews and merges — do not self-merge

## Working with AI Tools (Claude, Antigravity, etc.)
Give your AI tool `PRD.md` and `TRD.md` for context, plus tell it explicitly:
- Which module you're building (from the table above)
- To follow the locked schema and route paths in `TRD.md` exactly — not
  invent its own field names or endpoints
- To flag anything ambiguous instead of guessing
- To keep commits/diffs clean: no unrelated file changes, no commented-out
  dead code, no unnecessary reformatting of lines you didn't touch

You are expected to understand and be able to explain any code you submit,
regardless of what tool generated it — this may come up in evaluation.

## Creating the First Admin Account
Admin accounts are never created via public registration. After setting
`ADMIN_EMAIL` and `ADMIN_PASSWORD` in `server/.env`, run:
```bash
cd server
node scripts/seedAdmin.js
```
This creates a single admin user if one doesn't already exist.

## Deliverables Checklist (per SRS)
- [ ] All SRS-mandatory functional requirements working
- [ ] README (this file) — setup + structure
- [ ] Database schema / SQL or Mongo schema file
- [ ] Credentials for all user roles (Customer, Farmer, Admin) for testing
- [ ] Demo video (.mp4) covering all functional requirements
- [ ] Sitemap on the home page