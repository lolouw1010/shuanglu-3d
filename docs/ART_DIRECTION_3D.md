# 3D Art Direction

Last updated: 2026-05-04 19:17 CST

Status: approved first visual direction; greybox implementation started.

## Current Verdict

The current `/3d` route is a technical spike only. It proves that React Three Fiber can render a board, read game state, and pass point/bar/off clicks back into the existing rules engine. It is not the target visual direction.

Do not polish the current procedural scene as if it were final art. The next 3D phase must start from approved effect images, then move to greybox layout, asset production, interaction wiring, and finally animation.

## Product Goal

Create a playable 3D Shuanglu tabletop scene with clear cultural atmosphere and readable game state.

The scene should feel like a carefully reconstructed board game object placed in a believable historical-inspired environment. It must not claim to be a perfect Tang-Song restoration. Historical language should stay in the safer range of "inspired by", "reconstructed for play", and "museum-like presentation".

The first successful screenshot should communicate:

- This is a board game, not a generic web dashboard.
- The bottle-shaped white and black horses are the visual focus.
- The board points, dice, borne-off area, and bar/re-entry area are readable.
- The atmosphere has cultural weight without burying the rules under scenery.

## Visual Directions To Test

### Direction A: Courtly Table

Label: game adaptation.

Scene:

A low lacquer game table in a refined palace or court chamber. The board is surrounded by silk cushions, bronze or gilt accents, muted screens, candle or lantern light, and a controlled sense of ceremony.

Strengths:

- Strong first impression.
- More "splendid" and public-facing.
- Good for trailers, launch page, and story mode later.

Risks:

- Easy to become fantasy palace scenery instead of a playable board.
- Human figures and room decoration may compete with the horses and dice.
- Requires more assets before it looks convincing.

Use if:

We want the first 3D version to feel ceremonial and dramatic, with the board still kept in the center and the camera close enough for play.

### Direction B: Scholar's Study

Label: game adaptation.

Scene:

A quiet study tabletop with a lacquer board, paper, brush rest, scrolls, low lamp, ceramic or stone horses, and restrained warm light. The room is secondary; the tabletop objects carry the mood.

Strengths:

- Easier to keep the game readable.
- Culturally suggestive without overclaiming exact historical staging.
- More practical for the first playable 3D version.

Risks:

- May feel too modest if the lighting and materials are not refined.
- Needs strong table, board, piece, and dice materials to avoid looking plain.

Use if:

We want a polished playable test quickly, with atmosphere coming from object quality rather than a large scene.

### Direction C: Museum-Grade Reconstructed Tabletop

Label: playable reconstruction presentation.

Scene:

A close, museum-like tabletop reconstruction: dark lacquer board, gold or brass point lines, ivory-white and glossy black bottle-shaped horses, carved dice, subtle textile or wood surroundings, and controlled exhibit-style lighting.

Strengths:

- Best match for MVP because it prioritizes board readability.
- Lets us build the horses, board, dice, and material quality first.
- Avoids the cost and risk of full characters.

Risks:

- Less narrative than a full palace or study room.
- Needs excellent material response to feel premium.

Use if:

We want the strongest first playable 3D version. This can later expand into court or study environments.

## Recommended First Choice

Use Direction C as the playable base, with a small amount of Direction B atmosphere.

That means:

- Close tabletop camera, not a full-room walking scene.
- Board and horses occupy most of the frame.
- The environment reads as a quiet study or reconstructed display, but only around the edges.
- No full human spectators in the first approved version unless they are blurred, partial hands/sleeves, or non-interactive background silhouettes.

This is the most practical route to a beautiful test version this week because the important assets are few: board, table, horses, dice, lighting, and low-chrome HUD.

## Core Asset Language

### Horses

Label: playable reconstruction mechanic.

Target shape:

The horses should resemble small smooth bottle vessels: rounded belly, narrow elongated neck, gently flared lip, small foot ring, pure glossy surface, strong highlight line, and clear white/black contrast.

Avoid:

- Flat round checkers.
- Squat pawn shapes.
- Low-poly chess-piece silhouettes.
- Dirty stone texture that hides the shape.
- Overdecorated patterns that make stacked horses unreadable.

Recommended material:

