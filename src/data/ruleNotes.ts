export type RuleNoteId = "classical" | "reconstruction" | "story";

export type RuleNote = {
  id: RuleNoteId;
  title: string;
  body: string;
};

export const ruleNotes: RuleNote[] = [
  {
    id: "classical",
    title: "古法模式",
    body: "更接近保守规则。重骰仍按两枚骰处理，不启用角色技能或压胜。",
  },
  {
    id: "reconstruction",
    title: "复原模式",
    body: "为现代可玩性补齐。MVP 默认使用十五马、二十四抽象路位与重骰四步。",
  },
  {
    id: "story",
    title: "故事模式",
    body: "包含人物技能与剧情化规则，不等于古法。",
  },
];
