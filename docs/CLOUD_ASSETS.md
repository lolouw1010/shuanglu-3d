# 3D Asset Inventory

Last updated: 2026-07-07 CST

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

## Greybox References

The copied character illustrations are temporary in-scene stand-ins:

```txt
public/assets/characters/li-qingzhao-halfbody.png
public/assets/characters/song-emperor-halfbody.png
```

They validate identity and composition. They are not final 3D actors.

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

No 3D production deployment exists yet. See `docs/DEPLOYMENT.md`.
