# 3D Project Status

Last updated: 2026-07-09 CST

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
- 2.5D identity-preserving character stand-ins in the room.
- Enlarged and relit character stand-ins to match the approved fixed-room composition more closely.
- Procedural scholar-room staging now includes a table surface, screen panels, side windows, lantern, scrolls, vase, and restrained background ornaments.
- Procedural dimensional board and bottle-shaped horses.
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

- The character stand-ins are flat identity references, not final 3D models.
- The current room is still procedural staging, not a final modeled GLB environment.
- Online rooms remain copied and in-memory; 2D and 3D deployments will not share rooms.
- The copied 2D presentation remains in the repository only as fork history and fallback code; the 3D root does not use it.
- Core 2D bug fixes require explicit review through `docs/UPSTREAM_SYNC.md`.
