"use client";

import { useActionState } from "react";
import { Stack } from "@repo/ui/jsx";
import { Button } from "@repo/ui/button";
import * as Field from "@repo/ui/field";
import { Input } from "@repo/ui/input";
import { Textarea } from "@repo/ui/textarea";
import { Text } from "@repo/ui/text";

interface ServerMutationFormProps {
  createContact: (formData: FormData) => Promise<unknown>;
}

export function ServerMutationForm({
  createContact,
}: ServerMutationFormProps) {
  const [state, formAction, isPending] = useActionState(
    async (_prevState: unknown, formData: FormData) => {
      try {
        await createContact(formData);
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
    null,
  );

  return (
    <form action={formAction}>
      <Stack gap="4">
        <Field.Root>
          <Field.Label>Name</Field.Label>
          <Input name="name" required placeholder="John Doe" />
        </Field.Root>

        <Field.Root>
          <Field.Label>Email</Field.Label>
          <Input
            name="email"
            type="email"
            required
            placeholder="john@example.com"
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Message</Field.Label>
          <Textarea
            name="message"
            required
            placeholder="Your message..."
            rows={3}
          />
        </Field.Root>

        {state?.success && (
          <Text color="fg.success">Contact created successfully!</Text>
        )}

        {state?.error && <Text color="fg.error">Error: {state.error}</Text>}

        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create Contact (Server Action)"}
        </Button>
      </Stack>
    </form>
  );
}
