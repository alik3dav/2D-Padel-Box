import { PROJECT_SCHEMA_VERSION, type ProjectRecord } from "@/lib/project-types";

export type ExportProjectPayload = {
  schemaVersion: number;
  exportedAt: string;
  project: ProjectRecord;
};

export const createExportProjectPayload = (project: ProjectRecord): ExportProjectPayload => ({
  schemaVersion: PROJECT_SCHEMA_VERSION,
  exportedAt: new Date().toISOString(),
  project,
});
