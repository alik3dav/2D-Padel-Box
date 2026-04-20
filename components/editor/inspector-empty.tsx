import { Focus } from "lucide-react";

export function InspectorEmpty() {
  return (
    <div className="flex h-52 flex-col items-center justify-center rounded-lg border border-dashed border-border/80 bg-muted/20 p-4 text-center">
      <div className="mb-3 rounded-full border border-border/70 bg-muted/40 p-2.5 text-muted-foreground">
        <Focus className="h-4 w-4" />
      </div>
      <h3 className="text-sm font-semibold">No selection</h3>
      <p className="mt-1 max-w-52 text-xs text-muted-foreground">
        Select an element in the workspace to edit its properties.
      </p>
    </div>
  );
}
