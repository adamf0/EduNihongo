import React from "react";
import tts from "../../Common/Utility/tts";

interface RadicalBadgeProps {
  radicalChar: string;
  radicalName: string;
}

export const RadicalBadge: React.FC<RadicalBadgeProps> = ({
  radicalChar,
  radicalName,
}) => {
  return (
    <div className="pt-4 border-t border-dashed border-outline-variant">
      <h5 className="text-xs font-bold uppercase text-on-surface-variant mb-2">
        Radikal Utama
      </h5>
      <div
        onClick={() => tts.speak(radicalChar)}
        title="Klik untuk mendengar pelafalan radikal"
        className="flex items-center gap-2 select-none cursor-pointer hover:opacity-85 transition-opacity"
      >
        <span className="w-10 h-10 bg-surface-container flex items-center justify-center rounded text-xl font-display-jp text-on-surface">
          {radicalChar}
        </span>
        <span className="text-on-surface font-medium">{radicalName}</span>
      </div>
    </div>
  );
};

export default RadicalBadge;
