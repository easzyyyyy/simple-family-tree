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

import PersonNode, { type PersonNodeType, type PersonData } from './components/PersonNode';
import AddPersonModal from './components/AddPersonModal';
import initialData from '@/data/initialData.json';

/**
 * The main flow logic component.
 * Must be wrapped in ReactFlowProvider to use the useReactFlow hook.
 */
function Flow() {
    // State management
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

    // useReactFlow hook allows us to convert screen coordinates to flow coordinates
    const { screenToFlowPosition } = useReactFlow();

    // Register custom node types
    const nodeTypes = useMemo(() => ({ person: PersonNode }), []);

    // Callbacks for React Flow events
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

    // Handler to create a new person node
    const handleAddPerson = (data: PersonData) => {
        const id = `person-${Date.now()}`;

        // Calculate the position so the node appears in the center of the user's view.
        // We project the center of the window (screen) to the Flow's coordinate system.
        const position = screenToFlowPosition({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
        });

        // Create the new node object
        const newNode: PersonNodeType = {
            id,
            type: 'person',
            position,
            data: data,
        };

        setNodes((nds) => nds.concat(newNode));
    };

    return (
        <>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                {/* Control Panel positioned at the top right */}
                <Panel position="top-right">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        // Tailwind classes for styling: shadow, emerald background/hover, white text, padding, rounded corners, and focus ring.
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
                </Panel>
            </ReactFlow>

            {/* Modal for data entry */}
            <AddPersonModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddPerson}
            />
        </>
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
