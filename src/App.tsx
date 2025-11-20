import '@/App.css';
import type {Couple, Person} from '@/types/types';
import { useEffect, useRef, useState } from 'react';

import { getFamilyData } from '@/utils/getFamilyData';
import { computePersonPositions, getContainerSize, getY } from '@/utils/familyTreeUtils';
import { useCardLayouts} from '@/hooks/useCardLayouts.ts';
import { getFamilyTreeLines } from '@/utils/familyTreeLines';

import PersonNode from '@/components/PersonNode';
import AddPersonModal from '@/components/AddPersonModal';
import {config} from "@/config.ts";
import ContextMenu from "@/components/ContextMenu.tsx";
import {useLinkPersons} from "@/hooks/useLinkPersons.ts";

import RoundedButton from "@/components/RoundedButton";

export default function App() {
    const { persons: initialPersons, couples: initialCouples } = getFamilyData();

    const [persons, setPersons] = useState<Person[]>(initialPersons);
    const [couples, setCouples] = useState<Couple[]>(initialCouples);
    const [personPositions, setPersonPositions] = useState<Map<string, number>>(new Map());
    const [modalOpen, setModalOpen] = useState(false);
    const [contextMenu, setContextMenu] = useState<{ person: Person; x: number; y: number } | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);

    const { isLinking, startLinking, cancelLinking, selectPerson, selectedPersons } =
        useLinkPersons((parent, child) => {

            setCouples(prev => {
                // Check if this child already belongs to an existing couple
                const existing = prev.find(c => c.children.includes(child.id));

                // No existing parent → create a new single-parent couple
                if (!existing) {
                    return [
                        ...prev,
                        {
                            id: crypto.randomUUID(),
                            parents: [parent.id],
                            children: [child.id]
                        }
                    ];
                }

                // Child already has one parent → add the second parent if not already present
                if (!existing.parents.includes(parent.id)) {
                    return prev.map(c =>
                        c.id === existing.id
                            ? {
                                ...c,
                                parents: [...c.parents, parent.id]
                            }
                            : c
                    );
                }

                // No change needed (e.g. parent already registered)
                return prev;
            });
        });

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
            <div className="fixed top-4 right-4 z-50 flex gap-3">
                <RoundedButton
                    onClick={() => setModalOpen(true)}
                    color="blue"
                >
                    Ajouter une personne
                </RoundedButton>

                <RoundedButton
                    onClick={startLinking}
                    color="green"
                >
                    Lier deux personnes
                </RoundedButton>
            </div>

            <AddPersonModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleAddPerson}
            />

            <div
                ref={containerRef}
                className="relative"
                style={{
                    width: containerSize.width,
                    height: containerSize.height
                }}
                onClick={cancelLinking}
            >
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
                        <PersonNode
                            {...p}
                            isLinking={isLinking}
                            selected={selectedPersons.some(sel => sel.id === p.id)}
                            onClick={() => isLinking && selectPerson(p)}
                            onRightClick={(e) => {
                                e.preventDefault();
                                setContextMenu({ person: p, x: e.clientX, y: e.clientY });
                            }}
                        />
                    </div>
                ))}

                {lines}
            </div>

            {contextMenu && (
                <ContextMenu
                    person={contextMenu.person}
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onAddParent={(person: Person) => {
                        console.log("Ajouter un parent pour", person);
                    }}
                    onClose={() => setContextMenu(null)}
                />
            )}
        </div>
    );
}
