import React from "react";

interface ActivityDay {
  day: string;
  totalHeight: number; // Percentage height (0-100) for the bg bar
  filledHeight: number; // Percentage height (0-100) for the primary filled bar
  isActive?: boolean;
}

export const WeeklyActivity: React.FC = () => {
  const days: ActivityDay[] = [
    { day: "Sen", totalHeight: 60, filledHeight: 40 },
    { day: "Sel", totalHeight: 80, filledHeight: 70 },
    { day: "Rab", totalHeight: 40, filledHeight: 25 },
    { day: "Kam", totalHeight: 100, filledHeight: 90, isActive: true },
    { day: "Jum", totalHeight: 70, filledHeight: 50 },
    { day: "Sab", totalHeight: 30, filledHeight: 10 },
    { day: "Min", totalHeight: 20, filledHeight: 5 },
  ];

  return (
    <div className="bg-surface-container-lowest p-md rounded-xl kanji-card-shadow seigaiha-pattern border border-outline-variant/10 select-none">
      <div className="flex justify-between items-center mb-md">
        <h3 className="font-headline-md text-secondary font-semibold">Aktivitas Mingguan</h3>
        <div className="flex gap-base">
          <span className="flex items-center gap-xs text-caption font-bold">
            <span className="w-2 h-2 bg-primary rounded-full"></span> Waktu Belajar
          </span>
        </div>
      </div>
      
      <div className="h-48 flex items-end justify-between px-base gap-xs">
        {days.map((item, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-xs">
            <div 
              className="w-full bg-surface-container rounded-t-lg relative group overflow-hidden" 
              style={{ height: `${item.totalHeight}%` }}
            >
              <div
                className={`absolute bottom-0 w-full rounded-t-lg transition-all ${
                  item.isActive 
                    ? "bg-primary/80" 
                    : "bg-primary/20 group-hover:bg-primary/40"
                }`}
                style={{ height: `${(item.filledHeight / item.totalHeight) * 100}%` }}
              ></div>
            </div>
            <span className="text-caption font-bold">{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyActivity;
