# Panda CSS + Park UI Integration

The UI layer uses [Park UI](https://park-ui.com) components built on [Ark UI](https://ark-ui.com) (headless) and [Panda CSS](https://panda-css.com) (styling). Everything lives in `packages/ui/` (`@repo/ui`).

## Package Structure

### `packages/ui/` — Unified UI Package (`@repo/ui`)

**What it contains**:
- `styled-system/` — Generated Panda CSS output (`panda codegen`)
- `src/components/` — 62 Park UI component source files
- `preset/` — Shared Panda preset (Park UI config + custom recipes)
- `recipes/` — 8 custom recipes not in the Park UI preset
- `lib/` — `createStyleContext` (injected into styled-system/jsx by codegen hook)

**Exports** (per-component, no barrel file):
- `@repo/ui/css` — `css()`, `cva()`, `cx()`, `sva()`
- `@repo/ui/tokens` — design tokens
- `@repo/ui/recipes` — component recipes (button, card, etc.)
- `@repo/ui/jsx` — `styled()` factory, layout components (Box, Flex, Stack), and `createStyleContext`
- `@repo/ui/types` — TypeScript types for style props
- `@repo/ui/patterns` — pattern functions
- `@repo/ui/preset` — shared Panda preset for the web app
- `@repo/ui/button`, `@repo/ui/dialog`, etc. — individual component exports

**Build**: `panda codegen` outputs to `styled-system/`. Component source files are not built — Next.js compiles them via `transpilePackages`.

**Custom recipes**: 8 recipes that Park UI components need but the `@park-ui/panda-preset` doesn't provide are defined in `recipes/` and injected via the shared preset:
- Recipes: `absoluteCenter`, `group`, `heading`, `inputAddon`
- Slot recipes: `breadcrumb`, `inputGroup`, `radioCardGroup`, `scrollArea`

### `apps/web/` — CSS Output

**What it does**: The web app has its own `panda.config.ts` and PostCSS plugin that scan all style usage and generate the actual CSS.

Key config (`apps/web/panda.config.ts`):
- `presets: ['@pandacss/preset-base', uiPreset]` — imports the shared preset from `@repo/ui/preset`
- `importMap: "@repo/ui"` — tells Panda that imports from `@repo/ui/*` are Panda utilities
- `include` scans both `./app/**` and `../../packages/ui/src/**` — picks up style usage from both the app and the UI library
- `outdir: "styled-system"` — generates to `apps/web/styled-system/` (gitignored, used only by PostCSS)

The global CSS file (`app/globals.css`) establishes Panda's layer ordering:
```css
@layer reset, base, tokens, recipes, utilities;
```

## createStyleContext

This is the critical glue between Ark UI and Panda CSS. It lives in `packages/ui/lib/create-style-context.tsx` and gets injected into the generated `styled-system/jsx/` output via the `codegen:done` hook in `panda.config.ts`.

### Why a codegen hook?

`panda codegen` regenerates the entire `styled-system/` directory on every run, including in `--watch` mode. A post-build script wouldn't survive watch cycles. The `codegen:done` hook runs after every codegen cycle:

1. Copies `lib/create-style-context.tsx` → `styled-system/jsx/create-style-context.tsx`
2. Appends the export to `styled-system/jsx/index.mjs` and `styled-system/jsx/index.d.ts` (idempotent — checks if already present)

### Implementation details

- Uses `styled()` from the Panda CSS factory to wrap components — without this, style props like `borderColor` or `insetInlineStart` are passed as raw HTML attributes and don't work.
- Returns `any` types from `withProvider`/`withContext`/`withRootProvider` — this matches Park UI's approach and avoids the ConditionalValue vs HTML attribute type conflicts.
- Uses `process.cwd()` for file paths (not `import.meta.url`) because Panda bundles the config to CJS where `import.meta` is empty.

## Component Patterns

Single-part components use `styled()` directly:
```ts
import { styled } from '@repo/ui/jsx'
import { button } from '@repo/ui/recipes'
export const Button = styled(ark.button, button)
```

Multi-part components use `createStyleContext()` to distribute slot recipe styles via React context:
```ts
import { createStyleContext } from '@repo/ui/jsx'
import { card } from '@repo/ui/recipes'
const { withProvider, withContext } = createStyleContext(card)
export const Root = withProvider(ark.div, 'root')
export const Header = withContext(ark.div, 'header')
```

Non-DOM root components (Dialog, Drawer, Menu, etc.) use `withRootProvider`:
```ts
const { withRootProvider, withContext } = createStyleContext(dialog)
export const Root = withRootProvider(DialogPrimitive.Root)
// Root doesn't render a DOM element, just provides style context
```

## Adding New Components

1. Use the Park UI CLI: `npx @park-ui/cli components add <name>` from `packages/ui/`
2. Fix import paths if needed: generated components may reference `styled-system/*` instead of `@repo/ui/*`
3. Add the per-component export to `packages/ui/package.json` exports map
4. If the component needs a recipe not in the preset, add it to `packages/ui/recipes/` and update `preset/index.ts`
