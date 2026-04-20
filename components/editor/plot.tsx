"use client";

import { useEffect, useRef } from "react";

import { useEditor } from "@/components/editor/editor-context";
import { ObjectLayer } from "@/components/editor/object-layer";
import { useEditorInteractions } from "@/components/editor/use-editor-interactions";

const UNIT_SIZE = 32;

export function Plot() {
  const { state, dispatch } = useEditor();
  const viewportRef = useRef<HTMLDivElement>(null);

  const { onObjectPointerDown, onPointerMove, onViewportPointerDown, onWheel, isPanning, onResizeHandlePointerDown } =
    useEditorInteractions({
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
        className="relative h-full w-full overflow-hidden "
        onWheel={onWheel}
        onPointerDown={onViewportPointerDown}
        onPointerMove={onPointerMove}
      >
        <div
          data-export-hide="true"
          className="absolute left-3.5 top-3 rounded-md bg-black/12 px-2 py-0.5 text-[9px] uppercase tracking-[0.16em] text-muted-foreground/52">
          Plot
        </div>

        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{
            transform: `translate(${state.transform.panX}px, ${state.transform.panY}px) scale(${state.transform.zoom})`,
          }}
        >
          <div
            data-export-plot-root="true"
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
              selectedIds={state.selectedIds}
              unitSize={UNIT_SIZE}
              onObjectPointerDown={onObjectPointerDown}
              onResizeHandlePointerDown={onResizeHandlePointerDown}
            />

            {state.guides.map((guide) =>
              guide.axis === "x" ? (
                <div
                  key={guide.id}
                  data-export-hide="true"
                  className="pointer-events-none absolute w-px bg-cyan-300/80"
                  style={{
                    left: guide.position * UNIT_SIZE,
                    top: guide.start * UNIT_SIZE,
                    height: Math.max(1, (guide.end - guide.start) * UNIT_SIZE),
                  }}
                />
              ) : (
                <div
                  key={guide.id}
                  data-export-hide="true"
                  className="pointer-events-none absolute h-px bg-cyan-300/80"
                  style={{
                    left: guide.start * UNIT_SIZE,
                    top: guide.position * UNIT_SIZE,
                    width: Math.max(1, (guide.end - guide.start) * UNIT_SIZE),
                  }}
                />
              ),
            )}
          </div>
        </div>

        <div
          data-export-hide="true"
          className="pointer-events-none absolute bottom-3 left-3 rounded bg-black/20 px-2 py-1 text-[10px] text-muted-foreground/70">
          {isPanning ? "Panning" : "Select / Multi-select / Resize"}
        </div>
      </div>
    </div>
  );
}
