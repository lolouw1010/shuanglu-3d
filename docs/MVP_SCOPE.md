# MVP_SCOPE.md v0.1

# Shuanglu MVP Scope

This document defines the scope of the first playable prototype for **Shuanglu: Double Sixes of Tang and Song China**.

The MVP must focus on one goal:

> Build a complete, playable local web prototype of Shuanglu with a functioning rules engine, basic UI, simple AI, and one themed character presentation.

The MVP is not a full commercial game.

---

## 1. MVP Objective

The first prototype should prove that the core game works.

A successful MVP allows a player to:

1. Start a new match.
    
2. Roll two dice.
    
3. Move horses according to legal rules.
    
4. Hit opponent horses.
    
5. Re-enter horses from the bar.
    
6. Bear off horses after all horses are home.
    
7. Finish a complete game.
    
8. Play against either another local human player or a simple AI.
    
9. Experience a basic ancient Chinese / Tang-Song / anime-inspired visual direction.
    

---

## 2. Target Platform

### 2.1 Required Platform

The MVP must be a web application.

Recommended stack:

- Next.js
    
- React
    
- TypeScript
    
- Tailwind CSS
    
- Zustand or React state
    
- Vitest for rule tests
    

### 2.2 Required Runtime

The MVP should run locally with:

```bash
npm install
npm run dev
```

The production build should pass:

```bash
npm run build
```

Tests should run with:

```bash
npm test
```

---

## 2.3 MVP Rule Configuration

The MVP must use **Reconstruction Mode** as the default rule mode.

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

MVP default:

```ts
const DEFAULT_RULE_CONFIG: RuleConfig = {
  mode: 'reconstruction',
  useDoublesAsFourSteps: true,
  enableCrushingWin: false,
  horsesPerPlayer: 15,
  enableCharacterSkills: false,
};
```

Rule-layering requirements:

- Historically attested elements should be described as known Shuanglu or Chinese double-six / tables-game elements.
- Playable reconstruction mechanics should be clearly labeled as playable reconstruction, not as proven Tang-Song rules.
- Future game variants should be documented as future variants, not MVP requirements.

Classical Mode, Quick Mode, crushing win, and character skills may be defined as future extension points, but MVP gameplay must not require them.

---

## 3. Required Game Modes

### 3.1 Local Human vs Human

Required.

Two players share the same screen and take turns.

Features:

- White player turn
    
- Black player turn
    
- Dice roll button
    
- Legal move selection
    
- End of turn handling
    
- Win detection
    

### 3.2 Human vs AI

Required but simple.

Player controls White by default.

AI controls Black by default.

The AI only needs to choose legal moves with a basic heuristic.

AI does not need to be optimal.

### 3.3 AI vs AI

Optional.

Only implement if simple and useful for testing.

### 3.4 Online Multiplayer

Out of scope.

Do not implement.

---

## 4. Required Rule Features

The MVP must implement the rule set defined in:

```txt
docs/RULES_SPEC.md
```

Required rule features:

1. Default `RuleConfig` is Reconstruction Mode.
    
2. `useDoublesAsFourSteps: true`.
    
3. `enableCrushingWin: false`.
    
4. `horsesPerPlayer: 15`.
    
5. `enableCharacterSkills: false`.
    
6. 24-point board.
    
7. White and black players.
    
8. 15 horses per player.
    
9. Two six-sided dice.
    
10. In MVP Reconstruction Mode, doubles become four movement steps.
    
11. White moves from high index to low index.
    
12. Black moves from low index to high index.
    
13. Normal movement.
    
14. Entering empty points.
    
15. Stacking on friendly points.
    
16. Blocking with two or more friendly horses.
    
17. Hitting one exposed opponent horse.
    
18. Bar system.
    
19. Forced bar re-entry.
    
20. Home board detection.
    
21. Bearing off.
    
22. Oversized bearing-off rule, labeled as a playable reconstruction mechanic.
    
23. Dice step consumption.
    
24. Turn switching.
    
25. Win detection.

26. MVP victory classification only as `single_win` or `double_win`.
    

---

## 5. Required UI Features

### 5.1 Main Screen

Required but simple.

Must include:

- Game title
    
- Start Human vs Human
    
- Start Human vs AI
    
- Rules / Help button or panel
    

Suggested title:

```txt
双陆
Shuanglu
```

Suggested subtitle:

```txt
A Tang-Song Double Sixes Reconstruction
```

### 5.2 Game Board Screen

Required.

Must include:

1. 24 visible board points.
    
2. White horses and black horses.
    
3. Current player indicator.
    
4. Dice display.
    
5. Roll button.
    
6. Legal move indication.
    
7. Bar area for hit horses.
    
8. Borne-off area for exited horses.
    
9. Move history or latest move message.
    
10. Win message.
    

### 5.3 Interaction

