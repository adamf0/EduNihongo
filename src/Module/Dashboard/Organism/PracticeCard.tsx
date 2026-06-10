import React from "react";
import Icon from "../Atoms/Icon";
import Badge from "../Atoms/Badge";
import Button from "../Atoms/Button";
import HiraganaGrid from "../Molecules/HiraganaGrid";

interface PracticeCardProps {
  onWritingPracticeClick?: () => void;
}

export const PracticeCard: React.FC<PracticeCardProps> = ({
  onWritingPracticeClick,
}) => {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 md:p-8 zen-shadow border border-outline-variant hover:border-primary/30 transition-colors flex flex-col justify-between min-h-[280px]">
      <div>
        <div className="flex items-center gap-2 mb-4 select-none">
          <Badge className="bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter">
            Latihan Cepat
          </Badge>
        </div>
        <HiraganaGrid />
        <p className="mt-4 text-xs text-on-surface-variant">
          Latih hiragana yang sering salah.
        </p>
      </div>
      <Button
        onClick={onWritingPracticeClick}
        className="w-full bg-surface-container text-primary py-3 mt-6 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors"
      >
        <Icon name="brush" className="text-[20px] block" />
        Latihan Menulis
      </Button>
    </div>
  );
};

export default PracticeCard;
