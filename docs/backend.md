# Backend (NestJS)

The backend is a NestJS 11 REST API at `apps/server/`, using Prisma for database access and `@nestjs/swagger` for OpenAPI spec generation.

## Structure

```
apps/server/
  src/
    main.ts                     Bootstrap, CORS, Swagger, validation pipe
    app.module.ts               Root module (imports Prisma + Contacts)
    prisma/
      prisma.module.ts          Global PrismaModule
      prisma.service.ts         PrismaClient wrapper (connects on init)
    contacts/
      contacts.module.ts        Contacts feature module
      contacts.controller.ts    REST endpoints with Swagger decorators
      contacts.service.ts       Prisma-backed CRUD service
      dto/
        create-contact.dto.ts   Request body (class-validator + @ApiProperty)
        contact.dto.ts          Response shape
  prisma/
    schema.prisma               Database schema (SQLite, Contact model)
  scripts/
    generate-openapi.ts         Headless Swagger JSON extraction
```

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/contacts` | Create a contact |
| `GET` | `/contacts` | List all contacts (newest first) |
| `GET` | `/contacts/:id` | Get contact by ID (404 if missing) |
| `DELETE` | `/contacts/:id` | Delete contact by ID (404 if missing) |

Swagger UI: `http://localhost:3001/api`
OpenAPI JSON: `http://localhost:3001/api-json`

## Configuration

Bootstrap in `src/main.ts`:
- **CORS**: `process.env.CORS_ORIGIN` (default: `http://localhost:3000`)
- **Port**: `process.env.PORT` (default: `3001`)
- **Validation**: Global `ValidationPipe` with `whitelist: true` (strips unknown properties) and `transform: true` (auto-transforms path params)

## Database

Prisma with SQLite. Schema at `prisma/schema.prisma`:

```prisma
model Contact {
  id        Int      @id @default(autoincrement())
  name      String
  email     String
  message   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Database file: `prisma/dev.db` (gitignored via `*.db` pattern).

To switch to PostgreSQL:
1. Change `provider = "sqlite"` to `provider = "postgresql"` in `schema.prisma`
2. Set `DATABASE_URL` to a PostgreSQL connection string in `.env`
3. Run `pnpm --filter server prisma:migrate`

## DTOs and Swagger

DTOs use `class-validator` for runtime validation and `@ApiProperty` for schema generation. The `@nestjs/swagger` CLI plugin (in `nest-cli.json`) provides additional introspection.

`@ApiProperty` decorators must include explicit `{ type: ... }` because the OpenAPI generation script uses `tsx`, which doesn't support `emitDecoratorMetadata`. Without explicit types, Swagger would infer all properties as `Object`.

`@ApiBody({ type: Dto })` is added to `POST`/`PUT`/`PATCH` controller methods to ensure the request body schema appears in the spec.

## Adding a New Resource

1. Create a Prisma model in `prisma/schema.prisma`
2. Run `pnpm --filter server prisma:migrate`
3. Create a module directory under `src/` with:
   - `*.module.ts` — NestJS module registering controller + service
   - `*.controller.ts` — Endpoints with Swagger decorators
   - `*.service.ts` — Prisma queries
   - `dto/*.dto.ts` — Request/response shapes with `@ApiProperty` and `class-validator`
4. Import the new module in `app.module.ts`
5. Run `pnpm generate:types` to regenerate the OpenAPI spec and TypeScript types
