"use client";

import { useEffect, useRef } from "react";

import { useEditor } from "@/components/editor/editor-context";
import { ObjectLayer } from "@/components/editor/object-layer";
import { useEditorInteractions } from "@/components/editor/use-editor-interactions";

const UNIT_SIZE = 32;

export function Plot() {
  const { state, dispatch } = useEditor();
  const viewportRef = useRef<HTMLDivElement>(null);

  const { onObjectPointerDown, onPointerMove, onViewportPointerDown, onWheel, isPanning } = useEditorInteractions({
    viewportRef,
    unitSize: UNIT_SIZE,
  });

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    const fitOnce = () => {
      const worldWidth = state.plot.width * UNIT_SIZE;
      const worldHeight = state.plot.height * UNIT_SIZE;
      const padding = 80;
      const zoomX = (viewport.clientWidth - padding) / worldWidth;
      const zoomY = (viewport.clientHeight - padding) / worldHeight;
      const zoom = Math.max(0.25, Math.min(1, Math.min(zoomX, zoomY)));
      const panX = (viewport.clientWidth - worldWidth * zoom) / 2;
      const panY = (viewport.clientHeight - worldHeight * zoom) / 2;

      dispatch({
        type: "set-transform",
        payload: {
          zoom,
          panX,
          panY,
        },
      });
    };

    fitOnce();
    // intentional one-time fit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const gridSizePx = state.grid.size * UNIT_SIZE;

  return (
    <div className="h-full w-full">
      <div
        ref={viewportRef}
        className="relative h-full w-full overflow-hidden rounded-xl bg-[#101923] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.035),inset_0_16px_28px_rgba(255,255,255,0.01)]"
        onWheel={onWheel}
        onPointerDown={onViewportPointerDown}
        onPointerMove={onPointerMove}
      >
        <div
          className="absolute left-3.5 top-3 rounded-md bg-black/12 px-2 py-0.5 text-[9px] uppercase tracking-[0.16em] text-muted-foreground/52"
        >
          Plot
        </div>

        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{
            transform: `translate(${state.transform.panX}px, ${state.transform.panY}px) scale(${state.transform.zoom})`,
          }}
        >
          <div
            className="relative bg-[#0f1a25]"
            style={{
              width: state.plot.width * UNIT_SIZE,
              height: state.plot.height * UNIT_SIZE,
              backgroundImage: state.grid.visible
                ? "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)"
                : undefined,
              backgroundSize: state.grid.visible ? `${gridSizePx}px ${gridSizePx}px` : undefined,
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.09)",
            }}
          >
            <ObjectLayer
              objects={state.objects}
              selectedId={state.selectedId}
              unitSize={UNIT_SIZE}
              onObjectPointerDown={onObjectPointerDown}
            />
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-3 left-3 rounded bg-black/20 px-2 py-1 text-[10px] text-muted-foreground/70">
          {isPanning ? "Panning" : "Select & Drag"}
        </div>
      </div>
    </div>
  );
}
