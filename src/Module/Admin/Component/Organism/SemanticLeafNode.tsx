import React from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";

interface LeafNodeData {
  character: string;
  romaji?: string;
  meaning?: string;
  parentWord?: string;
  [key: string]: unknown;
}

export const SemanticLeafNode: React.FC<NodeProps> = ({ data }) => {
  const nodeData = data as unknown as LeafNodeData;
  const character = nodeData.character || "";
  const romaji = nodeData.romaji || "";
  const meaning = nodeData.meaning || "";

  return (
    <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-3 shadow-lg min-w-[120px] max-w-[140px] text-center border-2 border-white select-none cursor-default font-extrabold flex flex-col items-center justify-center relative">
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="!w-2.5 !h-2.5 !bg-emerald-300 !border-2 !border-white"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!w-2.5 !h-2.5 !bg-emerald-300 !border-2 !border-white"
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right"
        className="!w-2.5 !h-2.5 !bg-emerald-300 !border-2 !border-white"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom"
        className="!w-2.5 !h-2.5 !bg-emerald-300 !border-2 !border-white"
      />

      <div className="text-[9px] uppercase tracking-widest text-emerald-200 font-extrabold mb-0.5">
        KANJI
      </div>
      <div className="text-2xl font-black tracking-wide mb-0.5">{character}</div>

      {romaji && (
        <div className="bg-emerald-800/80 text-emerald-100 text-[10px] font-extrabold px-2 py-0.5 rounded-full mb-1">
          ({romaji})
        </div>
      )}

      {meaning && (
        <div className="text-[10px] text-emerald-50 font-bold line-clamp-2 max-w-[120px] leading-tight">
          {meaning}
        </div>
      )}
    </div>
  );
};

export default SemanticLeafNode;
