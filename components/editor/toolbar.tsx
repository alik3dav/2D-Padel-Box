"use client";

import { type ReactNode, useState } from "react";

import { FolderOpen, Grid3X3, Maximize, Minus, MousePointer2, Plus, Redo2, Magnet, Save, Undo2 } from "lucide-react";

import { ProjectManagerDialog } from "@/components/editor/project-manager-dialog";
import { useEditor, useProjects } from "@/components/editor/editor-context";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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

const saveText: Record<ReturnType<typeof useProjects>["saveStatus"], string> = {
  saved: "Saved",
  saving: "Saving…",
  unsaved: "Unsaved changes",
};

export function Toolbar() {
  const { state, dispatch } = useEditor();
  const { currentProjectName, hasUnsavedChanges, createNewProject, renameCurrentProject, saveProject, saveStatus } = useProjects();

  const [isProjectManagerOpen, setIsProjectManagerOpen] = useState(false);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [isUnsavedDialogOpen, setIsUnsavedDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [renameValue, setRenameValue] = useState("");

  const requestNewProject = () => {
    if (hasUnsavedChanges) {
      setIsUnsavedDialogOpen(true);
      return;
    }

    setNewProjectName("Untitled Project");
    setIsNewDialogOpen(true);
  };

  return (
    <>
      <header className="flex h-12 items-center justify-between bg-[#0d141d]/92 px-4 shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)] backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 rounded-lg bg-white/[0.035] px-2.5 py-1.5">
            <div className="rounded-md bg-primary/20 p-1.5 text-primary/90">
              <MousePointer2 className="h-4 w-4" />
            </div>
            <button
              type="button"
              onClick={() => {
                setRenameValue(currentProjectName);
                setIsRenameDialogOpen(true);
              }}
              className="text-left"
            >
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground/68">Project</p>
              <p className="text-xs font-medium tracking-tight text-foreground/90">{currentProjectName}</p>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" className="h-8 text-xs" onClick={requestNewProject}>
              New
            </Button>
            <Button size="sm" variant="secondary" className="h-8 text-xs" onClick={() => setIsProjectManagerOpen(true)}>
              <FolderOpen className="h-4 w-4" /> Load
            </Button>
            <Button size="sm" className="h-8 text-xs" onClick={saveProject}>
              <Save className="h-4 w-4" /> Save
            </Button>
          </div>
        </div>

        <TooltipProvider delayDuration={120}>
          <div className="flex items-center gap-1 rounded-lg bg-white/[0.03] p-1">
            <span className="mr-1 min-w-[96px] text-right text-[11px] text-muted-foreground/72">{saveText[saveStatus]}</span>
            <Separator orientation="vertical" className="mx-1 h-5 bg-white/8" />
            <ToolbarIconButton
              icon={<Undo2 className="h-4 w-4" />}
              label="Undo"
              onClick={() => dispatch({ type: "undo" })}
            />
            <ToolbarIconButton
              icon={<Redo2 className="h-4 w-4" />}
              label="Redo"
              onClick={() => dispatch({ type: "redo" })}
            />
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

      <ProjectManagerDialog open={isProjectManagerOpen} onOpenChange={setIsProjectManagerOpen} />

      <Dialog open={isUnsavedDialogOpen} onOpenChange={setIsUnsavedDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Unsaved changes</DialogTitle>
            <DialogDescription>Create a new project and replace the current canvas?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsUnsavedDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setIsUnsavedDialogOpen(false);
                setNewProjectName("Untitled Project");
                setIsNewDialogOpen(true);
              }}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New project</DialogTitle>
            <DialogDescription>Name your new local browser project.</DialogDescription>
          </DialogHeader>
          <Input value={newProjectName} onChange={(event) => setNewProjectName(event.target.value)} autoFocus />
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsNewDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                createNewProject(newProjectName);
                setIsNewDialogOpen(false);
              }}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Rename project</DialogTitle>
          </DialogHeader>
          <Input value={renameValue} onChange={(event) => setRenameValue(event.target.value)} autoFocus />
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                renameCurrentProject(renameValue);
                setIsRenameDialogOpen(false);
              }}
            >
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
