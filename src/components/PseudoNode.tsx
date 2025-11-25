import { useEffect, useRef } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';

export interface PseudoNodeData extends Record<string, unknown> {
    id: string;
    width?: number;
    height?: number;
}

export type PseudoNodeType = Node<PseudoNodeData, 'pseudo'>;

export default function PseudoNode({ data }: NodeProps<PseudoNodeType>) {
    const nodeRef = useRef<HTMLDivElement>(null);

    // Measure actual node size after render
    useEffect(() => {
        if (nodeRef.current) {
            const width = nodeRef.current.offsetWidth;
            const height = nodeRef.current.offsetHeight;

            // Store measured dimensions in node data for ELK
            data.width = width ?? 1;
            data.height = height ?? 1;
        }
    }, [data]);

    return (
        <div
            ref={nodeRef}
            className="w-[1px] h-[1px] border border-transparent rounded-full pointer-events-none"
        >
            {/* Handles hidden but still used by ELK for edges */}
            <Handle type="target" position={Position.Top} className="hidden" />
            <Handle type="source" position={Position.Bottom} className="hidden" />
        </div>
    );
}
