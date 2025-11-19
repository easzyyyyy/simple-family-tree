import '@/App.css';
import { getFamilyData } from '@/utils/getFamilyData';
import PersonNode from '@/components/PersonNode';
import { useMemo } from 'react';
import { config } from '@/config';
import { getY, computePersonPositions } from '@/utils/familyTreeUtils';
import { useCardLayouts } from '@/utils/useCardLayouts';
import {getFamilyTreeLines} from "@/utils/familyTreeLines.tsx";

export default function App() {
    const { persons, couples } = getFamilyData();
    const { registerRef, getCardLayout } = useCardLayouts();

    const personsWithDate = persons.filter(p => p.birthDate);
    const minDate = new Date(Math.min(...personsWithDate.map(p => p.birthDate!.getTime())));
    const maxDate = new Date(Math.max(...personsWithDate.map(p => p.birthDate!.getTime())));
    const personPositions = useMemo(() => computePersonPositions(persons, couples), [persons, couples]);

    return (
        <div className="w-screen h-screen bg-gray-100 overflow-auto relative">
            <div className="relative w-full" style={{ height: config.timelineHeight }}>
                {/* Render nodes */}
                {personsWithDate.map(p => (
                    <div
                        key={p.id}
                        ref={el => registerRef(p.id, el)}
                        className="absolute -translate-x-1/2"
                        style={{ top: getY(p.birthDate!, minDate, maxDate, config.timelineHeight), left: personPositions.get(p.id) }}
                    >
                        <PersonNode {...p} />
                    </div>
                ))}

                {/* Render all lines */}
                {getFamilyTreeLines({ couples, getCardLayout })}
            </div>
        </div>
    );
}
