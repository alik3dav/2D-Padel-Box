"use client";

import { type ReactNode } from "react";

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
import type { EditorObjectType } from "@/lib/editor-types";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export type SidebarElementItem = {
  name: string;
  type: EditorObjectType;
  icon: ReactNode;
};

type SidebarGroupConfig = {
  title: string;
  items: SidebarElementItem[];
};

const groups: SidebarGroupConfig[] = [
  {
    title: "Courts",
    items: [
      { name: "Padel Court", type: "padel-court", icon: <Square className="h-4 w-4" /> },
      { name: "Single Court", type: "single-court", icon: <SquareDashedBottomCode className="h-4 w-4" /> },
    ],
  },
  {
    title: "Structures",
    items: [
      { name: "Wall", type: "wall", icon: <Fence className="h-4 w-4" /> },
      { name: "Glass Wall", type: "glass-wall", icon: <Glasses className="h-4 w-4" /> },
      { name: "Door", type: "door", icon: <DoorOpen className="h-4 w-4" /> },
      { name: "Column", type: "column", icon: <Columns2 className="h-4 w-4" /> },
      { name: "Stairs", type: "stairs", icon: <Landmark className="h-4 w-4" /> },
    ],
  },
  {
    title: "Furniture",
    items: [
      { name: "Reception", type: "reception", icon: <Building2 className="h-4 w-4" /> },
      { name: "Lounge", type: "lounge", icon: <Armchair className="h-4 w-4" /> },
      { name: "Lockers", type: "lockers", icon: <Warehouse className="h-4 w-4" /> },
      { name: "Storage", type: "storage", icon: <Warehouse className="h-4 w-4" /> },
    ],
  },
  {
    title: "Amenities",
    items: [
      { name: "Café / Bar", type: "cafe", icon: <Store className="h-4 w-4" /> },
      { name: "Toilets", type: "toilets", icon: <Waves className="h-4 w-4" /> },
      { name: "Parking", type: "parking", icon: <ParkingSquare className="h-4 w-4" /> },
      { name: "Custom Zone", type: "custom-zone", icon: <Dumbbell className="h-4 w-4" /> },
    ],
  },
  {
    title: "Labels",
    items: [{ name: "Text Label", type: "text-label", icon: <Type className="h-4 w-4" /> }],
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
