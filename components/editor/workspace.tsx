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
      <div className="relative z-10 h-full w-full">
        <div className="h-full">
          <Plot />
        </div>
      </div>
    </main>
  );
}
