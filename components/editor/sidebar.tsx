import {
  Armchair,
  Building2,
  Columns2,
  DoorOpen,
  Dumbbell,
  Fence,
  Glasses,
  Landmark,
  ParkingSquare,
  ScanSearch,
  Square,
  SquareDashedBottomCode,
  Store,
  Type,
  Warehouse,
  Waves,
} from "lucide-react";

import { SidebarGroup } from "@/components/editor/sidebar-group";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const groups = [
  {
    title: "Courts",
    items: [
      { name: "Padel Court", icon: <Square className="h-4 w-4" /> },
      { name: "Single Court", icon: <SquareDashedBottomCode className="h-4 w-4" /> },
    ],
  },
  {
    title: "Structures",
    items: [
      { name: "Wall", icon: <Fence className="h-4 w-4" /> },
      { name: "Glass Wall", icon: <Glasses className="h-4 w-4" /> },
      { name: "Door", icon: <DoorOpen className="h-4 w-4" /> },
      { name: "Column", icon: <Columns2 className="h-4 w-4" /> },
      { name: "Stairs", icon: <Landmark className="h-4 w-4" /> },
    ],
  },
  {
    title: "Furniture",
    items: [
      { name: "Reception", icon: <Building2 className="h-4 w-4" /> },
      { name: "Lounge", icon: <Armchair className="h-4 w-4" /> },
      { name: "Lockers", icon: <Warehouse className="h-4 w-4" /> },
      { name: "Storage", icon: <Warehouse className="h-4 w-4" /> },
    ],
  },
  {
    title: "Amenities",
    items: [
      { name: "Café / Bar", icon: <Store className="h-4 w-4" /> },
      { name: "Toilets", icon: <Waves className="h-4 w-4" /> },
      { name: "Parking", icon: <ParkingSquare className="h-4 w-4" /> },
      { name: "Custom Zone", icon: <Dumbbell className="h-4 w-4" /> },
    ],
  },
  {
    title: "Labels",
    items: [{ name: "Text Label", icon: <Type className="h-4 w-4" /> }],
  },
];

export function Sidebar() {
  return (
    <aside className="flex h-full w-72 flex-col bg-[#0d141d] shadow-[inset_-1px_0_0_rgba(255,255,255,0.03)]">
      <div className="space-y-2.5 px-4 py-3.5">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/78">Element Library</h2>
        <div className="relative">
          <ScanSearch className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground/60" />
          <Input
            placeholder="Search elements..."
            className="h-8 border-transparent bg-[#111b26] pl-8 text-xs placeholder:text-muted-foreground/65 focus-visible:ring-1"
          />
        </div>
      </div>
      <ScrollArea className="h-full">
        <div className="space-y-7 px-4 pb-4 pt-2">
          {groups.map((group) => (
            <SidebarGroup key={group.title} title={group.title} items={group.items} />
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
