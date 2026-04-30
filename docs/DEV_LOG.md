# Development Log

This file is the chronological engineering log for the Shuanglu web prototype.

Rules for maintaining this log:

- Add an entry for every meaningful implementation session.
- Record what changed, why it changed, and how it was verified.
- Record unresolved risks explicitly.
- Keep timestamps concrete.
- Do not rely on chat history as the only source of project memory.

## 2026-04-26 20:42 CST

### Objective

Initialize the project and create the first playable `0.5` baseline for a one-week launch push.

### Inputs Read

- `docs/AGENTS.md`
- `docs/GAME_DESIGN.md`
- `docs/MVP_SCOPE.md`
- `docs/RULES_SPEC.md`
- `docs/TECH_SPEC.md`
- `docs/TEST_CASES.md`

### File Organization

Moved the original core documents into `docs/` and corrected the mistaken `*.md.md` naming to `*.md`.

Current canonical document paths:

- `docs/AGENTS.md`
- `docs/GAME_DESIGN.md`
- `docs/MVP_SCOPE.md`
- `docs/RULES_SPEC.md`
- `docs/TECH_SPEC.md`
- `docs/TEST_CASES.md`

Confirmed there are no remaining `*.md.md` files or references.

### Implementation Completed

Created project scaffold:

- `package.json`
- `package-lock.json`
- `next.config.ts`
- `tsconfig.json`
- `tailwind.config.ts`
- `postcss.config.mjs`
- `vitest.config.ts`
- `src/app`
- `src/components`
- `src/data`
- `src/game`
- `src/store`
- `tests`

Implemented pure TypeScript rules engine:

- `src/game/types.ts`
- `src/game/constants.ts`
- `src/game/initialState.ts`
- `src/game/dice.ts`
- `src/game/movement.ts`
- `src/game/legalMoves.ts`
- `src/game/validateMove.ts`
- `src/game/applyMove.ts`
- `src/game/turn.ts`
- `src/game/winDetector.ts`
- `src/game/ai.ts`
- `src/game/index.ts`

Rules covered in the first engine pass:

- Initial 24-point board.
- 15 horses per player.
- Dice conversion, including doubles as four steps.
- White and black movement direction.
- Entering empty points.
- Stacking friendly horses.
- Blocking by two or more opponent horses.
- Hitting one exposed opponent horse.
- Bar re-entry priority.
- White and black bar entry mapping.
- Home-board detection.
- Exact bearing off.
- Oversized bearing off.
- Dice step consumption.
- Turn ending.
- Win detection.

Implemented first UI pass:

- Main menu.
- Human vs Human start.
- Human vs AI start.
- Rule/help modal.
- Game screen.
- Board point rendering.
- Source selection and legal target highlighting.
- Dice panel.
- Move hint panel.
- Character panels.
- Song Huizong themed opponent.

Implemented first automated tests:

- `tests/initialState.test.ts`
- `tests/dice.test.ts`
- `tests/movement.test.ts`
- `tests/legalMoves.test.ts`
- `tests/applyMove.test.ts`
- `tests/bearingOff.test.ts`
- `tests/winDetector.test.ts`
- `tests/helpers.ts`

### Verification

Ran:

```bash
npm test
```

Result:

```txt
7 test files passed
20 tests passed
```

Ran:

```bash
npm run build
```

Result:

```txt
Next.js production build passed
```

Started local dev server with approval because sandboxed port binding failed:

```bash
npm run dev
```

Result:

```txt
Local: http://localhost:3000
```

Confirmed page returns HTML with:

```bash
curl -s http://127.0.0.1:3000/
```

### Issues Encountered

Initial `npm install` in sandbox failed with:

```txt
connect EPERM 127.0.0.1:7897
```

Resolution:

- Re-ran `npm install` with escalated permissions.
- Dependencies installed successfully.

Initial Vitest run failed to resolve `@/game`.

Cause:

