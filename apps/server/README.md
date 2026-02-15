# server

NestJS 11 REST API backend. Prisma ORM with SQLite. Swagger UI at `/api`.

**Why:** Typed API layer that auto-generates the OpenAPI spec consumed by the frontend for end-to-end type safety.

## Quick Start

```sh
pnpm --filter server prisma:migrate   # Create/update SQLite DB
pnpm --filter server dev              # Start on port 3001 (watch mode)
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/contacts` | List all contacts |
| `POST` | `/contacts` | Create a contact |
| `GET` | `/contacts/:id` | Get one contact |
| `DELETE` | `/contacts/:id` | Delete a contact |

Swagger UI: `http://localhost:3001/api` | JSON: `http://localhost:3001/api-json`

## Key Commands

```sh
pnpm --filter server build            # Prisma generate + nest build
pnpm --filter server test             # Vitest
pnpm --filter server generate:openapi # Regenerate OpenAPI spec → packages/api-schema/
```

See [docs/backend.md](../../docs/backend.md) for architecture details.
