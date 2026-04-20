import { Plot } from "@/components/editor/plot";

export function Workspace() {
  return (
    <main className="relative flex h-full flex-1 overflow-hidden bg-[#0b121a]">
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(255,255,255,0.03),transparent_56%)]" />
      <div className="relative z-10 h-full w-full p-5">
        <div className="h-full rounded-2xl bg-[#0e1620] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_18px_45px_rgba(0,0,0,0.28)]">
          <Plot />
        </div>
      </div>
    </main>
  );
}
