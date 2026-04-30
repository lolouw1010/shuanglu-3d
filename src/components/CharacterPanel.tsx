import type { Character } from "@/data/characters";

type CharacterPanelProps = {
  character: Character;
  active: boolean;
  barCount: number;
  borneOff: number;
};

export function CharacterPanel({
  character,
  active,
  barCount,
  borneOff,
}: CharacterPanelProps) {
  return (
    <aside
      className={`rounded border p-3 ${
        active
          ? "border-amber-200/60 bg-amber-100/10"
          : "border-stone-200/10 bg-black/14"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="grid size-12 shrink-0 place-items-center rounded border border-amber-100/25 bg-[linear-gradient(145deg,rgba(118,31,27,.7),rgba(21,14,12,.96))] font-display text-2xl text-amber-100">
          {character.name.slice(0, 1)}
        </div>
        <div className="min-w-0">
          <p className="text-xs uppercase text-amber-200/70">{character.era}</p>
          <h2 className="mt-0.5 truncate font-display text-xl text-amber-50">
            {character.name}
          </h2>
          <p className="text-xs text-amber-100/75">{character.title}</p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-stone-300">{character.quote}</p>
      <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded border border-stone-200/8 bg-black/22 p-2">
          <dt className="text-stone-400">马栏</dt>
          <dd className="font-display text-xl text-amber-100">{barCount}</dd>
        </div>
        <div className="rounded border border-stone-200/8 bg-black/22 p-2">
          <dt className="text-stone-400">已出</dt>
          <dd className="font-display text-xl text-amber-100">{borneOff}</dd>
        </div>
      </dl>
    </aside>
  );
}
