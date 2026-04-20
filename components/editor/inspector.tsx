"use client";

import { InspectorEmpty } from "@/components/editor/inspector-empty";
import { useEditor } from "@/components/editor/editor-context";
import type { EditorObject } from "@/lib/editor-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function Inspector() {
  const { state, dispatch } = useEditor();
  const selected = state.objects.find((item) => item.id === state.selectedIds[0]) ?? null;
  const selectedCount = state.selectedIds.length;

  const updateSelected = (patch: Partial<EditorObject>) => {
    if (!selected) {
      return;
    }
    dispatch({ type: "update-object", payload: { id: selected.id, patch } });
  };

  return (
    <aside className="flex h-full w-72 flex-col bg-[#0d141d] px-4 py-3.5 shadow-[inset_1px_0_0_rgba(255,255,255,0.03)]">
      <div className="mb-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/78">Inspector</h2>
        <p className="text-[11px] text-muted-foreground/68">Properties and plot setup</p>
      </div>

      <div className="space-y-5 overflow-y-auto pr-0.5">
        {!selected ? (
          <InspectorEmpty />
        ) : (
          <section className="space-y-3 rounded-lg bg-[#101923] p-3">
            <h3 className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground/62">Selection</h3>
            <p className="text-xs font-medium text-foreground/88">
              {selected.label} {selectedCount > 1 ? `(+${selectedCount - 1} more)` : ""}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground/72">X</Label>
                <Input
                  value={selected.x}
                  type="number"
                  step={0.1}
                  onChange={(event) => updateSelected({ x: Number(event.target.value) })}
                  className="h-8 border-transparent bg-[#111b26] text-xs focus-visible:ring-1"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground/72">Y</Label>
                <Input
                  value={selected.y}
                  type="number"
                  step={0.1}
                  onChange={(event) => updateSelected({ y: Number(event.target.value) })}
                  className="h-8 border-transparent bg-[#111b26] text-xs focus-visible:ring-1"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground/72">Width</Label>
                <Input
                  value={selected.width}
                  type="number"
                  step={0.1}
                  onChange={(event) => updateSelected({ width: Number(event.target.value) })}
                  className="h-8 border-transparent bg-[#111b26] text-xs focus-visible:ring-1"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground/72">Height</Label>
                <Input
                  value={selected.height}
                  type="number"
                  step={0.1}
                  onChange={(event) => updateSelected({ height: Number(event.target.value) })}
                  className="h-8 border-transparent bg-[#111b26] text-xs focus-visible:ring-1"
                />
              </div>
              <div className="space-y-1 col-span-2">
                <Label className="text-[11px] text-muted-foreground/72">Rotation (°)</Label>
                <Input
                  value={selected.rotation}
                  type="number"
                  step={1}
                  onChange={(event) => updateSelected({ rotation: Number(event.target.value) })}
                  className="h-8 border-transparent bg-[#111b26] text-xs focus-visible:ring-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] text-muted-foreground/72">Layer Order</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button className="h-8 text-xs" variant="secondary" onClick={() => dispatch({ type: "bring-forward" })}>
                  Bring Forward
                </Button>
                <Button className="h-8 text-xs" variant="secondary" onClick={() => dispatch({ type: "send-backward" })}>
                  Send Backward
                </Button>
              </div>
            </div>
          </section>
        )}

        <section className="space-y-3">
          <h3 className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground/62">Plot Setup</h3>
          <div className="space-y-2.5">
            <div className="space-y-1">
              <Label htmlFor="plot-width" className="text-[11px] text-muted-foreground/72">
                Width (meters)
              </Label>
              <Input
                id="plot-width"
                value={state.plot.width}
                type="number"
                step={1}
                onChange={(event) => dispatch({ type: "set-plot", payload: { width: Number(event.target.value) } })}
                className="h-8 border-transparent bg-[#111b26] text-xs focus-visible:ring-1"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="plot-height" className="text-[11px] text-muted-foreground/72">
                Height (meters)
              </Label>
              <Input
                id="plot-height"
                value={state.plot.height}
                type="number"
                step={1}
                onChange={(event) => dispatch({ type: "set-plot", payload: { height: Number(event.target.value) } })}
                className="h-8 border-transparent bg-[#111b26] text-xs focus-visible:ring-1"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="grid-size" className="text-[11px] text-muted-foreground/72">
                Grid Size (meters)
              </Label>
              <Input
                id="grid-size"
                value={state.grid.size}
                type="number"
                step={0.5}
                onChange={(event) => dispatch({ type: "set-grid-size", payload: { size: Number(event.target.value) } })}
                className="h-8 border-transparent bg-[#111b26] text-xs focus-visible:ring-1"
              />
            </div>
          </div>
        </section>

        <Separator className="bg-white/6" />
      </div>
    </aside>
  );
}
