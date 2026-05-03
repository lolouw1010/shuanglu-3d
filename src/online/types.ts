import type { BoardState, Player } from "@/game";

export type OnlineSeat = Player | "spectator";

export type OnlineRoomView = {
  id: string;
  state: BoardState;
  message: string;
  players: Record<Player, boolean>;
  createdAt: number;
  updatedAt: number;
  version: number;
};

export type OnlineJoinResponse = {
  room: OnlineRoomView;
  playerId: string;
  seat: OnlineSeat;
};

export type OnlineActionResponse = {
  room: OnlineRoomView;
  seat: OnlineSeat;
};
