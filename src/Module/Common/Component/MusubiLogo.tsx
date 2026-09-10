import React from "react";

export interface MusubiLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
  textColor?: string;
  mode?: "standalone" | "badge";
}

export const MusubiLogo: React.FC<MusubiLogoProps> = ({
  className = "",
  size = 40,
  showText = false,
  textColor = "text-[#0D2B52]",
  mode = "standalone",
}) => {
  if (mode === "badge") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div
          className="rounded-xl bg-[#0D2B52] flex items-center justify-center shadow-md p-1.5 shrink-0"
          style={{ width: size, height: size }}
        >
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* White Arch Curve */}
            <path
              d="M 22 68 C 22 20, 78 20, 78 68"
              stroke="#FFFFFF"
              strokeWidth="11"
              strokeLinecap="round"
            />
            {/* Left Crimson Red Dot */}
            <circle cx="22" cy="68" r="10" fill="#C8232A" stroke="#FFFFFF" strokeWidth="2" />
            {/* Right Crimson Red Dot */}
            <circle cx="78" cy="68" r="10" fill="#C8232A" stroke="#FFFFFF" strokeWidth="2" />
          </svg>
        </div>
        {showText && (
          <span className={`font-black tracking-tight text-xl ${textColor}`}>
            MUSUBI
          </span>
        )}
      </div>
    );
  }

  // Standalone mode (Gambar 2 exact look)
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Navy Blue Arch Curve */}
          <path
            d="M 22 68 C 22 20, 78 20, 78 68"
            stroke="#0D2B52"
            strokeWidth="11"
            strokeLinecap="round"
          />
          {/* Left Crimson Red Dot */}
          <circle cx="22" cy="68" r="11" fill="#C8232A" />
          {/* Right Crimson Red Dot */}
          <circle cx="78" cy="68" r="11" fill="#C8232A" />
        </svg>
      </div>
      {showText && (
        <span className={`font-black tracking-tight text-xl ${textColor}`}>
          MUSUBI
        </span>
      )}
    </div>
  );
};

export default MusubiLogo;
