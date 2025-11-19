import type { FamilyData } from '@/types/types.ts';
import rawData from '@/data/initialData.json';

// Convert string dates to Date objects
function parsePersonDates(person: any) {
    return {
        ...person,
        birthDate: person.birthDate ? new Date(person.birthDate) : undefined,
        deathDate: person.deathDate ? new Date(person.deathDate) : undefined
    };
}

// Return typed family data
export function getFamilyData(): FamilyData {
    const persons = rawData.persons.map(parsePersonDates);
    const couples = rawData.couples;
    return { persons, couples };
}
