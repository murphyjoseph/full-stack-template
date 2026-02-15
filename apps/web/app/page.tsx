import NextLink from "next/link";
import { Container, Stack } from "@repo/ui/jsx";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import { Link } from "@repo/ui/link";
import * as Card from "@repo/ui/card";

export default function Home() {
  return (
    <Container maxW="4xl" py="16" px="6">
      <Stack gap="8">
        <Stack gap="4">
          <Heading as="h1" textStyle="3xl">
            Full Stack Template
          </Heading>
          <Text color="fg.muted">
            Next.js + NestJS monorepo with Park UI, Prisma, TanStack Query, and
            Playwright.
          </Text>
        </Stack>

        <Stack gap="4">
          <Heading as="h2" textStyle="2xl">
            Quick Links
          </Heading>

          <Card.Root>
            <Card.Header>
              <Card.Title>API Pattern Demos</Card.Title>
              <Card.Description>
                Examples of server and client-side data fetching
              </Card.Description>
            </Card.Header>
            <Card.Body>
              <Stack gap="2">
                <Link asChild>
                  <NextLink href="/demo/server-query">
                    Server Query (RSC + openapi-fetch)
                  </NextLink>
                </Link>
                <Link asChild>
                  <NextLink href="/demo/server-mutation">
                    Server Mutation (Server Actions)
                  </NextLink>
                </Link>
                <Link asChild>
                  <NextLink href="/demo/client-query">
                    Client Query (TanStack Query)
                  </NextLink>
                </Link>
                <Link asChild>
                  <NextLink href="/demo/client-mutation">
                    Client Mutation (TanStack Query)
                  </NextLink>
                </Link>
              </Stack>
            </Card.Body>
          </Card.Root>

          <Card.Root>
            <Card.Header>
              <Card.Title>Example Pages</Card.Title>
              <Card.Description>
                Working contact form with full CRUD operations
              </Card.Description>
            </Card.Header>
            <Card.Body>
              <Link asChild>
                <NextLink href="/contacts">Contact Form Demo</NextLink>
              </Link>
            </Card.Body>
          </Card.Root>

          <Card.Root>
            <Card.Header>
              <Card.Title>API Documentation</Card.Title>
              <Card.Description>
                Interactive Swagger UI for the REST API
              </Card.Description>
            </Card.Header>
            <Card.Body>
              <Link href="http://localhost:3001/api" target="_blank">
                Swagger UI (localhost:3001/api)
              </Link>
            </Card.Body>
          </Card.Root>
        </Stack>
      </Stack>
    </Container>
  );
}
