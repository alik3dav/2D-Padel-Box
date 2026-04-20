import { Focus } from "lucide-react";

export function InspectorEmpty() {
  return (
    <div className="flex h-44 flex-col items-center justify-center rounded-lg bg-[#101923] p-4 text-center">
      <div className="mb-3 rounded-lg bg-white/[0.025] p-2.5 text-muted-foreground/62">
        <Focus className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-semibold tracking-tight text-foreground/94">No selection</h3>
      <p className="mt-1.5 max-w-56 text-xs leading-relaxed text-muted-foreground/72">
        Select an element in the workspace to edit its properties.
      </p>
    </div>
  );
}
