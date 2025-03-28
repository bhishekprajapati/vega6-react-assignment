"use client";

import { useSearch, UseSearchResponseData } from "@/hooks/unsplash";
import {
  Alert,
  Box,
  Button,
  Card,
  Grid,
  GridItem,
  Image,
  Input,
  Skeleton,
} from "@chakra-ui/react";
import { debounce } from "lodash";
import Link from "next/link";
import { createContext, useContext, useState } from "react";

type TQueryContext =
  | {
      query: string;
      setQuery: (query: string) => void;
    }
  | undefined;
const QueryContext = createContext<TQueryContext>(undefined);

const useQuery = () => {
  const ctx = useContext(QueryContext);
  if (ctx === undefined) {
    throw Error("Must be called inside QueryContext");
  }
  return ctx;
};

type SearchRootProps = {
  children: React.ReactNode;
};

const SearchRoot: React.FC<SearchRootProps> = ({ children }) => {
  const [query, setQuery] = useState("");
  return (
    <QueryContext.Provider value={{ query, setQuery: (q) => setQuery(q) }}>
      {children}
    </QueryContext.Provider>
  );
};

type PhotoCardProps = {
  data: ArrayType<UseSearchResponseData["results"]>;
};

const PhotoCard: React.FC<PhotoCardProps> = ({ data }) => (
  <Card.Root>
    <Card.Body>
      <Image
        aspectRatio={1}
        objectFit="cover"
        objectPosition="center"
        rounded={4}
        src={data.urls.regular}
        alt={data.alt_description ?? ""}
        loading="lazy"
        decoding="async"
      />
    </Card.Body>
    <Card.Footer>
      <Button
        as={Link}
        // @ts-expect-error dynamic route
        href={`/editor/${data.id}`}
        variant="subtle"
        w="full"
        display={["none", null, null, "flex"]}
      >
        Add Caption
      </Button>
      <Box w="full" display={["block", null, null, "none"]}>
        <Alert.Root status="warning">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Open on desktop to add caption/edit</Alert.Title>
          </Alert.Content>
        </Alert.Root>
      </Box>
    </Card.Footer>
  </Card.Root>
);

const PhotoCardSkeleton = () => (
  <Card.Root>
    <Card.Body>
      <Skeleton aspectRatio={1} rounded={4} />
    </Card.Body>
    <Card.Footer>
      <Skeleton w="full" h={8} rounded={4} />
    </Card.Footer>
  </Card.Root>
);

const ContainerItem = ({ children }: { children: React.ReactNode }) => (
  <GridItem>{children}</GridItem>
);

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <Grid
      templateColumns={["auto", "repeat(2, 1fr)", "repeat(4, 1fr)"]}
      gap={[8]}
    >
      {children}
    </Grid>
  );
};

const SearchResults = () => {
  const { query } = useQuery();
  const isEmptyQuery = !query;

  /**
   * TODO: add request abort signal
   */
  const search = useSearch({
    params: {
      query,
      resource: "photos",
    },
    enabled: !isEmptyQuery,
  });

  if (search.data) {
    return (
      <Container>
        {search.data.results.map((photo) => (
          <ContainerItem key={photo.id}>
            <PhotoCard data={photo} />
          </ContainerItem>
        ))}
      </Container>
    );
  }

  if (search.error) {
    return (
      <Card.Root>
        <Card.Body textAlign="center" color="red">
          {search.error.message}
        </Card.Body>
      </Card.Root>
    );
  }

  /**
   * TODO: add illustration
   */
  if (isEmptyQuery) {
    return <></>;
  }

  return (
    <Container>
      {new Array(10).fill(0).map((_, i) => (
        <ContainerItem key={i}>
          <PhotoCardSkeleton />
        </ContainerItem>
      ))}
    </Container>
  );
};

const SearchBar = () => {
  const { setQuery } = useQuery();
  const debounced = debounce(setQuery, 250, {
    trailing: true,
  });

  return (
    <Input
      autoFocus
      placeholder="search for images..."
      onChange={(e) => debounced(e.target.value.trim())}
    />
  );
};

const Search = () => (
  <Box>
    <SearchRoot>
      <Box maxWidth={[null, null, "2/3"]} mx="auto" mb={[8]}>
        <SearchBar />
      </Box>
      <SearchResults />
    </SearchRoot>
  </Box>
);

export default Search;
