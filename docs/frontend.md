# Frontend (Next.js)

The frontend is a Next.js 16 app at `apps/web/`, using the App Router, Panda CSS for styling, Park UI for components, and TanStack Query for data fetching.

## Structure

```
apps/web/
  app/
    layout.tsx          Root layout (wraps children in Providers)
    page.tsx            Home page
    globals.css         Panda CSS layer ordering
    providers.tsx       Client component: QueryClientProvider
    api.ts              API client singleton ($api)
    contacts/
      page.tsx          Contacts page (server component)
      contact-form.tsx  Form with useActionState + useMutation
      contact-list.tsx  List with useQuery
  panda.config.ts       Panda CSS config (imports shared preset from @repo/ui)
  postcss.config.cjs    PostCSS plugin for Panda CSS
  next.config.js        transpilePackages for @repo/ui
```

## Data Fetching

TanStack Query via `openapi-react-query`. The API client is configured in `app/api.ts`:

```ts
import { createQueryApi, type QueryApi } from "../external/openapi/client.browser";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
export const $api: QueryApi = createQueryApi(baseUrl);
```

Components import `$api` and use fully typed hooks:

```ts
// Queries — path and response types inferred from OpenAPI spec
const { data } = $api.useQuery("get", "/contacts");

// Mutations — body type enforced from OpenAPI spec
const mutation = $api.useMutation("post", "/contacts");
await mutation.mutateAsync({ body: { name, email, message } });
```

The `QueryClientProvider` is set up in `app/providers.tsx` with a 60-second default `staleTime`.

## Contact Form Pattern

The contact form (`app/contacts/contact-form.tsx`) demonstrates the recommended pattern for form handling with Park UI components:

1. **`useActionState`** (React 19) for form state management and progressive enhancement
2. **`$api.useMutation`** for the API call with full type safety
3. **`queryClient.invalidateQueries`** to refresh the contact list after submission
4. **`formRef.current?.reset()`** to clear the form on success

Key patterns in the implementation:

```tsx
import { Stack } from "@repo/ui/jsx";
import { Button } from "@repo/ui/button";
import { Heading } from "@repo/ui/heading";
import { Input } from "@repo/ui/input";
import { Textarea } from "@repo/ui/textarea";
import * as Field from "@repo/ui/field";
import * as Alert from "@repo/ui/alert";

// Field.Root + Field.Label + Input for accessible form fields
<Field.Root required>
  <Field.Label>Name</Field.Label>
  <Input name="name" placeholder="Jane Doe" />
</Field.Root>

// Alert for success/error messages
<Alert.Root>
  <Alert.Indicator />
  <Alert.Content>
    <Alert.Description>{state.error}</Alert.Description>
  </Alert.Content>
</Alert.Root>
```

## Contact List Pattern

The contact list (`app/contacts/contact-list.tsx`) shows data display with Park UI:

```tsx
import { Stack } from "@repo/ui/jsx";
import { Text } from "@repo/ui/text";
import { Spinner } from "@repo/ui/spinner";
import * as Card from "@repo/ui/card";

// Spinner for loading state (replaces raw "Loading..." text)
{isLoading && <Spinner />}

// Card for each contact entry
<Card.Root key={contact.id}>
  <Card.Body>
    <Stack gap="1">
      <Text fontWeight="medium">{contact.name}</Text>
      <Text size="sm" color="fg.muted">{contact.email}</Text>
    </Stack>
  </Card.Body>
</Card.Root>
```

## Styling

See [panda-css.md](./panda-css.md) for the full Panda CSS setup. The key points for the web app:

- `panda.config.ts` imports the shared `uiPreset` from `@repo/ui/preset` and scans both `./app/**` and `../../packages/ui/src/**`
- `postcss.config.cjs` enables the Panda CSS PostCSS plugin
- `globals.css` sets the CSS layer order: `@layer reset, base, tokens, recipes, utilities`
- `next.config.js` includes `transpilePackages: ["@repo/ui"]` so Next.js compiles component source files

### Component-first approach

Prefer Park UI components over raw `css()` calls:

```tsx
// Prefer this:
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import { Container, Stack } from "@repo/ui/jsx";

<Container maxW="4xl" py="16" px="6">
  <Heading as="h1" textStyle="3xl">Title</Heading>
  <Text color="fg.muted">Description</Text>
</Container>

// Over this:
import { css } from "@repo/ui/css";

<div className={css({ maxW: "4xl", mx: "auto", py: "16", px: "6" })}>
  <h1 className={css({ fontSize: "3xl", fontWeight: "bold" })}>Title</h1>
  <p className={css({ color: "fg.muted" })}>Description</p>
</div>
```

Use `css()` only for one-off styles that don't map to a component.

## Adding a New Page

1. Create `app/<route>/page.tsx` (server component)
2. Create client components as needed (add `"use client"` directive)
3. Import `$api` from `@/api` for data fetching
4. Import components from `@repo/ui/<component>` (e.g., `@repo/ui/button`, `@repo/ui/heading`)
5. Use layout components from `@repo/ui/jsx` (Container, Stack, Flex, Box)
6. Use `css()` from `@repo/ui/css` only for one-off styles that don't map to a component
