import { applyMove } from "./applyMove";
import { POINT_COUNT, BLACK_HOME, WHITE_HOME } from "./constants";
import { generateLegalMoves } from "./legalMoves";
import {
  allHorsesInHomeBoard,
  getBarEntryTarget,
  getMovementTarget,
  opponent,
} from "./movement";
import { getWinner } from "./winDetector";
import type { AIProfile, BoardState, Move, Player } from "./types";

type ProfileWeights = {
  hit: number;
  bearOff: number;
  enterFromBar: number;
  makePoint: number;
  ownBlot: number;
  vulnerableBlot: number;
  madePoint: number;
  homeMadePoint: number;
  pip: number;
  bar: number;
  borneOff: number;
  mobility: number;
  stackPenalty: number;
};

const profileWeights: Record<AIProfile, ProfileWeights> = {
  balanced: {
    hit: 54,
    bearOff: 120,
    enterFromBar: 95,
    makePoint: 38,
    ownBlot: -18,
    vulnerableBlot: -34,
    madePoint: 13,
    homeMadePoint: 8,
    pip: 2.1,
    bar: 86,
    borneOff: 155,
    mobility: 2.6,
    stackPenalty: -4,
  },
  aggressive: {
    hit: 84,
    bearOff: 118,
    enterFromBar: 90,
    makePoint: 30,
    ownBlot: -14,
    vulnerableBlot: -25,
    madePoint: 10,
    homeMadePoint: 5,
    pip: 2.2,
    bar: 92,
    borneOff: 150,
    mobility: 2.8,
    stackPenalty: -3,
  },
  defensive: {
    hit: 42,
    bearOff: 125,
    enterFromBar: 105,
    makePoint: 52,
    ownBlot: -28,
    vulnerableBlot: -52,
    madePoint: 18,
    homeMadePoint: 12,
    pip: 1.8,
    bar: 95,
    borneOff: 155,
    mobility: 2.4,
    stackPenalty: -5,
  },
  aesthetic: {
    hit: 48,
    bearOff: 122,
    enterFromBar: 100,
    makePoint: 54,
    ownBlot: -23,
    vulnerableBlot: -43,
    madePoint: 17,
    homeMadePoint: 11,
    pip: 1.95,
    bar: 92,
    borneOff: 152,
    mobility: 2.7,
    stackPenalty: -4,
  },
  expert: {
    hit: 62,
    bearOff: 130,
    enterFromBar: 110,
    makePoint: 56,
    ownBlot: -30,
    vulnerableBlot: -58,
    madePoint: 20,
    homeMadePoint: 14,
    pip: 2.35,
    bar: 110,
    borneOff: 170,
    mobility: 3.2,
    stackPenalty: -6,
  },
};

type MovePlan = {
  moves: Move[];
  terminalState: BoardState;
  tacticalScore: number;
};

function homeBoard(player: Player): readonly number[] {
  return player === "white" ? WHITE_HOME : BLACK_HOME;
}

function pipDistanceForPoint(player: Player, index: number): number {
  return player === "white" ? index + 1 : POINT_COUNT - index;
}

function pipCount(state: BoardState, player: Player): number {
  const boardPips = state.points.reduce((total, point, index) => {
    if (point.owner !== player) return total;
    return total + point.count * pipDistanceForPoint(player, index);
  }, 0);

  return boardPips + state.bar[player] * (POINT_COUNT + 1);
}

function isPointVulnerableToHit(
  state: BoardState,
  player: Player,
  pointIndex: number,
): boolean {
  const enemy = opponent(player);

  for (let step = 1; step <= 6; step += 1) {
    if (getBarEntryTarget(enemy, step) === pointIndex && state.bar[enemy] > 0) {
      return true;
    }

    const sourceIndex = enemy === "white" ? pointIndex + step : pointIndex - step;
    if (sourceIndex < 0 || sourceIndex >= POINT_COUNT) continue;

    const source = state.points[sourceIndex];
    if (source.owner === enemy && source.count > 0) return true;
  }

  return false;
}

function countBlots(state: BoardState, player: Player): number {
  return state.points.filter((point) => point.owner === player && point.count === 1).length;
}

function countVulnerableBlots(state: BoardState, player: Player): number {
  return state.points.reduce((total, point, index) => {
    if (point.owner !== player || point.count !== 1) return total;
    return total + (isPointVulnerableToHit(state, player, index) ? 1 : 0);
  }, 0);
}

function countMadePoints(state: BoardState, player: Player): number {
  return state.points.filter((point) => point.owner === player && point.count >= 2).length;
}

function countHomeMadePoints(state: BoardState, player: Player): number {
  const home = homeBoard(player);
  return home.filter((index) => {
    const point = state.points[index];
    return point.owner === player && point.count >= 2;
  }).length;
}

function stackPenalty(state: BoardState, player: Player): number {
  return state.points.reduce((total, point) => {
    if (point.owner !== player || point.count <= 5) return total;
    return total + point.count - 5;
  }, 0);
}

function mobility(state: BoardState, player: Player): number {
  if (state.turnPhase !== "awaiting_move" || state.currentPlayer !== player) {
    return 0;
  }
  return generateLegalMoves(state, player).length;
}

function scoresMadePoint(before: BoardState, after: BoardState, move: Move): boolean {
  if (typeof move.to !== "number") return false;
  const beforePoint = before.points[move.to];
  const afterPoint = after.points[move.to];

  return (
    afterPoint.owner === move.player &&
    afterPoint.count >= 2 &&
    (beforePoint.owner !== move.player || beforePoint.count < 2)
  );
}

