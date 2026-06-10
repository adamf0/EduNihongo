import React from "react";
import Icon from "../Atoms/Icon";
import Badge from "../Atoms/Badge";
import Button from "../Atoms/Button";

interface LessonCardProps {
  titleJp: string;
  titleRomaji: string;
  translation: string;
  durationText: string;
  onStartClick?: () => void;
  onCurriculumClick?: () => void;
}

export const LessonCard: React.FC<LessonCardProps> = ({
  titleJp,
  titleRomaji,
  translation,
  durationText,
  onStartClick,
  onCurriculumClick,
}) => {
  const speakLesson = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(titleJp);
      utterance.lang = "ja-JP";
      window.speechSynthesis.speak(utterance);
    }
    if (onStartClick) {
      onStartClick();
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 md:p-8 zen-shadow border border-outline-variant hover:border-primary/30 transition-colors flex flex-col justify-between min-h-[280px]">
      <div>
        <div className="flex items-center gap-2 mb-4 flex-wrap select-none">
          <Badge className="bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter">
            Pelajaran Hari Ini
          </Badge>
          <span className="text-on-surface-variant text-xs">{durationText}</span>
        </div>
        <h2 className="font-display-jp text-2xl md:text-3xl text-primary mb-1 break-words">
          {titleJp}
        </h2>
        <p className="font-body-lg-jp text-on-surface-variant italic text-sm">
          "{titleRomaji}" - {translation}
        </p>
      </div>
      
      <div className="space-y-3 mt-6">
        <Button
          onClick={speakLesson}
          className="w-full bg-secondary-fixed text-on-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Mulai Belajar
          <Icon name="chevron_right" className="text-[20px] block" />
        </Button>
        <Button
          onClick={onCurriculumClick}
          className="w-full border border-outline-variant text-on-surface-variant py-3 rounded-xl font-bold text-sm hover:bg-surface-container-low transition-colors"
        >
          Lihat Kurikulum
        </Button>
      </div>
    </div>
  );
};

export default LessonCard;
