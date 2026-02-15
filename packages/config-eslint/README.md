# @repo/config-eslint

Shared ESLint configurations for the monorepo. ESLint 9 flat config format.

**Why:** Centralize linting rules so every package and app uses the same standards without duplicating config.

## Configs

| Export | Use for | Example consumer |
|--------|---------|-----------------|
| `./base` | Non-React packages and NestJS | `apps/server`, `packages/api-schema`, `packages/platform-logger` |
| `./next-js` | Next.js apps | `apps/web` |
| `./react-internal` | React libraries (no Next.js) | `packages/ui` |

## Usage

```js
// eslint.config.mjs
import { config } from "@repo/config-eslint/base";
export default config;
```

All configs extend `base` — which includes ESLint recommended, TypeScript ESLint, Prettier compat, and Turbo env var rules.
