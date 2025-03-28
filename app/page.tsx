import { Box, Button, Container, HStack } from "@chakra-ui/react";
import Search from "@/components/search";
import { Github } from "lucide-react";

export default function Home() {
  return (
    <Box>
      <HStack p={2} shadow="xs" mb={16} justifyContent="center">
        Built by Abhishek Prajapati
        <Button
          as={"a"}
          // @ts-expect-error
          href="https://github.com/bhishekprajapati"
          rounded="full"
          variant="subtle"
        >
          <Github size={16} />
        </Button>
      </HStack>
      <Container py={["var(--chakra-spacing-4)"]}>
        <Search />
      </Container>
    </Box>
  );
}
