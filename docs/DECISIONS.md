# Decision Log

This file records durable product and engineering decisions. It should be updated when a decision affects architecture, scope, rules, deployment, or team workflow.

## 2026-04-26: Use Next.js DOM UI Instead of Phaser

Decision:

Use Next.js, React, TypeScript, Tailwind CSS, Zustand, and Vitest for `0.5`.

Rationale:

- The MVP is a turn-based board game with text-heavy UI, rules explanation, character panels, and deterministic rule tests.
- The rules engine is more important than a real-time render loop.
- DOM rendering is sufficient for the board and faster to iterate for deployment.
- The existing technical document already recommends this stack.

Consequences:

- The board is built with React components rather than canvas.
- The rules engine must remain independent from React and DOM APIs.
- UI components may render legal moves but must not decide move legality.

## 2026-04-26: Make `docs/*.md` the Canonical Document Source

Decision:

All core documents use `*.md` filenames under `docs/`.

Rationale:

- The original files were named `*.md.md`, which could cause future agents or scripts to miss the canonical documents.
- The project documents refer to normal Markdown filenames.

Consequences:

- Do not create or reference `*.md.md`.
- Future analysis should begin from `docs/AGENTS.md`, `docs/RULES_SPEC.md`, `docs/MVP_SCOPE.md`, and `docs/TECH_SPEC.md`.

## 2026-04-26: Maintain Process Documentation Continuously

Decision:

Development process documentation is mandatory and must be updated during the work, not reconstructed at the end.

Rationale:

- The project is targeting a one-week `0.5` launch, so decisions, verification, and risks need to survive context changes.
- Chat history is not a reliable project memory source.

Consequences:

- Update `docs/DEV_LOG.md` after meaningful implementation sessions.
- Update `docs/PROJECT_STATUS.md` after verification, scope changes, or milestone changes.
- Add to `docs/DECISIONS.md` whenever a durable decision is made.

## 2026-04-26: Adopt Explicit Rule Layering Through RuleConfig

Decision:

Use `RuleConfig` as the formal rule-layering boundary.

```ts
type RuleMode = 'classical' | 'reconstruction' | 'quick';

type RuleConfig = {
  mode: RuleMode;
  useDoublesAsFourSteps: boolean;
  enableCrushingWin: boolean;
  horsesPerPlayer: 15 | 12 | 9;
  enableCharacterSkills: boolean;
};
```

MVP default:

```ts
const DEFAULT_RULE_CONFIG: RuleConfig = {
  mode: 'reconstruction',
  useDoublesAsFourSteps: true,
  enableCrushingWin: false,
  horsesPerPlayer: 15,
  enableCharacterSkills: false,
};
```

Rationale:

- The project needs to distinguish historically attested elements from playable reconstruction mechanics.
- Future variants such as Classical Mode, Quick Mode, crushing win, and character skills need a clean extension point.
- MVP implementation should stay focused and should not accidentally include future variants as required behavior.

Consequences:

- MVP victory types are only `single_win` and `double_win`.
- `crushing_win` is not part of MVP.
- Oversized bearing off remains in the rules but must be labeled as a playable reconstruction mechanic.
- Quick Mode and character skills are future variants, not MVP requirements.
- Code still needs a future implementation pass to add `RuleConfig`.
