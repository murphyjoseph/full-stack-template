"use client";

import { useActionState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { $apiBrowser } from "@/api";
import { logger } from "../../external/logger";
import { Stack } from "@repo/ui/jsx";
import { Button } from "@repo/ui/button";
import { Heading } from "@repo/ui/heading";
import { Input } from "@repo/ui/input";
import { Textarea } from "@repo/ui/textarea";
import * as Field from "@repo/ui/field";
import * as Alert from "@repo/ui/alert";

type FormState = {
  error?: string;
  success?: boolean;
};

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const queryClient = useQueryClient();
  const mutation = $apiBrowser.useMutation("post", "/contacts");

  async function submitAction(
    _prevState: FormState,
    formData: FormData,
  ): Promise<FormState> {
    const body = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    };

    try {
      await mutation.mutateAsync({ body });
      await queryClient.invalidateQueries({
        queryKey: ["get", "/contacts"],
      });
      formRef.current?.reset();
      return { success: true };
    } catch (err) {
      logger.error(err, { action: "contact.create", body });
      return { error: "Failed to submit contact form." };
    }
  }

  const [state, action, isPending] = useActionState(submitAction, {});

  return (
    <form ref={formRef} action={action}>
      <Stack gap="4" flex="1">
        <Heading as="h2" textStyle="xl">
          New Contact
        </Heading>

        {state.error && (
          <Alert.Root>
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Description>{state.error}</Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )}
        {state.success && (
          <Alert.Root>
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Description>Contact submitted successfully!</Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )}

        <Field.Root required>
          <Field.Label>Name</Field.Label>
          <Input name="name" placeholder="Jane Doe" />
        </Field.Root>

        <Field.Root required>
          <Field.Label>Email</Field.Label>
          <Input name="email" type="email" placeholder="jane@example.com" />
        </Field.Root>

        <Field.Root required>
          <Field.Label>Message</Field.Label>
          <Textarea name="message" rows={4} placeholder="Your message..." />
        </Field.Root>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit"}
        </Button>
      </Stack>
    </form>
  );
}
