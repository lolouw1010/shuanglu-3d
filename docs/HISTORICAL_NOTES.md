# Historical Notes

Last updated: 2026-04-26 21:13:07 CST

Purpose: this document defines how the project should describe Shuanglu history, reconstruction choices, and future game adaptations without overstating uncertain claims.

This project must not claim to be a perfect Tang-Song rule restoration. The MVP is a playable browser reconstruction that combines historically supported elements with clearly labeled reconstruction mechanics.

## 1. Historically Supported Elements

These elements are treated as **supported** for the project's historical framing. They may be described as known or strongly supported features of Shuanglu and related Chinese double-six / tables-game traditions.

### 1.1 Two-Player Dice-and-Race Game

Label: **supported**

Shuanglu is presented as a two-player dice-and-race board game. Players move horses according to dice rolls and race toward bearing off.

Recommended In-Game Wording:

```txt
双陆是一种两人对局的掷骰行马博戏。本作以可玩原型呈现其核心竞速结构。
```

Avoid:

```txt
本作完整复原唐宋双陆全部原始规则。
```

### 1.2 Black and White Horses

Label: **supported**

The project uses black and white sides, with pieces called horses in UI text.

Recommended In-Game Wording:

```txt
双方各执一色棋马，对局中简称“马”。
```

Avoid:

```txt
所有历史时期的双陆都固定使用完全相同的棋马称谓和视觉样式。
```

### 1.3 Fifteen Horses Per Side

Label: **supported**

The MVP uses 15 horses per side. This is the default for Reconstruction Mode and Classical Mode.

Recommended In-Game Wording:

```txt
本局双方各十五马，先出尽者胜。
```

Avoid:

```txt
双陆在所有朝代、所有地区都只存在十五马规则。
```

### 1.4 Two Six-Sided Dice

Label: **supported**

The MVP uses two six-sided dice.

Recommended In-Game Wording:

```txt
每回合掷两枚六面骰，并按骰点行马。
```

Avoid:

```txt
所有历史双陆规则中的骰子处理方式都与本作完全一致。
```

### 1.5 Dice-Based Horse Movement

Label: **supported**

Dice-based movement is part of the core identity used by the MVP.

Recommended In-Game Wording:

```txt
骰点决定本回合可行的路数。
```

Avoid:

```txt
本作每一种行棋细节都可直接对应唐宋原始规则。
```

### 1.6 Hitting Exposed Opposing Horses

Label: **supported**

The MVP includes hitting an exposed opposing horse. The UI may explain this as a core tables-game interaction used in the playable reconstruction.

Recommended In-Game Wording:

```txt
敌马孤立时，可落子击之，使其入栏待复。
```

Avoid:

```txt
打马后的所有复入细节在史料中都有完全固定的统一版本。
```

### 1.7 Race Objective

Label: **supported**

The MVP objective is to bear off all horses before the opponent.

Recommended In-Game Wording:

```txt
先将己方十五马全部出盘者胜。
```

Avoid:

```txt
本作胜负、计分和奖励规则完全等同于唐宋原局。
```

## 2. Historically Suggested but Under-Specified Elements

These elements are **suggested** by the broader tradition or by related rules, but the project should treat their exact implementation as under-specified.

### 2.1 Board Structure and Road Terminology

Label: **suggested**

The MVP uses 24 abstract board points. This gives the rules engine a clear playable structure, but the project must not claim that all historical boards, layouts, road terms, and indexing conventions were universally fixed across all periods.

Recommended In-Game Wording:

```txt
本原型以二十四个抽象路位表示棋盘，便于呈现和操作。
```

Avoid:

```txt
唐宋双陆在所有场景下都使用与本作完全相同的二十四路编号与布局。
```

### 2.2 Starting Layout

Label: **suggested / under-specified**

The MVP uses a specific 15-horse starting layout for playability. It should be described as a reconstruction choice, not as a proven universal Tang-Song setup.

Recommended In-Game Wording:

