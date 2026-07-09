import { useMemo, useEffect } from "react";
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import KanjiNode from "./KanjiNode";

export default function KanjiAtlasFlow({
  initialRawEdges = [],
  initialRawNodes = [],
}: {
  initialRawEdges?: any[];
  initialRawNodes?: any[];
}) {
  const nodeTypes = useMemo(() => ({ kanjiNode: KanjiNode }), []);
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);

  useEffect(() => {
    // 1. Identify the root, category, and sub-word nodes
    const rootNode = initialRawNodes.find((n: any) => n.type === "root" || n.isRoot);
    const categoryNodes = initialRawNodes.filter((n: any) => n.type === "bottom");
    
    // Sort categories consistently by ID so they are always in the correct left-to-right order
    categoryNodes.sort((a, b) => a.id.localeCompare(b.id));

    const positionedNodes: any[] = [];

    // Position Root Node at top center
    if (rootNode) {
      positionedNodes.push({
        ...rootNode,
        x: 0,
        y: -170,
      });
    }

    // Position Category Nodes horizontally and their respective children vertically
    const numCategories = categoryNodes.length;
    const totalWidth = 660; // Max horizontal span

    categoryNodes.forEach((cat, catIdx) => {
      // Calculate X coordinate evenly across the total width
      const x = numCategories > 1
        ? -totalWidth / 2 + (totalWidth / (numCategories - 1)) * catIdx
        : 0;

      positionedNodes.push({
        ...cat,
        x,
        y: -35,
      });

      // Find children belonging to this category
      const children = initialRawNodes.filter(
        (n: any) => n.type === "sub-bottom" && n.parentPill === cat.id
      );
      // Sort children by ID to maintain consistent stack order
      children.sort((a, b) => a.id.localeCompare(b.id));

      children.forEach((child, childIdx) => {
        positionedNodes.push({
          ...child,
          x,
          y: 65 + childIdx * 90, // Even vertical stacking space (90px)
        });
      });
    });

    // 2. Format nodes for ReactFlow
    const formattedNodes = positionedNodes.map((node: any) => ({
      id: node.id,
      type: "kanjiNode",
      position: { x: node.x + 400, y: node.y + 200 }, // Centering offset inside view container
      data: { ...node },
    }));

    // 3. Format edges for ReactFlow, correcting sub-bottom paths to connect sequentially in vertical stacks
    const correctedEdges = [...initialRawEdges];
    
    categoryNodes.forEach((cat) => {
      const children = initialRawNodes.filter(
        (n: any) => n.type === "sub-bottom" && n.parentPill === cat.id
      );
      children.sort((a, b) => a.id.localeCompare(b.id));

      if (children.length > 1) {
        for (let i = 1; i < children.length; i++) {
          const prevChild = children[i - 1];
          const currChild = children[i];
          
          const edgeIdx = correctedEdges.findIndex((e) => e.target === currChild.id);
          if (edgeIdx !== -1) {
            correctedEdges[edgeIdx] = {
              ...correctedEdges[edgeIdx],
              source: prevChild.id,
            };
          }
        }
      }
    });

    const formattedEdges = correctedEdges.map((edge: any) => ({
      ...edge,
      type: "default",
      style: { stroke: "#94a3b8", strokeWidth: 2 }, // Darker slate line for crisp visibility
    }));

    setNodes(formattedNodes);
    setEdges(formattedEdges);
  }, [initialRawNodes, initialRawEdges]);

  return (
    <div className="w-full h-screen bg-slate-50 flex flex-col font-sans select-none">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        minZoom={0.3}
        maxZoom={1.5}
        nodesConnectable={false}
        nodesDraggable={true}
      >
        <Background color="#cbd5e1" gap={16} size={1} />
      </ReactFlow>
    </div>
  );
}

