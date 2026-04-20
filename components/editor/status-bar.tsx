import { Grid3X3, Magnet, MousePointerClick } from "lucide-react";

export function StatusBar() {
  return (
    <footer className="flex h-9 items-center justify-between border-t border-border/80 bg-card/50 px-4 text-xs text-muted-foreground">
      <div className="flex items-center gap-4">
        <span>Zoom: 100%</span>
        <span>Coordinates: X 0.0m, Y 0.0m</span>
        <span>Selection: None</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5">
          <Grid3X3 className="h-3.5 w-3.5" /> Grid: On
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Magnet className="h-3.5 w-3.5" /> Snap: On
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MousePointerClick className="h-3.5 w-3.5" /> Select tool
        </span>
      </div>
    </footer>
  );
}
