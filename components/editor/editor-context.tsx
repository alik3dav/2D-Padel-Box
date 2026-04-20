"use client";

import { createContext, useContext, useMemo, useReducer, type Dispatch, type ReactNode } from "react";

import { PRESET_BY_TYPE } from "@/lib/editor-catalog";
import type { EditorObject, EditorObjectType, EditorState } from "@/lib/editor-types";

type AddObjectPayload = {
  type: EditorObjectType;
  x?: number;
  y?: number;
};

type EditorAction =
  | { type: "add-object"; payload: AddObjectPayload }
  | { type: "select-object"; payload: { id: string | null } }
  | { type: "move-object"; payload: { id: string; x: number; y: number } }
  | { type: "update-object"; payload: { id: string; patch: Partial<EditorObject> } }
  | { type: "set-cursor"; payload: { x: number; y: number } }
  | { type: "set-transform"; payload: Partial<EditorState["transform"]> }
  | { type: "toggle-snap" }
  | { type: "toggle-grid" }
  | { type: "set-grid-size"; payload: { size: number } }
  | { type: "set-plot"; payload: Partial<EditorState["plot"]> };

const initialState: EditorState = {
  objects: [],
  selectedId: null,
  transform: {
    zoom: 1,
    panX: 120,
    panY: 90,
  },
  grid: {
    visible: true,
    size: 1,
  },
  snap: {
    enabled: true,
  },
  cursor: {
    x: 0,
    y: 0,
  },
  plot: {
    width: 40,
    height: 25,
  },
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "add-object": {
      const preset = PRESET_BY_TYPE[action.payload.type];
      const x = action.payload.x ?? state.plot.width / 2 - preset.width / 2;
      const y = action.payload.y ?? state.plot.height / 2 - preset.height / 2;
      const id = `obj-${crypto.randomUUID()}`;
      const next: EditorObject = {
        id,
        type: preset.type,
        x: clamp(x, 0, Math.max(0, state.plot.width - preset.width)),
        y: clamp(y, 0, Math.max(0, state.plot.height - preset.height)),
        width: preset.width,
        height: preset.height,
        rotation: 0,
        locked: false,
        label: preset.label,
      };

      return {
        ...state,
        objects: [...state.objects, next],
        selectedId: next.id,
      };
    }
    case "select-object":
      return { ...state, selectedId: action.payload.id };
    case "move-object":
      return {
        ...state,
        objects: state.objects.map((item) =>
          item.id === action.payload.id
            ? {
                ...item,
                x: clamp(action.payload.x, 0, Math.max(0, state.plot.width - item.width)),
                y: clamp(action.payload.y, 0, Math.max(0, state.plot.height - item.height)),
              }
            : item,
        ),
      };
    case "update-object":
      return {
        ...state,
        objects: state.objects.map((item) => {
          if (item.id !== action.payload.id) {
            return item;
          }

          const width = action.payload.patch.width ?? item.width;
          const height = action.payload.patch.height ?? item.height;
          const x = action.payload.patch.x ?? item.x;
          const y = action.payload.patch.y ?? item.y;

          return {
            ...item,
            ...action.payload.patch,
            width,
            height,
            x: clamp(x, 0, Math.max(0, state.plot.width - width)),
            y: clamp(y, 0, Math.max(0, state.plot.height - height)),
          };
        }),
      };
    case "set-cursor":
      return { ...state, cursor: action.payload };
    case "set-transform":
      return {
        ...state,
        transform: {
          ...state.transform,
          ...action.payload,
          zoom: clamp(action.payload.zoom ?? state.transform.zoom, 0.25, 3),
        },
      };
    case "toggle-snap":
      return {
        ...state,
        snap: { enabled: !state.snap.enabled },
      };
    case "toggle-grid":
      return {
        ...state,
        grid: { ...state.grid, visible: !state.grid.visible },
      };
    case "set-grid-size":
      return {
        ...state,
        grid: { ...state.grid, size: Math.max(0.1, action.payload.size) },
      };
    case "set-plot":
      return {
        ...state,
        plot: {
          width: Math.max(1, action.payload.width ?? state.plot.width),
          height: Math.max(1, action.payload.height ?? state.plot.height),
        },
      };
    default:
      return state;
  }
}

const EditorContext = createContext<{ state: EditorState; dispatch: Dispatch<EditorAction> } | null>(null);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(editorReducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within EditorProvider");
  }
  return context;
}
