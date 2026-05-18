import { describe, expect, it } from "vitest";
import { createInitialState, type MoveRecord } from "@/game";
import { latestContiguousMovesForPlayer } from "@/components/moveDisplay";

function record(partial: Pick<MoveRecord, "player" | "type" | "from" | "to" | "step">): MoveRecord {
  return {
    ...partial,
    hitsOpponent: false,
    resultingBar: { white: 0, black: 0 },
    resultingBorneOff: { white: 0, black: 0 },
  };
}

describe("move display helpers", () => {
  it("returns only the latest contiguous black move sequence", () => {
    const state = createInitialState();
    state.moveHistory = [
      record({ player: "black", type: "normal", from: 0, to: 3, step: 3 }),
      record({ player: "white", type: "normal", from: 23, to: 18, step: 5 }),
      record({ player: "black", type: "normal", from: 11, to: 14, step: 3 }),
      record({ player: "black", type: "normal", from: 14, to: 18, step: 4 }),
    ];

    expect(latestContiguousMovesForPlayer(state, "black")).toEqual([
      state.moveHistory[2],
      state.moveHistory[3],
    ]);
  });

  it("returns no black sequence when the latest move belongs to white", () => {
    const state = createInitialState();
    state.moveHistory = [
      record({ player: "black", type: "normal", from: 0, to: 3, step: 3 }),
      record({ player: "white", type: "normal", from: 23, to: 18, step: 5 }),
    ];

    expect(latestContiguousMovesForPlayer(state, "black")).toEqual([]);
  });
});
