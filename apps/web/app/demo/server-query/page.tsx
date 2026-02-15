import { Stack } from "@repo/ui/jsx";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import * as Card from "@repo/ui/card";
import { Code } from "@repo/ui/code";
import { createApiClient } from "@repo/api-schema";

// Server Component - fetches data at build/request time
export default async function ServerQueryPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const client = createApiClient(apiUrl);

  // Direct fetch in Server Component
  const { data: contacts, error } = await client.GET("/contacts");

  return (
    <Stack gap="6">
      <div>
        <Heading as="h2" textStyle="xl">
          Server Query (RSC)
        </Heading>
        <Text color="fg.muted">
          Data fetched in Server Component using openapi-fetch
        </Text>
      </div>

      <Card.Root>
        <Card.Header>
          <Card.Title>How it works</Card.Title>
        </Card.Header>
        <Card.Body>
          <Stack gap="4">
            <Text>
              • Runs on the server during SSR or SSG
              <br />
              • No client-side JavaScript needed for data
              <br />
              • Uses openapi-fetch directly (not React Query)
              <br />• Fast initial page load with data already rendered
            </Text>
            <Code>
              {`const client = createApiClient(apiUrl);
const { data } = await client.GET("/contacts");`}
            </Code>
          </Stack>
        </Card.Body>
      </Card.Root>

      <Card.Root>
        <Card.Header>
          <Card.Title>Results ({contacts?.length || 0} contacts)</Card.Title>
        </Card.Header>
        <Card.Body>
          {error && <Text color="fg.error">Error loading data</Text>}
          {contacts && contacts.length === 0 && (
            <Text color="fg.muted">No contacts yet</Text>
          )}
          {contacts && contacts.length > 0 && (
            <Stack gap="3">
              {contacts.map((contact) => (
                <Card.Root key={contact.id} variant="outline">
                  <Card.Body>
                    <Text fontWeight="semibold">{contact.name}</Text>
                    <Text color="fg.muted" fontSize="sm">
                      {contact.email}
                    </Text>
                  </Card.Body>
                </Card.Root>
              ))}
            </Stack>
          )}
        </Card.Body>
      </Card.Root>
    </Stack>
  );
}
