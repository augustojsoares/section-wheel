export const TAU = 2 * Math.PI;

export function validateGeometry(inner: number, outer: number, offset: number) {
  if (!Number.isFinite(inner) || inner < 0) {
    throw new RangeError("SectionWheel: innerRadius must be finite and >= 0.");
  }
  if (!Number.isFinite(outer) || outer <= inner) {
    throw new RangeError(
      "SectionWheel: outerRadius must be finite and > innerRadius.",
    );
  }
  if (!Number.isFinite(offset) || offset < 0) {
    throw new RangeError("SectionWheel: hoverOffset must be finite and >= 0.");
  }
}

export const point = (radius: number, angle: number): [number, number] => [
  radius * Math.cos(angle),
  radius * Math.sin(angle),
];

/** Two arcs also handle a complete circle, whose start and end coincide. */
export function arcPath(radius: number, start: number, end: number) {
  const middle = (start + end) / 2;
  const sweep = end >= start ? 1 : 0;
  return `M ${point(radius, start).join(" ")} A ${radius} ${radius} 0 0 ${sweep} ${point(radius, middle).join(" ")} A ${radius} ${radius} 0 0 ${sweep} ${point(radius, end).join(" ")}`;
}

export function sectorPath(
  inner: number,
  outer: number,
  start: number,
  end: number,
) {
  const outside = arcPath(outer, start, end);
  if (inner === 0) return `${outside} L 0 0 Z`;
  const inside = arcPath(inner, end, start).replace(/^M/, "L");
  return `${outside} ${inside} Z`;
}
