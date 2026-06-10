import React from "react";

export const StrokePracticeCanvas: React.FC = () => {
  return (
    <div className="w-full max-w-sm aspect-square bg-surface-container-lowest rounded-3xl border-2 border-dashed border-outline-variant p-12 relative flex items-center justify-center group shadow-inner">
      {/* Background grid lines */}
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-5 pointer-events-none">
        <div className="border-r border-b border-on-surface"></div>
        <div className="border-b border-on-surface"></div>
        <div className="border-r border-on-surface"></div>
        <div></div>
      </div>
      
      {/* Ghost Kanji background */}
      <span className="font-display-jp text-[160px] text-primary/5 select-none absolute">
        永
      </span>
      
      {/* SVG Tracing */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <svg
          className="w-2/3 h-2/3 stroke-primary fill-none stroke-[8] stroke-round"
          viewBox="0 0 100 100"
        >
          {/* Static gray guidance lines */}
          <path className="opacity-10" d="M50 20 L50 80 M20 50 L80 50"></path>
          
          {/* Animated red tracing line */}
          <path
            className="stroke-secondary dash-anim"
            d="M50 20 L50 80"
            style={{
              strokeDasharray: 60,
              strokeDashoffset: 60,
            }}
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default StrokePracticeCanvas;
