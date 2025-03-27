"use client";

import * as f from "fabric";
import { Box, Button, Card, Flex, Grid, GridItem } from "@chakra-ui/react";
import type { Full } from "unsplash-js/dist/methods/photos/types";
import { useEffect, useRef, useState } from "react";
import {
  Circle,
  RectangleHorizontal,
  Star,
  Triangle,
  Type,
} from "lucide-react";

type EditorToolsProps = {
  canvas: f.Canvas;
};

const EditorTools: React.FC<EditorToolsProps> = ({ canvas }) => {
  const bttns = [
    {
      name: "text",
      Icon: Type,
    },
    {
      name: "triangle",
      Icon: Triangle,
    },
    {
      name: "rect",
      Icon: RectangleHorizontal,
    },
    {
      name: "circle",
      Icon: Circle,
    },
    {
      name: "polygon",
      Icon: Star,
    },
  ] as const;

  return (
    <Flex direction="column" alignItems="center" p="2" gap={2}>
      {bttns.map(({ name, Icon }) => (
        <Box key={name}>
          <Button variant="subtle">
            <Icon size={16} />
          </Button>
        </Box>
      ))}
    </Flex>
  );
};

type EditorLayersProps = {
  canvas: f.Canvas;
};

const EditorLayers: React.FC<EditorLayersProps> = ({ canvas }) => {
  return "layers";
};

type EditorProps = {
  data: Full;
};

const Editor: React.FC<EditorProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<f.Canvas | null>(null);

  useEffect(function init() {
    if (!canvasRef.current) return;
    const parentEl = canvasRef.current.parentElement!;

    const canvas = new f.Canvas(canvasRef.current, {
      width: parentEl.clientWidth,
      height: parentEl.clientHeight,
    });

    const resizer = new ResizeObserver(() => {
      if (!parentEl) return;
      canvas.setWidth(parentEl.clientWidth);
      canvas.setHeight(parentEl.clientHeight);
      canvas.renderAll();
    });

    resizer.observe(parentEl);

    setCanvas(canvas);
    return () => {
      resizer.disconnect();
      setCanvas(null);
      canvas.dispose();
    };
  }, []);

  useEffect(
    function loadImage() {
      if (!canvas) return;
      f.FabricImage.fromURL(data.urls.small).then((img) => {
        canvas.add(img);
        canvas.renderAll();
      });
      // TODO: handle loading error
    },
    [canvas]
  );

  return (
    <Box h="100dvh">
      <Grid h="full" templateColumns={["auto", null, ".5fr 9.5fr 2fr"]}>
        <GridItem h="full">
          <Card.Root h="full">
            {canvas && <EditorTools canvas={canvas} />}
          </Card.Root>
        </GridItem>
        <GridItem h="full">
          <Box h="full">
            <canvas ref={canvasRef} />
          </Box>
        </GridItem>
        <GridItem h="full">
          <Card.Root h="full">
            {canvas && <EditorLayers canvas={canvas} />}
          </Card.Root>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default Editor;
