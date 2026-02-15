# web

Next.js 16 frontend. React 19, Panda CSS + Park UI, TanStack Query with typed API hooks.

**Why:** Production-ready app shell with end-to-end type safety from the NestJS backend, a design system from `@repo/ui`, and server/client rendering patterns.

## Quick Start

```sh
pnpm dev   # Starts all apps (web on port 3000, server on port 3001)
```

## Structure

```
apps/web/
  app/             # Next.js App Router pages and components
    api.ts         # $apiBrowser singleton (typed API client)
    providers.tsx  # QueryClientProvider
    contacts/      # Example CRUD feature
  external/        # Third-party library initialization (logger, openapi clients)
  panda.config.ts  # Scans app + @repo/ui sources, imports shared preset
```

## Key Patterns

- **Per-component UI imports:** `import { Button } from "@repo/ui/button"` (no barrel)
- **Typed API hooks:** `$apiBrowser.useQuery("get", "/contacts")` — paths and types from OpenAPI spec
- **Server/client split:** Pages are server components; interactive parts use `"use client"`

See [docs/frontend.md](../../docs/frontend.md) for full details.
