import { NextResponse } from "next/server";
import { createRoom } from "@/server/rooms";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type CreateRoomBody = {
  playerId?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as CreateRoomBody;
  if (!body.playerId) {
    return NextResponse.json({ error: "missing_player_id" }, { status: 400 });
  }

  return NextResponse.json({
    playerId: body.playerId,
    ...createRoom(body.playerId),
  });
}
