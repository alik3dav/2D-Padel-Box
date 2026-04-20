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
  | "car"
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
  zIndex: number;
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

export type AlignmentGuide = {
  id: string;
  axis: "x" | "y";
  position: number;
  start: number;
  end: number;
};

export type EditorSnapshot = {
  objects: EditorObject[];
  selectedIds: string[];
};

export type EditorState = {
  objects: EditorObject[];
  selectedIds: string[];
  transform: CanvasTransform;
  grid: GridSettings;
  snap: SnapSettings;
  cursor: CursorPosition;
  plot: PlotSettings;
  guides: AlignmentGuide[];
  history: {
    past: EditorSnapshot[];
    future: EditorSnapshot[];
  };
};

export type ObjectPreset = {
  type: EditorObjectType;
  label: string;
  width: number;
  height: number;
};
