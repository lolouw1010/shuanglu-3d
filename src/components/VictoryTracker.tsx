import { Flag, Trophy } from "lucide-react";
import type { BoardState, Player } from "@/game";

type VictoryTrackerProps = {
  state: BoardState;
};

function playerName(player: Player): string {
  return player === "white" ? "白方" : "黑方";
}

function progressWidth(done: number, total: number): string {
  return `${Math.min(100, Math.round((done / total) * 100))}%`;
}

function PlayerProgress({
  player,
  active,
  state,
}: {
  player: Player;
  active: boolean;
  state: BoardState;
}) {
  const total = state.ruleConfig.horsesPerPlayer;
  const done = state.borneOff[player];
  const remaining = total - done;

  return (
    <div
      className={`rounded border px-3 py-2 ${
        active
          ? "border-amber-200/65 bg-amber-100/12"
          : "border-stone-200/10 bg-black/20"
      }`}
    >
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] text-stone-400">{active ? "当前行动" : "等待"}</p>
          <h3 className="font-display text-lg text-amber-50">{playerName(player)}</h3>
        </div>
        <p className="font-display text-xl text-amber-100">
          {done}
          <span className="text-xs text-stone-400">/{total}</span>
        </p>
      </div>
      <div className="h-2 overflow-hidden rounded bg-black/45">
        <div
          className={`h-full rounded ${
            player === "white" ? "bg-stone-100" : "bg-amber-500"
          }`}
          style={{ width: progressWidth(done, total) }}
        />
      </div>
      <p className="mt-1.5 text-xs text-stone-300">
        还差 <span className="text-amber-100">{remaining}</span> 枚出马取胜
        {state.bar[player] > 0 ? `；栏中 ${state.bar[player]} 枚须先复马` : ""}
      </p>
    </div>
  );
}

export function VictoryTracker({ state }: VictoryTrackerProps) {
  return (
    <section className="rounded border border-amber-200/25 bg-[#1b1110]/92 p-3 shadow-[0_18px_60px_rgba(0,0,0,.22)]">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded border border-amber-200/35 bg-amber-100/10 text-amber-100">
            <Trophy size={17} />
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-amber-200/70">
              Win Condition
            </p>
            <h2 className="font-display text-xl text-amber-50">
              先出完 15 枚马即胜
            </h2>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 rounded border border-amber-200/25 bg-black/18 px-2.5 py-1.5 text-xs text-stone-300">
          <Flag size={14} className="text-amber-100" />
          对手一枚都未出时获胜，记为双胜；MVP 没有压胜。
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <PlayerProgress
          player="white"
          active={state.currentPlayer === "white"}
          state={state}
        />
        <PlayerProgress
          player="black"
          active={state.currentPlayer === "black"}
          state={state}
        />
      </div>
    </section>
  );
}
