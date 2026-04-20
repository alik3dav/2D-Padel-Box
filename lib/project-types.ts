import type { EditorObject } from "@/lib/editor-types";

export const PROJECT_SCHEMA_VERSION = 1;

export type ProjectRecord = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  plot: {
    width: number;
    height: number;
    gridSize: number;
  };
  editor: {
    zoom: number;
    panX: number;
    panY: number;
    snapEnabled: boolean;
    gridEnabled: boolean;
  };
  objects: EditorObject[];
  version: number;
};

export type ProjectSummary = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  plot: {
    width: number;
    height: number;
  };
  objectCount: number;
};
