import type { Point, Player } from "@/game";
import { pieceAssets } from "@/data/assets";

type BoardPointProps = {
  index: number;
  row: "top" | "bottom";
  point: Point;
  isSource: boolean;
  isTarget: boolean;
  isLastFrom: boolean;
  isLastTo: boolean;
  isHitDestination: boolean;
  canSelect: boolean;
  sourceSteps?: number[];
  targetSteps?: number[];
  onSelectSource: () => void;
  onSelectTarget: () => void;
};

function pieceAlt(owner: Player): string {
  return owner === "white" ? "白马" : "黑马";
}

export function BoardPoint({
  index,
  row,
  point,
  isSource,
  isTarget,
  isLastFrom,
  isLastTo,
  isHitDestination,
  canSelect,
  sourceSteps = [],
  targetSteps = [],
  onSelectSource,
  onSelectTarget,
}: BoardPointProps) {
  const handleClick = () => {
    if (isTarget) {
      onSelectTarget();
      return;
    }
    if (canSelect) onSelectSource();
  };
  const tone = index % 2 === 0 ? "point-lane-warm" : "point-lane-dark";
  const pointShape =
    row === "top"
      ? "point-lane-top [clip-path:polygon(0_0,100%_0,50%_100%)] top-0"
      : "point-lane-bottom [clip-path:polygon(50%_0,0_100%,100%_100%)] bottom-0";
  const owner = point.owner;
  const visibleCount = Math.min(point.count, 6);
  const pieceLayout = row === "top" ? "piece-rack-top top-7" : "piece-rack-bottom bottom-7";
  const sourceStepLabel = Array.from(new Set(sourceSteps)).join("/");
  const targetStepLabel = Array.from(new Set(targetSteps)).join("/");
  const stateLabel = isTarget
    ? `可落马${targetStepLabel ? `，骰步 ${targetStepLabel}` : ""}`
    : canSelect
      ? `可点取${sourceStepLabel ? `，可用骰步 ${sourceStepLabel}` : ""}`
      : isSource
        ? "已选中"
        : "不可操作";
  const ownerLabel = owner ? `${pieceAlt(owner)} ${point.count} 枚` : "空点";

  return (
    <button
      type="button"
      aria-label={`${index} 点，${ownerLabel}，${stateLabel}`}
      className={`point-surface point-${row} relative min-h-[clamp(6.7rem,13.2vh,9rem)] overflow-hidden border transition ${
        isTarget
          ? "point-target target-pulse border-emerald-200 bg-emerald-300/12"
          : isSource
            ? "point-selected border-amber-100 bg-amber-100/14 shadow-[inset_0_0_0_2px_rgba(251,191,36,.32)]"
            : isLastTo
              ? "point-last-to last-move-glow border-sky-200/80 bg-sky-200/10"
              : isLastFrom
                ? "point-last-from border-amber-200/45 bg-amber-100/8"
            : canSelect
              ? "point-source source-pulse border-amber-100/65 bg-amber-100/8"
              : "border-amber-100/8 bg-black/14"
      } ${canSelect || isTarget ? "point-interactive cursor-pointer hover:border-amber-100" : "cursor-default"}`}
      onClick={handleClick}
    >
      <span
        className={`point-lane absolute inset-x-1 h-[78%] ${tone} ${pointShape}`}
      />
      {isTarget ? <span className="point-target-beacon" /> : null}
      {canSelect ? <span className="point-source-beacon" /> : null}
      {isLastTo ? <span className="arrival-ripple" /> : null}
      <span
        className={`absolute left-2 z-10 text-[11px] text-amber-100/62 ${
          row === "top" ? "top-1.5" : "bottom-1.5"
        }`}
      >
        {index}
      </span>
      <div className={`piece-rack absolute inset-x-0 z-10 ${pieceLayout}`}>
        {owner
          ? Array.from({ length: visibleCount }).map((_, horseIndex) => (
              <span
                key={horseIndex}
                className={`horse-piece ${owner}-vase-piece ${
                  isLastTo && horseIndex === 0 ? "piece-arrive" : ""
                } ${isSource ? "piece-selected" : ""}`}
              >
                <img
                  src={pieceAssets[owner].idle}
                  alt={pieceAlt(owner)}
                  className="horse-piece-image"
                  draggable={false}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
                {horseIndex === visibleCount - 1 && point.count > visibleCount ? (
                  <span className="piece-count-sign">x{point.count}</span>
                ) : null}
              </span>
            ))
          : null}
      </div>
      {isLastFrom ? (
        <span
          className={`absolute right-1.5 z-20 rounded-full border border-amber-200/25 bg-black/35 px-1.5 py-0.5 text-[10px] text-amber-100/80 ${
            row === "top" ? "top-1.5" : "bottom-1.5"
          }`}
        >
          起
        </span>
      ) : null}
      {isHitDestination ? (
        <span
          className={`hit-flash absolute left-1/2 z-30 -translate-x-1/2 rounded-full border border-red-200/60 bg-red-500/25 px-2 py-0.5 text-[11px] font-semibold text-red-50 ${
            row === "top" ? "bottom-8" : "top-8"
          }`}
        >
          打
        </span>
      ) : null}
      {isLastTo && !isHitDestination ? (
        <span
          className={`absolute left-1/2 z-20 -translate-x-1/2 rounded-full border border-sky-200/45 bg-sky-300/15 px-2 py-0.5 text-[11px] font-semibold text-sky-100 ${
            row === "top" ? "bottom-8" : "top-8"
          }`}
        >
          落
        </span>
      ) : null}
      {isTarget ? (
        <span
          className={`point-action-chip point-action-chip-target absolute left-1/2 z-30 -translate-x-1/2 ${
            row === "top" ? "bottom-2" : "top-2"
          }`}
        >
          <span>落马</span>
          {targetStepLabel ? <span className="point-step-chip">{targetStepLabel}</span> : null}
        </span>
      ) : canSelect ? (
        <span
          className={`point-action-chip point-action-chip-source absolute left-1/2 z-30 -translate-x-1/2 ${
            row === "top" ? "bottom-2" : "top-2"
          }`}
        >
          <span>点取</span>
          {sourceStepLabel ? <span className="point-step-chip">{sourceStepLabel}</span> : null}
        </span>
      ) : null}
    </button>
  );
}
