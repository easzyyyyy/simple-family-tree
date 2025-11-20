import { useState, useCallback, useRef, useMemo, useLayoutEffect } from 'react';
import {
    ReactFlow,
    ReactFlowProvider,
    addEdge,
    Panel,
    Background,
    useNodesState,
    useEdgesState,
    useReactFlow,
    type OnConnect,
    type Connection, ConnectionLineType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import '@/App.css';

import ELK from 'elkjs/lib/elk.bundled.js';

import PersonNode, { type PersonNodeType, type PersonData } from './components/PersonNode';
import AddPersonModal from './components/AddPersonModal';
import initialData from '@/data/initialData.json';
import { exportFlowToPDF } from '@/utils/exportFlowPDF.ts';

const elk = new ELK();

// ELK options for layered layout with orthogonal edges
const elkOptions = {
    'elk.algorithm': 'layered',
    'elk.direction': 'DOWN',
    'elk.layered.spacing.nodeNodeBetweenLayers': '120',
    'elk.spacing.nodeNode': '100',
    'elk.edgeRouting': 'ORTHOGONAL',
    'elk.layered.edgeRouting': 'ORTHOGONAL',
    'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX'
};

// Layout nodes and edges with ELK
const getLayoutedElements = async (nodes: PersonNodeType[], edges: any[]) => {
    const graph = {
        id: 'root',
        layoutOptions: elkOptions,
        children: nodes.map((node) => ({
            ...node,
            width: 220,
            height: 90,
        })),
        edges: edges.map((e) => ({ ...e, routingPoints: [] })),
    };

    const layout = await elk.layout(graph);

    return {
        nodes: layout.children.map((n) => ({
            ...n,
            position: { x: n.x, y: n.y },
        })),
        edges: layout.edges,
    };
};

function Flow() {
    const [nodes, setNodes, onNodesChange] = useNodesState(
        initialData.nodes.map((node) => ({
            ...node,
            type: 'person',
            birthDate: node.birthDate ? new Date(node.birthDate) : undefined,
            deathDate: node.deathDate ? new Date(node.deathDate) : undefined,
            birthPlace: node.birthPlace ?? undefined,
            deathPlace: node.deathPlace ?? undefined,
            firstName: node.firstName ?? undefined,
            lastName: node.lastName ?? undefined,
            description: node.description ?? undefined,
        }))
    );

    const [edges, setEdges, onEdgesChange] = useEdgesState(initialData.edges as any[]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const flowWrapperRef = useRef<HTMLDivElement>(null);
    const { screenToFlowPosition, fitView } = useReactFlow();

    const nodeTypes = useMemo(() => ({ person: PersonNode }), []);

    // Recalculate layout on mount
    useLayoutEffect(() => {
        getLayoutedElements(nodes, edges).then(({ nodes: layoutedNodes, edges: layoutedEdges }) => {
            setNodes(layoutedNodes);
            setEdges(layoutedEdges);
            fitView();
        });
    }, []);

    const onConnect: OnConnect = useCallback(
        async (params: Connection) => {
            const newEdges = addEdge({ ...params, type: 'step' }, edges);
            const { nodes: layoutedNodes, edges: layoutedEdges } = await getLayoutedElements(nodes, newEdges);
            setNodes(layoutedNodes);
            setEdges(layoutedEdges);
            fitView();
        },
        [nodes, edges]
    );

    const handleAddPerson = useCallback(
        async (data: PersonData) => {
            const id = `person-${Date.now()}`;
            const position = screenToFlowPosition({
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
            });

            const newNode: PersonNodeType = {
                id,
                type: 'person',
                position,
                data,
            };

            const updatedNodes = [...nodes, newNode];
            const { nodes: layoutedNodes, edges: layoutedEdges } = await getLayoutedElements(updatedNodes, edges);

            setNodes(layoutedNodes);
            setEdges(layoutedEdges);
            fitView();
        },
        [nodes, edges]
    );

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
                connectionLineType={ConnectionLineType.Step}
                defaultEdgeOptions={{ type: 'step' }}
                nodesDraggable={false}
                fitView
            >
                <Panel position="top-right">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="shadow-md bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 text-base rounded-lg border-none cursor-pointer transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
                    >
                        + Ajouter une personne
                    </button>

                    <button
                        onClick={handleExportPDF}
                        className="ml-2 shadow-md bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 text-base rounded-lg border-none cursor-pointer transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Export PDF
                    </button>
                </Panel>
                <Background />
            </ReactFlow>

            <AddPersonModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddPerson} />
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
