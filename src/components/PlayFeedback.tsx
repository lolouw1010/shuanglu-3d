import { CircleDotDashed, Footprints, Swords, Trophy } from "lucide-react";
import type { BoardState, MoveRecord, Player } from "@/game";

type PlayFeedbackProps = {
  state: BoardState;
  message: string;
};

function playerLabel(player: Player): string {
  return player === "white" ? "白方" : "黑方";
}

function sourceLabel(source: MoveRecord["from"]): string {
  return source === "bar" ? "马栏" : `${source} 路`;
}

function targetLabel(target: MoveRecord["to"]): string {
  return target === "off" ? "出马" : `${target} 路`;
}

function moveText(move: MoveRecord): string {
  if (move.type === "bear_off") {
    return `${playerLabel(move.player)}从 ${sourceLabel(move.from)} 出马，用 ${move.step} 步。`;
  }
  if (move.type === "enter_from_bar") {
    return `${playerLabel(move.player)}从马栏复马到 ${targetLabel(move.to)}，用 ${move.step} 步。`;
  }
  return `${playerLabel(move.player)}从 ${sourceLabel(move.from)} 到 ${targetLabel(move.to)}，用 ${move.step} 步。`;
}

function eventIcon(move: MoveRecord | undefined) {
  if (!move) return <CircleDotDashed size={17} />;
  if (move.hitsOpponent) return <Swords size={17} />;
  if (move.type === "bear_off") return <Trophy size={17} />;
  return <Footprints size={17} />;
}

export function PlayFeedback({ state, message }: PlayFeedbackProps) {
  const latest = state.moveHistory.at(-1);

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
    </section>
  );
}
