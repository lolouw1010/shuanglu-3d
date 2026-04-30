import { applyMove } from "./applyMove";
import { generateLegalMoves } from "./legalMoves";
import { opponent } from "./movement";
import type { AIProfile, BoardState, Move, Player } from "./types";

const profileWeights: Record<
  AIProfile,
  { hit: number; bearOff: number; makePoint: number; exposure: number }
> = {
  balanced: { hit: 50, bearOff: 100, makePoint: 25, exposure: -30 },
  aggressive: { hit: 85, bearOff: 100, makePoint: 20, exposure: -24 },
  defensive: { hit: 35, bearOff: 100, makePoint: 45, exposure: -50 },
  aesthetic: { hit: 35, bearOff: 90, makePoint: 55, exposure: -25 },
  expert: { hit: 60, bearOff: 120, makePoint: 45, exposure: -55 },
};

function leavesSingleExposed(state: BoardState, move: Move): boolean {
  if (typeof move.to !== "number") return false;
  const point = state.points[move.to];
  return point.owner === move.player && point.count === 1;
}

function scoresMadePoint(state: BoardState, move: Move): boolean {
  if (typeof move.to !== "number") return false;
  const point = state.points[move.to];
  return point.owner === move.player && point.count >= 2;
}

function advancement(move: Move, player: Player): number {
  if (typeof move.from !== "number") return 4;
  if (typeof move.to !== "number") return move.step;
  return player === "white" ? move.from - Number(move.to) : Number(move.to) - move.from;
}

function scoreMove(
  state: BoardState,
  move: Move,
  profile: AIProfile,
): number {
  const weights = profileWeights[profile];
  let score = Math.random() * 0.01;
  if (move.type === "bear_off") score += weights.bearOff;
  if (move.hitsOpponent) score += weights.hit;

  const simulated = applyMove(state, move);
  if (scoresMadePoint(simulated, move)) score += weights.makePoint;
  if (leavesSingleExposed(simulated, move)) score += weights.exposure;

  score += advancement(move, move.player) * 4;
  if (simulated.bar[opponent(move.player)] > state.bar[opponent(move.player)]) {
    score += 10;
  }

  return score;
}

export function chooseAIMove(
  state: BoardState,
  player: Player,
  profile: AIProfile = "balanced",
): Move | null {
  const moves = generateLegalMoves(state, player);
  if (moves.length === 0) return null;

  return moves
    .map((move) => ({ move, score: scoreMove(state, move, profile) }))
    .sort((a, b) => b.score - a.score)[0].move;
}
