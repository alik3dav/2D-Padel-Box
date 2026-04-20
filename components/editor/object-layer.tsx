import { memo, type CSSProperties, type PointerEvent } from "react";

import { OBJECT_LABELS } from "@/lib/editor-catalog";
import { objectSvgBackgrounds } from "@/lib/object-svg-assets";
import type { EditorObject } from "@/lib/editor-types";
import { cn } from "@/lib/utils";

type ResizeHandle = "nw" | "ne" | "sw" | "se";

type ObjectLayerProps = {
  objects: EditorObject[];
  selectedIds: string[];
  unitSize: number;
  onObjectPointerDown: (event: PointerEvent<HTMLDivElement>, object: EditorObject) => void;
  onResizeHandlePointerDown: (event: PointerEvent<HTMLButtonElement>, object: EditorObject, handle: ResizeHandle) => void;
};

const objectStyles: Record<string, string> = {
  "padel-court": "bg-emerald-500/12 border-emerald-300/40",
  "single-court": "bg-teal-500/12 border-teal-300/40",
  wall: "bg-slate-200/20 border-slate-100/40",
  "glass-wall": "bg-cyan-300/10 border-cyan-200/45",
  door: "bg-amber-300/20 border-amber-200/45",
  column: "bg-zinc-300/25 border-zinc-100/50",
  stairs: "bg-violet-400/18 border-violet-300/40",
  reception: "bg-orange-400/16 border-orange-300/40",
  lounge: "bg-pink-400/16 border-pink-300/40",
  lockers: "bg-sky-400/16 border-sky-300/40",
  storage: "bg-indigo-400/16 border-indigo-300/40",
  cafe: "bg-red-400/16 border-red-300/40",
  toilets: "bg-blue-400/16 border-blue-300/40",
  parking: "bg-lime-500/14 border-lime-300/35",
  "custom-zone": "bg-white/10 border-white/25",
  "text-label": "bg-transparent border-dashed border-white/25",
};

const handles: Array<{ handle: ResizeHandle; className: string }> = [
  { handle: "nw", className: "-left-1 -top-1 cursor-nwse-resize" },
  { handle: "ne", className: "-right-1 -top-1 cursor-nesw-resize" },
  { handle: "sw", className: "-bottom-1 -left-1 cursor-nesw-resize" },
  { handle: "se", className: "-bottom-1 -right-1 cursor-nwse-resize" },
];

function getObjectVisualStyle(type: EditorObject["type"]): CSSProperties {
  const backgroundImage = objectSvgBackgrounds[type];
  if (!backgroundImage) {
    return {};
  }

  return {
    backgroundImage,
    backgroundSize: "100% 100%",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  };
}

function ObjectLayerImpl({
  objects,
  selectedIds,
  unitSize,
  onObjectPointerDown,
  onResizeHandlePointerDown,
}: ObjectLayerProps) {
  const selectedSet = new Set(selectedIds);
  const sorted = [...objects].sort((a, b) => a.zIndex - b.zIndex);
  const singleSelection = selectedIds.length === 1 ? selectedIds[0] : null;

  return (
    <>
      {sorted.map((item) => {
        const selected = selectedSet.has(item.id);
        const showHandles = singleSelection === item.id;

        return (
          <div
            key={item.id}
            role="button"
            tabIndex={0}
            onPointerDown={(event) => onObjectPointerDown(event, item)}
            data-export-selection={selected ? "true" : undefined}
            className={cn(
              "absolute flex cursor-grab select-none items-center justify-center overflow-hidden rounded-[6px] border text-[10px] font-medium text-white/90 shadow-[0_2px_16px_rgba(0,0,0,0.16)]",
              objectStyles[item.type],
              selected && "ring-1 ring-primary/80 ring-offset-1 ring-offset-[#0e1620]",
              item.locked && "cursor-not-allowed opacity-60",
            )}
            style={{
              left: item.x * unitSize,
              top: item.y * unitSize,
              width: Math.max(8, item.width * unitSize),
              height: Math.max(8, item.height * unitSize),
              transform: `rotate(${item.rotation}deg)`,
              zIndex: item.zIndex,
              ...getObjectVisualStyle(item.type),
            }}
          >
            <span className="pointer-events-none px-1 text-center leading-tight text-[10px] text-foreground/95 drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]">
              {item.label ?? OBJECT_LABELS[item.type]}
            </span>

            {showHandles &&
              handles.map((entry) => (
                <button
                  key={entry.handle}
                  type="button"
                  data-export-handle="true"
                  className={cn(
                    "absolute h-2.5 w-2.5 rounded-full border border-white/70 bg-[#1b2a39] shadow-sm",
                    entry.className,
                  )}
                  onPointerDown={(event) => onResizeHandlePointerDown(event, item, entry.handle)}
                />
              ))}
          </div>
        );
      })}
    </>
  );
}

export const ObjectLayer = memo(ObjectLayerImpl);
