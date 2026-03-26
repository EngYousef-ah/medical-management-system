import { createContext } from "react";
import type { TypeMedicalRecord } from "@/types/TypeMedicalRecord";

export type TypeMedicalRecordType= {
    records:TypeMedicalRecord[];
    setRecords:React.Dispatch<React.SetStateAction<TypeMedicalRecord[]>>;
    refreshRecords:()=>Promise<void>;
    loading:boolean;
}

export const MedicalRecordContext=createContext<TypeMedicalRecordType | null>(null);