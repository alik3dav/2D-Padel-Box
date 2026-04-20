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
    <section className="space-y-3">
      <h3 className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => (
          <ElementCard key={item.name} name={item.name} icon={item.icon} />
        ))}
      </div>
    </section>
  );
}
