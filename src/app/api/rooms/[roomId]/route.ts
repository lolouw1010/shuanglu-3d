import { NextResponse } from "next/server";
import {
  joinRoom,
  moveRoom,
  normalizeRoomId,
  readRoom,
  rollRoom,
} from "@/server/rooms";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RoomParams = {
  params: Promise<{
    roomId: string;
  }>;
};

type RoomActionBody = {
  playerId?: string;
  action?: "join" | "roll" | "move";
  from?: number | "bar";
  to?: number | "off";
};

function responseForResult<T>(
  result: (T & { error?: string }) | null,
  notFoundMessage = "room_not_found",
) {
  if (!result) return NextResponse.json({ error: notFoundMessage }, { status: 404 });
  if (result.error) return NextResponse.json(result, { status: 409 });
  return NextResponse.json(result);
}

export async function GET(request: Request, { params }: RoomParams) {
  const roomId = normalizeRoomId((await params).roomId);
  const url = new URL(request.url);
  const playerId = url.searchParams.get("playerId");
  if (!playerId) {
    return NextResponse.json({ error: "missing_player_id" }, { status: 400 });
  }

  return responseForResult(readRoom(roomId, playerId));
}

export async function POST(request: Request, { params }: RoomParams) {
  const roomId = normalizeRoomId((await params).roomId);
  const body = (await request.json().catch(() => ({}))) as RoomActionBody;
  if (!body.playerId) {
    return NextResponse.json({ error: "missing_player_id" }, { status: 400 });
  }

  if (body.action === "join") {
    return responseForResult(joinRoom(roomId, body.playerId));
  }

  if (body.action === "roll") {
    return responseForResult(rollRoom(roomId, body.playerId));
  }

  if (body.action === "move") {
    if (
      (typeof body.from !== "number" && body.from !== "bar") ||
      (typeof body.to !== "number" && body.to !== "off")
    ) {
      return NextResponse.json({ error: "invalid_move_payload" }, { status: 400 });
    }

    return responseForResult(
      moveRoom(roomId, body.playerId, body.from, body.to),
    );
  }

  return NextResponse.json({ error: "unknown_action" }, { status: 400 });
}