- White: warm ivory ceramic or polished jade-like glaze, not paper-white plastic.
- Black: deep glossy black lacquer/obsidian-like glaze with controlled highlights, not flat black.

Recommended in-game wording:

"棋马采用可玩化复原造型：以瓶形、釉光和黑白对照强调器物感，不宣称为唯一历史形制。"

### Board

Label: playable reconstruction mechanic.

Target shape:

A 24-point abstract board must remain readable. The visual design can use lacquer, gilt lines, carved grooves, and a central bar/well, but it must not obscure point order or legal move feedback.

Required MVP clarity:

- 24 abstract board points are identifiable.
- White and black movement directions are visually teachable.
- Bar/re-entry area is visible.
- Borne-off area is visible.
- Legal source and legal target states are legible without reading a tutorial.

Recommended in-game wording:

"本作MVP使用24个抽象点位承载双陆走法；界面布局为现代可玩化呈现，并非断言各历史时期棋盘布局完全固定。"

### Dice

Label: supported equipment plus playable presentation.

Target shape:

The dice should be physical objects on the board or near the board. They should roll only after the static scene is stable, and the final number must be readable.

Avoid:

- Dice that tumble continuously.
- Dice that block point clicking.
- Dice animation before the board interaction is reliable.

Recommended in-game wording:

"投骰决定本回合步数；复原模式中重骰按四步处理，古法模式不采用这一扩展。"

### Room And Human Presence

Label: game adaptation.

Target use:

The room is atmosphere, not the game. People can appear later as partial hands, sleeves, seated silhouettes, or story-mode characters, but the MVP should not depend on full-body animated figures.

Avoid:

- Crowded full-room character scenes in the first playable 3D build.
- People positioned so close that they block the board.
- Animation loops that distract from turn decisions.

Recommended in-game wording:

"场景人物与书房/宫廷陈设属于游戏化氛围设计，不等同于古法规则本身。"

## Effect Image Requirements

Before rebuilding the 3D interface, approve at least one static effect image that satisfies the following:

- 16:9 desktop composition.
- Main view is a playable tabletop angle, not a poster.
- Board, dice, and bottle-shaped horses are visible in the first frame.
- The board occupies the central visual area.
- HUD space is reserved at the top-left or bottom edge without covering the board.
- The piece shape matches the approved rounded-belly, long-neck bottle form.
- The scene uses warm, controlled light with clear glossy highlights.
- No unreadable blur across the gameplay area.
- No large text in the image.
- No claim of exact Tang-Song restoration.

## Prompt Set For First Concept Images

### Concept 1: Courtly Table

Use case: historical-scene.

Asset type: 3D game visual concept frame.

Prompt:

Create a premium 16:9 concept frame for a playable 3D browser board game inspired by Shuanglu. The camera looks down at a low dark lacquer game table in a refined court chamber. The board is the center of the image, with 24 abstract points suggested by elegant gold or brass lines. On the board are glossy bottle-shaped game horses: warm ivory-white and deep black, with rounded bellies, long narrow necks, flared lips, small foot rings, and strong ceramic highlights. Two carved dice rest near the board. The surrounding court atmosphere is tasteful and restrained: silk cushions, dim lantern light, lacquer, bronze accents, and distant screens, but no large characters blocking the board. It must look like a playable game screenshot, not a movie poster. Leave clean UI-safe space near the upper-left and bottom edge. High-end 3D render style, realistic materials, readable tabletop, warm cinematic lighting, sharp board area.

Avoid:

Fantasy palace excess, crowded people, unreadable blur on the board, flat checker pieces, chess pawns, modern casino dice, large text, UI mockup text, marketing poster composition.

### Concept 2: Scholar's Study Table

Use case: historical-scene.

Asset type: 3D game visual concept frame.

Prompt:

Create a premium 16:9 concept frame for a playable 3D browser board game inspired by Shuanglu. The camera is close to a quiet scholar's study tabletop. The board is a dark lacquer tray with subtle carved texture, gold or brass point lines, a central bar, and 24 abstract board points that remain readable. The visual focus is a group of glossy bottle-shaped white and black game horses: rounded belly, long narrow neck, flared lip, small foot ring, smooth ceramic or jade-like glaze, pure color, strong highlight lines. Two physical dice sit on the table. Around the board are restrained study objects: brush rest, folded paper, scroll edge, low warm lamp, dark wood, muted textile. The image should feel culturally rich but playable, with the board and pieces occupying most of the frame. Leave UI-safe space near one screen edge. High-end 3D render style, refined materials, warm study lighting, sharp gameplay area.