- `vitest.config.ts` used URL pathname alias resolution, which was fragile with the current iCloud path containing spaces and encoded characters.

Resolution:

- Switched alias resolution to `fileURLToPath(new URL("./src", import.meta.url))`.

Initial `npm run dev` failed in sandbox with:

```txt
listen EPERM 0.0.0.0:3000
```

Resolution:

- Re-ran `npm run dev` with escalated permissions.

### Open Risks

- Full game completion has not yet been manually playtested.
- AI can choose legal moves but has not been tuned.
- UI layout needs mobile QA.
- npm reported 7 moderate severity vulnerabilities after installation.
- No deployment target has been selected yet.

### Next Step

Run a structured browser playtest and record findings before adding new features.

## 2026-04-26 20:47 CST

### Objective

Update the rule and MVP scope documents to reflect explicit rule-layering decisions. Do not implement code.

### Documents Changed

- `docs/RULES_SPEC.md`
- `docs/MVP_SCOPE.md`
- `docs/PROJECT_STATUS.md`
- `docs/DECISIONS.md`

### Changes Made

Added `RuleConfig` to the rules specification:

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

Documented MVP default as Reconstruction Mode:

```ts
const DEFAULT_RULE_CONFIG: RuleConfig = {
  mode: 'reconstruction',
  useDoublesAsFourSteps: true,
  enableCrushingWin: false,
  horsesPerPlayer: 15,
  enableCharacterSkills: false,
};
```

Clarified that Classical Mode:

- Uses two dice steps even when doubles are rolled.
- Uses 15 horses.
- Disables character skills.
- Disables crushing win.

Clarified that MVP victory types are only:

- `single_win`
- `double_win`

Removed `crushing_win` from MVP scope and documented it only as a future variant controlled by `enableCrushingWin`.

Labeled oversized bearing off as a playable reconstruction mechanic.

Clarified the documentation distinction between:

- historically attested elements
- playable reconstruction mechanics
- future game variants

### Verification

No code was changed. No tests were run for this documentation-only update.

## 2026-04-26 21:13 CST

### Objective

Create a dedicated historical-claim boundary document. Do not implement code.

### Documents Changed

- `docs/HISTORICAL_NOTES.md`
- `docs/PROJECT_STATUS.md`
- `docs/DEV_LOG.md`

### Changes Made

Created `docs/HISTORICAL_NOTES.md` with five required sections:

1. Historically Supported Elements
2. Historically Suggested but Under-Specified Elements
3. Playable Reconstruction Mechanics
4. Game Adaptation / Story Mode Mechanics
5. Claims We Must Not Make

The new document clearly labels rule material as:

- `supported`
- `suggested`
- `reconstructed`
- `game adaptation`
- `must not claim`

It records the following project constraints:

- The MVP uses 15 horses per side.
- The MVP uses 24 abstract board points.
- `doubles as four steps` belongs to Reconstruction Mode, not Classical Mode.
- Oversized bearing-off is a playable reconstruction mechanic.
- Character skills are future Story Mode adaptations and not MVP rules.
- Crushing win is not part of MVP.
- The project must not claim to be a perfect Tang-Song rule restoration.
- The project must not claim all board terms and layouts are universally fixed across all historical periods.

Each major rule item includes a `Recommended In-Game Wording` subsection and an `Avoid` example.

### Verification

No code was changed. No tests were run for this documentation-only update.

### Open Follow-Up

Future UI copy, help text, character dialogue, marketing text, and AI-generated commentary should be checked against `docs/HISTORICAL_NOTES.md`.

## 2026-04-26 21:19 CST

### Objective

Record future data derivatives from `docs/HISTORICAL_NOTES.md`. Do not implement code.

### Documents Changed

- `docs/HISTORICAL_NOTES.md`
- `docs/PROJECT_STATUS.md`
- `docs/DEV_LOG.md`

### Changes Made

Added `Future Data Derivatives` to `docs/HISTORICAL_NOTES.md`.

