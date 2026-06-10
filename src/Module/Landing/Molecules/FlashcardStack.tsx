import React, { useState } from "react";

interface CardItem {
  id: number;
  kanji: string;
  meaning: string;
}

const INITIAL_CARDS: CardItem[] = [
  { id: 1, kanji: "山", meaning: "Gunung" },
  { id: 2, kanji: "木", meaning: "Pohon" },
  { id: 3, kanji: "川", meaning: "Sungai" },
  { id: 4, kanji: "日", meaning: "Matahari" },
];

export const FlashcardStack: React.FC = () => {
  const [cards, setCards] = useState<CardItem[]>(INITIAL_CARDS);
  const [isSwapping, setIsSwapping] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSwapping) return;

    setIsSwapping(true);

    // After slide-out animation, swap cards in deck
    setTimeout(() => {
      setCards((prevCards) => {
        const [topCard, ...restCards] = prevCards;
        return [...restCards, topCard];
      });
      setIsSwapping(false);
    }, 300); // Animation duration
  };

  // We render 3 cards to make a beautiful fanned card stack
  const visibleCards = cards.slice(0, 3);

  // Helper to determine the styling and fanning offsets for each card position
  const getCardStyles = (index: number) => {
    if (index === 0) {
      // Top/Front card (Index 0 in visible list)
      return {
        zIndex: 30,
        opacity: 1,
        className: isSwapping
          ? "translate-x-64 rotate-[45deg] opacity-0 pointer-events-none"
          : "rotate-[10deg] translate-x-4 -translate-y-2 group-hover:rotate-[15deg] group-hover:translate-x-8 group-hover:-translate-y-4 shadow-xl",
      };
    }
    if (index === 1) {
      // Middle card (Index 1 in visible list)
      return {
        zIndex: 20,
        opacity: 0.9,
        className: "rotate-[2deg] translate-x-0 translate-y-1 group-hover:rotate-[4deg] group-hover:translate-x-2 group-hover:translate-y-0 shadow-md",
      };
    }
    // Bottom/Back card (Index 2 in visible list)
    return {
      zIndex: 10,
      opacity: 0.75,
      className: "rotate-[-6deg] -translate-x-4 translate-y-3 group-hover:rotate-[-10deg] group-hover:-translate-x-6 group-hover:translate-y-2 shadow-sm",
    };
  };

  return (
    <div
      className="flex-grow relative h-72 w-full max-w-xs cursor-pointer select-none"
      onClick={handleCardClick}
      title="Klik untuk mengganti kartu"
    >
      {visibleCards.map((card, index) => {
        const { zIndex, opacity, className } = getCardStyles(index);
        return (
          <div
            key={card.id}
            className={`absolute top-0 left-12 w-52 h-72 bg-white rounded-2xl border border-outline-variant flex flex-col items-center justify-center p-6 transition-all duration-300 ease-out ${className}`}
            style={{
              zIndex,
              opacity,
            }}
          >
            <span className="font-display-jp text-primary text-5xl">{card.kanji}</span>
            <span className="text-on-surface-variant mt-4 font-bold">{card.meaning}</span>
            
            {/* Show action prompt only on the very top card */}
            {index === 0 && !isSwapping && (
              <span className="absolute bottom-3 text-[10px] text-outline opacity-60 font-medium tracking-wider uppercase">
                Klik untuk ganti
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FlashcardStack;
