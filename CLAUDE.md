# CLAUDE.md — Community Support

This is the **standalone BloomAudit Community Support app** — a public Q&A forum and Knowledge Base. It was extracted out of `apps/website` (2026-07) so it can be deployed and scaled independently. The `apps/website` and `apps/audit-app` "Community Support" buttons just link out to this app's URL — they no longer host any of this feature themselves.

## Rules

- Always present a plan before modifying or creating files
- Wait for explicit approval ("go ahead", "yes", "do it") before executing
- Never skip the planning step

## Stack

| Layer | Tech |
|---|---|
| Backend | Node.js + Express + PostgreSQL (`pg`) |
| Frontend | React + Vite + Tailwind CSS + Framer Motion |
| Language | JavaScript (no TypeScript) |
| DB | PostgreSQL (via `pg`), shared with the other two apps |
| Auth | None — this app is fully public, no login anywhere |
| Deploy | Railway (not the shared EC2 host the other three apps use) |

## Folder Structure

```
community-support/
├── backend/        — Express API (routes/controllers/models split, mirrors apps/website's pattern)
│   └── server.js   — entry point; also serves frontend/dist as static in production
├── frontend/        — React frontend (Vite + Tailwind)
│   └── src/
└── Dockerfile        — multi-stage: builds frontend, then Express serves API + built frontend from one process/service
```

Only one Railway service is needed — the backend serves the built frontend, so there's one Dockerfile, one deployment, one subdomain.

## Commands

```bash
# Backend (from apps/community-support/backend/)
npm run dev          # nodemon, hot reload
npm start             # production

# Frontend (from apps/community-support/frontend/)
npm run dev          # Vite dev server
npm run build         # production build → dist/, served by the backend in production
```

## Database — CRITICAL (Shared Across All Apps)

This app does **not** own its tables — `community_questions`, `community_replies`, `kb_topics`, `kb_articles` live in the shared `public` schema, defined at the monorepo root:

```
database/databasse.sql       ← single source of truth for the entire platform schema
database/migrations/         ← all migration scripts
```

- This app creates those 4 tables idempotently (`CREATE TABLE IF NOT EXISTS`) on boot — a no-op against the real shared DB (where audit-app's schema sync already provisions them), but lets this app self-init against a standalone Postgres too (e.g. before it's pointed at the shared instance).
- KB content (`kb_topics`/`kb_articles`) is admin-managed exclusively from `apps/dashboard`'s Knowledge Base admin page — this app only reads it.
- Forum moderation (deleting questions/replies) is also exclusively in `apps/dashboard` — this app never deletes anything.
- Whenever a schema change is needed for these tables, update `database/databasse.sql` at the monorepo root — never a local copy — following the same additive-vs-non-additive rules as every other app (see root `CLAUDE.md`).

## No auth, no admin surface

This app is intentionally public-read/public-write only:
- No login, no JWT, no sessions anywhere in this app
- Anti-spam/rate-limiting was explicitly declined for v1 (inherited decision from the original website implementation) — do not add any without checking first
- Do not add moderation or KB-editing endpoints here — those stay in `apps/dashboard`

## Deploy (Railway)

- `DATABASE_URL` is injected automatically by Railway when a Postgres reference is linked to this service — point it at the same shared Postgres instance the other apps use (requires that instance to be reachable from Railway's network).
- `/health` — used for Railway's health check.
- No GitHub Actions workflow — Railway builds and deploys directly from this directory (root-directory-scoped to `apps/community-support`), watching only changes under this path.

## Git & Committing

- **Claude does not run `git add`, `git commit`, `git push`, `git checkout -b`, or `gh pr create`/`gh pr merge`** without explicit confirmation first. Approval to build code is not approval to commit/push.
- Never include a `Co-Authored-By` line referencing Claude or Anthropic
- Follow conventional commit prefixes: `feat:` · `fix:` · `docs:` · `refactor:` · `test:`
- Never commit `.env`, `node_modules/`, or `dist/`

## Pre-Push Verification

- Run `npm run build` in `frontend/` and confirm zero errors
- Start the backend and confirm `/health` and the community/KB API routes respond correctly before pushing
