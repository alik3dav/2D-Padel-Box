import { Grid3X3, Magnet, MousePointerClick } from "lucide-react";

export function StatusBar() {
  return (
    <footer className="flex h-8 items-center justify-between bg-[#0c121a]/52 px-4 text-[11px] text-muted-foreground/62 backdrop-blur-md">
      <div className="flex items-center gap-3.5">
        <span className="font-medium text-muted-foreground/68">100% Zoom</span>
        <span>Coordinates X 0.0m, Y 0.0m</span>
        <span>Selection None</span>
      </div>
      <div className="flex items-center gap-2.5">
        <span className="inline-flex items-center gap-1.5">
          <Grid3X3 className="h-3 w-3" /> Grid On
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Magnet className="h-3 w-3" /> Snap On
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MousePointerClick className="h-3 w-3" /> Select Tool
        </span>
      </div>
    </footer>
  );
}
