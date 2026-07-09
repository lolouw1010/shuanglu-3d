# 3D Project Status

Last updated: 2026-07-10 CST

## Target

Build an independent fixed-camera Shuanglu room application. Two visible characters sit behind a complete dimensional board. The rules match the copied stable 2D baseline, while the scene, assets, build, and deployment evolve independently.

## Current Milestone

Fixed-camera playable visual baseline:

- Independent local Git repository.
- Fetch-only `upstream-2d` sync remote.
- Approved character-priority concept frame.
- Root route opens the 3D match directly.
- Human versus AI is the default test mode.
- OrbitControls removed.
- Authored desktop and compact camera presets.
- User-provided fixed-room background plate replaces the previous procedural room and flat character stand-ins.
- Refined concept-aligned table-side camera with an image-textured lacquer board, slimmer gold-rimmed bottle-shaped horses, smaller rounded dice, and transparent interaction lanes.
- Point, bar, and borne-off state rendered and clickable.
- Contiguous point-to-point moves receive a renderer-only lift, travel, and settle animation.
- Authoritative state jumps, reloads, and non-point moves snap cleanly without replaying stale animation.
- The 3D AI response delay leaves the human move animation enough time to settle.
- Independent Linode production is live at `https://3d.shuanglu.uway.click` on internal port 3003.
- The dedicated systemd service, Docker Nginx host, Let's Encrypt certificate, and renewal timer are active.
- Rules and state remain outside the renderer.

## Next Milestones

1. Review the deployed visual baseline against the approved concept and tune composition if needed.
2. Add hit, bar-entry, and borne-off animation.
3. Add dice settle animation using the rule-determined result.
4. Produce optimized GLB board and horse assets.
5. Produce seated character GLBs after the static composition is approved.

## Known Boundaries

- The room and seated characters are currently a fixed 2.5D background plate, not modeled GLB assets.
- The user-provided board texture is active; `scene-background-02.png` is active as the runtime room/background plate.
- Online rooms remain copied and in-memory; 2D and 3D deployments will not share rooms.
- The copied 2D presentation remains in the repository only as fork history and fallback code; the 3D root does not use it.
- Core 2D bug fixes require explicit review through `docs/UPSTREAM_SYNC.md`.
