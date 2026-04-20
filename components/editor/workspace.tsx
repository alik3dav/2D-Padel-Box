import { Plot } from "@/components/editor/plot";

export function Workspace() {
  return (
    <main className="relative flex h-full flex-1 overflow-hidden bg-[#0b1119]">
      <div
        className="absolute inset-0 opacity-45"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.03),transparent_48%)]" />
      <div className="relative z-10 h-full w-full p-5">
        <div className="h-full rounded-2xl border border-border/60 bg-[#0a0f16]/80 shadow-[0_24px_80px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(255,255,255,0.02)]">
          <Plot />
        </div>
      </div>
    </main>
  );
}
