## Project
This is a web prototype of Shuanglu, an ancient Chinese dice-and-race board game.

## Goal
Build a playable MVP, not a full commercial game.

## Rules
Read docs/RULES_SPEC.md before changing game logic.

## Architecture
Game rules must live in /src/game as pure TypeScript functions.
React components must only render state and dispatch actions.

## Commands
- Install: npm install
- Dev: npm run dev
- Test: npm test
- Build: npm run build

## Do Not
- Do not expand online multiplayer beyond the existing lightweight friend-room MVP unless explicitly requested.
- Do not add authentication.
- Do not add payment.
- Do not hardcode rules inside UI components.
- Do not invent historical claims in UI copy.

## Definition of Done
- Game can complete one full match.
- Legal move generation works.
- Hit, re-entry, bearing-off and win detection work.
- All tests pass.
