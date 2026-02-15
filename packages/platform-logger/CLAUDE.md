# CLAUDE.md — Package Guide (Delta) for platform-logger

- **Status:** SUPPORTED
- **NAME:** `@repo/platform-logger`
- **Path:** `packages/platform-logger`
- **Root Guide:** See [`../../CLAUDE.md`](../../CLAUDE.md) — this file only adds package-specific deltas.

---

## 1) Purpose & Scope (Package-Specific)

- **What it is:** Minimal, zero-dependency logging abstraction with handler-based dispatch, level filtering, and error normalization
- **Used for:**
  - Structured logging across the monorepo (NestJS, Next.js, shared packages)
  - Decoupling log call sites from log destinations (console, files, external services)
  - Normalizing `unknown` caught values into proper `Error` objects
  - Level-based filtering (debug/info/warn/error/fatal)
- **Out of scope:**
  - Log transport implementations beyond console (Sentry, Datadog, etc. — consumers add handlers)
  - Log formatting or serialization (handlers own their format)
  - Log persistence or rotation
  - Framework-specific integrations (NestJS LoggerService adapter, etc.)

---

## 2) Public API & Entry Points (Concrete)

- **Entry file:** `src/index.ts` (single module)

- **Primary exports (stable):**
  - `createLogger(level?: LogLevel): Logger` — Factory returning a logger with level filtering and handler dispatch
  - `createConsoleHandler(): LogHandler` — Built-in handler that writes to `console.*` with `[LEVEL]` prefixes
  - `toError(value: unknown): Error` — Normalizes any value to an `Error` (strings, objects, circular refs)

- **Types:**
  - `LogLevel` — `"debug" | "info" | "warn" | "error" | "fatal"`
  - `LogMetadata` — `Record<string, unknown>`
  - `Logger` — `{ debug, info, warn, error, fatal, addHandler }`
  - `LogHandler` — `{ debug, info, warn, error, fatal }` (implement to create custom handlers)

- **Notes on stability/behavior:**
  - `Logger.error()` and `Logger.fatal()` accept `unknown` and normalize via `toError()` before dispatching
  - Handler errors are silently caught — a broken handler never takes down other handlers
  - Logger methods are closures, not class methods — destructuring is safe (`const { info } = logger`)
  - Default level is `"info"` when none specified

---

## 3) File Placement & Scaffolding (Deltas Only)

- **Place code under:** `packages/platform-logger/src/`
- **Tests:** `src/index.test.ts` (colocated)
- **Forbidden:**
  - Do **not** add framework dependencies (NestJS, React, etc.)
  - Do **not** add third-party logging libraries (Winston, Pino, Bunyan)
  - Do **not** add side effects at module import time
  - Do **not** reference environment variables (per `packages/CLAUDE.md`)
- **Cross-package imports:**
  - **MAY** be imported by any package/app in the monorepo
  - **MUST NOT** import from other packages (keep as pure foundation)

---

## 4) Usage Rules (Do / Don't) — Package-Specific

- **MUST** keep all code pure, zero-dependency, and framework-agnostic
- **MUST** ensure handler errors never propagate (catch and swallow)
- **MUST** normalize `unknown` errors to `Error` instances before dispatching
- **MUST** support destructured usage (no `this` binding)
- **SHOULD** keep the module small (~100 lines or less)
- **SHOULD** write tests for any new functionality
- **MAY** add new built-in handlers if they remain zero-dependency
- **MUST NOT** add framework-specific code (NestJS, React)
- **MUST NOT** add external dependencies
- **MUST NOT** introduce state or side effects beyond handler registration
- **MUST NOT** reference environment variables directly

---

## 5) Dependencies & Integration (Deltas Only)

- **Allowed deps:** None. This package must remain zero-dependency.
- **Forbidden deps:** All. Any logging library, framework, or utility.
- **Peer deps:** None
- **Env assumption:** Universal (browser + Node.js + edge)
- **Integration notes:**
  - Lowest-level utility package alongside `config-*` packages
  - Consumers create framework-specific adapters outside this package
  - Adding any dependency requires justification and discussion
