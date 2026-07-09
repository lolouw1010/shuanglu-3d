# Fixed-Camera 3D Art Direction

Last updated: 2026-07-09 CST

Status: fixed-room concept approved; playable visual baseline active.

## Product Goal

Create a playable staged room scene in which two recognizable characters sit across a dimensional Shuanglu board. The camera is authored and fixed. The player interacts with the board, not with the camera or room.

This is not:

- A 360-degree tabletop viewer.
- A first-person room.
- A room-exploration game.
- A physics sandbox.
- A cinematic scene that hides the playable board.

## Approved Target

Primary target:

```txt
public/assets/concepts/3d-fixed-room-character-priority.png
```

Supporting responsive references:

```txt
public/assets/concepts/3d-fixed-room-balanced.png
public/assets/concepts/3d-fixed-room-board-priority.png
```

The primary target establishes the character identity, room, light, table, board, and fixed three-quarter viewpoint. The balanced and board-priority images guide compact screens and interaction-heavy states.

## Locked Composition

- Fixed front-side three-quarter camera.
- Two seated characters visible from the torso upward.
- White-side character at left-rear; black-side character at right-rear.
- Complete board in the center and lower-middle.
- No character, hand, sleeve, prop, die, or tray may cover a playable lane.
- The board remains sharp; depth of field may soften only the distant room.
- Desktop and compact layouts use authored camera presets, never user camera controls.

## Greybox Strategy

The first implementation uses the existing transparent character illustrations as identity-preserving 2.5D stand-ins inside a dimensional room. These are composition tools, not final character assets.

Greybox acceptance:

- OrbitControls is absent.
- Both characters and the entire board appear in the first frame.
- All 24 point hit zones remain reachable.
- Bar and borne-off state are visible.
- The current player receives restrained scene emphasis.
- DOM HUD remains compact and outside the Canvas.
- Compact screens receive a tighter fixed board-priority camera.

## Visual Baseline Strategy

Before final GLB assets are available, the runtime uses procedural staging to close the gap between the greybox and the approved concept:

- Characters are larger, brighter, and placed closer to the table edge while remaining behind playable lanes.
- The room includes screen panels, side windows, table mass, a lantern, scrolls, a vase, and restrained background decoration.
- The camera favors a fixed table-side composition rather than a pure board-test angle.
- Board scale and lane contrast are tuned for readability first; cinematic obstruction is deferred until interaction safety is proven.
- The in-scene marker uses `视觉基线` while this remains a procedural art pass rather than final modeled art.

## Final Asset Language

Final runtime assets should use optimized GLB or glTF 2.0.

### Characters

- Stylized semi-realistic 3D, not photoreal wax figures.
- Seated static poses first.
- Restrained cloth detail and shared materials.
- Current-turn attention and small gesture animation only after the static frame passes QA.
- Do not require hands to physically grip pieces in the first animated release.

### Board And Horses

- Dark lacquer board with restrained antique-gold lines.
- Twenty-four readable abstract point lanes.
- Visible central bar and borne-off trays.
- Warm-ivory and deep-black glossy bottle-shaped horses.
- Decorative geometry and invisible interaction hit zones remain separate.

### Room

- Intimate scholar's room or private court room.
- Dark wood, paper screen, restrained scroll and brush objects, warm lantern.
- Room depth supports the tableau but remains secondary.
- Do not build unseen room areas merely because the runtime is 3D.

## Animation Order

1. Selected-horse lift or glow.
2. Horse move-path animation derived from move history.
3. Hit and bar-entry feedback.
4. Dice settle animation with rule-determined result.
5. Current-player attention change.
6. Subtle breathing, blink, and gesture animation.

Rules update first. Animation explains the committed state and never determines game results.

## Performance Direction

- Reuse horse geometry and materials.
- Keep broad React state out of per-frame animation.
- Cap device pixel ratio.
- Disable expensive postprocessing before reducing gameplay clarity.
- Provide a clear failure state when WebGL or required assets cannot load.
- Keep the stable 2D application independent; 3D failures must not affect it.

## Historical Language

The scene is a game adaptation inspired by Tang-Song material culture. Do not describe the room, clothing, board layout, or character staging as a uniquely verified historical reconstruction.
