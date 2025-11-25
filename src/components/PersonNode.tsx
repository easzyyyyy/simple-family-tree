import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import {useEffect, useRef} from "react";

/**
 * PersonData
 * Contains business data for a person. Extend this interface to add more fields.
 */
export interface PersonData extends Record<string, unknown> {
    id: string;
    firstName?: string;
    lastName?: string;
    birthDate?: Date;
    birthPlace?: string;
    deathDate?: Date;
    deathPlace?: string;
    description?: string;
}

/**
 * PersonNodeType
 * Node type for React Flow containing a PersonData
 */
export type PersonNodeType = Node<PersonData, 'person'>;

/**
 * PersonNode Component
 * Custom React Flow node to display a person's information
 */
export default function PersonNode({ data }: NodeProps<PersonNodeType>) {
    const nodeRef = useRef<HTMLDivElement>(null);

    // Measure actual node size after render
    useEffect(() => {
        if (nodeRef.current) {
            const width = nodeRef.current.offsetWidth;
            const height = nodeRef.current.offsetHeight;

            // Store measured dimensions in node data
            data.width = width ?? 250;
            data.height = height ?? 200;
        }
    }, [data]);

    return (
        <div
            ref={nodeRef}
            className="p-3 rounded-lg border border-gray-300 bg-white w-auto shadow-md font-sans"
        >
            {/* Target Handle: connection from parents */}
            <Handle type="target" position={Position.Top} />

            {/* Name */}
            <div className="border-b border-gray-200 pb-1 mb-1">
                <strong className="text-base text-gray-800">
                    {data?.firstName ?? ''} {data?.lastName ?? ''}
                </strong>
            </div>

            {/* Birth and death information */}
            <div className="text-xs text-gray-600 mb-1">
                {data?.birthDate && (
                    <span>
                        Né le <strong>{data.birthDate.toLocaleDateString('fr-FR')}</strong>
                        {data?.birthPlace && <> à <strong>{data.birthPlace}</strong></>}
                    </span>
                )}
                {data?.deathDate && (
                    <span>
                        <br />
                        Décédé le <strong>{data.deathDate.toLocaleDateString('fr-FR')}</strong>
                        {data?.deathPlace && <> à <strong>{data.deathPlace}</strong></>}
                    </span>
                )}
            </div>

            {/* Description */}
            {data?.description && (
                <div className="text-[11px] text-gray-500 italic">
                    {data.description}
                </div>
            )}

            {/* Source Handle: connection to children */}
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}
