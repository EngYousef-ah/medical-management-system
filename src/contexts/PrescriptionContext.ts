import { createContext } from "react";
import type { TypePrescription } from "@/types/TypePrescription";
export type PrescriptionContextType = {
    prescriptions: TypePrescription[];
    setPrescriptions: React.Dispatch<React.SetStateAction<TypePrescription[]>>;
    refreshPrescriptions: () => Promise<void>;
    loading: boolean;
}

export const PrescriptionContext = createContext<PrescriptionContextType | null>(null);

