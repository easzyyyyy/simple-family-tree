import type { Person } from "@/types/types";

export interface PersonNodeProps extends Person {
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    onRightClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    isLinking?: boolean;
    selected?: boolean;
}

export default function PersonNode({
   onRightClick,
   onClick,
   isLinking,
   selected,
   ...person
}: PersonNodeProps) {
    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                onClick?.(e);
            }}
            onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRightClick?.(e);
            }}
            className={`
                p-3 rounded-lg bg-white w-52 shadow-md font-sans
                border transition-colors duration-150
                ${selected ? "border-yellow-400" :
                isLinking ? "cursor-crosshair hover:border-green-500 border-gray-300" :
                    "border-gray-300"}
            `}
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
                    <>
                        <br />
                        Décédé(e) le <strong>{person.deathDate.toLocaleDateString("fr-FR")}</strong>
                        {person.deathPlace && <> à <strong>{person.deathPlace}</strong></>}
                    </>
                )}
            </div>

            <div className="text-[11px] text-gray-500 italic">
                {person.description}
            </div>
        </div>
    );
}
