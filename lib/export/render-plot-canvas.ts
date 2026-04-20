import { toCanvas } from "html-to-image";

const EXPORT_BG_COLOR = "#0f1a25";

export type PlotRenderOptions = {
  pixelRatio?: number;
  padding?: number;
};

type Mutation = {
  element: HTMLElement;
  style: string | null;
};

const withCleanExportState = async <T>(plotElement: HTMLElement, action: () => Promise<T>): Promise<T> => {
  const mutations: Mutation[] = [];

  const mutateStyle = (selector: string, apply: (element: HTMLElement) => void) => {
    plotElement.querySelectorAll<HTMLElement>(selector).forEach((element) => {
      mutations.push({
        element,
        style: element.getAttribute("style"),
      });
      apply(element);
    });
  };

  mutateStyle("[data-export-hide='true']", (element) => {
    element.style.display = "none";
  });

  mutateStyle("[data-export-selection='true']", (element) => {
    element.style.boxShadow = "none";
  });

  mutateStyle("[data-export-handle='true']", (element) => {
    element.style.display = "none";
  });

  try {
    return await action();
  } finally {
    mutations.reverse().forEach(({ element, style }) => {
      if (style === null) {
        element.removeAttribute("style");
        return;
      }
      element.setAttribute("style", style);
    });
  }
};

export const renderPlotCanvas = async (plotElement: HTMLElement, options?: PlotRenderOptions) => {
  const pixelRatio = options?.pixelRatio ?? 2;
  const padding = Math.max(0, options?.padding ?? 24);

  const baseCanvas = await withCleanExportState(plotElement, () =>
    toCanvas(plotElement, {
      pixelRatio,
      backgroundColor: EXPORT_BG_COLOR,
      cacheBust: true,
    }),
  );

  if (!padding) {
    return baseCanvas;
  }

  const paddedCanvas = document.createElement("canvas");
  const paddedWidth = baseCanvas.width + padding * 2;
  const paddedHeight = baseCanvas.height + padding * 2;
  paddedCanvas.width = paddedWidth;
  paddedCanvas.height = paddedHeight;

  const context = paddedCanvas.getContext("2d");
  if (!context) {
    throw new Error("Unable to render PNG export context.");
  }

  context.fillStyle = EXPORT_BG_COLOR;
  context.fillRect(0, 0, paddedWidth, paddedHeight);
  context.drawImage(baseCanvas, padding, padding);

  return paddedCanvas;
};
