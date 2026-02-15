"use client";

import { $apiBrowser } from "@/api";
import { Stack } from "@repo/ui/jsx";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import { Spinner } from "@repo/ui/spinner";
import * as Card from "@repo/ui/card";

export function ContactList() {
  const { data, isLoading, error } = $apiBrowser.useQuery("get", "/contacts");

  return (
    <Stack gap="4" flex="1">
      <Heading as="h2" textStyle="xl">
        Contacts
      </Heading>

      {isLoading && <Spinner />}

      {error && (
        <Text color="fg.error">Failed to load contacts.</Text>
      )}

      {data && Array.isArray(data) && data.length === 0 && (
        <Text color="fg.muted">No contacts yet.</Text>
      )}

      {data && Array.isArray(data) && data.length > 0 && (
        <Stack gap="3">
          {data.map((contact) => (
            <Card.Root key={contact.id}>
              <Card.Body>
                <Stack gap="1">
                  <Text fontWeight="medium">{contact.name}</Text>
                  <Text size="sm" color="fg.muted">{contact.email}</Text>
                  <Text size="sm" mt="1">{contact.message}</Text>
                </Stack>
              </Card.Body>
            </Card.Root>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
