import { describe, expect, it } from "vitest";
import { createInitialState, getVictoryType, getWinner } from "@/game";

describe("winner detection", () => {
  it("detects a winner at 15 borne-off horses", () => {
    expect(
      getWinner({
        ...createInitialState(),
        borneOff: { white: 15, black: 0 },
      }),
    ).toBe("white");
  });

  it("classifies a double win when the opponent has borne off no horses", () => {
    const state = {
      ...createInitialState(),
      borneOff: { white: 15, black: 0 },
    };

    expect(getVictoryType(state)).toBe("double_win");
  });

  it("classifies a single win when the opponent has borne off at least one horse", () => {
    const state = {
      ...createInitialState(),
      borneOff: { white: 15, black: 2 },
    };

    expect(getVictoryType(state)).toBe("single_win");
  });
});
