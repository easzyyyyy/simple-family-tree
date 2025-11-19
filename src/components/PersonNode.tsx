import type {Person} from "@/types/types.ts";

// Custom node component for a single person
export default function PersonNode(person: Person) {
    return (
        <div className="p-3 rounded-lg border border-gray-300 bg-white w-52 shadow-md font-sans">
            {/* Person name */}
            <div className="border-b border-gray-200 pb-1 mb-1">
                <strong className="text-base text-gray-800">
                    {person.firstName} {person.lastName}
                </strong>
            </div>

            {/* Birth and death info */}
            <div className="text-xs text-gray-600 mb-1">
                {person.birthDate && (
                    <span>
                        Born <strong>{person.birthDate.toLocaleDateString('fr-FR')}</strong>
                        {person.birthPlace && <> at <strong>{person.birthPlace}</strong></>}
                    </span>
                )}
                {person.deathDate && (
                    <span>
                        <br />
                        Died <strong>{person.deathDate.toLocaleDateString('fr-FR')}</strong>
                        {person.deathPlace && <> at <strong>{person.deathPlace}</strong></>}
                    </span>
                )}
            </div>

            {/* Description */}
            <div className="text-[11px] text-gray-500 italic">
                {person.description}
            </div>
        </div>
    );
}
