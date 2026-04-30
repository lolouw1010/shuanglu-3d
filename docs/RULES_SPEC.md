# RULES_SPEC.md v0.1

# Shuanglu Rule Specification

This document defines the playable rule set for the first prototype of **Shuanglu: Double Sixes of Tang and Song China**.

The goal of this specification is not to prove a fully exact Tang-Song historical rule reconstruction. It defines a playable reconstruction based on known Shuanglu elements and related tables/backgammon-style mechanics.

All game logic should be implemented as pure TypeScript functions under `/src/game`.

---

## 0. Rule Layering and RuleConfig

This specification distinguishes three rule layers:

1. Historically attested elements: elements that are known or strongly supported for Shuanglu and related Chinese double-six / tables-game traditions.
2. Playable reconstruction mechanics: rules borrowed or inferred from related tables/backgammon-style games so that the prototype is complete and playable.
3. Future game variants: optional modes, character skills, shortened game formats, and scoring variants that may be added after the MVP.

The MVP default is **Reconstruction Mode**. It should be implemented through an explicit rule configuration rather than scattered conditionals.

```ts
type RuleMode = 'classical' | 'reconstruction' | 'quick';

type RuleConfig = {
  mode: RuleMode;
  useDoublesAsFourSteps: boolean;
  enableCrushingWin: boolean;
  horsesPerPlayer: 15 | 12 | 9;
  enableCharacterSkills: boolean;
};
```

### 0.1 MVP Default: Reconstruction Mode

The MVP default configuration is:

```ts
const DEFAULT_RULE_CONFIG: RuleConfig = {
  mode: 'reconstruction',
  useDoublesAsFourSteps: true,
  enableCrushingWin: false,
  horsesPerPlayer: 15,
  enableCharacterSkills: false,
};
```

Reconstruction Mode uses historically attested core elements plus playable reconstruction mechanics needed for a complete browser prototype.

### 0.2 Classical Mode

Classical Mode is a stricter, less game-expanded mode for future historical-facing play.

```ts
const CLASSICAL_RULE_CONFIG: RuleConfig = {
  mode: 'classical',
  useDoublesAsFourSteps: false,
  enableCrushingWin: false,
  horsesPerPlayer: 15,
  enableCharacterSkills: false,
};
```

Classical Mode:

- Uses only two dice steps, even when doubles are rolled.
- Uses 15 horses per player.
- Disables character skills.
- Disables crushing win.

Classical Mode is defined here so the rules engine has a clean extension point, but it is not required for the MVP UI.

### 0.3 Future Variants

Quick Mode and character skills are future variants, not MVP requirements.

Quick Mode may later use:

- `horsesPerPlayer: 12`
- `horsesPerPlayer: 9`
- shortened match structure
- alternate starting layouts

Character skills may later affect dice, scoring, hints, or special challenges, but MVP legality must not depend on character skills.

### 0.4 Layer Inventory

Historically attested elements used by the MVP:

- Two players.
- Black and white horses.
- 15 horses per player.
- Two six-sided dice.
- Dice-based horse movement.
- Hitting opposing exposed horses.
- Race objective: bear off all horses before the opponent.

Playable reconstruction mechanics used by the MVP:

- The specific 24-point index model used by the engine.
- The specific 15-horse starting layout.
- White moving from high index to low index and black moving from low index to high index.
- Doubles as four movement steps in Reconstruction Mode.
- Bar entry target mapping.
- Home-board definitions.
- Oversized bearing off.
- MVP victory labels `single_win` and `double_win`.

Future game variants, not MVP requirements:

- Classical Mode UI.
- Quick Mode with 12 or 9 horses.
- Character skills.
- Crushing win scoring.
- Betting systems.
- Advanced historical variants.
- AI narrative generation.

---

## 1. Core Concepts

### 1.1 Game Type

Shuanglu is implemented as a two-player dice-and-race board game.

Players move their horses according to dice rolls. Horses may block, hit opposing single horses, re-enter from the bar, and bear off after reaching the home board.

The first player to bear off all horses required by `ruleConfig.horsesPerPlayer` wins. In MVP Reconstruction Mode this is 15 horses.

### 1.2 Players

There are two players:

```ts
type Player = 'white' | 'black';
```

- White moves from high point index to low point index.
    
- Black moves from low point index to high point index.
    

### 1.3 Horses

Historically attested element: each player has 15 horses in the core Shuanglu-style game.

MVP Reconstruction Mode and Classical Mode both use 15 horses.

