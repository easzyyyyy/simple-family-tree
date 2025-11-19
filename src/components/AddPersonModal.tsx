import React, { useState } from "react";
import type { Person } from "@/types/types";

interface AddPersonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Person) => void;
}

export default function AddPersonModal({ isOpen, onClose, onSubmit }: AddPersonModalProps) {
    const [formData, setFormData] = useState<Person>({
        id: "", // generate id in App on submit
        firstName: "",
        lastName: "",
        birthDate: new Date(),
        deathDate: undefined,
        birthPlace: "",
        deathPlace: "",
        description: ""
    });

    if (!isOpen) return null;

    const formatDate = (d?: Date) => (d ? d.toISOString().split("T")[0] : "");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === "birthDate" || name === "deathDate") {
            setFormData(prev => ({ ...prev, [name]: value ? new Date(value) : undefined }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newPerson: Person = { ...formData, id: crypto.randomUUID() };
        onSubmit(newPerson);

        setFormData({
            id: "",
            firstName: "",
            lastName: "",
            birthDate: new Date(),
            deathDate: undefined,
            birthPlace: "",
            deathPlace: "",
            description: ""
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[1000] flex justify-center items-center">
            <div className="bg-white p-5 rounded-lg w-80 shadow-xl">
                <h3 className="text-lg font-semibold mb-4">Ajouter une personne</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        name="firstName"
                        placeholder="Prénom"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full p-2 mb-3 border border-gray-300 rounded-md outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                        name="lastName"
                        placeholder="Nom"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full p-2 mb-3 border border-gray-300 rounded-md outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                        name="birthDate"
                        type="date"
                        value={formatDate(formData.birthDate)}
                        onChange={handleChange}
                        required
                        className="w-full p-2 mb-3 border border-gray-300 rounded-md outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                        name="deathDate"
                        type="date"
                        value={formatDate(formData.deathDate)}
                        onChange={handleChange}
                        className="w-full p-2 mb-3 border border-gray-300 rounded-md outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <textarea
                        name="description"
                        placeholder="Brève description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-2 mb-3 border border-gray-300 rounded-md h-16 outline-none resize-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="flex justify-between mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3 py-2 bg-gray-300 hover:bg-gray-400 rounded-md transition"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                        >
                            Ajouter
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