Documented future `src/data/lore.ts` contract:

```ts
type LoreEntry = {
  id: string;
  title: string;
  category: 'rules' | 'history' | 'equipment' | 'adaptation';
  confidence: 'supported' | 'suggested' | 'reconstructed' | 'adaptation';
  body: string;
};
```

Documented future `src/data/ruleNotes.ts` purpose and starter notes:

- Classical Mode: conservative rules.
- Reconstruction Mode: modern playability completion.
- Story Mode: character skills and narrative adaptations, not Classical rules.

Added a process guardrail: future lore and rule-note entries should be traceable back to `docs/HISTORICAL_NOTES.md`.

### Verification

No code was changed. No tests were run for this documentation-only update.

## 2026-04-26 23:17 CST

### Objective

Continue 0.5 implementation by aligning code with the documented rule-layering model, deriving lore/rule-note data, and improving the end-of-match loop.

### Files Changed

- `src/game/types.ts`
- `src/game/constants.ts`
- `src/game/initialState.ts`
- `src/game/dice.ts`
- `src/game/winDetector.ts`
- `src/game/ai.ts`
- `src/store/gameStore.ts`
- `src/data/lore.ts`
- `src/data/ruleNotes.ts`
- `src/components/RulesPanel.tsx`
- `src/components/GameScreen.tsx`
- `tests/helpers.ts`
- `tests/dice.test.ts`
- `tests/initialState.test.ts`
- `tests/winDetector.test.ts`
- `tests/ai.test.ts`
- `docs/PROJECT_STATUS.md`
- `docs/DEV_LOG.md`

### Implementation Completed

Implemented `RuleConfig` in the rules engine:

- Added `RuleMode`.
- Added `RuleConfig`.
- Added `DEFAULT_RULE_CONFIG`.
- Added `CLASSICAL_RULE_CONFIG`.
- Added `ruleConfig` to `BoardState`.
- Updated `createInitialState(config?)`.
- Updated `cloneState`.
- Updated `diceToSteps(roll, config?)`.
- Updated game store dice expansion to use `state.ruleConfig`.

Added MVP victory classification:

- `VictoryType = 'single_win' | 'double_win'`.
- `getVictoryType(state)`.
- `crushing_win` remains unimplemented for MVP.

Added future historical data derivatives:

- `src/data/lore.ts`
- `src/data/ruleNotes.ts`

Updated `RulesPanel` to render rule-mode notes and lore entries from data files rather than hardcoding all historical/reconstruction copy directly in the component.

Improved end-of-match UI:

- Added victory summary panel.
- Added `single_win` / `double_win` display text.
- Added "再开一局" restart button.

Fixed AI scoring:

- Bear-off moves no longer produce `NaN` advancement scores.
- Added a regression test for AI choosing a bear-off move.

### Verification

Ran:

```bash
npm test
```

Result:

```txt
8 test files passed
27 tests passed
```

Ran:

```bash
npm run build
```

Result:

```txt
Next.js production build passed
```

Browser smoke test:

- Opened `http://127.0.0.1:3000`.
- Confirmed main menu renders.
- Confirmed menu Rules button opens 博戏志 modal without starting a game.
- Confirmed rule-mode notes render from `src/data/ruleNotes.ts`.
- Confirmed lore entries render from `src/data/lore.ts`.
- Confirmed Human vs AI game screen renders.
- Confirmed dice roll updates remaining dice steps.
- Confirmed legal target highlighting appears after selecting a movable horse.

### Issues Encountered

Browser initially showed a stale Next.js runtime overlay:

```txt
__webpack_modules__[moduleId] is not a function
```

Resolution:

- Stopped the stale Next dev server process.
- Restarted `npm run dev`.
- Reloaded the in-app browser at `http://127.0.0.1:3000`.
- The page then rendered correctly.

### Open Follow-Up

