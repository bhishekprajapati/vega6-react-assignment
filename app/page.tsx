import { Container } from "@chakra-ui/react";
import Search from "@/components/search";

export default function Home() {
  return (
    <Container py={["var(--chakra-spacing-4)"]}>
      <Search />
    </Container>
  );
}
