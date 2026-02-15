import { Container, Flex } from "@repo/ui/jsx";
import { Heading } from "@repo/ui/heading";
import { ContactForm } from "./contact-form";
import { ContactList } from "./contact-list";

export default function ContactsPage() {
  return (
    <Container maxW="4xl" py="16" px="6">
      <Heading as="h1" textStyle="3xl" mb="8">
        Contact Form
      </Heading>
      <Flex gap="8" direction={{ base: "column", md: "row" }}>
        <ContactForm />
        <ContactList />
      </Flex>
    </Container>
  );
}
