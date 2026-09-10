import React from "react";

export interface MusubiLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
  showSubtitle?: boolean;
  textColor?: string;
  mode?: "standalone" | "badge";
}

export const MusubiLogo: React.FC<MusubiLogoProps> = ({
  className = "",
  size = 40,
  showText = false,
  showSubtitle = false,
  textColor = "text-[#0D47A1]",
  mode = "standalone",
}) => {
  const numericSize = typeof size === "number" ? size : parseInt(String(size)) || 40;

  const renderIcon = () => (
    <svg
      viewBox="0 0 120 120"
      className="w-full h-full drop-shadow-xs"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Connecting Graph Edges */}
      <line x1="60" y1="60" x2="30" y2="28" stroke="#0D47A1" strokeWidth="4" strokeLinecap="round" />
      <line x1="60" y1="60" x2="95" y2="35" stroke="#0D47A1" strokeWidth="4" strokeLinecap="round" />
      <line x1="60" y1="60" x2="20" y2="65" stroke="#0D47A1" strokeWidth="4" strokeLinecap="round" />
      <line x1="60" y1="60" x2="105" y2="70" stroke="#0D47A1" strokeWidth="4" strokeLinecap="round" />
      <line x1="60" y1="60" x2="38" y2="98" stroke="#0D47A1" strokeWidth="4" strokeLinecap="round" />
      <line x1="60" y1="60" x2="88" y2="95" stroke="#0D47A1" strokeWidth="4" strokeLinecap="round" />

      {/* Inter-node Ring Connections */}
      <circle cx="60" cy="60" r="42" stroke="#A8D5FF" strokeWidth="2.5" strokeDasharray="4 4" />

      {/* Outer Graph Nodes */}
      <circle cx="30" cy="28" r="7" fill="#0D47A1" />
      <circle cx="95" cy="35" r="7" fill="#0D47A1" />
      <circle cx="20" cy="65" r="7" fill="#EC6C9A" />
      <circle cx="105" cy="70" r="7" fill="#0D47A1" />
      <circle cx="38" cy="98" r="7" fill="#0D47A1" />
      <circle cx="88" cy="95" r="7" fill="#0D47A1" />

      {/* Central Node Circle */}
      <circle cx="60" cy="60" r="24" fill="#0D47A1" stroke="#FFFFFF" strokeWidth="3" />
      <text
        x="60"
        y="68"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="22"
        fontWeight="bold"
        fontFamily="'Noto Serif JP', 'Georgia', serif"
      >
        漢
      </text>

      {/* Sakura Petal Accent at Top-Right of Central Node */}
      <g transform="translate(74, 34) scale(0.65)">
        <path
          d="M12 2C12 2 15 7 12 12C9 7 12 2 12 2Z"
          fill="#EC6C9A"
        />
        <circle cx="12" cy="12" r="9" fill="#EC6C9A" />
        <circle cx="6" cy="9" r="5" fill="#FDE8F0" />
        <circle cx="18" cy="9" r="5" fill="#FDE8F0" />
        <circle cx="8" cy="17" r="5" fill="#FDE8F0" />
        <circle cx="16" cy="17" r="5" fill="#FDE8F0" />
        <circle cx="12" cy="6" r="5" fill="#EC6C9A" />
        <circle cx="12" cy="12" r="3" fill="#FFFFFF" />
      </g>
    </svg>
  );

  if (mode === "badge") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div
          className="rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-xs p-1 shrink-0"
          style={{ width: numericSize, height: numericSize }}
        >
          {renderIcon()}
        </div>
        {showText && (
          <div className="flex flex-col">
            <span className={`font-black tracking-tight text-xl ${textColor}`}>
              KanGraph
            </span>
            {showSubtitle && (
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Kanji × Jukugo × Semantic Graph
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="flex items-center justify-center shrink-0"
        style={{ width: numericSize, height: numericSize }}
      >
        {renderIcon()}
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-black tracking-tight text-xl ${textColor}`}>
            KanGraph
          </span>
          {showSubtitle && (
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Kanji × Jukugo × Semantic Graph
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default MusubiLogo;
