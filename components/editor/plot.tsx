export function Plot() {
  return (
    <div className="flex h-full w-full items-center justify-center p-7">
      <div className="relative h-[80%] w-[78%] max-h-[720px] max-w-[1080px] rounded-xl bg-[#101923] shadow-[0_16px_40px_rgba(0,0,0,0.26)]">
        <div className="absolute inset-0 rounded-xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.035),inset_0_16px_28px_rgba(255,255,255,0.01)]" />
        <div className="absolute left-3.5 top-3 rounded-md bg-black/12 px-2 py-0.5 text-[9px] uppercase tracking-[0.16em] text-muted-foreground/52">
          Plot
        </div>
        <div className="flex h-full items-center justify-center">
          <div className="flex max-w-sm flex-col items-center text-center">
            <div className="mb-4 rounded-lg bg-white/[0.02] p-2.5 text-muted-foreground/55">
              <div className="h-6 w-6 rounded bg-white/[0.07]" />
            </div>
            <p className="text-base font-semibold tracking-tight text-foreground/93">Ready to design your club</p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground/70">
              Add courts, structures, and amenities from the left panel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
