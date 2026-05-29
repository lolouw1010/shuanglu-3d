# Documentation Index

Last updated: 2026-05-30 CST

## Start Here

- `PROJECT_STATUS.md` records the current product state, verified commands, known risks, and next engineering priorities.
- `DEV_LOG.md` records chronological development work and decisions as they happened.
- `DEPLOYMENT.md` records Aliyun GD deployment history and operational verification.

## Rules And Scope

- `RULES_SPEC.md` is the core rule-layer specification.
- `MVP_SCOPE.md` defines what belongs in the 0.5 MVP and what is explicitly future scope.
- `HISTORICAL_NOTES.md` separates historically supported elements, suggested elements, playable reconstruction mechanics, and game adaptations.
- `TEST_CASES.md` is the early test-case placeholder; current executable tests live in `tests/`.

## Design And Implementation

- `GAME_DESIGN.md` captures early game design direction.
- `TECH_SPEC.md` captures the early technical scaffold note.
- `ART_DIRECTION_3D.md` captures the 3D design process and approved visual direction constraints.
- `CLOUD_ASSETS.md` records cloud-hosted runtime and asset handoff context.
- `DECISIONS.md` records early architecture and product decisions.
- `AGENTS.md` gives agent/development workflow instructions.

## Current Public Test Targets

```txt
http://47.121.182.144/
http://47.121.182.144/3d
```

The stable playable target is `/`. The `/3d` route is an isolated visual spike.

## Documentation Rules

- Use `.md` filenames, not `.md.md`.
- Keep historical claims conservative and label confidence clearly.
- Distinguish historically supported elements, playable reconstruction mechanics, and future game adaptations.
- Record meaningful development and deployment work in `DEV_LOG.md`, `PROJECT_STATUS.md`, and `DEPLOYMENT.md` before publishing.
