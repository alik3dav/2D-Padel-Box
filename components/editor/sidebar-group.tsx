import { ElementCard } from "@/components/editor/element-card";
import type { SidebarElementItem } from "@/components/editor/sidebar";

type SidebarGroupProps = {
  title: string;
  items: SidebarElementItem[];
};

export function SidebarGroup({ title, items }: SidebarGroupProps) {
  return (
    <section className="space-y-2">
      <h3 className="px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/55">{title}</h3>
      <div className="space-y-0.5">
        {items.map((item) => (
          <ElementCard key={item.name} name={item.name} type={item.type} icon={item.icon} />
        ))}
      </div>
    </section>
  );
}
