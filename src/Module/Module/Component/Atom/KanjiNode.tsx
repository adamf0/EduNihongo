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
    return { reading: reading.trim(), meaning: meaning.trim() };
  };

  const { reading, meaning } = getReadingAndMeaning();
  const isActive = Boolean(data.isActiveStep);
  const isDimmed = Boolean(data.isDimmed);

  const activeGlowClass = isActive
    ? "ring-4 ring-rose-500 shadow-[0_0_35px_rgba(244,63,94,0.7)] scale-110 z-30 transition-all duration-500"
    : isDimmed
    ? "opacity-45 scale-95 transition-all duration-300"
    : "transition-all duration-300";

  // 1. Root Node (Top Center Main Module Kanji)
  if (data.isRoot || data.type === "root") {
    return (
      <div 
        className={`bg-gradient-to-br from-[#ff3b7b] via-[#ff1b5f] to-[#e11d48] text-white px-8 py-5 rounded-3xl shadow-xl min-w-[240px] text-center relative border-2 border-white/40 cursor-pointer hover:scale-105 hover:shadow-rose-500/30 ${
          isActive ? "ring-4 ring-amber-300 shadow-[0_0_40px_rgba(251,191,36,0.8)] scale-110 z-30" : !data.isExpanded ? "animate-pulse" : ""
        } ${activeGlowClass}`}
      >
        <NodeHandles Position={Position} />
        <div className="flex flex-col items-center justify-center">
          <div className="text-[10px] uppercase font-black tracking-widest bg-white/20 px-3 py-0.5 rounded-full mb-1">
            KANJI MODUL
          </div>
          <span className="text-5xl font-black tracking-wide mb-1 drop-shadow-md font-serif">
            {data.kanji || data.label}
          </span>
          {reading && (
            <span className="text-xs font-extrabold opacity-95 tracking-wide bg-black/25 px-3 py-0.5 rounded-full my-0.5">
              ({reading})
            </span>
          )}
          {meaning && (
            <span className="text-xs font-bold tracking-wider mt-1 opacity-95 max-w-[210px] leading-tight">
              {meaning}
            </span>
          )}
        </div>
      </div>
    );
  }

  // 2. Category Nodes (Semantic Cluster Headers)
  if (data.type === "category" || data.meaning === "Kategori") {
    const customBg = data.categoryColor || "#f97316";

    return (
      <div 
        style={{ backgroundColor: customBg }}
        className={`text-white px-6 py-3.5 rounded-2xl text-sm font-black border-2 border-white shadow-lg text-center relative whitespace-nowrap cursor-pointer min-w-[180px] ${
          isActive ? "ring-4 ring-yellow-300 shadow-[0_0_35px_rgba(234,179,8,0.8)] scale-110 z-30" : ""
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
          <span className="tracking-wide text-base font-black drop-shadow-xs">{data.kanji || data.label}</span>
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
          style={{ backgroundColor: catBgColor }}
          className={`text-white rounded-2xl p-3 shadow-lg min-w-[115px] max-w-[135px] text-center border-2 border-white select-none cursor-default font-extrabold flex flex-col items-center justify-center relative ${
            isActive ? "ring-4 ring-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.8)] scale-110 z-30" : ""
          } ${activeGlowClass}`}
        >
          {isActive && (
            <span className="absolute -top-2 -right-2 bg-emerald-400 text-slate-900 p-1 rounded-full shadow-md border border-white animate-bounce">
              <Sparkles className="w-3 h-3 fill-slate-900" />
            </span>
          )}
          <NodeHandles Position={Position} />
          <div className="text-[8px] uppercase tracking-widest text-white/80 font-black mb-0.5">
            KANJI
          </div>
          <div className="text-3xl font-black tracking-wide mb-0.5 drop-shadow-xs font-serif">{data.kanji || data.label}</div>
          {reading && (
            <div className="bg-black/30 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full mb-1">
              ({reading})
            </div>
          )}
          {meaning && (
            <div className="text-[10px] text-white/95 font-bold line-clamp-2 max-w-[115px] leading-tight">
              {meaning}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className={`bg-white text-slate-800 rounded-2xl p-3 shadow-md min-w-[115px] max-w-[135px] text-center border-2 border-slate-700 select-none cursor-default font-extrabold flex flex-col items-center justify-center relative ${
        isActive ? "ring-4 ring-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.8)] scale-110 z-30" : ""
      } ${activeGlowClass}`}>
        {isActive && (
          <span className="absolute -top-2 -right-2 bg-blue-500 text-white p-1 rounded-full shadow-md border border-white animate-bounce">
            <Sparkles className="w-3 h-3 fill-white" />
          </span>
        )}
        <NodeHandles Position={Position} />
        <div className="text-[8px] uppercase tracking-widest text-slate-400 font-black mb-0.5">
          KANJI
        </div>
        <div className="text-3xl font-black text-slate-900 tracking-wide mb-0.5 font-serif">{data.kanji || data.label}</div>
        {reading && (
          <div className="bg-blue-50 text-blue-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full mb-1 border border-blue-100">
            ({reading})
          </div>
        )}
        {meaning && (
          <div className="text-[10px] text-slate-600 font-bold line-clamp-2 max-w-[115px] leading-tight">
            {meaning}
          </div>
        )}
      </div>
    );
  }

  // 4. Sub-word Nodes (Jukugo & Sub-Jukugo Cards)
  const customBg = data.categoryColor || "#3b82f6";

  return (
    <div
      style={{ backgroundColor: customBg }}
      className={`text-white px-5 py-3.5 rounded-2xl border-2 border-white/50 shadow-lg text-center relative min-w-[150px] max-w-[190px] ${
        isActive ? "ring-4 ring-amber-300 shadow-[0_0_35px_rgba(251,191,36,0.85)] scale-110 z-30" : ""
      } ${activeGlowClass}`}
    >
      {isActive && (
        <span className="absolute -top-2.5 -right-2.5 bg-amber-400 text-slate-900 p-1 rounded-full shadow-md border border-white animate-bounce">
          <Sparkles className="w-3.5 h-3.5 fill-slate-900" />
        </span>
      )}
      <NodeHandles Position={Position}/>
      <div className="flex flex-col items-center justify-center">
        <span className="text-xl font-black text-white font-serif tracking-wide drop-shadow-xs mb-0.5">
          {data.kanji || data.label}
        </span>
        {reading && (
          <span className="text-[11px] text-white font-extrabold bg-black/25 px-2.5 py-0.5 rounded-full my-0.5">
            ({reading})
          </span>
        )}
        {meaning && (
          <span className="text-[11px] text-white/95 font-bold mt-0.5 max-w-[160px] leading-tight">
            {meaning}
          </span>
        )}
      </div>
    </div>
  );
};

export default KanjiNode;