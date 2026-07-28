import { Handle, Position } from "@xyflow/react";

const NodeHandles = ({ Position: _pos }: { Position?: any }) => (
  <>
    {/* Target handles on all 4 sides */}
    <Handle type="target" position={Position.Top} id="t-top" className="opacity-0 pointer-events-none" />
    <Handle type="target" position={Position.Bottom} id="t-bottom" className="opacity-0 pointer-events-none" />
    <Handle type="target" position={Position.Left} id="t-left" className="opacity-0 pointer-events-none" />
    <Handle type="target" position={Position.Right} id="t-right" className="opacity-0 pointer-events-none" />

    {/* Source handles on all 4 sides */}
    <Handle type="source" position={Position.Top} id="s-top" className="opacity-0 pointer-events-none" />
    <Handle type="source" position={Position.Bottom} id="s-bottom" className="opacity-0 pointer-events-none" />
    <Handle type="source" position={Position.Left} id="s-left" className="opacity-0 pointer-events-none" />
    <Handle type="source" position={Position.Right} id="s-right" className="opacity-0 pointer-events-none" />
  </>
);

export default NodeHandles;
