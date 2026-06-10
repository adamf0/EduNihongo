import React from "react";
import Icon from "../Atoms/Icon";
import ProgressRing from "../Atoms/ProgressRing";
import StatItem from "../Molecules/StatItem";

interface JLPTProgressProps {
  n5Percentage: number;
  n4Percentage: number;
  kanjiCount: number;
  kanjiTotal: number;
  vocabCount: number;
  vocabTotal: number;
  onDetailClick?: (e: React.MouseEvent) => void;
}

export const JLPTProgress: React.FC<JLPTProgressProps> = ({
  n5Percentage,
  n4Percentage,
  kanjiCount,
  kanjiTotal,
  vocabCount,
  vocabTotal,
  onDetailClick,
}) => {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 md:p-8 zen-shadow border border-outline-variant overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-primary text-on-surface">Progres Level JLPT</h3>
        <a
          onClick={onDetailClick}
          className="text-sm font-bold text-primary flex items-center hover:underline whitespace-nowrap ml-4 cursor-pointer text-on-surface"
          href="#"
        >
          Detail Lengkap{" "}
          <Icon name="arrow_forward" className="text-sm ml-1 block" />
        </a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
        {/* JLPT N5 */}
        <div className="flex flex-col items-center">
          <ProgressRing
            percentage={n5Percentage}
            circleColorClass="text-secondary-fixed-dim"
          />
          <span className="font-bold text-sm text-on-surface">JLPT N5</span>
          <span className="text-xs text-on-surface-variant">Dasar (Basic)</span>
        </div>
        
        {/* JLPT N4 */}
        <div className="flex flex-col items-center">
          <ProgressRing
            percentage={n4Percentage}
            circleColorClass="text-primary-container"
          />
          <span className="font-bold text-sm text-on-surface">JLPT N4</span>
          <span className="text-xs text-on-surface-variant">Menengah Bawah</span>
        </div>

        {/* Data Points */}
        <div className="md:col-span-2 space-y-3">
          <StatItem
            variant="row"
            icon="translate"
            title="Kanji Dikuasai"
            value={`${kanjiCount} / ${kanjiTotal}`}
          />
          <StatItem
            variant="row"
            icon="menu_book"
            title="Kosakata (Vocab)"
            value={`${vocabCount} / ${vocabTotal}`}
          />
        </div>
      </div>
    </div>
  );
};

export default JLPTProgress;
