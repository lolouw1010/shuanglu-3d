"use client";

import { create } from "zustand";
import {
  applyMove,
  chooseAIMove,
  createInitialState,
  diceToSteps,
  endTurn,
  generateLegalMoves,
  getWinner,
  rollDice,
  shouldEndTurn,
  type BoardState,
  type DiceRoll,
  type Move,
} from "@/game";
import { characters } from "@/data/characters";

type GameMode = "human" | "ai";
type Screen = "menu" | "game";
type Source = number | "bar";

type GameStore = {
  screen: Screen;
  mode: GameMode;
  state: BoardState;
  selectedSource: Source | null;
  targetMoves: Move[];
  showRules: boolean;
  message: string;
  startMatch: (mode: GameMode) => void;
  backToMenu: () => void;
  toggleRules: () => void;
  rollCurrentPlayer: (roll?: DiceRoll) => void;
  selectSource: (source: Source) => void;
  selectTarget: (target: number | "off") => void;
  runAITurn: () => void;
};

function playerLabel(player: "white" | "black"): string {
  return player === "white" ? "白方" : "黑方";
}

function rollIntoState(state: BoardState, roll: DiceRoll): BoardState {
  return {
    ...state,
    currentRoll: roll,
    diceSteps: diceToSteps(roll, state.ruleConfig),
    turnPhase: "awaiting_move",
  };
}

function messageForState(state: BoardState): string {
  const winner = getWinner(state);
  if (winner) return `${playerLabel(winner)}胜。`;
  if (state.turnPhase === "awaiting_roll") {
    return `${playerLabel(state.currentPlayer)}请掷骰。目标是先出完 15 枚马。`;
  }
  if (state.bar[state.currentPlayer] > 0) {
    return `尚有${playerLabel(state.currentPlayer)}马在栏：先点棋盘中部的“马栏/复马”按钮，再点绿色入口。`;
  }
  return `${playerLabel(state.currentPlayer)}行棋：先点发光的己方马。`;
}

function finishRollIfNoMoves(state: BoardState): BoardState {
  if (shouldEndTurn(state)) return endTurn(state);
  return state;
}

export const useGameStore = create<GameStore>((set, get) => ({
  screen: "menu",
  mode: "human",
  state: createInitialState(),
  selectedSource: null,
  targetMoves: [],
  showRules: false,
  message: "请开始一局双陆。",

  startMatch: (mode) => {
    const state = createInitialState();
    set({
      screen: "game",
      mode,
      state,
      selectedSource: null,
      targetMoves: [],
      showRules: false,
      message: messageForState(state),
    });
  },

  backToMenu: () => {
    set({
      screen: "menu",
      state: createInitialState(),
      selectedSource: null,
      targetMoves: [],
      message: "请开始一局双陆。",
    });
  },

  toggleRules: () => set((store) => ({ showRules: !store.showRules })),

  rollCurrentPlayer: (forcedRoll) => {
    const current = get().state;
    if (current.turnPhase !== "awaiting_roll") return;

    const rolled = rollIntoState(current, forcedRoll ?? rollDice());
    const next = finishRollIfNoMoves(rolled);
    set({
      state: next,
      selectedSource: null,
      targetMoves: [],
      message:
        next.currentPlayer !== rolled.currentPlayer
          ? "无可行之步，回合交替。"
          : messageForState(next),
    });
  },

  selectSource: (source) => {
    const state = get().state;
    if (state.turnPhase !== "awaiting_move") return;

    const moves = generateLegalMoves(state).filter((move) => move.from === source);
    set({
      selectedSource: source,
      targetMoves: moves,
      message:
        moves.length > 0
          ? source === "bar"
            ? "已选择马栏。现在点绿色入口，把栏中马复入棋盘。"
            : "请选择绿色落点。"
          : state.bar[state.currentPlayer] > 0
            ? "栏中马必须先复入。请点棋盘中部的“马栏/复马”按钮。"
            : "此马暂无可行之步，请改选发光的己方马。",
    });
  },

  selectTarget: (target) => {
    const { state, targetMoves } = get();
    const move = targetMoves.find((candidate) => candidate.to === target);
    if (!move) return;

    const next = applyMove(state, move);
    const canContinue =
      next.currentPlayer === state.currentPlayer &&
      next.turnPhase === "awaiting_move";
    set({
      state: next,
      selectedSource: null,
      targetMoves: [],
      message:
        move.hitsOpponent && canContinue
          ? "敌方孤马已被打入栏。继续点发光的己方马。"
          : messageForState(next),
    });
  },

  runAITurn: () => {
    const store = get();
    if (store.mode !== "ai") return;
    let state = store.state;
    if (state.currentPlayer !== "black" || state.turnPhase === "game_over") return;

    if (state.turnPhase === "awaiting_roll") {
      state = finishRollIfNoMoves(rollIntoState(state, rollDice()));
    }

    let guard = 0;
    while (
      state.currentPlayer === "black" &&
      state.turnPhase === "awaiting_move" &&
      guard < 8
    ) {
      const move = chooseAIMove(
        state,
        "black",
        characters.black.aiProfile,
      );
      if (!move) {
        state = endTurn(state);
        break;
      }
      state = applyMove(state, move);
      guard += 1;
    }

    set({
      state,
      selectedSource: null,
      targetMoves: [],
      message: messageForState(state),
    });
  },
}));
