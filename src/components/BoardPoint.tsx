import type { Point, Player } from "@/game";

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
  onSelectSource: () => void;
  onSelectTarget: () => void;
};

function horseClass(owner: Player | null): string {
  if (owner === "white") {
    return "border-stone-900/40 bg-stone-100 text-stone-950";
  }
  if (owner === "black") {
    return "border-amber-100/30 bg-stone-950 text-amber-100";
  }
  return "";
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
  const tone = index % 2 === 0 ? "bg-[#7b2d24]" : "bg-[#281412]";
  const pointShape =
    row === "top"
      ? "[clip-path:polygon(0_0,100%_0,50%_100%)] top-0"
      : "[clip-path:polygon(50%_0,0_100%,100%_100%)] bottom-0";
  const stackPosition =
    row === "top"
      ? "top-6 flex-col"
      : "bottom-6 flex-col-reverse";

  return (
    <button
      type="button"
      className={`point-surface relative min-h-40 overflow-hidden border transition ${
        isTarget
          ? "target-pulse border-emerald-200 bg-emerald-300/12"
          : isSource
            ? "border-amber-100 bg-amber-100/14 shadow-[inset_0_0_0_2px_rgba(251,191,36,.32)]"
            : isLastTo
              ? "last-move-glow border-sky-200/80 bg-sky-200/10"
              : isLastFrom
                ? "border-amber-200/45 bg-amber-100/8"
            : canSelect
              ? "source-pulse border-amber-100/65 bg-amber-100/8"
              : "border-amber-100/8 bg-black/14"
      } ${canSelect || isTarget ? "cursor-pointer hover:border-amber-100" : "cursor-default"}`}
      onClick={handleClick}
    >
      <span
        className={`absolute inset-x-1 h-[78%] opacity-80 ${tone} ${pointShape}`}
      />
      {isLastTo ? <span className="arrival-ripple" /> : null}
      <span
        className={`absolute left-2 z-10 text-[11px] text-amber-100/62 ${
          row === "top" ? "top-1.5" : "bottom-1.5"
        }`}
      >
        {index}
      </span>
      <div
        className={`absolute inset-x-0 z-10 flex items-center gap-1 ${stackPosition}`}
      >
        {Array.from({ length: Math.min(point.count, 5) }).map((_, horseIndex) => (
          <span
            key={horseIndex}
            className={`horse-piece grid size-7 place-items-center rounded-full border text-[11px] font-semibold shadow-[0_2px_8px_rgba(0,0,0,.35)] ${
              isLastTo && horseIndex === 0 ? "piece-arrive" : ""
            } ${horseClass(point.owner)}`}
          >
            {horseIndex === 4 && point.count > 5 ? point.count : ""}
          </span>
        ))}
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
          className={`absolute left-1/2 z-20 -translate-x-1/2 rounded-full border border-emerald-200/50 bg-emerald-300/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-100 ${
            row === "top" ? "bottom-2" : "top-2"
          }`}
        >
          可落
        </span>
      ) : canSelect ? (
        <span
          className={`absolute left-1/2 z-20 -translate-x-1/2 rounded-full border border-amber-200/45 bg-amber-100/18 px-2 py-0.5 text-[11px] font-semibold text-amber-100 ${
            row === "top" ? "bottom-2" : "top-2"
          }`}
        >
          选
        </span>
      ) : null}
    </button>
  );
}
