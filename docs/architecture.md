# Architecture

Full-stack monorepo using Turborepo + pnpm workspaces. NestJS backend, Next.js frontend, Park UI component library, and fully typed API communication via OpenAPI.

## Repository Structure

```
apps/
  web/                     Next.js 16 (port 3000)
  server/                  NestJS 11 (port 3001)
packages/
  ui/                      Park UI components + Panda CSS codegen + shared preset (@repo/ui)
  api-schema/              OpenAPI spec + generated types + typed fetch client
  platform-logger/         Shared structured logger (handler-based, zero deps)
  config-typescript/       Shared tsconfig bases
  config-eslint/           Shared ESLint flat configs
  config-vitest/           Shared Vitest configs
e2e/                       Playwright tests
```

## Build Dependency Graph

```
config-typescript, config-eslint, config-vitest    (no build step)
  │
  ├── platform-logger          tsup → dist/
  ├── ui                       panda codegen → styled-system/ (components are source, no build)
  │
  ├── server                   prisma generate + nest build → dist/
  │     │
  │     └── (generates openapi.json → api-schema/)
  │
  ├── api-schema               source-compiled (no build step)
  │
  └── web                      next build → .next/
        (depends on ui, api-schema)
```

Turborepo orchestrates the build order via `^build` (build dependencies first). Type generation (`generate:types`) is a separate manual command — not part of the automatic build graph — because it requires booting the NestJS app to extract the Swagger spec.

## Data Flow

```
Prisma schema (Contact model)
  → NestJS service (Prisma queries)
  → NestJS controller (REST endpoints + Swagger decorators)
  → generate-openapi.ts (boots NestJS headlessly, writes JSON)
  → openapi.json (committed to git in api-schema/)
  → openapi-typescript (generates schema.d.ts)
  → openapi-fetch (typed fetch client)
  → openapi-react-query (TanStack Query hooks)
  → React components (useQuery / useMutation)
```

See [api-types.md](./api-types.md) for details on the type generation pipeline.

## Key Design Decisions

### NestJS uses CommonJS

NestJS works best with CJS as of v11. The server's tsconfig sets `module: "commonjs"` and its `package.json` has no `"type": "module"`. Everything else in the monorepo is ESM. This is intentional — NestJS ESM support exists but isn't the default and many ecosystem packages still assume CJS.

### @repo/ui component files are source-compiled

Park UI components are designed for source-level consumption. Pre-compiling them with tsup or tsc causes cascading type errors (TS7056 type serialization limits, ConditionalValue vs HTML attribute conflicts). Instead, `packages/ui` exports raw `.tsx` component source files and Next.js compiles them via `transpilePackages: ["@repo/ui"]` in `next.config.js`. The Panda CSS codegen output (`styled-system/`) is pre-built and exported as `.mjs`.

See [panda-css.md](./panda-css.md) for the full Panda CSS integration story.

### openapi.json is committed to git

The generated `openapi.json` is committed so that `api-schema` types can be generated independently — in CI, other developer machines, or any context where the NestJS server isn't running. When the API changes, run `pnpm generate:types` to regenerate it.

### Packages don't reference environment variables

Per project convention (`packages/CLAUDE.md`), library packages under `packages/` don't read `process.env` directly. The consuming app owns configuration. For example, `api-schema` exports `createApiClient(baseUrl)` — the web app creates the singleton in `app/api.ts` with the base URL from its own env var.

## Environment Variables

| Variable | Location | Purpose |
|---|---|---|
| `DATABASE_URL` | `apps/server/.env` | Prisma database connection string |
| `NEXT_PUBLIC_API_URL` | `apps/web/.env.local` | Backend URL for API client |
| `CORS_ORIGIN` | `apps/server/.env` | Allowed CORS origin (default: `http://localhost:3000`) |
| `PORT` | `apps/server/.env` | Server listen port (default: `3001`) |

## Testing

- **Unit tests**: Vitest with shared config from `packages/config-vitest/`. Run via `pnpm test`.
- **E2E tests**: Playwright at `e2e/`. Config at root `playwright.config.ts` auto-starts both dev servers. Run via `pnpm test:e2e`.

The Playwright `beforeEach` hook cleans all contacts via the API before each test to ensure idempotent runs.
