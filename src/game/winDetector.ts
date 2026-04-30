import type { BoardState, Player, VictoryType } from "./types";

export function getWinner(state: BoardState): Player | null {
  if (state.borneOff.white >= state.ruleConfig.horsesPerPlayer) return "white";
  if (state.borneOff.black >= state.ruleConfig.horsesPerPlayer) return "black";
  return null;
}

export function getVictoryType(
  state: BoardState,
  winner: Player = getWinner(state) as Player,
): VictoryType | null {
  if (!winner) return null;
  const loser = winner === "white" ? "black" : "white";
  return state.borneOff[loser] === 0 ? "double_win" : "single_win";
}