```txt
本局采用十五马复原开局，用于形成完整可玩的对局节奏。
```

Avoid:

```txt
此开局就是唐宋双陆唯一标准开局。
```

### 2.3 Direction of Movement

Label: **suggested / under-specified**

The MVP assigns white to move from high index to low index and black from low index to high index. This is a rules-engine convention for the prototype.

Recommended In-Game Wording:

```txt
白马循一路归下，黑马循一路归上。本局以此方向组织行棋。
```

Avoid:

```txt
所有历史双陆棋盘都使用与本作完全相同的索引方向。
```

### 2.4 Bar and Re-Entry Details

Label: **suggested / under-specified**

The idea of hit horses needing to re-enter is compatible with the broader tables-game structure, but the exact entry-point mapping used by the MVP is a reconstruction choice.

Recommended In-Game Wording:

```txt
被击之马入栏，须按骰点先行复入。本作采用一套可玩复入规则。
```

Avoid:

```txt
本作马栏与复入点位完全复刻某一唐宋定本。
```

### 2.5 Home Board Definition

Label: **suggested / under-specified**

The MVP defines each side's home board for bearing off. This is necessary for a complete rules engine, but the exact home-board indexing is a reconstruction convention.

Recommended In-Game Wording:

```txt
诸马归入本方归区后，方可开始出马。
```

Avoid:

```txt
历史上所有双陆归区边界都与本作完全相同。
```

## 3. Playable Reconstruction Mechanics

These mechanics are **reconstructed** for the playable prototype. They are part of MVP Reconstruction Mode unless otherwise noted, but they should not be presented as certain historical facts.

### 3.1 Reconstruction Mode

Label: **reconstructed**

The MVP default is Reconstruction Mode:

```ts
const DEFAULT_RULE_CONFIG = {
  mode: 'reconstruction',
  useDoublesAsFourSteps: true,
  enableCrushingWin: false,
  horsesPerPlayer: 15,
  enableCharacterSkills: false,
};
```

Recommended In-Game Wording:

```txt
当前为复原模式：保留核心双陆结构，并采用若干可玩复原规则补足对局。
```

Avoid:

```txt
复原模式即唐宋原规则本身。
```

### 3.2 Twenty-Four Abstract Board Points

Label: **reconstructed**

The MVP uses 24 abstract board points. This is the engine's board model and UI layout basis.

Recommended In-Game Wording:

```txt
棋盘以二十四个抽象路位呈现，便于玩家识别行棋与阻挡。
```

Avoid:

```txt
二十四个抽象编号点位是所有历史时期固定不变的双陆表达方式。
```

### 3.3 Fifteen-Horse MVP Setup

Label: **reconstructed using supported horse count**

The MVP uses 15 horses per side, with a specific playable starting layout. The horse count is supported for the core game, while the exact prototype layout is a reconstruction choice.

Recommended In-Game Wording:

```txt
本局双方各十五马，采用适合原型游玩的复原开局。
```

Avoid:

```txt
本作开局布局已证明为唐宋唯一标准布局。
```

### 3.4 Doubles as Four Steps

Label: **reconstructed**

`doubles as four steps` belongs to Reconstruction Mode, not Classical Mode.

In MVP Reconstruction Mode:

```txt
[4, 4] => [4, 4, 4, 4]
```

In Classical Mode:

```txt
[4, 4] => [4, 4]
```

Recommended In-Game Wording:

```txt
复原模式下，重骰按四步处理。古法模式下，重骰仍按两枚骰处理。
```

Avoid:

```txt
重骰四步是所有古代双陆规则中确定无疑的统一规则。
```

### 3.5 Bar Entry Mapping

Label: **reconstructed**

The MVP uses explicit entry mappings for horses returning from the bar. This makes hit-and-re-entry play testable and understandable.

Recommended In-Game Wording:

```txt
栏中之马须依骰点复入。本作采用复原模式的固定入口映射。
```

Avoid:

```txt
本作复入映射就是所有唐宋双陆原局的固定规则。
```

### 3.6 Bearing Off

Label: **reconstructed**

The MVP includes bearing off once all remaining horses are in the home board.

Recommended In-Game Wording:

```txt
诸马入归区后，可依骰点出马。先出尽十五马者胜。
```

Avoid:

```txt
本作出马细节完整覆盖所有历史双陆变体。
```

### 3.7 Oversized Bearing-Off

Label: **reconstructed**

Oversized bearing-off is a playable reconstruction mechanic. It remains in the rules because it creates a complete and familiar endgame, but it must not be described as a proven Tang-Song rule.

Recommended In-Game Wording:

```txt
复原模式下，若无正合骰点之马，可按规则以较大骰点出最远马。
```

Avoid:

```txt
大点出马规则已被证明为唐宋双陆原始规则。
```

### 3.8 MVP Victory Labels

Label: **reconstructed**

MVP victory labels are:

- `single_win`
- `double_win`

Crushing win is not part of MVP.

Recommended In-Game Wording:

```txt
若对手已出过马，则为普通胜；若对手尚未出马，则为双胜。
```

Avoid:

```txt
压胜是本 MVP 的正式胜负类型。
```

## 4. Game Adaptation / Story Mode Mechanics

These are **game adaptation** mechanics. They can support story, character identity, progression, or challenge design later, but they are not MVP rules.

### 4.1 Character Skills

Label: **game adaptation**

Character skills are future Story Mode adaptations and not MVP rules. They must not change MVP move legality.

Recommended In-Game Wording:

```txt
角色技属于后续剧情模式扩展；当前原型对局不启用角色技。
```

Avoid:

```txt
武则天、宋徽宗等角色技能源自确定历史规则。
```

### 4.2 Quick Mode

Label: **game adaptation**

Quick Mode is a future variant. It may use 12 or 9 horses, shortened match structure, or alternate openings, but it is not part of MVP.

Recommended In-Game Wording:

```txt
快局模式为后续玩法变体，可能缩短马数与对局时长。
```

Avoid:

```txt
十二马或九马快局是本 MVP 的标准规则。
```

### 4.3 Crushing Win

Label: **game adaptation**

Crushing win is not part of MVP. It may be considered later as a scoring or challenge variant.

Recommended In-Game Wording:

```txt
压胜计分暂未启用，后续可作为挑战或剧情奖励规则。
```

Avoid:

```txt
压胜是当前 MVP 的必备胜负类型。
```

### 4.4 Story Mode Dialogue and AI Commentary

Label: **game adaptation**

Story dialogue, role-specific comments, and AI-generated reviews are future presentation layers. They must not invent unsupported historical claims.

Recommended In-Game Wording:

```txt
角色评语为剧情化表达，不代表史料原文。
```

Avoid:

```txt
所有角色台词均出自历史文献。
```

### 4.5 Betting, Campaigns, Rewards, and Progression

Label: **game adaptation**

Betting systems, campaign rewards, collection systems, and progression are future game systems. They are not MVP rules and should not be framed as core historical rules.

Recommended In-Game Wording:

```txt
奖励与进度系统属于游戏化设计，不影响基础双陆规则。
```

Avoid:

```txt
本作奖励系统就是唐宋双陆的历史计分制度。
```

## 5. Claims We Must Not Make

The project must not make these claims in UI, marketing copy, documentation, tooltips, character dialogue, or generated text.

### 5.1 Perfect Restoration Claim

Label: **must not claim**

Do not claim that the game perfectly restores Tang-Song Shuanglu.

Recommended In-Game Wording:

```txt
本作采用可玩复原规则，并不声称完全等同于唐宋原始规则。
```

Avoid:

```txt
百分百复原唐宋双陆。
```

### 5.2 Universal Rule Fixity Claim

Label: **must not claim**

Do not claim that all board terms, layouts, movement directions, entry points, and scoring systems were universally fixed across every historical period and region.

