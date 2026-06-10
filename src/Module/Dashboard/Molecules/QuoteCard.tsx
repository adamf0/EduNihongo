import React from "react";

interface QuoteCardProps {
  quoteJp: string;
  quoteRomaji: string;
  translation: string;
  imageUrl: string;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({
  quoteJp,
  quoteRomaji,
  translation,
  imageUrl,
}) => {
  const playQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(quoteJp);
      utterance.lang = "ja-JP";
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div
      onClick={playQuote}
      title="Klik untuk mendengar pelafalan kuot"
      className="rounded-xl overflow-hidden relative group aspect-[4/3] cursor-pointer zen-shadow border border-outline-variant select-none"
    >
      <img
        alt="Daily Motivation"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        src={imageUrl}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent flex flex-col justify-end p-6">
        <p className="text-white font-body-lg-jp italic text-lg mb-1 line-clamp-2">
          "{quoteRomaji}"
        </p>
        <p className="text-secondary-fixed text-[10px] font-bold uppercase tracking-widest">
          {translation}
        </p>
      </div>
    </div>
  );
};

export default QuoteCard;
