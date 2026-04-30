"use client";

import { GameScreen } from "./GameScreen";
import { MainMenu } from "./MainMenu";
import { RulesPanel } from "./RulesPanel";
import { useGameStore } from "@/store/gameStore";

export function GameApp() {
  const screen = useGameStore((store) => store.screen);
  const showRules = useGameStore((store) => store.showRules);
  const toggleRules = useGameStore((store) => store.toggleRules);

  return (
    <>
      {screen === "menu" ? <MainMenu /> : <GameScreen />}
      {showRules ? <RulesPanel onClose={toggleRules} /> : null}
    </>
  );
}
