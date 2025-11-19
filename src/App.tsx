import { useState, useCallback, useMemo } from 'react';
import {
    ReactFlow,
    ReactFlowProvider, // Required to access the internal ReactFlow state (viewport, zoom, etc.)
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    Panel, // UI component to overlay buttons on top of the canvas
    useReactFlow, // Hook to interact with the flow instance
    type Edge,
    type OnNodesChange,
    type OnEdgesChange,
    type OnConnect,
    type NodeChange,
    type EdgeChange,
    type Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import '@/App.css'
import { useRef } from 'react';

import PersonNode, { type PersonNodeType, type PersonData } from './components/PersonNode';
import AddPersonModal from './components/AddPersonModal';
import initialData from '@/data/initialData.json';
import {exportFlowToPDF} from "@/utils/exportFlowPDF.ts";

/**
 * The main flow logic component.
 * Must be wrapped in ReactFlowProvider to use the useReactFlow hook.
 */
function Flow() {
    const [nodes, setNodes] = useState<PersonNodeType[]>(
        initialData.nodes.map(node => ({
            ...node,
            type: "person",
            data: {
                ...node.data,
                birthDate: new Date(node.data.birthDate),
                deathDate: node.data.deathDate ? new Date(node.data.deathDate) : undefined
            }
        }))
    );
    const [edges, setEdges] = useState<Edge[]>(initialData.edges as Edge[]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { screenToFlowPosition } = useReactFlow();
    const nodeTypes = useMemo(() => ({ person: PersonNode }), []);
    const flowWrapperRef = useRef<HTMLDivElement>(null); // Ref for PDF export

    const onNodesChange: OnNodesChange<PersonNodeType> = useCallback(
        (changes: NodeChange<PersonNodeType>[]) =>
            setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [],
    );

    const onEdgesChange: OnEdgesChange = useCallback(
        (changes: EdgeChange[]) =>
            setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [],
    );

    const onConnect: OnConnect = useCallback(
        (params: Connection) =>
            setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        [],
    );

    const handleAddPerson = (data: PersonData) => {
        const id = `person-${Date.now()}`;
        const position = screenToFlowPosition({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
        });

        const newNode: PersonNodeType = {
            id,
            type: 'person',
            position,
            data: data,
        };

        setNodes((nds) => nds.concat(newNode));
    };

    // Export React Flow to PDF
    const handleExportPDF = () => {
        exportFlowToPDF(nodes, edges, 'mon-graph.pdf');
    };

    return (
        <div ref={flowWrapperRef} className="w-full h-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                <Panel position="top-right">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="
                            shadow-md
                            bg-emerald-500 hover:bg-emerald-600
                            text-white
                            font-semibold
                            py-2 px-4
                            text-base
                            rounded-lg
                            border-none
                            cursor-pointer
                            transition duration-150 ease-in-out
                            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50
                        "
                    >
                        + Ajouter une personne
                    </button>

                    <button
                        onClick={handleExportPDF}
                        className="
                            ml-2
                            shadow-md
                            bg-blue-500 hover:bg-blue-600
                            text-white
                            font-semibold
                            py-2 px-4
                            text-base
                            rounded-lg
                            border-none
                            cursor-pointer
                            transition duration-150 ease-in-out
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                        "
                    >
                        Export PDF
                    </button>
                </Panel>
            </ReactFlow>

            <AddPersonModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddPerson}
            />
        </div>
    );
}

// The root App component wraps the Flow in the Provider
export default function App() {
    return (
        <div className="w-screen h-screen bg-gray-100">
            <ReactFlowProvider>
                <Flow />
            </ReactFlowProvider>
        </div>
    );
}
