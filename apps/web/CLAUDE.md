# CLAUDE.md — App Guide (Delta) for web

- **Status:** SUPPORTED
- **NAME:** `web` (apps/web)
- **Path:** `apps/web`
- **Root Guide:** See [`../../CLAUDE.md`](../../CLAUDE.md) — this file only adds app-specific deltas.

---

## 1) Purpose & Scope (App-Specific)

- **What it is:** Next.js 16 frontend app with React 19, Panda CSS + Park UI design system, and typed API integration via TanStack Query
- **Used for:**
  - Server and client-rendered pages via App Router
  - Consuming the NestJS API with full type safety (OpenAPI → typed hooks)
  - Demonstrating the full-stack template patterns (CRUD, forms, queries, mutations)
- **Out of scope:**
  - API server logic (lives in `apps/server/`)
  - Shared component library (lives in `packages/ui/`)
  - Shared TypeScript types or API client (lives in `packages/api-schema/`)

---

## 2) Public API & Entry Points (Concrete)

- **App entry:** `app/layout.tsx` — root layout, wraps children in `<Providers>`
- **Providers:** `app/providers.tsx` — `"use client"`, `QueryClientProvider` with 60s `staleTime`
- **API singleton:** `app/api.ts` — `$apiBrowser` (typed React Query client for browser-side API calls)
- **Port:** 3000 (via `next dev --port 3000`)
- **API base URL:** `NEXT_PUBLIC_API_URL` env var (default `http://localhost:3001`)

- **Key directories:**
  - `app/` — Next.js App Router pages and components
  - `external/` — Third-party library initialization (see `external/CLAUDE.md`)
    - `external/logger/` — `@repo/platform-logger` instance
    - `external/openapi/` — `client.browser.ts` (React Query + middlewares), `client.server.ts` (server-side fetch)

---

## 3) File Placement & Scaffolding (Deltas Only)

- **Pages:** `app/<route>/page.tsx` — server components by default
- **Client components:** `app/<route>/<component>.tsx` with `"use client"` directive
- **Layouts:** `app/<route>/layout.tsx`
- **External integrations:** `external/<library-name>/` (one dir per library/service)
- **Panda CSS output:** `styled-system/` (generated, gitignored)

- **Patterns:**
  - Pages are server components; interactive parts are extracted to client components
  - `"use client"` only where needed (form state, hooks, event handlers)
  - API calls in client components use `$apiBrowser.useQuery()` / `$apiBrowser.useMutation()`

- **Forbidden:**
  - Do **not** create barrel files
  - Do **not** put shared components here (they go in `packages/ui/`)
  - Do **not** put shared types or API client logic here (goes in `packages/api-schema/`)
  - Do **not** import server-only modules in client components

---

## 4) Usage Rules (Do / Don't) — App-Specific

### Components & Styling
- **MUST** import UI components per-module: `import { Button } from "@repo/ui/button"`
- **MUST** prefer Park UI components (`Heading`, `Text`, `Button`, `Card.*`, `Field.*`) over raw `css()` calls
- **MUST** use layout components (`Container`, `Stack`, `Flex`) from `@repo/ui/jsx`
- **SHOULD** reserve `css()` from `@repo/ui/css` for one-off styles only

### Data Fetching
- **MUST** use `$apiBrowser` from `app/api.ts` for all browser-side API calls
- **MUST** use typed hooks: `$apiBrowser.useQuery("get", "/path")`, `$apiBrowser.useMutation("post", "/path")`
- **MUST** invalidate queries after mutations: `queryClient.invalidateQueries({ queryKey: ["get", "/path"] })`
- **SHOULD** use `useActionState` for form handling (React 19 pattern)

### Server/Client Boundary
- **MUST** keep pages as server components unless they need interactivity
- **MUST** add `"use client"` only to components that use hooks, state, or event handlers
- **MUST NOT** import `$apiBrowser` in server components (it uses React Query)

### External Directory
- **MUST** follow `external/CLAUDE.md` conventions for third-party integrations
- **MUST** centralize auth, middleware, and error handling in `external/openapi/`
- **MUST NOT** put business logic or UI in `external/`

---

## 5) Dependencies & Integration (Deltas Only)

- **Runtime deps:**
  - `next@16`, `react@19`, `react-dom@19` — framework
  - `@tanstack/react-query` — server state management
  - `openapi-react-query` — typed hooks over OpenAPI
  - `openapi-fetch` — typed fetch client
  - `@repo/ui` — design system components
  - `@repo/api-schema` — typed API client + types
  - `@repo/platform-logger` — structured logging
