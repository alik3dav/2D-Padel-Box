import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";

type ElementCardProps = {
  name: string;
  icon: React.ReactNode;
};

export function ElementCard({ name, icon }: ElementCardProps) {
  return (
    <button
      type="button"
      className={cn(
        "group flex w-full items-start gap-2 rounded-lg bg-transparent px-2 py-2 text-left transition duration-150",
        "hover:bg-white/[0.04] hover:brightness-110 active:bg-white/[0.06]",
      )}
    >
      <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-md bg-white/[0.03] text-muted-foreground transition-colors group-hover:text-foreground/90">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-[11px] font-medium leading-snug text-foreground/90">{name}</p>
      </div>
      <Plus className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground/70 opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  );
}
