# 3D Project Status

Last updated: 2026-07-08 CST

## Target

Build an independent fixed-camera Shuanglu room application. Two visible characters sit behind a complete dimensional board. The rules match the copied stable 2D baseline, while the scene, assets, build, and deployment evolve independently.

## Current Milestone

Fixed-camera playable greybox:

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
- Contiguous point-to-point moves receive a renderer-only lift, travel, and settle animation.
- Authoritative state jumps, reloads, and non-point moves snap cleanly without replaying stale animation.
- The 3D AI response delay leaves the human move animation enough time to settle.
- Rules and state remain outside the renderer.

## Next Milestones

1. Add hit, bar-entry, and borne-off animation.
2. Add dice settle animation using the rule-determined result.
3. Produce optimized GLB board and horse assets.
4. Produce seated character GLBs after the static composition is approved.
5. Create independent 3D staging deployment on port 3003.

## Known Boundaries

- The character stand-ins are flat identity references, not final 3D models.
- Online rooms remain copied and in-memory; 2D and 3D deployments will not share rooms.
- The copied 2D presentation remains in the repository only as fork history and fallback code; the 3D root does not use it.
- Core 2D bug fixes require explicit review through `docs/UPSTREAM_SYNC.md`.
