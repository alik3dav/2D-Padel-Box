import type { EditorObject } from "@/lib/editor-types";
import { PROJECT_SCHEMA_VERSION, type ProjectRecord, type ProjectSummary } from "@/lib/project-types";

const STORAGE_PREFIX = "padel-designer";
const INDEX_KEY = `${STORAGE_PREFIX}:project-index`;
const LAST_OPENED_KEY = `${STORAGE_PREFIX}:last-opened-project-id`;
const PROJECT_KEY_PREFIX = `${STORAGE_PREFIX}:project:`;

type ProjectIndexEntry = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

const asRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
};

const asNumber = (value: unknown, fallback: number): number =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const asBoolean = (value: unknown, fallback: boolean): boolean =>
  typeof value === "boolean" ? value : fallback;

const asString = (value: unknown, fallback: string): string => (typeof value === "string" && value.trim() ? value : fallback);

const safeParseJson = (raw: string | null): unknown | null => {
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
};

const projectStorageKey = (projectId: string) => `${PROJECT_KEY_PREFIX}${projectId}`;

const normalizeObject = (value: unknown): EditorObject | null => {
  const obj = asRecord(value);
  if (!obj) {
    return null;
  }

  const id = asString(obj.id, "");
  const type = asString(obj.type, "") as EditorObject["type"];
  if (!id || !type) {
    return null;
  }

  return {
    id,
    type,
    x: asNumber(obj.x, 0),
    y: asNumber(obj.y, 0),
    width: Math.max(0.5, asNumber(obj.width, 1)),
    height: Math.max(0.5, asNumber(obj.height, 1)),
    rotation: asNumber(obj.rotation, 0),
    label: typeof obj.label === "string" ? obj.label : undefined,
    locked: asBoolean(obj.locked, false),
    zIndex: asNumber(obj.zIndex, 0),
  };
};

const normalizeProjectRecord = (value: unknown): ProjectRecord | null => {
  const project = asRecord(value);
  if (!project) {
    return null;
  }

  const plotRaw = asRecord(project.plot);
  const editorRaw = asRecord(project.editor);
  const createdAt = asString(project.createdAt, "");
  const updatedAt = asString(project.updatedAt, "");
  const id = asString(project.id, "");

  if (!plotRaw || !editorRaw || !createdAt || !updatedAt || !id) {
    return null;
  }

  const objectList: EditorObject[] = Array.isArray(project.objects)
    ? project.objects.map(normalizeObject).filter((item): item is EditorObject => item !== null)
    : [];

  return {
    id,
    name: asString(project.name, "Untitled Project"),
    createdAt,
    updatedAt,
    plot: {
      width: Math.max(1, asNumber(plotRaw.width, 40)),
      height: Math.max(1, asNumber(plotRaw.height, 25)),
      gridSize: Math.max(0.1, asNumber(plotRaw.gridSize, 1)),
    },
    editor: {
      zoom: Math.min(3, Math.max(0.25, asNumber(editorRaw.zoom, 1))),
      panX: asNumber(editorRaw.panX, 120),
      panY: asNumber(editorRaw.panY, 90),
      snapEnabled: asBoolean(editorRaw.snapEnabled, true),
      gridEnabled: asBoolean(editorRaw.gridEnabled, true),
    },
    objects: objectList,
    version: asNumber(project.version, PROJECT_SCHEMA_VERSION),
  };
};

const normalizeIndexEntry = (value: unknown): ProjectIndexEntry | null => {
  const entry = asRecord(value);
  if (!entry) {
    return null;
  }

  const id = asString(entry.id, "");
  const createdAt = asString(entry.createdAt, "");
  const updatedAt = asString(entry.updatedAt, "");

  if (!id || !createdAt || !updatedAt) {
    return null;
  }

  return {
    id,
    name: asString(entry.name, "Untitled Project"),
    createdAt,
    updatedAt,
  };
};

class LocalProjectStorage {
  private hasStorage() {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
  }

