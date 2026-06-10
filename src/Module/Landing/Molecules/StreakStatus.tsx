import React from "react";

export const StreakStatus: React.FC = () => {
  return (
    <div className="hidden sm:flex items-center gap-3 mr-4">
      <span className="text-primary font-bold text-label-sm">🔥 12 Days Streak</span>
      <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed font-bold text-xs">
        JP
      </div>
    </div>
  );
};

export default StreakStatus;