Recommended In-Game Wording:

```txt
不同文献、地域和时期可能存在差异，本作采用适合原型游玩的统一规则。
```

Avoid:

```txt
所有历史双陆都使用完全相同的术语、棋盘和布局。
```

### 5.3 Character Skill Historicity Claim

Label: **must not claim**

Do not claim that character skills are historical rules.

Recommended In-Game Wording:

```txt
角色能力为后续故事模式的游戏化改编。
```

Avoid:

```txt
宋徽宗历史上拥有“宣和雅局”技能。
```

### 5.4 Crushing Win MVP Claim

Label: **must not claim**

Do not claim that crushing win is part of MVP.

Recommended In-Game Wording:

```txt
当前 MVP 仅区分普通胜与双胜；压胜暂不启用。
```

Avoid:

```txt
当前版本已实现压胜规则。
```

### 5.5 Classical Mode Feature Claim

Label: **must not claim**

Do not claim that Classical Mode is fully implemented in MVP unless the code and UI explicitly support it.

Recommended In-Game Wording:

```txt
古法模式为后续扩展方向，当前默认使用复原模式。
```

Avoid:

```txt
当前版本已完整支持古法模式。
```

### 5.6 Source Certainty Claim

Label: **must not claim**

Do not present uncertain reconstructions as direct quotations, fixed source facts, or universally accepted scholarship.

Recommended In-Game Wording:

```txt
此处规则为基于相关博戏传统的可玩复原。
```

Avoid:

```txt
史料明确规定此处必须这样走。
```

## 6. Future Data Derivatives

This document is the source of truth for later lore and rule-note data files. Do not create historical copy directly in UI components when it should be derived from this document.

### 6.1 In-Game 博戏志 Data

Future file:

```txt
src/data/lore.ts
```

Recommended type:

```ts
type LoreEntry = {
  id: string;
  title: string;
  category: 'rules' | 'history' | 'equipment' | 'adaptation';
  confidence: 'supported' | 'suggested' | 'reconstructed' | 'adaptation';
  body: string;
};
```

Mapping guidance:

- Use `confidence: 'supported'` only for items listed under Historically Supported Elements.
- Use `confidence: 'suggested'` for under-specified historical elements.
- Use `confidence: 'reconstructed'` for playable reconstruction mechanics.
- Use `confidence: 'adaptation'` for Story Mode, character skills, rewards, AI commentary, and other game adaptation features.
- Do not put `must not claim` material into player-facing lore except as cautionary wording.

Recommended In-Game Wording:

```txt
本条目按“可信度”标注：史料支持、线索提示、可玩复原或游戏化改编。
```

Avoid:

```txt
所有博戏志条目都代表确定无疑的历史事实。
```

### 6.2 UI Rule Notes Data

Future file:

```txt
src/data/ruleNotes.ts
```

Purpose: provide short setting-screen notes that explain rule modes without overstating historicity.

Recommended notes:

```ts
const ruleNotes = {
  classical: '古法模式：更接近保守规则。重骰仍按两枚骰处理，不启用角色技能或压胜。',
  reconstruction: '复原模式：为现代可玩性补齐。MVP 默认使用十五马、二十四抽象路位与重骰四步。',
  story: '故事模式：包含人物技能与剧情化规则，不等于古法。',
};
```

Recommended In-Game Wording:

```txt
不同模式代表不同取舍：古法偏保守，复原偏可玩，故事模式偏角色化。
```

Avoid:

```txt
故事模式中的人物技能属于唐宋双陆原始规则。
```

### 6.3 Implementation Guardrail

Label: **process rule**

When `src/data/lore.ts` or `src/data/ruleNotes.ts` is created, each entry should be traceable back to a section in this document.

Recommended In-Game Wording:

```txt
规则说明采用分层标注，帮助区分史料、复原与改编。
```

Avoid:

```txt
为增强氛围，可以不标注复原与改编边界。
```
