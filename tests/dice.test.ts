import { describe, expect, it } from "vitest";
import {
  CLASSICAL_RULE_CONFIG,
  DEFAULT_RULE_CONFIG,
  diceToSteps,
  rollDice,
} from "@/game";

describe("dice", () => {
  it("turns doubles into four movement steps in Reconstruction Mode", () => {
    expect(diceToSteps([4, 4], DEFAULT_RULE_CONFIG)).toEqual([4, 4, 4, 4]);
  });

  it("keeps doubles as two movement steps in Classical Mode", () => {
    expect(diceToSteps([4, 4], CLASSICAL_RULE_CONFIG)).toEqual([4, 4]);
  });

  it("rolls two six-sided dice", () => {
    expect(rollDice(() => 0)).toEqual([1, 1]);
    expect(rollDice(() => 0.99)).toEqual([6, 6]);
  });
});
