import React from "react";
import tts from "../../Common/Utility/tts";

interface KanjiInfoRowProps {
  label: string;
  type?: "readings" | "text";
  mainText?: string;
  descText?: string;
  text?: string;
  borderTop?: boolean;
}

export const KanjiInfoRow: React.FC<KanjiInfoRowProps> = ({
  label,
  type = "readings",
  mainText = "",
  descText = "",
  text = "",
  borderTop = false,
}) => {
  const containerClass = borderTop
    ? "pt-4 border-t border-dashed border-outline-variant"
    : "";

  return (
    <div className={containerClass}>
      <h5 className="text-xs font-bold uppercase text-on-surface-variant mb-2">
        {label}
      </h5>
      {type === "readings" ? (
        <div
          onClick={() => mainText && tts.speak(mainText)}
          title="Klik untuk mendengar pelafalan"
          className="flex items-baseline gap-3 select-none cursor-pointer hover:opacity-80 transition-opacity"
        >
          <p className="text-3xl font-display-jp text-primary">{mainText}</p>
          {descText && <p className="text-on-surface-variant">({descText})</p>}
        </div>
      ) : (
        <p className="text-on-surface font-body-md">{text}</p>
      )}
    </div>
  );
};

export default KanjiInfoRow;
