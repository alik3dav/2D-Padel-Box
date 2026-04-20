export function Plot() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="relative h-[80%] w-[78%] max-h-[720px] max-w-[1080px] rounded-xl border border-primary/30 bg-slate-900/55 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]">
        <div className="absolute inset-0 rounded-xl border border-white/5" />
        <div className="absolute left-3 top-2 rounded bg-background/70 px-2 py-0.5 text-xs text-muted-foreground">
          Plot Area
        </div>
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <p className="text-sm font-medium text-foreground/90">Ready to design your club</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Add courts, structures, and amenities from the left panel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
