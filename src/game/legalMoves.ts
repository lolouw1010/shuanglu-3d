import { BLACK_HOME, POINT_COUNT, WHITE_HOME } from "./constants";
import {
  allHorsesInHomeBoard,
  canEnterPoint,
  getBarEntryTarget,
  getExactBearOffPoint,
  getMovementTarget,
  opponent,
} from "./movement";
import type { BoardState, Move, Player } from "./types";

function isHit(state: BoardState, player: Player, target: number): boolean {
  const point = state.points[target];
  return point.owner === opponent(player) && point.count === 1;
}

function pushUnique(moves: Move[], move: Move): void {
  const key = `${move.player}:${move.type}:${move.from}:${move.to}:${move.step}`;
  const exists = moves.some((candidate) => {
    return `${candidate.player}:${candidate.type}:${candidate.from}:${candidate.to}:${candidate.step}` === key;
  });
  if (!exists) moves.push(move);
}

function generateBarMoves(state: BoardState, player: Player): Move[] {
  const moves: Move[] = [];
  for (const step of new Set(state.diceSteps)) {
    const target = getBarEntryTarget(player, step);
    if (!canEnterPoint(state, player, target)) continue;

    pushUnique(moves, {
      player,
      type: "enter_from_bar",
      from: "bar",
      to: target,
      step,
      hitsOpponent: isHit(state, player, target),
    });
  }
  return moves;
}

function generateBearOffMoves(state: BoardState, player: Player): Move[] {
  if (!allHorsesInHomeBoard(state, player)) return [];

  const moves: Move[] = [];
  const home = player === "white" ? WHITE_HOME : BLACK_HOME;

  for (const step of new Set(state.diceSteps)) {
    const exactPoint = getExactBearOffPoint(player, step);
    const exact = state.points[exactPoint];

    if (home.includes(exactPoint as never) && exact.owner === player) {
      pushUnique(moves, {
        player,
        type: "bear_off",
        from: exactPoint,
        to: "off",
        step,
        hitsOpponent: false,
      });
      continue;
    }

    const occupiedHomePoints = home
      .filter((index) => state.points[index].owner === player)
      .map(Number);

    if (occupiedHomePoints.length === 0) continue;

    if (player === "white") {
      const farthest = Math.max(...occupiedHomePoints);
      if (farthest < exactPoint) {
        pushUnique(moves, {
          player,
          type: "bear_off",
          from: farthest,
          to: "off",
          step,
          hitsOpponent: false,
        });
      }
    } else {
      const farthest = Math.min(...occupiedHomePoints);
      if (farthest > exactPoint) {
        pushUnique(moves, {
          player,
          type: "bear_off",
          from: farthest,
          to: "off",
          step,
          hitsOpponent: false,
        });
      }
    }
  }

  return moves;
}

export function generateLegalMoves(
  state: BoardState,
  player: Player = state.currentPlayer,
): Move[] {
  if (state.turnPhase !== "awaiting_move") return [];
  if (player !== state.currentPlayer) return [];
  if (state.diceSteps.length === 0) return [];

  if (state.bar[player] > 0) {
    return generateBarMoves(state, player);
  }

  const moves: Move[] = [];
  for (let from = 0; from < POINT_COUNT; from += 1) {
    const source = state.points[from];
    if (source.owner !== player || source.count === 0) continue;

    for (const step of new Set(state.diceSteps)) {
      const target = getMovementTarget(player, from, step);
      if (target < 0 || target >= POINT_COUNT) continue;
      if (!canEnterPoint(state, player, target)) continue;

      pushUnique(moves, {
        player,
        type: "normal",
        from,
        to: target,
        step,
        hitsOpponent: isHit(state, player, target),
      });
    }
  }

  for (const move of generateBearOffMoves(state, player)) {
    pushUnique(moves, move);
  }

  return moves;
}
