"use client";

import { createContext, useContext, useMemo, useReducer, type Dispatch, type ReactNode } from "react";

import { PRESET_BY_TYPE } from "@/lib/editor-catalog";
import { clampRectToPlot } from "@/lib/editor-geometry";
import type { AlignmentGuide, EditorObject, EditorObjectType, EditorSnapshot, EditorState } from "@/lib/editor-types";

type AddObjectPayload = {
  type: EditorObjectType;
  x?: number;
  y?: number;
};

type EditorAction =
  | { type: "add-object"; payload: AddObjectPayload }
  | { type: "set-selection"; payload: { ids: string[] } }
  | { type: "toggle-selection"; payload: { id: string } }
  | { type: "move-selection"; payload: { ids: string[]; deltaX: number; deltaY: number } }
  | { type: "update-object"; payload: { id: string; patch: Partial<EditorObject> } }
  | { type: "update-many"; payload: { patches: Array<{ id: string; patch: Partial<EditorObject> }> } }
  | { type: "delete-selected" }
  | { type: "set-cursor"; payload: { x: number; y: number } }
  | { type: "set-guides"; payload: { guides: AlignmentGuide[] } }
  | { type: "set-transform"; payload: Partial<EditorState["transform"]> }
  | { type: "toggle-snap" }
  | { type: "toggle-grid" }
  | { type: "set-grid-size"; payload: { size: number } }
  | { type: "set-plot"; payload: Partial<EditorState["plot"]> }
  | { type: "bring-forward" }
  | { type: "send-backward" }
  | { type: "undo" }
  | { type: "redo" };

