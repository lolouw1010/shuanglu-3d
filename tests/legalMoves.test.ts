import { describe, expect, it } from "vitest";
import { generateLegalMoves } from "@/game";
import { emptyPoints, put, stateWithPoints } from "./helpers";

describe("legal move generation", () => {
  it("does not allow entering an opponent block", () => {
    const points = put(put(emptyPoints(), 10, "white", 1), 7, "black", 2);
    const state = stateWithPoints(points, "white", [3]);

    expect(generateLegalMoves(state)).toEqual([]);
  });

  it("allows hitting one exposed opponent horse", () => {
    const points = put(put(emptyPoints(), 10, "white", 1), 7, "black", 1);
    const state = stateWithPoints(points, "white", [3]);

    expect(generateLegalMoves(state)).toContainEqual({
      player: "white",
      type: "normal",
      from: 10,
      to: 7,
      step: 3,
      hitsOpponent: true,
    });
  });

  it("forces bar entry before board movement", () => {
    const points = put(put(emptyPoints(), 10, "white", 1), 23, "white", 1);
    const state = {
      ...stateWithPoints(points, "white", [1, 3]),
      bar: { white: 1, black: 0 },
    };

    expect(generateLegalMoves(state).every((move) => move.type === "enter_from_bar")).toBe(
      true,
    );
  });

  it("maps white bar entry from step 1 to point 23 and step 6 to point 18", () => {
    const state = {
      ...stateWithPoints(emptyPoints(), "white", [1, 6]),
      bar: { white: 1, black: 0 },
    };

    expect(generateLegalMoves(state).map((move) => move.to).sort()).toEqual([
      18, 23,
    ]);
  });

  it("maps black bar entry from step 1 to point 0 and step 6 to point 5", () => {
    const state = {
      ...stateWithPoints(emptyPoints(), "black", [1, 6]),
      bar: { white: 0, black: 1 },
    };

    expect(generateLegalMoves(state).map((move) => move.to).sort()).toEqual([
      0, 5,
    ]);
  });
});
