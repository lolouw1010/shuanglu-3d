import { DEFAULT_RULE_CONFIG, INITIAL_POINTS } from "./constants";
import type { BoardState, RuleConfig } from "./types";

export function cloneState(state: BoardState): BoardState {
  return {
    points: state.points.map((point) => ({ ...point })),
    bar: { ...state.bar },
    borneOff: { ...state.borneOff },
    currentPlayer: state.currentPlayer,
    diceSteps: [...state.diceSteps],
    currentRoll: state.currentRoll ? [...state.currentRoll] : null,
    ruleConfig: { ...state.ruleConfig },
    turnPhase: state.turnPhase,
    moveHistory: state.moveHistory.map((record) => ({
      ...record,
      resultingBar: { ...record.resultingBar },
      resultingBorneOff: { ...record.resultingBorneOff },
    })),
  };
}

export function createInitialState(
  config: RuleConfig = DEFAULT_RULE_CONFIG,
): BoardState {
  if (config.horsesPerPlayer !== 15) {
    throw new Error("Only 15-horse layouts are implemented in the MVP.");
  }

  return {
    points: INITIAL_POINTS.map((point) => ({ ...point })),
    bar: { white: 0, black: 0 },
    borneOff: { white: 0, black: 0 },
    currentPlayer: "white",
    diceSteps: [],
    currentRoll: null,
    ruleConfig: { ...config },
    turnPhase: "awaiting_roll",
    moveHistory: [],
  };
}
