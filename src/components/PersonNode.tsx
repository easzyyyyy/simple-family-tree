import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';

// Define the shape of the custom data for a person
export interface PersonData extends Record<string, unknown> {
    id: string;
    type: 'person';
    firstName?: string;
    lastName?: string;
    birthDate?: Date;
    birthPlace?: string;
    deathDate?: Date;
    deathPlace?: string;
    description?: string;
}

// Define the specific Node type
// We use 'person' as the type identifier here
export type PersonNodeType = Node<PersonData, 'person'>;

// The Custom Node Component
export default function PersonNode({ data }: NodeProps<PersonNodeType>) {
    return (
        <div
            className="
                p-3
                rounded-lg
                border border-gray-300
                bg-white
                w-52
                shadow-md
                font-sans
            "
        >
            {/* Target Handle: Connection from parents (Top) */}
            <Handle type="target" position={Position.Top} />

            <div
                className="
                    border-b border-gray-200
                    pb-1 mb-1
                "
            >
                <strong
                    className="
                        text-base
                        text-gray-800
                    "
                >
                    {data.firstName} {data.lastName}
                </strong>
            </div>

            <div
                className="
                    text-xs
                    text-gray-600
                    mb-1
                "
            >
                {data.birthDate && (
                    <span>
                        Né le <strong>{data.birthDate.toLocaleDateString('fr-FR')}</strong>
                        {data.birthPlace && <> à <strong>{data.birthPlace}</strong></>}
                    </span>
                )}

                {data.deathDate && (
                    <span>
                        <br />
                        Décédé le <strong>{data.deathDate.toLocaleDateString('fr-FR')}</strong>
                        {data.deathPlace && <> à <strong>{data.deathPlace}</strong></>}
                    </span>
                )}
            </div>

            <div
                className="
                    text-[11px]
                    text-gray-500
                    italic
                "
            >
                {data.description}
            </div>

            {/* Source Handle: Connection to children (Bottom) */}
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}
