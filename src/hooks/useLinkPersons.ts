import { useCallback, useEffect, useState } from "react";
import type { Person } from "@/types/types";

export function useLinkPersons(onLink: (parent: Person, child: Person) => void) {
    const [isLinking, setIsLinking] = useState(false);
    const [selectedPersons, setSelectedPersons] = useState<Person[]>([]);

    const startLinking = () => {
        setSelectedPersons([]);
        setIsLinking(true);
        document.body.style.cursor = "crosshair";
    };

    const cancelLinking = () => {
        setSelectedPersons([]);
        setIsLinking(false);
        document.body.style.cursor = "default";
    };

    const selectPerson = useCallback(
        (p: Person) => {
            if (!isLinking) return;

            setSelectedPersons(prev => {
                const next = [...prev, p];

                if (next.length === 2) {
                    const [a, b] = next;

                    const older = a.birthDate! < b.birthDate! ? a : b;
                    const younger = a.birthDate! < b.birthDate! ? b : a;

                    onLink(older, younger);

                    setTimeout(() => cancelLinking(), 50);
                }

                return next;
            });
        },
        [isLinking, onLink]
    );

    useEffect(() => {
        return () => {
            document.body.style.cursor = "default";
        };
    }, []);

    return {
        isLinking,
        startLinking,
        cancelLinking,
        selectPerson,
        selectedPersons
    };
}