const initialState: EditorState = {
  objects: [],
  selectedIds: [],
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
  guides: [],
  history: {
    past: [],
    future: [],
  },
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const MIN_SIZE = 0.5;

const snapshotOf = (state: EditorState): EditorSnapshot => ({
  objects: state.objects,
  selectedIds: state.selectedIds,
});

const restoreSnapshot = (state: EditorState, snapshot: EditorSnapshot): EditorState => ({
  ...state,
  objects: snapshot.objects,
  selectedIds: snapshot.selectedIds,
  guides: [],
});

const withHistory = (prev: EditorState, next: EditorState): EditorState => {
  if (prev.objects === next.objects && prev.selectedIds === next.selectedIds) {
    return next;
  }

  return {
    ...next,
    history: {
      past: [...prev.history.past, snapshotOf(prev)].slice(-200),
      future: [],
    },
  };
};

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "add-object": {
      const preset = PRESET_BY_TYPE[action.payload.type];
      const x = action.payload.x ?? state.plot.width / 2 - preset.width / 2;
      const y = action.payload.y ?? state.plot.height / 2 - preset.height / 2;
      const id = `obj-${crypto.randomUUID()}`;
      const topZ = state.objects.reduce((max, obj) => Math.max(max, obj.zIndex), 0);
      const nextObject: EditorObject = {
        id,
        type: preset.type,
        x: clamp(x, 0, Math.max(0, state.plot.width - preset.width)),
        y: clamp(y, 0, Math.max(0, state.plot.height - preset.height)),
        width: preset.width,
        height: preset.height,
        rotation: 0,
        zIndex: topZ + 1,
        locked: false,
        label: preset.label,
      };

      return withHistory(state, {
        ...state,
        objects: [...state.objects, nextObject],
        selectedIds: [nextObject.id],
      });
    }
    case "set-selection":
      return {
        ...state,
        selectedIds: [...new Set(action.payload.ids)],
      };
    case "toggle-selection": {
      const has = state.selectedIds.includes(action.payload.id);
      return {
        ...state,
        selectedIds: has
          ? state.selectedIds.filter((id) => id !== action.payload.id)
          : [...state.selectedIds, action.payload.id],
      };
    }
    case "move-selection": {
      const selectionSet = new Set(action.payload.ids);
      const nextObjects = state.objects.map((item) => {
        if (!selectionSet.has(item.id) || item.locked) {
          return item;
        }

        const rect = clampRectToPlot(
          {
            x: item.x + action.payload.deltaX,
            y: item.y + action.payload.deltaY,
            width: item.width,
            height: item.height,
          },
          state.plot.width,
          state.plot.height,
        );

        return { ...item, x: rect.x, y: rect.y };
      });

      return withHistory(state, {
        ...state,
        objects: nextObjects,
      });
    }
    case "update-object": {
      return withHistory(state, {
        ...state,
        objects: state.objects.map((item) => {
          if (item.id !== action.payload.id) {
            return item;
          }

          const width = Math.max(MIN_SIZE, action.payload.patch.width ?? item.width);
          const height = Math.max(MIN_SIZE, action.payload.patch.height ?? item.height);
          const rect = clampRectToPlot(
            {
              x: action.payload.patch.x ?? item.x,
              y: action.payload.patch.y ?? item.y,
              width,
              height,
            },
            state.plot.width,
            state.plot.height,
          );

          return {
            ...item,
            ...action.payload.patch,
            x: rect.x,
            y: rect.y,
            width,
            height,
          };
        }),
      });
    }
    case "update-many": {
      const patchMap = new Map(action.payload.patches.map((item) => [item.id, item.patch]));
      const nextObjects = state.objects.map((item) => {
        const patch = patchMap.get(item.id);
        if (!patch) {
          return item;
        }

        const width = Math.max(MIN_SIZE, patch.width ?? item.width);
        const height = Math.max(MIN_SIZE, patch.height ?? item.height);
        const rect = clampRectToPlot(
          {
            x: patch.x ?? item.x,
            y: patch.y ?? item.y,
            width,
            height,
          },
          state.plot.width,
          state.plot.height,
        );

        return {
          ...item,
          ...patch,
          x: rect.x,
          y: rect.y,
          width,
          height,
        };
      });

      return withHistory(state, {
        ...state,
        objects: nextObjects,
      });
    }
    case "delete-selected": {
      const selectedSet = new Set(state.selectedIds);
      if (!selectedSet.size) {
        return state;
      }
      return withHistory(state, {
        ...state,
        objects: state.objects.filter((item) => !selectedSet.has(item.id)),
        selectedIds: [],
      });
    }
    case "set-cursor":
      return { ...state, cursor: action.payload };
    case "set-guides":
      return { ...state, guides: action.payload.guides };
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
    case "bring-forward": {
      if (!state.selectedIds.length) {
        return state;
      }

      const selectedSet = new Set(state.selectedIds);
      const maxZ = state.objects.reduce((max, item) => Math.max(max, item.zIndex), 0) + 1;
      let cursor = maxZ;

      return withHistory(state, {
        ...state,
        objects: state.objects.map((item) => {
          if (!selectedSet.has(item.id)) {
            return item;
          }

          cursor += 1;
          return { ...item, zIndex: cursor };
        }),
      });
    }
    case "send-backward": {
      if (!state.selectedIds.length) {
        return state;
      }

      const selectedSet = new Set(state.selectedIds);
      let cursor = 0;

      return withHistory(state, {
        ...state,
        objects: state.objects.map((item) => {
          if (!selectedSet.has(item.id)) {
            return item;
          }

          cursor -= 1;
          return { ...item, zIndex: cursor };
        }),
      });
    }
    case "undo": {
      const previous = state.history.past[state.history.past.length - 1];
      if (!previous) {
        return state;
      }

      const next = restoreSnapshot(state, previous);
      return {
        ...next,
        history: {
          past: state.history.past.slice(0, -1),
          future: [snapshotOf(state), ...state.history.future],
        },
      };
    }
    case "redo": {
      const [nextSnapshot, ...restFuture] = state.history.future;
      if (!nextSnapshot) {
        return state;
      }

      const next = restoreSnapshot(state, nextSnapshot);
      return {
        ...next,
        history: {
          past: [...state.history.past, snapshotOf(state)],
          future: restFuture,
        },
      };
    }
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
