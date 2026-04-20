import { Plot } from "@/components/editor/plot";

export function Workspace() {
  return (
    <main className="relative flex h-full flex-1 overflow-hidden bg-[#0d1016]">
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative z-10 h-full w-full p-6">
        <div className="h-full rounded-xl border border-border/70 bg-slate-950/45">
          <Plot />
        </div>
      </div>
    </main>
  );
}
