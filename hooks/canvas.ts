"use client";

import type { Canvas } from "fabric";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";

type UseCanvasStateOptions<R> = {
  canvas: Canvas;
  delay?: number;
  handler: (canvas: Canvas) => R;
};

export function useCanvasState<R>(opts: UseCanvasStateOptions<R>) {
  const { canvas, delay = 150, handler } = opts;
  const [state, setState] = useState<R | undefined>(undefined);

  const update = useCallback(
    debounce(() => setState(handler(canvas)), delay, {
      trailing: true,
    }),
    [canvas]
  );

  useEffect(() => {
    canvas.on("after:render", update);
    return () => {
      canvas.off("after:render", update);
    };
  }, [canvas, update]);

  useEffect(() => {
    update();
  }, []);

  return state;
}
