import type { EditorObject } from "@/lib/editor-types";

const svgDataUrl = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

/**
 * HOW TO MANUALLY ADD/UPDATE AN SVG OBJECT SKIN
 *
 * 1) Copy your SVG markup from a file or design tool export.
 * 2) Keep `viewBox` and set `preserveAspectRatio='none'` for better stretching.
 * 3) Paste the full SVG string into `svgDataUrl(...)` for the object type you want.
 * 4) If your SVG has double quotes, replace them with single quotes inside the template string.
 * 5) Save and restart the dev server if needed.
 */
export const objectSvgBackgrounds: Partial<Record<EditorObject["type"], string>> = {
  "padel-court": svgDataUrl(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 50' preserveAspectRatio='none'>
      <rect width='100' height='50' fill='%23088f6a'/>
      <rect x='2' y='2' width='96' height='46' fill='none' stroke='white' stroke-width='1.4'/>
      <line x1='50' y1='2' x2='50' y2='48' stroke='white' stroke-width='1.1'/>
      <line x1='2' y1='25' x2='98' y2='25' stroke='white' stroke-width='1.1'/>
      <line x1='25' y1='2' x2='25' y2='48' stroke='white' stroke-width='0.9' opacity='0.9'/>
      <line x1='75' y1='2' x2='75' y2='48' stroke='white' stroke-width='0.9' opacity='0.9'/>
    </svg>`,
  ),
  "single-court": svgDataUrl(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 30' preserveAspectRatio='none'>
      <rect width='100' height='30' fill='%230b8f84'/>
      <rect x='2' y='2' width='96' height='26' fill='none' stroke='white' stroke-width='1.4'/>
      <line x1='50' y1='2' x2='50' y2='28' stroke='white' stroke-width='1.1'/>
      <line x1='2' y1='15' x2='98' y2='15' stroke='white' stroke-width='1.1'/>
    </svg>`,
  ),
  wall: svgDataUrl(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 12' preserveAspectRatio='none'>
      <rect width='100' height='12' fill='%23556374' fill-opacity='0.45'/>
      <path d='M0 12 L12 0 M14 12 L26 0 M28 12 L40 0 M42 12 L54 0 M56 12 L68 0 M70 12 L82 0 M84 12 L96 0' stroke='white' stroke-opacity='0.35' stroke-width='1'/>
    </svg>`,
  ),
};
