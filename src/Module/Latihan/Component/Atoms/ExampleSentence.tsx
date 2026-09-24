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

  const [isPlaying, setIsPlaying] = React.useState(false);

  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      tts.stop();
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
    tts.speak(japanese, romaji, () => setIsPlaying(false));
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
        className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-90 shrink-0 ${
          isPlaying
            ? "bg-[#8f0020] text-white border-[#8f0020] ring-2 ring-[#8f0020]/20 animate-pulse"
            : "bg-white border-slate-100 hover:bg-[#8f0020] hover:text-white text-slate-500"
        }`}
        title={isPlaying ? "Hentikan Suara" : "Dengarkan Suara Pelafalan (Native AI)"}
      >
        <Volume2 className={`w-4 h-4 ${isPlaying ? "animate-bounce" : ""}`} />
      </button>
    </div>
  );
};

export default ExampleSentence;