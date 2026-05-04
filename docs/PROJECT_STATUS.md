# Project Status

Last updated: 2026-05-04 16:19 CST

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
- Improved bar re-entry guidance: when a player has horses on the bar, the board now labels the bar control as `点这里复马` and the turn prompts explain the two-step action.
- Started the visual-board upgrade from flat prototype to a more 3D-like lacquer table.
- Reordered the game screen so the board appears before the turn coach and play feedback.
- Reworked the board into a staged scene with perspective wrapper, thick lacquer shell, dark inner tray, gold center spine, bar well, and bearing-off well.
- Added image asset slots for final bottle-shaped horse pieces at `public/assets/pieces/white-horse-idle.png` and `public/assets/pieces/black-horse-idle.png`.
- Added CSS fallback vase-shaped horse pieces while the final image assets are not yet committed.
- Added first-pass online room play:
  - Create room by six-character code.
  - Creator plays white.
  - First friend to join plays black.
  - Additional clients join as spectators.
  - Authoritative room state lives on the Next.js Node server.
  - Online roll and move actions are validated server-side.
  - Clients poll the room state for turn updates.
- Added online entry UI to the main menu and online room status UI to the game screen.
- Opened the `0.6-3d-table` interface phase.
- Added Three.js / React Three Fiber / Drei runtime dependencies.
- Added a dynamically loaded WebGL game table scene as the primary board presentation.
- Added a programmatic 3D room, lacquer table, 24 board points, glossy bottle/vase horse pieces, dice, and spectator figures.
- Wired 3D point/bar/off clicks into the existing legal move selection and target submission callbacks.
- Removed external HDR environment dependency from the first 3D pass; the scene currently uses local procedural geometry and lights only.
- Stabilized the 3D scene after the first animation-heavy version crashed:
  - Removed `drei/Text` labels.
  - Removed continuous per-frame horse, spectator, and dice animation.
  - Reduced geometry/shadow/rendering cost for the first stable 3D baseline.
- Initialized local Git repository and synced the project to GitHub at `louiezhelee-uway/shuanglu`.
- Added deployment tracking document at `docs/DEPLOYMENT.md`.
- Deployed the current Next.js build to Aliyun GD at `http://47.121.182.144/`.
- Production runtime is PM2 process `shuanglu` behind Nginx, bound internally to `127.0.0.1:3002`.
- Deployed the first 3D-like board visual pass to Aliyun GD from working-tree archive `/tmp/shuanglu-visual-20260502-2349.tgz`.
- Deployed the online room MVP to Aliyun GD from source commit `0108b27`.

## Verified Commands

Last verified locally on 2026-05-03 17:11 CST:

```bash
npm run build
```

Result:

```txt
Next.js production build passed.
API routes /api/rooms and /api/rooms/[roomId] compiled as dynamic server routes.
```

```bash
npm test
```

Result:

```txt
8 test files passed, 27 tests passed.
```

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

Latest server recovery and deployment verification on 2026-05-01 18:36 CST:

```bash
npm ci --no-audit --no-fund
npm run build
pm2 restart shuanglu --update-env
pm2 save
curl -I --max-time 20 http://47.121.182.144/
```

Result:

```txt
Server build passed.
PM2 process shuanglu is online.
Next.js listens on 127.0.0.1:3002.
Public URL http://47.121.182.144/ returns HTTP 200.
Public JavaScript bundle contains 点这里复马.
```

Latest Aliyun visual deployment on 2026-05-03 10:54 CST:

```bash
npm ci --no-audit --no-fund
npm run build
pm2 restart shuanglu --update-env
pm2 save
nginx -t
systemctl reload nginx
curl -I --max-time 20 http://47.121.182.144/
```

Result:

```txt
Server build passed.
PM2 process shuanglu is online.
Nginx configuration test passed.
Public URL http://47.121.182.144/ returns HTTP 200.
Public JavaScript bundle contains board-scene, board-shell, board-perspective, and white-horse-idle.
```

Latest Aliyun online room deployment on 2026-05-03 17:55 CST:

