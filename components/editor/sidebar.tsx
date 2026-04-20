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
    <aside className="flex h-full w-80 flex-col border-r border-border/80 bg-card/40">
      <div className="space-y-3 border-b border-border/70 px-4 py-3">
        <h2 className="text-sm font-semibold">Element Library</h2>
        <div className="relative">
          <ScanSearch className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search elements..." className="pl-9" />
        </div>
      </div>
      <ScrollArea className="h-full">
        <div className="space-y-6 p-4">
          {groups.map((group) => (
            <SidebarGroup key={group.title} title={group.title} items={group.items} />
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
