# Full-Stack Template

Monorepo template with **NestJS** (backend), **Next.js** (frontend), and **Park UI** (component library). Includes a working contact form as a reference implementation demonstrating the full data flow.

## Stack

- **Frontend**: Next.js 16, React 19, Panda CSS, Park UI (Ark UI), TanStack Query
- **Backend**: NestJS 11, Prisma, Swagger/OpenAPI
- **API types**: openapi-typescript + openapi-fetch + openapi-react-query (fully typed from Swagger spec)
- **Database**: SQLite (default) — switch to PostgreSQL by changing `provider` in `schema.prisma` and `DATABASE_URL` in `.env`
- **Testing**: Vitest (unit), Playwright (E2E)
- **Monorepo**: Turborepo, pnpm workspaces

## Structure

```
apps/
  web/              Next.js frontend (port 3000)
  server/           NestJS backend (port 3001)
packages/
  ui/               Park UI components + Panda CSS codegen + shared preset (@repo/ui)
  api-schema/       OpenAPI spec + generated types + typed fetch client
  platform-logger/  Shared logger
  config-typescript/ Shared tsconfig bases
  config-eslint/    Shared ESLint configs
  config-vitest/    Shared Vitest configs
e2e/                Playwright tests
```

## Setup

```sh
pnpm install
pnpm --filter server prisma:migrate   # Create SQLite database
pnpm generate:types                    # Generate OpenAPI types
pnpm build                             # Build all packages
```

## Development

```sh
pnpm dev
```

Starts both servers:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **Swagger UI**: http://localhost:3001/api

## Testing

```sh
pnpm test          # Unit tests (Vitest)
pnpm test:e2e      # E2E tests (Playwright)
```

## API Type Generation

When the backend API changes:

```sh
pnpm generate:types
```

This runs the NestJS app headlessly to extract the Swagger spec, then generates TypeScript types from it. The generated `openapi.json` is committed to git so `api-schema` types can be generated independently.

## Data Flow

```
Prisma schema
  -> NestJS controllers + DTOs (with Swagger decorators)
  -> openapi.json (generated)
  -> openapi-typescript schema.d.ts (generated)
  -> openapi-fetch client (typed requests)
  -> openapi-react-query hooks (TanStack Query integration)
  -> React components (useActionState + useMutation)
```

## Database

Default: SQLite at `apps/server/prisma/dev.db`.

To switch to PostgreSQL:
1. Change `provider = "sqlite"` to `provider = "postgresql"` in `apps/server/prisma/schema.prisma`
2. Update `DATABASE_URL` in `apps/server/.env`
3. Run `pnpm --filter server prisma:migrate`

## Documentation

- [Architecture](docs/architecture.md) — repo structure, build graph, design decisions
- [Backend](docs/backend.md) — NestJS, Prisma, Swagger, adding new resources
- [Frontend](docs/frontend.md) — Next.js, TanStack Query, data fetching patterns
- [API Types](docs/api-types.md) — end-to-end type generation pipeline
- [Panda CSS](docs/panda-css.md) — styling architecture, createStyleContext, adding components
