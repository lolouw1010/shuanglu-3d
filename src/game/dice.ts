import { DEFAULT_RULE_CONFIG } from "./constants";
import type { Die, DiceRoll, RuleConfig } from "./types";

function toDie(value: number): Die {
  return Math.min(6, Math.max(1, Math.floor(value))) as Die;
}

export function rollDice(rng: () => number = Math.random): DiceRoll {
  return [toDie(rng() * 6 + 1), toDie(rng() * 6 + 1)];
}

export function diceToSteps(
  [a, b]: DiceRoll,
  config: RuleConfig = DEFAULT_RULE_CONFIG,
): number[] {
  if (a === b && config.useDoublesAsFourSteps) return [a, a, a, a];
  return [a, b];
}
