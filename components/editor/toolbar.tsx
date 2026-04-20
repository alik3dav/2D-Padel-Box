"use client";

import {
  Grid3X3,
  Maximize,
  Minus,
  MousePointer2,
  Plus,
  Redo2,
  Magnet,
  Undo2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function ToolbarIconButton({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-md border border-transparent text-muted-foreground/90 hover:border-border/70 hover:bg-muted/40 hover:text-foreground"
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function Toolbar() {
  return (
    <header className="flex h-12 items-center justify-between border-b border-border/70 bg-[#0b1018]/95 px-3 backdrop-blur">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-card/45 px-2.5 py-1.5">
          <div className="rounded-md border border-primary/20 bg-primary/15 p-1.5 text-primary">
            <MousePointer2 className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground/80">Project</p>
            <p className="text-xs font-semibold tracking-tight text-foreground/95">Padel Club Layout v1</p>
          </div>
        </div>

        <Separator orientation="vertical" className="h-6 bg-border/60" />

        <div className="flex items-center gap-1 rounded-md border border-border/60 bg-card/35 p-1">
          {[
            { name: "File", actions: ["New", "Save", "Load", "Export"] },
            { name: "Edit", actions: ["Undo", "Redo"] },
            { name: "View", actions: ["Show Grid", "Show Rulers", "Reset Zoom"] },
          ].map((menu) => (
            <DropdownMenu key={menu.name}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 rounded-md px-2.5 text-xs font-medium text-muted-foreground hover:bg-muted/45 hover:text-foreground"
                >
                  {menu.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {menu.actions.map((action) => (
                  <DropdownMenuItem key={action}>{action}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </div>
      </div>

      <TooltipProvider delayDuration={120}>
        <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-card/35 p-1">
          <ToolbarIconButton icon={<Undo2 className="h-4 w-4" />} label="Undo" />
          <ToolbarIconButton icon={<Redo2 className="h-4 w-4" />} label="Redo" />
          <Separator orientation="vertical" className="mx-0.5 h-5 bg-border/60" />
          <ToolbarIconButton icon={<Plus className="h-4 w-4" />} label="Zoom in" />
          <ToolbarIconButton icon={<Minus className="h-4 w-4" />} label="Zoom out" />
          <ToolbarIconButton icon={<Maximize className="h-4 w-4" />} label="Fit to screen" />
          <ToolbarIconButton icon={<Grid3X3 className="h-4 w-4" />} label="Grid toggle" />
          <ToolbarIconButton icon={<Magnet className="h-4 w-4" />} label="Snap toggle" />
        </div>
      </TooltipProvider>
    </header>
  );
}
