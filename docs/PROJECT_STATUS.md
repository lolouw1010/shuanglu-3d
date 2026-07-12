# 3D Project Status

Last updated: 2026-07-12 CST

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
- User-provided fixed-room background plate replaces the previous procedural room and flat character stand-ins, with the stage cropped to avoid the old greybox lower gutter.
- Refined concept-aligned table-side camera with an image-textured lacquer board, slimmer gold-rimmed bottle-shaped horses, smaller rounded dice, transparent interaction lanes, and a lowered/smaller board composition that leaves the seated characters visible.
- Compressed the 3D title/HUD chrome: turn state, borne-off progress, bar/return state, and dice now live as compact scene-edge overlays instead of full-width panels.
- The 3D route now starts directly in the 3D game state instead of server-rendering the classic 2D shell and switching after hydration.
- Runtime 3D room and board textures now use WebP assets with preload hints, reducing the active background and board texture payload from roughly 4 MB to roughly 420 KB.
- The 3D loading fallback now shows the fixed-room plate immediately while the WebGL scene chunk initializes, and the scene HUD dice use lightweight CSS pips instead of requesting large PNG dice assets.
- Point, bar, and borne-off state rendered and clickable.
- Contiguous point-to-point moves receive a renderer-only lift, travel, and settle animation.
- Authoritative state jumps, reloads, and non-point moves snap cleanly without replaying stale animation.
- The 3D AI response delay leaves the human move animation enough time to settle.
- Independent Linode production is live at `https://3d.shuanglu.uway.click` on internal port 3003.
- The dedicated systemd service, Docker Nginx host, Let's Encrypt certificate, and renewal timer are active.
- Rules and state remain outside the renderer.

## Next Milestones

1. Continue fine-tuning the board material, side trays, and piece silhouettes against the approved concept.
2. Add hit, bar-entry, and borne-off animation.
3. Add dice settle animation using the rule-determined result.
4. Produce optimized GLB board and horse assets.
5. Produce seated character GLBs only if the fixed background plate becomes insufficient.

## Known Boundaries

- The room and seated characters are currently a fixed 2.5D background plate, not modeled GLB assets.
- The user-provided board texture is active; `scene-background-02.webp` is active as the runtime room/background plate and `board-top-orthographic-cropped.webp` is the runtime board texture.
- Online rooms remain copied and in-memory; 2D and 3D deployments will not share rooms.
- The copied 2D presentation remains in the repository only as fork history and fallback code; the 3D root does not use it.
- Core 2D bug fixes require explicit review through `docs/UPSTREAM_SYNC.md`.
