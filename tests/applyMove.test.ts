import { describe, expect, it } from "vitest";
import { applyMove, generateLegalMoves } from "@/game";
import { emptyPoints, put, stateWithPoints } from "./helpers";

describe("move execution", () => {
  it("sends a hit opponent horse to the bar", () => {
    const points = put(put(emptyPoints(), 10, "white", 1), 7, "black", 1);
    const state = stateWithPoints(points, "white", [3]);
    const move = generateLegalMoves(state)[0];

    const next = applyMove(state, move);

    expect(next.points[7]).toEqual({ owner: "white", count: 1 });
    expect(next.bar.black).toBe(1);
  });

  it("consumes one matching dice step", () => {
    const points = put(emptyPoints(), 10, "white", 1);
    const state = stateWithPoints(points, "white", [3, 5]);
    const move = generateLegalMoves(state).find((candidate) => candidate.step === 3);

    const next = applyMove(state, move!);

    expect(next.diceSteps).toEqual([5]);
  });

  it("ends the turn when no dice steps remain", () => {
    const points = put(emptyPoints(), 10, "white", 1);
    const state = stateWithPoints(points, "white", [3]);

    const next = applyMove(state, generateLegalMoves(state)[0]);

    expect(next.currentPlayer).toBe("black");
    expect(next.turnPhase).toBe("awaiting_roll");
  });
});
