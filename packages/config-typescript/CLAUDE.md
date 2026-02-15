# CLAUDE.md — Package Guide (Delta) for config-typescript

- **Status:** SUPPORTED
- **NAME:** `@repo/config-typescript`
- **Path:** `packages/config-typescript`
- **Root Guide:** See [`../../CLAUDE.md`](../../CLAUDE.md) — this file only adds package-specific deltas.

---

## 1) Purpose & Scope (Package-Specific)

- **What it is:** Shared TypeScript `tsconfig.json` presets for the monorepo — pure JSON, zero dependencies
- **Used for:**
  - Consistent compiler settings across all packages and apps
  - Preset configs for different project types (Next.js, NestJS, React libraries, base utilities)
- **Out of scope:**
  - Project-specific `include`/`exclude` patterns (consumers add those)
  - Path aliases (consumers define in their own `tsconfig.json`)
  - Build tooling or compilation (separate concern)

---

## 2) Public API & Entry Points (Concrete)

- **Entry files (4 JSON configs, referenced via `extends`):**

  - `base.json` — Foundation for all projects
    - `target: "es2024"`, `module: "NodeNext"`, `strict: true`
    - `noUncheckedIndexedAccess: true`, `skipLibCheck: true`
    - `declaration: true`, `declarationMap: true`
  - `nextjs.json` — Extends `base`. Next.js apps
    - `module: "ESNext"`, `moduleResolution: "Bundler"`, `jsx: "preserve"`, `noEmit: true`
    - Includes Next.js compiler plugin
  - `nestjs.json` — Extends `base`. NestJS backends
    - `module: "commonjs"`, `moduleResolution: "node"`
    - `emitDecoratorMetadata: true`, `experimentalDecorators: true`
    - `outDir: "dist"`, `sourceMap: true`
  - `react-library.json` — Extends `base`. React component libraries
    - `jsx: "react-jsx"`

- **No `package.json` exports field** — consumers reference configs directly:
  ```jsonc
  { "extends": "@repo/config-typescript/nestjs" }
  ```

---

## 3) File Placement & Scaffolding (Deltas Only)

- **Place configs at:** `packages/config-typescript/` (top-level `.json` files)
- **Pattern:** Each specialized config extends `base.json` and overrides only what's needed
- **Forbidden:**
  - Do **not** add TypeScript source files (this is config-only)
  - Do **not** add project-specific `include`/`exclude` paths
  - Do **not** add path aliases
- **Cross-package imports:**
  - **MAY** be referenced by any `tsconfig.json` in the monorepo
  - **MUST NOT** import from other workspace packages

---

## 4) Usage Rules (Do / Don't) — Package-Specific

- **MUST** keep `strict: true` in base (never weaken strict mode)
- **MUST** keep configs minimal — only override what the project type requires
- **SHOULD** add new compiler options to `base.json` if they apply universally
- **SHOULD** create a new preset only if there's a genuinely different project type
- **MUST NOT** add `include`/`exclude` patterns (consumers own their file scope)
- **MUST NOT** add `paths` aliases (consumers own their import maps)
- **MUST NOT** weaken type safety in specialized configs unless required by the framework

---

## 5) Dependencies & Integration (Deltas Only)

- **Allowed deps:** None. Pure JSON configuration files.
- **Forbidden deps:** All. No build tools, no plugins, no TypeScript runtime.
- **Current consumers:**
  - `apps/web/tsconfig.json` — extends `nextjs.json`
  - `apps/server/tsconfig.json` — extends `nestjs.json`
  - `packages/ui/tsconfig.json` — extends `react-library.json`
  - `packages/api-schema/tsconfig.json` — extends `base.json`
  - `packages/platform-logger/tsconfig.json` — extends `base.json`

---

## 6) Build, Test, and Lint (Deltas Only)

- **Build:** None (pure JSON)
- **Test:** None (configuration only)
- **Verify:** Run `pnpm check-types` from monorepo root to test all configs
- **CI rule:** All consumer packages must pass type-checking

---

## 7) Security, Performance, Accessibility (Deltas Only)

Not applicable — configuration-only package.

---

## 8) Examples (≤25 lines total)

### Consumer: Utility Package

```jsonc
// packages/my-lib/tsconfig.json
{
  "extends": "@repo/config-typescript/base",
  "compilerOptions": { "outDir": "dist" },
  "include": ["src"]
}
```

### Consumer: Next.js App

```jsonc
// apps/web/tsconfig.json
{
  "extends": "@repo/config-typescript/nextjs",
  "compilerOptions": { "paths": { "@/*": ["./app/*"] } },
  "include": ["app", "next-env.d.ts"]
}
```

---

## 9) Questions to Ask (Before Changes)

- Does this compiler option apply to **all** project types? (If so, add to `base.json`.)
- Does this **weaken type safety** (e.g., disabling strict checks)? (If so, don't.)
- Is this a **project-specific** setting (paths, include/exclude)? (If so, it belongs in the consumer.)
- Do you need a **new preset**? (Only if there's a fundamentally different project type.)

> If any are unclear, **STOP and ASK for clarification**.

---

## 10) PR Checklist (Scoped)

- [ ] `strict: true` still enabled in `base.json`
- [ ] Specialized configs only override what's necessary
- [ ] No `include`/`exclude`/`paths` in shared configs
- [ ] All consumer packages pass `pnpm check-types`
- [ ] Changes limited to `packages/config-typescript/`

---

## 11) Quick Enforcement Checks

```bash
# Verify strict mode is on
jq '.compilerOptions.strict' packages/config-typescript/base.json
# Expected: true

# Verify all consumers pass type-check
pnpm check-types

# Check inheritance chain
jq '.extends' packages/config-typescript/nextjs.json packages/config-typescript/nestjs.json packages/config-typescript/react-library.json
# All should extend ./base.json
```
