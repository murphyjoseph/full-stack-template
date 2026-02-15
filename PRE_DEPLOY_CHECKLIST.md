# Pre-Deploy Checklist

Items tagged `@SETUP` in the codebase need attention before deploying to production. Search for them with `grep -r @SETUP`.

## Server

- **CORS origin** — Update for your production frontend URL (`apps/server/src/main.ts`)
- **Swagger** — Disable or add auth protection in production (`apps/server/src/main.ts`)
- **Rate limiting** — Review throttle settings; no auth is implemented out of the box (`apps/server/src/app.module.ts`)
- **Database** — Switch from SQLite to PostgreSQL/MySQL and update `DATABASE_URL` (`apps/server/prisma/schema.prisma`)

## Frontend

- **Logger** — Add production log handlers (Sentry, Datadog, etc.) (`apps/web/external/logger/index.ts`)

## Design System

- **Brand tokens** — Customize accent color, gray color, and border radius (`packages/ui/preset/index.ts`)

## Not tagged with `@SETUP`

- **Package namespace** — Replace `@repo` with your own org namespace across the monorepo
