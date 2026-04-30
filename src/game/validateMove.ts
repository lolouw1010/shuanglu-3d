import { POINT_COUNT } from "./constants";
import { generateLegalMoves } from "./legalMoves";
import {
  allHorsesInHomeBoard,
  getBarEntryTarget,
  isPointBlockedByOpponent,
} from "./movement";
import type { BoardState, Move, MoveValidation } from "./types";

function sameMove(a: Move, b: Move): boolean {
  return (
    a.player === b.player &&
    a.type === b.type &&
    a.from === b.from &&
    a.to === b.to &&
    a.step === b.step
  );
}

export function validateMove(
  state: BoardState,
  move: Move,
): MoveValidation {
  if (state.turnPhase === "game_over") {
    return { legal: false, reason: "game_already_over" };
  }

  if (move.player !== state.currentPlayer) {
    return { legal: false, reason: "not_current_player" };
  }

  if (state.turnPhase !== "awaiting_move") {
    return { legal: false, reason: "wrong_turn_phase" };
  }

  if (!state.diceSteps.includes(move.step)) {
    return { legal: false, reason: "no_matching_dice_step" };
  }

  if (state.bar[move.player] > 0 && move.type !== "enter_from_bar") {
    return { legal: false, reason: "must_enter_from_bar_first" };
  }

  if (move.type === "enter_from_bar") {
    if (move.from !== "bar" || typeof move.to !== "number") {
      return { legal: false, reason: "target_out_of_range" };
    }
    if (move.to !== getBarEntryTarget(move.player, move.step)) {
      return { legal: false, reason: "target_out_of_range" };
    }
  }

  if (move.type === "normal") {
    if (typeof move.from !== "number") {
      return { legal: false, reason: "source_empty" };
    }
    const source = state.points[move.from];
    if (!source || source.count === 0) {
      return { legal: false, reason: "source_empty" };
    }
    if (source.owner !== move.player) {
      return { legal: false, reason: "source_not_owned" };
    }
    if (typeof move.to !== "number" || move.to < 0 || move.to >= POINT_COUNT) {
      return { legal: false, reason: "target_out_of_range" };
    }
    if (isPointBlockedByOpponent(state, move.player, move.to)) {
      return { legal: false, reason: "target_blocked_by_opponent" };
    }
  }

  if (move.type === "bear_off") {
    if (!allHorsesInHomeBoard(state, move.player)) {
      return { legal: false, reason: "not_all_horses_home" };
    }
    if (typeof move.from !== "number" || move.to !== "off") {
      return { legal: false, reason: "invalid_bear_off" };
    }
  }

  const legal = generateLegalMoves(state, move.player).some((candidate) =>
    sameMove(candidate, move),
  );

  return legal ? { legal: true } : { legal: false, reason: "invalid_bear_off" };
}
