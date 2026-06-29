import { Position } from "@xyflow/react";
import NodeHandles from "./NodeHandles";

const KanjiNode = ({ data }: { data: any }) => {
  // Base Handle komponen agar tidak ditulis berulang-ulang
  if (data.type === "sub-bottom") {
    return (
      <div className="bg-amber-50 text-amber-900 px-3 py-1.5 rounded-md text-[11px] border border-amber-300 shadow-sm font-medium text-center relative whitespace-nowrap">
        <NodeHandles Position={Position}/>
        <span>
          {data.kanji} : {data.meaning}
        </span>
      </div>
    );
  }

  if (data.isRoot) {
    return (
      <div className="bg-white border-2 border-dashed border-red-500 p-1 rounded-2xl shadow-md min-w-[130px] text-center relative">
        <NodeHandles Position={Position} />
        <div className="bg-slate-50 border border-slate-800 p-4 rounded-xl flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-800 tracking-wide">
            {data.kanji}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 mt-1">
            {data.meaning}
          </span>
        </div>
      </div>
    );
  }

  // Gabungan Node Biasa & Pill. Warna border diambil dari parameter data.borderColor
  // Default fallback menggunakan border-slate-400 jika parameter lupa diisi
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