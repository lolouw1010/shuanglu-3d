## Project
This is the independent fixed-camera 3D Shuanglu application.

## Goal
Present the same Shuanglu rules in a fixed room scene with two visible players, a complete 3D board, and movable bottle-shaped horses. Do not build a free-camera or room-exploration game.

## Rules
Read docs/RULES_SPEC.md before changing game logic.

## Architecture
Game rules must live in /src/game as pure TypeScript functions.
React components must only render state and dispatch actions.
The 3D renderer must not own or duplicate simulation state.
Keep text-heavy HUD and settings in DOM, outside the Canvas.
Do not link runtime source from the 2D repository.
Use `docs/UPSTREAM_SYNC.md` to review and cherry-pick focused 2D core fixes.

## Commands
- Install: npm install
- Dev: npm run dev
- Test: npm test
- Build: npm run build

## Do Not
- Do not add OrbitControls or any user-controlled camera rotation, pan, or zoom.
- Do not expand online multiplayer beyond the copied lightweight friend-room MVP unless explicitly requested.
- Do not add authentication.
- Do not add payment.
- Do not hardcode rules inside UI components.
- Do not invent historical claims in UI copy.
- Do not push to the `upstream-2d` remote.

## Definition of Done
- Game can complete one full match.
- Legal move generation works.
- Hit, re-entry, bearing-off and win detection work.
- The camera remains fixed and the complete board stays clickable.
- Character and room rendering cannot block board hit zones.
- All tests pass.
