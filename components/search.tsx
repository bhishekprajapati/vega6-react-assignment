"use client";

import { useSearch } from "@/hooks/unsplash";
import { Box, Card, Image, Input } from "@chakra-ui/react";
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
      <Box>
        {search.data.results.map((photo) => (
          <Card.Root key={photo.id}>
            <Image src={photo.urls.small} />
          </Card.Root>
        ))}
      </Box>
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
    <Box>
      <Input
        placeholder="search for images..."
        onChange={(e) => setQuery(e.target.value.trim())}
      />
    </Box>
  );
};

const Search = () => (
  <Box maxWidth={[null, null, "2/3"]} mx="auto">
    <SearchRoot>
      <SearchBar />
      <SearchResults />
    </SearchRoot>
  </Box>
);

export default Search;
