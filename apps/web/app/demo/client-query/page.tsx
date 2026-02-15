import { Stack } from "@repo/ui/jsx";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import * as Card from "@repo/ui/card";
import { Code } from "@repo/ui/code";
import { ClientQueryDemo } from "./client-query-demo";

export default function ClientQueryPage() {
  return (
    <Stack gap="6">
      <div>
        <Heading as="h2" textStyle="xl">
          Client Query (TanStack Query)
        </Heading>
        <Text color="fg.muted">
          Data fetched client-side using React Query hooks
        </Text>
      </div>

      <Card.Root>
        <Card.Header>
          <Card.Title>How it works</Card.Title>
        </Card.Header>
        <Card.Body>
          <Stack gap="4">
            <Text>
              • Runs in the browser after page load
              <br />
              • Automatic caching and refetching
              <br />
              • Loading and error states handled by React Query
              <br />• Ideal for dynamic, frequently updated data
            </Text>
            <Code>
              {`const { data, isLoading } = $apiBrowser.useQuery("get", "/contacts");`}
            </Code>
          </Stack>
        </Card.Body>
      </Card.Root>

      <ClientQueryDemo />
    </Stack>
  );
}
