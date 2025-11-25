import type { PersonData } from '@/components/PersonNode.tsx';
import type { Connection } from '@xyflow/react';
import type { FamilyNodeType, FamilyEdgeType } from '@/types/familyTypes.ts';

import {
    addPerson,
    addLink
} from '@/utils/familyCrud.ts';

import initialData from '@/data/initialData.json';

/**
 * Generate a new unique integer ID based on current persons
 */
function generateNextPersonId(): string {
    const ids = initialData.persons
        .map((p: any) => Number(p.id))
        .filter((n: number) => !isNaN(n));

    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    return String(maxId + 1);
}

/**
 * Create handler for a new person
 */
export function createHandleAddPerson(
    setNodes: (fn: (n: FamilyNodeType[]) => FamilyNodeType[]) => void,
    setEdges: (fn: (e: FamilyEdgeType[]) => FamilyEdgeType[]) => void
) {
    return function handleAddPerson(data: PersonData) {
        const newId = generateNextPersonId();

        const result = addPerson({
            id: newId,
            firstName: data.firstName,
            lastName: data.lastName,
            birthDate: data.birthDate,
            deathDate: data.deathDate,
            birthPlace: data.birthPlace,
            deathPlace: data.deathPlace,
            description: data.description
        });

        setNodes(() => result.nodes);
        setEdges(() => result.edges);
    };
}

/**
 * Create handler for new connections
 */
export function createHandleConnect(
    setNodes: (fn: (n: FamilyNodeType[]) => FamilyNodeType[]) => void,
    setEdges: (fn: (e: FamilyEdgeType[]) => FamilyEdgeType[]) => void
) {
    return function handleConnect(connection: Connection) {
        if (!connection.source || !connection.target) {
            console.warn('Invalid connection, missing source or target');
            return;
        }

        const result = addLink(connection.source, connection.target);

        setNodes(() => result.nodes);
        setEdges(() => result.edges);
    };
}
