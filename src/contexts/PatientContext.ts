import { createContext } from "react";
import type { TypePatient } from "@/types/TypePatient";

export type PatientContextType = {
    patients: TypePatient[];
    setPatients: React.Dispatch<React.SetStateAction<TypePatient[]>>;
    refreshPatients: () => Promise<void>;
    loading: boolean;
}

export const PatientContext = createContext<PatientContextType | null>(null)