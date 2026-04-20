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
          className="h-8 w-8 rounded-md text-muted-foreground/85 hover:bg-white/[0.05] hover:text-foreground/95"
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

        <Separator orientation="vertical" className="h-6 bg-white/8" />

        <div className="flex items-center gap-1.5 p-0.5">
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
                  className="h-7 rounded-md px-2.5 text-xs font-medium text-muted-foreground/82 hover:bg-white/[0.05] hover:text-foreground/92"
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
        <div className="flex items-center gap-1 rounded-lg bg-white/[0.03] p-1">
          <ToolbarIconButton icon={<Undo2 className="h-4 w-4" />} label="Undo" />
          <ToolbarIconButton icon={<Redo2 className="h-4 w-4" />} label="Redo" />
          <Separator orientation="vertical" className="mx-1 h-5 bg-white/8" />
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
