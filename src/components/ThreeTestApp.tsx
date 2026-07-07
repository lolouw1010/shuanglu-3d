"use client";

import { useEffect } from "react";
import { GameScreen } from "./GameScreen";
import { RulesPanel } from "./RulesPanel";
import { useGameStore } from "@/store/gameStore";

export function ThreeTestApp() {
  const screen = useGameStore((store) => store.screen);
  const boardView = useGameStore((store) => store.boardView);
  const showRules = useGameStore((store) => store.showRules);
  const startMatch = useGameStore((store) => store.startMatch);
  const toggleRules = useGameStore((store) => store.toggleRules);

  useEffect(() => {
    if (screen !== "game" || boardView !== "3d") {
      startMatch("ai", "3d");
    }
  }, [boardView, screen, startMatch]);

  return (
    <>
      <GameScreen />
      {showRules ? <RulesPanel onClose={toggleRules} /> : null}
    </>
  );
}
