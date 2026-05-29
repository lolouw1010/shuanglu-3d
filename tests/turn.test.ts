import { describe, expect, it } from "vitest";
import { applyMove, endTurn, generateLegalMoves, shouldEndTurn } from "@/game";
import { emptyPoints, put, stateWithPoints } from "./helpers";

describe("turn ending", () => {
  it("keeps the current turn when a bar entry is available", () => {
    const state = {
      ...stateWithPoints(emptyPoints(), "white", [1, 6]),
      bar: { white: 1, black: 0 },
    };

    expect(generateLegalMoves(state).map((move) => move.to).sort()).toEqual([18, 23]);
    expect(shouldEndTurn(state)).toBe(false);
  });

  it("ends the turn when every rolled bar entry point is blocked", () => {
    let points = emptyPoints();
    points = put(points, 23, "black", 2);
    points = put(points, 18, "black", 2);
    const state = {
      ...stateWithPoints(points, "white", [1, 6]),
      bar: { white: 1, black: 0 },
    };

    expect(generateLegalMoves(state)).toEqual([]);
    expect(shouldEndTurn(state)).toBe(true);
    expect(endTurn(state).currentPlayer).toBe("black");
  });

  it("ends the turn when remaining dice cannot be used after a move", () => {
    let points = emptyPoints();
    points = put(points, 10, "white", 1);
    points = put(points, 4, "black", 2);
    points = put(points, 1, "black", 2);
    const state = stateWithPoints(points, "white", [3, 6]);

    const onlyMove = generateLegalMoves(state);

    expect(onlyMove).toEqual([
      {
        player: "white",
        type: "normal",
        from: 10,
        to: 7,
        step: 3,
        hitsOpponent: false,
      },
    ]);

    const next = applyMove(state, onlyMove[0]);

    expect(next.currentPlayer).toBe("black");
    expect(next.turnPhase).toBe("awaiting_roll");
  });
});
