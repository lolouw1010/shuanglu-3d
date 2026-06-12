import type { BoardState, Move, MoveRecord } from "@/game";
import { BoardPoint } from "./BoardPoint";

type BoardProps = {
  state: BoardState;
  availableMoves: Move[];
  selectedSource: number | "bar" | null;
  targetMoves: Move[];
  onSelectSource: (source: number | "bar") => void;
  onSelectTarget: (target: number | "off") => void;
  highlightedMoves?: MoveRecord[];
};

const topRow = Array.from({ length: 12 }, (_, index) => index + 12);
const bottomRow = Array.from({ length: 12 }, (_, index) => 11 - index);

function uniqueSteps(moves: Move[]): number[] {
  return Array.from(new Set(moves.map((move) => move.step))).sort((a, b) => a - b);
}

function playerName(player: BoardState["currentPlayer"]): string {
  return player === "white" ? "白方" : "黑方";
}

function pushOrder(map: Map<number, number[]>, point: number, order: number): void {
  map.set(point, [...(map.get(point) ?? []), order]);
}

function trailMaps(moves: MoveRecord[]) {
  const from = new Map<number, number[]>();
  const to = new Map<number, number[]>();
  const hit = new Map<number, number[]>();

  moves.forEach((move, index) => {
    const order = index + 1;
    if (typeof move.from === "number") pushOrder(from, move.from, order);
    if (typeof move.to === "number") {
      pushOrder(to, move.to, order);
      if (move.hitsOpponent) pushOrder(hit, move.to, order);
    }
  });

  return { from, to, hit };
}

export function Board({
  state,
  availableMoves,
  selectedSource,
  targetMoves,
  onSelectSource,
  onSelectTarget,
  highlightedMoves = [],
}: BoardProps) {
  const latestMove = state.moveHistory.at(-1);
  const highlightedTrail = trailMaps(highlightedMoves);
  const highlightedBarMoves = highlightedMoves
    .map((move, index) => ({ move, order: index + 1 }))
    .filter(({ move }) => move.from === "bar");
  const highlightedOffMoves = highlightedMoves
    .map((move, index) => ({ move, order: index + 1 }))
    .filter(({ move }) => move.to === "off");
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
  const selectedPointLabel = typeof selectedSource === "number" ? `${selectedSource} 点` : "马栏";
  const sourceCount = selectableSources.size - (selectableSources.has("bar") ? 1 : 0);
  const targetCount = targetPoints.size + (canBearOff ? 1 : 0);
  const boardHint = (() => {
    if (state.turnPhase === "awaiting_roll") return "先掷骰；掷出后金色点位表示可点取的棋马。";
    if (state.turnPhase === "game_over") return "本局已结束，可在右侧重新开局。";
    if (mustEnterFromBar) {
      if (selectedSource === "bar") return "已选马栏；绿色点位是本回合可复马入口，数字为使用的骰步。";
      if (canSelectBar) return "尚有马在栏：先点中间马栏，再点绿色入口复马。";
      return "尚有马在栏，但当前骰面没有可复马入口。";
    }
    if (selectedSource !== null) return `已选${selectedPointLabel}；绿色“落马”点位可走，标签数字是消耗的骰步。`;
    if (availableMoves.length > 0) return `${playerName(state.currentPlayer)}行动：先点金色“点取”棋马，再点绿色“落马”位置。`;
    return "当前骰面没有合法走法，系统会交给下一方。";
  })();

  const renderPoint = (index: number, row: "top" | "bottom") => {
    const sourceMoves = availableMoves.filter((move) => move.from === index);
    const pointTargetMoves = targetMoves.filter((move) => move.to === index);

    return (
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
      aiTrailFromOrders={highlightedTrail.from.get(index)}
      aiTrailToOrders={highlightedTrail.to.get(index)}
      aiTrailHitOrders={highlightedTrail.hit.get(index)}
      canSelect={
        state.turnPhase === "awaiting_move" &&
        selectableSources.has(index)
      }
      sourceSteps={uniqueSteps(sourceMoves)}
      targetSteps={uniqueSteps(pointTargetMoves)}
      onSelectSource={() => onSelectSource(index)}
      onSelectTarget={() => onSelectTarget(index)}
    />
  );
  };

  return (
    <section className="board-scene">
      <div className="board-scroll">
        <div className="board-stage">
          <div className="board-caption mb-1.5 flex items-center justify-between gap-2 text-[11px] text-amber-100/72">
            <span>外盘</span>
            <span className="board-inscription rounded-full px-3 py-1">
              黑方 0 -&gt; 23；白方 23 -&gt; 0
            </span>
            <span>内盘与出马区</span>
          </div>

          <div className="board-action-guide mb-1.5">
            <span className="board-action-guide-main">{boardHint}</span>
            <span className="board-action-guide-stat">点取 {sourceCount}</span>
            <span className="board-action-guide-stat board-action-guide-stat-target">落马 {targetCount}</span>
          </div>

          {highlightedMoves.length > 0 ? (
            <div className="ai-turn-board-note mb-1.5">
              <span>黑方刚走 {highlightedMoves.length} 步</span>
              <span>看棋盘上的黑1起、黑1落、黑1打标记复盘路径。</span>
            </div>
          ) : null}

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
                        : highlightedBarMoves.length > 0
                          ? "board-well-ai-trail"
                          : ""
                  }`}
                  onClick={() => onSelectSource("bar")}
                >
                  <span className="board-well-detail flex flex-wrap items-center gap-2 text-xs text-stone-400">
                    <span>被打入栏，须先复马</span>
                    {mustEnterFromBar ? (
                      <span className="rounded-full border border-emerald-200/45 bg-emerald-300/16 px-2 py-0.5 font-semibold text-emerald-100">
                        点这里复马
                      </span>
                    ) : null}
                  </span>
                  <span className="board-well-count mt-0.5 block font-display text-lg text-amber-50">
                    马栏：白 {state.bar.white} / 黑 {state.bar.black}
                  </span>
                  {highlightedBarMoves.length > 0 ? (
                    <span className="mt-0.5 flex flex-wrap gap-1 text-xs text-sky-100/85">
                      {highlightedBarMoves.map(({ order }) => (
                        <span key={order} className="ai-trail-chip ai-trail-chip-from">
                          黑{order}从栏复马
                        </span>
                      ))}
                    </span>
                  ) : null}
                  {mustEnterFromBar ? (
                    <span className="board-well-detail mt-0.5 block text-xs text-emerald-100/85">
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
                      : highlightedOffMoves.length > 0
                        ? "board-well-ai-trail"
                        : latestMove?.to === "off"
                          ? "board-well-active"
                          : ""
                  }`}
                  onClick={() => onSelectTarget("off")}
                >
                  <span className="board-well-detail block text-xs text-stone-400">进入内盘后，按骰面出马</span>
                  <span className="board-well-count font-display text-lg">
                    出马：白 {state.borneOff.white} / 黑 {state.borneOff.black}
                  </span>
                  {highlightedOffMoves.length > 0 ? (
                    <span className="ml-2 inline-flex flex-wrap gap-1 align-middle text-xs text-sky-100/85">
                      {highlightedOffMoves.map(({ order }) => (
                        <span key={order} className="ai-trail-chip ai-trail-chip-to">
                          黑{order}出马
                        </span>
                      ))}
                    </span>
                  ) : null}
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
