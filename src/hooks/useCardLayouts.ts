import { useRef, useState, useEffect } from 'react';

export interface CardLayout {
    x: number;
    y: number;
    width: number;
    height: number;
}

export function useCardLayouts(
    personPositions: Map<string, number>,
    containerRef: React.RefObject<HTMLElement | null>,
){
    const refs = useRef<Map<string, HTMLDivElement>>(new Map());
    const [layouts, setLayouts] = useState<Map<string, CardLayout>>(new Map());

    const registerRef = (id: string, el: HTMLDivElement | null) => {
        if (el) refs.current.set(id, el);
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        const newLayouts = new Map<string, CardLayout>();

        refs.current.forEach((el, id) => {
            const rect = el.getBoundingClientRect();

            newLayouts.set(id, {
                x: rect.left - containerRect.left,
                y: rect.top - containerRect.top,
                width: rect.width,
                height: rect.height
            });
        });

        setLayouts(newLayouts);
    }, [personPositions]);

    const getCardLayout = (id: string) => layouts.get(id);

    return { registerRef, getCardLayout };
}
