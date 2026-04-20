export function Plot() {
  return (
    <div className="flex h-full w-full items-center justify-center p-7">
      <div className="relative h-[80%] w-[78%] max-h-[720px] max-w-[1080px] rounded-xl bg-[#09101a]/72 shadow-[0_14px_45px_rgba(0,0,0,0.35)]">
        <div className="absolute inset-0 rounded-xl border border-white/10" />
        <div className="absolute left-3.5 top-3 rounded-md bg-black/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground/65">
          Plot
        </div>
        <div className="flex h-full items-center justify-center">
          <div className="flex max-w-sm flex-col items-center text-center">
            <div className="mb-4 rounded-lg bg-white/[0.03] p-2 text-muted-foreground/75">
              <div className="h-5 w-5 rounded bg-white/[0.08]" />
            </div>
            <p className="text-base font-medium tracking-tight text-foreground/90">Ready to design your club</p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground/75">
              Add courts, structures, and amenities from the left panel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
