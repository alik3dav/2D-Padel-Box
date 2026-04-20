import type { EditorObject } from "@/lib/editor-types";

const cssUrl = (value: string) => `url("${value}")`;

/**
 * HOW TO SET AN SVG OBJECT SKIN VIA SERVER URL
 *
 * 1) Upload your SVG file to your server/CDN/public folder.
 * 2) Copy the full public URL (for example: https://cdn.example.com/padel-court.svg).
 * 3) Set that URL for the object type in `objectSvgBackgrounds`.
 * 4) Save and refresh the editor.
 */
export const objectSvgBackgrounds: Partial<Record<EditorObject["type"], string>> = {
  "padel-court": cssUrl("https://cxkxdsbfhfoaxgiwkyez.supabase.co/storage/v1/object/public/svgtest/20x10.svg"),
  "single-court": cssUrl("https://cxkxdsbfhfoaxgiwkyez.supabase.co/storage/v1/object/public/svgtest/20x10.svg"),
  wall: cssUrl("https://example.com/assets/wall.svg"),
};
