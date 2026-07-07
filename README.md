# 双陆 · 立体对弈

An independent fixed-camera 3D presentation of the Shuanglu rules engine.

## Product Direction

This application is not a freely rotatable 3D tabletop and not a room-exploration game. It presents a staged room from a designed camera angle:

- Two seated characters remain visible behind the table.
- The complete 24-point board remains readable and clickable.
- Bottle-shaped white and black horses are rendered in 3D.
- The renderer dispatches actions into the copied rules/store boundary; it does not own game rules.
- Text-heavy controls and help stay in DOM overlays.

The approved target is:

```txt
public/assets/concepts/3d-fixed-room-character-priority.png
```

Supporting composition references:

```txt
public/assets/concepts/3d-fixed-room-balanced.png
public/assets/concepts/3d-fixed-room-board-priority.png
```

## Independent Sandbox

Primary workspace:

```txt
/Users/lizhe/Projects/shuanglu-3d
```

The stable 2D application remains in:

```txt
/Users/lizhe/Projects/shuanglu
```

The applications have separate Git repositories, dependencies, build caches, assets, release schedules, and deployments. The 3D repository keeps the 2D GitHub repository as a fetch-only `upstream-2d` remote for selective bug-fix review.

See `docs/UPSTREAM_SYNC.md`.

## Commands

```bash
nvm use
npm ci
npm run typecheck
npm test
npm run build
npm run dev
```

Audit 2D changes that have not yet been reviewed:

```bash
./scripts/audit-2d-sync.sh
```

## Architecture

- `src/game`: copied pure TypeScript rules engine; sync focused fixes from 2D.
- `src/store`: copied game orchestration and explicit renderer actions.
- `src/components/scene3d`: fixed camera, room, and character presentation.
- `src/components/three`: 3D board, pieces, dice, and hit zones.
- `src/server` and `src/online`: copied lightweight friend-room implementation.
- `tests`: independent rule and presentation tests.

## Current Milestone

Fixed-camera greybox:

- No OrbitControls.
- Responsive fixed desktop/compact camera presets.
- Identity-preserving 2.5D character stand-ins inside the room scene.
- Existing procedural board and pieces.
- Clickable source and target zones.
- Visible bar and borne-off pieces.
- Independent Node 20 test and build.

Final character, room, board, and piece assets will ship as optimized GLB files after the static composition is approved in-browser.

## Historical Claim Boundary

This is a playable game adaptation inspired by historical Shuanglu. The room, characters, interface, and exact presentation do not claim to reconstruct one universally fixed Tang-Song setting.
