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

## Folder Structure

```
community-support/
├── backend/        — Express API (routes/controllers/models split, mirrors apps/website's pattern)
│   └── server.js   — entry point; also serves frontend/dist as static in production
├── frontend/        — React frontend (Vite + Tailwind)
│   └── src/
└── Dockerfile        — multi-stage: builds frontend, then Express serves API + built frontend from one process/service
```

Only one service is needed — the backend serves the built frontend, so there's one Dockerfile, one deployment, one subdomain.

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

## PDF guides (mirrored from apps/website)

The Knowledge Base page (`/kb`) mirrors the website's `/resources/guides` page, including its downloadable PDFs.
- The PDFs are **copies** in `frontend/public/guides/` (same paths as `apps/website/frontend/public/guides/`), and the two screenshots are copies in `frontend/src/assets/screenshots/`. They are copied, not linked, so downloads stay same-origin.
- The guide list (titles, descriptions, file paths) lives in `frontend/src/guides.js`, which the KB page and its search both read.
- Whenever a PDF or the guide list changes on the website, re-copy the files and update `guides.js` here too.

## Runtime

- `DATABASE_URL` must point at the same shared Postgres instance the other apps use.
- `/health` — health check endpoint (also used by the Dockerfile `HEALTHCHECK`).

## Deploy (AWS, own small host)

Runs on its **own** EC2 host, deliberately separate from the shared BloomAudit host (that one is a 1 GB t3.micro with little memory headroom).

- **Account / region:** BloomAudit AWS account `874456855550`, `ap-southeast-1`, same VPC as the shared RDS.
- **Host:** `bloomaudit-community-support` (`i-0504673370238d4af`), t4g.micro arm64, Amazon Linux 2023, Elastic IP `54.254.165.16`. First-boot setup is `deploy/user-data.sh` (1 GB swap + Docker).
- **Containers:** `deploy/docker-compose.yml` — the app plus Caddy, which terminates HTTPS for `community.bloomaudit.com` and renews the certificate itself (`deploy/Caddyfile`).
- **Network:** security group `bloomaudit-community-sg` allows only 80/443 in — **no SSH**. The RDS security group allows 5432 from that group only.
- **Secrets:** `DATABASE_URL` lives in SSM Parameter Store as SecureString `/community-support/DATABASE_URL`; the host's `/opt/community-support/.env` is written from it. Never commit it.
- **CI/CD:** `.github/workflows/deploy.yml` — every push to `main` builds the arm64 image on GitHub's runners, pushes to ECR repo `community-support`, then deploys via **SSM Run Command** (no SSH key anywhere) and checks `/health` inside the host and publicly. GitHub assumes IAM role `bloomaudit-community-github-actions`, which only trusts this repo's `production` environment and can only push to that ECR repo and send commands to that one instance.
- **Getting a shell on the host:** `aws ssm start-session --target i-0504673370238d4af --region ap-southeast-1` (needs the Session Manager plugin), not SSH.

## Git & Committing

- **Claude does not run `git add`, `git commit`, `git push`, `git checkout -b`, or `gh pr create`/`gh pr merge`** without explicit confirmation first. Approval to build code is not approval to commit/push.
- Never include a `Co-Authored-By` line referencing Claude or Anthropic
- Follow conventional commit prefixes: `feat:` · `fix:` · `docs:` · `refactor:` · `test:`
- Never commit `.env`, `node_modules/`, or `dist/`

## Pre-Push Verification

- Run `npm run build` in `frontend/` and confirm zero errors
- Start the backend and confirm `/health` and the community/KB API routes respond correctly before pushing
