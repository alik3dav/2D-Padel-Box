"use client";

import { useMemo, useState } from "react";
import { Copy, FolderOpen, Pencil, Search, Trash2 } from "lucide-react";

import { useProjects } from "@/components/editor/editor-context";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { ProjectSummary } from "@/lib/project-types";

function ProjectRow({
  project,
  onOpen,
  onRename,
  onDuplicate,
  onDelete,
}: {
  project: ProjectSummary;
  onOpen: () => void;
  onRename: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-lg border border-white/8 bg-[#0f1722] p-3">
      <div className="mb-1 flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-foreground/92">{project.name}</p>
        <p className="text-[11px] text-muted-foreground/72">{new Date(project.updatedAt).toLocaleString()}</p>
      </div>
      <p className="mb-3 text-xs text-muted-foreground/75">
        Plot {project.plot.width}m × {project.plot.height}m • {project.objectCount} objects
      </p>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" className="h-7 text-[11px]" onClick={onOpen}>
          <FolderOpen className="h-3.5 w-3.5" /> Open
        </Button>
        <Button size="sm" variant="secondary" className="h-7 text-[11px]" onClick={onRename}>
          <Pencil className="h-3.5 w-3.5" /> Rename
        </Button>
        <Button size="sm" variant="secondary" className="h-7 text-[11px]" onClick={onDuplicate}>
          <Copy className="h-3.5 w-3.5" /> Duplicate
        </Button>
        <Button size="sm" variant="destructive" className="h-7 text-[11px]" onClick={onDelete}>
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </Button>
      </div>
    </div>
  );
}

export function ProjectManagerDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { projects, openProject, renameProjectById, duplicateProject, deleteProject } = useProjects();
  const [search, setSearch] = useState("");

  const [renameTarget, setRenameTarget] = useState<ProjectSummary | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [duplicateTarget, setDuplicateTarget] = useState<ProjectSummary | null>(null);
  const [duplicateValue, setDuplicateValue] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<ProjectSummary | null>(null);

  const filteredProjects = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return projects;
    }

    return projects.filter((project) => project.name.toLowerCase().includes(term));
  }, [projects, search]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Project Manager</DialogTitle>
            <DialogDescription>Open, rename, duplicate, or delete browser-local projects.</DialogDescription>
          </DialogHeader>

          <div className="relative">
            <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-muted-foreground/60" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search projects..."
              className="bg-[#0d141d] pl-8"
            />
          </div>

          <div className="max-h-[48vh] space-y-2 overflow-y-auto pr-1">
            {filteredProjects.length ? (
              filteredProjects.map((project) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  onOpen={() => {
                    openProject(project.id);
                    onOpenChange(false);
                  }}
                  onRename={() => {
                    setRenameTarget(project);
                    setRenameValue(project.name);
                  }}
                  onDuplicate={() => {
                    setDuplicateTarget(project);
                    setDuplicateValue(`${project.name} Copy`);
                  }}
                  onDelete={() => setDeleteTarget(project)}
                />
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-white/10 py-10 text-center text-sm text-muted-foreground/78">
                No local projects yet.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(renameTarget)} onOpenChange={(next) => !next && setRenameTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Rename Project</DialogTitle>
          </DialogHeader>
          <Input value={renameValue} onChange={(event) => setRenameValue(event.target.value)} autoFocus />
          <DialogFooter>
            <Button variant="secondary" onClick={() => setRenameTarget(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!renameTarget) {
                  return;
                }
                renameProjectById(renameTarget.id, renameValue);
                setRenameTarget(null);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(duplicateTarget)} onOpenChange={(next) => !next && setDuplicateTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Duplicate Project</DialogTitle>
          </DialogHeader>
          <Input value={duplicateValue} onChange={(event) => setDuplicateValue(event.target.value)} autoFocus />
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDuplicateTarget(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!duplicateTarget) {
                  return;
                }
                duplicateProject(duplicateTarget.id, duplicateValue);
                setDuplicateTarget(null);
              }}
            >
              Duplicate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deleteTarget)} onOpenChange={(next) => !next && setDeleteTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              This permanently removes <span className="font-medium text-foreground">{deleteTarget?.name}</span> from local storage.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (!deleteTarget) {
                  return;
                }
                deleteProject(deleteTarget.id);
                setDeleteTarget(null);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
