# 2D Interface Art Direction

Last updated: 2026-06-11 23:08 CST

Status: active reference direction for the stable 2D board.

## Reference Assets

Approved 2D reference states are stored in:

```txt
public/assets/concepts/2d-parchment-state-initial.png
public/assets/concepts/2d-parchment-state-progress.png
```

These references describe the target interface feeling and state layout. They are not historical evidence and must not be described as exact Tang-Song restoration.

## Interface Goal

The stable 2D mode should feel like an illustrated parchment game table: readable enough for first-time play, but visually rich enough to carry the cultural theme.

The first viewport should communicate:

- This is Shuanglu, presented as a Tang-Song inspired board game.
- The board is the main playable object.
- Current turn, dice, legal actions, bar, and borne-off areas are immediately visible.
- Character art and scenery support the atmosphere without hiding game state.

## Layout Rules

### Top Area

- Keep the logo and chapter title visible.
- The top gameplay HUD should focus on `round/current player + dice`.
- Do not put full victory/progress cards above the board in 2D; those make the board feel cramped.
- Settings, journal, help, and return controls should remain icon-led and secondary.

### Side Panels

- Left and right panels should present player identity, character portrait, skill flavor, borne-off track, and bar track.
- Borne-off and bar state should be shown as small circular slots plus a count.
- Character panels should read as framed paper surfaces, not modern cards.
- The portraits may be decorative, but they must not crowd the board.

### Board

- The board should use a warm parchment/lacquer frame, thin point divisions, and a clear central ornamental mark.
- Board points must remain clickable and visibly numbered.
- Legal source and legal target states must remain stronger than decoration.
- Keep the 24 abstract board points readable across normal desktop widths.

### Bottom Area

- Bottom panels should contain dialogue, available points, available steps, and hints.
- These panels should be lower visual priority than the board.
- The end-turn action can be prominent, but it must not compete with legal move highlights.

## State-Specific Notes

### Initial / Normal Play

Reference: `2d-parchment-state-initial.png`

Target qualities:

- Symmetrical initial horse placement reads clearly.
- Current player and dice sit above the board.
- Side panels show empty tracks without looking like missing content.
- Bottom hints help the player choose legal moves.

### Progress / Occupied Tracks

Reference: `2d-parchment-state-progress.png`

Target qualities:

- Borne-off and bar tracks show occupied slots clearly.
- Stacked horses on board points should stay readable.
- The right and left character panels remain balanced even when one side has more state changes.
- The board must not shift when tracks fill.

## Material Language

- Paper: warm parchment, faint ink landscape, subtle fibers and border lines.
- Frame: dark lacquer or aged wood with gold/brown accents.
- Tokens: small round horse medallions in 2D for readability.
- Dice: ivory physical dice with dark pips.
- Accents: restrained vermilion seals, dark ink, muted green legal targets, and warm gold source highlights.

## Implementation Notes

- The 2D mode may use round medallion tokens even though the 3D art target uses bottle-shaped horses.
- The bottle-shaped horse requirement remains a 3D/material asset target.
- UI text-heavy elements should stay in DOM.
- Decorative imagery should remain at the sides or in paper backgrounds; it must not cover legal move feedback.

## Claims We Must Avoid

- Do not claim the UI is a perfect Tang-Song board restoration.
- Do not claim all board layouts or terms are historically fixed.
- Do not present character skills as historical rules.
- Do not present decorative scenery as evidence.
