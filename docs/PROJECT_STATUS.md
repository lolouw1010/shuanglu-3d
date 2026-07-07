# 3D Project Status

Last updated: 2026-07-07 CST

## Target

Build an independent fixed-camera Shuanglu room application. Two visible characters sit behind a complete dimensional board. The rules match the copied stable 2D baseline, while the scene, assets, build, and deployment evolve independently.

## Current Milestone

Fixed-camera greybox:

- Independent local Git repository.
- Fetch-only `upstream-2d` sync remote.
- Approved character-priority concept frame.
- Root route opens the 3D match directly.
- Human versus AI is the default test mode.
- OrbitControls removed.
- Authored desktop and compact camera presets.
- 2.5D identity-preserving character stand-ins in the room.
- Procedural dimensional board and bottle-shaped horses.
- Point, bar, and borne-off state rendered and clickable.
- Rules and state remain outside the renderer.

## Next Milestones

1. Browser screenshot QA against the approved concept.
2. Tune camera, character scale, and board framing.
3. Add presentation-state reconciliation and horse move animation.
4. Add hit, bar-entry, and borne-off animation.
5. Produce optimized GLB board and horse assets.
6. Produce seated character GLBs after the static composition is approved.
7. Create independent 3D staging deployment on port 3003.

## Known Boundaries

- The character stand-ins are flat identity references, not final 3D models.
- Online rooms remain copied and in-memory; 2D and 3D deployments will not share rooms.
- The copied 2D presentation remains in the repository only as fork history and fallback code; the 3D root does not use it.
- Core 2D bug fixes require explicit review through `docs/UPSTREAM_SYNC.md`.
