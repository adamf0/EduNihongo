import React from "react";
import Icon from "../Atoms/Icon";

interface StreakProgressProps {
  days: number;
  targetDays: number;
}

export const StreakProgress: React.FC<StreakProgressProps> = ({
  days,
  targetDays,
}) => {
  const percentage = Math.min(100, Math.round((days / targetDays) * 100));
  const remainingDays = Math.max(0, targetDays - days);

  return (
    <div className="bg-primary text-on-primary rounded-xl p-6 md:p-8 zen-shadow relative overflow-hidden group min-h-[280px] flex flex-col justify-between">
      {/* Decorative backdrop circle */}
      <div className="absolute -right-8 -top-8 w-32 h-32 md:w-40 md:h-40 bg-white/5 rounded-full group-hover:scale-110 transition-transform duration-700 pointer-events-none"></div>

      <div>
        <div className="flex justify-between items-start mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary-fixed-dim">
            Study Streak
          </span>
          <Icon
            name="local_fire_department"
            className="text-secondary-fixed text-2xl block"
            style={{ fontVariationSettings: "'FILL' 1" }}
          />
        </div>
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-5xl md:text-6xl font-bold text-white">{days}</span>
          <span className="text-base md:text-lg opacity-80 text-white/80">Hari Beruntun</span>
        </div>
      </div>

      <div className="relative z-10 mt-8">
        <div className="flex justify-between text-xs mb-2 opacity-80 text-white/80">
          <span>Target: {targetDays} Hari</span>
          <span>{percentage}%</span>
        </div>
        <div className="w-full h-2.5 bg-primary-container rounded-full overflow-hidden">
          <div
            className="h-full bg-secondary-fixed shadow-[0_0_8px_rgba(254,182,196,0.5)] transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <p className="mt-4 text-[11px] text-primary-fixed-dim leading-relaxed">
          {remainingDays > 0
            ? `Terus pertahankan semangatmu! ${remainingDays} hari lagi menuju target barumu.`
            : `Selamat! Kamu telah mencapai target pembelajaranmu!`}
        </p>
      </div>
    </div>
  );
};

export default StreakProgress;
