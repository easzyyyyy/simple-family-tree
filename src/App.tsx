import { useState, useMemo } from 'react';
import {
    ReactFlow,
    ReactFlowProvider,
    Panel,
    Background,
    useNodesState,
    useEdgesState,
    ConnectionLineType,
    BackgroundVariant,
    Controls,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import '@/App.css';

import AddPersonModal from '@/components/AddPersonModal';
import PersonNode from "@/components/PersonNode.tsx";
import PseudoNode from "@/components/PseudoNode.tsx";

import { useAutoLayout } from "@/hooks/useAutoLayout.ts";
import { createHandleAddPerson, createHandleConnect } from "@/utils/graphHandlers.ts";

import jsonData from '@/data/initialData.json';
import { loadData } from "@/utils/familyCrud.ts";

const initialData = loadData(jsonData);

function Flow() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialData.nodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialData.edges);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const nodeTypes = useMemo(() => ({
        person: PersonNode,
        pseudo: PseudoNode,
    }), []);

    const handleAddPerson = createHandleAddPerson(setNodes, setEdges);
    const handleConnect = createHandleConnect(setNodes, setEdges);

    useAutoLayout();

    return (
        <div className="w-full h-full">
            <Panel position="top-right" className="flex flex-col gap-2">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="shadow-md bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 text-base rounded-lg"
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
                onConnect={handleConnect}
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
                onSubmit={handleAddPerson}
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
