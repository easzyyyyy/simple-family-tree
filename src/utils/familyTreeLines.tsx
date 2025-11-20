import type { Couple } from '@/types/types';
import type { CardLayout } from "@/hooks/useCardLayouts.ts";
import type { JSX } from "react";

interface LineProps {
    couples: Couple[];
    getCardLayout: (id: string) => CardLayout | undefined;
}

/**
 * Generate JSX lines for parents, children, and vertical connectors.
 * Ensures all widths/heights are positive and connectors adapt if inverted.
 */
export function getFamilyTreeLines({ couples, getCardLayout }: LineProps) {
    const lines: JSX.Element[] = [];

    couples.forEach(couple => {
        // Get layouts for parents and children
        const parents = couple.parents.map(pid => getCardLayout(pid)).filter(Boolean);
        const children = couple.children.map(cid => getCardLayout(cid)).filter(Boolean);
        if (!parents.length) return;
        if (!children.length) return;

        // -------------------------------
        // PARENT VERTICAL LINES
        // -------------------------------
        const parentMaxY = Math.max(...parents.map(p => p!.y + p!.height)) + 20;
        parents.forEach((p, i) => {
            lines.push(
                <div
                    key={`pv-${couple.id}-${couple.parents[i]}-${i}`}
                    className="absolute bg-gray-400"
                    style={{
                        left: p!.x + p!.width / 2,
                        top: p!.y + p!.height,
                        width: 2,
                        height: parentMaxY - (p!.y + p!.height)
                    }}
                />
            );
        });

        // -------------------------------
        // PARENT HORIZONTAL LINE
        // -------------------------------
        if (parents.length >= 2) {
            const leftX = Math.min(
                parents[0]!.x + parents[0]!.width / 2,
                parents[parents.length - 1]!.x + parents[parents.length - 1]!.width / 2
            );
            const rightX = Math.max(
                parents[0]!.x + parents[0]!.width / 2,
                parents[parents.length - 1]!.x + parents[parents.length - 1]!.width / 2
            );

            lines.push(
                <div
                    key={`ph-${couple.id}`}
                    className="absolute bg-gray-400"
                    style={{
                        left: leftX,
                        top: parentMaxY,
                        width: rightX - leftX,
                        height: 2
                    }}
                />
            );
        }

        // -------------------------------
        // CHILD VERTICAL LINES
        // -------------------------------
        const childMinY = Math.min(...children.map(c => c!.y)) - 20;
        children.forEach((c, i) => {
            lines.push(
                <div
                    key={`cv-${couple.id}-${couple.children[i]}-${i}`}
                    className="absolute bg-gray-400"
                    style={{
                        left: c!.x + c!.width / 2,
                        top: childMinY,
                        width: 2,
                        height: c!.y - childMinY
                    }}
                />
            );
        });

        // -------------------------------
        // CHILD HORIZONTAL LINE
        // -------------------------------
        const childLeftX = Math.min(
            children[0]!.x + children[0]!.width / 2,
            children[children.length - 1]!.x + children[children.length - 1]!.width / 2
        );
        const childRightX = Math.max(
            children[0]!.x + children[0]!.width / 2,
            children[children.length - 1]!.x + children[children.length - 1]!.width / 2
        );

        lines.push(
            <div
                key={`ch-${couple.id}`}
                className="absolute bg-gray-400"
                style={{
                    left: childLeftX,
                    top: childMinY,
                    width: childRightX - childLeftX,
                    height: 2
                }}
            />
        );

        // -------------------------------
        // VERTICAL CONNECTOR BETWEEN PARENTS AND CHILDREN
        // -------------------------------
        const parentCenterX = (parents[0]!.x + parents[0]!.width / 2 + parents[parents.length - 1]!.x + parents[parents.length - 1]!.width / 2) / 2;
        const childCenterX = (children[0]!.x + children[0]!.width / 2 + children[children.length - 1]!.x + children[children.length - 1]!.width / 2) / 2;
        const connectorX = (parentCenterX + childCenterX) / 2;

        const topY = Math.min(parentMaxY, childMinY);
        const bottomY = Math.max(parentMaxY, childMinY);

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
