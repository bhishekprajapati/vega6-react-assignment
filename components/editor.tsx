"use client";

import { useCanvasState } from "@/hooks/canvas";
import {
  Accordion,
  Box,
  Button,
  Card,
  createListCollection,
  Field,
  Flex,
  Grid,
  GridItem,
  HStack,
  Image,
  Portal,
  Select,
  useAccordionItemContext,
} from "@chakra-ui/react";
import JsonView from "@uiw/react-json-view";
import { githubDarkTheme } from "@uiw/react-json-view/githubDark";
import { githubLightTheme } from "@uiw/react-json-view/githubLight";
import * as f from "fabric";
import { Circle, RectangleHorizontal, Triangle, Type } from "lucide-react";
import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import type { Full } from "unsplash-js/dist/methods/photos/types";
import { ColorModeButton, useColorMode } from "./ui/color-mode";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

declare module "fabric" {
  interface FabricObject {
    id: string;
  }

  interface SerializedObjectProps {
    id: string;
  }
}

f.FabricObject.customProperties = ["id"];

type EditorToolsProps = {
  canvas: f.Canvas;
  image: f.FabricImage;
};

const EditorTools: React.FC<EditorToolsProps> = ({ canvas, image }) => {
  const bttns = [
    {
      name: "text",
      Icon: Type,
      onClick: () => {
        const text = new f.IText("Text", {
          id: nanoid(),
          fill: "#909090",
          top: image.top,
          left: image.left,
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.renderAll();
      },
    },
    {
      name: "triangle",
      Icon: Triangle,
      onClick: () => {
        const triangle = new f.Triangle({
          id: nanoid(),
          fill: "#808080",
          top: image.top,
          left: image.left,
        });
        canvas.add(triangle);
        canvas.setActiveObject(triangle);
        canvas.renderAll();
      },
    },
    {
      name: "rect",
      Icon: RectangleHorizontal,
      onClick: () => {
        const rect = new f.Rect({
          id: nanoid(),
          backgroundColor: "#707070",
          top: image.top,
          left: image.left,
        });
        canvas.add(rect);
        canvas.setActiveObject(rect);
        canvas.renderAll();
      },
    },
    {
      name: "circle",
      Icon: Circle,
      onClick: () => {
        const circle = new f.Circle({
          id: nanoid(),
          fill: "#606060",
          radius: 100,
          top: image.top,
          left: image.left,
        });
        canvas.add(circle);
        canvas.setActiveObject(circle);
        canvas.renderAll();
      },
    },
  ] as const;

  useEffect(
    () =>
      canvas.on("object:added", () => {
        const objects = canvas.getObjects();
        // Bring text objects to the top
        objects.forEach((obj) => {
          if (obj instanceof f.IText) {
            canvas.bringObjectToFront(obj);
          }
        });
        canvas.renderAll();
      }),
    [canvas]
  );

  return (
    <Flex direction="column" alignItems="center" p="2" gap={2}>
      {bttns.map(({ name, Icon, onClick }) => (
        <Button key={name} variant="subtle" onClick={onClick}>
          <Icon size={16} />
        </Button>
      ))}
      <ColorModeButton />
    </Flex>
  );
};

type AccordionItemProps = {
  children: React.ReactNode;
  value: string;
  name: string;
};

const AccordionItem = (props: AccordionItemProps) => {
  const { children, value, name } = props;

  return (
    <Accordion.Item value={value}>
      <Accordion.ItemTrigger p={4} justifyContent="space-between">
        <Box>{name}</Box>
        <Accordion.ItemIndicator />
      </Accordion.ItemTrigger>
      <Accordion.ItemContent>
        <Accordion.ItemBody p={4}>{children}</Accordion.ItemBody>
      </Accordion.ItemContent>
    </Accordion.Item>
  );
};

type EditorControlsProps = {
  canvas: f.Canvas;
};

const Debugger = ({ canvas }: { canvas: f.Canvas }) => {
  const mode = useColorMode();
  const json = useCanvasState({
    canvas,
    delay: 250,
    handler: (canvas) => canvas.toJSON() as Record<string, unknown>,
  });

  console.log(json);

  return (
    <JsonView
      value={json ?? {}}
      style={mode.colorMode === "light" ? githubLightTheme : githubDarkTheme}
    />
  );
};

const Downloader = ({ canvas }: { canvas: f.Canvas }) => {
  const url = useCanvasState({
    canvas,
    delay: 250,
    handler: (canvas) => canvas.toDataURL(),
  });

  const formats = createListCollection({
    items: [
      { label: ".png", value: "png" },
      { label: ".jpeg", value: "jpeg" },
      { label: ".webp", value: "webp" },
    ],
  });

  const schema = z.object({
    format: z.enum(["png", "jpeg", "webp"]).array(),
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
    control,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      format: ["png"],
    },
  });

  const onSubmit = handleSubmit(({ format }) => {
    const [f] = format;
    const href = canvas.toDataURL({
      format: f,
      multiplier: 1,
    });
    const link = document.createElement("a");
    link.href = href;
    link.download = `exported`;
    link.click();
  });

  return (
    <Box>
      <Card.Root>
        <Card.Header>
          <Card.Title>Preview</Card.Title>
        </Card.Header>
        <Card.Body>
          <Image src={url} alt="preview" />
        </Card.Body>
        <Card.Footer>
          <form onSubmit={onSubmit}>
            <HStack alignItems="end">
              <Field.Root invalid={!!errors.format} width="320px">
                <Field.Label>Format</Field.Label>
                <Controller
                  control={control}
                  name="format"
                  render={({ field }) => (
                    <Select.Root
                      name={field.name}
                      value={field.value}
                      onValueChange={({ value }) => field.onChange(value)}
                      onInteractOutside={() => field.onBlur()}
                      collection={formats}
                    >
                      <Select.HiddenSelect />
                      <Select.Control>
                        <Select.Trigger>
                          <Select.ValueText placeholder="Select image format" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                          <Select.Indicator />
                        </Select.IndicatorGroup>
                      </Select.Control>
                      <Portal>
                        <Select.Positioner>
                          <Select.Content>
                            {formats.items.map((format) => (
                              <Select.Item item={format} key={format.value}>
                                {format.label}
                                <Select.ItemIndicator />
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Positioner>
                      </Portal>
                    </Select.Root>
                  )}
                />
                <Field.ErrorText>{errors.format?.message}</Field.ErrorText>
              </Field.Root>
              <Button size="sm" type="submit" disabled={!isValid}>
                Download
              </Button>
            </HStack>
          </form>
        </Card.Footer>
      </Card.Root>
    </Box>
  );
};

const WhenExpanded = ({ children }: { children: React.ReactNode }) => {
  const { expanded } = useAccordionItemContext();
  return expanded ? children : <></>;
};

const EditorControls: React.FC<EditorControlsProps> = ({ canvas }) => {
  return (
    <Accordion.Root collapsible defaultValue={["b"]}>
      <AccordionItem name="Debug" value="Debug">
        <WhenExpanded>
          <Debugger canvas={canvas} />
        </WhenExpanded>
      </AccordionItem>
      <AccordionItem name="Download" value="Download">
        <WhenExpanded>
          <Downloader canvas={canvas} />
        </WhenExpanded>
      </AccordionItem>
    </Accordion.Root>
  );
};

type EditorProps = {
  data: Full;
};

const Editor: React.FC<EditorProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<f.Canvas | null>(null);
  const [image, setImage] = useState<f.FabricImage>();

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
      f.FabricImage.fromURL(data.urls.small, { crossOrigin: "anonymous" }).then(
        (img) => {
          canvas.add(img);
          canvas.renderAll();
          setImage(img);
        }
      );
    },
    [canvas, data]
  );

  return (
    <Box h="100dvh">
      <Grid h="full" templateColumns={["auto", null, ".5fr 7.5fr 4fr"]}>
        <GridItem h="full">
          <Card.Root h="full">
            {canvas && image && <EditorTools canvas={canvas} image={image} />}
          </Card.Root>
        </GridItem>
        <GridItem h="full">
          <Box h="full">
            <canvas ref={canvasRef} />
          </Box>
        </GridItem>
        <GridItem h="full" overflowY="auto">
          <Card.Root h="full">
            {canvas && <EditorControls canvas={canvas} />}
          </Card.Root>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default Editor;
