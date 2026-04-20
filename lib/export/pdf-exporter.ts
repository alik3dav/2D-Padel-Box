import { jsPDF } from "jspdf";

import { downloadBlob, withExtension } from "@/lib/export/file-utils";
import { renderPlotCanvas, type PlotRenderOptions } from "@/lib/export/render-plot-canvas";
import type { ProjectRecord } from "@/lib/project-types";

type ExportPdfArgs = {
  plotElement: HTMLElement;
  fileBaseName: string;
  project: ProjectRecord;
  orientation?: "portrait" | "landscape";
} & PlotRenderOptions;

export const exportProjectAsPdf = async ({
  plotElement,
  fileBaseName,
  project,
  orientation = "landscape",
  ...renderOptions
}: ExportPdfArgs) => {
  const canvas = await renderPlotCanvas(plotElement, renderOptions);
  const imageData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation,
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const margin = 14;
  const metaHeight = 24;
  const contentTop = margin + metaHeight;
  const contentWidth = pageWidth - margin * 2;
  const contentHeight = pageHeight - contentTop - margin;

  const imageRatio = canvas.width / canvas.height;
  let imageWidth = contentWidth;
  let imageHeight = imageWidth / imageRatio;

  if (imageHeight > contentHeight) {
    imageHeight = contentHeight;
    imageWidth = imageHeight * imageRatio;
  }

  const imageX = (pageWidth - imageWidth) / 2;
  const imageY = contentTop + (contentHeight - imageHeight) / 2;

  const exportedAt = new Date().toLocaleString();

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text(project.name, margin, margin + 5);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(`Export date: ${exportedAt}`, margin, margin + 12);
  pdf.text(`Plot: ${project.plot.width}m × ${project.plot.height}m`, margin, margin + 17);

  pdf.addImage(imageData, "PNG", imageX, imageY, imageWidth, imageHeight, undefined, "FAST");

  const blob = pdf.output("blob");
  downloadBlob(blob, withExtension(fileBaseName, "pdf"));
};
