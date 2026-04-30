# Project Status

Last updated: 2026-04-30 22:10 CST

## Current Target

Version target: `0.5`

Goal: complete and deploy a playable local web prototype of Shuanglu within one week.

The current priority is a stable playable baseline, not commercial completeness.

## Current State

The project has been initialized as a Next.js web application.

Implemented:

- Next.js + React + TypeScript project scaffold.
- Tailwind CSS styling setup.
- Zustand game state orchestration.
- Vitest test setup.
- Pure TypeScript rules engine under `src/game`.
- Basic local Human vs Human mode.
- Basic Human vs AI mode.
- Basic Song Huizong themed opponent presentation.
- Rule/help modal.
- Main menu and game board screen.
- Dice panel, current move message, bar display, borne-off display.
- Automated rule tests.
- Historical claim boundary document at `docs/HISTORICAL_NOTES.md`.
- Future data derivative contracts for `src/data/lore.ts` and `src/data/ruleNotes.ts` documented in `docs/HISTORICAL_NOTES.md`.
- `RuleConfig` implemented in `src/game`.
- Reconstruction Mode and Classical Mode dice-step behavior covered by tests.
- MVP victory classification implemented as `single_win` / `double_win`.
- `src/data/lore.ts` and `src/data/ruleNotes.ts` created from `docs/HISTORICAL_NOTES.md`.
- Rules modal now renders mode notes and lore entries from data files.
- Basic browser smoke test completed for menu, rules modal, dice roll, and legal target highlighting.
- Board now uses a horizontally scrollable fixed minimum-width playfield to avoid mobile column collapse.
- Game screen now places the dice panel above the board so the first action is visible without scrolling.
- Added an in-game turn coach that states the win goal, movement direction, hitting rule, click sequence, current action, legal move count, and example legal moves.
- Board sources now highlight only currently legal source points, with visible `选马` labels; selected moves show green `可行` landing points.
- Main menu and dice panel copy now explain the objective and dice-step relationship in player-action language.
- Added a persistent victory tracker that shows each side's borne-off count, remaining horses to win, and the MVP double-win condition.
- Reworked the board from rectangular debug cells into a more game-like triangular point layout with stacked horse pieces.
- Compressed the HUD so victory progress and dice sit side by side on desktop, keeping the board visible earlier in the first viewport.
- Simplified character panels so they read as secondary context rather than oversized placeholder portraits.
- Added a play feedback strip that reports the current instruction and the previous move.
- Added visible last-move board traces: previous source, previous destination, hit marker, and borne-off marker.
- Added gameplay motion states for selectable sources, legal landing points, dice results, piece arrival, hit feedback, and feedback-strip updates.
- Added a short dice rolling phase with changing preview dice and `听骰` button state before the roll resolves.
- Replaced numeric dice blocks with actual pip-based dice faces.
- Added atmospheric board motion: lacquer-board glow, center-rail shimmer, arrival ripple, and horse-piece hover glints.
- Initialized local Git repository and synced the project to GitHub at `louiezhelee-uway/shuanglu`.
- Added deployment tracking document at `docs/DEPLOYMENT.md`.
- Deployed the current Next.js build to Aliyun GD at `http://47.121.182.144/`.
- Production runtime is PM2 process `shuanglu` behind Nginx, bound internally to `127.0.0.1:3002`.

## Verified Commands

Last verified on 2026-04-29 20:20 CST:

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

```bash
npm run dev
```

Result:

```txt
Local: http://localhost:3000
```

Last deployed on 2026-04-30 22:10 CST:

```bash
npm ci
npm run build
pm2 start npm --name shuanglu -- start -- --hostname 127.0.0.1 --port 3002
nginx -t
systemctl reload nginx
```

Result:

```txt
Server build passed.
PM2 process shuanglu is online.
Nginx configuration test passed.
Public URL http://47.121.182.144/ returns <title>双陆 Shuanglu.
```

## Running Local Server

The local development server was started successfully on:

```txt
http://localhost:3000
```

If the server is no longer reachable, restart it with:

```bash
npm run dev
```

## Known Risks

- The Aliyun GD server currently runs Node `18.19.1`; `npm ci` completed, but one transitive development dependency warned that newer Node versions are preferred.
- The deployed public endpoint is plain HTTP on the server IP. A production hostname and HTTPS certificate are still needed before a public launch.
- The server could not reliably fetch the GitHub repository directly, so the first deployment used a local Git archive upload from the synced commit.
- Quick Mode is documented but not implemented. `createInitialState` intentionally rejects non-15-horse layouts until quick layouts exist.
- In-game text has only had an initial audit through the rules modal; character and future story text still need review against `docs/HISTORICAL_NOTES.md`.
- `npm install` reported 7 moderate severity vulnerabilities. Do not run `npm audit fix --force` without reviewing the dependency changes.
- UI has had browser screenshot QA for the revised victory tracker, triangular board, gameplay feedback layer, and dice/board animation pass, but not a full mobile screenshot pass.
- The first-turn guidance is clearer, but a fresh user still needs a full five-minute comprehension test.
- Human vs AI has basic heuristics only; it is not tuned for strong or historically flavored play.
- Full-match manual testing is still required. Automated tests cover core rules but not a complete end-to-end game.
- The board UI is no longer a pure debug grid and now includes basic gameplay motion and atmosphere, but still needs final art direction, audio, and mobile polish before launch.

## Next Engineering Priorities

1. Assign a production hostname and enable HTTPS for the Aliyun GD deployment.
2. Manual playtest a complete Human vs Human match.
3. Manual playtest a complete Human vs AI match.
4. Add explicit reason feedback when clicking non-highlighted or blocked points.
5. Run mobile viewport screenshot QA for the compact HUD and triangular board.
6. Add regression tests for full-turn sequences.
7. Tune AI heuristics for fewer obvious tactical mistakes.
