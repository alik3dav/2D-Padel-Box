import type { ObjectPreset, EditorObjectType } from "@/lib/editor-types";

export const OBJECT_PRESETS: ObjectPreset[] = [
  { type: "padel-court", label: "Padel Court", width: 20, height: 10 },
  { type: "single-court", label: "Single Court", width: 20, height: 6 },
  { type: "wall", label: "Wall", width: 6, height: 0.3 },
  { type: "glass-wall", label: "Glass Wall", width: 6, height: 0.3 },
  { type: "door", label: "Door", width: 1.2, height: 0.25 },
  { type: "column", label: "Column", width: 0.6, height: 0.6 },
  { type: "stairs", label: "Stairs", width: 3, height: 2 },
  { type: "reception", label: "Reception", width: 4, height: 2 },
  { type: "lounge", label: "Lounge", width: 4, height: 3 },
  { type: "lockers", label: "Lockers", width: 3, height: 1.5 },
  { type: "storage", label: "Storage", width: 3, height: 2.5 },
  { type: "cafe", label: "Café / Bar", width: 5, height: 3 },
  { type: "toilets", label: "Toilets", width: 3, height: 2 },
  { type: "parking", label: "Parking", width: 6, height: 3 },
  { type: "car", label: "Car", width: 2, height: 1 },
  { type: "custom-zone", label: "Custom Zone", width: 4, height: 3 },
  { type: "text-label", label: "Text Label", width: 3, height: 1 },
];

export const OBJECT_LABELS: Record<EditorObjectType, string> = OBJECT_PRESETS.reduce(
  (acc, item) => ({ ...acc, [item.type]: item.label }),
  {} as Record<EditorObjectType, string>,
);

export const PRESET_BY_TYPE: Record<EditorObjectType, ObjectPreset> = OBJECT_PRESETS.reduce(
  (acc, item) => ({ ...acc, [item.type]: item }),
  {} as Record<EditorObjectType, ObjectPreset>,
);
