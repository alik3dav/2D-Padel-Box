"use client";

import { type ReactNode } from "react";

import { Grid3X3, Maximize, Minus, MousePointer2, Plus, Redo2, Magnet, Undo2 } from "lucide-react";

import { useEditor } from "@/components/editor/editor-context";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

function ToolbarIconButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClick}
          className={cn(
            "h-8 w-8 rounded-md text-muted-foreground/85 hover:bg-white/[0.05] hover:text-foreground/95",
            active && "bg-primary/20 text-primary hover:bg-primary/25",
          )}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function Toolbar() {
  const { state, dispatch } = useEditor();

  return (
    <header className="flex h-12 items-center justify-between bg-[#0d141d]/92 px-4 shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)] backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 rounded-lg bg-white/[0.035] px-2.5 py-1.5">
          <div className="rounded-md bg-primary/20 p-1.5 text-primary/90">
            <MousePointer2 className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground/68">Project</p>
            <p className="text-xs font-medium tracking-tight text-foreground/90">Padel Club Layout v1</p>
          </div>
        </div>
      </div>

      <TooltipProvider delayDuration={120}>
        <div className="flex items-center gap-1 rounded-lg bg-white/[0.03] p-1">
          <ToolbarIconButton icon={<Undo2 className="h-4 w-4" />} label="Undo (phase 3)" />
          <ToolbarIconButton icon={<Redo2 className="h-4 w-4" />} label="Redo (phase 3)" />
          <Separator orientation="vertical" className="mx-1 h-5 bg-white/8" />
          <ToolbarIconButton
            icon={<Plus className="h-4 w-4" />}
            label="Zoom in"
            onClick={() => dispatch({ type: "set-transform", payload: { zoom: state.transform.zoom * 1.1 } })}
          />
          <ToolbarIconButton
            icon={<Minus className="h-4 w-4" />}
            label="Zoom out"
            onClick={() => dispatch({ type: "set-transform", payload: { zoom: state.transform.zoom * 0.9 } })}
          />
          <ToolbarIconButton
            icon={<Maximize className="h-4 w-4" />}
            label="Reset zoom"
            onClick={() => dispatch({ type: "set-transform", payload: { zoom: 1 } })}
          />
          <ToolbarIconButton
            icon={<Grid3X3 className="h-4 w-4" />}
            label="Grid toggle"
            active={state.grid.visible}
            onClick={() => dispatch({ type: "toggle-grid" })}
          />
          <ToolbarIconButton
            icon={<Magnet className="h-4 w-4" />}
            label="Snap toggle"
            active={state.snap.enabled}
            onClick={() => dispatch({ type: "toggle-snap" })}
          />
        </div>
      </TooltipProvider>
    </header>
  );
}
