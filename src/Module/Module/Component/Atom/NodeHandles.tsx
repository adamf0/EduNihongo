import { Handle } from "@xyflow/react";

const NodeHandles = ({Position}) => (
  <>
    <Handle
      type="target"
      position={Position.Top}
      className="opacity-0 pointer-events-none"
    />
    <Handle
      type="source"
      position={Position.Bottom}
      className="opacity-0 pointer-events-none"
    />
  </>
);

export default NodeHandles;
