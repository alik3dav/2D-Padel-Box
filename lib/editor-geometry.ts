import type { AlignmentGuide, EditorObject } from "@/lib/editor-types";

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function getRotatedBoundingSize(width: number, height: number, rotation: number) {
  const radians = (rotation * Math.PI) / 180;
  const cos = Math.abs(Math.cos(radians));
  const sin = Math.abs(Math.sin(radians));

  return {
    width: width * cos + height * sin,
    height: width * sin + height * cos,
  };
}

type SnapResult = {
  rect: Rect;
  guides: AlignmentGuide[];
};

const SNAP_THRESHOLD = 0.35;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const centerX = (rect: Rect) => rect.x + rect.width / 2;
const centerY = (rect: Rect) => rect.y + rect.height / 2;
const right = (rect: Rect) => rect.x + rect.width;
const bottom = (rect: Rect) => rect.y + rect.height;

export function clampRectToPlot(rect: Rect, plotWidth: number, plotHeight: number, rotation = 0): Rect {
  const rotatedSize = getRotatedBoundingSize(rect.width, rect.height, rotation);
  const minX = (rotatedSize.width - rect.width) / 2;
  const minY = (rotatedSize.height - rect.height) / 2;
  const maxX = plotWidth - (rotatedSize.width + rect.width) / 2;
  const maxY = plotHeight - (rotatedSize.height + rect.height) / 2;

  return {
    ...rect,
    x: clamp(rect.x, minX, Math.max(minX, maxX)),
    y: clamp(rect.y, minY, Math.max(minY, maxY)),
  };
}

export function roundToGrid(value: number, gridSize: number) {
  return Math.round(value / gridSize) * gridSize;
}

function buildGuide(axis: "x" | "y", position: number, a: Rect, b: Rect): AlignmentGuide {
  if (axis === "x") {
    return {
      id: `${axis}-${position.toFixed(3)}-${a.y.toFixed(3)}-${b.y.toFixed(3)}`,
      axis,
      position,
      start: Math.min(a.y, b.y),
      end: Math.max(bottom(a), bottom(b)),
    };
  }

  return {
    id: `${axis}-${position.toFixed(3)}-${a.x.toFixed(3)}-${b.x.toFixed(3)}`,
    axis,
    position,
    start: Math.min(a.x, b.x),
    end: Math.max(right(a), right(b)),
  };
}

export function snapRect(
  rect: Rect,
  objects: EditorObject[],
  ignoreIds: Set<string>,
  gridSize: number,
  snapEnabled: boolean,
  plotWidth: number,
  plotHeight: number,
  movingRotation = 0,
): SnapResult {
  const candidate: Rect = { ...rect };
  const guides: AlignmentGuide[] = [];

  if (snapEnabled) {
    candidate.x = roundToGrid(candidate.x, gridSize);
    candidate.y = roundToGrid(candidate.y, gridSize);
  }

  if (!snapEnabled) {
    return { rect: clampRectToPlot(candidate, plotWidth, plotHeight, movingRotation), guides };
  }

  let bestDeltaX = 0;
  let bestDeltaY = 0;
  let bestAbsX = Infinity;
  let bestAbsY = Infinity;
  let guideX: AlignmentGuide | null = null;
  let guideY: AlignmentGuide | null = null;

  const movingXPoints = [candidate.x, centerX(candidate), right(candidate)];
  const movingYPoints = [candidate.y, centerY(candidate), bottom(candidate)];

  for (const other of objects) {
    if (ignoreIds.has(other.id)) {
      continue;
    }

    const otherRect: Rect = { x: other.x, y: other.y, width: other.width, height: other.height };
    const otherXPoints = [otherRect.x, centerX(otherRect), right(otherRect)];
    const otherYPoints = [otherRect.y, centerY(otherRect), bottom(otherRect)];

    for (const movingPoint of movingXPoints) {
      for (const otherPoint of otherXPoints) {
        const delta = otherPoint - movingPoint;
        const absDelta = Math.abs(delta);
        if (absDelta <= SNAP_THRESHOLD && absDelta < bestAbsX) {
          bestAbsX = absDelta;
          bestDeltaX = delta;
          guideX = buildGuide("x", otherPoint, candidate, otherRect);
        }
      }
    }

    for (const movingPoint of movingYPoints) {
      for (const otherPoint of otherYPoints) {
        const delta = otherPoint - movingPoint;
        const absDelta = Math.abs(delta);
        if (absDelta <= SNAP_THRESHOLD && absDelta < bestAbsY) {
          bestAbsY = absDelta;
          bestDeltaY = delta;
          guideY = buildGuide("y", otherPoint, candidate, otherRect);
        }
      }
    }
  }

  if (bestAbsX !== Infinity) {
    candidate.x += bestDeltaX;
    if (guideX) {
      guides.push(guideX);
    }
  }

  if (bestAbsY !== Infinity) {
    candidate.y += bestDeltaY;
    if (guideY) {
      guides.push(guideY);
    }
  }

  return {
    rect: clampRectToPlot(candidate, plotWidth, plotHeight, movingRotation),
    guides,
  };
}
