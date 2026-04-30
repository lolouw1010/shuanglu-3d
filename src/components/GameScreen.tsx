"use client";

import { ArrowLeft, BookOpen } from "lucide-react";
import { useEffect } from "react";
import { characters } from "@/data/characters";
import { generateLegalMoves, getVictoryType, getWinner } from "@/game";
import { useGameStore } from "@/store/gameStore";
import { Board } from "./Board";
import { CharacterPanel } from "./CharacterPanel";
import { DicePanel } from "./DicePanel";
import { PlayFeedback } from "./PlayFeedback";
import { TurnCoach } from "./TurnCoach";
import { VictoryTracker } from "./VictoryTracker";

export function GameScreen() {
  const {
    mode,
    state,
    selectedSource,
    targetMoves,
    message,
    backToMenu,
    toggleRules,
    rollCurrentPlayer,
    selectSource,
    selectTarget,
    runAITurn,
    startMatch,
  } = useGameStore();

  const winner = getWinner(state);
  const victoryType = getVictoryType(state);
  const availableMoves = generateLegalMoves(state);

  useEffect(() => {
    if (mode === "ai" && state.currentPlayer === "black") {
      const timer = window.setTimeout(runAITurn, 450);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [mode, state.currentPlayer, state.turnPhase, runAITurn]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_50%_0%,rgba(214,162,80,.16),transparent_28%),linear-gradient(140deg,#120d0c,#351317_48%,#15100e)] px-4 py-4 text-stone-100">
      <div className="mx-auto grid max-w-[1500px] gap-4 xl:grid-cols-[220px_1fr_220px]">
        <div className="flex items-center justify-between xl:col-span-3">
          <div>
            <p className="text-sm text-amber-200">双陆 0.5 Prototype</p>
            <h1 className="font-display text-3xl text-amber-50">宣和雅局</h1>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="返回"
              className="rounded border border-amber-200/25 bg-black/20 p-2 text-amber-50"
              onClick={backToMenu}
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="规则"
              className="rounded border border-amber-200/25 bg-black/20 p-2 text-amber-50"
              onClick={toggleRules}
            >
              <BookOpen size={18} />
            </button>
          </div>
        </div>

        <div className="order-3 xl:order-none">
          <CharacterPanel
            character={characters.white}
            active={state.currentPlayer === "white"}
            barCount={state.bar.white}
            borneOff={state.borneOff.white}
          />
        </div>

        <div className="order-2 grid gap-4 xl:order-none">
          <div className="grid gap-3 lg:grid-cols-[1fr_360px]">
            <VictoryTracker state={state} />
            <DicePanel state={state} onRoll={() => rollCurrentPlayer()} />
          </div>
          <TurnCoach
            state={state}
            availableMoves={availableMoves}
            selectedSource={selectedSource}
            targetMoves={targetMoves}
          />
          <PlayFeedback state={state} message={message} />
          {winner ? (
            <section className="rounded border border-amber-200/40 bg-amber-100/12 p-5 text-center">
              <p className="text-sm text-amber-200">胜负已分</p>
              <h2 className="mt-1 font-display text-3xl text-amber-50">
                {winner === "white" ? "白方胜" : "黑方胜"}
              </h2>
              <p className="mt-2 text-sm text-stone-200">
                {victoryType === "double_win"
                  ? "对手尚未出马，记为双胜。"
                  : "对手已出过马，记为普通胜。"}
              </p>
              <button
                type="button"
                className="mt-4 rounded border border-amber-200/40 bg-amber-100 px-4 py-2 text-sm font-semibold text-stone-950"
                onClick={() => startMatch(mode)}
              >
                再开一局
              </button>
            </section>
          ) : null}
          <Board
            state={state}
            availableMoves={availableMoves}
            selectedSource={selectedSource}
            targetMoves={targetMoves}
            onSelectSource={selectSource}
            onSelectTarget={selectTarget}
          />
        </div>

        <div className="order-4 xl:order-none">
          <CharacterPanel
            character={characters.black}
            active={state.currentPlayer === "black"}
            barCount={state.bar.black}
            borneOff={state.borneOff.black}
          />
        </div>
      </div>
    </main>
  );
}
