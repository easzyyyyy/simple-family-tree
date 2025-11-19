import { useRef, useState, useEffect } from 'react';

export interface CardLayout {
    x: number;
    y: number;
    width: number;
    height: number;
}

export function useCardLayouts(): {
    registerRef: (id: string, el: HTMLDivElement | null) => void;
    getCardLayout: (id: string) => CardLayout | undefined;
} {
    const refs = useRef<Map<string, HTMLDivElement>>(new Map());
    const [layouts, setLayouts] = useState<Map<string, CardLayout>>(new Map());

    const registerRef = (id: string, el: HTMLDivElement | null) => {
        if (el) refs.current.set(id, el);
    };

    useEffect(() => {
        const newLayouts = new Map<string, CardLayout>();
        refs.current.forEach((el, id) => {
            const rect = el.getBoundingClientRect();
            newLayouts.set(id, {
                x: rect.left + window.scrollX,
                y: rect.top + window.scrollY,
                width: rect.width,
                height: rect.height
            });
        });
        setLayouts(newLayouts);
    }, [refs.current]);

    const getCardLayout = (id: string) => layouts.get(id);

    return { registerRef, getCardLayout };
}
