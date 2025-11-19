import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';

// Define the structure of the data passed to the node
export type PersonData = {
    label: string;
    gender: 'M' | 'F';
    date: string;
};

// Type the component using NodeProps with our custom data
const PersonNode = memo(({ data }: NodeProps<PersonData>) => {
    return (
        <div className="bg-white border-2 border-gray-200 rounded-xl shadow-lg w-48 overflow-hidden">
            {/* Header with color based on gender */}
            <div className={`h-2 w-full ${data.gender === 'F' ? 'bg-pink-400' : 'bg-blue-400'}`} />

            <div className="p-4 flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2 text-xl">
                    {data.gender === 'F' ? '👩' : '👨'}
                </div>

                <div className="font-bold text-gray-800 text-center">{data.label}</div>
                <div className="text-xs text-gray-500">{data.date}</div>
            </div>

            <Handle type="target" position={Position.Top} className="w-3 h-3 bg-gray-400" />
            <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-500" />
        </div>
    );
});

export default PersonNode;