Future Quick Mode may use 12 or 9 horses per player, but that is not part of the MVP.

In UI text, use “horse” instead of “piece”.

```ts
const HORSES_PER_PLAYER = ruleConfig.horsesPerPlayer;
```

### 1.4 Dice

The game uses two six-sided dice.

```ts
type Die = 1 | 2 | 3 | 4 | 5 | 6;
type DiceRoll = [Die, Die];
```

If both dice show different values, the player receives two movement steps.

Example:

```ts
[3, 5] => movement steps [3, 5]
```

If both dice show the same value, step expansion depends on `ruleConfig.useDoublesAsFourSteps`.

In Reconstruction Mode, doubles produce four movement steps:

```ts
[4, 4] => movement steps [4, 4, 4, 4]
```

In Classical Mode, doubles still produce only two movement steps:

```ts
[4, 4] => movement steps [4, 4]
```

Using doubles as four steps is a playable reconstruction mechanic and is enabled in the MVP default Reconstruction Mode.

---

## 2. Board Model

### 2.1 Point Count

The board has 24 points.

```ts
const POINT_COUNT = 24;
```

Point indexes are integers from `0` to `23`.

```ts
type PointIndex = number; // 0 through 23
```

### 2.2 Point State

Each point may be empty or occupied by horses from exactly one player.

```ts
type Point = {
  owner: Player | null;
  count: number;
};
```

Rules:

- `owner === null` means the point is empty.
    
- `count === 0` must imply `owner === null`.
    
- `count > 0` must imply `owner` is either `'white'` or `'black'`.
    
- A point cannot contain horses from both players.
    

### 2.3 Board State

```ts
type BoardState = {
  points: Point[]; // length 24
  bar: Record<Player, number>;
  borneOff: Record<Player, number>;
  currentPlayer: Player;
  diceSteps: number[];
  ruleConfig: RuleConfig;
  turnPhase: TurnPhase;
  moveHistory: MoveRecord[];
};

type TurnPhase =
  | 'awaiting_roll'
  | 'awaiting_move'
  | 'turn_complete'
  | 'game_over';
```

### 2.4 Bar

The bar stores horses that have been hit and removed from the board.

```ts
bar.white // number of white horses waiting to re-enter
bar.black // number of black horses waiting to re-enter
```

If a player has one or more horses on the bar, that player must re-enter those horses before moving any board horse.

### 2.5 Borne-Off Area

The borne-off area stores horses that have exited the board.

```ts
borneOff.white // number of white horses borne off
borneOff.black // number of black horses borne off
```

A player wins when:

```ts
borneOff[player] === 15
```

---

## 3. Movement Direction

### 3.1 White Direction

White moves downward by index.

```ts
white: 23 -> 22 -> ... -> 1 -> 0 -> borne off
```

White movement formula:

```ts
target = from - step;
```

### 3.2 Black Direction

Black moves upward by index.

```ts
black: 0 -> 1 -> ... -> 22 -> 23 -> borne off
```

Black movement formula:

```ts
target = from + step;
```

### 3.3 Bearing-Off Direction

- White bears off below point `0`.
    
- Black bears off above point `23`.
    

---

## 4. Initial Setup

### 4.1 Default Prototype Setup

Use a backgammon-like 15-horse starting layout for the MVP.

This is a playable reconstruction setup, not a claimed exact Tang-Song historical starting layout.

This setup applies to MVP Reconstruction Mode and Classical Mode because both use 15 horses per player.

Future Quick Mode will need separate 12-horse and 9-horse starting layouts.

```ts
const INITIAL_POINTS: Point[] = [
  { owner: 'black', count: 2 }, // 0
  { owner: null, count: 0 },    // 1
  { owner: null, count: 0 },    // 2
  { owner: null, count: 0 },    // 3
  { owner: null, count: 0 },    // 4
  { owner: 'white', count: 5 }, // 5
  { owner: null, count: 0 },    // 6
  { owner: 'white', count: 3 }, // 7
  { owner: null, count: 0 },    // 8
  { owner: null, count: 0 },    // 9
  { owner: null, count: 0 },    // 10
  { owner: 'black', count: 5 }, // 11
  { owner: 'white', count: 5 }, // 12
  { owner: null, count: 0 },    // 13
  { owner: null, count: 0 },    // 14
  { owner: null, count: 0 },    // 15
  { owner: 'black', count: 3 }, // 16
  { owner: null, count: 0 },    // 17
  { owner: 'black', count: 5 }, // 18
  { owner: null, count: 0 },    // 19
  { owner: null, count: 0 },    // 20
  { owner: null, count: 0 },    // 21
  { owner: null, count: 0 },    // 22
  { owner: 'white', count: 2 }, // 23
];
```

