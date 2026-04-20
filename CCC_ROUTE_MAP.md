# CCC Route Map

Project: Carnivore Command Center

---

## Public Website Routes

| Route | Purpose |
|------|---------|
| / | Homepage / main marketing page |
| /product/ | Product explanation / offer page |
| /beta/ | Beta signup / waitlist |
| /about/ | Company / founder story |
| /investor/ | Investor information |
| /dashboard/ | Public dashboard demo / preview only |
| /privacy/ | Privacy policy |
| /terms/ | Terms page |

---

## App Routes

| Route | Purpose |
|------|---------|
| /app/ | Login / account entry |
| /app/onboarding/ | First-time setup |
| /app/dashboard/ | Real logged-in dashboard |
| /app/log/ | Log / history page |

---

## Route Rules

- `/dashboard/` is never the real app.
- `/dashboard/` is public demo only.
- `/app/dashboard/` is the real product dashboard.
- Public pages use marketing shell.
- App pages use app shell.
- New product features should go under `/app/` unless they are public-facing.

---

## Build Rules

- `src/` = source of truth
- `dist/` = built output
- Edit source files in `src/`
- Build site with `node scripts/build.js`

---

## Current Decisions Locked

- Keep `investor/`
- Remove `investors/`
- Keep `dashboard/` as demo
- Keep `app/dashboard/` as real product
- Keep `app/index.html` as auth entry