- Full-match manual testing is still required.
- Quick Mode remains intentionally unimplemented.
- Character/story text still needs future audit against `docs/HISTORICAL_NOTES.md`.
- Mobile screenshot QA has not yet been completed.

## 2026-04-26 23:19 CST

### Objective

Reduce mobile board layout risk and verify the restarted development server in browser.

### Files Changed

- `src/components/Board.tsx`
- `docs/PROJECT_STATUS.md`
- `docs/DEV_LOG.md`

### Implementation Completed

Updated `Board` layout:

- Wrapped the board in `overflow-x-auto`.
- Added a fixed minimum internal board width.
- Kept the 12-column point structure stable instead of letting mobile viewports crush point buttons and horses.

### Verification

Ran:

```bash
npm test
```

Result:

```txt
8 test files passed
27 tests passed
```

Ran:

```bash
npm run build
```

Result:

```txt
Next.js production build passed
```

Browser smoke test after restarting dev server:

- Opened `http://127.0.0.1:3000`.
- Confirmed main menu is visible.
- Confirmed no runtime overlay is visible.
- Clicked Human vs Human.
- Confirmed game screen and board render.
- Confirmed no runtime overlay is visible after navigation.

### Issue Noted

Running `npm run build` while `next dev` is active can leave the dev server with a stale `.next` module graph and show:

```txt
__webpack_modules__[moduleId] is not a function
```

Resolution:

- Stop the old dev server process.
- Restart `npm run dev`.
- Reload the browser.

### Open Follow-Up

- Full screenshot QA across desktop and mobile is still needed.
- Full-match manual testing is still needed.

## 2026-04-26 23:28 CST

### Objective

Improve first-screen playability after visual QA showed the dice controls were below the board.

### Files Changed

- `src/components/GameScreen.tsx`
- `src/components/CharacterPanel.tsx`
- `docs/PROJECT_STATUS.md`
- `docs/DEV_LOG.md`

### Implementation Completed

Adjusted game screen layout:

- Moved the dice panel above the board.
- Kept the move hint above the dice panel.
- Reordered non-wide layouts so the board appears before character panels.
- Reduced non-wide character portrait height to prevent the portrait panel from pushing the board off-screen.

### Verification

Ran:

```bash
npm test
```

Result:

```txt
8 test files passed
27 tests passed
```

Ran:

```bash
npm run build
```

Result:

```txt
Next.js production build passed
```

Browser screenshot QA:

- Opened `http://127.0.0.1:3000`.
- Clicked Human vs Human.
- Confirmed no runtime overlay is visible.
- Confirmed dice panel appears before the board.
- Confirmed the board is visible in the first viewport.

### Open Follow-Up

- Mobile viewport screenshot QA still needs a separate pass.
- Full-match manual testing is still required.

## 2026-04-27 00:25 CST

### Objective

Address the playtest finding that the game was mechanically playable but not understandable to a new player.

The core problem was not the rules engine. The visible UI did not explain:

- What the player is trying to accomplish.
- Which direction each side moves.
- Which horses are legal to select.
- Why some points can or cannot be entered.
- What the next click should be after rolling or selecting a horse.

### Files Changed

- `src/components/TurnCoach.tsx`
- `src/components/GameScreen.tsx`
- `src/components/Board.tsx`
- `src/components/BoardPoint.tsx`
- `src/components/DicePanel.tsx`
- `src/components/MainMenu.tsx`
- `src/components/MoveHint.tsx`
- `src/store/gameStore.ts`
- `docs/PROJECT_STATUS.md`
- `docs/DEV_LOG.md`

### Implementation Completed

Added a compact in-game turn coach:

- States the objective: first side to bear off all 15 horses wins.
- Shows the current action in player language.
- Explains movement direction: white moves from 23 to 0, black moves from 0 to 23.
- Explains hitting and blocking.
- Explains the click sequence: select a highlighted horse, then select a green landing point.
- Shows the number of currently legal actions.
- Shows up to three concrete legal move examples after rolling or selecting a source.

