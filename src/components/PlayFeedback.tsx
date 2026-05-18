import { CircleDotDashed, Footprints, Swords, Trophy } from "lucide-react";
import type { BoardState, MoveRecord } from "@/game";
import { latestContiguousMovesForPlayer, moveText, shortMoveText } from "./moveDisplay";

type PlayFeedbackProps = {
  state: BoardState;
  message: string;
};

function eventIcon(move: MoveRecord | undefined) {
  if (!move) return <CircleDotDashed size={17} />;
  if (move.hitsOpponent) return <Swords size={17} />;
  if (move.type === "bear_off") return <Trophy size={17} />;
  return <Footprints size={17} />;
}

export function PlayFeedback({ state, message }: PlayFeedbackProps) {
  const latest = state.moveHistory.at(-1);
  const latestBlackTurn = latestContiguousMovesForPlayer(state, "black");

  return (
    <section
      key={`${state.moveHistory.length}-${state.currentPlayer}-${state.turnPhase}`}
      className="feedback-enter rounded border border-amber-200/20 bg-[#241210]/90 px-4 py-3 text-sm text-stone-100"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-[260px] flex-1 items-center gap-3">
          <span
            className={`grid size-9 shrink-0 place-items-center rounded border ${
              latest?.hitsOpponent
                ? "border-red-200/50 bg-red-400/12 text-red-100"
                : latest?.type === "bear_off"
                  ? "border-emerald-200/50 bg-emerald-300/12 text-emerald-100"
                  : "border-amber-200/35 bg-amber-100/10 text-amber-100"
            }`}
          >
            {eventIcon(latest)}
          </span>
          <div className="min-w-0">
            <p className="text-xs text-amber-200/75">当前</p>
            <p className="truncate text-amber-50">{message}</p>
          </div>
        </div>

        <div className="min-w-[260px] flex-1 rounded border border-stone-200/10 bg-black/18 px-3 py-2 text-xs text-stone-300">
          <span className="mr-2 text-stone-500">上一手</span>
          {latest ? (
            <span className="text-stone-200">
              {moveText(latest)}
              {latest.hitsOpponent ? " 打马成功。" : ""}
            </span>
          ) : (
            <span>尚未行棋，先掷骰。</span>
          )}
        </div>
      </div>

      {latestBlackTurn.length > 0 ? (
        <div className="mt-2 rounded border border-sky-200/20 bg-sky-300/10 px-3 py-2 text-xs text-sky-50">
          <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold text-sky-100">黑方刚走 {latestBlackTurn.length} 步</span>
            <span className="text-sky-100/65">棋盘已标出“黑1起 / 黑1落”等路径</span>
          </div>
          <ol className="grid gap-1 sm:grid-cols-2">
            {latestBlackTurn.map((move, index) => (
              <li
                key={`${index}-${move.from}-${move.to}-${move.step}-${move.type}`}
                className="rounded border border-sky-200/15 bg-black/18 px-2 py-1 text-sky-50/90"
              >
                <span className="mr-1 font-mono text-sky-200">黑{index + 1}</span>
                {shortMoveText(move)}
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </section>
  );
}
