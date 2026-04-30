import { generateLegalMoves } from "./legalMoves";
import { opponent } from "./movement";
import { getWinner } from "./winDetector";
import type { BoardState } from "./types";

export function shouldEndTurn(state: BoardState): boolean {
  if (state.turnPhase !== "awaiting_move") return false;
  if (state.diceSteps.length === 0) return true;
  return generateLegalMoves(state, state.currentPlayer).length === 0;
}

export function endTurn(state: BoardState): BoardState {
  const winner = getWinner(state);
  if (winner) {
    return {
      ...state,
      diceSteps: [],
      turnPhase: "game_over",
    };
  }

  return {
    ...state,
    currentPlayer: opponent(state.currentPlayer),
    diceSteps: [],
    currentRoll: null,
    turnPhase: "awaiting_roll",
  };
}
