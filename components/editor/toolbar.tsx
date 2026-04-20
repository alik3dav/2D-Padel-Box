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
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function Toolbar() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border/80 bg-card/50 px-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-primary/20 p-1.5 text-primary">
            <MousePointer2 className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Project</p>
            <p className="text-sm font-semibold">Padel Club Layout v1</p>
          </div>
        </div>

        <Separator orientation="vertical" className="h-7" />

        <div className="flex items-center gap-2">
          {[
            { name: "File", actions: ["New", "Save", "Load", "Export"] },
            { name: "Edit", actions: ["Undo", "Redo"] },
          ].map((menu) => (
            <DropdownMenu key={menu.name}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-3">
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
        <div className="flex items-center gap-1">
          <ToolbarIconButton icon={<Undo2 className="h-4 w-4" />} label="Undo" />
          <ToolbarIconButton icon={<Redo2 className="h-4 w-4" />} label="Redo" />
          <Separator orientation="vertical" className="mx-1 h-7" />
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
