"use client";

import { Grid3X3, Magnet, MousePointerClick } from "lucide-react";

import { useEditor } from "@/components/editor/editor-context";

export function StatusBar() {
  const { state } = useEditor();
  const selected = state.objects.find((item) => item.id === state.selectedId);

  return (
    <footer className="flex h-8 items-center justify-between bg-[#0c121a]/52 px-4 text-[11px] text-muted-foreground/62 backdrop-blur-md">
      <div className="flex items-center gap-3.5">
        <span className="font-medium text-muted-foreground/68">{Math.round(state.transform.zoom * 100)}% Zoom</span>
        <span>
          Coordinates X {state.cursor.x.toFixed(2)}m, Y {state.cursor.y.toFixed(2)}m
        </span>
        <span>Selection {selected ? selected.label : "None"}</span>
      </div>
      <div className="flex items-center gap-2.5">
        <span className="inline-flex items-center gap-1.5">
          <Grid3X3 className="h-3 w-3" /> Grid {state.grid.visible ? "On" : "Off"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Magnet className="h-3 w-3" /> Snap {state.snap.enabled ? "On" : "Off"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MousePointerClick className="h-3 w-3" /> Select Tool
        </span>
      </div>
    </footer>
  );
}
