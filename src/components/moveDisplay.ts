import type { BoardState, MoveRecord, Player } from "@/game";

export function playerLabel(player: Player): string {
  return player === "white" ? "白方" : "黑方";
}

export function sourceLabel(source: MoveRecord["from"]): string {
  return source === "bar" ? "马栏" : `${source} 路`;
}

export function targetLabel(target: MoveRecord["to"]): string {
  return target === "off" ? "出马" : `${target} 路`;
}

export function moveText(move: MoveRecord): string {
  if (move.type === "bear_off") {
    return `${playerLabel(move.player)}从 ${sourceLabel(move.from)} 出马，用 ${move.step} 步。`;
  }
  if (move.type === "enter_from_bar") {
    return `${playerLabel(move.player)}从马栏复马到 ${targetLabel(move.to)}，用 ${move.step} 步。`;
  }
  return `${playerLabel(move.player)}从 ${sourceLabel(move.from)} 到 ${targetLabel(move.to)}，用 ${move.step} 步。`;
}

export function shortMoveText(move: MoveRecord): string {
  const action =
    move.type === "bear_off"
      ? `${sourceLabel(move.from)} -> 出马`
      : move.type === "enter_from_bar"
        ? `马栏 -> ${targetLabel(move.to)}`
        : `${sourceLabel(move.from)} -> ${targetLabel(move.to)}`;

  return `${action}，${move.step} 步${move.hitsOpponent ? "，打马" : ""}`;
}

export function latestContiguousMovesForPlayer(
  state: BoardState,
  player: Player,
): MoveRecord[] {
  const moves: MoveRecord[] = [];

  for (let index = state.moveHistory.length - 1; index >= 0; index -= 1) {
    const move = state.moveHistory[index];
    if (move.player !== player) break;
    moves.unshift(move);
  }

  return moves;
}
