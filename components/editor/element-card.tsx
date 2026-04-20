import { Plus } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ElementCardProps = {
  name: string;
  icon: React.ReactNode;
};

export function ElementCard({ name, icon }: ElementCardProps) {
  return (
    <Card
      className={cn(
        "group cursor-pointer border-border/65 bg-card/45 p-2.5 transition-all duration-150 hover:border-primary/45 hover:bg-accent/40",
      )}
    >
      <div className="mb-1.5 flex items-center justify-between text-muted-foreground transition-colors group-hover:text-primary">
        <span className="flex items-center justify-center rounded-md border border-border/60 bg-muted/45 p-1.5">
          {icon}
        </span>
        <Plus className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <p className="line-clamp-2 text-[11px] font-medium leading-snug text-foreground/95">{name}</p>
    </Card>
  );
}
