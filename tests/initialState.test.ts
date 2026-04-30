import { describe, expect, it } from "vitest";
import {
  CLASSICAL_RULE_CONFIG,
  DEFAULT_RULE_CONFIG,
  countPlayerHorses,
  createInitialState,
} from "@/game";

describe("initial state", () => {
  it("creates a 24-point board", () => {
    expect(createInitialState().points).toHaveLength(24);
  });

  it("gives each player 15 horses", () => {
    const state = createInitialState();
    expect(countPlayerHorses(state, "white")).toBe(15);
    expect(countPlayerHorses(state, "black")).toBe(15);
  });

  it("uses Reconstruction Mode as the MVP default", () => {
    expect(createInitialState().ruleConfig).toEqual(DEFAULT_RULE_CONFIG);
  });

  it("accepts Classical Mode while keeping the 15-horse layout", () => {
    const state = createInitialState(CLASSICAL_RULE_CONFIG);
    expect(state.ruleConfig).toEqual(CLASSICAL_RULE_CONFIG);
    expect(countPlayerHorses(state, "white")).toBe(15);
    expect(countPlayerHorses(state, "black")).toBe(15);
  });

  it("rejects future quick layouts until they are implemented", () => {
    expect(() =>
      createInitialState({
        ...DEFAULT_RULE_CONFIG,
        mode: "quick",
        horsesPerPlayer: 12,
      }),
    ).toThrow("Only 15-horse layouts are implemented in the MVP.");
  });
});