MVP interaction may use click-based movement.

Required behavior:

1. Player clicks a horse/source point.
    
2. UI highlights legal target points for available dice steps.
    
3. Player clicks a highlighted target.
    
4. Move is applied.
    
5. Dice step is consumed.
    
6. UI updates.
    

Drag-and-drop is optional.

### 5.4 Move Hints

Required.

The UI should display simple messages such as:

```txt
Roll the dice.
White to move.
Black to move.
This road is blocked.
You must re-enter from the bar first.
All horses are home. You may bear off.
White wins.
Black wins.
```

Chinese UI messages are preferred if easy:

```txt
请掷骰。
白方行棋。
黑方行棋。
此路成关，不可入。
尚有马在栏，须先复马。
诸马已归，可出马。
白方胜。
黑方胜。
```

---

## 6. Required Visual Direction

The MVP should show the intended art direction, but does not need final art.

### 6.1 Required Style

Use a basic ancient Chinese / Tang-Song / anime-inspired visual style.

Keywords:

- Ancient Chinese board game
    
- Tang-Song atmosphere
    
- Lacquered wood board
    
- Candlelight
    
- Silk texture
    
- Warm gold
    
- Deep red
    
- Ink black
    
- Anime-style character panel
    

### 6.2 Required Assets

Final custom assets are not required.

The MVP may use:

- CSS shapes
    
- Placeholder character art
    
- Simple gradient backgrounds
    
- Generated placeholder images
    
- Text-based character panels
    

### 6.3 Required Character Presentation

At least one themed opponent must be represented.

Recommended first character:

```txt
Song Huizong
```

Reason:

- Strong visual identity.
    
- Fits elegant board-game presentation.
    
- Good contrast between artistic taste and strategic weakness.
    

Minimum character panel fields:

```ts
type Character = {
  id: string;
  name: string;
  title: string;
  era: string;
  aiProfile: AIProfile;
  quote: string;
};
```

Example:

```ts
{
  id: 'song-huizong',
  name: '宋徽宗',
  title: '宣和雅局',
  era: 'Northern Song',
  aiProfile: 'aesthetic',
  quote: '此局若成，当题作《双陆图》。'
}
```

---

## 7. Required AI Scope

### 7.1 AI Requirement

The MVP AI must:

1. Generate legal moves from the rules engine.
    
2. Score legal moves using simple heuristics.
    
3. Select one move.
    
4. Repeat until no dice steps remain or no legal moves exist.
    
5. End its turn.
    

### 7.2 AI Does Not Need To

The MVP AI does not need to:

- Search multiple turns ahead.
    
- Use minimax.
    
- Use Monte Carlo simulation.
    
- Use an LLM.
    
- Generate natural language strategy explanations.
    
- Play perfectly.
    

### 7.3 AI Profiles

Required:

- `balanced`
    

Optional:

- `aggressive`
    
- `defensive`
    
- `aesthetic`
    
- `expert`
    

If implementing only one profile, use `balanced`.

---

## 8. Required Documentation Screens

The MVP should include a simple Rules / Help panel.

Minimum content:

1. What is Shuanglu?
    
2. Goal of the game.
    
3. How dice work.
    
4. How horses move.
    
5. What is hitting.
    
6. What is the bar.
    
7. What is bearing off.
    
8. How to win.
    

Historical claims should be cautious.

Recommended wording:

```txt
This prototype uses a playable reconstruction of Shuanglu rules based on known Chinese double-six / tables-game traditions. It does not claim to be a fully exact Tang-Song rule restoration.
```

Chinese version:

```txt
本原型采用基于双陆传统与同类博戏规则的可玩复原规则，并不声称完全等同于唐宋原始规则。
```

The Rules / Help panel should clearly distinguish:

- Historically attested elements: 24-road board structure, two players, black and white horses, two six-sided dice, dice-based horse movement, blocking, hitting, and the goal of bearing off all horses.
- Playable reconstruction mechanics: the specific 15-horse starting layout, doubles as four steps in Reconstruction Mode, bar entry mapping, home-board definitions, and oversized bearing off.
- Future game variants: Classical Mode UI, Quick Mode, character skills, crushing win, betting systems, campaigns, and advanced AI narrative features.

---

## 9. Required Tests

The MVP must include automated tests for the rule engine.

Minimum required tests:

1. Initial board has 24 points.
    
2. White has 15 horses.
    
3. Black has 15 horses.
    
4. MVP default `RuleConfig` uses Reconstruction Mode.
    
5. Dice doubles produce four steps in MVP Reconstruction Mode.
    
6. Classical Mode config, when implemented, keeps doubles as two steps.
    
7. White movement target is lower index.
    
8. Black movement target is higher index.
    
9. Cannot enter opponent block.
    
10. Can hit opponent single horse.
    
