import { describe, expect, it } from "vitest";
import { getMovementTarget } from "@/game";

describe("movement direction", () => {
  it("moves white from high index to low index", () => {
    expect(getMovementTarget("white", 10, 3)).toBe(7);
  });

  it("moves black from low index to high index", () => {
    expect(getMovementTarget("black", 10, 3)).toBe(13);
  });
});
