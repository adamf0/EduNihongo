import { Position } from "@xyflow/react";
import NodeHandles from "./NodeHandles";
import { Sparkles } from "lucide-react";

const KanjiNode = ({ data }: { data: any }) => {
  // Extract reading and meaning safely
  const getReadingAndMeaning = () => {
    let reading = data.reading || data.romaji || data.subLabel || "";
    if (reading.startsWith("(") && reading.endsWith(")")) {
      reading = reading.slice(1, -1);
    }
    let meaning = data.meaning || data.description || "";
    if (meaning.includes("\n")) {
      const parts = meaning.split("\n");
      if (!reading && parts[0].startsWith("(")) {
        reading = parts[0].replace(/[()]/g, "");
      }
      meaning = parts[parts.length - 1];
    }
    // Clean up if meaning starts with parentheses (e.g. "(しけん) Ujian" -> reading="しけん", meaning="Ujian")
    if (meaning.startsWith("(")) {
      const parenMatch = meaning.match(/^\(([^)]+)\)\s*(.*)$/);
      if (parenMatch) {
        if (!reading) {
          reading = parenMatch[1];
        }
        meaning = parenMatch[2];
      }
    }
    return { reading: reading.trim(), meaning: meaning.trim() };
  };

  const { reading, meaning } = getReadingAndMeaning();
  const isActive = Boolean(data.isActiveStep);
  const isDimmed = Boolean(data.isDimmed);
  const isVisible = data.isVisible !== false;
  const animDelayMs = data.animDelayMs || 0;

  const activeGlowClass = isActive
    ? "ring-4 ring-rose-500 shadow-[0_0_35px_rgba(244,63,94,0.7)] scale-105 z-30 transition-all duration-500"
    : isDimmed
    ? "opacity-45 scale-95 transition-all duration-300"
    : "";

  const animStyle = {
    transitionDelay: isVisible ? `${animDelayMs}ms` : "0ms",
  };

  const animClass = `transition-all duration-500 ease-out transform ${
    isVisible
      ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
      : "opacity-0 scale-50 -translate-y-4 pointer-events-none"
  }`;

  // 1. Root Node (Top Center Main Module Kanji)
  if (data.isRoot || data.type === "root") {
    return (
      <div 
        style={animStyle}
        className={`${animClass} bg-gradient-to-r from-[#ff2a6d] via-[#ff145a] to-[#d91244] text-white px-5 sm:px-6 py-3.5 sm:py-4 rounded-3xl shadow-2xl w-fit max-w-[90vw] sm:max-w-[540px] min-w-[280px] sm:min-w-[340px] relative border-2 border-white/50 cursor-pointer hover:scale-105 hover:shadow-rose-500/40 select-none ${
          isActive ? "ring-4 ring-amber-300 shadow-[0_0_40px_rgba(251,191,36,0.8)] scale-105 z-30" : !data.isExpanded ? "animate-pulse" : ""
        } ${activeGlowClass}`}
      >
        <NodeHandles Position={Position} />
        <div className="flex items-center gap-4">
          {/* Left Side: Prominent Kanji Character & Reading */}
          <div className="flex flex-col items-center justify-center shrink-0 pr-4 border-r border-white/25 min-w-[85px]">
            <span className="text-8xl font-black tracking-wide drop-shadow-md font-serif leading-none">
              {data.kanji || data.label}
            </span>
            {reading && (
              <span className="text-lg font-extrabold opacity-95 tracking-wide bg-black/25 px-2.5 py-0.5 rounded-full mt-1.5 text-center">
                ({reading})
              </span>
            )}
          </div>

          {/* Right Side: Badge & Meaning */}
          <div className="flex flex-col items-start justify-center min-w-0 flex-1 text-left">
            <div className="text-md uppercase font-black tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full mb-1.5 shadow-xs whitespace-nowrap">
              KANJI MODUL
            </div>
            {meaning && (
              <span className="text-xl font-bold tracking-normal opacity-95 leading-snug whitespace-normal break-words">
                {meaning}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. Category Nodes (Semantic Cluster Headers)
  if (data.type === "category" || data.meaning === "Kategori") {
    const customBg = data.categoryColor || "#f97316";

    return (
      <div 
        style={{ ...animStyle, backgroundColor: customBg }}
        className={`${animClass} text-white px-6 py-3.5 rounded-2xl text-sm font-black border-2 border-white shadow-lg text-center relative whitespace-nowrap cursor-pointer min-w-[180px] w-fit ${
          isActive ? "ring-4 ring-yellow-300 shadow-[0_0_35px_rgba(234,179,8,0.8)] scale-105 z-30" : ""
        } ${activeGlowClass}`}
      >
        {isActive && (
          <span className="absolute -top-2.5 -right-2.5 bg-yellow-300 text-slate-900 p-1 rounded-full shadow-md border border-white animate-bounce">
            <Sparkles className="w-3.5 h-3.5 fill-slate-900" />
          </span>
        )}
        <NodeHandles Position={Position}/>
        <div className="flex items-center justify-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
          <span className="tracking-wide text-3xl font-black drop-shadow-xs">{data.kanji || data.label}</span>
        </div>
      </div>
    );
  }

  // 3. Leaf Kanji Component Node
  if (data.type === "leafKanji") {
    const catBgColor = data.categoryColor;

    if (catBgColor) {
      return (
        <div 
          style={{ ...animStyle, backgroundColor: catBgColor }}
          className={`${animClass} text-white rounded-2xl px-4 py-2.5 shadow-lg w-fit min-w-[210px] max-w-[340px] border-2 border-white select-none cursor-pointer hover:scale-105 font-extrabold relative ${
            isActive ? "ring-4 ring-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.8)] scale-105 z-30" : ""
          } ${activeGlowClass}`}
        >
          {isActive && (
            <span className="absolute -top-2 -right-2 bg-emerald-400 text-slate-900 p-1 rounded-full shadow-md border border-white animate-bounce">
              <Sparkles className="w-3 h-3 fill-slate-900" />
            </span>
          )}
          <NodeHandles Position={Position} />
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center shrink-0 pr-3 border-r border-white/20 min-w-[48px]">
              <span className="text-6xl font-black tracking-wide drop-shadow-xs font-serif leading-none">
                {data.kanji || data.label}
              </span>
            </div>
            <div className="flex flex-col items-start justify-center min-w-0 flex-1 text-left">
              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                <span className="text-md uppercase tracking-widest text-white/80 font-black shrink-0">
                  KANJI
                </span>
                {reading && (
                  <span className="bg-black/30 text-white text-md font-extrabold px-2 py-0.5 rounded-full inline-block">
                    ({reading})
                  </span>
                )}
              </div>
              {meaning && (
                <div className="text-xl text-white/95 font-bold leading-snug whitespace-normal break-words">
                  {meaning}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div 
        style={animStyle}
        className={`${animClass} bg-white text-slate-800 rounded-2xl px-4 py-2.5 shadow-md w-fit min-w-[210px] max-w-[340px] border-2 border-slate-700 select-none cursor-pointer hover:scale-105 font-extrabold relative ${
          isActive ? "ring-4 ring-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.8)] scale-105 z-30" : ""
        } ${activeGlowClass}`}
      >
        {isActive && (
          <span className="absolute -top-2 -right-2 bg-blue-500 text-white p-1 rounded-full shadow-md border border-white animate-bounce">
            <Sparkles className="w-3 h-3 fill-white" />
          </span>
        )}
        <NodeHandles Position={Position} />
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center shrink-0 pr-3 border-r border-slate-200 min-w-[48px]">
            <span className="text-6xl font-black text-slate-900 tracking-wide font-serif leading-none">
              {data.kanji || data.label}
            </span>
          </div>
          <div className="flex flex-col items-start justify-center min-w-0 flex-1 text-left">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span className="text-md uppercase tracking-widest text-slate-400 font-black shrink-0">
                KANJI
              </span>
              {reading && (
                <span className="bg-blue-50 text-blue-600 text-xl font-extrabold px-2 py-0.5 rounded-full border border-blue-100 inline-block">
                  ({reading})
                </span>
              )}
            </div>
            {meaning && (
              <div className="text-xl text-slate-700 font-bold leading-snug whitespace-normal break-words">
                {meaning}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 4. Sub-word Nodes (Jukugo & Sub-Jukugo Cards)
  const customBg = data.categoryColor || "#3b82f6";
  const word = (data.kanji || data.label || "").trim();

  return (
    <div
      style={{ ...animStyle, backgroundColor: customBg }}
      className={`${animClass} text-white px-4 py-2.5 rounded-2xl border-2 border-white/50 shadow-lg relative w-fit min-w-[240px] max-w-[380px] cursor-pointer hover:scale-105 select-none ${
        isActive ? "ring-4 ring-amber-300 shadow-[0_0_35px_rgba(251,191,36,0.85)] scale-105 z-30" : ""
      } ${activeGlowClass}`}
    >
      {isActive && (
        <span className="absolute -top-2.5 -right-2.5 bg-amber-400 text-slate-900 p-1 rounded-full shadow-md border border-white animate-bounce">
          <Sparkles className="w-3.5 h-3.5 fill-slate-900" />
        </span>
      )}
      <NodeHandles Position={Position}/>
      <div className="flex items-center gap-3">
        {/* Left Side: Jukugo Word Characters */}
        <div className="flex items-center justify-center shrink-0 pr-3 border-r border-white/20 min-w-[65px]">
          <span className={`${word.length > 2 ? "text-4xl" : "text-6xl"} font-black text-white font-serif tracking-wide drop-shadow-xs leading-none`}>
            {word}
          </span>
        </div>

        {/* Right Side: Reading & Meaning */}
        <div className="flex flex-col items-start justify-center min-w-0 flex-1 text-left">
          {reading && (
            <span className="text-xl text-white font-extrabold bg-black/25 px-2.5 py-0.5 rounded-full mb-1 inline-block">
              ({reading})
            </span>
          )}
          {meaning && (
            <span className="text-xl text-white/95 font-bold leading-snug whitespace-normal break-words">
              {meaning}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default KanjiNode;