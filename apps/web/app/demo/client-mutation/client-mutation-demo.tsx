"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Stack } from "@repo/ui/jsx";
import { Text } from "@repo/ui/text";
import * as Card from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import * as Field from "@repo/ui/field";
import { Input } from "@repo/ui/input";
import { Textarea } from "@repo/ui/textarea";
import { $apiBrowser } from "@/api";

export function ClientMutationDemo() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const mutation = $apiBrowser.useMutation("post", "/contacts");

  const { data: contacts } = $apiBrowser.useQuery("get", "/contacts");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await mutation.mutateAsync({
        body: { name, email, message },
      });

      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["get", "/contacts"] });

      // Clear form
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Failed to create contact:", error);
    }
  };

  return (
    <Stack gap="6">
      <Card.Root>
        <Card.Header>
          <Card.Title>Try it</Card.Title>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit}>
            <Stack gap="4">
              <Field.Root>
                <Field.Label>Name</Field.Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Jane Smith"
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>Email</Field.Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="jane@example.com"
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>Message</Field.Label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder="Your message..."
                  rows={3}
                />
              </Field.Root>

              {mutation.isSuccess && (
                <Text color="fg.success">Contact created successfully!</Text>
              )}

              {mutation.isError && (
                <Text color="fg.error">
                  Failed to create contact
                </Text>
              )}

              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending
                  ? "Creating..."
                  : "Create Contact (Client Mutation)"}
              </Button>
            </Stack>
          </form>
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
