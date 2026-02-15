# @repo/config-vitest

Shared Vitest configurations for the monorepo. Two composable presets.

**Why:** Consistent test settings (globals, coverage, passWithNoTests) without duplicating config in every package.

## Configs

| Export | Use for | Key settings |
|--------|---------|-------------|
| `./base` | Non-DOM packages (utilities, backend) | `globals: true`, `passWithNoTests: true`, V8 coverage |
| `./react` | React/DOM packages | Extends `base` + `environment: "jsdom"` |

## Usage

```ts
// vitest.config.ts
import baseConfig from "@repo/config-vitest/base";
export default baseConfig;
```

`passWithNoTests: true` means packages without test files won't fail CI.
