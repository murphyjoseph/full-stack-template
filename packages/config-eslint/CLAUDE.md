# CLAUDE.md — Package Guide (Delta) for config-eslint

- **Status:** SUPPORTED
- **NAME:** `@repo/config-eslint`
- **Path:** `packages/config-eslint`
- **Root Guide:** See [`../../CLAUDE.md`](../../CLAUDE.md) — this file only adds package-specific deltas.

---

## 1) Purpose & Scope (Package-Specific)

- **What it is:** Shared ESLint configurations for the monorepo using ESLint 9 flat config format
- **Used for:**
  - Base linting rules for all packages (TypeScript, Prettier compat, Turbo env vars)
  - Next.js-specific rules (React, core-web-vitals, Next.js plugin)
  - React library rules (React + React Hooks, no Next.js)
- **Out of scope:**
  - Project-specific rule overrides (consumers add those in their own `eslint.config.mjs`)
  - Custom ESLint plugins or rules
  - Prettier configuration (separate concern)

---

## 2) Public API & Entry Points (Concrete)

- **Entry files (3 configs):**
  - `base.js` — Foundation config: ESLint recommended + TypeScript ESLint + Prettier + Turbo + `only-warn` plugin. Ignores `dist/`.
  - `next.js` — Extends `base`. Adds: React, React Hooks, Next.js plugin (recommended + core-web-vitals). Ignores `.next/`, `out/`, `build/`.
  - `react-internal.js` — Extends `base`. Adds: React, React Hooks. For non-Next.js React packages.

- **Export map:**
  - `@repo/config-eslint/base` → `./base.js`
  - `@repo/config-eslint/next-js` → `./next.js`
  - `@repo/config-eslint/react-internal` → `./react-internal.js`

- **Notes on stability/behavior:**
  - All exports return arrays (ESLint 9 flat config format)
  - `only-warn` plugin converts all errors to warnings (prevents blocking during dev)
  - `react/react-in-jsx-scope` is disabled (not needed with modern JSX transform)

---

## 3) File Placement & Scaffolding (Deltas Only)

- **Place configs at:** `packages/config-eslint/` (top-level `.js` files)
- **Pattern:** Each config file exports a flat array of ESLint config objects
- **Forbidden:**
  - Do **not** use `.eslintrc` format (ESLint 9 flat config only)
  - Do **not** add project-specific rules here (consumers override in their own config)
- **Cross-package imports:**
  - **MAY** be imported by any package/app in the monorepo
  - **MUST NOT** import from other workspace packages

---

## 4) Usage Rules (Do / Don't) — Package-Specific

- **MUST** keep configs composable (consumers spread and extend)
- **MUST** use ESLint 9 flat config format (arrays, not objects)
- **MUST** keep `only-warn` plugin active (no hard errors during dev)
- **SHOULD** add new rules to `base.js` if they apply universally
- **SHOULD** add React-specific rules to both `next.js` and `react-internal.js`
- **MUST NOT** add project-specific overrides or file ignores
- **MUST NOT** add rules that conflict with Prettier (`eslint-config-prettier` handles this)

---

## 5) Dependencies & Integration (Deltas Only)

- **Current deps (devDependencies):**
  - `@eslint/js` — ESLint recommended rules
  - `typescript-eslint` — TypeScript support
  - `eslint-config-prettier` — Prettier conflict resolution
  - `eslint-plugin-only-warn` — Convert errors to warnings
  - `eslint-plugin-turbo` — Turborepo env var rules
  - `eslint-plugin-react`, `eslint-plugin-react-hooks` — React rules
  - `@next/eslint-plugin-next` — Next.js rules
  - `globals` — Browser/Node.js/service-worker globals
- **Forbidden deps:** None specific, but avoid unnecessary plugins
- **Peer deps:** None (all deps bundled)
- **Current consumers:**
  - `apps/web/eslint.config.js` — uses `next-js`
  - `apps/server/eslint.config.mjs` — uses `base`
  - `packages/ui/eslint.config.mjs` — uses `react-internal` (+ ignores `styled-system/`)
  - `packages/api-schema/eslint.config.mjs` — uses `base`
  - `packages/platform-logger/eslint.config.mjs` — uses `base`

---

## 6) Build, Test, and Lint (Deltas Only)

- **Build:** None (plain `.js` files, no compilation)
- **Test:** None (configuration only)
- **Verify:** Run `pnpm lint` from monorepo root to test all configs
- **CI rule:** All consumer packages must pass lint

---

## 7) Security, Performance, Accessibility (Deltas Only)

- **Security:** `turbo/no-undeclared-env-vars` warns about undeclared environment variables
- **Performance:** Not applicable (dev tooling only)
- **A11y:** Not applicable

---

## 8) Examples (≤25 lines total)

### Consumer: Basic Package

```js
// packages/my-lib/eslint.config.mjs
import { config } from "@repo/config-eslint/base";
export default config;
```

### Consumer: React Package with Custom Ignores

```js
// packages/ui/eslint.config.mjs
import { config } from "@repo/config-eslint/react-internal";
export default [...config, { ignores: ["styled-system/"] }];
```

---

## 9) Questions to Ask (Before Changes)

- Does this rule apply to **all** projects or just one? (If one, add it in the consumer's config.)
- Does this rule **conflict with Prettier**? (If so, `eslint-config-prettier` should handle it.)
- Are you adding a new **plugin**? (Justify the added dev dependency weight.)
- Is this **ESLint 9 flat config** format? (No `.eslintrc` or legacy format.)

> If any are unclear, **STOP and ASK for clarification**.

---

## 10) PR Checklist (Scoped)

- [ ] Uses ESLint 9 flat config format (arrays, not objects)
- [ ] New rules added to appropriate config level (base vs next vs react-internal)
- [ ] No project-specific overrides
- [ ] No conflicts with Prettier
- [ ] All consumer packages still pass `pnpm lint`
- [ ] Changes limited to `packages/config-eslint/`

---

## 11) Quick Enforcement Checks

```bash
# Verify all consumers pass lint
pnpm lint

# Check for legacy config format (should be empty)
rg -n "module\.exports" packages/config-eslint/ || echo "OK: No CJS exports"

# List all plugins
rg -n "plugin" packages/config-eslint/*.js --no-heading
```
