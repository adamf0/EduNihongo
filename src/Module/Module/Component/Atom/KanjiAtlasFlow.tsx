import { useMemo, useEffect } from "react";
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import {
  forceSimulation,
  forceX,
  forceY,
  forceCollide,
  forceManyBody,
  forceLink,
} from "d3-force";
import "@xyflow/react/dist/style.css";
import KanjiNode from "./KanjiNode";

export default function KanjiAtlasFlow({initialRawEdges=[], initialRawNodes=[]}) {
  const nodeTypes = useMemo(() => ({ kanjiNode: KanjiNode }), []);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const d3Nodes = initialRawNodes.map((node) => {
      let initialX = Math.random() * 40 - 20;
      if (node.id === "bot-1" || node.parentPill === "bot-1") initialX = -180;
      if (node.id === "bot-2" || node.parentPill === "bot-2") initialX = 180;

      return {
        ...node,
        x: initialX,
        y:
          node.type === "top"
            ? -150
            : node.type === "bottom"
              ? 100
              : node.type === "sub-bottom"
                ? 250
                : 0,
      };
    });

    const d3Links = initialRawEdges.map((edge) => ({
      source: edge.source,
      target: edge.target,
    }));

    const simulation = forceSimulation(d3Nodes)
      .force(
        "link",
        forceLink(d3Links)
          .id((d) => d.id)
          .distance(90)
          .strength(1),
      )
      .force("charge", forceManyBody().strength(-1400)) // Tingkatkan tolakkan agar kluster makin berjarak
      .force(
        "collide",
        forceCollide()
          .radius((d) => {
            if (d.isRoot) return 100;
            if (d.isPill) return 95;
            if (d.type === "sub-bottom") return 90;
            return 65;
          })
          .iterations(4),
      )
      .force(
        "x",
        forceX()
          .x((d) => {
            if (d.id === "bot-1" || d.parentPill === "bot-1") return -200;
            if (d.id === "bot-2" || d.parentPill === "bot-2") return 200;
            return 0;
          })
          .strength(0.8),
      )
      .force(
        "y",
        forceY()
          .y((d) => {
            if (d.type === "top") return -180;
            if (d.type === "root") return 0;
            if (d.type === "bottom") return 130;
            if (d.type === "sub-bottom") return 280;
            return 0;
          })
          .strength(1.5),
      );

    for (let i = 0; i < 200; ++i) simulation.tick();

    const formattedNodes = d3Nodes.map((node) => ({
      id: node.id,
      type: "kanjiNode",
      position: { x: node.x + 400, y: node.y + 250 },
      data: { ...node },
    }));

    const formattedEdges = initialRawEdges.map((edge) => ({
      ...edge,
      type: "default",
      style: { stroke: "#cbd5e1", strokeWidth: 2 },
    }));

    setNodes(formattedNodes);
    setEdges(formattedEdges);
  }, []);

  return (
    <div className="w-full h-screen bg-slate-50 flex flex-col font-sans select-none">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
        nodesConnectable={false}
        nodesDraggable={true}
      >
        <Background color="#e2e8f0" gap={16} size={1} />
      </ReactFlow>
    </div>
  );
}
