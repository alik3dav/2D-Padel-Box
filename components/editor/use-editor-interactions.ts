"use client";

import { type PointerEvent, type RefObject, type WheelEvent, useCallback, useEffect, useRef, useState } from "react";

import { useEditor } from "@/components/editor/editor-context";
import type { EditorObject } from "@/lib/editor-types";

type UseEditorInteractionsArgs = {
  viewportRef: RefObject<HTMLDivElement | null>;
  unitSize: number;
};

function roundToGrid(value: number, gridSize: number) {
  return Math.round(value / gridSize) * gridSize;
}

export function useEditorInteractions({ viewportRef, unitSize }: UseEditorInteractionsArgs) {
  const { state, dispatch } = useEditor();
  const [spacePressed, setSpacePressed] = useState(false);
  const [isPanning, setIsPanning] = useState(false);

  const dragRef = useRef<
    | {
        id: string;
        startPointerX: number;
        startPointerY: number;
        startX: number;
        startY: number;
      }
    | null
  >(null);

  const panRef = useRef<
    | {
        startPointerX: number;
        startPointerY: number;
        startPanX: number;
        startPanY: number;
      }
    | null
  >(null);

  const screenToWorld = useCallback(
    (clientX: number, clientY: number) => {
      const viewport = viewportRef.current;
      if (!viewport) {
        return { x: 0, y: 0 };
      }

      const rect = viewport.getBoundingClientRect();
      return {
        x: (clientX - rect.left - state.transform.panX) / (state.transform.zoom * unitSize),
        y: (clientY - rect.top - state.transform.panY) / (state.transform.zoom * unitSize),
      };
    },
    [state.transform.panX, state.transform.panY, state.transform.zoom, unitSize, viewportRef],
  );

  const onWheel = useCallback(
    (event: WheelEvent<HTMLDivElement>) => {
      event.preventDefault();
      const viewport = viewportRef.current;
      if (!viewport) {
        return;
      }

      const rect = viewport.getBoundingClientRect();
      const pointerX = event.clientX - rect.left;
      const pointerY = event.clientY - rect.top;
      const zoomFactor = event.deltaY < 0 ? 1.1 : 0.9;
      const nextZoom = Math.max(0.25, Math.min(3, state.transform.zoom * zoomFactor));
      const worldX = (pointerX - state.transform.panX) / state.transform.zoom;
      const worldY = (pointerY - state.transform.panY) / state.transform.zoom;

      dispatch({
        type: "set-transform",
        payload: {
          zoom: nextZoom,
          panX: pointerX - worldX * nextZoom,
          panY: pointerY - worldY * nextZoom,
        },
      });
    },
    [dispatch, state.transform.panX, state.transform.panY, state.transform.zoom, viewportRef],
  );

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const cursor = screenToWorld(event.clientX, event.clientY);
      dispatch({ type: "set-cursor", payload: cursor });

      if (dragRef.current) {
        const target = state.objects.find((item) => item.id === dragRef.current?.id);
        if (!target || target.locked) {
          return;
        }

        const deltaX = (event.clientX - dragRef.current.startPointerX) / (state.transform.zoom * unitSize);
        const deltaY = (event.clientY - dragRef.current.startPointerY) / (state.transform.zoom * unitSize);

        let x = dragRef.current.startX + deltaX;
        let y = dragRef.current.startY + deltaY;

        if (state.snap.enabled) {
          x = roundToGrid(x, state.grid.size);
          y = roundToGrid(y, state.grid.size);
        }

        dispatch({ type: "move-object", payload: { id: target.id, x, y } });
      }

      if (panRef.current) {
        const deltaX = event.clientX - panRef.current.startPointerX;
        const deltaY = event.clientY - panRef.current.startPointerY;
        dispatch({
          type: "set-transform",
          payload: {
            panX: panRef.current.startPanX + deltaX,
            panY: panRef.current.startPanY + deltaY,
          },
        });
      }
    },
    [dispatch, screenToWorld, state.grid.size, state.objects, state.snap.enabled, state.transform.zoom, unitSize],
  );

  const stopInteractions = useCallback(() => {
    dragRef.current = null;
    panRef.current = null;
    setIsPanning(false);
  }, []);

  const onViewportPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const isPanIntent = event.button === 1 || (event.button === 0 && spacePressed);
      if (isPanIntent) {
        panRef.current = {

          startPointerX: event.clientX,
          startPointerY: event.clientY,
          startPanX: state.transform.panX,
          startPanY: state.transform.panY,
        };
        setIsPanning(true);
        return;
      }

      if (event.target === event.currentTarget) {
        dispatch({ type: "select-object", payload: { id: null } });
      }
    },
    [dispatch, spacePressed, state.transform.panX, state.transform.panY],
  );

  const onObjectPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>, object: EditorObject) => {
      event.stopPropagation();
      if (object.locked) {
        return;
      }

      dispatch({ type: "select-object", payload: { id: object.id } });
      dragRef.current = {
        id: object.id,
        startPointerX: event.clientX,
        startPointerY: event.clientY,
        startX: object.x,
        startY: object.y,
      };
    },
    [dispatch],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        setSpacePressed(true);
      }
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        setSpacePressed(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("pointerup", stopInteractions);
    return () => window.removeEventListener("pointerup", stopInteractions);
  }, [stopInteractions]);

  return {
    onWheel,
    onPointerMove,
    onViewportPointerDown,
    onObjectPointerDown,
    isPanning,
    screenToWorld,
  };
}
