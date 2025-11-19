export interface Person {
    id: string;
    firstName?: string;
    lastName?: string;
    birthDate?: Date;
    birthPlace?: string;
    deathDate?: Date;
    deathPlace?: string;
    description?: string;
}

export interface Couple {
    id: string;
    parents: string[];
    children: string[];
}

export interface FamilyData {
    persons: Person[];
    couples: Couple[];
}