White total:

```ts
5 + 3 + 5 + 2 = 15
```

Black total:

```ts
2 + 5 + 3 + 5 = 15
```

### 4.2 Initial State

```ts
const initialState: BoardState = {
  points: INITIAL_POINTS,
  bar: { white: 0, black: 0 },
  borneOff: { white: 0, black: 0 },
  currentPlayer: 'white',
  diceSteps: [],
  ruleConfig: DEFAULT_RULE_CONFIG,
  turnPhase: 'awaiting_roll',
  moveHistory: [],
};
```

White starts by default.

A later version may add first-player selection by dice roll.

---

## 5. Point Entry Rules

### 5.1 Empty Point

A horse may move to an empty point.

```ts
point.owner === null && point.count === 0
```

Result:

```ts
point.owner = movingPlayer;
point.count = 1;
```

### 5.2 Friendly Point

A horse may move to a point occupied by friendly horses.

```ts
point.owner === movingPlayer
```

Result:

```ts
point.count += 1;
```

### 5.3 Opponent Single Horse

A horse may move to a point occupied by exactly one opponent horse.

This is a hit.

Condition:

```ts
point.owner === opponent && point.count === 1
```

Result:

```ts
bar[opponent] += 1;
point.owner = movingPlayer;
point.count = 1;
```

### 5.4 Opponent Block

A horse cannot move to a point occupied by two or more opponent horses.

Condition:

```ts
point.owner === opponent && point.count >= 2
```

Result:

The move is illegal.

---

## 6. Turn Flow

### 6.1 Start of Turn

At the start of a player’s turn:

```ts
turnPhase = 'awaiting_roll';
diceSteps = [];
```

### 6.2 Roll Dice

When the player rolls dice:

```ts
rollDice(): DiceRoll
```

Convert roll to movement steps:

```ts
function diceToSteps([a, b]: DiceRoll): number[] {
  if (a === b && ruleConfig.useDoublesAsFourSteps) return [a, a, a, a];
  return [a, b];
}
```

In MVP Reconstruction Mode this means doubles become four steps. In Classical Mode doubles remain two steps.

Then:

```ts
diceSteps = diceToSteps(roll);
turnPhase = 'awaiting_move';
```

### 6.3 Movement During Turn

The player may consume dice steps in any legal order.

For example:

```ts
diceSteps = [3, 5]
```

The player may use `3` first, then `5`, or `5` first, then `3`, if both moves are legal.

### 6.4 Step Consumption

When a move using a step is executed, remove one matching step value from `diceSteps`.

Example:

```ts
before: [3, 5]
move step: 3
after: [5]
```

Example with doubles in Reconstruction Mode:

```ts
before: [4, 4, 4, 4]
move step: 4
after: [4, 4, 4]
```

### 6.5 Forced Use of Legal Moves

If at least one legal move exists, the player must make a legal move.

If no legal moves exist for any remaining dice step, the turn ends automatically.

### 6.6 End of Turn

The turn ends when:

1. `diceSteps.length === 0`, or
    
2. no legal moves exist for the current player and remaining dice steps.
    

Then:

```ts
currentPlayer = opponent(currentPlayer);
diceSteps = [];
turnPhase = 'awaiting_roll';
```

If the game is won, set:

```ts
turnPhase = 'game_over';
```

---

## 7. Legal Move Generation

### 7.1 Move Types

There are three move types:

```ts
type MoveType = 'normal' | 'enter_from_bar' | 'bear_off';
```

### 7.2 Move Record

```ts
type Move = {
  player: Player;
  type: MoveType;
  from: PointIndex | 'bar';
  to: PointIndex | 'off';
  step: number;
  hitsOpponent: boolean;
};
```

### 7.3 Main Function

```ts
function generateLegalMoves(state: BoardState, player: Player): Move[];
```

This function must return all legal single-step moves using the currently available `diceSteps`.

It does not need to generate full-turn move sequences in v0.1.

### 7.4 Priority: Bar First

If:

```ts
state.bar[player] > 0
```

Then legal moves must only include `enter_from_bar` moves.

No normal moves or bear-off moves may be generated until all bar horses have re-entered.

### 7.5 Normal Move Generation

For each point containing current player horses:

