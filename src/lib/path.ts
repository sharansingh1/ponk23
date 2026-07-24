export type PathPoint = { x: number; y: number };

// Round to 3 decimals so the serialized path string is identical on the
// server and the client. Math.sin can differ in the last ULP between the
// SSR and browser runtimes, and the raw floats would render as slightly
// different `d` strings → React hydration mismatch. Fixed precision removes
// that (and trims the markup).
const r = (v: number): number => Math.round(v * 1000) / 1000;

/** Catmull-Rom to cubic-bezier conversion for a smooth, organic SVG path through the given points. */
export function pointsToSmoothPath(points: PathPoint[]): string {
  if (points.length < 2) return "";
  let d = `M ${r(points[0].x)} ${r(points[0].y)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const cp1x = r(p1.x + (p2.x - p0.x) / 6);
    const cp1y = r(p1.y + (p2.y - p0.y) / 6);
    const cp2x = r(p2.x - (p3.x - p1.x) / 6);
    const cp2y = r(p2.y - (p3.y - p1.y) / 6);

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${r(p2.x)} ${r(p2.y)}`;
  }

  return d;
}

const VIEW_WIDTH = 200;
const SECTION_HEIGHT = 1000;
const STEPS_PER_SECTION = 4;

/** Generates a winding road down a virtual coordinate space, one "section" tall per stop. */
export function generateRoadPoints(stopCount: number): PathPoint[] {
  const totalSteps = Math.max(1, stopCount) * STEPS_PER_SECTION;
  const points: PathPoint[] = [];

  for (let i = 0; i <= totalSteps; i++) {
    const t = i / totalSteps;
    const x = VIEW_WIDTH / 2 + Math.sin(t * Math.PI * stopCount * 0.85) * (VIEW_WIDTH * 0.32);
    const y = t * stopCount * SECTION_HEIGHT;
    points.push({ x, y });
  }

  return points;
}

/** The point on the road for a given stop index, so node markers sit exactly on the drawn path. */
export function roadPointForStop(stopIndex: number, stopCount: number): PathPoint {
  const t = (stopIndex + 0.5) / stopCount;
  const x = VIEW_WIDTH / 2 + Math.sin(t * Math.PI * stopCount * 0.85) * (VIEW_WIDTH * 0.32);
  const y = t * stopCount * SECTION_HEIGHT;
  return { x: r(x), y: r(y) };
}

export const ROAD_VIEW_WIDTH = VIEW_WIDTH;
export const ROAD_SECTION_HEIGHT = SECTION_HEIGHT;
