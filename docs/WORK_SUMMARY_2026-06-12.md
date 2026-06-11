# Work Summary 2026-06-12

Timezone: Asia/Shanghai

## Scope

Today's work focused on the stable 2D Shuanglu interface, not rule-engine changes. The goal was to move the playable board closer to the user-approved parchment reference images, preserve clear gameplay feedback, and fix the character-panel visual problems found during review.

## Main Outcomes

### 1. Parchment 2D Interface Pass

The stable 2D game screen was restyled toward a light parchment board-game interface:

- Top brand/chapter/action bar.
- Left and right character-side panels.
- Central board-first play area.
- Light parchment board material.
- Smaller round 2D horse tokens for readability.
- Restyled dice and paper-like feedback panels.

Key commit:

```txt
1f588f3 Restyle 2D board with parchment interface
```

### 2. Additional 2D State References

Two user-supplied state reference images were archived into the project:

```txt
public/assets/concepts/2d-parchment-state-initial.png
public/assets/concepts/2d-parchment-state-progress.png
```

These images are treated as UI art-direction references only, not as historical evidence.

Key commit:

```txt
bcf8e2f Refine 2D parchment state layout
```

### 3. 2D Art Direction Document

Added a dedicated 2D art-direction document:

```txt
docs/ART_DIRECTION_2D.md
```

It records:

- Top area rules: round/current action plus dice should be the primary gameplay HUD.
- Side panel rules: player identity, character portrait, skill flavor, borne-off track, and bar track.
- Board rules: 24 points remain readable and legal move feedback beats decoration.
- Bottom area rules: dialogue, available points, available steps, and hints stay secondary to the board.
- Claims to avoid: do not present decorative UI as exact Tang-Song restoration.

### 4. Top HUD And Side-State Refinement

The 2D top gameplay HUD was changed from a full victory-progress card into a compact reference-like layout:

- `回合 N`
- current action state such as `白方行动中`
- dice panel beside the round plaque

The side panels now show `已出马` and `马栏` as circular state tracks with counts instead of plain numbers.

### 5. Character Portrait Fix

The previous side-panel portraits used older decorative scene images and were cropped incorrectly in the live game layout. The user correctly reported that the character heads were not visible and that the user-provided artwork looked much better.

Fixes:

- Cropped new character portraits from the approved 2D reference UI:

```txt
public/assets/characters/white-reference-portrait.png
public/assets/characters/black-reference-portrait.png
```

- Updated `CharacterPanel` to use these new portrait assets.
- Changed portrait rendering from `object-fit: cover` to `object-fit: contain` so heads and upper bodies remain visible.
- Strengthened the side-panel paper/scroll framing.

Key commit:

```txt
bc7485d Use reference portraits in 2D character panels
```

## Deployment

The latest app code was deployed to Aliyun GD:

```txt
Public URL: http://47.121.182.144/
Internal app: 127.0.0.1:3002
PM2 process: shuanglu
Nginx reverse proxy: active
Latest deployed app code: bc7485d
Latest documentation commit before this summary: 092ace8
```

Important deployment artifacts:

```txt
/tmp/shuanglu-parchment-1f588f3.tgz
/tmp/shuanglu-2d-state-bcf8e2f.tgz
/tmp/shuanglu-reference-portraits-bc7485d.tgz
```

## Verification

Local verification:

```txt
npx tsc --noEmit passed.
npm test passed: 10 test files, 38 tests.
npm run build passed.
```

Cloud verification:

```txt
Server npm run build passed.
PM2 process shuanglu restarted and is online.
Nginx configuration test passed and reloaded.
Public / returned HTTP 200.
Public /3d returned HTTP 200.
Reference images returned HTTP 200 from /assets/concepts/.
Character portrait assets returned HTTP 200 from /assets/characters/.
```

Actual visual verification:

```txt
Created online room 818E6A for visual check.
Captured actual game-state screenshot:
/tmp/shuanglu-screens/game-reference-portraits.png
```

The actual cloud game-state screenshot confirmed that both character heads and upper bodies are visible in the live game layout.

## Git Sync

GitHub and BigNAS were verified after resolving the earlier BigNAS receive-pack hang:

```txt
origin/main: 092ace884c9ca97c315b4273f1e83933bdf5d962
bignas/main: 092ace884c9ca97c315b4273f1e83933bdf5d962
```

The earlier BigNAS issue was not a permanent remote failure. A later push with progress/trace completed successfully.

## Open Follow-Ups

- Review the latest cloud 2D game screen manually for overall art direction approval.
- Continue improving the board's decorative details and bottom panels against `docs/ART_DIRECTION_2D.md`.
- Decide whether the main menu should also move from the dark study style toward the new parchment UI language.
- Keep the 3D route isolated until its own visual process catches up.
