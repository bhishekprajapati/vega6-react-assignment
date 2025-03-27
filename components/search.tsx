"use client";

import { useSearch } from "@/hooks/unsplash";
import {
  Box,
  Button,
  Card,
  Grid,
  GridItem,
  Image,
  Input,
} from "@chakra-ui/react";
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
      <Grid
        templateColumns={["auto", "repeat(2, 1fr)", "repeat(4, 1fr)"]}
        gap={[8]}
      >
        {search.data.results.map((photo) => (
          <GridItem key={photo.id}>
            <Card.Root>
              <Card.Body>
                <Image
                  aspectRatio={1}
                  objectFit="cover"
                  objectPosition="center"
                  rounded={4}
                  src={photo.urls.small}
                />
              </Card.Body>
              <Card.Footer>
                <Button variant="subtle" w="full">
                  Add Caption
                </Button>
              </Card.Footer>
            </Card.Root>
          </GridItem>
        ))}
      </Grid>
    );
  }

  if (search.error) {
    return <Box>{search.error.message}</Box>;
  }

  /**
   * TODO: add illustration
   */
  if (isEmptyQuery) {
    return <></>;
  }

  /**
   * TODO: add loading spinner
   */
  return <>data loading...</>;
};

const SearchBar = () => {
  const { setQuery } = useQuery();
  /**
   * TODO: debounce the change events
   */

  return (
    <Input
      placeholder="search for images..."
      onChange={(e) => setQuery(e.target.value.trim())}
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
