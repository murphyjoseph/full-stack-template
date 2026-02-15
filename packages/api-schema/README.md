# @repo/api-schema

Framework-agnostic, typed API client generated from the NestJS backend's OpenAPI spec. Zero React dependencies.

**Why:** Single source of truth for the API contract. Wrong paths, missing body fields, or incorrect types are compile-time errors — not runtime surprises.

## Pipeline

```
Prisma schema → NestJS DTOs → Swagger → openapi.json → schema.d.ts → typed fetch client
```

## Usage

```ts
import { createApiClient } from "@repo/api-schema";

const api = createApiClient("http://localhost:3001");
const { data } = await api.GET("/contacts");       // data is ContactDto[]
await api.POST("/contacts", { body: { name, email, message } }); // body shape enforced
```

## Regenerating Types

```sh
pnpm generate:types   # Regenerates openapi.json + schema.d.ts
```

Run after changing NestJS controllers, DTOs, or Swagger decorators.