```bash
npm ci --no-audit --no-fund
npm run build
pm2 restart shuanglu --update-env
pm2 save
nginx -t
systemctl reload nginx
curl -I --max-time 20 http://47.121.182.144/
curl -s --max-time 20 -X POST http://47.121.182.144/api/rooms
```

Result:

```txt
Server build passed.
PM2 process shuanglu is online.
Nginx configuration test passed.
Public URL http://47.121.182.144/ returns HTTP 200.
Online room API can create a room, join a second player, read room state, roll, and apply a legal move.
```

Latest local 3D interface verification on 2026-05-04 16:00 CST:

```bash
npm run build
npm test
```

Result:

```txt
Next.js production build passed.
8 test files passed, 27 tests passed.
```

Dev server smoke check:

```txt
npm run dev started on http://localhost:3000.
The game route compiled and served without dev server runtime errors.
The local dev server was stopped after the check.
```

Latest 3D stabilization verification on 2026-05-04 16:19 CST:

```bash
npm run build
npm test
```

Result:

```txt
Next.js production build passed.
8 test files passed, 27 tests passed.
```

Last verified locally on 2026-05-01 16:08 CST:

```bash
npm test
npm run build
```

Result:

```txt
8 test files passed, 27 tests passed.
Next.js production build passed.
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
- The server could not reliably fetch the GitHub repository directly, so deployments currently use local Git archive upload from the synced commit.
- The latest visual deployment was made from a local working-tree archive, then committed and pushed to GitHub as `47d6f60`.
- Online rooms are currently in-memory only. A PM2 restart will clear active rooms.
- Online room access is intentionally lightweight for testing and does not yet include accounts, passwords, or private invites.
- Online clients use polling rather than WebSocket. This is acceptable for the first turn-based friend-play test but should be reviewed after playtesting.
- The 3D scene is a first procedural interface pass. It has not yet had full screenshot QA across desktop and mobile.
- The 3D scene uses procedural placeholder pieces, dice, table, room, and spectators. Final art assets are still needed.
- Current 3D animation is intentionally disabled after the first animation-heavy pass caused crashes. Animation must be reintroduced incrementally.
- Interrupted dependency installs can leave `node_modules` in a broken state. If that happens, move the broken directory outside `/opt/shuanglu` before running a clean `npm ci --no-audit --no-fund`.
- Quick Mode is documented but not implemented. `createInitialState` intentionally rejects non-15-horse layouts until quick layouts exist.
- In-game text has only had an initial audit through the rules modal; character and future story text still need review against `docs/HISTORICAL_NOTES.md`.
- `npm install` reported 7 moderate severity vulnerabilities. Do not run `npm audit fix --force` without reviewing the dependency changes.
- UI has had browser screenshot QA for the revised victory tracker, triangular board, gameplay feedback layer, and dice/board animation pass, but not for the latest 3D-like board shell pass or a full mobile pass.
- The first-turn guidance is clearer, but a fresh user still needs a full five-minute comprehension test.
- Human vs AI has basic heuristics only; it is not tuned for strong or historically flavored play.
- Full-match manual testing is still required. Automated tests cover core rules but not a complete end-to-end game.
- The board UI is no longer a pure debug grid and now includes basic gameplay motion and a first 3D-like lacquer-table pass, but still needs final art direction, real piece assets, audio, and mobile polish before launch.

## Next Engineering Priorities

1. Assign a production hostname and enable HTTPS for the Aliyun GD deployment.
2. Deploy the online room build to Aliyun and test one match with two browsers or two devices.
3. Add shareable room URLs and refresh/reconnect UX.
4. Run desktop screenshot QA for the new WebGL 3D table scene.
5. Add 3D horse move-path animation and clearer stack layout.
6. Add shareable room URLs and refresh/reconnect UX.
7. Manual playtest a complete Human vs Human online match.
8. Manual playtest a complete Human vs AI match.
9. Add explicit reason feedback when clicking non-highlighted or blocked points.
10. Run mobile viewport QA for the online menu, compact HUD, and 3D scene fallback behavior.
11. Add regression tests for full-turn sequences.
12. Tune AI heuristics for fewer obvious tactical mistakes.