11. Hit sends opponent horse to bar.
    
12. Player with bar horse must re-enter first.
    
13. White bar entry mapping works.
    
14. Black bar entry mapping works.
    
15. Cannot bear off before all horses are home.

16. Can bear off after all horses are home.

17. Oversized bearing off works as a playable reconstruction mechanic.

18. Winner detected at 15 borne-off horses in MVP Reconstruction Mode.

19. MVP victory type is only `single_win` or `double_win`.
    

Additional tests are encouraged.

---

## 10. Required Project Structure

Recommended structure:

```txt
/docs
  GAME_DESIGN.md
  RULES_SPEC.md
  MVP_SCOPE.md
  TECH_SPEC.md
  TEST_CASES.md
  AGENTS.md

/src
  /app
    page.tsx
  /components
    Board.tsx
    BoardPoint.tsx
    DicePanel.tsx
    PlayerPanel.tsx
    CharacterPanel.tsx
    MoveHint.tsx
    RulesPanel.tsx
  /game
    types.ts
    constants.ts
    initialState.ts
    dice.ts
    movement.ts
    legalMoves.ts
    validateMove.ts
    applyMove.ts
    turn.ts
    winDetector.ts
    ai.ts
  /data
    characters.ts
  /styles
    globals.css

/tests
  initialState.test.ts
  dice.test.ts
  movement.test.ts
  legalMoves.test.ts
  applyMove.test.ts
  bearingOff.test.ts
  winDetector.test.ts
```

The exact structure may vary, but game rules must stay separate from UI components.

---

## 11. Explicit Non-Goals

Do not implement these in MVP v0.1:

1. Online multiplayer.
    
2. User accounts.
    
3. Cloud saves.
    
4. Payment.
    
5. Gacha.
    
6. Character leveling.
    
7. Inventory system.
    
8. Complex campaign map.
    
9. Real-time LLM dialogue.
    
10. AI-generated art pipeline.
    
11. Mobile app packaging.
    
12. Steam integration.
    
13. Audio system beyond simple optional sound effects.
    
14. Multiple historical rule variants.
    
15. Betting economy.
    
16. Doubling cube.
    
17. Advanced accessibility settings.
    
18. Localization beyond basic Chinese/English text constants.

19. Quick Mode with 12 or 9 horses.

20. Character skills that change move legality.

21. Crushing win scoring.
    

---

## 12. Nice-to-Have Features

These are optional and should only be implemented after required features work.

1. Drag-and-drop movement.
    
2. Simple dice roll animation.
    
3. Simple horse movement animation.
    
4. Basic sound effect for dice.
    
5. Basic sound effect for hitting.
    
6. AI move delay for readability.
    
7. Move history list.
    
8. Undo for local human mode.
    
9. Theme switch between Tang and Song visual skins.
    
10. AI profile selection.
    

---

## 13. MVP Completion Criteria

The MVP is complete only if all of the following are true:

### 13.1 Gameplay

- A new game can be started.
    
- A full match can be played to completion.
    
- Human vs Human mode works.
    
- Human vs AI mode works.
    
- Dice rolling works.
    
- Legal move generation works.
    
- Hitting works.
    
- Bar re-entry works.
    
- Bearing off works.
    
- Win detection works.
    

### 13.2 UI

- Board is visible and understandable.
    
- Current player is visible.
    
- Dice values are visible.
    
- Legal move targets are visible.
    
- Bar and borne-off areas are visible.
    
- Win result is visible.
    
- Rules/help text is accessible.
    

### 13.3 Code Quality

- Game rules are separated from UI.
    
- Rule engine is pure TypeScript.
    
- Automated tests exist for core rules.
    
- `npm run build` passes.
    
- `npm test` passes.
    
- No obvious console errors during play.
    

### 13.4 Scope Control

- No out-of-scope systems are added.
    
- No invented historical claims are presented as fact.
    
- The prototype remains focused on core playable Shuanglu.
    

---

## 14. Recommended First Codex Task

Use this as the first implementation instruction:

```txt
Build the first playable web prototype of Shuanglu according to docs/RULES_SPEC.md and docs/MVP_SCOPE.md.

Start with the pure TypeScript rule engine under /src/game.

Then add a minimal React UI for local Human vs Human play.

After that, add a simple Human vs AI mode using the legal move generator.

Do not implement online multiplayer, accounts, payments, gacha, or complex campaign systems.

Add Vitest tests for the rule engine. The project is done when npm run build and npm test both pass, and a full game can be played locally.
```

---

## 15. Summary

The MVP should be small, complete, and playable.

The priority order is:

1. Correct rules engine.
    
2. Complete local gameplay loop.
    
3. Minimal readable UI.
    
4. Simple AI.
    
5. Basic Tang-Song anime-inspired presentation.
    

Everything else belongs after the MVP.
