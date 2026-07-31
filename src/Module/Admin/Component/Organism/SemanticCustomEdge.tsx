import React from "react";
import { getBezierPath, type EdgeProps } from "@xyflow/react";

export const SemanticCustomEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
  data,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const edgeData = data as any;
  const isSelected = Boolean(edgeData?.isSelected);
  const onUnlinkClick = edgeData?.onUnlinkClick;

  const labelText = typeof label === "string" ? label.replace(/_/g, " ") : label || "hubungan";

  return (
    <>
      <path
        id={id}
        style={{
          stroke: isSelected ? "#ef4444" : "#4f46e5",
          strokeWidth: isSelected ? 3.5 : 2.5,
          strokeDasharray: "6 4",
          ...style,
        }}
        className="react-flow__edge-path cursor-pointer hover:stroke-rose-600 transition-all"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <g
        transform={`translate(${labelX}, ${labelY})`}
        className="cursor-pointer select-none"
      >
        <rect
          x="-70"
          y="-15"
          width="140"
          height="30"
          rx="12"
          ry="12"
          fill={isSelected ? "#fef2f2" : "#ffffff"}
          stroke={isSelected ? "#ef4444" : "#4f46e5"}
          strokeWidth="2.5"
          filter="drop-shadow(0 4px 10px rgba(0,0,0,0.15))"
        />
        <text
          x="0"
          y="4"
          textAnchor="middle"
          fill={isSelected ? "#991b1b" : "#1e1b4b"}
          fontSize="12"
          fontWeight="800"
          fontFamily="sans-serif"
        >
          {labelText}
        </text>

        {/* Floating Unlink Button when edge is clicked/selected */}
        {isSelected && (
          <g
            transform="translate(0, 26)"
            onClick={(e) => {
              e.stopPropagation();
              onUnlinkClick?.(id);
            }}
            className="cursor-pointer"
          >
            <rect
              x="-48"
              y="-12"
              width="96"
              height="24"
              rx="8"
              ry="8"
              fill="#ef4444"
              stroke="#ffffff"
              strokeWidth="1.5"
              filter="drop-shadow(0 4px 8px rgba(239,68,68,0.35))"
            />
            <text
              x="0"
              y="4"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="10"
              fontWeight="800"
              fontFamily="sans-serif"
            >
              Unlink ✕
            </text>
          </g>
        )}
      </g>
    </>
  );
};

export default SemanticCustomEdge;
