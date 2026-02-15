# @repo/config-typescript

Shared TypeScript `tsconfig.json` presets for the monorepo. Zero dependencies — pure JSON.

**Why:** Consistent compiler settings across all packages and apps. One place to update `target`, `strict` mode, or module resolution.

## Configs

| File | Use for | Key settings |
|------|---------|--------------|
| `base.json` | All packages | `strict`, `es2024`, `NodeNext`, `noUncheckedIndexedAccess` |
| `nextjs.json` | Next.js apps | `ESNext` modules, `Bundler` resolution, `jsx: preserve`, `noEmit` |
| `nestjs.json` | NestJS backends | `commonjs`, `node` resolution, `emitDecoratorMetadata` |
| `react-library.json` | React component libraries | `jsx: react-jsx` |

## Usage

```jsonc
// tsconfig.json
{
  "extends": "@repo/config-typescript/base"
}
```

All specialized configs extend `base.json` and override only what's needed.
