import type { FC, ReactNode } from "react";

interface RoundedButtonProps {
    children: ReactNode;
    onClick: () => void;
    color?: "blue" | "green" | "red" | "gray";
}

const colors = {
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700",
    red: "bg-red-600 hover:bg-red-700",
    gray: "bg-gray-600 hover:bg-gray-700"
};

const RoundedButton: FC<RoundedButtonProps> = ({ children, onClick, color = "blue" }) => {
    return (
        <button
            onClick={onClick}
            className={`
                px-4 py-2 
                text-white text-sm 
                rounded-md shadow-md 
                transition-colors duration-150
                ${colors[color]}
            `}
        >
            {children}
        </button>
    );
};

export default RoundedButton;