Improved board readability:

- Board sources now highlight only source points that have at least one legal move.
- Legal source points show `选马`.
- Legal landing points show `可行`.
- Selected source points get a stronger border.
- The bearing-off button gets an explicit green enabled style only when bearing off is legal.
- The board header now uses player-action language instead of terse route labels.

Improved first-screen wording:

- Main menu now explains that the goal is to send all 15 horses off the board.
- Dice panel now explains that dice faces become the turn's available steps.
- Move hint now labels the current instruction explicitly.
- Store messages now tell the player to click highlighted horses and green landing points.

### Verification

Ran:

```bash
npm test
```

Result:

```txt
8 test files passed
27 tests passed
```

Ran:

```bash
npm run build
```

Result:

```txt
Next.js production build passed
```

Browser smoke test:

- Restarted the stale local dev server after `npm run build`.
- Opened `http://127.0.0.1:3000`.
- Confirmed the main menu renders and includes the revised objective wording.
- Started a Human vs Human match.
- Confirmed the game screen shows the turn coach.
- Confirmed the coach states the 15-horse objective, movement direction, hitting rule, and click sequence.
- Rolled dice.
- Confirmed legal source points show `选马`.
- Selected a legal source.
- Confirmed the coach says to select a green landing point and the board shows `可行` targets.

### Issues Encountered

Initial production build failed because JSX text used raw `>` characters in `TurnCoach`.

Resolution:

- Escaped the arrows as `-&gt;`.
- Re-ran tests and build successfully.

The existing dev server on port 3000 stopped responding after the production build.

Resolution:

- Stopped the stale Node process.
- Restarted `npm run dev`.
- Completed browser smoke testing against the restarted server.

### Open Follow-Up

- Run a fresh-player five-minute comprehension test.
- Add feedback for clicks on non-highlighted or blocked points.
- Run mobile viewport screenshot QA.
- Full-match manual testing is still required.

## 2026-04-27 13:45 CST

### Objective

Address the stronger product-quality finding that the UI still felt crude and that the win condition was not sufficiently legible during play.

The problem was split into two issues:

- Victory state was explained in text but not represented as persistent game progress.
- The board still looked like a grid of debug buttons instead of a game surface.

### Files Changed

- `src/components/VictoryTracker.tsx`
- `src/components/GameScreen.tsx`
- `src/components/Board.tsx`
- `src/components/BoardPoint.tsx`
- `src/components/TurnCoach.tsx`
- `src/components/DicePanel.tsx`
- `src/components/CharacterPanel.tsx`
- `docs/PROJECT_STATUS.md`
- `docs/DEV_LOG.md`

### Implementation Completed

Added persistent victory progress:

- New `VictoryTracker` component.
- Shows `0/15` borne-off progress for both sides.
- Shows how many horses each side still needs to bear off to win.
- Marks the current player.
- States the MVP double-win condition.
- Explicitly states that MVP does not include crushing win.

Improved board presentation:

- Replaced rectangular point cards with triangular point visuals.
- Added alternating point tones to make the board read more like a traditional race board.
- Kept stacked horse pieces visible on each point.
- Changed legal source labels from verbose `选马` to compact `选`.
- Changed legal target labels from `可行` to compact `可落`.
- Strengthened selected-source and legal-target styling.
- Reworked the center strip for bar and borne-off areas with clearer purpose text.

Reduced first-viewport clutter:

- Victory progress and dice panel now sit side by side on desktop.
- Turn coach was compressed into a lower-height action bar.
- Dice panel was compacted.
- Character panels were simplified so they no longer dominate the layout with large placeholder portraits.

### Verification

Ran:

```bash
npm test
```

Result:

```txt
8 test files passed
27 tests passed
```

Ran:

```bash
npm run build
```

Result:

```txt
Next.js production build passed
```

Browser screenshot QA:

