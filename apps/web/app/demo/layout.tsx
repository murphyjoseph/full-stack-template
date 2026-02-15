import { Container, Stack } from "@repo/ui/jsx";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import { Link } from "@repo/ui/link";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container py="8">
      <Stack gap="6">
        <div>
          <Heading as="h1" textStyle="2xl">
            API Pattern Demos
          </Heading>
          <Text color="fg.muted">
            Examples of server and client-side data fetching patterns
          </Text>
        </div>

        <Stack direction="row" gap="4">
          <Link href="/demo/server-query">Server Query</Link>
          <Link href="/demo/server-mutation">Server Mutation</Link>
          <Link href="/demo/client-query">Client Query</Link>
          <Link href="/demo/client-mutation">Client Mutation</Link>
        </Stack>

        {children}
      </Stack>
    </Container>
  );
}
