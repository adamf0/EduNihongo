import React from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import Icon from "../../../Common/Component/Icon";

interface JukugoNodeData {
  kanji: string;
  reading?: string;
  meaning?: string;
  word?: string;
  isRoot?: boolean;
  isSourceNode?: boolean;
  onSelectNode?: (word: string) => void;
  [key: string]: unknown;
}

export const SemanticJukugoNode: React.FC<NodeProps> = ({ data }) => {
  const nodeData = data as unknown as JukugoNodeData;
  const isRoot = Boolean(nodeData.isRoot);
  const isSource = Boolean(nodeData.isSourceNode);
  const word = nodeData.word || nodeData.kanji || "";
  const reading = nodeData.reading || "";
  const meaning = nodeData.meaning || "";

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (nodeData.onSelectNode) {
      nodeData.onSelectNode(word);
    }
  };

  if (isRoot) {
    return (
      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-3xl p-5 shadow-xl min-w-[160px] text-center border-4 border-white select-none cursor-default relative">
        <Handle
          type="target"
          position={Position.Top}
          className="!w-2 !h-2 !bg-white/40 !border-none"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-2 !h-2 !bg-white/40 !border-none"
        />
        <div className="text-[10px] font-extrabold tracking-widest uppercase opacity-80 mb-1">
          KANJI UTAMA
        </div>
        <div className="font-extrabold text-4xl tracking-wider">{word}</div>
        {meaning && (
          <div className="text-xs font-semibold opacity-90 mt-1">{meaning}</div>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`rounded-2xl p-4 shadow-md hover:shadow-xl transition-all min-w-[160px] max-w-[200px] text-center relative select-none cursor-pointer border-2 ${
        isSource
          ? "bg-emerald-50 border-emerald-500 ring-4 ring-emerald-500/20 scale-105"
          : "bg-white border-indigo-200 hover:border-indigo-500"
      }`}
    >
      {/* React Flow Connection Handles (Top, Bottom, Left, Right) */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="!w-2.5 !h-2.5 !bg-emerald-500 !border-2 !border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!w-2.5 !h-2.5 !bg-indigo-600 !border-2 !border-white"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!w-2.5 !h-2.5 !bg-emerald-500 !border-2 !border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!w-2.5 !h-2.5 !bg-indigo-600 !border-2 !border-white"
      />

      {/* Badge Indicator */}
      {isSource ? (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full shadow-sm animate-pulse z-10">
          Sumber (Asal)
        </div>
      ) : (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-slate-100 border border-slate-300 text-slate-600 text-[9px] font-extrabold px-2 py-0.5 rounded-full hover:bg-indigo-600 hover:text-white transition-colors z-10">
          Klik untuk Hubungkan
        </div>
      )}

      {/* Main Content */}
      <div className="font-extrabold text-2xl text-slate-900 tracking-wide mb-1 mt-1">
        {word}
      </div>
      {reading && (
        <div className="inline-block bg-indigo-50 text-indigo-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full mb-1">
          ({reading})
        </div>
      )}
      {meaning && (
        <div className="text-xs text-slate-500 font-bold line-clamp-2 mt-0.5">
          {meaning}
        </div>
      )}

      {/* Action Button */}
      <div className="mt-3">
        <button
          type="button"
          onClick={handleClick}
          className={`w-full py-1.5 px-2 text-[11px] font-extrabold rounded-xl transition-all border cursor-pointer flex items-center justify-center gap-1 ${
            isSource
              ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
              : "bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border-indigo-200"
          }`}
        >
          <Icon name={isSource ? "check" : "link"} className="text-sm" />
          <span>{isSource ? "Sumber Terpilih" : "+ Hubungkan"}</span>
        </button>
      </div>
    </div>
  );
};

export default SemanticJukugoNode;
