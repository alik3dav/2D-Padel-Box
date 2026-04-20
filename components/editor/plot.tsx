export function Plot() {
  return (
    <div className="flex h-full w-full items-center justify-center p-7">
      <div className="relative h-[80%] w-[78%] max-h-[720px] max-w-[1080px] rounded-xl border border-primary/25 bg-[#09101a]/85 shadow-[0_16px_60px_rgba(0,0,0,0.42),inset_0_0_0_1px_rgba(255,255,255,0.03)]">
        <div className="absolute inset-0 rounded-xl border border-white/5" />
        <div className="absolute left-3.5 top-3 rounded-md border border-border/60 bg-background/65 px-2 py-0.5 text-[11px] uppercase tracking-[0.14em] text-muted-foreground/90">
          Plot
        </div>
        <div className="flex h-full items-center justify-center">
          <div className="flex max-w-sm flex-col items-center text-center">
            <div className="mb-4 rounded-xl border border-border/65 bg-card/45 p-2.5 text-muted-foreground">
              <div className="h-5 w-5 rounded border border-border/70 bg-muted/35" />
            </div>
            <p className="text-base font-semibold tracking-tight text-foreground/95">Ready to design your club</p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              Add courts, structures, and amenities from the left panel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