- Restarted the stale local dev server after production build.
- Opened `http://127.0.0.1:3000`.
- Started a Human vs Human match.
- Confirmed the screen shows `先出完 15 枚马即胜`.
- Confirmed both sides show `0/15` and remaining horses to win.
- Confirmed dice panel and victory tracker fit side by side on desktop.
- Confirmed the triangular board is visible in the first viewport.
- Rolled dice and confirmed legal source labels appear.
- Selected a legal source and confirmed green `可落` targets appear on the board.

### Issues Encountered

The first pass of the victory tracker made the HUD too tall, pushing the board out of the first viewport.

Resolution:

- Compressed `VictoryTracker`.
- Moved `VictoryTracker` and `DicePanel` into the same desktop row.
- Compressed `TurnCoach` and `DicePanel`.

### Open Follow-Up

- Mobile viewport QA remains required.
- The board still needs final visual direction and art assets; this pass removes the debug-grid feel but is not final art.
- Add click feedback for non-highlighted or blocked points.
- Run full-match manual tests in Human vs Human and Human vs AI.

## 2026-04-28 09:12 CST

### Objective

Continue improving the in-play feel. The previous pass made the win condition and board shape clearer, but play still needed moment-to-moment feedback so the player can feel that a move happened and understand what changed.

### Files Changed

- `src/components/PlayFeedback.tsx`
- `src/components/GameScreen.tsx`
- `src/components/Board.tsx`
- `src/components/BoardPoint.tsx`
- `src/components/DicePanel.tsx`
- `src/app/globals.css`
- `docs/PROJECT_STATUS.md`
- `docs/DEV_LOG.md`

### Implementation Completed

Added a gameplay feedback strip:

- Shows the current instruction.
- Shows the previous move after each action.
- Distinguishes normal moves, bar re-entry, bearing off, and hits.
- Uses event icons for normal movement, hits, bearing off, and pre-move state.

Added board-state feedback:

- Previous source point is marked with `起`.
- Previous destination point is marked with `落`.
- Hit destination is marked with `打`.
- Bearing-off destination shows `刚出马`.
- Legal landing points pulse while waiting for target selection.
- Legal source points pulse while waiting for source selection.

Added motion feedback:

- Dice results pop when a roll is made.
- Roll button pulses when rolling is currently allowed.
- Arriving pieces animate briefly on the latest destination.
- Hit badges flash in.
- Feedback strip animates on state updates.
- Reduced-motion users receive near-instant animations through a `prefers-reduced-motion` rule.

### Verification

Ran:

```bash
npm test
```

Result:

```txt
8 test files passed
27 tests passed
```

Ran:

```bash
npm run build
```

Result:

```txt
Next.js production build passed
```

Browser gameplay QA:

- Started local dev server.
- Opened `http://127.0.0.1:3000`.
- Started a Human vs Human match.
- Confirmed the feedback strip starts with `上一手：尚未行棋，先掷骰`.
- Rolled dice and confirmed legal source points appear.
- Selected a legal source and confirmed legal `可落` target appears.
- Clicked a legal target and confirmed the board marks previous source with `起` and destination with `落`.
- Confirmed the previous move appears in the feedback strip.

### Open Follow-Up

- Add explicit reason feedback when the player clicks a non-highlighted point or blocked point.
- Add hit-specific browser QA with a constructed position.
- Add bearing-off browser QA with a constructed late-game position.
- Mobile viewport QA remains required.

## 2026-04-29 11:09 CST

### Objective

Increase atmosphere and tactile feedback for dice and horse movement. The prior pass added functional feedback, but dice and board motion still felt too immediate and thin.

### Files Changed

- `src/components/DicePanel.tsx`
- `src/components/Board.tsx`
- `src/components/BoardPoint.tsx`
- `src/app/globals.css`
- `docs/PROJECT_STATUS.md`
- `docs/DEV_LOG.md`

### Implementation Completed

Improved dice feel:

