import { exportProjectAsJson } from "@/lib/export/json-exporter";
import { sanitizeFileBaseName } from "@/lib/export/file-utils";
import { exportProjectAsPdf } from "@/lib/export/pdf-exporter";
import { exportProjectAsPng } from "@/lib/export/png-exporter";
import type { ProjectRecord } from "@/lib/project-types";

const PLOT_TARGET_SELECTOR = "[data-export-plot-root='true']";

export type ExportFormat = "png" | "pdf" | "json";

export type ExportRequest = {
  format: ExportFormat;
  project: ProjectRecord;
  pdfOrientation?: "portrait" | "landscape";
};

const getPlotElementOrThrow = () => {
  const plotElement = document.querySelector<HTMLElement>(PLOT_TARGET_SELECTOR);
  if (!plotElement) {
    throw new Error("Plot area not found for export.");
  }

  return plotElement;
};

export const exportProject = async ({ format, project, pdfOrientation }: ExportRequest) => {
  const fileBaseName = sanitizeFileBaseName(project.name || "padel-club-layout-v1");

  if (format === "json") {
    exportProjectAsJson({ fileBaseName, project });
    return;
  }

  const plotElement = getPlotElementOrThrow();

  if (format === "png") {
    await exportProjectAsPng({
      plotElement,
      fileBaseName,
      pixelRatio: 2,
      padding: 24,
    });
    return;
  }

  await exportProjectAsPdf({
    plotElement,
    fileBaseName,
    project,
    orientation: pdfOrientation,
    pixelRatio: 2,
    padding: 24,
  });
};
