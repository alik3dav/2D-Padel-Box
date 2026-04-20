import { downloadBlob, withExtension } from "@/lib/export/file-utils";
import { renderPlotCanvas, type PlotRenderOptions } from "@/lib/export/render-plot-canvas";

type ExportPngArgs = {
  plotElement: HTMLElement;
  fileBaseName: string;
  quality?: number;
} & PlotRenderOptions;

export const exportProjectAsPng = async ({ plotElement, fileBaseName, quality = 0.95, ...renderOptions }: ExportPngArgs) => {
  const canvas = await renderPlotCanvas(plotElement, renderOptions);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((value) => resolve(value), "image/png", quality);
  });

  if (!blob) {
    throw new Error("Could not generate PNG export.");
  }

  downloadBlob(blob, withExtension(fileBaseName, "png"));
};
