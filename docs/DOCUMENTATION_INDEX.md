# 3D Documentation Index

Last updated: 2026-07-20 CST

## Start Here

- `PROJECT_STATUS.md` records the independent fixed-camera 3D status and next milestones.
- `DEV_LOG.md` records chronological development work and decisions as they happened.
- `DEPLOYMENT.md` records the active isolated Linode deployment boundary and release procedure.
- `UPSTREAM_SYNC.md` defines selective 2D-to-3D bug-fix synchronization.
- `WORK_SUMMARY_2026-06-12.md` records the June 12 2D interface work summary, deployment verification, and Git sync state.

## Rules And Scope

- `RULES_SPEC.md` is the core rule-layer specification.
- `MVP_SCOPE.md` defines what belongs in the 0.5 MVP and what is explicitly future scope.
- `HISTORICAL_NOTES.md` separates historically supported elements, suggested elements, playable reconstruction mechanics, and game adaptations.
- `TEST_CASES.md` is the early test-case placeholder; current executable tests live in `tests/`.

## Design And Implementation

- `GAME_DESIGN.md` captures early game design direction.
- `TECH_SPEC.md` captures the early technical scaffold note.
- `ART_DIRECTION_2D.md` captures the stable 2D interface reference direction and state-specific layout rules.
- `ART_DIRECTION_3D.md` captures the 3D design process and approved visual direction constraints.
- `CLOUD_ASSETS.md` records cloud-hosted runtime and asset handoff context.
- `DECISIONS.md` records early architecture and product decisions.
- `AGENTS.md` gives agent/development workflow instructions.

## Current Public Test Targets

```txt
Production: https://3d.shuanglu.uway.click
Health endpoint: https://3d.shuanglu.uway.click/health
Service: shuanglu-3d.service on 127.0.0.1:3003
```

The public root and `/3d` routes open the fixed-camera 3D application. The stable 2D production application remains a separate repository and deployment.

## Documentation Rules

- Use `.md` filenames, not `.md.md`.
- Keep historical claims conservative and label confidence clearly.
- Distinguish historically supported elements, playable reconstruction mechanics, and future game adaptations.
- Record meaningful development and deployment work in `DEV_LOG.md`, `PROJECT_STATUS.md`, and `DEPLOYMENT.md` before publishing.
- Keep current production instructions at the top of operational documents and label retired infrastructure as historical.
