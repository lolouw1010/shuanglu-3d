import { describe, expect, it } from "vitest";
import { generateLegalMoves } from "@/game";
import { emptyPoints, put, stateWithPoints } from "./helpers";

describe("bearing off", () => {
  it("does not allow bearing off before all horses are home", () => {
    const points = put(put(emptyPoints(), 0, "white", 14), 8, "white", 1);
    const state = stateWithPoints(points, "white", [1]);

    expect(generateLegalMoves(state).some((move) => move.type === "bear_off")).toBe(
      false,
    );
  });

  it("allows white to bear off from point 0 with step 1", () => {
    const points = put(emptyPoints(), 0, "white", 15);
    const state = stateWithPoints(points, "white", [1]);

    expect(generateLegalMoves(state)).toContainEqual({
      player: "white",
      type: "bear_off",
      from: 0,
      to: "off",
      step: 1,
      hitsOpponent: false,
    });
  });

  it("allows black to bear off from point 23 with step 1", () => {
    const points = put(emptyPoints(), 23, "black", 15);
    const state = stateWithPoints(points, "black", [1]);

    expect(generateLegalMoves(state)).toContainEqual({
      player: "black",
      type: "bear_off",
      from: 23,
      to: "off",
      step: 1,
      hitsOpponent: false,
    });
  });

  it("allows oversized bearing off from the farthest white horse", () => {
    const points = put(put(put(emptyPoints(), 0, "white", 5), 1, "white", 5), 4, "white", 5);
    const state = stateWithPoints(points, "white", [6]);

    expect(generateLegalMoves(state)).toContainEqual({
      player: "white",
      type: "bear_off",
      from: 4,
      to: "off",
      step: 6,
      hitsOpponent: false,
    });
  });

  it("rejects oversized bearing off when a farther white horse exists", () => {
    const points = put(put(emptyPoints(), 2, "white", 10), 5, "white", 5);
    const state = stateWithPoints(points, "white", [5]);

    expect(
      generateLegalMoves(state).some(
        (move) => move.type === "bear_off" && move.from === 2,
      ),
    ).toBe(false);
  });
});
