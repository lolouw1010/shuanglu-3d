# 3D Asset Inventory

Last updated: 2026-07-09 CST

## Approved Concepts

```txt
public/assets/concepts/3d-fixed-room-character-priority.png
public/assets/concepts/3d-fixed-room-balanced.png
public/assets/concepts/3d-fixed-room-board-priority.png
```

The character-priority frame is the approved desktop target. The other frames guide compact and interaction-heavy compositions.

## Application Icon

```txt
public/assets/brand/shuanglu-3d-icon-master.png
src/app/icon.png
src/app/apple-icon.png
src/app/favicon.ico
```

The mark uses two simplified gold Shuanglu horses around the board's central bar on a deep lacquer field. It contains no text and is designed to remain distinct at favicon size.

## Runtime 2.5D Texture Baseline

User-provided generated assets live under:

```txt
public/ui/board-top-orthographic-01.png
public/ui/board-top-orthographic-cropped.png
public/ui/board-top-orthographic-cropped.webp
public/ui/board-angled-reference-01.png
public/ui/horse-piece-reference-01.png
public/ui/scene-background-01.png
public/ui/scene-background-02.png
public/ui/scene-background-02.webp
```

Current runtime use:

- `public/ui/board-top-orthographic-cropped.webp` is the active lacquer board surface texture; the PNG remains as the source-quality reference.
- `public/ui/horse-piece-reference-01.png` guides the gold-rimmed bottle-piece material direction.
- `public/ui/board-angled-reference-01.png` remains a visual reference for later board/camera tuning.
- `public/ui/scene-background-01.png` is not active because it is a board image, not a room/background plate.
- `public/ui/scene-background-02.webp` is the active fixed-room background plate behind the transparent WebGL board layer; the PNG remains as the source-quality reference.

## Historical Greybox References

The copied character illustrations are no longer rendered in the active 3D scene, but remain available as historical identity references:

```txt
public/assets/characters/li-qingzhao-halfbody.png
public/assets/characters/song-emperor-halfbody.png
```

They validated identity and composition during greybox work. They are not final 3D actors.

## Final Runtime Policy

- Ship final models as optimized GLB or glTF 2.0.
- Use stable manifest keys rather than scattering filenames through scene components.
- Keep source DCC files outside the runtime asset path.
- Reuse horse geometry and materials.
- Validate scale, pivot, hierarchy, texture size, and browser memory before acceptance.
- Do not share runtime assets with the 2D application through links or mounted paths.

## Required Final Asset Groups

```txt
characters
environment
table-and-board
horses
dice
fx
audio
```

The 3D production deployment is live. See `docs/DEPLOYMENT.md`.
