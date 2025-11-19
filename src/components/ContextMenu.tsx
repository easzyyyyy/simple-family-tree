import {type FC, useEffect, useRef } from "react";
import type { Person } from "@/types/types";

interface ContextMenuProps {
    person: Person;
    x: number;
    y: number;
    onAddParent: (person: Person) => void;
    onClose: () => void;
}

const ContextMenu: FC<ContextMenuProps> = ({ person, x, y, onAddParent, onClose }) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!menuRef.current) return;
            if (!menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("keydown", handleEscape);
        };
    }, [onClose]);

    return (
        <div
            ref={menuRef}
            className="absolute bg-white border border-gray-300 shadow-md rounded z-50"
            style={{ top: y, left: x }}
        >
            <button
                onClick={() => { onAddParent(person); onClose(); }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
            >
                Ajouter un parent
            </button>
        </div>
    );
};

export default ContextMenu;
