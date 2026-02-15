# CLAUDE.md — Package Guide (Delta) for config-vitest

- **Status:** SUPPORTED
- **NAME:** `@repo/config-vitest`
- **Path:** `packages/config-vitest`
- **Root Guide:** See [`../../CLAUDE.md`](../../CLAUDE.md) — this file only adds package-specific deltas.

---

## 1) Purpose & Scope (Package-Specific)

- **What it is:** Shared Vitest configuration presets for the monorepo
- **Used for:**
  - Base test settings: globals, `passWithNoTests`, V8 coverage (text + LCOV)
  - React/DOM test environment via jsdom preset
- **Out of scope:**
  - Project-specific test setup (custom matchers, mocks — consumers add those)
  - E2E testing (Playwright has its own config at monorepo root)
  - Test utilities or helpers (those belong in test files or a separate package)

---

## 2) Public API & Entry Points (Concrete)

- **Entry files (2 configs):**

  - `base.ts` — Foundation config
    - `globals: true` — `describe`, `it`, `expect` available without imports
    - `passWithNoTests: true` — packages without tests don't fail CI
    - `coverage.provider: "v8"` with `["text", "lcov"]` reporters
  - `react.ts` — Extends `base` via `mergeConfig()`
    - `environment: "jsdom"` — DOM simulation for React component tests

- **Export map:**
  - `@repo/config-vitest/base` → `./base.ts`
  - `@repo/config-vitest/react` → `./react.ts`

- **Notes on stability/behavior:**
  - Files are `.ts` — consumed directly by Vitest (no build step)
  - `react.ts` imports `./base.ts` (not `./base.js` — no compiled output)

---

## 3) File Placement & Scaffolding (Deltas Only)

- **Place configs at:** `packages/config-vitest/` (top-level `.ts` files)
- **Pattern:** Each specialized config uses `mergeConfig()` to extend `base`
- **Forbidden:**
  - Do **not** add test utilities or helpers here (config only)
  - Do **not** add a build step (consumers import `.ts` directly)
- **Cross-package imports:**
  - **MAY** be imported by any `vitest.config.ts` in the monorepo
  - **MUST NOT** import from other workspace packages

---

## 4) Usage Rules (Do / Don't) — Package-Specific

- **MUST** keep `passWithNoTests: true` (prevents CI failures for config-only packages)
- **MUST** keep `globals: true` for consistent test API
- **SHOULD** add new universal settings to `base.ts`
- **SHOULD** create a new preset only if there's a genuinely different test environment
- **MUST NOT** add project-specific setup (test files, mocks, fixtures)
- **MUST NOT** add a build step — consumers import `.ts` directly

---

## 5) Dependencies & Integration (Deltas Only)

- **Allowed deps:** `vitest` (current sole dev dependency)
- **Forbidden deps:** Test libraries (testing-library, jest-dom — consumers add those)
- **Peer deps:** None
- **Current consumers:**
  - `apps/server/vitest.config.ts` — uses `base`
  - `packages/platform-logger/vitest.config.ts` — uses `base`
  - `packages/api-schema/vitest.config.ts` — uses `react`

---

## 6) Build, Test, and Lint (Deltas Only)

- **Build:** None (`.ts` files consumed directly)
- **Test:** None (configuration only)
- **Verify:** Run `pnpm test` from monorepo root to test all configs
- **CI rule:** All consumer packages must pass tests

---

## 7) Security, Performance, Accessibility (Deltas Only)

Not applicable — configuration-only package.

---

## 8) Examples (≤25 lines total)

### Consumer: Node.js Package

```ts
// packages/my-lib/vitest.config.ts
import baseConfig from "@repo/config-vitest/base";
export default baseConfig;
```

### Consumer: React Package with Custom Setup

```ts
// packages/my-react-lib/vitest.config.ts
import { mergeConfig, defineConfig } from "vitest/config";
import reactConfig from "@repo/config-vitest/react";

export default mergeConfig(reactConfig, defineConfig({
  test: { setupFiles: ["./test/setup.ts"] },
}));
```

---

## 9) Questions to Ask (Before Changes)

- Does this setting apply to **all** test environments? (If so, add to `base.ts`.)
- Is this **project-specific** (custom matchers, setup files)? (If so, it belongs in the consumer.)
- Do you need a **new preset**? (Only for a fundamentally different test environment, e.g., `edge-runtime`.)

> If any are unclear, **STOP and ASK for clarification**.

---

## 10) PR Checklist (Scoped)

- [ ] `passWithNoTests: true` still in `base.ts`
- [ ] `react.ts` still uses `mergeConfig()` to extend `base`
- [ ] No project-specific setup files or test utilities
- [ ] All consumer packages pass `pnpm test`
- [ ] Changes limited to `packages/config-vitest/`

---

## 11) Quick Enforcement Checks

```bash
# Verify passWithNoTests is enabled
rg "passWithNoTests" packages/config-vitest/base.ts
# Expected: passWithNoTests: true

# Verify react extends base
rg "base" packages/config-vitest/react.ts
# Expected: import from ./base.ts

# Run all tests
pnpm test
```
