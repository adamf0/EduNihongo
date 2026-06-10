import React from "react";

interface StrokeBoxProps {
  index: number;
  stroke: string;
  isActive?: boolean;
}

export const StrokeBox: React.FC<StrokeBoxProps> = ({ index, stroke, isActive }) => {
  return (
    <div
      className={`w-16 h-16 border rounded-lg flex items-center justify-center text-2xl font-display-jp relative select-none transition-all duration-300 ${
        isActive
          ? "bg-secondary-fixed border-secondary-container text-on-secondary-fixed scale-110 shadow-sm"
          : "bg-white border-outline-variant"
      }`}
    >
      <span className="absolute top-1 left-1 text-[10px] font-bold text-primary">
        {index}
      </span>
      <span className={`text-primary ${isActive ? "opacity-100 font-bold" : "opacity-25"}`}>
        {stroke}
      </span>
    </div>
  );
};

export default StrokeBox;
