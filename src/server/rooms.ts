import { randomBytes } from "node:crypto";
import {
  applyMove,
  createInitialState,
  diceToSteps,
  endTurn,
  generateLegalMoves,
  getWinner,
  rollDice,
  shouldEndTurn,
  type BoardState,
  type Player,
} from "@/game";
import type { OnlineRoomView, OnlineSeat } from "@/online/types";

type OnlineRoom = {
  id: string;
  state: BoardState;
  players: Partial<Record<Player, string>>;
  createdAt: number;
  updatedAt: number;
  version: number;
  notice?: string;
};

type RoomStore = Map<string, OnlineRoom>;

const globalRooms = globalThis as typeof globalThis & {
  __shuangluRooms?: RoomStore;
};

const rooms: RoomStore = globalRooms.__shuangluRooms ?? new Map();
globalRooms.__shuangluRooms = rooms;

function playerLabel(player: Player): string {
  return player === "white" ? "白方" : "黑方";
}

function messageForState(state: BoardState): string {
  const winner = getWinner(state);
  if (winner) return `${playerLabel(winner)}胜。`;
  if (state.turnPhase === "awaiting_roll") {
    return `${playerLabel(state.currentPlayer)}请掷骰。`;
  }
  if (state.bar[state.currentPlayer] > 0) {
    return `${playerLabel(state.currentPlayer)}尚有马在栏，必须先复马。`;
  }
  return `${playerLabel(state.currentPlayer)}行棋。`;
}

function finishRollIfNoMoves(state: BoardState): BoardState {
  if (shouldEndTurn(state)) return endTurn(state);
  return state;
}

function removeOneStep(steps: number[], step: number): number[] {
  const index = steps.indexOf(step);
  if (index === -1) return steps;
  return [...steps.slice(0, index), ...steps.slice(index + 1)];
}

function stepsText(steps: number[]): string {
  return steps.length > 0 ? steps.join(" / ") : "无";
}

function blockedRollMessage(rolled: BoardState, next: BoardState): string {
  const player = playerLabel(rolled.currentPlayer);
  const nextPlayer = playerLabel(next.currentPlayer);
  if (rolled.bar[rolled.currentPlayer] > 0) {
    return `${player}掷出 ${stepsText(rolled.diceSteps)}，但栏中马没有可复马入口，回合交给${nextPlayer}。`;
  }
  return `${player}掷出 ${stepsText(rolled.diceSteps)}，但没有合法走法，回合交给${nextPlayer}。`;
}

function blockedRemainderMessage(before: BoardState, moveStep: number, next: BoardState): string | null {
  if (next.currentPlayer === before.currentPlayer || next.turnPhase !== "awaiting_roll") return null;

  const remaining = removeOneStep(before.diceSteps, moveStep);
  if (remaining.length === 0) return null;

  return `${playerLabel(before.currentPlayer)}已走 ${moveStep} 步；剩余步数 ${stepsText(remaining)} 没有合法走法，回合交给${playerLabel(next.currentPlayer)}。`;
}

function roomCode(): string {
  let id = "";
  do {
    id = randomBytes(3).toString("hex").toUpperCase();
  } while (rooms.has(id));
  return id;
}

function touch(room: OnlineRoom): void {
  room.updatedAt = Date.now();
  room.version += 1;
}

function viewRoom(room: OnlineRoom): OnlineRoomView {
  return {
    id: room.id,
    state: room.state,
    message: room.notice ?? messageForState(room.state),
    players: {
      white: Boolean(room.players.white),
      black: Boolean(room.players.black),
    },
    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
    version: room.version,
  };
}

export function normalizeRoomId(roomId: string): string {
  return roomId.trim().toUpperCase();
}

export function createRoom(playerId: string): {
  room: OnlineRoomView;
  seat: OnlineSeat;
} {
  const now = Date.now();
  const room: OnlineRoom = {
    id: roomCode(),
    state: createInitialState(),
    players: { white: playerId },
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
  rooms.set(room.id, room);
  return { room: viewRoom(room), seat: "white" };
}

export function getRoom(roomId: string): OnlineRoom | null {
  return rooms.get(normalizeRoomId(roomId)) ?? null;
}

export function seatForPlayer(room: OnlineRoom, playerId: string): OnlineSeat {
  if (room.players.white === playerId) return "white";
  if (room.players.black === playerId) return "black";
  return "spectator";
}

export function joinRoom(roomId: string, playerId: string): {
  room: OnlineRoomView;
  seat: OnlineSeat;
} | null {
  const room = getRoom(roomId);
  if (!room) return null;

  let seat = seatForPlayer(room, playerId);
  if (seat === "spectator") {
    if (!room.players.black) {
      room.players.black = playerId;
      seat = "black";
      touch(room);
    } else if (!room.players.white) {
      room.players.white = playerId;
      seat = "white";
      touch(room);
    }
  }

  return { room: viewRoom(room), seat };
}

export function readRoom(roomId: string, playerId: string): {
  room: OnlineRoomView;
  seat: OnlineSeat;
} | null {
  const room = getRoom(roomId);
  if (!room) return null;
  return { room: viewRoom(room), seat: seatForPlayer(room, playerId) };
}

export function rollRoom(roomId: string, playerId: string): {
  room: OnlineRoomView;
  seat: OnlineSeat;
  error?: string;
} | null {
  const room = getRoom(roomId);
  if (!room) return null;
  const seat = seatForPlayer(room, playerId);
  if (seat !== room.state.currentPlayer) {
    return { room: viewRoom(room), seat, error: "not_current_player" };
  }
  if (room.state.turnPhase !== "awaiting_roll") {
    return { room: viewRoom(room), seat, error: "wrong_turn_phase" };
  }

  const roll = rollDice();
  const rolled = {
    ...room.state,
    currentRoll: roll,
    diceSteps: diceToSteps(roll, room.state.ruleConfig),
    turnPhase: "awaiting_move" as const,
  };
  room.state = finishRollIfNoMoves(rolled);
  room.notice =
    room.state.currentPlayer !== rolled.currentPlayer
      ? blockedRollMessage(rolled, room.state)
      : undefined;
  touch(room);
  return { room: viewRoom(room), seat };
}

export function moveRoom(
  roomId: string,
  playerId: string,
  from: number | "bar",
  to: number | "off",
): {
  room: OnlineRoomView;
  seat: OnlineSeat;
  error?: string;
} | null {
  const room = getRoom(roomId);
  if (!room) return null;
  const seat = seatForPlayer(room, playerId);
  if (seat !== room.state.currentPlayer) {
    return { room: viewRoom(room), seat, error: "not_current_player" };
  }

  const move = generateLegalMoves(room.state).find((candidate) => {
    return candidate.from === from && candidate.to === to;
  });
  if (!move) {
    return { room: viewRoom(room), seat, error: "illegal_move" };
  }

  const beforeMove = room.state;
  room.state = applyMove(room.state, move);
  room.notice = blockedRemainderMessage(beforeMove, move.step, room.state) ?? undefined;
  touch(room);
  return { room: viewRoom(room), seat };
}