Avoid:

Large room view, full-body characters, excessive decoration, unreadable depth-of-field blur on the board, flat checker pieces, squat pawns, plastic material, large text, poster-like hero composition.

### Concept 3: Museum-Grade Tabletop

Use case: historical-scene.

Asset type: 3D game visual concept frame.

Prompt:

Create a premium 16:9 concept frame for a playable 3D browser board game inspired by a museum-grade reconstructed Shuanglu tabletop. The camera is a close oblique top-down view. The central object is a dark lacquer board with 24 abstract points, fine gold or brass inlay lines, a visible central bar/re-entry area, and a borne-off tray. The pieces are glossy bottle-shaped horses in warm ivory-white and deep black: rounded bellies, long narrow necks, flared lips, small foot rings, pure smooth ceramic or polished stone material, strong clean highlights. Two carved dice sit on the board. The background is minimal: dark wood, muted textile, soft exhibit lighting, subtle shadow, no large room spectacle. It must read immediately as a playable game screen with room for a small low-chrome HUD at the edge. High-end 3D render style, refined material response, sharp board readability, elegant cultural restraint.

Avoid:

Fantasy scenery, crowded room, full-body spectators, blurry board, flat checkers, chess pawns, plastic toy look, oversized UI text, marketing poster layout.

## Greybox Approval Criteria

After one effect image is chosen, the next code step is a greybox pass. It should be judged against the approved image, not against generic 3D taste.

Greybox must prove:

- Camera angle and board scale match the approved image.
- 24 point click zones are reachable.
- Horse stacks are readable and do not overlap into unusable clumps.
- Dice position does not block point interaction.
- Bar and borne-off areas have clear placement.
- DOM HUD stays low-chrome and does not cover the center board.
- Desktop and mobile compositions both preserve the board.

## Asset Production Checklist

Priority 0:

- White bottle-horse GLB.
- Black bottle-horse GLB.
- Board/table GLB or procedural board matching approved effect image.
- Dice GLB or stable procedural dice with readable pips.

Priority 1:

- Table material textures: lacquer, subtle carved grain, gold/brass inlay.
- Soft environment lighting setup.
- Minimal study/court props at scene edges.

Priority 2:

- Partial hands/sleeves or seated silhouettes.
- Court/study room expansion.
- Character-story presentation.
- Audio and ambient loops.

## Animation Reintroduction Rule

Animation must return only after the static view is approved and browser-tested.

Order:

1. Dice settle animation with readable final result.
2. Selected-horse lift or glow.
3. Horse move-path animation.
4. Hit and bar-entry feedback.
5. Subtle environmental motion.
6. Optional hands/sleeves and story-mode animation.

Each step needs screenshot or browser QA before adding the next one.

## Approved Concept References

Approved on 2026-05-04 after first-round effect image review.

Workspace copies:

- `public/assets/concepts/3d-courtly-table.png`
- `public/assets/concepts/3d-scholars-study.png`
- `public/assets/concepts/3d-museum-tabletop.png`

Decision:

Use the full approved set as the art target family, but implement the first playable version with the Museum-Grade Reconstructed Tabletop as the base. Borrow only restrained atmosphere from the Courtly Table and Scholar's Study images until the tabletop itself is stable.

Implementation rule:

The 3D scene should be judged against these images before adding new visual ideas. If a proposed change makes the board less readable or makes the horse pieces less bottle-like, reject it even if it looks more decorative.

## Decision Record

Decision made:

- First visual target uses Museum-Grade Reconstructed Tabletop as the playable base.
- Courtly Table and Scholar's Study remain valid atmosphere references.
- The current code implementation starts with a greybox tabletop that matches the approved image family, then later imports higher-quality GLB assets.

Current recommendation:

- Use Museum-Grade Tabletop as the first playable target.
- Keep Courtly Table and Scholar's Study as expansion skins or later story-mode scenes.
