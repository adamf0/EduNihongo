import React from "react";
import Icon from "../../../Common/Component/Icon";
import { useNavigate } from "react-router-dom";

interface ContinueLearningProps {
  moduleTitle?: string;
  category?: string;
  progressPercent?: number;
  level?: string;
}

export const ContinueLearning: React.FC<ContinueLearningProps> = ({ moduleTitle, category, progressPercent }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-surface-container-lowest p-md rounded-xl kanji-card-shadow flex flex-col gap-md border border-outline-variant/10 select-none">
      <h3 className="font-headline-md text-secondary font-semibold">Lanjutkan Belajar</h3>
      
      {/* Main Study Card */}
      <div onClick={() => navigate("/latihan")} className="relative group cursor-pointer">
        <div className="bg-surface border border-outline-variant/50 rounded-xl p-xl flex flex-col items-center justify-center gap-md transition-all group-hover:border-primary">
          <span className="absolute top-4 right-4 bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
            Baru
          </span>
          <div className="font-display-kanji text-[80px] text-on-surface group-hover:text-primary transition-colors select-none leading-none">
            学
          </div>
          <div className="text-center">
            <p className="font-headline-md font-semibold text-on-surface">Gaku</p>
            <p className="text-on-surface-variant font-label-md">Belajar, Pembelajaran, Ilmu</p>
          </div>
        </div>
        <div className="absolute -bottom-2 -right-2 w-full h-full bg-primary/5 -z-10 rounded-xl"></div>
      </div>

      <div className="flex flex-col gap-base mt-base">
        {moduleTitle && (
          <div className="p-base bg-[#d5e3ff] text-[#001c3b] rounded-xl flex justify-between items-center mb-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#3e5980]">{category || "KANJI"}</p>
              <p className="font-label-md font-bold text-[#191c1e] mt-1">{moduleTitle}</p>
            </div>
            <span className="font-bold text-sm text-[#3e5980]">{progressPercent || 0}%</span>
          </div>
        )}

        <div 
          onClick={() => navigate("/latihan")}
          className="flex justify-between items-center p-base bg-surface-container-low rounded-xl cursor-pointer hover:bg-surface-container-high transition-colors"
        >
          <div className="flex items-center gap-base">
            <div className="w-10 h-10 bg-primary-container/10 flex items-center justify-center rounded-lg">
              <Icon name="brush" className="text-primary block text-xl" />
            </div>
            <p className="font-label-md font-bold text-on-surface">Urutan Goresan</p>
          </div>
          <Icon name="chevron_right" className="text-on-surface-variant text-xl block" />
        </div>

        <div 
          onClick={() => navigate("/latihan")}
          className="flex justify-between items-center p-base bg-surface-container-low rounded-xl cursor-pointer hover:bg-surface-container-high transition-colors"
        >
          <div className="flex items-center gap-base">
            <div className="w-10 h-10 bg-tertiary/10 flex items-center justify-center rounded-lg">
              <Icon name="record_voice_over" className="text-tertiary block text-xl" />
            </div>
            <p className="font-label-md font-bold text-on-surface">Audio Native</p>
          </div>
          <Icon name="chevron_right" className="text-on-surface-variant text-xl block" />
        </div>
      </div>

      <button
        onClick={() => navigate("/latihan")}
        className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-sm hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-base mt-base cursor-pointer border-none"
      >
        <Icon name="play_arrow" className="text-xl block" style={{ fontVariationSettings: "'FILL' 1" }} />
        Mulai Pelajaran
      </button>
    </div>
  );
};

export default ContinueLearning;