```ts
state.points[i].owner === player && state.points[i].count > 0
```

For each step in `diceSteps`:

- White target: `i - step`
    
- Black target: `i + step`
    

If target is within `0..23`, check whether the target point is enterable.

If enterable, generate a normal move.

### 7.6 Bearing-Off Move Generation

A player may bear off only if all that player's non-borne-off horses are in that player's home board and none are on the bar.

See Section 9.

### 7.7 Duplicate Moves

If `diceSteps` contains duplicate values, do not return duplicate identical moves.

Example:

```ts
diceSteps = [4, 4, 4, 4]
```

A move from point `10` to point `6` using step `4` should appear once, not four times.

---

## 8. Bar Entry Rules

### 8.1 Entry Points

When a player has horses on the bar, they must re-enter from the opponent side.

White re-enters into points `23` down to `18`.

Black re-enters into points `0` up to `5`.

### 8.2 White Bar Entry

White uses a step to enter as follows:

```ts
step 1 => point 23
step 2 => point 22
step 3 => point 21
step 4 => point 20
step 5 => point 19
step 6 => point 18
```

Formula:

```ts
target = 24 - step;
```

### 8.3 Black Bar Entry

Black uses a step to enter as follows:

```ts
step 1 => point 0
step 2 => point 1
step 3 => point 2
step 4 => point 3
step 5 => point 4
step 6 => point 5
```

Formula:

```ts
target = step - 1;
```

### 8.4 Entry Legality

A bar entry is legal if the target point is enterable:

- empty point: legal
    
- friendly point: legal
    
- opponent single horse: legal and hits opponent
    
- opponent block of 2+ horses: illegal
    

### 8.5 Executing Bar Entry

When a bar entry move is executed:

```ts
bar[player] -= 1;
```

Then place the horse on the target point according to point entry rules.

Consume the used dice step.

---

## 9. Home Board and Bearing Off

### 9.1 Home Board Definition

White home board:

```ts
points 0, 1, 2, 3, 4, 5
```

Black home board:

```ts
points 18, 19, 20, 21, 22, 23
```

### 9.2 All Horses Home Check

```ts
function allHorsesInHomeBoard(state: BoardState, player: Player): boolean;
```

Return `true` only if:

1. `bar[player] === 0`
    
2. Every non-borne-off horse of that player is on that player's home board.
    

### 9.3 Bearing Off for White

White bears off by moving below point `0`.

Exact bear-off:

```ts
from = step - 1
```

Examples:

```ts
step 1 bears off from point 0
step 2 bears off from point 1
step 3 bears off from point 2
step 4 bears off from point 3
step 5 bears off from point 4
step 6 bears off from point 5
```

### 9.4 Bearing Off for Black

Black bears off by moving above point `23`.

Exact bear-off:

```ts
from = 24 - step
```

Examples:

```ts
step 1 bears off from point 23
step 2 bears off from point 22
step 3 bears off from point 21
step 4 bears off from point 20
step 5 bears off from point 19
step 6 bears off from point 18
```

### 9.5 Oversized Step Bearing Off

Oversized bearing off is a playable reconstruction mechanic. It is included so the MVP has a complete and familiar race-game endgame, but it should not be presented as a proven Tang-Song historical rule.

If there is no horse on the exact point for a step, the player may bear off the farthest horse if that horse is farther from exit than the step requires and there are no horses behind it.

For White:

- White exits below `0`.
    
- The farthest horse from exit is the highest occupied point in the white home board.
    
- If no horse exists on the exact point, a larger step may bear off from the highest occupied point.
    

Example:

```txt
White home board horses at points 0, 1, 4.
Dice step = 6.
No horse at point 5.
Highest occupied point is 4.
White may bear off one horse from point 4 using step 6.
```

For Black:

- Black exits above `23`.
    
- The farthest horse from exit is the lowest occupied point in the black home board.
    
- If no horse exists on the exact point, a larger step may bear off from the lowest occupied point.
    

Example:

```txt
Black home board horses at points 19, 22, 23.
Dice step = 6.
No horse at point 18.
Lowest occupied point is 19.
Black may bear off one horse from point 19 using step 6.
```

### 9.6 Illegal Oversized Bearing Off

If a horse exists behind the selected horse, oversized bearing off is illegal.

White example:

```txt
White horses at points 2 and 5.
Dice step = 5.
Exact point for step 5 is point 4.
No horse at point 4.
White cannot bear off from point 2 because a horse at point 5 is farther from exit.
```

Black example:

