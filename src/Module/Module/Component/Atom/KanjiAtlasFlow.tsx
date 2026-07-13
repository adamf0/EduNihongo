import { useMemo, useEffect, useState } from "react";
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
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

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
    // Dynamically calculate the horizontal span to maintain a consistent spacing of 280px between columns,
    // avoiding horizontal overlap regardless of the number of categories.
    const totalWidth = (numCategories - 1) * 280;

    categoryNodes.forEach((cat, catIdx) => {
      // Calculate X coordinate evenly across the total width
      const x = numCategories > 1
        ? -totalWidth / 2 + catIdx * 280
        : 0;

      positionedNodes.push({
        ...cat,
        x,
        y: -15, // Clear vertical gap from root node (y: -170)
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
    const formattedNodes = positionedNodes.map((node: any) => {
      const isExpanded = expandedNodes.has(node.id);
      const hasChildren = node.type === "bottom" && initialRawNodes.some(
        (n: any) => n.type === "sub-bottom" && n.parentPill === node.id
      );

      return {
        id: node.id,
        type: "kanjiNode",
        position: { x: node.x + 400, y: node.y + 200 }, // Centering offset inside view container
        data: { 
          ...node,
          isExpanded,
          hasChildren,
        },
      };
    });

    // Filter nodes based on expandedNodes state
    const rootNodeObj = initialRawNodes.find((n: any) => n.type === "root" || n.isRoot);
    const rootExpanded = rootNodeObj ? expandedNodes.has(rootNodeObj.id) : false;

    const visibleNodes = formattedNodes.filter((node: any) => {
      if (node.data.isRoot || node.data.type === "root") {
        return true; // Root is always visible
      }
      if (node.data.type === "bottom") {
        return rootExpanded; // Category nodes are visible if root is expanded
      }
      if (node.data.type === "sub-bottom") {
        // Sub-bottom nodes are visible if their parent category node is expanded AND root is expanded
        return rootExpanded && expandedNodes.has(node.data.parentPill);
      }
      return true;
    });

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

    // Filter edges to only connect visible nodes
    const visibleNodeIds = new Set(visibleNodes.map((n: any) => n.id));
    const visibleEdges = formattedEdges.filter(
      (edge: any) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
    );

    setNodes(visibleNodes);
    setEdges(visibleEdges);
  }, [initialRawNodes, initialRawEdges, expandedNodes]);

  const playClickSound = (isCollapse: boolean) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (isCollapse) {
        // Lower pitch drop sound for collapse
        osc.type = "sine";
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else {
        // Higher bubble-pop sound for expand
        osc.type = "sine";
        osc.frequency.setValueAtTime(420, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      }
    } catch (e) {
      console.warn("Click audio play error:", e);
    }
  };

  const onNodeClick = (_event: React.MouseEvent, node: any) => {
    const nodeId = node.id;
    const nodeData = node.data;

    const isRoot = nodeData.isRoot || nodeData.type === "root";
    const isCategory = nodeData.type === "bottom";

    if (isRoot || isCategory) {
      setExpandedNodes((prev) => {
        const next = new Set(prev);
        const isCurrentlyExpanded = next.has(nodeId);
        if (isCurrentlyExpanded) {
          next.delete(nodeId);
          if (isRoot) {
            // Collapse all categories when root is collapsed
            initialRawNodes.forEach((n: any) => {
              if (n.type === "bottom") {
                next.delete(n.id);
              }
            });
          }
          playClickSound(true); // collapse sound
        } else {
          next.add(nodeId);
          playClickSound(false); // expand sound
        }
        return next;
      });
    }
  };

  return (
    <div className="w-full h-screen bg-slate-50 flex flex-col font-sans select-none">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
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


