import type { Person, Couple } from '@/types/types';
import { config } from '@/config';
import type {CardLayout} from "@/utils/useCardLayouts.ts";

// Calculate Y position based on birth date with fixed 10px per year
export function getY(date: Date, minYear: number) {
    return (date.getFullYear() - minYear) * 10 + config.pageMargin; // 10px per year
}

// Compute horizontal positions with children centered under parents
export function computePersonPositions(
    persons: Person[],
    couples: Couple[],
) {
    const positions = new Map<string, number>();
    let currentX = 0;

    const personsMap = new Map<string, Person>();
    persons.forEach(p => personsMap.set(p.id, p));

    // get a sample cardWidth (assuming all cards same width)
    const cardWidth = config.cardWidth;
    const pageMargin = config.pageMargin;

    couples.forEach((couple: Couple) => {
        // Parents positions
        couple.parents.forEach((pid, i) => {
            positions.set(pid, currentX + i * config.spacingX);
        });

        // Children positions centered under parents
        const children = couple.children.map(cid => personsMap.get(cid)).filter(Boolean) as Person[];
        if (children.length > 0) {
            const parentXs = couple.parents.map(pid => positions.get(pid) ?? 0);
            const centerX = (Math.min(...parentXs) + Math.max(...parentXs)) / 2;

            const totalWidth = (children.length - 1) * config.spacingX;
            children.forEach((child, i) => {
                const xChild = centerX - totalWidth / 2 + i * config.spacingX;
                positions.set(child.id, xChild);
            });
        }

        // Update currentX for next couple
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

    // Ensure nothing is off the left edge, accounting for card centering
    const minX = Math.min(...Array.from(positions.values()));
    if (minX - cardWidth / 2 < pageMargin) {
        const shift = pageMargin + cardWidth / 2 - minX;
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
