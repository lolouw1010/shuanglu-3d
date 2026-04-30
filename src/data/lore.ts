export type LoreEntry = {
  id: string;
  title: string;
  category: "rules" | "history" | "equipment" | "adaptation";
  confidence: "supported" | "suggested" | "reconstructed" | "adaptation";
  body: string;
};

export const loreEntries: LoreEntry[] = [
  {
    id: "two-player-dice-race",
    title: "两人掷骰行马",
    category: "history",
    confidence: "supported",
    body: "双陆是一种两人对局的掷骰行马博戏。本作以可玩原型呈现其核心竞速结构。",
  },
  {
    id: "fifteen-horses",
    title: "十五马",
    category: "equipment",
    confidence: "supported",
    body: "本局双方各十五马，先出尽者胜。此马数用于当前 MVP 的复原模式与古法配置。",
  },
  {
    id: "twenty-four-abstract-points",
    title: "二十四抽象路位",
    category: "rules",
    confidence: "suggested",
    body: "本原型以二十四个抽象路位表示棋盘，便于呈现和操作；不声称所有历史棋盘术语与布局都完全固定。",
  },
  {
    id: "reconstruction-mode-doubles",
    title: "重骰四步",
    category: "rules",
    confidence: "reconstructed",
    body: "复原模式下，重骰按四步处理。古法模式下，重骰仍按两枚骰处理。",
  },
  {
    id: "bar-entry",
    title: "马栏复入",
    category: "rules",
    confidence: "reconstructed",
    body: "被击之马入栏，须按骰点先行复入。本作采用一套可玩复入规则。",
  },
  {
    id: "oversized-bearing-off",
    title: "大点出马",
    category: "rules",
    confidence: "reconstructed",
    body: "复原模式下，若无正合骰点之马，可按规则以较大骰点出最远马。这是可玩复原机制，不作为确定史实宣称。",
  },
  {
    id: "character-skills",
    title: "人物技能",
    category: "adaptation",
    confidence: "adaptation",
    body: "角色能力为后续故事模式的游戏化改编；当前 MVP 原型不启用角色技。",
  },
  {
    id: "crushing-win",
    title: "压胜",
    category: "adaptation",
    confidence: "adaptation",
    body: "当前 MVP 仅区分普通胜与双胜；压胜暂不启用，后续可作为挑战或剧情奖励规则。",
  },
];
