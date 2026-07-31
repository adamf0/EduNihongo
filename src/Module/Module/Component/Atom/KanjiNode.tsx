import { Position } from "@xyflow/react";
import NodeHandles from "./NodeHandles";

const KanjiNode = ({ data }: { data: any }) => {
  // 1. Root Node (Glowing Central Concept Graph Hub)
  if (data.isRoot) {
    const parts = data.meaning ? data.meaning.split("\n") : [];
    const romaji = parts.length > 1 ? parts[0] : "";
    const displayMeaning = parts.length > 1 ? parts[1] : (data.meaning || "");

    return (
      <div 
        className={`bg-gradient-to-br from-[#ff5b94] via-[#ff3b7b] to-[#ff1b5f] text-white px-7 py-4 rounded-3xl shadow-xl min-w-[210px] text-center relative border-2 border-white/30 animate-node-reveal cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-rose-500/30 ${
          !data.isExpanded ? "animate-pulse-glow" : "ring-4 ring-rose-400/20"
        }`}
      >
        <NodeHandles Position={Position} />
        <div className="flex flex-col items-center justify-center">
          <div className="text-[10px] uppercase font-black tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full mb-1">
            Kanji Inti
          </div>
          <span className="text-4xl font-extrabold tracking-wide mb-1 drop-shadow-md font-serif">
            {data.kanji}
          </span>
          {romaji && (
            <span className="text-xs font-semibold opacity-90 tracking-wide bg-black/10 px-2 py-0.5 rounded-full">
              {romaji}
            </span>
          )}
          <span className="text-xs font-bold tracking-wider mt-1.5 opacity-95 max-w-[180px] leading-tight">
            {displayMeaning}
          </span>
          {!data.isExpanded && (
            <span className="text-[10px] bg-white text-rose-600 font-extrabold px-2.5 py-0.5 rounded-full mt-2 animate-bounce inline-block shadow-sm">
              Klik Simpul 💡
            </span>
          )}
        </div>
      </div>
    );
  }

  // 2. Leaf Kanji Component Node
  if (data.type === "leafKanji") {
    const parentCount = Number(data.parentCount || (data.parentIds ? data.parentIds.length : 1));
    const isShared = parentCount > 1 || Boolean(data.isShared);
    const catBgColor = data.categoryColor || "#f97316";

    if (isShared) {
      // Gambar 1: Shared Leaf Node (> 1 parent Jukugo) -> Solid Category Color Background
      return (
        <div 
          style={{ backgroundColor: catBgColor }}
          className="text-white rounded-2xl p-2.5 shadow-lg min-w-[105px] max-w-[125px] text-center border-2 border-white select-none cursor-default font-extrabold flex flex-col items-center justify-center relative animate-node-reveal"
        >
          <NodeHandles Position={Position} />
          <div className="text-[8px] uppercase tracking-widest text-white/80 font-extrabold mb-0.5">
            KANJI
          </div>
          <div className="text-2xl font-black tracking-wide mb-0.5 drop-shadow-xs">{data.kanji}</div>
          {data.romaji && (
            <div className="bg-black/25 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full mb-1">
              ({data.romaji})
            </div>
          )}
          {data.meaning && (
            <div className="text-[9px] text-white/95 font-bold line-clamp-2 max-w-[105px] leading-tight">
              {data.meaning}
            </div>
          )}
        </div>
      );
    }

    // Gambar 2: Single-Parent Leaf Node (=== 1 parent Jukugo) -> White Background & Dashed Dark Border
    return (
      <div className="bg-white text-slate-800 rounded-2xl p-2.5 shadow-md min-w-[105px] max-w-[125px] text-center border-2 border-dashed border-slate-700 select-none cursor-default font-extrabold flex flex-col items-center justify-center relative animate-node-reveal">
        <NodeHandles Position={Position} />
        <div className="text-[8px] uppercase tracking-widest text-slate-400 font-extrabold mb-0.5">
          KANJI
        </div>
        <div className="text-2xl font-black text-slate-900 tracking-wide mb-0.5">{data.kanji}</div>
        {data.romaji && (
          <div className="bg-blue-50 text-blue-600 text-[9px] font-extrabold px-2 py-0.5 rounded-full mb-1 border border-blue-100">
            ({data.romaji})
          </div>
        )}
        {data.meaning && (
          <div className="text-[9px] text-slate-600 font-bold line-clamp-2 max-w-[105px] leading-tight">
            {data.meaning}
          </div>
        )}
      </div>
    );
  }

  // 3. Category Nodes (Semantic Cluster Hubs)
  if (data.meaning === "Kategori") {
    const customBg = data.categoryColor;

    return (
      <div 
        style={customBg ? { backgroundColor: customBg, borderColor: "#ffffff" } : undefined}
        className={`text-white px-6 py-3 rounded-2xl text-xs font-black border-2 shadow-lg text-center relative whitespace-nowrap animate-node-reveal cursor-pointer transition-all duration-300 hover:scale-105 ${
          !customBg ? "bg-amber-500 border-amber-400 shadow-amber-500/25" : ""
        }`}
      >
        <NodeHandles Position={Position}/>
        <div className="flex items-center justify-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span className="tracking-wide text-sm font-extrabold">{data.kanji}</span>
        </div>
        {data.hasChildren && (
          <span 
            className={`absolute -top-2 -right-2 flex items-center justify-center rounded-full w-5 h-5 text-[10px] font-black border-2 border-white shadow-md transition-all ${
              data.isExpanded ? "bg-slate-700 text-white" : "bg-rose-500 text-white animate-bounce"
            }`}
          >
            {data.isExpanded ? "−" : "+"}
          </span>
        )}
      </div>
    );
  }

  // 4. Sub-word Nodes (Semantic Graph Jukugo Cards)
  if (data.type === "sub-bottom") {
    const match = data.meaning ? data.meaning.match(/^\(([^)]+)\)\s*(.*)$/) : null;
    const reading = match ? `(${match[1]})` : "";
    const meaningText = match ? match[2] : (data.meaning || "");
    const customBg = data.categoryColor;

    // If Jukugo card has custom Category Color background (Gambar 1 style)
    if (customBg) {
      return (
        <div
          style={{ backgroundColor: customBg }}
          className="text-white px-5 py-3 rounded-2xl border-2 border-white/40 shadow-lg text-center relative min-w-[130px] animate-node-reveal hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          <NodeHandles Position={Position}/>
          <div className="flex flex-col items-center justify-center">
            <span className="text-base font-extrabold text-white font-serif tracking-wide drop-shadow-xs">{data.kanji}</span>
            {reading && <span className="text-[11px] text-white font-extrabold mt-0.5 bg-black/20 px-2 py-0.5 rounded-full">{reading}</span>}
            <span className="text-[11px] text-white/95 font-bold mt-1 max-w-[140px] leading-tight">{meaningText}</span>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white/95 text-slate-800 px-5 py-3 rounded-2xl border-2 border-slate-200 shadow-md text-center relative min-w-[130px] animate-node-reveal hover:shadow-xl hover:border-blue-400 hover:scale-105 transition-all duration-300 backdrop-blur-sm">
        <NodeHandles Position={Position}/>
        <div className="flex flex-col items-center justify-center">
          <span className="text-base font-extrabold text-slate-900 font-serif tracking-wide">{data.kanji}</span>
          {reading && <span className="text-[11px] text-blue-600 font-bold mt-0.5 bg-blue-50 px-2 py-0.5 rounded-full">{reading}</span>}
          <span className="text-[11px] text-slate-600 font-bold mt-1 max-w-[140px] leading-tight">{meaningText}</span>
        </div>
      </div>
    );
  }

  // Fallback styling for other nodes
  const borderColorClass = data.borderColor || "border-slate-400";
  const radiusClass = data.isPill
    ? "rounded-full px-5 py-2.5 min-w-[110px]"
    : "rounded-2xl w-18 h-18";

  return (
    <div
      className={`bg-white border-2 ${borderColorClass} text-slate-800 flex flex-col items-center justify-center shadow-md hover:shadow-lg transition-all cursor-pointer relative whitespace-nowrap animate-node-reveal ${radiusClass}`}
    >
      <NodeHandles Position={Position} />
      <span className={data.isPill ? "text-sm font-bold" : "text-xl font-bold"}>
        {data.kanji}
      </span>
      <span className="text-[10px] text-gray-500 font-medium">
        {data.meaning}
      </span>
    </div>
  );
};

export default KanjiNode;