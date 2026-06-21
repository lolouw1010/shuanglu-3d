type DiceFaceProps = {
  value: number | "-";
  rolling: boolean;
};

const pipPositions: Record<number, string[]> = {
  1: ["center"],
  2: ["top-left", "bottom-right"],
  3: ["top-left", "center", "bottom-right"],
  4: ["top-left", "top-right", "bottom-left", "bottom-right"],
  5: ["top-left", "top-right", "center", "bottom-left", "bottom-right"],
  6: ["top-left", "top-right", "middle-left", "middle-right", "bottom-left", "bottom-right"],
};

function pipClass(position: string): string {
  const classes: Record<string, string> = {
    "top-left": "col-start-1 row-start-1",
    "top-right": "col-start-3 row-start-1",
    "middle-left": "col-start-1 row-start-2",
    center: "col-start-2 row-start-2",
    "middle-right": "col-start-3 row-start-2",
    "bottom-left": "col-start-1 row-start-3",
    "bottom-right": "col-start-3 row-start-3",
  };
  return classes[position] ?? "";
}

export function DiceFace({ value, rolling }: DiceFaceProps) {
  const pips = typeof value === "number" ? pipPositions[value] : [];
  const assetPath = typeof value === "number" ? `/assets/ui/dice/dice-${value}.png` : null;

  return (
    <div
      aria-label={typeof value === "number" ? `${value} 点` : "未掷"}
      className={`die-body ${assetPath ? "die-body-asset" : ""} ${
        rolling ? "dice-tumble" : "dice-pop"
      }`}
      role="img"
    >
      {assetPath ? (
        <img
          src={assetPath}
          alt=""
          aria-hidden="true"
          className="die-face-image"
          draggable={false}
        />
      ) : typeof value === "number" ? (
        <div className="die-pip-grid">
          {pips.map((position) => (
            <span key={position} className={`die-pip ${pipClass(position)}`} />
          ))}
        </div>
      ) : (
        <span className="die-empty">-</span>
      )}
    </div>
  );
}
