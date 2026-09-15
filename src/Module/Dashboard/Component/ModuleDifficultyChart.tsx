import React, { useState } from "react";
import Icon from "../../Common/Component/Icon";

export interface KanjiDifficultyDetail {
  kanjiId: number;
  character: string;
  romaji: string;
  meaning: string;
  difficultyRate: number;
  comprehensionScore: number;
  readingScore: number;
  accessScore: number;
  statusLabel: string;
}

export interface ModuleDifficultyRate {
  moduleId: number;
  moduleNumber: number;
  title: string;
  difficultyRate: number;
  statusLabel: string;
  kanjiList: KanjiDifficultyDetail[];
}

interface ModuleDifficultyChartProps {
  data: ModuleDifficultyRate[];
  loading?: boolean;
}

export const ModuleDifficultyChart: React.FC<ModuleDifficultyChartProps> = ({ data, loading }) => {
  const [selectedModule, setSelectedModule] = useState<ModuleDifficultyRate | null>(null);

  const getDifficultyBadge = (status: string) => {
    switch (status) {
      case "Sangat Mudah":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Sedang":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Sulit":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "Sangat Sulit":
      default:
        return "bg-rose-100 text-rose-800 border-rose-300";
    }
  };

  const getBarColor = (rate: number) => {
    if (rate < 15) return "bg-emerald-500";
    if (rate <= 30) return "bg-blue-500";
    if (rate <= 50) return "bg-amber-500";
    return "bg-rose-600";
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant/20 pb-3">
        <div>
          <h3 className="font-bold text-on-surface text-base flex items-center gap-2">
            <Icon name="bar_chart" className="text-[#8f0020] text-xl" />
            Rate Kesulitan Modul
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Formula Perhitungan: 100% - (0.75 × Pengujian Kuis (0 Salah) + 0.15 × Latihan Membaca + 0.10 × Frekuensi Akses)
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Mudah (&lt;15%)
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block ml-2" /> Sedang (15-30%)
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block ml-2" /> Sulit (31-50%)
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block ml-2" /> Sangat Sulit (&gt;50%)
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-[#8f0020] font-bold animate-pulse">
          Memuat data tingkat kesulitan modul...
        </div>
      ) : data.length === 0 ? (
        <div className="p-12 text-center text-slate-400 italic text-sm">
          Tidak ada data modul yang dapat ditampilkan.
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {/* Main Module Difficulty Bar Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((mod) => {
              const isSelected = selectedModule?.moduleId === mod.moduleId;
              return (
                <div
                  key={mod.moduleId}
                  onClick={() => setSelectedModule(isSelected ? null : mod)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]"
                      : "bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-slate-100/80"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? "text-white/60" : "text-slate-400"}`}>
                        Modul {mod.moduleNumber}
                      </span>
                      <h4 className={`font-bold text-sm mt-0.5 ${isSelected ? "text-white" : "text-slate-900"}`}>
                        {mod.title}
                      </h4>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getDifficultyBadge(
                        mod.statusLabel
                      )}`}
                    >
                      {mod.statusLabel}
                    </span>
                  </div>

                  {/* Difficulty Rate Progress Bar */}
                  <div>
                    <div className="flex justify-between items-baseline mb-1 text-xs">
                      <span className={isSelected ? "text-white/70 font-semibold" : "text-slate-500 font-semibold"}>
                        Tingkat Kesulitan:
                      </span>
                      <span className={`font-black text-base ${isSelected ? "text-rose-400" : "text-rose-600"}`}>
                        {mod.difficultyRate}%
                      </span>
                    </div>
                    <div className={`w-full h-3 rounded-full overflow-hidden ${isSelected ? "bg-white/20" : "bg-slate-200"}`}>
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${getBarColor(mod.difficultyRate)}`}
                        style={{ width: `${Math.max(5, Math.min(100, mod.difficultyRate))}%` }}
                      />
                    </div>
                  </div>

                  {/* Sub-Kanji count badge */}
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200/40 text-[11px]">
                    <span className={isSelected ? "text-white/60" : "text-slate-400"}>
                      Kanji Target: <strong>{mod.kanjiList.length} kanji</strong>
                    </span>
                    <span className={`font-bold flex items-center gap-1 ${isSelected ? "text-amber-400" : "text-[#8f0020]"}`}>
                      {isSelected ? "Sembunyikan Kanji" : "Lihat Detail Kanji"}
                      <Icon name={isSelected ? "expand_less" : "expand_more"} className="text-sm" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Kanji Difficulty Expansion Panel */}
          {selectedModule && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col gap-3 animate-fade-in">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Icon name="search" className="text-[#8f0020]" />
                  Perincian Kesulitan Kanji dalam <strong className="text-[#8f0020]">{selectedModule.title}</strong>
                </h4>
                <button
                  onClick={() => setSelectedModule(null)}
                  className="text-xs text-slate-500 hover:text-slate-800 bg-transparent border-none cursor-pointer"
                >
                  Tutup
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {selectedModule.kanjiList.map((k) => (
                  <div
                    key={k.kanjiId}
                    className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col justify-between gap-2 shadow-2xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-[#8f0020]/10 text-[#8f0020] font-black flex items-center justify-center text-sm border border-[#8f0020]/20">
                        {k.character}
                      </span>
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{k.romaji}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-[100px]">{k.meaning}</p>
                      </div>
                    </div>

                    <div className="space-y-1 text-[11px] pt-2 border-t border-slate-100">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-semibold">Tingkat Kesulitan:</span>
                        <strong className="text-rose-600 font-bold">{k.difficultyRate}%</strong>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>• Pemahaman Kuis:</span>
                        <strong className="text-slate-700">{k.comprehensionScore}%</strong>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>• Latihan Membaca:</span>
                        <strong className="text-slate-700">{k.readingScore}%</strong>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>• Frekuensi Akses:</span>
                        <strong className="text-slate-700">{k.accessScore}%</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModuleDifficultyChart;
