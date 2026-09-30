import { describe, expect, it } from "vitest";
import { sectorPath, TAU, validateGeometry } from "../src/geometry";

describe("wheel geometry", () => {
  it.each([
    [-1, 200, 10],
    [200, 100, 10],
    [100, 100, 10],
    [0, 0, 0],
    [100, 200, -1],
    [NaN, 200, 1],
    [100, Infinity, 1],
    [100, 200, NaN],
  ])("rejects invalid geometry (%s, %s, %s)", (inner, outer, offset) => {
    expect(() => validateGeometry(inner, outer, offset)).toThrow(RangeError);
  });
  it("accepts a pie with no offset", () =>
    expect(() => validateGeometry(0, 200, 0)).not.toThrow());
  it("draws a full ring with two arcs per circumference", () => {
    expect(sectorPath(100, 200, 0, TAU).match(/ A /g)).toHaveLength(4);
  });
  it("closes a pie at its center without a zero-radius arc", () => {
    const path = sectorPath(0, 200, 0, TAU);
    expect(path.match(/ A /g)).toHaveLength(2);
    expect(path.endsWith("L 0 0 Z")).toBe(true);
  });
});
