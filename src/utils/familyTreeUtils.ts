import type { Person, Couple } from '@/types/types';
import { config } from '@/config';
import type {CardLayout} from "@/hooks/useCardLayouts.ts";

// Calculate Y position based on birth date with fixed 10px per year
export function getY(date: Date, minYear: number) {
    return (date.getFullYear() - minYear) * 10 + config.pageMargin; // 10px per year
}

// Compute horizontal positions with children centered under parents
export function computePersonPositions(persons: Person[], couples: Couple[]): Map<string, number> {
    const positions = new Map<string, number>();
    const yPositions = new Map<string, number>();

    let currentX = 0;

    const personsMap = new Map<string, Person>();
    persons.forEach(p => personsMap.set(p.id, p));

    // Build a map: personId => hasChildren
    const hasChildren = new Map<string, boolean>();
    persons.forEach(p => hasChildren.set(p.id, false));
    couples.forEach(c => {
        c.parents.forEach(pid => hasChildren.set(pid, true));
    });

    couples.forEach(couple => {
        // Parents horizontal positions
        couple.parents.forEach((pid, i) => {
            positions.set(pid, currentX + i * config.spacingX);
            yPositions.set(pid, 0); // vertical handled elsewhere
        });

        // Children positions centered under parents
        const children = couple.children.map(cid => personsMap.get(cid)).filter(Boolean) as Person[];
        if (children.length > 0) {
            // Split children: without children vs with children
            const childrenWithNoKids = children.filter(c => !hasChildren.get(c.id));
            const childrenWithKids = children.filter(c => hasChildren.get(c.id));

            // Build final order: no-kids in center, others around
            const finalOrder: Person[] = [];
            const half = Math.ceil(childrenWithKids.length / 2);
            finalOrder.push(...childrenWithKids.slice(0, half));
            finalOrder.push(...childrenWithNoKids);
            finalOrder.push(...childrenWithKids.slice(half));

            const parentXs = couple.parents.map(pid => positions.get(pid) ?? 0);
            const centerX = (Math.min(...parentXs) + Math.max(...parentXs)) / 2;

            const totalWidth = (finalOrder.length - 1) * config.spacingX;
            finalOrder.forEach((child, i) => {
                positions.set(child.id, centerX - totalWidth / 2 + i * config.spacingX);
            });
        }

        // Update currentX to the rightmost card
        const maxParentX = Math.max(...couple.parents.map(pid => positions.get(pid) ?? 0));
        const maxChildrenX = children.length > 0 ? Math.max(...children.map(c => positions.get(c.id) ?? 0)) : 0;
        currentX = Math.max(maxParentX, maxChildrenX) + config.spacingX;
    });

    // Remaining persons not in couples
    persons.forEach(p => {
        if (!positions.has(p.id)) {
            positions.set(p.id, currentX);
            currentX += config.spacingX;
        }
    });

    // Ensure nothing is off the left edge
    const minX = Math.min(...Array.from(positions.values()));
    if (minX - config.cardWidth / 2 < config.pageMargin) {
        const shift = config.pageMargin + config.cardWidth / 2 - minX;
        positions.forEach((value, key) => {
            positions.set(key, value + shift);
        });
    }

    return positions;
}

// Get the tree container size
export function getContainerSize(getCardLayout: (id: string) => CardLayout | undefined, personIds: string[], pageMargin: number) {
    let maxX = 0;
    let maxY = 0;

    personIds.forEach(id => {
        const layout = getCardLayout(id);
        if (!layout) return;

        const right = layout.x + layout.width;
        const bottom = layout.y + layout.height;

        if (right > maxX) maxX = right;
        if (bottom > maxY) maxY = bottom;
    });

    return {
        width: maxX + pageMargin,
        height: maxY + pageMargin
    };
}
