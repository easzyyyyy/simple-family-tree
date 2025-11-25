import type {PersonNodeType} from "@/components/PersonNode.tsx";
import type {PseudoNodeType} from "@/components/PseudoNode.tsx";


export type FamilyNodeType = PersonNodeType | PseudoNodeType;

/**
 * FamilyEdgeType
 * Edge type for React Flow
 * Connects either:
 *  - a person to a couple (parent → couple)
 *  - a couple to a person (couple → child)
 */
export interface FamilyEdgeType {
    id: string;
    source: string;
    target: string;
}
