// CRUD utilities for persons, couples (pseudo-nodes), nodes and edges
import initialData from '@/data/initialData.json';
import type { FamilyNodeType, FamilyEdgeType } from '@/types/familyTypes.ts';
import type { PersonNodeType } from '@/components/PersonNode.tsx';
import type { PseudoNodeType } from '@/components/PseudoNode.tsx';

let data = structuredClone(initialData);

/**
 * Rebuild nodes from current data state
 */
export function rebuildNodes(): FamilyNodeType[] {
    const personNodes: PersonNodeType[] = data.persons.map((p: any) => ({
        id: p.id,
        type: 'person',
        data: {
            id: p.id,
            firstName: p.firstName,
            lastName: p.lastName,
            birthDate: p.birthDate ? new Date(p.birthDate) : undefined,
            deathDate: p.deathDate ? new Date(p.deathDate) : undefined,
            birthPlace: p.birthPlace,
            deathPlace: p.deathPlace,
            description: p.description
        },
        position: { x: 0, y: 0 }
    }));

    const pseudoNodes: PseudoNodeType[] = data.couples.map((c: any) => ({
        id: `pseudo-${c.id}`,
        type: 'pseudo',
        data: { id: c.id },
        position: { x: 0, y: 0 }
    }));

    return [...personNodes, ...pseudoNodes];
}

/**
 * Rebuild edges from current data state
 */
export function rebuildEdges(): FamilyEdgeType[] {
    const edges: FamilyEdgeType[] = [];

    data.couples.forEach((couple: any) => {
        const pseudoId = `pseudo-${couple.id}`;

        // parents -> pseudo
        couple.partners.forEach((parentId: string) => {
            edges.push({
                id: `${parentId}-${pseudoId}`,
                source: parentId,
                target: pseudoId
            });
        });

        // pseudo -> children
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

/**
 * Add a new person
 */
export function addPerson(person: any) {
    // person object must contain an id
    data.persons.push(person);

    const result = {
        nodes: rebuildNodes(),
        edges: rebuildEdges()
    };

    saveData();

    return result;
}

/**
 * Generate next pseudo-node/couple ID
 * Format: c1, c2, c3...
 */
export function generateNextCoupleId(): string {
    const existing = data.couples.map((c: any) => c.id);
    let max = 0;

    existing.forEach(id => {
        const n = Number(id.replace(/^c/, ''));
        if (!isNaN(n) && n > max) max = n;
    });

    return `c${max + 1}`;
}

/**
 * Add a new parent-child link with automatic pseudo-node ID
 */
export function addLink(parentId: string, childId: string) {
    // Try to find if child already has a couple assigned
    let couple = data.couples.find((c: any) => c.children.includes(childId));

    if (couple) {
        // Child already has a pseudo-node, just add parent to existing couple
        if (!couple.partners.includes(parentId)) {
            couple.partners.push(parentId);
        }
    } else {
        // Create a new couple entry with one parent and one child
        const newCoupleId = generateNextCoupleId();

        data.couples.push({
            id: newCoupleId,
            partners: [parentId],
            children: [childId]
        });
    }

    const result = {
        nodes: rebuildNodes(),
        edges: rebuildEdges()
    };

    saveData();

    return result;
}

/**
 * Save current state in the format:
 * {
 *   persons: [...],
 *   couples: [...]
 * }
 * Saves to localStorage if available
 */
export function saveData() {
    // Update initialData in memory
    initialData.persons = structuredClone(data.persons);
    initialData.couples = structuredClone(data.couples);

    const jsonStr = JSON.stringify(
        {
            persons: initialData.persons,
            couples: initialData.couples
        },
        null,
        2
    );

    // Try saving in localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
        try {
            localStorage.setItem('familyData', jsonStr);
        } catch (e) {
            console.warn('LocalStorage not available, cannot persist data.', e);
        }
    }

    return jsonStr;
}

/**
 * Load external JSON data to replace in-memory structure
 * If a saved copy exists in localStorage, load that instead
 */
export function loadData(json?: any) {
    // Try loading from localStorage first
    if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem('familyData');
        if (saved) {
            try {
                data = JSON.parse(saved);
                return {
                    nodes: rebuildNodes(),
                    edges: rebuildEdges()
                };
            } catch (e) {
                console.warn('Failed to parse saved family data from localStorage', e);
            }
        }
    }

    // Fallback to provided JSON
    if (json) {
        data = structuredClone(json);
    } else {
        console.warn('No JSON provided and nothing in localStorage, using existing data.');
    }

    return {
        nodes: rebuildNodes(),
        edges: rebuildEdges()
    };
}
