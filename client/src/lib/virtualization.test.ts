import { describe, expect, it } from "vitest";
import { getVisibleRangeCount } from "./virtualization";

describe("getVisibleRangeCount", () => {
  it("caps visible range to total items", () => {
    expect(getVisibleRangeCount(20, 8)).toBe(8);
    expect(getVisibleRangeCount(5, 20)).toBe(5);
  });

  it("returns zero for invalid ranges", () => {
    expect(getVisibleRangeCount(0, 8)).toBe(0);
    expect(getVisibleRangeCount(5, 0)).toBe(0);
  });
});
