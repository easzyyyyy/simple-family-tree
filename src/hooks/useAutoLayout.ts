import { useCallback, useLayoutEffect } from 'react';
import { useReactFlow } from '@xyflow/react';
import ELK from 'elkjs/lib/elk.bundled.js';

const elk = new ELK();

// ELK layout options
const elkOptions = {
    'elk.direction': 'DOWN',
    'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
    'elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED',
    'elk.layered.spacing.edgeNodeBetweenLayers': '30',
};

interface UseAutoLayoutOptions {
    padding?: number;
}

/**
 * Hook: Automatically lays out nodes using ELK after first render
 */
export function useAutoLayout({ padding = 0.2 }: UseAutoLayoutOptions = {}) {
    const { getNodes, getEdges, setNodes, setEdges, fitView } = useReactFlow();

    const updateLayout = useCallback(async () => {
        const nodes = getNodes();
        const edges = getEdges();

        // Only layout nodes that have measured dimensions
        if (nodes.length === 0 || !nodes.every(n => n.data?.width && n.data?.height)) return;

        const elkGraph = {
            id: 'root',
            layoutOptions: elkOptions,
            children: nodes.map(node => ({
                id: node.id,
                width: Number(node.data?.width),
                height: Number(node.data?.height),
            })),
            edges: edges.map(edge => ({
                id: edge.id,
                sources: [edge.source],
                targets: [edge.target],
            })),
        };

        const layout = await elk.layout(elkGraph);

        const positionedNodes = nodes.map(node => {
            const layoutNode = layout.children?.find(n => n.id === node.id);
            return layoutNode
                ? { ...node, position: { x: layoutNode.x ?? 0, y: layoutNode.y ?? 0 } }
                : node;
        });

        setNodes(positionedNodes);
        setEdges(edges);
        fitView({ padding });
    }, [getNodes, getEdges, setNodes, setEdges, fitView, padding]);

    useLayoutEffect(() => {
        // Small delay to ensure nodes have been rendered and measured
        const timer = setTimeout(() => updateLayout(), 50);
        return () => clearTimeout(timer);
    }, [updateLayout]);
}
