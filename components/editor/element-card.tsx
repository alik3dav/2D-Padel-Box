"use client";

import { type ReactNode } from "react";

import { Plus } from "lucide-react";

import { useEditor } from "@/components/editor/editor-context";
import type { EditorObjectType } from "@/lib/editor-types";
import { cn } from "@/lib/utils";

type ElementCardProps = {
  name: string;
  type: EditorObjectType;
  icon: ReactNode;
};

export function ElementCard({ name, type, icon }: ElementCardProps) {
  const { dispatch } = useEditor();

  return (
    <button
      type="button"
      onClick={() => dispatch({ type: "add-object", payload: { type } })}
      className={cn(
        "group flex w-full items-start gap-2 rounded-lg bg-transparent px-2 py-1.5 text-left transition duration-150",
        "hover:bg-white/[0.045] active:bg-primary/12",
      )}
    >
      <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-md bg-white/[0.025] text-muted-foreground/90 transition-colors group-hover:text-foreground/95 group-active:text-primary/90">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-[11px] font-medium leading-snug text-foreground/90">{name}</p>
      </div>
      <Plus className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground/75 opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  );
}