function leavesSourceBlot(before: BoardState, after: BoardState, move: Move): boolean {
  if (typeof move.from !== "number") return false;
  const beforePoint = before.points[move.from];
  const afterPoint = after.points[move.from];

  return (
    beforePoint.owner === move.player &&
    beforePoint.count >= 2 &&
    afterPoint.owner === move.player &&
    afterPoint.count === 1
  );
}

function scoreMoveTactics(before: BoardState, after: BoardState, move: Move, profile: AIProfile): number {
  const weights = profileWeights[profile];
  let score = 0;

  if (move.type === "bear_off") score += weights.bearOff;
  if (move.type === "enter_from_bar") score += weights.enterFromBar;
  if (move.hitsOpponent) score += weights.hit;
  if (scoresMadePoint(before, after, move)) score += weights.makePoint;

  if (leavesSourceBlot(before, after, move)) {
    score += weights.ownBlot;
    if (typeof move.from === "number" && isPointVulnerableToHit(after, move.player, move.from)) {
      score += weights.vulnerableBlot;
    }
  }

  if (typeof move.to === "number") {
    const target = after.points[move.to];
    if (target.owner === move.player && target.count === 1) {
      score += weights.ownBlot * 0.55;
      if (isPointVulnerableToHit(after, move.player, move.to)) {
        score += weights.vulnerableBlot * 0.72;
      }
    }
  }

  return score;
}

function evaluateBoard(state: BoardState, player: Player, profile: AIProfile): number {
  const enemy = opponent(player);
  const winner = getWinner(state);
  if (winner === player) return 1_000_000;
  if (winner === enemy) return -1_000_000;

  const weights = profileWeights[profile];
  let score = 0;

  score += (state.borneOff[player] - state.borneOff[enemy]) * weights.borneOff;
  score += (state.bar[enemy] - state.bar[player]) * weights.bar;
  score += (pipCount(state, enemy) - pipCount(state, player)) * weights.pip;
  score += (countMadePoints(state, player) - countMadePoints(state, enemy)) * weights.madePoint;
  score += (countHomeMadePoints(state, player) - countHomeMadePoints(state, enemy)) * weights.homeMadePoint;
  score += (countBlots(state, player) - countBlots(state, enemy)) * weights.ownBlot;
  score +=
    (countVulnerableBlots(state, player) - countVulnerableBlots(state, enemy)) *
    weights.vulnerableBlot;
  score += (mobility(state, player) - mobility(state, enemy)) * weights.mobility;
  score += (stackPenalty(state, player) - stackPenalty(state, enemy)) * weights.stackPenalty;

  if (allHorsesInHomeBoard(state, player)) score += 45;
  if (allHorsesInHomeBoard(state, enemy)) score -= 45;

  return score;
}

function compareMovesForTieBreak(a: Move, b: Move): number {
  const typeRank: Record<Move["type"], number> = {
    bear_off: 3,
    enter_from_bar: 2,
    normal: 1,
  };

  const typeDelta = typeRank[b.type] - typeRank[a.type];
  if (typeDelta !== 0) return typeDelta;

  if (b.hitsOpponent !== a.hitsOpponent) return Number(b.hitsOpponent) - Number(a.hitsOpponent);
  if (b.step !== a.step) return b.step - a.step;

  const aFrom = typeof a.from === "number" ? a.from : -1;
  const bFrom = typeof b.from === "number" ? b.from : -1;
  if (aFrom !== bFrom) return a.player === "white" ? aFrom - bFrom : bFrom - aFrom;

  const aTo = typeof a.to === "number" ? a.to : a.player === "white" ? -1 : POINT_COUNT;
  const bTo = typeof b.to === "number" ? b.to : b.player === "white" ? -1 : POINT_COUNT;
  return aTo - bTo;
}

function enumeratePlans(
  state: BoardState,
  player: Player,
  profile: AIProfile,
  depth = 0,
): MovePlan[] {
  if (state.turnPhase !== "awaiting_move" || state.currentPlayer !== player) {
    return [{ moves: [], terminalState: state, tacticalScore: 0 }];
  }

  if (depth >= 4 || state.diceSteps.length === 0) {
    return [{ moves: [], terminalState: state, tacticalScore: 0 }];
  }

  const legalMoves = generateLegalMoves(state, player).sort(compareMovesForTieBreak);
  if (legalMoves.length === 0) {
    return [{ moves: [], terminalState: state, tacticalScore: 0 }];
  }

  return legalMoves.flatMap((move) => {
    const next = applyMove(state, move);
    const moveScore = scoreMoveTactics(state, next, move, profile);
    return enumeratePlans(next, player, profile, depth + 1).map((plan) => ({
      moves: [move, ...plan.moves],
      terminalState: plan.terminalState,
      tacticalScore: moveScore + plan.tacticalScore,
    }));
  });
}

function scorePlan(plan: MovePlan, player: Player, profile: AIProfile): number {
  return (
    evaluateBoard(plan.terminalState, player, profile) +
    plan.tacticalScore +
    plan.moves.length * 7 -
    plan.terminalState.diceSteps.length * 18
  );
}

export function chooseAIMove(
  state: BoardState,
  player: Player,
  profile: AIProfile = "balanced",
): Move | null {
  const moves = generateLegalMoves(state, player);
  if (moves.length === 0) return null;

  const plans = enumeratePlans(state, player, profile).filter((plan) => plan.moves.length > 0);
  if (plans.length === 0) return moves.sort(compareMovesForTieBreak)[0];

  return plans
    .map((plan) => ({ plan, score: scorePlan(plan, player, profile) }))
    .sort((a, b) => {
      const scoreDelta = b.score - a.score;
      if (Math.abs(scoreDelta) > 0.0001) return scoreDelta;
      return compareMovesForTieBreak(a.plan.moves[0], b.plan.moves[0]);
    })[0].plan.moves[0];
}
