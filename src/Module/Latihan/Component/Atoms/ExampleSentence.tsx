import React from "react";
import { Volume2 } from "lucide-react";
import tts from "../../../Common/Utility/tts";

interface ExampleSentenceProps {
  japanese: string;
  romaji: string;
  translation: string;
}

const ExampleSentence: React.FC<ExampleSentenceProps> = ({
  japanese,
  romaji,
  translation,
}) => {
  const parts = japanese.split("情報");

  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    tts.speak(japanese);
  };

  return (
    <div className="bg-surface p-4 rounded-xl border-b-2 border-surface-container-high hover:border-primary/20 transition-all group flex justify-between items-start gap-4">
      <div className="flex-1 min-w-0">
        <p className="font-body-lg text-body-lg mb-2 text-on-surface group-hover:text-primary transition-colors leading-relaxed font-serif text-lg">
          {parts.map((part, index) => (
            <React.Fragment key={index}>
              {part}
              {index < parts.length - 1 && (
                <span className="font-bold text-primary">情報</span>
              )}
            </React.Fragment>
          ))}
        </p>
        <p className="text-on-surface-variant italic mb-1 text-sm">{romaji}</p>
        <p className="font-body-md text-on-surface-variant text-sm leading-relaxed">
          {translation}
        </p>
      </div>

      <button
        onClick={playAudio}
        className="w-8 h-8 rounded-full bg-white border border-slate-100 hover:bg-[#8f0020] hover:text-white text-slate-500 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-90 shrink-0"
        title="Dengarkan Suara Pelafalan"
      >
        <Volume2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ExampleSentence;