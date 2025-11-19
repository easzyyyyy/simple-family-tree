import { useCallback, useMemo } from 'react';
import ReactFlow, {
    addEdge,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    MarkerType,
    type Node,           // Type for Nodes
    type Edge,           // Type for Edges
    type Connection,     // Type for Connection params
    type NodeTypes       // Type for nodeTypes object
} from 'reactflow';
import 'reactflow/dist/style.css';

// Import component and the Type we defined
import PersonNode, { type PersonData } from '@/components/PersonNode';

// Initial Data typed as Node<PersonData>
const initialNodes: Node<PersonData>[] = [
    { id: '1', type: 'person', position: { x: 250, y: 0 }, data: { label: 'Grandfather', gender: 'M', date: '1950' } },
    { id: '2', type: 'person', position: { x: 250, y: 200 }, data: { label: 'Mom', gender: 'F', date: '1980' } },
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#2563eb' } }
];

export default function App() {
    // Generic types <PersonData> added to useNodesState
    const [nodes, setNodes, onNodesChange] = useNodesState<PersonData>(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // FIX: useMemo prevents the "new nodeTypes object" warning
    // It ensures the object reference stays the same across renders
    const nodeTypes: NodeTypes = useMemo(() => ({
        person: PersonNode,
    }), []);

    // Function to handle connections (Parent -> Child)
    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge({
            ...params,
            animated: true,
            style: { stroke: '#2563eb', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#2563eb' },
        }, eds)),
        [setEdges],
    );

    // Function to add a new person node
    const addPerson = () => {
        const id = Math.random().toString();
        const newNode: Node<PersonData> = {
            id,
            type: 'person',
            position: { x: Math.random() * 400, y: Math.random() * 400 },
            data: {
                label: 'New Member',
                gender: Math.random() > 0.5 ? 'M' : 'F',
                date: '????'
            },
        };
        setNodes((nds) => nds.concat(newNode));
    };

    return (
        <div className="h-screen w-full bg-gray-50 flex flex-col">

            {/* Toolbar */}
            <div className="p-4 bg-white shadow-sm border-b flex justify-between items-center z-10">
                <h1 className="text-xl font-bold text-gray-700">🌳 Family Tree Editor</h1>
                <button
                    onClick={addPerson}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
                >
                    + Add Person
                </button>
            </div>

            {/* Drawing Canvas */}
            <div className="flex-grow">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    fitView
                >
                    <Background color="#aaa" gap={16} />
                    <Controls />
                    <MiniMap nodeColor="#e2e8f0" maskColor="rgba(0,0,0, 0.1)" />
                </ReactFlow>
            </div>
        </div>
    );
}
