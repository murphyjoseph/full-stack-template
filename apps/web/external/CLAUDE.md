# external/

App-level integration layer for third-party dependencies. Each subfolder is named after the external library or service it configures.

## Purpose

Centralizes initialization, configuration, and providers for external dependencies. Opening this folder should immediately show which third-party libraries are wired into the app.

## Structure

```
external/
  <library-name>/
    client.browser.ts    — browser/client-side integration
    client.server.ts     — server-side integration
    provider.tsx         — React context provider (if needed)
```

Not every library needs all file types. Use what's relevant:
- **client.browser.ts / client.server.ts** — for libraries that need different setup per environment (e.g., API clients with different auth strategies)
- **provider.tsx** — for libraries that require a React context provider wrapping the app

## What belongs here

- Library initialization and configuration
- Auth middleware, token injection
- Provider components that wrap the app
- Environment-specific client setup (browser vs server)

## What does NOT belong here

- Business logic or app-specific code
- UI components (those go in `app/` or `components/`)
- Shared packages (those go in `packages/`)
