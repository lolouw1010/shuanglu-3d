import type { Character } from "@/data/characters";

type CharacterPanelProps = {
  character: Character;
  active: boolean;
  barCount: number;
  borneOff: number;
};

function portraitPath(player: Character["player"]): string {
  return player === "white"
    ? "/assets/decor/song-left-observers.png"
    : "/assets/decor/song-right-observer.png";
}

function sideLabel(player: Character["player"]): string {
  return player === "white" ? "白方（你）" : "黑方（对手）";
}

export function CharacterPanel({
  character,
  active,
  barCount,
  borneOff,
}: CharacterPanelProps) {
  return (
    <aside className={`character-scroll-panel ${active ? "character-scroll-active" : ""}`}>
      <div className="character-scroll-heading">
        <p>{sideLabel(character.player)}</p>
        <h2>{character.name}</h2>
        <span>{character.title}</span>
      </div>

      <div className={`character-portrait character-portrait-${character.player}`}>
        <img src={portraitPath(character.player)} alt={character.name} draggable={false} />
      </div>

      <p className="character-quote">{character.quote}</p>

      <div className="character-skill-box">
        <span>技能</span>
        <strong>{character.player === "white" ? "观局" : "雅弈"}</strong>
        <p>{character.player === "white" ? "看清可行点，稳扎稳打。" : "偏好压栏、打马与连点。"}</p>
      </div>

      <div className="character-token-box">
        <div>
          <p>已出马</p>
          <span>{borneOff}</span>
        </div>
        <div>
          <p>马栏</p>
          <span>{barCount}</span>
        </div>
      </div>
    </aside>
  );
}
