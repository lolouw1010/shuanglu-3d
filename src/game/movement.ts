import { BLACK_HOME, POINT_COUNT, WHITE_HOME } from "./constants";
import type { BoardState, Player } from "./types";

export function opponent(player: Player): Player {
  return player === "white" ? "black" : "white";
}

export function getMovementTarget(
  player: Player,
  from: number,
  step: number,
): number {
  return player === "white" ? from - step : from + step;
}

export function getBarEntryTarget(player: Player, step: number): number {
  return player === "white" ? POINT_COUNT - step : step - 1;
}

export function getExactBearOffPoint(player: Player, step: number): number {
  return player === "white" ? step - 1 : POINT_COUNT - step;
}

export function canEnterPoint(
  state: BoardState,
  player: Player,
  pointIndex: number,
): boolean {
  if (pointIndex < 0 || pointIndex >= POINT_COUNT) return false;

  const point = state.points[pointIndex];
  if (point.owner === null) return true;
  if (point.owner === player) return true;
  return point.count === 1;
}

export function allHorsesInHomeBoard(
  state: BoardState,
  player: Player,
): boolean {
  if (state.bar[player] > 0) return false;

  const home = player === "white" ? WHITE_HOME : BLACK_HOME;
  return state.points.every((point, index) => {
    if (point.owner !== player || point.count === 0) return true;
    return home.includes(index as never);
  });
}

export function countPlayerHorses(state: BoardState, player: Player): number {
  return (
    state.points.reduce((total, point) => {
      return point.owner === player ? total + point.count : total;
    }, 0) +
    state.bar[player] +
    state.borneOff[player]
  );
}

export function isPointBlockedByOpponent(
  state: BoardState,
  player: Player,
  pointIndex: number,
): boolean {
  if (pointIndex < 0 || pointIndex >= POINT_COUNT) return false;
  const point = state.points[pointIndex];
  return point.owner === opponent(player) && point.count >= 2;
}