  private readIndex(): ProjectIndexEntry[] {
    if (!this.hasStorage()) {
      return [];
    }

    const parsed = safeParseJson(window.localStorage.getItem(INDEX_KEY));
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map(normalizeIndexEntry)
      .filter((entry): entry is ProjectIndexEntry => entry !== null);
  }

  private writeIndex(entries: ProjectIndexEntry[]) {
    if (!this.hasStorage()) {
      return;
    }

    window.localStorage.setItem(INDEX_KEY, JSON.stringify(entries));
  }

  listProjects(): ProjectSummary[] {
    const index = this.readIndex();

    return index
      .map((entry) => {
        const project = this.getProject(entry.id);
        if (!project) {
          return null;
        }

        return {
          id: project.id,
          name: project.name,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
          plot: {
            width: project.plot.width,
            height: project.plot.height,
          },
          objectCount: project.objects.length,
        } satisfies ProjectSummary;
      })
            .filter((item): item is ProjectSummary => item !== null)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  getProject(projectId: string): ProjectRecord | null {
    if (!this.hasStorage()) {
      return null;
    }

    const parsed = safeParseJson(window.localStorage.getItem(projectStorageKey(projectId)));
    const normalized = normalizeProjectRecord(parsed);

    if (!normalized) {
      return null;
    }

    return normalized;
  }

  upsertProject(project: ProjectRecord): ProjectRecord {
    if (!this.hasStorage()) {
      return project;
    }

    const normalized = normalizeProjectRecord(project);
    if (!normalized) {
      throw new Error("Invalid project record");
    }

    window.localStorage.setItem(projectStorageKey(normalized.id), JSON.stringify(normalized));

    const index = this.readIndex();
    const existingIndex = index.findIndex((item) => item.id === normalized.id);
    const entry: ProjectIndexEntry = {
      id: normalized.id,
      name: normalized.name,
      createdAt: normalized.createdAt,
      updatedAt: normalized.updatedAt,
    };

    if (existingIndex >= 0) {
      index[existingIndex] = entry;
    } else {
      index.push(entry);
    }

    this.writeIndex(index);
    return normalized;
  }

  renameProject(projectId: string, name: string): ProjectRecord | null {
    const project = this.getProject(projectId);
    if (!project) {
      return null;
    }

    return this.upsertProject({
      ...project,
      name: name.trim() || "Untitled Project",
      updatedAt: new Date().toISOString(),
    });
  }

  duplicateProject(projectId: string, name: string): ProjectRecord | null {
    const source = this.getProject(projectId);
    if (!source) {
      return null;
    }

    const now = new Date().toISOString();
    const copy: ProjectRecord = {
      ...source,
      id: `project-${crypto.randomUUID()}`,
      name: name.trim() || `${source.name} Copy`,
      createdAt: now,
      updatedAt: now,
    };

    return this.upsertProject(copy);
  }

  deleteProject(projectId: string) {
    if (!this.hasStorage()) {
      return;
    }

    window.localStorage.removeItem(projectStorageKey(projectId));
    const nextIndex = this.readIndex().filter((entry) => entry.id !== projectId);
    this.writeIndex(nextIndex);

    const lastOpened = this.getLastOpenedProjectId();
    if (lastOpened === projectId) {
      this.setLastOpenedProjectId(null);
    }
  }

  getLastOpenedProjectId(): string | null {
    if (!this.hasStorage()) {
      return null;
    }

    const value = window.localStorage.getItem(LAST_OPENED_KEY);
    return value && value.trim() ? value : null;
  }

  setLastOpenedProjectId(projectId: string | null) {
    if (!this.hasStorage()) {
      return;
    }

    if (!projectId) {
      window.localStorage.removeItem(LAST_OPENED_KEY);
      return;
    }

    window.localStorage.setItem(LAST_OPENED_KEY, projectId);
  }
}

export const localProjectStorage = new LocalProjectStorage();
