"use client";

import { Dices } from "lucide-react";
import { useEffect, useState } from "react";
import type { BoardState } from "@/game";
import { DiceFace } from "./DiceFace";

type DicePanelProps = {
  state: BoardState;
  onRoll: () => void;
};

export function DicePanel({ state, onRoll }: DicePanelProps) {
  const [isRolling, setIsRolling] = useState(false);
  const [previewRoll, setPreviewRoll] = useState<[number, number]>([1, 6]);
  const canRoll = state.turnPhase === "awaiting_roll";
  const rollKey = state.currentRoll ? state.currentRoll.join("-") : "empty";
  const idleRoll: Array<number | "-"> = state.currentRoll ?? ["-", "-"];
  const displayRoll: Array<number | "-"> = isRolling ? previewRoll : idleRoll;

  useEffect(() => {
    if (!isRolling) return undefined;
    const interval = window.setInterval(() => {
      setPreviewRoll([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ]);
    }, 55);
    return () => window.clearInterval(interval);
  }, [isRolling]);

  const handleRoll = () => {
    if (!canRoll || isRolling) return;
    setIsRolling(true);
    window.setTimeout(() => {
      onRoll();
      setIsRolling(false);
    }, 520);
  };

  return (
    <section className="dice-tray rounded border border-amber-200/20 bg-black/24 p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase text-amber-200/70">
            Dice
          </p>
          <h2 className="font-display text-lg text-amber-50">骰声</h2>
          <p className="mt-1 text-xs text-stone-400">
            骰面就是可用步数。
          </p>
        </div>
        <button
          type="button"
          aria-label="掷骰"
          disabled={!canRoll || isRolling}
          className={`inline-flex items-center gap-2 rounded border border-amber-200/40 bg-amber-100 px-3 py-2 text-sm font-semibold text-stone-950 transition disabled:cursor-not-allowed disabled:opacity-45 ${
            canRoll && !isRolling ? "roll-ready hover:bg-amber-50" : ""
          }`}
          onClick={handleRoll}
        >
          <Dices size={18} className={isRolling ? "dice-icon-spin" : ""} />
          {isRolling ? "听骰" : "掷骰"}
        </button>
      </div>
      <div className="flex items-center gap-3">
        {displayRoll.map((die, index) => (
          <div
            key={`${rollKey}-${die}-${index}-${isRolling ? "rolling" : "settled"}`}
            className="dice-stage"
          >
            <DiceFace value={die} rolling={isRolling} />
          </div>
        ))}
        <div className="min-w-0 text-sm text-stone-300">
          <p>剩余步数</p>
          <p className="truncate text-amber-100">
            {state.diceSteps.length ? state.diceSteps.join(" / ") : "无"}
          </p>
        </div>
      </div>
    </section>
  );
}
