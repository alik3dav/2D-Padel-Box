import { Focus } from "lucide-react";

export function InspectorEmpty() {
  return (
    <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed border-border/70 bg-background/20 p-4 text-center">
      <div className="mb-3 rounded-xl border border-border/65 bg-card/40 p-2.5 text-muted-foreground shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]">
        <Focus className="h-4 w-4" />
      </div>
      <h3 className="text-sm font-semibold tracking-tight text-foreground/95">No selection</h3>
      <p className="mt-1.5 max-w-56 text-xs leading-relaxed text-muted-foreground">
        Select an element in the workspace to edit its properties.
      </p>
    </div>
  );
}
