import { Plot } from "@/components/editor/plot";

export function Workspace() {
  return (
    <main className="relative flex h-full flex-1 overflow-hidden bg-[#0c121b]">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.02),transparent_52%)]" />
      <div className="relative z-10 h-full w-full p-5">
        <div className="h-full rounded-2xl bg-[#0a1118]/70">
          <Plot />
        </div>
      </div>
    </main>
  );
}
