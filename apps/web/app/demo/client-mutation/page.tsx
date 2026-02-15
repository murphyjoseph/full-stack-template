import { Stack } from "@repo/ui/jsx";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import * as Card from "@repo/ui/card";
import { Code } from "@repo/ui/code";
import { ClientMutationDemo } from "./client-mutation-demo";

export default function ClientMutationPage() {
  return (
    <Stack gap="6">
      <div>
        <Heading as="h2" textStyle="xl">
          Client Mutation (TanStack Query)
        </Heading>
        <Text color="fg.muted">
          Form submission handled client-side with automatic cache updates
        </Text>
      </div>

      <Card.Root>
        <Card.Header>
          <Card.Title>How it works</Card.Title>
        </Card.Header>
        <Card.Body>
          <Stack gap="4">
            <Text>
              • Form uses useMutation hook for client-side POST
              <br />
              • Optimistic updates and error handling
              <br />
              • Automatic query invalidation refreshes list
              <br />• Rich loading/error/success states
            </Text>
            <Code>
              {`const mutation = $apiBrowser.useMutation("post", "/contacts");
await mutation.mutateAsync({ body: { name, email, message } });
queryClient.invalidateQueries({ queryKey: ["get", "/contacts"] });`}
            </Code>
          </Stack>
        </Card.Body>
      </Card.Root>

      <ClientMutationDemo />
    </Stack>
  );
}
