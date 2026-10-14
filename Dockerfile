# ── Stage 1: build the frontend ─────────────────────────────────────────────
FROM node:20-alpine AS frontend-builder

# Vite inlines VITE_* vars at build time, so the production value has to be set
# here rather than relying on frontend/.env (which only applies to local `vite
# dev` and holds the localhost default) — otherwise "Back to BloomAudit" links
# bake in http://localhost:5173. Override via a Railway build variable of the
# same name if this ever needs to change.
ARG VITE_WEBSITE_URL=https://app.bloomaudit.com
ENV VITE_WEBSITE_URL=$VITE_WEBSITE_URL

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# ── Stage 2: runtime — Express serves the API + the built frontend ─────────
FROM node:20-alpine AS runtime

ENV NODE_ENV=production
WORKDIR /app

COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev && npm cache clean --force

COPY backend/ ./backend/
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

WORKDIR /app/backend

EXPOSE 5100

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget -qO- http://127.0.0.1:5100/health || exit 1

CMD ["node", "server.js"]
