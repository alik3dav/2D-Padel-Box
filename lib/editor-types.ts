export type EditorObjectType =
  | "padel-court"
  | "single-court"
  | "wall"
  | "glass-wall"
  | "door"
  | "column"
  | "stairs"
  | "reception"
  | "lounge"
  | "lockers"
  | "storage"
  | "cafe"
  | "toilets"
  | "parking"
  | "custom-zone"
  | "text-label";

export type EditorObject = {
  id: string;
  type: EditorObjectType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  label?: string;
  locked: boolean;
};

export type CanvasTransform = {
  zoom: number;
  panX: number;
  panY: number;
};

export type GridSettings = {
  visible: boolean;
  size: number;
};

export type SnapSettings = {
  enabled: boolean;
};

export type CursorPosition = {
  x: number;
  y: number;
};

export type PlotSettings = {
  width: number;
  height: number;
};

export type EditorState = {
  objects: EditorObject[];
  selectedId: string | null;
  transform: CanvasTransform;
  grid: GridSettings;
  snap: SnapSettings;
  cursor: CursorPosition;
  plot: PlotSettings;
};

export type ObjectPreset = {
  type: EditorObjectType;
  label: string;
  width: number;
  height: number;
};
