import type { BoardState, Move } from "@/game";
import { sourceLabel, targetLabel } from "./moveDisplay";

type ParchmentCommandPanelProps = {
  state: BoardState;
  availableMoves: Move[];
  selectedSource: number | "bar" | null;
  targetMoves: Move[];
  message: string;
  onSelectSource: (source: number | "bar") => void;
};

function uniqueSources(moves: Move[]): Array<number | "bar"> {
  return Array.from(new Set(moves.map((move) => move.from))).slice(0, 6);
}

function uniqueSteps(moves: Move[]): number[] {
  return Array.from(new Set(moves.map((move) => move.step))).sort((a, b) => a - b);
}

function displayPoint(source: number | "bar"): string {
  if (source === "bar") return "栏";
  return String(source >= 12 ? source - 11 : source + 1);
}

function hintText(
  state: BoardState,
  selectedSource: number | "bar" | null,
  targetMoves: Move[],
  message: string,
): string {
  if (state.turnPhase === "awaiting_roll") return "掷骰后，棋盘会标出可点取的棋马。";
  if (state.turnPhase === "game_over") return message;
  if (state.bar[state.currentPlayer] > 0 && selectedSource !== "bar") return "栏中有马，先点马栏复马。";
  if (selectedSource !== null && targetMoves.length > 0) return `已选${sourceLabel(selectedSource)}，请选择绿色落点。`;
  return message;
}

export function ParchmentCommandPanel({
  state,
  availableMoves,
  selectedSource,
  targetMoves,
  message,
  onSelectSource,
}: ParchmentCommandPanelProps) {
  const sources = uniqueSources(availableMoves);
  const steps = uniqueSteps(selectedSource === null ? availableMoves : targetMoves);
  const latest = state.moveHistory.at(-1);

  return (
    <section className="parchment-command-panel" aria-label="行棋操作">
      <div className="parchment-dialogue">
        <h2>剧情对话</h2>
        <p><span>李清照：</span> 公子远来，可会一局双陆？</p>
        <p><span>你：</span> 久仰大名，愿领教才女棋风。</p>
        <p><span>棋局：</span> {latest ? `${sourceLabel(latest.from)}至${targetLabel(latest.to)}。` : "尚未行棋，先掷骰。"}</p>
      </div>

      <div className="parchment-action-card parchment-source-card">
        <h2>可行动点</h2>
        <div className="parchment-source-list">
          {sources.length > 0 ? (
            sources.map((source) => (
              <button
                key={source}
                type="button"
                className={`parchment-source-token ${selectedSource === source ? "is-selected" : ""}`}
                onClick={() => onSelectSource(source)}
              >
                <span className={state.currentPlayer === "white" ? "white-token" : "black-token"}>♞</span>
                <small>{displayPoint(source)}</small>
              </button>
            ))
          ) : (
            <span className="parchment-empty-mark">待掷骰</span>
          )}
        </div>
      </div>

      <div className="parchment-action-card parchment-step-card">
        <h2>可行步数</h2>
        <div className="parchment-step-list">
          {steps.length > 0 ? (
            steps.map((step) => <span key={step}>{step}</span>)
          ) : (
            <span className="parchment-empty-mark">无</span>
          )}
        </div>
      </div>

      <div className="parchment-action-card parchment-hint-card">
        <h2>提示</h2>
        <p>{hintText(state, selectedSource, targetMoves, message)}</p>
      </div>
    </section>
  );
}
