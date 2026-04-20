import { createExportProjectPayload } from "@/lib/export/project-export-model";
import { downloadBlob, withExtension } from "@/lib/export/file-utils";
import type { ProjectRecord } from "@/lib/project-types";

type ExportJsonArgs = {
  fileBaseName: string;
  project: ProjectRecord;
};

export const exportProjectAsJson = ({ fileBaseName, project }: ExportJsonArgs) => {
  const payload = createExportProjectPayload(project);
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json;charset=utf-8",
  });

  downloadBlob(blob, withExtension(fileBaseName, "json"));
};
