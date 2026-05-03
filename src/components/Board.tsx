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
  const barMoves = availableMoves.filter((move) => move.from === "bar");
  const mustEnterFromBar =
    state.turnPhase === "awaiting_move" && state.bar[state.currentPlayer] > 0;
  const canSelectBar = selectableSources.has("bar");
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
    <section className="board-scene">
      <div className="board-scroll overflow-x-auto">
        <div className="board-stage min-w-[1080px]">
          <div className="board-caption mb-3 flex items-center justify-between gap-3 text-xs text-amber-100/72">
            <span>外盘</span>
            <span className="board-inscription rounded-full px-3 py-1">
              黑方 0 -&gt; 23；白方 23 -&gt; 0
            </span>
            <span>内盘与出马区</span>
          </div>

          <div className="board-perspective">
            <div className="board-shell">
              <div className="board-rank board-rank-top">{topRow.map((point) => renderPoint(point, "top"))}</div>

              <div className="board-middle">
                <button
                  type="button"
                  className={`board-well board-well-bar ${
                    selectedSource === "bar"
                      ? "board-well-active"
                      : canSelectBar
                        ? "board-well-ready"
                        : ""
                  }`}
                  onClick={() => onSelectSource("bar")}
                >
                  <span className="flex flex-wrap items-center gap-2 text-xs text-stone-400">
                    <span>被打入栏，须先复马</span>
                    {mustEnterFromBar ? (
                      <span className="rounded-full border border-emerald-200/45 bg-emerald-300/16 px-2 py-0.5 font-semibold text-emerald-100">
                        点这里复马
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-1 block font-display text-xl text-amber-50">
                    马栏：白 {state.bar.white} / 黑 {state.bar.black}
                  </span>
                  {mustEnterFromBar ? (
                    <span className="mt-1 block text-xs text-emerald-100/85">
                      {selectedSource === "bar"
                        ? "已选马栏，去点绿色入口。"
                        : canSelectBar
                          ? `先点此处；可复马入口 ${barMoves.length} 个。`
                          : "本骰无可复马入口。"}
                    </span>
                  ) : null}
                </button>
                <div className="board-spine" />
                <button
                  type="button"
                  disabled={!canBearOff}
                  className={`board-well board-well-off ${
                    canBearOff
                      ? "board-well-ready"
                      : latestMove?.to === "off"
                        ? "board-well-active"
                        : ""
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

              <div className="board-rank board-rank-bottom">{bottomRow.map((point) => renderPoint(point, "bottom"))}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
