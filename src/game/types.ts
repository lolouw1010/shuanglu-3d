export type Player = "white" | "black";

export type Die = 1 | 2 | 3 | 4 | 5 | 6;
export type DiceRoll = [Die, Die];

export type RuleMode = "classical" | "reconstruction" | "quick";

export type RuleConfig = {
  mode: RuleMode;
  useDoublesAsFourSteps: boolean;
  enableCrushingWin: boolean;
  horsesPerPlayer: 15 | 12 | 9;
  enableCharacterSkills: boolean;
};

export type VictoryType = "single_win" | "double_win";

export type TurnPhase =
  | "awaiting_roll"
  | "awaiting_move"
  | "turn_complete"
  | "game_over";

export type PointIndex = number;

export type Point = {
  owner: Player | null;
  count: number;
};

export type MoveType = "normal" | "enter_from_bar" | "bear_off";

export type Move = {
  player: Player;
  type: MoveType;
  from: PointIndex | "bar";
  to: PointIndex | "off";
  step: number;
  hitsOpponent: boolean;
};

export type MoveRecord = Move & {
  resultingBar: Record<Player, number>;
  resultingBorneOff: Record<Player, number>;
};

export type BoardState = {
  points: Point[];
  bar: Record<Player, number>;
  borneOff: Record<Player, number>;
  currentPlayer: Player;
  diceSteps: number[];
  currentRoll: DiceRoll | null;
  ruleConfig: RuleConfig;
  turnPhase: TurnPhase;
  moveHistory: MoveRecord[];
};

export type IllegalMoveReason =
  | "not_current_player"
  | "wrong_turn_phase"
  | "no_matching_dice_step"
  | "source_empty"
  | "source_not_owned"
  | "must_enter_from_bar_first"
  | "target_out_of_range"
  | "target_blocked_by_opponent"
  | "not_all_horses_home"
  | "invalid_bear_off"
  | "game_already_over";

export type MoveValidation = {
  legal: boolean;
  reason?: IllegalMoveReason;
};

export type AIProfile =
  | "balanced"
  | "aggressive"
  | "defensive"
  | "aesthetic"
  | "expert";
