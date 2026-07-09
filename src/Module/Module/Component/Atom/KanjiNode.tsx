import { Position } from "@xyflow/react";
import NodeHandles from "./NodeHandles";

const KanjiNode = ({ data }: { data: any }) => {
  // 1. Root Node (Pink gradient container, white text, matching the reference images)
  if (data.isRoot) {
    const parts = data.meaning ? data.meaning.split("\n") : [];
    const romaji = parts.length > 1 ? parts[0] : "";
    const displayMeaning = parts.length > 1 ? parts[1] : (data.meaning || "");

    return (
      <div className="bg-gradient-to-br from-[#ff5b94] to-[#ff2b6d] text-white px-6 py-4 rounded-2xl shadow-lg min-w-[200px] text-center relative border border-[#ff1b5f]">
        <NodeHandles Position={Position} />
        <div className="flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold tracking-wide mb-1 drop-shadow-sm font-serif">
            {data.kanji}
          </span>
          {romaji && (
            <span className="text-xs font-semibold opacity-90 tracking-wide">
              {romaji}
            </span>
          )}
          <span className="text-sm font-bold tracking-wider mt-1 opacity-95">
            {displayMeaning}
          </span>
        </div>
      </div>
    );
  }

  // 2. Category Nodes (Filled colored pills based on border color, white text)
  if (data.meaning === "Kategori") {
    let bgClass = "bg-slate-600 border-slate-700";
    if (data.borderColor?.includes("green")) bgClass = "bg-[#22c55e] border-[#16a34a]";
    else if (data.borderColor?.includes("orange")) bgClass = "bg-[#f97316] border-[#ea580c]";
    else if (data.borderColor?.includes("blue")) bgClass = "bg-[#3b82f6] border-[#2563eb]";
    else if (data.borderColor?.includes("purple")) bgClass = "bg-[#a855f7] border-[#9333ea]";
    else if (data.borderColor?.includes("yellow")) bgClass = "bg-[#eab308] border-[#ca8a04]";

    return (
      <div className={`text-white px-5 py-2.5 rounded-full text-xs font-bold border shadow-md text-center relative whitespace-nowrap ${bgClass}`}>
        <NodeHandles Position={Position}/>
        <span>{data.kanji}</span>
      </div>
    );
  }

  // 3. Sub-word Nodes (White card with light-blue borders, parsed kana readings, and meanings)
  if (data.type === "sub-bottom") {
    const match = data.meaning ? data.meaning.match(/^\(([^)]+)\)\s*(.*)$/) : null;
    const reading = match ? `(${match[1]})` : "";
    const meaningText = match ? match[2] : (data.meaning || "");

    return (
      <div className="bg-[#f8fafc] text-slate-800 px-4 py-2.5 rounded-xl border-2 border-sky-200 shadow-sm text-center relative min-w-[120px]">
        <NodeHandles Position={Position}/>
        <div className="flex flex-col items-center justify-center">
          <span className="text-sm font-bold text-sky-950 font-serif">{data.kanji}</span>
          {reading && <span className="text-[10px] text-sky-600 font-semibold mt-0.5">{reading}</span>}
          <span className="text-[10px] text-slate-500 font-bold mt-0.5">{meaningText}</span>
        </div>
      </div>
    );
  }

  // Fallback styling for other nodes
  const borderColorClass = data.borderColor || "border-slate-400";
  const radiusClass = data.isPill
    ? "rounded-full px-4 py-2 min-w-[100px]"
    : "rounded-xl w-16 h-16";

  return (
    <div
      className={`bg-white border-2 ${borderColorClass} text-slate-800 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-all cursor-pointer relative whitespace-nowrap ${radiusClass}`}
    >
      <NodeHandles Position={Position} />
      <span className={data.isPill ? "text-sm font-bold" : "text-xl font-bold"}>
        {data.kanji}
      </span>
      <span className="text-[9px] text-gray-500 font-medium">
        {data.meaning}
      </span>
    </div>
  );
};

export default KanjiNode;