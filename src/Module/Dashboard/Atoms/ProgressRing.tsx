import React, { useState, useEffect } from "react";

interface ProgressRingProps {
  percentage: number;
  circleColorClass?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  percentage,
  circleColorClass = "text-secondary-fixed-dim",
}) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius; // 251.2
  const targetOffset = circumference - (percentage / 100) * circumference;

  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(targetOffset);
    }, 100);
    return () => clearTimeout(timer);
  }, [targetOffset, circumference]);

  return (
    <div className="relative w-24 h-24 sm:w-28 sm:h-28 mb-3">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Background Circle */}
        <circle
          className="text-surface-container stroke-current"
          cx="50"
          cy="50"
          fill="transparent"
          r={radius}
          strokeWidth="8"
        ></circle>
        {/* Progress Circle */}
        <circle
          className={`stroke-current progress-ring__circle ${circleColorClass}`}
          cx="50"
          cy="50"
          fill="transparent"
          r={radius}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        ></circle>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-bold text-lg sm:text-xl text-on-surface">
        {percentage}%
      </div>
    </div>
  );
};

export default ProgressRing;
