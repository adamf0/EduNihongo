import React from "react";

interface DailyInsightProps {
  percentage?: number;
  insightText?: string;
}

export const DailyInsight: React.FC<DailyInsightProps> = ({
  percentage = 80,
  insightText = '"Anda berada di 12% teratas pelajar N3 minggu ini. Konsistensi Anda dengan radikal Kanji meningkat secara signifikan."',
}) => {
  return (
    <div className="bg-secondary text-on-secondary p-md rounded-xl flex flex-col gap-base select-none shadow-sm">
      <h4 className="font-headline-md font-semibold">Wawasan Harian</h4>
      <p className="text-label-md opacity-90 italic leading-relaxed">{insightText}</p>
      <div className="h-2 bg-white/20 rounded-full mt-xs">
        <div
          className="h-full bg-white rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default DailyInsight;
