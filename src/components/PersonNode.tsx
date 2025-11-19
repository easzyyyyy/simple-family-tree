import type { Person } from "@/types/types";

export interface PersonNodeProps extends Person {
    onRightClick?: (e: React.MouseEvent<HTMLDivElement>, person: Person) => void;
}

export default function PersonNode({ onRightClick, ...person }: PersonNodeProps) {
    return (
        <div
            onContextMenu={(e) => onRightClick?.(e, person)}
            className="p-3 rounded-lg border border-gray-300 bg-white w-52 shadow-md font-sans"
        >
            <div className="border-b border-gray-200 pb-1 mb-1">
                <strong className="text-base text-gray-800">
                    {person.firstName} {person.lastName}
                </strong>
            </div>

            <div className="text-xs text-gray-600 mb-1">
                {person.birthDate && (
                    <span>
                        Né(e) le <strong>{person.birthDate.toLocaleDateString("fr-FR")}</strong>
                        {person.birthPlace && <> à <strong>{person.birthPlace}</strong></>}
                    </span>
                )}
                {person.deathDate && (
                    <span>
                        <br />
                        Décédé(e) le <strong>{person.deathDate.toLocaleDateString("fr-FR")}</strong>
                        {person.deathPlace && <> à <strong>{person.deathPlace}</strong></>}
                    </span>
                )}
            </div>

            <div className="text-[11px] text-gray-500 italic">
                {person.description}
            </div>
        </div>
    );
}
