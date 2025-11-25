import {useState, useMemo} from 'react';
import {
    ReactFlow,
    ReactFlowProvider,
    Panel,
    Background,
    useNodesState,
    useEdgesState,
    ConnectionLineType, BackgroundVariant, Controls,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import '@/App.css';

import AddPersonModal from '@/components/AddPersonModal';
import PersonNode from "@/components/PersonNode.tsx";

import {
    type FamilyEdgeType,
    type FamilyNodeType
} from '@/types/familyTypes.ts';

import { loadEdges, loadNodes } from "@/utils/loadFamilyData.ts";
import PseudoNode from "@/components/PseudoNode.tsx";
import {useAutoLayout} from "@/hooks/useAutoLayout.ts";

const initialNodes = loadNodes();
const initialEdges = loadEdges();

function Flow() {
    const [nodes, , onNodesChange] = useNodesState<FamilyNodeType>(initialNodes);
    const [edges, , onEdgesChange] = useEdgesState<FamilyEdgeType>(initialEdges);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const nodeTypes = useMemo(() => ({
        person: PersonNode,
        pseudo: PseudoNode
    }), []);

    useAutoLayout();

    return (
        <div className="w-full h-full">
            <Panel position="top-right" className="flex flex-col gap-2">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="shadow-md bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 text-base rounded-lg border-none cursor-pointer transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
                >
                    + Add Person
                </button>
            </Panel>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                connectionLineType={ConnectionLineType.Step}
                defaultEdgeOptions={{ type: 'step' }}
                nodesDraggable={false}
                fitView
            >
                <Background variant={BackgroundVariant.Dots} />
                <Controls />
            </ReactFlow>

            <AddPersonModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={() => console.log('Add Person')}
            />
        </div>
    );
}

export default function App() {
    return (
        <div className="w-screen h-screen bg-gray-100">
            <ReactFlowProvider>
                <Flow />
            </ReactFlowProvider>
        </div>
    );
}
