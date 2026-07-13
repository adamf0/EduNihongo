import React from "react";

interface WeeklyActivityProps {
  data?: Array<{
    day: string;
    kanji: number;
    vocab: number;
    xp: number;
  }>;
}

export const WeeklyActivity: React.FC<WeeklyActivityProps> = ({ data }) => {
  const defaultDays = [
    { day: "Sen", xp: 20, kanji: 2, vocab: 5 },
    { day: "Sel", xp: 45, kanji: 3, vocab: 12 },
    { day: "Rab", xp: 10, kanji: 1, vocab: 3 },
    { day: "Kam", xp: 70, kanji: 5, vocab: 20 },
    { day: "Jum", xp: 30, kanji: 2, vocab: 8 },
    { day: "Sab", xp: 0,  kanji: 0, vocab: 0 },
    { day: "Min", xp: 0,  kanji: 0, vocab: 0 },
  ];

  const rawData = data && data.length > 0 ? data : defaultDays;

  // Determine dynamic maximums for normalization
  const maxXp = Math.max(...rawData.map(d => d.xp), 50);
  const maxKanji = Math.max(...rawData.map(d => d.kanji), 5);
  const maxVocab = Math.max(...rawData.map(d => d.vocab), 20);

  // Today is the last item
  const todayIdx = rawData.length - 1;

  return (
    <div className="bg-surface-container-lowest p-md rounded-xl kanji-card-shadow seigaiha-pattern border border-outline-variant/10 select-none">
      {/* Header and Legend */}
      <div className="flex justify-between items-center mb-md flex-wrap gap-xs">
        <h3 className="font-headline-md text-secondary font-semibold">Aktivitas Mingguan</h3>
        
        {/* Indicators Legend */}
        <div className="flex gap-sm items-center flex-wrap text-caption font-bold">
          <span className="flex items-center gap-xs">
            <span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span> XP
          </span>
          <span className="flex items-center gap-xs">
            <span className="w-2.5 h-2.5 bg-primary rounded-full"></span> Kanji
          </span>
          <span className="flex items-center gap-xs">
            <span className="w-2.5 h-2.5 bg-teal-600 rounded-full"></span> Kosakata
          </span>
        </div>
      </div>

      {/* Chart Grid */}
      <div className="h-52 flex items-end justify-between px-base gap-xs relative">
        {rawData.map((item, idx) => {
          const isToday = idx === todayIdx;
          const hasActivity = item.xp > 0 || item.kanji > 0 || item.vocab > 0;

          // Normalized heights
          const xpHeight = item.xp > 0 ? Math.max(10, Math.round((item.xp / maxXp) * 100)) : 0;
          const kanjiHeight = item.kanji > 0 ? Math.max(10, Math.round((item.kanji / maxKanji) * 100)) : 0;
          const vocabHeight = item.vocab > 0 ? Math.max(10, Math.round((item.vocab / maxVocab) * 100)) : 0;

          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-xs relative group">
              
              {/* Premium Hover Tooltip */}
              <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col bg-slate-900/95 backdrop-blur text-white text-[11px] p-2.5 rounded-xl border border-slate-700/50 shadow-xl z-20 min-w-[150px] gap-1 pointer-events-none transition-all">
                <div className="font-bold border-b border-white/10 pb-0.5 mb-1 text-center">
                  Detail {item.day}
                </div>
                <div className="flex justify-between gap-md">
                  <span className="text-amber-400">XP:</span>
                  <span className="font-bold">+{item.xp}</span>
                </div>
                <div className="flex justify-between gap-md">
                  <span className="text-red-400">Kanji:</span>
                  <span className="font-bold">{item.kanji}</span>
                </div>
                <div className="flex justify-between gap-md">
                  <span className="text-teal-400">Kata:</span>
                  <span className="font-bold">{item.vocab}</span>
                </div>
              </div>

              {/* Grouped Bars Area */}
              <div className="w-full flex items-end justify-center gap-[2px] h-[150px] relative">
                {hasActivity ? (
                  <>
                    {/* XP Bar (Amber) */}
                    <div className="flex-1 h-full flex items-end">
                      <div
                        className={`w-full rounded-t-sm transition-all duration-500 bg-amber-500 ${
                          isToday ? "brightness-110 shadow-sm shadow-amber-500/30" : "opacity-80 group-hover:opacity-100"
                        }`}
                        style={{ height: `${xpHeight}%` }}
                        title={`XP: ${item.xp}`}
                      />
                    </div>

                    {/* Kanji Bar (Red/Primary) */}
                    <div className="flex-1 h-full flex items-end">
                      <div
                        className={`w-full rounded-t-sm transition-all duration-500 bg-primary ${
                          isToday ? "brightness-110 shadow-sm shadow-red-500/30" : "opacity-80 group-hover:opacity-100"
                        }`}
                        style={{ height: `${kanjiHeight}%` }}
                        title={`Kanji: ${item.kanji}`}
                      />
                    </div>

                    {/* Vocab Bar (Teal) */}
                    <div className="flex-1 h-full flex items-end">
                      <div
                        className={`w-full rounded-t-sm transition-all duration-500 bg-teal-600 ${
                          isToday ? "brightness-110 shadow-sm shadow-teal-500/30" : "opacity-80 group-hover:opacity-100"
                        }`}
                        style={{ height: `${vocabHeight}%` }}
                        title={`Kosakata: ${item.vocab}`}
                      />
                    </div>
                  </>
                ) : (
                  /* Zero Activity Placeholder */
                  <div className="w-full rounded-t-sm bg-surface-container-high h-[4px] self-end opacity-40" />
                )}
              </div>

              {/* Day Label */}
              <span className={`text-caption font-bold mt-1 ${isToday ? "text-primary border-b-2 border-primary pb-0.5" : "text-on-surface-variant"}`}>
                {item.day}
              </span>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="mt-4 pt-3 border-t border-outline-variant/10 flex justify-between items-center text-[10px] text-on-surface-variant font-semibold">
        <span>Arahkan kursor ke grafik untuk info detail</span>
        <div className="flex gap-md">
          <span>Total XP: <span className="text-amber-500 font-bold">{rawData.reduce((s, d) => s + d.xp, 0)} XP</span></span>
          <span>Total Kanji: <span className="text-primary font-bold">{rawData.reduce((s, d) => s + d.kanji, 0)}</span></span>
          <span>Total Kosakata: <span className="text-teal-600 font-bold">{rawData.reduce((s, d) => s + d.vocab, 0)}</span></span>
        </div>
      </div>
    </div>
  );
};

export default WeeklyActivity;