```txt
Black horses at points 18 and 21.
Dice step = 3.
Exact point for step 3 is point 21.
Black may bear off from point 21 exactly.
```

---

## 10. Move Execution

### 10.1 Main Function

```ts
function applyMove(state: BoardState, move: Move): BoardState;
```

This function must:

1. Validate that the move is currently legal.
    
2. Remove the horse from the source.
    
3. Apply hit if needed.
    
4. Place the horse on the target or borne-off area.
    
5. Consume the dice step.
    
6. Append to move history.
    
7. Check whether the turn should end.
    
8. Check whether the game is over.
    

### 10.2 Source Removal: Normal Move

For a normal move:

```ts
points[from].count -= 1;
if (points[from].count === 0) {
  points[from].owner = null;
}
```

### 10.3 Source Removal: Bar Entry

For bar entry:

```ts
bar[player] -= 1;
```

### 10.4 Target Placement: Normal or Bar Entry

If target point is empty:

```ts
points[to].owner = player;
points[to].count = 1;
```

If target point is friendly:

```ts
points[to].count += 1;
```

If target point has one opponent horse:

```ts
bar[opponent] += 1;
points[to].owner = player;
points[to].count = 1;
```

### 10.5 Bearing Off

For bear-off:

```ts
borneOff[player] += 1;
```

Do not place the horse on any target point.

### 10.6 Dice Step Consumption

Remove exactly one matching value from `diceSteps`.

```ts
function consumeStep(steps: number[], step: number): number[];
```

If no matching step exists, the move is illegal.

### 10.7 Move History

```ts
type MoveRecord = {
  player: Player;
  type: MoveType;
  from: PointIndex | 'bar';
  to: PointIndex | 'off';
  step: number;
  hitsOpponent: boolean;
  resultingBar: Record<Player, number>;
  resultingBorneOff: Record<Player, number>;
};
```

---

## 11. Win Detection

### 11.1 Main Function

```ts
function getWinner(state: BoardState): Player | null;
```

Return:

```ts
'white'
```

if:

```ts
state.borneOff.white === state.ruleConfig.horsesPerPlayer
```

Return:

```ts
'black'
```

if:

```ts
state.borneOff.black === state.ruleConfig.horsesPerPlayer
```

Otherwise return:

```ts
null
```

### 11.2 Victory Types

Victory type is optional for basic win detection, but MVP scoring should only distinguish single and double wins.

```ts
type VictoryType = 'single_win' | 'double_win';
```

MVP definitions:

- `single_win`: opponent has borne off at least one horse.
    
- `double_win`: opponent has borne off zero horses.
    
Do not include `crushing_win` in the MVP.

`enableCrushingWin` exists in `RuleConfig` as a future extension flag. It must be `false` in MVP Reconstruction Mode and Classical Mode.

Future definition, not MVP:

```ts
type FutureVictoryType = 'crushing_win';
```

Possible future meaning:

- `crushing_win`: opponent has borne off zero horses and has at least one horse on the bar or outside home board.

This future variant should not affect basic win detection in v0.1.

---

## 12. Illegal Move Reasons

For UI and debugging, illegal move checks should return a reason.

```ts
type IllegalMoveReason =
  | 'not_current_player'
  | 'wrong_turn_phase'
  | 'no_matching_dice_step'
  | 'source_empty'
  | 'source_not_owned'
  | 'must_enter_from_bar_first'
  | 'target_out_of_range'
  | 'target_blocked_by_opponent'
  | 'not_all_horses_home'
  | 'invalid_bear_off'
  | 'game_already_over';
```

Function:

```ts
function validateMove(state: BoardState, move: Move): {
  legal: boolean;
  reason?: IllegalMoveReason;
};
```

---

## 13. UI Rule Text

Use historically flavored but clear UI text.

### 13.1 Basic Prompts

```txt
Roll the dice.
Choose a horse to move.
White horse moves {n} roads.
Black horse moves {n} roads.
This road is blocked.
This enemy horse stands alone and may be hit.
You have a horse on the bar. Re-enter first.
All horses are home. You may bear off.
White wins.
Black wins.
```

### 13.2 Chinese UI Text

```txt
请掷骰。
请选择一枚马。
白马行 {n} 路。
黑马行 {n} 路。
此路成关，不可入。
敌马孤立，可打。
尚有马在栏，须先复马。
诸马已归，可出马。
白方胜。
黑方胜。
```

---

## 14. Required Public Game Functions

The `/src/game` module should expose these functions:

```ts
createInitialState(config?: RuleConfig): BoardState;
rollDice(rng?: () => number): DiceRoll;
diceToSteps(roll: DiceRoll, config?: RuleConfig): number[];
opponent(player: Player): Player;
getMovementTarget(player: Player, from: number, step: number): number;
canEnterPoint(state: BoardState, player: Player, pointIndex: number): boolean;
allHorsesInHomeBoard(state: BoardState, player: Player): boolean;
generateLegalMoves(state: BoardState, player?: Player): Move[];
validateMove(state: BoardState, move: Move): { legal: boolean; reason?: IllegalMoveReason };
applyMove(state: BoardState, move: Move): BoardState;
getWinner(state: BoardState): Player | null;
shouldEndTurn(state: BoardState): boolean;
endTurn(state: BoardState): BoardState;
```

---

## 15. MVP AI Rules

### 15.1 AI Goal

The MVP AI only needs to choose legal moves reasonably. It does not need to be optimal.

### 15.2 AI Function

```ts
function chooseAIMove(state: BoardState, player: Player, profile?: AIProfile): Move | null;
```

If no legal move exists, return `null`.

### 15.3 AI Scoring

Each legal move receives a score.

Suggested base scoring:

```txt
+100 if move bears off
+50 if move hits opponent
+25 if move makes a point with 2+ friendly horses
+10 if move advances toward home
-30 if move leaves a single exposed horse
-50 if move moves to a point likely to be hit next turn
```

### 15.4 AI Profiles

```ts
type AIProfile = 'balanced' | 'aggressive' | 'defensive' | 'aesthetic' | 'expert';
```

Profile weighting:

- `balanced`: default weights.
    
- `aggressive`: higher hit score.
    
- `defensive`: higher block-making score, higher penalty for exposure.
    
- `aesthetic`: favors stacked/ordered formations, used for Song Huizong.
    
- `expert`: strongest heuristic, avoids obvious tactical errors.
    

---

## 16. Required Test Coverage

The implementation must include tests for at least these categories:

1. Initial setup has 24 points.
    
2. Initial setup gives each player exactly 15 horses in Reconstruction Mode.
    
3. White moves from high index to low index.
    
4. Black moves from low index to high index.
    
5. Dice doubles produce four movement steps in Reconstruction Mode.
    
6. Dice doubles produce two movement steps in Classical Mode.
    
7. A horse can move to an empty point.
    
8. A horse can move to a friendly point.
    
9. A horse can hit one opponent horse.
    
10. A horse cannot move to a point with two or more opponent horses.
    
11. A player with a horse on the bar must enter from bar first.
    
12. White bar entry maps step 1 to point 23 and step 6 to point 18.
    
13. Black bar entry maps step 1 to point 0 and step 6 to point 5.
    
14. A player cannot bear off before all horses are home.
    
15. White can bear off from point 0 with step 1.
    
16. Black can bear off from point 23 with step 1.
    
17. Oversized bearing off works when allowed as a playable reconstruction mechanic.
    
18. Oversized bearing off fails when a farther horse exists.
    
19. Consuming one dice step works correctly.
    
20. Turn ends when no dice steps remain.
    
21. Winner is detected when one player has borne off `ruleConfig.horsesPerPlayer` horses.
    
22. MVP victory classification returns only `single_win` or `double_win`.
    

---

## 17. Non-Goals for v0.1

Do not implement the following in the first rules engine:

- Online multiplayer
    
- Betting system
    
- Doubling cube
    
- Advanced historical variants
    
- Character skills that alter core legality

- Quick Mode with 12 or 9 horses

- Crushing win scoring
    
- Real-time AI narrative generation
    
- Account system
    
- Save cloud sync
    
- Gacha or monetization
    

---

## 18. Implementation Principle

Rules must not be hardcoded inside UI components.

Correct:

```txt
React UI -> calls game engine -> receives legal moves/state -> renders result
```

Incorrect:

```txt
React component directly decides whether a move is legal
```

The game engine should be testable without rendering the UI.

---

## 19. Definition of Done for Rules Engine v0.1

The rules engine is complete when:

1. A full game can be played from initial setup to victory.
    
2. Legal move generation works for normal moves, bar entry, hits, and bearing off.
    
3. Illegal moves return clear reasons.
    
4. Turn flow works with dice step consumption.
    
5. All required tests pass.
    
6. The engine has no dependency on React or DOM APIs.
    
7. The engine can be imported by a UI layer without modification.
