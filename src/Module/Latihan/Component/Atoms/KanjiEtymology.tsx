import React from "react";

interface EtymologyItem {
  character: string;
  romaji: string;
  detail: string;
}

interface KanjiEtymologyProps {
  etymologies?: EtymologyItem[];
}

export const KanjiEtymology: React.FC<KanjiEtymologyProps> = ({ etymologies }) => {
  // Data fallback default jika props etymologies tidak dikirim dari parent
  const defaultEtymologies: EtymologyItem[] = [
    {
      character: "情",
      romaji: "JOU • Perasaan, Keadaan",
      detail: '"keadaan" atau "perasaan" dari segala hal. Mencerminkan kenyataan atau esensi yang mendasari.',
    },
    {
      character: "報",
      romaji: "HOU • Laporan, Berita",
      detail: "Mengumumkan atau memberi imbalan. Tindakan menyampaikan atau mengembalikan berita.",
    },
  ];

  const activeEtymologies = etymologies || defaultEtymologies;

  return (
    <div className="bg-surface rounded-xl p-md soft-shadow border border-surface-container">
      <h4 className="font-headline-md text-headline-md text-on-surface mb-4 font-semibold">
        Analisis Etimologi
      </h4>
      <div className="space-y-4">
        {activeEtymologies.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-4 p-3 hover:bg-surface-container-low rounded-lg transition-colors border-l-4 border-matcha-green"
          >
            {/* Box Karakter Kanji */}
            <div className="bg-surface-container-highest w-12 h-12 flex items-center justify-center rounded-lg font-display-kanji text-2xl select-none shrink-0">
              {item.character}
            </div>
            
            {/* Detail Teks Romaji & Penjelasan */}
            <div className="flex-1 min-w-0">
              <p className="font-label-md font-bold text-on-surface truncate">
                {item.romaji}
              </p>
              <p className="text-caption text-on-surface-variant mt-0.5 leading-relaxed break-words">
                {item.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanjiEtymology;