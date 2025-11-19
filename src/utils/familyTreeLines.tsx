import type { Couple } from '@/types/types';
import type {CardLayout} from "@/utils/useCardLayouts.ts";
import type {JSX} from "react";

interface LineProps {
    couples: Couple[];
    getCardLayout: (id: string) => CardLayout | undefined;
}

/**
 * Generate JSX lines for parents, children, and vertical connectors.
 */
export function getFamilyTreeLines({ couples, getCardLayout }: LineProps) {
    const lines: JSX.Element[] = [];

    couples.forEach(couple => {
        const parents = couple.parents.map(pid => getCardLayout(pid)).filter(Boolean);
        const children = couple.children.map(cid => getCardLayout(cid)).filter(Boolean);

        if (!parents.length) return;

        // Parent verticals
        const parentMaxY = Math.max(...parents.map(p => p!.y + p!.height)) + 20;
        parents.forEach((p, i) =>
            lines.push(
                <div
                    key={`pv-${couple.parents[i]}`}
                    className="absolute bg-gray-400"
                    style={{
                        left: p!.x + p!.width / 2,
                        top: p!.y + p!.height,
                        width: 2,
                        height: parentMaxY - (p!.y + p!.height)
                    }}
                />
            )
        );

        // Parent horizontal
        if (parents.length >= 2) {
            lines.push(
                <div
                    key={`ph-${couple.id}`}
                    className="absolute bg-gray-400"
                    style={{
                        left: parents[0]!.x + parents[0]!.width / 2,
                        top: parentMaxY,
                        width:
                            parents[parents.length - 1]!.x +
                            parents[parents.length - 1]!.width / 2 -
                            (parents[0]!.x + parents[0]!.width / 2) +
                            2,
                        height: 2
                    }}
                />
            );
        }

        if (!children.length) return;

        // Child verticals
        const childMinY = Math.min(...children.map(c => c!.y)) - 20;
        children.forEach((c, i) =>
            lines.push(
                <div
                    key={`cv-${couple.children[i]}`}
                    className="absolute bg-gray-400"
                    style={{
                        left: c!.x + c!.width / 2,
                        top: childMinY,
                        width: 2,
                        height: c!.y - childMinY
                    }}
                />
            )
        );

        // Child horizontal
        lines.push(
            <div
                key={`ch-${couple.id}`}
                className="absolute bg-gray-400"
                style={{
                    left: children[0]!.x + children[0]!.width / 2,
                    top: childMinY,
                    width:
                        children[children.length - 1]!.x +
                        children[children.length - 1]!.width / 2 -
                        (children[0]!.x + children[0]!.width / 2),
                    height: 2
                }}
            />
        );

        // Vertical connector between parent and children lines
        const parentCenterX = (parents[0]!.x + parents[0]!.width / 2 + parents[parents.length - 1]!.x + parents[parents.length - 1]!.width / 2) / 2;
        const childCenterX = (children[0]!.x + children[0]!.width / 2 + children[children.length - 1]!.x + children[children.length - 1]!.width / 2) / 2;
        const topY = Math.min(parentMaxY, childMinY);
        const bottomY = Math.max(parentMaxY, childMinY);
        const connectorX = (parentCenterX + childCenterX) / 2;

        lines.push(
            <div
                key={`v-connector-${couple.id}`}
                className="absolute bg-gray-400"
                style={{
                    left: connectorX,
                    top: topY,
                    width: 2,
                    height: bottomY - topY
                }}
            />
        );

    });

    return lines;
}
