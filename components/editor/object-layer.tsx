import { memo, type PointerEvent } from "react";

import { OBJECT_LABELS } from "@/lib/editor-catalog";
import type { EditorObject } from "@/lib/editor-types";
import { cn } from "@/lib/utils";

type ObjectLayerProps = {
  objects: EditorObject[];
  selectedId: string | null;
  unitSize: number;
  onObjectPointerDown: (event: PointerEvent<HTMLDivElement>, object: EditorObject) => void;
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

function ObjectLayerImpl({ objects, selectedId, unitSize, onObjectPointerDown }: ObjectLayerProps) {
  return (
    <>
      {objects.map((item) => {
        const selected = selectedId === item.id;
        return (
          <div
            key={item.id}
            role="button"
            tabIndex={0}
            onPointerDown={(event) => onObjectPointerDown(event, item)}
            className={cn(
              "absolute flex cursor-grab select-none items-center justify-center rounded-[6px] border text-[10px] font-medium text-white/90 shadow-[0_2px_16px_rgba(0,0,0,0.16)]",
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
            }}
          >
            <span className="pointer-events-none px-1 text-center leading-tight text-[10px] text-foreground/90">
              {item.label ?? OBJECT_LABELS[item.type]}
            </span>
          </div>
        );
      })}
    </>
  );
}

export const ObjectLayer = memo(ObjectLayerImpl);
