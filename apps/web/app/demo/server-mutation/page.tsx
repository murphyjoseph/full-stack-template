import { revalidatePath } from "next/cache";
import { Stack } from "@repo/ui/jsx";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import * as Card from "@repo/ui/card";
import { Code } from "@repo/ui/code";
import { createApiClient } from "@repo/api-schema";
import { ServerMutationForm } from "./form";

async function createContact(formData: FormData) {
  "use server";

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const client = createApiClient(apiUrl);

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  const { data, error } = await client.POST("/contacts", {
    body: { name, email, message },
  });

  if (error) {
    throw new Error("Failed to create contact");
  }

  revalidatePath("/demo/server-mutation");
  return data;
}

export default async function ServerMutationPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const client = createApiClient(apiUrl);
  const { data: contacts } = await client.GET("/contacts");

  return (
    <Stack gap="6">
      <div>
        <Heading as="h2" textStyle="xl">
          Server Mutation (Server Actions)
        </Heading>
        <Text color="fg.muted">
          Form submission handled by Server Action with revalidation
        </Text>
      </div>

      <Card.Root>
        <Card.Header>
          <Card.Title>How it works</Card.Title>
        </Card.Header>
        <Card.Body>
          <Stack gap="4">
            <Text>
              • Form uses Server Action (function with "use server")
              <br />
              • No client-side JS required for submission
              <br />
              • Progressive enhancement - works without JavaScript
              <br />• revalidatePath refreshes server component data
            </Text>
            <Code>
              {`async function createContact(formData: FormData) {
  "use server";
  await client.POST("/contacts", { body });
  revalidatePath("/demo/server-mutation");
}`}
            </Code>
          </Stack>
        </Card.Body>
      </Card.Root>

      <Card.Root>
        <Card.Header>
          <Card.Title>Try it</Card.Title>
        </Card.Header>
        <Card.Body>
          <ServerMutationForm createContact={createContact} />
        </Card.Body>
      </Card.Root>

      <Card.Root>
        <Card.Header>
          <Card.Title>Recent Contacts ({contacts?.length || 0})</Card.Title>
        </Card.Header>
        <Card.Body>
          {contacts && contacts.length > 0 ? (
            <Stack gap="2">
              {contacts.slice(0, 3).map((contact) => (
                <Text key={contact.id} fontSize="sm">
                  {contact.name} - {contact.email}
                </Text>
              ))}
            </Stack>
          ) : (
            <Text color="fg.muted">No contacts yet</Text>
          )}
        </Card.Body>
      </Card.Root>
    </Stack>
  );
}
