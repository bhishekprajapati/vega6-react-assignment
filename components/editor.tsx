"use client";

import { Grid, GridItem } from "@chakra-ui/react";
import type { Full } from "unsplash-js/dist/methods/photos/types";

type EditorProps = {
  data: Full;
};

const Editor: React.FC<EditorProps> = ({ data }) => {
  return (
    <Grid>
      <GridItem></GridItem>
      <GridItem>{data.id}</GridItem>
    </Grid>
  );
};

export default Editor;
