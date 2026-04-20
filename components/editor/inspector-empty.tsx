import { Focus } from "lucide-react";

export function InspectorEmpty() {
  return (
    <div className="flex h-40 flex-col items-center justify-center rounded-lg bg-background/20 p-4 text-center">
      <div className="mb-3 rounded-lg bg-white/[0.04] p-2 text-muted-foreground/80">
        <Focus className="h-4 w-4" />
      </div>
      <h3 className="text-sm font-medium tracking-tight text-foreground/90">No selection</h3>
      <p className="mt-1.5 max-w-56 text-xs leading-relaxed text-muted-foreground/80">
        Select an element in the workspace to edit its properties.
      </p>
    </div>
  );
}