- Converted `DicePanel` to a client component.
- Added a short rolling phase before resolving a roll.
- During rolling, the button changes from `掷骰` to `听骰`.
- Preview dice values change rapidly during the rolling phase.
- The dice icon spins while rolling.
- Dice squares use a tumbling animation while rolling and a pop animation when resolved.

Improved board atmosphere:

- Added a subtle lacquer-board glow animation.
- Added a center-rail shimmer.
- Added an arrival ripple on the last destination point.
- Added piece glints on hover.
- Kept the existing source, target, hit, and last-move animations.

### Verification

Ran:

```bash
npm test
```

Result:

```txt
8 test files passed
27 tests passed
```

Ran:

```bash
npm run build
```

Result:

```txt
Next.js production build passed
```

Browser animation QA:

- Started local dev server.
- Opened `http://127.0.0.1:3000`.
- Started a Human vs Human match.
- Confirmed dice panel and board render.
- Clicked `掷骰` and confirmed the button enters `听骰` state.
- Confirmed preview dice values appear during the rolling phase.
- Confirmed roll settles into legal move selection.
- Selected a horse and confirmed legal `可落` targets.
- Clicked a target and confirmed previous source / destination markers plus the destination ripple state.

### Open Follow-Up

- Add audio hooks or optional sound effects for dice, hits, and bearing off.
- Add hit-specific browser QA with a constructed position.
- Add bearing-off browser QA with a constructed late-game position.
- Mobile viewport QA remains required.

## 2026-04-29 20:20 CST

### Objective

Replace the numeric dice placeholders with actual simulated dice faces. The prior dice animation changed numbers inside square blocks, which did not read as dice.

### Files Changed

- `src/components/DiceFace.tsx`
- `src/components/DicePanel.tsx`
- `src/app/globals.css`
- `docs/PROJECT_STATUS.md`
- `docs/DEV_LOG.md`

### Implementation Completed

Added a dedicated `DiceFace` component:

- Renders pips for values 1 through 6.
- Uses an empty die state before the first roll.
- Provides accessible labels such as `3 点`.
- Keeps the rolling-state integration from `DicePanel`.

Improved dice styling:

- Added rounded die body with bevel, highlight, shadow, and darker pips.
- Reused the rolling and settle animations on the die body rather than on a numeric block.

### Verification

Ran:

```bash
npm test
```

Result:

```txt
8 test files passed
27 tests passed
```

Ran:

```bash
npm run build
```

Result:

```txt
Next.js production build passed
```

Browser visual QA:

- Restarted local dev server after the build.
- Opened `http://127.0.0.1:3000`.
- Started a Human vs Human match.
- Confirmed unrolled dice render as empty dice bodies.
- Clicked `掷骰` and confirmed the `听骰` rolling state.
- Confirmed settled dice render as pip dice faces rather than numeric blocks.

### Open Follow-Up

- Improve dice motion further with a more physical roll path if needed.
- Add optional audio only after the visual dice is acceptable.

## 2026-04-30 19:40 CST

### Objective

Move the project out of local-only development by syncing it to GitHub and preparing for Aliyun GD deployment.

### Files Changed

- `.gitignore`
- `docs/DEPLOYMENT.md`
- `docs/PROJECT_STATUS.md`
- `docs/DEV_LOG.md`

### GitHub Sync

Initialized a local Git repository in the project directory.

Added `.obsidian` to `.gitignore` so local Obsidian workspace state is not pushed.

Committed the initial project:

```txt
dd43221 Initial Shuanglu prototype
```

Configured remote:

```txt
origin git@github.com:louiezhelee-uway/shuanglu.git
```

The remote repository already had a placeholder commit:

```txt
95768b4 Initialize repository
```

Merged the remote placeholder history instead of force pushing:

```txt
9211616 Merge remote repository placeholder
```

Pushed `main` successfully:

```txt
95768b4..9211616 main -> main
```

Current synced commit:

