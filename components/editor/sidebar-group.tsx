import { ElementCard } from "@/components/editor/element-card";

type ElementItem = {
  name: string;
  icon: React.ReactNode;
};

type SidebarGroupProps = {
  title: string;
  items: ElementItem[];
};

export function SidebarGroup({ title, items }: SidebarGroupProps) {
  return (
    <section className="space-y-1.5">
      <h3 className="px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">{title}</h3>
      <div className="space-y-0.5">
        {items.map((item) => (
          <ElementCard key={item.name} name={item.name} icon={item.icon} />
        ))}
      </div>
    </section>
  );
}
