import '@/App.css';
import type { Person } from '@/types/types';
import { useEffect, useRef, useState } from 'react';

import { getFamilyData } from '@/utils/getFamilyData';
import { computePersonPositions, getContainerSize, getY } from '@/utils/familyTreeUtils';
import { useCardLayouts} from '@/utils/useCardLayouts';
import { getFamilyTreeLines } from '@/utils/familyTreeLines';

import PersonNode from '@/components/PersonNode';
import AddPersonModal from '@/components/AddPersonModal';
import {config} from "@/config.ts";

export default function App() {
    const { persons: initialPersons, couples } = getFamilyData();

    const [persons, setPersons] = useState<Person[]>(initialPersons);
    const [personPositions, setPersonPositions] = useState<Map<string, number>>(new Map());
    const [modalOpen, setModalOpen] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    // TODO: Clean all the personPositions, lines calculus
    useEffect(() => {
        setPersonPositions(computePersonPositions(persons, couples));
    }, [persons]);

    const { registerRef, getCardLayout } = useCardLayouts(personPositions, containerRef);

    const lines = getFamilyTreeLines({ couples, getCardLayout });

    const handleAddPerson = (person: Person) => {
        setPersons(prev => [...prev, person]);
    };

    const personsWithDate = persons.filter(p => p.birthDate);
    const minYear = Math.min(...personsWithDate.map(p => p.birthDate!.getFullYear()));
    const containerSize = getContainerSize(getCardLayout, personsWithDate.map(p => p.id), config.pageMargin);

    return (
        <div className="w-screen h-screen bg-gray-100 overflow-auto relative">
            <button
                onClick={() => setModalOpen(true)}
                className="fixed top-4 right-4 z-50 px-4 py-2 bg-blue-600 text-white rounded-md shadow-md"
            >
                Ajouter une personne
            </button>

            <AddPersonModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleAddPerson}
            />

            <div ref={containerRef} className="relative" style={{
                width: containerSize.width,
                height: containerSize.height
            }}>
                {personsWithDate.map(p => (
                    <div
                        key={p.id}
                        ref={el => registerRef(p.id, el)}
                        className="absolute -translate-x-1/2"
                        style={{
                            top: getY(p.birthDate!, minYear),
                            left: personPositions.get(p.id)
                        }}
                    >
                        <PersonNode {...p} />
                    </div>
                ))}

                {lines}
            </div>
        </div>
    );
}