```txt
921161631b11e92fcfa2f2a48e07d576f52e8fd5
```

### Verification

Before the GitHub sync, the project had already passed:

```bash
npm test
```

Result:

```txt
8 test files passed
27 tests passed
```

```bash
npm run build
```

Result:

```txt
Next.js production build passed
```

### Aliyun GD Deployment Status

Deployment is blocked pending server details.

Findings:

- No working `aliyun-gd` SSH config entry exists locally.
- `ssh -G aliyun-gd` falls back to unresolved hostname defaults.
- Direct `ssh aliyun-gd` fails DNS resolution.
- Existing configured hosts do not clearly identify an Aliyun GD server.

Required to proceed:

- SSH host or SSH config alias
- SSH user
- Deployment path
- Public domain or port
- Whether to serve with static export or a Node/Next process

### Open Follow-Up

- Deploy to Aliyun GD after receiving the correct SSH target.
- Add server-side deployment notes once the target is confirmed.

## 2026-04-30 22:10 CST

### Objective

Sync the project to GitHub and deploy the current `0.5` prototype to the Aliyun GD server using a Next.js Node process behind Nginx.

### Deployment Target

- GitHub repository: `louiezhelee-uway/shuanglu`
- Synced commit: `b7b9e554787ae3f62e08f2b8f7160c84bf2f6982`
- Public URL: `http://47.121.182.144/`
- Server app path: `/opt/shuanglu`
- Internal app address: `127.0.0.1:3002`
- PM2 process: `shuanglu`
- Nginx config: `/etc/nginx/conf.d/shuanglu.conf`

No server credentials are stored in repository documents.

### Server Findings

The server is Ubuntu 24.04.4 LTS with:

- Node `v18.19.1`
- npm `9.2.0`
- Git `2.43.0`
- Nginx `1.24.0`
- PM2 already installed and active

Existing services were preserved:

- PM2 process `school-application`
- PM2 process `gaokao-sprint-coach`
- Existing Nginx default server for `college.hkuway.com`
- Existing `/gaokao` reverse proxy to `127.0.0.1:3001`

### Deployment Work Completed

The server could not reliably fetch the GitHub repository directly within the deployment window, so the deployed package was created from the local synced Git commit:

```bash
git archive --format=tar.gz -o /tmp/shuanglu-deploy-b7b9e55.tgz HEAD
```

Uploaded the archive to the server and extracted it into:

```txt
/opt/shuanglu
```

Installed dependencies and built on the server:

```bash
npm ci
npm run build
```

Started the production app with PM2:

```bash
pm2 start npm --name shuanglu -- start -- --hostname 127.0.0.1 --port 3002
pm2 save
```

Added a dedicated Nginx server block for the IP host `47.121.182.144`, proxying to:

```txt
http://127.0.0.1:3002
```

Reloaded Nginx after configuration validation:

```bash
nginx -t
systemctl reload nginx
```

### Verification

Server-side build passed:

```txt
Next.js production build passed.
```

Internal app check:

```bash
curl -I --max-time 10 http://127.0.0.1:3002/
```

Result:

```txt
HTTP/1.1 200 OK
```

PM2 status:

```txt
shuanglu online
```

Nginx status:

```txt
nginx configuration file syntax is ok
nginx configuration test is successful
```

External public check:

```bash
curl -s --max-time 20 http://47.121.182.144/
```

Result:

```txt
The response contains <title>双陆 Shuanglu.
```

### Open Risks

- The public deployment currently uses HTTP on an IP address. A real hostname and HTTPS certificate are still required for launch.
- The server uses Node `18.19.1`. The build passed, but one transitive development dependency emitted a warning that newer Node versions are preferred.
- `npm ci` reported 7 moderate severity advisories. They were not force-fixed because that could introduce breaking dependency changes.
- Direct server-to-GitHub fetch was unreliable during this deployment. Future releases should use either a reliable server Git path or a scripted local archive upload process.
