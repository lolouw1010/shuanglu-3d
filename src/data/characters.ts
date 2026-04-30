import type { AIProfile, Player } from "@/game";

export type Character = {
  id: string;
  player: Player;
  name: string;
  title: string;
  era: string;
  aiProfile: AIProfile;
  quote: string;
};

export const characters: Record<Player, Character> = {
  white: {
    id: "traveler",
    player: "white",
    name: "游局人",
    title: "执盘入局",
    era: "唐宋之间",
    aiProfile: "balanced",
    quote: "一局既开，且看骰声落处。",
  },
  black: {
    id: "song-huizong",
    player: "black",
    name: "宋徽宗",
    title: "宣和雅局",
    era: "北宋",
    aiProfile: "aesthetic",
    quote: "此局若成，当题作《双陆图》。",
  },
};
