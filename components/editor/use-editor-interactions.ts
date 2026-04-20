"use client";

import { type PointerEvent, type RefObject, type WheelEvent, useCallback, useEffect, useRef, useState } from "react";

import { useEditor } from "@/components/editor/editor-context";
import { roundToGrid, snapRect, type Rect } from "@/lib/editor-geometry";
import type { EditorObject } from "@/lib/editor-types";

type UseEditorInteractionsArgs = {
  viewportRef: RefObject<HTMLDivElement | null>;
  unitSize: number;
};

type ResizeHandle = "nw" | "ne" | "sw" | "se";

const MIN_SIZE = 0.5;

function focusedOnFormField() {
  const target = document.activeElement;
  return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
}

export function useEditorInteractions({ viewportRef, unitSize }: UseEditorInteractionsArgs) {
  const { state, dispatch } = useEditor();
  const [spacePressed, setSpacePressed] = useState(false);
  const [isPanning, setIsPanning] = useState(false);

  const dragRef = useRef<
    | {
        ids: string[];
        startPointerX: number;
        startPointerY: number;
        startPositions: Map<string, { x: number; y: number }>;
        leadId: string;
      }
    | null
  >(null);

  const resizeRef = useRef<
    | {
        id: string;
        handle: ResizeHandle;
        startPointerX: number;
        startPointerY: number;
        startRect: Rect;
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

      if (resizeRef.current) {
        const resizing = state.objects.find((item) => item.id === resizeRef.current?.id);
        if (!resizing || resizing.locked) {
          return;
        }

        const deltaX = (event.clientX - resizeRef.current.startPointerX) / (state.transform.zoom * unitSize);
        const deltaY = (event.clientY - resizeRef.current.startPointerY) / (state.transform.zoom * unitSize);

        const start = resizeRef.current.startRect;
        let x = start.x;
        let y = start.y;
        let width = start.width;
        let height = start.height;

        if (resizeRef.current.handle.includes("e")) {
          width = Math.max(MIN_SIZE, start.width + deltaX);
        }
        if (resizeRef.current.handle.includes("s")) {
          height = Math.max(MIN_SIZE, start.height + deltaY);
        }
        if (resizeRef.current.handle.includes("w")) {
          width = Math.max(MIN_SIZE, start.width - deltaX);
          x = start.x + (start.width - width);
        }
        if (resizeRef.current.handle.includes("n")) {
          height = Math.max(MIN_SIZE, start.height - deltaY);
          y = start.y + (start.height - height);
        }

        if (state.snap.enabled) {
          x = roundToGrid(x, state.grid.size);
          y = roundToGrid(y, state.grid.size);
          width = Math.max(MIN_SIZE, roundToGrid(width, state.grid.size));
          height = Math.max(MIN_SIZE, roundToGrid(height, state.grid.size));
        }

        const result = snapRect(
          { x, y, width, height },
          state.objects,
          new Set([resizing.id]),
          state.grid.size,
          state.snap.enabled,
          state.plot.width,
          state.plot.height,
        );

        dispatch({ type: "set-guides", payload: { guides: result.guides } });
        dispatch({ type: "update-object", payload: { id: resizing.id, patch: result.rect } });
      }

      if (dragRef.current) {
        const dragSession = dragRef.current;
        const lead = state.objects.find((item) => item.id === dragSession.leadId);
        if (!lead || lead.locked) {
          return;
        }

        const deltaX = (event.clientX - dragSession.startPointerX) / (state.transform.zoom * unitSize);
        const deltaY = (event.clientY - dragSession.startPointerY) / (state.transform.zoom * unitSize);

        let nextLeadX = dragSession.startPositions.get(lead.id)?.x ?? lead.x;
        let nextLeadY = dragSession.startPositions.get(lead.id)?.y ?? lead.y;
        nextLeadX += deltaX;
        nextLeadY += deltaY;

        const snapResult = snapRect(
          { x: nextLeadX, y: nextLeadY, width: lead.width, height: lead.height },
          state.objects,
          new Set(dragSession.ids),
          state.grid.size,
          state.snap.enabled,
          state.plot.width,
          state.plot.height,
        );

        const finalDeltaX = snapResult.rect.x - (dragSession.startPositions.get(lead.id)?.x ?? lead.x);
        const finalDeltaY = snapResult.rect.y - (dragSession.startPositions.get(lead.id)?.y ?? lead.y);

        dispatch({ type: "set-guides", payload: { guides: snapResult.guides } });
        dispatch({
          type: "update-many",
          payload: {
            patches: dragSession.ids.map((id) => {
              const startPosition = dragSession.startPositions.get(id) ?? { x: 0, y: 0 };
              return {
                id,
                patch: {
                  x: startPosition.x + finalDeltaX,
                  y: startPosition.y + finalDeltaY,
                },
              };
            }),
          },
        });
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
    [dispatch, screenToWorld, state.grid.size, state.objects, state.plot.height, state.plot.width, state.snap.enabled, state.transform.zoom, unitSize],
  );

  const stopInteractions = useCallback(() => {
    dragRef.current = null;
    resizeRef.current = null;
    panRef.current = null;
    setIsPanning(false);
    dispatch({ type: "set-guides", payload: { guides: [] } });
  }, [dispatch]);

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
        dispatch({ type: "set-selection", payload: { ids: [] } });
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

      const isShift = event.shiftKey;
      const selected = state.selectedIds.includes(object.id);
      let nextSelection = state.selectedIds;

      if (isShift) {
        nextSelection = selected ? state.selectedIds.filter((id) => id !== object.id) : [...state.selectedIds, object.id];
      } else if (!selected || state.selectedIds.length > 1) {
        nextSelection = [object.id];
      }

      dispatch({ type: "set-selection", payload: { ids: nextSelection } });

      const ids = nextSelection.includes(object.id) ? nextSelection : [object.id];
      const startPositions = new Map(ids.map((id) => {
        const target = state.objects.find((item) => item.id === id);
        return [id, { x: target?.x ?? 0, y: target?.y ?? 0 }] as const;
      }));

      dragRef.current = {
        ids,
        leadId: object.id,
        startPointerX: event.clientX,
        startPointerY: event.clientY,
        startPositions,
      };
    },
    [dispatch, state.objects, state.selectedIds],
  );

  const onResizeHandlePointerDown = useCallback(
    (event: PointerEvent<HTMLButtonElement>, object: EditorObject, handle: ResizeHandle) => {
      event.stopPropagation();
      resizeRef.current = {
        id: object.id,
        handle,
        startPointerX: event.clientX,
        startPointerY: event.clientY,
        startRect: {
          x: object.x,
          y: object.y,
          width: object.width,
          height: object.height,
        },
      };
    },
    [],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        setSpacePressed(true);
      }

      if (focusedOnFormField()) {
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) {
          dispatch({ type: "redo" });
        } else {
          dispatch({ type: "undo" });
        }
        return;
      }

      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        dispatch({ type: "delete-selected" });
        return;
      }

      const moveAmount = event.shiftKey ? 1 : 0.2;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key) && state.selectedIds.length) {
        event.preventDefault();
        const deltaX = event.key === "ArrowLeft" ? -moveAmount : event.key === "ArrowRight" ? moveAmount : 0;
        const deltaY = event.key === "ArrowUp" ? -moveAmount : event.key === "ArrowDown" ? moveAmount : 0;
        dispatch({ type: "move-selection", payload: { ids: state.selectedIds, deltaX, deltaY } });
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
  }, [dispatch, state.selectedIds]);

  useEffect(() => {
    window.addEventListener("pointerup", stopInteractions);
    return () => window.removeEventListener("pointerup", stopInteractions);
  }, [stopInteractions]);

  return {
    onWheel,
    onPointerMove,
    onViewportPointerDown,
    onObjectPointerDown,
    onResizeHandlePointerDown,
    isPanning,
    screenToWorld,
  };
}
