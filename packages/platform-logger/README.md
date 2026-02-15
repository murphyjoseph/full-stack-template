# @repo/platform-logger

Minimal, handler-based logging abstraction for the monorepo. Zero dependencies.

**Why:** Decouple log production from log consumption. App code logs through a unified interface; handlers decide where output goes (console, file, external service). Swap destinations without touching call sites.

## Usage

```ts
import { createLogger, createConsoleHandler } from "@repo/platform-logger";

const logger = createLogger("info"); // "debug" | "info" | "warn" | "error" | "fatal"
logger.addHandler(createConsoleHandler());

logger.info("server started", { port: 3001 });
logger.error(unknownCaughtValue); // accepts unknown, normalizes to Error
```

## Key Properties

- **Handler isolation** — a throwing handler won't break other handlers
- **Error normalization** — `error()`/`fatal()` accept `unknown`, always deliver `Error` to handlers
- **Level filtering** — messages below threshold are dropped before reaching handlers
- **No `this` binding** — safe to destructure (`const { info, error } = logger`)
- **Zero dependencies** — pure TypeScript, ~90 lines
