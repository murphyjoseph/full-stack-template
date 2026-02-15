"use client";

import { Stack } from "@repo/ui/jsx";
import { Text } from "@repo/ui/text";
import * as Card from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Spinner } from "@repo/ui/spinner";
import { $apiBrowser } from "@/api";

export function ClientQueryDemo() {
  const { data: contacts, isLoading, error, refetch } = $apiBrowser.useQuery(
    "get",
    "/contacts",
  );

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>Live Results</Card.Title>
        <Button size="sm" variant="outline" onClick={() => refetch()}>
          Refetch
        </Button>
      </Card.Header>
      <Card.Body>
        {isLoading && (
          <Stack direction="row" gap="2" align="center">
            <Spinner />
            <Text>Loading contacts...</Text>
          </Stack>
        )}

        {error && <Text color="fg.error">Error loading contacts</Text>}

        {!isLoading && !error && contacts && (
          <>
            {contacts.length === 0 ? (
              <Text color="fg.muted">No contacts found</Text>
            ) : (
              <Stack gap="3">
                {contacts.map((contact) => (
                  <Card.Root key={contact.id} variant="outline">
                    <Card.Body>
                      <Text fontWeight="semibold">{contact.name}</Text>
                      <Text color="fg.muted" fontSize="sm">
                        {contact.email}
                      </Text>
                      <Text fontSize="sm" color="fg.muted">
                        {contact.message}
                      </Text>
                    </Card.Body>
                  </Card.Root>
                ))}
              </Stack>
            )}
          </>
        )}
      </Card.Body>
    </Card.Root>
  );
}
