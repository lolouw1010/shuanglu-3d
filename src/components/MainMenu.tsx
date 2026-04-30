"use client";

import { BookOpen, Bot, Users } from "lucide-react";
import { useGameStore } from "@/store/gameStore";

export function MainMenu() {
  const startMatch = useGameStore((store) => store.startMatch);
  const toggleRules = useGameStore((store) => store.toggleRules);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_50%_16%,rgba(209,168,87,.25),transparent_30%),linear-gradient(145deg,#1a1110,#4d171b_48%,#11100f)] px-4 py-8 text-stone-100">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-between">
        <div className="pt-8">
          <p className="text-sm text-amber-200">Tang-Song Double Sixes Reconstruction</p>
          <h1 className="mt-3 font-display text-6xl text-amber-50 sm:text-7xl">
            双陆
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-stone-200">
            掷骰行马，把 15 枚马先送出棋盘即胜。复原模式会提示每一步该点哪里。
          </p>
        </div>

        <div className="grid gap-3 pb-10 sm:max-w-xl sm:grid-cols-3">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded border border-amber-200/40 bg-amber-100 px-4 py-3 font-semibold text-stone-950"
            onClick={() => startMatch("human")}
          >
            <Users size={18} />
            双人
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded border border-amber-200/40 bg-[#2b1512] px-4 py-3 font-semibold text-amber-50"
            onClick={() => startMatch("ai")}
          >
            <Bot size={18} />
            人机
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded border border-amber-200/25 bg-black/24 px-4 py-3 font-semibold text-amber-50"
            onClick={toggleRules}
          >
            <BookOpen size={18} />
            规则
          </button>
        </div>
      </section>
    </main>
  );
}
