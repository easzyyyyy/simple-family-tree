import initialData from '@/data/initialData.json';
import type {FamilyEdgeType, FamilyNodeType} from '@/types/familyTypes.ts';
import type {PersonNodeType} from "@/components/PersonNode.tsx";
import type {PseudoNodeType} from "@/components/PseudoNode.tsx";

/**
 * Convert raw JSON (persons + couples) into PersonNodeType[]
 * Couples will generate invisible pseudo-nodes for multiple parents
 */
export function loadNodes(): FamilyNodeType[] {
    const personNodes: PersonNodeType[] = initialData.persons.map((person: any) => ({
        id: person.id,
        type: 'person',
        data: {
            id: person.id,
            firstName: person.firstName,
            lastName: person.lastName,
            birthDate: person.birthDate ? new Date(person.birthDate) : undefined,
            deathDate: person.deathDate ? new Date(person.deathDate) : undefined,
            birthPlace: person.birthPlace,
            deathPlace: person.deathPlace,
            description: person.description
        },
        position: { x: 0, y: 0 },
    }));

    // Generate pseudo-nodes for couples
    const pseudoNodes: PseudoNodeType[] = initialData.couples.map((couple: any) => ({
        id: `pseudo-${couple.id}`,
        type: 'pseudo',
        data: { id: couple.id },
        position: { x: 0, y: 0 },
    }));

    return [...personNodes, ...pseudoNodes];
}

/**
 * Convert raw JSON (persons + couples) into edges
 * Generates edges: parent -> pseudo-node (couple) -> children
 */
export function loadEdges(): FamilyEdgeType[] {
    const edges: FamilyEdgeType[] = [];

    initialData.couples.forEach((couple: any) => {
        const pseudoId = `pseudo-${couple.id}`;

        // Connect each parent to the pseudo-node
        couple.partners.forEach((parentId: string) => {
            edges.push({
                id: `${parentId}-${pseudoId}`,
                source: parentId,
                target: pseudoId
            });
        });

        // Connect pseudo-node to each child
        couple.children.forEach((childId: string) => {
            edges.push({
                id: `${pseudoId}-${childId}`,
                source: pseudoId,
                target: childId
            });
        });
    });

    return edges;
}