- **Current consumers:**
  - `apps/web/external/logger/index.ts` — web app logger instance (console handler, scaffold for Sentry/Datadog)
  - `apps/web/external/openapi/client.browser.ts` — API error middleware
  - `apps/web/external/openapi/client.server.ts` — API error middleware (server-side)
  - `apps/server/src/logger/logger.service.ts` — server logger instance + NestJS `LoggerService` adapter (`PlatformLoggerService`)
  - `apps/server/src/contacts/contacts.controller.ts` — contact CRUD logging

---

## 6) Build, Test, and Lint (Deltas Only)

- **Build:** `pnpm --filter @repo/platform-logger build` (tsup, ESM output to `dist/`)
- **Test:** `pnpm --filter @repo/platform-logger test`
- **Typecheck:** `pnpm --filter @repo/platform-logger check-types`
- **Lint:** `pnpm --filter @repo/platform-logger lint`
- **CI rule:** All above must pass

---

## 7) Security, Performance, Accessibility (Deltas Only)

- **Security:**
  - `toError()` safely handles circular references (no stack overflow)
  - No eval or dynamic code execution
  - Handler errors are isolated (defense in depth)
- **Performance:**
  - Level check short-circuits before iterating handlers
  - No allocations for filtered-out messages
  - Pure functions enable tree-shaking
- **A11y:** Not applicable (utility library only)

---

## 8) Examples (≤25 lines total)

### Basic Usage

```ts
import { createLogger, createConsoleHandler } from "@repo/platform-logger";

const logger = createLogger("info");
logger.addHandler(createConsoleHandler());

logger.info("server started", { port: 3001 });
logger.error(caughtUnknown, { requestId: "abc-123" });
```

### Custom Handler

```ts
import type { LogHandler } from "@repo/platform-logger";

const jsonHandler: LogHandler = {
  debug: (msg, meta) => process.stdout.write(JSON.stringify({ level: "debug", msg, ...meta }) + "\n"),
  info:  (msg, meta) => process.stdout.write(JSON.stringify({ level: "info", msg, ...meta }) + "\n"),
  warn:  (msg, meta) => process.stdout.write(JSON.stringify({ level: "warn", msg, ...meta }) + "\n"),
  error: (err, meta) => process.stdout.write(JSON.stringify({ level: "error", msg: err.message, ...meta }) + "\n"),
  fatal: (err, meta) => process.stdout.write(JSON.stringify({ level: "fatal", msg: err.message, ...meta }) + "\n"),
};
```

---

## 9) Questions to Ask (Before Changes)

- Does this change keep the package **zero-dependency**?
- Is the new functionality **framework-agnostic** (works in browser, Node.js, edge)?
- Does this belong in the **logger package** or in a **consumer-side adapter**?
- Are **handler errors** still isolated after this change?
- Does `toError()` still handle **all `unknown` input** safely?

> If any are unclear, **STOP and ASK for clarification**.

---

## 10) PR Checklist (Scoped)

- [ ] Zero external dependencies (check `package.json`)
- [ ] All exports are pure functions or types (no side effects)
- [ ] Handler errors are caught and swallowed (never propagate)
- [ ] `unknown` error inputs are normalized via `toError()`
- [ ] Tests added/updated in `src/index.test.ts`
- [ ] No framework dependencies (NestJS, React, etc.)
- [ ] No environment variable references
- [ ] Destructured usage still works (no `this` binding)
- [ ] Changes limited to `packages/platform-logger/`

---

## 11) Quick Enforcement Checks

```bash
# Framework imports (should be empty)
rg -n "from ['\"]react|from ['\"]next|from ['\"]@nestjs" packages/platform-logger/src || echo "OK: No framework imports"

# External dependencies (should have none)
jq -r '.dependencies // {} | keys[]' packages/platform-logger/package.json | head -5 || echo "OK: No dependencies"

# Environment variable usage (should be empty)
rg -n "process\.env" packages/platform-logger/src || echo "OK: No env vars"

# Public surface diff
git diff HEAD~1 -- packages/platform-logger/src/index.ts
```
