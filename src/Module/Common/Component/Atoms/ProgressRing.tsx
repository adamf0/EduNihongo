import { useMemo } from "react";

interface ProgressRingProps {
  progress: number;
}

export function ProgressRing({
  progress,
}: ProgressRingProps) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  const offset = useMemo(
    () => circumference - (progress / 100) * circumference,
    [progress]
  );

  return (
    <svg viewBox="0 0 100 100">
      <circle
        cx={50}
        cy={50}
        r={radius}
        fill="transparent"
        strokeWidth={8}
        className="stroke-current text-surface-container"
      />

      <circle
        cx={50}
        cy={50}
        r={radius}
        fill="transparent"
        strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="stroke-current text-primary transition-all duration-500"
        style={{
          transform: "rotate(-90deg)",
          transformOrigin: "50% 50%",
        }}
      />
    </svg>
  );
}