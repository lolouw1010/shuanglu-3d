import type { BoardState, Move } from "@/game";
import { BoardPoint } from "./BoardPoint";

type BoardProps = {
  state: BoardState;
  availableMoves: Move[];
  selectedSource: number | "bar" | null;
  targetMoves: Move[];
  onSelectSource: (source: number | "bar") => void;
  onSelectTarget: (target: number | "off") => void;
};

const topRow = Array.from({ length: 12 }, (_, index) => index + 12);
const bottomRow = Array.from({ length: 12 }, (_, index) => 11 - index);

export function Board({
  state,
  availableMoves,
  selectedSource,
  targetMoves,
  onSelectSource,
  onSelectTarget,
}: BoardProps) {
  const latestMove = state.moveHistory.at(-1);
  const selectableSources = new Set(availableMoves.map((move) => move.from));
  const targetPoints = new Set(
    targetMoves
      .filter((move) => typeof move.to === "number")
      .map((move) => move.to),
  );
  const canBearOff = targetMoves.some((move) => move.to === "off");

  const renderPoint = (index: number, row: "top" | "bottom") => (
    <BoardPoint
      key={index}
      index={index}
      row={row}
      point={state.points[index]}
      isSource={selectedSource === index}
      isTarget={targetPoints.has(index)}
      isLastFrom={latestMove?.from === index}
      isLastTo={latestMove?.to === index}
      isHitDestination={latestMove?.to === index && latestMove.hitsOpponent}
      canSelect={
        state.turnPhase === "awaiting_move" &&
        selectableSources.has(index)
      }
      onSelectSource={() => onSelectSource(index)}
      onSelectTarget={() => onSelectTarget(index)}
    />
  );

  return (
    <section className="board-ambient rounded border border-amber-200/20 bg-[linear-gradient(135deg,#4a1716,#140d0c_48%,#25140f)] p-4 shadow-lacquer">
      <div className="overflow-x-auto">
        <div className="min-w-[920px]">
          <div className="mb-3 flex items-center justify-between gap-3 text-xs text-amber-100/72">
            <span>外盘</span>
            <span className="rounded border border-amber-200/18 bg-black/20 px-3 py-1">
              黑方 0 -&gt; 23；白方 23 -&gt; 0
            </span>
            <span>内盘与出马区</span>
          </div>

          <div className="rounded border border-amber-200/18 bg-[#170d0b] p-3 shadow-[inset_0_0_45px_rgba(0,0,0,.4)]">
            <div className="grid grid-cols-12 gap-1">{topRow.map((point) => renderPoint(point, "top"))}</div>

            <div className="my-3 grid grid-cols-[1fr_10px_1fr] items-stretch gap-3">
              <button
                type="button"
                className={`rounded border px-4 py-3 text-sm transition ${
                  selectedSource === "bar"
                    ? "border-amber-100 bg-amber-100/20 text-amber-50 shadow-[0_0_0_2px_rgba(251,191,36,.18)]"
                    : selectableSources.has("bar")
                    ? "border-amber-100 bg-amber-100/16 text-amber-50"
                    : "border-amber-100/14 bg-black/22 text-stone-300"
                }`}
                onClick={() => onSelectSource("bar")}
              >
                <span className="block text-xs text-stone-400">被打入栏，须先复马</span>
                <span className="font-display text-xl text-amber-50">
                  栏：白 {state.bar.white} / 黑 {state.bar.black}
                </span>
              </button>
              <div className="center-rail rounded-full bg-[linear-gradient(#d6a250,#6f351c,#d6a250)]" />
              <button
                type="button"
                disabled={!canBearOff}
                className={`rounded border px-4 py-3 text-sm transition ${
                  canBearOff
                    ? "border-emerald-200/60 bg-emerald-300/14 text-emerald-100"
                    : latestMove?.to === "off"
                    ? "border-emerald-200/35 bg-emerald-300/10 text-emerald-100"
                    : "border-amber-100/14 bg-black/22 text-stone-500"
                }`}
                onClick={() => onSelectTarget("off")}
              >
                <span className="block text-xs text-stone-400">进入内盘后，按骰面出马</span>
                <span className="font-display text-xl">
                  出马：白 {state.borneOff.white} / 黑 {state.borneOff.black}
                </span>
                {latestMove?.to === "off" ? (
                  <span className="ml-2 rounded-full border border-emerald-200/45 bg-emerald-300/15 px-2 py-0.5 text-xs text-emerald-100">
                    刚出马
                  </span>
                ) : null}
              </button>
            </div>

            <div className="grid grid-cols-12 gap-1">{bottomRow.map((point) => renderPoint(point, "bottom"))}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