- **Dev deps:**
  - `@pandacss/dev` — CSS generation
  - `@repo/config-eslint`, `@repo/config-typescript`
- **Forbidden deps:**
  - Server-only packages (Prisma, NestJS) in client code
  - Alternative CSS-in-JS libraries (use Panda CSS)
  - Alternative component libraries (use Park UI via `@repo/ui`)
- **Integration:**
  - `next.config.js` uses `transpilePackages: ["@repo/ui", "@repo/api-schema"]`
  - `panda.config.ts` scans both `app/` and `packages/ui/src/` sources
  - `panda.config.ts` imports `uiPreset` from `packages/ui/preset/`

---

## 6) Build, Test, and Lint (Deltas Only)

- **Dev:** `pnpm --filter web dev` — `next dev --port 3000`
- **Build:** `pnpm --filter web build` — `next build`
- **Start:** `pnpm --filter web start` — `next start`
- **Lint:** `pnpm --filter web lint` — ESLint with `@repo/config-eslint/next-js`
- **Typecheck:** `pnpm --filter web check-types`
- **E2E:** `pnpm test:e2e` (Playwright, configured at monorepo root)
- **CI rule:** Build, lint, and typecheck must pass

---

## 7) Security, Performance, Accessibility (Deltas Only)

- **Security:**
  - API base URL via `NEXT_PUBLIC_API_URL` (public env var, safe for browser)
  - Auth middleware scaffolded in `external/openapi/client.browser.ts` (not yet active)
  - No secrets in client-side code
- **Performance:**
  - Server components by default (minimal client JS)
  - TanStack Query with 60s `staleTime` for caching
  - Panda CSS extracts styles at build time (no runtime CSS-in-JS)
  - `transpilePackages` avoids double-bundling workspace packages
- **A11y:**
  - Park UI components (via Ark UI) are WAI-ARIA compliant
  - Use semantic elements (`Heading`, `Text`, `Link`) over generic divs

---

## 8) Examples (≤25 lines total)

### Server Component Page

```tsx
// app/example/page.tsx
import { Container, Stack } from "@repo/ui/jsx";
import { Heading, Text } from "@repo/ui/heading";

export default function ExamplePage() {
  return (
    <Container py="12"><Stack gap="4">
      <Heading as="h1">Example</Heading>
      <Text>Server-rendered content.</Text>
    </Stack></Container>
  );
}
```

### Client Component with API Hook

```tsx
"use client";
import { $apiBrowser } from "@/api";

export function ContactList() {
  const { data, isLoading } = $apiBrowser.useQuery("get", "/contacts");
  if (isLoading) return <Spinner />;
  return data?.map((c) => <div key={c.id}>{c.name}</div>);
}
```

---

## 9) Questions to Ask (Before Changes)

- Is this component **server or client**? (Default to server; add `"use client"` only if needed.)
- Does this belong in **`@repo/ui`** or the app? (Reusable → `packages/ui/`, app-specific → here.)
- Are you importing `$apiBrowser` in a **server component**? (Don't — use server-side fetch or `client.server.ts`.)
- Did you **invalidate queries** after a mutation?
- Does the styling use **Park UI components** or raw `css()`? (Prefer Park UI.)

> If any are unclear, **STOP and ASK for clarification**.

---

## 10) PR Checklist (Scoped)

- [ ] Per-component UI imports (`@repo/ui/button`, not `@repo/ui`)
- [ ] `"use client"` only where necessary
- [ ] API calls use typed `$apiBrowser` hooks
- [ ] Queries invalidated after mutations
- [ ] Park UI components preferred over raw `css()`
- [ ] No server-only imports in client components
- [ ] No shared logic that belongs in `packages/`
- [ ] Build passes (`pnpm --filter web build`)

---

## 11) Quick Enforcement Checks

```bash
# Barrel imports from @repo/ui (should be empty — use per-component)
rg "from ['\"]@repo/ui['\"]" apps/web/ || echo "OK: No barrel imports"

# Console.log usage (should use logger)
rg "console\.(log|info|warn|error)" apps/web/app/ || echo "OK: No console.log"

# Server-only imports in client components
rg -l "use client" apps/web/app/ | xargs rg "from ['\"]@prisma|from ['\"]@nestjs" || echo "OK: No server imports in client"

# Build check
pnpm --filter web build
```
