import React from "react";

interface JukugoCardProps {
  kanji: string;
  romaji: string;
  meaning: string;
  borderColorClass?: string;
  onClick?: () => void;
}

export const JukugoCard: React.FC<JukugoCardProps> = ({
  kanji,
  romaji,
  meaning,
  borderColorClass = "border-l-4 border-secondary",
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`min-w-[160px] md:min-w-[180px] bg-surface-container-lowest p-md rounded-xl kanji-card-shadow hover:translate-y-[-4px] transition-transform cursor-pointer select-none border border-outline-variant/10 ${borderColorClass}`}
    >
      <div className="font-display-kanji text-4xl mb-xs text-on-surface">{kanji}</div>
      <p className="font-label-md text-on-surface font-semibold">{romaji}</p>
      <p className="text-caption text-on-surface-variant">{meaning}</p>
    </div>
  );
};

export default JukugoCard;
