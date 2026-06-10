import React from "react";

const CHARACTERS = [
  { kana: "あ", romaji: "a" },
  { kana: "い", romaji: "i" },
  { kana: "う", romaji: "u" },
  { kana: "え", romaji: "e" },
  { kana: "お", romaji: "o" },
];

export const HiraganaGrid: React.FC = () => {
  const playSound = (kana: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(kana);
      utterance.lang = "ja-JP";
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="grid grid-cols-5 gap-2 md:gap-3">
      {CHARACTERS.map((item) => (
        <button
          key={item.kana}
          onClick={() => playSound(item.kana)}
          title={`Latih lafal "${item.kana}" (${item.romaji})`}
          className="aspect-square bg-surface-container-low rounded-lg flex items-center justify-center border border-dashed border-outline-variant hover:border-primary transition-colors cursor-pointer group focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <span className="font-display-jp text-lg md:text-xl text-outline group-hover:text-primary transition-colors">
            {item.kana}
          </span>
        </button>
      ))}
    </div>
  );
};

export default HiraganaGrid;
