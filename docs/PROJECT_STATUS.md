# 3D Project Status

Last updated: 2026-07-20 CST

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
- Black horses now use a brighter dark jade/bronze material with gold rim accents for better contrast against the lacquer board; the rough in-scene 3D dice have been removed, leaving dice state as compact HUD text.
- The WebGL board is anchored lower in the fixed room plate so it reads as resting on the table rather than floating at chest height; the compact scene dice HUD now includes small CSS dice faces plus text state.
- The board frame and surface material have been lightly brightened to improve point and horse readability without changing the fixed room lighting.
- Point, bar, and borne-off state rendered and clickable, with projected `起`/`已选`/`落` action markers at legal locations.
- Every single renderer-observed move now receives a lift, travel, and settle animation: point-to-point, bar-entry, and borne-off moves.
- Black AI turns advance one transition at a time: roll, one move, or turn end. In 3D, the next transition waits for the current piece flight to settle.
- Authoritative state jumps and reloads snap cleanly without replaying stale animation.
- Independent Linode production is live at `https://3d.shuanglu.uway.click` on internal port 3003.
- The last confirmed production release is `e4aa7505bb0688af258e8bc8183fd18e286c1af3` (2026-07-20).
- The dedicated systemd service, Docker Nginx host, Let's Encrypt certificate, and renewal timer are active.
- Rules and state remain outside the renderer.

## Next Milestones

1. Continue fine-tuning the board material, side trays, and piece silhouettes against the approved concept.
2. Add a separate hit-to-bar animation for the displaced opposing piece.
3. Add dice settle animation using the rule-determined result.
4. Produce optimized GLB board and horse assets.
5. Produce seated character GLBs only if the fixed background plate becomes insufficient.

## Known Boundaries

- The room and seated characters are currently a fixed 2.5D background plate, not modeled GLB assets.
- The user-provided board texture is active; `scene-background-02.webp` is active as the runtime room/background plate and `board-top-orthographic-cropped.webp` is the runtime board texture.
- Online rooms remain copied and in-memory; 2D and 3D deployments will not share rooms.
- The copied 2D presentation remains in the repository only as fork history and fallback code; the 3D root does not use it.
- Core 2D bug fixes require explicit review through `docs/UPSTREAM_SYNC.md`.
